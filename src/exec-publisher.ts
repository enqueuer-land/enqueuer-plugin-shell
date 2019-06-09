import {Publisher, InputPublisherModel, MainInstance, PublisherProtocol} from 'enqueuer';
import util from 'util';
import childProcess from 'child_process';

const execPromisified = util.promisify(childProcess.exec);

export class ExecPublisher extends Publisher {
    private readonly command: string;
    private readonly options: any;

    constructor(publisher: InputPublisherModel) {
        super(publisher);
        this.command = publisher.command || publisher.payload;
        this.options = publisher.options || {};
    }

    public async publish(): Promise<any> {
        try {
            this.executeHookEvent('onCommandExecuted', await execPromisified(this.command, this.options));
        } catch (err) {
            this.executeHookEvent('onCommandExecuted', err);
        }
    }

}

export function entryPoint(mainInstance: MainInstance): void {
    const exec = new PublisherProtocol('exec',
        (publisherModel: InputPublisherModel) => new ExecPublisher(publisherModel),
        {onCommandExecuted: ['stdout', 'stderr', 'cmd', 'signal', 'code', 'killed', 'Error']}) as PublisherProtocol;
    mainInstance.protocolManager.addProtocol(exec);
}
