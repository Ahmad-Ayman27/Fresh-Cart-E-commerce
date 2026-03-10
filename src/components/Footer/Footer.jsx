import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 w-full">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h3 className="text-xl font-bold mb-4">About Us</h3>
          <p className="text-gray-400 text-sm">
            Route E-Commerce is your one-stop shop for electronics, fashion,
            home goods, and more. Fast delivery & best prices guaranteed.
          </p>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-xl font-bold mb-4">Customer Service</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <a href="#" className="hover:text-white transition">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Returns & Exchanges
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Shipping Info
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Shop Categories */}
        <div>
          <h3 className="text-xl font-bold mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <a href="#" className="hover:text-white transition">
                Electronics
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Fashion
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Home & Kitchen
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Beauty & Health
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-bold mb-4">Newsletter</h3>
          <p className="text-gray-400 text-sm mb-4">
            Subscribe to get the latest products and promotions.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded text-gray-900 focus:outline-none flex-1"
            />
            <p className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition cursor-pointer">
              Subscribe
            </p>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-500 text-sm">
        <p className="mb-4">© 2026 Route E-Commerce. All rights reserved.</p>
      </div>
    </footer>
  );
}
