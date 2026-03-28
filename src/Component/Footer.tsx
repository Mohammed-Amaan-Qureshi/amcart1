"use client";
import { IUser } from "@/app/model/user.model";
import { div } from "motion/react-client";
import { useRouter } from "next/navigation";
import React from "react";

function Footer({ user }: { user: IUser }) {
  const navigate = useRouter();

  const role = user?.role;
  const isUser = role === "user";
  const isAdminOrVendor = role === "admin" || role === "vendor";

  return (
    <div className="w-full min-h-20 h-auto md:pl-[20%] bg-gray-900">
      <div
        className={`w-full h-auto text-white p-4 gap-4 grid ${isUser ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-3"}`}
      >
        <div className="space-y-3 p-4 flex flex-col items-center justify-center">
          <h1 className="text-xl md:text-3xl font-bold">Amcart</h1>
          <p className="mb-6">
            Smart, secure & sclable multi-vendor e-commerce platform built for
            performance and growth.
          </p>

          {isAdminOrVendor && (
            <span
              className={`m-4 px-4 py-1 text-nowrap rounded-lg ${role === "admin" ? "bg-blue-500  hover:bg-blue-400" : "bg-green-500 hover:bg-green-400"}`}
            >
              {role === "admin" ? "Admin Panel" : "Vendor Panel"}
            </span>
          )}
        </div>

        {isUser && (
          <div className="p-4 flex flex-col items-center justify-center">
            <h2 className="text-lg md:text-2xl font-bold">Ouick Lines</h2>

            <ul className=" flex flex-col items-center justify-center">
              <li onClick={() => navigate.push("/")}>Home</li>
              <li onClick={() => navigate.push("/category")}>Categories</li>
              <li onClick={() => navigate.push("/shop")}>Shop</li>
              <li onClick={() => navigate.push("/orders")}>Orders</li>
            </ul>
          </div>
        )}

        {isUser && (
          <div className=" flex flex-col items-center justify-center">
            <h2 className="text-lg md:text-2xl font-bold">Help & Support</h2>

            <ul>
              <li>Support</li>
              <li>Track-Order</li>
            </ul>
          </div>
        )}

        {isAdminOrVendor && (
          <div>
            {/* admin  */}
            {role === "admin" && (
              <div className="border border-gray-600 p-4 rounded-2xl flex flex-col items-center justify-center">
                <h2 className="text-lg md:text-2xl font-bold">System Access</h2>

                <ul>
                  <li>✔️ Platform Management</li>
                  <li>✔️ Vendor Control</li>
                  <li>✔️ Order & Revenue</li>
                  <li>✔️ System Security</li>
                </ul>
              </div>
            )}
            {/* vendor */}
            {role === "vendor" && (
              <div className="border border-gray-600 p-4 rounded-2xl flex flex-col items-center justify-center">
                <h2 className="text-lg md:text-2xl font-bold">
                  Vendor Dashboard
                </h2>

                <ul>
                  <li>✔️ Product Upload & Edit</li>
                  <li>✔️ Order & Delivery Tracking</li>
                  <li>✔️ Sales & Profit Analytics</li>
                  <li>✔️ Wallet & Settlement</li>
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="p-4 flex flex-col items-center justify-center gap-4">
            <h2 className="text-lg md:text-2xl font-bold">Contact Info</h2>

            <p>admin@amcart.com</p>
            <p>+91 1234567890</p>
            <p>New Delhi, India</p>
        </div>
      </div>

      <div className="bg-gray-400 w-full h-0.5 my-5"></div>

      <div className="p-4 text-center">
        <p>© 2026 Amcart - Powered by Secure Commerce Engine</p>
      </div>
    </div>
  );
}

export default Footer;
