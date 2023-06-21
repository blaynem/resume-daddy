import {
  ArrowPathIcon,
  ChatBubbleLeftIcon,
  PencilIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'AI-Powered Answers',
    description: `Our innovative AI technology will generate persuasive responses to job application questions. It aligns your skills and experience with the requirements of the role, showcasing your suitability in the best light.`,
    icon: ChatBubbleLeftIcon,
  },
  {
    name: 'Cover Letter Creation',
    description: `We'll help you craft a compelling cover letter that's not just another generic template. Our AI weaves your professional story, highlighting key achievements and skills that match the job description.`,
    icon: PencilIcon,
  },
  {
    name: 'Resume Rewriting',
    description: `Want to revamp your resume? We've got you covered. Resume Daddy's AI breathes new life into your resume, aligning it with the job description for maximum impact.`,
    icon: ArrowPathIcon,
  },
  {
    name: 'And more...',
    description: `Resume Daddy is continuously evolving. We're working on bringing you more tools and features to enhance your job application process. Stay tuned for exciting updates!`,
    icon: PlusCircleIcon,
  },
];

export default function HowToPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            AI Powered
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Let your resume shine
          </p>
        </div>
        <div className="my-6">
          <h2 className="font-bold text-gray-900 text-xl">
            1. Create Your Profile
          </h2>
          <p className="mb-4 text-lg leading-8 text-gray-600">
            {`Kickstart your journey with Resume Daddy by filling out your
            professional profile. We've made it easy for you to share your
            entire job history, skills, achievements, and more in a
            comprehensive format. Every detail counts!`}
          </p>
        </div>
        <div className="mb-6">
          <h2 className="font-bold text-gray-900 text-xl">
            2. Leverage our AI-Powered Tools
          </h2>
          <p className="mb-4 text-lg leading-8 text-gray-600">
            {`Powered by cutting-edge Artificial Intelligence, our platform dives
            deep into your profile to learn about your unique career path. Our
            AI doesn't just understand your experience, it grasps the nuances of
            your skills and the milestones you've achieved.`}
          </p>
        </div>
        <div className="mb-6">
          <h2 className="font-bold text-gray-900 text-xl">
            3. Craft Tailored Applications
          </h2>
          <p className="mb-4 text-lg leading-8 text-gray-600">
            {`Resume Daddy helps you tackle the most challenging part of job
            applications - customization. Input the job description of the role
            you're eyeing, and watch our AI work its magic.`}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
