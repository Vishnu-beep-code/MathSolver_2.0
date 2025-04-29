import React, { useEffect, useRef, useState } from 'react';

const BrownianMotion: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(2);
  const animationRef = useRef<number | null>(null);

  const position = useRef({ x: 300, y: 150 });

  const randomStep = () => {
    return Math.random() * 2 - 1; // Step in range [-1, 1]
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = position.current;
    const dx = randomStep() * speed;
    const dy = randomStep() * speed;

    const newX = Math.max(0, Math.min(canvas.width, x + dx));
    const newY = Math.max(0, Math.min(canvas.height, y + dy));

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(newX, newY);
    ctx.strokeStyle = '#4f46e5';
    ctx.stroke();

    position.current = { x: newX, y: newY };
  };

  const animate = () => {
    draw();
    animationRef.current = requestAnimationFrame(animate);
  };

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const stop = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsRunning(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      position.current = { x: canvas.width / 2, y: canvas.height / 2 };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 600;
      canvas.height = 300;
      clearCanvas();
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Brownian Motion (Random Process)</h2>

      <canvas ref={canvasRef} className="border rounded w-full bg-white dark:bg-gray-700" />

      <div className="mt-4 flex flex-col gap-2">
        <label className="text-gray-700 dark:text-gray-300">
          Step Speed: <strong>{speed}</strong>
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full"
        />

        <div className="flex gap-2 mt-2">
          <button
            onClick={start}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            Start
          </button>
          <button
            onClick={stop}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
          >
            Stop
          </button>
          <button
            onClick={clearCanvas}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-full"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 dark:bg-gray-700 p-4 rounded text-gray-700 dark:text-gray-200">
        <h3 className="font-semibold mb-2">What is Brownian Motion?</h3>
        <p>
          Brownian motion is a random process that models the random movement of particles suspended in a fluid. This
          simulation shows a simple 2D version using random steps to illustrate the concept.
        </p>
      </div>
    </div>
  );
};

export default BrownianMotion;
