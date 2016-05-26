// JavaScript Document
var cellwidth = 0;
function scr(){
var isDesktop = navigator['userAgent'].match(/(ipad|iphone|ipod|android|windows phone)/i) ? false : true;
var height  = isDesktop ? 1000 : ((window.innerWidth>window.innerHeight?window.innerWidth:window.innerHeight));
var width = isDesktop ? 700 : ((window.innerWidth>window.innerHeight?window.innerHeight:window.innerWidth));
cellwidth = width/4;
cellwidthpx = cellwidth + 'px';
var fontunit = height + 'px';
var mainheight = cellwidth * 6;
var mainheightpx = mainheight + 'px';
document.write('<style type="text/css">'+'.wrap{height:'+fontunit+';}}'+'</style>');
document.write('<style type="text/css">'+'.cmain{height:'+mainheightpx+';}}'+'</style>');
document.write('<style type="text/css">'+'.cell{height:'+cellwidthpx+'; width:'+cellwidthpx+';}}'+'</style>');
}
scr();

