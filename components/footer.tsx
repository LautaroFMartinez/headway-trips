import { Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const footerLinks = {
  destinos: [
    { href: '/#destinos', label: 'Todos los destinos' },
    { href: '/comparador', label: 'Comparador' },
    { href: '/blog', label: 'Blog' },
  ],
  empresa: [
    { href: '/#nosotros', label: 'Nosotros' },
    { href: '/#contacto', label: 'Contacto' },
  ],
  legal: [
    { href: '/privacidad', label: 'Politica de Privacidad' },
    { href: '/terminos', label: 'Terminos y Condiciones' },
  ],
};

const contactInfo = [
  { icon: Mail, text: 'info@headwaytrips.com' },
  { icon: Phone, text: '+54 11 1234-5678' },
  { icon: MapPin, text: 'Buenos Aires, Argentina' },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image 
                src="/icono.png" 
                alt="Headway Trips Logo" 
                width={32} 
                height={32}
                className="brightness-0 invert"
              />
              <span className="text-lg font-semibold">Headway Trips</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
              Tu agencia de viajes de confianza. Creamos experiencias unicas en los mejores destinos.
            </p>
            <div className="space-y-2">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-2 text-sm text-primary-foreground/70">
                    <Icon className="h-4 w-4" />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Destinos */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Destinos</h4>
            <ul className="space-y-2">
              {footerLinks.destinos.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-primary-foreground/10">
              <p className="text-xs text-primary-foreground/50">Lun - Vie: 9:00 - 18:00</p>
              <p className="text-xs text-primary-foreground/50">Sab: 10:00 - 14:00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/50">
            <p>2025 Headway Trips. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacidad" className="hover:text-primary-foreground transition-colors">
                Privacidad
              </Link>
              <Link href="/terminos" className="hover:text-primary-foreground transition-colors">
                Terminos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
