// Home.jsx
import React from "react";
import Style from "./Home.module.css";
import DisplayProduct from "../DisplayProduct/DisplayProduct";
import CategorySlider from "../categorySlider/categorySlider";
import MainSlider from "../MainSlider/MainSlider";
import { useQueries } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import axios from "axios";
async function fetchProducts() {
  return await axios.get("https://ecommerce.routemisr.com/api/v1/products");
}

async function fetchCategories() {
  return await axios.get("https://ecommerce.routemisr.com/api/v1/categories");
}
export default function Home() {
  // Run multiple queries at once
  const results = useQueries({
    queries: [
      {
        queryKey: ["products"],
        queryFn: fetchProducts,
      },
      {
        queryKey: ["categories"],
        queryFn: fetchCategories,
      },
    ],
  });

  const isLoading = results.some((q) => q.isLoading);
  const isError = results.some((q) => q.isError);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ClipLoader size={75} color="green" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Error loading data</div>;
  }
  return (
    <div className="px-5 md:px-10 lg:px-20">
      <MainSlider />
      <CategorySlider />
      <DisplayProduct />
    </div>
  );
}
