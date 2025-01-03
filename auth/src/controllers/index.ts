import { Request , Response , NextFunction } from 'express';
import db from '../db/index'
import AuthRepo from '../db/repo/db.repo';
import { compareAndverify, hashPassword } from '../pkg/hash'
import { generateToken } from '../pkg/jwt';
import { SpanStatusCode, trace } from '@opentelemetry/api';
import logger from '../logger';



export const signInHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const tracer = trace.getTracer('auth-srv')
    const span = tracer.startSpan('signInHandler', {
        attributes: {
            'handler.name': 'signInHandler',
            'handler.type': 'auth'
        }
    })
    
    try {
        span.setAttribute('auth.operation', 'creating AuthRepo instance')
        logger.info('Creating AuthRepo instance')
        const repo = new AuthRepo(db)
        logger.info('created AuthRepo instance')
        
        span.setAttribute('auth.operation', 'processing request')
        const payload = req.body
        logger.info('Received sign-in request', { email: payload.email })
        
        span.setAttribute('auth.operation', 'checking user exists or not')
        const user = await repo.findOne(payload.email)
        if (!user) {
            span.setAttribute('auth.error', 'user not found')
            logger.warn('Sign-in failed: user not found', { user: null })
            res.status(404).json({
                status: 'error',
                message: 'User not found',
            })
            return
        }
        
        span.setAttribute('auth.operation', 'verifying password')
        const is_match = compareAndverify(payload.password, user.password)
        if (!is_match) {
            logger.warn("Sign-in failed: Incorrect password", { matched: is_match })
            res.status(401).json({
                status: 'error',
                message: 'Incorrect password',
            })
            return
        }
        
        const data = {
            id: user.id,
            email: user.email
        }
        
        span.setAttribute('auth.operation', 'generating token')
        const token = generateToken(data)
        logger.info("JWT generated: token created", { jwt_created: true })
        
        req.session = {
            token: token,
        }
        
        span.setStatus({ code: SpanStatusCode.OK })
        span.setAttribute('auth.success', true)
        logger.info("user logged in successfully", { email: user.email })
        
        res.status(200).json({
            status: 'success',
            message: 'User logged in successfully',
        })
        return;

    } catch (error: any) {
        logger.error(`Error From SignInHandler ${error?.message}`)
        span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message
        })
        span.setAttribute('error', true)
        span.setAttribute('error.message', error.message)
        
        // Only call next(error) if response hasn't been sent
        if (!res.headersSent) {
            next(error)
        }
    } finally {
        span.end()
    }
}

export const signUpHandler = async (req: Request,res: Response, next: NextFunction) => {
    try {

        // span.addEvent('creating AuthRepo instance')
        logger.info('Creating AuthRepo instance')
        const repo = new AuthRepo(db)
        // span.addEvent('created AuthRepo instance')
        logger.info('created AuthRepo instance')

        const payload = req.body;
        const user = await repo.findOne(payload.email)

        if (user) {
            res.status(409).json({
                status: "error",
                message: "user with this email already exists"
            })
            return;
        };

        payload.password = hashPassword(payload.password)
        await repo.create(payload)

        res.status(201).json({
            status: "success",
            messgae: "user created successfully"
        })

    } catch (error: any) {
        logger.error(`Error From signUpHandler  ${error?.message}`)
        next(error)
    }
}


export const signOutHandler = async (req: Request,res: Response, next: NextFunction) => {
    try {

        logger.info("Accessing session from current request")
        req.session = null
        logger.info("Session Accessed and deleted")

        logger.info("user logged out successfully")
        res.status(200).json({
            status: "success",
            message: "user logged out successfully"
        })

    } catch (error) {
        next(error)
    }
}


export const currentUserHandler = async (req: Request,res: Response, next: NextFunction) => {
    try {

        logger.info("current user data processing")
        const data = {
            id: req?.user?.id,
            email: req?.user?.email
        }

        logger.info("current user successfully send")
        res.status(200).json({
            status: "success",
            data: data
        })

    } catch (error) {
        next(error)
    }
}


