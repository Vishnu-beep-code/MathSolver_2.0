import { FunctionSquare as Function, Sigma, Percent, BarChart, Calculator, Grid3X3, LineChart, Infinity, DivideCircle } from 'lucide-react';
import CalculatorCard from '../components/ui/CalculatorCard';
import { Lock, Activity, Dice5, PieChart, Grid, FunctionSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const calculators = [
    {
      title: 'Differentiation',
      description: 'Calculate derivatives of functions with step-by-step solutions.',
      icon: <Function size={24} />,
      to: '/differentiation',
      color: 'blue'
    },
    {
      title: 'Integration',
      description: 'Solve definite and indefinite integrals with detailed explanations.',
      icon: <Sigma size={24} />,
      to: '/integration',
      color: 'green'
    },
    {
      title: 'Probability',
      description: 'Calculate probabilities, permutations, and combinations with ease.',
      icon: <Percent size={24} />,
      to: '/probability',
      color: 'purple'
    },
    {
      title: 'Statistics',
      description: 'Find mean, median, mode, variance, and other statistical measures.',
      icon: <BarChart size={24} />,
      to: '/statistics',
      color: 'red'
    },
    {
      title: 'Algebra',
      description: 'Solve equations, simplify expressions, and factor polynomials.',
      icon: <Calculator size={24} />,
      to: '/algebra',
      color: 'orange'
    },
    {
      title: 'Matrix Operations',
      description: 'Perform addition, subtraction, multiplication, and find determinants.',
      icon: <Grid3X3 size={24} />,
      to: '/matrix',
      color: 'teal'
    },
    {
      title: 'Graph Plotter',
      description: 'Visualize functions and equations with an interactive graph plotter.',
      icon: <LineChart size={24} />,
      to: '/graph-plotter',
      color: 'indigo'
    },
    {
      title: 'Limits & Series',
      description: 'Calculate limits of functions and analyze simple series.',
      icon: <Infinity size={24} />,
      to: '/limits',
      color: 'pink'
    },
    {
      title: 'Basic Arithmetic',
      description: 'Perform calculations with fractions, percentages, and ratios.',
      icon: <DivideCircle size={24} />,
      to: '/arithmetic',
      color: 'blue'
    },
    {
      title: 'RSA Encryption Algorithm',
      description: 'Explore public-key cryptography with interactive RSA encryption and decryption tools.',
      icon: <Lock size={24} />,
      to: '/rsa-encryption',
      color: 'red'
    },
    {
      title: 'Brownian Motion',
      description: 'Visualize random motion and stochastic processes with simulation.',
      icon: <Activity size={24} />,
      to: '/brownian-motion',
      color: 'teal'
    },
    {
      title: 'Game Theory',
      description: 'Analyze strategies and outcomes in competitive scenarios.',
      icon: <Dice5 size={24} />,
      to: '/game-theory',
      color: 'orange'
    },
    {
      title: 'One Way Classification',
      description: 'Analyze variance across a single factor using one-way ANOVA techniques.',
      icon: <PieChart size={24} />,
<<<<<<< HEAD
      to: '/One-Way-Classsification',
=======
      to: '/one-way-classification',
>>>>>>> 216b3e077e16d42482e00edfa62a98e265789dd3
      color: 'purple'
    },
    {
      title: 'Two Way Classification',
      description: 'Examine interactions between two factors with two-way ANOVA methods.',
      icon: <Grid size={24} />,
<<<<<<< HEAD
      to: '/Two-Way-Classsification',
=======
      to: '/two-way-classification',
>>>>>>> 216b3e077e16d42482e00edfa62a98e265789dd3
      color: 'cyan'
    },
    {
      title: 'Taylor Series',
      description: 'Explore function approximations through Taylor series expansions.',
      icon: <FunctionSquare size={24} />,
<<<<<<< HEAD
      to: '/Taylor-Series',
=======
      to: '/taylor-series',
>>>>>>> 216b3e077e16d42482e00edfa62a98e265789dd3
      color: 'blue'
    }
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Hero section */}
      <section className="bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-700 dark:to-blue-900 text-white rounded-xl p-8 md:p-12 mb-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Solve Any Math Problem Instantly
          </h1>
          <p className="text-lg md:text-xl mb-6 opacity-90">
            Free, comprehensive math tools for high school and college students.
            No login required.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="#calculators" 
              className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Get Started
            </Link>
            <Link 
              to="/about" 
              className="bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Featured calculators section */}
      <section id="calculators">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Math Calculators &amp; Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calculator) => (
            <CalculatorCard
              key={calculator.title}
              title={calculator.title}
              description={calculator.description}
              icon={calculator.icon}
              to={calculator.to}
              color={calculator.color}
            />
          ))}
        </div>
      </section>

      {/* Features section */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Why Use MathSolver 2.0?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 p-3 rounded-lg w-fit mb-4">
              <Calculator size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Comprehensive Tools
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              From calculus to statistics, algebra to matrices, we've got all the math tools you need in one place.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 p-3 rounded-lg w-fit mb-4">
              <Function size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Step-by-Step Solutions
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Don't just get answers - understand the process with detailed explanations for each step.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 p-3 rounded-lg w-fit mb-4">
              <LineChart size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Interactive Visuals
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Visualize functions, plot graphs, and see mathematical concepts come to life through interactive displays.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;