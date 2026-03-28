"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { SyncLoader } from "react-spinners";
import { FaStripe } from "react-icons/fa";

function Checkout() {
  const params = useParams();
  const productId = params.id as string;
  const [item, setItem] = useState<any>(null);

  const navigate = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("cod");

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const productTotal = item?.product?.price * item?.quantity;
  const deliveryCharge = item?.product?.freeDelivery ? 0 : 50;
  const serviceCharge = 30;
  const finalTotal = productTotal + deliveryCharge + serviceCharge;

  const codDisabled = !item?.product?.payOnDelivery;

  const handlePlaceOrder = async () => {
    if (!name || !phone || !address || !city || !pincode) {
      alert("Fill all address fields");
      return;
    }

    setLoading(true);

    const payload = {
      productId,
      quantity: item.quantity,
      address: { name, phone, address, city, pincode },
      amount: finalTotal,
      deliveryCharge,
      serviceCharge,
    };

    try {
      if (paymentMethod === "cod") {
        const res = await axios.post("/api/order/cod", payload, {
          withCredentials: true,
        });

        navigate.push("/order-success");
        console.log(res.data);
        setLoading(false);
      }else{
        const res = await axios.post("/api/order/online-pay",payload)
        window.location.href = res.data.url
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      navigate.push("/order-failed");
    }
  };

  useEffect(() => {
    if (!productId) return;

    const loadItem = async () => {
      try {
        const res = await axios.get("/api/user/cart/get");
        const foundItem = res.data.cart.find(
          (i: any) => i.product._id === productId,
        );
        if (!foundItem) {
          navigate.replace("/cart");
        }

        setItem(foundItem);

        if (!foundItem.product.payOnDelivery) {
          setPaymentMethod("stripe");
        }

      } catch (error) {
        console.log(error);
        alert("Failed to get item.");
      }
    };
    loadItem();
  }, [productId]);

  if (!item) {
    return (
      <div className="min-h-screen w-screen text-4xl p-6 flex justify-center items-center bg-linear-to-br from-gray-700 via-black to-gray-900 text-white">
        <SyncLoader speedMultiplier={0.6} size={20} color="white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen p-6 flex justify-center items-center bg-linear-to-br from-gray-700 via-black to-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 md:p-10 grid md:grid-cols-2 gap-8"
      >
        {/* address */}
        <div className=" space-y-5">
          <h2 className=" text-2xl font-bold text-white">Delivery Address</h2>

          <input
            type="text"
            placeholder="Full Name"
            className=" w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className=" w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <textarea
            placeholder="Complete Address"
            className=" w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition resize-none"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className=" w-full flex items-center justify-center gap-2">
            <input
              type="text"
              placeholder="City"
              className=" w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="Pin Code"
              className=" w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>
        </div>

        {/* item data */}
        <div className=" space-y-5">
          <h2 className=" text-2xl font-bold text-white">Order Summery</h2>

          <div className=" flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-white/10">
            <Image
              src={item?.product?.image1}
              alt="img"
              width={120}
              height={120}
              className=" w-20 h-20 object-cover rounded-lg bg-white"
            />
            <div className=" flex-1">
              <p className=" font-semibold text-gray-100 ">
                {item.product.title}
              </p>
              <p className=" text-sm text-gray-400">Qty: {item.quantity}</p>
            </div>

            <p className=" font-bold text-green-400">₹{productTotal}</p>
          </div>

          <div className=" space-y-2 text-sm text-gray-300">
            <div className=" flex justify-between">
              <span>Delivery Charge</span>
              <span>₹ {deliveryCharge}</span>
            </div>
            <div className=" flex justify-between">
              <span>Service Charge</span>
              <span>₹ {serviceCharge}</span>
            </div>
            <div className=" flex justify-between text-lg font-bold border-t border-white/20 pt-3 text-white">
              <span>Total</span>
              <span className=" text-green-400">₹ {finalTotal}</span>
            </div>
          </div>

          <div className=" space-y-3">
            <p className=" font-semibold text-white">Payment Method</p>

            <div className=" flex gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPaymentMethod("cod")}
                disabled={codDisabled}
                className={`flex-1 py-3 rounded-xl font-semibold transition text-white ${
                  paymentMethod === "cod" ? "bg-blue-600" : "bg-white/10"
                } ${codDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                Cash on Delivery
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPaymentMethod("stripe")}
                className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
                  paymentMethod === "stripe" ? "bg-blue-600" : "bg-white/10"
                }`}
              >
                <FaStripe className=" text-xl border rounded bg-green-300 text-black p-0.5" />
                Stripe
              </motion.button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlaceOrder}
            disabled={loading}
            className=" w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-90 py-4 rounded-2xl font-semibold text-lg transition"
          >
            {loading ? (
              <SyncLoader size={10} speedMultiplier={0.6} color="white" />
            ) : paymentMethod === "cod" ? (
              "Place Order"
            ) : (
              "Proceed  to Secure Payment"
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default Checkout;
