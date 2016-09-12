//提示框,参数cot为提示内容
function alerts(cot){ 
	  $(".alert_cont").text(cot);
	  layer.open({
		  type: 1,
		  title:  ['提示', 'border-bottom: 1px solid #ddd;padding: 20px 20px;font-size: 16px;color: #666;'],
		  area: ['400px', '230px'], //宽高
		  content: $(".alert_box")
	  });
};
//模态窗口，cot为提示内容
function motai(cot){ 
	  $(".motai_cont").text(cot);
	  layer.open({
		  type: 1,
		  title:  ['提示', 'border-bottom: 1px solid #ddd;padding: 20px 20px;font-size: 16px;color: #666;'],
		  area: ['400px', '230px'], //宽高
		  content: $(".motai_box")
	  });
}