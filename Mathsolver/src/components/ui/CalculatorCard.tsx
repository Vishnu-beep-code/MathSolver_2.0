import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface CalculatorCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  to: string;
  color?: string;
}

const CalculatorCard = ({ title, description, icon, to, color = 'blue' }: CalculatorCardProps) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    teal: 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
    pink: 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400',
  };

  const iconColorClass = colorClasses[color] || colorClasses.blue;

  return (
    <Link 
      to={to}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg p-6 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
    >
      <div className={`p-3 rounded-lg w-fit ${iconColorClass}`}>
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </Link>
  );
};

export default CalculatorCard;