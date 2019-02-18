

$(function() {
	init();//初期化
});

var crudBase;//AjaxによるCRUD

/**
 *  フロント画面A専用のJavaScript
 * 
 * @version 1.0.0
 * @date 2019-1-25
 * @author k-uehara
 */
function init(){
	
	
	// 検索条件情報を取得する
	var kjs_json = jQuery('#kjs_json').val();
	var kjs = jQuery.parseJSON(kjs_json);
	
	//AjaxによるCRUD
	crudBase = new CrudBase({
			'src_code':'bukken', // 画面コード（スネーク記法)
			'kjs':kjs,
		});
	
	showPhoto(); // 写真表示
	
	// ▼ Google翻訳API・キャッシュ機能拡張 | 初期化
	var entXids = getEntXids(); // エンティティID属性リストを取得する
	var page_code = 'akiya_bukken_front_a1'; // ページコード：画面毎に異なる一意の任意文字列を指定 （別の画面で使われているページコードを指定すると競合問題が発生します）
	crudBase.initCbGtaCash(page_code, entXids); // Google翻訳API・キャッシュ機能拡張

}

/**
 * エンティティID属性リストを取得する
 */
function getEntXids(){
	
	var entXids = []; // エンティティID属性リスト
	jQuery('.entity').each((i, elm)=>{
		var entElm = jQuery(elm);
		var xid = entElm.attr('id');
		entXids.push(xid);
	});
	return entXids;
}



/**
 * 検索条件をリセット
 * 
 * すべての検索条件入力フォームの値をデフォルトに戻します。
 * リセット対象外を指定することも可能です。
 * @param array exempts リセット対象外フィールド配列（省略可）
 */
function resetKjs(exempts){
	
	crudBase.resetKjs(exempts);
	
}




/**
 * 検索実行
 */
function searchKjs(){
	crudBase.searchKjs();
}


/**
 * 写真表示
 */
function showPhoto(){

	jQuery('.entity_ex').each((i, entElm) =>{
		
		// 埋込JSONをパースしてエンティティを取得する
		entElm = jQuery(entElm);
		var xml_text = entElm.find("[name='xml_text']").val();
		var ent = JSON.parse(xml_text); // エンティティ
		
		// 画像データを取得する
		var imageData = ent.image;
		if(imageData == null) return;
		
		var keys = Object.keys(imageData);
		if(keys.length == 0) return;
		
		var imageData2;
		var first_key = keys[0];
		if(first_key == 0){
			imageData2 = imageData;
		}else{
			imageData2 = [imageData];
		}

		// ▼ 画像を表示する
		var img_html = "<div class='grid'>";
		for(var img_i in imageData2){
			var imgEnt = imageData2[img_i];
			var imgfile_url = imgEnt.imgfile_url; // 画像URL
			var imgfile_thumurl = imgEnt.imgfile_thumurl; // サムネイルURL
			
			if(imgfile_thumurl == null) imgfile_thumurl = imgfile_url;
			if(imgfile_thumurl == null) continue;
			
			img_html += "<a href='" + imgfile_url + "' target='blank'>" +
				"<img src='" + imgfile_thumurl + "' style='width:240px;height:200px' /></a>";

		}
		img_html += "</div>";
				
		var imgDiv = entElm.find('.img_div');
		imgDiv.append(img_html);
		
		
	});
	
}


