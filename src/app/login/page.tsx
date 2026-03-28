"use client";
import { AnimatePresence } from "motion/react";
import React, { useState } from "react";
import { motion } from "motion/react";
import { redirect, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { IoEyeOutline, IoEyeSharp } from "react-icons/io5";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";

function page() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useRouter();

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        throw new Error("Invalid email or password");
      }
      console.log(res + "\Login successfully.....");
      setEmail("");
      setPassword("");
      alert("Login successfully");
      navigate.push("/");
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-6 bg-linear-to-br from-gray-900 via-black to-gray-900 text-white">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: -250 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md flex flex-col
             justify-center items-center  gap-8 shadow-2xl p-8 border bg-white/10 backdrop-blur-md rounded-2xl border-white/20"
        >
          <h1 className="text-3xl text-blue-400 font-bold">
            Welcome to Amcart
          </h1>

          <form
            action=""
            onSubmit={handleForm}
            className="w-full flex flex-col justify-center items-center gap-4"
          >
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
                suppressHydrationWarning
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
              suppressHydrationWarning
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.001, delay: 0.001 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-blue-600 border border-blue-500/5 flex justify-center items-center gap-4 cursor-pointer px-4 py-2 rounded-2xl hover:bg-blue-500 "
              type="submit"
            >
              Login <TbPlayerTrackNextFilled className="text-2xl" />
            </motion.button>
          </form>

          <div className="w-full flex justify-center items-center gap-2">
            <div className="w-[47%] h-0.5 bg-white"></div>
            <div>Or</div>
            <div className="w-[47%] h-0.5 bg-white"></div>
          </div>

          {/* sigin by google */}
          <motion.button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.001, delay: 0.001 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-black/50 border border-blue-500/5 flex justify-center items-center gap-4 cursor-pointer p-4 rounded-2xl hover:bg-black/30 "
          >
            <FcGoogle className="text-2xl" /> Login with Google
          </motion.button>

          <p>
            Create new account{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate.push("/register")}
            >
              Register
            </span>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default page;
