'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ConfirmDeleteButtonProps {
  onConfirm: () => void;
  disabled?: boolean;
  confirmText?: string;
  yesText?: string;
  noText?: string;
}

export function ConfirmDeleteButton({ 
  onConfirm, 
  disabled = false, 
  confirmText = '¿Eliminar?',
  yesText = 'Sí',
  noText = 'No'
}: ConfirmDeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-1 bg-destructive/10 p-1 rounded-md border border-destructive/20">
        <span className="text-xs text-destructive font-medium px-1">{confirmText}</span>
        <Button 
          variant="destructive" 
          size="sm" 
          className="h-6 px-2 text-xs" 
          onClick={(e) => {
            e.stopPropagation();
            onConfirm();
          }} 
          disabled={disabled}
        >
          {yesText}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-6 px-2 text-xs" 
          onClick={(e) => {
            e.stopPropagation();
            setConfirming(false);
          }} 
          disabled={disabled}
        >
          {noText}
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={(e) => {
        e.stopPropagation();
        setConfirming(true);
      }} 
      disabled={disabled}
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
