import React from "react";
import Slider from "react-slick";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

async function callApi() {
  return await axios.get("https://ecommerce.routemisr.com/api/v1/categories");
}

export default function CategorySlider() {
  const { data } = useQuery({
    queryKey: ["categorySlider"],
    queryFn: callApi,
    select: (res) => res.data.data,
    staleTime: 50000,
  });

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <Slider {...settings} className="mb-14">
      {data?.map((category) => (
        <div key={category._id} tabIndex={-1}>
          <img
            className="w-full h-[150px] sm:h-[250px] md:h-[500px] object-cover block"
            src={category.image}
            alt={category.name}
          />
          <p className="text-center text-xs sm:text-sm font-medium mt-1 truncate px-1">
            {category.name}
          </p>
        </div>
      ))}
    </Slider>
  );
}
