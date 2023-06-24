import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const mockJobsData = (index: number): Prisma.jobsCreateInput => ({
  company_name: `Fake ${index}`,
  title: 'Super Senor Developer',
  summary: 'I did some things at workday like helping out component libraries ',
  experience: `Working as a maintainer for the Workday component library.

  Consistently collaborating with both Accessibility and Design teams in order to improve the components accessibility, performance, and scalability.
  
  Complete refactor of Date Input and Date Picker components in order to improve accessibility and functionality.
  
  Rewrote stylings for multiple GWT components in order to make the transition to new React components as seamless as possible.
  
  Mentored teammates on best practices for React and Javascript.`,
  user_job_order: index,
  temp_skills: 'JavaScript, TypeScript, CSS',
});

// TODO: This seed won't work as the id we create will differ
// from the one that is in the auth.users table
const seedDb = async () => {
  const blayne = await prisma.user.upsert({
    where: { email: 'blayne.marjama@gmail.com' },
    update: {},
    create: {
      id: 'd51b38d5-1386-4aef-a5a6-c6bd72ac4019',
      email: 'blayne.marjama@gmail.com',
      first_name: 'Blayne',
      last_name: 'Marjama',
      jobs: {
        createMany: {
          data: [mockJobsData(0), mockJobsData(1)].map(
            (job, index) =>
              ({
                company_name: job.company_name,
                title: job.title,
                summary: job.summary,
                experience: job.experience,
                user_job_order: index,
                temp_skills: job.temp_skills,
              } as Prisma.jobsCreateManyUserInput)
          ),
        } as Prisma.jobsCreateManyUserInputEnvelope,
      },
    },
  });
  console.log({ blayne });
};

seedDb()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
