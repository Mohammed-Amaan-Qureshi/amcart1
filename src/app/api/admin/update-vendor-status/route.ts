import User from "@/app/model/user.model";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    const adminUser = await User.findById(session?.user?.id);

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { message: "Only admin can approve vendor Or admin not found" },
        { status: 403 },
      );
    }

    const { vendorId, status, rejectReason } = await req.json();
    if (!vendorId || !status) {
      return NextResponse.json(
        { message: "Vendor Id and Status is required" },
        { status: 400 },
      );
    }

    const vendor = await User.findById(vendorId);

    if (status === "approved") {
      vendor.verificationStatus = "approved";
      vendor.isApproved = true;
      vendor.approvedAt = new Date();
      vendor.rejectReason = undefined;
    }
    if (status === "rejected") {
      vendor.verificationStatus = "rejected";
      vendor.isApproved = false;
      vendor.rejectReason = rejectReason || "rejected by Admin.";
    }

    await vendor.save();

    return NextResponse.json(
      { message: "Vendor status updated", vendor },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Vendor status update error " + error },
      { status: 500 },
    );
  }
}
