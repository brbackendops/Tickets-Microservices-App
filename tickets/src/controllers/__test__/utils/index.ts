import * as jwt from 'jsonwebtoken';

export const signIn = (): string[] => {

    const testData = {
        id: 1,
        email: "test@test.com"
    }

    const token = jwt.sign(testData,process.env.JWT_KEY!)

    const session = {
        token,
    }

    const sessionJSON = JSON.stringify(session)

    const base64 = Buffer.from(sessionJSON).toString('base64')

    return [`auth-session=${base64}`]
}