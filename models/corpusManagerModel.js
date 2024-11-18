const CPPProcess = require('./utils/cppSpawn');

class CorpusManager {
    
    constructor() {

    }

    processNewProject(projectTitleString) {
        const cppProcess = new CPPProcess('startNewProject');
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

    processAllProjectTitles() {
        const cppProcess = new CPPProcess('getProjectTitles');
        return new Promise((resolve, reject) => {
            cppProcess.runProcess('', (error, output) => {
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

    processProjectMetadata(projectIdString) {
        const cppProcess = new CPPProcess('getProjectMetadata');
        return new Promise((resolve, reject) => {
            cppProcess.runProcess(projectIdString, (error, output) => {
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

    addCorpusName(corpusNameString) {
        console.log("Inside the manager model;", corpusNameString);
        const cppProcess = new CPPProcess('postCorpusName');
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

    patchCorpusName(corpusNameString) {
        const cppProcess = new CPPProcess('patchCorpusName');
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

    createCorpusGroup(groupNameString) {
        const cppProcess = new CPPProcess('createCorpusGroup');
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

    patchCorpusGroup() {

    }

    processGroupFile() {

    }

}

module.exports = CorpusManager;