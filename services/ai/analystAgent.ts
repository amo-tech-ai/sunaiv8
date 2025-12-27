
import { Type } from "@google/genai";
import { getAI } from "./base";
import { Contact, BudgetAnalysis } from "../../types";

/**
 * Calculates ROI projections using Python Code Execution.
 */
export const calculateBudgetProjections = async (contact: Contact): Promise<BudgetAnalysis | null> => {
  const ai = getAI();
  const prompt = `Use Python to calculate a 12-month ROI projection for a ${contact.dealValue || '$50,000'} project for ${contact.company}. 
  Assume 40% efficiency gains across operations. Provide a detailed cost breakdown.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ codeExecution: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalEstimatedCost: { type: Type.NUMBER },
            roiProjection: { type: Type.NUMBER },
            breakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { item: { type: Type.STRING }, cost: { type: Type.NUMBER } }
              }
            },
            reasoning: { type: Type.STRING }
          },
          required: ["totalEstimatedCost", "roiProjection", "breakdown", "reasoning"]
        }
      }
    });
    return JSON.parse(response.text.trim()) as BudgetAnalysis;
  } catch (error) {
    console.error("Analyst Agent Error:", error);
    return null;
  }
};
