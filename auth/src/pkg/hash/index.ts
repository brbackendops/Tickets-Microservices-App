import bcrypt from 'bcrypt'


export const hashPassword = (plainText: string): string => {
    try {
        
        const output = bcrypt.hashSync(plainText,10)
        return output

    } catch (error) {
        throw error
    }
}


export const compareAndverify = (plainText: string , hashedPassword: string): boolean => {
    return bcrypt.compareSync(plainText,hashedPassword)
}