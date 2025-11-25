import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">

      {/* HEADER */}
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">EduSupportHub</h1>

          <nav className="flex gap-4 text-sm">
            <a href="/" className="hover:text-blue-600">Home</a>
            <a href="/FacultyPage" className="hover:text-blue-600">FacultyPage</a>
            <a href="/about" className="hover:text-blue-600">About</a>
            <a href="/support" className="hover:text-blue-600">Support</a>
            <a href="/login" className="hover:text-blue-600">Login</a>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} EduSupportHub. All rights reserved.
      </footer>

    </div>
  );
};

export default PublicLayout;
