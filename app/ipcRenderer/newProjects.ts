//const { ipcRenderer } = require('electron');
// We cannot call ipcRenderer like this because this calls the file system, which Next only allows on
// server components. This is used in a client component.
// So, it was necessary to set up a preload file to use a contextBridge
// An electron.d.ts file was also set up to allow TypeScript to notice window.electron.ipcRenderer

import { toast } from 'react-toastify';

export const loadAllProjectTitles = async () => {
    try {
        const response = await window.electron.ipcRenderer.invoke('load-all-project-titles');
        if (response.success) {
            return response.results;
        } else {
            toast.error(response.message);
        }
    } catch (error) {
        toast.error('Failed to load all your projects: ' + error);
    }
}

export const saveProjectTitleToDatabase = async (title:string) => {
    try {
        const response = await window.electron.ipcRenderer.invoke('send-new-project-title', title);
        if (response.success) {
            toast.success(response.message);
        } else {
            toast.error(response.message);
        }
    } catch (error) {
        console.error('Error adding project:', error);
        toast.error('Failed to add project: ' + error);
    }
}

export const loadProjectMetadata = async (projectId: number) => {
    console.log(projectId);
    try {
        const response = await fetch(`http://localhost:4000/api/corpus-data/metadata/${projectId}`, {
            method: "GET",
            headers: {
                'Content-Type' : 'application-json'
            },
            credentials: 'include'
        })
        const result = await response.json();
        return JSON.parse(result);
    } catch (error) {
        console.error('Error getting corpus metadata for your project');
        toast.error("Error getting corpus metadata for you project: " + error);
    }
}