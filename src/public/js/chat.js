document.addEventListener('DOMContentLoaded', () => {
    // Create chat widget HTML
    const chatWidget = document.createElement('div');
    chatWidget.className = 'chat-widget';
    chatWidget.innerHTML = `
        <div class="chat-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
        </div>
        <div class="chat-container">
            <div class="chat-header">
                <h3>Chat with AI Assistant</h3>
            </div>
            <div class="chat-messages"></div>
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="chat-input">
                <input type="text" placeholder="Type your message...">
                <button class="send-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(chatWidget);

    // Get DOM elements
    const chatButton = chatWidget.querySelector('.chat-button');
    const chatContainer = chatWidget.querySelector('.chat-container');
    const messagesContainer = chatWidget.querySelector('.chat-messages');
    const input = chatWidget.querySelector('input');
    const sendButton = chatWidget.querySelector('.send-button');
    const typingIndicator = chatWidget.querySelector('.typing-indicator');

    // Toggle chat container
    chatButton.addEventListener('click', () => {
        const isVisible = chatContainer.style.display === 'flex';
        chatContainer.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible) {
            input.focus();
        }
    });

    // Send message function
    async function sendMessage(message) {
        // Add user message to chat
        const userMessageElement = document.createElement('div');
        userMessageElement.className = 'message user-message';
        userMessageElement.textContent = message;
        messagesContainer.appendChild(userMessageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Show typing indicator
        typingIndicator.style.display = 'flex';

        try {
            // Send message to server
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();

            // Hide typing indicator
            typingIndicator.style.display = 'none';

            // Add AI response to chat
            const aiMessageElement = document.createElement('div');
            aiMessageElement.className = 'message assistant-message';
            aiMessageElement.textContent = data.response;
            messagesContainer.appendChild(aiMessageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
            typingIndicator.style.display = 'none';
            
            // Add error message to chat
            const errorMessageElement = document.createElement('div');
            errorMessageElement.className = 'message assistant-message';
            errorMessageElement.textContent = 'Sorry, I encountered an error. Please try again.';
            messagesContainer.appendChild(errorMessageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // Handle send button click
    sendButton.addEventListener('click', () => {
        const message = input.value.trim();
        if (message) {
            sendMessage(message);
            input.value = '';
        }
    });

    // Handle enter key press
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = input.value.trim();
            if (message) {
                sendMessage(message);
                input.value = '';
            }
        }
    });
}); 