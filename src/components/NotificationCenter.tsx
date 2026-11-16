import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileCheck,
  GraduationCap,
  CheckCheck,
  Trash2,
  X,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import {
  notificationService,
  subscribeNotifications,
  NotificationItem,
} from "../services/notificationService";

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    // Initial sample notifications
    return [
      {
        id: "sample-1",
        type: "ai_recommendation",
        title: "AI Recommendation Ready",
        message: "Your tailored Full Stack AI Engineer roadmap has been updated with Gemini 3.6 Flash.",
        timestamp: "Just now",
        read: false,
        link: "/assessment",
      },
      {
        id: "sample-2",
        type: "resume_analyzed",
        title: "Resume Analyzed (88% ATS Score)",
        message: "ATS breakdown: High keyword density for TypeScript & React. Gap identified in Docker.",
        timestamp: "10m ago",
        read: false,
        link: "/resume",
      },
      {
        id: "sample-3",
        type: "course_added",
        title: "New Course Added",
        message: 'New course "Deep Learning & Prompt Engineering 2026" on Coursera was added.',
        timestamp: "1h ago",
        read: true,
        link: "/courses",
      },
    ];
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Listen for newly triggered notifications from notificationService
  useEffect(() => {
    const unsubscribe = subscribeNotifications((newItem) => {
      setNotifications((prev) => [newItem, ...prev]);
    });
    return () => unsubscribe();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleMarkItemRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Icon mapping helper
  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      case "ai_recommendation":
        return <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />;
      case "resume_analyzed":
        return <FileCheck className="w-4 h-4 text-violet-500 shrink-0" />;
      case "course_added":
        return <GraduationCap className="w-4 h-4 text-sky-500 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
        title="Notification Center"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce shadow-md shadow-rose-500/30">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Center Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden flex flex-col max-h-[580px]">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs flex items-center gap-1 font-semibold"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Read All</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs flex items-center gap-1 font-semibold"
                  title="Clear history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Instant Test Triggers Bar */}
          <div className="p-3 bg-indigo-50/60 dark:bg-slate-800/40 border-b border-indigo-100 dark:border-slate-800 space-y-1.5">
            <p className="text-[10px] font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
              Instant Trigger Notification Testing:
            </p>
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              <button
                onClick={() => notificationService.notifySuccess("Action saved successfully!")}
                className="px-2 py-1 rounded-md bg-emerald-600 text-white font-bold hover:opacity-90 transition-opacity"
              >
                + Success
              </button>
              <button
                onClick={() => notificationService.notifyError("Failed to synchronize career data.")}
                className="px-2 py-1 rounded-md bg-rose-600 text-white font-bold hover:opacity-90 transition-opacity"
              >
                + Error
              </button>
              <button
                onClick={() => notificationService.notifyAIRecommendationReady()}
                className="px-2 py-1 rounded-md bg-indigo-600 text-white font-bold hover:opacity-90 transition-opacity"
              >
                + AI Ready
              </button>
              <button
                onClick={() => notificationService.notifyResumeAnalyzed(92)}
                className="px-2 py-1 rounded-md bg-purple-600 text-white font-bold hover:opacity-90 transition-opacity"
              >
                + Resume
              </button>
              <button
                onClick={() => notificationService.notifyNewCourseAdded()}
                className="px-2 py-1 rounded-md bg-sky-600 text-white font-bold hover:opacity-90 transition-opacity"
              >
                + Course
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  No notifications yet.
                </p>
                <p className="text-[10px] text-slate-400">
                  Click the instant trigger buttons above to test notification events.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleMarkItemRead(item.id)}
                  className={`p-3.5 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-start gap-3 ${
                    !item.read ? "bg-indigo-50/30 dark:bg-indigo-950/20" : ""
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                    {getNotificationIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    {item.link && (
                      <Link
                        to={item.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>

                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-2" title="Unread" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
