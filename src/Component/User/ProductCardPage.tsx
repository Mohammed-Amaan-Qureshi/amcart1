"use client";
import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "../Vendor/ProductCard";

function ProductCardPage() {
  const { allProductsData } = useSelector((state: RootState) => state.vendor);

  const product = Array.isArray(allProductsData)
    ? allProductsData.filter(
        (p: any) => p.isActive === true && p.verificationStatus === "approved",
      )
    : [];

  console.log(product);

  if(!product || product.length === 0){
    return (
            <div className=" min-h-[30vh] flex items-center justify-center text-white bg-black">
                No Product Found
            </div>
        )
  }

  return (
    <div className="min-h-[30vh] w-screen bg-linear-to-br from-gray-700 via-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto mt-13 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Explore Verified & Trending Products
        </h1>
        <p className=" text-sm text-gray-200">
          Shop only from approved sellers with guaranteed quality.
        </p>
      </div>
      <div className="max-w-7xl mx-auto">
        {product.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            No Products available right now.
          </div>
        ) : (
          <div className=" p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {
                product.map((p: any)=>(
                    <ProductCard key={p?._id} product={p}   />
                ))
            }
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCardPage;
