import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiSave, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, login } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    // Profile form
    const [profileData, setProfileData] = useState({ name: '', email: '' });
    const [savingProfile, setSavingProfile] = useState(false);

    // Password form
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await authService.getProfile();
                const userData = response.data.data;
                setProfileData({
                    name: userData.name || '',
                    email: userData.email || '',
                });
            } catch (error) {
                // Use local data
                setProfileData({
                    name: user?.name || '',
                    email: '',
                });
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            const response = await authService.updateProfile(profileData);
            const updatedUser = response.data.data;

            // Update localStorage
            localStorage.setItem('user', JSON.stringify({
                id: updatedUser.id,
                name: updatedUser.name,
            }));

            toast.success('Profile updated successfully!');
            // Reload to update navbar
            window.location.reload();
        } catch (error) {
            const errors = error.response?.data?.errors;
            if (errors) {
                Object.values(errors).flat().forEach(msg => toast.error(msg));
            } else {
                toast.error(error.response?.data?.message || 'Failed to update profile');
            }
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordData.new_password !== passwordData.new_password_confirmation) {
            toast.error("Passwords don't match");
            return;
        }

        setSavingPassword(true);
        try {
            await authService.changePassword(passwordData);
            toast.success('Password changed successfully!');
            setPasswordData({
                current_password: '',
                new_password: '',
                new_password_confirmation: '',
            });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to change password';
            toast.error(message);
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-5"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200">
                            <span className="text-white text-2xl font-bold">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div>
                            <h1 className="font-display text-2xl font-bold text-gray-900">{user?.name}</h1>
                            <p className="text-gray-500 text-sm">Manage your account settings</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <div className="md:w-56 flex-shrink-0">
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-24">
                            {[
                                { id: 'profile', label: 'Profile', icon: FiUser },
                                { id: 'password', label: 'Password', icon: FiLock },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-primary-50 text-primary-600 border-l-2 border-primary-600'
                                            : 'text-gray-600 hover:bg-gray-50 border-l-2 border-transparent'
                                    }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                                            <FiUser className="text-primary-600" />
                                        </div>
                                        <div>
                                            <h2 className="font-display text-xl font-bold text-gray-900">Profile Information</h2>
                                            <p className="text-gray-500 text-sm">Update your name and email address</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                            <div className="relative group">
                                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                    required
                                                    className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-gray-50 focus:bg-white transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                            <div className="relative group">
                                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                    required
                                                    className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-gray-50 focus:bg-white transition-all"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={savingProfile}
                                            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-200 disabled:opacity-50"
                                        >
                                            {savingProfile ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <FiSave size={16} />
                                            )}
                                            {savingProfile ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {/* Password Tab */}
                        {activeTab === 'password' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                                            <FiShield className="text-red-600" />
                                        </div>
                                        <div>
                                            <h2 className="font-display text-xl font-bold text-gray-900">Change Password</h2>
                                            <p className="text-gray-500 text-sm">Update your password to keep your account secure</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleChangePassword} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                                            <div className="relative group">
                                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                                <input
                                                    type="password"
                                                    value={passwordData.current_password}
                                                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                                    placeholder="Enter current password"
                                                    required
                                                    className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-gray-50 focus:bg-white transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                            <div className="relative group">
                                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                                <input
                                                    type="password"
                                                    value={passwordData.new_password}
                                                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                                    placeholder="Min 8 characters"
                                                    required
                                                    className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-gray-50 focus:bg-white transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                            <div className="relative group">
                                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                                <input
                                                    type="password"
                                                    value={passwordData.new_password_confirmation}
                                                    onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                                                    placeholder="Repeat new password"
                                                    required
                                                    className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-gray-50 focus:bg-white transition-all"
                                                />
                                            </div>
                                            {passwordData.new_password && passwordData.new_password_confirmation &&
                                                passwordData.new_password !== passwordData.new_password_confirmation && (
                                                <p className="text-xs text-red-500 mt-1.5">⚠ Passwords don't match</p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={savingPassword}
                                            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-200 disabled:opacity-50"
                                        >
                                            {savingPassword ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <FiShield size={16} />
                                            )}
                                            {savingPassword ? 'Changing...' : 'Change Password'}
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;