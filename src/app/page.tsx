import connectDb from "@/lib/db";
import React from "react";
import User from "./model/user.model";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import EditRoleAndPhone from "@/Component/EditRoleAndPhone";
import Navbar from "@/Component/Navbar";
import { json } from "zod";
import UserDashboard from "@/Component/User/UserDashboard";
import AdminDashnoard from "@/Component/Admin/AdminDashnoard";
import Footer from "@/Component/Footer";
import EditVendorDetails from "@/Component/Vendor/EditVendorDetails";
import VendorPage from "@/Component/Vendor/VendorPage";

export default async function Home() {
  await connectDb();
  const session = await auth();
  const user = await User.findById(session?.user?.id);

  if (!user) {
    redirect("/login");
  }

  const isComplete =
    !user.role || !user.phone || (!user.phone && user.role === "user");

  if (isComplete) {
    return <EditRoleAndPhone />;
  }

  if(user?.role === 'vendor'){
    const inCompleteVendorDetails = !user.shopName || !user.shopAddress || !user.gstNumber

    if(inCompleteVendorDetails){
      return <EditVendorDetails />
    }
  }

  const plainUser = JSON.parse(JSON.stringify(user))
  return (
    <div className="min-h-screen w-screen bg-linear-to-br from-gray-700 via-black to-gray-900 text-white">
      <Navbar user={plainUser}  />

      {user?.role === 'user' ? <UserDashboard /> : user?.role === 'admin' ? <AdminDashnoard/> : <VendorPage user={plainUser}/>}

      <Footer user={plainUser} />
    </div>
  );
}
