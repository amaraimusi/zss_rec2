<?php
App::uses('Model', 'Model');

/**
 * アプリケーションスコープのモデル
 * 
 * アプリケーションスコープをDBを利用して擬似的に実現しています。
 * 
 * @date 2015/10/21	新規作成
 * @author k-uehara
 *
 */
class AppScope extends Model {


	var $name='AppScope';
	
	/**
	 *  アプリケーションスコープテーブルからIDに紐づくエンティティを取得する。
	 *  アプリケーションスコープをDBを利用して擬似的に実現している。
	 * @param $id
	 * @return アプリケーションスコープエンティティ
	 */
	public function getEntById($id){

		//WHERE情報
		$conditions=array(
				"id = {$id}",
		);
		
		//オプション
		$option=array(
				'conditions'=>$conditions,
		);
		
		//DBから取得
		$data=$this->find('first',$option);
		
		$ent=array();
		if(!empty($data)){
			$ent=$data['AppScope'];
		}

		return $ent;
	}
	
	
	/**
	 * アプリケーションスコープテーブルから変数名または変数名配列を指定して、データセットを取得する。
	 * @param $var_names 変数名または変数名配列
	 * @return データセット(変数名=>値)
	 */
	public function getValue($var_names){


		//SELECT情報
		$fields=array(
				'var_name',
				'value1',
		);
		
		$cnd=null;
		if(is_array($var_names)){
			$j_str = "'".implode("','",$var_names)."'";
			$cnd = "var_name IN ({$j_str})";
		}else{
			$cnd = "var_name='{$var_names}'";
		}
		
		//WHERE情報
		$conditions=array($cnd);
		
		//オプション
		$option=array(
				'fields'=>$fields,
				'conditions'=>$conditions,
		);
		
		//DBから取得
		$data=$this->find('all',$option);
		
		if(!empty($data)){
			$data=Hash::combine($data, '{n}.AppScope.var_name','{n}.AppScope.value1');
		}
		
		return $data;
		
	}
	
	/**
	 * アプリケーションスコープテーブルから全データを取得する。
	 * @return データセット(変数名=>値)
	 */
	public function getAll(){

		//SELECT情報
		$fields=array(
				'var_name',
				'value1',
		);
		
		//オプション
		$option=array(
			'fields'=>$fields,
		);
		
		$data=$this->find('all',$option);//DBから取得
		
		if(!empty($data)){
			$data=Hash::combine($data, '{n}.AppScope.var_name','{n}.AppScope.value1');
		}
		
		return $data;
	}
	
	/**
	 * データセットをテーブルへ保存する。
	 * 
	 * @param  $values	データセット（getValueやgetAllで取得したデータの構造）
	 */
	public function saveValue($values){
		

		
		//SELECT情報
		$fields=array(
				'id',
				'var_name',
				'value1',
		);
		
		$keys=array_keys($values);
		$j_str = "'".implode("','",$keys)."'";
		$cnd = "var_name IN ({$j_str})";

		//WHERE情報
		$conditions=array($cnd);
		
		//オプション
		$option=array(
				'fields'=>$fields,
				'conditions'=>$conditions,
		);
		
		//DBから取得
		$data=$this->find('all',$option);
		
		foreach($data as $i=>$ent){
			$var_name=$ent['AppScope']['var_name'];
			$data[$i]['AppScope']['value1']=$values[$var_name];
		}

		$ret=$this->saveAll($data, array('atomic' => false,'validate'=>'false'));
		
		return $ret;
		
	}
	
	



}