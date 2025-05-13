const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');

// Configure OpenAI
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Chat endpoint
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI assistant on Lorenzo Franco's portfolio website. You can help visitors learn more about Lorenzo's work, experience, and skills. Keep responses concise and friendly."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        res.json({ response: completion.data.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

module.exports = router; 