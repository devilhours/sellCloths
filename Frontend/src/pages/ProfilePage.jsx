// frontend/src/pages/ProfilePage.jsx
import { useState, useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";

// --- React Icons ---
import { TbLoader2 } from "react-icons/tb";
import { MdOutlineMail, MdPersonOutline, MdCameraAlt, MdDateRange } from "react-icons/md";

const ProfilePage = () => {
  // --- STATE MANAGEMENT ---
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
  });

  // Sync local form state if authUser changes from the store
  useEffect(() => {
    if (authUser) {
      setFormData({ fullName: authUser.fullName });
    }
  }, [authUser]);

  // --- HANDLER FUNCTIONS ---
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      return toast.error("File is too large. Please select an image under 2MB.");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image); // Show preview instantly
      await updateProfile({ profilePic: base64Image });
    };

    reader.onerror = () => {
      toast.error("Failed to read the image file.");
    };
  };

  const handleProfileUpdate = async () => {
    if (!formData.fullName.trim()) {
      return toast.error("Full name cannot be empty.");
    }
    await updateProfile(formData);
    setIsEditing(false); // Exit edit mode on success
  };

  // --- DERIVED STATE & GUARD CLAUSES ---
  const memberSince = authUser?.createdAt 
    ? new Date(authUser.createdAt).toLocaleDateString("en-IN", { // Using 'en-IN' for Indian date format
        year: 'numeric', month: 'long', day: 'numeric'
      }) 
    : "N/A";

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <TbLoader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  // --- JSX ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4 pt-20">
      <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-white mb-1">
          User Profile
        </h1>
        <p className="text-center text-gray-400 mb-6">Manage your account details.</p>
        
        {/* Avatar Upload Section */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative">
            <img
              src={selectedImg || authUser.profilePic || "/avatar.png"}
              alt="Profile Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
            />
            {isUpdatingProfile && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                <TbLoader2 className="w-8 h-8 animate-spin text-emerald-400" />
              </div>
            )}
            <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 bg-emerald-600 p-2 rounded-full cursor-pointer hover:bg-emerald-700 transition-transform duration-200 hover:scale-110">
              <MdCameraAlt className="w-5 h-5 text-white" />
              <input type="file" id="avatar-upload" className="hidden" accept="image/png, image/jpeg" onChange={handleImageUpload} disabled={isUpdatingProfile} />
            </label>
          </div>
        </div>

        {/* User Details Section */}
        <div className="space-y-5">
          {/* Full Name Field */}
          <div>
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <MdPersonOutline /> Full Name
            </label>
            <div className="mt-1">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <div className="p-3 w-full bg-gray-700 border border-gray-600 rounded-md">
                  {authUser.fullName}
                </div>
              )}
            </div>
          </div>

          {/* Email Field (Read-only) */}
          <div>
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><MdOutlineMail /> Email Address</label>
            <div className="mt-1 p-3 w-full bg-gray-700/50 border border-gray-600 rounded-md text-gray-400">{authUser.email}</div>
          </div>

          {/* Member Since Field (Read-only) */}
          <div>
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><MdDateRange /> Member Since</label>
            <div className="mt-1 p-3 w-full bg-gray-700/50 border border-gray-600 rounded-md text-gray-400">{memberSince}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700 text-sm font-semibold">Cancel</button>
              <button onClick={handleProfileUpdate} disabled={isUpdatingProfile} className="px-4 py-2 bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50 text-sm font-semibold">
                {isUpdatingProfile ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 text-sm font-semibold">
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;