export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: "admin" | "user";
  isBlocked?: boolean;
  targetRole?: string;
  skills: string[];
  experienceLevel?: string;
  experience?: string;
  education?: string;
  college?: string;
  degree?: string;
  interests?: string[];
  preferredLocation?: string;
  careerGoal?: string;
  languages?: string[];
  linkedin?: string;
  github?: string;
  bio?: string;
  createdAt: string;
}

export interface CareerRecommendation {
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
}

export interface AssessmentData {
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
  recommendations: CareerRecommendation[];
  createdAt: string;
}

export interface RoadmapResource {
  name: string;
  url: string;
  type: string;
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  duration: string;
  description: string;
  skillsToMaster: string[];
  recommendedProjects: string[];
  certifications: string[];
  freeResources: RoadmapResource[];
  completed?: boolean;
}

export interface RoadmapData {
  id: string;
  userId: string;
  careerTitle: string;
  overallTimeline: string;
  phases: RoadmapPhase[];
  createdAt: string;
}

export interface LineSuggestion {
  original: string;
  suggested: string;
  reason: string;
}

export interface GrammarErrorItem {
  issue: string;
  correction: string;
  context?: string;
}

export interface FormattingAnalysis {
  rating: string;
  layoutScore: number;
  feedback: string[];
}

export interface ResumeAnalysisData {
  id: string;
  userId: string;
  targetRole: string;
  resumeText: string;
  fileName?: string;
  candidateName?: string;
  overallScore: number;
  atsScore: number;
  missingKeywords: string[];
  grammarErrors: GrammarErrorItem[];
  formatting: FormattingAnalysis;
  resumeStrength: string[];
  weaknesses: string[];
  suggestions: LineSuggestion[];
  // Optional compatibility fields
  strengths?: string[];
  criticalGaps?: string[];
  formattingAdvice?: string[];
  keywordOptimization?: string[];
  lineByLineSuggestions?: LineSuggestion[];
  createdAt: string;
}

export interface InterviewQuestion {
  id: string;
  type: "technical" | "hr" | "behavioral" | "situational";
  question: string;
  context: string;
  sampleAnswer?: string;
  idealAnswerOutline: string[];
  keyKeywords: string[];
}

export interface InterviewAnswerEvaluation {
  questionId: string;
  userAnswer: string;
  score: number;
  feedbackSummary: string;
  strengths: string[];
  areasToImprove: string[];
  keyKeywordsCovered: string[];
  missingKeywords: string[];
  improvedAnswer: string;
}

export interface InterviewPrepData {
  id: string;
  userId: string;
  targetRole: string;
  experienceLevel: string;
  questions: InterviewQuestion[];
  createdAt: string;
}

export interface MarketInsightData {
  role: string;
  averageSalary: string;
  topPayingIndustries: string[];
  jobOpeningsGrowth: string;
  topDemandedSkills: { name: string; demandPercent: number }[];
  yearlySalaryTrend: { year: string; salary: number }[];
  topHiringCities: string[];
  keyAdvice: string;
}

export interface SkillGapCourse {
  title: string;
  platform: string;
  url: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
}

export interface MissingSkillDetail {
  skillName: string;
  priorityLevel: "High" | "Medium" | "Low";
  estimatedLearningTime: string;
  description: string;
  recommendedCourses: SkillGapCourse[];
}

export interface CategoryReadiness {
  category: string;
  matchedCount: number;
  totalCount: number;
  percentage: number;
}

export interface SkillGapData {
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
  missingSkillsDetails: MissingSkillDetail[];
  categoryBreakdown: CategoryReadiness[];
  actionableSummary: string;
  createdAt: string;
}

export interface JobRecommendation {
  id: string;
  company: string;
  companyLogo?: string;
  jobTitle: string;
  salary: string;
  location: string;
  jobType: "Full-time" | "Part-time" | "Contract" | "Remote";
  experience: string;
  education: string;
  skillsRequired: string[];
  matchPercentage: number;
  applyLink: string;
  description: string;
  postedDate: string;
}

export interface JobRecommendationResponse {
  userCriteria: {
    skills: string[];
    education: string;
    experience: string;
    location: string;
  };
  jobs: JobRecommendation[];
}

export interface CourseRecommendation {
  id: string;
  title: string;
  provider: string;
  type: "Free" | "Paid" | "Certification";
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  reviewCount?: number;
  courseUrl: string;
  imageUrl: string;
  description: string;
  skillsCovered: string[];
  priceInfo?: string;
}

export interface CourseRecommendationResponse {
  careerGoal: string;
  missingSkills: string[];
  freeCourses: CourseRecommendation[];
  paidCourses: CourseRecommendation[];
  certifications: CourseRecommendation[];
}

export interface FeedbackItem {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  rating: number; // 1 to 5
  category: string;
  feedbackText: string;
  createdAt: string;
}

export interface FeedbackInput {
  userName?: string;
  userEmail?: string;
  rating: number;
  category?: string;
  feedbackText: string;
}

export interface BookmarkItem {
  id: string;
  userId: string;
  itemType: "career" | "roadmap" | "resource";
  title: string;
  data: any;
  createdAt: string;
}

export interface ManagedCareer {
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

export interface ManagedCourse {
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

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalRoadmaps: number;
  totalResumesAnalyzed: number;
  totalAssessmentsTaken: number;
  totalFeedbackCount: number;
  averageFeedbackRating: number;
  roleDistribution: { roleName: string; count: number }[];
  userSignupTrends: { month: string; signups: number }[];
  atsScoreDistribution: { range: string; count: number }[];
}

