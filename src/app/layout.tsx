import './globals.css'
import type { Metadata, Viewport } from 'next' // ← Добавлен импорт Viewport
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter'
})

// Отдельный экспорт для viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1f28' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: 'Credium — подбор кредитов онлайн',
    template: '%s | Credium'
  },
  description: 'Умный сервис подбора кредитов с AI-анализом C-Unit',
  authors: [{ name: 'Credium', url: 'https://credium.store' }],
  creator: 'Credium',
  publisher: 'Credium',
  keywords: [
    'кредиты онлайн', 
    'микрозаймы', 
    'кредитные карты', 
    'подбор кредита', 
    'одобрение кредита', 
    'AI кредитный скоринг',
    'займ до зарплаты',
    'деньги в долг',
    'кредит'
  ],
  
  icons: {
    icon: [
      { url: '/favicon.ico?v=2', type: 'image/x-icon' },
      { url: '/favicon-16x16.png?v=2', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png?v=2', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png?v=2',
    shortcut: '/favicon.ico?v=2',
  },

  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://credium.store', 
    siteName: 'Credium',
    images: [
      {
        url: 'https://credium.store/og-main.png',
        width: 1200,
        height: 630,
        alt: 'Credium — AI-подбор кредитов',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    creator: '@credium',
    site: '@credium',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE', 
    yandex: 'YOUR_YANDEX_VERIFICATION_CODE', 
  },

  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Credium',
  },
  formatDetection: {
    telephone: false,
  },

  other: {
    'application/ld+json': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Credium",
      "url": "https://credium.store",
      "description": "Умный сервис подбора кредитных продуктов с AI-анализом",
      "publisher": {
        "@type": "Organization",
        "name": "Credium",
        "logo": {
          "@type": "ImageObject",
          "url": "https://credium.store/logo.png" 
        }
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://credium.store/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    })
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Предзагрузка шрифтов */}
        <link 
          rel="preload" 
          href="/fonts/inter-var-latin-cyrillic.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        
        {/* Предзагрузка критических изображений */}
        <link 
          rel="preload" 
          href="/og-main.png" 
          as="image" 
        />
        
        {/* Предварительное подключение к доменам - УБРАНЫ ПРОБЕЛЫ */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Явное указание фавиконки с версией */}
        <link rel="icon" href="https://www.credium.store/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
        
        {/* Предотвращение кэширования фавиконки */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        
        {/* Скрипт для темы */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('theme') || 'dark';
                if (theme === 'light') {
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        
        {/* Скрипт для предварительного рендеринга */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.prerenderReady = false;
              window.addEventListener('load', () => {
                setTimeout(() => {
                  window.prerenderReady = true;
                }, 1000);
              });
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
        
        {/* Yandex.Metrika counter - УБРАНЫ ПРОБЕЛЫ */}
        <noscript>
          <div>
            <img 
              src="https://mc.yandex.ru/watch/XXXXXX" 
              style={{ position: 'absolute', left: '-9999px' }} 
              alt="" 
            />
          </div>
        </noscript>
      </body>
    </html>
  )
}