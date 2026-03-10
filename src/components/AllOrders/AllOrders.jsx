import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function AllOrders() {
  // Decode userId from token
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null;

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allOrders", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await axios.get(
        `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
      );
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  if (!userId) {
    return (
      <p className="text-center text-red-500 mt-20">
        Please log in to view your orders.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 mt-20 px-4">
        Failed to load orders. Please try again.
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No orders yet
        </h3>
        <p className="text-gray-500 text-sm">
          Your order history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 sm:py-12 px-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10">
        My Orders
      </h2>

      <div className="flex flex-col gap-6">
        {orders
          .slice()
          .reverse()
          .map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                  <p className="font-mono text-sm font-semibold text-gray-700">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Date</p>
                    <p className="font-medium text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Total</p>
                    <p className="font-bold text-green-600">
                      {order.totalOrderPrice} EGP
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Payment</p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        order.paymentMethodType === "cash"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.paymentMethodType === "cash"
                        ? "💵 Cash"
                        : "💳 Online"}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Status</p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        order.isDelivered
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {order.isDelivered ? "✅ Delivered" : "🚚 On the way"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="divide-y divide-gray-100">
                {order.cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4"
                  >
                    <img
                      src={item.product.imageCover}
                      alt={item.product.title}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-medium text-gray-800 truncate">
                        {item.product.title}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        Qty: {item.count} × {item.price} EGP
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 flex-shrink-0">
                      {item.count * item.price} EGP
                    </p>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Shipping Address</p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress?.details},{" "}
                  {order.shippingAddress?.city} — {order.shippingAddress?.phone}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
