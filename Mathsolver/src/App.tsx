import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Differentiation from './pages/calculators/Differentiation';
import Integration from './pages/calculators/Integration';
import Probability from './pages/calculators/Probability';
import Statistics from './pages/calculators/Statistics';
import Algebra from './pages/calculators/Algebra';
import Matrix from './pages/calculators/Matrix';
import GraphPlotter from './pages/calculators/GraphPlotter';
import Limits from './pages/calculators/Limits';
import Arithmetic from './pages/calculators/Arithmetic';
import RSAEncryptionAlgorithm from './pages/calculators/RSAEncryptionAlgorithm';
import GameTheroy from './pages/calculators/GameTheroy';
import BrownianMotion from './pages/calculators/BrownianMotion';
import About from './pages/About';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [mathSymbols, setMathSymbols] = useState<string[]>([]);

  useEffect(() => {
    // Initialize math symbols
    const symbols = ['π', '∑', '∫', '∂', 'Δ', '∇', '√', '∝', '∞', '≈', '≠', '≤', '≥', '±', '∴', '∵', 'θ', 'λ', 'σ', 'ω'];
    const randomSymbols = Array.from({ length: 50 }, () => 
      symbols[Math.floor(Math.random() * symbols.length)]
    );
    setMathSymbols(randomSymbols);

    // 5-second loading simulation with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsLoading(false);
        }
        return newProgress;
      });
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center text-center overflow-hidden relative">
        {/* Falling math symbols background */}
        <div className="absolute inset-0 overflow-hidden">
          {mathSymbols.map((symbol, i) => (
            <span 
              key={i}
              className="absolute text-gray-400 dark:text-gray-600 text-xl opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${-10 - Math.random() * 20}%`,
                animation: `fall ${5 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              {symbol}
            </span>
          ))}
        </div>

        {/* MathSolver Title */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-700 dark:to-blue-900 text-white rounded-xl p-8 md:p-12 mb-8 z-10">
          <h1 className="text-4xl md:text-6xl font-bold font-mono tracking-tight">
            Math<span className="text-yellow-300">Solver<span className="text-blue-300">2.0</span></span>
          </h1>
        </div>

        {/* Animated equation */}
        <div className="relative z-10 mb-12">
          <div className="text-4xl md:text-5xl font-mono text-gray-800 dark:text-gray-200 mb-2">
            <span className="animate-pulse">∫</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>e</span>
            <sup className="animate-pulse" style={{ animationDelay: '0.4s' }}>x</sup>
            <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>dx</span>
            <span className="animate-pulse" style={{ animationDelay: '0.8s' }}>=</span>
            <span className="animate-bounce" style={{ animationDelay: '1s' }}>e</span>
            <sup className="animate-pulse" style={{ animationDelay: '1.2s' }}>x</sup>
            <span className="animate-bounce" style={{ animationDelay: '1.4s' }}>+</span>
            <span className="animate-pulse" style={{ animationDelay: '1.6s' }}>C</span>
          </div>
        </div>

        {/* Progress bar with math styling */}
        <div className="w-64 md:w-96 bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6 relative overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-white">
              {progress}%
            </div>
          </div>
        </div>

        {/* Loading text with math terms */}
        <div className="text-xl text-gray-700 dark:text-gray-300 font-mono">
          <span className="animate-pulse">Computing</span>
          <span className="mx-2">·</span>
          <span className="animate-pulse" style={{ animationDelay: '0.3s' }}>Deriving</span>
          <span className="mx-2">·</span>
          <span className="animate-pulse" style={{ animationDelay: '0.6s' }}>Integrating</span>
          <span className="mx-2">·</span>
          <span className="animate-pulse" style={{ animationDelay: '0.9s' }}>Solving</span>
        </div>

        {/* CSS for falling animation */}
        <style>{`
          @keyframes fall {
            to {
              transform: translateY(110vh);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/differentiation" element={<Differentiation />} />
              <Route path="/integration" element={<Integration />} />
              <Route path="/probability" element={<Probability />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/algebra" element={<Algebra />} />
              <Route path="/matrix" element={<Matrix />} />
              <Route path="/graph-plotter" element={<GraphPlotter />} />
              <Route path="/limits" element={<Limits />} />
              <Route path="/arithmetic" element={<Arithmetic />} />
              <Route path="/rsa-encryption" element={<RSAEncryptionAlgorithm />} />
              <Route path="/brownian-motion" element={<BrownianMotion />} />
              <Route path="/game-theory" element={<GameTheroy />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
