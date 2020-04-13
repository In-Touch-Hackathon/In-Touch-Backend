import './dotenv'

import { Router } from 'express'
import * as express from 'express'
import * as cors from 'cors'
import * as helmet from 'helmet'
import { schedule_data_fetch } from "./data";
import { routes } from './routes'



const app = express()
const router = Router()
const port =  process.env.PORT || 3000

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(routes(router))
schedule_data_fetch().then(()=>{})

app.listen(port, () => console.log(`Server started on port ${port}`))
