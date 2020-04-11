import { Router, Request, Response } from 'express';
import * as express from 'express'
import * as cors from 'cors'
import * as helmet from 'helmet'

import { voice } from './controllers/voice'

const app = express()
const router = Router()
const port = 3000

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(router)

router.get('/voice', voice);

app.listen(port, () => console.log(`Server started on port ${port}`))
