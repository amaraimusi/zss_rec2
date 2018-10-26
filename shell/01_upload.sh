#!/bin/sh
echo 'ソースコードを差分アップロードします。'

rsync -auvz ../app amaraimusi@amaraimusi.sakura.ne.jp:www/zss_rec2
# rsync -auvz ../app/Console amaraimusi@amaraimusi.sakura.ne.jp:www/zss_rec2/app
# rsync -auvz ../app/Controller amaraimusi@amaraimusi.sakura.ne.jp:www/zss_rec2/app
# rsync -auvz ../app/Model amaraimusi@amaraimusi.sakura.ne.jp:www/zss_rec2/app
# rsync -auvz ../app/Vendor amaraimusi@amaraimusi.sakura.ne.jp:www/zss_rec2/app
# rsync -auvz ../app/View amaraimusi@amaraimusi.sakura.ne.jp:www/zss_rec2/app
# rsync -auvz ../app/webroot amaraimusi@amaraimusi.sakura.ne.jp:www/zss_rec2/app

echo "------------ 送信完了"
cmd /k