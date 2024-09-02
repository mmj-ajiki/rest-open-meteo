'use strict';
/*
 * [FILE] top.js
 * 
 * [DESCRIPTION]
 *  サンプルRESTサーバーのトップページを開く
 * 
 * [NOTE]
 */ 
import express from 'express';
const router = express.Router();

/*
 * GET Method
 * End Point: /top
 * 
 * [DESCRIPTION]
 *  トップページを開く
 * 
 * [INPUTS]
 *  req    - リクエスト (not used)
 *  res    - レスポンス
 * 
 * [OUTPUTS]
 * 
 * [NOTE]
 *  Web画面上に単に、"Open-Meteo REST Server"と表示するのみ
 * 
 */
router.get('/', function(req, res) {
  res.render('top', { title: 'Open-Meteo REST Server' });
});

export default router;

/*
 * FILE HISTORY
 * [1] 2024-09-02 - Initial version
 */