import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface TogglePasswordVisibilityProps {
  isVisible: boolean;
  onToggle: () => void;
}

const TogglePasswordVisibility = ({ isVisible, onToggle }: TogglePasswordVisibilityProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
    >
      {isVisible ? (
        <EyeSlashIcon className="h-5 w-5" />
      ) : (
        <EyeIcon className="h-5 w-5" />
      )}
    </button>
  );
};

export default TogglePasswordVisibility;
