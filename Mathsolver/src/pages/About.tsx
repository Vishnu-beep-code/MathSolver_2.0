import React from 'react';
import { Calculator, BookOpen, Brain, Zap, RefreshCw, UserCheck } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About MathSolver
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          A free math problem-solving platform for students
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Our Mission
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          MathSolver was created with a simple mission: to make mathematics accessible, understandable, 
          and free for all students. We believe that every student should have access to powerful math tools 
          regardless of their financial situation or location.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Our platform provides immediate solutions to a wide range of mathematical problems, 
          from basic arithmetic to advanced calculus, with step-by-step explanations that help students 
          understand the underlying concepts and improve their problem-solving skills.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Core Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-3">
              <div className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 p-2 rounded-lg mr-3">
                <Calculator size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Accessibility</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Free for everyone, no paywalls, no subscriptions, no limits.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-3">
              <div className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 p-2 rounded-lg mr-3">
                <BookOpen size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Education</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              We emphasize learning by showing steps and explanations, not just answers.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-3">
              <div className="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 p-2 rounded-lg mr-3">
                <UserCheck size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Privacy</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              No account required, no data collection, and no tracking.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-3">
              <div className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 p-2 rounded-lg mr-3">
                <RefreshCw size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Continuous Improvement</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              We're constantly adding new tools and enhancing existing ones.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use MathSolver
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <ol className="list-decimal list-inside space-y-4 text-gray-700 dark:text-gray-300">
            <li>
              <span className="font-medium">Choose a calculator</span> from our homepage that matches your problem type.
            </li>
            <li>
              <span className="font-medium">Enter your problem</span> using our intuitive input fields.
            </li>
            <li>
              <span className="font-medium">Click "Solve"</span> to get your answer and see step-by-step explanations.
            </li>
            <li>
              <span className="font-medium">Download or share</span> your results if needed.
            </li>
            <li>
              <span className="font-medium">Use the examples</span> provided if you're not sure how to format your input.
            </li>
          </ol>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Feedback and Suggestions
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          We're always looking to improve MathSolver and add new features that help students. 
          If you have suggestions, feedback, or encounter any issues, please reach out through our feedback form.
        </p>
        <div className="flex justify-center">
          <a 
            href="#" 
            className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <Zap size={18} className="mr-2" />
            Send Feedback
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;