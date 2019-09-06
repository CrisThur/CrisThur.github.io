
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "rgba(0,0,0,255)";
ctx.fillRect(0, 0, canvas.getAttribute("height"), canvas.getAttribute("width"));


function randInt(min,max) { return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + min; }

function Htmlx(){
  var eList = ['myCanvas','terrainMenu','terrainType','terrainButtons','tileData','myText','tileInfo','layerMinus','layerPlus','layerDepth'];
  for (var i=0; i<eList.length; i++) {this[eList[i]]=document.getElementById(eList[i]);};
}
var htmlx = new Htmlx();

var terrainTypes = [
  ['none',"rgba(128,128,128,255)"],
  ['wall',"rgba(0,0,0,255)"],         ['floor',"rgba(100,100,100,1)"],
  ['ocean',"rgba(0,76,153,255)"],     ['reef',"rgba(0,128,225,255)"],
  //['deep water',"rgba(0,76,153,255)"],['shallow water',"rgba(0,128,225,255)"],
  ['dessert',"rgba(255,255,0,255)"],  ['lava',"rgba(153,0,0,255)"],
  ['savanna',"rgba(178,255,0,255)"],  ['tropical rainforest',"rgba(31,82,0,255)"],
  ['swamp',"rgba(102,102,0,255)"],
  ['grassland',"rgba(0,204,0,255)"],  ['temperate rainforest',"rgba(0,122,71,255)"],
  ['cold dessert',"rgba(0,255,255,255)"],
  ['tundra',"rgba(0,173,173,255)"],   ['permafrost',"rgba(150,255,255,255)"]
];

var terrainType = [
  {'n':'none',        'c':'rgba(128,128,128,255)',  't':30, 'r':1500},
  {'n':'wall',        'c':'rgba(0,0,0,255)',        't':30, 'r':1000},
  {'n':'floor',       'c':'rgba(100,100,100,1)',    't':30, 'r':1000},
  {'n':'deep water',  'c':'rgba(0,76,153,255)',     't':30, 'r':1500},
  {'n':'shallow water', 'c':'rgba(0,128,225,255)',  't':30, 'r':1000},
  {'n':'dessert',     'c':'rgba(255,255,0,255)',    't':30, 'r':100},
  {'n':'lava',        'c':'rgba(153,0,0,255)',      't':60, 'r':100},
  {'n':'savanna',     'c':'rgba(178,255,0,255)',    't':30, 'r':500},
  {'n':'rainforest tropical', 'c':'rgba(31,82,0,255)', 't':30, 'r':1500},
  {'n':'swamp',       'c':'rgba(102,102,0,255)',    't':30, 'r':2000},
  {'n':'grass',       'c':'rgba(0,204,0,255)',      't':15, 'r':500},
  {'n':'rainforest temperate', 'c':'rgba(0,122,71,255)', 't':15, 'r':1500},
  {'n':'tundra',      'c':'rgba(0,173,173,255)',    't':5, 'r':750},
  {'n':'frost',       'c':'rgba(150,255,255,255)',  't':0, 'r':0},
];

var terrainTypesObj = {};

for (var a=0; a<terrainTypes.length; a++){
  terrainTypesObj[terrainTypes[a][0]] = {'name':terrainTypes[a][0], 'color':terrainTypes[a][1]};
  var terrainType = terrainTypesObj[terrainTypes[a][0]];
  var html = htmlx.terrainButtons;
  html.innerHTML = html.innerHTML + "<p style='margin: 0; padding: 0; width: 200px; text-align: left;'><span style='font-size: 14px; color:" + terrainType.color + "'>▮</span><button style='width:180px;text-align:left' onclick='terrainButton(" + '"' + terrainType.name + '"' +")'>" + terrainType.name + "</button></ p>"
}


function Tile(f=1,t='ocean'){
  //this.color="rgba(0,150,"+randInt(200,250)+",255)";
  this.color=terrainTypesObj[t].color;
  this.final=f;
  this.tiles=[];
  this.info="";
  this.settlement="";
  this.type=terrainTypesObj[t].name;
  this.elevation=0;
  this.temperature=0;
  this.rainfall=0; //in mm
  this.biomeCategory="ocean";
  this.biomass=0;
  this.info2="";

  this.genBiomes = function(){
    this.temperature = 30-(this.elevation*8/1000);

    if (this.elevation < -20) {this.biomeCategory="aquatic";}
    else {this.biomeCategory = "terrestial"};

    if (this.biomeCategory == "aquatic"){
      if (this.elevation <-200) {this.type="deep water";}
      else {this.type="shallow water";};
    };

    if (this.biomeCategory == "terrestial") {this.type='shallow water';}
    if (this.elevation < 600) {
      if (this.rainfall < 250) {
        if (this.temperature > 0) {this.type='dessert'}
        else {this.type='cold dessert'};
      }
      else if (this.rainfall < 750) {
        if (this.temperature > 20) {this.type='savanna'}
        else if (this.temperature > 10) {this.type='grassland'}
        else if (this.temperature > 0) {this.type='tundra'};
      }
      else if (this.rainfall < 1750) {
        if (this.temperatuere >= 20) {this.type="tropical rainforest"}
        else if (this.temperature >= 10) {this.type="temperate rainforest"}
        else if (this.temperature >= 0) {this.type="tundra"}
        else {this.type="permafrost"};
      }
      else {this.type="swamp";}
    };
  };



  this.genValues = function(){
    // biome: [temperature,rainfall]
    var biomes = {
      'wall':[30,1000],       'floor':[30,1000],
      'ocean':[30,1500],      'reef':[30,1000],
      'deep water':[30,1500], 'shallow water':[30,1000],
      'dessert':[30,100],     'lava':[60,100],
      'savanna':[30,500],     'tropical rainforest':[30,1500],
      'swamp':[30,2000],
      'grassland':[15,500],   'temperate rainforest':[15,1500],
      'tundra':[5,750],       'permafrost':[0,0]
    }
    var biomes2 = {'lake':-200,'depression':-20,'flatlands':0, 'hills':300, 'mountains':600}
    this.temperature = biomes[this.type][0];
    this.rainfall = biomes[this.type][1];
    //this.temperature = 30-(this.elevation*8/1000);
    this.elevation = -(this.temperature-30)*1000/8;
    if (this.type=='ocean'){this.elevation=-200}
    else if (this.type=='reef'){this.elevation=-20};
    energy = map.layerArea[map.topLayer]*10000*1000*0.25;
    converted1 = energy*0.01; converted2 = energy*0.05; converted3 = energy*0.10;
    converted = Math.floor(converted1).toExponential(2)+'/ '+Math.floor(converted2).toExponential(2)+'/ '+Math.floor(converted3).toExponential(2);
    //this.biomass = map.layerArea[map.topLayer]*10000*1000*0.25*(0.5+0.5*Math.min(this.temperature,15)/15)*(0.5+0.5*Math.min(this.rainfall,1000)/1000)*0.2;
    this.biomass = map.layerArea[map.topLayer]*10000*(0.5+0.5*this.temperature/30)*(this.rainfall/2000);
    //this.info2 = "Elevation: "+this.elevation+"m, Heat: "+Math.floor(this.temperature)+" c, Rain: "+Math.floor(this.rainfall)+" mm</br>Energy: //"+Math.floor(energy).toExponential(2)+" watt </br>Converted: "+converted+" kcal"+" </br>Biomass: "+Math.floor(this.biomass).toExponential(2)+" kg";

    this.info2 = `
      Elevation: ${this.elevation} m,
      Heat: ${Math.floor(this.temperature)} c,
      Rain: ${Math.floor(this.rainfall)} mm <br>
      Energy: ${Math.floor(energy).toExponential(2)} watt <br>
      Converted: ${converted} kcal <br>
      Biomass: ${Math.floor(this.biomass).toExponential(2)} kg
    `;

  };

  this.setTerrain = function(t){
    if (t!='none'){
      this.type=t;
      this.info="this is a "+t;
      this.color=terrainTypesObj[t].color;
      this.genValues();
    }
    //map.updateTiles();
  };

  this.clearTiles = function(){
    this.final = 1;
    this.tiles = [];
  };

  this.load = function(saveFile){
    if (saveFile.final==1){
      this.final = 1;
      //this.color = saveFile.color;
      this.info = saveFile.info;
      this.tiles = [];
      this.type = saveFile.type;
      this.color = terrainTypesObj[this.type].color
    }
    else {
      this.final = 0;
      this.tiles = [];
      for (var h=0; h<saveFile.tiles.length; h++){
        this.tiles.push([]);
        for (var w=0; w<saveFile.tiles[h].length; w++){
          this.color = saveFile.color;
          this.info = saveFile.info;
          this.type = saveFile.type;
          //this.color = terrainTypesObj[this.type].color
          this.tiles[h].push(new Tile());
          this.tiles[h][w].load(saveFile.tiles[h][w]);
        };
      };
    };
  };
}

var saveEnc = {};


function Map(){
  this.pos = {'w':0, 'h':0};
  //this.tile_ = new Tile;
  this.tile = new Tile(f=0);
  this.tileChain = [];
  this.brush = 'ocean';
  this.topLayer = 0;
  this.topLayerSize = this.topLayer;
  this.layers = ['10000 km', '1000 km', '100 km', '10 km', '1 km', '100 m', '10 m', '1 m', '10 cm', '1 cm'];
  this.layerVal = [10000, 1000, 100, 10, 1, 0.1, 0.01, 0.001];
  this.layerArea = [];
  for (var i=0; i<this.layerVal.length; i++){this.layerArea.push(this.layerVal[i]*this.layerVal[i])}
  // [continent, kingdom, town, house]
  this.size = 10;
  this.units = ['g9','k9','m9','9'];
  this.units2 = [0,0,0,0,0,0,0,0,1];

  this.setUnits = function(){
    for (var a = 0; a<this.units2.length; a++){
      this.units2[this.units2.length-1-a] = Math.pow(this.size,a);
    }
  }

  this.setTerrain = function(t){ this.tile.tiles[this.pos.h][this.pos.w].setTerrain(t); this.updateTiles();};

  this.genTiles = function(t='ocean'){
    var c = ''; var tile = this.tile.tiles;
    for (var h=0; h<10; h++) {
      this.tile.tiles.push([]);
      for (var w=0; w<10; w++) { tile[h].push(new Tile(f=1,t=this.tile.type));};
    };
    this.updateTiles();
  };

  this.updateTiles = function(){
    var tl = this.topLayer;
    htmlx.layerDepth.innerHTML = "Map size (" + this.layers[tl] + "/" + this.layers[tl+1] + "/" + this.layers[tl+2] + ") (Layer "+ (tl-2) + ") " ;
    var c = ''; var tile = this.tile.tiles;
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, canvas.getAttribute("height"), canvas.getAttribute("width"));
    ctx.fillStyle = "#fff"; ctx.fillRect(42*this.pos.w+1, 42*this.pos.h+1, 42, 42);
    for (var h=0; h<10; h++) {
      for (var w=0; w<10; w++) {
        if (tile[h][w].final==1){ ctx.fillStyle = tile[h][w].color; ctx.fillRect(42*w+2, 42*h+2, 40, 40); tile[h][w].genValues();}
        else {
          for (var h2=0; h2<10; h2++) {
            for (var w2=0; w2<10; w2++) {
              ctx.fillStyle = tile[h][w].tiles[h2][w2].color; ctx.fillRect(42*w+2+4*w2, 42*h+2+4*h2, 4, 4); tile[h][w].tiles[h2][w2].genValues();
            };
          };
          ctx.fillStyle = "rgba(255,0,255,0.5)";//"#f0f";
          ctx.fillRect(42*w+4, 42*h+4, 4, 4);
          console.log('has subtiles');
        };
      };
    };
  };

  this.clearSubtiles = function(){this.tile.tiles[this.pos.h][this.pos.w].clearTiles(); this.updateTiles();};

  this.save = function save(){ saveEnc = LZString.compressToBase64(JSON.stringify(map.tile)); htmlx.myText.value=saveEnc; };
  this.load = function load(x){ this.tile.load(JSON.parse(LZString.decompressFromBase64(htmlx.myText.value))); this.updateTiles(); };

  this.layerPlus = function(){
    if (this.topLayer<9-this.topLayerSize){
      this.tileChain.push(this.tile.tiles[this.pos.h][this.pos.w]);
      this.tile = this.tileChain[this.tileChain.length-1];
      this.topLayer += 1;
      if (this.tile.final==1) {this.genTiles();}
      else {this.updateTiles();};
      this.tile.final = 0;
    };

  }
  this.layerMinus = function(){
    if (this.topLayer>this.topLayerSize){
      this.tileChain.pop();
      this.tile = this.tileChain[this.tileChain.length-1];
      this.topLayer -= 1;
      this.updateTiles();
    };
  }
}

var map = new Map();
map.genTiles();
map.tileChain.push(map.tile);


function saveElementText() {
  //map.tile.tiles[map.pos.h][map.pos.w].info = htmlx.myText.value;
  map.tile.tiles[map.pos.h][map.pos.w].info = document.getElementById("textArea").value
  let w = map.pos.w;      let h = map.pos.h;

  htmlx.tileData.innerHTML = "Pos (<b>" + w + "," + h + ")</b>, " + map.tile.tiles[h][w].color;;
  htmlx.tileInfo.innerHTML = "";
  for (var i=1; i<map.tileChain.length; i++){htmlx.tileInfo.innerHTML+="Range: "+map.layers[i+map.topLayerSize]+"</br>"+map.tileChain[i].info2+"</br>"+map.tileChain[i].info +"</br></br>";};
  htmlx.tileInfo.innerHTML += "Range: "+map.layers[map.tileChain.length+map.topLayerSize]+"</br>"+map.tile.tiles[map.pos.h][map.pos.w].info2+"</br>"+map.tile.tiles[map.pos.h][map.pos.w].info;
}

function terrainButton(t) {
  map.brush = t;
  htmlx.terrainType.innerHTML = "Select: "+t;
}


///////////////////////
/// Mouse events
var timer = null
var mousePos = null;
var mousePressed = 0;

onmousemove = function(e){ mousePos = getMousePos(canvas, e); }

canvas.addEventListener("mousedown", function (e) { mousePressed=1; paint(); timer = setInterval(paint, 100); }, false);
canvas.addEventListener("mouseup", function () { clearInterval(timer); mousePressed=0; }, false);
canvas.addEventListener("mouseover", function () { clearInterval(timer); mousePressed=0; }, false);
canvas.addEventListener("mouseout", function () { clearInterval(timer); mousePressed=0; }, false);


function paint(){
  var mapPos = [parseInt(mousePos.x/42), parseInt(mousePos.y/42)];
  map.pos.w = mapPos[0];  map.pos.h = mapPos[1];
  var w = map.pos.w;      var h = map.pos.h;
  map.setTerrain(map.brush);
  var t = "Pos (<b>" + w + "," + h + ")</b>, " + map.tile.tiles[h][w].color;
  var info = map.tile.tiles[map.pos.h][map.pos.w].info;

  console.log(t);
  htmlx.tileData.innerHTML = t;
  htmlx.tileInfo.innerHTML = "";
  for (var i=1; i<map.tileChain.length; i++){htmlx.tileInfo.innerHTML+="Range: "+map.layers[i+map.topLayerSize]+"</br>"+map.tileChain[i].info2+"</br>"+map.tileChain[i].info +"</br></br>";};
  htmlx.tileInfo.innerHTML += "Range: "+map.layers[map.tileChain.length+map.topLayerSize]+"</br>"+map.tile.tiles[map.pos.h][map.pos.w].info2+"</br>"+map.tile.tiles[map.pos.h][map.pos.w].info;

  document.getElementById("textArea").value = map.tile.tiles[map.pos.h][map.pos.w].info;
};

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
}


//////////////////////
/// LZW-compress a string
var save1 = '';
function save(){ save1 = LZString.compressToBase64(JSON.stringify(map)); };
function load(){ return JSON.parse(LZString.decompressFromBase64(save1)); };
