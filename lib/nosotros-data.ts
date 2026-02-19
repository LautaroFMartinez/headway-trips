export interface TeamMemberSocials {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
}

export interface TeamMember {
  name: string;
  role?: string;
  image: string;
  description: string;
  passions: string[];
  socials?: TeamMemberSocials;
}

export const teamMembers: TeamMember[] = [
  {
    name: 'Nombre Dueño 1',
    role: 'Co-fundador',
    image: '/team/owner1.svg',
    description: 'Apasionado por los viajes y la cultura. Con más de 10 años diseñando experiencias únicas alrededor del mundo.',
    passions: ['Viajar', 'Fotografía', 'Gastronomía', 'Culturas'],
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    name: 'Nombre Dueño 2',
    role: 'Co-fundador',
    image: '/team/owner2.svg',
    description: 'Especialista en destinos de aventura y naturaleza. Cree que cada viaje transforma la vida de quien lo vive.',
    passions: ['Aventura', 'Naturaleza', 'Sostenibilidad', 'Trekking'],
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    name: 'Nombre Dueño 3',
    role: 'Co-fundador',
    image: '/team/owner3.svg',
    description: 'Enfocado en experiencias personalizadas y grupos reducidos. Detrás de cada itinerario hay historias por descubrir.',
    passions: ['Personalización', 'Historia', 'Arte', 'Música'],
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
  },
];
