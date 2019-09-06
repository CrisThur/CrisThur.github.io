

// convert rgb to hex
function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};


// Converts an RGB color value to HSL. Conversion formula
// adapted from http://en.wikipedia.org/wiki/HSL_color_space.
// source https://gist.github.com/vahidk/05184faf3d92a0aa1b46aeaa93b07786
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let d = max - min;
  let h;
  if (d === 0) h = 0;
  else if (max === r) h = (g - b) / d % 6;
  else if (max === g) h = (b - r) / d + 2;
  else if (max === b) h = (r - g) / d + 4;
  let l = (min + max) / 2;
  let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return [h * 60, s, l];
}
function hslToRgb(h, s, l) {
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let hp = h / 60.0;
  let x = c * (1 - Math.abs((hp % 2) - 1));
  let rgb1;
  if (isNaN(h)) rgb1 = [0, 0, 0];
  else if (hp <= 1) rgb1 = [c, x, 0];
  else if (hp <= 2) rgb1 = [x, c, 0];
  else if (hp <= 3) rgb1 = [0, c, x];
  else if (hp <= 4) rgb1 = [0, x, c];
  else if (hp <= 5) rgb1 = [x, 0, c];
  else if (hp <= 6) rgb1 = [c, 0, x];
  let m = l - c * 0.5;
  return [
    Math.round(255 * (rgb1[0] + m)),
    Math.round(255 * (rgb1[1] + m)),
    Math.round(255 * (rgb1[2] + m))];
}


// convert hsl to rgb hex
function hslToHex(h,s,l){
  var color = hslToRgb( h, s, l )
  return rgbToHex( color[0], color[1], color[2] );
}



// define variables
var c = document.getElementById("myCanvas");
//var c = vue.page.pattern.canvas;
var ctx = c.getContext("2d");

var centerX = 200;
var centerY = 200;

var multi = 1;
var breakVal = 0;
var numPoints = 10;
var numPointsDirection = 1;

var turnFraction = 1.61803398875;
var turnFractionDirection = 0.001;

var patternId = 1;

var numCircles = 0;
var frame = 0;

// draw black background
function drawBg(){
  ctx.fillStyle = "#000000";
  ctx.strokeStyle = "#000000";
  ctx.fillRect(0,0,400,400);
  ctx.stroke();
}


// draw pattern1
function draw1(){
  ctx.moveTo(centerX, centerY);

  if (numPoints>=450) numPointsDirection=-1;
  if (numPoints<=50) numPointsDirection=1;

  if (numPointsDirection==1) numPoints += ((500.0-numPoints)/100.0 );
	else if (numPointsDirection==-1) numPoints-= numPoints/100.0;

  turnFraction = 1.6+(numPoints*0.0001);

  for (var i=0; i < numPoints*multi; i++) {
  	var dst = i*1.0 / (numPoints*multi - 1.0);
      var angle = 2 * Math.PI * turnFraction * i;

      var x = 200*dst * Math.cos(angle)+centerX;
      var y = 200*dst * Math.sin(angle)+centerY;

  		ctx.strokeStyle = rgbToHex(0,255,0);
      ctx.strokeRect(x,y,1,1);
  	//ctx.stroke();
  };
};


// draw pattern 2
function draw2(){
  //ctx.moveTo(centerX, centerY);

  for (var i=0; i < numPoints*multi; i++) {
  	var dst = i*1.0 / (numPoints*multi - 1.0);
      var angle = 2 * Math.PI * turnFraction * i;

      var x = 200*dst * Math.cos(angle)+centerX;
      var y = 200*dst * Math.sin(angle)+centerY;

  		ctx.strokeStyle = rgbToHex(i*2.5,255,255);
      ctx.strokeRect(x,y,1,1);
  	//ctx.stroke();
  };

  turnFraction += turnFractionDirection;
  if (turnFraction >= 0.05) turnFractionDirection -= 0.001;
  if (turnFraction <= -0.05) turnFractionDirection = 0.001;

};

function draw3(){
  for (var n=0; n<=numCircles; n++){
      //ctx.strokeStyle = rgbToHex(255,255,255);
      ctx.beginPath();
      ctx.strokeStyle = hslToHex(n,1,0.5)
		  ctx.arc(24*(n % 16)+14, 24*Math.floor(n/16)+14, 4, 0, 2*Math.PI);
      ctx.stroke();
  };
  numCircles+=2;
  if (numCircles>=256) numCircles = 0;
}


function draw4(){
  ctx.beginPath();
  ctx.strokeStyle = hslToHex(numCircles,1,0.5)
	ctx.arc(Math.random(0,1)*360+20, Math.random(0,1)*360+20, numCircles/10, 0, 2*Math.PI);
  ctx.stroke();
  numCircles++;
  if (numCircles>=200) numCircles = 0;
}


function draw5(){
  for (var n=0; n<=numCircles; n++){
      ctx.beginPath();
      ctx.strokeStyle = hslToHex(n,1,0.5)
		  ctx.arc(Math.random(0,1)*360+20, Math.random(0,1)*360+20, n/10, 0, 2*Math.PI);
      ctx.stroke();
  };
  numCircles++;
  if (numCircles>=100) numCircles = 0;
}


function ship(size, light){
  ctx.beginPath();
  ctx.arc(200, 360, size, 0, 2*Math.PI);
  ctx.fillStyle = hslToHex(0.0, 0.0, light );
  ctx.fill();
}

var starArr = [];
for (var n=0; n<=50; n++) {
	starArr.push( [Math.random(0,1)*360+20, Math.random(0,1)*400, Math.random(0,1)*2] );
};
// draw pattern 6
function drawStarField(){
  for (var n=0; n<=50; n++){
    ctx.strokeStyle = rgbToHex(255,255,255);
    ctx.strokeRect(starArr[n][0], starArr[n][1]+frame*10, starArr[n][2],starArr[n][2]);
    if (starArr[n][1]+(frame*10)>=400) starArr[n][1] -= 400;
  }

  ship( 14, 0.0+0.10*Math.abs(Math.sin(0.1*frame)) );
  ship( 15, 0.0+0.25*Math.abs(Math.sin(0.1*frame)) );
  ship( 13, 0.0+0.40*Math.abs(Math.sin(0.1*frame)) );
  ship( 10, 0.1+0.5*Math.abs(Math.sin(0.1*frame)) );
  ship( 8, 0.2+0.5*Math.abs(Math.sin(0.1*frame)) );
  ship( 9, 0.25 );
  ship( 8, 0.5 );
  ship( 7, 1.0 );

  frame++;
};


// increase/decrease number of points
function minus(){ if (multi>1) {multi/=2; };};
function plus(){ if (multi<4)multi*=2; console.log(multi);};

// change pattern
function setPattern(n){
  patternId=n;
  numPointsDirection = 1; turnFractionDirection = 0.001;
  if (n==1) { turnFraction=1.61803398875; numPoints = 10;}
  else if (n==2) { turnFraction= 0.0; numPoints = 100;}
  else if (n==3 || n==4 || n==5) { numCircles = 0; }
};

// set timer
var timer = setInterval(timerFunct,50);
function timerFunct(){
  if (patternId==1) { drawBg(); draw1(); }
  else if (patternId==2) { drawBg(); draw2(); }
  else if (patternId==3) { drawBg(); draw3(); }
  else if (patternId==4) { if (numCircles==0){ drawBg();}; draw4(); }
  else if (patternId==5) { if (numCircles==0){ drawBg();}; draw5(); }
  else if (patternId==6) { drawBg(); drawStarField(); };
};
