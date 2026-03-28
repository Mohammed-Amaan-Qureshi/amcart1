"use client";
import UseGetAllOrders from "@/hooks/UseGetAllOrders";
import UseGetCurrentUser from "@/hooks/UseGetCurrentUser";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

function UserOrders() {

  UseGetAllOrders();
  UseGetCurrentUser();



  const allOrdersData = useSelector(
    (state: RootState) => state.user.allOrdersData,
  );

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

  return (
    <div className="w-full h-full p-6 md:pl-[20%] flex flex-col justify-center">
      <div className=" flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center sm:text-left">
          Vendor Orders
        </h1>
        <p className=" text-gray-300">{allOrdersData.length} Orders</p>
      </div>

      {/* desktop table */}
      <div className="hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10">
        <table className="w-full text-left">
          {/* THEAD */}
          <thead className="bg-white/10">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Buyer</th>
              <th className="p-4">Vendor</th>
              <th className="p-4">Products</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>

          {/* TBODY (separate) */}
          <tbody>
            {allOrdersData.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-400">
                  No Orders found
                </td>
              </tr>
            ) : (
              allOrdersData.map((order, index) => (
                <tr
                  key={index}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className=" p-4">#{String(order._id).slice(-8)}</td>
                  <td className=" p-4">
                    {order.address.name}
                    <div className=" text-xs text-gray-400">
                      {order.address.phone}
                    </div>
                  </td>
                  <td className=" p-4">
                    {order.productVendor.shopName}
                  </td>
                  <td className=" p-4">
                    {order.products.map((p, i) => (
                      <div key={i} className=" text-gray-200">
                        {p.product.title} * {p.quantity}
                      </div>
                    ))}
                  </td>
                  <td className=" p-4 text-center">
                   ₹{order.totalAmount}
                  </td>
                  <td className=" p-4 uppercase"> {order.paymentMethod.toUpperCase()}
                    <div className=" text-xs text-gray-400">
                      {order.isPaid ? "Paid" : "Pending"}
                    </div></td>
                  <td className="p-4 text-center">
                    {order.orderStatus === "cancelled" && (
                      <span className=" text-red-400 font-semibold capitalize">
                        Cancelled
                      </span>
                    )}
                    {order.orderStatus === "confirmed" && (
                      <span className=" text-indigo-400 font-semibold capitalize">
                        Confirmed
                      </span>
                    )}
                    {order.orderStatus === "shipped" && (
                      <span className=" text-indigo-400 font-semibold capitalize">
                        Shipped
                      </span>
                    )}
                    {order.orderStatus === "pending" && (
                      <span className=" text-yellow-400 font-semibold capitalize">
                        Pending
                      </span>
                    )}
                    {order.orderStatus === "delivered" && (
                      <span className=" text-green-400 font-semibold capitalize">
                        Delivered
                      </span>
                    )}
                    {order.orderStatus === "returned" && (
                      <span className=" text-orange-400 font-semibold capitalize">
                        Returned
                      </span>
                    )}
                    </td>
                    <td className="p-4">
                      {formatDate(String(order.createdAt))}
                    </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* mobbile card */}
      <div className="flex flex-col gap-4 p-4 md:hidden">
        {allOrdersData.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            Vendor Approval Requests
          </div>
        ) : (
          allOrdersData.map((order, index) => (
            <div
              key={index}
              className="bg-white/10 border-white/20 border rounded-xl p-4 space-y-2"
            >
              <div className=" flex justify-between mb-2">
                <span className=" text-sm">#{String(order._id).slice(-8)}</span>
                <span className=" text-green-400 font-bold">
                  ₹ {order.totalAmount}
                </span>
              </div>

              <p className=" text-sm">
                <b>Buyer: </b>
                {order.address.name}
              </p>
              <p className=" text-sm">
                <b>Vendor: </b>
                {order.productVendor.shopName}
              </p>
              <p className=" text-xs text-gray-400">{order.address.phone}</p>

              <div className=" mt-2 text-sm">
                {order.products.map((p, i) => (
                  <div key={i} className=" text-gray-200">
                    {p.product.title} * {p.quantity}
                  </div>
                ))}
              </div>

              <div className=" mt-3 text-sm capitalize">
                <b>Status: </b>
                {order.orderStatus === "cancelled" && (
                      <span className=" text-red-400 font-semibold capitalize">
                        Cancelled
                      </span>
                    )}
                    {order.orderStatus === "confirmed" && (
                      <span className=" text-indigo-400 font-semibold capitalize">
                        Confirmed
                      </span>
                    )}
                    {order.orderStatus === "shipped" && (
                      <span className=" text-indigo-400 font-semibold capitalize">
                        Shipped
                      </span>
                    )}
                    {order.orderStatus === "pending" && (
                      <span className=" text-yellow-400 font-semibold capitalize">
                        Pending
                      </span>
                    )}
                    {order.orderStatus === "delivered" && (
                      <span className=" text-green-400 font-semibold capitalize">
                        Delivered
                      </span>
                    )}
                    {order.orderStatus === "returned" && (
                      <span className=" text-orange-400 font-semibold capitalize">
                        Returned
                      </span>
                    )}
              </div>

              <div className=" mt-1.5 text-sm">
                {formatDate(String(order.createdAt))}
              </div>

              
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default UserOrders;
