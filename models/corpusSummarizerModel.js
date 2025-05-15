const CPPProcess = require('./utils/cppSpawn');

class CorpusSummarizer {
    constructor() {

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
}

module.exports = CorpusSummarizer;