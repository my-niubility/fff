/*
 * 静态页面渲染完之后加载数据
 */
var startTime,endTime;
//日期范围限制
var start = {
    elem: '#start',
    format: '',
    min: '1800-01-01',//laydate.now(), //设定最小日期为当前日期
    max: laydate.now(),//'2099-06-16', //最大日期
    istime: false,//是否开启时间选择
    istoday: true,//是否显示今天
    isclear: false,//是否显示清空
    issure: false, //是否显示确认
    choose: function(datas){
    	end.min = datas; //开始日选好后，重置结束日的最小日期
     	end.start = datas; //将结束日的初始值设定为开始日
    }
};

var end = {
    elem: '#end',
    format: 'YYYY-MM-DD',
    min: '1800-01-01',//laydate.now(),
    max: laydate.now(),//'2099-06-16',
    istime: false,//是否开启时间选择
    istoday: true,//是否显示今天
    isclear: false,//是否显示清空
    issure: false, //是否显示确认
    choose: function(datas){
    	start.max = datas; //结束日选好后，充值开始日的最大日期
    }
};
laydate(start);
laydate(end);

//获取充值记录
//查询总的记录数
//totalNum是总条数，num是总页数，count是每页显示几条，startIndex起始索引，endIndex最终索引，nowPage是当前页码,maxNum是最大页码数是5个
var totalNum,num,count=2,startIndex=endIndex=0,maxNum=5;
var nowPage = parseInt($("input[type='hidden']").attr("data-nowPage"));

/*
 * recentTime是筛选起始时间，nowTime是筛选终止时间，status是状态（在资金流水请求里是类型），httpUrl是请求路径
 */
function queryTotalNum(){
	var dataJson = {
		"custId":custId,
		"beginDate":recentTime,
		"endDate":nowTime
	};
	if(httpUrlCount.indexOf("queryfundCount")>-1){
		dataJson["type"] = status;
	}else{
		dataJson["status"] = status;
	}
	Utils.ajax({
		url:httpUrlCount,
		type:"post",
		data:dataJson,
		success:function(data,xml){
			if(data.meta.success){
				if(data.data){
					totalNum = parseInt(data.data);
					if(totalNum>0){
						$(".pagination").removeClass("none");
						if(totalNum>count){
							$(".pagination .fl i").text(totalNum);
							if(totalNum%count == 0){
								num = totalNum/count;
							}else if(totalNum%count < count){
								num = Math.floor(totalNum/count) + 1;
							}
							// 当总页数大于最大显示页码个数时，显示下一页按钮
							if(num > maxNum){
								$(".pagination a[title='下一页']").removeClass("none");
							}else{
								$(".pagination a[title='下一页']").addClass("none");
							}
							//当前页面是1时，不显示上一页按钮
							if(nowPage==1){
								$(".pagination a[title='上一页']").addClass("none");
							}
							$(".pagination a[title='最后一页']").text("共 "+num+" 页"); //总页码
							var page = num > maxNum?maxNum:num;
							var pageHtml = '';
							for(var j=0;j<page;j++){
								pageHtml += '<li '+(nowPage==j+1?"class=\"pagin_active\"":"")+'><a onclick="jump('+(j+1)+',this)" href="javascript:;">'+(j+1)+'</a></li>';
							}
							$(".pagination ul").html(pageHtml);
						}else{
							$(".pagination").addClass("none");
						}
						getOnepageRC();
					}else{
						$(".asset_wrap_con").html("<tr><td colspan='"+elLen+"'>暂无数据</td></tr>");
						$(".pagination").addClass("none");
					}
				}
			}else{
				//会话过期，返回登录页面
				if(data.meta.message.indexOf("请您先登录")>-1){
					location.href = "timeOut.html";
					return;
				}
				alert(data.meta.message);
			}
		}
	});
}
var lastNum = maxNum + 5;//每页显示的最后的一个页码数
var startNum = maxNum + 1;
// 分页跳转
function jump(now){
	nowPage = now;
	$(".pagination ul li").removeClass("pagin_active");
	var items = $(".pagination ul li");
	if(num > maxNum){ //总页数大于最大允许显示数目
		if(now > maxNum){ //当前页是最大页数时
			var pageHtml = '';
			if(lastNum <= num){
				if(nowPage == num){
//					startNum = lastNum - 1;
//					lastNum = nowPage;
					for(var j=startNum;j<=lastNum;j++){
						pageHtml += '<li '+(nowPage==j?"class=\"pagin_active\"":"")+'><a onclick="jump('+(j)+',this)" href="javascript:;">'+(j)+'</a></li>';
					}
				}else if(nowPage >= startNum){   //当前页在目前显示的范围内
					if(nowPage > lastNum){
						startNum = lastNum + 1;
						lastNum = ((lastNum + maxNum) > num ? num : (lastNum + maxNum));
					}
					for(var j=startNum;j<=lastNum;j++){
						pageHtml += '<li '+(nowPage==j?"class=\"pagin_active\"":"")+'><a onclick="jump('+(j)+',this)" href="javascript:;">'+(j)+'</a></li>';
					}
				}else{   //当前显示的开始页的上一页
					lastNum = nowPage;
					startNum = lastNum - maxNum + 1;
					for(var j=startNum;j<=lastNum;j++){
						pageHtml += '<li '+(nowPage==j?"class=\"pagin_active\"":"")+'><a onclick="jump('+(j)+',this)" href="javascript:;">'+(j)+'</a></li>';
					}
				}
			}else{
				for(var j=startNum;j<=num;j++){
					pageHtml += '<li '+(nowPage==j?"class=\"pagin_active\"":"")+'><a onclick="jump('+(j)+',this)" href="javascript:;">'+(j)+'</a></li>';
				}
			}
			$(".pagination ul").html(pageHtml);
		}else{
			var pageHtml = '';
			for(var j=0;j<maxNum;j++){
				pageHtml += '<li '+(nowPage==(j+1)?"class=\"pagin_active\"":"")+'><a onclick="jump('+(j+1)+',this)" href="javascript:;">'+(j+1)+'</a></li>';
			}
			$(".pagination ul").html(pageHtml);
		}
	}
	for(var i = 0;i<=items.length;i++){
		lastNum = maxNum;
		startNum = lastNum - maxNum + 1; 
		if(nowPage > maxNum){
			if(nowPage == (i+5)){
				$(items[i]).addClass("pagin_active");
			}
		}else{
			if(nowPage == (i+1)){
				$(items[i]).addClass("pagin_active");
			}
		}
	}
	// 当总页数大于最大显示页码个数时，显示上一页和下一页按钮
	if(num > maxNum){
		//当前页码大于1时，显示上一页按钮
		if(nowPage > 1){
			$(".pagination a[title='上一页']").removeClass("none");
		}else{
			$(".pagination a[title='上一页']").addClass("none");
		}
		if(nowPage >= num && lastNum == num){
			$(".pagination a[title='下一页']").addClass("none");
		}else{
			$(".pagination a[title='下一页']").removeClass("none");
		}
	}
	startIndex = (nowPage-1)*count;
	getOnepageRC();
}
//上一页
function prePage(){
	if(nowPage < 1){return;}
	nowPage = nowPage-1;
	jump(nowPage);
}
//下一页
function nextPage(){
	nowPage = nowPage+1;
	jump(nowPage);
}
//最后一页
function lastPage(){
	nowPage = num;
	jump(nowPage);
}
/*
 * 分页获取充值记录
 */
var elLen = $(".asset_wrap_tit tr td").length;
function getOnepageRC(){
	var dataJson = {
		"custId":custId,
		"beginDate":recentTime,
		"endDate":nowTime,
		"startIndex":startIndex,
		"recordNum":count
	};
	if(httpUrlCount.indexOf("queryfund")>-1){
		dataJson["type"] = status;
	}else{
		dataJson["status"] = status;
		dataJson["orderId"] = orderId;
	}
	Utils.ajax({
		url:httpUrlQuery,
		type:"post",
		data:dataJson,
		success:function(data,xml){
			if(data.meta.success){
				if(data.data){
					appendHtml(data.data);
				}else{
					$(".asset_wrap_con").html("<tr><td colspan='"+elLen+"'>暂无数据</td></tr>");
				}
			}else{
				//会话过期，返回登录页面
				if(data.meta.message.indexOf("请您先登录")>-1){
					location.href = "timeOut.html";
					return;
				}
				alert(data.meta.message);
			}
		}
	});
}

var nowDate = new Date();
var preDate = new Date();
preDate.setDate(preDate.getDate()-7);

//点击日期条件筛选
$("#dateFilter ul li a").live("click",function(e){
	nowPage = 1;
	startIndex = 0;
	startTime,endTime="";
	$("#start").val('');
	$("#end").val('');
	$("#dateFilter ul li a").removeClass("active")
	$(e.target).addClass("active");
	var dateFilter = $(this).attr("data-filter");
	if(dateFilter == "7days"){
		recentTime = preDate;
		nowTime = nowDate;
	}else{
		recentTime = "";
		nowTime = "";
	}
	var state = $("#statusFilter ul li a");
	for(var i=0;i<state.length;i++){
		if($(state[i]).hasClass("active")){
			status = $(state[i]).attr("data-filter");
		}
	}
	queryTotalNum(recentTime,nowTime,status);
});
//点击状态筛选
$("#statusFilter ul li a").live("click",function(e){
	nowPage = 1;
	startIndex = 0;
	$("#statusFilter ul li a").removeClass("active")
	$(e.target).addClass("active");
	status = $(this).attr("data-filter");
	var stateDate = $("#dateFilter ul li a");
	for(var i=0;i<stateDate.length;i++){
		if($(stateDate[i]).hasClass("active")){
			var dateFilter = $(stateDate[i]).attr("data-filter");
			if(dateFilter == "7days"){
				//7天前的时间
				recentTime = preDate;
				nowTime = nowDate;
			}else{
				if(!startTime && !endTime){
					recentTime = "";
					nowTime = "";
				}else{
					recentTime = startTime;
					nowTime = endTime;
				}
			}
		}
	}
	queryTotalNum(recentTime,nowTime,status);
});

//点击搜索
$(".btntwo").live("click",function(){
	startTime = $("#start").val();
	endTime = $("#end").val();
	if(!startTime){alert("请选择开始日期");return;}
	if(!endTime){alert("请选择结束日期");return;}
	startTime = new Date(startTime);
	startTime.setHours(00);
	startTime.setMinutes(00);
	startTime.setSeconds(00);
	endTime = new Date(endTime);
	endTime.setHours(23);
	endTime.setMinutes(59);
	endTime.setSeconds(59);
	var state = $("#statusFilter ul li a");
	for(var i=0;i<state.length;i++){
		if($(state[i]).hasClass("active")){
			status = $(state[i]).attr("data-filter");
		}
	}
	
	queryTotalNum(startTime,endTime,status);
});