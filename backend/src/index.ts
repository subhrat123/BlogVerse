import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { sign,verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {userRouter} from './routes/user'
import {blogRouter} from './routes/blog'



const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
    FRONTEND_URL: string,
  }
  
}>()

// app.use('/message/*', async (c, next) => {
//   const header= c.req.header('authorization') || "";
//   const token=header.split(" ")[1];

//   const response=await verify(token,c.env.JWT_SECRET);
//   if(response.id){
//     await next();
//   }
//   else{
//     c.status(403); 
//     return c.text("unauthorized",402);
//   }
 
// })

//allow all the origins;
app.use(cors({ origin: '*' }))
app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);


export default app
