const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const resumeController = require('./src/controllers/resumeController');

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
    app.get('/', async (req, res) => {
        const data = await resumeController.getAllData();
        res.render('home', {
            title: 'Home',
            page: 'home',
            resumeData: data
        });
    });

    // About page
    app.get('/about', async (req, res) => {
        const data = await resumeController.getAllData();
        res.render('about', {
            title: 'About',
            page: 'about',
            resumeData: data
        });
    });

    // Projects page
    app.get('/projects', async (req, res) => {
        const projects = await resumeController.getProjects();
        res.render('projects', {
            title: 'Projects',
            page: 'projects',
            projects: projects
        });
    });

    // Skills page
    app.get('/skills', async (req, res) => {
        const skills = await resumeController.getSkills();
        res.render('skills', {
            title: 'Skills',
            page: 'skills',
            skills: skills
        });
    });

    // Experience page
    app.get('/experience', async (req, res) => {
        const experience = await resumeController.getExperience();
        const education = await resumeController.getEducation();
        res.render('experience', {
            title: 'Experience',
            page: 'experience',
            experience: experience,
            education: education
        });
    });

    // Contact page
    app.get('/contact', async (req, res) => {
        const contact = await resumeController.getContact();
        res.render('contact', {
            title: 'Contact',
            page: 'contact',
            contact: contact
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