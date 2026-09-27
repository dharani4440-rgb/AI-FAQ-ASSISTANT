let GoogleGenAI;

async function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error("GEMINI_API_KEY is not configured");
    error.statusCode = 500;
    throw error;
  }

  if (!GoogleGenAI) {
    const sdk = await import("@google/genai");
    GoogleGenAI = sdk.GoogleGenAI;
  }

  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

async function generateAnswer(question) {
  const ai = await getClient();

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Answer this FAQ question clearly and concisely:\n\n${question}`,
  });

  return response.text?.trim() || "";
}

async function generateFAQ(topic) {
  const ai = await getClient();

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Create one useful FAQ about the topic "${topic}". Return one question and one concise answer.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          question: { type: "string" },
          answer: { type: "string" },
        },
        required: ["question", "answer"],
      },
    },
  });

  const raw = response.text?.trim() || "";
  const parsed = JSON.parse(raw);

  if (!parsed.question || !parsed.answer) {
    throw new Error("Gemini returned an invalid FAQ response");
  }

  return parsed;
}

module.exports = { generateAnswer, generateFAQ };
