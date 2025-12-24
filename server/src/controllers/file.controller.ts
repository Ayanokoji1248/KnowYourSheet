import { Request, Response } from "express";
import File from "../models/file.model";

export const uploadFile = async (req: Request, res: Response) => {
    try {

        const file = req.file
        const userId = req.user?.id;

        const fileData = new File({
            fileName: file?.originalname,
            fileSize: file?.size,
            user: userId
        })
        await fileData.save()

        res.status(200).json({
            message: "File Uploaded Successfully",
            file: fileData
        })
        return

    } catch (error) {
        console.error(error);
        res.json({
            message: "Internal Server Error"
        })
        return
    }
}

export const getUserFile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        const userFile = await File.find({ user: userId });

        res.status(200).json({
            message: "User Files",
            file: userFile
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
        return
    }
}