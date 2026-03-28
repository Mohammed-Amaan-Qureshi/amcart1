"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import man from "@/assets/man.png";
import admin from "@/assets/Admin.png";
import vendor from "@/assets/vendor.png";
import Image from "next/image";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { IoEyeSharp } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signIn } from "next-auth/react";

function page() {
  const [step, setStep] = useState<1 | 2>(1);
  const [roles, setRoles] = useState([
    {
      label: "User",
      icon: man,
      value: "user",
    },
    {
      label: "Vendor",
      icon: vendor,
      value: "vendor",
    },
    {
      label: "Admin",
      icon: admin,
      value: "admin",
    },
  ]);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useRouter()

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
        const res = await axios.post("/api/auth/register",{name, email, password}, {withCredentials: true})
        console.log(res.data+"\nRegister successfully.....")
        setName("")
        setEmail("")
        setPassword("")
        navigate.push("/login")
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-6 bg-linear-to-br from-gray-900 via-black to-gray-900 text-white">
      <AnimatePresence mode="wait">
        {/* for step 1 UI */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: -250 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 250 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-lg flex flex-col justify-center items-center text-center rounded-2xl shadow-2xl p-10 border bg-white/10 backdrop-blur-md border-white/20"
          >
            <h1 className="text-3xl text-blue-400 font-bold">
              Welcome to Amcart
            </h1>
            <p className="mb-4 p-4">
              Register with one of the following account types:
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {roles.map((item) => {
                return (
                  <motion.div
                    key={item.value}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.001, delay: 0.001 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 bg-white/5 hover:bg-white/20 cursor-pointer rounded-xl border border-white/30 shadow-lg flex flex-col items-center transition"
                  >
                    <Image src={item.icon} width={40} height={40} alt="" />
                    <span>{item.label}</span>
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.001, delay: 0.001 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-blue-600 border border-blue-500/5 flex justify-center items-center gap-4 cursor-pointer px-4 py-2 rounded-2xl hover:bg-blue-500 "
              onClick={() => setStep(2)}
            >
              Next <TbPlayerTrackNextFilled className="text-2xl" />
            </motion.button>
          </motion.div>
        )}

        {/* for step 2 UI */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 250 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -250 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md flex flex-col
             justify-center items-center  gap-8 shadow-2xl p-8 border bg-white/10 backdrop-blur-md rounded-2xl border-white/20"
          >
            <h1 className="text-3xl text-blue-400 font-bold">
              Create Your Account
            </h1>

            <form
              action=""
              onSubmit={handleForm}
              className="w-full flex flex-col justify-center items-center gap-4"
            >
              {/* name */}
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-4 bg-black/50 rounded-2xl outline-none text-lg placeholder:text-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {/* email */}
              <input
              suppressHydrationWarning
                type="email"
                placeholder="Email"
                className="w-full p-4 bg-black/50 rounded-2xl outline-none text-lg placeholder:text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* password */}
              <div className="w-full relative">
                <input
                  type={!showPassword ? "password" : "text"}
                  placeholder="Password"
                  className="w-full p-4 bg-black/50 rounded-2xl outline-none text-lg placeholder:text-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div
                  className="text-2xl cursor-pointer absolute top-4 right-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {!showPassword ? <IoEyeOutline /> : <IoEyeSharp />}
                </div>
              </div>
              {/* submit button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.001, delay: 0.001 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-600 border border-blue-500/5 flex justify-center items-center gap-4 cursor-pointer px-4 py-2 rounded-2xl hover:bg-blue-500 "
                type="submit"
              >
                Register Now <TbPlayerTrackNextFilled className="text-2xl" />
              </motion.button>

            </form>

              <div className="w-full flex justify-center items-center gap-2">
                <div className="w-[47%] h-0.5 bg-white"></div>
                <div>Or</div>
                <div className="w-[47%] h-0.5 bg-white"></div>
              </div>

            {/* sigin by google */}
            <motion.button
            onClick={()=> signIn("google", {callbackUrl: '/'})}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.001, delay: 0.001 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-black/50 border border-blue-500/5 flex justify-center items-center gap-4 cursor-pointer p-4 rounded-2xl hover:bg-black/30 "
            >
              <FcGoogle className="text-2xl" /> Register with Google 
            </motion.button>

            <p>Already have an account{" "} <span className="text-blue-500 cursor-pointer" onClick={()=> navigate.push("/login")}>Login</span></p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default page;
