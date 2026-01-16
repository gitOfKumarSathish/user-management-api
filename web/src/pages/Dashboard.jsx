import React, { useState, useEffect } from 'react';
import api from '../core/api';
import DashboardLayout from '../layouts/DashboardLayout';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import UserModal from '../components/users/UserModal';
import DeleteConfirmationModal from '../components/users/DeleteConfirmationModal';
import { Edit2, Plus, Loader, ChevronLeft, ChevronRight, Ban, CheckCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const { user: currentUser } = useAuth();
  const { success, error: toastError } = useToast();
  const [users, setUsers] = useState([]);
  // ... (rest of state stays same)

  // ... (headers and logic stays same)

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ... fetchUsers ...

  // Use fetchUsers directly in useEffect, no changes needed there

  const handleDeactivate = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;
    
    setActionLoading(true);
    try {
        await api.user.deactivate(userId);
        fetchUsers(pagination.page);
        success('User deactivated successfully');
    } catch (error) {
        console.error('Deactivation failed', error);
        toastError(error.response?.data?.message || 'Deactivation failed');
    } finally {
        setActionLoading(false);
    }
  };

  const handleActivate = async (userId) => {
    if (!window.confirm('Are you sure you want to activate this user?')) return;
    
    setActionLoading(true);
    try {
        await api.user.activate(userId);
        fetchUsers(pagination.page);
        success('User activated successfully');
    } catch (error) {
        console.error('Activation failed', error);
        toastError(error.response?.data?.message || 'Activation failed');
    } finally {
        setActionLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    // PROTECT LOGGED IN USER (Self-Delete)
    if (currentUser && (currentUser._id === (user._id || user.id) || currentUser.email === user.email)) {
        toastError("You cannot delete your own account.");
        return;
    }
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async (userId) => {
    setActionLoading(true);
    try {
        await api.user.delete(userId);
        setDeleteModalOpen(false);
        fetchUsers(pagination.page);
        success('User deleted successfully');
    } catch (error) {
        console.error('Delete failed', error);
        toastError(error.response?.data?.message || 'Delete failed');
    } finally {
        setActionLoading(false);
    }
  };

  // ... other handlers ...

  // Inside return statement
  // ...

  // ...


  // Fetch users with pagination
  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.user.getAll(page, pagination.limit);
      
      // Handle the specific paginated structure: { items, page, limit, total, totalPages }
      if (data && data.items) {
        setUsers(data.items);
        setPagination(prev => ({
            ...prev,
            page: data.page,
            total: data.total,
            totalPages: data.totalPages
        }));
      } else if (Array.isArray(data)) {
        // Fallback for flat array if API changes back
        setUsers(data);
      } else {
         setUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.page);
  }, []); // Only run on mount, manual page changes call fetchUsers directly

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
        fetchUsers(newPage);
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };



  const handleSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (selectedUser) {
        await api.user.update(selectedUser._id || selectedUser.id, formData);
      } else {
        await api.auth.register(formData);
      }
      setModalOpen(false);
      fetchUsers(pagination.page);
      success(selectedUser ? 'User updated successfully' : 'User created successfully');
    } catch (error) {
      console.error('Operation failed', error);
      toastError(error.response?.data?.message || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        {currentUser?.role === 'admin' && (
            <Button onClick={handleCreate} className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add User
            </Button>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200 flex flex-col justify-between h-full">
        {loading ? (
             <div className="p-10 flex justify-center">
                 <Loader className="animate-spin w-8 h-8 text-indigo-600" />
             </div>
        ) : (
            <>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                    <tr key={user._id || user.id || user.email} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={user.role === 'admin' ? 'indigo' : user.role === 'manager' ? 'info' : 'default'}>
                                {user.role}
                            </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={user.isActive ? 'success' : 'danger'}>
                                {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {currentUser && (currentUser._id === (user._id || user.id) || currentUser.email === user.email) ? (
                                <span className="inline-block text-gray-300 mr-4 cursor-not-allowed" title="You cannot deactivate yourself">
                                    <Ban className="w-4 h-4" />
                                </span>
                            ) : (
                                ['admin', 'manager'].includes(currentUser?.role) ? (
                                    user.isActive ? (
                                        <button 
                                            onClick={() => handleDeactivate(user._id || user.id)} 
                                            className="text-red-600 hover:text-red-900 mr-4"
                                            title="Deactivate User"
                                        >
                                            <Ban className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleActivate(user._id || user.id)} 
                                            className="text-green-600 hover:text-green-900 mr-4"
                                            title="Activate User"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                    )
                                ) : null
                            )}
                            {currentUser && (currentUser._id === (user._id || user.id) || currentUser.email === user.email) ? (
                                <span className="inline-block text-gray-300 mr-4 cursor-not-allowed" title="You cannot delete yourself">
                                    <Trash2 className="w-4 h-4" />
                                </span>
                            ) : (
                                ['admin', 'manager'].includes(currentUser?.role) ? (
                                    <button onClick={() => handleDeleteClick(user)} className="text-red-500 hover:text-red-700 mr-4" title="Delete User">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                ) : null
                            )}  
                            {['admin', 'manager'].includes(currentUser?.role) ? (
                                <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            ) : null}
                        </td>
                    </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                No users found. Start by adding one.
                            </td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <Button
                            variant="secondary"
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                        >
                            Next
                        </Button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
            </>
        )}
      </div>

      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        user={selectedUser}
        loading={actionLoading}
        canManageRoles={['admin', 'manager'].includes(currentUser?.role)}
      />
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        user={userToDelete}
        loading={actionLoading}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
