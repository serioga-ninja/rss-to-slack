import {ModuleTypes} from '../core/enums';

import {ITimestamps} from './i-timestamps';

export interface ILinksToPostModel extends ITimestamps {
  _id: any;
  contentType: ModuleTypes;
  category: string;
  contentUrl: string;
  title?: string;
  description?: string;
  postedChannels: string[];
  important?: '0' | '1';
}
