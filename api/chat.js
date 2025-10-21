// api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("ERRO: GEMINI_API_KEY não encontrada nas variáveis de ambiente.");
            return res.status(500).json({ error: 'Erro interno do servidor: Chave de API não configurada.' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt é obrigatório' });
        }

        // --- AQUI ESTÁ A CORREÇÃO FINAL ---
        // Se o "flash" não funciona, vamos usar o "pro".
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        // --- FIM DA CORREÇÃO ---

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ text: text });

    } catch (error) {
        console.error("Erro ao chamar a API Gemini:", error);
        res.status(500).json({ error: 'Erro interno do servidor ao processar a IA.' });
    }
}