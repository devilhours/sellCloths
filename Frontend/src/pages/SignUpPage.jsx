// src/pages/SignUpPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";

// --- React Icons ---
import { TbLoader2 } from "react-icons/tb";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { MdOutlineMail, MdLockOutline, MdPersonOutline } from "react-icons/md";
import { GiClothes } from "react-icons/gi"; // Re-using the brand icon

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password) {
      return toast.error("All fields are required");
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    // The signup function should ideally handle the API call and any further validation/toasts
    signup(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="flex w-full max-w-4xl mx-auto overflow-hidden bg-gray-800 rounded-lg shadow-lg">
        
        {/* === Left Side - Branding & Illustration === */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gray-800 p-8 text-center border-r border-gray-700">
           <div className="bg-emerald-500/20 p-4 rounded-full mb-4">
             <GiClothes className="h-16 w-16 text-emerald-400" />
           </div>
           <h1 className="text-3xl font-bold text-white">Welcome to SellCloths</h1>
           <p className="mt-2 text-gray-400">
             Create an account to start selling and discovering unique apparel.
           </p>
        </div>

        {/* === Right Side - Form === */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center text-white mb-6">Create Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label className="text-sm font-medium text-gray-400">Full Name</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdPersonOutline className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="text-sm font-medium text-gray-400">Email Address</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdOutlineMail className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="text-sm font-medium text-gray-400">Password</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdLockOutline className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeOffSharp className="w-5 h-5" /> : <IoEyeSharp className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <TbLoader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-emerald-400 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;