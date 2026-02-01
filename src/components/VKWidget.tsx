import { useEffect, useRef } from 'react';

// Объявляем типы для глобального объекта VKIDSDK, чтобы TypeScript не ругался
declare global {
  interface Window {
    VKIDSDK: any;
  }
}

interface VKWidgetProps {
  onSuccess: (data: any) => void;
  onError?: (error: any) => void;
}

export default function VKWidget({ onSuccess, onError }: VKWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Проверяем, загружен ли уже скрипт, чтобы не грузить дважды
    if (document.getElementById('vkid-sdk')) {
      initWidget();
      return;
    }

    // 2. Создаем и добавляем скрипт динамически
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';
    script.id = 'vkid-sdk';
    script.async = true;
    document.body.appendChild(script);

    // 3. Когда скрипт загрузится — инициализируем
    script.onload = () => {
      initWidget();
    };

    function initWidget() {
      if (!window.VKIDSDK || !containerRef.current) return;

      const VKID = window.VKIDSDK;

      // Конфигурация из твоего кода
      VKID.Config.init({
        app: 54413995, // Твой ID приложения
        redirectUrl: 'http://localhost/auth/vk', // ВАЖНО: Поменяй на реальный URL на проде
        responseMode: VKID.ConfigResponseMode.Callback,
        source: VKID.ConfigSource.LOWCODE,
        scope: '', 
      });

      const oneTap = new VKID.OneTap();

      // Рендерим виджет в наш div
      const oneTapInstance = oneTap.render({
        container: containerRef.current,
        showAlternativeLogin: true,
        styles: {
          borderRadius: 40, // Можно настроить стиль под твои кнопки
          height: 40,
        }
      });
      
      oneTapInstance
        .on(VKID.WidgetEvents.ERROR, (error: any) => {
             if (onError) onError(error);
        })
        .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, function (payload: any) {
          const code = payload.code;
          const deviceId = payload.device_id;

          VKID.Auth.exchangeCode(code, deviceId)
            .then((data: any) => {
                onSuccess(data); // Передаем данные наверх
            })
            .catch((err: any) => {
                if (onError) onError(err);
            });
        });
    }

    // Очистка при размонтировании (опционально, зависит от поведения SDK)
    return () => {
        // VK SDK OneTap сложно удалить чисто, но можно очистить контейнер
        if (containerRef.current) {
            containerRef.current.innerHTML = ''; 
        }
    };
  }, [onSuccess, onError]);

  // Этот div станет контейнером для кнопки VK
  return <div ref={containerRef} style={{ width: '100%' }} />;
}