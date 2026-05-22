import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Initialize Gemini AI client dynamically
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      throw new Error("MISSING_API_KEY");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // API Route for Gemini content generation
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      const { prompt, contextGroup, isGroupSpecific, customPrompt } = req.body;

      let ai;
      try {
        ai = getAiClient();
      } catch (keyError: any) {
        if (keyError.message === "MISSING_API_KEY") {
          return res.status(400).json({ error: "MISSING_API_KEY" });
        }
        throw keyError;
      }

      // Use recommended gemini-3.5-flash for standard text tasks
      const modelName = "gemini-3.5-flash";
      let composedPrompt = prompt;

      if (isGroupSpecific && contextGroup) {
        composedPrompt = `Act as an expert envoy for the ${contextGroup.name} people. Answer this specific query concerning our heritage, lands, language, or present challenges: "${customPrompt}". Context: ${contextGroup.metadata.summary}. Give a concise, poignant 100-word response.`;
      } else if (contextGroup) {
        composedPrompt = `You are an expert geospatial cultural anthropologist, human-rights representative, and specialized consultant for the UNHCR and IWGIA. 
Analyze the following group:
- Name: ${contextGroup.name}
- Linguistic Family: ${contextGroup.metadata.language_family} (${contextGroup.familyName})
- Geographic Region: ${contextGroup.region}
- Population Count: ${contextGroup.population_count} (2026 Projection: ${contextGroup.metadata.population_projection_2026 || 'Pending'})
- Legal Status: ${contextGroup.metadata.legal_status}
- Summary: ${contextGroup.metadata.summary}

User Action / Question: ${prompt}

Provide an academic, respectful, rights-based response of about 150-200 words. Highlight self-determination indicators and cultural survival strategies. Highlight international instruments like ILO Convention 169. Formulate in clean Markdown.`;
      } else {
        composedPrompt = `${prompt}

Use the database of our mapped peoples (including the Sámi, Nenets, Pulaar, Jola, Maasai, San, Adivasi, Rohingya, Kurds, and Atakora Otamari) as case studies where relevant. Provide an academic, rights-based, respectful study of about 250 words. Format with headers and bullet points in Markdown.`;
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: composedPrompt,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini server error handler:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI response" });
    }
  });

  // Hot middleware integration in development or static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server ready on http://localhost:${PORT}`);
    console.log(`🌐 External access available on http://127.0.0.1:${PORT}`);
  });
}

startServer();
