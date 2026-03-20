#AI #Claude #introduction

**制約** を全て必ず守り、指示に従ってください。

## 指示

### 指示書

- この文書が指示書です
- ファイル名は `instructions-{id}` となっているので `{id}` はファイル名から取得してください
- タスクが全て完了した際は ../000 を実施してください
- created-at, updated-at は YYYY-MM-DD hh:mm:ss の形式で記述してください

### 計画書

- 計画書は `./plan-{id}` に記載してください
- 記載する際は obsidian の記法で記述してください
- `plan-{id}` というファイルがテンプレートなので、テンプレートをもとに記載してください

### 報告書

- 報告書は `./report-{id}` に記載してください
- 記載する際は obsidian の記法で記述してください
- `report-{id}` というファイルがテンプレートなので、テンプレートをもとに記載してください

### タスク

- [ ] 「Git更新方法.md」を作成してください
  - ステージング更新方法
    - deploy/stg4にdevelop4-fy25の内容をpushしてください
    - コマンド：
      - git checkout deploy/stg4
      - git reset --hard develop4-fy25
      - git push origin deploy/stg4
	- このままだとAPIの向き先がdevelop4を見てしまうのでppm-cloud-apiに移動
    - frontフォルダの中身を修正(env.staging.jsonの内容そのままenv.jsonにコピー)
    - deploy/stg4ブランチでコミットしてプッシュしてください
- [ ] 「workerサーバー更新.md」を作成してください
## 制約


