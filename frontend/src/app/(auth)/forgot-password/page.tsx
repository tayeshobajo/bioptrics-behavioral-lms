'use client';

import { useState } from 'react';
import { API_URL } from '@/lib/config';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-requested-with': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to process request');
      }

      setSuccess('Password reset instructions have been sent to your email.');
      setEmail('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: 'url("https://teamsynergprograms.com/wp-content/uploads/2024/06/bioptrics-register-bg.png")' }}>
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      {/* Logo */}
      <div className="relative z-10 mb-8">
        <img
          src="https://teamsynergprograms.com/wp-content/uploads/2024/06/cropped-TeamSynerG_Global_Consulting_logo_White-04.png"
          alt="TeamSynerG Logo"
          className="h-20 object-contain"
        />
      </div>
      {/* Content container */}
      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg relative z-10">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-[#552A47]">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{success}</div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#552A47] focus:border-[#552A47] sm:text-sm"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>
          </div>

          <div className="text-center">
            <a href="/login" className="text-sm text-[#552A47] hover:text-[#552A47]/80">
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
