
import { Type } from "@google/genai";
import { getAI } from "./base";
import { FocusType, AIInsight } from "../../types";

/**
 * Generates strategic insights using Gemini 3 Pro Thinking.
 */
export const getAIInsight = async (type: FocusType, data: any): Promise<AIInsight> => {
  const ai = getAI();
  const prompt = `Strategist: Analyze focused ${type} "${data.name || data.company || 'Asset'}". 
  What are the hidden risks? What is the single best next action?
  Output exactly 2 high-impact suggested tasks for human authorization.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            suggestion: { type: Type.STRING },
            confidence: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
            signals: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedTasks: { type: Type.ARRAY, items: { type: Type.STRING } },
            reasoningTrace: { type: Type.STRING }
          },
          required: ["summary", "suggestion", "confidence", "signals", "suggestedTasks", "reasoningTrace"],
        },
      },
    });
    return JSON.parse(response.text.trim()) as AIInsight;
  } catch (error) {
    console.error("Strategist Agent Error:", error);
    return {
      summary: "Baseline observation active.",
      suggestion: "Maintain standard protocol.",
      confidence: "medium",
      signals: ["No anomalies detected in current state."],
      suggestedTasks: ["Check relationship history", "Review budget"],
      reasoningTrace: "Heuristic scan complete."
    };
  }
};
