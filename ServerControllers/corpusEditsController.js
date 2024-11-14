const { spawn } = require('node:child_process');
const path = require('path');
const CPPProcess = require('./utils/cppSpawn');

const rScriptPath = path.resolve(__dirname, '../R/pos_tag_single_file.R');

const updateCorpusName = (req, res, next) => {
    console.log(req.body);
    // stringify the data
    const jsonData = JSON.stringify(req.body);

    const cppProcess = new CPPProcess('patchCorpusName');
    cppProcess.runProcess(jsonData, (error, output) => {
        if (error) {
            console.error("Error:", error.message);
            res.status(500).json({ status: "fail", message: "Server error in cpp process" });
        } else {
            console.log("Output from cpp process:", output);
            res.status(200);
        }
        
    });


    // // spawn cpp process
    // const executablePath = path.resolve(__dirname, '../CPP/executables/patchCorpusName');
    // const cppProcess = spawn(executablePath);
    // cppProcess.stdin.write(jsonData + ('\n'));
    // cppProcess.stdin.end();

    // // For checks
    // let cppOutput = '';
    // let cppErrorOutput = '';
    // cppProcess.stdout.on('data', (data) => {
    //     cppOutput += data.toString();
    //     console.log('C++ stdout:', data.toString());
    // });
    // cppProcess.stderr.on('data', (data) => {
    //     cppErrorOutput += data.toString();
    //     console.error('C++ stderr:', data.toString());
    // });

    // cppProcess.on('close', (code) => {
    //     if (code === 0) {
    //         console.log("C++ process completed successfully");
    //         console.log("C++ output:", cppOutput);
    //         res.status(200).json(cppOutput);
    //     } else {
    //         console.log("C++ process failed with code", code);
    //         console.log("Error output", cppErrorOutput);
    //         res.status(500).send("Could not process file!");
    //     }
    // });

    // cppProcess.on('error', (err) => {
    //     console.error("Failed to start C++ executable", err);
    //     res.status(500).send("Internal server error");
    // })

    res.status(200);
}

const processFileContent = (req, res, next) => {
    const dataToSend = {
        message: req.body.fileContent
    };

    // Now let's do it for C++
    const executablePath = path.resolve(__dirname, '../CPP/testProgram');
    const cppProcess = spawn(executablePath);
    let cppOutput = '';
    let cppErrorOutput = '';
    cppProcess.stdin.write(req.body.fileContent);
    cppProcess.stdin.end();
    cppProcess.stdout.on('data', (data) => {
        cppOutput += data.toString();
        console.log('C++ stdout:', data.toString());
    });
    cppProcess.stderr.on('data', (data) => {
        cppErrorOutput += data.toString();
        console.error('C++ stderr:', data.toString());
    });

    cppProcess.on('close', (code) => {
        if (code === 0) {
            console.log("C++ process completed successfully");
            console.log("C++ output:", cppOutput);
            res.status(200).json(cppOutput);
        } else {
            console.log("C++ process failed with code", code);
            console.log("Error output", cppErrorOutput);
            res.status(500).send("Could not process file!");
        }
    });

    cppProcess.on('error', (err) => {
        console.error("Failed to start C++ executable", err);
        res.status(500).send("Internal server error");
    })
    
    /**
     * 
     */

    // const envVars = {...process.env, R_INPUT_DATA: JSON.stringify(dataToSend)};
    // const R = spawn('RScript', [rScriptPath], { env: envVars });

    // let output = '';
    // let errorOutput = '';

    // // Capture output from stdout
    // R.stdout.on('data', (data) => {
    //     output += data.toString();
    // });

    // // Capture error from stderr
    // R.stderr.on('data', (data) => {
    //     errorOutput += data.toString();
    //     console.error("R stderr:", data.toString());
    // });

    // // Handle script exit
    // R.on('close', (code) => {
    //     if (code === 0) {
    //         console.log("Successfully processed");
    //         console.log(output);
    //         res.status(200).json(output);  // Send the output to the client
    //     } else {
    //         console.log("Could not process file!", code);
    //         console.log("Error output:", errorOutput);
    //         res.status(500).send("Could not process file!"); // Handle errors
    //     }
    // });

    // // Handle error if R script cannot be spawned
    // R.on('error', (err) => {
    //     console.error("Failed to start RScript", err);
    //     res.status(500).send("Internal server error");
    // });
}

module.exports = {
    processFileContent,
    updateCorpusName
}