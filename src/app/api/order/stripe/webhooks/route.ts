import Order from "@/app/model/order.model";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY!,)

export async function POST(req: NextRequest) {
    const sign = req.headers.get("stripe-signature")
    const rawBody = await req.text()
    let event
    try {
        event = stripe.webhooks.constructEvent(
            rawBody,sign!,process.env.STRIPE_WEBHOOKS_KEY!
        )
    } catch (error) {
        console.log("Signatue verification failed.\n"+error)
    }

    if(event?.type === "checkout.session.completed"){
        await connectDb()
        const session = event.data.object
        await Order.findByIdAndUpdate(session?.metadata?.orderId, {
            isPaid: true
        })

    }
    return NextResponse.json({received: true},{status: 200})
}