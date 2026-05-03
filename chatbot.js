// ChatBot Class
class ChatBot {
    constructor() {
        // ⚠️ Important: Replace with your n8n webhook URL
        // ****************************************************************
        this.webhookUrl = 'https://a3g.app.n8n.cloud/webhook/chat';
        // ****************************************************************        
        // Initialize session ID
        this.sessionId = this.getOrCreateSessionId();
        
        // Create ChatBot UI
        this.createChatBotUI();
        
        // DOM elements
        this.chatbotToggle = document.getElementById('chatbotToggle');
        this.chatbotPanel = document.getElementById('chatbotPanel');
        this.chatbotClose = document.getElementById('chatbotClose');
        this.clearChatBtn = document.getElementById('clearChatBtn');
        this.messagesContainer = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.notificationBadge = document.getElementById('notificationBadge');
        
        // Bind events
        this.bindEvents();
        
        // Load chat history
        this.loadChatHistory();
        
        console.log('ChatBot initialized successfully, Session ID:', this.sessionId);
    }
    
    createChatBotUI() {
        // Create CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .chatbot-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            }

            .chatbot-toggle {
                width: 70px;
                height: 70px;
                background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
                border: none;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 8px 25px rgba(59, 130, 246, 0.35);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                color: white;
                font-size: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                animation: float 3s ease-in-out infinite;
            }

            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }

            .chatbot-toggle:hover {
                transform: scale(1.12) translateY(-3px);
                box-shadow: 0 12px 35px rgba(59, 130, 246, 0.45);
                background: linear-gradient(135deg, #4f95ff 0%, #2563eb 100%);
            }

            .chatbot-toggle:active {
                transform: scale(0.95);
            }

            .notification-badge {
                position: absolute;
                top: -8px;
                right: -8px;
                width: 24px;
                height: 24px;
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                border-radius: 50%;
                display: none;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: bold;
                box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.15); }
            }

            .chatbot-panel {
                position: absolute;
                bottom: 90px;
                right: 0;
                width: 420px;
                height: 600px;
                background: white;
                border-radius: 24px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
                display: none;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid rgba(226, 232, 240, 0.5);
                backdrop-filter: blur(10px);
            }

            .chatbot-panel.active {
                display: flex;
                animation: slideInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            }

            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(40px) scale(0.92);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .chatbot-header {
                background: linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #1e40af 100%);
                color: white;
                padding: 22px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(2, 132, 199, 0.2);
            }

            .chatbot-header::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
                animation: shimmer 4s infinite;
            }

            @keyframes shimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }

            .chatbot-title {
                font-size: 18px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 10px;
                letter-spacing: 0.3px;
                position: relative;
                z-index: 1;
            }

            .title-icon {
                font-size: 22px;
                animation: bounce 2.5s infinite;
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }

            .chatbot-header-buttons {
                display: flex;
                gap: 8px;
                align-items: center;
                position: relative;
                z-index: 1;
            }

            .chatbot-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                position: relative;
            }

            .chatbot-btn:hover {
                background: rgba(255,255,255,0.3);
                transform: scale(1.1);
            }

            .chatbot-btn:active {
                transform: scale(0.95);
            }

            .chatbot-close {
                font-size: 20px;
            }

            .chatbot-close:hover {
                transform: rotate(90deg) scale(1.1);
            }

            .clear-btn {
                font-size: 16px;
                position: relative;
            }

            .clear-btn:hover {
                background: rgba(239, 68, 68, 0.3);
            }

            .clear-btn-tooltip {
                position: absolute;
                top: 50%;
                right: 100%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
                z-index: 1000;
                margin-right: 10px;
            }

            .clear-btn:hover .clear-btn-tooltip {
                opacity: 1;
            }

            .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 14px;
                background: linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%);
                position: relative;
            }

            .chat-messages::-webkit-scrollbar {
                width: 6px;
            }

            .chat-messages::-webkit-scrollbar-track {
                background: transparent;
            }

            .chat-messages::-webkit-scrollbar-thumb {
                background: #94c5f5;
                border-radius: 3px;
            }

            .chat-messages::-webkit-scrollbar-thumb:hover {
                background: #60a5fa;
            }

            .chat-messages::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: 
                    radial-gradient(circle at 20% 20%, rgba(3, 105, 161, 0.08) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                    radial-gradient(circle at 40% 60%, rgba(96, 165, 250, 0.06) 0%, transparent 50%);
                pointer-events: none;
            }

            .message {
                max-width: 85%;
                padding: 12px 16px;
                border-radius: 18px;
                line-height: 1.5;
                word-wrap: break-word;
                font-size: 15px;
                animation: messageSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                z-index: 1;
            }

            @keyframes messageSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(15px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .message.user {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 6px;
                box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
                font-weight: 500;
            }

            .message.user::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
                border-radius: inherit;
            }

            .message.ai {
                background: white;
                color: #1e293b;
                align-self: flex-start;
                border-bottom-left-radius: 6px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                border-left: 3px solid #0284c7;
            }

            .message.error-message {
                background: linear-gradient(135deg, #fee2e2, #fecaca);
                color: #7f1d1d;
                align-self: flex-start;
                border-bottom-left-radius: 6px;
                border-left: 3px solid #dc2626;
            }

            .typing-indicator {
                display: none;
                align-items: center;
                gap: 6px;
                padding: 15px 18px;
                background: white;
                border-radius: 18px;
                border-bottom-left-radius: 6px;
                border-left: 3px solid #0284c7;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                width: fit-content;
            }

            .typing-dot {
                width: 8px;
                height: 8px;
                background: #60a5fa;
                border-radius: 50%;
                animation: typing 1.4s infinite;
            }

            .typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }

            .typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes typing {
                0%, 60%, 100% { 
                    transform: translateY(0);
                    opacity: 0.6;
                }
                30% { 
                    transform: translateY(-8px);
                    opacity: 1;
                }
            }

            .chat-input {
                padding: 16px;
                background: white;
                border-top: 1px solid #e2e8f0;
                display: flex;
                gap: 10px;
                align-items: flex-end;
                position: relative;
            }

            .input-field {
                flex: 1;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                padding: 11px 14px;
                font-size: 14px;
                font-family: inherit;
                resize: none;
                transition: all 0.3s ease;
                max-height: 100px;
                line-height: 1.4;
                color: #1e293b;
            }

            .input-field:focus {
                outline: none;
                border-color: #0284c7;
                box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
                background: #f8fafc;
            }

            .input-field::placeholder {
                color: #94a3b8;
            }

            .send-button {
                background: linear-gradient(135deg, #3b82f6 0%, #0284c7 100%);
                color: white;
                border: none;
                border-radius: 12px;
                padding: 10px 18px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                display: flex;
                align-items: center;
                gap: 6px;
                min-width: 50px;
                justify-content: center;
            }

            .send-button:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
                background: linear-gradient(135deg, #4f95ff 0%, #0369a1 100%);
            }

            .send-button:active:not(:disabled) {
                transform: translateY(0);
            }

            .send-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            /* Responsive design */
            @media (max-width: 480px) {
                .chatbot-panel {
                    width: calc(100vw - 30px);
                    height: 70vh;
                    max-height: 600px;
                    bottom: 100px;
                    right: 15px;
                }

                .chatbot-toggle {
                    width: 60px;
                    height: 60px;
                    font-size: 24px;
                }

                .message {
                    max-width: 90%;
                }
            }
        `;
        
        document.head.appendChild(style);
        
        // Create HTML structure
        const chatbotHTML = `
            <div class="chatbot-widget">
                <button class="chatbot-toggle" id="chatbotToggle" title="Open Chat">
                    💬
                    <div class="notification-badge" id="notificationBadge"></div>
                </button>
                
                <div class="chatbot-panel" id="chatbotPanel">
                    <div class="chatbot-header">
                        <div class="chatbot-title">
                            <span class="title-icon">🎓</span>
                            <span>欒老師AI課程聊天BOT</span>
                        </div>
                        <div class="chatbot-header-buttons">
                            <button class="chatbot-btn clear-btn" id="clearChatBtn" title="Clear chat history">
                                🗑️
                                <span class="clear-btn-tooltip">清除記錄</span>
                            </button>
                            <button class="chatbot-btn chatbot-close" id="chatbotClose" title="Close Chat">×</button>
                        </div>
                    </div>
                    
                    <div class="chat-messages" id="chatMessages">
                        <div id="typingIndicator" class="typing-indicator">
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                        </div>
                    </div>
                    
                    <div class="chat-input">
                        <input 
                            type="text" 
                            class="input-field" 
                            id="messageInput" 
                            placeholder="輸入您的問題..."
                            maxlength="500"
                        >
                        <button class="send-button" id="sendButton" disabled>發送</button>
                    </div>
                </div>
            </div>
        `;
        
        // Insert at end of body
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }
    
    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('chatbot_session_id');
        if (!sessionId) {
            sessionId = 'web_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chatbot_session_id', sessionId);
        }
        return sessionId;
    }
    
    bindEvents() {
        // Chatbot toggle
        this.chatbotToggle.addEventListener('click', () => {
            this.toggleChatbot();
        });
        
        this.chatbotClose.addEventListener('click', () => {
            this.closeChatbot();
        });

        // Clear chat button
        this.clearChatBtn.addEventListener('click', () => {
            if (confirm('確定要清除所有聊天記錄嗎？此動作無法復原。')) {
                this.clearHistory();
            }
        });
        
        // Send button click event
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Input field key press event
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Input field input event
        this.messageInput.addEventListener('input', () => {
            this.sendButton.disabled = this.messageInput.value.trim() === '';
        });
        
        // Click outside to close chatbot
        document.addEventListener('click', (e) => {
            if (!this.chatbotToggle.contains(e.target) && 
                !this.chatbotPanel.contains(e.target) && 
                this.chatbotPanel.classList.contains('active')) {
                this.closeChatbot();
            }
        });
    }
    
    toggleChatbot() {
        if (this.chatbotPanel.classList.contains('active')) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }
    
    openChatbot() {
        this.chatbotPanel.classList.add('active');
        this.messageInput.focus();
        this.hideNotification();
        this.scrollToBottom();
    }
    
    closeChatbot() {
        this.chatbotPanel.classList.remove('active');
    }
    
    showNotification() {
        this.notificationBadge.style.display = 'flex';
    }
    
    hideNotification() {
        this.notificationBadge.style.display = 'none';
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        // Show user message
        this.addMessage(message, 'user');
        
        // Clear input and disable send button
        this.messageInput.value = '';
        this.sendButton.disabled = true;
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Send request to n8n webhook
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: this.sessionId,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.message) {
                this.addMessage(data.message, 'ai');
                
                // Save conversation to local storage
                this.saveChatToLocal(message, data.message);
                
                // Show notification if chatbot is closed
                if (!this.chatbotPanel.classList.contains('active')) {
                    this.showNotification();
                }
            } else {
                throw new Error('Invalid response format');
            }
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessage('抱歉，發生錯誤。請檢查您的網路連線或稍後重試。', 'error-message');
        } finally {
            // Hide typing indicator
            this.hideTypingIndicator();
        }
    }
    
    addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = content;
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }
    
    saveChatToLocal(userMessage, aiMessage) {
        const chatHistory = JSON.parse(localStorage.getItem('chatbot_history') || '[]');
        
        chatHistory.push({
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            userMessage: userMessage,
            aiMessage: aiMessage
        });
        
        // Limit history records (keep max 100 entries)
        if (chatHistory.length > 100) {
            chatHistory.splice(0, chatHistory.length - 100);
        }
        
        localStorage.setItem('chatbot_history', JSON.stringify(chatHistory));
    }
    
    loadChatHistory() {
        const chatHistory = JSON.parse(localStorage.getItem('chatbot_history') || '[]');
        const currentSessionHistory = chatHistory.filter(chat => chat.sessionId === this.sessionId);
        
        // Only load the latest 10 conversations
        const recentHistory = currentSessionHistory.slice(-10);
        
        recentHistory.forEach(chat => {
            this.addMessage(chat.userMessage, 'user');
            this.addMessage(chat.aiMessage, 'ai');
        });
        
        if (recentHistory.length === 0) {
            // If no history, show welcome message
            setTimeout(() => {
                this.addMessage('你好！我是欒老師的AI課程助手。有任何問題嗎？', 'ai');
            }, 1000);
        }
    }
    
    // Method to clear chat history (can be called in console)
    clearHistory() {
        localStorage.removeItem('chatbot_history');
        localStorage.removeItem('chatbot_session_id');
        location.reload();
    }
}

// Initialize ChatBot
document.addEventListener('DOMContentLoaded', function() {
    // Wait one second to ensure page is fully loaded
    setTimeout(() => {
        window.chatBot = new ChatBot();
        
        // Provide method to clear history in console
        window.clearChatHistory = () => {
            if (confirm('Are you sure you want to clear all chat history?')) {
                window.chatBot.clearHistory();
            }
        };
        
        console.log('ChatBot loaded successfully!');
        console.log('To clear chat history, run in console: clearChatHistory()');
    }, 1000);
});
