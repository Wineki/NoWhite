/*
*图片文字滚动扩展包 
*版本：v1.2
*编码：utf-8版本
*作者：cici
*email：chengds@ifeng.com
*日期：2009-4-15
*/

/*
container:滚动的容器ID
btnPrevious：上一步按钮的ID
btnNext：下一步按钮的ID
*/
var id = 0;
function ifeng_Scroll(container,btnPrevious,btnNext)
{
	////////////////对外接口/////////////////////////
	this.IsAutoScroll = true; //是否自动滚动 
	this.IsSmoothScroll= true;//是否平滑连续滚动 平滑滚动:true 间隔滚动:false
	this.PauseTime = 1000;//间隔滚动时每次滚动间隔的时间。单位：毫秒。建议值：100--3000 适用于间隔滚动。
	this.Direction = "N"; //滚动方向.向东：E，向北：N
	this.ControllerType = "click";//上一个和下一个按钮事件的触发方式:click为点击触发滚动 否则就是 鼠标按住按钮触发滚动。支持click 和mousedown两种模式
	this.BackCall = null;//回调函数 滚动到末尾时执行
	this.Step = 1;//步长 可以理解为速度1--10
	////////////////对外接口/////////////////////////
	
	this.Speed = 10;
	this.container = container;

    this.NextButton = this.$(btnNext);
    this.PreviousButton = this.$(btnPrevious);
    this.ScrollElement = this.$(container);
	(this.ScrollElement);
	this.UlElement = this.$(container).getElementsByTagName('ul')[0];//ul元素
	this.UlElement.innerHTML+=this.UlElement.innerHTML;

	this.UlSpace ;//ul的实际宽度
	this.LiSpace;
	this.id = 0;
}
ifeng_Scroll.prototype = {
	lastpos:0,
	curPos:0,
	curTimeoutId:null,
	curIntervalScrollTimeoutId:null,
	ScrollElementPos:0,
	$:function(element)
	{	
		return document.getElementById(element);
	},
	Init:function()
	{
		this.UlSpace = this.Direction=="E"?this.UlElement.offsetWidth:this.UlElement.offsetHeight;//ul的实际宽度
		this.LiSpace = parseInt(this.UlSpace/this.UlElement.getElementsByTagName('li').length);
		this.UlSpace = this.LiSpace*this.UlElement.getElementsByTagName('li').length;
		this.Direction=="E"?this.$(this.container).style.width=this.UlSpace+"px":this.$(this.container).style.height=this.UlSpace+"px";
		
		//设置基础样式
		this.ScrollElement.style.overflow="visible";
		this.ScrollElement.parentNode.style.overflow="hidden";
		this.Direction=="E"?this.ScrollElement.style.width="10000px":this.ScrollElement.style.height="10000px";
		this.UlElement.style.float="left";
		
		this.ScrollType=this.Direction=="E"?"left":"top";
		this.Bind(this,this.PreviousButton,this.ControllerType,"Pre");
		this.Bind(this,this.NextButton,this.ControllerType,"Next");
		
		this.ScrollElement.onmouseover = this.GetFunction(this,"MouseOver");
		this.ScrollElement.onmouseout = this.GetFunction(this,"MouseOut");
	},
	Reset:function()
	{
		this.Pause();
		this.ScrollElement.style[this.ScrollType] = '0px';
	},
	Bind:function(_this,el,type,param)
	{
		if(el)
		{
			if(type=="click"){
				el.onclick = this.GetFunction(this,param);
			}
			else
			{
				el.onmousedown = this.GetFunction(this,"MouseDown",param);
				el.onmouseup = this.GetFunction(this,"MouseUp");
			} 
			el.onmouseover = this.GetFunction(this,"MouseOver");
			el.onmouseout = this.GetFunction(this,"MouseOut");
		}
	},
	Start:function()
	{
		if(!this.IsAutoScroll) return;
		if(this.IsSmoothScroll)
		{
			this.SmoothScroll();
		}
		else
		{		
			this.IntervalScroll();
		}
	},
	Pause:function()
	{
		clearTimeout(this.curTimeoutId);
		clearTimeout(this.curIntervalScrollTimeoutId);
	},
	MouseOver:function()
	{	
		clearTimeout(this.mouseoutTimeoutId);
		this.mouseoverTimeoutId = setTimeout(this.GetFunction(this,"Pause"),10);
	},
	MouseOut:function()
	{
		clearTimeout(this.mouseoverTimeoutId);
		this.mouseoutTimeoutId = setTimeout(this.GetFunction(this,"Start"),10);
	},
	MouseDown:function(direction)
	{
		var _step;
		var _to;
		if(direction=="Pre")
		{
			_step = this.Step*2;
			curPos = parseInt(this.ScrollElement.style[this.ScrollType]);
			if(!curPos) curPos=0;
			if(curPos==0)
			{
				this.ScrollElement.style[this.ScrollType] = -this.UlSpace/2 + "px";
				this.curPos=-this.UlSpace/2;
			}
			_to = 0;
		}
		else
		{
			_step = -this.Step*2;
			_to = -this.UlSpace/2;
		}
		moveParams = {from:this.curPos, to:_to, step: _step,controller:"MouseDown:" + direction,callback:this.GetFunction(this,"ScrollFinish")};			
		this.RunScroll(moveParams);
	},
	MouseUp:function()
	{
		clearTimeout(this.curTimeoutId);
	},
	Pre:function()
	{
		var curPos = parseInt(this.ScrollElement.style[this.ScrollType]);
		if(!curPos) curPos=0;
		var _to ;
		if(curPos==0)
		{
			this.ScrollElement.style[this.ScrollType] = -this.UlSpace/2 + "px";
			this.curPos=-this.UlSpace/2;
			_to = -this.UlSpace/2 + this.LiSpace;
		}
		else
		{
			_to = this.curPos%this.LiSpace==0?this.curPos + this.LiSpace:parseInt(this.curPos/this.LiSpace)*this.LiSpace;
		}
		moveParams = {from:this.curPos, to:_to, step: this.Step*2,controller:"Previous",callback:this.GetFunction(this,"ScrollFinish")};			
		this.RunScroll(moveParams);
	},
	Next:function()
	{
		_to = this.curPos%this.LiSpace==0?this.curPos - this.LiSpace:(parseInt(this.curPos/this.LiSpace)-1)*this.LiSpace;
		moveParams = {from:this.curPos, to:_to, step: -this.Step*2,controller:"Next",callback:this.GetFunction(this,"ScrollFinish")};			
		this.RunScroll(moveParams);
	},
	IntervalScroll:function()
	{
		var _to = parseInt(this.curPos/this.LiSpace)*this.LiSpace-this.LiSpace;
		var moveParams = {from:this.curPos, to:_to, step: -this.Step,controller:"IntervalScroll",callback:this.GetFunction(this,"ScrollFinish")};	
		this.RunScroll(moveParams);
	},
	SmoothScroll:function()
	{
		var _to = -this.UlSpace/2;
		var moveParams = {from:this.curPos, to:_to, step: -this.Step,controller:"SmoothScroll",callback:this.GetFunction(this,"ScrollFinish")};	
		this.RunScroll(moveParams);
	},
	RunScroll:function(params)
	{
		this.Scroll(params);
	},
	Scroll:function(param)
	{
		var step = Math.abs(param.to - this.curPos)<Math.abs(param.step)?param.to - this.curPos:param.step;
		this.ScrollElement.style[this.ScrollType] =(param.from+step)+"px";
		this.curPos = parseInt(this.ScrollElement.style[this.ScrollType]);
		clearTimeout(this.curTimeoutId);
		if(this.curPos!=param.to)
		{
			var moveParams = {from:this.curPos, to:param.to, step: param.step,controller:param.controller,callback:param.callback};
			this.curTimeoutId = setTimeout(this.GetFunction(this,"Scroll",moveParams),this.Speed);//alert(this.curTimeoutId);
		}
		else
		{
			if(param.callback) param.callback();
			if(param.controller=="SmoothScroll")
			{	this.SmoothScroll();}
			else if	(param.controller=="IntervalScroll")
			{
				if(this.curIntervalScrollTimeoutId) clearTimeout(this.curIntervalScrollTimeoutId);
				this.curIntervalScrollTimeoutId = setTimeout(this.GetFunction(this,"IntervalScroll"),this.PauseTime);
				if(id == 6){
					id = 0;
				}id++;//console.log(id);
			}
			else if(param.controller.indexOf("MouseDown")!=-1)
			{
				derection = param.controller.split(':')[1];
				this.MouseDown(derection);
			}
		}
	},
	ScrollFinish:function()
	{
		if(this.curPos<=-this.UlSpace/2)
		{
			this.ScrollElement.style[this.ScrollType] = "0px";
		}
		else if(this.curPos>=0)
		{
			this.ScrollElement.style[this.ScrollType] = -this.UlSpace/2 + "px";
		}
		this.curPos = parseInt(this.ScrollElement.style[this.ScrollType]);
		if(this.BackCall)this.BackCall();
	},
	GetFunction:function(variable,method,param)
	{	
		return function()
		{
			variable[method](param);
			
		}	
	}
}
