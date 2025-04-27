import React, { useState } from 'react';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import ResultDisplay from '../../components/ui/ResultDisplay';

const Algebra: React.FC = () => {
  const [equation, setEquation] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [equationType, setEquationType] = useState<'linear' | 'quadratic' | 'cubic'>('linear');

  const solveLinearEquation = (equation: string): string => {
    // Updated regex: supports optional '*' between coefficient and x
    const regex = /([+-]?\d*)\*?x\s*([+-]\s*\d+)?\s*=\s*([+-]?\d+)/;
    const match = equation.replace(/\s+/g, '').match(regex);
  
    if (!match) {
      return 'Please enter a valid linear equation like "2x + 3 = 7" or "4*x = 10".';
    }
  
    // Extract a, b, c
    const a = match[1] === '' || match[1] === '+' ? 1 : match[1] === '-' ? -1 : parseInt(match[1]);
    const b = match[2] ? parseInt(match[2].replace(/\s+/g, '')) : 0;
    const c = parseInt(match[3]);
  
    // Solve for x
    const x = (c - b) / a;
  
    return `Solution: x = ${x}`;
  };

  const solveQuadraticEquation = (equation: string): string => {
    // Regex for ax² + bx + c = 0 or ax² + bx = c or similar forms
    // Matches: 2x² + 3x + 1 = 0, 4x² - 5x = 10, x² = 9, etc.
    const cleanEq = equation.replace(/\s+/g, '').replace(/\^2/g, '²');
    
    // Extract left and right sides
    const sides = cleanEq.split('=');
    if (sides.length !== 2) {
      return 'Please enter a valid quadratic equation (ax² + bx + c = 0).';
    }
    
    // Move everything to the left side
    let normalizedEq = sides[0] + '-(' + sides[1] + ')';
    
    // Convert to standard form coefficients
    let a = 0, b = 0, c = 0;
    
    // Extract x² coefficient
    const x2Match = normalizedEq.match(/([+-]?\d*)\*?x²/);
    if (x2Match) {
      a = x2Match[1] === '' || x2Match[1] === '+' ? 1 : x2Match[1] === '-' ? -1 : parseInt(x2Match[1]);
    }
    
    // Extract x coefficient
    const xMatch = normalizedEq.match(/([+-]?\d*)\*?x(?![²])/);
    if (xMatch) {
      b = xMatch[1] === '' || xMatch[1] === '+' ? 1 : xMatch[1] === '-' ? -1 : parseInt(xMatch[1]);
    }
    
    // Extract constant term
    const terms = normalizedEq.split(/[+-]/).filter(term => !term.includes('x'));
    terms.forEach(term => {
      if (term && !isNaN(parseInt(term))) {
        c += parseInt(term);
      }
    });
    
    // Check if it's actually quadratic
    if (a === 0) {
      return 'This is not a quadratic equation. The coefficient of x² must not be zero.';
    }
    
    // Calculate discriminant
    const discriminant = b * b - 4 * a * c;
    
    if (discriminant > 0) {
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      return `Solutions: x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`;
    } else if (discriminant === 0) {
      const x = -b / (2 * a);
      return `Solution: x = ${x.toFixed(4)} (double root)`;
    } else {
      const realPart = (-b / (2 * a)).toFixed(4);
      const imaginaryPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(4);
      return `Solutions: x₁ = ${realPart} + ${imaginaryPart}i, x₂ = ${realPart} - ${imaginaryPart}i`;
    }
  };

  const solveCubicEquation = (equation: string): string => {
    // Regex for ax³ + bx² + cx + d = 0 or similar forms
    const cleanEq = equation.replace(/\s+/g, '')
      .replace(/\^3/g, '³')
      .replace(/\^2/g, '²');
    
    // Extract left and right sides
    const sides = cleanEq.split('=');
    if (sides.length !== 2) {
      return 'Please enter a valid cubic equation (ax³ + bx² + cx + d = 0).';
    }
    
    // Move everything to the left side
    let normalizedEq = sides[0] + '-(' + sides[1] + ')';
    
    // Initialize coefficients
    let a = 0, b = 0, c = 0, d = 0;
    
    // Extract x³ coefficient
    const x3Match = normalizedEq.match(/([+-]?\d*)\*?x³/);
    if (x3Match) {
      a = x3Match[1] === '' || x3Match[1] === '+' ? 1 : x3Match[1] === '-' ? -1 : parseInt(x3Match[1]);
    }
    
    // Extract x² coefficient
    const x2Match = normalizedEq.match(/([+-]?\d*)\*?x²/);
    if (x2Match) {
      b = x2Match[1] === '' || x2Match[1] === '+' ? 1 : x2Match[1] === '-' ? -1 : parseInt(x2Match[1]);
    }
    
    // Extract x coefficient
    const xMatch = normalizedEq.match(/([+-]?\d*)\*?x(?![²³])/);
    if (xMatch) {
      c = xMatch[1] === '' || xMatch[1] === '+' ? 1 : xMatch[1] === '-' ? -1 : parseInt(xMatch[1]);
    }
    
    // Extract constant term
    const terms = normalizedEq.split(/[+-]/).filter(term => !term.includes('x'));
    terms.forEach(term => {
      if (term && !isNaN(parseInt(term))) {
        d += parseInt(term);
      }
    });
    
    // Check if it's actually cubic
    if (a === 0) {
      return 'This is not a cubic equation. The coefficient of x³ must not be zero.';
    }
    
    // Normalize equation to form x³ + px² + qx + r = 0
    const p = b / a;
    const q = c / a;
    const r = d / a;
    
    // Cardano's method for solving cubic equations
    const p_over_3 = p / 3;
    const q_over_3 = q / 3;
    const p_cubed = p_over_3 * p_over_3 * p_over_3;
    const q_squared = q_over_3 * q_over_3;
    
    const discriminant = q_squared - p_cubed;
    
    if (discriminant === 0) {
      // One or more repeated roots
      const u = Math.cbrt(-r / 2);
      const v = Math.cbrt(-r / 2);
      
      const x1 = u + v - p_over_3;
      const x2 = -(u + v) / 2 - p_over_3;
      
      if (u === v) {
        return `Solutions: x₁ = ${x1.toFixed(4)} (triple root)`;
      } else {
        return `Solutions: x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)} (double root)`;
      }
    } else if (discriminant > 0) {
      // One real root and two complex conjugate roots
      const sqrt_discriminant = Math.sqrt(discriminant);
      const u = Math.cbrt(-r / 2 + sqrt_discriminant);
      const v = Math.cbrt(-r / 2 - sqrt_discriminant);
      
      const x1 = u + v - p_over_3;
      const realPart = -(u + v) / 2 - p_over_3;
      const imaginaryPart = (Math.sqrt(3) / 2) * Math.abs(u - v);
      
      return `Solutions: x₁ = ${x1.toFixed(4)}, x₂ = ${realPart.toFixed(4)} + ${imaginaryPart.toFixed(4)}i, x₃ = ${realPart.toFixed(4)} - ${imaginaryPart.toFixed(4)}i`;
    } else {
      // Three real roots
      const theta = Math.acos(-r / (2 * Math.sqrt(-p_cubed)));
      const x1 = 2 * Math.sqrt(-p_over_3) * Math.cos(theta / 3) - p_over_3;
      const x2 = 2 * Math.sqrt(-p_over_3) * Math.cos((theta + 2 * Math.PI) / 3) - p_over_3;
      const x3 = 2 * Math.sqrt(-p_over_3) * Math.cos((theta + 4 * Math.PI) / 3) - p_over_3;
      
      return `Solutions: x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}, x₃ = ${x3.toFixed(4)}`;
    }
  };

  const handleSolve = () => {
    if (!equation.trim()) {
      setResult('Please enter an equation');
      return;
    }

    let solution;
    switch (equationType) {
      case 'linear':
        solution = solveLinearEquation(equation);
        break;
      case 'quadratic':
        solution = solveQuadraticEquation(equation);
        break;
      case 'cubic':
        solution = solveCubicEquation(equation);
        break;
      default:
        solution = 'Please select an equation type';
    }

    setResult(solution);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Advanced Algebra Calculator
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          <div className="flex space-x-4">
            <button 
              className={`flex-1 py-2 px-4 rounded-md ${equationType === 'linear' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setEquationType('linear')}
            >
              Linear
            </button>
            <button 
              className={`flex-1 py-2 px-4 rounded-md ${equationType === 'quadratic' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setEquationType('quadratic')}
            >
              Quadratic
            </button>
            <button 
              className={`flex-1 py-2 px-4 rounded-md ${equationType === 'cubic' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setEquationType('cubic')}
            >
              Cubic
            </button>
          </div>

          <InputField
            id="equation"
            label="Enter Equation"
            placeholder={
              equationType === 'linear' ? "e.g., 2x + 3 = 7" : 
              equationType === 'quadratic' ? "e.g., 2x² + 3x + 1 = 0" : 
              "e.g., x³ - 6x² + 11x - 6 = 0"
            }
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
          />

          <Button onClick={handleSolve} className="w-full">
            Solve Equation
          </Button>

          {result !== null && (
            <ResultDisplay title="Solution">
              {result}
            </ResultDisplay>
          )}

          <div className="mt-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Input Format Examples:</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Linear: 2x + 3 = 7, 4*x = 10, x - 5 = 0</li>
              <li>• Quadratic: 2x² + 3x + 1 = 0, 4x² - 5x = 10, x² = 9</li>
              <li>• Cubic: x³ - 6x² + 11x - 6 = 0, 2x³ + 3x² + 2x + 1 = 0</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Algebra;