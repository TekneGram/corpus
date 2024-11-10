const { ipcMain } = require('electron');
const NewProject = require('../database/newProjects');

// Get projects from database when app is loaded


// Add a new project to the database
const addNewProject = () => {
    ipcMain.handle('send-new-project-title', async(event, title) => {
        try {
            const newProject = await NewProject.addNewProject(title);
            console.log(newProject);
            return { success: true, message: "Project added successfully" };
        } catch (error) {
            console.error('Failed to add project to database;', error);
            return { success: false, message: 'Failed to add project' };
        }
    })
};

module.exports = {
    addNewProject
}