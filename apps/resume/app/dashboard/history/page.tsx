'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@libs/database.types';

const HistoryItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => (
  <li className="flex justify-between py-4">
    <div className="min-w-0 flex-auto">
      <p className="text-sm font-semibold leading-6 text-gray-900">
        {question}
      </p>
      <p className="text-xs leading-5 text-gray-500">{answer}</p>
    </div>
  </li>
);

type PredictionType = Database['public']['Tables']['predictions']['Row'];
export default function HistoryPage() {
  const supabase = createClientComponentClient<Database>();
  const [allPredictions, setAllPredictions] = useState<PredictionType[]>([]);
  useEffect(() => {
    // Get the prediction state
    const fetchPredictions = async () => {
      const { data } = await supabase.from('predictions').select();
      setAllPredictions(data ?? []);
    };
    fetchPredictions();
  }, [supabase]);

  return (
    <div className="w-full">
      <div className="mb-2">
        <p className="text-md font-bold mb-2">History</p>
        <p className="text-sm">{`Below is a history of what what you've asked.`}</p>
      </div>
      <ul role="list" className="divide-y divide-gray-100">
        {allPredictions &&
          allPredictions.map((prediction) => (
            <HistoryItem
              key={prediction.id}
              question={prediction.question}
              answer={prediction.prediction}
            />
          ))}
      </ul>
    </div>
  );
}
