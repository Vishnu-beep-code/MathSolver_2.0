import React, { useState } from 'react';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import ResultDisplay from '../../components/ui/ResultDisplay';

const Probability: React.FC = () => {
  const [favorableOutcomes, setFavorableOutcomes] = useState<string>('');
  const [totalOutcomes, setTotalOutcomes] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const calculateProbability = () => {
    const favorable = parseFloat(favorableOutcomes);
    const total = parseFloat(totalOutcomes);

    if (isNaN(favorable) || isNaN(total) || total === 0) {
      setResult('Please enter valid numbers. Total outcomes must not be zero.');
      return;
    }

    if (favorable > total) {
      setResult('Favorable outcomes cannot be greater than total outcomes.');
      return;
    }

    const probability = (favorable / total) * 100;
    setResult(`Probability: ${probability.toFixed(2)}%`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Probability Calculator
        </h1>
        
        <div className="space-y-4">
          <InputField
            label="Favorable Outcomes"
            type="number"
            value={favorableOutcomes}
            onChange={(e) => setFavorableOutcomes(e.target.value)}
            placeholder="Enter number of favorable outcomes"
          />
          
          <InputField
            label="Total Outcomes"
            type="number"
            value={totalOutcomes}
            onChange={(e) => setTotalOutcomes(e.target.value)}
            placeholder="Enter total number of outcomes"
          />

          <Button
            onClick={calculateProbability}
            className="w-full"
          >
            Calculate Probability
          </Button>

          {result && (
            <ResultDisplay result={result} />
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            How to use
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Enter the number of favorable outcomes (desired events) and the total number of possible outcomes. 
            The calculator will show the probability as a percentage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Probability;