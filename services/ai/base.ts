
import { GoogleGenAI } from "@google/genai";

/**
 * Initializes the Google GenAI client using the environment's API Key.
 */
export const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });
