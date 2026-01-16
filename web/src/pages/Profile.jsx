import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import api from '../core/api';

// ...
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { success, error: toastError } = useToast();
  // ...
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  // Removed message state
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [myProfile, setMyProfile] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
        setLoading(true); // Start loading for fetchMe
        try {
            const { data } = await api.auth.getMe();
            // Handle wrapper like in AuthContext
            const userObj = data.user || data;
            setMyProfile(userObj);
            // Sync form data
            setProfileData(prev => ({ ...prev, name: userObj.name, email: userObj.email }));
        } catch (error) {
            console.error('Failed to fetch profile', error);
            const errMsg = error.response?.data?.message || 'Failed to load profile data';
            setFetchError(errMsg);
            toastError(errMsg);
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };
    fetchMe();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ensure we have a valid ID from either context user or fetched myProfile
      const activeUser = myProfile || user;
      const userId = activeUser?.id || activeUser?._id;
      
      if (!userId) {
          toastError("User ID missing. Please refresh the page.");
          setLoading(false);
          return;
      }

      // Construct normalized payload with ID
      const payload = {
          ...user,
          ...profileData,
          id: userId,
          _id: userId
      };

      console.log("Updating profile with payload:", payload);
      await updateProfile(payload);

      success('Profile updated successfully');
    } catch (error) {
      toastError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toastError('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      success('Password changed successfully');
      setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      logout();
    } catch (error) {
      toastError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
            <button 
                onClick={() => navigate(-1)} 
                className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
                title="Go Back"
            >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        </div>
        


        <div className="space-y-6">
            {/* My Profile Card - Read Only */}
            <Card>
                <Card.Header>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Card</h3>
                </Card.Header>
                <Card.Body>
                     {myProfile ? (
                         <div className="flex items-center space-x-4">
                             <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-2xl font-bold uppercase">
                                 {myProfile.name?.charAt(0) || 'U'}
                             </div>
                             <div>
                                 <h4 className="text-xl font-bold text-gray-900">{myProfile.name}</h4>
                                 <p className="text-gray-500">{myProfile.email}</p>
                                 <div className="mt-2 flex space-x-2">
                                     <Badge variant="indigo">{myProfile.role}</Badge>
                                     <Badge variant={myProfile.isActive ? 'success' : 'danger'}>
                                         {myProfile.isActive ? 'Active' : 'Inactive'}
                                     </Badge>
                                 </div>
                             </div>
                         </div>
                     ) : (
                         <div className="text-center py-4">
                            {fetchError ? (
                                <p className="text-red-500">Error: {fetchError}</p>
                            ) : (
                                <p className="text-gray-500">Loading profile...</p>
                            )}
                         </div>
                     )}
                </Card.Body>
            </Card>

          <Card>
            <Card.Header>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Update Information</h3>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input
                    id="profile-name"
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                  <Input
                    id="profile-email"
                    label="Email Address"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled 
                  />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>Update Profile</Button>
                </div>
              </form>
            </Card.Body>
          </Card>

          <Card>
             <Card.Header>
                 <h3 className="text-lg leading-6 font-medium text-gray-900">Change Password</h3>
             </Card.Header>
             <Card.Body>
               <form onSubmit={handlePasswordUpdate} className="space-y-4">
                 <Input
                   id="current-password"
                   type="password"
                   label="Current Password"
                   value={passwordData.oldPassword}
                   onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                   required
                 />
                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Input
                        id="new-password"
                        type="password"
                        label="New Password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                    />
                    <Input
                        id="confirm-new-password"
                        type="password"
                        label="Confirm New Password"
                        value={passwordData.confirmNewPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                        required
                    />
                 </div>
                 <div className="flex justify-end">
                     <Button type="submit" variant="secondary" disabled={loading}>Change Password</Button>
                 </div>
               </form>
             </Card.Body>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
