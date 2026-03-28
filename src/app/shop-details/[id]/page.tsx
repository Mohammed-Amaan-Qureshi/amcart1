"use client";
import { RootState } from "@/redux/store";
import { useParams } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import Image from "next/image";
import { IProduct } from "@/app/model/product.model";
import ProductCard from "@/Component/Vendor/ProductCard";
import UseGetAllProductsData from "@/hooks/UseGetAllProductsData";
import UseGetAllVendors from "@/hooks/UseGetAllVendors";

function ShopDetails() {
  const params = useParams();
  const vendorId = params.id as string;

  UseGetAllProductsData()
  UseGetAllVendors()

  const { allVendorsData } = useSelector((state: RootState) => state.vendor);
  const { allProductsData } = useSelector((state: RootState) => state.vendor);

  const vendor = allVendorsData.find((v: any) => String(v._id) === vendorId);

  const vendorProducts = Array.isArray(allProductsData) ? allProductsData.filter((p: any)=> String(p.vendor._id) === vendorId) : []

  if (!vendor) {
    return (
      <div className="min-h-screen w-screen p-6 flex items-center justify-center bg-linear-to-br from-gray-700 via-black to-gray-900 text-white text-2xl">
        Vendor Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen p-6 bg-linear-to-br from-gray-700 via-black to-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className=" max-w-6xl mx-auto mb-12 bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 grid md:grid-cols-2 gap-6 shadow-xl"
      >
        <div className=" flex items-center justify-center relative w-full h-60 overflow-hidden rounded-xl bg-black">
          {vendor.image ? (
            <Image
              src={vendor.image}
              alt="image"
              fill
              className=" object-cover"
            />
          ) : (
            <div>No Image Found</div>
          )}
        </div>

        <div className=" flex flex-col justify-center">
          <h1 className=" text-3xl font-bold mb-3">{vendor?.shopName}</h1>
          <p className=" text-gray-300 mb-2">{vendor.shopAddress}</p>
          <p className=" text-sm text-gray-400 mb-1">{vendor.gstNumber}</p>
          <span className=" w-fit text-2.5 px-3 py-1 rounded-full font-medium bg-green-100 text-green-700">{vendor.verificationStatus}</span>
        </div>
      </motion.div>

      <div className=" max-w-6xl mx-auto">
        <h2 className=" text-2xl font-bold mb-8">
            Product By:{" "+vendor.shopName} 
        </h2>
        {vendor.vendorProducts?.length === 0 ? (
            <p className=" text-gray-300">
                No products added by this shop yet.
            </p>
        ):(
            <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {
                    vendorProducts?.map((p: any,i: number)=>(
                        <ProductCard key={i} product={p} />
                    ))
                }
            </div>
        )}
      </div>
    </div>
  );
}

export default ShopDetails;
