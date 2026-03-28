"use client";
import UseGetCurrentUser from "@/hooks/UseGetCurrentUser";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { AiOutlineUser } from "react-icons/ai";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { setUserData } from "@/redux/userSlice";

function page() {
  const navigate = useRouter();
  UseGetCurrentUser();
  const user = useSelector((state: RootState) => state.user.userData);

  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [showEditShop, setShowEditShop] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState(user?.image);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [name, setName] = useState<string>(user?.name || "");
  const [phone, setPhone] = useState<string>(user?.phone || "");
  const [shopName, setShopName] = useState<string>(user?.shopName || "");
  const [shopAddress, setShopAddress] = useState<string>(
    user?.shopAddress || "",
  );
  const [gstNumber, setGstNumber] = useState<string>(user?.gstNumber || "");
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const handlePreviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpdateProfile = async ()=>{
    const formData = new FormData()
    formData.append("name",name)
    formData.append("phone",phone)
    if(profileImage){
      formData.append("image",profileImage)
    }

    setLoading(true)
    try {
      const res = await axios.post("/api/user/update-profile", formData,{withCredentials: true})
      console.log(res.data)
      dispatch(setUserData(res.data))
      alert("Profile updated successfully✅")
      setProfileImage(null)
      setLoading(false)
    } catch (error) {
      alert("Profile updated successfully")
      alert("Profile updated error❌")
      setLoading(false)
      console.log(error)
    }
  }

  const handleVerifyAgain = async (e: React.FormEvent)=>{
    e.preventDefault()
    if(!shopName || !shopAddress || !gstNumber){
      alert("All fields required")
    }
    setLoading(true)
    try {
      const res = await axios.post('/api/vendor/editDetails',{
        shopName,
        shopAddress,
        gstNumber
      },{withCredentials: true})
      alert("Shop details updated susscessfully.")
      setLoading(false)
      navigate.push("/")
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setShopName(user.shopName || "");
      setShopAddress(user.shopAddress || "");
      setGstNumber(user.gstNumber || "");
      setPreviewImage(user.image || "");
    }
  }, [user]);
  return (
    <div className="min-h-screen w-screen bg-linear-to-br from-gray-700 via-black to-gray-900 text-white px-4 pb-10 pt-24">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className=" max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-6 sm:p-10 rounded-2xl border border-white/20 shadow-xl"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-white/30 hover:border-blue-400"
          >
            {previewImage ? (
              <Image
                src={previewImage}
                alt=""
                width={120}
                height={120}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <AiOutlineUser size={48} className="text-white" />
              </div>
            )}
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-bold mt-4">{user?.name}</h2>
          <p className="text-gray-300 text-sm sm:text-base">{user?.email}</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Role: <span className="text-blue-400 uppercase">{user?.role}</span>
          </p>
        </div>

        <div className=" mt-8 space-y-3 text-sm sm:text-base">
          <p>
            <b>Phone: </b>
            {user?.phone || "-"}
          </p>

          {user?.role === "vendor" && (
            <>
              <p>
                <b>Shop Name: </b>
                {user?.shopName || "-"}
              </p>
              <p>
                <b>Shop Address: </b>
                {user?.shopAddress || "-"}
              </p>
              <p>
                <b>GST Number: </b>
                {user?.gstNumber || "-"}
              </p>
            </>
          )}
        </div>

        <div className=" grid grid-cols-1 gap-4 mt-8 mb-8">
          {user?.role === "user" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate.push("/orders")}
              className=" bg-gray-600 hover:bg-gray-700 p-3 rounded-lg font-semibold"
            >
              My Orders
            </motion.button>
          )}
          <motion.button
            onClick={() => {
              setShowEditProfile(!showEditProfile);
              setShowEditShop(false);
            }}
            whileHover={{ scale: 1.02 }}
            className=" bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold"
          >
            Edit Profile
          </motion.button>

          {user?.role === "vendor" && (
            <motion.button
              onClick={() => {
                setShowEditProfile(false);
                setShowEditShop(!showEditShop);
              }}
              whileHover={{ scale: 1.02 }}
              className=" bg-gray-600 hover:bg-gray-700 p-3 rounded-lg font-semibold"
            >
              Edit Shop Details
            </motion.button>
          )}
        </div>
        <AnimatePresence>
          {showEditProfile && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0, y: 30 }}
              className="pt-10 bg-white/5 p-5 sm:p-6 rounded-xl border border-white/20"
            >
              <h3 className="text-xl font-bold mb-5">Edit Profile</h3>
              <div className="flex flex-col items-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-24 h-24 border-2 border-white/30 hover:border-blue-400 rounded-full overflow-hidden mb-3"
                >
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="select image"
                      width={120}
                      height={120}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <AiOutlineUser size={40} />
                    </div>
                  )}
                </motion.div>
                <label className=" cursor-pointer bg-blue-600 px-4 py-2 rounded-lg text-sm">
                  Select Image
                  <input
                    onChange={handlePreviewImage}
                    type="file"
                    accept="image/*"
                    hidden
                  />
                </label>
              </div>
              <div className="space-y-4 ">
                <input
                  type="text"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="text"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <motion.button
                  onClick={handleUpdateProfile}
                  whileHover={{ scale: 1.02 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold"
                  disabled={loading}
                >
                  { loading? <ClipLoader size={20} color="white" /> : "Update Profile"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showEditShop && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0, y: 30 }}
              className="pt-10 bg-white/5 p-5 sm:p-6 rounded-xl border border-white/20"
            >
              <h3 className="text-xl font-bold mb-5">Edit Shop Details</h3>
              <div className="space-y-4 ">
                <input
                  type="text"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg"
                  placeholder="Shop Name"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />
                <input
                  type="text"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg"
                  placeholder="Shop Address"
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                />
                <input
                  type="text"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg"
                  placeholder="GST Number"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                />

                <motion.button
                  disabled={loading}
                  onClick={handleVerifyAgain}
                  whileHover={{ scale: 1.02 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold"
                >
                  { loading? <ClipLoader size={20} color="white" />  : "Update Shop Details"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default page;
