import { CorpusStatus } from "../types/types";

type CorpusFilesExistResponse = 
    | { status: "success"; cppOutput: boolean }
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
        return result;
    } catch (error) {
        throw error;
    }
}

// export const checkCorpusPreppedStatus = async (corpusId: number): Promise<CorpusStatusResponse> => {
//     try {
//         const response = await fetch(`http://localhost:4000/api/summarizer/project/${corpusId}/corpus/files`, {
//             method: "GET",
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'include'
//         });
//         const result: CorpusStatusResponse = await response.json();
//         const projectTitles: ProjectTitle[] = JSON.parse(result);
//         return projectTitles;
//     } catch (error) {
//         throw error;
//     }
// }