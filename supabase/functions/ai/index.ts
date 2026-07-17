import "@supabase/functions-js/edge-runtime.d.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
  return new Response("ok", {
    headers: corsHeaders,
  });
}

  try {

    const { accion, texto } = await req.json();

    const apiKey = Deno.env.get("OPENROUTER_API_KEY");

    let prompt = "";

if (accion === "resumen") {

  prompt =
    content: `
    Eres un profesor.

    Resume el documento de forma clara.

    IMPORTANTE:
    - No utilices Markdown.
    - No escribas ** ni ## ni *.
    - No uses formato Markdown.
    - Devuelve únicamente texto plano.
    - Utiliza viñetas normales (-).
    `

}

if (accion === "test") {

  prompt = `
Eres un profesor.

Genera exactamente 10 preguntas tipo test sobre el documento.

Reglas obligatorias:

- Cada pregunta debe tener cuatro opciones: A, B, C y D.
- Está TERMINANTEMENTE PROHIBIDO indicar la respuesta correcta debajo de cada pregunta.
- No escribas frases como "Respuesta correcta", "Correcta", "Solución" o similares después de ninguna pregunta.
- Al final del documento crea un apartado llamado:

RESPUESTAS

En ese apartado escribe únicamente:

1. B
2. D
3. A
4. C

IMPORTANTE:

- No uses Markdown.
- No escribas ** ni ##.
- No pongas texto en negrita.
- Devuelve únicamente texto plano.

Las respuestas deben aparecer únicamente al final.
No añadas ninguna explicación.
No añadas texto después del apartado RESPUESTAS.
`;

}
    const respuesta = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://studyai.local",
          "X-OpenRouter-Title": "StudyAI"
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "system",
              content: prompt
            },
            {
              role: "user",
              content: texto
            }
          ]
        })
      }
    );

    console.log("Status:", respuesta.status);

const datos = await respuesta.json();

console.log("Respuesta OpenRouter:", datos);

if (!respuesta.ok) {
  return new Response(
    JSON.stringify(datos),
    {
      status: respuesta.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    }
  );
}

    return new Response(
      JSON.stringify({
        respuesta: datos.choices[0].message.content
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );

 } catch (error) {

  console.error(error);

  return new Response(
    JSON.stringify({
      error
    }, null, 2),
    {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    }
  );

}

});