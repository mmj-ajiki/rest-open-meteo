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

import { getForecastTemp } from '../api/openmeteo.js';

/*
 * GET Method
 * End Point: /rest/temperature
 * 
 * [DESCRIPTION]
 *  緯度と経度からその地点の気温の予測データを取得する
 *
 * [INPUTS]
 *  req - Request from the method：緯度と経度を含む
 * 
 * [OUTPUTS]
 *  res - Response to be returned
 * 
 * [NOTE]
 * 
 */ 
router.get('/temperature', async function(req, res) {
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

  results['keys'] = ['datetime', 'temperature'];

  let info = await getForecastTemp(lat, lon);

  results['records'] = info.forecast;
  results['message'] = info.message;
  if (devMode) console.log("[JSON]", results);

  res.json(results);
});
/*
 * HISTORY
 * [1] 2024-09-02 - Initial version
 */

/*
 * GET Method
 * End Point: /rest/test
 * 
 * [DESCRIPTION]
 *  REST APIが起動できるかテストするメソッド
 *
 * [INPUTS]
 * 
 * [OUTPUTS]
 *  都庁、府庁、県庁の緯度と経度
 *  {
 *    "keys": ["city", "latitude", "longitude"],
 *    "records": [{'city':'tokyo', 'latitude':35.6895014, 'longitude':139.6917337}, ...],
 *    "message": null
 *  }
 */
router.get('/test', async function(req, res) {
  let results = {};
  results['keys'] = ['city', 'latitude', 'longitude'];
  let list = [];
  let elements = {'city': 'tokyo', 'latitude': 35.6895014, 'longitude': 139.6917337};
  list.push(elements);
  elements = {'city':'osaka', 'latitude': 34.686344, 'longitude': 135.520037};
  list.push(elements);
  results['records'] = list;
  results['message'] = null;

  if (devMode) console.log("[JSON]", results);
  res.json(results);
});
/*
 * HISTORY
 * [1] 2024-09-02 - Initial version
 */

export default router;

/*
 * FILE HISTORY
 * [1] 2024-09-02 - Initial version
 */
