import { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import { useToast } from '../components/Toast';
import { getProfileImage } from '../utils/profileImage';
import { FiUser, FiMail, FiPhone, FiShield, FiLock, FiEdit, FiSave, FiUpload } from 'react-icons/fi';
import httpClient from '../api/httpClient';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageKey, setImageKey] = useState(0);
  const fileInputRef = useRef(null);
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await userApi.getById(user.id);
      const fetchedUser = response.data.data;
      setUserData(fetchedUser);
      setFormData({
        name: fetchedUser.name || '',
        email: fetchedUser.email || '',
        phone: fetchedUser.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (saving) return;

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await userApi.update(user.id, updateData);
      const updatedUser = response.data.data;
      
      setUserData(updatedUser);
      setEditing(false);
      
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
      
      toast.success('Profile updated successfully');
      
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await httpClient.post('/users/upload-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedUser = response.data.data;
      setUserData(updatedUser);
      setImageKey(prev => prev + 1);
      
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
      
      toast.success('Profile image uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    if (user?.id && !userData) {
      fetchUserData();
    }
  }, [user?.id]);

  useEffect(() => {
    const handleUserUpdate = (event) => {
      if (event.detail && event.detail.id === user?.id && !editing) {
        fetchUserData();
      }
    };

    window.addEventListener('userUpdated', handleUserUpdate);
    return () => window.removeEventListener('userUpdated', handleUserUpdate);
  }, [user?.id, editing]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <FiUser className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Manage your account information and preferences</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-600">
            <div className="relative">
              <img
                src={(() => {
                  const profileImg = userData?.profile_image || user?.profile_image;
                  if (profileImg) {
                    if (profileImg.startsWith('http')) {
                      return profileImg;
                    }
                    if (profileImg.startsWith('/assets')) {
                      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                      return `${apiUrl}${profileImg}?v=${imageKey}`;
                    }
                    return `${profileImg}?v=${imageKey}`;
                  }
                  return getProfileImage(userData || user, user?.id);
                })()}
                alt={userData?.name || user?.name || 'Profile'}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-200 dark:border-blue-500 shadow-lg"
                key={`profile-img-${userData?.id || user?.id}-${imageKey}`}
                onError={(e) => {
                  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || user?.name || 'User')}&background=3b82f6&color=fff&size=128`;
                  if (!e.target.src.includes('ui-avatars.com')) {
                    e.target.src = fallbackUrl;
                  }
                }}
              />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="profile-image-upload"
                disabled={uploadingImage}
              />
              <label
                htmlFor="profile-image-upload"
                className={`absolute bottom-0 right-0 w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Upload Profile Image"
              >
                {uploadingImage ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <FiUpload className="text-white text-sm" />
                )}
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{userData?.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">{userData?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                {userData?.role}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mb-6">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <FiEdit />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setEditing(false);
                    fetchUserData();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiSave />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center space-x-2">
                  <FiUser />
                  <span>Full Name</span>
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white transition-all duration-300"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">{userData?.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center space-x-2">
                  <FiMail />
                  <span>Email</span>
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white transition-all duration-300"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">{userData?.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center space-x-2">
                  <FiPhone />
                  <span>Phone</span>
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white transition-all duration-300"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">{userData?.phone || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center space-x-2">
                  <FiShield />
                  <span>Role</span>
                </label>
                <p className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {userData?.role}
                  </span>
                </p>
              </div>
            </div>

            {editing && (
              <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mt-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center space-x-2">
                  <FiLock />
                  <span>Change Password</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white transition-all duration-300"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">New Password</label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white transition-all duration-300"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white transition-all duration-300"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Leave password fields empty to keep current password</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
