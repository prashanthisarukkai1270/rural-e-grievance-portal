import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FilePlus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo')).token;
        const { data } = await axios.get(`/api/grievance/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGrievances(data);
      } catch (error) {
        console.error('Error fetching grievances:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchGrievances();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800"><Clock className="w-3.5 h-3.5" /> Pending</span>;
      case 'In Progress':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"><AlertCircle className="w-3.5 h-3.5" /> In Progress</span>;
      case 'Resolved':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800"><CheckCircle className="w-3.5 h-3.5" /> Resolved</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="inline-block px-2 py-0.5 text-[10px] rounded border border-red-200 bg-red-50 text-red-600 font-bold uppercase tracking-wider">High</span>;
      case 'Medium':
        return <span className="inline-block px-2 py-0.5 text-[10px] rounded border border-orange-200 bg-orange-50 text-orange-600 font-bold uppercase tracking-wider">Medium</span>;
      case 'Low':
      default:
        return <span className="inline-block px-2 py-0.5 text-[10px] rounded border border-green-200 bg-green-50 text-green-600 font-bold uppercase tracking-wider">Low</span>;
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Hello, {user.name}. Track and manage your lodged complaints.</p>
        </div>
        <Link to="/submit" className="flex items-center gap-2 bg-primary text-white hover:bg-blue-800 px-5 py-2.5 rounded-lg shadow font-medium transition-all hover:-translate-y-0.5 text-sm">
          <FilePlus className="w-4 h-4" /> Lodge New Grievance
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-semibold text-gray-700">Submitted Grievances History</h2>
        </div>
        
        {grievances.length === 0 ? (
          <div className="p-12 text-center bg-white flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-4 border border-gray-100">
              <FilePlus className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">No grievances found</h3>
            <p className="mt-2 text-gray-500 max-w-sm text-sm">You haven't lodged any complaints yet. If you have an issue, you can register a new grievance.</p>
            <Link to="/submit" className="mt-6 inline-block text-white bg-secondary hover:bg-blue-600 px-6 py-2 rounded-md transition-colors text-sm font-medium">Get Started</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider">Tracking ID</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Issue Details</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Priority</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Date</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {grievances.map((g) => (
                  <tr key={g._id} className="bg-white hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-primary text-xs">{g.grievanceId}</td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-semibold text-gray-800 mb-0.5">{g.category}</div>
                      <div className="text-xs text-gray-500 truncate" title={g.title}>{g.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getPriorityBadge(g.priority || 'Low')}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {format(new Date(g.createdAt), 'dd MMM yyyy, h:mm a')}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(g.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/track?id=${g.grievanceId}`} className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-semibold transition-colors">
                        View Status
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
