'use client';

import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { auth } from '@/lib/firebase';

export default function FinishLoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Verifying your link, please wait...');

  useEffect(() => {
    const completeSignIn = async () => {
      // 1. Check if the current URL is a valid magic link
      if (isSignInWithEmailLink(auth, window.location.href)) {
        // 2. Get the user's email from browser storage
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          // This can happen if the user opens the link on a different device
          email = window.prompt('Please provide your email for confirmation');
        }

        if (!email) {
          setMessage('Could not complete sign-in. Email is required.');
          return;
        }

        try {
          // 3. Complete the sign-in process
          await signInWithEmailLink(auth, email, window.location.href);

          // 4. Clean up the saved email
          window.localStorage.removeItem('emailForSignIn');

          setMessage('Success! You are now signed in. Redirecting...');

          // 5. Redirect to the home page
          router.push('/');
        } catch (error) {
          console.error(error);
          setMessage('Error signing in. The link may be expired or invalid. Please try again.');
        }
      } else {
        setMessage('This does not appear to be a valid sign-in link.');
      }
    };

    completeSignIn();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center p-8 bg-card rounded-lg shadow-lg">
        <p className="text-lg font-medium text-foreground">{message}</p>
      </div>
    </div>
  );
}
