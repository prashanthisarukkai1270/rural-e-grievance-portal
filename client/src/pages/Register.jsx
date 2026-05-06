import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', phoneNumber: '', email: '', address: '', village: '', password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!formData.name || !formData.phoneNumber || !formData.address || !formData.village || !formData.password) {
      toast.error('Please fill in all mandatory fields');
      setIsLoading(false);
      return;
    }

    const { success, message } = await register(formData);
    
    if (success) {
      toast.success('Registration successful!');
    } else {
      toast.error(message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center py-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Citizen Registration</h2>
          <p className="text-gray-500 mt-2 text-sm">Register to lodge grievances seamlessly</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" name="name" onChange={handleChange} value={formData.name} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none text-sm" placeholder="e.g. Rahul Sharma" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input type="text" name="phoneNumber" onChange={handleChange} value={formData.phoneNumber} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none text-sm" placeholder="10-digit mobile number" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Optional)</label>
              <input type="email" name="email" onChange={handleChange} value={formData.email} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none text-sm" placeholder="name@example.com" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address *</label>
              <textarea name="address" rows="2" onChange={handleChange} value={formData.address} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none text-sm resize-none" placeholder="House no, Street area, pincode"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Village/Gram Panchayat *</label>
              <input type="text" name="village" onChange={handleChange} value={formData.village} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none text-sm" placeholder="e.g. Rampur" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input type="password" name="password" onChange={handleChange} value={formData.password} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none text-sm" placeholder="Create a strong password" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className={`w-full py-3 mt-4 rounded-lg font-medium text-white bg-primary hover:bg-blue-800 transition-colors shadow-md ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {isLoading ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-secondary font-semibold hover:text-primary transition-colors hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
