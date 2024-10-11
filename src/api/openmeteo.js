'use strict';

/*
 * [FILE] openmeteo.js
 *
 * [DESCRIPTION]
 *  Open-Meteo REST APIから天気情報を取得する関数を定義する
 * 
 * [NOTE]
 *  Open-Meteoについてはこちらを参照のこと：https://open-meteo.com/
 */

import httpGet from './http_get.js';
import moment from 'moment-timezone';
import dotenv from 'dotenv';
dotenv.config();

// 環境変数からOPEN METEOのREST URLを取得する
let restURL = process.env.OPENMETEO_REST_URL;
if (restURL == null) {
  console.log("[ERROR] OPENMETEO_REST_URL not specified.");
  restURL = "";
}

// 環境変数からタイムゾーンを取得する
let timeZone = process.env.OPENMETEO_TZ;
if (timeZone == null) {
  console.log("[ERROR] OPENMETEO_TZ not specified.");
  timeZone = "";
} else timeZone = encodeURIComponent(timeZone);

const devMode = process.env.NODE_ENV == 'development' ? true : false;

/*
 * [FUNCTION] convertWeatherCode()
 *
 * [DESCRIPTION]
 *  Open Meteoの天気コードを文字列に変換する
 * 
 * [INPUTS]
 *  weatherCode - 天気コード
 * 
 * [OUTPUTS]
 *  コードに相当する日本語文字列
 * 
 * [NOTE]
 *  参考：https://www.jodc.go.jp/data_format/weather-code_j.html
 */
function convertWeatherCode(weatherCode) {
  let weather = '不明';
  if(weatherCode === 0) weather = '快晴';       // 0 : Clear Sky
  else if (weatherCode === 1) weather = '晴れ';  // 1 : Mainly Clear
  else if (weatherCode === 2) weather = '一部曇'; // 2 : Partly Cloudy
  else if (weatherCode === 3) weather = '曇り';   // 3 : Overcast
  else if (weatherCode <= 49) weather = '霧';     // 45, 48 : Fog And Depositing Rime Fog
  else if (weatherCode <= 59) weather = '霧雨';   // 51, 53, 55 : Drizzle Light, Moderate And Dense Intensity ・ 56, 57 : Freezing Drizzle Light And Dense Intensity
  else if (weatherCode <= 69) weather = '雨';     // 61, 63, 65 : Rain Slight, Moderate And Heavy Intensity ・66, 67 : Freezing Rain Light And Heavy Intensity
  else if (weatherCode <= 79) weather = '雪';     // 71, 73, 75 : Snow Fall Slight, Moderate And Heavy Intensity ・ 77 : Snow Grains
  else if (weatherCode <= 84) weather = '俄か雨'; // 80, 81, 82 : Rain Showers Slight, Moderate And Violent
  else if (weatherCode <= 94) weather = '雪・雹'; // 85, 86 : Snow Showers Slight And Heavy
  else if (weatherCode <= 99) weather = '雷雨';   // 95 : Thunderstorm Slight Or Moderate ・ 96, 99 : Thunderstorm With Slight And Heavy Hail

  return weather;
}
/*
 * HISTORY
 * [1] 2024-10-11 - Initial version
 */

/*
 * [FUNCTION] formatDatetime()
 *
 * [DESCRIPTION]
 *  日時形式 (YYYY-MM-DDThh:mm) をUNIXタイムスタンプ（エポックタイムスタンプ）に変換する
 * 
 * [INPUTS]
 *  inputDt - 変換対象の日時 (形式：YYYY-MM-DDThh:mm)
 * 
 * [OUTPUTS]
 * 
 * [NOTE]
 *  eYACHO/GEMBA Noteでは、日付や日時をUNIXタイムスタンプとして取り扱う
 */
function formatDatetime(inputDt) {
  let timestamp = moment(inputDt, 'YYYY-MM-DDThh:mm').tz('Asia/Tokyo').unix();

  return timestamp;
}
/*
 * HISTORY
 * [1] 2024-09-02 - Initial version
 */

/*
 * [FUNCTION] getForecastWeather()
 *
 * [DESCRIPTION]
 *  指定した緯度と経度の地点での一週間分の予測する天気を返す
 * 
 * [INPUTS]
 * 　latitude  - 天気予測をする地点の緯度
 * 　longitude - 天気予測をする地点の経度
 * 
 * [OUTPUTS]
 *  成功: {'status':'ok', 'forecast': [{'datetime':1724943600000, 'temperature':27.1, 'weather':'快晴'},...], 'message': null}
 *  失敗: {'status':"error", 'forecast': [], 'message': '[OPEN METEO] Forecast not found'}
 * 
 * [NOTE]
 *  Open Meteo REST APIアクセスの例:
 *   https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823&hourly=temperature_2m
 * 
 *   hourlyに「temperature_2m」というパラメータを指定すると、地上2mの気温が1週間分（1時間ごと）取得する
 */
async function getForecastWeather(latitude, longitude) {
  let retVal = {'status':'error', 'forecast': [], 'message': '[OPEN METEO] Forecast not found'};

  // アクセスするURLを生成する
  let url = restURL + "?latitude=" + latitude + "&longitude=" + longitude;
  url += "&hourly=temperature_2m,weathercode&timezone=" + timeZone;
  if (devMode) console.log("[URL]", url);

  // もしリクエストヘッダーの設定が必要であれば、ここで指定する（Open-Meteoでは無視される）
  let headers = { headers: { 'X-API-Key': "1234567890"} };
  const result = await httpGet(url, headers);

  if (result != null) {

    let datetime = result.hourly.time;
    let tempList = result.hourly.temperature_2m;
    let codeList = result.hourly.weathercode;

    for (let i = 0; i < datetime.length ; i++) {
      let info = {};
      info['datetime'] = formatDatetime(datetime[i]); // エポック値へ変換
      info['temperature'] = tempList[i];
      info['weather'] = convertWeatherCode(codeList[i]); // コードを天気に変換
      retVal.forecast.push(info);
    }

    retVal.status = 'ok';
    retVal.message = null;
  } 

  return (retVal);
};
/*
 * HISTORY
 * [2] 2024-10-11 - Added weather and used time-zone
 * [1] 2024-09-02 - Initial version
 */

export { getForecastWeather }

/*
 * FILE HISTORY
 * [1] 2024-09-02 - Initial version
 */