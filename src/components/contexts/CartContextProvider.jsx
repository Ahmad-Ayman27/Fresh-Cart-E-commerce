import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { createContext } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
export let cartContext = createContext();

export default function CartContextProvider({ children }) {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  // Fetch cart
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/cart",
        { headers: { token } }
      );
      return res.data.data; // <-- this is your cart object
    },
    refetchOnWindowFocus: false,
  });
  const { mutateAsync: updateCount } = useMutation({
    mutationFn: async ({ count, productId }) => {
      return axios.put(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        { count },
        { headers: { token } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Cart updated successfully");
    },
    onError: () => {
      toast.error("Failed to update cart");
    },
  });

  // Mutations (add/remove/update cart) stay the same
  const { mutateAsync: removeFromCart } = useMutation({
    mutationFn: async (cartItemId) =>
      axios.delete(
        `https://ecommerce.routemisr.com/api/v1/cart/${cartItemId}`,
        {
          headers: { token },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Product removed from cart");
    },
  });

  const { mutateAsync: addToCart } = useMutation({
    mutationFn: async (productId) =>
      axios.post(
        `https://ecommerce.routemisr.com/api/v1/cart`,
        { productId },
        { headers: { token } }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Product added to cart");
    },
    onError:()=>{
      toast.error("Something Went Wrong.. Try refreshing the page");
    }
  });

  const { mutateAsync: clearCart } = useMutation({
    mutationFn: async () =>
      axios.delete("https://ecommerce.routemisr.com/api/v1/cart", {
        headers: { token },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Success");
    },
    onError: () => {
      toast.error("Something went wrong.. Try refreshing the page");
    },
  });
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ClipLoader size={75} color="green" />
      </div>
    );
  }

  console.log("Cart loaded:", data);

  return (
    <cartContext.Provider
      value={{
        addToCart,
        removeFromCart,
        updateCount,
        clearCart,
        cartId: data?._id, // <-- provide cartId here
        cartData: data,
        numberOfCartItems: data?.products?.length || 0,
        error: isError,
      }}
    >
      {children}
    </cartContext.Provider>
  );
}
