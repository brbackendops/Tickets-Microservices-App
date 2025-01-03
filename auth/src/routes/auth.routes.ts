import express from 'express';
import { schemeValidator } from '@ticketsdev10/common';
import { authGuard } from '@ticketsdev10/common';
import { userSchema } from '../db/dto/user.dto';

const router = express.Router()

import { signUpHandler , signInHandler , signOutHandler , currentUserHandler } from '../controllers';

router.route('/').get(async (req,res) => {

    const paths = {
        "metrics": '/api/users/metrics',
        "health": "/api/users/health",
        "signin": "/api/users/v1/signin",
        "signout": "/api/users/v1/signout",
        "current-user": "/api/users/v1/current-user"
    }

    res.status(200).json(paths)

});

router.route('/health').get(async (req, res) => {
    res.send("OK")
});

router.route('/v1/signup').post(schemeValidator(userSchema),signUpHandler)
router.route('/v1/signin').post(schemeValidator(userSchema),signInHandler)
router.route('/v1/signout').post(signOutHandler)
router.route('/v1/current-user').get(authGuard,currentUserHandler)


export default router