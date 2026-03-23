import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";

export const ai = new GoogleGenAI({ apiKey });

export const roadmapSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Title of the learning roadmap" },
    level: { type: Type.STRING, enum: ["beginner", "intermediate", "advanced"] },
    modules: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                challenge: { type: Type.STRING, description: "A small challenge or question for the user" }
              },
              required: ["title", "description"]
            }
          }
        },
        required: ["title", "description", "tasks"]
      }
    }
  },
  required: ["title", "level", "modules"]
};

export async function generateRoadmap(goal: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a structured learning roadmap for the goal: "${goal}". 
    The roadmap should be progressive, starting from the current level and moving towards mastery.
    Break it down into 4-6 modules, each with 2-4 specific tasks.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: roadmapSchema,
    },
  });

  return JSON.parse(response.text);
}

export async function chatWithAI(message: string, context: any) {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `You are EduAI, a helpful learning assistant for EduChain. 
      The user is currently on a learning roadmap: ${JSON.stringify(context.roadmap)}.
      Current progress: ${context.progress}%.
      Be encouraging, explain concepts clearly, and help solve tasks without just giving away the answers.`,
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text;
}
