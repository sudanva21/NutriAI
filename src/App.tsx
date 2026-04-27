/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, 
  BarChart2, 
  Calendar, 
  User, 
  Plus, 
  Camera,
  Flame,
  Bell
} from "lucide-react";
import { INITIAL_PROFILE, UserProfile, Goal, ActivityLevel, DietType } from "./types";
import { cn } from "./lib/utils";

// Sub-components (to be implemented in detail)
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import Planner from "./components/Planner";
import Profile from "./components/Profile";
import Scanner from "./components/Scanner";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showScanner, setShowScanner] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("nutriai_profile");
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("nutriai_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    // Simulate loading/splash
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleScannerResult = (result: any) => {
    console.log("Scanner Result:", result);
    // In a real app, we would add this to a meal log. 
    // For now, let's just close the scanner and maybe update XP or something to show feedback.
    setShowScanner(false);
    setProfile(prev => ({
      ...prev,
      xp: prev.xp + 50,
      level: Math.floor((prev.xp + 50) / 500) + 1
    }));
    alert(`Identified: ${result.name}\nCalories: ${result.calories}kcal\nProtein: ${result.protein}g`);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-navy">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
            <Flame className="w-12 h-12 text-white" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-dark">NutriAI</h1>
          <p className="text-muted-grey font-medium mt-1">Symmetry in Nutrition</p>
        </motion.div>
      </div>
    );
  }

  if (!profile.onboarded) {
    return <Onboarding onComplete={(p) => setProfile(p)} />;
  }

  return (
    <div className="flex flex-col min-h-screen pb-24 md:pb-0 md:pl-20 bg-navy">
      <AnimatePresence>
        {showScanner && (
          <Scanner 
            onClose={() => setShowScanner(false)} 
            onResult={handleScannerResult} 
          />
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <header className="p-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
             <User className="text-muted-grey w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-grey uppercase tracking-wider">Nutrition Dashboard</p>
            <p className="font-bold text-dark">{profile.name || "Healthy User"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 text-gold border border-gold/20 font-bold text-xs">
            <Flame className="w-3.5 h-3.5" fill="currentColor" />
            <span>{profile.streak} DAY STREAK</span>
          </div>
          <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <Bell className="w-5 h-5 text-muted-grey" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 md:px-8">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && <Dashboard profile={profile} updateProfile={setProfile} />}
          {activeTab === "analytics" && <Analytics profile={profile} />}
          {activeTab === "planner" && <Planner profile={profile} />}
          {activeTab === "profile" && <Profile profile={profile} updateProfile={setProfile} />}
        </AnimatePresence>
      </main>

      {/* Bottom Nav (PWA Style) */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] flex items-center justify-around px-2 z-40 safe-bottom md:top-0 md:bottom-0 md:w-20 md:flex-col md:h-full md:border-r md:border-t-0">
        <NavButton 
          active={activeTab === "dashboard"} 
          icon={<Home className="w-5 h-5" />} 
          label="DASHBOARD" 
          onClick={() => setActiveTab("dashboard")} 
        />
        <NavButton 
          active={activeTab === "analytics"} 
          icon={<BarChart2 className="w-5 h-5" />} 
          label="ANALYTICS" 
          onClick={() => setActiveTab("analytics")} 
        />
        
        <button 
          onClick={() => setShowScanner(true)}
          className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 -mt-8 md:mt-0 transition-all hover:scale-110 active:scale-95 group"
        >
          <Camera className="w-7 h-7 text-white" />
        </button>

        <NavButton 
          active={activeTab === "planner"} 
          icon={<Calendar className="w-5 h-5" />} 
          label="PLANNER" 
          onClick={() => setActiveTab("planner")} 
        />
        <NavButton 
          active={activeTab === "profile"} 
          icon={<User className="w-5 h-5" />} 
          label="PROFILE" 
          onClick={() => setActiveTab("profile")} 
        />
      </nav>
    </div>

  );
}

function NavButton({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 w-16 transition-all duration-300",
        active ? "text-primary opacity-100" : "text-slate-400 opacity-60 hover:opacity-100"
      )}
    >
      <div className={cn(
        "p-2 rounded-lg transition-all",
        active && "bg-primary/10 shadow-sm shadow-primary/5"
      )}>
        {icon}
      </div>
      <span className="text-[8px] font-black tracking-widest uppercase">{label}</span>
    </button>
  );
}
