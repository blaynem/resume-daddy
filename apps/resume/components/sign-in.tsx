import { Spinner } from '@chakra-ui/react';
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

const buttonClass =
  'flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';

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

    // Users will automatically be created if they don't exist by a trigger in the db.
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
        <div className="space-y-6">
          {otpSent ? (
            <form action="#" method="POST">
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      confirmCode(e);
                    }
                  }}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <button
                disabled={apiLoading}
                onClick={confirmCode}
                className={buttonClass}
              >
                {apiLoading ? <Spinner /> : 'Confirm Code'}
              </button>
            </form>
          ) : (
            <form action="#" method="POST">
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      sendOtpCode(e);
                    }
                  }}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                <button
                  disabled={apiLoading}
                  onClick={sendOtpCode}
                  className={buttonClass}
                >
                  Send OTP Code
                </button>
              </div>
            </form>
          )}
        </div>

        {!hideNote && (
          <p className="mt-10 text-center text-sm text-gray-500">
            <b>Not a member?</b>
            <br />
            {`Enter your email and we'll send you a One Time Password (OTP) to sign in. It's that easy.`}
          </p>
        )}
      </div>
    </div>
  );
}
