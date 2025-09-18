// frontend/src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';

// --- React Icons ---
import { MdOutlinePerson, MdLockOutline, MdDeleteForever } from 'react-icons/md';
import { TbLoader2 } from 'react-icons/tb';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'account':
        return <AccountSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8 pt-24 mt-16">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Account Settings</h1>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* --- Sidebar Navigation --- */}
          <aside className="w-full md:w-1/4 bg-gray-800 p-6 rounded-lg sticky top-24">
            <nav className="space-y-2">
              <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors ${activeTab === 'profile' ? 'bg-emerald-600' : 'hover:bg-gray-700'}`}>
                <MdOutlinePerson /> Profile
              </button>
              <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors ${activeTab === 'security' ? 'bg-emerald-600' : 'hover:bg-gray-700'}`}>
                <MdLockOutline /> Security
              </button>
              <button onClick={() => setActiveTab('account')} className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors ${activeTab === 'account' ? 'bg-emerald-600' : 'hover:bg-gray-700'}`}>
                <MdDeleteForever /> Account
              </button>
            </nav>
          </aside>

          {/* --- Main Content --- */}
          <main className="w-full md:w-3/4 bg-gray-800 p-8 rounded-lg">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for each settings tab ---

const ProfileSettings = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">Public Profile</h2>
    <div className="text-gray-400">
        <p>Your profile is where other users see your information. You can edit your name and profile picture here.</p>
        <Link to="/profile" className="inline-block mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
            Go to Profile Page
        </Link>
    </div>
  </div>
);

const SecuritySettings = () => {
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder logic for changing password
        setIsLoading(true);
        toast.loading("Updating password...");
        setTimeout(() => {
            setIsLoading(false);
            toast.dismiss();
            toast.success("Password updated successfully! (Demo)");
            setPasswords({ currentPassword: '', newPassword: '' });
        }, 1500);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
                <div>
                    <label className="text-sm font-medium text-gray-400">Current Password</label>
                    <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded-md" />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-400">New Password</label>
                    <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded-md" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50">
                    {isLoading ? <TbLoader2 className="animate-spin" /> : 'Update Password'}
                </button>
            </form>
        </div>
    );
};

const AccountSettings = () => {
    const [isLoading, setIsLoading] = useState(false);
    
    const handleDelete = () => {
        if(window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
            // Placeholder logic for account deletion
            setIsLoading(true);
            toast.loading("Deleting account...");
            setTimeout(() => {
                setIsLoading(false);
                toast.dismiss();
                toast.success("Account deleted. (Demo)");
                // Here you would call logout and redirect
            }, 2000);
        }
    };
    
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-4">Delete Account</h2>
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-red-400">Danger Zone</h3>
                <p className="text-red-300/80 mt-2">
                    Once you delete your account, there is no going back. All of your data, including your products and favorites, will be permanently removed. Please be certain.
                </p>
                <button onClick={handleDelete} disabled={isLoading} className="mt-4 flex justify-center items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50">
                    {isLoading ? <TbLoader2 className="animate-spin" /> : 'Delete My Account'}
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;