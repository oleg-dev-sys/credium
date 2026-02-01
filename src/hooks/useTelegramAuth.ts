'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'

export function useTelegramAuth() {
  const { setToken, isAuthenticated } = useAuth()
  const [isTelegram, setIsTelegram] = useState(false)

  useEffect(() => {
    // Импортируем WebApp только на клиенте
    if (typeof window === 'undefined') return

    import('@twa-dev/sdk').then(({ default: WebApp }) => {
      if (WebApp.initData.length > 0) {
        setIsTelegram(true)

        const platform = WebApp.platform
        const isPhone = platform === 'android' || platform === 'ios'

        if (isPhone) {
          WebApp.expand?.()
          WebApp.disableVerticalSwipes?.()
          WebApp.requestFullscreen?.()
        } else {
          WebApp.exitFullscreen?.()
        }

        WebApp.ready()
        WebApp.setBackgroundColor('#1a1f28')
        WebApp.setHeaderColor('#1a1f28')

        if (isAuthenticated) return

        const initData = WebApp.initData

        api
          .loginWithTelegram(initData)
          .then(async (userData) => {
            await setToken(userData.access_token)
          })
          .catch((err) => console.error('Telegram Auth failed:', err))
      }
    })
  }, [isAuthenticated])

  return { isTelegram }
}