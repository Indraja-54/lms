import React from "react";
import { Link, Outlet } from "react-router-dom";
import { LayoutDashboard, LibrarySquare } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="flex">
      <div className="w-[250px] fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-gray-100 border-r border-gray-200 p-6 shadow-md z-30">
        <h2 className="text-2xl font-bold mb-10 text-gray-800">Admin Panel</h2>
        <nav className="space-y-4">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
          >
            <LayoutDashboard size={22} className="text-gray-600 group-hover:text-blue-600" />
            <span className="text-lg text-gray-700 group-hover:text-blue-600 font-medium">Dashboard</span>
          </Link>
          <Link
            to="/admin/course"
            className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
          >
            <LibrarySquare size={22} className="text-gray-600 group-hover:text-blue-600" />
            <span className="text-lg text-gray-700 group-hover:text-blue-600 font-medium">Courses</span>
          </Link>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-[250px] w-full pt-20 px-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
