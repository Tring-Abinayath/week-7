import jwt from 'jsonwebtoken';

export const verifyJWT = async (token) => {
    const jwt_key=process.env.JWT_KEY
    let userToken;
    try {
        
        if (!token) {
            console.log("Console1")
            throw new Error('Unauthorized')
        }

        if (token.includes('Bearer')) {
            userToken = token.split(" ")[1];
        } else {
            userToken = token;
        }
        console.log("UserTOken:",userToken)

        const verification = await jwt.verify(userToken, jwt_key)
        console.log("Verification:",verification)
        // const data = JSON.parse(verification.data)
        // return data.user_id
        return verification.user_id
    } catch (err) {
        throw new Error(err.message);
    }
}

