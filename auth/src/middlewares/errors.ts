import { AuthError , ExistsError } from "@ticketsdev10/common";
import type { NextFunction , Response , Request , RequestHandler  } from "express";
import { ZodError } from "zod";

export const errorHandler =  (err: Error, req: Request, res: Response, next: NextFunction): void => {

    if (err instanceof ZodError) {
        res.status(400).json({
            status: "error",
            error: err.errors
        });
        return;
    }

    if (err instanceof ExistsError ) {
        console.log(err)
        res.status(409).json(err.serializeError());
        return;
    }

    if ( err instanceof AuthError ) {
        res.status(err.statusCode).json(err.serializeErrors());
        return;
    }

    res.status(500).json({
        status: "error",
        error: err.message || "Internal Server Error"
    })
    
}