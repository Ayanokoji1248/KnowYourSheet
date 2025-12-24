import { NextFunction, Request, Response } from "express"
import jwt, { Jwt, JwtPayload } from "jsonwebtoken"
declare global {
    namespace Express {
        interface Request {
            user?: { id: string, email: string }
        }
    }
}

const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(404).json({
                message: "Token Not Found"
            })
            return
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

        req.user = {
            id: decoded.id as string,
            email: decoded.email as string,
        };

        next()

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error - No Token Found"
        })
        return
    }
}

export default userMiddleware;