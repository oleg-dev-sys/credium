import { useEffect, useState } from 'react';
import { Bell, Mail, Smartphone, Megaphone, TrendingUp, CreditCard } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { api, NotificationSettings } from '@/services/api';
import { toast } from '../ui/sonner';


export function NotificationsSection() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      api.getNotificationSettings(token) // Добавлен токен
        .then(setSettings)
        .catch(() => toast.error('Не удалось загрузить настройки'));
    }
  }, []);

  const handleToggle = async (key: keyof NotificationSettings) => {
    const token = localStorage.getItem('access_token');
    if (!settings || !token) return;
    
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);

    try {
      await api.updateNotificationSettings(token, newSettings);
      toast.success('Настройки обновлены');
    } catch (e) {
      setSettings(settings);
      toast.error('Ошибка сохранения');
    }
  };

  if (!settings) return <div>Загрузка...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Настройки уведомлений</h2>

      {/* Email уведомления */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="w-5 h-5" />
          <span className="font-medium">Email-уведомления</span>
        </div>

        <div className="space-y-4 pl-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Лучшие предложения</p>
              <p className="text-sm text-muted-foreground">
                Персональные подборки кредитов и карт
              </p>
            </div>
            <Switch
              checked={settings.email_offers}
              onCheckedChange={() => handleToggle('email_offers')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Новости и обновления</p>
              <p className="text-sm text-muted-foreground">
                Информация о новых функциях сервиса
              </p>
            </div>
            <Switch
              checked={settings.email_news}
              onCheckedChange={() => handleToggle('email_news')}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Push уведомления */}
      {/* <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Bell className="w-5 h-5" />
          <span className="font-medium">Push-уведомления</span>
        </div>

        <div className="space-y-4 pl-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-accent" />
              <div>
                <p className="font-medium text-foreground">Изменение AI-рейтинга</p>
                <p className="text-sm text-muted-foreground">
                  Уведомления при изменении вашего скоринга
                </p>
              </div>
            </div>
            <Switch
              checked={settings.pushAlerts}
              onCheckedChange={() => handleToggle('pushAlerts')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-primary" />
              <div>
                <p className="font-medium text-foreground">Статус заявок</p>
                <p className="text-sm text-muted-foreground">
                  Обновления по вашим заявкам на кредит
                </p>
              </div>
            </div>
            <Switch
              checked={settings.pushApprovals}
              onCheckedChange={() => handleToggle('pushApprovals')}
            />
          </div>
        </div>
      </div> */}

      {/* <Separator /> */}

      {/* SMS */}
      {/* <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Smartphone className="w-5 h-5" />
          <span className="font-medium">SMS-уведомления</span>
        </div>

        <div className="space-y-4 pl-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Важные оповещения</p>
              <p className="text-sm text-muted-foreground">
                Безопасность аккаунта и критичные события
              </p>
            </div>
            <Switch
              checked={settings.smsImportant}
              onCheckedChange={() => handleToggle('smsImportant')}
            />
          </div>
        </div>
      </div> */}

      {/* <Separator /> */}

      {/* Маркетинг */}
      {/* <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Megaphone className="w-5 h-5" />
          <span className="font-medium">Маркетинг</span>
        </div>

        <div className="space-y-4 pl-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Акции партнёров</p>
              <p className="text-sm text-muted-foreground">
                Спецпредложения от банков-партнёров
              </p>
            </div>
            <Switch
              checked={settings.marketing}
              onCheckedChange={() => handleToggle('marketing')}
            />
          </div>
        </div>
      </div> */}
    </div>
  );
}
