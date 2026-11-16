import { toast, ToastOptions } from "react-toastify";

export type NotificationType =
  | "success"
  | "error"
  | "ai_recommendation"
  | "resume_analyzed"
  | "course_added";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

// Internal notification listener store for history panel synchronization
type NotificationListener = (notification: NotificationItem) => void;
const listeners: Set<NotificationListener> = new Set();

export const subscribeNotifications = (listener: NotificationListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = (item: NotificationItem) => {
  listeners.forEach((fn) => fn(item));
};

export const notificationService = {
  // 1. Success Notification
  notifySuccess: (message: string, title = "Success") => {
    const item: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: "success",
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    notifyListeners(item);

    toast.success(`${title}: ${message}`, {
      ...defaultOptions,
      toastId: item.id,
      style: { background: "#059669", color: "#ffffff", fontWeight: 600 },
    });
  },

  // 2. Error Notification
  notifyError: (message: string, title = "Error") => {
    const item: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: "error",
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    notifyListeners(item);

    toast.error(`${title}: ${message}`, {
      ...defaultOptions,
      toastId: item.id,
      style: { background: "#e11d48", color: "#ffffff", fontWeight: 600 },
    });
  },

  // 3. AI Recommendation Ready Notification
  notifyAIRecommendationReady: (message = "Your customized AI career roadmap & target skills match are ready!", title = "AI Recommendation Ready") => {
    const item: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: "ai_recommendation",
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
      link: "/assessment",
    };
    notifyListeners(item);

    toast.info(`✨ ${title}: ${message}`, {
      ...defaultOptions,
      toastId: item.id,
      style: { background: "#4f46e5", color: "#ffffff", fontWeight: 600 },
    });
  },

  // 4. Resume Analyzed Notification
  notifyResumeAnalyzed: (atsScore = 88, message = "ATS Resume Scan Complete! You scored high for Software Engineer roles.", title = "Resume Analyzed") => {
    const item: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: "resume_analyzed",
      title: `${title} (${atsScore}% ATS Score)`,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
      link: "/resume",
    };
    notifyListeners(item);

    toast.info(`📄 ${item.title}: ${message}`, {
      ...defaultOptions,
      toastId: item.id,
      style: { background: "#7c3aed", color: "#ffffff", fontWeight: 600 },
    });
  },

  // 5. New Course Added Notification
  notifyNewCourseAdded: (courseName = "Generative AI Masterclass 2026", provider = "Coursera", title = "New Course Added") => {
    const message = `Check out "${courseName}" offered by ${provider} now available in your recommended learning catalog!`;
    const item: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: "course_added",
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
      link: "/courses",
    };
    notifyListeners(item);

    toast.success(`🎓 ${title}: ${courseName} (${provider})`, {
      ...defaultOptions,
      toastId: item.id,
      style: { background: "#0284c7", color: "#ffffff", fontWeight: 600 },
    });
  },
};
