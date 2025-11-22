import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function AdminNavbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="fixed left-0 right-0 bg-gray-900 text-white py-3 flex justify-around items-center shadow-lg">
      <NavLink
        to="/admin/products"
        onClick={handleLinkClick}
        className={({ isActive }) =>
          isActive ? "text-blue-400 font-semibold" : "text-white"
        }
      >
        products
      </NavLink>

      <NavLink
        to="/admin/create/products"
        onClick={handleLinkClick}
        className={({ isActive }) =>
          isActive ? "text-blue-400 font-semibold" : "text-white"
        }
      >
        create Category
      </NavLink>

      <NavLink
        to="/admin/home"
        onClick={handleLinkClick}
        className={({ isActive }) =>
          isActive ? "text-blue-400 font-semibold" : "text-white"
        }
      >
        Home
      </NavLink>
    </div>
  );
}

export default AdminNavbar;
