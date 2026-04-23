/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Fuel, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

export const LoginPage: React.FC<{ lang: 'ar' | 'en' }> = ({ lang }) => {
  const { login } = useAuth();
  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl animate-pulse delay-700" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel max-w-md w-full p-10 relative z-10 flex flex-col items-center text-center"
      >
        <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center shadow-xl shadow-brand-primary/20 mb-8">
          <Fuel className="text-white w-10 h-10" />
        </div>

        <h1 className={cn("text-3xl font-extrabold text-slate-900 tracking-tight mb-2", isAr && "arabic")}>
          {isAr ? 'بترو ون' : 'PetroOne'}
        </h1>
        <p className={cn("text-slate-500 mb-10", isAr && "arabic")}>
          {isAr ? 'نظام إدارة محطات الوقود المتكامل' : 'Comprehensive Gas Station Management System'}
        </p>

        <button
          onClick={login}
          className="group relative w-full flex items-center justify-between bg-slate-900 text-white p-4 rounded-xl font-bold transition-all hover:bg-slate-800 hover:shadow-xl active:scale-95"
        >
          <div className="flex items-center gap-4">
             <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
               <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
             </div>
             <span className={cn(isAr && "arabic")}>
               {isAr ? 'تسجيل الدخول باستخدام جوجل' : 'Sign in with Google'}
             </span>
          </div>
          <ArrowRight className={cn("w-5 h-5 transition-transform group-hover:translate-x-1", isAr && "rotate-180")} />
        </button>

        <p className={cn("mt-8 text-xs text-slate-400 font-medium uppercase tracking-widest", isAr && "arabic")}>
          {isAr ? 'الوصول مصرح للموظفين فقط' : 'Authorized Personnel Only'}
        </p>
      </motion.div>
    </div>
  );
};
