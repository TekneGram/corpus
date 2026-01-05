import CPPProcess from './cppSpawn'
import type { ProjectTitle, ProjectTitleWithCommand, ProjectId, ProjectIdWithCommand, CorpusProjectRelation, CorpusProjectRelationWithCommand, Corpus, CorpusWithCommand, PostGroupNameWithCommand, SubCorpus, SubCorpusWithCommand, CorpusFileContent, CorpusFileContentWithCommand, CorpusFile, CorpusFileWithCommand, CorpusMetaData, FileText } from '@shared/types/manageCorpusTypes';
import { isProjectTitle, isSubCorpus, isCorpusFile, isCorpusMetaData, isCorpus, isFileText } from '../typeguards/manageCorpusGuards'


class CorpusManager {

    constructor() {

    }

    loadAllProjectTitles(): Promise<ProjectTitle[]> {
        const cppProcess = new CPPProcess("corpusManager");

        return new Promise<ProjectTitle[]>((resolve, reject) => {
            cppProcess.runProcess(
                JSON.stringify({ command: "getProjectTitles" }),
                (error: Error | null, output: string | null) => {
                    if (error) {
                        console.error("Error ", error.message);
                        reject(
                            new Error(
                                "There was an error running the C++ process getting the project titles: " + error.message
                            )
                        );
                    } else {
                        try {
                            const titles = JSON.parse(output);
                            for (const title of titles) {
                                if(!isProjectTitle(title)) {
                                    throw new Error("A project title provided is not of type ProjectTitle.");
                                }
                            }
                            resolve(titles);
                        } catch (err) {
                            reject(err);
                        }
                    }
                }
            );
        })
        .catch((err: Error) => {
            console.error("Error handling project titles: ", err.message);
            throw err;
        });
    }

    saveProjectTitleToDatabase(projectTitle: ProjectTitle): Promise<string> {
        const titleJSON: ProjectTitleWithCommand = {
            ...projectTitle,
            command: "startNewProject"
        }
        console.log(titleJSON);

        const projectTitleString: string = JSON.stringify(titleJSON);
        const cppProcess = new CPPProcess("corpusManager");

        return new Promise<string>((resolve, reject) => {
            cppProcess.runProcess(
                projectTitleString,
                (error: Error | null, output: string | null) => {
                    if (error) {
                        console.error("Error: ", error.message);
                        reject(
                            new Error(
                                "There was an error running the C++ process starting a new project"
                            )
                        );
                    } else {
                        // This whole process needs updating because we have
                        // no idea whether the database succeeded or not
                        resolve(output as string);
                    }
                }
            );
        })
        .catch((err: Error) => {
            console.error("Error handling project titles: ", err.message);
            throw err;
        });
    }

    updateProjectTitleInDatabase(projectTitle: ProjectTitle): Promise<string> {
        const titleJSON: ProjectTitleWithCommand = {
            ...projectTitle,
            command: "updateProjectTitle"
        }

        const projectTitleString: string = JSON.stringify(titleJSON);
        const cppProcess = new CPPProcess("corpusManager");

        return new Promise<string>((resolve, reject) => {
            cppProcess.runProcess(
            projectTitleString,
            (error: Error | null, output: string | null) => {
                if (error) {
                console.error("Error: ", error.message);
                reject(
                    new Error(
                    "There was an error running the C++ process to update the project title: "
                    )
                );
                } else {
                console.log(
                    "Output from C++ process updating the project title is: ",
                    output
                );
                resolve(output as string);
                }
            }
        );
    })
    .catch((err: Error) => {
        console.error("Error handling the project title update: ", err.message);
        throw err;
        });
    }

    loadProjectMetadata(projectId: ProjectId): Promise<CorpusMetaData> {
        const cppProcess = new CPPProcess("corpusManager");
        const projectIdWithCommand: ProjectIdWithCommand = {
            ...projectId,
            command: "getProjectMetadata",
        };

        const jsonDataString: string = JSON.stringify(projectIdWithCommand);

        return new Promise<CorpusMetaData>((resolve, reject) => {
            cppProcess.runProcess(
                jsonDataString,
                (error: Error | null, output: string | null) => {
                    if (error) {
                        console.error("Error:", error.message);
                        // throws the error to the controller to handle
                        reject(
                            new Error(
                                    "There was an error running the C++ process getting the corpus metadata: " +
                                    error.message
                                )
                            );
                    } else {
                        console.log("Output from cpp process in Model is: ", output);
                        try {
                            const result = JSON.parse(output);
                            if(!isCorpusMetaData(result)) {
                                throw new Error("The data received from c++ process is not a CorpusMetaData type");
                            }
                            resolve(result);
                        } catch (err) {
                            reject(err);
                        }
                    }
                }
            );
        })
        .catch((err: Error) => {
            console.error("Error handling project metadata:", err.message);
            throw err;
        });
    }

    postCorpusName(corpusDetails: CorpusProjectRelation): Promise<Corpus> {
        const corpusDetailsWithCommand: CorpusProjectRelationWithCommand = {
            ...corpusDetails,
            "command": "postCorpusName"
        }
        const corpusNameString: string = JSON.stringify(corpusDetailsWithCommand);
        const cppProcess = new CPPProcess("corpusManager");

        return new Promise<Corpus>((resolve, reject) => {
            cppProcess.runProcess(
            corpusNameString,
            (error: Error | null, output: string | null) => {
                if (error) {
            console.error("Error:", error.message);
                    reject(
                        new Error(
                        "There was an error running the C++ process adding corpus name: " +
                            error.message
                        )
                    );
                } else {
                    try {
                        const result = JSON.parse(output);
                        if(!isCorpus(result)) {
                            throw new Error("The result of the C++ process is not of type Corpus");
                        }
                        resolve(result);
                    } catch (err) {
                        reject(err);
                    }
                }
            }
            );
        })
        .catch((err: Error) => {
            console.error("Error handling adding corpus name:", err.message);
            throw err;
        });
    }

    patchCorpusName(corpus: Corpus): Promise<Corpus> {
        const corpusWithCommand: CorpusWithCommand = {
            ...corpus,
            command: "patchCorpusName"
        }
        const corpusWithCommandString: string = JSON.stringify(corpusWithCommand);
        const cppProcess = new CPPProcess("corpusManager");

        return new Promise<Corpus>((resolve, reject) => {
            cppProcess.runProcess(
                corpusWithCommandString,
                (error: Error | null, output: string | null) => {
                    if (error) {
                        console.error("Error:", error.message);
                        reject(
                            new Error(
                            "There was an error running the C++ process updating corpus name: " +
                                error.message
                            )
                        );
                    } else {
                        console.log("Output from the cpp process: ", output);
                        try {
                            const result = JSON.parse(output);
                            if(!isCorpus(result)) {
                                throw new Error("The result of the C++ process is not of type Corpus");
                            }
                            resolve(result);
                        } catch (err) {
                            reject(err);
                        }
                    }
                }
            );
        })
        .catch((err: Error) => {
            console.error("Error handling updating corpus name:", err.message);
            throw err;
        });
    }

    postGroupName(groupName: string, corpus:Corpus): Promise<SubCorpus> {
        const groupNameDetails: PostGroupNameWithCommand = {
            groupName: groupName,
            corpus_id: corpus.id,
            command: "createCorpusGroup"
        }

        const groupNameDetailsString: string = JSON.stringify(groupNameDetails);
        console.log("My group name is:", groupNameDetailsString);

        const cppProcess = new CPPProcess("corpusManager");

        return new Promise<SubCorpus>((resolve, reject) => {
            cppProcess.runProcess(
                groupNameDetailsString,
                (error: Error | null, output: string | null) => {
                    if (error) {
                        console.error("Error: ", error.message);
                        reject(
                            new Error(
                            "There was an error running the C++ process creating a group name: " +
                                error.message
                            )
                        );
                    } else {
                        console.log("Output from the cpp process adding a group name: ", output);
                        // JSON.parse can throw, so use try ... catch ...
                        try {
                            const parsed = JSON.parse(output);
                            // typeguard check
                            if (!isSubCorpus(parsed)) {
                                throw new Error("Invalid SubCorpus returned from C++ process; not of type SubCorpus");
                            }
                            resolve(parsed);
                        } catch (err) {
                            reject(err);
                        }
                    }
                }
            );
        })
        .catch((err: Error) => {
            console.error("Error handling adding a group name to the corpus: ", err.message);
            throw err;
        });
    }

    patchGroupName(subCorpusData: SubCorpus): Promise<SubCorpus> {
        const subCorpusDataWithCommand: SubCorpusWithCommand = {
            ...subCorpusData,
            command: "patchCorpusGroup"
        }

        const subCorpusDataWithCommandString: string = JSON.stringify(subCorpusDataWithCommand);
        const cppProcess = new CPPProcess("corpusManager");

        return new Promise<SubCorpus>((resolve, reject) => {
            cppProcess.runProcess(
                subCorpusDataWithCommandString,
                (error: Error | null, output: string | null) => {
                    if (error) {
                        console.error("Error: ", error.message);
                        reject(
                            new Error(
                            "There was an error running the C++ process to update a group name: " +
                                error.message
                            )
                        );
                    } else {
                        console.log("Output from the cpp process updating a group name: ", output);
                        try {
                            const result = JSON.parse(output);
                            if(!isSubCorpus) {
                                throw new Error("Invalid C++ output; output is not of type SubCorpus");
                            }
                            resolve(result);
                        } catch (err) {
                            reject(err)
                        }
                    }
                }
            );
        })
        .catch((err: Error) => {
            console.error("Error handling updating a group name in the corpus: ", err.message);
            throw err;
        });
    }

    uploadFileContent(corpusFileContent: CorpusFileContent): Promise<CorpusFile> {
        const corpusFileContentWithCommand: CorpusFileContentWithCommand = {
            ...corpusFileContent,
            command: "uploadFileContent"
        };

        const fileContentString: string = JSON.stringify(corpusFileContentWithCommand);
        const cppProcess = new CPPProcess("corpusManager");

        return new Promise<CorpusFile>((resolve, reject) => {
            cppProcess.runProcess(
                fileContentString,
                (error: Error | null, output: string | null) => {
                    if (error) {
                        console.error("Error: ", error.message);
                        reject(
                            new Error(
                            "There was an error running the C++ process adding file content: " +
                                error.message
                            )
                        );
                    } else {
                        try {
                            const parsed = JSON.parse(output);
                            if (!isCorpusFile(parsed)) {
                                throw new Error("Invalid C++ from uploadFileContent - returned value is not a CorpusFile type.");
                            }
                            resolve(parsed);
                        } catch (err) {
                            reject(err)
                        }
                    }
                }
            );
        })
        .catch((err: Error) => {
            console.error("Error handling adding file content to the corpus: ", err.message);
            throw err;
        });
    }

    deleteFile(corpusFile: CorpusFile): Promise<string> {
        const corpusFileWithCommand: CorpusFileWithCommand = {
            ...corpusFile,
            command: "deleteAFile"
        };

        const fileInfoString: string = JSON.stringify(corpusFileWithCommand);
        const cppProcess = new CPPProcess("corpusManager");

        return new Promise<string>((resolve, reject) => {
            cppProcess.runProcess(
                fileInfoString,
                (error: Error | null, output: string | null) => {
                    if (error) {
                        console.error("Error: ", error.message);
                        reject(
                            new Error(
                            "There was an error running the C++ process to delete a reference to a single file and all its associated data: " +
                                error.message
                            )
                        );
                    } else {
                        console.log("Output from the cpp process deleting a single file: ", output);
                        resolve(output as string);
                    }
                }
            );
        })
        .catch((err: Error) => {
            console.error(
                "Error handling deleting reference to a file in the subcorpus: ",
                err.message
            );
            throw err;
        });
    }

    deleteSubcorpus(subCorpus: SubCorpus): Promise<string> {

        const subCorpusWithCommand: SubCorpusWithCommand = {
            ...subCorpus,
            command: "deleteSubcorpus"
        };

        const subCorpusWithCommandString: string = JSON.stringify(subCorpusWithCommand);
        const cppProcess = new CPPProcess("corpusManager");

        return new Promise<string>((resolve, reject) => {
            cppProcess.runProcess(
                subCorpusWithCommandString,
                (error: Error | null, output: string | null) => {
                    if (error) {
                        console.error("Error: ", error.message);
                        reject(
                            new Error(
                            "There was an error running the C++ process to delete a sub corpus and all its associated data: " +
                                error.message
                            )
                        );
                    } else {
                        console.log("Output from the cpp process deleting a subcorpus: ", output);
                        resolve(output as string);
                    }
                }
            );
        })
        .catch((err: Error) => {
            console.error("Error handling deleting a subcorpus.");
            throw err;
        });
    }

    getCorpusFileText(corpusFile: CorpusFile): Promise<FileText> {
        const corpusFileWithCommand: CorpusFileWithCommand = {
            ...corpusFile,
            command: "getFileText"
        };

        const fileInfoString: string = JSON.stringify(corpusFileWithCommand);
        const cppProcess = new CPPProcess("corpusManager");

        return new Promise<FileText>((resolve, reject) => {
            cppProcess.runProcess(
                fileInfoString,
                (error: Error | null, output: string | null) => {
                    if (error) {
                        console.error("Error: ", error.message);
                        reject(
                            new Error(
                            "There was an error running the C++ process to get the text of a file: " +
                                error.message
                            )
                        );
                    } else {
                        try {
                            const parsed = JSON.parse(output);
                            if (!isFileText(parsed)) {
                                throw new Error("The data returned from C++ process is not of type FileText.")
                            }
                            resolve(parsed);
                        } catch (err) {
                            reject(err);
                        }
                    }
                }
            );
        })
        .catch((err: Error) => {
            console.error("Error handling getting the text of a file.");
            throw err;
        });
    }

    updateCorpusPreppedStatus(corpusId) {
        const cppProcess = new CPPProcess('corpusManager');
        return new Promise((resolve, reject) => {
            cppProcess.runProcess("", (error, output) => {
                if (error) {
                    console.error("Error", error.message);
                    reject(new Error("There was an error of course!"));
                } else {
                    console.log("Output is: ", output);
                    resolve(output);
                }
            })
        })
        .then(output => {
            return output;
        })
        .catch(err => {
            console.error("Oh dear");
            throw err;
        })
    }

}

export default CorpusManager;