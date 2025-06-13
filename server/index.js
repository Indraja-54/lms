import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./database/dbConnect.js"
import userRoute from "./routes/user.route.js"
import courseRoute from "./routes/course.route.js"
import mediaRoute from "./routes/media.route.js"
import paymentRoute from "./routes/payment.route.js"
import courseProgressRoute from './routes/courseProgress.route.js'
dotenv.config({});
connectDB()

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "https://lms-six-sigma.vercel.app",
    credentials: true
}))

const port = process.env.PORT;

app.get("/", (_, res) => {
    res.status(200).json({
        success: true,
        message: "hello I am coming form backend"
    })}
)

app.use("/api/v1/media", mediaRoute)
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute)
app.use("/api/v1/purchase", paymentRoute)
app.use("/api/v1/progress", courseProgressRoute)




app.listen(port, () => {
    console.log(`server listen at port ${port}`)
})


