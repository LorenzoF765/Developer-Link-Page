const path = require('path');
const ResumeData = require('../models/resumeData');

class ResumeController {
    constructor() {
        this.resumeData = new ResumeData();
        this.isLoaded = false;
    }

    async loadResumeData() {
        if (this.isLoaded) return;

        const pdfPath = path.join(__dirname, '../../src/public/resume/Lorenzo_Franco_Resume.pdf');
        const success = await this.resumeData.loadFromPDF(pdfPath);
        
        if (success) {
            this.isLoaded = true;
            console.log('Resume data loaded successfully');
        } else {
            console.error('Failed to load resume data');
        }
    }

    async getExperience() {
        await this.loadResumeData();
        return this.resumeData.experience;
    }

    async getSkills() {
        await this.loadResumeData();
        return this.resumeData.skills;
    }

    async getProjects() {
        await this.loadResumeData();
        return this.resumeData.projects;
    }

    async getEducation() {
        await this.loadResumeData();
        return this.resumeData.education;
    }

    async getContact() {
        await this.loadResumeData();
        return this.resumeData.contact;
    }

    async getAllData() {
        await this.loadResumeData();
        return this.resumeData;
    }
}

// Create a singleton instance
const resumeController = new ResumeController();
module.exports = resumeController; 