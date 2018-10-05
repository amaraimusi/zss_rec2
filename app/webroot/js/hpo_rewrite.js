/**
 *
 * hosp.pref.okinawa.jp
 * DBデータを指定IDのセクションへ書込み
 * ★履歴
 * 2015-7-22 新規作成
 *
 *
 */


/**
 * セクション書き換え
 * class=hpo_rewriteとなっている要素の内容を、DBデータの情報に書き換える。
 *
 */
function hpo_rewriting(page_code){



	var re_data={};//書換要素データ（rewrite element data）

	//	書換対象の要素分だけループ（class=hpo_rewriteのセレクタをループ）
	 $(".hpo_rewrite").each(function (index, elm) {

		// セクションからパラメータを取得
		 var id=$(elm).attr('id');
		 var hpo_rewrite_type=$(elm).attr('hpo_rewrite_type');
		 var hpo_list_style=$(elm).attr('hpo_list_style');
		 var hpo_limit=$(elm).attr('hpo_limit');
		 var hpo_page_no=$(elm).attr('hpo_page_no');

		 var ent={
			'h_id':id,
			'hpo_rewrite_type':hpo_rewrite_type,
			'hpo_list_style':hpo_list_style,
			'hpo_limit':hpo_limit,
			'hpo_page_no':hpo_page_no,
		 }



		 re_data[index]=ent;


	});


	// 送信データに書換要素データと画面コードをセットする。
	var data={};
	data['re_data']=re_data;
	data['page_code']=page_code;

	var json_str = JSON.stringify(data);//データをJSON文字列にする。

	var url='sample1.php';

	//サンプルデータ
	var ary=new Array();
	ary[0]=json_str;

	var url=getHpoUrl();// Ajax通信先のURLを取得。（環境ごと異なる)

	//★Ajax通信。配列を非同期通信POSTで送る。
	$.post(
	url ,
	{"ary" : ary} ,
		function(str_json){//Ajax通信のコールバック

			$("#test").html(str_json);//■■■□□□■■■□□□■■■□□□

			var data=$.parseJSON(str_json);//レスポンスデータをJSONデコードしてテキストデータを取得する。

			//テキストデータの件数分、処理を繰り返す。
			for(id in data){
				try{
					var text=data[id];//テキストを取得

					text=sanitaize_decode(text);

					//ID名に紐づくセレクタに、テキストをセット
					$("#" + id).html(text);

				}catch(e){
					console.log(e);
				}

			}


		}
	).error(
		function() {//PHP側で何らかのバグ発生。存在しないURLを指定したりすると発生。

		alert('サーバーサイドのエラー');
	});



}

//サニタイズ解除
function sanitaize_decode(str){
	return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&#039;/g, '\'').replace(/&amp;/g, '&');
}
sanitaize = {
		  encode : function (str) {
		    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
		  },

		  decode : function (str) {

			var str2=str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&#039;/g, '\'').replace(/&amp;/g, '&');
			console.log(str2);//■■■□□□■■■□□□■■■□□□)
		    return str2;
		  }
		};

//Ajax通信先のURLを取得。（環境ごと異なる)
function getHpoUrl(){

	//現在環境のドメインを取得
	var domain=location.href.split('/')[2];

	var url="http://www.hosp.pref.okinawa.jp/admin/rewrite/ajax";

	//ローカル開発環境
	if(domain=='localhost'){
		url="/hpo/rewrite/ajax";
	}

	//デモ用環境
	else if(domain=='192.168.11.199'){
		url="/hpo/rewrite/ajax";
	}
	return url;
}

