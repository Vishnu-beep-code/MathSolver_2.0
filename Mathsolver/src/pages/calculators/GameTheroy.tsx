import React, { useState } from 'react';

const GameTheory: React.FC = () => {
  const [matrix, setMatrix] = useState([
    [{ a: 3, b: 2 }, { a: 1, b: 4 }],
    [{ a: 5, b: 0 }, { a: 2, b: 1 }],
  ]);

  const [nashEquilibria, setNashEquilibria] = useState<string[]>([]);

  const calculateNashEquilibrium = () => {
    const bestResponsesA = Array.from({ length: 2 }, (_, i) => {
      const best = Math.max(...matrix[i].map(cell => cell.a));
      return matrix[i].map(cell => cell.a === best);
    });

    const bestResponsesB = Array.from({ length: 2 }, (_, j) => {
      const best = Math.max(...[matrix[0][j].b, matrix[1][j].b]);
      return [matrix[0][j].b === best, matrix[1][j].b === best];
    });

    const results: string[] = [];

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        if (bestResponsesA[i][j] && bestResponsesB[j][i]) {
          results.push(`Nash Equilibrium at [${i + 1}, ${j + 1}] with Payoffs (A: ${matrix[i][j].a}, B: ${matrix[i][j].b})`);
        }
      }
    }

    setNashEquilibria(results.length ? results : ['No pure strategy Nash Equilibrium found.']);
  };

  const updateCell = (i: number, j: number, player: 'a' | 'b', value: number) => {
    const updated = [...matrix];
    updated[i][j][player] = value;
    setMatrix(updated);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Game Theory: Payoff Matrix</h1>

      <table className="w-full border text-center mb-4">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
            <th>Player A vs B</th>
            <th>Strategy 1</th>
            <th>Strategy 2</th>
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <td className="font-semibold text-gray-700 dark:text-gray-200">Strategy {i + 1}</td>
              {row.map((cell, j) => (
                <td key={j} className="p-2 border">
                  <div className="flex flex-col items-center justify-center text-sm gap-2">
                    <div className="flex items-center gap-1">
                      <span className="bg-white text-gray-800 px-1 rounded text-xs font-semibold border">A</span>
                      <input
                        type="number"
                        value={cell.a}
                        onChange={(e) => updateCell(i, j, 'a', Number(e.target.value))}
                        className="w-12 px-1 py-0.5 border rounded text-sm text-center"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="bg-white text-gray-800 px-1 rounded text-xs font-semibold border">B</span>
                      <input
                        type="number"
                        value={cell.b}
                        onChange={(e) => updateCell(i, j, 'b', Number(e.target.value))}
                        className="w-12 px-1 py-0.5 border rounded text-sm text-center"
                      />
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={calculateNashEquilibrium}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Calculate Nash Equilibrium
      </button>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">🧠 Result:</h2>
        <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300">
          {nashEquilibria.map((res, index) => (
            <li key={index}>{res}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-200">
        <h3 className="font-semibold mb-2">About</h3>
        <p>
          This tool calculates the Nash Equilibrium in a 2x2 payoff matrix for two players. You can edit the payoff
          values for each strategy and compute the result using pure strategy analysis.
        </p>
      </div>
    </div>
  );
};

export default GameTheory;
