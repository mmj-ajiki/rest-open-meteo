'use strict';

/*
 * [FILE] http_get.js
 *
 * [DESCRIPTION]
 *  HTTP GETメソッドへアクセスする関数
 * 
 * [NOTE]
 * 
 */
import axios from 'axios';

/*
 * [FUNCTION] httpGet()
 *
 * [DESCRIPTION]
 *  指定したURLへGETメソッドでアクセスし、その結果をJSONデータで取得する関数
 * 
 * [INPUTS]
 *  url - アクセスするURL
 *  headers - リクエストヘッダー
 * 
 * [OUTPUTS]
 *  アクセスに成功したら、URL側の仕様に基づいたJSON構造を返却する
 *  アクセスに失敗したら、nullを返す
 * 
 * [NOTE]
 * 
 */
async function httpGet(url, headers) {
    let data = null;

    try {
        const res = await axios(url, headers);
        //console.log(res.data);
        data = res.data;
    } catch (err) {
        console.error(err.name + ": " + err.message);
        console.error("[URL] " + url);
    }

    return data;
}

export default httpGet;

/*
 * FILE HISTORY
 * [1] 2024-09-02 - Initial version
 */