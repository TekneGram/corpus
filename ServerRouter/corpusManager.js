const express = require('express');
const { 
    startNewProject,
    getAllProjectTitles,
    getProjectMetadata, 
    createCorpusName, 
    patchCorpusName, 
    createCorpusGroup, 
    patchCorpusGroupName, 
    uploadFileContent,
    deleteCorpusFile,
    deleteSubcorpus,
} = require('../ServerControllers/corpusManagerController.js');


const router = express.Router();
router.use(express.json());

router.post('/project', startNewProject); // starts a new project by setting a title
router.get('/project', getAllProjectTitles); // get all the project titles
router.get('/project/:projectId/corpus/metadata', getProjectMetadata); // get the metadata for the corpus associated with a project with id projectId!
router.post('/corpus', createCorpusName); // corpus name is in the body
router.patch('/corpus/:corpusId', patchCorpusName); // new corpus name is in the body
router.post('/corpus/:corpusId/group', createCorpusGroup); // create a group associated with a particular corpus id. Group name is in the body
router.patch('/groups/:groupId', patchCorpusGroupName); // edit a group name associated with a particular group id. Group name is in the body
router.post('/groups/:groupId/file', uploadFileContent); // add a file associated with a particular group id.
router.delete('/files/:fileId', deleteCorpusFile); // delete a file given its ID. Will also delete other data associated with it.
router.delete('/groups/:groupId', deleteSubcorpus); // delete a corpus group given its ID. Will also delete other data associated with the subcorpus.

module.exports = router;
