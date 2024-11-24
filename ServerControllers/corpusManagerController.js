// Calls the model and handles the data sent back to the front

const CorpusManager = require('../models/corpusManagerModel');

const startNewProject = async(req, res) => {
    const cm = new CorpusManager();
    // const projectTitleString = JSON.stringify(req.body); // originally stringified
    try {
        const cppOutput = await cm.processNewProject(req.body);
        res.status(200).json(cppOutput);
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Internal server error in cpp process' });
    }
}

const getAllProjectTitles = async (req, res) => {
    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.processAllProjectTitles();
        console.log("This is the cppOutput:", cppOutput);
        return res.status(200).json(cppOutput);
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Server error in cpp process' });
    }
}

const getProjectMetadata = async (req, res) => {
    // Change the req.params into its correct form for the mode
    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.processProjectMetadata(req.params);
        return res.status(200).json(cppOutput);
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Server error in cpp process' });
    }
    
};

const createCorpusName = async (req, res) => {
    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.addCorpusName(req.body);
        return res.status(200).json(cppOutput);
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Server error in cpp process' });
    }
};

const patchCorpusName = async (req, res) => {
    // also need to get the corpusId from the req.params - no we don't it's part of the body as well!
    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.patchCorpusName(req.body);
        res.status(200).json(cppOutput);
    } catch (error) {
        res.status(500).json({ status: "fail", message: "Server error in cpp process" });
    }

};

const createCorpusGroup = async (req, res) => {
    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.createCorpusGroup(req.body, req.params);
        res.status(200).json(cppOutput);
    } catch (error) {
        res.status(500).json({ status: "fail", message: "Server error in cpp process adding a group name" });
    }
};

const patchCorpusGroupName = (req, res) => {

};

const uploadFileContent = (req, res) => {
    const cm = new CorpusManager();
    try {
        const cppOutput = cm.uploadFileContent(req.body, req.params);
        res.status(200).json(cppOutput);
    } catch (error) {
        res.status(500).json({ status: "fail", message: "Server error in cpp process adding a group name" });
    }
};

module.exports = {
    startNewProject,
    getAllProjectTitles,
    getProjectMetadata,
    createCorpusName,
    patchCorpusName,
    createCorpusGroup,
    patchCorpusGroupName,
    uploadFileContent
}