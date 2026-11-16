import { jsPDF } from "jspdf";
import { ResumeAnalysisData } from "../types";

export const generateResumePdfReport = (data: ResumeAnalysisData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Primary Colors
  const primaryColor = [79, 70, 229]; // Indigo-600
  const textColor = [30, 41, 59]; // Slate-800
  const lightBg = [248, 250, 252]; // Slate-50

  // Title Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 36, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("AI RESUME ATS AUDIT REPORT", 15, 16);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Candidate Name: ${data.candidateName || "Not detected"}`, 15, 28);
  doc.text(`Target Role: ${data.targetRole || "Software Engineer"} | Generated: ${new Date().toLocaleDateString()}`, pageWidth - 15, 28, { align: "right" });

  y = 44;

  // Score Banner Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(15, y, pageWidth - 30, 28, "F");

  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`ATS Score: ${data.atsScore}%`, 25, y + 12);
  doc.text(`Overall Quality: ${data.overallScore}%`, 100, y + 12);
  doc.text(`Formatting: ${data.formatting?.rating || "Optimal"}`, 165, y + 12);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Evaluated via Gemini 2.5 Flash Executive Recruiter Engine", 25, y + 21);

  y += 38;

  // Function to add Section Title
  const addSectionTitle = (title: string) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(title.toUpperCase(), 15, y);
    doc.setDrawColor(226, 232, 240);
    doc.line(15, y + 2, pageWidth - 15, y + 2);
    y += 10;
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  };

  // Section 1: Resume Strengths
  if (data.resumeStrength && data.resumeStrength.length > 0) {
    addSectionTitle("Identified Resume Strengths");
    data.resumeStrength.forEach((str) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(`• ${str}`, 20, y);
      y += 6;
    });
    y += 4;
  }

  // Section 2: Missing Keywords & Weaknesses
  if (data.missingKeywords && data.missingKeywords.length > 0) {
    addSectionTitle("Missing Critical ATS Keywords");
    const keywordsText = data.missingKeywords.join(", ");
    const splitKeywords = doc.splitTextToSize(keywordsText, pageWidth - 40);
    doc.text(splitKeywords, 20, y);
    y += splitKeywords.length * 6 + 4;
  }

  if (data.weaknesses && data.weaknesses.length > 0) {
    addSectionTitle("Weaknesses & Missing Metrics");
    data.weaknesses.forEach((weakness) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(`• ${weakness}`, 20, y);
      y += 6;
    });
    y += 4;
  }

  // Section 3: Grammar Errors
  if (data.grammarErrors && data.grammarErrors.length > 0) {
    addSectionTitle("Grammar & Style Fixes");
    data.grammarErrors.forEach((g) => {
      if (y > 265) { doc.addPage(); y = 20; }
      doc.setFont("helvetica", "bold");
      doc.text(`Issue: ${g.issue}`, 20, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.text(`Correction: ${g.correction}`, 25, y);
      y += 7;
    });
    y += 4;
  }

  // Section 4: Formatting Analysis
  if (data.formatting) {
    addSectionTitle("Formatting & Layout Recommendations");
    doc.text(`Rating: ${data.formatting.rating} (Score: ${data.formatting.layoutScore}%)`, 20, y);
    y += 6;
    if (data.formatting.feedback) {
      data.formatting.feedback.forEach((f) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(`• ${f}`, 25, y);
        y += 6;
      });
    }
    y += 4;
  }

  // Section 5: Bullet Point AI Rewrites
  if (data.suggestions && data.suggestions.length > 0) {
    addSectionTitle("High-Impact Bullet Point Rewrites");
    data.suggestions.forEach((s, idx) => {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFont("helvetica", "bold");
      doc.text(`${idx + 1}. Original:`, 20, y);
      doc.setFont("helvetica", "normal");
      const origText = doc.splitTextToSize(s.original, pageWidth - 50);
      doc.text(origText, 45, y);
      y += origText.length * 5 + 2;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(16, 185, 129); // Emerald
      doc.text("AI Rewrite:", 20, y);
      doc.setFont("helvetica", "normal");
      const sugText = doc.splitTextToSize(s.suggested, pageWidth - 50);
      doc.text(sugText, 45, y);
      y += sugText.length * 5 + 2;

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8.5);
      doc.text(`Reason: ${s.reason}`, 25, y);
      doc.setFontSize(9.5);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      y += 8;
    });
  }

  // Footer on final page
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Generated by AI Career Guidance Platform - Confidentially Created for Candidate", pageWidth / 2, 285, { align: "center" });

  doc.save(`Resume_ATS_Audit_${(data.targetRole || "Report").replace(/\s+/g, "_")}.pdf`);
};
