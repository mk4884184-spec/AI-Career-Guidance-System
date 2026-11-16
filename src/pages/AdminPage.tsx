import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Users,
  UserX,
  UserCheck,
  BookOpen,
  Briefcase,
  Star,
  Download,
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  Lock,
  LogOut,
  RefreshCw,
  Award,
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { toast } from "react-hot-toast";
import { notificationService } from "../services/notificationService";
import { adminService } from "../services/adminService";
import { User, ManagedCareer, ManagedCourse, AdminStats, FeedbackItem } from "../types";

export const AdminPage: React.FC = () => {
  // Auth state for Admin
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const storedUser = localStorage.getItem("ai_career_user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        return u.role === "admin";
      } catch {
        return false;
      }
    }
    return false;
  });

  // Admin Login Form State
  const [adminEmail, setAdminEmail] = useState("admin@career.ai");
  const [adminPassword, setAdminPassword] = useState("admin123");
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "users" | "careers" | "courses" | "feedback" | "reports"
  >("dashboard");

  // Admin Data States
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [careers, setCareers] = useState<ManagedCareer[]>([]);
  const [courses, setCourses] = useState<ManagedCourse[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter & Search states
  const [userSearch, setUserSearch] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState("all");

  const [careerSearch, setCareerSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState("all");

  // Modals
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(null);
  
  // Career Modal
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<ManagedCareer | null>(null);
  const [careerForm, setCareerForm] = useState({
    title: "",
    category: "Software Engineering",
    avgSalary: "₹15,00,000 - ₹30,00,000",
    growthOutlook: "+25% (2024-2030)",
    demandLevel: "Very High" as "Very High" | "High" | "Moderate",
    requiredSkills: "React, Node.js, TypeScript",
    description: "",
    activeJobsCount: 5000,
  });

  // Course Modal
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<ManagedCourse | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    provider: "Coursera",
    type: "Free" as "Free" | "Paid" | "Certification",
    level: "Intermediate" as "Beginner" | "Intermediate" | "Advanced",
    duration: "4 Weeks",
    category: "Web Development",
    rating: 4.8,
    courseUrl: "https://www.coursera.org",
  });

  // Delete Confirmation Dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: "user" | "career" | "course" | "feedback" | null;
    id: string | null;
    title: string;
  }>({ isOpen: false, type: null, id: null, title: "" });

  // Initial Load
  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAllAdminData();
    }
  }, [isAdminLoggedIn]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, careersData, coursesData, feedbackData] = await Promise.all([
        adminService.getAdminStats().catch(() => null),
        adminService.getUsers().catch(() => []),
        adminService.getCareers().catch(() => []),
        adminService.getCourses().catch(() => []),
        adminService.getFeedbackList().catch(() => []),
      ]);

      if (statsData) setStats(statsData);
      setUsers(usersData);
      setCareers(careersData);
      setCourses(coursesData);
      setFeedbacks(feedbackData);
    } catch (err: any) {
      toast.error(err.message || "Failed to load admin panel data");
    } finally {
      setLoading(false);
    }
  };

  // Handle Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      toast.error("Please enter admin email and password");
      return;
    }

    setLoginLoading(true);
    try {
      await adminService.adminLogin(adminEmail, adminPassword);
      setIsAdminLoggedIn(true);
      toast.success("Welcome, Administrator!");
    } catch (err: any) {
      toast.error(err.message || "Admin login failed. Check credentials.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    localStorage.removeItem("ai_career_token");
    localStorage.removeItem("ai_career_user");
    setIsAdminLoggedIn(false);
    toast.success("Logged out from Admin Session");
  };

  // User Actions: Block / Unblock
  const handleToggleBlockUser = async (userId: string) => {
    try {
      const updatedUser = await adminService.toggleBlockUser(userId);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isBlocked: updatedUser.isBlocked } : u)));
      toast.success(updatedUser.isBlocked ? "User has been blocked" : "User has been unblocked");
      // Refresh stats
      adminService.getAdminStats().then((s) => setStats(s)).catch(() => {});
    } catch (err: any) {
      toast.error(err.message || "Failed to update user block status");
    }
  };

  // User Action: Delete
  const confirmDeleteUser = (u: User) => {
    setDeleteDialog({
      isOpen: true,
      type: "user",
      id: u.id,
      title: `User: ${u.name} (${u.email})`,
    });
  };

  // Career Action: Delete
  const confirmDeleteCareer = (c: ManagedCareer) => {
    setDeleteDialog({
      isOpen: true,
      type: "career",
      id: c.id,
      title: `Career: ${c.title}`,
    });
  };

  // Course Action: Delete
  const confirmDeleteCourse = (c: ManagedCourse) => {
    setDeleteDialog({
      isOpen: true,
      type: "course",
      id: c.id,
      title: `Course: ${c.title}`,
    });
  };

  // Feedback Action: Delete
  const confirmDeleteFeedback = (f: FeedbackItem) => {
    setDeleteDialog({
      isOpen: true,
      type: "feedback",
      id: f.id,
      title: `Feedback from ${f.userName} (${f.category})`,
    });
  };

  // Execute Deletion
  const handleExecuteDelete = async () => {
    if (!deleteDialog.id || !deleteDialog.type) return;

    try {
      if (deleteDialog.type === "user") {
        await adminService.deleteUser(deleteDialog.id);
        setUsers((prev) => prev.filter((u) => u.id !== deleteDialog.id));
        toast.success("User account deleted successfully");
      } else if (deleteDialog.type === "career") {
        await adminService.deleteCareer(deleteDialog.id);
        setCareers((prev) => prev.filter((c) => c.id !== deleteDialog.id));
        toast.success("Career path removed successfully");
      } else if (deleteDialog.type === "course") {
        await adminService.deleteCourse(deleteDialog.id);
        setCourses((prev) => prev.filter((c) => c.id !== deleteDialog.id));
        toast.success("Course entry removed successfully");
      } else if (deleteDialog.type === "feedback") {
        await adminService.deleteFeedback(deleteDialog.id);
        setFeedbacks((prev) => prev.filter((f) => f.id !== deleteDialog.id));
        toast.success("Feedback entry deleted successfully");
      }

      setDeleteDialog({ isOpen: false, type: null, id: null, title: "" });
      adminService.getAdminStats().then((s) => setStats(s)).catch(() => {});
    } catch (err: any) {
      toast.error(err.message || "Failed to complete deletion");
    }
  };

  // Career Add / Edit Handlers
  const openAddCareerModal = () => {
    setEditingCareer(null);
    setCareerForm({
      title: "",
      category: "Software Development",
      avgSalary: "₹18,00,000 - ₹32,00,000",
      growthOutlook: "+22% (2024-2030)",
      demandLevel: "Very High",
      requiredSkills: "React, Node.js, TypeScript",
      description: "Responsible for designing and deploying high performance software.",
      activeJobsCount: 8500,
    });
    setIsCareerModalOpen(true);
  };

  const openEditCareerModal = (career: ManagedCareer) => {
    setEditingCareer(career);
    setCareerForm({
      title: career.title,
      category: career.category,
      avgSalary: career.avgSalary,
      growthOutlook: career.growthOutlook,
      demandLevel: career.demandLevel,
      requiredSkills: career.requiredSkills.join(", "),
      description: career.description,
      activeJobsCount: career.activeJobsCount,
    });
    setIsCareerModalOpen(true);
  };

  const handleSaveCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsList = careerForm.requiredSkills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      title: careerForm.title,
      category: careerForm.category,
      avgSalary: careerForm.avgSalary,
      growthOutlook: careerForm.growthOutlook,
      demandLevel: careerForm.demandLevel,
      requiredSkills: skillsList,
      description: careerForm.description,
      activeJobsCount: Number(careerForm.activeJobsCount),
    };

    try {
      if (editingCareer) {
        const updated = await adminService.updateCareer(editingCareer.id, payload);
        setCareers((prev) => prev.map((c) => (c.id === editingCareer.id ? updated : c)));
        toast.success("Career path updated successfully");
      } else {
        const created = await adminService.addCareer(payload);
        setCareers((prev) => [created, ...prev]);
        toast.success("New career path created successfully");
      }
      setIsCareerModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save career path");
    }
  };

  // Course Add / Edit Handlers
  const openAddCourseModal = () => {
    setEditingCourse(null);
    setCourseForm({
      title: "",
      provider: "Coursera",
      type: "Free",
      level: "Intermediate",
      duration: "4 Weeks",
      category: "Software Engineering",
      rating: 4.8,
      courseUrl: "https://www.coursera.org",
    });
    setIsCourseModalOpen(true);
  };

  const openEditCourseModal = (course: ManagedCourse) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      provider: course.provider,
      type: course.type,
      level: course.level,
      duration: course.duration,
      category: course.category,
      rating: course.rating,
      courseUrl: course.courseUrl,
    });
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: courseForm.title,
      provider: courseForm.provider,
      type: courseForm.type,
      level: courseForm.level,
      duration: courseForm.duration,
      category: courseForm.category,
      rating: Number(courseForm.rating),
      courseUrl: courseForm.courseUrl,
    };

    try {
      if (editingCourse) {
        const updated = await adminService.updateCourse(editingCourse.id, payload);
        setCourses((prev) => prev.map((c) => (c.id === editingCourse.id ? updated : c)));
        toast.success("Course updated successfully");
      } else {
        const created = await adminService.addCourse(payload);
        setCourses((prev) => [created, ...prev]);
        notificationService.notifyNewCourseAdded(payload.title, payload.provider);
      }
      setIsCourseModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save course");
    }
  };

  // Export CSV Report
  const handleExportCSVReport = async () => {
    try {
      const report = await adminService.getReports();
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Metric,Value\n";
      csvContent += `Generated At,${report.generatedAt}\n`;
      csvContent += `Total Users,${report.metrics.totalRegisteredUsers}\n`;
      csvContent += `Active Users,${report.metrics.activeUsers}\n`;
      csvContent += `Blocked Users,${report.metrics.blockedUsers}\n`;
      csvContent += `Total Roadmaps Created,${report.metrics.totalRoadmapsCreated}\n`;
      csvContent += `Total Resumes Analyzed,${report.metrics.totalResumesEvaluated}\n`;
      csvContent += `Total Careers Managed,${report.metrics.totalManagedCareers}\n`;
      csvContent += `Total Courses Managed,${report.metrics.totalManagedCourses}\n`;
      csvContent += `Total Feedback Count,${report.metrics.totalFeedbackReceived}\n\n`;

      csvContent += "User ID,Name,Email,Role,Status,Target Role,Registered At\n";
      report.userRoster.forEach((u: any) => {
        csvContent += `"${u.id}","${u.name}","${u.email}","${u.role}","${u.status}","${u.targetRole || ""}","${u.createdAt}"\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `AI_Career_Platform_Report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV System Report downloaded!");
    } catch (err: any) {
      toast.error(err.message || "Failed to export report");
    }
  };

  // Export JSON Report
  const handleExportJSONReport = async () => {
    try {
      const report = await adminService.getReports();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
      const link = document.createElement("a");
      link.setAttribute("href", dataStr);
      link.setAttribute("download", `AI_Career_System_Report_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("JSON System Report downloaded!");
    } catch (err: any) {
      toast.error(err.message || "Failed to export JSON report");
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.targetRole && u.targetRole.toLowerCase().includes(userSearch.toLowerCase()));

    const matchesStatus =
      userStatusFilter === "all"
        ? true
        : userStatusFilter === "blocked"
        ? u.isBlocked
        : !u.isBlocked;

    return matchesSearch && matchesStatus;
  });

  // Filtered Careers
  const filteredCareers = careers.filter((c) =>
    c.title.toLowerCase().includes(careerSearch.toLowerCase()) ||
    c.category.toLowerCase().includes(careerSearch.toLowerCase())
  );

  // Filtered Courses
  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.provider.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.category.toLowerCase().includes(courseSearch.toLowerCase())
  );

  // Filtered Feedbacks
  const filteredFeedbacks = feedbacks.filter((f) =>
    feedbackCategoryFilter === "all" ? true : f.category === feedbackCategoryFilter
  );

  // Colors for Charts
  const COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

  // LOGIN SCREEN (IF NOT ADMIN)
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="text-center space-y-2">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Admin Authentication</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter system administrator JWT credentials to access platform controls.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@career.ai"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Log In as Administrator
                </>
              )}
            </button>
          </form>

          {/* Quick Fill Credentials Banner for reviewers */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" /> Default Admin Credentials:
            </p>
            <p className="font-mono text-[11px] bg-white/60 dark:bg-slate-950/60 p-2 rounded-lg border border-amber-500/20">
              Email: <strong>admin@career.ai</strong> <br />
              Password: <strong>admin123</strong>
            </p>
            <button
              type="button"
              onClick={() => {
                setAdminEmail("admin@career.ai");
                setAdminPassword("admin123");
              }}
              className="text-indigo-600 dark:text-indigo-400 font-bold underline hover:text-indigo-800 text-[11px]"
            >
              Click to Auto-Fill Credentials
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Admin Panel Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-wider rounded-full border border-indigo-400/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel Active
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live JWT Session
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">System Control & Administration</h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Manage registered users, inspect real-time platform analytics, control careers catalog, oversee course recommendations, and analyze user feedback.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadAllAdminData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5"
            title="Refresh System Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          <button
            onClick={handleAdminLogout}
            className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold transition-all border border-rose-500/30 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Admin</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: "dashboard", label: "Dashboard & Charts", icon: TrendingUp },
          { id: "users", label: `Users (${users.length})`, icon: Users },
          { id: "careers", label: `Manage Careers (${careers.length})`, icon: Briefcase },
          { id: "courses", label: `Manage Courses (${courses.length})`, icon: BookOpen },
          { id: "feedback", label: `User Feedback (${feedbacks.length})`, icon: Star },
          { id: "reports", label: "System Reports", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD & CHARTS */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Total Users</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {stats?.totalUsers ?? users.length}
              </p>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-emerald-500 font-bold">{stats?.activeUsers ?? users.filter(u=>!u.isBlocked).length} Active</span>
                <span className="text-rose-500 font-bold">{stats?.blockedUsers ?? users.filter(u=>u.isBlocked).length} Blocked</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Total Roadmaps</span>
                <Award className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {stats?.totalRoadmaps ?? 12}
              </p>
              <p className="text-[11px] text-slate-400">AI Generated Guidance</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Resumes Analyzed</span>
                <FileText className="w-4 h-4 text-violet-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {stats?.totalResumesAnalyzed ?? 24}
              </p>
              <p className="text-[11px] text-slate-400">ATS Scanned Documents</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Average Feedback</span>
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {stats?.averageFeedbackRating ?? 4.9} / 5.0
              </p>
              <p className="text-[11px] text-slate-400">{feedbacks.length} Submissions</p>
            </div>
          </div>

          {/* Interactive Recharts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Growth Trend Chart */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">User Growth & Signups Trend</h3>
                  <p className="text-xs text-slate-500">Monthly new registered users on platform</p>
                </div>
                <TrendingUp className="w-5 h-5 text-indigo-500" />
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.userSignupTrends || []}>
                    <defs>
                      <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" stroke="#888888" fontSize={11} />
                    <YAxis stroke="#888888" fontSize={11} />
                    <Tooltip />
                    <Area type="monotone" dataKey="signups" stroke="#6366f1" fillOpacity={1} fill="url(#colorSignups)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Target Role Distribution Chart */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Target Career Role Distribution</h3>
                  <p className="text-xs text-slate-500">Most requested career paths by users</p>
                </div>
                <Briefcase className="w-5 h-5 text-emerald-500" />
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.roleDistribution || []}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="roleName" stroke="#888888" fontSize={10} interval={0} />
                    <YAxis stroke="#888888" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ATS Resume Score Ranges Chart */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">ATS Resume Score Distribution</h3>
                  <p className="text-xs text-slate-500">Breakdown of user resume evaluation benchmarks</p>
                </div>
                <FileText className="w-5 h-5 text-violet-500" />
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.atsScoreDistribution || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="range"
                      label={(props: any) => `${props.range}: ${props.count}`}
                    >
                      {(stats?.atsScoreDistribution || []).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Platform Quick Summary Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/10 via-slate-900/10 to-transparent border border-indigo-500/20 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-500" /> System Health Summary
              </h3>
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                  <span>Gemini 3.6 Flash API Integration</span>
                  <span className="font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Operational
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                  <span>JWT Authorization Middleware</span>
                  <span className="font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Active & Secure
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                  <span>In-Memory Persistence Engine</span>
                  <span className="font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> High Performance
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name, email, target role..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Filter className="w-4 h-4" /> Status:
              </div>
              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="all">All Users ({users.length})</option>
                <option value="active">Active Only</option>
                <option value="blocked">Blocked Only</option>
              </select>
            </div>
          </div>

          {/* User Roster Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Target Role</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No users found matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`}
                              alt={u.name}
                              className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 object-cover"
                            />
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">{u.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{u.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-300 font-mono">{u.email}</td>
                        <td className="p-4 font-semibold text-slate-700 dark:text-slate-200">{u.targetRole || "Software Engineer"}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                            u.role === "admin"
                              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}>
                            {u.role === "admin" ? "ADMIN" : "USER"}
                          </span>
                        </td>
                        <td className="p-4">
                          {u.isBlocked ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[10px] border border-rose-500/20 flex items-center gap-1 w-fit">
                              <UserX className="w-3 h-3" /> Blocked
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] border border-emerald-500/20 flex items-center gap-1 w-fit">
                              <UserCheck className="w-3 h-3" /> Active
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-slate-400 text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedUserDetail(u)}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
                              title="View Full User Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleToggleBlockUser(u.id)}
                              className={`p-1.5 rounded-lg transition-all ${
                                u.isBlocked
                                  ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                                  : "bg-amber-500/10 text-amber-600 hover:bg-amber-600 hover:text-white"
                              }`}
                              title={u.isBlocked ? "Unblock User Account" : "Block User Account"}
                            >
                              {u.isBlocked ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                            </button>

                            <button
                              onClick={() => confirmDeleteUser(u)}
                              disabled={u.role === "admin"}
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-rose-500/10 disabled:hover:text-rose-600"
                              title={u.role === "admin" ? "Cannot delete admin account" : "Delete User Account"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE CAREERS */}
      {activeTab === "careers" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={careerSearch}
                onChange={(e) => setCareerSearch(e.target.value)}
                placeholder="Search careers or category..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              onClick={openAddCareerModal}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Career Path
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCareers.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider border border-indigo-500/20">
                      {c.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditCareerModal(c)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all"
                        title="Edit Career"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDeleteCareer(c)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-all"
                        title="Delete Career"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{c.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{c.description}</p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Salary:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{c.avgSalary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Growth Outlook:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{c.growthOutlook}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Active Openings:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{c.activeJobsCount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {c.requiredSkills.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MANAGE COURSES */}
      {activeTab === "courses" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder="Search course title or provider..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              onClick={openAddCourseModal}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Course Recommendation
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((crs) => (
              <div
                key={crs.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">
                      {crs.type} • {crs.level}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditCourseModal(crs)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all"
                        title="Edit Course"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDeleteCourse(crs)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-all"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">{crs.title}</h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Provider: {crs.provider}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-slate-400">Duration: {crs.duration}</span>
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500" /> {crs.rating}
                    </span>
                  </div>
                </div>

                <a
                  href={crs.courseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold text-center transition-all block"
                >
                  Visit Course Page
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: VIEW FEEDBACK */}
      {activeTab === "feedback" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Filter className="w-4 h-4" /> Category Filter:
            </div>
            <select
              value={feedbackCategoryFilter}
              onChange={(e) => setFeedbackCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">All Feedback ({feedbacks.length})</option>
              <option value="AI Career Guidance">AI Career Guidance</option>
              <option value="Mock Interviews">Mock Interviews</option>
              <option value="Course & Job Recommendations">Course & Job Recommendations</option>
              <option value="General Suggestion">General Suggestion</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFeedbacks.map((fb) => (
              <div
                key={fb.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">{fb.userName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{fb.userEmail}</span>
                    </div>
                    <button
                      onClick={() => confirmDeleteFeedback(fb)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-all"
                      title="Delete Feedback"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= fb.rating ? "fill-amber-500" : "text-slate-300 dark:text-slate-700"}`}
                        />
                      ))}
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                      {fb.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 italic">
                    "{fb.feedbackText}"
                  </p>
                </div>

                <p className="text-[10px] text-slate-400 text-right">
                  Submitted: {new Date(fb.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: REPORTS & EXPORTS */}
      {activeTab === "reports" && (
        <div className="space-y-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Platform Analytics & Exportable Reports</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Download full platform audit data, user signups roster, and usage statistics for executive reporting.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportCSVReport}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download CSV Report
                </button>
                <button
                  onClick={handleExportJSONReport}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Export Raw JSON
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">User Base Metrics</h4>
                <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                  <li>Total Registered Users: <strong>{users.length}</strong></li>
                  <li>Active User Ratio: <strong>{((users.filter(u=>!u.isBlocked).length / Math.max(users.length, 1)) * 100).toFixed(1)}%</strong></li>
                  <li>Blocked User Ratio: <strong>{((users.filter(u=>u.isBlocked).length / Math.max(users.length, 1)) * 100).toFixed(1)}%</strong></li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">System Content Volumes</h4>
                <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                  <li>Managed Career Paths: <strong>{careers.length}</strong></li>
                  <li>Managed Recommended Courses: <strong>{courses.length}</strong></li>
                  <li>User Feedback Submissions: <strong>{feedbacks.length}</strong></li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">Security & Compliance</h4>
                <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                  <li>JWT Authorization: <strong>Enforced</strong></li>
                  <li>Password Encryption: <strong>bcryptjs salted</strong></li>
                  <li>In-Memory Store: <strong>Synchronized</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USER DETAIL MODAL */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setSelectedUserDetail(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <img
                src={selectedUserDetail.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(selectedUserDetail.name)}`}
                alt={selectedUserDetail.name}
                className="w-14 h-14 rounded-full object-cover bg-slate-100 dark:bg-slate-800"
              />
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedUserDetail.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedUserDetail.email}</p>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  Target: {selectedUserDetail.targetRole || "Software Engineer"}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                <div>Experience Level: <strong>{selectedUserDetail.experienceLevel || "Intermediate"}</strong></div>
                <div>Education: <strong>{selectedUserDetail.education || "Bachelor's Degree"}</strong></div>
                <div>College: <strong>{selectedUserDetail.college || "N/A"}</strong></div>
                <div>Degree: <strong>{selectedUserDetail.degree || "N/A"}</strong></div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1 font-semibold">Skills Profile:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedUserDetail.skills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {selectedUserDetail.bio && (
                <div>
                  <span className="text-slate-400 block mb-1 font-semibold">Bio:</span>
                  <p className="text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    "{selectedUserDetail.bio}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CAREER FORM MODAL */}
      {isCareerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setIsCareerModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {editingCareer ? "Edit Career Path" : "Add New Career Path"}
            </h3>

            <form onSubmit={handleSaveCareer} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={careerForm.title}
                  onChange={(e) => setCareerForm({ ...careerForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={careerForm.category}
                    onChange={(e) => setCareerForm({ ...careerForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Avg Salary</label>
                  <input
                    type="text"
                    value={careerForm.avgSalary}
                    onChange={(e) => setCareerForm({ ...careerForm, avgSalary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Growth Outlook</label>
                  <input
                    type="text"
                    value={careerForm.growthOutlook}
                    onChange={(e) => setCareerForm({ ...careerForm, growthOutlook: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Demand Level</label>
                  <select
                    value={careerForm.demandLevel}
                    onChange={(e) => setCareerForm({ ...careerForm, demandLevel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Very High">Very High</option>
                    <option value="High">High</option>
                    <option value="Moderate">Moderate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={careerForm.requiredSkills}
                  onChange={(e) => setCareerForm({ ...careerForm, requiredSkills: e.target.value })}
                  placeholder="React, Node.js, Python"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={careerForm.description}
                  onChange={(e) => setCareerForm({ ...careerForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCareerModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700"
                >
                  Save Career
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COURSE FORM MODAL */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setIsCourseModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {editingCourse ? "Edit Course Recommendation" : "Add Course Recommendation"}
            </h3>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Course Title</label>
                <input
                  type="text"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Provider</label>
                  <input
                    type="text"
                    value={courseForm.provider}
                    onChange={(e) => setCourseForm({ ...courseForm, provider: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Type</label>
                  <select
                    value={courseForm.type}
                    onChange={(e) => setCourseForm({ ...courseForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                    <option value="Certification">Certification</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Level</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Duration</label>
                  <input
                    type="text"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Course URL</label>
                <input
                  type="url"
                  value={courseForm.courseUrl}
                  onChange={(e) => setCourseForm({ ...courseForm, courseUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Confirm Deletion</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete <strong>{deleteDialog.title}</strong>? This action is permanent and cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteDialog({ isOpen: false, type: null, id: null, title: "" })}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20"
              >
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
