(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Router = require("Router.jsx").Router;

var DashboardController = require("./pages/controllers/DashboardController.jsx").DashboardController;

var RunHistoryController = require("./pages/controllers/RunHistoryController.jsx").RunHistoryController;

var FileNotFoundController = require("./pages/controllers/FileNotFoundController.jsx").FileNotFoundController;

var RunDataController = require("./pages/controllers/RunDataController.jsx").RunDataController;

var moment = require("moment");

(function () {
    window.app = {};

    window.app.moment = moment;
    window.app.dayFormat = "dddd, MMM Do YYYY";
    window.app.timeFormat = "h:mm:ss a";

    window.app.router = new Router("mount");
    var router = window.app.router;

    router.addRoute("/404", FileNotFoundController);
    router.addRoute("/dashboard", DashboardController);
    router.addRoute("/history", RunHistoryController);
    router.addRoute("/run/:run", RunDataController);
    router.addRoute("/", DashboardController);

    router.start();
})();

},{"./pages/controllers/DashboardController.jsx":27,"./pages/controllers/FileNotFoundController.jsx":28,"./pages/controllers/RunDataController.jsx":30,"./pages/controllers/RunHistoryController.jsx":31,"Router.jsx":8,"moment":4}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
/*!
 * Chart.js
 * http://chartjs.org/
 * Version: 1.0.2
 *
 * Copyright 2015 Nick Downie
 * Released under the MIT license
 * https://github.com/nnnick/Chart.js/blob/master/LICENSE.md
 */


(function(){

	"use strict";

	//Declare root variable - window in the browser, global on the server
	var root = this,
		previous = root.Chart;

	//Occupy the global variable of Chart, and create a simple base class
	var Chart = function(context){
		var chart = this;
		this.canvas = context.canvas;

		this.ctx = context;

		//Variables global to the chart
		var computeDimension = function(element,dimension)
		{
			if (element['offset'+dimension])
			{
				return element['offset'+dimension];
			}
			else
			{
				return document.defaultView.getComputedStyle(element).getPropertyValue(dimension);
			}
		}

		var width = this.width = computeDimension(context.canvas,'Width');
		var height = this.height = computeDimension(context.canvas,'Height');

		// Firefox requires this to work correctly
		context.canvas.width  = width;
		context.canvas.height = height;

		var width = this.width = context.canvas.width;
		var height = this.height = context.canvas.height;
		this.aspectRatio = this.width / this.height;
		//High pixel density displays - multiply the size of the canvas height/width by the device pixel ratio, then scale.
		helpers.retinaScale(this);

		return this;
	};
	//Globally expose the defaults to allow for user updating/changing
	Chart.defaults = {
		global: {
			// Boolean - Whether to animate the chart
			animation: true,

			// Number - Number of animation steps
			animationSteps: 60,

			// String - Animation easing effect
			animationEasing: "easeOutQuart",

			// Boolean - If we should show the scale at all
			showScale: true,

			// Boolean - If we want to override with a hard coded scale
			scaleOverride: false,

			// ** Required if scaleOverride is true **
			// Number - The number of steps in a hard coded scale
			scaleSteps: null,
			// Number - The value jump in the hard coded scale
			scaleStepWidth: null,
			// Number - The scale starting value
			scaleStartValue: null,

			// String - Colour of the scale line
			scaleLineColor: "rgba(0,0,0,.1)",

			// Number - Pixel width of the scale line
			scaleLineWidth: 1,

			// Boolean - Whether to show labels on the scale
			scaleShowLabels: true,

			// Interpolated JS string - can access value
			scaleLabel: "<%=value%>",

			// Boolean - Whether the scale should stick to integers, and not show any floats even if drawing space is there
			scaleIntegersOnly: true,

			// Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
			scaleBeginAtZero: false,

			// String - Scale label font declaration for the scale label
			scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

			// Number - Scale label font size in pixels
			scaleFontSize: 12,

			// String - Scale label font weight style
			scaleFontStyle: "normal",

			// String - Scale label font colour
			scaleFontColor: "#666",

			// Boolean - whether or not the chart should be responsive and resize when the browser does.
			responsive: false,

			// Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
			maintainAspectRatio: true,

			// Boolean - Determines whether to draw tooltips on the canvas or not - attaches events to touchmove & mousemove
			showTooltips: true,

			// Boolean - Determines whether to draw built-in tooltip or call custom tooltip function
			customTooltips: false,

			// Array - Array of string names to attach tooltip events
			tooltipEvents: ["mousemove", "touchstart", "touchmove", "mouseout"],

			// String - Tooltip background colour
			tooltipFillColor: "rgba(0,0,0,0.8)",

			// String - Tooltip label font declaration for the scale label
			tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

			// Number - Tooltip label font size in pixels
			tooltipFontSize: 14,

			// String - Tooltip font weight style
			tooltipFontStyle: "normal",

			// String - Tooltip label font colour
			tooltipFontColor: "#fff",

			// String - Tooltip title font declaration for the scale label
			tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

			// Number - Tooltip title font size in pixels
			tooltipTitleFontSize: 14,

			// String - Tooltip title font weight style
			tooltipTitleFontStyle: "bold",

			// String - Tooltip title font colour
			tooltipTitleFontColor: "#fff",

			// Number - pixel width of padding around tooltip text
			tooltipYPadding: 6,

			// Number - pixel width of padding around tooltip text
			tooltipXPadding: 6,

			// Number - Size of the caret on the tooltip
			tooltipCaretSize: 8,

			// Number - Pixel radius of the tooltip border
			tooltipCornerRadius: 6,

			// Number - Pixel offset from point x to tooltip edge
			tooltipXOffset: 10,

			// String - Template string for single tooltips
			tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

			// String - Template string for single tooltips
			multiTooltipTemplate: "<%= value %>",

			// String - Colour behind the legend colour block
			multiTooltipKeyBackground: '#fff',

			// Function - Will fire on animation progression.
			onAnimationProgress: function(){},

			// Function - Will fire on animation completion.
			onAnimationComplete: function(){}

		}
	};

	//Create a dictionary of chart types, to allow for extension of existing types
	Chart.types = {};

	//Global Chart helpers object for utility methods and classes
	var helpers = Chart.helpers = {};

		//-- Basic js utility methods
	var each = helpers.each = function(loopable,callback,self){
			var additionalArgs = Array.prototype.slice.call(arguments, 3);
			// Check to see if null or undefined firstly.
			if (loopable){
				if (loopable.length === +loopable.length){
					var i;
					for (i=0; i<loopable.length; i++){
						callback.apply(self,[loopable[i], i].concat(additionalArgs));
					}
				}
				else{
					for (var item in loopable){
						callback.apply(self,[loopable[item],item].concat(additionalArgs));
					}
				}
			}
		},
		clone = helpers.clone = function(obj){
			var objClone = {};
			each(obj,function(value,key){
				if (obj.hasOwnProperty(key)) objClone[key] = value;
			});
			return objClone;
		},
		extend = helpers.extend = function(base){
			each(Array.prototype.slice.call(arguments,1), function(extensionObject) {
				each(extensionObject,function(value,key){
					if (extensionObject.hasOwnProperty(key)) base[key] = value;
				});
			});
			return base;
		},
		merge = helpers.merge = function(base,master){
			//Merge properties in left object over to a shallow clone of object right.
			var args = Array.prototype.slice.call(arguments,0);
			args.unshift({});
			return extend.apply(null, args);
		},
		indexOf = helpers.indexOf = function(arrayToSearch, item){
			if (Array.prototype.indexOf) {
				return arrayToSearch.indexOf(item);
			}
			else{
				for (var i = 0; i < arrayToSearch.length; i++) {
					if (arrayToSearch[i] === item) return i;
				}
				return -1;
			}
		},
		where = helpers.where = function(collection, filterCallback){
			var filtered = [];

			helpers.each(collection, function(item){
				if (filterCallback(item)){
					filtered.push(item);
				}
			});

			return filtered;
		},
		findNextWhere = helpers.findNextWhere = function(arrayToSearch, filterCallback, startIndex){
			// Default to start of the array
			if (!startIndex){
				startIndex = -1;
			}
			for (var i = startIndex + 1; i < arrayToSearch.length; i++) {
				var currentItem = arrayToSearch[i];
				if (filterCallback(currentItem)){
					return currentItem;
				}
			}
		},
		findPreviousWhere = helpers.findPreviousWhere = function(arrayToSearch, filterCallback, startIndex){
			// Default to end of the array
			if (!startIndex){
				startIndex = arrayToSearch.length;
			}
			for (var i = startIndex - 1; i >= 0; i--) {
				var currentItem = arrayToSearch[i];
				if (filterCallback(currentItem)){
					return currentItem;
				}
			}
		},
		inherits = helpers.inherits = function(extensions){
			//Basic javascript inheritance based on the model created in Backbone.js
			var parent = this;
			var ChartElement = (extensions && extensions.hasOwnProperty("constructor")) ? extensions.constructor : function(){ return parent.apply(this, arguments); };

			var Surrogate = function(){ this.constructor = ChartElement;};
			Surrogate.prototype = parent.prototype;
			ChartElement.prototype = new Surrogate();

			ChartElement.extend = inherits;

			if (extensions) extend(ChartElement.prototype, extensions);

			ChartElement.__super__ = parent.prototype;

			return ChartElement;
		},
		noop = helpers.noop = function(){},
		uid = helpers.uid = (function(){
			var id=0;
			return function(){
				return "chart-" + id++;
			};
		})(),
		warn = helpers.warn = function(str){
			//Method for warning of errors
			if (window.console && typeof window.console.warn == "function") console.warn(str);
		},
		amd = helpers.amd = (typeof define == 'function' && define.amd),
		//-- Math methods
		isNumber = helpers.isNumber = function(n){
			return !isNaN(parseFloat(n)) && isFinite(n);
		},
		max = helpers.max = function(array){
			return Math.max.apply( Math, array );
		},
		min = helpers.min = function(array){
			return Math.min.apply( Math, array );
		},
		cap = helpers.cap = function(valueToCap,maxValue,minValue){
			if(isNumber(maxValue)) {
				if( valueToCap > maxValue ) {
					return maxValue;
				}
			}
			else if(isNumber(minValue)){
				if ( valueToCap < minValue ){
					return minValue;
				}
			}
			return valueToCap;
		},
		getDecimalPlaces = helpers.getDecimalPlaces = function(num){
			if (num%1!==0 && isNumber(num)){
				return num.toString().split(".")[1].length;
			}
			else {
				return 0;
			}
		},
		toRadians = helpers.radians = function(degrees){
			return degrees * (Math.PI/180);
		},
		// Gets the angle from vertical upright to the point about a centre.
		getAngleFromPoint = helpers.getAngleFromPoint = function(centrePoint, anglePoint){
			var distanceFromXCenter = anglePoint.x - centrePoint.x,
				distanceFromYCenter = anglePoint.y - centrePoint.y,
				radialDistanceFromCenter = Math.sqrt( distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);


			var angle = Math.PI * 2 + Math.atan2(distanceFromYCenter, distanceFromXCenter);

			//If the segment is in the top left quadrant, we need to add another rotation to the angle
			if (distanceFromXCenter < 0 && distanceFromYCenter < 0){
				angle += Math.PI*2;
			}

			return {
				angle: angle,
				distance: radialDistanceFromCenter
			};
		},
		aliasPixel = helpers.aliasPixel = function(pixelWidth){
			return (pixelWidth % 2 === 0) ? 0 : 0.5;
		},
		splineCurve = helpers.splineCurve = function(FirstPoint,MiddlePoint,AfterPoint,t){
			//Props to Rob Spencer at scaled innovation for his post on splining between points
			//http://scaledinnovation.com/analytics/splines/aboutSplines.html
			var d01=Math.sqrt(Math.pow(MiddlePoint.x-FirstPoint.x,2)+Math.pow(MiddlePoint.y-FirstPoint.y,2)),
				d12=Math.sqrt(Math.pow(AfterPoint.x-MiddlePoint.x,2)+Math.pow(AfterPoint.y-MiddlePoint.y,2)),
				fa=t*d01/(d01+d12),// scaling factor for triangle Ta
				fb=t*d12/(d01+d12);
			return {
				inner : {
					x : MiddlePoint.x-fa*(AfterPoint.x-FirstPoint.x),
					y : MiddlePoint.y-fa*(AfterPoint.y-FirstPoint.y)
				},
				outer : {
					x: MiddlePoint.x+fb*(AfterPoint.x-FirstPoint.x),
					y : MiddlePoint.y+fb*(AfterPoint.y-FirstPoint.y)
				}
			};
		},
		calculateOrderOfMagnitude = helpers.calculateOrderOfMagnitude = function(val){
			return Math.floor(Math.log(val) / Math.LN10);
		},
		calculateScaleRange = helpers.calculateScaleRange = function(valuesArray, drawingSize, textSize, startFromZero, integersOnly){

			//Set a minimum step of two - a point at the top of the graph, and a point at the base
			var minSteps = 2,
				maxSteps = Math.floor(drawingSize/(textSize * 1.5)),
				skipFitting = (minSteps >= maxSteps);

			var maxValue = max(valuesArray),
				minValue = min(valuesArray);

			// We need some degree of seperation here to calculate the scales if all the values are the same
			// Adding/minusing 0.5 will give us a range of 1.
			if (maxValue === minValue){
				maxValue += 0.5;
				// So we don't end up with a graph with a negative start value if we've said always start from zero
				if (minValue >= 0.5 && !startFromZero){
					minValue -= 0.5;
				}
				else{
					// Make up a whole number above the values
					maxValue += 0.5;
				}
			}

			var	valueRange = Math.abs(maxValue - minValue),
				rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange),
				graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude),
				graphMin = (startFromZero) ? 0 : Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude),
				graphRange = graphMax - graphMin,
				stepValue = Math.pow(10, rangeOrderOfMagnitude),
				numberOfSteps = Math.round(graphRange / stepValue);

			//If we have more space on the graph we'll use it to give more definition to the data
			while((numberOfSteps > maxSteps || (numberOfSteps * 2) < maxSteps) && !skipFitting) {
				if(numberOfSteps > maxSteps){
					stepValue *=2;
					numberOfSteps = Math.round(graphRange/stepValue);
					// Don't ever deal with a decimal number of steps - cancel fitting and just use the minimum number of steps.
					if (numberOfSteps % 1 !== 0){
						skipFitting = true;
					}
				}
				//We can fit in double the amount of scale points on the scale
				else{
					//If user has declared ints only, and the step value isn't a decimal
					if (integersOnly && rangeOrderOfMagnitude >= 0){
						//If the user has said integers only, we need to check that making the scale more granular wouldn't make it a float
						if(stepValue/2 % 1 === 0){
							stepValue /=2;
							numberOfSteps = Math.round(graphRange/stepValue);
						}
						//If it would make it a float break out of the loop
						else{
							break;
						}
					}
					//If the scale doesn't have to be an int, make the scale more granular anyway.
					else{
						stepValue /=2;
						numberOfSteps = Math.round(graphRange/stepValue);
					}

				}
			}

			if (skipFitting){
				numberOfSteps = minSteps;
				stepValue = graphRange / numberOfSteps;
			}

			return {
				steps : numberOfSteps,
				stepValue : stepValue,
				min : graphMin,
				max	: graphMin + (numberOfSteps * stepValue)
			};

		},
		/* jshint ignore:start */
		// Blows up jshint errors based on the new Function constructor
		//Templating methods
		//Javascript micro templating by John Resig - source at http://ejohn.org/blog/javascript-micro-templating/
		template = helpers.template = function(templateString, valuesObject){

			// If templateString is function rather than string-template - call the function for valuesObject

			if(templateString instanceof Function){
			 	return templateString(valuesObject);
		 	}

			var cache = {};
			function tmpl(str, data){
				// Figure out if we're getting a template, or if we need to
				// load the template - and be sure to cache the result.
				var fn = !/\W/.test(str) ?
				cache[str] = cache[str] :

				// Generate a reusable function that will serve as a template
				// generator (and which will be cached).
				new Function("obj",
					"var p=[],print=function(){p.push.apply(p,arguments);};" +

					// Introduce the data as local variables using with(){}
					"with(obj){p.push('" +

					// Convert the template into pure JavaScript
					str
						.replace(/[\r\t\n]/g, " ")
						.split("<%").join("\t")
						.replace(/((^|%>)[^\t]*)'/g, "$1\r")
						.replace(/\t=(.*?)%>/g, "',$1,'")
						.split("\t").join("');")
						.split("%>").join("p.push('")
						.split("\r").join("\\'") +
					"');}return p.join('');"
				);

				// Provide some basic currying to the user
				return data ? fn( data ) : fn;
			}
			return tmpl(templateString,valuesObject);
		},
		/* jshint ignore:end */
		generateLabels = helpers.generateLabels = function(templateString,numberOfSteps,graphMin,stepValue){
			var labelsArray = new Array(numberOfSteps);
			if (labelTemplateString){
				each(labelsArray,function(val,index){
					labelsArray[index] = template(templateString,{value: (graphMin + (stepValue*(index+1)))});
				});
			}
			return labelsArray;
		},
		//--Animation methods
		//Easing functions adapted from Robert Penner's easing equations
		//http://www.robertpenner.com/easing/
		easingEffects = helpers.easingEffects = {
			linear: function (t) {
				return t;
			},
			easeInQuad: function (t) {
				return t * t;
			},
			easeOutQuad: function (t) {
				return -1 * t * (t - 2);
			},
			easeInOutQuad: function (t) {
				if ((t /= 1 / 2) < 1) return 1 / 2 * t * t;
				return -1 / 2 * ((--t) * (t - 2) - 1);
			},
			easeInCubic: function (t) {
				return t * t * t;
			},
			easeOutCubic: function (t) {
				return 1 * ((t = t / 1 - 1) * t * t + 1);
			},
			easeInOutCubic: function (t) {
				if ((t /= 1 / 2) < 1) return 1 / 2 * t * t * t;
				return 1 / 2 * ((t -= 2) * t * t + 2);
			},
			easeInQuart: function (t) {
				return t * t * t * t;
			},
			easeOutQuart: function (t) {
				return -1 * ((t = t / 1 - 1) * t * t * t - 1);
			},
			easeInOutQuart: function (t) {
				if ((t /= 1 / 2) < 1) return 1 / 2 * t * t * t * t;
				return -1 / 2 * ((t -= 2) * t * t * t - 2);
			},
			easeInQuint: function (t) {
				return 1 * (t /= 1) * t * t * t * t;
			},
			easeOutQuint: function (t) {
				return 1 * ((t = t / 1 - 1) * t * t * t * t + 1);
			},
			easeInOutQuint: function (t) {
				if ((t /= 1 / 2) < 1) return 1 / 2 * t * t * t * t * t;
				return 1 / 2 * ((t -= 2) * t * t * t * t + 2);
			},
			easeInSine: function (t) {
				return -1 * Math.cos(t / 1 * (Math.PI / 2)) + 1;
			},
			easeOutSine: function (t) {
				return 1 * Math.sin(t / 1 * (Math.PI / 2));
			},
			easeInOutSine: function (t) {
				return -1 / 2 * (Math.cos(Math.PI * t / 1) - 1);
			},
			easeInExpo: function (t) {
				return (t === 0) ? 1 : 1 * Math.pow(2, 10 * (t / 1 - 1));
			},
			easeOutExpo: function (t) {
				return (t === 1) ? 1 : 1 * (-Math.pow(2, -10 * t / 1) + 1);
			},
			easeInOutExpo: function (t) {
				if (t === 0) return 0;
				if (t === 1) return 1;
				if ((t /= 1 / 2) < 1) return 1 / 2 * Math.pow(2, 10 * (t - 1));
				return 1 / 2 * (-Math.pow(2, -10 * --t) + 2);
			},
			easeInCirc: function (t) {
				if (t >= 1) return t;
				return -1 * (Math.sqrt(1 - (t /= 1) * t) - 1);
			},
			easeOutCirc: function (t) {
				return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t);
			},
			easeInOutCirc: function (t) {
				if ((t /= 1 / 2) < 1) return -1 / 2 * (Math.sqrt(1 - t * t) - 1);
				return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);
			},
			easeInElastic: function (t) {
				var s = 1.70158;
				var p = 0;
				var a = 1;
				if (t === 0) return 0;
				if ((t /= 1) == 1) return 1;
				if (!p) p = 1 * 0.3;
				if (a < Math.abs(1)) {
					a = 1;
					s = p / 4;
				} else s = p / (2 * Math.PI) * Math.asin(1 / a);
				return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
			},
			easeOutElastic: function (t) {
				var s = 1.70158;
				var p = 0;
				var a = 1;
				if (t === 0) return 0;
				if ((t /= 1) == 1) return 1;
				if (!p) p = 1 * 0.3;
				if (a < Math.abs(1)) {
					a = 1;
					s = p / 4;
				} else s = p / (2 * Math.PI) * Math.asin(1 / a);
				return a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1;
			},
			easeInOutElastic: function (t) {
				var s = 1.70158;
				var p = 0;
				var a = 1;
				if (t === 0) return 0;
				if ((t /= 1 / 2) == 2) return 1;
				if (!p) p = 1 * (0.3 * 1.5);
				if (a < Math.abs(1)) {
					a = 1;
					s = p / 4;
				} else s = p / (2 * Math.PI) * Math.asin(1 / a);
				if (t < 1) return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
				return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) * 0.5 + 1;
			},
			easeInBack: function (t) {
				var s = 1.70158;
				return 1 * (t /= 1) * t * ((s + 1) * t - s);
			},
			easeOutBack: function (t) {
				var s = 1.70158;
				return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1);
			},
			easeInOutBack: function (t) {
				var s = 1.70158;
				if ((t /= 1 / 2) < 1) return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s));
				return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
			},
			easeInBounce: function (t) {
				return 1 - easingEffects.easeOutBounce(1 - t);
			},
			easeOutBounce: function (t) {
				if ((t /= 1) < (1 / 2.75)) {
					return 1 * (7.5625 * t * t);
				} else if (t < (2 / 2.75)) {
					return 1 * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75);
				} else if (t < (2.5 / 2.75)) {
					return 1 * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375);
				} else {
					return 1 * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375);
				}
			},
			easeInOutBounce: function (t) {
				if (t < 1 / 2) return easingEffects.easeInBounce(t * 2) * 0.5;
				return easingEffects.easeOutBounce(t * 2 - 1) * 0.5 + 1 * 0.5;
			}
		},
		//Request animation polyfill - http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
		requestAnimFrame = helpers.requestAnimFrame = (function(){
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function(callback) {
					return window.setTimeout(callback, 1000 / 60);
				};
		})(),
		cancelAnimFrame = helpers.cancelAnimFrame = (function(){
			return window.cancelAnimationFrame ||
				window.webkitCancelAnimationFrame ||
				window.mozCancelAnimationFrame ||
				window.oCancelAnimationFrame ||
				window.msCancelAnimationFrame ||
				function(callback) {
					return window.clearTimeout(callback, 1000 / 60);
				};
		})(),
		animationLoop = helpers.animationLoop = function(callback,totalSteps,easingString,onProgress,onComplete,chartInstance){

			var currentStep = 0,
				easingFunction = easingEffects[easingString] || easingEffects.linear;

			var animationFrame = function(){
				currentStep++;
				var stepDecimal = currentStep/totalSteps;
				var easeDecimal = easingFunction(stepDecimal);

				callback.call(chartInstance,easeDecimal,stepDecimal, currentStep);
				onProgress.call(chartInstance,easeDecimal,stepDecimal);
				if (currentStep < totalSteps){
					chartInstance.animationFrame = requestAnimFrame(animationFrame);
				} else{
					onComplete.apply(chartInstance);
				}
			};
			requestAnimFrame(animationFrame);
		},
		//-- DOM methods
		getRelativePosition = helpers.getRelativePosition = function(evt){
			var mouseX, mouseY;
			var e = evt.originalEvent || evt,
				canvas = evt.currentTarget || evt.srcElement,
				boundingRect = canvas.getBoundingClientRect();

			if (e.touches){
				mouseX = e.touches[0].clientX - boundingRect.left;
				mouseY = e.touches[0].clientY - boundingRect.top;

			}
			else{
				mouseX = e.clientX - boundingRect.left;
				mouseY = e.clientY - boundingRect.top;
			}

			return {
				x : mouseX,
				y : mouseY
			};

		},
		addEvent = helpers.addEvent = function(node,eventType,method){
			if (node.addEventListener){
				node.addEventListener(eventType,method);
			} else if (node.attachEvent){
				node.attachEvent("on"+eventType, method);
			} else {
				node["on"+eventType] = method;
			}
		},
		removeEvent = helpers.removeEvent = function(node, eventType, handler){
			if (node.removeEventListener){
				node.removeEventListener(eventType, handler, false);
			} else if (node.detachEvent){
				node.detachEvent("on"+eventType,handler);
			} else{
				node["on" + eventType] = noop;
			}
		},
		bindEvents = helpers.bindEvents = function(chartInstance, arrayOfEvents, handler){
			// Create the events object if it's not already present
			if (!chartInstance.events) chartInstance.events = {};

			each(arrayOfEvents,function(eventName){
				chartInstance.events[eventName] = function(){
					handler.apply(chartInstance, arguments);
				};
				addEvent(chartInstance.chart.canvas,eventName,chartInstance.events[eventName]);
			});
		},
		unbindEvents = helpers.unbindEvents = function (chartInstance, arrayOfEvents) {
			each(arrayOfEvents, function(handler,eventName){
				removeEvent(chartInstance.chart.canvas, eventName, handler);
			});
		},
		getMaximumWidth = helpers.getMaximumWidth = function(domNode){
			var container = domNode.parentNode;
			// TODO = check cross browser stuff with this.
			return container.clientWidth;
		},
		getMaximumHeight = helpers.getMaximumHeight = function(domNode){
			var container = domNode.parentNode;
			// TODO = check cross browser stuff with this.
			return container.clientHeight;
		},
		getMaximumSize = helpers.getMaximumSize = helpers.getMaximumWidth, // legacy support
		retinaScale = helpers.retinaScale = function(chart){
			var ctx = chart.ctx,
				width = chart.canvas.width,
				height = chart.canvas.height;

			if (window.devicePixelRatio) {
				ctx.canvas.style.width = width + "px";
				ctx.canvas.style.height = height + "px";
				ctx.canvas.height = height * window.devicePixelRatio;
				ctx.canvas.width = width * window.devicePixelRatio;
				ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
			}
		},
		//-- Canvas methods
		clear = helpers.clear = function(chart){
			chart.ctx.clearRect(0,0,chart.width,chart.height);
		},
		fontString = helpers.fontString = function(pixelSize,fontStyle,fontFamily){
			return fontStyle + " " + pixelSize+"px " + fontFamily;
		},
		longestText = helpers.longestText = function(ctx,font,arrayOfStrings){
			ctx.font = font;
			var longest = 0;
			each(arrayOfStrings,function(string){
				var textWidth = ctx.measureText(string).width;
				longest = (textWidth > longest) ? textWidth : longest;
			});
			return longest;
		},
		drawRoundedRectangle = helpers.drawRoundedRectangle = function(ctx,x,y,width,height,radius){
			ctx.beginPath();
			ctx.moveTo(x + radius, y);
			ctx.lineTo(x + width - radius, y);
			ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
			ctx.lineTo(x + width, y + height - radius);
			ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
			ctx.lineTo(x + radius, y + height);
			ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
			ctx.lineTo(x, y + radius);
			ctx.quadraticCurveTo(x, y, x + radius, y);
			ctx.closePath();
		};


	//Store a reference to each instance - allowing us to globally resize chart instances on window resize.
	//Destroy method on the chart will remove the instance of the chart from this reference.
	Chart.instances = {};

	Chart.Type = function(data,options,chart){
		this.options = options;
		this.chart = chart;
		this.id = uid();
		//Add the chart instance to the global namespace
		Chart.instances[this.id] = this;

		// Initialize is always called when a chart type is created
		// By default it is a no op, but it should be extended
		if (options.responsive){
			this.resize();
		}
		this.initialize.call(this,data);
	};

	//Core methods that'll be a part of every chart type
	extend(Chart.Type.prototype,{
		initialize : function(){return this;},
		clear : function(){
			clear(this.chart);
			return this;
		},
		stop : function(){
			// Stops any current animation loop occuring
			cancelAnimFrame(this.animationFrame);
			return this;
		},
		resize : function(callback){
			this.stop();
			var canvas = this.chart.canvas,
				newWidth = getMaximumWidth(this.chart.canvas),
				newHeight = this.options.maintainAspectRatio ? newWidth / this.chart.aspectRatio : getMaximumHeight(this.chart.canvas);

			canvas.width = this.chart.width = newWidth;
			canvas.height = this.chart.height = newHeight;

			retinaScale(this.chart);

			if (typeof callback === "function"){
				callback.apply(this, Array.prototype.slice.call(arguments, 1));
			}
			return this;
		},
		reflow : noop,
		render : function(reflow){
			if (reflow){
				this.reflow();
			}
			if (this.options.animation && !reflow){
				helpers.animationLoop(
					this.draw,
					this.options.animationSteps,
					this.options.animationEasing,
					this.options.onAnimationProgress,
					this.options.onAnimationComplete,
					this
				);
			}
			else{
				this.draw();
				this.options.onAnimationComplete.call(this);
			}
			return this;
		},
		generateLegend : function(){
			return template(this.options.legendTemplate,this);
		},
		destroy : function(){
			this.clear();
			unbindEvents(this, this.events);
			var canvas = this.chart.canvas;

			// Reset canvas height/width attributes starts a fresh with the canvas context
			canvas.width = this.chart.width;
			canvas.height = this.chart.height;

			// < IE9 doesn't support removeProperty
			if (canvas.style.removeProperty) {
				canvas.style.removeProperty('width');
				canvas.style.removeProperty('height');
			} else {
				canvas.style.removeAttribute('width');
				canvas.style.removeAttribute('height');
			}

			delete Chart.instances[this.id];
		},
		showTooltip : function(ChartElements, forceRedraw){
			// Only redraw the chart if we've actually changed what we're hovering on.
			if (typeof this.activeElements === 'undefined') this.activeElements = [];

			var isChanged = (function(Elements){
				var changed = false;

				if (Elements.length !== this.activeElements.length){
					changed = true;
					return changed;
				}

				each(Elements, function(element, index){
					if (element !== this.activeElements[index]){
						changed = true;
					}
				}, this);
				return changed;
			}).call(this, ChartElements);

			if (!isChanged && !forceRedraw){
				return;
			}
			else{
				this.activeElements = ChartElements;
			}
			this.draw();
			if(this.options.customTooltips){
				this.options.customTooltips(false);
			}
			if (ChartElements.length > 0){
				// If we have multiple datasets, show a MultiTooltip for all of the data points at that index
				if (this.datasets && this.datasets.length > 1) {
					var dataArray,
						dataIndex;

					for (var i = this.datasets.length - 1; i >= 0; i--) {
						dataArray = this.datasets[i].points || this.datasets[i].bars || this.datasets[i].segments;
						dataIndex = indexOf(dataArray, ChartElements[0]);
						if (dataIndex !== -1){
							break;
						}
					}
					var tooltipLabels = [],
						tooltipColors = [],
						medianPosition = (function(index) {

							// Get all the points at that particular index
							var Elements = [],
								dataCollection,
								xPositions = [],
								yPositions = [],
								xMax,
								yMax,
								xMin,
								yMin;
							helpers.each(this.datasets, function(dataset){
								dataCollection = dataset.points || dataset.bars || dataset.segments;
								if (dataCollection[dataIndex] && dataCollection[dataIndex].hasValue()){
									Elements.push(dataCollection[dataIndex]);
								}
							});

							helpers.each(Elements, function(element) {
								xPositions.push(element.x);
								yPositions.push(element.y);


								//Include any colour information about the element
								tooltipLabels.push(helpers.template(this.options.multiTooltipTemplate, element));
								tooltipColors.push({
									fill: element._saved.fillColor || element.fillColor,
									stroke: element._saved.strokeColor || element.strokeColor
								});

							}, this);

							yMin = min(yPositions);
							yMax = max(yPositions);

							xMin = min(xPositions);
							xMax = max(xPositions);

							return {
								x: (xMin > this.chart.width/2) ? xMin : xMax,
								y: (yMin + yMax)/2
							};
						}).call(this, dataIndex);

					new Chart.MultiTooltip({
						x: medianPosition.x,
						y: medianPosition.y,
						xPadding: this.options.tooltipXPadding,
						yPadding: this.options.tooltipYPadding,
						xOffset: this.options.tooltipXOffset,
						fillColor: this.options.tooltipFillColor,
						textColor: this.options.tooltipFontColor,
						fontFamily: this.options.tooltipFontFamily,
						fontStyle: this.options.tooltipFontStyle,
						fontSize: this.options.tooltipFontSize,
						titleTextColor: this.options.tooltipTitleFontColor,
						titleFontFamily: this.options.tooltipTitleFontFamily,
						titleFontStyle: this.options.tooltipTitleFontStyle,
						titleFontSize: this.options.tooltipTitleFontSize,
						cornerRadius: this.options.tooltipCornerRadius,
						labels: tooltipLabels,
						legendColors: tooltipColors,
						legendColorBackground : this.options.multiTooltipKeyBackground,
						title: ChartElements[0].label,
						chart: this.chart,
						ctx: this.chart.ctx,
						custom: this.options.customTooltips
					}).draw();

				} else {
					each(ChartElements, function(Element) {
						var tooltipPosition = Element.tooltipPosition();
						new Chart.Tooltip({
							x: Math.round(tooltipPosition.x),
							y: Math.round(tooltipPosition.y),
							xPadding: this.options.tooltipXPadding,
							yPadding: this.options.tooltipYPadding,
							fillColor: this.options.tooltipFillColor,
							textColor: this.options.tooltipFontColor,
							fontFamily: this.options.tooltipFontFamily,
							fontStyle: this.options.tooltipFontStyle,
							fontSize: this.options.tooltipFontSize,
							caretHeight: this.options.tooltipCaretSize,
							cornerRadius: this.options.tooltipCornerRadius,
							text: template(this.options.tooltipTemplate, Element),
							chart: this.chart,
							custom: this.options.customTooltips
						}).draw();
					}, this);
				}
			}
			return this;
		},
		toBase64Image : function(){
			return this.chart.canvas.toDataURL.apply(this.chart.canvas, arguments);
		}
	});

	Chart.Type.extend = function(extensions){

		var parent = this;

		var ChartType = function(){
			return parent.apply(this,arguments);
		};

		//Copy the prototype object of the this class
		ChartType.prototype = clone(parent.prototype);
		//Now overwrite some of the properties in the base class with the new extensions
		extend(ChartType.prototype, extensions);

		ChartType.extend = Chart.Type.extend;

		if (extensions.name || parent.prototype.name){

			var chartName = extensions.name || parent.prototype.name;
			//Assign any potential default values of the new chart type

			//If none are defined, we'll use a clone of the chart type this is being extended from.
			//I.e. if we extend a line chart, we'll use the defaults from the line chart if our new chart
			//doesn't define some defaults of their own.

			var baseDefaults = (Chart.defaults[parent.prototype.name]) ? clone(Chart.defaults[parent.prototype.name]) : {};

			Chart.defaults[chartName] = extend(baseDefaults,extensions.defaults);

			Chart.types[chartName] = ChartType;

			//Register this new chart type in the Chart prototype
			Chart.prototype[chartName] = function(data,options){
				var config = merge(Chart.defaults.global, Chart.defaults[chartName], options || {});
				return new ChartType(data,config,this);
			};
		} else{
			warn("Name not provided for this chart, so it hasn't been registered");
		}
		return parent;
	};

	Chart.Element = function(configuration){
		extend(this,configuration);
		this.initialize.apply(this,arguments);
		this.save();
	};
	extend(Chart.Element.prototype,{
		initialize : function(){},
		restore : function(props){
			if (!props){
				extend(this,this._saved);
			} else {
				each(props,function(key){
					this[key] = this._saved[key];
				},this);
			}
			return this;
		},
		save : function(){
			this._saved = clone(this);
			delete this._saved._saved;
			return this;
		},
		update : function(newProps){
			each(newProps,function(value,key){
				this._saved[key] = this[key];
				this[key] = value;
			},this);
			return this;
		},
		transition : function(props,ease){
			each(props,function(value,key){
				this[key] = ((value - this._saved[key]) * ease) + this._saved[key];
			},this);
			return this;
		},
		tooltipPosition : function(){
			return {
				x : this.x,
				y : this.y
			};
		},
		hasValue: function(){
			return isNumber(this.value);
		}
	});

	Chart.Element.extend = inherits;


	Chart.Point = Chart.Element.extend({
		display: true,
		inRange: function(chartX,chartY){
			var hitDetectionRange = this.hitDetectionRadius + this.radius;
			return ((Math.pow(chartX-this.x, 2)+Math.pow(chartY-this.y, 2)) < Math.pow(hitDetectionRange,2));
		},
		draw : function(){
			if (this.display){
				var ctx = this.ctx;
				ctx.beginPath();

				ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
				ctx.closePath();

				ctx.strokeStyle = this.strokeColor;
				ctx.lineWidth = this.strokeWidth;

				ctx.fillStyle = this.fillColor;

				ctx.fill();
				ctx.stroke();
			}


			//Quick debug for bezier curve splining
			//Highlights control points and the line between them.
			//Handy for dev - stripped in the min version.

			// ctx.save();
			// ctx.fillStyle = "black";
			// ctx.strokeStyle = "black"
			// ctx.beginPath();
			// ctx.arc(this.controlPoints.inner.x,this.controlPoints.inner.y, 2, 0, Math.PI*2);
			// ctx.fill();

			// ctx.beginPath();
			// ctx.arc(this.controlPoints.outer.x,this.controlPoints.outer.y, 2, 0, Math.PI*2);
			// ctx.fill();

			// ctx.moveTo(this.controlPoints.inner.x,this.controlPoints.inner.y);
			// ctx.lineTo(this.x, this.y);
			// ctx.lineTo(this.controlPoints.outer.x,this.controlPoints.outer.y);
			// ctx.stroke();

			// ctx.restore();



		}
	});

	Chart.Arc = Chart.Element.extend({
		inRange : function(chartX,chartY){

			var pointRelativePosition = helpers.getAngleFromPoint(this, {
				x: chartX,
				y: chartY
			});

			//Check if within the range of the open/close angle
			var betweenAngles = (pointRelativePosition.angle >= this.startAngle && pointRelativePosition.angle <= this.endAngle),
				withinRadius = (pointRelativePosition.distance >= this.innerRadius && pointRelativePosition.distance <= this.outerRadius);

			return (betweenAngles && withinRadius);
			//Ensure within the outside of the arc centre, but inside arc outer
		},
		tooltipPosition : function(){
			var centreAngle = this.startAngle + ((this.endAngle - this.startAngle) / 2),
				rangeFromCentre = (this.outerRadius - this.innerRadius) / 2 + this.innerRadius;
			return {
				x : this.x + (Math.cos(centreAngle) * rangeFromCentre),
				y : this.y + (Math.sin(centreAngle) * rangeFromCentre)
			};
		},
		draw : function(animationPercent){

			var easingDecimal = animationPercent || 1;

			var ctx = this.ctx;

			ctx.beginPath();

			ctx.arc(this.x, this.y, this.outerRadius, this.startAngle, this.endAngle);

			ctx.arc(this.x, this.y, this.innerRadius, this.endAngle, this.startAngle, true);

			ctx.closePath();
			ctx.strokeStyle = this.strokeColor;
			ctx.lineWidth = this.strokeWidth;

			ctx.fillStyle = this.fillColor;

			ctx.fill();
			ctx.lineJoin = 'bevel';

			if (this.showStroke){
				ctx.stroke();
			}
		}
	});

	Chart.Rectangle = Chart.Element.extend({
		draw : function(){
			var ctx = this.ctx,
				halfWidth = this.width/2,
				leftX = this.x - halfWidth,
				rightX = this.x + halfWidth,
				top = this.base - (this.base - this.y),
				halfStroke = this.strokeWidth / 2;

			// Canvas doesn't allow us to stroke inside the width so we can
			// adjust the sizes to fit if we're setting a stroke on the line
			if (this.showStroke){
				leftX += halfStroke;
				rightX -= halfStroke;
				top += halfStroke;
			}

			ctx.beginPath();

			ctx.fillStyle = this.fillColor;
			ctx.strokeStyle = this.strokeColor;
			ctx.lineWidth = this.strokeWidth;

			// It'd be nice to keep this class totally generic to any rectangle
			// and simply specify which border to miss out.
			ctx.moveTo(leftX, this.base);
			ctx.lineTo(leftX, top);
			ctx.lineTo(rightX, top);
			ctx.lineTo(rightX, this.base);
			ctx.fill();
			if (this.showStroke){
				ctx.stroke();
			}
		},
		height : function(){
			return this.base - this.y;
		},
		inRange : function(chartX,chartY){
			return (chartX >= this.x - this.width/2 && chartX <= this.x + this.width/2) && (chartY >= this.y && chartY <= this.base);
		}
	});

	Chart.Tooltip = Chart.Element.extend({
		draw : function(){

			var ctx = this.chart.ctx;

			ctx.font = fontString(this.fontSize,this.fontStyle,this.fontFamily);

			this.xAlign = "center";
			this.yAlign = "above";

			//Distance between the actual element.y position and the start of the tooltip caret
			var caretPadding = this.caretPadding = 2;

			var tooltipWidth = ctx.measureText(this.text).width + 2*this.xPadding,
				tooltipRectHeight = this.fontSize + 2*this.yPadding,
				tooltipHeight = tooltipRectHeight + this.caretHeight + caretPadding;

			if (this.x + tooltipWidth/2 >this.chart.width){
				this.xAlign = "left";
			} else if (this.x - tooltipWidth/2 < 0){
				this.xAlign = "right";
			}

			if (this.y - tooltipHeight < 0){
				this.yAlign = "below";
			}


			var tooltipX = this.x - tooltipWidth/2,
				tooltipY = this.y - tooltipHeight;

			ctx.fillStyle = this.fillColor;

			// Custom Tooltips
			if(this.custom){
				this.custom(this);
			}
			else{
				switch(this.yAlign)
				{
				case "above":
					//Draw a caret above the x/y
					ctx.beginPath();
					ctx.moveTo(this.x,this.y - caretPadding);
					ctx.lineTo(this.x + this.caretHeight, this.y - (caretPadding + this.caretHeight));
					ctx.lineTo(this.x - this.caretHeight, this.y - (caretPadding + this.caretHeight));
					ctx.closePath();
					ctx.fill();
					break;
				case "below":
					tooltipY = this.y + caretPadding + this.caretHeight;
					//Draw a caret below the x/y
					ctx.beginPath();
					ctx.moveTo(this.x, this.y + caretPadding);
					ctx.lineTo(this.x + this.caretHeight, this.y + caretPadding + this.caretHeight);
					ctx.lineTo(this.x - this.caretHeight, this.y + caretPadding + this.caretHeight);
					ctx.closePath();
					ctx.fill();
					break;
				}

				switch(this.xAlign)
				{
				case "left":
					tooltipX = this.x - tooltipWidth + (this.cornerRadius + this.caretHeight);
					break;
				case "right":
					tooltipX = this.x - (this.cornerRadius + this.caretHeight);
					break;
				}

				drawRoundedRectangle(ctx,tooltipX,tooltipY,tooltipWidth,tooltipRectHeight,this.cornerRadius);

				ctx.fill();

				ctx.fillStyle = this.textColor;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText(this.text, tooltipX + tooltipWidth/2, tooltipY + tooltipRectHeight/2);
			}
		}
	});

	Chart.MultiTooltip = Chart.Element.extend({
		initialize : function(){
			this.font = fontString(this.fontSize,this.fontStyle,this.fontFamily);

			this.titleFont = fontString(this.titleFontSize,this.titleFontStyle,this.titleFontFamily);

			this.height = (this.labels.length * this.fontSize) + ((this.labels.length-1) * (this.fontSize/2)) + (this.yPadding*2) + this.titleFontSize *1.5;

			this.ctx.font = this.titleFont;

			var titleWidth = this.ctx.measureText(this.title).width,
				//Label has a legend square as well so account for this.
				labelWidth = longestText(this.ctx,this.font,this.labels) + this.fontSize + 3,
				longestTextWidth = max([labelWidth,titleWidth]);

			this.width = longestTextWidth + (this.xPadding*2);


			var halfHeight = this.height/2;

			//Check to ensure the height will fit on the canvas
			if (this.y - halfHeight < 0 ){
				this.y = halfHeight;
			} else if (this.y + halfHeight > this.chart.height){
				this.y = this.chart.height - halfHeight;
			}

			//Decide whether to align left or right based on position on canvas
			if (this.x > this.chart.width/2){
				this.x -= this.xOffset + this.width;
			} else {
				this.x += this.xOffset;
			}


		},
		getLineHeight : function(index){
			var baseLineHeight = this.y - (this.height/2) + this.yPadding,
				afterTitleIndex = index-1;

			//If the index is zero, we're getting the title
			if (index === 0){
				return baseLineHeight + this.titleFontSize/2;
			} else{
				return baseLineHeight + ((this.fontSize*1.5*afterTitleIndex) + this.fontSize/2) + this.titleFontSize * 1.5;
			}

		},
		draw : function(){
			// Custom Tooltips
			if(this.custom){
				this.custom(this);
			}
			else{
				drawRoundedRectangle(this.ctx,this.x,this.y - this.height/2,this.width,this.height,this.cornerRadius);
				var ctx = this.ctx;
				ctx.fillStyle = this.fillColor;
				ctx.fill();
				ctx.closePath();

				ctx.textAlign = "left";
				ctx.textBaseline = "middle";
				ctx.fillStyle = this.titleTextColor;
				ctx.font = this.titleFont;

				ctx.fillText(this.title,this.x + this.xPadding, this.getLineHeight(0));

				ctx.font = this.font;
				helpers.each(this.labels,function(label,index){
					ctx.fillStyle = this.textColor;
					ctx.fillText(label,this.x + this.xPadding + this.fontSize + 3, this.getLineHeight(index + 1));

					//A bit gnarly, but clearing this rectangle breaks when using explorercanvas (clears whole canvas)
					//ctx.clearRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize/2, this.fontSize, this.fontSize);
					//Instead we'll make a white filled block to put the legendColour palette over.

					ctx.fillStyle = this.legendColorBackground;
					ctx.fillRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize/2, this.fontSize, this.fontSize);

					ctx.fillStyle = this.legendColors[index].fill;
					ctx.fillRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize/2, this.fontSize, this.fontSize);


				},this);
			}
		}
	});

	Chart.Scale = Chart.Element.extend({
		initialize : function(){
			this.fit();
		},
		buildYLabels : function(){
			this.yLabels = [];

			var stepDecimalPlaces = getDecimalPlaces(this.stepValue);

			for (var i=0; i<=this.steps; i++){
				this.yLabels.push(template(this.templateString,{value:(this.min + (i * this.stepValue)).toFixed(stepDecimalPlaces)}));
			}
			this.yLabelWidth = (this.display && this.showLabels) ? longestText(this.ctx,this.font,this.yLabels) : 0;
		},
		addXLabel : function(label){
			this.xLabels.push(label);
			this.valuesCount++;
			this.fit();
		},
		removeXLabel : function(){
			this.xLabels.shift();
			this.valuesCount--;
			this.fit();
		},
		// Fitting loop to rotate x Labels and figure out what fits there, and also calculate how many Y steps to use
		fit: function(){
			// First we need the width of the yLabels, assuming the xLabels aren't rotated

			// To do that we need the base line at the top and base of the chart, assuming there is no x label rotation
			this.startPoint = (this.display) ? this.fontSize : 0;
			this.endPoint = (this.display) ? this.height - (this.fontSize * 1.5) - 5 : this.height; // -5 to pad labels

			// Apply padding settings to the start and end point.
			this.startPoint += this.padding;
			this.endPoint -= this.padding;

			// Cache the starting height, so can determine if we need to recalculate the scale yAxis
			var cachedHeight = this.endPoint - this.startPoint,
				cachedYLabelWidth;

			// Build the current yLabels so we have an idea of what size they'll be to start
			/*
			 *	This sets what is returned from calculateScaleRange as static properties of this class:
			 *
				this.steps;
				this.stepValue;
				this.min;
				this.max;
			 *
			 */
			this.calculateYRange(cachedHeight);

			// With these properties set we can now build the array of yLabels
			// and also the width of the largest yLabel
			this.buildYLabels();

			this.calculateXLabelRotation();

			while((cachedHeight > this.endPoint - this.startPoint)){
				cachedHeight = this.endPoint - this.startPoint;
				cachedYLabelWidth = this.yLabelWidth;

				this.calculateYRange(cachedHeight);
				this.buildYLabels();

				// Only go through the xLabel loop again if the yLabel width has changed
				if (cachedYLabelWidth < this.yLabelWidth){
					this.calculateXLabelRotation();
				}
			}

		},
		calculateXLabelRotation : function(){
			//Get the width of each grid by calculating the difference
			//between x offsets between 0 and 1.

			this.ctx.font = this.font;

			var firstWidth = this.ctx.measureText(this.xLabels[0]).width,
				lastWidth = this.ctx.measureText(this.xLabels[this.xLabels.length - 1]).width,
				firstRotated,
				lastRotated;


			this.xScalePaddingRight = lastWidth/2 + 3;
			this.xScalePaddingLeft = (firstWidth/2 > this.yLabelWidth + 10) ? firstWidth/2 : this.yLabelWidth + 10;

			this.xLabelRotation = 0;
			if (this.display){
				var originalLabelWidth = longestText(this.ctx,this.font,this.xLabels),
					cosRotation,
					firstRotatedWidth;
				this.xLabelWidth = originalLabelWidth;
				//Allow 3 pixels x2 padding either side for label readability
				var xGridWidth = Math.floor(this.calculateX(1) - this.calculateX(0)) - 6;

				//Max label rotate should be 90 - also act as a loop counter
				while ((this.xLabelWidth > xGridWidth && this.xLabelRotation === 0) || (this.xLabelWidth > xGridWidth && this.xLabelRotation <= 90 && this.xLabelRotation > 0)){
					cosRotation = Math.cos(toRadians(this.xLabelRotation));

					firstRotated = cosRotation * firstWidth;
					lastRotated = cosRotation * lastWidth;

					// We're right aligning the text now.
					if (firstRotated + this.fontSize / 2 > this.yLabelWidth + 8){
						this.xScalePaddingLeft = firstRotated + this.fontSize / 2;
					}
					this.xScalePaddingRight = this.fontSize/2;


					this.xLabelRotation++;
					this.xLabelWidth = cosRotation * originalLabelWidth;

				}
				if (this.xLabelRotation > 0){
					this.endPoint -= Math.sin(toRadians(this.xLabelRotation))*originalLabelWidth + 3;
				}
			}
			else{
				this.xLabelWidth = 0;
				this.xScalePaddingRight = this.padding;
				this.xScalePaddingLeft = this.padding;
			}

		},
		// Needs to be overidden in each Chart type
		// Otherwise we need to pass all the data into the scale class
		calculateYRange: noop,
		drawingArea: function(){
			return this.startPoint - this.endPoint;
		},
		calculateY : function(value){
			var scalingFactor = this.drawingArea() / (this.min - this.max);
			return this.endPoint - (scalingFactor * (value - this.min));
		},
		calculateX : function(index){
			var isRotated = (this.xLabelRotation > 0),
				// innerWidth = (this.offsetGridLines) ? this.width - offsetLeft - this.padding : this.width - (offsetLeft + halfLabelWidth * 2) - this.padding,
				innerWidth = this.width - (this.xScalePaddingLeft + this.xScalePaddingRight),
				valueWidth = innerWidth/Math.max((this.valuesCount - ((this.offsetGridLines) ? 0 : 1)), 1),
				valueOffset = (valueWidth * index) + this.xScalePaddingLeft;

			if (this.offsetGridLines){
				valueOffset += (valueWidth/2);
			}

			return Math.round(valueOffset);
		},
		update : function(newProps){
			helpers.extend(this, newProps);
			this.fit();
		},
		draw : function(){
			var ctx = this.ctx,
				yLabelGap = (this.endPoint - this.startPoint) / this.steps,
				xStart = Math.round(this.xScalePaddingLeft);
			if (this.display){
				ctx.fillStyle = this.textColor;
				ctx.font = this.font;
				each(this.yLabels,function(labelString,index){
					var yLabelCenter = this.endPoint - (yLabelGap * index),
						linePositionY = Math.round(yLabelCenter),
						drawHorizontalLine = this.showHorizontalLines;

					ctx.textAlign = "right";
					ctx.textBaseline = "middle";
					if (this.showLabels){
						ctx.fillText(labelString,xStart - 10,yLabelCenter);
					}

					// This is X axis, so draw it
					if (index === 0 && !drawHorizontalLine){
						drawHorizontalLine = true;
					}

					if (drawHorizontalLine){
						ctx.beginPath();
					}

					if (index > 0){
						// This is a grid line in the centre, so drop that
						ctx.lineWidth = this.gridLineWidth;
						ctx.strokeStyle = this.gridLineColor;
					} else {
						// This is the first line on the scale
						ctx.lineWidth = this.lineWidth;
						ctx.strokeStyle = this.lineColor;
					}

					linePositionY += helpers.aliasPixel(ctx.lineWidth);

					if(drawHorizontalLine){
						ctx.moveTo(xStart, linePositionY);
						ctx.lineTo(this.width, linePositionY);
						ctx.stroke();
						ctx.closePath();
					}

					ctx.lineWidth = this.lineWidth;
					ctx.strokeStyle = this.lineColor;
					ctx.beginPath();
					ctx.moveTo(xStart - 5, linePositionY);
					ctx.lineTo(xStart, linePositionY);
					ctx.stroke();
					ctx.closePath();

				},this);

				each(this.xLabels,function(label,index){
					var xPos = this.calculateX(index) + aliasPixel(this.lineWidth),
						// Check to see if line/bar here and decide where to place the line
						linePos = this.calculateX(index - (this.offsetGridLines ? 0.5 : 0)) + aliasPixel(this.lineWidth),
						isRotated = (this.xLabelRotation > 0),
						drawVerticalLine = this.showVerticalLines;

					// This is Y axis, so draw it
					if (index === 0 && !drawVerticalLine){
						drawVerticalLine = true;
					}

					if (drawVerticalLine){
						ctx.beginPath();
					}

					if (index > 0){
						// This is a grid line in the centre, so drop that
						ctx.lineWidth = this.gridLineWidth;
						ctx.strokeStyle = this.gridLineColor;
					} else {
						// This is the first line on the scale
						ctx.lineWidth = this.lineWidth;
						ctx.strokeStyle = this.lineColor;
					}

					if (drawVerticalLine){
						ctx.moveTo(linePos,this.endPoint);
						ctx.lineTo(linePos,this.startPoint - 3);
						ctx.stroke();
						ctx.closePath();
					}


					ctx.lineWidth = this.lineWidth;
					ctx.strokeStyle = this.lineColor;


					// Small lines at the bottom of the base grid line
					ctx.beginPath();
					ctx.moveTo(linePos,this.endPoint);
					ctx.lineTo(linePos,this.endPoint + 5);
					ctx.stroke();
					ctx.closePath();

					ctx.save();
					ctx.translate(xPos,(isRotated) ? this.endPoint + 12 : this.endPoint + 8);
					ctx.rotate(toRadians(this.xLabelRotation)*-1);
					ctx.font = this.font;
					ctx.textAlign = (isRotated) ? "right" : "center";
					ctx.textBaseline = (isRotated) ? "middle" : "top";
					ctx.fillText(label, 0, 0);
					ctx.restore();
				},this);

			}
		}

	});

	Chart.RadialScale = Chart.Element.extend({
		initialize: function(){
			this.size = min([this.height, this.width]);
			this.drawingArea = (this.display) ? (this.size/2) - (this.fontSize/2 + this.backdropPaddingY) : (this.size/2);
		},
		calculateCenterOffset: function(value){
			// Take into account half font size + the yPadding of the top value
			var scalingFactor = this.drawingArea / (this.max - this.min);

			return (value - this.min) * scalingFactor;
		},
		update : function(){
			if (!this.lineArc){
				this.setScaleSize();
			} else {
				this.drawingArea = (this.display) ? (this.size/2) - (this.fontSize/2 + this.backdropPaddingY) : (this.size/2);
			}
			this.buildYLabels();
		},
		buildYLabels: function(){
			this.yLabels = [];

			var stepDecimalPlaces = getDecimalPlaces(this.stepValue);

			for (var i=0; i<=this.steps; i++){
				this.yLabels.push(template(this.templateString,{value:(this.min + (i * this.stepValue)).toFixed(stepDecimalPlaces)}));
			}
		},
		getCircumference : function(){
			return ((Math.PI*2) / this.valuesCount);
		},
		setScaleSize: function(){
			/*
			 * Right, this is really confusing and there is a lot of maths going on here
			 * The gist of the problem is here: https://gist.github.com/nnnick/696cc9c55f4b0beb8fe9
			 *
			 * Reaction: https://dl.dropboxusercontent.com/u/34601363/toomuchscience.gif
			 *
			 * Solution:
			 *
			 * We assume the radius of the polygon is half the size of the canvas at first
			 * at each index we check if the text overlaps.
			 *
			 * Where it does, we store that angle and that index.
			 *
			 * After finding the largest index and angle we calculate how much we need to remove
			 * from the shape radius to move the point inwards by that x.
			 *
			 * We average the left and right distances to get the maximum shape radius that can fit in the box
			 * along with labels.
			 *
			 * Once we have that, we can find the centre point for the chart, by taking the x text protrusion
			 * on each side, removing that from the size, halving it and adding the left x protrusion width.
			 *
			 * This will mean we have a shape fitted to the canvas, as large as it can be with the labels
			 * and position it in the most space efficient manner
			 *
			 * https://dl.dropboxusercontent.com/u/34601363/yeahscience.gif
			 */


			// Get maximum radius of the polygon. Either half the height (minus the text width) or half the width.
			// Use this to calculate the offset + change. - Make sure L/R protrusion is at least 0 to stop issues with centre points
			var largestPossibleRadius = min([(this.height/2 - this.pointLabelFontSize - 5), this.width/2]),
				pointPosition,
				i,
				textWidth,
				halfTextWidth,
				furthestRight = this.width,
				furthestRightIndex,
				furthestRightAngle,
				furthestLeft = 0,
				furthestLeftIndex,
				furthestLeftAngle,
				xProtrusionLeft,
				xProtrusionRight,
				radiusReductionRight,
				radiusReductionLeft,
				maxWidthRadius;
			this.ctx.font = fontString(this.pointLabelFontSize,this.pointLabelFontStyle,this.pointLabelFontFamily);
			for (i=0;i<this.valuesCount;i++){
				// 5px to space the text slightly out - similar to what we do in the draw function.
				pointPosition = this.getPointPosition(i, largestPossibleRadius);
				textWidth = this.ctx.measureText(template(this.templateString, { value: this.labels[i] })).width + 5;
				if (i === 0 || i === this.valuesCount/2){
					// If we're at index zero, or exactly the middle, we're at exactly the top/bottom
					// of the radar chart, so text will be aligned centrally, so we'll half it and compare
					// w/left and right text sizes
					halfTextWidth = textWidth/2;
					if (pointPosition.x + halfTextWidth > furthestRight) {
						furthestRight = pointPosition.x + halfTextWidth;
						furthestRightIndex = i;
					}
					if (pointPosition.x - halfTextWidth < furthestLeft) {
						furthestLeft = pointPosition.x - halfTextWidth;
						furthestLeftIndex = i;
					}
				}
				else if (i < this.valuesCount/2) {
					// Less than half the values means we'll left align the text
					if (pointPosition.x + textWidth > furthestRight) {
						furthestRight = pointPosition.x + textWidth;
						furthestRightIndex = i;
					}
				}
				else if (i > this.valuesCount/2){
					// More than half the values means we'll right align the text
					if (pointPosition.x - textWidth < furthestLeft) {
						furthestLeft = pointPosition.x - textWidth;
						furthestLeftIndex = i;
					}
				}
			}

			xProtrusionLeft = furthestLeft;

			xProtrusionRight = Math.ceil(furthestRight - this.width);

			furthestRightAngle = this.getIndexAngle(furthestRightIndex);

			furthestLeftAngle = this.getIndexAngle(furthestLeftIndex);

			radiusReductionRight = xProtrusionRight / Math.sin(furthestRightAngle + Math.PI/2);

			radiusReductionLeft = xProtrusionLeft / Math.sin(furthestLeftAngle + Math.PI/2);

			// Ensure we actually need to reduce the size of the chart
			radiusReductionRight = (isNumber(radiusReductionRight)) ? radiusReductionRight : 0;
			radiusReductionLeft = (isNumber(radiusReductionLeft)) ? radiusReductionLeft : 0;

			this.drawingArea = largestPossibleRadius - (radiusReductionLeft + radiusReductionRight)/2;

			//this.drawingArea = min([maxWidthRadius, (this.height - (2 * (this.pointLabelFontSize + 5)))/2])
			this.setCenterPoint(radiusReductionLeft, radiusReductionRight);

		},
		setCenterPoint: function(leftMovement, rightMovement){

			var maxRight = this.width - rightMovement - this.drawingArea,
				maxLeft = leftMovement + this.drawingArea;

			this.xCenter = (maxLeft + maxRight)/2;
			// Always vertically in the centre as the text height doesn't change
			this.yCenter = (this.height/2);
		},

		getIndexAngle : function(index){
			var angleMultiplier = (Math.PI * 2) / this.valuesCount;
			// Start from the top instead of right, so remove a quarter of the circle

			return index * angleMultiplier - (Math.PI/2);
		},
		getPointPosition : function(index, distanceFromCenter){
			var thisAngle = this.getIndexAngle(index);
			return {
				x : (Math.cos(thisAngle) * distanceFromCenter) + this.xCenter,
				y : (Math.sin(thisAngle) * distanceFromCenter) + this.yCenter
			};
		},
		draw: function(){
			if (this.display){
				var ctx = this.ctx;
				each(this.yLabels, function(label, index){
					// Don't draw a centre value
					if (index > 0){
						var yCenterOffset = index * (this.drawingArea/this.steps),
							yHeight = this.yCenter - yCenterOffset,
							pointPosition;

						// Draw circular lines around the scale
						if (this.lineWidth > 0){
							ctx.strokeStyle = this.lineColor;
							ctx.lineWidth = this.lineWidth;

							if(this.lineArc){
								ctx.beginPath();
								ctx.arc(this.xCenter, this.yCenter, yCenterOffset, 0, Math.PI*2);
								ctx.closePath();
								ctx.stroke();
							} else{
								ctx.beginPath();
								for (var i=0;i<this.valuesCount;i++)
								{
									pointPosition = this.getPointPosition(i, this.calculateCenterOffset(this.min + (index * this.stepValue)));
									if (i === 0){
										ctx.moveTo(pointPosition.x, pointPosition.y);
									} else {
										ctx.lineTo(pointPosition.x, pointPosition.y);
									}
								}
								ctx.closePath();
								ctx.stroke();
							}
						}
						if(this.showLabels){
							ctx.font = fontString(this.fontSize,this.fontStyle,this.fontFamily);
							if (this.showLabelBackdrop){
								var labelWidth = ctx.measureText(label).width;
								ctx.fillStyle = this.backdropColor;
								ctx.fillRect(
									this.xCenter - labelWidth/2 - this.backdropPaddingX,
									yHeight - this.fontSize/2 - this.backdropPaddingY,
									labelWidth + this.backdropPaddingX*2,
									this.fontSize + this.backdropPaddingY*2
								);
							}
							ctx.textAlign = 'center';
							ctx.textBaseline = "middle";
							ctx.fillStyle = this.fontColor;
							ctx.fillText(label, this.xCenter, yHeight);
						}
					}
				}, this);

				if (!this.lineArc){
					ctx.lineWidth = this.angleLineWidth;
					ctx.strokeStyle = this.angleLineColor;
					for (var i = this.valuesCount - 1; i >= 0; i--) {
						if (this.angleLineWidth > 0){
							var outerPosition = this.getPointPosition(i, this.calculateCenterOffset(this.max));
							ctx.beginPath();
							ctx.moveTo(this.xCenter, this.yCenter);
							ctx.lineTo(outerPosition.x, outerPosition.y);
							ctx.stroke();
							ctx.closePath();
						}
						// Extra 3px out for some label spacing
						var pointLabelPosition = this.getPointPosition(i, this.calculateCenterOffset(this.max) + 5);
						ctx.font = fontString(this.pointLabelFontSize,this.pointLabelFontStyle,this.pointLabelFontFamily);
						ctx.fillStyle = this.pointLabelFontColor;

						var labelsCount = this.labels.length,
							halfLabelsCount = this.labels.length/2,
							quarterLabelsCount = halfLabelsCount/2,
							upperHalf = (i < quarterLabelsCount || i > labelsCount - quarterLabelsCount),
							exactQuarter = (i === quarterLabelsCount || i === labelsCount - quarterLabelsCount);
						if (i === 0){
							ctx.textAlign = 'center';
						} else if(i === halfLabelsCount){
							ctx.textAlign = 'center';
						} else if (i < halfLabelsCount){
							ctx.textAlign = 'left';
						} else {
							ctx.textAlign = 'right';
						}

						// Set the correct text baseline based on outer positioning
						if (exactQuarter){
							ctx.textBaseline = 'middle';
						} else if (upperHalf){
							ctx.textBaseline = 'bottom';
						} else {
							ctx.textBaseline = 'top';
						}

						ctx.fillText(this.labels[i], pointLabelPosition.x, pointLabelPosition.y);
					}
				}
			}
		}
	});

	// Attach global event to resize each chart instance when the browser resizes
	helpers.addEvent(window, "resize", (function(){
		// Basic debounce of resize function so it doesn't hurt performance when resizing browser.
		var timeout;
		return function(){
			clearTimeout(timeout);
			timeout = setTimeout(function(){
				each(Chart.instances,function(instance){
					// If the responsive flag is set in the chart instance config
					// Cascade the resize event down to the chart.
					if (instance.options.responsive){
						instance.resize(instance.render, true);
					}
				});
			}, 50);
		};
	})());


	if (amd) {
		define(function(){
			return Chart;
		});
	} else if (typeof module === 'object' && module.exports) {
		module.exports = Chart;
	}

	root.Chart = Chart;

	Chart.noConflict = function(){
		root.Chart = previous;
		return Chart;
	};

}).call(this);

(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		helpers = Chart.helpers;


	var defaultConfig = {
		//Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
		scaleBeginAtZero : true,

		//Boolean - Whether grid lines are shown across the chart
		scaleShowGridLines : true,

		//String - Colour of the grid lines
		scaleGridLineColor : "rgba(0,0,0,.05)",

		//Number - Width of the grid lines
		scaleGridLineWidth : 1,

		//Boolean - Whether to show horizontal lines (except X axis)
		scaleShowHorizontalLines: true,

		//Boolean - Whether to show vertical lines (except Y axis)
		scaleShowVerticalLines: true,

		//Boolean - If there is a stroke on each bar
		barShowStroke : true,

		//Number - Pixel width of the bar stroke
		barStrokeWidth : 2,

		//Number - Spacing between each of the X value sets
		barValueSpacing : 5,

		//Number - Spacing between data sets within X values
		barDatasetSpacing : 1,

		//String - A legend template
		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

	};


	Chart.Type.extend({
		name: "Bar",
		defaults : defaultConfig,
		initialize:  function(data){

			//Expose options as a scope variable here so we can access it in the ScaleClass
			var options = this.options;

			this.ScaleClass = Chart.Scale.extend({
				offsetGridLines : true,
				calculateBarX : function(datasetCount, datasetIndex, barIndex){
					//Reusable method for calculating the xPosition of a given bar based on datasetIndex & width of the bar
					var xWidth = this.calculateBaseWidth(),
						xAbsolute = this.calculateX(barIndex) - (xWidth/2),
						barWidth = this.calculateBarWidth(datasetCount);

					return xAbsolute + (barWidth * datasetIndex) + (datasetIndex * options.barDatasetSpacing) + barWidth/2;
				},
				calculateBaseWidth : function(){
					return (this.calculateX(1) - this.calculateX(0)) - (2*options.barValueSpacing);
				},
				calculateBarWidth : function(datasetCount){
					//The padding between datasets is to the right of each bar, providing that there are more than 1 dataset
					var baseWidth = this.calculateBaseWidth() - ((datasetCount - 1) * options.barDatasetSpacing);

					return (baseWidth / datasetCount);
				}
			});

			this.datasets = [];

			//Set up tooltip events on the chart
			if (this.options.showTooltips){
				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
					var activeBars = (evt.type !== 'mouseout') ? this.getBarsAtEvent(evt) : [];

					this.eachBars(function(bar){
						bar.restore(['fillColor', 'strokeColor']);
					});
					helpers.each(activeBars, function(activeBar){
						activeBar.fillColor = activeBar.highlightFill;
						activeBar.strokeColor = activeBar.highlightStroke;
					});
					this.showTooltip(activeBars);
				});
			}

			//Declare the extension of the default point, to cater for the options passed in to the constructor
			this.BarClass = Chart.Rectangle.extend({
				strokeWidth : this.options.barStrokeWidth,
				showStroke : this.options.barShowStroke,
				ctx : this.chart.ctx
			});

			//Iterate through each of the datasets, and build this into a property of the chart
			helpers.each(data.datasets,function(dataset,datasetIndex){

				var datasetObject = {
					label : dataset.label || null,
					fillColor : dataset.fillColor,
					strokeColor : dataset.strokeColor,
					bars : []
				};

				this.datasets.push(datasetObject);

				helpers.each(dataset.data,function(dataPoint,index){
					//Add a new point for each piece of data, passing any required data to draw.
					datasetObject.bars.push(new this.BarClass({
						value : dataPoint,
						label : data.labels[index],
						datasetLabel: dataset.label,
						strokeColor : dataset.strokeColor,
						fillColor : dataset.fillColor,
						highlightFill : dataset.highlightFill || dataset.fillColor,
						highlightStroke : dataset.highlightStroke || dataset.strokeColor
					}));
				},this);

			},this);

			this.buildScale(data.labels);

			this.BarClass.prototype.base = this.scale.endPoint;

			this.eachBars(function(bar, index, datasetIndex){
				helpers.extend(bar, {
					width : this.scale.calculateBarWidth(this.datasets.length),
					x: this.scale.calculateBarX(this.datasets.length, datasetIndex, index),
					y: this.scale.endPoint
				});
				bar.save();
			}, this);

			this.render();
		},
		update : function(){
			this.scale.update();
			// Reset any highlight colours before updating.
			helpers.each(this.activeElements, function(activeElement){
				activeElement.restore(['fillColor', 'strokeColor']);
			});

			this.eachBars(function(bar){
				bar.save();
			});
			this.render();
		},
		eachBars : function(callback){
			helpers.each(this.datasets,function(dataset, datasetIndex){
				helpers.each(dataset.bars, callback, this, datasetIndex);
			},this);
		},
		getBarsAtEvent : function(e){
			var barsArray = [],
				eventPosition = helpers.getRelativePosition(e),
				datasetIterator = function(dataset){
					barsArray.push(dataset.bars[barIndex]);
				},
				barIndex;

			for (var datasetIndex = 0; datasetIndex < this.datasets.length; datasetIndex++) {
				for (barIndex = 0; barIndex < this.datasets[datasetIndex].bars.length; barIndex++) {
					if (this.datasets[datasetIndex].bars[barIndex].inRange(eventPosition.x,eventPosition.y)){
						helpers.each(this.datasets, datasetIterator);
						return barsArray;
					}
				}
			}

			return barsArray;
		},
		buildScale : function(labels){
			var self = this;

			var dataTotal = function(){
				var values = [];
				self.eachBars(function(bar){
					values.push(bar.value);
				});
				return values;
			};

			var scaleOptions = {
				templateString : this.options.scaleLabel,
				height : this.chart.height,
				width : this.chart.width,
				ctx : this.chart.ctx,
				textColor : this.options.scaleFontColor,
				fontSize : this.options.scaleFontSize,
				fontStyle : this.options.scaleFontStyle,
				fontFamily : this.options.scaleFontFamily,
				valuesCount : labels.length,
				beginAtZero : this.options.scaleBeginAtZero,
				integersOnly : this.options.scaleIntegersOnly,
				calculateYRange: function(currentHeight){
					var updatedRanges = helpers.calculateScaleRange(
						dataTotal(),
						currentHeight,
						this.fontSize,
						this.beginAtZero,
						this.integersOnly
					);
					helpers.extend(this, updatedRanges);
				},
				xLabels : labels,
				font : helpers.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),
				lineWidth : this.options.scaleLineWidth,
				lineColor : this.options.scaleLineColor,
				showHorizontalLines : this.options.scaleShowHorizontalLines,
				showVerticalLines : this.options.scaleShowVerticalLines,
				gridLineWidth : (this.options.scaleShowGridLines) ? this.options.scaleGridLineWidth : 0,
				gridLineColor : (this.options.scaleShowGridLines) ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",
				padding : (this.options.showScale) ? 0 : (this.options.barShowStroke) ? this.options.barStrokeWidth : 0,
				showLabels : this.options.scaleShowLabels,
				display : this.options.showScale
			};

			if (this.options.scaleOverride){
				helpers.extend(scaleOptions, {
					calculateYRange: helpers.noop,
					steps: this.options.scaleSteps,
					stepValue: this.options.scaleStepWidth,
					min: this.options.scaleStartValue,
					max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
				});
			}

			this.scale = new this.ScaleClass(scaleOptions);
		},
		addData : function(valuesArray,label){
			//Map the values array for each of the datasets
			helpers.each(valuesArray,function(value,datasetIndex){
				//Add a new point for each piece of data, passing any required data to draw.
				this.datasets[datasetIndex].bars.push(new this.BarClass({
					value : value,
					label : label,
					x: this.scale.calculateBarX(this.datasets.length, datasetIndex, this.scale.valuesCount+1),
					y: this.scale.endPoint,
					width : this.scale.calculateBarWidth(this.datasets.length),
					base : this.scale.endPoint,
					strokeColor : this.datasets[datasetIndex].strokeColor,
					fillColor : this.datasets[datasetIndex].fillColor
				}));
			},this);

			this.scale.addXLabel(label);
			//Then re-render the chart.
			this.update();
		},
		removeData : function(){
			this.scale.removeXLabel();
			//Then re-render the chart.
			helpers.each(this.datasets,function(dataset){
				dataset.bars.shift();
			},this);
			this.update();
		},
		reflow : function(){
			helpers.extend(this.BarClass.prototype,{
				y: this.scale.endPoint,
				base : this.scale.endPoint
			});
			var newScaleProps = helpers.extend({
				height : this.chart.height,
				width : this.chart.width
			});
			this.scale.update(newScaleProps);
		},
		draw : function(ease){
			var easingDecimal = ease || 1;
			this.clear();

			var ctx = this.chart.ctx;

			this.scale.draw(easingDecimal);

			//Draw all the bars for each dataset
			helpers.each(this.datasets,function(dataset,datasetIndex){
				helpers.each(dataset.bars,function(bar,index){
					if (bar.hasValue()){
						bar.base = this.scale.endPoint;
						//Transition then draw
						bar.transition({
							x : this.scale.calculateBarX(this.datasets.length, datasetIndex, index),
							y : this.scale.calculateY(bar.value),
							width : this.scale.calculateBarWidth(this.datasets.length)
						}, easingDecimal).draw();
					}
				},this);

			},this);
		}
	});


}).call(this);

(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		//Cache a local reference to Chart.helpers
		helpers = Chart.helpers;

	var defaultConfig = {
		//Boolean - Whether we should show a stroke on each segment
		segmentShowStroke : true,

		//String - The colour of each segment stroke
		segmentStrokeColor : "#fff",

		//Number - The width of each segment stroke
		segmentStrokeWidth : 2,

		//The percentage of the chart that we cut out of the middle.
		percentageInnerCutout : 50,

		//Number - Amount of animation steps
		animationSteps : 100,

		//String - Animation easing effect
		animationEasing : "easeOutBounce",

		//Boolean - Whether we animate the rotation of the Doughnut
		animateRotate : true,

		//Boolean - Whether we animate scaling the Doughnut from the centre
		animateScale : false,

		//String - A legend template
		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

	};


	Chart.Type.extend({
		//Passing in a name registers this chart in the Chart namespace
		name: "Doughnut",
		//Providing a defaults will also register the deafults in the chart namespace
		defaults : defaultConfig,
		//Initialize is fired when the chart is initialized - Data is passed in as a parameter
		//Config is automatically merged by the core of Chart.js, and is available at this.options
		initialize:  function(data){

			//Declare segments as a static property to prevent inheriting across the Chart type prototype
			this.segments = [];
			this.outerRadius = (helpers.min([this.chart.width,this.chart.height]) -	this.options.segmentStrokeWidth/2)/2;

			this.SegmentArc = Chart.Arc.extend({
				ctx : this.chart.ctx,
				x : this.chart.width/2,
				y : this.chart.height/2
			});

			//Set up tooltip events on the chart
			if (this.options.showTooltips){
				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
					var activeSegments = (evt.type !== 'mouseout') ? this.getSegmentsAtEvent(evt) : [];

					helpers.each(this.segments,function(segment){
						segment.restore(["fillColor"]);
					});
					helpers.each(activeSegments,function(activeSegment){
						activeSegment.fillColor = activeSegment.highlightColor;
					});
					this.showTooltip(activeSegments);
				});
			}
			this.calculateTotal(data);

			helpers.each(data,function(datapoint, index){
				this.addData(datapoint, index, true);
			},this);

			this.render();
		},
		getSegmentsAtEvent : function(e){
			var segmentsArray = [];

			var location = helpers.getRelativePosition(e);

			helpers.each(this.segments,function(segment){
				if (segment.inRange(location.x,location.y)) segmentsArray.push(segment);
			},this);
			return segmentsArray;
		},
		addData : function(segment, atIndex, silent){
			var index = atIndex || this.segments.length;
			this.segments.splice(index, 0, new this.SegmentArc({
				value : segment.value,
				outerRadius : (this.options.animateScale) ? 0 : this.outerRadius,
				innerRadius : (this.options.animateScale) ? 0 : (this.outerRadius/100) * this.options.percentageInnerCutout,
				fillColor : segment.color,
				highlightColor : segment.highlight || segment.color,
				showStroke : this.options.segmentShowStroke,
				strokeWidth : this.options.segmentStrokeWidth,
				strokeColor : this.options.segmentStrokeColor,
				startAngle : Math.PI * 1.5,
				circumference : (this.options.animateRotate) ? 0 : this.calculateCircumference(segment.value),
				label : segment.label
			}));
			if (!silent){
				this.reflow();
				this.update();
			}
		},
		calculateCircumference : function(value){
			return (Math.PI*2)*(Math.abs(value) / this.total);
		},
		calculateTotal : function(data){
			this.total = 0;
			helpers.each(data,function(segment){
				this.total += Math.abs(segment.value);
			},this);
		},
		update : function(){
			this.calculateTotal(this.segments);

			// Reset any highlight colours before updating.
			helpers.each(this.activeElements, function(activeElement){
				activeElement.restore(['fillColor']);
			});

			helpers.each(this.segments,function(segment){
				segment.save();
			});
			this.render();
		},

		removeData: function(atIndex){
			var indexToDelete = (helpers.isNumber(atIndex)) ? atIndex : this.segments.length-1;
			this.segments.splice(indexToDelete, 1);
			this.reflow();
			this.update();
		},

		reflow : function(){
			helpers.extend(this.SegmentArc.prototype,{
				x : this.chart.width/2,
				y : this.chart.height/2
			});
			this.outerRadius = (helpers.min([this.chart.width,this.chart.height]) -	this.options.segmentStrokeWidth/2)/2;
			helpers.each(this.segments, function(segment){
				segment.update({
					outerRadius : this.outerRadius,
					innerRadius : (this.outerRadius/100) * this.options.percentageInnerCutout
				});
			}, this);
		},
		draw : function(easeDecimal){
			var animDecimal = (easeDecimal) ? easeDecimal : 1;
			this.clear();
			helpers.each(this.segments,function(segment,index){
				segment.transition({
					circumference : this.calculateCircumference(segment.value),
					outerRadius : this.outerRadius,
					innerRadius : (this.outerRadius/100) * this.options.percentageInnerCutout
				},animDecimal);

				segment.endAngle = segment.startAngle + segment.circumference;

				segment.draw();
				if (index === 0){
					segment.startAngle = Math.PI * 1.5;
				}
				//Check to see if it's the last segment, if not get the next and update the start angle
				if (index < this.segments.length-1){
					this.segments[index+1].startAngle = segment.endAngle;
				}
			},this);

		}
	});

	Chart.types.Doughnut.extend({
		name : "Pie",
		defaults : helpers.merge(defaultConfig,{percentageInnerCutout : 0})
	});

}).call(this);
(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		helpers = Chart.helpers;

	var defaultConfig = {

		///Boolean - Whether grid lines are shown across the chart
		scaleShowGridLines : true,

		//String - Colour of the grid lines
		scaleGridLineColor : "rgba(0,0,0,.05)",

		//Number - Width of the grid lines
		scaleGridLineWidth : 1,

		//Boolean - Whether to show horizontal lines (except X axis)
		scaleShowHorizontalLines: true,

		//Boolean - Whether to show vertical lines (except Y axis)
		scaleShowVerticalLines: true,

		//Boolean - Whether the line is curved between points
		bezierCurve : true,

		//Number - Tension of the bezier curve between points
		bezierCurveTension : 0.4,

		//Boolean - Whether to show a dot for each point
		pointDot : true,

		//Number - Radius of each point dot in pixels
		pointDotRadius : 4,

		//Number - Pixel width of point dot stroke
		pointDotStrokeWidth : 1,

		//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
		pointHitDetectionRadius : 20,

		//Boolean - Whether to show a stroke for datasets
		datasetStroke : true,

		//Number - Pixel width of dataset stroke
		datasetStrokeWidth : 2,

		//Boolean - Whether to fill the dataset with a colour
		datasetFill : true,

		//String - A legend template
		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

	};


	Chart.Type.extend({
		name: "Line",
		defaults : defaultConfig,
		initialize:  function(data){
			//Declare the extension of the default point, to cater for the options passed in to the constructor
			this.PointClass = Chart.Point.extend({
				strokeWidth : this.options.pointDotStrokeWidth,
				radius : this.options.pointDotRadius,
				display: this.options.pointDot,
				hitDetectionRadius : this.options.pointHitDetectionRadius,
				ctx : this.chart.ctx,
				inRange : function(mouseX){
					return (Math.pow(mouseX-this.x, 2) < Math.pow(this.radius + this.hitDetectionRadius,2));
				}
			});

			this.datasets = [];

			//Set up tooltip events on the chart
			if (this.options.showTooltips){
				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
					var activePoints = (evt.type !== 'mouseout') ? this.getPointsAtEvent(evt) : [];
					this.eachPoints(function(point){
						point.restore(['fillColor', 'strokeColor']);
					});
					helpers.each(activePoints, function(activePoint){
						activePoint.fillColor = activePoint.highlightFill;
						activePoint.strokeColor = activePoint.highlightStroke;
					});
					this.showTooltip(activePoints);
				});
			}

			//Iterate through each of the datasets, and build this into a property of the chart
			helpers.each(data.datasets,function(dataset){

				var datasetObject = {
					label : dataset.label || null,
					fillColor : dataset.fillColor,
					strokeColor : dataset.strokeColor,
					pointColor : dataset.pointColor,
					pointStrokeColor : dataset.pointStrokeColor,
					points : []
				};

				this.datasets.push(datasetObject);


				helpers.each(dataset.data,function(dataPoint,index){
					//Add a new point for each piece of data, passing any required data to draw.
					datasetObject.points.push(new this.PointClass({
						value : dataPoint,
						label : data.labels[index],
						datasetLabel: dataset.label,
						strokeColor : dataset.pointStrokeColor,
						fillColor : dataset.pointColor,
						highlightFill : dataset.pointHighlightFill || dataset.pointColor,
						highlightStroke : dataset.pointHighlightStroke || dataset.pointStrokeColor
					}));
				},this);

				this.buildScale(data.labels);


				this.eachPoints(function(point, index){
					helpers.extend(point, {
						x: this.scale.calculateX(index),
						y: this.scale.endPoint
					});
					point.save();
				}, this);

			},this);


			this.render();
		},
		update : function(){
			this.scale.update();
			// Reset any highlight colours before updating.
			helpers.each(this.activeElements, function(activeElement){
				activeElement.restore(['fillColor', 'strokeColor']);
			});
			this.eachPoints(function(point){
				point.save();
			});
			this.render();
		},
		eachPoints : function(callback){
			helpers.each(this.datasets,function(dataset){
				helpers.each(dataset.points,callback,this);
			},this);
		},
		getPointsAtEvent : function(e){
			var pointsArray = [],
				eventPosition = helpers.getRelativePosition(e);
			helpers.each(this.datasets,function(dataset){
				helpers.each(dataset.points,function(point){
					if (point.inRange(eventPosition.x,eventPosition.y)) pointsArray.push(point);
				});
			},this);
			return pointsArray;
		},
		buildScale : function(labels){
			var self = this;

			var dataTotal = function(){
				var values = [];
				self.eachPoints(function(point){
					values.push(point.value);
				});

				return values;
			};

			var scaleOptions = {
				templateString : this.options.scaleLabel,
				height : this.chart.height,
				width : this.chart.width,
				ctx : this.chart.ctx,
				textColor : this.options.scaleFontColor,
				fontSize : this.options.scaleFontSize,
				fontStyle : this.options.scaleFontStyle,
				fontFamily : this.options.scaleFontFamily,
				valuesCount : labels.length,
				beginAtZero : this.options.scaleBeginAtZero,
				integersOnly : this.options.scaleIntegersOnly,
				calculateYRange : function(currentHeight){
					var updatedRanges = helpers.calculateScaleRange(
						dataTotal(),
						currentHeight,
						this.fontSize,
						this.beginAtZero,
						this.integersOnly
					);
					helpers.extend(this, updatedRanges);
				},
				xLabels : labels,
				font : helpers.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),
				lineWidth : this.options.scaleLineWidth,
				lineColor : this.options.scaleLineColor,
				showHorizontalLines : this.options.scaleShowHorizontalLines,
				showVerticalLines : this.options.scaleShowVerticalLines,
				gridLineWidth : (this.options.scaleShowGridLines) ? this.options.scaleGridLineWidth : 0,
				gridLineColor : (this.options.scaleShowGridLines) ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",
				padding: (this.options.showScale) ? 0 : this.options.pointDotRadius + this.options.pointDotStrokeWidth,
				showLabels : this.options.scaleShowLabels,
				display : this.options.showScale
			};

			if (this.options.scaleOverride){
				helpers.extend(scaleOptions, {
					calculateYRange: helpers.noop,
					steps: this.options.scaleSteps,
					stepValue: this.options.scaleStepWidth,
					min: this.options.scaleStartValue,
					max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
				});
			}


			this.scale = new Chart.Scale(scaleOptions);
		},
		addData : function(valuesArray,label){
			//Map the values array for each of the datasets

			helpers.each(valuesArray,function(value,datasetIndex){
				//Add a new point for each piece of data, passing any required data to draw.
				this.datasets[datasetIndex].points.push(new this.PointClass({
					value : value,
					label : label,
					x: this.scale.calculateX(this.scale.valuesCount+1),
					y: this.scale.endPoint,
					strokeColor : this.datasets[datasetIndex].pointStrokeColor,
					fillColor : this.datasets[datasetIndex].pointColor
				}));
			},this);

			this.scale.addXLabel(label);
			//Then re-render the chart.
			this.update();
		},
		removeData : function(){
			this.scale.removeXLabel();
			//Then re-render the chart.
			helpers.each(this.datasets,function(dataset){
				dataset.points.shift();
			},this);
			this.update();
		},
		reflow : function(){
			var newScaleProps = helpers.extend({
				height : this.chart.height,
				width : this.chart.width
			});
			this.scale.update(newScaleProps);
		},
		draw : function(ease){
			var easingDecimal = ease || 1;
			this.clear();

			var ctx = this.chart.ctx;

			// Some helper methods for getting the next/prev points
			var hasValue = function(item){
				return item.value !== null;
			},
			nextPoint = function(point, collection, index){
				return helpers.findNextWhere(collection, hasValue, index) || point;
			},
			previousPoint = function(point, collection, index){
				return helpers.findPreviousWhere(collection, hasValue, index) || point;
			};

			this.scale.draw(easingDecimal);


			helpers.each(this.datasets,function(dataset){
				var pointsWithValues = helpers.where(dataset.points, hasValue);

				//Transition each point first so that the line and point drawing isn't out of sync
				//We can use this extra loop to calculate the control points of this dataset also in this loop

				helpers.each(dataset.points, function(point, index){
					if (point.hasValue()){
						point.transition({
							y : this.scale.calculateY(point.value),
							x : this.scale.calculateX(index)
						}, easingDecimal);
					}
				},this);


				// Control points need to be calculated in a seperate loop, because we need to know the current x/y of the point
				// This would cause issues when there is no animation, because the y of the next point would be 0, so beziers would be skewed
				if (this.options.bezierCurve){
					helpers.each(pointsWithValues, function(point, index){
						var tension = (index > 0 && index < pointsWithValues.length - 1) ? this.options.bezierCurveTension : 0;
						point.controlPoints = helpers.splineCurve(
							previousPoint(point, pointsWithValues, index),
							point,
							nextPoint(point, pointsWithValues, index),
							tension
						);

						// Prevent the bezier going outside of the bounds of the graph

						// Cap puter bezier handles to the upper/lower scale bounds
						if (point.controlPoints.outer.y > this.scale.endPoint){
							point.controlPoints.outer.y = this.scale.endPoint;
						}
						else if (point.controlPoints.outer.y < this.scale.startPoint){
							point.controlPoints.outer.y = this.scale.startPoint;
						}

						// Cap inner bezier handles to the upper/lower scale bounds
						if (point.controlPoints.inner.y > this.scale.endPoint){
							point.controlPoints.inner.y = this.scale.endPoint;
						}
						else if (point.controlPoints.inner.y < this.scale.startPoint){
							point.controlPoints.inner.y = this.scale.startPoint;
						}
					},this);
				}


				//Draw the line between all the points
				ctx.lineWidth = this.options.datasetStrokeWidth;
				ctx.strokeStyle = dataset.strokeColor;
				ctx.beginPath();

				helpers.each(pointsWithValues, function(point, index){
					if (index === 0){
						ctx.moveTo(point.x, point.y);
					}
					else{
						if(this.options.bezierCurve){
							var previous = previousPoint(point, pointsWithValues, index);

							ctx.bezierCurveTo(
								previous.controlPoints.outer.x,
								previous.controlPoints.outer.y,
								point.controlPoints.inner.x,
								point.controlPoints.inner.y,
								point.x,
								point.y
							);
						}
						else{
							ctx.lineTo(point.x,point.y);
						}
					}
				}, this);

				ctx.stroke();

				if (this.options.datasetFill && pointsWithValues.length > 0){
					//Round off the line by going to the base of the chart, back to the start, then fill.
					ctx.lineTo(pointsWithValues[pointsWithValues.length - 1].x, this.scale.endPoint);
					ctx.lineTo(pointsWithValues[0].x, this.scale.endPoint);
					ctx.fillStyle = dataset.fillColor;
					ctx.closePath();
					ctx.fill();
				}

				//Now draw the points over the line
				//A little inefficient double looping, but better than the line
				//lagging behind the point positions
				helpers.each(pointsWithValues,function(point){
					point.draw();
				});
			},this);
		}
	});


}).call(this);

(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		//Cache a local reference to Chart.helpers
		helpers = Chart.helpers;

	var defaultConfig = {
		//Boolean - Show a backdrop to the scale label
		scaleShowLabelBackdrop : true,

		//String - The colour of the label backdrop
		scaleBackdropColor : "rgba(255,255,255,0.75)",

		// Boolean - Whether the scale should begin at zero
		scaleBeginAtZero : true,

		//Number - The backdrop padding above & below the label in pixels
		scaleBackdropPaddingY : 2,

		//Number - The backdrop padding to the side of the label in pixels
		scaleBackdropPaddingX : 2,

		//Boolean - Show line for each value in the scale
		scaleShowLine : true,

		//Boolean - Stroke a line around each segment in the chart
		segmentShowStroke : true,

		//String - The colour of the stroke on each segement.
		segmentStrokeColor : "#fff",

		//Number - The width of the stroke value in pixels
		segmentStrokeWidth : 2,

		//Number - Amount of animation steps
		animationSteps : 100,

		//String - Animation easing effect.
		animationEasing : "easeOutBounce",

		//Boolean - Whether to animate the rotation of the chart
		animateRotate : true,

		//Boolean - Whether to animate scaling the chart from the centre
		animateScale : false,

		//String - A legend template
		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
	};


	Chart.Type.extend({
		//Passing in a name registers this chart in the Chart namespace
		name: "PolarArea",
		//Providing a defaults will also register the deafults in the chart namespace
		defaults : defaultConfig,
		//Initialize is fired when the chart is initialized - Data is passed in as a parameter
		//Config is automatically merged by the core of Chart.js, and is available at this.options
		initialize:  function(data){
			this.segments = [];
			//Declare segment class as a chart instance specific class, so it can share props for this instance
			this.SegmentArc = Chart.Arc.extend({
				showStroke : this.options.segmentShowStroke,
				strokeWidth : this.options.segmentStrokeWidth,
				strokeColor : this.options.segmentStrokeColor,
				ctx : this.chart.ctx,
				innerRadius : 0,
				x : this.chart.width/2,
				y : this.chart.height/2
			});
			this.scale = new Chart.RadialScale({
				display: this.options.showScale,
				fontStyle: this.options.scaleFontStyle,
				fontSize: this.options.scaleFontSize,
				fontFamily: this.options.scaleFontFamily,
				fontColor: this.options.scaleFontColor,
				showLabels: this.options.scaleShowLabels,
				showLabelBackdrop: this.options.scaleShowLabelBackdrop,
				backdropColor: this.options.scaleBackdropColor,
				backdropPaddingY : this.options.scaleBackdropPaddingY,
				backdropPaddingX: this.options.scaleBackdropPaddingX,
				lineWidth: (this.options.scaleShowLine) ? this.options.scaleLineWidth : 0,
				lineColor: this.options.scaleLineColor,
				lineArc: true,
				width: this.chart.width,
				height: this.chart.height,
				xCenter: this.chart.width/2,
				yCenter: this.chart.height/2,
				ctx : this.chart.ctx,
				templateString: this.options.scaleLabel,
				valuesCount: data.length
			});

			this.updateScaleRange(data);

			this.scale.update();

			helpers.each(data,function(segment,index){
				this.addData(segment,index,true);
			},this);

			//Set up tooltip events on the chart
			if (this.options.showTooltips){
				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
					var activeSegments = (evt.type !== 'mouseout') ? this.getSegmentsAtEvent(evt) : [];
					helpers.each(this.segments,function(segment){
						segment.restore(["fillColor"]);
					});
					helpers.each(activeSegments,function(activeSegment){
						activeSegment.fillColor = activeSegment.highlightColor;
					});
					this.showTooltip(activeSegments);
				});
			}

			this.render();
		},
		getSegmentsAtEvent : function(e){
			var segmentsArray = [];

			var location = helpers.getRelativePosition(e);

			helpers.each(this.segments,function(segment){
				if (segment.inRange(location.x,location.y)) segmentsArray.push(segment);
			},this);
			return segmentsArray;
		},
		addData : function(segment, atIndex, silent){
			var index = atIndex || this.segments.length;

			this.segments.splice(index, 0, new this.SegmentArc({
				fillColor: segment.color,
				highlightColor: segment.highlight || segment.color,
				label: segment.label,
				value: segment.value,
				outerRadius: (this.options.animateScale) ? 0 : this.scale.calculateCenterOffset(segment.value),
				circumference: (this.options.animateRotate) ? 0 : this.scale.getCircumference(),
				startAngle: Math.PI * 1.5
			}));
			if (!silent){
				this.reflow();
				this.update();
			}
		},
		removeData: function(atIndex){
			var indexToDelete = (helpers.isNumber(atIndex)) ? atIndex : this.segments.length-1;
			this.segments.splice(indexToDelete, 1);
			this.reflow();
			this.update();
		},
		calculateTotal: function(data){
			this.total = 0;
			helpers.each(data,function(segment){
				this.total += segment.value;
			},this);
			this.scale.valuesCount = this.segments.length;
		},
		updateScaleRange: function(datapoints){
			var valuesArray = [];
			helpers.each(datapoints,function(segment){
				valuesArray.push(segment.value);
			});

			var scaleSizes = (this.options.scaleOverride) ?
				{
					steps: this.options.scaleSteps,
					stepValue: this.options.scaleStepWidth,
					min: this.options.scaleStartValue,
					max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
				} :
				helpers.calculateScaleRange(
					valuesArray,
					helpers.min([this.chart.width, this.chart.height])/2,
					this.options.scaleFontSize,
					this.options.scaleBeginAtZero,
					this.options.scaleIntegersOnly
				);

			helpers.extend(
				this.scale,
				scaleSizes,
				{
					size: helpers.min([this.chart.width, this.chart.height]),
					xCenter: this.chart.width/2,
					yCenter: this.chart.height/2
				}
			);

		},
		update : function(){
			this.calculateTotal(this.segments);

			helpers.each(this.segments,function(segment){
				segment.save();
			});
			
			this.reflow();
			this.render();
		},
		reflow : function(){
			helpers.extend(this.SegmentArc.prototype,{
				x : this.chart.width/2,
				y : this.chart.height/2
			});
			this.updateScaleRange(this.segments);
			this.scale.update();

			helpers.extend(this.scale,{
				xCenter: this.chart.width/2,
				yCenter: this.chart.height/2
			});

			helpers.each(this.segments, function(segment){
				segment.update({
					outerRadius : this.scale.calculateCenterOffset(segment.value)
				});
			}, this);

		},
		draw : function(ease){
			var easingDecimal = ease || 1;
			//Clear & draw the canvas
			this.clear();
			helpers.each(this.segments,function(segment, index){
				segment.transition({
					circumference : this.scale.getCircumference(),
					outerRadius : this.scale.calculateCenterOffset(segment.value)
				},easingDecimal);

				segment.endAngle = segment.startAngle + segment.circumference;

				// If we've removed the first segment we need to set the first one to
				// start at the top.
				if (index === 0){
					segment.startAngle = Math.PI * 1.5;
				}

				//Check to see if it's the last segment, if not get the next and update the start angle
				if (index < this.segments.length - 1){
					this.segments[index+1].startAngle = segment.endAngle;
				}
				segment.draw();
			}, this);
			this.scale.draw();
		}
	});

}).call(this);
(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		helpers = Chart.helpers;



	Chart.Type.extend({
		name: "Radar",
		defaults:{
			//Boolean - Whether to show lines for each scale point
			scaleShowLine : true,

			//Boolean - Whether we show the angle lines out of the radar
			angleShowLineOut : true,

			//Boolean - Whether to show labels on the scale
			scaleShowLabels : false,

			// Boolean - Whether the scale should begin at zero
			scaleBeginAtZero : true,

			//String - Colour of the angle line
			angleLineColor : "rgba(0,0,0,.1)",

			//Number - Pixel width of the angle line
			angleLineWidth : 1,

			//String - Point label font declaration
			pointLabelFontFamily : "'Arial'",

			//String - Point label font weight
			pointLabelFontStyle : "normal",

			//Number - Point label font size in pixels
			pointLabelFontSize : 10,

			//String - Point label font colour
			pointLabelFontColor : "#666",

			//Boolean - Whether to show a dot for each point
			pointDot : true,

			//Number - Radius of each point dot in pixels
			pointDotRadius : 3,

			//Number - Pixel width of point dot stroke
			pointDotStrokeWidth : 1,

			//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
			pointHitDetectionRadius : 20,

			//Boolean - Whether to show a stroke for datasets
			datasetStroke : true,

			//Number - Pixel width of dataset stroke
			datasetStrokeWidth : 2,

			//Boolean - Whether to fill the dataset with a colour
			datasetFill : true,

			//String - A legend template
			legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

		},

		initialize: function(data){
			this.PointClass = Chart.Point.extend({
				strokeWidth : this.options.pointDotStrokeWidth,
				radius : this.options.pointDotRadius,
				display: this.options.pointDot,
				hitDetectionRadius : this.options.pointHitDetectionRadius,
				ctx : this.chart.ctx
			});

			this.datasets = [];

			this.buildScale(data);

			//Set up tooltip events on the chart
			if (this.options.showTooltips){
				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
					var activePointsCollection = (evt.type !== 'mouseout') ? this.getPointsAtEvent(evt) : [];

					this.eachPoints(function(point){
						point.restore(['fillColor', 'strokeColor']);
					});
					helpers.each(activePointsCollection, function(activePoint){
						activePoint.fillColor = activePoint.highlightFill;
						activePoint.strokeColor = activePoint.highlightStroke;
					});

					this.showTooltip(activePointsCollection);
				});
			}

			//Iterate through each of the datasets, and build this into a property of the chart
			helpers.each(data.datasets,function(dataset){

				var datasetObject = {
					label: dataset.label || null,
					fillColor : dataset.fillColor,
					strokeColor : dataset.strokeColor,
					pointColor : dataset.pointColor,
					pointStrokeColor : dataset.pointStrokeColor,
					points : []
				};

				this.datasets.push(datasetObject);

				helpers.each(dataset.data,function(dataPoint,index){
					//Add a new point for each piece of data, passing any required data to draw.
					var pointPosition;
					if (!this.scale.animation){
						pointPosition = this.scale.getPointPosition(index, this.scale.calculateCenterOffset(dataPoint));
					}
					datasetObject.points.push(new this.PointClass({
						value : dataPoint,
						label : data.labels[index],
						datasetLabel: dataset.label,
						x: (this.options.animation) ? this.scale.xCenter : pointPosition.x,
						y: (this.options.animation) ? this.scale.yCenter : pointPosition.y,
						strokeColor : dataset.pointStrokeColor,
						fillColor : dataset.pointColor,
						highlightFill : dataset.pointHighlightFill || dataset.pointColor,
						highlightStroke : dataset.pointHighlightStroke || dataset.pointStrokeColor
					}));
				},this);

			},this);

			this.render();
		},
		eachPoints : function(callback){
			helpers.each(this.datasets,function(dataset){
				helpers.each(dataset.points,callback,this);
			},this);
		},

		getPointsAtEvent : function(evt){
			var mousePosition = helpers.getRelativePosition(evt),
				fromCenter = helpers.getAngleFromPoint({
					x: this.scale.xCenter,
					y: this.scale.yCenter
				}, mousePosition);

			var anglePerIndex = (Math.PI * 2) /this.scale.valuesCount,
				pointIndex = Math.round((fromCenter.angle - Math.PI * 1.5) / anglePerIndex),
				activePointsCollection = [];

			// If we're at the top, make the pointIndex 0 to get the first of the array.
			if (pointIndex >= this.scale.valuesCount || pointIndex < 0){
				pointIndex = 0;
			}

			if (fromCenter.distance <= this.scale.drawingArea){
				helpers.each(this.datasets, function(dataset){
					activePointsCollection.push(dataset.points[pointIndex]);
				});
			}

			return activePointsCollection;
		},

		buildScale : function(data){
			this.scale = new Chart.RadialScale({
				display: this.options.showScale,
				fontStyle: this.options.scaleFontStyle,
				fontSize: this.options.scaleFontSize,
				fontFamily: this.options.scaleFontFamily,
				fontColor: this.options.scaleFontColor,
				showLabels: this.options.scaleShowLabels,
				showLabelBackdrop: this.options.scaleShowLabelBackdrop,
				backdropColor: this.options.scaleBackdropColor,
				backdropPaddingY : this.options.scaleBackdropPaddingY,
				backdropPaddingX: this.options.scaleBackdropPaddingX,
				lineWidth: (this.options.scaleShowLine) ? this.options.scaleLineWidth : 0,
				lineColor: this.options.scaleLineColor,
				angleLineColor : this.options.angleLineColor,
				angleLineWidth : (this.options.angleShowLineOut) ? this.options.angleLineWidth : 0,
				// Point labels at the edge of each line
				pointLabelFontColor : this.options.pointLabelFontColor,
				pointLabelFontSize : this.options.pointLabelFontSize,
				pointLabelFontFamily : this.options.pointLabelFontFamily,
				pointLabelFontStyle : this.options.pointLabelFontStyle,
				height : this.chart.height,
				width: this.chart.width,
				xCenter: this.chart.width/2,
				yCenter: this.chart.height/2,
				ctx : this.chart.ctx,
				templateString: this.options.scaleLabel,
				labels: data.labels,
				valuesCount: data.datasets[0].data.length
			});

			this.scale.setScaleSize();
			this.updateScaleRange(data.datasets);
			this.scale.buildYLabels();
		},
		updateScaleRange: function(datasets){
			var valuesArray = (function(){
				var totalDataArray = [];
				helpers.each(datasets,function(dataset){
					if (dataset.data){
						totalDataArray = totalDataArray.concat(dataset.data);
					}
					else {
						helpers.each(dataset.points, function(point){
							totalDataArray.push(point.value);
						});
					}
				});
				return totalDataArray;
			})();


			var scaleSizes = (this.options.scaleOverride) ?
				{
					steps: this.options.scaleSteps,
					stepValue: this.options.scaleStepWidth,
					min: this.options.scaleStartValue,
					max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
				} :
				helpers.calculateScaleRange(
					valuesArray,
					helpers.min([this.chart.width, this.chart.height])/2,
					this.options.scaleFontSize,
					this.options.scaleBeginAtZero,
					this.options.scaleIntegersOnly
				);

			helpers.extend(
				this.scale,
				scaleSizes
			);

		},
		addData : function(valuesArray,label){
			//Map the values array for each of the datasets
			this.scale.valuesCount++;
			helpers.each(valuesArray,function(value,datasetIndex){
				var pointPosition = this.scale.getPointPosition(this.scale.valuesCount, this.scale.calculateCenterOffset(value));
				this.datasets[datasetIndex].points.push(new this.PointClass({
					value : value,
					label : label,
					x: pointPosition.x,
					y: pointPosition.y,
					strokeColor : this.datasets[datasetIndex].pointStrokeColor,
					fillColor : this.datasets[datasetIndex].pointColor
				}));
			},this);

			this.scale.labels.push(label);

			this.reflow();

			this.update();
		},
		removeData : function(){
			this.scale.valuesCount--;
			this.scale.labels.shift();
			helpers.each(this.datasets,function(dataset){
				dataset.points.shift();
			},this);
			this.reflow();
			this.update();
		},
		update : function(){
			this.eachPoints(function(point){
				point.save();
			});
			this.reflow();
			this.render();
		},
		reflow: function(){
			helpers.extend(this.scale, {
				width : this.chart.width,
				height: this.chart.height,
				size : helpers.min([this.chart.width, this.chart.height]),
				xCenter: this.chart.width/2,
				yCenter: this.chart.height/2
			});
			this.updateScaleRange(this.datasets);
			this.scale.setScaleSize();
			this.scale.buildYLabels();
		},
		draw : function(ease){
			var easeDecimal = ease || 1,
				ctx = this.chart.ctx;
			this.clear();
			this.scale.draw();

			helpers.each(this.datasets,function(dataset){

				//Transition each point first so that the line and point drawing isn't out of sync
				helpers.each(dataset.points,function(point,index){
					if (point.hasValue()){
						point.transition(this.scale.getPointPosition(index, this.scale.calculateCenterOffset(point.value)), easeDecimal);
					}
				},this);



				//Draw the line between all the points
				ctx.lineWidth = this.options.datasetStrokeWidth;
				ctx.strokeStyle = dataset.strokeColor;
				ctx.beginPath();
				helpers.each(dataset.points,function(point,index){
					if (index === 0){
						ctx.moveTo(point.x,point.y);
					}
					else{
						ctx.lineTo(point.x,point.y);
					}
				},this);
				ctx.closePath();
				ctx.stroke();

				ctx.fillStyle = dataset.fillColor;
				ctx.fill();

				//Now draw the points over the line
				//A little inefficient double looping, but better than the line
				//lagging behind the point positions
				helpers.each(dataset.points,function(point){
					if (point.hasValue()){
						point.draw();
					}
				});

			},this);

		}

	});





}).call(this);
},{}],4:[function(require,module,exports){
//! moment.js
//! version : 2.10.3
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = getParsingFlags(from);
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(+config._d);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function Locale() {
    }

    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && typeof module !== 'undefined' &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (typeof values === 'undefined') {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, values) {
        if (values !== null) {
            values.abbr = name;
            if (!locales[name]) {
                locales[name] = new Locale();
            }
            locales[name].set(values);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function get_set__set (mom, unit, value) {
        return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = typeof regex === 'function' ? regex : function (isStrict) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  matchWord);
    addRegexToken('MMMM', matchWord);

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m) {
        return this._months[m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m) {
        return this._monthsShort[m.month()];
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true,
            msgWithStack = msg + '\n' + (new Error()).stack;

        return extend(function () {
            if (firstTime) {
                warn(msgWithStack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
        ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
        ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d{2}/],
        ['YYYY-DDD', /\d{4}-\d{3}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
        ['HH:mm', /(T| )\d\d:\d\d/],
        ['HH', /(T| )\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = from_string__isoRegex.exec(string);

        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be 'T' or undefined
                    config._f = isoDates[i][0] + (match[6] || ' ');
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(matchOffset)) {
                config._f += 'Z';
            }
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYY', 'YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = createUTCDate(year, 0, 1).getUTCDay();
        var daysToAdd;
        var dayOfYear;

        d = d === 0 ? 7 : d;
        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year      : dayOfYear > 0 ? year      : year - 1,
            dayOfYear : dayOfYear > 0 ? dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
        }
        return [now.getFullYear(), now.getMonth(), now.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

        configFromArray(config);
    }

    function createFromConfig (config) {
        var input = config._i,
            format = config._f,
            res;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        res = new Moment(checkOverflow(config));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             return other < this ? this : other;
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            return other > this ? this : other;
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchOffset);
    addRegexToken('ZZ', matchOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(string) {
        var matches = ((string || '').match(matchOffset) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
        return model._isUTC ? local__createLocal(input).zone(model._offset || 0) : local__createLocal(input).local();
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(input);
            }
            if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!input) {
            input = 0;
        }
        else {
            input = local__createLocal(input).utcOffset();
        }

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (this._a) {
            var other = this._isUTC ? create_utc__createUTC(this._a) : local__createLocal(this._a);
            return this.isValid() && compareArrays(this._a, other.toArray()) > 0;
        }

        return false;
    }

    function isLocal () {
        return !this._isUTC;
    }

    function isUtcOffset () {
        return this._isUTC;
    }

    function isUtc () {
        return this._isUTC && this._offset === 0;
    }

    var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = create__isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                d : parseIso(match[4], sign),
                h : parseIso(match[5], sign),
                m : parseIso(match[6], sign),
                s : parseIso(match[7], sign),
                w : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
        return this.format(this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this > +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return inputMs < +this.clone().startOf(units);
        }
    }

    function isBefore (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this < +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return +this.clone().endOf(units) < inputMs;
        }
    }

    function isBetween (from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame (input, units) {
        var inputMs;
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this === +input;
        } else {
            inputMs = +local__createLocal(input);
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function diff (input, units, asFloat) {
        var that = cloneWithOffset(input, this),
            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4,
            delta, output;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if ('function' === typeof Date.prototype.toISOString) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(+this / 1000);
    }

    function toDate () {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function weeksInYear(year, dow, doy) {
        return weekOfYear(local__createLocal([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    // MOMENTS

    function getSetWeekYear (input) {
        var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getSetISOWeekYear (input) {
        var year = weekOfYear(this, 1, 4).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    addFormatToken('Q', 0, 0, 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   matchWord);
    addRegexToken('ddd',  matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config) {
        var weekday = config._locale.weekdaysParse(input);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = locale.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m) {
        return this._weekdays[m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse (weekdayName) {
        var i, mom, regex;

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            if (!this._weekdaysParse[i]) {
                mom = local__createLocal([2000, 1]).day(i);
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, function () {
        return this.hours() % 12 || 12;
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    function millisecond__milliseconds (token) {
        addFormatToken(0, [token, 3], 0, 'millisecond');
    }

    millisecond__milliseconds('SSS');
    millisecond__milliseconds('SSSS');

    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);
    addRegexToken('SSSS', matchUnsigned);
    addParseToken(['S', 'SS', 'SSS', 'SSSS'], function (input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    });

    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add          = add_subtract__add;
    momentPrototype__proto.calendar     = moment_calendar__calendar;
    momentPrototype__proto.clone        = clone;
    momentPrototype__proto.diff         = diff;
    momentPrototype__proto.endOf        = endOf;
    momentPrototype__proto.format       = format;
    momentPrototype__proto.from         = from;
    momentPrototype__proto.fromNow      = fromNow;
    momentPrototype__proto.to           = to;
    momentPrototype__proto.toNow        = toNow;
    momentPrototype__proto.get          = getSet;
    momentPrototype__proto.invalidAt    = invalidAt;
    momentPrototype__proto.isAfter      = isAfter;
    momentPrototype__proto.isBefore     = isBefore;
    momentPrototype__proto.isBetween    = isBetween;
    momentPrototype__proto.isSame       = isSame;
    momentPrototype__proto.isValid      = moment_valid__isValid;
    momentPrototype__proto.lang         = lang;
    momentPrototype__proto.locale       = locale;
    momentPrototype__proto.localeData   = localeData;
    momentPrototype__proto.max          = prototypeMax;
    momentPrototype__proto.min          = prototypeMin;
    momentPrototype__proto.parsingFlags = parsingFlags;
    momentPrototype__proto.set          = getSet;
    momentPrototype__proto.startOf      = startOf;
    momentPrototype__proto.subtract     = add_subtract__subtract;
    momentPrototype__proto.toArray      = toArray;
    momentPrototype__proto.toDate       = toDate;
    momentPrototype__proto.toISOString  = moment_format__toISOString;
    momentPrototype__proto.toJSON       = moment_format__toISOString;
    momentPrototype__proto.toString     = toString;
    momentPrototype__proto.unix         = unix;
    momentPrototype__proto.valueOf      = to_type__valueOf;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return typeof output === 'function' ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY LT',
        LLLL : 'dddd, MMMM D, YYYY LT'
    };

    function longDateFormat (key) {
        var output = this._longDateFormat[key];
        if (!output && this._longDateFormat[key.toUpperCase()]) {
            output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                return val.slice(1);
            });
            this._longDateFormat[key] = output;
        }
        return output;
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (typeof output === 'function') ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (typeof prop === 'function') {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months       =        localeMonths;
    prototype__proto._months      = defaultLocaleMonths;
    prototype__proto.monthsShort  =        localeMonthsShort;
    prototype__proto._monthsShort = defaultLocaleMonthsShort;
    prototype__proto.monthsParse  =        localeMonthsParse;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list (format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort (format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays (format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort (format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin (format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years = 0;

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // Accurately convert days to years, assume start from year 0.
        years = absFloor(daysToYears(days));
        days -= absFloor(yearsToDays(years));

        // 30 days to a month
        // TODO (iskren): Use anchor date (like 1st Jan) to compute this.
        months += absFloor(days / 30);
        days   %= 30;

        // 12 months -> 1 year
        years  += absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToYears (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        return days * 400 / 146097;
    }

    function yearsToDays (years) {
        // years * 365 + absFloor(years / 4) -
        //     absFloor(years / 100) + absFloor(years / 400);
        return years * 146097 / 400;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToYears(days) * 12;
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(yearsToDays(this._months / 12));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var duration_get__milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes === 1          && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   === 1          && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    === 1          && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  === 1          && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   === 1          && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = iso_string__abs(this.years());
        var M = iso_string__abs(this.months());
        var D = iso_string__abs(this.days());
        var h = iso_string__abs(this.hours());
        var m = iso_string__abs(this.minutes());
        var s = iso_string__abs(this.seconds() + this.milliseconds() / 1000);
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = duration_get__milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.10.3';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
},{}],5:[function(require,module,exports){
(function (process){
  /* globals require, module */

  'use strict';

  /**
   * Module dependencies.
   */

  var pathtoRegexp = require('path-to-regexp');

  /**
   * Module exports.
   */

  module.exports = page;

  /**
   * Detect click event
   */
  var clickEvent = document.ontouchstart ? 'touchstart' : 'click';

  /**
   * To work properly with the URL
   * history.location generated polyfill in https://github.com/devote/HTML5-History-API
   */

  var location = ('undefined' !== typeof window) && (window.history.location || window.location);

  /**
   * Perform initial dispatch.
   */

  var dispatch = true;


  /**
   * Decode URL components (query string, pathname, hash).
   * Accommodates both regular percent encoding and x-www-form-urlencoded format.
   */
  var decodeURLComponents = true;

  /**
   * Base path.
   */

  var base = '';

  /**
   * Running flag.
   */

  var running;

  /**
   * HashBang option
   */

  var hashbang = false;

  /**
   * Previous context, for capturing
   * page exit events.
   */

  var prevContext;

  /**
   * Register `path` with callback `fn()`,
   * or route `path`, or redirection,
   * or `page.start()`.
   *
   *   page(fn);
   *   page('*', fn);
   *   page('/user/:id', load, user);
   *   page('/user/' + user.id, { some: 'thing' });
   *   page('/user/' + user.id);
   *   page('/from', '/to')
   *   page();
   *
   * @param {String|Function} path
   * @param {Function} fn...
   * @api public
   */

  function page(path, fn) {
    // <callback>
    if ('function' === typeof path) {
      return page('*', path);
    }

    // route <path> to <callback ...>
    if ('function' === typeof fn) {
      var route = new Route(path);
      for (var i = 1; i < arguments.length; ++i) {
        page.callbacks.push(route.middleware(arguments[i]));
      }
      // show <path> with [state]
    } else if ('string' === typeof path) {
      page['string' === typeof fn ? 'redirect' : 'show'](path, fn);
      // start [options]
    } else {
      page.start(path);
    }
  }

  /**
   * Callback functions.
   */

  page.callbacks = [];
  page.exits = [];

  /**
   * Current path being processed
   * @type {String}
   */
  page.current = '';

  /**
   * Number of pages navigated to.
   * @type {number}
   *
   *     page.len == 0;
   *     page('/login');
   *     page.len == 1;
   */

  page.len = 0;

  /**
   * Get or set basepath to `path`.
   *
   * @param {String} path
   * @api public
   */

  page.base = function(path) {
    if (0 === arguments.length) return base;
    base = path;
  };

  /**
   * Bind with the given `options`.
   *
   * Options:
   *
   *    - `click` bind to click events [true]
   *    - `popstate` bind to popstate [true]
   *    - `dispatch` perform initial dispatch [true]
   *
   * @param {Object} options
   * @api public
   */

  page.start = function(options) {
    options = options || {};
    if (running) return;
    running = true;
    if (false === options.dispatch) dispatch = false;
    if (false === options.decodeURLComponents) decodeURLComponents = false;
    if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
    if (false !== options.click) {
      window.addEventListener(clickEvent, onclick, false);
    }
    if (true === options.hashbang) hashbang = true;
    if (!dispatch) return;
    var url = (hashbang && ~location.hash.indexOf('#!')) ? location.hash.substr(2) + location.search : location.pathname + location.search + location.hash;
    page.replace(url, null, true, dispatch);
  };

  /**
   * Unbind click and popstate event handlers.
   *
   * @api public
   */

  page.stop = function() {
    if (!running) return;
    page.current = '';
    page.len = 0;
    running = false;
    window.removeEventListener(clickEvent, onclick, false);
    window.removeEventListener('popstate', onpopstate, false);
  };

  /**
   * Show `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @param {Boolean} dispatch
   * @return {Context}
   * @api public
   */

  page.show = function(path, state, dispatch, push) {
    var ctx = new Context(path, state);
    page.current = ctx.path;
    if (false !== dispatch) page.dispatch(ctx);
    if (false !== ctx.handled && false !== push) ctx.pushState();
    return ctx;
  };

  /**
   * Goes back in the history
   * Back should always let the current route push state and then go back.
   *
   * @param {String} path - fallback path to go back if no more history exists, if undefined defaults to page.base
   * @param {Object} [state]
   * @api public
   */

  page.back = function(path, state) {
    if (page.len > 0) {
      // this may need more testing to see if all browsers
      // wait for the next tick to go back in history
      history.back();
      page.len--;
    } else if (path) {
      setTimeout(function() {
        page.show(path, state);
      });
    }else{
      setTimeout(function() {
        page.show(base, state);
      });
    }
  };


  /**
   * Register route to redirect from one path to other
   * or just redirect to another route
   *
   * @param {String} from - if param 'to' is undefined redirects to 'from'
   * @param {String} [to]
   * @api public
   */
  page.redirect = function(from, to) {
    // Define route from a path to another
    if ('string' === typeof from && 'string' === typeof to) {
      page(from, function(e) {
        setTimeout(function() {
          page.replace(to);
        }, 0);
      });
    }

    // Wait for the push state and replace it with another
    if ('string' === typeof from && 'undefined' === typeof to) {
      setTimeout(function() {
        page.replace(from);
      }, 0);
    }
  };

  /**
   * Replace `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @return {Context}
   * @api public
   */


  page.replace = function(path, state, init, dispatch) {
    var ctx = new Context(path, state);
    page.current = ctx.path;
    ctx.init = init;
    ctx.save(); // save before dispatching, which may redirect
    if (false !== dispatch) page.dispatch(ctx);
    return ctx;
  };

  /**
   * Dispatch the given `ctx`.
   *
   * @param {Object} ctx
   * @api private
   */

  page.dispatch = function(ctx) {
    var prev = prevContext,
      i = 0,
      j = 0;

    prevContext = ctx;

    function nextExit() {
      var fn = page.exits[j++];
      if (!fn) return nextEnter();
      fn(prev, nextExit);
    }

    function nextEnter() {
      var fn = page.callbacks[i++];

      if (ctx.path !== page.current) {
        ctx.handled = false;
        return;
      }
      if (!fn) return unhandled(ctx);
      fn(ctx, nextEnter);
    }

    if (prev) {
      nextExit();
    } else {
      nextEnter();
    }
  };

  /**
   * Unhandled `ctx`. When it's not the initial
   * popstate then redirect. If you wish to handle
   * 404s on your own use `page('*', callback)`.
   *
   * @param {Context} ctx
   * @api private
   */

  function unhandled(ctx) {
    if (ctx.handled) return;
    var current;

    if (hashbang) {
      current = base + location.hash.replace('#!', '');
    } else {
      current = location.pathname + location.search;
    }

    if (current === ctx.canonicalPath) return;
    page.stop();
    ctx.handled = false;
    location.href = ctx.canonicalPath;
  }

  /**
   * Register an exit route on `path` with
   * callback `fn()`, which will be called
   * on the previous context when a new
   * page is visited.
   */
  page.exit = function(path, fn) {
    if (typeof path === 'function') {
      return page.exit('*', path);
    }

    var route = new Route(path);
    for (var i = 1; i < arguments.length; ++i) {
      page.exits.push(route.middleware(arguments[i]));
    }
  };

  /**
   * Remove URL encoding from the given `str`.
   * Accommodates whitespace in both x-www-form-urlencoded
   * and regular percent-encoded form.
   *
   * @param {str} URL component to decode
   */
  function decodeURLEncodedURIComponent(val) {
    if (typeof val !== 'string') { return val; }
    return decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
  }

  /**
   * Initialize a new "request" `Context`
   * with the given `path` and optional initial `state`.
   *
   * @param {String} path
   * @param {Object} state
   * @api public
   */

  function Context(path, state) {
    if ('/' === path[0] && 0 !== path.indexOf(base)) path = base + (hashbang ? '#!' : '') + path;
    var i = path.indexOf('?');

    this.canonicalPath = path;
    this.path = path.replace(base, '') || '/';
    if (hashbang) this.path = this.path.replace('#!', '') || '/';

    this.title = document.title;
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i ? decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
    this.pathname = decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
    this.params = {};

    // fragment
    this.hash = '';
    if (!hashbang) {
      if (!~this.path.indexOf('#')) return;
      var parts = this.path.split('#');
      this.path = parts[0];
      this.hash = decodeURLEncodedURIComponent(parts[1]) || '';
      this.querystring = this.querystring.split('#')[0];
    }
  }

  /**
   * Expose `Context`.
   */

  page.Context = Context;

  /**
   * Push state.
   *
   * @api private
   */

  Context.prototype.pushState = function() {
    page.len++;
    history.pushState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
  };

  /**
   * Save the context state.
   *
   * @api public
   */

  Context.prototype.save = function() {
    history.replaceState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
  };

  /**
   * Initialize `Route` with the given HTTP `path`,
   * and an array of `callbacks` and `options`.
   *
   * Options:
   *
   *   - `sensitive`    enable case-sensitive routes
   *   - `strict`       enable strict matching for trailing slashes
   *
   * @param {String} path
   * @param {Object} options.
   * @api private
   */

  function Route(path, options) {
    options = options || {};
    this.path = (path === '*') ? '(.*)' : path;
    this.method = 'GET';
    this.regexp = pathtoRegexp(this.path,
      this.keys = [],
      options.sensitive,
      options.strict);
  }

  /**
   * Expose `Route`.
   */

  page.Route = Route;

  /**
   * Return route middleware with
   * the given callback `fn()`.
   *
   * @param {Function} fn
   * @return {Function}
   * @api public
   */

  Route.prototype.middleware = function(fn) {
    var self = this;
    return function(ctx, next) {
      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
      next();
    };
  };

  /**
   * Check if this route matches `path`, if so
   * populate `params`.
   *
   * @param {String} path
   * @param {Object} params
   * @return {Boolean}
   * @api private
   */

  Route.prototype.match = function(path, params) {
    var keys = this.keys,
      qsIndex = path.indexOf('?'),
      pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
      m = this.regexp.exec(decodeURIComponent(pathname));

    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];
      var val = decodeURLEncodedURIComponent(m[i]);
      if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
        params[key.name] = val;
      }
    }

    return true;
  };


  /**
   * Handle "populate" events.
   */

  var onpopstate = (function () {
    // this hack resolves https://github.com/visionmedia/page.js/issues/213
    var loaded = false;
    window.addEventListener('load', function() {
      setTimeout(function() {
        loaded = true;
      }, 0);
    });
    return function onpopstate(e) {
      if (!loaded) return;
      if (e.state) {
        var path = e.state.path;
        page.replace(path, e.state);
      } else {
        page.show(location.pathname + location.hash, undefined, undefined, false);
      }
    };
  })();
  /**
   * Handle "click" events.
   */

  function onclick(e) {

    if (1 !== which(e)) return;

    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.defaultPrevented) return;



    // ensure link
    var el = e.target;
    while (el && 'A' !== el.nodeName) el = el.parentNode;
    if (!el || 'A' !== el.nodeName) return;



    // Ignore if tag has
    // 1. "download" attribute
    // 2. rel="external" attribute
    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

    // ensure non-hash for the same path
    var link = el.getAttribute('href');
    if (!hashbang && el.pathname === location.pathname && (el.hash || '#' === link)) return;



    // Check for mailto: in the href
    if (link && link.indexOf('mailto:') > -1) return;

    // check target
    if (el.target) return;

    // x-origin
    if (!sameOrigin(el.href)) return;



    // rebuild path
    var path = el.pathname + el.search + (el.hash || '');

    // strip leading "/[drive letter]:" on NW.js on Windows
    if (typeof process !== 'undefined' && path.match(/^\/[a-zA-Z]:\//)) {
      path = path.replace(/^\/[a-zA-Z]:\//, '/');
    }

    // same page
    var orig = path;

    if (path.indexOf(base) === 0) {
      path = path.substr(base.length);
    }

    if (hashbang) path = path.replace('#!', '');

    if (base && orig === path) return;

    e.preventDefault();
    page.show(orig);
  }

  /**
   * Event button.
   */

  function which(e) {
    e = e || window.event;
    return null === e.which ? e.button : e.which;
  }

  /**
   * Check if `href` is the same origin.
   */

  function sameOrigin(href) {
    var origin = location.protocol + '//' + location.hostname;
    if (location.port) origin += ':' + location.port;
    return (href && (0 === href.indexOf(origin)));
  }

  page.sameOrigin = sameOrigin;

}).call(this,require('_process'))

},{"_process":2,"path-to-regexp":6}],6:[function(require,module,exports){
var isArray = require('isarray');

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
  // "/route(\\d+)" => [undefined, undefined, undefined, "\d+", undefined]
  '([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([+*?])?',
  // Match regexp special characters that are always escaped.
  '([.+*?=^!:${}()[\\]|\\/])'
].join('|'), 'g');

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {String} group
 * @return {String}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1');
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {RegExp} re
 * @param  {Array}  keys
 * @return {RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re;
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {String}
 */
function flags (options) {
  return options.sensitive ? '' : 'i';
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {RegExp} path
 * @param  {Array}  keys
 * @return {RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name:      i,
        delimiter: null,
        optional:  false,
        repeat:    false
      });
    }
  }

  return attachKeys(path, keys);
}

/**
 * Transform an array into a regexp.
 *
 * @param  {Array}  path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));
  return attachKeys(regexp, keys);
}

/**
 * Replace the specific tags with regexp strings.
 *
 * @param  {String} path
 * @param  {Array}  keys
 * @return {String}
 */
function replacePath (path, keys) {
  var index = 0;

  function replace (_, escaped, prefix, key, capture, group, suffix, escape) {
    if (escaped) {
      return escaped;
    }

    if (escape) {
      return '\\' + escape;
    }

    var repeat   = suffix === '+' || suffix === '*';
    var optional = suffix === '?' || suffix === '*';

    keys.push({
      name:      key || index++,
      delimiter: prefix || '/',
      optional:  optional,
      repeat:    repeat
    });

    prefix = prefix ? ('\\' + prefix) : '';
    capture = escapeGroup(capture || group || '[^' + (prefix || '\\/') + ']+?');

    if (repeat) {
      capture = capture + '(?:' + prefix + capture + ')*';
    }

    if (optional) {
      return '(?:' + prefix + '(' + capture + '))?';
    }

    // Basic parameter support.
    return prefix + '(' + capture + ')';
  }

  return path.replace(PATH_REGEXP, replace);
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(String|RegExp|Array)} path
 * @param  {Array}                 [keys]
 * @param  {Object}                [options]
 * @return {RegExp}
 */
function pathToRegexp (path, keys, options) {
  keys = keys || [];

  if (!isArray(keys)) {
    options = keys;
    keys = [];
  } else if (!options) {
    options = {};
  }

  if (path instanceof RegExp) {
    return regexpToRegexp(path, keys, options);
  }

  if (isArray(path)) {
    return arrayToRegexp(path, keys, options);
  }

  var strict = options.strict;
  var end = options.end !== false;
  var route = replacePath(path, keys);
  var endsWithSlash = path.charAt(path.length - 1) === '/';

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithSlash ? '' : '(?=\\/|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys);
}

},{"isarray":7}],7:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],8:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var page = _interopRequire(require("page"));

var FileNotFoundPage = require("pages/FileNotFoundPage.jsx").FileNotFoundPage;

var Router = exports.Router = (function () {
    function Router(mountPointId) {
        _classCallCheck(this, Router);

        this.routes = {};

        window.app.mountPoint = document.getElementById(mountPointId);
        this.mountPoint = window.app.mountPoint;
    }

    _createClass(Router, {
        addRoute: {
            value: function addRoute(route, controller) {
                this.routes[route] = controller;
            }
        },
        start: {
            value: function start() {

                var me = this;

                for (var i in this.routes) {
                    page(i, this.routes[i]);
                }

                page("*", function (ctx, next) {
                    console.error("404", ctx, next);
                    React.render(React.createElement(FileNotFoundPage, null), window.app.mountPoint);
                });

                page();
            }
        }
    });

    return Router;
})();

},{"page":5,"pages/FileNotFoundPage.jsx":24}],9:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var AppSettingsModal = exports.AppSettingsModal = (function (_React$Component) {
    function AppSettingsModal(props) {
        _classCallCheck(this, AppSettingsModal);

        _get(Object.getPrototypeOf(AppSettingsModal.prototype), "constructor", this).call(this, props);

        this.state = {
            saveSettingsInProgress: false,
            weight: 0,
            height: 0,
            gender: "other",
            age: 0
        };
    }

    _inherits(AppSettingsModal, _React$Component);

    _createClass(AppSettingsModal, {
        componentDidMount: {
            value: function componentDidMount() {

                $(React.findDOMNode(this)).on("shown.bs.modal", this.shown.bind(this));
            }
        },
        shown: {
            value: function shown(e) {
                $.get("/api/settings", (function (result) {

                    if (result.success != false) {
                        console.log(result);

                        this.setState({
                            gender: result.gender,
                            weight: result.weight,
                            height: result.height,
                            age: result.age
                        });
                    }
                }).bind(this));
            }
        },
        beginSaveSettings: {
            value: function beginSaveSettings() {

                this.setState({ saveSettingsInProgress: true });

                var params = {
                    weight: this.state.weight,
                    height: this.state.height,
                    age: this.state.age,
                    gender: this.state.gender
                };

                $.post("/api/update_settings", params, (function (result) {
                    console.log(result);

                    this.setState({ saveSettingsInProgress: false });

                    $(React.findDOMNode(this)).modal("hide");
                }).bind(this));
            }
        },
        weightChanged: {

            // kg

            value: function weightChanged(e) {
                this.setState({ weight: parseInt(e.target.value) });
            }
        },
        heightChanged: {

            // cm

            value: function heightChanged(e) {
                this.setState({ height: parseInt(e.target.value) });
            }
        },
        genderChanged: {

            // string

            value: function genderChanged(e) {
                this.setState({ gender: e.target.value });
            }
        },
        ageChanged: {

            // years

            value: function ageChanged(e) {
                this.setState({ age: parseInt(e.target.value) });
            }
        },
        getForm: {
            value: function getForm() {
                return React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { forName: "weight" },
                        "Weight (kg)"
                    ),
                    React.createElement("input", { name: "weight", value: this.state.weight, type: "number", onChange: this.weightChanged.bind(this), className: "form-control" }),
                    React.createElement(
                        "label",
                        { forName: "height" },
                        "Height (cm)"
                    ),
                    React.createElement("input", { name: "height", value: this.state.height, type: "number", onChange: this.heightChanged.bind(this), className: "form-control" }),
                    React.createElement(
                        "label",
                        { forName: "age" },
                        "Age (years)"
                    ),
                    React.createElement("input", { name: "age", value: this.state.age, type: "number", onChange: this.ageChanged.bind(this), className: "form-control" }),
                    React.createElement(
                        "label",
                        { forName: "gender" },
                        "Gender"
                    ),
                    React.createElement(
                        "select",
                        { className: "form-control", value: this.state.gender, onChange: this.genderChanged.bind(this) },
                        React.createElement(
                            "option",
                            { value: "male" },
                            "Male"
                        ),
                        React.createElement(
                            "option",
                            { value: "female" },
                            "Female"
                        ),
                        React.createElement(
                            "option",
                            { value: "other" },
                            "Other"
                        )
                    )
                );
            }
        },
        render: {
            value: function render() {

                var beforeImportBody = [React.createElement(
                    "p",
                    null,
                    "Please configure the application settings, this information is used to calculate the kilojoules you burn on each run."
                ), this.getForm()];

                var body = beforeImportBody;

                return React.createElement(
                    "div",
                    { className: "modal fade", id: "settings_modal" },
                    React.createElement(
                        "div",
                        { className: "modal-dialog" },
                        React.createElement(
                            "div",
                            { className: "modal-content" },
                            React.createElement(
                                "div",
                                { className: "modal-header" },
                                React.createElement(
                                    "button",
                                    { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
                                    React.createElement(
                                        "span",
                                        { "aria-hidden": "true" },
                                        "×"
                                    )
                                ),
                                React.createElement(
                                    "h4",
                                    { className: "modal-title" },
                                    React.createElement("i", { className: "ion ion-gear-a" }),
                                    " Application Settings"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "modal-body" },
                                body
                            ),
                            React.createElement(
                                "div",
                                { className: "modal-footer" },
                                React.createElement(
                                    "button",
                                    { type: "button", className: "btn btn-default", "data-dismiss": "modal" },
                                    "Close"
                                ),
                                React.createElement(
                                    "button",
                                    { type: "button", className: "btn btn-primary", onClick: this.beginSaveSettings.bind(this), disabled: this.state.saveSettingsInProgress },
                                    "Save"
                                )
                            )
                        )
                    )
                );
            }
        }
    });

    return AppSettingsModal;
})(React.Component);

},{}],10:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});
var ChartJs = require("chart.js");

var BarChart = exports.BarChart = (function (_React$Component) {
    function BarChart() {
        _classCallCheck(this, BarChart);
    }

    _inherits(BarChart, _React$Component);

    _createClass(BarChart, {
        createChart: {
            value: function createChart() {
                var context = $(React.findDOMNode(this)).find(".chart")[0].getContext("2d");
                this.chart = new ChartJs(context).Bar(this.props.data, this.props.opts);
            }
        },
        componentDidMount: {
            value: function componentDidMount() {
                this.createChart();
            }
        },
        componentWillUpdate: {
            value: function componentWillUpdate() {
                this.chart.destroy();
                this.createChart();
            }
        },
        render: {
            value: function render() {
                return React.createElement(
                    "div",
                    null,
                    React.createElement("canvas", { className: "chart", width: "400", height: "200" })
                );
            }
        }
    });

    return BarChart;
})(React.Component);

},{"chart.js":3}],11:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Body = exports.Body = (function (_React$Component) {
    function Body() {
        _classCallCheck(this, Body);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Body, _React$Component);

    _createClass(Body, {
        render: {
            value: function render() {
                return React.createElement(
                    "div",
                    null,
                    "Hello there!",
                    React.createElement(
                        "a",
                        { href: "/dashboard" },
                        "Dashboard"
                    )
                );
            }
        }
    });

    return Body;
})(React.Component);

},{}],12:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var ImportDataModal = exports.ImportDataModal = (function (_React$Component) {
    function ImportDataModal(props) {
        _classCallCheck(this, ImportDataModal);

        _get(Object.getPrototypeOf(ImportDataModal.prototype), "constructor", this).call(this, props);

        this.state = {
            importFailed: false,
            importInProgress: false,
            attemptedImport: false
        };
    }

    _inherits(ImportDataModal, _React$Component);

    _createClass(ImportDataModal, {
        passwordChange: {
            value: function passwordChange(e) {
                this.setState({
                    password: e.target.value
                });
            }
        },
        beginDataImport: {
            value: function beginDataImport() {

                this.setState({ importInProgress: true, attemptedImport: true });

                $.post("/api/import_data", { password: this.state.password }, (function (result) {

                    console.log(result);
                    if (result.success) {
                        this.setState({ importFailed: false });
                    } else {
                        this.setState({
                            importFailed: true,
                            errorMessage: result.error
                        });
                    }

                    this.setState({ importInProgress: false });
                }).bind(this));
            }
        },
        render: {
            value: function render() {

                var beforeImportBody = [React.createElement(
                    "p",
                    null,
                    "Enter your password to import your run data"
                ), React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { forName: "password" },
                        "Password"
                    ),
                    React.createElement("input", { name: "password", value: this.state.password, onChange: this.passwordChange.bind(this), className: "form-control", type: "password" })
                )];

                var failedImportBody = [React.createElement(
                    "div",
                    { className: "alert alert-danger", role: "alert" },
                    React.createElement(
                        "strong",
                        null,
                        "Import failed"
                    ),
                    ": ",
                    this.state.errorMessage
                ), React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { forName: "password" },
                        "Password"
                    ),
                    React.createElement("input", { name: "password", value: this.state.password, onChange: this.passwordChange.bind(this), className: "form-control", type: "password" })
                )];

                var importInProgress = [React.createElement(
                    "div",
                    { className: "alert alert-info", role: "alert" },
                    "Import processing..."
                )];

                var successImportBody = [React.createElement(
                    "div",
                    { className: "alert alert-success", role: "alert" },
                    "Import succeeded!"
                )];

                var body;

                if (this.state.importInProgress) {
                    body = importInProgress;
                } else {
                    if (this.state.attemptedImport) {
                        if (this.state.importFailed) {
                            body = failedImportBody;
                        } else {
                            body = successImportBody;
                        }
                    } else {
                        body = beforeImportBody;
                    }
                }

                return React.createElement(
                    "div",
                    { className: "modal fade" },
                    React.createElement(
                        "div",
                        { className: "modal-dialog" },
                        React.createElement(
                            "div",
                            { className: "modal-content" },
                            React.createElement(
                                "div",
                                { className: "modal-header" },
                                React.createElement(
                                    "button",
                                    { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
                                    React.createElement(
                                        "span",
                                        { "aria-hidden": "true" },
                                        "×"
                                    )
                                ),
                                React.createElement(
                                    "h4",
                                    { className: "modal-title" },
                                    React.createElement("i", { className: "ion-upload" }),
                                    " Import your Runs"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "modal-body" },
                                body
                            ),
                            React.createElement(
                                "div",
                                { className: "modal-footer" },
                                React.createElement(
                                    "button",
                                    { type: "button", className: "btn btn-default", "data-dismiss": "modal" },
                                    "Close"
                                ),
                                React.createElement(
                                    "button",
                                    { type: "button", className: "btn btn-primary", onClick: this.beginDataImport.bind(this), disabled: this.state.importInProgress },
                                    "Begin Import"
                                )
                            )
                        )
                    )
                );
            }
        }
    });

    return ImportDataModal;
})(React.Component);

},{}],13:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});
var ChartJs = require("chart.js");

var LineChart = exports.LineChart = (function (_React$Component) {
    function LineChart() {
        _classCallCheck(this, LineChart);

        this.chart = null;
    }

    _inherits(LineChart, _React$Component);

    _createClass(LineChart, {
        createChart: {
            value: function createChart() {
                var context = $(React.findDOMNode(this)).find(".chart")[0].getContext("2d");
                this.chart = new ChartJs(context).Line(this.props.data, this.props.opts);
            }
        },
        componentDidMount: {
            value: function componentDidMount() {
                this.createChart();
            }
        },
        componentWillUpdate: {
            value: function componentWillUpdate() {
                this.chart.destroy();
                this.createChart();
            }
        },
        render: {
            value: function render() {
                return React.createElement(
                    "div",
                    null,
                    React.createElement("canvas", { className: "chart center-chart", width: this.props.width, height: this.props.height })
                );
            }
        }
    });

    return LineChart;
})(React.Component);

LineChart.defaultProps = {
    width: 360,
    height: 180
};

},{"chart.js":3}],14:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Navbar = require("components/Navbar.jsx").Navbar;

var ModalTrigger = require("components/ModalTrigger.jsx").ModalTrigger;

var UploadDataButton = require("components/UploadDataButton.jsx").UploadDataButton;

var ImportDataModal = require("components/ImportDataModal.jsx").ImportDataModal;

var MainNavbar = exports.MainNavbar = (function (_React$Component) {
    function MainNavbar() {
        _classCallCheck(this, MainNavbar);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(MainNavbar, _React$Component);

    _createClass(MainNavbar, {
        importData: {
            value: function importData(e) {
                e.preventDefault();
                console.log(e);
            }
        },
        render: {
            value: function render() {

                var links = [{ name: "Dashboard", icon: "ion-ios-home", url: "/dashboard", click: function click() {}, context: this, button: false }, { name: "Run History", icon: "ion-stats-bars", url: "/history", click: function click() {}, context: this, button: false }];

                return React.createElement(Navbar, { links: links });
            }
        }
    });

    return MainNavbar;
})(React.Component);

},{"components/ImportDataModal.jsx":12,"components/ModalTrigger.jsx":16,"components/Navbar.jsx":17,"components/UploadDataButton.jsx":22}],15:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Map = exports.Map = (function (_React$Component) {
    function Map() {
        _classCallCheck(this, Map);

        this.defaultOptsString = "size=600x300&maptype=roadmap";
    }

    _inherits(Map, _React$Component);

    _createClass(Map, {
        getStaticUrl: {
            value: function getStaticUrl() {
                var staticMapUrl = "https://maps.googleapis.com/maps/api/staticmap?" + this.defaultOptsString + "&" + this.centerString + "&" + this.zoomString + "&" + this.runPathString + "&" + this.markerString;

                console.log(staticMapUrl);
                return staticMapUrl;
            }
        },
        computeRunPath: {
            value: function computeRunPath(waypoints, bounds) {
                var runPath = [];

                for (var i = 0; i < waypoints.length; i++) {
                    var point = new google.maps.LatLng(waypoints[i].lat, waypoints[i].lon);
                    runPath.push(point);
                    bounds.extend(point);
                }

                return runPath;
            }
        },
        updateRunPathString: {
            value: function updateRunPathString(runPath) {
                this.runPathString = "path=color:0x0000ff|weight:5|";

                for (var i = 0; i < runPath.length; i++) {
                    this.runPathString += runPath[i].A + "," + runPath[i].F;

                    if (i < runPath.length - 1) {
                        this.runPathString += "|";
                    }
                }
            }
        },
        updateMarkerString: {
            value: function updateMarkerString(start, end) {
                this.markerString = "markers=color:blue|" + start.A + "," + start.F + "|" + end.A + "," + end.F;
            }
        },
        mapZoomHandler: {
            value: function mapZoomHandler(map, e) {
                this.zoomString = "zoom=" + map.zoom;
            }
        },
        mapCenterHandler: {
            value: function mapCenterHandler(map, e) {
                this.centerString = "center=" + map.center.A + "," + map.center.F;
            }
        },
        initStaticMapStrings: {
            value: function initStaticMapStrings() {
                this.defaultOptsString = "size=600x300&maptype=roadmap";
            }
        },
        createRunPathPolyline: {
            value: function createRunPathPolyline(map, waypoints, runPath) {
                var runPathPolyLine;

                for (var i = 0; i < waypoints.length - 1; i++) {

                    var dx = parseFloat(waypoints[i].lat) - parseFloat(waypoints[i + 1].lat);
                    var dy = parseFloat(waypoints[i].lon) - parseFloat(waypoints[i + 1].lon);
                    var dist = Math.sqrt(dx * dx + dy * dy) * 1000;
                    dist *= 500;
                    if (dist > 230) {
                        dist = 230;
                    }
                    if (dist < 20) {
                        dist = 20;
                    }
                    console.log(dist);
                    var r, g, b;
                    r = parseInt(255 - dist);
                    g = parseInt(dist);
                    b = 20;
                    console.log(r, g, b);

                    runPathPolyLine = new google.maps.Polyline({
                        path: [runPath[i], runPath[i + 1]],
                        geodesic: true,
                        strokeColor: "rgba(" + r + ", " + g + ", " + b + ", 1)",
                        strokeOpacity: 1,
                        strokeWeight: 2
                    });

                    runPathPolyLine.setMap(map);
                }
            }
        },
        placeMarkers: {
            value: function placeMarkers(map, waypoints, runPath) {
                var _this = this;

                var startImage = "/img/start.png";
                var endImage = "/img/end.png";
                var nodeImage = "/img/blank.png";
                var icon;

                for (var i = 0; i < runPath.length; i++) {
                    var marker;

                    (function () {
                        if (i == 0) {
                            icon = startImage;
                        } else if (i == runPath.length - 1) {
                            icon = endImage;
                        } else {
                            icon = nodeImage;
                        }

                        var wp = _this.props.waypoints[i];

                        marker = new google.maps.Marker({
                            position: runPath[i],
                            map: map,
                            title: "Title Test",
                            icon: icon
                        });

                        (function (marker) {
                            var infowindow = new google.maps.InfoWindow({
                                content: "" + window.app.moment(wp.time * 1000).format(window.app.timeFormat)
                            });
                            google.maps.event.addListener(marker, "mouseover", function () {
                                infowindow.open(map, marker);
                            });

                            google.maps.event.addListener(marker, "mouseout", function () {
                                infowindow.close(map, marker);
                            });
                        })(marker);
                    })();
                }
            }
        },
        componentDidMount: {
            value: function componentDidMount() {
                var bounds = new google.maps.LatLngBounds();
                var runPath = this.computeRunPath(this.props.waypoints, bounds);

                var mapOptions = {
                    mapTypeId: google.maps.MapTypeId.TERRAIN
                };

                var map = new google.maps.Map($(React.findDOMNode(this)).find(".map-canvas")[0], mapOptions);
                this.map = map;
                map.fitBounds(bounds);

                google.maps.event.addListenerOnce(map, "zoom_changed", this.mapZoomHandler.bind(this, map));
                google.maps.event.addListenerOnce(map, "center_changed", this.mapCenterHandler.bind(this, map));

                this.updateMarkerString(runPath[0], runPath[runPath.length - 1]);
                this.updateRunPathString(runPath);

                this.createRunPathPolyline(map, this.props.waypoints, runPath);
                this.placeMarkers(map, this.props.waypoints, runPath);
            }
        },
        render: {
            value: function render() {
                return React.createElement(
                    "div",
                    null,
                    React.createElement("div", { className: "map-canvas" })
                );
            }
        }
    });

    return Map;
})(React.Component);

},{}],16:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var ModalTrigger = exports.ModalTrigger = (function (_React$Component) {
    function ModalTrigger() {
        _classCallCheck(this, ModalTrigger);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(ModalTrigger, _React$Component);

    _createClass(ModalTrigger, {
        triggerModal: {
            value: function triggerModal(e) {
                e.preventDefault();

                React.render(this.props.modal, $("#modal_mount")[0]);
                $("#modal_mount").find(".modal").modal("show");
            }
        },
        render: {
            value: function render() {

                var inner;

                if (this.props.button) {
                    inner = React.createElement(
                        "button",
                        { className: this.props.className, onClick: this.triggerModal.bind(this) },
                        this.props.buttonText
                    );
                } else {
                    inner = React.createElement(
                        "a",
                        { className: this.props.className, href: "#", onClick: this.triggerModal.bind(this) },
                        this.props.buttonText
                    );
                }

                return React.createElement(
                    "div",
                    { className: "inline-block" },
                    inner
                );
            }
        }
    });

    return ModalTrigger;
})(React.Component);

},{}],17:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var ModalTrigger = require("./ModalTrigger.jsx").ModalTrigger;

var AppSettingsModal = require("./AppSettingsModal.jsx").AppSettingsModal;

var ImportDataModal = require("components/ImportDataModal.jsx").ImportDataModal;

var UploadDataButton = require("components/UploadDataButton.jsx").UploadDataButton;

var Navbar = exports.Navbar = (function (_React$Component) {
    function Navbar() {
        _classCallCheck(this, Navbar);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Navbar, _React$Component);

    _createClass(Navbar, {
        render: {
            value: function render() {
                return React.createElement(
                    "nav",
                    { className: "navbar navbar-default" },
                    React.createElement(
                        "div",
                        { className: "container-fluid" },
                        React.createElement(
                            "div",
                            { className: "navbar-header" },
                            React.createElement(
                                "button",
                                { type: "button", className: "navbar-toggle collapsed", "data-toggle": "collapse", "data-target": "#bs-example-navbar-collapse-1" },
                                React.createElement(
                                    "span",
                                    { className: "sr-only" },
                                    "Toggle navigation"
                                ),
                                React.createElement("span", { className: "icon-bar" }),
                                React.createElement("span", { className: "icon-bar" }),
                                React.createElement("span", { className: "icon-bar" })
                            ),
                            React.createElement(
                                "a",
                                { className: "navbar-brand", href: "/" },
                                "Living Dead Fitness Tracker"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "collapse navbar-collapse", id: "bs-example-navbar-collapse-1" },
                            React.createElement(
                                "ul",
                                { className: "nav navbar-nav" },
                                this.props.links.map(function (entry) {

                                    if (typeof entry.component != "undefined") {
                                        return React.createElement(
                                            "li",
                                            null,
                                            entry.component
                                        );
                                    } else {
                                        if (entry.button) {
                                            return React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "button",
                                                    { className: "btn btn-default navbar-btn", onClick: entry.click.bind(entry.context) },
                                                    entry.name
                                                )
                                            );
                                        } else {
                                            return React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "a",
                                                    { href: entry.url, onClick: entry.click.bind(entry.context) },
                                                    React.createElement("i", { className: entry.icon }),
                                                    " ",
                                                    entry.name
                                                )
                                            );
                                        }
                                    }
                                })
                            ),
                            React.createElement(
                                "ul",
                                { className: "nav navbar-nav navbar-right" },
                                React.createElement(
                                    "li",
                                    null,
                                    React.createElement(ModalTrigger, { modal: React.createElement(ImportDataModal, null), button: true, className: "btn btn-default navbar-btn margin-right", buttonText: React.createElement(UploadDataButton, null) })
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    React.createElement(ModalTrigger, { modal: React.createElement(AppSettingsModal, null), button: true, className: "btn btn-default navbar-btn", buttonText: React.createElement("i", { className: "ion ion-gear-a" }) })
                                )
                            )
                        )
                    )
                );
            }
        }
    });

    return Navbar;
})(React.Component);

},{"./AppSettingsModal.jsx":9,"./ModalTrigger.jsx":16,"components/ImportDataModal.jsx":12,"components/UploadDataButton.jsx":22}],18:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});
var ChartJs = require("chart.js");

var PieChart = exports.PieChart = (function (_React$Component) {
    function PieChart() {
        _classCallCheck(this, PieChart);
    }

    _inherits(PieChart, _React$Component);

    _createClass(PieChart, {
        createChart: {
            value: function createChart() {
                var context = $(React.findDOMNode(this)).find(".chart")[0].getContext("2d");
                this.chart = new ChartJs(context).Pie(this.props.data, this.props.opts);
            }
        },
        componentDidMount: {
            value: function componentDidMount() {
                this.createChart();
            }
        },
        componentWillUpdate: {
            value: function componentWillUpdate() {
                this.chart.destroy();
                this.createChart();
            }
        },
        render: {
            value: function render() {
                return React.createElement(
                    "div",
                    null,
                    React.createElement("canvas", { className: "chart", width: "400", height: "200" })
                );
            }
        }
    });

    return PieChart;
})(React.Component);

},{"chart.js":3}],19:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});
var ChartJs = require("chart.js");

var RadarChart = exports.RadarChart = (function (_React$Component) {
    function RadarChart() {
        _classCallCheck(this, RadarChart);
    }

    _inherits(RadarChart, _React$Component);

    _createClass(RadarChart, {
        createChart: {
            value: function createChart() {
                var context = $(React.findDOMNode(this)).find(".chart")[0].getContext("2d");
                this.chart = new ChartJs(context).Radar(this.props.data, this.props.opts);
            }
        },
        componentDidMount: {
            value: function componentDidMount() {
                this.createChart();
            }
        },
        componentWillUpdate: {
            value: function componentWillUpdate() {
                this.chart.destroy();
                this.createChart();
            }
        },
        render: {
            value: function render() {
                return React.createElement(
                    "div",
                    null,
                    React.createElement("canvas", { className: "chart", width: "400", height: "200" })
                );
            }
        }
    });

    return RadarChart;
})(React.Component);

},{"chart.js":3}],20:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _componentsSocialSharingJsx = require("components/SocialSharing.jsx");

var FacebookShareButton = _componentsSocialSharingJsx.FacebookShareButton;
var TwitterShareButton = _componentsSocialSharingJsx.TwitterShareButton;

var ShareRunModal = exports.ShareRunModal = (function (_React$Component) {
    function ShareRunModal() {
        _classCallCheck(this, ShareRunModal);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(ShareRunModal, _React$Component);

    _createClass(ShareRunModal, {
        beginDataImport: {
            value: function beginDataImport() {

                $.post("/api/import_data", {}, (function (result) {

                    console.log(result);
                }).bind(this));
            }
        },
        componentDidMount: {
            value: function componentDidMount() {

                $(React.findDOMNode(this)).modal("show");
            }
        },
        render: {
            value: function render() {
                return React.createElement(
                    "div",
                    { className: "modal fade" },
                    React.createElement(
                        "div",
                        { className: "modal-dialog" },
                        React.createElement(
                            "div",
                            { className: "modal-content" },
                            React.createElement(
                                "div",
                                { className: "modal-header" },
                                React.createElement(
                                    "button",
                                    { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
                                    React.createElement(
                                        "span",
                                        { "aria-hidden": "true" },
                                        "×"
                                    )
                                ),
                                React.createElement(
                                    "h4",
                                    { className: "modal-title" },
                                    "Share Your Run"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "modal-body" },
                                React.createElement("img", { src: this.props.imageUrl, width: "100%" }),
                                React.createElement("br", null),
                                React.createElement(FacebookShareButton, { url: this.props.imageUrl }),
                                React.createElement(TwitterShareButton, { url: this.props.imageUrl })
                            )
                        )
                    )
                );
            }
        }
    });

    return ShareRunModal;
})(React.Component);

},{"components/SocialSharing.jsx":21}],21:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

/*
 * Example
 * <FacebookShareButton url="http://i.imgur.com/3skvA.jpg" />
 */

var FacebookShareButton = exports.FacebookShareButton = (function (_React$Component) {
    function FacebookShareButton(props) {
        _classCallCheck(this, FacebookShareButton);

        _get(Object.getPrototypeOf(FacebookShareButton.prototype), "constructor", this).call(this, props);
    }

    _inherits(FacebookShareButton, _React$Component);

    _createClass(FacebookShareButton, {
        componentDidMount: {
            value: function componentDidMount() {
                (function (d, s, id) {
                    var js,
                        fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    js = d.createElement(s);js.id = id;
                    js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3&appId=639542186146785";
                    fjs.parentNode.insertBefore(js, fjs);
                })(document, "script", "facebook-jssdk");
            }
        },
        render: {
            value: function render() {
                return React.createElement("div", { className: "fb-share-button",
                    "data-href": this.props.url,
                    "data-layout": "button" });
            }
        }
    });

    return FacebookShareButton;
})(React.Component);

/*
 * Example
 * <TwitterShareButton url="http://i.imgur.com/3skvA.jpg" message="Sample body" />
 */

var TwitterShareButton = exports.TwitterShareButton = (function (_React$Component2) {
    function TwitterShareButton(props) {
        _classCallCheck(this, TwitterShareButton);

        _get(Object.getPrototypeOf(TwitterShareButton.prototype), "constructor", this).call(this, props);
    }

    _inherits(TwitterShareButton, _React$Component2);

    _createClass(TwitterShareButton, {
        componentDidMount: {
            value: function componentDidMount() {
                !(function (d, s, id) {
                    var js,
                        fjs = d.getElementsByTagName(s)[0],
                        p = /^http:/.test(d.location) ? "http" : "https";
                    if (!d.getElementById(id)) {
                        js = d.createElement(s);
                        js.id = id;js.src = p + "://platform.twitter.com/widgets.js";
                        fjs.parentNode.insertBefore(js, fjs);
                    }
                })(document, "script", "twitter-wjs");
            }
        },
        render: {
            value: function render() {
                return React.createElement(
                    "a",
                    { href: "https://twitter.com/share",
                        className: "twitter-share-button",
                        "data-url": this.props.url,
                        "data-text": this.props.message,
                        "data-count": "none" },
                    "Tweet"
                );
            }
        }
    });

    return TwitterShareButton;
})(React.Component);

},{}],22:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var UploadDataButton = exports.UploadDataButton = (function () {
    function UploadDataButton() {
        _classCallCheck(this, UploadDataButton);
    }

    _createClass(UploadDataButton, {
        render: {
            value: function render() {
                return React.createElement(
                    "span",
                    null,
                    React.createElement("i", { className: "ion ion-upload" }),
                    " Import Data"
                );
            }
        }
    });

    return UploadDataButton;
})();

},{}],23:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Body = require("components/Body.jsx").Body;

var LineChart = require("components/LineChart.jsx").LineChart;

var BarChart = require("components/BarChart.jsx").BarChart;

var RadarChart = require("components/RadarChart.jsx").RadarChart;

var PieChart = require("components/PieChart.jsx").PieChart;

var MainNavbar = require("components/MainNavbar.jsx").MainNavbar;

var ModalTrigger = require("components/ModalTrigger.jsx").ModalTrigger;

var ImportDataModal = require("components/ImportDataModal.jsx").ImportDataModal;

var _componentsSocialSharingJsx = require("components/SocialSharing.jsx");

var FacebookShareButton = _componentsSocialSharingJsx.FacebookShareButton;
var TwitterShareButton = _componentsSocialSharingJsx.TwitterShareButton;

var UploadDataButton = require("components/UploadDataButton.jsx").UploadDataButton;

var DashboardPage = exports.DashboardPage = (function (_React$Component) {
    function DashboardPage() {
        _classCallCheck(this, DashboardPage);

        this.state = {
            runs: null,
            speedGraph: {
                data: {
                    labels: [],
                    datasets: [{
                        label: "My Second dataset",
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: []
                    }]
                },
                opts: {
                    scaleLabel: function scaleLabel(val) {
                        return val.value + " km/h";
                    }
                }
            },
            distanceGraph: {
                data: {
                    labels: [],
                    datasets: [{
                        label: "My Second dataset",
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: []
                    }]
                },
                opts: {
                    scaleLabel: function scaleLabel(val) {
                        return val.value + " m";
                    }
                }
            }
        };
    }

    _inherits(DashboardPage, _React$Component);

    _createClass(DashboardPage, {
        componentDidMount: {
            value: function componentDidMount() {
                var date = new Date();
                date.setDate(date.getDate() - 7);
                date = date.toISOString().substring(0, 10);
                console.log(date);

                $.get("/api/runs_since_date/" + date, (function (result) {
                    if (result.success != false) {

                        console.log(result);
                        var speedGraph = this.state.speedGraph;
                        var distanceGraph = this.state.distanceGraph;

                        this.setState({
                            runs: result.runs
                        });

                        speedGraph.data.labels = [];
                        speedGraph.data.datasets[0].data = [];
                        distanceGraph.data.labels = [];
                        distanceGraph.data.datasets[0].data = [];

                        var counts = [0, 0, 0, 0, 0, 0, 0];
                        var speeds = [0, 0, 0, 0, 0, 0, 0];
                        var distances = [0, 0, 0, 0, 0, 0, 0];

                        var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

                        for (var i = 0; i < result.runs.length; i++) {
                            var run = result.runs[i];
                            var moment = window.app.moment(run.start_time * 1000);
                            var day = moment.weekday();

                            counts[day]++;
                            speeds[day] += run.average_speed;
                            distances[day] += run.distance;
                        }

                        for (var i = 0; i < 7; i++) {

                            var run = result.runs[i];
                            speedGraph.data.labels.push(weekdays[i]);
                            var speed = 0;
                            if (counts[i] > 0) {
                                speed = speeds[i] / counts[i] * 60 * 60 / 1000;
                            }
                            speed = speed.toFixed(2);
                            speedGraph.data.datasets[0].data.push(speed);

                            distanceGraph.data.labels.push(weekdays[i]);
                            var distance = 0;
                            if (counts[i] > 0) {
                                distance = distances[i];
                            }
                            distance = distance.toFixed(2);
                            distanceGraph.data.datasets[0].data.push(distance);
                        }

                        this.setState({
                            speedGraph: speedGraph,
                            distanceGraph: distanceGraph });
                    }
                }).bind(this));
            }
        },
        render: {
            value: function render() {

                var pieChartData = [{
                    value: 300,
                    color: "#F7464A",
                    highlight: "#FF5A5E",
                    label: "Red"
                }, {
                    value: 50,
                    color: "#46BFBD",
                    highlight: "#5AD3D1",
                    label: "Green"
                }, {
                    value: 100,
                    color: "#FDB45C",
                    highlight: "#FFC870",
                    label: "Yellow"
                }];

                var barChartdata = {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [{
                        label: "My First dataset",
                        fillColor: "rgba(220,220,220,0.5)",
                        strokeColor: "rgba(220,220,220,0.8)",
                        highlightFill: "rgba(220,220,220,0.75)",
                        highlightStroke: "rgba(220,220,220,1)",
                        data: [65, 59, 80, 81, 56, 55, 40]
                    }, {
                        label: "My Second dataset",
                        fillColor: "rgba(151,187,205,0.5)",
                        strokeColor: "rgba(151,187,205,0.8)",
                        highlightFill: "rgba(151,187,205,0.75)",
                        highlightStroke: "rgba(151,187,205,1)",
                        data: [28, 48, 40, 19, 86, 27, 90]
                    }]
                };

                var radarChartData = {
                    labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
                    datasets: [{
                        label: "My First dataset",
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: [65, 59, 90, 81, 56, 55, 40]
                    }, {
                        label: "My Second dataset",
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: [28, 48, 40, 19, 96, 27, 100]
                    }]
                };

                var content = null;

                if (!this.state.runs || this.state.runs.length == 0) {
                    content = React.createElement(
                        "div",
                        { className: "row alert alert-warning", role: "alert" },
                        React.createElement(
                            "div",
                            { className: "col-xs-12" },
                            React.createElement(
                                "p",
                                { className: "center-text" },
                                "You haven't added any run data this week, when you import a new run you'll be able to see information about your fitness here."
                            ),
                            React.createElement(
                                "div",
                                { className: "center-text" },
                                React.createElement(ModalTrigger, { modal: React.createElement(ImportDataModal, null), button: true, className: "btn btn-default navbar-btn margin-left margin-right", buttonText: React.createElement(UploadDataButton, null) })
                            )
                        )
                    );
                }

                return React.createElement(
                    "div",
                    null,
                    React.createElement(MainNavbar, null),
                    React.createElement(
                        "div",
                        { className: "container" },
                        content,
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "div",
                                { className: "col-xs-12" },
                                React.createElement(
                                    "h2",
                                    null,
                                    "Recent Runs"
                                ),
                                React.createElement(
                                    "table",
                                    { className: "table" },
                                    React.createElement(
                                        "thead",
                                        null,
                                        React.createElement(
                                            "tr",
                                            null,
                                            React.createElement(
                                                "th",
                                                null,
                                                "Start Time"
                                            ),
                                            React.createElement(
                                                "th",
                                                null,
                                                "End Time"
                                            ),
                                            React.createElement(
                                                "th",
                                                null,
                                                "Action"
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "tbody",
                                        null,
                                        this.state.runs ? this.state.runs.map(function (run) {
                                            return React.createElement(
                                                "tr",
                                                null,
                                                React.createElement(
                                                    "td",
                                                    null,
                                                    window.app.moment(run.start_time * 1000).format(window.app.timeFormat),
                                                    " ",
                                                    window.app.moment(run.start_time * 1000).format(window.app.dayFormat)
                                                ),
                                                React.createElement(
                                                    "td",
                                                    null,
                                                    window.app.moment(run.end_time * 1000).format(window.app.timeFormat),
                                                    " ",
                                                    window.app.moment(run.end_time * 1000).format(window.app.dayFormat)
                                                ),
                                                React.createElement(
                                                    "td",
                                                    null,
                                                    React.createElement(
                                                        "a",
                                                        { className: "btn btn-default", href: "/run/" + run._id },
                                                        React.createElement("i", { className: "ion ion-eye" })
                                                    )
                                                )
                                            );
                                        }) : ""
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "div",
                                { className: "col-xs-6" },
                                React.createElement(
                                    "h2",
                                    null,
                                    "Average Speed Over The Past Week"
                                ),
                                React.createElement(LineChart, { data: this.state.speedGraph.data, opts: this.state.speedGraph.opts })
                            ),
                            React.createElement(
                                "div",
                                { className: "col-xs-6" },
                                React.createElement(
                                    "h2",
                                    null,
                                    "Distance Covered Over The Past Week"
                                ),
                                React.createElement(LineChart, { data: this.state.distanceGraph.data, opts: this.state.distanceGraph.opts })
                            )
                        )
                    )
                );
            }
        }
    });

    return DashboardPage;
})(React.Component);

},{"components/BarChart.jsx":10,"components/Body.jsx":11,"components/ImportDataModal.jsx":12,"components/LineChart.jsx":13,"components/MainNavbar.jsx":14,"components/ModalTrigger.jsx":16,"components/PieChart.jsx":18,"components/RadarChart.jsx":19,"components/SocialSharing.jsx":21,"components/UploadDataButton.jsx":22}],24:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var MainNavbar = require("components/MainNavbar.jsx").MainNavbar;

var FileNotFoundPage = exports.FileNotFoundPage = (function (_React$Component) {
    function FileNotFoundPage() {
        _classCallCheck(this, FileNotFoundPage);
    }

    _inherits(FileNotFoundPage, _React$Component);

    _createClass(FileNotFoundPage, {
        render: {
            value: function render() {

                return React.createElement(
                    "div",
                    null,
                    React.createElement(MainNavbar, null),
                    React.createElement(
                        "div",
                        { className: "container" },
                        React.createElement(
                            "h1",
                            null,
                            "404"
                        )
                    )
                );
            }
        }
    });

    return FileNotFoundPage;
})(React.Component);

},{"components/MainNavbar.jsx":14}],25:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Body = require("components/Body.jsx").Body;

var ModalTrigger = require("components/ModalTrigger.jsx").ModalTrigger;

var ShareRunModal = require("components/ShareRunModal.jsx").ShareRunModal;

var MainNavbar = require("components/MainNavbar.jsx").MainNavbar;

var Map = require("components/Map.jsx").Map;

var LineChart = require("components/LineChart.jsx").LineChart;

var RunDataPage = exports.RunDataPage = (function (_React$Component) {
    function RunDataPage() {
        _classCallCheck(this, RunDataPage);

        this.state = {
            run: false,
            chartData: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                }]
            },
            chartOpts: {
                scaleShowGridLines: false,
                datasetFill: true,
                scaleShowHorizontalLines: true,
                scaleShowVerticalLines: true,
                showTooltips: true,
                pointHitDetectionRadius: 1,
                scaleLabel: function scaleLabel(value) {
                    return value.value + " km/hr";
                },
                tooltipTemplate: function tooltipTemplate(value) {
                    return value.value.toFixed(1) + " km/hr";
                }
            }
        };
    }

    _inherits(RunDataPage, _React$Component);

    _createClass(RunDataPage, {
        componentDidMount: {
            value: function componentDidMount() {
                $.get("/api/run/" + this.props.runId, (function (result) {

                    if (result.success != false) {
                        var pretty_print_time = function (seconds) {
                            var minutes = Math.floor(seconds / 60) % 60;
                            var hours = Math.floor(seconds / 3600) % 24;

                            var str = "";
                            if (hours > 0) {
                                str += hours + "h ";
                            }
                            str += minutes + "m";
                            return str;
                        };

                        this.setState({
                            run: result });

                        var data = this.state.chartData;
                        var labels = [];
                        var speeds = [];

                        var interval = parseInt(result.speed_graph.x.length / 10);

                        for (var i = 0; i < result.speed_graph.x.length; i++) {
                            var label = "";
                            if (i % interval == 0) {
                                label = pretty_print_time(parseInt(result.speed_graph.x[i]));
                                console.log(label);
                            }
                            labels.push(label);
                            speeds.push(result.speed_graph.y[i] * 60 * 60 / 1000); // to kmph
                        }

                        data.labels = labels;
                        data.datasets[0].data = speeds;

                        this.setState({ chartData: data });
                    }
                }).bind(this));
            }
        },
        shareRun: {
            value: function shareRun(e) {
                var mapUrl = this.refs.map.getStaticUrl();
                var callback = this.imgurUpload.bind(this);

                $.ajax({
                    type: "POST",
                    url: "https://api.imgur.com/3/image",
                    headers: {
                        Authorization: "Client-ID d8f59039bdb9fad"
                    },
                    data: {
                        image: mapUrl
                    },
                    success: callback

                });
            }
        },
        imgurUpload: {
            value: function imgurUpload(data) {
                console.log(data);
                this.setState({ mapUrl: data.data.link, sharingRun: true });
            }
        },
        render: {
            value: function render() {

                var body = React.createElement(
                    "div",
                    { className: "container" },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "p",
                            null,
                            "This run does not exist."
                        )
                    )
                );

                var modal = React.createElement(ShareRunModal, { ref: "modal", imageUrl: this.state.mapUrl });
                if (!this.state.sharingRun) {
                    modal = null;
                }

                if (this.state.run) {
                    body = React.createElement(
                        "div",
                        { className: "container" },
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "h1",
                                { className: "full-width" },
                                "Your Run ",
                                React.createElement(
                                    "small",
                                    null,
                                    window.app.moment(this.state.run.start_time * 1000).format(window.app.dayFormat)
                                ),
                                React.createElement(
                                    "button",
                                    { className: "btn btn-default float-right", onClick: this.shareRun.bind(this) },
                                    "Share Run"
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "row margin-top" },
                            React.createElement(
                                "div",
                                { className: "col-md-3 center-text" },
                                React.createElement(
                                    "h3",
                                    null,
                                    "Total Distance"
                                ),
                                " ",
                                this.state.run.distance.toFixed(2),
                                "m"
                            ),
                            React.createElement(
                                "div",
                                { className: "col-md-3 center-text" },
                                React.createElement(
                                    "h3",
                                    null,
                                    "Average Speed"
                                ),
                                " ",
                                (this.state.run.average_speed * 60 * 60 / 1000).toFixed(2),
                                "kmph"
                            ),
                            React.createElement(
                                "div",
                                { className: "col-md-3 center-text" },
                                React.createElement(
                                    "h3",
                                    null,
                                    "Duration"
                                ),
                                " ",
                                parseInt(this.state.run.duration / 60),
                                " mins ",
                                this.state.run.duration % 60,
                                " seconds"
                            ),
                            React.createElement(
                                "div",
                                { className: "col-md-3 center-text" },
                                React.createElement(
                                    "h3",
                                    null,
                                    "Kilojoules Burned"
                                ),
                                this.state.run.kilojoules.toFixed(2),
                                " kj"
                            )
                        ),
                        React.createElement("hr", null),
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(Map, { ref: "map", waypoints: this.state.run.waypoints }),
                            modal
                        ),
                        React.createElement("hr", null),
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "div",
                                { className: "col-xs-12 center-text" },
                                React.createElement(
                                    "h3",
                                    null,
                                    "Your Speed Breakdown"
                                ),
                                React.createElement(LineChart, { data: this.state.chartData, opts: this.state.chartOpts, width: 1140, height: 240 })
                            )
                        )
                    );
                }

                return React.createElement(
                    "div",
                    null,
                    React.createElement(MainNavbar, null),
                    body
                );
            }
        }
    });

    return RunDataPage;
})(React.Component);

},{"components/Body.jsx":11,"components/LineChart.jsx":13,"components/MainNavbar.jsx":14,"components/Map.jsx":15,"components/ModalTrigger.jsx":16,"components/ShareRunModal.jsx":20}],26:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Body = require("components/Body.jsx").Body;

var LineChart = require("components/LineChart.jsx").LineChart;

var BarChart = require("components/BarChart.jsx").BarChart;

var RadarChart = require("components/RadarChart.jsx").RadarChart;

var PieChart = require("components/PieChart.jsx").PieChart;

var MainNavbar = require("components/MainNavbar.jsx").MainNavbar;

var ModalTrigger = require("components/ModalTrigger.jsx").ModalTrigger;

var ImportDataModal = require("components/ImportDataModal.jsx").ImportDataModal;

var RunHistoryPage = exports.RunHistoryPage = (function (_React$Component) {
    function RunHistoryPage() {
        _classCallCheck(this, RunHistoryPage);

        this.state = {
            runs: null
        };
    }

    _inherits(RunHistoryPage, _React$Component);

    _createClass(RunHistoryPage, {
        componentDidMount: {
            value: function componentDidMount() {
                this.updateRuns();
            }
        },
        updateRuns: {
            value: function updateRuns() {
                $.get("/api/all_runs", (function (result) {
                    if (result.success != false) {
                        this.setState({
                            runs: result
                        });
                    }
                }).bind(this));
            }
        },
        deleteRun: {
            value: function deleteRun(run, e) {
                // this is bound to the run instance

                if (confirm("Are you sure you want to delete this run?")) {
                    console.log(run);

                    $.get("/api/delete_run/" + run._id.$oid, (function (result) {

                        if (result.success != false) {

                            this.updateRuns();
                        } else {
                            console.error("Could not delete run.");
                        }
                    }).bind(this));
                } else {}
            }
        },
        render: {
            value: function render() {

                return React.createElement(
                    "div",
                    null,
                    React.createElement(MainNavbar, null),
                    React.createElement(
                        "div",
                        { className: "container" },
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "div",
                                { className: "col-xs-12" },
                                React.createElement(
                                    "h2",
                                    null,
                                    "Run History"
                                ),
                                React.createElement(
                                    "table",
                                    { className: "table" },
                                    React.createElement(
                                        "thead",
                                        null,
                                        React.createElement(
                                            "tr",
                                            null,
                                            React.createElement(
                                                "th",
                                                null,
                                                "Start Time"
                                            ),
                                            React.createElement(
                                                "th",
                                                null,
                                                "End Time"
                                            ),
                                            React.createElement(
                                                "th",
                                                null,
                                                "Action"
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "tbody",
                                        null,
                                        this.state.runs ? this.state.runs.map((function (run) {
                                            return React.createElement(
                                                "tr",
                                                null,
                                                React.createElement(
                                                    "td",
                                                    null,
                                                    window.app.moment(run.start_time * 1000).format(window.app.timeFormat),
                                                    " ",
                                                    window.app.moment(run.start_time * 1000).format(window.app.dayFormat)
                                                ),
                                                React.createElement(
                                                    "td",
                                                    null,
                                                    window.app.moment(run.end_time * 1000).format(window.app.timeFormat),
                                                    " ",
                                                    window.app.moment(run.end_time * 1000).format(window.app.dayFormat)
                                                ),
                                                React.createElement(
                                                    "td",
                                                    null,
                                                    React.createElement(
                                                        "a",
                                                        { className: "btn btn-default", href: "/run/" + run._id.$oid },
                                                        React.createElement("i", { className: "ion ion-eye" })
                                                    ),
                                                    " ",
                                                    React.createElement(
                                                        "button",
                                                        { className: "btn btn-default", onClick: this.deleteRun.bind(this, run) },
                                                        React.createElement("i", { className: "ion ion-trash-b" })
                                                    )
                                                )
                                            );
                                        }).bind(this)) : ""
                                    )
                                )
                            )
                        )
                    )
                );
            }
        }
    });

    return RunHistoryPage;
})(React.Component);

},{"components/BarChart.jsx":10,"components/Body.jsx":11,"components/ImportDataModal.jsx":12,"components/LineChart.jsx":13,"components/MainNavbar.jsx":14,"components/ModalTrigger.jsx":16,"components/PieChart.jsx":18,"components/RadarChart.jsx":19}],27:[function(require,module,exports){
"use strict";

exports.DashboardController = DashboardController;
Object.defineProperty(exports, "__esModule", {
    value: true
});

var DashboardPage = require("pages/DashboardPage.jsx").DashboardPage;

var transition = require("pages/controllers/PageTransition.jsx").transition;

function DashboardController(ctx, next) {
    transition(ctx, next, React.createElement(DashboardPage, null));
}

},{"pages/DashboardPage.jsx":23,"pages/controllers/PageTransition.jsx":29}],28:[function(require,module,exports){
"use strict";

exports.FileNotFoundController = FileNotFoundController;
Object.defineProperty(exports, "__esModule", {
    value: true
});

var FileNotFoundPage = require("pages/FileNotFoundPage.jsx").FileNotFoundPage;

var transition = require("pages/controllers/PageTransition.jsx").transition;

function FileNotFoundController(ctx, next) {
    transition(ctx, next, React.createElement(FileNotFoundPage, null));
}

},{"pages/FileNotFoundPage.jsx":24,"pages/controllers/PageTransition.jsx":29}],29:[function(require,module,exports){
"use strict";

exports.transition = transition;
Object.defineProperty(exports, "__esModule", {
    value: true
});

function transition(ctx, next, component) {
    if (!ctx.init) {
        window.app.mountPoint.classList.add("transition");
        setTimeout(function () {
            window.app.mountPoint.classList.remove("transition");
        }, 350);
    }

    React.render(component, window.app.mountPoint);
}

},{}],30:[function(require,module,exports){
"use strict";

exports.RunDataController = RunDataController;
Object.defineProperty(exports, "__esModule", {
    value: true
});

var RunDataPage = require("pages/RunDataPage.jsx").RunDataPage;

var transition = require("pages/controllers/PageTransition.jsx").transition;

function RunDataController(ctx, next) {
    transition(ctx, next, React.createElement(RunDataPage, { runId: ctx.params.run }));
}

},{"pages/RunDataPage.jsx":25,"pages/controllers/PageTransition.jsx":29}],31:[function(require,module,exports){
"use strict";

exports.RunHistoryController = RunHistoryController;
Object.defineProperty(exports, "__esModule", {
    value: true
});

var RunHistoryPage = require("pages/RunHistoryPage.jsx").RunHistoryPage;

var transition = require("pages/controllers/PageTransition.jsx").transition;

function RunHistoryController(ctx, next) {
    transition(ctx, next, React.createElement(RunHistoryPage, null));
}

},{"pages/RunHistoryPage.jsx":26,"pages/controllers/PageTransition.jsx":29}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbWtvb3BtYW4vRHJvcGJveC9VUSBDb3Vyc2UgRmlsZXMvMjAxNS9TZW1lc3RlciAxL0NTU0UzMDAyL3NvdXJjZV9yZXBvc2l0b3J5L3dlYmFwcC9zcmMvanN4L2FwcC5qc3giLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2NoYXJ0LmpzL0NoYXJ0LmpzIiwibm9kZV9tb2R1bGVzL21vbWVudC9tb21lbnQuanMiLCJub2RlX21vZHVsZXMvcGFnZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wYWdlL25vZGVfbW9kdWxlcy9wYXRoLXRvLXJlZ2V4cC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wYWdlL25vZGVfbW9kdWxlcy9wYXRoLXRvLXJlZ2V4cC9ub2RlX21vZHVsZXMvaXNhcnJheS9pbmRleC5qcyIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvUm91dGVyLmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9BcHBTZXR0aW5nc01vZGFsLmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9CYXJDaGFydC5qc3giLCIvVXNlcnMvbWtvb3BtYW4vRHJvcGJveC9VUSBDb3Vyc2UgRmlsZXMvMjAxNS9TZW1lc3RlciAxL0NTU0UzMDAyL3NvdXJjZV9yZXBvc2l0b3J5L3dlYmFwcC9zcmMvanN4L2NvbXBvbmVudHMvQm9keS5qc3giLCIvVXNlcnMvbWtvb3BtYW4vRHJvcGJveC9VUSBDb3Vyc2UgRmlsZXMvMjAxNS9TZW1lc3RlciAxL0NTU0UzMDAyL3NvdXJjZV9yZXBvc2l0b3J5L3dlYmFwcC9zcmMvanN4L2NvbXBvbmVudHMvSW1wb3J0RGF0YU1vZGFsLmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9MaW5lQ2hhcnQuanN4IiwiL1VzZXJzL21rb29wbWFuL0Ryb3Bib3gvVVEgQ291cnNlIEZpbGVzLzIwMTUvU2VtZXN0ZXIgMS9DU1NFMzAwMi9zb3VyY2VfcmVwb3NpdG9yeS93ZWJhcHAvc3JjL2pzeC9jb21wb25lbnRzL01haW5OYXZiYXIuanN4IiwiL1VzZXJzL21rb29wbWFuL0Ryb3Bib3gvVVEgQ291cnNlIEZpbGVzLzIwMTUvU2VtZXN0ZXIgMS9DU1NFMzAwMi9zb3VyY2VfcmVwb3NpdG9yeS93ZWJhcHAvc3JjL2pzeC9jb21wb25lbnRzL01hcC5qc3giLCIvVXNlcnMvbWtvb3BtYW4vRHJvcGJveC9VUSBDb3Vyc2UgRmlsZXMvMjAxNS9TZW1lc3RlciAxL0NTU0UzMDAyL3NvdXJjZV9yZXBvc2l0b3J5L3dlYmFwcC9zcmMvanN4L2NvbXBvbmVudHMvTW9kYWxUcmlnZ2VyLmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9OYXZiYXIuanN4IiwiL1VzZXJzL21rb29wbWFuL0Ryb3Bib3gvVVEgQ291cnNlIEZpbGVzLzIwMTUvU2VtZXN0ZXIgMS9DU1NFMzAwMi9zb3VyY2VfcmVwb3NpdG9yeS93ZWJhcHAvc3JjL2pzeC9jb21wb25lbnRzL1BpZUNoYXJ0LmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9SYWRhckNoYXJ0LmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9TaGFyZVJ1bk1vZGFsLmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9Tb2NpYWxTaGFyaW5nLmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9VcGxvYWREYXRhQnV0dG9uLmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvcGFnZXMvRGFzaGJvYXJkUGFnZS5qc3giLCIvVXNlcnMvbWtvb3BtYW4vRHJvcGJveC9VUSBDb3Vyc2UgRmlsZXMvMjAxNS9TZW1lc3RlciAxL0NTU0UzMDAyL3NvdXJjZV9yZXBvc2l0b3J5L3dlYmFwcC9zcmMvanN4L3BhZ2VzL0ZpbGVOb3RGb3VuZFBhZ2UuanN4IiwiL1VzZXJzL21rb29wbWFuL0Ryb3Bib3gvVVEgQ291cnNlIEZpbGVzLzIwMTUvU2VtZXN0ZXIgMS9DU1NFMzAwMi9zb3VyY2VfcmVwb3NpdG9yeS93ZWJhcHAvc3JjL2pzeC9wYWdlcy9SdW5EYXRhUGFnZS5qc3giLCIvVXNlcnMvbWtvb3BtYW4vRHJvcGJveC9VUSBDb3Vyc2UgRmlsZXMvMjAxNS9TZW1lc3RlciAxL0NTU0UzMDAyL3NvdXJjZV9yZXBvc2l0b3J5L3dlYmFwcC9zcmMvanN4L3BhZ2VzL1J1bkhpc3RvcnlQYWdlLmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvcGFnZXMvY29udHJvbGxlcnMvRGFzaGJvYXJkQ29udHJvbGxlci5qc3giLCIvVXNlcnMvbWtvb3BtYW4vRHJvcGJveC9VUSBDb3Vyc2UgRmlsZXMvMjAxNS9TZW1lc3RlciAxL0NTU0UzMDAyL3NvdXJjZV9yZXBvc2l0b3J5L3dlYmFwcC9zcmMvanN4L3BhZ2VzL2NvbnRyb2xsZXJzL0ZpbGVOb3RGb3VuZENvbnRyb2xsZXIuanN4IiwiL1VzZXJzL21rb29wbWFuL0Ryb3Bib3gvVVEgQ291cnNlIEZpbGVzLzIwMTUvU2VtZXN0ZXIgMS9DU1NFMzAwMi9zb3VyY2VfcmVwb3NpdG9yeS93ZWJhcHAvc3JjL2pzeC9wYWdlcy9jb250cm9sbGVycy9QYWdlVHJhbnNpdGlvbi5qc3giLCIvVXNlcnMvbWtvb3BtYW4vRHJvcGJveC9VUSBDb3Vyc2UgRmlsZXMvMjAxNS9TZW1lc3RlciAxL0NTU0UzMDAyL3NvdXJjZV9yZXBvc2l0b3J5L3dlYmFwcC9zcmMvanN4L3BhZ2VzL2NvbnRyb2xsZXJzL1J1bkRhdGFDb250cm9sbGVyLmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvcGFnZXMvY29udHJvbGxlcnMvUnVuSGlzdG9yeUNvbnRyb2xsZXIuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7SUNBUSxNQUFNLFdBQU8sWUFBWSxFQUF6QixNQUFNOztJQUNOLG1CQUFtQixXQUFPLDZDQUE2QyxFQUF2RSxtQkFBbUI7O0lBQ25CLG9CQUFvQixXQUFPLDhDQUE4QyxFQUF6RSxvQkFBb0I7O0lBQ3BCLHNCQUFzQixXQUFPLGdEQUFnRCxFQUE3RSxzQkFBc0I7O0lBQ3RCLGlCQUFpQixXQUFPLDJDQUEyQyxFQUFuRSxpQkFBaUI7O0FBR3pCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFL0IsQ0FBQyxZQUFXO0FBQ1IsVUFBTSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7O0FBRWhCLFVBQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUMzQixVQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQztBQUMzQyxVQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7O0FBRXBDLFVBQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3hDLFFBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDOztBQUUvQixVQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0FBQ2hELFVBQU0sQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFDbkQsVUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUNsRCxVQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0FBQ2hELFVBQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLG1CQUFtQixDQUFDLENBQUM7O0FBRTFDLFVBQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztDQUNsQixDQUFBLEVBQUcsQ0FBQzs7O0FDMUJMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdGlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcm1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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RUFBRTtBQUN6QyxjQUFVLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxvQkFBQyxXQUFXLElBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxBQUFDLEdBQUUsQ0FBQyxDQUFDO0NBQ2hFOzs7OztRQ0ZlLG9CQUFvQixHQUFwQixvQkFBb0I7Ozs7O0lBSDVCLGNBQWMsV0FBTywwQkFBMEIsRUFBL0MsY0FBYzs7SUFDZCxVQUFVLFdBQU8sc0NBQXNDLEVBQXZELFVBQVU7O0FBRVgsU0FBUyxvQkFBb0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQzVDLGNBQVUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLG9CQUFDLGNBQWMsT0FBRyxDQUFDLENBQUM7Q0FDN0MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJ1JvdXRlci5qc3gnO1xuaW1wb3J0IHtEYXNoYm9hcmRDb250cm9sbGVyfSBmcm9tICcuL3BhZ2VzL2NvbnRyb2xsZXJzL0Rhc2hib2FyZENvbnRyb2xsZXIuanN4JztcbmltcG9ydCB7UnVuSGlzdG9yeUNvbnRyb2xsZXJ9IGZyb20gJy4vcGFnZXMvY29udHJvbGxlcnMvUnVuSGlzdG9yeUNvbnRyb2xsZXIuanN4JztcbmltcG9ydCB7RmlsZU5vdEZvdW5kQ29udHJvbGxlcn0gZnJvbSAnLi9wYWdlcy9jb250cm9sbGVycy9GaWxlTm90Rm91bmRDb250cm9sbGVyLmpzeCc7XG5pbXBvcnQge1J1bkRhdGFDb250cm9sbGVyfSBmcm9tICcuL3BhZ2VzL2NvbnRyb2xsZXJzL1J1bkRhdGFDb250cm9sbGVyLmpzeCc7XG5cblxudmFyIG1vbWVudCA9IHJlcXVpcmUoXCJtb21lbnRcIik7XG5cbihmdW5jdGlvbigpIHtcbiAgICB3aW5kb3cuYXBwID0ge307XG5cbiAgICB3aW5kb3cuYXBwLm1vbWVudCA9IG1vbWVudDtcbiAgICB3aW5kb3cuYXBwLmRheUZvcm1hdCA9IFwiZGRkZCwgTU1NIERvIFlZWVlcIjtcbiAgICB3aW5kb3cuYXBwLnRpbWVGb3JtYXQgPSBcImg6bW06c3MgYVwiO1xuXG4gICAgd2luZG93LmFwcC5yb3V0ZXIgPSBuZXcgUm91dGVyKCdtb3VudCcpO1xuICAgIHZhciByb3V0ZXIgPSB3aW5kb3cuYXBwLnJvdXRlcjtcblxuICAgIHJvdXRlci5hZGRSb3V0ZSgnLzQwNCcsIEZpbGVOb3RGb3VuZENvbnRyb2xsZXIpO1xuICAgIHJvdXRlci5hZGRSb3V0ZSgnL2Rhc2hib2FyZCcsIERhc2hib2FyZENvbnRyb2xsZXIpO1xuICAgIHJvdXRlci5hZGRSb3V0ZSgnL2hpc3RvcnknLCBSdW5IaXN0b3J5Q29udHJvbGxlcik7XG4gICAgcm91dGVyLmFkZFJvdXRlKCcvcnVuLzpydW4nLCBSdW5EYXRhQ29udHJvbGxlcik7XG4gICAgcm91dGVyLmFkZFJvdXRlKCcvJywgRGFzaGJvYXJkQ29udHJvbGxlcik7XG5cbiAgICByb3V0ZXIuc3RhcnQoKTtcbn0pKCk7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IHRydWU7XG4gICAgdmFyIGN1cnJlbnRRdWV1ZTtcbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXVlW2ldKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xufVxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICBxdWV1ZS5wdXNoKGZ1bik7XG4gICAgaWYgKCFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyohXG4gKiBDaGFydC5qc1xuICogaHR0cDovL2NoYXJ0anMub3JnL1xuICogVmVyc2lvbjogMS4wLjJcbiAqXG4gKiBDb3B5cmlnaHQgMjAxNSBOaWNrIERvd25pZVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbm5uaWNrL0NoYXJ0LmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiAqL1xuXG5cbihmdW5jdGlvbigpe1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdC8vRGVjbGFyZSByb290IHZhcmlhYmxlIC0gd2luZG93IGluIHRoZSBicm93c2VyLCBnbG9iYWwgb24gdGhlIHNlcnZlclxuXHR2YXIgcm9vdCA9IHRoaXMsXG5cdFx0cHJldmlvdXMgPSByb290LkNoYXJ0O1xuXG5cdC8vT2NjdXB5IHRoZSBnbG9iYWwgdmFyaWFibGUgb2YgQ2hhcnQsIGFuZCBjcmVhdGUgYSBzaW1wbGUgYmFzZSBjbGFzc1xuXHR2YXIgQ2hhcnQgPSBmdW5jdGlvbihjb250ZXh0KXtcblx0XHR2YXIgY2hhcnQgPSB0aGlzO1xuXHRcdHRoaXMuY2FudmFzID0gY29udGV4dC5jYW52YXM7XG5cblx0XHR0aGlzLmN0eCA9IGNvbnRleHQ7XG5cblx0XHQvL1ZhcmlhYmxlcyBnbG9iYWwgdG8gdGhlIGNoYXJ0XG5cdFx0dmFyIGNvbXB1dGVEaW1lbnNpb24gPSBmdW5jdGlvbihlbGVtZW50LGRpbWVuc2lvbilcblx0XHR7XG5cdFx0XHRpZiAoZWxlbWVudFsnb2Zmc2V0JytkaW1lbnNpb25dKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gZWxlbWVudFsnb2Zmc2V0JytkaW1lbnNpb25dO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKGRpbWVuc2lvbik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIHdpZHRoID0gdGhpcy53aWR0aCA9IGNvbXB1dGVEaW1lbnNpb24oY29udGV4dC5jYW52YXMsJ1dpZHRoJyk7XG5cdFx0dmFyIGhlaWdodCA9IHRoaXMuaGVpZ2h0ID0gY29tcHV0ZURpbWVuc2lvbihjb250ZXh0LmNhbnZhcywnSGVpZ2h0Jyk7XG5cblx0XHQvLyBGaXJlZm94IHJlcXVpcmVzIHRoaXMgdG8gd29yayBjb3JyZWN0bHlcblx0XHRjb250ZXh0LmNhbnZhcy53aWR0aCAgPSB3aWR0aDtcblx0XHRjb250ZXh0LmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cblx0XHR2YXIgd2lkdGggPSB0aGlzLndpZHRoID0gY29udGV4dC5jYW52YXMud2lkdGg7XG5cdFx0dmFyIGhlaWdodCA9IHRoaXMuaGVpZ2h0ID0gY29udGV4dC5jYW52YXMuaGVpZ2h0O1xuXHRcdHRoaXMuYXNwZWN0UmF0aW8gPSB0aGlzLndpZHRoIC8gdGhpcy5oZWlnaHQ7XG5cdFx0Ly9IaWdoIHBpeGVsIGRlbnNpdHkgZGlzcGxheXMgLSBtdWx0aXBseSB0aGUgc2l6ZSBvZiB0aGUgY2FudmFzIGhlaWdodC93aWR0aCBieSB0aGUgZGV2aWNlIHBpeGVsIHJhdGlvLCB0aGVuIHNjYWxlLlxuXHRcdGhlbHBlcnMucmV0aW5hU2NhbGUodGhpcyk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblx0Ly9HbG9iYWxseSBleHBvc2UgdGhlIGRlZmF1bHRzIHRvIGFsbG93IGZvciB1c2VyIHVwZGF0aW5nL2NoYW5naW5nXG5cdENoYXJ0LmRlZmF1bHRzID0ge1xuXHRcdGdsb2JhbDoge1xuXHRcdFx0Ly8gQm9vbGVhbiAtIFdoZXRoZXIgdG8gYW5pbWF0ZSB0aGUgY2hhcnRcblx0XHRcdGFuaW1hdGlvbjogdHJ1ZSxcblxuXHRcdFx0Ly8gTnVtYmVyIC0gTnVtYmVyIG9mIGFuaW1hdGlvbiBzdGVwc1xuXHRcdFx0YW5pbWF0aW9uU3RlcHM6IDYwLFxuXG5cdFx0XHQvLyBTdHJpbmcgLSBBbmltYXRpb24gZWFzaW5nIGVmZmVjdFxuXHRcdFx0YW5pbWF0aW9uRWFzaW5nOiBcImVhc2VPdXRRdWFydFwiLFxuXG5cdFx0XHQvLyBCb29sZWFuIC0gSWYgd2Ugc2hvdWxkIHNob3cgdGhlIHNjYWxlIGF0IGFsbFxuXHRcdFx0c2hvd1NjYWxlOiB0cnVlLFxuXG5cdFx0XHQvLyBCb29sZWFuIC0gSWYgd2Ugd2FudCB0byBvdmVycmlkZSB3aXRoIGEgaGFyZCBjb2RlZCBzY2FsZVxuXHRcdFx0c2NhbGVPdmVycmlkZTogZmFsc2UsXG5cblx0XHRcdC8vICoqIFJlcXVpcmVkIGlmIHNjYWxlT3ZlcnJpZGUgaXMgdHJ1ZSAqKlxuXHRcdFx0Ly8gTnVtYmVyIC0gVGhlIG51bWJlciBvZiBzdGVwcyBpbiBhIGhhcmQgY29kZWQgc2NhbGVcblx0XHRcdHNjYWxlU3RlcHM6IG51bGwsXG5cdFx0XHQvLyBOdW1iZXIgLSBUaGUgdmFsdWUganVtcCBpbiB0aGUgaGFyZCBjb2RlZCBzY2FsZVxuXHRcdFx0c2NhbGVTdGVwV2lkdGg6IG51bGwsXG5cdFx0XHQvLyBOdW1iZXIgLSBUaGUgc2NhbGUgc3RhcnRpbmcgdmFsdWVcblx0XHRcdHNjYWxlU3RhcnRWYWx1ZTogbnVsbCxcblxuXHRcdFx0Ly8gU3RyaW5nIC0gQ29sb3VyIG9mIHRoZSBzY2FsZSBsaW5lXG5cdFx0XHRzY2FsZUxpbmVDb2xvcjogXCJyZ2JhKDAsMCwwLC4xKVwiLFxuXG5cdFx0XHQvLyBOdW1iZXIgLSBQaXhlbCB3aWR0aCBvZiB0aGUgc2NhbGUgbGluZVxuXHRcdFx0c2NhbGVMaW5lV2lkdGg6IDEsXG5cblx0XHRcdC8vIEJvb2xlYW4gLSBXaGV0aGVyIHRvIHNob3cgbGFiZWxzIG9uIHRoZSBzY2FsZVxuXHRcdFx0c2NhbGVTaG93TGFiZWxzOiB0cnVlLFxuXG5cdFx0XHQvLyBJbnRlcnBvbGF0ZWQgSlMgc3RyaW5nIC0gY2FuIGFjY2VzcyB2YWx1ZVxuXHRcdFx0c2NhbGVMYWJlbDogXCI8JT12YWx1ZSU+XCIsXG5cblx0XHRcdC8vIEJvb2xlYW4gLSBXaGV0aGVyIHRoZSBzY2FsZSBzaG91bGQgc3RpY2sgdG8gaW50ZWdlcnMsIGFuZCBub3Qgc2hvdyBhbnkgZmxvYXRzIGV2ZW4gaWYgZHJhd2luZyBzcGFjZSBpcyB0aGVyZVxuXHRcdFx0c2NhbGVJbnRlZ2Vyc09ubHk6IHRydWUsXG5cblx0XHRcdC8vIEJvb2xlYW4gLSBXaGV0aGVyIHRoZSBzY2FsZSBzaG91bGQgc3RhcnQgYXQgemVybywgb3IgYW4gb3JkZXIgb2YgbWFnbml0dWRlIGRvd24gZnJvbSB0aGUgbG93ZXN0IHZhbHVlXG5cdFx0XHRzY2FsZUJlZ2luQXRaZXJvOiBmYWxzZSxcblxuXHRcdFx0Ly8gU3RyaW5nIC0gU2NhbGUgbGFiZWwgZm9udCBkZWNsYXJhdGlvbiBmb3IgdGhlIHNjYWxlIGxhYmVsXG5cdFx0XHRzY2FsZUZvbnRGYW1pbHk6IFwiJ0hlbHZldGljYSBOZXVlJywgJ0hlbHZldGljYScsICdBcmlhbCcsIHNhbnMtc2VyaWZcIixcblxuXHRcdFx0Ly8gTnVtYmVyIC0gU2NhbGUgbGFiZWwgZm9udCBzaXplIGluIHBpeGVsc1xuXHRcdFx0c2NhbGVGb250U2l6ZTogMTIsXG5cblx0XHRcdC8vIFN0cmluZyAtIFNjYWxlIGxhYmVsIGZvbnQgd2VpZ2h0IHN0eWxlXG5cdFx0XHRzY2FsZUZvbnRTdHlsZTogXCJub3JtYWxcIixcblxuXHRcdFx0Ly8gU3RyaW5nIC0gU2NhbGUgbGFiZWwgZm9udCBjb2xvdXJcblx0XHRcdHNjYWxlRm9udENvbG9yOiBcIiM2NjZcIixcblxuXHRcdFx0Ly8gQm9vbGVhbiAtIHdoZXRoZXIgb3Igbm90IHRoZSBjaGFydCBzaG91bGQgYmUgcmVzcG9uc2l2ZSBhbmQgcmVzaXplIHdoZW4gdGhlIGJyb3dzZXIgZG9lcy5cblx0XHRcdHJlc3BvbnNpdmU6IGZhbHNlLFxuXG5cdFx0XHQvLyBCb29sZWFuIC0gd2hldGhlciB0byBtYWludGFpbiB0aGUgc3RhcnRpbmcgYXNwZWN0IHJhdGlvIG9yIG5vdCB3aGVuIHJlc3BvbnNpdmUsIGlmIHNldCB0byBmYWxzZSwgd2lsbCB0YWtlIHVwIGVudGlyZSBjb250YWluZXJcblx0XHRcdG1haW50YWluQXNwZWN0UmF0aW86IHRydWUsXG5cblx0XHRcdC8vIEJvb2xlYW4gLSBEZXRlcm1pbmVzIHdoZXRoZXIgdG8gZHJhdyB0b29sdGlwcyBvbiB0aGUgY2FudmFzIG9yIG5vdCAtIGF0dGFjaGVzIGV2ZW50cyB0byB0b3VjaG1vdmUgJiBtb3VzZW1vdmVcblx0XHRcdHNob3dUb29sdGlwczogdHJ1ZSxcblxuXHRcdFx0Ly8gQm9vbGVhbiAtIERldGVybWluZXMgd2hldGhlciB0byBkcmF3IGJ1aWx0LWluIHRvb2x0aXAgb3IgY2FsbCBjdXN0b20gdG9vbHRpcCBmdW5jdGlvblxuXHRcdFx0Y3VzdG9tVG9vbHRpcHM6IGZhbHNlLFxuXG5cdFx0XHQvLyBBcnJheSAtIEFycmF5IG9mIHN0cmluZyBuYW1lcyB0byBhdHRhY2ggdG9vbHRpcCBldmVudHNcblx0XHRcdHRvb2x0aXBFdmVudHM6IFtcIm1vdXNlbW92ZVwiLCBcInRvdWNoc3RhcnRcIiwgXCJ0b3VjaG1vdmVcIiwgXCJtb3VzZW91dFwiXSxcblxuXHRcdFx0Ly8gU3RyaW5nIC0gVG9vbHRpcCBiYWNrZ3JvdW5kIGNvbG91clxuXHRcdFx0dG9vbHRpcEZpbGxDb2xvcjogXCJyZ2JhKDAsMCwwLDAuOClcIixcblxuXHRcdFx0Ly8gU3RyaW5nIC0gVG9vbHRpcCBsYWJlbCBmb250IGRlY2xhcmF0aW9uIGZvciB0aGUgc2NhbGUgbGFiZWxcblx0XHRcdHRvb2x0aXBGb250RmFtaWx5OiBcIidIZWx2ZXRpY2EgTmV1ZScsICdIZWx2ZXRpY2EnLCAnQXJpYWwnLCBzYW5zLXNlcmlmXCIsXG5cblx0XHRcdC8vIE51bWJlciAtIFRvb2x0aXAgbGFiZWwgZm9udCBzaXplIGluIHBpeGVsc1xuXHRcdFx0dG9vbHRpcEZvbnRTaXplOiAxNCxcblxuXHRcdFx0Ly8gU3RyaW5nIC0gVG9vbHRpcCBmb250IHdlaWdodCBzdHlsZVxuXHRcdFx0dG9vbHRpcEZvbnRTdHlsZTogXCJub3JtYWxcIixcblxuXHRcdFx0Ly8gU3RyaW5nIC0gVG9vbHRpcCBsYWJlbCBmb250IGNvbG91clxuXHRcdFx0dG9vbHRpcEZvbnRDb2xvcjogXCIjZmZmXCIsXG5cblx0XHRcdC8vIFN0cmluZyAtIFRvb2x0aXAgdGl0bGUgZm9udCBkZWNsYXJhdGlvbiBmb3IgdGhlIHNjYWxlIGxhYmVsXG5cdFx0XHR0b29sdGlwVGl0bGVGb250RmFtaWx5OiBcIidIZWx2ZXRpY2EgTmV1ZScsICdIZWx2ZXRpY2EnLCAnQXJpYWwnLCBzYW5zLXNlcmlmXCIsXG5cblx0XHRcdC8vIE51bWJlciAtIFRvb2x0aXAgdGl0bGUgZm9udCBzaXplIGluIHBpeGVsc1xuXHRcdFx0dG9vbHRpcFRpdGxlRm9udFNpemU6IDE0LFxuXG5cdFx0XHQvLyBTdHJpbmcgLSBUb29sdGlwIHRpdGxlIGZvbnQgd2VpZ2h0IHN0eWxlXG5cdFx0XHR0b29sdGlwVGl0bGVGb250U3R5bGU6IFwiYm9sZFwiLFxuXG5cdFx0XHQvLyBTdHJpbmcgLSBUb29sdGlwIHRpdGxlIGZvbnQgY29sb3VyXG5cdFx0XHR0b29sdGlwVGl0bGVGb250Q29sb3I6IFwiI2ZmZlwiLFxuXG5cdFx0XHQvLyBOdW1iZXIgLSBwaXhlbCB3aWR0aCBvZiBwYWRkaW5nIGFyb3VuZCB0b29sdGlwIHRleHRcblx0XHRcdHRvb2x0aXBZUGFkZGluZzogNixcblxuXHRcdFx0Ly8gTnVtYmVyIC0gcGl4ZWwgd2lkdGggb2YgcGFkZGluZyBhcm91bmQgdG9vbHRpcCB0ZXh0XG5cdFx0XHR0b29sdGlwWFBhZGRpbmc6IDYsXG5cblx0XHRcdC8vIE51bWJlciAtIFNpemUgb2YgdGhlIGNhcmV0IG9uIHRoZSB0b29sdGlwXG5cdFx0XHR0b29sdGlwQ2FyZXRTaXplOiA4LFxuXG5cdFx0XHQvLyBOdW1iZXIgLSBQaXhlbCByYWRpdXMgb2YgdGhlIHRvb2x0aXAgYm9yZGVyXG5cdFx0XHR0b29sdGlwQ29ybmVyUmFkaXVzOiA2LFxuXG5cdFx0XHQvLyBOdW1iZXIgLSBQaXhlbCBvZmZzZXQgZnJvbSBwb2ludCB4IHRvIHRvb2x0aXAgZWRnZVxuXHRcdFx0dG9vbHRpcFhPZmZzZXQ6IDEwLFxuXG5cdFx0XHQvLyBTdHJpbmcgLSBUZW1wbGF0ZSBzdHJpbmcgZm9yIHNpbmdsZSB0b29sdGlwc1xuXHRcdFx0dG9vbHRpcFRlbXBsYXRlOiBcIjwlaWYgKGxhYmVsKXslPjwlPWxhYmVsJT46IDwlfSU+PCU9IHZhbHVlICU+XCIsXG5cblx0XHRcdC8vIFN0cmluZyAtIFRlbXBsYXRlIHN0cmluZyBmb3Igc2luZ2xlIHRvb2x0aXBzXG5cdFx0XHRtdWx0aVRvb2x0aXBUZW1wbGF0ZTogXCI8JT0gdmFsdWUgJT5cIixcblxuXHRcdFx0Ly8gU3RyaW5nIC0gQ29sb3VyIGJlaGluZCB0aGUgbGVnZW5kIGNvbG91ciBibG9ja1xuXHRcdFx0bXVsdGlUb29sdGlwS2V5QmFja2dyb3VuZDogJyNmZmYnLFxuXG5cdFx0XHQvLyBGdW5jdGlvbiAtIFdpbGwgZmlyZSBvbiBhbmltYXRpb24gcHJvZ3Jlc3Npb24uXG5cdFx0XHRvbkFuaW1hdGlvblByb2dyZXNzOiBmdW5jdGlvbigpe30sXG5cblx0XHRcdC8vIEZ1bmN0aW9uIC0gV2lsbCBmaXJlIG9uIGFuaW1hdGlvbiBjb21wbGV0aW9uLlxuXHRcdFx0b25BbmltYXRpb25Db21wbGV0ZTogZnVuY3Rpb24oKXt9XG5cblx0XHR9XG5cdH07XG5cblx0Ly9DcmVhdGUgYSBkaWN0aW9uYXJ5IG9mIGNoYXJ0IHR5cGVzLCB0byBhbGxvdyBmb3IgZXh0ZW5zaW9uIG9mIGV4aXN0aW5nIHR5cGVzXG5cdENoYXJ0LnR5cGVzID0ge307XG5cblx0Ly9HbG9iYWwgQ2hhcnQgaGVscGVycyBvYmplY3QgZm9yIHV0aWxpdHkgbWV0aG9kcyBhbmQgY2xhc3Nlc1xuXHR2YXIgaGVscGVycyA9IENoYXJ0LmhlbHBlcnMgPSB7fTtcblxuXHRcdC8vLS0gQmFzaWMganMgdXRpbGl0eSBtZXRob2RzXG5cdHZhciBlYWNoID0gaGVscGVycy5lYWNoID0gZnVuY3Rpb24obG9vcGFibGUsY2FsbGJhY2ssc2VsZil7XG5cdFx0XHR2YXIgYWRkaXRpb25hbEFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xuXHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIG51bGwgb3IgdW5kZWZpbmVkIGZpcnN0bHkuXG5cdFx0XHRpZiAobG9vcGFibGUpe1xuXHRcdFx0XHRpZiAobG9vcGFibGUubGVuZ3RoID09PSArbG9vcGFibGUubGVuZ3RoKXtcblx0XHRcdFx0XHR2YXIgaTtcblx0XHRcdFx0XHRmb3IgKGk9MDsgaTxsb29wYWJsZS5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0XHRjYWxsYmFjay5hcHBseShzZWxmLFtsb29wYWJsZVtpXSwgaV0uY29uY2F0KGFkZGl0aW9uYWxBcmdzKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaXRlbSBpbiBsb29wYWJsZSl7XG5cdFx0XHRcdFx0XHRjYWxsYmFjay5hcHBseShzZWxmLFtsb29wYWJsZVtpdGVtXSxpdGVtXS5jb25jYXQoYWRkaXRpb25hbEFyZ3MpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdGNsb25lID0gaGVscGVycy5jbG9uZSA9IGZ1bmN0aW9uKG9iail7XG5cdFx0XHR2YXIgb2JqQ2xvbmUgPSB7fTtcblx0XHRcdGVhY2gob2JqLGZ1bmN0aW9uKHZhbHVlLGtleSl7XG5cdFx0XHRcdGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkgb2JqQ2xvbmVba2V5XSA9IHZhbHVlO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gb2JqQ2xvbmU7XG5cdFx0fSxcblx0XHRleHRlbmQgPSBoZWxwZXJzLmV4dGVuZCA9IGZ1bmN0aW9uKGJhc2Upe1xuXHRcdFx0ZWFjaChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMSksIGZ1bmN0aW9uKGV4dGVuc2lvbk9iamVjdCkge1xuXHRcdFx0XHRlYWNoKGV4dGVuc2lvbk9iamVjdCxmdW5jdGlvbih2YWx1ZSxrZXkpe1xuXHRcdFx0XHRcdGlmIChleHRlbnNpb25PYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSkgYmFzZVtrZXldID0gdmFsdWU7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gYmFzZTtcblx0XHR9LFxuXHRcdG1lcmdlID0gaGVscGVycy5tZXJnZSA9IGZ1bmN0aW9uKGJhc2UsbWFzdGVyKXtcblx0XHRcdC8vTWVyZ2UgcHJvcGVydGllcyBpbiBsZWZ0IG9iamVjdCBvdmVyIHRvIGEgc2hhbGxvdyBjbG9uZSBvZiBvYmplY3QgcmlnaHQuXG5cdFx0XHR2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywwKTtcblx0XHRcdGFyZ3MudW5zaGlmdCh7fSk7XG5cdFx0XHRyZXR1cm4gZXh0ZW5kLmFwcGx5KG51bGwsIGFyZ3MpO1xuXHRcdH0sXG5cdFx0aW5kZXhPZiA9IGhlbHBlcnMuaW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5VG9TZWFyY2gsIGl0ZW0pe1xuXHRcdFx0aWYgKEFycmF5LnByb3RvdHlwZS5pbmRleE9mKSB7XG5cdFx0XHRcdHJldHVybiBhcnJheVRvU2VhcmNoLmluZGV4T2YoaXRlbSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5VG9TZWFyY2gubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRpZiAoYXJyYXlUb1NlYXJjaFtpXSA9PT0gaXRlbSkgcmV0dXJuIGk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0d2hlcmUgPSBoZWxwZXJzLndoZXJlID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgZmlsdGVyQ2FsbGJhY2spe1xuXHRcdFx0dmFyIGZpbHRlcmVkID0gW107XG5cblx0XHRcdGhlbHBlcnMuZWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0aWYgKGZpbHRlckNhbGxiYWNrKGl0ZW0pKXtcblx0XHRcdFx0XHRmaWx0ZXJlZC5wdXNoKGl0ZW0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIGZpbHRlcmVkO1xuXHRcdH0sXG5cdFx0ZmluZE5leHRXaGVyZSA9IGhlbHBlcnMuZmluZE5leHRXaGVyZSA9IGZ1bmN0aW9uKGFycmF5VG9TZWFyY2gsIGZpbHRlckNhbGxiYWNrLCBzdGFydEluZGV4KXtcblx0XHRcdC8vIERlZmF1bHQgdG8gc3RhcnQgb2YgdGhlIGFycmF5XG5cdFx0XHRpZiAoIXN0YXJ0SW5kZXgpe1xuXHRcdFx0XHRzdGFydEluZGV4ID0gLTE7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKHZhciBpID0gc3RhcnRJbmRleCArIDE7IGkgPCBhcnJheVRvU2VhcmNoLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhciBjdXJyZW50SXRlbSA9IGFycmF5VG9TZWFyY2hbaV07XG5cdFx0XHRcdGlmIChmaWx0ZXJDYWxsYmFjayhjdXJyZW50SXRlbSkpe1xuXHRcdFx0XHRcdHJldHVybiBjdXJyZW50SXRlbTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZmluZFByZXZpb3VzV2hlcmUgPSBoZWxwZXJzLmZpbmRQcmV2aW91c1doZXJlID0gZnVuY3Rpb24oYXJyYXlUb1NlYXJjaCwgZmlsdGVyQ2FsbGJhY2ssIHN0YXJ0SW5kZXgpe1xuXHRcdFx0Ly8gRGVmYXVsdCB0byBlbmQgb2YgdGhlIGFycmF5XG5cdFx0XHRpZiAoIXN0YXJ0SW5kZXgpe1xuXHRcdFx0XHRzdGFydEluZGV4ID0gYXJyYXlUb1NlYXJjaC5sZW5ndGg7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKHZhciBpID0gc3RhcnRJbmRleCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdHZhciBjdXJyZW50SXRlbSA9IGFycmF5VG9TZWFyY2hbaV07XG5cdFx0XHRcdGlmIChmaWx0ZXJDYWxsYmFjayhjdXJyZW50SXRlbSkpe1xuXHRcdFx0XHRcdHJldHVybiBjdXJyZW50SXRlbTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aW5oZXJpdHMgPSBoZWxwZXJzLmluaGVyaXRzID0gZnVuY3Rpb24oZXh0ZW5zaW9ucyl7XG5cdFx0XHQvL0Jhc2ljIGphdmFzY3JpcHQgaW5oZXJpdGFuY2UgYmFzZWQgb24gdGhlIG1vZGVsIGNyZWF0ZWQgaW4gQmFja2JvbmUuanNcblx0XHRcdHZhciBwYXJlbnQgPSB0aGlzO1xuXHRcdFx0dmFyIENoYXJ0RWxlbWVudCA9IChleHRlbnNpb25zICYmIGV4dGVuc2lvbnMuaGFzT3duUHJvcGVydHkoXCJjb25zdHJ1Y3RvclwiKSkgPyBleHRlbnNpb25zLmNvbnN0cnVjdG9yIDogZnVuY3Rpb24oKXsgcmV0dXJuIHBhcmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuXG5cdFx0XHR2YXIgU3Vycm9nYXRlID0gZnVuY3Rpb24oKXsgdGhpcy5jb25zdHJ1Y3RvciA9IENoYXJ0RWxlbWVudDt9O1xuXHRcdFx0U3Vycm9nYXRlLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7XG5cdFx0XHRDaGFydEVsZW1lbnQucHJvdG90eXBlID0gbmV3IFN1cnJvZ2F0ZSgpO1xuXG5cdFx0XHRDaGFydEVsZW1lbnQuZXh0ZW5kID0gaW5oZXJpdHM7XG5cblx0XHRcdGlmIChleHRlbnNpb25zKSBleHRlbmQoQ2hhcnRFbGVtZW50LnByb3RvdHlwZSwgZXh0ZW5zaW9ucyk7XG5cblx0XHRcdENoYXJ0RWxlbWVudC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlO1xuXG5cdFx0XHRyZXR1cm4gQ2hhcnRFbGVtZW50O1xuXHRcdH0sXG5cdFx0bm9vcCA9IGhlbHBlcnMubm9vcCA9IGZ1bmN0aW9uKCl7fSxcblx0XHR1aWQgPSBoZWxwZXJzLnVpZCA9IChmdW5jdGlvbigpe1xuXHRcdFx0dmFyIGlkPTA7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuIFwiY2hhcnQtXCIgKyBpZCsrO1xuXHRcdFx0fTtcblx0XHR9KSgpLFxuXHRcdHdhcm4gPSBoZWxwZXJzLndhcm4gPSBmdW5jdGlvbihzdHIpe1xuXHRcdFx0Ly9NZXRob2QgZm9yIHdhcm5pbmcgb2YgZXJyb3JzXG5cdFx0XHRpZiAod2luZG93LmNvbnNvbGUgJiYgdHlwZW9mIHdpbmRvdy5jb25zb2xlLndhcm4gPT0gXCJmdW5jdGlvblwiKSBjb25zb2xlLndhcm4oc3RyKTtcblx0XHR9LFxuXHRcdGFtZCA9IGhlbHBlcnMuYW1kID0gKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSxcblx0XHQvLy0tIE1hdGggbWV0aG9kc1xuXHRcdGlzTnVtYmVyID0gaGVscGVycy5pc051bWJlciA9IGZ1bmN0aW9uKG4pe1xuXHRcdFx0cmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcblx0XHR9LFxuXHRcdG1heCA9IGhlbHBlcnMubWF4ID0gZnVuY3Rpb24oYXJyYXkpe1xuXHRcdFx0cmV0dXJuIE1hdGgubWF4LmFwcGx5KCBNYXRoLCBhcnJheSApO1xuXHRcdH0sXG5cdFx0bWluID0gaGVscGVycy5taW4gPSBmdW5jdGlvbihhcnJheSl7XG5cdFx0XHRyZXR1cm4gTWF0aC5taW4uYXBwbHkoIE1hdGgsIGFycmF5ICk7XG5cdFx0fSxcblx0XHRjYXAgPSBoZWxwZXJzLmNhcCA9IGZ1bmN0aW9uKHZhbHVlVG9DYXAsbWF4VmFsdWUsbWluVmFsdWUpe1xuXHRcdFx0aWYoaXNOdW1iZXIobWF4VmFsdWUpKSB7XG5cdFx0XHRcdGlmKCB2YWx1ZVRvQ2FwID4gbWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG1heFZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKGlzTnVtYmVyKG1pblZhbHVlKSl7XG5cdFx0XHRcdGlmICggdmFsdWVUb0NhcCA8IG1pblZhbHVlICl7XG5cdFx0XHRcdFx0cmV0dXJuIG1pblZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdmFsdWVUb0NhcDtcblx0XHR9LFxuXHRcdGdldERlY2ltYWxQbGFjZXMgPSBoZWxwZXJzLmdldERlY2ltYWxQbGFjZXMgPSBmdW5jdGlvbihudW0pe1xuXHRcdFx0aWYgKG51bSUxIT09MCAmJiBpc051bWJlcihudW0pKXtcblx0XHRcdFx0cmV0dXJuIG51bS50b1N0cmluZygpLnNwbGl0KFwiLlwiKVsxXS5sZW5ndGg7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR0b1JhZGlhbnMgPSBoZWxwZXJzLnJhZGlhbnMgPSBmdW5jdGlvbihkZWdyZWVzKXtcblx0XHRcdHJldHVybiBkZWdyZWVzICogKE1hdGguUEkvMTgwKTtcblx0XHR9LFxuXHRcdC8vIEdldHMgdGhlIGFuZ2xlIGZyb20gdmVydGljYWwgdXByaWdodCB0byB0aGUgcG9pbnQgYWJvdXQgYSBjZW50cmUuXG5cdFx0Z2V0QW5nbGVGcm9tUG9pbnQgPSBoZWxwZXJzLmdldEFuZ2xlRnJvbVBvaW50ID0gZnVuY3Rpb24oY2VudHJlUG9pbnQsIGFuZ2xlUG9pbnQpe1xuXHRcdFx0dmFyIGRpc3RhbmNlRnJvbVhDZW50ZXIgPSBhbmdsZVBvaW50LnggLSBjZW50cmVQb2ludC54LFxuXHRcdFx0XHRkaXN0YW5jZUZyb21ZQ2VudGVyID0gYW5nbGVQb2ludC55IC0gY2VudHJlUG9pbnQueSxcblx0XHRcdFx0cmFkaWFsRGlzdGFuY2VGcm9tQ2VudGVyID0gTWF0aC5zcXJ0KCBkaXN0YW5jZUZyb21YQ2VudGVyICogZGlzdGFuY2VGcm9tWENlbnRlciArIGRpc3RhbmNlRnJvbVlDZW50ZXIgKiBkaXN0YW5jZUZyb21ZQ2VudGVyKTtcblxuXG5cdFx0XHR2YXIgYW5nbGUgPSBNYXRoLlBJICogMiArIE1hdGguYXRhbjIoZGlzdGFuY2VGcm9tWUNlbnRlciwgZGlzdGFuY2VGcm9tWENlbnRlcik7XG5cblx0XHRcdC8vSWYgdGhlIHNlZ21lbnQgaXMgaW4gdGhlIHRvcCBsZWZ0IHF1YWRyYW50LCB3ZSBuZWVkIHRvIGFkZCBhbm90aGVyIHJvdGF0aW9uIHRvIHRoZSBhbmdsZVxuXHRcdFx0aWYgKGRpc3RhbmNlRnJvbVhDZW50ZXIgPCAwICYmIGRpc3RhbmNlRnJvbVlDZW50ZXIgPCAwKXtcblx0XHRcdFx0YW5nbGUgKz0gTWF0aC5QSSoyO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRhbmdsZTogYW5nbGUsXG5cdFx0XHRcdGRpc3RhbmNlOiByYWRpYWxEaXN0YW5jZUZyb21DZW50ZXJcblx0XHRcdH07XG5cdFx0fSxcblx0XHRhbGlhc1BpeGVsID0gaGVscGVycy5hbGlhc1BpeGVsID0gZnVuY3Rpb24ocGl4ZWxXaWR0aCl7XG5cdFx0XHRyZXR1cm4gKHBpeGVsV2lkdGggJSAyID09PSAwKSA/IDAgOiAwLjU7XG5cdFx0fSxcblx0XHRzcGxpbmVDdXJ2ZSA9IGhlbHBlcnMuc3BsaW5lQ3VydmUgPSBmdW5jdGlvbihGaXJzdFBvaW50LE1pZGRsZVBvaW50LEFmdGVyUG9pbnQsdCl7XG5cdFx0XHQvL1Byb3BzIHRvIFJvYiBTcGVuY2VyIGF0IHNjYWxlZCBpbm5vdmF0aW9uIGZvciBoaXMgcG9zdCBvbiBzcGxpbmluZyBiZXR3ZWVuIHBvaW50c1xuXHRcdFx0Ly9odHRwOi8vc2NhbGVkaW5ub3ZhdGlvbi5jb20vYW5hbHl0aWNzL3NwbGluZXMvYWJvdXRTcGxpbmVzLmh0bWxcblx0XHRcdHZhciBkMDE9TWF0aC5zcXJ0KE1hdGgucG93KE1pZGRsZVBvaW50LngtRmlyc3RQb2ludC54LDIpK01hdGgucG93KE1pZGRsZVBvaW50LnktRmlyc3RQb2ludC55LDIpKSxcblx0XHRcdFx0ZDEyPU1hdGguc3FydChNYXRoLnBvdyhBZnRlclBvaW50LngtTWlkZGxlUG9pbnQueCwyKStNYXRoLnBvdyhBZnRlclBvaW50LnktTWlkZGxlUG9pbnQueSwyKSksXG5cdFx0XHRcdGZhPXQqZDAxLyhkMDErZDEyKSwvLyBzY2FsaW5nIGZhY3RvciBmb3IgdHJpYW5nbGUgVGFcblx0XHRcdFx0ZmI9dCpkMTIvKGQwMStkMTIpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aW5uZXIgOiB7XG5cdFx0XHRcdFx0eCA6IE1pZGRsZVBvaW50LngtZmEqKEFmdGVyUG9pbnQueC1GaXJzdFBvaW50LngpLFxuXHRcdFx0XHRcdHkgOiBNaWRkbGVQb2ludC55LWZhKihBZnRlclBvaW50LnktRmlyc3RQb2ludC55KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvdXRlciA6IHtcblx0XHRcdFx0XHR4OiBNaWRkbGVQb2ludC54K2ZiKihBZnRlclBvaW50LngtRmlyc3RQb2ludC54KSxcblx0XHRcdFx0XHR5IDogTWlkZGxlUG9pbnQueStmYiooQWZ0ZXJQb2ludC55LUZpcnN0UG9pbnQueSlcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGNhbGN1bGF0ZU9yZGVyT2ZNYWduaXR1ZGUgPSBoZWxwZXJzLmNhbGN1bGF0ZU9yZGVyT2ZNYWduaXR1ZGUgPSBmdW5jdGlvbih2YWwpe1xuXHRcdFx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5sb2codmFsKSAvIE1hdGguTE4xMCk7XG5cdFx0fSxcblx0XHRjYWxjdWxhdGVTY2FsZVJhbmdlID0gaGVscGVycy5jYWxjdWxhdGVTY2FsZVJhbmdlID0gZnVuY3Rpb24odmFsdWVzQXJyYXksIGRyYXdpbmdTaXplLCB0ZXh0U2l6ZSwgc3RhcnRGcm9tWmVybywgaW50ZWdlcnNPbmx5KXtcblxuXHRcdFx0Ly9TZXQgYSBtaW5pbXVtIHN0ZXAgb2YgdHdvIC0gYSBwb2ludCBhdCB0aGUgdG9wIG9mIHRoZSBncmFwaCwgYW5kIGEgcG9pbnQgYXQgdGhlIGJhc2Vcblx0XHRcdHZhciBtaW5TdGVwcyA9IDIsXG5cdFx0XHRcdG1heFN0ZXBzID0gTWF0aC5mbG9vcihkcmF3aW5nU2l6ZS8odGV4dFNpemUgKiAxLjUpKSxcblx0XHRcdFx0c2tpcEZpdHRpbmcgPSAobWluU3RlcHMgPj0gbWF4U3RlcHMpO1xuXG5cdFx0XHR2YXIgbWF4VmFsdWUgPSBtYXgodmFsdWVzQXJyYXkpLFxuXHRcdFx0XHRtaW5WYWx1ZSA9IG1pbih2YWx1ZXNBcnJheSk7XG5cblx0XHRcdC8vIFdlIG5lZWQgc29tZSBkZWdyZWUgb2Ygc2VwZXJhdGlvbiBoZXJlIHRvIGNhbGN1bGF0ZSB0aGUgc2NhbGVzIGlmIGFsbCB0aGUgdmFsdWVzIGFyZSB0aGUgc2FtZVxuXHRcdFx0Ly8gQWRkaW5nL21pbnVzaW5nIDAuNSB3aWxsIGdpdmUgdXMgYSByYW5nZSBvZiAxLlxuXHRcdFx0aWYgKG1heFZhbHVlID09PSBtaW5WYWx1ZSl7XG5cdFx0XHRcdG1heFZhbHVlICs9IDAuNTtcblx0XHRcdFx0Ly8gU28gd2UgZG9uJ3QgZW5kIHVwIHdpdGggYSBncmFwaCB3aXRoIGEgbmVnYXRpdmUgc3RhcnQgdmFsdWUgaWYgd2UndmUgc2FpZCBhbHdheXMgc3RhcnQgZnJvbSB6ZXJvXG5cdFx0XHRcdGlmIChtaW5WYWx1ZSA+PSAwLjUgJiYgIXN0YXJ0RnJvbVplcm8pe1xuXHRcdFx0XHRcdG1pblZhbHVlIC09IDAuNTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdC8vIE1ha2UgdXAgYSB3aG9sZSBudW1iZXIgYWJvdmUgdGhlIHZhbHVlc1xuXHRcdFx0XHRcdG1heFZhbHVlICs9IDAuNTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR2YXJcdHZhbHVlUmFuZ2UgPSBNYXRoLmFicyhtYXhWYWx1ZSAtIG1pblZhbHVlKSxcblx0XHRcdFx0cmFuZ2VPcmRlck9mTWFnbml0dWRlID0gY2FsY3VsYXRlT3JkZXJPZk1hZ25pdHVkZSh2YWx1ZVJhbmdlKSxcblx0XHRcdFx0Z3JhcGhNYXggPSBNYXRoLmNlaWwobWF4VmFsdWUgLyAoMSAqIE1hdGgucG93KDEwLCByYW5nZU9yZGVyT2ZNYWduaXR1ZGUpKSkgKiBNYXRoLnBvdygxMCwgcmFuZ2VPcmRlck9mTWFnbml0dWRlKSxcblx0XHRcdFx0Z3JhcGhNaW4gPSAoc3RhcnRGcm9tWmVybykgPyAwIDogTWF0aC5mbG9vcihtaW5WYWx1ZSAvICgxICogTWF0aC5wb3coMTAsIHJhbmdlT3JkZXJPZk1hZ25pdHVkZSkpKSAqIE1hdGgucG93KDEwLCByYW5nZU9yZGVyT2ZNYWduaXR1ZGUpLFxuXHRcdFx0XHRncmFwaFJhbmdlID0gZ3JhcGhNYXggLSBncmFwaE1pbixcblx0XHRcdFx0c3RlcFZhbHVlID0gTWF0aC5wb3coMTAsIHJhbmdlT3JkZXJPZk1hZ25pdHVkZSksXG5cdFx0XHRcdG51bWJlck9mU3RlcHMgPSBNYXRoLnJvdW5kKGdyYXBoUmFuZ2UgLyBzdGVwVmFsdWUpO1xuXG5cdFx0XHQvL0lmIHdlIGhhdmUgbW9yZSBzcGFjZSBvbiB0aGUgZ3JhcGggd2UnbGwgdXNlIGl0IHRvIGdpdmUgbW9yZSBkZWZpbml0aW9uIHRvIHRoZSBkYXRhXG5cdFx0XHR3aGlsZSgobnVtYmVyT2ZTdGVwcyA+IG1heFN0ZXBzIHx8IChudW1iZXJPZlN0ZXBzICogMikgPCBtYXhTdGVwcykgJiYgIXNraXBGaXR0aW5nKSB7XG5cdFx0XHRcdGlmKG51bWJlck9mU3RlcHMgPiBtYXhTdGVwcyl7XG5cdFx0XHRcdFx0c3RlcFZhbHVlICo9Mjtcblx0XHRcdFx0XHRudW1iZXJPZlN0ZXBzID0gTWF0aC5yb3VuZChncmFwaFJhbmdlL3N0ZXBWYWx1ZSk7XG5cdFx0XHRcdFx0Ly8gRG9uJ3QgZXZlciBkZWFsIHdpdGggYSBkZWNpbWFsIG51bWJlciBvZiBzdGVwcyAtIGNhbmNlbCBmaXR0aW5nIGFuZCBqdXN0IHVzZSB0aGUgbWluaW11bSBudW1iZXIgb2Ygc3RlcHMuXG5cdFx0XHRcdFx0aWYgKG51bWJlck9mU3RlcHMgJSAxICE9PSAwKXtcblx0XHRcdFx0XHRcdHNraXBGaXR0aW5nID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9XZSBjYW4gZml0IGluIGRvdWJsZSB0aGUgYW1vdW50IG9mIHNjYWxlIHBvaW50cyBvbiB0aGUgc2NhbGVcblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHQvL0lmIHVzZXIgaGFzIGRlY2xhcmVkIGludHMgb25seSwgYW5kIHRoZSBzdGVwIHZhbHVlIGlzbid0IGEgZGVjaW1hbFxuXHRcdFx0XHRcdGlmIChpbnRlZ2Vyc09ubHkgJiYgcmFuZ2VPcmRlck9mTWFnbml0dWRlID49IDApe1xuXHRcdFx0XHRcdFx0Ly9JZiB0aGUgdXNlciBoYXMgc2FpZCBpbnRlZ2VycyBvbmx5LCB3ZSBuZWVkIHRvIGNoZWNrIHRoYXQgbWFraW5nIHRoZSBzY2FsZSBtb3JlIGdyYW51bGFyIHdvdWxkbid0IG1ha2UgaXQgYSBmbG9hdFxuXHRcdFx0XHRcdFx0aWYoc3RlcFZhbHVlLzIgJSAxID09PSAwKXtcblx0XHRcdFx0XHRcdFx0c3RlcFZhbHVlIC89Mjtcblx0XHRcdFx0XHRcdFx0bnVtYmVyT2ZTdGVwcyA9IE1hdGgucm91bmQoZ3JhcGhSYW5nZS9zdGVwVmFsdWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Ly9JZiBpdCB3b3VsZCBtYWtlIGl0IGEgZmxvYXQgYnJlYWsgb3V0IG9mIHRoZSBsb29wXG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly9JZiB0aGUgc2NhbGUgZG9lc24ndCBoYXZlIHRvIGJlIGFuIGludCwgbWFrZSB0aGUgc2NhbGUgbW9yZSBncmFudWxhciBhbnl3YXkuXG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdHN0ZXBWYWx1ZSAvPTI7XG5cdFx0XHRcdFx0XHRudW1iZXJPZlN0ZXBzID0gTWF0aC5yb3VuZChncmFwaFJhbmdlL3N0ZXBWYWx1ZSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKHNraXBGaXR0aW5nKXtcblx0XHRcdFx0bnVtYmVyT2ZTdGVwcyA9IG1pblN0ZXBzO1xuXHRcdFx0XHRzdGVwVmFsdWUgPSBncmFwaFJhbmdlIC8gbnVtYmVyT2ZTdGVwcztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0c3RlcHMgOiBudW1iZXJPZlN0ZXBzLFxuXHRcdFx0XHRzdGVwVmFsdWUgOiBzdGVwVmFsdWUsXG5cdFx0XHRcdG1pbiA6IGdyYXBoTWluLFxuXHRcdFx0XHRtYXhcdDogZ3JhcGhNaW4gKyAobnVtYmVyT2ZTdGVwcyAqIHN0ZXBWYWx1ZSlcblx0XHRcdH07XG5cblx0XHR9LFxuXHRcdC8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cblx0XHQvLyBCbG93cyB1cCBqc2hpbnQgZXJyb3JzIGJhc2VkIG9uIHRoZSBuZXcgRnVuY3Rpb24gY29uc3RydWN0b3Jcblx0XHQvL1RlbXBsYXRpbmcgbWV0aG9kc1xuXHRcdC8vSmF2YXNjcmlwdCBtaWNybyB0ZW1wbGF0aW5nIGJ5IEpvaG4gUmVzaWcgLSBzb3VyY2UgYXQgaHR0cDovL2Vqb2huLm9yZy9ibG9nL2phdmFzY3JpcHQtbWljcm8tdGVtcGxhdGluZy9cblx0XHR0ZW1wbGF0ZSA9IGhlbHBlcnMudGVtcGxhdGUgPSBmdW5jdGlvbih0ZW1wbGF0ZVN0cmluZywgdmFsdWVzT2JqZWN0KXtcblxuXHRcdFx0Ly8gSWYgdGVtcGxhdGVTdHJpbmcgaXMgZnVuY3Rpb24gcmF0aGVyIHRoYW4gc3RyaW5nLXRlbXBsYXRlIC0gY2FsbCB0aGUgZnVuY3Rpb24gZm9yIHZhbHVlc09iamVjdFxuXG5cdFx0XHRpZih0ZW1wbGF0ZVN0cmluZyBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcblx0XHRcdCBcdHJldHVybiB0ZW1wbGF0ZVN0cmluZyh2YWx1ZXNPYmplY3QpO1xuXHRcdCBcdH1cblxuXHRcdFx0dmFyIGNhY2hlID0ge307XG5cdFx0XHRmdW5jdGlvbiB0bXBsKHN0ciwgZGF0YSl7XG5cdFx0XHRcdC8vIEZpZ3VyZSBvdXQgaWYgd2UncmUgZ2V0dGluZyBhIHRlbXBsYXRlLCBvciBpZiB3ZSBuZWVkIHRvXG5cdFx0XHRcdC8vIGxvYWQgdGhlIHRlbXBsYXRlIC0gYW5kIGJlIHN1cmUgdG8gY2FjaGUgdGhlIHJlc3VsdC5cblx0XHRcdFx0dmFyIGZuID0gIS9cXFcvLnRlc3Qoc3RyKSA/XG5cdFx0XHRcdGNhY2hlW3N0cl0gPSBjYWNoZVtzdHJdIDpcblxuXHRcdFx0XHQvLyBHZW5lcmF0ZSBhIHJldXNhYmxlIGZ1bmN0aW9uIHRoYXQgd2lsbCBzZXJ2ZSBhcyBhIHRlbXBsYXRlXG5cdFx0XHRcdC8vIGdlbmVyYXRvciAoYW5kIHdoaWNoIHdpbGwgYmUgY2FjaGVkKS5cblx0XHRcdFx0bmV3IEZ1bmN0aW9uKFwib2JqXCIsXG5cdFx0XHRcdFx0XCJ2YXIgcD1bXSxwcmludD1mdW5jdGlvbigpe3AucHVzaC5hcHBseShwLGFyZ3VtZW50cyk7fTtcIiArXG5cblx0XHRcdFx0XHQvLyBJbnRyb2R1Y2UgdGhlIGRhdGEgYXMgbG9jYWwgdmFyaWFibGVzIHVzaW5nIHdpdGgoKXt9XG5cdFx0XHRcdFx0XCJ3aXRoKG9iail7cC5wdXNoKCdcIiArXG5cblx0XHRcdFx0XHQvLyBDb252ZXJ0IHRoZSB0ZW1wbGF0ZSBpbnRvIHB1cmUgSmF2YVNjcmlwdFxuXHRcdFx0XHRcdHN0clxuXHRcdFx0XHRcdFx0LnJlcGxhY2UoL1tcXHJcXHRcXG5dL2csIFwiIFwiKVxuXHRcdFx0XHRcdFx0LnNwbGl0KFwiPCVcIikuam9pbihcIlxcdFwiKVxuXHRcdFx0XHRcdFx0LnJlcGxhY2UoLygoXnwlPilbXlxcdF0qKScvZywgXCIkMVxcclwiKVxuXHRcdFx0XHRcdFx0LnJlcGxhY2UoL1xcdD0oLio/KSU+L2csIFwiJywkMSwnXCIpXG5cdFx0XHRcdFx0XHQuc3BsaXQoXCJcXHRcIikuam9pbihcIicpO1wiKVxuXHRcdFx0XHRcdFx0LnNwbGl0KFwiJT5cIikuam9pbihcInAucHVzaCgnXCIpXG5cdFx0XHRcdFx0XHQuc3BsaXQoXCJcXHJcIikuam9pbihcIlxcXFwnXCIpICtcblx0XHRcdFx0XHRcIicpO31yZXR1cm4gcC5qb2luKCcnKTtcIlxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdC8vIFByb3ZpZGUgc29tZSBiYXNpYyBjdXJyeWluZyB0byB0aGUgdXNlclxuXHRcdFx0XHRyZXR1cm4gZGF0YSA/IGZuKCBkYXRhICkgOiBmbjtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0bXBsKHRlbXBsYXRlU3RyaW5nLHZhbHVlc09iamVjdCk7XG5cdFx0fSxcblx0XHQvKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuXHRcdGdlbmVyYXRlTGFiZWxzID0gaGVscGVycy5nZW5lcmF0ZUxhYmVscyA9IGZ1bmN0aW9uKHRlbXBsYXRlU3RyaW5nLG51bWJlck9mU3RlcHMsZ3JhcGhNaW4sc3RlcFZhbHVlKXtcblx0XHRcdHZhciBsYWJlbHNBcnJheSA9IG5ldyBBcnJheShudW1iZXJPZlN0ZXBzKTtcblx0XHRcdGlmIChsYWJlbFRlbXBsYXRlU3RyaW5nKXtcblx0XHRcdFx0ZWFjaChsYWJlbHNBcnJheSxmdW5jdGlvbih2YWwsaW5kZXgpe1xuXHRcdFx0XHRcdGxhYmVsc0FycmF5W2luZGV4XSA9IHRlbXBsYXRlKHRlbXBsYXRlU3RyaW5nLHt2YWx1ZTogKGdyYXBoTWluICsgKHN0ZXBWYWx1ZSooaW5kZXgrMSkpKX0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBsYWJlbHNBcnJheTtcblx0XHR9LFxuXHRcdC8vLS1BbmltYXRpb24gbWV0aG9kc1xuXHRcdC8vRWFzaW5nIGZ1bmN0aW9ucyBhZGFwdGVkIGZyb20gUm9iZXJ0IFBlbm5lcidzIGVhc2luZyBlcXVhdGlvbnNcblx0XHQvL2h0dHA6Ly93d3cucm9iZXJ0cGVubmVyLmNvbS9lYXNpbmcvXG5cdFx0ZWFzaW5nRWZmZWN0cyA9IGhlbHBlcnMuZWFzaW5nRWZmZWN0cyA9IHtcblx0XHRcdGxpbmVhcjogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuIHQ7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluUXVhZDogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuIHQgKiB0O1xuXHRcdFx0fSxcblx0XHRcdGVhc2VPdXRRdWFkOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gLTEgKiB0ICogKHQgLSAyKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5PdXRRdWFkOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRpZiAoKHQgLz0gMSAvIDIpIDwgMSkgcmV0dXJuIDEgLyAyICogdCAqIHQ7XG5cdFx0XHRcdHJldHVybiAtMSAvIDIgKiAoKC0tdCkgKiAodCAtIDIpIC0gMSk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluQ3ViaWM6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiB0ICogdCAqIHQ7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZU91dEN1YmljOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gMSAqICgodCA9IHQgLyAxIC0gMSkgKiB0ICogdCArIDEpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJbk91dEN1YmljOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRpZiAoKHQgLz0gMSAvIDIpIDwgMSkgcmV0dXJuIDEgLyAyICogdCAqIHQgKiB0O1xuXHRcdFx0XHRyZXR1cm4gMSAvIDIgKiAoKHQgLT0gMikgKiB0ICogdCArIDIpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJblF1YXJ0OiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gdCAqIHQgKiB0ICogdDtcblx0XHRcdH0sXG5cdFx0XHRlYXNlT3V0UXVhcnQ6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiAtMSAqICgodCA9IHQgLyAxIC0gMSkgKiB0ICogdCAqIHQgLSAxKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5PdXRRdWFydDogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0aWYgKCh0IC89IDEgLyAyKSA8IDEpIHJldHVybiAxIC8gMiAqIHQgKiB0ICogdCAqIHQ7XG5cdFx0XHRcdHJldHVybiAtMSAvIDIgKiAoKHQgLT0gMikgKiB0ICogdCAqIHQgLSAyKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5RdWludDogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuIDEgKiAodCAvPSAxKSAqIHQgKiB0ICogdCAqIHQ7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZU91dFF1aW50OiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gMSAqICgodCA9IHQgLyAxIC0gMSkgKiB0ICogdCAqIHQgKiB0ICsgMSk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluT3V0UXVpbnQ6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdGlmICgodCAvPSAxIC8gMikgPCAxKSByZXR1cm4gMSAvIDIgKiB0ICogdCAqIHQgKiB0ICogdDtcblx0XHRcdFx0cmV0dXJuIDEgLyAyICogKCh0IC09IDIpICogdCAqIHQgKiB0ICogdCArIDIpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJblNpbmU6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiAtMSAqIE1hdGguY29zKHQgLyAxICogKE1hdGguUEkgLyAyKSkgKyAxO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VPdXRTaW5lOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gMSAqIE1hdGguc2luKHQgLyAxICogKE1hdGguUEkgLyAyKSk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluT3V0U2luZTogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuIC0xIC8gMiAqIChNYXRoLmNvcyhNYXRoLlBJICogdCAvIDEpIC0gMSk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluRXhwbzogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuICh0ID09PSAwKSA/IDEgOiAxICogTWF0aC5wb3coMiwgMTAgKiAodCAvIDEgLSAxKSk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZU91dEV4cG86IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiAodCA9PT0gMSkgPyAxIDogMSAqICgtTWF0aC5wb3coMiwgLTEwICogdCAvIDEpICsgMSk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluT3V0RXhwbzogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0aWYgKHQgPT09IDApIHJldHVybiAwO1xuXHRcdFx0XHRpZiAodCA9PT0gMSkgcmV0dXJuIDE7XG5cdFx0XHRcdGlmICgodCAvPSAxIC8gMikgPCAxKSByZXR1cm4gMSAvIDIgKiBNYXRoLnBvdygyLCAxMCAqICh0IC0gMSkpO1xuXHRcdFx0XHRyZXR1cm4gMSAvIDIgKiAoLU1hdGgucG93KDIsIC0xMCAqIC0tdCkgKyAyKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5DaXJjOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRpZiAodCA+PSAxKSByZXR1cm4gdDtcblx0XHRcdFx0cmV0dXJuIC0xICogKE1hdGguc3FydCgxIC0gKHQgLz0gMSkgKiB0KSAtIDEpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VPdXRDaXJjOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gMSAqIE1hdGguc3FydCgxIC0gKHQgPSB0IC8gMSAtIDEpICogdCk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluT3V0Q2lyYzogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0aWYgKCh0IC89IDEgLyAyKSA8IDEpIHJldHVybiAtMSAvIDIgKiAoTWF0aC5zcXJ0KDEgLSB0ICogdCkgLSAxKTtcblx0XHRcdFx0cmV0dXJuIDEgLyAyICogKE1hdGguc3FydCgxIC0gKHQgLT0gMikgKiB0KSArIDEpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJbkVsYXN0aWM6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHZhciBzID0gMS43MDE1ODtcblx0XHRcdFx0dmFyIHAgPSAwO1xuXHRcdFx0XHR2YXIgYSA9IDE7XG5cdFx0XHRcdGlmICh0ID09PSAwKSByZXR1cm4gMDtcblx0XHRcdFx0aWYgKCh0IC89IDEpID09IDEpIHJldHVybiAxO1xuXHRcdFx0XHRpZiAoIXApIHAgPSAxICogMC4zO1xuXHRcdFx0XHRpZiAoYSA8IE1hdGguYWJzKDEpKSB7XG5cdFx0XHRcdFx0YSA9IDE7XG5cdFx0XHRcdFx0cyA9IHAgLyA0O1xuXHRcdFx0XHR9IGVsc2UgcyA9IHAgLyAoMiAqIE1hdGguUEkpICogTWF0aC5hc2luKDEgLyBhKTtcblx0XHRcdFx0cmV0dXJuIC0oYSAqIE1hdGgucG93KDIsIDEwICogKHQgLT0gMSkpICogTWF0aC5zaW4oKHQgKiAxIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VPdXRFbGFzdGljOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHR2YXIgcyA9IDEuNzAxNTg7XG5cdFx0XHRcdHZhciBwID0gMDtcblx0XHRcdFx0dmFyIGEgPSAxO1xuXHRcdFx0XHRpZiAodCA9PT0gMCkgcmV0dXJuIDA7XG5cdFx0XHRcdGlmICgodCAvPSAxKSA9PSAxKSByZXR1cm4gMTtcblx0XHRcdFx0aWYgKCFwKSBwID0gMSAqIDAuMztcblx0XHRcdFx0aWYgKGEgPCBNYXRoLmFicygxKSkge1xuXHRcdFx0XHRcdGEgPSAxO1xuXHRcdFx0XHRcdHMgPSBwIC8gNDtcblx0XHRcdFx0fSBlbHNlIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbigxIC8gYSk7XG5cdFx0XHRcdHJldHVybiBhICogTWF0aC5wb3coMiwgLTEwICogdCkgKiBNYXRoLnNpbigodCAqIDEgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSArIDE7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluT3V0RWxhc3RpYzogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0dmFyIHMgPSAxLjcwMTU4O1xuXHRcdFx0XHR2YXIgcCA9IDA7XG5cdFx0XHRcdHZhciBhID0gMTtcblx0XHRcdFx0aWYgKHQgPT09IDApIHJldHVybiAwO1xuXHRcdFx0XHRpZiAoKHQgLz0gMSAvIDIpID09IDIpIHJldHVybiAxO1xuXHRcdFx0XHRpZiAoIXApIHAgPSAxICogKDAuMyAqIDEuNSk7XG5cdFx0XHRcdGlmIChhIDwgTWF0aC5hYnMoMSkpIHtcblx0XHRcdFx0XHRhID0gMTtcblx0XHRcdFx0XHRzID0gcCAvIDQ7XG5cdFx0XHRcdH0gZWxzZSBzID0gcCAvICgyICogTWF0aC5QSSkgKiBNYXRoLmFzaW4oMSAvIGEpO1xuXHRcdFx0XHRpZiAodCA8IDEpIHJldHVybiAtMC41ICogKGEgKiBNYXRoLnBvdygyLCAxMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0ICogMSAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApKTtcblx0XHRcdFx0cmV0dXJuIGEgKiBNYXRoLnBvdygyLCAtMTAgKiAodCAtPSAxKSkgKiBNYXRoLnNpbigodCAqIDEgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSAqIDAuNSArIDE7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluQmFjazogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0dmFyIHMgPSAxLjcwMTU4O1xuXHRcdFx0XHRyZXR1cm4gMSAqICh0IC89IDEpICogdCAqICgocyArIDEpICogdCAtIHMpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VPdXRCYWNrOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHR2YXIgcyA9IDEuNzAxNTg7XG5cdFx0XHRcdHJldHVybiAxICogKCh0ID0gdCAvIDEgLSAxKSAqIHQgKiAoKHMgKyAxKSAqIHQgKyBzKSArIDEpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJbk91dEJhY2s6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHZhciBzID0gMS43MDE1ODtcblx0XHRcdFx0aWYgKCh0IC89IDEgLyAyKSA8IDEpIHJldHVybiAxIC8gMiAqICh0ICogdCAqICgoKHMgKj0gKDEuNTI1KSkgKyAxKSAqIHQgLSBzKSk7XG5cdFx0XHRcdHJldHVybiAxIC8gMiAqICgodCAtPSAyKSAqIHQgKiAoKChzICo9ICgxLjUyNSkpICsgMSkgKiB0ICsgcykgKyAyKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5Cb3VuY2U6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiAxIC0gZWFzaW5nRWZmZWN0cy5lYXNlT3V0Qm91bmNlKDEgLSB0KTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlT3V0Qm91bmNlOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRpZiAoKHQgLz0gMSkgPCAoMSAvIDIuNzUpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIDEgKiAoNy41NjI1ICogdCAqIHQpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHQgPCAoMiAvIDIuNzUpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIDEgKiAoNy41NjI1ICogKHQgLT0gKDEuNSAvIDIuNzUpKSAqIHQgKyAwLjc1KTtcblx0XHRcdFx0fSBlbHNlIGlmICh0IDwgKDIuNSAvIDIuNzUpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIDEgKiAoNy41NjI1ICogKHQgLT0gKDIuMjUgLyAyLjc1KSkgKiB0ICsgMC45Mzc1KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gMSAqICg3LjU2MjUgKiAodCAtPSAoMi42MjUgLyAyLjc1KSkgKiB0ICsgMC45ODQzNzUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluT3V0Qm91bmNlOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRpZiAodCA8IDEgLyAyKSByZXR1cm4gZWFzaW5nRWZmZWN0cy5lYXNlSW5Cb3VuY2UodCAqIDIpICogMC41O1xuXHRcdFx0XHRyZXR1cm4gZWFzaW5nRWZmZWN0cy5lYXNlT3V0Qm91bmNlKHQgKiAyIC0gMSkgKiAwLjUgKyAxICogMC41O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly9SZXF1ZXN0IGFuaW1hdGlvbiBwb2x5ZmlsbCAtIGh0dHA6Ly93d3cucGF1bGlyaXNoLmNvbS8yMDExL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtYW5pbWF0aW5nL1xuXHRcdHJlcXVlc3RBbmltRnJhbWUgPSBoZWxwZXJzLnJlcXVlc3RBbmltRnJhbWUgPSAoZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG5cdFx0XHRcdHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcblx0XHRcdFx0d2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuXHRcdFx0XHR3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuXHRcdFx0XHR3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcblx0XHRcdFx0ZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0XHRcdFx0XHRyZXR1cm4gd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XG5cdFx0XHRcdH07XG5cdFx0fSkoKSxcblx0XHRjYW5jZWxBbmltRnJhbWUgPSBoZWxwZXJzLmNhbmNlbEFuaW1GcmFtZSA9IChmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuXHRcdFx0XHR3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcblx0XHRcdFx0d2luZG93Lm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG5cdFx0XHRcdHdpbmRvdy5vQ2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcblx0XHRcdFx0d2luZG93Lm1zQ2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcblx0XHRcdFx0ZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0XHRcdFx0XHRyZXR1cm4gd2luZG93LmNsZWFyVGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcblx0XHRcdFx0fTtcblx0XHR9KSgpLFxuXHRcdGFuaW1hdGlvbkxvb3AgPSBoZWxwZXJzLmFuaW1hdGlvbkxvb3AgPSBmdW5jdGlvbihjYWxsYmFjayx0b3RhbFN0ZXBzLGVhc2luZ1N0cmluZyxvblByb2dyZXNzLG9uQ29tcGxldGUsY2hhcnRJbnN0YW5jZSl7XG5cblx0XHRcdHZhciBjdXJyZW50U3RlcCA9IDAsXG5cdFx0XHRcdGVhc2luZ0Z1bmN0aW9uID0gZWFzaW5nRWZmZWN0c1tlYXNpbmdTdHJpbmddIHx8IGVhc2luZ0VmZmVjdHMubGluZWFyO1xuXG5cdFx0XHR2YXIgYW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRjdXJyZW50U3RlcCsrO1xuXHRcdFx0XHR2YXIgc3RlcERlY2ltYWwgPSBjdXJyZW50U3RlcC90b3RhbFN0ZXBzO1xuXHRcdFx0XHR2YXIgZWFzZURlY2ltYWwgPSBlYXNpbmdGdW5jdGlvbihzdGVwRGVjaW1hbCk7XG5cblx0XHRcdFx0Y2FsbGJhY2suY2FsbChjaGFydEluc3RhbmNlLGVhc2VEZWNpbWFsLHN0ZXBEZWNpbWFsLCBjdXJyZW50U3RlcCk7XG5cdFx0XHRcdG9uUHJvZ3Jlc3MuY2FsbChjaGFydEluc3RhbmNlLGVhc2VEZWNpbWFsLHN0ZXBEZWNpbWFsKTtcblx0XHRcdFx0aWYgKGN1cnJlbnRTdGVwIDwgdG90YWxTdGVwcyl7XG5cdFx0XHRcdFx0Y2hhcnRJbnN0YW5jZS5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltRnJhbWUoYW5pbWF0aW9uRnJhbWUpO1xuXHRcdFx0XHR9IGVsc2V7XG5cdFx0XHRcdFx0b25Db21wbGV0ZS5hcHBseShjaGFydEluc3RhbmNlKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdHJlcXVlc3RBbmltRnJhbWUoYW5pbWF0aW9uRnJhbWUpO1xuXHRcdH0sXG5cdFx0Ly8tLSBET00gbWV0aG9kc1xuXHRcdGdldFJlbGF0aXZlUG9zaXRpb24gPSBoZWxwZXJzLmdldFJlbGF0aXZlUG9zaXRpb24gPSBmdW5jdGlvbihldnQpe1xuXHRcdFx0dmFyIG1vdXNlWCwgbW91c2VZO1xuXHRcdFx0dmFyIGUgPSBldnQub3JpZ2luYWxFdmVudCB8fCBldnQsXG5cdFx0XHRcdGNhbnZhcyA9IGV2dC5jdXJyZW50VGFyZ2V0IHx8IGV2dC5zcmNFbGVtZW50LFxuXHRcdFx0XHRib3VuZGluZ1JlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cblx0XHRcdGlmIChlLnRvdWNoZXMpe1xuXHRcdFx0XHRtb3VzZVggPSBlLnRvdWNoZXNbMF0uY2xpZW50WCAtIGJvdW5kaW5nUmVjdC5sZWZ0O1xuXHRcdFx0XHRtb3VzZVkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WSAtIGJvdW5kaW5nUmVjdC50b3A7XG5cblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdG1vdXNlWCA9IGUuY2xpZW50WCAtIGJvdW5kaW5nUmVjdC5sZWZ0O1xuXHRcdFx0XHRtb3VzZVkgPSBlLmNsaWVudFkgLSBib3VuZGluZ1JlY3QudG9wO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR4IDogbW91c2VYLFxuXHRcdFx0XHR5IDogbW91c2VZXG5cdFx0XHR9O1xuXG5cdFx0fSxcblx0XHRhZGRFdmVudCA9IGhlbHBlcnMuYWRkRXZlbnQgPSBmdW5jdGlvbihub2RlLGV2ZW50VHlwZSxtZXRob2Qpe1xuXHRcdFx0aWYgKG5vZGUuYWRkRXZlbnRMaXN0ZW5lcil7XG5cdFx0XHRcdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsbWV0aG9kKTtcblx0XHRcdH0gZWxzZSBpZiAobm9kZS5hdHRhY2hFdmVudCl7XG5cdFx0XHRcdG5vZGUuYXR0YWNoRXZlbnQoXCJvblwiK2V2ZW50VHlwZSwgbWV0aG9kKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5vZGVbXCJvblwiK2V2ZW50VHlwZV0gPSBtZXRob2Q7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZW1vdmVFdmVudCA9IGhlbHBlcnMucmVtb3ZlRXZlbnQgPSBmdW5jdGlvbihub2RlLCBldmVudFR5cGUsIGhhbmRsZXIpe1xuXHRcdFx0aWYgKG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcil7XG5cdFx0XHRcdG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGhhbmRsZXIsIGZhbHNlKTtcblx0XHRcdH0gZWxzZSBpZiAobm9kZS5kZXRhY2hFdmVudCl7XG5cdFx0XHRcdG5vZGUuZGV0YWNoRXZlbnQoXCJvblwiK2V2ZW50VHlwZSxoYW5kbGVyKTtcblx0XHRcdH0gZWxzZXtcblx0XHRcdFx0bm9kZVtcIm9uXCIgKyBldmVudFR5cGVdID0gbm9vcDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGJpbmRFdmVudHMgPSBoZWxwZXJzLmJpbmRFdmVudHMgPSBmdW5jdGlvbihjaGFydEluc3RhbmNlLCBhcnJheU9mRXZlbnRzLCBoYW5kbGVyKXtcblx0XHRcdC8vIENyZWF0ZSB0aGUgZXZlbnRzIG9iamVjdCBpZiBpdCdzIG5vdCBhbHJlYWR5IHByZXNlbnRcblx0XHRcdGlmICghY2hhcnRJbnN0YW5jZS5ldmVudHMpIGNoYXJ0SW5zdGFuY2UuZXZlbnRzID0ge307XG5cblx0XHRcdGVhY2goYXJyYXlPZkV2ZW50cyxmdW5jdGlvbihldmVudE5hbWUpe1xuXHRcdFx0XHRjaGFydEluc3RhbmNlLmV2ZW50c1tldmVudE5hbWVdID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRoYW5kbGVyLmFwcGx5KGNoYXJ0SW5zdGFuY2UsIGFyZ3VtZW50cyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdGFkZEV2ZW50KGNoYXJ0SW5zdGFuY2UuY2hhcnQuY2FudmFzLGV2ZW50TmFtZSxjaGFydEluc3RhbmNlLmV2ZW50c1tldmVudE5hbWVdKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0dW5iaW5kRXZlbnRzID0gaGVscGVycy51bmJpbmRFdmVudHMgPSBmdW5jdGlvbiAoY2hhcnRJbnN0YW5jZSwgYXJyYXlPZkV2ZW50cykge1xuXHRcdFx0ZWFjaChhcnJheU9mRXZlbnRzLCBmdW5jdGlvbihoYW5kbGVyLGV2ZW50TmFtZSl7XG5cdFx0XHRcdHJlbW92ZUV2ZW50KGNoYXJ0SW5zdGFuY2UuY2hhcnQuY2FudmFzLCBldmVudE5hbWUsIGhhbmRsZXIpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRnZXRNYXhpbXVtV2lkdGggPSBoZWxwZXJzLmdldE1heGltdW1XaWR0aCA9IGZ1bmN0aW9uKGRvbU5vZGUpe1xuXHRcdFx0dmFyIGNvbnRhaW5lciA9IGRvbU5vZGUucGFyZW50Tm9kZTtcblx0XHRcdC8vIFRPRE8gPSBjaGVjayBjcm9zcyBicm93c2VyIHN0dWZmIHdpdGggdGhpcy5cblx0XHRcdHJldHVybiBjb250YWluZXIuY2xpZW50V2lkdGg7XG5cdFx0fSxcblx0XHRnZXRNYXhpbXVtSGVpZ2h0ID0gaGVscGVycy5nZXRNYXhpbXVtSGVpZ2h0ID0gZnVuY3Rpb24oZG9tTm9kZSl7XG5cdFx0XHR2YXIgY29udGFpbmVyID0gZG9tTm9kZS5wYXJlbnROb2RlO1xuXHRcdFx0Ly8gVE9ETyA9IGNoZWNrIGNyb3NzIGJyb3dzZXIgc3R1ZmYgd2l0aCB0aGlzLlxuXHRcdFx0cmV0dXJuIGNvbnRhaW5lci5jbGllbnRIZWlnaHQ7XG5cdFx0fSxcblx0XHRnZXRNYXhpbXVtU2l6ZSA9IGhlbHBlcnMuZ2V0TWF4aW11bVNpemUgPSBoZWxwZXJzLmdldE1heGltdW1XaWR0aCwgLy8gbGVnYWN5IHN1cHBvcnRcblx0XHRyZXRpbmFTY2FsZSA9IGhlbHBlcnMucmV0aW5hU2NhbGUgPSBmdW5jdGlvbihjaGFydCl7XG5cdFx0XHR2YXIgY3R4ID0gY2hhcnQuY3R4LFxuXHRcdFx0XHR3aWR0aCA9IGNoYXJ0LmNhbnZhcy53aWR0aCxcblx0XHRcdFx0aGVpZ2h0ID0gY2hhcnQuY2FudmFzLmhlaWdodDtcblxuXHRcdFx0aWYgKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKSB7XG5cdFx0XHRcdGN0eC5jYW52YXMuc3R5bGUud2lkdGggPSB3aWR0aCArIFwicHhcIjtcblx0XHRcdFx0Y3R4LmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCI7XG5cdFx0XHRcdGN0eC5jYW52YXMuaGVpZ2h0ID0gaGVpZ2h0ICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XG5cdFx0XHRcdGN0eC5jYW52YXMud2lkdGggPSB3aWR0aCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuXHRcdFx0XHRjdHguc2NhbGUod2luZG93LmRldmljZVBpeGVsUmF0aW8sIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vLS0gQ2FudmFzIG1ldGhvZHNcblx0XHRjbGVhciA9IGhlbHBlcnMuY2xlYXIgPSBmdW5jdGlvbihjaGFydCl7XG5cdFx0XHRjaGFydC5jdHguY2xlYXJSZWN0KDAsMCxjaGFydC53aWR0aCxjaGFydC5oZWlnaHQpO1xuXHRcdH0sXG5cdFx0Zm9udFN0cmluZyA9IGhlbHBlcnMuZm9udFN0cmluZyA9IGZ1bmN0aW9uKHBpeGVsU2l6ZSxmb250U3R5bGUsZm9udEZhbWlseSl7XG5cdFx0XHRyZXR1cm4gZm9udFN0eWxlICsgXCIgXCIgKyBwaXhlbFNpemUrXCJweCBcIiArIGZvbnRGYW1pbHk7XG5cdFx0fSxcblx0XHRsb25nZXN0VGV4dCA9IGhlbHBlcnMubG9uZ2VzdFRleHQgPSBmdW5jdGlvbihjdHgsZm9udCxhcnJheU9mU3RyaW5ncyl7XG5cdFx0XHRjdHguZm9udCA9IGZvbnQ7XG5cdFx0XHR2YXIgbG9uZ2VzdCA9IDA7XG5cdFx0XHRlYWNoKGFycmF5T2ZTdHJpbmdzLGZ1bmN0aW9uKHN0cmluZyl7XG5cdFx0XHRcdHZhciB0ZXh0V2lkdGggPSBjdHgubWVhc3VyZVRleHQoc3RyaW5nKS53aWR0aDtcblx0XHRcdFx0bG9uZ2VzdCA9ICh0ZXh0V2lkdGggPiBsb25nZXN0KSA/IHRleHRXaWR0aCA6IGxvbmdlc3Q7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBsb25nZXN0O1xuXHRcdH0sXG5cdFx0ZHJhd1JvdW5kZWRSZWN0YW5nbGUgPSBoZWxwZXJzLmRyYXdSb3VuZGVkUmVjdGFuZ2xlID0gZnVuY3Rpb24oY3R4LHgseSx3aWR0aCxoZWlnaHQscmFkaXVzKXtcblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdGN0eC5tb3ZlVG8oeCArIHJhZGl1cywgeSk7XG5cdFx0XHRjdHgubGluZVRvKHggKyB3aWR0aCAtIHJhZGl1cywgeSk7XG5cdFx0XHRjdHgucXVhZHJhdGljQ3VydmVUbyh4ICsgd2lkdGgsIHksIHggKyB3aWR0aCwgeSArIHJhZGl1cyk7XG5cdFx0XHRjdHgubGluZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCAtIHJhZGl1cyk7XG5cdFx0XHRjdHgucXVhZHJhdGljQ3VydmVUbyh4ICsgd2lkdGgsIHkgKyBoZWlnaHQsIHggKyB3aWR0aCAtIHJhZGl1cywgeSArIGhlaWdodCk7XG5cdFx0XHRjdHgubGluZVRvKHggKyByYWRpdXMsIHkgKyBoZWlnaHQpO1xuXHRcdFx0Y3R4LnF1YWRyYXRpY0N1cnZlVG8oeCwgeSArIGhlaWdodCwgeCwgeSArIGhlaWdodCAtIHJhZGl1cyk7XG5cdFx0XHRjdHgubGluZVRvKHgsIHkgKyByYWRpdXMpO1xuXHRcdFx0Y3R4LnF1YWRyYXRpY0N1cnZlVG8oeCwgeSwgeCArIHJhZGl1cywgeSk7XG5cdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0fTtcblxuXG5cdC8vU3RvcmUgYSByZWZlcmVuY2UgdG8gZWFjaCBpbnN0YW5jZSAtIGFsbG93aW5nIHVzIHRvIGdsb2JhbGx5IHJlc2l6ZSBjaGFydCBpbnN0YW5jZXMgb24gd2luZG93IHJlc2l6ZS5cblx0Ly9EZXN0cm95IG1ldGhvZCBvbiB0aGUgY2hhcnQgd2lsbCByZW1vdmUgdGhlIGluc3RhbmNlIG9mIHRoZSBjaGFydCBmcm9tIHRoaXMgcmVmZXJlbmNlLlxuXHRDaGFydC5pbnN0YW5jZXMgPSB7fTtcblxuXHRDaGFydC5UeXBlID0gZnVuY3Rpb24oZGF0YSxvcHRpb25zLGNoYXJ0KXtcblx0XHR0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXHRcdHRoaXMuY2hhcnQgPSBjaGFydDtcblx0XHR0aGlzLmlkID0gdWlkKCk7XG5cdFx0Ly9BZGQgdGhlIGNoYXJ0IGluc3RhbmNlIHRvIHRoZSBnbG9iYWwgbmFtZXNwYWNlXG5cdFx0Q2hhcnQuaW5zdGFuY2VzW3RoaXMuaWRdID0gdGhpcztcblxuXHRcdC8vIEluaXRpYWxpemUgaXMgYWx3YXlzIGNhbGxlZCB3aGVuIGEgY2hhcnQgdHlwZSBpcyBjcmVhdGVkXG5cdFx0Ly8gQnkgZGVmYXVsdCBpdCBpcyBhIG5vIG9wLCBidXQgaXQgc2hvdWxkIGJlIGV4dGVuZGVkXG5cdFx0aWYgKG9wdGlvbnMucmVzcG9uc2l2ZSl7XG5cdFx0XHR0aGlzLnJlc2l6ZSgpO1xuXHRcdH1cblx0XHR0aGlzLmluaXRpYWxpemUuY2FsbCh0aGlzLGRhdGEpO1xuXHR9O1xuXG5cdC8vQ29yZSBtZXRob2RzIHRoYXQnbGwgYmUgYSBwYXJ0IG9mIGV2ZXJ5IGNoYXJ0IHR5cGVcblx0ZXh0ZW5kKENoYXJ0LlR5cGUucHJvdG90eXBlLHtcblx0XHRpbml0aWFsaXplIDogZnVuY3Rpb24oKXtyZXR1cm4gdGhpczt9LFxuXHRcdGNsZWFyIDogZnVuY3Rpb24oKXtcblx0XHRcdGNsZWFyKHRoaXMuY2hhcnQpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHRzdG9wIDogZnVuY3Rpb24oKXtcblx0XHRcdC8vIFN0b3BzIGFueSBjdXJyZW50IGFuaW1hdGlvbiBsb29wIG9jY3VyaW5nXG5cdFx0XHRjYW5jZWxBbmltRnJhbWUodGhpcy5hbmltYXRpb25GcmFtZSk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXHRcdHJlc2l6ZSA6IGZ1bmN0aW9uKGNhbGxiYWNrKXtcblx0XHRcdHRoaXMuc3RvcCgpO1xuXHRcdFx0dmFyIGNhbnZhcyA9IHRoaXMuY2hhcnQuY2FudmFzLFxuXHRcdFx0XHRuZXdXaWR0aCA9IGdldE1heGltdW1XaWR0aCh0aGlzLmNoYXJ0LmNhbnZhcyksXG5cdFx0XHRcdG5ld0hlaWdodCA9IHRoaXMub3B0aW9ucy5tYWludGFpbkFzcGVjdFJhdGlvID8gbmV3V2lkdGggLyB0aGlzLmNoYXJ0LmFzcGVjdFJhdGlvIDogZ2V0TWF4aW11bUhlaWdodCh0aGlzLmNoYXJ0LmNhbnZhcyk7XG5cblx0XHRcdGNhbnZhcy53aWR0aCA9IHRoaXMuY2hhcnQud2lkdGggPSBuZXdXaWR0aDtcblx0XHRcdGNhbnZhcy5oZWlnaHQgPSB0aGlzLmNoYXJ0LmhlaWdodCA9IG5ld0hlaWdodDtcblxuXHRcdFx0cmV0aW5hU2NhbGUodGhpcy5jaGFydCk7XG5cblx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIil7XG5cdFx0XHRcdGNhbGxiYWNrLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHRyZWZsb3cgOiBub29wLFxuXHRcdHJlbmRlciA6IGZ1bmN0aW9uKHJlZmxvdyl7XG5cdFx0XHRpZiAocmVmbG93KXtcblx0XHRcdFx0dGhpcy5yZWZsb3coKTtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uICYmICFyZWZsb3cpe1xuXHRcdFx0XHRoZWxwZXJzLmFuaW1hdGlvbkxvb3AoXG5cdFx0XHRcdFx0dGhpcy5kcmF3LFxuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5hbmltYXRpb25TdGVwcyxcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMuYW5pbWF0aW9uRWFzaW5nLFxuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5vbkFuaW1hdGlvblByb2dyZXNzLFxuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5vbkFuaW1hdGlvbkNvbXBsZXRlLFxuXHRcdFx0XHRcdHRoaXNcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHRoaXMuZHJhdygpO1xuXHRcdFx0XHR0aGlzLm9wdGlvbnMub25BbmltYXRpb25Db21wbGV0ZS5jYWxsKHRoaXMpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHRnZW5lcmF0ZUxlZ2VuZCA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGVtcGxhdGUodGhpcy5vcHRpb25zLmxlZ2VuZFRlbXBsYXRlLHRoaXMpO1xuXHRcdH0sXG5cdFx0ZGVzdHJveSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLmNsZWFyKCk7XG5cdFx0XHR1bmJpbmRFdmVudHModGhpcywgdGhpcy5ldmVudHMpO1xuXHRcdFx0dmFyIGNhbnZhcyA9IHRoaXMuY2hhcnQuY2FudmFzO1xuXG5cdFx0XHQvLyBSZXNldCBjYW52YXMgaGVpZ2h0L3dpZHRoIGF0dHJpYnV0ZXMgc3RhcnRzIGEgZnJlc2ggd2l0aCB0aGUgY2FudmFzIGNvbnRleHRcblx0XHRcdGNhbnZhcy53aWR0aCA9IHRoaXMuY2hhcnQud2lkdGg7XG5cdFx0XHRjYW52YXMuaGVpZ2h0ID0gdGhpcy5jaGFydC5oZWlnaHQ7XG5cblx0XHRcdC8vIDwgSUU5IGRvZXNuJ3Qgc3VwcG9ydCByZW1vdmVQcm9wZXJ0eVxuXHRcdFx0aWYgKGNhbnZhcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eSkge1xuXHRcdFx0XHRjYW52YXMuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ3dpZHRoJyk7XG5cdFx0XHRcdGNhbnZhcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnaGVpZ2h0Jyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjYW52YXMuc3R5bGUucmVtb3ZlQXR0cmlidXRlKCd3aWR0aCcpO1xuXHRcdFx0XHRjYW52YXMuc3R5bGUucmVtb3ZlQXR0cmlidXRlKCdoZWlnaHQnKTtcblx0XHRcdH1cblxuXHRcdFx0ZGVsZXRlIENoYXJ0Lmluc3RhbmNlc1t0aGlzLmlkXTtcblx0XHR9LFxuXHRcdHNob3dUb29sdGlwIDogZnVuY3Rpb24oQ2hhcnRFbGVtZW50cywgZm9yY2VSZWRyYXcpe1xuXHRcdFx0Ly8gT25seSByZWRyYXcgdGhlIGNoYXJ0IGlmIHdlJ3ZlIGFjdHVhbGx5IGNoYW5nZWQgd2hhdCB3ZSdyZSBob3ZlcmluZyBvbi5cblx0XHRcdGlmICh0eXBlb2YgdGhpcy5hY3RpdmVFbGVtZW50cyA9PT0gJ3VuZGVmaW5lZCcpIHRoaXMuYWN0aXZlRWxlbWVudHMgPSBbXTtcblxuXHRcdFx0dmFyIGlzQ2hhbmdlZCA9IChmdW5jdGlvbihFbGVtZW50cyl7XG5cdFx0XHRcdHZhciBjaGFuZ2VkID0gZmFsc2U7XG5cblx0XHRcdFx0aWYgKEVsZW1lbnRzLmxlbmd0aCAhPT0gdGhpcy5hY3RpdmVFbGVtZW50cy5sZW5ndGgpe1xuXHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRcdHJldHVybiBjaGFuZ2VkO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZWFjaChFbGVtZW50cywgZnVuY3Rpb24oZWxlbWVudCwgaW5kZXgpe1xuXHRcdFx0XHRcdGlmIChlbGVtZW50ICE9PSB0aGlzLmFjdGl2ZUVsZW1lbnRzW2luZGV4XSl7XG5cdFx0XHRcdFx0XHRjaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIHRoaXMpO1xuXHRcdFx0XHRyZXR1cm4gY2hhbmdlZDtcblx0XHRcdH0pLmNhbGwodGhpcywgQ2hhcnRFbGVtZW50cyk7XG5cblx0XHRcdGlmICghaXNDaGFuZ2VkICYmICFmb3JjZVJlZHJhdyl7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHRoaXMuYWN0aXZlRWxlbWVudHMgPSBDaGFydEVsZW1lbnRzO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5kcmF3KCk7XG5cdFx0XHRpZih0aGlzLm9wdGlvbnMuY3VzdG9tVG9vbHRpcHMpe1xuXHRcdFx0XHR0aGlzLm9wdGlvbnMuY3VzdG9tVG9vbHRpcHMoZmFsc2UpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKENoYXJ0RWxlbWVudHMubGVuZ3RoID4gMCl7XG5cdFx0XHRcdC8vIElmIHdlIGhhdmUgbXVsdGlwbGUgZGF0YXNldHMsIHNob3cgYSBNdWx0aVRvb2x0aXAgZm9yIGFsbCBvZiB0aGUgZGF0YSBwb2ludHMgYXQgdGhhdCBpbmRleFxuXHRcdFx0XHRpZiAodGhpcy5kYXRhc2V0cyAmJiB0aGlzLmRhdGFzZXRzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHR2YXIgZGF0YUFycmF5LFxuXHRcdFx0XHRcdFx0ZGF0YUluZGV4O1xuXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IHRoaXMuZGF0YXNldHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0XHRcdGRhdGFBcnJheSA9IHRoaXMuZGF0YXNldHNbaV0ucG9pbnRzIHx8IHRoaXMuZGF0YXNldHNbaV0uYmFycyB8fCB0aGlzLmRhdGFzZXRzW2ldLnNlZ21lbnRzO1xuXHRcdFx0XHRcdFx0ZGF0YUluZGV4ID0gaW5kZXhPZihkYXRhQXJyYXksIENoYXJ0RWxlbWVudHNbMF0pO1xuXHRcdFx0XHRcdFx0aWYgKGRhdGFJbmRleCAhPT0gLTEpe1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFyIHRvb2x0aXBMYWJlbHMgPSBbXSxcblx0XHRcdFx0XHRcdHRvb2x0aXBDb2xvcnMgPSBbXSxcblx0XHRcdFx0XHRcdG1lZGlhblBvc2l0aW9uID0gKGZ1bmN0aW9uKGluZGV4KSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gR2V0IGFsbCB0aGUgcG9pbnRzIGF0IHRoYXQgcGFydGljdWxhciBpbmRleFxuXHRcdFx0XHRcdFx0XHR2YXIgRWxlbWVudHMgPSBbXSxcblx0XHRcdFx0XHRcdFx0XHRkYXRhQ29sbGVjdGlvbixcblx0XHRcdFx0XHRcdFx0XHR4UG9zaXRpb25zID0gW10sXG5cdFx0XHRcdFx0XHRcdFx0eVBvc2l0aW9ucyA9IFtdLFxuXHRcdFx0XHRcdFx0XHRcdHhNYXgsXG5cdFx0XHRcdFx0XHRcdFx0eU1heCxcblx0XHRcdFx0XHRcdFx0XHR4TWluLFxuXHRcdFx0XHRcdFx0XHRcdHlNaW47XG5cdFx0XHRcdFx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmRhdGFzZXRzLCBmdW5jdGlvbihkYXRhc2V0KXtcblx0XHRcdFx0XHRcdFx0XHRkYXRhQ29sbGVjdGlvbiA9IGRhdGFzZXQucG9pbnRzIHx8IGRhdGFzZXQuYmFycyB8fCBkYXRhc2V0LnNlZ21lbnRzO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkYXRhQ29sbGVjdGlvbltkYXRhSW5kZXhdICYmIGRhdGFDb2xsZWN0aW9uW2RhdGFJbmRleF0uaGFzVmFsdWUoKSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRFbGVtZW50cy5wdXNoKGRhdGFDb2xsZWN0aW9uW2RhdGFJbmRleF0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0aGVscGVycy5lYWNoKEVsZW1lbnRzLCBmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0XHRcdFx0XHRcdFx0eFBvc2l0aW9ucy5wdXNoKGVsZW1lbnQueCk7XG5cdFx0XHRcdFx0XHRcdFx0eVBvc2l0aW9ucy5wdXNoKGVsZW1lbnQueSk7XG5cblxuXHRcdFx0XHRcdFx0XHRcdC8vSW5jbHVkZSBhbnkgY29sb3VyIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbGVtZW50XG5cdFx0XHRcdFx0XHRcdFx0dG9vbHRpcExhYmVscy5wdXNoKGhlbHBlcnMudGVtcGxhdGUodGhpcy5vcHRpb25zLm11bHRpVG9vbHRpcFRlbXBsYXRlLCBlbGVtZW50KSk7XG5cdFx0XHRcdFx0XHRcdFx0dG9vbHRpcENvbG9ycy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0XHRcdGZpbGw6IGVsZW1lbnQuX3NhdmVkLmZpbGxDb2xvciB8fCBlbGVtZW50LmZpbGxDb2xvcixcblx0XHRcdFx0XHRcdFx0XHRcdHN0cm9rZTogZWxlbWVudC5fc2F2ZWQuc3Ryb2tlQ29sb3IgfHwgZWxlbWVudC5zdHJva2VDb2xvclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdH0sIHRoaXMpO1xuXG5cdFx0XHRcdFx0XHRcdHlNaW4gPSBtaW4oeVBvc2l0aW9ucyk7XG5cdFx0XHRcdFx0XHRcdHlNYXggPSBtYXgoeVBvc2l0aW9ucyk7XG5cblx0XHRcdFx0XHRcdFx0eE1pbiA9IG1pbih4UG9zaXRpb25zKTtcblx0XHRcdFx0XHRcdFx0eE1heCA9IG1heCh4UG9zaXRpb25zKTtcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdHg6ICh4TWluID4gdGhpcy5jaGFydC53aWR0aC8yKSA/IHhNaW4gOiB4TWF4LFxuXHRcdFx0XHRcdFx0XHRcdHk6ICh5TWluICsgeU1heCkvMlxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fSkuY2FsbCh0aGlzLCBkYXRhSW5kZXgpO1xuXG5cdFx0XHRcdFx0bmV3IENoYXJ0Lk11bHRpVG9vbHRpcCh7XG5cdFx0XHRcdFx0XHR4OiBtZWRpYW5Qb3NpdGlvbi54LFxuXHRcdFx0XHRcdFx0eTogbWVkaWFuUG9zaXRpb24ueSxcblx0XHRcdFx0XHRcdHhQYWRkaW5nOiB0aGlzLm9wdGlvbnMudG9vbHRpcFhQYWRkaW5nLFxuXHRcdFx0XHRcdFx0eVBhZGRpbmc6IHRoaXMub3B0aW9ucy50b29sdGlwWVBhZGRpbmcsXG5cdFx0XHRcdFx0XHR4T2Zmc2V0OiB0aGlzLm9wdGlvbnMudG9vbHRpcFhPZmZzZXQsXG5cdFx0XHRcdFx0XHRmaWxsQ29sb3I6IHRoaXMub3B0aW9ucy50b29sdGlwRmlsbENvbG9yLFxuXHRcdFx0XHRcdFx0dGV4dENvbG9yOiB0aGlzLm9wdGlvbnMudG9vbHRpcEZvbnRDb2xvcixcblx0XHRcdFx0XHRcdGZvbnRGYW1pbHk6IHRoaXMub3B0aW9ucy50b29sdGlwRm9udEZhbWlseSxcblx0XHRcdFx0XHRcdGZvbnRTdHlsZTogdGhpcy5vcHRpb25zLnRvb2x0aXBGb250U3R5bGUsXG5cdFx0XHRcdFx0XHRmb250U2l6ZTogdGhpcy5vcHRpb25zLnRvb2x0aXBGb250U2l6ZSxcblx0XHRcdFx0XHRcdHRpdGxlVGV4dENvbG9yOiB0aGlzLm9wdGlvbnMudG9vbHRpcFRpdGxlRm9udENvbG9yLFxuXHRcdFx0XHRcdFx0dGl0bGVGb250RmFtaWx5OiB0aGlzLm9wdGlvbnMudG9vbHRpcFRpdGxlRm9udEZhbWlseSxcblx0XHRcdFx0XHRcdHRpdGxlRm9udFN0eWxlOiB0aGlzLm9wdGlvbnMudG9vbHRpcFRpdGxlRm9udFN0eWxlLFxuXHRcdFx0XHRcdFx0dGl0bGVGb250U2l6ZTogdGhpcy5vcHRpb25zLnRvb2x0aXBUaXRsZUZvbnRTaXplLFxuXHRcdFx0XHRcdFx0Y29ybmVyUmFkaXVzOiB0aGlzLm9wdGlvbnMudG9vbHRpcENvcm5lclJhZGl1cyxcblx0XHRcdFx0XHRcdGxhYmVsczogdG9vbHRpcExhYmVscyxcblx0XHRcdFx0XHRcdGxlZ2VuZENvbG9yczogdG9vbHRpcENvbG9ycyxcblx0XHRcdFx0XHRcdGxlZ2VuZENvbG9yQmFja2dyb3VuZCA6IHRoaXMub3B0aW9ucy5tdWx0aVRvb2x0aXBLZXlCYWNrZ3JvdW5kLFxuXHRcdFx0XHRcdFx0dGl0bGU6IENoYXJ0RWxlbWVudHNbMF0ubGFiZWwsXG5cdFx0XHRcdFx0XHRjaGFydDogdGhpcy5jaGFydCxcblx0XHRcdFx0XHRcdGN0eDogdGhpcy5jaGFydC5jdHgsXG5cdFx0XHRcdFx0XHRjdXN0b206IHRoaXMub3B0aW9ucy5jdXN0b21Ub29sdGlwc1xuXHRcdFx0XHRcdH0pLmRyYXcoKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGVhY2goQ2hhcnRFbGVtZW50cywgZnVuY3Rpb24oRWxlbWVudCkge1xuXHRcdFx0XHRcdFx0dmFyIHRvb2x0aXBQb3NpdGlvbiA9IEVsZW1lbnQudG9vbHRpcFBvc2l0aW9uKCk7XG5cdFx0XHRcdFx0XHRuZXcgQ2hhcnQuVG9vbHRpcCh7XG5cdFx0XHRcdFx0XHRcdHg6IE1hdGgucm91bmQodG9vbHRpcFBvc2l0aW9uLngpLFxuXHRcdFx0XHRcdFx0XHR5OiBNYXRoLnJvdW5kKHRvb2x0aXBQb3NpdGlvbi55KSxcblx0XHRcdFx0XHRcdFx0eFBhZGRpbmc6IHRoaXMub3B0aW9ucy50b29sdGlwWFBhZGRpbmcsXG5cdFx0XHRcdFx0XHRcdHlQYWRkaW5nOiB0aGlzLm9wdGlvbnMudG9vbHRpcFlQYWRkaW5nLFxuXHRcdFx0XHRcdFx0XHRmaWxsQ29sb3I6IHRoaXMub3B0aW9ucy50b29sdGlwRmlsbENvbG9yLFxuXHRcdFx0XHRcdFx0XHR0ZXh0Q29sb3I6IHRoaXMub3B0aW9ucy50b29sdGlwRm9udENvbG9yLFxuXHRcdFx0XHRcdFx0XHRmb250RmFtaWx5OiB0aGlzLm9wdGlvbnMudG9vbHRpcEZvbnRGYW1pbHksXG5cdFx0XHRcdFx0XHRcdGZvbnRTdHlsZTogdGhpcy5vcHRpb25zLnRvb2x0aXBGb250U3R5bGUsXG5cdFx0XHRcdFx0XHRcdGZvbnRTaXplOiB0aGlzLm9wdGlvbnMudG9vbHRpcEZvbnRTaXplLFxuXHRcdFx0XHRcdFx0XHRjYXJldEhlaWdodDogdGhpcy5vcHRpb25zLnRvb2x0aXBDYXJldFNpemUsXG5cdFx0XHRcdFx0XHRcdGNvcm5lclJhZGl1czogdGhpcy5vcHRpb25zLnRvb2x0aXBDb3JuZXJSYWRpdXMsXG5cdFx0XHRcdFx0XHRcdHRleHQ6IHRlbXBsYXRlKHRoaXMub3B0aW9ucy50b29sdGlwVGVtcGxhdGUsIEVsZW1lbnQpLFxuXHRcdFx0XHRcdFx0XHRjaGFydDogdGhpcy5jaGFydCxcblx0XHRcdFx0XHRcdFx0Y3VzdG9tOiB0aGlzLm9wdGlvbnMuY3VzdG9tVG9vbHRpcHNcblx0XHRcdFx0XHRcdH0pLmRyYXcoKTtcblx0XHRcdFx0XHR9LCB0aGlzKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHR0b0Jhc2U2NEltYWdlIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB0aGlzLmNoYXJ0LmNhbnZhcy50b0RhdGFVUkwuYXBwbHkodGhpcy5jaGFydC5jYW52YXMsIGFyZ3VtZW50cyk7XG5cdFx0fVxuXHR9KTtcblxuXHRDaGFydC5UeXBlLmV4dGVuZCA9IGZ1bmN0aW9uKGV4dGVuc2lvbnMpe1xuXG5cdFx0dmFyIHBhcmVudCA9IHRoaXM7XG5cblx0XHR2YXIgQ2hhcnRUeXBlID0gZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBwYXJlbnQuYXBwbHkodGhpcyxhcmd1bWVudHMpO1xuXHRcdH07XG5cblx0XHQvL0NvcHkgdGhlIHByb3RvdHlwZSBvYmplY3Qgb2YgdGhlIHRoaXMgY2xhc3Ncblx0XHRDaGFydFR5cGUucHJvdG90eXBlID0gY2xvbmUocGFyZW50LnByb3RvdHlwZSk7XG5cdFx0Ly9Ob3cgb3ZlcndyaXRlIHNvbWUgb2YgdGhlIHByb3BlcnRpZXMgaW4gdGhlIGJhc2UgY2xhc3Mgd2l0aCB0aGUgbmV3IGV4dGVuc2lvbnNcblx0XHRleHRlbmQoQ2hhcnRUeXBlLnByb3RvdHlwZSwgZXh0ZW5zaW9ucyk7XG5cblx0XHRDaGFydFR5cGUuZXh0ZW5kID0gQ2hhcnQuVHlwZS5leHRlbmQ7XG5cblx0XHRpZiAoZXh0ZW5zaW9ucy5uYW1lIHx8IHBhcmVudC5wcm90b3R5cGUubmFtZSl7XG5cblx0XHRcdHZhciBjaGFydE5hbWUgPSBleHRlbnNpb25zLm5hbWUgfHwgcGFyZW50LnByb3RvdHlwZS5uYW1lO1xuXHRcdFx0Ly9Bc3NpZ24gYW55IHBvdGVudGlhbCBkZWZhdWx0IHZhbHVlcyBvZiB0aGUgbmV3IGNoYXJ0IHR5cGVcblxuXHRcdFx0Ly9JZiBub25lIGFyZSBkZWZpbmVkLCB3ZSdsbCB1c2UgYSBjbG9uZSBvZiB0aGUgY2hhcnQgdHlwZSB0aGlzIGlzIGJlaW5nIGV4dGVuZGVkIGZyb20uXG5cdFx0XHQvL0kuZS4gaWYgd2UgZXh0ZW5kIGEgbGluZSBjaGFydCwgd2UnbGwgdXNlIHRoZSBkZWZhdWx0cyBmcm9tIHRoZSBsaW5lIGNoYXJ0IGlmIG91ciBuZXcgY2hhcnRcblx0XHRcdC8vZG9lc24ndCBkZWZpbmUgc29tZSBkZWZhdWx0cyBvZiB0aGVpciBvd24uXG5cblx0XHRcdHZhciBiYXNlRGVmYXVsdHMgPSAoQ2hhcnQuZGVmYXVsdHNbcGFyZW50LnByb3RvdHlwZS5uYW1lXSkgPyBjbG9uZShDaGFydC5kZWZhdWx0c1twYXJlbnQucHJvdG90eXBlLm5hbWVdKSA6IHt9O1xuXG5cdFx0XHRDaGFydC5kZWZhdWx0c1tjaGFydE5hbWVdID0gZXh0ZW5kKGJhc2VEZWZhdWx0cyxleHRlbnNpb25zLmRlZmF1bHRzKTtcblxuXHRcdFx0Q2hhcnQudHlwZXNbY2hhcnROYW1lXSA9IENoYXJ0VHlwZTtcblxuXHRcdFx0Ly9SZWdpc3RlciB0aGlzIG5ldyBjaGFydCB0eXBlIGluIHRoZSBDaGFydCBwcm90b3R5cGVcblx0XHRcdENoYXJ0LnByb3RvdHlwZVtjaGFydE5hbWVdID0gZnVuY3Rpb24oZGF0YSxvcHRpb25zKXtcblx0XHRcdFx0dmFyIGNvbmZpZyA9IG1lcmdlKENoYXJ0LmRlZmF1bHRzLmdsb2JhbCwgQ2hhcnQuZGVmYXVsdHNbY2hhcnROYW1lXSwgb3B0aW9ucyB8fCB7fSk7XG5cdFx0XHRcdHJldHVybiBuZXcgQ2hhcnRUeXBlKGRhdGEsY29uZmlnLHRoaXMpO1xuXHRcdFx0fTtcblx0XHR9IGVsc2V7XG5cdFx0XHR3YXJuKFwiTmFtZSBub3QgcHJvdmlkZWQgZm9yIHRoaXMgY2hhcnQsIHNvIGl0IGhhc24ndCBiZWVuIHJlZ2lzdGVyZWRcIik7XG5cdFx0fVxuXHRcdHJldHVybiBwYXJlbnQ7XG5cdH07XG5cblx0Q2hhcnQuRWxlbWVudCA9IGZ1bmN0aW9uKGNvbmZpZ3VyYXRpb24pe1xuXHRcdGV4dGVuZCh0aGlzLGNvbmZpZ3VyYXRpb24pO1xuXHRcdHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XG5cdFx0dGhpcy5zYXZlKCk7XG5cdH07XG5cdGV4dGVuZChDaGFydC5FbGVtZW50LnByb3RvdHlwZSx7XG5cdFx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKCl7fSxcblx0XHRyZXN0b3JlIDogZnVuY3Rpb24ocHJvcHMpe1xuXHRcdFx0aWYgKCFwcm9wcyl7XG5cdFx0XHRcdGV4dGVuZCh0aGlzLHRoaXMuX3NhdmVkKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVhY2gocHJvcHMsZnVuY3Rpb24oa2V5KXtcblx0XHRcdFx0XHR0aGlzW2tleV0gPSB0aGlzLl9zYXZlZFtrZXldO1xuXHRcdFx0XHR9LHRoaXMpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHRzYXZlIDogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuX3NhdmVkID0gY2xvbmUodGhpcyk7XG5cdFx0XHRkZWxldGUgdGhpcy5fc2F2ZWQuX3NhdmVkO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHR1cGRhdGUgOiBmdW5jdGlvbihuZXdQcm9wcyl7XG5cdFx0XHRlYWNoKG5ld1Byb3BzLGZ1bmN0aW9uKHZhbHVlLGtleSl7XG5cdFx0XHRcdHRoaXMuX3NhdmVkW2tleV0gPSB0aGlzW2tleV07XG5cdFx0XHRcdHRoaXNba2V5XSA9IHZhbHVlO1xuXHRcdFx0fSx0aGlzKTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cdFx0dHJhbnNpdGlvbiA6IGZ1bmN0aW9uKHByb3BzLGVhc2Upe1xuXHRcdFx0ZWFjaChwcm9wcyxmdW5jdGlvbih2YWx1ZSxrZXkpe1xuXHRcdFx0XHR0aGlzW2tleV0gPSAoKHZhbHVlIC0gdGhpcy5fc2F2ZWRba2V5XSkgKiBlYXNlKSArIHRoaXMuX3NhdmVkW2tleV07XG5cdFx0XHR9LHRoaXMpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHR0b29sdGlwUG9zaXRpb24gOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0eCA6IHRoaXMueCxcblx0XHRcdFx0eSA6IHRoaXMueVxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGhhc1ZhbHVlOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIGlzTnVtYmVyKHRoaXMudmFsdWUpO1xuXHRcdH1cblx0fSk7XG5cblx0Q2hhcnQuRWxlbWVudC5leHRlbmQgPSBpbmhlcml0cztcblxuXG5cdENoYXJ0LlBvaW50ID0gQ2hhcnQuRWxlbWVudC5leHRlbmQoe1xuXHRcdGRpc3BsYXk6IHRydWUsXG5cdFx0aW5SYW5nZTogZnVuY3Rpb24oY2hhcnRYLGNoYXJ0WSl7XG5cdFx0XHR2YXIgaGl0RGV0ZWN0aW9uUmFuZ2UgPSB0aGlzLmhpdERldGVjdGlvblJhZGl1cyArIHRoaXMucmFkaXVzO1xuXHRcdFx0cmV0dXJuICgoTWF0aC5wb3coY2hhcnRYLXRoaXMueCwgMikrTWF0aC5wb3coY2hhcnRZLXRoaXMueSwgMikpIDwgTWF0aC5wb3coaGl0RGV0ZWN0aW9uUmFuZ2UsMikpO1xuXHRcdH0sXG5cdFx0ZHJhdyA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAodGhpcy5kaXNwbGF5KXtcblx0XHRcdFx0dmFyIGN0eCA9IHRoaXMuY3R4O1xuXHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cblx0XHRcdFx0Y3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIDAsIE1hdGguUEkqMik7XG5cdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblxuXHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnN0cm9rZUNvbG9yO1xuXHRcdFx0XHRjdHgubGluZVdpZHRoID0gdGhpcy5zdHJva2VXaWR0aDtcblxuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy5maWxsQ29sb3I7XG5cblx0XHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdFx0fVxuXG5cblx0XHRcdC8vUXVpY2sgZGVidWcgZm9yIGJlemllciBjdXJ2ZSBzcGxpbmluZ1xuXHRcdFx0Ly9IaWdobGlnaHRzIGNvbnRyb2wgcG9pbnRzIGFuZCB0aGUgbGluZSBiZXR3ZWVuIHRoZW0uXG5cdFx0XHQvL0hhbmR5IGZvciBkZXYgLSBzdHJpcHBlZCBpbiB0aGUgbWluIHZlcnNpb24uXG5cblx0XHRcdC8vIGN0eC5zYXZlKCk7XG5cdFx0XHQvLyBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xuXHRcdFx0Ly8gY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiXG5cdFx0XHQvLyBjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHQvLyBjdHguYXJjKHRoaXMuY29udHJvbFBvaW50cy5pbm5lci54LHRoaXMuY29udHJvbFBvaW50cy5pbm5lci55LCAyLCAwLCBNYXRoLlBJKjIpO1xuXHRcdFx0Ly8gY3R4LmZpbGwoKTtcblxuXHRcdFx0Ly8gY3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0Ly8gY3R4LmFyYyh0aGlzLmNvbnRyb2xQb2ludHMub3V0ZXIueCx0aGlzLmNvbnRyb2xQb2ludHMub3V0ZXIueSwgMiwgMCwgTWF0aC5QSSoyKTtcblx0XHRcdC8vIGN0eC5maWxsKCk7XG5cblx0XHRcdC8vIGN0eC5tb3ZlVG8odGhpcy5jb250cm9sUG9pbnRzLmlubmVyLngsdGhpcy5jb250cm9sUG9pbnRzLmlubmVyLnkpO1xuXHRcdFx0Ly8gY3R4LmxpbmVUbyh0aGlzLngsIHRoaXMueSk7XG5cdFx0XHQvLyBjdHgubGluZVRvKHRoaXMuY29udHJvbFBvaW50cy5vdXRlci54LHRoaXMuY29udHJvbFBvaW50cy5vdXRlci55KTtcblx0XHRcdC8vIGN0eC5zdHJva2UoKTtcblxuXHRcdFx0Ly8gY3R4LnJlc3RvcmUoKTtcblxuXG5cblx0XHR9XG5cdH0pO1xuXG5cdENoYXJ0LkFyYyA9IENoYXJ0LkVsZW1lbnQuZXh0ZW5kKHtcblx0XHRpblJhbmdlIDogZnVuY3Rpb24oY2hhcnRYLGNoYXJ0WSl7XG5cblx0XHRcdHZhciBwb2ludFJlbGF0aXZlUG9zaXRpb24gPSBoZWxwZXJzLmdldEFuZ2xlRnJvbVBvaW50KHRoaXMsIHtcblx0XHRcdFx0eDogY2hhcnRYLFxuXHRcdFx0XHR5OiBjaGFydFlcblx0XHRcdH0pO1xuXG5cdFx0XHQvL0NoZWNrIGlmIHdpdGhpbiB0aGUgcmFuZ2Ugb2YgdGhlIG9wZW4vY2xvc2UgYW5nbGVcblx0XHRcdHZhciBiZXR3ZWVuQW5nbGVzID0gKHBvaW50UmVsYXRpdmVQb3NpdGlvbi5hbmdsZSA+PSB0aGlzLnN0YXJ0QW5nbGUgJiYgcG9pbnRSZWxhdGl2ZVBvc2l0aW9uLmFuZ2xlIDw9IHRoaXMuZW5kQW5nbGUpLFxuXHRcdFx0XHR3aXRoaW5SYWRpdXMgPSAocG9pbnRSZWxhdGl2ZVBvc2l0aW9uLmRpc3RhbmNlID49IHRoaXMuaW5uZXJSYWRpdXMgJiYgcG9pbnRSZWxhdGl2ZVBvc2l0aW9uLmRpc3RhbmNlIDw9IHRoaXMub3V0ZXJSYWRpdXMpO1xuXG5cdFx0XHRyZXR1cm4gKGJldHdlZW5BbmdsZXMgJiYgd2l0aGluUmFkaXVzKTtcblx0XHRcdC8vRW5zdXJlIHdpdGhpbiB0aGUgb3V0c2lkZSBvZiB0aGUgYXJjIGNlbnRyZSwgYnV0IGluc2lkZSBhcmMgb3V0ZXJcblx0XHR9LFxuXHRcdHRvb2x0aXBQb3NpdGlvbiA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgY2VudHJlQW5nbGUgPSB0aGlzLnN0YXJ0QW5nbGUgKyAoKHRoaXMuZW5kQW5nbGUgLSB0aGlzLnN0YXJ0QW5nbGUpIC8gMiksXG5cdFx0XHRcdHJhbmdlRnJvbUNlbnRyZSA9ICh0aGlzLm91dGVyUmFkaXVzIC0gdGhpcy5pbm5lclJhZGl1cykgLyAyICsgdGhpcy5pbm5lclJhZGl1cztcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHggOiB0aGlzLnggKyAoTWF0aC5jb3MoY2VudHJlQW5nbGUpICogcmFuZ2VGcm9tQ2VudHJlKSxcblx0XHRcdFx0eSA6IHRoaXMueSArIChNYXRoLnNpbihjZW50cmVBbmdsZSkgKiByYW5nZUZyb21DZW50cmUpXG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0ZHJhdyA6IGZ1bmN0aW9uKGFuaW1hdGlvblBlcmNlbnQpe1xuXG5cdFx0XHR2YXIgZWFzaW5nRGVjaW1hbCA9IGFuaW1hdGlvblBlcmNlbnQgfHwgMTtcblxuXHRcdFx0dmFyIGN0eCA9IHRoaXMuY3R4O1xuXG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cblx0XHRcdGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMub3V0ZXJSYWRpdXMsIHRoaXMuc3RhcnRBbmdsZSwgdGhpcy5lbmRBbmdsZSk7XG5cblx0XHRcdGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMuaW5uZXJSYWRpdXMsIHRoaXMuZW5kQW5nbGUsIHRoaXMuc3RhcnRBbmdsZSwgdHJ1ZSk7XG5cblx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuc3Ryb2tlQ29sb3I7XG5cdFx0XHRjdHgubGluZVdpZHRoID0gdGhpcy5zdHJva2VXaWR0aDtcblxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlsbENvbG9yO1xuXG5cdFx0XHRjdHguZmlsbCgpO1xuXHRcdFx0Y3R4LmxpbmVKb2luID0gJ2JldmVsJztcblxuXHRcdFx0aWYgKHRoaXMuc2hvd1N0cm9rZSl7XG5cdFx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdENoYXJ0LlJlY3RhbmdsZSA9IENoYXJ0LkVsZW1lbnQuZXh0ZW5kKHtcblx0XHRkcmF3IDogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBjdHggPSB0aGlzLmN0eCxcblx0XHRcdFx0aGFsZldpZHRoID0gdGhpcy53aWR0aC8yLFxuXHRcdFx0XHRsZWZ0WCA9IHRoaXMueCAtIGhhbGZXaWR0aCxcblx0XHRcdFx0cmlnaHRYID0gdGhpcy54ICsgaGFsZldpZHRoLFxuXHRcdFx0XHR0b3AgPSB0aGlzLmJhc2UgLSAodGhpcy5iYXNlIC0gdGhpcy55KSxcblx0XHRcdFx0aGFsZlN0cm9rZSA9IHRoaXMuc3Ryb2tlV2lkdGggLyAyO1xuXG5cdFx0XHQvLyBDYW52YXMgZG9lc24ndCBhbGxvdyB1cyB0byBzdHJva2UgaW5zaWRlIHRoZSB3aWR0aCBzbyB3ZSBjYW5cblx0XHRcdC8vIGFkanVzdCB0aGUgc2l6ZXMgdG8gZml0IGlmIHdlJ3JlIHNldHRpbmcgYSBzdHJva2Ugb24gdGhlIGxpbmVcblx0XHRcdGlmICh0aGlzLnNob3dTdHJva2Upe1xuXHRcdFx0XHRsZWZ0WCArPSBoYWxmU3Ryb2tlO1xuXHRcdFx0XHRyaWdodFggLT0gaGFsZlN0cm9rZTtcblx0XHRcdFx0dG9wICs9IGhhbGZTdHJva2U7XG5cdFx0XHR9XG5cblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlsbENvbG9yO1xuXHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gdGhpcy5zdHJva2VDb2xvcjtcblx0XHRcdGN0eC5saW5lV2lkdGggPSB0aGlzLnN0cm9rZVdpZHRoO1xuXG5cdFx0XHQvLyBJdCdkIGJlIG5pY2UgdG8ga2VlcCB0aGlzIGNsYXNzIHRvdGFsbHkgZ2VuZXJpYyB0byBhbnkgcmVjdGFuZ2xlXG5cdFx0XHQvLyBhbmQgc2ltcGx5IHNwZWNpZnkgd2hpY2ggYm9yZGVyIHRvIG1pc3Mgb3V0LlxuXHRcdFx0Y3R4Lm1vdmVUbyhsZWZ0WCwgdGhpcy5iYXNlKTtcblx0XHRcdGN0eC5saW5lVG8obGVmdFgsIHRvcCk7XG5cdFx0XHRjdHgubGluZVRvKHJpZ2h0WCwgdG9wKTtcblx0XHRcdGN0eC5saW5lVG8ocmlnaHRYLCB0aGlzLmJhc2UpO1xuXHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdGlmICh0aGlzLnNob3dTdHJva2Upe1xuXHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoZWlnaHQgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHRoaXMuYmFzZSAtIHRoaXMueTtcblx0XHR9LFxuXHRcdGluUmFuZ2UgOiBmdW5jdGlvbihjaGFydFgsY2hhcnRZKXtcblx0XHRcdHJldHVybiAoY2hhcnRYID49IHRoaXMueCAtIHRoaXMud2lkdGgvMiAmJiBjaGFydFggPD0gdGhpcy54ICsgdGhpcy53aWR0aC8yKSAmJiAoY2hhcnRZID49IHRoaXMueSAmJiBjaGFydFkgPD0gdGhpcy5iYXNlKTtcblx0XHR9XG5cdH0pO1xuXG5cdENoYXJ0LlRvb2x0aXAgPSBDaGFydC5FbGVtZW50LmV4dGVuZCh7XG5cdFx0ZHJhdyA6IGZ1bmN0aW9uKCl7XG5cblx0XHRcdHZhciBjdHggPSB0aGlzLmNoYXJ0LmN0eDtcblxuXHRcdFx0Y3R4LmZvbnQgPSBmb250U3RyaW5nKHRoaXMuZm9udFNpemUsdGhpcy5mb250U3R5bGUsdGhpcy5mb250RmFtaWx5KTtcblxuXHRcdFx0dGhpcy54QWxpZ24gPSBcImNlbnRlclwiO1xuXHRcdFx0dGhpcy55QWxpZ24gPSBcImFib3ZlXCI7XG5cblx0XHRcdC8vRGlzdGFuY2UgYmV0d2VlbiB0aGUgYWN0dWFsIGVsZW1lbnQueSBwb3NpdGlvbiBhbmQgdGhlIHN0YXJ0IG9mIHRoZSB0b29sdGlwIGNhcmV0XG5cdFx0XHR2YXIgY2FyZXRQYWRkaW5nID0gdGhpcy5jYXJldFBhZGRpbmcgPSAyO1xuXG5cdFx0XHR2YXIgdG9vbHRpcFdpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KHRoaXMudGV4dCkud2lkdGggKyAyKnRoaXMueFBhZGRpbmcsXG5cdFx0XHRcdHRvb2x0aXBSZWN0SGVpZ2h0ID0gdGhpcy5mb250U2l6ZSArIDIqdGhpcy55UGFkZGluZyxcblx0XHRcdFx0dG9vbHRpcEhlaWdodCA9IHRvb2x0aXBSZWN0SGVpZ2h0ICsgdGhpcy5jYXJldEhlaWdodCArIGNhcmV0UGFkZGluZztcblxuXHRcdFx0aWYgKHRoaXMueCArIHRvb2x0aXBXaWR0aC8yID50aGlzLmNoYXJ0LndpZHRoKXtcblx0XHRcdFx0dGhpcy54QWxpZ24gPSBcImxlZnRcIjtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy54IC0gdG9vbHRpcFdpZHRoLzIgPCAwKXtcblx0XHRcdFx0dGhpcy54QWxpZ24gPSBcInJpZ2h0XCI7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLnkgLSB0b29sdGlwSGVpZ2h0IDwgMCl7XG5cdFx0XHRcdHRoaXMueUFsaWduID0gXCJiZWxvd1wiO1xuXHRcdFx0fVxuXG5cblx0XHRcdHZhciB0b29sdGlwWCA9IHRoaXMueCAtIHRvb2x0aXBXaWR0aC8yLFxuXHRcdFx0XHR0b29sdGlwWSA9IHRoaXMueSAtIHRvb2x0aXBIZWlnaHQ7XG5cblx0XHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLmZpbGxDb2xvcjtcblxuXHRcdFx0Ly8gQ3VzdG9tIFRvb2x0aXBzXG5cdFx0XHRpZih0aGlzLmN1c3RvbSl7XG5cdFx0XHRcdHRoaXMuY3VzdG9tKHRoaXMpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0c3dpdGNoKHRoaXMueUFsaWduKVxuXHRcdFx0XHR7XG5cdFx0XHRcdGNhc2UgXCJhYm92ZVwiOlxuXHRcdFx0XHRcdC8vRHJhdyBhIGNhcmV0IGFib3ZlIHRoZSB4L3lcblx0XHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdFx0Y3R4Lm1vdmVUbyh0aGlzLngsdGhpcy55IC0gY2FyZXRQYWRkaW5nKTtcblx0XHRcdFx0XHRjdHgubGluZVRvKHRoaXMueCArIHRoaXMuY2FyZXRIZWlnaHQsIHRoaXMueSAtIChjYXJldFBhZGRpbmcgKyB0aGlzLmNhcmV0SGVpZ2h0KSk7XG5cdFx0XHRcdFx0Y3R4LmxpbmVUbyh0aGlzLnggLSB0aGlzLmNhcmV0SGVpZ2h0LCB0aGlzLnkgLSAoY2FyZXRQYWRkaW5nICsgdGhpcy5jYXJldEhlaWdodCkpO1xuXHRcdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0XHRjdHguZmlsbCgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiYmVsb3dcIjpcblx0XHRcdFx0XHR0b29sdGlwWSA9IHRoaXMueSArIGNhcmV0UGFkZGluZyArIHRoaXMuY2FyZXRIZWlnaHQ7XG5cdFx0XHRcdFx0Ly9EcmF3IGEgY2FyZXQgYmVsb3cgdGhlIHgveVxuXHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHRjdHgubW92ZVRvKHRoaXMueCwgdGhpcy55ICsgY2FyZXRQYWRkaW5nKTtcblx0XHRcdFx0XHRjdHgubGluZVRvKHRoaXMueCArIHRoaXMuY2FyZXRIZWlnaHQsIHRoaXMueSArIGNhcmV0UGFkZGluZyArIHRoaXMuY2FyZXRIZWlnaHQpO1xuXHRcdFx0XHRcdGN0eC5saW5lVG8odGhpcy54IC0gdGhpcy5jYXJldEhlaWdodCwgdGhpcy55ICsgY2FyZXRQYWRkaW5nICsgdGhpcy5jYXJldEhlaWdodCk7XG5cdFx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdFx0XHRcdGN0eC5maWxsKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzd2l0Y2godGhpcy54QWxpZ24pXG5cdFx0XHRcdHtcblx0XHRcdFx0Y2FzZSBcImxlZnRcIjpcblx0XHRcdFx0XHR0b29sdGlwWCA9IHRoaXMueCAtIHRvb2x0aXBXaWR0aCArICh0aGlzLmNvcm5lclJhZGl1cyArIHRoaXMuY2FyZXRIZWlnaHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwicmlnaHRcIjpcblx0XHRcdFx0XHR0b29sdGlwWCA9IHRoaXMueCAtICh0aGlzLmNvcm5lclJhZGl1cyArIHRoaXMuY2FyZXRIZWlnaHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZHJhd1JvdW5kZWRSZWN0YW5nbGUoY3R4LHRvb2x0aXBYLHRvb2x0aXBZLHRvb2x0aXBXaWR0aCx0b29sdGlwUmVjdEhlaWdodCx0aGlzLmNvcm5lclJhZGl1cyk7XG5cblx0XHRcdFx0Y3R4LmZpbGwoKTtcblxuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy50ZXh0Q29sb3I7XG5cdFx0XHRcdGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuXHRcdFx0XHRjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcblx0XHRcdFx0Y3R4LmZpbGxUZXh0KHRoaXMudGV4dCwgdG9vbHRpcFggKyB0b29sdGlwV2lkdGgvMiwgdG9vbHRpcFkgKyB0b29sdGlwUmVjdEhlaWdodC8yKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdENoYXJ0Lk11bHRpVG9vbHRpcCA9IENoYXJ0LkVsZW1lbnQuZXh0ZW5kKHtcblx0XHRpbml0aWFsaXplIDogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuZm9udCA9IGZvbnRTdHJpbmcodGhpcy5mb250U2l6ZSx0aGlzLmZvbnRTdHlsZSx0aGlzLmZvbnRGYW1pbHkpO1xuXG5cdFx0XHR0aGlzLnRpdGxlRm9udCA9IGZvbnRTdHJpbmcodGhpcy50aXRsZUZvbnRTaXplLHRoaXMudGl0bGVGb250U3R5bGUsdGhpcy50aXRsZUZvbnRGYW1pbHkpO1xuXG5cdFx0XHR0aGlzLmhlaWdodCA9ICh0aGlzLmxhYmVscy5sZW5ndGggKiB0aGlzLmZvbnRTaXplKSArICgodGhpcy5sYWJlbHMubGVuZ3RoLTEpICogKHRoaXMuZm9udFNpemUvMikpICsgKHRoaXMueVBhZGRpbmcqMikgKyB0aGlzLnRpdGxlRm9udFNpemUgKjEuNTtcblxuXHRcdFx0dGhpcy5jdHguZm9udCA9IHRoaXMudGl0bGVGb250O1xuXG5cdFx0XHR2YXIgdGl0bGVXaWR0aCA9IHRoaXMuY3R4Lm1lYXN1cmVUZXh0KHRoaXMudGl0bGUpLndpZHRoLFxuXHRcdFx0XHQvL0xhYmVsIGhhcyBhIGxlZ2VuZCBzcXVhcmUgYXMgd2VsbCBzbyBhY2NvdW50IGZvciB0aGlzLlxuXHRcdFx0XHRsYWJlbFdpZHRoID0gbG9uZ2VzdFRleHQodGhpcy5jdHgsdGhpcy5mb250LHRoaXMubGFiZWxzKSArIHRoaXMuZm9udFNpemUgKyAzLFxuXHRcdFx0XHRsb25nZXN0VGV4dFdpZHRoID0gbWF4KFtsYWJlbFdpZHRoLHRpdGxlV2lkdGhdKTtcblxuXHRcdFx0dGhpcy53aWR0aCA9IGxvbmdlc3RUZXh0V2lkdGggKyAodGhpcy54UGFkZGluZyoyKTtcblxuXG5cdFx0XHR2YXIgaGFsZkhlaWdodCA9IHRoaXMuaGVpZ2h0LzI7XG5cblx0XHRcdC8vQ2hlY2sgdG8gZW5zdXJlIHRoZSBoZWlnaHQgd2lsbCBmaXQgb24gdGhlIGNhbnZhc1xuXHRcdFx0aWYgKHRoaXMueSAtIGhhbGZIZWlnaHQgPCAwICl7XG5cdFx0XHRcdHRoaXMueSA9IGhhbGZIZWlnaHQ7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMueSArIGhhbGZIZWlnaHQgPiB0aGlzLmNoYXJ0LmhlaWdodCl7XG5cdFx0XHRcdHRoaXMueSA9IHRoaXMuY2hhcnQuaGVpZ2h0IC0gaGFsZkhlaWdodDtcblx0XHRcdH1cblxuXHRcdFx0Ly9EZWNpZGUgd2hldGhlciB0byBhbGlnbiBsZWZ0IG9yIHJpZ2h0IGJhc2VkIG9uIHBvc2l0aW9uIG9uIGNhbnZhc1xuXHRcdFx0aWYgKHRoaXMueCA+IHRoaXMuY2hhcnQud2lkdGgvMil7XG5cdFx0XHRcdHRoaXMueCAtPSB0aGlzLnhPZmZzZXQgKyB0aGlzLndpZHRoO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy54ICs9IHRoaXMueE9mZnNldDtcblx0XHRcdH1cblxuXG5cdFx0fSxcblx0XHRnZXRMaW5lSGVpZ2h0IDogZnVuY3Rpb24oaW5kZXgpe1xuXHRcdFx0dmFyIGJhc2VMaW5lSGVpZ2h0ID0gdGhpcy55IC0gKHRoaXMuaGVpZ2h0LzIpICsgdGhpcy55UGFkZGluZyxcblx0XHRcdFx0YWZ0ZXJUaXRsZUluZGV4ID0gaW5kZXgtMTtcblxuXHRcdFx0Ly9JZiB0aGUgaW5kZXggaXMgemVybywgd2UncmUgZ2V0dGluZyB0aGUgdGl0bGVcblx0XHRcdGlmIChpbmRleCA9PT0gMCl7XG5cdFx0XHRcdHJldHVybiBiYXNlTGluZUhlaWdodCArIHRoaXMudGl0bGVGb250U2l6ZS8yO1xuXHRcdFx0fSBlbHNle1xuXHRcdFx0XHRyZXR1cm4gYmFzZUxpbmVIZWlnaHQgKyAoKHRoaXMuZm9udFNpemUqMS41KmFmdGVyVGl0bGVJbmRleCkgKyB0aGlzLmZvbnRTaXplLzIpICsgdGhpcy50aXRsZUZvbnRTaXplICogMS41O1xuXHRcdFx0fVxuXG5cdFx0fSxcblx0XHRkcmF3IDogZnVuY3Rpb24oKXtcblx0XHRcdC8vIEN1c3RvbSBUb29sdGlwc1xuXHRcdFx0aWYodGhpcy5jdXN0b20pe1xuXHRcdFx0XHR0aGlzLmN1c3RvbSh0aGlzKTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdGRyYXdSb3VuZGVkUmVjdGFuZ2xlKHRoaXMuY3R4LHRoaXMueCx0aGlzLnkgLSB0aGlzLmhlaWdodC8yLHRoaXMud2lkdGgsdGhpcy5oZWlnaHQsdGhpcy5jb3JuZXJSYWRpdXMpO1xuXHRcdFx0XHR2YXIgY3R4ID0gdGhpcy5jdHg7XG5cdFx0XHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLmZpbGxDb2xvcjtcblx0XHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXG5cdFx0XHRcdGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIjtcblx0XHRcdFx0Y3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XG5cdFx0XHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLnRpdGxlVGV4dENvbG9yO1xuXHRcdFx0XHRjdHguZm9udCA9IHRoaXMudGl0bGVGb250O1xuXG5cdFx0XHRcdGN0eC5maWxsVGV4dCh0aGlzLnRpdGxlLHRoaXMueCArIHRoaXMueFBhZGRpbmcsIHRoaXMuZ2V0TGluZUhlaWdodCgwKSk7XG5cblx0XHRcdFx0Y3R4LmZvbnQgPSB0aGlzLmZvbnQ7XG5cdFx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmxhYmVscyxmdW5jdGlvbihsYWJlbCxpbmRleCl7XG5cdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMudGV4dENvbG9yO1xuXHRcdFx0XHRcdGN0eC5maWxsVGV4dChsYWJlbCx0aGlzLnggKyB0aGlzLnhQYWRkaW5nICsgdGhpcy5mb250U2l6ZSArIDMsIHRoaXMuZ2V0TGluZUhlaWdodChpbmRleCArIDEpKTtcblxuXHRcdFx0XHRcdC8vQSBiaXQgZ25hcmx5LCBidXQgY2xlYXJpbmcgdGhpcyByZWN0YW5nbGUgYnJlYWtzIHdoZW4gdXNpbmcgZXhwbG9yZXJjYW52YXMgKGNsZWFycyB3aG9sZSBjYW52YXMpXG5cdFx0XHRcdFx0Ly9jdHguY2xlYXJSZWN0KHRoaXMueCArIHRoaXMueFBhZGRpbmcsIHRoaXMuZ2V0TGluZUhlaWdodChpbmRleCArIDEpIC0gdGhpcy5mb250U2l6ZS8yLCB0aGlzLmZvbnRTaXplLCB0aGlzLmZvbnRTaXplKTtcblx0XHRcdFx0XHQvL0luc3RlYWQgd2UnbGwgbWFrZSBhIHdoaXRlIGZpbGxlZCBibG9jayB0byBwdXQgdGhlIGxlZ2VuZENvbG91ciBwYWxldHRlIG92ZXIuXG5cblx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy5sZWdlbmRDb2xvckJhY2tncm91bmQ7XG5cdFx0XHRcdFx0Y3R4LmZpbGxSZWN0KHRoaXMueCArIHRoaXMueFBhZGRpbmcsIHRoaXMuZ2V0TGluZUhlaWdodChpbmRleCArIDEpIC0gdGhpcy5mb250U2l6ZS8yLCB0aGlzLmZvbnRTaXplLCB0aGlzLmZvbnRTaXplKTtcblxuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLmxlZ2VuZENvbG9yc1tpbmRleF0uZmlsbDtcblx0XHRcdFx0XHRjdHguZmlsbFJlY3QodGhpcy54ICsgdGhpcy54UGFkZGluZywgdGhpcy5nZXRMaW5lSGVpZ2h0KGluZGV4ICsgMSkgLSB0aGlzLmZvbnRTaXplLzIsIHRoaXMuZm9udFNpemUsIHRoaXMuZm9udFNpemUpO1xuXG5cblx0XHRcdFx0fSx0aGlzKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdENoYXJ0LlNjYWxlID0gQ2hhcnQuRWxlbWVudC5leHRlbmQoe1xuXHRcdGluaXRpYWxpemUgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5maXQoKTtcblx0XHR9LFxuXHRcdGJ1aWxkWUxhYmVscyA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLnlMYWJlbHMgPSBbXTtcblxuXHRcdFx0dmFyIHN0ZXBEZWNpbWFsUGxhY2VzID0gZ2V0RGVjaW1hbFBsYWNlcyh0aGlzLnN0ZXBWYWx1ZSk7XG5cblx0XHRcdGZvciAodmFyIGk9MDsgaTw9dGhpcy5zdGVwczsgaSsrKXtcblx0XHRcdFx0dGhpcy55TGFiZWxzLnB1c2godGVtcGxhdGUodGhpcy50ZW1wbGF0ZVN0cmluZyx7dmFsdWU6KHRoaXMubWluICsgKGkgKiB0aGlzLnN0ZXBWYWx1ZSkpLnRvRml4ZWQoc3RlcERlY2ltYWxQbGFjZXMpfSkpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy55TGFiZWxXaWR0aCA9ICh0aGlzLmRpc3BsYXkgJiYgdGhpcy5zaG93TGFiZWxzKSA/IGxvbmdlc3RUZXh0KHRoaXMuY3R4LHRoaXMuZm9udCx0aGlzLnlMYWJlbHMpIDogMDtcblx0XHR9LFxuXHRcdGFkZFhMYWJlbCA6IGZ1bmN0aW9uKGxhYmVsKXtcblx0XHRcdHRoaXMueExhYmVscy5wdXNoKGxhYmVsKTtcblx0XHRcdHRoaXMudmFsdWVzQ291bnQrKztcblx0XHRcdHRoaXMuZml0KCk7XG5cdFx0fSxcblx0XHRyZW1vdmVYTGFiZWwgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy54TGFiZWxzLnNoaWZ0KCk7XG5cdFx0XHR0aGlzLnZhbHVlc0NvdW50LS07XG5cdFx0XHR0aGlzLmZpdCgpO1xuXHRcdH0sXG5cdFx0Ly8gRml0dGluZyBsb29wIHRvIHJvdGF0ZSB4IExhYmVscyBhbmQgZmlndXJlIG91dCB3aGF0IGZpdHMgdGhlcmUsIGFuZCBhbHNvIGNhbGN1bGF0ZSBob3cgbWFueSBZIHN0ZXBzIHRvIHVzZVxuXHRcdGZpdDogZnVuY3Rpb24oKXtcblx0XHRcdC8vIEZpcnN0IHdlIG5lZWQgdGhlIHdpZHRoIG9mIHRoZSB5TGFiZWxzLCBhc3N1bWluZyB0aGUgeExhYmVscyBhcmVuJ3Qgcm90YXRlZFxuXG5cdFx0XHQvLyBUbyBkbyB0aGF0IHdlIG5lZWQgdGhlIGJhc2UgbGluZSBhdCB0aGUgdG9wIGFuZCBiYXNlIG9mIHRoZSBjaGFydCwgYXNzdW1pbmcgdGhlcmUgaXMgbm8geCBsYWJlbCByb3RhdGlvblxuXHRcdFx0dGhpcy5zdGFydFBvaW50ID0gKHRoaXMuZGlzcGxheSkgPyB0aGlzLmZvbnRTaXplIDogMDtcblx0XHRcdHRoaXMuZW5kUG9pbnQgPSAodGhpcy5kaXNwbGF5KSA/IHRoaXMuaGVpZ2h0IC0gKHRoaXMuZm9udFNpemUgKiAxLjUpIC0gNSA6IHRoaXMuaGVpZ2h0OyAvLyAtNSB0byBwYWQgbGFiZWxzXG5cblx0XHRcdC8vIEFwcGx5IHBhZGRpbmcgc2V0dGluZ3MgdG8gdGhlIHN0YXJ0IGFuZCBlbmQgcG9pbnQuXG5cdFx0XHR0aGlzLnN0YXJ0UG9pbnQgKz0gdGhpcy5wYWRkaW5nO1xuXHRcdFx0dGhpcy5lbmRQb2ludCAtPSB0aGlzLnBhZGRpbmc7XG5cblx0XHRcdC8vIENhY2hlIHRoZSBzdGFydGluZyBoZWlnaHQsIHNvIGNhbiBkZXRlcm1pbmUgaWYgd2UgbmVlZCB0byByZWNhbGN1bGF0ZSB0aGUgc2NhbGUgeUF4aXNcblx0XHRcdHZhciBjYWNoZWRIZWlnaHQgPSB0aGlzLmVuZFBvaW50IC0gdGhpcy5zdGFydFBvaW50LFxuXHRcdFx0XHRjYWNoZWRZTGFiZWxXaWR0aDtcblxuXHRcdFx0Ly8gQnVpbGQgdGhlIGN1cnJlbnQgeUxhYmVscyBzbyB3ZSBoYXZlIGFuIGlkZWEgb2Ygd2hhdCBzaXplIHRoZXknbGwgYmUgdG8gc3RhcnRcblx0XHRcdC8qXG5cdFx0XHQgKlx0VGhpcyBzZXRzIHdoYXQgaXMgcmV0dXJuZWQgZnJvbSBjYWxjdWxhdGVTY2FsZVJhbmdlIGFzIHN0YXRpYyBwcm9wZXJ0aWVzIG9mIHRoaXMgY2xhc3M6XG5cdFx0XHQgKlxuXHRcdFx0XHR0aGlzLnN0ZXBzO1xuXHRcdFx0XHR0aGlzLnN0ZXBWYWx1ZTtcblx0XHRcdFx0dGhpcy5taW47XG5cdFx0XHRcdHRoaXMubWF4O1xuXHRcdFx0ICpcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy5jYWxjdWxhdGVZUmFuZ2UoY2FjaGVkSGVpZ2h0KTtcblxuXHRcdFx0Ly8gV2l0aCB0aGVzZSBwcm9wZXJ0aWVzIHNldCB3ZSBjYW4gbm93IGJ1aWxkIHRoZSBhcnJheSBvZiB5TGFiZWxzXG5cdFx0XHQvLyBhbmQgYWxzbyB0aGUgd2lkdGggb2YgdGhlIGxhcmdlc3QgeUxhYmVsXG5cdFx0XHR0aGlzLmJ1aWxkWUxhYmVscygpO1xuXG5cdFx0XHR0aGlzLmNhbGN1bGF0ZVhMYWJlbFJvdGF0aW9uKCk7XG5cblx0XHRcdHdoaWxlKChjYWNoZWRIZWlnaHQgPiB0aGlzLmVuZFBvaW50IC0gdGhpcy5zdGFydFBvaW50KSl7XG5cdFx0XHRcdGNhY2hlZEhlaWdodCA9IHRoaXMuZW5kUG9pbnQgLSB0aGlzLnN0YXJ0UG9pbnQ7XG5cdFx0XHRcdGNhY2hlZFlMYWJlbFdpZHRoID0gdGhpcy55TGFiZWxXaWR0aDtcblxuXHRcdFx0XHR0aGlzLmNhbGN1bGF0ZVlSYW5nZShjYWNoZWRIZWlnaHQpO1xuXHRcdFx0XHR0aGlzLmJ1aWxkWUxhYmVscygpO1xuXG5cdFx0XHRcdC8vIE9ubHkgZ28gdGhyb3VnaCB0aGUgeExhYmVsIGxvb3AgYWdhaW4gaWYgdGhlIHlMYWJlbCB3aWR0aCBoYXMgY2hhbmdlZFxuXHRcdFx0XHRpZiAoY2FjaGVkWUxhYmVsV2lkdGggPCB0aGlzLnlMYWJlbFdpZHRoKXtcblx0XHRcdFx0XHR0aGlzLmNhbGN1bGF0ZVhMYWJlbFJvdGF0aW9uKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH0sXG5cdFx0Y2FsY3VsYXRlWExhYmVsUm90YXRpb24gOiBmdW5jdGlvbigpe1xuXHRcdFx0Ly9HZXQgdGhlIHdpZHRoIG9mIGVhY2ggZ3JpZCBieSBjYWxjdWxhdGluZyB0aGUgZGlmZmVyZW5jZVxuXHRcdFx0Ly9iZXR3ZWVuIHggb2Zmc2V0cyBiZXR3ZWVuIDAgYW5kIDEuXG5cblx0XHRcdHRoaXMuY3R4LmZvbnQgPSB0aGlzLmZvbnQ7XG5cblx0XHRcdHZhciBmaXJzdFdpZHRoID0gdGhpcy5jdHgubWVhc3VyZVRleHQodGhpcy54TGFiZWxzWzBdKS53aWR0aCxcblx0XHRcdFx0bGFzdFdpZHRoID0gdGhpcy5jdHgubWVhc3VyZVRleHQodGhpcy54TGFiZWxzW3RoaXMueExhYmVscy5sZW5ndGggLSAxXSkud2lkdGgsXG5cdFx0XHRcdGZpcnN0Um90YXRlZCxcblx0XHRcdFx0bGFzdFJvdGF0ZWQ7XG5cblxuXHRcdFx0dGhpcy54U2NhbGVQYWRkaW5nUmlnaHQgPSBsYXN0V2lkdGgvMiArIDM7XG5cdFx0XHR0aGlzLnhTY2FsZVBhZGRpbmdMZWZ0ID0gKGZpcnN0V2lkdGgvMiA+IHRoaXMueUxhYmVsV2lkdGggKyAxMCkgPyBmaXJzdFdpZHRoLzIgOiB0aGlzLnlMYWJlbFdpZHRoICsgMTA7XG5cblx0XHRcdHRoaXMueExhYmVsUm90YXRpb24gPSAwO1xuXHRcdFx0aWYgKHRoaXMuZGlzcGxheSl7XG5cdFx0XHRcdHZhciBvcmlnaW5hbExhYmVsV2lkdGggPSBsb25nZXN0VGV4dCh0aGlzLmN0eCx0aGlzLmZvbnQsdGhpcy54TGFiZWxzKSxcblx0XHRcdFx0XHRjb3NSb3RhdGlvbixcblx0XHRcdFx0XHRmaXJzdFJvdGF0ZWRXaWR0aDtcblx0XHRcdFx0dGhpcy54TGFiZWxXaWR0aCA9IG9yaWdpbmFsTGFiZWxXaWR0aDtcblx0XHRcdFx0Ly9BbGxvdyAzIHBpeGVscyB4MiBwYWRkaW5nIGVpdGhlciBzaWRlIGZvciBsYWJlbCByZWFkYWJpbGl0eVxuXHRcdFx0XHR2YXIgeEdyaWRXaWR0aCA9IE1hdGguZmxvb3IodGhpcy5jYWxjdWxhdGVYKDEpIC0gdGhpcy5jYWxjdWxhdGVYKDApKSAtIDY7XG5cblx0XHRcdFx0Ly9NYXggbGFiZWwgcm90YXRlIHNob3VsZCBiZSA5MCAtIGFsc28gYWN0IGFzIGEgbG9vcCBjb3VudGVyXG5cdFx0XHRcdHdoaWxlICgodGhpcy54TGFiZWxXaWR0aCA+IHhHcmlkV2lkdGggJiYgdGhpcy54TGFiZWxSb3RhdGlvbiA9PT0gMCkgfHwgKHRoaXMueExhYmVsV2lkdGggPiB4R3JpZFdpZHRoICYmIHRoaXMueExhYmVsUm90YXRpb24gPD0gOTAgJiYgdGhpcy54TGFiZWxSb3RhdGlvbiA+IDApKXtcblx0XHRcdFx0XHRjb3NSb3RhdGlvbiA9IE1hdGguY29zKHRvUmFkaWFucyh0aGlzLnhMYWJlbFJvdGF0aW9uKSk7XG5cblx0XHRcdFx0XHRmaXJzdFJvdGF0ZWQgPSBjb3NSb3RhdGlvbiAqIGZpcnN0V2lkdGg7XG5cdFx0XHRcdFx0bGFzdFJvdGF0ZWQgPSBjb3NSb3RhdGlvbiAqIGxhc3RXaWR0aDtcblxuXHRcdFx0XHRcdC8vIFdlJ3JlIHJpZ2h0IGFsaWduaW5nIHRoZSB0ZXh0IG5vdy5cblx0XHRcdFx0XHRpZiAoZmlyc3RSb3RhdGVkICsgdGhpcy5mb250U2l6ZSAvIDIgPiB0aGlzLnlMYWJlbFdpZHRoICsgOCl7XG5cdFx0XHRcdFx0XHR0aGlzLnhTY2FsZVBhZGRpbmdMZWZ0ID0gZmlyc3RSb3RhdGVkICsgdGhpcy5mb250U2l6ZSAvIDI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMueFNjYWxlUGFkZGluZ1JpZ2h0ID0gdGhpcy5mb250U2l6ZS8yO1xuXG5cblx0XHRcdFx0XHR0aGlzLnhMYWJlbFJvdGF0aW9uKys7XG5cdFx0XHRcdFx0dGhpcy54TGFiZWxXaWR0aCA9IGNvc1JvdGF0aW9uICogb3JpZ2luYWxMYWJlbFdpZHRoO1xuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRoaXMueExhYmVsUm90YXRpb24gPiAwKXtcblx0XHRcdFx0XHR0aGlzLmVuZFBvaW50IC09IE1hdGguc2luKHRvUmFkaWFucyh0aGlzLnhMYWJlbFJvdGF0aW9uKSkqb3JpZ2luYWxMYWJlbFdpZHRoICsgMztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0dGhpcy54TGFiZWxXaWR0aCA9IDA7XG5cdFx0XHRcdHRoaXMueFNjYWxlUGFkZGluZ1JpZ2h0ID0gdGhpcy5wYWRkaW5nO1xuXHRcdFx0XHR0aGlzLnhTY2FsZVBhZGRpbmdMZWZ0ID0gdGhpcy5wYWRkaW5nO1xuXHRcdFx0fVxuXG5cdFx0fSxcblx0XHQvLyBOZWVkcyB0byBiZSBvdmVyaWRkZW4gaW4gZWFjaCBDaGFydCB0eXBlXG5cdFx0Ly8gT3RoZXJ3aXNlIHdlIG5lZWQgdG8gcGFzcyBhbGwgdGhlIGRhdGEgaW50byB0aGUgc2NhbGUgY2xhc3Ncblx0XHRjYWxjdWxhdGVZUmFuZ2U6IG5vb3AsXG5cdFx0ZHJhd2luZ0FyZWE6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGhpcy5zdGFydFBvaW50IC0gdGhpcy5lbmRQb2ludDtcblx0XHR9LFxuXHRcdGNhbGN1bGF0ZVkgOiBmdW5jdGlvbih2YWx1ZSl7XG5cdFx0XHR2YXIgc2NhbGluZ0ZhY3RvciA9IHRoaXMuZHJhd2luZ0FyZWEoKSAvICh0aGlzLm1pbiAtIHRoaXMubWF4KTtcblx0XHRcdHJldHVybiB0aGlzLmVuZFBvaW50IC0gKHNjYWxpbmdGYWN0b3IgKiAodmFsdWUgLSB0aGlzLm1pbikpO1xuXHRcdH0sXG5cdFx0Y2FsY3VsYXRlWCA6IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRcdHZhciBpc1JvdGF0ZWQgPSAodGhpcy54TGFiZWxSb3RhdGlvbiA+IDApLFxuXHRcdFx0XHQvLyBpbm5lcldpZHRoID0gKHRoaXMub2Zmc2V0R3JpZExpbmVzKSA/IHRoaXMud2lkdGggLSBvZmZzZXRMZWZ0IC0gdGhpcy5wYWRkaW5nIDogdGhpcy53aWR0aCAtIChvZmZzZXRMZWZ0ICsgaGFsZkxhYmVsV2lkdGggKiAyKSAtIHRoaXMucGFkZGluZyxcblx0XHRcdFx0aW5uZXJXaWR0aCA9IHRoaXMud2lkdGggLSAodGhpcy54U2NhbGVQYWRkaW5nTGVmdCArIHRoaXMueFNjYWxlUGFkZGluZ1JpZ2h0KSxcblx0XHRcdFx0dmFsdWVXaWR0aCA9IGlubmVyV2lkdGgvTWF0aC5tYXgoKHRoaXMudmFsdWVzQ291bnQgLSAoKHRoaXMub2Zmc2V0R3JpZExpbmVzKSA/IDAgOiAxKSksIDEpLFxuXHRcdFx0XHR2YWx1ZU9mZnNldCA9ICh2YWx1ZVdpZHRoICogaW5kZXgpICsgdGhpcy54U2NhbGVQYWRkaW5nTGVmdDtcblxuXHRcdFx0aWYgKHRoaXMub2Zmc2V0R3JpZExpbmVzKXtcblx0XHRcdFx0dmFsdWVPZmZzZXQgKz0gKHZhbHVlV2lkdGgvMik7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBNYXRoLnJvdW5kKHZhbHVlT2Zmc2V0KTtcblx0XHR9LFxuXHRcdHVwZGF0ZSA6IGZ1bmN0aW9uKG5ld1Byb3BzKXtcblx0XHRcdGhlbHBlcnMuZXh0ZW5kKHRoaXMsIG5ld1Byb3BzKTtcblx0XHRcdHRoaXMuZml0KCk7XG5cdFx0fSxcblx0XHRkcmF3IDogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBjdHggPSB0aGlzLmN0eCxcblx0XHRcdFx0eUxhYmVsR2FwID0gKHRoaXMuZW5kUG9pbnQgLSB0aGlzLnN0YXJ0UG9pbnQpIC8gdGhpcy5zdGVwcyxcblx0XHRcdFx0eFN0YXJ0ID0gTWF0aC5yb3VuZCh0aGlzLnhTY2FsZVBhZGRpbmdMZWZ0KTtcblx0XHRcdGlmICh0aGlzLmRpc3BsYXkpe1xuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy50ZXh0Q29sb3I7XG5cdFx0XHRcdGN0eC5mb250ID0gdGhpcy5mb250O1xuXHRcdFx0XHRlYWNoKHRoaXMueUxhYmVscyxmdW5jdGlvbihsYWJlbFN0cmluZyxpbmRleCl7XG5cdFx0XHRcdFx0dmFyIHlMYWJlbENlbnRlciA9IHRoaXMuZW5kUG9pbnQgLSAoeUxhYmVsR2FwICogaW5kZXgpLFxuXHRcdFx0XHRcdFx0bGluZVBvc2l0aW9uWSA9IE1hdGgucm91bmQoeUxhYmVsQ2VudGVyKSxcblx0XHRcdFx0XHRcdGRyYXdIb3Jpem9udGFsTGluZSA9IHRoaXMuc2hvd0hvcml6b250YWxMaW5lcztcblxuXHRcdFx0XHRcdGN0eC50ZXh0QWxpZ24gPSBcInJpZ2h0XCI7XG5cdFx0XHRcdFx0Y3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0aWYgKHRoaXMuc2hvd0xhYmVscyl7XG5cdFx0XHRcdFx0XHRjdHguZmlsbFRleHQobGFiZWxTdHJpbmcseFN0YXJ0IC0gMTAseUxhYmVsQ2VudGVyKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBUaGlzIGlzIFggYXhpcywgc28gZHJhdyBpdFxuXHRcdFx0XHRcdGlmIChpbmRleCA9PT0gMCAmJiAhZHJhd0hvcml6b250YWxMaW5lKXtcblx0XHRcdFx0XHRcdGRyYXdIb3Jpem9udGFsTGluZSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGRyYXdIb3Jpem9udGFsTGluZSl7XG5cdFx0XHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGluZGV4ID4gMCl7XG5cdFx0XHRcdFx0XHQvLyBUaGlzIGlzIGEgZ3JpZCBsaW5lIGluIHRoZSBjZW50cmUsIHNvIGRyb3AgdGhhdFxuXHRcdFx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IHRoaXMuZ3JpZExpbmVXaWR0aDtcblx0XHRcdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ3JpZExpbmVDb2xvcjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gVGhpcyBpcyB0aGUgZmlyc3QgbGluZSBvbiB0aGUgc2NhbGVcblx0XHRcdFx0XHRcdGN0eC5saW5lV2lkdGggPSB0aGlzLmxpbmVXaWR0aDtcblx0XHRcdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9IHRoaXMubGluZUNvbG9yO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGxpbmVQb3NpdGlvblkgKz0gaGVscGVycy5hbGlhc1BpeGVsKGN0eC5saW5lV2lkdGgpO1xuXG5cdFx0XHRcdFx0aWYoZHJhd0hvcml6b250YWxMaW5lKXtcblx0XHRcdFx0XHRcdGN0eC5tb3ZlVG8oeFN0YXJ0LCBsaW5lUG9zaXRpb25ZKTtcblx0XHRcdFx0XHRcdGN0eC5saW5lVG8odGhpcy53aWR0aCwgbGluZVBvc2l0aW9uWSk7XG5cdFx0XHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IHRoaXMubGluZVdpZHRoO1xuXHRcdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9IHRoaXMubGluZUNvbG9yO1xuXHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHRjdHgubW92ZVRvKHhTdGFydCAtIDUsIGxpbmVQb3NpdGlvblkpO1xuXHRcdFx0XHRcdGN0eC5saW5lVG8oeFN0YXJ0LCBsaW5lUG9zaXRpb25ZKTtcblx0XHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXG5cdFx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdFx0ZWFjaCh0aGlzLnhMYWJlbHMsZnVuY3Rpb24obGFiZWwsaW5kZXgpe1xuXHRcdFx0XHRcdHZhciB4UG9zID0gdGhpcy5jYWxjdWxhdGVYKGluZGV4KSArIGFsaWFzUGl4ZWwodGhpcy5saW5lV2lkdGgpLFxuXHRcdFx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIGxpbmUvYmFyIGhlcmUgYW5kIGRlY2lkZSB3aGVyZSB0byBwbGFjZSB0aGUgbGluZVxuXHRcdFx0XHRcdFx0bGluZVBvcyA9IHRoaXMuY2FsY3VsYXRlWChpbmRleCAtICh0aGlzLm9mZnNldEdyaWRMaW5lcyA/IDAuNSA6IDApKSArIGFsaWFzUGl4ZWwodGhpcy5saW5lV2lkdGgpLFxuXHRcdFx0XHRcdFx0aXNSb3RhdGVkID0gKHRoaXMueExhYmVsUm90YXRpb24gPiAwKSxcblx0XHRcdFx0XHRcdGRyYXdWZXJ0aWNhbExpbmUgPSB0aGlzLnNob3dWZXJ0aWNhbExpbmVzO1xuXG5cdFx0XHRcdFx0Ly8gVGhpcyBpcyBZIGF4aXMsIHNvIGRyYXcgaXRcblx0XHRcdFx0XHRpZiAoaW5kZXggPT09IDAgJiYgIWRyYXdWZXJ0aWNhbExpbmUpe1xuXHRcdFx0XHRcdFx0ZHJhd1ZlcnRpY2FsTGluZSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGRyYXdWZXJ0aWNhbExpbmUpe1xuXHRcdFx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChpbmRleCA+IDApe1xuXHRcdFx0XHRcdFx0Ly8gVGhpcyBpcyBhIGdyaWQgbGluZSBpbiB0aGUgY2VudHJlLCBzbyBkcm9wIHRoYXRcblx0XHRcdFx0XHRcdGN0eC5saW5lV2lkdGggPSB0aGlzLmdyaWRMaW5lV2lkdGg7XG5cdFx0XHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdyaWRMaW5lQ29sb3I7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIFRoaXMgaXMgdGhlIGZpcnN0IGxpbmUgb24gdGhlIHNjYWxlXG5cdFx0XHRcdFx0XHRjdHgubGluZVdpZHRoID0gdGhpcy5saW5lV2lkdGg7XG5cdFx0XHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmxpbmVDb2xvcjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoZHJhd1ZlcnRpY2FsTGluZSl7XG5cdFx0XHRcdFx0XHRjdHgubW92ZVRvKGxpbmVQb3MsdGhpcy5lbmRQb2ludCk7XG5cdFx0XHRcdFx0XHRjdHgubGluZVRvKGxpbmVQb3MsdGhpcy5zdGFydFBvaW50IC0gMyk7XG5cdFx0XHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdFx0fVxuXG5cblx0XHRcdFx0XHRjdHgubGluZVdpZHRoID0gdGhpcy5saW5lV2lkdGg7XG5cdFx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gdGhpcy5saW5lQ29sb3I7XG5cblxuXHRcdFx0XHRcdC8vIFNtYWxsIGxpbmVzIGF0IHRoZSBib3R0b20gb2YgdGhlIGJhc2UgZ3JpZCBsaW5lXG5cdFx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRcdGN0eC5tb3ZlVG8obGluZVBvcyx0aGlzLmVuZFBvaW50KTtcblx0XHRcdFx0XHRjdHgubGluZVRvKGxpbmVQb3MsdGhpcy5lbmRQb2ludCArIDUpO1xuXHRcdFx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cblx0XHRcdFx0XHRjdHguc2F2ZSgpO1xuXHRcdFx0XHRcdGN0eC50cmFuc2xhdGUoeFBvcywoaXNSb3RhdGVkKSA/IHRoaXMuZW5kUG9pbnQgKyAxMiA6IHRoaXMuZW5kUG9pbnQgKyA4KTtcblx0XHRcdFx0XHRjdHgucm90YXRlKHRvUmFkaWFucyh0aGlzLnhMYWJlbFJvdGF0aW9uKSotMSk7XG5cdFx0XHRcdFx0Y3R4LmZvbnQgPSB0aGlzLmZvbnQ7XG5cdFx0XHRcdFx0Y3R4LnRleHRBbGlnbiA9IChpc1JvdGF0ZWQpID8gXCJyaWdodFwiIDogXCJjZW50ZXJcIjtcblx0XHRcdFx0XHRjdHgudGV4dEJhc2VsaW5lID0gKGlzUm90YXRlZCkgPyBcIm1pZGRsZVwiIDogXCJ0b3BcIjtcblx0XHRcdFx0XHRjdHguZmlsbFRleHQobGFiZWwsIDAsIDApO1xuXHRcdFx0XHRcdGN0eC5yZXN0b3JlKCk7XG5cdFx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdH1cblx0XHR9XG5cblx0fSk7XG5cblx0Q2hhcnQuUmFkaWFsU2NhbGUgPSBDaGFydC5FbGVtZW50LmV4dGVuZCh7XG5cdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuc2l6ZSA9IG1pbihbdGhpcy5oZWlnaHQsIHRoaXMud2lkdGhdKTtcblx0XHRcdHRoaXMuZHJhd2luZ0FyZWEgPSAodGhpcy5kaXNwbGF5KSA/ICh0aGlzLnNpemUvMikgLSAodGhpcy5mb250U2l6ZS8yICsgdGhpcy5iYWNrZHJvcFBhZGRpbmdZKSA6ICh0aGlzLnNpemUvMik7XG5cdFx0fSxcblx0XHRjYWxjdWxhdGVDZW50ZXJPZmZzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcblx0XHRcdC8vIFRha2UgaW50byBhY2NvdW50IGhhbGYgZm9udCBzaXplICsgdGhlIHlQYWRkaW5nIG9mIHRoZSB0b3AgdmFsdWVcblx0XHRcdHZhciBzY2FsaW5nRmFjdG9yID0gdGhpcy5kcmF3aW5nQXJlYSAvICh0aGlzLm1heCAtIHRoaXMubWluKTtcblxuXHRcdFx0cmV0dXJuICh2YWx1ZSAtIHRoaXMubWluKSAqIHNjYWxpbmdGYWN0b3I7XG5cdFx0fSxcblx0XHR1cGRhdGUgOiBmdW5jdGlvbigpe1xuXHRcdFx0aWYgKCF0aGlzLmxpbmVBcmMpe1xuXHRcdFx0XHR0aGlzLnNldFNjYWxlU2l6ZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5kcmF3aW5nQXJlYSA9ICh0aGlzLmRpc3BsYXkpID8gKHRoaXMuc2l6ZS8yKSAtICh0aGlzLmZvbnRTaXplLzIgKyB0aGlzLmJhY2tkcm9wUGFkZGluZ1kpIDogKHRoaXMuc2l6ZS8yKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuYnVpbGRZTGFiZWxzKCk7XG5cdFx0fSxcblx0XHRidWlsZFlMYWJlbHM6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLnlMYWJlbHMgPSBbXTtcblxuXHRcdFx0dmFyIHN0ZXBEZWNpbWFsUGxhY2VzID0gZ2V0RGVjaW1hbFBsYWNlcyh0aGlzLnN0ZXBWYWx1ZSk7XG5cblx0XHRcdGZvciAodmFyIGk9MDsgaTw9dGhpcy5zdGVwczsgaSsrKXtcblx0XHRcdFx0dGhpcy55TGFiZWxzLnB1c2godGVtcGxhdGUodGhpcy50ZW1wbGF0ZVN0cmluZyx7dmFsdWU6KHRoaXMubWluICsgKGkgKiB0aGlzLnN0ZXBWYWx1ZSkpLnRvRml4ZWQoc3RlcERlY2ltYWxQbGFjZXMpfSkpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Z2V0Q2lyY3VtZmVyZW5jZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gKChNYXRoLlBJKjIpIC8gdGhpcy52YWx1ZXNDb3VudCk7XG5cdFx0fSxcblx0XHRzZXRTY2FsZVNpemU6IGZ1bmN0aW9uKCl7XG5cdFx0XHQvKlxuXHRcdFx0ICogUmlnaHQsIHRoaXMgaXMgcmVhbGx5IGNvbmZ1c2luZyBhbmQgdGhlcmUgaXMgYSBsb3Qgb2YgbWF0aHMgZ29pbmcgb24gaGVyZVxuXHRcdFx0ICogVGhlIGdpc3Qgb2YgdGhlIHByb2JsZW0gaXMgaGVyZTogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vbm5uaWNrLzY5NmNjOWM1NWY0YjBiZWI4ZmU5XG5cdFx0XHQgKlxuXHRcdFx0ICogUmVhY3Rpb246IGh0dHBzOi8vZGwuZHJvcGJveHVzZXJjb250ZW50LmNvbS91LzM0NjAxMzYzL3Rvb211Y2hzY2llbmNlLmdpZlxuXHRcdFx0ICpcblx0XHRcdCAqIFNvbHV0aW9uOlxuXHRcdFx0ICpcblx0XHRcdCAqIFdlIGFzc3VtZSB0aGUgcmFkaXVzIG9mIHRoZSBwb2x5Z29uIGlzIGhhbGYgdGhlIHNpemUgb2YgdGhlIGNhbnZhcyBhdCBmaXJzdFxuXHRcdFx0ICogYXQgZWFjaCBpbmRleCB3ZSBjaGVjayBpZiB0aGUgdGV4dCBvdmVybGFwcy5cblx0XHRcdCAqXG5cdFx0XHQgKiBXaGVyZSBpdCBkb2VzLCB3ZSBzdG9yZSB0aGF0IGFuZ2xlIGFuZCB0aGF0IGluZGV4LlxuXHRcdFx0ICpcblx0XHRcdCAqIEFmdGVyIGZpbmRpbmcgdGhlIGxhcmdlc3QgaW5kZXggYW5kIGFuZ2xlIHdlIGNhbGN1bGF0ZSBob3cgbXVjaCB3ZSBuZWVkIHRvIHJlbW92ZVxuXHRcdFx0ICogZnJvbSB0aGUgc2hhcGUgcmFkaXVzIHRvIG1vdmUgdGhlIHBvaW50IGlud2FyZHMgYnkgdGhhdCB4LlxuXHRcdFx0ICpcblx0XHRcdCAqIFdlIGF2ZXJhZ2UgdGhlIGxlZnQgYW5kIHJpZ2h0IGRpc3RhbmNlcyB0byBnZXQgdGhlIG1heGltdW0gc2hhcGUgcmFkaXVzIHRoYXQgY2FuIGZpdCBpbiB0aGUgYm94XG5cdFx0XHQgKiBhbG9uZyB3aXRoIGxhYmVscy5cblx0XHRcdCAqXG5cdFx0XHQgKiBPbmNlIHdlIGhhdmUgdGhhdCwgd2UgY2FuIGZpbmQgdGhlIGNlbnRyZSBwb2ludCBmb3IgdGhlIGNoYXJ0LCBieSB0YWtpbmcgdGhlIHggdGV4dCBwcm90cnVzaW9uXG5cdFx0XHQgKiBvbiBlYWNoIHNpZGUsIHJlbW92aW5nIHRoYXQgZnJvbSB0aGUgc2l6ZSwgaGFsdmluZyBpdCBhbmQgYWRkaW5nIHRoZSBsZWZ0IHggcHJvdHJ1c2lvbiB3aWR0aC5cblx0XHRcdCAqXG5cdFx0XHQgKiBUaGlzIHdpbGwgbWVhbiB3ZSBoYXZlIGEgc2hhcGUgZml0dGVkIHRvIHRoZSBjYW52YXMsIGFzIGxhcmdlIGFzIGl0IGNhbiBiZSB3aXRoIHRoZSBsYWJlbHNcblx0XHRcdCAqIGFuZCBwb3NpdGlvbiBpdCBpbiB0aGUgbW9zdCBzcGFjZSBlZmZpY2llbnQgbWFubmVyXG5cdFx0XHQgKlxuXHRcdFx0ICogaHR0cHM6Ly9kbC5kcm9wYm94dXNlcmNvbnRlbnQuY29tL3UvMzQ2MDEzNjMveWVhaHNjaWVuY2UuZ2lmXG5cdFx0XHQgKi9cblxuXG5cdFx0XHQvLyBHZXQgbWF4aW11bSByYWRpdXMgb2YgdGhlIHBvbHlnb24uIEVpdGhlciBoYWxmIHRoZSBoZWlnaHQgKG1pbnVzIHRoZSB0ZXh0IHdpZHRoKSBvciBoYWxmIHRoZSB3aWR0aC5cblx0XHRcdC8vIFVzZSB0aGlzIHRvIGNhbGN1bGF0ZSB0aGUgb2Zmc2V0ICsgY2hhbmdlLiAtIE1ha2Ugc3VyZSBML1IgcHJvdHJ1c2lvbiBpcyBhdCBsZWFzdCAwIHRvIHN0b3AgaXNzdWVzIHdpdGggY2VudHJlIHBvaW50c1xuXHRcdFx0dmFyIGxhcmdlc3RQb3NzaWJsZVJhZGl1cyA9IG1pbihbKHRoaXMuaGVpZ2h0LzIgLSB0aGlzLnBvaW50TGFiZWxGb250U2l6ZSAtIDUpLCB0aGlzLndpZHRoLzJdKSxcblx0XHRcdFx0cG9pbnRQb3NpdGlvbixcblx0XHRcdFx0aSxcblx0XHRcdFx0dGV4dFdpZHRoLFxuXHRcdFx0XHRoYWxmVGV4dFdpZHRoLFxuXHRcdFx0XHRmdXJ0aGVzdFJpZ2h0ID0gdGhpcy53aWR0aCxcblx0XHRcdFx0ZnVydGhlc3RSaWdodEluZGV4LFxuXHRcdFx0XHRmdXJ0aGVzdFJpZ2h0QW5nbGUsXG5cdFx0XHRcdGZ1cnRoZXN0TGVmdCA9IDAsXG5cdFx0XHRcdGZ1cnRoZXN0TGVmdEluZGV4LFxuXHRcdFx0XHRmdXJ0aGVzdExlZnRBbmdsZSxcblx0XHRcdFx0eFByb3RydXNpb25MZWZ0LFxuXHRcdFx0XHR4UHJvdHJ1c2lvblJpZ2h0LFxuXHRcdFx0XHRyYWRpdXNSZWR1Y3Rpb25SaWdodCxcblx0XHRcdFx0cmFkaXVzUmVkdWN0aW9uTGVmdCxcblx0XHRcdFx0bWF4V2lkdGhSYWRpdXM7XG5cdFx0XHR0aGlzLmN0eC5mb250ID0gZm9udFN0cmluZyh0aGlzLnBvaW50TGFiZWxGb250U2l6ZSx0aGlzLnBvaW50TGFiZWxGb250U3R5bGUsdGhpcy5wb2ludExhYmVsRm9udEZhbWlseSk7XG5cdFx0XHRmb3IgKGk9MDtpPHRoaXMudmFsdWVzQ291bnQ7aSsrKXtcblx0XHRcdFx0Ly8gNXB4IHRvIHNwYWNlIHRoZSB0ZXh0IHNsaWdodGx5IG91dCAtIHNpbWlsYXIgdG8gd2hhdCB3ZSBkbyBpbiB0aGUgZHJhdyBmdW5jdGlvbi5cblx0XHRcdFx0cG9pbnRQb3NpdGlvbiA9IHRoaXMuZ2V0UG9pbnRQb3NpdGlvbihpLCBsYXJnZXN0UG9zc2libGVSYWRpdXMpO1xuXHRcdFx0XHR0ZXh0V2lkdGggPSB0aGlzLmN0eC5tZWFzdXJlVGV4dCh0ZW1wbGF0ZSh0aGlzLnRlbXBsYXRlU3RyaW5nLCB7IHZhbHVlOiB0aGlzLmxhYmVsc1tpXSB9KSkud2lkdGggKyA1O1xuXHRcdFx0XHRpZiAoaSA9PT0gMCB8fCBpID09PSB0aGlzLnZhbHVlc0NvdW50LzIpe1xuXHRcdFx0XHRcdC8vIElmIHdlJ3JlIGF0IGluZGV4IHplcm8sIG9yIGV4YWN0bHkgdGhlIG1pZGRsZSwgd2UncmUgYXQgZXhhY3RseSB0aGUgdG9wL2JvdHRvbVxuXHRcdFx0XHRcdC8vIG9mIHRoZSByYWRhciBjaGFydCwgc28gdGV4dCB3aWxsIGJlIGFsaWduZWQgY2VudHJhbGx5LCBzbyB3ZSdsbCBoYWxmIGl0IGFuZCBjb21wYXJlXG5cdFx0XHRcdFx0Ly8gdy9sZWZ0IGFuZCByaWdodCB0ZXh0IHNpemVzXG5cdFx0XHRcdFx0aGFsZlRleHRXaWR0aCA9IHRleHRXaWR0aC8yO1xuXHRcdFx0XHRcdGlmIChwb2ludFBvc2l0aW9uLnggKyBoYWxmVGV4dFdpZHRoID4gZnVydGhlc3RSaWdodCkge1xuXHRcdFx0XHRcdFx0ZnVydGhlc3RSaWdodCA9IHBvaW50UG9zaXRpb24ueCArIGhhbGZUZXh0V2lkdGg7XG5cdFx0XHRcdFx0XHRmdXJ0aGVzdFJpZ2h0SW5kZXggPSBpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocG9pbnRQb3NpdGlvbi54IC0gaGFsZlRleHRXaWR0aCA8IGZ1cnRoZXN0TGVmdCkge1xuXHRcdFx0XHRcdFx0ZnVydGhlc3RMZWZ0ID0gcG9pbnRQb3NpdGlvbi54IC0gaGFsZlRleHRXaWR0aDtcblx0XHRcdFx0XHRcdGZ1cnRoZXN0TGVmdEluZGV4ID0gaTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoaSA8IHRoaXMudmFsdWVzQ291bnQvMikge1xuXHRcdFx0XHRcdC8vIExlc3MgdGhhbiBoYWxmIHRoZSB2YWx1ZXMgbWVhbnMgd2UnbGwgbGVmdCBhbGlnbiB0aGUgdGV4dFxuXHRcdFx0XHRcdGlmIChwb2ludFBvc2l0aW9uLnggKyB0ZXh0V2lkdGggPiBmdXJ0aGVzdFJpZ2h0KSB7XG5cdFx0XHRcdFx0XHRmdXJ0aGVzdFJpZ2h0ID0gcG9pbnRQb3NpdGlvbi54ICsgdGV4dFdpZHRoO1xuXHRcdFx0XHRcdFx0ZnVydGhlc3RSaWdodEluZGV4ID0gaTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoaSA+IHRoaXMudmFsdWVzQ291bnQvMil7XG5cdFx0XHRcdFx0Ly8gTW9yZSB0aGFuIGhhbGYgdGhlIHZhbHVlcyBtZWFucyB3ZSdsbCByaWdodCBhbGlnbiB0aGUgdGV4dFxuXHRcdFx0XHRcdGlmIChwb2ludFBvc2l0aW9uLnggLSB0ZXh0V2lkdGggPCBmdXJ0aGVzdExlZnQpIHtcblx0XHRcdFx0XHRcdGZ1cnRoZXN0TGVmdCA9IHBvaW50UG9zaXRpb24ueCAtIHRleHRXaWR0aDtcblx0XHRcdFx0XHRcdGZ1cnRoZXN0TGVmdEluZGV4ID0gaTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0eFByb3RydXNpb25MZWZ0ID0gZnVydGhlc3RMZWZ0O1xuXG5cdFx0XHR4UHJvdHJ1c2lvblJpZ2h0ID0gTWF0aC5jZWlsKGZ1cnRoZXN0UmlnaHQgLSB0aGlzLndpZHRoKTtcblxuXHRcdFx0ZnVydGhlc3RSaWdodEFuZ2xlID0gdGhpcy5nZXRJbmRleEFuZ2xlKGZ1cnRoZXN0UmlnaHRJbmRleCk7XG5cblx0XHRcdGZ1cnRoZXN0TGVmdEFuZ2xlID0gdGhpcy5nZXRJbmRleEFuZ2xlKGZ1cnRoZXN0TGVmdEluZGV4KTtcblxuXHRcdFx0cmFkaXVzUmVkdWN0aW9uUmlnaHQgPSB4UHJvdHJ1c2lvblJpZ2h0IC8gTWF0aC5zaW4oZnVydGhlc3RSaWdodEFuZ2xlICsgTWF0aC5QSS8yKTtcblxuXHRcdFx0cmFkaXVzUmVkdWN0aW9uTGVmdCA9IHhQcm90cnVzaW9uTGVmdCAvIE1hdGguc2luKGZ1cnRoZXN0TGVmdEFuZ2xlICsgTWF0aC5QSS8yKTtcblxuXHRcdFx0Ly8gRW5zdXJlIHdlIGFjdHVhbGx5IG5lZWQgdG8gcmVkdWNlIHRoZSBzaXplIG9mIHRoZSBjaGFydFxuXHRcdFx0cmFkaXVzUmVkdWN0aW9uUmlnaHQgPSAoaXNOdW1iZXIocmFkaXVzUmVkdWN0aW9uUmlnaHQpKSA/IHJhZGl1c1JlZHVjdGlvblJpZ2h0IDogMDtcblx0XHRcdHJhZGl1c1JlZHVjdGlvbkxlZnQgPSAoaXNOdW1iZXIocmFkaXVzUmVkdWN0aW9uTGVmdCkpID8gcmFkaXVzUmVkdWN0aW9uTGVmdCA6IDA7XG5cblx0XHRcdHRoaXMuZHJhd2luZ0FyZWEgPSBsYXJnZXN0UG9zc2libGVSYWRpdXMgLSAocmFkaXVzUmVkdWN0aW9uTGVmdCArIHJhZGl1c1JlZHVjdGlvblJpZ2h0KS8yO1xuXG5cdFx0XHQvL3RoaXMuZHJhd2luZ0FyZWEgPSBtaW4oW21heFdpZHRoUmFkaXVzLCAodGhpcy5oZWlnaHQgLSAoMiAqICh0aGlzLnBvaW50TGFiZWxGb250U2l6ZSArIDUpKSkvMl0pXG5cdFx0XHR0aGlzLnNldENlbnRlclBvaW50KHJhZGl1c1JlZHVjdGlvbkxlZnQsIHJhZGl1c1JlZHVjdGlvblJpZ2h0KTtcblxuXHRcdH0sXG5cdFx0c2V0Q2VudGVyUG9pbnQ6IGZ1bmN0aW9uKGxlZnRNb3ZlbWVudCwgcmlnaHRNb3ZlbWVudCl7XG5cblx0XHRcdHZhciBtYXhSaWdodCA9IHRoaXMud2lkdGggLSByaWdodE1vdmVtZW50IC0gdGhpcy5kcmF3aW5nQXJlYSxcblx0XHRcdFx0bWF4TGVmdCA9IGxlZnRNb3ZlbWVudCArIHRoaXMuZHJhd2luZ0FyZWE7XG5cblx0XHRcdHRoaXMueENlbnRlciA9IChtYXhMZWZ0ICsgbWF4UmlnaHQpLzI7XG5cdFx0XHQvLyBBbHdheXMgdmVydGljYWxseSBpbiB0aGUgY2VudHJlIGFzIHRoZSB0ZXh0IGhlaWdodCBkb2Vzbid0IGNoYW5nZVxuXHRcdFx0dGhpcy55Q2VudGVyID0gKHRoaXMuaGVpZ2h0LzIpO1xuXHRcdH0sXG5cblx0XHRnZXRJbmRleEFuZ2xlIDogZnVuY3Rpb24oaW5kZXgpe1xuXHRcdFx0dmFyIGFuZ2xlTXVsdGlwbGllciA9IChNYXRoLlBJICogMikgLyB0aGlzLnZhbHVlc0NvdW50O1xuXHRcdFx0Ly8gU3RhcnQgZnJvbSB0aGUgdG9wIGluc3RlYWQgb2YgcmlnaHQsIHNvIHJlbW92ZSBhIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxuXG5cdFx0XHRyZXR1cm4gaW5kZXggKiBhbmdsZU11bHRpcGxpZXIgLSAoTWF0aC5QSS8yKTtcblx0XHR9LFxuXHRcdGdldFBvaW50UG9zaXRpb24gOiBmdW5jdGlvbihpbmRleCwgZGlzdGFuY2VGcm9tQ2VudGVyKXtcblx0XHRcdHZhciB0aGlzQW5nbGUgPSB0aGlzLmdldEluZGV4QW5nbGUoaW5kZXgpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0eCA6IChNYXRoLmNvcyh0aGlzQW5nbGUpICogZGlzdGFuY2VGcm9tQ2VudGVyKSArIHRoaXMueENlbnRlcixcblx0XHRcdFx0eSA6IChNYXRoLnNpbih0aGlzQW5nbGUpICogZGlzdGFuY2VGcm9tQ2VudGVyKSArIHRoaXMueUNlbnRlclxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGRyYXc6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAodGhpcy5kaXNwbGF5KXtcblx0XHRcdFx0dmFyIGN0eCA9IHRoaXMuY3R4O1xuXHRcdFx0XHRlYWNoKHRoaXMueUxhYmVscywgZnVuY3Rpb24obGFiZWwsIGluZGV4KXtcblx0XHRcdFx0XHQvLyBEb24ndCBkcmF3IGEgY2VudHJlIHZhbHVlXG5cdFx0XHRcdFx0aWYgKGluZGV4ID4gMCl7XG5cdFx0XHRcdFx0XHR2YXIgeUNlbnRlck9mZnNldCA9IGluZGV4ICogKHRoaXMuZHJhd2luZ0FyZWEvdGhpcy5zdGVwcyksXG5cdFx0XHRcdFx0XHRcdHlIZWlnaHQgPSB0aGlzLnlDZW50ZXIgLSB5Q2VudGVyT2Zmc2V0LFxuXHRcdFx0XHRcdFx0XHRwb2ludFBvc2l0aW9uO1xuXG5cdFx0XHRcdFx0XHQvLyBEcmF3IGNpcmN1bGFyIGxpbmVzIGFyb3VuZCB0aGUgc2NhbGVcblx0XHRcdFx0XHRcdGlmICh0aGlzLmxpbmVXaWR0aCA+IDApe1xuXHRcdFx0XHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmxpbmVDb2xvcjtcblx0XHRcdFx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IHRoaXMubGluZVdpZHRoO1xuXG5cdFx0XHRcdFx0XHRcdGlmKHRoaXMubGluZUFyYyl7XG5cdFx0XHRcdFx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRcdFx0XHRcdGN0eC5hcmModGhpcy54Q2VudGVyLCB0aGlzLnlDZW50ZXIsIHlDZW50ZXJPZmZzZXQsIDAsIE1hdGguUEkqMik7XG5cdFx0XHRcdFx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdFx0XHRcdFx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNle1xuXHRcdFx0XHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLnZhbHVlc0NvdW50O2krKylcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRwb2ludFBvc2l0aW9uID0gdGhpcy5nZXRQb2ludFBvc2l0aW9uKGksIHRoaXMuY2FsY3VsYXRlQ2VudGVyT2Zmc2V0KHRoaXMubWluICsgKGluZGV4ICogdGhpcy5zdGVwVmFsdWUpKSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoaSA9PT0gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGN0eC5tb3ZlVG8ocG9pbnRQb3NpdGlvbi54LCBwb2ludFBvc2l0aW9uLnkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y3R4LmxpbmVUbyhwb2ludFBvc2l0aW9uLngsIHBvaW50UG9zaXRpb24ueSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0XHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKHRoaXMuc2hvd0xhYmVscyl7XG5cdFx0XHRcdFx0XHRcdGN0eC5mb250ID0gZm9udFN0cmluZyh0aGlzLmZvbnRTaXplLHRoaXMuZm9udFN0eWxlLHRoaXMuZm9udEZhbWlseSk7XG5cdFx0XHRcdFx0XHRcdGlmICh0aGlzLnNob3dMYWJlbEJhY2tkcm9wKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbGFiZWxXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dChsYWJlbCkud2lkdGg7XG5cdFx0XHRcdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMuYmFja2Ryb3BDb2xvcjtcblx0XHRcdFx0XHRcdFx0XHRjdHguZmlsbFJlY3QoXG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnhDZW50ZXIgLSBsYWJlbFdpZHRoLzIgLSB0aGlzLmJhY2tkcm9wUGFkZGluZ1gsXG5cdFx0XHRcdFx0XHRcdFx0XHR5SGVpZ2h0IC0gdGhpcy5mb250U2l6ZS8yIC0gdGhpcy5iYWNrZHJvcFBhZGRpbmdZLFxuXHRcdFx0XHRcdFx0XHRcdFx0bGFiZWxXaWR0aCArIHRoaXMuYmFja2Ryb3BQYWRkaW5nWCoyLFxuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5mb250U2l6ZSArIHRoaXMuYmFja2Ryb3BQYWRkaW5nWSoyXG5cdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG5cdFx0XHRcdFx0XHRcdGN0eC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy5mb250Q29sb3I7XG5cdFx0XHRcdFx0XHRcdGN0eC5maWxsVGV4dChsYWJlbCwgdGhpcy54Q2VudGVyLCB5SGVpZ2h0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIHRoaXMpO1xuXG5cdFx0XHRcdGlmICghdGhpcy5saW5lQXJjKXtcblx0XHRcdFx0XHRjdHgubGluZVdpZHRoID0gdGhpcy5hbmdsZUxpbmVXaWR0aDtcblx0XHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmFuZ2xlTGluZUNvbG9yO1xuXHRcdFx0XHRcdGZvciAodmFyIGkgPSB0aGlzLnZhbHVlc0NvdW50IC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0XHRcdGlmICh0aGlzLmFuZ2xlTGluZVdpZHRoID4gMCl7XG5cdFx0XHRcdFx0XHRcdHZhciBvdXRlclBvc2l0aW9uID0gdGhpcy5nZXRQb2ludFBvc2l0aW9uKGksIHRoaXMuY2FsY3VsYXRlQ2VudGVyT2Zmc2V0KHRoaXMubWF4KSk7XG5cdFx0XHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHRcdFx0Y3R4Lm1vdmVUbyh0aGlzLnhDZW50ZXIsIHRoaXMueUNlbnRlcik7XG5cdFx0XHRcdFx0XHRcdGN0eC5saW5lVG8ob3V0ZXJQb3NpdGlvbi54LCBvdXRlclBvc2l0aW9uLnkpO1xuXHRcdFx0XHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHRcdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8vIEV4dHJhIDNweCBvdXQgZm9yIHNvbWUgbGFiZWwgc3BhY2luZ1xuXHRcdFx0XHRcdFx0dmFyIHBvaW50TGFiZWxQb3NpdGlvbiA9IHRoaXMuZ2V0UG9pbnRQb3NpdGlvbihpLCB0aGlzLmNhbGN1bGF0ZUNlbnRlck9mZnNldCh0aGlzLm1heCkgKyA1KTtcblx0XHRcdFx0XHRcdGN0eC5mb250ID0gZm9udFN0cmluZyh0aGlzLnBvaW50TGFiZWxGb250U2l6ZSx0aGlzLnBvaW50TGFiZWxGb250U3R5bGUsdGhpcy5wb2ludExhYmVsRm9udEZhbWlseSk7XG5cdFx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy5wb2ludExhYmVsRm9udENvbG9yO1xuXG5cdFx0XHRcdFx0XHR2YXIgbGFiZWxzQ291bnQgPSB0aGlzLmxhYmVscy5sZW5ndGgsXG5cdFx0XHRcdFx0XHRcdGhhbGZMYWJlbHNDb3VudCA9IHRoaXMubGFiZWxzLmxlbmd0aC8yLFxuXHRcdFx0XHRcdFx0XHRxdWFydGVyTGFiZWxzQ291bnQgPSBoYWxmTGFiZWxzQ291bnQvMixcblx0XHRcdFx0XHRcdFx0dXBwZXJIYWxmID0gKGkgPCBxdWFydGVyTGFiZWxzQ291bnQgfHwgaSA+IGxhYmVsc0NvdW50IC0gcXVhcnRlckxhYmVsc0NvdW50KSxcblx0XHRcdFx0XHRcdFx0ZXhhY3RRdWFydGVyID0gKGkgPT09IHF1YXJ0ZXJMYWJlbHNDb3VudCB8fCBpID09PSBsYWJlbHNDb3VudCAtIHF1YXJ0ZXJMYWJlbHNDb3VudCk7XG5cdFx0XHRcdFx0XHRpZiAoaSA9PT0gMCl7XG5cdFx0XHRcdFx0XHRcdGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcblx0XHRcdFx0XHRcdH0gZWxzZSBpZihpID09PSBoYWxmTGFiZWxzQ291bnQpe1xuXHRcdFx0XHRcdFx0XHRjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGkgPCBoYWxmTGFiZWxzQ291bnQpe1xuXHRcdFx0XHRcdFx0XHRjdHgudGV4dEFsaWduID0gJ2xlZnQnO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Y3R4LnRleHRBbGlnbiA9ICdyaWdodCc7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIFNldCB0aGUgY29ycmVjdCB0ZXh0IGJhc2VsaW5lIGJhc2VkIG9uIG91dGVyIHBvc2l0aW9uaW5nXG5cdFx0XHRcdFx0XHRpZiAoZXhhY3RRdWFydGVyKXtcblx0XHRcdFx0XHRcdFx0Y3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh1cHBlckhhbGYpe1xuXHRcdFx0XHRcdFx0XHRjdHgudGV4dEJhc2VsaW5lID0gJ2JvdHRvbSc7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRjdHgudGV4dEJhc2VsaW5lID0gJ3RvcCc7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGN0eC5maWxsVGV4dCh0aGlzLmxhYmVsc1tpXSwgcG9pbnRMYWJlbFBvc2l0aW9uLngsIHBvaW50TGFiZWxQb3NpdGlvbi55KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdC8vIEF0dGFjaCBnbG9iYWwgZXZlbnQgdG8gcmVzaXplIGVhY2ggY2hhcnQgaW5zdGFuY2Ugd2hlbiB0aGUgYnJvd3NlciByZXNpemVzXG5cdGhlbHBlcnMuYWRkRXZlbnQod2luZG93LCBcInJlc2l6ZVwiLCAoZnVuY3Rpb24oKXtcblx0XHQvLyBCYXNpYyBkZWJvdW5jZSBvZiByZXNpemUgZnVuY3Rpb24gc28gaXQgZG9lc24ndCBodXJ0IHBlcmZvcm1hbmNlIHdoZW4gcmVzaXppbmcgYnJvd3Nlci5cblx0XHR2YXIgdGltZW91dDtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKXtcblx0XHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblx0XHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGVhY2goQ2hhcnQuaW5zdGFuY2VzLGZ1bmN0aW9uKGluc3RhbmNlKXtcblx0XHRcdFx0XHQvLyBJZiB0aGUgcmVzcG9uc2l2ZSBmbGFnIGlzIHNldCBpbiB0aGUgY2hhcnQgaW5zdGFuY2UgY29uZmlnXG5cdFx0XHRcdFx0Ly8gQ2FzY2FkZSB0aGUgcmVzaXplIGV2ZW50IGRvd24gdG8gdGhlIGNoYXJ0LlxuXHRcdFx0XHRcdGlmIChpbnN0YW5jZS5vcHRpb25zLnJlc3BvbnNpdmUpe1xuXHRcdFx0XHRcdFx0aW5zdGFuY2UucmVzaXplKGluc3RhbmNlLnJlbmRlciwgdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0sIDUwKTtcblx0XHR9O1xuXHR9KSgpKTtcblxuXG5cdGlmIChhbWQpIHtcblx0XHRkZWZpbmUoZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBDaGFydDtcblx0XHR9KTtcblx0fSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gQ2hhcnQ7XG5cdH1cblxuXHRyb290LkNoYXJ0ID0gQ2hhcnQ7XG5cblx0Q2hhcnQubm9Db25mbGljdCA9IGZ1bmN0aW9uKCl7XG5cdFx0cm9vdC5DaGFydCA9IHByZXZpb3VzO1xuXHRcdHJldHVybiBDaGFydDtcblx0fTtcblxufSkuY2FsbCh0aGlzKTtcblxuKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciByb290ID0gdGhpcyxcblx0XHRDaGFydCA9IHJvb3QuQ2hhcnQsXG5cdFx0aGVscGVycyA9IENoYXJ0LmhlbHBlcnM7XG5cblxuXHR2YXIgZGVmYXVsdENvbmZpZyA9IHtcblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRoZSBzY2FsZSBzaG91bGQgc3RhcnQgYXQgemVybywgb3IgYW4gb3JkZXIgb2YgbWFnbml0dWRlIGRvd24gZnJvbSB0aGUgbG93ZXN0IHZhbHVlXG5cdFx0c2NhbGVCZWdpbkF0WmVybyA6IHRydWUsXG5cblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIGdyaWQgbGluZXMgYXJlIHNob3duIGFjcm9zcyB0aGUgY2hhcnRcblx0XHRzY2FsZVNob3dHcmlkTGluZXMgOiB0cnVlLFxuXG5cdFx0Ly9TdHJpbmcgLSBDb2xvdXIgb2YgdGhlIGdyaWQgbGluZXNcblx0XHRzY2FsZUdyaWRMaW5lQ29sb3IgOiBcInJnYmEoMCwwLDAsLjA1KVwiLFxuXG5cdFx0Ly9OdW1iZXIgLSBXaWR0aCBvZiB0aGUgZ3JpZCBsaW5lc1xuXHRcdHNjYWxlR3JpZExpbmVXaWR0aCA6IDEsXG5cblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIHNob3cgaG9yaXpvbnRhbCBsaW5lcyAoZXhjZXB0IFggYXhpcylcblx0XHRzY2FsZVNob3dIb3Jpem9udGFsTGluZXM6IHRydWUsXG5cblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIHNob3cgdmVydGljYWwgbGluZXMgKGV4Y2VwdCBZIGF4aXMpXG5cdFx0c2NhbGVTaG93VmVydGljYWxMaW5lczogdHJ1ZSxcblxuXHRcdC8vQm9vbGVhbiAtIElmIHRoZXJlIGlzIGEgc3Ryb2tlIG9uIGVhY2ggYmFyXG5cdFx0YmFyU2hvd1N0cm9rZSA6IHRydWUsXG5cblx0XHQvL051bWJlciAtIFBpeGVsIHdpZHRoIG9mIHRoZSBiYXIgc3Ryb2tlXG5cdFx0YmFyU3Ryb2tlV2lkdGggOiAyLFxuXG5cdFx0Ly9OdW1iZXIgLSBTcGFjaW5nIGJldHdlZW4gZWFjaCBvZiB0aGUgWCB2YWx1ZSBzZXRzXG5cdFx0YmFyVmFsdWVTcGFjaW5nIDogNSxcblxuXHRcdC8vTnVtYmVyIC0gU3BhY2luZyBiZXR3ZWVuIGRhdGEgc2V0cyB3aXRoaW4gWCB2YWx1ZXNcblx0XHRiYXJEYXRhc2V0U3BhY2luZyA6IDEsXG5cblx0XHQvL1N0cmluZyAtIEEgbGVnZW5kIHRlbXBsYXRlXG5cdFx0bGVnZW5kVGVtcGxhdGUgOiBcIjx1bCBjbGFzcz1cXFwiPCU9bmFtZS50b0xvd2VyQ2FzZSgpJT4tbGVnZW5kXFxcIj48JSBmb3IgKHZhciBpPTA7IGk8ZGF0YXNldHMubGVuZ3RoOyBpKyspeyU+PGxpPjxzcGFuIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWNvbG9yOjwlPWRhdGFzZXRzW2ldLmZpbGxDb2xvciU+XFxcIj48L3NwYW4+PCVpZihkYXRhc2V0c1tpXS5sYWJlbCl7JT48JT1kYXRhc2V0c1tpXS5sYWJlbCU+PCV9JT48L2xpPjwlfSU+PC91bD5cIlxuXG5cdH07XG5cblxuXHRDaGFydC5UeXBlLmV4dGVuZCh7XG5cdFx0bmFtZTogXCJCYXJcIixcblx0XHRkZWZhdWx0cyA6IGRlZmF1bHRDb25maWcsXG5cdFx0aW5pdGlhbGl6ZTogIGZ1bmN0aW9uKGRhdGEpe1xuXG5cdFx0XHQvL0V4cG9zZSBvcHRpb25zIGFzIGEgc2NvcGUgdmFyaWFibGUgaGVyZSBzbyB3ZSBjYW4gYWNjZXNzIGl0IGluIHRoZSBTY2FsZUNsYXNzXG5cdFx0XHR2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuXHRcdFx0dGhpcy5TY2FsZUNsYXNzID0gQ2hhcnQuU2NhbGUuZXh0ZW5kKHtcblx0XHRcdFx0b2Zmc2V0R3JpZExpbmVzIDogdHJ1ZSxcblx0XHRcdFx0Y2FsY3VsYXRlQmFyWCA6IGZ1bmN0aW9uKGRhdGFzZXRDb3VudCwgZGF0YXNldEluZGV4LCBiYXJJbmRleCl7XG5cdFx0XHRcdFx0Ly9SZXVzYWJsZSBtZXRob2QgZm9yIGNhbGN1bGF0aW5nIHRoZSB4UG9zaXRpb24gb2YgYSBnaXZlbiBiYXIgYmFzZWQgb24gZGF0YXNldEluZGV4ICYgd2lkdGggb2YgdGhlIGJhclxuXHRcdFx0XHRcdHZhciB4V2lkdGggPSB0aGlzLmNhbGN1bGF0ZUJhc2VXaWR0aCgpLFxuXHRcdFx0XHRcdFx0eEFic29sdXRlID0gdGhpcy5jYWxjdWxhdGVYKGJhckluZGV4KSAtICh4V2lkdGgvMiksXG5cdFx0XHRcdFx0XHRiYXJXaWR0aCA9IHRoaXMuY2FsY3VsYXRlQmFyV2lkdGgoZGF0YXNldENvdW50KTtcblxuXHRcdFx0XHRcdHJldHVybiB4QWJzb2x1dGUgKyAoYmFyV2lkdGggKiBkYXRhc2V0SW5kZXgpICsgKGRhdGFzZXRJbmRleCAqIG9wdGlvbnMuYmFyRGF0YXNldFNwYWNpbmcpICsgYmFyV2lkdGgvMjtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y2FsY3VsYXRlQmFzZVdpZHRoIDogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRyZXR1cm4gKHRoaXMuY2FsY3VsYXRlWCgxKSAtIHRoaXMuY2FsY3VsYXRlWCgwKSkgLSAoMipvcHRpb25zLmJhclZhbHVlU3BhY2luZyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNhbGN1bGF0ZUJhcldpZHRoIDogZnVuY3Rpb24oZGF0YXNldENvdW50KXtcblx0XHRcdFx0XHQvL1RoZSBwYWRkaW5nIGJldHdlZW4gZGF0YXNldHMgaXMgdG8gdGhlIHJpZ2h0IG9mIGVhY2ggYmFyLCBwcm92aWRpbmcgdGhhdCB0aGVyZSBhcmUgbW9yZSB0aGFuIDEgZGF0YXNldFxuXHRcdFx0XHRcdHZhciBiYXNlV2lkdGggPSB0aGlzLmNhbGN1bGF0ZUJhc2VXaWR0aCgpIC0gKChkYXRhc2V0Q291bnQgLSAxKSAqIG9wdGlvbnMuYmFyRGF0YXNldFNwYWNpbmcpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIChiYXNlV2lkdGggLyBkYXRhc2V0Q291bnQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5kYXRhc2V0cyA9IFtdO1xuXG5cdFx0XHQvL1NldCB1cCB0b29sdGlwIGV2ZW50cyBvbiB0aGUgY2hhcnRcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuc2hvd1Rvb2x0aXBzKXtcblx0XHRcdFx0aGVscGVycy5iaW5kRXZlbnRzKHRoaXMsIHRoaXMub3B0aW9ucy50b29sdGlwRXZlbnRzLCBmdW5jdGlvbihldnQpe1xuXHRcdFx0XHRcdHZhciBhY3RpdmVCYXJzID0gKGV2dC50eXBlICE9PSAnbW91c2VvdXQnKSA/IHRoaXMuZ2V0QmFyc0F0RXZlbnQoZXZ0KSA6IFtdO1xuXG5cdFx0XHRcdFx0dGhpcy5lYWNoQmFycyhmdW5jdGlvbihiYXIpe1xuXHRcdFx0XHRcdFx0YmFyLnJlc3RvcmUoWydmaWxsQ29sb3InLCAnc3Ryb2tlQ29sb3InXSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0aGVscGVycy5lYWNoKGFjdGl2ZUJhcnMsIGZ1bmN0aW9uKGFjdGl2ZUJhcil7XG5cdFx0XHRcdFx0XHRhY3RpdmVCYXIuZmlsbENvbG9yID0gYWN0aXZlQmFyLmhpZ2hsaWdodEZpbGw7XG5cdFx0XHRcdFx0XHRhY3RpdmVCYXIuc3Ryb2tlQ29sb3IgPSBhY3RpdmVCYXIuaGlnaGxpZ2h0U3Ryb2tlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHRoaXMuc2hvd1Rvb2x0aXAoYWN0aXZlQmFycyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHQvL0RlY2xhcmUgdGhlIGV4dGVuc2lvbiBvZiB0aGUgZGVmYXVsdCBwb2ludCwgdG8gY2F0ZXIgZm9yIHRoZSBvcHRpb25zIHBhc3NlZCBpbiB0byB0aGUgY29uc3RydWN0b3Jcblx0XHRcdHRoaXMuQmFyQ2xhc3MgPSBDaGFydC5SZWN0YW5nbGUuZXh0ZW5kKHtcblx0XHRcdFx0c3Ryb2tlV2lkdGggOiB0aGlzLm9wdGlvbnMuYmFyU3Ryb2tlV2lkdGgsXG5cdFx0XHRcdHNob3dTdHJva2UgOiB0aGlzLm9wdGlvbnMuYmFyU2hvd1N0cm9rZSxcblx0XHRcdFx0Y3R4IDogdGhpcy5jaGFydC5jdHhcblx0XHRcdH0pO1xuXG5cdFx0XHQvL0l0ZXJhdGUgdGhyb3VnaCBlYWNoIG9mIHRoZSBkYXRhc2V0cywgYW5kIGJ1aWxkIHRoaXMgaW50byBhIHByb3BlcnR5IG9mIHRoZSBjaGFydFxuXHRcdFx0aGVscGVycy5lYWNoKGRhdGEuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCxkYXRhc2V0SW5kZXgpe1xuXG5cdFx0XHRcdHZhciBkYXRhc2V0T2JqZWN0ID0ge1xuXHRcdFx0XHRcdGxhYmVsIDogZGF0YXNldC5sYWJlbCB8fCBudWxsLFxuXHRcdFx0XHRcdGZpbGxDb2xvciA6IGRhdGFzZXQuZmlsbENvbG9yLFxuXHRcdFx0XHRcdHN0cm9rZUNvbG9yIDogZGF0YXNldC5zdHJva2VDb2xvcixcblx0XHRcdFx0XHRiYXJzIDogW11cblx0XHRcdFx0fTtcblxuXHRcdFx0XHR0aGlzLmRhdGFzZXRzLnB1c2goZGF0YXNldE9iamVjdCk7XG5cblx0XHRcdFx0aGVscGVycy5lYWNoKGRhdGFzZXQuZGF0YSxmdW5jdGlvbihkYXRhUG9pbnQsaW5kZXgpe1xuXHRcdFx0XHRcdC8vQWRkIGEgbmV3IHBvaW50IGZvciBlYWNoIHBpZWNlIG9mIGRhdGEsIHBhc3NpbmcgYW55IHJlcXVpcmVkIGRhdGEgdG8gZHJhdy5cblx0XHRcdFx0XHRkYXRhc2V0T2JqZWN0LmJhcnMucHVzaChuZXcgdGhpcy5CYXJDbGFzcyh7XG5cdFx0XHRcdFx0XHR2YWx1ZSA6IGRhdGFQb2ludCxcblx0XHRcdFx0XHRcdGxhYmVsIDogZGF0YS5sYWJlbHNbaW5kZXhdLFxuXHRcdFx0XHRcdFx0ZGF0YXNldExhYmVsOiBkYXRhc2V0LmxhYmVsLFxuXHRcdFx0XHRcdFx0c3Ryb2tlQ29sb3IgOiBkYXRhc2V0LnN0cm9rZUNvbG9yLFxuXHRcdFx0XHRcdFx0ZmlsbENvbG9yIDogZGF0YXNldC5maWxsQ29sb3IsXG5cdFx0XHRcdFx0XHRoaWdobGlnaHRGaWxsIDogZGF0YXNldC5oaWdobGlnaHRGaWxsIHx8IGRhdGFzZXQuZmlsbENvbG9yLFxuXHRcdFx0XHRcdFx0aGlnaGxpZ2h0U3Ryb2tlIDogZGF0YXNldC5oaWdobGlnaHRTdHJva2UgfHwgZGF0YXNldC5zdHJva2VDb2xvclxuXHRcdFx0XHRcdH0pKTtcblx0XHRcdFx0fSx0aGlzKTtcblxuXHRcdFx0fSx0aGlzKTtcblxuXHRcdFx0dGhpcy5idWlsZFNjYWxlKGRhdGEubGFiZWxzKTtcblxuXHRcdFx0dGhpcy5CYXJDbGFzcy5wcm90b3R5cGUuYmFzZSA9IHRoaXMuc2NhbGUuZW5kUG9pbnQ7XG5cblx0XHRcdHRoaXMuZWFjaEJhcnMoZnVuY3Rpb24oYmFyLCBpbmRleCwgZGF0YXNldEluZGV4KXtcblx0XHRcdFx0aGVscGVycy5leHRlbmQoYmFyLCB7XG5cdFx0XHRcdFx0d2lkdGggOiB0aGlzLnNjYWxlLmNhbGN1bGF0ZUJhcldpZHRoKHRoaXMuZGF0YXNldHMubGVuZ3RoKSxcblx0XHRcdFx0XHR4OiB0aGlzLnNjYWxlLmNhbGN1bGF0ZUJhclgodGhpcy5kYXRhc2V0cy5sZW5ndGgsIGRhdGFzZXRJbmRleCwgaW5kZXgpLFxuXHRcdFx0XHRcdHk6IHRoaXMuc2NhbGUuZW5kUG9pbnRcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGJhci5zYXZlKCk7XG5cdFx0XHR9LCB0aGlzKTtcblxuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9LFxuXHRcdHVwZGF0ZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLnNjYWxlLnVwZGF0ZSgpO1xuXHRcdFx0Ly8gUmVzZXQgYW55IGhpZ2hsaWdodCBjb2xvdXJzIGJlZm9yZSB1cGRhdGluZy5cblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmFjdGl2ZUVsZW1lbnRzLCBmdW5jdGlvbihhY3RpdmVFbGVtZW50KXtcblx0XHRcdFx0YWN0aXZlRWxlbWVudC5yZXN0b3JlKFsnZmlsbENvbG9yJywgJ3N0cm9rZUNvbG9yJ10pO1xuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuZWFjaEJhcnMoZnVuY3Rpb24oYmFyKXtcblx0XHRcdFx0YmFyLnNhdmUoKTtcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9LFxuXHRcdGVhY2hCYXJzIDogZnVuY3Rpb24oY2FsbGJhY2spe1xuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCwgZGF0YXNldEluZGV4KXtcblx0XHRcdFx0aGVscGVycy5lYWNoKGRhdGFzZXQuYmFycywgY2FsbGJhY2ssIHRoaXMsIGRhdGFzZXRJbmRleCk7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdH0sXG5cdFx0Z2V0QmFyc0F0RXZlbnQgOiBmdW5jdGlvbihlKXtcblx0XHRcdHZhciBiYXJzQXJyYXkgPSBbXSxcblx0XHRcdFx0ZXZlbnRQb3NpdGlvbiA9IGhlbHBlcnMuZ2V0UmVsYXRpdmVQb3NpdGlvbihlKSxcblx0XHRcdFx0ZGF0YXNldEl0ZXJhdG9yID0gZnVuY3Rpb24oZGF0YXNldCl7XG5cdFx0XHRcdFx0YmFyc0FycmF5LnB1c2goZGF0YXNldC5iYXJzW2JhckluZGV4XSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJhckluZGV4O1xuXG5cdFx0XHRmb3IgKHZhciBkYXRhc2V0SW5kZXggPSAwOyBkYXRhc2V0SW5kZXggPCB0aGlzLmRhdGFzZXRzLmxlbmd0aDsgZGF0YXNldEluZGV4KyspIHtcblx0XHRcdFx0Zm9yIChiYXJJbmRleCA9IDA7IGJhckluZGV4IDwgdGhpcy5kYXRhc2V0c1tkYXRhc2V0SW5kZXhdLmJhcnMubGVuZ3RoOyBiYXJJbmRleCsrKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuZGF0YXNldHNbZGF0YXNldEluZGV4XS5iYXJzW2JhckluZGV4XS5pblJhbmdlKGV2ZW50UG9zaXRpb24ueCxldmVudFBvc2l0aW9uLnkpKXtcblx0XHRcdFx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmRhdGFzZXRzLCBkYXRhc2V0SXRlcmF0b3IpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGJhcnNBcnJheTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGJhcnNBcnJheTtcblx0XHR9LFxuXHRcdGJ1aWxkU2NhbGUgOiBmdW5jdGlvbihsYWJlbHMpe1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0XHR2YXIgZGF0YVRvdGFsID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIHZhbHVlcyA9IFtdO1xuXHRcdFx0XHRzZWxmLmVhY2hCYXJzKGZ1bmN0aW9uKGJhcil7XG5cdFx0XHRcdFx0dmFsdWVzLnB1c2goYmFyLnZhbHVlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiB2YWx1ZXM7XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgc2NhbGVPcHRpb25zID0ge1xuXHRcdFx0XHR0ZW1wbGF0ZVN0cmluZyA6IHRoaXMub3B0aW9ucy5zY2FsZUxhYmVsLFxuXHRcdFx0XHRoZWlnaHQgOiB0aGlzLmNoYXJ0LmhlaWdodCxcblx0XHRcdFx0d2lkdGggOiB0aGlzLmNoYXJ0LndpZHRoLFxuXHRcdFx0XHRjdHggOiB0aGlzLmNoYXJ0LmN0eCxcblx0XHRcdFx0dGV4dENvbG9yIDogdGhpcy5vcHRpb25zLnNjYWxlRm9udENvbG9yLFxuXHRcdFx0XHRmb250U2l6ZSA6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTaXplLFxuXHRcdFx0XHRmb250U3R5bGUgOiB0aGlzLm9wdGlvbnMuc2NhbGVGb250U3R5bGUsXG5cdFx0XHRcdGZvbnRGYW1pbHkgOiB0aGlzLm9wdGlvbnMuc2NhbGVGb250RmFtaWx5LFxuXHRcdFx0XHR2YWx1ZXNDb3VudCA6IGxhYmVscy5sZW5ndGgsXG5cdFx0XHRcdGJlZ2luQXRaZXJvIDogdGhpcy5vcHRpb25zLnNjYWxlQmVnaW5BdFplcm8sXG5cdFx0XHRcdGludGVnZXJzT25seSA6IHRoaXMub3B0aW9ucy5zY2FsZUludGVnZXJzT25seSxcblx0XHRcdFx0Y2FsY3VsYXRlWVJhbmdlOiBmdW5jdGlvbihjdXJyZW50SGVpZ2h0KXtcblx0XHRcdFx0XHR2YXIgdXBkYXRlZFJhbmdlcyA9IGhlbHBlcnMuY2FsY3VsYXRlU2NhbGVSYW5nZShcblx0XHRcdFx0XHRcdGRhdGFUb3RhbCgpLFxuXHRcdFx0XHRcdFx0Y3VycmVudEhlaWdodCxcblx0XHRcdFx0XHRcdHRoaXMuZm9udFNpemUsXG5cdFx0XHRcdFx0XHR0aGlzLmJlZ2luQXRaZXJvLFxuXHRcdFx0XHRcdFx0dGhpcy5pbnRlZ2Vyc09ubHlcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGhlbHBlcnMuZXh0ZW5kKHRoaXMsIHVwZGF0ZWRSYW5nZXMpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR4TGFiZWxzIDogbGFiZWxzLFxuXHRcdFx0XHRmb250IDogaGVscGVycy5mb250U3RyaW5nKHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTaXplLCB0aGlzLm9wdGlvbnMuc2NhbGVGb250U3R5bGUsIHRoaXMub3B0aW9ucy5zY2FsZUZvbnRGYW1pbHkpLFxuXHRcdFx0XHRsaW5lV2lkdGggOiB0aGlzLm9wdGlvbnMuc2NhbGVMaW5lV2lkdGgsXG5cdFx0XHRcdGxpbmVDb2xvciA6IHRoaXMub3B0aW9ucy5zY2FsZUxpbmVDb2xvcixcblx0XHRcdFx0c2hvd0hvcml6b250YWxMaW5lcyA6IHRoaXMub3B0aW9ucy5zY2FsZVNob3dIb3Jpem9udGFsTGluZXMsXG5cdFx0XHRcdHNob3dWZXJ0aWNhbExpbmVzIDogdGhpcy5vcHRpb25zLnNjYWxlU2hvd1ZlcnRpY2FsTGluZXMsXG5cdFx0XHRcdGdyaWRMaW5lV2lkdGggOiAodGhpcy5vcHRpb25zLnNjYWxlU2hvd0dyaWRMaW5lcykgPyB0aGlzLm9wdGlvbnMuc2NhbGVHcmlkTGluZVdpZHRoIDogMCxcblx0XHRcdFx0Z3JpZExpbmVDb2xvciA6ICh0aGlzLm9wdGlvbnMuc2NhbGVTaG93R3JpZExpbmVzKSA/IHRoaXMub3B0aW9ucy5zY2FsZUdyaWRMaW5lQ29sb3IgOiBcInJnYmEoMCwwLDAsMClcIixcblx0XHRcdFx0cGFkZGluZyA6ICh0aGlzLm9wdGlvbnMuc2hvd1NjYWxlKSA/IDAgOiAodGhpcy5vcHRpb25zLmJhclNob3dTdHJva2UpID8gdGhpcy5vcHRpb25zLmJhclN0cm9rZVdpZHRoIDogMCxcblx0XHRcdFx0c2hvd0xhYmVscyA6IHRoaXMub3B0aW9ucy5zY2FsZVNob3dMYWJlbHMsXG5cdFx0XHRcdGRpc3BsYXkgOiB0aGlzLm9wdGlvbnMuc2hvd1NjYWxlXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLnNjYWxlT3ZlcnJpZGUpe1xuXHRcdFx0XHRoZWxwZXJzLmV4dGVuZChzY2FsZU9wdGlvbnMsIHtcblx0XHRcdFx0XHRjYWxjdWxhdGVZUmFuZ2U6IGhlbHBlcnMubm9vcCxcblx0XHRcdFx0XHRzdGVwczogdGhpcy5vcHRpb25zLnNjYWxlU3RlcHMsXG5cdFx0XHRcdFx0c3RlcFZhbHVlOiB0aGlzLm9wdGlvbnMuc2NhbGVTdGVwV2lkdGgsXG5cdFx0XHRcdFx0bWluOiB0aGlzLm9wdGlvbnMuc2NhbGVTdGFydFZhbHVlLFxuXHRcdFx0XHRcdG1heDogdGhpcy5vcHRpb25zLnNjYWxlU3RhcnRWYWx1ZSArICh0aGlzLm9wdGlvbnMuc2NhbGVTdGVwcyAqIHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBXaWR0aClcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuc2NhbGUgPSBuZXcgdGhpcy5TY2FsZUNsYXNzKHNjYWxlT3B0aW9ucyk7XG5cdFx0fSxcblx0XHRhZGREYXRhIDogZnVuY3Rpb24odmFsdWVzQXJyYXksbGFiZWwpe1xuXHRcdFx0Ly9NYXAgdGhlIHZhbHVlcyBhcnJheSBmb3IgZWFjaCBvZiB0aGUgZGF0YXNldHNcblx0XHRcdGhlbHBlcnMuZWFjaCh2YWx1ZXNBcnJheSxmdW5jdGlvbih2YWx1ZSxkYXRhc2V0SW5kZXgpe1xuXHRcdFx0XHQvL0FkZCBhIG5ldyBwb2ludCBmb3IgZWFjaCBwaWVjZSBvZiBkYXRhLCBwYXNzaW5nIGFueSByZXF1aXJlZCBkYXRhIHRvIGRyYXcuXG5cdFx0XHRcdHRoaXMuZGF0YXNldHNbZGF0YXNldEluZGV4XS5iYXJzLnB1c2gobmV3IHRoaXMuQmFyQ2xhc3Moe1xuXHRcdFx0XHRcdHZhbHVlIDogdmFsdWUsXG5cdFx0XHRcdFx0bGFiZWwgOiBsYWJlbCxcblx0XHRcdFx0XHR4OiB0aGlzLnNjYWxlLmNhbGN1bGF0ZUJhclgodGhpcy5kYXRhc2V0cy5sZW5ndGgsIGRhdGFzZXRJbmRleCwgdGhpcy5zY2FsZS52YWx1ZXNDb3VudCsxKSxcblx0XHRcdFx0XHR5OiB0aGlzLnNjYWxlLmVuZFBvaW50LFxuXHRcdFx0XHRcdHdpZHRoIDogdGhpcy5zY2FsZS5jYWxjdWxhdGVCYXJXaWR0aCh0aGlzLmRhdGFzZXRzLmxlbmd0aCksXG5cdFx0XHRcdFx0YmFzZSA6IHRoaXMuc2NhbGUuZW5kUG9pbnQsXG5cdFx0XHRcdFx0c3Ryb2tlQ29sb3IgOiB0aGlzLmRhdGFzZXRzW2RhdGFzZXRJbmRleF0uc3Ryb2tlQ29sb3IsXG5cdFx0XHRcdFx0ZmlsbENvbG9yIDogdGhpcy5kYXRhc2V0c1tkYXRhc2V0SW5kZXhdLmZpbGxDb2xvclxuXHRcdFx0XHR9KSk7XG5cdFx0XHR9LHRoaXMpO1xuXG5cdFx0XHR0aGlzLnNjYWxlLmFkZFhMYWJlbChsYWJlbCk7XG5cdFx0XHQvL1RoZW4gcmUtcmVuZGVyIHRoZSBjaGFydC5cblx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0fSxcblx0XHRyZW1vdmVEYXRhIDogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuc2NhbGUucmVtb3ZlWExhYmVsKCk7XG5cdFx0XHQvL1RoZW4gcmUtcmVuZGVyIHRoZSBjaGFydC5cblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmRhdGFzZXRzLGZ1bmN0aW9uKGRhdGFzZXQpe1xuXHRcdFx0XHRkYXRhc2V0LmJhcnMuc2hpZnQoKTtcblx0XHRcdH0sdGhpcyk7XG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdH0sXG5cdFx0cmVmbG93IDogZnVuY3Rpb24oKXtcblx0XHRcdGhlbHBlcnMuZXh0ZW5kKHRoaXMuQmFyQ2xhc3MucHJvdG90eXBlLHtcblx0XHRcdFx0eTogdGhpcy5zY2FsZS5lbmRQb2ludCxcblx0XHRcdFx0YmFzZSA6IHRoaXMuc2NhbGUuZW5kUG9pbnRcblx0XHRcdH0pO1xuXHRcdFx0dmFyIG5ld1NjYWxlUHJvcHMgPSBoZWxwZXJzLmV4dGVuZCh7XG5cdFx0XHRcdGhlaWdodCA6IHRoaXMuY2hhcnQuaGVpZ2h0LFxuXHRcdFx0XHR3aWR0aCA6IHRoaXMuY2hhcnQud2lkdGhcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5zY2FsZS51cGRhdGUobmV3U2NhbGVQcm9wcyk7XG5cdFx0fSxcblx0XHRkcmF3IDogZnVuY3Rpb24oZWFzZSl7XG5cdFx0XHR2YXIgZWFzaW5nRGVjaW1hbCA9IGVhc2UgfHwgMTtcblx0XHRcdHRoaXMuY2xlYXIoKTtcblxuXHRcdFx0dmFyIGN0eCA9IHRoaXMuY2hhcnQuY3R4O1xuXG5cdFx0XHR0aGlzLnNjYWxlLmRyYXcoZWFzaW5nRGVjaW1hbCk7XG5cblx0XHRcdC8vRHJhdyBhbGwgdGhlIGJhcnMgZm9yIGVhY2ggZGF0YXNldFxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCxkYXRhc2V0SW5kZXgpe1xuXHRcdFx0XHRoZWxwZXJzLmVhY2goZGF0YXNldC5iYXJzLGZ1bmN0aW9uKGJhcixpbmRleCl7XG5cdFx0XHRcdFx0aWYgKGJhci5oYXNWYWx1ZSgpKXtcblx0XHRcdFx0XHRcdGJhci5iYXNlID0gdGhpcy5zY2FsZS5lbmRQb2ludDtcblx0XHRcdFx0XHRcdC8vVHJhbnNpdGlvbiB0aGVuIGRyYXdcblx0XHRcdFx0XHRcdGJhci50cmFuc2l0aW9uKHtcblx0XHRcdFx0XHRcdFx0eCA6IHRoaXMuc2NhbGUuY2FsY3VsYXRlQmFyWCh0aGlzLmRhdGFzZXRzLmxlbmd0aCwgZGF0YXNldEluZGV4LCBpbmRleCksXG5cdFx0XHRcdFx0XHRcdHkgOiB0aGlzLnNjYWxlLmNhbGN1bGF0ZVkoYmFyLnZhbHVlKSxcblx0XHRcdFx0XHRcdFx0d2lkdGggOiB0aGlzLnNjYWxlLmNhbGN1bGF0ZUJhcldpZHRoKHRoaXMuZGF0YXNldHMubGVuZ3RoKVxuXHRcdFx0XHRcdFx0fSwgZWFzaW5nRGVjaW1hbCkuZHJhdygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSx0aGlzKTtcblxuXHRcdFx0fSx0aGlzKTtcblx0XHR9XG5cdH0pO1xuXG5cbn0pLmNhbGwodGhpcyk7XG5cbihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgcm9vdCA9IHRoaXMsXG5cdFx0Q2hhcnQgPSByb290LkNoYXJ0LFxuXHRcdC8vQ2FjaGUgYSBsb2NhbCByZWZlcmVuY2UgdG8gQ2hhcnQuaGVscGVyc1xuXHRcdGhlbHBlcnMgPSBDaGFydC5oZWxwZXJzO1xuXG5cdHZhciBkZWZhdWx0Q29uZmlnID0ge1xuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgd2Ugc2hvdWxkIHNob3cgYSBzdHJva2Ugb24gZWFjaCBzZWdtZW50XG5cdFx0c2VnbWVudFNob3dTdHJva2UgOiB0cnVlLFxuXG5cdFx0Ly9TdHJpbmcgLSBUaGUgY29sb3VyIG9mIGVhY2ggc2VnbWVudCBzdHJva2Vcblx0XHRzZWdtZW50U3Ryb2tlQ29sb3IgOiBcIiNmZmZcIixcblxuXHRcdC8vTnVtYmVyIC0gVGhlIHdpZHRoIG9mIGVhY2ggc2VnbWVudCBzdHJva2Vcblx0XHRzZWdtZW50U3Ryb2tlV2lkdGggOiAyLFxuXG5cdFx0Ly9UaGUgcGVyY2VudGFnZSBvZiB0aGUgY2hhcnQgdGhhdCB3ZSBjdXQgb3V0IG9mIHRoZSBtaWRkbGUuXG5cdFx0cGVyY2VudGFnZUlubmVyQ3V0b3V0IDogNTAsXG5cblx0XHQvL051bWJlciAtIEFtb3VudCBvZiBhbmltYXRpb24gc3RlcHNcblx0XHRhbmltYXRpb25TdGVwcyA6IDEwMCxcblxuXHRcdC8vU3RyaW5nIC0gQW5pbWF0aW9uIGVhc2luZyBlZmZlY3Rcblx0XHRhbmltYXRpb25FYXNpbmcgOiBcImVhc2VPdXRCb3VuY2VcIixcblxuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgd2UgYW5pbWF0ZSB0aGUgcm90YXRpb24gb2YgdGhlIERvdWdobnV0XG5cdFx0YW5pbWF0ZVJvdGF0ZSA6IHRydWUsXG5cblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHdlIGFuaW1hdGUgc2NhbGluZyB0aGUgRG91Z2hudXQgZnJvbSB0aGUgY2VudHJlXG5cdFx0YW5pbWF0ZVNjYWxlIDogZmFsc2UsXG5cblx0XHQvL1N0cmluZyAtIEEgbGVnZW5kIHRlbXBsYXRlXG5cdFx0bGVnZW5kVGVtcGxhdGUgOiBcIjx1bCBjbGFzcz1cXFwiPCU9bmFtZS50b0xvd2VyQ2FzZSgpJT4tbGVnZW5kXFxcIj48JSBmb3IgKHZhciBpPTA7IGk8c2VnbWVudHMubGVuZ3RoOyBpKyspeyU+PGxpPjxzcGFuIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWNvbG9yOjwlPXNlZ21lbnRzW2ldLmZpbGxDb2xvciU+XFxcIj48L3NwYW4+PCVpZihzZWdtZW50c1tpXS5sYWJlbCl7JT48JT1zZWdtZW50c1tpXS5sYWJlbCU+PCV9JT48L2xpPjwlfSU+PC91bD5cIlxuXG5cdH07XG5cblxuXHRDaGFydC5UeXBlLmV4dGVuZCh7XG5cdFx0Ly9QYXNzaW5nIGluIGEgbmFtZSByZWdpc3RlcnMgdGhpcyBjaGFydCBpbiB0aGUgQ2hhcnQgbmFtZXNwYWNlXG5cdFx0bmFtZTogXCJEb3VnaG51dFwiLFxuXHRcdC8vUHJvdmlkaW5nIGEgZGVmYXVsdHMgd2lsbCBhbHNvIHJlZ2lzdGVyIHRoZSBkZWFmdWx0cyBpbiB0aGUgY2hhcnQgbmFtZXNwYWNlXG5cdFx0ZGVmYXVsdHMgOiBkZWZhdWx0Q29uZmlnLFxuXHRcdC8vSW5pdGlhbGl6ZSBpcyBmaXJlZCB3aGVuIHRoZSBjaGFydCBpcyBpbml0aWFsaXplZCAtIERhdGEgaXMgcGFzc2VkIGluIGFzIGEgcGFyYW1ldGVyXG5cdFx0Ly9Db25maWcgaXMgYXV0b21hdGljYWxseSBtZXJnZWQgYnkgdGhlIGNvcmUgb2YgQ2hhcnQuanMsIGFuZCBpcyBhdmFpbGFibGUgYXQgdGhpcy5vcHRpb25zXG5cdFx0aW5pdGlhbGl6ZTogIGZ1bmN0aW9uKGRhdGEpe1xuXG5cdFx0XHQvL0RlY2xhcmUgc2VnbWVudHMgYXMgYSBzdGF0aWMgcHJvcGVydHkgdG8gcHJldmVudCBpbmhlcml0aW5nIGFjcm9zcyB0aGUgQ2hhcnQgdHlwZSBwcm90b3R5cGVcblx0XHRcdHRoaXMuc2VnbWVudHMgPSBbXTtcblx0XHRcdHRoaXMub3V0ZXJSYWRpdXMgPSAoaGVscGVycy5taW4oW3RoaXMuY2hhcnQud2lkdGgsdGhpcy5jaGFydC5oZWlnaHRdKSAtXHR0aGlzLm9wdGlvbnMuc2VnbWVudFN0cm9rZVdpZHRoLzIpLzI7XG5cblx0XHRcdHRoaXMuU2VnbWVudEFyYyA9IENoYXJ0LkFyYy5leHRlbmQoe1xuXHRcdFx0XHRjdHggOiB0aGlzLmNoYXJ0LmN0eCxcblx0XHRcdFx0eCA6IHRoaXMuY2hhcnQud2lkdGgvMixcblx0XHRcdFx0eSA6IHRoaXMuY2hhcnQuaGVpZ2h0LzJcblx0XHRcdH0pO1xuXG5cdFx0XHQvL1NldCB1cCB0b29sdGlwIGV2ZW50cyBvbiB0aGUgY2hhcnRcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuc2hvd1Rvb2x0aXBzKXtcblx0XHRcdFx0aGVscGVycy5iaW5kRXZlbnRzKHRoaXMsIHRoaXMub3B0aW9ucy50b29sdGlwRXZlbnRzLCBmdW5jdGlvbihldnQpe1xuXHRcdFx0XHRcdHZhciBhY3RpdmVTZWdtZW50cyA9IChldnQudHlwZSAhPT0gJ21vdXNlb3V0JykgPyB0aGlzLmdldFNlZ21lbnRzQXRFdmVudChldnQpIDogW107XG5cblx0XHRcdFx0XHRoZWxwZXJzLmVhY2godGhpcy5zZWdtZW50cyxmdW5jdGlvbihzZWdtZW50KXtcblx0XHRcdFx0XHRcdHNlZ21lbnQucmVzdG9yZShbXCJmaWxsQ29sb3JcIl0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGhlbHBlcnMuZWFjaChhY3RpdmVTZWdtZW50cyxmdW5jdGlvbihhY3RpdmVTZWdtZW50KXtcblx0XHRcdFx0XHRcdGFjdGl2ZVNlZ21lbnQuZmlsbENvbG9yID0gYWN0aXZlU2VnbWVudC5oaWdobGlnaHRDb2xvcjtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR0aGlzLnNob3dUb29sdGlwKGFjdGl2ZVNlZ21lbnRzKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmNhbGN1bGF0ZVRvdGFsKGRhdGEpO1xuXG5cdFx0XHRoZWxwZXJzLmVhY2goZGF0YSxmdW5jdGlvbihkYXRhcG9pbnQsIGluZGV4KXtcblx0XHRcdFx0dGhpcy5hZGREYXRhKGRhdGFwb2ludCwgaW5kZXgsIHRydWUpO1xuXHRcdFx0fSx0aGlzKTtcblxuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9LFxuXHRcdGdldFNlZ21lbnRzQXRFdmVudCA6IGZ1bmN0aW9uKGUpe1xuXHRcdFx0dmFyIHNlZ21lbnRzQXJyYXkgPSBbXTtcblxuXHRcdFx0dmFyIGxvY2F0aW9uID0gaGVscGVycy5nZXRSZWxhdGl2ZVBvc2l0aW9uKGUpO1xuXG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5zZWdtZW50cyxmdW5jdGlvbihzZWdtZW50KXtcblx0XHRcdFx0aWYgKHNlZ21lbnQuaW5SYW5nZShsb2NhdGlvbi54LGxvY2F0aW9uLnkpKSBzZWdtZW50c0FycmF5LnB1c2goc2VnbWVudCk7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdFx0cmV0dXJuIHNlZ21lbnRzQXJyYXk7XG5cdFx0fSxcblx0XHRhZGREYXRhIDogZnVuY3Rpb24oc2VnbWVudCwgYXRJbmRleCwgc2lsZW50KXtcblx0XHRcdHZhciBpbmRleCA9IGF0SW5kZXggfHwgdGhpcy5zZWdtZW50cy5sZW5ndGg7XG5cdFx0XHR0aGlzLnNlZ21lbnRzLnNwbGljZShpbmRleCwgMCwgbmV3IHRoaXMuU2VnbWVudEFyYyh7XG5cdFx0XHRcdHZhbHVlIDogc2VnbWVudC52YWx1ZSxcblx0XHRcdFx0b3V0ZXJSYWRpdXMgOiAodGhpcy5vcHRpb25zLmFuaW1hdGVTY2FsZSkgPyAwIDogdGhpcy5vdXRlclJhZGl1cyxcblx0XHRcdFx0aW5uZXJSYWRpdXMgOiAodGhpcy5vcHRpb25zLmFuaW1hdGVTY2FsZSkgPyAwIDogKHRoaXMub3V0ZXJSYWRpdXMvMTAwKSAqIHRoaXMub3B0aW9ucy5wZXJjZW50YWdlSW5uZXJDdXRvdXQsXG5cdFx0XHRcdGZpbGxDb2xvciA6IHNlZ21lbnQuY29sb3IsXG5cdFx0XHRcdGhpZ2hsaWdodENvbG9yIDogc2VnbWVudC5oaWdobGlnaHQgfHwgc2VnbWVudC5jb2xvcixcblx0XHRcdFx0c2hvd1N0cm9rZSA6IHRoaXMub3B0aW9ucy5zZWdtZW50U2hvd1N0cm9rZSxcblx0XHRcdFx0c3Ryb2tlV2lkdGggOiB0aGlzLm9wdGlvbnMuc2VnbWVudFN0cm9rZVdpZHRoLFxuXHRcdFx0XHRzdHJva2VDb2xvciA6IHRoaXMub3B0aW9ucy5zZWdtZW50U3Ryb2tlQ29sb3IsXG5cdFx0XHRcdHN0YXJ0QW5nbGUgOiBNYXRoLlBJICogMS41LFxuXHRcdFx0XHRjaXJjdW1mZXJlbmNlIDogKHRoaXMub3B0aW9ucy5hbmltYXRlUm90YXRlKSA/IDAgOiB0aGlzLmNhbGN1bGF0ZUNpcmN1bWZlcmVuY2Uoc2VnbWVudC52YWx1ZSksXG5cdFx0XHRcdGxhYmVsIDogc2VnbWVudC5sYWJlbFxuXHRcdFx0fSkpO1xuXHRcdFx0aWYgKCFzaWxlbnQpe1xuXHRcdFx0XHR0aGlzLnJlZmxvdygpO1xuXHRcdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Y2FsY3VsYXRlQ2lyY3VtZmVyZW5jZSA6IGZ1bmN0aW9uKHZhbHVlKXtcblx0XHRcdHJldHVybiAoTWF0aC5QSSoyKSooTWF0aC5hYnModmFsdWUpIC8gdGhpcy50b3RhbCk7XG5cdFx0fSxcblx0XHRjYWxjdWxhdGVUb3RhbCA6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0dGhpcy50b3RhbCA9IDA7XG5cdFx0XHRoZWxwZXJzLmVhY2goZGF0YSxmdW5jdGlvbihzZWdtZW50KXtcblx0XHRcdFx0dGhpcy50b3RhbCArPSBNYXRoLmFicyhzZWdtZW50LnZhbHVlKTtcblx0XHRcdH0sdGhpcyk7XG5cdFx0fSxcblx0XHR1cGRhdGUgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5jYWxjdWxhdGVUb3RhbCh0aGlzLnNlZ21lbnRzKTtcblxuXHRcdFx0Ly8gUmVzZXQgYW55IGhpZ2hsaWdodCBjb2xvdXJzIGJlZm9yZSB1cGRhdGluZy5cblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmFjdGl2ZUVsZW1lbnRzLCBmdW5jdGlvbihhY3RpdmVFbGVtZW50KXtcblx0XHRcdFx0YWN0aXZlRWxlbWVudC5yZXN0b3JlKFsnZmlsbENvbG9yJ10pO1xuXHRcdFx0fSk7XG5cblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLnNlZ21lbnRzLGZ1bmN0aW9uKHNlZ21lbnQpe1xuXHRcdFx0XHRzZWdtZW50LnNhdmUoKTtcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9LFxuXG5cdFx0cmVtb3ZlRGF0YTogZnVuY3Rpb24oYXRJbmRleCl7XG5cdFx0XHR2YXIgaW5kZXhUb0RlbGV0ZSA9IChoZWxwZXJzLmlzTnVtYmVyKGF0SW5kZXgpKSA/IGF0SW5kZXggOiB0aGlzLnNlZ21lbnRzLmxlbmd0aC0xO1xuXHRcdFx0dGhpcy5zZWdtZW50cy5zcGxpY2UoaW5kZXhUb0RlbGV0ZSwgMSk7XG5cdFx0XHR0aGlzLnJlZmxvdygpO1xuXHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHR9LFxuXG5cdFx0cmVmbG93IDogZnVuY3Rpb24oKXtcblx0XHRcdGhlbHBlcnMuZXh0ZW5kKHRoaXMuU2VnbWVudEFyYy5wcm90b3R5cGUse1xuXHRcdFx0XHR4IDogdGhpcy5jaGFydC53aWR0aC8yLFxuXHRcdFx0XHR5IDogdGhpcy5jaGFydC5oZWlnaHQvMlxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLm91dGVyUmFkaXVzID0gKGhlbHBlcnMubWluKFt0aGlzLmNoYXJ0LndpZHRoLHRoaXMuY2hhcnQuaGVpZ2h0XSkgLVx0dGhpcy5vcHRpb25zLnNlZ21lbnRTdHJva2VXaWR0aC8yKS8yO1xuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuc2VnbWVudHMsIGZ1bmN0aW9uKHNlZ21lbnQpe1xuXHRcdFx0XHRzZWdtZW50LnVwZGF0ZSh7XG5cdFx0XHRcdFx0b3V0ZXJSYWRpdXMgOiB0aGlzLm91dGVyUmFkaXVzLFxuXHRcdFx0XHRcdGlubmVyUmFkaXVzIDogKHRoaXMub3V0ZXJSYWRpdXMvMTAwKSAqIHRoaXMub3B0aW9ucy5wZXJjZW50YWdlSW5uZXJDdXRvdXRcblx0XHRcdFx0fSk7XG5cdFx0XHR9LCB0aGlzKTtcblx0XHR9LFxuXHRcdGRyYXcgOiBmdW5jdGlvbihlYXNlRGVjaW1hbCl7XG5cdFx0XHR2YXIgYW5pbURlY2ltYWwgPSAoZWFzZURlY2ltYWwpID8gZWFzZURlY2ltYWwgOiAxO1xuXHRcdFx0dGhpcy5jbGVhcigpO1xuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuc2VnbWVudHMsZnVuY3Rpb24oc2VnbWVudCxpbmRleCl7XG5cdFx0XHRcdHNlZ21lbnQudHJhbnNpdGlvbih7XG5cdFx0XHRcdFx0Y2lyY3VtZmVyZW5jZSA6IHRoaXMuY2FsY3VsYXRlQ2lyY3VtZmVyZW5jZShzZWdtZW50LnZhbHVlKSxcblx0XHRcdFx0XHRvdXRlclJhZGl1cyA6IHRoaXMub3V0ZXJSYWRpdXMsXG5cdFx0XHRcdFx0aW5uZXJSYWRpdXMgOiAodGhpcy5vdXRlclJhZGl1cy8xMDApICogdGhpcy5vcHRpb25zLnBlcmNlbnRhZ2VJbm5lckN1dG91dFxuXHRcdFx0XHR9LGFuaW1EZWNpbWFsKTtcblxuXHRcdFx0XHRzZWdtZW50LmVuZEFuZ2xlID0gc2VnbWVudC5zdGFydEFuZ2xlICsgc2VnbWVudC5jaXJjdW1mZXJlbmNlO1xuXG5cdFx0XHRcdHNlZ21lbnQuZHJhdygpO1xuXHRcdFx0XHRpZiAoaW5kZXggPT09IDApe1xuXHRcdFx0XHRcdHNlZ21lbnQuc3RhcnRBbmdsZSA9IE1hdGguUEkgKiAxLjU7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9DaGVjayB0byBzZWUgaWYgaXQncyB0aGUgbGFzdCBzZWdtZW50LCBpZiBub3QgZ2V0IHRoZSBuZXh0IGFuZCB1cGRhdGUgdGhlIHN0YXJ0IGFuZ2xlXG5cdFx0XHRcdGlmIChpbmRleCA8IHRoaXMuc2VnbWVudHMubGVuZ3RoLTEpe1xuXHRcdFx0XHRcdHRoaXMuc2VnbWVudHNbaW5kZXgrMV0uc3RhcnRBbmdsZSA9IHNlZ21lbnQuZW5kQW5nbGU7XG5cdFx0XHRcdH1cblx0XHRcdH0sdGhpcyk7XG5cblx0XHR9XG5cdH0pO1xuXG5cdENoYXJ0LnR5cGVzLkRvdWdobnV0LmV4dGVuZCh7XG5cdFx0bmFtZSA6IFwiUGllXCIsXG5cdFx0ZGVmYXVsdHMgOiBoZWxwZXJzLm1lcmdlKGRlZmF1bHRDb25maWcse3BlcmNlbnRhZ2VJbm5lckN1dG91dCA6IDB9KVxuXHR9KTtcblxufSkuY2FsbCh0aGlzKTtcbihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgcm9vdCA9IHRoaXMsXG5cdFx0Q2hhcnQgPSByb290LkNoYXJ0LFxuXHRcdGhlbHBlcnMgPSBDaGFydC5oZWxwZXJzO1xuXG5cdHZhciBkZWZhdWx0Q29uZmlnID0ge1xuXG5cdFx0Ly8vQm9vbGVhbiAtIFdoZXRoZXIgZ3JpZCBsaW5lcyBhcmUgc2hvd24gYWNyb3NzIHRoZSBjaGFydFxuXHRcdHNjYWxlU2hvd0dyaWRMaW5lcyA6IHRydWUsXG5cblx0XHQvL1N0cmluZyAtIENvbG91ciBvZiB0aGUgZ3JpZCBsaW5lc1xuXHRcdHNjYWxlR3JpZExpbmVDb2xvciA6IFwicmdiYSgwLDAsMCwuMDUpXCIsXG5cblx0XHQvL051bWJlciAtIFdpZHRoIG9mIHRoZSBncmlkIGxpbmVzXG5cdFx0c2NhbGVHcmlkTGluZVdpZHRoIDogMSxcblxuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdG8gc2hvdyBob3Jpem9udGFsIGxpbmVzIChleGNlcHQgWCBheGlzKVxuXHRcdHNjYWxlU2hvd0hvcml6b250YWxMaW5lczogdHJ1ZSxcblxuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdG8gc2hvdyB2ZXJ0aWNhbCBsaW5lcyAoZXhjZXB0IFkgYXhpcylcblx0XHRzY2FsZVNob3dWZXJ0aWNhbExpbmVzOiB0cnVlLFxuXG5cdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB0aGUgbGluZSBpcyBjdXJ2ZWQgYmV0d2VlbiBwb2ludHNcblx0XHRiZXppZXJDdXJ2ZSA6IHRydWUsXG5cblx0XHQvL051bWJlciAtIFRlbnNpb24gb2YgdGhlIGJlemllciBjdXJ2ZSBiZXR3ZWVuIHBvaW50c1xuXHRcdGJlemllckN1cnZlVGVuc2lvbiA6IDAuNCxcblxuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdG8gc2hvdyBhIGRvdCBmb3IgZWFjaCBwb2ludFxuXHRcdHBvaW50RG90IDogdHJ1ZSxcblxuXHRcdC8vTnVtYmVyIC0gUmFkaXVzIG9mIGVhY2ggcG9pbnQgZG90IGluIHBpeGVsc1xuXHRcdHBvaW50RG90UmFkaXVzIDogNCxcblxuXHRcdC8vTnVtYmVyIC0gUGl4ZWwgd2lkdGggb2YgcG9pbnQgZG90IHN0cm9rZVxuXHRcdHBvaW50RG90U3Ryb2tlV2lkdGggOiAxLFxuXG5cdFx0Ly9OdW1iZXIgLSBhbW91bnQgZXh0cmEgdG8gYWRkIHRvIHRoZSByYWRpdXMgdG8gY2F0ZXIgZm9yIGhpdCBkZXRlY3Rpb24gb3V0c2lkZSB0aGUgZHJhd24gcG9pbnRcblx0XHRwb2ludEhpdERldGVjdGlvblJhZGl1cyA6IDIwLFxuXG5cdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB0byBzaG93IGEgc3Ryb2tlIGZvciBkYXRhc2V0c1xuXHRcdGRhdGFzZXRTdHJva2UgOiB0cnVlLFxuXG5cdFx0Ly9OdW1iZXIgLSBQaXhlbCB3aWR0aCBvZiBkYXRhc2V0IHN0cm9rZVxuXHRcdGRhdGFzZXRTdHJva2VXaWR0aCA6IDIsXG5cblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIGZpbGwgdGhlIGRhdGFzZXQgd2l0aCBhIGNvbG91clxuXHRcdGRhdGFzZXRGaWxsIDogdHJ1ZSxcblxuXHRcdC8vU3RyaW5nIC0gQSBsZWdlbmQgdGVtcGxhdGVcblx0XHRsZWdlbmRUZW1wbGF0ZSA6IFwiPHVsIGNsYXNzPVxcXCI8JT1uYW1lLnRvTG93ZXJDYXNlKCklPi1sZWdlbmRcXFwiPjwlIGZvciAodmFyIGk9MDsgaTxkYXRhc2V0cy5sZW5ndGg7IGkrKyl7JT48bGk+PHNwYW4gc3R5bGU9XFxcImJhY2tncm91bmQtY29sb3I6PCU9ZGF0YXNldHNbaV0uc3Ryb2tlQ29sb3IlPlxcXCI+PC9zcGFuPjwlaWYoZGF0YXNldHNbaV0ubGFiZWwpeyU+PCU9ZGF0YXNldHNbaV0ubGFiZWwlPjwlfSU+PC9saT48JX0lPjwvdWw+XCJcblxuXHR9O1xuXG5cblx0Q2hhcnQuVHlwZS5leHRlbmQoe1xuXHRcdG5hbWU6IFwiTGluZVwiLFxuXHRcdGRlZmF1bHRzIDogZGVmYXVsdENvbmZpZyxcblx0XHRpbml0aWFsaXplOiAgZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHQvL0RlY2xhcmUgdGhlIGV4dGVuc2lvbiBvZiB0aGUgZGVmYXVsdCBwb2ludCwgdG8gY2F0ZXIgZm9yIHRoZSBvcHRpb25zIHBhc3NlZCBpbiB0byB0aGUgY29uc3RydWN0b3Jcblx0XHRcdHRoaXMuUG9pbnRDbGFzcyA9IENoYXJ0LlBvaW50LmV4dGVuZCh7XG5cdFx0XHRcdHN0cm9rZVdpZHRoIDogdGhpcy5vcHRpb25zLnBvaW50RG90U3Ryb2tlV2lkdGgsXG5cdFx0XHRcdHJhZGl1cyA6IHRoaXMub3B0aW9ucy5wb2ludERvdFJhZGl1cyxcblx0XHRcdFx0ZGlzcGxheTogdGhpcy5vcHRpb25zLnBvaW50RG90LFxuXHRcdFx0XHRoaXREZXRlY3Rpb25SYWRpdXMgOiB0aGlzLm9wdGlvbnMucG9pbnRIaXREZXRlY3Rpb25SYWRpdXMsXG5cdFx0XHRcdGN0eCA6IHRoaXMuY2hhcnQuY3R4LFxuXHRcdFx0XHRpblJhbmdlIDogZnVuY3Rpb24obW91c2VYKXtcblx0XHRcdFx0XHRyZXR1cm4gKE1hdGgucG93KG1vdXNlWC10aGlzLngsIDIpIDwgTWF0aC5wb3codGhpcy5yYWRpdXMgKyB0aGlzLmhpdERldGVjdGlvblJhZGl1cywyKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLmRhdGFzZXRzID0gW107XG5cblx0XHRcdC8vU2V0IHVwIHRvb2x0aXAgZXZlbnRzIG9uIHRoZSBjaGFydFxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5zaG93VG9vbHRpcHMpe1xuXHRcdFx0XHRoZWxwZXJzLmJpbmRFdmVudHModGhpcywgdGhpcy5vcHRpb25zLnRvb2x0aXBFdmVudHMsIGZ1bmN0aW9uKGV2dCl7XG5cdFx0XHRcdFx0dmFyIGFjdGl2ZVBvaW50cyA9IChldnQudHlwZSAhPT0gJ21vdXNlb3V0JykgPyB0aGlzLmdldFBvaW50c0F0RXZlbnQoZXZ0KSA6IFtdO1xuXHRcdFx0XHRcdHRoaXMuZWFjaFBvaW50cyhmdW5jdGlvbihwb2ludCl7XG5cdFx0XHRcdFx0XHRwb2ludC5yZXN0b3JlKFsnZmlsbENvbG9yJywgJ3N0cm9rZUNvbG9yJ10pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGhlbHBlcnMuZWFjaChhY3RpdmVQb2ludHMsIGZ1bmN0aW9uKGFjdGl2ZVBvaW50KXtcblx0XHRcdFx0XHRcdGFjdGl2ZVBvaW50LmZpbGxDb2xvciA9IGFjdGl2ZVBvaW50LmhpZ2hsaWdodEZpbGw7XG5cdFx0XHRcdFx0XHRhY3RpdmVQb2ludC5zdHJva2VDb2xvciA9IGFjdGl2ZVBvaW50LmhpZ2hsaWdodFN0cm9rZTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR0aGlzLnNob3dUb29sdGlwKGFjdGl2ZVBvaW50cyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHQvL0l0ZXJhdGUgdGhyb3VnaCBlYWNoIG9mIHRoZSBkYXRhc2V0cywgYW5kIGJ1aWxkIHRoaXMgaW50byBhIHByb3BlcnR5IG9mIHRoZSBjaGFydFxuXHRcdFx0aGVscGVycy5lYWNoKGRhdGEuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCl7XG5cblx0XHRcdFx0dmFyIGRhdGFzZXRPYmplY3QgPSB7XG5cdFx0XHRcdFx0bGFiZWwgOiBkYXRhc2V0LmxhYmVsIHx8IG51bGwsXG5cdFx0XHRcdFx0ZmlsbENvbG9yIDogZGF0YXNldC5maWxsQ29sb3IsXG5cdFx0XHRcdFx0c3Ryb2tlQ29sb3IgOiBkYXRhc2V0LnN0cm9rZUNvbG9yLFxuXHRcdFx0XHRcdHBvaW50Q29sb3IgOiBkYXRhc2V0LnBvaW50Q29sb3IsXG5cdFx0XHRcdFx0cG9pbnRTdHJva2VDb2xvciA6IGRhdGFzZXQucG9pbnRTdHJva2VDb2xvcixcblx0XHRcdFx0XHRwb2ludHMgOiBbXVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHRoaXMuZGF0YXNldHMucHVzaChkYXRhc2V0T2JqZWN0KTtcblxuXG5cdFx0XHRcdGhlbHBlcnMuZWFjaChkYXRhc2V0LmRhdGEsZnVuY3Rpb24oZGF0YVBvaW50LGluZGV4KXtcblx0XHRcdFx0XHQvL0FkZCBhIG5ldyBwb2ludCBmb3IgZWFjaCBwaWVjZSBvZiBkYXRhLCBwYXNzaW5nIGFueSByZXF1aXJlZCBkYXRhIHRvIGRyYXcuXG5cdFx0XHRcdFx0ZGF0YXNldE9iamVjdC5wb2ludHMucHVzaChuZXcgdGhpcy5Qb2ludENsYXNzKHtcblx0XHRcdFx0XHRcdHZhbHVlIDogZGF0YVBvaW50LFxuXHRcdFx0XHRcdFx0bGFiZWwgOiBkYXRhLmxhYmVsc1tpbmRleF0sXG5cdFx0XHRcdFx0XHRkYXRhc2V0TGFiZWw6IGRhdGFzZXQubGFiZWwsXG5cdFx0XHRcdFx0XHRzdHJva2VDb2xvciA6IGRhdGFzZXQucG9pbnRTdHJva2VDb2xvcixcblx0XHRcdFx0XHRcdGZpbGxDb2xvciA6IGRhdGFzZXQucG9pbnRDb2xvcixcblx0XHRcdFx0XHRcdGhpZ2hsaWdodEZpbGwgOiBkYXRhc2V0LnBvaW50SGlnaGxpZ2h0RmlsbCB8fCBkYXRhc2V0LnBvaW50Q29sb3IsXG5cdFx0XHRcdFx0XHRoaWdobGlnaHRTdHJva2UgOiBkYXRhc2V0LnBvaW50SGlnaGxpZ2h0U3Ryb2tlIHx8IGRhdGFzZXQucG9pbnRTdHJva2VDb2xvclxuXHRcdFx0XHRcdH0pKTtcblx0XHRcdFx0fSx0aGlzKTtcblxuXHRcdFx0XHR0aGlzLmJ1aWxkU2NhbGUoZGF0YS5sYWJlbHMpO1xuXG5cblx0XHRcdFx0dGhpcy5lYWNoUG9pbnRzKGZ1bmN0aW9uKHBvaW50LCBpbmRleCl7XG5cdFx0XHRcdFx0aGVscGVycy5leHRlbmQocG9pbnQsIHtcblx0XHRcdFx0XHRcdHg6IHRoaXMuc2NhbGUuY2FsY3VsYXRlWChpbmRleCksXG5cdFx0XHRcdFx0XHR5OiB0aGlzLnNjYWxlLmVuZFBvaW50XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cG9pbnQuc2F2ZSgpO1xuXHRcdFx0XHR9LCB0aGlzKTtcblxuXHRcdFx0fSx0aGlzKTtcblxuXG5cdFx0XHR0aGlzLnJlbmRlcigpO1xuXHRcdH0sXG5cdFx0dXBkYXRlIDogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuc2NhbGUudXBkYXRlKCk7XG5cdFx0XHQvLyBSZXNldCBhbnkgaGlnaGxpZ2h0IGNvbG91cnMgYmVmb3JlIHVwZGF0aW5nLlxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuYWN0aXZlRWxlbWVudHMsIGZ1bmN0aW9uKGFjdGl2ZUVsZW1lbnQpe1xuXHRcdFx0XHRhY3RpdmVFbGVtZW50LnJlc3RvcmUoWydmaWxsQ29sb3InLCAnc3Ryb2tlQ29sb3InXSk7XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuZWFjaFBvaW50cyhmdW5jdGlvbihwb2ludCl7XG5cdFx0XHRcdHBvaW50LnNhdmUoKTtcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9LFxuXHRcdGVhY2hQb2ludHMgOiBmdW5jdGlvbihjYWxsYmFjayl7XG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5kYXRhc2V0cyxmdW5jdGlvbihkYXRhc2V0KXtcblx0XHRcdFx0aGVscGVycy5lYWNoKGRhdGFzZXQucG9pbnRzLGNhbGxiYWNrLHRoaXMpO1xuXHRcdFx0fSx0aGlzKTtcblx0XHR9LFxuXHRcdGdldFBvaW50c0F0RXZlbnQgOiBmdW5jdGlvbihlKXtcblx0XHRcdHZhciBwb2ludHNBcnJheSA9IFtdLFxuXHRcdFx0XHRldmVudFBvc2l0aW9uID0gaGVscGVycy5nZXRSZWxhdGl2ZVBvc2l0aW9uKGUpO1xuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCl7XG5cdFx0XHRcdGhlbHBlcnMuZWFjaChkYXRhc2V0LnBvaW50cyxmdW5jdGlvbihwb2ludCl7XG5cdFx0XHRcdFx0aWYgKHBvaW50LmluUmFuZ2UoZXZlbnRQb3NpdGlvbi54LGV2ZW50UG9zaXRpb24ueSkpIHBvaW50c0FycmF5LnB1c2gocG9pbnQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sdGhpcyk7XG5cdFx0XHRyZXR1cm4gcG9pbnRzQXJyYXk7XG5cdFx0fSxcblx0XHRidWlsZFNjYWxlIDogZnVuY3Rpb24obGFiZWxzKXtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdFx0dmFyIGRhdGFUb3RhbCA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciB2YWx1ZXMgPSBbXTtcblx0XHRcdFx0c2VsZi5lYWNoUG9pbnRzKGZ1bmN0aW9uKHBvaW50KXtcblx0XHRcdFx0XHR2YWx1ZXMucHVzaChwb2ludC52YWx1ZSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHJldHVybiB2YWx1ZXM7XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgc2NhbGVPcHRpb25zID0ge1xuXHRcdFx0XHR0ZW1wbGF0ZVN0cmluZyA6IHRoaXMub3B0aW9ucy5zY2FsZUxhYmVsLFxuXHRcdFx0XHRoZWlnaHQgOiB0aGlzLmNoYXJ0LmhlaWdodCxcblx0XHRcdFx0d2lkdGggOiB0aGlzLmNoYXJ0LndpZHRoLFxuXHRcdFx0XHRjdHggOiB0aGlzLmNoYXJ0LmN0eCxcblx0XHRcdFx0dGV4dENvbG9yIDogdGhpcy5vcHRpb25zLnNjYWxlRm9udENvbG9yLFxuXHRcdFx0XHRmb250U2l6ZSA6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTaXplLFxuXHRcdFx0XHRmb250U3R5bGUgOiB0aGlzLm9wdGlvbnMuc2NhbGVGb250U3R5bGUsXG5cdFx0XHRcdGZvbnRGYW1pbHkgOiB0aGlzLm9wdGlvbnMuc2NhbGVGb250RmFtaWx5LFxuXHRcdFx0XHR2YWx1ZXNDb3VudCA6IGxhYmVscy5sZW5ndGgsXG5cdFx0XHRcdGJlZ2luQXRaZXJvIDogdGhpcy5vcHRpb25zLnNjYWxlQmVnaW5BdFplcm8sXG5cdFx0XHRcdGludGVnZXJzT25seSA6IHRoaXMub3B0aW9ucy5zY2FsZUludGVnZXJzT25seSxcblx0XHRcdFx0Y2FsY3VsYXRlWVJhbmdlIDogZnVuY3Rpb24oY3VycmVudEhlaWdodCl7XG5cdFx0XHRcdFx0dmFyIHVwZGF0ZWRSYW5nZXMgPSBoZWxwZXJzLmNhbGN1bGF0ZVNjYWxlUmFuZ2UoXG5cdFx0XHRcdFx0XHRkYXRhVG90YWwoKSxcblx0XHRcdFx0XHRcdGN1cnJlbnRIZWlnaHQsXG5cdFx0XHRcdFx0XHR0aGlzLmZvbnRTaXplLFxuXHRcdFx0XHRcdFx0dGhpcy5iZWdpbkF0WmVybyxcblx0XHRcdFx0XHRcdHRoaXMuaW50ZWdlcnNPbmx5XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRoZWxwZXJzLmV4dGVuZCh0aGlzLCB1cGRhdGVkUmFuZ2VzKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0eExhYmVscyA6IGxhYmVscyxcblx0XHRcdFx0Zm9udCA6IGhlbHBlcnMuZm9udFN0cmluZyh0aGlzLm9wdGlvbnMuc2NhbGVGb250U2l6ZSwgdGhpcy5vcHRpb25zLnNjYWxlRm9udFN0eWxlLCB0aGlzLm9wdGlvbnMuc2NhbGVGb250RmFtaWx5KSxcblx0XHRcdFx0bGluZVdpZHRoIDogdGhpcy5vcHRpb25zLnNjYWxlTGluZVdpZHRoLFxuXHRcdFx0XHRsaW5lQ29sb3IgOiB0aGlzLm9wdGlvbnMuc2NhbGVMaW5lQ29sb3IsXG5cdFx0XHRcdHNob3dIb3Jpem9udGFsTGluZXMgOiB0aGlzLm9wdGlvbnMuc2NhbGVTaG93SG9yaXpvbnRhbExpbmVzLFxuXHRcdFx0XHRzaG93VmVydGljYWxMaW5lcyA6IHRoaXMub3B0aW9ucy5zY2FsZVNob3dWZXJ0aWNhbExpbmVzLFxuXHRcdFx0XHRncmlkTGluZVdpZHRoIDogKHRoaXMub3B0aW9ucy5zY2FsZVNob3dHcmlkTGluZXMpID8gdGhpcy5vcHRpb25zLnNjYWxlR3JpZExpbmVXaWR0aCA6IDAsXG5cdFx0XHRcdGdyaWRMaW5lQ29sb3IgOiAodGhpcy5vcHRpb25zLnNjYWxlU2hvd0dyaWRMaW5lcykgPyB0aGlzLm9wdGlvbnMuc2NhbGVHcmlkTGluZUNvbG9yIDogXCJyZ2JhKDAsMCwwLDApXCIsXG5cdFx0XHRcdHBhZGRpbmc6ICh0aGlzLm9wdGlvbnMuc2hvd1NjYWxlKSA/IDAgOiB0aGlzLm9wdGlvbnMucG9pbnREb3RSYWRpdXMgKyB0aGlzLm9wdGlvbnMucG9pbnREb3RTdHJva2VXaWR0aCxcblx0XHRcdFx0c2hvd0xhYmVscyA6IHRoaXMub3B0aW9ucy5zY2FsZVNob3dMYWJlbHMsXG5cdFx0XHRcdGRpc3BsYXkgOiB0aGlzLm9wdGlvbnMuc2hvd1NjYWxlXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLnNjYWxlT3ZlcnJpZGUpe1xuXHRcdFx0XHRoZWxwZXJzLmV4dGVuZChzY2FsZU9wdGlvbnMsIHtcblx0XHRcdFx0XHRjYWxjdWxhdGVZUmFuZ2U6IGhlbHBlcnMubm9vcCxcblx0XHRcdFx0XHRzdGVwczogdGhpcy5vcHRpb25zLnNjYWxlU3RlcHMsXG5cdFx0XHRcdFx0c3RlcFZhbHVlOiB0aGlzLm9wdGlvbnMuc2NhbGVTdGVwV2lkdGgsXG5cdFx0XHRcdFx0bWluOiB0aGlzLm9wdGlvbnMuc2NhbGVTdGFydFZhbHVlLFxuXHRcdFx0XHRcdG1heDogdGhpcy5vcHRpb25zLnNjYWxlU3RhcnRWYWx1ZSArICh0aGlzLm9wdGlvbnMuc2NhbGVTdGVwcyAqIHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBXaWR0aClcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblxuXHRcdFx0dGhpcy5zY2FsZSA9IG5ldyBDaGFydC5TY2FsZShzY2FsZU9wdGlvbnMpO1xuXHRcdH0sXG5cdFx0YWRkRGF0YSA6IGZ1bmN0aW9uKHZhbHVlc0FycmF5LGxhYmVsKXtcblx0XHRcdC8vTWFwIHRoZSB2YWx1ZXMgYXJyYXkgZm9yIGVhY2ggb2YgdGhlIGRhdGFzZXRzXG5cblx0XHRcdGhlbHBlcnMuZWFjaCh2YWx1ZXNBcnJheSxmdW5jdGlvbih2YWx1ZSxkYXRhc2V0SW5kZXgpe1xuXHRcdFx0XHQvL0FkZCBhIG5ldyBwb2ludCBmb3IgZWFjaCBwaWVjZSBvZiBkYXRhLCBwYXNzaW5nIGFueSByZXF1aXJlZCBkYXRhIHRvIGRyYXcuXG5cdFx0XHRcdHRoaXMuZGF0YXNldHNbZGF0YXNldEluZGV4XS5wb2ludHMucHVzaChuZXcgdGhpcy5Qb2ludENsYXNzKHtcblx0XHRcdFx0XHR2YWx1ZSA6IHZhbHVlLFxuXHRcdFx0XHRcdGxhYmVsIDogbGFiZWwsXG5cdFx0XHRcdFx0eDogdGhpcy5zY2FsZS5jYWxjdWxhdGVYKHRoaXMuc2NhbGUudmFsdWVzQ291bnQrMSksXG5cdFx0XHRcdFx0eTogdGhpcy5zY2FsZS5lbmRQb2ludCxcblx0XHRcdFx0XHRzdHJva2VDb2xvciA6IHRoaXMuZGF0YXNldHNbZGF0YXNldEluZGV4XS5wb2ludFN0cm9rZUNvbG9yLFxuXHRcdFx0XHRcdGZpbGxDb2xvciA6IHRoaXMuZGF0YXNldHNbZGF0YXNldEluZGV4XS5wb2ludENvbG9yXG5cdFx0XHRcdH0pKTtcblx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdHRoaXMuc2NhbGUuYWRkWExhYmVsKGxhYmVsKTtcblx0XHRcdC8vVGhlbiByZS1yZW5kZXIgdGhlIGNoYXJ0LlxuXHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHR9LFxuXHRcdHJlbW92ZURhdGEgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5zY2FsZS5yZW1vdmVYTGFiZWwoKTtcblx0XHRcdC8vVGhlbiByZS1yZW5kZXIgdGhlIGNoYXJ0LlxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCl7XG5cdFx0XHRcdGRhdGFzZXQucG9pbnRzLnNoaWZ0KCk7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHR9LFxuXHRcdHJlZmxvdyA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgbmV3U2NhbGVQcm9wcyA9IGhlbHBlcnMuZXh0ZW5kKHtcblx0XHRcdFx0aGVpZ2h0IDogdGhpcy5jaGFydC5oZWlnaHQsXG5cdFx0XHRcdHdpZHRoIDogdGhpcy5jaGFydC53aWR0aFxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnNjYWxlLnVwZGF0ZShuZXdTY2FsZVByb3BzKTtcblx0XHR9LFxuXHRcdGRyYXcgOiBmdW5jdGlvbihlYXNlKXtcblx0XHRcdHZhciBlYXNpbmdEZWNpbWFsID0gZWFzZSB8fCAxO1xuXHRcdFx0dGhpcy5jbGVhcigpO1xuXG5cdFx0XHR2YXIgY3R4ID0gdGhpcy5jaGFydC5jdHg7XG5cblx0XHRcdC8vIFNvbWUgaGVscGVyIG1ldGhvZHMgZm9yIGdldHRpbmcgdGhlIG5leHQvcHJldiBwb2ludHNcblx0XHRcdHZhciBoYXNWYWx1ZSA9IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHRyZXR1cm4gaXRlbS52YWx1ZSAhPT0gbnVsbDtcblx0XHRcdH0sXG5cdFx0XHRuZXh0UG9pbnQgPSBmdW5jdGlvbihwb2ludCwgY29sbGVjdGlvbiwgaW5kZXgpe1xuXHRcdFx0XHRyZXR1cm4gaGVscGVycy5maW5kTmV4dFdoZXJlKGNvbGxlY3Rpb24sIGhhc1ZhbHVlLCBpbmRleCkgfHwgcG9pbnQ7XG5cdFx0XHR9LFxuXHRcdFx0cHJldmlvdXNQb2ludCA9IGZ1bmN0aW9uKHBvaW50LCBjb2xsZWN0aW9uLCBpbmRleCl7XG5cdFx0XHRcdHJldHVybiBoZWxwZXJzLmZpbmRQcmV2aW91c1doZXJlKGNvbGxlY3Rpb24sIGhhc1ZhbHVlLCBpbmRleCkgfHwgcG9pbnQ7XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLnNjYWxlLmRyYXcoZWFzaW5nRGVjaW1hbCk7XG5cblxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCl7XG5cdFx0XHRcdHZhciBwb2ludHNXaXRoVmFsdWVzID0gaGVscGVycy53aGVyZShkYXRhc2V0LnBvaW50cywgaGFzVmFsdWUpO1xuXG5cdFx0XHRcdC8vVHJhbnNpdGlvbiBlYWNoIHBvaW50IGZpcnN0IHNvIHRoYXQgdGhlIGxpbmUgYW5kIHBvaW50IGRyYXdpbmcgaXNuJ3Qgb3V0IG9mIHN5bmNcblx0XHRcdFx0Ly9XZSBjYW4gdXNlIHRoaXMgZXh0cmEgbG9vcCB0byBjYWxjdWxhdGUgdGhlIGNvbnRyb2wgcG9pbnRzIG9mIHRoaXMgZGF0YXNldCBhbHNvIGluIHRoaXMgbG9vcFxuXG5cdFx0XHRcdGhlbHBlcnMuZWFjaChkYXRhc2V0LnBvaW50cywgZnVuY3Rpb24ocG9pbnQsIGluZGV4KXtcblx0XHRcdFx0XHRpZiAocG9pbnQuaGFzVmFsdWUoKSl7XG5cdFx0XHRcdFx0XHRwb2ludC50cmFuc2l0aW9uKHtcblx0XHRcdFx0XHRcdFx0eSA6IHRoaXMuc2NhbGUuY2FsY3VsYXRlWShwb2ludC52YWx1ZSksXG5cdFx0XHRcdFx0XHRcdHggOiB0aGlzLnNjYWxlLmNhbGN1bGF0ZVgoaW5kZXgpXG5cdFx0XHRcdFx0XHR9LCBlYXNpbmdEZWNpbWFsKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sdGhpcyk7XG5cblxuXHRcdFx0XHQvLyBDb250cm9sIHBvaW50cyBuZWVkIHRvIGJlIGNhbGN1bGF0ZWQgaW4gYSBzZXBlcmF0ZSBsb29wLCBiZWNhdXNlIHdlIG5lZWQgdG8ga25vdyB0aGUgY3VycmVudCB4L3kgb2YgdGhlIHBvaW50XG5cdFx0XHRcdC8vIFRoaXMgd291bGQgY2F1c2UgaXNzdWVzIHdoZW4gdGhlcmUgaXMgbm8gYW5pbWF0aW9uLCBiZWNhdXNlIHRoZSB5IG9mIHRoZSBuZXh0IHBvaW50IHdvdWxkIGJlIDAsIHNvIGJlemllcnMgd291bGQgYmUgc2tld2VkXG5cdFx0XHRcdGlmICh0aGlzLm9wdGlvbnMuYmV6aWVyQ3VydmUpe1xuXHRcdFx0XHRcdGhlbHBlcnMuZWFjaChwb2ludHNXaXRoVmFsdWVzLCBmdW5jdGlvbihwb2ludCwgaW5kZXgpe1xuXHRcdFx0XHRcdFx0dmFyIHRlbnNpb24gPSAoaW5kZXggPiAwICYmIGluZGV4IDwgcG9pbnRzV2l0aFZhbHVlcy5sZW5ndGggLSAxKSA/IHRoaXMub3B0aW9ucy5iZXppZXJDdXJ2ZVRlbnNpb24gOiAwO1xuXHRcdFx0XHRcdFx0cG9pbnQuY29udHJvbFBvaW50cyA9IGhlbHBlcnMuc3BsaW5lQ3VydmUoXG5cdFx0XHRcdFx0XHRcdHByZXZpb3VzUG9pbnQocG9pbnQsIHBvaW50c1dpdGhWYWx1ZXMsIGluZGV4KSxcblx0XHRcdFx0XHRcdFx0cG9pbnQsXG5cdFx0XHRcdFx0XHRcdG5leHRQb2ludChwb2ludCwgcG9pbnRzV2l0aFZhbHVlcywgaW5kZXgpLFxuXHRcdFx0XHRcdFx0XHR0ZW5zaW9uXG5cdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0XHQvLyBQcmV2ZW50IHRoZSBiZXppZXIgZ29pbmcgb3V0c2lkZSBvZiB0aGUgYm91bmRzIG9mIHRoZSBncmFwaFxuXG5cdFx0XHRcdFx0XHQvLyBDYXAgcHV0ZXIgYmV6aWVyIGhhbmRsZXMgdG8gdGhlIHVwcGVyL2xvd2VyIHNjYWxlIGJvdW5kc1xuXHRcdFx0XHRcdFx0aWYgKHBvaW50LmNvbnRyb2xQb2ludHMub3V0ZXIueSA+IHRoaXMuc2NhbGUuZW5kUG9pbnQpe1xuXHRcdFx0XHRcdFx0XHRwb2ludC5jb250cm9sUG9pbnRzLm91dGVyLnkgPSB0aGlzLnNjYWxlLmVuZFBvaW50O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAocG9pbnQuY29udHJvbFBvaW50cy5vdXRlci55IDwgdGhpcy5zY2FsZS5zdGFydFBvaW50KXtcblx0XHRcdFx0XHRcdFx0cG9pbnQuY29udHJvbFBvaW50cy5vdXRlci55ID0gdGhpcy5zY2FsZS5zdGFydFBvaW50O1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBDYXAgaW5uZXIgYmV6aWVyIGhhbmRsZXMgdG8gdGhlIHVwcGVyL2xvd2VyIHNjYWxlIGJvdW5kc1xuXHRcdFx0XHRcdFx0aWYgKHBvaW50LmNvbnRyb2xQb2ludHMuaW5uZXIueSA+IHRoaXMuc2NhbGUuZW5kUG9pbnQpe1xuXHRcdFx0XHRcdFx0XHRwb2ludC5jb250cm9sUG9pbnRzLmlubmVyLnkgPSB0aGlzLnNjYWxlLmVuZFBvaW50O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAocG9pbnQuY29udHJvbFBvaW50cy5pbm5lci55IDwgdGhpcy5zY2FsZS5zdGFydFBvaW50KXtcblx0XHRcdFx0XHRcdFx0cG9pbnQuY29udHJvbFBvaW50cy5pbm5lci55ID0gdGhpcy5zY2FsZS5zdGFydFBvaW50O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sdGhpcyk7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdC8vRHJhdyB0aGUgbGluZSBiZXR3ZWVuIGFsbCB0aGUgcG9pbnRzXG5cdFx0XHRcdGN0eC5saW5lV2lkdGggPSB0aGlzLm9wdGlvbnMuZGF0YXNldFN0cm9rZVdpZHRoO1xuXHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSBkYXRhc2V0LnN0cm9rZUNvbG9yO1xuXHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cblx0XHRcdFx0aGVscGVycy5lYWNoKHBvaW50c1dpdGhWYWx1ZXMsIGZ1bmN0aW9uKHBvaW50LCBpbmRleCl7XG5cdFx0XHRcdFx0aWYgKGluZGV4ID09PSAwKXtcblx0XHRcdFx0XHRcdGN0eC5tb3ZlVG8ocG9pbnQueCwgcG9pbnQueSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRpZih0aGlzLm9wdGlvbnMuYmV6aWVyQ3VydmUpe1xuXHRcdFx0XHRcdFx0XHR2YXIgcHJldmlvdXMgPSBwcmV2aW91c1BvaW50KHBvaW50LCBwb2ludHNXaXRoVmFsdWVzLCBpbmRleCk7XG5cblx0XHRcdFx0XHRcdFx0Y3R4LmJlemllckN1cnZlVG8oXG5cdFx0XHRcdFx0XHRcdFx0cHJldmlvdXMuY29udHJvbFBvaW50cy5vdXRlci54LFxuXHRcdFx0XHRcdFx0XHRcdHByZXZpb3VzLmNvbnRyb2xQb2ludHMub3V0ZXIueSxcblx0XHRcdFx0XHRcdFx0XHRwb2ludC5jb250cm9sUG9pbnRzLmlubmVyLngsXG5cdFx0XHRcdFx0XHRcdFx0cG9pbnQuY29udHJvbFBvaW50cy5pbm5lci55LFxuXHRcdFx0XHRcdFx0XHRcdHBvaW50LngsXG5cdFx0XHRcdFx0XHRcdFx0cG9pbnQueVxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0Y3R4LmxpbmVUbyhwb2ludC54LHBvaW50LnkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgdGhpcyk7XG5cblx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXG5cdFx0XHRcdGlmICh0aGlzLm9wdGlvbnMuZGF0YXNldEZpbGwgJiYgcG9pbnRzV2l0aFZhbHVlcy5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHQvL1JvdW5kIG9mZiB0aGUgbGluZSBieSBnb2luZyB0byB0aGUgYmFzZSBvZiB0aGUgY2hhcnQsIGJhY2sgdG8gdGhlIHN0YXJ0LCB0aGVuIGZpbGwuXG5cdFx0XHRcdFx0Y3R4LmxpbmVUbyhwb2ludHNXaXRoVmFsdWVzW3BvaW50c1dpdGhWYWx1ZXMubGVuZ3RoIC0gMV0ueCwgdGhpcy5zY2FsZS5lbmRQb2ludCk7XG5cdFx0XHRcdFx0Y3R4LmxpbmVUbyhwb2ludHNXaXRoVmFsdWVzWzBdLngsIHRoaXMuc2NhbGUuZW5kUG9pbnQpO1xuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSBkYXRhc2V0LmZpbGxDb2xvcjtcblx0XHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vTm93IGRyYXcgdGhlIHBvaW50cyBvdmVyIHRoZSBsaW5lXG5cdFx0XHRcdC8vQSBsaXR0bGUgaW5lZmZpY2llbnQgZG91YmxlIGxvb3BpbmcsIGJ1dCBiZXR0ZXIgdGhhbiB0aGUgbGluZVxuXHRcdFx0XHQvL2xhZ2dpbmcgYmVoaW5kIHRoZSBwb2ludCBwb3NpdGlvbnNcblx0XHRcdFx0aGVscGVycy5lYWNoKHBvaW50c1dpdGhWYWx1ZXMsZnVuY3Rpb24ocG9pbnQpe1xuXHRcdFx0XHRcdHBvaW50LmRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdH1cblx0fSk7XG5cblxufSkuY2FsbCh0aGlzKTtcblxuKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciByb290ID0gdGhpcyxcblx0XHRDaGFydCA9IHJvb3QuQ2hhcnQsXG5cdFx0Ly9DYWNoZSBhIGxvY2FsIHJlZmVyZW5jZSB0byBDaGFydC5oZWxwZXJzXG5cdFx0aGVscGVycyA9IENoYXJ0LmhlbHBlcnM7XG5cblx0dmFyIGRlZmF1bHRDb25maWcgPSB7XG5cdFx0Ly9Cb29sZWFuIC0gU2hvdyBhIGJhY2tkcm9wIHRvIHRoZSBzY2FsZSBsYWJlbFxuXHRcdHNjYWxlU2hvd0xhYmVsQmFja2Ryb3AgOiB0cnVlLFxuXG5cdFx0Ly9TdHJpbmcgLSBUaGUgY29sb3VyIG9mIHRoZSBsYWJlbCBiYWNrZHJvcFxuXHRcdHNjYWxlQmFja2Ryb3BDb2xvciA6IFwicmdiYSgyNTUsMjU1LDI1NSwwLjc1KVwiLFxuXG5cdFx0Ly8gQm9vbGVhbiAtIFdoZXRoZXIgdGhlIHNjYWxlIHNob3VsZCBiZWdpbiBhdCB6ZXJvXG5cdFx0c2NhbGVCZWdpbkF0WmVybyA6IHRydWUsXG5cblx0XHQvL051bWJlciAtIFRoZSBiYWNrZHJvcCBwYWRkaW5nIGFib3ZlICYgYmVsb3cgdGhlIGxhYmVsIGluIHBpeGVsc1xuXHRcdHNjYWxlQmFja2Ryb3BQYWRkaW5nWSA6IDIsXG5cblx0XHQvL051bWJlciAtIFRoZSBiYWNrZHJvcCBwYWRkaW5nIHRvIHRoZSBzaWRlIG9mIHRoZSBsYWJlbCBpbiBwaXhlbHNcblx0XHRzY2FsZUJhY2tkcm9wUGFkZGluZ1ggOiAyLFxuXG5cdFx0Ly9Cb29sZWFuIC0gU2hvdyBsaW5lIGZvciBlYWNoIHZhbHVlIGluIHRoZSBzY2FsZVxuXHRcdHNjYWxlU2hvd0xpbmUgOiB0cnVlLFxuXG5cdFx0Ly9Cb29sZWFuIC0gU3Ryb2tlIGEgbGluZSBhcm91bmQgZWFjaCBzZWdtZW50IGluIHRoZSBjaGFydFxuXHRcdHNlZ21lbnRTaG93U3Ryb2tlIDogdHJ1ZSxcblxuXHRcdC8vU3RyaW5nIC0gVGhlIGNvbG91ciBvZiB0aGUgc3Ryb2tlIG9uIGVhY2ggc2VnZW1lbnQuXG5cdFx0c2VnbWVudFN0cm9rZUNvbG9yIDogXCIjZmZmXCIsXG5cblx0XHQvL051bWJlciAtIFRoZSB3aWR0aCBvZiB0aGUgc3Ryb2tlIHZhbHVlIGluIHBpeGVsc1xuXHRcdHNlZ21lbnRTdHJva2VXaWR0aCA6IDIsXG5cblx0XHQvL051bWJlciAtIEFtb3VudCBvZiBhbmltYXRpb24gc3RlcHNcblx0XHRhbmltYXRpb25TdGVwcyA6IDEwMCxcblxuXHRcdC8vU3RyaW5nIC0gQW5pbWF0aW9uIGVhc2luZyBlZmZlY3QuXG5cdFx0YW5pbWF0aW9uRWFzaW5nIDogXCJlYXNlT3V0Qm91bmNlXCIsXG5cblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIGFuaW1hdGUgdGhlIHJvdGF0aW9uIG9mIHRoZSBjaGFydFxuXHRcdGFuaW1hdGVSb3RhdGUgOiB0cnVlLFxuXG5cdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB0byBhbmltYXRlIHNjYWxpbmcgdGhlIGNoYXJ0IGZyb20gdGhlIGNlbnRyZVxuXHRcdGFuaW1hdGVTY2FsZSA6IGZhbHNlLFxuXG5cdFx0Ly9TdHJpbmcgLSBBIGxlZ2VuZCB0ZW1wbGF0ZVxuXHRcdGxlZ2VuZFRlbXBsYXRlIDogXCI8dWwgY2xhc3M9XFxcIjwlPW5hbWUudG9Mb3dlckNhc2UoKSU+LWxlZ2VuZFxcXCI+PCUgZm9yICh2YXIgaT0wOyBpPHNlZ21lbnRzLmxlbmd0aDsgaSsrKXslPjxsaT48c3BhbiBzdHlsZT1cXFwiYmFja2dyb3VuZC1jb2xvcjo8JT1zZWdtZW50c1tpXS5maWxsQ29sb3IlPlxcXCI+PC9zcGFuPjwlaWYoc2VnbWVudHNbaV0ubGFiZWwpeyU+PCU9c2VnbWVudHNbaV0ubGFiZWwlPjwlfSU+PC9saT48JX0lPjwvdWw+XCJcblx0fTtcblxuXG5cdENoYXJ0LlR5cGUuZXh0ZW5kKHtcblx0XHQvL1Bhc3NpbmcgaW4gYSBuYW1lIHJlZ2lzdGVycyB0aGlzIGNoYXJ0IGluIHRoZSBDaGFydCBuYW1lc3BhY2Vcblx0XHRuYW1lOiBcIlBvbGFyQXJlYVwiLFxuXHRcdC8vUHJvdmlkaW5nIGEgZGVmYXVsdHMgd2lsbCBhbHNvIHJlZ2lzdGVyIHRoZSBkZWFmdWx0cyBpbiB0aGUgY2hhcnQgbmFtZXNwYWNlXG5cdFx0ZGVmYXVsdHMgOiBkZWZhdWx0Q29uZmlnLFxuXHRcdC8vSW5pdGlhbGl6ZSBpcyBmaXJlZCB3aGVuIHRoZSBjaGFydCBpcyBpbml0aWFsaXplZCAtIERhdGEgaXMgcGFzc2VkIGluIGFzIGEgcGFyYW1ldGVyXG5cdFx0Ly9Db25maWcgaXMgYXV0b21hdGljYWxseSBtZXJnZWQgYnkgdGhlIGNvcmUgb2YgQ2hhcnQuanMsIGFuZCBpcyBhdmFpbGFibGUgYXQgdGhpcy5vcHRpb25zXG5cdFx0aW5pdGlhbGl6ZTogIGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0dGhpcy5zZWdtZW50cyA9IFtdO1xuXHRcdFx0Ly9EZWNsYXJlIHNlZ21lbnQgY2xhc3MgYXMgYSBjaGFydCBpbnN0YW5jZSBzcGVjaWZpYyBjbGFzcywgc28gaXQgY2FuIHNoYXJlIHByb3BzIGZvciB0aGlzIGluc3RhbmNlXG5cdFx0XHR0aGlzLlNlZ21lbnRBcmMgPSBDaGFydC5BcmMuZXh0ZW5kKHtcblx0XHRcdFx0c2hvd1N0cm9rZSA6IHRoaXMub3B0aW9ucy5zZWdtZW50U2hvd1N0cm9rZSxcblx0XHRcdFx0c3Ryb2tlV2lkdGggOiB0aGlzLm9wdGlvbnMuc2VnbWVudFN0cm9rZVdpZHRoLFxuXHRcdFx0XHRzdHJva2VDb2xvciA6IHRoaXMub3B0aW9ucy5zZWdtZW50U3Ryb2tlQ29sb3IsXG5cdFx0XHRcdGN0eCA6IHRoaXMuY2hhcnQuY3R4LFxuXHRcdFx0XHRpbm5lclJhZGl1cyA6IDAsXG5cdFx0XHRcdHggOiB0aGlzLmNoYXJ0LndpZHRoLzIsXG5cdFx0XHRcdHkgOiB0aGlzLmNoYXJ0LmhlaWdodC8yXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuc2NhbGUgPSBuZXcgQ2hhcnQuUmFkaWFsU2NhbGUoe1xuXHRcdFx0XHRkaXNwbGF5OiB0aGlzLm9wdGlvbnMuc2hvd1NjYWxlLFxuXHRcdFx0XHRmb250U3R5bGU6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTdHlsZSxcblx0XHRcdFx0Zm9udFNpemU6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTaXplLFxuXHRcdFx0XHRmb250RmFtaWx5OiB0aGlzLm9wdGlvbnMuc2NhbGVGb250RmFtaWx5LFxuXHRcdFx0XHRmb250Q29sb3I6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRDb2xvcixcblx0XHRcdFx0c2hvd0xhYmVsczogdGhpcy5vcHRpb25zLnNjYWxlU2hvd0xhYmVscyxcblx0XHRcdFx0c2hvd0xhYmVsQmFja2Ryb3A6IHRoaXMub3B0aW9ucy5zY2FsZVNob3dMYWJlbEJhY2tkcm9wLFxuXHRcdFx0XHRiYWNrZHJvcENvbG9yOiB0aGlzLm9wdGlvbnMuc2NhbGVCYWNrZHJvcENvbG9yLFxuXHRcdFx0XHRiYWNrZHJvcFBhZGRpbmdZIDogdGhpcy5vcHRpb25zLnNjYWxlQmFja2Ryb3BQYWRkaW5nWSxcblx0XHRcdFx0YmFja2Ryb3BQYWRkaW5nWDogdGhpcy5vcHRpb25zLnNjYWxlQmFja2Ryb3BQYWRkaW5nWCxcblx0XHRcdFx0bGluZVdpZHRoOiAodGhpcy5vcHRpb25zLnNjYWxlU2hvd0xpbmUpID8gdGhpcy5vcHRpb25zLnNjYWxlTGluZVdpZHRoIDogMCxcblx0XHRcdFx0bGluZUNvbG9yOiB0aGlzLm9wdGlvbnMuc2NhbGVMaW5lQ29sb3IsXG5cdFx0XHRcdGxpbmVBcmM6IHRydWUsXG5cdFx0XHRcdHdpZHRoOiB0aGlzLmNoYXJ0LndpZHRoLFxuXHRcdFx0XHRoZWlnaHQ6IHRoaXMuY2hhcnQuaGVpZ2h0LFxuXHRcdFx0XHR4Q2VudGVyOiB0aGlzLmNoYXJ0LndpZHRoLzIsXG5cdFx0XHRcdHlDZW50ZXI6IHRoaXMuY2hhcnQuaGVpZ2h0LzIsXG5cdFx0XHRcdGN0eCA6IHRoaXMuY2hhcnQuY3R4LFxuXHRcdFx0XHR0ZW1wbGF0ZVN0cmluZzogdGhpcy5vcHRpb25zLnNjYWxlTGFiZWwsXG5cdFx0XHRcdHZhbHVlc0NvdW50OiBkYXRhLmxlbmd0aFxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMudXBkYXRlU2NhbGVSYW5nZShkYXRhKTtcblxuXHRcdFx0dGhpcy5zY2FsZS51cGRhdGUoKTtcblxuXHRcdFx0aGVscGVycy5lYWNoKGRhdGEsZnVuY3Rpb24oc2VnbWVudCxpbmRleCl7XG5cdFx0XHRcdHRoaXMuYWRkRGF0YShzZWdtZW50LGluZGV4LHRydWUpO1xuXHRcdFx0fSx0aGlzKTtcblxuXHRcdFx0Ly9TZXQgdXAgdG9vbHRpcCBldmVudHMgb24gdGhlIGNoYXJ0XG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLnNob3dUb29sdGlwcyl7XG5cdFx0XHRcdGhlbHBlcnMuYmluZEV2ZW50cyh0aGlzLCB0aGlzLm9wdGlvbnMudG9vbHRpcEV2ZW50cywgZnVuY3Rpb24oZXZ0KXtcblx0XHRcdFx0XHR2YXIgYWN0aXZlU2VnbWVudHMgPSAoZXZ0LnR5cGUgIT09ICdtb3VzZW91dCcpID8gdGhpcy5nZXRTZWdtZW50c0F0RXZlbnQoZXZ0KSA6IFtdO1xuXHRcdFx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLnNlZ21lbnRzLGZ1bmN0aW9uKHNlZ21lbnQpe1xuXHRcdFx0XHRcdFx0c2VnbWVudC5yZXN0b3JlKFtcImZpbGxDb2xvclwiXSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0aGVscGVycy5lYWNoKGFjdGl2ZVNlZ21lbnRzLGZ1bmN0aW9uKGFjdGl2ZVNlZ21lbnQpe1xuXHRcdFx0XHRcdFx0YWN0aXZlU2VnbWVudC5maWxsQ29sb3IgPSBhY3RpdmVTZWdtZW50LmhpZ2hsaWdodENvbG9yO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHRoaXMuc2hvd1Rvb2x0aXAoYWN0aXZlU2VnbWVudHMpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9LFxuXHRcdGdldFNlZ21lbnRzQXRFdmVudCA6IGZ1bmN0aW9uKGUpe1xuXHRcdFx0dmFyIHNlZ21lbnRzQXJyYXkgPSBbXTtcblxuXHRcdFx0dmFyIGxvY2F0aW9uID0gaGVscGVycy5nZXRSZWxhdGl2ZVBvc2l0aW9uKGUpO1xuXG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5zZWdtZW50cyxmdW5jdGlvbihzZWdtZW50KXtcblx0XHRcdFx0aWYgKHNlZ21lbnQuaW5SYW5nZShsb2NhdGlvbi54LGxvY2F0aW9uLnkpKSBzZWdtZW50c0FycmF5LnB1c2goc2VnbWVudCk7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdFx0cmV0dXJuIHNlZ21lbnRzQXJyYXk7XG5cdFx0fSxcblx0XHRhZGREYXRhIDogZnVuY3Rpb24oc2VnbWVudCwgYXRJbmRleCwgc2lsZW50KXtcblx0XHRcdHZhciBpbmRleCA9IGF0SW5kZXggfHwgdGhpcy5zZWdtZW50cy5sZW5ndGg7XG5cblx0XHRcdHRoaXMuc2VnbWVudHMuc3BsaWNlKGluZGV4LCAwLCBuZXcgdGhpcy5TZWdtZW50QXJjKHtcblx0XHRcdFx0ZmlsbENvbG9yOiBzZWdtZW50LmNvbG9yLFxuXHRcdFx0XHRoaWdobGlnaHRDb2xvcjogc2VnbWVudC5oaWdobGlnaHQgfHwgc2VnbWVudC5jb2xvcixcblx0XHRcdFx0bGFiZWw6IHNlZ21lbnQubGFiZWwsXG5cdFx0XHRcdHZhbHVlOiBzZWdtZW50LnZhbHVlLFxuXHRcdFx0XHRvdXRlclJhZGl1czogKHRoaXMub3B0aW9ucy5hbmltYXRlU2NhbGUpID8gMCA6IHRoaXMuc2NhbGUuY2FsY3VsYXRlQ2VudGVyT2Zmc2V0KHNlZ21lbnQudmFsdWUpLFxuXHRcdFx0XHRjaXJjdW1mZXJlbmNlOiAodGhpcy5vcHRpb25zLmFuaW1hdGVSb3RhdGUpID8gMCA6IHRoaXMuc2NhbGUuZ2V0Q2lyY3VtZmVyZW5jZSgpLFxuXHRcdFx0XHRzdGFydEFuZ2xlOiBNYXRoLlBJICogMS41XG5cdFx0XHR9KSk7XG5cdFx0XHRpZiAoIXNpbGVudCl7XG5cdFx0XHRcdHRoaXMucmVmbG93KCk7XG5cdFx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZW1vdmVEYXRhOiBmdW5jdGlvbihhdEluZGV4KXtcblx0XHRcdHZhciBpbmRleFRvRGVsZXRlID0gKGhlbHBlcnMuaXNOdW1iZXIoYXRJbmRleCkpID8gYXRJbmRleCA6IHRoaXMuc2VnbWVudHMubGVuZ3RoLTE7XG5cdFx0XHR0aGlzLnNlZ21lbnRzLnNwbGljZShpbmRleFRvRGVsZXRlLCAxKTtcblx0XHRcdHRoaXMucmVmbG93KCk7XG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdH0sXG5cdFx0Y2FsY3VsYXRlVG90YWw6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0dGhpcy50b3RhbCA9IDA7XG5cdFx0XHRoZWxwZXJzLmVhY2goZGF0YSxmdW5jdGlvbihzZWdtZW50KXtcblx0XHRcdFx0dGhpcy50b3RhbCArPSBzZWdtZW50LnZhbHVlO1xuXHRcdFx0fSx0aGlzKTtcblx0XHRcdHRoaXMuc2NhbGUudmFsdWVzQ291bnQgPSB0aGlzLnNlZ21lbnRzLmxlbmd0aDtcblx0XHR9LFxuXHRcdHVwZGF0ZVNjYWxlUmFuZ2U6IGZ1bmN0aW9uKGRhdGFwb2ludHMpe1xuXHRcdFx0dmFyIHZhbHVlc0FycmF5ID0gW107XG5cdFx0XHRoZWxwZXJzLmVhY2goZGF0YXBvaW50cyxmdW5jdGlvbihzZWdtZW50KXtcblx0XHRcdFx0dmFsdWVzQXJyYXkucHVzaChzZWdtZW50LnZhbHVlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHR2YXIgc2NhbGVTaXplcyA9ICh0aGlzLm9wdGlvbnMuc2NhbGVPdmVycmlkZSkgP1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3RlcHM6IHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBzLFxuXHRcdFx0XHRcdHN0ZXBWYWx1ZTogdGhpcy5vcHRpb25zLnNjYWxlU3RlcFdpZHRoLFxuXHRcdFx0XHRcdG1pbjogdGhpcy5vcHRpb25zLnNjYWxlU3RhcnRWYWx1ZSxcblx0XHRcdFx0XHRtYXg6IHRoaXMub3B0aW9ucy5zY2FsZVN0YXJ0VmFsdWUgKyAodGhpcy5vcHRpb25zLnNjYWxlU3RlcHMgKiB0aGlzLm9wdGlvbnMuc2NhbGVTdGVwV2lkdGgpXG5cdFx0XHRcdH0gOlxuXHRcdFx0XHRoZWxwZXJzLmNhbGN1bGF0ZVNjYWxlUmFuZ2UoXG5cdFx0XHRcdFx0dmFsdWVzQXJyYXksXG5cdFx0XHRcdFx0aGVscGVycy5taW4oW3RoaXMuY2hhcnQud2lkdGgsIHRoaXMuY2hhcnQuaGVpZ2h0XSkvMixcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMuc2NhbGVGb250U2l6ZSxcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMuc2NhbGVCZWdpbkF0WmVybyxcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMuc2NhbGVJbnRlZ2Vyc09ubHlcblx0XHRcdFx0KTtcblxuXHRcdFx0aGVscGVycy5leHRlbmQoXG5cdFx0XHRcdHRoaXMuc2NhbGUsXG5cdFx0XHRcdHNjYWxlU2l6ZXMsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzaXplOiBoZWxwZXJzLm1pbihbdGhpcy5jaGFydC53aWR0aCwgdGhpcy5jaGFydC5oZWlnaHRdKSxcblx0XHRcdFx0XHR4Q2VudGVyOiB0aGlzLmNoYXJ0LndpZHRoLzIsXG5cdFx0XHRcdFx0eUNlbnRlcjogdGhpcy5jaGFydC5oZWlnaHQvMlxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0fSxcblx0XHR1cGRhdGUgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5jYWxjdWxhdGVUb3RhbCh0aGlzLnNlZ21lbnRzKTtcblxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuc2VnbWVudHMsZnVuY3Rpb24oc2VnbWVudCl7XG5cdFx0XHRcdHNlZ21lbnQuc2F2ZSgpO1xuXHRcdFx0fSk7XG5cdFx0XHRcblx0XHRcdHRoaXMucmVmbG93KCk7XG5cdFx0XHR0aGlzLnJlbmRlcigpO1xuXHRcdH0sXG5cdFx0cmVmbG93IDogZnVuY3Rpb24oKXtcblx0XHRcdGhlbHBlcnMuZXh0ZW5kKHRoaXMuU2VnbWVudEFyYy5wcm90b3R5cGUse1xuXHRcdFx0XHR4IDogdGhpcy5jaGFydC53aWR0aC8yLFxuXHRcdFx0XHR5IDogdGhpcy5jaGFydC5oZWlnaHQvMlxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnVwZGF0ZVNjYWxlUmFuZ2UodGhpcy5zZWdtZW50cyk7XG5cdFx0XHR0aGlzLnNjYWxlLnVwZGF0ZSgpO1xuXG5cdFx0XHRoZWxwZXJzLmV4dGVuZCh0aGlzLnNjYWxlLHtcblx0XHRcdFx0eENlbnRlcjogdGhpcy5jaGFydC53aWR0aC8yLFxuXHRcdFx0XHR5Q2VudGVyOiB0aGlzLmNoYXJ0LmhlaWdodC8yXG5cdFx0XHR9KTtcblxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuc2VnbWVudHMsIGZ1bmN0aW9uKHNlZ21lbnQpe1xuXHRcdFx0XHRzZWdtZW50LnVwZGF0ZSh7XG5cdFx0XHRcdFx0b3V0ZXJSYWRpdXMgOiB0aGlzLnNjYWxlLmNhbGN1bGF0ZUNlbnRlck9mZnNldChzZWdtZW50LnZhbHVlKVxuXHRcdFx0XHR9KTtcblx0XHRcdH0sIHRoaXMpO1xuXG5cdFx0fSxcblx0XHRkcmF3IDogZnVuY3Rpb24oZWFzZSl7XG5cdFx0XHR2YXIgZWFzaW5nRGVjaW1hbCA9IGVhc2UgfHwgMTtcblx0XHRcdC8vQ2xlYXIgJiBkcmF3IHRoZSBjYW52YXNcblx0XHRcdHRoaXMuY2xlYXIoKTtcblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLnNlZ21lbnRzLGZ1bmN0aW9uKHNlZ21lbnQsIGluZGV4KXtcblx0XHRcdFx0c2VnbWVudC50cmFuc2l0aW9uKHtcblx0XHRcdFx0XHRjaXJjdW1mZXJlbmNlIDogdGhpcy5zY2FsZS5nZXRDaXJjdW1mZXJlbmNlKCksXG5cdFx0XHRcdFx0b3V0ZXJSYWRpdXMgOiB0aGlzLnNjYWxlLmNhbGN1bGF0ZUNlbnRlck9mZnNldChzZWdtZW50LnZhbHVlKVxuXHRcdFx0XHR9LGVhc2luZ0RlY2ltYWwpO1xuXG5cdFx0XHRcdHNlZ21lbnQuZW5kQW5nbGUgPSBzZWdtZW50LnN0YXJ0QW5nbGUgKyBzZWdtZW50LmNpcmN1bWZlcmVuY2U7XG5cblx0XHRcdFx0Ly8gSWYgd2UndmUgcmVtb3ZlZCB0aGUgZmlyc3Qgc2VnbWVudCB3ZSBuZWVkIHRvIHNldCB0aGUgZmlyc3Qgb25lIHRvXG5cdFx0XHRcdC8vIHN0YXJ0IGF0IHRoZSB0b3AuXG5cdFx0XHRcdGlmIChpbmRleCA9PT0gMCl7XG5cdFx0XHRcdFx0c2VnbWVudC5zdGFydEFuZ2xlID0gTWF0aC5QSSAqIDEuNTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vQ2hlY2sgdG8gc2VlIGlmIGl0J3MgdGhlIGxhc3Qgc2VnbWVudCwgaWYgbm90IGdldCB0aGUgbmV4dCBhbmQgdXBkYXRlIHRoZSBzdGFydCBhbmdsZVxuXHRcdFx0XHRpZiAoaW5kZXggPCB0aGlzLnNlZ21lbnRzLmxlbmd0aCAtIDEpe1xuXHRcdFx0XHRcdHRoaXMuc2VnbWVudHNbaW5kZXgrMV0uc3RhcnRBbmdsZSA9IHNlZ21lbnQuZW5kQW5nbGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0c2VnbWVudC5kcmF3KCk7XG5cdFx0XHR9LCB0aGlzKTtcblx0XHRcdHRoaXMuc2NhbGUuZHJhdygpO1xuXHRcdH1cblx0fSk7XG5cbn0pLmNhbGwodGhpcyk7XG4oZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIHJvb3QgPSB0aGlzLFxuXHRcdENoYXJ0ID0gcm9vdC5DaGFydCxcblx0XHRoZWxwZXJzID0gQ2hhcnQuaGVscGVycztcblxuXG5cblx0Q2hhcnQuVHlwZS5leHRlbmQoe1xuXHRcdG5hbWU6IFwiUmFkYXJcIixcblx0XHRkZWZhdWx0czp7XG5cdFx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIHNob3cgbGluZXMgZm9yIGVhY2ggc2NhbGUgcG9pbnRcblx0XHRcdHNjYWxlU2hvd0xpbmUgOiB0cnVlLFxuXG5cdFx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHdlIHNob3cgdGhlIGFuZ2xlIGxpbmVzIG91dCBvZiB0aGUgcmFkYXJcblx0XHRcdGFuZ2xlU2hvd0xpbmVPdXQgOiB0cnVlLFxuXG5cdFx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIHNob3cgbGFiZWxzIG9uIHRoZSBzY2FsZVxuXHRcdFx0c2NhbGVTaG93TGFiZWxzIDogZmFsc2UsXG5cblx0XHRcdC8vIEJvb2xlYW4gLSBXaGV0aGVyIHRoZSBzY2FsZSBzaG91bGQgYmVnaW4gYXQgemVyb1xuXHRcdFx0c2NhbGVCZWdpbkF0WmVybyA6IHRydWUsXG5cblx0XHRcdC8vU3RyaW5nIC0gQ29sb3VyIG9mIHRoZSBhbmdsZSBsaW5lXG5cdFx0XHRhbmdsZUxpbmVDb2xvciA6IFwicmdiYSgwLDAsMCwuMSlcIixcblxuXHRcdFx0Ly9OdW1iZXIgLSBQaXhlbCB3aWR0aCBvZiB0aGUgYW5nbGUgbGluZVxuXHRcdFx0YW5nbGVMaW5lV2lkdGggOiAxLFxuXG5cdFx0XHQvL1N0cmluZyAtIFBvaW50IGxhYmVsIGZvbnQgZGVjbGFyYXRpb25cblx0XHRcdHBvaW50TGFiZWxGb250RmFtaWx5IDogXCInQXJpYWwnXCIsXG5cblx0XHRcdC8vU3RyaW5nIC0gUG9pbnQgbGFiZWwgZm9udCB3ZWlnaHRcblx0XHRcdHBvaW50TGFiZWxGb250U3R5bGUgOiBcIm5vcm1hbFwiLFxuXG5cdFx0XHQvL051bWJlciAtIFBvaW50IGxhYmVsIGZvbnQgc2l6ZSBpbiBwaXhlbHNcblx0XHRcdHBvaW50TGFiZWxGb250U2l6ZSA6IDEwLFxuXG5cdFx0XHQvL1N0cmluZyAtIFBvaW50IGxhYmVsIGZvbnQgY29sb3VyXG5cdFx0XHRwb2ludExhYmVsRm9udENvbG9yIDogXCIjNjY2XCIsXG5cblx0XHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdG8gc2hvdyBhIGRvdCBmb3IgZWFjaCBwb2ludFxuXHRcdFx0cG9pbnREb3QgOiB0cnVlLFxuXG5cdFx0XHQvL051bWJlciAtIFJhZGl1cyBvZiBlYWNoIHBvaW50IGRvdCBpbiBwaXhlbHNcblx0XHRcdHBvaW50RG90UmFkaXVzIDogMyxcblxuXHRcdFx0Ly9OdW1iZXIgLSBQaXhlbCB3aWR0aCBvZiBwb2ludCBkb3Qgc3Ryb2tlXG5cdFx0XHRwb2ludERvdFN0cm9rZVdpZHRoIDogMSxcblxuXHRcdFx0Ly9OdW1iZXIgLSBhbW91bnQgZXh0cmEgdG8gYWRkIHRvIHRoZSByYWRpdXMgdG8gY2F0ZXIgZm9yIGhpdCBkZXRlY3Rpb24gb3V0c2lkZSB0aGUgZHJhd24gcG9pbnRcblx0XHRcdHBvaW50SGl0RGV0ZWN0aW9uUmFkaXVzIDogMjAsXG5cblx0XHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdG8gc2hvdyBhIHN0cm9rZSBmb3IgZGF0YXNldHNcblx0XHRcdGRhdGFzZXRTdHJva2UgOiB0cnVlLFxuXG5cdFx0XHQvL051bWJlciAtIFBpeGVsIHdpZHRoIG9mIGRhdGFzZXQgc3Ryb2tlXG5cdFx0XHRkYXRhc2V0U3Ryb2tlV2lkdGggOiAyLFxuXG5cdFx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIGZpbGwgdGhlIGRhdGFzZXQgd2l0aCBhIGNvbG91clxuXHRcdFx0ZGF0YXNldEZpbGwgOiB0cnVlLFxuXG5cdFx0XHQvL1N0cmluZyAtIEEgbGVnZW5kIHRlbXBsYXRlXG5cdFx0XHRsZWdlbmRUZW1wbGF0ZSA6IFwiPHVsIGNsYXNzPVxcXCI8JT1uYW1lLnRvTG93ZXJDYXNlKCklPi1sZWdlbmRcXFwiPjwlIGZvciAodmFyIGk9MDsgaTxkYXRhc2V0cy5sZW5ndGg7IGkrKyl7JT48bGk+PHNwYW4gc3R5bGU9XFxcImJhY2tncm91bmQtY29sb3I6PCU9ZGF0YXNldHNbaV0uc3Ryb2tlQ29sb3IlPlxcXCI+PC9zcGFuPjwlaWYoZGF0YXNldHNbaV0ubGFiZWwpeyU+PCU9ZGF0YXNldHNbaV0ubGFiZWwlPjwlfSU+PC9saT48JX0lPjwvdWw+XCJcblxuXHRcdH0sXG5cblx0XHRpbml0aWFsaXplOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdHRoaXMuUG9pbnRDbGFzcyA9IENoYXJ0LlBvaW50LmV4dGVuZCh7XG5cdFx0XHRcdHN0cm9rZVdpZHRoIDogdGhpcy5vcHRpb25zLnBvaW50RG90U3Ryb2tlV2lkdGgsXG5cdFx0XHRcdHJhZGl1cyA6IHRoaXMub3B0aW9ucy5wb2ludERvdFJhZGl1cyxcblx0XHRcdFx0ZGlzcGxheTogdGhpcy5vcHRpb25zLnBvaW50RG90LFxuXHRcdFx0XHRoaXREZXRlY3Rpb25SYWRpdXMgOiB0aGlzLm9wdGlvbnMucG9pbnRIaXREZXRlY3Rpb25SYWRpdXMsXG5cdFx0XHRcdGN0eCA6IHRoaXMuY2hhcnQuY3R4XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5kYXRhc2V0cyA9IFtdO1xuXG5cdFx0XHR0aGlzLmJ1aWxkU2NhbGUoZGF0YSk7XG5cblx0XHRcdC8vU2V0IHVwIHRvb2x0aXAgZXZlbnRzIG9uIHRoZSBjaGFydFxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5zaG93VG9vbHRpcHMpe1xuXHRcdFx0XHRoZWxwZXJzLmJpbmRFdmVudHModGhpcywgdGhpcy5vcHRpb25zLnRvb2x0aXBFdmVudHMsIGZ1bmN0aW9uKGV2dCl7XG5cdFx0XHRcdFx0dmFyIGFjdGl2ZVBvaW50c0NvbGxlY3Rpb24gPSAoZXZ0LnR5cGUgIT09ICdtb3VzZW91dCcpID8gdGhpcy5nZXRQb2ludHNBdEV2ZW50KGV2dCkgOiBbXTtcblxuXHRcdFx0XHRcdHRoaXMuZWFjaFBvaW50cyhmdW5jdGlvbihwb2ludCl7XG5cdFx0XHRcdFx0XHRwb2ludC5yZXN0b3JlKFsnZmlsbENvbG9yJywgJ3N0cm9rZUNvbG9yJ10pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGhlbHBlcnMuZWFjaChhY3RpdmVQb2ludHNDb2xsZWN0aW9uLCBmdW5jdGlvbihhY3RpdmVQb2ludCl7XG5cdFx0XHRcdFx0XHRhY3RpdmVQb2ludC5maWxsQ29sb3IgPSBhY3RpdmVQb2ludC5oaWdobGlnaHRGaWxsO1xuXHRcdFx0XHRcdFx0YWN0aXZlUG9pbnQuc3Ryb2tlQ29sb3IgPSBhY3RpdmVQb2ludC5oaWdobGlnaHRTdHJva2U7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR0aGlzLnNob3dUb29sdGlwKGFjdGl2ZVBvaW50c0NvbGxlY3Rpb24pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0Ly9JdGVyYXRlIHRocm91Z2ggZWFjaCBvZiB0aGUgZGF0YXNldHMsIGFuZCBidWlsZCB0aGlzIGludG8gYSBwcm9wZXJ0eSBvZiB0aGUgY2hhcnRcblx0XHRcdGhlbHBlcnMuZWFjaChkYXRhLmRhdGFzZXRzLGZ1bmN0aW9uKGRhdGFzZXQpe1xuXG5cdFx0XHRcdHZhciBkYXRhc2V0T2JqZWN0ID0ge1xuXHRcdFx0XHRcdGxhYmVsOiBkYXRhc2V0LmxhYmVsIHx8IG51bGwsXG5cdFx0XHRcdFx0ZmlsbENvbG9yIDogZGF0YXNldC5maWxsQ29sb3IsXG5cdFx0XHRcdFx0c3Ryb2tlQ29sb3IgOiBkYXRhc2V0LnN0cm9rZUNvbG9yLFxuXHRcdFx0XHRcdHBvaW50Q29sb3IgOiBkYXRhc2V0LnBvaW50Q29sb3IsXG5cdFx0XHRcdFx0cG9pbnRTdHJva2VDb2xvciA6IGRhdGFzZXQucG9pbnRTdHJva2VDb2xvcixcblx0XHRcdFx0XHRwb2ludHMgOiBbXVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHRoaXMuZGF0YXNldHMucHVzaChkYXRhc2V0T2JqZWN0KTtcblxuXHRcdFx0XHRoZWxwZXJzLmVhY2goZGF0YXNldC5kYXRhLGZ1bmN0aW9uKGRhdGFQb2ludCxpbmRleCl7XG5cdFx0XHRcdFx0Ly9BZGQgYSBuZXcgcG9pbnQgZm9yIGVhY2ggcGllY2Ugb2YgZGF0YSwgcGFzc2luZyBhbnkgcmVxdWlyZWQgZGF0YSB0byBkcmF3LlxuXHRcdFx0XHRcdHZhciBwb2ludFBvc2l0aW9uO1xuXHRcdFx0XHRcdGlmICghdGhpcy5zY2FsZS5hbmltYXRpb24pe1xuXHRcdFx0XHRcdFx0cG9pbnRQb3NpdGlvbiA9IHRoaXMuc2NhbGUuZ2V0UG9pbnRQb3NpdGlvbihpbmRleCwgdGhpcy5zY2FsZS5jYWxjdWxhdGVDZW50ZXJPZmZzZXQoZGF0YVBvaW50KSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRhdGFzZXRPYmplY3QucG9pbnRzLnB1c2gobmV3IHRoaXMuUG9pbnRDbGFzcyh7XG5cdFx0XHRcdFx0XHR2YWx1ZSA6IGRhdGFQb2ludCxcblx0XHRcdFx0XHRcdGxhYmVsIDogZGF0YS5sYWJlbHNbaW5kZXhdLFxuXHRcdFx0XHRcdFx0ZGF0YXNldExhYmVsOiBkYXRhc2V0LmxhYmVsLFxuXHRcdFx0XHRcdFx0eDogKHRoaXMub3B0aW9ucy5hbmltYXRpb24pID8gdGhpcy5zY2FsZS54Q2VudGVyIDogcG9pbnRQb3NpdGlvbi54LFxuXHRcdFx0XHRcdFx0eTogKHRoaXMub3B0aW9ucy5hbmltYXRpb24pID8gdGhpcy5zY2FsZS55Q2VudGVyIDogcG9pbnRQb3NpdGlvbi55LFxuXHRcdFx0XHRcdFx0c3Ryb2tlQ29sb3IgOiBkYXRhc2V0LnBvaW50U3Ryb2tlQ29sb3IsXG5cdFx0XHRcdFx0XHRmaWxsQ29sb3IgOiBkYXRhc2V0LnBvaW50Q29sb3IsXG5cdFx0XHRcdFx0XHRoaWdobGlnaHRGaWxsIDogZGF0YXNldC5wb2ludEhpZ2hsaWdodEZpbGwgfHwgZGF0YXNldC5wb2ludENvbG9yLFxuXHRcdFx0XHRcdFx0aGlnaGxpZ2h0U3Ryb2tlIDogZGF0YXNldC5wb2ludEhpZ2hsaWdodFN0cm9rZSB8fCBkYXRhc2V0LnBvaW50U3Ryb2tlQ29sb3Jcblx0XHRcdFx0XHR9KSk7XG5cdFx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdHRoaXMucmVuZGVyKCk7XG5cdFx0fSxcblx0XHRlYWNoUG9pbnRzIDogZnVuY3Rpb24oY2FsbGJhY2spe1xuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCl7XG5cdFx0XHRcdGhlbHBlcnMuZWFjaChkYXRhc2V0LnBvaW50cyxjYWxsYmFjayx0aGlzKTtcblx0XHRcdH0sdGhpcyk7XG5cdFx0fSxcblxuXHRcdGdldFBvaW50c0F0RXZlbnQgOiBmdW5jdGlvbihldnQpe1xuXHRcdFx0dmFyIG1vdXNlUG9zaXRpb24gPSBoZWxwZXJzLmdldFJlbGF0aXZlUG9zaXRpb24oZXZ0KSxcblx0XHRcdFx0ZnJvbUNlbnRlciA9IGhlbHBlcnMuZ2V0QW5nbGVGcm9tUG9pbnQoe1xuXHRcdFx0XHRcdHg6IHRoaXMuc2NhbGUueENlbnRlcixcblx0XHRcdFx0XHR5OiB0aGlzLnNjYWxlLnlDZW50ZXJcblx0XHRcdFx0fSwgbW91c2VQb3NpdGlvbik7XG5cblx0XHRcdHZhciBhbmdsZVBlckluZGV4ID0gKE1hdGguUEkgKiAyKSAvdGhpcy5zY2FsZS52YWx1ZXNDb3VudCxcblx0XHRcdFx0cG9pbnRJbmRleCA9IE1hdGgucm91bmQoKGZyb21DZW50ZXIuYW5nbGUgLSBNYXRoLlBJICogMS41KSAvIGFuZ2xlUGVySW5kZXgpLFxuXHRcdFx0XHRhY3RpdmVQb2ludHNDb2xsZWN0aW9uID0gW107XG5cblx0XHRcdC8vIElmIHdlJ3JlIGF0IHRoZSB0b3AsIG1ha2UgdGhlIHBvaW50SW5kZXggMCB0byBnZXQgdGhlIGZpcnN0IG9mIHRoZSBhcnJheS5cblx0XHRcdGlmIChwb2ludEluZGV4ID49IHRoaXMuc2NhbGUudmFsdWVzQ291bnQgfHwgcG9pbnRJbmRleCA8IDApe1xuXHRcdFx0XHRwb2ludEluZGV4ID0gMDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGZyb21DZW50ZXIuZGlzdGFuY2UgPD0gdGhpcy5zY2FsZS5kcmF3aW5nQXJlYSl7XG5cdFx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmRhdGFzZXRzLCBmdW5jdGlvbihkYXRhc2V0KXtcblx0XHRcdFx0XHRhY3RpdmVQb2ludHNDb2xsZWN0aW9uLnB1c2goZGF0YXNldC5wb2ludHNbcG9pbnRJbmRleF0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGFjdGl2ZVBvaW50c0NvbGxlY3Rpb247XG5cdFx0fSxcblxuXHRcdGJ1aWxkU2NhbGUgOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdHRoaXMuc2NhbGUgPSBuZXcgQ2hhcnQuUmFkaWFsU2NhbGUoe1xuXHRcdFx0XHRkaXNwbGF5OiB0aGlzLm9wdGlvbnMuc2hvd1NjYWxlLFxuXHRcdFx0XHRmb250U3R5bGU6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTdHlsZSxcblx0XHRcdFx0Zm9udFNpemU6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTaXplLFxuXHRcdFx0XHRmb250RmFtaWx5OiB0aGlzLm9wdGlvbnMuc2NhbGVGb250RmFtaWx5LFxuXHRcdFx0XHRmb250Q29sb3I6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRDb2xvcixcblx0XHRcdFx0c2hvd0xhYmVsczogdGhpcy5vcHRpb25zLnNjYWxlU2hvd0xhYmVscyxcblx0XHRcdFx0c2hvd0xhYmVsQmFja2Ryb3A6IHRoaXMub3B0aW9ucy5zY2FsZVNob3dMYWJlbEJhY2tkcm9wLFxuXHRcdFx0XHRiYWNrZHJvcENvbG9yOiB0aGlzLm9wdGlvbnMuc2NhbGVCYWNrZHJvcENvbG9yLFxuXHRcdFx0XHRiYWNrZHJvcFBhZGRpbmdZIDogdGhpcy5vcHRpb25zLnNjYWxlQmFja2Ryb3BQYWRkaW5nWSxcblx0XHRcdFx0YmFja2Ryb3BQYWRkaW5nWDogdGhpcy5vcHRpb25zLnNjYWxlQmFja2Ryb3BQYWRkaW5nWCxcblx0XHRcdFx0bGluZVdpZHRoOiAodGhpcy5vcHRpb25zLnNjYWxlU2hvd0xpbmUpID8gdGhpcy5vcHRpb25zLnNjYWxlTGluZVdpZHRoIDogMCxcblx0XHRcdFx0bGluZUNvbG9yOiB0aGlzLm9wdGlvbnMuc2NhbGVMaW5lQ29sb3IsXG5cdFx0XHRcdGFuZ2xlTGluZUNvbG9yIDogdGhpcy5vcHRpb25zLmFuZ2xlTGluZUNvbG9yLFxuXHRcdFx0XHRhbmdsZUxpbmVXaWR0aCA6ICh0aGlzLm9wdGlvbnMuYW5nbGVTaG93TGluZU91dCkgPyB0aGlzLm9wdGlvbnMuYW5nbGVMaW5lV2lkdGggOiAwLFxuXHRcdFx0XHQvLyBQb2ludCBsYWJlbHMgYXQgdGhlIGVkZ2Ugb2YgZWFjaCBsaW5lXG5cdFx0XHRcdHBvaW50TGFiZWxGb250Q29sb3IgOiB0aGlzLm9wdGlvbnMucG9pbnRMYWJlbEZvbnRDb2xvcixcblx0XHRcdFx0cG9pbnRMYWJlbEZvbnRTaXplIDogdGhpcy5vcHRpb25zLnBvaW50TGFiZWxGb250U2l6ZSxcblx0XHRcdFx0cG9pbnRMYWJlbEZvbnRGYW1pbHkgOiB0aGlzLm9wdGlvbnMucG9pbnRMYWJlbEZvbnRGYW1pbHksXG5cdFx0XHRcdHBvaW50TGFiZWxGb250U3R5bGUgOiB0aGlzLm9wdGlvbnMucG9pbnRMYWJlbEZvbnRTdHlsZSxcblx0XHRcdFx0aGVpZ2h0IDogdGhpcy5jaGFydC5oZWlnaHQsXG5cdFx0XHRcdHdpZHRoOiB0aGlzLmNoYXJ0LndpZHRoLFxuXHRcdFx0XHR4Q2VudGVyOiB0aGlzLmNoYXJ0LndpZHRoLzIsXG5cdFx0XHRcdHlDZW50ZXI6IHRoaXMuY2hhcnQuaGVpZ2h0LzIsXG5cdFx0XHRcdGN0eCA6IHRoaXMuY2hhcnQuY3R4LFxuXHRcdFx0XHR0ZW1wbGF0ZVN0cmluZzogdGhpcy5vcHRpb25zLnNjYWxlTGFiZWwsXG5cdFx0XHRcdGxhYmVsczogZGF0YS5sYWJlbHMsXG5cdFx0XHRcdHZhbHVlc0NvdW50OiBkYXRhLmRhdGFzZXRzWzBdLmRhdGEubGVuZ3RoXG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5zY2FsZS5zZXRTY2FsZVNpemUoKTtcblx0XHRcdHRoaXMudXBkYXRlU2NhbGVSYW5nZShkYXRhLmRhdGFzZXRzKTtcblx0XHRcdHRoaXMuc2NhbGUuYnVpbGRZTGFiZWxzKCk7XG5cdFx0fSxcblx0XHR1cGRhdGVTY2FsZVJhbmdlOiBmdW5jdGlvbihkYXRhc2V0cyl7XG5cdFx0XHR2YXIgdmFsdWVzQXJyYXkgPSAoZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIHRvdGFsRGF0YUFycmF5ID0gW107XG5cdFx0XHRcdGhlbHBlcnMuZWFjaChkYXRhc2V0cyxmdW5jdGlvbihkYXRhc2V0KXtcblx0XHRcdFx0XHRpZiAoZGF0YXNldC5kYXRhKXtcblx0XHRcdFx0XHRcdHRvdGFsRGF0YUFycmF5ID0gdG90YWxEYXRhQXJyYXkuY29uY2F0KGRhdGFzZXQuZGF0YSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0aGVscGVycy5lYWNoKGRhdGFzZXQucG9pbnRzLCBmdW5jdGlvbihwb2ludCl7XG5cdFx0XHRcdFx0XHRcdHRvdGFsRGF0YUFycmF5LnB1c2gocG9pbnQudmFsdWUpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIHRvdGFsRGF0YUFycmF5O1xuXHRcdFx0fSkoKTtcblxuXG5cdFx0XHR2YXIgc2NhbGVTaXplcyA9ICh0aGlzLm9wdGlvbnMuc2NhbGVPdmVycmlkZSkgP1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3RlcHM6IHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBzLFxuXHRcdFx0XHRcdHN0ZXBWYWx1ZTogdGhpcy5vcHRpb25zLnNjYWxlU3RlcFdpZHRoLFxuXHRcdFx0XHRcdG1pbjogdGhpcy5vcHRpb25zLnNjYWxlU3RhcnRWYWx1ZSxcblx0XHRcdFx0XHRtYXg6IHRoaXMub3B0aW9ucy5zY2FsZVN0YXJ0VmFsdWUgKyAodGhpcy5vcHRpb25zLnNjYWxlU3RlcHMgKiB0aGlzLm9wdGlvbnMuc2NhbGVTdGVwV2lkdGgpXG5cdFx0XHRcdH0gOlxuXHRcdFx0XHRoZWxwZXJzLmNhbGN1bGF0ZVNjYWxlUmFuZ2UoXG5cdFx0XHRcdFx0dmFsdWVzQXJyYXksXG5cdFx0XHRcdFx0aGVscGVycy5taW4oW3RoaXMuY2hhcnQud2lkdGgsIHRoaXMuY2hhcnQuaGVpZ2h0XSkvMixcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMuc2NhbGVGb250U2l6ZSxcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMuc2NhbGVCZWdpbkF0WmVybyxcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMuc2NhbGVJbnRlZ2Vyc09ubHlcblx0XHRcdFx0KTtcblxuXHRcdFx0aGVscGVycy5leHRlbmQoXG5cdFx0XHRcdHRoaXMuc2NhbGUsXG5cdFx0XHRcdHNjYWxlU2l6ZXNcblx0XHRcdCk7XG5cblx0XHR9LFxuXHRcdGFkZERhdGEgOiBmdW5jdGlvbih2YWx1ZXNBcnJheSxsYWJlbCl7XG5cdFx0XHQvL01hcCB0aGUgdmFsdWVzIGFycmF5IGZvciBlYWNoIG9mIHRoZSBkYXRhc2V0c1xuXHRcdFx0dGhpcy5zY2FsZS52YWx1ZXNDb3VudCsrO1xuXHRcdFx0aGVscGVycy5lYWNoKHZhbHVlc0FycmF5LGZ1bmN0aW9uKHZhbHVlLGRhdGFzZXRJbmRleCl7XG5cdFx0XHRcdHZhciBwb2ludFBvc2l0aW9uID0gdGhpcy5zY2FsZS5nZXRQb2ludFBvc2l0aW9uKHRoaXMuc2NhbGUudmFsdWVzQ291bnQsIHRoaXMuc2NhbGUuY2FsY3VsYXRlQ2VudGVyT2Zmc2V0KHZhbHVlKSk7XG5cdFx0XHRcdHRoaXMuZGF0YXNldHNbZGF0YXNldEluZGV4XS5wb2ludHMucHVzaChuZXcgdGhpcy5Qb2ludENsYXNzKHtcblx0XHRcdFx0XHR2YWx1ZSA6IHZhbHVlLFxuXHRcdFx0XHRcdGxhYmVsIDogbGFiZWwsXG5cdFx0XHRcdFx0eDogcG9pbnRQb3NpdGlvbi54LFxuXHRcdFx0XHRcdHk6IHBvaW50UG9zaXRpb24ueSxcblx0XHRcdFx0XHRzdHJva2VDb2xvciA6IHRoaXMuZGF0YXNldHNbZGF0YXNldEluZGV4XS5wb2ludFN0cm9rZUNvbG9yLFxuXHRcdFx0XHRcdGZpbGxDb2xvciA6IHRoaXMuZGF0YXNldHNbZGF0YXNldEluZGV4XS5wb2ludENvbG9yXG5cdFx0XHRcdH0pKTtcblx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdHRoaXMuc2NhbGUubGFiZWxzLnB1c2gobGFiZWwpO1xuXG5cdFx0XHR0aGlzLnJlZmxvdygpO1xuXG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdH0sXG5cdFx0cmVtb3ZlRGF0YSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLnNjYWxlLnZhbHVlc0NvdW50LS07XG5cdFx0XHR0aGlzLnNjYWxlLmxhYmVscy5zaGlmdCgpO1xuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCl7XG5cdFx0XHRcdGRhdGFzZXQucG9pbnRzLnNoaWZ0KCk7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdFx0dGhpcy5yZWZsb3coKTtcblx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0fSxcblx0XHR1cGRhdGUgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5lYWNoUG9pbnRzKGZ1bmN0aW9uKHBvaW50KXtcblx0XHRcdFx0cG9pbnQuc2F2ZSgpO1xuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnJlZmxvdygpO1xuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9LFxuXHRcdHJlZmxvdzogZnVuY3Rpb24oKXtcblx0XHRcdGhlbHBlcnMuZXh0ZW5kKHRoaXMuc2NhbGUsIHtcblx0XHRcdFx0d2lkdGggOiB0aGlzLmNoYXJ0LndpZHRoLFxuXHRcdFx0XHRoZWlnaHQ6IHRoaXMuY2hhcnQuaGVpZ2h0LFxuXHRcdFx0XHRzaXplIDogaGVscGVycy5taW4oW3RoaXMuY2hhcnQud2lkdGgsIHRoaXMuY2hhcnQuaGVpZ2h0XSksXG5cdFx0XHRcdHhDZW50ZXI6IHRoaXMuY2hhcnQud2lkdGgvMixcblx0XHRcdFx0eUNlbnRlcjogdGhpcy5jaGFydC5oZWlnaHQvMlxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnVwZGF0ZVNjYWxlUmFuZ2UodGhpcy5kYXRhc2V0cyk7XG5cdFx0XHR0aGlzLnNjYWxlLnNldFNjYWxlU2l6ZSgpO1xuXHRcdFx0dGhpcy5zY2FsZS5idWlsZFlMYWJlbHMoKTtcblx0XHR9LFxuXHRcdGRyYXcgOiBmdW5jdGlvbihlYXNlKXtcblx0XHRcdHZhciBlYXNlRGVjaW1hbCA9IGVhc2UgfHwgMSxcblx0XHRcdFx0Y3R4ID0gdGhpcy5jaGFydC5jdHg7XG5cdFx0XHR0aGlzLmNsZWFyKCk7XG5cdFx0XHR0aGlzLnNjYWxlLmRyYXcoKTtcblxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCl7XG5cblx0XHRcdFx0Ly9UcmFuc2l0aW9uIGVhY2ggcG9pbnQgZmlyc3Qgc28gdGhhdCB0aGUgbGluZSBhbmQgcG9pbnQgZHJhd2luZyBpc24ndCBvdXQgb2Ygc3luY1xuXHRcdFx0XHRoZWxwZXJzLmVhY2goZGF0YXNldC5wb2ludHMsZnVuY3Rpb24ocG9pbnQsaW5kZXgpe1xuXHRcdFx0XHRcdGlmIChwb2ludC5oYXNWYWx1ZSgpKXtcblx0XHRcdFx0XHRcdHBvaW50LnRyYW5zaXRpb24odGhpcy5zY2FsZS5nZXRQb2ludFBvc2l0aW9uKGluZGV4LCB0aGlzLnNjYWxlLmNhbGN1bGF0ZUNlbnRlck9mZnNldChwb2ludC52YWx1ZSkpLCBlYXNlRGVjaW1hbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LHRoaXMpO1xuXG5cblxuXHRcdFx0XHQvL0RyYXcgdGhlIGxpbmUgYmV0d2VlbiBhbGwgdGhlIHBvaW50c1xuXHRcdFx0XHRjdHgubGluZVdpZHRoID0gdGhpcy5vcHRpb25zLmRhdGFzZXRTdHJva2VXaWR0aDtcblx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gZGF0YXNldC5zdHJva2VDb2xvcjtcblx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRoZWxwZXJzLmVhY2goZGF0YXNldC5wb2ludHMsZnVuY3Rpb24ocG9pbnQsaW5kZXgpe1xuXHRcdFx0XHRcdGlmIChpbmRleCA9PT0gMCl7XG5cdFx0XHRcdFx0XHRjdHgubW92ZVRvKHBvaW50LngscG9pbnQueSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRjdHgubGluZVRvKHBvaW50LngscG9pbnQueSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LHRoaXMpO1xuXHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdGN0eC5zdHJva2UoKTtcblxuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gZGF0YXNldC5maWxsQ29sb3I7XG5cdFx0XHRcdGN0eC5maWxsKCk7XG5cblx0XHRcdFx0Ly9Ob3cgZHJhdyB0aGUgcG9pbnRzIG92ZXIgdGhlIGxpbmVcblx0XHRcdFx0Ly9BIGxpdHRsZSBpbmVmZmljaWVudCBkb3VibGUgbG9vcGluZywgYnV0IGJldHRlciB0aGFuIHRoZSBsaW5lXG5cdFx0XHRcdC8vbGFnZ2luZyBiZWhpbmQgdGhlIHBvaW50IHBvc2l0aW9uc1xuXHRcdFx0XHRoZWxwZXJzLmVhY2goZGF0YXNldC5wb2ludHMsZnVuY3Rpb24ocG9pbnQpe1xuXHRcdFx0XHRcdGlmIChwb2ludC5oYXNWYWx1ZSgpKXtcblx0XHRcdFx0XHRcdHBvaW50LmRyYXcoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHR9LHRoaXMpO1xuXG5cdFx0fVxuXG5cdH0pO1xuXG5cblxuXG5cbn0pLmNhbGwodGhpcyk7IiwiLy8hIG1vbWVudC5qc1xuLy8hIHZlcnNpb24gOiAyLjEwLjNcbi8vISBhdXRob3JzIDogVGltIFdvb2QsIElza3JlbiBDaGVybmV2LCBNb21lbnQuanMgY29udHJpYnV0b3JzXG4vLyEgbGljZW5zZSA6IE1JVFxuLy8hIG1vbWVudGpzLmNvbVxuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAgIGdsb2JhbC5tb21lbnQgPSBmYWN0b3J5KClcbn0odGhpcywgZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgaG9va0NhbGxiYWNrO1xuXG4gICAgZnVuY3Rpb24gdXRpbHNfaG9va3NfX2hvb2tzICgpIHtcbiAgICAgICAgcmV0dXJuIGhvb2tDYWxsYmFjay5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIC8vIFRoaXMgaXMgZG9uZSB0byByZWdpc3RlciB0aGUgbWV0aG9kIGNhbGxlZCB3aXRoIG1vbWVudCgpXG4gICAgLy8gd2l0aG91dCBjcmVhdGluZyBjaXJjdWxhciBkZXBlbmRlbmNpZXMuXG4gICAgZnVuY3Rpb24gc2V0SG9va0NhbGxiYWNrIChjYWxsYmFjaykge1xuICAgICAgICBob29rQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0FycmF5KGlucHV0KSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF0ZShpbnB1dCkge1xuICAgICAgICByZXR1cm4gaW5wdXQgaW5zdGFuY2VvZiBEYXRlIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IERhdGVdJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXAoYXJyLCBmbikge1xuICAgICAgICB2YXIgcmVzID0gW10sIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKGZuKGFycltpXSwgaSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFzT3duUHJvcChhLCBiKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYSwgYik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXh0ZW5kKGEsIGIpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBiKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChiLCBpKSkge1xuICAgICAgICAgICAgICAgIGFbaV0gPSBiW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3RvU3RyaW5nJykpIHtcbiAgICAgICAgICAgIGEudG9TdHJpbmcgPSBiLnRvU3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3ZhbHVlT2YnKSkge1xuICAgICAgICAgICAgYS52YWx1ZU9mID0gYi52YWx1ZU9mO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlX3V0Y19fY3JlYXRlVVRDIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlTG9jYWxPclVUQyhpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCwgdHJ1ZSkudXRjKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmYXVsdFBhcnNpbmdGbGFncygpIHtcbiAgICAgICAgLy8gV2UgbmVlZCB0byBkZWVwIGNsb25lIHRoaXMgb2JqZWN0LlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZW1wdHkgICAgICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICB1bnVzZWRUb2tlbnMgICAgOiBbXSxcbiAgICAgICAgICAgIHVudXNlZElucHV0ICAgICA6IFtdLFxuICAgICAgICAgICAgb3ZlcmZsb3cgICAgICAgIDogLTIsXG4gICAgICAgICAgICBjaGFyc0xlZnRPdmVyICAgOiAwLFxuICAgICAgICAgICAgbnVsbElucHV0ICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICBpbnZhbGlkTW9udGggICAgOiBudWxsLFxuICAgICAgICAgICAgaW52YWxpZEZvcm1hdCAgIDogZmFsc2UsXG4gICAgICAgICAgICB1c2VySW52YWxpZGF0ZWQgOiBmYWxzZSxcbiAgICAgICAgICAgIGlzbyAgICAgICAgICAgICA6IGZhbHNlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UGFyc2luZ0ZsYWdzKG0pIHtcbiAgICAgICAgaWYgKG0uX3BmID09IG51bGwpIHtcbiAgICAgICAgICAgIG0uX3BmID0gZGVmYXVsdFBhcnNpbmdGbGFncygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtLl9wZjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZF9faXNWYWxpZChtKSB7XG4gICAgICAgIGlmIChtLl9pc1ZhbGlkID09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBmbGFncyA9IGdldFBhcnNpbmdGbGFncyhtKTtcbiAgICAgICAgICAgIG0uX2lzVmFsaWQgPSAhaXNOYU4obS5fZC5nZXRUaW1lKCkpICYmXG4gICAgICAgICAgICAgICAgZmxhZ3Mub3ZlcmZsb3cgPCAwICYmXG4gICAgICAgICAgICAgICAgIWZsYWdzLmVtcHR5ICYmXG4gICAgICAgICAgICAgICAgIWZsYWdzLmludmFsaWRNb250aCAmJlxuICAgICAgICAgICAgICAgICFmbGFncy5udWxsSW5wdXQgJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3MuaW52YWxpZEZvcm1hdCAmJlxuICAgICAgICAgICAgICAgICFmbGFncy51c2VySW52YWxpZGF0ZWQ7XG5cbiAgICAgICAgICAgIGlmIChtLl9zdHJpY3QpIHtcbiAgICAgICAgICAgICAgICBtLl9pc1ZhbGlkID0gbS5faXNWYWxpZCAmJlxuICAgICAgICAgICAgICAgICAgICBmbGFncy5jaGFyc0xlZnRPdmVyID09PSAwICYmXG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLnVudXNlZFRva2Vucy5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3MuYmlnSG91ciA9PT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtLl9pc1ZhbGlkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkX19jcmVhdGVJbnZhbGlkIChmbGFncykge1xuICAgICAgICB2YXIgbSA9IGNyZWF0ZV91dGNfX2NyZWF0ZVVUQyhOYU4pO1xuICAgICAgICBpZiAoZmxhZ3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgZXh0ZW5kKGdldFBhcnNpbmdGbGFncyhtKSwgZmxhZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKG0pLnVzZXJJbnZhbGlkYXRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG5cbiAgICB2YXIgbW9tZW50UHJvcGVydGllcyA9IHV0aWxzX2hvb2tzX19ob29rcy5tb21lbnRQcm9wZXJ0aWVzID0gW107XG5cbiAgICBmdW5jdGlvbiBjb3B5Q29uZmlnKHRvLCBmcm9tKSB7XG4gICAgICAgIHZhciBpLCBwcm9wLCB2YWw7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9pc0FNb21lbnRPYmplY3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5faXNBTW9tZW50T2JqZWN0ID0gZnJvbS5faXNBTW9tZW50T2JqZWN0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5faSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9pID0gZnJvbS5faTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2YgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fZiA9IGZyb20uX2Y7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9sICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2wgPSBmcm9tLl9sO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fc3RyaWN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX3N0cmljdCA9IGZyb20uX3N0cmljdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX3R6bSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl90em0gPSBmcm9tLl90em07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9pc1VUQyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9pc1VUQyA9IGZyb20uX2lzVVRDO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fb2Zmc2V0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX29mZnNldCA9IGZyb20uX29mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX3BmICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX3BmID0gZ2V0UGFyc2luZ0ZsYWdzKGZyb20pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fbG9jYWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2xvY2FsZSA9IGZyb20uX2xvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb21lbnRQcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAoaSBpbiBtb21lbnRQcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgcHJvcCA9IG1vbWVudFByb3BlcnRpZXNbaV07XG4gICAgICAgICAgICAgICAgdmFsID0gZnJvbVtwcm9wXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9bcHJvcF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvO1xuICAgIH1cblxuICAgIHZhciB1cGRhdGVJblByb2dyZXNzID0gZmFsc2U7XG5cbiAgICAvLyBNb21lbnQgcHJvdG90eXBlIG9iamVjdFxuICAgIGZ1bmN0aW9uIE1vbWVudChjb25maWcpIHtcbiAgICAgICAgY29weUNvbmZpZyh0aGlzLCBjb25maWcpO1xuICAgICAgICB0aGlzLl9kID0gbmV3IERhdGUoK2NvbmZpZy5fZCk7XG4gICAgICAgIC8vIFByZXZlbnQgaW5maW5pdGUgbG9vcCBpbiBjYXNlIHVwZGF0ZU9mZnNldCBjcmVhdGVzIG5ldyBtb21lbnRcbiAgICAgICAgLy8gb2JqZWN0cy5cbiAgICAgICAgaWYgKHVwZGF0ZUluUHJvZ3Jlc3MgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB1cGRhdGVJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy51cGRhdGVPZmZzZXQodGhpcyk7XG4gICAgICAgICAgICB1cGRhdGVJblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc01vbWVudCAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBNb21lbnQgfHwgKG9iaiAhPSBudWxsICYmIG9iai5faXNBTW9tZW50T2JqZWN0ICE9IG51bGwpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvSW50KGFyZ3VtZW50Rm9yQ29lcmNpb24pIHtcbiAgICAgICAgdmFyIGNvZXJjZWROdW1iZXIgPSArYXJndW1lbnRGb3JDb2VyY2lvbixcbiAgICAgICAgICAgIHZhbHVlID0gMDtcblxuICAgICAgICBpZiAoY29lcmNlZE51bWJlciAhPT0gMCAmJiBpc0Zpbml0ZShjb2VyY2VkTnVtYmVyKSkge1xuICAgICAgICAgICAgaWYgKGNvZXJjZWROdW1iZXIgPj0gMCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gTWF0aC5mbG9vcihjb2VyY2VkTnVtYmVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBNYXRoLmNlaWwoY29lcmNlZE51bWJlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tcGFyZUFycmF5cyhhcnJheTEsIGFycmF5MiwgZG9udENvbnZlcnQpIHtcbiAgICAgICAgdmFyIGxlbiA9IE1hdGgubWluKGFycmF5MS5sZW5ndGgsIGFycmF5Mi5sZW5ndGgpLFxuICAgICAgICAgICAgbGVuZ3RoRGlmZiA9IE1hdGguYWJzKGFycmF5MS5sZW5ndGggLSBhcnJheTIubGVuZ3RoKSxcbiAgICAgICAgICAgIGRpZmZzID0gMCxcbiAgICAgICAgICAgIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKChkb250Q29udmVydCAmJiBhcnJheTFbaV0gIT09IGFycmF5MltpXSkgfHxcbiAgICAgICAgICAgICAgICAoIWRvbnRDb252ZXJ0ICYmIHRvSW50KGFycmF5MVtpXSkgIT09IHRvSW50KGFycmF5MltpXSkpKSB7XG4gICAgICAgICAgICAgICAgZGlmZnMrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGlmZnMgKyBsZW5ndGhEaWZmO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIExvY2FsZSgpIHtcbiAgICB9XG5cbiAgICB2YXIgbG9jYWxlcyA9IHt9O1xuICAgIHZhciBnbG9iYWxMb2NhbGU7XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVMb2NhbGUoa2V5KSB7XG4gICAgICAgIHJldHVybiBrZXkgPyBrZXkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCdfJywgJy0nKSA6IGtleTtcbiAgICB9XG5cbiAgICAvLyBwaWNrIHRoZSBsb2NhbGUgZnJvbSB0aGUgYXJyYXlcbiAgICAvLyB0cnkgWydlbi1hdScsICdlbi1nYiddIGFzICdlbi1hdScsICdlbi1nYicsICdlbicsIGFzIGluIG1vdmUgdGhyb3VnaCB0aGUgbGlzdCB0cnlpbmcgZWFjaFxuICAgIC8vIHN1YnN0cmluZyBmcm9tIG1vc3Qgc3BlY2lmaWMgdG8gbGVhc3QsIGJ1dCBtb3ZlIHRvIHRoZSBuZXh0IGFycmF5IGl0ZW0gaWYgaXQncyBhIG1vcmUgc3BlY2lmaWMgdmFyaWFudCB0aGFuIHRoZSBjdXJyZW50IHJvb3RcbiAgICBmdW5jdGlvbiBjaG9vc2VMb2NhbGUobmFtZXMpIHtcbiAgICAgICAgdmFyIGkgPSAwLCBqLCBuZXh0LCBsb2NhbGUsIHNwbGl0O1xuXG4gICAgICAgIHdoaWxlIChpIDwgbmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzcGxpdCA9IG5vcm1hbGl6ZUxvY2FsZShuYW1lc1tpXSkuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgIGogPSBzcGxpdC5sZW5ndGg7XG4gICAgICAgICAgICBuZXh0ID0gbm9ybWFsaXplTG9jYWxlKG5hbWVzW2kgKyAxXSk7XG4gICAgICAgICAgICBuZXh0ID0gbmV4dCA/IG5leHQuc3BsaXQoJy0nKSA6IG51bGw7XG4gICAgICAgICAgICB3aGlsZSAoaiA+IDApIHtcbiAgICAgICAgICAgICAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKHNwbGl0LnNsaWNlKDAsIGopLmpvaW4oJy0nKSk7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobmV4dCAmJiBuZXh0Lmxlbmd0aCA+PSBqICYmIGNvbXBhcmVBcnJheXMoc3BsaXQsIG5leHQsIHRydWUpID49IGogLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vdGhlIG5leHQgYXJyYXkgaXRlbSBpcyBiZXR0ZXIgdGhhbiBhIHNoYWxsb3dlciBzdWJzdHJpbmcgb2YgdGhpcyBvbmVcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGotLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkTG9jYWxlKG5hbWUpIHtcbiAgICAgICAgdmFyIG9sZExvY2FsZSA9IG51bGw7XG4gICAgICAgIC8vIFRPRE86IEZpbmQgYSBiZXR0ZXIgd2F5IHRvIHJlZ2lzdGVyIGFuZCBsb2FkIGFsbCB0aGUgbG9jYWxlcyBpbiBOb2RlXG4gICAgICAgIGlmICghbG9jYWxlc1tuYW1lXSAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgIG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBvbGRMb2NhbGUgPSBnbG9iYWxMb2NhbGUuX2FiYnI7XG4gICAgICAgICAgICAgICAgcmVxdWlyZSgnLi9sb2NhbGUvJyArIG5hbWUpO1xuICAgICAgICAgICAgICAgIC8vIGJlY2F1c2UgZGVmaW5lTG9jYWxlIGN1cnJlbnRseSBhbHNvIHNldHMgdGhlIGdsb2JhbCBsb2NhbGUsIHdlXG4gICAgICAgICAgICAgICAgLy8gd2FudCB0byB1bmRvIHRoYXQgZm9yIGxhenkgbG9hZGVkIGxvY2FsZXNcbiAgICAgICAgICAgICAgICBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlKG9sZExvY2FsZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9jYWxlc1tuYW1lXTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgbG9hZCBsb2NhbGUgYW5kIHRoZW4gc2V0IHRoZSBnbG9iYWwgbG9jYWxlLiAgSWZcbiAgICAvLyBubyBhcmd1bWVudHMgYXJlIHBhc3NlZCBpbiwgaXQgd2lsbCBzaW1wbHkgcmV0dXJuIHRoZSBjdXJyZW50IGdsb2JhbFxuICAgIC8vIGxvY2FsZSBrZXkuXG4gICAgZnVuY3Rpb24gbG9jYWxlX2xvY2FsZXNfX2dldFNldEdsb2JhbExvY2FsZSAoa2V5LCB2YWx1ZXMpIHtcbiAgICAgICAgdmFyIGRhdGE7XG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWVzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGVmaW5lTG9jYWxlKGtleSwgdmFsdWVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyBtb21lbnQuZHVyYXRpb24uX2xvY2FsZSA9IG1vbWVudC5fbG9jYWxlID0gZGF0YTtcbiAgICAgICAgICAgICAgICBnbG9iYWxMb2NhbGUgPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGdsb2JhbExvY2FsZS5fYWJicjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZpbmVMb2NhbGUgKG5hbWUsIHZhbHVlcykge1xuICAgICAgICBpZiAodmFsdWVzICE9PSBudWxsKSB7XG4gICAgICAgICAgICB2YWx1ZXMuYWJiciA9IG5hbWU7XG4gICAgICAgICAgICBpZiAoIWxvY2FsZXNbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICBsb2NhbGVzW25hbWVdID0gbmV3IExvY2FsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9jYWxlc1tuYW1lXS5zZXQodmFsdWVzKTtcblxuICAgICAgICAgICAgLy8gYmFja3dhcmRzIGNvbXBhdCBmb3Igbm93OiBhbHNvIHNldCB0aGUgbG9jYWxlXG4gICAgICAgICAgICBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlKG5hbWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gbG9jYWxlc1tuYW1lXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHVzZWZ1bCBmb3IgdGVzdGluZ1xuICAgICAgICAgICAgZGVsZXRlIGxvY2FsZXNbbmFtZV07XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJldHVybnMgbG9jYWxlIGRhdGFcbiAgICBmdW5jdGlvbiBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlIChrZXkpIHtcbiAgICAgICAgdmFyIGxvY2FsZTtcblxuICAgICAgICBpZiAoa2V5ICYmIGtleS5fbG9jYWxlICYmIGtleS5fbG9jYWxlLl9hYmJyKSB7XG4gICAgICAgICAgICBrZXkgPSBrZXkuX2xvY2FsZS5fYWJicjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsTG9jYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0FycmF5KGtleSkpIHtcbiAgICAgICAgICAgIC8vc2hvcnQtY2lyY3VpdCBldmVyeXRoaW5nIGVsc2VcbiAgICAgICAgICAgIGxvY2FsZSA9IGxvYWRMb2NhbGUoa2V5KTtcbiAgICAgICAgICAgIGlmIChsb2NhbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5ID0gW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2hvb3NlTG9jYWxlKGtleSk7XG4gICAgfVxuXG4gICAgdmFyIGFsaWFzZXMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGFkZFVuaXRBbGlhcyAodW5pdCwgc2hvcnRoYW5kKSB7XG4gICAgICAgIHZhciBsb3dlckNhc2UgPSB1bml0LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGFsaWFzZXNbbG93ZXJDYXNlXSA9IGFsaWFzZXNbbG93ZXJDYXNlICsgJ3MnXSA9IGFsaWFzZXNbc2hvcnRoYW5kXSA9IHVuaXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplVW5pdHModW5pdHMpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB1bml0cyA9PT0gJ3N0cmluZycgPyBhbGlhc2VzW3VuaXRzXSB8fCBhbGlhc2VzW3VuaXRzLnRvTG93ZXJDYXNlKCldIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZU9iamVjdFVuaXRzKGlucHV0T2JqZWN0KSB7XG4gICAgICAgIHZhciBub3JtYWxpemVkSW5wdXQgPSB7fSxcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wLFxuICAgICAgICAgICAgcHJvcDtcblxuICAgICAgICBmb3IgKHByb3AgaW4gaW5wdXRPYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wKGlucHV0T2JqZWN0LCBwcm9wKSkge1xuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wID0gbm9ybWFsaXplVW5pdHMocHJvcCk7XG4gICAgICAgICAgICAgICAgaWYgKG5vcm1hbGl6ZWRQcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dFtub3JtYWxpemVkUHJvcF0gPSBpbnB1dE9iamVjdFtwcm9wXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9ybWFsaXplZElucHV0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VHZXRTZXQgKHVuaXQsIGtlZXBUaW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZ2V0X3NldF9fc2V0KHRoaXMsIHVuaXQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIGtlZXBUaW1lKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldF9zZXRfX2dldCh0aGlzLCB1bml0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRfc2V0X19nZXQgKG1vbSwgdW5pdCkge1xuICAgICAgICByZXR1cm4gbW9tLl9kWydnZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArIHVuaXRdKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0X3NldF9fc2V0IChtb20sIHVuaXQsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgdW5pdF0odmFsdWUpO1xuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldCAodW5pdHMsIHZhbHVlKSB7XG4gICAgICAgIHZhciB1bml0O1xuICAgICAgICBpZiAodHlwZW9mIHVuaXRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgZm9yICh1bml0IGluIHVuaXRzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXQodW5pdCwgdW5pdHNbdW5pdF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXNbdW5pdHNdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNbdW5pdHNdKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB6ZXJvRmlsbChudW1iZXIsIHRhcmdldExlbmd0aCwgZm9yY2VTaWduKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSAnJyArIE1hdGguYWJzKG51bWJlciksXG4gICAgICAgICAgICBzaWduID0gbnVtYmVyID49IDA7XG5cbiAgICAgICAgd2hpbGUgKG91dHB1dC5sZW5ndGggPCB0YXJnZXRMZW5ndGgpIHtcbiAgICAgICAgICAgIG91dHB1dCA9ICcwJyArIG91dHB1dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHNpZ24gPyAoZm9yY2VTaWduID8gJysnIDogJycpIDogJy0nKSArIG91dHB1dDtcbiAgICB9XG5cbiAgICB2YXIgZm9ybWF0dGluZ1Rva2VucyA9IC8oXFxbW15cXFtdKlxcXSl8KFxcXFwpPyhNb3xNTT9NP00/fERvfERERG98REQ/RD9EP3xkZGQ/ZD98ZG8/fHdbb3x3XT98V1tvfFddP3xRfFlZWVlZWXxZWVlZWXxZWVlZfFlZfGdnKGdnZz8pP3xHRyhHR0c/KT98ZXxFfGF8QXxoaD98SEg/fG1tP3xzcz98U3sxLDR9fHh8WHx6ej98Wlo/fC4pL2c7XG5cbiAgICB2YXIgbG9jYWxGb3JtYXR0aW5nVG9rZW5zID0gLyhcXFtbXlxcW10qXFxdKXwoXFxcXCk/KExUU3xMVHxMTD9MP0w/fGx7MSw0fSkvZztcblxuICAgIHZhciBmb3JtYXRGdW5jdGlvbnMgPSB7fTtcblxuICAgIHZhciBmb3JtYXRUb2tlbkZ1bmN0aW9ucyA9IHt9O1xuXG4gICAgLy8gdG9rZW46ICAgICdNJ1xuICAgIC8vIHBhZGRlZDogICBbJ01NJywgMl1cbiAgICAvLyBvcmRpbmFsOiAgJ01vJ1xuICAgIC8vIGNhbGxiYWNrOiBmdW5jdGlvbiAoKSB7IHRoaXMubW9udGgoKSArIDEgfVxuICAgIGZ1bmN0aW9uIGFkZEZvcm1hdFRva2VuICh0b2tlbiwgcGFkZGVkLCBvcmRpbmFsLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgZnVuYyA9IGNhbGxiYWNrO1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1tjYWxsYmFja10oKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1t0b2tlbl0gPSBmdW5jO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYWRkZWQpIHtcbiAgICAgICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW3BhZGRlZFswXV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHplcm9GaWxsKGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgcGFkZGVkWzFdLCBwYWRkZWRbMl0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3JkaW5hbCkge1xuICAgICAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbb3JkaW5hbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm9yZGluYWwoZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCB0b2tlbik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRm9ybWF0dGluZ1Rva2VucyhpbnB1dCkge1xuICAgICAgICBpZiAoaW5wdXQubWF0Y2goL1xcW1tcXHNcXFNdLykpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9eXFxbfFxcXSQvZywgJycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9cXFxcL2csICcnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlRm9ybWF0RnVuY3Rpb24oZm9ybWF0KSB7XG4gICAgICAgIHZhciBhcnJheSA9IGZvcm1hdC5tYXRjaChmb3JtYXR0aW5nVG9rZW5zKSwgaSwgbGVuZ3RoO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0VG9rZW5GdW5jdGlvbnNbYXJyYXlbaV1dKSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSBmb3JtYXRUb2tlbkZ1bmN0aW9uc1thcnJheVtpXV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gcmVtb3ZlRm9ybWF0dGluZ1Rva2VucyhhcnJheVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1vbSkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9ICcnO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IGFycmF5W2ldIGluc3RhbmNlb2YgRnVuY3Rpb24gPyBhcnJheVtpXS5jYWxsKG1vbSwgZm9ybWF0KSA6IGFycmF5W2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBmb3JtYXQgZGF0ZSB1c2luZyBuYXRpdmUgZGF0ZSBvYmplY3RcbiAgICBmdW5jdGlvbiBmb3JtYXRNb21lbnQobSwgZm9ybWF0KSB7XG4gICAgICAgIGlmICghbS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBtLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0ID0gZXhwYW5kRm9ybWF0KGZvcm1hdCwgbS5sb2NhbGVEYXRhKCkpO1xuXG4gICAgICAgIGlmICghZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0pIHtcbiAgICAgICAgICAgIGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdID0gbWFrZUZvcm1hdEZ1bmN0aW9uKGZvcm1hdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0obSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhwYW5kRm9ybWF0KGZvcm1hdCwgbG9jYWxlKSB7XG4gICAgICAgIHZhciBpID0gNTtcblxuICAgICAgICBmdW5jdGlvbiByZXBsYWNlTG9uZ0RhdGVGb3JtYXRUb2tlbnMoaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGUubG9uZ0RhdGVGb3JtYXQoaW5wdXQpIHx8IGlucHV0O1xuICAgICAgICB9XG5cbiAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIHdoaWxlIChpID49IDAgJiYgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLnRlc3QoZm9ybWF0KSkge1xuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UobG9jYWxGb3JtYXR0aW5nVG9rZW5zLCByZXBsYWNlTG9uZ0RhdGVGb3JtYXRUb2tlbnMpO1xuICAgICAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICBpIC09IDE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9ybWF0O1xuICAgIH1cblxuICAgIHZhciBtYXRjaDEgICAgICAgICA9IC9cXGQvOyAgICAgICAgICAgIC8vICAgICAgIDAgLSA5XG4gICAgdmFyIG1hdGNoMiAgICAgICAgID0gL1xcZFxcZC87ICAgICAgICAgIC8vICAgICAgMDAgLSA5OVxuICAgIHZhciBtYXRjaDMgICAgICAgICA9IC9cXGR7M30vOyAgICAgICAgIC8vICAgICAwMDAgLSA5OTlcbiAgICB2YXIgbWF0Y2g0ICAgICAgICAgPSAvXFxkezR9LzsgICAgICAgICAvLyAgICAwMDAwIC0gOTk5OVxuICAgIHZhciBtYXRjaDYgICAgICAgICA9IC9bKy1dP1xcZHs2fS87ICAgIC8vIC05OTk5OTkgLSA5OTk5OTlcbiAgICB2YXIgbWF0Y2gxdG8yICAgICAgPSAvXFxkXFxkPy87ICAgICAgICAgLy8gICAgICAgMCAtIDk5XG4gICAgdmFyIG1hdGNoMXRvMyAgICAgID0gL1xcZHsxLDN9LzsgICAgICAgLy8gICAgICAgMCAtIDk5OVxuICAgIHZhciBtYXRjaDF0bzQgICAgICA9IC9cXGR7MSw0fS87ICAgICAgIC8vICAgICAgIDAgLSA5OTk5XG4gICAgdmFyIG1hdGNoMXRvNiAgICAgID0gL1srLV0/XFxkezEsNn0vOyAgLy8gLTk5OTk5OSAtIDk5OTk5OVxuXG4gICAgdmFyIG1hdGNoVW5zaWduZWQgID0gL1xcZCsvOyAgICAgICAgICAgLy8gICAgICAgMCAtIGluZlxuICAgIHZhciBtYXRjaFNpZ25lZCAgICA9IC9bKy1dP1xcZCsvOyAgICAgIC8vICAgIC1pbmYgLSBpbmZcblxuICAgIHZhciBtYXRjaE9mZnNldCAgICA9IC9afFsrLV1cXGRcXGQ6P1xcZFxcZC9naTsgLy8gKzAwOjAwIC0wMDowMCArMDAwMCAtMDAwMCBvciBaXG5cbiAgICB2YXIgbWF0Y2hUaW1lc3RhbXAgPSAvWystXT9cXGQrKFxcLlxcZHsxLDN9KT8vOyAvLyAxMjM0NTY3ODkgMTIzNDU2Nzg5LjEyM1xuXG4gICAgLy8gYW55IHdvcmQgKG9yIHR3bykgY2hhcmFjdGVycyBvciBudW1iZXJzIGluY2x1ZGluZyB0d28vdGhyZWUgd29yZCBtb250aCBpbiBhcmFiaWMuXG4gICAgdmFyIG1hdGNoV29yZCA9IC9bMC05XSpbJ2EtelxcdTAwQTAtXFx1MDVGRlxcdTA3MDAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0rfFtcXHUwNjAwLVxcdTA2RkZcXC9dKyhcXHMqP1tcXHUwNjAwLVxcdTA2RkZdKyl7MSwyfS9pO1xuXG4gICAgdmFyIHJlZ2V4ZXMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGFkZFJlZ2V4VG9rZW4gKHRva2VuLCByZWdleCwgc3RyaWN0UmVnZXgpIHtcbiAgICAgICAgcmVnZXhlc1t0b2tlbl0gPSB0eXBlb2YgcmVnZXggPT09ICdmdW5jdGlvbicgPyByZWdleCA6IGZ1bmN0aW9uIChpc1N0cmljdCkge1xuICAgICAgICAgICAgcmV0dXJuIChpc1N0cmljdCAmJiBzdHJpY3RSZWdleCkgPyBzdHJpY3RSZWdleCA6IHJlZ2V4O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFBhcnNlUmVnZXhGb3JUb2tlbiAodG9rZW4sIGNvbmZpZykge1xuICAgICAgICBpZiAoIWhhc093blByb3AocmVnZXhlcywgdG9rZW4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cCh1bmVzY2FwZUZvcm1hdCh0b2tlbikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlZ2V4ZXNbdG9rZW5dKGNvbmZpZy5fc3RyaWN0LCBjb25maWcuX2xvY2FsZSk7XG4gICAgfVxuXG4gICAgLy8gQ29kZSBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzU2MTQ5My9pcy10aGVyZS1hLXJlZ2V4cC1lc2NhcGUtZnVuY3Rpb24taW4tamF2YXNjcmlwdFxuICAgIGZ1bmN0aW9uIHVuZXNjYXBlRm9ybWF0KHMpIHtcbiAgICAgICAgcmV0dXJuIHMucmVwbGFjZSgnXFxcXCcsICcnKS5yZXBsYWNlKC9cXFxcKFxcWyl8XFxcXChcXF0pfFxcWyhbXlxcXVxcW10qKVxcXXxcXFxcKC4pL2csIGZ1bmN0aW9uIChtYXRjaGVkLCBwMSwgcDIsIHAzLCBwNCkge1xuICAgICAgICAgICAgcmV0dXJuIHAxIHx8IHAyIHx8IHAzIHx8IHA0O1xuICAgICAgICB9KS5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcbiAgICB9XG5cbiAgICB2YXIgdG9rZW5zID0ge307XG5cbiAgICBmdW5jdGlvbiBhZGRQYXJzZVRva2VuICh0b2tlbiwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGksIGZ1bmMgPSBjYWxsYmFjaztcbiAgICAgICAgaWYgKHR5cGVvZiB0b2tlbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRva2VuID0gW3Rva2VuXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgZnVuYyA9IGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgICAgICAgICBhcnJheVtjYWxsYmFja10gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0b2tlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG9rZW5zW3Rva2VuW2ldXSA9IGZ1bmM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRXZWVrUGFyc2VUb2tlbiAodG9rZW4sIGNhbGxiYWNrKSB7XG4gICAgICAgIGFkZFBhcnNlVG9rZW4odG9rZW4sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgICAgIGNvbmZpZy5fdyA9IGNvbmZpZy5fdyB8fCB7fTtcbiAgICAgICAgICAgIGNhbGxiYWNrKGlucHV0LCBjb25maWcuX3csIGNvbmZpZywgdG9rZW4pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRUaW1lVG9BcnJheUZyb21Ub2tlbih0b2tlbiwgaW5wdXQsIGNvbmZpZykge1xuICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCAmJiBoYXNPd25Qcm9wKHRva2VucywgdG9rZW4pKSB7XG4gICAgICAgICAgICB0b2tlbnNbdG9rZW5dKGlucHV0LCBjb25maWcuX2EsIGNvbmZpZywgdG9rZW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIFlFQVIgPSAwO1xuICAgIHZhciBNT05USCA9IDE7XG4gICAgdmFyIERBVEUgPSAyO1xuICAgIHZhciBIT1VSID0gMztcbiAgICB2YXIgTUlOVVRFID0gNDtcbiAgICB2YXIgU0VDT05EID0gNTtcbiAgICB2YXIgTUlMTElTRUNPTkQgPSA2O1xuXG4gICAgZnVuY3Rpb24gZGF5c0luTW9udGgoeWVhciwgbW9udGgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKHllYXIsIG1vbnRoICsgMSwgMCkpLmdldFVUQ0RhdGUoKTtcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignTScsIFsnTU0nLCAyXSwgJ01vJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tb250aCgpICsgMTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdNTU0nLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tb250aHNTaG9ydCh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ01NTU0nLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tb250aHModGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnbW9udGgnLCAnTScpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignTScsICAgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignTU0nLCAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdNTU0nLCAgbWF0Y2hXb3JkKTtcbiAgICBhZGRSZWdleFRva2VuKCdNTU1NJywgbWF0Y2hXb3JkKTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydNJywgJ01NJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbTU9OVEhdID0gdG9JbnQoaW5wdXQpIC0gMTtcbiAgICB9KTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydNTU0nLCAnTU1NTSddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHZhciBtb250aCA9IGNvbmZpZy5fbG9jYWxlLm1vbnRoc1BhcnNlKGlucHV0LCB0b2tlbiwgY29uZmlnLl9zdHJpY3QpO1xuICAgICAgICAvLyBpZiB3ZSBkaWRuJ3QgZmluZCBhIG1vbnRoIG5hbWUsIG1hcmsgdGhlIGRhdGUgYXMgaW52YWxpZC5cbiAgICAgICAgaWYgKG1vbnRoICE9IG51bGwpIHtcbiAgICAgICAgICAgIGFycmF5W01PTlRIXSA9IG1vbnRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaW52YWxpZE1vbnRoID0gaW5wdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIExPQ0FMRVNcblxuICAgIHZhciBkZWZhdWx0TG9jYWxlTW9udGhzID0gJ0phbnVhcnlfRmVicnVhcnlfTWFyY2hfQXByaWxfTWF5X0p1bmVfSnVseV9BdWd1c3RfU2VwdGVtYmVyX09jdG9iZXJfTm92ZW1iZXJfRGVjZW1iZXInLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlTW9udGhzIChtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb250aHNbbS5tb250aCgpXTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZU1vbnRoc1Nob3J0ID0gJ0phbl9GZWJfTWFyX0Fwcl9NYXlfSnVuX0p1bF9BdWdfU2VwX09jdF9Ob3ZfRGVjJy5zcGxpdCgnXycpO1xuICAgIGZ1bmN0aW9uIGxvY2FsZU1vbnRoc1Nob3J0IChtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTaG9ydFttLm1vbnRoKCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZU1vbnRoc1BhcnNlIChtb250aE5hbWUsIGZvcm1hdCwgc3RyaWN0KSB7XG4gICAgICAgIHZhciBpLCBtb20sIHJlZ2V4O1xuXG4gICAgICAgIGlmICghdGhpcy5fbW9udGhzUGFyc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9sb25nTW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3J0TW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgICAgIG1vbSA9IGNyZWF0ZV91dGNfX2NyZWF0ZVVUQyhbMjAwMCwgaV0pO1xuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiAhdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLm1vbnRocyhtb20sICcnKS5yZXBsYWNlKCcuJywgJycpICsgJyQnLCAnaScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nob3J0TW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKCdeJyArIHRoaXMubW9udGhzU2hvcnQobW9tLCAnJykucmVwbGFjZSgnLicsICcnKSArICckJywgJ2knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghc3RyaWN0ICYmICF0aGlzLl9tb250aHNQYXJzZVtpXSkge1xuICAgICAgICAgICAgICAgIHJlZ2V4ID0gJ14nICsgdGhpcy5tb250aHMobW9tLCAnJykgKyAnfF4nICsgdGhpcy5tb250aHNTaG9ydChtb20sICcnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNQYXJzZVtpXSA9IG5ldyBSZWdFeHAocmVnZXgucmVwbGFjZSgnLicsICcnKSwgJ2knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRlc3QgdGhlIHJlZ2V4XG4gICAgICAgICAgICBpZiAoc3RyaWN0ICYmIGZvcm1hdCA9PT0gJ01NTU0nICYmIHRoaXMuX2xvbmdNb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RyaWN0ICYmIGZvcm1hdCA9PT0gJ01NTScgJiYgdGhpcy5fc2hvcnRNb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCAmJiB0aGlzLl9tb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIHNldE1vbnRoIChtb20sIHZhbHVlKSB7XG4gICAgICAgIHZhciBkYXlPZk1vbnRoO1xuXG4gICAgICAgIC8vIFRPRE86IE1vdmUgdGhpcyBvdXQgb2YgaGVyZSFcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhbHVlID0gbW9tLmxvY2FsZURhdGEoKS5tb250aHNQYXJzZSh2YWx1ZSk7XG4gICAgICAgICAgICAvLyBUT0RPOiBBbm90aGVyIHNpbGVudCBmYWlsdXJlP1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZGF5T2ZNb250aCA9IE1hdGgubWluKG1vbS5kYXRlKCksIGRheXNJbk1vbnRoKG1vbS55ZWFyKCksIHZhbHVlKSk7XG4gICAgICAgIG1vbS5fZFsnc2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyAnTW9udGgnXSh2YWx1ZSwgZGF5T2ZNb250aCk7XG4gICAgICAgIHJldHVybiBtb207XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0TW9udGggKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBzZXRNb250aCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0X3NldF9fZ2V0KHRoaXMsICdNb250aCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RGF5c0luTW9udGggKCkge1xuICAgICAgICByZXR1cm4gZGF5c0luTW9udGgodGhpcy55ZWFyKCksIHRoaXMubW9udGgoKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tPdmVyZmxvdyAobSkge1xuICAgICAgICB2YXIgb3ZlcmZsb3c7XG4gICAgICAgIHZhciBhID0gbS5fYTtcblxuICAgICAgICBpZiAoYSAmJiBnZXRQYXJzaW5nRmxhZ3MobSkub3ZlcmZsb3cgPT09IC0yKSB7XG4gICAgICAgICAgICBvdmVyZmxvdyA9XG4gICAgICAgICAgICAgICAgYVtNT05USF0gICAgICAgPCAwIHx8IGFbTU9OVEhdICAgICAgID4gMTEgID8gTU9OVEggOlxuICAgICAgICAgICAgICAgIGFbREFURV0gICAgICAgIDwgMSB8fCBhW0RBVEVdICAgICAgICA+IGRheXNJbk1vbnRoKGFbWUVBUl0sIGFbTU9OVEhdKSA/IERBVEUgOlxuICAgICAgICAgICAgICAgIGFbSE9VUl0gICAgICAgIDwgMCB8fCBhW0hPVVJdICAgICAgICA+IDI0IHx8IChhW0hPVVJdID09PSAyNCAmJiAoYVtNSU5VVEVdICE9PSAwIHx8IGFbU0VDT05EXSAhPT0gMCB8fCBhW01JTExJU0VDT05EXSAhPT0gMCkpID8gSE9VUiA6XG4gICAgICAgICAgICAgICAgYVtNSU5VVEVdICAgICAgPCAwIHx8IGFbTUlOVVRFXSAgICAgID4gNTkgID8gTUlOVVRFIDpcbiAgICAgICAgICAgICAgICBhW1NFQ09ORF0gICAgICA8IDAgfHwgYVtTRUNPTkRdICAgICAgPiA1OSAgPyBTRUNPTkQgOlxuICAgICAgICAgICAgICAgIGFbTUlMTElTRUNPTkRdIDwgMCB8fCBhW01JTExJU0VDT05EXSA+IDk5OSA/IE1JTExJU0VDT05EIDpcbiAgICAgICAgICAgICAgICAtMTtcblxuICAgICAgICAgICAgaWYgKGdldFBhcnNpbmdGbGFncyhtKS5fb3ZlcmZsb3dEYXlPZlllYXIgJiYgKG92ZXJmbG93IDwgWUVBUiB8fCBvdmVyZmxvdyA+IERBVEUpKSB7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSBEQVRFO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MobSkub3ZlcmZsb3cgPSBvdmVyZmxvdztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdhcm4obXNnKSB7XG4gICAgICAgIGlmICh1dGlsc19ob29rc19faG9va3Muc3VwcHJlc3NEZXByZWNhdGlvbldhcm5pbmdzID09PSBmYWxzZSAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0RlcHJlY2F0aW9uIHdhcm5pbmc6ICcgKyBtc2cpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVwcmVjYXRlKG1zZywgZm4pIHtcbiAgICAgICAgdmFyIGZpcnN0VGltZSA9IHRydWUsXG4gICAgICAgICAgICBtc2dXaXRoU3RhY2sgPSBtc2cgKyAnXFxuJyArIChuZXcgRXJyb3IoKSkuc3RhY2s7XG5cbiAgICAgICAgcmV0dXJuIGV4dGVuZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgICAgICAgICAgICAgd2Fybihtc2dXaXRoU3RhY2spO1xuICAgICAgICAgICAgICAgIGZpcnN0VGltZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sIGZuKTtcbiAgICB9XG5cbiAgICB2YXIgZGVwcmVjYXRpb25zID0ge307XG5cbiAgICBmdW5jdGlvbiBkZXByZWNhdGVTaW1wbGUobmFtZSwgbXNnKSB7XG4gICAgICAgIGlmICghZGVwcmVjYXRpb25zW25hbWVdKSB7XG4gICAgICAgICAgICB3YXJuKG1zZyk7XG4gICAgICAgICAgICBkZXByZWNhdGlvbnNbbmFtZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnN1cHByZXNzRGVwcmVjYXRpb25XYXJuaW5ncyA9IGZhbHNlO1xuXG4gICAgdmFyIGZyb21fc3RyaW5nX19pc29SZWdleCA9IC9eXFxzKig/OlsrLV1cXGR7Nn18XFxkezR9KS0oPzooXFxkXFxkLVxcZFxcZCl8KFdcXGRcXGQkKXwoV1xcZFxcZC1cXGQpfChcXGRcXGRcXGQpKSgoVHwgKShcXGRcXGQoOlxcZFxcZCg6XFxkXFxkKFxcLlxcZCspPyk/KT8pPyhbXFwrXFwtXVxcZFxcZCg/Ojo/XFxkXFxkKT98XFxzKlopPyk/JC87XG5cbiAgICB2YXIgaXNvRGF0ZXMgPSBbXG4gICAgICAgIFsnWVlZWVlZLU1NLUREJywgL1srLV1cXGR7Nn0tXFxkezJ9LVxcZHsyfS9dLFxuICAgICAgICBbJ1lZWVktTU0tREQnLCAvXFxkezR9LVxcZHsyfS1cXGR7Mn0vXSxcbiAgICAgICAgWydHR0dHLVtXXVdXLUUnLCAvXFxkezR9LVdcXGR7Mn0tXFxkL10sXG4gICAgICAgIFsnR0dHRy1bV11XVycsIC9cXGR7NH0tV1xcZHsyfS9dLFxuICAgICAgICBbJ1lZWVktREREJywgL1xcZHs0fS1cXGR7M30vXVxuICAgIF07XG5cbiAgICAvLyBpc28gdGltZSBmb3JtYXRzIGFuZCByZWdleGVzXG4gICAgdmFyIGlzb1RpbWVzID0gW1xuICAgICAgICBbJ0hIOm1tOnNzLlNTU1MnLCAvKFR8IClcXGRcXGQ6XFxkXFxkOlxcZFxcZFxcLlxcZCsvXSxcbiAgICAgICAgWydISDptbTpzcycsIC8oVHwgKVxcZFxcZDpcXGRcXGQ6XFxkXFxkL10sXG4gICAgICAgIFsnSEg6bW0nLCAvKFR8IClcXGRcXGQ6XFxkXFxkL10sXG4gICAgICAgIFsnSEgnLCAvKFR8IClcXGRcXGQvXVxuICAgIF07XG5cbiAgICB2YXIgYXNwTmV0SnNvblJlZ2V4ID0gL15cXC8/RGF0ZVxcKChcXC0/XFxkKykvaTtcblxuICAgIC8vIGRhdGUgZnJvbSBpc28gZm9ybWF0XG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbUlTTyhjb25maWcpIHtcbiAgICAgICAgdmFyIGksIGwsXG4gICAgICAgICAgICBzdHJpbmcgPSBjb25maWcuX2ksXG4gICAgICAgICAgICBtYXRjaCA9IGZyb21fc3RyaW5nX19pc29SZWdleC5leGVjKHN0cmluZyk7XG5cbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pc28gPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IGlzb0RhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpc29EYXRlc1tpXVsxXS5leGVjKHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWF0Y2hbNV0gc2hvdWxkIGJlICdUJyBvciB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9mID0gaXNvRGF0ZXNbaV1bMF0gKyAobWF0Y2hbNl0gfHwgJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IGlzb1RpbWVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpc29UaW1lc1tpXVsxXS5leGVjKHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9mICs9IGlzb1RpbWVzW2ldWzBdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3RyaW5nLm1hdGNoKG1hdGNoT2Zmc2V0KSkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fZiArPSAnWic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSBpc28gZm9ybWF0IG9yIGZhbGxiYWNrXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbVN0cmluZyhjb25maWcpIHtcbiAgICAgICAgdmFyIG1hdGNoZWQgPSBhc3BOZXRKc29uUmVnZXguZXhlYyhjb25maWcuX2kpO1xuXG4gICAgICAgIGlmIChtYXRjaGVkICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSgrbWF0Y2hlZFsxXSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWdGcm9tSVNPKGNvbmZpZyk7XG4gICAgICAgIGlmIChjb25maWcuX2lzVmFsaWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBkZWxldGUgY29uZmlnLl9pc1ZhbGlkO1xuICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrKGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1dGlsc19ob29rc19faG9va3MuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2sgPSBkZXByZWNhdGUoXG4gICAgICAgICdtb21lbnQgY29uc3RydWN0aW9uIGZhbGxzIGJhY2sgdG8ganMgRGF0ZS4gVGhpcyBpcyAnICtcbiAgICAgICAgJ2Rpc2NvdXJhZ2VkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdXBjb21pbmcgbWFqb3IgJyArXG4gICAgICAgICdyZWxlYXNlLiBQbGVhc2UgcmVmZXIgdG8gJyArXG4gICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTQwNyBmb3IgbW9yZSBpbmZvLicsXG4gICAgICAgIGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGNvbmZpZy5faSArIChjb25maWcuX3VzZVVUQyA/ICcgVVRDJyA6ICcnKSk7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlRGF0ZSAoeSwgbSwgZCwgaCwgTSwgcywgbXMpIHtcbiAgICAgICAgLy9jYW4ndCBqdXN0IGFwcGx5KCkgdG8gY3JlYXRlIGEgZGF0ZTpcbiAgICAgICAgLy9odHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE4MTM0OC9pbnN0YW50aWF0aW5nLWEtamF2YXNjcmlwdC1vYmplY3QtYnktY2FsbGluZy1wcm90b3R5cGUtY29uc3RydWN0b3ItYXBwbHlcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh5LCBtLCBkLCBoLCBNLCBzLCBtcyk7XG5cbiAgICAgICAgLy90aGUgZGF0ZSBjb25zdHJ1Y3RvciBkb2Vzbid0IGFjY2VwdCB5ZWFycyA8IDE5NzBcbiAgICAgICAgaWYgKHkgPCAxOTcwKSB7XG4gICAgICAgICAgICBkYXRlLnNldEZ1bGxZZWFyKHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVVUQ0RhdGUgKHkpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQy5hcHBseShudWxsLCBhcmd1bWVudHMpKTtcbiAgICAgICAgaWYgKHkgPCAxOTcwKSB7XG4gICAgICAgICAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVknLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy55ZWFyKCkgJSAxMDA7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZWVknLCAgIDRdLCAgICAgICAwLCAneWVhcicpO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVlZWVknLCAgNV0sICAgICAgIDAsICd5ZWFyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydZWVlZWVknLCA2LCB0cnVlXSwgMCwgJ3llYXInKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygneWVhcicsICd5Jyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdZJywgICAgICBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignWVknLCAgICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZWVknLCAgIG1hdGNoMXRvNCwgbWF0Y2g0KTtcbiAgICBhZGRSZWdleFRva2VuKCdZWVlZWScsICBtYXRjaDF0bzYsIG1hdGNoNik7XG4gICAgYWRkUmVnZXhUb2tlbignWVlZWVlZJywgbWF0Y2gxdG82LCBtYXRjaDYpO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ1lZWVknLCAnWVlZWVknLCAnWVlZWVlZJ10sIFlFQVIpO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1lZJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtZRUFSXSA9IHV0aWxzX2hvb2tzX19ob29rcy5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICBmdW5jdGlvbiBkYXlzSW5ZZWFyKHllYXIpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVhcFllYXIoeWVhcikgPyAzNjYgOiAzNjU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNMZWFwWWVhcih5ZWFyKSB7XG4gICAgICAgIHJldHVybiAoeWVhciAlIDQgPT09IDAgJiYgeWVhciAlIDEwMCAhPT0gMCkgfHwgeWVhciAlIDQwMCA9PT0gMDtcbiAgICB9XG5cbiAgICAvLyBIT09LU1xuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnBhcnNlVHdvRGlnaXRZZWFyID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0b0ludChpbnB1dCkgKyAodG9JbnQoaW5wdXQpID4gNjggPyAxOTAwIDogMjAwMCk7XG4gICAgfTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRZZWFyID0gbWFrZUdldFNldCgnRnVsbFllYXInLCBmYWxzZSk7XG5cbiAgICBmdW5jdGlvbiBnZXRJc0xlYXBZZWFyICgpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVhcFllYXIodGhpcy55ZWFyKCkpO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKCd3JywgWyd3dycsIDJdLCAnd28nLCAnd2VlaycpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdXJywgWydXVycsIDJdLCAnV28nLCAnaXNvV2VlaycpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCd3ZWVrJywgJ3cnKTtcbiAgICBhZGRVbml0QWxpYXMoJ2lzb1dlZWsnLCAnVycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbigndycsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ3d3JywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1cnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdXVycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsndycsICd3dycsICdXJywgJ1dXJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuLnN1YnN0cigwLCAxKV0gPSB0b0ludChpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICAvLyBmaXJzdERheU9mV2VlayAgICAgICAwID0gc3VuLCA2ID0gc2F0XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgdGhlIGRheSBvZiB0aGUgd2VlayB0aGF0IHN0YXJ0cyB0aGUgd2Vla1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICh1c3VhbGx5IHN1bmRheSBvciBtb25kYXkpXG4gICAgLy8gZmlyc3REYXlPZldlZWtPZlllYXIgMCA9IHN1biwgNiA9IHNhdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIHRoZSBmaXJzdCB3ZWVrIGlzIHRoZSB3ZWVrIHRoYXQgY29udGFpbnMgdGhlIGZpcnN0XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgb2YgdGhpcyBkYXkgb2YgdGhlIHdlZWtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAoZWcuIElTTyB3ZWVrcyB1c2UgdGh1cnNkYXkgKDQpKVxuICAgIGZ1bmN0aW9uIHdlZWtPZlllYXIobW9tLCBmaXJzdERheU9mV2VlaywgZmlyc3REYXlPZldlZWtPZlllYXIpIHtcbiAgICAgICAgdmFyIGVuZCA9IGZpcnN0RGF5T2ZXZWVrT2ZZZWFyIC0gZmlyc3REYXlPZldlZWssXG4gICAgICAgICAgICBkYXlzVG9EYXlPZldlZWsgPSBmaXJzdERheU9mV2Vla09mWWVhciAtIG1vbS5kYXkoKSxcbiAgICAgICAgICAgIGFkanVzdGVkTW9tZW50O1xuXG5cbiAgICAgICAgaWYgKGRheXNUb0RheU9mV2VlayA+IGVuZCkge1xuICAgICAgICAgICAgZGF5c1RvRGF5T2ZXZWVrIC09IDc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF5c1RvRGF5T2ZXZWVrIDwgZW5kIC0gNykge1xuICAgICAgICAgICAgZGF5c1RvRGF5T2ZXZWVrICs9IDc7XG4gICAgICAgIH1cblxuICAgICAgICBhZGp1c3RlZE1vbWVudCA9IGxvY2FsX19jcmVhdGVMb2NhbChtb20pLmFkZChkYXlzVG9EYXlPZldlZWssICdkJyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3ZWVrOiBNYXRoLmNlaWwoYWRqdXN0ZWRNb21lbnQuZGF5T2ZZZWFyKCkgLyA3KSxcbiAgICAgICAgICAgIHllYXI6IGFkanVzdGVkTW9tZW50LnllYXIoKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIExPQ0FMRVNcblxuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWsgKG1vbSkge1xuICAgICAgICByZXR1cm4gd2Vla09mWWVhcihtb20sIHRoaXMuX3dlZWsuZG93LCB0aGlzLl93ZWVrLmRveSkud2VlaztcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWsgPSB7XG4gICAgICAgIGRvdyA6IDAsIC8vIFN1bmRheSBpcyB0aGUgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrLlxuICAgICAgICBkb3kgOiA2ICAvLyBUaGUgd2VlayB0aGF0IGNvbnRhaW5zIEphbiAxc3QgaXMgdGhlIGZpcnN0IHdlZWsgb2YgdGhlIHllYXIuXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxvY2FsZUZpcnN0RGF5T2ZXZWVrICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWsuZG93O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZUZpcnN0RGF5T2ZZZWFyICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWsuZG95O1xuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldFdlZWsgKGlucHV0KSB7XG4gICAgICAgIHZhciB3ZWVrID0gdGhpcy5sb2NhbGVEYXRhKCkud2Vlayh0aGlzKTtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrIDogdGhpcy5hZGQoKGlucHV0IC0gd2VlaykgKiA3LCAnZCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldElTT1dlZWsgKGlucHV0KSB7XG4gICAgICAgIHZhciB3ZWVrID0gd2Vla09mWWVhcih0aGlzLCAxLCA0KS53ZWVrO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWsgOiB0aGlzLmFkZCgoaW5wdXQgLSB3ZWVrKSAqIDcsICdkJyk7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0RERCcsIFsnRERERCcsIDNdLCAnREREbycsICdkYXlPZlllYXInKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnZGF5T2ZZZWFyJywgJ0RERCcpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignREREJywgIG1hdGNoMXRvMyk7XG4gICAgYWRkUmVnZXhUb2tlbignRERERCcsIG1hdGNoMyk7XG4gICAgYWRkUGFyc2VUb2tlbihbJ0RERCcsICdEREREJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2RheU9mWWVhciA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIC8vaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JU09fd2Vla19kYXRlI0NhbGN1bGF0aW5nX2FfZGF0ZV9naXZlbl90aGVfeWVhci4yQ193ZWVrX251bWJlcl9hbmRfd2Vla2RheVxuICAgIGZ1bmN0aW9uIGRheU9mWWVhckZyb21XZWVrcyh5ZWFyLCB3ZWVrLCB3ZWVrZGF5LCBmaXJzdERheU9mV2Vla09mWWVhciwgZmlyc3REYXlPZldlZWspIHtcbiAgICAgICAgdmFyIGQgPSBjcmVhdGVVVENEYXRlKHllYXIsIDAsIDEpLmdldFVUQ0RheSgpO1xuICAgICAgICB2YXIgZGF5c1RvQWRkO1xuICAgICAgICB2YXIgZGF5T2ZZZWFyO1xuXG4gICAgICAgIGQgPSBkID09PSAwID8gNyA6IGQ7XG4gICAgICAgIHdlZWtkYXkgPSB3ZWVrZGF5ICE9IG51bGwgPyB3ZWVrZGF5IDogZmlyc3REYXlPZldlZWs7XG4gICAgICAgIGRheXNUb0FkZCA9IGZpcnN0RGF5T2ZXZWVrIC0gZCArIChkID4gZmlyc3REYXlPZldlZWtPZlllYXIgPyA3IDogMCkgLSAoZCA8IGZpcnN0RGF5T2ZXZWVrID8gNyA6IDApO1xuICAgICAgICBkYXlPZlllYXIgPSA3ICogKHdlZWsgLSAxKSArICh3ZWVrZGF5IC0gZmlyc3REYXlPZldlZWspICsgZGF5c1RvQWRkICsgMTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeWVhciAgICAgIDogZGF5T2ZZZWFyID4gMCA/IHllYXIgICAgICA6IHllYXIgLSAxLFxuICAgICAgICAgICAgZGF5T2ZZZWFyIDogZGF5T2ZZZWFyID4gMCA/IGRheU9mWWVhciA6IGRheXNJblllYXIoeWVhciAtIDEpICsgZGF5T2ZZZWFyXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0RGF5T2ZZZWFyIChpbnB1dCkge1xuICAgICAgICB2YXIgZGF5T2ZZZWFyID0gTWF0aC5yb3VuZCgodGhpcy5jbG9uZSgpLnN0YXJ0T2YoJ2RheScpIC0gdGhpcy5jbG9uZSgpLnN0YXJ0T2YoJ3llYXInKSkgLyA4NjRlNSkgKyAxO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IGRheU9mWWVhciA6IHRoaXMuYWRkKChpbnB1dCAtIGRheU9mWWVhciksICdkJyk7XG4gICAgfVxuXG4gICAgLy8gUGljayB0aGUgZmlyc3QgZGVmaW5lZCBvZiB0d28gb3IgdGhyZWUgYXJndW1lbnRzLlxuICAgIGZ1bmN0aW9uIGRlZmF1bHRzKGEsIGIsIGMpIHtcbiAgICAgICAgaWYgKGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGIgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3VycmVudERhdGVBcnJheShjb25maWcpIHtcbiAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGlmIChjb25maWcuX3VzZVVUQykge1xuICAgICAgICAgICAgcmV0dXJuIFtub3cuZ2V0VVRDRnVsbFllYXIoKSwgbm93LmdldFVUQ01vbnRoKCksIG5vdy5nZXRVVENEYXRlKCldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbbm93LmdldEZ1bGxZZWFyKCksIG5vdy5nZXRNb250aCgpLCBub3cuZ2V0RGF0ZSgpXTtcbiAgICB9XG5cbiAgICAvLyBjb252ZXJ0IGFuIGFycmF5IHRvIGEgZGF0ZS5cbiAgICAvLyB0aGUgYXJyYXkgc2hvdWxkIG1pcnJvciB0aGUgcGFyYW1ldGVycyBiZWxvd1xuICAgIC8vIG5vdGU6IGFsbCB2YWx1ZXMgcGFzdCB0aGUgeWVhciBhcmUgb3B0aW9uYWwgYW5kIHdpbGwgZGVmYXVsdCB0byB0aGUgbG93ZXN0IHBvc3NpYmxlIHZhbHVlLlxuICAgIC8vIFt5ZWFyLCBtb250aCwgZGF5ICwgaG91ciwgbWludXRlLCBzZWNvbmQsIG1pbGxpc2Vjb25kXVxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21BcnJheSAoY29uZmlnKSB7XG4gICAgICAgIHZhciBpLCBkYXRlLCBpbnB1dCA9IFtdLCBjdXJyZW50RGF0ZSwgeWVhclRvVXNlO1xuXG4gICAgICAgIGlmIChjb25maWcuX2QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnREYXRlID0gY3VycmVudERhdGVBcnJheShjb25maWcpO1xuXG4gICAgICAgIC8vY29tcHV0ZSBkYXkgb2YgdGhlIHllYXIgZnJvbSB3ZWVrcyBhbmQgd2Vla2RheXNcbiAgICAgICAgaWYgKGNvbmZpZy5fdyAmJiBjb25maWcuX2FbREFURV0gPT0gbnVsbCAmJiBjb25maWcuX2FbTU9OVEhdID09IG51bGwpIHtcbiAgICAgICAgICAgIGRheU9mWWVhckZyb21XZWVrSW5mbyhjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9pZiB0aGUgZGF5IG9mIHRoZSB5ZWFyIGlzIHNldCwgZmlndXJlIG91dCB3aGF0IGl0IGlzXG4gICAgICAgIGlmIChjb25maWcuX2RheU9mWWVhcikge1xuICAgICAgICAgICAgeWVhclRvVXNlID0gZGVmYXVsdHMoY29uZmlnLl9hW1lFQVJdLCBjdXJyZW50RGF0ZVtZRUFSXSk7XG5cbiAgICAgICAgICAgIGlmIChjb25maWcuX2RheU9mWWVhciA+IGRheXNJblllYXIoeWVhclRvVXNlKSkge1xuICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLl9vdmVyZmxvd0RheU9mWWVhciA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGUgPSBjcmVhdGVVVENEYXRlKHllYXJUb1VzZSwgMCwgY29uZmlnLl9kYXlPZlllYXIpO1xuICAgICAgICAgICAgY29uZmlnLl9hW01PTlRIXSA9IGRhdGUuZ2V0VVRDTW9udGgoKTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtEQVRFXSA9IGRhdGUuZ2V0VVRDRGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGVmYXVsdCB0byBjdXJyZW50IGRhdGUuXG4gICAgICAgIC8vICogaWYgbm8geWVhciwgbW9udGgsIGRheSBvZiBtb250aCBhcmUgZ2l2ZW4sIGRlZmF1bHQgdG8gdG9kYXlcbiAgICAgICAgLy8gKiBpZiBkYXkgb2YgbW9udGggaXMgZ2l2ZW4sIGRlZmF1bHQgbW9udGggYW5kIHllYXJcbiAgICAgICAgLy8gKiBpZiBtb250aCBpcyBnaXZlbiwgZGVmYXVsdCBvbmx5IHllYXJcbiAgICAgICAgLy8gKiBpZiB5ZWFyIGlzIGdpdmVuLCBkb24ndCBkZWZhdWx0IGFueXRoaW5nXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAzICYmIGNvbmZpZy5fYVtpXSA9PSBudWxsOyArK2kpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtpXSA9IGlucHV0W2ldID0gY3VycmVudERhdGVbaV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBaZXJvIG91dCB3aGF0ZXZlciB3YXMgbm90IGRlZmF1bHRlZCwgaW5jbHVkaW5nIHRpbWVcbiAgICAgICAgZm9yICg7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtpXSA9IGlucHV0W2ldID0gKGNvbmZpZy5fYVtpXSA9PSBudWxsKSA/IChpID09PSAyID8gMSA6IDApIDogY29uZmlnLl9hW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgZm9yIDI0OjAwOjAwLjAwMFxuICAgICAgICBpZiAoY29uZmlnLl9hW0hPVVJdID09PSAyNCAmJlxuICAgICAgICAgICAgICAgIGNvbmZpZy5fYVtNSU5VVEVdID09PSAwICYmXG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW1NFQ09ORF0gPT09IDAgJiZcbiAgICAgICAgICAgICAgICBjb25maWcuX2FbTUlMTElTRUNPTkRdID09PSAwKSB7XG4gICAgICAgICAgICBjb25maWcuX25leHREYXkgPSB0cnVlO1xuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZy5fZCA9IChjb25maWcuX3VzZVVUQyA/IGNyZWF0ZVVUQ0RhdGUgOiBjcmVhdGVEYXRlKS5hcHBseShudWxsLCBpbnB1dCk7XG4gICAgICAgIC8vIEFwcGx5IHRpbWV6b25lIG9mZnNldCBmcm9tIGlucHV0LiBUaGUgYWN0dWFsIHV0Y09mZnNldCBjYW4gYmUgY2hhbmdlZFxuICAgICAgICAvLyB3aXRoIHBhcnNlWm9uZS5cbiAgICAgICAgaWYgKGNvbmZpZy5fdHptICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZC5zZXRVVENNaW51dGVzKGNvbmZpZy5fZC5nZXRVVENNaW51dGVzKCkgLSBjb25maWcuX3R6bSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnLl9uZXh0RGF5KSB7XG4gICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gPSAyNDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheU9mWWVhckZyb21XZWVrSW5mbyhjb25maWcpIHtcbiAgICAgICAgdmFyIHcsIHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSwgdGVtcDtcblxuICAgICAgICB3ID0gY29uZmlnLl93O1xuICAgICAgICBpZiAody5HRyAhPSBudWxsIHx8IHcuVyAhPSBudWxsIHx8IHcuRSAhPSBudWxsKSB7XG4gICAgICAgICAgICBkb3cgPSAxO1xuICAgICAgICAgICAgZG95ID0gNDtcblxuICAgICAgICAgICAgLy8gVE9ETzogV2UgbmVlZCB0byB0YWtlIHRoZSBjdXJyZW50IGlzb1dlZWtZZWFyLCBidXQgdGhhdCBkZXBlbmRzIG9uXG4gICAgICAgICAgICAvLyBob3cgd2UgaW50ZXJwcmV0IG5vdyAobG9jYWwsIHV0YywgZml4ZWQgb2Zmc2V0KS4gU28gY3JlYXRlXG4gICAgICAgICAgICAvLyBhIG5vdyB2ZXJzaW9uIG9mIGN1cnJlbnQgY29uZmlnICh0YWtlIGxvY2FsL3V0Yy9vZmZzZXQgZmxhZ3MsIGFuZFxuICAgICAgICAgICAgLy8gY3JlYXRlIG5vdykuXG4gICAgICAgICAgICB3ZWVrWWVhciA9IGRlZmF1bHRzKHcuR0csIGNvbmZpZy5fYVtZRUFSXSwgd2Vla09mWWVhcihsb2NhbF9fY3JlYXRlTG9jYWwoKSwgMSwgNCkueWVhcik7XG4gICAgICAgICAgICB3ZWVrID0gZGVmYXVsdHMody5XLCAxKTtcbiAgICAgICAgICAgIHdlZWtkYXkgPSBkZWZhdWx0cyh3LkUsIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG93ID0gY29uZmlnLl9sb2NhbGUuX3dlZWsuZG93O1xuICAgICAgICAgICAgZG95ID0gY29uZmlnLl9sb2NhbGUuX3dlZWsuZG95O1xuXG4gICAgICAgICAgICB3ZWVrWWVhciA9IGRlZmF1bHRzKHcuZ2csIGNvbmZpZy5fYVtZRUFSXSwgd2Vla09mWWVhcihsb2NhbF9fY3JlYXRlTG9jYWwoKSwgZG93LCBkb3kpLnllYXIpO1xuICAgICAgICAgICAgd2VlayA9IGRlZmF1bHRzKHcudywgMSk7XG5cbiAgICAgICAgICAgIGlmICh3LmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIHdlZWtkYXkgLS0gbG93IGRheSBudW1iZXJzIGFyZSBjb25zaWRlcmVkIG5leHQgd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSB3LmQ7XG4gICAgICAgICAgICAgICAgaWYgKHdlZWtkYXkgPCBkb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgKyt3ZWVrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAody5lICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBsb2NhbCB3ZWVrZGF5IC0tIGNvdW50aW5nIHN0YXJ0cyBmcm9tIGJlZ2luaW5nIG9mIHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gdy5lICsgZG93O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBkZWZhdWx0IHRvIGJlZ2luaW5nIG9mIHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gZG93O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXAgPSBkYXlPZlllYXJGcm9tV2Vla3Mod2Vla1llYXIsIHdlZWssIHdlZWtkYXksIGRveSwgZG93KTtcblxuICAgICAgICBjb25maWcuX2FbWUVBUl0gPSB0ZW1wLnllYXI7XG4gICAgICAgIGNvbmZpZy5fZGF5T2ZZZWFyID0gdGVtcC5kYXlPZlllYXI7XG4gICAgfVxuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLklTT184NjAxID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAvLyBkYXRlIGZyb20gc3RyaW5nIGFuZCBmb3JtYXQgc3RyaW5nXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpIHtcbiAgICAgICAgLy8gVE9ETzogTW92ZSB0aGlzIHRvIGFub3RoZXIgcGFydCBvZiB0aGUgY3JlYXRpb24gZmxvdyB0byBwcmV2ZW50IGNpcmN1bGFyIGRlcHNcbiAgICAgICAgaWYgKGNvbmZpZy5fZiA9PT0gdXRpbHNfaG9va3NfX2hvb2tzLklTT184NjAxKSB7XG4gICAgICAgICAgICBjb25maWdGcm9tSVNPKGNvbmZpZyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWcuX2EgPSBbXTtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuZW1wdHkgPSB0cnVlO1xuXG4gICAgICAgIC8vIFRoaXMgYXJyYXkgaXMgdXNlZCB0byBtYWtlIGEgRGF0ZSwgZWl0aGVyIHdpdGggYG5ldyBEYXRlYCBvciBgRGF0ZS5VVENgXG4gICAgICAgIHZhciBzdHJpbmcgPSAnJyArIGNvbmZpZy5faSxcbiAgICAgICAgICAgIGksIHBhcnNlZElucHV0LCB0b2tlbnMsIHRva2VuLCBza2lwcGVkLFxuICAgICAgICAgICAgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aCxcbiAgICAgICAgICAgIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGggPSAwO1xuXG4gICAgICAgIHRva2VucyA9IGV4cGFuZEZvcm1hdChjb25maWcuX2YsIGNvbmZpZy5fbG9jYWxlKS5tYXRjaChmb3JtYXR0aW5nVG9rZW5zKSB8fCBbXTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcbiAgICAgICAgICAgIHBhcnNlZElucHV0ID0gKHN0cmluZy5tYXRjaChnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4odG9rZW4sIGNvbmZpZykpIHx8IFtdKVswXTtcbiAgICAgICAgICAgIGlmIChwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgIHNraXBwZWQgPSBzdHJpbmcuc3Vic3RyKDAsIHN0cmluZy5pbmRleE9mKHBhcnNlZElucHV0KSk7XG4gICAgICAgICAgICAgICAgaWYgKHNraXBwZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRJbnB1dC5wdXNoKHNraXBwZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc2xpY2Uoc3RyaW5nLmluZGV4T2YocGFyc2VkSW5wdXQpICsgcGFyc2VkSW5wdXQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoICs9IHBhcnNlZElucHV0Lmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGRvbid0IHBhcnNlIGlmIGl0J3Mgbm90IGEga25vd24gdG9rZW5cbiAgICAgICAgICAgIGlmIChmb3JtYXRUb2tlbkZ1bmN0aW9uc1t0b2tlbl0pIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuZW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZFRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWRkVGltZVRvQXJyYXlGcm9tVG9rZW4odG9rZW4sIHBhcnNlZElucHV0LCBjb25maWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29uZmlnLl9zdHJpY3QgJiYgIXBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIHJlbWFpbmluZyB1bnBhcnNlZCBpbnB1dCBsZW5ndGggdG8gdGhlIHN0cmluZ1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5jaGFyc0xlZnRPdmVyID0gc3RyaW5nTGVuZ3RoIC0gdG90YWxQYXJzZWRJbnB1dExlbmd0aDtcbiAgICAgICAgaWYgKHN0cmluZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRJbnB1dC5wdXNoKHN0cmluZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjbGVhciBfMTJoIGZsYWcgaWYgaG91ciBpcyA8PSAxMlxuICAgICAgICBpZiAoZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA8PSAxMiAmJlxuICAgICAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA+IDApIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaGFuZGxlIG1lcmlkaWVtXG4gICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IG1lcmlkaWVtRml4V3JhcChjb25maWcuX2xvY2FsZSwgY29uZmlnLl9hW0hPVVJdLCBjb25maWcuX21lcmlkaWVtKTtcblxuICAgICAgICBjb25maWdGcm9tQXJyYXkoY29uZmlnKTtcbiAgICAgICAgY2hlY2tPdmVyZmxvdyhjb25maWcpO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gbWVyaWRpZW1GaXhXcmFwIChsb2NhbGUsIGhvdXIsIG1lcmlkaWVtKSB7XG4gICAgICAgIHZhciBpc1BtO1xuXG4gICAgICAgIGlmIChtZXJpZGllbSA9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBub3RoaW5nIHRvIGRvXG4gICAgICAgICAgICByZXR1cm4gaG91cjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9jYWxlLm1lcmlkaWVtSG91ciAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxlLm1lcmlkaWVtSG91cihob3VyLCBtZXJpZGllbSk7XG4gICAgICAgIH0gZWxzZSBpZiAobG9jYWxlLmlzUE0gIT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gRmFsbGJhY2tcbiAgICAgICAgICAgIGlzUG0gPSBsb2NhbGUuaXNQTShtZXJpZGllbSk7XG4gICAgICAgICAgICBpZiAoaXNQbSAmJiBob3VyIDwgMTIpIHtcbiAgICAgICAgICAgICAgICBob3VyICs9IDEyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc1BtICYmIGhvdXIgPT09IDEyKSB7XG4gICAgICAgICAgICAgICAgaG91ciA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaG91cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgbm90IHN1cHBvc2VkIHRvIGhhcHBlblxuICAgICAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb25maWdGcm9tU3RyaW5nQW5kQXJyYXkoY29uZmlnKSB7XG4gICAgICAgIHZhciB0ZW1wQ29uZmlnLFxuICAgICAgICAgICAgYmVzdE1vbWVudCxcblxuICAgICAgICAgICAgc2NvcmVUb0JlYXQsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgY3VycmVudFNjb3JlO1xuXG4gICAgICAgIGlmIChjb25maWcuX2YubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkRm9ybWF0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKE5hTik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29uZmlnLl9mLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgPSAwO1xuICAgICAgICAgICAgdGVtcENvbmZpZyA9IGNvcHlDb25maWcoe30sIGNvbmZpZyk7XG4gICAgICAgICAgICBpZiAoY29uZmlnLl91c2VVVEMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRlbXBDb25maWcuX3VzZVVUQyA9IGNvbmZpZy5fdXNlVVRDO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGVtcENvbmZpZy5fZiA9IGNvbmZpZy5fZltpXTtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQodGVtcENvbmZpZyk7XG5cbiAgICAgICAgICAgIGlmICghdmFsaWRfX2lzVmFsaWQodGVtcENvbmZpZykpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYW55IGlucHV0IHRoYXQgd2FzIG5vdCBwYXJzZWQgYWRkIGEgcGVuYWx0eSBmb3IgdGhhdCBmb3JtYXRcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSArPSBnZXRQYXJzaW5nRmxhZ3ModGVtcENvbmZpZykuY2hhcnNMZWZ0T3ZlcjtcblxuICAgICAgICAgICAgLy9vciB0b2tlbnNcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSArPSBnZXRQYXJzaW5nRmxhZ3ModGVtcENvbmZpZykudW51c2VkVG9rZW5zLmxlbmd0aCAqIDEwO1xuXG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3ModGVtcENvbmZpZykuc2NvcmUgPSBjdXJyZW50U2NvcmU7XG5cbiAgICAgICAgICAgIGlmIChzY29yZVRvQmVhdCA9PSBudWxsIHx8IGN1cnJlbnRTY29yZSA8IHNjb3JlVG9CZWF0KSB7XG4gICAgICAgICAgICAgICAgc2NvcmVUb0JlYXQgPSBjdXJyZW50U2NvcmU7XG4gICAgICAgICAgICAgICAgYmVzdE1vbWVudCA9IHRlbXBDb25maWc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHRlbmQoY29uZmlnLCBiZXN0TW9tZW50IHx8IHRlbXBDb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21PYmplY3QoY29uZmlnKSB7XG4gICAgICAgIGlmIChjb25maWcuX2QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpID0gbm9ybWFsaXplT2JqZWN0VW5pdHMoY29uZmlnLl9pKTtcbiAgICAgICAgY29uZmlnLl9hID0gW2kueWVhciwgaS5tb250aCwgaS5kYXkgfHwgaS5kYXRlLCBpLmhvdXIsIGkubWludXRlLCBpLnNlY29uZCwgaS5taWxsaXNlY29uZF07XG5cbiAgICAgICAgY29uZmlnRnJvbUFycmF5KGNvbmZpZyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlRnJvbUNvbmZpZyAoY29uZmlnKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IGNvbmZpZy5faSxcbiAgICAgICAgICAgIGZvcm1hdCA9IGNvbmZpZy5fZixcbiAgICAgICAgICAgIHJlcztcblxuICAgICAgICBjb25maWcuX2xvY2FsZSA9IGNvbmZpZy5fbG9jYWxlIHx8IGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUoY29uZmlnLl9sKTtcblxuICAgICAgICBpZiAoaW5wdXQgPT09IG51bGwgfHwgKGZvcm1hdCA9PT0gdW5kZWZpbmVkICYmIGlucHV0ID09PSAnJykpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWxpZF9fY3JlYXRlSW52YWxpZCh7bnVsbElucHV0OiB0cnVlfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uZmlnLl9pID0gaW5wdXQgPSBjb25maWcuX2xvY2FsZS5wcmVwYXJzZShpbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNNb21lbnQoaW5wdXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1vbWVudChjaGVja092ZXJmbG93KGlucHV0KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShmb3JtYXQpKSB7XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kQXJyYXkoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0RhdGUoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBpbnB1dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21JbnB1dChjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzID0gbmV3IE1vbWVudChjaGVja092ZXJmbG93KGNvbmZpZykpO1xuICAgICAgICBpZiAocmVzLl9uZXh0RGF5KSB7XG4gICAgICAgICAgICAvLyBBZGRpbmcgaXMgc21hcnQgZW5vdWdoIGFyb3VuZCBEU1RcbiAgICAgICAgICAgIHJlcy5hZGQoMSwgJ2QnKTtcbiAgICAgICAgICAgIHJlcy5fbmV4dERheSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbUlucHV0KGNvbmZpZykge1xuICAgICAgICB2YXIgaW5wdXQgPSBjb25maWcuX2k7XG4gICAgICAgIGlmIChpbnB1dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzRGF0ZShpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCtpbnB1dCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZyhjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2EgPSBtYXAoaW5wdXQuc2xpY2UoMCksIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQob2JqLCAxMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZihpbnB1dCkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjb25maWdGcm9tT2JqZWN0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mKGlucHV0KSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIC8vIGZyb20gbWlsbGlzZWNvbmRzXG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShpbnB1dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2soY29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUxvY2FsT3JVVEMgKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCBpc1VUQykge1xuICAgICAgICB2YXIgYyA9IHt9O1xuXG4gICAgICAgIGlmICh0eXBlb2YobG9jYWxlKSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBzdHJpY3QgPSBsb2NhbGU7XG4gICAgICAgICAgICBsb2NhbGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gb2JqZWN0IGNvbnN0cnVjdGlvbiBtdXN0IGJlIGRvbmUgdGhpcyB3YXkuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNDIzXG4gICAgICAgIGMuX2lzQU1vbWVudE9iamVjdCA9IHRydWU7XG4gICAgICAgIGMuX3VzZVVUQyA9IGMuX2lzVVRDID0gaXNVVEM7XG4gICAgICAgIGMuX2wgPSBsb2NhbGU7XG4gICAgICAgIGMuX2kgPSBpbnB1dDtcbiAgICAgICAgYy5fZiA9IGZvcm1hdDtcbiAgICAgICAgYy5fc3RyaWN0ID0gc3RyaWN0O1xuXG4gICAgICAgIHJldHVybiBjcmVhdGVGcm9tQ29uZmlnKGMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsX19jcmVhdGVMb2NhbCAoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsT3JVVEMoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QsIGZhbHNlKTtcbiAgICB9XG5cbiAgICB2YXIgcHJvdG90eXBlTWluID0gZGVwcmVjYXRlKFxuICAgICAgICAgJ21vbWVudCgpLm1pbiBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50Lm1pbiBpbnN0ZWFkLiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTU0OCcsXG4gICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgdmFyIG90aGVyID0gbG9jYWxfX2NyZWF0ZUxvY2FsLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgcmV0dXJuIG90aGVyIDwgdGhpcyA/IHRoaXMgOiBvdGhlcjtcbiAgICAgICAgIH1cbiAgICAgKTtcblxuICAgIHZhciBwcm90b3R5cGVNYXggPSBkZXByZWNhdGUoXG4gICAgICAgICdtb21lbnQoKS5tYXggaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudC5tYXggaW5zdGVhZC4gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE1NDgnLFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb3RoZXIgPSBsb2NhbF9fY3JlYXRlTG9jYWwuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiBvdGhlciA+IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gUGljayBhIG1vbWVudCBtIGZyb20gbW9tZW50cyBzbyB0aGF0IG1bZm5dKG90aGVyKSBpcyB0cnVlIGZvciBhbGxcbiAgICAvLyBvdGhlci4gVGhpcyByZWxpZXMgb24gdGhlIGZ1bmN0aW9uIGZuIHRvIGJlIHRyYW5zaXRpdmUuXG4gICAgLy9cbiAgICAvLyBtb21lbnRzIHNob3VsZCBlaXRoZXIgYmUgYW4gYXJyYXkgb2YgbW9tZW50IG9iamVjdHMgb3IgYW4gYXJyYXksIHdob3NlXG4gICAgLy8gZmlyc3QgZWxlbWVudCBpcyBhbiBhcnJheSBvZiBtb21lbnQgb2JqZWN0cy5cbiAgICBmdW5jdGlvbiBwaWNrQnkoZm4sIG1vbWVudHMpIHtcbiAgICAgICAgdmFyIHJlcywgaTtcbiAgICAgICAgaWYgKG1vbWVudHMubGVuZ3RoID09PSAxICYmIGlzQXJyYXkobW9tZW50c1swXSkpIHtcbiAgICAgICAgICAgIG1vbWVudHMgPSBtb21lbnRzWzBdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghbW9tZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbF9fY3JlYXRlTG9jYWwoKTtcbiAgICAgICAgfVxuICAgICAgICByZXMgPSBtb21lbnRzWzBdO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbW9tZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgaWYgKG1vbWVudHNbaV1bZm5dKHJlcykpIHtcbiAgICAgICAgICAgICAgICByZXMgPSBtb21lbnRzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogVXNlIFtdLnNvcnQgaW5zdGVhZD9cbiAgICBmdW5jdGlvbiBtaW4gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0JlZm9yZScsIGFyZ3MpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1heCAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgIHJldHVybiBwaWNrQnkoJ2lzQWZ0ZXInLCBhcmdzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBEdXJhdGlvbiAoZHVyYXRpb24pIHtcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWRJbnB1dCA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKGR1cmF0aW9uKSxcbiAgICAgICAgICAgIHllYXJzID0gbm9ybWFsaXplZElucHV0LnllYXIgfHwgMCxcbiAgICAgICAgICAgIHF1YXJ0ZXJzID0gbm9ybWFsaXplZElucHV0LnF1YXJ0ZXIgfHwgMCxcbiAgICAgICAgICAgIG1vbnRocyA9IG5vcm1hbGl6ZWRJbnB1dC5tb250aCB8fCAwLFxuICAgICAgICAgICAgd2Vla3MgPSBub3JtYWxpemVkSW5wdXQud2VlayB8fCAwLFxuICAgICAgICAgICAgZGF5cyA9IG5vcm1hbGl6ZWRJbnB1dC5kYXkgfHwgMCxcbiAgICAgICAgICAgIGhvdXJzID0gbm9ybWFsaXplZElucHV0LmhvdXIgfHwgMCxcbiAgICAgICAgICAgIG1pbnV0ZXMgPSBub3JtYWxpemVkSW5wdXQubWludXRlIHx8IDAsXG4gICAgICAgICAgICBzZWNvbmRzID0gbm9ybWFsaXplZElucHV0LnNlY29uZCB8fCAwLFxuICAgICAgICAgICAgbWlsbGlzZWNvbmRzID0gbm9ybWFsaXplZElucHV0Lm1pbGxpc2Vjb25kIHx8IDA7XG5cbiAgICAgICAgLy8gcmVwcmVzZW50YXRpb24gZm9yIGRhdGVBZGRSZW1vdmVcbiAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzID0gK21pbGxpc2Vjb25kcyArXG4gICAgICAgICAgICBzZWNvbmRzICogMWUzICsgLy8gMTAwMFxuICAgICAgICAgICAgbWludXRlcyAqIDZlNCArIC8vIDEwMDAgKiA2MFxuICAgICAgICAgICAgaG91cnMgKiAzNmU1OyAvLyAxMDAwICogNjAgKiA2MFxuICAgICAgICAvLyBCZWNhdXNlIG9mIGRhdGVBZGRSZW1vdmUgdHJlYXRzIDI0IGhvdXJzIGFzIGRpZmZlcmVudCBmcm9tIGFcbiAgICAgICAgLy8gZGF5IHdoZW4gd29ya2luZyBhcm91bmQgRFNULCB3ZSBuZWVkIHRvIHN0b3JlIHRoZW0gc2VwYXJhdGVseVxuICAgICAgICB0aGlzLl9kYXlzID0gK2RheXMgK1xuICAgICAgICAgICAgd2Vla3MgKiA3O1xuICAgICAgICAvLyBJdCBpcyBpbXBvc3NpYmxlIHRyYW5zbGF0ZSBtb250aHMgaW50byBkYXlzIHdpdGhvdXQga25vd2luZ1xuICAgICAgICAvLyB3aGljaCBtb250aHMgeW91IGFyZSBhcmUgdGFsa2luZyBhYm91dCwgc28gd2UgaGF2ZSB0byBzdG9yZVxuICAgICAgICAvLyBpdCBzZXBhcmF0ZWx5LlxuICAgICAgICB0aGlzLl9tb250aHMgPSArbW9udGhzICtcbiAgICAgICAgICAgIHF1YXJ0ZXJzICogMyArXG4gICAgICAgICAgICB5ZWFycyAqIDEyO1xuXG4gICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcblxuICAgICAgICB0aGlzLl9sb2NhbGUgPSBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKCk7XG5cbiAgICAgICAgdGhpcy5fYnViYmxlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEdXJhdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBEdXJhdGlvbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvZmZzZXQgKHRva2VuLCBzZXBhcmF0b3IpIHtcbiAgICAgICAgYWRkRm9ybWF0VG9rZW4odG9rZW4sIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLnV0Y09mZnNldCgpO1xuICAgICAgICAgICAgdmFyIHNpZ24gPSAnKyc7XG4gICAgICAgICAgICBpZiAob2Zmc2V0IDwgMCkge1xuICAgICAgICAgICAgICAgIG9mZnNldCA9IC1vZmZzZXQ7XG4gICAgICAgICAgICAgICAgc2lnbiA9ICctJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzaWduICsgemVyb0ZpbGwofn4ob2Zmc2V0IC8gNjApLCAyKSArIHNlcGFyYXRvciArIHplcm9GaWxsKH5+KG9mZnNldCkgJSA2MCwgMik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9mZnNldCgnWicsICc6Jyk7XG4gICAgb2Zmc2V0KCdaWicsICcnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ1onLCAgbWF0Y2hPZmZzZXQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1paJywgbWF0Y2hPZmZzZXQpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydaJywgJ1paJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX3VzZVVUQyA9IHRydWU7XG4gICAgICAgIGNvbmZpZy5fdHptID0gb2Zmc2V0RnJvbVN0cmluZyhpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICAvLyB0aW1lem9uZSBjaHVua2VyXG4gICAgLy8gJysxMDowMCcgPiBbJzEwJywgICcwMCddXG4gICAgLy8gJy0xNTMwJyAgPiBbJy0xNScsICczMCddXG4gICAgdmFyIGNodW5rT2Zmc2V0ID0gLyhbXFwrXFwtXXxcXGRcXGQpL2dpO1xuXG4gICAgZnVuY3Rpb24gb2Zmc2V0RnJvbVN0cmluZyhzdHJpbmcpIHtcbiAgICAgICAgdmFyIG1hdGNoZXMgPSAoKHN0cmluZyB8fCAnJykubWF0Y2gobWF0Y2hPZmZzZXQpIHx8IFtdKTtcbiAgICAgICAgdmFyIGNodW5rICAgPSBtYXRjaGVzW21hdGNoZXMubGVuZ3RoIC0gMV0gfHwgW107XG4gICAgICAgIHZhciBwYXJ0cyAgID0gKGNodW5rICsgJycpLm1hdGNoKGNodW5rT2Zmc2V0KSB8fCBbJy0nLCAwLCAwXTtcbiAgICAgICAgdmFyIG1pbnV0ZXMgPSArKHBhcnRzWzFdICogNjApICsgdG9JbnQocGFydHNbMl0pO1xuXG4gICAgICAgIHJldHVybiBwYXJ0c1swXSA9PT0gJysnID8gbWludXRlcyA6IC1taW51dGVzO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBhIG1vbWVudCBmcm9tIGlucHV0LCB0aGF0IGlzIGxvY2FsL3V0Yy96b25lIGVxdWl2YWxlbnQgdG8gbW9kZWwuXG4gICAgZnVuY3Rpb24gY2xvbmVXaXRoT2Zmc2V0KGlucHV0LCBtb2RlbCkge1xuICAgICAgICB2YXIgcmVzLCBkaWZmO1xuICAgICAgICBpZiAobW9kZWwuX2lzVVRDKSB7XG4gICAgICAgICAgICByZXMgPSBtb2RlbC5jbG9uZSgpO1xuICAgICAgICAgICAgZGlmZiA9IChpc01vbWVudChpbnB1dCkgfHwgaXNEYXRlKGlucHV0KSA/ICtpbnB1dCA6ICtsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpKSAtICgrcmVzKTtcbiAgICAgICAgICAgIC8vIFVzZSBsb3ctbGV2ZWwgYXBpLCBiZWNhdXNlIHRoaXMgZm4gaXMgbG93LWxldmVsIGFwaS5cbiAgICAgICAgICAgIHJlcy5fZC5zZXRUaW1lKCtyZXMuX2QgKyBkaWZmKTtcbiAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy51cGRhdGVPZmZzZXQocmVzLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsX19jcmVhdGVMb2NhbChpbnB1dCkubG9jYWwoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbW9kZWwuX2lzVVRDID8gbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KS56b25lKG1vZGVsLl9vZmZzZXQgfHwgMCkgOiBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpLmxvY2FsKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RGF0ZU9mZnNldCAobSkge1xuICAgICAgICAvLyBPbiBGaXJlZm94LjI0IERhdGUjZ2V0VGltZXpvbmVPZmZzZXQgcmV0dXJucyBhIGZsb2F0aW5nIHBvaW50LlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9wdWxsLzE4NzFcbiAgICAgICAgcmV0dXJuIC1NYXRoLnJvdW5kKG0uX2QuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDE1KSAqIDE1O1xuICAgIH1cblxuICAgIC8vIEhPT0tTXG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyIGEgbW9tZW50IGlzIG11dGF0ZWQuXG4gICAgLy8gSXQgaXMgaW50ZW5kZWQgdG8ga2VlcCB0aGUgb2Zmc2V0IGluIHN5bmMgd2l0aCB0aGUgdGltZXpvbmUuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgLy8ga2VlcExvY2FsVGltZSA9IHRydWUgbWVhbnMgb25seSBjaGFuZ2UgdGhlIHRpbWV6b25lLCB3aXRob3V0XG4gICAgLy8gYWZmZWN0aW5nIHRoZSBsb2NhbCBob3VyLiBTbyA1OjMxOjI2ICswMzAwIC0tW3V0Y09mZnNldCgyLCB0cnVlKV0tLT5cbiAgICAvLyA1OjMxOjI2ICswMjAwIEl0IGlzIHBvc3NpYmxlIHRoYXQgNTozMToyNiBkb2Vzbid0IGV4aXN0IHdpdGggb2Zmc2V0XG4gICAgLy8gKzAyMDAsIHNvIHdlIGFkanVzdCB0aGUgdGltZSBhcyBuZWVkZWQsIHRvIGJlIHZhbGlkLlxuICAgIC8vXG4gICAgLy8gS2VlcGluZyB0aGUgdGltZSBhY3R1YWxseSBhZGRzL3N1YnRyYWN0cyAob25lIGhvdXIpXG4gICAgLy8gZnJvbSB0aGUgYWN0dWFsIHJlcHJlc2VudGVkIHRpbWUuIFRoYXQgaXMgd2h5IHdlIGNhbGwgdXBkYXRlT2Zmc2V0XG4gICAgLy8gYSBzZWNvbmQgdGltZS4gSW4gY2FzZSBpdCB3YW50cyB1cyB0byBjaGFuZ2UgdGhlIG9mZnNldCBhZ2FpblxuICAgIC8vIF9jaGFuZ2VJblByb2dyZXNzID09IHRydWUgY2FzZSwgdGhlbiB3ZSBoYXZlIHRvIGFkanVzdCwgYmVjYXVzZVxuICAgIC8vIHRoZXJlIGlzIG5vIHN1Y2ggdGltZSBpbiB0aGUgZ2l2ZW4gdGltZXpvbmUuXG4gICAgZnVuY3Rpb24gZ2V0U2V0T2Zmc2V0IChpbnB1dCwga2VlcExvY2FsVGltZSkge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy5fb2Zmc2V0IHx8IDAsXG4gICAgICAgICAgICBsb2NhbEFkanVzdDtcbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBvZmZzZXRGcm9tU3RyaW5nKGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhpbnB1dCkgPCAxNikge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQgKiA2MDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5faXNVVEMgJiYga2VlcExvY2FsVGltZSkge1xuICAgICAgICAgICAgICAgIGxvY2FsQWRqdXN0ID0gZ2V0RGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX29mZnNldCA9IGlucHV0O1xuICAgICAgICAgICAgdGhpcy5faXNVVEMgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGxvY2FsQWRqdXN0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZChsb2NhbEFkanVzdCwgJ20nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvZmZzZXQgIT09IGlucHV0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFrZWVwTG9jYWxUaW1lIHx8IHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkX3N1YnRyYWN0X19hZGRTdWJ0cmFjdCh0aGlzLCBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uKGlucHV0IC0gb2Zmc2V0LCAnbScpLCAxLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldCh0aGlzLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcyA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyBvZmZzZXQgOiBnZXREYXRlT2Zmc2V0KHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0Wm9uZSAoaW5wdXQsIGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSAtaW5wdXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KGlucHV0LCBrZWVwTG9jYWxUaW1lKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gLXRoaXMudXRjT2Zmc2V0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRPZmZzZXRUb1VUQyAoa2VlcExvY2FsVGltZSkge1xuICAgICAgICByZXR1cm4gdGhpcy51dGNPZmZzZXQoMCwga2VlcExvY2FsVGltZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2Zmc2V0VG9Mb2NhbCAoa2VlcExvY2FsVGltZSkge1xuICAgICAgICBpZiAodGhpcy5faXNVVEMpIHtcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KDAsIGtlZXBMb2NhbFRpbWUpO1xuICAgICAgICAgICAgdGhpcy5faXNVVEMgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnRyYWN0KGdldERhdGVPZmZzZXQodGhpcyksICdtJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2Zmc2V0VG9QYXJzZWRPZmZzZXQgKCkge1xuICAgICAgICBpZiAodGhpcy5fdHptKSB7XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldCh0aGlzLl90em0pO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLl9pID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQob2Zmc2V0RnJvbVN0cmluZyh0aGlzLl9pKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFzQWxpZ25lZEhvdXJPZmZzZXQgKGlucHV0KSB7XG4gICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICAgIGlucHV0ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0ID0gbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KS51dGNPZmZzZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAodGhpcy51dGNPZmZzZXQoKSAtIGlucHV0KSAlIDYwID09PSAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF5bGlnaHRTYXZpbmdUaW1lICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KCkgPiB0aGlzLmNsb25lKCkubW9udGgoMCkudXRjT2Zmc2V0KCkgfHxcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KCkgPiB0aGlzLmNsb25lKCkubW9udGgoNSkudXRjT2Zmc2V0KClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RheWxpZ2h0U2F2aW5nVGltZVNoaWZ0ZWQgKCkge1xuICAgICAgICBpZiAodGhpcy5fYSkge1xuICAgICAgICAgICAgdmFyIG90aGVyID0gdGhpcy5faXNVVEMgPyBjcmVhdGVfdXRjX19jcmVhdGVVVEModGhpcy5fYSkgOiBsb2NhbF9fY3JlYXRlTG9jYWwodGhpcy5fYSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgJiYgY29tcGFyZUFycmF5cyh0aGlzLl9hLCBvdGhlci50b0FycmF5KCkpID4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0xvY2FsICgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLl9pc1VUQztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1V0Y09mZnNldCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1VUQztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1V0YyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyAmJiB0aGlzLl9vZmZzZXQgPT09IDA7XG4gICAgfVxuXG4gICAgdmFyIGFzcE5ldFJlZ2V4ID0gLyhcXC0pPyg/OihcXGQqKVxcLik/KFxcZCspXFw6KFxcZCspKD86XFw6KFxcZCspXFwuPyhcXGR7M30pPyk/LztcblxuICAgIC8vIGZyb20gaHR0cDovL2RvY3MuY2xvc3VyZS1saWJyYXJ5Lmdvb2dsZWNvZGUuY29tL2dpdC9jbG9zdXJlX2dvb2dfZGF0ZV9kYXRlLmpzLnNvdXJjZS5odG1sXG4gICAgLy8gc29tZXdoYXQgbW9yZSBpbiBsaW5lIHdpdGggNC40LjMuMiAyMDA0IHNwZWMsIGJ1dCBhbGxvd3MgZGVjaW1hbCBhbnl3aGVyZVxuICAgIHZhciBjcmVhdGVfX2lzb1JlZ2V4ID0gL14oLSk/UCg/Oig/OihbMC05LC5dKilZKT8oPzooWzAtOSwuXSopTSk/KD86KFswLTksLl0qKUQpPyg/OlQoPzooWzAtOSwuXSopSCk/KD86KFswLTksLl0qKU0pPyg/OihbMC05LC5dKilTKT8pP3woWzAtOSwuXSopVykkLztcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24gKGlucHV0LCBrZXkpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gaW5wdXQsXG4gICAgICAgICAgICAvLyBtYXRjaGluZyBhZ2FpbnN0IHJlZ2V4cCBpcyBleHBlbnNpdmUsIGRvIGl0IG9uIGRlbWFuZFxuICAgICAgICAgICAgbWF0Y2ggPSBudWxsLFxuICAgICAgICAgICAgc2lnbixcbiAgICAgICAgICAgIHJldCxcbiAgICAgICAgICAgIGRpZmZSZXM7XG5cbiAgICAgICAgaWYgKGlzRHVyYXRpb24oaW5wdXQpKSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICBtcyA6IGlucHV0Ll9taWxsaXNlY29uZHMsXG4gICAgICAgICAgICAgICAgZCAgOiBpbnB1dC5fZGF5cyxcbiAgICAgICAgICAgICAgICBNICA6IGlucHV0Ll9tb250aHNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbltrZXldID0gaW5wdXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uLm1pbGxpc2Vjb25kcyA9IGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCEhKG1hdGNoID0gYXNwTmV0UmVnZXguZXhlYyhpbnB1dCkpKSB7XG4gICAgICAgICAgICBzaWduID0gKG1hdGNoWzFdID09PSAnLScpID8gLTEgOiAxO1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgeSAgOiAwLFxuICAgICAgICAgICAgICAgIGQgIDogdG9JbnQobWF0Y2hbREFURV0pICAgICAgICAqIHNpZ24sXG4gICAgICAgICAgICAgICAgaCAgOiB0b0ludChtYXRjaFtIT1VSXSkgICAgICAgICogc2lnbixcbiAgICAgICAgICAgICAgICBtICA6IHRvSW50KG1hdGNoW01JTlVURV0pICAgICAgKiBzaWduLFxuICAgICAgICAgICAgICAgIHMgIDogdG9JbnQobWF0Y2hbU0VDT05EXSkgICAgICAqIHNpZ24sXG4gICAgICAgICAgICAgICAgbXMgOiB0b0ludChtYXRjaFtNSUxMSVNFQ09ORF0pICogc2lnblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICghIShtYXRjaCA9IGNyZWF0ZV9faXNvUmVnZXguZXhlYyhpbnB1dCkpKSB7XG4gICAgICAgICAgICBzaWduID0gKG1hdGNoWzFdID09PSAnLScpID8gLTEgOiAxO1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgeSA6IHBhcnNlSXNvKG1hdGNoWzJdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBNIDogcGFyc2VJc28obWF0Y2hbM10sIHNpZ24pLFxuICAgICAgICAgICAgICAgIGQgOiBwYXJzZUlzbyhtYXRjaFs0XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgaCA6IHBhcnNlSXNvKG1hdGNoWzVdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBtIDogcGFyc2VJc28obWF0Y2hbNl0sIHNpZ24pLFxuICAgICAgICAgICAgICAgIHMgOiBwYXJzZUlzbyhtYXRjaFs3XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgdyA6IHBhcnNlSXNvKG1hdGNoWzhdLCBzaWduKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmIChkdXJhdGlvbiA9PSBudWxsKSB7Ly8gY2hlY2tzIGZvciBudWxsIG9yIHVuZGVmaW5lZFxuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZHVyYXRpb24gPT09ICdvYmplY3QnICYmICgnZnJvbScgaW4gZHVyYXRpb24gfHwgJ3RvJyBpbiBkdXJhdGlvbikpIHtcbiAgICAgICAgICAgIGRpZmZSZXMgPSBtb21lbnRzRGlmZmVyZW5jZShsb2NhbF9fY3JlYXRlTG9jYWwoZHVyYXRpb24uZnJvbSksIGxvY2FsX19jcmVhdGVMb2NhbChkdXJhdGlvbi50bykpO1xuXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICAgICAgZHVyYXRpb24ubXMgPSBkaWZmUmVzLm1pbGxpc2Vjb25kcztcbiAgICAgICAgICAgIGR1cmF0aW9uLk0gPSBkaWZmUmVzLm1vbnRocztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldCA9IG5ldyBEdXJhdGlvbihkdXJhdGlvbik7XG5cbiAgICAgICAgaWYgKGlzRHVyYXRpb24oaW5wdXQpICYmIGhhc093blByb3AoaW5wdXQsICdfbG9jYWxlJykpIHtcbiAgICAgICAgICAgIHJldC5fbG9jYWxlID0gaW5wdXQuX2xvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgY3JlYXRlX19jcmVhdGVEdXJhdGlvbi5mbiA9IER1cmF0aW9uLnByb3RvdHlwZTtcblxuICAgIGZ1bmN0aW9uIHBhcnNlSXNvIChpbnAsIHNpZ24pIHtcbiAgICAgICAgLy8gV2UnZCBub3JtYWxseSB1c2Ugfn5pbnAgZm9yIHRoaXMsIGJ1dCB1bmZvcnR1bmF0ZWx5IGl0IGFsc29cbiAgICAgICAgLy8gY29udmVydHMgZmxvYXRzIHRvIGludHMuXG4gICAgICAgIC8vIGlucCBtYXkgYmUgdW5kZWZpbmVkLCBzbyBjYXJlZnVsIGNhbGxpbmcgcmVwbGFjZSBvbiBpdC5cbiAgICAgICAgdmFyIHJlcyA9IGlucCAmJiBwYXJzZUZsb2F0KGlucC5yZXBsYWNlKCcsJywgJy4nKSk7XG4gICAgICAgIC8vIGFwcGx5IHNpZ24gd2hpbGUgd2UncmUgYXQgaXRcbiAgICAgICAgcmV0dXJuIChpc05hTihyZXMpID8gMCA6IHJlcykgKiBzaWduO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpIHtcbiAgICAgICAgdmFyIHJlcyA9IHttaWxsaXNlY29uZHM6IDAsIG1vbnRoczogMH07XG5cbiAgICAgICAgcmVzLm1vbnRocyA9IG90aGVyLm1vbnRoKCkgLSBiYXNlLm1vbnRoKCkgK1xuICAgICAgICAgICAgKG90aGVyLnllYXIoKSAtIGJhc2UueWVhcigpKSAqIDEyO1xuICAgICAgICBpZiAoYmFzZS5jbG9uZSgpLmFkZChyZXMubW9udGhzLCAnTScpLmlzQWZ0ZXIob3RoZXIpKSB7XG4gICAgICAgICAgICAtLXJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXMubWlsbGlzZWNvbmRzID0gK290aGVyIC0gKyhiYXNlLmNsb25lKCkuYWRkKHJlcy5tb250aHMsICdNJykpO1xuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpIHtcbiAgICAgICAgdmFyIHJlcztcbiAgICAgICAgb3RoZXIgPSBjbG9uZVdpdGhPZmZzZXQob3RoZXIsIGJhc2UpO1xuICAgICAgICBpZiAoYmFzZS5pc0JlZm9yZShvdGhlcikpIHtcbiAgICAgICAgICAgIHJlcyA9IHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzID0gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShvdGhlciwgYmFzZSk7XG4gICAgICAgICAgICByZXMubWlsbGlzZWNvbmRzID0gLXJlcy5taWxsaXNlY29uZHM7XG4gICAgICAgICAgICByZXMubW9udGhzID0gLXJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUFkZGVyKGRpcmVjdGlvbiwgbmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbCwgcGVyaW9kKSB7XG4gICAgICAgICAgICB2YXIgZHVyLCB0bXA7XG4gICAgICAgICAgICAvL2ludmVydCB0aGUgYXJndW1lbnRzLCBidXQgY29tcGxhaW4gYWJvdXQgaXRcbiAgICAgICAgICAgIGlmIChwZXJpb2QgIT09IG51bGwgJiYgIWlzTmFOKCtwZXJpb2QpKSB7XG4gICAgICAgICAgICAgICAgZGVwcmVjYXRlU2ltcGxlKG5hbWUsICdtb21lbnQoKS4nICsgbmFtZSAgKyAnKHBlcmlvZCwgbnVtYmVyKSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIG1vbWVudCgpLicgKyBuYW1lICsgJyhudW1iZXIsIHBlcmlvZCkuJyk7XG4gICAgICAgICAgICAgICAgdG1wID0gdmFsOyB2YWwgPSBwZXJpb2Q7IHBlcmlvZCA9IHRtcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFsID0gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyArdmFsIDogdmFsO1xuICAgICAgICAgICAgZHVyID0gY3JlYXRlX19jcmVhdGVEdXJhdGlvbih2YWwsIHBlcmlvZCk7XG4gICAgICAgICAgICBhZGRfc3VidHJhY3RfX2FkZFN1YnRyYWN0KHRoaXMsIGR1ciwgZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZF9zdWJ0cmFjdF9fYWRkU3VidHJhY3QgKG1vbSwgZHVyYXRpb24sIGlzQWRkaW5nLCB1cGRhdGVPZmZzZXQpIHtcbiAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IGR1cmF0aW9uLl9taWxsaXNlY29uZHMsXG4gICAgICAgICAgICBkYXlzID0gZHVyYXRpb24uX2RheXMsXG4gICAgICAgICAgICBtb250aHMgPSBkdXJhdGlvbi5fbW9udGhzO1xuICAgICAgICB1cGRhdGVPZmZzZXQgPSB1cGRhdGVPZmZzZXQgPT0gbnVsbCA/IHRydWUgOiB1cGRhdGVPZmZzZXQ7XG5cbiAgICAgICAgaWYgKG1pbGxpc2Vjb25kcykge1xuICAgICAgICAgICAgbW9tLl9kLnNldFRpbWUoK21vbS5fZCArIG1pbGxpc2Vjb25kcyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF5cykge1xuICAgICAgICAgICAgZ2V0X3NldF9fc2V0KG1vbSwgJ0RhdGUnLCBnZXRfc2V0X19nZXQobW9tLCAnRGF0ZScpICsgZGF5cyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobW9udGhzKSB7XG4gICAgICAgICAgICBzZXRNb250aChtb20sIGdldF9zZXRfX2dldChtb20sICdNb250aCcpICsgbW9udGhzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1cGRhdGVPZmZzZXQpIHtcbiAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy51cGRhdGVPZmZzZXQobW9tLCBkYXlzIHx8IG1vbnRocyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgYWRkX3N1YnRyYWN0X19hZGQgICAgICA9IGNyZWF0ZUFkZGVyKDEsICdhZGQnKTtcbiAgICB2YXIgYWRkX3N1YnRyYWN0X19zdWJ0cmFjdCA9IGNyZWF0ZUFkZGVyKC0xLCAnc3VidHJhY3QnKTtcblxuICAgIGZ1bmN0aW9uIG1vbWVudF9jYWxlbmRhcl9fY2FsZW5kYXIgKHRpbWUpIHtcbiAgICAgICAgLy8gV2Ugd2FudCB0byBjb21wYXJlIHRoZSBzdGFydCBvZiB0b2RheSwgdnMgdGhpcy5cbiAgICAgICAgLy8gR2V0dGluZyBzdGFydC1vZi10b2RheSBkZXBlbmRzIG9uIHdoZXRoZXIgd2UncmUgbG9jYWwvdXRjL29mZnNldCBvciBub3QuXG4gICAgICAgIHZhciBub3cgPSB0aW1lIHx8IGxvY2FsX19jcmVhdGVMb2NhbCgpLFxuICAgICAgICAgICAgc29kID0gY2xvbmVXaXRoT2Zmc2V0KG5vdywgdGhpcykuc3RhcnRPZignZGF5JyksXG4gICAgICAgICAgICBkaWZmID0gdGhpcy5kaWZmKHNvZCwgJ2RheXMnLCB0cnVlKSxcbiAgICAgICAgICAgIGZvcm1hdCA9IGRpZmYgPCAtNiA/ICdzYW1lRWxzZScgOlxuICAgICAgICAgICAgICAgIGRpZmYgPCAtMSA/ICdsYXN0V2VlaycgOlxuICAgICAgICAgICAgICAgIGRpZmYgPCAwID8gJ2xhc3REYXknIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgMSA/ICdzYW1lRGF5JyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IDIgPyAnbmV4dERheScgOlxuICAgICAgICAgICAgICAgIGRpZmYgPCA3ID8gJ25leHRXZWVrJyA6ICdzYW1lRWxzZSc7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1hdCh0aGlzLmxvY2FsZURhdGEoKS5jYWxlbmRhcihmb3JtYXQsIHRoaXMsIGxvY2FsX19jcmVhdGVMb2NhbChub3cpKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvbmUgKCkge1xuICAgICAgICByZXR1cm4gbmV3IE1vbWVudCh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0FmdGVyIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgdmFyIGlucHV0TXM7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModHlwZW9mIHVuaXRzICE9PSAndW5kZWZpbmVkJyA/IHVuaXRzIDogJ21pbGxpc2Vjb25kJyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgaW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGxvY2FsX19jcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gK3RoaXMgPiAraW5wdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnB1dE1zID0gaXNNb21lbnQoaW5wdXQpID8gK2lucHV0IDogK2xvY2FsX19jcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXRNcyA8ICt0aGlzLmNsb25lKCkuc3RhcnRPZih1bml0cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0JlZm9yZSAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgIHZhciBpbnB1dE1zO1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHR5cGVvZiB1bml0cyAhPT0gJ3VuZGVmaW5lZCcgPyB1bml0cyA6ICdtaWxsaXNlY29uZCcpO1xuICAgICAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgIGlucHV0ID0gaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzIDwgK2lucHV0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5wdXRNcyA9IGlzTW9tZW50KGlucHV0KSA/ICtpbnB1dCA6ICtsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzLmNsb25lKCkuZW5kT2YodW5pdHMpIDwgaW5wdXRNcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQmV0d2VlbiAoZnJvbSwgdG8sIHVuaXRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzQWZ0ZXIoZnJvbSwgdW5pdHMpICYmIHRoaXMuaXNCZWZvcmUodG8sIHVuaXRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1NhbWUgKGlucHV0LCB1bml0cykge1xuICAgICAgICB2YXIgaW5wdXRNcztcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyB8fCAnbWlsbGlzZWNvbmQnKTtcbiAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICBpbnB1dCA9IGlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiArdGhpcyA9PT0gK2lucHV0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5wdXRNcyA9ICtsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuICsodGhpcy5jbG9uZSgpLnN0YXJ0T2YodW5pdHMpKSA8PSBpbnB1dE1zICYmIGlucHV0TXMgPD0gKyh0aGlzLmNsb25lKCkuZW5kT2YodW5pdHMpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFic0Zsb29yIChudW1iZXIpIHtcbiAgICAgICAgaWYgKG51bWJlciA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwobnVtYmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKG51bWJlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaWZmIChpbnB1dCwgdW5pdHMsIGFzRmxvYXQpIHtcbiAgICAgICAgdmFyIHRoYXQgPSBjbG9uZVdpdGhPZmZzZXQoaW5wdXQsIHRoaXMpLFxuICAgICAgICAgICAgem9uZURlbHRhID0gKHRoYXQudXRjT2Zmc2V0KCkgLSB0aGlzLnV0Y09mZnNldCgpKSAqIDZlNCxcbiAgICAgICAgICAgIGRlbHRhLCBvdXRwdXQ7XG5cbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG5cbiAgICAgICAgaWYgKHVuaXRzID09PSAneWVhcicgfHwgdW5pdHMgPT09ICdtb250aCcgfHwgdW5pdHMgPT09ICdxdWFydGVyJykge1xuICAgICAgICAgICAgb3V0cHV0ID0gbW9udGhEaWZmKHRoaXMsIHRoYXQpO1xuICAgICAgICAgICAgaWYgKHVuaXRzID09PSAncXVhcnRlcicpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgLyAzO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh1bml0cyA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0IC8gMTI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWx0YSA9IHRoaXMgLSB0aGF0O1xuICAgICAgICAgICAgb3V0cHV0ID0gdW5pdHMgPT09ICdzZWNvbmQnID8gZGVsdGEgLyAxZTMgOiAvLyAxMDAwXG4gICAgICAgICAgICAgICAgdW5pdHMgPT09ICdtaW51dGUnID8gZGVsdGEgLyA2ZTQgOiAvLyAxMDAwICogNjBcbiAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ2hvdXInID8gZGVsdGEgLyAzNmU1IDogLy8gMTAwMCAqIDYwICogNjBcbiAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ2RheScgPyAoZGVsdGEgLSB6b25lRGVsdGEpIC8gODY0ZTUgOiAvLyAxMDAwICogNjAgKiA2MCAqIDI0LCBuZWdhdGUgZHN0XG4gICAgICAgICAgICAgICAgdW5pdHMgPT09ICd3ZWVrJyA/IChkZWx0YSAtIHpvbmVEZWx0YSkgLyA2MDQ4ZTUgOiAvLyAxMDAwICogNjAgKiA2MCAqIDI0ICogNywgbmVnYXRlIGRzdFxuICAgICAgICAgICAgICAgIGRlbHRhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhc0Zsb2F0ID8gb3V0cHV0IDogYWJzRmxvb3Iob3V0cHV0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb250aERpZmYgKGEsIGIpIHtcbiAgICAgICAgLy8gZGlmZmVyZW5jZSBpbiBtb250aHNcbiAgICAgICAgdmFyIHdob2xlTW9udGhEaWZmID0gKChiLnllYXIoKSAtIGEueWVhcigpKSAqIDEyKSArIChiLm1vbnRoKCkgLSBhLm1vbnRoKCkpLFxuICAgICAgICAgICAgLy8gYiBpcyBpbiAoYW5jaG9yIC0gMSBtb250aCwgYW5jaG9yICsgMSBtb250aClcbiAgICAgICAgICAgIGFuY2hvciA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYsICdtb250aHMnKSxcbiAgICAgICAgICAgIGFuY2hvcjIsIGFkanVzdDtcblxuICAgICAgICBpZiAoYiAtIGFuY2hvciA8IDApIHtcbiAgICAgICAgICAgIGFuY2hvcjIgPSBhLmNsb25lKCkuYWRkKHdob2xlTW9udGhEaWZmIC0gMSwgJ21vbnRocycpO1xuICAgICAgICAgICAgLy8gbGluZWFyIGFjcm9zcyB0aGUgbW9udGhcbiAgICAgICAgICAgIGFkanVzdCA9IChiIC0gYW5jaG9yKSAvIChhbmNob3IgLSBhbmNob3IyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFuY2hvcjIgPSBhLmNsb25lKCkuYWRkKHdob2xlTW9udGhEaWZmICsgMSwgJ21vbnRocycpO1xuICAgICAgICAgICAgLy8gbGluZWFyIGFjcm9zcyB0aGUgbW9udGhcbiAgICAgICAgICAgIGFkanVzdCA9IChiIC0gYW5jaG9yKSAvIChhbmNob3IyIC0gYW5jaG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAtKHdob2xlTW9udGhEaWZmICsgYWRqdXN0KTtcbiAgICB9XG5cbiAgICB1dGlsc19ob29rc19faG9va3MuZGVmYXVsdEZvcm1hdCA9ICdZWVlZLU1NLUREVEhIOm1tOnNzWic7XG5cbiAgICBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubG9jYWxlKCdlbicpLmZvcm1hdCgnZGRkIE1NTSBERCBZWVlZIEhIOm1tOnNzIFtHTVRdWlonKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb21lbnRfZm9ybWF0X190b0lTT1N0cmluZyAoKSB7XG4gICAgICAgIHZhciBtID0gdGhpcy5jbG9uZSgpLnV0YygpO1xuICAgICAgICBpZiAoMCA8IG0ueWVhcigpICYmIG0ueWVhcigpIDw9IDk5OTkpIHtcbiAgICAgICAgICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAvLyBuYXRpdmUgaW1wbGVtZW50YXRpb24gaXMgfjUweCBmYXN0ZXIsIHVzZSBpdCB3aGVuIHdlIGNhblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRvRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRNb21lbnQobSwgJ1lZWVktTU0tRERbVF1ISDptbTpzcy5TU1NbWl0nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXRNb21lbnQobSwgJ1lZWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1taXScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0IChpbnB1dFN0cmluZykge1xuICAgICAgICB2YXIgb3V0cHV0ID0gZm9ybWF0TW9tZW50KHRoaXMsIGlucHV0U3RyaW5nIHx8IHV0aWxzX2hvb2tzX19ob29rcy5kZWZhdWx0Rm9ybWF0KTtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLnBvc3Rmb3JtYXQob3V0cHV0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmcm9tICh0aW1lLCB3aXRob3V0U3VmZml4KSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uKHt0bzogdGhpcywgZnJvbTogdGltZX0pLmxvY2FsZSh0aGlzLmxvY2FsZSgpKS5odW1hbml6ZSghd2l0aG91dFN1ZmZpeCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZnJvbU5vdyAod2l0aG91dFN1ZmZpeCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mcm9tKGxvY2FsX19jcmVhdGVMb2NhbCgpLCB3aXRob3V0U3VmZml4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0byAodGltZSwgd2l0aG91dFN1ZmZpeCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3JlYXRlX19jcmVhdGVEdXJhdGlvbih7ZnJvbTogdGhpcywgdG86IHRpbWV9KS5sb2NhbGUodGhpcy5sb2NhbGUoKSkuaHVtYW5pemUoIXdpdGhvdXRTdWZmaXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvTm93ICh3aXRob3V0U3VmZml4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvKGxvY2FsX19jcmVhdGVMb2NhbCgpLCB3aXRob3V0U3VmZml4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGUgKGtleSkge1xuICAgICAgICB2YXIgbmV3TG9jYWxlRGF0YTtcblxuICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGUuX2FiYnI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdMb2NhbGVEYXRhID0gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZShrZXkpO1xuICAgICAgICAgICAgaWYgKG5ld0xvY2FsZURhdGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvY2FsZSA9IG5ld0xvY2FsZURhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsYW5nID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50KCkubGFuZygpIGlzIGRlcHJlY2F0ZWQuIEluc3RlYWQsIHVzZSBtb21lbnQoKS5sb2NhbGVEYXRhKCkgdG8gZ2V0IHRoZSBsYW5ndWFnZSBjb25maWd1cmF0aW9uLiBVc2UgbW9tZW50KCkubG9jYWxlKCkgdG8gY2hhbmdlIGxhbmd1YWdlcy4nLFxuICAgICAgICBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZShrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgKTtcblxuICAgIGZ1bmN0aW9uIGxvY2FsZURhdGEgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0YXJ0T2YgKHVuaXRzKSB7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAvLyB0aGUgZm9sbG93aW5nIHN3aXRjaCBpbnRlbnRpb25hbGx5IG9taXRzIGJyZWFrIGtleXdvcmRzXG4gICAgICAgIC8vIHRvIHV0aWxpemUgZmFsbGluZyB0aHJvdWdoIHRoZSBjYXNlcy5cbiAgICAgICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICBjYXNlICd5ZWFyJzpcbiAgICAgICAgICAgIHRoaXMubW9udGgoMCk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ3F1YXJ0ZXInOlxuICAgICAgICBjYXNlICdtb250aCc6XG4gICAgICAgICAgICB0aGlzLmRhdGUoMSk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ3dlZWsnOlxuICAgICAgICBjYXNlICdpc29XZWVrJzpcbiAgICAgICAgY2FzZSAnZGF5JzpcbiAgICAgICAgICAgIHRoaXMuaG91cnMoMCk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ2hvdXInOlxuICAgICAgICAgICAgdGhpcy5taW51dGVzKDApO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdtaW51dGUnOlxuICAgICAgICAgICAgdGhpcy5zZWNvbmRzKDApO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdzZWNvbmQnOlxuICAgICAgICAgICAgdGhpcy5taWxsaXNlY29uZHMoMCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3ZWVrcyBhcmUgYSBzcGVjaWFsIGNhc2VcbiAgICAgICAgaWYgKHVuaXRzID09PSAnd2VlaycpIHtcbiAgICAgICAgICAgIHRoaXMud2Vla2RheSgwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodW5pdHMgPT09ICdpc29XZWVrJykge1xuICAgICAgICAgICAgdGhpcy5pc29XZWVrZGF5KDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcXVhcnRlcnMgYXJlIGFsc28gc3BlY2lhbFxuICAgICAgICBpZiAodW5pdHMgPT09ICdxdWFydGVyJykge1xuICAgICAgICAgICAgdGhpcy5tb250aChNYXRoLmZsb29yKHRoaXMubW9udGgoKSAvIDMpICogMyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbmRPZiAodW5pdHMpIHtcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gdW5kZWZpbmVkIHx8IHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zdGFydE9mKHVuaXRzKS5hZGQoMSwgKHVuaXRzID09PSAnaXNvV2VlaycgPyAnd2VlaycgOiB1bml0cykpLnN1YnRyYWN0KDEsICdtcycpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvX3R5cGVfX3ZhbHVlT2YgKCkge1xuICAgICAgICByZXR1cm4gK3RoaXMuX2QgLSAoKHRoaXMuX29mZnNldCB8fCAwKSAqIDYwMDAwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1bml4ICgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoK3RoaXMgLyAxMDAwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0RhdGUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0ID8gbmV3IERhdGUoK3RoaXMpIDogdGhpcy5fZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0FycmF5ICgpIHtcbiAgICAgICAgdmFyIG0gPSB0aGlzO1xuICAgICAgICByZXR1cm4gW20ueWVhcigpLCBtLm1vbnRoKCksIG0uZGF0ZSgpLCBtLmhvdXIoKSwgbS5taW51dGUoKSwgbS5zZWNvbmQoKSwgbS5taWxsaXNlY29uZCgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb21lbnRfdmFsaWRfX2lzVmFsaWQgKCkge1xuICAgICAgICByZXR1cm4gdmFsaWRfX2lzVmFsaWQodGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2luZ0ZsYWdzICgpIHtcbiAgICAgICAgcmV0dXJuIGV4dGVuZCh7fSwgZ2V0UGFyc2luZ0ZsYWdzKHRoaXMpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnZhbGlkQXQgKCkge1xuICAgICAgICByZXR1cm4gZ2V0UGFyc2luZ0ZsYWdzKHRoaXMpLm92ZXJmbG93O1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnZ2cnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy53ZWVrWWVhcigpICUgMTAwO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydHRycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzb1dlZWtZZWFyKCkgJSAxMDA7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBhZGRXZWVrWWVhckZvcm1hdFRva2VuICh0b2tlbiwgZ2V0dGVyKSB7XG4gICAgICAgIGFkZEZvcm1hdFRva2VuKDAsIFt0b2tlbiwgdG9rZW4ubGVuZ3RoXSwgMCwgZ2V0dGVyKTtcbiAgICB9XG5cbiAgICBhZGRXZWVrWWVhckZvcm1hdFRva2VuKCdnZ2dnJywgICAgICd3ZWVrWWVhcicpO1xuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ2dnZ2dnJywgICAgJ3dlZWtZZWFyJyk7XG4gICAgYWRkV2Vla1llYXJGb3JtYXRUb2tlbignR0dHRycsICAnaXNvV2Vla1llYXInKTtcbiAgICBhZGRXZWVrWWVhckZvcm1hdFRva2VuKCdHR0dHRycsICdpc29XZWVrWWVhcicpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCd3ZWVrWWVhcicsICdnZycpO1xuICAgIGFkZFVuaXRBbGlhcygnaXNvV2Vla1llYXInLCAnR0cnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ0cnLCAgICAgIG1hdGNoU2lnbmVkKTtcbiAgICBhZGRSZWdleFRva2VuKCdnJywgICAgICBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignR0cnLCAgICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2dnJywgICAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdHR0dHJywgICBtYXRjaDF0bzQsIG1hdGNoNCk7XG4gICAgYWRkUmVnZXhUb2tlbignZ2dnZycsICAgbWF0Y2gxdG80LCBtYXRjaDQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0dHR0dHJywgIG1hdGNoMXRvNiwgbWF0Y2g2KTtcbiAgICBhZGRSZWdleFRva2VuKCdnZ2dnZycsICBtYXRjaDF0bzYsIG1hdGNoNik7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ2dnZ2cnLCAnZ2dnZ2cnLCAnR0dHRycsICdHR0dHRyddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgd2Vla1t0b2tlbi5zdWJzdHIoMCwgMildID0gdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWydnZycsICdHRyddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgd2Vla1t0b2tlbl0gPSB1dGlsc19ob29rc19faG9va3MucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgZnVuY3Rpb24gd2Vla3NJblllYXIoeWVhciwgZG93LCBkb3kpIHtcbiAgICAgICAgcmV0dXJuIHdlZWtPZlllYXIobG9jYWxfX2NyZWF0ZUxvY2FsKFt5ZWFyLCAxMSwgMzEgKyBkb3cgLSBkb3ldKSwgZG93LCBkb3kpLndlZWs7XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0V2Vla1llYXIgKGlucHV0KSB7XG4gICAgICAgIHZhciB5ZWFyID0gd2Vla09mWWVhcih0aGlzLCB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3csIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRveSkueWVhcjtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB5ZWFyIDogdGhpcy5hZGQoKGlucHV0IC0geWVhciksICd5Jyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0SVNPV2Vla1llYXIgKGlucHV0KSB7XG4gICAgICAgIHZhciB5ZWFyID0gd2Vla09mWWVhcih0aGlzLCAxLCA0KS55ZWFyO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHllYXIgOiB0aGlzLmFkZCgoaW5wdXQgLSB5ZWFyKSwgJ3knKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRJU09XZWVrc0luWWVhciAoKSB7XG4gICAgICAgIHJldHVybiB3ZWVrc0luWWVhcih0aGlzLnllYXIoKSwgMSwgNCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0V2Vla3NJblllYXIgKCkge1xuICAgICAgICB2YXIgd2Vla0luZm8gPSB0aGlzLmxvY2FsZURhdGEoKS5fd2VlaztcbiAgICAgICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMueWVhcigpLCB3ZWVrSW5mby5kb3csIHdlZWtJbmZvLmRveSk7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1EnLCAwLCAwLCAncXVhcnRlcicpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdxdWFydGVyJywgJ1EnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ1EnLCBtYXRjaDEpO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1EnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W01PTlRIXSA9ICh0b0ludChpbnB1dCkgLSAxKSAqIDM7XG4gICAgfSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXRRdWFydGVyIChpbnB1dCkge1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IE1hdGguY2VpbCgodGhpcy5tb250aCgpICsgMSkgLyAzKSA6IHRoaXMubW9udGgoKGlucHV0IC0gMSkgKiAzICsgdGhpcy5tb250aCgpICUgMyk7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0QnLCBbJ0REJywgMl0sICdEbycsICdkYXRlJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2RhdGUnLCAnRCcpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignRCcsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0REJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0RvJywgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGlzU3RyaWN0ID8gbG9jYWxlLl9vcmRpbmFsUGFyc2UgOiBsb2NhbGUuX29yZGluYWxQYXJzZUxlbmllbnQ7XG4gICAgfSk7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnRCcsICdERCddLCBEQVRFKTtcbiAgICBhZGRQYXJzZVRva2VuKCdEbycsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbREFURV0gPSB0b0ludChpbnB1dC5tYXRjaChtYXRjaDF0bzIpWzBdLCAxMCk7XG4gICAgfSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0RGF5T2ZNb250aCA9IG1ha2VHZXRTZXQoJ0RhdGUnLCB0cnVlKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdkJywgMCwgJ2RvJywgJ2RheScpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2RkJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXNNaW4odGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdkZGQnLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5c1Nob3J0KHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZGRkZCcsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzKHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZScsIDAsIDAsICd3ZWVrZGF5Jyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ0UnLCAwLCAwLCAnaXNvV2Vla2RheScpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdkYXknLCAnZCcpO1xuICAgIGFkZFVuaXRBbGlhcygnd2Vla2RheScsICdlJyk7XG4gICAgYWRkVW5pdEFsaWFzKCdpc29XZWVrZGF5JywgJ0UnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ2QnLCAgICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2UnLCAgICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0UnLCAgICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2RkJywgICBtYXRjaFdvcmQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2RkZCcsICBtYXRjaFdvcmQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2RkZGQnLCBtYXRjaFdvcmQpO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWydkZCcsICdkZGQnLCAnZGRkZCddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZykge1xuICAgICAgICB2YXIgd2Vla2RheSA9IGNvbmZpZy5fbG9jYWxlLndlZWtkYXlzUGFyc2UoaW5wdXQpO1xuICAgICAgICAvLyBpZiB3ZSBkaWRuJ3QgZ2V0IGEgd2Vla2RheSBuYW1lLCBtYXJrIHRoZSBkYXRlIGFzIGludmFsaWRcbiAgICAgICAgaWYgKHdlZWtkYXkgIT0gbnVsbCkge1xuICAgICAgICAgICAgd2Vlay5kID0gd2Vla2RheTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmludmFsaWRXZWVrZGF5ID0gaW5wdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZCcsICdlJywgJ0UnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHdlZWtbdG9rZW5dID0gdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgZnVuY3Rpb24gcGFyc2VXZWVrZGF5KGlucHV0LCBsb2NhbGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmICghaXNOYU4oaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBwYXJzZUludChpbnB1dCwgMTApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBsb2NhbGUud2Vla2RheXNQYXJzZShpbnB1dCk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9XG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWtkYXlzID0gJ1N1bmRheV9Nb25kYXlfVHVlc2RheV9XZWRuZXNkYXlfVGh1cnNkYXlfRnJpZGF5X1NhdHVyZGF5Jy5zcGxpdCgnXycpO1xuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzIChtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1ttLmRheSgpXTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWtkYXlzU2hvcnQgPSAnU3VuX01vbl9UdWVfV2VkX1RodV9GcmlfU2F0Jy5zcGxpdCgnXycpO1xuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzU2hvcnQgKG0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU2hvcnRbbS5kYXkoKV07XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5c01pbiA9ICdTdV9Nb19UdV9XZV9UaF9Gcl9TYScuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5c01pbiAobSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNNaW5bbS5kYXkoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlV2Vla2RheXNQYXJzZSAod2Vla2RheU5hbWUpIHtcbiAgICAgICAgdmFyIGksIG1vbSwgcmVnZXg7XG5cbiAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlKSB7XG4gICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgICAgIGlmICghdGhpcy5fd2Vla2RheXNQYXJzZVtpXSkge1xuICAgICAgICAgICAgICAgIG1vbSA9IGxvY2FsX19jcmVhdGVMb2NhbChbMjAwMCwgMV0pLmRheShpKTtcbiAgICAgICAgICAgICAgICByZWdleCA9ICdeJyArIHRoaXMud2Vla2RheXMobW9tLCAnJykgKyAnfF4nICsgdGhpcy53ZWVrZGF5c1Nob3J0KG1vbSwgJycpICsgJ3xeJyArIHRoaXMud2Vla2RheXNNaW4obW9tLCAnJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZVtpXSA9IG5ldyBSZWdFeHAocmVnZXgucmVwbGFjZSgnLicsICcnKSwgJ2knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRlc3QgdGhlIHJlZ2V4XG4gICAgICAgICAgICBpZiAodGhpcy5fd2Vla2RheXNQYXJzZVtpXS50ZXN0KHdlZWtkYXlOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0RGF5T2ZXZWVrIChpbnB1dCkge1xuICAgICAgICB2YXIgZGF5ID0gdGhpcy5faXNVVEMgPyB0aGlzLl9kLmdldFVUQ0RheSgpIDogdGhpcy5fZC5nZXREYXkoKTtcbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlucHV0ID0gcGFyc2VXZWVrZGF5KGlucHV0LCB0aGlzLmxvY2FsZURhdGEoKSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGQoaW5wdXQgLSBkYXksICdkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGF5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0TG9jYWxlRGF5T2ZXZWVrIChpbnB1dCkge1xuICAgICAgICB2YXIgd2Vla2RheSA9ICh0aGlzLmRheSgpICsgNyAtIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRvdykgJSA3O1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWtkYXkgOiB0aGlzLmFkZChpbnB1dCAtIHdlZWtkYXksICdkJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0SVNPRGF5T2ZXZWVrIChpbnB1dCkge1xuICAgICAgICAvLyBiZWhhdmVzIHRoZSBzYW1lIGFzIG1vbWVudCNkYXkgZXhjZXB0XG4gICAgICAgIC8vIGFzIGEgZ2V0dGVyLCByZXR1cm5zIDcgaW5zdGVhZCBvZiAwICgxLTcgcmFuZ2UgaW5zdGVhZCBvZiAwLTYpXG4gICAgICAgIC8vIGFzIGEgc2V0dGVyLCBzdW5kYXkgc2hvdWxkIGJlbG9uZyB0byB0aGUgcHJldmlvdXMgd2Vlay5cbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB0aGlzLmRheSgpIHx8IDcgOiB0aGlzLmRheSh0aGlzLmRheSgpICUgNyA/IGlucHV0IDogaW5wdXQgLSA3KTtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbignSCcsIFsnSEgnLCAyXSwgMCwgJ2hvdXInKTtcbiAgICBhZGRGb3JtYXRUb2tlbignaCcsIFsnaGgnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ob3VycygpICUgMTIgfHwgMTI7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBtZXJpZGllbSAodG9rZW4sIGxvd2VyY2FzZSkge1xuICAgICAgICBhZGRGb3JtYXRUb2tlbih0b2tlbiwgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1lcmlkaWVtKHRoaXMuaG91cnMoKSwgdGhpcy5taW51dGVzKCksIGxvd2VyY2FzZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG1lcmlkaWVtKCdhJywgdHJ1ZSk7XG4gICAgbWVyaWRpZW0oJ0EnLCBmYWxzZSk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2hvdXInLCAnaCcpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgZnVuY3Rpb24gbWF0Y2hNZXJpZGllbSAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLl9tZXJpZGllbVBhcnNlO1xuICAgIH1cblxuICAgIGFkZFJlZ2V4VG9rZW4oJ2EnLCAgbWF0Y2hNZXJpZGllbSk7XG4gICAgYWRkUmVnZXhUb2tlbignQScsICBtYXRjaE1lcmlkaWVtKTtcbiAgICBhZGRSZWdleFRva2VuKCdIJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignaCcsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0hIJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2hoJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ0gnLCAnSEgnXSwgSE9VUik7XG4gICAgYWRkUGFyc2VUb2tlbihbJ2EnLCAnQSddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9pc1BtID0gY29uZmlnLl9sb2NhbGUuaXNQTShpbnB1dCk7XG4gICAgICAgIGNvbmZpZy5fbWVyaWRpZW0gPSBpbnB1dDtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKFsnaCcsICdoaCddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgYXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgLy8gTE9DQUxFU1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlSXNQTSAoaW5wdXQpIHtcbiAgICAgICAgLy8gSUU4IFF1aXJrcyBNb2RlICYgSUU3IFN0YW5kYXJkcyBNb2RlIGRvIG5vdCBhbGxvdyBhY2Nlc3Npbmcgc3RyaW5ncyBsaWtlIGFycmF5c1xuICAgICAgICAvLyBVc2luZyBjaGFyQXQgc2hvdWxkIGJlIG1vcmUgY29tcGF0aWJsZS5cbiAgICAgICAgcmV0dXJuICgoaW5wdXQgKyAnJykudG9Mb3dlckNhc2UoKS5jaGFyQXQoMCkgPT09ICdwJyk7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVNZXJpZGllbVBhcnNlID0gL1thcF1cXC4/bT9cXC4/L2k7XG4gICAgZnVuY3Rpb24gbG9jYWxlTWVyaWRpZW0gKGhvdXJzLCBtaW51dGVzLCBpc0xvd2VyKSB7XG4gICAgICAgIGlmIChob3VycyA+IDExKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNMb3dlciA/ICdwbScgOiAnUE0nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGlzTG93ZXIgPyAnYW0nIDogJ0FNJztcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgLy8gU2V0dGluZyB0aGUgaG91ciBzaG91bGQga2VlcCB0aGUgdGltZSwgYmVjYXVzZSB0aGUgdXNlciBleHBsaWNpdGx5XG4gICAgLy8gc3BlY2lmaWVkIHdoaWNoIGhvdXIgaGUgd2FudHMuIFNvIHRyeWluZyB0byBtYWludGFpbiB0aGUgc2FtZSBob3VyIChpblxuICAgIC8vIGEgbmV3IHRpbWV6b25lKSBtYWtlcyBzZW5zZS4gQWRkaW5nL3N1YnRyYWN0aW5nIGhvdXJzIGRvZXMgbm90IGZvbGxvd1xuICAgIC8vIHRoaXMgcnVsZS5cbiAgICB2YXIgZ2V0U2V0SG91ciA9IG1ha2VHZXRTZXQoJ0hvdXJzJywgdHJ1ZSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignbScsIFsnbW0nLCAyXSwgMCwgJ21pbnV0ZScpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtaW51dGUnLCAnbScpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignbScsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ21tJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydtJywgJ21tJ10sIE1JTlVURSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0TWludXRlID0gbWFrZUdldFNldCgnTWludXRlcycsIGZhbHNlKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdzJywgWydzcycsIDJdLCAwLCAnc2Vjb25kJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3NlY29uZCcsICdzJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdzJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignc3MnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUGFyc2VUb2tlbihbJ3MnLCAnc3MnXSwgU0VDT05EKTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRTZWNvbmQgPSBtYWtlR2V0U2V0KCdTZWNvbmRzJywgZmFsc2UpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1MnLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB+fih0aGlzLm1pbGxpc2Vjb25kKCkgLyAxMDApO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTUycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB+fih0aGlzLm1pbGxpc2Vjb25kKCkgLyAxMCk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBtaWxsaXNlY29uZF9fbWlsbGlzZWNvbmRzICh0b2tlbikge1xuICAgICAgICBhZGRGb3JtYXRUb2tlbigwLCBbdG9rZW4sIDNdLCAwLCAnbWlsbGlzZWNvbmQnKTtcbiAgICB9XG5cbiAgICBtaWxsaXNlY29uZF9fbWlsbGlzZWNvbmRzKCdTU1MnKTtcbiAgICBtaWxsaXNlY29uZF9fbWlsbGlzZWNvbmRzKCdTU1NTJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ21pbGxpc2Vjb25kJywgJ21zJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdTJywgICAgbWF0Y2gxdG8zLCBtYXRjaDEpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1NTJywgICBtYXRjaDF0bzMsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignU1NTJywgIG1hdGNoMXRvMywgbWF0Y2gzKTtcbiAgICBhZGRSZWdleFRva2VuKCdTU1NTJywgbWF0Y2hVbnNpZ25lZCk7XG4gICAgYWRkUGFyc2VUb2tlbihbJ1MnLCAnU1MnLCAnU1NTJywgJ1NTU1MnXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtNSUxMSVNFQ09ORF0gPSB0b0ludCgoJzAuJyArIGlucHV0KSAqIDEwMDApO1xuICAgIH0pO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldE1pbGxpc2Vjb25kID0gbWFrZUdldFNldCgnTWlsbGlzZWNvbmRzJywgZmFsc2UpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ3onLCAgMCwgMCwgJ3pvbmVBYmJyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ3p6JywgMCwgMCwgJ3pvbmVOYW1lJyk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRab25lQWJiciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/ICdVVEMnIDogJyc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Wm9uZU5hbWUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyAnQ29vcmRpbmF0ZWQgVW5pdmVyc2FsIFRpbWUnIDogJyc7XG4gICAgfVxuXG4gICAgdmFyIG1vbWVudFByb3RvdHlwZV9fcHJvdG8gPSBNb21lbnQucHJvdG90eXBlO1xuXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5hZGQgICAgICAgICAgPSBhZGRfc3VidHJhY3RfX2FkZDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmNhbGVuZGFyICAgICA9IG1vbWVudF9jYWxlbmRhcl9fY2FsZW5kYXI7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5jbG9uZSAgICAgICAgPSBjbG9uZTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmRpZmYgICAgICAgICA9IGRpZmY7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5lbmRPZiAgICAgICAgPSBlbmRPZjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmZvcm1hdCAgICAgICA9IGZvcm1hdDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmZyb20gICAgICAgICA9IGZyb207XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5mcm9tTm93ICAgICAgPSBmcm9tTm93O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG8gICAgICAgICAgID0gdG87XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by50b05vdyAgICAgICAgPSB0b05vdztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmdldCAgICAgICAgICA9IGdldFNldDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmludmFsaWRBdCAgICA9IGludmFsaWRBdDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzQWZ0ZXIgICAgICA9IGlzQWZ0ZXI7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0JlZm9yZSAgICAgPSBpc0JlZm9yZTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzQmV0d2VlbiAgICA9IGlzQmV0d2VlbjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzU2FtZSAgICAgICA9IGlzU2FtZTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzVmFsaWQgICAgICA9IG1vbWVudF92YWxpZF9faXNWYWxpZDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmxhbmcgICAgICAgICA9IGxhbmc7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5sb2NhbGUgICAgICAgPSBsb2NhbGU7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5sb2NhbGVEYXRhICAgPSBsb2NhbGVEYXRhO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubWF4ICAgICAgICAgID0gcHJvdG90eXBlTWF4O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubWluICAgICAgICAgID0gcHJvdG90eXBlTWluO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ucGFyc2luZ0ZsYWdzID0gcGFyc2luZ0ZsYWdzO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uc2V0ICAgICAgICAgID0gZ2V0U2V0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uc3RhcnRPZiAgICAgID0gc3RhcnRPZjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnN1YnRyYWN0ICAgICA9IGFkZF9zdWJ0cmFjdF9fc3VidHJhY3Q7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by50b0FycmF5ICAgICAgPSB0b0FycmF5O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9EYXRlICAgICAgID0gdG9EYXRlO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9JU09TdHJpbmcgID0gbW9tZW50X2Zvcm1hdF9fdG9JU09TdHJpbmc7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by50b0pTT04gICAgICAgPSBtb21lbnRfZm9ybWF0X190b0lTT1N0cmluZztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvU3RyaW5nICAgICA9IHRvU3RyaW5nO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udW5peCAgICAgICAgID0gdW5peDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnZhbHVlT2YgICAgICA9IHRvX3R5cGVfX3ZhbHVlT2Y7XG5cbiAgICAvLyBZZWFyXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by55ZWFyICAgICAgID0gZ2V0U2V0WWVhcjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzTGVhcFllYXIgPSBnZXRJc0xlYXBZZWFyO1xuXG4gICAgLy8gV2VlayBZZWFyXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrWWVhciAgICA9IGdldFNldFdlZWtZZWFyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNvV2Vla1llYXIgPSBnZXRTZXRJU09XZWVrWWVhcjtcblxuICAgIC8vIFF1YXJ0ZXJcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnF1YXJ0ZXIgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnF1YXJ0ZXJzID0gZ2V0U2V0UXVhcnRlcjtcblxuICAgIC8vIE1vbnRoXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5tb250aCAgICAgICA9IGdldFNldE1vbnRoO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGF5c0luTW9udGggPSBnZXREYXlzSW5Nb250aDtcblxuICAgIC8vIFdlZWtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLndlZWsgICAgICAgICAgID0gbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrcyAgICAgICAgPSBnZXRTZXRXZWVrO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNvV2VlayAgICAgICAgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzb1dlZWtzICAgICA9IGdldFNldElTT1dlZWs7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrc0luWWVhciAgICA9IGdldFdlZWtzSW5ZZWFyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNvV2Vla3NJblllYXIgPSBnZXRJU09XZWVrc0luWWVhcjtcblxuICAgIC8vIERheVxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGF0ZSAgICAgICA9IGdldFNldERheU9mTW9udGg7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kYXkgICAgICAgID0gbW9tZW50UHJvdG90eXBlX19wcm90by5kYXlzICAgICAgICAgICAgID0gZ2V0U2V0RGF5T2ZXZWVrO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ud2Vla2RheSAgICA9IGdldFNldExvY2FsZURheU9mV2VlaztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzb1dlZWtkYXkgPSBnZXRTZXRJU09EYXlPZldlZWs7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kYXlPZlllYXIgID0gZ2V0U2V0RGF5T2ZZZWFyO1xuXG4gICAgLy8gSG91clxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaG91ciA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaG91cnMgPSBnZXRTZXRIb3VyO1xuXG4gICAgLy8gTWludXRlXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5taW51dGUgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1pbnV0ZXMgPSBnZXRTZXRNaW51dGU7XG5cbiAgICAvLyBTZWNvbmRcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnNlY29uZCA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8uc2Vjb25kcyA9IGdldFNldFNlY29uZDtcblxuICAgIC8vIE1pbGxpc2Vjb25kXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5taWxsaXNlY29uZCA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubWlsbGlzZWNvbmRzID0gZ2V0U2V0TWlsbGlzZWNvbmQ7XG5cbiAgICAvLyBPZmZzZXRcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnV0Y09mZnNldCAgICAgICAgICAgID0gZ2V0U2V0T2Zmc2V0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udXRjICAgICAgICAgICAgICAgICAgPSBzZXRPZmZzZXRUb1VUQztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmxvY2FsICAgICAgICAgICAgICAgID0gc2V0T2Zmc2V0VG9Mb2NhbDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnBhcnNlWm9uZSAgICAgICAgICAgID0gc2V0T2Zmc2V0VG9QYXJzZWRPZmZzZXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5oYXNBbGlnbmVkSG91ck9mZnNldCA9IGhhc0FsaWduZWRIb3VyT2Zmc2V0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNEU1QgICAgICAgICAgICAgICAgPSBpc0RheWxpZ2h0U2F2aW5nVGltZTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzRFNUU2hpZnRlZCAgICAgICAgID0gaXNEYXlsaWdodFNhdmluZ1RpbWVTaGlmdGVkO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNMb2NhbCAgICAgICAgICAgICAgPSBpc0xvY2FsO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNVdGNPZmZzZXQgICAgICAgICAgPSBpc1V0Y09mZnNldDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzVXRjICAgICAgICAgICAgICAgID0gaXNVdGM7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc1VUQyAgICAgICAgICAgICAgICA9IGlzVXRjO1xuXG4gICAgLy8gVGltZXpvbmVcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnpvbmVBYmJyID0gZ2V0Wm9uZUFiYnI7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by56b25lTmFtZSA9IGdldFpvbmVOYW1lO1xuXG4gICAgLy8gRGVwcmVjYXRpb25zXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kYXRlcyAgPSBkZXByZWNhdGUoJ2RhdGVzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSBkYXRlIGluc3RlYWQuJywgZ2V0U2V0RGF5T2ZNb250aCk7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5tb250aHMgPSBkZXByZWNhdGUoJ21vbnRocyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgbW9udGggaW5zdGVhZCcsIGdldFNldE1vbnRoKTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnllYXJzICA9IGRlcHJlY2F0ZSgneWVhcnMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIHllYXIgaW5zdGVhZCcsIGdldFNldFllYXIpO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uem9uZSAgID0gZGVwcmVjYXRlKCdtb21lbnQoKS56b25lIGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQoKS51dGNPZmZzZXQgaW5zdGVhZC4gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE3NzknLCBnZXRTZXRab25lKTtcblxuICAgIHZhciBtb21lbnRQcm90b3R5cGUgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvO1xuXG4gICAgZnVuY3Rpb24gbW9tZW50X19jcmVhdGVVbml4IChpbnB1dCkge1xuICAgICAgICByZXR1cm4gbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0ICogMTAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50X19jcmVhdGVJblpvbmUgKCkge1xuICAgICAgICByZXR1cm4gbG9jYWxfX2NyZWF0ZUxvY2FsLmFwcGx5KG51bGwsIGFyZ3VtZW50cykucGFyc2Vab25lKCk7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRDYWxlbmRhciA9IHtcbiAgICAgICAgc2FtZURheSA6ICdbVG9kYXkgYXRdIExUJyxcbiAgICAgICAgbmV4dERheSA6ICdbVG9tb3Jyb3cgYXRdIExUJyxcbiAgICAgICAgbmV4dFdlZWsgOiAnZGRkZCBbYXRdIExUJyxcbiAgICAgICAgbGFzdERheSA6ICdbWWVzdGVyZGF5IGF0XSBMVCcsXG4gICAgICAgIGxhc3RXZWVrIDogJ1tMYXN0XSBkZGRkIFthdF0gTFQnLFxuICAgICAgICBzYW1lRWxzZSA6ICdMJ1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVfY2FsZW5kYXJfX2NhbGVuZGFyIChrZXksIG1vbSwgbm93KSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9jYWxlbmRhcltrZXldO1xuICAgICAgICByZXR1cm4gdHlwZW9mIG91dHB1dCA9PT0gJ2Z1bmN0aW9uJyA/IG91dHB1dC5jYWxsKG1vbSwgbm93KSA6IG91dHB1dDtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvbmdEYXRlRm9ybWF0ID0ge1xuICAgICAgICBMVFMgIDogJ2g6bW06c3MgQScsXG4gICAgICAgIExUICAgOiAnaDptbSBBJyxcbiAgICAgICAgTCAgICA6ICdNTS9ERC9ZWVlZJyxcbiAgICAgICAgTEwgICA6ICdNTU1NIEQsIFlZWVknLFxuICAgICAgICBMTEwgIDogJ01NTU0gRCwgWVlZWSBMVCcsXG4gICAgICAgIExMTEwgOiAnZGRkZCwgTU1NTSBELCBZWVlZIExUJ1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsb25nRGF0ZUZvcm1hdCAoa2V5KSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXldO1xuICAgICAgICBpZiAoIW91dHB1dCAmJiB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXkudG9VcHBlckNhc2UoKV0pIHtcbiAgICAgICAgICAgIG91dHB1dCA9IHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleS50b1VwcGVyQ2FzZSgpXS5yZXBsYWNlKC9NTU1NfE1NfEREfGRkZGQvZywgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWwuc2xpY2UoMSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV0gPSBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdEludmFsaWREYXRlID0gJ0ludmFsaWQgZGF0ZSc7XG5cbiAgICBmdW5jdGlvbiBpbnZhbGlkRGF0ZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZhbGlkRGF0ZTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdE9yZGluYWwgPSAnJWQnO1xuICAgIHZhciBkZWZhdWx0T3JkaW5hbFBhcnNlID0gL1xcZHsxLDJ9LztcblxuICAgIGZ1bmN0aW9uIG9yZGluYWwgKG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3JkaW5hbC5yZXBsYWNlKCclZCcsIG51bWJlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJlUGFyc2VQb3N0Rm9ybWF0IChzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdFJlbGF0aXZlVGltZSA9IHtcbiAgICAgICAgZnV0dXJlIDogJ2luICVzJyxcbiAgICAgICAgcGFzdCAgIDogJyVzIGFnbycsXG4gICAgICAgIHMgIDogJ2EgZmV3IHNlY29uZHMnLFxuICAgICAgICBtICA6ICdhIG1pbnV0ZScsXG4gICAgICAgIG1tIDogJyVkIG1pbnV0ZXMnLFxuICAgICAgICBoICA6ICdhbiBob3VyJyxcbiAgICAgICAgaGggOiAnJWQgaG91cnMnLFxuICAgICAgICBkICA6ICdhIGRheScsXG4gICAgICAgIGRkIDogJyVkIGRheXMnLFxuICAgICAgICBNICA6ICdhIG1vbnRoJyxcbiAgICAgICAgTU0gOiAnJWQgbW9udGhzJyxcbiAgICAgICAgeSAgOiAnYSB5ZWFyJyxcbiAgICAgICAgeXkgOiAnJWQgeWVhcnMnXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHJlbGF0aXZlX19yZWxhdGl2ZVRpbWUgKG51bWJlciwgd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5fcmVsYXRpdmVUaW1lW3N0cmluZ107XG4gICAgICAgIHJldHVybiAodHlwZW9mIG91dHB1dCA9PT0gJ2Z1bmN0aW9uJykgP1xuICAgICAgICAgICAgb3V0cHV0KG51bWJlciwgd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSkgOlxuICAgICAgICAgICAgb3V0cHV0LnJlcGxhY2UoLyVkL2ksIG51bWJlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFzdEZ1dHVyZSAoZGlmZiwgb3V0cHV0KSB7XG4gICAgICAgIHZhciBmb3JtYXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbZGlmZiA+IDAgPyAnZnV0dXJlJyA6ICdwYXN0J107XG4gICAgICAgIHJldHVybiB0eXBlb2YgZm9ybWF0ID09PSAnZnVuY3Rpb24nID8gZm9ybWF0KG91dHB1dCkgOiBmb3JtYXQucmVwbGFjZSgvJXMvaSwgb3V0cHV0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVfc2V0X19zZXQgKGNvbmZpZykge1xuICAgICAgICB2YXIgcHJvcCwgaTtcbiAgICAgICAgZm9yIChpIGluIGNvbmZpZykge1xuICAgICAgICAgICAgcHJvcCA9IGNvbmZpZ1tpXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRoaXNbaV0gPSBwcm9wO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzWydfJyArIGldID0gcHJvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBMZW5pZW50IG9yZGluYWwgcGFyc2luZyBhY2NlcHRzIGp1c3QgYSBudW1iZXIgaW4gYWRkaXRpb24gdG9cbiAgICAgICAgLy8gbnVtYmVyICsgKHBvc3NpYmx5KSBzdHVmZiBjb21pbmcgZnJvbSBfb3JkaW5hbFBhcnNlTGVuaWVudC5cbiAgICAgICAgdGhpcy5fb3JkaW5hbFBhcnNlTGVuaWVudCA9IG5ldyBSZWdFeHAodGhpcy5fb3JkaW5hbFBhcnNlLnNvdXJjZSArICd8JyArICgvXFxkezEsMn0vKS5zb3VyY2UpO1xuICAgIH1cblxuICAgIHZhciBwcm90b3R5cGVfX3Byb3RvID0gTG9jYWxlLnByb3RvdHlwZTtcblxuICAgIHByb3RvdHlwZV9fcHJvdG8uX2NhbGVuZGFyICAgICAgID0gZGVmYXVsdENhbGVuZGFyO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uY2FsZW5kYXIgICAgICAgID0gbG9jYWxlX2NhbGVuZGFyX19jYWxlbmRhcjtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9sb25nRGF0ZUZvcm1hdCA9IGRlZmF1bHRMb25nRGF0ZUZvcm1hdDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLmxvbmdEYXRlRm9ybWF0ICA9IGxvbmdEYXRlRm9ybWF0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX2ludmFsaWREYXRlICAgID0gZGVmYXVsdEludmFsaWREYXRlO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uaW52YWxpZERhdGUgICAgID0gaW52YWxpZERhdGU7XG4gICAgcHJvdG90eXBlX19wcm90by5fb3JkaW5hbCAgICAgICAgPSBkZWZhdWx0T3JkaW5hbDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLm9yZGluYWwgICAgICAgICA9IG9yZGluYWw7XG4gICAgcHJvdG90eXBlX19wcm90by5fb3JkaW5hbFBhcnNlICAgPSBkZWZhdWx0T3JkaW5hbFBhcnNlO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ucHJlcGFyc2UgICAgICAgID0gcHJlUGFyc2VQb3N0Rm9ybWF0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8ucG9zdGZvcm1hdCAgICAgID0gcHJlUGFyc2VQb3N0Rm9ybWF0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX3JlbGF0aXZlVGltZSAgID0gZGVmYXVsdFJlbGF0aXZlVGltZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLnJlbGF0aXZlVGltZSAgICA9IHJlbGF0aXZlX19yZWxhdGl2ZVRpbWU7XG4gICAgcHJvdG90eXBlX19wcm90by5wYXN0RnV0dXJlICAgICAgPSBwYXN0RnV0dXJlO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uc2V0ICAgICAgICAgICAgID0gbG9jYWxlX3NldF9fc2V0O1xuXG4gICAgLy8gTW9udGhcbiAgICBwcm90b3R5cGVfX3Byb3RvLm1vbnRocyAgICAgICA9ICAgICAgICBsb2NhbGVNb250aHM7XG4gICAgcHJvdG90eXBlX19wcm90by5fbW9udGhzICAgICAgPSBkZWZhdWx0TG9jYWxlTW9udGhzO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ubW9udGhzU2hvcnQgID0gICAgICAgIGxvY2FsZU1vbnRoc1Nob3J0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX21vbnRoc1Nob3J0ID0gZGVmYXVsdExvY2FsZU1vbnRoc1Nob3J0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8ubW9udGhzUGFyc2UgID0gICAgICAgIGxvY2FsZU1vbnRoc1BhcnNlO1xuXG4gICAgLy8gV2Vla1xuICAgIHByb3RvdHlwZV9fcHJvdG8ud2VlayA9IGxvY2FsZVdlZWs7XG4gICAgcHJvdG90eXBlX19wcm90by5fd2VlayA9IGRlZmF1bHRMb2NhbGVXZWVrO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uZmlyc3REYXlPZlllYXIgPSBsb2NhbGVGaXJzdERheU9mWWVhcjtcbiAgICBwcm90b3R5cGVfX3Byb3RvLmZpcnN0RGF5T2ZXZWVrID0gbG9jYWxlRmlyc3REYXlPZldlZWs7XG5cbiAgICAvLyBEYXkgb2YgV2Vla1xuICAgIHByb3RvdHlwZV9fcHJvdG8ud2Vla2RheXMgICAgICAgPSAgICAgICAgbG9jYWxlV2Vla2RheXM7XG4gICAgcHJvdG90eXBlX19wcm90by5fd2Vla2RheXMgICAgICA9IGRlZmF1bHRMb2NhbGVXZWVrZGF5cztcbiAgICBwcm90b3R5cGVfX3Byb3RvLndlZWtkYXlzTWluICAgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzTWluO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX3dlZWtkYXlzTWluICAgPSBkZWZhdWx0TG9jYWxlV2Vla2RheXNNaW47XG4gICAgcHJvdG90eXBlX19wcm90by53ZWVrZGF5c1Nob3J0ICA9ICAgICAgICBsb2NhbGVXZWVrZGF5c1Nob3J0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX3dlZWtkYXlzU2hvcnQgPSBkZWZhdWx0TG9jYWxlV2Vla2RheXNTaG9ydDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLndlZWtkYXlzUGFyc2UgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzUGFyc2U7XG5cbiAgICAvLyBIb3Vyc1xuICAgIHByb3RvdHlwZV9fcHJvdG8uaXNQTSA9IGxvY2FsZUlzUE07XG4gICAgcHJvdG90eXBlX19wcm90by5fbWVyaWRpZW1QYXJzZSA9IGRlZmF1bHRMb2NhbGVNZXJpZGllbVBhcnNlO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ubWVyaWRpZW0gPSBsb2NhbGVNZXJpZGllbTtcblxuICAgIGZ1bmN0aW9uIGxpc3RzX19nZXQgKGZvcm1hdCwgaW5kZXgsIGZpZWxkLCBzZXR0ZXIpIHtcbiAgICAgICAgdmFyIGxvY2FsZSA9IGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUoKTtcbiAgICAgICAgdmFyIHV0YyA9IGNyZWF0ZV91dGNfX2NyZWF0ZVVUQygpLnNldChzZXR0ZXIsIGluZGV4KTtcbiAgICAgICAgcmV0dXJuIGxvY2FsZVtmaWVsZF0odXRjLCBmb3JtYXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3QgKGZvcm1hdCwgaW5kZXgsIGZpZWxkLCBjb3VudCwgc2V0dGVyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZm9ybWF0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaW5kZXggPSBmb3JtYXQ7XG4gICAgICAgICAgICBmb3JtYXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgJyc7XG5cbiAgICAgICAgaWYgKGluZGV4ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBsaXN0c19fZ2V0KGZvcm1hdCwgaW5kZXgsIGZpZWxkLCBzZXR0ZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBvdXQgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIG91dFtpXSA9IGxpc3RzX19nZXQoZm9ybWF0LCBpLCBmaWVsZCwgc2V0dGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RzX19saXN0TW9udGhzIChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0KGZvcm1hdCwgaW5kZXgsICdtb250aHMnLCAxMiwgJ21vbnRoJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdHNfX2xpc3RNb250aHNTaG9ydCAoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdChmb3JtYXQsIGluZGV4LCAnbW9udGhzU2hvcnQnLCAxMiwgJ21vbnRoJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdHNfX2xpc3RXZWVrZGF5cyAoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdChmb3JtYXQsIGluZGV4LCAnd2Vla2RheXMnLCA3LCAnZGF5Jyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdHNfX2xpc3RXZWVrZGF5c1Nob3J0IChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0KGZvcm1hdCwgaW5kZXgsICd3ZWVrZGF5c1Nob3J0JywgNywgJ2RheScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RzX19saXN0V2Vla2RheXNNaW4gKGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3QoZm9ybWF0LCBpbmRleCwgJ3dlZWtkYXlzTWluJywgNywgJ2RheScpO1xuICAgIH1cblxuICAgIGxvY2FsZV9sb2NhbGVzX19nZXRTZXRHbG9iYWxMb2NhbGUoJ2VuJywge1xuICAgICAgICBvcmRpbmFsUGFyc2U6IC9cXGR7MSwyfSh0aHxzdHxuZHxyZCkvLFxuICAgICAgICBvcmRpbmFsIDogZnVuY3Rpb24gKG51bWJlcikge1xuICAgICAgICAgICAgdmFyIGIgPSBudW1iZXIgJSAxMCxcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSAodG9JbnQobnVtYmVyICUgMTAwIC8gMTApID09PSAxKSA/ICd0aCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAxKSA/ICdzdCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAyKSA/ICduZCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAzKSA/ICdyZCcgOiAndGgnO1xuICAgICAgICAgICAgcmV0dXJuIG51bWJlciArIG91dHB1dDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU2lkZSBlZmZlY3QgaW1wb3J0c1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5sYW5nID0gZGVwcmVjYXRlKCdtb21lbnQubGFuZyBpcyBkZXByZWNhdGVkLiBVc2UgbW9tZW50LmxvY2FsZSBpbnN0ZWFkLicsIGxvY2FsZV9sb2NhbGVzX19nZXRTZXRHbG9iYWxMb2NhbGUpO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5sYW5nRGF0YSA9IGRlcHJlY2F0ZSgnbW9tZW50LmxhbmdEYXRhIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb21lbnQubG9jYWxlRGF0YSBpbnN0ZWFkLicsIGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUpO1xuXG4gICAgdmFyIG1hdGhBYnMgPSBNYXRoLmFicztcblxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2Fic19fYWJzICgpIHtcbiAgICAgICAgdmFyIGRhdGEgICAgICAgICAgID0gdGhpcy5fZGF0YTtcblxuICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgPSBtYXRoQWJzKHRoaXMuX21pbGxpc2Vjb25kcyk7XG4gICAgICAgIHRoaXMuX2RheXMgICAgICAgICA9IG1hdGhBYnModGhpcy5fZGF5cyk7XG4gICAgICAgIHRoaXMuX21vbnRocyAgICAgICA9IG1hdGhBYnModGhpcy5fbW9udGhzKTtcblxuICAgICAgICBkYXRhLm1pbGxpc2Vjb25kcyAgPSBtYXRoQWJzKGRhdGEubWlsbGlzZWNvbmRzKTtcbiAgICAgICAgZGF0YS5zZWNvbmRzICAgICAgID0gbWF0aEFicyhkYXRhLnNlY29uZHMpO1xuICAgICAgICBkYXRhLm1pbnV0ZXMgICAgICAgPSBtYXRoQWJzKGRhdGEubWludXRlcyk7XG4gICAgICAgIGRhdGEuaG91cnMgICAgICAgICA9IG1hdGhBYnMoZGF0YS5ob3Vycyk7XG4gICAgICAgIGRhdGEubW9udGhzICAgICAgICA9IG1hdGhBYnMoZGF0YS5tb250aHMpO1xuICAgICAgICBkYXRhLnllYXJzICAgICAgICAgPSBtYXRoQWJzKGRhdGEueWVhcnMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fYWRkU3VidHJhY3QgKGR1cmF0aW9uLCBpbnB1dCwgdmFsdWUsIGRpcmVjdGlvbikge1xuICAgICAgICB2YXIgb3RoZXIgPSBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uKGlucHV0LCB2YWx1ZSk7XG5cbiAgICAgICAgZHVyYXRpb24uX21pbGxpc2Vjb25kcyArPSBkaXJlY3Rpb24gKiBvdGhlci5fbWlsbGlzZWNvbmRzO1xuICAgICAgICBkdXJhdGlvbi5fZGF5cyAgICAgICAgICs9IGRpcmVjdGlvbiAqIG90aGVyLl9kYXlzO1xuICAgICAgICBkdXJhdGlvbi5fbW9udGhzICAgICAgICs9IGRpcmVjdGlvbiAqIG90aGVyLl9tb250aHM7XG5cbiAgICAgICAgcmV0dXJuIGR1cmF0aW9uLl9idWJibGUoKTtcbiAgICB9XG5cbiAgICAvLyBzdXBwb3J0cyBvbmx5IDIuMC1zdHlsZSBhZGQoMSwgJ3MnKSBvciBhZGQoZHVyYXRpb24pXG4gICAgZnVuY3Rpb24gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19hZGQgKGlucHV0LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19hZGRTdWJ0cmFjdCh0aGlzLCBpbnB1dCwgdmFsdWUsIDEpO1xuICAgIH1cblxuICAgIC8vIHN1cHBvcnRzIG9ubHkgMi4wLXN0eWxlIHN1YnRyYWN0KDEsICdzJykgb3Igc3VidHJhY3QoZHVyYXRpb24pXG4gICAgZnVuY3Rpb24gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19zdWJ0cmFjdCAoaW5wdXQsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBkdXJhdGlvbl9hZGRfc3VidHJhY3RfX2FkZFN1YnRyYWN0KHRoaXMsIGlucHV0LCB2YWx1ZSwgLTEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJ1YmJsZSAoKSB7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSB0aGlzLl9taWxsaXNlY29uZHM7XG4gICAgICAgIHZhciBkYXlzICAgICAgICAgPSB0aGlzLl9kYXlzO1xuICAgICAgICB2YXIgbW9udGhzICAgICAgID0gdGhpcy5fbW9udGhzO1xuICAgICAgICB2YXIgZGF0YSAgICAgICAgID0gdGhpcy5fZGF0YTtcbiAgICAgICAgdmFyIHNlY29uZHMsIG1pbnV0ZXMsIGhvdXJzLCB5ZWFycyA9IDA7XG5cbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBjb2RlIGJ1YmJsZXMgdXAgdmFsdWVzLCBzZWUgdGhlIHRlc3RzIGZvclxuICAgICAgICAvLyBleGFtcGxlcyBvZiB3aGF0IHRoYXQgbWVhbnMuXG4gICAgICAgIGRhdGEubWlsbGlzZWNvbmRzID0gbWlsbGlzZWNvbmRzICUgMTAwMDtcblxuICAgICAgICBzZWNvbmRzICAgICAgICAgICA9IGFic0Zsb29yKG1pbGxpc2Vjb25kcyAvIDEwMDApO1xuICAgICAgICBkYXRhLnNlY29uZHMgICAgICA9IHNlY29uZHMgJSA2MDtcblxuICAgICAgICBtaW51dGVzICAgICAgICAgICA9IGFic0Zsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgICAgIGRhdGEubWludXRlcyAgICAgID0gbWludXRlcyAlIDYwO1xuXG4gICAgICAgIGhvdXJzICAgICAgICAgICAgID0gYWJzRmxvb3IobWludXRlcyAvIDYwKTtcbiAgICAgICAgZGF0YS5ob3VycyAgICAgICAgPSBob3VycyAlIDI0O1xuXG4gICAgICAgIGRheXMgKz0gYWJzRmxvb3IoaG91cnMgLyAyNCk7XG5cbiAgICAgICAgLy8gQWNjdXJhdGVseSBjb252ZXJ0IGRheXMgdG8geWVhcnMsIGFzc3VtZSBzdGFydCBmcm9tIHllYXIgMC5cbiAgICAgICAgeWVhcnMgPSBhYnNGbG9vcihkYXlzVG9ZZWFycyhkYXlzKSk7XG4gICAgICAgIGRheXMgLT0gYWJzRmxvb3IoeWVhcnNUb0RheXMoeWVhcnMpKTtcblxuICAgICAgICAvLyAzMCBkYXlzIHRvIGEgbW9udGhcbiAgICAgICAgLy8gVE9ETyAoaXNrcmVuKTogVXNlIGFuY2hvciBkYXRlIChsaWtlIDFzdCBKYW4pIHRvIGNvbXB1dGUgdGhpcy5cbiAgICAgICAgbW9udGhzICs9IGFic0Zsb29yKGRheXMgLyAzMCk7XG4gICAgICAgIGRheXMgICAlPSAzMDtcblxuICAgICAgICAvLyAxMiBtb250aHMgLT4gMSB5ZWFyXG4gICAgICAgIHllYXJzICArPSBhYnNGbG9vcihtb250aHMgLyAxMik7XG4gICAgICAgIG1vbnRocyAlPSAxMjtcblxuICAgICAgICBkYXRhLmRheXMgICA9IGRheXM7XG4gICAgICAgIGRhdGEubW9udGhzID0gbW9udGhzO1xuICAgICAgICBkYXRhLnllYXJzICA9IHllYXJzO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheXNUb1llYXJzIChkYXlzKSB7XG4gICAgICAgIC8vIDQwMCB5ZWFycyBoYXZlIDE0NjA5NyBkYXlzICh0YWtpbmcgaW50byBhY2NvdW50IGxlYXAgeWVhciBydWxlcylcbiAgICAgICAgcmV0dXJuIGRheXMgKiA0MDAgLyAxNDYwOTc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24geWVhcnNUb0RheXMgKHllYXJzKSB7XG4gICAgICAgIC8vIHllYXJzICogMzY1ICsgYWJzRmxvb3IoeWVhcnMgLyA0KSAtXG4gICAgICAgIC8vICAgICBhYnNGbG9vcih5ZWFycyAvIDEwMCkgKyBhYnNGbG9vcih5ZWFycyAvIDQwMCk7XG4gICAgICAgIHJldHVybiB5ZWFycyAqIDE0NjA5NyAvIDQwMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcyAodW5pdHMpIHtcbiAgICAgICAgdmFyIGRheXM7XG4gICAgICAgIHZhciBtb250aHM7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSB0aGlzLl9taWxsaXNlY29uZHM7XG5cbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG5cbiAgICAgICAgaWYgKHVuaXRzID09PSAnbW9udGgnIHx8IHVuaXRzID09PSAneWVhcicpIHtcbiAgICAgICAgICAgIGRheXMgICA9IHRoaXMuX2RheXMgICArIG1pbGxpc2Vjb25kcyAvIDg2NGU1O1xuICAgICAgICAgICAgbW9udGhzID0gdGhpcy5fbW9udGhzICsgZGF5c1RvWWVhcnMoZGF5cykgKiAxMjtcbiAgICAgICAgICAgIHJldHVybiB1bml0cyA9PT0gJ21vbnRoJyA/IG1vbnRocyA6IG1vbnRocyAvIDEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaGFuZGxlIG1pbGxpc2Vjb25kcyBzZXBhcmF0ZWx5IGJlY2F1c2Ugb2YgZmxvYXRpbmcgcG9pbnQgbWF0aCBlcnJvcnMgKGlzc3VlICMxODY3KVxuICAgICAgICAgICAgZGF5cyA9IHRoaXMuX2RheXMgKyBNYXRoLnJvdW5kKHllYXJzVG9EYXlzKHRoaXMuX21vbnRocyAvIDEyKSk7XG4gICAgICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnd2VlaycgICA6IHJldHVybiBkYXlzIC8gNyAgICAgKyBtaWxsaXNlY29uZHMgLyA2MDQ4ZTU7XG4gICAgICAgICAgICAgICAgY2FzZSAnZGF5JyAgICA6IHJldHVybiBkYXlzICAgICAgICAgKyBtaWxsaXNlY29uZHMgLyA4NjRlNTtcbiAgICAgICAgICAgICAgICBjYXNlICdob3VyJyAgIDogcmV0dXJuIGRheXMgKiAyNCAgICArIG1pbGxpc2Vjb25kcyAvIDM2ZTU7XG4gICAgICAgICAgICAgICAgY2FzZSAnbWludXRlJyA6IHJldHVybiBkYXlzICogMTQ0MCAgKyBtaWxsaXNlY29uZHMgLyA2ZTQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnc2Vjb25kJyA6IHJldHVybiBkYXlzICogODY0MDAgKyBtaWxsaXNlY29uZHMgLyAxMDAwO1xuICAgICAgICAgICAgICAgIC8vIE1hdGguZmxvb3IgcHJldmVudHMgZmxvYXRpbmcgcG9pbnQgbWF0aCBlcnJvcnMgaGVyZVxuICAgICAgICAgICAgICAgIGNhc2UgJ21pbGxpc2Vjb25kJzogcmV0dXJuIE1hdGguZmxvb3IoZGF5cyAqIDg2NGU1KSArIG1pbGxpc2Vjb25kcztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gdW5pdCAnICsgdW5pdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVE9ETzogVXNlIHRoaXMuYXMoJ21zJyk/XG4gICAgZnVuY3Rpb24gZHVyYXRpb25fYXNfX3ZhbHVlT2YgKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzICtcbiAgICAgICAgICAgIHRoaXMuX2RheXMgKiA4NjRlNSArXG4gICAgICAgICAgICAodGhpcy5fbW9udGhzICUgMTIpICogMjU5MmU2ICtcbiAgICAgICAgICAgIHRvSW50KHRoaXMuX21vbnRocyAvIDEyKSAqIDMxNTM2ZTZcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlQXMgKGFsaWFzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hcyhhbGlhcyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGFzTWlsbGlzZWNvbmRzID0gbWFrZUFzKCdtcycpO1xuICAgIHZhciBhc1NlY29uZHMgICAgICA9IG1ha2VBcygncycpO1xuICAgIHZhciBhc01pbnV0ZXMgICAgICA9IG1ha2VBcygnbScpO1xuICAgIHZhciBhc0hvdXJzICAgICAgICA9IG1ha2VBcygnaCcpO1xuICAgIHZhciBhc0RheXMgICAgICAgICA9IG1ha2VBcygnZCcpO1xuICAgIHZhciBhc1dlZWtzICAgICAgICA9IG1ha2VBcygndycpO1xuICAgIHZhciBhc01vbnRocyAgICAgICA9IG1ha2VBcygnTScpO1xuICAgIHZhciBhc1llYXJzICAgICAgICA9IG1ha2VBcygneScpO1xuXG4gICAgZnVuY3Rpb24gZHVyYXRpb25fZ2V0X19nZXQgKHVuaXRzKSB7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICByZXR1cm4gdGhpc1t1bml0cyArICdzJ10oKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlR2V0dGVyKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhW25hbWVdO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBkdXJhdGlvbl9nZXRfX21pbGxpc2Vjb25kcyA9IG1ha2VHZXR0ZXIoJ21pbGxpc2Vjb25kcycpO1xuICAgIHZhciBzZWNvbmRzICAgICAgPSBtYWtlR2V0dGVyKCdzZWNvbmRzJyk7XG4gICAgdmFyIG1pbnV0ZXMgICAgICA9IG1ha2VHZXR0ZXIoJ21pbnV0ZXMnKTtcbiAgICB2YXIgaG91cnMgICAgICAgID0gbWFrZUdldHRlcignaG91cnMnKTtcbiAgICB2YXIgZGF5cyAgICAgICAgID0gbWFrZUdldHRlcignZGF5cycpO1xuICAgIHZhciBtb250aHMgICAgICAgPSBtYWtlR2V0dGVyKCdtb250aHMnKTtcbiAgICB2YXIgeWVhcnMgICAgICAgID0gbWFrZUdldHRlcigneWVhcnMnKTtcblxuICAgIGZ1bmN0aW9uIHdlZWtzICgpIHtcbiAgICAgICAgcmV0dXJuIGFic0Zsb29yKHRoaXMuZGF5cygpIC8gNyk7XG4gICAgfVxuXG4gICAgdmFyIHJvdW5kID0gTWF0aC5yb3VuZDtcbiAgICB2YXIgdGhyZXNob2xkcyA9IHtcbiAgICAgICAgczogNDUsICAvLyBzZWNvbmRzIHRvIG1pbnV0ZVxuICAgICAgICBtOiA0NSwgIC8vIG1pbnV0ZXMgdG8gaG91clxuICAgICAgICBoOiAyMiwgIC8vIGhvdXJzIHRvIGRheVxuICAgICAgICBkOiAyNiwgIC8vIGRheXMgdG8gbW9udGhcbiAgICAgICAgTTogMTEgICAvLyBtb250aHMgdG8geWVhclxuICAgIH07XG5cbiAgICAvLyBoZWxwZXIgZnVuY3Rpb24gZm9yIG1vbWVudC5mbi5mcm9tLCBtb21lbnQuZm4uZnJvbU5vdywgYW5kIG1vbWVudC5kdXJhdGlvbi5mbi5odW1hbml6ZVxuICAgIGZ1bmN0aW9uIHN1YnN0aXR1dGVUaW1lQWdvKHN0cmluZywgbnVtYmVyLCB3aXRob3V0U3VmZml4LCBpc0Z1dHVyZSwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUucmVsYXRpdmVUaW1lKG51bWJlciB8fCAxLCAhIXdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2h1bWFuaXplX19yZWxhdGl2ZVRpbWUgKHBvc05lZ0R1cmF0aW9uLCB3aXRob3V0U3VmZml4LCBsb2NhbGUpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gY3JlYXRlX19jcmVhdGVEdXJhdGlvbihwb3NOZWdEdXJhdGlvbikuYWJzKCk7XG4gICAgICAgIHZhciBzZWNvbmRzICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdzJykpO1xuICAgICAgICB2YXIgbWludXRlcyAgPSByb3VuZChkdXJhdGlvbi5hcygnbScpKTtcbiAgICAgICAgdmFyIGhvdXJzICAgID0gcm91bmQoZHVyYXRpb24uYXMoJ2gnKSk7XG4gICAgICAgIHZhciBkYXlzICAgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdkJykpO1xuICAgICAgICB2YXIgbW9udGhzICAgPSByb3VuZChkdXJhdGlvbi5hcygnTScpKTtcbiAgICAgICAgdmFyIHllYXJzICAgID0gcm91bmQoZHVyYXRpb24uYXMoJ3knKSk7XG5cbiAgICAgICAgdmFyIGEgPSBzZWNvbmRzIDwgdGhyZXNob2xkcy5zICYmIFsncycsIHNlY29uZHNdICB8fFxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPT09IDEgICAgICAgICAgJiYgWydtJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICAgICAgbWludXRlcyA8IHRocmVzaG9sZHMubSAmJiBbJ21tJywgbWludXRlc10gfHxcbiAgICAgICAgICAgICAgICBob3VycyAgID09PSAxICAgICAgICAgICYmIFsnaCddICAgICAgICAgICB8fFxuICAgICAgICAgICAgICAgIGhvdXJzICAgPCB0aHJlc2hvbGRzLmggJiYgWydoaCcsIGhvdXJzXSAgIHx8XG4gICAgICAgICAgICAgICAgZGF5cyAgICA9PT0gMSAgICAgICAgICAmJiBbJ2QnXSAgICAgICAgICAgfHxcbiAgICAgICAgICAgICAgICBkYXlzICAgIDwgdGhyZXNob2xkcy5kICYmIFsnZGQnLCBkYXlzXSAgICB8fFxuICAgICAgICAgICAgICAgIG1vbnRocyAgPT09IDEgICAgICAgICAgJiYgWydNJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICAgICAgbW9udGhzICA8IHRocmVzaG9sZHMuTSAmJiBbJ01NJywgbW9udGhzXSAgfHxcbiAgICAgICAgICAgICAgICB5ZWFycyAgID09PSAxICAgICAgICAgICYmIFsneSddICAgICAgICAgICB8fCBbJ3l5JywgeWVhcnNdO1xuXG4gICAgICAgIGFbMl0gPSB3aXRob3V0U3VmZml4O1xuICAgICAgICBhWzNdID0gK3Bvc05lZ0R1cmF0aW9uID4gMDtcbiAgICAgICAgYVs0XSA9IGxvY2FsZTtcbiAgICAgICAgcmV0dXJuIHN1YnN0aXR1dGVUaW1lQWdvLmFwcGx5KG51bGwsIGEpO1xuICAgIH1cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gYWxsb3dzIHlvdSB0byBzZXQgYSB0aHJlc2hvbGQgZm9yIHJlbGF0aXZlIHRpbWUgc3RyaW5nc1xuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2h1bWFuaXplX19nZXRTZXRSZWxhdGl2ZVRpbWVUaHJlc2hvbGQgKHRocmVzaG9sZCwgbGltaXQpIHtcbiAgICAgICAgaWYgKHRocmVzaG9sZHNbdGhyZXNob2xkXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpbWl0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aHJlc2hvbGRzW3RocmVzaG9sZF07XG4gICAgICAgIH1cbiAgICAgICAgdGhyZXNob2xkc1t0aHJlc2hvbGRdID0gbGltaXQ7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGh1bWFuaXplICh3aXRoU3VmZml4KSB7XG4gICAgICAgIHZhciBsb2NhbGUgPSB0aGlzLmxvY2FsZURhdGEoKTtcbiAgICAgICAgdmFyIG91dHB1dCA9IGR1cmF0aW9uX2h1bWFuaXplX19yZWxhdGl2ZVRpbWUodGhpcywgIXdpdGhTdWZmaXgsIGxvY2FsZSk7XG5cbiAgICAgICAgaWYgKHdpdGhTdWZmaXgpIHtcbiAgICAgICAgICAgIG91dHB1dCA9IGxvY2FsZS5wYXN0RnV0dXJlKCt0aGlzLCBvdXRwdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxvY2FsZS5wb3N0Zm9ybWF0KG91dHB1dCk7XG4gICAgfVxuXG4gICAgdmFyIGlzb19zdHJpbmdfX2FicyA9IE1hdGguYWJzO1xuXG4gICAgZnVuY3Rpb24gaXNvX3N0cmluZ19fdG9JU09TdHJpbmcoKSB7XG4gICAgICAgIC8vIGluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9kb3JkaWxsZS9tb21lbnQtaXNvZHVyYXRpb24vYmxvYi9tYXN0ZXIvbW9tZW50Lmlzb2R1cmF0aW9uLmpzXG4gICAgICAgIHZhciBZID0gaXNvX3N0cmluZ19fYWJzKHRoaXMueWVhcnMoKSk7XG4gICAgICAgIHZhciBNID0gaXNvX3N0cmluZ19fYWJzKHRoaXMubW9udGhzKCkpO1xuICAgICAgICB2YXIgRCA9IGlzb19zdHJpbmdfX2Ficyh0aGlzLmRheXMoKSk7XG4gICAgICAgIHZhciBoID0gaXNvX3N0cmluZ19fYWJzKHRoaXMuaG91cnMoKSk7XG4gICAgICAgIHZhciBtID0gaXNvX3N0cmluZ19fYWJzKHRoaXMubWludXRlcygpKTtcbiAgICAgICAgdmFyIHMgPSBpc29fc3RyaW5nX19hYnModGhpcy5zZWNvbmRzKCkgKyB0aGlzLm1pbGxpc2Vjb25kcygpIC8gMTAwMCk7XG4gICAgICAgIHZhciB0b3RhbCA9IHRoaXMuYXNTZWNvbmRzKCk7XG5cbiAgICAgICAgaWYgKCF0b3RhbCkge1xuICAgICAgICAgICAgLy8gdGhpcyBpcyB0aGUgc2FtZSBhcyBDIydzIChOb2RhKSBhbmQgcHl0aG9uIChpc29kYXRlKS4uLlxuICAgICAgICAgICAgLy8gYnV0IG5vdCBvdGhlciBKUyAoZ29vZy5kYXRlKVxuICAgICAgICAgICAgcmV0dXJuICdQMEQnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICh0b3RhbCA8IDAgPyAnLScgOiAnJykgK1xuICAgICAgICAgICAgJ1AnICtcbiAgICAgICAgICAgIChZID8gWSArICdZJyA6ICcnKSArXG4gICAgICAgICAgICAoTSA/IE0gKyAnTScgOiAnJykgK1xuICAgICAgICAgICAgKEQgPyBEICsgJ0QnIDogJycpICtcbiAgICAgICAgICAgICgoaCB8fCBtIHx8IHMpID8gJ1QnIDogJycpICtcbiAgICAgICAgICAgIChoID8gaCArICdIJyA6ICcnKSArXG4gICAgICAgICAgICAobSA/IG0gKyAnTScgOiAnJykgK1xuICAgICAgICAgICAgKHMgPyBzICsgJ1MnIDogJycpO1xuICAgIH1cblxuICAgIHZhciBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvID0gRHVyYXRpb24ucHJvdG90eXBlO1xuXG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hYnMgICAgICAgICAgICA9IGR1cmF0aW9uX2Fic19fYWJzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYWRkICAgICAgICAgICAgPSBkdXJhdGlvbl9hZGRfc3VidHJhY3RfX2FkZDtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnN1YnRyYWN0ICAgICAgID0gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19zdWJ0cmFjdDtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzICAgICAgICAgICAgID0gYXM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc01pbGxpc2Vjb25kcyA9IGFzTWlsbGlzZWNvbmRzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNTZWNvbmRzICAgICAgPSBhc1NlY29uZHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc01pbnV0ZXMgICAgICA9IGFzTWludXRlcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzSG91cnMgICAgICAgID0gYXNIb3VycztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzRGF5cyAgICAgICAgID0gYXNEYXlzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNXZWVrcyAgICAgICAgPSBhc1dlZWtzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNNb250aHMgICAgICAgPSBhc01vbnRocztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzWWVhcnMgICAgICAgID0gYXNZZWFycztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnZhbHVlT2YgICAgICAgID0gZHVyYXRpb25fYXNfX3ZhbHVlT2Y7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5fYnViYmxlICAgICAgICA9IGJ1YmJsZTtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmdldCAgICAgICAgICAgID0gZHVyYXRpb25fZ2V0X19nZXQ7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5taWxsaXNlY29uZHMgICA9IGR1cmF0aW9uX2dldF9fbWlsbGlzZWNvbmRzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uc2Vjb25kcyAgICAgICAgPSBzZWNvbmRzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ubWludXRlcyAgICAgICAgPSBtaW51dGVzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uaG91cnMgICAgICAgICAgPSBob3VycztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmRheXMgICAgICAgICAgID0gZGF5cztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLndlZWtzICAgICAgICAgID0gd2Vla3M7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5tb250aHMgICAgICAgICA9IG1vbnRocztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnllYXJzICAgICAgICAgID0geWVhcnM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5odW1hbml6ZSAgICAgICA9IGh1bWFuaXplO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8udG9JU09TdHJpbmcgICAgPSBpc29fc3RyaW5nX190b0lTT1N0cmluZztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnRvU3RyaW5nICAgICAgID0gaXNvX3N0cmluZ19fdG9JU09TdHJpbmc7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by50b0pTT04gICAgICAgICA9IGlzb19zdHJpbmdfX3RvSVNPU3RyaW5nO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ubG9jYWxlICAgICAgICAgPSBsb2NhbGU7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5sb2NhbGVEYXRhICAgICA9IGxvY2FsZURhdGE7XG5cbiAgICAvLyBEZXByZWNhdGlvbnNcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnRvSXNvU3RyaW5nID0gZGVwcmVjYXRlKCd0b0lzb1N0cmluZygpIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgdG9JU09TdHJpbmcoKSBpbnN0ZWFkIChub3RpY2UgdGhlIGNhcGl0YWxzKScsIGlzb19zdHJpbmdfX3RvSVNPU3RyaW5nKTtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmxhbmcgPSBsYW5nO1xuXG4gICAgLy8gU2lkZSBlZmZlY3QgaW1wb3J0c1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1gnLCAwLCAwLCAndW5peCcpO1xuICAgIGFkZEZvcm1hdFRva2VuKCd4JywgMCwgMCwgJ3ZhbHVlT2YnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ3gnLCBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignWCcsIG1hdGNoVGltZXN0YW1wKTtcbiAgICBhZGRQYXJzZVRva2VuKCdYJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKHBhcnNlRmxvYXQoaW5wdXQsIDEwKSAqIDEwMDApO1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oJ3gnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUodG9JbnQoaW5wdXQpKTtcbiAgICB9KTtcblxuICAgIC8vIFNpZGUgZWZmZWN0IGltcG9ydHNcblxuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnZlcnNpb24gPSAnMi4xMC4zJztcblxuICAgIHNldEhvb2tDYWxsYmFjayhsb2NhbF9fY3JlYXRlTG9jYWwpO1xuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmZuICAgICAgICAgICAgICAgICAgICA9IG1vbWVudFByb3RvdHlwZTtcbiAgICB1dGlsc19ob29rc19faG9va3MubWluICAgICAgICAgICAgICAgICAgID0gbWluO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5tYXggICAgICAgICAgICAgICAgICAgPSBtYXg7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnV0YyAgICAgICAgICAgICAgICAgICA9IGNyZWF0ZV91dGNfX2NyZWF0ZVVUQztcbiAgICB1dGlsc19ob29rc19faG9va3MudW5peCAgICAgICAgICAgICAgICAgID0gbW9tZW50X19jcmVhdGVVbml4O1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5tb250aHMgICAgICAgICAgICAgICAgPSBsaXN0c19fbGlzdE1vbnRocztcbiAgICB1dGlsc19ob29rc19faG9va3MuaXNEYXRlICAgICAgICAgICAgICAgID0gaXNEYXRlO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5sb2NhbGUgICAgICAgICAgICAgICAgPSBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5pbnZhbGlkICAgICAgICAgICAgICAgPSB2YWxpZF9fY3JlYXRlSW52YWxpZDtcbiAgICB1dGlsc19ob29rc19faG9va3MuZHVyYXRpb24gICAgICAgICAgICAgID0gY3JlYXRlX19jcmVhdGVEdXJhdGlvbjtcbiAgICB1dGlsc19ob29rc19faG9va3MuaXNNb21lbnQgICAgICAgICAgICAgID0gaXNNb21lbnQ7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLndlZWtkYXlzICAgICAgICAgICAgICA9IGxpc3RzX19saXN0V2Vla2RheXM7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnBhcnNlWm9uZSAgICAgICAgICAgICA9IG1vbWVudF9fY3JlYXRlSW5ab25lO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5sb2NhbGVEYXRhICAgICAgICAgICAgPSBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5pc0R1cmF0aW9uICAgICAgICAgICAgPSBpc0R1cmF0aW9uO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5tb250aHNTaG9ydCAgICAgICAgICAgPSBsaXN0c19fbGlzdE1vbnRoc1Nob3J0O1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy53ZWVrZGF5c01pbiAgICAgICAgICAgPSBsaXN0c19fbGlzdFdlZWtkYXlzTWluO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5kZWZpbmVMb2NhbGUgICAgICAgICAgPSBkZWZpbmVMb2NhbGU7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLndlZWtkYXlzU2hvcnQgICAgICAgICA9IGxpc3RzX19saXN0V2Vla2RheXNTaG9ydDtcbiAgICB1dGlsc19ob29rc19faG9va3Mubm9ybWFsaXplVW5pdHMgICAgICAgID0gbm9ybWFsaXplVW5pdHM7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnJlbGF0aXZlVGltZVRocmVzaG9sZCA9IGR1cmF0aW9uX2h1bWFuaXplX19nZXRTZXRSZWxhdGl2ZVRpbWVUaHJlc2hvbGQ7XG5cbiAgICB2YXIgX21vbWVudCA9IHV0aWxzX2hvb2tzX19ob29rcztcblxuICAgIHJldHVybiBfbW9tZW50O1xuXG59KSk7IiwiICAvKiBnbG9iYWxzIHJlcXVpcmUsIG1vZHVsZSAqL1xuXG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAgICovXG5cbiAgdmFyIHBhdGh0b1JlZ2V4cCA9IHJlcXVpcmUoJ3BhdGgtdG8tcmVnZXhwJyk7XG5cbiAgLyoqXG4gICAqIE1vZHVsZSBleHBvcnRzLlxuICAgKi9cblxuICBtb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG5cbiAgLyoqXG4gICAqIERldGVjdCBjbGljayBldmVudFxuICAgKi9cbiAgdmFyIGNsaWNrRXZlbnQgPSBkb2N1bWVudC5vbnRvdWNoc3RhcnQgPyAndG91Y2hzdGFydCcgOiAnY2xpY2snO1xuXG4gIC8qKlxuICAgKiBUbyB3b3JrIHByb3Blcmx5IHdpdGggdGhlIFVSTFxuICAgKiBoaXN0b3J5LmxvY2F0aW9uIGdlbmVyYXRlZCBwb2x5ZmlsbCBpbiBodHRwczovL2dpdGh1Yi5jb20vZGV2b3RlL0hUTUw1LUhpc3RvcnktQVBJXG4gICAqL1xuXG4gIHZhciBsb2NhdGlvbiA9ICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIHdpbmRvdykgJiYgKHdpbmRvdy5oaXN0b3J5LmxvY2F0aW9uIHx8IHdpbmRvdy5sb2NhdGlvbik7XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gaW5pdGlhbCBkaXNwYXRjaC5cbiAgICovXG5cbiAgdmFyIGRpc3BhdGNoID0gdHJ1ZTtcblxuXG4gIC8qKlxuICAgKiBEZWNvZGUgVVJMIGNvbXBvbmVudHMgKHF1ZXJ5IHN0cmluZywgcGF0aG5hbWUsIGhhc2gpLlxuICAgKiBBY2NvbW1vZGF0ZXMgYm90aCByZWd1bGFyIHBlcmNlbnQgZW5jb2RpbmcgYW5kIHgtd3d3LWZvcm0tdXJsZW5jb2RlZCBmb3JtYXQuXG4gICAqL1xuICB2YXIgZGVjb2RlVVJMQ29tcG9uZW50cyA9IHRydWU7XG5cbiAgLyoqXG4gICAqIEJhc2UgcGF0aC5cbiAgICovXG5cbiAgdmFyIGJhc2UgPSAnJztcblxuICAvKipcbiAgICogUnVubmluZyBmbGFnLlxuICAgKi9cblxuICB2YXIgcnVubmluZztcblxuICAvKipcbiAgICogSGFzaEJhbmcgb3B0aW9uXG4gICAqL1xuXG4gIHZhciBoYXNoYmFuZyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBQcmV2aW91cyBjb250ZXh0LCBmb3IgY2FwdHVyaW5nXG4gICAqIHBhZ2UgZXhpdCBldmVudHMuXG4gICAqL1xuXG4gIHZhciBwcmV2Q29udGV4dDtcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYHBhdGhgIHdpdGggY2FsbGJhY2sgYGZuKClgLFxuICAgKiBvciByb3V0ZSBgcGF0aGAsIG9yIHJlZGlyZWN0aW9uLFxuICAgKiBvciBgcGFnZS5zdGFydCgpYC5cbiAgICpcbiAgICogICBwYWdlKGZuKTtcbiAgICogICBwYWdlKCcqJywgZm4pO1xuICAgKiAgIHBhZ2UoJy91c2VyLzppZCcsIGxvYWQsIHVzZXIpO1xuICAgKiAgIHBhZ2UoJy91c2VyLycgKyB1c2VyLmlkLCB7IHNvbWU6ICd0aGluZycgfSk7XG4gICAqICAgcGFnZSgnL3VzZXIvJyArIHVzZXIuaWQpO1xuICAgKiAgIHBhZ2UoJy9mcm9tJywgJy90bycpXG4gICAqICAgcGFnZSgpO1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gcGF0aFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbi4uLlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBmdW5jdGlvbiBwYWdlKHBhdGgsIGZuKSB7XG4gICAgLy8gPGNhbGxiYWNrPlxuICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgcGF0aCkge1xuICAgICAgcmV0dXJuIHBhZ2UoJyonLCBwYXRoKTtcbiAgICB9XG5cbiAgICAvLyByb3V0ZSA8cGF0aD4gdG8gPGNhbGxiYWNrIC4uLj5cbiAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGZuKSB7XG4gICAgICB2YXIgcm91dGUgPSBuZXcgUm91dGUocGF0aCk7XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICBwYWdlLmNhbGxiYWNrcy5wdXNoKHJvdXRlLm1pZGRsZXdhcmUoYXJndW1lbnRzW2ldKSk7XG4gICAgICB9XG4gICAgICAvLyBzaG93IDxwYXRoPiB3aXRoIFtzdGF0ZV1cbiAgICB9IGVsc2UgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgcGF0aCkge1xuICAgICAgcGFnZVsnc3RyaW5nJyA9PT0gdHlwZW9mIGZuID8gJ3JlZGlyZWN0JyA6ICdzaG93J10ocGF0aCwgZm4pO1xuICAgICAgLy8gc3RhcnQgW29wdGlvbnNdXG4gICAgfSBlbHNlIHtcbiAgICAgIHBhZ2Uuc3RhcnQocGF0aCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZ1bmN0aW9ucy5cbiAgICovXG5cbiAgcGFnZS5jYWxsYmFja3MgPSBbXTtcbiAgcGFnZS5leGl0cyA9IFtdO1xuXG4gIC8qKlxuICAgKiBDdXJyZW50IHBhdGggYmVpbmcgcHJvY2Vzc2VkXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBwYWdlLmN1cnJlbnQgPSAnJztcblxuICAvKipcbiAgICogTnVtYmVyIG9mIHBhZ2VzIG5hdmlnYXRlZCB0by5cbiAgICogQHR5cGUge251bWJlcn1cbiAgICpcbiAgICogICAgIHBhZ2UubGVuID09IDA7XG4gICAqICAgICBwYWdlKCcvbG9naW4nKTtcbiAgICogICAgIHBhZ2UubGVuID09IDE7XG4gICAqL1xuXG4gIHBhZ2UubGVuID0gMDtcblxuICAvKipcbiAgICogR2V0IG9yIHNldCBiYXNlcGF0aCB0byBgcGF0aGAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2UuYmFzZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICBpZiAoMCA9PT0gYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGJhc2U7XG4gICAgYmFzZSA9IHBhdGg7XG4gIH07XG5cbiAgLyoqXG4gICAqIEJpbmQgd2l0aCB0aGUgZ2l2ZW4gYG9wdGlvbnNgLlxuICAgKlxuICAgKiBPcHRpb25zOlxuICAgKlxuICAgKiAgICAtIGBjbGlja2AgYmluZCB0byBjbGljayBldmVudHMgW3RydWVdXG4gICAqICAgIC0gYHBvcHN0YXRlYCBiaW5kIHRvIHBvcHN0YXRlIFt0cnVlXVxuICAgKiAgICAtIGBkaXNwYXRjaGAgcGVyZm9ybSBpbml0aWFsIGRpc3BhdGNoIFt0cnVlXVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLnN0YXJ0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGlmIChydW5uaW5nKSByZXR1cm47XG4gICAgcnVubmluZyA9IHRydWU7XG4gICAgaWYgKGZhbHNlID09PSBvcHRpb25zLmRpc3BhdGNoKSBkaXNwYXRjaCA9IGZhbHNlO1xuICAgIGlmIChmYWxzZSA9PT0gb3B0aW9ucy5kZWNvZGVVUkxDb21wb25lbnRzKSBkZWNvZGVVUkxDb21wb25lbnRzID0gZmFsc2U7XG4gICAgaWYgKGZhbHNlICE9PSBvcHRpb25zLnBvcHN0YXRlKSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvbnBvcHN0YXRlLCBmYWxzZSk7XG4gICAgaWYgKGZhbHNlICE9PSBvcHRpb25zLmNsaWNrKSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihjbGlja0V2ZW50LCBvbmNsaWNrLCBmYWxzZSk7XG4gICAgfVxuICAgIGlmICh0cnVlID09PSBvcHRpb25zLmhhc2hiYW5nKSBoYXNoYmFuZyA9IHRydWU7XG4gICAgaWYgKCFkaXNwYXRjaCkgcmV0dXJuO1xuICAgIHZhciB1cmwgPSAoaGFzaGJhbmcgJiYgfmxvY2F0aW9uLmhhc2guaW5kZXhPZignIyEnKSkgPyBsb2NhdGlvbi5oYXNoLnN1YnN0cigyKSArIGxvY2F0aW9uLnNlYXJjaCA6IGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoICsgbG9jYXRpb24uaGFzaDtcbiAgICBwYWdlLnJlcGxhY2UodXJsLCBudWxsLCB0cnVlLCBkaXNwYXRjaCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFVuYmluZCBjbGljayBhbmQgcG9wc3RhdGUgZXZlbnQgaGFuZGxlcnMuXG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2Uuc3RvcCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghcnVubmluZykgcmV0dXJuO1xuICAgIHBhZ2UuY3VycmVudCA9ICcnO1xuICAgIHBhZ2UubGVuID0gMDtcbiAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoY2xpY2tFdmVudCwgb25jbGljaywgZmFsc2UpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIG9ucG9wc3RhdGUsIGZhbHNlKTtcbiAgfTtcblxuICAvKipcbiAgICogU2hvdyBgcGF0aGAgd2l0aCBvcHRpb25hbCBgc3RhdGVgIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gZGlzcGF0Y2hcbiAgICogQHJldHVybiB7Q29udGV4dH1cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5zaG93ID0gZnVuY3Rpb24ocGF0aCwgc3RhdGUsIGRpc3BhdGNoLCBwdXNoKSB7XG4gICAgdmFyIGN0eCA9IG5ldyBDb250ZXh0KHBhdGgsIHN0YXRlKTtcbiAgICBwYWdlLmN1cnJlbnQgPSBjdHgucGF0aDtcbiAgICBpZiAoZmFsc2UgIT09IGRpc3BhdGNoKSBwYWdlLmRpc3BhdGNoKGN0eCk7XG4gICAgaWYgKGZhbHNlICE9PSBjdHguaGFuZGxlZCAmJiBmYWxzZSAhPT0gcHVzaCkgY3R4LnB1c2hTdGF0ZSgpO1xuICAgIHJldHVybiBjdHg7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdvZXMgYmFjayBpbiB0aGUgaGlzdG9yeVxuICAgKiBCYWNrIHNob3VsZCBhbHdheXMgbGV0IHRoZSBjdXJyZW50IHJvdXRlIHB1c2ggc3RhdGUgYW5kIHRoZW4gZ28gYmFjay5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGggLSBmYWxsYmFjayBwYXRoIHRvIGdvIGJhY2sgaWYgbm8gbW9yZSBoaXN0b3J5IGV4aXN0cywgaWYgdW5kZWZpbmVkIGRlZmF1bHRzIHRvIHBhZ2UuYmFzZVxuICAgKiBAcGFyYW0ge09iamVjdH0gW3N0YXRlXVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLmJhY2sgPSBmdW5jdGlvbihwYXRoLCBzdGF0ZSkge1xuICAgIGlmIChwYWdlLmxlbiA+IDApIHtcbiAgICAgIC8vIHRoaXMgbWF5IG5lZWQgbW9yZSB0ZXN0aW5nIHRvIHNlZSBpZiBhbGwgYnJvd3NlcnNcbiAgICAgIC8vIHdhaXQgZm9yIHRoZSBuZXh0IHRpY2sgdG8gZ28gYmFjayBpbiBoaXN0b3J5XG4gICAgICBoaXN0b3J5LmJhY2soKTtcbiAgICAgIHBhZ2UubGVuLS07XG4gICAgfSBlbHNlIGlmIChwYXRoKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBwYWdlLnNob3cocGF0aCwgc3RhdGUpO1xuICAgICAgfSk7XG4gICAgfWVsc2V7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBwYWdlLnNob3coYmFzZSwgc3RhdGUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHJvdXRlIHRvIHJlZGlyZWN0IGZyb20gb25lIHBhdGggdG8gb3RoZXJcbiAgICogb3IganVzdCByZWRpcmVjdCB0byBhbm90aGVyIHJvdXRlXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBmcm9tIC0gaWYgcGFyYW0gJ3RvJyBpcyB1bmRlZmluZWQgcmVkaXJlY3RzIHRvICdmcm9tJ1xuICAgKiBAcGFyYW0ge1N0cmluZ30gW3RvXVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cbiAgcGFnZS5yZWRpcmVjdCA9IGZ1bmN0aW9uKGZyb20sIHRvKSB7XG4gICAgLy8gRGVmaW5lIHJvdXRlIGZyb20gYSBwYXRoIHRvIGFub3RoZXJcbiAgICBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBmcm9tICYmICdzdHJpbmcnID09PSB0eXBlb2YgdG8pIHtcbiAgICAgIHBhZ2UoZnJvbSwgZnVuY3Rpb24oZSkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHBhZ2UucmVwbGFjZSh0byk7XG4gICAgICAgIH0sIDApO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gV2FpdCBmb3IgdGhlIHB1c2ggc3RhdGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbm90aGVyXG4gICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgZnJvbSAmJiAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIHRvKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBwYWdlLnJlcGxhY2UoZnJvbSk7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYHBhdGhgIHdpdGggb3B0aW9uYWwgYHN0YXRlYCBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICAgKiBAcmV0dXJuIHtDb250ZXh0fVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuXG4gIHBhZ2UucmVwbGFjZSA9IGZ1bmN0aW9uKHBhdGgsIHN0YXRlLCBpbml0LCBkaXNwYXRjaCkge1xuICAgIHZhciBjdHggPSBuZXcgQ29udGV4dChwYXRoLCBzdGF0ZSk7XG4gICAgcGFnZS5jdXJyZW50ID0gY3R4LnBhdGg7XG4gICAgY3R4LmluaXQgPSBpbml0O1xuICAgIGN0eC5zYXZlKCk7IC8vIHNhdmUgYmVmb3JlIGRpc3BhdGNoaW5nLCB3aGljaCBtYXkgcmVkaXJlY3RcbiAgICBpZiAoZmFsc2UgIT09IGRpc3BhdGNoKSBwYWdlLmRpc3BhdGNoKGN0eCk7XG4gICAgcmV0dXJuIGN0eDtcbiAgfTtcblxuICAvKipcbiAgICogRGlzcGF0Y2ggdGhlIGdpdmVuIGBjdHhgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gY3R4XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBwYWdlLmRpc3BhdGNoID0gZnVuY3Rpb24oY3R4KSB7XG4gICAgdmFyIHByZXYgPSBwcmV2Q29udGV4dCxcbiAgICAgIGkgPSAwLFxuICAgICAgaiA9IDA7XG5cbiAgICBwcmV2Q29udGV4dCA9IGN0eDtcblxuICAgIGZ1bmN0aW9uIG5leHRFeGl0KCkge1xuICAgICAgdmFyIGZuID0gcGFnZS5leGl0c1tqKytdO1xuICAgICAgaWYgKCFmbikgcmV0dXJuIG5leHRFbnRlcigpO1xuICAgICAgZm4ocHJldiwgbmV4dEV4aXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5leHRFbnRlcigpIHtcbiAgICAgIHZhciBmbiA9IHBhZ2UuY2FsbGJhY2tzW2krK107XG5cbiAgICAgIGlmIChjdHgucGF0aCAhPT0gcGFnZS5jdXJyZW50KSB7XG4gICAgICAgIGN0eC5oYW5kbGVkID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghZm4pIHJldHVybiB1bmhhbmRsZWQoY3R4KTtcbiAgICAgIGZuKGN0eCwgbmV4dEVudGVyKTtcbiAgICB9XG5cbiAgICBpZiAocHJldikge1xuICAgICAgbmV4dEV4aXQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV4dEVudGVyKCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBVbmhhbmRsZWQgYGN0eGAuIFdoZW4gaXQncyBub3QgdGhlIGluaXRpYWxcbiAgICogcG9wc3RhdGUgdGhlbiByZWRpcmVjdC4gSWYgeW91IHdpc2ggdG8gaGFuZGxlXG4gICAqIDQwNHMgb24geW91ciBvd24gdXNlIGBwYWdlKCcqJywgY2FsbGJhY2spYC5cbiAgICpcbiAgICogQHBhcmFtIHtDb250ZXh0fSBjdHhcbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHVuaGFuZGxlZChjdHgpIHtcbiAgICBpZiAoY3R4LmhhbmRsZWQpIHJldHVybjtcbiAgICB2YXIgY3VycmVudDtcblxuICAgIGlmIChoYXNoYmFuZykge1xuICAgICAgY3VycmVudCA9IGJhc2UgKyBsb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMhJywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50ID0gbG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2g7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnQgPT09IGN0eC5jYW5vbmljYWxQYXRoKSByZXR1cm47XG4gICAgcGFnZS5zdG9wKCk7XG4gICAgY3R4LmhhbmRsZWQgPSBmYWxzZTtcbiAgICBsb2NhdGlvbi5ocmVmID0gY3R4LmNhbm9uaWNhbFBhdGg7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYW4gZXhpdCByb3V0ZSBvbiBgcGF0aGAgd2l0aFxuICAgKiBjYWxsYmFjayBgZm4oKWAsIHdoaWNoIHdpbGwgYmUgY2FsbGVkXG4gICAqIG9uIHRoZSBwcmV2aW91cyBjb250ZXh0IHdoZW4gYSBuZXdcbiAgICogcGFnZSBpcyB2aXNpdGVkLlxuICAgKi9cbiAgcGFnZS5leGl0ID0gZnVuY3Rpb24ocGF0aCwgZm4pIHtcbiAgICBpZiAodHlwZW9mIHBhdGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBwYWdlLmV4aXQoJyonLCBwYXRoKTtcbiAgICB9XG5cbiAgICB2YXIgcm91dGUgPSBuZXcgUm91dGUocGF0aCk7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHBhZ2UuZXhpdHMucHVzaChyb3V0ZS5taWRkbGV3YXJlKGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlIFVSTCBlbmNvZGluZyBmcm9tIHRoZSBnaXZlbiBgc3RyYC5cbiAgICogQWNjb21tb2RhdGVzIHdoaXRlc3BhY2UgaW4gYm90aCB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAgICogYW5kIHJlZ3VsYXIgcGVyY2VudC1lbmNvZGVkIGZvcm0uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyfSBVUkwgY29tcG9uZW50IHRvIGRlY29kZVxuICAgKi9cbiAgZnVuY3Rpb24gZGVjb2RlVVJMRW5jb2RlZFVSSUNvbXBvbmVudCh2YWwpIHtcbiAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ3N0cmluZycpIHsgcmV0dXJuIHZhbDsgfVxuICAgIHJldHVybiBkZWNvZGVVUkxDb21wb25lbnRzID8gZGVjb2RlVVJJQ29tcG9uZW50KHZhbC5yZXBsYWNlKC9cXCsvZywgJyAnKSkgOiB2YWw7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBhIG5ldyBcInJlcXVlc3RcIiBgQ29udGV4dGBcbiAgICogd2l0aCB0aGUgZ2l2ZW4gYHBhdGhgIGFuZCBvcHRpb25hbCBpbml0aWFsIGBzdGF0ZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBmdW5jdGlvbiBDb250ZXh0KHBhdGgsIHN0YXRlKSB7XG4gICAgaWYgKCcvJyA9PT0gcGF0aFswXSAmJiAwICE9PSBwYXRoLmluZGV4T2YoYmFzZSkpIHBhdGggPSBiYXNlICsgKGhhc2hiYW5nID8gJyMhJyA6ICcnKSArIHBhdGg7XG4gICAgdmFyIGkgPSBwYXRoLmluZGV4T2YoJz8nKTtcblxuICAgIHRoaXMuY2Fub25pY2FsUGF0aCA9IHBhdGg7XG4gICAgdGhpcy5wYXRoID0gcGF0aC5yZXBsYWNlKGJhc2UsICcnKSB8fCAnLyc7XG4gICAgaWYgKGhhc2hiYW5nKSB0aGlzLnBhdGggPSB0aGlzLnBhdGgucmVwbGFjZSgnIyEnLCAnJykgfHwgJy8nO1xuXG4gICAgdGhpcy50aXRsZSA9IGRvY3VtZW50LnRpdGxlO1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZSB8fCB7fTtcbiAgICB0aGlzLnN0YXRlLnBhdGggPSBwYXRoO1xuICAgIHRoaXMucXVlcnlzdHJpbmcgPSB+aSA/IGRlY29kZVVSTEVuY29kZWRVUklDb21wb25lbnQocGF0aC5zbGljZShpICsgMSkpIDogJyc7XG4gICAgdGhpcy5wYXRobmFtZSA9IGRlY29kZVVSTEVuY29kZWRVUklDb21wb25lbnQofmkgPyBwYXRoLnNsaWNlKDAsIGkpIDogcGF0aCk7XG4gICAgdGhpcy5wYXJhbXMgPSB7fTtcblxuICAgIC8vIGZyYWdtZW50XG4gICAgdGhpcy5oYXNoID0gJyc7XG4gICAgaWYgKCFoYXNoYmFuZykge1xuICAgICAgaWYgKCF+dGhpcy5wYXRoLmluZGV4T2YoJyMnKSkgcmV0dXJuO1xuICAgICAgdmFyIHBhcnRzID0gdGhpcy5wYXRoLnNwbGl0KCcjJyk7XG4gICAgICB0aGlzLnBhdGggPSBwYXJ0c1swXTtcbiAgICAgIHRoaXMuaGFzaCA9IGRlY29kZVVSTEVuY29kZWRVUklDb21wb25lbnQocGFydHNbMV0pIHx8ICcnO1xuICAgICAgdGhpcy5xdWVyeXN0cmluZyA9IHRoaXMucXVlcnlzdHJpbmcuc3BsaXQoJyMnKVswXTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRXhwb3NlIGBDb250ZXh0YC5cbiAgICovXG5cbiAgcGFnZS5Db250ZXh0ID0gQ29udGV4dDtcblxuICAvKipcbiAgICogUHVzaCBzdGF0ZS5cbiAgICpcbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIENvbnRleHQucHJvdG90eXBlLnB1c2hTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHBhZ2UubGVuKys7XG4gICAgaGlzdG9yeS5wdXNoU3RhdGUodGhpcy5zdGF0ZSwgdGhpcy50aXRsZSwgaGFzaGJhbmcgJiYgdGhpcy5wYXRoICE9PSAnLycgPyAnIyEnICsgdGhpcy5wYXRoIDogdGhpcy5jYW5vbmljYWxQYXRoKTtcbiAgfTtcblxuICAvKipcbiAgICogU2F2ZSB0aGUgY29udGV4dCBzdGF0ZS5cbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQ29udGV4dC5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKHRoaXMuc3RhdGUsIHRoaXMudGl0bGUsIGhhc2hiYW5nICYmIHRoaXMucGF0aCAhPT0gJy8nID8gJyMhJyArIHRoaXMucGF0aCA6IHRoaXMuY2Fub25pY2FsUGF0aCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgYFJvdXRlYCB3aXRoIHRoZSBnaXZlbiBIVFRQIGBwYXRoYCxcbiAgICogYW5kIGFuIGFycmF5IG9mIGBjYWxsYmFja3NgIGFuZCBgb3B0aW9uc2AuXG4gICAqXG4gICAqIE9wdGlvbnM6XG4gICAqXG4gICAqICAgLSBgc2Vuc2l0aXZlYCAgICBlbmFibGUgY2FzZS1zZW5zaXRpdmUgcm91dGVzXG4gICAqICAgLSBgc3RyaWN0YCAgICAgICBlbmFibGUgc3RyaWN0IG1hdGNoaW5nIGZvciB0cmFpbGluZyBzbGFzaGVzXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLlxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZnVuY3Rpb24gUm91dGUocGF0aCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHRoaXMucGF0aCA9IChwYXRoID09PSAnKicpID8gJyguKiknIDogcGF0aDtcbiAgICB0aGlzLm1ldGhvZCA9ICdHRVQnO1xuICAgIHRoaXMucmVnZXhwID0gcGF0aHRvUmVnZXhwKHRoaXMucGF0aCxcbiAgICAgIHRoaXMua2V5cyA9IFtdLFxuICAgICAgb3B0aW9ucy5zZW5zaXRpdmUsXG4gICAgICBvcHRpb25zLnN0cmljdCk7XG4gIH1cblxuICAvKipcbiAgICogRXhwb3NlIGBSb3V0ZWAuXG4gICAqL1xuXG4gIHBhZ2UuUm91dGUgPSBSb3V0ZTtcblxuICAvKipcbiAgICogUmV0dXJuIHJvdXRlIG1pZGRsZXdhcmUgd2l0aFxuICAgKiB0aGUgZ2l2ZW4gY2FsbGJhY2sgYGZuKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLm1pZGRsZXdhcmUgPSBmdW5jdGlvbihmbikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gZnVuY3Rpb24oY3R4LCBuZXh0KSB7XG4gICAgICBpZiAoc2VsZi5tYXRjaChjdHgucGF0aCwgY3R4LnBhcmFtcykpIHJldHVybiBmbihjdHgsIG5leHQpO1xuICAgICAgbmV4dCgpO1xuICAgIH07XG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoaXMgcm91dGUgbWF0Y2hlcyBgcGF0aGAsIGlmIHNvXG4gICAqIHBvcHVsYXRlIGBwYXJhbXNgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbihwYXRoLCBwYXJhbXMpIHtcbiAgICB2YXIga2V5cyA9IHRoaXMua2V5cyxcbiAgICAgIHFzSW5kZXggPSBwYXRoLmluZGV4T2YoJz8nKSxcbiAgICAgIHBhdGhuYW1lID0gfnFzSW5kZXggPyBwYXRoLnNsaWNlKDAsIHFzSW5kZXgpIDogcGF0aCxcbiAgICAgIG0gPSB0aGlzLnJlZ2V4cC5leGVjKGRlY29kZVVSSUNvbXBvbmVudChwYXRobmFtZSkpO1xuXG4gICAgaWYgKCFtKSByZXR1cm4gZmFsc2U7XG5cbiAgICBmb3IgKHZhciBpID0gMSwgbGVuID0gbS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgdmFyIGtleSA9IGtleXNbaSAtIDFdO1xuICAgICAgdmFyIHZhbCA9IGRlY29kZVVSTEVuY29kZWRVUklDb21wb25lbnQobVtpXSk7XG4gICAgICBpZiAodmFsICE9PSB1bmRlZmluZWQgfHwgIShoYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmFtcywga2V5Lm5hbWUpKSkge1xuICAgICAgICBwYXJhbXNba2V5Lm5hbWVdID0gdmFsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIEhhbmRsZSBcInBvcHVsYXRlXCIgZXZlbnRzLlxuICAgKi9cblxuICB2YXIgb25wb3BzdGF0ZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgLy8gdGhpcyBoYWNrIHJlc29sdmVzIGh0dHBzOi8vZ2l0aHViLmNvbS92aXNpb25tZWRpYS9wYWdlLmpzL2lzc3Vlcy8yMTNcbiAgICB2YXIgbG9hZGVkID0gZmFsc2U7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGxvYWRlZCA9IHRydWU7XG4gICAgICB9LCAwKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZnVuY3Rpb24gb25wb3BzdGF0ZShlKSB7XG4gICAgICBpZiAoIWxvYWRlZCkgcmV0dXJuO1xuICAgICAgaWYgKGUuc3RhdGUpIHtcbiAgICAgICAgdmFyIHBhdGggPSBlLnN0YXRlLnBhdGg7XG4gICAgICAgIHBhZ2UucmVwbGFjZShwYXRoLCBlLnN0YXRlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhZ2Uuc2hvdyhsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLmhhc2gsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSkoKTtcbiAgLyoqXG4gICAqIEhhbmRsZSBcImNsaWNrXCIgZXZlbnRzLlxuICAgKi9cblxuICBmdW5jdGlvbiBvbmNsaWNrKGUpIHtcblxuICAgIGlmICgxICE9PSB3aGljaChlKSkgcmV0dXJuO1xuXG4gICAgaWYgKGUubWV0YUtleSB8fCBlLmN0cmxLZXkgfHwgZS5zaGlmdEtleSkgcmV0dXJuO1xuICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcblxuXG5cbiAgICAvLyBlbnN1cmUgbGlua1xuICAgIHZhciBlbCA9IGUudGFyZ2V0O1xuICAgIHdoaWxlIChlbCAmJiAnQScgIT09IGVsLm5vZGVOYW1lKSBlbCA9IGVsLnBhcmVudE5vZGU7XG4gICAgaWYgKCFlbCB8fCAnQScgIT09IGVsLm5vZGVOYW1lKSByZXR1cm47XG5cblxuXG4gICAgLy8gSWdub3JlIGlmIHRhZyBoYXNcbiAgICAvLyAxLiBcImRvd25sb2FkXCIgYXR0cmlidXRlXG4gICAgLy8gMi4gcmVsPVwiZXh0ZXJuYWxcIiBhdHRyaWJ1dGVcbiAgICBpZiAoZWwuaGFzQXR0cmlidXRlKCdkb3dubG9hZCcpIHx8IGVsLmdldEF0dHJpYnV0ZSgncmVsJykgPT09ICdleHRlcm5hbCcpIHJldHVybjtcblxuICAgIC8vIGVuc3VyZSBub24taGFzaCBmb3IgdGhlIHNhbWUgcGF0aFxuICAgIHZhciBsaW5rID0gZWwuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgaWYgKCFoYXNoYmFuZyAmJiBlbC5wYXRobmFtZSA9PT0gbG9jYXRpb24ucGF0aG5hbWUgJiYgKGVsLmhhc2ggfHwgJyMnID09PSBsaW5rKSkgcmV0dXJuO1xuXG5cblxuICAgIC8vIENoZWNrIGZvciBtYWlsdG86IGluIHRoZSBocmVmXG4gICAgaWYgKGxpbmsgJiYgbGluay5pbmRleE9mKCdtYWlsdG86JykgPiAtMSkgcmV0dXJuO1xuXG4gICAgLy8gY2hlY2sgdGFyZ2V0XG4gICAgaWYgKGVsLnRhcmdldCkgcmV0dXJuO1xuXG4gICAgLy8geC1vcmlnaW5cbiAgICBpZiAoIXNhbWVPcmlnaW4oZWwuaHJlZikpIHJldHVybjtcblxuXG5cbiAgICAvLyByZWJ1aWxkIHBhdGhcbiAgICB2YXIgcGF0aCA9IGVsLnBhdGhuYW1lICsgZWwuc2VhcmNoICsgKGVsLmhhc2ggfHwgJycpO1xuXG4gICAgLy8gc3RyaXAgbGVhZGluZyBcIi9bZHJpdmUgbGV0dGVyXTpcIiBvbiBOVy5qcyBvbiBXaW5kb3dzXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwYXRoLm1hdGNoKC9eXFwvW2EtekEtWl06XFwvLykpIHtcbiAgICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoL15cXC9bYS16QS1aXTpcXC8vLCAnLycpO1xuICAgIH1cblxuICAgIC8vIHNhbWUgcGFnZVxuICAgIHZhciBvcmlnID0gcGF0aDtcblxuICAgIGlmIChwYXRoLmluZGV4T2YoYmFzZSkgPT09IDApIHtcbiAgICAgIHBhdGggPSBwYXRoLnN1YnN0cihiYXNlLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgaWYgKGhhc2hiYW5nKSBwYXRoID0gcGF0aC5yZXBsYWNlKCcjIScsICcnKTtcblxuICAgIGlmIChiYXNlICYmIG9yaWcgPT09IHBhdGgpIHJldHVybjtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBwYWdlLnNob3cob3JpZyk7XG4gIH1cblxuICAvKipcbiAgICogRXZlbnQgYnV0dG9uLlxuICAgKi9cblxuICBmdW5jdGlvbiB3aGljaChlKSB7XG4gICAgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xuICAgIHJldHVybiBudWxsID09PSBlLndoaWNoID8gZS5idXR0b24gOiBlLndoaWNoO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGBocmVmYCBpcyB0aGUgc2FtZSBvcmlnaW4uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHNhbWVPcmlnaW4oaHJlZikge1xuICAgIHZhciBvcmlnaW4gPSBsb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyBsb2NhdGlvbi5ob3N0bmFtZTtcbiAgICBpZiAobG9jYXRpb24ucG9ydCkgb3JpZ2luICs9ICc6JyArIGxvY2F0aW9uLnBvcnQ7XG4gICAgcmV0dXJuIChocmVmICYmICgwID09PSBocmVmLmluZGV4T2Yob3JpZ2luKSkpO1xuICB9XG5cbiAgcGFnZS5zYW1lT3JpZ2luID0gc2FtZU9yaWdpbjtcbiIsInZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpO1xuXG4vKipcbiAqIEV4cG9zZSBgcGF0aFRvUmVnZXhwYC5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBwYXRoVG9SZWdleHA7XG5cbi8qKlxuICogVGhlIG1haW4gcGF0aCBtYXRjaGluZyByZWdleHAgdXRpbGl0eS5cbiAqXG4gKiBAdHlwZSB7UmVnRXhwfVxuICovXG52YXIgUEFUSF9SRUdFWFAgPSBuZXcgUmVnRXhwKFtcbiAgLy8gTWF0Y2ggZXNjYXBlZCBjaGFyYWN0ZXJzIHRoYXQgd291bGQgb3RoZXJ3aXNlIGFwcGVhciBpbiBmdXR1cmUgbWF0Y2hlcy5cbiAgLy8gVGhpcyBhbGxvd3MgdGhlIHVzZXIgdG8gZXNjYXBlIHNwZWNpYWwgY2hhcmFjdGVycyB0aGF0IHdvbid0IHRyYW5zZm9ybS5cbiAgJyhcXFxcXFxcXC4pJyxcbiAgLy8gTWF0Y2ggRXhwcmVzcy1zdHlsZSBwYXJhbWV0ZXJzIGFuZCB1bi1uYW1lZCBwYXJhbWV0ZXJzIHdpdGggYSBwcmVmaXhcbiAgLy8gYW5kIG9wdGlvbmFsIHN1ZmZpeGVzLiBNYXRjaGVzIGFwcGVhciBhczpcbiAgLy9cbiAgLy8gXCIvOnRlc3QoXFxcXGQrKT9cIiA9PiBbXCIvXCIsIFwidGVzdFwiLCBcIlxcZCtcIiwgdW5kZWZpbmVkLCBcIj9cIl1cbiAgLy8gXCIvcm91dGUoXFxcXGQrKVwiID0+IFt1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBcIlxcZCtcIiwgdW5kZWZpbmVkXVxuICAnKFtcXFxcLy5dKT8oPzpcXFxcOihcXFxcdyspKD86XFxcXCgoKD86XFxcXFxcXFwufFteKV0pKilcXFxcKSk/fFxcXFwoKCg/OlxcXFxcXFxcLnxbXildKSopXFxcXCkpKFsrKj9dKT8nLFxuICAvLyBNYXRjaCByZWdleHAgc3BlY2lhbCBjaGFyYWN0ZXJzIHRoYXQgYXJlIGFsd2F5cyBlc2NhcGVkLlxuICAnKFsuKyo/PV4hOiR7fSgpW1xcXFxdfFxcXFwvXSknXG5dLmpvaW4oJ3wnKSwgJ2cnKTtcblxuLyoqXG4gKiBFc2NhcGUgdGhlIGNhcHR1cmluZyBncm91cCBieSBlc2NhcGluZyBzcGVjaWFsIGNoYXJhY3RlcnMgYW5kIG1lYW5pbmcuXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBncm91cFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBlc2NhcGVHcm91cCAoZ3JvdXApIHtcbiAgcmV0dXJuIGdyb3VwLnJlcGxhY2UoLyhbPSE6JFxcLygpXSkvZywgJ1xcXFwkMScpO1xufVxuXG4vKipcbiAqIEF0dGFjaCB0aGUga2V5cyBhcyBhIHByb3BlcnR5IG9mIHRoZSByZWdleHAuXG4gKlxuICogQHBhcmFtICB7UmVnRXhwfSByZVxuICogQHBhcmFtICB7QXJyYXl9ICBrZXlzXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKi9cbmZ1bmN0aW9uIGF0dGFjaEtleXMgKHJlLCBrZXlzKSB7XG4gIHJlLmtleXMgPSBrZXlzO1xuICByZXR1cm4gcmU7XG59XG5cbi8qKlxuICogR2V0IHRoZSBmbGFncyBmb3IgYSByZWdleHAgZnJvbSB0aGUgb3B0aW9ucy5cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZmxhZ3MgKG9wdGlvbnMpIHtcbiAgcmV0dXJuIG9wdGlvbnMuc2Vuc2l0aXZlID8gJycgOiAnaSc7XG59XG5cbi8qKlxuICogUHVsbCBvdXQga2V5cyBmcm9tIGEgcmVnZXhwLlxuICpcbiAqIEBwYXJhbSAge1JlZ0V4cH0gcGF0aFxuICogQHBhcmFtICB7QXJyYXl9ICBrZXlzXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKi9cbmZ1bmN0aW9uIHJlZ2V4cFRvUmVnZXhwIChwYXRoLCBrZXlzKSB7XG4gIC8vIFVzZSBhIG5lZ2F0aXZlIGxvb2thaGVhZCB0byBtYXRjaCBvbmx5IGNhcHR1cmluZyBncm91cHMuXG4gIHZhciBncm91cHMgPSBwYXRoLnNvdXJjZS5tYXRjaCgvXFwoKD8hXFw/KS9nKTtcblxuICBpZiAoZ3JvdXBzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBncm91cHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleXMucHVzaCh7XG4gICAgICAgIG5hbWU6ICAgICAgaSxcbiAgICAgICAgZGVsaW1pdGVyOiBudWxsLFxuICAgICAgICBvcHRpb25hbDogIGZhbHNlLFxuICAgICAgICByZXBlYXQ6ICAgIGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXR0YWNoS2V5cyhwYXRoLCBrZXlzKTtcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm0gYW4gYXJyYXkgaW50byBhIHJlZ2V4cC5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gIHBhdGhcbiAqIEBwYXJhbSAge0FycmF5fSAga2V5c1xuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKi9cbmZ1bmN0aW9uIGFycmF5VG9SZWdleHAgKHBhdGgsIGtleXMsIG9wdGlvbnMpIHtcbiAgdmFyIHBhcnRzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgcGFydHMucHVzaChwYXRoVG9SZWdleHAocGF0aFtpXSwga2V5cywgb3B0aW9ucykuc291cmNlKTtcbiAgfVxuXG4gIHZhciByZWdleHAgPSBuZXcgUmVnRXhwKCcoPzonICsgcGFydHMuam9pbignfCcpICsgJyknLCBmbGFncyhvcHRpb25zKSk7XG4gIHJldHVybiBhdHRhY2hLZXlzKHJlZ2V4cCwga2V5cyk7XG59XG5cbi8qKlxuICogUmVwbGFjZSB0aGUgc3BlY2lmaWMgdGFncyB3aXRoIHJlZ2V4cCBzdHJpbmdzLlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gcGF0aFxuICogQHBhcmFtICB7QXJyYXl9ICBrZXlzXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHJlcGxhY2VQYXRoIChwYXRoLCBrZXlzKSB7XG4gIHZhciBpbmRleCA9IDA7XG5cbiAgZnVuY3Rpb24gcmVwbGFjZSAoXywgZXNjYXBlZCwgcHJlZml4LCBrZXksIGNhcHR1cmUsIGdyb3VwLCBzdWZmaXgsIGVzY2FwZSkge1xuICAgIGlmIChlc2NhcGVkKSB7XG4gICAgICByZXR1cm4gZXNjYXBlZDtcbiAgICB9XG5cbiAgICBpZiAoZXNjYXBlKSB7XG4gICAgICByZXR1cm4gJ1xcXFwnICsgZXNjYXBlO1xuICAgIH1cblxuICAgIHZhciByZXBlYXQgICA9IHN1ZmZpeCA9PT0gJysnIHx8IHN1ZmZpeCA9PT0gJyonO1xuICAgIHZhciBvcHRpb25hbCA9IHN1ZmZpeCA9PT0gJz8nIHx8IHN1ZmZpeCA9PT0gJyonO1xuXG4gICAga2V5cy5wdXNoKHtcbiAgICAgIG5hbWU6ICAgICAga2V5IHx8IGluZGV4KyssXG4gICAgICBkZWxpbWl0ZXI6IHByZWZpeCB8fCAnLycsXG4gICAgICBvcHRpb25hbDogIG9wdGlvbmFsLFxuICAgICAgcmVwZWF0OiAgICByZXBlYXRcbiAgICB9KTtcblxuICAgIHByZWZpeCA9IHByZWZpeCA/ICgnXFxcXCcgKyBwcmVmaXgpIDogJyc7XG4gICAgY2FwdHVyZSA9IGVzY2FwZUdyb3VwKGNhcHR1cmUgfHwgZ3JvdXAgfHwgJ1teJyArIChwcmVmaXggfHwgJ1xcXFwvJykgKyAnXSs/Jyk7XG5cbiAgICBpZiAocmVwZWF0KSB7XG4gICAgICBjYXB0dXJlID0gY2FwdHVyZSArICcoPzonICsgcHJlZml4ICsgY2FwdHVyZSArICcpKic7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbmFsKSB7XG4gICAgICByZXR1cm4gJyg/OicgKyBwcmVmaXggKyAnKCcgKyBjYXB0dXJlICsgJykpPyc7XG4gICAgfVxuXG4gICAgLy8gQmFzaWMgcGFyYW1ldGVyIHN1cHBvcnQuXG4gICAgcmV0dXJuIHByZWZpeCArICcoJyArIGNhcHR1cmUgKyAnKSc7XG4gIH1cblxuICByZXR1cm4gcGF0aC5yZXBsYWNlKFBBVEhfUkVHRVhQLCByZXBsYWNlKTtcbn1cblxuLyoqXG4gKiBOb3JtYWxpemUgdGhlIGdpdmVuIHBhdGggc3RyaW5nLCByZXR1cm5pbmcgYSByZWd1bGFyIGV4cHJlc3Npb24uXG4gKlxuICogQW4gZW1wdHkgYXJyYXkgY2FuIGJlIHBhc3NlZCBpbiBmb3IgdGhlIGtleXMsIHdoaWNoIHdpbGwgaG9sZCB0aGVcbiAqIHBsYWNlaG9sZGVyIGtleSBkZXNjcmlwdGlvbnMuIEZvciBleGFtcGxlLCB1c2luZyBgL3VzZXIvOmlkYCwgYGtleXNgIHdpbGxcbiAqIGNvbnRhaW4gYFt7IG5hbWU6ICdpZCcsIGRlbGltaXRlcjogJy8nLCBvcHRpb25hbDogZmFsc2UsIHJlcGVhdDogZmFsc2UgfV1gLlxuICpcbiAqIEBwYXJhbSAgeyhTdHJpbmd8UmVnRXhwfEFycmF5KX0gcGF0aFxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgICAgICAgICAgICBba2V5c11cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICAgICAgICAgW29wdGlvbnNdXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKi9cbmZ1bmN0aW9uIHBhdGhUb1JlZ2V4cCAocGF0aCwga2V5cywgb3B0aW9ucykge1xuICBrZXlzID0ga2V5cyB8fCBbXTtcblxuICBpZiAoIWlzQXJyYXkoa2V5cykpIHtcbiAgICBvcHRpb25zID0ga2V5cztcbiAgICBrZXlzID0gW107XG4gIH0gZWxzZSBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICBpZiAocGF0aCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgIHJldHVybiByZWdleHBUb1JlZ2V4cChwYXRoLCBrZXlzLCBvcHRpb25zKTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KHBhdGgpKSB7XG4gICAgcmV0dXJuIGFycmF5VG9SZWdleHAocGF0aCwga2V5cywgb3B0aW9ucyk7XG4gIH1cblxuICB2YXIgc3RyaWN0ID0gb3B0aW9ucy5zdHJpY3Q7XG4gIHZhciBlbmQgPSBvcHRpb25zLmVuZCAhPT0gZmFsc2U7XG4gIHZhciByb3V0ZSA9IHJlcGxhY2VQYXRoKHBhdGgsIGtleXMpO1xuICB2YXIgZW5kc1dpdGhTbGFzaCA9IHBhdGguY2hhckF0KHBhdGgubGVuZ3RoIC0gMSkgPT09ICcvJztcblxuICAvLyBJbiBub24tc3RyaWN0IG1vZGUgd2UgYWxsb3cgYSBzbGFzaCBhdCB0aGUgZW5kIG9mIG1hdGNoLiBJZiB0aGUgcGF0aCB0b1xuICAvLyBtYXRjaCBhbHJlYWR5IGVuZHMgd2l0aCBhIHNsYXNoLCB3ZSByZW1vdmUgaXQgZm9yIGNvbnNpc3RlbmN5LiBUaGUgc2xhc2hcbiAgLy8gaXMgdmFsaWQgYXQgdGhlIGVuZCBvZiBhIHBhdGggbWF0Y2gsIG5vdCBpbiB0aGUgbWlkZGxlLiBUaGlzIGlzIGltcG9ydGFudFxuICAvLyBpbiBub24tZW5kaW5nIG1vZGUsIHdoZXJlIFwiL3Rlc3QvXCIgc2hvdWxkbid0IG1hdGNoIFwiL3Rlc3QvL3JvdXRlXCIuXG4gIGlmICghc3RyaWN0KSB7XG4gICAgcm91dGUgPSAoZW5kc1dpdGhTbGFzaCA/IHJvdXRlLnNsaWNlKDAsIC0yKSA6IHJvdXRlKSArICcoPzpcXFxcLyg/PSQpKT8nO1xuICB9XG5cbiAgaWYgKGVuZCkge1xuICAgIHJvdXRlICs9ICckJztcbiAgfSBlbHNlIHtcbiAgICAvLyBJbiBub24tZW5kaW5nIG1vZGUsIHdlIG5lZWQgdGhlIGNhcHR1cmluZyBncm91cHMgdG8gbWF0Y2ggYXMgbXVjaCBhc1xuICAgIC8vIHBvc3NpYmxlIGJ5IHVzaW5nIGEgcG9zaXRpdmUgbG9va2FoZWFkIHRvIHRoZSBlbmQgb3IgbmV4dCBwYXRoIHNlZ21lbnQuXG4gICAgcm91dGUgKz0gc3RyaWN0ICYmIGVuZHNXaXRoU2xhc2ggPyAnJyA6ICcoPz1cXFxcL3wkKSc7XG4gIH1cblxuICByZXR1cm4gYXR0YWNoS2V5cyhuZXcgUmVnRXhwKCdeJyArIHJvdXRlLCBmbGFncyhvcHRpb25zKSksIGtleXMpO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiaW1wb3J0IHBhZ2UgZnJvbSAncGFnZSc7XG5pbXBvcnQge0ZpbGVOb3RGb3VuZFBhZ2V9IGZyb20gXCJwYWdlcy9GaWxlTm90Rm91bmRQYWdlLmpzeFwiO1xuXG5leHBvcnQgY2xhc3MgUm91dGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihtb3VudFBvaW50SWQpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXMgPSB7fTtcblxuICAgICAgICB3aW5kb3cuYXBwLm1vdW50UG9pbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChtb3VudFBvaW50SWQpO1xuICAgICAgICB0aGlzLm1vdW50UG9pbnQgPSB3aW5kb3cuYXBwLm1vdW50UG9pbnQ7XG4gICAgfVxuXG4gICAgYWRkUm91dGUocm91dGUsIGNvbnRyb2xsZXIpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXNbcm91dGVdID0gY29udHJvbGxlcjtcbiAgICB9XG5cbiAgICBzdGFydCgpIHtcblxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuXG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5yb3V0ZXMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBhZ2UoaSwgdGhpcy5yb3V0ZXNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFnZShcIipcIiwgZnVuY3Rpb24oY3R4LCBuZXh0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiNDA0XCIsIGN0eCwgbmV4dCk7XG4gICAgICAgICAgICBSZWFjdC5yZW5kZXIoPEZpbGVOb3RGb3VuZFBhZ2UgLz4sIHdpbmRvdy5hcHAubW91bnRQb2ludCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBhZ2UoKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQXBwU2V0dGluZ3NNb2RhbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlci5jb25zdHJ1Y3Rvcihwcm9wcyk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIHNhdmVTZXR0aW5nc0luUHJvZ3Jlc3M6IGZhbHNlLFxuICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgZ2VuZGVyOiBcIm90aGVyXCIsXG4gICAgICAgICAgICBhZ2U6IDBcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcblxuICAgICAgICAkKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpKS5vbihcInNob3duLmJzLm1vZGFsXCIsIHRoaXMuc2hvd24uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgc2hvd24oZSkge1xuICAgICAgICAkLmdldChcIi9hcGkvc2V0dGluZ3NcIiwgZnVuY3Rpb24ocmVzdWx0KSB7XG5cbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyAhPSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZ2VuZGVyOiByZXN1bHQuZ2VuZGVyLFxuICAgICAgICAgICAgICAgICAgICB3ZWlnaHQ6IHJlc3VsdC53ZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogcmVzdWx0LmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgYWdlOiByZXN1bHQuYWdlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBiZWdpblNhdmVTZXR0aW5ncygpIHtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtzYXZlU2V0dGluZ3NJblByb2dyZXNzOiB0cnVlfSk7XG5cbiAgICAgICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgICAgICAgIHdlaWdodDogdGhpcy5zdGF0ZS53ZWlnaHQsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUuaGVpZ2h0LFxuICAgICAgICAgICAgYWdlOiB0aGlzLnN0YXRlLmFnZSxcbiAgICAgICAgICAgIGdlbmRlcjogdGhpcy5zdGF0ZS5nZW5kZXJcbiAgICAgICAgfTtcblxuICAgICAgICAkLnBvc3QoXCIvYXBpL3VwZGF0ZV9zZXR0aW5nc1wiLCBwYXJhbXMsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcblxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c2F2ZVNldHRpbmdzSW5Qcm9ncmVzczogZmFsc2V9KTtcblxuICAgICAgICAgICAgJChSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSkubW9kYWwoXCJoaWRlXCIpO1xuXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgLy8ga2dcbiAgICB3ZWlnaHRDaGFuZ2VkKGUpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7d2VpZ2h0OiBwYXJzZUludChlLnRhcmdldC52YWx1ZSl9KTtcbiAgICB9XG5cbiAgICAvLyBjbVxuICAgIGhlaWdodENoYW5nZWQoZSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtoZWlnaHQ6IHBhcnNlSW50KGUudGFyZ2V0LnZhbHVlKX0pO1xuICAgIH1cblxuICAgIC8vIHN0cmluZ1xuICAgIGdlbmRlckNoYW5nZWQoZSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtnZW5kZXI6IGUudGFyZ2V0LnZhbHVlfSk7XG4gICAgfVxuXG4gICAgLy8geWVhcnNcbiAgICBhZ2VDaGFuZ2VkKGUpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7YWdlOiBwYXJzZUludChlLnRhcmdldC52YWx1ZSl9KTtcbiAgICB9XG5cbiAgICBnZXRGb3JtKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yTmFtZT1cIndlaWdodFwiPldlaWdodCAoa2cpPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cIndlaWdodFwiIHZhbHVlPXt0aGlzLnN0YXRlLndlaWdodH0gdHlwZT1cIm51bWJlclwiIG9uQ2hhbmdlPXt0aGlzLndlaWdodENoYW5nZWQuYmluZCh0aGlzKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCI+PC9pbnB1dD5cblxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3JOYW1lPVwiaGVpZ2h0XCI+SGVpZ2h0IChjbSk8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwiaGVpZ2h0XCIgdmFsdWU9e3RoaXMuc3RhdGUuaGVpZ2h0fSB0eXBlPVwibnVtYmVyXCIgb25DaGFuZ2U9e3RoaXMuaGVpZ2h0Q2hhbmdlZC5iaW5kKHRoaXMpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIj48L2lucHV0PlxuXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvck5hbWU9XCJhZ2VcIj5BZ2UgKHllYXJzKTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJhZ2VcIiB2YWx1ZT17dGhpcy5zdGF0ZS5hZ2V9IHR5cGU9XCJudW1iZXJcIiBvbkNoYW5nZT17dGhpcy5hZ2VDaGFuZ2VkLmJpbmQodGhpcyl9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiPjwvaW5wdXQ+XG5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yTmFtZT1cImdlbmRlclwiPkdlbmRlcjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiB2YWx1ZT17dGhpcy5zdGF0ZS5nZW5kZXJ9IG9uQ2hhbmdlPXt0aGlzLmdlbmRlckNoYW5nZWQuYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJtYWxlXCI+TWFsZTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZmVtYWxlXCI+RmVtYWxlPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJvdGhlclwiPk90aGVyPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG5cbiAgICAgICAgdmFyIGJlZm9yZUltcG9ydEJvZHkgPSBbXG4gICAgICAgICAgICA8cD5QbGVhc2UgY29uZmlndXJlIHRoZSBhcHBsaWNhdGlvbiBzZXR0aW5ncywgdGhpcyBpbmZvcm1hdGlvbiBpcyB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUga2lsb2pvdWxlcyB5b3UgYnVybiBvbiBlYWNoIHJ1bi48L3A+LFxuICAgICAgICAgICAgdGhpcy5nZXRGb3JtKClcbiAgICAgICAgXTtcblxuICAgICAgICB2YXIgYm9keSA9IGJlZm9yZUltcG9ydEJvZHk7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwgZmFkZVwiIGlkPVwic2V0dGluZ3NfbW9kYWxcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWRpYWxvZ1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cIm1vZGFsLXRpdGxlXCI+PGkgY2xhc3NOYW1lPVwiaW9uIGlvbi1nZWFyLWFcIj48L2k+IEFwcGxpY2F0aW9uIFNldHRpbmdzPC9oND5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2JvZHl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIG9uQ2xpY2s9e3RoaXMuYmVnaW5TYXZlU2V0dGluZ3MuYmluZCh0aGlzKX0gZGlzYWJsZWQ9e3RoaXMuc3RhdGUuc2F2ZVNldHRpbmdzSW5Qcm9ncmVzc30+U2F2ZTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwidmFyIENoYXJ0SnMgPSByZXF1aXJlKFwiY2hhcnQuanNcIik7XG5cbmV4cG9ydCBjbGFzcyBCYXJDaGFydCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICBjcmVhdGVDaGFydCgpIHtcbiAgICAgICAgdmFyIGNvbnRleHQgPSAkKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpKS5maW5kKFwiLmNoYXJ0XCIpWzBdLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgdGhpcy5jaGFydCA9IG5ldyBDaGFydEpzKGNvbnRleHQpLkJhcih0aGlzLnByb3BzLmRhdGEsIHRoaXMucHJvcHMub3B0cyk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlQ2hhcnQoKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVXBkYXRlKCkge1xuICAgICAgICB0aGlzLmNoYXJ0LmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5jcmVhdGVDaGFydCgpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGNhbnZhcyBjbGFzc05hbWU9XCJjaGFydFwiIHdpZHRoPVwiNDAwXCIgaGVpZ2h0PVwiMjAwXCI+PC9jYW52YXM+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQm9keSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIEhlbGxvIHRoZXJlIVxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIvZGFzaGJvYXJkXCI+RGFzaGJvYXJkPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEltcG9ydERhdGFNb2RhbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlci5jb25zdHJ1Y3Rvcihwcm9wcyk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGltcG9ydEZhaWxlZDogZmFsc2UsXG4gICAgICAgICAgICBpbXBvcnRJblByb2dyZXNzOiBmYWxzZSxcbiAgICAgICAgICAgIGF0dGVtcHRlZEltcG9ydDogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwYXNzd29yZENoYW5nZShlKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgcGFzc3dvcmQ6IGUudGFyZ2V0LnZhbHVlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGJlZ2luRGF0YUltcG9ydCgpIHtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtpbXBvcnRJblByb2dyZXNzOiB0cnVlLCBhdHRlbXB0ZWRJbXBvcnQ6IHRydWV9KTtcblxuICAgICAgICAkLnBvc3QoXCIvYXBpL2ltcG9ydF9kYXRhXCIsIHtwYXNzd29yZDogdGhpcy5zdGF0ZS5wYXNzd29yZH0sIGZ1bmN0aW9uKHJlc3VsdCkge1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aW1wb3J0RmFpbGVkOiBmYWxzZX0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgaW1wb3J0RmFpbGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6IHJlc3VsdC5lcnJvclxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtpbXBvcnRJblByb2dyZXNzOiBmYWxzZX0pO1xuXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuXG4gICAgICAgIHZhciBiZWZvcmVJbXBvcnRCb2R5ID0gW1xuICAgICAgICAgICAgPHA+RW50ZXIgeW91ciBwYXNzd29yZCB0byBpbXBvcnQgeW91ciBydW4gZGF0YTwvcD4sXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yTmFtZT1cInBhc3N3b3JkXCI+UGFzc3dvcmQ8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwicGFzc3dvcmRcIiB2YWx1ZT17dGhpcy5zdGF0ZS5wYXNzd29yZH0gb25DaGFuZ2U9e3RoaXMucGFzc3dvcmRDaGFuZ2UuYmluZCh0aGlzKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInBhc3N3b3JkXCI+PC9pbnB1dD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBdO1xuXG4gICAgICAgIHZhciBmYWlsZWRJbXBvcnRCb2R5ID0gW1xuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhbGVydCBhbGVydC1kYW5nZXJcIiByb2xlPVwiYWxlcnRcIj48c3Ryb25nPkltcG9ydCBmYWlsZWQ8L3N0cm9uZz46IHt0aGlzLnN0YXRlLmVycm9yTWVzc2FnZX08L2Rpdj4sXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yTmFtZT1cInBhc3N3b3JkXCI+UGFzc3dvcmQ8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwicGFzc3dvcmRcIiB2YWx1ZT17dGhpcy5zdGF0ZS5wYXNzd29yZH0gb25DaGFuZ2U9e3RoaXMucGFzc3dvcmRDaGFuZ2UuYmluZCh0aGlzKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInBhc3N3b3JkXCI+PC9pbnB1dD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBdO1xuXG4gICAgICAgIHZhciBpbXBvcnRJblByb2dyZXNzID0gW1xuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhbGVydCBhbGVydC1pbmZvXCIgcm9sZT1cImFsZXJ0XCI+SW1wb3J0IHByb2Nlc3NpbmcuLi48L2Rpdj5cbiAgICAgICAgXTtcblxuICAgICAgICB2YXIgc3VjY2Vzc0ltcG9ydEJvZHkgPSBbXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFsZXJ0IGFsZXJ0LXN1Y2Nlc3NcIiByb2xlPVwiYWxlcnRcIj5JbXBvcnQgc3VjY2VlZGVkITwvZGl2PlxuICAgICAgICBdO1xuXG4gICAgICAgIHZhciBib2R5O1xuXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmltcG9ydEluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIGJvZHkgPSBpbXBvcnRJblByb2dyZXNzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuYXR0ZW1wdGVkSW1wb3J0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuaW1wb3J0RmFpbGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHkgPSBmYWlsZWRJbXBvcnRCb2R5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHkgPSBzdWNjZXNzSW1wb3J0Qm9keTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJvZHkgPSBiZWZvcmVJbXBvcnRCb2R5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwgZmFkZVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZGlhbG9nXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwibW9kYWwtdGl0bGVcIj48aSBjbGFzc05hbWU9XCJpb24tdXBsb2FkXCIgLz4gSW1wb3J0IHlvdXIgUnVuczwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtYm9keVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtib2R5fVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBvbkNsaWNrPXt0aGlzLmJlZ2luRGF0YUltcG9ydC5iaW5kKHRoaXMpfSBkaXNhYmxlZD17dGhpcy5zdGF0ZS5pbXBvcnRJblByb2dyZXNzfT5CZWdpbiBJbXBvcnQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsInZhciBDaGFydEpzID0gcmVxdWlyZShcImNoYXJ0LmpzXCIpO1xuXG5leHBvcnQgY2xhc3MgTGluZUNoYXJ0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jaGFydCA9IG51bGw7XG4gICAgfVxuXG4gICAgY3JlYXRlQ2hhcnQoKSB7XG4gICAgICAgIHZhciBjb250ZXh0ID0gJChSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSkuZmluZChcIi5jaGFydFwiKVswXS5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIHRoaXMuY2hhcnQgPSBuZXcgQ2hhcnRKcyhjb250ZXh0KS5MaW5lKHRoaXMucHJvcHMuZGF0YSwgdGhpcy5wcm9wcy5vcHRzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVDaGFydCgpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVcGRhdGUoKSB7XG4gICAgICAgIHRoaXMuY2hhcnQuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLmNyZWF0ZUNoYXJ0KCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8Y2FudmFzIGNsYXNzTmFtZT1cImNoYXJ0IGNlbnRlci1jaGFydFwiIHdpZHRoPXt0aGlzLnByb3BzLndpZHRofSBoZWlnaHQ9e3RoaXMucHJvcHMuaGVpZ2h0fT48L2NhbnZhcz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cblxuTGluZUNoYXJ0LmRlZmF1bHRQcm9wcyA9IHtcbiAgICB3aWR0aDogMzYwLFxuICAgIGhlaWdodDogMTgwXG59XG4iLCJpbXBvcnQge05hdmJhcn0gZnJvbSBcImNvbXBvbmVudHMvTmF2YmFyLmpzeFwiO1xuaW1wb3J0IHtNb2RhbFRyaWdnZXJ9IGZyb20gXCJjb21wb25lbnRzL01vZGFsVHJpZ2dlci5qc3hcIjtcbmltcG9ydCB7VXBsb2FkRGF0YUJ1dHRvbn0gZnJvbSBcImNvbXBvbmVudHMvVXBsb2FkRGF0YUJ1dHRvbi5qc3hcIjtcbmltcG9ydCB7SW1wb3J0RGF0YU1vZGFsfSBmcm9tIFwiY29tcG9uZW50cy9JbXBvcnREYXRhTW9kYWwuanN4XCI7XG5cbmV4cG9ydCBjbGFzcyBNYWluTmF2YmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGltcG9ydERhdGEoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuXG5cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG5cbiAgICAgICAgdmFyIGxpbmtzID0gW1xuICAgICAgICAgICAge25hbWU6IFwiRGFzaGJvYXJkXCIsIGljb246IFwiaW9uLWlvcy1ob21lXCIsIHVybDogXCIvZGFzaGJvYXJkXCIsIGNsaWNrOiBmdW5jdGlvbigpIHt9LCBjb250ZXh0OiB0aGlzLCBidXR0b246IGZhbHNlfSxcbiAgICAgICAgICAgIHtuYW1lOiBcIlJ1biBIaXN0b3J5XCIsIGljb246IFwiaW9uLXN0YXRzLWJhcnNcIiwgdXJsOiBcIi9oaXN0b3J5XCIsIGNsaWNrOiBmdW5jdGlvbigpIHt9LCBjb250ZXh0OiB0aGlzLCBidXR0b246IGZhbHNlfVxuICAgICAgICBdO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8TmF2YmFyIGxpbmtzPXtsaW5rc30gLz5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgTWFwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICB0aGlzLmRlZmF1bHRPcHRzU3RyaW5nID0gXCJzaXplPTYwMHgzMDAmbWFwdHlwZT1yb2FkbWFwXCI7XG4gICAgfVxuXG4gICAgZ2V0U3RhdGljVXJsKCkge1xuICAgICAgICB2YXIgc3RhdGljTWFwVXJsID0gXCJodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvc3RhdGljbWFwP1wiICsgdGhpcy5kZWZhdWx0T3B0c1N0cmluZyArIFwiJlwiICsgdGhpcy5jZW50ZXJTdHJpbmcgKyBcIiZcIiArIHRoaXMuem9vbVN0cmluZyArIFwiJlwiICsgdGhpcy5ydW5QYXRoU3RyaW5nICsgXCImXCIgKyB0aGlzLm1hcmtlclN0cmluZztcblxuICAgICAgICBjb25zb2xlLmxvZyhzdGF0aWNNYXBVcmwpO1xuICAgICAgICByZXR1cm4gc3RhdGljTWFwVXJsO1xuICAgIH1cblxuICAgIGNvbXB1dGVSdW5QYXRoKHdheXBvaW50cywgYm91bmRzKSB7XG4gICAgICAgIHZhciBydW5QYXRoID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3YXlwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwb2ludCA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcod2F5cG9pbnRzW2ldLmxhdCwgd2F5cG9pbnRzW2ldLmxvbik7XG4gICAgICAgICAgICBydW5QYXRoLnB1c2goIHBvaW50ICk7XG4gICAgICAgICAgICBib3VuZHMuZXh0ZW5kKCBwb2ludCApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJ1blBhdGg7XG4gICAgfVxuXG4gICAgdXBkYXRlUnVuUGF0aFN0cmluZyhydW5QYXRoKSB7XG4gICAgICAgIHRoaXMucnVuUGF0aFN0cmluZyA9IFwicGF0aD1jb2xvcjoweDAwMDBmZnx3ZWlnaHQ6NXxcIjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1blBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucnVuUGF0aFN0cmluZyArPSBydW5QYXRoW2ldLkEgKyBcIixcIiArIHJ1blBhdGhbaV0uRjtcblxuICAgICAgICAgICAgaWYgKGkgPCBydW5QYXRoLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgdGhpcy5ydW5QYXRoU3RyaW5nICs9IFwifFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlTWFya2VyU3RyaW5nKHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgdGhpcy5tYXJrZXJTdHJpbmcgPSBcIm1hcmtlcnM9Y29sb3I6Ymx1ZXxcIiArIHN0YXJ0LkEgKyBcIixcIiArIHN0YXJ0LkYgKyBcInxcIiArIGVuZC5BICsgXCIsXCIgKyBlbmQuRjtcbiAgICB9XG5cbiAgICBtYXBab29tSGFuZGxlcihtYXAsIGUpIHtcbiAgICAgICAgdGhpcy56b29tU3RyaW5nID0gXCJ6b29tPVwiICsgbWFwLnpvb207XG4gICAgfVxuXG4gICAgbWFwQ2VudGVySGFuZGxlcihtYXAsIGUpIHtcbiAgICAgICAgdGhpcy5jZW50ZXJTdHJpbmcgPSBcImNlbnRlcj1cIiArIG1hcC5jZW50ZXIuQSArIFwiLFwiICsgbWFwLmNlbnRlci5GO1xuICAgIH1cblxuICAgIGluaXRTdGF0aWNNYXBTdHJpbmdzKCkge1xuICAgICAgICB0aGlzLmRlZmF1bHRPcHRzU3RyaW5nID0gXCJzaXplPTYwMHgzMDAmbWFwdHlwZT1yb2FkbWFwXCI7XG4gICAgfVxuXG4gICAgY3JlYXRlUnVuUGF0aFBvbHlsaW5lKG1hcCwgd2F5cG9pbnRzLCBydW5QYXRoKSB7XG4gICAgICAgIHZhciBydW5QYXRoUG9seUxpbmU7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3YXlwb2ludHMubGVuZ3RoIC0gMTsgaSsrKSB7XG5cbiAgICAgICAgICAgIHZhciBkeCA9IHBhcnNlRmxvYXQod2F5cG9pbnRzW2ldLmxhdCkgLSBwYXJzZUZsb2F0KHdheXBvaW50c1tpICsgMV0ubGF0KTtcbiAgICAgICAgICAgIHZhciBkeSA9IHBhcnNlRmxvYXQod2F5cG9pbnRzW2ldLmxvbikgLSBwYXJzZUZsb2F0KHdheXBvaW50c1tpICsgMV0ubG9uKTtcbiAgICAgICAgICAgIHZhciBkaXN0ID0gTWF0aC5zcXJ0KGR4ICogZHggICsgZHkgKiBkeSkgKiAxMDAwO1xuICAgICAgICAgICAgZGlzdCAqPSA1MDA7XG4gICAgICAgICAgICBpZiAoIGRpc3QgPiAyMzAgKSB7XG4gICAgICAgICAgICAgICAgZGlzdCA9IDIzMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICggZGlzdCA8IDIwICkge1xuICAgICAgICAgICAgICAgIGRpc3QgPSAyMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBkaXN0ICk7XG4gICAgICAgICAgICB2YXIgciwgZywgYjtcbiAgICAgICAgICAgIHIgPSBwYXJzZUludCgoMjU1IC0gZGlzdCkpO1xuICAgICAgICAgICAgZyA9IHBhcnNlSW50KChkaXN0KSk7XG4gICAgICAgICAgICBiID0gMjA7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggciwgZywgYiApO1xuXG4gICAgICAgICAgICBydW5QYXRoUG9seUxpbmUgPSBuZXcgZ29vZ2xlLm1hcHMuUG9seWxpbmUoe1xuICAgICAgICAgICAgICAgIHBhdGg6IFtydW5QYXRoW2ldLCBydW5QYXRoW2kgKyAxXV0sXG4gICAgICAgICAgICAgICAgZ2VvZGVzaWM6IHRydWUsXG4gICAgICAgICAgICAgICAgc3Ryb2tlQ29sb3I6ICdyZ2JhKCcgKyByICsgJywgJyArIGcgKyAnLCAnICsgYiArICcsIDEpJyxcbiAgICAgICAgICAgICAgICBzdHJva2VPcGFjaXR5OiAxLjAsXG4gICAgICAgICAgICAgICAgc3Ryb2tlV2VpZ2h0OiAyXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcnVuUGF0aFBvbHlMaW5lLnNldE1hcChtYXApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGxhY2VNYXJrZXJzKG1hcCwgd2F5cG9pbnRzLCBydW5QYXRoKSB7XG4gICAgICAgIHZhciBzdGFydEltYWdlID0gJy9pbWcvc3RhcnQucG5nJztcbiAgICAgICAgdmFyIGVuZEltYWdlID0gJy9pbWcvZW5kLnBuZyc7XG4gICAgICAgIHZhciBub2RlSW1hZ2UgPSAnL2ltZy9ibGFuay5wbmcnO1xuICAgICAgICB2YXIgaWNvbjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1blBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpID09IDApIHtcbiAgICAgICAgICAgICAgICBpY29uID0gc3RhcnRJbWFnZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PSBydW5QYXRoLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBpY29uID0gZW5kSW1hZ2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGljb24gPSBub2RlSW1hZ2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB3cCA9IHRoaXMucHJvcHMud2F5cG9pbnRzW2ldO1xuXG4gICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHJ1blBhdGhbaV0sXG4gICAgICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSBUZXN0JyxcbiAgICAgICAgICAgICAgICBpY29uOiBpY29uXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgKGZ1bmN0aW9uIChtYXJrZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5mb3dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJcIiArIHdpbmRvdy5hcHAubW9tZW50KHdwLnRpbWUgKiAxMDAwKS5mb3JtYXQod2luZG93LmFwcC50aW1lRm9ybWF0KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ21vdXNlb3ZlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpbmZvd2luZG93Lm9wZW4obWFwLCBtYXJrZXIpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnbW91c2VvdXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5mb3dpbmRvdy5jbG9zZShtYXAsIG1hcmtlcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KShtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHZhciBib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XG4gICAgICAgIHZhciBydW5QYXRoID0gdGhpcy5jb21wdXRlUnVuUGF0aCh0aGlzLnByb3BzLndheXBvaW50cywgYm91bmRzKTtcblxuICAgICAgICB2YXIgbWFwT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlRFUlJBSU5cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcCgkKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpKS5maW5kKFwiLm1hcC1jYW52YXNcIilbMF0sIG1hcE9wdGlvbnMpO1xuICAgICAgICB0aGlzLm1hcCA9IG1hcDtcbiAgICAgICAgbWFwLmZpdEJvdW5kcyhib3VuZHMpO1xuXG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyT25jZShtYXAsIFwiem9vbV9jaGFuZ2VkXCIsIHRoaXMubWFwWm9vbUhhbmRsZXIuYmluZCh0aGlzLCBtYXApKTtcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXJPbmNlKG1hcCwgXCJjZW50ZXJfY2hhbmdlZFwiLCB0aGlzLm1hcENlbnRlckhhbmRsZXIuYmluZCh0aGlzLCBtYXApKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZU1hcmtlclN0cmluZyhydW5QYXRoWzBdLCBydW5QYXRoW3J1blBhdGgubGVuZ3RoIC0gMV0pO1xuICAgICAgICB0aGlzLnVwZGF0ZVJ1blBhdGhTdHJpbmcocnVuUGF0aCk7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVSdW5QYXRoUG9seWxpbmUobWFwLCB0aGlzLnByb3BzLndheXBvaW50cywgcnVuUGF0aCk7XG4gICAgICAgIHRoaXMucGxhY2VNYXJrZXJzKG1hcCwgdGhpcy5wcm9wcy53YXlwb2ludHMsIHJ1blBhdGgpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXAtY2FudmFzXCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgTW9kYWxUcmlnZ2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICB0cmlnZ2VyTW9kYWwoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgUmVhY3QucmVuZGVyKHRoaXMucHJvcHMubW9kYWwsICQoJyNtb2RhbF9tb3VudCcpWzBdKTtcbiAgICAgICAgJCgnI21vZGFsX21vdW50JykuZmluZChcIi5tb2RhbFwiKS5tb2RhbChcInNob3dcIik7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuXG4gICAgICAgIHZhciBpbm5lcjtcblxuICAgICAgICBpZiAodGhpcy5wcm9wcy5idXR0b24pIHtcbiAgICAgICAgICAgIGlubmVyID0gPGJ1dHRvbiBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lfSBvbkNsaWNrPXt0aGlzLnRyaWdnZXJNb2RhbC5iaW5kKHRoaXMpfT57dGhpcy5wcm9wcy5idXR0b25UZXh0fTwvYnV0dG9uPlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5uZXIgPSA8YSBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lfSBocmVmPVwiI1wiIG9uQ2xpY2s9e3RoaXMudHJpZ2dlck1vZGFsLmJpbmQodGhpcyl9Pnt0aGlzLnByb3BzLmJ1dHRvblRleHR9PC9hPlxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmxpbmUtYmxvY2tcIj5cbiAgICAgICAgICAgICAgICB7aW5uZXJ9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQge01vZGFsVHJpZ2dlcn0gZnJvbSBcIi4vTW9kYWxUcmlnZ2VyLmpzeFwiXG5pbXBvcnQge0FwcFNldHRpbmdzTW9kYWx9IGZyb20gXCIuL0FwcFNldHRpbmdzTW9kYWwuanN4XCJcbmltcG9ydCB7SW1wb3J0RGF0YU1vZGFsfSBmcm9tIFwiY29tcG9uZW50cy9JbXBvcnREYXRhTW9kYWwuanN4XCJcbmltcG9ydCB7VXBsb2FkRGF0YUJ1dHRvbn0gZnJvbSBcImNvbXBvbmVudHMvVXBsb2FkRGF0YUJ1dHRvbi5qc3hcIlxuXG5leHBvcnQgY2xhc3MgTmF2YmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8bmF2IGNsYXNzTmFtZT1cIm5hdmJhciBuYXZiYXItZGVmYXVsdFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyLWZsdWlkXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwibmF2YmFyLXRvZ2dsZSBjb2xsYXBzZWRcIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIjYnMtZXhhbXBsZS1uYXZiYXItY29sbGFwc2UtMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNyLW9ubHlcIj5Ub2dnbGUgbmF2aWdhdGlvbjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uLWJhclwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uLWJhclwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uLWJhclwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwibmF2YmFyLWJyYW5kXCIgaHJlZj1cIi9cIj5MaXZpbmcgRGVhZCBGaXRuZXNzIFRyYWNrZXI8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sbGFwc2UgbmF2YmFyLWNvbGxhcHNlXCIgaWQ9XCJicy1leGFtcGxlLW5hdmJhci1jb2xsYXBzZS0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2IG5hdmJhci1uYXZcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMubGlua3MubWFwKCBmdW5jdGlvbihlbnRyeSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGVudHJ5LmNvbXBvbmVudCAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICg8bGk+e2VudHJ5LmNvbXBvbmVudH08L2xpPik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbnRyeS5idXR0b24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICg8bGk+PGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgbmF2YmFyLWJ0blwiIG9uQ2xpY2s9e2VudHJ5LmNsaWNrLmJpbmQoZW50cnkuY29udGV4dCl9PntlbnRyeS5uYW1lfTwvYnV0dG9uPjwvbGk+KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDxsaT48YSBocmVmPXtlbnRyeS51cmx9IG9uQ2xpY2s9e2VudHJ5LmNsaWNrLmJpbmQoZW50cnkuY29udGV4dCl9PjxpIGNsYXNzTmFtZT17ZW50cnkuaWNvbn0gLz4ge2VudHJ5Lm5hbWV9PC9hPjwvbGk+KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2IG5hdmJhci1uYXYgbmF2YmFyLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TW9kYWxUcmlnZ2VyIG1vZGFsPXs8SW1wb3J0RGF0YU1vZGFsIC8+fSBidXR0b249e3RydWV9IGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBuYXZiYXItYnRuIG1hcmdpbi1yaWdodFwiIGJ1dHRvblRleHQ9ezxVcGxvYWREYXRhQnV0dG9uIC8+fSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TW9kYWxUcmlnZ2VyIG1vZGFsPXs8QXBwU2V0dGluZ3NNb2RhbCAvPn0gYnV0dG9uPXt0cnVlfSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgbmF2YmFyLWJ0blwiIGJ1dHRvblRleHQ9ezxpIGNsYXNzTmFtZT1cImlvbiBpb24tZ2Vhci1hXCI+PC9pPn0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L25hdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJ2YXIgQ2hhcnRKcyA9IHJlcXVpcmUoXCJjaGFydC5qc1wiKTtcblxuZXhwb3J0IGNsYXNzIFBpZUNoYXJ0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIGNyZWF0ZUNoYXJ0KCkge1xuICAgICAgICB2YXIgY29udGV4dCA9ICQoUmVhY3QuZmluZERPTU5vZGUodGhpcykpLmZpbmQoXCIuY2hhcnRcIilbMF0uZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICB0aGlzLmNoYXJ0ID0gbmV3IENoYXJ0SnMoY29udGV4dCkuUGllKHRoaXMucHJvcHMuZGF0YSwgdGhpcy5wcm9wcy5vcHRzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVDaGFydCgpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVcGRhdGUoKSB7XG4gICAgICAgIHRoaXMuY2hhcnQuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLmNyZWF0ZUNoYXJ0KCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8Y2FudmFzIGNsYXNzTmFtZT1cImNoYXJ0XCIgd2lkdGg9XCI0MDBcIiBoZWlnaHQ9XCIyMDBcIj48L2NhbnZhcz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsInZhciBDaGFydEpzID0gcmVxdWlyZShcImNoYXJ0LmpzXCIpO1xuXG5leHBvcnQgY2xhc3MgUmFkYXJDaGFydCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICBjcmVhdGVDaGFydCgpIHtcbiAgICAgICAgdmFyIGNvbnRleHQgPSAkKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpKS5maW5kKFwiLmNoYXJ0XCIpWzBdLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgdGhpcy5jaGFydCA9IG5ldyBDaGFydEpzKGNvbnRleHQpLlJhZGFyKHRoaXMucHJvcHMuZGF0YSwgdGhpcy5wcm9wcy5vcHRzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVDaGFydCgpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVcGRhdGUoKSB7XG4gICAgICAgIHRoaXMuY2hhcnQuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLmNyZWF0ZUNoYXJ0KCk7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGNhbnZhcyBjbGFzc05hbWU9XCJjaGFydFwiIHdpZHRoPVwiNDAwXCIgaGVpZ2h0PVwiMjAwXCI+PC9jYW52YXM+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQge0ZhY2Vib29rU2hhcmVCdXR0b24sIFR3aXR0ZXJTaGFyZUJ1dHRvbn0gZnJvbSBcImNvbXBvbmVudHMvU29jaWFsU2hhcmluZy5qc3hcIjtcblxuZXhwb3J0IGNsYXNzIFNoYXJlUnVuTW9kYWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgYmVnaW5EYXRhSW1wb3J0KCkge1xuXG4gICAgICAgICQucG9zdChcIi9hcGkvaW1wb3J0X2RhdGFcIiwge30sIGZ1bmN0aW9uKHJlc3VsdCkge1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG5cbiAgICAgICAgJChSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSkubW9kYWwoXCJzaG93XCIpO1xuXG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbCBmYWRlXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1kaWFsb2dcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJtb2RhbC10aXRsZVwiPlNoYXJlIFlvdXIgUnVuPC9oND5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e3RoaXMucHJvcHMuaW1hZ2VVcmx9IHdpZHRoPVwiMTAwJVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RmFjZWJvb2tTaGFyZUJ1dHRvbiB1cmw9e3RoaXMucHJvcHMuaW1hZ2VVcmx9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFR3aXR0ZXJTaGFyZUJ1dHRvbiB1cmw9e3RoaXMucHJvcHMuaW1hZ2VVcmx9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJcbi8qXG4gKiBFeGFtcGxlXG4gKiA8RmFjZWJvb2tTaGFyZUJ1dHRvbiB1cmw9XCJodHRwOi8vaS5pbWd1ci5jb20vM3NrdkEuanBnXCIgLz5cbiAqL1xuZXhwb3J0IGNsYXNzIEZhY2Vib29rU2hhcmVCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIChmdW5jdGlvbihkLCBzLCBpZCkge1xuICAgICAgICAgICAgdmFyIGpzLCBmanMgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdO1xuICAgICAgICAgICAgaWYgKGQuZ2V0RWxlbWVudEJ5SWQoaWQpKSByZXR1cm47XG4gICAgICAgICAgICBqcyA9IGQuY3JlYXRlRWxlbWVudChzKTsganMuaWQgPSBpZDtcbiAgICAgICAgICAgIGpzLnNyYyA9IFwiaHR0cHM6Ly9jb25uZWN0LmZhY2Vib29rLm5ldC9lbl9VUy9zZGsuanMjeGZibWw9MSZ2ZXJzaW9uPXYyLjMmYXBwSWQ9NjM5NTQyMTg2MTQ2Nzg1XCI7XG4gICAgICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XG4gICAgICAgIH1cbiAgICAgICAgKGRvY3VtZW50LCAnc2NyaXB0JywgJ2ZhY2Vib29rLWpzc2RrJykpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmYi1zaGFyZS1idXR0b24nXG4gICAgICAgICAgICAgICAgZGF0YS1ocmVmPXt0aGlzLnByb3BzLnVybH1cbiAgICAgICAgICAgICAgICBkYXRhLWxheW91dD0nYnV0dG9uJz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxufVxuXG4vKlxuICogRXhhbXBsZVxuICogPFR3aXR0ZXJTaGFyZUJ1dHRvbiB1cmw9XCJodHRwOi8vaS5pbWd1ci5jb20vM3NrdkEuanBnXCIgbWVzc2FnZT1cIlNhbXBsZSBib2R5XCIgLz5cbiAqL1xuZXhwb3J0IGNsYXNzIFR3aXR0ZXJTaGFyZUJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgIWZ1bmN0aW9uKGQscyxpZCl7XG4gICAgICAgICAgICB2YXIganMsZmpzPWQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF0scD0vXmh0dHA6Ly50ZXN0KGQubG9jYXRpb24pPydodHRwJzonaHR0cHMnO1xuICAgICAgICAgICAgaWYoIWQuZ2V0RWxlbWVudEJ5SWQoaWQpKXtcbiAgICAgICAgICAgICAgICBqcz1kLmNyZWF0ZUVsZW1lbnQocyk7XG4gICAgICAgICAgICAgICAganMuaWQ9aWQ7anMuc3JjPXArJzovL3BsYXRmb3JtLnR3aXR0ZXIuY29tL3dpZGdldHMuanMnO1xuICAgICAgICAgICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcyxmanMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIChkb2N1bWVudCwgJ3NjcmlwdCcsICd0d2l0dGVyLXdqcycpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxhIGhyZWY9J2h0dHBzOi8vdHdpdHRlci5jb20vc2hhcmUnXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPSd0d2l0dGVyLXNoYXJlLWJ1dHRvbidcbiAgICAgICAgICAgICAgICBkYXRhLXVybD17dGhpcy5wcm9wcy51cmx9XG4gICAgICAgICAgICAgICAgZGF0YS10ZXh0PXt0aGlzLnByb3BzLm1lc3NhZ2V9XG4gICAgICAgICAgICAgICAgZGF0YS1jb3VudD0nbm9uZSc+VHdlZXQ8L2E+XG4gICAgICAgIClcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgVXBsb2FkRGF0YUJ1dHRvbiB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gPHNwYW4+PGkgY2xhc3NOYW1lPVwiaW9uIGlvbi11cGxvYWRcIj48L2k+IEltcG9ydCBEYXRhPC9zcGFuPjtcbiAgICB9XG59XG4iLCJpbXBvcnQge0JvZHl9IGZyb20gXCJjb21wb25lbnRzL0JvZHkuanN4XCI7XG5pbXBvcnQge0xpbmVDaGFydH0gZnJvbSBcImNvbXBvbmVudHMvTGluZUNoYXJ0LmpzeFwiO1xuaW1wb3J0IHtCYXJDaGFydH0gZnJvbSBcImNvbXBvbmVudHMvQmFyQ2hhcnQuanN4XCI7XG5pbXBvcnQge1JhZGFyQ2hhcnR9IGZyb20gXCJjb21wb25lbnRzL1JhZGFyQ2hhcnQuanN4XCI7XG5pbXBvcnQge1BpZUNoYXJ0fSBmcm9tIFwiY29tcG9uZW50cy9QaWVDaGFydC5qc3hcIjtcbmltcG9ydCB7TWFpbk5hdmJhcn0gZnJvbSBcImNvbXBvbmVudHMvTWFpbk5hdmJhci5qc3hcIjtcbmltcG9ydCB7TW9kYWxUcmlnZ2VyfSBmcm9tIFwiY29tcG9uZW50cy9Nb2RhbFRyaWdnZXIuanN4XCI7XG5pbXBvcnQge0ltcG9ydERhdGFNb2RhbH0gZnJvbSBcImNvbXBvbmVudHMvSW1wb3J0RGF0YU1vZGFsLmpzeFwiO1xuaW1wb3J0IHtGYWNlYm9va1NoYXJlQnV0dG9uLCBUd2l0dGVyU2hhcmVCdXR0b259IGZyb20gXCJjb21wb25lbnRzL1NvY2lhbFNoYXJpbmcuanN4XCI7XG5pbXBvcnQge1VwbG9hZERhdGFCdXR0b259IGZyb20gXCJjb21wb25lbnRzL1VwbG9hZERhdGFCdXR0b24uanN4XCI7XG5cbmV4cG9ydCBjbGFzcyBEYXNoYm9hcmRQYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIHJ1bnM6IG51bGwsXG4gICAgICAgICAgICBzcGVlZEdyYXBoOiB7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhc2V0czogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIk15IFNlY29uZCBkYXRhc2V0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiBcInJnYmEoMTUxLDE4NywyMDUsMC4yKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZUNvbG9yOiBcInJnYmEoMTUxLDE4NywyMDUsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludENvbG9yOiBcInJnYmEoMTUxLDE4NywyMDUsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludFN0cm9rZUNvbG9yOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludEhpZ2hsaWdodEZpbGw6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50SGlnaGxpZ2h0U3Ryb2tlOiBcInJnYmEoMTUxLDE4NywyMDUsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvcHRzOiB7XG4gICAgICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IGZ1bmN0aW9uKCB2YWwgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsLnZhbHVlICsgXCIga20vaFwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGlzdGFuY2VHcmFwaDoge1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YXNldHM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJNeSBTZWNvbmQgZGF0YXNldFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogXCJyZ2JhKDE1MSwxODcsMjA1LDAuMilcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VDb2xvcjogXCJyZ2JhKDE1MSwxODcsMjA1LDEpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRDb2xvcjogXCJyZ2JhKDE1MSwxODcsMjA1LDEpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRTdHJva2VDb2xvcjogXCIjZmZmXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRIaWdobGlnaHRGaWxsOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludEhpZ2hsaWdodFN0cm9rZTogXCJyZ2JhKDE1MSwxODcsMjA1LDEpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogW11cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb3B0czoge1xuICAgICAgICAgICAgICAgICAgICBzY2FsZUxhYmVsOiBmdW5jdGlvbiggdmFsICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbC52YWx1ZSArIFwiIG1cIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHZhciBkYXRlID0gKG5ldyBEYXRlKCkpO1xuICAgICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSA3KTtcbiAgICAgICAgZGF0ZSA9IGRhdGUudG9JU09TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMTApO1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRlKTtcblxuICAgICAgICAkLmdldChcIi9hcGkvcnVuc19zaW5jZV9kYXRlL1wiICsgZGF0ZSwgZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgIT0gZmFsc2UpIHtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgdmFyIHNwZWVkR3JhcGggPSB0aGlzLnN0YXRlLnNwZWVkR3JhcGg7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlR3JhcGggPSB0aGlzLnN0YXRlLmRpc3RhbmNlR3JhcGg7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgcnVuczogcmVzdWx0LnJ1bnNcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHNwZWVkR3JhcGguZGF0YS5sYWJlbHMgPSBbXTtcbiAgICAgICAgICAgICAgICBzcGVlZEdyYXBoLmRhdGEuZGF0YXNldHNbMF0uZGF0YSA9IFtdO1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlR3JhcGguZGF0YS5sYWJlbHMgPSBbXTtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZUdyYXBoLmRhdGEuZGF0YXNldHNbMF0uZGF0YSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgbGV0IGNvdW50cyA9IFswLDAsMCwwLDAsMCwwXTtcbiAgICAgICAgICAgICAgICBsZXQgc3BlZWRzID0gWzAsMCwwLDAsMCwwLDBdO1xuICAgICAgICAgICAgICAgIGxldCBkaXN0YW5jZXMgPSBbMCwwLDAsMCwwLDAsMF07XG5cbiAgICAgICAgICAgICAgICBsZXQgd2Vla2RheXMgPSBbXCJTdW5kYXlcIiwgXCJNb25kYXlcIiwgXCJUdWVzZGF5XCIsIFwiV2VkbmVzZGF5XCIsIFwiVGh1cnNkYXlcIiwgXCJGcmlkYXlcIiwgXCJTYXR1cmRheVwiXTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0LnJ1bnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJ1biA9IHJlc3VsdC5ydW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbW9tZW50ID0gd2luZG93LmFwcC5tb21lbnQoIHJ1bi5zdGFydF90aW1lICogMTAwMCApO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGF5ID0gbW9tZW50LndlZWtkYXkoKTtcblxuICAgICAgICAgICAgICAgICAgICBjb3VudHNbZGF5XSsrO1xuICAgICAgICAgICAgICAgICAgICBzcGVlZHNbZGF5XSArPSBydW4uYXZlcmFnZV9zcGVlZDtcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2VzW2RheV0gKz0gcnVuLmRpc3RhbmNlO1xuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA3OyBpKyspIHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgcnVuID0gcmVzdWx0LnJ1bnNbaV07XG4gICAgICAgICAgICAgICAgICAgIHNwZWVkR3JhcGguZGF0YS5sYWJlbHMucHVzaCh3ZWVrZGF5c1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzcGVlZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmICggY291bnRzW2ldID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwZWVkID0gKHNwZWVkc1tpXSAvIGNvdW50c1tpXSkgKiA2MCAqIDYwIC8gMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzcGVlZCA9IHNwZWVkLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgIHNwZWVkR3JhcGguZGF0YS5kYXRhc2V0c1swXS5kYXRhLnB1c2goc3BlZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlR3JhcGguZGF0YS5sYWJlbHMucHVzaCh3ZWVrZGF5c1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkaXN0YW5jZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmICggY291bnRzW2ldID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gZGlzdGFuY2VzW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gZGlzdGFuY2UudG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2VHcmFwaC5kYXRhLmRhdGFzZXRzWzBdLmRhdGEucHVzaChkaXN0YW5jZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNwZWVkR3JhcGg6IHNwZWVkR3JhcGgsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlR3JhcGg6IGRpc3RhbmNlR3JhcGgsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuXG4gICAgICAgIHZhciBwaWVDaGFydERhdGEgPSAgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhbHVlOiAzMDAsXG4gICAgICAgICAgICAgICAgY29sb3I6XCIjRjc0NjRBXCIsXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0OiBcIiNGRjVBNUVcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJSZWRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogNTAsXG4gICAgICAgICAgICAgICAgY29sb3I6IFwiIzQ2QkZCRFwiLFxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodDogXCIjNUFEM0QxXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiR3JlZW5cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogMTAwLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBcIiNGREI0NUNcIixcbiAgICAgICAgICAgICAgICBoaWdobGlnaHQ6IFwiI0ZGQzg3MFwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIlllbGxvd1wiXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG5cbiAgICAgICAgdmFyIGJhckNoYXJ0ZGF0YSA9IHtcbiAgICAgICAgICAgIGxhYmVsczogW1wiSmFudWFyeVwiLCBcIkZlYnJ1YXJ5XCIsIFwiTWFyY2hcIiwgXCJBcHJpbFwiLCBcIk1heVwiLCBcIkp1bmVcIiwgXCJKdWx5XCJdLFxuICAgICAgICAgICAgZGF0YXNldHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIk15IEZpcnN0IGRhdGFzZXRcIixcbiAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiBcInJnYmEoMjIwLDIyMCwyMjAsMC41KVwiLFxuICAgICAgICAgICAgICAgICAgICBzdHJva2VDb2xvcjogXCJyZ2JhKDIyMCwyMjAsMjIwLDAuOClcIixcbiAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0RmlsbDogXCJyZ2JhKDIyMCwyMjAsMjIwLDAuNzUpXCIsXG4gICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodFN0cm9rZTogXCJyZ2JhKDIyMCwyMjAsMjIwLDEpXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IFs2NSwgNTksIDgwLCA4MSwgNTYsIDU1LCA0MF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiTXkgU2Vjb25kIGRhdGFzZXRcIixcbiAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiBcInJnYmEoMTUxLDE4NywyMDUsMC41KVwiLFxuICAgICAgICAgICAgICAgICAgICBzdHJva2VDb2xvcjogXCJyZ2JhKDE1MSwxODcsMjA1LDAuOClcIixcbiAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0RmlsbDogXCJyZ2JhKDE1MSwxODcsMjA1LDAuNzUpXCIsXG4gICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodFN0cm9rZTogXCJyZ2JhKDE1MSwxODcsMjA1LDEpXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IFsyOCwgNDgsIDQwLCAxOSwgODYsIDI3LCA5MF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHJhZGFyQ2hhcnREYXRhID0ge1xuICAgICAgICAgICAgbGFiZWxzOiBbXCJFYXRpbmdcIiwgXCJEcmlua2luZ1wiLCBcIlNsZWVwaW5nXCIsIFwiRGVzaWduaW5nXCIsIFwiQ29kaW5nXCIsIFwiQ3ljbGluZ1wiLCBcIlJ1bm5pbmdcIl0sXG4gICAgICAgICAgICBkYXRhc2V0czogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiTXkgRmlyc3QgZGF0YXNldFwiLFxuICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IFwicmdiYSgyMjAsMjIwLDIyMCwwLjIpXCIsXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUNvbG9yOiBcInJnYmEoMjIwLDIyMCwyMjAsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRDb2xvcjogXCJyZ2JhKDIyMCwyMjAsMjIwLDEpXCIsXG4gICAgICAgICAgICAgICAgICAgIHBvaW50U3Ryb2tlQ29sb3I6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgICAgICAgICBwb2ludEhpZ2hsaWdodEZpbGw6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgICAgICAgICBwb2ludEhpZ2hsaWdodFN0cm9rZTogXCJyZ2JhKDIyMCwyMjAsMjIwLDEpXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IFs2NSwgNTksIDkwLCA4MSwgNTYsIDU1LCA0MF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiTXkgU2Vjb25kIGRhdGFzZXRcIixcbiAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiBcInJnYmEoMTUxLDE4NywyMDUsMC4yKVwiLFxuICAgICAgICAgICAgICAgICAgICBzdHJva2VDb2xvcjogXCJyZ2JhKDE1MSwxODcsMjA1LDEpXCIsXG4gICAgICAgICAgICAgICAgICAgIHBvaW50Q29sb3I6IFwicmdiYSgxNTEsMTg3LDIwNSwxKVwiLFxuICAgICAgICAgICAgICAgICAgICBwb2ludFN0cm9rZUNvbG9yOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRIaWdobGlnaHRGaWxsOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRIaWdobGlnaHRTdHJva2U6IFwicmdiYSgxNTEsMTg3LDIwNSwxKVwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBbMjgsIDQ4LCA0MCwgMTksIDk2LCAyNywgMTAwXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgY29udGVudCA9IG51bGw7XG5cbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnJ1bnMgfHwgdGhpcy5zdGF0ZS5ydW5zLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBjb250ZW50ID0gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGFsZXJ0IGFsZXJ0LXdhcm5pbmdcIiByb2xlPVwiYWxlcnRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImNlbnRlci10ZXh0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWW91IGhhdmVuJ3QgYWRkZWQgYW55IHJ1biBkYXRhIHRoaXMgd2Vlaywgd2hlbiB5b3UgaW1wb3J0IGEgbmV3IHJ1biB5b3UnbGwgYmUgYWJsZSB0byBzZWUgaW5mb3JtYXRpb24gYWJvdXQgeW91ciBmaXRuZXNzIGhlcmUuXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNlbnRlci10ZXh0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1vZGFsVHJpZ2dlciBtb2RhbD17PEltcG9ydERhdGFNb2RhbCAvPn0gYnV0dG9uPXt0cnVlfSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgbmF2YmFyLWJ0biBtYXJnaW4tbGVmdCBtYXJnaW4tcmlnaHRcIiBidXR0b25UZXh0PXs8VXBsb2FkRGF0YUJ1dHRvbiAvPn0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8TWFpbk5hdmJhciAvPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIHtjb250ZW50fVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDI+UmVjZW50IFJ1bnM8L2gyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ0YWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlN0YXJ0IFRpbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5FbmQgVGltZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkFjdGlvbjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJ1bnMgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJ1bnMubWFwKCBmdW5jdGlvbihydW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3dpbmRvdy5hcHAubW9tZW50KHJ1bi5zdGFydF90aW1lICogMTAwMCkuZm9ybWF0KHdpbmRvdy5hcHAudGltZUZvcm1hdCl9IHt3aW5kb3cuYXBwLm1vbWVudChydW4uc3RhcnRfdGltZSAqIDEwMDApLmZvcm1hdCh3aW5kb3cuYXBwLmRheUZvcm1hdCl9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt3aW5kb3cuYXBwLm1vbWVudChydW4uZW5kX3RpbWUgKiAxMDAwKS5mb3JtYXQod2luZG93LmFwcC50aW1lRm9ybWF0KX0ge3dpbmRvdy5hcHAubW9tZW50KHJ1bi5lbmRfdGltZSAqIDEwMDApLmZvcm1hdCh3aW5kb3cuYXBwLmRheUZvcm1hdCl9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjxhIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGhyZWY9e1wiL3J1bi9cIiArIHJ1bi5faWR9PjxpIGNsYXNzTmFtZT1cImlvbiBpb24tZXllXCIgLz48L2E+PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkgOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDI+QXZlcmFnZSBTcGVlZCBPdmVyIFRoZSBQYXN0IFdlZWs8L2gyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5lQ2hhcnQgZGF0YT17dGhpcy5zdGF0ZS5zcGVlZEdyYXBoLmRhdGF9IG9wdHM9e3RoaXMuc3RhdGUuc3BlZWRHcmFwaC5vcHRzfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyPkRpc3RhbmNlIENvdmVyZWQgT3ZlciBUaGUgUGFzdCBXZWVrPC9oMj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluZUNoYXJ0IGRhdGE9e3RoaXMuc3RhdGUuZGlzdGFuY2VHcmFwaC5kYXRhfSBvcHRzPXt0aGlzLnN0YXRlLmRpc3RhbmNlR3JhcGgub3B0c30gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7TWFpbk5hdmJhcn0gZnJvbSBcImNvbXBvbmVudHMvTWFpbk5hdmJhci5qc3hcIjtcblxuZXhwb3J0IGNsYXNzIEZpbGVOb3RGb3VuZFBhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxNYWluTmF2YmFyIC8+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGgxPjQwNDwvaDE+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQge0JvZHl9IGZyb20gXCJjb21wb25lbnRzL0JvZHkuanN4XCI7XG5pbXBvcnQge01vZGFsVHJpZ2dlcn0gZnJvbSBcImNvbXBvbmVudHMvTW9kYWxUcmlnZ2VyLmpzeFwiO1xuaW1wb3J0IHtTaGFyZVJ1bk1vZGFsfSBmcm9tIFwiY29tcG9uZW50cy9TaGFyZVJ1bk1vZGFsLmpzeFwiO1xuaW1wb3J0IHtNYWluTmF2YmFyfSBmcm9tIFwiY29tcG9uZW50cy9NYWluTmF2YmFyLmpzeFwiO1xuaW1wb3J0IHtNYXB9IGZyb20gXCJjb21wb25lbnRzL01hcC5qc3hcIjtcbmltcG9ydCB7TGluZUNoYXJ0fSBmcm9tIFwiY29tcG9uZW50cy9MaW5lQ2hhcnQuanN4XCI7XG5cbmV4cG9ydCBjbGFzcyBSdW5EYXRhUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBydW46IGZhbHNlLFxuICAgICAgICAgICAgY2hhcnREYXRhOiB7XG4gICAgICAgICAgICAgICAgbGFiZWxzOiBbXCJKYW51YXJ5XCIsIFwiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCIsIFwiTWF5XCIsIFwiSnVuZVwiLCBcIkp1bHlcIl0sXG4gICAgICAgICAgICAgICAgZGF0YXNldHM6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiTXkgRmlyc3QgZGF0YXNldFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiBcInJnYmEoMTUxLDE4NywyMDUsMC4yKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IFwicmdiYSgxNTEsMTg3LDIwNSwxKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRDb2xvcjogXCJyZ2JhKDE1MSwxODcsMjA1LDEpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludFN0cm9rZUNvbG9yOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50SGlnaGxpZ2h0RmlsbDogXCIjZmZmXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludEhpZ2hsaWdodFN0cm9rZTogXCJyZ2JhKDE1MSwxODcsMjA1LDEpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBbNjUsIDU5LCA4MCwgODEsIDU2LCA1NSwgNDBdXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hhcnRPcHRzOiB7XG4gICAgICAgICAgICAgICAgc2NhbGVTaG93R3JpZExpbmVzIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZGF0YXNldEZpbGwgOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNjYWxlU2hvd0hvcml6b250YWxMaW5lczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY2FsZVNob3dWZXJ0aWNhbExpbmVzOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNob3dUb29sdGlwczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwb2ludEhpdERldGVjdGlvblJhZGl1cyA6IDEsXG4gICAgICAgICAgICAgICAgc2NhbGVMYWJlbDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnZhbHVlICsgXCIga20vaHJcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdG9vbHRpcFRlbXBsYXRlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCAodmFsdWUudmFsdWUpLnRvRml4ZWQoIDEgKSArIFwiIGttL2hyXCIgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgJC5nZXQoXCIvYXBpL3J1bi9cIiArIHRoaXMucHJvcHMucnVuSWQsIGZ1bmN0aW9uKHJlc3VsdCkge1xuXG4gICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgIT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgcnVuOiByZXN1bHQsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHRoaXMuc3RhdGUuY2hhcnREYXRhO1xuICAgICAgICAgICAgICAgIHZhciBsYWJlbHMgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgc3BlZWRzID0gW107XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBwcmV0dHlfcHJpbnRfdGltZSggc2Vjb25kcyApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKCBzZWNvbmRzIC8gNjAgKSAlIDYwO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaG91cnMgPSBNYXRoLmZsb29yKCBzZWNvbmRzIC8gMzYwMCApICUgMjQ7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0ciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGlmICggaG91cnMgPiAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IGhvdXJzICsgXCJoIFwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN0ciArPSBtaW51dGVzICsgXCJtXCI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGludGVydmFsID0gcGFyc2VJbnQoIHJlc3VsdC5zcGVlZF9ncmFwaC54Lmxlbmd0aCAvIDEwICk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5zcGVlZF9ncmFwaC54Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBsYWJlbCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGlmICggaSAlIGludGVydmFsID09IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbCA9IHByZXR0eV9wcmludF90aW1lKCBwYXJzZUludCggcmVzdWx0LnNwZWVkX2dyYXBoLnhbaV0gKSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIGxhYmVsICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGFiZWxzLnB1c2gobGFiZWwpO1xuICAgICAgICAgICAgICAgICAgICBzcGVlZHMucHVzaChyZXN1bHQuc3BlZWRfZ3JhcGgueVtpXSAqIDYwICogNjAgLyAxMDAwKTsgLy8gdG8ga21waFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRhdGEubGFiZWxzID0gbGFiZWxzO1xuICAgICAgICAgICAgICAgIGRhdGEuZGF0YXNldHNbMF0uZGF0YSA9IHNwZWVkcztcblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2NoYXJ0RGF0YTogZGF0YX0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgc2hhcmVSdW4oZSkge1xuICAgICAgICB2YXIgbWFwVXJsID0gdGhpcy5yZWZzLm1hcC5nZXRTdGF0aWNVcmwoKTtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gdGhpcy5pbWd1clVwbG9hZC5iaW5kKHRoaXMpO1xuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgICAgIHVybDogXCJodHRwczovL2FwaS5pbWd1ci5jb20vMy9pbWFnZVwiLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogJ0NsaWVudC1JRCBkOGY1OTAzOWJkYjlmYWQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGltYWdlOiBtYXBVcmxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBjYWxsYmFja1xuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGltZ3VyVXBsb2FkKGRhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe21hcFVybDogZGF0YVtcImRhdGFcIl1bXCJsaW5rXCJdLCBzaGFyaW5nUnVuOiB0cnVlfSk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuXG4gICAgICAgIHZhciBib2R5ID0gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICA8cD5UaGlzIHJ1biBkb2VzIG5vdCBleGlzdC48L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcblxuICAgICAgICB2YXIgbW9kYWwgPSA8U2hhcmVSdW5Nb2RhbCByZWY9XCJtb2RhbFwiIGltYWdlVXJsPXt0aGlzLnN0YXRlLm1hcFVybH0gLz47XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5zaGFyaW5nUnVuKSB7XG4gICAgICAgICAgICBtb2RhbCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5ydW4pIHtcbiAgICAgICAgICAgIGJvZHkgPSAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJmdWxsLXdpZHRoXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWW91ciBSdW4gPHNtYWxsPnt3aW5kb3cuYXBwLm1vbWVudCh0aGlzLnN0YXRlLnJ1bi5zdGFydF90aW1lICogMTAwMCkuZm9ybWF0KHdpbmRvdy5hcHAuZGF5Rm9ybWF0KX08L3NtYWxsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGZsb2F0LXJpZ2h0XCIgb25DbGljaz17dGhpcy5zaGFyZVJ1bi5iaW5kKHRoaXMpfT5TaGFyZSBSdW48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaDE+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBtYXJnaW4tdG9wXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC0zIGNlbnRlci10ZXh0XCI+PGgzPlRvdGFsIERpc3RhbmNlPC9oMz4ge3RoaXMuc3RhdGUucnVuLmRpc3RhbmNlLnRvRml4ZWQoMil9bTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtMyBjZW50ZXItdGV4dFwiPjxoMz5BdmVyYWdlIFNwZWVkPC9oMz4geyh0aGlzLnN0YXRlLnJ1bi5hdmVyYWdlX3NwZWVkICogNjAgKiA2MCAvIDEwMDApLnRvRml4ZWQoMil9a21waDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtMyBjZW50ZXItdGV4dFwiPjxoMz5EdXJhdGlvbjwvaDM+IHsgcGFyc2VJbnQodGhpcy5zdGF0ZS5ydW4uZHVyYXRpb24gLyA2MCkgfSBtaW5zIHt0aGlzLnN0YXRlLnJ1bi5kdXJhdGlvbiAlIDYwfSBzZWNvbmRzPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC0zIGNlbnRlci10ZXh0XCI+PGgzPktpbG9qb3VsZXMgQnVybmVkPC9oMz57dGhpcy5zdGF0ZS5ydW4ua2lsb2pvdWxlcy50b0ZpeGVkKDIpfSBrajwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGhyIC8+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8TWFwIHJlZj1cIm1hcFwiIHdheXBvaW50cz17dGhpcy5zdGF0ZS5ydW4ud2F5cG9pbnRzfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAge21vZGFsfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8aHIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNlbnRlci10ZXh0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgzPllvdXIgU3BlZWQgQnJlYWtkb3duPC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluZUNoYXJ0IGRhdGE9e3RoaXMuc3RhdGUuY2hhcnREYXRhfSBvcHRzPXt0aGlzLnN0YXRlLmNoYXJ0T3B0c30gd2lkdGg9ezExNDB9IGhlaWdodD17MjQwfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxNYWluTmF2YmFyIC8+XG4gICAgICAgICAgICAgICAge2JvZHl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQge0JvZHl9IGZyb20gXCJjb21wb25lbnRzL0JvZHkuanN4XCI7XG5pbXBvcnQge0xpbmVDaGFydH0gZnJvbSBcImNvbXBvbmVudHMvTGluZUNoYXJ0LmpzeFwiO1xuaW1wb3J0IHtCYXJDaGFydH0gZnJvbSBcImNvbXBvbmVudHMvQmFyQ2hhcnQuanN4XCI7XG5pbXBvcnQge1JhZGFyQ2hhcnR9IGZyb20gXCJjb21wb25lbnRzL1JhZGFyQ2hhcnQuanN4XCI7XG5pbXBvcnQge1BpZUNoYXJ0fSBmcm9tIFwiY29tcG9uZW50cy9QaWVDaGFydC5qc3hcIjtcbmltcG9ydCB7TWFpbk5hdmJhcn0gZnJvbSBcImNvbXBvbmVudHMvTWFpbk5hdmJhci5qc3hcIjtcbmltcG9ydCB7TW9kYWxUcmlnZ2VyfSBmcm9tIFwiY29tcG9uZW50cy9Nb2RhbFRyaWdnZXIuanN4XCI7XG5pbXBvcnQge0ltcG9ydERhdGFNb2RhbH0gZnJvbSBcImNvbXBvbmVudHMvSW1wb3J0RGF0YU1vZGFsLmpzeFwiO1xuXG5leHBvcnQgY2xhc3MgUnVuSGlzdG9yeVBhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgcnVuczogbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlUnVucygpO1xuICAgIH1cblxuICAgIHVwZGF0ZVJ1bnMoKSB7XG4gICAgICAgICQuZ2V0KFwiL2FwaS9hbGxfcnVuc1wiLCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyAhPSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICBydW5zOiByZXN1bHRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBkZWxldGVSdW4ocnVuLCBlKSB7XG4gICAgICAgIC8vIHRoaXMgaXMgYm91bmQgdG8gdGhlIHJ1biBpbnN0YW5jZVxuXG4gICAgICAgIGlmIChjb25maXJtKFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIHJ1bj9cIikpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJ1bik7XG5cbiAgICAgICAgICAgICQuZ2V0KFwiL2FwaS9kZWxldGVfcnVuL1wiICsgcnVuLl9pZFtcIiRvaWRcIl0sIGZ1bmN0aW9uKHJlc3VsdCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzICE9IGZhbHNlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVSdW5zKCk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ291bGQgbm90IGRlbGV0ZSBydW4uXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8TWFpbk5hdmJhciAvPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMj5SdW4gSGlzdG9yeTwvaDI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+U3RhcnQgVGltZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkVuZCBUaW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+QWN0aW9uPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucnVucyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucnVucy5tYXAoIGZ1bmN0aW9uKHJ1bikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57d2luZG93LmFwcC5tb21lbnQocnVuLnN0YXJ0X3RpbWUgKiAxMDAwKS5mb3JtYXQod2luZG93LmFwcC50aW1lRm9ybWF0KX0ge3dpbmRvdy5hcHAubW9tZW50KHJ1bi5zdGFydF90aW1lICogMTAwMCkuZm9ybWF0KHdpbmRvdy5hcHAuZGF5Rm9ybWF0KX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3dpbmRvdy5hcHAubW9tZW50KHJ1bi5lbmRfdGltZSAqIDEwMDApLmZvcm1hdCh3aW5kb3cuYXBwLnRpbWVGb3JtYXQpfSB7d2luZG93LmFwcC5tb21lbnQocnVuLmVuZF90aW1lICogMTAwMCkuZm9ybWF0KHdpbmRvdy5hcHAuZGF5Rm9ybWF0KX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBocmVmPXtcIi9ydW4vXCIgKyBydW4uX2lkW1wiJG9pZFwiXX0+PGkgY2xhc3NOYW1lPVwiaW9uIGlvbi1leWVcIiAvPjwvYT4gPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBvbkNsaWNrPXt0aGlzLmRlbGV0ZVJ1bi5iaW5kKHRoaXMsIHJ1bil9PjxpIGNsYXNzTmFtZT1cImlvbiBpb24tdHJhc2gtYlwiIC8+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSkgOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7RGFzaGJvYXJkUGFnZX0gZnJvbSBcInBhZ2VzL0Rhc2hib2FyZFBhZ2UuanN4XCI7XG5pbXBvcnQge3RyYW5zaXRpb259IGZyb20gXCJwYWdlcy9jb250cm9sbGVycy9QYWdlVHJhbnNpdGlvbi5qc3hcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIERhc2hib2FyZENvbnRyb2xsZXIoY3R4LCBuZXh0KSB7XG4gICAgdHJhbnNpdGlvbihjdHgsIG5leHQsIDxEYXNoYm9hcmRQYWdlIC8+KTtcbn1cbiIsImltcG9ydCB7RmlsZU5vdEZvdW5kUGFnZX0gZnJvbSBcInBhZ2VzL0ZpbGVOb3RGb3VuZFBhZ2UuanN4XCI7XG5pbXBvcnQge3RyYW5zaXRpb259IGZyb20gXCJwYWdlcy9jb250cm9sbGVycy9QYWdlVHJhbnNpdGlvbi5qc3hcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIEZpbGVOb3RGb3VuZENvbnRyb2xsZXIoY3R4LCBuZXh0KSB7XG4gICAgdHJhbnNpdGlvbihjdHgsIG5leHQsIDxGaWxlTm90Rm91bmRQYWdlIC8+KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiB0cmFuc2l0aW9uKGN0eCwgbmV4dCwgY29tcG9uZW50KSB7XG4gICAgaWYgKCFjdHguaW5pdCkge1xuICAgICAgICB3aW5kb3cuYXBwLm1vdW50UG9pbnQuY2xhc3NMaXN0LmFkZCgndHJhbnNpdGlvbicpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB3aW5kb3cuYXBwLm1vdW50UG9pbnQuY2xhc3NMaXN0LnJlbW92ZSgndHJhbnNpdGlvbicpO1xuICAgICAgICB9LCAzNTApO1xuICAgIH1cblxuICAgIFJlYWN0LnJlbmRlcihjb21wb25lbnQsIHdpbmRvdy5hcHAubW91bnRQb2ludCk7XG59XG4iLCJpbXBvcnQge1J1bkRhdGFQYWdlfSBmcm9tIFwicGFnZXMvUnVuRGF0YVBhZ2UuanN4XCI7XG5pbXBvcnQge3RyYW5zaXRpb259IGZyb20gXCJwYWdlcy9jb250cm9sbGVycy9QYWdlVHJhbnNpdGlvbi5qc3hcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIFJ1bkRhdGFDb250cm9sbGVyKGN0eCwgbmV4dCkge1xuICAgIHRyYW5zaXRpb24oY3R4LCBuZXh0LCA8UnVuRGF0YVBhZ2UgcnVuSWQ9e2N0eC5wYXJhbXMucnVufS8+KTtcbn1cbiIsImltcG9ydCB7UnVuSGlzdG9yeVBhZ2V9IGZyb20gXCJwYWdlcy9SdW5IaXN0b3J5UGFnZS5qc3hcIjtcbmltcG9ydCB7dHJhbnNpdGlvbn0gZnJvbSBcInBhZ2VzL2NvbnRyb2xsZXJzL1BhZ2VUcmFuc2l0aW9uLmpzeFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gUnVuSGlzdG9yeUNvbnRyb2xsZXIoY3R4LCBuZXh0KSB7XG4gICAgdHJhbnNpdGlvbihjdHgsIG5leHQsIDxSdW5IaXN0b3J5UGFnZSAvPik7XG59XG4iXX0=
