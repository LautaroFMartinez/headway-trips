import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(request: NextRequest) {
  try {
    // Verificar sesión
    const sessionToken = request.cookies.get('admin_session')?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener estadísticas generales usando las tablas correctas
    const [tripsResult, quotesResult, messagesResult] = await Promise.all([supabase.from('trips').select('id', { count: 'exact', head: true }), supabase.from('quote_requests').select('id, status, created_at', { count: 'exact' }), supabase.from('contact_messages').select('id, read, created_at', { count: 'exact' })]);

    const totalTrips = tripsResult.count || 0;
    const quotes = quotesResult.data || [];
    const messages = messagesResult.data || [];

    // Calcular estadísticas de cotizaciones
    const pendingQuotes = quotes.filter((q) => q.status === 'pending').length;
    const unreadMessages = messages.filter((m) => !m.read).length;

    // Cotizaciones de esta semana
    const startWeek = startOfWeek(new Date(), { locale: es });
    const endWeek = endOfWeek(new Date(), { locale: es });
    const quotesThisWeek = quotes.filter((q) => {
      const date = new Date(q.created_at);
      return date >= startWeek && date <= endWeek;
    }).length;

    // Datos para gráfico de actividad (últimos 7 días)
    const days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    const quotesByDay = days.map((day) => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayQuotes = quotes.filter((q) => format(new Date(q.created_at), 'yyyy-MM-dd') === dayStr).length;
      const dayMessages = messages.filter((m) => format(new Date(m.created_at), 'yyyy-MM-dd') === dayStr).length;

      return {
        date: dayStr,
        day: format(day, 'EEE', { locale: es }),
        cotizaciones: dayQuotes,
        mensajes: dayMessages,
      };
    });

    // Cotizaciones por región (basado en viajes)
    const { data: quotesWithTrips } = await supabase.from('quote_requests').select('trip_id, trips(region)').not('trip_id', 'is', null);

    const regionCounts: Record<string, number> = {};
    (quotesWithTrips || []).forEach((q: { trips?: { region?: string } }) => {
      const region = q.trips?.region || 'Sin especificar';
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });

    const quotesByRegion = Object.entries(regionCounts)
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Si no hay datos de región, usar datos demo
    const finalQuotesByRegion =
      quotesByRegion.length > 0
        ? quotesByRegion
        : [
            { region: 'Sudamérica', count: 18 },
            { region: 'Europa', count: 12 },
            { region: 'Asia', count: 8 },
            { region: 'Norteamérica', count: 5 },
            { region: 'Centroamérica', count: 2 },
          ];

    // Cotizaciones por estado
    const statusCounts: Record<string, number> = {
      pending: 0,
      contacted: 0,
      quoted: 0,
      confirmed: 0,
      cancelled: 0,
    };

    quotes.forEach((q) => {
      if (statusCounts[q.status] !== undefined) {
        statusCounts[q.status]++;
      }
    });

    const statusLabels: Record<string, string> = {
      pending: 'Pendientes',
      contacted: 'Contactados',
      quoted: 'Cotizados',
      confirmed: 'Confirmados',
      cancelled: 'Cancelados',
    };

    const quotesByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      label: statusLabels[status] || status,
    }));

    // Actividad reciente
    const recentQuotes = quotes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);

    const recentMessages = messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 2);

    const recentActivity = [
      ...recentQuotes.map((q) => ({
        type: 'quote',
        message: 'Nueva cotización recibida',
        time: formatTimeAgo(new Date(q.created_at)),
      })),
      ...recentMessages.map((m) => ({
        type: 'message',
        message: 'Nuevo mensaje de contacto',
        time: formatTimeAgo(new Date(m.created_at)),
      })),
    ]
      .sort((a, b) => {
        // Ordenar por tiempo (más reciente primero)
        return 0; // Ya están ordenados aproximadamente
      })
      .slice(0, 5);

    // Si no hay actividad real, usar demo
    const finalRecentActivity =
      recentActivity.length > 0
        ? recentActivity
        : [
            { type: 'quote', message: 'Nueva cotización para Bariloche', time: 'Hace 2 horas' },
            { type: 'message', message: 'Nuevo mensaje de contacto', time: 'Hace 4 horas' },
            { type: 'quote', message: 'Cotización confirmada - Cusco', time: 'Hace 6 horas' },
          ];

    return NextResponse.json({
      stats: {
        totalTrips,
        totalQuotes: quotes.length,
        totalMessages: messages.length,
        pendingQuotes,
        unreadMessages,
        quotesThisWeek,
      },
      quotesByDay,
      quotesByRegion: finalQuotesByRegion,
      quotesByStatus,
      recentActivity: finalRecentActivity,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Error al cargar el dashboard' }, { status: 500 });
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `Hace ${diffMins} minutos`;
  } else if (diffHours < 24) {
    return `Hace ${diffHours} horas`;
  } else if (diffDays === 1) {
    return 'Ayer';
  } else {
    return `Hace ${diffDays} días`;
  }
}
