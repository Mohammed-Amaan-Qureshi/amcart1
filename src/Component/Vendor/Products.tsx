"use client";
import React from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Image from "next/image";
import UseGetAllProductsData from "@/hooks/UseGetAllProductsData";
import UseGetCurrentUser from "@/hooks/UseGetCurrentUser";
import axios from "axios";
import { setAllProductsData } from "@/redux/vendorsSlice";

function Products() {

  const dispatch = useDispatch<AppDispatch>()
  UseGetCurrentUser()
  UseGetAllProductsData()

  const navigate = useRouter();
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const { allProductsData } = useSelector((state: RootState) => state.vendor);
  const myProducts =
    currentUser?._id && allProductsData?.length
      ? allProductsData.filter((p) => p.vendor._id === currentUser?._id)
      : [];

      const toogleIsActive = async (productId: string, currentIsActive: boolean)=>{
        try {
          const res = await axios.post("/api/vendor/isActive-product",{productId, isActive: !currentIsActive},{withCredentials: true})
          const updatedProducts = allProductsData.map((p:any)=> p._id === productId ? res.data : p)

          dispatch(setAllProductsData(updatedProducts))
        } catch (error) {
          console.log(error)
          alert("❌Update isActive Failed.")
        }
      }

  return (
    <div className="w-full h-full mt-20 md:pl-[25%] m-2">
      {/* header */}
      <div className="w-full flex justify-between p-4 items-center">
        <h1 className="text-2xl md:text-3xl font-bold">My Products</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg"
          onClick={() => navigate.push("/addVendorProduct")}
        >
          + Add Product
        </motion.button>
      </div>

      {/* desktop table */}
      <div className="hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10">
        <table className="w-full text-left">
          {/* THEAD */}
          <thead className="bg-white/10">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Title</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Active</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          {/* TBODY (separate) */}
          <tbody>
            {myProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  No Vendor's product found
                </td>
              </tr>
            ) : (
              myProducts.map((pro, index) => (
                <tr
                  key={index} // ✅ better than index
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">
                    <Image
                      src={pro.image1}
                      alt="image1"
                      width={50}
                      height={50}
                      className="rounded object-cover"
                    />
                  </td>
                  <td className="p-4">{pro.title}</td>
                  <td className="p-4">₹{pro.price}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${ pro.verificationStatus === "pending" ? "text-yellow-300  bg-yellow-300/20" : pro.verificationStatus === 'approved' ? "text-green-300  bg-green-300/20" : "text-red-500 bg-red-300/20" }`}>
                      {pro?.verificationStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-sm ${pro.isActive ? "text-green-500" : "text-red-500"}`}
                    >
                      {pro.isActive ? "active" : "inactive"}
                    </span>
                  </td>
                  {/* button */}
                  <td className="p-4 flex flex-col justify-center items-center">
                    <div className="flex justify-center items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className=" px-3 py-1 text-sm rounded bg-purple-600 hover:bg-purple-700"
                      onClick={()=> navigate.push(`/update-product/${pro._id}`)}
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      disabled={pro.verificationStatus !== "approved"}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={()=> toogleIsActive(String(pro._id), Boolean(pro.isActive))}
                      className={`px-3 py-1 rounded text-sm ${pro.verificationStatus === "approved" ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700 cursor-not-allowed"}`}
                    >
                      {pro.isActive ? "Disable" : "Enable"}
                    </motion.button>
                    </div>

                    {pro.verificationStatus === "rejected" && (
                      <div className="mt-2 bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-2 rounded">
                        <p>
                          <b>Rejected:</b>{" "}
                          {pro.rejectReason || "No reason provided"}
                        </p>
                        <p className=" mt-1 text-yellow-300">After edit, product will be sent for re-verification.</p>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* mobbile card */}
      <div className="flex flex-col items-center justify-center gap-4 p-4 md:hidden">
        {myProducts.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No Vendor's product found.
          </div>
        ) : (
          myProducts.map((pro, index) => (
            <div
              key={index}
              className="w-full bg-white/10 border-white/20 border rounded-xl p-4 space-y-2"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={pro.image1}
                  width={60}
                  height={60}
                  alt="image1"
                  className="rounded"
                />
              </div>

              <div className="">
                <h2 className=" font-semibold">{pro.title}</h2>
                <p className=" text-sm text-gray-300">₹{pro.price}</p>
              </div>

              <div className=" mt-3 text-sm space-y-1">
                <p className="text-xs">
                  <b>Status:</b>
                  <span className={`px-3 py-1 text-xs ${ pro.verificationStatus === "pending" ? "text-yellow-300" : pro.verificationStatus === 'approved' ? "text-green-300" : "text-red-500" }`}>
                      {pro?.verificationStatus}
                    </span>
                </p>
                <p>
                  <b>Active:</b>
                  <span
                    className={`text-sm ${pro.isActive ? "text-green-500" : "text-red-500"}`}
                  >
                    {pro.isActive ? " Yes" : " No"}
                  </span>
                </p>
              </div>
              {pro.verificationStatus === "rejected" && (
                      <div className="mt-2 bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-2 rounded">
                        <p>
                          <b>Rejected:</b>{" "}
                          {pro.rejectReason || "No reason provided"}
                        </p>
                        <p className=" mt-1 text-yellow-300">After edit, product will be ssent for re-verification.</p>
                      </div>
                    )}

                    <div className=" flex gap-3 mt-4">
                      <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className=" px-3 py-1 rounded bg-purple-600 hover:bg-purple-700"
                      onClick={()=> navigate.push(`/update-product/${pro._id}`)}
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      disabled={pro.verificationStatus !== "approved"}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={()=> toogleIsActive(String(pro._id), Boolean(pro.isActive))}
                      className={`px-3 py-1 rounded text-sm ${pro.verificationStatus === "approved" ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700 cursor-not-allowed"}`}
                    >
                      {pro.isActive ? "Disable" : "Enable"}
                    </motion.button>
                    </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Products;
