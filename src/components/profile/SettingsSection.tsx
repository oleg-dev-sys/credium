import { useEffect, useState } from 'react';
import { Globe, Moon, Sun, Palette, Trash2, Download, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import WebApp from '@twa-dev/sdk'; 
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { useToast } from '@/hooks/use-toast';

export function SettingsSection() {
  const { toast } = useToast();
  const [language, setLanguage] = useState('ru');
  const [compactMode, setCompactMode] = useState(false);
  const { isTelegram } = useTelegramAuth();

  const { logout } = useAuth();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // const handleLanguageChange = (value: string) => {
  //   setLanguage(value);
  //   toast.success('Язык изменён');
  // };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (value: string) => {
    setTheme(value);
    const root = window.document.documentElement;

    localStorage.setItem('theme', value);

    if (typeof window !== 'undefined' && WebApp?.initData) {
      if (value === 'light') {
        WebApp.setBackgroundColor('#ffffff');
        WebApp.setHeaderColor('#ffffff');
      } else {
        WebApp.setBackgroundColor('#1a1f28');
        WebApp.setHeaderColor('#1a1f28');
      }
    }
    
    if (value === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
    toast({
      title: "Тема изменена",
      description: `Включена ${value === 'light' ? 'светлая' : 'тёмная'} тема`,
      variant: "default",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Экспорт данных",
      description: "Экспорт начат. Вы получите файл на email.",
      variant: "default",
    });
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      await api.deleteMyAccount(token);
      toast({
        title: "Аккаунт удалён",
        description: "Ваш аккаунт и все данные успешно удалены",
        variant: "default",
      });
      logout();
      window.location.href = '/';
    } catch (error) {
      toast({
        title: "Ошибка удаления",
        description: "Не удалось удалить аккаунт. Попробуйте позже.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Настройки</h2>

      {/* Язык */}
      {/* <div className="p-4 rounded-xl bg-muted/30 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Язык интерфейса</p>
              <p className="text-sm text-muted-foreground">
                Выберите предпочитаемый язык
              </p>
            </div>
          </div>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-40 bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ru">Русский</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="kk">Қазақша</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div> */}

      {/* Тема */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-accent" />
            <div>
              <p className="font-medium text-foreground">Тема оформления</p>
              <p className="text-sm text-muted-foreground">
                Тёмная или светлая тема
              </p>
            </div>
          </div>
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger className="w-40 bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4" /> Тёмная
                </div>
              </SelectItem>
              <SelectItem value="light">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4" /> Светлая
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Компактный режим */}
      {/* <div className="p-4 rounded-xl bg-muted/30 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Компактный режим</p>
              <p className="text-sm text-muted-foreground">
                Уменьшенные отступы и размер элементов
              </p>
            </div>
          </div>
          <Switch
            checked={compactMode}
            onCheckedChange={(checked) => {
              setCompactMode(checked);
              toast.success(checked ? 'Компактный режим включён' : 'Компактный режим отключён');
            }}
          />
        </div>
      </div> */}

      {!isTelegram ? <>    
      <Separator />

      {/* Данные */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">Данные</h3>

        {/* <div className="p-4 rounded-xl bg-muted/30 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Экспорт данных</p>
                <p className="text-sm text-muted-foreground">
                  Скачать все ваши данные
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              Экспорт
            </Button>
          </div>
        </div> */}

        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-medium text-foreground">Удаление аккаунта</p>
                <p className="text-sm text-muted-foreground">
                  Удалить аккаунт и все данные
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  Удалить
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Все ваши данные будут безвозвратно удалены.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Удалить аккаунт
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      </> : ''} 
    </div>
  );
}
