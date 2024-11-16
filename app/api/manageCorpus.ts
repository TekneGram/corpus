import { CorpusMetaData, ProjectTitle, Corpus, CorpusProjectRelation } from "../types/types"

export const loadAllProjectTitles = async (): Promise<ProjectTitle[]> => {
    try {
        const response = await fetch(`http://localhost:4000/api/manager/project`, {
            method: 'GET',
            credentials: 'include'
        });
        const result: string = await response.json();
        const projectTitles: ProjectTitle[] = JSON.parse(result);
        return projectTitles;
    } catch (error) {
        throw error;
    }
}

export const saveProjectTitleToDatabase = async(title: string): Promise<any> => {
    const projectTitle = {projectTitle: title};
    try {
        const response = await fetch(`http://localhost:4000/api/manager/project`, {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(projectTitle)
        });
        const result: string = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        throw error;
    }
}

export const loadProjectMetadata = async(projectId: number): Promise<CorpusMetaData> => {
    try {
        const response = await fetch(`http://localhost:4000/api/manager/project/${projectId}/corpus/metadata`, {
            method: "GET",
            headers: {
                'Content-Type' : 'application/json'
            },
            credentials: 'include'
        });
        const result: string = await response.json();
        const corpusMetadata: CorpusMetaData = JSON.parse(result);
        return corpusMetadata;
    } catch (error) {
        throw error;
    }
}

export const postCorpusName = async(corpusDetails:CorpusProjectRelation): Promise<any> => {
    try {
        const response = await fetch('http://localhost:4000/api/manager/corpus', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(corpusDetails)
        });
        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        throw error;
    }
}

export const patchCorpusName = async(corpus: Corpus): Promise<any> => {
    try {
        const response = await fetch(`http://localhost:4000/api/manager/corpus/${corpus.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(corpus)
        });
        const result = await response.json();
        console.log("Response from patching your corpus name:", result);
        return result;
    } catch (error) {
        throw error;
    }
}