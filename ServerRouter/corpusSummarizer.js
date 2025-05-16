const express = require('express');
const { 
    summarizeCorpusWords,
    checkCorpusFilesExist,
    checkCorpusPreppedStatus,
} = require('../ServerControllers/corpusSummarizerController.js');

const router = express.Router();
router.use(express.json());

router.post('/project/:corpusId/corpus/wordCount', summarizeCorpusWords); // summarize the corpus word counts for a given corpus id. The corpus id is in the URL.

router.get('/project/:corpusId/corpus/files', checkCorpusFilesExist); // check that the files exist in the corpus
router.get('/project/:corpusId/corpus/:analysisType', checkCorpusPreppedStatus); // check the status of the corpus - does any counting need updating, have any files recently been added?

module.exports = router;