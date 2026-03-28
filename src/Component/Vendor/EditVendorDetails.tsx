'use client'
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineHome, AiOutlinePaperClip, AiOutlineShop } from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";

function EditVendorDetails() {

  const navigate = useRouter()
  const [shopName, setShopName] = useState<string>("")
  const [shopAddress, setShopAddress] = useState<string>("")
  const [gstNumber, setGstNumber] = useState<string>("")

  const handleForm = async (e: React.FormEvent)=>{
    e.preventDefault()
    if(!shopName || !shopAddress || !gstNumber){
      alert("All fields required")
    }
    try {
      const res = await axios.post('/api/vendor/editDetails',{
        shopName,
        shopAddress,
        gstNumber
      },{withCredentials: true})
      console.log(res.data)
      alert("Vendor updated susscessfully.")
      navigate.push("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen w-screen flex justify-center items-center bg-linear-to-br from-gray-700 via-black to-gray-900 text-white">
      <div className="w-100 h-auto p-4 bg-[#242424] rounded-2xl">
        <h1 className="text-lg md:text-xl font-bold flex flex-col justify-center items-center ">
          Complete Your Shop Details
        </h1>

        <p className="text-sm text-center">
          Enter your business information to activate your vendor account.
        </p>

        <form action="" onSubmit={handleForm} className="flex flex-col gap-4 mt-5">
          <div className=" relative">
            <AiOutlineShop className="text-lg md:text-2xl text-gray-400 absolute top-4 left-2" />
          <input
            type="text"
            placeholder={`Shop Name`}
            required
            className="w-full p-4 pl-10 border border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
            value={shopName}
            onChange={(e)=> setShopName(e.target.value)}
          />
          </div>

          <div className=" relative">
            <AiOutlineHome className="text-lg md:text-2xl text-gray-400 absolute top-4 left-2" />
          <input
            type="text"
            placeholder={`Business Address`}
            required
            className="w-full p-4 pl-10 border border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
            value={shopAddress}
            onChange={(e)=> setShopAddress(e.target.value)}
          />
          </div>
          <div className=" relative">
            <IoDocumentTextOutline className="text-lg md:text-2xl text-gray-400 absolute top-4 left-2" />

            <input
              type="text"
              placeholder={`GST NUMBER`}
              required
              className="w-full p-4 pl-10 border border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
              value={gstNumber}
            onChange={(e)=> setGstNumber(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 font-bold border border-gray-600 bg-blue-500 hover:bg-blue-400 rounded-xl"
          >
            Submit Details
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditVendorDetails;
