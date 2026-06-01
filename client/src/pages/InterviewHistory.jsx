import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import { FaArrowLeft } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";
import { motion } from "motion/react";

function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getMyInterviews = async () => {
      try {
        const result = await axios.get(
          ServerUrl + "/api/interview/get-interview",
          { withCredentials: true },
        );
        setInterviews(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMyInterviews();
  }, []);

  const totalInterviews = interviews.length;
  const avgScore = totalInterviews
    ? (
        interviews.reduce((acc, i) => acc + (i.finalScore || 0), 0) /
        totalInterviews
      ).toFixed(1)
    : 0;
  const bestScore = totalInterviews
    ? Math.max(...interviews.map((i) => i.finalScore || 0)).toFixed(1)
    : 0;
  const completed = interviews.filter((i) => i.status === "completed").length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate("/")}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <FaArrowLeft className="text-gray-400" size={14} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Interview History</h1>
            <p className="text-gray-500 text-sm">
              All your past practice sessions
            </p>
          </div>
        </div>
        {totalInterviews > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          >
            {[
              { label: "Total Sessions", value: totalInterviews },
              { label: "Completed", value: completed },
              { label: "Avg Score", value: `${avgScore}/10` },
              { label: "Best Score", value: `${bestScore}/10` },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[#111] border border-white/10 rounded-2xl p-4 text-center"
              >
                <p className="text-2xl font-bold text-emerald-400">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {interviews.length === 0 ? (
          <div className="bg-[#111] border border-white/10 rounded-2xl p-16 text-center">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎤</span>
            </div>
            <p className="text-white font-semibold mb-2">No interviews yet</p>
            <p className="text-gray-500 text-sm mb-6">
              Start your first AI mock interview to see results here.
            </p>
            <button
              onClick={() => navigate("/interview")}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2.5 rounded-xl font-semibold text-sm transition"
            >
              Start Interview <BsArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 pb-1">
              <p className="col-span-4 text-xs text-gray-600 uppercase tracking-wider font-semibold">
                Role
              </p>
              <p className="col-span-2 text-xs text-gray-600 uppercase tracking-wider font-semibold">
                Mode
              </p>
              <p className="col-span-2 text-xs text-gray-600 uppercase tracking-wider font-semibold">
                Date
              </p>
              <p className="col-span-2 text-xs text-gray-600 uppercase tracking-wider font-semibold">
                Score
              </p>
              <p className="col-span-2 text-xs text-gray-600 uppercase tracking-wider font-semibold">
                Status
              </p>
            </div>

            {interviews.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/report/${item._id}`)}
                className="group bg-[#111] border border-white/10 hover:border-emerald-500/40 rounded-2xl p-5 cursor-pointer transition-all hover:bg-white/3"
              >
                <div className="md:grid md:grid-cols-12 md:gap-4 md:items-center flex flex-col gap-3">
                  {/* Role + Experience */}
                  <div className="md:col-span-4">
                    <p className="font-semibold text-white text-sm">
                      {item.role}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.experience}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-xs text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                      {item.mode}
                    </span>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p
                      className={`text-lg font-bold ${
                        (item.finalScore || 0) >= 7
                          ? "text-emerald-400"
                          : (item.finalScore || 0) >= 4
                            ? "text-yellow-400"
                            : "text-gray-500"
                      }`}
                    >
                      {item.finalScore || 0}
                      <span className="text-gray-600 text-sm font-normal">
                        /10
                      </span>
                    </p>
                  </div>

                  <div className="md:col-span-2 flex items-center justify-between">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                        item.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}
                    >
                      {item.status}
                    </span>
                    <BsArrowRight
                      size={14}
                      className="text-white/20 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewHistory;
