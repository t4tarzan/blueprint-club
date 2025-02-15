import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface TogglePasswordVisibilityProps {
  isPasswordVisible: boolean;
  onTogglePasswordVisibility: () => void;
}

const TogglePasswordVisibility: React.FC<TogglePasswordVisibilityProps> = ({
  isPasswordVisible,
  onTogglePasswordVisibility
}) => {
  return (
    <button
      type="button"
      onClick={onTogglePasswordVisibility}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
    >
      {isPasswordVisible ? (
        <EyeSlashIcon className="h-5 w-5" />
      ) : (
        <EyeIcon className="h-5 w-5" />
      )}
    </button>
  );
};

export default TogglePasswordVisibility;
