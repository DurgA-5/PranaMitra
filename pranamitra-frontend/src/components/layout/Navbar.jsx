import { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Bell, UserCircle, Menu, LogOut, Shield, ChevronRight, CheckSquare } from "lucide-react";
import { toast } from "react-toastify";
import notificationService from "../../services/notificationService";
import { getUserId } from "../../utils/token";

const titleMap = {
  admin: "Admin Console",
  donors: "Student Donors",
  patients: "Patient Listings",
  bloodbanks: "Blood Banks",
  requests: "Blood Requests",
  reports: "System Reports",
  settings: "Account Settings",
  donor: "Donor Portal",
  profile: "My Profile Details",
  matching: "Matching Blood Requests",
  accepted: "Accepted Appointments",
  history: "Donation History Log",
  notifications: "System Alerts",
  "contact-queries": "Contact Queries Support",
};

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const userId = getUserId();
  const fullName = localStorage.getItem("fullName") || "User Session";
  const email = localStorage.getItem("email") || "user@pranamitra.com";
  const role = localStorage.getItem("role") || "DONOR";

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const loadNotifications = async () => {
    if (!userId) return;
    try {
      const data = await notificationService.getNotifications(userId);
      setNotifications(data || []);
      const count = await notificationService.getUnreadCount(userId);
      setUnreadCount(count || 0);
    } catch (error) {
      console.error("Failed to load notifications in Navbar", error);
    }
  };

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Poll for notifications every 20 seconds to keep metrics alive
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 20000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Load immediately on dropdown open
  useEffect(() => {
    if (notifOpen) {
      loadNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");

    toast.success("Successfully logged out.");
    navigate("/login", { replace: true });
  };

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(c - 1, 0));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async (e) => {
    e.stopPropagation();
    try {
      await notificationService.markAllAsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read.");
    } catch (error) {
      console.error(error);
    }
  };

  const handleNotifClick = () => {
    setNotifOpen(false);
    navigate(`/${role.toLowerCase()}/notifications`);
  };

  // Get dynamic title based on path
  const currentPathKey = pathnames[pathnames.length - 1];
  const currentPageTitle = titleMap[currentPathKey] || "PranaMitra Console";

  const latestNotifications = notifications.slice(0, 3);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 select-none">
      {/* Left: Hamburger & Dynamic Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden transition"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Dynamic Breadcrumbs */}
        <div className="hidden md:flex flex-col">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Home</span>
            {pathnames.map((path, idx) => {
              const display = path.charAt(0).toUpperCase() + path.slice(1);
              return (
                <span key={idx} className="flex items-center gap-1.5">
                  <ChevronRight size={10} className="text-slate-300" />
                  <span className={idx === pathnames.length - 1 ? "text-red-600" : ""}>{display}</span>
                </span>
              );
            })}
          </div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight mt-0.5">{currentPageTitle}</h2>
        </div>
      </div>

      {/* Right: Notifications & Profile Widget */}
      <div className="flex items-center gap-4">
        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className={`relative p-2 rounded-xl transition ${
              notifOpen ? "bg-red-50 text-red-600" : "hover:bg-slate-50 text-slate-500"
            }`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-600 flex items-center justify-center text-[7px] text-white font-extrabold"></span>
              </>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2.5 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-[9px] font-extrabold text-white bg-red-500 px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[10px] text-red-600 hover:text-red-700 font-extrabold flex items-center gap-1 transition"
                  >
                    <CheckSquare size={11} /> Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto scrollbar-thin">
                {latestNotifications.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-xs font-semibold text-slate-400">No new alerts.</p>
                  </div>
                ) : (
                  latestNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotifClick(n)}
                      className={`p-2.5 rounded-xl transition cursor-pointer hover:bg-slate-50 border border-transparent ${
                        !n.read ? "bg-red-50/10 border-red-100/30" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-slate-800 leading-snug">
                              {n.title}
                            </p>
                            {!n.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed truncate max-w-[210px]">
                            {n.message}
                          </p>
                        </div>
                        {!n.read && (
                          <button
                            onClick={(e) => handleMarkAsRead(n.id, e)}
                            className="text-[10px] text-slate-400 hover:text-slate-700 p-0.5 transition"
                            title="Mark as read"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-slate-50 pt-2.5 mt-2.5 text-center">
                <Link
                  to={`/${role.toLowerCase()}/notifications`}
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-bold text-red-600 hover:text-red-700 transition"
                >
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition"
          >
            <UserCircle size={32} className="text-slate-400 hover:text-red-600 transition" />
            <div className="hidden sm:block text-left">
              <h3 className="font-semibold text-slate-700 text-xs leading-none">{fullName}</h3>
              <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full uppercase mt-1 inline-block">
                {role}
              </span>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3.5 py-2.5 border-b border-slate-50">
                <p className="text-xs font-semibold text-slate-700 leading-none">{fullName}</p>
                <p className="text-[10px] text-slate-400 mt-1 truncate">{email}</p>
              </div>

              <div className="p-1 space-y-0.5">
                <Link
                  to={role === "ADMIN" ? "/admin/settings" : `/${role.toLowerCase()}/profile`}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-50 transition"
                >
                  <Shield size={14} />
                  <span>My Settings</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;