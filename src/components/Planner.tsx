import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  RotateCw, 
  ChevronRight, 
  Clock, 
  UtensilsCrossed, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { UserProfile, Meal, MealType } from "../types";
import { generateMealPlan } from "../services/geminiService";
import { cn } from "../lib/utils";

interface PlannerProps {
  profile: UserProfile;
}

export default function Planner({ profile }: PlannerProps) {
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<Meal[] | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await generateMealPlan(profile);
      if (result && result.meals) {
        setPlan(result.meals.map((m: any, i: number) => ({
          ...m,
          id: `ai-${Date.now()}-${i}`,
          eaten: false
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 space-y-10 px-1"
    >
      <header className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-dark tracking-tighter uppercase">Algorithm Planner</h2>
          <p className="text-[10px] font-black text-muted-grey uppercase tracking-widest mt-1">Generated for ${profile.goal.replace("_", " ")} logic</p>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={generating}
          className="w-14 h-14 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {generating ? <RotateCw className="w-7 h-7 animate-spin" /> : <Sparkles className="w-7 h-7" />}
        </button>
      </header>

      {/* AI Generating State */}
      <AnimatePresence>
        {generating && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center p-16 geometric-card bg-white text-center border-indigo-200 shadow-xl shadow-indigo-50"
          >
            <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center mb-8 relative">
               <Sparkles className="w-10 h-10 text-primary animate-pulse" />
               <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 rounded-sm animate-bounce" />
            </div>
            <h3 className="text-xl font-black text-dark tracking-tight mb-2">SYNTHESIZING PARAMS</h3>
            <p className="text-xs font-bold text-muted-grey uppercase tracking-widest leading-relaxed max-w-[260px]">Executing nutrition logic engine for optimum calorie window...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!generating && !plan && (
        <div className="flex flex-col items-center justify-center p-16 geometric-card bg-white text-center border-slate-200 shadow-sm border-dashed">
          <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center mb-8">
             <UtensilsCrossed className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-black text-dark tracking-tight mb-2">EMPTY MANIFEST</h3>
          <p className="text-xs font-bold text-muted-grey uppercase tracking-widest leading-relaxed mb-10 max-w-[260px]">No meal plan records detected in current active local storage.</p>
          <button 
            onClick={handleGenerate}
            className="px-10 py-4 bg-indigo-600 text-white rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all active:translate-y-0"
          >
            <Sparkles className="w-4 h-4" />
            GENERATE DAILY SYNC
          </button>
        </div>
      )}

      {/* Actual Plan */}
      {!generating && plan && (
        <div className="space-y-8">
          <div className="p-5 bg-amber-50 border border-amber-100 rounded-lg flex gap-4 items-center shadow-sm">
            <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
            <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest leading-tight">Syncing ${profile.caloriesTarget} target kcal with active metabolic parameters...</p>
          </div>

          <div className="grid gap-6">
            {plan.map((meal) => (
              <motion.div 
                key={meal.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="geometric-card bg-white overflow-hidden group hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="p-6 flex gap-6">
                  <div className="w-20 h-20 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <MealIcon type={meal.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{meal.type} SLOT</span>
                       <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{meal.prepTime || 15} MIN PREP</span>
                      </div>
                    </div>
                    <h4 className="font-black text-lg text-dark tracking-tight mb-3 truncate pr-4">{meal.name}</h4>
                    
                    <div className="flex flex-wrap gap-2">
                       <div className="px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-black text-slate-500 uppercase tracking-tighter leading-none">{meal.calories} KCAL</div>
                       <div className="px-2.5 py-1.5 bg-indigo-50 border border-indigo-100 rounded text-[9px] font-black text-indigo-600 uppercase tracking-tighter leading-none">P: {meal.protein}G</div>
                       <div className="px-2.5 py-1.5 bg-amber-50 border border-amber-100 rounded text-[9px] font-black text-amber-600 uppercase tracking-tighter leading-none">C: {meal.carbs}G</div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex gap-2 h-2 items-center">
                      <div className="w-2 h-2 rounded-sm bg-indigo-600" />
                      <div className="w-2 h-2 rounded-sm bg-slate-300" />
                      <div className="w-2 h-2 rounded-sm bg-slate-300" />
                   </div>
                   <span className="text-[9px] font-black text-muted-grey uppercase tracking-widest">{meal.ingredients?.length || 0} ITEMS IN MANIFEST</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function MealIcon({ type }: { type: MealType }) {
  // Simple representation
  return <div className="text-xl">
    {type === MealType.BREAKFAST && "🍳"}
    {type === MealType.LUNCH && "🥗"}
    {type === MealType.DINNER && "🥩"}
    {type === MealType.SNACK && "🍎"}
  </div>;
}
