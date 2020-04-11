import { Router, Request, Response } from 'express'
import * as express from 'express'
import * as cors from 'cors'
import * as helmet from 'helmet'
import {config} from 'dotenv'
import { routes } from './routes'


// load .env
config()

const app = express()
const router = Router()
const port =  process.env.PORT || 3000

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(routes(router))


app.listen(port, () => console.log(`Server started on port ${port}`))
