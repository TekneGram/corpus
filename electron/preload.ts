import type { Corpus, CorpusFile, CorpusFileContent, CorpusMetaData, CorpusProjectRelation, ProjectId, ProjectTitle, SubCorpus, FileText, DeleteFileResult } from '@shared/types/manageCorpusTypes';
import { contextBridge, ipcRenderer } from "electron"

console.log("[preload] LOADED", new Date().toISOString());

const api = {
    loadAllProjectTitles: (): Promise<ProjectTitle[]> =>
        ipcRenderer.invoke("corpusManager:loadAllProjectTitles"),

    saveProjectTitleToDatabase: (projectTitle: ProjectTitle): Promise<ProjectTitle> =>
        ipcRenderer.invoke("corpusManager:saveProjectTitleToDatabase", projectTitle),

    updateProjectTitleInDatabase: (projectTitle: ProjectTitle): Promise<ProjectTitle> =>
        ipcRenderer.invoke("corpusManager:updateProjectTitleInDatabase", projectTitle),

    loadProjectMetadata: (projectId: ProjectId): Promise<CorpusMetaData> =>
        ipcRenderer.invoke("corpusManager:loadProjectMetadata", projectId),

    postCorpusName: (corpusDetails: CorpusProjectRelation): Promise<Corpus> =>
        ipcRenderer.invoke("corpusManager:postCorpusName", corpusDetails),

    patchCorpusName: (corpus: Corpus): Promise<Corpus> =>
        ipcRenderer.invoke("corpusManager:patchCorpusName", corpus),

    postGroupName: (groupName: string, corpus: Corpus): Promise<SubCorpus> =>
        ipcRenderer.invoke("corpusManager:postGroupName", groupName, corpus),

    patchGroupName: (subCorpusData: SubCorpus): Promise<SubCorpus> =>
        ipcRenderer.invoke("corpusManager:patchGroupName", subCorpusData),

    uploadFileContent: (corpusFileContent: CorpusFileContent): Promise<CorpusFile> =>
        ipcRenderer.invoke("corpusManager:uploadFileContent", corpusFileContent),

    deleteFile: (corpusFile: CorpusFile): Promise<DeleteFileResult> =>
        ipcRenderer.invoke("corpusManager:deleteFile", corpusFile),

    deleteSubcorpus: (subCorpus: SubCorpus) =>
        ipcRenderer.invoke("corpusManager:deleteSubcorpus", subCorpus),

    getCorpusFileText: (corpusFile: CorpusFile): Promise<FileText> =>
        ipcRenderer.invoke("corpusManager:getCorpusFileText", corpusFile)

}

contextBridge.exposeInMainWorld('api', api
    
    // ipcRenderer: {
    //     invoke: (channel, data) => ipcRenderer.invoke(channel, data),
    //     on: (channel, listener) => ipcRenderer.on(channel, listener),
    // },
    
);
console.log("[preload] exposed api keys:", Object.keys(api));