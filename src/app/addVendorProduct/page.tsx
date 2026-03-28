"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { IoCloudUploadOutline } from "react-icons/io5";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

function AddVendorProduct() {
  const categories = [
    "all",
    "Fashion & Lifestyle",
    "Electronics & Gadgets",
    "Home & Living",
    "Beauty & Personal Care",
    "Toys, Kids & Baby",
    "Food & Grocery",
    "Sports & Fitness",
    "Automotive Accessories",
    "Gifts & Handcrafts",
    "Books & Stationery"
  ];

  const sizesOption = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [customCategory, setCustomCategory] = useState<string>("");
  const [isWearable, setIsWearable] = useState<boolean>(false);
  const [size, setSize] = useState<string[]>([]);
  const [replacementDays, setReplacementDays] = useState<string>("");
  const [warranty, setWarranty] = useState<string>("");
  const [freeDelivery, setFreeDelivery] = useState<boolean>(false);
  const [payOnDelivery, setPayOnDelivery] = useState<boolean>(false);
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [image3, setImage3] = useState<File | null>(null);
  const [image4, setImage4] = useState<File | null>(null);

  const [preview1, setPreview1] = useState<string | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);
  const [preview3, setPreview3] = useState<string | null>(null);
  const [preview4, setPreview4] = useState<string | null>(null);

  const [detailsPoints, setDetailsPoints] = useState<string[]>([]);
  const [currentPoints, setCurrentPoints] = useState<string>("");
  const [pointIndex, setPointIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useRouter();

  const toggleSize = (size: string) => {
    setSize((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const handleAddPoint = () => {
    if (!currentPoints.trim()) return;

    setDetailsPoints((prev) => {
      const updated = [...prev];
      updated[pointIndex] = currentPoints;
      return updated;
    });

    setCurrentPoints("");
    setPointIndex((prev) => prev + 1);
  };

  const handleRemove = (index: number) => {
    setDetailsPoints((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // e.preventDefault();
    if (
      !title ||
      !description ||
      !stock ||
      !price ||
      !category ||
      !image1 ||
      !image2 ||
      !image3 ||
      !image4
    ) {
      alert("All fields and 4 images are required.");
      return;
    }

    if (isWearable && size.length === 0) {
      alert("Please select at least one size.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("price", price);
    formData.append(
      "category",
      category === "Others" ? customCategory : category,
    );
    formData.append("isWearable", String(isWearable));
    size.forEach((s) => formData.append("sizes", s));
    formData.append("replacementDays", replacementDays);
    formData.append("freeDelivery", String(freeDelivery));
    formData.append("warranty", warranty);
    formData.append("payOnDelivery", String(payOnDelivery));
    detailsPoints.forEach((point) => {
      formData.append("detailsPoints", point);
    });
    if (image1 && image2 && image3 && image4) {
      formData.append("image1", image1);
      formData.append("image2", image2);
      formData.append("image3", image3);
      formData.append("image4", image4);
    }
    try {
      const res = await axios.post("/api/vendor/addProduct", formData, {
        withCredentials: true,
      });
      console.log(res.data);
      alert("✅ Product added successfully. Waiting for admin approval.");
      setLoading(false);
      navigate.push("/");
    } catch (error) {
      setLoading(false);
      alert("❌ Product added failed.");
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen w-screen p-8 flex justify-center items-center bg-linear-to-br from-gray-700 via-black to-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.8 }}
      >
        <div
          // action=""
          // onSubmit={handleSubmit}
          className="w-full rounded-lg p-8 flex flex-col gap-3 bg-white/10 border border-white/20"
        >
          <h1 className="text-xl md:text-2xl font-bold">Add New Product</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              className="w-full bg-white/20 pl-4 p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Product Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="number"
              className="w-full bg-white/20 pl-4 p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="number"
              className="w-full bg-white/20 pl-4 p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Stock Quantity"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            <select
              className="w-full bg-white/20 pl-4 p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" className="bg-gray-900">
                Select Category
              </option>
              {categories.map((item, index) => (
                <option key={index} value={item} className="bg-gray-900">
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* other category */}
          {category === "Others" && (
            <input
              type="text"
              className="w-full bg-white/20 pl-4 p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Custom Category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
          )}

          <textarea
            rows={4}
            className="w-full bg-white/10 pl-4 p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-4">
            <input
              type="checkbox"
              className="w-5 h-5 cursor-pointer"
              checked={isWearable}
              onChange={() => setIsWearable(!isWearable)}
            />
            <span>This is a wearable / cloathing product</span>
          </div>
          {/* sizes */}
          {isWearable && (
            <div>
              <p className="font-semibold my-4">Select Sizes</p>
              <div className="flex flex-wrap gap-3">
                {sizesOption.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`py-2 px-4 cursor-pointer rounded-full border-2 border-white/20 ${size.includes(s) ? "bg-blue-600" : "bg-white/10"}`}
                    onClick={() => toggleSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              className="w-full bg-white/20 pl-4 p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Replacement Days (e.g. 7)"
              value={replacementDays}
              onChange={(e) => setReplacementDays(e.target.value)}
            />
            <input
              type="text"
              className="w-full bg-white/20 pl-4 p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Warranty (e.g. 1 Year)"
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-4">
              <input
                type="checkbox"
                className="w-5 h-5 cursor-pointer"
                checked={freeDelivery}
                onChange={() => setFreeDelivery(!freeDelivery)}
              />
              Free Delivery
            </label>
            <label className="flex items-center gap-4">
              <input
                type="checkbox"
                className="w-5 h-5 cursor-pointer"
                checked={payOnDelivery}
                onChange={() => setPayOnDelivery(!payOnDelivery)}
              />
              Cash on Delivery
            </label>
          </div>
          <h3 className="font-bold">Uplaod 4 Images</h3>
          <div className="w-full grid grid-cols-2 md:grid-cols-4 justify-evenly items-center gap-3">
            <label className="w-30 h-30 overflow-hidden flex flex-col justify-center items-center border border-white/20 hover:border-blue-500 bg-gray-900 p-4 rounded-md cursor-pointer">
              {preview1 ? (
                <Image
                  src={preview1}
                  width={120}
                  height={120}
                  alt=""
                  className=" object-cover rounded"
                />
              ) : (
                <>
                  <IoCloudUploadOutline className="text-2xl" />
                  <p>Image 1</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    return;
                  }
                  setImage1(file);
                  setPreview1(URL.createObjectURL(file));
                }}
              />
            </label>
            <label className="w-30 h-30 overflow-hidden  flex flex-col justify-center items-center border border-white/20 hover:border-blue-500 bg-gray-900 p-4 rounded-md cursor-pointer">
              {preview2 ? (
                <Image
                  src={preview2}
                  width={120}
                  height={120}
                  alt=""
                  className=" object-cover rounded"
                />
              ) : (
                <>
                  <IoCloudUploadOutline className="text-2xl" />
                  <p>Image 2</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    return;
                  }
                  setImage2(file);
                  setPreview2(URL.createObjectURL(file));
                }}
              />
            </label>
            <label className="w-30 h-30 overflow-hidden  flex flex-col justify-center items-center border border-white/20 hover:border-blue-500 bg-gray-900 p-4 rounded-md cursor-pointer">
              {preview3 ? (
                <Image
                  src={preview3}
                  width={120}
                  height={120}
                  alt=""
                  className=" object-cover rounded"
                />
              ) : (
                <>
                  <IoCloudUploadOutline className="text-2xl" />
                  <p>Image 3</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    return;
                  }
                  setImage3(file);
                  setPreview3(URL.createObjectURL(file));
                }}
              />
            </label>
            <label className="w-30 h-30 overflow-hidden  flex flex-col justify-center items-center border border-white/20 hover:border-blue-500 bg-gray-900 p-4 rounded-md cursor-pointer">
              {preview4 ? (
                <Image
                  src={preview4}
                  width={120}
                  height={120}
                  alt=""
                  className=" object-cover rounded"
                />
              ) : (
                <>
                  <IoCloudUploadOutline className="text-2xl" />
                  <p>Image 4</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    return;
                  }
                  setImage4(file);
                  setPreview4(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
          <h3 className="font-bold">Product Details Points</h3>
          <div className="flex justify-center items-center gap-2">
            <input
              type="text"
              className="w-full bg-white/20 pl-4 p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={`Point ${pointIndex + 1}`}
              onChange={(e) => setCurrentPoints(e.target.value)}
              value={currentPoints}
            />
            <button
              type="button"
              className="font-semibold p-2 bg-blue-600 hover:bg-blue-500 rounded-md cursor-pointer"
              onClick={handleAddPoint}
            >
              Add
            </button>
          </div>

          {detailsPoints.length > 0 && (
            <ul className="mt-3 space-y-2">
              {detailsPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-white/10 p-2 rounded"
                >
                  <span className="w-2/3 text-sm">
                    {index + 1}
                    {". " + point}
                  </span>
                  <button
                    type="button"
                    className="text-red-400 text-sm cursor-pointer"
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <motion.button
            // type="submit"
            onClick={handleSubmit}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full bg-blue-600 pl-4 p-2 rounded-md hover:bg-blue-500 cursor-pointer"
          >
            { loading? <ClipLoader size={20} color='white' /> : "Add Product"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default AddVendorProduct;
