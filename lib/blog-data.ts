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
    slug: 'mejores-epocas-bariloche',
    title: 'Las mejores épocas para visitar Bariloche',
    excerpt: 'Descubrí cuándo viajar para disfrutar de la nieve, los lagos cristalinos o el otoño dorado en la Patagonia argentina.',
    coverImage: '/bariloche-patagonia-argentina-mountains-lake.jpg',
    category: 'destinos',
    author: {
      name: 'María González',
    },
    publishedAt: '2026-01-14',
    readingTime: 5,
    featured: true,
    content: `San Carlos de Bariloche es uno de esos destinos que podés visitar en cualquier momento del año y siempre te va a sorprender. Sin embargo, cada estación ofrece una experiencia completamente diferente. En esta guía te contamos qué esperar en cada época para que planifiques tu viaje ideal.

## Invierno (junio a septiembre): El paraíso de la nieve

El invierno es la temporada estrella de Bariloche. El Cerro Catedral se convierte en el centro de esquí más grande de Sudamérica, con más de 120 km de pistas para todos los niveles. Las temperaturas oscilan entre -5°C y 8°C, y las nevadas transforman el paisaje en una postal de cuento.

**Qué hacer en invierno:**
- Esquí y snowboard en Cerro Catedral
- Paseos en trineo con huskies
- Chocolate caliente en las chocolaterías del centro
- Noche de fondue con vista a la nieve

**Tip:** Reservá alojamiento con anticipación, especialmente durante las vacaciones de julio. Los precios suben considerablemente en temporada alta.

## Primavera (octubre a noviembre): Flores y aventura

La primavera trae consigo el deshielo y los días empiezan a alargarse. Los lupinos florecen a orillas de los lagos, creando paisajes de colores increíbles. Es una época ideal para trekking y actividades al aire libre sin las multitudes del verano.

**Qué hacer en primavera:**
- Trekking al Refugio Frey
- Paseos en bicicleta por el Circuito Chico
- Navegación por el lago Nahuel Huapi
- Visita al bosque de arrayanes

## Verano (diciembre a febrero): Lagos y sol

El verano barilochense es perfecto para disfrutar de los lagos. Las temperaturas llegan a los 25-30°C y los días son largos, con hasta 16 horas de luz. Es la temporada ideal para actividades acuáticas y trekkings de alta montaña.

**Qué hacer en verano:**
- Kayak y stand-up paddle en el lago
- Trekking de varios días por la Travesía de los Refugios
- Playas de lago como Bahía Serena
- Circuito de los Siete Lagos

## Otoño (marzo a mayo): El secreto mejor guardado

El otoño es quizás la época más fotogénica de Bariloche. Los bosques de lengas y ñires se tiñen de rojo, naranja y amarillo, creando un espectáculo visual único. Es temporada baja, lo que significa menos turistas y mejores precios.

**Qué hacer en otoño:**
- Fotografía de paisajes con follaje de otoño
- Caminatas por senderos sin multitudes
- Degustación de cervezas artesanales
- Visita a la Isla Victoria

## Nuestra recomendación

Si es tu primera vez en Bariloche y buscás una experiencia completa, te recomendamos **marzo o abril**. Vas a encontrar buen clima, paisajes espectaculares, precios accesibles y la tranquilidad de la temporada baja. Si lo tuyo es la nieve, **julio y agosto** son imbatibles.

¿Listo para planificar tu viaje a Bariloche? En Headway Trips diseñamos itinerarios personalizados para que aproveches al máximo tu estadía, sin importar la época del año.`,
  },
  {
    slug: 'guia-cataratas',
    title: 'Guía completa para recorrer las Cataratas del Iguazú',
    excerpt: 'Tips esenciales para tu visita a una de las maravillas naturales del mundo. Qué llevar, mejores circuitos y secretos locales.',
    coverImage: '/iguazu-falls-panoramic-rainbow-mist-waterfall.jpg',
    category: 'destinos',
    author: {
      name: 'Carlos Rodríguez',
    },
    publishedAt: '2026-01-10',
    readingTime: 8,
    content: `Las Cataratas del Iguazú son, sin exageración, uno de los espectáculos naturales más impresionantes del planeta. Con 275 saltos de agua que se extienden a lo largo de casi 3 kilómetros, esta maravilla natural compartida entre Argentina y Brasil deja sin palabras a todo el que la visita.

## Antes de ir: Lo que tenés que saber

**Mejor época para visitar:** De marzo a junio, cuando el caudal es alto y las temperaturas son agradables (20-28°C). Evitá diciembre y enero si podés, ya que el calor supera los 40°C.

**Cuántos días necesitás:** Mínimo 2 días completos. Uno para el lado argentino y otro para el brasileño. Si querés agregar aventura, sumá un tercer día.

**Qué llevar:**
- Protector solar (se quema incluso nublado)
- Repelente de insectos
- Ropa que se pueda mojar (¡vas a mojarte!)
- Calzado cómodo con buena suela
- Capa de lluvia liviana
- Cámara con protección para el agua

## Lado argentino: La experiencia inmersiva

El Parque Nacional Iguazú del lado argentino ofrece la experiencia más cercana a las cataratas. Vas a caminar literalmente sobre ellas.

### Circuito Superior
Un recorrido fácil de 1.7 km por pasarelas sobre las cataratas. Desde acá tenés las mejores vistas panorámicas y fotos increíbles.

### Circuito Inferior
Bajás hasta la base de los saltos. Es más exigente físicamente (escaleras) pero las vistas son espectaculares. Sentís la fuerza del agua en la cara.

### Garganta del Diablo
El plato fuerte. Un tren te lleva hasta el inicio de la pasarela de 1.1 km que termina justo en el borde de la Garganta del Diablo, el salto más grande e impactante. La cantidad de agua y el rugido son impresionantes.

**Tip:** Llegá temprano (el parque abre a las 8:00) y hacé primero la Garganta del Diablo. Después del mediodía la cola para el tren puede ser de más de una hora.

### Isla San Martín
Si el caudal lo permite, podés cruzar en bote a esta isla que te da una perspectiva única de los saltos. Es gratuito y vale mucho la pena.

## Lado brasileño: La postal panorámica

El lado brasileño ofrece la vista panorámica completa. Un sendero de 1.2 km te lleva a una pasarela que se adentra en el cañón, con la Garganta del Diablo de frente. Es el lugar para THE foto.

## Aventuras extra

- **Gran Aventura:** Lancha que te mete debajo de las cataratas. Emocionante y refrescante.
- **Sendero Macuco:** Caminata por la selva hasta un salto escondido. Ideal para los que buscan naturaleza sin multitudes.
- **Luna llena:** Paseos nocturnos durante la luna llena. Experiencia única y mágica.

## Tips prácticos

1. **Comprá las entradas online** para evitar colas en la entrada
2. **Llevá pesos argentinos o reales** según el lado que visites
3. **Cuidado con los coatíes** - no les des comida, son simpáticos pero pueden ser agresivos
4. **El parque es enorme** - usá zapatillas cómodas, vas a caminar entre 10 y 15 km

Las Cataratas del Iguazú son de esos lugares que superan cualquier expectativa. No importa cuántas fotos hayas visto antes: cuando estás ahí, frente a esa fuerza de la naturaleza, la emoción es indescriptible.`,
  },
  {
    slug: 'que-llevar-ushuaia',
    title: '¿Qué llevar a Ushuaia? Lista completa de equipaje',
    excerpt: 'Desde ropa térmica hasta protección solar, todo lo que necesitás para el fin del mundo según la temporada.',
    coverImage: '/ushuaia-beagle-channel-panoramic-mountains-snow.jpg',
    category: 'tips',
    author: {
      name: 'Laura Martínez',
    },
    publishedAt: '2026-01-05',
    readingTime: 4,
    content: `Ushuaia, la ciudad más austral del mundo, tiene un clima impredecible que puede cambiar varias veces en un mismo día. Armar la valija correcta es fundamental para disfrutar del viaje sin pasarla mal. Acá te dejamos la guía definitiva según la temporada.

## Regla de oro: Vestirse en capas

Sin importar la época del año, en Ushuaia el sistema de capas es tu mejor amigo. El clima cambia rápido: podés empezar el día con sol y terminar con nieve.

**Las 3 capas básicas:**
1. **Capa base (primera piel):** Remera térmica de material sintético o lana merino. Evitá el algodón, que absorbe la humedad.
2. **Capa intermedia (abrigo):** Polar o softshell que mantenga el calor.
3. **Capa exterior (protección):** Campera impermeable y cortaviento. Esta es la más importante.

## Ropa esencial (todo el año)

- Campera impermeable y cortaviento (IMPRESCINDIBLE)
- Polar o fleece grueso
- Remeras térmicas (2-3)
- Pantalón de trekking impermeable
- Buff o cuello polar
- Gorro que cubra las orejas
- Guantes impermeables
- Medias térmicas de lana merino (3-4 pares)
- Calzado de trekking impermeable con buena suela

## Verano (diciembre a febrero)

En verano las temperaturas van de 5°C a 15°C, con días de hasta 17 horas de luz. El viento es constante.

**Agregá:**
- Remera manga corta (para los días más cálidos)
- Lentes de sol (el sol puede ser intenso)
- Protector solar SPF 50+ (la capa de ozono es más fina)
- Pantalón largo liviano

## Invierno (junio a septiembre)

Las temperaturas bajan a -5°C o menos, con nevadas frecuentes. Los días tienen solo 7-8 horas de luz.

**Agregá:**
- Campera de plumas o abrigo grueso
- Calzas térmicas debajo del pantalón
- Botas de nieve impermeables
- Guantes dobles (liner + guante exterior)
- Balaclava o pasamontañas
- Calentadores químicos para manos

## Accesorios que no podés olvidar

- **Mochila pequeña (20-30L):** Para las excursiones del día
- **Botella térmica:** El agua caliente vale oro en el frío
- **Cámara con baterías extra:** El frío agota las baterías rápido
- **Binoculares:** Para avistaje de fauna (pingüinos, lobos marinos, cóndores)
- **Bolsas herméticas:** Para proteger electrónicos de la lluvia y la nieve

## Errores comunes

1. **Llevar solo zapatillas urbanas.** Necesitás calzado de trekking impermeable, incluso para pasear por la ciudad.
2. **No llevar protector solar en invierno.** El reflejo de la nieve puede quemarte igual.
3. **Llevar demasiada ropa de algodón.** El algodón mojado no abriga nada. Priorizá sintéticos y lana merino.
4. **Olvidar la campera impermeable.** Aunque no llueva, el viento con humedad te cala los huesos.

## Lo que NO necesitás llevar

- Ropa elegante (Ushuaia es casual)
- Paraguas (el viento lo rompe, mejor capucha)
- Demasiada ropa de verano

Con el equipaje correcto, Ushuaia se disfruta al máximo. El frío no es un problema cuando estás bien preparado, y la recompensa de paisajes únicos en el mundo hace que cada capa de ropa valga la pena.`,
  },
  {
    slug: 'ruta-del-vino-mendoza',
    title: 'Ruta del Vino en Mendoza: Las 10 bodegas imperdibles',
    excerpt: 'Un recorrido por las mejores bodegas de Mendoza, desde Luján de Cuyo hasta el Valle de Uco.',
    coverImage: '/mendoza-vineyards-sunset-andes-mountains-panoramic.jpg',
    category: 'gastronomia',
    author: {
      name: 'Diego Fernández',
    },
    publishedAt: '2025-12-28',
    readingTime: 6,
    content: `Mendoza es sinónimo de vino, y recorrer sus bodegas es una experiencia que combina paisajes espectaculares, gastronomía de primer nivel y, por supuesto, algunos de los mejores Malbec del mundo. Te armamos esta guía con las 10 bodegas que no podés perderte.

## Zona Luján de Cuyo: La cuna del Malbec

### 1. Bodega Catena Zapata
El templo del vino argentino. Su edificio inspirado en las pirámides mayas es icónico. Ofrecen degustaciones premium y recorridos por los viñedos con vista a los Andes.

**Imperdible:** La degustación de la línea Adrianna Vineyard.

### 2. Bodega Achaval-Ferrer
Especialistas en Malbec de finca única. Una experiencia más íntima y boutique, ideal para entendedores.

**Imperdible:** Comparar los Malbec de distintos terroirs.

### 3. Bodega Luigi Bosca
Una de las bodegas más antiguas de Mendoza (1901). Tradición familiar que se siente en cada copa.

**Imperdible:** El almuerzo maridaje en su restaurante.

## Zona Maipú: Tradición y accesibilidad

### 4. Familia Zuccardi (Maipú)
Además de excelentes vinos, tienen un restaurante galardonado y experiencias de cosecha en temporada.

**Imperdible:** El tour en bicicleta entre viñedos.

### 5. Bodega Trapiche
Una de las más grandes y visitadas. Perfecta para quienes se inician en el mundo del vino.

**Imperdible:** La experiencia de blend, donde armás tu propio vino.

## Valle de Uco: La nueva joya

### 6. Bodega Salentein
Un complejo que incluye bodega, restaurante, posada y hasta una galería de arte. Arquitectura moderna impresionante.

**Imperdible:** La vista desde el restaurante al atardecer.

### 7. Bodega Andeluna
Vinos de altura (1.300 metros) con vista directa a la Cordillera de los Andes.

**Imperdible:** La degustación al aire libre con vista panorámica.

### 8. SuperUco
Un proyecto joven y disruptivo. Vinos naturales y orgánicos con un enfoque moderno.

**Imperdible:** La honestidad y pasión de sus creadores.

## Bodegas boutique imperdibles

### 9. Kaiken
Bodegas boutique del grupo Montes, con paisajes increíbles y vinos de alta gama.

**Imperdible:** El Malbec Ultra, emblema de la casa.

### 10. Piedra Negra
Vinos orgánicos en el corazón del Valle de Uco. Experiencia auténtica y cercana.

**Imperdible:** Caminar entre los viñedos orgánicos.

## Tips prácticos para la Ruta del Vino

1. **Contratá un remis o tour.** No manejes si vas a degustar.
2. **Reservá con anticipación.** Las bodegas más populares se llenan rápido, especialmente fines de semana.
3. **Visitá máximo 3 bodegas por día.** Más que eso y no disfrutás ninguna.
4. **Llevá protector solar y sombrero.** Los viñedos no tienen sombra.
5. **La mejor época es de marzo a mayo** (vendimia), pero se puede visitar todo el año.
6. **Almorzá en alguna bodega.** Las experiencias gastronómicas son espectaculares.

Mendoza es mucho más que vino: es paisaje, cultura, gastronomía y hospitalidad. La Ruta del Vino es una de esas experiencias que recordás toda la vida.`,
  },
  {
    slug: 'trekking-el-chalten',
    title: 'Los 5 mejores trekkings en El Chaltén',
    excerpt: 'Desde caminatas de medio día hasta expediciones de varios días, los senderos más espectaculares de la capital del trekking.',
    coverImage: '/el-calafate-perito-moreno-glacier-argentina.jpg',
    category: 'aventura',
    author: {
      name: 'Pablo López',
    },
    publishedAt: '2025-12-20',
    readingTime: 7,
    content: `El Chaltén es la capital nacional del trekking, y con razón. Este pequeño pueblo en el corazón del Parque Nacional Los Glaciares ofrece algunos de los senderos más espectaculares de la Patagonia. Lo mejor: todos son gratuitos y con señalización excelente.

## Antes de arrancar

**Época recomendada:** De octubre a abril. Los meses de diciembre a marzo son los más estables, aunque el viento patagónico es constante.

**Nivel de dificultad:** Los senderos principales son accesibles para cualquier persona con condición física moderada. No requieren experiencia técnica.

**Imprescindible:**
- Calzado de trekking impermeable
- Capas de ropa (el clima cambia en minutos)
- Agua y snacks energéticos
- Protector solar y gorro
- Bastones de trekking (opcionales pero recomendados)

## 1. Laguna de los Tres (la estrella)

**Distancia:** 25 km ida y vuelta | **Duración:** 8-10 horas | **Dificultad:** Media-alta

El trekking más famoso de El Chaltén te lleva hasta la base del icónico Fitz Roy. El sendero es mayormente suave durante los primeros 9 km, pero el último tramo es una subida empinada de 400 metros de desnivel por un terreno rocoso.

**La recompensa:** La Laguna de los Tres, con sus aguas turquesas rodeada de picos nevados y el Fitz Roy imponente de fondo. Es uno de los paisajes más fotografiados de la Patagonia.

**Tip:** Salí al amanecer para llegar a la laguna con la primera luz. Los colores son mágicos y hay menos gente.

## 2. Laguna Torre

**Distancia:** 18 km ida y vuelta | **Duración:** 6-7 horas | **Dificultad:** Media

Un sendero más accesible que te lleva a la base del Cerro Torre, otra joya de la Patagonia. El camino transcurre por bosques de lengas y a lo largo del río Fitz Roy.

**La recompensa:** La Laguna Torre con témpanos flotando y el Cerro Torre al fondo, envuelto en nubes como es habitual.

**Tip:** Combiná este trekking con una parada en el mirador del Cerro Torre, a mitad de camino.

## 3. Loma del Pliegue Tumbado

**Distancia:** 18 km ida y vuelta | **Duración:** 7-8 horas | **Dificultad:** Media-alta

El secreto mejor guardado de El Chaltén. Este trekking ofrece la vista panorámica más completa: desde la cima podés ver el Fitz Roy, el Cerro Torre, el lago Viedma y el Campo de Hielo Patagónico Sur.

**La recompensa:** Una vista de 360° que abarca toda la cadena montañosa. Impresionante.

**Tip:** Elegí un día despejado para este trekking. Si está nublado, el esfuerzo no se recompensa con la vista.

## 4. Chorrillo del Salto

**Distancia:** 4 km ida y vuelta | **Duración:** 1.5 horas | **Dificultad:** Baja

Perfecto para un primer día o para familias. Un sendero fácil que lleva a una cascada de 20 metros rodeada de bosque nativo.

**La recompensa:** Una cascada pintoresca en un entorno de tranquilidad absoluta.

**Tip:** Ideal para la tarde del día de llegada como calentamiento.

## 5. Laguna Capri

**Distancia:** 12 km ida y vuelta | **Duración:** 4-5 horas | **Dificultad:** Baja-media

Una alternativa más corta para ver el Fitz Roy de cerca. Podés llegar a la Laguna Capri, que refleja el Fitz Roy en sus aguas, sin hacer el tramo final empinado de Laguna de los Tres.

**La recompensa:** Vistas del Fitz Roy con el reflejo en la laguna. Excelente para picnic.

## Itinerario sugerido (4 días)

| Día | Trekking | Nivel |
|-----|---------|-------|
| 1 | Chorrillo del Salto + explorar pueblo | Suave |
| 2 | Laguna de los Tres | Exigente |
| 3 | Laguna Torre | Moderado |
| 4 | Loma del Pliegue Tumbado | Exigente |

## Tips finales

- **No hay señal de celular** en los senderos. Descargá mapas offline.
- **Llevá tus residuos.** No hay cestos de basura en los senderos.
- **El viento es real.** Puede llegar a 100 km/h. Llevá siempre cortaviento.
- **Los refugios** ofrecen comida y alojamiento básico, pero reservá con anticipación.

El Chaltén es un lugar que te cambia. La combinación de esfuerzo físico y recompensa visual genera una experiencia que va más allá del turismo. Es conexión pura con la naturaleza.`,
  },
  {
    slug: 'tradiciones-norte-argentino',
    title: 'Tradiciones y festividades del Norte Argentino',
    excerpt: 'Un viaje a través de la cultura, la música y las celebraciones ancestrales de Salta y Jujuy.',
    coverImage: '/salta-jujuy-argentina-colorful-mountains.jpg',
    category: 'cultura',
    author: {
      name: 'Sofía Ruiz',
    },
    publishedAt: '2025-12-15',
    readingTime: 5,
    content: `El Norte Argentino es una tierra donde las tradiciones ancestrales se mantienen vivas en cada celebración, cada plato y cada nota musical. Salta y Jujuy son las puertas de entrada a una cultura milenaria que fusiona herencias indígenas con influencias coloniales.

## La Pachamama: Madre Tierra

La ceremonia más profunda del Norte Argentino es la ofrenda a la Pachamama, que se celebra cada 1 de agosto. En este ritual, se cava un pozo en la tierra donde se depositan alimentos, bebidas y hojas de coca como agradecimiento a la Madre Tierra por todo lo que brinda.

**Dónde vivirlo:** Purmamarca, Humahuaca y comunidades rurales de la Quebrada. Muchas comunidades abren sus ceremonias a visitantes respetuosos.

## Carnaval norteño: Fiesta de color

El Carnaval en el Norte no se parece a ningún otro. Es una celebración que dura semanas y comienza con el "desentierro del diablo", una figura que simboliza la alegría y el descontrol.

**Lo que vas a vivir:**
- Comparsas con música de sikus y bombos
- Guerra de agua y espuma
- Coplas cantadas por copleras (tradición oral única)
- Empanadas, tamales y humita servidos en abundancia

**Mejor lugar:** Humahuaca y Tilcara tienen los carnavales más auténticos y participativos.

## La música del Norte

### Folklore
La zamba, la chacarera y la vidala son los ritmos que nacieron en estas tierras. En las peñas folklóricas de Salta y Jujuy podés escuchar músicos en vivo mientras disfrutás de comida regional.

**Peñas recomendadas en Salta:**
- La Vieja Estación
- Peña Balderrama (inmortalizada por el Cuchi Leguizamón)

### Música andina
Los sikus, quenas y charangos llenan el aire en la Quebrada de Humahuaca. Es una música que conecta directamente con las raíces prehispánicas de la región.

## Gastronomía: Sabores ancestrales

La cocina del Norte es una de las más ricas de Argentina. Muchos platos mantienen recetas que tienen siglos de historia.

**Platos imperdibles:**
- **Empanadas salteñas:** Jugosas, con papa, carne cortada a cuchillo y comino. Las mejores del país.
- **Locro:** Guiso de maíz, poroto y carne. Se come especialmente el 25 de mayo.
- **Humita en chala:** Pasta de choclo cocida en hojas de maíz.
- **Tamales:** Masa de maíz rellena de carne, envuelta en chala.
- **Llama:** Carne magra y sabrosa, servida en distintas preparaciones.

## Festividades principales

| Mes | Festividad | Lugar |
|-----|-----------|-------|
| Enero-Febrero | Carnaval | Quebrada de Humahuaca |
| Marzo-Abril | Semana Santa | Salta, Jujuy |
| Agosto | Pachamama | Toda la región |
| Septiembre | Señor y Virgen del Milagro | Salta |
| Noviembre | Día de los Muertos | Comunidades originarias |

## Artesanías: El arte en las manos

Las artesanías del Norte cuentan historias. Los tejidos en telar, la cerámica y el trabajo en plata son expresiones de una cultura que se transmite de generación en generación.

**Qué comprar:**
- Tejidos en lana de llama y vicuña (Purmamarca, Humahuaca)
- Cerámica de estilo prehispánico
- Instrumentos musicales (sikus, bombos)
- Poncho salteño rojo (ícono cultural)

## Viajá con respeto

El turismo cultural requiere sensibilidad. Algunas recomendaciones:
- Pedí permiso antes de fotografiar ceremonias o personas
- No regatees a los artesanos, su trabajo vale
- Participá de las tradiciones con respeto y apertura
- Aprendé algunas palabras en quechua: "sulpayki" (gracias), "allinchu" (¿estás bien?)

El Norte Argentino no es solo un destino turístico: es un viaje en el tiempo, una ventana a tradiciones que sobrevivieron siglos. Visitarlo con los ojos y el corazón abiertos es una experiencia transformadora.`,
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
