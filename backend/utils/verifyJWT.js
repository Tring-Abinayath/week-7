import jwt from 'jsonwebtoken';

export const verifyJWT = async (token) => {
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
        const verification = await jwt.verify(userToken, 'secret')
        console.log("--", verification)
        const data = JSON.parse(verification.data)
        console.log("dataaaa:", data)
        return data.user_id
    } catch (err) {
        console.log(err)
        throw new Error(err.message);
    }
}

