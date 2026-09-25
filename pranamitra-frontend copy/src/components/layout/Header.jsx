import {
  Search,
  Bell,
  Settings,
  ChevronDown,
} from "lucide-react";

function Header() {
  return (
    <header className="bg-white h-20 border-b border-gray-200 px-8 flex items-center justify-between">

      {/* Left Section */}

      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Welcome back to PranaMitra Blood Management System
        </p>

      </div>

      {/* Right Section */}

      <div className="flex items-center gap-5">

        {/* Search */}

        <div className="hidden md:flex items-center bg-slate-100 rounded-xl px-4 py-3 w-80">

          <Search
            size={18}
            className="text-gray-500"
          />

          <input
            type="text"
            placeholder="Search..."
            className="ml-3 bg-transparent outline-none w-full"
          />

        </div>

        {/* Notification */}

        <button className="relative w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center">

          <Bell size={20} />

          <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-600"></span>

        </button>

        {/* Settings */}

        <button className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center">

          <Settings size={20} />

        </button>

        {/* User */}

        <div className="flex items-center gap-3 cursor-pointer">

          <div className="w-11 h-11 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg">

            A

          </div>

          <div className="hidden lg:block">

            <h3 className="font-semibold text-slate-800">
              Administrator
            </h3>

            <p className="text-xs text-gray-500">
              System Administrator
            </p>

          </div>

          <ChevronDown
            size={18}
            className="text-gray-500"
          />

        </div>

      </div>

    </header>
  );
}

export default Header;