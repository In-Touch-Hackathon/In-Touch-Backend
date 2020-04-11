import { Request, Response } from 'express'

export const healthcheck = (req: Request, res: Response) => {
    res.status(200).send({
        success: true,
        message: 'HealthCheck intouch-backend OK',
    });
}
