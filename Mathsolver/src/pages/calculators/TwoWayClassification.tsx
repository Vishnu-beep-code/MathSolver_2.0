import React, { useState } from 'react';

const TwoWayClassification: React.FC = () => {
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
    results.push('🔍 Step 1: Find N (Total number of observations)');
    const flatData = data.flat().map(Number);
    const N = flatData.length;
    results.push(`N = ${N}`);

    results.push('📊 Step 2: Find T (Grand Total of all observations)');
    const T = flatData.reduce((acc, val) => acc + val, 0);
    results.push(`T = ${T}`);

    results.push('➗ Step 3: Find T/N (Mean of all observations)');
    const TbyN = T / N;
    results.push(`T/N = ${TbyN.toFixed(4)}`);

    results.push('📈 Step 4: Calculate TSS = Σx² - (T² / N)');
    const sumSquares = flatData.reduce((acc, val) => acc + val * val, 0);
    const TSS = sumSquares - (T * T) / N;
    results.push(`Σx² = ${sumSquares}`);
    results.push(`TSS = ${TSS.toFixed(4)}`);

    results.push('📉 Step 5: Calculate SSR (Sum of Squares due to Rows)');
    let SSR = 0;
    for (let i = 0; i < rows; i++) {
      let rowSum = 0;
      for (let j = 0; j < cols; j++) {
        rowSum += Number(data[i][j]);
      }
      SSR += (rowSum * rowSum) / cols;
    }
    SSR -= (T * T) / N;
    results.push(`SSR = ${SSR.toFixed(4)}`);

    results.push('📉 Step 6: Calculate SSC (Sum of Squares due to Columns)');
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

    results.push('🧮 Step 7: Calculate SSE = TSS - SSR - SSC');
    const SSE = TSS - SSR - SSC;
    results.push(`SSE = ${SSE.toFixed(4)}`);

    results.push('📋 Step 8: ANOVA Table');
    const dfRows = rows - 1;
    const dfCols = cols - 1;
    const dfError = (rows - 1) * (cols - 1);
    const dfTotal = N - 1;
    const MSR = SSR / dfRows;
    const MSC = SSC / dfCols;
    const MSE = SSE / dfError;
    const FRow = MSR / MSE;
    const FCol = MSC / MSE;

    const anovaTable = [
      '| Source of Variation | Sum of Squares | Degrees of Freedom | Mean Sum of Squares | F-Ratio    |',
      '|----------------------|----------------|---------------------|----------------------|------------|',
      `| Rows (SSR)           | ${SSR.toFixed(4).padEnd(14)} | ${dfRows.toString().padEnd(19)} | ${MSR.toFixed(4).padEnd(20)} | ${FRow.toFixed(4).padEnd(10)} |`,
      `| Columns (SSC)        | ${SSC.toFixed(4).padEnd(14)} | ${dfCols.toString().padEnd(19)} | ${MSC.toFixed(4).padEnd(20)} | ${FCol.toFixed(4).padEnd(10)} |`,
      `| Error (SSE)          | ${SSE.toFixed(4).padEnd(14)} | ${dfError.toString().padEnd(19)} | ${MSE.toFixed(4).padEnd(20)} | ${''.padEnd(10)} |`,
      `| Total (TSS)          | ${TSS.toFixed(4).padEnd(14)} | ${dfTotal.toString().padEnd(19)} | ${''.padEnd(20)} | ${''.padEnd(10)} |`
    ].join('\n');

    results.push(anovaTable);

    results.push('🧾 Step 9: Conclusion');
    results.push(`If calculated FRow = ${FRow.toFixed(4)} > table F, reject H₀ (row effect significant)`);
    results.push(`If calculated FCol = ${FCol.toFixed(4)} > table F, reject H₀ (column effect significant)`);
    results.push(`Otherwise, accept H₀ (no significant difference)`);

    setStepResults(results);
  };

  const downloadResults = () => {
    const blob = new Blob([stepResults.join('\n')], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'two_way_classification_results.txt';
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">📌 Two Way Classification</h1>

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
          🧠 Solve
        </button>
        <button
          onClick={downloadResults}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
        >
          ⬇️ Download Results
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

export default TwoWayClassification;