import React from "react";
import { motion } from "motion/react";
import { 
  Settings, 
  ChevronRight, 
  LogOut, 
  ShieldCheck, 
  Bell, 
  HelpCircle,
  Trophy,
  History,
  Target
} from "lucide-react";
import { UserProfile } from "../types";
import { cn } from "../lib/utils";

interface ProfileProps {
  profile: UserProfile;
  updateProfile: (p: UserProfile) => void;
}

export default function Profile({ profile, updateProfile }: ProfileProps) {
  const levelProgress = (profile.xp % 500) / 500 * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 space-y-10"
    >
      <header className="flex items-center justify-between border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-black text-dark tracking-tighter uppercase">IDENTITY PROFILE</h2>
        <button className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
          <Settings className="w-5 h-5 text-slate-500" />
        </button>
      </header>

      {/* User Status Card */}
      <section className="p-8 geometric-card bg-white flex flex-col items-center text-center">
        <div className="w-32 h-32 rounded-lg p-1.5 bg-indigo-600 mb-6 flex items-center justify-center shrink-0 shadow-xl shadow-indigo-100">
           <div className="w-full h-full rounded bg-white flex items-center justify-center overflow-hidden border border-indigo-100">
             <span className="text-4xl font-black text-indigo-600 tracking-tighter">{profile.name[0]?.toUpperCase() || "H"}</span>
           </div>
        </div>
        <h3 className="text-2xl font-black text-dark tracking-tight leading-none mb-2">{profile.name}</h3>
        <p className="text-[10px] font-black text-muted-grey uppercase tracking-widest">{profile.goal.replace("_", " ")} SPECIALIST</p>
        
        <div className="w-full space-y-4 mt-8 pt-8 border-t border-slate-100">
           <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">GEOMETRIC LVL {profile.level}</span>
              <span className="text-[9px] font-black text-muted-grey uppercase tracking-widest leading-none">{profile.xp % 500} / 500 XP CACHE</span>
           </div>
           <div className="h-3 bg-slate-100 rounded border border-slate-200/50 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                className="h-full bg-indigo-600 rounded-lg shadow-sm" 
              />
           </div>
        </div>
      </section>

      {/* Gamification Stats */}
      <section className="grid grid-cols-2 gap-6">
        <StatItem 
          icon={<Trophy className="w-5 h-5 text-amber-500" />} 
          label="MANIFEST REWARDS" 
          value="12" 
        />
        <StatItem 
          icon={<History className="w-5 h-5 text-rose-500" />} 
          label="SYNC CYCLES" 
          value="154" 
        />
      </section>

      {/* Settings List */}
      <section className="space-y-4">
        <h4 className="text-[10px] font-black text-muted-grey uppercase tracking-widest pl-2">System Parameters</h4>
        
        <div className="geometric-card bg-white divide-y divide-slate-100 overflow-hidden">
           <SettingRow icon={<Target className="text-indigo-600" />} label="Metric Parameters" subLabel="TDEE, Macros, Goal Weights" />
           <SettingRow icon={<Bell className="text-amber-500" />} label="Algorithm Nudges" subLabel="Meal Reminders & Sync Alerts" />
           <SettingRow icon={<ShieldCheck className="text-rose-500" />} label="Security & Log Export" subLabel="Privacy, Cache, Data Backup" />
        </div>
      </section>

      <button 
        onClick={() => {
          localStorage.removeItem("nutriai_profile");
          window.location.reload();
        }}
        className="w-full p-6 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 font-black text-xs uppercase tracking-widest flex items-center justify-between group active:scale-[0.99] transition-transform"
      >
        <div className="flex items-center gap-3">
          <LogOut className="w-5 h-5" />
          <span>TERMINATE SESSION</span>
        </div>
        <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
      </button>
    </motion.div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm flex flex-col gap-4">
      <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg self-start">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-muted-grey uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-dark tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function SettingRow({ icon, label, subLabel }: { icon: React.ReactNode, label: string, subLabel: string }) {
  return (
    <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
      <div className="flex items-center gap-5">
        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
          {icon}
        </div>
        <div>
          <p className="font-black text-sm tracking-tight text-dark uppercase">{label}</p>
          <p className="text-[9px] font-bold text-muted-grey tracking-widest uppercase mt-0.5">{subLabel}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-all" />
    </div>
  );
}
