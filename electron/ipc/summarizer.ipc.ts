import { ipcMain } from "electron";
import SummarizerService from "../services/summarizerService";
import type { HasFiles, Corpus, CorpusPreppedState } from "@shared/types/manageCorpusTypes";

const summarizerService = new SummarizerService();

export function registerSummarizerIPC() {
    ipcMain.handle("summarizer:checkCorpusFilesExistInDB", async (_e, corpus: Corpus) => {
        return await summarizerService.checkCorpusFilesExistInDB(corpus)
    })

    ipcMain.handle("summarizer:checkCorpusPreppedState", async (_e, corpusPreppedState: CorpusPreppedState) => {
        return await summarizerService.checkCorpusPreppedState(corpusPreppedState)
    })

    ipcMain.handle("summarizer:insertCorpusPreppedState", async (_e, corpusPreppedState: CorpusPreppedState) => {
        return await summarizerService.insertCorpusPreppedState(corpusPreppedState)
    })

    ipcMain.handle("summarizer:updateCorpusPreppedState", async (_e, corpusPreppedState: CorpusPreppedState) => {
        return await summarizerService.updateCorpusPreppedState(corpusPreppedState)
    })
}