import { useState } from 'react';
import { Shield, Key, Smartphone, History, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import api from '@/services/api';
import { toast } from '../ui/sonner';

export function SecuritySection() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handlePasswordChange = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
  
    if (passwords.new !== passwords.confirm) {
      toast.error('Пароли не совпадают');
      return;
    }
    if (passwords.new.length < 8) {
      toast.error('Новый пароль слишком короткий (мин. 8 символов)');
      return;
    }

    setIsLoading(true);
    try {
      await api.changePassword(token, passwords.current, passwords.new);
      toast.success('Пароль успешно изменён');
      setIsChangingPassword(false);
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      toast.error(error.message || 'Ошибка при смене пароля');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(
      twoFactorEnabled 
        ? 'Двухфакторная аутентификация отключена' 
        : 'Двухфакторная аутентификация включена'
    );
  };

  const sessions = [
    { device: 'Chrome на Windows', location: 'Москва, Россия', current: true, time: 'Сейчас' },
    { device: 'Safari на iPhone', location: 'Москва, Россия', current: false, time: '2 часа назад' },
    { device: 'Firefox на MacOS', location: 'Санкт-Петербург, Россия', current: false, time: '3 дня назад' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Безопасность</h2>

      {/* Смена пароля */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Пароль</p>
              <p className="text-sm text-muted-foreground">
                Последнее изменение: 30 дней назад
              </p>
            </div>
          </div>
          {!isChangingPassword && (
            <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
              Изменить
            </Button>
          )}
        </div>

        {isChangingPassword && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Текущий пароль</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={passwords.current}
                  onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                  className="bg-muted/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Новый пароль</Label>
              <Input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={passwords.new}
                onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))}
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={passwords.confirm}
                onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                className="bg-muted/50"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setIsChangingPassword(false)}>
                Отмена
              </Button>
              <Button 
                className="w-full" 
                onClick={handlePasswordChange}
                disabled={isLoading}
              >
                {isLoading ? 'Сохранение...' : 'Обновить пароль'}
              </Button>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Двухфакторная аутентификация */}
      {/* <div className="p-4 rounded-xl bg-muted/30 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-accent" />
            <div>
              <p className="font-medium text-foreground">Двухфакторная аутентификация</p>
              <p className="text-sm text-muted-foreground">
                Дополнительный уровень защиты аккаунта
              </p>
            </div>
          </div>
          <Switch checked={twoFactorEnabled} onCheckedChange={handleToggle2FA} />
        </div>
      </div> */}

      <Separator />

      {/* Активные сессии */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-muted-foreground" />
          <span className="font-medium text-foreground">Активные сессии</span>
        </div>

        <div className="space-y-3">
          {sessions.map((session, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
            >
              <div className="flex items-center gap-3">
                <Shield className={`w-4 h-4 ${session.current ? 'text-accent' : 'text-muted-foreground'}`} />
                <div>
                  <p className="font-medium text-foreground">
                    {session.device}
                    {session.current && (
                      <span className="ml-2 text-xs text-accent">(текущая)</span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session.location} · {session.time}
                  </p>
                </div>
              </div>
              {!session.current && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => toast.success('Сессия завершена')}
                >
                  Завершить
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={() => toast.success('Все сессии, кроме текущей, завершены')}
        >
          Завершить все другие сессии
        </Button>
      </div>
    </div>
  );
}
