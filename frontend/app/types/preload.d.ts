import type { ProjectTitle, CorpusMetaData, CorpusProjectRelation, Corpus, SubCorpus, CorpusFileContent, CorpusFile, WordCounts, WordLists } from "@shared/types/manageCorpusTypes"
import type { HasFiles, CorpusState, CorpusPreppedState } from "@shared/types/manageCorpusTypes"

export {}

declare global {
    interface Window {
        api: {
            loadAllProjectTitles(): Promise<any>,
            saveProjectTitleToDatabase(projectTitle: ProjectTitle): Promise<any>,
            updateProjectTitleInDatabase(projectTitle: ProjectTitle): Promise<any>,
            loadProjectMetadata(projectId: ProjectId): Promise<CorpusMetaData>,
            postCorpusName(corpusDetails: CorpusProjectRelation): Promise<any>,
            patchCorpusName(corpus: Corpus): Promise<any>,
            postGroupName(groupName: string, corpus: Corpus): Promise<any>,
            patchGroupName(subCorpusData: SubCorpus): Promise<any>,
            uploadFileContent(corpusFileContent: CorpusFileContent): Promise<any>,
            deleteFile(corpusFile: CorpusFile): Promise<any>,
            deleteSubcorpus(subcorpus: SubCorpus): Promise<any>,
            getCorpusFileText(corpusFile: CorpusFile): Promise<any>,
            updateCorpusPreppedStatus(corpusId: number): Promise<any>
        },
        summarizerApi: {
            checkCorpusFilesExistInDB(corpus: Corpus): Promise<HasFiles>,
            checkCorpusPreppedState(corpusPreppedStatus: CorpusPreppedState): Promise<CorpusPreppedState>,
            insertCorpusPreppedState(corpusPreppedStatus: CorpusPreppedState): Promise<CorpusPreppedState>,
            updateCorpusPreppedState(corpusPreppedStatus: CorpusPreppedState): Promise<CorpusPreppedState>,
            fetchWordCountData(corpus: Corpus): Promise<WordCounts>
            fetchWordListsData(corpus: Corpus): Promise<WordLists>
        }
    }
}