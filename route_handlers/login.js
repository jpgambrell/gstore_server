require('dotenv').config()

const { CognitoIdentityProvider } = require('@aws-sdk/client-cognito-identity-provider');
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
        const data = await cognito.initiateAuth(params)
        res.body = data

        console.log(data)
    }
    catch (err) {
        console.log(err)
    }
  next()
  }

exports.refresh = async (req, res, next) => {
  const REFRESH_TOKEN = req.body.RefreshToken
  const cognito = new CognitoIdentityProvider({
      region: 'us-east-1'
  });

const params = {
  AuthFlow: 'REFRESH_TOKEN_AUTH',
  ClientId: clientId,
  AuthParameters: {
      REFRESH_TOKEN
  }
}
console.log('refresh called with tokens: ' + JSON.stringify(params))
try {
  const data = await cognito.initiateAuth(params)
  res.body = data
  console.log(data)
}
catch (err) {
  console.log(err)
}
next()

}