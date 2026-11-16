import { jsPDF } from "jspdf";
import { RoadmapData } from "../types";

export const exportRoadmapToPDF = (roadmap: RoadmapData) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  // Header Banner
  doc.setFillColor(79, 70, 229); // Indigo 600
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("AI CAREER ROADMAP & LEARNING PATH", 14, 12);

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.text(`Target Role: ${roadmap.careerTitle} | Total Timeline: ${roadmap.overallTimeline}`, 14, 20);

  y = 36;

  // Overview Info
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Roadmap Plan for ${roadmap.careerTitle}`, 14, y);
  y += 6;

  const completedCount = roadmap.phases.filter((p) => p.completed).length;
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Progress: ${completedCount} of ${roadmap.phases.length} Phases Completed (${Math.round((completedCount / (roadmap.phases.length || 1)) * 100)}%)`, 14, y);
  y += 10;

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, y, pageWidth - 14, y);
  y += 8;

  // Phases Chronological Steps
  roadmap.phases.forEach((phase) => {
    // Check page height space
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    // Step Title Header Box
    const isCompleted = phase.completed;
    if (isCompleted) {
      doc.setFillColor(236, 253, 245); // Emerald light
    } else {
      doc.setFillColor(243, 244, 246); // Slate light
    }
    doc.rect(14, y - 4, pageWidth - 28, 10, "F");

    doc.setTextColor(49, 46, 129); // Dark Indigo
    doc.setFontSize(10.5);
    doc.setFont("helvetica", "bold");
    const statusText = isCompleted ? "[COMPLETED] " : "";
    doc.text(`${statusText}Step ${phase.phaseNumber}: ${phase.title} (${phase.duration})`, 18, y + 2.5);
    y += 12;

    // Description
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const splitDesc = doc.splitTextToSize(phase.description, pageWidth - 36);
    doc.text(splitDesc, 18, y);
    y += splitDesc.length * 4.5 + 4;

    // Skills
    if (phase.skillsToMaster && phase.skillsToMaster.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Skills to Learn & Master:", 18, y);
      y += 4.5;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      const skillsText = phase.skillsToMaster.join("  •  ");
      const splitSkills = doc.splitTextToSize(skillsText, pageWidth - 38);
      doc.text(splitSkills, 22, y);
      y += splitSkills.length * 4.5 + 3;
    }

    // Projects
    if (phase.recommendedProjects && phase.recommendedProjects.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Portfolio Milestones & Projects:", 18, y);
      y += 4.5;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      const projText = phase.recommendedProjects.join("  •  ");
      const splitProj = doc.splitTextToSize(projText, pageWidth - 38);
      doc.text(splitProj, 22, y);
      y += splitProj.length * 4.5 + 3;
    }

    // Resources
    if (phase.freeResources && phase.freeResources.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Free Resources:", 18, y);
      y += 4.5;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(79, 70, 229);
      const resText = phase.freeResources.map((r) => `${r.name} (${r.url})`).join("  •  ");
      const splitRes = doc.splitTextToSize(resText, pageWidth - 38);
      doc.text(splitRes, 22, y);
      y += splitRes.length * 4.5 + 3;
    }

    y += 5; // Spacing before next phase
  });

  // Save File
  const cleanTitle = roadmap.careerTitle.toLowerCase().replace(/[^a-z0-9]/g, "_");
  doc.save(`${cleanTitle}_career_roadmap.pdf`);
};
