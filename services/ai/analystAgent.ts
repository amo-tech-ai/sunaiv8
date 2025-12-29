
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

/**
 * Estimates new project budget using Gemini 3 Pro Code Execution.
 */
export const estimateProjectBudget = async (type: string, duration: string, description: string): Promise<BudgetAnalysis | null> => {
  const ai = getAI();
  const prompt = `Act as a Technical Estimator. Use Python to calculate a budget breakdown for a new project.
  
  Parameters:
  - Project Type: ${type}
  - Duration: ${duration}
  - Goal: ${description}
  - Blended Hourly Rate: $165/hr
  
  Python Logic Requirements:
  1. Define typical hours per week based on project complexity (inferred from type/goal).
  2. Calculate Total Cost = (Hours/Week * Weeks * Rate).
  3. Estimate ROI based on typical industry benchmarks for this project type.
  
  Output the result as JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ codeExecution: {} }], // Precise math via Python
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalEstimatedCost: { type: Type.NUMBER },
            roiProjection: { type: Type.NUMBER, description: "Percentage ROI (e.g. 150 for 150%)" },
            breakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { item: { type: Type.STRING }, cost: { type: Type.NUMBER } }
              }
            },
            reasoning: { type: Type.STRING, description: "Explanation of the Python calculation logic." }
          },
          required: ["totalEstimatedCost", "roiProjection", "breakdown", "reasoning"]
        }
      }
    });
    return JSON.parse(response.text.trim()) as BudgetAnalysis;
  } catch (error) {
    console.error("Budget Estimator Error:", error);
    return null;
  }
};
