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

  // Example expressions
  const examples = [
    { expression: 'x^2', variable: 'x', definite: false },
    { expression: 'sin(x)', variable: 'x', definite: false },
    { expression: '3*x^2 + 2*x', variable: 'x', definite: true, lower: '0', upper: '1' },
    { expression: 'e^x', variable: 'x', definite: true, lower: '0', upper: '2' },
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

      // This is a simplified implementation - in a real app, we'd use a more sophisticated integration algorithm
      // or connect to a backend service for more complex integrals

      // For this demo, we'll handle some basic cases
      let result: IntegrationResult;
      
      // Simple polynomial integration
      if (expression.includes('^')) {
        const steps: string[] = [expression];
        // Very simplified handling of x^n
        const match = expression.match(/x\^(\d+)/);
        
        if (match) {
          const power = parseInt(match[1]);
          const newPower = power + 1;
          const coefficient = 1 / newPower;
          
          const integral = `${coefficient} * x^${newPower}`;
          steps.push(`Increase power by 1: x^${power} → x^${newPower}`);
          steps.push(`Divide by the new power: (1/${newPower}) * x^${newPower}`);
          
          let value;
          if (isDefinite) {
            // Calculate definite integral
            const upperVal = Math.pow(parseFloat(upperBound), newPower) * coefficient;
            const lowerVal = Math.pow(parseFloat(lowerBound), newPower) * coefficient;
            value = upperVal - lowerVal;
            steps.push(`Evaluate at upper bound (${upperBound}): ${upperVal}`);
            steps.push(`Evaluate at lower bound (${lowerBound}): ${lowerVal}`);
            steps.push(`Subtract: ${upperVal} - ${lowerVal} = ${value}`);
          }
          
          result = {
            integral: `${integral} + C`,
            value: isDefinite ? value : undefined,
            steps: showSteps ? steps : undefined
          };
        } else {
          throw new Error('Could not parse the expression');
        }
      } 
      // Handle sin(x)
      else if (expression.includes('sin(x)')) {
        const steps: string[] = [expression];
        steps.push('Integral of sin(x) is -cos(x)');
        
        let value;
        if (isDefinite) {
          // Calculate definite integral
          const upperVal = -Math.cos(parseFloat(upperBound));
          const lowerVal = -Math.cos(parseFloat(lowerBound));
          value = upperVal - lowerVal;
          steps.push(`Evaluate at upper bound (${upperBound}): ${upperVal}`);
          steps.push(`Evaluate at lower bound (${lowerBound}): ${lowerVal}`);
          steps.push(`Subtract: ${upperVal} - ${lowerVal} = ${value}`);
        }
        
        result = {
          integral: '-cos(x) + C',
          value: isDefinite ? value : undefined,
          steps: showSteps ? steps : undefined
        };
      }
      // Handle e^x
      else if (expression.includes('e^x')) {
        const steps: string[] = [expression];
        steps.push('Integral of e^x is e^x');
        
        let value;
        if (isDefinite) {
          // Calculate definite integral
          const upperVal = Math.exp(parseFloat(upperBound));
          const lowerVal = Math.exp(parseFloat(lowerBound));
          value = upperVal - lowerVal;
          steps.push(`Evaluate at upper bound (${upperBound}): ${upperVal}`);
          steps.push(`Evaluate at lower bound (${lowerBound}): ${lowerVal}`);
          steps.push(`Subtract: ${upperVal} - ${lowerVal} = ${value}`);
        }
        
        result = {
          integral: 'e^x + C',
          value: isDefinite ? value : undefined,
          steps: showSteps ? steps : undefined
        };
      } else {
        throw new Error('Sorry, we can only handle basic expressions in this demo');
      }
      
      setResult(result);
      
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
      content += `Definite Integral Value: ${result.value}\n\n`;
    }
    
    content += `Indefinite Integral: ${result.integral}\n\n`;
    
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

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center mb-2">
          <Sigma size={24} className="text-green-600 dark:text-green-400 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Integration Calculator
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate indefinite and definite integrals with step-by-step explanations.
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
            
            <div className="flex items-center mb-4 md:mb-0">
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
                placeholder="e.g., 0"
                helpText="Lower limit of integration"
              />
              
              <InputField
                id="upperBound"
                label="Upper Bound"
                value={upperBound}
                onChange={(e) => setUpperBound(e.target.value)}
                placeholder="e.g., 1"
                helpText="Upper limit of integration"
              />
            </div>
          )}
          
          <div className="mt-4 flex items-center">
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
          onShare={() => {}}
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
                  {result.value}
                </div>
              </div>
            )}
            
            {result.steps && result.steps.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Step-by-Step Solution
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
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