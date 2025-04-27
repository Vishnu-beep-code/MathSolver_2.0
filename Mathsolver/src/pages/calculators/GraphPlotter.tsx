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

  const handleAddPoint = (x: number, y: number) => {
    setXValues((prev) => [...prev, x]);
    setYValues((prev) => [...prev, y]);
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
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 flex items-center justify-center">
          {xValues.length > 0 && yValues.length > 0 ? (
            <Line data={data} options={options} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Graph plotting functionality coming soon</p>
          )}
        </div>

        {/* Input for adding points */}
        <div className="mt-6 flex space-x-4">
          <input
            type="number"
            placeholder="X Value"
            className="p-2 border rounded"
            onChange={(e) => handleAddPoint(Number(e.target.value), 0)}
          />
          <input
            type="number"
            placeholder="Y Value"
            className="p-2 border rounded"
            onChange={(e) => handleAddPoint(0, Number(e.target.value))}
          />
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
      </div>
    </div>
  );
};

export default GraphPlotter;
