'use client';

import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491112345678';
const DEFAULT_MESSAGE = '¡Hola! Me interesa obtener más información sobre sus paquetes de viaje.';

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
}

export function WhatsAppButton({ message = DEFAULT_MESSAGE, className }: WhatsAppButtonProps) {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className={cn('fixed bottom-6 right-6 z-50', 'flex items-center justify-center', 'w-14 h-14 rounded-full', 'bg-[#25D366] hover:bg-[#20BA5C]', 'text-white shadow-lg', 'transition-all duration-300 ease-in-out', 'hover:scale-110 hover:shadow-xl', 'focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2', className)}
    >
      <MessageCircle className="w-7 h-7" fill="currentColor" />

      {/* Pulse animation */}
      <span className="absolute w-full h-full rounded-full bg-[#25D366] animate-ping opacity-20" />
    </a>
  );
}
