import { useState, useRef, useEffect } from "react";
import { User, ChevronDown } from "lucide-react";
import { FiMenu, FiChevronLeft } from "react-icons/fi";

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

function Header({ collapsed, onToggle }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-20 flex w-full h-20 items-center justify-between bg-white px-6 border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <FiMenu size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 rounded-md px-3 py-2 transition"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
            <User size={20} className="text-gray-700" />
          </div>

          <span className="text-sm font-medium text-gray-700">
            Admin
          </span>

          <ChevronDown size={16} className="text-gray-500" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-xl">
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;