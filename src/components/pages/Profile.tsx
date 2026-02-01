'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Settings, Bell, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/AppShell';
import { AIScoreCard } from '@/components/AIScoreCard';
import { CUnitMascot } from '@/components/CUnitMascot';
import { PersonalDataSection } from '@/components/profile/PersonalDataSection';
import { NotificationsSection } from '@/components/profile/NotificationsSection';
import { SecuritySection } from '@/components/profile/SecuritySection';
import { SettingsSection } from '@/components/profile/SettingsSection';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';

type ProfileTab = 'personal' | 'notifications' | 'security' | 'settings';

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
  const [showCUnitDialog, setShowCUnitDialog] = useState(false);
  const { isTelegram } = useTelegramAuth();

  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <AppShell>
        <div className="container py-20 text-center">
          <CUnitMascot state="scanning" size={64} className="mx-auto mb-4" />
          <p className="text-muted-foreground">Загрузка профиля...</p>
        </div>
      </AppShell>
    );
  }

  const getMemberYear = (dateString?: string) => {
    if (!dateString) return '2025';
    return new Date(dateString).getFullYear().toString();
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const displayUser = {
    full_name: user.full_name || 'Пользователь',
    email: user.email,
    aiScore: user.ai_score && user.ai_score > 0 ? user.ai_score : 78,
    memberSince: getMemberYear(user.created_at), // можно добавить поле created_at в модель позже
  };

  const menuItems: (null | { id: ProfileTab; icon: React.ReactNode; label: string })[] = [
    { id: 'personal', icon: <User className="w-5 h-5" />, label: 'Личные данные' },
    isTelegram ? null : { id: 'notifications', icon: <Bell className="w-5 h-5" />, label: 'Уведомления' },
    isTelegram ? null : { id: 'security', icon: <Shield className="w-5 h-5" />, label: 'Безопасность' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Настройки' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalDataSection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'security':
        return <SecuritySection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <PersonalDataSection />;
    }
  };

  // Фильтруем null перед использованием
  const filteredMenuItems = menuItems.filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <AppShell>
      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={displayUser.full_name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User className="w-8 h-8 text-primary" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{displayUser.full_name}</h1>
                  <p className="text-muted-foreground">{displayUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CUnitMascot state="idle" size={32} />
                  <span className="text-sm text-muted-foreground">
                    Пользователь с {displayUser.memberSince}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Navigation Menu */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <nav className="space-y-1">
                {filteredMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left',
                      activeTab === item.id
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted text-foreground'
                    )}
                  >
                    <span className={cn(
                      activeTab === item.id ? 'text-primary' : 'text-muted-foreground'
                    )}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}

                <div className="h-px bg-border my-2" />

                {!isTelegram ? <>  
                <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 transition-colors text-destructive w-full text-left" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Выйти</span>
                </button>
                </> : ''}
              </nav>
            </motion.div>

            {/* Content Section */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              {renderContent()}
            </motion.div>
          </div>

          {/* Right Column - AI Score */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <AIScoreCard
                score={displayUser.aiScore}
                explanation={[
                  'Хорошая платёжная дисциплина',
                  'Нет просроченных платежей',
                  'Умеренная кредитная нагрузка',
                ]}
                suggestions={[
                  'Увеличьте срок кредитной истории',
                  'Закройте неиспользуемые карты',
                ]}
              />

              <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <CUnitMascot state="idle" size={40} />
                  <p className="text-sm text-muted-foreground">
                    C-Unit следит за вашим рейтингом и подскажет, как его улучшить
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => setShowCUnitDialog(true)}>
                  Узнать больше
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* C-Unit Info Dialog */}
        <Dialog open={showCUnitDialog} onOpenChange={setShowCUnitDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <CUnitMascot state="approve" size={40} />
                <span>Что такое C-Unit?</span>
              </DialogTitle>
              <DialogDescription className="text-left pt-4 space-y-4">
                <p>
                  <strong>C-Unit</strong> — это ваш персональный финансовый помощник, который анализирует вашу кредитную историю и помогает улучшить финансовое здоровье.
                </p>
                <p>
                  <strong>AI-рейтинг</strong> — это оценка от 0 до 100, которая показывает вероятность одобрения кредита. Чем выше рейтинг, тем лучше условия вы можете получить.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="font-medium">Как улучшить рейтинг:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Своевременно оплачивайте кредиты</li>
                    <li>Не используйте более 30% лимита карт</li>
                    <li>Избегайте частых заявок на кредиты</li>
                    <li>Поддерживайте длительную кредитную историю</li>
                  </ul>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
