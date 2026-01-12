import { HasFiles, Corpus, WordCounts, CorpusPreppedState, WordLists } from "@shared/types/manageCorpusTypes";


export const checkCorpusFilesExistInDB = async(corpusId: number): Promise<HasFiles> => {
    const corpus: Corpus = {
        corpus_name: "",
        id: corpusId
    };
    const result = await window.summarizerApi.checkCorpusFilesExistInDB(corpus);
    return result;
}

export const checkCorpusPreppedStatus = async(corpusId: number, analysisType: string): Promise<CorpusPreppedState> => {
    const corpusPreppedState: CorpusPreppedState = {
        corpus_id: corpusId,
        analysis_type: analysisType,
        up_to_date: null
    }
    const result = await window.summarizerApi.checkCorpusPreppedState(corpusPreppedState);
    return result;
}

export const insertCorpusPreppedStatus = async (corpusId: number, analysisType: string): Promise<CorpusPreppedState> => {
    const corpusPreppedState: CorpusPreppedState = {
        corpus_id: corpusId,
        analysis_type: analysisType,
        up_to_date: null
    }
    const result = await window.summarizerApi.insertCorpusPreppedState(corpusPreppedState);
    return result;
}

export const updateCorpusPreppedStatus = async (corpusId: number, analysisType: string): Promise<CorpusPreppedState> => {
    const corpusPreppedState: CorpusPreppedState = {
        corpus_id: corpusId,
        analysis_type: analysisType,
        up_to_date: null
    }
    const result = await window.summarizerApi.updateCorpusPreppedState(corpusPreppedState);
    return result;
}

export const fetchWordCountData = async (corpusId: number): Promise<WordCounts> => {
    const corpus: Corpus = {
        corpus_name: "",
        id: corpusId
    };
    const result = await window.summarizerApi.fetchWordCountData(corpus);
    return result;
}

export const fetchWordListsData = async (corpusId: number): Promise<WordLists> => {
    const corpus: Corpus = {
        corpus_name: "",
        id: corpusId
    };
    const result = await window.summarizerApi.fetchWordListsData(corpus);
    return result;
}

export const aggregateWordCountsData = async (corpusId: number): Promise <CorpusPreppedState> => {
    const corpus: Corpus = {
        corpus_name: "",
        id: corpusId
    };
    const result = await window.summarizerApi.aggregateWordCountsData(corpus);
    return result;
}

export const reAggregateWordCountsData = async (corpusId: number): Promise <CorpusPreppedState> => {
    const corpus: Corpus = {
        corpus_name: "",
        id: corpusId
    };
    const result = await window.summarizerApi.reAggregrateWordCountsData(corpus);
    return result;
}