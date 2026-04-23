/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users, 
  MapPin, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Station } from '../../types';
import { formatPercent, cn } from '../../lib/utils';

interface DashboardProps {
  stations: Station[];
  lang: 'ar' | 'en';
}

const StatCard: React.FC<{ 
  title: string; 
  titleAr: string; 
  value: string | number; 
  icon: React.ElementType; 
  color: string;
  lang: 'ar' | 'en';
}> = ({ title, titleAr, value, icon: Icon, color, lang }) => (
  <div className="glass-panel p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={cn("p-2 rounded-lg", color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    <p className={cn("text-slate-400 text-sm font-medium", lang === 'ar' && "arabic")}>
      {lang === 'ar' ? titleAr : title}
    </p>
    <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
  </div>
);

const COLORS = ['#4CAF50', '#FFC107', '#2196F3', '#FF5722', '#9C27B0'];

export const Dashboard: React.FC<DashboardProps> = ({ stations, lang }) => {
  const isAr = lang === 'ar';
  
  const totalStations = stations.length;
  const operationalCount = stations.filter(s => s.status === 'Operational').length;
  const inProgressCount = totalStations - operationalCount;
  const avgCompletion = totalStations === 0 ? 0 : stations.reduce((acc, s) => acc + s.completionPercentage, 0) / totalStations;

  const statusData = [
    { name: isAr ? 'مخطط' : 'Planning', value: stations.filter(s => s.status === 'Planning').length },
    { name: isAr ? 'تصميم' : 'Designing', value: stations.filter(s => s.status === 'Designing').length },
    { name: isAr ? 'بناء' : 'Construction', value: stations.filter(s => s.status === 'Construction').length },
    { name: isAr ? 'نشط' : 'Operational', value: stations.filter(s => s.status === 'Operational').length },
  ].filter(d => d.value > 0);

  const regionData = [
     { name: isAr ? 'الوسطى' : 'Central', count: stations.filter(s => s.region === 'Central').length },
     { name: isAr ? 'الشمالية' : 'North', count: stations.filter(s => s.region === 'North').length },
     { name: isAr ? 'الجنوبية' : 'South', count: stations.filter(s => s.region === 'South').length },
     { name: isAr ? 'الشرقية' : 'East', count: stations.filter(s => s.region === 'East').length },
     { name: isAr ? 'الغربية' : 'West', count: stations.filter(s => s.region === 'West').length },
  ].filter(d => d.count > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Stations" 
          titleAr="إجمالي المحطات" 
          value={totalStations} 
          icon={MapPin} 
          color="bg-brand-primary" 
          lang={lang} 
        />
        <StatCard 
          title="Operational" 
          titleAr="محطات نشطة" 
          value={operationalCount} 
          icon={CheckCircle2} 
          color="bg-emerald-500" 
          lang={lang} 
        />
        <StatCard 
          title="In Progress" 
          titleAr="تحت التنفيذ" 
          value={inProgressCount} 
          icon={Clock} 
          color="bg-amber-500" 
          lang={lang} 
        />
        <StatCard 
          title="Avg Progress" 
          titleAr="متوسط الإنجاز" 
          value={`${Math.round(avgCompletion)}%`} 
          icon={TrendingUp} 
          color="bg-blue-500" 
          lang={lang} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="glass-panel p-6 h-[400px] flex flex-col">
          <h3 className={cn("text-lg font-bold mb-6", isAr && "arabic")}>
            {isAr ? 'توزيع الحالات' : 'Status Distribution'}
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
             {statusData.map((d, i) => (
               <div key={d.name} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                 <span className={cn("text-xs text-slate-500", isAr && "arabic")}>{d.name}: {d.value}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Region Analysis */}
        <div className="glass-panel p-6 h-[400px] flex flex-col">
          <h3 className={cn("text-lg font-bold mb-6", isAr && "arabic")}>
            {isAr ? 'المحطات حسب المنطقة' : 'Stations by Region'}
          </h3>
          <div className="flex-1">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={regionData}>
                 <defs>
                   <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                     <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                 <Tooltip />
                 <Area type="monotone" dataKey="count" stroke="#4CAF50" fillOpacity={1} fill="url(#colorCount)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Mock (Replace with real logs later) */}
      <div className="glass-panel p-6">
         <h3 className={cn("text-lg font-bold mb-6", isAr && "arabic")}>
          {isAr ? 'النشاط الأخير' : 'Recent Activity'}
        </h3>
        <div className="space-y-4">
          {stations.slice(0, 3).map((station) => (
            <div key={station.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  Update to <span className="font-bold text-brand-primary">{station.nameEn}</span>
                </p>
                <p className="text-xs text-slate-400">Progress reached {station.completionPercentage}%</p>
              </div>
              <div className="text-xs text-slate-400">2h ago</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
