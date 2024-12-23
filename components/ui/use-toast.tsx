import { useCallback } from 'react';

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

export function useToast() {
  const toast = useCallback(({ title, description, variant = 'default', duration = 3000 }: ToastProps) => {
    // Simple toast implementation
    console.log(`[Toast] ${variant}: ${title} - ${description}`);
  }, []);

  return toast;
}
