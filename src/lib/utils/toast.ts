import { toast } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

export const showToast = (
  message: string,
  type: ToastType = 'info',
  options?: ToastOptions
) => {
  const toastFn = toast[type] || toast;
  
  toastFn(message, {
    description: options?.description,
    duration: options?.duration || 4000,
    action: options?.action ? {
      label: options.action.label,
      onClick: options.action.onClick,
    } : undefined,
  });
}; 