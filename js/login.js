var custId = sessionStorage.getItem("custId");
var userName,nickName,isBindCard,isPassIdentify,isSetTradePwd;//用户名，昵称,是否绑卡,是否认证,是否设置交易密码
//此功能用来实现,登录之后页面的头部变化   注：登录、注册、忘记密码、注册协议页面不能调用
$(function(){
	if(custId){
			Utils.ajax({
				url:"/restful/custinfo/baseinfo/query",
				type:"post",
				data:{"custId":custId},
				success:function(data,xml){
					if(data.meta.success){
						userName = data.data.userName;
						nickName = data.data.nickname;
						isPassIdentify = data.data.isPassIdentify;
						isBindCard = data.data.isBindCard;
						isSetTradePwd = data.data.isSetTradePwd;
						var str = '<a>您好，'+(nickName&&nickName!="null"&&nickName!=""?nickName:userName)+'</a>|'+
					        	'<a href="myAsset.html">会员中心</a>|'+
					        	'<a href="javascript:;">退出登录</a>|'+
					            '<a href="newBie.html">新手指南</a>|'+
					        	'<a href="comProblem.html">常见问题</a>';
						$(".top p").html(str);
						if(nickName&&nickName!="null"&&nickName!=""){
							$(".personInfo i").html(nickName + ", ");
						}else if(userName){
							$(".personInfo i").html(userName + ", ");
						}else{
							$(".personInfo i").html("");
						}
					}else{
						if(data.meta.message.indexOf("未登录")>-1){
							localStorage.clear();
							sessionStorage.clear();
							location.href = "login.html";
						}
						alert(data.meta.message);
					}
				}
			})
		}
		$(".top a[href='javascript:;']").live("click",function(){
		//		退出登录
			Utils.ajax({
		        url: "/restful/user/logout",              //请求地址
		        type: "POST",                       			   //请求方式
		        data: {"custId":custId,"mobile":userName},         				   //请求参数
		        success: function (response, xml) {
		            // 此处放成功后执行的代码
		            if(response.meta.success){
		            	alert("退出成功");
	            		localStorage.clear();
	            		sessionStorage.clear();
						location.href = "login.html";
		            }else{
		            	alert(response.meta.message);
		            }
		        }
		    });
		})
})