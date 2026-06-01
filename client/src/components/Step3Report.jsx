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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
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
  let shortTagline = "";
  let scoreColor = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured responses.";
    scoreColor = "text-emerald-400";
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement.";
    shortTagline = "Good foundation, refine articulation.";
    scoreColor = "text-yellow-400";
  } else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work on clarity and confidence.";
    scoreColor = "text-red-400";
  }

  const percentage = (finalScore / 10) * 100;

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let currentY = 25;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94);
    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 5;
    doc.setDrawColor(34, 197, 94);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
    currentY += 15;

    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Final Score: ${finalScore}/10`, pageWidth / 2, currentY + 12, {
      align: "center",
    });
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
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question,
        `${q.score}/10`,
        q.feedback,
      ]),
      styles: { fontSize: 9, cellPadding: 5, valign: "top" },
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        halign: "center",
      },
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
    <div className="min-h-screen bg-[#0a0a0a] px-4 sm:px-6 lg:px-10 py-6 sm:py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/history")}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <FaArrowLeft className="text-gray-400" size={14} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Interview Report</h1>
            <p className="text-gray-500 text-sm">
              AI-powered performance analysis
            </p>
          </div>
        </div>
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2.5 rounded-xl font-semibold text-sm transition"
        >
          <FaDownload size={13} />
          Download PDF
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8"
      >
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 text-center col-span-2 lg:col-span-1 flex flex-col items-center">
          <div className="w-20 h-20 mb-4">
            <CircularProgressbar
              value={percentage}
              text={`${finalScore}/10`}
              styles={buildStyles({
                textSize: "20px",
                pathColor: "#34d399",
                textColor: "#34d399",
                trailColor: "#1f2937",
              })}
            />
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
            Final Score
          </p>
          <p className={`text-xs mt-1 font-medium ${scoreColor}`}>
            {performanceText}
          </p>
        </div>

        {skills.map((s, i) => (
          <div
            key={i}
            className="bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col justify-between"
          >
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
              {s.label}
            </p>
            <div>
              <p
                className={`text-3xl font-bold mb-3 ${s.value >= 7 ? "text-emerald-400" : s.value >= 4 ? "text-yellow-400" : "text-red-400"}`}
              >
                {s.value}
                <span className="text-gray-600 text-lg">/10</span>
              </p>
              <div className="bg-white/10 h-1.5 rounded-full">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all"
                  style={{ width: `${s.value * 10}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-white">Score Trend</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Question by question performance
            </p>
          </div>
          <span className="text-xs text-gray-600 border border-white/8 px-3 py-1 rounded-full">
            {questionWiseScore.length} Questions
          </span>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={questionScoreData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="name"
                stroke="#374151"
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                domain={[0, 10]}
                stroke="#374151"
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#34d399"
                fill="url(#scoreGrad)"
                strokeWidth={2.5}
                dot={{ fill: "#34d399", strokeWidth: 0, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white">Question Breakdown</h3>
          <p className="text-xs text-gray-500">
            {questionWiseScore.length} questions evaluated
          </p>
        </div>

        <div className="space-y-3">
          {questionWiseScore.map((q, i) => (
            <div
              key={i}
              className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-white/15 transition"
            >
              <div className="flex items-start gap-4 p-5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
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
                  <p className="text-xs text-gray-600 mb-1">Question {i + 1}</p>
                  <p className="text-white text-sm font-medium leading-relaxed mb-3">
                    {q.question || "Question not available"}
                  </p>
                  <div className="flex items-start gap-2 bg-white/3 border border-white/8 rounded-xl p-3">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0" />
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {q.feedback && q.feedback.trim() !== ""
                        ? q.feedback
                        : "No feedback available."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Step3Report;
