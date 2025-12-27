
import { Chat } from "@google/genai";
import { getAI } from "./base";

let assistantChat: Chat | null = null;

/**
 * Processes natural language queries about the workspace using stateful Chat API.
 */
export const getChatResponse = async (query: string, workspace: any): Promise<string> => {
  const ai = getAI();
  
  if (!assistantChat) {
    assistantChat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are the Sun AI Agency Principal Assistant. 
        You have access to the current workspace context: ${JSON.stringify(workspace)}. 
        Answer queries concisely and in an editorial tone. 
        Focus on helping the user manage leads, projects, and execution tasks.`
      }
    });
  }

  try {
    const response = await assistantChat.sendMessage({ message: query });
    return response.text || "I processed your request but have no specific feedback from the workspace grounding.";
  } catch (error) {
    console.error("Assistant Agent Error:", error);
    assistantChat = null; // Reset on failure
    return "Workspace connection interrupted. Session reset.";
  }
};
