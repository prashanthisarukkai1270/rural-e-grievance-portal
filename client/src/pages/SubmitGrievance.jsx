import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FileText, MapPin, Tag, Type, Mic, MicOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SubmitGrievance = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Others',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const categories = ['Road', 'Water', 'Electricity', 'Sanitation', 'Health', 'Others'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in this browser.');
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = i18n.language === 'en' ? 'en-US' : (i18n.language === 'ta' ? 'ta-IN' : 'hi-IN');
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({
        ...prev,
        description: prev.description ? prev.description + ' ' + transcript : transcript
      }));
    };
    
    recognition.onerror = (event) => {
      setIsListening(false);
      toast.error('Microphone error: ' + event.error);
    };
    
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.title || !formData.description || !formData.location) {
      toast.error('Please fill in all mandatory fields');
      setIsLoading(false);
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const { data } = await axios.post(
        '/api/grievance',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Grievance lodged successfully!');
      navigate(`/track?id=${data.grievanceId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit grievance');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-800">{t('Lodge New Grievance')}</h2>
          <p className="text-gray-500 text-sm mt-1">Please provide accurate details for faster resolution.</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('Issue Title')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Type className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none text-sm transition-all"
                  placeholder="Brief title of the issue (e.g., Broken water pipe)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('Category')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none text-sm appearance-none transition-all cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('Precise Location')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none text-sm transition-all"
                    placeholder="Landmark or precise area"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">{t('Detailed Description')}</label>
                <button 
                  type="button" 
                  onClick={startListening}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-50 text-secondary hover:bg-blue-100'}`}
                >
                  {isListening ? <><MicOff className="w-3.5 h-3.5" /> Listening...</> : <><Mic className="w-3.5 h-3.5" /> Voice Input</>}
                </button>
              </div>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none text-sm resize-none transition-all"
                  placeholder="Please describe the issue in detail. Include timestamps or historical context if applicable."
                ></textarea>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 rounded-lg font-bold text-white bg-primary hover:bg-blue-800 transition-colors shadow-md flex justify-center items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
              >
                {isLoading ? 'Submitting...' : t('Submit Grievance')}
              </button>
            </div>
            <p className="text-center text-xs text-gray-500 mt-4">By submitting this form, you affirm that the information provided is accurate and true to your knowledge.</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitGrievance;
