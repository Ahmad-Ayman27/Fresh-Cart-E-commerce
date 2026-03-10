import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { createContext } from "react";
import toast from "react-hot-toast";

export let wishlistProvider = createContext();

export default function WishlistContextProvider({ children }) {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        { headers: { token } },
      );
      return res.data.data;
    },
  });

  const { mutateAsync: addToWishlist } = useMutation({
    mutationFn: async (productId) => {
      await axios.post(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        { productId },
        { headers: { token } },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Product Added to Wishlist");
    },
    onError: () => {
      toast.error("Something Went Wrong. Try refreshing the page");
    },
  });

  const { mutateAsync: removeFromWishlist } = useMutation({
    mutationFn: async (productId) => {
      await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
        { headers: { token } },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: () => {
      toast.error("Something Went Wrong. Try refreshing the page");
    },
  });

  const { mutateAsync: clearWishlist } = useMutation({
    mutationFn: async () => {
      await axios.delete("https://ecommerce.routemisr.com/api/v1/wishlist", {
        headers: { token },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Wishlist Cleared Successfully");
    },
    onError: () => {
      toast.error("Something Went Wrong. Try refreshing the page");
    },
  });

  return (
    <wishlistProvider.Provider
      value={{
        data,
        isError,
        isLoading,
        isSuccess,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </wishlistProvider.Provider>
  );
}
