// frontend/src/store/useAuthStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const useAuthStore = create((set) => ({
  // --- STATE ---
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false, // Added for completeness
  isUpdatingProfile: false,
  isCheckingAuth: true,

  // --- ACTIONS ---

  checkAuth: async () => {
    set({ isCheckingAuth: true });
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

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      // CORRECTED: Safely handle errors
      toast.error(
        error.response?.data?.message || "An unexpected error occurred during signup."
      );
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      // CORRECTED: Safely handle errors
      toast.error(
        error.response?.data?.message || "An unexpected error occurred during login."
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true }); // Use the new loading state
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      // CORRECTED: Safely handle errors
      toast.error(
        error.response?.data?.message || "Logout failed. Please try again."
      );
    } finally {
        set({ isLoggingOut: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      // CORRECTED: More robust state update
      set({ authUser: res.data.user || res.data }); 
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      // CORRECTED: Safely handle errors
      toast.error(
        error.response?.data?.message || "Failed to update profile."
      );
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  toggleFavorite: async (productId) => {
    try {
      // Optimistically update the UI
      set((state) => {
        const isFavorited = state.authUser.favorites.includes(productId);
        const updatedFavorites = isFavorited
          ? state.authUser.favorites.filter((favId) => favId !== productId)
          : [...state.authUser.favorites, productId];
        
        return {
          authUser: { ...state.authUser, favorites: updatedFavorites },
        };
      });

      // Send request to the server
      await axiosInstance.post(`/auth/favorite/${productId}`);
      // No need to set state again, the optimistic update is enough
    } catch (error) {
      toast.error("Failed to update favorites.");
      console.error("Error in toggleFavorite:", error);
      // Here you could add logic to revert the optimistic update if needed
    }
  },
}));

export default useAuthStore;