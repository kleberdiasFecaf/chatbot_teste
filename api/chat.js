// api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// ATENÇÃO: NÃO inicialize o genAI aqui fora.

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        // --- INÍCIO DA CORREÇÃO ---
        // Mova a inicialização da API para DENTRO do try
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Se a chave não foi configurada no Vercel, falhe com uma mensagem clara
            console.error("ERRO: GEMINI_API_KEY não encontrada nas variáveis de ambiente.");
            return res.status(500).json({ error: 'Erro interno do servidor: Chave de API não configurada.' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // --- FIM DA CORREÇÃO ---

        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt é obrigatório' });
        }

        // Inicializa o modelo Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Gera o conteúdo
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Envia a resposta do Gemini de volta para o frontend
        res.status(200).json({ text: text });

    } catch (error) {
        // Agora este catch vai pegar erros da API (ex: chave inválida)
        console.error("Erro ao chamar a API Gemini:", error);
        res.status(500).json({ error: 'Erro interno do servidor ao processar a IA.' });
    }
}