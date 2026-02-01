import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react'; // Иконка самолетика (или скачай лого TG)
import TelegramWidget from './TelegramWidget';

interface TelegramLoginButtonProps {
  botName: string;
  onSuccess: (user: any) => void;
  isLoading?: boolean;
}

export function TelegramLoginButton({ botName, onSuccess, isLoading }: TelegramLoginButtonProps) {
  return (
    <div className="relative w-full">
      {/* 1. Твоя красивая кнопка (Визуальная часть) */}
      {/* pointer-events-none нужен, чтобы клик проходил сквозь кнопку, 
          но так как виджет лежит ПОВЕРХ, то клик перехватит он. */}
      <Button 
        variant="outline" // Или любой другой вариант стиля
        className="w-full flex items-center gap-2 relative z-0 bg-[#24A1DE] text-white hover:bg-[#24A1DE]/90 border-none" 
        type="button"
        disabled={isLoading}
      >
        <Send className="w-4 h-4" /> {/* Иконка */}
        Войти через Telegram
      </Button>

      {/* 2. Невидимый виджет (Функциональная часть) */}
      <div className="absolute inset-0 z-10 opacity-0 overflow-hidden flex justify-center items-center">
        {/* transform scale увеличивает виджет, чтобы он точно покрыл всю кнопку */}
        <div className="transform scale-150 w-full h-full cursor-pointer">
            <TelegramWidget 
                botName={botName} 
                onSuccess={onSuccess} 
                className="w-full h-full pointer-events-auto"
            />
        </div>
      </div>
    </div>
  );
}