
import { Type } from "@google/genai";
import { getAI } from "./base";
import { Contact, MarketReport, ProjectPlan } from "../../types";

/**
 * Generates a 4-week roadmap using Gemini 3 Pro Thinking Config.
 */
export const generateProjectPlan = async (contact: Contact, report: MarketReport): Promise<ProjectPlan | null> => {
  const ai = getAI();
  const prompt = `Planner Agent: Create a 4-week roadmap for ${contact.company} to address these specific industry pain points: ${report.painPoints.join(', ')}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  week: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  effort: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
                },
                required: ["week", "title", "description", "effort"]
              }
            },
            reasoning: { type: Type.STRING },
            dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
            assumptions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["milestones", "reasoning", "dependencies", "assumptions"]
        }
      }
    });
    return JSON.parse(response.text.trim()) as ProjectPlan;
  } catch (error) {
    console.error("Planner Agent Error:", error);
    return null;
  }
};
