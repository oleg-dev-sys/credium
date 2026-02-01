// src/components/BottomMenu.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, User, CreditCard, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomMenu() {
  const pathname = usePathname()

  // Пункты меню (замени пути на те, что у тебя в Хедере)
  const menuItems = [
    { 
      label: 'Главная', 
      path: '/', 
      icon: Home 
    },
    { 
      label: 'Поиск', 
      path: '/search', 
      icon: Search 
    },
    { 
      label: 'Каталог', 
      path: '/catalog', 
      icon: BookOpen 
    },
    { 
      label: 'Профиль', 
      path: '/profile', 
      icon: User 
    },
  ]

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      {/* Контейнер с эффектом матового стекла */}
      <nav className="flex items-center justify-between px-2 py-3 bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl shadow-lg ring-1 ring-black/5">
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full gap-1 transition-colors duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary/70"
              )}
            >
              {/* Иконка */}
              <item.icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={cn("transition-all", isActive && "scale-110")}
              />
              
              {/* Текст */}
              <span className="text-[10px] font-medium leading-none">
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}