const { spawn } = require('node:child_process');
const path = require('path');
const CPPProcess = require('./utils/cppSpawn');

const getProjectMetadata = (req, res) => {
    console.log(req.params);
    // Change the req.params into its correct form for C++ process
    const projectId = {"projectId" : parseInt(req.params["projectId"])};
    const jsonData = JSON.stringify(projectId);

    const cppProcess = new CPPProcess('getProjectMetadata');
    cppProcess.runProcess(jsonData, (error, output) => {
        if (error) {
            console.error("Error:", error.message);
            res.status(500).json({ status: 'fail', message: 'Server error in cpp process' });
        } else {
            console.log("Output from cpp process: ", output);
            // parse output to be json
            // make sure it looks a certain type
            return res.status(200);
        }
    });
}

module.exports = {
    getProjectMetadata
}