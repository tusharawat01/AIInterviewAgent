import React from "react";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Step3Report({ report }) {
  if (!report) {
    return (
      <div className="h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading Report...</p>
      </div>
    );
  }

  const navigate = useNavigate();
  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0,
  }));

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let scoreColor = "";

  if (finalScore >= 8) {
    performanceText = "Excellent performance";
    scoreColor = "text-emerald-400";
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement";
    scoreColor = "text-yellow-400";
  } else {
    performanceText = "Significant improvement needed";
    scoreColor = "text-red-400";
  }

  const percentage = (finalScore / 10) * 100;

  const getScoreColor = (val) =>
    val >= 7 ? "text-emerald-400" : val >= 4 ? "text-yellow-400" : "text-red-400";
  const getBarColor = (val) =>
    val >= 7 ? "#34d399" : val >= 4 ? "#fbbf24" : "#f87171";

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let currentY = 25;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94);
    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, { align: "center" });

    currentY += 5;
    doc.setDrawColor(34, 197, 94);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
    currentY += 15;

    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Final Score: ${finalScore}/10`, pageWidth / 2, currentY + 12, { align: "center" });
    currentY += 30;

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");
    doc.setFontSize(12);
    doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
    doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
    doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);
    currentY += 45;

    let advice =
      finalScore >= 8
        ? "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples."
        : finalScore >= 5
          ? "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples."
          : "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.";

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220);
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);
    doc.setFont("helvetica", "bold");
    doc.text("Professional Advice", margin + 10, currentY + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
    doc.text(splitAdvice, margin + 10, currentY + 20);
    currentY += 50;

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseScore.map((q, i) => [`${i + 1}`, q.question, `${q.score}/10`, q.feedback]),
      styles: { fontSize: 9, cellPadding: 5, valign: "top" },
      headStyles: { fillColor: [34, 197, 94], textColor: 255, halign: "center" },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 55 },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: "auto" },
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
    });

    doc.save("AI_Interview_Report.pdf");
  };

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col overflow-hidden">

      {/* ── Header bar ── */}
      <div className="flex-shrink-0 bg-[#0a0a0a] border-b border-white/8 px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/history")}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <FaArrowLeft className="text-gray-400" size={13} />
          </button>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">Interview Report</h1>
            <p className="text-xs text-gray-600 hidden sm:block">AI-powered performance analysis</p>
          </div>
        </div>
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg font-semibold text-xs transition"
        >
          <FaDownload size={11} />
          Download PDF
        </button>
      </div>

      {/* ── Body: two columns ── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">

        {/* Left panel — scores + chart */}
        <div className="w-full lg:w-[38%] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-white/8 flex flex-col overflow-y-auto p-4 sm:p-5 gap-4">

          {/* Score card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111] border border-white/10 rounded-2xl p-4 flex items-center gap-5"
          >
            <div className="w-20 h-20 flex-shrink-0">
              <CircularProgressbar
                value={percentage}
                text={`${finalScore}/10`}
                styles={buildStyles({
                  textSize: "22px",
                  pathColor: "#34d399",
                  textColor: "#34d399",
                  trailColor: "#1f2937",
                })}
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Final Score</p>
              <p className={`text-base font-bold ${scoreColor}`}>{performanceText}</p>
            </div>
          </motion.div>

          {/* Skill bars */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-[#111] border border-white/10 rounded-2xl p-4 space-y-3"
          >
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Skill Breakdown</p>
            {skills.map((s, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-gray-400">{s.label}</span>
                  <span className={`text-sm font-bold ${getScoreColor(s.value)}`}>{s.value}/10</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${s.value * 10}%`, backgroundColor: getBarColor(s.value) }}
                  />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#111] border border-white/10 rounded-2xl p-4 flex-1 min-h-[180px]"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Score Trend</p>
              <span className="text-xs text-gray-600 border border-white/8 px-2 py-0.5 rounded-full">
                {questionWiseScore.length}Q
              </span>
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData}>
                  <defs>
                    <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="name" stroke="#374151" tick={{ fill: "#6b7280", fontSize: 11 }} />
                  <YAxis domain={[0, 10]} stroke="#374151" tick={{ fill: "#6b7280", fontSize: 11 }} width={24} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#34d399"
                    fill="url(#sg)"
                    strokeWidth={2}
                    dot={{ fill: "#34d399", strokeWidth: 0, r: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Right panel — question breakdown (scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Question Breakdown</p>
            <span className="text-xs text-gray-600">{questionWiseScore.length} questions</span>
          </div>

          <div className="space-y-3">
            {questionWiseScore.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-[#111] border border-white/10 rounded-2xl p-4 hover:border-white/15 transition"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      (q.score ?? 0) >= 7
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                        : (q.score ?? 0) >= 4
                          ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
                          : "bg-red-500/15 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {q.score ?? 0}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 mb-0.5">Question {i + 1}</p>
                    <p className="text-white text-sm font-medium leading-relaxed mb-2">
                      {q.question || "Question not available"}
                    </p>
                    <div className="flex items-start gap-2 bg-white/3 border border-white/8 rounded-lg p-2.5">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1 flex-shrink-0" />
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {q.feedback && q.feedback.trim() !== ""
                          ? q.feedback
                          : "No feedback available."}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step3Report;
