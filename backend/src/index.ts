import express from 'express'
import ENV from './config/env'
import { clerkMiddleware } from '@clerk/express'


const app = express()

app.use(clerkMiddleware())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.get("/", (req,res)=>{
    res.json({success:true})
})

app.listen(ENV.PORT, ()=>{console.log("server is running file on PORT: 3000")})