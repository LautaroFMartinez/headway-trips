-- =============================================
-- HEADWAY TRIPS - SEED DATA
-- =============================================
-- Ejecutar DESPUÉS de schema.sql para poblar la base de datos

-- =============================================
-- TRIPS - SUDAMÉRICA
-- =============================================
INSERT INTO public.trips (id, title, subtitle, region, description, duration, duration_days, price, price_value, image, hero_image, highlights, tags, includes, excludes, difficulty_level, min_age, accommodation_type) VALUES

-- Argentina
('bariloche', 'Bariloche', 'Patagonia Argentina', 'sudamerica', 
  'Descubrí la magia de la Patagonia argentina en San Carlos de Bariloche. Lagos cristalinos, montañas nevadas, bosques milenarios y la mejor gastronomía regional te esperan.',
  '7 días', 7, 'Desde USD $1.200', 1200,
  '/bariloche-patagonia-argentina-mountains-lake-sceni.jpg',
  '/bariloche-patagonia-argentina-panoramic-view-mount.jpg',
  ARRAY['Circuito Chico', 'Cerro Catedral', 'Isla Victoria', 'Chocolaterías artesanales'],
  ARRAY['montaña', 'naturaleza', 'gastronomía', 'lagos'],
  ARRAY['Alojamiento 6 noches en hotel 4 estrellas', 'Desayuno buffet diario', 'Traslados aeropuerto-hotel-aeropuerto', 'Excursión Circuito Chico', 'Navegación Isla Victoria y Bosque de Arrayanes', 'Seguro de viaje'],
  ARRAY['Vuelos aéreos', 'Comidas no mencionadas', 'Propinas', 'Gastos personales'],
  'easy', 0, 'hotel'),

('cataratas', 'Cataratas del Iguazú', 'Misiones, Argentina', 'sudamerica',
  'Una de las siete maravillas naturales del mundo te espera. Viví la experiencia de las Cataratas del Iguazú con paseos en lancha, caminatas por la selva y vistas impresionantes.',
  '5 días', 5, 'Desde USD $950', 950,
  '/iguazu-falls-waterfall-argentina-brazil-majestic.jpg',
  '/iguazu-falls-panoramic-rainbow-mist-waterfall.jpg',
  ARRAY['Garganta del Diablo', 'Paseo en lancha', 'Selva Misionera', 'Minas de Wanda'],
  ARRAY['naturaleza', 'aventura', 'cataratas', 'selva'],
  ARRAY['Alojamiento 4 noches en hotel 3 estrellas', 'Desayuno diario', 'Traslados', 'Entrada al Parque Nacional (lado argentino)', 'Gran Aventura con lancha bajo las cataratas', 'Seguro de viaje'],
  ARRAY['Vuelos aéreos', 'Entrada lado brasileño', 'Almuerzo y cena', 'Propinas'],
  'moderate', 5, 'hotel'),

('mendoza', 'Mendoza', 'Región de Cuyo, Argentina', 'sudamerica',
  'La tierra del sol y del buen vino. Recorré las bodegas más prestigiosas, disfrutá de paisajes andinos únicos y descubrí la calidez de la cultura mendocina.',
  '4 días', 4, 'Desde USD $850', 850,
  '/mendoza-argentina-vineyards-andes-mountains-wine-c.jpg',
  '/mendoza-vineyards-sunset-andes-mountains-panoramic.jpg',
  ARRAY['Ruta del Vino', 'Alta Montaña', 'Puente del Inca', 'Parque San Martín'],
  ARRAY['vino', 'montaña', 'gastronomía', 'cultura'],
  ARRAY['Alojamiento 3 noches en hotel boutique', 'Desayuno gourmet', 'Tour de bodegas con degustación', 'Excursión Alta Montaña', 'Traslados', 'Seguro de viaje'],
  ARRAY['Vuelos aéreos', 'Almuerzo y cena', 'Bebidas extra en bodegas', 'Propinas'],
  'easy', 0, 'boutique'),

('salta', 'Salta y Jujuy', 'Norte Argentino', 'sudamerica',
  'Colores, historia y tradiciones en el norte argentino. Desde la Quebrada de Humahuaca hasta los Valles Calchaquíes, cada rincón es una postal inolvidable.',
  '6 días', 6, 'Desde USD $1.100', 1100,
  '/salta-jujuy-argentina-colorful-mountains-cerro-sie.jpg',
  '/quebrada-humahuaca-colorful-mountains-panoramic-ar.jpg',
  ARRAY['Cerro de los 7 Colores', 'Salinas Grandes', 'Cafayate', 'Tren a las Nubes'],
  ARRAY['cultura', 'historia', 'paisajes', 'tradiciones'],
  ARRAY['Alojamiento 5 noches', 'Desayuno diario', 'Excursión Quebrada de Humahuaca', 'Excursión Salinas Grandes', 'Tour Valles Calchaquíes', 'Traslados', 'Seguro de viaje'],
  ARRAY['Vuelos aéreos', 'Tren a las Nubes (opcional)', 'Almuerzo y cena', 'Propinas'],
  'moderate', 0, 'hotel'),

('ushuaia', 'Ushuaia', 'Fin del Mundo, Argentina', 'sudamerica',
  'Llegá al fin del mundo y descubrí paisajes únicos. Glaciares, montañas, lagos y el Canal Beagle te esperan en la ciudad más austral del planeta.',
  '5 días', 5, 'Desde USD $1.400', 1400,
  '/ushuaia-tierra-del-fuego-end-of-world-argentina.jpg',
  '/ushuaia-beagle-channel-panoramic-mountains-snow.jpg',
  ARRAY['Parque Nacional', 'Canal Beagle', 'Tren del Fin del Mundo', 'Pingüinera'],
  ARRAY['aventura', 'naturaleza', 'fauna', 'glaciares'],
  ARRAY['Alojamiento 4 noches en hotel 4 estrellas', 'Desayuno buffet', 'Navegación Canal Beagle', 'Parque Nacional Tierra del Fuego', 'Traslados', 'Seguro de viaje'],
  ARRAY['Vuelos aéreos', 'Tren del Fin del Mundo', 'Almuerzo y cena', 'Excursiones opcionales'],
  'moderate', 5, 'hotel'),

('calafate', 'El Calafate', 'Glaciar Perito Moreno, Argentina', 'sudamerica',
  'El glaciar más famoso del mundo te espera. Caminá sobre el hielo, navegá entre icebergs y viví una experiencia única en la Patagonia austral.',
  '4 días', 4, 'Desde USD $1.300', 1300,
  '/el-calafate-perito-moreno-glacier-argentina-blue-i.jpg',
  '/el-calafate-perito-moreno-glacier-argentina.jpg',
  ARRAY['Glaciar Perito Moreno', 'Minitrekking', 'Todo Glaciares', 'Estancia Patagónica'],
  ARRAY['glaciares', 'aventura', 'naturaleza', 'trekking'],
  ARRAY['Alojamiento 3 noches', 'Desayuno diario', 'Excursión Glaciar Perito Moreno', 'Traslados', 'Seguro de viaje'],
  ARRAY['Vuelos aéreos', 'Minitrekking (opcional)', 'Almuerzo y cena', 'Propinas'],
  'moderate', 10, 'hotel'),

-- Perú
('machu-picchu', 'Machu Picchu', 'Cusco, Perú', 'sudamerica',
  'Descubrí la ciudadela inca más famosa del mundo. Una experiencia mística entre montañas, historia milenaria y la energía única de los Andes peruanos.',
  '7 días', 7, 'Desde USD $1.500', 1500,
  '/historic-city-architecture-travel.jpg',
  '/historic-city-architecture-travel.jpg',
  ARRAY['Machu Picchu', 'Valle Sagrado', 'Cusco Colonial', 'Aguas Calientes'],
  ARRAY['historia', 'cultura', 'arqueología', 'montaña'],
  ARRAY['Alojamiento 6 noches', 'Desayuno diario', 'Tren a Machu Picchu', 'Entrada a Machu Picchu', 'Guía profesional', 'Tour Valle Sagrado', 'Traslados', 'Seguro de viaje'],
  ARRAY['Vuelos aéreos', 'Almuerzo y cena', 'Propinas', 'Huayna Picchu (opcional)'],
  'moderate', 8, 'hotel'),

-- Brasil
('rio-janeiro', 'Río de Janeiro', 'Brasil', 'sudamerica',
  'La ciudad maravillosa te espera con sus playas icónicas, el Cristo Redentor, el Pan de Azúcar y la energía única del carnaval brasileño.',
  '6 días', 6, 'Desde USD $1.350', 1350,
  '/tropical-beach-sunset-travel-vacation.jpg',
  '/tropical-beach-sunset-travel.jpg',
  ARRAY['Cristo Redentor', 'Pan de Azúcar', 'Copacabana', 'Ipanema'],
  ARRAY['playa', 'cultura', 'ciudad', 'naturaleza'],
  ARRAY['Alojamiento 5 noches en Copacabana', 'Desayuno diario', 'Tour Cristo Redentor', 'Subida al Pan de Azúcar', 'City tour', 'Traslados', 'Seguro de viaje'],
  ARRAY['Vuelos aéreos', 'Almuerzo y cena', 'Shows de samba', 'Propinas'],
  'easy', 0, 'hotel'),

-- =============================================
-- TRIPS - EUROPA
-- =============================================

('paris', 'París', 'Francia', 'europa',
  'La ciudad del amor te espera. Torre Eiffel, Louvre, Montmartre, gastronomía exquisita y la magia de pasear por las calles más románticas del mundo.',
  '7 días', 7, 'Desde USD $2.200', 2200,
  '/historic-city-architecture-travel.jpg',
  '/historic-city-architecture-travel.jpg',
  ARRAY['Torre Eiffel', 'Museo del Louvre', 'Montmartre', 'Versalles'],
  ARRAY['romance', 'cultura', 'arte', 'gastronomía'],
  ARRAY['Alojamiento 6 noches en hotel céntrico', 'Desayuno diario', 'Entrada al Louvre', 'Subida a la Torre Eiffel', 'Excursión a Versalles', 'Pase de metro', 'Seguro de viaje'],
  ARRAY['Vuelos aéreos', 'Almuerzo y cena', 'Crucero por el Sena (opcional)', 'Propinas'],
  'easy', 0, 'hotel'),

('roma', 'Roma', 'Italia', 'europa',
  'La ciudad eterna te invita a recorrer 3000 años de historia. Coliseo, Vaticano, Fontana di Trevi y la mejor gastronomía italiana.',
  '6 días', 6, 'Desde USD $1.900', 1900,
  '/historic-city-architecture-travel.jpg',
  '/historic-city-architecture-travel.jpg',
  ARRAY['Coliseo', 'Vaticano', 'Fontana di Trevi', 'Trastevere'],
  ARRAY['historia', 'arte', 'gastronomía', 'cultura'],
  ARRAY['Alojamiento 5 noches', 'Desayuno italiano', 'Entrada al Coliseo', 'Tour Vaticano con guía', 'Walking tour centro histórico', 'Seguro de viaje'],
  ARRAY['Vuelos aéreos', 'Almuerzo y cena', 'Traslados internos', 'Propinas'],
  'easy', 0, 'hotel'),

('barcelona', 'Barcelona', 'España', 'europa',
  'Arte, playa y gastronomía en la capital catalana. Gaudí, Las Ramblas, el Barrio Gótico y la vibrante vida nocturna te esperan.',
  '5 días', 5, 'Desde USD $1.700', 1700,
  '/historic-city-architecture-travel.jpg',
  '/historic-city-architecture-travel.jpg',
  ARRAY['Sagrada Familia', 'Park Güell', 'Las Ramblas', 'Barrio Gótico'],
  ARRAY['arte', 'playa', 'gastronomía', 'arquitectura'],
  ARRAY['Alojamiento 4 noches', 'Desayuno diario', 'Entrada Sagrada Familia', 'Entrada Park Güell', 'Tour Gaudí', 'Seguro de viaje'],
  ARRAY['Vuelos aéreos', 'Almuerzo y cena', 'Transporte local', 'Propinas'],
  'easy', 0, 'hotel'),

-- =============================================
-- TRIPS - ASIA
-- =============================================

('tokio', 'Tokio', 'Japón', 'asia',
  'Tradición y modernidad en perfecta armonía. Templos milenarios, tecnología de vanguardia, gastronomía única y la cultura japonesa en su máxima expresión.',
  '10 días', 10, 'Desde USD $3.500', 3500,
  '/historic-city-architecture-travel.jpg',
  '/historic-city-architecture-travel.jpg',
  ARRAY['Shibuya', 'Senso-ji', 'Monte Fuji', 'Kioto'],
  ARRAY['cultura', 'tecnología', 'gastronomía', 'templos'],
  ARRAY['Alojamiento 9 noches', 'Desayuno diario', 'JR Pass 7 días', 'Excursión Monte Fuji', 'Tour Kioto', 'Seguro de viaje'],
  ARRAY['Vuelos aéreos', 'Almuerzo y cena', 'Entradas a templos', 'Propinas'],
  'moderate', 0, 'hotel'),

('tailandia', 'Tailandia', 'Bangkok y Playas', 'asia',
  'Templos dorados, playas paradisíacas y una cultura milenaria. Bangkok, Chiang Mai y las islas del sur te esperan.',
  '12 días', 12, 'Desde USD $2.800', 2800,
  '/tropical-beach-sunset-travel-vacation.jpg',
  '/tropical-beach-sunset-travel.jpg',
  ARRAY['Gran Palacio', 'Templos de Chiang Mai', 'Phi Phi Islands', 'Mercados flotantes'],
  ARRAY['playa', 'templos', 'cultura', 'gastronomía'],
  ARRAY['Alojamiento 11 noches', 'Desayuno diario', 'Vuelos internos', 'Tours en Bangkok', 'Excursión Phi Phi', 'Traslados', 'Seguro de viaje'],
  ARRAY['Vuelos internacionales', 'Almuerzo y cena', 'Actividades opcionales', 'Propinas'],
  'easy', 0, 'resort'),

-- =============================================
-- TRIPS - CARIBE
-- =============================================

('cancun', 'Cancún', 'México', 'caribe',
  'Playas de arena blanca, aguas turquesas y la riqueza de la cultura maya. El destino caribeño por excelencia te espera.',
  '7 días', 7, 'Desde USD $1.600', 1600,
  '/tropical-beach-sunset-travel-vacation.jpg',
  '/tropical-beach-sunset-travel.jpg',
  ARRAY['Chichén Itzá', 'Xcaret', 'Isla Mujeres', 'Zona Hotelera'],
  ARRAY['playa', 'all-inclusive', 'arqueología', 'snorkel'],
  ARRAY['Alojamiento 6 noches all-inclusive', 'Todos los alimentos y bebidas', 'Excursión Chichén Itzá', 'Traslados', 'Seguro de viaje'],
  ARRAY['Vuelos aéreos', 'Xcaret y parques (opcional)', 'Propinas', 'Spa'],
  'easy', 0, 'resort'),

('punta-cana', 'Punta Cana', 'República Dominicana', 'caribe',
  'El paraíso caribeño con las mejores playas del mundo. Resorts all-inclusive, excursiones y la calidez dominicana.',
  '7 días', 7, 'Desde USD $1.450', 1450,
  '/tropical-beach-sunset-travel-vacation.jpg',
  '/tropical-beach-sunset-travel.jpg',
  ARRAY['Playa Bávaro', 'Isla Saona', 'Hoyo Azul', 'Snorkel'],
  ARRAY['playa', 'all-inclusive', 'relax', 'snorkel'],
  ARRAY['Alojamiento 6 noches all-inclusive 5 estrellas', 'Todos los alimentos y bebidas premium', 'Excursión Isla Saona', 'Traslados', 'Seguro de viaje'],
  ARRAY['Vuelos aéreos', 'Excursiones adicionales', 'Propinas', 'Spa'],
  'easy', 0, 'resort'),

-- =============================================
-- TRIPS - OCEANÍA
-- =============================================

('sydney', 'Sydney', 'Australia', 'oceania',
  'La ciudad más icónica de Oceanía. Opera House, Harbour Bridge, playas espectaculares y una calidad de vida envidiable.',
  '10 días', 10, 'Desde USD $4.200', 4200,
  '/beautiful-mountain-landscape-travel-destination.jpg',
  '/beautiful-mountain-landscape-with-lake-travel-dest.jpg',
  ARRAY['Opera House', 'Harbour Bridge', 'Bondi Beach', 'Blue Mountains'],
  ARRAY['ciudad', 'playa', 'naturaleza', 'cultura'],
  ARRAY['Alojamiento 9 noches', 'Desayuno diario', 'City tour Sydney', 'Excursión Blue Mountains', 'Ferry por la bahía', 'Seguro de viaje'],
  ARRAY['Vuelos aéreos', 'Almuerzo y cena', 'Bridge Climb (opcional)', 'Propinas'],
  'easy', 0, 'hotel'),

('nueva-zelanda', 'Nueva Zelanda', 'Isla Norte y Sur', 'oceania',
  'Paisajes de película, aventura extrema y naturaleza virgen. Desde los volcanes del norte hasta los fiordos del sur.',
  '14 días', 14, 'Desde USD $5.500', 5500,
  '/adventure-hiking-nature-travel.jpg',
  '/adventure-hiking-nature-waterfall-travel.jpg',
  ARRAY['Hobbiton', 'Milford Sound', 'Queenstown', 'Rotorua'],
  ARRAY['aventura', 'naturaleza', 'trekking', 'paisajes'],
  ARRAY['Alojamiento 13 noches', 'Desayuno diario', 'Auto de alquiler', 'Crucero Milford Sound', 'Entrada Hobbiton', 'Seguro de viaje'],
  ARRAY['Vuelos aéreos', 'Combustible', 'Almuerzo y cena', 'Actividades de aventura'],
  'moderate', 12, 'lodge')

ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  region = EXCLUDED.region,
  description = EXCLUDED.description,
  duration = EXCLUDED.duration,
  duration_days = EXCLUDED.duration_days,
  price = EXCLUDED.price,
  price_value = EXCLUDED.price_value,
  image = EXCLUDED.image,
  hero_image = EXCLUDED.hero_image,
  highlights = EXCLUDED.highlights,
  tags = EXCLUDED.tags,
  includes = EXCLUDED.includes,
  excludes = EXCLUDED.excludes,
  difficulty_level = EXCLUDED.difficulty_level,
  min_age = EXCLUDED.min_age,
  accommodation_type = EXCLUDED.accommodation_type,
  updated_at = NOW();
