import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {BaseCommand} from '../../core/BaseCommand.class';
import {ChannelIsActivated, ChannelIsRegistered, SimpleCommandResponse} from '../../core/CommandDecorators';
import {ModuleTypes} from '../../core/Enums';
import {RegisteredModulesService} from '../../core/Modules.service';

class PoltavaNewsRemoveCommand extends BaseCommand {

    @ChannelIsRegistered
    @ChannelIsActivated(ModuleTypes.PoltavaNews)
    @SimpleCommandResponse
    execute(requestBody: ISlackRequestBody): Promise<any> {
        return RegisteredModulesService
            .deactivateModuleByChannelId(ModuleTypes.PoltavaNews, requestBody.channel_id)
            .then((model) => RegisteredModulesService.stopModuleInstance(model._id));
    }
}

const poltavaNewsRemoveCommand = new PoltavaNewsRemoveCommand();

export default poltavaNewsRemoveCommand;
