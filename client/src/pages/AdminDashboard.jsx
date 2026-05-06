import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Search, Filter, RefreshCcw, Save, ThumbsUp } from 'lucide-react';

const AdminDashboard = () => {
  const [grievances, setGrievances] = useState([]);
  const [filteredGrievances, setFilteredGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  
  // For editing
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editRemarks, setEditRemarks] = useState('');

  const { user } = useContext(AuthContext);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const { data } = await axios.get('/api/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGrievances(data);
      setFilteredGrievances(data);
    } catch (error) {
      toast.error('Failed to load grievances');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchGrievances();
    }
  }, [user]);

  useEffect(() => {
    let result = [...grievances];
    
    if (filter !== 'All') {
      result = result.filter(g => g.status === filter);
    }
    
    if (searchTerm) {
      result = result.filter(g => 
        g.grievanceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (sortBy === 'Votes') {
      result = result.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    } else {
      result = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    setFilteredGrievances(result);
  }, [filter, searchTerm, sortBy, grievances]);

  const handleUpdate = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      await axios.put(`/api/grievance/${id}`, 
        { status: editStatus, remarks: editRemarks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Grievance updated successfully');
      setEditingId(null);
      fetchGrievances();
    } catch (error) {
      toast.error('Failed to update grievance');
    }
  };

  const startEdit = (g) => {
    setEditingId(g._id);
    setEditStatus(g.status);
    setEditRemarks(g.remarks || '');
  };

  if (loading && grievances.length === 0) {
    return <div className="text-center py-20 text-gray-500">Loading admin panel...</div>;
  }

  // Analytics
  const stats = {
    total: grievances.length,
    pending: grievances.filter(g => g.status === 'Pending').length,
    inProgress: grievances.filter(g => g.status === 'In Progress').length,
    resolved: grievances.filter(g => g.status === 'Resolved').length,
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="inline-block mb-1 px-2 py-0.5 text-xs rounded border border-red-200 bg-red-50 text-red-600 font-bold">High Priority</span>;
      case 'Medium':
        return <span className="inline-block mb-1 px-2 py-0.5 text-xs rounded border border-orange-200 bg-orange-50 text-orange-600 font-bold">Medium Priority</span>;
      case 'Low':
      default:
        return <span className="inline-block mb-1 px-2 py-0.5 text-xs rounded border border-green-200 bg-green-50 text-green-600 font-bold">Low Priority</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Control Panel</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and resolve citizen grievances across the region.</p>
        </div>
        <button onClick={fetchGrievances} className="flex items-center gap-2 text-primary hover:text-blue-800 font-medium bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-blue-100">
          <RefreshCcw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full z-0"></div>
          <p className="text-sm font-semibold text-gray-500 relative z-10">Total</p>
          <p className="text-3xl font-bold text-gray-800 mt-1 relative z-10">{stats.total}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-amber-400 border-t-gray-100 border-r-gray-100 border-b-gray-100 flex flex-col items-center justify-center">
          <p className="text-sm font-semibold text-amber-600">Pending</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-blue-400 border-t-gray-100 border-r-gray-100 border-b-gray-100 flex flex-col items-center justify-center">
          <p className="text-sm font-semibold text-blue-600">In Progress</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{stats.inProgress}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-green-400 border-t-gray-100 border-r-gray-100 border-b-gray-100 flex flex-col items-center justify-center">
          <p className="text-sm font-semibold text-green-600">Resolved</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{stats.resolved}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search ID, title, location..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg py-2 px-3 outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            
            <select
              className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg py-2 px-3 outline-none focus:ring-1 focus:ring-primary cursor-pointer ml-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Newest">Sort: Newest</option>
              <option value="Votes">Sort: Most Votes</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-200 shadow-sm">
              <tr>
                <th className="px-5 py-4 font-bold">Details</th>
                <th className="px-5 py-4 font-bold">Contact / Location</th>
                <th className="px-5 py-4 font-bold">Current Status</th>
                <th className="px-5 py-4 font-bold">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredGrievances.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No grievances match your criteria.
                  </td>
                </tr>
              ) : (
                filteredGrievances.map((g) => (
                  <tr key={g._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 align-top">
                      {getPriorityBadge(g.priority || 'Low')}
                      <div className="font-mono text-xs font-bold text-primary mb-1">{g.grievanceId}</div>
                      <div className="font-semibold text-gray-800 text-sm mb-1">{g.title}</div>
                      <div className="text-xs text-gray-500 max-w-xs line-clamp-2">{g.description}</div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="text-xs font-medium text-gray-400">{format(new Date(g.createdAt), 'dd MMM yyyy')}</div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          <ThumbsUp className="w-3 h-3" /> {g.votes || 0}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-5 py-4 align-top">
                      <div className="font-medium text-gray-800 mb-1">{g.userId?.name || 'Citizen'}</div>
                      <div className="text-xs text-gray-500 mb-2">{g.userId?.phoneNumber}</div>
                      <div className="inline-block bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600 max-w-[150px] truncate" title={g.location}>
                        {g.location}
                      </div>
                    </td>
                    
                    <td className="px-5 py-4 align-top">
                      {editingId === g._id ? (
                        <select 
                          value={editStatus} 
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="w-full bg-white border border-blue-300 rounded text-sm px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 mb-2"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          g.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                          g.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {g.status}
                        </span>
                      )}
                      
                      <div className="mt-2">
                        {editingId === g._id ? (
                          <textarea
                            value={editRemarks}
                            onChange={(e) => setEditRemarks(e.target.value)}
                            placeholder="Add official remarks..."
                            className="w-full text-xs border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                            rows="2"
                          />
                        ) : (
                          <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100 line-clamp-2">
                            {g.remarks || 'No remarks'}
                          </p>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-5 py-4 align-top text-right">
                      {editingId === g._id ? (
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => handleUpdate(g._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                          >
                            <Save className="w-3 h-3" /> Save
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => startEdit(g)}
                          className="border border-secondary text-secondary hover:bg-secondary hover:text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                        >
                          Update Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
