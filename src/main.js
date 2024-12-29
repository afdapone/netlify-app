// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

import express from 'express'
import serverless from 'serverless-http'
import router from './routes.js'


const app = express()

app.use('/api/', router)

export const handler = serverless(app)
