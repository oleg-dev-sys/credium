import { useEffect, useRef } from 'react';
import { Button } from './ui/button';

declare global {
  interface Window {
    YaAuthSuggest: any;
  }
}

interface YandexWidgetProps {
  onSuccess: (data: any) => void;
  onError?: (error: any) => void;
}

export default function YandexWidget({ onSuccess, onError }: YandexWidgetProps) {
  const handleLogin = () => {
    const clientId = '0ed9e4b6b5454dd5bc1ee4ea8e6524ba';
    const redirectUri = encodeURIComponent('http://localhost/auth/ya');
    const authUrl = `https://oauth.yandex.ru/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}`;

    // Открываем в том же окне (или в popup, если хотите)
    window.location.href = authUrl;
  };

  return (
    <Button
      variant="outline" // Стиль как у Telegram/Email кнопок в AuthModals
      type="button"
      onClick={handleLogin}
      className="w-full flex items-center gap-2 justify-center"
    >
      {/* Лаконичная иконка Яндекса */}
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M12.87 8.35L11.45 2h-4v20h4.2v-8.4l3.12 8.4h4.41l-5.63-12.7c1.72-.6 2.76-2.17 2.76-4.52 0-2.8-2-4.78-5.74-4.78H5v4h5.5c1.1 0 1.63.54 1.63 1.5s-.55 1.83-1.63 1.83h-1.63v2.02h4z" 
          fill="#FC3F1D" 
        />
      </svg>
      <span>Войти с Яндекс ID</span>
    </Button>
  );
}
