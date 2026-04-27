import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Flame, 
  ChevronRight, 
  Plus, 
  Brain,
  Lightbulb,
  CheckCircle2,
  Circle
} from "lucide-react";
import { UserProfile, Meal, MealType } from "../types";
import { cn } from "../lib/utils";

interface DashboardProps {
  profile: UserProfile;
  updateProfile: (p: UserProfile) => void;
}

export default function Dashboard({ profile, updateProfile }: DashboardProps) {
  // Mock meals for now, in real app these would come from local storage or AI
  const [meals, setMeals] = useState<Meal[]>([
    { id: "1", name: "Greek Yogurt with Berries", calories: 350, protein: 25, carbs: 40, fat: 10, type: MealType.BREAKFAST, eaten: true },
    { id: "2", name: "Grilled Chicken Salad", calories: 550, protein: 50, carbs: 15, fat: 30, type: MealType.LUNCH, eaten: false },
    { id: "3", name: "Salmon with Quinoa", calories: 650, protein: 45, carbs: 50, fat: 25, type: MealType.DINNER, eaten: false },
    { id: "4", name: "Protein Shake", calories: 250, protein: 30, carbs: 5, fat: 5, type: MealType.SNACK, eaten: false },
  ]);

  const consumed = meals.filter(m => m.eaten).reduce((acc, m) => acc + m.calories, 0);
  const remaining = profile.caloriesTarget - consumed;
  const progress = Math.min((consumed / profile.caloriesTarget) * 100, 100);

  const toggleMeal = (id: string) => {
    setMeals(prev => prev.map(m => m.id === id ? { ...m, eaten: !m.eaten } : m));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-8 space-y-10"
    >
      {/* Calorie Ring Section */}
      <section className="flex flex-col items-center py-8 geometric-card bg-white mx-2">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="110"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="12"
            />
            <motion.circle
              cx="128"
              cy="128"
              r="110"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 110}
              initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 110 * (1 - progress / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-6xl font-black text-dark tracking-tighter">{remaining}</span>
            <span className="text-muted-grey text-[10px] font-black tracking-widest uppercase mt-1">KCAL REMAINING</span>
          </div>
        </div>
        
        {/* Macro Strips */}
        <div className="grid grid-cols-3 gap-8 w-full px-8 mt-10">
           <MacroStat label="Protein" current={120} target={profile.proteinTarget} color="bg-primary" />
           <MacroStat label="Carbs" current={150} target={profile.carbsTarget} color="bg-gold" />
           <MacroStat label="Fats" current={45} target={profile.fatTarget} color="bg-accent" />
        </div>
      </section>

      {/* AI Suggestion Card */}
      <section>
        <div className="bg-indigo-50 border border-indigo-100 rounded-card p-6 flex gap-5 items-center shadow-sm">
          <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-md shadow-indigo-200">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
               <span className="text-[10px] font-black text-indigo-600 tracking-widest uppercase">SYMMETRY INSIGHT</span>
               <div className="w-1 h-1 rounded-full bg-indigo-300" />
               <span className="text-[9px] font-bold text-muted-grey uppercase">Recommended</span>
            </div>
            <p className="text-sm font-bold text-slate-700 leading-tight">
              Optimize your protein logic: Grilled salmon is 12% more efficient for your current metabolic window.
            </p>
          </div>
        </div>
      </section>

      {/* Meals List */}
      <section className="space-y-5 px-1">
        <div className="flex items-end justify-between border-b border-slate-200 pb-2">
          <div>
            <h3 className="text-xl font-black text-dark tracking-tight">Active Plan</h3>
            <p className="text-[10px] font-bold text-muted-grey uppercase tracking-widest">Today's Daily Log</p>
          </div>
          <button className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
            SYNC PLAN <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        
        <div className="grid gap-4">
          {meals.map((meal) => (
            <MealCard 
              key={meal.id} 
              meal={meal} 
              onToggle={() => toggleMeal(meal.id)} 
            />
          ))}
        </div>
      </section>
    </motion.div>
  );
}

function MacroStat({ label, current, target, color }: { label: string, current: number, target: number, color: string }) {
  const percent = Math.min((current/target)*100, 100);
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-grey">{label}</span>
        <span className="text-xs font-black text-dark tracking-tighter">{current}<span className="text-[9px] opacity-40 ml-0.5">/{target}G</span></span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-sm overflow-hidden border border-slate-200/50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          className={cn("h-full rounded-sm", color)} 
        />
      </div>
    </div>
  );
}

const MealCard: React.FC<{ meal: Meal; onToggle: () => void }> = ({ meal, onToggle }) => {
  return (
    <div 
      onClick={onToggle}
      className={cn(
        "group p-5 geometric-card transition-all duration-300 cursor-pointer flex items-center gap-5",
        meal.eaten 
          ? "bg-slate-50 border-slate-200 opacity-60" 
          : "bg-white hover:border-primary/30 hover:shadow-md"
      )}
    >
      <div className={cn(
        "w-14 h-14 rounded-lg flex items-center justify-center border transition-all",
        meal.eaten 
          ? "bg-slate-100 border-slate-200 text-slate-400" 
          : "bg-indigo-50 border-indigo-100 text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary"
      )}>
        {meal.eaten ? <CheckCircle2 className="w-6 h-6" /> : <div className="w-6 h-6 rounded-md border-2 border-current bg-white" />}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
           <span className="text-[9px] font-black text-muted-grey uppercase tracking-widest">{meal.type}</span>
           {meal.eaten && <span className="text-[9px] font-black text-primary uppercase tracking-wider">SYNCED</span>}
        </div>
        <h4 className="font-bold text-dark tracking-tight">{meal.name}</h4>
        <div className="flex items-center gap-4 mt-1.5">
          <span className="text-xs text-muted-grey font-bold tracking-tighter">{meal.calories} KCAL</span>
          <div className="flex gap-1.5">
            <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-black">P: {meal.protein}G</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-black">C: {meal.carbs}G</span>
          </div>
        </div>
      </div>
    </div>
  );
};
