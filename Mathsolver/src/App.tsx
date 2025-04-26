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
import About from './pages/About';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-blue-500 mb-3 animate-bounce"></div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
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