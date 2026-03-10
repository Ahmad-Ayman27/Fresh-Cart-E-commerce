import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { authContext } from "../contexts/AuthContextProvider";
import * as Yup from "yup";

export default function Register() {
  const { setToken } = useContext(authContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister(values) {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signup",
        values,
      );
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong.. Try refreshing the page");
    } finally {
      setIsSubmitting(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      rePassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
      phone: Yup.string()
        .matches(/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number")
        .required("Phone is required"),
    }),
    onSubmit: handleRegister,
  });

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl text-sm bg-gray-50 border transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white ${
      formik.touched[field] && formik.errors[field]
        ? "border-red-300 focus:ring-red-100"
        : "border-gray-200 focus:ring-green-100 focus:border-green-400"
    }`;

  const fields = [
    {
      id: "name",
      label: "Full Name",
      type: "text",
      placeholder: "John Doe",
      icon: "fa-user",
    },
    {
      id: "email",
      label: "Email Address",
      type: "email",
      placeholder: "you@example.com",
      icon: "fa-envelope",
    },
    {
      id: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "01XXXXXXXXX",
      icon: "fa-phone",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-user-plus text-green-600 text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
            <p className="text-sm text-gray-500 mt-1">
              Join us and start shopping
            </p>
          </div>

          {/* Error alert */}
          {errorMessage && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
              <i className="fas fa-circle-exclamation flex-shrink-0"></i>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Name, Email, Phone */}
            {fields.map(({ id, label, type, placeholder, icon }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  {label}
                </label>
                <div className="relative">
                  <i
                    className={`fas ${icon} absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm`}
                  ></i>
                  <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    {...formik.getFieldProps(id)}
                    className={`${inputClass(id)} pl-10`}
                  />
                </div>
                {formik.touched[id] && formik.errors[id] && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <i className="fas fa-circle-exclamation text-[10px]"></i>
                    {formik.errors[id]}
                  </p>
                )}
              </div>
            ))}

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <i className="fas fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...formik.getFieldProps("password")}
                  className={`${inputClass("password")} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i
                    className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-sm`}
                  ></i>
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <i className="fas fa-circle-exclamation text-[10px]"></i>
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="rePassword"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <i className="fas fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  id="rePassword"
                  type={showRePassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...formik.getFieldProps("rePassword")}
                  className={`${inputClass("rePassword")} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowRePassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i
                    className={`fas ${showRePassword ? "fa-eye-slash" : "fa-eye"} text-sm`}
                  ></i>
                </button>
              </div>
              {formik.touched.rePassword && formik.errors.rePassword && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <i className="fas fa-circle-exclamation text-[10px]"></i>
                  {formik.errors.rePassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <i className="fas fa-arrow-right text-xs"></i>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
