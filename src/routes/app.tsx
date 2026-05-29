import { Outlet, createFileRoute } from "@tanstack/react-router";
import AppNavbar from "#/features/components/AppNavbar";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="d-flex flex-column vh-100 overflow-hidden">
      <AppNavbar />
      <main className="flex-grow-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
