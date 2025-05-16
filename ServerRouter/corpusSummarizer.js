const express = require('express');
const { 
    summarizeCorpusWords,
    checkCorpusFilesExist,
    checkCorpusPreppedStatus,
    updateCorpusPreppedStatus,
    insertCorpusPreppedStatus,
} = require('../ServerControllers/corpusSummarizerController.js');

const router = express.Router();
router.use(express.json());

router.post('/project/:corpusId/corpus/wordCount', summarizeCorpusWords); // summarize the corpus word counts for a given corpus id. The corpus id is in the URL.

router.get('/project/:corpusId/corpus/files', checkCorpusFilesExist); // check that the files exist in the corpus
router.get('/project/:corpusId/corpus/:analysisType', checkCorpusPreppedStatus); // check the status of the corpus - does any counting need updating, have any files recently been added?
router.patch('/project/:corpusId/corpus/:analysisType/:toBeUpdated', updateCorpusPreppedStatus); // update the status of the corpus - this is done when a file is successfully added or deleted from a subgroup or when a corpus is reanalyzed.
router.post('/project/:corpusId/corpus/:analysisType', insertCorpusPreppedStatus); // insert the status of the corpus - this is done when a corpus is analyzed for the first time.

module.exports = router;