import { IProduct } from "@/app/model/product.model";
import { IUser } from "@/app/model/user.model";
import { createSlice } from "@reduxjs/toolkit";

interface IUserData{
    allVendorsData: IUser[],
    allProductsData: IProduct[]
}

const initialState: IUserData = {
    allVendorsData: [],
    allProductsData: []
}

const vendorSlice = createSlice({
    name : "vendor",
    initialState,
    reducers: {
        setAllVendorsData: (state, action)=>{
            state.allVendorsData = action.payload
        },
        setAllProductsData: (state, action)=>{
            state.allProductsData = action.payload
        }
    }
})

export const { setAllVendorsData } = vendorSlice.actions
export const { setAllProductsData } = vendorSlice.actions
export default vendorSlice.reducer
