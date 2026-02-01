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
    const scriptId = 'telegram-widget-script';
    if (document.getElementById(scriptId)) return;

    window.onTelegramAuth = (user) => {
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

    if (containerRef.current) {
      containerRef.current.appendChild(script);
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
    className="w-full h-full flex items-center justify-center overflow-hidden"
    style={{
      cursor: 'pointer',
      pointerEvents: 'auto',
      opacity: 0, 
      position: 'relative',
      zIndex: 20,
    }}
  />
);
}