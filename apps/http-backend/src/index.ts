import express, { Request, Response } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { CreateUserSchema } from "@repo/common/types";

const app = express();

app.use(express.json());

app.post("/signup", (req: Request, res: Response) => {
    const data = CreateUserSchema.safeParse(req.body);
    if (!data.success) {
        res.status(400).json({ message: "Incorrect inputs" });
    }
    // Add logic to handle successful signup
    res.status(200).json({ message: "Signup successful" });
});

app.post("/signin", (req: Request, res: Response) => {
    try {
        const userID = 1;
        const token = jwt.sign({ userID }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Error signing token" });
    }
});

app.post("/room", middleware, (req: Request, res: Response) => {
    // Add logic to handle the room creation
    res.status(200).json({ message: "Room created successfully" });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
