import { CorpusMetaData, ProjectTitle, Corpus, CorpusProjectRelation, SubCorpus, CorpusFile } from "../types/types"

interface ApiResponse<T> {
    status: "success" | "fail";
    cppOutput: T
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

export const postCorpusName = async(corpusDetails:CorpusProjectRelation): Promise<ApiResponse<Corpus | string>> => {
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
        return result;
    } catch (error) {
        throw error;
    }
}

export const postGroupName = async (groupName: string, corpus: Corpus): Promise<SubCorpus | any> => {
    try {
        const response = await fetch(`http://localhost:4000/api/manager/corpus/${corpus.id}/group`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({groupName: groupName})
        })
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export const uploadFileContent = async (fileContent: string, group_id: number, file_name: string): Promise<CorpusFile | any> => {
    console.log(fileContent);
    try {
        const response = await fetch(`http://localhost:4000/api/manager/groups/${group_id}/file`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ file_content: fileContent, file_name: file_name })
        });
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export const patchGroupName = async (groupName: string, group_id: number): Promise<any> => {
    try {
        const response = await fetch(`http://localhost:4000/api/manager/groups/${group_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ groupName: groupName })
        });
        const result = await response.json();
        console.log("In the patchGroupName function: ", result);
        return result;
    } catch (error) {
        throw error;
    }
}

export const deleteFile = async (file_id: number): Promise<any> => {
    try {
        const response = await fetch(`http://localhost:4000/api/manager/files/${file_id}`, {
            method: 'DELETE',
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

export const deleteSubcorpus = async (group_id: number): Promise<any> => {
    try {
        const response = await fetch(`http://localhost:4000/api/manager/groups/${group_id}`, {
            method: 'DELETE',
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