import LinksToPostModel, {ILinksToPostModelDocument} from '../../db/models/links-to-post.model';
import {IRegisteredModuleModelDocument} from '../../db/models/registered-module.model';
import {IInstagramConfiguration, IRegisteredModule} from '../../interfaces/i-registered-module';
import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';
import {ISlackWebhookRequestBodyAttachment} from '../../interfaces/i-slack-webhook-request-body-attachment';
import {ModuleTypes, PostStrategies} from '../core/enums';
import {RegisteredModuleInstance} from '../core/registered-moduleInstance';

const aggregationFn = (collection: ILinksToPostModelDocument[]): ISlackWebhookRequestBody => <ISlackWebhookRequestBody>{
  text: '',
  attachments: collection.map((model) => (<ISlackWebhookRequestBodyAttachment>{
    title_link: model.title,
    image_url: model.contentUrl,
    title: model.title
  }))
};

const instagramInstanceFactory = (moduleModel: IRegisteredModuleModelDocument<IInstagramConfiguration>): RegisteredModuleInstance => new RegisteredModuleInstance(
  moduleModel._id,
  (model: IRegisteredModule<IInstagramConfiguration>) => {

    switch (model.configuration.postStrategy) {
      case PostStrategies.RandomSingle:
        return LinksToPostModel.aggregate([{
          $match: {
            postedChannels: {
              $nin: [model.chanelId]
            },
            category: {
              $in: model.configuration.links
            },
            contentType: ModuleTypes.InstagramLinks
          }
        }]).sample(model.configuration.limit || 1).then((items) => {
          const collection: ILinksToPostModelDocument[] = items.map((item) => {
            return new LinksToPostModel(item);
          });

          return {
            data: aggregationFn(collection),
            items: collection
          };
        });
      case PostStrategies.AsSoonAsPossible:
      default:
        return LinksToPostModel.find({
          postedChannels: {
            $nin: [model.chanelId]
          },
          category: {
            $in: model.configuration.links
          },
          contentType: ModuleTypes.InstagramLinks
        }).limit(model.configuration.limit || 1).then((items) => ({
          data: aggregationFn(items),
          items
        }));
    }
  }
);

export default instagramInstanceFactory;
