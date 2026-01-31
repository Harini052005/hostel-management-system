import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "./Navbar";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  return user ? (
    <div>
      <Navbar />
      <div className="mt-4">{children}</div>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
