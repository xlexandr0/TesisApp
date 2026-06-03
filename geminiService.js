// Lee la API Key directamente del archivo de configuración del entorno (.env)
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY || process.env.GEMINI_KEY;

export const preguntarGemini = async (preguntaUsuario) => {
  // Validación de seguridad temprana por si el archivo .env no está cargado
  if (!API_KEY) {
    console.error("Error: La API Key de Gemini no está configurada en el archivo .env");
    return 'Error de configuración en el servidor. Inténtalo más tarde.';
  }

  const contextoTecsup = `
    Eres el Asesor Virtual de la carrera de "Diseño y Desarrollo de Software" en Tecsup.
    Tu objetivo es guiar a nuevos alumnos sobre la malla curricular de 3 años.
    
    CURRÍCULA OFICIAL:
    - 1er Año (Tecnologías aplicadas al desarrollo de software): Fundamentos de Programación, UI/UX, Ciencias Básicas.
    - 2do Año (Programación de aplicaciones web y móviles): POO, Base de Datos, Backend, iOS, Nube.
    - 3er Año (Diseño de integración de aplicaciones empresariales): .NET Avanzado, Startup Project, Inteligencia de Negocios.

    REGLAS ESTRICTAS DE RESPUESTA:
    1. Sé medianamente breve, conciso y directo al grano. Evita textos largos o redundantes.
    2. No inventes cursos, requisitos ni datos. Si no sabes algo, indícalo claramente.
    3. Usa viñetas breves para listar asignaturas.
    4. No des detalles de costos, matrículas ni horarios; redirige a Admisión si preguntan eso.
  `;

  const promptFinal = `${contextoTecsup}\n\nPregunta del alumno: ${preguntaUsuario}`;

  const modelosDisponibles = [
    'gemini-2.5-flash',
    'gemini-3.5-flash',
    'gemini-2.0-flash',
    'gemini-2.5-flash-lite'
  ];

  for (const modelo of modelosDisponibles) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1/models/${modelo}:generateContent?key=${API_KEY}`;

      const respuesta = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptFinal }] }]
        })
      });

      if (respuesta.status === 503) {
        continue; 
      }

      if (!respuesta.ok) {
        continue; 
      }

      const datos = await respuesta.json();
      
      // Retorna únicamente el TEXTO puro generado por la IA
      return datos.candidates[0].content.parts[0].text;

    } catch (error) {
      // Falla en silencio para pasar al siguiente modelo
    }
  }

  return 'Por favor, realiza tu pregunta académica nuevamente en unos segundos.';
};