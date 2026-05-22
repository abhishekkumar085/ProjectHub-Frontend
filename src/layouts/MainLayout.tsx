import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-1 min-h-0 min-w-0 flex-col">
        <Header
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
          onMobileOpen={() => setMobileOpen(true)}
        />

        <main className="flex-1 min-h-0 overflow-y-auto bg-[#FAFAFA] p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
