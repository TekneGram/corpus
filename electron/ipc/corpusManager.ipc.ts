import { ipcMain } from "electron"
import CorpusManager from '../services/corpusManager'
import type { ProjectTitle, ProjectId, CorpusProjectRelation, Corpus, SubCorpus, CorpusFileContent, CorpusFile } from "@shared/types/manageCorpusTypes"

const corpusManager = new CorpusManager();

export function registerCorpusManagerIPC() {
    ipcMain.handle("corpusManager:loadAllProjectTitles", async (_e) => {
        return await corpusManager.loadAllProjectTitles()
    });

    ipcMain.handle("corpusManager:saveProjectTitleToDatabase", async (_e, projectTitle: ProjectTitle) => {
        return await corpusManager.saveProjectTitleToDatabase(projectTitle)
    });

    ipcMain.handle("corpusManager:updateProjectTitleInDatabase", async (_e, projectTitle: ProjectTitle) => {
        return await corpusManager.updateProjectTitleInDatabase(projectTitle)
    });

    ipcMain.handle("corpusManager:loadProjectMetadata", async (_e, projectId: ProjectId) => {
        return await corpusManager.loadProjectMetadata(projectId)
    });

    ipcMain.handle("corpusManager:postCorpusName", async (_e, corpusDetails: CorpusProjectRelation) => {
        return await corpusManager.postCorpusName(corpusDetails)
    });

    ipcMain.handle("corpusManager:patchCorpusName", async (_e, corpus: Corpus) => {
        return await corpusManager.patchCorpusName(corpus)
    });

    ipcMain.handle("corpusManager:postGroupName", async (_e, groupName: string, corpus: Corpus) => {
        return await corpusManager.postGroupName(groupName, corpus)
    });

    ipcMain.handle("corpusManager:patchGroupName", async (_e, subCorpusData: SubCorpus) => {
        return await corpusManager.patchGroupName(subCorpusData)
    });

    ipcMain.handle("corpusManager:uploadFileContent", async (_e, corpusFileContent: CorpusFileContent) => {
        return await corpusManager.uploadFileContent(corpusFileContent)
    });

    ipcMain.handle("corpusManager:deleteFile", async (_e, corpusFile: CorpusFile) => {
        return await corpusManager.deleteFile(corpusFile)
    });

    ipcMain.handle("corpusManager:deleteSubcorpus", async (_e, subCorpus: SubCorpus) => {
        return await corpusManager.deleteSubcorpus(subCorpus)
    });

    // MOVE TO SUMMARIZER!
    ipcMain.handle("corpusManager:updateCorpusPreppedStatus", async (_e, corpusId: number) => {
        return await corpusManager.updateCorpusPreppedStatus(corpusId)
    });

    ipcMain.handle("corpusManager:getCorpusFileText", async (_e, corpusFile: CorpusFile) => {
        return await corpusManager.getCorpusFileText(corpusFile)
    });
}