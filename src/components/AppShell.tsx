'use client'
import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CookieConsent } from './CookieConsent';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { BottomMenu } from './BottomMenu';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
  /** Hide footer (useful for full-screen pages) */
  hideFooter?: boolean;
}

/**
 * Main application layout wrapper
 * Provides header, footer, and accessibility skip link
 */
export function AppShell({ children, hideFooter = false }: AppShellProps) {
  const { isTelegram } = useTelegramAuth();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Перейти к основному содержимому
      </a>

      {/* Скрываем Header если это Telegram */}
      {!isTelegram && <Header />}

      <main id="main-content" className={cn("flex-1", isTelegram && "pt-[80px] pb-[80px]")}>
        {children}
      </main>

      {!hideFooter && !isTelegram && <Footer />}
      {isTelegram && <BottomMenu />}

      {!isTelegram && <CookieConsent />}
    </div>
  );
}

export default AppShell;
