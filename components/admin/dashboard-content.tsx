'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import {
  FileText, MessageSquare, Plane, TrendingUp, CheckCircle2, PhoneCall,
  ArrowRight, Percent, Clock, Phone, XCircle, CheckCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  conversionRate: number;
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

interface ActivityItem {
  type: string;
  status?: string;
  message: string;
  time: string;
  id?: string;
}

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];
const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  contacted: '#3b82f6',
  quoted: '#8b5cf6',
  confirmed: '#22c55e',
  cancelled: '#ef4444',
};

const ACTIVITY_ICONS: Record<string, { icon: React.ComponentType<{ className?: string }>; bg: string; fg: string }> = {
  pending: { icon: Clock, bg: 'bg-amber-100', fg: 'text-amber-600' },
  contacted: { icon: Phone, bg: 'bg-blue-100', fg: 'text-blue-600' },
  quoted: { icon: FileText, bg: 'bg-purple-100', fg: 'text-purple-600' },
  confirmed: { icon: CheckCircle, bg: 'bg-green-100', fg: 'text-green-600' },
  cancelled: { icon: XCircle, bg: 'bg-red-100', fg: 'text-red-600' },
  new: { icon: MessageSquare, bg: 'bg-emerald-100', fg: 'text-emerald-600' },
};

export function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [quotesByWeek, setQuotesByWeek] = useState<QuotesByWeek[]>([]);
  const [quotesByRegion, setQuotesByRegion] = useState<QuotesByRegion[]>([]);
  const [quotesByStatus, setQuotesByStatus] = useState<QuotesByStatus[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
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
        setQuotesByRegion(data.quotesByRegion || []);
        setQuotesByStatus(data.quotesByStatus || []);
        setRecentActivity(data.recentActivity || []);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Resumen de actividad · {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}</p>
        </div>
      </div>

      {/* Quick actions */}
      {((stats?.pendingQuotes ?? 0) > 0 || (stats?.unreadMessages ?? 0) > 0) && (
        <div className="flex flex-wrap gap-3">
          {(stats?.pendingQuotes ?? 0) > 0 && (
            <Link href="/admin/cotizaciones?status=pending">
              <Button variant="outline" size="sm" className="text-amber-700 border-amber-300 hover:bg-amber-50">
                <Clock className="h-4 w-4 mr-2" />
                {stats?.pendingQuotes} cotizaciones pendientes
                <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </Link>
          )}
          {(stats?.unreadMessages ?? 0) > 0 && (
            <Link href="/admin/mensajes?read=false">
              <Button variant="outline" size="sm" className="text-indigo-700 border-indigo-300 hover:bg-indigo-50">
                <MessageSquare className="h-4 w-4 mr-2" />
                {stats?.unreadMessages} mensajes sin leer
                <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Viajes activos" value={stats?.totalTrips || 0} icon={Plane} color="blue" />
        <StatCard
          title="Cotizaciones totales"
          value={stats?.totalQuotes || 0}
          icon={FileText}
          color="indigo"
          badge={stats?.pendingQuotes ? `${stats.pendingQuotes} pendientes` : undefined}
        />
        <StatCard
          title="Mensajes"
          value={stats?.totalMessages || 0}
          icon={MessageSquare}
          color="purple"
          badge={stats?.unreadMessages ? `${stats.unreadMessages} sin leer` : undefined}
        />
        <StatCard title="Esta semana" value={stats?.quotesThisWeek || 0} icon={TrendingUp} color="amber" description="cotizaciones" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <p className="text-sm font-medium text-blue-700">En seguimiento</p>
                <p className="text-4xl font-bold text-blue-900 mt-1">{stats?.contactedNotClosed || 0}</p>
                <p className="text-sm text-blue-600 mt-2">Contactadas sin cierre</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <PhoneCall className="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-violet-700">Tasa de conversión</p>
                <p className="text-4xl font-bold text-violet-900 mt-1">{stats?.conversionRate || 0}%</p>
                <p className="text-sm text-violet-600 mt-2">Confirmadas / Total</p>
              </div>
              <div className="p-3 rounded-xl bg-violet-100">
                <Percent className="h-7 w-7 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actividad últimas 4 semanas</CardTitle>
            <CardDescription>Cotizaciones y mensajes por semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {quotesByWeek.length > 0 ? (
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
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="cotizaciones" stroke="#6366f1" fillOpacity={1} fill="url(#colorCotizaciones)" name="Cotizaciones" />
                    <Area type="monotone" dataKey="mensajes" stroke="#22c55e" fillOpacity={1} fill="url(#colorMensajes)" name="Mensajes" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <p>No hay datos de actividad todavía</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cotizaciones por región</CardTitle>
            <CardDescription>Distribución de interés por destinos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {quotesByRegion.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={quotesByRegion} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                    <YAxis dataKey="region" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} name="Cotizaciones" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <p>No hay datos de regiones todavía</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion funnel */}
      {quotesByWeek.length > 0 && (
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
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
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
      )}

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estado de cotizaciones</CardTitle>
            <CardDescription>Distribución por estado actual</CardDescription>
          </CardHeader>
          <CardContent>
            {quotesByStatus.some(s => s.count > 0) ? (
              <>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={quotesByStatus.filter(s => s.count > 0)} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="count">
                        {quotesByStatus.filter(s => s.count > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
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
              </>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-slate-400">
                <p>No hay cotizaciones todavía</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Actividad reciente</CardTitle>
              <CardDescription>Últimas cotizaciones y mensajes</CardDescription>
            </div>
            <Link href="/admin/cotizaciones">
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                Ver todo
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const activityStyle = ACTIVITY_ICONS[activity.status || activity.type] || ACTIVITY_ICONS.pending;
                  const ActivityIcon = activityStyle.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${activityStyle.bg}`}>
                        <ActivityIcon className={`h-4 w-4 ${activityStyle.fg}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 line-clamp-1">{activity.message}</p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                      {activity.type === 'quote' && activity.id && (
                        <Link href="/admin/cotizaciones" className="text-xs text-indigo-600 hover:underline whitespace-nowrap">
                          Ver
                        </Link>
                      )}
                      {activity.type === 'message' && activity.id && (
                        <Link href="/admin/mensajes" className="text-xs text-indigo-600 hover:underline whitespace-nowrap">
                          Ver
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400">
                <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                <p>No hay actividad reciente</p>
                <p className="text-xs mt-1">Las cotizaciones y mensajes nuevos aparecerán aquí</p>
              </div>
            )}
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
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
