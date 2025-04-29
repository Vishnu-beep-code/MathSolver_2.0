import React, { useState } from 'react';

const OneWayClassification: React.FC = () => {
  const [rows, setRows] = useState<number>(2);
  const [cols, setCols] = useState<number>(2);
  const [data, setData] = useState<string[][]>(Array(2).fill(Array(2).fill('')));
  const [stepResults, setStepResults] = useState<string[]>([]);

  const handleRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRows = parseInt(e.target.value);
    setRows(newRows);
    setData(Array(newRows).fill(Array(cols).fill('')));
  };

  const handleColChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCols = parseInt(e.target.value);
    setCols(newCols);
    setData(Array(rows).fill(Array(newCols).fill('')));
  };

  const handleDataChange = (row: number, col: number, value: string) => {
    const newData = data.map((r, i) =>
      i === row ? r.map((c, j) => (j === col ? value : c)) : r
    );
    setData(newData);
  };

  const solveClassification = () => {
    const results: string[] = [];
    results.push('Step 1: Find N (Total number of observations)');
    const flatData = data.flat().map(Number);
    const N = flatData.length;
    results.push(`N = ${N}`);

    results.push('Step 2: Find T (Grand Total of all observations)');
    const T = flatData.reduce((acc, val) => acc + val, 0);
    results.push(`T = ${T}`);

    results.push('➗ Step 3: Find T/N (Mean of all observations)');
    const TbyN = T / N;
    results.push(`T/N = ${TbyN.toFixed(4)}`);

    results.push('Step 4: Calculate TSS = Σx² - (T² / N)');
    const sumSquares = flatData.reduce((acc, val) => acc + val * val, 0);
    const TSS = sumSquares - (T * T) / N;
    results.push(`Σx² = ${sumSquares}`);
    results.push(`TSS = ${TSS.toFixed(4)}`);

    results.push('Step 5: Calculate SSC (Sum of Squares Between Groups)');
    let SSC = 0;
    for (let j = 0; j < cols; j++) {
      let colSum = 0;
      for (let i = 0; i < rows; i++) {
        colSum += Number(data[i][j]);
      }
      SSC += (colSum * colSum) / rows;
    }
    SSC -= (T * T) / N;
    results.push(`SSC = ${SSC.toFixed(4)}`);

    results.push('Step 6: Calculate SSE = TSS - SSC');
    const SSE = TSS - SSC;
    results.push(`SSE = ${SSE.toFixed(4)}`);

    results.push('Step 7: ANOVA Table');
    const dfColumns = cols - 1;
    const dfError = N - cols;
    const dfTotal = N - 1;
    const MSC = SSC / dfColumns;
    const MSE = SSE / dfError;
    const F = MSC / MSE;

    const anovaTable = [
      '| Source of Variation | Sum of Squares | Degrees of Freedom | Mean Sum of Squares | F-Ratio    |',
      '|----------------------|----------------|---------------------|----------------------|------------|',
      `| Between Columns (SSC)| ${SSC.toFixed(4).padEnd(14)} | ${dfColumns.toString().padEnd(19)} | ${MSC.toFixed(4).padEnd(20)} | ${F.toFixed(4).padEnd(10)} |`,
      `| Within Columns (SSE) | ${SSE.toFixed(4).padEnd(14)} | ${dfError.toString().padEnd(19)} | ${MSE.toFixed(4).padEnd(20)} | ${''.padEnd(10)} |`,
      `| Total (TSS)          | ${TSS.toFixed(4).padEnd(14)} | ${dfTotal.toString().padEnd(19)} | ${''.padEnd(20)} | ${''.padEnd(10)} |`
    ].join('\n');

    results.push(anovaTable);

    results.push('Step 8: Conclusion');
    results.push(`If calculated F = ${F.toFixed(4)} > table F, reject H₀ (significant difference)`);
    results.push(`If calculated F = ${F.toFixed(4)} ≤ table F, accept H₀ (no significant difference)`);

    setStepResults(results);
  };

  const downloadResults = () => {
    const blob = new Blob([stepResults.join('\n')], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'classification_results.txt';
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">📌 One Way Classification</h1>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Number of Rows</label>
          <input
            type="number"
            value={rows}
            onChange={handleRowChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Number of Columns</label>
          <input
            type="number"
            value={cols}
            onChange={handleColChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="overflow-x-auto mb-6">
        <div className="grid gap-4">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: cols }).map((_, colIndex) => (
                <input
                  key={colIndex}
                  type="text"
                  placeholder={`(${rowIndex + 1}, ${colIndex + 1})`}
                  value={data[rowIndex][colIndex] || ''}
                  onChange={(e) => handleDataChange(rowIndex, colIndex, e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <button
          onClick={solveClassification}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
        >
          Solve
        </button>
        <button
          onClick={downloadResults}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
        >
          Download Results
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">📄 Step-by-Step Results</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {stepResults.map((result, index) => (
            <li key={index} className="whitespace-pre-wrap">{result}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OneWayClassification;