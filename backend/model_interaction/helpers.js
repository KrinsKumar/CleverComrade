const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// get values from .env file
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const auth_endpoint = process.env.AUTH_URL;
const endpoint = process.env.ENDPOINT;
const id = process.env.USER_ID;

//TODO get the file from the front end
let uploadFile = async function (user_id, auth_token) {
    const data = new FormData();
    data.append('c', id);
    data.append('o', user_id);
    data.append('file', fs.createReadStream(__dirname + '/upload.pdf'));

    const config = {
        headers: {
            'Authorization': `Bearer ${auth_token}`,
            'Content-Type': 'multipart/form-data'
        }
    };
    const result = await axios.post(`https://${endpoint}/v1/upload`, data, config);
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
        "customer-id": customer_id.toString(),
      },
    };

    const result = await axios.post(
      `https://${endpoint}/v1/delete-doc`,
      data,
      config
    );
    return result;
}

let getQueryResponse = async function (query, user_id, auth_token) {
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
    return result;
}

function getJwtToken() {
    const encoded = Buffer.from(`${client_id}:${client_secret}`).toString(
      "base64"
    );

    const config = {
      headers: {
        Authorization: `Basic ${encoded}`,
      },
    };
  
    return new Promise((resolve, reject) => {
      axios
        .post(
          auth_endpoint,
          new URLSearchParams({
            grant_type: "client_credentials",
            client_id: client_id,
          }),
          config
        )
        .then((result) => {
          resolve(result.data.access_token);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
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

//export all the functions
module.exports = {
    getJwtToken,
    uploadFile,
    createUserCorpus,
    deleteDocument,
    getQueryResponse,
    createErrorResponse,
    createSuccessResponse
};