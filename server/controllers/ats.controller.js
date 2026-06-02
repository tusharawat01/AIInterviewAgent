import pdfParse from "pdf-parse/lib/pdf-parse.js"
import { askAi } from "../services/openRouter.service.js"
import User from "../models/user.model.js"

export const checkAts = async (req, res) => {
  try {
    const { jobDescription } = req.body

    if (!req.file) {
      return res.status(400).json({ message: "Resume PDF is required." })
    }

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ message: "Job description is required." })
    }

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    if (user.credits < 25) {
      return res.status(400).json({ message: "Not enough credits. Minimum 25 required." })
    }

    const pdfData = await pdfParse(req.file.buffer)
    const resumeText = pdfData.text.replace(/\s+/g, " ").trim()

    const messages = [
      {
        role: "system",
        content: `
You are an expert ATS (Applicant Tracking System) analyst. Analyze the resume against the job description and return a precise ATS compatibility report.

Rules:
- Be realistic and accurate.
- matchedKeywords: keywords/skills from the job description that are found in the resume.
- missingKeywords: important keywords/skills from the job description NOT found in the resume (max 10).
- sectionScores: score each section out of 10 based on relevance and quality.
- suggestions: give 3 to 5 specific, actionable improvement tips.
- summary: 1-2 sentences summarizing the match quality.

Return ONLY valid JSON in this exact format, nothing else:

{
  "atsScore": number between 0 and 100,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "sectionScores": {
    "skills": number 0-10,
    "experience": number 0-10,
    "education": number 0-10,
    "format": number 0-10
  },
  "suggestions": ["tip1", "tip2", "tip3"],
  "summary": "string"
}
`
      },
      {
        role: "user",
        content: `
Job Description:
${jobDescription.trim()}

Resume:
${resumeText}
`
      }
    ]

    const aiResponse = await askAi(messages)
    const parsed = JSON.parse(aiResponse)

    user.credits -= 25
    await user.save()

    return res.status(200).json({
      ...parsed,
      creditsLeft: user.credits
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: `ATS check failed: ${error.message}` })
  }
}
