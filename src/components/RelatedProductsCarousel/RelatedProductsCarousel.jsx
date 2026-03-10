import React, { useContext, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { cartContext } from "../contexts/CartContextProvider";

export default function RelatedProductsCarousel({ products }) {
  const { addToCart } = useContext(cartContext);
  const [loadingIds, setLoadingIds] = useState([]);

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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <Slider {...settings}>
      {products.map((product) => {
        const isLoadingButton = loadingIds.includes(product._id);
        return (
          <div key={product._id} className="p-2">
            <Link to={`/productDetails/${product._id}/${product.category.name}`}>
              <img
                src={product.imageCover}
                alt={product.title}
                className="w-full  object-cover rounded-md mb-2"
              />
              <h3 className="text-green-500 text-sm">{product.category.name}</h3>
              <h2 className="py-1 text-base font-medium">
                {product.title.split(" ", 2).join(" ")}
              </h2>
              <div className="flex justify-between text-sm">
                {product.priceAfterDiscount ? (
                  <div>
                    <span className="text-red-600 line-through">{product.price}</span>
                    <span> {product.priceAfterDiscount} EGP</span>
                  </div>
                ) : (
                  <span>{product.price} EGP</span>
                )}
                <span>
                  {product.ratingsAverage} <i className="fas fa-star text-yellow-300"></i>
                </span>
              </div>
              {product.priceAfterDiscount && (
                <span className="absolute top-0 bg-red-600 text-white rounded-b-md p-1">
                  Sale
                </span>
              )}
            </Link>

            <button
              onClick={() => handleAddToCart(product._id)}
              disabled={isLoadingButton}
              className={`border border-green-500 p-1 bg-green-500 text-white rounded cursor-pointer mt-2 w-full flex justify-center items-center ${
                isLoadingButton ? "opacity-70 cursor-not-allowed" : "hover:bg-green-600"
              }`}
            >
              {isLoadingButton ? (
                <i className="fas fa-spinner fa-spin text-xl"></i>
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
        );
      })}
    </Slider>
  );
}
