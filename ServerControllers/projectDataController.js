const { spawn } = require('node:child_process');
const path = require('path');

const getProjectMetadata = (req, res) => {
    console.log(req.params);
    const jsonData = JSON.stringify(req.params);

    // spawn cpp process
    const executablePath = path.resolve(__dirname, '../CPP/executables/getProjectMetadata')
    const cppProcess = spawn(executablePath);
    cppProcess.stdin.write(jsonData + ('\n'));
    cppProcess.stdin.end();

    // For checks
    let cppOutput = ""
    let cppErrorOutput = ""
    cppProcess.stdout.on('data', (data) => {
        cppOutput += data.toString();
        console.log('C++ stdout: ', data.toString());
    })
    cppProcess.stderr.on('data', (data) => {
        cppErrorOutput += data.toString();
    })
}

module.exports = {
    getProjectMetadata
}