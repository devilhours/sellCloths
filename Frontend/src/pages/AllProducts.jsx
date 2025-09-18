// frontend/src/pages/AllProducts.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import useProductStore from '../store/useProductStore.js';
import { BsBoxSeam } from "react-icons/bs";

const ProductCardSkeleton = () => (
  <div className="w-full max-w-sm bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden">
    <div className="w-full h-56 bg-gray-700 animate-pulse" />
    <div className="p-5">
      <div className="h-6 w-3/4 bg-gray-700 rounded animate-pulse mb-3" />
      <div className="h-8 w-1/2 bg-gray-700 rounded animate-pulse mb-4" />
      <div className="h-4 w-full bg-gray-700 rounded animate-pulse mb-2" />
      <div className="h-4 w-5/6 bg-gray-700 rounded animate-pulse" />
      <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end gap-2">
        <div className="h-9 w-16 bg-gray-700 rounded-md animate-pulse" />
        <div className="h-9 w-16 bg-gray-700 rounded-md animate-pulse" />
      </div>
    </div>
  </div>
);

const AllProducts = () => {
  const { 
    products,
    fetchProducts, 
    isFetchingProducts, 
    deleteProduct, 
    toggleFavorite,
    authUser
  } = useProductStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  if (isFetchingProducts) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!isFetchingProducts && products?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 bg-gray-800 rounded-lg">
        <BsBoxSeam className="w-16 h-16 text-gray-500 mb-4" />
        <h3 className="text-2xl font-bold text-white">No Products Found</h3>
        <p className="text-gray-400 mt-2 max-w-md">
          {authUser 
            ? "There are no products yet. Why not add the first one?" 
            : "It looks like there are no products available at the moment."
          }
        </p>
        {authUser && (
          <Link 
            to="/addproduct" 
            className="mt-6 bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Add a Product
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {/* ✅ CORRECTED LINE: Added .filter(Boolean) to prevent crashes from bad data */}
      {products?.filter(Boolean).map(product => (
        <ProductCard 
          key={product._id} 
          product={product} 
          onToggleFavorite={toggleFavorite}
          onDelete={deleteProduct}
        />
      ))}
    </div>
  );
};

export default AllProducts;