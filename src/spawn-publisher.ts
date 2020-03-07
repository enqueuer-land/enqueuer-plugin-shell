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

    public async publish(): Promise<any> {
        try {
            const publishedResult = await spawn(this.command, this.args, this.options);
            this.publishedResult('onChildSpawned', publishedResult);
            return publishedResult;
        } catch (err) {
            this.executeHookEvent('onChildSpawned', err);
        }
    }

}

export function entryPoint(mainInstance: MainInstance): void {
    const exec = new PublisherProtocol('spawn',
        (publisherModel: InputPublisherModel) => new SpawnPublisher(publisherModel),
        {
            description: 'Enqueuer publisher to spawn child process',
            homepage: 'https://github.com/enqueuer-land/enqueuer-plugin-shell',
            libraryHomepage: 'https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options',
            schema: {
                attributes: {
                    command: {
                        type: 'string',
                        required: true
                    },
                    args: {
                        // TODO fix it as soon as enqueuer allow list as type
                        // type: 'list',
                        type: 'string',
                        defaultValue: [],
                        required: false
                    },
                    options: {
                        type: 'object',
                        required: false
                    },
                },
                hooks: {
                    onChildSpawned: {
                        description: 'Gets executed when child is spawned',
                        arguments: {
                            connected: {},
                            signalCode: {},
                            exitCode: {},
                            killed: {},
                            spawnfile: {},
                            spawnargs: {},
                            pid: {}
                        }
                    }
                }

            }
        }) as PublisherProtocol;
    mainInstance.protocolManager.addProtocol(exec);
}
