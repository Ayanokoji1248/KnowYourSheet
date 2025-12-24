import { Router } from "express"
const fileRouter = Router();
import multer from "multer"
import userMiddleware from "../middlewares/user.middleware.";
import { getUserFile, uploadFile } from "../controllers/file.controller";

const storage = multer.memoryStorage();
const upload = multer({ storage })

fileRouter.post("/upload", userMiddleware, upload.single("file"), uploadFile)

fileRouter.get('/userFile', userMiddleware, getUserFile)


export default fileRouter;