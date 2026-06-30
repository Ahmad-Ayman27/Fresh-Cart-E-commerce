import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { cartContext } from "../contexts/CartContextProvider";
import { wishlistProvider } from "../contexts/WishlistContextProvider";
import RelatedProductsCarousel from "../RelatedProductsCarousel/RelatedProductsCarousel";

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const [loadingIds, setLoadingIds] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  const { id, category } = useParams();
  const { addToCart } = useContext(cartContext);
  const {
    addToWishlist,
    removeFromWishlist,
    data: wishlistData,
  } = useContext(wishlistProvider);

  const isWishlisted = (productId) =>
    wishlistData?.some((item) => item._id === productId);

  const toggleWishlist = async (productId) => {
    if (isWishlisted(productId)) await removeFromWishlist(productId);
    else await addToWishlist(productId);
  };

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

  function getSpecificProduct(id) {
    axios
      .get(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
      .then(({ data }) => {
        setProduct(data.data);
        setSelectedImage(data.data.imageCover);
      })
      .catch(() => setError("Product Not Found"));
  }

  async function getProducts() {
    const { data } = await axios.get(
      "https://ecommerce.routemisr.com/api/v1/products",
    );
    setRelatedProducts(data.data.filter((p) => p.category.name === category));
  }

  useEffect(() => {
    getSpecificProduct(id);
    getProducts();
  }, [id]);

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-2xl rounded-2xl p-10 text-center max-w-sm w-full">
          <span className="text-6xl">⚠️</span>
          <h1 className="text-red-600 text-3xl font-extrabold mt-4">{error}</h1>
          <p className="text-gray-500 mt-2 mb-6 text-sm">
            Oops! Something went wrong. Try refreshing the page or check your connection.
          </p>
          <Link
            to="/"
            className="px-6 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium text-sm"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ClipLoader size={75} color="green" />
      </div>
    );
  }

  const isLoadingCart = loadingIds.includes(product._id);
  const wishlisted = isWishlisted(product._id);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      {/* Product Section */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Left: Images */}
        <div className="md:w-2/5 flex flex-col gap-3">
          {/* Main image */}
          <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center p-4">
            <img
              src={selectedImage || product.imageCover}
              alt={product.title}
              className="w-full max-h-80 sm:max-h-96 object-contain"
            />
          </div>

          {/* Thumbnail strip */}
          {product.images?.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[product.imageCover, ...product.images].map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === img
                      ? "border-green-500"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`thumb-${i}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="md:w-3/5 flex flex-col">
          {/* Category */}
          <span className="text-green-600 text-sm font-semibold uppercase tracking-wide mb-1">
            {product.category.name}
          </span>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-snug mb-3">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`fas fa-star text-sm ${
                    i < Math.round(product.ratingsAverage)
                      ? "text-yellow-400"
                      : "text-gray-200"
                  }`}
                ></i>
              ))}
            </div>
            <span className="text-sm text-gray-500 font-medium">
              {product.ratingsAverage} ({product.ratingsQuantity} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-5">
            {product.priceAfterDiscount ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-red-500">
                  {product.priceAfterDiscount} EGP
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {product.price} EGP
                </span>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {Math.round(
                    ((product.price - product.priceAfterDiscount) /
                      product.price) *
                      100,
                  )}
                  % OFF
                </span>
              </div>
            ) : (
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                {product.price} EGP
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 border-t border-gray-100 pt-4">
            {product.description}
          </p>

          {/* Stock / sold */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
            {product.quantity && (
              <span className="flex items-center gap-1">
                <i className="fas fa-box text-green-500"></i>
                {product.quantity} in stock
              </span>
            )}
            {product.sold && (
              <span className="flex items-center gap-1">
                <i className="fas fa-shopping-bag text-green-500"></i>
                {product.sold} sold
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-auto">
            <button
              onClick={() => handleAddToCart(product._id)}
              disabled={isLoadingCart}
              className={`flex-1 py-3 rounded-xl text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition ${
                isLoadingCart
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 active:scale-95"
              }`}
            >
              {isLoadingCart ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <>
                  <i className="fas fa-cart-plus"></i>
                  Add to Cart
                </>
              )}
            </button>

            <button
              onClick={() => toggleWishlist(product._id)}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition active:scale-95 ${
                wishlisted
                  ? "border-red-400 bg-red-50 text-red-500"
                  : "border-gray-200 hover:border-red-300 text-gray-400 hover:text-red-400"
              }`}
            >
              <i
                className={`${wishlisted ? "fas" : "far"} fa-heart text-lg`}
              ></i>
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
            Related Products
          </h2>
          <RelatedProductsCarousel products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
