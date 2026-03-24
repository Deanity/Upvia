import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const DEFAULT_MODEL = "gemini-2.0-flash"; // Fallback to a widely available model
const EXPERIMENTAL_MODEL = "gemini-2.5-flash";

export const ai = new GoogleGenAI({ apiKey });

export interface ChatContext {
  roadmap: any;
  progress: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

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
                summary: { type: Type.STRING, description: "A very brief one-sentence summary of what this task covers" },
                challenge: { type: Type.STRING, description: "A small challenge or question for the user" }
              },
              required: ["title", "description", "summary"]
            }
          }
        },
        required: ["title", "description", "tasks"]
      }
    }
  },
  required: ["title", "level", "modules"]
};

async function safeGenerateContent(params: any) {
  try {
    return await ai.models.generateContent(params);
  } catch (error: any) {
    if (params.model === EXPERIMENTAL_MODEL) {
      console.warn(`Model ${EXPERIMENTAL_MODEL} failed, falling back to ${DEFAULT_MODEL}`);
      return await ai.models.generateContent({ ...params, model: DEFAULT_MODEL });
    }
    throw error;
  }
}

export async function generateRoadmap(goal: string) {
  try {
    const response = await safeGenerateContent({
      model: EXPERIMENTAL_MODEL,
      contents: `Generate a structured learning roadmap for the goal: "${goal}". 
      The roadmap should be progressive, starting from the current level and moving towards mastery.
      Break it down into 4-6 modules, each with 2-4 specific tasks.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: roadmapSchema,
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw new Error("I couldn't generate your roadmap right now. Please check your API key or try again later.");
  }
}

export async function chatWithAI(message: string, context: ChatContext, history: ChatMessage[] = []) {
  try {
    // Construct the contents including history
    // The format expected by generateContent for multi-turn is an array of Content objects
    const contents = [
      ...history.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user', // SDK typically uses 'model' and 'user'
        parts: [{ text: msg.content }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await safeGenerateContent({
      model: EXPERIMENTAL_MODEL,
      contents,
      config: {
        systemInstruction: `You are Upvia AI, a helpful learning assistant. 
        The user is currently on a learning roadmap: ${JSON.stringify(context.roadmap)}.
        Current progress: ${context.progress}%.
        Be encouraging, explain concepts clearly, and help solve tasks without just giving away the answers.
        IMPORTANT: Always speak in INDONESIAN unless the user explicitly asks to speak in another language.`,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error in chatWithAI:", error);
    try {
      // Fallback to simple completion if multi-turn fails or model is unavailable
      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: [{ role: 'user', parts: [{ text: message }] }],
        config: {
          systemInstruction: `You are Upvia AI, a helpful learning assistant. Always speak in INDONESIAN.`,
        },
      });
      return response.text;
    } catch (fallbackError) {
      throw new Error("EduAI is currently offline. Please try again in a moment.");
    }
  }
}

export const materialSchema = {
  type: Type.OBJECT,
  properties: {
    content: { type: Type.STRING, description: "Detailed learning material in Markdown format. Include theory, examples, and best practices." },
    exercises: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.NUMBER, description: "Index of the correct option (0-indexed)" },
          explanation: { type: Type.STRING }
        },
        required: ["question", "options", "correctAnswer"]
      }
    }
  },
  required: ["content", "exercises"]
};

export async function generateTaskMaterial(taskTitle: string, moduleTitle: string, roadmapGoal: string) {
  try {
    const response = await safeGenerateContent({
      model: EXPERIMENTAL_MODEL,
      contents: `Generate detailed learning material and practice questions for the task: "${taskTitle}"
      inside the module: "${moduleTitle}"
      part of a learning roadmap for: "${roadmapGoal}".
      
      The material should be professional, easy to understand, and follow a "Dicoding-style" depth.
      Include code snippets if relevant.
      Always write the content in INDONESIAN.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: materialSchema,
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating task material:", error);
    throw new Error("I couldn't generate the learning material right now. Please try again later.");
  }
}
