---
created-at: 2026-03-11 00:00:00
updated-at: 2026-03-11 02:00:00
---
#AI #Claude #plan

## 関連ファイル

- instructions-001.md
- frontend/ (Next.jsアプリケーション)
- backend/ (Nest.jsアプリケーション)
- docker-compose.yml (PostgreSQL)

## 計画

### 概要
ライブ参戦情報を記録・管理するWebアプリケーションのフロントエンド側をNext.js + TypeScriptで構築する。

### 構成

#### 技術スタック
- Next.js (App Router)
- TypeScript
- Node.js

#### 主要ページ
1. **トップページ (`/`)** - ライブ参戦記録一覧表示
2. **新規登録ページ (`/lives/new`)** - ライブ参戦情報の入力フォーム
3. **詳細ページ (`/lives/[id]`)** - ライブ参戦情報の詳細表示

#### 入力項目
- アーティスト名
- 公演日
- 会場場所
- ツアー名
- 写真アップロード（100枚以内、1枚100MBまで）
- 開始時間・終了時間
- 周辺施設情報（居酒屋、カフェ）
- Google Map情報
- 感想
- セトリ入力（MC・アンコール情報含む）

### バックエンド構成

#### 技術スタック
- Nest.js + TypeScript
- TypeORM (ORM)
- PostgreSQL (Docker)

#### API エンドポイント
| メソッド | パス | 内容 |
|---|---|---|
| GET | `/api/lives` | ライブ記録一覧取得 |
| GET | `/api/lives/:id` | ライブ記録詳細取得 |
| POST | `/api/lives` | ライブ記録作成 |
| PUT | `/api/lives/:id` | ライブ記録更新 |
| DELETE | `/api/lives/:id` | ライブ記録削除 |
| POST | `/api/lives/:id/photos` | 写真アップロード |

#### DB テーブル
- `lives` - ライブ記録本体
- `setlist_items` - セットリスト（livesに紐づく）
- `nearby_facilities` - 周辺施設（livesに紐づく）
- `photos` - 写真（livesに紐づく）

### 手順
1. Next.jsプロジェクトをfrontendディレクトリに作成（完了済）
2. ページコンポーネントを実装（完了済）
3. `npm run dev` で起動確認（完了済）
4. Docker ComposeでPostgreSQLを構築
5. Nest.jsプロジェクトをbackendディレクトリに作成
6. エンティティ・サービス・コントローラを実装
7. `npm run start:dev` で起動確認
