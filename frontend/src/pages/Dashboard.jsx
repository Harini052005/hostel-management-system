
import "./dashboard.css";

const Dashboard = () => {
  return (
    
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">
          Smart Hostel System
        </h1>

        <button className="login-btn">
          Login
        </button>
      </nav>

      {/* Main Content */}
      <main className="p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Dashboard
        </h2>
        <p className="text-gray-600 mb-8">
          Welcome! Please login to access hostel services.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="card-title">Report Issue</h3>
            <p className="card-text">
              Report hostel or room-related issues easily.
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">View Announcements</h3>
            <p className="card-text">
              Stay updated with hostel notices.
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">Track Issues</h3>
            <p className="card-text">
              Check the status of your reported issues.
            </p>
          </div>
        </div>
      </main>
      
    </div>
  );
 
};

export default Dashboard;
