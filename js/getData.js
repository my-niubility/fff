/*
 * 静态页面渲染完之后加载数据
 */
//查询总的记录数
//totalNum是总条数，num是总页数，count是每页显示几条，startIndex起始索引，endIndex最终索引，nowPage是当前页码,maxNum是最大页码数是5个
var totalNum,num,count=5,startIndex=endIndex=0,maxNum=5;
var nowPage = parseInt($("input[type='hidden']").attr("data-nowPage"));
function queryTotalNum(productType,unitCostMin,unitCostMax,expectEarnRateMin,expectEarnRateMax,lockPeriodMin,lockPeriodMax,orderFlag,orderColumn){
	var dataJson = {
		"productType":productType,
		"unitCostMinY":unitCostMin,
		"unitCostMaxY":unitCostMax,
		"expectEarnRateMin":expectEarnRateMin,
		"expectEarnRateMax":expectEarnRateMax,
		"bLockPeriodMin":lockPeriodMin,
		"bLockPeriodMax":lockPeriodMax
	};
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
						getOnepageRC(productType,unitCostMin,unitCostMax,expectEarnRateMin,expectEarnRateMax,lockPeriodMin,lockPeriodMax,orderFlag,orderColumn);
					}else{
						$(".newProduct dl").html("<dd style='text-align:center;color:#666'>暂无数据</dd>");
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
		if(nowPage > maxNum){ //当前页是最大页数时
			var pageHtml = '';
			if(lastNum <= num){
				if(nowPage == num){
					lastNum = nowPage;
					startNum = lastNum - maxNum + 1;
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
		if(nowPage >= num || lastNum == num){
			$(".pagination a[title='下一页']").addClass("none");
		}else{
			$(".pagination a[title='下一页']").removeClass("none");
		}
	}
	startIndex = (nowPage-1)*count;
	getOnepageRC(productType,unitCostMin,unitCostMax,expectEarnRateMin,expectEarnRateMax,lockPeriodMin,lockPeriodMax,orderFlag,orderColumn);
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
function getOnepageRC(productType,unitCostMin,unitCostMax,expectEarnRateMin,expectEarnRateMax,lockPeriodMin,lockPeriodMax,orderFlag,orderColumn){
	var dataJson = {
		"productType":productType,
		"unitCostMinY":unitCostMin,
		"unitCostMaxY":unitCostMax,
		"expectEarnRateMin":expectEarnRateMin,
		"expectEarnRateMax":expectEarnRateMax,
		"bLockPeriodMin":lockPeriodMin,
		"blockPeriodMax":lockPeriodMax,
		"orderFlag":orderFlag,
		"orderColumn":orderColumn,
		"startIndex":startIndex,
		"recordNum":count
	};
	Utils.ajax({
		url:httpUrlQuery,
		type:"post",
		data:dataJson,
		success:function(data,xml){
			if(data.meta.success){
				if(data.data){
					appendHtml(data.data);
				}else{
					$(".newProduct dl").html("<dd style='text-align:center;color:#666'>暂无数据</dd>");
					$(".pagination").addClass("none");
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
//点击产品类型筛选
//$(".product-wrap ul li:nth-child(1) a").live("click",function(e){
//	nowPage = 1;
//	startIndex = 0;
//	$(".product-wrap ul li:nth-child(1) a").removeClass("active");
//	$(e.target).addClass("active");
//	screen();
//});
//点击产品单价筛选
$(".product-wrap ul li:nth-child(1) a").live("click",function(e){
	nowPage = 1;
	startIndex = 0;
	$(".product-wrap ul li:nth-child(1) a").removeClass("active");
	$(e.target).addClass("active");
	screen();
});
//点击年化收益筛选
$(".product-wrap ul li:nth-child(2) a").live("click",function(e){
	nowPage = 1;
	startIndex = 0;
	$(".product-wrap ul li:nth-child(2) a").removeClass("active");
	$(e.target).addClass("active");
	screen();
});
//点击锁定期限筛选
$(".product-wrap ul li:nth-child(3) a").live("click",function(e){
	nowPage = 1;
	startIndex = 0;
	$(".product-wrap ul li:nth-child(3) a").removeClass("active");
	$(e.target).addClass("active");
	screen();
});
//点击排序
$(".newProduct p a").live("click",function(e){
	nowPage = 1;
	startIndex = 0;
	$(".newProduct p a").removeClass("active");
	$(e.target).addClass("active");
	if($(e.target).children("input").attr("checked")){
		$(e.target).children("input").removeAttr("checked");
	}else{
		$(e.target).children("input").attr("checked","checked");
	}
	screen();
});
//选中的条件
function screen(){
	var unitCost = $(".product-wrap ul li:nth-child(1) a");
	var expectearnrate = $(".product-wrap ul li:nth-child(2) a");
	var lockperiod = $(".product-wrap ul li:nth-child(3) a");
	for(var i=0;i<unitCost.length;i++){
		if($(unitCost[i]).hasClass("active")){
			unitCostMin=$(unitCost[i]).data("unitcostmin");
			unitCostMax=$(unitCost[i]).data("unitcostmax");
		}
	}
	for(var i=0;i<expectearnrate.length;i++){
		if($(expectearnrate[i]).hasClass("active")){
			expectEarnRateMin=$(expectearnrate[i]).data("expectearnratemin");
			expectEarnRateMax=$(expectearnrate[i]).data("expectearnratemax");
		}
	}
	for(var i=0;i<lockperiod.length;i++){
		if($(lockperiod[i]).hasClass("active")){
			lockPeriodMin=$(lockperiod[i]).data("lockperiodmin");
			lockPeriodMax=$(lockperiod[i]).data("lockperiodmax");
		}
	}
	var els = $(".newProduct p a");
	for(var i=0;i<els.length;i++){
		if($(els[i]).hasClass("active")){
			orderColumn=$(els[i]).data("ordercolumn");
			if($($(els[i]).children("input")).attr("checked")){
				orderFlag = "0";
			}else{
				orderFlag = "1";
			}
		}
	}
	queryTotalNum(productType,unitCostMin,unitCostMax,expectEarnRateMin,expectEarnRateMax,lockPeriodMin,lockPeriodMax,orderFlag,orderColumn);
}
