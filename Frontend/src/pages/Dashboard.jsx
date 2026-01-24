import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "40px" }}>
      <Navbar/>
      <h1>Dashboard</h1>
      <p>You are logged in 🎉</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
