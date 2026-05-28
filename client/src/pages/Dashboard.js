import { Navigate } from "react-router-dom";
import App from "../App";

function Dashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <App />;
}

export default Dashboard;