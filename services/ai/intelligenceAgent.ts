
import { Type } from "@google/genai";
import { getAI } from "./base";
import { Project, ProjectIntelligence } from "../../types";

/**
 * Generates a strategic execution plan using Gemini 3 Pro.
 * Utilizes Thinking Config for deep architectural reasoning and Structured Outputs for UI stability.
 */
export const generateProjectIntelligence = async (project: Project): Promise<ProjectIntelligence | null> => {
  const ai = getAI();
  
  const systemInstruction = `You are a Principal Product Architect and AI Systems Planner. 
  Your role is to interpret a Project Blueprint and generate a concrete, operational execution plan.
  
  Principles:
  1. **Minimalism**: Do not suggest bloat. Only what is needed for the specific Project Type.
  2. **Modernity**: Suggest modern stacks (Next.js, Supabase, Gemini 3) and agents.
  3. **Safety**: Always assign a Risk Level to automations.
  
  Analyze the provided project context and output a structured JSON plan.`;

  const prompt = `Analyze this Project Blueprint:
  
  Name: ${project.name}
  Type: ${project.type}
  Client: ${project.client}
  Description: ${project.description || "N/A"}
  Duration: ${project.duration}
  Current Phase: ${project.phase}
  
  Tasks:
  1. Determine complexity and delivery model.
  2. Recommend specialized AI Agents (e.g. Researcher, Planner, Coder).
  3. Design specific Automations (Trigger -> Action).
  4. Outline high-level Workflows.
  5. Map key User Journeys.
  6. Provide a relevant Real-World Example/Case Study.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 4000 }, // High budget for architectural reasoning
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.OBJECT,
              properties: {
                complexity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                deliveryModel: { type: Type.STRING, enum: ['MVP', 'Phased', 'Full'] },
                primaryGoal: { type: Type.STRING }
              },
              required: ["complexity", "deliveryModel", "primaryGoal"]
            },
            agents: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  whyNeeded: { type: Type.STRING },
                  produces: { type: Type.STRING },
                  confidence: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
                },
                required: ["id", "name", "role", "whyNeeded", "produces", "confidence"]
              }
            },
            automations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  trigger: { type: Type.STRING },
                  action: { type: Type.STRING },
                  outcome: { type: Type.STRING },
                  riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
                },
                required: ["id", "trigger", "action", "outcome", "riskLevel"]
              }
            },
            workflows: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  stepCount: { type: Type.INTEGER },
                  outputs: { type: Type.STRING },
                  whenToUse: { type: Type.STRING }
                },
                required: ["id", "name", "stepCount", "outputs", "whenToUse"]
              }
            },
            journeys: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  actor: { type: Type.STRING },
                  steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                  valueProp: { type: Type.STRING }
                },
                required: ["id", "actor", "steps", "valueProp"]
              }
            },
            examples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  scenario: { type: Type.STRING },
                  built: { type: Type.STRING },
                  outcome: { type: Type.STRING }
                },
                required: ["id", "scenario", "built", "outcome"]
              }
            }
          },
          required: ["summary", "agents", "automations", "workflows", "journeys", "examples"]
        }
      }
    });

    const data = JSON.parse(response.text?.trim() || "{}") as ProjectIntelligence;
    
    // Ensure IDs are unique if model generated duplicates or placeholdes
    if (data.agents) data.agents.forEach((a, i) => a.id = `ag-${Date.now()}-${i}`);
    if (data.automations) data.automations.forEach((a, i) => a.id = `au-${Date.now()}-${i}`);
    if (data.workflows) data.workflows.forEach((w, i) => w.id = `wf-${Date.now()}-${i}`);
    if (data.journeys) data.journeys.forEach((j, i) => j.id = `jn-${Date.now()}-${i}`);
    if (data.examples) data.examples.forEach((e, i) => e.id = `ex-${Date.now()}-${i}`);

    return data;

  } catch (error) {
    console.error("Intelligence Agent Error:", error);
    return null;
  }
};
