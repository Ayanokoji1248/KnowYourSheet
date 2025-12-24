import dotenv from "dotenv";
dotenv.config()
import express from "express"
import authRouter from "./routes/auth.routes";
import dbConnection from "./config/dbConnect";
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRouter);

async function main() {
    await dbConnection();
    app.listen(3000, () => {
        console.log("Server listening on port 3000")
    })
}

main()