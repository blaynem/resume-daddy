'use client';

import SignInForm from '../../components/sign-in';
import { useRouter } from 'next/navigation';

/**
 * todo: add password reset
 */
export default function Signin() {
  const router = useRouter();

  return (
    <>
      <SignInForm
        header="Welcome to Resume Daddy"
        onSignInSuccess={() => router.push('/dashboard')}
      />
    </>
  );
}
