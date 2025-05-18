const CPPProcess = require('./utils/cppSpawn');

class CorpusSummarizer {
    constructor() {

    }

    checkCorpusFilesExist(corpusId) {
        corpusId.corpusId = parseInt(corpusId.corpusId);
        corpusId["command"] = "checkCorpusFilesExist";
        const corpusIdString = JSON.stringify(corpusId);
        const cppProcess = new CPPProcess('corpusSummarizer');
        return new Promise((resolve, reject) => {
            cppProcess.runProcess(corpusIdString, (error, output) => {
                if (error) {
                    console.error("Error: ", error.message);
                    reject(new Error("There was an error running the C++ process checking whether the files exist in your corpus."));
                } else {
                    console.log("Output from C++ process checking the files in your corpus: ", output);
                    resolve(output);
                }
            });
        })
        .then (output => {
            return output;
        })
        .catch(err => {
            console.error("Error in C++ process: ", err.message);
            throw err;
        });
    }

    checkCorpusPreppedStatus(corpusIdAndAnalysisType) {
        corpusIdAndAnalysisType.corpusId = parseInt(corpusIdAndAnalysisType.corpusId);
        corpusIdAndAnalysisType["command"] = "checkCorpusPreppedStatus";
        const corpusIdAndAnalysisTypeString = JSON.stringify(corpusIdAndAnalysisType);
        const cppProcess = new CPPProcess('corpusSummarizer');
        return new Promise((resolve, reject) => {
            cppProcess.runProcess(corpusIdAndAnalysisTypeString, (error, output) => {
                if (error) {
                    console.error("Error: ", error.message);
                    reject(new Error("There was an error running the C++ process checking the prepped status of your corpus."));
                } else {
                    console.log("Output from C++ process checking the prepped status of your corpus: ", output);
                    resolve(output);
                }
            });
        })
        .then (output => {
            return output;
        })
        .catch(err => {
            console.error("Error in C++ process: ", err.message);
            console.error("Full stderr from C++: ", cppProcess.getProcessErrors());
            throw err;
        });
    }

    updateCorpusPreppedStatus(corpusPreppedStatusData) {
        corpusPreppedStatusData.corpusId = parseInt(corpusPreppedStatusData.corpusId);
        corpusPreppedStatusData["command"] = "updateCorpusPreppedStatus";
        const corpusPreppedStatusDataString = JSON.stringify(corpusPreppedStatusData);
        console.log("This is my data string: ", corpusPreppedStatusDataString);
        const cppProcess = new CPPProcess('corpusSummarizer');
        return new Promise((resolve, reject) => {
            cppProcess.runProcess(corpusPreppedStatusDataString, (error, output) => {
                if (error) {
                    console.error("Error: ", error.message);
                    reject(new Error("There was an error running the C++ process updating the prepped status of your corpus."));
                } else {
                    console.log("Output from the C++ process updating the prepped status of your corpus: ", output);
                    resolve(output);
                }
            });
        })
        .then (output => {
            return output;
        })
        .catch(err => {
            console.error("Error in C++ process: ", err.message);
            return { error: err, message: err.message };
            throw err;
        });
    }

    insertCorpusPreppedStatus(corpusPreppedStatusData) {
        corpusPreppedStatusData.corpusId = parseInt(corpusPreppedStatusData.corpusId);
        corpusPreppedStatusData["command"] = "insertCorpusPreppedStatus";
        const corpusPreppedStatusDataString = JSON.stringify(corpusPreppedStatusData);
        const cppProcess = new CPPProcess('corpusSummarizer');
        return new Promise((resolve, reject) => {
            cppProcess.runProcess(corpusPreppedStatusDataString, (error, output) => {
                if (error) {
                    console.error("Error: ", error.message);
                    reject(new Error("There was an error running the C++ process inserting the prepped status of your corpus."));
                } else {
                    console.log("Output from the C++ process inserting the prepped status of your corpus: ", output);
                    resolve(output);
                }
            });
        })
        .then (output => {
            return output;
        })
        .catch(err => {
            console.error("Error in C++ process: ", err.message);
            throw err;
        });
    }

    summarizeCorpusWords(corpusId) {
        console.log("The corpusId is: ", corpusId);
        corpusId.corpusId = parseInt(corpusId.corpusId);
        corpusId["command"] = "summarizeCorpusWords";
        const corpusIdString = JSON.stringify(corpusId);
        const cppProcess = new CPPProcess('corpusSummarizer');
        return new Promise((resolve, reject) => {
            cppProcess.runProcess(corpusIdString, (error, output) => {
                if (error) {
                    console.error("Error: ", error.message);
                    reject(new Error("There was an error running the C++ process summarizing the words in your corpus."));
                } else {
                    console.log("Output from C++ process summarizing the words in your corpus: ", output);
                    resolve(output);
                }
            });
        })
        .then (output => {
            return output;
        })
        .catch(err => {
            console.error("Error in C++ process: ", err.message);
            throw err;
        });
    }
}

module.exports = CorpusSummarizer;