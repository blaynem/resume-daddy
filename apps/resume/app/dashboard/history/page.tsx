'use client';
import { useState, useEffect } from 'react';
import { Database } from '@libs/database.types';
import { useSupabase } from '../../../clients/supabase-provider';
import { Divider } from '@chakra-ui/react';

const HistoryItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => (
  <li className="flex justify-between py-4 first:pt-0">
    <div className="min-w-0 flex-auto">
      <p className="text-sm font-semibold leading-6 text-gray-900">
        Q. {question}
      </p>
      <p className="text-xs leading-5 text-gray-500">A. {answer}</p>
    </div>
  </li>
);

type PredictionType = Database['public']['Tables']['predictions']['Row'];
export default function HistoryPage() {
  const { supabase } = useSupabase();
  const [allPredictions, setAllPredictions] = useState<PredictionType[]>([]);
  useEffect(() => {
    // Get the prediction state
    const fetchPredictions = async () => {
      const { data } = await supabase
        .from('predictions')
        .select()
        .order('created_at', { ascending: false });

      setAllPredictions(data ?? []);
    };
    fetchPredictions();
  }, [supabase]);

  return (
    <>
      <Divider />
      <div className="p-2">
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
    </>
  );
}
