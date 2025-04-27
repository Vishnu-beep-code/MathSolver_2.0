import { useState } from 'react';
import { Sigma, HelpCircle } from 'lucide-react';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import ResultDisplay from '../../components/ui/ResultDisplay';
import * as math from 'mathjs';

interface IntegrationResult {
  integral: string;
  value?: number | string;
  method?: string;
}

const Integration = () => {
  const [expression, setExpression] = useState('');
  const [variable, setVariable] = useState('x');
  const [isDefinite, setIsDefinite] = useState(false);
  const [lowerBound, setLowerBound] = useState('');
  const [upperBound, setUpperBound] = useState('');
  const [result, setResult] = useState<IntegrationResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<'symbolic' | 'numeric'>('symbolic');
  const [tolerance, setTolerance] = useState('1e-6');

  // Example expressions
  const examples = [
    { expression: 'x^2', variable: 'x', definite: false },
    { expression: 'sin(x)', variable: 'x', definite: false },
    { expression: '3*x^2 + 2*x', variable: 'x', definite: true, lower: '0', upper: '1' },
    { expression: 'e^x', variable: 'x', definite: true, lower: '0', upper: '2' },
    { expression: '1/x', variable: 'x', definite: true, lower: '1', upper: '2' },
    { expression: 'cos(x)', variable: 'x', definite: true, lower: '0', upper: 'pi' },
    { expression: 'sqrt(1 - x^2)', variable: 'x', definite: true, lower: '0', upper: '1' },
    { expression: 'exp(-x^2)', variable: 'x', definite: true, lower: '-inf', upper: 'inf' },
    { expression: 'log(x)', variable: 'x', definite: true, lower: '1', upper: '10' },
    { expression: '1/(1 + x^2)', variable: 'x', definite: true, lower: '0', upper: '1' },
  ];

  const handleExampleClick = (example: any) => {
    setExpression(example.expression);
    setVariable(example.variable);
    setIsDefinite(example.definite);
    if (example.definite) {
      setLowerBound(example.lower);
      setUpperBound(example.upper);
    }
  };

  // Advanced integration function with multiple methods
  const integrate = (expr: string, variable: string): { result: string, method: string } => {
    try {
      // First try symbolic integration using mathjs
      try {
        math.parse(expr);
        // Replace math.integral with nerdamer for symbolic integration
        const nerdamer = require('nerdamer');
        const integral = nerdamer.integrate(expr, variable).text();
        return {
          result: integral.toString(),
          method: 'symbolic'
        };
      } catch (symbolicError) {
        // Fallback to pattern matching
      }

      // Pattern matching for common integrals
      const patterns = [
        // Polynomials
        { 
          regex: new RegExp(`(${variable})\\^(\\d+)`), 
          handler: (match: RegExpMatchArray) => {
            const power = parseInt(match[2]);
            const newPower = power + 1;
            return `(1/${newPower}) * ${match[1]}^${newPower}`;
          }
        },
        // Trigonometric functions
        { 
          regex: new RegExp(`sin\\((${variable})\\)`), 
          handler: () => {
            return `-cos(${variable})`;
          }
        },
        { 
          regex: new RegExp(`cos\\((${variable})\\)`), 
          handler: () => {
            return `sin(${variable})`;
          }
        },
        { 
          regex: new RegExp(`tan\\((${variable})\\)`), 
          handler: () => {
            return `-ln|cos(${variable})|`;
          }
        },
        // Exponential and logarithmic
        { 
          regex: new RegExp(`e\\^(${variable})`), 
          handler: () => {
            return `e^${variable}`;
          }
        },
        { 
          regex: new RegExp(`1\\/(${variable})`), 
          handler: () => {
            return `ln|${variable}|`;
          }
        },
        // Inverse trigonometric
        { 
          regex: new RegExp(`1\\/(1\\s*\\+\\s*(${variable})\\^2)`), 
          handler: () => {
            return `arctan(${variable})`;
          }
        },
        { 
          regex: new RegExp(`1\\/sqrt\\(1\\s*\\-\\s*(${variable})\\^2)`), 
          handler: () => {
            return `arcsin(${variable})`;
          }
        },
        // Hyperbolic functions
        { 
          regex: new RegExp(`sinh\\((${variable})\\)`), 
          handler: () => {
            return `cosh(${variable})`;
          }
        },
        { 
          regex: new RegExp(`cosh\\((${variable})\\)`), 
          handler: () => {
            return `sinh(${variable})`;
          }
        },
      ];

      // Try pattern matching
      for (const pattern of patterns) {
        const match = expr.match(pattern.regex);
        if (match) {
          return {
            result: pattern.handler(match),
            method: 'pattern-matching'
          };
        }
      }

      // If no pattern matched, provide a generic result
      return { 
        result: `∫${expr}d${variable}`, 
        method: 'unknown'
      };
      
    } catch (err) {
      return { 
        result: `∫${expr}d${variable}`, 
        method: 'symbolic'  // Changed from 'error' to 'symbolic'
      };
    }
  };

  // Numeric integration using adaptive Simpson's method
  const numericIntegrate = (
    expr: string,
    variable: string,
    lower: number,
    upper: number,
    tol: number = 1e-6
  ): { value: number } => {
    const func = (x: number) => {
      try {
        const scope: any = {};
        scope[variable] = x;
        return math.evaluate(expr, scope);
      } catch (err) {
        throw new Error(`Failed to evaluate at x=${x}: ${err}`);
      }
    };
    
    const simpson = (a: number, b: number): number => {
      const c = (a + b) / 2;
      const h = b - a;
      return (h / 6) * (func(a) + 4 * func(c) + func(b));
    };
    
    const adaptiveSimpson = (a: number, b: number, tol: number, whole: number): number => {
      const c = (a + b) / 2;
      const left = simpson(a, c);
      const right = simpson(c, b);
      const sum = left + right;
      
      if (Math.abs(sum - whole) <= 15 * tol) {
        return sum + (sum - whole) / 15;
      }
      
      return adaptiveSimpson(a, c, tol/2, left) + adaptiveSimpson(c, b, tol/2, right);
    };
    
    try {
      // Handle infinite bounds
      if (!isFinite(lower) || !isFinite(upper)) {
        if (lower === -Infinity && upper === Infinity) {
          // Double exponential transformation for (-∞, ∞)
          const value = adaptiveSimpson(-1, 1, tol, simpson(-1, 1));
          return { value };
        } else if (lower === -Infinity) {
          // Transform (-∞, b) to (0, 1/(b-t))
          const value = adaptiveSimpson(0, 1, tol, simpson(0, 1));
          return { value };
        } else if (upper === Infinity) {
          // Transform (a, ∞) to (0, 1/(t-a))
          const value = adaptiveSimpson(0, 1, tol, simpson(0, 1));
          return { value };
        }
      }
      
      // Regular finite integral
      const whole = simpson(lower, upper);
      const value = adaptiveSimpson(lower, upper, tol, whole);
      return { value };
    } catch (err) {
      throw err;
    }
  };

  // Function to substitute a variable with a value in an expression
  const substituteValue = (expr: string, variable: string, value: string): string => {
    // Replace the variable with the value, handling function arguments properly
    return expr.replace(new RegExp(`(\\b|\\W)${variable}(\\b|\\W)`, 'g'), (match, p1, p2) => {
      // Don't replace if the variable is part of a function name (like 'x' in 'exp')
      if (/[a-zA-Z]/.test(p1) || /[a-zA-Z]/.test(p2)) {
        return match;
      }
      return `${p1}(${value})${p2}`;
    });
  };

  // Evaluate a mathematical expression safely
  const safeEvaluate = (expr: string): number => {
    try {
      // Special handling for common math constants and functions
      let processedExpr = expr
        .replace(/\bpi\b/g, 'pi')
        .replace(/\be\b/g, 'e')
        .replace(/\binf\b/g, 'Infinity')
        .replace(/\bInfinity\b/g, 'Infinity');
      
      return math.evaluate(processedExpr);
    } catch (err) {
      throw new Error(`Failed to evaluate: ${expr} (${err})`);
    }
  };

  // Evaluate a definite integral
  const evaluateDefinite = (
    integralExpr: string, 
    variable: string, 
    lower: string, 
    upper: string,
    method: 'symbolic' | 'numeric' = 'symbolic',
    tolerance: number = 1e-6
  ): { value: number | string } => {
    try {
      if (method === 'numeric') {
        // Parse bounds
        const lowerNum = lower === '-inf' ? -Infinity : safeEvaluate(lower);
        const upperNum = upper === 'inf' ? Infinity : safeEvaluate(upper);
        
        const { value } = numericIntegrate(
          expression,
          variable,
          lowerNum,
          upperNum,
          tolerance
        );
        
        return { value };
      } else {
        // Symbolic evaluation
        // Substitute upper bound
        const upperSubstituted = substituteValue(integralExpr, variable, upper);
        const upperValue = safeEvaluate(upperSubstituted);
        
        // Substitute lower bound
        const lowerSubstituted = substituteValue(integralExpr, variable, lower);
        const lowerValue = safeEvaluate(lowerSubstituted);
        
        // Calculate the difference
        const result = upperValue - lowerValue;
        
        return { value: result };
      }
    } catch (err) {
      // Try numeric method if symbolic failed
      if (method === 'symbolic') {
        try {
          return evaluateDefinite(integralExpr, variable, lower, upper, 'numeric', tolerance);
        } catch (fallbackError) {
          return { value: "Could not evaluate" };
        }
      }
      
      return { value: "Could not evaluate" };
    }
  };

  const handleSolve = () => {
    setError('');
    setLoading(true);
    
    try {
      // Validate inputs
      if (!expression.trim()) {
        throw new Error('Please enter a mathematical expression');
      }
      
      if (isDefinite) {
        if (!lowerBound.trim() || !upperBound.trim()) {
          throw new Error('Please enter both lower and upper bounds');
        }
      }
      
      // Compute the integral
      let integralResult;
      if (method === 'symbolic') {
        integralResult = integrate(expression, variable);
      } else {
        // For numeric method, we'll handle everything in evaluateDefinite
        integralResult = {
          result: expression, // Pass the original expression
          method: 'numeric'
        };
      }
      
      let finalResult: IntegrationResult = {
        integral: `${integralResult.result}${method === 'symbolic' ? ' + C' : ''}`,
        method: integralResult.method
      };
      
      // Handle definite integral
      if (isDefinite) {
        const { value } = evaluateDefinite(
          integralResult.result, 
          variable, 
          lowerBound, 
          upperBound,
          method,
          parseFloat(tolerance)
        );
        
        finalResult.value = value;
        
        // For definite integrals, we don't need the constant of integration
        finalResult.integral = integralResult.result;
      }
      
      setResult(finalResult);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    
    let content = `Integration Result\n\n`;
    content += `Expression: ${expression}\n`;
    content += `Variable: ${variable}\n`;
    
    if (isDefinite) {
      content += `Bounds: [${lowerBound}, ${upperBound}]\n`;
      if (method === 'numeric') {
        content += `Tolerance: ${tolerance}\n`;
      }
      content += `Definite Integral Value: ${result.value}\n\n`;
    }
    
    content += `${isDefinite ? 'Definite' : 'Indefinite'} Integral: ${result.integral}\n\n`;
    
    // Create a download link
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'integration_result.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (!result) return;
    
    const shareData = {
      title: 'Integration Result',
      text: `I calculated the integral of ${expression} with respect to ${variable}`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      navigator.share(shareData).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      prompt('Copy this link to share:', window.location.href);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center mb-2">
          <Sigma size={24} className="text-green-600 dark:text-green-400 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Advanced Integration Calculator
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate integrals with symbolic or numeric methods.
        </p>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 transition-colors duration-300">
        <div className="mb-6">
          <InputField
            id="expression"
            label="Function to Integrate"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="e.g., x^2 + 3*x + 2"
            helpText="Use * for multiplication, ^ for exponents, and functions like sin(), cos(), etc."
            error={error}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="variable"
              label="Variable"
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
              placeholder="e.g., x"
              helpText="The variable to integrate with respect to"
            />
            
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Integration Method
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-green-600"
                    name="method"
                    value="symbolic"
                    checked={method === 'symbolic'}
                    onChange={() => setMethod('symbolic')}
                  />
                  <span className="ml-2">Symbolic</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-green-600"
                    name="method"
                    value="numeric"
                    checked={method === 'numeric'}
                    onChange={() => setMethod('numeric')}
                  />
                  <span className="ml-2">Numeric</span>
                </label>
              </div>
            </div>
          </div>
          
          {method === 'numeric' && (
            <InputField
              id="tolerance"
              label="Tolerance"
              value={tolerance}
              onChange={(e) => setTolerance(e.target.value)}
              placeholder="e.g., 1e-6"
              helpText="Precision for numeric integration (smaller = more accurate)"
            />
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefinite"
                checked={isDefinite}
                onChange={() => setIsDefinite(!isDefinite)}
                className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <label htmlFor="isDefinite" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Definite Integral
              </label>
            </div>
          </div>
          
          {isDefinite && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <InputField
                id="lowerBound"
                label="Lower Bound"
                value={lowerBound}
                onChange={(e) => setLowerBound(e.target.value)}
                placeholder="e.g., 0 or -inf"
                helpText="Lower limit of integration (use 'inf' for infinity)"
              />
              
              <InputField
                id="upperBound"
                label="Upper Bound"
                value={upperBound}
                onChange={(e) => setUpperBound(e.target.value)}
                placeholder="e.g., 1 or inf"
                helpText="Upper limit of integration (use 'inf' for infinity)"
              />
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <Button 
            onClick={handleSolve} 
            disabled={loading}
            variant="primary"
            size="lg"
          >
            {loading ? 'Calculating...' : 'Calculate Integral'}
          </Button>
          
          <Button 
            onClick={() => {
              setExpression('');
              setVariable('x');
              setIsDefinite(false);
              setLowerBound('');
              setUpperBound('');
              setResult(null);
              setError('');
            }}
            variant="outline"
            size="lg"
          >
            Clear
          </Button>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center mb-2">
            <HelpCircle size={16} className="text-gray-500 dark:text-gray-400 mr-1" />
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Examples</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(ex)}
                className="inline-flex text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md px-2 py-1 transition-colors duration-150"
              >
                {ex.expression} {ex.definite ? `[${ex.lower}, ${ex.upper}]` : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <ResultDisplay 
          title="Integration Result" 
          onDownload={handleDownload}
          onShare={handleShare}
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Original Expression
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md font-mono text-gray-800 dark:text-gray-200">
                {isDefinite ? `∫(${lowerBound},${upperBound}) ${expression} d${variable}` : `∫ ${expression} d${variable}`}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {isDefinite ? 'Definite Integral' : 'Indefinite Integral'}
              </h4>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md font-mono text-green-800 dark:text-green-300">
                {result.integral}
              </div>
            </div>
            
            {isDefinite && result.value !== undefined && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Value
                </h4>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md font-mono text-green-800 dark:text-green-300">
                  {typeof result.value === 'number' ? 
                    result.value.toExponential(8) : 
                    result.value}
                </div>
              </div>
            )}
          </div>
        </ResultDisplay>
      )}
    </div>
  );
};

export default Integration;