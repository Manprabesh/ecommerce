import React, { useState } from 'react';
import { 
  Home, 
  User, 
  Settings, 
  FileText, 
  Mail, 
  Calendar,
  BarChart,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  LayoutDashboard
} from 'lucide-react';

const Sidebar = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Home, label: 'Home', path: '/admin/home' },
    { icon: BarChart, label: 'Sales', path: '/admin/sales' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: Mail, label: 'Messages', path: '/messages' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className=" "> 
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-700/50 hover:bg-slate-700/80 transition-all"
      >
        <Menu className="w-5 h-5 text-slate-300" />
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-40
          bg-gradient-to-b from-slate-900/95 via-slate-900/98 to-slate-950/95
          backdrop-blur-xl border-r border-slate-800/50
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  DevSpace
                </h1>
                <p className="text-xs text-slate-500">Developer Portal</p>
              </div>
            )}
          </div>
          
          {/* Toggle Button - Hidden on mobile */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <a
                    href={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl
                      text-slate-300 hover:text-white
                      hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10
                      border border-transparent hover:border-cyan-500/20
                      transition-all duration-200 group
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    {!isCollapsed && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section at Bottom */}
        <div className="p-4 border-t border-slate-800/50">
          <div
            className={`
              flex items-center gap-3 p-3 rounded-xl
              bg-gradient-to-r from-slate-800/50 to-slate-800/30
              border border-slate-700/50
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">JD</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate">John Doe</p>
                <p className="text-xs text-slate-500 truncate">john@example.com</p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button className="w-full mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      {/* <main 
        className={`
          flex-1 transition-all duration-300
          ${isCollapsed ? 'lg:ml-0' : 'lg:ml-0'}
        `}
      >
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main> */}
    </div>
  );
};

export default Sidebar;