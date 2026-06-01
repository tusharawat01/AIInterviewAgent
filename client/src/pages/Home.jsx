import React from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
  BsArrowRight,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthModel from "../components/AuthModel";
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from "../components/Footer";

function Home() {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />

      <section className="relative px-6 pt-24 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[420px] bg-emerald-500/8 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-4 py-2 rounded-full tracking-wider uppercase mb-8"
          >
            <HiSparkles size={14} />
            AI Powered Smart Interview Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] mb-6"
          >
            <span className="text-white block">Practice Interviews</span>
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent block">
              with AI Intelligence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-500 text-lg max-w-xl mx-auto mb-10"
          >
            Role-based mock interviews with adaptive difficulty and real-time AI
            performance evaluation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-14"
          >
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                navigate("/interview");
              }}
              className="group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3.5 rounded-full font-bold transition shadow-xl shadow-emerald-500/25"
            >
              Start Interview
              <BsArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                navigate("/history");
              }}
              className="flex items-center gap-2 border border-white/15 hover:border-white/30 text-white px-8 py-3.5 rounded-full font-medium transition"
            >
              View History
            </button>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Voice Recognition",
              "AI Scoring",
              "PDF Reports",
              "Resume Parsing",
              "Interview History",
            ].map((tag, i) => (
              <span
                key={i}
                className="text-xs text-gray-600 border border-white/8 px-4 py-1.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-emerald-400 tracking-widest uppercase mb-3">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Three steps to interview confidence
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 relative">
            <div className="hidden md:block absolute top-14 left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-px border-t border-dashed border-white/10 pointer-events-none" />

            {[
              {
                icon: <BsRobot size={22} />,
                step: "01",
                title: "Role & Experience",
                desc: "Select your job role and experience level. AI tailors question difficulty accordingly.",
              },
              {
                icon: <BsMic size={22} />,
                step: "02",
                title: "Voice Interview",
                desc: "Answer questions aloud. AI reads them out and listens to your spoken responses.",
              },
              {
                icon: <BsClock size={22} />,
                step: "03",
                title: "Timed Simulation",
                desc: "Each question has a countdown timer that mimics real interview pressure.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group relative bg-white/3 border border-white/8 rounded-2xl p-8 hover:border-emerald-500/30 hover:bg-white/5 transition-all"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    {item.icon}
                  </div>
                  <span className="text-5xl font-black text-white/5 group-hover:text-white/8 transition select-none leading-none">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-emerald-400 tracking-widest uppercase mb-3">
              Capabilities
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                prepare better
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                image: evalImg,
                icon: <BsBarChart size={16} />,
                title: "AI Answer Evaluation",
                desc: "Scores confidence, communication, and technical accuracy on every answer.",
              },
              {
                image: resumeImg,
                icon: <BsFileEarmarkText size={16} />,
                title: "Resume Based Interview",
                desc: "Upload your resume and get questions tailored to your actual projects and skills.",
              },
              {
                image: pdfImg,
                icon: <BsFileEarmarkText size={16} />,
                title: "Downloadable PDF Report",
                desc: "Get a detailed performance report with strengths, weaknesses, and improvement tips.",
              },
              {
                image: analyticsImg,
                icon: <BsBarChart size={16} />,
                title: "History & Analytics",
                desc: "Track your score trends and skill improvement across multiple interview sessions.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-emerald-500/25 transition-all"
              >
                <div className="h-48 bg-white/3 border-b border-white/8 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-36 object-contain opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-emerald-400 tracking-widest uppercase mb-3">
              Interview Modes
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Practice the way{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                real interviews work
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                img: hrImg,
                title: "HR Interview Mode",
                desc: "Behavioral and communication based evaluation.",
                tag: "Behavioral",
              },
              {
                img: techImg,
                title: "Technical Mode",
                desc: "Deep technical questioning based on selected role.",
                tag: "Technical",
              },
              {
                img: confidenceImg,
                title: "Confidence Detection",
                desc: "Basic tone and voice analysis insights.",
                tag: "Voice",
              },
              {
                img: creditImg,
                title: "Credits System",
                desc: "Unlock premium interview sessions easily.",
                tag: "Flexible",
              },
            ].map((mode, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ x: 4 }}
                className="group flex items-center gap-5 bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-emerald-500/30 hover:bg-white/5 transition-all"
              >
                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={mode.img}
                    alt={mode.title}
                    className="w-11 h-11 object-contain opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-white text-sm">
                      {mode.title}
                    </h3>
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex-shrink-0">
                      {mode.tag}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {mode.desc}
                  </p>
                </div>
                <BsArrowRight
                  size={16}
                  className="text-white/20 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all flex-shrink-0"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 border border-emerald-500/20 rounded-3xl p-12 text-center overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-emerald-500/10 blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to ace your next interview?
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Start practicing with AI today. Get real feedback and build the
                confidence you need.
              </p>
              <button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/interview");
                }}
                className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-black px-10 py-4 rounded-full font-bold text-lg transition shadow-xl shadow-emerald-500/25"
              >
                Start Free Interview
                <BsArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
      <Footer />
    </div>
  );
}

export default Home;
