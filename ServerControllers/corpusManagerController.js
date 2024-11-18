// Calls the model and handles the data sent back to the front

const CorpusManager = require('../models/corpusManagerModel');

const startNewProject = async(req, res) => {
    const cm = new CorpusManager();
    const projectTitleString = JSON.stringify(req.body);
    try {
        const cppOutput = await cm.processNewProject(projectTitleString);
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
    console.log("Controller says: ", req.params);
    // Change the req.params into its correct form for the mode
    const projectId = {"projectId" : parseInt(req.params["projectId"])};
    const jsonDataString = JSON.stringify(projectId);
    console.log("Controller also says: ", jsonDataString);

    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.processProjectMetadata(jsonDataString);
        return res.status(200).json(cppOutput);
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Server error in cpp process' });
    }
    
};

const createCorpusName = async (req, res) => {
    const corpusNameString = JSON.stringify(req.body);
    console.log(corpusNameString);
    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.addCorpusName(corpusNameString);
        return res.status(200).json(cppOutput);
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Server error in cpp process' });
    }
};

const patchCorpusName = async (req, res) => {
    console.log(req.body);
    // also need to get the corpusId from the req.params
    const corpusNameString = JSON.stringify(req.body);
    console.log(corpusNameString);
    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.patchCorpusName(corpusNameString);
        res.status(200).json(cppOutput);
    } catch (error) {
        res.status(500).json({ status: "fail", message: "Server error in cpp process" });
    }

};

const createCorpusGroup = (req, res) => {

};

const patchCorpusGroupName = (req, res) => {

};

const postGroupFile = (req, res) => {

};

module.exports = {
    startNewProject,
    getAllProjectTitles,
    getProjectMetadata,
    createCorpusName,
    patchCorpusName,
    createCorpusGroup,
    patchCorpusGroupName,
    postGroupFile
}