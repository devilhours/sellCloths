// frontend/src/pages/Favorites.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import useProductStore from "../store/useProductStore.js";
import ProductCard from "../components/ProductCard.jsx";
import { FaRegHeart } from "react-icons/fa"; // Icon for empty state

// Re-using the skeleton loader for a consistent experience
const ProductCardSkeleton = () => (
  <div className="w-full max-w-sm bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden">
    <div className="w-full h-56 bg-gray-700 animate-pulse" />
    <div className="p-5">
      <div className="h-6 w-3/4 bg-gray-700 rounded animate-pulse mb-3" />
      <div className="h-8 w-1/2 bg-gray-700 rounded animate-pulse mb-4" />
      <div className="h-4 w-full bg-gray-700 rounded animate-pulse mb-2" />
      <div className="h-4 w-5/6 bg-gray-700 rounded animate-pulse" />
    </div>
  </div>
);

const Favorites = () => {
  // 1. Get ALL state and actions from the central store
  const { 
    products,
    fetchProducts, 
    isFetchingProducts, 
    deleteProduct, 
    toggleFavorite 
  } = useProductStore();

  // 2. Fetch products on component mount
  useEffect(() => {
    // Only fetch if products aren't already loaded, for efficiency
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  // 3. Filter for favorite products from the global products array
  const favoriteProducts = products.filter((p) => p.isFavorite);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8 pt-24">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">Your Favorites</h1>
          <p className="text-gray-400 mt-2">The products you love, all in one place.</p>
          <div className="w-24 h-1 bg-emerald-500 mx-auto mt-4 rounded" />
        </div>

        {/* Conditional Rendering Logic */}
        {isFetchingProducts ? (
          // --- Loading State ---
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : favoriteProducts.length > 0 ? (
          // --- Success State ---
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onToggleFavorite={toggleFavorite} // Pass store action
                onDelete={deleteProduct}         // Pass store action
              />
            ))}
          </div>
        ) : (
          // --- Empty State ---
          <div className="flex flex-col items-center justify-center text-center py-20 bg-gray-800 rounded-lg">
            <FaRegHeart className="w-16 h-16 text-gray-500 mb-4" />
            <h3 className="text-2xl font-bold text-white">No Favorites Yet</h3>
            <p className="text-gray-400 mt-2 max-w-md">
              Click the heart icon on any product to save it here.
            </p>
            <Link 
              to="/" 
              className="mt-6 bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Explore Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;