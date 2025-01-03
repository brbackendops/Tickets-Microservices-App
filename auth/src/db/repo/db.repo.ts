import { drizzle } from "drizzle-orm/node-postgres";
import { userPayload } from '../dto/user.dto'
import { usersTable } from "../schema/user";
import { eq } from "drizzle-orm";

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
            await this.DB.insert(usersTable).values(payload)
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
            const user = await this.DB.select().from(usersTable).where(eq(usersTable.email,email))
            return user.length > 0 ? user[0]: null
        } catch (error) {
            throw error
        }
    }

}