import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Briefcase,
  Code2,
  Star,
  Download,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Award,
  Calendar,
  Filter,
  CheckCircle2,
  Layers,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut, Radar, PolarArea } from "react-chartjs-2";
import { toast } from "react-hot-toast";
import { analyticsService, AnalyticsData } from "../services/analyticsService";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "6m" | "all">("all");
  const [activeChartTab, setActiveChartTab] = useState<"all" | "users" | "careers" | "skills" | "feedback">("all");

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const result = await analyticsService.getOverview(timeRange);
      setData(result);
    } catch (err: any) {
      toast.error(err.message || "Failed to load analytics dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  // Export Analytics Summary CSV
  const handleExportCSV = () => {
    if (!data) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Category,Metric,Value\n";
    csvContent += `Summary,Average Rating,${data.feedbackRatingsData.averageRating}\n`;
    csvContent += `Summary,Satisfaction Rate,${data.feedbackRatingsData.satisfactionRate}%\n`;
    csvContent += `Summary,Avg Match Score,${data.performanceMetrics.avgMatchScore}%\n`;
    csvContent += `Summary,Avg ATS Score,${data.performanceMetrics.avgAtsScore}%\n\n`;

    csvContent += "Month,Registered Users,Active Users\n";
    data.userGrowthData.forEach((u) => {
      csvContent += `"${u.month}",${u.users},${u.activeUsers}\n`;
    });

    csvContent += "\nCareer Choice,Count\n";
    data.careerChoicesData.forEach((c) => {
      csvContent += `"${c.career}",${c.count}\n`;
    });

    csvContent += "\nPopular Skill,User Count,Demand Score\n";
    data.popularSkillsData.forEach((s) => {
      csvContent += `"${s.skill}",${s.userCount},${s.demandScore}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CareerAI_Analytics_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Analytics CSV report exported successfully!");
  };

  // 1. Chart.js Config: Users Growth Line Chart
  const usersChartData = {
    labels: data?.userGrowthData.map((u) => u.month) || ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Total Registered Users",
        data: data?.userGrowthData.map((u) => u.users) || [14, 22, 35, 48, 62, 78],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.15)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#6366f1",
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: "Active Platform Users",
        data: data?.userGrowthData.map((u) => u.activeUsers) || [12, 18, 30, 42, 53, 66],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.05)",
        fill: false,
        borderDash: [5, 5],
        tension: 0.4,
        pointBackgroundColor: "#10b981",
        pointRadius: 4,
      },
    ],
  };

  // 2. Chart.js Config: Career Choices Doughnut Chart
  const careerChoicesChartData = {
    labels: data?.careerChoicesData.map((c) => c.career) || ["Software Eng", "AI Engineer", "Data Scientist", "Cloud Arch", "Cybersecurity"],
    datasets: [
      {
        label: "User Preferences",
        data: data?.careerChoicesData.map((c) => c.count) || [25, 18, 14, 12, 9],
        backgroundColor: [
          "#6366f1",
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ec4899",
          "#8b5cf6",
          "#06b6d4",
        ],
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.8)",
      },
    ],
  };

  // 3. Chart.js Config: Popular Skills Radar Chart
  const popularSkillsChartData = {
    labels: data?.popularSkillsData.map((s) => s.skill) || ["React", "TypeScript", "Python", "Node.js", "LLM", "SQL"],
    datasets: [
      {
        label: "Industry Demand Score",
        data: data?.popularSkillsData.map((s) => s.demandScore) || [92, 88, 95, 85, 98, 80],
        backgroundColor: "rgba(99, 102, 241, 0.25)",
        borderColor: "#6366f1",
        borderWidth: 2,
        pointBackgroundColor: "#6366f1",
      },
      {
        label: "User Talent Density",
        data: data?.popularSkillsData.map((s) => Math.min(100, s.userCount * 3.2)) || [80, 75, 70, 65, 58, 50],
        backgroundColor: "rgba(16, 185, 129, 0.25)",
        borderColor: "#10b981",
        borderWidth: 2,
        pointBackgroundColor: "#10b981",
      },
    ],
  };

  // 4. Chart.js Config: Popular Skills Bar Chart
  const popularSkillsBarData = {
    labels: data?.popularSkillsData.map((s) => s.skill) || ["React", "TypeScript", "Python", "Node.js", "LLM", "SQL"],
    datasets: [
      {
        label: "User Count",
        data: data?.popularSkillsData.map((s) => s.userCount) || [28, 25, 22, 20, 18, 16],
        backgroundColor: "#6366f1",
        borderRadius: 8,
      },
      {
        label: "Market Demand Rating",
        data: data?.popularSkillsData.map((s) => s.demandScore) || [92, 88, 95, 85, 98, 80],
        backgroundColor: "#06b6d4",
        borderRadius: 8,
      },
    ],
  };

  // 5. Chart.js Config: Feedback Ratings Polar Area Chart
  const feedbackRatingsChartData = {
    labels: data?.feedbackRatingsData.histogram.map((h) => h.stars) || ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"],
    datasets: [
      {
        label: "Feedback Submissions",
        data: data?.feedbackRatingsData.histogram.map((h) => h.count) || [18, 8, 3, 1, 0],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(156, 163, 175, 0.8)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Common chart options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const, labels: { font: { size: 11, weight: "bold" as const } } },
      tooltip: { cornerRadius: 8, padding: 10 },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "rgba(156, 163, 175, 0.1)" }, beginAtZero: true },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right" as const, labels: { font: { size: 11 } } },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: "rgba(156, 163, 175, 0.2)" },
        grid: { color: "rgba(156, 163, 175, 0.2)" },
        pointLabels: { font: { size: 11, weight: "bold" as const } },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-slate-900/95 via-indigo-950/60 to-slate-955/95 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-850">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-305 text-xs font-black uppercase tracking-wider rounded-full border border-indigo-400/30 flex items-center gap-1.5 animate-pulse">
              <BarChart3 className="w-3.5 h-3.5" /> Module 14 Reports & Analytics
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Chart.js Engine Active
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">System Analytics & Insight Metrics</h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl font-semibold leading-relaxed">
            Real-time interactive intelligence powered by MongoDB-style aggregation pipelines. Monitor user signups, target career choices, skill demand ratios, and user satisfaction ratings.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Time Filter */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-850">
            {(["7d", "30d", "6m", "all"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeRange === r
                    ? "bg-indigo-650 text-indigo-100 border border-indigo-500/20 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {r === "7d" ? "7D" : r === "30d" ? "30D" : r === "6m" ? "6M" : "All"}
              </button>
            ))}
          </div>

          <button
            onClick={loadAnalytics}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-semibold transition-all border border-slate-850 flex items-center gap-1.5 cursor-pointer"
            title="Refresh Analytics Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-emerald-650 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/10 flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 premium-card space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Total User Accounts</span>
            <Users className="w-4 h-4 text-indigo-400 animate-pulse" />
          </div>
          <p className="text-2xl font-black text-white">
            {data?.userGrowthData[data.userGrowthData.length - 1]?.users || 78}
          </p>
          <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +26% Growth this quarter
          </p>
        </div>

        <div className="p-5 premium-card space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Target Career Choices</span>
            <Briefcase className="w-4 h-4 text-emerald-450 animate-pulse" />
          </div>
          <p className="text-2xl font-black text-white">
            {data?.careerChoicesData.length || 7} Roles
          </p>
          <p className="text-[11px] text-slate-500 font-bold">Top: {data?.careerChoicesData[0]?.career || "Software Engineer"}</p>
        </div>

        <div className="p-5 premium-card space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Popular Skills Catalog</span>
            <Code2 className="w-4 h-4 text-cyan-405 animate-pulse" />
          </div>
          <p className="text-2xl font-black text-white">
            {data?.popularSkillsData.length || 8} Key Skills
          </p>
          <p className="text-[11px] text-slate-500 font-bold">Highest Demand: React.js & LLM</p>
        </div>

        <div className="p-5 premium-card space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Satisfaction Rate</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">
            {data?.feedbackRatingsData.averageRating || 4.8} / 5.0
          </p>
          <p className="text-[11px] text-emerald-400 font-bold">
            {data?.feedbackRatingsData.satisfactionRate || 92}% Positive Feedback
          </p>
        </div>
      </div>

      {/* Chart Category Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-850">
        {[
          { id: "all", label: "All Analytical Charts", icon: Layers },
          { id: "users", label: "Users Growth Chart", icon: Users },
          { id: "careers", label: "Career Choices Chart", icon: Briefcase },
          { id: "skills", label: "Popular Skills Radar & Bar", icon: Code2 },
          { id: "feedback", label: "Feedback Ratings Chart", icon: Star },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeChartTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveChartTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? "bg-indigo-650 text-indigo-300 border border-indigo-500/20 shadow-md shadow-indigo-600/10"
                  : "bg-slate-900/50 text-slate-400 border border-slate-850 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CHART 1: USERS GROWTH CHART */}
        {(activeChartTab === "all" || activeChartTab === "users") && (
          <div className="p-6 premium-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" /> Users Growth & Active Velocity
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Aggregation of cumulative signups and active user trends
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 text-[10px] font-bold border border-indigo-500/20 animate-pulse">
                Line Chart
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <Line data={usersChartData} options={lineOptions} />
            </div>
          </div>
        )}

        {/* CHART 2: CAREER CHOICES CHART */}
        {(activeChartTab === "all" || activeChartTab === "careers") && (
          <div className="p-6 premium-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" /> Career Choices Distribution
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Target role selections aggregated from registered user profiles
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/20 animate-pulse">
                Doughnut
              </span>
            </div>

            <div className="h-72 w-full pt-2 flex items-center justify-center">
              <Doughnut data={careerChoicesChartData} options={doughnutOptions} />
            </div>
          </div>
        )}

        {/* CHART 3: POPULAR SKILLS RADAR CHART */}
        {(activeChartTab === "all" || activeChartTab === "skills") && (
          <div className="p-6 premium-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" /> Popular Skills Radar Analysis
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Comparison between industry demand score and user talent density
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-300 text-[10px] font-bold border border-cyan-500/20 animate-pulse">
                Radar Chart
              </span>
            </div>

            <div className="h-72 w-full pt-2 flex items-center justify-center">
              <Radar data={popularSkillsChartData} options={radarOptions} />
            </div>
          </div>
        )}

        {/* CHART 4: POPULAR SKILLS BAR CHART */}
        {(activeChartTab === "all" || activeChartTab === "skills") && (
          <div className="p-6 premium-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" /> Popular Skills Frequency
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  User possession count vs market demand score per skill
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 text-[10px] font-bold border border-indigo-500/20 animate-pulse">
                Bar Chart
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <Bar data={popularSkillsBarData} options={lineOptions} />
            </div>
          </div>
        )}

        {/* CHART 5: FEEDBACK RATINGS POLAR AREA CHART */}
        {(activeChartTab === "all" || activeChartTab === "feedback") && (
          <div className="p-6 premium-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" /> Feedback Ratings Histogram
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Distribution of star ratings across submitted user feedback
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/20 animate-pulse">
                Polar Area
              </span>
            </div>

            <div className="h-72 w-full pt-2 flex items-center justify-center">
              <PolarArea data={feedbackRatingsChartData} options={doughnutOptions} />
            </div>
          </div>
        )}

        {/* CHART 6: ASSESSMENT & RESUME PERFORMANCE BENCHMARKS */}
        {(activeChartTab === "all" || activeChartTab === "feedback") && (
          <div className="p-6 premium-card space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400 animate-pulse" /> Platform AI Performance Metrics
            </h3>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span>Average Career Fit Match Score</span>
                  <span className="text-indigo-400">
                    {data?.performanceMetrics.avgMatchScore}% Match
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000 shadow-md shadow-indigo-500/30"
                    style={{ width: `${data?.performanceMetrics.avgMatchScore || 86}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span>Average ATS Resume Score</span>
                  <span className="text-emerald-400">
                    {data?.performanceMetrics.avgAtsScore}% ATS Score
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-md shadow-emerald-500/30"
                    style={{ width: `${data?.performanceMetrics.avgAtsScore || 78}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-850 grid grid-cols-2 gap-4 text-center">
                <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-850">
                  <p className="text-lg font-black text-white">
                    {data?.performanceMetrics.totalResumesAnalyzed}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold">Resumes Analyzed</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-850">
                  <p className="text-lg font-black text-white">
                    {data?.performanceMetrics.totalRoadmapsGenerated}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold">Roadmaps Generated</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
