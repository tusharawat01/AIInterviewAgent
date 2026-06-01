import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import AuthModel from "./AuthModel";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Interview", path: "/interview" },
  { label: "ATS Checker", path: "/ats" },
  { label: "History", path: "/history" },
  { label: "Pricing", path: "/pricing" },
];

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showAuth, setShowAuth] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      setShowCreditPopup(false);
      setShowUserPopup(false);
      setShowMobileMenu(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const closeAll = () => {
    setShowCreditPopup(false);
    setShowUserPopup(false);
    setShowMobileMenu(false);
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-[#0a0a0a] border-b border-white/8 px-4 sm:px-6 py-0 sticky top-0 z-40"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
          <button
            onClick={() => {
              closeAll();
              navigate("/");
            }}
            className="flex items-center gap-2.5 flex-shrink-0"
          >
            <div className="bg-emerald-500 text-black p-1.5 rounded-lg">
              <BsRobot size={16} />
            </div>
            <span className="font-bold text-white text-sm sm:text-base">
              AI Interview Agent
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "text-white bg-white/8"
                      : "text-gray-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  setShowCreditPopup(!showCreditPopup);
                  setShowUserPopup(false);
                }}
                className="flex items-center gap-1.5 bg-white/8 hover:bg-white/12 border border-white/10 text-white px-3 py-1.5 rounded-lg text-sm transition"
              >
                <BsCoin size={14} className="text-emerald-400" />
                <span className="font-semibold">{userData?.credits || 0}</span>
              </button>

              {showCreditPopup && (
                <div className="absolute right-0 mt-2 w-60 bg-[#1a1a1a] border border-white/10 rounded-xl p-4 z-50 shadow-2xl">
                  <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">
                    Credits
                  </p>
                  <p className="text-2xl font-bold text-emerald-400 mb-3">
                    {userData?.credits || 0}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Each interview costs 50 credits.
                  </p>
                  <button
                    onClick={() => {
                      closeAll();
                      navigate("/pricing");
                    }}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-2 rounded-lg text-sm font-bold transition"
                  >
                    Buy Credits
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  setShowUserPopup(!showUserPopup);
                  setShowCreditPopup(false);
                }}
                className="w-8 h-8 bg-emerald-500 text-black rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
              >
                {userData ? (
                  userData?.name.slice(0, 1).toUpperCase()
                ) : (
                  <FaUserAstronaut size={14} />
                )}
              </button>

              {showUserPopup && (
                <div className="absolute right-0 mt-2 w-52 bg-[#1a1a1a] border border-white/10 rounded-xl p-3 z-50 shadow-2xl">
                  <div className="px-2 py-1.5 mb-2 border-b border-white/8">
                    <p className="text-sm font-semibold text-white truncate">
                      {userData?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userData?.credits || 0} credits remaining
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      closeAll();
                      navigate("/history");
                    }}
                    className="w-full text-left text-sm px-2 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                  >
                    Interview History
                  </button>
                  <button
                    onClick={() => {
                      closeAll();
                      navigate("/pricing");
                    }}
                    className="w-full text-left text-sm px-2 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                  >
                    Pricing
                  </button>
                  <div className="border-t border-white/8 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-sm px-2 py-2 flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg transition"
                    >
                      <HiOutlineLogout size={15} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center"
            >
              <span
                className={`block w-5 h-0.5 bg-gray-400 transition-all ${showMobileMenu ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block w-5 h-0.5 bg-gray-400 transition-all ${showMobileMenu ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-5 h-0.5 bg-gray-400 transition-all ${showMobileMenu ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-white/8 py-3 px-2 space-y-1"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => {
                    closeAll();
                    navigate(link.path);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "text-white bg-white/8"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </motion.nav>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}

      {(showCreditPopup || showUserPopup) && (
        <div className="fixed inset-0 z-30" onClick={closeAll} />
      )}
    </>
  );
}

export default Navbar;
