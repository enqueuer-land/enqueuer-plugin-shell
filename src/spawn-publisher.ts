import {InputPublisherModel, MainInstance, Publisher, PublisherProtocol} from 'enqueuer';
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
            this.executeHookEvent('onChildSpawned', await spawn(this.command, this.args, this.options));
        } catch (err) {
            this.executeHookEvent('onChildSpawned', err);
        }
    }

}

export function entryPoint(mainInstance: MainInstance): void {
    const exec = new PublisherProtocol('spawn',
        (publisherModel: InputPublisherModel) => new SpawnPublisher(publisherModel),
        {
            onChildSpawned: [
                'connected',
                'signalCode',
                'exitCode',
                'killed',
                'spawnfile',
                'spawnargs',
                'pid']
        }) as PublisherProtocol;
    mainInstance.protocolManager.addProtocol(exec);
}
