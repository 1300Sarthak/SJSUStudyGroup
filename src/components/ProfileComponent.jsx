import React, { useState } from 'react';
import { Camera, User, Mail, Key, Edit3 } from 'lucide-react';

class ProfileComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      profileImage: null,
      profileData: {
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        bio: '',
      }
    };
  }

  handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({ profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      profileData: {
        ...prevState.profileData,
        [name]: value
      }
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ isEditing: false });
    // Here you would typically send the data to your backend
  };

  render() {
    const { isEditing, profileImage, profileData } = this.state;

    return (
      <div className="bg-white rounded-lg shadow-sm">
        <form onSubmit={this.handleSubmit} className="p-6">
          {/* Profile Image Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-500 transition-colors">
                <Camera size={20} className="text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={this.handleProfileImageUpload}
                  disabled={!isEditing}
                />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Username & Password */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={this.handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter username"
                    disabled={!isEditing}
                  />
                  <User className="absolute right-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={profileData.password}
                    onChange={this.handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter password"
                    disabled={!isEditing}
                  />
                  <Key className="absolute right-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={this.handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter first name"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={this.handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter last name"
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={this.handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email"
                  disabled={!isEditing}
                />
                <Mail className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <div className="relative">
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={this.handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                  placeholder="Tell us about yourself..."
                  disabled={!isEditing}
                />
                <Edit3 className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => this.setState({ isEditing: false })}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => this.setState({ isEditing: true })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }
}

export default ProfileComponent;
