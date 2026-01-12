import { HasFiles, Corpus, WordCounts, CorpusPreppedState, WordLists } from "@shared/types/manageCorpusTypes";

// type CorpusFilesExistResponse = 
//     | { status: "success"; cppOutput: HasFiles }
//     | { status: "fail", message: string};

// type CorpusStatusResponse =
//     | { status: "success"; cppOutput: CorpusStatus }
//     | { status: "fail"; message: string };

type WordCountsResponse = 
    | { status: "success"; cppOutput: WordCounts }
    | { status: "fail"; message: string };

type SummarizeWordsResponse = 
    | { status: "success"; cppOutput: CorpusPreppedState}
    | { status: "fail"; message: string }

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

// export const fetchWordListData = async (corpusId: number): Promise<any> => {
//     try {
//         const response = await fetch(`http://localhost:4000/api/summarizer/project/${corpusId}/corpus/summarize/wordlists`, {
//             method: "GET",
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'include'
//         });
//         const result = await response.json();
//         if(result.status === "success") {
//             console.log("Results of the word count is: ", result.cppOutput);
//         }
//         return result;
//     } catch (error) {
//         throw error;
//     }
// }

export const countWords = async (corpusId: number): Promise<SummarizeWordsResponse> => {
    try {
        const response = await fetch(`http://localhost:4000/api/summarizer/project/${corpusId}/corpus/summarize/countWords`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const result: SummarizeWordsResponse = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        throw error;
    }
}

export const recountWords = async (corpusId: number): Promise<any> => {
    console.log("I'm recounting words");
    try {
        const response = await fetch(`http://localhost:4000/api/summarizer/project/${corpusId}/corpus/summarize/recountWords`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}