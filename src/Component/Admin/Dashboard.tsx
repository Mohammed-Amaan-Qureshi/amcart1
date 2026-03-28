import { IUser } from "@/app/model/user.model";
import UseGetAllOrders from "@/hooks/UseGetAllOrders";
import UseGetAllProductsData from "@/hooks/UseGetAllProductsData";
import UseGetAllVendors from "@/hooks/UseGetAllVendors";
import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function Dashboard() {
  UseGetAllVendors();
  UseGetAllOrders();
  UseGetAllProductsData();

  const { allVendorsData, allProductsData } = useSelector(
    (state: RootState) => state.vendor,
  );
  const { allOrdersData } = useSelector((state: RootState) => state.user);

  const vendors = allVendorsData || [];

  const pendingVendors = allVendorsData.filter(
    (v) => v.verificationStatus === "pending",
  );

  const products = allProductsData || [];

  const pendingProducts = allProductsData.filter(
    (p) => p.verificationStatus === "pending",
  );

  const orders = allOrdersData || [];

  const deliveredOrders = allOrdersData.filter(
    (o) => o.orderStatus === "delivered",
  );

  let totalEarning = 0;

  deliveredOrders.forEach((o) => {
    if (o.isPaid) {
      totalEarning = totalEarning + o.totalAmount;
    }
  });

  const venderOrderGraph: { vendor: string; orders: number }[] = [];

  for (let i = 0; i < allOrdersData.length; i++) {
    const order = allOrdersData[1];

    let vendorName = order.productVendor.shopName || "Unknown";

    if (vendorName.length > 14) {
      vendorName = vendorName.slice(0, 14) + "...";
    }

    let found = false;

    for (let j = 0; j < venderOrderGraph.length; j++) {
      if (venderOrderGraph[j].vendor === vendorName) {
        venderOrderGraph[j].orders += 1;
        found = true;
        break;
      }
    }

    if (!found) {
      venderOrderGraph.push({
        vendor: vendorName,
        orders: 1,
      });
    }
  }

  const cancelledOrdders = allOrdersData.filter((o)=> o.orderStatus === "cancelled")
  const returnedOrders = allOrdersData.filter((o)=> o.orderStatus === "returned")
  const remainingOrders = allOrdersData.filter((o)=> !["delivered", "cancelled", "returned"].includes(o.orderStatus))

  const orderProgress = [
    {name: "Delivered", value: deliveredOrders.length},
    {name: "Pending", value: remainingOrders.length},
    {name: "Cancelled", value: cancelledOrdders.length},
    {name: "Returned", value: returnedOrders.length},
  ]

  const COLOR = ["#22c55e","#3b82f6","#ef4444","#f97316"]

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 py-6 sm:mt-17 md:mt-0 text-white md:pl-[13%]  ">
      <div className=" max-w-full mx-auto space-y-8">
        <h2 className=" text-xl sm:text-2xl font-bold">Admin Dashboard</h2>
        <div className=" w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StateBox title="Total Vendors" value={vendors.length} />
          <StateBox title="Pending Vendors" value={pendingVendors.length} />
          <StateBox title="Total Products" value={products.length} />
          <StateBox title="Pending Products" value={pendingProducts.length} />
          <StateBox title="Total Orders" value={orders.length} />
          <StateBox title="Total Earnings" value={`₹${totalEarning}`} />
        </div>

        {/* vendor's details */}
        <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {vendors.map((vendor: IUser, i: number) => {
            const vendorProducts = allProductsData.filter(
              (p) => String(p.vendor._id || p.vendor) === String(vendor._id),
            );

            const vendorOrders = allOrdersData.filter(
              (o) =>
                String(o.productVendor._id || o.productVendor) ===
                String(vendor._id),
            );

            const cancelled = vendorOrders.filter(
              (o) => o.orderStatus === "cancelled",
            );

            const returned = vendorOrders.filter(
              (o) => o.orderStatus === "returned",
            );

            let vendorEarning = 0;

            vendorOrders.forEach((o) => {
              if (o.orderStatus === "delivered" && o.isPaid) {
                vendorEarning += o.totalAmount;
              }
            });

            const vendorDeliveredOrders = vendorOrders.filter(
              (o) => o.orderStatus === "delivered",
            );

            return (
              <div
                key={i}
                className=" bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <h2 className=" font-semibold text-base truncate">
                  {vendor.shopName}
                </h2>

                <p className=" text-xs text-gray-400 mt-2">
                  Status:{" "}
                  <span
                    className={` capitalize ${vendor.verificationStatus === "approved" ? "text-green-400" : "text-yellow-400"}`}
                  >
                    {vendor.verificationStatus}
                  </span>
                </p>
                <div className=" text-sm space-y-1">
                  <p>Products: {vendorProducts.length}</p>
                  <p>Orders: {vendorOrders.length}</p>
                  <p className=" text-green-500">
                    Delivered: {vendorDeliveredOrders.length}
                  </p>
                  <p className="text-red-400">Cancelled: {cancelled.length}</p>
                  <p className="text-orange-400">Returned: {returned.length}</p>
                  <p className="text-green-400 font-semibold">
                    Earnings: ₹{vendorEarning}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* charts */}
        <div className=" grid grid-cols-1 lg: lg:grid-cols-2 gap-4">
          {/* Bar Graph */}
          <div className=" bg-white/5 border border-white/10 rounded-xl p-4 h-70 sm:h-87.5">
            <h2 className=" font-semibold mb-2 text-sm">Vendor-wise Order</h2>

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={venderOrderGraph}>
                <CartesianGrid strokeDasharray="3 3" stopOpacity={0.2} />
                <XAxis
                  dataKey="vendor"
                  interval={0}
                  angle={-90}
                  textAnchor="end"
                  height={50}
                  tick={{ fontSize: 10 }}
                />

                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* pie chart */}
          <div className=" bg-white/5 border border-white/10 rounded-xl p-4">
            <h2 className=" font-semibold mb-2 text-sm">
              Order Status Distribution
            </h2>

            <div className=" grid grid-cols-2 gap-3 mb-4">

              <StatusBox label="Delivered" value={deliveredOrders.length} color="text-green-400" />
              <StatusBox label="Pending" value={remainingOrders.length} color="text-blue-400" />
              <StatusBox label="Cancelled" value={cancelledOrdders.length} color="text-red-400" />
              <StatusBox label="Returned" value={returnedOrders.length} color="text-orange-400" />
              
            </div>

            <div className="h-55 sm:h-65">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={orderProgress} dataKey="value" nameKey="name" outerRadius={80} label >
                    {orderProgress.map((_,i)=>(
                      <Cell key={i} fill={COLOR[i]} />
                    ))
                  }
                    </Pie>
                    <Tooltip/>
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

function StateBox({ title, value }: { title: String; value: any }) {
  return (
    <div className=" bg-white/10 border border-white/10 rounded-xl p-4">
      <p className=" text-xs uppercase text-nowrap text-gray-400">{title}</p>
      <p className=" text-lg sm:text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function StatusBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return(
    <div className=" bg-black/40 border border-white/10 rounded-lg p-3 text-center">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  )
}
