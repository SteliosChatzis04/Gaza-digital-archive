
//llama-3.3-70b-versatile
const API_KEY = "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"; 


const MODEL_NAME = "llama-3.3-70b-versatile"; 
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Το περιεχόμενο του Site (Context)
const websiteContext = `
You are a helpful assistant for the website "The History We Ought to Know - Gaza".
Your goal is to answer visitor questions based STRICTLY on the following information.
Keep answers concise and empathetic.

WEBSITE CONTENT SUMMARY:
- 1948 (The Nakba): 750,000 Palestinians displaced. 200,000 fled to Gaza.
- 1967 (Occupation): Israel captured Gaza in the Six-Day War. Start of military occupation.
- 2007 (Blockade): Hamas elected. Israel imposed land, air, sea blockade. Economy collapsed.
- 2023 (Total War): Massive offensive after Oct 7. "Domicide" (destruction of homes).
- 2024 (ICJ): South Africa vs Israel. ICJ ruled genocide is "plausible".
- Statistics: 41,000+ Killed (16k children), 95,000+ Injured, 1.9 Million Displaced (90%).
- Infrastructure: 60% of housing destroyed. 33/36 hospitals non-functional.
- Testimonies: UNRWA ("War on children"), MSF ("Health system collapsed"), Dr. Abu-Sittah ("No morphine").
- Map Areas: Gaza City (Al-Shifa destroyed), Rafah (1.4M refugees), Jabalia Camp.
- Donation: Goal 60% achieved. Options: 5€, 10€, 20€, 50€.
`;

document.addEventListener('DOMContentLoaded', () => {
    console.log("Chatbot Loaded - Powered by Llama 3.3 (Groq)");

    const toggleBtn = document.getElementById('ai-toggle-btn');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeBtn = document.getElementById('ai-close-btn');
    const sendBtn = document.getElementById('ai-send-btn');
    const inputField = document.getElementById('ai-input');
    const messagesContainer = document.getElementById('ai-messages');
    
    // Markdown parser (αν υπάρχει)
    const md = window.markdownit ? window.markdownit() : { render: (t) => t };

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('d-none');
            if (!chatWindow.classList.contains('d-none')) inputField.focus();
        });
    }
    if (closeBtn) closeBtn.addEventListener('click', () => chatWindow.classList.add('d-none'));

    async function sendMessage() {
        const userText = inputField.value.trim();
        if (!userText) return;

        // 1. Εμφάνιση μηνύματος χρήστη
        appendMessage(userText, 'user');
        inputField.value = '';
        
        // 2. Εμφάνιση Loading
        const loadingId = appendMessage("Thinking<span class='typing-dots'></span>", 'bot', true);

        try {
            // 3. Κλήση στο Groq API
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: MODEL_NAME,
                    messages: [
                        {
                            role: "system",
                            content: websiteContext
                        },
                        {
                            role: "user",
                            content: userText
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error?.message || "API Error");
            }

            const data = await response.json();
            const botResponse = data.choices[0].message.content;

            // 4. Εμφάνιση απάντησης
            document.getElementById(loadingId).remove();
            appendMessage(botResponse, 'bot');

        } catch (error) {
            console.error("Groq Error:", error);
            document.getElementById(loadingId).remove();
            appendMessage(`⚠️ Error: ${error.message}. Check your API Key.`, 'bot');
        }
    }

    function appendMessage(text, sender, isLoading = false) {
        const div = document.createElement('div');
        div.classList.add(sender === 'user' ? 'ai-msg-user' : 'ai-msg-bot');
        if (isLoading) div.id = 'loading-' + Date.now();
        
        if (sender === 'bot' && !isLoading) {
            div.innerHTML = md.render(text);
        } else {
            div.innerHTML = text;
        }

        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return div.id;
    }

    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (inputField) inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});