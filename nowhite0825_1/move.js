// JavaScript Document
 /************************************************************  
    * JS别踩白块儿业务延伸----消灭化妆品 
    * 作者:武宁
	* 所属部门：技术部应用开发中心时尚娱乐组 
    * 公司：凤凰新媒体
	* 日期：2014-8-15
    *************************************************************/   
      
    /************************************************************      
    *  文档说明
	*  编码：utf-8版本   
    *  start()界面登陆窗口
    *  init()初始化图形界面
	*  newrow()创建新行
	*  deleterow()删除单元格
    *  newcell()创建新单元格
    *  newclass()微信航中每个单元格设置css属性
    *  move()移动
    *  isPass()判断单元格是否被击中或是否通过bottom
    *  fail()失败
    *  score()计分
    *  
    *  注：本文档为引用任何框架，利用js Dom编写，数据传输通过Ajax 
    *    
    *    
    *    
    */
//alert(id);  

var sspeed = 5;
var speed = sspeed;
var clock = null;
var state = 1;
var cellid = 1;
document.write("<script src='scroll.v.1.2.js'></script>");
var	Cellwidthpx = 0;
var Cellwidth = 0;

function Begin(){
if(state == 1){
	var sta = document.getElementById('start').ontouchstart = function(){
		cellid = id;
		document.getElementById('wbegin').style.display = "none";
		init();
	}
  }
	
	var first = document.getElementById('main').ontouchstart = function(ev){
		if(ev.target.className.indexOf('Ce') == -1){
		}else{
			start();
			isPass(ev);
		}
}
}
function start(){
	state ++;
	clock = window.setInterval('move()',20);
	document.getElementById('main').ontouchstart = function (ev){
		isPass(ev);
		ev.preventDefault();
		ev.stopPropagation();
	};
	document.getElementById('main').ontouchmove = function (ev){
		ev.preventDefault(); 
		ev.stopPropagation();
	};	
}
function init(){
	CellWidth();
	for(var i=0;i<6;i++){
		newrow();
	}
}

function newcell(className){
	var div = document.createElement('div');
	div.className = className;
	return div;
}

function CellWidth(){
	Cellwidth = cellwidth * (-1);
	Cellwidthpx = Cellwidth + 'px';
	document.getElementById('container').style.top = Cellwidthpx;//alert(document.getElementById('container').style.top);
}
function newclass(){
	var arr = ['cell','cell','cell','cell'];
	var i = Math.floor(Math.random()* 4);
	if(cellid == 6){
		arr[i] = "cell Ce1";
	}else if(cellid == 1){
	arr[i] = "cell Ce2";
	}else if(cellid == 2){
	arr[i] = "cell Ce3";
	}else if(cellid == 3){
	arr[i] = "cell Ce4";
	}else if(cellid == 4){
	arr[i] = "cell Ce5";
	}else if(cellid == 5){
	arr[i] = "cell Ce6";
	}
	return arr;
}

function newrow(){
	var contain = document.getElementById('container');
	var row = newcell('row');
	var classes = newclass();
	for(var i =0; i<4;i++){
		row.appendChild(newcell(classes[i]));
	}
	
	if(contain.firstChild == null){
		contain.appendChild(row);
	}else{
		contain.insertBefore(row,contain.firstChild);
	}
}


function move(){
	var contain = document.getElementById('container');
	var top = parseFloat(document.getElementById('container').style.top);//alert(document.getElementById('container').style.top);
	if(speed + top > 0){
		top = 0;
	}else{
		top += speed;
	}
	contain.style.top = top + 'px';//alert(Cellwidth);
	if(top == 0){
		newrow();
		contain.style.top = Cellwidthpx;//alert(Cellwidthpx);alert(top);
		deleterow();
	}
	else if(top == Cellwidth + speed){
		var rows = contain.childNodes;//alert("**");
		if((rows.length == 7) && (rows[rows.length-1].pass !== 1)){
			fail();
		}
	}
}


function deleterow(){
	var contain = document.getElementById('container');
		if(contain.childNodes.length == 8){
		contain.removeChild(contain.lastChild);
	}
	
}

function isPass(ev){
if(ev.target.className.indexOf('Ce') == -1){
	//fail();
}else{
	ev.target.className = 'cell';
	ev.target.parentNode.pass = 1;
	score();
}	 
}

function score(){
	var Score = document.getElementById('score');
	var newscore = parseInt(Score.innerHTML)+1;
	Score.innerHTML = newscore;
	if(newscore % 10 == 0) {
		speed += 1;
	}
}


function ifGet(){
	var ifGet = 1;   //ifGet是否中奖
	var score = document.getElementById('score').innerHTML;
	if(score<10){
		document.getElementById('ifget').innerHTML = "<div class='nowin'><div class='bg'><div class='stxt'>本次分数:"+score+"</div><div class='text'>亲，你才的实力不够啊！再多练习几局试试吧！打高分拿奖品。</div></div></div>";
		document.getElementById('share').innerHTML = "分享";
	}else if(score>10 && ifGet == 0){
		document.getElementById('ifget').innerHTML = "<div class='nowin'><div class='bg'><div class='stxt'>本次分数:"+score+"</div><div class='text'>你击败了xxxx人，离购物女王只有一步之遥，再来一局试一试！</div></div></div>";
		document.getElementById('share').innerHTML = "分享";
	}
	else
	{
		document.getElementById('ifget').innerHTML = "<div class='win'><div class='bg'><div class='stxt'>123456</div><div class='text'>恭喜获奖，请关注凤凰时尚官方微信：fashionifeng，并把“兑奖码【xxxxxx】”发送给我们。</div></div></div>";
		document.getElementById('share').innerHTML = "分享拿奖";
	}
}
function fail(){
	ifGet();
	document.getElementById('wend').style.display = "block";
	clearInterval(clock);
	var retry = document.getElementById('retry');
	var share = document.getElementById('share');
	share.ontouchstart = function(){
		document.getElementById('whshare').style.display = "block";
		backshare();
	}
	retry.ontouchstart = function(){
		document.getElementById('wend').style.display = "none";	
		frash();//alert(document.getElementById('container').style.top );
		init();
		Begin();
	}
	
}

function backshare(){  //返回结果页面
	var whshare = document.getElementById('whshare');
	whshare.ontouchstart = function(){
		whshare.style.display = "none";
	}
}

function frash(){
		speed = sspeed;
		var contain = document.getElementById('container');
		for(var i = contain.childNodes.length-1;i>=0;i--){
		contain.removeChild(contain.lastChild);}
		document.getElementById('score').innerHTML = 0;
		document.getElementById('container').style.top = Cellwidthpx;
		
}
Begin()
