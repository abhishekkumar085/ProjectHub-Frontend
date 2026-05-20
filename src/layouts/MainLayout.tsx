import { Outlet } from "react-router-dom";
// @ts-ignore: Sidebar is a JavaScript module without type declarations
import Sidebar from '../components/common/Sidebar.js';
// @ts-ignore: Sidebar is a JavaScript module without type declarations
import Header from '../components/common/Header.js';


function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;