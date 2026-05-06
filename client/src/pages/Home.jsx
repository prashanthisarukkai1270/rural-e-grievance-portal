import { Link } from 'react-router-dom';
import { FileText, Search, ShieldCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-12 pb-8">
      {/* Hero Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="px-6 py-16 md:py-24 max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-secondary text-sm font-semibold mb-6 border border-blue-100">
            Government of India Initiative Replica
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-6 leading-tight">
            Rural E-Grievance Portal
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            A centralized, transparent, and efficient platform for citizens to lodge, track, and monitor their grievances related to public services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/submit" className="bg-primary text-white hover:bg-blue-800 px-8 py-3.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all text-lg">
              Lodge Public Grievance
            </Link>
            <Link to="/track" className="bg-white text-primary border-2 border-primary hover:bg-blue-50 px-8 py-3.5 rounded-lg font-medium transition-all text-lg">
              Track Grievance Status
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 lg:gap-8">
        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md border border-gray-100 text-center transition-shadow">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform hover:scale-110">
            <FileText className="h-8 w-8 text-secondary" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-800">Easy Submission</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Register securely and submit your grievance online. Add required details and precise location for faster processing.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md border border-gray-100 text-center transition-shadow">
          <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform hover:scale-110">
            <Search className="h-8 w-8 text-accent" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-800">Track Progress</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Use your unique Grievance ID to track the real-time status and view remarks assigned by the concerned officials.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md border border-gray-100 text-center transition-shadow">
          <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform hover:scale-110">
            <ShieldCheck className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-800">Assured Resolution</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Administered directly by authorized personnel to ensure every problem is heard, documented, and addressed efficiently.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
