import { ChangeEvent } from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  helpText?: string;
  error?: string;
}

const InputField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  helpText,
  error,
}: InputFieldProps) => {
  return (
    <div className="mb-4">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-3 bg-white dark:bg-gray-700 border ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200`}
      />
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default InputField;