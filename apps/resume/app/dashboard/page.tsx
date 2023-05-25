'use client';
import { useEffect, useState } from 'react';
import { useSupabase } from '../supabase-provider';
import JobDetails from '../onboarding/job-details';
import { Database } from '@libs/database.types';
import type { JobDetails as JobDetailsType } from '../onboarding/page';

type JobsResponse = Database['public']['Tables']['jobs']['Row'];

const mapToJobDetails = (job: JobsResponse): JobDetailsType => ({
  jobTitle: job.title,
  companyName: job.company_name || '',
  description: job.description,
  responsibilities: job.responsibilities || '',
  skills: job.temp_skills || '',
});

export default function Dashboard() {
  const [jobs, setJobs] = useState<JobsResponse[]>([]);
  const { supabase } = useSupabase();
  useEffect(() => {
    const fetchThings = async () => {
      const { data, error } = await supabase.from('jobs').select();
      console.log('---things', data, error);
      if (data) {
        setJobs(data);
      }
    };

    fetchThings();
  }, [supabase]);

  return (
    <>
      <JobDetails
        allJobDetails={jobs.map(mapToJobDetails)}
        onAddJob={() => console.log('---added job')}
        onRemoveJob={(index) => {
          console.log('---removed job');
        }}
        onJobDetailsChange={(i, newAllDetails) => {
          console.log('---changed', i, newAllDetails);
        }}
      />
    </>
  );
}
