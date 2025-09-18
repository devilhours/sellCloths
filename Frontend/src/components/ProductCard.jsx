// frontend/src/components/ProductCard.jsx
import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import useProductStore from "../store/useProductStore";
import useAuthStore from "../store/useAuthStore"; // CORRECTED: Import useAuthStore

const ProductCard = ({ product }) => { // CORRECTED: Removed unnecessary props
  const { _id, name, price, ratings, description, image, soldBy } = product;

  // CORRECTED: Get actions and state from their respective stores
  const { authUser, toggleFavorite } = useAuthStore();
  const { addToCart, isAddingToCart, deleteProduct } = useProductStore();

  const descriptionSnippet =
    description.length > 100
      ? `${description.substring(0, 100)}...`
      : description;

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
  
  // CORRECTED: Logic for determining owner and favorite status
  const isOwner = authUser?._id === soldBy?._id;
  const isFavorited = authUser?.favorites?.includes(_id);

  return (
    <div className="group w-full max-w-sm bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden flex flex-col">
      <div className="relative">
        <img
          src={image || "https://via.placeholder.com/400"}
          alt={name}
          className="w-full h-56 object-cover"
        />
        <button
          onClick={() => toggleFavorite(_id)}
          disabled={!authUser}
          // CORRECTED: Removed "..." syntax error and added isFavorited logic
          className={`absolute top-3 right-3 p-2 rounded-full bg-gray-900/50 backdrop-blur-sm transition-colors text-xl disabled:cursor-not-allowed disabled:text-gray-600 ${
            isFavorited ? "text-red-500" : "text-gray-400 hover:text-red-500"
          }`}
        >
          <FaHeart />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <p className="text-xs text-gray-500 mb-1">
          Sold by{" "}
          <span className="font-semibold text-gray-400">
            {soldBy?.fullName || "Unknown"}
          </span>
        </p>
        <h3 className="text-lg font-bold text-white truncate" title={name}>
          {name}
        </h3>
        
        <div className="flex items-center justify-between mt-2 mb-4">
          <p className="text-xl font-extrabold text-emerald-400">
            {formattedPrice}
          </p>
          {/* ADDED: Ratings display */}
          <div className="flex items-center text-yellow-400">
            {'★'.repeat(Math.round(ratings))}
            {'☆'.repeat(5 - Math.round(ratings))}
            <span className="text-xs text-gray-400 ml-2">({ratings})</span>
          </div>
        </div>

        <p className="text-sm text-gray-400 flex-grow mb-4">
          {descriptionSnippet}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-700 flex items-center justify-between">
          <button
            onClick={() => addToCart(_id)}
            disabled={!authUser || isOwner || isAddingToCart}
            className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-semibold shadow disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <FaShoppingCart />
            <span>{isAddingToCart ? "Adding..." : "Add to Cart"}</span>
          </button>

          {isOwner && (
            <div className="flex space-x-2">
              <Link
                to={`/edit/${_id}`}
                // CORRECTED: Changed button color for consistency
                className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 text-sm font-semibold"
              >
                Edit
              </Link>
              <button
                // CORRECTED: Using deleteProduct action from the store
                onClick={() => deleteProduct(_id)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;