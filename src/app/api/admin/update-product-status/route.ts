import Product from "@/app/model/product.model";
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

    const { productId, status, rejectReason } = await req.json();
    if (!productId || !status) {
      return NextResponse.json(
        { message: "Product Id and Status is required." },
        { status: 400 },
      );
    }

    const product = await Product.findById(productId);

    if (status === "approved") {
      product.verificationStatus = "approved";
      product.approvedAt = new Date();
      product.rejectReason = undefined;
    }
    if (status === "rejected") {
      product.verificationStatus = "rejected";
      product.rejectReason = rejectReason || "rejected by Admin.";
    }

    await product.save();

    return NextResponse.json(
      { message: "Product status updated", product },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Product status update error " + error },
      { status: 500 },
    );
  }
}
