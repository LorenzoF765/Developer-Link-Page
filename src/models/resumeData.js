const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');

class ResumeData {
    constructor() {
        this.experience = [];
        this.education = [];
        this.skills = {
            technical: [],
            soft: [],
            tools: []
        };
        this.projects = [];
        this.contact = {};
    }

    async loadFromPDF(pdfPath) {
        try {
            const dataBuffer = await fs.readFile(pdfPath);
            const data = await pdf(dataBuffer);
            const text = data.text;

            // Parse sections
            await this.parseText(text);
            return true;
        } catch (error) {
            console.error('Error loading resume data:', error);
            return false;
        }
    }

    async parseText(text) {
        // Split text into sections (this is a basic implementation)
        const sections = text.split('\n\n');
        
        for (let section of sections) {
            section = section.trim();
            
            // Experience section
            if (section.toLowerCase().includes('experience') || section.toLowerCase().includes('work history')) {
                this.parseExperience(section);
            }
            
            // Skills section
            else if (section.toLowerCase().includes('skills') || section.toLowerCase().includes('technologies')) {
                this.parseSkills(section);
            }
            
            // Projects section
            else if (section.toLowerCase().includes('projects') || section.toLowerCase().includes('portfolio')) {
                this.parseProjects(section);
            }
            
            // Education section
            else if (section.toLowerCase().includes('education')) {
                this.parseEducation(section);
            }
            
            // Contact information
            else if (section.toLowerCase().includes('contact') || section.includes('@')) {
                this.parseContact(section);
            }
        }
    }

    parseExperience(section) {
        const lines = section.split('\n');
        let currentExp = {};
        
        for (const line of lines) {
            if (line.match(/\d{4}/)) { // Line contains a year
                if (Object.keys(currentExp).length > 0) {
                    this.experience.push(currentExp);
                    currentExp = {};
                }
                currentExp.title = line;
                currentExp.description = [];
            } else if (line.trim() && currentExp.title) {
                currentExp.description.push(line.trim());
            }
        }
        
        if (Object.keys(currentExp).length > 0) {
            this.experience.push(currentExp);
        }
    }

    parseSkills(section) {
        const lines = section.split('\n');
        let currentCategory = 'technical';
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            
            if (trimmed.toLowerCase().includes('technical') || trimmed.toLowerCase().includes('programming')) {
                currentCategory = 'technical';
            } else if (trimmed.toLowerCase().includes('soft') || trimmed.toLowerCase().includes('personal')) {
                currentCategory = 'soft';
            } else if (trimmed.toLowerCase().includes('tools') || trimmed.toLowerCase().includes('software')) {
                currentCategory = 'tools';
            } else {
                this.skills[currentCategory].push(trimmed);
            }
        }
    }

    parseProjects(section) {
        const lines = section.split('\n');
        let currentProject = {};
        
        for (const line of lines) {
            if (line.match(/^[A-Z][\w\s-]+:/)) { // Project title format
                if (Object.keys(currentProject).length > 0) {
                    this.projects.push(currentProject);
                    currentProject = {};
                }
                currentProject.title = line.replace(':', '').trim();
                currentProject.description = [];
            } else if (line.trim() && currentProject.title) {
                currentProject.description.push(line.trim());
            }
        }
        
        if (Object.keys(currentProject).length > 0) {
            this.projects.push(currentProject);
        }
    }

    parseEducation(section) {
        const lines = section.split('\n');
        let currentEdu = {};
        
        for (const line of lines) {
            if (line.match(/\d{4}/)) { // Line contains a year
                if (Object.keys(currentEdu).length > 0) {
                    this.education.push(currentEdu);
                    currentEdu = {};
                }
                currentEdu.title = line;
                currentEdu.details = [];
            } else if (line.trim() && currentEdu.title) {
                currentEdu.details.push(line.trim());
            }
        }
        
        if (Object.keys(currentEdu).length > 0) {
            this.education.push(currentEdu);
        }
    }

    parseContact(section) {
        const lines = section.split('\n');
        
        for (const line of lines) {
            if (line.includes('@')) {
                this.contact.email = line.trim();
            } else if (line.includes('linkedin.com')) {
                this.contact.linkedin = line.trim();
            } else if (line.includes('github.com')) {
                this.contact.github = line.trim();
            } else if (line.match(/[\d-]{10,}/)) { // Phone number format
                this.contact.phone = line.trim();
            }
        }
    }
}

module.exports = ResumeData; 