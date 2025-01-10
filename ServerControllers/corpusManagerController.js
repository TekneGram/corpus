// Calls the model and handles the data sent back to the front

const CorpusManager = require('../models/corpusManagerModel');

const startNewProject = async(req, res) => {
    const cm = new CorpusManager();
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
        console.log("This is the cppOutput for getting all project titles:", cppOutput);
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

/**
 * Responses are all standardized from here.
 * Need to standardize the ones above. 
 */
const createCorpusName = async (req, res) => {
    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.addCorpusName(req.body);
        console.log("This is the CPP Output: ", cppOutput);
        return res.status(200).json({ status: "success", cppOutput: JSON.parse(cppOutput)});
    } catch (error) {
        res.status(500).json({ status: 'fail', cppOutput: error });
    }
};

const patchCorpusName = async (req, res) => {
    // also need to get the corpusId from the req.params - no we don't it's part of the body as well!
    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.patchCorpusName(req.body);
        console.log("This is the CPP Output in patchCorpusName: ", cppOutput);
        res.status(200).json({ status: "success", cppOutput: JSON.parse(cppOutput) });
    } catch (error) {
        res.status(500).json({ status: "fail", cppOutput: error });
    }

};

const createCorpusGroup = async (req, res) => {
    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.createCorpusGroup(req.body, req.params);
        console.log(cppOutput);
        res.status(200).json({ status: "success", cppOutput: JSON.parse(cppOutput) });
    } catch (error) {
        res.status(500).json({ status: "fail", cppOutput: error });
    }
};

// For editing the subcorpus name
const patchCorpusGroupName = async (req, res) => {
    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.patchCorpusGroup(req.body, req.params);
        console.log(cppOutput);
        res.status(200).json({ status: "success", cppOutput:JSON.parse(cppOutput) });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "fail", cppOutput: error });
    }
};

// For uploading the text from a single file
const uploadFileContent = async (req, res) => {
    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.uploadFileContent(req.body, req.params);
        if (cppOutput === '') {
            res.status(200).json({ status: "success" });
        } else {
            res.status(200).json({ status: "success", cppOutput: JSON.parse(cppOutput) });
        }
        
    } catch (error) {
        res.status(500).json({ status: "fail", cppOutput: error });
    }
};

// For deleting a reference to a file and all associated text
const deleteCorpusFile = async (req, res) => {
    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.deleteCorpusFile(req.params);
        res.status(200).json({ status: "success", cppOutput: "file successfully deleted" });
    } catch (error) {
        res.status(500).json({ status: "fail", cppOutput: error });
    }
};

// For deleting a whole subcorpus and all associated files and texts
const deleteSubcorpus = async (req, res) => {
    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.deleteSubcorpus(req.params);
        res.status(200).json({ status: "success", cppOutput: "subcorpus successfully deleted" });
    } catch (error) {
        res.status(500).json({ status: "fail", cppOutput: error });
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
    uploadFileContent,
    deleteCorpusFile,
    deleteSubcorpus
};