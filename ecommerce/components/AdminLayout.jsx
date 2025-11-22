import AdminNavbar from "./AdminNavbar";

function AdminLayout({ children }) {
    console.log("children----->",children)
  return (
    <div className="min-h-screen flex flex-col ">
      <AdminNavbar />
      <main className="">
        {children}
      </main>
    </div>  
  );
}

export default AdminLayout;
