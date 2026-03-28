"use client";
import { IProduct } from "@/app/model/product.model";
import axios from "axios";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaShoppingCart,
  FaRegStar,
} from "react-icons/fa";

function ProductCard({ product }: { product: IProduct }) {
  const navigate = useRouter();

  const images = [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
  ].filter(Boolean); // to remove falsy values like(undefined,null,etc)

  const [current, setCurrent] = useState<number>(0);

  const next = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };
  const previous = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const totalReviews = product?.reviews?.length ?? 0;

  const avgRating =
    product && totalReviews > 0
      ? (
          product.reviews!.reduce(
            (sum: number, r: { rating: number }) => sum + r.rating,
            0,
          ) / totalReviews
        ).toFixed(1)
      : 0;

  const handleAddToCart = async (e: React.MouseEvent)=>{
    e.stopPropagation()
    try {
      const res= await axios.post("/api/user/cart/add",{
        productId: product._id,
        quantity: 1
      })
      console.log(res.data)
      alert("✅Added to cart")
      navigate.push("/cart")
    } catch (error) {
      console.log(error)
      alert("add to cart error")
    }
  }

  return (
    <motion.div
      onClick={() => navigate.push(`/view-product/${product._id}`)}
      initial={{ opacity: 0, y: 60 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      // transition={{ type: "spring", stiffness: 70, damping: 18 }}
      className="bg-white rounded-lg shadow-xl overflow-hidden border hover:shadow-xl transition cursor-pointer"
    >
      {/* images */}
      <div className="relative w-full h-55 bg-gray-100 overflow-hidden flex items-center justify-center">
        <div className=" relative w-[90%] h-[90%]">
          <Image
            src={images[current]}
            alt="image"
            className="object-contain"
            fill
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            previous();
          }}
          className=" absolute left-1 top-1/2 -translate-y-1/2 bg-black/80 p-2 cursor-pointer rounded-full text-white z-10"
        >
          <FaChevronLeft size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className=" absolute right-1 top-1/2 -translate-y-1/2 bg-black/80 p-2 cursor-pointer rounded-full text-white z-10"
        >
          <FaChevronRight size={14} />
        </button>
        <div className=" absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${current === i ? "bg-black" : "bg-black/40"}`}
            ></span>
          ))}
        </div>
      </div>

      {/* product data */}
      <div className="p-4 space-y-2">
        <h3 className=" font-semibold text-sm text-black line-clamp-1">
          {product.title}
        </h3>
        <p className=" text-xs text-gray-500">{product.category}</p>
        <p className="font-bold text-lg text-green-600">₹{product.price}</p>
        <div className=" flex items-center gap-1 text-yellow-500 text-sm">
          {[1, 2, 3, 4, 5].map((_, i) =>
            i <= Math.round(Number(avgRating)) ? (
              <FaStar key={i} />
            ) : (
              <FaRegStar key={i} />
            ),
          )}
          <span className="text-gray-500 text-sm ml-1">
            {avgRating} ({totalReviews})
          </span>
        </div>
        <p className=" text-xs text-gray-500">
          Soled by: <span>{product.vendor.shopName}</span>
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="w-full bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-black/90 transition"
        >
          <FaShoppingCart size={14} /> Add to cart
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ProductCard;
