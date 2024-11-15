import { CorpusMetaData, ProjectTitle } from "../types/types"

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