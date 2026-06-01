import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import Auth from "../pages/Auth";

function AuthModel({ onClose }) {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData) {
      onClose();
    }
  }, [userData, onClose]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-6 right-5 text-gray-400 hover:text-white transition z-10"
        >
          <FaTimes size={18} />
        </button>
        <Auth isModel={true} />
      </div>
    </div>
  );
}

export default AuthModel;
