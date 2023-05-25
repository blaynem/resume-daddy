'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ConfirmEmailPostResponse } from '../../api/user/onboarding/confirm/route';
import { AbsoluteCenter, Box, Spinner } from '@chakra-ui/react';
import { useSupabase } from '../../supabase-provider';

export type ConfirmEmailPostBody = {
  signupId: string;
  email: string;
};
export default function ConfirmEmail() {
  const [hasFired, setHasFired] = useState(false);
  const router = useRouter();
  // const router = { push: (thing: any) => console.log(thing) };
  const searchParams = useSearchParams();
  const supabase = useSupabase();

  useEffect(() => {
    const confirmEmail = async (id: string | null, email: string) => {
      try {
        if (!id || !email) {
          throw new Error('Missing id or email');
        }

        const bodyData: ConfirmEmailPostBody = {
          signupId: id,
          email: email,
        };
        const data = (await fetch('/api/user/onboarding/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyData),
        }).then((res) => res.json())) as ConfirmEmailPostResponse;

        if (data.error) {
          throw new Error(data.error);
        }
        return router.push('/dashboard');
      } catch (err) {
        return router.push('/');
      }
    };

    if (supabase.session?.user?.email && !hasFired) {
      const email = supabase.session?.user?.email;
      const id = searchParams.get('id');
      confirmEmail(id, email);
      setHasFired(true);
    }
  }, [router, searchParams, supabase.session?.user?.email, hasFired]);

  return (
    <Box position="relative" height="60vh">
      <AbsoluteCenter axis="both">
        <Spinner h={24} w={24} />
      </AbsoluteCenter>
    </Box>
  );
}
