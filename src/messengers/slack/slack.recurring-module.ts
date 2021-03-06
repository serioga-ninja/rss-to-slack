import {RecurringModuleInstance} from '../../core/modules/recurring-moduleInstance';
import {ILinksToPostModelDocument} from '../../db/models/links-to-post.model';
import {ISlackWebHookRequestBody} from './models/i-slack-web-hook-request-body';
import slackWebClient, {IChatPostMessageResult} from './slack-web-client';

export abstract class SlackRecurringModule extends RecurringModuleInstance<ISlackWebHookRequestBody> {

  protected abstract mapData(items: ILinksToPostModelDocument[]): ISlackWebHookRequestBody;

  protected abstract collectData(): Promise<ILinksToPostModelDocument[]>;

  protected validate(data: ISlackWebHookRequestBody): boolean {
    return !(data === null || data.attachments.length === 0);
  }

  protected async postData(data: ISlackWebHookRequestBody): Promise<void> {
    this.logService.info(`Posting data to channel ${this.model.chanelId}`, data);

    const res = await slackWebClient.chat.postMessage({
      ...data,
      channel: this.model.chanelId
    }) as IChatPostMessageResult;

    this.logService.info(`A message was posed to conversation ${res.channel} with id ${res.ts} which contains the message ${res.message}`);
  }
}
