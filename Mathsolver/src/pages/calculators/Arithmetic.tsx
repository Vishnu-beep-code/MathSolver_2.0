import React, { useState } from 'react';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import ResultDisplay from '../../components/ui/ResultDisplay';

const Arithmetic = () => {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operation, setOperation] = useState('+');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const a = parseFloat(num1);
    const b = parseFloat(num2);

    if (isNaN(a) || isNaN(b)) {
      return;
    }

    let calculatedResult: number;
    switch (operation) {
      case '+':
        calculatedResult = a + b;
        break;
      case '-':
        calculatedResult = a - b;
        break;
      case '*':
        calculatedResult = a * b;
        break;
      case '/':
        calculatedResult = b !== 0 ? a / b : NaN;
        break;
      default:
        return;
    }

    setResult(calculatedResult);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Arithmetic Calculator</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid gap-6">
          <InputField
            label="First Number"
            type="number"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            placeholder="Enter first number"
          />
          
          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Operation
            </label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="+">Addition (+)</option>
              <option value="-">Subtraction (-)</option>
              <option value="*">Multiplication (×)</option>
              <option value="/">Division (÷)</option>
            </select>
          </div>

          <InputField
            label="Second Number"
            type="number"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            placeholder="Enter second number"
          />

          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
        </div>

        {result !== null && (
          <ResultDisplay
            label="Result"
            value={isNaN(result) ? 'Error' : result.toString()}
          />
        )}
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-semibold mb-4">How to use</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Enter the first number in the first input field</li>
          <li>Select the desired arithmetic operation from the dropdown</li>
          <li>Enter the second number in the second input field</li>
          <li>Click "Calculate" to see the result</li>
          <li>For division, ensure the second number is not zero</li>
        </ul>
      </div>
    </div>
  );
};

export default Arithmetic;