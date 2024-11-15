const CPPProcess = require('./utils/cppSpawn');

class CorpusManager {
    
    constructor() {

    }

    processProjectMetadata(projectIdString) {
        const cppProcess = new CPPProcess('getProjectMetadata');
        cppProcess.runProcess(projectIdString, (error, output) => {
            if (error) {
                console.error("Error:", error.message);
                // throws the error to the controller to handle
                throw new Error("There was an error running the c++ process getting project metadata: ", error);
            } else {
                console.log("Output from cpp process: ", output);
                return output;
            }
        });
    }

    addCorpusName(corpusNameString) {
        const cppProcess = new CPPProcess('postCorpusName');
        cppProcess.runProcess(corpusNameString, (error, output) => {
            if (error) {
                console.error("Error:", error.message);
                throw new Error("There was an error running the c++ process adding corpus name: ", error);
            } else {
                console.log("Output from cpp process:", output);
                return output;
            }
        });
    }

    patchCorpusName(corpusNameString) {
        const cppProcess = new CPPProcess('patchCorpusName');
        cppProcess.runProcess(corpusNameString, (error, output) => {
            if (error) {
                console.error("Error:", error.message);
                throw new Error("There was an error running the c++ process patching the corpus name: ", error);
            } else {
                console.log("Output from the cpp process: ", output);
                return output;
            }
        });
    }

    addCorpusGroup() {

    }

    patchCorpusGroup() {

    }

    processGroupFile() {

    }

}

module.exports = CorpusManager;