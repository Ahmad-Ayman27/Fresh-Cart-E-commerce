import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { cartContext } from "../contexts/CartContextProvider";
import { wishlistProvider } from "../contexts/WishListcontextProvider";

async function callApi() {
  return await axios.get("https://ecommerce.routemisr.com/api/v1/products");
}

const sortOptions = [
  { value: "default", label: "Default", icon: "fas fa-sliders-h" },
  { value: "price-asc", label: "Price: Low to High", icon: "fas fa-arrow-up" },
  {
    value: "price-desc",
    label: "Price: High to Low",
    icon: "fas fa-arrow-down",
  },
  { value: "rating", label: "Top Rated", icon: "fas fa-star" },
];

export default function DisplayProduct() {
  const {
    addToWishlist,
    removeFromWishlist,
    data: wishlistData,
  } = useContext(wishlistProvider);
  const { addToCart } = useContext(cartContext);
  const [loadingIds, setLoadingIds] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product"],
    queryFn: callApi,
    staleTime: 500000,
  });

  const handleAddToCart = async (productId) => {
    try {
      setLoadingIds((prev) => [...prev, productId]);
      await addToCart(productId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const isWishlisted = (productId) =>
    wishlistData?.some((item) => item._id === productId);

  const toggleWishlist = async (productId) => {
    if (isWishlisted(productId)) await removeFromWishlist(productId);
    else await addToWishlist(productId);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ClipLoader size={75} color="green" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 mt-20">Failed to load products.</p>
    );
  }

  let products = data?.data?.data ?? [];

  if (search.trim()) {
    products = products.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (sortBy === "price-asc")
    products = [...products].sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc")
    products = [...products].sort((a, b) => b.price - a.price);
  else if (sortBy === "rating")
    products = [...products].sort(
      (a, b) => b.ratingsAverage - a.ratingsAverage,
    );

  const activeSortOption = sortOptions.find((o) => o.value === sortBy);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
        Our Products
      </h2>

      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times text-sm"></i>
            </button>
          )}
        </div>

        {/* Custom Sort Dropdown */}
        <div className="relative sm:w-52" ref={sortRef}>
          <button
            onClick={() => setSortOpen((prev) => !prev)}
            className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white border rounded-xl text-sm font-medium shadow-sm transition-all duration-200 ${
              sortOpen
                ? "border-green-400 ring-2 ring-green-100 text-green-700"
                : "border-gray-200 text-gray-700 hover:border-green-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <i
                className={`${activeSortOption.icon} text-green-500 text-xs`}
              ></i>
              {activeSortOption.label}
            </span>
            <i
              className={`fas fa-chevron-down text-xs text-gray-400 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
            ></i>
          </button>

          {sortOpen && (
            <div className="absolute right-0 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="p-1.5">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setSortOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                      sortBy === option.value
                        ? "bg-green-50 text-green-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                        sortBy === option.value
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <i className={option.icon}></i>
                    </span>
                    {option.label}
                    {sortBy === option.value && (
                      <i className="fas fa-check text-green-500 text-xs ml-auto"></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing{" "}
        <span className="font-semibold text-gray-700">{products.length}</span>{" "}
        products
        {search && (
          <span>
            {" "}
            for "<span className="text-green-600">{search}</span>"
          </span>
        )}
      </p>

      {/* No results */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <i className="fas fa-search text-5xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-600 mb-1">
            No products found
          </h3>
          <p className="text-sm text-gray-400">Try a different search term</p>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {products.map((product) => {
          const isLoadingButton = loadingIds.includes(product._id);
          const wishlisted = isWishlisted(product._id);

          return (
            <div
              key={product._id}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-200 flex flex-col"
            >
              {/* Image area */}
              <div className="relative overflow-hidden bg-gray-50">
                <Link
                  to={`/productDetails/${product._id}/${product.category.name}`}
                >
                  <img
                    className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    src={product.imageCover}
                    alt={product.title}
                  />
                </Link>

                {product.priceAfterDiscount && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    SALE
                  </span>
                )}

                <button
                  onClick={() => toggleWishlist(product._id)}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow hover:scale-110 transition-transform duration-200"
                >
                  <i
                    className={`${wishlisted ? "fas" : "far"} fa-heart text-red-500 text-sm`}
                  ></i>
                </button>
              </div>

              {/* Info area */}
              <div className="p-3 flex flex-col flex-1">
                <Link
                  to={`/productDetails/${product._id}/${product.category.name}`}
                >
                  <p className="text-[11px] text-green-600 font-medium mb-0.5">
                    {product.category.name}
                  </p>
                  <h2 className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug line-clamp-2 mb-2">
                    {product.title}
                  </h2>
                </Link>

                <div className="flex items-center justify-between mt-auto mb-3">
                  <div className="text-xs sm:text-sm">
                    {product.priceAfterDiscount ? (
                      <div className="flex flex-col">
                        <span className="text-gray-400 line-through text-[11px]">
                          {product.price} EGP
                        </span>
                        <span className="text-red-500 font-bold">
                          {product.priceAfterDiscount} EGP
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-gray-800">
                        {product.price} EGP
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <i className="fas fa-star text-yellow-400 text-[11px]"></i>
                    <span>{product.ratingsAverage}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(product._id)}
                  disabled={isLoadingButton}
                  className={`w-full py-2 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                    isLoadingButton
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 active:scale-95"
                  }`}
                >
                  {isLoadingButton ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <>
                      <i className="fas fa-cart-plus text-xs"></i>
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
