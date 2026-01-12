import { ipcRenderer } from "electron";
import { Corpus, CorpusPreppedState, CorpusState, HasFiles } from "@shared/types/manageCorpusTypes";

export const summarizerApi = {
    checkCorpusFilesExistInDB: (corpus: Corpus): Promise<HasFiles> =>
        ipcRenderer.invoke("summarizer:checkCorpusFilesExistInDB", corpus),

    checkCorpusPreppedState: (corpus: CorpusPreppedState): Promise<CorpusPreppedState> =>
        ipcRenderer.invoke("summarizer:checkCorpusPreppedState", corpus),

    insertCorpusPreppedState: (corpus: CorpusPreppedState): Promise<CorpusPreppedState> =>
        ipcRenderer.invoke("summarizer:insertCorpusPreppedState", corpus),

    updateCorpusPreppedState: (corpus: CorpusPreppedState): Promise<CorpusPreppedState> =>
        ipcRenderer.invoke("summarizer:updateCorpusPreppedState", corpus),
};