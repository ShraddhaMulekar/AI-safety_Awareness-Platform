import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())


app.listen(port, async()=>{
    await connectDB()
    console.log(`Server is running on port http://localhost:${port}`)
})