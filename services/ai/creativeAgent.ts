
import { getAI } from "./base";
import { Contact } from "../../types";

/**
 * Generates creative luxury visual concepts using Gemini 2.5 Flash Image.
 */
export const generateCreativeConcept = async (contact: Contact): Promise<string | null> => {
  const ai = getAI();
  const prompt = `Minimalist luxury mood board for ${contact.company}. Editorial aesthetic. Muted tones. 
  Focus on high-end ${contact.category} fashion aesthetics. 4K resolution visual concept.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Creative Agent Error:", error);
    return null;
  }
};
