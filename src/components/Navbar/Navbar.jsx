import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/freshcart-logo.svg.svg";
import { authContext } from "../contexts/AuthContextProvider";
import { cartContext } from "../contexts/CartContextProvider";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { token, setToken } = useContext(authContext);
  const { numberOfCartItems } = useContext(cartContext);
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `transition-colors duration-200 hover:text-green-600 ${
      isActive ? "text-green-600 font-semibold" : "text-gray-700"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block py-2.5 px-4 rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-green-50 text-green-600 font-semibold"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  const handleSignout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("login");
    setIsOpen(false);
  };

  return (
    <>
      <nav className="bg-gray-100 border-b border-gray-200 fixed top-0 start-0 end-0 z-[999] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Left: Logo + Desktop Nav */}
          <div className="flex items-center gap-8">
            <NavLink to="" onClick={() => setIsOpen(false)}>
              <img src={logo} className="h-8" alt="FreshCart Logo" />
            </NavLink>

            {token && (
              <ul className="hidden md:flex items-center gap-6 font-medium text-sm">
                {[
                  "",
                  "cart",
                  "wishlist",
                  "products",
                  "categories",
                  "brands",
                ].map((path) => (
                  <li key={path}>
                    <NavLink to={path} className={navLinkClass}>
                      {path === ""
                        ? "Home"
                        : path.charAt(0).toUpperCase() + path.slice(1)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right: Social + Cart + Auth */}
          <div className="flex items-center gap-4">
            {/* Social icons — hidden on small screens */}
            <div className="hidden lg:flex items-center gap-2 text-gray-500 text-base">
              <i className="fab fa-facebook hover:text-blue-600 cursor-pointer transition-colors"></i>
              <i className="fab fa-twitter hover:text-sky-500 cursor-pointer transition-colors"></i>
              <i className="fab fa-linkedin hover:text-blue-700 cursor-pointer transition-colors"></i>
              <i className="fab fa-youtube hover:text-red-600 cursor-pointer transition-colors"></i>
              <i className="fab fa-instagram hover:text-pink-500 cursor-pointer transition-colors"></i>
              <i className="fab fa-tiktok hover:text-black cursor-pointer transition-colors"></i>
            </div>

            {/* Cart */}
            {token && (
              <Link
                to="/cart"
                className="relative text-gray-700 hover:text-green-600 transition-colors"
              >
                <i className="fa-solid fa-cart-shopping text-xl"></i>
                {numberOfCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {numberOfCartItems}
                  </span>
                )}
              </Link>
            )}

            {/* Auth buttons — desktop */}
            {token ? (
              <button
                onClick={handleSignout}
                className="hidden md:block text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Sign out
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-3 text-sm font-medium">
                <Link
                  to="login"
                  className="text-gray-700 hover:text-green-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 bg-gray-100 px-4 pb-4 pt-2">
            {token ? (
              <ul className="flex flex-col gap-1">
                {[
                  "",
                  "cart",
                  "wishlist",
                  "products",
                  "categories",
                  "brands",
                ].map((path) => (
                  <li key={path}>
                    <NavLink
                      to={path}
                      className={mobileNavLinkClass}
                      onClick={() => setIsOpen(false)}
                    >
                      {path === ""
                        ? "Home"
                        : path.charAt(0).toUpperCase() + path.slice(1)}
                    </NavLink>
                  </li>
                ))}

                {/* Social icons in mobile menu */}
                <li className="flex items-center gap-3 px-4 py-3 text-gray-500 text-lg border-t border-gray-200 mt-1">
                  <i className="fab fa-facebook"></i>
                  <i className="fab fa-twitter"></i>
                  <i className="fab fa-linkedin"></i>
                  <i className="fab fa-youtube"></i>
                  <i className="fab fa-instagram"></i>
                  <i className="fab fa-tiktok"></i>
                </li>

                <li>
                  <button
                    onClick={handleSignout}
                    className="w-full text-left py-2.5 px-4 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors"
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            ) : (
              <ul className="flex flex-col gap-1">
                <li>
                  <NavLink
                    to="login"
                    className={mobileNavLinkClass}
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="register"
                    className={mobileNavLinkClass}
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </NavLink>
                </li>
              </ul>
            )}
          </div>
        )}
      </nav>

      {/* Spacer so content doesn't hide under fixed navbar */}
      <div className="h-[57px]"></div>
    </>
  );
}
