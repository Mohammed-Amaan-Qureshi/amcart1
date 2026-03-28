"use client";
import UseGetAllVendors from "@/hooks/UseGetAllVendors";
import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { IUser } from "../model/user.model";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function ShopPage() {

    const navigate = useRouter()

  UseGetAllVendors();
  const { allVendorsData } = useSelector((state: RootState) => state.vendor);

  const verifiedVendor = Array.isArray(allVendorsData) ? allVendorsData.filter((v: IUser)=> v.verificationStatus === "approved") : []

  if (!allVendorsData || allVendorsData.length === 0) {
    return (
      <div className=" min-h-[30vh] flex items-center justify-center text-white bg-black">
        No Shop Found
      </div>
    );
  }

  return (
    <div className="min-h-[30vh] w-screen p-6 bg-linear-to-br from-gray-700 via-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto mb-13 text-center">
        <h1 className=" text-2xl sm:text-3xl font-bold">
          Explore Trusted Shops & Verified Sellers
        </h1>
        <p className=" text-gray-300 text-sm">
          Discover verified vendors, authentiicate stores and their products.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {verifiedVendor.map((v: IUser, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className=" bg-white text-black rounded-2xl p-4 cursor-pointer border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300"
              onClick={()=> navigate.push(`/shop-details/${v._id}`)}
            >
                {/* image div */}
              <div className=" relative w-full aspect-4/3 mb-3 flex items-center justify-center overflow-hidden rounded-xl bg-gray-200">
                {v.image ? (
                  <Image
                    src={v.image}
                    alt="image"
                    fill
                    className=" object-cover"
                  />
                ) : (
                  <div>No Image Found</div>
                )}
              </div>

                <h2 className=" font-semibold text-center text-lg">{v.shopName}</h2>
                <p className=" text-xs text-gray-500 text-center mt-1 line-clamp-2">
                    {v.shopAddress}
                </p>

                <div className=" flex justify-center mt-2">
                <span className=" text-2.5 px-3 py-1 rounded-full font-medium bg-green-100 text-green-700">
                    {v.verificationStatus}
                </span>
                </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShopPage;
