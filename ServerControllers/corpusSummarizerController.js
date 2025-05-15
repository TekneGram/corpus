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
        console.log("cppOutput for checking files is: ", cppOutput);
        res.status(200).json({ status: "success", data: cppOutput });
    } catch (error) {
        res.status(500).json({ status: "fail", message: "Internal server error in cpp process." });
    }
}

module.exports = {
    summarizeCorpusWords,
    checkCorpusFilesExist,
}