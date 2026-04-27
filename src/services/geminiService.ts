import { GoogleGenerativeAI } from "@google/generative-ai";
import { UserProfile, Goal, DietType, ActivityLevel, MealType } from "../types";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined. AI features will not work.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// Helper to get model with v1 stable version
const getModel = (modelName: string = "gemini-1.5-flash") => {
  return genAI.getGenerativeModel(
    { model: modelName },
    { apiVersion: "v1" }
  );
};

export async function generateMealPlan(profile: UserProfile): Promise<any> {
  const model = getModel();

  const prompt = `
    SYSTEM: You are an expert nutritionist and meal planner.
    USER: Generate a 1-day meal plan for a user with the following profile:
    - Goal: ${profile.goal}
    - Diet: ${profile.dietType}
    - Allergies: ${profile.allergies.join(", ") || "None"}
    - Weight: ${profile.currentWeight}kg
    - Height: ${profile.height}cm
    - Target Calories: ${profile.caloriesTarget}
    
    Rules:
    1. Hit calorie target ±100 kcal.
    2. Suggest 4 meals (breakfast, lunch, dinner, snack).
    3. Include macros (protein, carbs, fat) for each meal.
    4. Provide prep time and a list of ingredients.
    
    RESPOND ONLY WITH VALID JSON.
    Format:
    {
      "meals": [
        {
          "type": "breakfast | lunch | dinner | snack",
          "name": "Meal Name",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "prepTime": number,
          "ingredients": ["item1", "item2"]
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    });
    const text = result.response.text();
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return null;
  }
}

export async function analyzeFoodImage(base64Image: string): Promise<any> {
  const model = getModel();

  const prompt = `
    Identify the food in this image and provide estimated nutritional information.
    RESPOND ONLY WITH VALID JSON.
    Format:
    {
      "name": "Identified Food Name",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "confidence": number (0-1),
      "description": "Short description"
    }
  `;

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(",")[1] || base64Image
              }
            }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 500,
      }
    });

    const text = result.response.text();
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Vision Analysis Error:", error);
    return null;
  }
}

export async function generateHealthInsights(profile: UserProfile, logs: any[]): Promise<string[]> {
  const model = getModel();

  const prompt = `
    SYSTEM: You are a nutrition coach.
    Given the user's goal: ${profile.goal} and their current streak of ${profile.streak} days.
    Generate 3 short, actionable nutrition or fitness tips (max 15 words each).
    Return as a JSON array of strings.
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 200,
      }
    });
    const text = result.response.text();
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    return ["Stay hydrated today!", "Focus on protein intake.", "Try to hit your step goal."];
  }
}

