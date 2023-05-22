'use client';

import { useState } from 'react';
import JobDetails from './job-details';

type FormState = {
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

export default function Onboarding() {
  const [formState, setFormState] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [allJobDetails, setAllJobDetails] = useState<JobDetails[]>([
    templateJobDetails,
  ]);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('--submit', { ...formState, jobs: allJobDetails });
  };
  return (
    <form autoComplete="on">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Onboarding
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            We know this is the least fun part of all. Trust us, just get
            through a few questions and we will make your entire job application
            process easier.
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
                  type="button"
                  className="rounded-md bg-indigo-600 text-white px-2.5 py-1.5 text-sm font-semibold shadow-sm hover:bg-indigo-400"
                >
                  Import LinkedIn
                </button>
                <p className="mt-1 text-xs leading-6 text-gray-600">
                  * We will import your LinkedIn profile and fill out as many
                  details as possible
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
        {/* <button
          type="button"
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Cancel
        </button> */}
        <button
          onClick={handleSubmit}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
