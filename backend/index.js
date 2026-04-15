import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import { authRouter } from "./routes/authRoutes.js"
import { scamRoutes } from "./routes/scamRoutes.js"
import { billRouter } from "./routes/billRoutes.js"
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use("/bill", billRouter)
app.use(express.json())

app.use("/auth", authRouter)
app.use("/scam", scamRoutes)

app.listen(port, async()=>{
    await connectDB()
    console.log(`Server is running on port http://localhost:${port}`)
})