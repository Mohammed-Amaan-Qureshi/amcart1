"use client";
import React from "react";
import { motion } from "motion/react";
import { FaCheckCircle, FaBox } from "react-icons/fa";
import { useRouter } from "next/navigation";

function OrderSuccess() {

  const navigate = useRouter()

  return (
    <div className="min-h-screen w-screen p-6 flex justify-center items-center bg-linear-to-br from-green-900 via-black to-green-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-10 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 2 }}
          transition={{ duration: 1 }}
          className=" flex justify-center"
        >
          <FaCheckCircle className="text-green-400" size={120} />
        </motion.div>
          <h1 className="text-3xl font-bold mt-6">Order Placed Successfully</h1>
          <div className=" flex flex-col items-center gap-2 mt-4 text-gray-300">
            <FaBox size={32} className=" text-blue-300" />
            <p>Your order has been received and is now being processed.</p>
          </div>

          <motion.button 
          whileHover={{scale: 1.05}}
          whileTap={{scale: .95}}
          onClick={()=> navigate.push("/orders")}
          className="mt-8 w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 font-semibold cursor-pointer">
            Go to Order Page
          </motion.button>
      </motion.div>
    </div>
  );
}

export default OrderSuccess;
