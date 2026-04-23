/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Save, Trash2, Camera, FileText } from 'lucide-react';
import { Station } from '../../types';
import { cn } from '../../lib/utils';

interface StationFormProps {
  station?: Partial<Station>;
  onClose: () => void;
  onSave: (s: Partial<Station>) => void;
  onDelete?: (id: string) => void;
  lang: 'ar' | 'en';
}

export const StationForm: React.FC<StationFormProps> = ({ station, onClose, onSave, onDelete, lang }) => {
  const [formData, setFormData] = useState<Partial<Station>>(station || {
    nameAr: '',
    nameEn: '',
    latitude: 24.7136,
    longitude: 46.6753,
    region: 'Central',
    status: 'Planning',
    completionPercentage: 0
  });

  const isAr = lang === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
       <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
             <h3 className={cn("text-xl font-bold", isAr && "arabic")}>
               {station?.id ? (isAr ? 'تعديل محطة' : 'Edit Station') : (isAr ? 'إضافة محطة جديدة' : 'Add New Station')}
             </h3>
             <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
               <X className="w-5 h-5 text-slate-400" />
             </button>
          </div>

          <div className="p-8 overflow-y-auto space-y-8">
             {/* Names & Owner */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Name (Arabic)</label>
                   <input 
                    type="text" 
                    value={formData.nameAr}
                    onChange={e => setFormData({...formData, nameAr: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none arabic"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Name (English)</label>
                   <input 
                    type="text" 
                    value={formData.nameEn}
                    onChange={e => setFormData({...formData, nameEn: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none"
                   />
                </div>
                <div className="space-y-2 md:col-span-2">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Owner / المالك</label>
                   <input 
                    type="text" 
                    value={formData.owner}
                    onChange={e => setFormData({...formData, owner: e.target.value})}
                    placeholder={isAr ? "اسم المالك" : "Owner name"}
                    className={cn("w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none", isAr && "arabic")}
                   />
                </div>
             </div>

             {/* Location */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Region</label>
                   <select 
                    value={formData.region}
                    onChange={e => setFormData({...formData, region: e.target.value as any})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none"
                   >
                      <option value="Central">Central</option>
                      <option value="North">North</option>
                      <option value="South">South</option>
                      <option value="East">East</option>
                      <option value="West">West</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Latitude</label>
                   <input 
                    type="number" 
                    step="any"
                    value={formData.latitude}
                    onChange={e => setFormData({...formData, latitude: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Longitude</label>
                   <input 
                    type="number" 
                    step="any"
                    value={formData.longitude}
                    onChange={e => setFormData({...formData, longitude: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                   />
                </div>
             </div>

             {/* Progress */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <div className="space-y-4">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Phase & Status</label>
                   <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none"
                   >
                      <option value="Planning">Planning</option>
                      <option value="Designing">Designing</option>
                      <option value="Construction">Construction</option>
                      <option value="Operational">Operational</option>
                      <option value="Expansion">Expansion</option>
                   </select>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completion</label>
                     <span className="text-lg font-bold text-brand-primary">{formData.completionPercentage}%</span>
                   </div>
                   <input 
                    type="range" 
                    min="0" 
                    max="100"
                    value={formData.completionPercentage}
                    onChange={e => setFormData({...formData, completionPercentage: parseInt(e.target.value)})}
                    className="w-full h-2 bg-brand-primary/10 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                   />
                </div>
             </div>

             {/* Documents & Licenses */}
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Licenses & Documents</label>
                   <button className="text-xs font-bold text-brand-primary flex items-center gap-1 hover:underline">
                      <Plus className="w-3 h-3" /> Add Document
                   </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="p-4 border border-dashed border-slate-200 rounded-2xl flex items-center gap-4 bg-slate-50/30">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                         <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-sm font-bold truncate">Engineering Plan.pdf</p>
                         <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Uploaded Feb 10, 2024</p>
                      </div>
                   </div>
                   <div className="p-4 border border-dashed border-slate-200 rounded-2xl flex items-center gap-4 bg-slate-50/30">
                      <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                         <Camera className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-sm font-bold truncate">Site Photo - Front.jpg</p>
                         <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Uploaded Feb 12, 2024</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
             {station?.id ? (
               <button 
                onClick={() => onDelete?.(station.id!)}
                className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors font-semibold flex items-center gap-2"
               >
                 <Trash2 className="w-4 h-4" />
                 Delete
               </button>
             ) : <div />}

             <div className="flex items-center gap-3">
                <button 
                  onClick={onClose}
                  className="px-6 py-3 text-slate-500 font-bold hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => onSave(formData)}
                  className="bg-brand-primary text-white rounded-xl px-10 py-3 font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};
