import * as exec from './exec-publisher';
import {MainInstance} from 'enqueuer';

export function entryPoint(mainInstance: MainInstance): void {
    exec.entryPoint(mainInstance);
}
