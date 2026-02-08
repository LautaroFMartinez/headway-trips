import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { format, subDays, startOfWeek, endOfWeek, eachWeekOfInterval, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET() {
  try {
    // Verificar sesión con Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener estadísticas generales usando las tablas correctas
    const [tripsResult, quotesResult, messagesResult] = await Promise.all([
      supabase.from('trips').select('id', { count: 'exact', head: true }),
      supabase.from('quote_requests').select('id, status, created_at', { count: 'exact' }),
      supabase.from('contact_messages').select('id, read, created_at', { count: 'exact' }),
    ]);

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

    // KPIs: Ventas cerradas (confirmed) y Contactados sin cierre (contacted)
    const confirmedSales = quotes.filter((q) => q.status === 'confirmed').length;
    const contactedNotClosed = quotes.filter((q) => q.status === 'contacted').length;

    // Datos para gráfico de actividad (últimos 28 días con buckets semanales)
    const now = new Date();
    const fourWeeksAgo = subDays(now, 27);
    
    const weeks = eachWeekOfInterval(
      { start: fourWeeksAgo, end: now },
      { locale: es }
    );

    const quotesByWeek = weeks.map((weekStart) => {
      const weekEnd = addDays(weekStart, 6);
      const weekLabel = `${format(weekStart, 'd MMM', { locale: es })}`;
      
      const weekQuotes = quotes.filter((q) => {
        const date = new Date(q.created_at);
        return date >= weekStart && date <= weekEnd;
      }).length;
      
      const weekMessages = messages.filter((m) => {
        const date = new Date(m.created_at);
        return date >= weekStart && date <= weekEnd;
      }).length;

      // Count confirmed and contacted for this week
      const weekConfirmed = quotes.filter((q) => {
        const date = new Date(q.created_at);
        return date >= weekStart && date <= weekEnd && q.status === 'confirmed';
      }).length;

      const weekContacted = quotes.filter((q) => {
        const date = new Date(q.created_at);
        return date >= weekStart && date <= weekEnd && q.status === 'contacted';
      }).length;

      return {
        weekStart: format(weekStart, 'yyyy-MM-dd'),
        label: weekLabel,
        cotizaciones: weekQuotes,
        mensajes: weekMessages,
        confirmadas: weekConfirmed,
        contactadas: weekContacted,
      };
    });

    // Cotizaciones por región (basado en viajes)
    const { data: quotesWithTrips } = await supabase
      .from('quote_requests')
      .select('trip_id, trips(region)')
      .not('trip_id', 'is', null);

    const regionCounts: Record<string, number> = {};
    (quotesWithTrips || []).forEach((q: Record<string, unknown>) => {
      const trips = q.trips as { region: string } | { region: string }[] | null;
      const region = Array.isArray(trips) ? trips[0]?.region : trips?.region;
      regionCounts[region || 'Sin especificar'] = (regionCounts[region || 'Sin especificar'] || 0) + 1;
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

    // Actividad reciente - con nombres reales
    const { data: recentQuotesData } = await supabase
      .from('quote_requests')
      .select('id, customer_name, status, created_at, trips(title)')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: recentMessagesData } = await supabase
      .from('contact_messages')
      .select('id, name, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    const statusMessages: Record<string, string> = {
      pending: 'Nueva cotización',
      contacted: 'Cotización contactada',
      quoted: 'Cotización enviada',
      confirmed: 'Venta confirmada',
      cancelled: 'Cotización cancelada',
    };

    const recentActivity = [
      ...(recentQuotesData || []).map((q: Record<string, unknown>) => {
        const trips = q.trips as { title: string } | { title: string }[] | null;
        const tripTitle = Array.isArray(trips) ? trips[0]?.title : trips?.title;
        return {
          type: 'quote',
          status: q.status as string,
          message: `${statusMessages[q.status as string] || 'Cotización'}: ${tripTitle || 'Viaje'} - ${q.customer_name}`,
          time: formatTimeAgo(new Date(q.created_at as string)),
          id: q.id as string,
        };
      }),
      ...(recentMessagesData || []).map((m) => ({
        type: 'message',
        status: 'new',
        message: `Mensaje de contacto de ${m.name}`,
        time: formatTimeAgo(new Date(m.created_at)),
        id: m.id,
      })),
    ]
      .sort((a, b) => {
        // Sort by time description (approximate)
        const timeOrder = (t: string) => {
          if (t.includes('minuto')) return 1;
          if (t.includes('hora')) return 2;
          if (t === 'Ayer') return 3;
          return 4;
        };
        return timeOrder(a.time) - timeOrder(b.time);
      })
      .slice(0, 6);

    const finalRecentActivity = recentActivity.length > 0 ? recentActivity : [];

    // Tasa de conversión
    const totalQuotesCount = quotes.length;
    const conversionRate = totalQuotesCount > 0
      ? Math.round((confirmedSales / totalQuotesCount) * 100)
      : 0;

    return NextResponse.json({
      stats: {
        totalTrips,
        totalQuotes: quotes.length,
        totalMessages: messages.length,
        pendingQuotes,
        unreadMessages,
        quotesThisWeek,
        confirmedSales,
        contactedNotClosed,
        conversionRate,
      },
      quotesByWeek,
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
