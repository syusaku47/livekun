---
created-at: 2026-02-02 00:00:00
updated-at: 2026-02-02 00:00:00
---
#AI #Claude #plan

## 関連ファイル

- [[instructions-002]]

## 計画

1. OrderController.phpのresultメソッドを確認
   - resultメソッドがどのようにフォルダIDを返しているか確認
   - searchResultListメソッドの実装を調査

2. Order.phpのsearchResultListメソッドを確認
   - PPM連携結果フォルダ一覧取得のロジックを調査
   - isUseResultの判定処理を確認

3. categoryId=9(OLC_ORDER_SERVICE)の設定を確認
   - PurposeConst.phpでの定義を確認
   - 目的マスタデータの設定を確認

4. isUseResult=1の処理ロジックを調査
   - _getResultFormatColumnメソッドの実装を確認
   - isUseResultに基づくフォルダID選択ロジックを分析

5. 問題の原因を特定
   - なぜアップロードフォルダがレスポンスされるのか根本原因を特定
   - 修正箇所を明確化

6. 報告書の作成
   - 調査結果をreport-002.mdにまとめる
   - 修正箇所を明記

7. ../000の実施
   - instructions-000.mdに従ってindex.mdを更新
