import React, { useState } from 'react';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import ResultDisplay from '../../components/ui/ResultDisplay';

const Limits: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [variable, setVariable] = useState('');
  const [approachingValue, setApproachingValue] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateLimit = () => {
    if (!expression || !variable || !approachingValue) {
      setError('Please fill in all fields.');
      setResult(null);
      return;
    }

    // Placeholder for actual limit calculation logic
    setResult(`Limit of ${expression} as ${variable} approaches ${approachingValue} is calculated here.`);
    setError(null); // Reset error if calculation succeeds
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Limit Calculator
      </h1>
      
      <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <InputField
          id="expression"
          label="Expression"
          placeholder="Enter mathematical expression (e.g., x^2 + 2x + 1)"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          error={error ? 'Please provide a valid expression.' : ''}
        />
        
        <InputField
          id="variable"
          label="Variable"
          placeholder="Enter variable (e.g., x)"
          value={variable}
          onChange={(e) => setVariable(e.target.value)}
          error={error ? 'Please provide a valid variable.' : ''}
        />
        
        <InputField
          id="approachingValue"
          label="Approaching Value"
          placeholder="Enter the value the variable approaches"
          value={approachingValue}
          onChange={(e) => setApproachingValue(e.target.value)}
          type="number"  // Ensure type="number" for numerical inputs
          error={error ? 'Please provide a valid approaching value.' : ''}
        />
        
        <Button
          onClick={calculateLimit}
          disabled={!expression || !variable || !approachingValue}
          className="w-full"
        >
          Calculate Limit
        </Button>
        
        {result && (
          <ResultDisplay 
            title="Limit Calculation Result"
          >
            {result}
          </ResultDisplay>
        )}
      </div>

      <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          How to Use
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Enter the mathematical expression containing the variable</li>
          <li>Specify the variable used in the expression</li>
          <li>Enter the value that the variable approaches</li>
          <li>Click "Calculate Limit" to compute the result</li>
        </ol>
      </div>
    </div>
  );
};

export default Limits;
