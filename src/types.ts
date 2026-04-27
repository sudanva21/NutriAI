export enum Goal {
  LOSS = "weight_loss",
  GAIN = "muscle_gain",
  MAINTAIN = "maintenance",
  HEALTH = "general_health"
}

export enum DietType {
  VEG = "veg",
  VEGAN = "vegan",
  NON_VEG = "non-veg",
  KETO = "keto",
  PALEO = "paleo",
  NONE = "no preference"
}

export enum ActivityLevel {
  SEDENTARY = "sedentary",
  LIGHTLY_ACTIVE = "lightly_active",
  MODERATELY_ACTIVE = "moderately_active",
  VERY_ACTIVE = "very_active"
}

export enum MealType {
  BREAKFAST = "breakfast",
  LUNCH = "lunch",
  DINNER = "dinner",
  SNACK = "snack"
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time?: string;
  type: MealType;
  eaten: boolean;
  ingredients?: string[];
  prepTime?: number;
}

export interface DayPlan {
  day: number;
  date: string;
  meals: Meal[];
}

export interface UserProfile {
  name: string;
  goal: Goal;
  dietType: DietType;
  allergies: string[];
  activityLevel: ActivityLevel;
  height: number;
  currentWeight: number;
  targetWeight: number;
  caloriesTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  xp: number;
  level: number;
  streak: number;
  onboarded: boolean;
}

export interface DailyLog {
  date: string;
  consumedCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  mealsLogged: string[]; // IDs of meals from the plan that were eaten
}

export const INITIAL_PROFILE: UserProfile = {
  name: "",
  goal: Goal.HEALTH,
  dietType: DietType.NONE,
  allergies: [],
  activityLevel: ActivityLevel.SEDENTARY,
  height: 170,
  currentWeight: 70,
  targetWeight: 70,
  caloriesTarget: 2000,
  proteinTarget: 150,
  carbsTarget: 200,
  fatTarget: 60,
  xp: 0,
  level: 1,
  streak: 0,
  onboarded: false
};
