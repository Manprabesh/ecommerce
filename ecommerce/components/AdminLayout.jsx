import Sidebar from "./AdminNavbar";

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 fixed inset-y-0 left-0">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 bg-gray-50">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
