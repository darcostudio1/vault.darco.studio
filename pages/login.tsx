import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If already authenticated, redirect to home
    if (status === 'authenticated') {
      router.push('/');
    } 
    // Auto-authenticate without requiring credentials
    else if (status === 'unauthenticated') {
      // Automatically sign in with a bypass method
      // This is temporary and should be removed when login is needed again
      router.push('/');
    }
  }, [status, router]);

  // Return a simple loading message instead of the login form
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">DARCO Dev Vault</h1>
          <p className="mt-2 text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    </div>
  );
}