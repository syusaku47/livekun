#AI #Claude #introduction

**制約** を全て必ず守り、指示に従ってください。

## 指示

### 指示書

- この文書が指示書です
- ファイル名は `instructions-002` となっているので `002` はファイル名から取得してください
- タスクが全て完了した際は ../000 を実施してください
- created-at, updated-at は YYYY-MM-DD hh:mm:ss の形式で記述してください
- created-at, updated-at は日本時間を取得し記述してください

### 計画書

- 計画書は `./plan-002` に記載してください
- 記載する際は obsidian の記法で記述してください
- `plan-002` というファイルがテンプレートなので、テンプレートをもとに記載してください

### 報告書

- 報告書は `./report-002` に記載してください
- 記載する際は obsidian の記法で記述してください
- `report-002` というファイルがテンプレートなので、テンプレートをもとに記載してください

### 課題
- livekunの仕様まとめ
- livekunに新しい機能を実装


### タスク
- [x] livekunの現在の仕様をまとめて → ../result/002/livekun-spec-summary.md
- [x] 追加した方が良い機能調査して → ../result/002/feature-proposals.md
- [x] フロントエンド - バックエンドAPI連携（localStorageからAPI呼び出しに変更）
- [x] 編集機能の追加（`/lives/[id]/edit` ページ作成）
- [x] ユーザー認証の導入（NextAuth.js + JWT、user/adminロール）
- [x] 写真のS3アップロード対応（既存バケット: livekun-diary-dev、ap-northeast-1）
- [x] 検索・フィルタリング機能（アーティスト名、会場名、日付範囲）
- [x] コンポーネント分割（ナビゲーション統合、ページ構造整理）
- [x] PWA対応（manifest.json作成、viewport設定）
- [x] 統計ダッシュボード（年間参戦回数、アーティスト別集計）
- [ ] SNS共有機能（OGP画像生成・公開/非公開設定）→ 保留
- [ ] セットリスト外部連携（setlist.fm API）→ 後回し
- [x] カレンダー表示（ライブ予定・履歴のカレンダービュー）
- [ ] ドメイン設定（livekun.net、Route 53ホストゾーン作成済み: Z07989071O1XF1Y0UAF5T）


## 制約

- 新規で作成する資料は ../result/002 に作成して