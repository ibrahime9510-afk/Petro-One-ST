/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Map as MapIcon, 
  Settings, 
  Fuel, 
  LogOut,
  User as UserIcon,
  Bell,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  labelAr: string;
  active: boolean;
  onClick: () => void;
  lang: 'ar' | 'en';
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, labelAr, active, onClick, lang }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group w-full text-left",
      active 
        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    )}
  >
    <Icon className={cn("w-5 h-5", active ? "text-white" : "group-hover:scale-110 transition-transform")} />
    <span className={cn("font-medium", lang === 'ar' && "arabic")}>
      {lang === 'ar' ? labelAr : label}
    </span>
  </button>
);

export const Shell: React.FC<{ 
  children: React.ReactNode, 
  activeTab: string, 
  setActiveTab: (tab: string) => void,
  lang: 'ar' | 'en',
  setLang: (l: 'ar' | 'en') => void
}> = ({ children, activeTab, setActiveTab, lang, setLang }) => {
  const { profile, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard', labelAr: 'لوحة التحكم' },
    { id: 'map', icon: MapIcon, label: 'Station Map', labelAr: 'خريطة المحطات' },
    { id: 'stations', icon: Fuel, label: 'Stations', labelAr: 'المحطات' },
    { id: 'settings', icon: Settings, label: 'Settings', labelAr: 'الإعدادات' },
  ];

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className={cn("min-h-screen flex bg-slate-50", dir === 'rtl' && "flex-row-reverse")} dir={dir}>
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-x border-slate-200 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <Fuel className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">PetroOne</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Station Manager</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              labelAr={item.labelAr}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              lang={lang}
            />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 space-y-4">
          <button 
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-primary transition-colors arabic w-full"
          >
            {lang === 'ar' ? 'English' : 'العربية'}
          </button>
          
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{profile?.displayName}</p>
              <p className="text-xs text-slate-400 capitalize">{profile?.role}</p>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4 lg:hidden">
             <button onClick={() => setIsMobileMenuOpen(true)}>
               <Menu className="w-6 h-6 text-slate-600" />
             </button>
             <span className="font-bold text-brand-primary">PetroOne</span>
          </div>

          <div className="hidden lg:block">
            <h2 className={cn("text-lg font-bold text-slate-900", lang === 'ar' && "arabic")}>
              {menuItems.find(i => i.id === activeTab)?.[lang === 'ar' ? 'labelAr' : 'label']}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-brand-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: lang === 'ar' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: lang === 'ar' ? '100%' : '-100%' }}
              className={cn(
                "fixed inset-y-0 w-72 bg-white z-50 p-6 flex flex-col lg:hidden shadow-2xl",
                lang === 'ar' ? "right-0" : "left-0"
              )}
            >
              {/* Similar sidebar content but for mobile */}
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                    <Fuel className="text-white w-5 h-5" />
                  </div>
                  <span className="font-bold">PetroOne</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              
              <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                  <NavItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    labelAr={item.labelAr}
                    active={activeTab === item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    lang={lang}
                  />
                ))}
              </nav>

              <div className="pt-6 border-t border-slate-100">
                 <button 
                  onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                  className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 arabic mb-4"
                >
                  {lang === 'ar' ? 'English' : 'العربية'}
                </button>
                <div className="flex items-center gap-3 px-2" onClick={logout}>
                   <LogOut className="w-5 h-5 text-slate-400" />
                   <span className="text-sm font-medium">Log out</span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
