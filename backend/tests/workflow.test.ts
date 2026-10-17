import {describe,expect,it} from 'vitest';
import {canTransition} from '../src/workflow';
describe('workflow policy',()=>{
  it('allows the standard progression',()=>{expect(canTransition('OPEN','IN_PROGRESS','MEMBER')).toBe(true);expect(canTransition('IN_PROGRESS','AWAITING_APPROVAL','MEMBER')).toBe(true);expect(canTransition('AWAITING_APPROVAL','RESOLVED','LEAD')).toBe(true);expect(canTransition('RESOLVED','CLOSED','MEMBER')).toBe(true);});
  it('requires Lead approval and rejects invalid transitions',()=>{expect(canTransition('AWAITING_APPROVAL','RESOLVED','MEMBER')).toBe(false);expect(canTransition('OPEN','RESOLVED','LEAD')).toBe(false);expect(canTransition('CLOSED','OPEN','ADMIN')).toBe(false);});
  it('supports reopening a resolved item',()=>{expect(canTransition('RESOLVED','IN_PROGRESS','MEMBER')).toBe(true);});
});
