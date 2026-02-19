export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  readingTime: number;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'mejores-epocas-paris',
    title: 'Las mejores épocas para visitar París',
    excerpt: 'Descubrí cuándo viajar para disfrutar de la ciudad del amor: primavera en flor, verano animado o invierno con mercados navideños.',
    coverImage: '/og-image.jpg',
    category: 'destinos',
    author: {
      name: 'María González',
    },
    publishedAt: '2026-01-14',
    readingTime: 5,
    featured: true,
    content: `París es uno de esos destinos que podés visitar en cualquier momento del año y siempre te va a sorprender. Sin embargo, cada estación ofrece una experiencia completamente diferente. En esta guía te contamos qué esperar en cada época para que planifiques tu viaje ideal.

## Primavera (marzo a junio): La época más romántica

La primavera es la temporada favorita de muchos viajeros. Los jardines florecen, las temperaturas son agradables (10-20°C) y los días se alargan. Los parques como Luxemburgo y las Tullerías están en su esplendor.

**Qué hacer en primavera:**
- Pasear por los jardines y orillas del Sena
- Visitar la Torre Eiffel con buen clima
- Mercados al aire libre y terrazas
- Menos colas que en verano

**Tip:** Reservá con anticipación para Semana Santa y puentes. Los precios suben en fechas clave.

## Verano (junio a agosto): Días largos y ambiente festivo

El verano en París regala hasta 16 horas de luz. Es temporada alta: más turistas pero también más vida en la calle, festivales y eventos. Las temperaturas rondan los 25-30°C.

**Qué hacer en verano:**
- Noches blancas y paseos al atardecer
- Picnics en el Sena o en el Champ de Mars
- Museos con aire acondicionado
- Día en Versalles

## Otoño (septiembre a noviembre): Colores y cultura

El otoño pinta París de tonos dorados. Es temporada media: buen clima, menos aglomeraciones y precios más accesibles. Ideal para museos y gastronomía.

**Qué hacer en otoño:**
- Recorrer barrios como Montmartre o Le Marais
- Degustar castañas y vino nuevo
- Fotografía en los parques con follaje
- Compras y moda

## Invierno (diciembre a febrero): Mercados navideños

El invierno trae mercados navideños, luces y ambiente mágico. Hace frío (0-10°C) pero las decoraciones y el chocolate caliente compensan. Diciembre es especialmente especial.

**Qué hacer en invierno:**
- Mercados de Navidad en los Campos Elíseos y La Défense
- Patinar en pistas temporales
- Museos y planes de interior
- Hot chocolate en cafés históricos

## Nuestra recomendación

Para tu primera vez en París, **abril-mayo o septiembre-octubre** ofrecen el mejor equilibrio: buen clima, menos turistas y precios razonables. Si buscás ambiente festivo, **diciembre** es mágico.

¿Listo para planificar tu viaje a París? En Headway Trips diseñamos itinerarios personalizados para que aproveches al máximo tu estadía, sin importar la época del año.`,
  },
  {
    slug: 'guia-roma',
    title: 'Guía completa para recorrer Roma',
    excerpt: 'Tips esenciales para tu visita a la ciudad eterna. Qué ver, mejores rutas y secretos locales.',
    coverImage: '/og-image.jpg',
    category: 'destinos',
    author: {
      name: 'Carlos Rodríguez',
    },
    publishedAt: '2026-01-10',
    readingTime: 8,
    content: `Roma es, sin exageración, una de las ciudades más impresionantes del planeta. Con más de 3000 años de historia, la capital italiana concentra arte, cultura y gastronomía en cada rincón. Esta guía te ayuda a organizar tu visita.

## Antes de ir: Lo que tenés que saber

**Mejor época para visitar:** Primavera (abril-junio) y otoño (septiembre-octubre): clima agradable y menos aglomeraciones. Verano es muy caluroso; invierno es suave y con menos turistas.

**Cuántos días necesitás:** Mínimo 3 días para lo imprescindible. 4-5 días si querés museos y barrios con calma.

**Qué llevar:**
- Calzado cómodo (se camina mucho)
- Protector solar en verano
- Botella de agua reutilizable
- Reservas online para Coliseo y Vaticano

## Lo imprescindible

### Coliseo y Foro Romano
El símbolo de Roma. Reservá entrada con anticipación y considerá visita guiada para entender la historia. Cerca, el Foro Romano y el Palatino completan la experiencia.

### Vaticano: Museos y Capilla Sixtina
Los Museos Vaticanos requieren medio día. La Capilla Sixtina cierra la visita. Reservá con hora para evitar colas largas.

### Fontana di Trevi y barrios
La Fontana di Trevi, el Panteón y Trastevere son paradas obligadas. Recorré a pie y perdete por las callejuelas.

## Tips prácticos

1. **Reservá Coliseo y Vaticano online** con varios días de anticipación.
2. **Comé donde comen los romanos:** evita restaurantes frente a monumentos.
3. **Transporte:** el metro llega a lo esencial; el centro se recorre mejor a pie.
4. **Agua:** las fuentes públicas (nasoni) tienen agua potable; llevá botella reutilizable.

Roma es de esas ciudades que superan cualquier expectativa. Cada rincón tiene historia y la gastronomía es parte esencial del viaje.`,
  },
  {
    slug: 'que-llevar-europa',
    title: '¿Qué llevar a un viaje por Europa? Lista de equipaje',
    excerpt: 'Desde ropa por capas hasta documentación, todo lo que necesitás para viajar por Europa según la temporada.',
    coverImage: '/og-image.jpg',
    category: 'tips',
    author: {
      name: 'Laura Martínez',
    },
    publishedAt: '2026-01-05',
    readingTime: 4,
    content: `Viajar por Europa implica distintos climas según el destino y la época. Armar la valija correcta te permite moverte cómodo y disfrutar sin preocupaciones. Acá va una guía práctica por temporada.

## Regla de oro: Ropa por capas

En la mayoría de destinos europeos el tiempo puede cambiar en el día. Llevar capas (base, abrigo medio, cortaviento o impermeable) te da flexibilidad.

**Básico todo el año:**
- Calzado cómodo para caminar (imprescindible)
- Cortaviento o impermeable liviano
- Una capa de abrigo (sweater o polar)
- Botella de agua reutilizable
- Adaptador de enchufes (tipo C en la mayoría de Europa)

## Verano (junio a agosto)

Días largos y calor en el sur; más suave en el norte. Sol fuerte en el Mediterráneo.

**Llevá:**
- Protector solar y gorro
- Ropa ligera y una prenda de abrigo para noches o interiores con aire acondicionado
- Traje de baño si vas a costa o piscinas

## Invierno (diciembre a febrero)

Frío en el norte y en zonas de montaña; suave en el Mediterráneo. Abrigo, gorro y guantes en ciudades como París, Amsterdam o Praga.

**Llevá:**
- Abrigo que abrigue de verdad
- Calzado cerrado y cómodo para lluvia o nieve
- Capas para interiores con calefacción

## Documentación y prácticos

- **Documento o pasaporte** en regla y con validez
- **Seguro de viaje** que cubra salud y cancelación
- **Tarjeta bancaria** sin comisión internacional (aviso a tu banco)
- **Reservas y tickets** en el móvil o impresos
- **Copia digital** de documentos en la nube

Con una valija bien pensada, te enfocás en disfrutar. Europa tiene de todo; con capas y buen calzado estás listo para la mayoría de los planes.`,
  },
  {
    slug: 'ruta-del-vino-europa',
    title: 'Rutas del vino en Europa: Francia, Italia y España',
    excerpt: 'Un recorrido por regiones vinícolas emblemáticas: Borgoña, Toscana y La Rioja.',
    coverImage: '/og-image.jpg',
    category: 'gastronomia',
    author: {
      name: 'Diego Fernández',
    },
    publishedAt: '2025-12-28',
    readingTime: 6,
    content: `Europa es la cuna del vino y recorrer sus regiones vinícolas combina paisaje, historia y gastronomía. Te resumimos tres rutas clásicas: Francia, Italia y España.

## Francia: Borgoña y Burdeos

Borgoña es sinónimo de Pinot Noir y Chardonnay; Burdeos de blends de renombre mundial. Pueblos medievales, castillos y degustaciones en bodegas centenarias.

**Tips:** Reservá visitas con antelación. Muchas bodegas exigen cita. La primavera y el otoño son ideales.

## Italia: Toscana y Piamonte

La Toscana ofrece Chianti, Brunello y paisajes de viñas y cipreses. En Piamonte, Barolo y Barbaresco con gastronomía de primer nivel.

**Tips:** Combiná bodegas con pueblos como San Gimignano o Montepulciano. Almorzar en una bodega es una experiencia que vale la pena.

## España: La Rioja y Priorat

La Rioja concentra tradición y bodegas modernas; Priorat ofrece vinos potentes y paisajes de viñas en terrazas. Ambos se visitan fácil desde Barcelona o Bilbao.

**Tips:** Reservá con tiempo en temporada alta. Llevá calzado cómodo para recorrer viñedos.

## Consejos generales

1. **No manejes si vas a degustar.** Contratá tour o conductor.
2. **Máximo 2-3 bodegas por día** para disfrutar cada visita.
3. **Primavera y otoño** suelen ser las mejores épocas.
4. **Almorzar en bodega** suele ser un punto fuerte del día.

Las rutas del vino en Europa son una de esas experiencias que recordás para siempre.`,
  },
  {
    slug: 'senderismo-europa',
    title: 'Los 5 mejores senderos para hacer trekking en Europa',
    excerpt: 'Desde rutas de un día hasta travesías de varios días: senderismo en los Alpes, Pirineos y costa europea.',
    coverImage: '/og-image.jpg',
    category: 'aventura',
    author: {
      name: 'Pablo López',
    },
    publishedAt: '2025-12-20',
    readingTime: 7,
    content: `Europa ofrece algunos de los senderos más espectaculares y mejor señalizados del mundo. Desde los Alpes hasta la costa atlántica, hay rutas para todos los niveles. Acá van cinco experiencias que no te podés perder.

## 1. Tour du Mont Blanc (Francia, Italia, Suiza)

**Duración:** 10-11 días | **Dificultad:** Media-alta

La ruta circular más famosa de los Alpes rodea el Mont Blanc. Refugios, paisajes de alta montaña y tres países en un solo trekking. Se puede hacer por tramos si no tenés tantos días.

**Tip:** Reservá refugios con meses de anticipación en temporada (junio-septiembre).

## 2. Camino de Santiago (España)

**Duración:** Desde 5-7 días (tramo corto) hasta 30+ (Camino Francés completo) | **Dificultad:** Baja-media

Ruta histórica y espiritual con múltiples variantes. El Camino Francés es el más popular. Albergues, flechas amarillas y ambiente de peregrinación y comunidad.

**Tip:** Empezá por un tramo corto (ej. Sarria-Santiago) si es tu primera vez.

## 3. Cinque Terre (Italia)

**Duración:** 1-2 días | **Dificultad:** Baja-media

Senderos que unen los cinco pueblos de la costa de Liguria. Mar, viñedos y pueblos de colores. Algunos tramos son exigentes; otros son paseos familiares.

**Tip:** Llevá la Cinque Terre Card si querés usar los senderos oficiales.

## 4. Gr20 (Córcega, Francia)

**Duración:** 15-16 días | **Dificultad:** Alta

Uno de los trekkings más exigentes de Europa. Cruzar Córcega de norte a sur por la montaña. Refugios básicos y paisajes salvajes.

**Tip:** Solo para quienes tienen experiencia y buena condición física.

## 5. Costa Norte de Mallorca (España)

**Duración:** 1-3 días | **Dificultad:** Media

Tramo de la Ruta de Pedra en Sec: acantilados, calas y vistas al mar. Bien señalizado y con opción de dormir en refugios.

**Tip:** Evitá el verano por el calor; primavera y otoño son ideales.

## Consejos generales

- **Reservá alojamiento** con tiempo en rutas populares.
- **Llevá capas y equipo de lluvia;** el tiempo en montaña cambia rápido.
- **Informate del estado de los senderos** antes de salir.
- **Respeta las normas** de cada parque o reserva.

El senderismo en Europa combina naturaleza, cultura e infraestructura de primer nivel. Cualquiera de estas rutas te deja recuerdos para toda la vida.`,
  },
  {
    slug: 'tradiciones-festividades-europa',
    title: 'Tradiciones y festividades en Europa',
    excerpt: 'Mercados navideños, ferias y celebraciones que hacen único viajar por Europa en cada época del año.',
    coverImage: '/og-image.jpg',
    category: 'cultura',
    author: {
      name: 'Sofía Ruiz',
    },
    publishedAt: '2025-12-15',
    readingTime: 5,
    content: `Europa vive sus tradiciones en la calle: mercados, ferias, fiestas locales y celebraciones que convierten cada viaje en una experiencia única. Acá van algunas de las más emblemáticas.

## Mercados navideños (noviembre-diciembre)

Desde finales de noviembre, ciudades como Nuremberg, Estrasburgo, Praga, Viena y Barcelona montan mercados de Navidad. Luces, artesanías, comida caliente y ambiente festivo. Cada país tiene su estilo: más familiar en Alemania, más gourmet en Francia.

**Destinos clásicos:** Nuremberg (Christkindlesmarkt), Estrasburgo, Praga, Colonia.

## Fiestas y ferias por país

**España:** Fallas en Valencia (marzo), San Fermín en Pamplona (julio), Feria de Abril en Sevilla (abril). Cada región tiene sus propias fiestas.

**Italia:** Carnevale de Venecia (febrero), Palio de Siena (julio y agosto). La vendimia en otoño en Toscana y Piamonte.

**Francia:** Fiesta de la Música (21 de junio), 14 de julio en París, vendimia en Borgoña y Champagne.

## Gastronomía y mercados

Los mercados locales son el corazón de la vida europea. Desde el Mercado de La Boquería en Barcelona hasta Borough Market en Londres o Mercado Central de Valencia: probar productos locales es parte esencial del viaje.

## Viajar con respeto

- Respetá horarios y normas de cada lugar.
- En celebraciones religiosas o tradicionales, vestite y comportate de forma adecuada.
- Apoyá el comercio local comprando en mercados y tiendas de barrio.

Europa en cada estación ofrece algo distinto: planificar según festividades y tradiciones hace que cada viaje sea memorable.`,
  },
];

// Compute category counts dynamically from actual posts
export const blogCategories = (() => {
  const categoryMap: Record<string, { name: string; count: number }> = {
    destinos: { name: 'Destinos', count: 0 },
    tips: { name: 'Tips de Viaje', count: 0 },
    cultura: { name: 'Cultura', count: 0 },
    aventura: { name: 'Aventura', count: 0 },
    gastronomia: { name: 'Gastronomía', count: 0 },
  };

  for (const post of blogPosts) {
    if (categoryMap[post.category]) {
      categoryMap[post.category].count++;
    }
  }

  return Object.entries(categoryMap).map(([id, { name, count }]) => ({
    id,
    name,
    count,
  }));
})();

export function getFeaturedPost(): BlogPost | undefined {
  return blogPosts.find((post) => post.featured);
}

export function getRecentPosts(count: number = 5): BlogPost[] {
  return blogPosts.slice(0, count);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

export function getCategoryName(id: string): string {
  return blogCategories.find((cat) => cat.id === id)?.name || id;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
