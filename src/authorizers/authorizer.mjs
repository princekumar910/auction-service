
import jwt from 'jsonwebtoken'
import { JwksClient } from 'jwks-rsa';

const client = new JwksClient({
    jwksUri : 'https://dev-om7e3m8wvu4na7zj.us.auth0.com/.well-known/jwks.json',
    cache :true , 
    rateLimit : true,
    jwksRequestsPerMinute:5
  })

async function getSignInKey(kid){
   return new Promise ( (resolve , reject)=>{
    client.getSigningKey(kid , (err, key)=>{
        if(err){
            return reject(err)
        }
        const singInKey = key.publicKey || key.rsaPublicKey
        resolve(singInKey)
    })
   })
}

export async function handler(event, context) {
    const token = event.authorizationToken ;

    if (!token) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Auth Token is required",
            }),
        };
    }
   

    const decodeToken = jwt.decode(token.split(" ")[1], { complete: true })
    if (!decodeToken) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Invalid Token",
            }),
        };
    }

    const kid = decodeToken.header.kid

    const singInKey = await getSignInKey(kid)
     

    const claims = jwt.verify(token.split(" ")[1] , singInKey)
    // console.log("claims-->" , claims)
   if(!claims){
    return {
        statusCode: 400,
        body: JSON.stringify({
            message: "verification fail",
        }),
    };
   }

   return {
    principalId : claims.nickname || "user",
    policyDocument: {
        Version: "2012-10-17",
        Statement: [
            {
                Action: "execute-api:Invoke",
                Effect: "Allow", 
                Resource: event.methodArn
            }
        ]
    },
    context: {
        claims :  JSON.stringify(claims)
       
    }
};
}