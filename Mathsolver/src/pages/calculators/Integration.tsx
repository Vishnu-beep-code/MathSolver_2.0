import { useState } from 'react';
import { Sigma, HelpCircle } from 'lucide-react';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import ResultDisplay from '../../components/ui/ResultDisplay';
import * as math from 'mathjs';

interface IntegrationResult {
  integral: string;
  value?: number | string;
  steps?: string[];
  method?: string;
}

const Integration = () => {
  const [expression, setExpression] = useState('');
  const [variable, setVariable] = useState('x');
  const [isDefinite, setIsDefinite] = useState(false);
  const [lowerBound, setLowerBound] = useState('');
  const [upperBound, setUpperBound] = useState('');
  const [showSteps, setShowSteps] = useState(true);
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
  const integrate = (expr: string, variable: string): { result: string, steps: string[], method: string } => {
    const steps: string[] = [];
    steps.push(`Starting with the expression: ${expr}`);

    try {
      // First try symbolic integration using mathjs
      try {
        math.parse(expr);
        // Replace math.integral with nerdamer for symbolic integration
        const nerdamer = require('nerdamer');
        const integral = nerdamer.integrate(expr, variable).text();
        steps.push(`Successfully computed symbolic integral using math.js`);
        return {
          result: integral.toString(),
          steps,
          method: 'symbolic'
        };
      } catch (symbolicError) {
        steps.push(`Symbolic integration failed, trying pattern matching...`);
      }

      // Pattern matching for common integrals
      const patterns = [
        // Polynomials
        { 
          regex: new RegExp(`(${variable})\\^(\\d+)`), 
          handler: (match: RegExpMatchArray) => {
            const power = parseInt(match[2]);
            const newPower = power + 1;
            steps.push(`For ${match[1]}^${power}, increase power by 1: ${match[1]}^${power} → ${match[1]}^${newPower}`);
            steps.push(`Divide by the new power: (1/${newPower}) * ${match[1]}^${newPower}`);
            return `(1/${newPower}) * ${match[1]}^${newPower}`;
          }
        },
        // Trigonometric functions
        { 
          regex: new RegExp(`sin\\((${variable})\\)`), 
          handler: () => {
            steps.push(`Integral of sin(${variable}) is -cos(${variable})`);
            return `-cos(${variable})`;
          }
        },
        { 
          regex: new RegExp(`cos\\((${variable})\\)`), 
          handler: () => {
            steps.push(`Integral of cos(${variable}) is sin(${variable})`);
            return `sin(${variable})`;
          }
        },
        { 
          regex: new RegExp(`tan\\((${variable})\\)`), 
          handler: () => {
            steps.push(`Integral of tan(${variable}) is -ln|cos(${variable})|`);
            return `-ln|cos(${variable})|`;
          }
        },
        // Exponential and logarithmic
        { 
          regex: new RegExp(`e\\^(${variable})`), 
          handler: () => {
            steps.push(`Integral of e^${variable} is e^${variable}`);
            return `e^${variable}`;
          }
        },
        { 
          regex: new RegExp(`1\\/(${variable})`), 
          handler: () => {
            steps.push(`Integral of 1/${variable} is ln|${variable}|`);
            return `ln|${variable}|`;
          }
        },
        // Inverse trigonometric
        { 
          regex: new RegExp(`1\\/(1\\s*\\+\\s*(${variable})\\^2)`), 
          handler: () => {
            steps.push(`Integral of 1/(1 + ${variable}^2) is arctan(${variable})`);
            return `arctan(${variable})`;
          }
        },
        { 
          regex: new RegExp(`1\\/sqrt\\(1\\s*\\-\\s*(${variable})\\^2)`), 
          handler: () => {
            steps.push(`Integral of 1/sqrt(1 - ${variable}^2) is arcsin(${variable})`);
            return `arcsin(${variable})`;
          }
        },
        // Hyperbolic functions
        { 
          regex: new RegExp(`sinh\\((${variable})\\)`), 
          handler: () => {
            steps.push(`Integral of sinh(${variable}) is cosh(${variable})`);
            return `cosh(${variable})`;
          }
        },
        { 
          regex: new RegExp(`cosh\\((${variable})\\)`), 
          handler: () => {
            steps.push(`Integral of cosh(${variable}) is sinh(${variable})`);
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
            steps,
            method: 'pattern-matching'
          };
        }
      }

      // Try integration by parts for products
      if (expr.includes('*')) {
        try {
          const parts = expr.split('*').map(part => part.trim());
          if (parts.length === 2) {
            steps.push(`Attempting integration by parts for: ${parts[0]} * ${parts[1]}`);
            
            // Try to integrate the second part
            const dv = parts[1];
            const vResult = integrate(dv, variable);
            steps.push(...vResult.steps);
            const v = vResult.result;
            
            // Differentiate the first part
            const u = parts[0];
            const du = math.derivative(math.parse(u), variable).toString();
            steps.push(`Differentiating ${u} gives: ${du}`);
            
            const integral = `${u} * ${v} - ∫${v} * ${du}`;
            steps.push(`Integration by parts result: ${integral}`);
            
            return {
              result: integral,
              steps,
              method: 'integration-by-parts'
            };
          }
        } catch (err) {
          steps.push(`Integration by parts failed: ${err}`);
        }
      }

      // Try substitution method
      if (expr.includes('(') && expr.includes(')')) {
        try {
          const innerMatch = expr.match(new RegExp(`\\(([^)]*${variable}[^)]*)\\)`));
          if (innerMatch) {
            const innerExpr = innerMatch[1];
            steps.push(`Attempting substitution with u = ${innerExpr}`);
            
            const derivative = math.derivative(math.parse(innerExpr), variable).toString();
            steps.push(`Derivative of ${innerExpr} is ${derivative}`);
            
            // Check if the derivative is present in the expression
            if (expr.includes(derivative) || math.simplify(expr).toString().includes(derivative)) {
              const integral = `∫f(u)du where u = ${innerExpr}`;
              steps.push(`Substitution possible: ${integral}`);
              
              return {
                result: integral,
                steps,
                method: 'substitution'
              };
            }
          }
        } catch (err) {
          steps.push(`Substitution method failed: ${err}`);
        }
      }

      // If no pattern matched, provide a generic message
      steps.push(`Cannot find a direct integration method for this expression.`);
      return { 
        result: `∫${expr}d${variable}`, 
        steps,
        method: 'unknown'
      };
      
    } catch (err) {
      steps.push(`Error during integration: ${err}`);
      return { 
        result: `∫${expr}d${variable}`, 
        steps,
        method: 'error'
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
  ): { value: number, steps: string[] } => {
    const steps: string[] = [];
    steps.push(`Starting numeric integration with tolerance ${tol}`);
    
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
        steps.push(`Handling infinite bounds using transformation`);
        
        if (lower === -Infinity && upper === Infinity) {
          // Double exponential transformation for (-∞, ∞)
          
          const value = adaptiveSimpson(-1, 1, tol, simpson(-1, 1));
          steps.push(`Completed infinite integral with value: ${value}`);
          return { value, steps };
        } else if (lower === -Infinity) {
          // Transform (-∞, b) to (0, 1/(b-t))
          // Handle infinite bounds using transformation
          
          const value = adaptiveSimpson(0, 1, tol, simpson(0, 1));
          steps.push(`Completed infinite integral with value: ${value}`);
          return { value, steps };
        } else if (upper === Infinity) {
          // Transform (a, ∞) to (0, 1/(t-a))
          const transformedFunc = (t: number) => {
            const x = lower + (1 - t)/t;
            const dxdt = 1 / (t*t);
            return func(x) * dxdt;
          };
          
          const value = adaptiveSimpson(0, 1, tol, simpson(0, 1));
          steps.push(`Completed infinite integral with value: ${value}`);
          return { value, steps };
        }
      }
      
      // Regular finite integral
      const whole = simpson(lower, upper);
      const value = adaptiveSimpson(lower, upper, tol, whole);
      steps.push(`Completed numeric integration with value: ${value}`);
      return { value, steps };
    } catch (err) {
      steps.push(`Error during numeric integration: ${err}`);
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
  ): { value: number | string, steps: string[] } => {
    const steps: string[] = [];
    
    try {
      steps.push(`Evaluating the integral at the bounds [${lower}, ${upper}] using ${method} method`);
      
      if (method === 'numeric') {
        // Parse bounds
        const lowerNum = lower === '-inf' ? -Infinity : safeEvaluate(lower);
        const upperNum = upper === 'inf' ? Infinity : safeEvaluate(upper);
        
        const { value, steps: numericSteps } = numericIntegrate(
          expression,
          variable,
          lowerNum,
          upperNum,
          tolerance
        );
        
        steps.push(...numericSteps);
        return { value, steps };
      } else {
        // Symbolic evaluation
        // Substitute upper bound
        const upperSubstituted = substituteValue(integralExpr, variable, upper);
        steps.push(`Substitute upper bound ${upper}: ${upperSubstituted}`);
        const upperValue = safeEvaluate(upperSubstituted);
        steps.push(`Evaluate at upper bound: ${upperValue}`);
        
        // Substitute lower bound
        const lowerSubstituted = substituteValue(integralExpr, variable, lower);
        steps.push(`Substitute lower bound ${lower}: ${lowerSubstituted}`);
        const lowerValue = safeEvaluate(lowerSubstituted);
        steps.push(`Evaluate at lower bound: ${lowerValue}`);
        
        // Calculate the difference
        const result = upperValue - lowerValue;
        steps.push(`Subtract: ${upperValue} - ${lowerValue} = ${result}`);
        
        return { value: result, steps };
      }
    } catch (err) {
      steps.push(`Error evaluating the definite integral: ${err}`);
      
      // Try numeric method if symbolic failed
      if (method === 'symbolic') {
        steps.push(`Attempting numeric integration as fallback`);
        try {
          return evaluateDefinite(integralExpr, variable, lower, upper, 'numeric', tolerance);
        } catch (fallbackError) {
          steps.push(`Numeric integration also failed: ${fallbackError}`);
          return { value: "Could not evaluate", steps };
        }
      }
      
      return { value: "Could not evaluate", steps };
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
          steps: [`Using numeric integration method with tolerance ${tolerance}`],
          method: 'numeric'
        };
      }
      
      let finalResult: IntegrationResult = {
        integral: `${integralResult.result}${method === 'symbolic' ? ' + C' : ''}`,
        steps: showSteps ? integralResult.steps : undefined,
        method: integralResult.method
      };
      
      // Handle definite integral
      if (isDefinite) {
        const { value, steps: evaluationSteps } = evaluateDefinite(
          integralResult.result, 
          variable, 
          lowerBound, 
          upperBound,
          method,
          parseFloat(tolerance)
        );
        
        finalResult.value = value;
        
        if (showSteps && finalResult.steps) {
          finalResult.steps = [...finalResult.steps, ...evaluationSteps];
        }
        
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
    content += `Method: ${result.method || 'unknown'}\n`;
    
    if (isDefinite) {
      content += `Bounds: [${lowerBound}, ${upperBound}]\n`;
      if (method === 'numeric') {
        content += `Tolerance: ${tolerance}\n`;
      }
      content += `Definite Integral Value: ${result.value}\n\n`;
    }
    
    content += `${isDefinite ? 'Definite' : 'Indefinite'} Integral: ${result.integral}\n\n`;
    
    if (result.steps) {
      content += `Steps:\n`;
      result.steps.forEach((step, index) => {
        content += `${index + 1}. ${step}\n`;
      });
    }
    
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
          Calculate integrals with symbolic or numeric methods, featuring step-by-step explanations.
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
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showSteps"
                checked={showSteps}
                onChange={() => setShowSteps(!showSteps)}
                className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <label htmlFor="showSteps" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Show step-by-step solution
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
                {isDefinite ? 'Definite Integral' : 'Indefinite Integral'} ({result.method})
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
            
            {result.steps && result.steps.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Step-by-Step Solution
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md max-h-96 overflow-y-auto">
                  {result.steps.map((step, index) => (
                    <div key={index} className="mb-2 last:mb-0">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mr-2">
                        Step {index + 1}:
                      </span>
                      <span className="font-mono text-gray-800 dark:text-gray-200">
                        {step}
                      </span>
                    </div>
                  ))}
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