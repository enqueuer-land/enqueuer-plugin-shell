import {Publisher, InputPublisherModel, MainInstance, PublisherProtocol} from 'enqueuer';
import util from 'util';
import {spawn} from 'child_process';

export class SpawnPublisher extends Publisher {
    private readonly command: string;
    private readonly args: string[];
    private readonly options: any;

    constructor(publisher: InputPublisherModel) {
        super(publisher);
        this.command = publisher.command || publisher.payload;
        this.args = publisher.args || [];
        this.options = publisher.options || {};
    }

    public async publish(): Promise<void> {
        try {
            this.messageReceived = await spawn(this.command, this.args, this.options);
        } catch (err) {
            this.messageReceived = err;
        }
    }

}

export function entryPoint(mainInstance: MainInstance): void {
    const exec = new PublisherProtocol('spawn',
        (publisherModel: InputPublisherModel) => new SpawnPublisher(publisherModel),
        [
            'connected',
            'signalCode',
            'exitCode',
            'killed',
            'spawnfile',
            'spawnargs',
            'pid']) as PublisherProtocol;
    mainInstance.protocolManager.addProtocol(exec);
}
