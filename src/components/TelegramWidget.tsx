import { useEffect, useRef } from 'react';

// Типизация для объекта window
declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

interface TelegramWidgetProps {
  onSuccess: (user: any) => void;
  botName: string;
  className?: string;
}

export default function TelegramWidget({ onSuccess, botName, className }: TelegramWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Проверяем, не вставлен ли уже скрипт (защита от дублей)
    const scriptId = 'telegram-widget-script';
    if (document.getElementById(scriptId)) return;

    // 2. Определяем глобальную функцию
    window.onTelegramAuth = (user) => {
      onSuccess(user);
    };

    // 3. Создаем скрипт
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;

    // 4. Вставляем
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
        // Очистка при размонтировании не всегда нужна для скрипта, 
        // но callback лучше убрать
        // @ts-ignore
        window.onTelegramAuth = undefined;
    };
  }, [botName, onSuccess]);

  return (
    <div 
      ref={containerRef} 
      className={className} // Фиксируем высоту, чтобы не прыгало
    />
  );
}