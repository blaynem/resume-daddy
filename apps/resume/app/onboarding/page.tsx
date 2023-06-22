'use client';

import { useEffect, useRef, useState } from 'react';
import JobDetails from './job-details';
import Modal from '../../wrappers/modal';
import { Spinner, useDisclosure } from '@chakra-ui/react';
import { useSupabase } from '../../clients/supabase-provider';
import {
  FormState,
  JobDetailsType,
  OnboardingSubmit,
  OnboardingSubmitResponse,
} from '@libs/types';
import { useRouter } from 'next/navigation';

const initialFormState: FormState = {
  firstName: '',
  lastName: '',
  email: '',
};
const templateJobDetails: JobDetailsType = {
  jobTitle: '',
  companyName: '',
  summary: '',
  experiences: '',
  skills: '',
};

// SIGN UP PLAN
// - User fills out entire sheet of information.
// - User clicks 'submit"
// - We open a modal that says "in order to submit you must sign up for a free account",
//   we give them an email (already filled out since we got it earlier), password field and a submit button.
// - Once they click submit we shoot off the email, as well as create the user in the db.
// - We then tell them to check their email for a verification link.
// - Once they click the link we log them in and send them to the /welcome page.
export default function Onboarding() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const { isOpen, onOpen: openModal, onClose } = useDisclosure();
  const initialRef = useRef<HTMLInputElement>(null);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [otp, setOtp] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [allJobDetails, setAllJobDetails] = useState<JobDetailsType[]>([]);

  useEffect(() => {
    setAllJobDetails([templateJobDetails]);
  }, []);

  const onLinkedinImport = async (e: any) => {
    e?.preventDefault();
    // TODO: Validate form and show errors before opening modal
    openModal();
    console.log('--onLinkedinImport');
    return;
  };

  const handleNext = async (e: any) => {
    e.preventDefault();
    // TODO: require email to be filled out
    // TODO: Validate form and show errors before opening modal?
    // Only fire once
    if (apiLoading || isOpen) return;
    setApiLoading(true);

    // Fire off the email sign up
    await supabase.auth.signInWithOtp({
      email: formState.email,
    });
    setApiLoading(false);
    openModal();
  };

  /**
   * `next` - signs in with OTP - which sends a OTP email to email.
   * `signInWithOtp`
   * We need to alter this form to instead have `next` send off the OTP email.
   * Then we need to have a modal that pops up and asks for the OTP code.
   *
   * `opened modal` - asks for OTP code
   * `verifyOtp`
   * Once the user enters the OTP code we can send off the form data to the backend.
   * Send the returned auth to onboarding api
   * -- We skip the entire signup db table process nonsense
   * -- in the backend we can check if user has an id on the request via supabase headers, they should since verifyOtp is called
   * -- We can then create the user via serverless fn
   *
   * We then push them to /dashboard
   */
  const handleConfirm = async () => {
    if (apiLoading || !otp) return;

    setApiLoading(true);
    // Verify OTP from email
    const verifiedOtp = await supabase.auth.verifyOtp({
      email: formState.email,
      token: otp,
      type: 'email',
    });

    if (verifiedOtp.error || !verifiedOtp.data.user) {
      // TODO: Handle error
      setApiLoading(false);
      return;
    }

    const submitState: OnboardingSubmit = {
      ...formState,
      jobs: allJobDetails,
      signupId: verifiedOtp.data.user.id,
    };
    // Submit the onboarding form to backend
    const submittedRes: OnboardingSubmitResponse = await fetch(
      '/api/user/onboarding',
      {
        method: 'POST',
        body: JSON.stringify(submitState),
      }
    ).then((res) => res.json());

    if (submittedRes.error || !submittedRes.id) {
      // todo: Handle error
      console.error('---submittedRes', submittedRes);
      setApiLoading(false);
      return;
    }

    // User is now logged in!
    router.push('/dashboard');
    return;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-3xl p-4 bg-white border rounded-md border-violet-200">
        <Modal
          initialFocusRef={initialRef}
          isOpen={isOpen}
          onClose={() => {
            onClose();
          }}
        >
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                className="mx-auto h-10 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
              />
              <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                {'Enter OTP code'}
              </h2>
              <p className="mt-2 text-center text-sm leading-5 text-gray-600 max-w">
                {'Enter the OTP code sent to your email'}
              </p>
            </div>

            <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
              <div className="mt-2">
                <input
                  id="otp"
                  name="otp"
                  required
                  value={otp}
                  placeholder="XXXXXX"
                  onChange={(e) => setOtp(e.target.value)}
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <button
                onClick={handleConfirm}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {apiLoading ? <Spinner /> : 'Next'}
              </button>
            </div>
          </div>
        </Modal>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Onboarding
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              We know this is the least fun part of all. Trust us, just get
              through a few questions and we will make your entire job
              application process easier.
            </p>

            {/* TODO: Create a 'upload / paste' resume here */}
            {/* <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Skip a few steps*
                  </label>
                  <div className="mt-2">
                    <button
                      onClick={onLinkedinImport}
                      className="rounded-md bg-indigo-600 text-white px-2.5 py-1.5 text-sm font-semibold shadow-sm hover:bg-indigo-400"
                    >
                      Import LinkedIn
                    </button>
                    <p className="mt-1 text-xs leading-6 text-gray-600">
                      * We will import your LinkedIn profile and fill out as
                      many details as possible
                    </p>
                  </div>
                </div>
              </div> */}
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {`Let's start with the basics.`}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First name
                </label>
                <div className="mt-2">
                  <input
                    required
                    type="text"
                    name="first-name"
                    id="first-name"
                    value={formState.firstName}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        firstName: e.target.value,
                      })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    required
                    type="text"
                    name="last-name"
                    id="last-name"
                    value={formState.lastName}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        lastName: e.target.value,
                      })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    required
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        email: e.target.value,
                      })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Job Details
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {`Collecting some infromation on your past experience. Below we will
            dive into your role and experiences for each job you've had in
            the past. Don't worry about formatting, feel free to explain like you would to a friend.`}
            </p>
            <JobDetails
              allJobDetails={allJobDetails}
              onAddJob={() =>
                setAllJobDetails([...allJobDetails, templateJobDetails])
              }
              onRemoveJob={(index) => {
                const newJobDetails = [...allJobDetails];
                newJobDetails.splice(index, 1);
                setAllJobDetails(newJobDetails);
              }}
              onJobDetailsChange={(i, newAllDetails) => {
                const newJobDetails = [...allJobDetails];
                newJobDetails[i] = newAllDetails;
                setAllJobDetails(newJobDetails);
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            disabled={apiLoading}
            onClick={handleNext}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {apiLoading && !isOpen ? <Spinner /> : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
