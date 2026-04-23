/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink, 
  MapPin, 
  CheckCircle2, 
  Clock,
  History,
  LayoutGrid,
  List as ListIcon,
  TrendingUp
} from 'lucide-react';
import { Station } from '../../types';
import { cn, formatDate } from '../../lib/utils';

interface StationListProps {
  stations: Station[];
  lang: 'ar' | 'en';
  onEdit: (s: Station) => void;
  onAdd: () => void;
}

export const StationList: React.FC<StationListProps> = ({ stations, lang, onEdit, onAdd }) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [search, setSearch] = useState("");
  const isAr = lang === 'ar';

  const filtered = stations.filter(s => 
    s.nameEn.toLowerCase().includes(search.toLowerCase()) || 
    s.nameAr.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder={isAr ? "ابحث عن محطة..." : "Search stations..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all shadow-sm outline-none",
                isAr && "arabic pr-10 pl-4"
              )}
            />
         </div>

         <div className="flex items-center gap-3">
            <div className="flex bg-slate-200/50 p-1 rounded-xl">
               <button 
                 onClick={() => setViewMode('list')}
                 className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white shadow-sm text-brand-primary" : "text-slate-400")}
               >
                 <ListIcon className="w-5 h-5" />
               </button>
               <button 
                 onClick={() => setViewMode('grid')}
                 className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white shadow-sm text-brand-primary" : "text-slate-400")}
               >
                 <LayoutGrid className="w-5 h-5" />
               </button>
            </div>
            
            <button 
              onClick={onAdd}
              className="bg-brand-primary text-white rounded-xl px-6 py-3 font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              {isAr ? 'إضافة محطة' : 'Add Station'}
            </button>
         </div>
      </div>

      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-3"
      )}>
        {filtered.map(station => (
          <div 
            key={station.id} 
            onClick={() => onEdit(station)}
            className={cn(
              "glass-panel p-5 hover:border-brand-primary/50 transition-all cursor-pointer group",
              viewMode === 'list' ? "flex items-center gap-6" : "flex flex-col"
            )}
          >
            {/* Status Indicator */}
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
              station.status === 'Operational' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            )}>
               {station.status === 'Operational' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
            </div>

            <div className="flex-1 min-w-0">
               <div className="flex items-center justify-between mb-1">
                 <h3 className={cn("font-bold text-slate-900 truncate text-lg", isAr && "arabic")}>
                   {isAr ? station.nameAr : station.nameEn}
                 </h3>
                 <span className={cn(
                   "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                   station.status === 'Operational' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : station.status === 'Construction'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-600'
                 )}>
                   {station.status}
                 </span>
               </div>
               
               <p className={cn("text-xs text-slate-500 mb-2", isAr && "arabic")}>
                 {isAr ? 'المالك: ' : 'Owner: '}
                 <span className="font-semibold text-slate-700">{station.owner || '-'}</span>
               </p>

               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                   <MapPin className="w-3 h-3" />
                   {station.region}
                 </div>
                 <div className="flex items-center gap-1 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                   <TrendingUp className="w-3 h-3 text-brand-primary" />
                   {isAr ? 'نسبة الإنجاز: ' : 'Progress: '}
                   <span className="text-slate-900">{station.completionPercentage}%</span>
                 </div>
               </div>
            </div>

            {/* Progress Bar for List View */}
            {viewMode === 'list' && (
              <div className="hidden sm:block w-48">
                 <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${station.completionPercentage}%` }}
                    className="h-full bg-brand-primary" 
                   />
                 </div>
              </div>
            )}

            <div className="flex items-center gap-2 sm:ml-auto">
               <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-slate-50 rounded-lg">
                 <MoreVertical className="w-5 h-5" />
               </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400">
            <p className={isAr ? "arabic" : ""}>
               {isAr ? 'لم يتم العثور على محطات' : 'No stations found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
