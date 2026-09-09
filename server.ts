/**
 * FitAdapt - Servidor Full-Stack Express + Vite Middleware
 * FASE 9: Integración de FitAdapt AI y API Server-Side
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialization del cliente Gemini para evitar caídas al inicio si falta la clave
let genAIClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// =========================================================================
// ENDPOINTS DE API (SIEMPRE ANTES DEL MIDDLEWARE DE VITE)
// =========================================================================

// Health check
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'ok',
    phase: 9,
    assistant: 'FitAdapt AI',
    geminiConfigured: hasKey,
  });
});

// FitAdapt AI Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { query, context, history } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Parámetro query requerido.' });
    }

    const ai = getGeminiClient();

    // Si no hay API key configurada, responder indicando fallback al cliente
    if (!ai) {
      return res.json({
        isFallback: true,
        content: null,
        message: 'Servicio externo de Gemini no configurado en este entorno. Usando motor asistivo local.',
      });
    }

    // Preparar contexto para Gemini
    const contextPrompt = `
[CONTEXTO TÉCNICO SANITIZADO DEL USUARIO]:
${JSON.stringify(context || {}, null, 2)}

[INSTRUCCIONES CLAVE]:
- Eres FitAdapt AI.
- NUNCA diagnostiques lesiones ni patologías médicas. Si preguntan por diagnóstico o dolor agudo, recházalo categóricamente y recomienda evaluación profesional.
- NUNCA inventes ejercicios que no existan en el contexto o en la biblioteca de FitAdapt.
- Sé concisa, estructurada, motivadora y clara. Prioriza la seguridad sobre la intensidad.
`;

    const chatContents: any[] = [];

    // Historial previo
    if (Array.isArray(history) && history.length > 0) {
      for (const msg of history.slice(-4)) {
        chatContents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }
    }

    // Mensaje actual
    chatContents.push({
      role: 'user',
      parts: [{ text: `${contextPrompt}\n\nPregunta del usuario:\n${query}` }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContents,
      config: {
        systemInstruction:
          'Eres FitAdapt AI, un asistente educativo y respetuoso con la seguridad articular. No diagnostiques. No inventes ejercicios.',
        temperature: 0.7,
      },
    });

    const textOutput = response.text || '';

    return res.json({
      content: textOutput,
      isFallback: false,
    });
  } catch (error: any) {
    console.error('Error en /api/ai/chat:', error?.message || error);
    // Responder con isFallback true para que el cliente use de inmediato el FallbackAssistant
    return res.json({
      isFallback: true,
      content: null,
      error: error?.message,
    });
  }
});

// =========================================================================
// MIDDLEWARE DE VITE / SERVIDO ESTÁTICO SPA
// =========================================================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FitAdapt Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
