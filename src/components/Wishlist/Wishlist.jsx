import React, { useContext } from "react";
import { wishlistProvider } from "../contexts/WishListcontextProvider";
import { cartContext } from "../contexts/CartContextProvider";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { data, removeFromWishlist, clearWishlist } =
    useContext(wishlistProvider);
  const { addToCart } = useContext(cartContext);

  const handleClearWishlist = async () => {
    if (!data || data.length === 0) return;
    await clearWishlist();
  };

  const handleAddToCart = async (productId) => {
    await addToCart(productId);
    await removeFromWishlist(productId);
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
          <i className="far fa-heart text-red-400 text-4xl"></i>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Your wishlist is empty
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-xs">
          Save items you love by clicking the heart icon on any product.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold shadow-md transition"
        >
          <i className="fas fa-store text-sm"></i>
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 sm:py-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Wishlist
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {data.length} {data.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        <button
          onClick={handleClearWishlist}
          className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 px-4 py-2 rounded-xl transition-all duration-200"
        >
          <i className="fas fa-trash-alt text-xs"></i>
          Clear All
        </button>
      </div>

      {/* ── Desktop table (md+) ── */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-600">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Product
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Price
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={product.imageCover}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 line-clamp-1">
                        {product.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {product.category?.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-green-600 text-base">
                    {product.price} EGP
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="flex items-center gap-1.5 text-white bg-green-500 hover:bg-green-600 active:bg-green-700 px-4 py-2 rounded-xl text-xs font-semibold transition"
                    >
                      <i className="fas fa-cart-plus text-xs"></i>
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards (< md) ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {data.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-center"
          >
            <div className="w-18 h-18 flex-shrink-0">
              <img
                src={product.imageCover}
                alt={product.title}
                className="w-16 h-16 object-cover rounded-xl"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm line-clamp-1 mb-0.5">
                {product.title}
              </p>
              <p className="text-xs text-gray-400 mb-2">
                {product.category?.name}
              </p>
              <p className="text-green-600 font-bold text-sm">
                {product.price} EGP
              </p>
            </div>

            <div className="flex flex-col gap-2 flex-shrink-0">
              <button
                onClick={() => handleAddToCart(product._id)}
                className="w-9 h-9 flex items-center justify-center bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-xl transition"
                title="Add to Cart"
              >
                <i className="fas fa-cart-plus text-sm"></i>
              </button>
              <button
                onClick={() => removeFromWishlist(product._id)}
                className="w-9 h-9 flex items-center justify-center border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition"
                title="Remove"
              >
                <i className="fas fa-trash-alt text-xs"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
