import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { Goal, DietType, ActivityLevel, UserProfile, INITIAL_PROFILE } from "../types";
import { cn } from "../lib/utils";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const STEPS = [
  { id: "name", title: "What's your name?", subtitle: "Personalize your nutrition journey" },
  { id: "goal", title: "What's your goal?", subtitle: "We'll tailor your plan to this" },
  { id: "diet", title: "Any diet preference?", subtitle: "Choose what suits you best" },
  { id: "body", title: "Tell us about yourself", subtitle: "To calculate your calorie needs" },
  { id: "complete", title: "You're all set!", subtitle: "Generating your personalized plan..." },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);

  const nextStep = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete({ ...profile, onboarded: true });
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-16 flex flex-col justify-between">
      <div className="flex-1 max-w-lg mx-auto w-full">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-16">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 flex-1 rounded bg-slate-200 overflow-hidden",
                i <= step && "bg-slate-300"
              )}
            >
              <motion.div 
                className="h-full bg-indigo-600 rounded"
                initial={{ width: 0 }}
                animate={{ width: i <= step ? "100%" : "0%" }}
              />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="flex flex-col gap-3"
          >
            <h2 className="text-4xl font-black text-dark tracking-tighter uppercase leading-none">{STEPS[step].title}</h2>
            <p className="text-[10px] font-black text-muted-grey uppercase tracking-widest mb-10">{STEPS[step].subtitle}</p>

            {step === 0 && (
              <input
                type="text"
                autoFocus
                placeholder="INPUT IDENTITY"
                className="w-full bg-white border border-slate-200 rounded-lg p-6 text-xl font-black tracking-tight text-dark focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all placeholder:text-slate-300"
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && profile.name.trim() && nextStep()}
              />
            )}

            {step === 1 && (
              <div className="grid gap-3">
                {Object.values(Goal).map((g) => (
                  <button
                    key={g}
                    onClick={() => updateProfile({ goal: g as Goal })}
                    className={cn(
                      "w-full p-6 rounded-lg flex items-center justify-between border-2 transition-all font-black text-xs uppercase tracking-widest",
                      profile.goal === g 
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" 
                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                    )}
                  >
                    <span>{g.replace("_", " ")} ACTIVATION</span>
                    {profile.goal === g && <Check className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-3">
                {Object.values(DietType).map((d) => (
                  <button
                    key={d}
                    onClick={() => updateProfile({ dietType: d as DietType })}
                    className={cn(
                      "w-full p-6 rounded-lg flex items-center justify-between border-2 transition-all font-black text-xs uppercase tracking-widest",
                      profile.dietType === d 
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" 
                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                    )}
                  >
                    <span>{d} PROTOCOL</span>
                    {profile.dietType === d && <Check className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-muted-grey uppercase tracking-widest">CURRENT MASS (KG)</label>
                  <input
                    type="number"
                    className="w-full bg-white border border-slate-200 rounded-lg p-5 text-2xl font-black tracking-tight text-dark"
                    value={profile.currentWeight}
                    onChange={(e) => updateProfile({ currentWeight: Number(e.target.value) })}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-muted-grey uppercase tracking-widest">TARGET MASS (KG)</label>
                  <input
                    type="number"
                    className="w-full bg-white border border-slate-200 rounded-lg p-5 text-2xl font-black tracking-tight text-dark"
                    value={profile.targetWeight}
                    onChange={(e) => updateProfile({ targetWeight: Number(e.target.value) })}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-muted-grey uppercase tracking-widest">ALTITUDE (CM)</label>
                  <input
                    type="number"
                    className="w-full bg-white border border-slate-200 rounded-lg p-5 text-2xl font-black tracking-tight text-dark"
                    value={profile.height}
                    onChange={(e) => updateProfile({ height: Number(e.target.value) })}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col items-center py-12">
                <div className="w-20 h-20 border-8 border-indigo-600 border-t-slate-200 rounded-lg animate-spin mb-10 shadow-xl shadow-indigo-100" />
                <p className="text-center text-[10px] font-black text-muted-grey uppercase tracking-widest leading-relaxed max-w-[280px]">
                  Calculating metabolic requirements and designing nutrient distribution for your <span className="text-indigo-600"> {profile.goal.replace("_", " ")} </span> trajectory.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-12 max-w-lg mx-auto w-full">
        <button
          disabled={step === 0 && !profile.name.trim()}
          onClick={nextStep}
          className="w-full h-20 bg-indigo-600 rounded-lg flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest text-white shadow-2xl shadow-indigo-200 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
        >
          {step === STEPS.length - 1 ? "INITIALIZE SYSTEM" : "PROCEED"}
          <ArrowRight className="w-5 h-5 translate-y-[-1px]" />
        </button>
      </div>
    </div>
  );
}
