
import { Type } from "@google/genai";
import { getAI } from "./base";
import { Contact, MarketReport, ResearchResult } from "../../types";

/**
 * Identifies local industry hubs using Gemini 3 Flash and Google Maps grounding.
 */
export const getLocalIntelligence = async (company: string, category: string, location?: { lat: number; lng: number }): Promise<string> => {
  const ai = getAI();
  const prompt = `Identify local industry hubs and relevant office locations for ${company} in ${category}. 
  Current context: ${location ? `Lat ${location.lat}, Lng ${location.lng}` : 'Global'}. 
  Find high-end showrooms, media hubs, or luxury venues nearby. Concise editorial style.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
    return response.text || "No specific local intelligence available.";
  } catch (error) {
    console.error("Local Intel Agent Error:", error);
    return "Local intelligence agent connection unstable.";
  }
};

/**
 * Conducts deep market research using Gemini 3 Pro and Google Search grounding.
 */
export const deepResearchContact = async (contact: Contact): Promise<ResearchResult | null> => {
  const ai = getAI();
  const prompt = `Deep Research: ${contact.company}. Markets, news, sentiment. Focus on latest luxury trends.`;
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
    console.error("Deep Research Agent Error:", error);
    return null;
  }
};

/**
 * Conducts a comprehensive market analysis report.
 */
export const conductMarketAnalysis = async (contact: Contact, location?: { lat: number; lng: number }): Promise<MarketReport | null> => {
  const ai = getAI();
  const prompt = `Conduct market analysis for ${contact.company} (${contact.category}). 
  Identify 3 direct competitors, their URLs, tactics, and operational weaknesses. 
  Suggest 3 specific AI workflows.`;

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
    report.localIntelligence = await getLocalIntelligence(contact.company, contact.category, location);
    return report;
  } catch (error) {
    console.error("Market Analysis Agent Error:", error);
    return null;
  }
};
