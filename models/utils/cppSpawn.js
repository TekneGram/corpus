const { spawn } = require('node:child_process');
const path = require('path');

class CPPProcess {
    cppProcess;
    cppOutput;
    cppErrorOutput;
    constructor(executable) {
        const executablePath = "../../CPP/executables/" + executable;
        const resolvedPath = path.resolve(__dirname, executablePath);
        console.log(resolvedPath);
        this.cppProcess = spawn(resolvedPath);
        this.cppOutput = '';
        this.cppErrorOutput = '';
        this.cppProcess.on('error', (err) => {
            console.error("Failed to start C++ executable", err);
            this.#sendErrorInExecutable();
        })
    }

    runProcess(jsonData, callback) {
        this.#writeDataToProcess(jsonData);
        this.#collectOutput(callback);
    }

    getProcessOutput() {
        return this.cppOutput;
    }

    getProcessErrors() {
         return this.cppErrorOutput;
    }

    #writeDataToProcess(jsonData) {
        this.cppProcess.stdin.write(jsonData + ('\n'));
        this.cppProcess.stdin.end();
    }

    #sendErrorInExecutable() {
        return 1;
    }

    #collectOutput(callback) {
        this.cppProcess.stdout.on('data', (data) => {
            this.cppOutput += data.toString();
        });

        this.cppProcess.stderr.on('data', (data) => {
            this.cppErrorOutput += data.toString();
        });

        this.cppProcess.on('close', (code) => {
            if (code === 0) {
                console.log("C++ process completed successfully");
                callback(null, this.cppOutput); // Pass the output to the callback
            } else {
                console.log("Could not complete process");
                callback(new Error(this.cppErrorOutput), null); // Pass error to the callback
            }
        })
    }
}

module.exports = CPPProcess