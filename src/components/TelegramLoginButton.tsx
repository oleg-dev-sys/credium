'use client';

import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import TelegramWidget from './TelegramWidget';

interface TelegramLoginButtonProps {
  botName: string;
  onSuccess: (user: any) => void;
  isLoading?: boolean;
}

export function TelegramLoginButton({ botName, onSuccess, isLoading }: TelegramLoginButtonProps) {
  return (
    <div className="relative w-full">
      {/* Визуальная кнопка */}
      <Button 
        variant="outline"
        className="w-full flex items-center justify-center gap-2 bg-[#24A1DE] text-white hover:bg-[#24A1DE]/90 border-none"
        disabled={isLoading}
      >
        <Send className="w-4 h-4" />
        {isLoading ? 'Загрузка...' : 'Войти через Telegram'}
      </Button>

      {/* Невидимый виджет поверх кнопки */}
      <div 
        className="absolute inset-0 z-10 cursor-pointer h-full"
        style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
      >
        <TelegramWidget botName={botName} onSuccess={onSuccess} />
      </div>
    </div>
  );
}