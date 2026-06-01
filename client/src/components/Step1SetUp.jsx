import React from "react";
import { motion } from "motion/react";
import { FaUserTie, FaBriefcase, FaFileUpload } from "react-icons/fa";
import { BsRobot, BsChevronDown } from "react-icons/bs";
import { useState } from "react";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { BsArrowRight } from "react-icons/bs";

function Step1SetUp({ onStart }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);
    const formdata = new FormData();
    formdata.append("resume", resumeFile);
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/resume",
        formdata,
        { withCredentials: true },
      );
      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setProjects(result.data.projects || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);
      setAnalyzing(false);
    } catch (error) {
      console.log(error);
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/generate-questions",
        { role, experience, mode, resumeText, projects, skills },
        { withCredentials: true },
      );
      if (userData) {
        dispatch(
          setUserData({ ...userData, credits: result.data.creditsLeft }),
        );
      }
      setLoading(false);
      onStart(result.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const modeLabels = {
    Technical: {
      label: "Technical Interview",
      desc: "Coding & problem solving",
    },
    HR: { label: "HR Interview", desc: "Behavioral & soft skills" },
    "System Design": {
      label: "System Design",
      desc: "Architecture & scalability",
    },
  };

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-4"
      >
        <div className="bg-emerald-500 text-black p-2 rounded-xl">
          <BsRobot size={16} />
        </div>
        <span className="font-bold text-base text-white">
          AI Interview Agent
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Set up your interview
          </h1>
          <p className="text-gray-500 text-sm">
            Tell us about your role so AI can tailor the right questions for
            you.
          </p>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-5 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
              Job Role
            </label>
            <div className="relative">
              <FaUserTie
                className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-600"
                size={14}
              />
              <input
                type="text"
                placeholder="e.g. Frontend Developer, Data Analyst"
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/8 text-white placeholder-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 outline-none transition text-sm"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
              Experience
            </label>
            <div className="relative">
              <FaBriefcase
                className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-600"
                size={14}
              />
              <input
                type="text"
                placeholder="e.g. 2 years, Fresher, 5+ years"
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/8 text-white placeholder-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 outline-none transition text-sm"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
              Interview Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {Object.entries(modeLabels).map(([val, { label, desc }]) => (
                <button
                  key={val}
                  onClick={() => setMode(val)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    mode === val
                      ? "border-emerald-500/60 bg-emerald-500/10 text-white"
                      : "border-white/8 bg-white/3 text-gray-500 hover:border-white/15"
                  }`}
                >
                  <p className="text-xs font-semibold leading-tight">{label}</p>
                  <p className="text-xs text-gray-600 mt-0.5 leading-tight">
                    {desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
              Resume{" "}
              <span className="text-gray-700 normal-case font-normal">
                (optional)
              </span>
            </label>

            {analyzing && (
              <div className="animate-pulse bg-white/5 border border-white/8 rounded-xl p-4 space-y-2">
                <div className="h-2.5 bg-white/10 rounded w-3/4"></div>
                <div className="h-2.5 bg-white/10 rounded w-1/2"></div>
                <p className="text-xs text-gray-600 pt-1">
                  Analyzing resume with AI...
                </p>
              </div>
            )}

            {!analysisDone && !analyzing && (
              <div
                onClick={() => document.getElementById("resumeUpload").click()}
                className="flex items-center gap-4 border border-dashed border-white/10 hover:border-emerald-500/30 bg-white/3 hover:bg-white/5 rounded-xl p-4 cursor-pointer transition group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <FaFileUpload size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-400 truncate">
                    {resumeFile
                      ? resumeFile.name
                      : "Click to upload PDF resume"}
                  </p>
                  <p className="text-xs text-gray-600">PDF only · Max 5MB</p>
                </div>
                {resumeFile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume();
                    }}
                    className="text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-500/25 transition flex-shrink-0"
                  >
                    Analyze
                  </button>
                )}
                <input
                  type="file"
                  accept="application/pdf"
                  id="resumeUpload"
                  className="hidden"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
              </div>
            )}

            {analysisDone && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <p className="text-xs font-semibold text-emerald-400">
                    Resume analyzed successfully
                  </p>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {skills.slice(0, 6).map((s, i) => (
                      <span
                        key={i}
                        className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2.5 py-1 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                    {skills.length > 6 && (
                      <span className="text-xs text-gray-600 py-1">
                        +{skills.length - 6} more
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          <motion.button
            onClick={handleStart}
            disabled={!role || !experience || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-emerald-500/20 mt-1"
          >
            {loading ? (
              "Generating Questions..."
            ) : (
              <>
                Start Interview <BsArrowRight size={16} />
              </>
            )}
          </motion.button>
        </div>

        <p className="text-center text-xs text-gray-600 mt-3">
          Each interview costs 50 credits · You have {userData?.credits || 0}{" "}
          credits
        </p>
      </motion.div>
    </div>
  );
}

export default Step1SetUp;
