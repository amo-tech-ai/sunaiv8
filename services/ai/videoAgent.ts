import { GoogleGenAI } from "@google/genai";

/**
 * Generates cinematic luxury videos using the Veo model.
 * Requires a paid API key via window.aistudio.openSelectKey().
 */
export const generateVideoBrief = async (prompt: string, onProgress?: (msg: string) => void): Promise<string | null> => {
  // Always create new instance for most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    if (onProgress) onProgress("Initiating high-fidelity video render...");
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Cinematic luxury agency mood film. High-end fashion editorial style. ${prompt}`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      if (onProgress) onProgress("Agent is crafting cinematic frames (this may take 1-2 minutes)...");
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) return null;

    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error: any) {
    console.error("Video Generation Error:", error);
    if (error.message?.includes("Requested entity was not found")) {
      // Handle the key reset scenario if billing is missing
      if ((window as any).aistudio?.openSelectKey) {
        await (window as any).aistudio.openSelectKey();
      }
    }
    return null;
  }
};
