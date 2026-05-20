import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar collapsed={collapsed} />

      <div className="flex flex-1 min-h-0 flex-col">
        <Header collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />

        <main className="flex-1 min-h-0 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;