'use-client';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { JobDetails } from './page';

export function JobQuestions({
  details,
  hideDelete,
  header,
  id,
  onDeletePress,
  onValueChange,
}: {
  id: string | number;
  details: JobDetails;
  header?: string;
  hideDelete?: boolean;
  onDeletePress: () => void;
  onValueChange: (newDetails: JobDetails) => void;
}) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const parsedName = name.split('-')[0];
    onValueChange({ ...details, [parsedName]: value });
  };
  return (
    <div className="mt-10 rounded-md p-2.5 border border-gray-300 bg-gray-50">
      {/* Only show the delete if it's not the first job */}
      <div className="h-6 mb-2 flex justify-between">
        {header && <p className="">{header}</p>}
        {!hideDelete && (
          <button type="button" className="rounded-md" onClick={onDeletePress}>
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label
            htmlFor={`jobTitle-${id}`}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Title
          </label>
          <div className="mt-2">
            <input
              required
              type="text"
              name={`jobTitle-${id}`}
              id={`jobTitle-${id}`}
              onChange={handleInputChange}
              value={details.jobTitle}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:col-span-3">
          <label
            htmlFor={`companyName-${id}`}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Company Name (Optional)
          </label>
          <div className="mt-2">
            <input
              type="text"
              name={`companyName-${id}`}
              id={`companyName-${id}`}
              onChange={handleInputChange}
              value={details.companyName}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="col-span-full">
          <label
            htmlFor={`summary-${id}`}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Summary
          </label>
          <div className="mt-2">
            <textarea
              id={`summary-${id}`}
              name={`summary-${id}`}
              rows={3}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={handleInputChange}
              value={details.summary}
            />
          </div>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Summarize what you did in this role?
          </p>
        </div>
        <div className="col-span-full">
          <label
            htmlFor={`experiences-${id}`}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Experiences
          </label>
          <div className="mt-2">
            <textarea
              id={`experiences-${id}`}
              name={`experiences-${id}`}
              rows={3}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={handleInputChange}
              value={details.experiences}
            />
          </div>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            What sort of experience did you have in this role?
          </p>
        </div>
        <div className="col-span-full">
          <label
            htmlFor={`skills-${id}`}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Skills Used
          </label>
          <div className="mt-2">
            <textarea
              id={`skills-${id}`}
              name={`skills-${id}`}
              rows={3}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={handleInputChange}
              value={details.skills}
            />
          </div>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            What sort of skills did you use in this role?
          </p>
        </div>
      </div>
    </div>
  );
}

export default function JobDetails({
  allJobDetails,
  onAddJob,
  onRemoveJob,
  onJobDetailsChange,
}: {
  allJobDetails: JobDetails[];
  onAddJob: () => void;
  onRemoveJob: (index: number) => void;
  onJobDetailsChange: (index: number, newDetails: JobDetails) => void;
}) {
  return (
    <>
      {allJobDetails.map((job, i) => (
        <JobQuestions
          id={i}
          details={job}
          key={`job-${i}`}
          header={`Job ${i + 1}`}
          hideDelete={i === 0}
          onValueChange={(newDetails) => onJobDetailsChange(i, newDetails)}
          onDeletePress={() => onRemoveJob(i)}
        />
      ))}
      <button
        type="button"
        className="mt-4 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        onClick={onAddJob}
      >
        <PlusIcon className="h-6 w-6" />
      </button>
    </>
  );
}
