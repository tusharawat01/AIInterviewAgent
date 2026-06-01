import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'motion/react'
import axios from 'axios'
import { ServerUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { FaArrowLeft, FaFileUpload, FaCheck, FaTimes } from 'react-icons/fa'
import { BsArrowRight, BsLightningFill } from 'react-icons/bs'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

function AtsChecker() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userData } = useSelector((state) => state.user)

    const [resumeFile, setResumeFile] = useState(null)
    const [jobDescription, setJobDescription] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState("")

    const handleCheck = async () => {
        if (!resumeFile) { setError("Please upload your resume PDF."); return }
        if (!jobDescription.trim()) { setError("Please paste the job description."); return }
        setError("")
        setLoading(true)
        setResult(null)

        const formData = new FormData()
        formData.append("resume", resumeFile)
        formData.append("jobDescription", jobDescription)

        try {
            const res = await axios.post(ServerUrl + "/api/ats/check", formData, { withCredentials: true })
            setResult(res.data)
            if (userData) {
                dispatch(setUserData({ ...userData, credits: res.data.creditsLeft }))
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const getScoreColor = (score) => {
        if (score >= 75) return "#34d399"
        if (score >= 50) return "#fbbf24"
        return "#f87171"
    }

    const getScoreLabel = (score) => {
        if (score >= 75) return { text: "Great Match", color: "text-emerald-400" }
        if (score >= 50) return { text: "Partial Match", color: "text-yellow-400" }
        return { text: "Poor Match", color: "text-red-400" }
    }

    return (
        <div className='h-screen bg-[#0a0a0a] flex flex-col overflow-hidden'>

            {/* Header */}
            <div className='bg-[#0a0a0a] border-b border-white/8 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0'>
                <div className='flex items-center gap-3'>
                    <button onClick={() => navigate("/")}
                        className='p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition'>
                        <FaArrowLeft className='text-gray-400' size={13} />
                    </button>
                    <div>
                        <h1 className='text-base sm:text-lg font-bold text-white'>ATS Score Checker</h1>
                        <p className='text-xs text-gray-500 hidden sm:block'>Check how well your resume matches a job description</p>
                    </div>
                </div>
                <div className='flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg'>
                    <BsLightningFill size={12} className='text-emerald-400' />
                    <span className='text-xs text-gray-400'><span className='text-white font-semibold'>25</span> credits per check</span>
                </div>
            </div>

            {/* Main content */}
            <div className='flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0'>

                {/* Left: Input panel */}
                <div className='w-full lg:w-[42%] border-b lg:border-b-0 lg:border-r border-white/8 flex flex-col p-4 sm:p-6 gap-4 overflow-y-auto'>

                    {/* Resume upload */}
                    <div>
                        <label className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block'>
                            Resume <span className='text-gray-700 font-normal normal-case'>(PDF only)</span>
                        </label>
                        <div
                            onClick={() => document.getElementById("atsResumeUpload").click()}
                            className={`flex items-center gap-4 border border-dashed rounded-xl p-4 cursor-pointer transition group ${
                                resumeFile
                                    ? "border-emerald-500/40 bg-emerald-500/5"
                                    : "border-white/10 hover:border-emerald-500/30 hover:bg-white/3"
                            }`}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                resumeFile ? "bg-emerald-500/15 border border-emerald-500/20 text-emerald-400" : "bg-white/5 border border-white/10 text-gray-500"
                            }`}>
                                <FaFileUpload size={14} />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className={`text-sm truncate font-medium ${resumeFile ? "text-emerald-400" : "text-gray-500"}`}>
                                    {resumeFile ? resumeFile.name : "Click to upload resume PDF"}
                                </p>
                                <p className='text-xs text-gray-600 mt-0.5'>PDF · Max 5MB</p>
                            </div>
                            {resumeFile && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setResumeFile(null) }}
                                    className='text-gray-600 hover:text-red-400 transition flex-shrink-0'>
                                    <FaTimes size={14} />
                                </button>
                            )}
                            <input
                                type="file"
                                accept="application/pdf"
                                id="atsResumeUpload"
                                className='hidden'
                                onChange={(e) => { setResumeFile(e.target.files[0]); setError("") }}
                            />
                        </div>
                    </div>

                    {/* Job description */}
                    <div className='flex-1 flex flex-col min-h-0'>
                        <label className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block'>
                            Job Description
                        </label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => { setJobDescription(e.target.value); setError("") }}
                            placeholder="Paste the full job description here — including required skills, responsibilities, and qualifications..."
                            className='flex-1 min-h-[180px] bg-white/3 border border-white/8 hover:border-white/15 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-gray-600 p-4 rounded-xl resize-none outline-none transition text-sm leading-relaxed'
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p className='text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg'>{error}</p>
                    )}

                    {/* Submit */}
                    <motion.button
                        onClick={handleCheck}
                        disabled={loading || !resumeFile || !jobDescription.trim()}
                        whileTap={{ scale: 0.97 }}
                        className='w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-emerald-500/20 flex-shrink-0'>
                        {loading ? (
                            <>
                                <span className='w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin' />
                                Analyzing Resume…
                            </>
                        ) : (
                            <>Check ATS Score <BsArrowRight size={15} /></>
                        )}
                    </motion.button>

                    <p className='text-center text-xs text-gray-600'>
                        You have <span className='text-white'>{userData?.credits || 0}</span> credits
                    </p>
                </div>

                {/* Right: Results panel */}
                <div className='flex-1 overflow-y-auto p-4 sm:p-6'>
                    {!result && !loading && (
                        <div className='h-full flex flex-col items-center justify-center text-center gap-4 py-16'>
                            <div className='w-20 h-20 bg-white/3 border border-white/8 rounded-2xl flex items-center justify-center'>
                                <span className='text-4xl'>📄</span>
                            </div>
                            <div>
                                <p className='text-white font-semibold text-lg mb-1'>No results yet</p>
                                <p className='text-gray-500 text-sm max-w-xs'>Upload your resume and paste a job description to see your ATS compatibility score.</p>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className='h-full flex flex-col items-center justify-center text-center gap-4'>
                            <div className='w-16 h-16 border-2 border-white/10 border-t-emerald-400 rounded-full animate-spin' />
                            <div>
                                <p className='text-white font-semibold'>Analyzing your resume…</p>
                                <p className='text-gray-500 text-sm mt-1'>AI is comparing against the job description</p>
                            </div>
                        </div>
                    )}

                    {result && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='space-y-5'>

                            {/* Score + summary */}
                            <div className='bg-[#111] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5'>
                                <div className='w-28 h-28 flex-shrink-0'>
                                    <CircularProgressbar
                                        value={result.atsScore}
                                        text={`${result.atsScore}`}
                                        styles={buildStyles({
                                            textSize: "26px",
                                            pathColor: getScoreColor(result.atsScore),
                                            textColor: getScoreColor(result.atsScore),
                                            trailColor: "#1f2937",
                                        })}
                                    />
                                </div>
                                <div>
                                    <p className='text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1'>ATS Score</p>
                                    <p className={`text-2xl font-bold mb-1 ${getScoreLabel(result.atsScore).color}`}>
                                        {getScoreLabel(result.atsScore).text}
                                    </p>
                                    <p className='text-gray-400 text-sm leading-relaxed'>{result.summary}</p>
                                </div>
                            </div>

                            {/* Section scores */}
                            <div className='bg-[#111] border border-white/10 rounded-2xl p-5'>
                                <p className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-4'>Section Scores</p>
                                <div className='grid grid-cols-2 gap-4'>
                                    {Object.entries(result.sectionScores || {}).map(([key, val]) => (
                                        <div key={key}>
                                            <div className='flex justify-between mb-1.5'>
                                                <span className='text-gray-400 text-xs capitalize'>{key}</span>
                                                <span className={`text-xs font-bold ${val >= 7 ? "text-emerald-400" : val >= 4 ? "text-yellow-400" : "text-red-400"}`}>{val}/10</span>
                                            </div>
                                            <div className='h-1.5 bg-white/10 rounded-full'>
                                                <div
                                                    className='h-full rounded-full transition-all'
                                                    style={{
                                                        width: `${val * 10}%`,
                                                        backgroundColor: val >= 7 ? "#34d399" : val >= 4 ? "#fbbf24" : "#f87171"
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Keywords */}
                            <div className='grid sm:grid-cols-2 gap-4'>
                                {/* Matched */}
                                <div className='bg-[#111] border border-white/10 rounded-2xl p-5'>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <div className='w-5 h-5 bg-emerald-500/15 border border-emerald-500/20 rounded-full flex items-center justify-center'>
                                            <FaCheck size={8} className='text-emerald-400' />
                                        </div>
                                        <p className='text-xs font-bold text-emerald-400 uppercase tracking-wider'>
                                            Matched <span className='text-gray-500 font-normal normal-case'>({result.matchedKeywords?.length || 0})</span>
                                        </p>
                                    </div>
                                    <div className='flex flex-wrap gap-1.5'>
                                        {result.matchedKeywords?.map((kw, i) => (
                                            <span key={i} className='text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded-full'>
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Missing */}
                                <div className='bg-[#111] border border-white/10 rounded-2xl p-5'>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <div className='w-5 h-5 bg-red-500/15 border border-red-500/20 rounded-full flex items-center justify-center'>
                                            <FaTimes size={8} className='text-red-400' />
                                        </div>
                                        <p className='text-xs font-bold text-red-400 uppercase tracking-wider'>
                                            Missing <span className='text-gray-500 font-normal normal-case'>({result.missingKeywords?.length || 0})</span>
                                        </p>
                                    </div>
                                    <div className='flex flex-wrap gap-1.5'>
                                        {result.missingKeywords?.map((kw, i) => (
                                            <span key={i} className='text-xs bg-red-500/10 text-red-300 border border-red-500/20 px-2.5 py-1 rounded-full'>
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Suggestions */}
                            <div className='bg-[#111] border border-white/10 rounded-2xl p-5'>
                                <p className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-4'>Improvement Suggestions</p>
                                <div className='space-y-2.5'>
                                    {result.suggestions?.map((tip, i) => (
                                        <div key={i} className='flex items-start gap-3'>
                                            <span className='text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                                                {i + 1}
                                            </span>
                                            <p className='text-sm text-gray-400 leading-relaxed'>{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AtsChecker
