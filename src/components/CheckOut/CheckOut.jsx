import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { cartContext } from "../contexts/CartContextProvider";
import { useNavigate } from "react-router-dom";

export default function CheckOut() {
  const { cartId, clearCart } = useContext(cartContext);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const nav = useNavigate();

  const handleCashPayment = async (values) => {
    if (!cartId) return;
    setLoading(true);
    try {
      await axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
        { shippingAddress: values },
        { headers: { token: localStorage.getItem("token") } },
      );
      clearCart();
      setOrderSuccess(true);
    } catch (err) {
      console.error("Cash order error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePayment = async (values) => {
    if (!cartId) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${window.location.origin}`,
        { shippingAddress: values },
        { headers: { token: localStorage.getItem("token") } },
      );
      if (res.data.status === "success") {
        window.location.href = res.data.session.url;
      }
    } catch (err) {
      console.error("Online payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  const { values, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: { details: "", phone: "", city: "" },
    onSubmit: (values) => {
      if (paymentMethod === "cash") {
        handleCashPayment(values);
      } else {
        handleOnlinePayment(values);
      }
    },
  });

  // ✅ Success Screen
  if (orderSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-10 text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Order Placed!
        </h2>
        <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-xs sm:max-w-sm">
          Your order has been successfully placed. We'll deliver it to you soon!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-sm">
          <button
            onClick={() => nav("/")}
            className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm sm:text-base font-medium rounded-lg transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => nav("/allorders")}
            className="w-full py-3 px-6 border-2 border-green-600 text-green-600 hover:bg-green-50 active:bg-green-100 text-sm sm:text-base font-medium rounded-lg transition"
          >
            My Orders
          </button>
        </div>
      </div>
    );
  }

  const inputClass =
    "block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer";
  const labelClass =
    "peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-green-600";

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-800">
          Checkout
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Details */}
          <div className="relative z-0 w-full group">
            <input
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.details}
              type="text"
              name="details"
              id="details"
              placeholder=" "
              required
              className={inputClass}
            />
            <label htmlFor="details" className={labelClass}>
              Details
            </label>
          </div>

          {/* Phone */}
          <div className="relative z-0 w-full group">
            <input
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.phone}
              type="tel"
              name="phone"
              id="phone"
              placeholder=" "
              required
              className={inputClass}
            />
            <label htmlFor="phone" className={labelClass}>
              Phone
            </label>
          </div>

          {/* City */}
          <div className="relative z-0 w-full group">
            <input
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.city}
              type="text"
              name="city"
              id="city"
              placeholder=" "
              required
              className={inputClass}
            />
            <label htmlFor="city" className={labelClass}>
              City
            </label>
          </div>

          {/* Payment Method Toggle */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("cash")}
              className={`py-3 rounded-xl border-2 text-sm font-medium transition active:scale-95 ${
                paymentMethod === "cash"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              💵 Cash
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("online")}
              className={`py-3 rounded-xl border-2 text-sm font-medium transition active:scale-95 ${
                paymentMethod === "online"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              💳 Online
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-xl text-sm sm:text-base transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Processing...
              </span>
            ) : paymentMethod === "cash" ? (
              "Place Order"
            ) : (
              "Pay with Stripe"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
