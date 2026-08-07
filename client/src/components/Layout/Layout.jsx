import { Outlet, useLocation } from 'react-router-dom';
import SidebarNav from './SidebarNav';

export default function Layout() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col md:flex-row">
      {/* Left Sidebar Navigation */}
      <SidebarNav />

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 min-w-0 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}
