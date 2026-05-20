import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiMenu,
  FiChevronLeft,
} from "react-icons/fi";

import { sidebarMenu } from "../../utils/sidebarMenu";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const user = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const userRole = user.role;


  const filteredMenu = sidebarMenu.filter(
  (item) =>
    item.roles.includes(userRole)
);

  return (
    <aside
      className={`relative h-screen border-r border-slate-800 bg-slate-950 text-white transition-all duration-300 ${
        collapsed ? "w-22" : "w-64"
      }`}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5">
        {!collapsed && (
          <h1 className="bg-linear-to-r from-blue-400 to-indigo-500 bg-clip-text text-2xl font-bold text-transparent">
            ProjectHub
          </h1>
        )}

        <button
          onClick={() =>
            setCollapsed(!collapsed)
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
        >
          {collapsed ? (
            <FiMenu size={20} />
          ) : (
            <FiChevronLeft size={20} />
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-4 flex flex-col gap-2 px-3">
      {filteredMenu.map((item) => (
  <NavLink
    key={item.path}
    to={item.path}
    className={({ isActive }) =>
      `group flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-300 ${
        isActive
          ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
          : "text-slate-400 hover:bg-slate-900 hover:text-white"
      }`
    }
  >
    <span className="text-xl">
      {item.icon}
    </span>

    {!collapsed && (
      <span className="whitespace-nowrap font-medium">
        {item.label}
      </span>
    )}
  </NavLink>
))}
      </nav>
    </aside>
  );
}

export default Sidebar;