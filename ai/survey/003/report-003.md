---
created-at: 2026-02-16 12:30:00
updated-at: 2026-02-25 12:00:00
---
#AI #Claude #report

## 関連ファイル

- [[instructions-003]]
- [[plan-003]]
- [[PPM_CLOUD-4244]]
- [[センターログイン処理まとめ]]

## 報告

### 調査概要

PPM_CLOUD-4244「【IF設計】IFのエラー項目追加依頼」に関連して、2026/2/13に大量アクセスが発生したorders.phpのAPIについて調査しました。センターの注文一覧API (`/api/v1/orders`) にアクセスしているエンドポイントを特定し、店舗番号(kijshopCd)をパラメータに含むリクエストと含まないリクエストに分類しました。

### 調査結果

#### 1. センターの注文一覧APIエンドポイント

**設定ファイル:** `ppm-cloud-api/server/config/center.php:15`
```php
'orders' => '/api/v1/orders'
```

#### 2. `/api/v1/orders` にアクセスしているAPI一覧

以下の2つのサービスクラスが `/api/v1/orders` エンドポイントにアクセスしています:

##### 2-1. App\Services\CenterServerAccessService

**ファイルパス:** `server/app/Services/CenterServerAccessService.php:269-304`

**メソッド:** `getOrder()`

**リクエスト仕様:**
- メソッド: GET
- URL: `{CENTER_SERVER_URL}/api/v1/orders`
- ヘッダー:
  - `X-lnw-App-Id`: アプリケーションID
  - `X-Session-Id`: セッションID (ログイン後に取得)
- **パラメータ: なし**

**使用箇所:**
1. `App\Services\OrderStatusSetService::getOrderList()` (server/app/Services/OrderStatusSetService.php:120)
   - 呼び出し元: `App\Console\Commands\SetCenterOrderStatusBatch` (バッチ処理)

2. `App\Services\OrderDeleteService::getOrderList()` (server/app/Services/OrderDeleteService.php:100)
   - 呼び出し元: `App\Console\Commands\OrderDataDeleteBatch` (バッチ処理)

3. `App\Services\TestGetAllInfoService::getAllInfo()` (server/app/Services/TestGetAllInfoService.php:44)
   - 呼び出し元: `App\Http\Controllers\TestGetOrdersInfoController::testGetInfoFromCenter()` (テスト用コントローラー)

##### 2-2. App\Services\CloudFolder\CenterServerAccessService

**ファイルパス:** `server/app/Services/CloudFolder/CenterServerAccessService.php:192-227`

**メソッド:** `getOrder()`

**リクエスト仕様:**
- メソッド: GET
- URL: `{CENTER_SERVER_URL}/api/v1/orders`
- ヘッダー:
  - `X-lnw-App-Id`: アプリケーションID
  - `X-Session-Id`: セッションID (店舗ログイン後に取得)
- **パラメータ: なし**

**使用箇所:**
1. `App\Services\Center\OrderStatusService::getCenterOrder()` (server/app/Services/Center/OrderStatusService.php:34)
   - 呼び出し元: `App\Http\Controllers\Center\OrderController::index()` (APIエンドポイント)
   - 呼び出し元: `App\Http\Controllers\Center\OrderController::show()` (APIエンドポイント)

#### 3. 店舗番号(kijshopCd)によるリクエストの分類

**結論: すべてのリクエストが店舗番号(kijshopCd)をパラメータに含まない**

##### 店舗番号を含まないリクエスト

上記2つのサービスクラスのgetOrder()メソッドは、いずれも以下の特徴があります:

1. **リクエストパラメータに kijshopCd を含まない**
   - センターサーバーへのGETリクエストにクエリパラメータを指定していない
   - セッションIDのみをヘッダーに含めてリクエスト

2. **全注文情報を取得後、PHPコード側でフィルタリング**
   - センターサーバーから全店舗の全注文情報を取得
   - 取得後のレスポンスデータを `_parseOrder()` メソッドでパース
   - パース時に各注文の `kijshopCd` を取得し、店舗ごとに分類

   **参考コード** (CenterServerAccessService.php:344-361):
   ```php
   private function _parseOrder($orders)
   {
       $orderList = null;
       if (!is_array($orders)) {
           Log::warning("注文情報取得不可によるエラー");
           return false;
       }
       foreach ($orders as $order) {
           //店舗コード取得
           $kijshopCd = $order['kijshopCd'];
           $orderList[$kijshopCd][$order['shopOrderId']] = [
               'orderStatusName' => $order['orderStatusName'],
               'status' => $this->_getOrderStatus($order),
           ];
       }
       $this->orderList = $orderList;
       return true;
   }
   ```

##### 店舗番号を含むリクエスト

**該当なし**

現在のコードベースでは、`/api/v1/orders` エンドポイントへのリクエスト時に `kijshopCd` をパラメータとして送信しているコードは存在しません。

### 大量アクセスの原因分析

2026/2/13に発生した214回のAPIアクセスは、以下の可能性が考えられます:

1. **バッチ処理の異常実行**
   - `SetCenterOrderStatusBatch` または `OrderDataDeleteBatch` が異常な頻度で実行された
   - 通常は定期実行だが、何らかの原因で短時間に複数回実行された可能性

2. **テスト用エンドポイントの連続実行**
   - `TestGetOrdersInfoController::testGetInfoFromCenter()` が連続して呼び出された
   - テストまたはデバッグ目的で大量にアクセスされた可能性

3. **ラボユーザーによるUI操作**
   - `OrderController::index()` または `OrderController::show()` が連続して呼び出された
   - センター注文ステータス確認画面での連続リロードやポーリング処理

### API呼び出しフロー

```
1. CenterServerAccessService系
   login() → getOrder() → logout()
   ↓
   全注文情報取得 (パラメータなし)
   ↓
   PHP側で kijshopCd によるフィルタリング

2. CloudFolder\CenterServerAccessService系
   shopLogin(kijshopCd, password) → getOrder() → logout()
   ↓
   全注文情報取得 (パラメータなし)
   ↓
   PHP側で kijshopCd によるフィルタリング
```

### 発見事項・注意点

1. **すべてのリクエストが全データ取得**
   - `/api/v1/orders` へのリクエストは常に全店舗・全注文情報を取得
   - 店舗数・注文数が増加すると、レスポンスサイズとサーバー負荷が増大
   - 大量アクセス時のセンターサーバーへの負荷が大きい

2. **kijshopCdによる絞り込みが実装されていない**
   - センターサーバー側のAPIが `kijshopCd` パラメータをサポートしているかは不明
   - 現状のクライアント側実装では、パラメータを使用していない
   - 必要な店舗の情報のみを取得する最適化の余地がある

3. **セッション管理方式の違い**
   - `CenterServerAccessService`: バックエンドログイン (loginID/password)
   - `CloudFolder\CenterServerAccessService`: 店舗ログイン (kijshopCd/password)
   - ログイン方式は異なるが、どちらも全注文情報を取得

4. **テスト用コントローラーの存在**
   - `TestGetOrdersInfoController` がテスト用に実装されている
   - 本番環境で実行される可能性があり、意図しないアクセスの原因となりうる

### 推奨事項

1. **APIアクセス頻度の監視**
   - バッチ処理の実行ログを確認
   - 異常な頻度での実行がないか監視体制を整備
   - アクセスログから呼び出し元を特定

2. **パフォーマンス最適化の検討**
   - センターサーバーAPIが `kijshopCd` パラメータをサポートしている場合、パラメータを使用して必要なデータのみを取得
   - キャッシュの導入を検討
   - ポーリング処理がある場合は、適切な間隔を設定

3. **テスト用エンドポイントの管理**
   - `TestGetOrdersInfoController` の使用状況を確認
   - 本番環境では無効化またはアクセス制限を実施

4. **エラーハンドリングの強化**
   - API呼び出し失敗時のリトライロジックを確認
   - 無限ループや過度なリトライが発生していないか検証

### 関連ファイル一覧

#### サービスクラス
- `server/app/Services/CenterServerAccessService.php`
- `server/app/Services/CloudFolder/CenterServerAccessService.php`
- `server/app/Services/OrderStatusSetService.php`
- `server/app/Services/OrderDeleteService.php`
- `server/app/Services/TestGetAllInfoService.php`
- `server/app/Services/Center/OrderStatusService.php`

#### コントローラー
- `server/app/Http/Controllers/Center/OrderController.php`
- `server/app/Http/Controllers/TestGetOrdersInfoController.php`

#### バッチコマンド
- `server/app/Console/Commands/SetCenterOrderStatusBatch.php`
- `server/app/Console/Commands/OrderDataDeleteBatch.php`

#### 設定ファイル
- `server/config/center.php`

### 関連チケット

- PPM_CLOUD-4244: 【IF設計】IFのエラー項目追加依頼

### 追加調査: リトライ処理の実装状況

#### 4. リトライ処理の有無

##### 4-1. getOrder()メソッド自体のリトライ

**結論: リトライロジックは実装されていない**

- `CenterServerAccessService::getOrder()` (server/app/Services/CenterServerAccessService.php:269-304)
  - HTTP リクエスト失敗時のリトライ処理: **なし**
  - エラーハンドリング: `try-catch`でエラーをキャッチし、`false`を返すのみ
  - タイムアウト設定: **なし**

- `CloudFolder\CenterServerAccessService::getOrder()` (server/app/Services/CloudFolder/CenterServerAccessService.php:192-227)
  - HTTP リクエスト失敗時のリトライ処理: **なし**
  - エラーハンドリング: `try-catch`でエラーをキャッチし、`false`を返すのみ
  - タイムアウト設定: **なし**

##### 4-2. バッチコマンドのリトライ

**結論: リトライロジックは実装されていない**

- `SetCenterOrderStatusBatch` (server/app/Console/Commands/SetCenterOrderStatusBatch.php)
  - getOrderList()失敗時: 警告ログを出力し、`return 0`で終了
  - リトライなし

- `OrderDataDeleteBatch` (server/app/Console/Commands/OrderDataDeleteBatch.php)
  - getOrderList()失敗時: 警告ログを出力し、`return 0`で終了
  - リトライなし

**注意点:** バッチコマンド自体がcronやスケジューラーから異常な頻度で実行された場合、結果的に複数回のAPIアクセスが発生する可能性がある。

##### 4-3. コントローラーのリトライ

**結論: リトライロジックは実装されていない**

- `OrderController::index()` (server/app/Http/Controllers/Center/OrderController.php:42-58)
  - getCenterOrderFormat()失敗時: 500エラーを返すのみ
  - リトライなし

- `OrderController::show()` (server/app/Http/Controllers/Center/OrderController.php:65-87)
  - getCenterOrderFormat()失敗時: 500エラーを返すのみ
  - リトライなし

- `TestGetOrdersInfoController::testGetInfoFromCenter()` (server/app/Http/Controllers/TestGetOrdersInfoController.php:14-61)
  - getAllInfo()失敗時: 400エラーを返すのみ
  - リトライなし

**注意点:** ユーザーやフロントエンドからの連続リクエストにより、複数回のAPIアクセスが発生する可能性がある。

##### 4-4. Jobクラスのリトライ（参考情報）

**注意:** Jobクラスはセンターラボ発注APIを呼び出すが、`getOrder()`は呼び出さない。

- `LaboOrderRequestJob` (server/app/Jobs/LaboOrderRequestJob.php)
  - **Laravelキューシステムのリトライ:** `public $tries = 3;` (31行目)
  - **retry関数によるリトライ:** `retry(3, function () {...}, 1000);` (192-194行目)
  - リトライ対象: `exec_center_labo_order()` (センターラボ発注API)
  - **最大実行回数:** 3回（Jobレベル） × 3回（retry関数） = 最大9回

- `PpmCloud\LaboOrderRequestJob` (server/app/Jobs/PpmCloud/LaboOrderRequestJob.php)
  - **Laravelキューシステムのリトライ:** `public $tries = 3;` (32行目)
  - **retry関数によるリトライ:** `retry(3, function () {...}, 1000);` (176-178行目)
  - リトライ対象: `exec_center_labo_order()` (センターラボ発注API)
  - **最大実行回数:** 3回（Jobレベル） × 3回（retry関数） = 最大9回

**重要:** これらのJobクラスは`/api/v1/orders`（注文一覧取得API）ではなく、センターラボ発注API（`/api/v1/orderRegist`など）を呼び出すため、今回の大量アクセスの直接の原因ではない。

##### 4-5. ループ処理や再実行の可能性

**結論: アプリケーションコード内にループ処理はない**

- バッチコマンド: 1回のみgetOrder()を呼び出し、失敗したら終了
- コントローラー: 1回のみgetOrder()を呼び出し、失敗したらエラーレスポンス
- ループ処理なし

**大量アクセスの可能性:**

1. **バッチスケジューラーの異常実行**
   - cron設定の誤りにより、短時間に複数回実行
   - Laravelスケジューラーの重複実行

2. **フロントエンドのポーリング処理**
   - JavaScriptの`setInterval()`や`setTimeout()`による定期的なAPIコール
   - 自動更新機能やリアルタイム更新処理

3. **ユーザー操作**
   - 画面の連続リロード
   - ブラウザの戻る/進むボタンの連続操作

4. **テストコントローラーの連続実行**
   - `TestGetOrdersInfoController::testGetInfoFromCenter()`の連続呼び出し
   - 負荷テストやデバッグ目的での大量アクセス

5. **HTTPクライアント/ブラウザのリトライ**
   - タイムアウトやネットワークエラー時の自動リトライ
   - プロキシやロードバランサーのリトライ設定

#### リトライ処理に関する推奨事項

1. **明示的なリトライロジックの実装**
   - `getOrder()`メソッドにExponential Backoffを使用したリトライロジックを追加
   - retry関数を使用した実装例:
     ```php
     $result = retry(3, function () use ($url, $headers) {
         $response = Http::withHeaders($headers)->get($url);
         if (!$response->successful()) {
             throw new \Exception('API request failed');
         }
         return $response;
     }, 1000); // 1秒間隔
     ```

2. **タイムアウト設定の追加**
   - HTTPリクエストにタイムアウトを設定し、ハング防止
   ```php
   $response = Http::timeout(30)->withHeaders($headers)->get($url);
   ```

3. **レートリミット/スロットリングの実装**
   - APIコールの頻度制限を実装
   - Laravelのレートリミッターを使用

4. **バッチ実行の重複防止**
   - バッチ実行時にロックファイルを使用し、重複実行を防止
   - Laravelの`withoutOverlapping()`メソッドを使用

5. **フロントエンドのポーリング間隔の見直し**
   - ポーリング処理がある場合、適切な間隔（最低30秒以上）を設定
   - WebSocketやServer-Sent Eventsの使用を検討

6. **監視とアラートの強化**
   - APIコール頻度の監視
   - 異常なアクセスパターンの検知とアラート

### セッションIDログ出力の実装

#### 実装日時
- 実装日: 2026-02-25

#### 実装内容

センターサーバーから取得したセッションIDをログに出力する機能を実装しました。

##### 実装箇所

1. **App\Services\CenterServerAccessService**
   - ファイルパス: `server/app/Services/CenterServerAccessService.php`
   - `login()` メソッド (バックエンドログイン): 82-86行目
   - `shopLogin()` メソッド (店舗ログイン): 159-164行目

2. **App\Services\CloudFolder\CenterServerAccessService**
   - ファイルパス: `server/app/Services/CloudFolder/CenterServerAccessService.php`
   - `login()` メソッド (バックエンドログイン): 71-75行目
   - `shopLogin()` メソッド (店舗ログイン): 147-152行目

##### ログ出力内容

**バックエンドログイン時:**
```php
Log::info('Center Login Success', [
    'sessionId' => $this->sessionId,
    'shopName' => $this->shopName,
    'loginType' => 'backend'
]);
```

**店舗ログイン時:**
```php
Log::info('Center Shop Login Success', [
    'sessionId' => $this->sessionId,
    'shopName' => $this->shopName,
    'kijshopCd' => $shopId,
    'loginType' => 'shop'
]);
```

##### ログレベル
- `Log::info()` - 情報レベル

##### ログ出力項目
- `sessionId`: センターサーバーから取得したセッションID
- `shopName`: 店舗名
- `loginType`: ログイン種別 ('backend' または 'shop')
- `kijshopCd`: 店舗コード (店舗ログイン時のみ)

##### 効果
- センターログイン時のセッションIDを追跡可能
- 大量アクセスが発生した際、セッションIDからログイン元を特定可能
- デバッグ時にセッション管理の問題を発見しやすくなる

### 調査日時

- 調査日: 2026-02-16
- 調査対象ブランチ: develop
- リトライ調査追加日: 2026-02-16
- セッションIDログ出力実装日: 2026-02-25
