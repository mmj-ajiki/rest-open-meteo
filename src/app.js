'use strict';
/*
 * [FILE] app.js
 * 
 * [DESCRIPTION]
 *  Open Meteo APIにアクセスするサンプルRESTサーバーのメインプログラム
 * 
 * [NOTE]
 *  - このJavaScriptファイルはserver.jsに読み込まれる
 *  - ViewエンジンはPUG（https://pugjs.org/）を利用
 */ 
import createError from 'http-errors';
import express from 'express';
import favicon from 'serve-favicon';
import path from 'path';
import logger from 'morgan';
import dotenv from 'dotenv'
dotenv.config();
import url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Development mode
const devMode = process.env.NODE_ENV == 'development' ? true : false;
if (devMode) {
  console.log("Starting the app as the development mode");
}

let app = express();

import restRouter from './routes/rest.js';
import topRouter  from './routes/top.js';

// ViewエンジンにはPUGを利用
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

if (devMode) app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

app.get('/', 
  function(req, res) {
    res.redirect('/top');
});
app.use('/rest',  restRouter); 
app.use('/top',  topRouter); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// エラーハンドラー
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {title:'ERROR'});
});

export default app;

/*
 * FILE HISTORY
 * [1] 2024-09-02 - Initial version
 */