import type { RouteObject } from "react-router-dom";

import { DashboardPage } from "../pages/dashboard/Dashboard";
import { OrderPage } from "../pages/orders/Order";
import { OrderDetailPage } from "../pages/orders/OrderDetail";
import { NewOrderPage } from "../pages/orders/NewOrder";
import { ProductPage } from "../pages/products/Product";
import { NewProductPage } from "../pages/products/NewProduct";

export const privateRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/orders",
    element: <OrderPage />,
  },
  {
    path: "/orders/:id",
    element: <OrderDetailPage />,
  },
  {
    path: "/orders/new",
    element: <NewOrderPage />,
  },
  {
    path: "/products",
    element: <ProductPage />,
  },
  {
    path: "/products/new",
    element: <NewProductPage />,
  },
];
