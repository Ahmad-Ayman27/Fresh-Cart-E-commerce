import React from "react";
import Style from "./Layout.module.css";
import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ScrollToTop />

      {/* Main content */}
      <main className="flex-1 container-fluid ">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
