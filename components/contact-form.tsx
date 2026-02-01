'use client';

import { useState } from 'react';
import { Send, MapPin, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert('¡Gracias por contactarnos! Te responderemos pronto.');

    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contacto" className="py-20 px-6 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-primary font-medium tracking-widest uppercase mb-2">Contacto</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">¿Listo para tu próxima aventura?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Completa el formulario y nuestro equipo te contactará para diseñar el viaje perfecto para vos.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Información de contacto */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Hablemos de tu viaje</h3>
              <p className="text-muted-foreground mb-8">Estamos aquí para hacer realidad el viaje de tus sueños. Contactanos por cualquiera de nuestros canales.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border">
                <MapPin className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Oficinas</h4>
                  <p className="text-sm text-muted-foreground">Presencia global - Atención online 24/7</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border">
                <Mail className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Email</h4>
                  <p className="text-sm text-muted-foreground">info@headwaytrips.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border">
                <Phone className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Teléfono</h4>
                  <p className="text-sm text-muted-foreground">+54 11 1234-5678</p>
                  <p className="text-xs text-muted-foreground mt-1">Lun - Vie: 9:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Nombre completo *
                </label>
                <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Tu nombre" className="w-full" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email *
                </label>
                <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="tu@email.com" className="w-full" />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Teléfono
                </label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+54 11 1234-5678" className="w-full" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Mensaje *
                </label>
                <Textarea id="message" name="message" required value={formData.message} onChange={handleChange} placeholder="Contanos sobre el viaje que soñás..." rows={5} className="w-full resize-none" />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-6 text-base">
                {isSubmitting ? (
                  <span className="animate-pulse">Enviando...</span>
                ) : (
                  <>
                    Enviar mensaje
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
