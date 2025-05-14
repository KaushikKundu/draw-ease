import zod, { optional } from 'zod';

export const CreateUserSchema = zod.object({
    name: zod.string(),
    username:zod.string().min(3).max(20),
    password: zod.string()
})

export const SignInSchema = zod.object({
    username: zod.string().min(3).max(20),
    password: zod.string()
})
export const RoomSchema = zod.object({
    name: zod.string().min(1).max(20)
})