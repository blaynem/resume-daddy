import { Spinner } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { useSupabase } from '../clients/supabase-provider';

type SignInFormProps = {
  onSignInSuccess?: () => void;
  header?: string;
  /**
   * Hides the note "Not a member" note
   */
  hideNote?: boolean;
  /**
   * Hides the resend OTP link
   */
  hideResendOTP?: boolean;
};

export default function SignInForm({
  header,
  onSignInSuccess,
  hideNote,
  hideResendOTP,
}: SignInFormProps) {
  const { supabase } = useSupabase();
  const [email, setEmail] = React.useState('');
  const [otp, setOTP] = React.useState('');
  const [otpSent, setOtpSent] = React.useState(false);
  const [apiLoading, setApiLoading] = React.useState(false);
  const sendOtpCode = async (event: any) => {
    event.preventDefault();
    if (!email) return;

    setApiLoading(true);
    setOtpSent(true);

    // TODO: We need to handle the case where a user has not signed up yet and attempts to sign in with OTP.
    //       OTP will automatically auth the email, but we won't have the user in the DB since we haven't
    //       collected data. We need to handle this case.
    const signin = await supabase.auth.signInWithOtp({
      email,
    });
    setApiLoading(false);
    if (signin.error) {
      // TODO: Handle errors
      return;
    }
  };
  const confirmCode = async (event: any) => {
    event.preventDefault();
    setApiLoading(true);
    // Verify OTP from email
    const verifiedOtp = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: 'email',
    });

    if (verifiedOtp.error || !verifiedOtp.data.user) {
      // TODO: Handle error
      setApiLoading(false);
      return;
    }

    onSignInSuccess && onSignInSuccess();
  };
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {header ? header : `Sign in to your account`}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST">
          {otpSent ? (
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="signin-otp"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Check email for OTP
                </label>
                {!hideResendOTP && (
                  <div className="text-sm">
                    <button
                      onClick={sendOtpCode}
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Resend OTP?
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <input
                  id="signin-otp"
                  name="signin-otp"
                  type="otp"
                  autoComplete="one-time-code"
                  required
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          ) : (
            <div>
              <label
                htmlFor="signin-email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="signin-email"
                  name="signin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          )}

          <div>
            <button
              disabled={apiLoading}
              onClick={otpSent ? confirmCode : sendOtpCode}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {apiLoading ? (
                <Spinner />
              ) : otpSent ? (
                'Confirm Code'
              ) : (
                `Send OTP Code`
              )}
            </button>
          </div>
        </form>

        {!hideNote && (
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link
              href="/onboarding"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign up here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
