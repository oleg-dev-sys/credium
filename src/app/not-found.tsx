// app/not-found.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // ! Замена useLocation
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/AppShell'; // Обернем в ваш лейаут, чтобы шапка/футер остались
import { FileQuestion } from 'lucide-react'; // Иконка для красоты

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error(`404 Error: Попытка доступа к несуществующему маршруту: ${pathname}`);
  }, [pathname]);

  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-muted p-6 rounded-full mb-6">
          <FileQuestion className="w-12 h-12 text-muted-foreground" />
        </div>
        
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-xl font-semibold mb-4">Страница не найдена</h2>
        
        <p className="text-muted-foreground max-w-md mb-8">
          Кажется, вы пытаетесь попасть на страницу, которой не существует. 
          Возможно, она была перемещена или удалена.
        </p>

        <Button asChild size="lg">
          <Link href="/">
            Вернуться на главную
          </Link>
        </Button>
      </div>
    </AppShell>
  );
}