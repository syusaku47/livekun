---
created-at: 2026-02-16 12:30:00
updated-at: 2026-02-16 12:30:00
---
#AI #Claude #plan

## 関連ファイル

- [[instructions-003]]
- [[PPM_CLOUD-4244]]

## 計画

1. center.phpのordersエンドポイントを確認
   - ppm-cloud-api/server/config/center.php の設定を確認
   - エンドポイント: '/api/v1/orders' を特定

2. /api/v1/orders にアクセスしているAPIを調査
   - CenterServerAccessService::getOrder() の実装を確認
   - CloudFolder\CenterServerAccessService::getOrder() の実装を確認
   - これらのメソッドを呼び出している箇所を特定

3. 店舗番号(kijshopCd)によるリクエストの分類
   - 各APIのリクエストパラメータを確認
   - kijshopCdをパラメータに含むリクエストと含まないリクエストを分類
   - 一覧にまとめる

4. 報告書の作成
   - 調査結果を report-003.md にまとめる
   - APIの一覧と分類を記載

5. ../000 の実施
   - instructions-000.md に従って index.md を更新
