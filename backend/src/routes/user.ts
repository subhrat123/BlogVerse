import { Hono } from 'hono'
import { decode, jwt, sign, verify } from 'hono/jwt'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { signinInput, signUpInput } from '@subhrat/blog-common';
import bcrypt from 'bcryptjs';


export const userRouter = new Hono<{
    Bindings: {
        DB_URL: string;
        JWT_SECRET: string
    }
}>();

userRouter.use('/me/*', async (c, next) => {

    const token = c.req.header('authorization') || "";
    if (!token) return c.json({ message: 'Not authenticated' }, 401);

    try {
        const decoded = await verify(token, c.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);
        
        c.set('jwtPayload', decoded);
        await next();

    } catch (err) {
        return c.json({ message: 'Invalid token' }, 403);
    }
});

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DB_URL,
    }).$extends(withAccelerate())
    console.log("DATABASE_URL at runtime:", c.env.DB_URL)
    const body = await c.req.json();
    const success = signUpInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "inpute invalid",
        })
    }
    // console.log(name,username,email,password);
    try {
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const user = await prisma.user.create({
            data: {
                name: body.name,
                username: body.username,
                email: body.email,
                password: hashedPassword,
            }
        })
        const users = await prisma.user.findMany();
        console.log(users);
        const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
        

        return c.json({ message: "user created successfully", token: jwt });

    } catch (e) {
        c.status(401);
        console.log(e);
        const r = await c.req.json();
        return c.json({ "error": e, "body": r });
    }
});

userRouter.post('/signin', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DB_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);

    if (!success) {
        c.status(411);
        return c.json({
            message: "inpute invalid",
        })
    }
    try {

        const user = await prisma.user.findUnique({
            where: {
                username: body.username
            }
        })

        if (!user) {
            return c.text("user does not exist");
        }

        const isPasswordValid = await bcrypt.compare(body.password, user.password);
        if (!isPasswordValid) {
            return c.text("invalid password");
        }

        const jwt = await sign({ id: user.id, username: user.username }, c.env.JWT_SECRET);
        console.log("Generated JWT:", jwt);

        return c.json({ message: "successfully signed in", token: jwt, user: user });

    } catch (e) {
        console.log("happy birthday")
        c.status(411);
        return c.json({
            error: e
        })
    }
})

userRouter.get('/me', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DB_URL,
    }).$extends(withAccelerate());

    try {
        const payload = c.get('jwtPayload');
        if (!payload || !payload.id) {
            c.status(401);
            return c.json({ message: "Unauthorized" });
        }
        const user = await prisma.user.findUnique({
            where: {
                id: payload.id,
                username: payload.username
            }
        });

        return c.json(user);
    } catch (e) {
        c.status(401);
        return c.json({ message: "Unauthorized" });
    }
});

userRouter.get('/me/blogs', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DB_URL,
    }).$extends(withAccelerate());

    const userId = c.get('jwtPayload').id;
    // console.log("User ID from JWT payload:", userId);
    if (!userId) {
        c.status(401);
        return c.json({ message: "Unauthorized" });
    }

    // const token = c.req.header('Authorization')?.split(' ')[1];
    // if (!token) {
    //     c.status(401);
    //     return c.json({ message: "Unauthorized" });
    // }

    try {
        const blogs = await prisma.post.findMany({
            where: {
                authorid: Number(userId),
            }
        });
        return c.json(blogs);
    } catch (e) {
        c.status(500);
        return c.json({ error: e });
    }

});
