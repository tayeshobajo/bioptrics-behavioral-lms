'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function ResetPasswordPage({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-4">This password reset link is invalid or has expired.</p>
          <a href="/login" className="text-[#552A47] hover:text-[#552A47]/80">
            Return to Login
          </a>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password');
    const password_confirmation = formData.get('password_confirmation');

    if (password !== password_confirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: params.token,
          email,
          password,
          password_confirmation,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      router.push('/login?reset=success');
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
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#552A47] focus:border-[#552A47] sm:text-sm"
                placeholder="Enter your new password"
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#552A47] focus:border-[#552A47] sm:text-sm"
                placeholder="Confirm your new password"
                minLength={8}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Resetting...' : 'Reset Password'}
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
