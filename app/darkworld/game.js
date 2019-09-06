
var logList = [
	{id: 'intro0', m: "You wake up in darkness and for a moment you feel very dizzy. Slowly, your eyes begin to adjust, and what seemed like pitch black becomes very dim light.", b: "look around", bf: "intro1" },
	{id: 'intro1', m: "You can still barely see, wherever you are it is almost completely dark in here.", b: "continue looking around", bf: "intro2" },
	{id: 'intro2', m: "The things surrounding you feel natural, some kind of hole in a ground maybe? You can feel cool plants and earth, you can also smell it, a moist, earthy fragrance.", b: "continue looking around", bf: "intro3" },
	{id: 'intro3', m: "Your eyes adjust further, you are surrounded by plants. You wonder if you should try to explore the area a bit.", b: "explore", bf: "intro4" },
	{id: 'intro4', m: "Wherever it is that you are, it is unlike any place you have ever seen before. You get the impression that you are inside some kind of forest, a very dark forest.", b: "continue to explore", bf: "intro5" },
	{id: 'intro5', m: "The plants surrounding you are weird, dark and twisted, this place is unlike any forest that you ever encountered or saw. You get the impression that this place is distinctly different from where you came from.", b: "", bf: "", run: 'initHtml2' }
];


// Timer
var time = {a:Date.now(), b:Date.now(), c:0};

var nekoNumberArr = {
	standard : ['pico', 'nano', 'micro', 'mili', '', 'kilo', 'mega', 'giga', 'tera', 'peta'],
	standardShort: ['p','n','u','m','','K','M','G','T','P'],
	numbers : ['','th','mi','bi','tr','oc']
};

function numberNeko(x){
	if (x==0){return 0};
	var e = Math.floor(Math.log(x)/Math.log(10));
	var mod = e % 3;
	e = Math.floor(e/3.0)*3;
	var val =0;
	var eText='';
	if (e>=0) {x=x/Math.pow(10,e); val = x.toFixed(3-mod)}
	else if (e<=-3) {x=x/Math.pow(10,e); val = x.toFixed(0)}
	eText = nekoNumberArr.standardShort[4+e/3];
	if (eText == undefined){eText='e'+e;};
	return val+' '+eText;
}

//console.time();

var save = {
	data : {},
	encode : function(){
		this.data.child = {};
		this.data.child.obj = {};

		for (a in vue.child.obj) { this.data.child.obj[a] = vue.child.obj[a].save(); };

		this.data.child.sel = {};
		this.data.child.sel.id = vue.child.sel.id;
		this.data.res = {};
		this.data.res.obj = {};

		for (a in res){
			if (!res[a].empty) { this.data.res.obj[a] = [vue.res.obj[a].active, vue.res.obj[a].val, vue.res.obj[a].bVal] };
		};

		this.data.options = {};
		for (a in vue.options) { this.data.options[a] = vue.options[a]; };
		this.data.log = { arr:vue.log.arr, val:vue.log.val };
	},
	decode : function(){
		for (a in this.data.child.obj) {
			var c = this.data.child.obj[a];
			vue.child.obj[a] = new Child ({ id: c[0], active: c[1], action: c[2], name: c[3], age: c[4], gender: c[5], response: c[6] });
		};
		vue.child.switchId(this.data.child.sel.id);

		for (a in this.data.res.obj){
			vue.res.obj[a].active = this.data.res.obj[a][0];
			vue.res.obj[a].val = this.data.res.obj[a][1];
			vue.res.obj[a].bVal = this.data.res.obj[a][2];
		};
		for (a in this.data.options) { vue.options[a] = this.data.options[a]; };

		vue.log.arr = this.data.log.arr; vue.log.val = this.data.log.val;
	},
	saveFile : function(){},
	loadFile : function(){},
	transfer : function(){
		for (var b=0; b<game.ui.fields.length; b++){ var elem = game.ui.fields[b]; game.ui.fields[b][1] = ref.ui.fields[elem[0]].is(":visible") ? 1 : 0; };
		for (var b=0; b<game.ui.mMenu.length; b++){ var elem = game.ui.mMenu[b]; game.ui.mMenu[b][1] = ref.ui.mMenu[elem[0]].is(":visible") ? 1 : 0; };
	},
	saveString : function(){
		//save.transfer();
		save.encode();
		var saveFile = JSON.stringify(save.data);
		console.log(saveFile);
		var saveFileBase64 = LZString.compressToBase64(saveFile);
		console.log(saveFileBase64);
		//ref.ui.fields.saveTextArea.text(saveFileBase64);
		vue.saveFileText = saveFileBase64;
		//ref.ui.fields.clipboard.show();
	},
	loadString: function(){
	},
	save : function (){ this.encode(); console.log(JSON.stringify(save.data)); vue.saveFileText = LZString.compressToBase64(JSON.stringify(save.data)); },
	load : function (){ this.data = (JSON.parse(LZString.decompressFromBase64(vue.saveFileText))); this.decode(); }
}

function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};
function color(a,b){
	return rgbToHex(
		255,
		127 + Math.floor(128 * Math.max(Math.min(1,1+4*((50-a)/0.75*b)),0)),
		127 + Math.floor(128 * Math.min(1,1+4*((75-a)/b)))
	);
};

// resources
function Res(newData={}){
	let d = {active:false, empty:false, color:'#ffffff', val:0, max:0, last:0, sec:1, bVal:0};
	for (a in newData){d[a] = newData[a]};
	this.active=d.active; this.empty=d.empty; this.val=d.val; this.last=d.last; this.sec=d.sec; this.bVal=d.bVal;
	this.tooltip='hello'; this.color={name:d.color, val:''}; this.max=d.max;
	this.rgbToHex = function (r, g, b) { return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); };
	this.genColor=function(){
		if (this.max!=0){
			this.color.val = this.rgbToHex(
				255,
				127 + Math.floor(128 * Math.max(Math.min(1,1+4*((0.75*this.max-this.val)/(1.0*this.max))),0)),
				Math.floor(255 * Math.max(Math.min(1,1+4*((0.5*this.max-this.val)/(0.75*this.max))),0)),
			);
		};
		// if (this.val<=0.5*this.max){this.color.val='#ffffff';}
		// else if (this.val<=0.75*this.max){this.color.val='#ffffaa';}
		// else {this.color.val='#ffaaaa'};
		// return this.color.val;
	};
	this.genPerSec = function(){ this.sec = this.val - this.last; this.last = this.val; };
};


// technology/research
function Tech(newData={}){
	let d = {complete:false, unlocked:false, tier:0, val:0, complexity:100, unlockedBy:[], unlocksTech:[], unlocksRes:[], tooltip:''}
	for (a in newData){d[a] = newData[a]};
	this.complete=d.complete; this.unlocked=d.unlocked; this.val=d.val; this.complexity=d.complexity; this.tier=d.tier;
	this.unlockedBy = new Set(d.unlockedBy);
	this.unlocks = {tech: new Set(d.unlocksTech), res: new Set(d.unlocksRes)};
	this.tooltip = d.tooltip;
};

// build
function Build(newData={}){
	let d = {unlocked:false, tier:0, val:0, cost:{}, tooltip:'', create:{} };
	for (a in newData){d[a] = newData[a]};
	this.unlocked=d.unlocked; this.tier=d.tier; this.val=d.val; this.cost=d.cost;
	this.output={ ideas: { thoughts: 10 } };
	this.creates = [
		{ out:[[1, 'mud']] },
		{ out:[[1,'ideas']], in:[[-10,'thoughts'],[-2,'wood']] }
	];
	this.createsStr = '';
	this.store={ food:10, mud:10, wood:10, stone:10};
	this.tooltip=d.tooltip;
	this.genTooltip=function(){
		this.tooltip = 'Cost:\n';
		for (a in this.cost) { this.tooltip += (this.cost[a] * Math.pow(1.1,1+this.val)).toFixed(2) + ' ' + a + '\n\n'; };
		this.tooltip += 'Generates:\n';
		//for (a in this.creates){ this.tooltip+= this.creates[a] + ' ' + a+'/s\n'; };
		this.createsStr = [];
		for (var a=0; a<this.creates.length; a++) {
			if (!this.creates[a].hasOwnProperty('in')){
				let arr=[];
				for (var b=0; b<this.creates[a].out.length; b++) { arr.push(this.creates[a].out[b].join(' ')); };
				this.tooltip += '+' + arr.join('/s, +') + '/s\n';
			}
			else {
				let arr=[[],[]];
				for (var b=0; b<this.creates[a].in.length; b++) { arr[0].push(this.creates[a].in[b].join(' ')); };
				arr[0] = arr[0].join('/s, ') + '/s';
				for (var b=0; b<this.creates[a].out.length; b++) { arr[1].push(this.creates[a].out[b].join(' ')); };
				arr[1] = '+' + arr[1].join('/s, +') + '/s';
				this.tooltip += arr[1] + ' (' + arr[0] + ')\n';
			};
		};
	};
	this.genTooltip();
	this.checkOutputOld=function(){
		for (a in this.output){
			let isReady = true;
			for (b in this.output[a]){ if ( vue.res.obj[b].val<this.output[a][b]) { isReady=false; }; };
			if (isReady) { for (b in this.output[a]) { vue.res.obj[b].val -= this.output[a][b] }; this.val += 1; };
		};
	};
	this.checkOutput=function(){
		for (var a=0; a<this.creates.length; a++) {
			let isReady = true;
			for (b in this.creates[a].in){ if ( vue.res.obj[b].val < this.creates[a].in[b] ) { isReady=false; }; };
			if (isReady) {
				for (b in this.creates[a].in){ vue.res.obj[b].val -= this.creates[a].in[b] };
				for (b in this.creates[a].out){ vue.res.obj[b].val += this.creates[a].out[b] };
			};
		};
	};
};

function Child(newData={}){
	let d = {
		id: 'n', active: false, action: 'resting',
		name:'Nana', age:5, gender:'herm', sensitivity: { base: 1.0, total: 0 }, response: {pain : 1.0, itch: 1.0, shame: 1.0}, options: [ 'rest', 'play' ],
	};
	for (a in newData){d[a] = newData[a]};
	this.id = d.id; this.active = d.active;
	this.name = d.name; this.age = d.age; this.ageTier = ''; this.gender = d.gender;
	this.response = {pain : d.response.pain, itch : d.response.itch, shame : d.response.shame};
	this.actions = { resting:true, cuddler:true, swarm:false, toilet:false, dreamer:false, scientist:false, creator:false, spanker:false, gatherer:false, explorer:false };
	this.action = d.action;
	this.happiness = 10;

	this.genActions = function(){
		if (this.age>=2){ this.actions.dreamer = true; this.actions.scientist = true; };
		if (this.age>=5){ this.actions.creator = true; };
		if (this.age>=10) { this.actions.gatherer = true; this.actions.explorer = true; }
	};
	this.genActions();

	this.randomType = function (obj){ var keys = Object.keys(obj);return keys[Math.floor(Math.random() * (keys.length))]; };

	this.types = { pain: {'sensitive':1.0,'happy':0.8,'tough':0.6}, itch : {'energetic':1.0,'focused':0.8,'calm':0.6}, shame : {'picky':1.0,'open minded':0.8,'shameless':0.6} };
	this.type = { pain: this.randomType(this.types.pain), itch: this.randomType(this.types.itch), shame: this.randomType(this.types.shame) };

	this.genAgeTier = function(){
		if ( this.age >=10 ){ this.ageTier = 'teen'; }
		else if ( this.age >= 5 ) { this.ageTier = 'child'; }
		else if ( this.age >= 2 ) { this.ageTier = 'toddler'; }
		else { this.ageTier = 'baby'; }
	};
	this.genAgeTier();

	this.pron = {
    boy:		{Male: "male", He:"He", he:"he", His:"His", his:"his", boy:"boy", him:"him"},
    girl:   {Male: "female", He:"She", he:"she", His:"Her", his:"her", boy:"girl", him:"her"},
	};

	this.text = '';

	this.genText = function(){
		this.text = 'Name: ' + this.name + '<br>';
		this.text += 'Happiness: ' + this.happiness + '<br>';
		this.text += this.name + " is a " + this.type.pain + " " + this.age + " y old " + this.pron[this.gender].gMale + " " + this.ageTier + ". ";
		this.text += this.pron[this.gender].gHe + " is "+ this.type.itch + " and very " + this.type.shame + ".<br><br>";
	};
	this.genText();

	this.save = function(){
		let obj = { id: this.id, active: this.active, action: this.action, name: this.name, age: this.age, gender: this.gender, response: this.response };
		let arr = [];
		for (a in obj) { arr.push(obj[a]); }
		return arr;
	};
};




var mapArr = [
	'#######',
	'#######',
	'### ###',
	'### ###',
	'### ###',
	'#######',
	'#######',
];
var entityTypes = {
	' ': function(){ return new Ent({char:' ',type:'floor',text:'dark ground'})},
	'.': function(){ return new Ent({char:'.',type:'floor',text:'mossy ground'})},
	'#': function(){ return new Ent({char:'.',type:'wall',text:'wall'})},
	'@': function(){ return new Ent({char:'.',type:'player',text:'player'})},
};


function Ent(obj){
	let o = { char:'.',text:'',type:'floor',pos:{h:0,w:0}};
	for (a in obj){o[a] = obj[a]};
	this.char = o.char; this.text = o.text; this.type = o.type;
	this.genText = function() { this.text = { ' ': 'nothing', '.': 'mossy ground', '#': 'wall', '@': 'player'}[this.char]; };
	if (this.text=='') { this.genText(); };
};

function Tile(obj){
	let c = { floor:[new Ent({})], item:[], wall:[], player:[] };
	for (a in obj){c.chars[a] = obj[a]; };
	this.chars = c; this.char = ''; this.text = '';
	this.addEnt = function(ent) { this.chars[ent.type].push(ent); };
	this.genText = function() {
		this.text = ''; this.char = ''; let c = this.chars;
		if (c.player.length!=0) { this.text+= 'player' }
		else if (c.wall.length!=0) { this.text+= 'wall' }
		else if (c.item.length!=0) { for (var a=0; a<c.item.length; a++) { this.text += c.item[a].text; } }
		else if (c.floor.length!=0) { for (var a=0; a<c.floor.length; a++) { this.text += c.floor[a].text; } }
	};
	this.genText();
	this.genChar = function(){
		let c = this.chars;
		if (c.player.length!=0) { this.char = '@' }
		else if (c.wall.length!=0) { this.char = '#' }
		else if (c.item.length!=0) { this.char = c.item[c.item.length-1].char; }
		else if (c.floor.length!=0) { this.char = c.floor[c.floor.length-1].char; }
		return this.char;
	};
};

function Map(arr){
	this.type = 'map';
	this.arr = arr;
	this.obj = {};

	this.genMap = function(){
		for (var h=0; h<this.arr.length; h++) {
			for (var w=0; w<this.arr[h].length; w++) {
				this.obj[h+','+w] = new Tile();
				this.obj[h+','+w].genText();
				this.obj[h+','+w].genChar();
			}
		};
	};
	this.genMap();

	this.player = new Ent({char:'@',type:'player'});
	this.player.pos = {h:3,w:3};
	this.genPlayer = function(h,w){ this.obj[h+','+w].addEnt( this.player ); };
	this.genPlayer(3,3);

	this.addEnt = function(h,w,ent) { this.obj[h+','+w].addEnt( new Ent(ent) ); };

	this.updateArr = function() {
		for (var h=0; h<this.arr.length; h++) {
			let w_ = this.arr[0].length;
			this.arr[h] = '';
			for (var w=0; w<w_; w++) { this.arr[h] += this.obj[h+','+w].genChar(); };
		};
	};
	this.updateArr();

	this.str = '';

	this.genStr = function() { this.updateArr(); this.str = this.arr.join('<br>'); };
	this.genStr();

	this.movePlayer = function(h,w) {
		let pos = { o:false, n:false };
		pos.o = { h: this.player.pos.h, w: this.player.pos.w, str: this.player.pos.h+','+this.player.pos.w };
		pos.n = { h: pos.o.h+h, w: pos.o.w+w, str: (pos.o.h+h)+','+(pos.o.w+w) };
		if (this.obj.hasOwnProperty(pos.n.str)) {
			let player = this.obj[pos.o.str].chars.player.pop();
			this.obj[pos.n.str].chars.player.push(player);
			player.pos = {h:pos.n.h, w:pos.n.w};
			this.obj[pos.o.str].genChar();
			this.obj[pos.n.str].genChar();
			this.updateArr(); this.genStr();
		};
	};
};


var vue = new Vue({
	el: "#vue",
	data: {
		console: console,
		show: true,
		tab : { left:'', middle:'',right:'',right1:'tabBuild' },
		btn: {
			action :{on:false,visible:false},
			continue :{on:false,visible:false}
		},
		sel: {},// global selected?
		child : {
			obj : {
				// all kids who are resting are added to an overall workforce power which can be distributed by percent?
				n1 : new Child({ id: 'n1', name:'Luna', age:11, gender:'girl', response: {pain : 1.0, itch: 1.0, shame: 1.0} }),
				n2 : new Child({ id: 'n2', name:'Chao', age:3, gender:'boy', response: {pain : 1.0, itch: 1.0, shame: 1.0} }),
				n3 : new Child({ id: 'n3', name:'Maru', age:5, gender:'girl', response: {pain : 1.0, itch: 1.0, shame: 1.0} }),
				n4 : new Child({ id: 'n4', name:'Mike', age:1, gender:'boy', response: {pain : 1.0, itch: 1.0, shame: 1.0} }),
			},
			sel : { len: 4, index: 4, free: 0, busy: 0, id:'', data:'' },
			gen : function(data) {
				var index = Object.keys(this.obj).length; var id = 'n'+(index+1); var child = new Child(data);
				child.id = id; this.obj[id] = child; this.sel.id = id; //this.sel.index = Object.keys(this.obj).length
				this.sel.len = Object.keys(this.obj).length;
			},
			switch : function(index) { this.sel.index = index; this.sel.id = this.sel.data.id; this.update(); },
			switchId : function(id) { this.sel.data = this.obj[id]; this.sel.id = id; this.sel.len = Object.keys(this.obj).length; },
			update : function() { this.sel.free=0; for (a in this.obj) {if (this.obj[a].action == 'resting'){this.sel.free+=1;};}; vue.activities.update(); },
			text : '',
		},
		activities : {
			obj: {
				resting: { unlocked: true, children: 0 },
				cuddler: {unlocked: true, children: 0 },
				dreamer: {unlocked: true, children: 0 },
				scientist: {unlocked: true, children: 0 },
				creator: {unlocked: true, children: 0 },
				gatherer: {unlocked: true, children: 0 },
				explorer: {unlocked: true, children: 0 },
			},
			parse: function(name) {
				let v = parseInt(this.obj[name].children);
				this.update();
				let vOld = this.obj[name].children;
				this.add(name,vOld+v);
			},
			add: function(name, value) {
				let v = value;
				for (a in vue.child.obj){
					if (vue.child.obj[a].actions[name]){
						if (v>0 && vue.child.obj[a].action=='resting' && name!='resting') { vue.child.obj[a].action = name; v-=1; console.log(vue.child.obj[a].action); }
					};
				};
				for (a in vue.child.obj){
					if (vue.child.obj[a].actions[name]){
						if (v>0 && vue.child.obj[a].action!=name) { vue.child.obj[a].action = name; v-=1; console.log(vue.child.obj[a].action); }
						else if (v<0 && vue.child.obj[a].action!='resting') { vue.child.obj[a].action = 'resting'; v+=1; console.log(vue.child.obj[a].action); }
					};
				};
				this.update();
				vue.child.update();
			},
			update: function(){
				for (a in this.obj) { this.obj[a].children = 0; };
				for (a in vue.child.obj){ let k = vue.child.obj[a].action; if (this.obj.hasOwnProperty(k)) { this.obj[k].children += 1}; };
			}
		},

		researching: "",
		tech: {
			science : new Tech({tier:0, complexity:100, unlocksTech:['heat'], tooltip:'Scientific method. Research how to research things?'}),
			heat: new Tech({tier:0, complexity:200, unlockedBy:['science'], unlocksRes:['rawWood']}),
			shelter: new Tech({tier:0, complexity:200, unlockedBy:['science'], unlocksBuild:['hut']})
		},
		craft : {
			stimulant : {},
			irritant : {},
		},
		build: {
			obj: {
				pile: new Build({unlocked:false, tier:0, val:0, cost:{wood:10}}),
				box: new Build({unlocked:false, tier:0, val:0, cost:{wood:20}}),
				hut: new Build({unlocked:false, tier:0, val:0, cost:{mud:50}}),
				farm_shroom: new Build({unlocked:false, tier:0, val:0, cost:{mud:50}}),
				farm_herb: new Build({unlocked:false, tier:0, val:0, cost:{mud:50}})
			},
			build : function (name){
				let build = this.obj[name]; let canBuild = true;
				for (a in build.cost){if (build.cost[a]*Math.pow(1.1,1+build.val) > vue.res.obj[a].val) {canBuild=false;}; };
				if (canBuild) { for (a in build.cost){ vue.res.obj[a].val -= build.cost[a]*Math.pow(1.1,1+build.val); }; };
				build.val += 1;
				this.obj[name].genTooltip();
			},
			genTooltip : function(){ for (a in this.obj) {this.obj[a].genTooltip();}; },
			genRes : function(){
				for (a in this.obj) {
					// for (b in this.obj.generate[a])
				};
			}
		},
		// farming: {},
		storage: {},
		res: {
			style : { fontSize : 14 },
			obj : {
				time: new Res({color:'#ffddff',max:20}),
				lineBreak6: new Res({empty:true}),
				food: new Res(), mud: new Res(), wood: new Res(), stone: new Res(), copper: new Res(), iron: new Res(), gold: new Res(), titanium: new Res(), mythril: new Res(),
				lineBreak1: new Res({empty:true}),
				thoughts: new Res({color:'#00ddff'}), ideas: new Res(), knowledge: new Res(), invention: new Res(), blueprint: new Res(), prototype: new Res(),
				lineBreak2: new Res({empty:true}),
				happiness: new Res(), pain: new Res(), itch: new Res(), shame: new Res(),
				lineBreak3: new Res({empty:true}),
				energy: new Res(), mana: new Res(),
				lineBreak4: new Res({empty:true}),
				fire: new Res(), air : new Res(), water: new Res(), earth: new Res(), life: new Res(),
				lineBreak5: new Res({empty:true}),
				shards: new Res(), crystals: new Res(), orbs: new Res(), echos: new Res(), whisps: new Res(), souls: new Res(),
				lineBreak7: new Res({empty:true}),
				skins: new Res(), paper: new Res(),
				planks: new Res(), bricks: new Res(), steel: new Res(), mythium: new Res(), eternium: new Res(),
			},
			update: function(){
				let build = vue.build;
				this.obj.food.max = 10; this.obj.mud.max = 10; this.obj.wood.max = 10; this.obj.stone.max = 10;
				for (a in build.obj){
					for (b in build.obj[a].store){ this.obj[b].max += build.obj[a].store[b] * build.obj[a].val; };
				};
			},
			updateColors: function(){
				for (a in this.obj){ this.obj[a].genColor(); };
			},
			updatePerSec: function(){
				for (a in this.obj) { this.obj[a].genPerSec(); };
			},
		},
		resSpecial: {
			settlement: { type: 'unknown' }
		},
		explore: {
			map : new Map(mapArr),
			movePlayer : function(y,x){ this.map.movePlayer(y,x); }
		},
		log: {
			arr: ["The night is dark."],
			val: 0,
			textObj: {n0:'',n1:'',n2:'',n3:'',n4:'',n5:'',n6:'',n7:''},
			textArr: ['','','','','','','',''],
		},
		options: {
			passiveGainSec: true,
			activeGainPerc: true
		},
		saveFileText: "",
		buttonTech : function(name='name'){
			console.log(name);
			this.tech[name].val+=1;
		},
		update: function(){
			this.res.updateColors();
			this.res.updatePerSec();
		},
	},
	filters: {
  	toFixed: function (value,digits) { return value.toFixed(digits); },
		toFixedPoint: function (value,digits) { return (value<0?"":"+") + (value*0.01).toFixed(digits); },
		toStrLength: function (value,spaces) { return value.padEnd(spaces,'&nbsp') },
	},
});
vue.child.sel.data = vue.child.obj[vue.child.sel.id];

var res = vue.res.obj; var log = vue.log; var btn = vue.btn;

$("#vue").fadeIn(2000);


setInterval("timer()",1000);
function timer() {

	if (res.time.active && res.time.val >=1) {res.time.val+=1};
	logFunct();
	vue.update();
};

// generate energy // convert energy to mana/magic // convert pure mana to elemental // transmute energy into materials
// child page: (children, jobs) // create page: (build, craft) // research pate: (think, research)

var logFunctArr = [
	{ msg:"The night is dark.", funct: function () { log.val+=1; $("#buttonContinue").fadeIn(2000); vue.btn.continue.on = true;} },
	{ msg:"", funct: function() {} },
	{ msg:"Your head hurts, how did you get here?", funct: function () { log.val+=1; vue.btn.continue.on = true;} },
	{ msg:"", funct: function() {} },
	{ msg:"Dark thoughts, you need something to do to chase them away.", funct: function () { vue.btn.continue.on = false; log.val +=1; $("#buttonTime").fadeIn(2000); vue.btn.action.on = true; } },
	{ msg:"", funct: function() {	if (res.time.val >= 1){ log.val+=1; }; } },
	{ msg:"You remember, time is a part of you, you let it flow.", funct: function () { log.val+=1; $("#buttonTime").fadeOut(2000); vue.btn.continue.on = true;} },
	{ msg:"", funct: function() {} },
	{ msg:"In the dark of the night, you see something in need. A child, the child is sad. Sad kids need hugs.", funct: function() { log.val+=1; $("#buttonHug").fadeIn(2000); } },
	{ msg:"", funct: function() { if (res.happiness.val >= 1){ log.val+=1; }; } },
	{ msg:"You feel hot, the feel happy energy. You wonder if this can be used for something.", funct: function() { log.val+=1; $("#menuPages").fadeIn(2000); } },
	{ msg:"", funct: function() {} }
];

function logFunct(){
	if (logFunctArr[log.val].msg != ""){ log.arr.push(logFunctArr[log.val].msg)}
	for (var i=0; i<7; i++) { if (log.arr[log.arr.length-i-1]!=undefined) { log.textArr[i] = log.arr[log.arr.length-i-1]; }; };

	log.textObj.n0 = log.textArr[0]; log.textObj.n1 = log.textArr[1]; log.textObj.n2 = log.textArr[2]; log.textObj.n3 = log.textArr[3];
	log.textObj.n4 = log.textArr[4]; log.textObj.n5 = log.textArr[5]; log.textObj.n6 = log.textArr[6]; log.textObj.n7 = log.textArr[7];

	if (logFunctArr[log.val].funct) { logFunctArr[log.val].funct(); }
}

function buttonContinue(){ vue.btn.continue.on = false; log.val+=1; }

var buttonSpank = 100;
var spankTimer;

var actionTimer;
function buttonAction(name="name",rate=100,step=1){
	if (res[name].bVal==0){
		vue.btn.action.on = false;
		res[name].bVal = 0;
		actionTimer = setInterval(actionTimerFunct,rate);
		function actionTimerFunct(){
			res[name].bVal += step;
			if (res[name].bVal >= 100){
				res[name].bVal=0; res[name].val +=1; vue.btn.action.on=true; res[name].active=true;
				clearInterval(actionTimer);
			};
		};
	};
};

var techTimer;
function buttonTech(name='name'){
	if (vue.tech[name].val==0){
		vue.btn.tech.on = false;
		res[name].bVal = 0;
		techTimer = setInterval(techTimerFunct,rate);
		function actionTimerFunct(){
			res[name].bVal += step;
			if (res[name].bVal >= 100){
				clearInterval(actionTimer);
				res[name].bVal=0; res[name].val +=1; vue.btn.action.on=true;
			};
		};
	};
};

function toggleTab(area, name){
	if (vue.tab[area]!=name) {vue.tab[area]=name;}
	else {vue.tab[area]='';};
}
