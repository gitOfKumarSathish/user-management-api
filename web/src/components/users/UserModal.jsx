import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

const UserModal = ({ isOpen, onClose, onSubmit, user, loading, canManageRoles }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    isActive: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Don't populate password on edit
        role: user.role || 'user',
        isActive: user.isActive ?? true,
        isEmailVerified: user.isEmailVerified ?? false
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user',
        isActive: true,
        isEmailVerified: false
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = { ...formData };
    if (!canManageRoles) {
        delete submissionData.role;
    }
    onSubmit(submissionData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Edit User' : 'Create User'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          id="email"
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={!!user} // Disable if user exists (Edit mode)
        />
        
        {/* Only show password field in Create mode */}
        {!user && (
            <Input
            id="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            />
        )}
        
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            id="role"
            value={formData.role}
            onChange={handleChange}
            disabled={!canManageRoles}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border disabled:bg-gray-100 disabled:text-gray-500"
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex flex-col space-y-2">
            <div className="flex items-center">
            <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active Account
            </label>
            </div>
            {/* Removed isEmailVerified as requested */}
        </div>

        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:col-start-2"
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="mt-3 w-full sm:mt-0 sm:col-start-1"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;
