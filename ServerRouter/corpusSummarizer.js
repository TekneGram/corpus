const express = require('express');
const { 
    summarizeCorpusWords,
    checkCorpusFilesExist,
} = require('../ServerControllers/corpusSummarizerController.js');

const router = express.Router();
router.use(express.json());

router.post('/project/:corpusId/corpus/wordCount', summarizeCorpusWords); // summarize the corpus word counts for a given corpus id. The corpus id is in the URL.

router.get('/project/:corpusId/corpus/Files', checkCorpusFilesExist);

module.exports = router;