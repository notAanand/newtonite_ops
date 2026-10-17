import { PrismaClient, Role, WorkType, Priority, Status } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
  const passwordHash = await bcrypt.hash(process.env.SEED_DEMO_PASSWORD ?? 'NewtoniteDemo!2026', 12);
  const teams = await Promise.all([
    prisma.team.upsert({ where:{slug:'operations'}, update:{}, create:{name:'Operations',slug:'operations'} }),
    prisma.team.upsert({ where:{slug:'payments'}, update:{}, create:{name:'Payments',slug:'payments'} }),
    prisma.team.upsert({ where:{slug:'trust-compliance'}, update:{}, create:{name:'Trust & Compliance',slug:'trust-compliance'} }),
  ]);
  const demos = [
    ['Alex Morgan','alex@newtonite.local',Role.LEAD,0],['Priya Shah','priya@newtonite.local',Role.MEMBER,0],['Sam Taylor','sam@newtonite.local',Role.VIEWER,0],
    ['Jordan Lee','jordan@newtonite.local',Role.LEAD,1],['Casey Chen','casey@newtonite.local',Role.MEMBER,1],['Riley Patel','riley@newtonite.local',Role.MEMBER,1],
    ['Morgan Diaz','morgan@newtonite.local',Role.ADMIN,2],['Jamie Kim','jamie@newtonite.local',Role.LEAD,2],['Avery Ross','avery@newtonite.local',Role.MEMBER,2],['Taylor Quinn','taylor@newtonite.local',Role.VIEWER,2],
  ] as const;
  const users = [];
  for (const [name,email,role,index] of demos) {
    const user = await prisma.user.upsert({where:{email},update:{},create:{name,email,passwordHash}}); users.push(user);
    await prisma.membership.upsert({where:{userId_teamId:{userId:user.id,teamId:teams[index].id}},update:{},create:{userId:user.id,teamId:teams[index].id,role}});
    if (email === 'alex@newtonite.local') await prisma.membership.upsert({where:{userId_teamId:{userId:user.id,teamId:teams[1].id}},update:{},create:{userId:user.id,teamId:teams[1].id,role:Role.MEMBER}});
  }
  if (await prisma.workItem.count() === 0) {
    const titles = ['Investigate delayed settlement','Customer unable to update billing','Review suspicious account activity','Resolve webhook delivery failures','Reconcile duplicate charge report','Complete quarterly access review'];
    for (let i=0;i<30;i++) {
      const team = teams[i%teams.length]; const creator = users[i%users.length];
      await prisma.workItem.create({data:{title:`${titles[i%titles.length]} #${i+1}`,description:'Demo operational work item. Review the reported issue, record findings, and coordinate a resolution.',type:([WorkType.INCIDENT,WorkType.CUSTOMER_ISSUE,WorkType.PAYMENT,WorkType.COMPLIANCE,WorkType.TASK] as WorkType[])[i%5],priority:([Priority.LOW,Priority.MEDIUM,Priority.HIGH,Priority.URGENT] as Priority[])[i%4],status:([Status.OPEN,Status.IN_PROGRESS,Status.AWAITING_APPROVAL] as Status[])[i%3],teamId:team.id,createdById:creator.id,assigneeId:i%3===0?null:creator.id,activities:{create:{actorId:creator.id,eventType:'CREATED',details:{title:`${titles[i%titles.length]} #${i+1}`}}}}});
    }
  }
}
main().finally(()=>prisma.$disconnect());
