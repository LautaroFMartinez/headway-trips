'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://headwaytrips.com';

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Generate JSON-LD Schema for breadcrumbs
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: BASE_URL,
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        ...(item.href && {
          item: `${BASE_URL}${item.href}`,
        }),
      })),
    ],
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Visual Breadcrumbs */}
      <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`flex items-center gap-2 text-sm ${className}`} aria-label="Breadcrumb">
        <ol className="flex items-center gap-2" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors" itemProp="item">
              <Home className="w-4 h-4" />
              <span className="sr-only" itemProp="name">
                Inicio
              </span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              {item.href ? (
                <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors" itemProp="item">
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span className="text-foreground font-medium" itemProp="name">
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={String(index + 2)} />
            </li>
          ))}
        </ol>
      </motion.nav>
    </>
  );
}
