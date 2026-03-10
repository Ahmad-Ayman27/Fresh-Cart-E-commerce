import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const {
    data: categories = [],
    isLoading: catLoading,
    error: catError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/categories",
      );
      const json = await res.json();
      return Array.isArray(json.data) ? json.data : [];
    },
  });

  const {
    data: subcategories = [],
    isLoading: subLoading,
    error: subError,
  } = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const [page1, page2] = await Promise.all([
        fetch(
          "https://ecommerce.routemisr.com/api/v1/subcategories?page=1&limit=40",
        ).then((r) => r.json()),
        fetch(
          "https://ecommerce.routemisr.com/api/v1/subcategories?page=2&limit=40",
        ).then((r) => r.json()),
      ]);
      const data1 = Array.isArray(page1.data) ? page1.data : [];
      const data2 = Array.isArray(page2.data) ? page2.data : [];
      return [...data1, ...data2];
    },
  });

  if (catLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (catError) {
    return (
      <h2 className="text-center text-lg mt-10 text-red-500 px-4">
        Failed to load categories.
      </h2>
    );
  }

  const safeCategories = Array.isArray(categories) ? categories : [];

  const filteredSubcategories = Array.isArray(subcategories)
    ? subcategories.filter((sub) => sub.category === selectedCategory)
    : [];

  const selectedCategoryName = safeCategories.find(
    (c) => c._id === selectedCategory,
  )?.name;

  return (
    <div className="container mx-auto py-8 sm:py-10 px-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
        Categories
      </h2>

      {/* Categories Grid — 2 cols on mobile, 3 on sm, 4 on md, 5 on lg+ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 mb-10 sm:mb-12">
        {safeCategories.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No categories found.
          </p>
        ) : (
          safeCategories.map((category) => (
            <div
              key={category._id}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category._id ? null : category._id,
                )
              }
              className={`cursor-pointer text-center shadow-sm rounded-xl p-3 transition hover:shadow-md active:scale-95 ${
                selectedCategory === category._id
                  ? "border-2 border-green-500 bg-green-50"
                  : "border border-gray-200 bg-white"
              }`}
            >
              <img
                src={
                  category.image ||
                  "https://via.placeholder.com/200x160?text=No+Image"
                }
                alt={category.name}
                className="w-full h-28 sm:h-36 md:h-40 object-cover rounded-lg"
              />
              <h3 className="mt-2 font-semibold text-sm sm:text-base leading-tight">
                {category.name}
              </h3>
            </div>
          ))
        )}
      </div>

      {/* Subcategories */}
      {selectedCategory && (
        <div className="bg-gray-50 rounded-2xl p-5 sm:p-8">
          <h3 className="text-lg sm:text-2xl font-bold text-center mb-4 sm:mb-6">
            {selectedCategoryName} — Subcategories
          </h3>

          {subLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
            </div>
          ) : subError ? (
            <p className="text-center text-red-500 text-sm sm:text-base">
              Failed to load subcategories.
            </p>
          ) : filteredSubcategories.length === 0 ? (
            <p className="text-center text-gray-500 text-sm sm:text-base">
              No subcategories found.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              {filteredSubcategories.map((sub) => (
                <div
                  key={sub._id}
                  className="px-3 sm:px-5 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-green-100 hover:text-green-700 hover:border-green-300 transition font-medium text-xs sm:text-sm cursor-default"
                >
                  {sub.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
