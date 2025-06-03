class AIChat {
    constructor() {
        this.chatContainer = null;
        this.messageList = null;
        this.isOpen = false;
        this.factoids = [
            "Did you know? Lorenzo Franco's portfolio features projects in Python, Node.js, React, and Unreal Engine!",
            "Fun fact: The D&D Initiative Tracker project was built to help manage complex combat scenarios for tabletop games.",
            "Lorenzo's resume is available as a PDF—just click the document icon on the homepage!",
            "The background animation on this site uses Vanta.js for a dynamic, interactive effect.",
            "Lorenzo's GitHub is packed with full-stack, AI, and game development projects. Check it out via the GitHub icon!",
            "This chatbot is front-end only and doesn't use any AI APIs—just a bit of JavaScript magic.",
            "Lorenzo enjoys playing D&D with his group, 'The Menagerie of Fools.'",
            "You can download the D&D Initiative Tracker EXE directly from the Projects page.",
            "Lorenzo's capstone project, The Neural Notebook, combines Python, Java, React, and Django.",
            "Want to get in touch? Use the Contact page or any of the social icons at the bottom!"
        ];
        this.init();
    }

    init() {
        this.createChatUI();
        this.addEventListeners();
    }

    createChatUI() {
        this.chatContainer = document.createElement('div');
        this.chatContainer.className = 'chat-container';
        this.chatContainer.innerHTML = `
            <div class="chat-button" tabindex="0" aria-label="Open chat">
                <img src="/images/chat-icon.svg" alt="Chat" />
            </div>
            <div class="chat-box" aria-modal="true" role="dialog">
                <div class="chat-header">
                    <h3>AI Assistant</h3>
                    <button class="minimize-btn" aria-label="Minimize chat">−</button>
                </div>
                <div class="chat-messages" aria-live="polite"></div>
                <div class="chat-input">
                    <textarea 
                        placeholder="Type your message here..." 
                        rows="1"
                        maxlength="500"
                        aria-label="Type your message"
                    ></textarea>
                    <button class="send-btn" aria-label="Send message">
                        <img src="/images/send-icon.svg" alt="Send" />
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(this.chatContainer);
        this.messageList = this.chatContainer.querySelector('.chat-messages');
        // Initial greeting
        this.addMessage("Hi! I'm your portfolio assistant. Ask me anything about this site or Lorenzo's work!", 'assistant');
    }

    addEventListeners() {
        const chatButton = this.chatContainer.querySelector('.chat-button');
        const minimizeBtn = this.chatContainer.querySelector('.minimize-btn');
        const textarea = this.chatContainer.querySelector('textarea');
        const sendBtn = this.chatContainer.querySelector('.send-btn');

        // Toggle chat box
        chatButton.addEventListener('click', () => this.toggleChat());
        chatButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleChat();
            }
        });
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

    sendMessage() {
        const textarea = this.chatContainer.querySelector('textarea');
        const message = textarea.value.trim();

        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        textarea.value = '';
        textarea.style.height = 'auto';

        // Show typing indicator
        this.addTypingIndicator();

        setTimeout(() => {
            this.removeTypingIndicator();
            const response = this.getFactoidResponse(message);
            this.addMessage(response, 'assistant');
        }, 700);
    }

    getFactoidResponse(userMessage) {
        // Optionally, you can add some keyword-based responses here
        // For now, always return a random factoid
        return this.factoids[Math.floor(Math.random() * this.factoids.length)];
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
        // Focus textarea when opening
        if (this.isOpen) {
            setTimeout(() => {
                const textarea = this.chatContainer.querySelector('textarea');
                if (textarea) textarea.focus();
            }, 200);
        }
    }
}

// Initialize chat when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AIChat();
});