import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";

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
    path: "/novo-usuario",
    element: <RegisterPage />,
  },
  {
    path: "/esqueceu-senha",
    element: <ForgotPasswordPage />,
  },
];

