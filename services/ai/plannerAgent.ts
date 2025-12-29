
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

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 }, // High reasoning for dependencies
        responseMimeType: "application/json",
        responseSchema: {
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
        }
      }
    });
    
    const plan = JSON.parse(response.text.trim());
    
    // Auto-generate flat milestones from WBS phases for the existing Timeline view backward compatibility
    plan.milestones = plan.wbs.map((phase: any, i: number) => ({
      week: `Phase ${i+1}`,
      title: phase.name,
      description: `${phase.tasks.length} tasks included`,
      effort: 'Medium'
    }));

    return plan as ProjectPlan;
  } catch (error) {
    console.error("Planner Agent (Roadmap) Error:", error);
    return null;
  }
};
