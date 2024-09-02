# rest-open-meteo

## サンプルRESTサーバー

このサンプルのRESTサーバーは、Open-Meteo ([https://open-meteo.com/](https://open-meteo.com/))という無償で利用できる天気予報APIにアクセスする。

### Node.jsのインストール

このサーバーはNode.js上で実装されているので、[https://nodejs.org/ja/download/](https://nodejs.org/ja/download/)を参照して、環境にあったNode.jsをインストールする

### サーバーのインストール

コマンドプロンプト（Windows OSやLinux）、ターミナル（Mac OS）から次のコマンドを実行し、サーバーに必要なNode.jsのパッケージをインストールする。

インストールされたパッケージは node_modulesフォルダ以下に配置される。

```bash
npm install
```

もしhigh severity vulnerabilityというエラーが発生した時, 次のコマンドを実行してみる:

```bash
npm audit fix
```

### サーバーの起動

開発モードで起動 (ログが多く表示される)

```bash
npm run dev
```

本番モードで起動

```bash
npm start
```

### 環境件数

このサーバーは起動時にいくつかの環境変数を参照する。環境変数は .envに設定されている。

|  環境変数名 |  説明  |
| ---- | ---- |
|  OPENMETEO_REST_URL  | Open Meteo REST APIへアクセスするルートURL |
|  REST_PORT | サーバーのポート番号（初期設定は、5000） |

### REST APIs

このサーバーが提供するREST APIエンドポイントは、ある定型的なJSON構造を返却する。その構造は、株式会社MetaMoJiの製品 **eYACHO** および **GEMBA Note**の開発者オプションのアグリゲーション検索条件を構成する **RESTコネクタ** の仕様に基づく。

REST用アグリゲーションの出力構造：

```bash
{
   'keys': ['key1', 'key2', ... 'keyN'], # recordsの中で用いるキーの一覧
   'records': [
       {'key1': value-11, 'key2': value-21, ... 'keyN': value-N1}, 
       {'key1': value-12, 'key2': value-22, ... 'keyN': value-N2}, 
       ...,
       {'key1': value-1m, 'key2': value-2m, ... 'keyN': value-Nm}, 
   ],
   'message': エラーメッセージ or null(success)
}
```

#### /rest/temperature

指定した緯度と経度からその地点の気温の予測データを取得する。

リクエストの仕様：

|  メソッド |  リクエスト1  |  リクエスト2  |
| ---- | ---- | ---- |
|  GET | latitude | longitude |
|  説明 | 予測する地点の緯度（必須）| 予測する地点の経度（必須）|

レスポンスの仕様:

|  キー  | 説明  |
| ---- | ---- |
| datetime | 予測日時（UNIXタイムスタンプ） |
| temperature | 指定した地点の予測気温 |

レスポンス例:

```bash
{
   'keys': ['datetime', 'temperature'], 
   'records': [
       {'datetime': 1724943600, 'temperature': 28.5},  
       {'datetime': 1724947200, 'temperature': 29.2},  
       ...
   ],
   'message': null
}
```

#### /rest/test

サーバーが起動しているか確認するテストのエンドポイント

リクエストの仕様：

|  メソッド |  リクエスト |
| ---- | ---- |
|  GET | なし |

レスポンスの仕様:

|  キー  | 説明  |
| ---- | ---- |
| city | 都市名 |
| latitude | その都市の（都庁や府庁所在地の）緯度 |
| longitude | その都市の（都庁や府庁所在地の）経度 |

レスポンス例:

```bash
{
   'keys': ['city', 'latitude', 'longitude'], 
   'records': [
       {'city': 'tokyo', 'latitude': 35.6895014, 'longitude': 139.6917337}, 
       {'city': 'osaka', 'latitude': 34.686344, 'longitude': 135.520037} 
       ...
   ],
   'message': null
}
```

### Webブラウザでのテスト

サーバーを起動した後で、Webブラウザを開き、次のURLへアクセスしてみる[1]。

[http://localhost:5000/rest/test](http://localhost:5000/rest/test)

[http://localhost:5000/rest/temperature?latitude=35.6785&longitude=139.6823](http://localhost:5000/rest/temperature?latitude=35.6785&longitude=139.6823)

[1] サーバーのポート番号を変更した場合は、アクセスするURLのポート番号も変更する

### eYACHO/GEMBA Noteとのデータ連携テスト

- packageフォルダ以下にある開発パッケージのバックアップファイル（Open_Meteo__<バージョン>__backup.gncproj）をeYACHO/GEMBA Noteに復元する
- サーバーが起動していることを確認する
- 開発パッケージフォルダ上にある「天気予測」ノートを開く
- 「最新に更新」ボタンをクリックし、本日の気温予測が一覧表示されることを確認する[2]

[2] サーバーのポート番号を変更した場合は、アグリゲーション検索条件「forecastTemperature」のコネクタ定義にある **URL** を変更する。

### 更新履歴

- 2024-09-02 - 初回リリース
