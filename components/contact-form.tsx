'use client';

import { useState } from 'react';
import { Send, MapPin, Mail, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Oficinas',
    description: 'Presencia global - Atencion online 24/7',
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'info@headwaytrips.com',
  },
  {
    icon: Phone,
    title: 'Telefono',
    description: '+54 11 1234-5678',
    extra: 'Lun - Vie: 9:00 - 18:00',
  },
];

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSuccess(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);

    setTimeout(() => setIsSuccess(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contacto" className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-sm font-medium text-accent uppercase tracking-widest mb-3">
            Contacto
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Listo para tu proxima <span className="font-serif italic text-primary">aventura?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Completa el formulario y nuestro equipo te contactara para diseñar el viaje perfecto
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Hablemos de tu viaje</h3>
                <p className="text-muted-foreground text-sm">
                  Estamos aqui para hacer realidad el viaje de tus sueños
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground text-sm">{info.title}</h4>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                        {info.extra && (
                          <p className="text-xs text-muted-foreground mt-1">{info.extra}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                {isSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Mensaje enviado</h3>
                    <p className="text-muted-foreground">Te responderemos pronto</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                          Nombre *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Tu nombre"
                          className="h-11"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="tu@email.com"
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Telefono
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+54 11 1234-5678"
                        className="h-11"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Mensaje *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Contanos sobre el viaje que soñas..."
                        rows={4}
                        className="resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 text-base font-medium"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Enviando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Enviar mensaje
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
