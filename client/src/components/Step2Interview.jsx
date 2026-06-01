import React from "react";
import maleVideo from "../assets/videos/male-ai.mp4";
import femaleVideo from "../assets/videos/female-ai.mp4";
import Timer from "./Timer";
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { BsRobot } from "react-icons/bs";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import axios from "axios";
import { ServerUrl } from "../App";
import { BsArrowRight } from "react-icons/bs";

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName, mode } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");

  const videoRef = useRef(null);
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female"),
      );
      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }
      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male"),
      );
      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();
      const humanText = text.replace(/,/g, ", ... ").replace(/\./g, ". ... ");
      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;
      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        videoRef.current?.play();
      };
      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);
        if (isMicOn) startMic();
        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };
      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!selectedVoice) return;
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`,
        );
        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin.",
        );
        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((r) => setTimeout(r, 800));
        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }
        await speakText(currentQuestion.question);
        if (isMicOn) startMic();
      }
    };
    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex]);

  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };
    recognitionRef.current = recognition;
  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch {}
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };

  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic();
    setIsSubmitting(true);
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
        },
        { withCredentials: true },
      );
      setFeedback(result.data.feedback);
      speakText(result.data.feedback);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    setAnswer("");
    setFeedback("");
    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }
    await speakText("Alright, let's move to the next question.");
    setCurrentIndex(currentIndex + 1);
    setTimeout(() => {
      if (isMicOn) startMic();
    }, 500);
  };

  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false);
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/finish",
        { interviewId },
        { withCredentials: true },
      );
      onFinish(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col overflow-hidden">
      <div className="bg-[#0a0a0a] border-b border-white/8 px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 text-black p-1.5 rounded-lg flex-shrink-0">
            <BsRobot size={14} />
          </div>
          <span className="font-semibold text-white text-xs sm:text-sm hidden xs:block">
            AI Interview Agent
          </span>
          {mode && (
            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full hidden sm:block">
              {mode}
            </span>
          )}
        </div>

        {!isIntroPhase && (
          <div className="hidden sm:flex items-center gap-1.5">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i < currentIndex
                    ? "w-5 bg-emerald-500"
                    : i === currentIndex
                      ? "w-7 bg-emerald-400"
                      : "w-3 bg-white/10"
                }`}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          {isAIPlaying && (
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="text-xs text-emerald-400 font-medium hidden sm:block"
            >
              AI Speaking…
            </motion.span>
          )}
          {!isIntroPhase && (
            <div className="flex items-center gap-1.5">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit}
              />
              {timeLeft <= 10 && timeLeft > 0 && (
                <motion.span
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  className="text-red-400 text-xs font-semibold"
                >
                  ⚠
                </motion.span>
              )}
            </div>
          )}
          <span className="text-xs text-gray-600 border border-white/8 px-2 py-1 rounded-full whitespace-nowrap">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        <div className="w-full lg:w-2/5 bg-[#0d0d0d] border-b lg:border-b-0 lg:border-r border-white/8 flex flex-col items-center justify-center p-4 sm:p-5 gap-3 overflow-y-auto">
          <div className="w-full max-w-xs sm:max-w-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-auto object-cover"
            />
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-all ${
              isAIPlaying
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                : "bg-white/5 border-white/10 text-gray-500"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${isAIPlaying ? "bg-emerald-400 animate-pulse" : "bg-gray-600"}`}
            />
            {isAIPlaying ? "AI is speaking" : "Waiting for your answer"}
          </div>

          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-xs bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <p className="text-gray-300 text-sm text-center leading-relaxed">
                {subtitle}
              </p>
            </motion.div>
          )}
        </div>

        <div className="flex-1 flex flex-col p-4 sm:p-5 lg:p-6 overflow-y-auto">
          {!isIntroPhase && currentQuestion && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Question {currentIndex + 1}
                </span>
                <span className="text-xs text-gray-700">·</span>
                <span
                  className={`text-xs font-medium capitalize px-2 py-0.5 rounded-full border ${
                    currentQuestion.difficulty === "hard"
                      ? "text-red-400 bg-red-500/10 border-red-500/20"
                      : currentQuestion.difficulty === "medium"
                        ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                        : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  }`}
                >
                  {currentQuestion.difficulty}
                </span>
              </div>
              <h2 className="text-xl lg:text-2xl font-semibold text-white leading-relaxed">
                {currentQuestion.question}
              </h2>
            </motion.div>
          )}

          {isIntroPhase && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BsRobot size={24} className="text-emerald-400" />
                </div>
                <p className="text-white font-semibold text-lg mb-2">
                  Getting ready…
                </p>
                <p className="text-gray-500 text-sm">
                  AI is preparing your personalized interview
                </p>
              </div>
            </div>
          )}

          {!isIntroPhase && (
            <div className="flex-1 flex flex-col gap-4">
              {!feedback ? (
                <>
                  <textarea
                    placeholder="Speak your answer or type here..."
                    onChange={(e) => setAnswer(e.target.value)}
                    value={answer}
                    className="flex-1 min-h-[160px] bg-white/3 border border-white/8 hover:border-white/15 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-gray-600 p-5 rounded-2xl resize-none outline-none transition text-sm leading-relaxed"
                  />

                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={toggleMic}
                      whileTap={{ scale: 0.9 }}
                      className={`w-12 h-12 flex items-center justify-center rounded-xl border transition ${
                        isMicOn
                          ? "bg-white/10 border-white/15 text-white hover:bg-white/15"
                          : "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/15"
                      }`}
                    >
                      {isMicOn ? (
                        <FaMicrophone size={16} />
                      ) : (
                        <FaMicrophoneSlash size={16} />
                      )}
                    </motion.button>

                    <motion.button
                      onClick={submitAnswer}
                      disabled={isSubmitting}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-black py-3.5 rounded-xl font-bold transition shadow-lg shadow-emerald-500/20"
                    >
                      {isSubmitting ? "Evaluating…" : "Submit Answer"}
                      {!isSubmitting && <BsArrowRight size={16} />}
                    </motion.button>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col gap-4"
                >
                  <div className="flex-1 bg-emerald-500/8 border border-emerald-500/25 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        AI Feedback
                      </p>
                    </div>
                    <p className="text-white text-base leading-relaxed">
                      {feedback}
                    </p>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-black py-4 rounded-xl font-bold transition shadow-lg shadow-emerald-500/20"
                  >
                    {currentIndex + 1 >= questions.length
                      ? "Finish Interview"
                      : "Next Question"}
                    <BsArrowRight size={16} />
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Step2Interview;
