// ==========================================
// AI CHATBOT LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Chat DOM Elements
    const chatWrapper = document.getElementById('chat-wrapper');
    const openChatBtn = document.getElementById('open-ai-chat');
    const closeChatBtn = document.getElementById('close-chat-btn');
    
    const introScreen = document.getElementById('chat-intro');
    const chatContainer = document.getElementById('chat-messages');
    const inputContainer = document.getElementById('chat-input-area');
    
    const startChatBtn = document.getElementById('start-chat-btn');
    const userNameInput = document.getElementById('chat-user-name');
    
    const chatInput = document.getElementById('chat-msg-input');
    const sendBtn = document.getElementById('send-msg-btn');
    
    let currentUserName = "";

    // 1. Open / Close Chat
    if (openChatBtn) {
        openChatBtn.addEventListener('click', () => {
            chatWrapper.classList.add('active');
        });
    }

    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', () => {
            chatWrapper.classList.remove('active');
        });
    }

    // 2. Start Chat (After Intro Form)
    if (startChatBtn) {
        startChatBtn.addEventListener('click', () => {
            const name = userNameInput.value.trim();
            if (name !== "") {
                currentUserName = name;
                
                // Hide Intro, Show Chat Interface
                introScreen.style.display = 'none';
                chatContainer.style.display = 'flex';
                inputContainer.style.display = 'flex';
                
                // Send Welcome Message
                setTimeout(() => {
                    appendMessage("ai", `Namaste ${currentUserName}! Welcome to AN Fractures & Physiotherapist. I'm your AI health assistant. I can help you with appointment booking, information about our doctors, clinic timings, and health guidance. How can I assist you today?`);
                }, 500);
            } else {
                alert("Please enter your name to start chatting.");
            }
        });
    }

    // 3. Send Message functionality
    function handleSend() {
        const text = chatInput.value.trim();
        if (text === "") return;

        // Show User Message
        appendMessage("user", text);
        chatInput.value = "";

        // Process AI Reply
        setTimeout(() => {
            const reply = generateAIResponse(text.toLowerCase());
            appendMessage("ai", reply);
        }, 800); // 0.8s delay to feel like a real human typing
    }

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    // 4. Append Message to UI
    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-msg', sender);
        
        let avatarIcon = sender === "ai" ? '<i class="fa-solid fa-robot"></i>' : '<i class="fa-regular fa-user"></i>';
        
        msgDiv.innerHTML = `
            <div class="msg-avatar">${avatarIcon}</div>
            <div class="msg-text">${text}</div>
        `;
        
        chatContainer.appendChild(msgDiv);
        
        // Auto scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // 5. Brain of the AI (Matching Keywords from data.js)
    function generateAIResponse(userInput) {
        // Checking aiBrain array coming from data.js
        for (let item of aiBrain) {
            for (let keyword of item.keywords) {
                if (userInput.includes(keyword)) {
                    return item.response;
                }
            }
        }
        return aiFallback;
    }
});
