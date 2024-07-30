const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool

const poolData = {
UserPoolId : process.env.USER_POOL_ID, // Your user pool id here
ClientId : process.env.CLIENT_ID // Your client id here
}

const userPool = new CognitoUserPool(poolData);

exports.login = async (req, res, next) => { 
    console.log(`login called for ${req.body.user_name}`)
   
    //res.body = smallPaylout
    next()
  }