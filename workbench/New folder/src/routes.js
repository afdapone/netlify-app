import { Router } from 'express'
import { scrape } from './controller.js'


const router = Router()


router.get('/', (req, res) => {
    res.send("Somehow Somewhere!")
})


router.get('/soccer', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(await scrape()))
})


export default router


