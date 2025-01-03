import 'dotenv/config';
import * as jwt from 'jsonwebtoken'


export const verifyToken = (tokenString: string): jwt.JwtPayload | string => {
    try {
        
        const payload = jwt.verify(tokenString,process.env.JWT_KEY!)
        return payload

    } catch (error) {
        throw error
    }
}

interface userData{
    id: number;
    email: string;
}

export const generateToken = (data: userData): string => {
    try {

        const token = jwt.sign(data,process.env.JWT_KEY!,{
            expiresIn: '15m'
        })
        
        return token

    } catch (error) {
        throw error
    }
}