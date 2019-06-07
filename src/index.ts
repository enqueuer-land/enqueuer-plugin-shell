import * as publisher from './shell-publisher';
import {MainInstance} from 'enqueuer';

export function entryPoint(mainInstance: MainInstance): void {
    publisher.entryPoint(mainInstance);
}
