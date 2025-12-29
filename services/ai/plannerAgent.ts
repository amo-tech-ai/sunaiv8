
import { Type } from "@google/genai";
import { getAI } from "./base";
import { Contact, MarketReport, ProjectPlan } from "../../types";

/**
 * Generates a 4-week roadmap using Gemini 3 Pro Thinking Config.
 * Used when upgrading a CRM Lead to a Project.
 */
export const generateProjectPlan = async (contact: Contact, report: MarketReport): Promise<ProjectPlan | null> => {
  const ai = getAI();
  const prompt = `Planner Agent: Create a 4-week roadmap for ${contact.company} to address these specific industry pain points: ${report.painPoints.join(', ')}.`;

  // Schema definition shared for consistency
  const schema = {
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
  };

  try {
    // Attempt 1: Gemini 3 Pro (High Reasoning)
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text?.trim() || "{}") as ProjectPlan;
  } catch (error) {
    console.warn("[Planner Agent] Pro model failed, attempting fallback to Flash...", error);
    
    try {
      // Attempt 2: Gemini 3 Flash (High Speed Fallback)
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });
      return JSON.parse(fallbackResponse.text?.trim() || "{}") as ProjectPlan;
    } catch (fallbackError) {
      console.error("[Planner Agent] Critical Failure: Both Pro and Flash models failed.", fallbackError);
      return null;
    }
  }
};

/**
 * Generates a comprehensive Project WBS (Phases -> Tasks) from scratch based on Wizard inputs.
 */
export const generateProjectRoadmap = async (
  name: string,
  client: string,
  type: string,
  duration: string,
  description?: string
): Promise<ProjectPlan | null> => {
  const ai = getAI();
  const prompt = `Act as a Senior Technical Project Manager.
  Create a detailed Work Breakdown Structure (WBS) for a new engagement.
  
  Project: ${name}
  Client: ${client}
  Type: ${type}
  Duration: ${duration}
  Context: ${description || 'Standard commercial implementation'}

  Requirements:
  1. Break the project into logical Phases (e.g., Discovery, Design, Build, Launch).
  2. Inside each phase, list specific actionable Tasks.
  3. Ensure the structure fits the requested duration.
  `;

  // Schema shared for consistency
  const schema = {
    type: Type.OBJECT,
    properties: {
      wbs: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Phase Name (e.g. Discovery)" },
            duration: { type: Type.STRING, description: "Phase Duration" },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  effort: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
                },
                required: ["title", "description", "effort"]
              }
            }
          },
          required: ["name", "duration", "tasks"]
        }
      },
      reasoning: { type: Type.STRING, description: "Why this schedule works." },
      dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
      assumptions: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["wbs", "reasoning", "dependencies", "assumptions"]
  };

  try {
    // Attempt 1: Gemini 3 Pro (Deep Planning)
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 }, 
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    
    const plan = JSON.parse(response.text?.trim() || "{}");
    plan.milestones = plan.wbs?.map((phase: any, i: number) => ({
      week: `Phase ${i+1}`,
      title: phase.name,
      description: `${phase.tasks.length} tasks included`,
      effort: 'Medium'
    })) || [];

    return plan as ProjectPlan;

  } catch (error) {
    console.warn("[Planner Agent] Pro model failed during WBS generation, attempting fallback to Flash...", error);

    try {
      // Attempt 2: Gemini 3 Flash (Rapid Recovery)
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });
      
      const plan = JSON.parse(fallbackResponse.text?.trim() || "{}");
      plan.milestones = plan.wbs?.map((phase: any, i: number) => ({
        week: `Phase ${i+1}`,
        title: phase.name,
        description: `${phase.tasks.length} tasks included`,
        effort: 'Medium'
      })) || [];

      return plan as ProjectPlan;
    } catch (fallbackError) {
      console.error("[Planner Agent] Critical Failure: WBS Generation failed on both models.", fallbackError);
      return null;
    }
  }
};
