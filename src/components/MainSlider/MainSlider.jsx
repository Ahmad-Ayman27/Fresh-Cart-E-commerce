import React from "react";
import groccery1 from "../../assets/images/grocery-banner-2.jpeg";
import groccery2 from "../../assets/images/grocery-banner.png";
import slider1 from "../../assets/images/slider-image-1.jpeg";
import slider2 from "../../assets/images/slider-image-2.jpeg";
import slider3 from "../../assets/images/slider-image-3.jpeg";
import Slider from "react-slick";

export default function MainSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr]">
      {/* Main slider */}
      <div className="overflow-hidden">
        <Slider {...settings} className="m-0 md:m-10">
          {[slider1, slider2, slider3].map((src, i) => (
            <div key={i}>
              <img
                className="h-[220px] sm:h-[350px] md:h-[600px] w-full object-cover"
                src={src}
                alt={`slide-${i + 1}`}
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Side banners — hidden on mobile */}
      <div className="hidden md:block">
        <img
          src={groccery1}
          alt="banner 1"
          className="w-full h-[290px] mt-10 object-cover"
        />
        <img
          src={groccery2}
          alt="banner 2"
          className="w-full h-[290px] mt-5 object-cover"
        />
      </div>
    </div>
  );
}
