import express, { Request, Response } from "express";
import { JWT_SECRET } from '@repo/backend-common/config';
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { CreateUserSchema,SignInSchema,RoomSchema } from "@repo/common/types";
import bcrypt from "bcrypt";
import {prismaClient} from "@repo/db/client";

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
    const existingUser = await prismaClient.user.findFirst({
        where: {
            email: username
        }
    });
    
    if(!existingUser) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }

    const existingPassword = existingUser.password;

    const isPasswordValid = await bcrypt.compare(password, existingPassword);
    if(!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials pass" });
        return;
    }
    
    try {
        const token = jwt.sign({ userId:existingUser?.id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error});
    }
});

app.post("/room", middleware,async (req: Request, res: Response) => {
    const parsedData = RoomSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({ message: "Incorrect inputs" });
        return;
    }
    const userId = req.userId;
    // console.log(req.user);
    
    try{
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        })
        res.status(200).json({ message: "Room created successfully", room });

    }catch (error) {
        res.status(500).json({ error });
    }
    
});

app.get("/chats/:roomId", async(req:Request,res:Response) => {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where: {
            roomId:roomId
        },
        orderBy:{
            id:"desc"
        },
        take:50
        
    })
    res.status(200).json({messages});

})
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
