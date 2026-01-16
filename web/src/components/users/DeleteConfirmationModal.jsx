import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, user, loading }) => {
  const [confirmationName, setConfirmationName] = useState('');
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setConfirmationName('');
      setCanDelete(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (user && confirmationName === user.name) {
      setCanDelete(true);
    } else {
      setCanDelete(false);
    }
  }, [confirmationName, user]);

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center text-red-600">
          <AlertTriangle className="w-6 h-6 mr-2" />
          Delete User
        </span>
      }
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          Are you ok to delete the user with his name <span className="font-bold text-gray-900">{user.name}</span>?
        </p>
        <p className="text-sm text-gray-500">
            This action cannot be undone. To confirm, please type the user's name below.
        </p>

        <Input
          id="confirmationName"
          label={`Type "${user.name}" to confirm`}
          value={confirmationName}
          onChange={(e) => setConfirmationName(e.target.value)}
          placeholder={user.name}
          className="border-red-300 focus:border-red-500 focus:ring-red-500"
        />

        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
          <Button
            type="button"
            variant="danger"
            disabled={!canDelete || loading}
            className="w-full sm:col-start-2"
            onClick={() => onConfirm(user._id || user.id)}
          >
            {loading ? 'Deleting...' : 'Delete User'}
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
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
