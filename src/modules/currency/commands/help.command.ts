import {ISlackWebhookRequestBody} from '../../../interfaces/i-slack-webhook-request-body';
import {BaseCommand} from '../../core/base-command.class';
import {baseModuleCommands} from '../../core/help-command.factories';


class HelpCommand extends BaseCommand {

    execute() {
        return Promise.resolve(<ISlackWebhookRequestBody>{
            response_type: 'in_channel',
            text: '',
            attachments: [
                ...baseModuleCommands('min-fin')
            ]
        });
    }
}

const currencyHelpCommand = new HelpCommand();

export default currencyHelpCommand;