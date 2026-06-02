import { GoogleGenerativeAI } from '@google/generative-ai';

// Expo lee EXPO_PUBLIC_ automáticamente del archivo .env
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;

if (!API_KEY) {
  console.warn("⚠️ Advertencia: EXPO_PUBLIC_GEMINI_KEY no está definida en el archivo .env");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const preguntarGemini = async (contexto) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Usamos 1.5-flash que es el estándar rápido y gratuito actual
    const result = await model.generateContent(contexto);
    return result.response.text();
  } catch (error) {
    console.error('Error al consultar Gemini:', error);
    return '❌ Hubo un error al procesar tu solicitud con la IA.';
  }
};