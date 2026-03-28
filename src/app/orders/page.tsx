"use client";
import UseGetAllOrders from "@/hooks/UseGetAllOrders";
import UseGetCurrentUser from "@/hooks/UseGetCurrentUser";
import { AppDispatch, RootState } from "@/redux/store";
import { FiTruck } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { SyncLoader } from "react-spinners";
import { motion } from "motion/react";
import { useState } from "react";
import axios from "axios";
import { setAllOrdersData } from "@/redux/userSlice";

function Orders() {
  UseGetCurrentUser();
  UseGetAllOrders();

  const dispatch = useDispatch<AppDispatch>();

  const { userData } = useSelector((state: RootState) => state.user);
  const { allOrdersData } = useSelector((state: RootState) => state.user);
  const orders = Array.isArray(allOrdersData)
    ? allOrdersData.filter((o) => String(o.buyer._id) === String(userData?._id))
    : [];

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [trackOrderModel, setTrackOrderModel] = useState<any | null>(null);

  const formatDate = (date: string) => {
    if (!date) return;

    const d = new Date(date);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isCancledDisabled = (order: any) =>
    order.isPaid === true && order.paymentMethod === "stripe";

  const status = ["pending", "confirmed", "shipped", "delivered"];

  const handleCancel = async (orderId: string) => {
    try {
      const res = await axios.post("/api/order/cancel-order", { orderId });

      const updatedOrders = allOrdersData.map((o: any) =>
        o._id === orderId ? { ...o, orderStatus: "cancelled" } : o,
      );

      dispatch(setAllOrdersData(updatedOrders));
      alert("Order Candelled successfully.");
      setSelectedOrder(null);
    } catch (error) {
      console.log(error);
      alert("Order cancel error.\n" + error);
    }
  };

  const isEligigbleReturn = (deliveryDate: string, replacementDays: number) => {
    if (!deliveryDate || !replacementDays) {
      return false;
    }

    const deliveredAt = new Date(deliveryDate).getTime();
    const expiry = deliveredAt + replacementDays * 24 * 60 * 60 * 1000;
    return Date.now() <= expiry;
  };
  const remainingDays = (deliveryDate: string, replacementDays: number) => {
    if (!deliveryDate || !replacementDays) {
      return 0;
    }

    const deliveredAt = new Date(deliveryDate).getTime();
    const expiry = deliveredAt + replacementDays * 24 * 60 * 60 * 1000;

    const diff = expiry - Date.now();
    if (diff <= 0) return 0;

    return Math.ceil(diff / (24 * 60 * 60 * 1000));
  };
  const returnnEndDate = (deliveryDate: string, replacementDays: number) => {
    if (!deliveryDate || !replacementDays) {
      return null;
    }

    const deliveredAt = new Date(deliveryDate);
    deliveredAt.setDate(deliveredAt.getDate() + replacementDays);

    return deliveredAt;
  };

  const returnOrder = async (orderId: string) => {
    try {
      const res = await axios.post("/api/order/return", { orderId });
      const updatedOrders = allOrdersData.map((o: any) =>
        o._id === orderId
          ? {
              ...o,
              orderStatus: "returned",
              returnedAmount: res.data.returnedAmount,
            }
          : o,
      );
      dispatch(setAllOrdersData(updatedOrders));
      alert("Order Returned successfully.");
      setSelectedOrder(null);
    } catch (error) {
      console.log(error);
    }
  };

  const renderTrackStep = (currentStatus: string) => {
    return (
      <div className=" relative pl-6">
        <div className=" absolute top-0 left-8 h-[96%] w-px bg-gray-600"></div>
        {status.map((s, i) => {
          const active = currentStatus === s;
          return (
            <div key={i} className=" relative mb-6 flex items-start">
              <div
                className={`w-4 h-4 rounded-full ${active ? "bg-blue-500 shadow-lg shadow-blue-500/50" : "bg-gray-500"}`}
              ></div>

              <div className=" ml-4 text-sm uppercase">{s}</div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!orders) {
    return (
      <div className="min-h-screen w-screen text-4xl p-6 flex justify-center items-center bg-linear-to-br from-gray-700 via-black to-gray-900 text-white">
        <SyncLoader speedMultiplier={0.6} size={20} color="white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen p-6  bg-linear-to-br from-gray-700 via-black to-gray-900 text-white">
      <div className=" max-w-6xl mx-auto">
        {/* heading */}
        <div className=" mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Orders</h1>
            <p className=" text-sm text-gray-300">All orders placed by you</p>
          </div>

          <div className=" text-sm text-gray-300">{orders.length} Orders</div>
        </div>

        {/* lg device */}
        <div className=" hidden lg:block bg-white/5 border border-white/10 rounded-xl overflow-auto shadow-xl shadow-black/40">
          <table className=" w-full text-left">
            <thead className=" text-xs bg-white/5 border-b border-white/10 text-gray-300 uppercase tracking-wide">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Products</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Total</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.length !== 0 ? (
                orders.map((order, i) => (
                  <tr
                    key={i}
                    className=" border-t border-white/5 hover:bg-white/10 transition-all duration-200"
                  >
                    <td className=" p-4 text-sm">
                      #{String(order._id).slice(-8)}
                    </td>
                    <td className=" p-4 text-sm">
                      {formatDate(String(order.createdAt))}
                    </td>
                    <td className=" p-4 text-sm">
                      {order.products.map((p, i) => (
                        <div key={i} className=" text-gray-200">
                          {p.product.title} * {p.quantity}
                        </div>
                      ))}
                    </td>
                    <td className=" p-4 text-sm">
                      {order.productVendor.shopName}
                    </td>
                    <td className=" p-4 text-sm uppercase">
                      {order.paymentMethod}
                      <div
                        className={`text-xs ${order.isPaid ? "text-green-300" : "text-yellow-300"}`}
                      >
                        {order.isPaid ? "paid" : "pending"}
                      </div>
                    </td>
                    <td className=" p-4 text-sm">
                      {order.orderStatus.toUpperCase()}
                    </td>
                    <td className=" p-4 text-right text-green-300 font-semibold">
                      ₹{order.totalAmount}
                    </td>
                    <td className=" p-4 flex justify-center">
                      {order.orderStatus === "cancelled" && (
                        <span className="text-red-500 font-semibold">
                          Cancelled
                        </span>
                      )}
                      {order.orderStatus === "returned" && (
                        <span className="text-yellow-500 font-semibold flex flex-col justify-center items-center gap-1">
                          Returned{" "}
                          <span className=" text-sm">
                            ₹{order.returnedAmount}
                          </span>
                        </span>
                      )}
                      {order.orderStatus !== "cancelled" &&
                        order.orderStatus !== "returned" && (
                          <div className=" flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                              }}
                              className=" px-3 py-1 bg-white/10 rounded hover:bg-white/20 cursor-pointer"
                            >
                              Check Details
                            </button>

                            <button
                              onClick={() => setTrackOrderModel(order)}
                              disabled={order.orderStatus === "delivered"}
                              className={` px-3 py-1 rounded flex justify-center items-center gap-1 text-nowrap  ${order.orderStatus === "delivered" ? "bg-green-600  hover:bg-green-500 cursor-not-allowed" : "bg-white/10  hover:bg-white/20 cursor-pointer "}`}
                            >
                              <FiTruck />
                              {order.orderStatus === "delivered"
                                ? " Delivered"
                                : " Track Order"}
                            </button>
                          </div>
                        )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className=" text-center text-gray-400 p-6" colSpan={8}>
                    No Orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* sm & md device */}
        <div className="lg:hidden space-y-4">
          {orders.length !== 0 ? (
            orders.map((order, i) => (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                key={i}
                className=" bg-white/5 border-white/10 p-4 rounded-xl"
              >
                {/* first div */}
                <div className=" flex justify-between">
                  <div>
                    <div className=" text-sm text-gray-300">
                      #{String(order._id).slice(-8)}
                    </div>
                    <div className=" font-semibold">
                      {formatDate(String(order.createdAt))}
                    </div>
                    <div className=" text-sm text-gray-300">
                      {order.productVendor.shopName}
                    </div>
                  </div>

                  <div className=" text-green-300 font-bold text-right">
                    ₹{order.totalAmount}
                  </div>
                </div>

                {/* second div */}
                <div className=" mt-3 flex justify-between">
                  <div>
                    <div className=" text-xs text-gray-400">
                      Payment Method: {order.paymentMethod.toUpperCase()}
                    </div>

                    <div
                      className={`text-sm font-semibold ${order.isPaid ? "text-green-400" : "text-yellow-400"}`}
                    >
                      {order.isPaid ? "paid" : "pending"}
                    </div>
                  </div>

                  <div>
                    <div className=" text-xs text-gray-400">Status:</div>
                    <div className=" text-sm font-semibold">
                      {order.orderStatus.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className=" mt-3 space-y-1">
                  {order.products.map((p, i) => (
                    <div key={i} className=" text-gray-200 text-sm">
                      {p.product.title} * {p.quantity}
                    </div>
                  ))}
                </div>

                {order.orderStatus === "cancelled" && (
                  <span className="text-red-500 font-semibold w-full flex justify-center">
                    Cancelled
                  </span>
                )}
                {order.orderStatus === "returned" && (
                  <span className="text-yellow-500 font-semibold flex flex-col justify-center items-center gap-1">
                    Returned{" "}
                    <span className=" text-sm">₹{order.returnedAmount}</span>
                  </span>
                )}
                {order.orderStatus !== "cancelled" &&
                  order.orderStatus !== "returned" && (
                    <div className=" mt-3 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                        }}
                        className=" flex-1 py-2 bg-white/10 cursor-pointer"
                      >
                        Check Details
                      </button>
                      <button
                        onClick={() => setTrackOrderModel(order)}
                        disabled={order.orderStatus === "delivered"}
                        className={` px-3 py-1 rounded flex justify-center items-center gap-1 text-nowrap ${order.orderStatus === "delivered" ? "bg-green-600  hover:bg-green-500 cursor-not-allowed" : "bg-white/10  hover:bg-white/20 cursor-pointer "}`}
                      >
                        <FiTruck />
                        {order.orderStatus === "delivered"
                          ? " Delivered"
                          : " Track Order"}
                      </button>
                    </div>
                  )}
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full bg-white/5 border-white/10 rounded-xl p-4 text-center text-xl text-gray-400"
            >
              No Orders
            </motion.div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <div className=" fixed inset-0 z-40 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className=" relative z-10 w-full max-w-3xl bg-cyan-950 border border-white/10 p-6 rounded-xl shadow-2xl shadow-black/40"
          >
            <h2 className=" text-lg font-semibold">
              Order Details #{String(selectedOrder._id).slice(-8)}
            </h2>
            <p className=" text-sm from-gray-300">
              {formatDate(String(selectedOrder.createdAt))}
            </p>

            <hr className=" my-4 border-white/10" />

            <h3 className=" font-semibold mb-2">Product</h3>
            {selectedOrder.products.map((p: any, i: any) => (
              <div
                key={i}
                className=" flex justify-between bg-white/5 p-3 rounded mb-2 text-gray-200 text-sm"
              >
                <div>
                  <div className=" font-medium">{p.product.title}</div>
                  <div>
                    Qty: {p.quantity} * Price: {p.price}
                  </div>
                </div>
              </div>
            ))}

            <hr className=" my-4 border-white/10" />

            <h3 className=" font-semibold mb-2">Invoice</h3>
            <div className=" text-sm space-y-1">
              <div className=" flex justify-between">
                <span>Product Total</span>
                <span>₹ {selectedOrder.productsTotal}</span>
              </div>
              <div className=" flex justify-between">
                <span>Delivery Charge</span>
                <span>₹ {selectedOrder.deliveryCharge}</span>
              </div>
              <div className=" flex justify-between">
                <span>Service Charge</span>
                <span>₹ {selectedOrder.serviceCharge}</span>
              </div>
            </div>
            <hr className=" my-4 border-white/10" />

            <div className=" flex justify-between font-semibold text-green-300">
              <span>Final Total</span>
              <span>₹ {selectedOrder.totalAmount}</span>
            </div>

            {selectedOrder.orderStatus === "delivered" &&
              selectedOrder.deliveryDate && (
                <div className=" mt-3 text-sm text-green-400">
                  Delivered on:{" "}
                  {new Date(selectedOrder.deliveryDate).toLocaleDateString(
                    "en-IN",
                  )}
                </div>
              )}

            {selectedOrder.isPaid === true &&
              selectedOrder.paymentMethod === "stripe" && (
                <div className=" bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm rounded-lg p-3 mt-4">
                  <p className="font-semibold mb-1">Important Noote:</p>
                  <ul className=" list-disc pl-4 space-y-1">
                    <li>
                      Order cancellation feature is{" "}
                      <b>
                        not available if payment is done using Online Payment
                        (Stripe)
                      </b>
                      .
                    </li>
                    <li>
                      You can only <b>return the product</b> after the delivery.
                    </li>
                    <li>
                      On return, you will receive the <b>product amount</b>
                    </li>
                    <li>
                      <b>Delivery & service charge are non-refundable.</b>
                    </li>
                  </ul>
                </div>
              )}

            <div className=" mt-6 flex flex-col md:flex-row justify-end gap-3">
              <button
                onClick={() => setSelectedOrder(false)}
                className=" px-4 py-2 bg-white/10 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setTrackOrderModel(selectedOrder)}
                disabled={selectedOrder.orderStatus === "delivered"}
                className={` px-3 py-1 rounded flex justify-center items-center gap-1 text-nowrap  ${selectedOrder.orderStatus === "delivered" ? "bg-green-600  hover:bg-green-500 cursor-not-allowed" : "bg-white/10  hover:bg-white/20 cursor-pointer "}`}
              >
                <FiTruck />
                {selectedOrder.orderStatus === "delivered"
                  ? " Delivered"
                  : " Track Order"}
              </button>
              {selectedOrder.orderStatus !== "delivered" ? (
                <button
                  onClick={() => handleCancel(String(selectedOrder._id))}
                  disabled={isCancledDisabled(selectedOrder)}
                  className={`px-4 py-2 rounded ${
                    isCancledDisabled(selectedOrder)
                      ? "bg-white/10 text-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 cursor-pointer"
                  }`}
                >
                  Cancel Order
                </button>
              ) : (
                selectedOrder.products.map((p: any, i: number) => {
                  const replacementDays = p.product.replacementDays || 0;
                  const eligible = isEligigbleReturn(
                    selectedOrder.deliveryDate,
                    replacementDays,
                  );
                  const remaining = remainingDays(
                    selectedOrder.deliveryDate,
                    replacementDays,
                  );
                  const returnEndDate = returnnEndDate(
                    selectedOrder.deliveryDate,
                    replacementDays,
                  );
                  return (
                    <div
                      key={i}
                      className=" flex justify-between items-center bg-white/5 px-3 py-2 rounded ml-2"
                    >
                      <div className="">
                        <p className="text-shadow-xs text-gray-300">
                          {p.product?.title}
                        </p>

                        {eligible ? (
                          <>
                            <p className=" text-xs text-yellow-400">
                              Return available for {remaining} day
                              {remaining > 1 ? "s" : ""}
                            </p>

                            {returnEndDate && (
                              <p className="text-2.5 text-gray-400">
                                Return till:{" "}
                                {returnEndDate.toLocaleDateString("en-IN")}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-xs text-red-400">
                            Return window colsed
                          </p>
                        )}
                      </div>
                      {eligible && (
                        <button
                          onClick={() => returnOrder(selectedOrder._id)}
                          className="mx-3 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-sm rounded cursor-pointer"
                        >
                          Return
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}

      {trackOrderModel && (
        <div className=" flex inset-0 z-50 fixed items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className=" relative z-10 min-h-125 w-full max-w-lg bg-cyan-950 space-y-2 border border-white/10 p-6 rounded-xl"
          >
            <h2 className=" text-xl font-semibold">Track Order</h2>
            <div className=" text-sm text-gray-300 mb-4 leading-relaxed">
              <h2 className=" text-md font-bold mb-2">Delivery Address</h2>

              <div className=" flex justify-start gap-2">
                <span className=" font-semibold">Buyer Name:</span>
                <span>{trackOrderModel.address.name}</span>
              </div>
              <div className=" flex justify-start gap-2">
                <span className=" font-semibold">Delivery Address:</span>
                <span>{trackOrderModel.address.address}</span>
              </div>
              <div className=" flex justify-start gap-2">
                <span className=" font-semibold">City:</span>
                <span>{trackOrderModel.address.city}</span>
              </div>
              <div className=" flex justify-start gap-2">
                <span className=" font-semibold">Pincode:</span>
                <span>{trackOrderModel.address.pincode}</span>
              </div>
              <div className=" flex justify-start gap-2">
                <span className=" font-semibold">Mobile no:</span>
                <span>{trackOrderModel.address.phone}</span>
              </div>
            </div>
            {renderTrackStep(trackOrderModel.orderStatus)}
            <button
              onClick={() => setTrackOrderModel(null)}
              className=" px-4 py-2 bg-white/10 rounded cursor-pointer"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Orders;
