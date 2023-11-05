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

    // console.log(req.body);

    res.header('Content-Type', 'text/plain')
    res.status(200).send(req.query.validationToken)
});

app.post("/upload", (req, res) => {
    let thisFile = req.files.file
    const fileName = req.files.file.name
    thisFile.mv(
        `${__dirname}/model_interaction/files/${fileName}`,
        function (err) {
          if (err) {
            return res.status(500).send(err)
          }
        //   res.json({
            // file: `public/${req.files.file.name}`,
        //   })
        },
      )

    const token = "eyJraWQiOiJNbFVBTWtyQkc4ekJrZE9yV00xOWs2MnI2RklNVTI0ZXlzb2tWSmpnNmdvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5YTRmY2U0MS05YWZkLTRhNjAtYmU5Ny02Y2Q2NWI4ZmE1YjAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfYlNLSlF5QVFIIiwiY29nbml0bzp1c2VybmFtZSI6ImtyaW5za3VtYXJAZ21haWwuY29tIiwib3JpZ2luX2p0aSI6IjE2OTNkZThmLTNlZmMtNDY3My04MmI5LTM1NWM4ODNmZThjNiIsImF1ZCI6IjcydGxmOWEwNWV1aDFyZXRmcGhsaGxhZ3BwIiwiZXZlbnRfaWQiOiI5MDE1MjVlMi0zNTcwLTQxYjMtODMzYi03NTFhOTE1ZDNlZTMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY5OTExNTAwMiwiZXhwIjoxNjk5MTY3MjA3LCJpYXQiOjE2OTkxNjM2MDcsImp0aSI6IjBhMzYwZTE2LWVjOTMtNGQ4MS1iZDYxLTcwYTE4MTczM2I3MyIsImVtYWlsIjoia3JpbnNrdW1hckBnbWFpbC5jb20ifQ.k3ffoIUD1UvFsxDl_GtZMcOxPpO85-v4wkU3YqpGF3eECHd4hu1mful4pE1s-bCwPistPlQi13IYGNSxQKdh_iU7Ld32d5zORqzC9sb1saaU8GFfGSp0QoL9yJi9Olm7gZ10TbogJfB86jt_jk2CIXy5OiXdBaGWwWIjwuR5PH2Iu87TsZKpV-Vwv8lP10IE8C2cMAMb90Z5_ZRiXfRGweTHWfNT8-o1OQu4JXn0B5boXMT5FubVdVihVmwagVsUmfQd4Bjr746Sd28Hpd2KunimixJWSTk2HyUiZXAhIEpVWNrJg1FvWlh5y-aZqnE8bbPIDrgPfYuf9JLx-BMb3g";

    //upload vectara
    uploadFile(1, token, fileName)


    res.status(200).json(
        createSuccessResponse({
            message: "Welcome to the backend!",
        })
    );
});

app.post("/query", (req, res) => {
    console.log(req.body.params);
    // const token = getJwtToken();
    const token = "eyJraWQiOiJNbFVBTWtyQkc4ekJrZE9yV00xOWs2MnI2RklNVTI0ZXlzb2tWSmpnNmdvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5YTRmY2U0MS05YWZkLTRhNjAtYmU5Ny02Y2Q2NWI4ZmE1YjAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfYlNLSlF5QVFIIiwiY29nbml0bzp1c2VybmFtZSI6ImtyaW5za3VtYXJAZ21haWwuY29tIiwib3JpZ2luX2p0aSI6IjE2OTNkZThmLTNlZmMtNDY3My04MmI5LTM1NWM4ODNmZThjNiIsImF1ZCI6IjcydGxmOWEwNWV1aDFyZXRmcGhsaGxhZ3BwIiwiZXZlbnRfaWQiOiI5MDE1MjVlMi0zNTcwLTQxYjMtODMzYi03NTFhOTE1ZDNlZTMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY5OTExNTAwMiwiZXhwIjoxNjk5MTcxMDc0LCJpYXQiOjE2OTkxNjc0NzQsImp0aSI6IjY2M2Q0MWJmLTk2MTMtNDJmOS1iNjNjLTkwOWJkNDZiMDA4ZCIsImVtYWlsIjoia3JpbnNrdW1hckBnbWFpbC5jb20ifQ.K6e4nldo-VWgHKlenBg8gqUig6ysxO1dIFDD8GdLXQjnfpXFEhBQdnSQVJV83VsI8INNNIP-0UvsYa9Js9pEgVJCnDSQ0uSozHGytcQRTKcsMBJu1J7PpvBfgIogckZKW4xd0nDOSQ7NVx5d8W80IJKhOF5S4X2nXkpUH0-mw1G9kpaqyKpB1UCEVCvhMyCCjaEiEpYlKnXyiDpB7D-edosKn1kAmvz-S1eTGErd4Qvr9WaQIxeuyMPAGFmroEDzd8GmqZpt6c7T5PTCY1-sZKE_yWMf03u7Rv9YhCPpYlyR3HmZ86Nyxi5eIbqhASmLBGA_h50SRro6n59dvDlCpw";
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