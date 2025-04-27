import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registering necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraphPlotter: React.FC = () => {
  const [xValues, setXValues] = useState<number[]>([]);
  const [yValues, setYValues] = useState<number[]>([]);
  const [axisNames, setAxisNames] = useState({ x: 'X-Axis', y: 'Y-Axis' });
  const [history, setHistory] = useState<{ x: number; y: number }[]>([]); // Track history of plotted points
  
  // Temporary state to store the current input values
  const [currentX, setCurrentX] = useState<number | string>('');
  const [currentY, setCurrentY] = useState<number | string>('');

  const handleAddPoint = () => {
    if (currentX !== '' && currentY !== '') {
      const newX = Number(currentX);
      const newY = Number(currentY);
      setHistory((prev) => [...prev, { x: newX, y: newY }]);
      setXValues((prev) => [...prev, newX]);
      setYValues((prev) => [...prev, newY]);
      setCurrentX(''); // Clear input after adding point
      setCurrentY('');
    }
  };

  const handleReset = () => {
    setXValues([]);
    setYValues([]);
    setAxisNames({ x: 'X-Axis', y: 'Y-Axis' });
    setHistory([]); // Reset history
    setCurrentX(''); // Clear input
    setCurrentY('');
  };

  // Chart.js data structure
  const data = {
    labels: xValues,
    datasets: [
      {
        label: 'Graph Plot',
        data: yValues,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Chart.js options for custom axis labels
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Graph Plotter',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: axisNames.x,
        },
      },
      y: {
        title: {
          display: true,
          text: axisNames.y,
        },
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Graph Plotter</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Plot mathematical functions and visualize them on a coordinate plane.
        </p>

        {/* Graph plotting */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 flex items-center justify-center mt-4">
          {xValues.length > 0 && yValues.length > 0 ? (
            <Line data={data} options={options} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Add points to see the graph</p>
          )}
        </div>

        {/* Input for adding points */}
        <div className="mt-6 flex space-x-4">
          <input
            type="number"
            value={currentX}
            placeholder="X Value"
            className="p-2 border rounded"
            onChange={(e) => setCurrentX(e.target.value)}
          />
          <input
            type="number"
            value={currentY}
            placeholder="Y Value"
            className="p-2 border rounded"
            onChange={(e) => setCurrentY(e.target.value)}
          />
          <button
            className="bg-green-500 text-white p-2 rounded"
            onClick={handleAddPoint}
          >
            Add Point
          </button>
        </div>

        {/* Input for axis names */}
        <div className="mt-6 flex space-x-4">
          <input
            type="text"
            placeholder="X Axis Name"
            className="p-2 border rounded"
            onChange={(e) => setAxisNames((prev) => ({ ...prev, x: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Y Axis Name"
            className="p-2 border rounded"
            onChange={(e) => setAxisNames((prev) => ({ ...prev, y: e.target.value }))}
          />
        </div>

        {/* History of points */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">History of Points</h2>
          <ul className="list-disc pl-6">
            {history.map((point, index) => (
              <li key={index}>
                ({point.x}, {point.y})
              </li>
            ))}
          </ul>
        </div>

        {/* Reset Button */}
        <button
          className="bg-red-500 text-white p-2 rounded mt-4"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default GraphPlotter;
