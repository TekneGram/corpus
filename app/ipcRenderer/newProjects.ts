//const { ipcRenderer } = require('electron');
// We cannot call ipcRenderer like this because this calls the file system, which Next only allows on
// server components. This is used in a client component.
// So, it was necessary to set up a preload file to use a contextBridge
// An electron.d.ts file was also set up to allow TypeScript to notice window.electron.ipcRenderer

import { toast } from 'react-toastify';

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