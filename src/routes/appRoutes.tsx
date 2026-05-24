import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { LoginPage } from "../pages/auth/LoginPage";
import { PrivateRoute } from "./PrivateRoute";
import { privateRoutes } from "./privateRoutes";

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <PrivateRoute />,
    children: privateRoutes,
  },
];

