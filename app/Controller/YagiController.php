<?php


/**
 * ヤギAJAXサンプル
 * ★履歴
 * 2015/11/12	新規作成
 * @author k-uehara
 */
class YagiController extends AppController {

	//▽設定 Cake PHP
	public $name = 'Yagi';


    
	public function index() {
		
	}

    /**
     * ヤギAjax   | Ajax
     * @return string jsonレスポンス
     */
    public function yagi_action(){
    	
    	App::uses('Sanitize', 'Utility');
    	
    	$this->autoRender = false;//ビュー(ctp)を使わない。
    	
    	
    	$json_param=$_POST['key1'];
    	$json_param=str_replace('\\','',$json_param);
		
    	$param=json_decode($json_param,true);//JSON文字を配列に戻す
    	 
    	//窓口IDの数値バリデーション
    	if(empty($param['yagi_id']) || !is_numeric($param['yagi_id'])){
    		return false;
    	}
    	
    	$data=array(
    		array('id'=>4,'yagi_name'=>'ヒージャー','yagi_date'=>'2015-11-1'),
    		array('id'=>5,'yagi_name'=>'カシミア','yagi_date'=>'2015-11-2'),
    		array('id'=>6,'yagi_name'=>'トカラ山羊','yagi_date'=>'2015-11-3'),
    		array('id'=>7,'yagi_name'=>'<span>アンゴラヤギ</span>','yagi_date'=>'2015-11-4'),
    	);
    	
    	//サニタイズ（XSS対策）
    	$data=Sanitize::clean($data, array('encode' => true));
    	
    	$res_flg='success';
    	
    	$res=array(
    		'data'=>$data,
    		'res_flg'=>$res_flg,
    		);
    	
    	
    	$json=json_encode($res);//JSONに変換
    	
    	return $json;
    }

}