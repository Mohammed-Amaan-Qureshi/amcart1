"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AiOutlineShop, AiOutlineTool, AiOutlineUser } from "react-icons/ai";
import axios from "axios";
import { p } from "motion/react-client";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { useRouter } from "next/navigation";

function EditRoleAndPhone() {
  const navigate = useRouter();

  const [role, setRole] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const roles = [
    { label: "Admin", value: "admin", icon: <AiOutlineTool size={40} /> },
    { label: "Vendor", value: "vendor", icon: <AiOutlineShop size={40} /> },
    { label: "User", value: "user", icon: <AiOutlineUser size={40} /> },
  ];

  const [adminExists, setAdminExists] = useState<boolean>(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get("/api/admin/check-admin");
        setAdminExists(res.data.exists);
      } catch (error) {
        setAdminExists(false);
        console.log(error);
      }
    };

    checkAdmin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !phone) {
      alert("Select the role and enter the phone number.");
      return;
    }
    try {
      const res = await axios.post("/api/user/edit-role-phone", {
        role,
        phone,
      });
      console.log(res.data);
      setPhone("");
      setRole("");
      navigate.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-6 bg-linear-to-br from-gray-900 via-black to-gray-900 text-white">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -250 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 250 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg flex flex-col justify-center items-center text-center rounded-2xl shadow-2xl p-10 border bg-white/10 backdrop-blur-md border-white/20"
        >
          <h1 className="text-3xl text-blue-400 font-bold">Choose Your Role</h1>

          <p className="mb-4 p-4">
            Select your role and enter your mobile number to continue.
          </p>

          <form
            action=""
            onSubmit={handleSubmit}
            className="w-full flex flex-col justify-center items-center gap-8"
          >
            {/* name */}
            <input
              type="text"
              placeholder="Enter your mobile number"
              maxLength={10}
              required
              className="w-full p-4 bg-black/50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-lg placeholder:text-lg"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 ">
              {roles.map((rol) => {
                const isAdminBlocked = rol.value === "admin" && adminExists;
                return (
                  <motion.div
                    key={rol.value}
                    onClick={() => {
                      if (isAdminBlocked) {
                        alert(
                          "Admin is already exixts you cannot select  Admin role.",
                        );
                        return;
                      }
                      setRole(rol.value);
                    }}
                    whileHover={!isAdminBlocked ? { scale: 1.08 } : {}}
                    transition={{ duration: 0.01 }}
                    className={`cursor-pointer p-6 text-center rounded-2xl transition border text-lg font-medium 
                        ${role === rol.value ? "border-blue-500 bg-blue-500/40" : "border-white/20 bg-white/10 hover:bg-white/20"}
                         ${isAdminBlocked && "opacity-40 cursor-not-allowed"}`}
                  >
                    <div className="flex justify-center mb-3">{rol.icon}</div>
                    <p>{rol.label}</p>
                    {isAdminBlocked && (
                      <p className="text-sm mt-2 text-red-500">
                        Admin already exists
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
            {/* submit button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.001, delay: 0.001 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-blue-600 border border-blue-500/5 flex justify-center items-center gap-4 cursor-pointer px-4 py-2 transition rounded-2xl hover:bg-blue-500 "
              type="submit"
            >
              Register Now <TbPlayerTrackNextFilled className="text-2xl" />
            </motion.button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default EditRoleAndPhone;
