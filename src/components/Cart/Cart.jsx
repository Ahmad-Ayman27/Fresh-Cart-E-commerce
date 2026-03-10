import React, { useContext, useState } from "react";
import { cartContext } from "../contexts/CartContextProvider";
import { Link } from "react-router-dom";

export default function Cart() {
  const {
    cartData,
    error,
    removeFromCart,
    numberOfCartItems,
    updateCount,
    clearCart,
  } = useContext(cartContext);

  const [loadingIds, setLoadingIds] = useState({});

  const handleUpdateCount = async (productId, newCount) => {
    if (loadingIds[productId]) return; // prevent concurrent requests
    setLoadingIds((prev) => ({ ...prev, [productId]: true }));
    try {
      await updateCount({ productId, count: newCount });
    } finally {
      setLoadingIds((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Something went wrong..Try refreshing the page or check your connection.
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Try refreshing the page or check your connection.
          </p>
          <Link
            to="/"
            className="text-green-600 hover:text-green-700 font-medium text-sm"
          >
            ← Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!cartData?.products || cartData.products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center mb-6">
          <i className="fas fa-shopping-cart text-green-400 text-4xl"></i>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-xs">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition"
        >
          <i className="fas fa-store text-sm"></i>
          Browse Products
        </Link>
      </div>
    );
  }

  // Reusable quantity controls
  const QtyControls = ({ item, compact = false }) => {
    const isUpdating = loadingIds[item.product._id];
    const btnClass = `${compact ? "w-7 h-7" : "w-7 h-7"} flex items-center justify-center rounded-lg font-bold transition ${
      isUpdating
        ? "bg-gray-100 text-gray-300 cursor-not-allowed"
        : "bg-gray-100 hover:bg-green-100 hover:text-green-700 text-gray-600"
    }`;

    return (
      <div className="flex items-center gap-2">
        <button
          disabled={isUpdating}
          onClick={() => handleUpdateCount(item.product._id, item.count - 1)}
          className={btnClass}
        >
          {isUpdating ? (
            <i className="fas fa-spinner fa-spin text-xs text-gray-400"></i>
          ) : (
            "−"
          )}
        </button>
        <span
          className={`${compact ? "w-5" : "w-6"} text-center font-semibold text-gray-800 text-sm`}
        >
          {item.count}
        </span>
        <button
          disabled={isUpdating}
          onClick={() => handleUpdateCount(item.product._id, item.count + 1)}
          className={btnClass}
        >
          {isUpdating ? (
            <i className="fas fa-spinner fa-spin text-xs text-gray-400"></i>
          ) : (
            "+"
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-10 sm:py-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Cart
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {numberOfCartItems} {numberOfCartItems === 1 ? "item" : "items"}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 px-4 py-2 rounded-xl transition-all duration-200"
        >
          <i className="fas fa-trash-alt text-xs"></i>
          Clear All
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Left: Product list ── */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Desktop table (md+) */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left text-gray-600">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Product
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Qty
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Price
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cartData.products.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={item.product.imageCover}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">
                            {item.product.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.product.category?.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <QtyControls item={item} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-green-600">
                        {item.price} EGP
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                      >
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {cartData.products.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-center"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={item.product.imageCover}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm line-clamp-1 mb-0.5">
                    {item.product.title}
                  </p>
                  <p className="text-green-600 font-bold text-sm mb-2">
                    {item.price} EGP
                  </p>
                  <QtyControls item={item} compact />
                </div>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                >
                  <i className="fas fa-trash-alt text-xs"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Order summary ── */}
        <div className="lg:w-80">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm text-gray-600 mb-5">
              <div className="flex justify-between">
                <span>Subtotal ({numberOfCartItems} items)</span>
                <span className="font-semibold text-gray-800">
                  {cartData.totalCartPrice} EGP
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span>{cartData.totalCartPrice} EGP</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-xl transition text-sm"
            >
              Proceed to Checkout
              <i className="fas fa-arrow-right text-xs"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
