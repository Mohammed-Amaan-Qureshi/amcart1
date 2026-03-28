"use client";
import { IProduct } from "@/app/model/product.model";
import { IUser } from "@/app/model/user.model";
import UseGetAllProductsData from "@/hooks/UseGetAllProductsData";
import { AppDispatch, RootState } from "@/redux/store";
import { setAllVendorsData } from "@/redux/vendorsSlice";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

function ProductApproval() {
  const dispatch = useDispatch<AppDispatch>();

  UseGetAllProductsData();

  const allProductsData: IProduct[] = useSelector(
    (state: RootState) => state.vendor.allProductsData,
  );

  const pendingProducts = Array.isArray(allProductsData)
    ? allProductsData.filter((p) => p.verificationStatus === "pending")
    : [];

  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [rejectModel, setRejectModel] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>("");

  const openRejectReason = () => {
    setRejectModel(true);
    setRejectReason("");
  };

  const handleApproved = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    try {
      const result = await axios.post(
        "/api/admin/update-product-status",
        {
          productId: selectedProduct._id,
          status: "approved",
        },
        { withCredentials: true },
      );
      const updated = allProductsData.filter(
        (v) => v._id !== selectedProduct._id,
      );
      dispatch(setAllVendorsData(updated));
      setSelectedProduct(null);
      setLoading(false);
      alert("Product approved");
    } catch (error) {
      setLoading(false);
      alert("Approval Failed");
      console.log(error);
    }
  };
  const handleRejeced = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    try {
      await axios.post(
        "/api/admin/update-product-status",
        {
          productId: selectedProduct._id,
          status: "rejected",
          rejectReason,
        },
        { withCredentials: true },
      );
      const updated = allProductsData.filter(
        (v) => v._id !== selectedProduct._id,
      );
      dispatch(setAllVendorsData(updated));
      setSelectedProduct(null);
      setLoading(false);
      alert("Product rejected");
    } catch (error) {
      setLoading(false);
      alert("Rejection Failed");
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full md:pl-[20%] flex flex-col items-center justify-center">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center sm:text-left">
        Product Approval Requests
      </h1>

      {/* desktop table */}
      <div className="hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10">
        <table className="w-full text-left">
          {/* THEAD */}
          <thead className="bg-white/10">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Title</th>
              <th className="p-4">Price</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          {/* TBODY (separate) */}
          <tbody>
            {pendingProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  No Product Approval requests found
                </td>
              </tr>
            ) : (
              pendingProducts.map((p, index) => (
                <tr
                  key={index}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">
                    <Image
                      src={p.image1}
                      alt="image1"
                      width={50}
                      height={50}
                      className="rounded object-cover"
                    />
                  </td>
                  <td className="p-4">{p.title}</td>
                  <td className="p-4">{p.price}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-yellow-500/30 text-yellow-300">
                      {p?.verificationStatus}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedProduct(p)}
                      className="px-4 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-sm cursor-pointer"
                    >
                      Check Details
                    </motion.button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* mobbile card */}
      <div className="flex flex-col gap-4 p-4 md:hidden">
        {pendingProducts.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No Product Approval Requests
          </div>
        ) : (
          pendingProducts.map((p, index) => (
            <div
              key={index}
              className="bg-white/10 border-white/20 border rounded-xl p-4 space-y-2"
            >
              <div className=" flex items-center">
                <Image
                  src={p.image1}
                  alt="image1"
                  width={60}
                  height={60}
                  className=" rounded"
                />
              </div>
              <div>
                <h2 className=" font-semibold">{p.title}</h2>
                <p className=" text-sm text-gray-300">₹{p.price}</p>
              </div>

              <div className=" mt-3 text-sm space-y- flex justify-between items-center">
                <p>{p.category}</p>
                <p className="text-xs">
                  <b>Status:</b>
                  <span className=" text-yellow-300">
                    {" " + p?.verificationStatus}
                  </span>
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedProduct(p)}
                className="px-4 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-sm cursor-pointer"
              >
                Check Details
              </motion.button>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {selectedProduct && (
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
                Selected Product Details
              </h3>

              <Image
                src={selectedProduct.image1}
                alt="image1"
                width={50}
                height={40}
                className="rounded mb-4"
              />

              <div className="space-y-2 text-sm">
                <p>
                  <b>Title: </b>
                  {selectedProduct.title}
                </p>
                <p>
                  <b>Price: </b>₹{selectedProduct.price}
                </p>
                <p>
                  <b>Category: </b>
                  {selectedProduct.category}
                </p>
                <p>
                  <b>Description: </b>
                  {selectedProduct.description}
                </p>
                <p>
                  <b>Status: </b>
                  <span className="text-yellow-300 text-sm">
                    {selectedProduct.verificationStatus}
                  </span>
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
                  onClick={() => setSelectedProduct(null)}
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

export default ProductApproval;
