const { CognitoJwtVerifier } = require('aws-jwt-verify')
const { JwtInvalidClaimError } = require('aws-jwt-verify/error')
const { readFileSync } = require('fs') 
require('dotenv').config()

const { CognitoIdentityProvider } = require('@aws-sdk/client-cognito-identity-provider');
const { ExportViewType } = require('@aws-sdk/client-dynamodb');
//const {CognitoJwtVerifier} = require("@aws-cognito/jwt-verifier")
const poolId = process.env.USER_POOL_ID
const clientId = process.env.CLIENT_ID

exports.login = async (req, res, next) => { 
    console.log(`login called for ${req.body.user_name}`)
    const userName = req.body.user_name
    const password = req.body.password
    const cognito = new CognitoIdentityProvider({
        region: 'us-east-1'
    });

const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: clientId,
    AuthParameters: {
        'USERNAME': userName,
        'PASSWORD': password
    }
};

    try {
        const cognitoResponse = await cognito.initiateAuth(params)
        const tokenResponse = {
            AccessToken: cognitoResponse.AuthenticationResult.AccessToken,
            IdToken: cognitoResponse.AuthenticationResult.IdToken,
            RefreshToken: cognitoResponse.AuthenticationResult.RefreshToken
  }
  res.body = tokenResponse
  console.log(tokenResponse)
    }
    catch (err) {
  
        console.log("no dice: JWT:" + err)
    }
  next()
  }

exports.refresh = async (req, res, next) => {
  const REFRESH_TOKEN = req.header('Authorization') 
 
const verifier = CognitoJwtVerifier.create({
  userPoolId: poolId,         // e.g., us-east-1_AbCdEfGhi
  tokenUse: "access",                            // Can be "id" or "access"
  clientId: clientId,          // Your app client ID
});

const jwks = JSON.parse(readFileSync("./jwks.json", { encoding: "utf-8" }));
verifier.cacheJwks(jwks);
try {
  //console.log("Verifying refresh token..." + REFRESH_TOKEN);
  const payload = await verifier.verifySync(REFRESH_TOKEN);
  console.log("Refresh token is valid. Payload:", payload);
}
catch (err) {
  if (err instanceof JwtInvalidClaimError) {
    console.error("JWT invalid because:", err.message);
    console.error("Raw JWT:", err.rawJwt.payload);
  } else {
    console.log("no dice: JWT:" + err)
  }
  //console.error("Token is invalid:", err.message);
}
next()

}