
import { GoogleGenAI, Type } from "@google/genai";
import { Contact, AIInsight, FocusType, MarketReport, ResearchResult, PipelineStage, WorkflowDraft, EnrichmentSuggestion, BudgetAnalysis, ProjectPlan } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getLocalIntelligence = async (company: string, category: string, location?: { lat: number; lng: number }): Promise<string> => {
  const ai = getAI();
  const prompt = `Find the local office locations and nearby high-end industry hubs for ${company} in the ${category} sector. 
  Current user context: ${location ? `Latitude ${location.lat}, Longitude ${location.lng}` : 'Global'}.
  Check for nearby luxury venues or competitors that might influence an agency partnership. Provide an editorial summary.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest", 
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: location ? { latitude: location.lat, longitude: location.lng } : undefined
          }
        }
      },
    });
    return response.text || "No localized physical intelligence available.";
  } catch (error) {
    console.error("Local Intelligence Failed:", error);
    return "Localized intelligence agent offline.";
  }
};

export const conductMarketAnalysis = async (contact: Contact, location?: { lat: number; lng: number }): Promise<MarketReport | null> => {
  const ai = getAI();
  const prompt = `Conduct a comprehensive competitive and market analysis for ${contact.company} in the ${contact.category} sector.
  Target Market Context: ${location ? 'User location prioritized' : 'Global'}.
  1. Identify top 3 direct competitors and their URLs.
  2. List their current digital marketing tactics.
  3. Identify specific operational pain points in their industry.
  4. Suggest 3 specific AI Agent workflows.`;

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
                  complexity: { type: Type.STRING }
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

export const generateProjectPlan = async (contact: Contact, report: MarketReport): Promise<ProjectPlan | null> => {
  const ai = getAI();
  const prompt = `Planner Agent: Create a structured 4-week implementation roadmap for ${contact.company} based on their pain points: ${report.painPoints.join(', ')}. 
  Weekly milestones must be strategic and agency-led. 
  Include your reasoning for the plan, any assumptions, and external dependencies.`;

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

export const calculateBudgetProjections = async (contact: Contact): Promise<BudgetAnalysis | null> => {
  const ai = getAI();
  const prompt = `Calculate 12-month ROI for ${contact.company}. 
  Current Deal Value: ${contact.dealValue || '$50k'}.
  1. Base Fee: $15k Setup.
  2. Retainer: $8k/mo.
  3. ROI: Assume 3.5x efficiency multiplier from AI automation.
  Use Python for calculation.`;

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

export const getAIInsight = async (type: FocusType, data: any): Promise<AIInsight> => {
  const ai = getAI();
  const prompt = `Strategic Audit: Focused ${type} "${data.name || data.company || 'Unknown'}". Analyze risks and provide 3 tactical signals.`;

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
            reasoningTrace: { type: Type.STRING },
            forecast: {
              type: Type.OBJECT,
              properties: {
                probability: { type: Type.NUMBER },
                reasoning: { type: Type.STRING },
                nextBestAction: { type: Type.STRING }
              },
              required: ["probability", "reasoning", "nextBestAction"]
            }
          },
          required: ["summary", "suggestion", "confidence", "signals", "suggestedTasks", "reasoningTrace"],
        },
      },
    });
    return JSON.parse(response.text.trim()) as AIInsight;
  } catch (error) {
    return {
      summary: "Stable baseline.",
      suggestion: "Maintain standard observation.",
      confidence: "medium",
      signals: ["No anomalies detected"],
      suggestedTasks: ["Routine sync"],
      reasoningTrace: "Heuristic scan complete."
    };
  }
};

export const generateCreativeConcept = async (contact: Contact): Promise<string | null> => {
  const ai = getAI();
  const prompt = `Minimalist luxury concept for ${contact.company}. Editorial tones. High fashion aesthetic.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
    });
    for (const cand of response.candidates) {
      for (const part of cand.content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const deepResearchContact = async (contact: Contact): Promise<ResearchResult | null> => {
  const ai = getAI();
  const prompt = `Deep-dive research for ${contact.company}. Identify latest market moves, executive shifts, and public PR sentiment.`;
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

export const getChatResponse = async (query: string, workspace: any): Promise<string> => {
  const ai = getAI();
  const prompt = `Workspace Context: ${JSON.stringify(workspace)}\nUser: ${query}`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are the Sun AI Agency Assistant. Use provided workspace context to answer concisely."
      }
    });
    return response.text || "I'm sorry, I couldn't find relevant data.";
  } catch (error) {
    return "Connection error.";
  }
};

export const generateWorkflowDraft = async (contact: Contact, stage: PipelineStage): Promise<WorkflowDraft> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Draft a professional ${stage} for ${contact.company}.`,
    config: { systemInstruction: "You are a senior agency business development director." }
  });
  return {
    type: 'Proposal',
    content: response.text || "",
    status: 'Pending',
    timestamp: new Date().toISOString()
  };
};

export const enrichLeadData = async (query: string, contactName?: string): Promise<EnrichmentSuggestion | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Enrich profile for ${query} (${contactName || 'Lead'}).`,
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
