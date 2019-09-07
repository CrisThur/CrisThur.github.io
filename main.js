
function Page(name='empty',textArr=[]){
  this.name = name;
  this.textArr = textArr;
  //console.log(this);
}

var vue = new Vue({
  el: "#vue",
  data: {
    page : {
      set : function (name) { this.name = name; },
      name : 'blog',
      obj : {
        blog : new Page(
          'Blog',[
            'News are listed here',
            '2019-09-04: Expanded more categories, enhanced the design',
            '2019-09-02: Worked on menus and filled out categories.',
            '2019-09-01: Started the project.',
        ]),
        about : new Page('About',[
          'Warm welcome to my modest website. I am a freelance artist and creator. For as long as I can remember I\'ve been interested in a variety of things, from <b>painting</b>, to <b>writing</b>, to <b>music and coding</b>.',
          'I specialize in digital art, mainly 2d illustrations, photoediting, UI design, and, to a lesser degee, animation and 3d. I\'m fairly interested in foreign langauges and I\'m a hobbyist fiction writer. <b>My native language is Polish</b>, but I am <b>profficient with English</b> and know <b>some German and Japanese.</b>',
          'My active vocabulary in German and Japanese is very rusty. My passive undestanding of spoken German is fairly good, Japanese less so.',
          'Programing is my other hobby. I have dabbled a little into a range of programing langauges, mainly <b>python and javascript</b>, and to a lesser degree ruby and c#.',
          'I worked with a wide range of tools, including: photoshop, indesign, corel, gimp, inkscape, blender, audacity, LMMS, microsoft office and libre office, and many other tools, with a preference for open source.',
          'I mainly use Windows, but I also used MacOS and Linux in the past, and have a rudimentary understanding of both.'
        ]),
        apps : new Page('Apps',['A list of scripts and apps']),
        graphic : new Page('Graphic',['A choice of arts']),
        notes : new Page(
          'Notes',[
            'The world can still be better, we need to make it better.',
            'Below I present a list of some of the tools I worked with. It is by no means a complete list, but it is a lot of tools, and while I used some extensively, I used others in a very limited amount:',
            'Graphic/2d bitmap: photoshop, krita, gimp, sai, open canvas, photoimpact, corel, painter, paint shop pro',
            'Graphic/2d vector: inkscape, indesign',
            'Graphic 3d: blender',
            'Video: OBS studio, flash, Adobe After Effects',
            'Audio: audacity, LMMS, sunVox',
            'Game engines/visual environments: unity, rpg maker, renpy',
            'Text tools: microsoft office, open office/libre office, jedit, atom, editra, notepad++',
            'Programing langauges: javascript, python, ruby, c#, haxe',
            'html related: html, CSS, jQuerry, vue'
        ]),
        links : new Page('Links',['Links to interesting places']),
        other : new Page('Other',['Everything else. I don\'t know what to put here yet.'])
      },
      img : {
        illustration : ['drawing001ad', 'painting001b', 'ver3e3_mix', 'cutescene241', 'bg001dv2', 'desolated_landscape001d'],
        expression : ['abstract1973a', 'abstract1974', 'abstract1977', 'abstract1980', 'freeform2253s', 'freeform2089'],
        vector : ['rpgicons', 'christmass', 'magic'],
        pixel : ['continentMap1a','hexTilesetC','Untitled124234c'],
        sculpture : ['sc001', 'sc002', 'sc003', 'sc004', 'sc005', 'sc006'],
      }
    },
  },
})


$('.test-popup-link').magnificPopup({
  type: 'image'
  // other options
});

$(".main-fade").fadeIn(1000);
