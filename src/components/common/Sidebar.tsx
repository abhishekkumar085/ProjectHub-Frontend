import { NavLink } from "react-router-dom";
import { sidebarMenu } from "../../utils/sidebarMenu";

interface SidebarProps {
  collapsed: boolean;
}

function Sidebar({ collapsed }: SidebarProps) {
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
      className={`sticky top-0 z-10 h-screen shrink-0 overflow-y-auto border-r border-slate-800 bg-slate-950 text-white transition-all duration-300 ${collapsed ? "w-24" : "w-64"
        }`}
    >
      {/* Top Section */}
      <div className="flex h-20 items-center justify-start border-b border-slate-800 px-5">
        {collapsed ? (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white shadow-sm">
            PH
          </div>
        ) : (
          <h1 className="ml-3 bg-linear-to-r from-blue-400 to-indigo-500 bg-clip-text text-2xl font-bold text-transparent">
            ProjectHub
          </h1>
        )}
      </div>

      {/* Menu */}
      <nav className="mt-4 flex flex-col gap-2 px-3">
        {filteredMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center ${collapsed ? "justify-center" : "justify-start"} gap-4 rounded-2xl px-4 py-3 transition-all duration-300 ${isActive
                ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`
            }
          >
            <span className="flex items-center justify-center text-xl">
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