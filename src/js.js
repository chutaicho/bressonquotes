$(function(){

	function getRandom(min,max)
	{
	    return min + (Math.random() * (max - min));
	}

	// http://codepen.io/quasimondo/pen/lDdrF
	var colors = new Array([60,200,60],[200,35,98],[45,175,230],[200,0,200],[200,128,0],[62,35,200]);
	var step = getRandom(0,1.0);

	//color table indices for:
	// current color left
	// next color left
	// current color right
	// next color right
	var colorIndices = [0,1,2,3];
	//transition speed
	var gradientSpeed = 0.002;

	function updateGradient()
	{
	  	if ( $===undefined ) return;

		var c0_0 = colors[colorIndices[0]];
		var c0_1 = colors[colorIndices[1]];
		var c1_0 = colors[colorIndices[2]];
		var c1_1 = colors[colorIndices[3]];

		var istep = 1 - step;
		var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
		var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
		var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
		var color1 = "rgb("+r1+","+g1+","+b1+")";

		var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
		var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
		var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
		var color2 = "rgb("+r2+","+g2+","+b2+")";

	 	$('#gradient').css({
	 		background: "-webkit-gradient(linear, left top, left bottom, from("+color1+"), to("+color2+"))"}).css({
	    	background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});

	  	step += gradientSpeed;

	    if( step >= 1 )
	    {
		    step %= 1;
		    colorIndices[0] = colorIndices[1];
		    colorIndices[2] = colorIndices[3];
		    //pick two new target color indices
		    //do not pick the same as the current one
		    colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
		    colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
		}
	}
	setInterval(updateGradient,30);

	// Text Loading ////////////////////////////////////////////////////////

	var _up = $('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 197.402 197.402" style="enable-background:new 0 0 197.402 197.402;" xml:space="preserve"><g><polygon style="fill:#FFFFFF; opacity:0.5" points="146.883,197.402 45.255,98.698 146.883,0 152.148,5.418 56.109,98.698 152.148,191.98"/></g></svg>');
	var _config = { numLoads: 10, cntLoads: 0, showUP: false, upThreshold: 1200, data: "data.txt" };
	var _quotes = [];

	$(window).scroll(function()
    {
    	var isBottom = false;
    	var wy = window.innerHeight;
		var dy = document.documentElement.scrollHeight || document.body.scrollHeight;
		var sy = document.documentElement.scrollTop || document.body.scrollTop;

		if(sy > _config.upThreshold){ if(!_config.showUP){_up.animate({'bottom':10}); _config.showUP = true; }}
		else { if(_config.showUP){_up.animate({'bottom':-100}); _config.showUP = false; }}

		if(isBottom)return;
		if(isBottom && (dy > sy + wy)) isBottom = false;

		if(dy < sy + wy + 1)
		{
			startLoading();
			isBottom = true;
		}
    });
	function onload(data)
	{
		var lines = data.split('\n');

		for(var i = 0; i < lines.length; i++)
		{
			var l = lines[i]; if(l != "" && l != "#") _quotes.push(l);
		}

		_quotes.sort(function(){ return 0.5 - Math.random(); });

		$('html, body').animate({scrollTop:0});
		startLoading();
	}
	function startLoading()
	{
		for (var i = 0; i < _config.numLoads; i++) appendQuote(_quotes[_config.cntLoads++]);
	}
	function appendQuote(q)
	{
		var el = $("<div class='quotes'>" + q + "</div>");
		var fs = getRandom(1.0,2.0);
		el.css({'font-size':fs+'em','line-height':'1.5em'});
		$("#wrapper").append(el);
		$("#wrapper").append("<div class='quotes break'>" + "/" + "</div>");
	}

	_up.css({'position':'fixed','bottom':-100,'right':20,'z-index':10,'width':40,'cursor':'pointer','-webkit-transform':'rotate(90deg)','-ms-transform':'rotate(90deg)','transform':'rotate(90deg)'});
	_up.bind('click',function(){$('html, body').animate({scrollTop:0},'normal');});

	$("body").append(_up);

	$.ajax({ url:_config.data, dataType:"text", success: onload });
});
