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
  // REGIONES
  {
    slug: 'patagonia',
    title: 'Viajes a la Patagonia Argentina',
    description: 'Descubrí los mejores destinos de la Patagonia: glaciares, montañas, lagos y paisajes únicos',
    metaDescription: 'Explorá la Patagonia Argentina con nuestros paquetes turísticos. Bariloche, El Calafate, Ushuaia y más destinos patagónicos.',
    keywords: ['patagonia', 'viajes patagonia', 'turismo patagonia', 'glaciares', 'bariloche', 'el calafate', 'ushuaia'],
    type: 'region',
    relatedTrips: ['bariloche', 'calafate', 'ushuaia'],
    content: {
      intro: 'La Patagonia Argentina es uno de los destinos más impresionantes del mundo. Desde los glaciares milenarios hasta los bosques andino-patagónicos, cada rincón ofrece una experiencia única.',
      features: ['Glaciares milenarios como el Perito Moreno', 'Lagos cristalinos rodeados de montañas', 'Bosques andino-patagónicos únicos', 'Gastronomía regional de primer nivel', 'Aventura y naturaleza en estado puro'],
      tips: ['La mejor época es de noviembre a marzo', 'Llevá ropa abrigada incluso en verano', 'Reservá con anticipación en temporada alta', 'Considerá al menos 7 días para recorrer'],
    },
    heroImage: '/bariloche-patagonia-argentina-panoramic-view-mount.jpg',
  },
  {
    slug: 'litoral',
    title: 'Viajes al Litoral Argentino',
    description: 'Conocé las Cataratas del Iguazú y la selva misionera con nuestros paquetes turísticos',
    metaDescription: 'Viajes al Litoral Argentino: Cataratas del Iguazú, selva misionera y naturaleza exuberante. Paquetes completos.',
    keywords: ['litoral argentino', 'cataratas iguazú', 'misiones', 'selva', 'turismo litoral'],
    type: 'region',
    relatedTrips: ['cataratas'],
    content: {
      intro: 'El Litoral Argentino te sorprenderá con su naturaleza exuberante y las imponentes Cataratas del Iguazú, una de las siete maravillas naturales del mundo.',
      features: ['Cataratas del Iguazú - Patrimonio de la Humanidad', 'Selva misionera con biodiversidad única', 'Circuitos náuticos en lancha', 'Cultura guaraní y artesanías locales', 'Gastronomía regional deliciosa'],
      tips: ['Visitá temprano para evitar multitudes', 'Llevá ropa cómoda e impermeable', 'No olvides repelente de mosquitos', 'Dedicá al menos 2 días completos'],
    },
    heroImage: '/iguazu-falls-panoramic-rainbow-mist-waterfall.jpg',
  },
  {
    slug: 'noroeste',
    title: 'Viajes al Noroeste Argentino',
    description: 'Descubrí Salta, Jujuy y los paisajes más coloridos de Argentina',
    metaDescription: 'Turismo en el Noroeste Argentino: Salta, Jujuy, Quebrada de Humahuaca, Cafayate. Cultura, paisajes y tradiciones.',
    keywords: ['noroeste argentino', 'salta', 'jujuy', 'quebrada humahuaca', 'cafayate', 'turismo noa'],
    type: 'region',
    relatedTrips: ['salta', 'jujuy'],
    content: {
      intro: 'El Noroeste Argentino combina paisajes de colores imposibles, cultura ancestral, vinos de altura y tradiciones que te transportarán en el tiempo.',
      features: ['Quebrada de Humahuaca - Patrimonio UNESCO', 'Cerro de los Siete Colores', 'Vinos de altura en Cafayate', 'Cultura andina viva', 'Arquitectura colonial en Salta'],
      tips: ['Aclimatate a la altura gradualmente', 'Protección solar es indispensable', 'Probá las empanadas salteñas', 'Visitá mercados artesanales locales'],
    },
    heroImage: '/salta-argentina-scenic-valley-mountains-colorful.jpg',
  },
  {
    slug: 'cuyo',
    title: 'Viajes a Cuyo: Mendoza y San Juan',
    description: 'Rutas del vino, alta montaña y el Aconcagua te esperan en Cuyo',
    metaDescription: 'Turismo en Cuyo: Mendoza, San Juan, rutas del vino, Aconcagua, alta montaña. Enoturismo y aventura.',
    keywords: ['cuyo', 'mendoza', 'san juan', 'ruta del vino', 'aconcagua', 'enoturismo'],
    type: 'region',
    relatedTrips: ['mendoza'],
    content: {
      intro: 'Cuyo es la región del vino argentino por excelencia. Entre viñedos de altura, montañas imponentes y el pico más alto de América, vivirás experiencias únicas.',
      features: ['Ruta del vino en Mendoza', 'Aconcagua - El techo de América', 'Degustaciones en bodegas premium', 'Valle de la Luna en San Juan', 'Termas naturales y aventura'],
      tips: ['La vendimia es en febrero-marzo', 'Reservá tours de bodegas con anticipación', 'El clima es seco, hidrátate bien', 'Ideal para combinar vino y montaña'],
    },
    heroImage: '/mendoza-argentina-andes-mountains-vineyard-land.jpg',
  },

  // ACTIVIDADES
  {
    slug: 'aventura',
    title: 'Viajes de Aventura en Argentina',
    description: 'Trekking, rafting, montañismo y deportes extremos en los mejores destinos',
    metaDescription: 'Turismo aventura en Argentina: trekking, rafting, escalada, deportes extremos. Experiencias adrenalínicas.',
    keywords: ['turismo aventura', 'trekking argentina', 'rafting', 'deportes extremos', 'montañismo'],
    type: 'activity',
    relatedTrips: ['bariloche', 'mendoza', 'ushuaia'],
    content: {
      intro: 'Si buscás adrenalina y desafíos, Argentina ofrece los mejores escenarios para deportes de aventura: desde trekking en glaciares hasta rafting en ríos de montaña.',
      features: ['Trekking en glaciares y montañas', 'Rafting en ríos cristalinos', 'Escalada en roca y hielo', 'Canopy y tirolesas', 'Kayak en lagos patagónicos'],
      tips: ['Contratá guías certificados', 'Verificá tu estado físico antes', 'El equipamiento está incluido', 'Seguro de viaje recomendado'],
    },
    heroImage: '/bariloche-patagonia-argentina-mountains-lake-sceni.jpg',
  },
  {
    slug: 'enoturismo',
    title: 'Enoturismo: Rutas del Vino en Argentina',
    description: 'Degustaciones, bodegas boutique y experiencias gastronómicas en los mejores viñedos',
    metaDescription: 'Enoturismo en Argentina: rutas del vino, degustaciones, bodegas de Mendoza y Salta. Experiencias premium.',
    keywords: ['enoturismo', 'ruta del vino', 'bodegas mendoza', 'degustaciones', 'wine tour'],
    type: 'activity',
    relatedTrips: ['mendoza', 'salta'],
    content: {
      intro: 'Descubrí los mejores vinos argentinos en sus lugares de origen. Degustaciones, recorridas por viñedos y maridajes excepcionales te esperan.',
      features: ['Degustaciones en bodegas premium', 'Tours por viñedos de altura', 'Maridajes gourmet', 'Catas dirigidas por sommeliers', 'Almuerzos entre viñas'],
      tips: ['Designá un conductor o usá transporte', 'Reservá con 15 días de anticipación', 'La época de vendimia es especial', 'Combiná con gastronomía local'],
    },
    heroImage: '/mendoza-argentina-andes-mountains-vineyard-land.jpg',
  },
  {
    slug: 'naturaleza',
    title: 'Viajes de Naturaleza y Ecoturismo',
    description: 'Observación de fauna, trekking ecológico y conexión con la naturaleza',
    metaDescription: 'Ecoturismo en Argentina: observación de fauna, parques nacionales, trekking ecológico. Turismo sustentable.',
    keywords: ['ecoturismo', 'observación fauna', 'parques nacionales', 'turismo sustentable', 'naturaleza'],
    type: 'activity',
    relatedTrips: ['cataratas', 'bariloche', 'ushuaia'],
    content: {
      intro: 'Conectá con la naturaleza en su estado más puro. Observá fauna silvestre, caminá por senderos milenarios y descubrí la biodiversidad argentina.',
      features: ['Observación de aves y fauna', 'Trekking en parques nacionales', 'Safaris fotográficos', 'Guías especializados en naturaleza', 'Turismo sustentable certificado'],
      tips: ['Llevá binoculares para avistajes', 'Respetá las normas de los parques', 'Madrugá para ver más fauna', 'Ropa en tonos neutros recomendada'],
    },
    heroImage: '/iguazu-falls-panoramic-rainbow-mist-waterfall.jpg',
  },
  {
    slug: 'gastronomia',
    title: 'Viajes Gastronómicos por Argentina',
    description: 'Sabores regionales, asados, vinos y experiencias culinarias únicas',
    metaDescription: 'Turismo gastronómico en Argentina: asados, vinos, comida regional, experiencias culinarias. Food tours.',
    keywords: ['turismo gastronómico', 'comida argentina', 'asado', 'gastronomía regional', 'food tour'],
    type: 'activity',
    relatedTrips: ['buenos-aires', 'mendoza', 'salta'],
    content: {
      intro: 'Argentina es un paraíso gastronómico. Desde el mejor asado del mundo hasta vinos de altura y sabores regionales únicos, cada comida es una experiencia.',
      features: ['Asados en parrillas de renombre', 'Degustaciones de vinos premium', 'Comida regional auténtica', 'Clases de cocina argentina', 'Mercados locales y ferias'],
      tips: ['Probá la carne de cordero patagónico', 'Las empanadas varían por región', 'El vino Malbec es el emblemático', 'Dejá espacio para los dulces regionales'],
    },
    heroImage: '/mendoza-argentina-andes-mountains-vineyard-land.jpg',
  },

  // TEMPORADAS
  {
    slug: 'verano',
    title: 'Viajes de Verano en Argentina',
    description: 'Playas, lagos, montañas y sol: los mejores destinos para el verano',
    metaDescription: 'Destinos de verano en Argentina: playas, lagos patagónicos, montañas. Vacaciones de verano 2026.',
    keywords: ['verano argentina', 'vacaciones verano', 'playas argentina', 'lagos patagonia', 'turismo verano'],
    type: 'season',
    relatedTrips: ['bariloche', 'cataratas', 'mendoza'],
    content: {
      intro: 'El verano argentino ofrece destinos para todos los gustos: playas cálidas, lagos cristalinos, montañas verdes y ciudades vibrantes.',
      features: ['Lagos patagónicos en su esplendor', 'Trekking con buen clima', 'Actividades acuáticas', 'Festivales y eventos culturales', 'Días largos para más actividades'],
      tips: ['Reservá con meses de anticipación', 'Los precios son más altos en temporada', 'Protección solar indispensable', 'Mejor época: diciembre a febrero'],
    },
    heroImage: '/bariloche-patagonia-argentina-panoramic-view-mount.jpg',
  },
  {
    slug: 'invierno',
    title: 'Viajes de Invierno: Esquí y Nieve',
    description: 'Centros de esquí, nieve y paisajes blancos en los mejores destinos',
    metaDescription: 'Turismo de invierno en Argentina: esquí, snowboard, centros de nieve. Vacaciones de invierno 2026.',
    keywords: ['invierno argentina', 'esquí argentina', 'centros de esquí', 'nieve', 'turismo invierno'],
    type: 'season',
    relatedTrips: ['bariloche', 'ushuaia', 'mendoza'],
    content: {
      intro: 'El invierno argentino es sinónimo de nieve, esquí y paisajes de postal. Los Andes se visten de blanco ofreciendo los mejores centros de esquí de Sudamérica.',
      features: ['Centros de esquí de nivel mundial', 'Snowboard y deportes de nieve', 'Après-ski y gastronomía cálida', 'Paisajes nevados únicos', 'Clases de esquí para todos los niveles'],
      tips: ['Mejor época: junio a agosto', 'Alquilá equipamiento en el lugar', 'Reservá alojamiento temprano', 'Precios especiales en pre-temporada'],
    },
    heroImage: '/bariloche-patagonia-argentina-mountains-lake-sceni.jpg',
  },
  {
    slug: 'primavera',
    title: 'Viajes de Primavera en Argentina',
    description: 'Flores, clima ideal y destinos en su mejor momento',
    metaDescription: 'Turismo de primavera en Argentina: flores, clima ideal, trekking. Mejores destinos primavera 2026.',
    keywords: ['primavera argentina', 'turismo primavera', 'flores', 'clima ideal', 'trekking primavera'],
    type: 'season',
    relatedTrips: ['salta', 'mendoza', 'cataratas'],
    content: {
      intro: 'La primavera es la estación ideal para viajar: clima templado, naturaleza florecida, menos turistas y precios accesibles.',
      features: ['Clima templado perfecto para trekking', 'Naturaleza en flor', 'Menos aglomeración turística', 'Precios más accesibles', 'Festivales de primavera'],
      tips: ['Época ideal: septiembre a noviembre', 'Llevá ropa por capas', 'Excelente relación precio-calidad', 'Perfecto para fotografía de naturaleza'],
    },
    heroImage: '/salta-argentina-scenic-valley-mountains-colorful.jpg',
  },
  {
    slug: 'otono',
    title: 'Viajes de Otoño: Colores Únicos',
    description: 'Bosques dorados, clima agradable y paisajes de postal en otoño',
    metaDescription: 'Turismo de otoño en Argentina: bosques dorados, colores únicos, clima agradable. Mejores destinos otoño 2026.',
    keywords: ['otoño argentina', 'turismo otoño', 'bosques otoñales', 'colores otoño', 'viajes otoño'],
    type: 'season',
    relatedTrips: ['bariloche', 'mendoza', 'ushuaia'],
    content: {
      intro: 'El otoño pinta Argentina de colores únicos. Los bosques patagónicos se tiñen de dorado, amarillo y rojo creando paisajes inolvidables.',
      features: ['Bosques con colores otoñales', 'Clima fresco ideal para caminatas', 'Época de cosecha y vendimia', 'Fotografía de paisajes únicos', 'Temporada baja con mejores precios'],
      tips: ['Mejor época: marzo a mayo', 'Llevá abrigo ligero', 'Ideal para fotografía', 'Temporada de vendimia en Mendoza'],
    },
    heroImage: '/bariloche-patagonia-argentina-panoramic-view-mount.jpg',
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
