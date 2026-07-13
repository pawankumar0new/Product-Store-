import express from 'express'
import ENV from './config/env'
import { clerkMiddleware } from '@clerk/express'
import cors from 'cors'


const app = express()

app.use(cors({origin: ENV.FRONTEND_URL}))
app.use(clerkMiddleware())
app.use(express.json())
app.use(express.urlencoded({extended:true})) // For parsing the form data (like html)
app.get("/", (req,res)=>{
    res.json({
        message:"Welcome to product store",
        endpoints:{
            user:"api/users",
            product:"api/product",
            comment:"api/comment"
        }

    })
})

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});