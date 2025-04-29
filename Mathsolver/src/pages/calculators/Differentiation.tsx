import { useState } from 'react';
import { FunctionSquare as Function, HelpCircle } from 'lucide-react';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import ResultDisplay from '../../components/ui/ResultDisplay';
import * as math from 'mathjs';

interface DifferentiationResult {
  derivative: string;
  steps?: string[];
}

const Differentiation = () => {
  const [expression, setExpression] = useState('');
  const [variable, setVariable] = useState('x');
  const [order, setOrder] = useState('1');
  const [showSteps, setShowSteps] = useState(true);
  const [result, setResult] = useState<DifferentiationResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const examples = [
    { expression: 'x^2', variable: 'x', order: '1' },
    { expression: 'sin(x)', variable: 'x', order: '1' },
    { expression: 'e^x', variable: 'x', order: '2' },
    { expression: '3*x^3 + 2*x^2 - 5*x + 1', variable: 'x', order: '1' },
  ];

  const handleExampleClick = (example: typeof examples[0]) => {
    setExpression(example.expression);
    setVariable(example.variable);
    setOrder(example.order);
  };

  const handleSolve = () => {
    setError('');
    setLoading(true);
    
    try {
      if (!expression.trim()) {
        throw new Error('Please enter a mathematical expression');
      }

      const orderNum = parseInt(order);
      if (isNaN(orderNum) || orderNum < 1) {
        throw new Error('Order must be a positive integer');
      }

      const parsedExpr = math.parse(expression);
      let result = parsedExpr;
      const steps: string[] = [expression];

      for (let i = 0; i < orderNum; i++) {
        result = math.derivative(result, variable);
        steps.push(result.toString());
      }

      setResult({
        derivative: result.toString(),
        steps: showSteps ? steps : undefined
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;

    let content = `Differentiation Result\n\n`;
    content += `Expression: ${expression}\n`;
    content += `Variable: ${variable}\n`;
    content += `Order: ${order}\n\n`;
    content += `Derivative: ${result.derivative}\n\n`;

    if (result.steps) {
      content += `Steps:\n`;
      result.steps.forEach((step, index) => {
        content += `${index}. ${step}\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'differentiation_result.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center mb-2">
          <Function size={24} className="text-blue-600 dark:text-blue-400 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Differentiation Calculator
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate the derivative of any function with step-by-step solutions.
        </p>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 transition-colors duration-300">
        <div className="mb-6">
          <InputField
            id="expression"
            label="Function to Differentiate"
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
              helpText="The variable to differentiate with respect to"
            />

            <InputField
              id="order"
              label="Order of Derivative"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              type="number"
              placeholder="e.g., 1"
              helpText="Order of the derivative (1 for first derivative, 2 for second, etc.)"
            />
          </div>

          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="showSteps"
              checked={showSteps}
              onChange={() => setShowSteps(!showSteps)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="showSteps" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Show step-by-step solution
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <Button onClick={handleSolve} disabled={loading} variant="primary" size="lg">
            {loading ? 'Calculating...' : 'Calculate Derivative'}
          </Button>

          <Button
            onClick={() => {
              setExpression('');
              setVariable('x');
              setOrder('1');
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
                {ex.expression}
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <ResultDisplay
          title="Differentiation Result"
          onDownload={handleDownload}
          onShare={() => {}}
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Original Expression
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md font-mono text-gray-800 dark:text-gray-200">
                {expression}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {order === '1' ? 'First' : order === '2' ? 'Second' : order === '3' ? 'Third' : `${order}th`} Derivative
              </h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md font-mono text-blue-800 dark:text-blue-300">
                {result.derivative}
              </div>
            </div>

            {result.steps && result.steps.length > 1 && (
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
                        {index === 0
                          ? `f(x) = ${step}`
                          : `f${"'".repeat(index)}(x) = ${step}`}
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

export default Differentiation;
