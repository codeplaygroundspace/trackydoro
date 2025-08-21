'use client';

import { sendSignInLinkToEmail } from 'firebase/auth';
import { useState } from 'react';

import { auth } from '@/lib/firebase';

export function MagicLinkSignIn() {
  const [email, setEmail] = useState('');
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [error, setError] = useState('');

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // This object tells Firebase where to redirect the user after they click the link
    const actionCodeSettings = {
      // IMPORTANT: This is the URL of the page we will create in the *next* step
      url: `${window.location.origin}/finish-login`,
      handleCodeInApp: true, // This must be true for web
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // Save the email to browser storage to use on the redirect page
      window.localStorage.setItem('emailForSignIn', email);
      setIsLinkSent(true);
    } catch (err) {
      console.error(err);
      setError('Failed to send link. Please try again.');
    }
  };

  if (isLinkSent) {
    return (
      <div>
        <h3 className="font-semibold">Check your Email</h3>
        <p className="text-sm text-muted-foreground">
          A sign-in link has been sent to you, check also Spam folder. 🧐
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSendLink} className="flex flex-col gap-2">
      <label htmlFor="email" className="text-sm font-medium">
        Sign in with Email Magic Link
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your-email@example.com"
        required
        className="bg-input px-3 py-2 rounded-md text-sm"
      />
      <button
        type="submit"
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
      >
        Send Magic Link
      </button>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </form>
  );
}
