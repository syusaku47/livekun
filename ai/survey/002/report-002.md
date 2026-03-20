---
created-at: 2026-02-02 00:00:00
updated-at: 2026-02-02 00:00:00
---
#AI #Claude #report

## 関連ファイル

- [[instructions-002]]
- [[plan-002]]

## 報告

### 調査概要

categoryId=9がisUseResult=1で設定されているにもかかわらず、アップロードフォルダのフォルダIDをレスポンスしている問題について調査しました。

### 調査結果

#### 1. 問題の根本原因

**categoryIdの定義と目的マスタデータの不一致が原因です。**

#### 2. 詳細な調査結果

##### 2.1 PurposeConst.phpでの定義

- ファイル: `server/app/Consts/PurposeConst.php:14`
- OLC_ORDER_SERVICEは`9`と定義されている

```php
const OLC_ORDER_SERVICE = 9; //OLC用
```

##### 2.2 目的マスタデータの設定

- ファイル: `server/app/Console/Commands/Script/UpdatePurposeScript.php:121-127`
- OLC注文の目的マスタデータでは`categoryId => 5`となっている

```php
[
    'id' => 'jptg999999',//OLC注文仮
    'categoryId' => 5,  // ← ここが間違っている!
    'categoryName' => 'OLC商品注文(仮名)',
    'isUsePpm' => 1,
    'isUseResult' => 1,
    'isRemark' => 0
]
```

##### 2.3 resultメソッドの処理フロー

1. `OrderController.php:93-112` の`result`メソッドが呼び出される
2. `Order.php:477-500` の`searchResultList`メソッドが実行される
3. `Order.php:509-549` の`_getResultFormatColumn`メソッドで以下の処理が実行される:

```php
// 元データ、納品データどちらを使うのか
$isResult = $keyFixedData[$model->purpose]['isUseResult'];
$folderId = $isResult ? $model->resultFolderId : $model->folderId;
```

4. 目的マスタから`isUseResult`の値を取得してフォルダIDを決定
5. `isUseResult=1`の場合は納品フォルダID(`resultFolderId`)を返す
6. `isUseResult=0`の場合はアップロードフォルダID(`folderId`)を返す

##### 2.4 なぜアップロードフォルダが返されるのか

目的マスタデータの`categoryId`が`5`(TAW_PROXY_SUBMISSION)となっているため、以下のコードで意図した動作をしていません:

- `OrderController.php:388-402` のcomplete処理
- `OrderController.php:582-651` のdelivery処理

これらの処理で`$purpose['categoryId'] === PurposeConst::OLC_ORDER_SERVICE`の判定が行われていますが、実際のマスタデータは`categoryId=5`のため、OLC用の処理が実行されず、結果として納品フォルダが正しく作成・設定されていない可能性があります。

### 修正箇所

#### 修正ファイル

`server/app/Console/Commands/Script/UpdatePurposeScript.php`

#### 修正内容

121-127行目のOLC注文の目的マスタデータの`categoryId`を`5`から`9`に変更する必要があります。

**修正前:**
```php
[
    'id' => 'jptg999999',//OLC注文仮
    'categoryId' => 5,
    'categoryName' => 'OLC商品注文(仮名)',
    'isUsePpm' => 1,
    'isUseResult' => 1,
    'isRemark' => 0
]
```

**修正後:**
```php
[
    'id' => 'jptg999999',//OLC注文仮
    'categoryId' => 9,  // 5 → 9 に変更
    'categoryName' => 'OLC商品注文(仮名)',
    'isUsePpm' => 1,
    'isUseResult' => 1,
    'isRemark' => 0
]
```

#### 修正後の対応

修正後、以下のコマンドを実行して目的マスタデータを更新する必要があります:

```bash
php artisan update:purpose
```

### 影響範囲

この修正により、以下の処理が正しく動作するようになります:

1. **complete処理** (`OrderController.php:319-542`)
   - OLC注文の判定が正しく行われる(388-402行目)
   - 適切なステータス遷移が実行される

2. **delivery処理** (`OrderController.php:552-695`)
   - OLC注文の判定が正しく行われる(592-650行目)
   - 納品フォルダの作成と既存ファイル削除処理が実行される
   - `resultFolderId`が正しく設定される

3. **result処理** (`OrderController.php:93-112`)
   - `isUseResult=1`の設定に従って納品フォルダIDが返される

### 関連ファイル一覧

- `server/app/Consts/PurposeConst.php` - カテゴリID定数定義
- `server/app/Console/Commands/Script/UpdatePurposeScript.php` - 目的マスタ更新スクリプト(要修正)
- `server/app/Models/Master.php` - 目的マスタ取得処理
- `server/app/Models/CloudFolder/Order.php` - 注文処理、結果フォルダ一覧取得
- `server/app/Http/Controllers/CloudFolder/OrderController.php` - 注文コントローラ

### 注意事項

1. 既存のOLC注文データがある場合、categoryId=5で登録されている可能性があるため、データ移行が必要になる場合があります
2. 目的マスタ更新後、既存の注文に対する影響を確認する必要があります
3. 環境(開発、ステージング、本番)ごとに目的マスタの更新が必要です

### 調査日時

- 調査日: 2026-02-02
- 対象ブランチ: develop
