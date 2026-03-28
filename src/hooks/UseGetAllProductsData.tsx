import { AppDispatch } from "@/redux/store";
import { setAllProductsData } from "@/redux/vendorsSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function UseGetAllProductsData() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const fetchAllProductsData = async () => {
      try {
        const res = await axios.get("/api/vendor/allProduct", {
          withCredentials: true,
        });
        dispatch(setAllProductsData(res.data));
      } catch (error) {
        dispatch(setAllProductsData([]));
        console.log(error);
      }
    };

    fetchAllProductsData();
  }, []);
}

export default UseGetAllProductsData;
