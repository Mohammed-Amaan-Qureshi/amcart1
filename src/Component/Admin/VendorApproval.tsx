"use client";
import { IUser } from "@/app/model/user.model";
import UseGetAllVendors from "@/hooks/UseGetAllVendors";
import { AppDispatch, RootState } from "@/redux/store";
import { setAllVendorsData } from "@/redux/vendorsSlice";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { div } from "motion/react-client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

function VendorApproval() {
  const dispatch = useDispatch<AppDispatch>();
  UseGetAllVendors();

  const allVendorsData: IUser[] = useSelector(
    (state: RootState) => state.vendor.allVendorsData,
  );

  const pendingVendors = Array.isArray(allVendorsData)
    ? allVendorsData.filter((ven) => ven.verificationStatus === "pending")
    : [];

  const [selectedVendor, setSelectedVendor] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [rejectModel, setRejectModel] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>("");

  const openRejectReason = () => {
    setRejectModel(true);
    setRejectReason("");
  };

  const handleApproved = async () => {
    if (!selectedVendor) return;
    setLoading(true);
    try {
      const result = await axios.post(
        "/api/admin/update-vendor-status",
        {
          vendorId: selectedVendor._id,
          status: "approved",
        },
        { withCredentials: true },
      );
      const updated = allVendorsData.filter(
        (v) => v._id !== selectedVendor._id,
      );
      dispatch(setAllVendorsData(updated));
      setSelectedVendor(null);
      setLoading(false);
      alert("Vendor approved");
    } catch (error) {
      setLoading(false);
      alert("Approved Failed");
      console.log(error);
    }
  };
  const handleRejeced = async () => {
    if (!selectedVendor) return;
    setLoading(true);
    try {
      await axios.post(
        "/api/admin/update-vendor-status",
        {
          vendorId: selectedVendor._id,
          status: "rejected",
          rejectReason,
        },
        { withCredentials: true },
      );
      const updated = allVendorsData.filter(
        (v) => v._id !== selectedVendor._id,
      );
      dispatch(setAllVendorsData(updated));
      setSelectedVendor(null);
      setLoading(false);
      alert("Vendor rejected");
    } catch (error) {
      setLoading(false);
      alert("Rejection Failed");
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full md:pl-[20%] flex flex-col justify-center">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center sm:text-left">
        Vendor Approval Requests
      </h1>

      {/* desktop table */}
      <div className="hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10">
        <table className="w-full text-left">
          {/* THEAD */}
          <thead className="bg-white/10">
            <tr>
              <th className="p-4">Vendor Name</th>
              <th className="p-4">Shop Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          {/* TBODY (separate) */}
          <tbody>
            {pendingVendors.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  No Vendor Approval requests found
                </td>
              </tr>
            ) : (
              pendingVendors.map((vendor, index) => (
                <tr
                  key={index} // ✅ better than index
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">{vendor?.name}</td>
                  <td className="p-4">{vendor?.shopName || "-"}</td>
                  <td className="p-4">{vendor?.phone || "-"}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-yellow-500/30 text-yellow-300">
                      {vendor?.verificationStatus}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedVendor(vendor)}
                      className="px-4 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-sm cursor-pointer"
                    >
                      Check Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* mobbile card */}
      <div className="flex flex-col gap-4 p-4 md:hidden">
        {pendingVendors.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            Vendor Approval Requests
          </div>
        ) : (
          pendingVendors.map((vendor, index) => (
            <div
              key={index}
              className="bg-white/10 border-white/20 border rounded-xl p-4 space-y-2"
            >
              <div className=" flex justify-between items-center ">
                <h3 className=" font-semibold text-lg">{vendor?.name}</h3>
                <span className=" px-3 py-1 rounded-full text-xs bg-yellow-500/30 text-yellow-300">
                  {vendor?.verificationStatus}
                </span>
              </div>
              <p className="text-sm text-gray-300">
                <b>Shop: </b>
                {vendor?.shopName}
              </p>
              <p className="text-sm text-gray-300">
                <b>Phone: </b>
                {vendor?.phone}
              </p>
              <button
                onClick={() => setSelectedVendor(vendor)}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-sm py-2 rounded-lg cursor-pointer"
              >
                Check Details
              </button>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {selectedVendor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className=" bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-white/10"
            >
              <h3 className="text-center text-2xl font-bold p-4">
                Selected Vendor Details
              </h3>

              <div className="space-y-2 text-sm">
                <p>
                  <b>Name:</b>
                  {" " + selectedVendor.name}
                </p>
                <p>
                  <b>Email:</b>
                  {" " + selectedVendor.email}
                </p>
                <p>
                  <b>Phone:</b>
                  {" " + selectedVendor.phone}
                </p>
                <p>
                  <b>Shop Name:</b>
                  {" " + selectedVendor.shopName}
                </p>
                <p>
                  <b>Shop Address:</b>
                  {" " + selectedVendor.shopAddress}
                </p>
                <p>
                  <b>Gst Number:</b>
                  {" " + selectedVendor.gstNumber}
                </p>
              </div>

              <div className=" flex flex-col sm:flex-row mt-6 gap-3 text-white">
                <button
                  onClick={handleApproved}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg text-sm cursor-grab"
                >
                  {loading ? <ClipLoader /> : "Approve"}
                </button>
                <button
                  onClick={openRejectReason}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm cursor-grab"
                >
                  Reject
                </button>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg text-sm cursor-grab"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rejectModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className=" bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-white/10"
            >
              <h3 className="text-center text-2xl font-bold p-4">
                Enter Rejected Reason
              </h3>

              <textarea
                className=" w-full bg-white/10 border border-white/20  rounded-lg p-3 text-sm"
                rows={3}
                placeholder="Enter Rejection Reason..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <div className="flex flex-col sm:flex-row mt-6 gap-3 text-white">
                <button
                  disabled={loading}
                  onClick={() => {
                    handleRejeced();
                    setRejectModel(false);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm cursor-grab"
                >
                  {loading ? <ClipLoader size={20} /> : "Confirm Reject"}
                </button>
                <button
                  onClick={() => setRejectModel(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg text-sm cursor-grab"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default VendorApproval;
