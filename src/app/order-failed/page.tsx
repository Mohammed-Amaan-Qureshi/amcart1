"use client";
import React from "react";
import { motion } from "motion/react";
import { FaTimesCircle, FaBox } from "react-icons/fa";
import { useRouter } from "next/navigation";

function OrderFailed() {

  const navigate = useRouter()

  return (
    <div className="min-h-screen w-screen p-6 flex justify-center items-center bg-linear-to-br from-red-900 via-black to-red-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-10 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ rotate: -260, opacity: 0 , y: 50}}
          animate={{ rotate: 0, opacity: 2 ,y: 0}}
          transition={{ duration: 1 }}
          className=" flex justify-center"
        >
          <FaTimesCircle className="text-red-400" size={120} />
        </motion.div>
          <h1 className="text-3xl font-bold mt-6">Order Failed</h1>
          <div className=" flex flex-col items-center gap-2 mt-4 text-gray-300">
            <p className=" text-gray-300 text-lg">Something went wrong.</p>
            <p>Please try again or choose another payment method.</p>
          </div>

          <motion.button 
          whileHover={{scale: 1.05}}
          whileTap={{scale: .95}}
          onClick={()=> navigate.push("/orders")}
          className="mt-8 w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 font-semibold cursor-pointer">
            Go to Order Page
          </motion.button>
      </motion.div>
    </div>
  )
}

export default OrderFailed
