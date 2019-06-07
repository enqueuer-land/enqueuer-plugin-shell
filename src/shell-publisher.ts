import {Publisher, InputPublisherModel, MainInstance, PublisherProtocol} from 'enqueuer';
import util from 'util';
import childProcess from 'child_process';

const execPromisified = util.promisify(childProcess.exec);

export class ShellPublisher extends Publisher {
    private readonly command: string;
    private readonly options: any;

    constructor(publisher: InputPublisherModel) {
        super(publisher);
        this.command = publisher.command || publisher.payload;
        this.options = publisher.options || {};
    }

    public async publish(): Promise<void> {
        try {
            this.messageReceived = await execPromisified(this.command, this.options);
        } catch (err) {
            this.messageReceived = err;
        }
    }

}

export function entryPoint(mainInstance: MainInstance): void {
    const shell = new PublisherProtocol('shell',
        (publisherModel: InputPublisherModel) => new ShellPublisher(publisherModel),
        ['stdout', 'stderr', 'cmd', 'signal', 'code', 'killed', 'Error'])
        .addAlternativeName('bash') as PublisherProtocol;
    mainInstance.protocolManager.addProtocol(shell);
}
