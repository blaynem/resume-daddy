export type IconType = React.ComponentType<React.ComponentProps<'svg'>>;

export type OnboardingSubmit = FormState & {
  signupId: string;
  jobs: JobDetailsType[];
};

export type FormState = {
  firstName: string;
  lastName: string;
  email: string;
};

export type JobDetailsType = {
  jobTitle: string;
  companyName: string;
  summary: string;
  experiences: string;
  skills: string;
};
