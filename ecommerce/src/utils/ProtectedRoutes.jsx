import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router";
import api from "../../services/api";
import Loader from "../../components/Loader";

const ProtectedRoutes = () => {
  const [authenticated, setAuthenticated] = useState(null); // null = loading state
 
  useEffect(() => {
    async function checkUser() {
      try {
        const response = await api.isAuthenticated();
        console.log("response --->", response.success);
        setAuthenticated(response.success);
      } catch (error) {
        console.error("Error checking auth:", error);
        setAuthenticated(false);
      }
    }

    checkUser();
  }, []);

  if (authenticated === null) {
    return <Loader/>
  }

  return authenticated ? <Outlet /> : <Navigate to="/auth" />;
};

export default ProtectedRoutes;
