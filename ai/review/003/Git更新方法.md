# Git更新方法

## ステージング更新方法

### 手順

1. deploy/stg4ブランチにdevelop4-fy25の内容を反映
   ```bash
   git checkout deploy/stg4
   git reset --hard develop4-fy25
   git push origin deploy/stg4
   ```

2. APIの向き先を修正
   - ppm-cloud-apiに移動
   - frontフォルダの中身を修正
   - env.staging.jsonの内容をそのままenv.jsonにコピー

3. 変更をコミット・プッシュ
   ```bash
   # deploy/stg4ブランチでコミット
   git add .
   git commit -m "Update API endpoint configuration for stg4"
   git push origin deploy/stg4
   ```
