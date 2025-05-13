const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');

// Load environment variables
dotenv.config();

const app = express();

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

// Middleware
app.use(express.json());
app.use(express.static('src/public'));
app.use('/Assets', express.static('Assets'));
app.use(express.static(path.join(__dirname)));

// Basic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Routes
try {
    // Home page
    app.get('/', (req, res) => {
        res.render('home', {
            title: 'Home',
            page: 'home'
        });
    });

    // About page
    app.get('/about', (req, res) => {
        res.render('about', {
            title: 'About',
            page: 'about'
        });
    });

    // Projects page
    app.get('/projects', (req, res) => {
        res.render('projects', {
            title: 'Projects',
            page: 'projects'
        });
    });

    // Skills page
    app.get('/skills', (req, res) => {
        res.render('skills', {
            title: 'Skills',
            page: 'skills'
        });
    });

    // Experience page
    app.get('/experience', (req, res) => {
        res.render('experience', {
            title: 'Experience',
            page: 'experience'
        });
    });

    // Contact page
    app.get('/contact', (req, res) => {
        res.render('contact', {
            title: 'Contact',
            page: 'contact'
        });
    });

    // API routes
    const apiRouter = require('./src/routes/api');
    app.use('/api', apiRouter);
} catch (error) {
    console.error('Error loading routes:', error);
}

// For local development
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

// Export the app for serverless use
module.exports = app; 