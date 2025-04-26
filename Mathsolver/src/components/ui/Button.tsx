import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
}

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon,
  className = '',
}: ButtonProps) => {
  const baseClasses = 'rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-800/50',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 disabled:bg-gray-100 disabled:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:disabled:bg-gray-800 dark:disabled:text-gray-600',
    outline: 'bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 disabled:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-300 dark:disabled:text-gray-600',
    text: 'bg-transparent text-blue-600 hover:bg-blue-50 disabled:text-blue-300 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:disabled:text-blue-700',
  };
  
  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-2.5 px-5',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
    >
      {icon && icon}
      {children}
    </button>
  );
};

export default Button;