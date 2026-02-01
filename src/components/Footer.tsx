// src/components/Footer.tsx
import Link from 'next/link'

/**
 * Application footer
 */
export function Footer() {
  const currentYear = new Date().getFullYear()

  const links = {
    product: [
      { href: '/catalog?type=card', label: 'Карты' },
      { href: '/catalog?type=loan', label: 'Кредиты' },
      { href: '/catalog?type=microloan', label: 'Микрозаймы' },
    ],
    company: [
      { href: '/about', label: 'О нас' },
      { href: '/', label: 'Контакты' },
      // { href: '/', label: 'Блог' },
    ],
    legal: [
      { href: '/terms', label: 'Условия использования' },
      { href: '/privacy', label: 'Политика конфиденциальности' },
    ],
  }

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">C</span>
              </div>
              <span className="text-lg font-semibold">Credium</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              AI-powered подбор кредитных продуктов. Быстро, надёжно, выгодно.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Продукты</h4>
            <ul className="space-y-2">
              {links.product.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Компания</h4>
            <ul className="space-y-2">
              {links.company.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Правовая информация</h4>
            <ul className="space-y-2">
              {links.legal.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Credium. Все права защищены.
          </p>
          <p className="text-xs text-muted-foreground">
            Не является публичной офертой. Финальные условия определяются банком.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer