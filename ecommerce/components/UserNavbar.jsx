import React, { useState } from "react";
import { NavLink } from "react-router";

function UserNavbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="fixed left-0 right-0 bg-gray-900 text-white py-3 flex justify-around items-center shadow-lg z-10">
      <NavLink
        to="/user/home"
        onClick={handleLinkClick}
        className={({ isActive }) =>
          isActive ? "text-blue-400 font-semibold" : "text-white"
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/user/cart"
        onClick={handleLinkClick}
        className={({ isActive }) =>
          isActive ? "text-blue-400 font-semibold" : "text-white"
        }
      >
        cart
      </NavLink>

      <NavLink
        to="/user/orders"
        onClick={handleLinkClick}
        className={({ isActive }) =>
          isActive ? "text-blue-400 font-semibold" : "text-white"
        }
      >
        Order
      </NavLink>
    </div>
  );
}

export default UserNavbar;
