import React, { useState } from 'react';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import ResultDisplay from '../../components/ui/ResultDisplay';

const Algebra: React.FC = () => {
  const [equation, setEquation] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleSolve = () => {
    // Basic validation
    if (!equation.trim()) {
      setResult('Please enter an equation');
      return;
    }

    // Placeholder for actual algebra solving logic
    setResult('Algebra solver coming soon');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Algebra Calculator
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          <InputField
            label="Enter Equation"
            placeholder="e.g., 2x + 3 = 7"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
          />

          <Button
            onClick={handleSolve}
            className="w-full"
          >
            Solve Equation
          </Button>

          {result && (
            <ResultDisplay result={result} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Algebra;