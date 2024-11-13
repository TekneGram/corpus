const express = require('express');
const { processFileContent } = require('../ServerControllers/fileUploadsController');

const router = express.Router();
router.use(express.json());

router.post('/single-file', 
    processFileContent,
    (req, res) => {
        return res.status(200).json({ status: 'success', message: 'all good!' });
    }
)

module.exports = router;