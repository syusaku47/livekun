#AI #Claude #introduction

**制約** を全て必ず守り、指示に従ってください。

## 指示

### 指示書

- この文書が指示書です
- ファイル名は `instructions-{id}` となっているので `{id}` はファイル名から取得してください
- タスクが全て完了した際は ../000 を実施してください。
- created-at, updated-at は YYYY-MM-DD hh:mm:ss の形式で記述してください

### 計画書

- 計画書は `./plan-{id}` に記載してください
- 記載する際は obsidian の記法で記述してください
- `plan-{id}` というファイルがテンプレートなので、テンプレートをもとに記載してください

### 報告書

- 報告書は `./report-{id}` に記載してください
- 記載する際は obsidian の記法で記述してください
- `report-{id}` というファイルがテンプレートなので、テンプレートをもとに記載してください

### 課題

STGでエラー通知が飛んできたので調査依頼

詳細
```
ENDPOINT = GET : http://stg.ppmcloud.jp/api/v1/lab/center/0057288/order
SERVICE =
MESSAGE = App\Services\Center\OrderStatusService::get(): Return value must be of type array, null returned
FILE = /app/server/app/Services/Center/OrderStatusService.php
LINE = 52
```

### タスク
- [x] 課題の調査をして
- [x] 課題の修正内容提案して

## 制約
