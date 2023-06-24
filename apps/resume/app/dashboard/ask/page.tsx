'use client';

import { useState } from 'react';
import { Divider, Select, Spinner } from '@chakra-ui/react';
import { EditableInput } from '../editable-input';
import {
  PredictQuestionRequestBody,
  PredictResponse,
  TypeOfPrediction,
} from '@libs/types';

const options = [
  // {
  //   value: 'job-experience',
  //   label: 'Job Experience',
  //   predictionType: TypeOfPrediction.JOB_EXPERIENCE,
  // },
  // {
  //   value: 'cover-letter',
  //   label: 'Cover Letter',
  //   predictionType: TypeOfPrediction.COVER_LETTER,
  // },
  {
    value: 'questions',
    label: 'Questions',
    predictionType: TypeOfPrediction.QUESTION,
  },
  {
    value: 'resume-tailor',
    label: 'Resume Tailor',
    predictionType: TypeOfPrediction.RESUME_TAILOR,
  },
];

/**
 * TODO:
 * - Should write a few different components per question type?
 */
export default function ResumesPage() {
  const [question, setQuestion] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [questionType, setQuestionType] = useState<string>('questions');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const onSubmit = async () => {
    if (submitting) return;
    // Get the type of prediction
    const typeOfPrediction = options.find(
      (option) => option.value === questionType
    )?.predictionType;
    // Check if all the data is present
    if (!jobDescription || !question || !questionType || !typeOfPrediction) {
      console.error('--- missing data', {
        jobDescription,
        question,
        questionType,
        typeOfPrediction,
      });
      return;
    }
    // Set submitted to true to disable the button
    setSubmitting(true);
    const postBody: PredictQuestionRequestBody = {
      jobDescription,
      question,
      typeOfPrediction,
    };
    const resp: PredictResponse = await fetch('/dashboard/ask/api', {
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

    console.log('---onClick', resp);
  };
  return (
    <>
      <Divider />
      <div className="p-2">
        <div className="mb-4 w-full">
          <p className="text-md font-semibold">What do you need help with?</p>
          <Select
            // Disabled for now, we only support questions
            disabled={submitting}
            onChange={(e) => setQuestionType(e.target.value)}
            value={questionType}
            className="pt-0"
            placeholder="Select option"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <EditableInput
          value={jobDescription}
          isTextarea
          header="Job Description"
          isEditMode
          disabled={submitting}
          onChange={setJobDescription}
          placeholder="We are looking for a software engineer with 5+ years of experience in React and Node.js."
        />
        <EditableInput
          value={question}
          isTextarea
          header="Question"
          isEditMode
          disabled={submitting}
          onChange={setQuestion}
          placeholder="What is your greatest weakness?"
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
      </div>
    </>
  );
}
