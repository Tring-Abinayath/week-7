import jwt from 'jsonwebtoken';


console.log("env:",process.env.JWT_KEY)
export const verifyJWT = async (token) => {
    const jwt_key=process.env.JWT_KEY
    let userToken;
    try {
        if (!token) {
            throw new Error('Unauthorized')
        }
        console.log("Original token:", token)
        if (token.includes('Bearer')) {
            userToken = token.split(" ")[1];
        } else {
            userToken = token;
        }

        console.log("userToken:", userToken)
        const verification = await jwt.verify(userToken, jwt_key)
        console.log("--", verification)
        const data = JSON.parse(verification.data)
        console.log("dataaaa:", data)
        return data.user_id
    } catch (err) {
        console.log("expired:-------",err.message)
        throw new Error(err.message);
    }
}

