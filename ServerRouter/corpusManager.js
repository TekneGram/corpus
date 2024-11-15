const express = require('express');
const { 
    getProjectMetadata, 
    createCorpusName, 
    patchCorpusName, 
    createCorpusGroup, 
    patchCorpusGroupName, 
    postGroupFile 
} = require('../ServerControllers/corpusManagerController.js');


const router = express.Router();
router.use(express.json());

router.get('/project/:projectId/corpus/metadata', getProjectMetadata); // done!
router.post('/corpus', createCorpusName); // corpus name is in the body
router.patch('/corpus/:corpusId', patchCorpusName); // new corpus name is in the body
router.post('/corpus/:corpusId/group', createCorpusGroup); // create a group associated with a particular corpus id. Group name is in the body
router.patch('/groups/:groupId', patchCorpusGroupName); // edit a group name associated with a particular group id. Group name is in the body
router.post('/groups/:groupId/file', postGroupFile); // add a file associated with a particular group id.

module.exports = router;
