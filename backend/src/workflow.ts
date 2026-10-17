export type ItemStatus='OPEN'|'IN_PROGRESS'|'AWAITING_APPROVAL'|'RESOLVED'|'CLOSED';
export const transitions:Record<ItemStatus,ItemStatus[]>={OPEN:['IN_PROGRESS'],IN_PROGRESS:['OPEN','AWAITING_APPROVAL'],AWAITING_APPROVAL:['IN_PROGRESS','RESOLVED'],RESOLVED:['CLOSED','IN_PROGRESS'],CLOSED:[]};
export function canTransition(from:ItemStatus,to:ItemStatus,role:'VIEWER'|'MEMBER'|'LEAD'|'ADMIN'){return transitions[from].includes(to)&&!(from==='AWAITING_APPROVAL'&&to==='RESOLVED'&&role!=='LEAD');}
