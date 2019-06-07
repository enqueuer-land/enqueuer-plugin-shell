import * as exec from './exec-publisher';
import * as spawn from './spawn-publisher';
import {MainInstance} from 'enqueuer';

export function entryPoint(mainInstance: MainInstance): void {
    exec.entryPoint(mainInstance);
    spawn.entryPoint(mainInstance);
}
