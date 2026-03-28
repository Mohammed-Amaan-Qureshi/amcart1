"use client";
import { IUser } from "@/app/model/user.model";
import UseGetAllOrders from "@/hooks/UseGetAllOrders";
import UseGetAllVendors from "@/hooks/UseGetAllVendors";
import UseGetCurrentUser from "@/hooks/UseGetCurrentUser";
import { AppDispatch, RootState } from "@/redux/store";
import { setAllOrdersData } from "@/redux/userSlice";
import { setAllVendorsData } from "@/redux/vendorsSlice";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { div } from "motion/react-client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

function VendorOrders() {
  const dispatch = useDispatch<AppDispatch>();

  UseGetAllOrders();
  UseGetCurrentUser();

  const [otpModel, setOtpModel] = useState<any | null>(null);
  const [otp, setOtp] = useState<string>("");

  const userData = useSelector((state: RootState) => state.user.userData);

  const allOrdersData = useSelector(
    (state: RootState) => state.user.allOrdersData,
  );

  const orders = Array.isArray(allOrdersData)
    ? allOrdersData.filter(
        (o) => String(o.productVendor._id) === String(userData?._id),
      )
    : [];

  const statusOptions = [
    "pending",
    "confirmed",
    "shipped",
    "arrived",
    // "delivered",
    "returned",
  ];

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await axios.post("/api/order/update-status", { orderId, status });
      dispatch(
        setAllOrdersData(
          allOrdersData.map((o: any) =>
            o._id === orderId ? { ...o, orderStatus: status } : o,
          ),
        ),
      );
      if (status === "arrived") {
        return;
      }
      alert("Order status updated");
    } catch (error) {
      console.log(error);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }
    try {
      await axios.post("/api/order/verify-delivery-otp", {
        orderId: otpModel._id,
        otp,
      });

      updateStatus(String(otpModel._id), "delivered");
      console.log("line 67");
      dispatch(
        setAllOrdersData(
          allOrdersData.map((o: any) =>
            o._id === otpModel._id ? { ...o, orderStatus: "delivered" } : o,
          ),
        ),
      );
      alert("Order Delivered Successfully");
      setOtpModel(null);
      setOtp("");
    } catch (error) {
      console.log(error);
      alert("Order Delivery failed");
    }
  };

  return (
    <div className="w-full h-full p-6 md:pl-[20%] flex flex-col justify-center">
      <div className=" flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center sm:text-left">
          Vendor Orders
        </h1>
        <p className=" text-gray-300">{orders.length} Orders</p>
      </div>

      {/* desktop table */}
      <div className="hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10">
        <table className="w-full text-left">
          {/* THEAD */}
          <thead className="bg-white/10">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Buyer</th>
              <th className="p-4">Products</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Update</th>
            </tr>
          </thead>

          {/* TBODY (separate) */}
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  No Orders found
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr
                  key={index}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className=" p-4">#{String(order._id).slice(-8)}</td>
                  <td className=" p-4">
                    {order.address.name}
                    <div className=" text-xs text-gray-400">
                      {order.address.phone}
                    </div>
                  </td>
                  <td className=" p-4">
                    {order.products.map((p, i) => (
                      <div key={i} className=" text-gray-200">
                        {p.product.title} * {p.quantity}
                      </div>
                    ))}
                  </td>
                  <td className=" p-4">
                    {order.paymentMethod.toUpperCase()}
                    <div className=" text-xs text-gray-400">
                      {order.isPaid ? "Paid" : "Pending"}
                    </div>
                  </td>
                  <td className=" p-4 uppercase">{order.orderStatus}</td>
                  <td className="p-4 text-center">
                    {order.orderStatus === "cancelled" && (
                      <span className=" text-red-400 font-semibold capitalize">
                        Cancelled
                      </span>
                    )}
                    {order.orderStatus === "delivered" && (
                      <span className=" text-green-400 font-semibold capitalize">
                        Delivered
                      </span>
                    )}
                    {order.orderStatus === "returned" && (
                      <span className=" text-orange-400 font-semibold capitalize">
                        Returned
                      </span>
                    )}

                    {order.orderStatus !== "cancelled" &&
                      order.orderStatus !== "delivered" &&
                      order.orderStatus !== "returned" && (
                        <select
                          onChange={async (e) => {
                            if (e.target.value === "arrived") {
                              setOtpModel(order);
                              updateStatus(String(order._id), e.target.value);
                            } else {
                              updateStatus(String(order._id), e.target.value);
                            }
                          }}
                          value={order.orderStatus}
                          className="w-full bg-white/10 border border-white/20 rounded px-2 py-1"
                        >
                          {statusOptions.map((s, i) => (
                            <option
                              key={i}
                              value={s}
                              className="bg-black text-center"
                            >
                              {s}
                            </option>
                          ))}
                        </select>
                      )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* mobbile card */}
      <div className="flex flex-col gap-4 p-4 md:hidden">
        {orders.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            Vendor Approval Requests
          </div>
        ) : (
          orders.map((order, index) => (
            <div
              key={index}
              className="bg-white/10 border-white/20 border rounded-xl p-4 space-y-2"
            >
              <div className=" flex justify-between mb-2">
                <span className=" text-sm">#{String(order._id).slice(-8)}</span>
                <span className=" text-green-400 font-bold">
                  ₹ {order.totalAmount}
                </span>
              </div>

              <p className=" text-sm">
                <b>Buyer: </b>
                {order.address.name}
              </p>
              <p className=" text-xs text-gray-400">{order.address.phone}</p>

              <div className=" mt-2 text-sm">
                {order.products.map((p, i) => (
                  <div key={i} className=" text-gray-200">
                    {p.product.title} * {p.quantity}
                  </div>
                ))}
              </div>

              <div className=" mt-3 text-sm capitalize">
                <b>Status: </b>
                {order.orderStatus}
              </div>

              {order.orderStatus !== "cancelled" &&
                order.orderStatus !== "delivered" &&
                order.orderStatus !== "returned" && (
                  <select
                    onChange={async (e) => {
                      if (e.target.value === "delivered") {
                        // updateStatus(String(order._id), "delivered");
                        setOtpModel(order);
                      } else {
                        updateStatus(String(order._id), e.target.value);
                      }
                    }}
                    value={order.orderStatus}
                    className="w-full bg-white/10 border border-white/20 rounded px-2 py-1"
                  >
                    {statusOptions.map((s, i) => (
                      <option key={i} value={s} className="bg-black">
                        {s}
                      </option>
                    ))}
                  </select>
                )}
            </div>
          ))
        )}
      </div>

      {otpModel && (
        <div className=" fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className=" bg-cyan-950 p-6 rounded-xl w-full max-w-md">
            <h2 className=" text-lg font-semibold mb-3">Enter Delivery Otp</h2>
            <input
              type="text"
              className=" w-full bg-white/10 border border-white/20 px-4 py-2 rounded mb-4"
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
            />
            <button
              onClick={verifyOtp}
              className=" w-full bg-green-600 py-2 rounded flex items-center justify-center gap-2 cursor-pointer"
            >
              Verify & Deliver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorOrders;
