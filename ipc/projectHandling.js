const { ipcMain } = require('electron');
const NewProject = require('../models/newProjects');

// Get projects from database when app is loaded
const loadAllProjectTitles = () => {
    ipcMain.handle('load-all-project-titles', async(event) => {
        try {
            const results = await NewProject.loadAllProjectTitles();
            return { success: true, results}
        } catch (error) {
            console.error('Failed to get all the project titles');
            return { success: false, message: 'Failed get all projects' };
        }
    })
}

// Add a new project to the database
const addNewProject = () => {
    ipcMain.handle('send-new-project-title', async(event, title) => {
        try {
            const newProject = await NewProject.addNewProject(title);
            return { success: true, message: "Project added successfully" };
        } catch (error) {
            console.error('Failed to add project to database;', error);
            return { success: false, message: 'Failed to add project' };
        }
    })
};

module.exports = {
    loadAllProjectTitles,
    addNewProject
}