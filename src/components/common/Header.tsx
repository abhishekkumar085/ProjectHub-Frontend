import { useState, useRef, useEffect } from "react";
import { User, ChevronDown } from "lucide-react";
import { FiMenu } from "react-icons/fi";
import toggleImg from "../../assets/Toggle-img.png";

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
  onMobileOpen?: () => void;
}

function Header({ collapsed, onToggle, onMobileOpen }: HeaderProps) {
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
    <header className="sticky top-0 z-20 flex w-full h-16 sm:h-20 items-center justify-between bg-white px-3 sm:px-4 md:px-6">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile hamburger - visible only on small screens */}
        <button
          onClick={onMobileOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0059FF] transition hover:bg-blue-50 lg:hidden"
          aria-label="Open sidebar"
        >
          <FiMenu size={20} />
        </button>

        {/* Desktop toggle - hidden on mobile */}
        <button
          onClick={onToggle}
          className="hidden lg:flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0059FF] transition hover:bg-blue-50"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <FiMenu size={20} />
          ) : (
            <img
              src={toggleImg}
              alt="Toggle"
              className="h-8 w-8 object-contain"
            />
          )}
        </button>
        <h2 className="hidden sm:block text-sm font-medium text-gray-800 font-[Poppins]">
          Welcome, <span className="text-[#0059FF]">Admin User</span>
        </h2>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 sm:gap-2 rounded-md px-2 sm:px-3 py-2 transition"
        >
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gray-200">
            <User size={18} className="text-gray-700 sm:hidden" />
            <User size={20} className="text-gray-700 hidden sm:block" />
          </div>

          <span className="hidden sm:inline text-sm font-medium text-gray-700">Admin</span>

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
