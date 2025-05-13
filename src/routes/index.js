const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
    res.render('home', {
        title: 'Home',
        page: 'home'
    });
});

// About page
router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        page: 'about'
    });
});

// Projects page
router.get('/projects', (req, res) => {
    res.render('projects', {
        title: 'Projects',
        page: 'projects'
    });
});

// Skills page
router.get('/skills', (req, res) => {
    res.render('skills', {
        title: 'Skills',
        page: 'skills'
    });
});

// Experience page
router.get('/experience', (req, res) => {
    res.render('experience', {
        title: 'Experience',
        page: 'experience'
    });
});

// Contact page
router.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact',
        page: 'contact'
    });
});

module.exports = router; 