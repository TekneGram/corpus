const CorpusSummarizer = require('../models/corpusSummarizerModel.js');

const summarizeCorpusWords = async (req, res) => {
    const cm = new CorpusSummarizer();
    try {
        const cppOutput = await cm.summarizeCorpusWords(req.params);
        console.log("This is the CPP outout: ", cppOutput);
        res.status(200).json(cppOutput);
    } catch (error) {
        res.status(500).json({ status: "fail", message: "Internal server error in cpp process." });
    }
}

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
        const cppOutput = await cm.checkCorpusPreppedstatus(req.params);
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

module.exports = {
    summarizeCorpusWords,
    checkCorpusFilesExist,
    checkCorpusPreppedStatus,
    updateCorpusPreppedStatus,
    insertCorpusPreppedStatus
}