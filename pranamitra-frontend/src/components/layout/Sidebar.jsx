import { useState } from "react";
import {
  LayoutDashboard, Users, User, Building2, Droplets, BarChart3, Settings,
  LogOut, HeartPulse, X, Bell, History, CheckSquare,
  ClipboardList, PlusCircle, MapPin, Activity, Mail,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationModal from "../common/ConfirmationModal";

const adminMenuItems = [
  { title: "Dashboard",      icon: LayoutDashboard, path: "/admin" },
  { title: "Donors",         icon: Users,            path: "/admin/donors" },
  { title: "Patients",       icon: User,             path: "/admin/patients" },
  { title: "Blood Banks",    icon: Building2,        path: "/admin/bloodbanks" },
  { title: "Blood Requests", icon: Droplets,         path: "/admin/requests" },
  { title: "Contact Queries", icon: Mail,             path: "/admin/contact-queries" },
  { title: "Reports",        icon: BarChart3,        path: "/admin/reports" },
  { title: "Settings",       icon: Settings,         path: "/admin/settings" },
  { title: "Notifications",  icon: Bell,             path: "/admin/notifications" },
];

const donorMenuItems = [
  { title: "Dashboard",         icon: LayoutDashboard, path: "/donor" },
  { title: "My Profile",        icon: User,            path: "/donor/profile" },
  { title: "Matching Requests", icon: Droplets,        path: "/donor/matching" },
  { title: "Accepted Requests", icon: CheckSquare,     path: "/donor/accepted" },
  { title: "Donation History",  icon: History,         path: "/donor/history" },
  { title: "Notifications",     icon: Bell,            path: "/donor/notifications" },
];

const patientMenuItems = [
  { title: "Dashboard",          icon: LayoutDashboard, path: "/patient" },
  { title: "My Blood Requests",  icon: ClipboardList,   path: "/patient/requests" },
  { title: "Request Blood",      icon: PlusCircle,      path: "/patient/request-blood" },
  { title: "Track Request",      icon: Activity,        path: "/patient/track" },
  { title: "Nearby Blood Banks", icon: MapPin,          path: "/patient/blood-banks" },
  { title: "My Profile",         icon: User,            path: "/patient/profile" },
  { title: "Notifications",      icon: Bell,            path: "/patient/notifications" },
  { title: "Settings",           icon: Settings,        path: "/patient/settings" },
];

function getMenuItems(role) {
  if (role === "ADMIN")   return adminMenuItems;
  if (role === "DONOR")   return donorMenuItems;
  if (role === "PATIENT") return patientMenuItems;
  return donorMenuItems;
}

function isRootPath(path) {
  return path === "/admin" || path === "/donor" || path === "/patient";
}

function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const role = localStorage.getItem("role") || "DONOR";
  const menuItems = getMenuItems(role);

  const confirmLogout = () => {
    setLogoutOpen(false);
    localStorage.clear();
    toast.success("Successfully logged out.");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <aside className="w-72 h-full flex flex-col justify-between glass-sidebar text-white overflow-hidden shadow-2xl relative select-none">
        {/* Glow overlay */}
        <div className="absolute top-[-10%] left-[-20%] w-[140%] h-[50%] bg-red-600/10 rounded-full blur-[120px] pointer-events-none glow-overlay" />

        <div className="relative">
          {/* Logo */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center shadow-lg shadow-red-950/20">
                <HeartPulse className="text-red-500 animate-pulse" size={22} />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  PranaMitra
                </h1>
                <p className="text-[10px] text-slate-400 font-medium">Life Saving Network</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white lg:hidden transition"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-4 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)] scrollbar-thin">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.title}
                  to={item.path}
                  onClick={onClose}
                  end={isRootPath(item.path)}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                      isActive
                        ? "bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold shadow-lg shadow-red-600/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-sm tracking-wide">{item.title}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white/5 shrink-0 bg-slate-950/20">
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 group font-semibold text-sm"
          >
            <LogOut size={18} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      <ConfirmationModal
        open={logoutOpen}
        title="Confirm Logout"
        message="Are you sure you want to logout of the system?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={confirmLogout}
        onClose={() => setLogoutOpen(false)}
        type="warning"
      />
    </>
  );
}

export default Sidebar;