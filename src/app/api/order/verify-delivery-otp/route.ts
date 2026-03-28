import Order from "@/app/model/order.model";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { otp, orderId } = await req.json();
    if (!otp || !orderId) {
      return NextResponse.json(
        { message: "OrderId and OTP required" },
        { status: 400 },
      );
    }

    const order = await Order.findById(orderId);
    let verified

    console.log("Incoming OTP:", otp);
    console.log("DB OTP:", order?.deliveryOtp);
    console.log("Expires:", order?.otpExpiresAt);
    console.log("Current:", new Date());
    if (!order) {
      return NextResponse.json({ message: `Order not found` }, { status: 404 });
    }

    if (
      String(order.deliveryOtp) !== String(otp) ||
      !order.otpExpiresAt ||
      new Date() > order.otpExpiresAt
    ) {
      verified = false
      return NextResponse.json(
        { verified , message: `Invalid or expired OTP` },
        { status: 400 },
      );
    }

    verified = true

    return NextResponse.json({ verified , message: "OTP verified." }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to update verify OTP.\n${error}` },
      { status: 500 },
    );
  }
}
