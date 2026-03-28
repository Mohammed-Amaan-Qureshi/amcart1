"use client";
import { IUser } from "@/app/model/user.model";
import UseGetAllVendors from "@/hooks/UseGetAllVendors";
import { AppDispatch, RootState } from "@/redux/store";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

function VendorDetails() {
  const dispatch = useDispatch<AppDispatch>();
  UseGetAllVendors();

  const allVendorsData: IUser[] = useSelector(
    (state: RootState) => state.vendor.allVendorsData,
  );

  const approvedVendors = Array.isArray(allVendorsData)
    ? allVendorsData.filter((ven) => ven.verificationStatus === "approved")
    : [];

  const [selectedVendor, setSelectedVendor] = useState<IUser | null>(null);

  return (
    <div className="w-full h-full md:pl-[20%] flex flex-col justify-center">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center sm:text-left">
        Approved Vendor Details
      </h1>

      {/* desktop table */}
      <div className="hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10">
        <table className="w-full text-left">
          {/* THEAD */}
          <thead className="bg-white/10">
            <tr>
              <th className="p-4 text-nowrap">Vendor Name</th>
              <th className="p-4 text-nowrap">Shop Name</th>
              <th className="p-4 text-nowrap">Shop Address</th>
              <th className="p-4 text-nowrap">Phone</th>
              <th className="p-4 text-nowrap">Gst Number</th>
              <th className="p-4 text-nowrap text-center">Action</th>
            </tr>
          </thead>

          {/* TBODY (separate) */}
          <tbody>
            {approvedVendors.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  No Vendor Approval requests found
                </td>
              </tr>
            ) : (
              approvedVendors.map((vendor, index) => (
                <tr
                  key={index} // ✅ better than index
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4 text-xs">{vendor?.name}</td>
                  <td className="p-4 text-xs">{vendor?.shopName || "-"}</td>
                  <td className="p-4 text-xs">{vendor?.shopAddress || "-"}</td>
                  <td className="p-4 text-xs">{vendor?.phone || "-"}</td>
                  <td className="p-4 text-xs">{vendor?.gstNumber}</td>
                  <td className="p-4 text-xs text-center">
                    <button
                      onClick={() => setSelectedVendor(vendor)}
                      className="px-4 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-xs cursor-pointer text-nowrap"
                    >
                      Vendor Products
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
        {approvedVendors.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            Vendor Approval Requests
          </div>
        ) : (
          approvedVendors.map((vendor, index) => (
            <div
              key={index}
              className="bg-white/10 border-white/20 border rounded-xl p-4 space-y-2"
            >
              <div className=" flex justify-between items-center ">
                <h3 className=" font-semibold text-lg">{vendor?.name}</h3>
                {vendor?.gstNumber}
              </div>
              <p className="text-sm text-gray-300">
                <b>Shop: </b>
                {vendor?.shopName}
              </p>
              <p className="text-sm text-gray-300">
                <b>Shop Address: </b>
                {vendor?.shopAddress}
              </p>
              <p className="text-sm text-gray-300">
                <b>Phone: </b>
                {vendor?.phone}
              </p>
              <button
                onClick={() => setSelectedVendor(vendor)}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-sm py-2 rounded-lg cursor-pointer"
              >
                Vendor Products
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
            <IoClose
              onClick={() => setSelectedVendor(null)}
              size={35}
              className=" absolute right-0 top-5 md:right-15 md:top-10 font-bold cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className=" relative max-h-150 overflow-y-auto bg-gray-900 px-6 py-2 rounded-2xl w-full max-w-lg border border-white/10"
            >
              <h3 className="text-center text-2xl font-bold p-4">
                Products of {selectedVendor.shopName}
              </h3>

              {selectedVendor.vendorProducts?.length ? (
                <div className=" space-y-4 min-h-100 overflow-y-auto">
                  {selectedVendor.vendorProducts.map((p: any, i: number) => (
                    <div
                      key={i}
                      className=" bg-white/10 p-4 rounded-lg border border-white/20"
                    >
                      <div className=" flex gap-3 items-center">
                        <Image
                          src={p.image1}
                          alt="image"
                          width={70}
                          height={70}
                          className=" rounded object-cover"
                        />

                        <div>
                          <p className=" font-semibold">{p.title}</p>

                          <p className=" text-sm text-gray-300">₹{p.price}</p>
                        </div>
                      </div>

                      <div className=" mt-3 text-sm space-y-1">
                        <p>
                          <b>Caegory:</b>
                          {" " + p.category}
                        </p>
                        <p>
                          <b>Description:</b>
                          {" " + p.description}
                        </p>

                        <p>
                          <b>Verification:</b>{" "}
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              p.verificationStatus === "approved"
                                ? "bg-green-600/30 text-yellow-400"
                                : "bg-red-600/30 text-red-400"
                            }`}
                          >
                            {p.verificationStatus}
                          </span>
                        </p>

                        <p>
                          <b>Active:</b>
                          {" "}
                          <span className={`${p.isActive? "text-green-400":"text-red-400"}`}>
                            {p.isActive ? "Yes":"No"}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className=" text-center text-gray-400 mt-6">
                  No Product Found
                </p>
              )}

              <motion.button
                onClick={() => setSelectedVendor(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className=" sticky bottom-0 flex-1 w-full bg-black hover:bg-black/90 mt-2 py-2 px-1 rounded-lg text-sm cursor-grab"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default VendorDetails;
