const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
require("dotenv").config();
const download = require('download'); 

// get values from .env file
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const auth_endpoint = process.env.AUTH_URL;
const endpoint = process.env.ENDPOINT;
const id = process.env.USER_ID;
const OAUTH_JWT = process.env.OAUTH_JWT;

token="eyJraWQiOiJNbFVBTWtyQkc4ekJrZE9yV00xOWs2MnI2RklNVTI0ZXlzb2tWSmpnNmdvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5YTRmY2U0MS05YWZkLTRhNjAtYmU5Ny02Y2Q2NWI4ZmE1YjAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfYlNLSlF5QVFIIiwiY29nbml0bzp1c2VybmFtZSI6ImtyaW5za3VtYXJAZ21haWwuY29tIiwib3JpZ2luX2p0aSI6IjE2OTNkZThmLTNlZmMtNDY3My04MmI5LTM1NWM4ODNmZThjNiIsImF1ZCI6IjcydGxmOWEwNWV1aDFyZXRmcGhsaGxhZ3BwIiwiZXZlbnRfaWQiOiI5MDE1MjVlMi0zNTcwLTQxYjMtODMzYi03NTFhOTE1ZDNlZTMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY5OTExNTAwMiwiZXhwIjoxNjk5MjAxMDkxLCJpYXQiOjE2OTkxOTc0OTIsImp0aSI6ImU4NzYwZjM3LTRjODAtNGU5MS05ZjMxLTNhNTk3ZDY5ZTEyYiIsImVtYWlsIjoia3JpbnNrdW1hckBnbWFpbC5jb20ifQ.nFRN9HfmbB5Z9blP6W7tyZNTTHDTZS_dyKNadlqJJoySqcRd-bAIBzRy75N5ZtCET52F7CpPJNk3agwU2stW_OTqaUrqT6_zWoAmoXnu5VE2U0Bupd2RZ445BbuyOJnsOVRcKQduFK3olmD_e5vxbEVGPOE7PLORnP-CoXV_SHMbY5npyTKbqz4FO51bFawhvcQKaYfu6l8kJdFhVfT6qlTXRN5UcESgKBPFpdBxh2rnNmfAZRYgwpBV3D14HaMJLeAywVyVGJL7k_Cme0T4nDstSnw2WWa0_9E7un7mYtOJ2mH5RrIrtrUDTsBbdTFW_jCCPhJnqO9-8bNWm7bshA"

let uploadFile = async function (user_id, auth_token, file_name) {
    const data = new FormData();
    data.append('c', id);
    data.append('o', user_id);
    // console.log(__dirname + '/files/' + file_name);
    data.append('file', fs.createReadStream(__dirname + '/files/' + file_name));

    const config = {
        headers: {
            'Authorization': `Bearer ${auth_token}`,
            'Content-Type': 'multipart/form-data'
        }
    };
    const result = await axios.post(`https://${endpoint}/v1/upload`, data, config);
    console.log({result:result.data.response});
    return result;
}


let createUserCorpus = async function (auth_token, name) {
    const data = {
        'corpus': {
            'name': name,
            'description': 'User of Clever'
        }
    };
    const config = {
        headers: {
            'Authorization': `Bearer ${auth_token}`,
            'Content-Type': 'application/json',
            'customer-id': customer_id.toString()
        }
    };

    const result = await axios.post(`https://${endpoint}/v1/create-corpus`, data, config);
    return result;
}

let deleteDocument = async function (user_id, auth_token, document_id) {
    const data = {
      customer_id: id,
      corpus_id: user_id,
      document_id: document_id,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        "customer-id": id.toString(),
      },
    };

    const result = await axios.post(
      `https://${endpoint}/v1/delete-doc`,
      data,
      config
    );

    console.log(result.data);
    return result;
}

let getQueryResponse = async function (query, user_id, auth_token) {
  console.log("started")
    const data =  {
        'query': [
            {
                'query': query,
                'numResults': 10,
                'corpusKey': [
                    {
                        'customerId': id,
                        'corpusId': user_id
                    }
                ]
            }
        ]
    };
    
    const config = {
        headers: {
            'Authorization': `Bearer ${auth_token}`,
            'Content-Type': 'application/json',
            'customer-id': id.toString()
        }
    };

    const result = await axios.post(`https://${endpoint}/v1/query`, data, config);
    console.log("ended")
    return result;

}

async function getJwtToken() {
  console.log(client_secret, client_id, auth_endpoint)
  // const {
    // data: { access_token: jwt }
  // } = await axios({
  //   method: "POST",
  //   headers: { "content-type": "application/x-www-form-urlencoded" },
  //   data: JSON.stringify({
  //     grant_type: "client_credentials",
  //     client_id: client_id,
  //     client_secret: client_secret
  //   }),
  //   url: auth_endpoint
  // });

  // return data;
}

function createSuccessResponse (data) {
  return {
    status: 'ok',
    ...data,
  };
};

function createErrorResponse (code, message) {
  return {
    status: 'error',
    error: {
      code,
      message,
    },
  };
};

let getAccessToken = async function() {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://dev-bcjg7r08aljx51m6.us.auth0.com/api/v2/users',
    headers: { 
      'Accept': 'application/json', 
      'Authorization': 'Bearer ' + "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlZSbTJ3c19Pc3pXN1Fvb2twa0N3QSJ9.eyJpc3MiOiJodHRwczovL2Rldi1iY2pnN3IwOGFsang1MW02LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJzN2Q4M0hZbTNWSzJPQ216anlrckJwdzNTdWJaSldFTkBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYtYmNqZzdyMDhhbGp4NTFtNi51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTY5OTEzNzY2MCwiZXhwIjoxNzAxNzI5NjYwLCJhenAiOiJzN2Q4M0hZbTNWSzJPQ216anlrckJwdzNTdWJaSldFTiIsInNjb3BlIjoicmVhZDpjbGllbnRfZ3JhbnRzIGNyZWF0ZTpjbGllbnRfZ3JhbnRzIGRlbGV0ZTpjbGllbnRfZ3JhbnRzIHVwZGF0ZTpjbGllbnRfZ3JhbnRzIHJlYWQ6dXNlcnMgdXBkYXRlOnVzZXJzIGRlbGV0ZTp1c2VycyBjcmVhdGU6dXNlcnMgcmVhZDp1c2Vyc19hcHBfbWV0YWRhdGEgdXBkYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBkZWxldGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgcmVhZDp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfY3VzdG9tX2Jsb2NrcyBkZWxldGU6dXNlcl9jdXN0b21fYmxvY2tzIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOnJ1bGVzX2NvbmZpZ3MgdXBkYXRlOnJ1bGVzX2NvbmZpZ3MgZGVsZXRlOnJ1bGVzX2NvbmZpZ3MgcmVhZDpob29rcyB1cGRhdGU6aG9va3MgZGVsZXRlOmhvb2tzIGNyZWF0ZTpob29rcyByZWFkOmFjdGlvbnMgdXBkYXRlOmFjdGlvbnMgZGVsZXRlOmFjdGlvbnMgY3JlYXRlOmFjdGlvbnMgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDppbnNpZ2h0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOmxvZ3NfdXNlcnMgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIHVwZGF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHVwZGF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyBkZWxldGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyBjcmVhdGU6c2lnbmluZ19rZXlzIHJlYWQ6c2lnbmluZ19rZXlzIHVwZGF0ZTpzaWduaW5nX2tleXMgcmVhZDpsaW1pdHMgdXBkYXRlOmxpbWl0cyBjcmVhdGU6cm9sZV9tZW1iZXJzIHJlYWQ6cm9sZV9tZW1iZXJzIGRlbGV0ZTpyb2xlX21lbWJlcnMgcmVhZDplbnRpdGxlbWVudHMgcmVhZDphdHRhY2tfcHJvdGVjdGlvbiB1cGRhdGU6YXR0YWNrX3Byb3RlY3Rpb24gcmVhZDpvcmdhbml6YXRpb25zX3N1bW1hcnkgY3JlYXRlOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMgcmVhZDphdXRoZW50aWNhdGlvbl9tZXRob2RzIHVwZGF0ZTphdXRoZW50aWNhdGlvbl9tZXRob2RzIGRlbGV0ZTphdXRoZW50aWNhdGlvbl9tZXRob2RzIHJlYWQ6b3JnYW5pemF0aW9ucyB1cGRhdGU6b3JnYW5pemF0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9uX21lbWJlcnMgcmVhZDpvcmdhbml6YXRpb25fbWVtYmVycyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyByZWFkOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyB1cGRhdGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJfcm9sZXMgcmVhZDpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIGRlbGV0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIGNyZWF0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMgcmVhZDpvcmdhbml6YXRpb25faW52aXRhdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9pbnZpdGF0aW9ucyBkZWxldGU6cGhvbmVfcHJvdmlkZXJzIGNyZWF0ZTpwaG9uZV9wcm92aWRlcnMgcmVhZDpwaG9uZV9wcm92aWRlcnMgdXBkYXRlOnBob25lX3Byb3ZpZGVycyBkZWxldGU6cGhvbmVfdGVtcGxhdGVzIGNyZWF0ZTpwaG9uZV90ZW1wbGF0ZXMgcmVhZDpwaG9uZV90ZW1wbGF0ZXMgdXBkYXRlOnBob25lX3RlbXBsYXRlcyBjcmVhdGU6ZW5jcnlwdGlvbl9rZXlzIHJlYWQ6ZW5jcnlwdGlvbl9rZXlzIHVwZGF0ZTplbmNyeXB0aW9uX2tleXMgZGVsZXRlOmVuY3J5cHRpb25fa2V5cyByZWFkOmNsaWVudF9jcmVkZW50aWFscyBjcmVhdGU6Y2xpZW50X2NyZWRlbnRpYWxzIHVwZGF0ZTpjbGllbnRfY3JlZGVudGlhbHMgZGVsZXRlOmNsaWVudF9jcmVkZW50aWFscyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.gDlLeIXkN0n4iH3wEIvcSgEy08Q3d6flScbktY9YaqprL48pzqL4IPXy_LNVllcydfwOSatzKaLmp06x5z3CVHDm5dMVx3GCkZZ2Wh63Um2PfLZbKJtvN3B7S88SsvGVlj0vphUvkf-zVhB8Bqb7S8LToJ-2B5xy76f8SS_X7_LmWh2Fw4DJrKvR535A6leyknov73fNcW2TQ6XGJY2s3pDkKBaBjE5WXWGdwnTq323G3bJPmcjpVUlNlKf7_Ed1zZp8cznX3srq46TCkWPueBwB0vMNxmqRohr_oHGBS8JFTgVAaNCLPXVD6VVkxxVkFYPUnPIAyl8Db7G-2_ODnw"
    }
  };
  
  axios.request(config)
  .then((response) => {
    for (let user of response.data) {
      if (user.email == "clevercomrade@outlook.com") {
        console.log(user.identities[0].access_token)
        return user.identities[0].access_token;
      }
    }

  })
  .catch((error) => {
    console.log(error);
    return null;
  });
}

let getUserId = async function() {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://dev-bcjg7r08aljx51m6.us.auth0.com/api/v2/users',
    headers: { 
      'Accept': 'application/json', 
      'Authorization': 'Bearer ' + "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlZSbTJ3c19Pc3pXN1Fvb2twa0N3QSJ9.eyJpc3MiOiJodHRwczovL2Rldi1iY2pnN3IwOGFsang1MW02LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJzN2Q4M0hZbTNWSzJPQ216anlrckJwdzNTdWJaSldFTkBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYtYmNqZzdyMDhhbGp4NTFtNi51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTY5OTEzNzY2MCwiZXhwIjoxNzAxNzI5NjYwLCJhenAiOiJzN2Q4M0hZbTNWSzJPQ216anlrckJwdzNTdWJaSldFTiIsInNjb3BlIjoicmVhZDpjbGllbnRfZ3JhbnRzIGNyZWF0ZTpjbGllbnRfZ3JhbnRzIGRlbGV0ZTpjbGllbnRfZ3JhbnRzIHVwZGF0ZTpjbGllbnRfZ3JhbnRzIHJlYWQ6dXNlcnMgdXBkYXRlOnVzZXJzIGRlbGV0ZTp1c2VycyBjcmVhdGU6dXNlcnMgcmVhZDp1c2Vyc19hcHBfbWV0YWRhdGEgdXBkYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBkZWxldGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgcmVhZDp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfY3VzdG9tX2Jsb2NrcyBkZWxldGU6dXNlcl9jdXN0b21fYmxvY2tzIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOnJ1bGVzX2NvbmZpZ3MgdXBkYXRlOnJ1bGVzX2NvbmZpZ3MgZGVsZXRlOnJ1bGVzX2NvbmZpZ3MgcmVhZDpob29rcyB1cGRhdGU6aG9va3MgZGVsZXRlOmhvb2tzIGNyZWF0ZTpob29rcyByZWFkOmFjdGlvbnMgdXBkYXRlOmFjdGlvbnMgZGVsZXRlOmFjdGlvbnMgY3JlYXRlOmFjdGlvbnMgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDppbnNpZ2h0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOmxvZ3NfdXNlcnMgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIHVwZGF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHVwZGF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyBkZWxldGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyBjcmVhdGU6c2lnbmluZ19rZXlzIHJlYWQ6c2lnbmluZ19rZXlzIHVwZGF0ZTpzaWduaW5nX2tleXMgcmVhZDpsaW1pdHMgdXBkYXRlOmxpbWl0cyBjcmVhdGU6cm9sZV9tZW1iZXJzIHJlYWQ6cm9sZV9tZW1iZXJzIGRlbGV0ZTpyb2xlX21lbWJlcnMgcmVhZDplbnRpdGxlbWVudHMgcmVhZDphdHRhY2tfcHJvdGVjdGlvbiB1cGRhdGU6YXR0YWNrX3Byb3RlY3Rpb24gcmVhZDpvcmdhbml6YXRpb25zX3N1bW1hcnkgY3JlYXRlOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMgcmVhZDphdXRoZW50aWNhdGlvbl9tZXRob2RzIHVwZGF0ZTphdXRoZW50aWNhdGlvbl9tZXRob2RzIGRlbGV0ZTphdXRoZW50aWNhdGlvbl9tZXRob2RzIHJlYWQ6b3JnYW5pemF0aW9ucyB1cGRhdGU6b3JnYW5pemF0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9uX21lbWJlcnMgcmVhZDpvcmdhbml6YXRpb25fbWVtYmVycyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyByZWFkOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyB1cGRhdGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJfcm9sZXMgcmVhZDpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIGRlbGV0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIGNyZWF0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMgcmVhZDpvcmdhbml6YXRpb25faW52aXRhdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9pbnZpdGF0aW9ucyBkZWxldGU6cGhvbmVfcHJvdmlkZXJzIGNyZWF0ZTpwaG9uZV9wcm92aWRlcnMgcmVhZDpwaG9uZV9wcm92aWRlcnMgdXBkYXRlOnBob25lX3Byb3ZpZGVycyBkZWxldGU6cGhvbmVfdGVtcGxhdGVzIGNyZWF0ZTpwaG9uZV90ZW1wbGF0ZXMgcmVhZDpwaG9uZV90ZW1wbGF0ZXMgdXBkYXRlOnBob25lX3RlbXBsYXRlcyBjcmVhdGU6ZW5jcnlwdGlvbl9rZXlzIHJlYWQ6ZW5jcnlwdGlvbl9rZXlzIHVwZGF0ZTplbmNyeXB0aW9uX2tleXMgZGVsZXRlOmVuY3J5cHRpb25fa2V5cyByZWFkOmNsaWVudF9jcmVkZW50aWFscyBjcmVhdGU6Y2xpZW50X2NyZWRlbnRpYWxzIHVwZGF0ZTpjbGllbnRfY3JlZGVudGlhbHMgZGVsZXRlOmNsaWVudF9jcmVkZW50aWFscyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.gDlLeIXkN0n4iH3wEIvcSgEy08Q3d6flScbktY9YaqprL48pzqL4IPXy_LNVllcydfwOSatzKaLmp06x5z3CVHDm5dMVx3GCkZZ2Wh63Um2PfLZbKJtvN3B7S88SsvGVlj0vphUvkf-zVhB8Bqb7S8LToJ-2B5xy76f8SS_X7_LmWh2Fw4DJrKvR535A6leyknov73fNcW2TQ6XGJY2s3pDkKBaBjE5WXWGdwnTq323G3bJPmcjpVUlNlKf7_Ed1zZp8cznX3srq46TCkWPueBwB0vMNxmqRohr_oHGBS8JFTgVAaNCLPXVD6VVkxxVkFYPUnPIAyl8Db7G-2_ODnw"
    }
  };
  
  axios.request(config)
  .then((response) => {
    for (let user of response.data) {
      if (user.email == "clevercomrade@outlook.com") {
        return user.identities[0].user_id;
      }
    }

  })
  .catch((error) => {
    console.log(error);
    return null;
  });
}


let run = async function() {

  await deleteDocument(1, token, "orange.txt");


  // const access = await getAccessToken();
  const access = "EwBoA8l6BAAUAOyDv0l6PcCVu89kmzvqZmkWABkAAeSdlo7QAm94WCwZP5BodkgO7t6pHnABGiaFcjn7NmYtfUzbEgAaSp1xjE9A9zEx9EL8XjCJvOGCP3XsYIqsiTqGOvmH3FnGiOoQ9XaxpDr5aqKW4OOwSQMt2mr6LWMPjMciPzsOlnKPWX6AUxsXvYJNR0RvuHIijFGHT7QF9+jXSlT1rNCZsBHjMGS/wsL1wHJc2AWrw+bN6gIvCiot9TPn/dEjjNe/aodgtearFk3QJ3tw7xiAfocVXR92F2uILKFD3jD6jO/uwSb+AxlcGysSPOXPaCu7tRXRsK/B/RM71WKTS0wVJ79CqhK8tau1EhbG9oif99zX5jfH4ny4YUsDZgAACB7ETpOWvMAsOAK96SYon/0/0oFWs/hE5Mc+sa8qTwg270Kj7FE6ruYVv18DcoT8fFmvpNfn/xA2cvefcEOjbfgbsX0TFrUCUHid7C8RGVP96sXEwavCV+92a4pMFnQw7Kps1BJ64RuMFnD6tLQ4aSMYSuFewzv/UpTnEjAEmfmn3SCcSEzUqMxGeek0dzWjLNSeIo6DjVf6/Lx/VQlsMfyopSKcCy8q060/LDnUGPA+qBvfvDRkFvmZJbkfmN3GuXBe+de566gsZlVxXXgeLoYCz9sA//nzt2t7D/+stXUxYAMmzbNElL9fJaTX+ApVqXoexqwHFobvKsEgKTPoDzj3t9HTYYiSJb7GRV+DtsCqdGrMAqRshOgahFrm1XrQ0S7mJHOvtu0YWMbx/i7DKoR2zw4XbUo6m9Ve8CO2lSU4JQ9s7vkuqQX+cvMBloX42y8zZ0dgyw9x/THIq7odn7h7u5uTRuMe9G/Ztr8nnIxEOLh8m7QWpZacTTRhHaAiVDPFiTl4fISnabISrJ1zVXIfFCvQ7+c1NJBuLWifHtynjKJ4/G/GK+GqAe0SaZoPsKZzahQzleXy56aKxCbzFV/iKz9lKA66Q41IbJ2hPSTdVIsHEd6cTzYJ8JEYy/7q2U4wjGofgCC8+UgaQFSzEt+mjxBUgjWhI7mS7KmujJaMflfVwkPplxU9LKByyyXKEbZ1vps+pnKR+v5N4awO8JSuUY0LKlsJNMWyoIQ/jJTruOIe7ZVYsX/wdcXIY0GUgI8ZiwI="
  const config = {
    headers: { 
      'Authorization': 'Bearer ' + access
    }
  };
  console.log(config)
  axios.get('https://graph.microsoft.com/v1.0//users/ffb16b08fcf4f2eb/drive/root:/orange.txt',config)
  .then((response) => {
    console.log(response.data)


    const file = response.data["@microsoft.graph.downloadUrl"] .toString();
    const filePath = `${__dirname}/files`; 
      
    download(file,filePath) 
    .then(() => { 
        console.log('Download Completed'); 
    })

    setTimeout(function() {

       uploadFile(1, token, "orange.txt");
      }, 2000);

    })


}

// run();

//export all the functions
module.exports = {
    getAccessToken,
    getJwtToken,
    uploadFile,
    createUserCorpus,
    deleteDocument,
    getQueryResponse,
    createErrorResponse,
    createSuccessResponse,
    getUserId,
    run
};
