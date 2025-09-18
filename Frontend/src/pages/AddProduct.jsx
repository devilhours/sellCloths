// frontend/src/pages/AddProduct.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useProductStore from "../store/useProductStore";

// --- React Icons ---
import { TbLoader2 } from "react-icons/tb";
import {
  MdOutlineTitle,
  MdAttachMoney,
  MdDescription,
  MdImage,
} from "react-icons/md";

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct, isAddingProduct } = useProductStore();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    // The 'ratings' field is removed from the form
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation is updated to no longer check for ratings
    if (!formData.name || !formData.price || !formData.description || !formData.image) {
      return toast.error("Please fill all fields!");
    }

    try {
      await addProduct(formData);
      navigate("/");
    } catch (error) {
      toast.error("Failed to add product. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4 pt-20">
      <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Add a New Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="text-sm font-medium text-gray-400">
              Product Name
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdOutlineTitle className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., Premium Cotton T-Shirt"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-medium text-gray-400">
              Price (₹)
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdAttachMoney className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., 999.00"
              />
            </div>
          </div>
          
          {/* === The "Ratings" input field has been removed === */}

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-400">
              Description
            </label>
            <div className="relative mt-1">
              <MdDescription className="w-5 h-5 text-gray-500 absolute top-3 left-3" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Describe the product details..."
              ></textarea>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="text-sm font-medium text-gray-400">
              Image URL
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdImage className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isAddingProduct}
          >
            {isAddingProduct ? (
              <>
                <TbLoader2 className="w-5 h-5 animate-spin" />
                <span>Adding Product...</span>
              </>
            ) : (
              "Add Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;