
/**
 * カニ・通知ワーカー
 * 
 * カニ・通知ワーカーはカニテーブルの変更があった場合、リアルタイムで一覧を更新します。
 * 
 * キャッシュ関連のバグが稀に起こるため、バグが連続して起こらない限り、ワーカースレッドを停めないようにしています。
 * （たまに一度起こるバグではワーカースレッドは停まりません。）
 * 連続バグの許可は試行回数上限で設定できます。
 * 
 * ◇主なメソッド
 * - execution ワーカースレッドが定期的に呼び出すメソッド。
 * - init 初期化
 * 
 * @date 2015-11-24	新規作成
 * @author k-uehara
 */ 
var NotifiWoker =function(){

	//プロパティリスト
	this.props={
			'worker_name':'notifi_worker',//名称
			'wamei':'カニ・通知ワーカー',//和名
			'web_root':'/shch/',		//ホスト,Ajaxで利用する
			'work_counter':0,		//リロードカウンタ
			'work_counter_slc':'#wt_counter',	//リロードカウンター要素のセレクタ
			'error_slc':'#wt_error2',	//エラーメッセージ表示要素のセレクタ
			'debug_slc':'#wt_debug',	//デバッグ表示要素のセレクタ
			'debug_mode':0,			//デバッグモード   0:OFF  1:（未使用）   2:レベル2デバッグ
			'wt_status':0,			//ワーカースレッド状態 0:初回スレッドループ,  1:2回目以降のスレッドループ
			'last_dt':null,			//最終更新日時
			'try_limit':3,			//試行回数上限。エラーがあっても実行する回数。
			'try_counter':0,		//試行回数
			
			
	};



	/**
	 * 初期化
	 * @param プロパティリスト<object>
	 */
	this.init=function(param){
		
		$.extend(this.props, param);//マージ

	};
	


	/**
	 * ★タイマースレッドから定期的に呼び出すメソッド
	 * @param myself 自分自身のインスタンス
	 * @param errCallback			エラー時に実行するコールバック関数
	 * @param afterShowDataCallback	一覧表示後に実行するコールバック関数
	 * 
	 */
	this.execution=function(myself,errCallback,afterShowDataCallback){

		var data={
				'wt_status':this.props.wt_status,
				'last_dt':this.props.last_dt,
				};

		var json_str = JSON.stringify(data);//データをJSON文字列にする。

		var url=this.props.web_root + 'kani/' +  this.props.worker_name;

		//☆AJAX非同期通信
		$.ajax({
			type: "POST",
			url: url,
			data: "key1="+json_str,
			cache: false,
			dataType: "text",
			success: function(str_json, type) {
				
				var data;
				try{
					if(str_json=='unchanged'){
						//「変化なし」である場合
						
						myself.props.try_counter=0;//試行回数をリセット
						
					}else if(str_json=='error'){
						
						myself._errorEx(
								'システムエラー：' + myself.props.worker_name + ':送信パラメータの異常',
								str_json,errCallback);
						
					}else{
						
						try{
							var res=$.parseJSON(str_json);//パース
							//更新実施日時（最終窓口更新日時）を再セット
							var r_param=res.r_param;
							myself.props.last_dt=r_param.last_dt;

							//HTMLテーブル一覧にデータを表示
							var data=res.data;
							myself._showData(data);

							afterShowDataCallback();//一覧表示後に実行するコールバック関数

							myself.props.wt_status=1;//ワーカースレッド状態 0:初回スレッドループ,  1:2回目以降のスレッドループ
							
							//新レコードフラグが「新レコードあり」である場合、メッセージ等を表示する。
							if(r_param.new_record_flg==1){
								$('#check_new_record').show();
							}
							
							myself.props.try_counter=0;//試行回数をリセット
							
						}catch(e){
							
							myself._errorEx(
									'システムエラー：' + myself.props.worker_name + ':Ajaxレスポンスの異常',
									str_json,errCallback);

						}
					}
				}catch(e){
					
					myself._errorEx(
							'通信エラー0：' + myself.props.worker_name + ':の通信エラー<br>ログイン切れの可能性がありますので、再度ログインしてみてください。',
							str_json,errCallback);

				}
	

			},
			error: function(xmlHttpRequest, textStatus, errorThrown){
				
				myself._errorEx(
						'通信エラー：' + myself.props.wamei + ':の通信エラー<br>ログイン切れの可能性がありますので、再度ログインしてみてください。',
						xmlHttpRequest.responseText,errCallback);
				
			}
		});
		
		
	};
	
	
	//HTMLテーブル一覧にデータを表示
	this._showData=function(data){
		
		var kaniGroupJson = $('#kaniGroupJson').html();
		var	kaniGroupList = $.parseJSON(kaniGroupJson);

		var tbody='';
		for(var i in data){
			var ent =data[i];

			var kani_val=this._convNullNone(ent.kani_val);
			var delete_flg=this._convDeleteFlg(ent.delete_flg);
			var kani_group = kaniGroupList[ent.kani_group];
			
			var tr=
				"<tr>" +
				"<td>" + ent.id + "</td>" +

				"<td>" + kani_val + "</td>" +

				"<td>" + ent.kani_name + "</td>" +

				"<td>" + ent.kani_date + "</td>" +

				"<td>" + kani_group + "</td>" +

				"<td>" + ent.kani_dt + "</td>" +

				"<td>" + ent.note + "</td>" +

				"<td>" + delete_flg + "</td>" +

				"<td>" + ent.update_user + "</td>" +

				"<td>" + ent.ip_addr + "</td>" +

				"<td>" + ent.created + "</td>" +

				"<td>" + ent.modified + "</td>" +
				"</tr>";
			tbody += tr;
		}
		$('#kani_tbl tbody').html(tbody);
		
		
	};
	
	//0以外のnull系を空文字に変換する
	this._convNullNone=function(v){
		
		//空判定（0以外）
		if(v == null || v === '' || v === false	){
			v=0;
		}
		
		return v;
	}
	
	this._convDeleteFlg=function(v){

		var s='';
		if(v =='' || v==null){
			s="<span style='color:#14a38d;'>有効</span>";
		}else{
			s="<span style='color:#b4b4b4;'>無効</span>";
		}
		
		return s;
	}
	


	

	
	
	//リロードカウンターのインプリメントと表示。
	this._showWorkerCounter=function(){
		if(this.props.debug_mode == 2){
			this.props.work_counter++;
			$(this.props.work_counter_slc).html(this.props.work_counter);
		}
	};

	
	/**
	 * エラー表示
	 * @param errMsg ユーザーに通知するエラーメッセージ
	 * @param dump デバッグモードが2である場合に、画面表示する。主にダンプなどを指定する。
	 * @param エラーコールバック関数
	 */
	this._errorEx=function(errMsg,dump,errCallback){
		console.log(errMsg);
		$(this.props.error_slc).html(errMsg);
		
		// デバッグモードである場合のみ、dumpを出力
		if(this.props.debug_mode == 2){
			//console.log(dump);
			$(this.props.debug_slc).html(dump);
		}
		
		//試行回数が上限に達したら、エラーコールバックを呼び出す。
		this.props.try_counter++;//試行回数をインプリメント
		if(this.props.try_counter >= this.props.try_limit){
			errCallback('error',this.props.worker_name);//エラーコールバック関数を実行
			this.props.try_counter=0;//試行回数をリセット
		}
		
		
	};
	




};

