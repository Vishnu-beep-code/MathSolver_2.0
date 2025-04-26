import { useState } from 'react';
import { Grid3X3, Plus, X, Equal, RotateCcw, HelpCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import ResultDisplay from '../../components/ui/ResultDisplay';

type Matrix = number[][];

const Matrix = () => {
  const [matrixA, setMatrixA] = useState<Matrix>([[0, 0], [0, 0]]);
  const [matrixB, setMatrixB] = useState<Matrix>([[0, 0], [0, 0]]);
  const [operation, setOperation] = useState<'add' | 'multiply' | 'determinant'>('add');
  const [result, setResult] = useState<Matrix | number | null>(null);
  const [error, setError] = useState<string>('');

  const updateMatrix = (matrix: Matrix, setMatrix: (m: Matrix) => void, row: number, col: number, value: string) => {
    const newMatrix = matrix.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? Number(value) || 0 : c))
    );
    setMatrix(newMatrix);
  };

  const addMatrices = (a: Matrix, b: Matrix): Matrix => {
    if (a.length !== b.length || a[0].length !== b[0].length) {
      throw new Error('Matrices must have the same dimensions for addition');
    }
    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
  };

  const multiplyMatrices = (a: Matrix, b: Matrix): Matrix => {
    if (a[0].length !== b.length) {
      throw new Error('Number of columns in first matrix must equal number of rows in second matrix');
    }
    return a.map((row) => {
      return b[0].map((_, j) => {
        return row.reduce((sum, val, k) => sum + val * b[k][j], 0);
      });
    });
  };

  const calculateDeterminant = (matrix: Matrix): number => {
    if (matrix.length !== matrix[0].length) {
      throw new Error('Matrix must be square to calculate determinant');
    }
    if (matrix.length === 2) {
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    throw new Error('Only 2x2 determinants are supported in this demo');
  };

  const handleCalculate = () => {
    setError('');
    try {
      switch (operation) {
        case 'add':
          setResult(addMatrices(matrixA, matrixB));
          break;
        case 'multiply':
          setResult(multiplyMatrices(matrixA, matrixB));
          break;
        case 'determinant':
          setResult(calculateDeterminant(matrixA));
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  };

  const renderMatrixInput = (matrix: Matrix, setMatrix: (m: Matrix) => void, label: string) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="grid gap-2 w-fit bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        {matrix.map((row, i) => (
          <div key={i} className="flex gap-2">
            {row.map((val, j) => (
              <input
                key={`${i}-${j}`}
                type="number"
                value={val}
                onChange={(e) => updateMatrix(matrix, setMatrix, i, j, e.target.value)}
                className="w-16 h-16 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center mb-2">
          <Grid3X3 size={24} className="text-teal-600 dark:text-teal-400 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Matrix Calculator
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Perform matrix operations with ease. Currently supports 2x2 matrices.
        </p>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <Button
            onClick={() => setOperation('add')}
            variant={operation === 'add' ? 'primary' : 'outline'}
            icon={<Plus size={16} />}
          >
            Addition
          </Button>
          <Button
            onClick={() => setOperation('multiply')}
            variant={operation === 'multiply' ? 'primary' : 'outline'}
            icon={<X size={16} />}
          >
            Multiplication
          </Button>
          <Button
            onClick={() => setOperation('determinant')}
            variant={operation === 'determinant' ? 'primary' : 'outline'}
            icon={<Equal size={16} />}
          >
            Determinant
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-8">
          {renderMatrixInput(matrixA, setMatrixA, 'Matrix A')}
          {operation !== 'determinant' && renderMatrixInput(matrixB, setMatrixB, 'Matrix B')}
        </div>

        {error && (
          <div className="text-red-500 dark:text-red-400 text-sm mt-2 mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <Button
            onClick={handleCalculate}
            variant="primary"
            size="lg"
          >
            Calculate
          </Button>
          <Button
            onClick={() => {
              setMatrixA([[0, 0], [0, 0]]);
              setMatrixB([[0, 0], [0, 0]]);
              setResult(null);
              setError('');
            }}
            variant="outline"
            size="lg"
            icon={<RotateCcw size={16} />}
          >
            Reset
          </Button>
        </div>

        {result !== null && (
          <ResultDisplay 
            title="Result" 
            onDownload={() => {}}
            onShare={() => {}}
          >
            {typeof result === 'number' ? (
              <div className="text-2xl font-mono text-gray-900 dark:text-white">
                {result}
              </div>
            ) : (
              <div className="grid gap-2 w-fit bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                {result.map((row, i) => (
                  <div key={i} className="flex gap-2">
                    {row.map((val, j) => (
                      <div
                        key={`${i}-${j}`}
                        className="w-16 h-16 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded font-mono"
                      >
                        {val.toFixed(2)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </ResultDisplay>
        )}

        <div className="mt-8 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <HelpCircle size={16} className="text-gray-500 dark:text-gray-400 mr-1" />
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Tips</h3>
          </div>
          <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
            <li>For addition, matrices must have the same dimensions</li>
            <li>For multiplication, the number of columns in Matrix A must equal the number of rows in Matrix B</li>
            <li>Determinant can only be calculated for square matrices</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Matrix;