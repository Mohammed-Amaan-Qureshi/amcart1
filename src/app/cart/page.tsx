"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

function page() {
  const [cart, setCart] = useState<any[]>([]);

  const navigate= useRouter()

  const getCart = async () => {
    try {
      const res = await axios.get("/api/user/cart/get");
      setCart(res.data.cart || []);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to get cart.");
    }
  };

  const handleUpdateCart = async (productId: string, quantity: number) => {
    try {
      const res = await axios.post("/api/user/cart/update",{productId,quantity},{ withCredentials: true });

      console.log(res.data);

      getCart();
    } catch (error) {
      console.log(error);
      alert("Failed to update quantity.");
    }
  };

  const handleRemoveItem = async (productId: string)=>{
    setCart((prev)=> prev.filter((i)=> i.product._id !== productId))
    await axios.post("/api/user/cart/remove",{productId},{withCredentials: true})
  }

  useEffect(() => {
    getCart();
  }, []);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen w-screen flex justify-center items-center bg-linear-to-br from-gray-700 via-black to-gray-900 text-white">
        <h1 className=" text-2xl font-bold">Cart Empty</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen p-6 bg-linear-to-br from-gray-700 via-black to-gray-900 text-white">
      <div className=" max-w-5xl mx-auto space-y-4">
        {cart.map((item, i) => (
          <div key={i} className=" bg-white/10 p-4 rounded-lg flex flex-col justify-center items-center md:flex gap-4">
            <Image
              src={item.product.image1}
              alt={item.product.title}
              width={100}
              height={100}
              className="object-contain"
            />
            <div className=" flex-1">
              <h3 className=" font-bold">{item.product.title}</h3>
              <p className=" text-green-500">₹{item.product.price}</p>

              <div className=" flex gap-2 mt-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (item.quantity > 1) {
                      handleUpdateCart(item.product._id, item.quantity - 1);
                    }
                  }}
                  className=" border border-gray-600 rounded cursor-pointer px-2"
                >
                  -
                </motion.button>
                <span>{item.quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    handleUpdateCart(item.product._id, item.quantity + 1);
                  }}
                  className=" border border-gray-600 rounded cursor-pointer px-2"
                >
                  +
                </motion.button>
              </div>

              <div className=" w-full flex     items-center justify-start gap-5">
                <button 
                onClick={()=> navigate.push(`/checkout/${item.product._id}`)}
                className=" mt-3 bg-blue-600 px-4 py-2 rounded cursor-pointer">
                  Checkout this product
                </button>
                <button 
                onClick={()=> handleRemoveItem(item.product._id)}
                className=" block mt-2 bg-red-500 px-4 py-2 rounded cursor-pointer">
                  Remove
                </button>
              </div>
            </div>
            <div className=" font-bold">
              <b>Total: </b>₹ {item.quantity * item.product.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default page;
