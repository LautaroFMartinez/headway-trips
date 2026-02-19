// Landing page segments data
export interface Segment {
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  type: 'region' | 'activity' | 'season';
  relatedTrips: string[]; // Trip IDs
  content: {
    intro: string;
    features: string[];
    tips: string[];
  };
  heroImage: string;
  faqs?: Array<{ question: string; answer: string }>;
}

export const segments: Segment[] = [
  // REGIONES - Europa
  {
    slug: 'europa-occidental',
    title: 'Viajes a Europa Occidental',
    description: 'Descubrí Francia, Italia y España: París, Roma, Barcelona y los destinos más emblemáticos',
    metaDescription: 'Explorá Europa Occidental con nuestros paquetes. París, Roma, Barcelona: cultura, arte, gastronomía y experiencias para viajeros de 20 a 30 años.',
    keywords: ['europa occidental', 'viajes europa', 'París', 'Roma', 'Barcelona', 'turismo europa', 'viajes jóvenes'],
    type: 'region',
    relatedTrips: ['europa-clasica-2026'],
    content: {
      intro: 'Europa Occidental concentra lo mejor del continente: arte, historia, gastronomía y vida urbana. Ideal para tu primera gran aventura o para seguir explorando.',
      features: ['Ciudades icónicas: París, Roma, Barcelona', 'Arte y arquitectura de nivel mundial', 'Gastronomía y vida nocturna', 'Conexiones fáciles entre destinos', 'Experiencias pensadas para viajeros jóvenes'],
      tips: ['Reservá con anticipación en temporada alta', 'Movete en tren para ahorrar y vivir la experiencia', 'Días largos en verano, aprovechalos', 'Considerá al menos 7-10 días para dos ciudades'],
    },
    heroImage: '/og-image.jpg',
  },
  {
    slug: 'mediterraneo',
    title: 'Viajes al Mediterráneo',
    description: 'Sol, cultura y costa: Barcelona, Roma, Lisboa y el sur de Europa',
    metaDescription: 'Viajes al Mediterráneo: Barcelona, Roma, Lisboa. Playas, historia, gastronomía y buen clima. Paquetes para jóvenes.',
    keywords: ['mediterráneo', 'Barcelona', 'Roma', 'Lisboa', 'costa europa', 'viajes verano europa'],
    type: 'region',
    relatedTrips: ['europa-clasica-2026'],
    content: {
      intro: 'El Mediterráneo combina playa, historia milenaria y una forma de vida que invita a disfrutar. Perfecto para combinar cultura y relax.',
      features: ['Ciudades costeras con patrimonio UNESCO', 'Gastronomía mediterránea', 'Clima ideal gran parte del año', 'Vida nocturna y ambiente joven', 'Fácil de combinar con otras rutas'],
      tips: ['Verano es temporada alta: reservá pronto', 'Primavera y otoño ofrecen buen clima y menos gente', 'Probá el transporte público y los free walking tours', 'Dedicá al menos 4-5 días por ciudad'],
    },
    heroImage: '/og-image.jpg',
  },
  {
    slug: 'europa-norte',
    title: 'Viajes al Norte de Europa',
    description: 'Amsterdam, Praga y destinos con historia, cultura y ambiente joven',
    metaDescription: 'Turismo en el norte de Europa: Amsterdam, Praga. Historia, cultura, vida nocturna y experiencias para viajeros de 20 a 30 años.',
    keywords: ['norte europa', 'Amsterdam', 'Praga', 'viajes europa', 'ciudades europa', 'turismo cultural'],
    type: 'region',
    relatedTrips: ['europa-clasica-2026'],
    content: {
      intro: 'El norte de Europa ofrece ciudades vibrantes, historia reciente y contemporánea, y una escena cultural y nocturna pensada para jóvenes viajeros.',
      features: ['Ciudades caminables y seguras', 'Museos y cultura de primer nivel', 'Ambiente joven y vida nocturna', 'Buenas conexiones en tren y low cost', 'Experiencias únicas por temporada'],
      tips: ['Llevá capa para la lluvia', 'Reservá museos y atracciones online', 'El tren es la mejor forma de moverse', 'Aprovechá los free tours para orientarte'],
    },
    heroImage: '/og-image.jpg',
  },
  {
    slug: 'escapadas-urbanas',
    title: 'Escapadas urbanas en Europa',
    description: 'Ciudades europeas en 3, 4 o 5 días: la forma ideal de conocer Europa',
    metaDescription: 'Escapadas urbanas Europa: París, Roma, Barcelona, Amsterdam, Praga. Paquetes cortos para jóvenes. Cultura, gastronomía y diversión.',
    keywords: ['escapadas urbanas', 'city break europa', 'viajes cortos europa', 'París', 'Barcelona', 'Roma'],
    type: 'region',
    relatedTrips: ['europa-clasica-2026'],
    content: {
      intro: 'Las escapadas urbanas son la forma perfecta de descubrir Europa: ciudades con todo concentrado, bien conectadas y con ambiente joven.',
      features: ['Paquetes de 3 a 5 noches por ciudad', 'Alojamiento céntrico y bien conectado', 'Lo imprescindible de cada destino', 'Flexibilidad para sumar noches o destinos', 'Pensado para aprovechar al máximo'],
      tips: ['Elegí un barrio céntrico para no perder tiempo', 'Un free tour el primer día te orienta', 'Comé donde comen los locales', 'Reservá entradas a museos con anticipación'],
    },
    heroImage: '/og-image.jpg',
  },

  // ACTIVIDADES
  {
    slug: 'aventura',
    title: 'Viajes de Aventura en Europa',
    description: 'Senderismo, naturaleza, deportes y experiencias activas en los mejores destinos',
    metaDescription: 'Turismo aventura en Europa: senderismo, naturaleza, deportes. Experiencias activas para viajeros jóvenes.',
    keywords: ['turismo aventura', 'senderismo europa', 'naturaleza europa', 'viajes activos', 'experiencias aventura'],
    type: 'activity',
    relatedTrips: ['europa-clasica-2026'],
    content: {
      intro: 'Europa ofrece escenarios increíbles para aventura: desde senderos costeros hasta parques naturales, con infraestructura y seguridad de primer nivel.',
      features: ['Senderismo y rutas señalizadas', 'Parques naturales y reservas', 'Deportes al aire libre', 'Grupos pequeños y ambiente joven', 'Guías locales especializados'],
      tips: ['Llevá calzado cómodo y ropa por capas', 'Contratá seguros de actividad', 'Respetá las normas de cada parque', 'Informate del clima antes de salir'],
    },
    heroImage: '/og-image.jpg',
  },
  {
    slug: 'enoturismo',
    title: 'Enoturismo: Rutas del Vino en Europa',
    description: 'Degustaciones, bodegas y experiencias gastronómicas en Francia, Italia y España',
    metaDescription: 'Enoturismo en Europa: rutas del vino, degustaciones, bodegas. Francia, Italia, España. Experiencias premium para jóvenes.',
    keywords: ['enoturismo', 'ruta del vino', 'bodegas europa', 'degustaciones', 'wine tour europa'],
    type: 'activity',
    relatedTrips: ['europa-clasica-2026'],
    content: {
      intro: 'Las regiones vinícolas de Europa son un destino en sí mismas: paisajes, historia y gastronomía en cada cata. Experiencias pensadas para disfrutar sin prisas.',
      features: ['Visitas a bodegas y viñedos', 'Degustaciones guiadas', 'Maridajes con gastronomía local', 'Paisajes únicos en cada región', 'Tours en grupo o privados'],
      tips: ['Designá conductor o contratá transporte', 'Reservá con 1-2 semanas de anticipación', 'Primavera y otoño son épocas ideales', 'Combiná con una noche en la región'],
    },
    heroImage: '/og-image.jpg',
  },
  {
    slug: 'naturaleza',
    title: 'Viajes de Naturaleza y Ecoturismo en Europa',
    description: 'Parques nacionales, costa y naturaleza bien conservada',
    metaDescription: 'Ecoturismo en Europa: parques nacionales, costa, naturaleza. Turismo sustentable y experiencias al aire libre.',
    keywords: ['ecoturismo', 'naturaleza europa', 'parques nacionales', 'turismo sustentable', 'viajes naturaleza'],
    type: 'activity',
    relatedTrips: ['europa-clasica-2026'],
    content: {
      intro: 'Europa conserva espacios naturales increíbles: costa, montaña y parques accesibles. Ideal para conectar con la naturaleza sin renunciar a la comodidad.',
      features: ['Parques nacionales y reservas', 'Senderos señalizados y seguros', 'Observación de fauna y paisajes', 'Turismo responsable', 'Combinable con ciudades'],
      tips: ['Respetá las normas de cada espacio', 'Llevá agua y algo de comida', 'Ropa adecuada al clima y terreno', 'Informate de horarios y accesos'],
    },
    heroImage: '/og-image.jpg',
  },
  {
    slug: 'gastronomia',
    title: 'Viajes Gastronómicos por Europa',
    description: 'Sabores locales, mercados, restaurantes y experiencias culinarias',
    metaDescription: 'Turismo gastronómico en Europa: comida local, mercados, food tours. Francia, Italia, España. Experiencias para jóvenes.',
    keywords: ['turismo gastronómico', 'comida europa', 'food tour', 'gastronomía europea', 'viajes gastronómicos'],
    type: 'activity',
    relatedTrips: ['europa-clasica-2026'],
    content: {
      intro: 'Europa es un paraíso gastronómico: cada región tiene sus platos, mercados y tradiciones. Comer bien es parte esencial del viaje.',
      features: ['Food tours y experiencias guiadas', 'Mercados locales y tiendas tradicionales', 'Clases de cocina', 'Restaurantes recomendados por locales', 'Rutas temáticas (vino, tapas, pasta)'],
      tips: ['Comé en horario local cuando puedas', 'Probá los mercados al mediodía', 'Reservá restaurantes populares con tiempo', 'Dejá espacio para lo que surja'],
    },
    heroImage: '/og-image.jpg',
  },

  // TEMPORADAS
  {
    slug: 'verano',
    title: 'Viajes de Verano en Europa',
    description: 'Sol, días largos, festivales y la mejor época para descubrir Europa',
    metaDescription: 'Destinos de verano en Europa: playas, ciudades, festivales. Vacaciones de verano para jóvenes. 2026.',
    keywords: ['verano europa', 'vacaciones verano', 'viajes verano', 'europa julio agosto', 'turismo verano'],
    type: 'season',
    relatedTrips: ['europa-clasica-2026'],
    content: {
      intro: 'El verano europeo ofrece días largos, buen clima y una agenda llena de festivales y vida en la calle. La época más animada para viajar.',
      features: ['Días largos para aprovechar al máximo', 'Festivales y eventos al aire libre', 'Playas y costa mediterránea', 'Ambiente joven y animado', 'Ofertas de vuelos y alojamiento'],
      tips: ['Reservá con meses de anticipación', 'Llevá protección solar y ropa ligera', 'Madrugá para evitar colas en atracciones', 'Junio y septiembre suelen ser más suaves'],
    },
    heroImage: '/og-image.jpg',
  },
  {
    slug: 'invierno',
    title: 'Viajes de Invierno: Esquí y Ciudades en Europa',
    description: 'Mercados navideños, nieve, esquí y ciudades con encanto invernal',
    metaDescription: 'Turismo de invierno en Europa: mercados navideños, esquí, ciudades. Vacaciones de invierno para jóvenes.',
    keywords: ['invierno europa', 'esquí europa', 'mercados navideños', 'viajes invierno', 'turismo invierno'],
    type: 'season',
    relatedTrips: ['europa-clasica-2026'],
    content: {
      intro: 'El invierno en Europa tiene un encanto especial: mercados navideños, ciudades iluminadas, opciones de esquí y menos aglomeraciones.',
      features: ['Mercados navideños y ferias', 'Ciudades con ambiente invernal', 'Estaciones de esquí en los Alpes', 'Museos y planes de interior', 'Ofertas fuera de temporada alta'],
      tips: ['Abrigate bien y en capas', 'Reservá con tiempo en fechas navideñas', 'Aprovechá los planes de interior', 'Diciembre y enero son los más mágicos'],
    },
    heroImage: '/og-image.jpg',
  },
  {
    slug: 'primavera',
    title: 'Viajes de Primavera en Europa',
    description: 'Flores, clima ideal y destinos en su mejor momento',
    metaDescription: 'Turismo de primavera en Europa: clima ideal, flores, menos turistas. Mejores destinos primavera para jóvenes.',
    keywords: ['primavera europa', 'turismo primavera', 'viajes abril mayo', 'clima ideal europa'],
    type: 'season',
    relatedTrips: ['europa-clasica-2026'],
    content: {
      intro: 'La primavera es una de las mejores épocas para viajar a Europa: clima agradable, naturaleza en flor, menos turistas y precios más accesibles.',
      features: ['Clima templado ideal para caminar', 'Jardines y parques en flor', 'Menos aglomeraciones', 'Precios más bajos que en verano', 'Días que se alargan'],
      tips: ['Llevá ropa por capas', 'Abril y mayo son ideales', 'Reservá con anticipación para Semana Santa', 'Perfecto para fotografía y planes al aire libre'],
    },
    heroImage: '/og-image.jpg',
  },
  {
    slug: 'otono',
    title: 'Viajes de Otoño en Europa',
    description: 'Colores, vendimias, clima agradable y temporada baja',
    metaDescription: 'Turismo de otoño en Europa: colores, clima agradable, vendimias. Mejores destinos otoño para jóvenes.',
    keywords: ['otoño europa', 'turismo otoño', 'viajes septiembre octubre', 'europa otoño'],
    type: 'season',
    relatedTrips: ['europa-clasica-2026'],
    content: {
      intro: 'El otoño pinta Europa de colores y trae vendimias, ferias y un clima ideal. Temporada perfecta para combinar cultura y naturaleza.',
      features: ['Paisajes con colores otoñales', 'Clima fresco ideal para caminatas', 'Vendimias y experiencias gastronómicas', 'Menos turistas, mejores precios', 'Luz ideal para fotografía'],
      tips: ['Septiembre y octubre son excelentes', 'Llevá abrigo ligero y paraguas', 'Aprovechá las rutas del vino', 'Reservá con tiempo para puentes'],
    },
    heroImage: '/og-image.jpg',
  },
];

// Helper functions
export function getSegmentBySlug(slug: string): Segment | undefined {
  return segments.find((segment) => segment.slug === slug);
}

export function getSegmentsByType(type: Segment['type']): Segment[] {
  return segments.filter((segment) => segment.type === type);
}

export function getRelatedSegments(currentSlug: string, limit: number = 3): Segment[] {
  const current = getSegmentBySlug(currentSlug);
  if (!current) return [];

  return segments.filter((segment) => segment.slug !== currentSlug && segment.type === current.type).slice(0, limit);
}
