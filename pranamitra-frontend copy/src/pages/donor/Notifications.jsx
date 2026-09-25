import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Bell, Calendar, Check, Trash2, CheckSquare, Info, ShieldAlert, Sparkles } from "lucide-react";
import notificationService from "../../services/notificationService";
import { getUserId } from "../../utils/token";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/ui/Button";

function Notifications() {
  const userId = getUserId();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications(userId);
      setNotifications(data || []);
    } catch (error) {
      console.error("Failed to load notifications", error);
      toast.error("Failed to fetch notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      toast.success("Notification marked as read.");
    } catch {
      toast.error("Failed to mark notification as read.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Failed to mark all notifications as read.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification deleted.");
    } catch {
      toast.error("Failed to delete notification.");
    }
  };

  const getThemeConfig = (type, read) => {
    const isUnread = !read;
    switch (type?.toUpperCase()) {
      case "SUCCESS":
        return {
          icon: <Sparkles className="text-emerald-500" size={18} />,
          border: isUnread ? "border-l-4 border-l-emerald-500 border-emerald-100 bg-emerald-50/20" : "border-slate-100 bg-white",
          dot: "bg-emerald-500",
        };
      case "WARNING":
        return {
          icon: <Calendar className="text-amber-500" size={18} />,
          border: isUnread ? "border-l-4 border-l-amber-500 border-amber-100 bg-amber-50/20" : "border-slate-100 bg-white",
          dot: "bg-amber-500",
        };
      case "DANGER":
      case "EMERGENCY":
        return {
          icon: <ShieldAlert className="text-rose-500" size={18} />,
          border: isUnread ? "border-l-4 border-l-rose-500 border-rose-100 bg-rose-50/20" : "border-slate-100 bg-white",
          dot: "bg-rose-500",
        };
      default:
        return {
          icon: <Info className="text-blue-500" size={18} />,
          border: isUnread ? "border-l-4 border-l-blue-500 border-blue-100 bg-blue-50/20" : "border-slate-100 bg-white",
          dot: "bg-blue-500",
        };
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = notifications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
            Notifications
          </h1>
          <p className="text-xs md:text-sm font-semibold text-slate-400 mt-1">
            You have <span className="text-red-500 font-extrabold">{unreadCount}</span> unread alerts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2"
            >
              <CheckSquare size={14} /> Mark all read
            </Button>
          )}
          <Button onClick={loadNotifications} variant="secondary" className="flex items-center gap-2">
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-50 rounded-2xl"></div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No Notifications"
          description="You don't have any notifications or system alerts at this moment."
          icon={Bell}
        />
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {currentItems.map((n) => {
              const theme = getThemeConfig(n.type, n.read);
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 hover:shadow-md ${theme.border}`}
                >
                  <div className="p-2 bg-slate-50 rounded-xl shrink-0 border border-slate-100 flex items-center justify-center">
                    {theme.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className={`w-2 h-2 rounded-full ${theme.dot} animate-pulse`} />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-semibold mt-1 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 font-bold mt-2.5 block">
                      {new Date(n.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 self-center">
                    {!n.read && (
                      <button
                        onClick={() => handleMarkAsRead(n.id)}
                        title="Mark as read"
                        className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded-lg transition"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(n.id)}
                      title="Delete notification"
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-6 select-none">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-xs font-extrabold bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs text-slate-400 font-bold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-xs font-extrabold bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Notifications;
