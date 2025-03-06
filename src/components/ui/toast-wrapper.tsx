'use client';
import { useToast } from './use-toast';
import { ToastAction } from './toast';

interface ToastWrapperProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function showToast({ title, description, variant = 'default', action }: ToastWrapperProps) {
  const { toast } = useToast();

  toast({
    variant,
    title,
    description,
    action: action ? (
      <ToastAction altText={action.label} onClick={action.onClick}>
        {action.label}
      </ToastAction>
    ) : undefined,
  });
} 