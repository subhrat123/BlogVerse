import z, { number } from "zod";

export const signUpInput = z.object({
    name :z.string(),
    username:z.string(),
    email:z.string().email(),
    password:z.string().min(6)
})

export const signinInput = z.object({
    username:z.string(),
    password:z.string().min(6)
})
export const blogCreate = z.object({
    title:z.string(),
    content:z.string(),
    authorId:z.string(),
    published:z.boolean().default(false),
    publishedDate:z.string().optional()
})
export const blogUpdate = z.object({
    id:z.number(),
    title:z.string().optional(),
    content:z.string().optional(),
    authorId:z.string().optional(),
    published:z.boolean().optional(),
})
export const blogs=z.array( z.object({
    id:z.number(),
    title:z.string().optional(),
    content:z.string().optional(),
    authorId:z.string().optional(),
    published:z.boolean().optional(),
    author: z.object({
        id: number(),
        name: z.string(),
        username: z.string(),
        email: z.email(),
    }).optional(),
    publishedDate: z.string().optional()
})
)
export const blog=z.object({
    id:z.number(),
    title:z.string().optional(),
    content:z.string().optional(),
    authorId:z.string().optional(),
    published:z.boolean().optional(),
    author: z.object({
        id: number(),
        name: z.string(),
        username: z.string(),
        email: z.email(),
    }).optional(),
    publishedDate: z.string().optional()
})

export type SignInInput=z.infer<typeof signinInput>
export type SignUpInput=z.infer<typeof signUpInput>
export type BlogCreate=z.infer<typeof blogCreate>
export type BlogUpdate=z.infer<typeof blogUpdate>
export type Blogs=z.infer<typeof blogs>
export type Blog=z.infer<typeof blog>

