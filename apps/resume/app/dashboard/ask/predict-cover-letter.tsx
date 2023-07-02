'use client';

import { useState } from 'react';
import { Spinner } from '@chakra-ui/react';
import { EditableInput } from '../editable-input';
import {
  PredictCoverLetterRequestBody,
  PredictResponseClient,
  TypeOfPrediction,
} from '@libs/types';
import { useSupabase } from '../../../clients/supabase-provider';

export default function PredictCoverLetter() {
  const { user } = useSupabase();
  const [jobDescription, setJobDescription] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const onSubmit = async () => {
    if (submitting) return;

    // Check if all the data is present
    if (!jobDescription) {
      console.error('--- missing data', {
        jobDescription,
      });
      return;
    }
    // Set submitted to true to disable the button
    setSubmitting(true);
    const postBody: PredictCoverLetterRequestBody = {
      user_id: user?.id ?? '',
      typeOfPrediction: TypeOfPrediction.COVER_LETTER,
      targetJobDescription: jobDescription,
    };
    const resp: PredictResponseClient = await fetch('/dashboard/ask/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBody),
    })
      .then((res) => res.json())
      .catch((e) => {
        setSubmitting(false);
        setResponse('');
      });
    if (resp.error) {
      setResponse('There was an error...');
    }
    setResponse(resp.data ?? '');
    setSubmitting(false);
  };
  return (
    <>
      <EditableInput
        value={jobDescription}
        isTextarea
        header="Job Description"
        isEditMode
        disabled={submitting}
        onChange={setJobDescription}
        placeholder="We are looking for a software engineer with 5+ years of experience in React and Node.js."
      />
      {submitting ? (
        <div className="mb-4 w-full">
          <p className="text-md font-semibold">Response</p>
          <Spinner />
        </div>
      ) : (
        <EditableInput
          value={response}
          isTextarea
          header="Response"
          isEditMode={false}
          onChange={setResponse}
          placeholder="Response will appear here..."
        />
      )}
      <div className="w-full flex justify-end">
        <button
          disabled={submitting}
          onClick={onSubmit}
          className="py-1 px-3 border rounded disabled:cursor-not-allowed disabled:border-slate-400 disabled:hover:text-slate-400 disabled:hover:bg-transparent border-violet-400 hover:text-white hover:bg-violet-400"
        >
          Submit
        </button>
      </div>
    </>
  );
}
