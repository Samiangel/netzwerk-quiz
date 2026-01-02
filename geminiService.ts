
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

// Initialize AI right before use as per guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateQuizForTopic = async (topicTitle: string): Promise<Question[]> => {
  const ai = getAI();
  const prompt = `Erstelle 5 anspruchsvolle Multiple-Choice-Fragen zum Thema "${topicTitle}" für Fachinformatiker. 
  Jede Frage muss 4 Antwortmöglichkeiten haben.
  Antworte ausschließlich im JSON-Format gemäß dem Schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "Du bist ein erfahrener IT-Dozent. Erstelle nur valides JSON ohne Markdown-Formatierung (keine ```json Tags).",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Array von genau 4 Antwortmöglichkeiten"
              },
              correctAnswer: { 
                type: Type.INTEGER,
                description: "Index der richtigen Antwort (0, 1, 2 oder 3)"
              },
              explanation: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Keine Antwort von der KI erhalten.");
    
    const questions = JSON.parse(text);
    return Array.isArray(questions) ? questions : [];
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    return [];
  }
};

export const generateTopicContent = async (topicTitle: string): Promise<string> => {
  const ai = getAI();
  const prompt = `Schreibe eine ausführliche, strukturierte Einführung (ca. 500 Wörter) zum IT-Thema: "${topicTitle}". 
  Nutze Markdown mit Überschriften (##), Listen und falls relevant Code-Beispielen. 
  Erkläre Definition, Funktionsweise und Praxisbeispiele für Auszubildende.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });

    return response.text || "Inhalt konnte nicht generiert werden.";
  } catch (error) {
    console.error("Gemini Content Error:", error);
    return "Fehler beim Laden des Inhalts. Bitte versuche es später erneut.";
  }
};
