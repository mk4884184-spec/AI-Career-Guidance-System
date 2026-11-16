import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import {
  User as UserIcon,
  Save,
  CheckCircle2,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Award,
  Code,
  Heart,
  MapPin,
  Target,
  Briefcase,
  Globe,
  Linkedin,
  Github,
  Edit3,
  Eye,
  Plus,
  X,
  Sparkles,
} from "lucide-react";

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [phone, setPhone] = useState<string>(user?.phone || "");
  const [education, setEducation] = useState<string>(user?.education || "Bachelor's Degree");
  const [college, setCollege] = useState<string>(user?.college || "");
  const [degree, setDegree] = useState<string>(user?.degree || "");
  const [skills, setSkills] = useState<string[]>(user?.skills || ["JavaScript", "React", "TypeScript", "Node.js"]);
  const [interests, setInterests] = useState<string[]>(
    user?.interests || ["Artificial Intelligence", "Web Development", "Cloud Systems"]
  );
  const [preferredLocation, setPreferredLocation] = useState<string>(user?.preferredLocation || "San Francisco, CA / Remote");
  const [careerGoal, setCareerGoal] = useState<string>(
    user?.careerGoal || user?.targetRole || "Full Stack AI Engineer"
  );
  const [experience, setExperience] = useState<string>(user?.experience || "Entry Level / Internship");
  const [experienceLevel, setExperienceLevel] = useState<string>(user?.experienceLevel || "Entry Level");
  const [languages, setLanguages] = useState<string[]>(user?.languages || ["English", "Spanish"]);
  const [linkedin, setLinkedin] = useState<string>(user?.linkedin || "");
  const [github, setGithub] = useState<string>(user?.github || "");
  const [bio, setBio] = useState<string>(user?.bio || "");

  // Tag Input Helpers
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newLanguage, setNewLanguage] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (itemToRemove: string) => {
    setInterests(interests.filter((i) => i !== itemToRemove));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage("");
    }
  };

  const handleRemoveLanguage = (langToRemove: string) => {
    setLanguages(languages.filter((l) => l !== langToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        name,
        email,
        phone,
        education,
        college,
        degree,
        skills,
        interests,
        preferredLocation,
        careerGoal,
        targetRole: careerGoal,
        experience,
        experienceLevel,
        languages,
        linkedin,
        github,
        bio,
      });
      toast.success("Student profile saved successfully!");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile.");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-505/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-2">
            <UserIcon className="w-3.5 h-3.5" /> Module 4 – Student Profile
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Student Profile Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, view, and update your complete student career profile synchronized with the backend database.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/10 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          {isEditing ? (
            <>
              <Eye className="w-4 h-4" />
              <span>View Profile</span>
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </>
          )}
        </button>
      </div>

      {/* Main Profile View / Edit Section */}
      {isEditing ? (
        /* EDIT FORM */
        <form onSubmit={handleSave} className="p-6 sm:p-8 premium-card space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3.5">
            <Edit3 className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Edit Student Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-350 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full premium-input px-4 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-350 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full premium-input px-4 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-350 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full premium-input px-4 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Preferred Location */}
            <div>
              <label className="block text-xs font-bold text-slate-350 mb-1.5">Preferred Location</label>
              <input
                type="text"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                className="w-full premium-input px-4 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
                placeholder="San Francisco, CA / Remote"
              />
            </div>

            {/* College */}
            <div>
              <label className="block text-xs font-bold text-slate-350 mb-1.5">College / University</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full premium-input px-4 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
                placeholder="Stanford University"
              />
            </div>

            {/* Degree */}
            <div>
              <label className="block text-xs font-bold text-slate-355 mb-1.5">Degree Program</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full premium-input px-4 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
                placeholder="B.S. Computer Science"
              />
            </div>

            {/* Education Summary */}
            <div>
              <label className="block text-xs font-bold text-slate-350 mb-1.5">Highest Education Level</label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-900/50 text-xs text-white outline-none cursor-pointer hover:bg-slate-900 transition-colors"
              >
                <option value="High School">High School</option>
                <option value="Associate's Degree">Associate's Degree</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Ph.D. / Doctorate">Ph.D. / Doctorate</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-xs font-bold text-slate-350 mb-1.5">Experience / Level</label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full premium-input px-4 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
                placeholder="e.g. 1 Year Internship Experience"
              />
            </div>

            {/* Career Goal */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-350 mb-1.5">Career Goal / Target Role</label>
              <input
                type="text"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full premium-input px-4 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
                placeholder="e.g. Lead AI Full Stack Engineer"
              />
            </div>            {/* LinkedIn */}
            <div>
              <label className="block text-xs font-bold text-slate-350 mb-1.5 flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5 text-sky-505" /> LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full premium-input px-4 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            {/* GitHub */}
            <div>
              <label className="block text-xs font-bold text-slate-350 mb-1.5 flex items-center gap-1">
                <Github className="w-3.5 h-3.5 text-slate-300" /> GitHub Profile URL
              </label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full premium-input px-4 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
                placeholder="https://github.com/username"
              />
            </div>
          </div>

          {/* Skills Tag Editor */}
          <div>
            <label className="block text-xs font-bold text-slate-350 mb-1.5">Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                className="flex-1 px-4 py-2 premium-input text-xs outline-none focus:bg-slate-950/80"
                placeholder="Add skill (e.g. React, Python)"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs font-bold flex items-center gap-1.5 border border-indigo-500/20"
                >
                  {s}
                  <button type="button" onClick={() => handleRemoveSkill(s)} className="text-indigo-400 hover:text-rose-450 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Interests Tag Editor */}
          <div>
            <label className="block text-xs font-bold text-slate-350 mb-1.5">Interests</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddInterest())}
                className="flex-1 px-4 py-2 premium-input text-xs outline-none focus:bg-slate-950/80"
                placeholder="Add interest (e.g. Machine Learning, Mobile Apps)"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {interests.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-300 text-xs font-bold flex items-center gap-1.5 border border-violet-500/20"
                >
                  {item}
                  <button type="button" onClick={() => handleRemoveInterest(item)} className="text-violet-400 hover:text-rose-450 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Languages Tag Editor */}
          <div>
            <label className="block text-xs font-bold text-slate-355 mb-1.5">Languages Spoken</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddLanguage())}
                className="flex-1 px-4 py-2 premium-input text-xs outline-none focus:bg-slate-950/80"
                placeholder="Add language (e.g. English, French)"
              />
              <button
                type="button"
                onClick={handleAddLanguage}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {languages.map((lang, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/20"
                >
                  {lang}
                  <button type="button" onClick={() => handleRemoveLanguage(lang)} className="text-emerald-405 hover:text-rose-450 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Bio / Bio Statement */}
          <div>
            <label className="block text-xs font-bold text-slate-350 mb-1.5">Bio / Professional Summary</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-4 premium-input text-xs outline-none focus:bg-slate-950/80 resize-y"
              placeholder="Brief professional overview or career objective..."
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/15 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-indigo-300 animate-pulse" /> Save Student Profile
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* VIEW MODE SUMMARY */
        <div className="space-y-6">
          {/* Main Profile Header Card */}
          <div className="p-6 sm:p-8 premium-card relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">{user?.name || "Student Name"}</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-350 text-xs font-bold border border-emerald-500/20">
                    Verified Student Profile
                  </span>
                </div>

                <p className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> Goal: {user?.careerGoal || user?.targetRole || "Software Engineer"}
                </p>

                <p className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold">
                    <Mail className="w-3.5 h-3.5 text-slate-450" /> {user?.email}
                  </span>
                  {user?.phone && (
                    <span className="flex items-center gap-1 font-semibold">
                      <Phone className="w-3.5 h-3.5 text-slate-450" /> {user.phone}
                    </span>
                  )}
                  {user?.preferredLocation && (
                    <span className="flex items-center gap-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-slate-450" /> {user.preferredLocation}
                    </span>
                  )}
                </p>
              </div>

              {/* Social Links */}
              <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                {user?.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-850 border border-slate-800 text-sky-400 hover:bg-slate-800 transition-all flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold w-full sm:w-auto cursor-pointer"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {user?.github && (
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-850 border border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold w-full sm:w-auto cursor-pointer"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Grid of Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Academic Information */}
            <div className="p-6 premium-card space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" /> Academic & Education
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950/40 border border-slate-900/50">
                  <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                    <Building className="w-3.5 h-3.5 text-slate-450" /> College / Institution:
                  </span>
                  <span className="font-bold text-white">{user?.college || "Not Specified"}</span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950/40 border border-slate-900/50">
                  <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                    <Award className="w-3.5 h-3.5 text-slate-450" /> Degree Program:
                  </span>
                  <span className="font-bold text-white">{user?.degree || "Not Specified"}</span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950/40 border border-slate-900/50">
                  <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-450" /> Education Level:
                  </span>
                  <span className="font-bold text-white">{user?.education || "Bachelor's Degree"}</span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950/40 border border-slate-900/50">
                  <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                    <Briefcase className="w-3.5 h-3.5 text-slate-450" /> Experience Level:
                  </span>
                  <span className="font-bold text-white">{user?.experience || user?.experienceLevel || "Entry Level"}</span>
                </div>
              </div>
            </div>

            {/* Languages & Preferred Location */}
            <div className="p-6 premium-card space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> Global & Personal Info
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1.5 font-semibold">Languages Spoken:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(user?.languages && user.languages.length > 0 ? user.languages : ["English"]).map((lang, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-350 text-xs font-bold border border-emerald-500/20"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1 font-semibold">Preferred Work Location:</span>
                  <p className="font-semibold text-slate-205 flex items-center gap-1 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    {user?.preferredLocation || "San Francisco, CA / Remote"}
                  </p>
                </div>

                {user?.bio && (
                  <div>
                    <span className="text-slate-400 block mb-1 font-semibold">Professional Bio:</span>
                    <p className="p-3 rounded-xl bg-slate-950/40 border border-slate-900/50 text-slate-300 italic text-xs leading-relaxed">
                      "{user.bio}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skills & Interests Tags Section */}
          <div className="p-6 premium-card space-y-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-405 flex items-center gap-1.5 mb-2">
                <Code className="w-4 h-4" /> Skills Competency
              </h3>
              <div className="flex flex-wrap gap-2">
                {(user?.skills && user.skills.length > 0 ? user.skills : ["JavaScript", "React", "TypeScript", "Node.js"]).map(
                  (skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 text-xs font-bold border border-indigo-500/20 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-2">
                <Heart className="w-4 h-4" /> Professional Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {(user?.interests && user.interests.length > 0
                  ? user.interests
                  : ["Artificial Intelligence", "Full Stack Development", "Cloud Architecture"]
                ).map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-300 text-xs font-bold border border-rose-500/20"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
