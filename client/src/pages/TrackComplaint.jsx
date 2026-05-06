import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Search, Clock, CheckCircle, AlertCircle, Calendar, MapPin, Tag, Info, ThumbsUp } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const TrackComplaint = () => {
  const [grievanceId, setGrievanceId] = useState('');
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      setGrievanceId(id);
      handleSearch(id);
    }
  }, [location]);

  const handleSearch = async (idToSearch = grievanceId) => {
    if (!idToSearch.trim()) {
      toast.error('Please enter a Grievance ID');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const { data } = await axios.get(`/api/grievance/${idToSearch}`);
      setGrievance(data);
    } catch (error) {
      setGrievance(null);
      if (error.response?.status === 404) {
        toast.error('Grievance not found. Please check the ID.');
      } else {
        toast.error('Failed to retrieve grievance status.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!grievance) return;
    try {
      const tokenString = localStorage.getItem('userInfo');
      const headers = {};
      if (tokenString) {
        headers.Authorization = `Bearer ${JSON.parse(tokenString).token}`;
      }
      
      const { data } = await axios.put(`/api/grievance/${grievance._id}/upvote`, {}, { headers });
      setGrievance(prev => ({ ...prev, votes: data.votes }));
      toast.success('Vote counted!');
    } catch (error) {
      toast.error('Failed to upvote');
    }
  };

  const getStatusBadge = (status, size = 'sm') => {
    const styles = {
      Pending: { bg: 'bg-amber-100', text: 'text-amber-800', icon: <Clock className={`w-${size === 'lg' ? '5' : '4'} h-${size === 'lg' ? '5' : '4'}`} /> },
      'In Progress': { bg: 'bg-blue-100', text: 'text-blue-800', icon: <AlertCircle className={`w-${size === 'lg' ? '5' : '4'} h-${size === 'lg' ? '5' : '4'}`} /> },
      Resolved: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className={`w-${size === 'lg' ? '5' : '4'} h-${size === 'lg' ? '5' : '4'}`} /> }
    };
    
    const s = styles[status] || styles.Pending;
    const px = size === 'lg' ? 'px-4' : 'px-3';
    const py = size === 'lg' ? 'py-2' : 'py-1';
    const textSz = size === 'lg' ? 'text-sm' : 'text-xs';
    
    return (
      <span className={`inline-flex items-center gap-1.5 ${px} ${py} rounded-full ${textSz} font-bold tracking-wide ${s.bg} ${s.text} shadow-sm border border-${s.text.split('-')[1]}-200`}>
        {s.icon} {status.toUpperCase()}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="inline-block px-2.5 py-1 text-xs rounded border border-red-200 bg-red-50 text-red-600 font-bold uppercase tracking-wider">High Priority</span>;
      case 'Medium':
        return <span className="inline-block px-2.5 py-1 text-xs rounded border border-orange-200 bg-orange-50 text-orange-600 font-bold uppercase tracking-wider">Medium Priority</span>;
      case 'Low':
      default:
        return <span className="inline-block px-2.5 py-1 text-xs rounded border border-green-200 bg-green-50 text-green-600 font-bold uppercase tracking-wider">Low Priority</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 animate-fadeIn">
      {/* Search Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <h2 className="text-3xl font-extrabold text-primary mb-3 relative z-10">Track Your Grievance</h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto relative z-10">Enter your 10-character unique tracking number generated during the grievance registration process.</p>
        
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3 relative z-10">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={grievanceId}
              onChange={(e) => setGrievanceId(e.target.value)}
              placeholder="e.g. GRV-1234-567890"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none text-base font-medium font-mono uppercase transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-secondary hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl shadow-md transition-all hover:-translate-y-0.5 flex-none"
          >
            {loading ? 'Searching...' : 'Track Now'}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {searched && !loading && (
        <div className={`transition-all duration-500 ${grievance ? 'opacity-100 translate-y-0' : 'opacity-100'}`}>
          {grievance ? (
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">Tracking ID</h3>
                  <p className="text-2xl font-bold font-mono text-primary">{grievance.grievanceId}</p>
                </div>
                <div className="flex gap-3 items-center">
                  {getPriorityBadge(grievance.priority || 'Low')}
                  {getStatusBadge(grievance.status, 'lg')}
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2"><Tag className="w-4 h-4 text-secondary" /> Issue Details</h4>
                      <p className="text-lg font-semibold text-gray-900 leading-tight mb-2">{grievance.title}</p>
                      <div className="flex items-center gap-3">
                         <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded font-medium">{grievance.category}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2"><AlignLeft className="w-4 h-4 text-secondary" /> Description</h4>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 text-sm whitespace-pre-wrap leading-relaxed shadow-inner">
                        {grievance.description}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        <div>
                           <p className="text-sm font-bold text-gray-800">Support this Grievance</p>
                           <p className="text-xs text-gray-500">Votes help prioritize issues.</p>
                        </div>
                        <button 
                          onClick={handleUpvote}
                          className="flex items-center gap-2 bg-white hover:bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors shadow-sm font-bold"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{grievance.votes || 0} Votes</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                      <h4 className="text-sm font-bold text-gray-800 mb-4 border-b border-blue-200 pb-2">Information & Status</h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-none" />
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Location</p>
                            <p className="font-medium text-gray-800 text-sm">{grievance.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-none" />
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Submitted On</p>
                            <p className="font-medium text-gray-800 text-sm">{format(new Date(grievance.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
                          </div>
                        </div>

                        {grievance.userId && (
                          <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-gray-400 mt-0.5 flex-none" />
                            <div>
                              <p className="text-xs text-gray-500 font-semibold uppercase">Filed By</p>
                              <p className="font-medium text-gray-800 text-sm">{grievance.userId.name || 'Citizen'}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-amber-50 rounded-xl border border-amber-200 p-5 shadow-sm">
                      <h4 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2"><FileText className="w-4 h-4" /> Official Remarks</h4>
                      <p className="text-amber-800 text-sm font-medium leading-relaxed bg-amber-100/50 p-3 rounded-lg border border-amber-200/50">
                        {grievance.remarks || 'No remarks added yet. Status will be updated by the concerned officer soon.'}
                      </p>
                      
                      {grievance.updatedAt !== grievance.createdAt && (
                        <p className="text-xs text-amber-700/70 mt-3 font-semibold text-right">
                          Last Updated: {format(new Date(grievance.updatedAt), 'dd MMM yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100" />
          )}
        </div>
      )}
    </div>
  );
};

// Simple helper component for icons that isn't imported
const AlignLeft = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>
);

const FileText = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
);

export default TrackComplaint;
