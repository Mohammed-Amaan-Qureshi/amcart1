import User from "@/app/model/user.model";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const {shopName, shopAddress, gstNumber} = await req.json()
        const session = await auth()
        
        if(!session?.user?.email){
            return NextResponse.json(
                {message: "Unauthorized access!!"},
                {status: 400}
            )
        }
        
        const user = await User.findOneAndUpdate({email: session.user.email}, {
            shopName,
            shopAddress,
            gstNumber,
            verificationStatus: 'pending',
            requestAt: new Date()
        },{new: true})

        if(!user){
            return NextResponse.json(
                {message: "usser not found!!"},
                {status: 400}
            )
        }

        return NextResponse.json(
            {message: "Vendor details submit successfully", user},
            {status: 200}
        )
    } catch (error) {
        return NextResponse.json(
            {message: `Edit vendor details Error ${error}`},
            {status: 500}
        )
    }
}