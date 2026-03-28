"use client";
import { IUser } from "@/app/model/user.model";
import VendorDashnoard from "./VendorDashnoard";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

function VendorPage({ user }: { user: IUser }) {
  const navigate = useRouter();

  const [openVerifyForm, setOpenVerifyForm] = useState<boolean>(false);
  const [shopName, setShopName] = useState<string>(user?.shopName || "");
  const [shopAddress, setShopAddress] = useState<string>(
    user?.shopAddress || "",
  );
  const [gstNumber, setGstNumber] = useState<string>(user?.gstNumber || "");
  const [loading, setLoading] = useState<boolean>(false);

  const handleVerifyData = async (e: React.FormEvent) => {

    e.preventDefault()

    if (!shopName || !shopAddress || !gstNumber) {
      alert("All fields are required!!");
    }

    setLoading(true);
    try {
      const result = await axios.post("/api/vendor/verify-again", {
        shopName,
        shopAddress,
        gstNumber,
      });
      console.log(result.data);
      setLoading(false);
      alert("Verification request sent again ✅");
      navigate.push("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("Failed verification request ");
    }
  };

  if (!user) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-linear-to-br from-gray-700 via-black to-gray-900 text-white">
        Loading...
      </div>
    );
  }

  if (user.verificationStatus === "approved") {
    return (
      <div>
        <VendorDashnoard />
      </div>
    );
  }

  if (user.verificationStatus === "pending") {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-linear-to-br from-gray-700 via-black to-gray-900 text-white">
        <div className="w-150 h-auto bg-[#242424] border rounded-2xl p-10 text-center">
          <h1 className="text-2xl text-blue-400 md:text-4xl font-bold flex flex-col justify-center items-center mb-4">
            Verification Pending ⏳
          </h1>
          <p>You can access vendor dashboard only after admin verification.</p>
          <p className="my-5">
            Verification Status:{" "}
            <span className="text-blue-400">
              {user.verificationStatus.toUpperCase()}
            </span>
          </p>
          <p className="text-gray-400 text-sm">It usually takes 2-3 hours.</p>
        </div>
      </div>
    );
  }

  if (user.verificationStatus === "rejected") {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-linear-to-br from-gray-700 via-black to-gray-900 text-white">
        <div className="w-150 h-auto bg-[#242424] flex flex-col items-center justify-center border rounded-2xl p-10 text-center">
          <h1 className="text-2xl text-red-400 md:text-4xl font-bold flex flex-col justify-center items-center mb-4">
            Verification Rejected ❌
          </h1>
          <p>
            Verification Status:{" "}
            <span className="text-blue-400">
              {user.verificationStatus.toUpperCase()}
            </span>
          </p>
          <p className="text-red-400 p-4">
            {" "}
            <b>Reason:</b> {user?.rejectReason}
          </p>
          <p className="text-gray-400 text-sm">Enter valid details again.</p>
          {!openVerifyForm ? (
            <button
              onClick={() => setOpenVerifyForm(true)}
              className="w-fit flex rounded-2xl p-2 items-center justify-center m-4 bg-blue-400 hover:bg-blue-500 cursor-pointer"
            >
              Re-enter Details
            </button>
          ) : (
            <>
              <form
                onSubmit={handleVerifyData}
                className="w-full mt-6 space-y-4 text-left"
              >
                <input
                  type="text"
                  className="w-full bg-white/10 p-2 pl-4 rounded-lg outline-none focus:ring focus:ring-blue-500"
                  placeholder="Shop Name"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />

                <input
                  type="text"
                  className="w-full bg-white/10 p-2 pl-4 rounded-lg outline-none focus:ring focus:ring-blue-500"
                  placeholder="Shop Address"
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                />

                <input
                  type="text"
                  className="w-full bg-white/10 p-2 pl-4 rounded-lg outline-none focus:ring focus:ring-blue-500"
                  placeholder="GST Number"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                />

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex rounded-2xl p-2 items-center justify-center bg-green-500 hover:bg-green-400 cursor-pointer"
                  >
                    {loading ? (
                      <ClipLoader color="white" size={20} />
                    ) : (
                      <b>Submit & Verify again</b>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenVerifyForm(false);
                    }}
                    className="w-full flex rounded-2xl p-2 items-center justify-center bg-gray-500 hover:bg-gray-400 cursor-pointer"
                  >
                    <b>Cancel</b>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default VendorPage;
