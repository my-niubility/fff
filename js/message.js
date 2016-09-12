//查询总的记录数
//totalNum是总条数，num是总页数，count是每页显示几条，startIndex起始索引，endIndex最终索引，nowPage是当前页码,maxNum是最大页码数是5个
var totalNum,num,count=4,startIndex=endIndex=0,maxNum=5,messageType="";
var nowPage = parseInt($("input[type='hidden']").attr("data-nowPage"));

var httpUrlCount = "/restful/message/count";
var httpUrlQuery = "/restful/message/queryAll";
var httpUrlUnreadCount = "/restful/message/unreadCount";
	$(function(){
		//查询消息总记录数，分页查询消息
		queryTotalNum(messageType);
		//查询消息未读个数
		var itag=$("#allmessage").children("i");
		queryUnreadCount(messageType,itag);
	});
	
	
	//点击消息类型(系统消息、业务消息)查询消息
	$(".message_thead ul li a").live("click",function(e){
		    //切换消息类型前先将显示内容清空
			var itag=$(this).children("i");
			messageType=$(e.target).data("filter");
			if(typeof messageType=="number"){
				messageType+="";
			}
			//查询消息总记录数，分页查询消息
			queryTotalNum(messageType);
			//查询消息未读个数
			queryUnreadCount(messageType,itag);
	});

	//删除消息
	$(".delete").live("click",function(e){
		var messageIds=new Array();//声明一个存放id的数组 
		$("input[name=id]").each(function (i,d){ 
			if (d.checked) { 
			messageIds.push(d.value); 
			} 
		}); 
		//隐藏弹出的确认框(div)
		$("#delconfirm").hide();
		Utils.ajax({
			url:"/restful/message/delete",
			type:"POST",
			data:{"custId":custId,"messageIds":messageIds},
			success:function(response, xml){
				// 此处放成功后执行的代码
				if(response.meta.success){
					var deleteCount=response.data;
					alert("删除成功，共删除"+deleteCount+"条信息");
					//删除成功刷新页面
					window.location.reload();

				}else{
					//会话过期，返回登录页面
					if(response.meta.message.indexOf("请您先登录")>-1){
						location.href = "timeOut.html";
						return;
					}
					alert(response.meta.message);
				}
			}
		});
	});


//显示消息体
	function messShow(el){
		var nextTr=$(el).parent().next("tr");
		if(nextTr.hasClass("none")){
			nextTr.removeClass("none");
			nextTr.css('color','red');
			var messageId=$(nextTr).attr("id");
			var messageIds=new Array();//声明一个存放id的数组 
			messageIds.push(messageId); 
			Utils.ajax({
				url:"/restful/message/read",
				type:"POST",
				data:{"custId":custId,"messageIds":messageIds},
				success:function(response, xml){
					// 此处放成功后执行的代码
					if(response.meta.success){
						//获取当前显示的i标签
						var itag=$(".unreadCount:visible");
						//查询该标签下消息未读个数
						queryUnreadCount(messageType,itag);
						var isreadstatus=$(el).next("td").html();
						if(isreadstatus=="未读"){
							$(el).next("td").html("已读").css('color','red');
						}

					}else{
						//会话过期，返回登录页面
						if(response.meta.message.indexOf("请您先登录")>-1){
							location.href = "timeOut.html";
							return;
						}
						alert(response.meta.message);
					}
				}
			});
		}else{
			nextTr.addClass("none");
		}
	}

	//批量设置消息为已读
	function asRead(){
		$("input[type='checkbox']").attr("checked","checked");
		var messageIds=new Array();//声明一个存放id的数组 
		$("input[name=id]").each(function (i,d){ 
			if (d.checked) { 
			messageIds.push(d.value); 
			} 
		}); 
		
		Utils.ajax({
			url:"/restful/message/read",
			type:"POST",
			data:{"custId":custId,"messageIds":messageIds},
			success:function(response, xml){
				// 此处放成功后执行的代码
				if(response.meta.success){
					var count=response.data;
					//if("0"!=$.trim(count))

					alert("消息标记已读成功");
					window.location.reload();
					
				}else{
					//会话过期，返回登录页面
					if(response.meta.message.indexOf("请您先登录")>-1){
						location.href = "timeOut.html";
						return;
					}
					//alert(response.meta.message);
				}
			}
		});

	}
	function cancelSel(){
		//$(".pop_up").removeClass("none");
		if($("input[name='id']:checked").length){
			$(".pop_up").removeClass("none");
			$(".confim").removeClass("none");
			$(".least_choose").addClass("none");
		}else{
			$(".confim").addClass("none");
			$(".least_choose").removeClass("none");
		}
	}
	$(".closeImg").live("click",function(){
		$(".pop_up").addClass("none");
	})
	$(".twoBtn a:last-child").live("click",function(){
		$(".pop_up").addClass("none");
		
	})



	
/*
 * recentTime是筛选起始时间，nowTime是筛选终止时间，status是状态（在资金流水请求里是类型），httpUrl是请求路径
 */
function queryTotalNum(messageType){
	var dataJson = {
		"custId":custId,
		"messageType":messageType
	};
	Utils.ajax({
		url:httpUrlCount,
		type:"post",
		data:dataJson,
		success:function(data,xml){
			if(data.meta.success){
				if(data.data){
					totalNum = parseInt(data.data);
					$(".count").html(totalNum);
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
							$(".pagination a[title='最后一页']").text("共"+num+"页"); //总页码
							var page = num > maxNum?maxNum:num;
							var pageHtml = '';
							for(var j=0;j<page;j++){
								pageHtml += '<li '+(nowPage==j+1?"class=\"pagin_active\"":"")+'><a onclick="jump('+(j+1)+',this)" href="javascript:;">'+(j+1)+'</a></li>';
							}
							$(".pagination ul").html(pageHtml);
						}else{
							$(".pagination").addClass("none");
						}
						//获取分页数据
						getOnepageRC(messageType);
					}else{
						$(".asset_wrap_con").html("<tr><td colspan='7'>暂无数据</td></tr>");
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
	getOnepageRC(messageType);
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
//var elLen = $(".asset_wrap_tit tr td").length;
function getOnepageRC(messageType){
	var dataJson = {
		"custId":custId,
		"messageType":messageType,
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
					//appendHtml(data.data);
					var mdata=data.data.messageResDtos;
					if(mdata !=null&&mdata.length>0){
						$(".asset_wrap_con").html("");
						 //var telp ='<tr>' + $(".asset_wrap_con > tr").html()+'</tr>';
						 var telp = "<tr id='baseTr'>"+
									"<th width='13'>"+"<input name='ids' id='inputids' type='checkbox' class='checkBox' />"+'</th>'+
									'<th>类型</th>'+
									'<th>标题</th>'+
									'<th>状态</th>'+
									'<th>时间</th>'+
								    '</tr>'

							var messageType,title,content,createTime,isreadstatus;
							for(var i = 0;i<mdata.length;i++){
								messageType = mdata[i].messageType;
								title = mdata[i].title;
								content=mdata[i].content;
								createTime=mdata[i].createTime;
								id=mdata[i].id;
								switch(mdata[i].messageType){
									case "0":
										messageType="系统消息";
										break;
									case "1":
										messageType="业务消息";
										break;
								}
								switch(mdata[i].isreadstatus){
									case "0":
										isreadstatus="未读";
										telp += '<tr class="">'+
										"<td class='nobor'>"+"<input name='id'  type='checkbox' class='checkBox' value='"+id+"' />"+'</td>'+
										'<td>'+messageType+'</td>'+
										"<td style='text-decoration:underline;'onclick='messShow(this);'>"+title+'</td>'+
										'<td>'+isreadstatus+'</td>'+
										'<td>'+createTime+'</td>'+
										'</tr>'+
										"<tr class='clearfix none' id='"+id+"'>"+"<td colspan='"+5+"'>"+content+'</td>'+'</tr>';
										break;
									case "1":
										isreadstatus="已读";
										//telp += "<tr class='"+font_e60012+"'>"+
										telp += '<tr class="">'+
										"<td class='nobor'>"+"<input name='id' type='checkbox' class='checkBox' value='"+id+"' />"+'</td>'+
										'<td>'+messageType+'</td>'+
										"<td style='text-decoration:underline;'onclick='messShow(this);'>"+title+'</td>'+
										//'<td>'+isreadstatus+'</td>'+
										"<td style='color:red;'>"+isreadstatus+'</td>'+
										'<td>'+createTime+'</td>'+
										'</tr>'+
										"<tr class='clearfix none' id='"+id+"'>"+"<td colspan='"+5+"'>"+content+'</td>'+'</tr>';
										break;
								}
								/*telp += '<tr class="">'+
									"<td class='nobor'>"+"<input name='id' type='checkbox' class='checkBox' value='"+id+"' />"+'</td>'+
									'<td>'+messageType+'</td>'+
									"<td onclick='messShow(this);'>"+title+'</td>'+
									'<td>'+isreadstatus+'</td>'+
									'<td>'+createTime+'</td>'+
								    '</tr>'+
									"<tr class='clearfix none' id='"+id+"'>"+"<td colspan='"+5+"'>"+content+'</td>'+'</tr>';*/
							}
							//alert(telp);
							$(".asset_wrap_con").html(telp);
					}else{
						$(".asset_wrap_con").html("<tr><td colspan='5'>暂无数据</td></tr>");
					}
					
				}else{
					$(".asset_wrap_con").html("<tr><td colspan='5'>暂无数据</td></tr>");
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
//获取未读消息个数
function queryUnreadCount(messageType,itag){
	var dataJson = {
			"custId":custId,
			"messageType":messageType
		};
	Utils.ajax({
		url:httpUrlUnreadCount,
		type:"POST",
		data:dataJson,
		success:function(response, xml){
			// 此处放成功后执行的代码
			if(response.meta.success){
				var unreadCount=response.data;
				$(".unreadCount").html("");
				itag.css("display","inline-block"); 
				itag.html("("+unreadCount+")");
			}else{
				//会话过期，返回登录页面
				if(response.meta.message.indexOf("请您先登录")>-1){
					location.href = "timeOut.html";
					return;
				}
				//alert(response.meta.message);
			}
		}
	});

//全选全不选
	$("#inputids").live("click",function(e){
		if($(this).attr("checked")){
			
			$("[name = id]:checkbox").attr("checked", true);
		}else{
			$("[name = id]:checkbox").attr("checked", false);
		}
	});
//某一个没有选中取消全选
$("[name = id]:checkbox").live("click",function(e){
	if($("[name = id]:checkbox").length == ($("[name = id]:checked").length )){
		$("#inputids").attr("checked",true);
	}else{
		$("#inputids").attr("checked",false);
	}


		
   });

}