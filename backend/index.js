// importing the packages
const express = require("express");
const cors = require('cors');
const fileUpload = require('express-fileupload');
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
app.use(fileUpload())
app.get("/", (req, res) => {
    res.status(200).json(
        createSuccessResponse({
            message: "Welcome to the backend!",
        })
    );
});

app.post('/notification', (req, res) => {

    console.log(req.body);

    res.header('Content-Type', 'text/plain')
    res.status(200).send(req.query.validationToken)
});

app.post("/upload", (req, res) => {
    let thisFile = req.files.file
    const fileName = req.files.file.name
    thisFile.mv(
        `${__dirname}/files/${fileName}`,
        function (err) {
          if (err) {
            return res.status(500).send(err)
          }
          res.json({
            file: `public/${req.files.file.name}`,
          })
        },
      )

    const token = getJwtToken();

    //upload vectara
    uploadFile(1, token, fileName)


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