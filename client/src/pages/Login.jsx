import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!phoneNumber || !password) {
      toast.error('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const { success, message } = await login(phoneNumber, password);
    
    if (success) {
      toast.success('Login successful!');
    } else {
      toast.error(message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2 text-sm">Sign in to lodge or track your grievances</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (OTP Mock)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter 10 digit number"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none text-sm transition-all"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none text-sm transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 mt-4 rounded-lg font-medium text-white bg-primary hover:bg-blue-800 transition-colors shadow-md flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Not registered yet? <Link to="/register" className="text-secondary font-semibold hover:text-primary transition-colors hover:underline">Register Now</Link>
        </div>
        
        <div className="mt-8 bg-blue-50/50 border border-blue-100 p-4 rounded-lg text-xs text-gray-600">
          <p className="font-semibold text-primary mb-1 text-sm">Demo Admin Credentials:</p>
          <div className="flex justify-between items-center mt-2">
            <span>Phone: <span className="font-mono text-gray-800 bg-white px-1 py-0.5 rounded border">0000000000</span></span>
            <span>Pass: <span className="font-mono text-gray-800 bg-white px-1 py-0.5 rounded border">admin</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
