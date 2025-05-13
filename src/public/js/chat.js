class AIChat {
    constructor() {
        this.chatContainer = null;
        this.messageList = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        // Create chat UI
        this.createChatUI();
        // Add event listeners
        this.addEventListeners();
    }

    createChatUI() {
        // Create chat container
        this.chatContainer = document.createElement('div');
        this.chatContainer.className = 'chat-container';
        this.chatContainer.innerHTML = `
            <div class="chat-button">
                <img src="./Assets/Images/chat-icon.png" alt="Chat" />
            </div>
            <div class="chat-box">
                <div class="chat-header">
                    <h3>AI Assistant</h3>
                    <button class="minimize-btn">−</button>
                </div>
                <div class="chat-messages">
                    <div class="message assistant">
                        <div class="message-content">
                            Hi! I'm your AI assistant. How can I help you today?
                        </div>
                    </div>
                </div>
                <div class="chat-input">
                    <textarea 
                        placeholder="Type your message here..." 
                        rows="1"
                        maxlength="500"
                    ></textarea>
                    <button class="send-btn">
                        <img src="./Assets/Images/send-icon.png" alt="Send" />
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(this.chatContainer);
        this.messageList = this.chatContainer.querySelector('.chat-messages');
    }

    addEventListeners() {
        const chatButton = this.chatContainer.querySelector('.chat-button');
        const minimizeBtn = this.chatContainer.querySelector('.minimize-btn');
        const textarea = this.chatContainer.querySelector('textarea');
        const sendBtn = this.chatContainer.querySelector('.send-btn');

        // Toggle chat box
        chatButton.addEventListener('click', () => this.toggleChat());
        minimizeBtn.addEventListener('click', () => this.toggleChat());

        // Send message on enter (but allow shift+enter for new lines)
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
        });

        // Send button click
        sendBtn.addEventListener('click', () => this.sendMessage());
    }

    async sendMessage() {
        const textarea = this.chatContainer.querySelector('textarea');
        const message = textarea.value.trim();
        
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        textarea.value = '';
        textarea.style.height = 'auto';

        // Show typing indicator
        this.addTypingIndicator();

        try {
            const response = await this.getAIResponse(message);
            // Remove typing indicator and add AI response
            this.removeTypingIndicator();
            this.addMessage(response, 'assistant');
        } catch (error) {
            this.removeTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'assistant error');
        }
    }

    async getAIResponse(message) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                ${this.formatMessage(content)}
            </div>
        `;
        this.messageList.appendChild(messageDiv);
        this.messageList.scrollTop = this.messageList.scrollHeight;
    }

    formatMessage(content) {
        // Convert URLs to links
        content = content.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank">$1</a>'
        );
        // Convert newlines to <br>
        return content.replace(/\n/g, '<br>');
    }

    addTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message assistant typing';
        indicator.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        this.messageList.appendChild(indicator);
        this.messageList.scrollTop = this.messageList.scrollHeight;
    }

    removeTypingIndicator() {
        const indicator = this.messageList.querySelector('.typing');
        if (indicator) {
            indicator.remove();
        }
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatContainer.classList.toggle('open', this.isOpen);
    }
}

// Initialize chat when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AIChat();
}); 