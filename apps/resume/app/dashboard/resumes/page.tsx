'use client';

import { useState } from 'react';
import { PredictQuestionRequestBody } from '../api/predict/route';
import { Select, Spinner } from '@chakra-ui/react';
import { EditableInput } from '../editable-input';
import { PredictResponse } from '@libs/types';

export enum TypeOfPrediction {
  JOB_EXPERIENCE = 'JOB_EXPERIENCE',
  COVER_LETTER = 'COVER_LETTER',
  QUESTION = 'QUESTION',
  RESUME = 'RESUME',
  SUMMARY = 'SUMMARY',
}

const options = [
  {
    value: 'job-experience',
    label: 'Job Experience',
    predictionType: TypeOfPrediction.JOB_EXPERIENCE,
  },
  {
    value: 'cover-letter',
    label: 'Cover Letter',
    predictionType: TypeOfPrediction.COVER_LETTER,
  },
  {
    value: 'questions',
    label: 'Questions',
    predictionType: TypeOfPrediction.QUESTION,
  },
];

export default function ResumesPage() {
  const [question, setQuestion] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [questionType, setQuestionType] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const onSubmit = async () => {
    if (submitted) return;
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
    setSubmitted(true);
    const postBody: PredictQuestionRequestBody = {
      jobDescription,
      question,
      typeOfPrediction,
    };
    const resp: PredictResponse = await fetch('api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBody),
    })
      .then((res) => res.json())
      .catch((e) => {
        setSubmitted(false);
        setResponse('');
      });
    if (resp.error) {
      setSubmitted(false);
      setResponse('There was an error...');
    }
    setResponse(resp.data ?? '');

    console.log('---onClick', resp);
  };
  const handleClear = () => {
    // We only want to clear data that users might not want to reuse
    setSubmitted(false);
    setResponse('');
    setQuestion('');
  };
  return (
    <div className="p-6">
      <div className="mb-4 w-full">
        <p className="text-md font-semibold">What do you need help with?</p>
        <Select
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
        isEditMode={!submitted}
        onChange={setJobDescription}
      />
      <EditableInput
        value={question}
        isTextarea
        header="Question"
        isEditMode={!submitted}
        onChange={setQuestion}
      />
      {submitted && !response ? (
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
        />
      )}
      <div className="w-full flex justify-between">
        <button
          onClick={handleClear}
          className="py-1 px-3 border rounded border-red-400 hover:text-white hover:bg-red-400"
        >
          Reset
        </button>
        <button
          disabled={submitted}
          onClick={onSubmit}
          className="py-1 px-3 border rounded disabled:cursor-not-allowed disabled:border-slate-400 disabled:hover:text-slate-400 disabled:hover:bg-transparent border-violet-400 hover:text-white hover:bg-violet-400"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
