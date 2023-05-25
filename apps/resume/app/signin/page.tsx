'use client';

import { useState } from 'react';
import { useSupabase } from '../supabase-provider';
import SignInForm from '../../components/sign-in';
import { useRouter } from 'next/navigation';

/**
 * todo: add password reset
 */
export default function Onboarding() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { supabase } = useSupabase();

  const handleSubmit = async () => {
    const signup = await supabase.auth.signInWithPassword({
      email: email,
      password,
    });
    if (signup.error) {
      // TODO: Handle errors
      console.log('--signup.error', signup.error);
      return;
    }

    setPassword('');
    setEmail('');
    router.push('/dashboard');
  };

  return (
    <>
      <SignInForm
        header="Welcome to Resume Daddy"
        submitText="Log in"
        onSubmit={handleSubmit}
        email={email}
        password={password}
        onEmailChange={(e) => setEmail(e.target.value)}
        onPasswordChange={(e) => setPassword(e.target.value)}
      />
    </>
  );
}
