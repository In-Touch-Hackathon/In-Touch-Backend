import { Router } from "express";

import { voice } from './controllers/twilio'
import { healthcheck } from "./controllers/healthcheck";
import twilio from "twilio";

const routes = (router: Router): Router => {

    // Twilio Incoming Call
    router.post('/voice', voice)
    router.post('/menu')

    // Register - phone number + name only
    router.post('/register')

    // HealthCheck
    router.get('/healthcheck', healthcheck)

    // Verify SMS
    router.post('/verify')



    return router
}

export {routes}