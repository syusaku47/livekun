---
created-at: 2026-03-05 10:00:00
updated-at: 2026-03-05 10:00:00
---
#AI #Claude #report


## 関連ファイル

- `server/app/Services/Center/OrderStatusService.php:52`
- `server/app/Services/CenterServerAccessService.php:280-315`
- `server/app/Http/Controllers/Center/OrderController.php:42-58`

## 報告

### エラー概要

```
ENDPOINT = GET : http://stg.ppmcloud.jp/api/v1/lab/center/0057288/order
SERVICE =
MESSAGE = App\Services\Center\OrderStatusService::get(): Return value must be of type array, null returned
FILE = /app/server/app/Services/Center/OrderStatusService.php
LINE = 52
```

### 原因

`OrderStatusService::get()`メソッド(52行目)は戻り値の型が`array`と宣言されていますが、`$this->center->orders`が`null`の場合に`null`を返してしまいます。

#### 発生条件

`CenterServerAccessService::getOrder()`でAPIから注文情報を取得する際、以下のケースで`$this->orders`が設定されません:

1. **APIレスポンスのerrorCodeが200以外の場合** (CenterServerAccessService.php:298-300)
   ```php
   if (strcmp((string)$body['error']['errorCode'], '200') !== 0) {
       Log::warning($body['error']['errorDetail']);
       return false;
   }
   ```

2. **API呼び出しが失敗した場合** (CenterServerAccessService.php:304-308)
   ```php
   } else {
       $result = false;
       Log::warning($url);
       Log::warning($response->status());
   }
   ```

3. **例外が発生した場合** (CenterServerAccessService.php:309-313)

これらのケースでは`$this->orders`が未設定(`null`)のまま処理が進み、`OrderStatusService::get()`で`null`が返されるため、型エラーが発生します。

### 修正提案

#### 推奨: OrderStatusService::get()で空配列を返す

```php
public function get(): array
{
    return $this->center->orders ?? [];
}
```

**メリット:**
- より防御的なコーディング
- `CenterServerAccessService`が初期化されていない場合でも安全
- null合体演算子(`??`)でシンプルに実装可能
- 呼び出し側(`OrderController::index()`)で既に`count($result) === 0`のチェックが実装されているため、空配列を返しても問題ない

#### 代替案: CenterServerAccessServiceで初期化

コンストラクタで`orders`を空配列で初期化:

```php
public function __construct()
{
    $this->sessionId = null;
    $this->shopName = null;
    $this->orders = [];  // 追加
}
```

**注意点:**
- `CenterServerAccessService`は`__get()`マジックメソッドで未定義プロパティを扱うため、明示的な初期化が必要
- ただし、他の箇所でも同様の問題が発生する可能性があるため、呼び出し側で防御する方が安全

### 影響範囲

- `OrderController::index()` (server/app/Http/Controllers/Center/OrderController.php:49)
- `OrderStatusService::getByShopOrderId()` (server/app/Services/Center/OrderStatusService.php:55-61)
  - こちらも同様に`$this->center->orders`が`null`の場合にエラーが発生する可能性がありますが、`array_filter()`の第一引数が`null`でもエラーにならない仕様のため、現状では問題ありません。

### 推奨対応

1. **即座に対応**: `OrderStatusService::get()`を修正
2. **追加検討**: 同様のパターンが他にないか確認
