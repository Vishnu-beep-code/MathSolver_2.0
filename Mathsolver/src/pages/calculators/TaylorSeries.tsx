import React, { useState } from 'react';

type ODEFunction = (x: number, y: number) => number;
type DerivativeFunction = (x: number, y: number, f: ODEFunction) => number;

const TaylorSeriesMethod: React.FC = () => {
  const [x0, setX0] = useState<number>(0);
  const [y0, setY0] = useState<number>(1);
  const [h, setH] = useState<number>(0.1);
  const [steps, setSteps] = useState<number>(10);
  const [results, setResults] = useState<string[]>([]);

  const f: ODEFunction = (x, y) => x + y;
  const fPrime: DerivativeFunction = (x, y, f) => f(x, y);
  const fDoublePrime: DerivativeFunction = (x, y, f) => f(x, y) + 1;
  const fTriplePrime: DerivativeFunction = (x, y, f) => 2;

  const computeTaylorStep = (x: number, y: number, h: number): number => {
    const term1 = f(x, y);
    const term2 = fDoublePrime(x, y, f) * Math.pow(h, 2) / 2;
    const term3 = fTriplePrime(x, y, f) * Math.pow(h, 3) / 6;
    return y + h * term1 + term2 + term3;
  };

  const solveODE = () => {
    let x = x0;
    let y = y0;
    const newResults: string[] = [];
    newResults.push(`🟡 x₀ = ${x}, y₀ = ${y}`);

    for (let i = 1; i <= steps; i++) {
      y = computeTaylorStep(x, y, h);
      x += h;
      newResults.push(`✅ Step ${i}: x = ${x.toFixed(4)}, y = ${y.toFixed(6)}`);
    }

    setResults(newResults);
  };

  const downloadResults = () => {
    const blob = new Blob([results.join('\n')], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'taylor_series_results.txt';
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6">
      <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">📘 Taylor's Series Method for ODE</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="x0" className="block font-medium text-gray-700 mb-1">Initial x (x₀):</label>
          <input
            type="number"
            id="x0"
            value={x0}
            onChange={(e) => setX0(parseFloat(e.target.value))}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="y0" className="block font-medium text-gray-700 mb-1">Initial y (y₀):</label>
          <input
            type="number"
            id="y0"
            value={y0}
            onChange={(e) => setY0(parseFloat(e.target.value))}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="h" className="block font-medium text-gray-700 mb-1">Step Size (h):</label>
          <input
            type="number"
            id="h"
            value={h}
            onChange={(e) => setH(parseFloat(e.target.value))}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="steps" className="block font-medium text-gray-700 mb-1">Number of Steps:</label>
          <input
            type="number"
            id="steps"
            value={steps}
            onChange={(e) => setSteps(parseInt(e.target.value))}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <button
          onClick={solveODE}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
        >
          🚀 Solve ODE
        </button>
        <button
          onClick={downloadResults}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
        >
          ⬇️ Download Results
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">📄 Step-by-Step Results</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {results.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaylorSeriesMethod;
