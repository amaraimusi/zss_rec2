#!/bin/sh

echo 'バックアップファイルをダウンロードします。(sqlファイルのダウンロード）'
scp amaraimusi@amaraimusi.sakura.ne.jp:www/zss_rec2/shell/zss_rec2.sql zss_rec2.sql

echo "処理終了"
cmd /k