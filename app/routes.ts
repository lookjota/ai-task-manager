import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  
  layout("layouts/layouts.tsx", [
    index("routes/dashboard.tsx"),
    route("tasks", "routes/tasks.tsx")
  ])
] satisfies RouteConfig;

