import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable CSP for local development/preview compatibility
    })
  );

  // Gemini API Proxy
  app.post("/api/ai/process-anamnesis", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: "Text is required" });

      const prompt = `
        Você é um assistente especializado em nutrição e organização de prontuários nutricionais.
        Transforme o seguinte texto (que pode ser uma fala de um nutricionista ou anotações rápidas) em um prontuário estruturado focado em nutrologia e dietética.
        
        Texto recebido: "${text}"
        
        Retorne um JSON com exatamente estes campos em português:
        {
          "queixaPrincipal": "resumo do motivo da consulta/objetivo",
          "hda": "anamnese alimentar, hábitos diários, suplementação e história clínica",
          "antecedentes": "antecedentes pessoais, alergias e sensibilidades",
          "exameFisico": "achados de antropometria (avaliação corporal, peso, IMC)",
          "hipoteseDiagnostica": "avaliação do estado nutricional",
          "conduta": "conduta nutricional sugerida e plano alimentar base"
        }
        Apenas o JSON, sem markdown.
      `;

      const response = await genai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      
      let jsonText = response.text || "";
      jsonText = jsonText.replace(/```json|```/g, "").trim();
      res.json(JSON.parse(jsonText));
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to process nutritional text" });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context, history } = req.body;
      
      const systemInstruction = `
        Você é o assistente virtual inteligente de um software para Nutricionistas (NutriSystem).
        Sua missão é ajudar o nutricionista com informações dos relatórios, responder dúvidas e dar suporte sobre os dados do consultório.
        Seja educado, objetivo e prestativo. Contexto atual do banco de dados (Apenas leitura):
        ${context || 'Nenhum dado fornecido'}
      `;

      let contents = [];
      if (history && Array.isArray(history)) {
        contents = history.map((item: any) => ({
          role: item.role === 'model' ? 'model' : 'user',
          parts: [{ text: item.text }]
        }));
      }

      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await genai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
        }
      });
      
      res.json({ text: response.text });
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      res.status(500).json({ error: "Failed to process chat" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
