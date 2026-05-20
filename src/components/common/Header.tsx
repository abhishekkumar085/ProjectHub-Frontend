function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800">
        Project Hub
      </h1>

      <button
        className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </header>
  );
}

export default Header;