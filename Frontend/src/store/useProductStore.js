// frontend/src/store/useProductStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const useProductStore = create((set, get) => ({
  // --- STATE ---
  products: [],
  authUser: null,
  isAddingProduct: false,
  isFetchingProducts: false,
  isUpdatingProduct: false,
  isDeletingProduct: false,
  isTogglingFavorite: false,
  isUpdatingProfile: false, // For profile page updates
  isCheckingAuth: true,

  cart: [],
  isFetchingCart: false,
  isAddingToCart: false, // Tracks loading state for adding items
  isRemovingFromCart: false,

  // --- ACTIONS ---

  // === Authentication Actions ===
  checkAuth: async () => {
    // ... no changes needed here ...

    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);

      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // === Product Actions ===
  addProduct: async (data) => {
    set({ isAddingProduct: true });
    try {
      const res = await axiosInstance.post("/products/addproduct", data);
      // CORRECTED: This now updates the 'products' array, not 'authUser'
      set((state) => ({
        products: [res.data.product, ...state.products],
      }));
      toast.success("Product added successfully");
      return res.data.product; // Return product for potential chaining
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
      throw error; // Re-throw for component-level catch blocks
    } finally {
      set({ isAddingProduct: false });
    }
  },

  fetchProducts: async () => {
    set({ isFetchingProducts: true });
    try {
      const res = await axiosInstance.get("/products/getproducts");
      // Corrected: Filters out any null/undefined entries from the API
      set({ products: res.data.filter(Boolean) });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      set({ isFetchingProducts: false });
    }
  },

  updateProduct: async (productId, data) => {
    set({ isUpdatingProduct: true });
    try {
      const res = await axiosInstance.put(`/products/${productId}`, data);
      set((state) => ({
        products: state.products.map((p) =>
          p._id === productId ? res.data.product : p
        ),
      }));
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      set({ isUpdatingProduct: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isDeletingProduct: true });
    try {
      await axiosInstance.delete(`/products/${id}`);
      set((state) => ({
        products: state.products.filter((product) => product._id !== id),
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      set({ isDeletingProduct: false });
    }
  },

  toggleFavorite: async (id) => {
    const originalProducts = get().products;

    // Optimistic UI update
    set((state) => ({
      products: state.products
        .filter(Boolean)
        .map((product) =>
          product._id === id
            ? { ...product, isFavorite: !product.isFavorite }
            : product
        ),
    }));

    try {
      await axiosInstance.patch(`/products/${id}/favorite`);
      toast.success("Favorite status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update favorite");
      set({ products: originalProducts }); // Revert on failure
    }
  },

  // === Cart Actions ===
  // --- NEW ACTIONS FOR CART ---
  getCart: async () => {
    set({ isFetchingCart: true });
    try {
      const res = await axiosInstance.get("/cart");
      set({ cart: res.data });
    } catch (error) {
      toast.error("Failed to fetch cart items.");
      console.error(error);
    } finally {
      set({ isFetchingCart: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    // To prevent users from adding their own items to the cart
    const { authUser, products } = get();
    const product = products.find((p) => p._id === productId);
    if (authUser?._id === product?.soldBy?._id) {
      return toast.error("You cannot add your own product to the cart.");
    }

    set({ isAddingToCart: true });
    try {
      await axiosInstance.post("/cart/add", { productId, quantity });
      toast.success("Added to cart!");
      get().getCart(); // Refresh the cart state
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add to cart.");
    } finally {
      set({ isAddingToCart: false });
    }
  },

  removeFromCart: async (productId) => {
    set({ isRemovingFromCart: true });
    try {
      await axiosInstance.delete(`/cart/remove/${productId}`);
      // Optimistically remove from UI
      set((state) => ({
        cart: state.cart.filter((item) => item.productId?._id !== productId),
      }));
      toast.success("Removed from cart.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not remove from cart."
      );
    } finally {
      set({ isRemovingFromCart: false });
    }
  },

  updateCartQuantity: async (productId, quantity) => {
    // Optimistic UI update
    set((state) => ({
      cart: state.cart.map(item => 
        item.productId?._id === productId ? { ...item, quantity: quantity } : item
      )
    }));
    try {
      await axiosInstance.patch("/cart/update", { productId, quantity });
      // No toast needed for quantity change to avoid being spammy
    } catch (error) {
      toast.error("Failed to update quantity.");
      console.error("Error updating cart quantity:", error);
      // Re-fetch cart on error to ensure consistency
      get().getCart();
    }
  },
}));

export default useProductStore;
