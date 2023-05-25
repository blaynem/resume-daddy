'use client';

import { useEffect, useRef, useState } from 'react';
import JobDetails from './job-details';
import supabase from '../clients/supabase';
import Modal from '../../wrappers/modal';
import { useDisclosure } from '@chakra-ui/react';
import SignInForm from '../../components/sign-in';
import { OnboardingSubmitResponse } from '../api/user/onboarding/route';

export type OnboardingSubmit = FormState & {
  jobs: JobDetails[];
};

export type FormState = {
  firstName: string;
  lastName: string;
  email: string;
};

export type JobDetails = {
  jobTitle: string;
  companyName: string;
  description: string;
  responsibilities: string;
  skills: string;
};

const templateJobDetails: JobDetails = {
  jobTitle: '',
  companyName: '',
  description: '',
  responsibilities: '',
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
  const { isOpen, onOpen: openModal, onClose } = useDisclosure();
  const initialRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState('');
  const [formState, setFormState] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [allJobDetails, setAllJobDetails] = useState<JobDetails[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
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

  const handleSubmit = async (e: any) => {
    // TODO: Validate form and show errors before opening modal
    e.preventDefault();
    openModal();
  };

  const handleSignUpClick = async () => {
    // Set fetching state to started
    const submitState: OnboardingSubmit = { ...formState, jobs: allJobDetails };
    const submittedRes: OnboardingSubmitResponse = await fetch(
      '/api/user/onboarding',
      {
        method: 'POST',
        body: JSON.stringify(submitState),
      }
    ).then((res) => res.json());

    if (submittedRes.error || !submittedRes.id) {
      // todo: Handle error
    }

    // Fire off the email sign up
    const signup = await supabase.auth.signUp({
      email: formState.email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_WEB_URL}/onboarding/confirm-email?id=${submittedRes.id}`,
      },
    });
    if (signup.error) {
      // todo: Handle error
    }
    setShowSuccess(true);
    return;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-3xl p-4 bg-white border rounded-md border-violet-200">
        <form autoComplete="on">
          <Modal
            initialFocusRef={initialRef}
            isOpen={isOpen}
            onClose={() => {
              onClose();
              setPassword('');
            }}
          >
            {showSuccess ? (
              <>
                <div>Confirmation sent to your email</div>
              </>
            ) : (
              <SignInForm
                header="Enter a password to finish up"
                submitText="Sign up"
                passwordRef={initialRef}
                hideNote
                hideForgotPassword
                onSubmit={handleSignUpClick}
                email={formState.email}
                password={password}
                onEmailChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
                onPasswordChange={(e) => setPassword(e.target.value)}
              />
            )}
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
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
              </div>
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
            dive into your role and responsibilities for each job you've had in
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
              onClick={handleSubmit}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
