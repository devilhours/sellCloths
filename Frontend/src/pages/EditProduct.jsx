// frontend/src/pages/EditProduct.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from "react-hot-toast";
import useProductStore from '../store/useProductStore';
import { axiosInstance } from '../lib/axios';

// --- React Icons ---
import { TbLoader2 } from "react-icons/tb";
import { MdOutlineTitle, MdAttachMoney, MdStarOutline, MdDescription, MdImage } from "react-icons/md";

const EditProduct = () => {
  const navigate = useNavigate();
  // CORRECTED: The route parameter is 'productId', not 'id'
  const { productId } = useParams(); 
  
  const { updateProduct, isUpdatingProduct } = useProductStore();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    ratings: '',
    description: '',
    image: '',
  });
  const [isLoading, setIsLoading] = useState(true); // State for initial data fetch

  // Fetch product data when the component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        // CORRECTED: Use the dynamic productId in the API call
        const response = await axiosInstance.get(`/products/${productId}`);
        setFormData(response.data);
      } catch (error) {
        toast.error('Could not fetch product details.');
        console.error(error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // CORRECTED: Use the updateProduct action from the store
      await updateProduct(productId, formData);
      navigate('/'); // Redirect after successful update
    } catch (error) {
      // The store already shows a toast, but this is a safeguard
      console.error(error);
    }
  };

  // Show a full-page loader while fetching product details
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <TbLoader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4 pt-20">
      <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="text-sm font-medium text-gray-400">Product Name</label>
            <div className="relative mt-1">
              <MdOutlineTitle className="w-5 h-5 text-gray-500 absolute top-3 left-3" />
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Price */}
            <div>
              <label className="text-sm font-medium text-gray-400">Price (₹)</label>
              <div className="relative mt-1">
                <MdAttachMoney className="w-5 h-5 text-gray-500 absolute top-3 left-3" />
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
            </div>
            {/* Ratings */}
            <div>
              <label className="text-sm font-medium text-gray-400">Ratings (0-5)</label>
              <div className="relative mt-1">
                <MdStarOutline className="w-5 h-5 text-gray-500 absolute top-3 left-3" />
                <input type="number" name="ratings" min="0" max="5" step="0.1" value={formData.ratings} onChange={handleChange} className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-400">Description</label>
            <div className="relative mt-1">
              <MdDescription className="w-5 h-5 text-gray-500 absolute top-3 left-3" />
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500"></textarea>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="text-sm font-medium text-gray-400">Image URL</label>
            <div className="relative mt-1">
              <MdImage className="w-5 h-5 text-gray-500 absolute top-3 left-3" />
              <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
          </div>
          
          {/* Submit Button */}
          <button type="submit" className="w-full flex justify-center items-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isUpdatingProduct}>
            {isUpdatingProduct ? (
              <>
                <TbLoader2 className="w-5 h-5 animate-spin" />
                <span>Updating Product...</span>
              </>
            ) : (
              "Update Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;