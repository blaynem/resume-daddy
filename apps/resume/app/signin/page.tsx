'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '../../clients/supabase-provider';
import SignInForm from '../../components/sign-in';
import { useRouter } from 'next/navigation';

/**
 * todo: add password reset
 */
export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { supabase, session } = useSupabase();

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  const handleSubmit = async () => {
    const signin = await supabase.auth.signInWithPassword({
      email: email,
      password,
    });
    if (signin.error) {
      // TODO: Handle errors
      return;
    }
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
