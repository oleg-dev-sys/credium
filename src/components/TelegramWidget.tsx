'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

interface TelegramWidgetProps {
  onSuccess: (user: any) => void;
  botName: string;
}

export default function TelegramWidget({ onSuccess, botName }: TelegramWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('TelegramWidget useEffect запущен');
    console.log('botName:', botName);
    const scriptId = 'telegram-widget-script';
    if (document.getElementById(scriptId)) {console.log('Скрипт уже загружен');return;}

    window.onTelegramAuth = (user) => {
      console.log('Telegram auth success:', user);
      onSuccess(user);
    };

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

    script.onload = () => {
      console.log('Скрипт телеграма загружен');
    };

    script.onerror = () => {
      console.log('Ошибка загрузки скрипта телеграма');
    };

    if (containerRef.current) {
      console.log('Контейнер существует:', containerRef.current);
      containerRef.current.appendChild(script);
    } else {
      console.log('Контейнер НЕ существует!');
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      // @ts-ignore
      window.onTelegramAuth = undefined;
    };
  }, [botName, onSuccess]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        left: '-30%',
        width: '200%',
        height: '100%',
        transform: 'scale(0.5)',
        transformOrigin: 'left center',
        pointerEvents: 'auto',
        zIndex: 10,
      }}
    />
  );
}