import 'dotenv/config';
import {app,prisma} from './app';
const port=Number(process.env.PORT||4000);
const server=app.listen(port,()=>console.log(`Newtonite Ops API listening on http://localhost:${port}`));
const shutdown=async()=>{server.close();await prisma.$disconnect();process.exit(0);};
process.on('SIGINT',shutdown);process.on('SIGTERM',shutdown);
