import { useRoutes } from "react-router-dom";

import { appRoutes } from "./routes";

export function App() {
  return useRoutes(appRoutes);
}

