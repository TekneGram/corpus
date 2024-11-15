//const { ipcRenderer } = require('electron');
// We cannot call ipcRenderer like this because this calls the file system, which Next only allows on
// server components. This is used in a client component.
// So, it was necessary to set up a preload file to use a contextBridge
// An electron.d.ts file was also set up to allow TypeScript to notice window.electron.ipcRenderer

import { toast } from 'react-toastify';

type ProjectTitle = {
    id: number;
    project_name: string;
};

type Corpus = {
    id: number;
    corpus_name: string;
};

type SubCorpus = {
    id: number;
    group_name: string;
};

type CorpusFile = {
    id: number;
    file_name: string;
};

type CorpusFilesPerSubCorpus = {
    corpusFiles: CorpusFile[];
    subCorpus: SubCorpus;
};

type CorpusMetaData = {
    projectTitle: ProjectTitle;
    corpus: Corpus;
    files: CorpusFilesPerSubCorpus[];
};

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

export const loadProjectMetadata = async (projectId: number): Promise<CorpusMetaData> => {
    try {
        const response = await fetch(`http://localhost:4000/api/corpus-data/metadata/${projectId}`, {
            method: "GET",
            headers: {
                'Content-Type' : 'application-json'
            },
            credentials: 'include'
        })
        const result: string = await response.json();
        const corpusMetadata: CorpusMetaData = JSON.parse(result);
        return corpusMetadata;
    } catch (error) {
        throw error;
    }
}