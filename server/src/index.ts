import dotenv from "dotenv";
dotenv.config()
import express from "express"
import authRouter from "./routes/auth.routes";
import dbConnection from "./config/dbConnect";
import fileRouter from "./routes/file.routes";
import cookieParser from "cookie-parser";
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/auth", authRouter);
app.use("/api/file", fileRouter)

async function main() {
    await dbConnection();
    app.listen(3000, () => {
        console.log("Server listening on port 3000")
    })
}

main()