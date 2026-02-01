import { Plane, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <Plane className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-2xl font-bold">Headway Trips</span>
            </Link>
            <p className="text-background/70 text-sm">Tu agencia de viajes de confianza. Creamos experiencias únicas en los mejores destinos del mundo.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">Enlaces</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <Link href="/#destinos" className="hover:text-background transition-colors">
                  Destinos
                </Link>
              </li>
              <li>
                <Link href="/comparador" className="hover:text-background transition-colors">
                  Comparador
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-background transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/#contacto" className="hover:text-background transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">Contacto</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@headwaytrips.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+54 11 1234-5678</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Oficinas en todo el mundo</span>
              </li>
            </ul>
            <div className="mt-4">
              <h5 className="font-medium text-sm mb-2">Horario</h5>
              <p className="text-xs text-background/60">Lun - Vie: 9:00 - 18:00</p>
              <p className="text-xs text-background/60">Sáb: 10:00 - 14:00</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">Legal</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <Link href="/privacidad" className="hover:text-background transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-background transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/50">
          <p>© {new Date().getFullYear()} Headway Trips. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/privacidad" className="hover:text-background/80 transition-colors">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-background/80 transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
