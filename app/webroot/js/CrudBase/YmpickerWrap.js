/**
 * 年月ピッカーのラッパークラス
 * 
 * @note
 * jquery.ui.ympicker.jsを拡張しています。
 */
class YmpickerWrap{
	
	/**
	 * 年月ダイアログを作成する関数
	 * 
	 * jquery.ui.ympicker.jsを拡張しています。
	 * 年月選択により月初日、月末日らのテキストボックスと連動できるようになっています。
	 *
	 * @param tb_ym_id 年月テキストボックスのID
	 * @param tb_m_start_id 月初日テキストボックスのID
	 * @param tb_m_ent_id 月末日テキストボックスのID
	 * 
	 * @date 2015-07-01 新規作成
	 * @date 2015-09-17 バグ修正
	 *
	 */
	tukishomatu(tb_ym_id,tb_m_start_id,tb_m_ent_id){



		//年月入力
		var op = {
			closeText: '閉じる',
			prevText: '&#x3c;前',
			nextText: '次&#x3e;',
			currentText: '今日',
			monthNames: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
			monthNamesShort: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
			dateFormat: 'yy/mm',
			yearSuffix: '年',
			onSelect:function(date, instance) {

				//月初日の作成と出力
				var d1=date + '/1';
				$('#' + tb_m_start_id).val(d1);

				//月末日の算出と出力
				var dt=new Date(d1);
				var last_d=new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
				var last_d=DateFormat(last_d, 'yyyy/mm/dd'); // 01月23日
				$('#' + tb_m_ent_id).val(last_d);

			}
		};

		//年月ダイアログを適用
		$('#' + tb_ym_id).ympicker(op);


		//年月をクリアしたら月初、月末もクリアする。
		$('#' + tb_ym_id).blur(function () {
		      var v = $('#' + tb_ym_id).val();
		      if(v =='' || v==null){
		    	  $('#' + tb_m_start_id).val('');
		    	  $('#' + tb_m_ent_id).val('');
		      }
		});

	}
}