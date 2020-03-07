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
            const publishedResult = await execPromisified(this.command, this.options);
            this.executeHookEvent('onCommandExecuted', publishedResult);
            return publishedResult;
        } catch (err) {
            this.executeHookEvent('onCommandExecuted', err);
        }
    }

}

export function entryPoint(mainInstance: MainInstance): void {
    const exec = new PublisherProtocol('exec',
        (publisherModel: InputPublisherModel) => new ExecPublisher(publisherModel),
        {
            description: 'Enqueuer publisher to execute shell',
            homepage: 'https://github.com/enqueuer-land/enqueuer-plugin-shell',
            libraryHomepage: 'https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback',
            schema: {
                attributes: {
                    command: {
                        type: 'string',
                        required: true
                    },
                    options: {
                        type: 'object',
                        required: false
                    },
                },
                hooks: {
                    onCommandExecuted: {
                        description: 'Gets executed when command is executed',
                        arguments: {
                            stdout: {},
                            stderr: {},
                            cmd: {},
                            signal: {},
                            code: {},
                            killed: {},
                            Error: {},
                        }
                    }
                }

            }
        }) as PublisherProtocol;

    mainInstance.protocolManager.addProtocol(exec);
}
