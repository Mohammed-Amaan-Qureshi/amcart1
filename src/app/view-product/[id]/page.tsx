"use client";
import { IProduct } from "@/app/model/product.model";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaRegStar, FaStar, FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import ProductCard from "@/Component/Vendor/ProductCard";
import axios from "axios";
import { ClipLoader } from "react-spinners";

function ViewProduct() {
  const params = useParams();
  const productId = params.id as string;

  const navigate = useRouter()

  const { allProductsData } = useSelector((state: RootState) => state.vendor);
  const product: IProduct | undefined = allProductsData?.find(
    (p: IProduct) => String(p._id) === String(productId),
  );

  const images: string[] = [
    product?.image1,
    product?.image2,
    product?.image3,
    product?.image4,
  ].filter((img): img is string => Boolean(img));

  const relatedProducts = allProductsData.filter(
    (p) => p.category === product?.category && p._id !== product._id,
  );

  const [activeImage, setActiveImage] = useState<number>(0);

  const totalReviews = product?.reviews?.length ?? 0

  const avgRating = product && totalReviews > 0 ? (
    product.reviews!.reduce((sum: number, r: {rating: number})=> sum + r.rating,0) / totalReviews
  ).toFixed(1) : 0

  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmitReview = async () => {
    const formData = new FormData();
    formData.append("productId", String(productId));
    formData.append("rating", String(reviewRating));
    formData.append("comment", reviewComment);
    if (reviewImage) {
      formData.append("image", reviewImage);
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/vendor/add-review", formData, {
        withCredentials: true,
      });
      alert("✅Review added successfully.");
      setPreview(null);
      setReviewImage(null);
      setReviewComment("");
      setReviewRating(0);
      setLoading(false);
    } catch (error) {
      alert("❌Review added failed.");
      setLoading(false);
      console.log(error);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent)=>{
    e.stopPropagation()
    try {
      const res= await axios.post("/api/user/cart/add",{
        productId,
        quantity: 1
      })
      console.log(res.data)
      alert("✅Added to cart")
      navigate.push("/cart")
    } catch (error) {
      console.log(error)
      alert("add to cart error")
    }
  }

  return (
    <div className="min-h-screen w-screen p-4 md:p-0 bg-linear-to-br from-gray-700 via-black to-gray-900 text-white">
      <div className=" max-w-6xl mx-auto">
        {/* first div */}
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* left-top */}
          <div className=" flex flex-col md:flex-row gap-4">
            {/* main image */}
            <div className=" relative w-full lg:w-md h-105 bg-white rounded-lg overflow-hidden flex items-center justify-center border border-white/10">
              {images.length > 0 && images[activeImage] && (
                <Image
                  src={images[activeImage]}
                  alt={product?.title ?? "product image"}
                  fill
                  className="object-contain"
                  priority
                />
              )}
            </div>
            {/* image thumbnails */}
            <div className="flex flex-row lg:flex-col gap-3 justify-center ">
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-20 border rounded cursor-pointer overflow-hidden flex items-center justify-center hover::scale-[110%] transition-all ${activeImage === i ? "border-blue-600" : "border-white/20"}`}
                >
                  <Image src={img} alt="img" fill className="object-contain" />
                </div>
              ))}
            </div>
          </div>
          {/* right-top */}
          {product && (
            <div>
              <h1 className=" text-3xl text-white font-bold mb-3">
                {product?.title}
              </h1>
              <p className=" text-gray-400 mb-2">{product?.category}</p>
              <p className=" text-2xl text-green-500 font-bold">
                ₹{product?.price}
              </p>
              {/* reviews */}
              <div className=" flex items-center gap-2 mt-1 mb-4">
                <div className=" flex text-yellow-400 gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    i <=  Math.round(Number(avgRating)) ?
                    <FaStar key={i} />: <FaRegStar key={i} />
                  ))}
                </div>
                <span>({avgRating} / {totalReviews}) Reviews</span>
              </div>
              <p className=" mb-4 text-sm text-gray-300">
                {product?.description}
              </p>
              <p className=" mb-3 text-gray-50">
                Stock:{" "}
                <span
                  className={
                    product.stock > 0
                      ? product.stock > 10
                        ? "text-green-400"
                        : "text-red-400"
                      : "text-red-400"
                  }
                >
                  {product?.stock > 0
                    ? product.stock > 10
                      ? "In Stock"
                      : product.stock
                    : "Out Of Stock"}
                </span>
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className=" w-full bg-blue-600 hover:bg-blue-600 py-3 rounded font-semibold transition text-white "
              >
                Add to Cart
              </motion.button>
            </div>
          )}
        </div>

        {/* second div */}
        {product && (
          <div className=" mt-10 bg-white/5 border border-white/10 rounded-lg p-6">
            {product.isWearable && (
              <div className=" mb-5">
                <p className=" font-semibold mb-2 text-white">
                  Available Sizes
                </p>
                <div className=" flex flex-wrap gap-2">
                  {product.sizes?.map((s) => (
                    <span
                      key={s}
                      className=" px-3 py-1 bg-white border-white/20 rounded text-black cursor-pointer"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className=" space-y-2 mb-6 text-gray-300">
              {typeof product.replacementDays === "number" &&
                product.replacementDays > 0 && (
                  <p>✅{product.replacementDays} Days Replacement</p>
                )}

              {product.freeDelivery === true && <p>✅Free Delivery</p>}
              {product.payOnDelivery === true && <p>✅Cash on Delivery</p>}
              {product.warranty && product.warranty !== "No Warrenty" && (
                <p>✅{product.warranty}</p>
              )}
            </div>

            {Array.isArray(product.detailsPoints) &&
              product.detailsPoints.length > 0 && (
                <div className=" mb-6">
                  <h3 className=" font-semibold mb-2 text-white">Highlights</h3>
                  <ul className=" list-disc pl-5 space-y-1 text-gray-300">
                    {product.detailsPoints.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}

        {/* third div */}
        {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
          <div className=" mt-12">
            <h3 className=" text-2xl font-bold mb-5 text-white">
              Related Products
            </h3>
            <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {relatedProducts.slice(0, 8).map((p) => (
                <ProductCard key={p._id?.toString()} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* review div */}
        <div className=" mt-16 bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className=" text-2xl font-bold mb-6 text-white">
            Custom Reviews
          </h2>

          <div className=" mb-8">
            <p className=" text-white font-semibold mb-2">Add your Review</p>

            <div className=" flex gap-2 mb-3 text-yellow-400">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  onClick={() => setReviewRating(i)}
                  key={i}
                  className=" cursor-pointer"
                >
                  {i <= reviewRating ? <FaStar /> : <FaRegStar />}
                </span>
              ))}
            </div>

            <textarea
              className=" w-full p3 rounded bg-black border border-white/30 mb-3 outline-none focus:ring focus:ring-blue-500"
              rows={3}
              placeholder="Write Review.."
              onChange={(e) => setReviewComment(e.target.value)}
              value={reviewComment}
            />

            <div className=" flex flex-col">
              <label htmlFor="img" className=" text-white font-semibold mb-2">
                Select Image for review
              </label>
              <input
                type="file"
                className=" mb-3 p-2 w-50 rounded-lg text-black bg-white cursor-pointer hover:scale-102 duration-500 transition"
                accept="image/*"
                id="img"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setReviewImage(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
              {preview && (
                <Image
                  src={preview}
                  alt="Prewiew"
                  width={100}
                  height={100}
                  className=" rounded mb-3"
                />
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 60 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
              whileInView={{ opacity: 1, y: 0 }}
              disabled={loading}
              onClick={handleSubmitReview}
              className=" bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold"
            >
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                "Submit Review"
              )}
            </motion.button>
          </div>

            {product?.reviews && product.reviews.length > 0 ? (
              <div>
                <h2 className=" text-white font-semibold mb-2 text-2xl">
                  Reviews
                </h2>
              </div>
            ) : (
              <div>
                <h2 className=" text-white font-semibold mb-2 text-2xl">
                  No Reviews Yet
                </h2>
              </div>
            )}
          <div className="grid justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {product?.reviews && product.reviews.length > 0 && (<>
                {product.reviews.map((r, i) => (
                  <div
                    key={i}
                    className="w-75 bg-white border border-black/10 rounded-xl p-5"
                  >
                    <div className=" flex items-center gap-3 mb-2">
                      <div
                        className=" w-10 h-10 rounded-full
                       flex items-center justify-center bg-black"
                      >
                        {r.user.image ? (
                          <Image
                            src={r.user.image}
                            alt={r.user.name || "User"}
                            width={35}
                            height={35}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          <FaUserCircle className=" w8 h-8" />
                        )}
                      </div>
                      <div>
                        <p className=" text-black font-semibold text-sm">
                          {r.user.name}
                        </p>
                        <div className=" flex text-yellow-400 text-sm mt-1.5">
                          {[1, 2, 3, 4, 5].map((i) =>
                            i <= r.rating ? (
                              <FaStar key={i} />
                            ) : (
                              <FaRegStar key={i} />
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                    <p className=" text-gray-900 text-sm mb-3">{r.comment}</p>

                    {r.image && (
                      <div className=" w-45 h-45 border border-white/10 rounded-lg overflow-hidden bg-black">
                        <Image
                          src={r.image}
                          alt="Review Image"
                          width={180}
                          height={180}
                          className=" object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProduct;
