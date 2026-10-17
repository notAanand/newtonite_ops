import {spawn} from 'node:child_process';
import {platform} from 'node:os';
const npm=platform()==='win32'?'npm.cmd':'npm';
const children=[spawn(npm,['run','dev:api'],{stdio:'inherit',shell:platform()==='win32'}),spawn(npm,['run','dev:web'],{stdio:'inherit',shell:platform()==='win32'})];
for(const child of children)child.on('exit',code=>{for(const other of children)if(other!==child)other.kill();process.exit(code??1);});
process.on('SIGINT',()=>{for(const child of children)child.kill();process.exit(0);});
