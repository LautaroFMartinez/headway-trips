'use client';

import Image from 'next/image';
import { Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';
import type { TeamMember } from '@/lib/nosotros-data';

const socialIcons = {
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
} as const;

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const { name, role, image, description, passions, socials } = member;

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-semibold text-foreground mb-0.5">{name}</h3>
        {role && (
          <p className="text-sm text-muted-foreground mb-3">{role}</p>
        )}
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
          {description}
        </p>
        {passions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {passions.map((passion) => (
              <span
                key={passion}
                className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium"
              >
                {passion}
              </span>
            ))}
          </div>
        )}
        {socials && Object.keys(socials).length > 0 && (
          <div className="flex gap-2 pt-2 border-t border-border">
            {(Object.entries(socials) as [keyof typeof socialIcons, string][])
              .filter(([, url]) => url)
              .map(([key, url]) => {
                const Icon = socialIcons[key];
                if (!Icon) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={`${name} - ${key}`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
          </div>
        )}
      </div>
    </article>
  );
}
