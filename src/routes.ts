import { Router } from "express";

import { voice } from './controllers/voice'
import { healthcheck } from "./controllers/healthcheck";

const routes = (router: Router): Router => {

    // Twilio Incoming Call
    router.post('/voice', voice);

    // Register - phone number + name only
    router.post('/register')

    // HealthCheck
    router.get('/healthcheck', healthcheck)

    // Verify SMS
    router.post('/verify')



    return router
}

export {routes}