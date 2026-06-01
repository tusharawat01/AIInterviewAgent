import React, { useState } from "react";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import { BsArrowRight, BsLightningFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch();

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for serious job preparation.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },
  ];

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id);
      const amount = plan.id === "basic" ? 100 : plan.id === "pro" ? 500 : 0;

      const result = await axios.post(
        ServerUrl + "/api/payment/order",
        {
          planId: plan.id,
          amount: amount,
          credits: plan.credits,
        },
        { withCredentials: true },
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "AI Interview Agent",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,
        handler: async function (response) {
          const verifypay = await axios.post(
            ServerUrl + "/api/payment/verify",
            response,
            { withCredentials: true },
          );
          dispatch(setUserData(verifypay.data.user));
          alert("Payment Successful 🎉 Credits Added!");
          navigate("/");
        },
        theme: { color: "#10b981" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoadingPlan(null);
    } catch (error) {
      console.log(error);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="h-screen bg-[#0a0a0a] overflow-y-auto px-4 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/")}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <FaArrowLeft className="text-gray-400" size={14} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Choose a Plan</h1>
            <p className="text-gray-500 text-sm mt-1">
              Get credits to unlock AI-powered interview sessions
            </p>
          </div>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 mb-5 flex items-start gap-3">
          <div className="w-8 h-8 bg-emerald-500/15 border border-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
            <BsLightningFill size={14} />
          </div>
          <div>
            <p className="text-white text-sm font-semibold mb-1">
              How credits work
            </p>
            <p className="text-gray-500 text-sm">
              Each interview session costs 50 credits. Credits never expire.
              Start with 100 free credits on signup.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const isPro = plan.id === "pro";

            return (
              <motion.div
                key={plan.id}
                whileHover={!plan.default && { scale: 1.02 }}
                onClick={() => !plan.default && setSelectedPlan(plan.id)}
                className={`relative rounded-2xl border transition-all duration-300 overflow-hidden
                                    ${isPro ? "border-emerald-500/40" : "border-white/10"}
                                    ${isSelected && !isPro ? "border-emerald-500/40" : ""}
                                    ${plan.default ? "cursor-default" : "cursor-pointer"}
                                    bg-[#111]
                                `}
              >
                {isPro && (
                  <div className="h-1 bg-gradient-to-r from-emerald-500 to-cyan-400" />
                )}

                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${isPro ? "text-emerald-400" : "text-gray-500"}`}
                    >
                      {plan.name}
                    </span>
                    {plan.badge && (
                      <span className="text-xs bg-emerald-500 text-black px-2.5 py-0.5 rounded-full font-bold">
                        {plan.badge}
                      </span>
                    )}
                    {plan.default && (
                      <span className="text-xs bg-white/8 text-gray-500 px-2.5 py-0.5 rounded-full border border-white/10">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="mb-2">
                    <span
                      className={`text-3xl font-black ${isPro ? "text-emerald-400" : "text-white"}`}
                    >
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-1">
                    <span
                      className={`font-semibold ${isPro ? "text-emerald-400" : "text-white"}`}
                    >
                      {plan.credits}
                    </span>{" "}
                    credits included
                  </p>
                  <p className="text-gray-600 text-xs mb-3">
                    {plan.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isPro
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-white/8 text-gray-500"
                          }`}
                        >
                          <FaCheck size={8} />
                        </div>
                        <span className="text-sm text-gray-400">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.default ? (
                    <div className="w-full py-3 rounded-xl bg-white/5 border border-white/8 text-gray-600 text-sm text-center font-medium">
                      Your current plan
                    </div>
                  ) : (
                    <button
                      disabled={loadingPlan === plan.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isSelected) {
                          setSelectedPlan(plan.id);
                        } else {
                          handlePayment(plan);
                        }
                      }}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition ${
                        isSelected
                          ? "bg-emerald-500 hover:bg-emerald-400 text-black"
                          : "bg-white/8 hover:bg-white/12 text-white border border-white/10"
                      }`}
                    >
                      {loadingPlan === plan.id ? (
                        "Processing..."
                      ) : isSelected ? (
                        <>
                          <span>Pay {plan.price}</span>{" "}
                          <BsArrowRight size={14} />
                        </>
                      ) : (
                        "Select Plan"
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-600 mt-4">
          Payments are processed securely via Razorpay · Credits are added
          instantly after payment
        </p>
      </div>
    </div>
  );
}

export default Pricing;
