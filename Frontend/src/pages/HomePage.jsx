// src/pages/HomePage.jsx
import React, { useRef } from "react";
import AllProducts from "./AllProducts.jsx";

// --- Icons for new section ---
import { FaArrowDown, FaShippingFast, FaShieldAlt, FaTags } from "react-icons/fa";

const HomePage = () => {
  const productsRef = useRef(null);

  const handleScrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    // The main container no longer needs top padding, as the hero will handle it
    <div className="bg-gray-900 text-white min-h-screen">
      
      {/* === Hero Section (Now more compact) === */}
      <section
        className="h-[60vh] md:h-[70vh] w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8')",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        {/* The pt-24 pushes content below the fixed navbar */}
        <div className="relative z-10 text-center p-6 space-y-4 pt-24">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Discover Your Signature Style
          </h1>
          <p className="max-w-xl mx-auto text-gray-300 text-lg">
            Explore our latest collection of premium quality apparel.
          </p>
          <button
            onClick={handleScrollToProducts}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-transform duration-300 hover:scale-105 shadow-lg"
          >
            Shop Collection <FaArrowDown className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* === NEW: Features Section === */}
      <section className="bg-gray-800 py-16">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-2">Why Choose Us?</h2>
            <p className="text-gray-400 mb-10">The best place to buy and sell unique apparel.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-gray-900 p-8 rounded-lg">
                    <FaTags className="text-emerald-400 text-4xl mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Quality Products</h3>
                    <p className="text-gray-400">Discover curated items from verified sellers across the country.</p>
                </div>
                {/* Feature 2 */}
                <div className="bg-gray-900 p-8 rounded-lg">
                    <FaShippingFast className="text-emerald-400 text-4xl mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Fast Shipping</h3>
                    <p className="text-gray-400">Get your new favorite items delivered to your doorstep quickly and reliably.</p>
                </div>
                {/* Feature 3 */}
                <div className="bg-gray-900 p-8 rounded-lg">
                    <FaShieldAlt className="text-emerald-400 text-4xl mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
                    <p className="text-gray-400">Shop with confidence using our secure and encrypted payment gateway.</p>
                </div>
            </div>
        </div>
      </section>

      {/* === Products Section === */}
      <section ref={productsRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white">Our Collection</h2>
            <div className="w-24 h-1 bg-emerald-500 mx-auto mt-4 rounded" />
          </div>
          <AllProducts />
        </div>
      </section>
    </div>
  );
};

export default HomePage;