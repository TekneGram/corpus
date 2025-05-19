const CorpusSummarizer = require('../models/corpusSummarizerModel.js');

const checkCorpusFilesExist = async (req, res) => {
    const cm = new CorpusSummarizer();
    try {
        const cppOutput = await cm.checkCorpusFilesExist(req.params);
        // I HAVE LEARNED SOMETHING NEW HERE
        // THE JSON SENT BACK FROM CPP MUST BE PARSED IN ORDER TO BE SENT BACK TO FRONT END AS AN OBJECT!
        // IF IT IS NOT PARSED, IT WILL BE SENT BACK AS A SERIALIZED STRING WITHIN A JSON OBJECT AND IT WILL
        // NOT MATCH THE TYPES ON THE FRONT END
        res.status(200).json({ status: "success", cppOutput: JSON.parse(cppOutput) });
    } catch (error) {
        res.status(500).json({ status: "fail", message: "Internal server error in cpp process." });
    }
}

const checkCorpusPreppedStatus = async (req, res) => {
    const cm = new CorpusSummarizer();
    try {
        const cppOutput = await cm.checkCorpusPreppedStatus(req.params);
        console.log("Output from C++ process checking corpus prepped status is: ", cppOutput);
        res.status(200).json({ status: "success", cppOutput: JSON.parse(cppOutput) });
    } catch (error) {
        res.status(500).json({ status: "fail", message: "Internal server error in cpp process" });
    }
}

const updateCorpusPreppedStatus = async (req, res) => {
    const cm = new CorpusSummarizer();
    try {
        const cppOutput = await cm.updateCorpusPreppedStatus(req.params);
        res.status(200).json({ status: "success", cppOutput: JSON.parse(cppOutput) });
    } catch (error) {
        res.status(500).json({ status: "fail", message: "Internal server error in cpp process" });
    }
}

const insertCorpusPreppedStatus = async (req, res) => {
    const cm = new CorpusSummarizer();
    try {
        const cppOutput = await cm.insertCorpusPreppedStatus(req.params);
        res.status(200).json({ status: "success", cppOutput: JSON.parse(cppOutput) });
    } catch (error) {
        res.status(500).json({ status: "fail", message: "Internal server error in cpp process" });
    }
}

const summarizeCorpusWords = async (req, res) => {
    // Establish the model
    const cm = new CorpusSummarizer();
    try {
        // Call the model to perform the word count algorithm
        await cm.summarizeCorpusWords(req.params);
        
        // Set up params for inserting into corpus_prepped_status
        corpusPreppedStatusParams = { corpusId: req.params.corpusId, analysisType: "countWords" };

        // Call the model again to insert the current status into the database.
        const cppOutputInsert = await cm.insertCorpusPreppedStatus(corpusPreppedStatusParams);
        console.log("After inserting into corpus_prepped_status: ", cppOutputInsert);

        // Parse result into JSON to send it back to the front end.
        try {
            parsedcppOutputInsert = JSON.parse(cppOutputInsert);
            console.log("after parsing:", parsedcppOutputInsert);
        } catch (parseErr) {
            res.status(500).json({ status: "fail", message: `Error parsing JSON in the backend: ${parseErr}` });
        }

        // Send to front end
        res.status(200).json({ status: "success", cppOutputInsertResult: parsedcppOutputInsert });
    } catch (error) {
        // If there is an error, send it to the front end
        res.status(500).json({ status: "fail", message: "Internal server error in cpp process." });
    }
}

const recountCorpusWords = async (req, res) => {
    // Establish the model
    const cm = new CorpusSummarizer();
    try {
        // Call the model to perform the recount algorithm
        await cm.recountCorpusWords(req.params);

        // Set up params for inserting into corpus_prepped_status
        corpusPreppedStatusParams = { corpusId: req.params.corpusId, analysisType: "countWords", toBeUpdated: true };

        // Call the model again to insert the current status into the database
        const cppOutputInsert = await cm.updateCorpusPreppedStatus(corpusPreppedStatusParams);
        console.log("After inserting into corpus_prepped_status after recounting: ", cppOutputInsert);

        // Parse result into JSON to send it back to the front end.
        try {
            parsedcppOutputInsert = JSON.parse(cppOutputInsert);
            console.log("After parsing: ", parsedcppOutputInsert);
        } catch (parseErr) {
            res.status(500).json({ status: "fail", message: `Error parsing JSON in the backend: ${parseErr}` });
        }

        // Send to front end
        res.status(200).json({ status: "success", cppOutputInsertResult: parsedcppOutputInsert });
    } catch (error) {
        // If there is an error, send it to the front end
        res.status(500).json({ status: "fail", message: "Internal server error in cpp process." });
    }
}

const fetchWordCounts = async (req, res) => {
    const cs = new CorpusSummarizer();
    try {
        // Call the model to fetch the word counts
        const result = await cs.fetchWordCounts(req.params);

        // Parse the results into JSON to send back to the front end.
        try {
            parsedResult = JSON.parse(result);
        } catch (parseErr) {
            res.status(500).json({ status: "fail", message: `Error parsing JSON in the backend: ${parseErr}` });
        }

        // Send to the front end
        res.status(200).json({ status: "success", cppOutput: parsedResult });
        
    } catch (error) {
        res.status(500).json({ status: "fail", message: `Internal server error in the cpp process: ${error}` });
    }
}

module.exports = {
    checkCorpusFilesExist,
    checkCorpusPreppedStatus,
    updateCorpusPreppedStatus,
    insertCorpusPreppedStatus,
    summarizeCorpusWords,
    recountCorpusWords,
    fetchWordCounts,
}