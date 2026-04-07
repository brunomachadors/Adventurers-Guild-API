'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { href: '/', label: 'Overview' },
  { href: '/guides', label: 'Guides' },
  { href: '/docs', label: 'Docs' },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-brand" href="/">
          <span className="site-brand__crest">
            <Image
              alt="Adventurers Guild crest"
              className="site-brand__crest-image"
              height={56}
              priority
              src="/images/brand/site-icon.png"
              width={56}
            />
          </span>
          <span className="site-brand__copy">
            <span className="site-brand__eyebrow">Adventurers Guild</span>
            <span className="site-brand__title">Campaign Codex</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="site-nav">
          {navigationItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`site-nav__link${isActive ? ' site-nav__link--active' : ''}`}
                href={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
