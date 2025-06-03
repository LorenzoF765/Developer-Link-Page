export default function handler(req, res) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        const { message } = req.body;

        // --- Simulated AI logic ---
        let response = "I'm just a simulated AI!";

        if (!message || typeof message !== 'string') {
            response = "Please enter a message!";
        } else if (/hello|hi|hey/i.test(message)) {
            response = "Hello! How can I help you today?";
        } else if (/portfolio|project/i.test(message)) {
            response = "You can check out my projects on the Projects page!";
        } else if (/who are you/i.test(message)) {
            response = "I'm a friendly chatbot built by Lorenzo Franco for this portfolio.";
        } else if (/thank/i.test(message)) {
            response = "You're welcome!";
        } else if (/skills?/i.test(message)) {
            response = "Lorenzo's skills include full-stack development, game design, AI integration, and more!";
        } else if (/contact/i.test(message)) {
            response = "You can reach Lorenzo via the Contact page or at lorenzof764@gmail.com.";
        } else if (/dnd|dungeons|dragons/i.test(message)) {
            response = "Lorenzo loves playing D&D with his group, 'The Menagerie of Fools'!";
        }

        res.status(200).json({ response });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}