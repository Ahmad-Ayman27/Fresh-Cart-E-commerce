import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";

async function brandsApi() {
  return await axios.get("https://ecommerce.routemisr.com/api/v1/brands");
}

export default function Brands() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["brands"],
    queryFn: brandsApi,
    staleTime: 50000,
  });

  const brands = data?.data?.data;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ClipLoader size={75} color="green" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 mt-20">Failed to load brands.</p>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800">
        All Brands
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {brands?.map((brand) => (
          <div
            key={brand._id}
            className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-green-400 transition-all duration-200 overflow-hidden cursor-pointer"
          >
            <div className="p-3 flex items-center justify-center bg-gray-50 h-36">
              <img
                src={brand.image}
                alt={brand.name}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="px-3 py-2 border-t border-gray-100 text-center">
              <p className="text-sm font-semibold text-gray-700 truncate">
                {brand.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
