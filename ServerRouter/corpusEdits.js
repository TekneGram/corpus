const express = require('express');
const { updateCorpusName, processFileContent } = require('../ServerControllers/corpusEditsController');

const router = express.Router();
router.use(express.json());

router.post('/corpus-name',
    updateCorpusName
)

router.post('/single-file', 
    processFileContent
);

module.exports = router;