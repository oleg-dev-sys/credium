// src/components/Header.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CUnitMascot } from './CUnitMascot'
import { useUIStore } from '@/store/uiStore'
import { useAuth } from '@/context/AuthContext'
import { AuthModals } from './AuthModals'

/**
 * Main application header
 * Responsive with mobile menu support
 */
export function Header() {
  const router = useRouter()
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore()
  const [showCUnitHelp, setShowCUnitHelp] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()  
  const [showAuthModal, setShowAuthModal] = useState(false)

  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/search', label: 'Поиск' },
    { href: '/catalog?type=all', label: 'Каталог' },
    { href: '/profile', label: 'Профиль' },
  ]

  const filteredNavigation = navLinks.filter(item => 
    item.href !== '/profile' || isAuthenticated
  )

  // Обработчик клика по иконке профиля
  const handleUserClick = () => {
    if (isAuthenticated) {
      router.push('/profile')
    } else {
      setShowAuthModal(true)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity"
          aria-label="Credium - На главную"
        >
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">C</span>
          </div>
          <span className="hidden sm:block text-xl font-semibold">Credium</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Основная навигация">
          {filteredNavigation.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* C-Unit Mini */}
          <div className="relative">
            <CUnitMascot
              state="idle"
              size={36}
              className="cursor-pointer"
              onClick={() => setShowCUnitHelp(!showCUnitHelp)}
            />
            <AnimatePresence>
              {showCUnitHelp && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="fixed md:absolute right-0 top-full mt-2 w-64 p-4 rounded-lg bg-card shadow-card border border-border"
                >
                  <p className="text-sm text-muted-foreground">
                    Привет! Я C-Unit, ваш AI-помощник. Помогу подобрать лучший кредитный продукт.
                  </p>
                  <Button
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => {
                      setShowCUnitHelp(false)
                      router.push('/onboarding')
                    }}
                  >
                    Начать подбор
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Button (Mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => router.push('/search')}
            aria-label="Поиск"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Profile Button */}
          <Button
            variant={isAuthenticated ? "default" : "outline"} // Меняем стиль
            size="icon"
            onClick={handleUserClick}
            aria-label={isAuthenticated ? "Профиль" : "Войти"}
          >
            <User className="h-5 w-5" />
          </Button>

          {isAuthenticated && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  logout()
                  router.push('/')
                }}
              >
                <LogOut className="h-5 w-5 text-muted-foreground" />
              </Button>
            )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border overflow-hidden"
            aria-label="Мобильное меню"
          >
            <div className="container py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <AuthModals 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </header>
  )
}

export default Header