// importing the packages
const express = require("express");
const cors = require('cors');
const fileUpload = require('express-fileupload');
require("dotenv").config();
const fs = require('fs');
const download = require('download'); 


//import the helper functions
const {
    uploadFile,
    createUserCorpus,
    deleteDocument,
    getQueryResponse,
    getJwtToken,
    createErrorResponse,
    createSuccessResponse,
    getAccessToken,
    run
} = require("./model_interaction/helpers");


const app = express();
const token = ""

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

    // console.log(req.body);

    res.header('Content-Type', 'text/plain')
    res.status(200).send(req.query.validationToken)
});

app.post("/upload", (req, res) => {
    let thisFile = req.files.file
    const fileName = req.files.file.name
    const type = req.files.file.mimetype
    thisFile.mv(
        `${__dirname}/model_interaction/files/${fileName}`,
        function (err) {
            if (err) {
                return res.status(500).send(err)
            }
        },
    )

    //upload outlook
    //PUT https://graph.microsoft.com/v1.0/users/ffb16b08fcf4f2eb/drive/root:/clever:/${fileName}:/content


    //upload vec
    uploadFile(1, token, fileName)
    res.status(200).json(
        createSuccessResponse({
            message: "Welcome to the backend!",
        })
    );
});

app.get('/update', async (req, res) => {
    
    run();

})

app.post("/query", (req, res) => {
    console.log(req.body.params);
    const response = getQueryResponse(req.body.params, 1, token)
    .then((res)=> {
        const response=res.data.responseSet[0].response;
        res.status(200).json(
            createSuccessResponse({
                data: response
            })
        );
    }
    );

});

app.use((req, res) => {
    res.status(404).json(createErrorResponse(404, 'not found'));
});
  



const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));