import { ENV } from "./env.js";
import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "data-store.json");

// Custom Map class that automatically saves data to disk on changes
class AutoSavingMap<K, V> extends Map<K, V> {
  private saveCallback: () => void;

  constructor(saveCallback: () => void, entries?: readonly (readonly [K, V])[] | null) {
    super(entries);
    this.saveCallback = saveCallback;
  }

  set(key: K, value: V): this {
    super.set(key, value);
    this.saveCallback();
    return this;
  }

  delete(key: K): boolean {
    const res = super.delete(key);
    if (res) {
      this.saveCallback();
    }
    return res;
  }

  clear(): void {
    super.clear();
    this.saveCallback();
  }
}

// In-Memory & Persistent Storage Engine for User Data, Assessments, Roadmaps & Bookmarks
export interface IUserDoc {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  role?: "admin" | "user";
  isBlocked?: boolean;
  phone?: string;
  targetRole?: string;
  skills: string[];
  experienceLevel?: string;
  experience?: string;
  education?: string;
  college?: string;
  degree?: string;
  interests?: string[];
  preferredLocation?: string;
  preferredIndustry?: string;
  careerGoal?: string;
  languages?: string[];
  linkedin?: string;
  github?: string;
  bio?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: string;
  createdAt: string;
}

export interface IAssessmentDoc {
  id: string;
  userId: string;
  quizData: {
    skills: string[];
    interests: string[];
    education: string;
    experienceYears: string;
    preferredLocation?: string;
    workStyle: string;
    values: string[];
    preferredIndustry: string;
  };
  recommendations: Array<{
    id: string;
    title: string;
    matchScore: number;
    description: string;
    salaryRange: string;
    growthOutlook: string;
    requiredSkills: string[];
    missingSkills: string[];
    whyGoodFit: string;
    suitableCertifications?: string[];
    careerRoadmap?: string[];
    keyResponsibilities: string[];
  }>;
  createdAt: string;
}

export interface IRoadmapDoc {
  id: string;
  userId: string;
  careerTitle: string;
  overallTimeline: string;
  phases: Array<{
    phaseNumber: number;
    title: string;
    duration: string;
    description: string;
    skillsToMaster: string[];
    recommendedProjects: string[];
    certifications: string[];
    freeResources: Array<{ name: string; url: string; type: string }>;
    completed?: boolean;
  }>;
  createdAt: string;
}

export interface IResumeDoc {
  id: string;
  userId: string;
  targetRole: string;
  resumeText: string;
  fileName?: string;
  candidateName?: string;
  overallScore: number;
  atsScore: number;
  missingKeywords: string[];
  grammarErrors: Array<{ issue: string; correction: string; context?: string }>;
  formatting: {
    rating: string;
    layoutScore: number;
    feedback: string[];
  };
  resumeStrength: string[];
  weaknesses: string[];
  suggestions: Array<{ original: string; suggested: string; reason: string }>;
  strengths?: string[];
  criticalGaps?: string[];
  formattingAdvice?: string[];
  keywordOptimization?: string[];
  lineByLineSuggestions?: Array<{ original: string; suggested: string; reason: string }>;
  createdAt: string;
}

export interface IInterviewDoc {
  id: string;
  userId: string;
  targetRole: string;
  experienceLevel: string;
  questions: Array<{
    id: string;
    type: "technical" | "behavioral" | "situational";
    question: string;
    context: string;
    idealAnswerOutline: string[];
    keyKeywords: string[];
  }>;
  createdAt: string;
}

export interface IBookmarkDoc {
  id: string;
  userId: string;
  itemType: "career" | "roadmap" | "resource";
  title: string;
  data: any;
  createdAt: string;
}

export interface ISkillGapDoc {
  id: string;
  userId: string;
  targetRole: string;
  currentSkills: string[];
  requiredSkills: string[];
  overallReadiness: number;
  totalRequiredCount: number;
  matchedCount: number;
  missingCount: number;
  matchedSkills: string[];
  missingSkillsDetails: Array<{
    skillName: string;
    priorityLevel: "High" | "Medium" | "Low";
    estimatedLearningTime: string;
    description: string;
    recommendedCourses: Array<{
      title: string;
      platform: string;
      url: string;
      level: "Beginner" | "Intermediate" | "Advanced";
      duration: string;
    }>;
  }>;
  categoryBreakdown: Array<{
    category: string;
    matchedCount: number;
    totalCount: number;
    percentage: number;
  }>;
  actionableSummary: string;
  createdAt: string;
}

export interface IFeedbackDoc {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  rating: number;
  category: string;
  feedbackText: string;
  createdAt: string;
}

export interface IManagedCareerDoc {
  id: string;
  title: string;
  category: string;
  avgSalary: string;
  growthOutlook: string;
  demandLevel: "Very High" | "High" | "Moderate";
  requiredSkills: string[];
  description: string;
  activeJobsCount: number;
  createdAt: string;
}

export interface IManagedCourseDoc {
  id: string;
  title: string;
  provider: string;
  type: "Free" | "Paid" | "Certification";
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  category: string;
  rating: number;
  courseUrl: string;
  createdAt: string;
}

// Added from Project 1 schemas for complete merge
export interface IAnnouncementDoc {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface IChatMessage {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface IChatHistoryDoc {
  id: string;
  userId: string;
  messages: IChatMessage[];
  updatedAt: string;
}

export interface IActivityLogDoc {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  action: string;
  timestamp: string;
}

export interface INotificationDoc {
  id: string;
  type: "user_registered" | "feedback_submitted";
  message: string;
  read: boolean;
  createdAt: string;
}

// In-Memory Database collections with file-persistence
class LocalDataStore {
  private isSavingDisabled = false;

  users = new AutoSavingMap<string, IUserDoc>(() => this.autoSave());
  assessments = new AutoSavingMap<string, IAssessmentDoc>(() => this.autoSave());
  roadmaps = new AutoSavingMap<string, IRoadmapDoc>(() => this.autoSave());
  resumes = new AutoSavingMap<string, IResumeDoc>(() => this.autoSave());
  interviews = new AutoSavingMap<string, IInterviewDoc>(() => this.autoSave());
  bookmarks = new AutoSavingMap<string, IBookmarkDoc>(() => this.autoSave());
  skillGaps = new AutoSavingMap<string, ISkillGapDoc>(() => this.autoSave());
  feedbacks = new AutoSavingMap<string, IFeedbackDoc>(() => this.autoSave());
  careers = new AutoSavingMap<string, IManagedCareerDoc>(() => this.autoSave());
  courses = new AutoSavingMap<string, IManagedCourseDoc>(() => this.autoSave());
  announcements = new AutoSavingMap<string, IAnnouncementDoc>(() => this.autoSave());
  chatHistory = new AutoSavingMap<string, IChatHistoryDoc>(() => this.autoSave());
  activityLogs = new AutoSavingMap<string, IActivityLogDoc>(() => this.autoSave());
  notifications = new AutoSavingMap<string, INotificationDoc>(() => this.autoSave());

  constructor() {
    this.seed();
  }

  private autoSave() {
    if (!this.isSavingDisabled) {
      this.save();
    }
  }

  // Load from data-store.json
  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        this.isSavingDisabled = true;
        const dataStr = fs.readFileSync(DB_FILE, "utf-8");
        const data = JSON.parse(dataStr);

        this.users.clear();
        if (data.users) data.users.forEach((u: IUserDoc) => this.users.set(u.id, u));

        this.assessments.clear();
        if (data.assessments) data.assessments.forEach((a: IAssessmentDoc) => this.assessments.set(a.id, a));

        this.roadmaps.clear();
        if (data.roadmaps) data.roadmaps.forEach((r: IRoadmapDoc) => this.roadmaps.set(r.id, r));

        this.resumes.clear();
        if (data.resumes) data.resumes.forEach((r: IResumeDoc) => this.resumes.set(r.id, r));

        this.interviews.clear();
        if (data.interviews) data.interviews.forEach((i: IInterviewDoc) => this.interviews.set(i.id, i));

        this.bookmarks.clear();
        if (data.bookmarks) data.bookmarks.forEach((b: IBookmarkDoc) => this.bookmarks.set(b.id, b));

        this.skillGaps.clear();
        if (data.skillGaps) data.skillGaps.forEach((s: ISkillGapDoc) => this.skillGaps.set(s.id, s));

        this.feedbacks.clear();
        if (data.feedbacks) data.feedbacks.forEach((f: IFeedbackDoc) => this.feedbacks.set(f.id, f));

        this.careers.clear();
        if (data.careers) data.careers.forEach((c: IManagedCareerDoc) => this.careers.set(c.id, c));

        this.courses.clear();
        if (data.courses) data.courses.forEach((c: IManagedCourseDoc) => this.courses.set(c.id, c));

        this.announcements.clear();
        if (data.announcements) data.announcements.forEach((a: IAnnouncementDoc) => this.announcements.set(a.id, a));

        this.chatHistory.clear();
        if (data.chatHistory) data.chatHistory.forEach((c: IChatHistoryDoc) => this.chatHistory.set(c.id, c));

        this.activityLogs.clear();
        if (data.activityLogs) data.activityLogs.forEach((a: IActivityLogDoc) => this.activityLogs.set(a.id, a));

        this.notifications.clear();
        if (data.notifications) data.notifications.forEach((n: INotificationDoc) => this.notifications.set(n.id, n));

        this.isSavingDisabled = false;
        console.log(`[Database] Load complete. Synced database schemas with ${DB_FILE}`);
      } else {
        console.log(`[Database] No data-store.json found. Creating initial store with seed data.`);
        this.save();
      }
    } catch (err) {
      this.isSavingDisabled = false;
      console.error("[Database] Error loading database file:", err);
    }
  }

  // Save to data-store.json
  save() {
    try {
      const data = {
        users: Array.from(this.users.values()),
        assessments: Array.from(this.assessments.values()),
        roadmaps: Array.from(this.roadmaps.values()),
        resumes: Array.from(this.resumes.values()),
        interviews: Array.from(this.interviews.values()),
        bookmarks: Array.from(this.bookmarks.values()),
        skillGaps: Array.from(this.skillGaps.values()),
        feedbacks: Array.from(this.feedbacks.values()),
        careers: Array.from(this.careers.values()),
        courses: Array.from(this.courses.values()),
        announcements: Array.from(this.announcements.values()),
        chatHistory: Array.from(this.chatHistory.values()),
        activityLogs: Array.from(this.activityLogs.values()),
        notifications: Array.from(this.notifications.values()),
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("[Database] Error writing to database file:", err);
    }
  }

  seed() {
    // Seed Admin Account
    const adminUser: IUserDoc = {
      id: "user-admin-001",
      name: "System Administrator",
      email: "admin@career.ai",
      passwordHash: "$2a$10$3z7G9aK5oZ72X4f.fN52v.J50X56jP4A53X64eZ0Z5.Y47A13X12G", // bcrypt hash for "admin123"
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      role: "admin",
      isBlocked: false,
      targetRole: "Chief Technology Officer",
      skills: ["System Architecture", "Security", "AI Strategy", "Database Engineering"],
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    };
    this.users.set(adminUser.id, adminUser);

    // Seed demo user
    const demoUser: IUserDoc = {
      id: "user-demo-123",
      name: "Alex Morgan",
      email: "alex@example.com",
      role: "user",
      isBlocked: false,
      passwordHash: "$2a$10$w0u3Nq50p6hP4C7QvYt.8u0A2d3a3E.m7P5Q1I3K.vN0Y.uE9m2aG", // bcrypt hash for "password123"
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      phone: "+1 (555) 234-5678",
      targetRole: "Full Stack Engineer",
      skills: ["React", "TypeScript", "Node.js", "Express", "Tailwind CSS"],
      experienceLevel: "Intermediate",
      experience: "2 Years (Projects & Internships)",
      education: "Bachelor's Degree",
      college: "Stanford University",
      degree: "B.S. Computer Science",
      interests: ["AI Systems", "Full Stack Development", "Cloud Architecture"],
      preferredLocation: "San Francisco, CA (or Remote)",
      careerGoal: "Lead AI Engineer in a high-growth technology startup",
      languages: ["English (Native)", "Spanish (Conversational)"],
      linkedin: "https://linkedin.com/in/alex-morgan-dev",
      github: "https://github.com/alexmorgan-dev",
      bio: "Aspiring AI Full Stack Developer looking to master modern web stacks & AI integration.",
      createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    };
    this.users.set(demoUser.id, demoUser);

    // Seed secondary demo users
    const user2: IUserDoc = {
      id: "user-demo-456",
      name: "Sarah Chen",
      email: "sarah.c@techdev.org",
      role: "user",
      isBlocked: false,
      passwordHash: "$2a$10$w0u3Nq50p6hP4C7QvYt.8u0A2d3a3E.m7P5Q1I3K.vN0Y.uE9m2aG",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      targetRole: "Data Scientist",
      skills: ["Python", "TensorFlow", "Pandas", "SQL"],
      experienceLevel: "Senior",
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    };
    this.users.set(user2.id, user2);

    // Seed initial managed careers
    const initialCareers: IManagedCareerDoc[] = [
      {
        id: "car-1",
        title: "Full Stack AI Engineer",
        category: "Software Development",
        avgSalary: "₹15,00,000 - ₹28,00,000/year",
        growthOutlook: "+28% (2024-2030)",
        demandLevel: "Very High",
        requiredSkills: ["React", "TypeScript", "Node.js", "Python", "LLMs", "PostgreSQL"],
        description: "Designs, builds, and deploys scalable web applications powered by generative AI models and intelligent backend microservices.",
        activeJobsCount: 14200,
        createdAt: new Date().toISOString(),
      },
      {
        id: "car-2",
        title: "Cloud Solutions Architect",
        category: "Cloud & DevOps",
        avgSalary: "₹18,00,000 - ₹32,00,000/year",
        growthOutlook: "+24% (2024-2030)",
        demandLevel: "Very High",
        requiredSkills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Security"],
        description: "Architects resilient, secure, and cost-optimized cloud infrastructure on AWS, Google Cloud, and Azure platforms.",
        activeJobsCount: 9800,
        createdAt: new Date().toISOString(),
      },
      {
        id: "car-3",
        title: "Cybersecurity Specialist",
        category: "Information Security",
        avgSalary: "₹12,00,000 - ₹25,00,000/year",
        growthOutlook: "+32% (2024-2030)",
        demandLevel: "Very High",
        requiredSkills: ["Penetration Testing", "SIEM", "Network Security", "Python", "Risk Assessment"],
        description: "Protects organizational assets and cloud networks against cyber threats, data breaches, and vulnerability exploits.",
        activeJobsCount: 11500,
        createdAt: new Date().toISOString(),
      },
    ];
    initialCareers.forEach((c) => this.careers.set(c.id, c));

    // Seed initial managed courses
    const initialCourses: IManagedCourseDoc[] = [
      {
        id: "crs-1",
        title: "Full Stack React & Node.js Masterclass",
        provider: "Coursera / Meta",
        type: "Free",
        level: "Intermediate",
        duration: "6 Weeks",
        category: "Web Development",
        rating: 4.9,
        courseUrl: "https://www.coursera.org",
        createdAt: new Date().toISOString(),
      },
      {
        id: "crs-2",
        title: "AWS Certified Solutions Architect Associate",
        provider: "AWS Training & Certification",
        type: "Certification",
        level: "Intermediate",
        duration: "8 Weeks",
        category: "Cloud Computing",
        rating: 4.8,
        courseUrl: "https://aws.amazon.com/certification/",
        createdAt: new Date().toISOString(),
      },
      {
        id: "crs-3",
        title: "Applied Machine Learning with Python",
        provider: "DeepLearning.AI",
        type: "Paid",
        level: "Advanced",
        duration: "10 Weeks",
        category: "Data Science & AI",
        rating: 4.9,
        courseUrl: "https://www.deeplearning.ai",
        createdAt: new Date().toISOString(),
      },
    ];
    initialCourses.forEach((crs) => this.courses.set(crs.id, crs));

    // Seed initial demo feedback items
    const initialFeedbacks: IFeedbackDoc[] = [
      {
        id: "fb-1",
        userId: "user-demo-123",
        userName: "Alex Morgan",
        userEmail: "alex@example.com",
        rating: 5,
        category: "AI Career Guidance",
        feedbackText: "The AI Career Roadmap and Skill Gap Analysis are remarkably accurate! It accurately pinpointed my missing cloud architecture skills.",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "fb-2",
        userName: "Sarah Chen",
        userEmail: "sarah.c@techdev.org",
        rating: 5,
        category: "Mock Interviews",
        feedbackText: "The real-time AI mock interview questions gave me so much confidence before my Senior React developer interview. Highly recommended!",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: "fb-3",
        userName: "David K.",
        userEmail: "david.k@cloudnet.io",
        rating: 4,
        category: "Course & Job Recommendations",
        feedbackText: "Great curated list of free and paid certifications. Helped me pick my AWS Cloud Architect path effortlessly.",
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
    ];
    initialFeedbacks.forEach((fb) => this.feedbacks.set(fb.id, fb));

    // Seed default announcement
    const defaultAnn: IAnnouncementDoc = {
      id: "ann-1",
      title: "System Launch",
      content: "Welcome to the AI Career Guidance platform! Fill out your profile and start your Skill Assessment today.",
      date: new Date().toISOString().split("T")[0],
      author: "System Admin"
    };
    this.announcements.set(defaultAnn.id, defaultAnn);
  }
}

export const dbStore = new LocalDataStore();

export const connectDB = async () => {
  console.log(`[Database] Using production-ready local database engine.`);
  dbStore.load();
  
  if (!dbStore.users.has("guest-user")) {
    dbStore.users.set("guest-user", {
      id: "guest-user",
      name: "Guest Explorer",
      email: "guest@example.com",
      passwordHash: "",
      role: "user",
      targetRole: "Full Stack Software Engineer",
      skills: ["React", "JavaScript", "HTML/CSS", "Python", "Problem Solving"],
      experienceLevel: "Entry Level",
      education: "Bachelor's Degree",
      interests: ["AI", "Full Stack"],
      createdAt: new Date().toISOString()
    });
    dbStore.save();
  }
};
