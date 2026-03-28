import User from "@/app/model/user.model";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const {shopName, shopAddress, gstNumber} = await req.json()

        if(!shopName || !shopAddress || !gstNumber){
            return NextResponse.json(
                {message: "All fields are required!!"},
                {status: 400}
            )
        }

        const session = await auth()
        
        if(!session?.user?.email){
            return NextResponse.json(
                {message: "Unauthorized access!!"},
                {status: 400}
            )
        }
        
        const updatedVendor = await User.findOneAndUpdate({email: session.user.email}, {
            shopName,
            shopAddress,
            gstNumber,
            verificationStatus: 'pending',
            requestAt: new Date(),
            rejectReason: null,
            isApproved: false
        },{new: true})

        if(!updatedVendor){
            return NextResponse.json(
                {message: "Vendor not found!!"},
                {status: 400}
            )
        }

        return NextResponse.json(
            {message: "Verify again successfully", updatedVendor},
            {status: 200}
        )
    } catch (error) {
        return NextResponse.json(
            {message: `Verify again Error ${error}`},
            {status: 500}
        )
    }
}