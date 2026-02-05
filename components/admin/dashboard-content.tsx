'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { FileText, MessageSquare, Plane, TrendingUp, CheckCircle2, PhoneCall } from 'lucide-react';
import { format, subDays, eachWeekOfInterval, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStats {
  totalTrips: number;
  totalQuotes: number;
  totalMessages: number;
  pendingQuotes: number;
  unreadMessages: number;
  quotesThisWeek: number;
  confirmedSales: number;
  contactedNotClosed: number;
}

interface QuotesByWeek {
  weekStart: string;
  label: string;
  cotizaciones: number;
  mensajes: number;
  confirmadas: number;
  contactadas: number;
}

interface QuotesByRegion {
  region: string;
  count: number;
}

interface QuotesByStatus {
  status: string;
  count: number;
  label: string;
}

// Colores para gráficos
const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];
const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  contacted: '#3b82f6',
  quoted: '#8b5cf6',
  confirmed: '#22c55e',
  cancelled: '#ef4444',
};

export function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [quotesByWeek, setQuotesByWeek] = useState<QuotesByWeek[]>([]);
  const [quotesByRegion, setQuotesByRegion] = useState<QuotesByRegion[]>([]);
  const [quotesByStatus, setQuotesByStatus] = useState<QuotesByStatus[]>([]);
  const [recentActivity, setRecentActivity] = useState<Array<{ type: string; message: string; time: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setQuotesByWeek(data.quotesByWeek || []);
        setQuotesByRegion(data.quotesByRegion);
        setQuotesByStatus(data.quotesByStatus);
        setRecentActivity(data.recentActivity);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Usar datos de demo si falla
      setStats({
        totalTrips: 20,
        totalQuotes: 45,
        totalMessages: 12,
        pendingQuotes: 8,
        unreadMessages: 3,
        quotesThisWeek: 12,
        confirmedSales: 7,
        contactedNotClosed: 12,
      });
      generateDemoData();
    } finally {
      setIsLoading(false);
    }
  };

  const generateDemoData = () => {
    // Datos de demo para las últimas 4 semanas
    const now = new Date();
    const fourWeeksAgo = subDays(now, 27);
    const weeks = eachWeekOfInterval({ start: fourWeeksAgo, end: now }, { locale: es });

    setQuotesByWeek(
      weeks.map((weekStart) => ({
        weekStart: format(weekStart, 'yyyy-MM-dd'),
        label: format(weekStart, 'd MMM', { locale: es }),
        cotizaciones: Math.floor(Math.random() * 15) + 5,
        mensajes: Math.floor(Math.random() * 8) + 2,
        confirmadas: Math.floor(Math.random() * 4),
        contactadas: Math.floor(Math.random() * 6) + 1,
      }))
    );

    setQuotesByRegion([
      { region: 'Sudamérica', count: 18 },
      { region: 'Europa', count: 12 },
      { region: 'Asia', count: 8 },
      { region: 'Norteamérica', count: 5 },
      { region: 'Centroamérica', count: 2 },
    ]);

    setQuotesByStatus([
      { status: 'pending', count: 8, label: 'Pendientes' },
      { status: 'contacted', count: 12, label: 'Contactados' },
      { status: 'quoted', count: 15, label: 'Cotizados' },
      { status: 'confirmed', count: 7, label: 'Confirmados' },
      { status: 'cancelled', count: 3, label: 'Cancelados' },
    ]);

    setRecentActivity([
      { type: 'quote', message: 'Nueva cotización para Bariloche', time: 'Hace 2 horas' },
      { type: 'message', message: 'Nuevo mensaje de contacto', time: 'Hace 4 horas' },
      { type: 'quote', message: 'Cotización confirmada - Cusco', time: 'Hace 6 horas' },
      { type: 'quote', message: 'Nueva cotización para París', time: 'Ayer' },
      { type: 'message', message: 'Consulta sobre disponibilidad', time: 'Ayer' },
    ]);
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Resumen de actividad · {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}</p>
      </div>

      {/* Stats cards - Main metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Viajes activos" value={stats?.totalTrips || 0} icon={Plane} color="blue" />
        <StatCard title="Cotizaciones totales" value={stats?.totalQuotes || 0} icon={FileText} color="indigo" badge={stats?.pendingQuotes ? `${stats.pendingQuotes} pendientes` : undefined} />
        <StatCard title="Mensajes" value={stats?.totalMessages || 0} icon={MessageSquare} color="purple" badge={stats?.unreadMessages ? `${stats.unreadMessages} sin leer` : undefined} />
        <StatCard title="Esta semana" value={stats?.quotesThisWeek || 0} icon={TrendingUp} color="amber" description="cotizaciones" />
      </div>

      {/* KPI Cards - Sales metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Ventas cerradas</p>
                <p className="text-4xl font-bold text-green-900 mt-1">{stats?.confirmedSales || 0}</p>
                <p className="text-sm text-green-600 mt-2">Cotizaciones confirmadas</p>
              </div>
              <div className="p-3 rounded-xl bg-green-100">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Contactadas sin cierre</p>
                <p className="text-4xl font-bold text-blue-900 mt-1">{stats?.contactedNotClosed || 0}</p>
                <p className="text-sm text-blue-600 mt-2">Clientes en seguimiento</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <PhoneCall className="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly activity chart - 28 days */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actividad últimas 4 semanas</CardTitle>
            <CardDescription>Cotizaciones y mensajes por semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={quotesByWeek}>
                  <defs>
                    <linearGradient id="colorCotizaciones" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorMensajes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Area type="monotone" dataKey="cotizaciones" stroke="#6366f1" fillOpacity={1} fill="url(#colorCotizaciones)" name="Cotizaciones" />
                  <Area type="monotone" dataKey="mensajes" stroke="#22c55e" fillOpacity={1} fill="url(#colorMensajes)" name="Mensajes" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quotes by region */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cotizaciones por región</CardTitle>
            <CardDescription>Distribución de interés por destinos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quotesByRegion} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                  <YAxis dataKey="region" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} name="Cotizaciones" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion funnel chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Conversión semanal</CardTitle>
          <CardDescription>Confirmadas vs Contactadas por semana (últimos 28 días)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quotesByWeek}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="confirmadas" fill="#22c55e" radius={[4, 4, 0, 0]} name="Confirmadas" />
                <Bar dataKey="contactadas" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Contactadas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-slate-600">Confirmadas (ventas)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-600">Contactadas (sin cierre)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estado de cotizaciones</CardTitle>
            <CardDescription>Distribución por estado actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={quotesByStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="count">
                    {quotesByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {quotesByStatus.map((item) => (
                <div key={item.status} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[item.status] }} />
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-medium ml-auto">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Actividad reciente</CardTitle>
            <CardDescription>Últimas acciones en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${activity.type === 'quote' ? 'bg-indigo-100' : 'bg-green-100'}`}>
                    {activity.type === 'quote' ? (
                      <FileText className="h-4 w-4 text-indigo-600" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">{activity.message}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'indigo' | 'green' | 'amber' | 'purple';
  badge?: string;
  description?: string;
}

function StatCard({ title, value, icon: Icon, color, badge, description }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
            {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
            {badge && (
              <Badge variant="secondary" className="mt-2 text-xs">
                {badge}
              </Badge>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-20 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
