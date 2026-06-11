# rest-open-meteo

## サンプルRESTサーバー

このサンプルのRESTサーバーは、Open-Meteo ([https://open-meteo.com/](https://open-meteo.com/))という無償で利用できる天気予報APIにアクセスする。そのNode.js版である。  

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

### 環境変数の設定

このサーバーは起動時に以下の環境変数を参照する。環境変数は **env.tpl** に定義されている。サーバーを起動する前に、プログラムが読み込めるようにこのファイル名を **.env** に変更する。

| 環境変数名 | 説明 |
| ---- | ---- |
| OPENMETEO_REST_URL | Open Meteo REST APIへアクセスするルートURL |
| OPENMETEO_TZ | Open Meteo REST APIへ渡すタイムゾーン（例：Asia/Tokyo） |
| PORT | サーバーのポート番号（初期設定は、5000） |

### サーバーの起動

開発モードで起動 (ソースコード編集内容が自動的に反映される)

```bash
npm run dev
```

本番モードで起動

```bash
npm start
```

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

#### /rest/cities

いくつかの都庁、府庁、県庁の緯度と経度を取得する。サーバーが起動しているか確認するテストのエンドポイント。

リクエストの仕様：

| メソッド | リクエスト |
| ---- | ---- |
| GET | なし |

レスポンスの仕様:

| キー | 説明 |
| ---- | ---- |
| city | 都市名 |
| latitude | その都市の（都庁や府庁所在地の）緯度 |
| longitude | その都市の（都庁や府庁所在地の）経度 |

レスポンス例:

```bash
{
   'keys': ['city', 'latitude', 'longitude'], 
   'records': [
       {'city': '新宿区', 'latitude': 35.689501, 'longitude': 139.691722}, 
       {'city': '大阪市', 'latitude': 34.686344, 'longitude': 135.520037} 
       ...
   ],
   'message': null
}
```

#### /rest/server_info

このサーバーが何者かを提示するメソッド。eYACHO/GEMBA Noteアプリ上でダイアログにメッセージを表示する例。

リクエストボディの仕様：

| メソッド | ボディ |
| ---- | ---- |
| POST | 特に不要 |
| 説明 | 存在すればコンソール上に表示 |

レスポンスの仕様:

| キー | 説明 |
| ---- | ---- |
| message | 表示するメッセージ |

レスポンス例:

```bash
{
  'message': 'Hello, I am a Node.js server!'
}
```

#### /rest/weather

指定した緯度と経度からその地点の天気と気温の予測データを1週間分（1時間ごと）取得する。

リクエストの仕様：

| メソッド | リクエスト1 | リクエスト2 |
| ---- | ---- | ---- |
| GET | latitude | longitude |
| 説明 | 予測する地点の緯度（必須） | 予測する地点の経度（必須） |

レスポンスの仕様:

| キー | 説明 |
| ---- | ---- |
| datetime | 予測日時（UNIXタイムスタンプ） |
| temperature | 指定した地点の予測気温 |
| weather | 指定した地点の予測天気 |

レスポンス例:

```bash
{
   'keys': ['datetime', 'temperature', 'weather'], 
   'records': [
       {'datetime': 1724943600, 'temperature': 28.5, 'weather': '晴れ'},  
       {'datetime': 1724947200, 'temperature': 29.2, 'weather': '快晴'},  
       ...
   ],
   'message': null
}
```

### Webブラウザでのテスト

サーバーを起動した後で、Webブラウザを開き、次のURLへアクセスしてみる[1]。

[http://localhost:5000/rest/cities](http://localhost:5000/rest/cities)

[http://localhost:5000/rest/weather?latitude=35.6785&longitude=139.6823](http://localhost:5000/rest/weather?latitude=35.6785&longitude=139.6823)

[1] サーバーのポート番号を変更した場合は、アクセスするURLのポート番号も変更する

### eYACHO/GEMBA Noteとのデータ連携テスト

- packageフォルダ以下にある開発パッケージのバックアップファイル（Open_Meteo__<バージョン>__backup.gncproj）をeYACHO/GEMBA Noteに復元する
- サーバーが起動していることを確認する
  - Windowsアプリからローカルサーバーにアクセスする場合は、管理者モードで利用対象アプリのループバックを有効にする → [Windowsで開発する際の注意点](./NoticesForWindows.md)
- 開発パッケージフォルダ上にある **天気予測**ノートを開く
- 自由ページにある **天気予測** ページ上の **更新** ボタンをクリックする[2]
  - 現日時以降の気温と天気の予測が24時間分（1時間おき）一覧表示されることを確認する
- 同ページ右上にある **サーバー情報** をクリックするとダイアログ上にメッセージが表示される

[2] サーバーのポート番号を変更した場合は、アグリゲーション検索条件「forecastWeather」のコネクタ定義にある **URL** を変更する。

### 更新履歴

- 2026-06-11 - axiosを1.17.xへアップグレード
- 2026-04-09 - node 24.xへアップグレード
- 2025-10-23 - V7に伴う修正
- 2024-10-13 - Herokuへデプロイ準備: Procfile追加、.envをenv.tplへ変更
- 2024-10-11 - 天気を追加、ループバック有効を追記
- 2024-09-02 - 初回リリース
