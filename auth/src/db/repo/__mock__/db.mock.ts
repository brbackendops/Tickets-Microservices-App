import { drizzle } from "drizzle-orm/node-postgres";


interface User {
    id: number;
    email:string;
    password:string;
    createdAt: Date|null;
}

export default class AuthRepo {

    private DB: ReturnType<typeof drizzle>;
    /**
     * @param db - drizzle orm instance
    */

    constructor(db: ReturnType<typeof drizzle>){
        if (!db)  {
            throw new Error("Drizzle database instance is required.");
        }
        this.DB = db;
    }


    async create(payload: userPayload): Promise<void> {
        try {
            
        } catch (error) {
            throw error
        }
    }


    async findOne(email: string): Promise<User|null> {
        /**
         * @param userId @type number
         * @returns a promise that returns a user that matches userid
        */
        try {
            const data: User = {
                id: 1,
                email: "test@test.com",
                password: "test",
                createdAt: new Date()
            }
            return data
        } catch (error) {
            throw error
        }
    }

}