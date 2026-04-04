document.addEventListener('DOMContentLoaded', () => {
    
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

    if (openChatBtn) openChatBtn.addEventListener('click', () => chatWrapper.classList.add('active'));
    if (closeChatBtn) closeChatBtn.addEventListener('click', () => chatWrapper.classList.remove('active'));

    // Start Chat (Strict 10 Digit Check)
    if (startChatBtn) {
        startChatBtn.addEventListener('click', () => {
            const name = userNameInput.value.trim();
            const phoneInput = document.getElementById('chat-user-phone');
            const phone = phoneInput ? phoneInput.value.trim() : "";

            if (phone.length !== 10 || isNaN(phone)) {
                alert("Access Denied: Please enter exactly 10 digits for your phone number.");
                return;
            }

            if (name !== "") {
                currentUserName = name;
                if(window.logActivity) window.logActivity("Started AI Health Chat");
                
                introScreen.style.display = 'none';
                chatContainer.style.display = 'flex';
                inputContainer.style.display = 'flex';
                
                setTimeout(() => {
                    appendMessage("ai", `Namaste ${currentUserName}! Welcome to AN Fractures. How can I assist you today?`);
                }, 500);
            } else {
                alert("Please enter your name to start chatting.");
            }
        });
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (text === "") return;
        appendMessage("user", text);
        chatInput.value = "";

        setTimeout(() => {
            const reply = generateAIResponse(text.toLowerCase());
            appendMessage("ai", reply);
        }, 800);
    }

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-msg', sender);
        let avatarIcon = sender === "ai" ? '<i class="fa-solid fa-robot"></i>' : '<i class="fa-regular fa-user"></i>';
        msgDiv.innerHTML = `<div class="msg-avatar">${avatarIcon}</div><div class="msg-text">${text}</div>`;
        chatContainer.appendChild(msgDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function generateAIResponse(userInput) {
        for (let item of aiBrain) {
            for (let keyword of item.keywords) {
                if (userInput.includes(keyword)) return item.response;
            }
        }
        return aiFallback;
    }
});
