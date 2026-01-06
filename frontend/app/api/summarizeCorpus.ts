import { HasFiles, CorpusStatus, WordCounts, CorpusPreppedStatus } from "@shared/types/manageCorpusTypes";

type CorpusFilesExistResponse = 
    | { status: "success"; cppOutput: HasFiles }
    | { status: "fail", message: string};

type CorpusStatusResponse =
    | { status: "success"; cppOutput: CorpusStatus }
    | { status: "fail"; message: string };

type WordCountsResponse = 
    | { status: "success"; cppOutput: WordCounts }
    | { status: "fail"; message: string };

type SummarizeWordsResponse = 
    | { status: "success"; cppOutput: CorpusPreppedStatus}
    | { status: "fail"; message: string }


export const checkCorpusFilesExistInDB = async (corpusId: number): Promise<CorpusFilesExistResponse> => {
    try {
        const response = await fetch(`http://localhost:4000/api/summarizer/project/${corpusId}/corpus/status/files`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const result: CorpusFilesExistResponse = await response.json();
        if (result.status === "success") {
            console.log("Results of corpus file checking is: ", result.cppOutput);
        }
        // TODO - return only the cppOutput
        return result;
    } catch (error) {
        throw error;
    }
}

export const checkCorpusPreppedStatus = async (corpusId: number, analysisType: string): Promise<CorpusStatusResponse> => {
    try {
        const response = await fetch(`http://localhost:4000/api/summarizer/project/${corpusId}/corpus/status/${analysisType}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const result: CorpusStatusResponse = await response.json();
        if (result.status === "success") {
            console.log("Results of corpus status checking is: ", result.cppOutput);
        }
        // TODO - return only the cppOutput
        return result;
    } catch (error) {
        throw error;
    }
}

export const updateCorpusPreppedStatus = async (corpusId: number, analysisType: string, toBeUpdated: boolean): Promise<CorpusStatusResponse> => {
    try {
        const response = await fetch(`http://localhost:4000/api/summarizer/project/${corpusId}/corpus/status/${analysisType}/${toBeUpdated}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const result: CorpusStatusResponse = await response.json();
        if (result.status === "success") {
            console.log("Results of corpus status update is: ", result.cppOutput);
        }
        // TODO - return only the cppOutput
        return result;
    } catch (error) {
        throw error;
    }
}

export const insertCorpusPreppedStatus = async (corpusId: number, analysisType: string): Promise<CorpusStatusResponse> => {
    try {
        const response = await fetch(`http://localhost:4000/api/summarizer/project/${corpusId}/corpus/status/${analysisType}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const result: CorpusStatusResponse = await response.json();
        if (result.status === "success") {
            console.log("Results of corpus status insert is: ", result.cppOutput);
        }
        // TODO - return only the cppOutput
        return result;
    } catch (error) {
        throw error;
    }
}

export const fetchWordCountData = async (corpusId: number): Promise<WordCountsResponse> => {
    try {
        const response = await fetch(`http://localhost:4000/api/summarizer/project/${corpusId}/corpus/summarize/wordcount`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const result: WordCountsResponse = await response.json();
        if(result.status === "success") {
            console.log("Results of the word count is: ", result.cppOutput);
        }
        return result;
    } catch (error) {
        throw error;
    }
}

export const fetchWordListData = async (corpusId: number): Promise<any> => {
    try {
        const response = await fetch(`http://localhost:4000/api/summarizer/project/${corpusId}/corpus/summarize/wordlists`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const result = await response.json();
        if(result.status === "success") {
            console.log("Results of the word count is: ", result.cppOutput);
        }
        return result;
    } catch (error) {
        throw error;
    }
}

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