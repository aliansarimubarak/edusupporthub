import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const { logout } = useAuth();

  const navItems = [
    { to: "/admin", label: "Overview" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/orders", label: "Orders" },
    { to: "/admin/disputes", label: "Disputes" },
    { to: "/admin/analytics", label: "Analytics" },
    { to: "/admin/content", label: "Content" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <div className="text-lg font-bold text-indigo-600">
              Edu<span className="text-slate-900">SupportHub</span>
            </div>
            <span className="hidden text-xs text-slate-500 sm:inline">
              Admin Panel
            </span>
          </div>

          <nav className="hidden items-center gap-3 text-xs font-medium text-slate-700 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "rounded px-2 py-1 transition",
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "hover:bg-slate-100 hover:text-indigo-600",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={logout}
            className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
