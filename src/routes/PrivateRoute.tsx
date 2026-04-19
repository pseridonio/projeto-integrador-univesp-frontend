import { Navigate } from "react-router-dom";
import { PrivateLayout } from "../layouts/PrivateLayout";

export function PrivateRoute() {
  const isAuthenticated = Boolean(localStorage.getItem("authToken"));

  return isAuthenticated ? <PrivateLayout /> : <Navigate to="/login" replace />;
}
