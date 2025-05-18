const express = require('express');
const {
    checkCorpusFilesExist,
    checkCorpusPreppedStatus,
    updateCorpusPreppedStatus,
    insertCorpusPreppedStatus,
    summarizeCorpusWords,
    recountCorpusWords,
} = require('../ServerControllers/corpusSummarizerController.js');

const router = express.Router();
router.use(express.json());

router.get('/project/:corpusId/corpus/status/files', checkCorpusFilesExist); // check that the files exist in the corpus
router.get('/project/:corpusId/corpus/status/:analysisType', checkCorpusPreppedStatus); // check the status of the corpus - does any counting need updating, have any files recently been added?
router.patch('/project/:corpusId/corpus/status/:analysisType/:toBeUpdated', updateCorpusPreppedStatus); // update the status of the corpus - this is done when a file is successfully added or deleted from a subgroup or when a corpus is reanalyzed.
router.post('/project/:corpusId/corpus/status/:analysisType', insertCorpusPreppedStatus); // insert the status of the corpus - this is done when a corpus is analyzed for the first time.

router.post('/project/:corpusId/corpus/summarize/countWords', summarizeCorpusWords); // summarize the corpus word counts for a given corpus id. The corpus id is in the URL.
router.post('project/:corpusId/corpus/summarize/recountWords', recountCorpusWords); // summarize the corpus word counts for a given corpus id by first deleting the current summary
module.exports = router;