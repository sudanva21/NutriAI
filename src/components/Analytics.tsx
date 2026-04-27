import React from "react";
import { motion } from "motion/react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { UserProfile } from "../types";
import { TrendingUp, Target, Scale } from "lucide-react";

interface AnalyticsProps {
  profile: UserProfile;
}

const WEEKLY_DATA = [
  { name: "Mon", kcal: 1850, protein: 140, carbs: 180, fat: 55 },
  { name: "Tue", kcal: 2100, protein: 160, carbs: 210, fat: 65 },
  { name: "Wed", kcal: 1950, protein: 155, carbs: 190, fat: 60 },
  { name: "Thu", kcal: 1700, protein: 130, carbs: 160, fat: 50 },
  { name: "Fri", kcal: 2200, protein: 170, carbs: 230, fat: 75 },
  { name: "Sat", kcal: 2400, protein: 180, carbs: 280, fat: 85 },
  { name: "Sun", kcal: 1900, protein: 150, carbs: 200, fat: 60 },
];

const MACRO_DATA = [
  { name: "Protein", value: 150, color: "#4CAF82" },
  { name: "Carbs", value: 200, color: "#F59E0B" },
  { name: "Fats", value: 65, color: "#FF6B6B" },
];

export default function Analytics({ profile }: AnalyticsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="pb-12 space-y-10"
    >
      <header className="border-b border-slate-200 pb-4">
        <h2 className="text-3xl font-black text-dark tracking-tighter">Geometric Insights</h2>
        <p className="text-[10px] font-black text-muted-grey uppercase tracking-widest mt-1">Symmetric performance analysis</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-6">
        <StatCard 
          icon={<Scale className="w-5 h-5 text-indigo-600" />} 
          label="Metabolic Weight" 
          value={`${profile.currentWeight} KG`} 
          trend="↓ 0.5 KG"
        />
        <StatCard 
          icon={<Target className="w-5 h-5 text-amber-500" />} 
          label="Efficiency Score" 
          value="65%" 
          trend="↑ 12%"
        />
      </div>

      {/* Calorie Chart */}
      <section className="bg-white p-8 border border-slate-200 rounded-card shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
               <TrendingUp className="w-6 h-6" />
             </div>
             <div>
               <h3 className="text-lg font-black text-dark tracking-tight leading-none">VITAL TRENDS</h3>
               <p className="text-[10px] font-black text-muted-grey uppercase tracking-widest mt-1">DAILY KCAL CONSUMPTION</p>
             </div>
          </div>
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-[9px] font-black text-muted-grey uppercase tracking-widest">
            LAST 7 CYCLES
          </div>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={WEEKLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 9, fontVariant: "small-caps", fontWeight: 800 }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "10px", fontWeight: "bold", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                itemStyle={{ color: "#4f46e5" }}
              />
              <Line 
                type="monotone" 
                dataKey="kcal" 
                stroke="#4f46e5" 
                strokeWidth={4} 
                dot={{ r: 5, fill: "#ffffff", stroke: "#4f46e5", strokeWidth: 3 }}
                activeDot={{ r: 7, fill: "#4f46e5", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Macros Section */}
      <div className="bg-white p-8 border border-slate-200 rounded-card shadow-sm">
         <h3 className="text-sm font-black text-dark tracking-widest uppercase mb-8 pb-4 border-b border-slate-100">Macro Allocation Grid</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
           <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MACRO_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {MACRO_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-2xl font-black text-dark">415</span>
               <span className="text-[8px] font-black text-muted-grey uppercase tracking-widest">TOTAL G</span>
            </div>
           </div>
           <div className="space-y-6">
              {MACRO_DATA.map(m => (
                <div key={m.name} className="flex items-center justify-between group">
                   <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-sm group-hover:rotate-45 transition-transform" style={{ backgroundColor: m.color }} />
                     <span className="text-[10px] font-black text-dark uppercase tracking-widest">{m.name}</span>
                   </div>
                   <span className="text-xs font-black text-slate-400 font-mono tracking-tighter">{m.value}G</span>
                </div>
              ))}
           </div>
         </div>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) {
  return (
    <div className="bg-white p-6 border border-slate-200 rounded-card shadow-sm group">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
          {icon}
        </div>
        <span className="text-[9px] font-black text-muted-grey uppercase tracking-widest leading-none mt-1">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-black text-dark tracking-tighter leading-none">{value}</p>
        <p className="text-[9px] font-black text-primary tracking-widest uppercase mb-1">{trend}</p>
      </div>
    </div>
  );
}
