
import { Type } from "@google/genai";
import { getAI } from "./base";
import { Contact, PipelineStage, WorkflowDraft, EnrichmentSuggestion } from "../../types";

/**
 * Drafts workflow documents using Gemini 3 Flash.
 */
export const generateWorkflowDraft = async (contact: Contact, stage: PipelineStage): Promise<WorkflowDraft> => {
  const ai = getAI();
  const prompt = `Draft ${stage} brief for ${contact.company}. Luxury market positioning.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        systemInstruction: "You are a senior Agency Director specializing in the luxury fashion sector." 
      }
    });
    
    return {
      type: stage === 'Proposal' ? 'Proposal' : 'Brief',
      content: response.text || "Drafting error. Please retry.",
      status: 'Pending',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Workflow Agent Draft Error:", error);
    return {
      type: 'Brief',
      content: "AI service temporarily unavailable for drafting.",
      status: 'Pending',
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Enriches lead data using Gemini 3 Flash and Search grounding.
 */
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
    console.error("Workflow Agent Enrichment Error:", error);
    return null;
  }
};
