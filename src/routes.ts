import { Router } from "express";

import { voice } from './controllers/twilio'
import { healthcheck } from './controllers/healthcheck';
import { verify } from './controllers/verify';
import { auth } from './middleware/auth';

const routes = (router: Router): Router => {

    // Twilio Incoming Call
    router.post('/voice', voice)
    router.post('/menu')

    // HealthCheck
    router.get('/healthcheck', healthcheck)

    // Verify SMS
    router.post('/verify', auth, verify)



    return router
}

export { routes }