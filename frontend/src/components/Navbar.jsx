import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <Link
          to={user?.role === "student" ? "/dashboard" : "/admin/dashboard"}
          className="text-xl font-bold text-indigo-600"
        >
          Hostel Management
        </Link>

        {user && user.role === "student" && (
          <>
            <Link to="/report-issue" className="text-sm text-gray-700 hover:text-indigo-600">
              Report New Issue
            </Link>
            <Link to="/report-lostfound" className="text-sm text-gray-700 hover:text-indigo-600">
              Report Lost/Found
            </Link>
            <Link to="/lost-found" className="text-sm text-gray-700 hover:text-indigo-600">
              Lost & Found
            </Link>
            <Link to="/issues" className="text-sm text-gray-700 hover:text-indigo-600">
              My Issues
            </Link>
          </>
        )}

        {user && (user.role === "admin" || user.role === "warden") && (
          <>
            <Link to="/admin/dashboard" className="text-sm text-gray-700 hover:text-indigo-600">
              Admin Panel
            </Link>
            <Link to="/issues" className="text-sm text-gray-700 hover:text-indigo-600">
              Manage Issues
            </Link>
            <Link to="/admin/announcements" className="text-sm text-gray-700 hover:text-indigo-600">
              Create Announcement
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {user && <span className="text-sm text-gray-600">Hi, {user.name}</span>}
        {user && (
          <button
            onClick={handleLogout}
            className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
