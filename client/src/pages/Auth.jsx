import React from "react";
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { BsMic, BsBarChart, BsFileEarmarkText } from "react-icons/bs";

function Auth({ isModel = false }) {
  const dispatch = useDispatch();

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      let User = response.user;
      let name = User.displayName;
      let email = User.email;
      const result = await axios.post(
        ServerUrl + "/api/auth/google",
        { name, email },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
    } catch (error) {
      console.log(error);
      dispatch(setUserData(null));
    }
  };

  if (isModel) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-emerald-500 text-black p-2 rounded-lg">
            <BsRobot size={18} />
          </div>
          <span className="font-semibold text-white">AI Interview Agent</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
        <p className="text-gray-500 text-sm mb-8">
          Sign in to continue your interview preparation journey.
        </p>

        <motion.button
          onClick={handleGoogleAuth}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 py-3.5 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg"
        >
          <FcGoogle size={20} />
          Continue with Google
        </motion.button>

        <p className="text-xs text-gray-600 text-center mt-6">
          By signing in, you agree to our terms of service.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-transparent to-cyan-500/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 text-black p-2.5 rounded-xl">
              <BsRobot size={20} />
            </div>
            <span className="font-bold text-xl text-white">
              AI Interview Agent
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Your personal AI
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                interview coach
              </span>
            </h1>
            <p className="text-gray-500 text-lg">
              Practice, improve, and land your dream job with AI-powered mock
              interviews.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: <BsMic size={16} />,
                title: "Voice-based interviews",
                desc: "AI speaks and listens in real time",
              },
              {
                icon: <BsBarChart size={16} />,
                title: "Detailed scoring",
                desc: "Confidence, communication & correctness",
              },
              {
                icon: <BsFileEarmarkText size={16} />,
                title: "Resume-tailored questions",
                desc: "Questions based on your actual experience",
              },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{f.title}</p>
                  <p className="text-gray-500 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-gray-600 text-xs">
            Powered by OpenRouter · Built with React & Node.js
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm"
        >
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="bg-emerald-500 text-black p-2 rounded-lg">
              <BsRobot size={18} />
            </div>
            <span className="font-bold text-lg text-white">
              AI Interview Agent
            </span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Sign in</h2>
            <p className="text-gray-500">
              Start your AI interview preparation journey.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 bg-white/3 border border-white/8 rounded-xl p-4">
              <IoSparkles
                size={16}
                className="text-emerald-400 flex-shrink-0"
              />
              <p className="text-sm text-gray-400">
                Get 100 free interview credits on signup
              </p>
            </div>
          </div>

          <motion.button
            onClick={handleGoogleAuth}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 py-4 bg-white text-black rounded-xl font-bold text-base hover:bg-gray-100 transition shadow-xl"
          >
            <FcGoogle size={22} />
            Continue with Google
          </motion.button>

          <p className="text-xs text-gray-600 text-center mt-6">
            By continuing, you agree to our terms of service and privacy policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Auth;
