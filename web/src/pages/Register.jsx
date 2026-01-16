import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register = () => {
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
        return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'user'
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create a new account" subtitle="Start managing your users today">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        )}
        
        <Input
          id="name"
          type="text"
          label="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="John Doe"
        />

        <Input
          id="email"
          type="email"
          label="Email address"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
          placeholder="your@email.com"
        />

        <Input
          id="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          placeholder="••••••••"
        />

        <Input
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
          placeholder="••••••••"
        />



        <div>
          <Button
            type="submit"
            className="w-full flex justify-center py-2 px-4 shadow-sm"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Already have an account?
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Link to="/login" className="w-full flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 border-gray-300">
             Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
