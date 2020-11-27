const fetch         = require('node-fetch');
const Headers       = require('node-fetch').Headers;

const POOL_BASE_URL = process.env.POOL_BASE_URL;

const userProfile = async function(accessToken, done) {
  var headers = new Headers();
  headers.append("Authorization", `Bearer ${accessToken}`);

  var requestOptions = {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
  };

  console.log('Requesting profile');
  const profile = await fetch(`${POOL_BASE_URL}/oauth2/userInfo`, requestOptions)
    .then(response => response.text())
    .then(result => done(null, result))
    .catch(error => console.log('error', error));
    return profile;
}

module.exports = {
  userProfile
}