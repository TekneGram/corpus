import { HasFiles, CorpusStatus } from "../types/types";

type CorpusFilesExistResponse = 
    | { status: "success"; cppOutput: HasFiles }
    | { status: "fail", message: string};

type CorpusStatusResponse =
    | { status: "success"; cppOutput: CorpusStatus }
    | { status: "fail"; message: string}


export const checkCorpusFilesExistInDB = async (corpusId: number): Promise<CorpusFilesExistResponse> => {
    try {
        const response = await fetch(`http://localhost:4000/api/summarizer/project/${corpusId}/corpus/files`, {
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
        const response = await fetch(`http://localhost:4000/api/summarizer/project/${corpusId}/corpus/${analysisType}`, {
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
        const response = await fetch(`http://localhost:4000/api/summarizer/project/${corpusId}/corpus/${analysisType}/${toBeUpdated}`, {
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
        const response = await fetch(`http://localhost:4000/api/summarizer/project/${corpusId}/corpus/${analysisType}`, {
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