import Order from "@/app/model/order.model";
import connectDb from "@/lib/db";
import { sendDeliveryOtpEmail } from "@/lib/mailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { orderId, status } = await req.json();

    const order = await Order.findById(orderId).populate("buyer");
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 400 });
    }

    if (status === "confirmed" || status === "shipped") {
      order.orderStatus = status;
      await order.save();
      return NextResponse.json(
        { message: "Order status updated" },
        { status: 200 },
      );
    }

    if(status === "arrived"){

      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      order.deliveryOtp = otp;
      order.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await order.save();
      
      const email = order.buyer?.email;
      if (!email) {
        return NextResponse.json(
          { message: "Buyer email not found" },
          { status: 400 },
        );
      }

      await sendDeliveryOtpEmail(email, otp);

      return NextResponse.json(
        { message: "OTP sent to buyer email" },
        { status: 200 },
      );
    }

    if (status === "delivered") {

    order.orderStatus = "delivered";
    order.isPaid = true;
    order.deliveryDate = new Date();
    order.deliveryOtp = undefined;
    order.otpExpiresAt = undefined;

    await order.save();

      return NextResponse.json(
        { message: "OTP sent to buyer email" },
        { status: 200 },
      );
    }

    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to update order status.\n${error}` },
      { status: 500 },
    );
  }
}
