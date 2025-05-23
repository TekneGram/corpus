const CPPProcess = require('./utils/cppSpawn');

class CorpusManager {
    
    constructor() {

    }

    processNewProject(titleJSON) {
        titleJSON["command"] = "startNewProject"; // for cpp process to know which command to run
        console.log(titleJSON);
        const projectTitleString = JSON.stringify(titleJSON);
        const cppProcess = new CPPProcess('corpusManager');
        return new Promise((resolve, reject) => {
            cppProcess.runProcess(projectTitleString, (error, output) => {
                if (error) {
                    console.error("Error: ", error.message);
                    reject(new Error("There was an error running the C++ process starting a new project"));
                } else {
                    console.log("Output from C++ process starting a new project is: ", output);
                    resolve(output);
                }
            });
        })
        .then(output => {
            return output;
        })
        .catch(err => {
            console.error("Error handling project titles:", err.message);
            throw err;
        });
    }

    processUpdateProjectTitle(titleJSON, projectId) {
        titleJSON["command"] = "updateProjectTitle";
        titleJSON["projectId"] = parseInt(projectId.projectId);
        const projectTitleString = JSON.stringify(titleJSON);
        const cppProcess = new CPPProcess('corpusManager');
        return new Promise((resolve, reject) => {
            cppProcess.runProcess(projectTitleString, (error, output) => {
                if (error) {
                    console.error("Error: ", error.message);
                    reject(new Error("There was an error running the C++ process to update the project title: "));
                } else {
                    console.log("Output from C++ process updating the project title is: ", output);
                    resolve(output);
                }
            });
        })
        .then(output => {
            return output;
        })
        .catch(err => {
            console.error("Error handling the project title update: ", err.message);
            throw err;
        });
    }

    processAllProjectTitles() {
        const cppProcess = new CPPProcess('corpusManager');
        return new Promise((resolve, reject) => {
            cppProcess.runProcess(JSON.stringify({command: "getProjectTitles"}), (error, output) => {
                if (error) {
                    console.error("Error: ", error.message);
                    reject(new Error("There was an error running the C++ process getting the project titles: " + error.message));
                } else {
                    console.log("Output from C++ process in Model is: ", output);
                    resolve(output);
                }
            });
        })
        .then(output => {
            return output;
        })
        .catch(err => {
            console.error("Error handling project titles:", err.message);
            throw err;
        });
    }

    processProjectMetadata(projectIdInParams) {
        const cppProcess = new CPPProcess('corpusManager');
        const projectId = {"projectId" : parseInt(projectIdInParams["projectId"]), command: "getProjectMetadata"};
        const jsonDataString = JSON.stringify(projectId);
        return new Promise((resolve, reject) => {
            cppProcess.runProcess(jsonDataString, (error, output) => {
                if (error) {
                    console.error("Error:", error.message);
                    // throws the error to the controller to handle
                    reject(new Error("There was an error running the C++ process getting the corpus metadata: " + error.message));
                } else {
                    console.log("Output from cpp process in Model is: ", output);
                    resolve(output);
                }
            });
        })
        .then(output => {
            return output;
        })
        .catch(err => {
            console.error("Error handling project metadata:", err.message);
            throw err;
        });
        
    }

    addCorpusName(corpusName) {
        corpusName["command"] = "postCorpusName";
        const corpusNameString = JSON.stringify(corpusName);
        const cppProcess = new CPPProcess('corpusManager');
        return new Promise((resolve, reject) => {
            cppProcess.runProcess(corpusNameString, (error, output) => {
                if (error) {
                    console.error("Error:", error.message);
                    reject(new Error("There was an error running the C++ process adding corpus name: " + error.message));
                } else {
                    resolve(output);
                }
            });
        })
        .then(output => {
            return output;
        })
        .catch(err => {
            console.error("Error handling adding corpus name:", err.message);
            throw err;
        });
        
    }

    patchCorpusName(corpusName) {
        corpusName["command"] = "patchCorpusName"
        const corpusNameString = JSON.stringify(corpusName);
        const cppProcess = new CPPProcess('corpusManager');
        return new Promise((resolve, reject) => {
            cppProcess.runProcess(corpusNameString, (error, output) => {
                if (error) {
                    console.error("Error:", error.message);
                    reject(new Error("There was an error running the C++ process updating corpus name: " + error.message));
                } else {
                    console.log("Output from the cpp process: ", output);
                    resolve(output);
                }
            });
        })
        .then(output => {
            return output;
        })
        .catch(err => {
            console.error("Error handling updating corpus name:", err.message);
            throw err;
        });
        
    }

    createCorpusGroup(groupName, corpusId) {
        groupName["command"] = "createCorpusGroup";
        groupName["corpus_id"] = parseInt(corpusId.corpusId);
        const groupNameString = JSON.stringify(groupName);
        console.log("My group name is:", groupNameString);
        const cppProcess = new CPPProcess('corpusManager');
        return new Promise((resolve, reject) => {
            cppProcess.runProcess(groupNameString, (error, output) => {
                if (error) {
                    console.error("Error: ", error.message);
                    reject(new Error("There was an error running the C++ process creating a group name: " + error.message));
                } else {
                    console.log("Output from the cpp process adding a group name: ", output);
                    resolve(output);
                }
            });
        })
        .then(output => {
            return output;
        })
        .catch(err => {
            console.error("Error handling adding a group name to the corpus: ", err.message);
            throw err;
        })
    }

    patchCorpusGroup(groupName, groupId) {
        groupName["command"] = "patchCorpusGroup";
        groupName["group_id"] = parseInt(groupId.groupId);
        const groupNameString = JSON.stringify(groupName);
        const cppProcess = new CPPProcess('corpusManager');
        return new Promise((resolve, reject) => {
            cppProcess.runProcess(groupNameString, (error, output) => {
                if (error) {
                    console.error("Error: ", error.message);
                    reject(new Error("There was an error running the C++ process to update a group name: " + error.message));
                } else {
                    console.log("Output from the cpp process updating a group name: ", output);
                    resolve(output);
                }
            });
        })
        .then(output => {
            return output;
        })
        .catch(err => {
            console.error("Error handling updating a group name in the corpus: ", err.message);
            throw err;
        });
    }

    uploadFileContent(fileContent, groupId) {
        fileContent["command"] = "uploadFileContent";
        fileContent["group_id"] = parseInt(groupId.groupId);
        const fileContentString = JSON.stringify(fileContent);
        const cppProcess = new CPPProcess('corpusManager');
        return new Promise((resolve, reject) => {
            cppProcess.runProcess(fileContentString, (error, output) => {
                if (error) {
                    console.error("Error: ", error.message);
                    reject(new Error("There was an error running the C++ process adding file content: " + error.message));
                } else {
                    resolve(output);
                }
            });
        })
        .then(output => {
            return output;
        })
        .catch(err => {
            console.error("Error handling adding file content to the corpus: ", err.message);
            throw err;
        });
    }

    deleteCorpusFile(fileId) {
        const fileInfo = {"command": "deleteAFile", "fileId": parseInt(fileId.fileId) };
        const fileInfoString = JSON.stringify(fileInfo);
        const cppProcess = new CPPProcess('corpusManager');
        return new Promise((resolve, reject) => {
            cppProcess.runProcess(fileInfoString, (error, output) => {
                if (error) {
                    console.error("Error: ", error.message);
                    reject(new Error("There was an error running the C++ process to delete a reference to a single file and all its associated data: " + error.message));
                } else {
                    console.log("Output from the cpp process deleting a single file: ", output);
                    resolve(output);
                }
            });
        })
        .then(output => {
            return output;
        })
        .catch(err => {
            console.error("Error handling deleting reference to a file in the subcorpus: ", err.message);
            throw err;
        });
    }

    deleteSubcorpus(groupId) {
        console.log(groupId);
        const fileInfo = {"command": "deleteSubcorpus", "groupId": parseInt(groupId.groupId) };
        const fileInfoString = JSON.stringify(fileInfo);
        const cppProcess = new CPPProcess('corpusManager');
        return new Promise((resolve, reject) => {
            cppProcess.runProcess(fileInfoString, (error, output) => {
                if (error) {
                    console.error("Error: ", error.message);
                    reject(new Error("There was an error running the C++ process to delete a sub corpus and all its associated data: " + error.message));
                } else {
                    console.log("Output from the cpp process deleting a subcorpus: ", output);
                    resolve(output);
                }
            });
        })
        .then(output => {
            return output;
        })
        .catch(err => {
            console.error("Error handling deleting a subcorpus.");
            throw err;
        });
    }

    getFileText(fileId) {
        const fileInfo = {"command": "getFileText", "fileId": parseInt(fileId.fileId) };
        console.log("File info is: ", fileInfo);
        const fileInfoString = JSON.stringify(fileInfo);
        const cppProcess = new CPPProcess('corpusManager');
        return new Promise((resolve, reject) => {
            cppProcess.runProcess(fileInfoString, (error, output) => {
                if (error) {
                    console.error("Error: ", error.message);
                    reject(new Error("There was an error running the C++ process to get the text of a file: " + error.message));
                } else {
                    console.log("Output from the cpp process getting the text of a file: ", output);
                    resolve(output);
                }
            });
        })
        .then(output => {
            return output;
        })
        .catch(err => {
            console.error("Error handling getting the text of a file.");
            throw err;
        });
    }

}

module.exports = CorpusManager;