
var vue = new Vue({
  el: "#vue",
  data: {
    entity : {
			stat : {
				height : 'height in meters',
				weight : 0,
			},
			genWeight : function () { this.stat.weight = 15*Math.pow(parseFloat(this.stat.height),2.5); },
		},
		message : 0
	},
	filters: {
		toFixed: function (value,digits) { return value.toFixed(digits); },
	},
})


$("#main").fadeIn(1000);
