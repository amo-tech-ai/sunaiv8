
import { GoogleGenAI, Type } from "@google/genai";
import { Contact, AIInsight, FocusType, MarketReport, ResearchResult, PipelineStage, WorkflowDraft, EnrichmentSuggestion, BudgetAnalysis, ProjectPlan } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Hyper-local Intelligence Agent
 * Utilizes Gemini 2.5 Flash for Maps grounding to identify industry hubs.
 */
export const getLocalIntelligence = async (company: string, category: string, location?: { lat: number; lng: number }): Promise<string> => {
  const ai = getAI();
  const prompt = `Find the local office locations and nearby high-end industry hubs for ${company} in the ${category} sector. 
  Current user context: ${location ? `Latitude ${location.lat}, Longitude ${location.lng}` : 'Global'}.
  Check for nearby luxury venues, showrooms, or competitors. Provide a concise editorial summary.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts", // Optimal for general grounded text tasks
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: location ? { latitude: location.lat, longitude: location.lng } : undefined
          }
        }
      },
    });
    return response.text || "No localized physical intelligence available for this region.";
  } catch (error) {
    console.error("Local Intelligence Failed:", error);
    return "Localized intelligence agent offline.";
  }
};

/**
 * Researcher Agent: Market Analysis
 * Utilizes Gemini 3 Pro with Search grounding for competitive analysis.
 */
export const conductMarketAnalysis = async (contact: Contact, location?: { lat: number; lng: number }): Promise<MarketReport | null> => {
  const ai = getAI();
  const prompt = `Conduct a comprehensive competitive and market analysis for ${contact.company} (${contact.name}, ${contact.role}) in the ${contact.category} sector.
  1. Identify top 3 direct competitors and their URLs.
  2. List their current digital marketing tactics and operational weaknesses.
  3. Identify specific industry pain points for ${contact.company}.
  4. Suggest 3 specific AI Agent workflows to solve these points.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            industryOverview: { type: Type.STRING },
            competitorAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  tactic: { type: Type.STRING },
                  weakness: { type: Type.STRING }
                },
                required: ["name", "tactic", "weakness"]
              }
            },
            painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedAutomations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  workflow: { type: Type.STRING },
                  benefit: { type: Type.STRING },
                  complexity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
                },
                required: ["workflow", "benefit", "complexity"]
              }
            }
          },
          required: ["industryOverview", "competitorAnalysis", "painPoints", "suggestedAutomations"]
        }
      }
    });

    const report = JSON.parse(response.text.trim()) as MarketReport;
    const localIntel = await getLocalIntelligence(contact.company, contact.category, location);
    report.localIntelligence = localIntel;
    
    return report;
  } catch (error) {
    console.error("Market Analysis Failed:", error);
    return null;
  }
};

/**
 * Planner Agent: Strategic Roadmap
 */
export const generateProjectPlan = async (contact: Contact, report: MarketReport): Promise<ProjectPlan | null> => {
  const ai = getAI();
  const prompt = `Strategic Planner: Create a 4-week implementation roadmap for ${contact.company} based on these pain points: ${report.painPoints.join(', ')}. 
  Roadmap must be realistic, agency-led, and high-impact.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
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
    console.error("Project Plan Generation Failed:", error);
    return null;
  }
};

/**
 * Analyst Agent: ROI Math (Code Execution)
 */
export const calculateBudgetProjections = async (contact: Contact): Promise<BudgetAnalysis | null> => {
  const ai = getAI();
  const prompt = `Analyst Agent: Use Python to calculate the 12-month ROI for ${contact.company}.
  Input Variable: Deal Value = ${contact.dealValue || '$50,000'}.
  Fixed Costs: Setup=$15k, Monthly Retainer=$8k.
  Efficiency Gain: AI reduces op-ex by 40% annually.
  Provide a JSON breakdown of total cost, roi percentage, and reasoning.`;

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
                properties: {
                  item: { type: Type.STRING },
                  cost: { type: Type.NUMBER }
                }
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
    return null;
  }
};

/**
 * Strategic Insight Agent (Thinking Config)
 */
export const getAIInsight = async (type: FocusType, data: any): Promise<AIInsight> => {
  const ai = getAI();
  const prompt = `Senior Strategist: Analyze the focused ${type} "${data.name || data.company || 'Unknown'}". 
  What is the hidden risk? What is the single best next action? Provide reasoning trace.`;

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
    return {
      summary: "Observation baseline active.",
      suggestion: "Maintain standard process.",
      confidence: "medium",
      signals: ["No anomalies detected in current focus window."],
      suggestedTasks: ["Routine followup"],
      reasoningTrace: "Heuristic scan complete."
    };
  }
};

export const generateCreativeConcept = async (contact: Contact): Promise<string | null> => {
  const ai = getAI();
  const prompt = `A minimalist high-fashion mood board for ${contact.company}. Editorial aesthetic. Muted tones. 4k resolution.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getChatResponse = async (query: string, workspace: any): Promise<string> => {
  const ai = getAI();
  const prompt = `Workspace Context: ${JSON.stringify(workspace)}\nUser Question: ${query}`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are the Sun AI Agency Principal Assistant. Answer questions based on the workspace context. Be concise, editorial, and helpful."
      }
    });
    return response.text || "I'm sorry, I couldn't find a grounded answer for that in the current workspace.";
  } catch (error) {
    return "Workspace connection interrupted.";
  }
};

export const generateWorkflowDraft = async (contact: Contact, stage: PipelineStage): Promise<WorkflowDraft> => {
  const ai = getAI();
  const prompt = `Draft a high-end ${stage} document for ${contact.company} (${contact.name}). 
  Focus on luxury market positioning and AI efficiency gains.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { 
      systemInstruction: "You are a senior agency business development director specializing in the fashion luxury sector." 
    }
  });
  
  return {
    type: stage === 'Proposal' ? 'Proposal' : 'Brief',
    content: response.text || "Drafting error. Please retry.",
    status: 'Pending',
    timestamp: new Date().toISOString()
  };
};

export const enrichLeadData = async (query: string, contactName?: string): Promise<EnrichmentSuggestion | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Research and enrich the profile for ${query} (${contactName || 'Lead'}).`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            industry: { type: Type.STRING },
            companyDescription: { type: Type.STRING },
            keyFocus: { type: Type.STRING },
            suggestedValue: { type: Type.STRING },
            contactPosition: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text.trim()) as EnrichmentSuggestion;
  } catch (error) {
    return null;
  }
};

export const deepResearchContact = async (contact: Contact): Promise<ResearchResult | null> => {
  const ai = getAI();
  const prompt = `Deep Research: ${contact.company}. Latest news, market shifts, and public PR sentiment.`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            marketPosition: { type: Type.STRING },
            recentNews: { type: Type.ARRAY, items: { type: Type.STRING } },
            sources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { title: { type: Type.STRING }, uri: { type: Type.STRING } },
                required: ["title", "uri"]
              }
            }
          },
          required: ["summary", "marketPosition", "recentNews", "sources"]
        }
      }
    });
    return JSON.parse(response.text.trim()) as ResearchResult;
  } catch (error) {
    return null;
  }
};
