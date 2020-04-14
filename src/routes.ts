import { Router } from "express";
import { webhook } from 'twilio'

import { welcome, menu } from './controllers/twilio'
import { healthcheck } from './controllers/healthcheck';
import { register, self, verify } from './controllers/api'

import { validate, auth } from "./middleware";
import { postRegister } from "./models";

const routes = (router: Router): Router => {

    // Twilio Incoming Call
    router.post('/ivr/welcome',webhook({validate: false}), welcome)
    router.post('/ivr/menu',webhook({validate: false}), menu)

    // HealthCheck
    router.get('/healthcheck', healthcheck)

    // Verify SMS
    router.post('/verify', auth, verify)

    // Register - phone number + name only
    router.post('/register',auth, postRegister, validate, register)
    // GetSelf - getself

    //router.get('/self', auth, self)

    return router
}

export { routes }