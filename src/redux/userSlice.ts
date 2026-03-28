import { IUser } from "@/app/model/user.model";
import { createSlice } from "@reduxjs/toolkit";
import { IOrder } from "@/app/model/order.model"

interface IUserData {
    userData: IUser | null, 
    allOrdersData: IOrder[]
}

const initialState: IUserData = {
    userData: null,
    allOrdersData: []
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData:(state, action)=>{
            state.userData = action.payload
        },
        setAllOrdersData:(state, action)=>{
            state.allOrdersData = action.payload
        },
    }
})

export const { setUserData } = userSlice.actions
export const { setAllOrdersData } = userSlice.actions
export default userSlice.reducer