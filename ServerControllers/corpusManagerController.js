// Calls the model and handles the data sent back to the front

const CorpusManager = require('../models/corpusManagerModel');

const getProjectMetadata = (req, res) => {
    console.log(req.params);
    // Change the req.params into its correct form for the mode
    const projectId = {"projectId" : parseInt(req.params["projectId"])};
    const jsonDataString = JSON.stringify(projectId);

    const cm = new CorpusManager();
    try {
        const cppOutput = cm.processProjectMetadata(jsonDataString);
        return res.status(200).json(cppOutput);
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Server error in cpp process' });
    }
    
};

const createCorpusName = (req, res) => {
    const corpusNameString = JSON.stringify(req.body);
    const cm = new CorpusManager();
    try {
        const cppOutput = cm.addCorpusGroup(corpusNameString);
        return res.status(200).json(cppOutput);
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Server error in cpp process' });
    }
};

const patchCorpusName = (req, res) => {

};

const createCorpusGroup = (req, res) => {

};

const patchCorpusGroupName = (req, res) => {

};

const postGroupFile = (req, res) => {

};

module.exports = {
    getProjectMetadata,
    createCorpusName,
    patchCorpusName,
    createCorpusGroup,
    patchCorpusGroupName,
    postGroupFile
}