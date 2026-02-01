'use client';

import { Facebook, Twitter, Linkedin, Link2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'hover:bg-[#1877F2] hover:text-white',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: 'hover:bg-[#1DA1F2] hover:text-white',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      color: 'hover:bg-[#0A66C2] hover:text-white',
    },
    {
      name: 'Email',
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
      color: 'hover:bg-gray-600 hover:text-white',
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Enlace copiado',
        description: 'El enlace se ha copiado al portapapeles',
      });
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-card border border-border rounded-xl">
      <h3 className="font-serif text-lg font-semibold">Compartir este viaje</h3>
      <div className="flex gap-2 flex-wrap">
        {shareLinks.map((link) => (
          <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" title={`Compartir en ${link.name}`}>
            <Button variant="outline" size="icon" className={`transition-colors ${link.color}`}>
              <link.icon className="w-4 h-4" />
              <span className="sr-only">Compartir en {link.name}</span>
            </Button>
          </a>
        ))}
        <Button variant="outline" size="icon" onClick={copyToClipboard} title="Copiar enlace" className="hover:bg-primary hover:text-primary-foreground transition-colors">
          <Link2 className="w-4 h-4" />
          <span className="sr-only">Copiar enlace</span>
        </Button>
      </div>
    </div>
  );
}
