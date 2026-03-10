import React from "react";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Cart from "./components/Cart/Cart";
import NotFound from "./components/NotFound/NotFound";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Products from "./components/Products/Products";
import Brands from "./components/Brands/Brands";
import Categories from "./components/Categories/Categories";
import AuthContextProvider from "./components/contexts/AuthContextProvider";
import ProtectedRouting from "./components/ProtectedRouting/ProtectedRouting";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import CartContextProvider from "./components/contexts/CartContextProvider";
import { Toaster } from "react-hot-toast";
import CheckOut from "./components/CheckOut/CheckOut";
import AllOrders from "./components/AllOrders/AllOrders";
import WishListcontextProvider from "./components/contexts/WishListcontextProvider";
import Wishlist from "./components/Wishlist/Wishlist";
import ForgotPassword from "./components/forget-password/ForgotPassword";
let client = new QueryClient();
export default function App() {
  let routes = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          path: "",
          element: (
            <ProtectedRouting>
              <Home />
            </ProtectedRouting>
          ),
        },
        {
          path: "about",
          element: (
            <ProtectedRouting>
              <About />
            </ProtectedRouting>
          ),
        },
        {
          path: "cart",
          element: (
            <ProtectedRouting>
              <Cart />
            </ProtectedRouting>
          ),
        },
        {
          path: "wishlist",
          element: (
            <ProtectedRouting>
              <Wishlist />
            </ProtectedRouting>
          ),
        },
        {
          path: "checkout",
          element: (
            <ProtectedRouting>
              <CheckOut />
            </ProtectedRouting>
          ),
        },
        {
          path: "allorders",
          element: (
            <ProtectedRouting>
              <AllOrders />
            </ProtectedRouting>
          ),
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "signup",
          element: <Register />,
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "products",
          element: (
            <ProtectedRouting>
              <Products />
            </ProtectedRouting>
          ),
        },
        {
          path: "productDetails/:id/:category",
          element: (
            <ProtectedRouting>
              <ProductDetails />
            </ProtectedRouting>
          ),
        },
        {
          path: "brands",
          element: (
            <ProtectedRouting>
              <Brands />
            </ProtectedRouting>
          ),
        },
        {
          path: "categories",
          element: (
            <ProtectedRouting>
              <Categories />
            </ProtectedRouting>
          ),
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools />
      <Toaster />
      <WishListcontextProvider>
        <CartContextProvider>
          <AuthContextProvider>
            <RouterProvider router={routes} />
          </AuthContextProvider>
        </CartContextProvider>
      </WishListcontextProvider>
    </QueryClientProvider>
  );
}
