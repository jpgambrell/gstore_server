require('dotenv').config()
const { CognitoIdentityProvider } = require('@aws-sdk/client-cognito-identity-provider');
exports.signup = async (req, res, next) => { 
    console.log(`login called for ${req.body.user_name}`)


    const userName = req.body.user_name
    const password = req.body.password

    const poolId = process.env.USER_POOL_ID
    const clientId = process.env.CLIENT_ID

const cognito = new CognitoIdentityProvider({
    region: 'us-east-1'
});

const params = {
    ClientId: clientId,
    Username: userName,
    Password: password,

    UserAttributes: [
        {
        Name: 'email',
        Value: userName
    }
]
};

    try {
        const data = await cognito.signUp(params)
        console.log(data)
        res.body = data
    }
    catch (err) {
        console.log(err)
    }
  //res.body = cognitoUser
  next()


   
  }