#AI #Claude #introduction

**制約** を全て必ず守り、指示に従ってください。

## 指示

### 指示書

- この文書が指示書です
- ファイル名は `instructions-{id}` となっているので `{id}` はファイル名から取得してください
- タスクが全て完了した際は ../000 を実施してください
- created-at, updated-at は YYYY-MM-DD hh:mm:ss の形式で記述してください
- 完了したタスクは[x]としてください

### 計画書

- 計画書は `./plan-{id}` に記載してください
- 記載する際は obsidian の記法で記述してください
- `plan-{id}` というファイルがテンプレートなので、テンプレートをもとに記載してください

### 報告書

- 報告書は `./report-{id}` に記載してください
- 記載する際は obsidian の記法で記述してください
- `report-{id}` というファイルがテンプレートなので、テンプレートをもとに記載してください

### 課題

アプリ概要
ライブ参戦情報を残すようなアプリを作成したい

欲しい情報
- アーティスト名
- 公演日
- 会場場所
- ツアー名
- 複数枚写真をアップ(100枚以内の画像アップ)
  - 1枚あたり 100MBまで
- 開始時間、終了時間
- 周辺施設情報(居酒屋、カフェ)
- google map情報
- 感想を載せる
- セトリ入力
  - セトリ情報からapple musicを再生できる
  - MC、アンコール情報も入力したい

使用言語
node.js
typescript

使用フレームワーク
Next.js
Nest.js

今後つけたい機能
- ログイン
- メール総員

npm run dev 実行時のエラー
Error: Can't resolve 'tailwindcss' in '/Users/masudashusaku/workspace/livekun'
[at finishWithoutResolve (/Users/masudashusaku/workspace/livekun/frontend/node_modules/enhanced-resolve/lib/Resolver.js:586:18)]
[at /Users/masudashusaku/workspace/livekun/frontend/node_modules/enhanced-resolve/lib/Resolver.js:678:14]
[at /Users/masudashusaku/workspace/livekun/frontend/node_modules/enhanced-resolve/lib/Resolver.js:739:5]
[at eval (eval at create (/Users/masudashusaku/workspace/livekun/frontend/node_modules/tapable/lib/HookCodeFactory.js:31:10), <anonymous>:15:1)]
[at /Users/masudashusaku/workspace/livekun/frontend/node_modules/enhanced-resolve/lib/Resolver.js:739:5]
[at eval (eval at create (/Users/masudashusaku/workspace/livekun/frontend/node_modules/tapable/lib/HookCodeFactory.js:31:10), <anonymous>:16:1)]
[at /Users/masudashusaku/workspace/livekun/frontend/node_modules/enhanced-resolve/lib/Resolver.js:739:5]
[at eval (eval at create (/Users/masudashusaku/workspace/livekun/frontend/node_modules/tapable/lib/HookCodeFactory.js:31:10), <anonymous>:15:1)]
[at /Users/masudashusaku/workspace/livekun/frontend/node_modules/enhanced-resolve/lib/Resolver.js:739:5]
[at eval (eval at create (/Users/masudashusaku/workspace/livekun/frontend/node_modules/tapable/lib/HookCodeFactory.js:31:10), <anonymous>:15:1)] {
details: "resolve 'tailwindcss' in '/Users/masudashusaku/workspace/livekun'\n" +
'  Parsed request is a module\n' +
'  No description file found in /Users/masudashusaku/workspace/livekun or above\n' +
'  resolve as module\n' +
"    /Users/masudashusaku/workspace/livekun/node_modules doesn't exist or is not a directory\n" +
"    /Users/masudashusaku/workspace/node_modules doesn't exist or is not a directory\n" +
"    /Users/masudashusaku/node_modules doesn't exist or is not a directory\n" +
"    /Users/node_modules doesn't exist or is not a directory\n" +
"    /node_modules doesn't exist or is not a directory"

バックエンド：
DB:postgresql(dockerで作成)
言語：node.js
FW:Nest.js

インフラ：
AWS
### タスク
-[x]フロント側のサイトを作成して
-[x]npm run devでアプリを立ち上げれるようにして
-[x] npm run devでエラーが出ているので修正して
-[x]バックエンド側も作成して


## 制約

