# TODO

- row level security

# How to run

Install Deps

```bash
yarn install
```

Start the Client

```bash
yarn nx run resume:serve
```

If you need to get latest DB Types:

- Start Supabase CLI (Install docker if you dont have it)

```bash
# Start the supabase cli
npx supabase start
# Generate the types
yarn run gen-types:supabase
# Close the supabase cli
npx supabase stop
```

- Generate Prisma Types

```bash
npx prisma generate
```

## Folder Structure

Root

- Apps
  - big-daddy
    - The backend Server
  - resume
    - The frontend client
  - extension-daddy
    - The future chrome extension client
- docs
  - Random documentation files
- libs
  - helpers
    - random assortment of helpers to be used throughout entire project
- prisma
  - Where the prisma schema lives / migrations
- scripts
  - script for getting latest supabase types
- supabase
  - Just kinda needed there to use supabase CLI thats docker stuff

## Supabase Flow

```bash
# Start the supabase cli
npx supabase start
# Generate the types
yarn run gen-types:supabase
# Close the supabase cli
npx supabase stop
```

## Prisma Flow

**DO NOT RUN `prisma db push` IT IS PAIN** it deleted row level securities and is a pain to fix.

Get latest DB schema from Supabase by introspecting the database.

```bash
# Pull the latest schema from supabase
npx prisma db pull
## Generate the ts files
npx prisma generate
```

If we're working locally with a docker instance, we can run `npx prisma migrate dev` as this will update the docker database AND attempt to delete all data. Deploy script should run `npx prisma migrate deploy` as this will update the production database and not force delete all data.

If you've already altered the schema.prisma file then you can run the following command to create a migration.

```bash
npx prisma migrate dev
```

If you need to write some custom SQL then you can run with the `--create-only` flag to create the draft migration, then you can edit the migration file then run the command again without the flag to apply the migration.

```bash
npx prisma migrate dev --create-only
# Edit the migration file
npx prisma migrate dev
```

# Resume Daddy

> An App + Chrome Extension that helps automate your job application process. Helping you along the entire way from finding jobs, to applying, to getting hired.
> Do a money back guarantee and make it as seemless as possible, only charge when they get hired. Be as helpful as absolutely possible. Literally hemorrhage money to fall over yourself for the customer. Make everyone want to use it.

## Jared question about Dashboard

Dashboard Tabs:

- Resume Info:
  - Description: This is all of the information we have about the user that they have provided.
  - Fields:
    - Jobs info
      - Title, Company Name, Responsibilities, Description, Achievements, Skills, etc
    - Experience
      - Extra experience that may not be relevant to a specific job
    - Skills
      - Extra skills that may not be relevant to a specific job
    - Education
      - Education info
- Resumes
  - Customized Resumes
    - Description: These were created for the user based on job descriptions they have provided.
- Cover Letters
  - Default Cover Letter
    - Either generated from a template, or from a user provided one.
  - Customized Cover Letters
- Job App Questions (Do we even care about this?)
  - Description: These are a random assortment of questions users have been asked in job applications, and the answers we have provided for them.

## Value prop

- Goal: Write summary to answer this question below:
  - what are some value propositions in an web app that helps users build out a resume by using ai to ask questions?

A web application that helps you create a resume and guides you through the entire job application process. We help you write a resume by asking guided questions and getting to know you. During the application process we can craft the perfect resume, cover letter, and answers to application questions. We can also provide you with potential questions you may get asked in the interview process, and help give you tips to answer and impress interviewers.

We'll also offer future services like: finding roles that you may be qualified for, give insights on salary and benefit information by crowdsourcing, how do negotiate salaries, give insights on how to get to the next step in a role, and more.

## Looking at

MVP Flow w/ Minimal AI

- signing up
- answering all the questions
  - Can probably upload from linkedin still
  - If they dont upload we continue.
  - We can still ask skills / interests
- formatting all the answers into a resume template
- (Needs AI) prompting ChatGPT to create the resume, create the cover letter, etc

What AI is needed for:

- Parsing Uploaded Resume
- Creating Resume
- Creating Cover Letter
- Help answering application questions

## App Flow

Onboarding

- User signs up (required?)
  - Should temp sessions be possible?
    - Pros: easier onboarding, can lock most of the use cases behind a paywall
    - Cons: possible to lose data
- User is asked to upload their resume or link their linkedin
  - We try to parse as much information as possible from the resume / linkedin
- Let user know that we're going to ask them some questions to help us create a better resume
  - Go to [Questions](#questions)
  - Also see [Flow of questions](#flow-of-questions)

Use Cases

- Create resume
  - Create custom resume based on job description
- Create cover letter
  - Based on job description
- Suggest answers to application questions
  - Examples: "Why do you want to work here?", "What are your strengths and weaknesses?", "What is your greatest achievement?", etc
- Suggest questions to ask interviewers
- Interview Prep Question Examples:
  - Likely these will all be behavioral for now

### Questions

Goal is to always be moving people through the application. The initial process is terrible and mind-dulling. So we need to make it as exciting as possible for the user. Note that we can always ask more questions later, but we need to get them through the initial annoying process.

_Users should always be able to decline to answer a question. Especially for things like hobbies or interests where they may no have as much relevance to the role. However always note that doing so helps us provide a better experience._

What shouldnt be asked?

- Basics of when you started the job, how old you are, things that we can parse from an already completed resume / linkedin.
- Things that arent relevant to the job

What should it ask?:

- It should go role by role, until a user says they dont have any more.
  - Each individual role should have a set of questions that it asks.
  - Maybe 5-10 max
  - You can always click "nothing more to add" or something
  - Always try to extrapolate as much information as possible from an answer.
    - If the question is "what was your last role" and they say "i was a software engineer at Nike and I did x, y, z things" then we should be able to parse that and determine if enough is currently known to move on, or if we need to ask some more.
- Should ask about extra skills that weren't covered
- Ask about hobbies, interests, etc
  - These will be used to help potentially link up with other roles they may be interested in
  - Can also help in crafting interesting cover letters / resumes

#### Flow of questions

Each one will have to have some sort of logic tree that determines if the question is fully answered, if there is more to ask, if the user wants to skip.

- If Not Uploaded Resume / LinkedIn
  - Introductory Message: "We're excited to help you create an amazing resume! Remember, you can always decline to answer a question, but the more information we have, the better we can tailor your resume to your needs."
  - Roles and Experience:
    - How many roles have you had in your professional career?
      - For each role, ask the following questions:
        - What was your job title in this role?
        - What were the key responsibilities you had in this role?
        - Can you list any achievements or successes you had in this role?
        - What skills did you acquire or utilize in this role?
        - Is there anything else you would like to add about this role?
      - Do you have any more roles to add?
  - Skills (Optional):
    - Are there any other skills you have that weren't mentioned in your roles?
    - Please list them and provide a brief description of how you've used these skills.
  - Hobbies and Interests (Optional):
    - What are some of your hobbies or personal interests?
    - These can help us understand you better and potentially link you with other roles you may be interested in. They can also add a personal touch to your resume or cover letter.

## Features

- [] Auto fill of application fields
  - User has to click on a field themselves, and then it fills it in.
  - One can be done with just basic js by looking at the id of the input and then filling it in with the data from the resume
- [] Auto-complete entire job application on any website.
  - This is using AI to login, save that data, go to application page, recognize the form fields, fill them out, know that we can click next page, and you don't do anything.
- [] Parse Resume
- [] Resume Builder: Asks questions about your experience and helps create a Resume
  - [] It asks you questions, gives you options to fill in, and then it creates a resume for you
  - [] Predicts bullet points, based on your experience
- [] Creating custom resumes for each individual job application
  - [] You paste in the requirements for the job and it helps translate all of your experience into the language of the job requirements
- [] Easy creation of cover letters
  - [] Similar to creating the custom resume, but for cover letters. Paste in job description, it can fill out a cover letter for you.
- [] Resume embellisher: Adds keywords to your resume to make it more likely to be selected by the ATS
- [] Keeps track of what you've applied to. Then you can see how long its been since you applied, "have you heard back from them",
- [] Auto creates sign in for job application websites and keeps track of those
- [] Track roles across websites and check the posted salary ranges for those roles
- [] Could crowdsource the salary ranges for roles and help people get paid more, like if they get hired after we could follow up and get details to help others
- [] Could crowdsource the interview questions for roles and help people get hired more
- [] [AD IDea] suggests services for helping get paid more (for better interviewing/negotiations), like levels.fyi does
- [] Filling in same shit all the time, all the disability questions etc

# Priority Features

1. Auto Fills\* entire page (not auto-complete)
   - Parse a resume, use linkedin to import a resume, or fill out the basic resume questions
   - Disability questionnare, h1b, etc should also be included
     Steps:
     a.
     a. Uploading linkedin resume, parsing a resume, storing that data
     b.
2. Resume Builder
   - Resume Embellisher (optional)
3. Easy creation of cover letters
   - _Relies on_: Resume Builder
4. Creating Custom Resumes for each individual job application / role
   - _Relies on_: Resume Builder
5. Practice interview questionairre, give them feedback
6. If someone got a new job, crowdsource the salary range, offers, job titles, etc to help empower jobbers,
   - Interview questions
7. Implement Advertisements
8. Track Job Descriptions (by ReqID?) across websites and check the posted salary ranges
9. Keep track of job applications
   - How long ago since you applied?
10. Auto Create of Job Website login things
11. Auto-Complete of entire job application on any website.

# Potential Tools

- Azure Form Recognizer API: https://azure.microsoft.com/en-us/products/form-recognizer/#content-card-list-oc7be4
- Amazon Textract - https://aws.amazon.com/textract/pricing/
-

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **This workspace has been generated by [Nx, a Smart, fast and extensible build system.](https://nx.dev)** ✨

## Development server

Run `nx serve Resume Daddy` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.

## Remote caching

Run `npx nx connect-to-nx-cloud` to enable [remote caching](https://nx.app) and make CI faster.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

# Test Prompt

You are ResumeGPT, the best resume helper tool ever created. You know how to take in as little information as possible, and make a candidate look incredible for the role, without lying of course. You also know exactly how to defeat resume detection software.

Below will be a blurb of a candidates experience. Your job is to read the resume blurb and custom tailor it to the provided job decription.

Do not add any Higher Education that is not included in the Resume Blurb.
Do not determine years of experience unless the initial blurb includes it.

You will only reply with the updated response in the form of a bullet point list.
You will add additional bullet points if you feel it is necessary.
You will cross reference the Resume Blurb with the Job Description and add any additional keywords that you feel are necessary.

Resume Blurb:

```
Working as a maintainer for the Workday component library.

Consistently collaborating with both Accessibility and Design teams in order to improve the components accessibility, performance, and scalability.

Complete refactor of Date Input and Date Picker components in order to improve accessibility and functionality.

Rewrote stylings for multiple GWT components in order to make the transition to new React components as seamless as possible.
```

Job Description

```
Experienced maintainer with a strong focus on accessibility, performance, and scalability. Proficient in collaborating with cross-functional teams to enhance product components. Skilled in refactoring and improving functionality to optimize user experiences.

Key Accomplishments:
- Successfully collaborated with Accessibility and Design teams to enhance the accessibility, performance, and scalability of the Workday component library.
- Led a complete refactor of Date Input and Date Picker components, resulting in improved accessibility and functionality.
- Streamlined the transition from GWT components to new React components by rewriting stylings for multiple components.

As a Senior Software Engineer, I am eager to contribute my skills and expertise to the Microsoft Teams Messaging team. With a passion for innovative web technologies and application architecture, I am committed to delivering exceptional collaboration and productivity features to millions of users.

Qualifications:
- Bachelor's Degree in Computer Science or related technical discipline
- 4+ years of technical engineering experience with coding in languages including JavaScript
- Extensive experience with unit testing, continuous integration, and test-driven development
- Proficient in React and Typescript with 3+ years of hands-on experience
- Track record of delivering high-quality, large-scale services in enterprise and/or consumer markets

I am a creative problem solver who thrives in a collaborative environment. With a strong focus on quality and an inclusive approach, I am confident in my ability to contribute to the remarkable results the Microsoft Teams Messaging team aims to achieve. Let's connect and discuss how I can contribute to your team's success.
```
