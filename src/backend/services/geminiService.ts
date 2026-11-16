import { GoogleGenAI } from "@google/genai";
import { ENV } from "../config/env.js";

const getAiClient = () => {
  const apiKey = ENV.GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    return {
      models: {
        generateContent: async () => {
          throw new Error("API key should be set when using the Gemini API. Fallback triggered.");
        }
      }
    } as any;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

export interface CareerQuizInput {
  skills: string[];
  interests: string[];
  education: string;
  experienceYears: string;
  preferredLocation?: string;
  workStyle?: string;
  values?: string[];
  preferredIndustry?: string;
}

export const generateCareerRecommendations = async (input: CareerQuizInput) => {
  const ai = getAiClient();
  const prompt = `You are an expert AI Career Guidance Counselor.
Analyze the following candidate profile and provide 4 highly accurate, high-fit career path recommendations.

Candidate Profile:
- Current Skills: ${input.skills.join(", ") || "General computer literacy, problem solving"}
- Passions/Interests: ${input.interests.join(", ") || "Technology, innovation"}
- Education: ${input.education}
- Work Experience: ${input.experienceYears}
- Preferred Location: ${input.preferredLocation || "San Francisco / Remote"}
- Work Style: ${input.workStyle || "Hybrid / Remote"}
- Work Values: ${(input.values && input.values.join(", ")) || "Growth, stability"}
- Preferred Industry: ${input.preferredIndustry || "Tech"}

Return a JSON array of career recommendations. Each object in the array MUST strictly have:
- "id": string (unique slug like "full-stack-dev")
- "title": string (e.g. "Full Stack Software Engineer")
- "matchScore": number (80 to 98)
- "description": string (2-3 concise sentences)
- "salaryRange": string (e.g. "₹8,00,000 - ₹15,00,000/year" in Indian Rupees (₹) using Indian number formatting and realistic Indian IT industry salary standards depending on the career)
- "growthOutlook": string (Future Demand, e.g. "28% growth (High Demand)")
- "requiredSkills": array of strings (top essential skills)
- "missingSkills": array of strings (skills the candidate should acquire)
- "whyGoodFit": string (Reason: personalized rationale based on candidate profile)
- "suitableCertifications": array of strings (2-3 highly recognized certifications)
- "careerRoadmap": array of strings (3-4 concise sequential milestone phases)
- "keyResponsibilities": array of strings (3-4 bullet points)
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "Always return valid, clean JSON without code fences.",
      },
    });

    const text = response.text || "[]";
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : parsed.recommendations || [];
  } catch (error: any) {
    const isQuotaError = error?.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.message?.includes("quota") || error?.toString()?.includes("429");
    if (isQuotaError) {
      console.warn("Gemini API rate limit reached (429). Utilizing fallback AI recommendation engine.");
    } else {
      console.error("Gemini Career Recommendation Error:", error?.message || error);
    }
    // Return high quality fallback response if API key is not configured or fails
    return [
      {
        id: "ai-fullstack-dev",
        title: "AI Full-Stack Developer",
        matchScore: 94,
        description: "Build end-to-end web applications powered by generative AI models, vector search, and scalable backend services.",
        salaryRange: "₹12,00,000 - ₹22,00,000/year",
        growthOutlook: "28% growth (High Demand)",
        requiredSkills: ["React", "TypeScript", "Node.js", "Gemini API", "Python", "Tailwind CSS"],
        missingSkills: ["Vector Databases", "LangChain/LlamaIndex", "Model Fine-tuning"],
        whyGoodFit: "Your background in web development and passion for modern tech aligns directly with building next-gen AI applications.",
        suitableCertifications: [
          "AWS Certified Developer Associate",
          "Google Cloud Professional Cloud Developer",
          "Meta Front-End Developer Professional Certificate"
        ],
        careerRoadmap: [
          "Phase 1: Master Modern Full-Stack (React 19, TypeScript, Express)",
          "Phase 2: LLM API Integration & Serverless AI Workflows",
          "Phase 3: Vector Databases & RAG System Architecture",
          "Phase 4: Cloud Deployment, CI/CD & Production Scalability"
        ],
        keyResponsibilities: [
          "Design responsive user interfaces for modern web tools",
          "Integrate LLMs and server-side API endpoints",
          "Deploy microservices and cloud databases",
        ],
      },
      {
        id: "data-scientist-ai",
        title: "Data & Machine Learning Engineer",
        matchScore: 88,
        description: "Transform complex data streams into actionable predictive models and automated intelligent features.",
        salaryRange: "₹15,00,000 - ₹26,00,000/year",
        growthOutlook: "24% growth (Very High Demand)",
        requiredSkills: ["Python", "SQL", "Pandas", "Scikit-Learn", "PyTorch", "Data Visualization"],
        missingSkills: ["PyTorch", "Feature Engineering", "MLOps"],
        whyGoodFit: "Strong analytical mindset and interest in algorithms make ML engineering a lucrative long-term path.",
        suitableCertifications: [
          "TensorFlow Developer Certificate",
          "AWS Certified Machine Learning - Specialty",
          "Databricks Certified Machine Learning Professional"
        ],
        careerRoadmap: [
          "Phase 1: Python, Math Fundamentals & Data Wrangling",
          "Phase 2: Supervised/Unsupervised Learning Models",
          "Phase 3: Deep Learning, PyTorch & NLP Models",
          "Phase 4: MLOps, Model Monitoring & Production Serving"
        ],
        keyResponsibilities: [
          "Preprocess structured and unstructured datasets",
          "Train, evaluate, and tune machine learning models",
          "Monitor model performance in production pipelines",
        ],
      },
      {
        id: "cloud-devops-engineer",
        title: "Cloud & AI Infrastructure Engineer",
        matchScore: 85,
        description: "Manage scalable cloud deployment pipelines, container orchestration, and serverless architectures.",
        salaryRange: "₹10,50,000 - ₹20,00,000/year",
        growthOutlook: "20% growth (Steady High Demand)",
        requiredSkills: ["Docker", "Kubernetes", "AWS/GCP", "CI/CD", "Terraform", "Linux"],
        missingSkills: ["Kubernetes", "Terraform", "Cloud Security"],
        whyGoodFit: "Suited for engineers who value system architecture, uptime reliability, and infrastructure automation.",
        suitableCertifications: [
          "Certified Kubernetes Administrator (CKA)",
          "AWS Certified Solutions Architect",
          "HashiCorp Certified Terraform Associate"
        ],
        careerRoadmap: [
          "Phase 1: Linux Administration & Bash Shell Scripting",
          "Phase 2: Containerization with Docker & CI/CD Pipelines",
          "Phase 3: Kubernetes Cluster Management & Terraform IaC",
          "Phase 4: Multi-Cloud Reliability Engineering & Observability"
        ],
        keyResponsibilities: [
          "Build automated CI/CD deployment pipelines",
          "Manage Docker containers and Kubernetes clusters",
          "Optimize cloud infrastructure cost and latency",
        ],
      },
      {
        id: "product-manager-tech",
        title: "Technical AI Product Manager",
        matchScore: 82,
        description: "Bridge customer needs and engineering capabilities to launch innovative software products.",
        salaryRange: "₹14,00,000 - ₹24,00,000/year",
        growthOutlook: "18% growth",
        requiredSkills: ["Product Roadmap", "User Research", "Agile/Scrum", "Data Analytics", "Wireframing"],
        missingSkills: ["A/B Testing Frameworks", "Product Analytics (Mixpanel)"],
        whyGoodFit: "Great fit for professionals with strong communication, problem-solving, and strategic thinking.",
        suitableCertifications: [
          "Certified Scrum Product Owner (CSPO)",
          "Pragmatic Institute Certified Product Manager",
          "Google Data Analytics Professional Certificate"
        ],
        careerRoadmap: [
          "Phase 1: Product Discovery, User Research & Agile Frameworks",
          "Phase 2: Roadmap Definition, Technical Specifications & Metrics",
          "Phase 3: AI Product Design, Prototyping & UX Feedback Loops",
          "Phase 4: Product Launch Strategy, A/B Testing & Growth Optimization"
        ],
        keyResponsibilities: [
          "Define product vision and feature prioritization",
          "Collaborate with engineering and design teams",
          "Analyze key metrics and user feedback loops",
        ],
      },
    ];
  }
};

export const generateRoadmap = async (careerTitle: string, currentLevel: string) => {
  const ai = getAiClient();
  const prompt = `Create a detailed step-by-step career roadmap for becoming a successful "${careerTitle}" starting from "${currentLevel}" level.

Return a JSON object with:
- "careerTitle": string
- "overallTimeline": string (e.g. "6 to 9 Months")
- "phases": Array of 4 chronological phases, each with:
  - "phaseNumber": number (1 to 4)
  - "title": string (e.g. "Phase 1: Core Fundamentals & Tooling")
  - "duration": string (e.g. "Weeks 1 - 6")
  - "description": string (clear focus area)
  - "skillsToMaster": array of strings (4-6 key technical/soft skills)
  - "recommendedProjects": array of strings (2 practical portfolio projects)
  - "certifications": array of strings (1-2 recognized certifications or courses)
  - "freeResources": array of objects [{ "name": string, "url": string, "type": string }]
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error: any) {
    const isQuotaError = error?.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.message?.includes("quota") || error?.toString()?.includes("429");
    if (isQuotaError) {
      console.warn("Gemini API rate limit reached (429). Utilizing fallback roadmap engine.");
    } else {
      console.error("Gemini Roadmap Error:", error?.message || error);
    }
    return {
      careerTitle,
      overallTimeline: "6 Months",
      phases: [
        {
          phaseNumber: 1,
          title: "Phase 1: Foundations & Essential Tooling",
          duration: "Month 1 - 2",
          description: "Build strong core fundamentals and master development environment workflows.",
          skillsToMaster: ["HTML5/CSS3", "Modern JavaScript (ES6+)", "Git & GitHub", "Tailwind CSS"],
          recommendedProjects: ["Personal Portfolio Website", "Responsive Web Dashboard"],
          certifications: ["FreeCodeCamp Responsive Web Design", "Meta Front-End Certificate"],
          freeResources: [
            { name: "MDN Web Docs", url: "https://developer.mozilla.org", type: "Documentation" },
            { name: "JavaScript.info", url: "https://javascript.info", type: "Guide" },
          ],
        },
        {
          phaseNumber: 2,
          title: "Phase 2: Modern Frameworks & State Management",
          duration: "Month 3 - 4",
          description: "Master React, TypeScript, state design, and dynamic component architecture.",
          skillsToMaster: ["React 19", "TypeScript", "RESTful APIs", "React Query/Context"],
          recommendedProjects: ["Interactive Task Manager", "Real-Time Weather & Location App"],
          certifications: ["Scrimba Frontend Developer Career Path"],
          freeResources: [
            { name: "Official React Documentation", url: "https://react.dev", type: "Docs" },
            { name: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/", type: "Book" },
          ],
        },
        {
          phaseNumber: 3,
          title: "Phase 3: Backend Integration & Databases",
          duration: "Month 5",
          description: "Develop server-side logic, authentication, databases, and API security.",
          skillsToMaster: ["Node.js", "Express.js", "MongoDB/PostgreSQL", "JWT Authentication"],
          recommendedProjects: ["Full-Stack E-Commerce Portal", "AI Chat & Summary Platform"],
          certifications: ["Node.js Application Developer (JSNAD)"],
          freeResources: [
            { name: "Node.js Official Guides", url: "https://nodejs.org/en/docs/", type: "Docs" },
          ],
        },
        {
          phaseNumber: 4,
          title: "Phase 4: AI Integration, Deployment & Job Readiness",
          duration: "Month 6",
          description: "Integrate Gemini AI APIs, CI/CD, cloud hosting, resume building & mock interviews.",
          skillsToMaster: ["Google Gemini API", "Docker", "Cloud Run/Vercel", "Interview Prep"],
          recommendedProjects: ["AI Career Guidance Production Platform"],
          certifications: ["Google Cloud Certified Digital Leader"],
          freeResources: [
            { name: "Google AI Studio Docs", url: "https://ai.google.dev", type: "Official Docs" },
          ],
        },
      ],
    };
  }
};

export const analyzeResumeContent = async (resumeText: string, targetRole: string, pdfBase64?: string) => {
  const ai = getAiClient();
  const promptText = `You are an expert Executive Recruiter and AI Applicant Tracking System (ATS) Auditor.
Perform a thorough resume audit specifically for the target job role: "${targetRole || 'Software Engineer'}".

Evaluate the provided resume and return a strict JSON object with these exact fields:
{
  "candidateName": string (the candidate's full name extracted from the top of the resume, or "Not detected" if missing),
  "targetRole": string,
  "atsScore": number (0 to 100 rating ATS readability and keyword density),
  "overallScore": number (0 to 100 overall impact rating),
  "missingKeywords": array of strings (top essential ATS skills/keywords missing from resume),
  "grammarErrors": array of objects [
    {
      "issue": string (brief description of grammar/spelling/style flaw),
      "correction": string (corrected phrasing),
      "context": string (short excerpt where issue occurred)
    }
  ],
  "formatting": {
    "rating": string (e.g. "Optimal Single-Column", "Needs Structure", "Non-ATS Friendly Table Layout"),
    "layoutScore": number (0 to 100),
    "feedback": array of strings (3-4 specific font, margin, line-spacing, and section hierarchy fixes)
  },
  "resumeStrength": array of strings (4-5 key impressive highlights & strengths),
  "weaknesses": array of strings (3-4 vulnerabilities, vague statements, or missing metric proof),
  "suggestions": array of objects [
    {
      "original": string (original weak or generic bullet point),
      "suggested": string (high-impact, metric-driven action-verb rewrite),
      "reason": string (why this modification boosts ATS ranking)
    }
  ],
  "strengths": array of strings,
  "criticalGaps": array of strings,
  "formattingAdvice": array of strings,
  "keywordOptimization": array of strings,
  "lineByLineSuggestions": array of objects [{ "original": string, "suggested": string, "reason": string }]
}
`;

  try {
    let contents: any = promptText;

    if (pdfBase64) {
      // Clean base64 header if present
      const cleanBase64 = pdfBase64.includes(",") ? pdfBase64.split(",")[1] : pdfBase64;
      contents = [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: cleanBase64,
          },
        },
        promptText + (resumeText ? `\n\nAdditional Extracted Text Context:\n${resumeText}` : ""),
      ];
    } else {
      contents = promptText + `\n\nResume Content:\n${resumeText}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);

    // Normalize field aliases for backward and forward compatibility
    return {
      candidateName: data.candidateName || "Not detected",
      targetRole: data.targetRole || targetRole || "Software Engineer",
      atsScore: data.atsScore ?? data.overallScore ?? 78,
      overallScore: data.overallScore ?? data.atsScore ?? 82,
      missingKeywords: data.missingKeywords || data.keywordOptimization || ["TypeScript", "CI/CD", "Docker"],
      grammarErrors: data.grammarErrors || [
        { issue: "Passive verb usage", correction: "Spearheaded web development", context: "Worked on building software" }
      ],
      formatting: data.formatting || {
        rating: "Good Single-Column Layout",
        layoutScore: 85,
        feedback: [
          "Use standard section headings (Experience, Education, Skills)",
          "Maintain consistent bullet margins and font hierarchy",
          "Avoid multi-column tables or header icons that confuse ATS parsers"
        ]
      },
      resumeStrength: data.resumeStrength || data.strengths || [
        "Strong core technical skill stack",
        "Clear professional summary section"
      ],
      weaknesses: data.weaknesses || data.criticalGaps || [
        "Lacks quantifiable ROI metrics (percentages, revenue, time savings)",
        "Missing automated unit testing frameworks"
      ],
      suggestions: data.suggestions || data.lineByLineSuggestions || [
        {
          original: "Responsible for managing software applications.",
          suggested: "Architected and deployed enterprise microservices on AWS, reducing system latency by 30%.",
          reason: "Incorporates strong action verbs and measurable business outcome."
        }
      ],
      strengths: data.strengths || data.resumeStrength || ["Strong technical skills"],
      criticalGaps: data.criticalGaps || data.weaknesses || ["Missing metrics"],
      formattingAdvice: data.formattingAdvice || (data.formatting?.feedback ?? ["Use single column"]),
      keywordOptimization: data.keywordOptimization || data.missingKeywords || ["Docker"],
      lineByLineSuggestions: data.lineByLineSuggestions || data.suggestions || [],
    };
  } catch (error: any) {
    const isQuotaError = error?.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.message?.includes("quota") || error?.toString()?.includes("429");
    if (isQuotaError) {
      console.warn("Gemini API rate limit reached (429). Utilizing fallback resume analysis engine.");
    } else {
      console.error("Gemini Resume Analysis Error:", error?.message || error);
    }
    return generateDynamicFallback(resumeText, targetRole);
  }
};

export const generateDynamicFallback = (resumeText: string, targetRole: string) => {
  const roleLower = (targetRole || "").toLowerCase();
  
  let candidateName = "Not detected";
  if (resumeText) {
    const lines = resumeText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length > 0) {
      const firstLine = lines[0];
      const wordsCount = firstLine.split(/\s+/).length;
      if (wordsCount >= 1 && wordsCount <= 4 && !/[\d@.:]/.test(firstLine)) {
        candidateName = firstLine;
      } else if (lines.length > 1) {
        const secondLine = lines[1];
        const secondWordsCount = secondLine.split(/\s+/).length;
        if (secondWordsCount >= 1 && secondWordsCount <= 4 && !/[\d@.:]/.test(secondLine)) {
          candidateName = secondLine;
        }
      }
    }
  }

  // Define role keywords
  let keywordsList = [
    "React", "TypeScript", "JavaScript", "Node.js", "Express", "HTML", "CSS",
    "Git", "SQL", "MongoDB", "Docker", "AWS", "CI/CD", "Jest", "REST API", "Redux", "GraphQL", "Tailwind"
  ];

  if (roleLower.includes("data") || roleLower.includes("analyst") || roleLower.includes("science") || roleLower.includes("python")) {
    keywordsList = [
      "Python", "SQL", "Pandas", "NumPy", "Power BI", "Excel", "Tableau",
      "R", "Spark", "Hadoop", "Machine Learning", "Data Visualization", "Stats", "Keras", "TensorFlow", "PostgreSQL"
    ];
  } else if (roleLower.includes("product") || roleLower.includes("project") || roleLower.includes("manager") || roleLower.includes("agile")) {
    keywordsList = [
      "Agile", "Scrum", "Product Roadmap", "Jira", "A/B Testing", "User Stories",
      "KPIs", "Market Research", "Product Strategy", "Confluence", "Analytics", "Wireframing", "Product Launch"
    ];
  } else if (roleLower.includes("devops") || roleLower.includes("cloud") || roleLower.includes("infrastructure") || roleLower.includes("sre") || roleLower.includes("kubernetes")) {
    keywordsList = [
      "Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Linux", "Python",
      "Bash", "Jenkins", "Ansible", "Cloud", "GitHub Actions", "Monitoring", "Prometheus", "Nginx"
    ];
  }

  const textLower = (resumeText || "").toLowerCase();
  
  // Find matched keywords (using word boundaries or includes)
  const matchedKeywords = keywordsList.filter(kw => {
    try {
      const escaped = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      return regex.test(resumeText) || textLower.includes(kw.toLowerCase());
    } catch {
      return textLower.includes(kw.toLowerCase());
    }
  });

  const missingKeywords = keywordsList.filter(kw => !matchedKeywords.includes(kw));

  // 1. Keyword Score
  const keywordScore = keywordsList.length > 0 ? Math.round((matchedKeywords.length / keywordsList.length) * 100) : 70;

  // 2. Impact Score (via action verbs)
  const actionVerbs = [
    "spearheaded", "designed", "developed", "optimized", "architected",
    "managed", "led", "created", "implemented", "built", "engineered"
  ];
  const matchedVerbs = actionVerbs.filter(verb => textLower.includes(verb));
  const impactScore = Math.min(100, Math.max(30, 45 + (matchedVerbs.length * 8)));

  // 3. Presentation / Metrics Score
  const hasMetrics = /[\d]+%|[\d]+\+[\s]?users|[\d]+[\s]?months|₹[\d,]+|\$[\d,]+/i.test(resumeText);
  const presentationScore = hasMetrics ? 88 : 55;

  // 4. Formatting / Layout Score
  const hasContact = /[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /\+?\d[\d-\s()]{8,15}\d/.test(resumeText);
  const hasSections = /experience|education|skills|projects/i.test(resumeText);
  
  let layoutScore = 60;
  let layoutRating = "Needs Structure";
  
  if (hasContact && hasPhone && hasSections) {
    layoutScore = 90;
    layoutRating = "Clean ATS Single-Column Layout";
  } else if (hasContact && hasSections) {
    layoutScore = 75;
    layoutRating = "Good Single-Column Layout";
  }

  // Calculate ATS Score & Overall Score
  const atsScore = Math.min(100, Math.max(25, Math.round(keywordScore * 0.5 + impactScore * 0.3 + layoutScore * 0.2)));
  const overallScore = Math.min(100, Math.max(25, Math.round(keywordScore * 0.4 + impactScore * 0.3 + presentationScore * 0.3)));

  // Strengths
  const strengths = [];
  if (matchedKeywords.length > 3) {
    strengths.push(`Strong alignment with target role's core technical stack (found: ${matchedKeywords.slice(0, 4).join(", ")}).`);
  } else {
    strengths.push("Includes core technical competencies matching general IT standards.");
  }
  if (matchedVerbs.length >= 3) {
    strengths.push("Uses active, results-oriented action verbs in project descriptions.");
  } else {
    strengths.push("Clear role outline format and professional summaries.");
  }
  if (hasMetrics) {
    strengths.push("Incorporates quantifiable metrics to prove project performance and scalability.");
  }
  if (hasContact && hasPhone) {
    strengths.push("Standard, parseable contact information fields.");
  }

  // Weaknesses
  const weaknesses = [];
  if (missingKeywords.length > 0) {
    weaknesses.push(`Missing critical role-specific ATS keywords: ${missingKeywords.slice(0, 3).join(", ")}.`);
  }
  if (!hasMetrics) {
    weaknesses.push("Lacks quantifiable outcome metrics (e.g. percentages, savings, load metrics).");
  }
  if (matchedVerbs.length < 2) {
    weaknesses.push("Relies on passive descriptions ('responsible for') instead of bold action verbs.");
  }
  if (!hasSections) {
    weaknesses.push("Missing clear structural division headers (e.g., 'Work Experience' or 'Skills').");
  }

  // Suggestions / Bullet point rewrites
  const suggestions = [];
  missingKeywords.slice(0, 3).forEach(kw => {
    suggestions.push({
      original: `Responsible for managing code changes and integrations.`,
      suggested: `Leveraged ${kw} to automate testing pipelines, boosting deployment speed by 25%.`,
      reason: `Integrates missing role-specific key competency '${kw}' directly into action-driven statements.`
    });
  });
  if (!hasMetrics) {
    suggestions.push({
      original: "Helped team maintain and fix software bugs.",
      suggested: "Resolved 40+ high-priority software bugs, decreasing system downtime by 15%.",
      reason: "Adds quantifiable value and metrics to show project impact."
    });
  }

  const grammarErrors = [];
  if (textLower.includes("responsibilities included") || textLower.includes("responsible for")) {
    grammarErrors.push({
      issue: "Passive structure 'responsible for'",
      correction: "Use action verbs like 'Spearheaded' or 'Designed'",
      context: "Found 'responsible for' patterns in text"
    });
  }

  const formattingFeedback = [
    "Ensure standard font size (10.5pt to 11.5pt) across all body sections",
    "Convert custom graphic skill bars into readable plain text lists",
    "Format dates consistently as 'MMM YYYY - MMM YYYY'"
  ];
  if (!hasSections) {
    formattingFeedback.push("Add clear 'Professional Experience' and 'Skills' section headings.");
  }

  return {
    candidateName,
    targetRole,
    atsScore,
    overallScore,
    missingKeywords,
    grammarErrors,
    formatting: {
      rating: layoutRating,
      layoutScore,
      feedback: formattingFeedback,
    },
    resumeStrength: strengths,
    weaknesses,
    suggestions,
    strengths,
    criticalGaps: weaknesses,
    formattingAdvice: formattingFeedback,
    keywordOptimization: missingKeywords,
    lineByLineSuggestions: suggestions
  };
};

export const generateInterviewQuestions = async (targetRole: string, experienceLevel: string) => {
  const ai = getAiClient();
  const prompt = `Generate 6 top-tier interview practice questions for a candidate applying for "${targetRole}" at "${experienceLevel}" level. 
Ensure a thorough distribution covering:
1. Technical Questions (Deep domain & system architecture)
2. HR Questions (Career goals, compensation expectations, company fit, strengths/weaknesses)
3. Behavioral Questions (STAR method, teamwork, conflict resolution, leadership)

Return JSON object:
{
  "targetRole": string,
  "experienceLevel": string,
  "questions": [
    {
      "id": string (e.g. "q1"),
      "type": "technical" | "hr" | "behavioral" | "situational",
      "question": string,
      "context": string (why interviewers ask this),
      "sampleAnswer": string (detailed, articulate model answer candidate can learn from),
      "idealAnswerOutline": array of strings (key structure for STAR method or technical steps),
      "keyKeywords": array of strings
    }
  ]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error: any) {
    const isQuotaError = error?.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.message?.includes("quota") || error?.toString()?.includes("429");
    if (isQuotaError) {
      console.warn("Gemini API rate limit reached (429). Utilizing fallback interview questions engine.");
    } else {
      console.error("Gemini Interview Prep Error:", error?.message || error);
    }
    return {
      targetRole: targetRole || "Full Stack Developer",
      experienceLevel: experienceLevel || "Intermediate",
      questions: [
        {
          id: "q1",
          type: "technical",
          question: "Explain how React's Virtual DOM works and how reconciliation optimizes render performance.",
          context: "Assesses core fundamental understanding of modern UI frameworks and component optimization.",
          sampleAnswer: "React's Virtual DOM is an in-memory representation of the actual DOM nodes. When component state changes, React constructs a new Virtual DOM tree and executes a diffing algorithm (Reconciliation) against the previous tree. By calculating the minimal set of required DOM mutations and batching updates, React avoids expensive direct DOM layout recalculations, delivering 60fps UI performance.",
          idealAnswerOutline: [
            "Define Virtual DOM as a lightweight in-memory representation of real DOM",
            "Explain diffing algorithm (reconciliation process between old and new state)",
            "Describe key props role in preventing unnecessary DOM node re-creations",
            "Mention batching updates and React Fiber architecture",
          ],
          keyKeywords: ["Virtual DOM", "Diffing Algorithm", "Reconciliation", "Component Lifecycle", "Fiber"],
        },
        {
          id: "q2",
          type: "hr",
          question: "Why are you interested in this role, and where do you see your career evolving in the next 3 to 5 years?",
          context: "Evaluates career motivation, long-term alignment with business trajectory, and retention stability.",
          sampleAnswer: "I am driven by opportunities where I can solve complex engineering scalability challenges. Over the next 3 to 5 years, I aim to deepen my expertise in cloud-native microservices and transition into a Lead Architect role where I can both design resilient systems and mentor junior developers.",
          idealAnswerOutline: [
            "Express genuine enthusiasm for company products & tech challenges",
            "Highlight specific personal skill growth goals",
            "Demonstrate long-term value alignment without sounding opportunistic",
          ],
          keyKeywords: ["Growth Mindset", "Leadership", "Scalability", "Mentorship", "Value Alignment"],
        },
        {
          id: "q3",
          type: "behavioral",
          question: "Describe a situation where you encountered a critical bug in production under a tight deadline. How did you resolve it?",
          context: "Evaluates problem-solving under pressure, triage prioritization, and teamwork communication.",
          sampleAnswer: "During a major release, an unhandled API edge case caused checkout errors for 5% of users. I immediately initiated incident triage, notified customer support, and identified a null-pointer error in payload parsing. I authored a unit test reproducing the bug, rolled out a patched hotfix within 25 minutes, and held a post-mortem to automate regression testing.",
          idealAnswerOutline: [
            "Situation: Briefly describe production incident and immediate user impact",
            "Task: Identify your responsibility in triaging and rolling back/fixing",
            "Action: Explain step-by-step debugging, root cause analysis, and hotfix deployment",
            "Result: Quantify recovery time and post-mortem prevention measures added",
          ],
          keyKeywords: ["Triage", "Root Cause Analysis", "STAR Method", "Post-Mortem", "Communication"],
        },
        {
          id: "q4",
          type: "technical",
          question: "How do you secure JWT authentication and protect against XSS and CSRF attacks in full-stack web apps?",
          context: "Tests real-world web security knowledge and token management best practices.",
          sampleAnswer: "Security starts with token storage. I store refresh tokens in HTTP-only, Secure, SameSite cookies to mitigate XSS access. Short-lived access tokens remain in memory. To prevent CSRF, sensitive mutation endpoints require anti-CSRF headers, and strict Content Security Policies (CSP) prevent inline script injection.",
          idealAnswerOutline: [
            "Store refresh tokens in httpOnly, Secure, SameSite cookies",
            "Keep access tokens short-lived in memory or encrypted headers",
            "Implement input sanitization and Content Security Policy (CSP) for XSS protection",
            "Use CORS policies and anti-CSRF tokens for sensitive state-changing endpoints",
          ],
          keyKeywords: ["JWT", "HttpOnly Cookies", "XSS", "CSRF", "CORS Header", "Sanitization"],
        },
        {
          id: "q5",
          type: "hr",
          question: "What is your greatest professional weakness, and what active steps are you taking to overcome it?",
          context: "Assesses self-awareness, personal accountability, and continuous improvement habits.",
          sampleAnswer: "In the past, I tended to take on too many tasks independently rather than delegating early. Recognizing this impacted team velocity, I actively started using Jira sprint planning to break down epics and delegate task ownership, which improved both sprint delivery predictability and team collaboration.",
          idealAnswerOutline: [
            "Select a genuine professional skill gap (avoid fake weaknesses like 'I work too hard')",
            "Explain specific self-awareness moment",
            "Detail concrete tools/processes implemented to measure improvement",
          ],
          keyKeywords: ["Self-Awareness", "Delegation", "Process Improvement", "Continuous Growth"],
        },
        {
          id: "q6",
          type: "behavioral",
          question: "How do you handle conflicting technical feedback from senior engineers during code reviews?",
          context: "Tests coachability, professional communication, and collaborative decision making.",
          sampleAnswer: "I treat code reviews as constructive learning discussions. When feedback conflicts, I schedule a quick 10-minute sync with reviewers to discuss trade-offs regarding readability, performance, and maintainability. If trade-offs remain subjective, we refer to team architecture guidelines or benchmark performance.",
          idealAnswerOutline: [
            "Acknowledge constructive perspective with open mindset",
            "Request clarification on architectural rationale or trade-offs (performance vs readability)",
            "Propose benchmark or lightweight prototype if trade-offs are ambiguous",
            "Align on team coding standards and document consensus decision",
          ],
          keyKeywords: ["Code Review", "Constructive Feedback", "Trade-Off Analysis", "Collaboration"],
        },
      ],
    };
  }
};

export const evaluateInterviewAnswer = async (
  questionText: string,
  userAnswer: string,
  questionType: string,
  sampleAnswer?: string
) => {
  const ai = getAiClient();
  const prompt = `You are a Senior Technical Hiring Manager conducting a Mock Interview.
Evaluate the candidate's spoken/written answer to the following interview question.

Question: "${questionText}"
Question Type: "${questionType}"
Ideal Reference Answer: "${sampleAnswer || 'N/A'}"

Candidate's Answer:
"${userAnswer}"

Analyze the candidate's answer and return a JSON object with this exact structure:
{
  "score": number (0 to 100 evaluation score based on technical accuracy, structure, clarity, and keyword coverage),
  "feedbackSummary": string (2-3 sentences evaluating answer quality and tone),
  "strengths": array of 2-3 specific positive aspects of their answer,
  "areasToImprove": array of 2-3 specific missing concepts or structural gaps,
  "keyKeywordsCovered": array of keywords present in candidate answer,
  "missingKeywords": array of crucial industry keywords they omitted,
  "improvedAnswer": string (an exemplary, polished version of their answer incorporating the STAR technique or technical depth)
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error: any) {
    const isQuotaError = error?.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.message?.includes("quota") || error?.toString()?.includes("429");
    if (isQuotaError) {
      console.warn("Gemini API rate limit reached (429). Utilizing fallback interview evaluation engine.");
    } else {
      console.error("Gemini Interview Answer Evaluation Error:", error?.message || error);
    }
    return {
      score: 78,
      feedbackSummary: "Good clear effort. You demonstrated fundamental understanding of the core concept, but could add more metric-driven details or structured STAR framework steps.",
      strengths: [
        "Directly addressed the primary question prompt",
        "Used clear professional technical terminology"
      ],
      areasToImprove: [
        "Include specific measurable outcomes or performance percentages",
        "Elaborate on edge cases or error handling procedures"
      ],
      keyKeywordsCovered: ["Architecture", "Resolution", "Teamwork"],
      missingKeywords: ["Metrics", "Root Cause Analysis", "Triage"],
      improvedAnswer: sampleAnswer || "To answer effectively, begin with the high-level concept, provide an architectural diagram or code flow explanation, and conclude with performance trade-offs."
    };
  }
};

export const generateMarketData = async (role: string) => {
  const ai = getAiClient();
  const prompt = `Provide Indian job market statistics and skill demand trends for the career role: "${role}". Ensure the averageSalary uses Indian Rupees (₹) and Indian number format (e.g. ₹12,50,000/year). Ensure yearlySalaryTrend has salary numbers representing annual salaries in Indian Rupees (₹), e.g. 1500000. Ensure topHiringCities contains major Indian cities like Bengaluru, Hyderabad, Pune, Mumbai, Gurgaon, Noida, Chennai, or Remote.

Return JSON object:
{
  "role": string,
  "averageSalary": string,
  "topPayingIndustries": array of strings,
  "jobOpeningsGrowth": string,
  "topDemandedSkills": array of objects [{ "name": string, "demandPercent": number }],
  "yearlySalaryTrend": array of objects [{ "year": string, "salary": number }],
  "topHiringCities": array of strings,
  "keyAdvice": string
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error: any) {
    const isQuotaError = error?.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.message?.includes("quota") || error?.toString()?.includes("429");
    if (isQuotaError) {
      console.warn("Gemini API rate limit reached (429). Utilizing fallback market data engine.");
    } else {
      console.error("Gemini Market Data Error:", error?.message || error);
    }
    return {
      role: role || "Software Engineer",
      averageSalary: "₹18,50,000 / year",
      topPayingIndustries: ["Artificial Intelligence & Fintech", "Cloud Enterprise Software", "Healthcare Tech", "Cybersecurity"],
      jobOpeningsGrowth: "+22% Year-Over-Year",
      topDemandedSkills: [
        { name: "TypeScript & React", demandPercent: 92 },
        { name: "AI/LLM Integration", demandPercent: 88 },
        { name: "Node.js & Express", demandPercent: 84 },
        { name: "Docker & Cloud Deploy", demandPercent: 78 },
        { name: "GraphQL & SQL", demandPercent: 72 },
      ],
      yearlySalaryTrend: [
        { year: "2022", salary: 1200000 },
        { year: "2023", salary: 1350000 },
        { year: "2024", salary: 1500000 },
        { year: "2025", salary: 1680000 },
        { year: "2026", salary: 1850000 },
      ],
      topHiringCities: ["Bengaluru", "Hyderabad", "Pune", "Noida", "Gurgaon", "Remote Everywhere"],
      keyAdvice: "Focus heavily on building end-to-end fullstack applications that integrate generative AI APIs and automated cloud testing to stand out in current hiring cycles.",
    };
  }
};

export const analyzeSkillGap = async (
  targetRole: string,
  currentSkills: string[],
  customRequiredSkills?: string[]
) => {
  const ai = getAiClient();
  const reqSkillsText = customRequiredSkills && customRequiredSkills.length > 0 
    ? customRequiredSkills.join(", ") 
    : "Standard industry required competencies for " + targetRole;

  const prompt = `Perform a comprehensive AI Skill Gap Analysis for a candidate aiming for the target job role: "${targetRole}".

Candidate's Current Skills: ${currentSkills.join(", ") || "None specified"}
Expected/Required Skills Benchmark: ${reqSkillsText}

Analyze current skills vs required skills and return a JSON object with this exact structure:
{
  "targetRole": string,
  "currentSkills": array of strings,
  "requiredSkills": array of strings (all essential benchmark skills for ${targetRole}),
  "overallReadiness": number (0 to 100 percentage match),
  "totalRequiredCount": number,
  "matchedCount": number,
  "missingCount": number,
  "matchedSkills": array of strings,
  "missingSkillsDetails": [
    {
      "skillName": string,
      "priorityLevel": "High" | "Medium" | "Low",
      "estimatedLearningTime": string (e.g. "2 Weeks", "1 Month", "3 Weeks"),
      "description": string (why this skill is critical for ${targetRole}),
      "recommendedCourses": [
        {
          "title": string (e.g. "Complete Node.js & Express Bootcamp"),
          "platform": string (e.g. "Coursera", "Udemy", "edX", "freeCodeCamp", "YouTube"),
          "url": string (valid URL link),
          "level": "Beginner" | "Intermediate" | "Advanced",
          "duration": string (e.g. "12 Hours", "4 Weeks")
        }
      ]
    }
  ],
  "categoryBreakdown": [
    {
      "category": string (e.g. "Frontend & UI", "Backend & APIs", "Database & Cloud", "DevOps & Tooling"),
      "matchedCount": number,
      "totalCount": number,
      "percentage": number (0 to 100)
    }
  ],
  "actionableSummary": string (2-3 sentences of tactical career advice)
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error: any) {
    const isQuotaError = error?.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.message?.includes("quota") || error?.toString()?.includes("429");
    if (isQuotaError) {
      console.warn("Gemini API rate limit reached (429). Utilizing fallback skill gap analysis engine.");
    } else {
      console.error("Gemini Skill Gap Analysis Error:", error?.message || error);
    }

    const defaultBenchmark = customRequiredSkills && customRequiredSkills.length > 0
      ? customRequiredSkills
      : ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Docker", "REST APIs", "Git"];

    const matched = defaultBenchmark.filter(s => currentSkills.some(cs => cs.toLowerCase() === s.toLowerCase()));
    const missing = defaultBenchmark.filter(s => !currentSkills.some(cs => cs.toLowerCase() === s.toLowerCase()));
    const score = Math.round((matched.length / Math.max(defaultBenchmark.length, 1)) * 100);

    return {
      targetRole: targetRole || "Full Stack Developer",
      currentSkills,
      requiredSkills: defaultBenchmark,
      overallReadiness: score || 65,
      totalRequiredCount: defaultBenchmark.length,
      matchedCount: matched.length,
      missingCount: missing.length,
      matchedSkills: matched,
      missingSkillsDetails: missing.map((skill, index) => ({
        skillName: skill,
        priorityLevel: index === 0 ? "High" : index % 2 === 0 ? "Medium" : "Low",
        estimatedLearningTime: `${(index + 1) * 2} Weeks`,
        description: `${skill} is a core industry requirement for ${targetRole} positions.`,
        recommendedCourses: [
          {
            title: `Mastering ${skill} for Enterprise Applications`,
            platform: "Udemy",
            url: "https://www.udemy.com",
            level: "Intermediate",
            duration: "15 Hours",
          },
          {
            title: `${skill} Complete Specialization`,
            platform: "Coursera",
            url: "https://www.coursera.org",
            level: "Beginner",
            duration: "4 Weeks",
          }
        ],
      })),
      categoryBreakdown: [
        { category: "Frontend & UI Frameworks", matchedCount: 3, totalCount: 3, percentage: 100 },
        { category: "Backend Architecture & APIs", matchedCount: 2, totalCount: 3, percentage: 66 },
        { category: "Database & Cloud DevOps", matchedCount: 1, totalCount: 3, percentage: 33 },
      ],
      actionableSummary: `You have built a solid foundation in core web technologies. To hit 100% readiness for ${targetRole}, focus your next month on containerization and database optimization.`,
    };
  }
};

export const generateCourseRecommendations = async (
  careerGoal: string,
  missingSkills: string[]
) => {
  const ai = getAiClient();
  const skillsListText = missingSkills && missingSkills.length > 0
    ? missingSkills.join(", ")
    : "Modern fullstack development, cloud architecture, system design";

  const prompt = `You are a Senior Tech Career Coach and Education Advisor.
Recommend specific, top-tier courses and official professional certifications for a user aiming for the Career Goal: "${careerGoal || 'Full Stack Software Engineer'}".
Their current Missing Skills / Skill Gaps are: "${skillsListText}".

Provide recommendations strictly categorized into 3 sections:
1. Free Courses (high-quality free platforms e.g. freeCodeCamp, MIT OCW, YouTube Courses, Khan Academy, Coursera Free Audit)
2. Paid Courses (top-rated paid platforms e.g. Udemy, Coursera Specialization, Pluralsight, Udacity, Frontend Masters)
3. Certifications (industry-recognized professional certs e.g. AWS Certified Developer, Meta Frontend Professional, Google Cloud Architect, Microsoft Certified Azure Developer)

Return a JSON object with this exact structure:
{
  "careerGoal": string,
  "missingSkills": array of strings,
  "freeCourses": [
    {
      "id": "free-1",
      "title": string,
      "provider": string,
      "type": "Free",
      "duration": string (e.g. "15 Hours", "4 Weeks"),
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "rating": number (e.g. 4.8),
      "reviewCount": number (e.g. 18500),
      "courseUrl": string (real URL or valid platform link, e.g. "https://www.freecodecamp.org"),
      "imageUrl": string (valid Unsplash image URL e.g. "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80"),
      "description": string (2-3 sentences on what this course teaches for ${careerGoal}),
      "skillsCovered": array of strings,
      "priceInfo": "100% Free"
    }
  ],
  "paidCourses": [
    {
      "id": "paid-1",
      "title": string,
      "provider": string,
      "type": "Paid",
      "duration": string,
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "rating": number,
      "reviewCount": number,
      "courseUrl": string (e.g. "https://www.udemy.com"),
      "imageUrl": string (valid Unsplash image URL e.g. "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"),
      "description": string,
      "skillsCovered": array of strings,
      "priceInfo": string (e.g. "₹1,500", "₹3,000 / month")
    }
  ],
  "certifications": [
    {
      "id": "cert-1",
      "title": string,
      "provider": string,
      "type": "Certification",
      "duration": string (e.g. "2 Months Prep"),
      "difficulty": "Intermediate" | "Advanced",
      "rating": number,
      "reviewCount": number,
      "courseUrl": string (e.g. "https://aws.amazon.com/certification"),
      "imageUrl": string (valid Unsplash image URL e.g. "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80"),
      "description": string,
      "skillsCovered": array of strings,
      "priceInfo": string (e.g. "₹12,000 Exam Fee", "₹25,000 Certification")
    }
  ]
}

Ensure 2 to 3 high quality items per category.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error: any) {
    const isQuotaError = error?.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.message?.includes("quota") || error?.toString()?.includes("429");
    if (isQuotaError) {
      console.warn("Gemini API rate limit reached (429). Utilizing fallback course recommendation engine.");
    } else {
      console.error("Gemini Course Recommendation Error:", error?.message || error);
    }
    const primarySkill = missingSkills[0] || "Software Development";
    return {
      careerGoal: careerGoal || "Full Stack Developer",
      missingSkills: missingSkills.length > 0 ? missingSkills : ["System Architecture", "Docker & Kubernetes", "Cloud AWS"],
      freeCourses: [
        {
          id: "free-1",
          title: `Full Stack ${primarySkill} & Web Bootcamp`,
          provider: "freeCodeCamp",
          type: "Free",
          duration: "30 Hours",
          difficulty: "Beginner",
          rating: 4.9,
          reviewCount: 42000,
          courseUrl: "https://www.freecodecamp.org",
          imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
          description: `Comprehensive hands-on interactive tutorial covering ${primarySkill} fundamentals, building real-world projects, and mastering modern developer workflows.`,
          skillsCovered: [primarySkill, "Git", "Project Building", "Problem Solving"],
          priceInfo: "100% Free",
        },
        {
          id: "free-2",
          title: "MIT Computer Science & Distributed Systems",
          provider: "MIT OpenCourseWare",
          type: "Free",
          duration: "8 Weeks",
          difficulty: "Advanced",
          rating: 4.8,
          reviewCount: 12500,
          courseUrl: "https://ocw.mit.edu",
          imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
          description: "University grade computer science lectures covering backend architecture, scalability patterns, and algorithmic optimization.",
          skillsCovered: ["Distributed Systems", "Algorithms", "System Architecture"],
          priceInfo: "100% Free",
        }
      ],
      paidCourses: [
        {
          id: "paid-1",
          title: `The Complete ${primarySkill} Masterclass: Zero to Hero`,
          provider: "Udemy",
          type: "Paid",
          duration: "42 Hours",
          difficulty: "Intermediate",
          rating: 4.8,
          reviewCount: 28400,
          courseUrl: "https://www.udemy.com",
          imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
          description: "Production-ready masterclass with hands-on labs, microservices architecture, automated CI/CD pipelines, and cloud deployment.",
          skillsCovered: [primarySkill, "Microservices", "REST APIs", "CI/CD"],
          priceInfo: "₹1,500",
        },
        {
          id: "paid-2",
          title: "Full-Stack Web Developer Specialization",
          provider: "Coursera (Johns Hopkins)",
          type: "Paid",
          duration: "3 Months",
          difficulty: "Intermediate",
          rating: 4.7,
          reviewCount: 19100,
          courseUrl: "https://www.coursera.org",
          imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
          description: "University backed specialization certificate program focusing on modern software engineering standards, database design, and cloud hosting.",
          skillsCovered: ["Database Design", "Node.js", "Cloud Hosting", "Frontend Architecture"],
          priceInfo: "₹3,500 / month",
        }
      ],
      certifications: [
        {
          id: "cert-1",
          title: "AWS Certified Developer – Associate",
          provider: "Amazon Web Services",
          type: "Certification",
          duration: "2 Months Prep",
          difficulty: "Intermediate",
          rating: 4.9,
          reviewCount: 35000,
          courseUrl: "https://aws.amazon.com/certification",
          imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
          description: "Official industry standard cloud certification validating your expertise in building, deploying, and debugging cloud-native applications.",
          skillsCovered: ["AWS Lambda", "DynamoDB", "S3", "Cloud Security", "Serverless"],
          priceInfo: "₹12,500 Exam Fee",
        },
        {
          id: "cert-2",
          title: "Meta Front-End Developer Professional Certificate",
          provider: "Meta / Coursera",
          type: "Certification",
          duration: "6 Months",
          difficulty: "Intermediate",
          rating: 4.8,
          reviewCount: 22000,
          courseUrl: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
          imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
          description: "Professional credential created by Meta software engineers to build job-ready frontend mastery with React, UX, and technical interviewing.",
          skillsCovered: ["React", "JavaScript ES6+", "UI/UX Design", "Version Control"],
          priceInfo: "Professional Credential",
        }
      ]
    };
  }
};

export const generateJobRecommendations = async (
  skills: string[],
  education: string,
  experience: string,
  location: string
) => {
  const ai = getAiClient();
  const skillsText = skills && skills.length > 0 ? skills.join(", ") : "React, TypeScript, Node.js, Express, PostgreSQL, REST APIs";
  const userLoc = location || "Bengaluru, India or Remote";
  const userEdu = education || "Bachelor's in Computer Science or equivalent";
  const userExp = experience || "2-4 years";

  const prompt = `You are an AI Tech Recruiter and Job Match Specialist focused on the Indian tech market.
Recommend 6 realistic, highly accurate job openings in India tailored to a candidate with the following profile:
- Core Skills: "${skillsText}"
- Education Level: "${userEdu}"
- Experience Level: "${userExp}"
- Preferred Location: "${userLoc}"

Return a JSON object with this exact structure:
{
  "userCriteria": {
    "skills": array of strings,
    "education": string,
    "experience": string,
    "location": string
  },
  "jobs": [
    {
      "id": "job-1",
      "company": string (e.g. "Stripe", "Vercel", "Datadog", "Airbnb", "Linear", "Supabase"),
      "companyLogo": string (Unsplash corporate logo or clean icon URL e.g. "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80"),
      "jobTitle": string (e.g. "Senior Full Stack Engineer"),
      "salary": string (e.g. "₹12,00,000 - ₹18,00,000 / year" in Indian Rupees (₹) using Indian number format and realistic Indian IT industry salary standards depending on the career),
      "location": string (e.g. "Bengaluru, Karnataka (Hybrid)" or "Remote (India)"),
      "jobType": "Full-time" | "Part-time" | "Contract" | "Remote",
      "experience": string (e.g. "3+ Years"),
      "education": string (e.g. "BS in CS / Software Engineering"),
      "skillsRequired": array of strings (5-6 relevant tech skills),
      "matchPercentage": number (integer between 80 and 98 based on how well user skills match),
      "applyLink": string (e.g. "https://www.linkedin.com/jobs" or "https://about.gitlab.com/jobs"),
      "description": string (2-3 sentences summarizing responsibilities and team culture),
      "postedDate": string (e.g. "2 days ago", "Just posted", "1 week ago")
    }
  ]
}

Ensure high visual variety in companies, salaries, locations, and match percentages.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error: any) {
    const isQuotaError = error?.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.message?.includes("quota") || error?.toString()?.includes("429");
    if (isQuotaError) {
      console.warn("Gemini API rate limit reached (429). Utilizing fallback job recommendation engine.");
    } else {
      console.error("Gemini Job Recommendation Error:", error?.message || error);
    }
    return {
      userCriteria: {
        skills: skills.length > 0 ? skills : ["React", "TypeScript", "Node.js", "System Architecture"],
        education: userEdu,
        experience: userExp,
        location: userLoc,
      },
      jobs: [
        {
          id: "job-1",
          company: "Vercel",
          companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80",
          jobTitle: "Full Stack Engineer - Frontend Platform",
          salary: "₹15,00,000 - ₹25,00,000/year",
          location: "Remote (India)",
          jobType: "Remote",
          experience: userExp,
          education: userEdu,
          skillsRequired: ["React", "TypeScript", "Next.js", "Node.js", "Serverless"],
          matchPercentage: 96,
          applyLink: "https://vercel.com/careers",
          description: "Join the core frontend infrastructure team building Next.js and high-performance serverless edge APIs for millions of developers worldwide.",
          postedDate: "1 day ago"
        },
        {
          id: "job-2",
          company: "Stripe",
          companyLogo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=120&q=80",
          jobTitle: "Software Engineer - Payment APIs",
          salary: "₹18,00,000 - ₹30,00,000/year",
          location: "Bengaluru, Karnataka (Hybrid)",
          jobType: "Full-time",
          experience: userExp,
          education: userEdu,
          skillsRequired: ["Node.js", "TypeScript", "API Design", "Distributed Systems", "SQL"],
          matchPercentage: 92,
          applyLink: "https://stripe.com/jobs",
          description: "Architect mission-critical payment workflows and financial APIs handling billions of dollars in global digital commerce transactions.",
          postedDate: "3 days ago"
        },
        {
          id: "job-3",
          company: "Datadog",
          companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&q=80",
          jobTitle: "Backend Software Engineer - Observability",
          salary: "₹14,00,000 - ₹22,00,000/year",
          location: "Hyderabad, India or Remote",
          jobType: "Full-time",
          experience: userExp,
          education: userEdu,
          skillsRequired: ["Go", "Python", "Docker", "Kubernetes", "System Design"],
          matchPercentage: 88,
          applyLink: "https://www.datadoghq.com/careers/",
          description: "Build scalable real-time monitoring and telemetry pipelines processing trillions of metrics per day across cloud infrastructure.",
          postedDate: "Just posted"
        },
        {
          id: "job-4",
          company: "Linear",
          companyLogo: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=120&q=80",
          jobTitle: "Product Engineer - Realtime Collaboration",
          salary: "₹16,00,000 - ₹26,00,000/year",
          location: "Remote (India)",
          jobType: "Remote",
          experience: userExp,
          education: userEdu,
          skillsRequired: ["React", "TypeScript", "WebSockets", "GraphQL", "UI/UX"],
          matchPercentage: 94,
          applyLink: "https://linear.app/careers",
          description: "Craft lightning-fast, offline-first collaborative task tracking software loved by product-led engineering teams across the globe.",
          postedDate: "4 days ago"
        },
        {
          id: "job-5",
          company: "Supabase",
          companyLogo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&q=80",
          jobTitle: "Cloud Infrastructure & Database Engineer",
          salary: "₹12,00,000 - ₹20,00,000/year",
          location: "Remote (Pune)",
          jobType: "Remote",
          experience: userExp,
          education: userEdu,
          skillsRequired: ["PostgreSQL", "Go", "Elixir", "AWS", "Docker"],
          matchPercentage: 85,
          applyLink: "https://supabase.com/careers",
          description: "Engineers open-source Firebase alternatives providing instant Postgres databases, real-time subscriptions, and authentication.",
          postedDate: "1 week ago"
        },
        {
          id: "job-6",
          company: "Airbnb",
          companyLogo: "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?auto=format&fit=crop&w=120&q=80",
          jobTitle: "Frontend Engineer - Search & Discovery",
          salary: "₹20,00,000 - ₹35,00,000/year",
          location: "Mumbai, India (Hybrid)",
          jobType: "Full-time",
          experience: userExp,
          education: userEdu,
          skillsRequired: ["React", "JavaScript", "A/B Testing", "CSS/Tailwind", "Web Vitals"],
          matchPercentage: 90,
          applyLink: "https://careers.airbnb.com/",
          description: "Optimize search discovery flows, interactive map components, and instant booking experiences for tens of millions of active travelers.",
          postedDate: "2 days ago"
        }
      ]
    };
  }
};

export const generateChatbotFallback = (question: string, profileContext?: any) => {
  const q = question.toLowerCase().trim();
  const name = profileContext?.name || "Student";
  const targetRole = profileContext?.targetRole || "Software Developer";
  const skills = Array.isArray(profileContext?.skills) ? profileContext.skills : [];
  
  // 1. GREETINGS
  if (q === "hi" || q === "hello" || q === "hey" || q.startsWith("greet") || q.includes("hey career")) {
    return `Hello ${name}! I am **CareerNavigator**, your personal AI Career Counselor. 

Since your target career path is **${targetRole}**, I can help you with:
- Structured study plans and learning strategies
- Important technical, HR, and behavioral interview questions
- Comparing frameworks (like React vs Angular)
- Resume review and ATS formatting tips
- Specific technical skills roadmaps

What career query can I help you with today?`;
  }

  // 2. STUDY STRATEGY / "how to study"
  if (q.includes("study") || q.includes("learn how") || q.includes("learning strategy") || q.includes("how to prepare")) {
    return `Here is a custom study plan tailored for you, ${name}, targeting a career as a **${targetRole}**:

### 📅 Phase 1: Conceptual Foundation (Weeks 1-4)
- **Time Block**: Allocate 2 hours daily for core concepts.
- **Topics**: Deep-dive into fundamental concepts. If you are learning web development, master core JavaScript/TypeScript and asynchronous coding.
- **Resource**: Focus on documentation and interactive courses.

### 🛠️ Phase 2: Active Recall & Projects (Weeks 5-8)
- **Don't just watch tutorials**: Build 2 mini-projects from scratch without copying code.
- **Incorporate**: Integrate database management (like MongoDB) and state management.

### 🚀 Phase 3: Interview Prep & Optimization (Weeks 9-12)
- **Practice**: Solve 2 problem-solving challenges daily on LeetCode/HackerRank.
- **Review**: Go through common behavior and technical questions for **${targetRole}**.`;
  }

  // 3. INTERVIEW QUESTIONS
  if (q.includes("interview question") || q.includes("interview prep") || q.includes("interview questions")) {
    return `Here are some of the most critical interview questions for a **${targetRole}** role:

### 💻 Technical Questions
1. **React/Frontend**: *Explain the difference between Virtual DOM and Shadow DOM. How does React's reconciliation algorithm work?*
2. **Backend/APIs**: *How do you secure a REST API (JWT, OAuth, CORS)? Explain database indexing in MongoDB.*
3. **System Design**: *How would you design a rate limiter for a public API?*

### 🤝 Behavioral Questions (STAR Method)
- *Describe a time you faced a difficult technical blocker. How did you resolve it?*
- *How do you manage conflicts in a technical team?*

### 👔 HR & General Questions
- *Why do you want to join our organization as a ${targetRole}?*
- *What is your process for learning a new technology under tight deadlines?*`;
  }

  // 4. REACT / FRAMEWORK COMPARISONS / ANGULAR
  if (q.includes("react vs") || q.includes("angular vs") || q.includes("compare react") || q.includes("difference between react") || q.includes("compare angular")) {
    return `Here is a comparison between **React** and **Angular** to help you decide:

| Feature | React | Angular |
| :--- | :--- | :--- |
| **Type** | UI Library (Flexible) | Complete Framework (Opinionated) |
| **Data Binding** | One-way | Two-way |
| **Learning Curve** | Moderate (JSX + state management) | Steep (requires TypeScript, RxJS, Modules) |
| **Performance** | High (Virtual DOM) | High (Real DOM + optimizations) |
| **Preferred for** | Single Page Apps, dynamic UIs | Large-scale enterprise applications |

**My Recommendation**: Since you target **${targetRole}**, React is highly popular in the Indian market with extensive job openings. However, Angular is excellent if you plan to work in large enterprise banking or corporate software environments.`;
  }

  if (q.includes("what is react") || q.includes("reactjs")) {
    return `**React** (or ReactJS) is an open-source front-end JavaScript library developed by Meta for building user interfaces, particularly for single-page applications.

### Key Concepts:
1. **Component-Based Architecture**: Build encapsulated components that manage their own state and compose them to make complex UIs.
2. **Virtual DOM**: Updates only the changed parts of the real DOM, making rendering extremely fast.
3. **Declarative UI**: Design simple views for each state in your application, and React will efficiently update and render just the right components.`;
  }

  // 5. BECOME FULL STACK
  if (q.includes("become a full stack") || q.includes("full stack developer") || q.includes("fullstack")) {
    return `To become a successful **Full Stack Developer** in India, follow this structured roadmap:

### 1. Frontend Development
- **Core**: HTML5, CSS3 (Flexbox/Grid), and Modern JavaScript (ES6+).
- **Framework**: Master **React** (hooks, context, state management).
- **Styling**: Tailwind CSS or CSS Modules.

### 2. Backend Development
- **Runtime**: **Node.js** with **Express.js** for building RESTful APIs.
- **Authentication**: JWT (JSON Web Tokens) and bcrypt password hashing.

### 3. Databases
- **NoSQL**: **MongoDB** (Mongoose ODM).
- **SQL**: PostgreSQL or MySQL.

### 4. DevOps & Cloud
- **Version Control**: Git & GitHub.
- **Containerization**: Docker.
- **Deployment**: AWS (EC2/S3), Vercel (frontend), and Render/Render (backend).`;
  }

  // 6. MONGODB
  if (q.includes("mongodb") || q.includes("nosql")) {
    return `**MongoDB** is a source-available, NoSQL database program that uses JSON-like documents with optional schemas.

### Why use MongoDB?
- **Document Model**: Data is stored as BSON (Binary JSON) documents. This maps directly to object models in your application code, making it easy to learn and write.
- **Dynamic Schema**: You don't need to define table structures beforehand. Fields can vary from document to document.
- **Scalability**: High horizontal scalability via sharding and replica sets.
- **Querying**: Rich query language supporting aggregations, text search, and geospatial queries.`;
  }

  // 7. RESUME IMPROVEMENT
  if (q.includes("improve my resume") || q.includes("resume advice") || q.includes("cv advice") || q.includes("resume tips")) {
    return `To optimize your resume and clear modern ATS filters for **${targetRole}** positions:

1. **Use Single-Column Layouts**: Multi-column grids or sidebars often cause ATS parsers to read lines out of order.
2. **Quantify Achievements**: Instead of *"Responsible for writing backend APIs"*, write *"Designed and implemented 15+ RESTful endpoints in Node.js, reducing payload size by 30% and response times by 150ms"*.
3. **Skill Matrix**: Include a dedicated "Technical Skills" section categorizing languages, frameworks, databases, and DevOps tools.
4. **Action Verbs**: Start bullets with strong action words like *Spearheaded, Designed, Optimized, Automated, or Orchestrated*.`;
  }

  // 8. WHAT SKILLS SHOULD I LEARN NEXT
  if (q.includes("what skills") || q.includes("learn next") || q.includes("skills to learn")) {
    const defaultNext = ["TypeScript", "Next.js", "Docker", "CI/CD (GitHub Actions)"];
    const currentSkillsStr = skills.length > 0 ? skills.join(", ") : "none currently specified";
    
    return `Based on your current skill profile (**${currentSkillsStr}**) and your target role (**${targetRole}**), here is what you should focus on learning next:

1. **TypeScript**: Essential for modern React/Node codebases to ensure type safety.
2. **Next.js**: The industry standard React framework for Server-Side Rendering (SSR) and Static Site Generation.
3. **Docker**: Packaging your apps in containers is a core industry requirement.
4. **CI/CD & Testing**: Learn GitHub Actions and Jest/Vitest for automated testing pipelines.`;
  }

  // 9. DYNAMIC PROFILE-BASED GENERAL ANSWER
  return `I would be happy to help guide you regarding your question: **"${question}"**. 

As your career counselor, considering your goal to be a **${targetRole}** ${skills.length > 0 ? `and your background in **${skills.join(", ")}**` : ""}, I suggest:
- **Build Metric-Driven Projects**: Implement a portfolio project specifically addressing the concepts behind your query.
- **Learn the Core Fundamentals**: Before moving to advanced frameworks, make sure you understand the underlying patterns (e.g. event-loop, database indexing).
- **Target Recognized Credentials**: Acquire credentials that prove your knowledge to prospective recruiters.

Could you elaborate or ask a more specific question about this topic?`;
};

export const getChatbotResponse = async (
  question: string,
  history: Array<{ sender: "user" | "bot"; text: string }>,
  profileContext?: any
) => {
  const ai = getAiClient();

  let profilePrompt = "";
  if (profileContext) {
    profilePrompt = `
You are talking to a student/candidate with the following profile:
- Name: ${profileContext.name}
- Target Career Role: ${profileContext.targetRole}
- Current Skills: ${Array.isArray(profileContext.skills) ? profileContext.skills.join(", ") : profileContext.skills}
- Experience Level: ${profileContext.experienceLevel}
- Education: ${profileContext.education}
- Interests: ${Array.isArray(profileContext.interests) ? profileContext.interests.join(", ") : profileContext.interests}
- Preferred Location: ${profileContext.preferredLocation}
- Preferred Industry: ${profileContext.preferredIndustry}

Use this profile to make your advice highly customized and relevant to their background when they ask about careers, skills, or study paths. Do not repeat this profile back to them; simply use it as implicit context.
`;
  }

  const systemInstruction = `You are 'CareerNavigator', a friendly and professional career advisor bot. Help students with career selection, certification plans, skills learning, interview tips, project ideas, and industry insight. Respond in clear, inspiring markdown format with bullet points where appropriate.
${profilePrompt}
Always answer the user's current question directly. Do not give a generic advice template unless requested.
`;

  // Limit history to the last 10 messages to avoid token bloat
  const recentHistory = history.slice(-10);
  const contents = recentHistory.map(h => ({
    role: h.sender === "user" ? "user" : "model",
    parts: [{ text: h.text }]
  }));
  contents.push({
    role: "user",
    parts: [{ text: question }]
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
      },
    });
    return response.text || "";
  } catch (error: any) {
    console.error("Gemini Chatbot Error:", error?.message || error);
    return generateChatbotFallback(question, profileContext);
  }
};

export const compareCareers = async (careerA: string, careerB: string) => {
  const ai = getAiClient();
  const prompt = `Compare these two career tracks in detail for the Indian job market:\nCareer A: ${careerA}\nCareer B: ${careerB}\n\nCompare them across critical dimensions. Return a JSON object matching this schema where all salaries are in Indian Rupees (₹) with Indian number formatting and standards (e.g., ₹12,00,000/year):\n{\n  "careerA": string,\n  "careerB": string,\n  "comparison": {\n    "salary": { "a": string, "b": string, "winner": string },\n    "skills": { "a": string[], "b": string[] },\n    "difficulty": { "a": string, "b": string, "explanation": string },\n    "growth": { "a": string, "b": string, "winner": string },\n    "futureScope": { "a": string, "b": string },\n    "companies": { "a": string[], "b": string[] },\n    "workLifeBalance": { "a": string, "b": string, "explanation": string }\n  },\n  "summaryRecommendation": string\n}\n`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    return parsed;
  } catch (error: any) {
    console.error("Gemini Career Comparison Error:", error?.message || error);
    return {
      careerA,
      careerB,
      comparison: {
        salary: { a: "₹8,00,000 - ₹15,00,000/year", b: "₹12,00,000 - ₹25,00,000/year", winner: careerB },
        skills: { a: ["React", "Express", "Node.js", "JavaScript"], b: ["Python", "TensorFlow", "Math", "PyTorch"] },
        difficulty: { a: "Intermediate", b: "Advanced", explanation: `${careerB} typically demands a heavier background in mathematics and deep systems.` },
        growth: { a: "Strong (18% Growth)", b: "Exceptional (32% Growth)", winner: careerB },
        futureScope: { a: "Ubiquitous system requirements", b: "Deep-tech automation driving all primary enterprise software" },
        companies: { a: ["Google", "Meta", "Stripe"], b: ["OpenAI", "DeepMind", "Nvidia"] },
        workLifeBalance: { a: "Good (Standard flex hours)", b: "Moderate (Deep R&D timelines)", explanation: `${careerA} offers highly predictable product shipment cycles.` }
      },
      summaryRecommendation: `If you excel in analytical thinking and modeling, prefer **${careerB}**. If you enjoy design architectures and product creation, **${careerA}** represents an ideal option.`
    };
  }
};

export const getProjectRecommendations = async (targetCareer: string, skills: string[]) => {
  const ai = getAiClient();
  const prompt = `Based on the target career "${targetCareer}" and the current skills [${skills.join(", ")}], recommend exactly 3 projects representing different difficulty tiers:\n1. Beginner (simple validation/introduction)\n2. Intermediate (integrated features and API)\n3. Advanced (complex system design, real-world deployment scale)\n\nReturn a JSON array matching:\n[{\n  "title": string,\n  "difficulty": "Beginner" | "Intermediate" | "Advanced",\n  "description": string,\n  "techStack": string[],\n  "keyFeatures": string[],\n  "learningOutcomes": string[]\n}]\n`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini Project Recommendations Error:", error?.message || error);
    return [
      {
        title: "Personal Portfolio and CV Website",
        difficulty: "Beginner",
        description: "A highly responsive site demonstrating your project accomplishments, certifications, and capabilities.",
        techStack: ["React.js", "Tailwind CSS", "Vite"],
        keyFeatures: ["Visual resume download", "Interactive feedback submission", "Project carousel display"],
        learningOutcomes: ["Master frontend layouts", "Understand dynamic CSS state toggling"]
      },
      {
        title: "Intelligent Task Tracker Platform",
        difficulty: "Intermediate",
        description: "A full-stack project utilizing a database to plan timelines, set checkboxes, and generate progress trends.",
        techStack: ["Express.js", "MongoDB", "React", "ChartJS"],
        keyFeatures: ["JWT verification authentication", "Relational database schema sync", "Visual analytics graphs"],
        learningOutcomes: ["Implement robust state routing", "Handle CRUD backend logic safely"]
      },
      {
        title: "Cloud-Based Asset Management Cluster",
        difficulty: "Advanced",
        description: "Fully automated microservice parsing bulk image and text assets, storing securely and running smart caching engines.",
        techStack: ["Docker", "Google Cloud Storage", "Redis Caching", "PostgreSQL"],
        keyFeatures: ["Scalable image manipulation pipeline", "Token authentication", "Rate-limiting middleware"],
        learningOutcomes: ["Configure cloud architectures", "Enforce high-throughput data processing"]
      }
    ];
  }
};

export const getInternshipRecommendations = async (targetCareer: string, skills: string[]) => {
  const ai = getAiClient();
  const prompt = `Recommend internships in India and custom preparation tactics for a student targetting a career as "${targetCareer}".
Current Skills: ${skills.join(", ")}

Provide internship roles, standard pre-requisite skills, preparation roadmap steps, and specific resume keywords and optimization tips. Ensure the salaryEstimate is in Indian Rupees (₹) per month (e.g. ₹25,000 - ₹40,000 / month).
Return a JSON object conforming to:
{
  "roles": [{ "title": string, "explanation": string, "salaryEstimate": string }],
  "requiredSkills": string[],
  "preparationSteps": string[],
  "resumeTips": string[]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini Internship Recommendations Error:", error?.message || error);
    return {
      roles: [
        { title: "Junior Software Intern", explanation: "Entry-level development supporting component building and unit testing.", salaryEstimate: "₹20,000 - ₹35,000 / month" },
        { title: "Product Engineering Intern", explanation: "Cross-functional role analyzing client specifications and wireframing features.", salaryEstimate: "₹25,000 - ₹45,000 / month" }
      ],
      requiredSkills: ["Git/GitHub", "Basic Debugging", "Agile methodologies"],
      preparationSteps: [
        "Practice 50 algorithms on common coding platforms.",
        "Perfect your LinkedIn presentation.",
        "Prepare 3 direct portfolio project links."
      ],
      resumeTips: [
        "List your specific technical project roles clearly.",
        "Bold key impact metrics (e.g. improved speed by 30%)."
      ]
    };
  }
};



