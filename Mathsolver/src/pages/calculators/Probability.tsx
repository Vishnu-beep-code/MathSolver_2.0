import React, { useState } from 'react';

type Mode = 'probability' | 'permutation' | 'combination' | 'binomial' | 'poisson' | 'expected';

const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

const Probability: React.FC = () => {
  const [mode, setMode] = useState<Mode>('probability');
  const [inputs, setInputs] = useState({
    favorable: '',
    total: '',
    n: '',
    r: '',
    p: '',
    k: '',
    lambda: '',
    values: '',
    probabilities: ''
  });
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setInputs({
      favorable: '',
      total: '',
      n: '',
      r: '',
      p: '',
      k: '',
      lambda: '',
      values: '',
      probabilities: ''
    });
    setResult([]);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const calculateProbability = (): string[] => {
    const fav = parseFloat(inputs.favorable);
    const tot = parseFloat(inputs.total);

    if (isNaN(fav) || isNaN(tot)) {
      setError('Please enter valid numbers.');
      return [];
    }
    if (tot === 0) {
      setError('Total outcomes must not be zero.');
      return [];
    }
    if (fav > tot) {
      setError('Favorable outcomes cannot be greater than total outcomes.');
      return [];
    }

    const prob = (fav / tot) * 100;
    return [`Probability: ${prob.toFixed(2)}%`];
  };

  const calculatePermutation = (): string[] => {
    const nVal = parseInt(inputs.n);
    const rVal = parseInt(inputs.r);

    if (isNaN(nVal) || isNaN(rVal) || nVal < 0 || rVal < 0) {
      setError('Please enter valid non-negative integers.');
      return [];
    }
    if (rVal > nVal) {
      setError('r cannot be greater than n.');
      return [];
    }

    const perm = factorial(nVal) / factorial(nVal - rVal);
    return [`Permutation (nPr): ${perm}`];
  };

  const calculateCombination = (): string[] => {
    const nVal = parseInt(inputs.n);
    const rVal = parseInt(inputs.r);

    if (isNaN(nVal) || isNaN(rVal) || nVal < 0 || rVal < 0) {
      setError('Please enter valid non-negative integers.');
      return [];
    }
    if (rVal > nVal) {
      setError('r cannot be greater than n.');
      return [];
    }

    const comb = factorial(nVal) / (factorial(rVal) * factorial(nVal - rVal));
    return [`Combination (nCr): ${comb}`];
  };

  const calculateBinomial = (): string[] => {
    const nVal = parseInt(inputs.n);
    const kVal = parseInt(inputs.k);
    const pVal = parseFloat(inputs.p);

    if (isNaN(nVal) || isNaN(kVal) || isNaN(pVal) || nVal < 0 || kVal < 0 || pVal < 0 || pVal > 1) {
      setError('Please enter valid values (n, k ≥ 0, 0 ≤ p ≤ 1).');
      return [];
    }
    if (kVal > nVal) {
      setError('k cannot be greater than n.');
      return [];
    }

    const comb = factorial(nVal) / (factorial(kVal) * factorial(nVal - kVal));
    const prob = comb * Math.pow(pVal, kVal) * Math.pow(1 - pVal, nVal - kVal);
    return [
      `Binomial Probability: ${prob.toFixed(6)}`,
      `Mean (μ): ${(nVal * pVal).toFixed(2)}`,
      `Variance (σ²): ${(nVal * pVal * (1 - pVal)).toFixed(2)}`
    ];
  };

  const calculatePoisson = (): string[] => {
    const lambda = parseFloat(inputs.lambda);
    const k = parseInt(inputs.k);

    if (isNaN(lambda) || isNaN(k) || lambda <= 0 || k < 0) {
      setError('Please enter valid values (λ > 0, k ≥ 0).');
      return [];
    }

    const prob = (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
    return [
      `Poisson Probability: ${prob.toFixed(6)}`,
      `Mean (μ): ${lambda.toFixed(2)}`,
      `Variance (σ²): ${lambda.toFixed(2)}`
    ];
  };

  const calculateExpectedValue = (): string[] => {
    const values = inputs.values.split(',').map(v => parseFloat(v.trim()));
    const probs = inputs.probabilities.split(',').map(p => parseFloat(p.trim()));

    if (values.length !== probs.length || values.some(isNaN) || probs.some(isNaN)) {
      setError('Please enter equal number of valid values and probabilities.');
      return [];
    }
    if (Math.abs(probs.reduce((a, b) => a + b, 0) - 1) > 0.0001) {
      setError('Probabilities must sum to 1.');
      return [];
    }

    const expected = values.reduce((sum, val, i) => sum + val * probs[i], 0);
    const variance = values.reduce((sum, val, i) => sum + Math.pow(val - expected, 2) * probs[i], 0);
    const stdDev = Math.sqrt(variance);

    return [
      `Expected Value (μ): ${expected.toFixed(4)}`,
      `Variance (σ²): ${variance.toFixed(4)}`,
      `Standard Deviation (σ): ${stdDev.toFixed(4)}`
    ];
  };

  const handleCalculate = () => {
    setError(null);
    setResult([]);

    let results: string[] = [];
    switch (mode) {
      case 'probability': results = calculateProbability(); break;
      case 'permutation': results = calculatePermutation(); break;
      case 'combination': results = calculateCombination(); break;
      case 'binomial': results = calculateBinomial(); break;
      case 'poisson': results = calculatePoisson(); break;
      case 'expected': results = calculateExpectedValue(); break;
    }
    
    if (results.length > 0) {
      setResult(results);
    }
  };


  const renderInputs = () => {
    switch (mode) {
      case 'probability':
        return (
          <>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-200">Favorable Outcomes</label>
              <input
                type="number"
                name="favorable"
                value={inputs.favorable}
                onChange={handleInputChange}
                placeholder="e.g., 3"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-200">Total Outcomes</label>
              <input
                type="number"
                name="total"
                value={inputs.total}
                onChange={handleInputChange}
                placeholder="e.g., 5"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </>
        );
      case 'permutation':
      case 'combination':
        return (
          <>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-200">n (Total items)</label>
              <input
                type="number"
                name="n"
                value={inputs.n}
                onChange={handleInputChange}
                placeholder="e.g., 5"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-200">r (Chosen items)</label>
              <input
                type="number"
                name="r"
                value={inputs.r}
                onChange={handleInputChange}
                placeholder="e.g., 2"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </>
        );
      case 'binomial':
        return (
          <>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-200">n (Trials)</label>
              <input
                type="number"
                name="n"
                value={inputs.n}
                onChange={handleInputChange}
                placeholder="e.g., 10"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-200">k (Successes)</label>
              <input
                type="number"
                name="k"
                value={inputs.k}
                onChange={handleInputChange}
                placeholder="e.g., 3"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-200">p (Probability of success)</label>
              <input
                type="number"
                name="p"
                value={inputs.p}
                onChange={handleInputChange}
                placeholder="e.g., 0.5"
                step="0.01"
                min="0"
                max="1"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </>
        );
      case 'poisson':
        return (
          <>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-200">λ (Average rate)</label>
              <input
                type="number"
                name="lambda"
                value={inputs.lambda}
                onChange={handleInputChange}
                placeholder="e.g., 3.5"
                step="0.1"
                min="0"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-200">k (Occurrences)</label>
              <input
                type="number"
                name="k"
                value={inputs.k}
                onChange={handleInputChange}
                placeholder="e.g., 2"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </>
        );
      case 'expected':
        return (
          <>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-200">Values (comma separated)</label>
              <input
                type="text"
                name="values"
                value={inputs.values}
                onChange={handleInputChange}
                placeholder="e.g., 1, 2, 3, 4"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-200">Probabilities (comma separated)</label>
              <input
                type="text"
                name="probabilities"
                value={inputs.probabilities}
                onChange={handleInputChange}
                placeholder="e.g., 0.1, 0.2, 0.3, 0.4"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Probability Calculator
      </h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {(['probability', 'permutation', 'combination', 'binomial', 'poisson', 'expected'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              reset();
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === m 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {renderInputs()}

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleCalculate}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Calculate
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>

      {result.length > 0 && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
          {result.map((line, i) => (
            <p key={i} className="mb-1 last:mb-0 text-green-800 dark:text-green-200">{line}</p>
          ))}
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Probability;