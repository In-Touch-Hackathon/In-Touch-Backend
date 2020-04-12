import { Request, Response } from 'express'

export const verify = (req: Request, res: Response) => {
    const { apiToken } = req.params
}