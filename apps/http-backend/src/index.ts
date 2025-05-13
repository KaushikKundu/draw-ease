import express, { Request, Response } from "express";
import { JWT_SECRET } from '@repo/backend-common/config';
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { CreateUserSchema,SignInSchema } from "@repo/common/types";
import bcrypt from "bcrypt";
import {prismaClient} from "@repo/db/client";
import e from "express";

const app = express();

app.use(express.json());

app.post("/signup", async (req: Request, res: Response) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: "Incorrect inputs" });
        return;
    }
    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
    try {
        await prismaClient.user.create({
            data:{
                email:parsedData.data.username,
                password:hashedPassword, 
                name:parsedData.data?.name,
            }
        });
        res.json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({  error });
    }
});

app.post("/signin", async(req: Request, res: Response) => {
    const parsedData = SignInSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({ message: "Incorrect inputs" });
        return;
    }
    const { username,password } = parsedData.data;
    const existingUser = await prismaClient.user.findUnique({
        where: {
            email: username,
        },
        select: {
            password: true,
        }
    });
    if(!existingUser) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    } 
    const hashedPassword = existingUser.password;

    const isPasswordValid = bcrypt.compareSync(password, hashedPassword);
    if(!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    
    try {
        const token = jwt.sign({ username }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error});
    }
});

app.post("/room", middleware, (req: Request, res: Response) => {
    
    res.status(200).json({ message: "Room created successfully" });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
