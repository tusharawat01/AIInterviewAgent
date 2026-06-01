import React from "react";
import { BsRobot } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const links = [
    { label: "Home", path: "/" },
    { label: "Interview", path: "/interview" },
    { label: "History", path: "/history" },
    { label: "Pricing", path: "/pricing" },
  ];

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/8 px-4 sm:px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 mb-8">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="bg-emerald-500 text-black p-1.5 rounded-lg">
                <BsRobot size={15} />
              </div>
              <span className="font-bold text-white">AI Interview Agent</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              AI-powered mock interview platform. Practice smarter, get real
              feedback, and land your dream job.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">
              Navigation
            </p>
            <div className="grid grid-cols-2 gap-x-10 gap-y-2">
              {links.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="text-sm text-gray-500 hover:text-white transition text-left"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">
              Powered by
            </p>
            <div className="space-y-2">
              {[
                "OpenRouter (GPT-4o-mini)",
                "Firebase Auth",
                "MongoDB Atlas",
                "Razorpay",
              ].map((item) => (
                <p key={item} className="text-sm text-gray-600">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-gray-700">
            © {new Date().getFullYear()} AI Interview Agent. All rights
            reserved.
          </p>
          <p className="text-xs text-gray-700">
            Built with React · Node.js · Express · MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
