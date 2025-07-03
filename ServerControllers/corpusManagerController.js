// Calls the model and handles the data sent back to the front

const CorpusManager = require('../models/corpusManagerModel');
const CorpusSummarizer = require('../models/corpusSummarizerModel');

const startNewProject = async(req, res) => {
    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.processNewProject(req.body);
        res.status(200).json(cppOutput);
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Internal server error in cpp process' });
    }
}

const updateProjectTitle = async(req, res) => {
    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.processUpdateProjectTitle(req.body, req.params); // title is in the body, projectId is in the params
        res.status(200).json(cppOutput);
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Internal server error in cpp process; could not update project title' });
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
        res.status(200).json({ status: "success", cppOutput: JSON.parse(cppOutput) });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "fail", cppOutput: error });
    }
};

// For uploading the text from a single file
const uploadFileContent = async (req, res) => {
    const cm = new CorpusManager();
    try {
        // upload a single file
        const cppOutput = await cm.uploadFileContent(req.body, req.params);
        // cppOutput type is CorpusFile
        res.status(200).json({ status: "success", cppOutput: JSON.parse(cppOutput) });
    } catch (error) {
        res.status(500).json({ status: "fail", cppOutput: error });
    }
};

// For deleting a reference to a file and all associated text
const deleteCorpusFile = async (req, res) => {
    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.deleteCorpusFile(req.params);
        // cppOutput type is EmptyCPPOutput
        res.status(200).json({ status: "success", cppOutput: { id: 0, message: "File successfully deleted" } });
    } catch (error) {
        res.status(500).json({ status: "fail", cppOutput: error });
    }
};

// For deleting a whole subcorpus and all associated files and texts
const deleteSubcorpus = async (req, res) => {
    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.deleteSubcorpus(req.params);
        // cppOutput type is EmptyCPPOutput
        res.status(200).json({ status: "success", cppOutput: { id: 0, message: "Subcorpus successfully deleted" } });
    } catch (error) {
        res.status(500).json({ status: "fail", cppOutput: error });
    }
};

// For updating the corpus prepped status
const updateCorpusPreppedStatus = async (req, res) => {
    const cs = new CorpusSummarizer();
    req.params.corpusId = parseInt(req.params.corpusId);
    const wordCountParams = { ...req.params, analysisType: 'countWords' };
    const collCountParams = { ...req.params, analysisType: 'countCollocations' };
    const threeBunCountParams = { ...req.params, analysisType: 'countThreeBundles' };
    const fourBunCountParams = { ...req.params, analysisType: 'countFourBundles' };
    try {
        // First check the prepped status of the corpus
        const cppOutputWords = await cs.checkCorpusPreppedStatus(wordCountParams);
        const cppOutputWordsParsed = JSON.parse(cppOutputWords);
        console.log("I have just check the prepped status for word counts: ", cppOutputWordsParsed);

        const cppOutputCollocations = await cs.checkCorpusPreppedStatus(collCountParams);
        console.log("I have just checked the prepped status for collocation counts: ", cppOutputCollocations);

        const cppOutputThreeBundles = await cs.checkCorpusPreppedStatus(threeBunCountParams);
        console.log("I have just checked the prepped status for three bundle counts: ", cppOutputThreeBundles);

        const cppOutputFourBundles = await cs.checkCorpusPreppedStatus(fourBunCountParams);
        console.log("I have just checked the prepped status for four bundle counts: ", cppOutputFourBundles);

        // If the corpus counts are up to date then set them to no longer be up to date
        // since we have just added new files so recounting will be necessary.
        if (cppOutputWordsParsed.up_to_date === true) {
            console.log("HELLO!");
            const resultWords = cs.updateCorpusPreppedStatus({ ...wordCountParams, toBeUpdated: false });
            console.log("The result of updating the corpus prepped status is: ", resultWords);
        }

        if (cppOutputCollocations.up_to_date === true) {
            const resultColls = cs.updateCorpusPreppedStatus({ ...collCountParams, toBeUpdated: false });
            console.log("The result of updating the corpus prepped status is: ", resultColls);
        }

        if (cppOutputThreeBundles.up_to_date === true) {
            const resultThreeBuns = cs.updateCorpusPreppedStatus({ ...threeBunCountParams, toBeUpdated: false });
            console.log("The result of updating the corpus prepped status is: ", resultThreeBuns);
        }

        if (cppOutputFourBundles.up_to_date === true) {
            const resultFourBuns = cs.updateCorpusPreppedStatus({ ...fourBunCountParams, toBeUpdated: false });
            console.log("The result of updating the corpus prepped status is: ", resultFourBuns);
        }

    } catch (error) {
        res.status(500).json({ status: "fail", cppOutput: error });
    }
}

// For getting the text of a file
const getFileText = async (req, res) => {
    const cm = new CorpusManager();
    try {
        const cppOutput = await cm.getFileText(req.params);
        // cppOutput is a string
        res.status(200).json({ status: "success", cppOutput: JSON.parse(cppOutput)})
    } catch (error) {
        res.status(500).json({ status: "fail", cppOutput: error });
    }
}

module.exports = {
    startNewProject,
    updateProjectTitle,
    getAllProjectTitles,
    getProjectMetadata,
    createCorpusName,
    patchCorpusName,
    createCorpusGroup,
    patchCorpusGroupName,
    uploadFileContent,
    deleteCorpusFile,
    deleteSubcorpus,
    updateCorpusPreppedStatus,
    getFileText,
};