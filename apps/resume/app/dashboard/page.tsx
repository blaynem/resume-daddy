'use client';
import React, { useEffect, useState } from 'react';
import { Database } from '@libs/database.types';
import { EditableInput, IconButton } from './editable-input';
import {
  CheckIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { deepEqual } from '@libs/helpers';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/react';
import { IconType } from '@libs/types';
import { useSupabase } from '../../clients/supabase-provider';

type JobsResponse = Database['public']['Tables']['jobs']['Row'];
type JobsResponseInsert = Database['public']['Tables']['jobs']['Insert'];

/**
 * Returns {deletedJobs, restOfJobs}
 */
const getDeletedAndUpdatedJobs = (
  dbJobs: JobsResponse[],
  tempJobsEdits: JobsResponse[]
): {
  deletedJobs: JobsResponse[];
  restOfJobs: JobsResponse[];
} => {
  const deletedJobs = dbJobs.filter(
    (dbJob) => !tempJobsEdits.find((tempJob) => tempJob.id === dbJob.id)
  );
  const restOfJobs = tempJobsEdits.filter(
    (tempJob) => !deletedJobs.find((deletedJob) => deletedJob.id === tempJob.id)
  );
  return { deletedJobs, restOfJobs };
};

export default function Dashboard() {
  // Keeping track of the jobs state from db
  const [dbJobs, setDbJobs] = useState<JobsResponse[]>([]);
  const [tempJobsEdits, setTempJobEdits] = useState<JobsResponse[]>([]);
  const [newJobs, setNewJobs] = useState<JobsResponseInsert[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const { supabase, user } = useSupabase();

  useEffect(() => {
    // Todo: Maybe we use the supabase.channel??
    // This would stop us from needing to store the dbJobs in state
    // https://supabase.com/docs/reference/javascript/subscribe
    const fetchThings = async () => {
      const { data } = await supabase
        .from('jobs')
        .select()
        .order('user_job_order');
      if (data) {
        setDbJobs(data);
        setTempJobEdits(data);
      }
    };

    fetchThings();
  }, [supabase]);

  const addNewJob = () => {
    // Add a new job to the tempJobsEdits
    const addNewJob: JobsResponseInsert = {
      title: '',
      company_name: '',
      summary: '',
      experience: '',
      temp_skills: '',
      user_id: user?.id,
      user_job_order: tempJobsEdits.length,
    };
    setNewJobs([...newJobs, addNewJob]);
  };

  const cancelEditMode = () => {
    // Reset the tempJobsEdits to the dbJobs
    setTempJobEdits(dbJobs);
    setIsEditMode(false);
  };

  const changeEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const onEditSave = async () => {
    // Don't save if there are no changes
    if (deepEqual(dbJobs, tempJobsEdits)) {
      setIsEditMode(false);
      return;
    }

    const { deletedJobs, restOfJobs } = getDeletedAndUpdatedJobs(
      dbJobs,
      tempJobsEdits
    );

    // We should only update the jobs that have changed
    const editedJobs = restOfJobs
      .map((job) => {
        const dbJob = dbJobs.find((dbJob) => dbJob.id === job.id);
        if (!dbJob) {
          // This is a new job
          return job;
        }
        return deepEqual(job, dbJob) ? null : job;
      })
      .filter(Boolean) as JobsResponse[];

    // Make supabase upsert to update jobs
    const jobsUpsertResp = supabase.from('jobs').upsert(editedJobs);
    // make fetch to delete jobs
    // TODO: IF the jobs delete fails we should handle the error
    const jobsDeleteResp = fetch(
      `/api/user/jobs?deleteIds=${deletedJobs.map((job) => job.id).join(',')}`,
      {
        method: 'DELETE',
      }
    ).then((res) => res.json());

    // Wait for both to finish
    await Promise.all([jobsUpsertResp, jobsDeleteResp]);
    setDbJobs(tempJobsEdits);
    setIsEditMode(false);
  };

  const onJobDelete = (id: string) => {
    setTempJobEdits((prev) => prev.filter((job) => job.id !== id));
  };

  // Edits the job in the tempJobsEdits array
  const editJob = (index: number, newJob: JobsResponse) => {
    setTempJobEdits((prev) => {
      const newEditJobs = [...prev];
      newEditJobs[index] = newJob;
      return newEditJobs;
    });
  };

  const onEditNewJob = (index: number, newJob: JobsResponseInsert) => {
    setNewJobs((prev) => {
      const newEditedJobs = [...prev];
      newEditedJobs[index] = newJob;
      return newEditedJobs;
    });
  };

  const onNewJobSave = async (index: number) => {
    const newJob: JobsResponseInsert = newJobs[index];
    const { data, error } = await supabase
      .from('jobs')
      .insert(newJob)
      .select()
      .order('user_job_order');
    if (error) {
      console.error(error);
      return;
    }
    setNewJobs((prev) => prev.filter((_, i) => i !== index));
    // Align state with the new data
    setDbJobs((prev) => [...prev, data[0]]);
    setTempJobEdits((prev) => [...prev, data[0]]);
  };

  const onNewJobDelete = (index: number) => {
    setNewJobs((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="px-4">
      <header className="mb-2">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Profile
        </h2>
        <p className="text-sm leading-6 text-gray-500">
          {`All of the job information you provide is used to help guide you when
          filling out job applications. Don't worry about formatting, feel free to explain like you would to a friend.`}
        </p>
      </header>
      <div className="absolute top-0 right-0">
        {!isEditMode ? (
          <div className="flex">
            <IconButton
              iconSrText="Edit Fields"
              iconType={PencilIcon as IconType}
              onClick={changeEditMode}
            />
            <div
              className={
                !newJobs.length && !dbJobs.length
                  ? `animate-[bounce_1s_infinite_2000ms]`
                  : ''
              }
            >
              <IconButton
                iconSrText="Add Job"
                iconType={PlusIcon as IconType}
                onClick={addNewJob}
              />
            </div>
          </div>
        ) : (
          <>
            <IconButton
              iconSrText="Cancel"
              iconType={XMarkIcon as IconType}
              onClick={cancelEditMode}
            />
            <IconButton
              iconSrText="Save"
              iconType={CheckIcon as IconType}
              onClick={onEditSave}
            />
          </>
        )}
      </div>

      <Accordion defaultIndex={[0]} allowMultiple>
        {tempJobsEdits.map((job, index) => (
          <AccordionItem key={job.id}>
            <div className="flex justify-between">
              <AccordionButton className="px-2">
                <p className="text-md font-semibold">{`${
                  job.title || 'Title'
                } @ ${job.company_name || 'Company'}`}</p>
              </AccordionButton>
              {isEditMode && (
                <IconButton
                  iconSrText="Delete Job"
                  iconType={TrashIcon as IconType}
                  onClick={() => onJobDelete(job.id)}
                />
              )}
            </div>

            <AccordionPanel className="pb-2 px-2">
              <EditableInput
                isEditMode={isEditMode}
                header="Job Title"
                value={job.title}
                onChange={(value) => {
                  const newJob = { ...job, title: value };
                  editJob(index, newJob);
                }}
              />
              <EditableInput
                isEditMode={isEditMode}
                header="Company Name"
                value={job.company_name || ''}
                onChange={(value) => {
                  const newJob = { ...job, company_name: value };
                  editJob(index, newJob);
                }}
              />
              <EditableInput
                isEditMode={isEditMode}
                header="Summary"
                hintText="Summarize what you did in this role"
                value={job.summary}
                isTextarea
                onChange={(value) => {
                  const newJob = { ...job, summary: value };
                  editJob(index, newJob);
                }}
              />
              <EditableInput
                isEditMode={isEditMode}
                header="Experience"
                hintText="What sort of experience did you have in this role?"
                value={job.experience || ''}
                isTextarea
                onChange={(value) => {
                  const newJob = { ...job, experience: value };
                  editJob(index, newJob);
                }}
              />
              <EditableInput
                isEditMode={isEditMode}
                header="Skills"
                hintText="What sort of skills did you use in this role?"
                value={job.temp_skills || ''}
                isTextarea
                onChange={(value) => {
                  const newJob = { ...job, temp_skills: value };
                  editJob(index, newJob);
                }}
              />
            </AccordionPanel>
          </AccordionItem>
        ))}
        {newJobs.map((job, index) => (
          <AccordionItem key={job.id}>
            <div className="flex justify-between">
              <AccordionButton key={index} className="px-2">
                <p className="text-md font-semibold">{`New Entry: ${
                  job.title || 'Title'
                } @ ${job.company_name || 'Company'}`}</p>
              </AccordionButton>
              <div className="flex">
                <IconButton
                  iconSrText="Cancel"
                  iconType={XMarkIcon as IconType}
                  onClick={() => onNewJobDelete(index)}
                />
                <IconButton
                  iconSrText="Save"
                  iconType={CheckIcon as IconType}
                  onClick={() => onNewJobSave(index)}
                />
              </div>
            </div>

            <AccordionPanel className="pb-2 px-2">
              <EditableInput
                isEditMode
                header="Job Title"
                value={job.title}
                onChange={(value) => {
                  const newJob = { ...job, title: value };
                  onEditNewJob(index, newJob);
                }}
              />
              <EditableInput
                isEditMode
                header="Company Name"
                value={job.company_name || ''}
                onChange={(value) => {
                  const newJob = { ...job, company_name: value };
                  onEditNewJob(index, newJob);
                }}
              />
              <EditableInput
                isEditMode
                header="Summary"
                hintText="Summarize what you did in this role"
                value={job.summary}
                isTextarea
                onChange={(value) => {
                  const newJob = { ...job, summary: value };
                  onEditNewJob(index, newJob);
                }}
              />
              <EditableInput
                isEditMode
                header="Experience"
                hintText="What sort of experience did you have in this role?"
                value={job.experience || ''}
                isTextarea
                onChange={(value) => {
                  const newJob = { ...job, experience: value };
                  onEditNewJob(index, newJob);
                }}
              />
              <EditableInput
                isEditMode
                header="Skills"
                hintText="What sort of skills did you use in this role?"
                value={job.temp_skills || ''}
                isTextarea
                onChange={(value) => {
                  const newJob = { ...job, temp_skills: value };
                  onEditNewJob(index, newJob);
                }}
              />
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
