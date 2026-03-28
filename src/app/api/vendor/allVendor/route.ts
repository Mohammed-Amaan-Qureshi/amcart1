import User from "@/app/model/user.model";
import connectDb from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        await connectDb()
        const vendors = await User.find({role: 'vendor'}).populate("vendorProducts").sort({createdAt: -1})

        if(!vendors){
            return NextResponse.json(
                {message: "Vendor are not found!!"},
                {status: 400}
            )
        }

        return NextResponse.json(
                {vendors},
                {status: 200}
            )
    } catch (error) {
        return NextResponse.json(
                {message: "Get all Vendors Error!!"},
                {status: 500}
            )
    }
}