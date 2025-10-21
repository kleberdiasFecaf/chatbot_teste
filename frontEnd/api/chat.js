// Importa o SDK do Google
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Pega sua Chave de API secreta (veja o Passo 4 sobre como fazer isso)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Esta é a função que a Vercel/Netlify irá executar
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
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
        console.error("Erro ao chamar a API Gemini:", error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}