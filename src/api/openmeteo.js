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
const restURL=process.env.OPENMETEO_REST_URL;
const devMode = process.env.NODE_ENV == 'development' ? true : false;

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
 * [FUNCTION] getForecastTemp()
 *
 * [DESCRIPTION]
 *  指定した緯度と経度の地点での一週間分の予測気温を返す
 * 
 * [INPUTS]
 * 　latitude  - 天気予測をする地点の緯度
 * 　longitude - 天気予測をする地点の経度
 * 
 * [OUTPUTS]
 *  成功: {status:"ok", 'forecast': [{"datetime":1724943600000,"temperature":27.1},...], 'message': null}
 *  失敗: {status:"error", 'forecast': [], 'message': '[OPEN METEO] Forecast not found'}
 * 
 * [NOTE]
 *  Open Meteo REST APIアクセスの例:
 *   https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823&hourly=temperature_2m
 * 
 *   hourlyに「temperature_2m」というパラメータを指定すると、地上2mの気温が1週間分（1時間ごと）取得する
 */
async function getForecastTemp(latitude, longitude) {
  let retVal = {'status':'error', 'forecast': [], 'message': '[OPEN METEO] Forecast not found'};

  // アクセスするURLを生成する
  let url = restURL + "?latitude=" + latitude + "&longitude=" + longitude + "&hourly=temperature_2m";
  if (devMode) console.log("[URL]", url);

  // もしリクエストヘッダーの設定が必要であれば、ここで指定する（Open-Meteoでは無視される）
  let headers = { headers: { 'X-API-Key': "1234567890"} };
  const result = await httpGet(url, headers);

  if (result != null) {

    let datetime = result.hourly.time;
    let tempList = result.hourly.temperature_2m;

    for (let i = 0; i < datetime.length ; i++) {
      let info = {};
      info['datetime'] = formatDatetime(datetime[i]); // エポック値へ変換
      info['temperature'] = tempList[i];
      retVal.forecast.push(info);
    }

    retVal.status = 'ok';
    retVal.message = null;
  } 

  return (retVal);
};
/*
 * HISTORY
 * [1] 2024-09-02 - Initial version
 */

export { getForecastTemp }

/*
 * FILE HISTORY
 * [1] 2024-09-02 - Initial version
 */