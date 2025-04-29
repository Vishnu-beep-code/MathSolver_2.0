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

  const parseExpression = (expr: string, val: number) => {
    const formatted = expr
      .replace(/\^/g, '**')
      .replace(new RegExp(`\\b${variable}\\b`, 'g'), `(${val})`);
    return new Function(`return ${formatted}`)();
  };

  const isClose = (a: number, b: number, tolerance = 1e-5) =>
    Math.abs(a - b) < tolerance;

  const calculateLimit = () => {
    if (!expression || !variable || !approachingValue) {
      setError('Please fill in all fields.');
      setResult(null);
      return;
    }

    const value = parseFloat(approachingValue);
    if (isNaN(value)) {
      setError('Approaching value must be a number.');
      setResult(null);
      return;
    }

    try {
      const h = 1e-5;
      const left = parseExpression(expression, value - h);
      const right = parseExpression(expression, value + h);

      if (isNaN(left) || isNaN(right)) {
        throw new Error();
      }

      if (isClose(left, right)) {
        const approx = (left + right) / 2;
        setResult(`Limit of ${expression} as ${variable} → ${value} is approximately ${approx.toFixed(6)}`);
      } else {
        setResult(`Left and right limits differ: Left ≈ ${left.toFixed(6)}, Right ≈ ${right.toFixed(6)}. Limit may not exist.`);
      }

      setError(null);
    } catch {
      setError('Invalid expression or evaluation error.');
      setResult(null);
    }
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
          placeholder="e.g., x^2 + 2*x + 1"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          error={error && !expression ? error : ''}
        />

        <InputField
          id="variable"
          label="Variable"
          placeholder="e.g., x"
          value={variable}
          onChange={(e) => setVariable(e.target.value)}
          error={error && !variable ? error : ''}
        />

        <InputField
          id="approachingValue"
          label="Approaching Value"
          placeholder="e.g., 2"
          value={approachingValue}
          onChange={(e) => setApproachingValue(e.target.value)}
          type="number"
          error={error && !approachingValue ? error : ''}
        />

        <Button
          onClick={calculateLimit}
          disabled={!expression || !variable || !approachingValue}
          className="w-full"
        >
          Calculate Limit
        </Button>

        {result && (
          <ResultDisplay title="Result">
            {result}
          </ResultDisplay>
        )}

        {error && !result && (
          <p className="text-red-500 font-medium mt-4">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Limits;
