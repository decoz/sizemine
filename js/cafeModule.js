const request = require('request')
  
// var payload = grant_type=authorization_code&code={code}&redirect_uri={redirect_uri};
// var options = { 
//     method: 'POST',
//     url: 'https://parkisoo.cafe24api.com/api/v2/oauth/token',
//     headers: {
//         'Authorization': "Basic {base64_encode(TCYH6aIoJtAgdorhgmwCsB:n9JSjKBHKBwnINqEcoNAaC)}",
//         'Content-Type': "application/x-www-form-urlencoded"
//     },
//     body: payload,
//     json: true
// };
// request(options, function (error, response, body) {
//     if (error) throw new Error(error);
    
//     console.log(body);
// });