"use client";
import React, { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FaStore } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaBox } from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import Dashboard from "./Dashboard";
import VendorDetails from "./VendorDetails";
import UserOrders from "./UserOrders";
import VendorApproval from "./VendorApproval";
import ProductRequests from "./ProductRequests";

function AdminDashnoard() {
  const [activePage, setActivePage] = useState("dashboard");

  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const menu = [
    { id: "dashboard", label: "Dashboard", icon: <MdDashboard size={22} /> },
    { id: "vendors", label: "Vendor Details", icon: <FaStore size={22} /> },
    { id: "orders", label: "User Orders", icon: <FaShoppingBag size={22} /> },
    {
      id: "vendor-approval",
      label: "Vendor Approval",
      icon: <FaCheckCircle size={22} />,
    },
    {
      id: "product-approval",
      label: "Product Requests",
      icon: <FaBox size={22} />,
    },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "vendors":
        return <VendorDetails />;
      case "orders":
        return <UserOrders />;
      case "vendor-approval":
        return <VendorApproval />;
      case "product-approval":
        return <ProductRequests />;
    }
  };

  return (
    <div className="min-h-screen w-screen relative flex justify-center items-center bg-linear-to-br from-gray-700 via-black to-gray-900 text-white">

      {/* side bar */}
      <div className="">
        {/* mobile menu bar */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="md:hidden mt-17 w-full h-17.5 fixed top-0 left-0 p-6 flex justify-between items-center backdrop-blur-xl bg-black border-r"
        >
          <h1 className="text-xl">Admin Dashboard</h1>
          <AiOutlineMenu
            className="text-lg cursor-pointer"
            onClick={() => setOpenMenu(true)}
          />
        </motion.div>

        <AnimatePresence>
          {openMenu && (
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              className="md:hidden flex gap-8 w-[60%] lg:w-[20%] h-screen z-60 absolute top-0 left-0 p-6  flex-col backdrop-blur-xl bg-gray-900"
            >
              <div className=" text-xl font-bold flex justify-between items-center">
                <h1>Admin Panel</h1>
                <AiOutlineClose
                  className="text-lg cursor-pointer"
                  onClick={() => setOpenMenu(false)}
                />
              </div>

              <div className="flex flex-col justify-center  gap-4">
                {menu.map((menu) => (
                  <div
                    key={menu.id}
                    className={` w-full flex items-center gap-2 transition-all py-3 px-1 rounded-lg cursor-pointer ${activePage == menu.id ? "bg-blue-500 text-white" : "bg-black/60"}`}
                    onClick={() => {
                      setActivePage(menu.id);
                      setOpenMenu(false);
                    }}
                  >
                    <div className="">{menu.icon}</div>
                    <div>{menu.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* desktop menu bar */}

        <AnimatePresence>
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden md:flex mt-17 w-[20%] lg:w-[20%] h-screen fixed top-0 left-0 p-6  flex-col gap-4 backdrop-blur-xl bg-gray-900 border-r"
          >
            {menu.map((menu) => (
              <div
                key={menu.id}
                className={` w-full flex items-center gap-2 transition-all py-3 px-1 rounded-lg cursor-pointer ${activePage == menu.id ? "bg-blue-500 text-white" : "bg-gray-700 hover:bg-gray-600"}`}
                onClick={() => setActivePage(menu.id)}
              >
                <div className="hidden lg:flex">{menu.icon}</div>
                <div>{menu.label}</div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* main area */}
      <motion.div 
        initial={{opacity: 0, x: 40}}
        animate={{opacity: 1, x: 0}}
        exit={{opacity: 0, x: 40}}
        transition={{duration: 0.3}}
        className="w-full md:w-[80%] h-full mt-17.5">
            {renderPage()}
      </motion.div>
    </div>
  );
}

export default AdminDashnoard;
