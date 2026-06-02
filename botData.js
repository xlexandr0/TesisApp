export const ciclos = [
  {
    ciclo: "Primer Ciclo",
    cursos: ["Algoritmos", "Introducción a la Ingeniería", "Matemática Básica"]
  },
  {
    ciclo: "Segundo Ciclo",
    cursos: ["Programación Orientada a Objetos", "Estructura de Datos", "Cálculo I"]
  }
];

export const responderPregunta = (mensaje) => {
  const msg = mensaje.toLowerCase();
  if (msg.includes("hola") || msg.includes("buenos días")) {
    return "¡Hola! Bienvenido a ConsultaTEC. ¿En qué puedo ayudarte hoy?";
  }
  if (msg.includes("ciclo") || msg.includes("cursos")) {
    return "Puedes consultar los cursos del primer y segundo ciclo preguntando directamente a mi inteligencia en la nube.";
  }
  return null; // Si no sabe, devuelve null para darle el pase a Gemini
};