"use client";
import ProductCard from "@/Component/Vendor/ProductCard";
import { RootState } from "@/redux/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function categoryPage() {
  const { allVendorsData } = useSelector((state: RootState) => state.vendor);

  const categories = [
    { label: "all", icon: "🗂️" },
    { label: "Fashion & Lifestyle", icon: "👗" },
    { label: "Electronics & Gadgets", icon: "📱" },
    { label: "Home & Living", icon: "🏡" },
    { label: "Beauty & Personal Care", icon: "💄" },
    { label: "Toys, Kids & Baby", icon: "🧸" },
    { label: "Food & Grocery", icon: "🛒" },
    { label: "Sports & Fitness", icon: "🏀" },
    { label: "Automotive Accessories", icon: "🚗" },
    { label: "Gifts & Handcrafts", icon: "🎁" },
    { label: "Books & Stationery", icon: "📚" },
  ];

  const [selecterCategory, setSelecterCategory] = useState("all");
  const [selecterShop, setSelecterShop] = useState("all");
  const [search, setSearch] = useState("");
  const [shopSearch, setShopSearch] = useState("");

  const [displayProducts, setDisplayProducts] = useState<any[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);

  const filterShops = !shopSearch
    ? []
    : allVendorsData.filter((v: any) =>
        v.shopName.toLowerCase().includes(shopSearch),
      );

      const fetchProduct = async ()=>{
        try {
          const params = new URLSearchParams()
          if(search){
            params.append("query", search)
          }
          if(selecterCategory !== "all"){
            params.append("category",selecterCategory)
          }
          if(selecterShop !== "all"){
            params.append("shop", selecterShop)
          }
          const res = await axios.get(`/api/search?${params.toString()}`)
          // console.log(res.data.products)
          setDisplayProducts(res.data.products)
        } catch (error) {
          console.log(error)
        }
      }

      useEffect(()=>{
        if(!isReady) return
        fetchProduct()
      },[search,selecterCategory, selecterShop, isReady])

      useEffect(()=>{
        const params = new URLSearchParams(window.location.search)
        console.log(window.location.search)
        const cat = params.get("cateogry")
        if(cat){
          setSelecterCategory(cat)
        }setIsReady(true)
      },[])


  return (
    <div className="min-h-screen w-screen p-6 items-center bg-linear-to-br from-gray-700 via-black to-gray-900 text-white">
      {/* heading */}
      <div className=" max-w-7xl mx-auto mb-6">
        <h1 className=" text-2xl sm:text-3xl font-bold">
          Browse Products by Categories
        </h1>

        <p className=" text-gray-300 text-xs">
          Filter by category, shop or search your favorite product
        </p>
      </div>

      {/*  */}
      <div className=" max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* left sidebar */}
        <div className="md:col-span-1 bg-white/10 border border-white/20 rounded-xl p-4 space-y-6">
          <input
            type="text"
            placeholder="Search Products..."
            className="w-full px-3 py-2 rounded bg-black border border-white/20"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />

          <div className=" space-y-2 max-h-64 overflow-y-auto">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => {
                  setSelecterCategory(cat.label);
                  setSelecterShop("all")
                  setShopSearch("")
                }}

                className={`w-full flex gap-2 px-3 py-2 rounded ${selecterCategory === cat.label ? "bg-blue-600" : "bg-white/10 hover:bg-white/20"}`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search Shop..."
            className="w-full px-3 py-2 rounded bg-black border border-white/20"
            onChange={(e) => setShopSearch(e.target.value)}
            value={shopSearch}
          />

          {shopSearch && (
            <div className=" bg-black border border-white/20 rounded max-h-48 overflow-y-auto">
              {filterShops.map((v: any) => (
                <button
                  key={v._id}
                  className=" block w-full px-3 py-2 text-left hover:bg-white/10"
                  onClick={() => {
                    setShopSearch(v.shopName);
                    setSelecterShop(v._id);
                  }}
                >
                  {v.shopName}
                </button>
              ))}
            </div>
          )}
        </div>

        {/*  */}
        <div className="md:col-span-3">
          {displayProducts.length === 0? (
            <div className=" text-center mt-20 text-gray-400">
              No Products Found
            </div>
          ) : (
            <div className=" grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {displayProducts.map((p: any)=>(
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default categoryPage;
