import React, { useState } from 'react';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import ResultDisplay from '../../components/ui/ResultDisplay';

const Algebra: React.FC = () => {
  const [equation, setEquation] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);

  const solveEquation = (equation: string): string => {
    // Updated regex: supports optional '*' between coefficient and x
    const regex = /([+-]?\d*)\*?x\s*([+-]\s*\d+)?\s*=\s*([+-]?\d+)/;
    const match = equation.replace(/\s+/g, '').match(regex);
  
    if (!match) {
      return 'Please enter a valid linear equation like "2x + 3 = 7" or "4*x = 10".';
    }
  
    // Extract a, b, c
    const a = match[1] === '' || match[1] === '+' ? 1 : match[1] === '-' ? -1 : parseInt(match[1]);
    const b = match[2] ? parseInt(match[2].replace(/\s+/g, '')) : 0;
    const c = parseInt(match[3]);
  
    // Solve for x
    const x = (c - b) / a;
  
    return `Solution: x = ${x}`;
  };
  

  const handleSolve = () => {
    if (!equation.trim()) {
      setResult('Please enter an equation');
      return;
    }

    const solution = solveEquation(equation);
    setResult(solution);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Algebra Calculator
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          <InputField
            id="equation"
            label="Enter Equation"
            placeholder="e.g., 2x + 3 = 7"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
          />

          <Button onClick={handleSolve} className="w-full">
            Solve Equation
          </Button>

          {result !== null && (
            <ResultDisplay title="Solution">
              {result}
            </ResultDisplay>
          )}
        </div>
      </div>
    </div>
  );
};

export default Algebra;
