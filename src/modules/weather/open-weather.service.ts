import * as qs from 'querystring';
import * as rp from 'request-promise';

import variables from '../../configs/variables';
import {ISlackWebHookRequestBodyAttachment} from '../../messengers/slack/models/i-slack-web-hook-request-body-attachment';


export interface IWeatherItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: { id: number; main: string; description: string; icon: string; } [];
  clouds: { all: number; };
  wind: { speed: number; deg: number; };
  sys: { pod: string; };
  dt_txt: string;
}

interface ISuccessResponse {
  id: number;
  name: string;
  coord: { lon: number; lat: number };
  country: string;
  cod: string;
  message: string;
  cnt: number;
  list: IWeatherItem[];
}

export class OpenWeatherService {
  public lastWeather: ISuccessResponse;

  static get PoltavaRequestUrl(): string {
    return `http://api.openweathermap.org/data/2.5/forecast?${qs.stringify({
      id: variables.WEATHER.poltavaCityId,
      lang: 'ua',
      appid: variables.WEATHER.openWeatherApiKey,
      units: 'metric'
    })}`;
  }

  static get PoltavaHtmlViewLink(): string {
    return `http://openweathermap.org/city/${variables.WEATHER.poltavaCityId}?utm_source=openweathermap&utm_medium=widget&utm_campaign=html_old`;
  }

  static getWeatherIcon(ico: string): string {
    return `http://openweathermap.org/img/w/${ico}.png`;
  }

  static weatherItemToSlackAttachment(items: IWeatherItem[]): ISlackWebHookRequestBodyAttachment[] {
    return items
      .map((row) => {
        return <ISlackWebHookRequestBodyAttachment>{
          ts: row.dt.toString(),
          footer: 'openweathermap',
          footer_icon: 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/icons/favicon.ico',
          title_link: OpenWeatherService.PoltavaHtmlViewLink,
          image_url: OpenWeatherService.getWeatherIcon(row.weather[0].icon),
          color: '#36a64f',
          title: `${Math.ceil(row.main.temp)}C, ${row.weather[0].description}`
        };
      });
  }

  async getAvailableData(): Promise<ISuccessResponse> {
    if (this.lastWeather) {
      return this.lastWeather;
    }

    const data: ISuccessResponse = await this.grabOpenWeatherData();
    this.lastWeather = data;

    return data;
  }

  async grabOpenWeatherData(): Promise<ISuccessResponse> {
    return await rp({
      json: true,
      uri: OpenWeatherService.PoltavaRequestUrl
    }) as ISuccessResponse;
  }

}

const weatherService = new OpenWeatherService();

export default weatherService;
