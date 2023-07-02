'use client';

import { useState } from 'react';
import { Divider, Select } from '@chakra-ui/react';
import PredictQuestion from './predict-question';
import PredictSingleExperience from './predict-single-experience';

type Options = {
  value: string;
  label: string;
  description: string;
  component: React.FC;
};

const options: Options[] = [
  {
    value: 'questions',
    label: 'Questions',
    description: 'Help answer a question based on your resume.',
    component: PredictQuestion,
  },
  {
    value: 'job-experience',
    label: 'Job Experience',
    description: 'Help rewrite a job experience entry.',
    component: PredictSingleExperience,
  },
  // {
  //   value: 'cover-letter',
  //   label: 'Cover Letter',
  // },
];

/**
 * TODO:
 * - Should write a few different components per question type?
 */
export default function ResumesPage() {
  const [questionType, setQuestionType] = useState<string>(options[0].value);
  const selectedOption = options.find((o) => o.value === questionType);
  return (
    <>
      <Divider />
      <div className="p-2">
        <div className="mb-4 w-full">
          <p className="text-md font-semibold">What do you need help with?</p>
          <Select
            // Disabled for now, we only support questions
            // disabled={submitting}
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
          <p className="text-sm p-2">
            {selectedOption && selectedOption.description}
          </p>
        </div>
        {selectedOption && <selectedOption.component />}
      </div>
    </>
  );
}
