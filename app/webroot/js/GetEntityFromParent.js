/**
 * GetEntityFromParent.js
 * 親要素からフィールドリストを指定してエンティティを取得する。 
 * 
 * @note
 * 子要素や孫要素など親要素の下位要素からフィールドを指定してエンティティの値を取得する。
 * フィールドが指し示すものは、下位要素のname属性またはclass属性である。
 * 
 * 下位要素は、DIV,SELECT,INPUTなど数種に対応している。
 * 
 * @version 1.0
 * @date 2016-11-18
 */

var GetEntityFromParent =function(){
	
	
	
	var myself=this; // Instance of myself.

	/**
	 * initialized.
	 */
	this.constract=function(){
		

	};
	

	
	/**
	 * 親要素からフィールドリストを指定して、エンティティを取得する
	 *  @param parElm 親要素
	 *  @param fields フィールドリスト<Array>
	 *  @return エンティティ
	 */
	this.getEntity = function(parElm,fields){
		
		
		
		var ent = {}; // エンティティ
		
		for(var i in fields){
			
			var f = fields[i];
	
			// name属性またはclass属性を指定して値要素を取得する。
			var valueElm = getValueElm(parElm,f);
			

			// 値要素が取得できなければcontinueする。
			if(valueElm[0]==undefined){
				continue;
			}
			
			
			// 値要素のタグ名を取得する
			var tagName = valueElm.get(0).tagName; 

			// 値を取得する
			var v = null;
			if(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA'){
				
				// type属性を取得する
				var typ = valueElm.attr('type');
				
				if(typ=='file'){

					// アップロードファイル系である場合、ひもづいているlabel要素から値を取得する。
					v = getValFromLabel(parElm,f);

				}
				
				else if(typ=='checkbox'){
					v = 0;
					if(valueElm.prop('checked')){
						v = 1;
					}
					
				}
				
				else if(typ=='radio'){
					var opElm = parElm.find("[name='" + f + "']:checked");
					v = 0;
					if(opElm[0]){
						v = opElm.val();
					}
		
				}
				
				else{
					v = valueElm.val();
					
				}
			}
			
			// IMGタグへのセット
			else if(tagName == 'IMG'){
				
				//IMG系である場合、ひもづいているlabel要素から値を取得する。
				v = getValFromLabel(parElm,f);

			}
			
			else{
				v = valueElm.html();
			}
			
			ent[f] = v;

		}


		return ent;
	};
	
	
	/**
	 * HTMLテーブル要素から、フィールドリストを指定してデータを取得する
	 * @param tblElm HTMLテーブル要素<jquery object>
	 * @param fields フィールドリスト <Array>
	 * @return データ <Array>
	 */
	this.getDataFromHTbl = function(tblElm,fields){
		
		var data = [];
		
		var trs = tblElm.find('tbody tr');
		
		trs.each(function(){
			var tr = $(this);
			var ent = myself.getEntity(tr,fields);
			data.push(ent);
		});
		
		return data;
		
	};
	
	
	/**
	 * フィールド名から親要素内をname属性またはclass属性で探し、該当する要素を値要素として取得する
	 * 
	 * @param parElm 親要素
	 * @param feild フィールド名（name属性またはclass属性）
	 * @return jquery_object 値要素
	 */
	function getValueElm(parElm,feild){
		
		
		var valueElm = parElm.find("[name='" + feild + "']");
		if(valueElm[0]==undefined){
			valueElm = parElm.find('.' + feild);
		}
		return valueElm;
	};
	
	
	/**
	 * フィールドを指定してlabel要素から値を取得する
	 * @param parElm フォーム要素オブジェクト
	 * @param field フィールド名
	 * @return labelから取得した値
	 */
	function getValFromLabel(parElm,field){
		var v = null;
		var label = parElm.find("[for='" + field + "']");
		if(label[0]){
			v = label.html();
		}
		
		return v;
				
	};

	
	
	
	// call constractor method.
	this.constract();
};