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
const token = "eyJraWQiOiJNbFVBTWtyQkc4ekJrZE9yV00xOWs2MnI2RklNVTI0ZXlzb2tWSmpnNmdvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5YTRmY2U0MS05YWZkLTRhNjAtYmU5Ny02Y2Q2NWI4ZmE1YjAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfYlNLSlF5QVFIIiwiY29nbml0bzp1c2VybmFtZSI6ImtyaW5za3VtYXJAZ21haWwuY29tIiwib3JpZ2luX2p0aSI6IjE2OTNkZThmLTNlZmMtNDY3My04MmI5LTM1NWM4ODNmZThjNiIsImF1ZCI6IjcydGxmOWEwNWV1aDFyZXRmcGhsaGxhZ3BwIiwiZXZlbnRfaWQiOiI5MDE1MjVlMi0zNTcwLTQxYjMtODMzYi03NTFhOTE1ZDNlZTMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY5OTExNTAwMiwiZXhwIjoxNjk5MjAxMDkxLCJpYXQiOjE2OTkxOTc0OTIsImp0aSI6ImU4NzYwZjM3LTRjODAtNGU5MS05ZjMxLTNhNTk3ZDY5ZTEyYiIsImVtYWlsIjoia3JpbnNrdW1hckBnbWFpbC5jb20ifQ.nFRN9HfmbB5Z9blP6W7tyZNTTHDTZS_dyKNadlqJJoySqcRd-bAIBzRy75N5ZtCET52F7CpPJNk3agwU2stW_OTqaUrqT6_zWoAmoXnu5VE2U0Bupd2RZ445BbuyOJnsOVRcKQduFK3olmD_e5vxbEVGPOE7PLORnP-CoXV_SHMbY5npyTKbqz4FO51bFawhvcQKaYfu6l8kJdFhVfT6qlTXRN5UcESgKBPFpdBxh2rnNmfAZRYgwpBV3D14HaMJLeAywVyVGJL7k_Cme0T4nDstSnw2WWa0_9E7un7mYtOJ2mH5RrIrtrUDTsBbdTFW_jCCPhJnqO9-8bNWm7bshA"

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

app.post("/upload", async (req, res) => {
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
        // const token = getJwtToken();
        // const token = "eyJraWQiOiJNbFVBTWtyQkc4ekJrZE9yV00xOWs2MnI2RklNVTI0ZXlzb2tWSmpnNmdvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5YTRmY2U0MS05YWZkLTRhNjAtYmU5Ny02Y2Q2NWI4ZmE1YjAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfYlNLSlF5QVFIIiwiY29nbml0bzp1c2VybmFtZSI6ImtyaW5za3VtYXJAZ21haWwuY29tIiwib3JpZ2luX2p0aSI6IjE2OTNkZThmLTNlZmMtNDY3My04MmI5LTM1NWM4ODNmZThjNiIsImF1ZCI6IjcydGxmOWEwNWV1aDFyZXRmcGhsaGxhZ3BwIiwiZXZlbnRfaWQiOiI5MDE1MjVlMi0zNTcwLTQxYjMtODMzYi03NTFhOTE1ZDNlZTMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY5OTExNTAwMiwiZXhwIjoxNjk5MTc1MTA2LCJpYXQiOjE2OTkxNzE1MDYsImp0aSI6IjgwOTE1YTk0LTgxYTQtNDg5My1iYzc0LWUzZTFlY2FlYmQ3NyIsImVtYWlsIjoia3JpbnNrdW1hckBnbWFpbC5jb20ifQ.rtkPVbHyTxDHfXe1REG56Vh8FwG8yIlqVLIEWXrMK6Dim618V-U9dSw3FYV_yYI_4HNA1bkIO2AcVeytEtE3R_U6YRDDIe26xMp9tDhlRZdXGeqZ5sTO958zB2_0_YAbMQfS-W9DWJwosGCLEnwZ-9wQBbhEL61ExWqw2qK9NVsbMYzKLH68Z_7ygZFM208TUlxsyZYQcnUUzwmZzetGITCn3fUUVRaQ9cGxpKU3YtdleyFczWwEdRCPOqhArtWvz1y6L6S5Fa_ld8Qw2hCjRGoitTS2WgwMO6CBQPbLWoERJupP729yqZfAC4CBhcdFcuenWjzVeaktbo07BlJ8BA"


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

app.post("/query", (req, r) => {
    console.log(req.body.params);
    const response = getQueryResponse(req.body.params, 1, token)
    .then((res)=> {
        const response=res.data.responseSet[0].response;
        r.status(200).json(
            createSuccessResponse({
                data: response
            })
        );
    })

});

app.post("/query", async(req, res) => {
    console.log(req.body.params);
    const token ="eyJraWQiOiJNbFVBTWtyQkc4ekJrZE9yV00xOWs2MnI2RklNVTI0ZXlzb2tWSmpnNmdvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5YTRmY2U0MS05YWZkLTRhNjAtYmU5Ny02Y2Q2NWI4ZmE1YjAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfYlNLSlF5QVFIIiwiY29nbml0bzp1c2VybmFtZSI6ImtyaW5za3VtYXJAZ21haWwuY29tIiwib3JpZ2luX2p0aSI6IjE2OTNkZThmLTNlZmMtNDY3My04MmI5LTM1NWM4ODNmZThjNiIsImF1ZCI6IjcydGxmOWEwNWV1aDFyZXRmcGhsaGxhZ3BwIiwiZXZlbnRfaWQiOiI5MDE1MjVlMi0zNTcwLTQxYjMtODMzYi03NTFhOTE1ZDNlZTMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY5OTExNTAwMiwiZXhwIjoxNjk5MjAxMDkxLCJpYXQiOjE2OTkxOTc0OTIsImp0aSI6ImU4NzYwZjM3LTRjODAtNGU5MS05ZjMxLTNhNTk3ZDY5ZTEyYiIsImVtYWlsIjoia3JpbnNrdW1hckBnbWFpbC5jb20ifQ.nFRN9HfmbB5Z9blP6W7tyZNTTHDTZS_dyKNadlqJJoySqcRd-bAIBzRy75N5ZtCET52F7CpPJNk3agwU2stW_OTqaUrqT6_zWoAmoXnu5VE2U0Bupd2RZ445BbuyOJnsOVRcKQduFK3olmD_e5vxbEVGPOE7PLORnP-CoXV_SHMbY5npyTKbqz4FO51bFawhvcQKaYfu6l8kJdFhVfT6qlTXRN5UcESgKBPFpdBxh2rnNmfAZRYgwpBV3D14HaMJLeAywVyVGJL7k_Cme0T4nDstSnw2WWa0_9E7un7mYtOJ2mH5RrIrtrUDTsBbdTFW_jCCPhJnqO9-8bNWm7bshA"
    console.log(token);
    // const token = "eyJraWQiOiJNbFVBTWtyQkc4ekJrZE9yV00xOWs2MnI2RklNVTI0ZXlzb2tWSmpnNmdvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5YTRmY2U0MS05YWZkLTRhNjAtYmU5Ny02Y2Q2NWI4ZmE1YjAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfYlNLSlF5QVFIIiwiY29nbml0bzp1c2VybmFtZSI6ImtyaW5za3VtYXJAZ21haWwuY29tIiwib3JpZ2luX2p0aSI6IjE2OTNkZThmLTNlZmMtNDY3My04MmI5LTM1NWM4ODNmZThjNiIsImF1ZCI6IjcydGxmOWEwNWV1aDFyZXRmcGhsaGxhZ3BwIiwiZXZlbnRfaWQiOiI5MDE1MjVlMi0zNTcwLTQxYjMtODMzYi03NTFhOTE1ZDNlZTMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY5OTExNTAwMiwiZXhwIjoxNjk5MTcxMDc0LCJpYXQiOjE2OTkxNjc0NzQsImp0aSI6IjY2M2Q0MWJmLTk2MTMtNDJmOS1iNjNjLTkwOWJkNDZiMDA4ZCIsImVtYWlsIjoia3JpbnNrdW1hckBnbWFpbC5jb20ifQ.K6e4nldo-VWgHKlenBg8gqUig6ysxO1dIFDD8GdLXQjnfpXFEhBQdnSQVJV83VsI8INNNIP-0UvsYa9Js9pEgVJCnDSQ0uSozHGytcQRTKcsMBJu1J7PpvBfgIogckZKW4xd0nDOSQ7NVx5d8W80IJKhOF5S4X2nXkpUH0-mw1G9kpaqyKpB1UCEVCvhMyCCjaEiEpYlKnXyiDpB7D-edosKn1kAmvz-S1eTGErd4Qvr9WaQIxeuyMPAGFmroEDzd8GmqZpt6c7T5PTCY1-sZKE_yWMf03u7Rv9YhCPpYlyR3HmZ86Nyxi5eIbqhASmLBGA_h50SRro6n59dvDlCpw";
    // const response = getQueryResponse(req.body.params, 1, token)
    // .then((res)=> {
        // const response=res.data.responseSet[0].response;
    // }).catch(err=>console.log(err));
    const response = await getQueryResponse(req.body.params, 1, token)
    console.log(response.data.responseSet[0].response[0]);
    // const filtered_texts=response.data.responseSet[0].response.filter(res=>res.score>=0.70)
    // console.log(filtered_texts);
    const texts=response.data.responseSet[0].response[0].map((res)=>{
        return {
        text: res.text,
        doc: res.documentIndex,
        score:res.score
    }})
    
    res.status(200).json(
        createSuccessResponse({
            data: texts,
        })
    );
});

app.use((req, res) => {
    res.status(404).json(createErrorResponse(404, 'not found'));
});
  



const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));