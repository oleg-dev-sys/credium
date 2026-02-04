'use client'

import { useState } from 'react'
import { Mail, Lock, UserPlus, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import VKWidget from './VKWidget'
import YandexWidget from './YandexWidget'
import { TelegramLoginButton } from './TelegramLoginButton'
import api from '@/services/api'

interface AuthModalsProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (registered: boolean) => void
  defaultMode?: 'login' | 'register'
  fromPath?: string // Добавили пропс для передачи пути возврата
}

export function AuthModals({ 
  isOpen, 
  onClose, 
  onSuccess, 
  defaultMode = 'login',
  fromPath = '/profile' // По умолчанию /profile
}: AuthModalsProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const { login, register, setToken } = useAuth()

  // Функция обработки успеха от виджета
  const handleTelegramSuccess = async (tgUser: any) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams();
    
      if (tgUser.id) params.append('id', String(tgUser.id));
      if (tgUser.first_name) params.append('first_name', tgUser.first_name);
      if (tgUser.last_name) params.append('last_name', tgUser.last_name);
      if (tgUser.username) params.append('username', tgUser.username);
      if (tgUser.photo_url) params.append('photo_url', tgUser.photo_url);
      if (tgUser.auth_date) params.append('auth_date', String(tgUser.auth_date));
      if (tgUser.hash) params.append('hash', tgUser.hash);

      const initDataString = params.toString();

      // Отправляем данные на бэкенд
      const userData = await api.loginWithTelegram(initDataString)

      if (userData && userData.access_token) {
        await setToken(userData.access_token) 
      }
      
      // Редирект на предыдущую страницу
      router.push(fromPath)
      
      onSuccess(true)
      onClose()
    } catch (err) {
      console.error('Telegram Login Error:', err)
      setError('Ошибка авторизации через Telegram')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (mode === 'register' && password !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      return
    }

    setIsLoading(true)

    try {
      if (mode === 'login') {
        await login(email, password)
        router.push(fromPath)
      } else {
        await register(email, password)
        router.push(fromPath)
      }
      
      // Если все ок:
      onSuccess(mode === 'register')
      onClose()
      
    } catch (err: any) {
      // Обработка ошибки
      setError(err.message || 'Произошла ошибка. Попробуйте позже.')
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
    setPassword('')
    setConfirmPassword('')
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
    setMode(defaultMode)
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          resetForm()
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'register' ? (
              <>
                <UserPlus className="w-5 h-5 text-primary" />
                Регистрация
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 text-primary" />
                Вход
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'register'
              ? 'Создайте аккаунт, чтобы сохранить результаты и получать персональные предложения'
              : 'Войдите в свой аккаунт'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="auth-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="auth-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="auth-password">Пароль</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="auth-confirm">Подтвердите пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="auth-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              'Загрузка...'
            ) : mode === 'register' ? (
              'Создать аккаунт'
            ) : (
              'Войти'
            )}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Или через
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Telegram */}
            <div className="w-full">
              <TelegramLoginButton 
                botName="Credium_Online_Bot"
                onSuccess={handleTelegramSuccess}
                isLoading={isLoading}
              />
            </div>

            {/* VK */}
            {/* <div className="w-full">
              <VKWidget 
                onSuccess={(data) => {
                  console.log('Успешный вход VK:', data);
                  // Здесь ты можешь вызвать функцию логина на бэкенд
                  // например: handleSocialAuth('vk', data);
                }}
                onError={(error) => {
                  console.error('Ошибка VK:', error);
                }}
              />
            </div> */}

            {/* Yandex */}
            {/* <div className="w-full">
              <YandexWidget 
              onSuccess={(data) => {
                console.log('Token from Yandex:', data.access_token);
                // Отправляем токен на бэкенд для входа
                // handleSocialSuccess('yandex', data);
              }}
            />
            </div> */}
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {mode === 'register' ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}
            </span>{' '}
            <button
              type="button"
              onClick={switchMode}
              className="text-primary hover:underline font-medium"
            >
              {mode === 'register' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </div>

          {mode === 'register' && (
            <p className="text-xs text-muted-foreground text-center">
              Регистрируясь, вы соглашаетесь с{' '}
              <Link href="/terms" className="text-primary hover:underline">
                условиями использования
              </Link>{' '}
              и{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                политикой конфиденциальности
              </Link>
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}