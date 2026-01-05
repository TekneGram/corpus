const express = require('express');
const router = express.Router();

const { getProjectMetadata } = require('../ServerControllers/projectDataController');

router.use(express.json());

router.get('/metadata/:projectId',
    getProjectMetadata
);

module.exports = router;