const express = require('express');
const { createCorpusName, processFileContent } = require('../ServerControllers/corpusEditsController');

const router = express.Router();
router.use(express.json());

router.post('/corpus-name',
    createCorpusName
)

router.post('/single-file', 
    processFileContent
);

module.exports = router;