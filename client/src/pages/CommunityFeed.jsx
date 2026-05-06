import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { ThumbsUp, AlertCircle, Clock, CheckCircle, Tag, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CommunityFeed = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const fetchGrievances = async () => {
    try {
      const { data } = await axios.get('/api/grievance/public');
      setGrievances(data);
    } catch (error) {
      toast.error('Failed to load community feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleUpvote = async (id) => {
    try {
      const tokenString = localStorage.getItem('userInfo');
      const headers = {};
      if (tokenString) {
        headers.Authorization = `Bearer ${JSON.parse(tokenString).token}`;
      }
      
      const { data } = await axios.put(`/api/grievance/${id}/upvote`, {}, { headers });
      setGrievances((prev) =>
        prev.map((g) => (g._id === id ? { ...g, votes: data.votes } : g))
      );
      toast.success('Vote counted!');
    } catch (error) {
      toast.error('Failed to upvote');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3 h-3" /> {status}</span>;
      case 'In Progress':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><AlertCircle className="w-3 h-3" /> {status}</span>;
      case 'Resolved':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3" /> {status}</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="px-2 py-0.5 text-xs rounded border border-red-200 bg-red-50 text-red-600 font-bold">High Priority</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 text-xs rounded border border-orange-200 bg-orange-50 text-orange-600 font-bold">Medium Priority</span>;
      case 'Low':
      default:
        return <span className="px-2 py-0.5 text-xs rounded border border-green-200 bg-green-50 text-green-600 font-bold">Low Priority</span>;
    }
  };

  if (loading) {
    return <div className="text-center py-20 animate-pulse text-gray-500">Loading Community Feed...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">{t('Community')} Feed</h1>
          <p className="text-gray-500 text-sm mt-1">Discover, support, and upvote public grievances from your community.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {grievances.map((g) => (
          <div key={g._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs font-mono text-primary font-bold bg-blue-50 px-2 py-1 rounded">{g.grievanceId}</span>
              </div>
              <div className="flex gap-2">
                {getPriorityBadge(g.priority || 'Low')}
                {getStatusBadge(g.status)}
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{g.title}</h3>
            
            <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">{g.description}</p>
            
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4 border-t border-gray-50 pt-4">
              <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {g.category}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {g.location}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {format(new Date(g.createdAt), 'dd MMM yyyy')}</span>
            </div>

            <div className="flex justify-between items-center mt-auto">
              <div className="text-xs font-medium text-gray-400">
                Posted by: <span className="text-gray-700">{g.userId?.name || 'Citizen'}</span>
              </div>
              
              <button 
                onClick={() => handleUpvote(g._id)}
                className="flex items-center gap-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 text-gray-700 hover:text-blue-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                title="Upvote this issue"
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="font-bold text-sm">{g.votes || 0}</span>
              </button>
            </div>
          </div>
        ))}
        {grievances.length === 0 && (
          <div className="col-span-2 text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
            No public grievances available in the community.
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityFeed;
