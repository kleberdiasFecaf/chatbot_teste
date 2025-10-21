document.addEventListener("DOMContentLoaded", () => {
    const chatLog = document.getElementById("chat-log");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === "") return;

        addMessageToLog("Você", message);
        userInput.value = "";

        try {
            // Isso envia a mensagem para o nosso backend (que estará em /api/chat)
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: message }),
            });

            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }

            const data = await response.json();
            addMessageToLog("Gemini", data.text);

        } catch (error) {
            console.error("Erro:", error);
            addMessageToLog("Erro", "Não foi possível conectar ao bot.");
        }
    }

    function addMessageToLog(sender, message) {
        const messageElement = document.createElement("div");
        
        // Adiciona classes para o CSS
        messageElement.classList.add("message");
        if (sender === "Você") {
            messageElement.classList.add("user-message");
        } else {
            messageElement.classList.add("bot-message");
        }

        // Limpa a mensagem antes de adicionar (Previne XSS)
        const senderStrong = document.createElement("strong");
        senderStrong.textContent = `${sender}: `;
        
        const messageText = document.createTextNode(message);
        
        messageElement.appendChild(senderStrong);
        messageElement.appendChild(messageText);

        chatLog.appendChild(messageElement);
        chatLog.scrollTop = chatLog.scrollHeight; // Rolar para a última msg
    }
});