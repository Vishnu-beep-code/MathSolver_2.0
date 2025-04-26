import React, { useState } from 'react';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import ResultDisplay from '../../components/ui/ResultDisplay';

const Statistics = () => {
  const [numbers, setNumbers] = useState('');
  const [results, setResults] = useState<{
    mean?: number;
    median?: number;
    mode?: number[];
    standardDeviation?: number;
  }>({});

  const calculateStatistics = () => {
    const values = numbers.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    
    if (values.length === 0) {
      return;
    }

    // Calculate mean
    const mean = values.reduce((a, b) => a + b, 0) / values.length;

    // Calculate median
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

    // Calculate mode
    const frequency: { [key: number]: number } = {};
    values.forEach(value => {
      frequency[value] = (frequency[value] || 0) + 1;
    });
    const maxFrequency = Math.max(...Object.values(frequency));
    const mode = Object.entries(frequency)
      .filter(([_, freq]) => freq === maxFrequency)
      .map(([value]) => parseFloat(value));

    // Calculate standard deviation
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);

    setResults({
      mean: Number(mean.toFixed(4)),
      median: Number(median.toFixed(4)),
      mode: mode.map(n => Number(n.toFixed(4))),
      standardDeviation: Number(standardDeviation.toFixed(4))
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Statistics Calculator
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <InputField
          label="Enter numbers (comma-separated)"
          value={numbers}
          onChange={(e) => setNumbers(e.target.value)}
          placeholder="e.g., 1, 2, 3, 4, 5"
        />
        
        <div className="mt-4">
          <Button onClick={calculateStatistics}>
            Calculate Statistics
          </Button>
        </div>

        {Object.keys(results).length > 0 && (
          <div className="mt-6 space-y-4">
            <ResultDisplay label="Mean" value={results.mean?.toString()} />
            <ResultDisplay label="Median" value={results.median?.toString()} />
            <ResultDisplay 
              label="Mode" 
              value={results.mode?.length ? results.mode.join(', ') : 'No mode'} 
            />
            <ResultDisplay 
              label="Standard Deviation" 
              value={results.standardDeviation?.toString()} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;