import type { CorpusMetaData, ProjectTitle, ProjectId, Corpus, CorpusProjectRelation, SubCorpus, CorpusFile, EmptyCPPOutput, FileText, CorpusFileContent } from "@shared/types/manageCorpusTypes"

type ApiResponse =
    | { status: "success"; cppOutput: Corpus | SubCorpus | CorpusFile | EmptyCPPOutput }
    | { status: "success"; cppOutput: FileText }
    | { status: "fail"; cppOutput: string };

export const loadAllProjectTitles = async (): Promise<ProjectTitle[]> => {
    // IPC returns the C++ stdout as a string
    const projectTitles = await window.api.loadAllProjectTitles();
    return projectTitles;
}

export const saveProjectTitleToDatabase = async (title: string): Promise<ProjectTitle> => {
    // Create object type for passing
    const projectTitle: ProjectTitle = {project_name: title, id: -1}; // Hard code the id because a new id will be created on the database.
    const result = await window.api.saveProjectTitleToDatabase(projectTitle);
    return result;
}

export const updateProjectTitleInDatabase = async (projectId: number, title: string): Promise<any> => {
    // Create object type for passing.
    const projectTitle: ProjectTitle = {id: projectId, project_name: title}
    const result = await window.api.updateProjectTitleInDatabase(projectTitle);
    return result;
}

export const loadProjectMetadata = async (projectId: number): Promise<CorpusMetaData> => {
    const projectIdObject: ProjectId = {id: projectId};
    const corpusMetadata = await window.api.loadProjectMetadata(projectIdObject);
    return corpusMetadata;
}

export const postCorpusName = async (corpusDetails: CorpusProjectRelation): Promise<Corpus> => {
    const corpusName = await window.api.postCorpusName(corpusDetails);
    console.log("From postCorpusName in frontend - app - api:", corpusName);
    return corpusName;
}

export const patchCorpusName = async (corpus: Corpus): Promise<Corpus> => {
    const corpusName = await window.api.patchCorpusName(corpus);
    console.log("From postCorpusName in frontend - app - api:", corpusName);
    return corpusName;
}

export const postGroupName = async (groupName: string, corpus: Corpus): Promise<SubCorpus> => {
    const result = await window.api.postGroupName(groupName, corpus);
    return result;
}

export const patchGroupName = async (groupName: string, group_id: number): Promise<SubCorpus> => {
    const subCorpusData: SubCorpus = {
        id: group_id,
        group_name: groupName
    }
    const result = await window.api.patchGroupName(subCorpusData);
    return result;
}

export const uploadFileContent = async (fileContent: string, group_id: number, file_name: string): Promise<CorpusFile> => {
    const corpusFileContent: CorpusFileContent = {
        group_id: group_id,
        file_name: file_name,
        file_content: fileContent
    };
    const result = await window.api.uploadFileContent(corpusFileContent);
    return result;
}

export const deleteFile = async (file_id: number): Promise<ApiResponse> => {
    // TO DO - get the file name in here, too!
    const corpusFile: CorpusFile = {
        id: file_id,
        file_name: ""
    };
    try {
        const raw = await window.api.deleteFile(corpusFile);

        if (typeof raw === "string") {
            const trimmed = raw.trim();
            if (!trimmed) return { status: "fail", cppOutput: "Empty IPC response in deleteFile" };
            return JSON.parse(trimmed) as ApiResponse;
        }

        return raw as ApiResponse;
    } catch (error) {
        throw error;
    }
}

export const deleteSubcorpus = async (group_id: number): Promise<any> => {
    // TO DO - get the subcorpus name
    const subCorpus: SubCorpus = {
        id: group_id,
        group_name: ""
    };
    try {
        const raw = await window.api.deleteSubcorpus(subCorpus);
        return raw;
    } catch (error) {
        throw error;
    }
}

// TO DO - MOVE TO SUMMARIZER
export const updateCorpusPreppedStatus = async (corpusId: number): Promise<any> => {
    try {
        const raw = await window.api.updateCorpusPreppedStatus(corpusId);
        return raw;
    } catch (error) {
        throw error;
    }
}


export const getCorpusFileText = async (file_id: number): Promise<FileText> => {
    // TO DO - get the file name!
    const corpusFile: CorpusFile = {
        id: file_id,
        file_name: ""
    };
    const result = await window.api.getCorpusFileText(corpusFile);
    return result;
}


// export const loadAllProjectTitles = async (): Promise<ProjectTitle[]> => {
//     try {
//         const response = await fetch(`http://localhost:4000/api/manager/project`, {
//             method: 'GET',
//             credentials: 'include'
//         });
//         const result: string = await response.json();
//         const projectTitles: ProjectTitle[] = JSON.parse(result);
//         return projectTitles;
//     } catch (error) {
//         throw error;
//     }
// }

// export const saveProjectTitleToDatabase = async(title: string): Promise<any> => {
//     const projectTitle = {projectTitle: title};
//     try {
//         const response = await fetch(`http://localhost:4000/api/manager/project`, {
//             method: "POST",
//             headers: {
//                 'Content-Type' : 'application/json'
//             },
//             credentials: 'include',
//             body: JSON.stringify(projectTitle)
//         });
//         const result: string = await response.json();
//         console.log(result);
//         return result;
//     } catch (error) {
//         throw error;
//     }
// }

// export const updateProjectTitleInDatabase = async(projectId: number, title: string): Promise<any> => {
//     const projectTitle = { projectTitle: title };
//     try {
//         const response = await fetch(`http://localhost:4000/api/manager/project/${projectId}`, {
//             method: "PATCH",
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'include',
//             body: JSON.stringify(projectTitle)
//         });
//         const result = await response.json();
//         return JSON.parse(result);
//     } catch (error) {
//         throw error;
//         // Can I return something here to the user so that they know the update failed?
//     }
// }

// export const loadProjectMetadata = async(projectId: number): Promise<CorpusMetaData> => {
//     try {
//         const response = await fetch(`http://localhost:4000/api/manager/project/${projectId}/corpus/metadata`, {
//             method: "GET",
//             headers: {
//                 'Content-Type' : 'application/json'
//             },
//             credentials: 'include'
//         });
//         const result: string = await response.json();
//         const corpusMetadata: CorpusMetaData = JSON.parse(result);
//         return corpusMetadata;
//     } catch (error) {
//         throw error;
//     }
// }

// export const postCorpusName = async(corpusDetails:CorpusProjectRelation): Promise<ApiResponse> => {
//     try {
//         const response = await fetch('http://localhost:4000/api/manager/corpus', {
//             method: 'POST',
//             headers: {
//                 'Content-Type' : 'application/json'
//             },
//             credentials: 'include',
//             body: JSON.stringify(corpusDetails)
//         });
//         const result = await response.json();
//         return result;
//     } catch (error) {
//         throw error;
//     }
// }

// export const patchCorpusName = async(corpus: Corpus): Promise<ApiResponse> => {
//     try {
//         const response = await fetch(`http://localhost:4000/api/manager/corpus/${corpus.id}`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type' : 'application/json'
//             },
//             credentials: 'include',
//             body: JSON.stringify(corpus)
//         });
//         const result = await response.json();
//         return result;
//     } catch (error) {
//         throw error;
//     }
// }

// export const postGroupName = async (groupName: string, corpus: Corpus): Promise<ApiResponse> => {
//     try {
//         const response = await fetch(`http://localhost:4000/api/manager/corpus/${corpus.id}/group`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'include',
//             body: JSON.stringify({groupName: groupName})
//         })
//         const result = await response.json();
//         return result;
//     } catch (error) {
//         throw error;
//     }
// }

// export const uploadFileContent = async (fileContent: string, group_id: number, file_name: string): Promise<ApiResponse> => {
//     try {
//         const response = await fetch(`http://localhost:4000/api/manager/groups/${group_id}/file`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'include',
//             body: JSON.stringify({ file_content: fileContent, file_name: file_name })
//         });
//         const result: ApiResponse = await response.json();
//         return result;
//     } catch (error) {
//         throw error;
//     }
// }

// export const patchGroupName = async (groupName: string, group_id: number): Promise<ApiResponse> => {
//     try {
//         const response = await fetch(`http://localhost:4000/api/manager/groups/${group_id}`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'include',
//             body: JSON.stringify({ groupName: groupName })
//         });
//         const result = await response.json();
//         console.log("In the patchGroupName function: ", result);
//         return result;
//     } catch (error) {
//         throw error;
//     }
// }

// export const deleteFile = async (file_id: number): Promise<ApiResponse> => {
//     try {
//         const response = await fetch(`http://localhost:4000/api/manager/files/${file_id}`, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'include'
//         });
//         const result = await response.json();
//         return result;
//     } catch (error) {
//         throw error;
//     }
// }

// export const deleteSubcorpus = async (group_id: number): Promise<any> => {
//     try {
//         const response = await fetch(`http://localhost:4000/api/manager/groups/${group_id}`, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'include'
//         });
//         const result = await response.json();
//         return result;
//     } catch (error) {
//         throw error;
//     }
// }

// export const updateCorpusPreppedStatus = async(corpusId: number): Promise<any> => {
//     try {
//         const response = await fetch(`http://localhost:4000/api/manager/summarizer/${corpusId}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'include'
//         });
//         const result = await response.json();
//         return result;
//     } catch (error) {
//         throw error;
//     }
// }

// export const getCorpusFileText = async (file_id: number): Promise<ApiResponse> => {
//     try {
//         const response = await fetch(`http://localhost:4000/api/manager/text/${file_id}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'include'
//         });
//         const result = await response.json();
//         return result;
//     } catch (error) {
//         throw error;
//     }
// }