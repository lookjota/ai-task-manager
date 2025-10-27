import { useLocation } from "react-router";

export function useRouteTitle() {
  const location = useLocation();
  
  // Mapeamento de rotas para títulos
  const routeTitles: Record<string, string> = {
    "/": "Dashboard",
    "/dashboard": "Dashboard", 
    "/tasks": "Tasks",
    "/users": "Users"
  };
  
  // Obtém o título baseado no pathname atual
  const title = routeTitles[location.pathname] || "Dashboard";
  
  return title;
} 