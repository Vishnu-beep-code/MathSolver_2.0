import React, { useState } from 'react';

type Mode = 'probability' | 'permutation' | 'combination';

const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

const Probability: React.FC = () => {
  const [mode, setMode] = useState<Mode>('probability');

  const [favorable, setFavorable] = useState('');
  const [total, setTotal] = useState('');
  const [n, setN] = useState('');
  const [r, setR] = useState('');

  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFavorable('');
    setTotal('');
    setN('');
    setR('');
    setResult('');
    setError(null);
  };

  const handleCalculate = () => {
    setError(null);
    setResult('');

    if (mode === 'probability') {
      const fav = parseFloat(favorable);
      const tot = parseFloat(total);

      if (isNaN(fav) || isNaN(tot)) {
        setError('Please enter valid numbers.');
        return;
      }
      if (tot === 0) {
        setError('Total outcomes must not be zero.');
        return;
      }
      if (fav > tot) {
        setError('Favorable outcomes cannot be greater than total outcomes.');
        return;
      }

      const prob = (fav / tot) * 100;
      setResult(`Probability: ${prob.toFixed(2)}%`);
    }

    if (mode === 'permutation') {
      const nVal = parseInt(n);
      const rVal = parseInt(r);

      if (isNaN(nVal) || isNaN(rVal) || nVal < 0 || rVal < 0) {
        setError('Please enter valid non-negative integers.');
        return;
      }
      if (rVal > nVal) {
        setError('r cannot be greater than n.');
        return;
      }

      const perm = factorial(nVal) / factorial(nVal - rVal);
      setResult(`Permutation (nPr): ${perm}`);
    }

    if (mode === 'combination') {
      const nVal = parseInt(n);
      const rVal = parseInt(r);

      if (isNaN(nVal) || isNaN(rVal) || nVal < 0 || rVal < 0) {
        setError('Please enter valid non-negative integers.');
        return;
      }
      if (rVal > nVal) {
        setError('r cannot be greater than n.');
        return;
      }

      const comb = factorial(nVal) / (factorial(rVal) * factorial(nVal - rVal));
      setResult(`Combination (nCr): ${comb}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        {mode.charAt(0).toUpperCase() + mode.slice(1)} Calculator
      </h1>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => {
            setMode('probability');
            reset();
          }}
          className={`px-4 py-2 rounded-lg ${
            mode === 'probability' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Probability
        </button>
        <button
          onClick={() => {
            setMode('permutation');
            reset();
          }}
          className={`px-4 py-2 rounded-lg ${
            mode === 'permutation' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Permutation
        </button>
        <button
          onClick={() => {
            setMode('combination');
            reset();
          }}
          className={`px-4 py-2 rounded-lg ${
            mode === 'combination' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Combination
        </button>
      </div>

      {mode === 'probability' && (
        <>
          <label className="block mb-2 text-gray-700 dark:text-gray-200">Favorable Outcomes</label>
          <input
            type="number"
            value={favorable}
            onChange={(e) => setFavorable(e.target.value)}
            placeholder="e.g., 3"
            className="w-full p-2 mb-4 border rounded"
          />

          <label className="block mb-2 text-gray-700 dark:text-gray-200">Total Outcomes</label>
          <input
            type="number"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="e.g., 5"
            className="w-full p-2 mb-4 border rounded"
          />
        </>
      )}

      {(mode === 'permutation' || mode === 'combination') && (
        <>
          <label className="block mb-2 text-gray-700 dark:text-gray-200">n (Total items)</label>
          <input
            type="number"
            value={n}
            onChange={(e) => setN(e.target.value)}
            placeholder="e.g., 5"
            className="w-full p-2 mb-4 border rounded"
          />

          <label className="block mb-2 text-gray-700 dark:text-gray-200">r (Chosen items)</label>
          <input
            type="number"
            value={r}
            onChange={(e) => setR(e.target.value)}
            placeholder="e.g., 2"
            className="w-full p-2 mb-4 border rounded"
          />
        </>
      )}

      <button
        onClick={handleCalculate}
        className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Calculate
      </button>

      {result && <p className="mt-4 p-4 bg-green-100 text-green-800 rounded">{result}</p>}
      {error && <p className="mt-4 p-4 bg-red-100 text-red-800 rounded">{error}</p>}
    </div>
  );
};

export default Probability;
