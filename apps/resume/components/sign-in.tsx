type SignInFormProps = {
  header?: string;
  email?: string;
  password?: string;
  onPasswordChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  passwordRef?: React.RefObject<HTMLInputElement>;
  emailRef?: React.RefObject<HTMLInputElement>;
  submitText?: string;
  /**
   * Hides the note "Not a member" note
   */
  hideNote?: boolean;
  /**
   * Hides the forgot password link
   */
  hideForgotPassword?: boolean;
};

export default function SignInForm({
  email,
  header,
  password,
  onPasswordChange,
  onEmailChange,
  onSubmit,
  passwordRef,
  emailRef,
  submitText,
  hideNote,
  hideForgotPassword,
}: SignInFormProps) {
  const handleSubmit = (event: any) => {
    event.preventDefault();
    onSubmit();
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
          <div>
            <label
              htmlFor="signin-email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                ref={emailRef}
                id="signin-email"
                name="signin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={onEmailChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="signin-password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              {!hideForgotPassword && (
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot signin-password?
                  </a>
                </div>
              )}
            </div>
            <div className="mt-2">
              <input
                ref={passwordRef}
                id="signin-password"
                name="signin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={onPasswordChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleSubmit}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {submitText ? submitText : `Sign in`}
            </button>
          </div>
        </form>

        {!hideNote && (
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <a
              href="#"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Start a 14 day free trial
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
