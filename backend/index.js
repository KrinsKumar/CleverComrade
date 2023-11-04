// importing the packages
const express = require("express");
const cors = require('cors');
require("dotenv").config();

//import the helper functions
const {
    uploadFile,
    createUserCorpus,
    deleteDocument,
    getQueryResponse,
    getJwtToken,
    createErrorResponse,
    createSuccessResponse,
} = require("./model_interaction/helpers");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json(
        createSuccessResponse({
            message: "Welcome to the backend!",
        })
    );
});

app.post("/upload", (req, res) => {
    res.status(200).json(
        createSuccessResponse({
            message: "Welcome to the backend!",
        })
    );
});

app.post("/query", (req, res) => {
    const token = getJwtToken();
    const response = getQueryResponse(req.body.query, req.body.userId, token);

    res.status(200).json(
        createSuccessResponse({
            message: "Welcome to the backend!",
        })
    );
});

app.use((req, res) => {
    res.status(404).json(createErrorResponse(404, 'not found'));
});
  



const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));