import { FC, InputHTMLAttributes } from 'react';

interface InputWithLabelProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | boolean;
}

export const InputWithLabel: FC<InputWithLabelProps> = ({
  label,
  error,
  ...props
}) => {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          {...props}
          className={`appearance-none block w-full px-3 py-2 border ${
            error ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
      </div>
      {error && typeof error === 'string' && (
        <p className="mt-2 text-sm text-red-600" id={`${props.id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};
