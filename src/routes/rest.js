'use strict';
/*
 * [FILE] rest.js
 * 
 * [DESCRIPTION]
 *  Open-MetaoのAPIを利用したRESTメソッドを定義する
 * 
 * [NOTE]
 */ 
import express from 'express';
const router = express.Router();
// 環境変数を処理する
import dotenv from 'dotenv';
dotenv.config();
const devMode = process.env.NODE_ENV == 'development' ? true : false;

import { getForecastWeather } from '../api/openmeteo.js';

/*
 * GET Method
 * End Point: /rest/cities
 * 
 * [DESCRIPTION]
 *  いくつかの都庁、府庁、県庁の緯度と経度を取得する。
 *
 * [INPUTS]
 * 
 * [OUTPUTS]
 *  都庁、府庁、県庁の緯度と経度
 *  {
 *    "keys": ["city", "latitude", "longitude"],
 *    "records": [{'city':'新宿区', 'latitude':35.689501, 'longitude':139.691722}, ...],
 *    "message": null
 *  }
 */
router.get('/cities', function(req, res) {
  let results = {};
  results['keys'] = ['city', 'latitude', 'longitude'];
  let list = [];
  let elements = {'city': '新宿区', 'latitude': 35.689501, 'longitude': 139.691722};
  list.push(elements);
  elements = {'city':'大阪市', 'latitude': 34.686344, 'longitude': 135.520037};
  list.push(elements);
  elements = {'city':'福岡市', 'latitude': 33.606389, 'longitude': 130.417968};
  list.push(elements);

  results['records'] = list;
  results['message'] = null;

  if (devMode) console.log("[JSON]", results);
  res.json(results);
});
/*
 * HISTORY
 * [2] 2024-10-11 - Added Fukuoka
 * [1] 2024-09-02 - Initial version
 */

/*
 * POST Method
 * End Point: /rest/server_info
 * 
 * [DESCRIPTION]
 *  eYACHO/GEMBA Noteへメッセージを返す
 *
 * [INPUTS]
 * 　req - bodyにクライアント（eYACHO/GEMBA Note）からの緯度経度を含んだ情報が含まれる（利用せず）
 * 
 * [OUTPUTS]
 *  次のJSONをresponseへ返す
 *  { "message": <メッセージ> }
 * 
 * [NOTE]
 *   eYACHO/GEMBA Noteのボタンアクション「サーバーへ送信」でメッセージを表示させる
 */
router.post('/server_info', function(req, res) {
  let results = {};
  results['message'] = "Hello, I am a Node.js server!";
  if (devMode) {
    console.log("[BODY]", req.body);
    console.log("[JSON]", results);
  }
  res.json(results);
});
/*
 * HISTORY
 * [1] 2024-10-11 - Initial version
 */

/*
 * GET Method
 * End Point: /rest/weather
 * 
 * [DESCRIPTION]
 *  緯度と経度からその地点の天気と気温の予測データを取得する
 *
 * [INPUTS]
 *  req - Request from the method：緯度と経度を含む
 * 
 * [OUTPUTS]
 *  resに次のJSONが返却される
 * {
 *  'keys': ['datetime', 'temperature', 'weather'], 
 *  'records': [
 *      {'datetime': 1724943600, 'temperature': 28.5, 'weather': '晴れ'},  
 *      {'datetime': 1724947200, 'temperature': 29.2, 'weather': '快晴'},  
 *      ...
 *  ],
 *  'message': null
 * }
 * 
 * [NOTE]
 * 
 */ 
router.get('/weather', async function(req, res) {
  let results = {'keys':[], 'records':[], 'message':'緯度あるいは経度がありません'};
  let lat = 0;
  let lon = 0;

  // 緯度の取得
  if(req.query.hasOwnProperty('latitude')) {
    lat = req.query.latitude;
  }

  // 経度の取得
  if(req.query.hasOwnProperty('longitude')) {
    lon = req.query.longitude;
  }

  // 緯度と経度の存在チェック
  if (lat == "" || lon == "" || lat == 0 || lon == 0) {
    res.json(results);
    return;
  }

  results['keys'] = ['datetime', 'temperature', 'weather'];

  let info = await getForecastWeather(lat, lon);

  results['records'] = info.forecast;
  results['message'] = info.message;
  if (devMode) console.log("[JSON]", results);

  res.json(results);
});
/*
 * HISTORY
 * [2] 2024-10-11 - Changed /weather
 * [1] 2024-09-02 - Initial version
 */

export default router;

/*
 * FILE HISTORY
 * [2] 2024-10-11 - Added /server_info
 * [1] 2024-09-02 - Initial version
 */
