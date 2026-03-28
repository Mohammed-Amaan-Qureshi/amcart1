import { AppDispatch } from "@/redux/store";
import { setAllOrdersData } from "@/redux/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function UseGetAllOrders() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchAllOrdersData = async () => {
      try {
        const res = await axios.get("/api/order/all-orders", {
          withCredentials: true,
        });
        dispatch(setAllOrdersData(res.data));
      } catch (error) {
        dispatch(setAllOrdersData([]));
        console.log(error);
      }
    };

    fetchAllOrdersData();
  }, []);
}

export default UseGetAllOrders;
