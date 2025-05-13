import { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req:Request,res:Response,next:NextFunction) {
    const token = req.headers["authorization"];
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token as string, JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({ message: "Forbidden" });
        }
        //@ts-ignore
        req.userID = decoded.userID;
        next();
    });
}