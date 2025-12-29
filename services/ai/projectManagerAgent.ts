
import { Type } from "@google/genai";
import { getAI } from "./base";
import { Project, ProjectAnalysis } from "../../types";

/**
 * Analyzes project health, risks, and resource allocation using Gemini 3 Pro.
 * It considers the target project in the context of the entire portfolio to find overlaps.
 * Uses Google Search to identify external market risks or client news.
 */
export const analyzeProjectHealth = async (targetProject: Project, allProjects: Project[]): Promise<ProjectAnalysis | null> => {
  const ai = getAI();
  
  // 1. Construct Context
  const portfolioContext = allProjects
    .filter(p => p.id !== targetProject.id)
    .map(p => ({
      name: p.name,
      team: p.team?.map(m => m.name) || [],
      status: p.status,
      phase: p.phase,
      duration: p.duration
    }));

  const targetContext = {
    name: targetProject.name,
    client: targetProject.client,
    type: targetProject.type,
    phase: targetProject.phase,
    status: targetProject.status,
    team: targetProject.team?.map(m => m.name) || [],
    milestones: targetProject.milestones || []
  };

  const prompt = `Project Manager Agent: Conduct a deep operational analysis of the project "${targetProject.name}".
  
  Target Project Data:
  ${JSON.stringify(targetContext, null, 2)}
  
  Portfolio Context (Active Concurrent Projects):
  ${JSON.stringify(portfolioContext, null, 2)}

  Your Goal:
  1. **External Risk Scan (Use Google Search):** Check for any recent news regarding the client "${targetProject.client}" or the industry sector related to "${targetProject.type}" that could pose a risk (e.g., market downturns, tech stack deprecations).
  2. **Internal Resource Analysis:** Detect RESOURCE OVERLAPS. Look at the 'team' members in the Target Project. Are they also assigned to other active projects in the Portfolio Context?
  3. **Health Score:** Assess the risk level (0-100) based on status, phase, complexity, and external factors.
  4. **Mitigation:** Provide a step-by-step plan.

  Output a structured JSON report.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 4000 }, // High budget for complex cross-project reasoning
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER, description: "0-100 score. >70 is critical." },
            riskSummary: { type: Type.STRING, description: "Executive summary of the risk state, including any external factors found via search." },
            bottlenecks: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Specific issues hindering progress (internal or external)."
            },
            resourceOptimization: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  collaboratorName: { type: Type.STRING },
                  currentRole: { type: Type.STRING },
                  suggestedMove: { type: Type.STRING, description: "Actionable advice e.g., 'Move to advisory role'" },
                  impact: { type: Type.STRING, description: "Why this helps the project." }
                },
                required: ["collaboratorName", "currentRole", "suggestedMove", "impact"]
              }
            },
            mitigationSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 tactical steps to fix the risks."
            }
          },
          required: ["riskScore", "riskSummary", "bottlenecks", "resourceOptimization", "mitigationSteps"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Project Manager Agent");
    
    return JSON.parse(text.trim()) as ProjectAnalysis;

  } catch (error) {
    console.error("Project Manager Agent Error:", error);
    return null;
  }
};
