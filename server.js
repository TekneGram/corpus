const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const processFilesRoutes = require('./ServerRouter/corpusEdits.js');
const getProjectMetadata = require('./ServerRouter/projectData.js')

const app = express();

app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
}
app.use(cors(corsOptions));
app.use(morgan("dev"));

app.use("/api/corpus-edits", processFilesRoutes);
app.use("/api/corpus-data", getProjectMetadata);

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello from the home page" });
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

module.exports = app;