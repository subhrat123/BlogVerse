
import { Hono } from 'hono'
import { decode, sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { blogCreate,blogUpdate } from '@subhrat/blog-common'
import { getCookie } from 'hono/cookie';

export const blogRouter=new Hono<{
     Bindings: {
    DB_URL: string,
    JWT_SECRET: string,
  },
  Variables:{
    userId:string,
  }
}>();

blogRouter.use('/b1/*',async(c,next)=>{
	
	const header = c.req.header('authorization') || "";
    const user= await verify(header,c.env.JWT_SECRET);

    if(user){
		
		const Id = user.id;
		//@ts-ignore
        c.set("userId",Id);
        await next();
    }
    else{
        c.status(411);
        return c.text("unauthorized");
    }
})

//TODO: pagination
blogRouter.get('/bulk', async(c) => {
const prisma = new PrismaClient({
		datasourceUrl: c.env?.DB_URL	,
	}).$extends(withAccelerate());
	
	const posts = await prisma.post.findMany({
		include: {author: true}
	});

	
	return c.json(posts);
})

blogRouter.post('/b1', async (c) => {
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DB_URL,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	 const success = blogCreate.safeParse(body);
		if (!success) {
			c.status(411);
			return c.json({
				message: "inpute invalid",
			})
		}
	const post = await prisma.post.create({
		data: {
			title: body.title,
			content: body.content,
			authorid: Number(userId),
			publishedDate: new Date()
		}
	});
	return c.json({
		id: post.id
	});
})


blogRouter.put('/b1/:id', async(c) => {
  
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DB_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	 const success = blogUpdate.safeParse(body);
		if (!success) {
			c.status(411);
			return c.json({
				message: "inpute invalid",
			})
		}
	const posts=await prisma.post.update({
		where: {
			id: Number(c.req.param('id')),
			authorid: Number(userId)
		},
		data: {
			title: body.title,
			content: body.content,
			published: body.published
		}
	});

	return c.json(posts);
})

blogRouter.get('/:id', async(c) => {
  const id = await c.req.param('id');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DB_URL	,
	}).$extends(withAccelerate());
	 
	const post = await prisma.post.findUnique({
		where: {
			 id: Number(id)
		},
		include: {author: true}
	});

	return c.json(post);
})