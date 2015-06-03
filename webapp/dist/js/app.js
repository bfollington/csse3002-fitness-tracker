(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Router = require("Router.jsx").Router;

var DashboardController = require("./pages/controllers/DashboardController.jsx").DashboardController;

var RunHistoryController = require("./pages/controllers/RunHistoryController.jsx").RunHistoryController;

var FileNotFoundController = require("./pages/controllers/FileNotFoundController.jsx").FileNotFoundController;

var RunDataController = require("./pages/controllers/RunDataController.jsx").RunDataController;

var moment = require("moment");

(function () {
    /* A global object to hold utilities. */
    window.app = {};

    /* Expose the moment module. */
    window.app.moment = moment;
    /* Specify the global formats for time and date. */
    window.app.dayFormat = "dddd, MMM Do YYYY";
    window.app.timeFormat = "h:mm:ss a";

    /* Specify the routes for each screen. */
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
//! version : 2.10.2
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

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return Object.prototype.toString.call(input) === '[object Date]' || input instanceof Date;
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

    function valid__isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0 &&
                    m._pf.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
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
            to._pf = from._pf;
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
        return obj instanceof Moment || (obj != null && hasOwnProp(obj, '_isAMomentObject'));
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
            config._pf.invalidMonth = input;
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

        if (a && m._pf.overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }

        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;
        return extend(function () {
            if (firstTime) {
                warn(msg);
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
            config._pf.iso = true;
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
                config._pf._overflowDayOfYear = true;
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
        config._pf.empty = true;

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
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._pf.bigHour === true && config._a[HOUR] <= 12) {
            config._pf.bigHour = undefined;
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
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

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
        c._pf = defaultParsingFlags();

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
        return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
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
        return extend({}, this._pf);
    }

    function invalidAt () {
        return this._pf.overflow;
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
            config._pf.invalidWeekday = input;
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
        config._pf.bigHour = true;
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
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + /\d{1,2}/.source);
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
                case 'week'   : return days / 7            + milliseconds / 6048e5;
                case 'day'    : return days                + milliseconds / 864e5;
                case 'hour'   : return days * 24           + milliseconds / 36e5;
                case 'minute' : return days * 24 * 60      + milliseconds / 6e4;
                case 'second' : return days * 24 * 60 * 60 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 24 * 60 * 60 * 1000) + milliseconds;
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


    utils_hooks__hooks.version = '2.10.2';

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

/*
 * Handles routing pages within the application using page.js.
 */

var Router = exports.Router = (function () {
    function Router(mountPointId) {
        _classCallCheck(this, Router);

        /* Mount the application to the element specified by the given ID. */
        this.routes = {};

        window.app.mountPoint = document.getElementById(mountPointId);
        this.mountPoint = window.app.mountPoint;
    }

    _createClass(Router, {
        addRoute: {

            /*
             * Add a mapping from route URL to Javascript controller.
             */

            value: function addRoute(route, controller) {
                this.routes[route] = controller;
            }
        },
        start: {
            value: function start() {

                var me = this;
                /* Register each of the routes with page.js. */
                for (var i in this.routes) {
                    page(i, this.routes[i]);
                }

                /*
                 * If a page is not matched by the existing routes, fall through
                 * to the 404 not found page.
                 */
                page("*", function (ctx, next) {
                    console.error("404", ctx, next);
                    React.render(React.createElement(FileNotFoundPage, null), window.app.mountPoint);
                });

                /* Start the router. */
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
/*
 * A modal object which is responsible for viewing and upateing the settings.
 */

var AppSettingsModal = exports.AppSettingsModal = (function (_React$Component) {
    function AppSettingsModal(props) {
        _classCallCheck(this, AppSettingsModal);

        _get(Object.getPrototypeOf(AppSettingsModal.prototype), "constructor", this).call(this, props);

        /* Set the default state. */
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
                /* Bind the shown function to the modal shown event. */
                $(React.findDOMNode(this)).on("shown.bs.modal", this.shown.bind(this));
            }
        },
        shown: {

            /*
             * When the modal is shown, retrieve the current settings from the server
             * and populate the form appropriately.
             */

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

            /*
             * Handles the saving of the form values to the server.
             */

            value: function beginSaveSettings() {

                /* Indicate that the save has begun, to hide the save button. */
                this.setState({ saveSettingsInProgress: true });

                /* Construct the request from the form values. */
                var params = {
                    weight: this.state.weight,
                    height: this.state.height,
                    age: this.state.age,
                    gender: this.state.gender
                };

                /*
                 * Post the values to the server to update the settings, and hide
                 * the modal.
                 */
                $.post("/api/update_settings", params, (function (result) {
                    this.setState({ saveSettingsInProgress: false });

                    $(React.findDOMNode(this)).modal("hide");
                }).bind(this));
            }
        },
        weightChanged: {

            /*
             * Update the stored weight in response to the field udpating.
             * Weight is stored in kiograms.
             */

            value: function weightChanged(e) {
                this.setState({ weight: parseInt(e.target.value) });
            }
        },
        heightChanged: {

            /*
             * Update the stored height in response to the field udpating.
             * Height is stored in centimeters.
             */

            value: function heightChanged(e) {
                this.setState({ height: parseInt(e.target.value) });
            }
        },
        genderChanged: {

            /*
             * Update the stored gender in response to the field udpating.
             * Gender is stored as a string: 'male', 'female' or 'other'..
             */

            value: function genderChanged(e) {
                this.setState({ gender: e.target.value });
            }
        },
        ageChanged: {

            /*
             * Update the stored age in response to the field udpating.
             * Height is stored in years.
             */

            value: function ageChanged(e) {
                this.setState({ age: parseInt(e.target.value) });
            }
        },
        getForm: {

            /*
             * Construct the form to be displayed in the modal, given the parameters.
             */

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

                /* Construct the content of the modal. */
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

                        setTimeout(function () {
                            window.location.reload();
                        }, 500);
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

        this.defaultOptsString = "size=1168x480&maptype=roadmap";
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
                    dist *= 600;
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
                        strokeWeight: 3
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
                                                "Duration"
                                            ),
                                            React.createElement(
                                                "th",
                                                null,
                                                "Distance Covered"
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
                                                    parseInt(run.duration / 60),
                                                    " mins ",
                                                    run.duration % 60,
                                                    " seconds"
                                                ),
                                                React.createElement(
                                                    "td",
                                                    null,
                                                    Math.round(run.distance),
                                                    " m"
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

/*
 * Simple page served when a route cannot be found.
 */

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
                                Math.round(this.state.run.distance),
                                " m"
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
                                " km/h"
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
                                Math.round(this.state.run.kilojoules),
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


/*
 * Handles transition to the dashboard page.
 */
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


/*
 * Handles transition to the 404 page.
 */
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
/*
 * Handles the transition from one page to the next.
 * Mounts the new component, and removes the previous once
 * the page has been animated in.
 */
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


/*
 * Handles transition to the run data page. Accepts a run ID as
 * a parameter, which is passed to the page.
 */
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


/*
 * Handles transition to the run history page.
 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvQmVuL1Byb2plY3RzL1B5dGhvbi9jc3NlMzAwMi93ZWJhcHAvc3JjL2pzeC9hcHAuanN4Iiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9jaGFydC5qcy9DaGFydC5qcyIsIm5vZGVfbW9kdWxlcy9tb21lbnQvbW9tZW50LmpzIiwibm9kZV9tb2R1bGVzL3BhZ2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcGFnZS9ub2RlX21vZHVsZXMvcGF0aC10by1yZWdleHAvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcGFnZS9ub2RlX21vZHVsZXMvcGF0aC10by1yZWdleHAvbm9kZV9tb2R1bGVzL2lzYXJyYXkvaW5kZXguanMiLCIvVXNlcnMvQmVuL1Byb2plY3RzL1B5dGhvbi9jc3NlMzAwMi93ZWJhcHAvc3JjL2pzeC9Sb3V0ZXIuanN4IiwiL1VzZXJzL0Jlbi9Qcm9qZWN0cy9QeXRob24vY3NzZTMwMDIvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9BcHBTZXR0aW5nc01vZGFsLmpzeCIsIi9Vc2Vycy9CZW4vUHJvamVjdHMvUHl0aG9uL2Nzc2UzMDAyL3dlYmFwcC9zcmMvanN4L2NvbXBvbmVudHMvQmFyQ2hhcnQuanN4IiwiL1VzZXJzL0Jlbi9Qcm9qZWN0cy9QeXRob24vY3NzZTMwMDIvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9Cb2R5LmpzeCIsIi9Vc2Vycy9CZW4vUHJvamVjdHMvUHl0aG9uL2Nzc2UzMDAyL3dlYmFwcC9zcmMvanN4L2NvbXBvbmVudHMvSW1wb3J0RGF0YU1vZGFsLmpzeCIsIi9Vc2Vycy9CZW4vUHJvamVjdHMvUHl0aG9uL2Nzc2UzMDAyL3dlYmFwcC9zcmMvanN4L2NvbXBvbmVudHMvTGluZUNoYXJ0LmpzeCIsIi9Vc2Vycy9CZW4vUHJvamVjdHMvUHl0aG9uL2Nzc2UzMDAyL3dlYmFwcC9zcmMvanN4L2NvbXBvbmVudHMvTWFpbk5hdmJhci5qc3giLCIvVXNlcnMvQmVuL1Byb2plY3RzL1B5dGhvbi9jc3NlMzAwMi93ZWJhcHAvc3JjL2pzeC9jb21wb25lbnRzL01hcC5qc3giLCIvVXNlcnMvQmVuL1Byb2plY3RzL1B5dGhvbi9jc3NlMzAwMi93ZWJhcHAvc3JjL2pzeC9jb21wb25lbnRzL01vZGFsVHJpZ2dlci5qc3giLCIvVXNlcnMvQmVuL1Byb2plY3RzL1B5dGhvbi9jc3NlMzAwMi93ZWJhcHAvc3JjL2pzeC9jb21wb25lbnRzL05hdmJhci5qc3giLCIvVXNlcnMvQmVuL1Byb2plY3RzL1B5dGhvbi9jc3NlMzAwMi93ZWJhcHAvc3JjL2pzeC9jb21wb25lbnRzL1BpZUNoYXJ0LmpzeCIsIi9Vc2Vycy9CZW4vUHJvamVjdHMvUHl0aG9uL2Nzc2UzMDAyL3dlYmFwcC9zcmMvanN4L2NvbXBvbmVudHMvUmFkYXJDaGFydC5qc3giLCIvVXNlcnMvQmVuL1Byb2plY3RzL1B5dGhvbi9jc3NlMzAwMi93ZWJhcHAvc3JjL2pzeC9jb21wb25lbnRzL1NoYXJlUnVuTW9kYWwuanN4IiwiL1VzZXJzL0Jlbi9Qcm9qZWN0cy9QeXRob24vY3NzZTMwMDIvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9Tb2NpYWxTaGFyaW5nLmpzeCIsIi9Vc2Vycy9CZW4vUHJvamVjdHMvUHl0aG9uL2Nzc2UzMDAyL3dlYmFwcC9zcmMvanN4L2NvbXBvbmVudHMvVXBsb2FkRGF0YUJ1dHRvbi5qc3giLCIvVXNlcnMvQmVuL1Byb2plY3RzL1B5dGhvbi9jc3NlMzAwMi93ZWJhcHAvc3JjL2pzeC9wYWdlcy9EYXNoYm9hcmRQYWdlLmpzeCIsIi9Vc2Vycy9CZW4vUHJvamVjdHMvUHl0aG9uL2Nzc2UzMDAyL3dlYmFwcC9zcmMvanN4L3BhZ2VzL0ZpbGVOb3RGb3VuZFBhZ2UuanN4IiwiL1VzZXJzL0Jlbi9Qcm9qZWN0cy9QeXRob24vY3NzZTMwMDIvd2ViYXBwL3NyYy9qc3gvcGFnZXMvUnVuRGF0YVBhZ2UuanN4IiwiL1VzZXJzL0Jlbi9Qcm9qZWN0cy9QeXRob24vY3NzZTMwMDIvd2ViYXBwL3NyYy9qc3gvcGFnZXMvUnVuSGlzdG9yeVBhZ2UuanN4IiwiL1VzZXJzL0Jlbi9Qcm9qZWN0cy9QeXRob24vY3NzZTMwMDIvd2ViYXBwL3NyYy9qc3gvcGFnZXMvY29udHJvbGxlcnMvRGFzaGJvYXJkQ29udHJvbGxlci5qc3giLCIvVXNlcnMvQmVuL1Byb2plY3RzL1B5dGhvbi9jc3NlMzAwMi93ZWJhcHAvc3JjL2pzeC9wYWdlcy9jb250cm9sbGVycy9GaWxlTm90Rm91bmRDb250cm9sbGVyLmpzeCIsIi9Vc2Vycy9CZW4vUHJvamVjdHMvUHl0aG9uL2Nzc2UzMDAyL3dlYmFwcC9zcmMvanN4L3BhZ2VzL2NvbnRyb2xsZXJzL1BhZ2VUcmFuc2l0aW9uLmpzeCIsIi9Vc2Vycy9CZW4vUHJvamVjdHMvUHl0aG9uL2Nzc2UzMDAyL3dlYmFwcC9zcmMvanN4L3BhZ2VzL2NvbnRyb2xsZXJzL1J1bkRhdGFDb250cm9sbGVyLmpzeCIsIi9Vc2Vycy9CZW4vUHJvamVjdHMvUHl0aG9uL2Nzc2UzMDAyL3dlYmFwcC9zcmMvanN4L3BhZ2VzL2NvbnRyb2xsZXJzL1J1bkhpc3RvcnlDb250cm9sbGVyLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0lDQVEsTUFBTSxXQUFPLFlBQVksRUFBekIsTUFBTTs7SUFDTixtQkFBbUIsV0FBTyw2Q0FBNkMsRUFBdkUsbUJBQW1COztJQUNuQixvQkFBb0IsV0FBTyw4Q0FBOEMsRUFBekUsb0JBQW9COztJQUNwQixzQkFBc0IsV0FBTyxnREFBZ0QsRUFBN0Usc0JBQXNCOztJQUN0QixpQkFBaUIsV0FBTywyQ0FBMkMsRUFBbkUsaUJBQWlCOztBQUd6QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRS9CLENBQUMsWUFBVzs7QUFFUixVQUFNLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQzs7O0FBR2hCLFVBQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFM0IsVUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsbUJBQW1CLENBQUM7QUFDM0MsVUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDOzs7QUFHcEMsVUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEMsUUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7O0FBRS9CLFVBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLHNCQUFzQixDQUFDLENBQUM7QUFDaEQsVUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUNuRCxVQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0FBQ2xELFVBQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLGlCQUFpQixDQUFDLENBQUM7QUFDaEQsVUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUMsQ0FBQzs7QUFFMUMsVUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0NBQ2xCLENBQUEsRUFBRyxDQUFDOzs7QUM5Qkw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3A1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDMWdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcm1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFNQTtBQUNBO0FB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ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge1JvdXRlcn0gZnJvbSAnUm91dGVyLmpzeCc7XG5pbXBvcnQge0Rhc2hib2FyZENvbnRyb2xsZXJ9IGZyb20gJy4vcGFnZXMvY29udHJvbGxlcnMvRGFzaGJvYXJkQ29udHJvbGxlci5qc3gnO1xuaW1wb3J0IHtSdW5IaXN0b3J5Q29udHJvbGxlcn0gZnJvbSAnLi9wYWdlcy9jb250cm9sbGVycy9SdW5IaXN0b3J5Q29udHJvbGxlci5qc3gnO1xuaW1wb3J0IHtGaWxlTm90Rm91bmRDb250cm9sbGVyfSBmcm9tICcuL3BhZ2VzL2NvbnRyb2xsZXJzL0ZpbGVOb3RGb3VuZENvbnRyb2xsZXIuanN4JztcbmltcG9ydCB7UnVuRGF0YUNvbnRyb2xsZXJ9IGZyb20gJy4vcGFnZXMvY29udHJvbGxlcnMvUnVuRGF0YUNvbnRyb2xsZXIuanN4JztcblxuXG52YXIgbW9tZW50ID0gcmVxdWlyZShcIm1vbWVudFwiKTtcblxuKGZ1bmN0aW9uKCkge1xuICAgIC8qIEEgZ2xvYmFsIG9iamVjdCB0byBob2xkIHV0aWxpdGllcy4gKi9cbiAgICB3aW5kb3cuYXBwID0ge307XG5cbiAgICAvKiBFeHBvc2UgdGhlIG1vbWVudCBtb2R1bGUuICovXG4gICAgd2luZG93LmFwcC5tb21lbnQgPSBtb21lbnQ7XG4gICAgLyogU3BlY2lmeSB0aGUgZ2xvYmFsIGZvcm1hdHMgZm9yIHRpbWUgYW5kIGRhdGUuICovXG4gICAgd2luZG93LmFwcC5kYXlGb3JtYXQgPSBcImRkZGQsIE1NTSBEbyBZWVlZXCI7XG4gICAgd2luZG93LmFwcC50aW1lRm9ybWF0ID0gXCJoOm1tOnNzIGFcIjtcblxuICAgIC8qIFNwZWNpZnkgdGhlIHJvdXRlcyBmb3IgZWFjaCBzY3JlZW4uICovXG4gICAgd2luZG93LmFwcC5yb3V0ZXIgPSBuZXcgUm91dGVyKCdtb3VudCcpO1xuICAgIHZhciByb3V0ZXIgPSB3aW5kb3cuYXBwLnJvdXRlcjtcblxuICAgIHJvdXRlci5hZGRSb3V0ZSgnLzQwNCcsIEZpbGVOb3RGb3VuZENvbnRyb2xsZXIpO1xuICAgIHJvdXRlci5hZGRSb3V0ZSgnL2Rhc2hib2FyZCcsIERhc2hib2FyZENvbnRyb2xsZXIpO1xuICAgIHJvdXRlci5hZGRSb3V0ZSgnL2hpc3RvcnknLCBSdW5IaXN0b3J5Q29udHJvbGxlcik7XG4gICAgcm91dGVyLmFkZFJvdXRlKCcvcnVuLzpydW4nLCBSdW5EYXRhQ29udHJvbGxlcik7XG4gICAgcm91dGVyLmFkZFJvdXRlKCcvJywgRGFzaGJvYXJkQ29udHJvbGxlcik7XG5cbiAgICByb3V0ZXIuc3RhcnQoKTtcbn0pKCk7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IHRydWU7XG4gICAgdmFyIGN1cnJlbnRRdWV1ZTtcbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXVlW2ldKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xufVxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICBxdWV1ZS5wdXNoKGZ1bik7XG4gICAgaWYgKCFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyohXG4gKiBDaGFydC5qc1xuICogaHR0cDovL2NoYXJ0anMub3JnL1xuICogVmVyc2lvbjogMS4wLjJcbiAqXG4gKiBDb3B5cmlnaHQgMjAxNSBOaWNrIERvd25pZVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbm5uaWNrL0NoYXJ0LmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiAqL1xuXG5cbihmdW5jdGlvbigpe1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdC8vRGVjbGFyZSByb290IHZhcmlhYmxlIC0gd2luZG93IGluIHRoZSBicm93c2VyLCBnbG9iYWwgb24gdGhlIHNlcnZlclxuXHR2YXIgcm9vdCA9IHRoaXMsXG5cdFx0cHJldmlvdXMgPSByb290LkNoYXJ0O1xuXG5cdC8vT2NjdXB5IHRoZSBnbG9iYWwgdmFyaWFibGUgb2YgQ2hhcnQsIGFuZCBjcmVhdGUgYSBzaW1wbGUgYmFzZSBjbGFzc1xuXHR2YXIgQ2hhcnQgPSBmdW5jdGlvbihjb250ZXh0KXtcblx0XHR2YXIgY2hhcnQgPSB0aGlzO1xuXHRcdHRoaXMuY2FudmFzID0gY29udGV4dC5jYW52YXM7XG5cblx0XHR0aGlzLmN0eCA9IGNvbnRleHQ7XG5cblx0XHQvL1ZhcmlhYmxlcyBnbG9iYWwgdG8gdGhlIGNoYXJ0XG5cdFx0dmFyIGNvbXB1dGVEaW1lbnNpb24gPSBmdW5jdGlvbihlbGVtZW50LGRpbWVuc2lvbilcblx0XHR7XG5cdFx0XHRpZiAoZWxlbWVudFsnb2Zmc2V0JytkaW1lbnNpb25dKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gZWxlbWVudFsnb2Zmc2V0JytkaW1lbnNpb25dO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKGRpbWVuc2lvbik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIHdpZHRoID0gdGhpcy53aWR0aCA9IGNvbXB1dGVEaW1lbnNpb24oY29udGV4dC5jYW52YXMsJ1dpZHRoJyk7XG5cdFx0dmFyIGhlaWdodCA9IHRoaXMuaGVpZ2h0ID0gY29tcHV0ZURpbWVuc2lvbihjb250ZXh0LmNhbnZhcywnSGVpZ2h0Jyk7XG5cblx0XHQvLyBGaXJlZm94IHJlcXVpcmVzIHRoaXMgdG8gd29yayBjb3JyZWN0bHlcblx0XHRjb250ZXh0LmNhbnZhcy53aWR0aCAgPSB3aWR0aDtcblx0XHRjb250ZXh0LmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cblx0XHR2YXIgd2lkdGggPSB0aGlzLndpZHRoID0gY29udGV4dC5jYW52YXMud2lkdGg7XG5cdFx0dmFyIGhlaWdodCA9IHRoaXMuaGVpZ2h0ID0gY29udGV4dC5jYW52YXMuaGVpZ2h0O1xuXHRcdHRoaXMuYXNwZWN0UmF0aW8gPSB0aGlzLndpZHRoIC8gdGhpcy5oZWlnaHQ7XG5cdFx0Ly9IaWdoIHBpeGVsIGRlbnNpdHkgZGlzcGxheXMgLSBtdWx0aXBseSB0aGUgc2l6ZSBvZiB0aGUgY2FudmFzIGhlaWdodC93aWR0aCBieSB0aGUgZGV2aWNlIHBpeGVsIHJhdGlvLCB0aGVuIHNjYWxlLlxuXHRcdGhlbHBlcnMucmV0aW5hU2NhbGUodGhpcyk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblx0Ly9HbG9iYWxseSBleHBvc2UgdGhlIGRlZmF1bHRzIHRvIGFsbG93IGZvciB1c2VyIHVwZGF0aW5nL2NoYW5naW5nXG5cdENoYXJ0LmRlZmF1bHRzID0ge1xuXHRcdGdsb2JhbDoge1xuXHRcdFx0Ly8gQm9vbGVhbiAtIFdoZXRoZXIgdG8gYW5pbWF0ZSB0aGUgY2hhcnRcblx0XHRcdGFuaW1hdGlvbjogdHJ1ZSxcblxuXHRcdFx0Ly8gTnVtYmVyIC0gTnVtYmVyIG9mIGFuaW1hdGlvbiBzdGVwc1xuXHRcdFx0YW5pbWF0aW9uU3RlcHM6IDYwLFxuXG5cdFx0XHQvLyBTdHJpbmcgLSBBbmltYXRpb24gZWFzaW5nIGVmZmVjdFxuXHRcdFx0YW5pbWF0aW9uRWFzaW5nOiBcImVhc2VPdXRRdWFydFwiLFxuXG5cdFx0XHQvLyBCb29sZWFuIC0gSWYgd2Ugc2hvdWxkIHNob3cgdGhlIHNjYWxlIGF0IGFsbFxuXHRcdFx0c2hvd1NjYWxlOiB0cnVlLFxuXG5cdFx0XHQvLyBCb29sZWFuIC0gSWYgd2Ugd2FudCB0byBvdmVycmlkZSB3aXRoIGEgaGFyZCBjb2RlZCBzY2FsZVxuXHRcdFx0c2NhbGVPdmVycmlkZTogZmFsc2UsXG5cblx0XHRcdC8vICoqIFJlcXVpcmVkIGlmIHNjYWxlT3ZlcnJpZGUgaXMgdHJ1ZSAqKlxuXHRcdFx0Ly8gTnVtYmVyIC0gVGhlIG51bWJlciBvZiBzdGVwcyBpbiBhIGhhcmQgY29kZWQgc2NhbGVcblx0XHRcdHNjYWxlU3RlcHM6IG51bGwsXG5cdFx0XHQvLyBOdW1iZXIgLSBUaGUgdmFsdWUganVtcCBpbiB0aGUgaGFyZCBjb2RlZCBzY2FsZVxuXHRcdFx0c2NhbGVTdGVwV2lkdGg6IG51bGwsXG5cdFx0XHQvLyBOdW1iZXIgLSBUaGUgc2NhbGUgc3RhcnRpbmcgdmFsdWVcblx0XHRcdHNjYWxlU3RhcnRWYWx1ZTogbnVsbCxcblxuXHRcdFx0Ly8gU3RyaW5nIC0gQ29sb3VyIG9mIHRoZSBzY2FsZSBsaW5lXG5cdFx0XHRzY2FsZUxpbmVDb2xvcjogXCJyZ2JhKDAsMCwwLC4xKVwiLFxuXG5cdFx0XHQvLyBOdW1iZXIgLSBQaXhlbCB3aWR0aCBvZiB0aGUgc2NhbGUgbGluZVxuXHRcdFx0c2NhbGVMaW5lV2lkdGg6IDEsXG5cblx0XHRcdC8vIEJvb2xlYW4gLSBXaGV0aGVyIHRvIHNob3cgbGFiZWxzIG9uIHRoZSBzY2FsZVxuXHRcdFx0c2NhbGVTaG93TGFiZWxzOiB0cnVlLFxuXG5cdFx0XHQvLyBJbnRlcnBvbGF0ZWQgSlMgc3RyaW5nIC0gY2FuIGFjY2VzcyB2YWx1ZVxuXHRcdFx0c2NhbGVMYWJlbDogXCI8JT12YWx1ZSU+XCIsXG5cblx0XHRcdC8vIEJvb2xlYW4gLSBXaGV0aGVyIHRoZSBzY2FsZSBzaG91bGQgc3RpY2sgdG8gaW50ZWdlcnMsIGFuZCBub3Qgc2hvdyBhbnkgZmxvYXRzIGV2ZW4gaWYgZHJhd2luZyBzcGFjZSBpcyB0aGVyZVxuXHRcdFx0c2NhbGVJbnRlZ2Vyc09ubHk6IHRydWUsXG5cblx0XHRcdC8vIEJvb2xlYW4gLSBXaGV0aGVyIHRoZSBzY2FsZSBzaG91bGQgc3RhcnQgYXQgemVybywgb3IgYW4gb3JkZXIgb2YgbWFnbml0dWRlIGRvd24gZnJvbSB0aGUgbG93ZXN0IHZhbHVlXG5cdFx0XHRzY2FsZUJlZ2luQXRaZXJvOiBmYWxzZSxcblxuXHRcdFx0Ly8gU3RyaW5nIC0gU2NhbGUgbGFiZWwgZm9udCBkZWNsYXJhdGlvbiBmb3IgdGhlIHNjYWxlIGxhYmVsXG5cdFx0XHRzY2FsZUZvbnRGYW1pbHk6IFwiJ0hlbHZldGljYSBOZXVlJywgJ0hlbHZldGljYScsICdBcmlhbCcsIHNhbnMtc2VyaWZcIixcblxuXHRcdFx0Ly8gTnVtYmVyIC0gU2NhbGUgbGFiZWwgZm9udCBzaXplIGluIHBpeGVsc1xuXHRcdFx0c2NhbGVGb250U2l6ZTogMTIsXG5cblx0XHRcdC8vIFN0cmluZyAtIFNjYWxlIGxhYmVsIGZvbnQgd2VpZ2h0IHN0eWxlXG5cdFx0XHRzY2FsZUZvbnRTdHlsZTogXCJub3JtYWxcIixcblxuXHRcdFx0Ly8gU3RyaW5nIC0gU2NhbGUgbGFiZWwgZm9udCBjb2xvdXJcblx0XHRcdHNjYWxlRm9udENvbG9yOiBcIiM2NjZcIixcblxuXHRcdFx0Ly8gQm9vbGVhbiAtIHdoZXRoZXIgb3Igbm90IHRoZSBjaGFydCBzaG91bGQgYmUgcmVzcG9uc2l2ZSBhbmQgcmVzaXplIHdoZW4gdGhlIGJyb3dzZXIgZG9lcy5cblx0XHRcdHJlc3BvbnNpdmU6IGZhbHNlLFxuXG5cdFx0XHQvLyBCb29sZWFuIC0gd2hldGhlciB0byBtYWludGFpbiB0aGUgc3RhcnRpbmcgYXNwZWN0IHJhdGlvIG9yIG5vdCB3aGVuIHJlc3BvbnNpdmUsIGlmIHNldCB0byBmYWxzZSwgd2lsbCB0YWtlIHVwIGVudGlyZSBjb250YWluZXJcblx0XHRcdG1haW50YWluQXNwZWN0UmF0aW86IHRydWUsXG5cblx0XHRcdC8vIEJvb2xlYW4gLSBEZXRlcm1pbmVzIHdoZXRoZXIgdG8gZHJhdyB0b29sdGlwcyBvbiB0aGUgY2FudmFzIG9yIG5vdCAtIGF0dGFjaGVzIGV2ZW50cyB0byB0b3VjaG1vdmUgJiBtb3VzZW1vdmVcblx0XHRcdHNob3dUb29sdGlwczogdHJ1ZSxcblxuXHRcdFx0Ly8gQm9vbGVhbiAtIERldGVybWluZXMgd2hldGhlciB0byBkcmF3IGJ1aWx0LWluIHRvb2x0aXAgb3IgY2FsbCBjdXN0b20gdG9vbHRpcCBmdW5jdGlvblxuXHRcdFx0Y3VzdG9tVG9vbHRpcHM6IGZhbHNlLFxuXG5cdFx0XHQvLyBBcnJheSAtIEFycmF5IG9mIHN0cmluZyBuYW1lcyB0byBhdHRhY2ggdG9vbHRpcCBldmVudHNcblx0XHRcdHRvb2x0aXBFdmVudHM6IFtcIm1vdXNlbW92ZVwiLCBcInRvdWNoc3RhcnRcIiwgXCJ0b3VjaG1vdmVcIiwgXCJtb3VzZW91dFwiXSxcblxuXHRcdFx0Ly8gU3RyaW5nIC0gVG9vbHRpcCBiYWNrZ3JvdW5kIGNvbG91clxuXHRcdFx0dG9vbHRpcEZpbGxDb2xvcjogXCJyZ2JhKDAsMCwwLDAuOClcIixcblxuXHRcdFx0Ly8gU3RyaW5nIC0gVG9vbHRpcCBsYWJlbCBmb250IGRlY2xhcmF0aW9uIGZvciB0aGUgc2NhbGUgbGFiZWxcblx0XHRcdHRvb2x0aXBGb250RmFtaWx5OiBcIidIZWx2ZXRpY2EgTmV1ZScsICdIZWx2ZXRpY2EnLCAnQXJpYWwnLCBzYW5zLXNlcmlmXCIsXG5cblx0XHRcdC8vIE51bWJlciAtIFRvb2x0aXAgbGFiZWwgZm9udCBzaXplIGluIHBpeGVsc1xuXHRcdFx0dG9vbHRpcEZvbnRTaXplOiAxNCxcblxuXHRcdFx0Ly8gU3RyaW5nIC0gVG9vbHRpcCBmb250IHdlaWdodCBzdHlsZVxuXHRcdFx0dG9vbHRpcEZvbnRTdHlsZTogXCJub3JtYWxcIixcblxuXHRcdFx0Ly8gU3RyaW5nIC0gVG9vbHRpcCBsYWJlbCBmb250IGNvbG91clxuXHRcdFx0dG9vbHRpcEZvbnRDb2xvcjogXCIjZmZmXCIsXG5cblx0XHRcdC8vIFN0cmluZyAtIFRvb2x0aXAgdGl0bGUgZm9udCBkZWNsYXJhdGlvbiBmb3IgdGhlIHNjYWxlIGxhYmVsXG5cdFx0XHR0b29sdGlwVGl0bGVGb250RmFtaWx5OiBcIidIZWx2ZXRpY2EgTmV1ZScsICdIZWx2ZXRpY2EnLCAnQXJpYWwnLCBzYW5zLXNlcmlmXCIsXG5cblx0XHRcdC8vIE51bWJlciAtIFRvb2x0aXAgdGl0bGUgZm9udCBzaXplIGluIHBpeGVsc1xuXHRcdFx0dG9vbHRpcFRpdGxlRm9udFNpemU6IDE0LFxuXG5cdFx0XHQvLyBTdHJpbmcgLSBUb29sdGlwIHRpdGxlIGZvbnQgd2VpZ2h0IHN0eWxlXG5cdFx0XHR0b29sdGlwVGl0bGVGb250U3R5bGU6IFwiYm9sZFwiLFxuXG5cdFx0XHQvLyBTdHJpbmcgLSBUb29sdGlwIHRpdGxlIGZvbnQgY29sb3VyXG5cdFx0XHR0b29sdGlwVGl0bGVGb250Q29sb3I6IFwiI2ZmZlwiLFxuXG5cdFx0XHQvLyBOdW1iZXIgLSBwaXhlbCB3aWR0aCBvZiBwYWRkaW5nIGFyb3VuZCB0b29sdGlwIHRleHRcblx0XHRcdHRvb2x0aXBZUGFkZGluZzogNixcblxuXHRcdFx0Ly8gTnVtYmVyIC0gcGl4ZWwgd2lkdGggb2YgcGFkZGluZyBhcm91bmQgdG9vbHRpcCB0ZXh0XG5cdFx0XHR0b29sdGlwWFBhZGRpbmc6IDYsXG5cblx0XHRcdC8vIE51bWJlciAtIFNpemUgb2YgdGhlIGNhcmV0IG9uIHRoZSB0b29sdGlwXG5cdFx0XHR0b29sdGlwQ2FyZXRTaXplOiA4LFxuXG5cdFx0XHQvLyBOdW1iZXIgLSBQaXhlbCByYWRpdXMgb2YgdGhlIHRvb2x0aXAgYm9yZGVyXG5cdFx0XHR0b29sdGlwQ29ybmVyUmFkaXVzOiA2LFxuXG5cdFx0XHQvLyBOdW1iZXIgLSBQaXhlbCBvZmZzZXQgZnJvbSBwb2ludCB4IHRvIHRvb2x0aXAgZWRnZVxuXHRcdFx0dG9vbHRpcFhPZmZzZXQ6IDEwLFxuXG5cdFx0XHQvLyBTdHJpbmcgLSBUZW1wbGF0ZSBzdHJpbmcgZm9yIHNpbmdsZSB0b29sdGlwc1xuXHRcdFx0dG9vbHRpcFRlbXBsYXRlOiBcIjwlaWYgKGxhYmVsKXslPjwlPWxhYmVsJT46IDwlfSU+PCU9IHZhbHVlICU+XCIsXG5cblx0XHRcdC8vIFN0cmluZyAtIFRlbXBsYXRlIHN0cmluZyBmb3Igc2luZ2xlIHRvb2x0aXBzXG5cdFx0XHRtdWx0aVRvb2x0aXBUZW1wbGF0ZTogXCI8JT0gdmFsdWUgJT5cIixcblxuXHRcdFx0Ly8gU3RyaW5nIC0gQ29sb3VyIGJlaGluZCB0aGUgbGVnZW5kIGNvbG91ciBibG9ja1xuXHRcdFx0bXVsdGlUb29sdGlwS2V5QmFja2dyb3VuZDogJyNmZmYnLFxuXG5cdFx0XHQvLyBGdW5jdGlvbiAtIFdpbGwgZmlyZSBvbiBhbmltYXRpb24gcHJvZ3Jlc3Npb24uXG5cdFx0XHRvbkFuaW1hdGlvblByb2dyZXNzOiBmdW5jdGlvbigpe30sXG5cblx0XHRcdC8vIEZ1bmN0aW9uIC0gV2lsbCBmaXJlIG9uIGFuaW1hdGlvbiBjb21wbGV0aW9uLlxuXHRcdFx0b25BbmltYXRpb25Db21wbGV0ZTogZnVuY3Rpb24oKXt9XG5cblx0XHR9XG5cdH07XG5cblx0Ly9DcmVhdGUgYSBkaWN0aW9uYXJ5IG9mIGNoYXJ0IHR5cGVzLCB0byBhbGxvdyBmb3IgZXh0ZW5zaW9uIG9mIGV4aXN0aW5nIHR5cGVzXG5cdENoYXJ0LnR5cGVzID0ge307XG5cblx0Ly9HbG9iYWwgQ2hhcnQgaGVscGVycyBvYmplY3QgZm9yIHV0aWxpdHkgbWV0aG9kcyBhbmQgY2xhc3Nlc1xuXHR2YXIgaGVscGVycyA9IENoYXJ0LmhlbHBlcnMgPSB7fTtcblxuXHRcdC8vLS0gQmFzaWMganMgdXRpbGl0eSBtZXRob2RzXG5cdHZhciBlYWNoID0gaGVscGVycy5lYWNoID0gZnVuY3Rpb24obG9vcGFibGUsY2FsbGJhY2ssc2VsZil7XG5cdFx0XHR2YXIgYWRkaXRpb25hbEFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xuXHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIG51bGwgb3IgdW5kZWZpbmVkIGZpcnN0bHkuXG5cdFx0XHRpZiAobG9vcGFibGUpe1xuXHRcdFx0XHRpZiAobG9vcGFibGUubGVuZ3RoID09PSArbG9vcGFibGUubGVuZ3RoKXtcblx0XHRcdFx0XHR2YXIgaTtcblx0XHRcdFx0XHRmb3IgKGk9MDsgaTxsb29wYWJsZS5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0XHRjYWxsYmFjay5hcHBseShzZWxmLFtsb29wYWJsZVtpXSwgaV0uY29uY2F0KGFkZGl0aW9uYWxBcmdzKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaXRlbSBpbiBsb29wYWJsZSl7XG5cdFx0XHRcdFx0XHRjYWxsYmFjay5hcHBseShzZWxmLFtsb29wYWJsZVtpdGVtXSxpdGVtXS5jb25jYXQoYWRkaXRpb25hbEFyZ3MpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdGNsb25lID0gaGVscGVycy5jbG9uZSA9IGZ1bmN0aW9uKG9iail7XG5cdFx0XHR2YXIgb2JqQ2xvbmUgPSB7fTtcblx0XHRcdGVhY2gob2JqLGZ1bmN0aW9uKHZhbHVlLGtleSl7XG5cdFx0XHRcdGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkgb2JqQ2xvbmVba2V5XSA9IHZhbHVlO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gb2JqQ2xvbmU7XG5cdFx0fSxcblx0XHRleHRlbmQgPSBoZWxwZXJzLmV4dGVuZCA9IGZ1bmN0aW9uKGJhc2Upe1xuXHRcdFx0ZWFjaChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMSksIGZ1bmN0aW9uKGV4dGVuc2lvbk9iamVjdCkge1xuXHRcdFx0XHRlYWNoKGV4dGVuc2lvbk9iamVjdCxmdW5jdGlvbih2YWx1ZSxrZXkpe1xuXHRcdFx0XHRcdGlmIChleHRlbnNpb25PYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSkgYmFzZVtrZXldID0gdmFsdWU7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gYmFzZTtcblx0XHR9LFxuXHRcdG1lcmdlID0gaGVscGVycy5tZXJnZSA9IGZ1bmN0aW9uKGJhc2UsbWFzdGVyKXtcblx0XHRcdC8vTWVyZ2UgcHJvcGVydGllcyBpbiBsZWZ0IG9iamVjdCBvdmVyIHRvIGEgc2hhbGxvdyBjbG9uZSBvZiBvYmplY3QgcmlnaHQuXG5cdFx0XHR2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywwKTtcblx0XHRcdGFyZ3MudW5zaGlmdCh7fSk7XG5cdFx0XHRyZXR1cm4gZXh0ZW5kLmFwcGx5KG51bGwsIGFyZ3MpO1xuXHRcdH0sXG5cdFx0aW5kZXhPZiA9IGhlbHBlcnMuaW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5VG9TZWFyY2gsIGl0ZW0pe1xuXHRcdFx0aWYgKEFycmF5LnByb3RvdHlwZS5pbmRleE9mKSB7XG5cdFx0XHRcdHJldHVybiBhcnJheVRvU2VhcmNoLmluZGV4T2YoaXRlbSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5VG9TZWFyY2gubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRpZiAoYXJyYXlUb1NlYXJjaFtpXSA9PT0gaXRlbSkgcmV0dXJuIGk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0d2hlcmUgPSBoZWxwZXJzLndoZXJlID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgZmlsdGVyQ2FsbGJhY2spe1xuXHRcdFx0dmFyIGZpbHRlcmVkID0gW107XG5cblx0XHRcdGhlbHBlcnMuZWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0aWYgKGZpbHRlckNhbGxiYWNrKGl0ZW0pKXtcblx0XHRcdFx0XHRmaWx0ZXJlZC5wdXNoKGl0ZW0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIGZpbHRlcmVkO1xuXHRcdH0sXG5cdFx0ZmluZE5leHRXaGVyZSA9IGhlbHBlcnMuZmluZE5leHRXaGVyZSA9IGZ1bmN0aW9uKGFycmF5VG9TZWFyY2gsIGZpbHRlckNhbGxiYWNrLCBzdGFydEluZGV4KXtcblx0XHRcdC8vIERlZmF1bHQgdG8gc3RhcnQgb2YgdGhlIGFycmF5XG5cdFx0XHRpZiAoIXN0YXJ0SW5kZXgpe1xuXHRcdFx0XHRzdGFydEluZGV4ID0gLTE7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKHZhciBpID0gc3RhcnRJbmRleCArIDE7IGkgPCBhcnJheVRvU2VhcmNoLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhciBjdXJyZW50SXRlbSA9IGFycmF5VG9TZWFyY2hbaV07XG5cdFx0XHRcdGlmIChmaWx0ZXJDYWxsYmFjayhjdXJyZW50SXRlbSkpe1xuXHRcdFx0XHRcdHJldHVybiBjdXJyZW50SXRlbTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZmluZFByZXZpb3VzV2hlcmUgPSBoZWxwZXJzLmZpbmRQcmV2aW91c1doZXJlID0gZnVuY3Rpb24oYXJyYXlUb1NlYXJjaCwgZmlsdGVyQ2FsbGJhY2ssIHN0YXJ0SW5kZXgpe1xuXHRcdFx0Ly8gRGVmYXVsdCB0byBlbmQgb2YgdGhlIGFycmF5XG5cdFx0XHRpZiAoIXN0YXJ0SW5kZXgpe1xuXHRcdFx0XHRzdGFydEluZGV4ID0gYXJyYXlUb1NlYXJjaC5sZW5ndGg7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKHZhciBpID0gc3RhcnRJbmRleCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdHZhciBjdXJyZW50SXRlbSA9IGFycmF5VG9TZWFyY2hbaV07XG5cdFx0XHRcdGlmIChmaWx0ZXJDYWxsYmFjayhjdXJyZW50SXRlbSkpe1xuXHRcdFx0XHRcdHJldHVybiBjdXJyZW50SXRlbTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aW5oZXJpdHMgPSBoZWxwZXJzLmluaGVyaXRzID0gZnVuY3Rpb24oZXh0ZW5zaW9ucyl7XG5cdFx0XHQvL0Jhc2ljIGphdmFzY3JpcHQgaW5oZXJpdGFuY2UgYmFzZWQgb24gdGhlIG1vZGVsIGNyZWF0ZWQgaW4gQmFja2JvbmUuanNcblx0XHRcdHZhciBwYXJlbnQgPSB0aGlzO1xuXHRcdFx0dmFyIENoYXJ0RWxlbWVudCA9IChleHRlbnNpb25zICYmIGV4dGVuc2lvbnMuaGFzT3duUHJvcGVydHkoXCJjb25zdHJ1Y3RvclwiKSkgPyBleHRlbnNpb25zLmNvbnN0cnVjdG9yIDogZnVuY3Rpb24oKXsgcmV0dXJuIHBhcmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuXG5cdFx0XHR2YXIgU3Vycm9nYXRlID0gZnVuY3Rpb24oKXsgdGhpcy5jb25zdHJ1Y3RvciA9IENoYXJ0RWxlbWVudDt9O1xuXHRcdFx0U3Vycm9nYXRlLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7XG5cdFx0XHRDaGFydEVsZW1lbnQucHJvdG90eXBlID0gbmV3IFN1cnJvZ2F0ZSgpO1xuXG5cdFx0XHRDaGFydEVsZW1lbnQuZXh0ZW5kID0gaW5oZXJpdHM7XG5cblx0XHRcdGlmIChleHRlbnNpb25zKSBleHRlbmQoQ2hhcnRFbGVtZW50LnByb3RvdHlwZSwgZXh0ZW5zaW9ucyk7XG5cblx0XHRcdENoYXJ0RWxlbWVudC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlO1xuXG5cdFx0XHRyZXR1cm4gQ2hhcnRFbGVtZW50O1xuXHRcdH0sXG5cdFx0bm9vcCA9IGhlbHBlcnMubm9vcCA9IGZ1bmN0aW9uKCl7fSxcblx0XHR1aWQgPSBoZWxwZXJzLnVpZCA9IChmdW5jdGlvbigpe1xuXHRcdFx0dmFyIGlkPTA7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuIFwiY2hhcnQtXCIgKyBpZCsrO1xuXHRcdFx0fTtcblx0XHR9KSgpLFxuXHRcdHdhcm4gPSBoZWxwZXJzLndhcm4gPSBmdW5jdGlvbihzdHIpe1xuXHRcdFx0Ly9NZXRob2QgZm9yIHdhcm5pbmcgb2YgZXJyb3JzXG5cdFx0XHRpZiAod2luZG93LmNvbnNvbGUgJiYgdHlwZW9mIHdpbmRvdy5jb25zb2xlLndhcm4gPT0gXCJmdW5jdGlvblwiKSBjb25zb2xlLndhcm4oc3RyKTtcblx0XHR9LFxuXHRcdGFtZCA9IGhlbHBlcnMuYW1kID0gKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSxcblx0XHQvLy0tIE1hdGggbWV0aG9kc1xuXHRcdGlzTnVtYmVyID0gaGVscGVycy5pc051bWJlciA9IGZ1bmN0aW9uKG4pe1xuXHRcdFx0cmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcblx0XHR9LFxuXHRcdG1heCA9IGhlbHBlcnMubWF4ID0gZnVuY3Rpb24oYXJyYXkpe1xuXHRcdFx0cmV0dXJuIE1hdGgubWF4LmFwcGx5KCBNYXRoLCBhcnJheSApO1xuXHRcdH0sXG5cdFx0bWluID0gaGVscGVycy5taW4gPSBmdW5jdGlvbihhcnJheSl7XG5cdFx0XHRyZXR1cm4gTWF0aC5taW4uYXBwbHkoIE1hdGgsIGFycmF5ICk7XG5cdFx0fSxcblx0XHRjYXAgPSBoZWxwZXJzLmNhcCA9IGZ1bmN0aW9uKHZhbHVlVG9DYXAsbWF4VmFsdWUsbWluVmFsdWUpe1xuXHRcdFx0aWYoaXNOdW1iZXIobWF4VmFsdWUpKSB7XG5cdFx0XHRcdGlmKCB2YWx1ZVRvQ2FwID4gbWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG1heFZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKGlzTnVtYmVyKG1pblZhbHVlKSl7XG5cdFx0XHRcdGlmICggdmFsdWVUb0NhcCA8IG1pblZhbHVlICl7XG5cdFx0XHRcdFx0cmV0dXJuIG1pblZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdmFsdWVUb0NhcDtcblx0XHR9LFxuXHRcdGdldERlY2ltYWxQbGFjZXMgPSBoZWxwZXJzLmdldERlY2ltYWxQbGFjZXMgPSBmdW5jdGlvbihudW0pe1xuXHRcdFx0aWYgKG51bSUxIT09MCAmJiBpc051bWJlcihudW0pKXtcblx0XHRcdFx0cmV0dXJuIG51bS50b1N0cmluZygpLnNwbGl0KFwiLlwiKVsxXS5sZW5ndGg7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR0b1JhZGlhbnMgPSBoZWxwZXJzLnJhZGlhbnMgPSBmdW5jdGlvbihkZWdyZWVzKXtcblx0XHRcdHJldHVybiBkZWdyZWVzICogKE1hdGguUEkvMTgwKTtcblx0XHR9LFxuXHRcdC8vIEdldHMgdGhlIGFuZ2xlIGZyb20gdmVydGljYWwgdXByaWdodCB0byB0aGUgcG9pbnQgYWJvdXQgYSBjZW50cmUuXG5cdFx0Z2V0QW5nbGVGcm9tUG9pbnQgPSBoZWxwZXJzLmdldEFuZ2xlRnJvbVBvaW50ID0gZnVuY3Rpb24oY2VudHJlUG9pbnQsIGFuZ2xlUG9pbnQpe1xuXHRcdFx0dmFyIGRpc3RhbmNlRnJvbVhDZW50ZXIgPSBhbmdsZVBvaW50LnggLSBjZW50cmVQb2ludC54LFxuXHRcdFx0XHRkaXN0YW5jZUZyb21ZQ2VudGVyID0gYW5nbGVQb2ludC55IC0gY2VudHJlUG9pbnQueSxcblx0XHRcdFx0cmFkaWFsRGlzdGFuY2VGcm9tQ2VudGVyID0gTWF0aC5zcXJ0KCBkaXN0YW5jZUZyb21YQ2VudGVyICogZGlzdGFuY2VGcm9tWENlbnRlciArIGRpc3RhbmNlRnJvbVlDZW50ZXIgKiBkaXN0YW5jZUZyb21ZQ2VudGVyKTtcblxuXG5cdFx0XHR2YXIgYW5nbGUgPSBNYXRoLlBJICogMiArIE1hdGguYXRhbjIoZGlzdGFuY2VGcm9tWUNlbnRlciwgZGlzdGFuY2VGcm9tWENlbnRlcik7XG5cblx0XHRcdC8vSWYgdGhlIHNlZ21lbnQgaXMgaW4gdGhlIHRvcCBsZWZ0IHF1YWRyYW50LCB3ZSBuZWVkIHRvIGFkZCBhbm90aGVyIHJvdGF0aW9uIHRvIHRoZSBhbmdsZVxuXHRcdFx0aWYgKGRpc3RhbmNlRnJvbVhDZW50ZXIgPCAwICYmIGRpc3RhbmNlRnJvbVlDZW50ZXIgPCAwKXtcblx0XHRcdFx0YW5nbGUgKz0gTWF0aC5QSSoyO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRhbmdsZTogYW5nbGUsXG5cdFx0XHRcdGRpc3RhbmNlOiByYWRpYWxEaXN0YW5jZUZyb21DZW50ZXJcblx0XHRcdH07XG5cdFx0fSxcblx0XHRhbGlhc1BpeGVsID0gaGVscGVycy5hbGlhc1BpeGVsID0gZnVuY3Rpb24ocGl4ZWxXaWR0aCl7XG5cdFx0XHRyZXR1cm4gKHBpeGVsV2lkdGggJSAyID09PSAwKSA/IDAgOiAwLjU7XG5cdFx0fSxcblx0XHRzcGxpbmVDdXJ2ZSA9IGhlbHBlcnMuc3BsaW5lQ3VydmUgPSBmdW5jdGlvbihGaXJzdFBvaW50LE1pZGRsZVBvaW50LEFmdGVyUG9pbnQsdCl7XG5cdFx0XHQvL1Byb3BzIHRvIFJvYiBTcGVuY2VyIGF0IHNjYWxlZCBpbm5vdmF0aW9uIGZvciBoaXMgcG9zdCBvbiBzcGxpbmluZyBiZXR3ZWVuIHBvaW50c1xuXHRcdFx0Ly9odHRwOi8vc2NhbGVkaW5ub3ZhdGlvbi5jb20vYW5hbHl0aWNzL3NwbGluZXMvYWJvdXRTcGxpbmVzLmh0bWxcblx0XHRcdHZhciBkMDE9TWF0aC5zcXJ0KE1hdGgucG93KE1pZGRsZVBvaW50LngtRmlyc3RQb2ludC54LDIpK01hdGgucG93KE1pZGRsZVBvaW50LnktRmlyc3RQb2ludC55LDIpKSxcblx0XHRcdFx0ZDEyPU1hdGguc3FydChNYXRoLnBvdyhBZnRlclBvaW50LngtTWlkZGxlUG9pbnQueCwyKStNYXRoLnBvdyhBZnRlclBvaW50LnktTWlkZGxlUG9pbnQueSwyKSksXG5cdFx0XHRcdGZhPXQqZDAxLyhkMDErZDEyKSwvLyBzY2FsaW5nIGZhY3RvciBmb3IgdHJpYW5nbGUgVGFcblx0XHRcdFx0ZmI9dCpkMTIvKGQwMStkMTIpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aW5uZXIgOiB7XG5cdFx0XHRcdFx0eCA6IE1pZGRsZVBvaW50LngtZmEqKEFmdGVyUG9pbnQueC1GaXJzdFBvaW50LngpLFxuXHRcdFx0XHRcdHkgOiBNaWRkbGVQb2ludC55LWZhKihBZnRlclBvaW50LnktRmlyc3RQb2ludC55KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvdXRlciA6IHtcblx0XHRcdFx0XHR4OiBNaWRkbGVQb2ludC54K2ZiKihBZnRlclBvaW50LngtRmlyc3RQb2ludC54KSxcblx0XHRcdFx0XHR5IDogTWlkZGxlUG9pbnQueStmYiooQWZ0ZXJQb2ludC55LUZpcnN0UG9pbnQueSlcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGNhbGN1bGF0ZU9yZGVyT2ZNYWduaXR1ZGUgPSBoZWxwZXJzLmNhbGN1bGF0ZU9yZGVyT2ZNYWduaXR1ZGUgPSBmdW5jdGlvbih2YWwpe1xuXHRcdFx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5sb2codmFsKSAvIE1hdGguTE4xMCk7XG5cdFx0fSxcblx0XHRjYWxjdWxhdGVTY2FsZVJhbmdlID0gaGVscGVycy5jYWxjdWxhdGVTY2FsZVJhbmdlID0gZnVuY3Rpb24odmFsdWVzQXJyYXksIGRyYXdpbmdTaXplLCB0ZXh0U2l6ZSwgc3RhcnRGcm9tWmVybywgaW50ZWdlcnNPbmx5KXtcblxuXHRcdFx0Ly9TZXQgYSBtaW5pbXVtIHN0ZXAgb2YgdHdvIC0gYSBwb2ludCBhdCB0aGUgdG9wIG9mIHRoZSBncmFwaCwgYW5kIGEgcG9pbnQgYXQgdGhlIGJhc2Vcblx0XHRcdHZhciBtaW5TdGVwcyA9IDIsXG5cdFx0XHRcdG1heFN0ZXBzID0gTWF0aC5mbG9vcihkcmF3aW5nU2l6ZS8odGV4dFNpemUgKiAxLjUpKSxcblx0XHRcdFx0c2tpcEZpdHRpbmcgPSAobWluU3RlcHMgPj0gbWF4U3RlcHMpO1xuXG5cdFx0XHR2YXIgbWF4VmFsdWUgPSBtYXgodmFsdWVzQXJyYXkpLFxuXHRcdFx0XHRtaW5WYWx1ZSA9IG1pbih2YWx1ZXNBcnJheSk7XG5cblx0XHRcdC8vIFdlIG5lZWQgc29tZSBkZWdyZWUgb2Ygc2VwZXJhdGlvbiBoZXJlIHRvIGNhbGN1bGF0ZSB0aGUgc2NhbGVzIGlmIGFsbCB0aGUgdmFsdWVzIGFyZSB0aGUgc2FtZVxuXHRcdFx0Ly8gQWRkaW5nL21pbnVzaW5nIDAuNSB3aWxsIGdpdmUgdXMgYSByYW5nZSBvZiAxLlxuXHRcdFx0aWYgKG1heFZhbHVlID09PSBtaW5WYWx1ZSl7XG5cdFx0XHRcdG1heFZhbHVlICs9IDAuNTtcblx0XHRcdFx0Ly8gU28gd2UgZG9uJ3QgZW5kIHVwIHdpdGggYSBncmFwaCB3aXRoIGEgbmVnYXRpdmUgc3RhcnQgdmFsdWUgaWYgd2UndmUgc2FpZCBhbHdheXMgc3RhcnQgZnJvbSB6ZXJvXG5cdFx0XHRcdGlmIChtaW5WYWx1ZSA+PSAwLjUgJiYgIXN0YXJ0RnJvbVplcm8pe1xuXHRcdFx0XHRcdG1pblZhbHVlIC09IDAuNTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdC8vIE1ha2UgdXAgYSB3aG9sZSBudW1iZXIgYWJvdmUgdGhlIHZhbHVlc1xuXHRcdFx0XHRcdG1heFZhbHVlICs9IDAuNTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR2YXJcdHZhbHVlUmFuZ2UgPSBNYXRoLmFicyhtYXhWYWx1ZSAtIG1pblZhbHVlKSxcblx0XHRcdFx0cmFuZ2VPcmRlck9mTWFnbml0dWRlID0gY2FsY3VsYXRlT3JkZXJPZk1hZ25pdHVkZSh2YWx1ZVJhbmdlKSxcblx0XHRcdFx0Z3JhcGhNYXggPSBNYXRoLmNlaWwobWF4VmFsdWUgLyAoMSAqIE1hdGgucG93KDEwLCByYW5nZU9yZGVyT2ZNYWduaXR1ZGUpKSkgKiBNYXRoLnBvdygxMCwgcmFuZ2VPcmRlck9mTWFnbml0dWRlKSxcblx0XHRcdFx0Z3JhcGhNaW4gPSAoc3RhcnRGcm9tWmVybykgPyAwIDogTWF0aC5mbG9vcihtaW5WYWx1ZSAvICgxICogTWF0aC5wb3coMTAsIHJhbmdlT3JkZXJPZk1hZ25pdHVkZSkpKSAqIE1hdGgucG93KDEwLCByYW5nZU9yZGVyT2ZNYWduaXR1ZGUpLFxuXHRcdFx0XHRncmFwaFJhbmdlID0gZ3JhcGhNYXggLSBncmFwaE1pbixcblx0XHRcdFx0c3RlcFZhbHVlID0gTWF0aC5wb3coMTAsIHJhbmdlT3JkZXJPZk1hZ25pdHVkZSksXG5cdFx0XHRcdG51bWJlck9mU3RlcHMgPSBNYXRoLnJvdW5kKGdyYXBoUmFuZ2UgLyBzdGVwVmFsdWUpO1xuXG5cdFx0XHQvL0lmIHdlIGhhdmUgbW9yZSBzcGFjZSBvbiB0aGUgZ3JhcGggd2UnbGwgdXNlIGl0IHRvIGdpdmUgbW9yZSBkZWZpbml0aW9uIHRvIHRoZSBkYXRhXG5cdFx0XHR3aGlsZSgobnVtYmVyT2ZTdGVwcyA+IG1heFN0ZXBzIHx8IChudW1iZXJPZlN0ZXBzICogMikgPCBtYXhTdGVwcykgJiYgIXNraXBGaXR0aW5nKSB7XG5cdFx0XHRcdGlmKG51bWJlck9mU3RlcHMgPiBtYXhTdGVwcyl7XG5cdFx0XHRcdFx0c3RlcFZhbHVlICo9Mjtcblx0XHRcdFx0XHRudW1iZXJPZlN0ZXBzID0gTWF0aC5yb3VuZChncmFwaFJhbmdlL3N0ZXBWYWx1ZSk7XG5cdFx0XHRcdFx0Ly8gRG9uJ3QgZXZlciBkZWFsIHdpdGggYSBkZWNpbWFsIG51bWJlciBvZiBzdGVwcyAtIGNhbmNlbCBmaXR0aW5nIGFuZCBqdXN0IHVzZSB0aGUgbWluaW11bSBudW1iZXIgb2Ygc3RlcHMuXG5cdFx0XHRcdFx0aWYgKG51bWJlck9mU3RlcHMgJSAxICE9PSAwKXtcblx0XHRcdFx0XHRcdHNraXBGaXR0aW5nID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9XZSBjYW4gZml0IGluIGRvdWJsZSB0aGUgYW1vdW50IG9mIHNjYWxlIHBvaW50cyBvbiB0aGUgc2NhbGVcblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHQvL0lmIHVzZXIgaGFzIGRlY2xhcmVkIGludHMgb25seSwgYW5kIHRoZSBzdGVwIHZhbHVlIGlzbid0IGEgZGVjaW1hbFxuXHRcdFx0XHRcdGlmIChpbnRlZ2Vyc09ubHkgJiYgcmFuZ2VPcmRlck9mTWFnbml0dWRlID49IDApe1xuXHRcdFx0XHRcdFx0Ly9JZiB0aGUgdXNlciBoYXMgc2FpZCBpbnRlZ2VycyBvbmx5LCB3ZSBuZWVkIHRvIGNoZWNrIHRoYXQgbWFraW5nIHRoZSBzY2FsZSBtb3JlIGdyYW51bGFyIHdvdWxkbid0IG1ha2UgaXQgYSBmbG9hdFxuXHRcdFx0XHRcdFx0aWYoc3RlcFZhbHVlLzIgJSAxID09PSAwKXtcblx0XHRcdFx0XHRcdFx0c3RlcFZhbHVlIC89Mjtcblx0XHRcdFx0XHRcdFx0bnVtYmVyT2ZTdGVwcyA9IE1hdGgucm91bmQoZ3JhcGhSYW5nZS9zdGVwVmFsdWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Ly9JZiBpdCB3b3VsZCBtYWtlIGl0IGEgZmxvYXQgYnJlYWsgb3V0IG9mIHRoZSBsb29wXG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly9JZiB0aGUgc2NhbGUgZG9lc24ndCBoYXZlIHRvIGJlIGFuIGludCwgbWFrZSB0aGUgc2NhbGUgbW9yZSBncmFudWxhciBhbnl3YXkuXG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdHN0ZXBWYWx1ZSAvPTI7XG5cdFx0XHRcdFx0XHRudW1iZXJPZlN0ZXBzID0gTWF0aC5yb3VuZChncmFwaFJhbmdlL3N0ZXBWYWx1ZSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKHNraXBGaXR0aW5nKXtcblx0XHRcdFx0bnVtYmVyT2ZTdGVwcyA9IG1pblN0ZXBzO1xuXHRcdFx0XHRzdGVwVmFsdWUgPSBncmFwaFJhbmdlIC8gbnVtYmVyT2ZTdGVwcztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0c3RlcHMgOiBudW1iZXJPZlN0ZXBzLFxuXHRcdFx0XHRzdGVwVmFsdWUgOiBzdGVwVmFsdWUsXG5cdFx0XHRcdG1pbiA6IGdyYXBoTWluLFxuXHRcdFx0XHRtYXhcdDogZ3JhcGhNaW4gKyAobnVtYmVyT2ZTdGVwcyAqIHN0ZXBWYWx1ZSlcblx0XHRcdH07XG5cblx0XHR9LFxuXHRcdC8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cblx0XHQvLyBCbG93cyB1cCBqc2hpbnQgZXJyb3JzIGJhc2VkIG9uIHRoZSBuZXcgRnVuY3Rpb24gY29uc3RydWN0b3Jcblx0XHQvL1RlbXBsYXRpbmcgbWV0aG9kc1xuXHRcdC8vSmF2YXNjcmlwdCBtaWNybyB0ZW1wbGF0aW5nIGJ5IEpvaG4gUmVzaWcgLSBzb3VyY2UgYXQgaHR0cDovL2Vqb2huLm9yZy9ibG9nL2phdmFzY3JpcHQtbWljcm8tdGVtcGxhdGluZy9cblx0XHR0ZW1wbGF0ZSA9IGhlbHBlcnMudGVtcGxhdGUgPSBmdW5jdGlvbih0ZW1wbGF0ZVN0cmluZywgdmFsdWVzT2JqZWN0KXtcblxuXHRcdFx0Ly8gSWYgdGVtcGxhdGVTdHJpbmcgaXMgZnVuY3Rpb24gcmF0aGVyIHRoYW4gc3RyaW5nLXRlbXBsYXRlIC0gY2FsbCB0aGUgZnVuY3Rpb24gZm9yIHZhbHVlc09iamVjdFxuXG5cdFx0XHRpZih0ZW1wbGF0ZVN0cmluZyBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcblx0XHRcdCBcdHJldHVybiB0ZW1wbGF0ZVN0cmluZyh2YWx1ZXNPYmplY3QpO1xuXHRcdCBcdH1cblxuXHRcdFx0dmFyIGNhY2hlID0ge307XG5cdFx0XHRmdW5jdGlvbiB0bXBsKHN0ciwgZGF0YSl7XG5cdFx0XHRcdC8vIEZpZ3VyZSBvdXQgaWYgd2UncmUgZ2V0dGluZyBhIHRlbXBsYXRlLCBvciBpZiB3ZSBuZWVkIHRvXG5cdFx0XHRcdC8vIGxvYWQgdGhlIHRlbXBsYXRlIC0gYW5kIGJlIHN1cmUgdG8gY2FjaGUgdGhlIHJlc3VsdC5cblx0XHRcdFx0dmFyIGZuID0gIS9cXFcvLnRlc3Qoc3RyKSA/XG5cdFx0XHRcdGNhY2hlW3N0cl0gPSBjYWNoZVtzdHJdIDpcblxuXHRcdFx0XHQvLyBHZW5lcmF0ZSBhIHJldXNhYmxlIGZ1bmN0aW9uIHRoYXQgd2lsbCBzZXJ2ZSBhcyBhIHRlbXBsYXRlXG5cdFx0XHRcdC8vIGdlbmVyYXRvciAoYW5kIHdoaWNoIHdpbGwgYmUgY2FjaGVkKS5cblx0XHRcdFx0bmV3IEZ1bmN0aW9uKFwib2JqXCIsXG5cdFx0XHRcdFx0XCJ2YXIgcD1bXSxwcmludD1mdW5jdGlvbigpe3AucHVzaC5hcHBseShwLGFyZ3VtZW50cyk7fTtcIiArXG5cblx0XHRcdFx0XHQvLyBJbnRyb2R1Y2UgdGhlIGRhdGEgYXMgbG9jYWwgdmFyaWFibGVzIHVzaW5nIHdpdGgoKXt9XG5cdFx0XHRcdFx0XCJ3aXRoKG9iail7cC5wdXNoKCdcIiArXG5cblx0XHRcdFx0XHQvLyBDb252ZXJ0IHRoZSB0ZW1wbGF0ZSBpbnRvIHB1cmUgSmF2YVNjcmlwdFxuXHRcdFx0XHRcdHN0clxuXHRcdFx0XHRcdFx0LnJlcGxhY2UoL1tcXHJcXHRcXG5dL2csIFwiIFwiKVxuXHRcdFx0XHRcdFx0LnNwbGl0KFwiPCVcIikuam9pbihcIlxcdFwiKVxuXHRcdFx0XHRcdFx0LnJlcGxhY2UoLygoXnwlPilbXlxcdF0qKScvZywgXCIkMVxcclwiKVxuXHRcdFx0XHRcdFx0LnJlcGxhY2UoL1xcdD0oLio/KSU+L2csIFwiJywkMSwnXCIpXG5cdFx0XHRcdFx0XHQuc3BsaXQoXCJcXHRcIikuam9pbihcIicpO1wiKVxuXHRcdFx0XHRcdFx0LnNwbGl0KFwiJT5cIikuam9pbihcInAucHVzaCgnXCIpXG5cdFx0XHRcdFx0XHQuc3BsaXQoXCJcXHJcIikuam9pbihcIlxcXFwnXCIpICtcblx0XHRcdFx0XHRcIicpO31yZXR1cm4gcC5qb2luKCcnKTtcIlxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdC8vIFByb3ZpZGUgc29tZSBiYXNpYyBjdXJyeWluZyB0byB0aGUgdXNlclxuXHRcdFx0XHRyZXR1cm4gZGF0YSA/IGZuKCBkYXRhICkgOiBmbjtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0bXBsKHRlbXBsYXRlU3RyaW5nLHZhbHVlc09iamVjdCk7XG5cdFx0fSxcblx0XHQvKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuXHRcdGdlbmVyYXRlTGFiZWxzID0gaGVscGVycy5nZW5lcmF0ZUxhYmVscyA9IGZ1bmN0aW9uKHRlbXBsYXRlU3RyaW5nLG51bWJlck9mU3RlcHMsZ3JhcGhNaW4sc3RlcFZhbHVlKXtcblx0XHRcdHZhciBsYWJlbHNBcnJheSA9IG5ldyBBcnJheShudW1iZXJPZlN0ZXBzKTtcblx0XHRcdGlmIChsYWJlbFRlbXBsYXRlU3RyaW5nKXtcblx0XHRcdFx0ZWFjaChsYWJlbHNBcnJheSxmdW5jdGlvbih2YWwsaW5kZXgpe1xuXHRcdFx0XHRcdGxhYmVsc0FycmF5W2luZGV4XSA9IHRlbXBsYXRlKHRlbXBsYXRlU3RyaW5nLHt2YWx1ZTogKGdyYXBoTWluICsgKHN0ZXBWYWx1ZSooaW5kZXgrMSkpKX0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBsYWJlbHNBcnJheTtcblx0XHR9LFxuXHRcdC8vLS1BbmltYXRpb24gbWV0aG9kc1xuXHRcdC8vRWFzaW5nIGZ1bmN0aW9ucyBhZGFwdGVkIGZyb20gUm9iZXJ0IFBlbm5lcidzIGVhc2luZyBlcXVhdGlvbnNcblx0XHQvL2h0dHA6Ly93d3cucm9iZXJ0cGVubmVyLmNvbS9lYXNpbmcvXG5cdFx0ZWFzaW5nRWZmZWN0cyA9IGhlbHBlcnMuZWFzaW5nRWZmZWN0cyA9IHtcblx0XHRcdGxpbmVhcjogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuIHQ7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluUXVhZDogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuIHQgKiB0O1xuXHRcdFx0fSxcblx0XHRcdGVhc2VPdXRRdWFkOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gLTEgKiB0ICogKHQgLSAyKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5PdXRRdWFkOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRpZiAoKHQgLz0gMSAvIDIpIDwgMSkgcmV0dXJuIDEgLyAyICogdCAqIHQ7XG5cdFx0XHRcdHJldHVybiAtMSAvIDIgKiAoKC0tdCkgKiAodCAtIDIpIC0gMSk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluQ3ViaWM6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiB0ICogdCAqIHQ7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZU91dEN1YmljOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gMSAqICgodCA9IHQgLyAxIC0gMSkgKiB0ICogdCArIDEpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJbk91dEN1YmljOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRpZiAoKHQgLz0gMSAvIDIpIDwgMSkgcmV0dXJuIDEgLyAyICogdCAqIHQgKiB0O1xuXHRcdFx0XHRyZXR1cm4gMSAvIDIgKiAoKHQgLT0gMikgKiB0ICogdCArIDIpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJblF1YXJ0OiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gdCAqIHQgKiB0ICogdDtcblx0XHRcdH0sXG5cdFx0XHRlYXNlT3V0UXVhcnQ6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiAtMSAqICgodCA9IHQgLyAxIC0gMSkgKiB0ICogdCAqIHQgLSAxKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5PdXRRdWFydDogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0aWYgKCh0IC89IDEgLyAyKSA8IDEpIHJldHVybiAxIC8gMiAqIHQgKiB0ICogdCAqIHQ7XG5cdFx0XHRcdHJldHVybiAtMSAvIDIgKiAoKHQgLT0gMikgKiB0ICogdCAqIHQgLSAyKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5RdWludDogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuIDEgKiAodCAvPSAxKSAqIHQgKiB0ICogdCAqIHQ7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZU91dFF1aW50OiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gMSAqICgodCA9IHQgLyAxIC0gMSkgKiB0ICogdCAqIHQgKiB0ICsgMSk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluT3V0UXVpbnQ6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdGlmICgodCAvPSAxIC8gMikgPCAxKSByZXR1cm4gMSAvIDIgKiB0ICogdCAqIHQgKiB0ICogdDtcblx0XHRcdFx0cmV0dXJuIDEgLyAyICogKCh0IC09IDIpICogdCAqIHQgKiB0ICogdCArIDIpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJblNpbmU6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiAtMSAqIE1hdGguY29zKHQgLyAxICogKE1hdGguUEkgLyAyKSkgKyAxO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VPdXRTaW5lOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gMSAqIE1hdGguc2luKHQgLyAxICogKE1hdGguUEkgLyAyKSk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluT3V0U2luZTogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuIC0xIC8gMiAqIChNYXRoLmNvcyhNYXRoLlBJICogdCAvIDEpIC0gMSk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluRXhwbzogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuICh0ID09PSAwKSA/IDEgOiAxICogTWF0aC5wb3coMiwgMTAgKiAodCAvIDEgLSAxKSk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZU91dEV4cG86IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiAodCA9PT0gMSkgPyAxIDogMSAqICgtTWF0aC5wb3coMiwgLTEwICogdCAvIDEpICsgMSk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluT3V0RXhwbzogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0aWYgKHQgPT09IDApIHJldHVybiAwO1xuXHRcdFx0XHRpZiAodCA9PT0gMSkgcmV0dXJuIDE7XG5cdFx0XHRcdGlmICgodCAvPSAxIC8gMikgPCAxKSByZXR1cm4gMSAvIDIgKiBNYXRoLnBvdygyLCAxMCAqICh0IC0gMSkpO1xuXHRcdFx0XHRyZXR1cm4gMSAvIDIgKiAoLU1hdGgucG93KDIsIC0xMCAqIC0tdCkgKyAyKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5DaXJjOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRpZiAodCA+PSAxKSByZXR1cm4gdDtcblx0XHRcdFx0cmV0dXJuIC0xICogKE1hdGguc3FydCgxIC0gKHQgLz0gMSkgKiB0KSAtIDEpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VPdXRDaXJjOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gMSAqIE1hdGguc3FydCgxIC0gKHQgPSB0IC8gMSAtIDEpICogdCk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluT3V0Q2lyYzogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0aWYgKCh0IC89IDEgLyAyKSA8IDEpIHJldHVybiAtMSAvIDIgKiAoTWF0aC5zcXJ0KDEgLSB0ICogdCkgLSAxKTtcblx0XHRcdFx0cmV0dXJuIDEgLyAyICogKE1hdGguc3FydCgxIC0gKHQgLT0gMikgKiB0KSArIDEpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJbkVsYXN0aWM6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHZhciBzID0gMS43MDE1ODtcblx0XHRcdFx0dmFyIHAgPSAwO1xuXHRcdFx0XHR2YXIgYSA9IDE7XG5cdFx0XHRcdGlmICh0ID09PSAwKSByZXR1cm4gMDtcblx0XHRcdFx0aWYgKCh0IC89IDEpID09IDEpIHJldHVybiAxO1xuXHRcdFx0XHRpZiAoIXApIHAgPSAxICogMC4zO1xuXHRcdFx0XHRpZiAoYSA8IE1hdGguYWJzKDEpKSB7XG5cdFx0XHRcdFx0YSA9IDE7XG5cdFx0XHRcdFx0cyA9IHAgLyA0O1xuXHRcdFx0XHR9IGVsc2UgcyA9IHAgLyAoMiAqIE1hdGguUEkpICogTWF0aC5hc2luKDEgLyBhKTtcblx0XHRcdFx0cmV0dXJuIC0oYSAqIE1hdGgucG93KDIsIDEwICogKHQgLT0gMSkpICogTWF0aC5zaW4oKHQgKiAxIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VPdXRFbGFzdGljOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHR2YXIgcyA9IDEuNzAxNTg7XG5cdFx0XHRcdHZhciBwID0gMDtcblx0XHRcdFx0dmFyIGEgPSAxO1xuXHRcdFx0XHRpZiAodCA9PT0gMCkgcmV0dXJuIDA7XG5cdFx0XHRcdGlmICgodCAvPSAxKSA9PSAxKSByZXR1cm4gMTtcblx0XHRcdFx0aWYgKCFwKSBwID0gMSAqIDAuMztcblx0XHRcdFx0aWYgKGEgPCBNYXRoLmFicygxKSkge1xuXHRcdFx0XHRcdGEgPSAxO1xuXHRcdFx0XHRcdHMgPSBwIC8gNDtcblx0XHRcdFx0fSBlbHNlIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbigxIC8gYSk7XG5cdFx0XHRcdHJldHVybiBhICogTWF0aC5wb3coMiwgLTEwICogdCkgKiBNYXRoLnNpbigodCAqIDEgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSArIDE7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluT3V0RWxhc3RpYzogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0dmFyIHMgPSAxLjcwMTU4O1xuXHRcdFx0XHR2YXIgcCA9IDA7XG5cdFx0XHRcdHZhciBhID0gMTtcblx0XHRcdFx0aWYgKHQgPT09IDApIHJldHVybiAwO1xuXHRcdFx0XHRpZiAoKHQgLz0gMSAvIDIpID09IDIpIHJldHVybiAxO1xuXHRcdFx0XHRpZiAoIXApIHAgPSAxICogKDAuMyAqIDEuNSk7XG5cdFx0XHRcdGlmIChhIDwgTWF0aC5hYnMoMSkpIHtcblx0XHRcdFx0XHRhID0gMTtcblx0XHRcdFx0XHRzID0gcCAvIDQ7XG5cdFx0XHRcdH0gZWxzZSBzID0gcCAvICgyICogTWF0aC5QSSkgKiBNYXRoLmFzaW4oMSAvIGEpO1xuXHRcdFx0XHRpZiAodCA8IDEpIHJldHVybiAtMC41ICogKGEgKiBNYXRoLnBvdygyLCAxMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0ICogMSAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApKTtcblx0XHRcdFx0cmV0dXJuIGEgKiBNYXRoLnBvdygyLCAtMTAgKiAodCAtPSAxKSkgKiBNYXRoLnNpbigodCAqIDEgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSAqIDAuNSArIDE7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluQmFjazogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0dmFyIHMgPSAxLjcwMTU4O1xuXHRcdFx0XHRyZXR1cm4gMSAqICh0IC89IDEpICogdCAqICgocyArIDEpICogdCAtIHMpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VPdXRCYWNrOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHR2YXIgcyA9IDEuNzAxNTg7XG5cdFx0XHRcdHJldHVybiAxICogKCh0ID0gdCAvIDEgLSAxKSAqIHQgKiAoKHMgKyAxKSAqIHQgKyBzKSArIDEpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJbk91dEJhY2s6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHZhciBzID0gMS43MDE1ODtcblx0XHRcdFx0aWYgKCh0IC89IDEgLyAyKSA8IDEpIHJldHVybiAxIC8gMiAqICh0ICogdCAqICgoKHMgKj0gKDEuNTI1KSkgKyAxKSAqIHQgLSBzKSk7XG5cdFx0XHRcdHJldHVybiAxIC8gMiAqICgodCAtPSAyKSAqIHQgKiAoKChzICo9ICgxLjUyNSkpICsgMSkgKiB0ICsgcykgKyAyKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5Cb3VuY2U6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiAxIC0gZWFzaW5nRWZmZWN0cy5lYXNlT3V0Qm91bmNlKDEgLSB0KTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlT3V0Qm91bmNlOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRpZiAoKHQgLz0gMSkgPCAoMSAvIDIuNzUpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIDEgKiAoNy41NjI1ICogdCAqIHQpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHQgPCAoMiAvIDIuNzUpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIDEgKiAoNy41NjI1ICogKHQgLT0gKDEuNSAvIDIuNzUpKSAqIHQgKyAwLjc1KTtcblx0XHRcdFx0fSBlbHNlIGlmICh0IDwgKDIuNSAvIDIuNzUpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIDEgKiAoNy41NjI1ICogKHQgLT0gKDIuMjUgLyAyLjc1KSkgKiB0ICsgMC45Mzc1KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gMSAqICg3LjU2MjUgKiAodCAtPSAoMi42MjUgLyAyLjc1KSkgKiB0ICsgMC45ODQzNzUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluT3V0Qm91bmNlOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRpZiAodCA8IDEgLyAyKSByZXR1cm4gZWFzaW5nRWZmZWN0cy5lYXNlSW5Cb3VuY2UodCAqIDIpICogMC41O1xuXHRcdFx0XHRyZXR1cm4gZWFzaW5nRWZmZWN0cy5lYXNlT3V0Qm91bmNlKHQgKiAyIC0gMSkgKiAwLjUgKyAxICogMC41O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly9SZXF1ZXN0IGFuaW1hdGlvbiBwb2x5ZmlsbCAtIGh0dHA6Ly93d3cucGF1bGlyaXNoLmNvbS8yMDExL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtYW5pbWF0aW5nL1xuXHRcdHJlcXVlc3RBbmltRnJhbWUgPSBoZWxwZXJzLnJlcXVlc3RBbmltRnJhbWUgPSAoZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG5cdFx0XHRcdHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcblx0XHRcdFx0d2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuXHRcdFx0XHR3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuXHRcdFx0XHR3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcblx0XHRcdFx0ZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0XHRcdFx0XHRyZXR1cm4gd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XG5cdFx0XHRcdH07XG5cdFx0fSkoKSxcblx0XHRjYW5jZWxBbmltRnJhbWUgPSBoZWxwZXJzLmNhbmNlbEFuaW1GcmFtZSA9IChmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuXHRcdFx0XHR3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcblx0XHRcdFx0d2luZG93Lm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG5cdFx0XHRcdHdpbmRvdy5vQ2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcblx0XHRcdFx0d2luZG93Lm1zQ2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcblx0XHRcdFx0ZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0XHRcdFx0XHRyZXR1cm4gd2luZG93LmNsZWFyVGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcblx0XHRcdFx0fTtcblx0XHR9KSgpLFxuXHRcdGFuaW1hdGlvbkxvb3AgPSBoZWxwZXJzLmFuaW1hdGlvbkxvb3AgPSBmdW5jdGlvbihjYWxsYmFjayx0b3RhbFN0ZXBzLGVhc2luZ1N0cmluZyxvblByb2dyZXNzLG9uQ29tcGxldGUsY2hhcnRJbnN0YW5jZSl7XG5cblx0XHRcdHZhciBjdXJyZW50U3RlcCA9IDAsXG5cdFx0XHRcdGVhc2luZ0Z1bmN0aW9uID0gZWFzaW5nRWZmZWN0c1tlYXNpbmdTdHJpbmddIHx8IGVhc2luZ0VmZmVjdHMubGluZWFyO1xuXG5cdFx0XHR2YXIgYW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRjdXJyZW50U3RlcCsrO1xuXHRcdFx0XHR2YXIgc3RlcERlY2ltYWwgPSBjdXJyZW50U3RlcC90b3RhbFN0ZXBzO1xuXHRcdFx0XHR2YXIgZWFzZURlY2ltYWwgPSBlYXNpbmdGdW5jdGlvbihzdGVwRGVjaW1hbCk7XG5cblx0XHRcdFx0Y2FsbGJhY2suY2FsbChjaGFydEluc3RhbmNlLGVhc2VEZWNpbWFsLHN0ZXBEZWNpbWFsLCBjdXJyZW50U3RlcCk7XG5cdFx0XHRcdG9uUHJvZ3Jlc3MuY2FsbChjaGFydEluc3RhbmNlLGVhc2VEZWNpbWFsLHN0ZXBEZWNpbWFsKTtcblx0XHRcdFx0aWYgKGN1cnJlbnRTdGVwIDwgdG90YWxTdGVwcyl7XG5cdFx0XHRcdFx0Y2hhcnRJbnN0YW5jZS5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltRnJhbWUoYW5pbWF0aW9uRnJhbWUpO1xuXHRcdFx0XHR9IGVsc2V7XG5cdFx0XHRcdFx0b25Db21wbGV0ZS5hcHBseShjaGFydEluc3RhbmNlKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdHJlcXVlc3RBbmltRnJhbWUoYW5pbWF0aW9uRnJhbWUpO1xuXHRcdH0sXG5cdFx0Ly8tLSBET00gbWV0aG9kc1xuXHRcdGdldFJlbGF0aXZlUG9zaXRpb24gPSBoZWxwZXJzLmdldFJlbGF0aXZlUG9zaXRpb24gPSBmdW5jdGlvbihldnQpe1xuXHRcdFx0dmFyIG1vdXNlWCwgbW91c2VZO1xuXHRcdFx0dmFyIGUgPSBldnQub3JpZ2luYWxFdmVudCB8fCBldnQsXG5cdFx0XHRcdGNhbnZhcyA9IGV2dC5jdXJyZW50VGFyZ2V0IHx8IGV2dC5zcmNFbGVtZW50LFxuXHRcdFx0XHRib3VuZGluZ1JlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cblx0XHRcdGlmIChlLnRvdWNoZXMpe1xuXHRcdFx0XHRtb3VzZVggPSBlLnRvdWNoZXNbMF0uY2xpZW50WCAtIGJvdW5kaW5nUmVjdC5sZWZ0O1xuXHRcdFx0XHRtb3VzZVkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WSAtIGJvdW5kaW5nUmVjdC50b3A7XG5cblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdG1vdXNlWCA9IGUuY2xpZW50WCAtIGJvdW5kaW5nUmVjdC5sZWZ0O1xuXHRcdFx0XHRtb3VzZVkgPSBlLmNsaWVudFkgLSBib3VuZGluZ1JlY3QudG9wO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR4IDogbW91c2VYLFxuXHRcdFx0XHR5IDogbW91c2VZXG5cdFx0XHR9O1xuXG5cdFx0fSxcblx0XHRhZGRFdmVudCA9IGhlbHBlcnMuYWRkRXZlbnQgPSBmdW5jdGlvbihub2RlLGV2ZW50VHlwZSxtZXRob2Qpe1xuXHRcdFx0aWYgKG5vZGUuYWRkRXZlbnRMaXN0ZW5lcil7XG5cdFx0XHRcdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsbWV0aG9kKTtcblx0XHRcdH0gZWxzZSBpZiAobm9kZS5hdHRhY2hFdmVudCl7XG5cdFx0XHRcdG5vZGUuYXR0YWNoRXZlbnQoXCJvblwiK2V2ZW50VHlwZSwgbWV0aG9kKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5vZGVbXCJvblwiK2V2ZW50VHlwZV0gPSBtZXRob2Q7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZW1vdmVFdmVudCA9IGhlbHBlcnMucmVtb3ZlRXZlbnQgPSBmdW5jdGlvbihub2RlLCBldmVudFR5cGUsIGhhbmRsZXIpe1xuXHRcdFx0aWYgKG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcil7XG5cdFx0XHRcdG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGhhbmRsZXIsIGZhbHNlKTtcblx0XHRcdH0gZWxzZSBpZiAobm9kZS5kZXRhY2hFdmVudCl7XG5cdFx0XHRcdG5vZGUuZGV0YWNoRXZlbnQoXCJvblwiK2V2ZW50VHlwZSxoYW5kbGVyKTtcblx0XHRcdH0gZWxzZXtcblx0XHRcdFx0bm9kZVtcIm9uXCIgKyBldmVudFR5cGVdID0gbm9vcDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGJpbmRFdmVudHMgPSBoZWxwZXJzLmJpbmRFdmVudHMgPSBmdW5jdGlvbihjaGFydEluc3RhbmNlLCBhcnJheU9mRXZlbnRzLCBoYW5kbGVyKXtcblx0XHRcdC8vIENyZWF0ZSB0aGUgZXZlbnRzIG9iamVjdCBpZiBpdCdzIG5vdCBhbHJlYWR5IHByZXNlbnRcblx0XHRcdGlmICghY2hhcnRJbnN0YW5jZS5ldmVudHMpIGNoYXJ0SW5zdGFuY2UuZXZlbnRzID0ge307XG5cblx0XHRcdGVhY2goYXJyYXlPZkV2ZW50cyxmdW5jdGlvbihldmVudE5hbWUpe1xuXHRcdFx0XHRjaGFydEluc3RhbmNlLmV2ZW50c1tldmVudE5hbWVdID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRoYW5kbGVyLmFwcGx5KGNoYXJ0SW5zdGFuY2UsIGFyZ3VtZW50cyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdGFkZEV2ZW50KGNoYXJ0SW5zdGFuY2UuY2hhcnQuY2FudmFzLGV2ZW50TmFtZSxjaGFydEluc3RhbmNlLmV2ZW50c1tldmVudE5hbWVdKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0dW5iaW5kRXZlbnRzID0gaGVscGVycy51bmJpbmRFdmVudHMgPSBmdW5jdGlvbiAoY2hhcnRJbnN0YW5jZSwgYXJyYXlPZkV2ZW50cykge1xuXHRcdFx0ZWFjaChhcnJheU9mRXZlbnRzLCBmdW5jdGlvbihoYW5kbGVyLGV2ZW50TmFtZSl7XG5cdFx0XHRcdHJlbW92ZUV2ZW50KGNoYXJ0SW5zdGFuY2UuY2hhcnQuY2FudmFzLCBldmVudE5hbWUsIGhhbmRsZXIpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRnZXRNYXhpbXVtV2lkdGggPSBoZWxwZXJzLmdldE1heGltdW1XaWR0aCA9IGZ1bmN0aW9uKGRvbU5vZGUpe1xuXHRcdFx0dmFyIGNvbnRhaW5lciA9IGRvbU5vZGUucGFyZW50Tm9kZTtcblx0XHRcdC8vIFRPRE8gPSBjaGVjayBjcm9zcyBicm93c2VyIHN0dWZmIHdpdGggdGhpcy5cblx0XHRcdHJldHVybiBjb250YWluZXIuY2xpZW50V2lkdGg7XG5cdFx0fSxcblx0XHRnZXRNYXhpbXVtSGVpZ2h0ID0gaGVscGVycy5nZXRNYXhpbXVtSGVpZ2h0ID0gZnVuY3Rpb24oZG9tTm9kZSl7XG5cdFx0XHR2YXIgY29udGFpbmVyID0gZG9tTm9kZS5wYXJlbnROb2RlO1xuXHRcdFx0Ly8gVE9ETyA9IGNoZWNrIGNyb3NzIGJyb3dzZXIgc3R1ZmYgd2l0aCB0aGlzLlxuXHRcdFx0cmV0dXJuIGNvbnRhaW5lci5jbGllbnRIZWlnaHQ7XG5cdFx0fSxcblx0XHRnZXRNYXhpbXVtU2l6ZSA9IGhlbHBlcnMuZ2V0TWF4aW11bVNpemUgPSBoZWxwZXJzLmdldE1heGltdW1XaWR0aCwgLy8gbGVnYWN5IHN1cHBvcnRcblx0XHRyZXRpbmFTY2FsZSA9IGhlbHBlcnMucmV0aW5hU2NhbGUgPSBmdW5jdGlvbihjaGFydCl7XG5cdFx0XHR2YXIgY3R4ID0gY2hhcnQuY3R4LFxuXHRcdFx0XHR3aWR0aCA9IGNoYXJ0LmNhbnZhcy53aWR0aCxcblx0XHRcdFx0aGVpZ2h0ID0gY2hhcnQuY2FudmFzLmhlaWdodDtcblxuXHRcdFx0aWYgKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKSB7XG5cdFx0XHRcdGN0eC5jYW52YXMuc3R5bGUud2lkdGggPSB3aWR0aCArIFwicHhcIjtcblx0XHRcdFx0Y3R4LmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCI7XG5cdFx0XHRcdGN0eC5jYW52YXMuaGVpZ2h0ID0gaGVpZ2h0ICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XG5cdFx0XHRcdGN0eC5jYW52YXMud2lkdGggPSB3aWR0aCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuXHRcdFx0XHRjdHguc2NhbGUod2luZG93LmRldmljZVBpeGVsUmF0aW8sIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vLS0gQ2FudmFzIG1ldGhvZHNcblx0XHRjbGVhciA9IGhlbHBlcnMuY2xlYXIgPSBmdW5jdGlvbihjaGFydCl7XG5cdFx0XHRjaGFydC5jdHguY2xlYXJSZWN0KDAsMCxjaGFydC53aWR0aCxjaGFydC5oZWlnaHQpO1xuXHRcdH0sXG5cdFx0Zm9udFN0cmluZyA9IGhlbHBlcnMuZm9udFN0cmluZyA9IGZ1bmN0aW9uKHBpeGVsU2l6ZSxmb250U3R5bGUsZm9udEZhbWlseSl7XG5cdFx0XHRyZXR1cm4gZm9udFN0eWxlICsgXCIgXCIgKyBwaXhlbFNpemUrXCJweCBcIiArIGZvbnRGYW1pbHk7XG5cdFx0fSxcblx0XHRsb25nZXN0VGV4dCA9IGhlbHBlcnMubG9uZ2VzdFRleHQgPSBmdW5jdGlvbihjdHgsZm9udCxhcnJheU9mU3RyaW5ncyl7XG5cdFx0XHRjdHguZm9udCA9IGZvbnQ7XG5cdFx0XHR2YXIgbG9uZ2VzdCA9IDA7XG5cdFx0XHRlYWNoKGFycmF5T2ZTdHJpbmdzLGZ1bmN0aW9uKHN0cmluZyl7XG5cdFx0XHRcdHZhciB0ZXh0V2lkdGggPSBjdHgubWVhc3VyZVRleHQoc3RyaW5nKS53aWR0aDtcblx0XHRcdFx0bG9uZ2VzdCA9ICh0ZXh0V2lkdGggPiBsb25nZXN0KSA/IHRleHRXaWR0aCA6IGxvbmdlc3Q7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBsb25nZXN0O1xuXHRcdH0sXG5cdFx0ZHJhd1JvdW5kZWRSZWN0YW5nbGUgPSBoZWxwZXJzLmRyYXdSb3VuZGVkUmVjdGFuZ2xlID0gZnVuY3Rpb24oY3R4LHgseSx3aWR0aCxoZWlnaHQscmFkaXVzKXtcblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdGN0eC5tb3ZlVG8oeCArIHJhZGl1cywgeSk7XG5cdFx0XHRjdHgubGluZVRvKHggKyB3aWR0aCAtIHJhZGl1cywgeSk7XG5cdFx0XHRjdHgucXVhZHJhdGljQ3VydmVUbyh4ICsgd2lkdGgsIHksIHggKyB3aWR0aCwgeSArIHJhZGl1cyk7XG5cdFx0XHRjdHgubGluZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCAtIHJhZGl1cyk7XG5cdFx0XHRjdHgucXVhZHJhdGljQ3VydmVUbyh4ICsgd2lkdGgsIHkgKyBoZWlnaHQsIHggKyB3aWR0aCAtIHJhZGl1cywgeSArIGhlaWdodCk7XG5cdFx0XHRjdHgubGluZVRvKHggKyByYWRpdXMsIHkgKyBoZWlnaHQpO1xuXHRcdFx0Y3R4LnF1YWRyYXRpY0N1cnZlVG8oeCwgeSArIGhlaWdodCwgeCwgeSArIGhlaWdodCAtIHJhZGl1cyk7XG5cdFx0XHRjdHgubGluZVRvKHgsIHkgKyByYWRpdXMpO1xuXHRcdFx0Y3R4LnF1YWRyYXRpY0N1cnZlVG8oeCwgeSwgeCArIHJhZGl1cywgeSk7XG5cdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0fTtcblxuXG5cdC8vU3RvcmUgYSByZWZlcmVuY2UgdG8gZWFjaCBpbnN0YW5jZSAtIGFsbG93aW5nIHVzIHRvIGdsb2JhbGx5IHJlc2l6ZSBjaGFydCBpbnN0YW5jZXMgb24gd2luZG93IHJlc2l6ZS5cblx0Ly9EZXN0cm95IG1ldGhvZCBvbiB0aGUgY2hhcnQgd2lsbCByZW1vdmUgdGhlIGluc3RhbmNlIG9mIHRoZSBjaGFydCBmcm9tIHRoaXMgcmVmZXJlbmNlLlxuXHRDaGFydC5pbnN0YW5jZXMgPSB7fTtcblxuXHRDaGFydC5UeXBlID0gZnVuY3Rpb24oZGF0YSxvcHRpb25zLGNoYXJ0KXtcblx0XHR0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXHRcdHRoaXMuY2hhcnQgPSBjaGFydDtcblx0XHR0aGlzLmlkID0gdWlkKCk7XG5cdFx0Ly9BZGQgdGhlIGNoYXJ0IGluc3RhbmNlIHRvIHRoZSBnbG9iYWwgbmFtZXNwYWNlXG5cdFx0Q2hhcnQuaW5zdGFuY2VzW3RoaXMuaWRdID0gdGhpcztcblxuXHRcdC8vIEluaXRpYWxpemUgaXMgYWx3YXlzIGNhbGxlZCB3aGVuIGEgY2hhcnQgdHlwZSBpcyBjcmVhdGVkXG5cdFx0Ly8gQnkgZGVmYXVsdCBpdCBpcyBhIG5vIG9wLCBidXQgaXQgc2hvdWxkIGJlIGV4dGVuZGVkXG5cdFx0aWYgKG9wdGlvbnMucmVzcG9uc2l2ZSl7XG5cdFx0XHR0aGlzLnJlc2l6ZSgpO1xuXHRcdH1cblx0XHR0aGlzLmluaXRpYWxpemUuY2FsbCh0aGlzLGRhdGEpO1xuXHR9O1xuXG5cdC8vQ29yZSBtZXRob2RzIHRoYXQnbGwgYmUgYSBwYXJ0IG9mIGV2ZXJ5IGNoYXJ0IHR5cGVcblx0ZXh0ZW5kKENoYXJ0LlR5cGUucHJvdG90eXBlLHtcblx0XHRpbml0aWFsaXplIDogZnVuY3Rpb24oKXtyZXR1cm4gdGhpczt9LFxuXHRcdGNsZWFyIDogZnVuY3Rpb24oKXtcblx0XHRcdGNsZWFyKHRoaXMuY2hhcnQpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHRzdG9wIDogZnVuY3Rpb24oKXtcblx0XHRcdC8vIFN0b3BzIGFueSBjdXJyZW50IGFuaW1hdGlvbiBsb29wIG9jY3VyaW5nXG5cdFx0XHRjYW5jZWxBbmltRnJhbWUodGhpcy5hbmltYXRpb25GcmFtZSk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXHRcdHJlc2l6ZSA6IGZ1bmN0aW9uKGNhbGxiYWNrKXtcblx0XHRcdHRoaXMuc3RvcCgpO1xuXHRcdFx0dmFyIGNhbnZhcyA9IHRoaXMuY2hhcnQuY2FudmFzLFxuXHRcdFx0XHRuZXdXaWR0aCA9IGdldE1heGltdW1XaWR0aCh0aGlzLmNoYXJ0LmNhbnZhcyksXG5cdFx0XHRcdG5ld0hlaWdodCA9IHRoaXMub3B0aW9ucy5tYWludGFpbkFzcGVjdFJhdGlvID8gbmV3V2lkdGggLyB0aGlzLmNoYXJ0LmFzcGVjdFJhdGlvIDogZ2V0TWF4aW11bUhlaWdodCh0aGlzLmNoYXJ0LmNhbnZhcyk7XG5cblx0XHRcdGNhbnZhcy53aWR0aCA9IHRoaXMuY2hhcnQud2lkdGggPSBuZXdXaWR0aDtcblx0XHRcdGNhbnZhcy5oZWlnaHQgPSB0aGlzLmNoYXJ0LmhlaWdodCA9IG5ld0hlaWdodDtcblxuXHRcdFx0cmV0aW5hU2NhbGUodGhpcy5jaGFydCk7XG5cblx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIil7XG5cdFx0XHRcdGNhbGxiYWNrLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHRyZWZsb3cgOiBub29wLFxuXHRcdHJlbmRlciA6IGZ1bmN0aW9uKHJlZmxvdyl7XG5cdFx0XHRpZiAocmVmbG93KXtcblx0XHRcdFx0dGhpcy5yZWZsb3coKTtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uICYmICFyZWZsb3cpe1xuXHRcdFx0XHRoZWxwZXJzLmFuaW1hdGlvbkxvb3AoXG5cdFx0XHRcdFx0dGhpcy5kcmF3LFxuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5hbmltYXRpb25TdGVwcyxcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMuYW5pbWF0aW9uRWFzaW5nLFxuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5vbkFuaW1hdGlvblByb2dyZXNzLFxuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5vbkFuaW1hdGlvbkNvbXBsZXRlLFxuXHRcdFx0XHRcdHRoaXNcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHRoaXMuZHJhdygpO1xuXHRcdFx0XHR0aGlzLm9wdGlvbnMub25BbmltYXRpb25Db21wbGV0ZS5jYWxsKHRoaXMpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHRnZW5lcmF0ZUxlZ2VuZCA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGVtcGxhdGUodGhpcy5vcHRpb25zLmxlZ2VuZFRlbXBsYXRlLHRoaXMpO1xuXHRcdH0sXG5cdFx0ZGVzdHJveSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLmNsZWFyKCk7XG5cdFx0XHR1bmJpbmRFdmVudHModGhpcywgdGhpcy5ldmVudHMpO1xuXHRcdFx0dmFyIGNhbnZhcyA9IHRoaXMuY2hhcnQuY2FudmFzO1xuXG5cdFx0XHQvLyBSZXNldCBjYW52YXMgaGVpZ2h0L3dpZHRoIGF0dHJpYnV0ZXMgc3RhcnRzIGEgZnJlc2ggd2l0aCB0aGUgY2FudmFzIGNvbnRleHRcblx0XHRcdGNhbnZhcy53aWR0aCA9IHRoaXMuY2hhcnQud2lkdGg7XG5cdFx0XHRjYW52YXMuaGVpZ2h0ID0gdGhpcy5jaGFydC5oZWlnaHQ7XG5cblx0XHRcdC8vIDwgSUU5IGRvZXNuJ3Qgc3VwcG9ydCByZW1vdmVQcm9wZXJ0eVxuXHRcdFx0aWYgKGNhbnZhcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eSkge1xuXHRcdFx0XHRjYW52YXMuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ3dpZHRoJyk7XG5cdFx0XHRcdGNhbnZhcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnaGVpZ2h0Jyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjYW52YXMuc3R5bGUucmVtb3ZlQXR0cmlidXRlKCd3aWR0aCcpO1xuXHRcdFx0XHRjYW52YXMuc3R5bGUucmVtb3ZlQXR0cmlidXRlKCdoZWlnaHQnKTtcblx0XHRcdH1cblxuXHRcdFx0ZGVsZXRlIENoYXJ0Lmluc3RhbmNlc1t0aGlzLmlkXTtcblx0XHR9LFxuXHRcdHNob3dUb29sdGlwIDogZnVuY3Rpb24oQ2hhcnRFbGVtZW50cywgZm9yY2VSZWRyYXcpe1xuXHRcdFx0Ly8gT25seSByZWRyYXcgdGhlIGNoYXJ0IGlmIHdlJ3ZlIGFjdHVhbGx5IGNoYW5nZWQgd2hhdCB3ZSdyZSBob3ZlcmluZyBvbi5cblx0XHRcdGlmICh0eXBlb2YgdGhpcy5hY3RpdmVFbGVtZW50cyA9PT0gJ3VuZGVmaW5lZCcpIHRoaXMuYWN0aXZlRWxlbWVudHMgPSBbXTtcblxuXHRcdFx0dmFyIGlzQ2hhbmdlZCA9IChmdW5jdGlvbihFbGVtZW50cyl7XG5cdFx0XHRcdHZhciBjaGFuZ2VkID0gZmFsc2U7XG5cblx0XHRcdFx0aWYgKEVsZW1lbnRzLmxlbmd0aCAhPT0gdGhpcy5hY3RpdmVFbGVtZW50cy5sZW5ndGgpe1xuXHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRcdHJldHVybiBjaGFuZ2VkO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZWFjaChFbGVtZW50cywgZnVuY3Rpb24oZWxlbWVudCwgaW5kZXgpe1xuXHRcdFx0XHRcdGlmIChlbGVtZW50ICE9PSB0aGlzLmFjdGl2ZUVsZW1lbnRzW2luZGV4XSl7XG5cdFx0XHRcdFx0XHRjaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIHRoaXMpO1xuXHRcdFx0XHRyZXR1cm4gY2hhbmdlZDtcblx0XHRcdH0pLmNhbGwodGhpcywgQ2hhcnRFbGVtZW50cyk7XG5cblx0XHRcdGlmICghaXNDaGFuZ2VkICYmICFmb3JjZVJlZHJhdyl7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHRoaXMuYWN0aXZlRWxlbWVudHMgPSBDaGFydEVsZW1lbnRzO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5kcmF3KCk7XG5cdFx0XHRpZih0aGlzLm9wdGlvbnMuY3VzdG9tVG9vbHRpcHMpe1xuXHRcdFx0XHR0aGlzLm9wdGlvbnMuY3VzdG9tVG9vbHRpcHMoZmFsc2UpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKENoYXJ0RWxlbWVudHMubGVuZ3RoID4gMCl7XG5cdFx0XHRcdC8vIElmIHdlIGhhdmUgbXVsdGlwbGUgZGF0YXNldHMsIHNob3cgYSBNdWx0aVRvb2x0aXAgZm9yIGFsbCBvZiB0aGUgZGF0YSBwb2ludHMgYXQgdGhhdCBpbmRleFxuXHRcdFx0XHRpZiAodGhpcy5kYXRhc2V0cyAmJiB0aGlzLmRhdGFzZXRzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHR2YXIgZGF0YUFycmF5LFxuXHRcdFx0XHRcdFx0ZGF0YUluZGV4O1xuXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IHRoaXMuZGF0YXNldHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0XHRcdGRhdGFBcnJheSA9IHRoaXMuZGF0YXNldHNbaV0ucG9pbnRzIHx8IHRoaXMuZGF0YXNldHNbaV0uYmFycyB8fCB0aGlzLmRhdGFzZXRzW2ldLnNlZ21lbnRzO1xuXHRcdFx0XHRcdFx0ZGF0YUluZGV4ID0gaW5kZXhPZihkYXRhQXJyYXksIENoYXJ0RWxlbWVudHNbMF0pO1xuXHRcdFx0XHRcdFx0aWYgKGRhdGFJbmRleCAhPT0gLTEpe1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFyIHRvb2x0aXBMYWJlbHMgPSBbXSxcblx0XHRcdFx0XHRcdHRvb2x0aXBDb2xvcnMgPSBbXSxcblx0XHRcdFx0XHRcdG1lZGlhblBvc2l0aW9uID0gKGZ1bmN0aW9uKGluZGV4KSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gR2V0IGFsbCB0aGUgcG9pbnRzIGF0IHRoYXQgcGFydGljdWxhciBpbmRleFxuXHRcdFx0XHRcdFx0XHR2YXIgRWxlbWVudHMgPSBbXSxcblx0XHRcdFx0XHRcdFx0XHRkYXRhQ29sbGVjdGlvbixcblx0XHRcdFx0XHRcdFx0XHR4UG9zaXRpb25zID0gW10sXG5cdFx0XHRcdFx0XHRcdFx0eVBvc2l0aW9ucyA9IFtdLFxuXHRcdFx0XHRcdFx0XHRcdHhNYXgsXG5cdFx0XHRcdFx0XHRcdFx0eU1heCxcblx0XHRcdFx0XHRcdFx0XHR4TWluLFxuXHRcdFx0XHRcdFx0XHRcdHlNaW47XG5cdFx0XHRcdFx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmRhdGFzZXRzLCBmdW5jdGlvbihkYXRhc2V0KXtcblx0XHRcdFx0XHRcdFx0XHRkYXRhQ29sbGVjdGlvbiA9IGRhdGFzZXQucG9pbnRzIHx8IGRhdGFzZXQuYmFycyB8fCBkYXRhc2V0LnNlZ21lbnRzO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkYXRhQ29sbGVjdGlvbltkYXRhSW5kZXhdICYmIGRhdGFDb2xsZWN0aW9uW2RhdGFJbmRleF0uaGFzVmFsdWUoKSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRFbGVtZW50cy5wdXNoKGRhdGFDb2xsZWN0aW9uW2RhdGFJbmRleF0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0aGVscGVycy5lYWNoKEVsZW1lbnRzLCBmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0XHRcdFx0XHRcdFx0eFBvc2l0aW9ucy5wdXNoKGVsZW1lbnQueCk7XG5cdFx0XHRcdFx0XHRcdFx0eVBvc2l0aW9ucy5wdXNoKGVsZW1lbnQueSk7XG5cblxuXHRcdFx0XHRcdFx0XHRcdC8vSW5jbHVkZSBhbnkgY29sb3VyIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbGVtZW50XG5cdFx0XHRcdFx0XHRcdFx0dG9vbHRpcExhYmVscy5wdXNoKGhlbHBlcnMudGVtcGxhdGUodGhpcy5vcHRpb25zLm11bHRpVG9vbHRpcFRlbXBsYXRlLCBlbGVtZW50KSk7XG5cdFx0XHRcdFx0XHRcdFx0dG9vbHRpcENvbG9ycy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0XHRcdGZpbGw6IGVsZW1lbnQuX3NhdmVkLmZpbGxDb2xvciB8fCBlbGVtZW50LmZpbGxDb2xvcixcblx0XHRcdFx0XHRcdFx0XHRcdHN0cm9rZTogZWxlbWVudC5fc2F2ZWQuc3Ryb2tlQ29sb3IgfHwgZWxlbWVudC5zdHJva2VDb2xvclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdH0sIHRoaXMpO1xuXG5cdFx0XHRcdFx0XHRcdHlNaW4gPSBtaW4oeVBvc2l0aW9ucyk7XG5cdFx0XHRcdFx0XHRcdHlNYXggPSBtYXgoeVBvc2l0aW9ucyk7XG5cblx0XHRcdFx0XHRcdFx0eE1pbiA9IG1pbih4UG9zaXRpb25zKTtcblx0XHRcdFx0XHRcdFx0eE1heCA9IG1heCh4UG9zaXRpb25zKTtcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdHg6ICh4TWluID4gdGhpcy5jaGFydC53aWR0aC8yKSA/IHhNaW4gOiB4TWF4LFxuXHRcdFx0XHRcdFx0XHRcdHk6ICh5TWluICsgeU1heCkvMlxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fSkuY2FsbCh0aGlzLCBkYXRhSW5kZXgpO1xuXG5cdFx0XHRcdFx0bmV3IENoYXJ0Lk11bHRpVG9vbHRpcCh7XG5cdFx0XHRcdFx0XHR4OiBtZWRpYW5Qb3NpdGlvbi54LFxuXHRcdFx0XHRcdFx0eTogbWVkaWFuUG9zaXRpb24ueSxcblx0XHRcdFx0XHRcdHhQYWRkaW5nOiB0aGlzLm9wdGlvbnMudG9vbHRpcFhQYWRkaW5nLFxuXHRcdFx0XHRcdFx0eVBhZGRpbmc6IHRoaXMub3B0aW9ucy50b29sdGlwWVBhZGRpbmcsXG5cdFx0XHRcdFx0XHR4T2Zmc2V0OiB0aGlzLm9wdGlvbnMudG9vbHRpcFhPZmZzZXQsXG5cdFx0XHRcdFx0XHRmaWxsQ29sb3I6IHRoaXMub3B0aW9ucy50b29sdGlwRmlsbENvbG9yLFxuXHRcdFx0XHRcdFx0dGV4dENvbG9yOiB0aGlzLm9wdGlvbnMudG9vbHRpcEZvbnRDb2xvcixcblx0XHRcdFx0XHRcdGZvbnRGYW1pbHk6IHRoaXMub3B0aW9ucy50b29sdGlwRm9udEZhbWlseSxcblx0XHRcdFx0XHRcdGZvbnRTdHlsZTogdGhpcy5vcHRpb25zLnRvb2x0aXBGb250U3R5bGUsXG5cdFx0XHRcdFx0XHRmb250U2l6ZTogdGhpcy5vcHRpb25zLnRvb2x0aXBGb250U2l6ZSxcblx0XHRcdFx0XHRcdHRpdGxlVGV4dENvbG9yOiB0aGlzLm9wdGlvbnMudG9vbHRpcFRpdGxlRm9udENvbG9yLFxuXHRcdFx0XHRcdFx0dGl0bGVGb250RmFtaWx5OiB0aGlzLm9wdGlvbnMudG9vbHRpcFRpdGxlRm9udEZhbWlseSxcblx0XHRcdFx0XHRcdHRpdGxlRm9udFN0eWxlOiB0aGlzLm9wdGlvbnMudG9vbHRpcFRpdGxlRm9udFN0eWxlLFxuXHRcdFx0XHRcdFx0dGl0bGVGb250U2l6ZTogdGhpcy5vcHRpb25zLnRvb2x0aXBUaXRsZUZvbnRTaXplLFxuXHRcdFx0XHRcdFx0Y29ybmVyUmFkaXVzOiB0aGlzLm9wdGlvbnMudG9vbHRpcENvcm5lclJhZGl1cyxcblx0XHRcdFx0XHRcdGxhYmVsczogdG9vbHRpcExhYmVscyxcblx0XHRcdFx0XHRcdGxlZ2VuZENvbG9yczogdG9vbHRpcENvbG9ycyxcblx0XHRcdFx0XHRcdGxlZ2VuZENvbG9yQmFja2dyb3VuZCA6IHRoaXMub3B0aW9ucy5tdWx0aVRvb2x0aXBLZXlCYWNrZ3JvdW5kLFxuXHRcdFx0XHRcdFx0dGl0bGU6IENoYXJ0RWxlbWVudHNbMF0ubGFiZWwsXG5cdFx0XHRcdFx0XHRjaGFydDogdGhpcy5jaGFydCxcblx0XHRcdFx0XHRcdGN0eDogdGhpcy5jaGFydC5jdHgsXG5cdFx0XHRcdFx0XHRjdXN0b206IHRoaXMub3B0aW9ucy5jdXN0b21Ub29sdGlwc1xuXHRcdFx0XHRcdH0pLmRyYXcoKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGVhY2goQ2hhcnRFbGVtZW50cywgZnVuY3Rpb24oRWxlbWVudCkge1xuXHRcdFx0XHRcdFx0dmFyIHRvb2x0aXBQb3NpdGlvbiA9IEVsZW1lbnQudG9vbHRpcFBvc2l0aW9uKCk7XG5cdFx0XHRcdFx0XHRuZXcgQ2hhcnQuVG9vbHRpcCh7XG5cdFx0XHRcdFx0XHRcdHg6IE1hdGgucm91bmQodG9vbHRpcFBvc2l0aW9uLngpLFxuXHRcdFx0XHRcdFx0XHR5OiBNYXRoLnJvdW5kKHRvb2x0aXBQb3NpdGlvbi55KSxcblx0XHRcdFx0XHRcdFx0eFBhZGRpbmc6IHRoaXMub3B0aW9ucy50b29sdGlwWFBhZGRpbmcsXG5cdFx0XHRcdFx0XHRcdHlQYWRkaW5nOiB0aGlzLm9wdGlvbnMudG9vbHRpcFlQYWRkaW5nLFxuXHRcdFx0XHRcdFx0XHRmaWxsQ29sb3I6IHRoaXMub3B0aW9ucy50b29sdGlwRmlsbENvbG9yLFxuXHRcdFx0XHRcdFx0XHR0ZXh0Q29sb3I6IHRoaXMub3B0aW9ucy50b29sdGlwRm9udENvbG9yLFxuXHRcdFx0XHRcdFx0XHRmb250RmFtaWx5OiB0aGlzLm9wdGlvbnMudG9vbHRpcEZvbnRGYW1pbHksXG5cdFx0XHRcdFx0XHRcdGZvbnRTdHlsZTogdGhpcy5vcHRpb25zLnRvb2x0aXBGb250U3R5bGUsXG5cdFx0XHRcdFx0XHRcdGZvbnRTaXplOiB0aGlzLm9wdGlvbnMudG9vbHRpcEZvbnRTaXplLFxuXHRcdFx0XHRcdFx0XHRjYXJldEhlaWdodDogdGhpcy5vcHRpb25zLnRvb2x0aXBDYXJldFNpemUsXG5cdFx0XHRcdFx0XHRcdGNvcm5lclJhZGl1czogdGhpcy5vcHRpb25zLnRvb2x0aXBDb3JuZXJSYWRpdXMsXG5cdFx0XHRcdFx0XHRcdHRleHQ6IHRlbXBsYXRlKHRoaXMub3B0aW9ucy50b29sdGlwVGVtcGxhdGUsIEVsZW1lbnQpLFxuXHRcdFx0XHRcdFx0XHRjaGFydDogdGhpcy5jaGFydCxcblx0XHRcdFx0XHRcdFx0Y3VzdG9tOiB0aGlzLm9wdGlvbnMuY3VzdG9tVG9vbHRpcHNcblx0XHRcdFx0XHRcdH0pLmRyYXcoKTtcblx0XHRcdFx0XHR9LCB0aGlzKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHR0b0Jhc2U2NEltYWdlIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB0aGlzLmNoYXJ0LmNhbnZhcy50b0RhdGFVUkwuYXBwbHkodGhpcy5jaGFydC5jYW52YXMsIGFyZ3VtZW50cyk7XG5cdFx0fVxuXHR9KTtcblxuXHRDaGFydC5UeXBlLmV4dGVuZCA9IGZ1bmN0aW9uKGV4dGVuc2lvbnMpe1xuXG5cdFx0dmFyIHBhcmVudCA9IHRoaXM7XG5cblx0XHR2YXIgQ2hhcnRUeXBlID0gZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBwYXJlbnQuYXBwbHkodGhpcyxhcmd1bWVudHMpO1xuXHRcdH07XG5cblx0XHQvL0NvcHkgdGhlIHByb3RvdHlwZSBvYmplY3Qgb2YgdGhlIHRoaXMgY2xhc3Ncblx0XHRDaGFydFR5cGUucHJvdG90eXBlID0gY2xvbmUocGFyZW50LnByb3RvdHlwZSk7XG5cdFx0Ly9Ob3cgb3ZlcndyaXRlIHNvbWUgb2YgdGhlIHByb3BlcnRpZXMgaW4gdGhlIGJhc2UgY2xhc3Mgd2l0aCB0aGUgbmV3IGV4dGVuc2lvbnNcblx0XHRleHRlbmQoQ2hhcnRUeXBlLnByb3RvdHlwZSwgZXh0ZW5zaW9ucyk7XG5cblx0XHRDaGFydFR5cGUuZXh0ZW5kID0gQ2hhcnQuVHlwZS5leHRlbmQ7XG5cblx0XHRpZiAoZXh0ZW5zaW9ucy5uYW1lIHx8IHBhcmVudC5wcm90b3R5cGUubmFtZSl7XG5cblx0XHRcdHZhciBjaGFydE5hbWUgPSBleHRlbnNpb25zLm5hbWUgfHwgcGFyZW50LnByb3RvdHlwZS5uYW1lO1xuXHRcdFx0Ly9Bc3NpZ24gYW55IHBvdGVudGlhbCBkZWZhdWx0IHZhbHVlcyBvZiB0aGUgbmV3IGNoYXJ0IHR5cGVcblxuXHRcdFx0Ly9JZiBub25lIGFyZSBkZWZpbmVkLCB3ZSdsbCB1c2UgYSBjbG9uZSBvZiB0aGUgY2hhcnQgdHlwZSB0aGlzIGlzIGJlaW5nIGV4dGVuZGVkIGZyb20uXG5cdFx0XHQvL0kuZS4gaWYgd2UgZXh0ZW5kIGEgbGluZSBjaGFydCwgd2UnbGwgdXNlIHRoZSBkZWZhdWx0cyBmcm9tIHRoZSBsaW5lIGNoYXJ0IGlmIG91ciBuZXcgY2hhcnRcblx0XHRcdC8vZG9lc24ndCBkZWZpbmUgc29tZSBkZWZhdWx0cyBvZiB0aGVpciBvd24uXG5cblx0XHRcdHZhciBiYXNlRGVmYXVsdHMgPSAoQ2hhcnQuZGVmYXVsdHNbcGFyZW50LnByb3RvdHlwZS5uYW1lXSkgPyBjbG9uZShDaGFydC5kZWZhdWx0c1twYXJlbnQucHJvdG90eXBlLm5hbWVdKSA6IHt9O1xuXG5cdFx0XHRDaGFydC5kZWZhdWx0c1tjaGFydE5hbWVdID0gZXh0ZW5kKGJhc2VEZWZhdWx0cyxleHRlbnNpb25zLmRlZmF1bHRzKTtcblxuXHRcdFx0Q2hhcnQudHlwZXNbY2hhcnROYW1lXSA9IENoYXJ0VHlwZTtcblxuXHRcdFx0Ly9SZWdpc3RlciB0aGlzIG5ldyBjaGFydCB0eXBlIGluIHRoZSBDaGFydCBwcm90b3R5cGVcblx0XHRcdENoYXJ0LnByb3RvdHlwZVtjaGFydE5hbWVdID0gZnVuY3Rpb24oZGF0YSxvcHRpb25zKXtcblx0XHRcdFx0dmFyIGNvbmZpZyA9IG1lcmdlKENoYXJ0LmRlZmF1bHRzLmdsb2JhbCwgQ2hhcnQuZGVmYXVsdHNbY2hhcnROYW1lXSwgb3B0aW9ucyB8fCB7fSk7XG5cdFx0XHRcdHJldHVybiBuZXcgQ2hhcnRUeXBlKGRhdGEsY29uZmlnLHRoaXMpO1xuXHRcdFx0fTtcblx0XHR9IGVsc2V7XG5cdFx0XHR3YXJuKFwiTmFtZSBub3QgcHJvdmlkZWQgZm9yIHRoaXMgY2hhcnQsIHNvIGl0IGhhc24ndCBiZWVuIHJlZ2lzdGVyZWRcIik7XG5cdFx0fVxuXHRcdHJldHVybiBwYXJlbnQ7XG5cdH07XG5cblx0Q2hhcnQuRWxlbWVudCA9IGZ1bmN0aW9uKGNvbmZpZ3VyYXRpb24pe1xuXHRcdGV4dGVuZCh0aGlzLGNvbmZpZ3VyYXRpb24pO1xuXHRcdHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XG5cdFx0dGhpcy5zYXZlKCk7XG5cdH07XG5cdGV4dGVuZChDaGFydC5FbGVtZW50LnByb3RvdHlwZSx7XG5cdFx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKCl7fSxcblx0XHRyZXN0b3JlIDogZnVuY3Rpb24ocHJvcHMpe1xuXHRcdFx0aWYgKCFwcm9wcyl7XG5cdFx0XHRcdGV4dGVuZCh0aGlzLHRoaXMuX3NhdmVkKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVhY2gocHJvcHMsZnVuY3Rpb24oa2V5KXtcblx0XHRcdFx0XHR0aGlzW2tleV0gPSB0aGlzLl9zYXZlZFtrZXldO1xuXHRcdFx0XHR9LHRoaXMpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHRzYXZlIDogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuX3NhdmVkID0gY2xvbmUodGhpcyk7XG5cdFx0XHRkZWxldGUgdGhpcy5fc2F2ZWQuX3NhdmVkO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHR1cGRhdGUgOiBmdW5jdGlvbihuZXdQcm9wcyl7XG5cdFx0XHRlYWNoKG5ld1Byb3BzLGZ1bmN0aW9uKHZhbHVlLGtleSl7XG5cdFx0XHRcdHRoaXMuX3NhdmVkW2tleV0gPSB0aGlzW2tleV07XG5cdFx0XHRcdHRoaXNba2V5XSA9IHZhbHVlO1xuXHRcdFx0fSx0aGlzKTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cdFx0dHJhbnNpdGlvbiA6IGZ1bmN0aW9uKHByb3BzLGVhc2Upe1xuXHRcdFx0ZWFjaChwcm9wcyxmdW5jdGlvbih2YWx1ZSxrZXkpe1xuXHRcdFx0XHR0aGlzW2tleV0gPSAoKHZhbHVlIC0gdGhpcy5fc2F2ZWRba2V5XSkgKiBlYXNlKSArIHRoaXMuX3NhdmVkW2tleV07XG5cdFx0XHR9LHRoaXMpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHR0b29sdGlwUG9zaXRpb24gOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0eCA6IHRoaXMueCxcblx0XHRcdFx0eSA6IHRoaXMueVxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGhhc1ZhbHVlOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIGlzTnVtYmVyKHRoaXMudmFsdWUpO1xuXHRcdH1cblx0fSk7XG5cblx0Q2hhcnQuRWxlbWVudC5leHRlbmQgPSBpbmhlcml0cztcblxuXG5cdENoYXJ0LlBvaW50ID0gQ2hhcnQuRWxlbWVudC5leHRlbmQoe1xuXHRcdGRpc3BsYXk6IHRydWUsXG5cdFx0aW5SYW5nZTogZnVuY3Rpb24oY2hhcnRYLGNoYXJ0WSl7XG5cdFx0XHR2YXIgaGl0RGV0ZWN0aW9uUmFuZ2UgPSB0aGlzLmhpdERldGVjdGlvblJhZGl1cyArIHRoaXMucmFkaXVzO1xuXHRcdFx0cmV0dXJuICgoTWF0aC5wb3coY2hhcnRYLXRoaXMueCwgMikrTWF0aC5wb3coY2hhcnRZLXRoaXMueSwgMikpIDwgTWF0aC5wb3coaGl0RGV0ZWN0aW9uUmFuZ2UsMikpO1xuXHRcdH0sXG5cdFx0ZHJhdyA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAodGhpcy5kaXNwbGF5KXtcblx0XHRcdFx0dmFyIGN0eCA9IHRoaXMuY3R4O1xuXHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cblx0XHRcdFx0Y3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIDAsIE1hdGguUEkqMik7XG5cdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblxuXHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnN0cm9rZUNvbG9yO1xuXHRcdFx0XHRjdHgubGluZVdpZHRoID0gdGhpcy5zdHJva2VXaWR0aDtcblxuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy5maWxsQ29sb3I7XG5cblx0XHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdFx0fVxuXG5cblx0XHRcdC8vUXVpY2sgZGVidWcgZm9yIGJlemllciBjdXJ2ZSBzcGxpbmluZ1xuXHRcdFx0Ly9IaWdobGlnaHRzIGNvbnRyb2wgcG9pbnRzIGFuZCB0aGUgbGluZSBiZXR3ZWVuIHRoZW0uXG5cdFx0XHQvL0hhbmR5IGZvciBkZXYgLSBzdHJpcHBlZCBpbiB0aGUgbWluIHZlcnNpb24uXG5cblx0XHRcdC8vIGN0eC5zYXZlKCk7XG5cdFx0XHQvLyBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xuXHRcdFx0Ly8gY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiXG5cdFx0XHQvLyBjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHQvLyBjdHguYXJjKHRoaXMuY29udHJvbFBvaW50cy5pbm5lci54LHRoaXMuY29udHJvbFBvaW50cy5pbm5lci55LCAyLCAwLCBNYXRoLlBJKjIpO1xuXHRcdFx0Ly8gY3R4LmZpbGwoKTtcblxuXHRcdFx0Ly8gY3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0Ly8gY3R4LmFyYyh0aGlzLmNvbnRyb2xQb2ludHMub3V0ZXIueCx0aGlzLmNvbnRyb2xQb2ludHMub3V0ZXIueSwgMiwgMCwgTWF0aC5QSSoyKTtcblx0XHRcdC8vIGN0eC5maWxsKCk7XG5cblx0XHRcdC8vIGN0eC5tb3ZlVG8odGhpcy5jb250cm9sUG9pbnRzLmlubmVyLngsdGhpcy5jb250cm9sUG9pbnRzLmlubmVyLnkpO1xuXHRcdFx0Ly8gY3R4LmxpbmVUbyh0aGlzLngsIHRoaXMueSk7XG5cdFx0XHQvLyBjdHgubGluZVRvKHRoaXMuY29udHJvbFBvaW50cy5vdXRlci54LHRoaXMuY29udHJvbFBvaW50cy5vdXRlci55KTtcblx0XHRcdC8vIGN0eC5zdHJva2UoKTtcblxuXHRcdFx0Ly8gY3R4LnJlc3RvcmUoKTtcblxuXG5cblx0XHR9XG5cdH0pO1xuXG5cdENoYXJ0LkFyYyA9IENoYXJ0LkVsZW1lbnQuZXh0ZW5kKHtcblx0XHRpblJhbmdlIDogZnVuY3Rpb24oY2hhcnRYLGNoYXJ0WSl7XG5cblx0XHRcdHZhciBwb2ludFJlbGF0aXZlUG9zaXRpb24gPSBoZWxwZXJzLmdldEFuZ2xlRnJvbVBvaW50KHRoaXMsIHtcblx0XHRcdFx0eDogY2hhcnRYLFxuXHRcdFx0XHR5OiBjaGFydFlcblx0XHRcdH0pO1xuXG5cdFx0XHQvL0NoZWNrIGlmIHdpdGhpbiB0aGUgcmFuZ2Ugb2YgdGhlIG9wZW4vY2xvc2UgYW5nbGVcblx0XHRcdHZhciBiZXR3ZWVuQW5nbGVzID0gKHBvaW50UmVsYXRpdmVQb3NpdGlvbi5hbmdsZSA+PSB0aGlzLnN0YXJ0QW5nbGUgJiYgcG9pbnRSZWxhdGl2ZVBvc2l0aW9uLmFuZ2xlIDw9IHRoaXMuZW5kQW5nbGUpLFxuXHRcdFx0XHR3aXRoaW5SYWRpdXMgPSAocG9pbnRSZWxhdGl2ZVBvc2l0aW9uLmRpc3RhbmNlID49IHRoaXMuaW5uZXJSYWRpdXMgJiYgcG9pbnRSZWxhdGl2ZVBvc2l0aW9uLmRpc3RhbmNlIDw9IHRoaXMub3V0ZXJSYWRpdXMpO1xuXG5cdFx0XHRyZXR1cm4gKGJldHdlZW5BbmdsZXMgJiYgd2l0aGluUmFkaXVzKTtcblx0XHRcdC8vRW5zdXJlIHdpdGhpbiB0aGUgb3V0c2lkZSBvZiB0aGUgYXJjIGNlbnRyZSwgYnV0IGluc2lkZSBhcmMgb3V0ZXJcblx0XHR9LFxuXHRcdHRvb2x0aXBQb3NpdGlvbiA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgY2VudHJlQW5nbGUgPSB0aGlzLnN0YXJ0QW5nbGUgKyAoKHRoaXMuZW5kQW5nbGUgLSB0aGlzLnN0YXJ0QW5nbGUpIC8gMiksXG5cdFx0XHRcdHJhbmdlRnJvbUNlbnRyZSA9ICh0aGlzLm91dGVyUmFkaXVzIC0gdGhpcy5pbm5lclJhZGl1cykgLyAyICsgdGhpcy5pbm5lclJhZGl1cztcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHggOiB0aGlzLnggKyAoTWF0aC5jb3MoY2VudHJlQW5nbGUpICogcmFuZ2VGcm9tQ2VudHJlKSxcblx0XHRcdFx0eSA6IHRoaXMueSArIChNYXRoLnNpbihjZW50cmVBbmdsZSkgKiByYW5nZUZyb21DZW50cmUpXG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0ZHJhdyA6IGZ1bmN0aW9uKGFuaW1hdGlvblBlcmNlbnQpe1xuXG5cdFx0XHR2YXIgZWFzaW5nRGVjaW1hbCA9IGFuaW1hdGlvblBlcmNlbnQgfHwgMTtcblxuXHRcdFx0dmFyIGN0eCA9IHRoaXMuY3R4O1xuXG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cblx0XHRcdGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMub3V0ZXJSYWRpdXMsIHRoaXMuc3RhcnRBbmdsZSwgdGhpcy5lbmRBbmdsZSk7XG5cblx0XHRcdGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMuaW5uZXJSYWRpdXMsIHRoaXMuZW5kQW5nbGUsIHRoaXMuc3RhcnRBbmdsZSwgdHJ1ZSk7XG5cblx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuc3Ryb2tlQ29sb3I7XG5cdFx0XHRjdHgubGluZVdpZHRoID0gdGhpcy5zdHJva2VXaWR0aDtcblxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlsbENvbG9yO1xuXG5cdFx0XHRjdHguZmlsbCgpO1xuXHRcdFx0Y3R4LmxpbmVKb2luID0gJ2JldmVsJztcblxuXHRcdFx0aWYgKHRoaXMuc2hvd1N0cm9rZSl7XG5cdFx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdENoYXJ0LlJlY3RhbmdsZSA9IENoYXJ0LkVsZW1lbnQuZXh0ZW5kKHtcblx0XHRkcmF3IDogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBjdHggPSB0aGlzLmN0eCxcblx0XHRcdFx0aGFsZldpZHRoID0gdGhpcy53aWR0aC8yLFxuXHRcdFx0XHRsZWZ0WCA9IHRoaXMueCAtIGhhbGZXaWR0aCxcblx0XHRcdFx0cmlnaHRYID0gdGhpcy54ICsgaGFsZldpZHRoLFxuXHRcdFx0XHR0b3AgPSB0aGlzLmJhc2UgLSAodGhpcy5iYXNlIC0gdGhpcy55KSxcblx0XHRcdFx0aGFsZlN0cm9rZSA9IHRoaXMuc3Ryb2tlV2lkdGggLyAyO1xuXG5cdFx0XHQvLyBDYW52YXMgZG9lc24ndCBhbGxvdyB1cyB0byBzdHJva2UgaW5zaWRlIHRoZSB3aWR0aCBzbyB3ZSBjYW5cblx0XHRcdC8vIGFkanVzdCB0aGUgc2l6ZXMgdG8gZml0IGlmIHdlJ3JlIHNldHRpbmcgYSBzdHJva2Ugb24gdGhlIGxpbmVcblx0XHRcdGlmICh0aGlzLnNob3dTdHJva2Upe1xuXHRcdFx0XHRsZWZ0WCArPSBoYWxmU3Ryb2tlO1xuXHRcdFx0XHRyaWdodFggLT0gaGFsZlN0cm9rZTtcblx0XHRcdFx0dG9wICs9IGhhbGZTdHJva2U7XG5cdFx0XHR9XG5cblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlsbENvbG9yO1xuXHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gdGhpcy5zdHJva2VDb2xvcjtcblx0XHRcdGN0eC5saW5lV2lkdGggPSB0aGlzLnN0cm9rZVdpZHRoO1xuXG5cdFx0XHQvLyBJdCdkIGJlIG5pY2UgdG8ga2VlcCB0aGlzIGNsYXNzIHRvdGFsbHkgZ2VuZXJpYyB0byBhbnkgcmVjdGFuZ2xlXG5cdFx0XHQvLyBhbmQgc2ltcGx5IHNwZWNpZnkgd2hpY2ggYm9yZGVyIHRvIG1pc3Mgb3V0LlxuXHRcdFx0Y3R4Lm1vdmVUbyhsZWZ0WCwgdGhpcy5iYXNlKTtcblx0XHRcdGN0eC5saW5lVG8obGVmdFgsIHRvcCk7XG5cdFx0XHRjdHgubGluZVRvKHJpZ2h0WCwgdG9wKTtcblx0XHRcdGN0eC5saW5lVG8ocmlnaHRYLCB0aGlzLmJhc2UpO1xuXHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdGlmICh0aGlzLnNob3dTdHJva2Upe1xuXHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoZWlnaHQgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHRoaXMuYmFzZSAtIHRoaXMueTtcblx0XHR9LFxuXHRcdGluUmFuZ2UgOiBmdW5jdGlvbihjaGFydFgsY2hhcnRZKXtcblx0XHRcdHJldHVybiAoY2hhcnRYID49IHRoaXMueCAtIHRoaXMud2lkdGgvMiAmJiBjaGFydFggPD0gdGhpcy54ICsgdGhpcy53aWR0aC8yKSAmJiAoY2hhcnRZID49IHRoaXMueSAmJiBjaGFydFkgPD0gdGhpcy5iYXNlKTtcblx0XHR9XG5cdH0pO1xuXG5cdENoYXJ0LlRvb2x0aXAgPSBDaGFydC5FbGVtZW50LmV4dGVuZCh7XG5cdFx0ZHJhdyA6IGZ1bmN0aW9uKCl7XG5cblx0XHRcdHZhciBjdHggPSB0aGlzLmNoYXJ0LmN0eDtcblxuXHRcdFx0Y3R4LmZvbnQgPSBmb250U3RyaW5nKHRoaXMuZm9udFNpemUsdGhpcy5mb250U3R5bGUsdGhpcy5mb250RmFtaWx5KTtcblxuXHRcdFx0dGhpcy54QWxpZ24gPSBcImNlbnRlclwiO1xuXHRcdFx0dGhpcy55QWxpZ24gPSBcImFib3ZlXCI7XG5cblx0XHRcdC8vRGlzdGFuY2UgYmV0d2VlbiB0aGUgYWN0dWFsIGVsZW1lbnQueSBwb3NpdGlvbiBhbmQgdGhlIHN0YXJ0IG9mIHRoZSB0b29sdGlwIGNhcmV0XG5cdFx0XHR2YXIgY2FyZXRQYWRkaW5nID0gdGhpcy5jYXJldFBhZGRpbmcgPSAyO1xuXG5cdFx0XHR2YXIgdG9vbHRpcFdpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KHRoaXMudGV4dCkud2lkdGggKyAyKnRoaXMueFBhZGRpbmcsXG5cdFx0XHRcdHRvb2x0aXBSZWN0SGVpZ2h0ID0gdGhpcy5mb250U2l6ZSArIDIqdGhpcy55UGFkZGluZyxcblx0XHRcdFx0dG9vbHRpcEhlaWdodCA9IHRvb2x0aXBSZWN0SGVpZ2h0ICsgdGhpcy5jYXJldEhlaWdodCArIGNhcmV0UGFkZGluZztcblxuXHRcdFx0aWYgKHRoaXMueCArIHRvb2x0aXBXaWR0aC8yID50aGlzLmNoYXJ0LndpZHRoKXtcblx0XHRcdFx0dGhpcy54QWxpZ24gPSBcImxlZnRcIjtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy54IC0gdG9vbHRpcFdpZHRoLzIgPCAwKXtcblx0XHRcdFx0dGhpcy54QWxpZ24gPSBcInJpZ2h0XCI7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLnkgLSB0b29sdGlwSGVpZ2h0IDwgMCl7XG5cdFx0XHRcdHRoaXMueUFsaWduID0gXCJiZWxvd1wiO1xuXHRcdFx0fVxuXG5cblx0XHRcdHZhciB0b29sdGlwWCA9IHRoaXMueCAtIHRvb2x0aXBXaWR0aC8yLFxuXHRcdFx0XHR0b29sdGlwWSA9IHRoaXMueSAtIHRvb2x0aXBIZWlnaHQ7XG5cblx0XHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLmZpbGxDb2xvcjtcblxuXHRcdFx0Ly8gQ3VzdG9tIFRvb2x0aXBzXG5cdFx0XHRpZih0aGlzLmN1c3RvbSl7XG5cdFx0XHRcdHRoaXMuY3VzdG9tKHRoaXMpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0c3dpdGNoKHRoaXMueUFsaWduKVxuXHRcdFx0XHR7XG5cdFx0XHRcdGNhc2UgXCJhYm92ZVwiOlxuXHRcdFx0XHRcdC8vRHJhdyBhIGNhcmV0IGFib3ZlIHRoZSB4L3lcblx0XHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdFx0Y3R4Lm1vdmVUbyh0aGlzLngsdGhpcy55IC0gY2FyZXRQYWRkaW5nKTtcblx0XHRcdFx0XHRjdHgubGluZVRvKHRoaXMueCArIHRoaXMuY2FyZXRIZWlnaHQsIHRoaXMueSAtIChjYXJldFBhZGRpbmcgKyB0aGlzLmNhcmV0SGVpZ2h0KSk7XG5cdFx0XHRcdFx0Y3R4LmxpbmVUbyh0aGlzLnggLSB0aGlzLmNhcmV0SGVpZ2h0LCB0aGlzLnkgLSAoY2FyZXRQYWRkaW5nICsgdGhpcy5jYXJldEhlaWdodCkpO1xuXHRcdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0XHRjdHguZmlsbCgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiYmVsb3dcIjpcblx0XHRcdFx0XHR0b29sdGlwWSA9IHRoaXMueSArIGNhcmV0UGFkZGluZyArIHRoaXMuY2FyZXRIZWlnaHQ7XG5cdFx0XHRcdFx0Ly9EcmF3IGEgY2FyZXQgYmVsb3cgdGhlIHgveVxuXHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHRjdHgubW92ZVRvKHRoaXMueCwgdGhpcy55ICsgY2FyZXRQYWRkaW5nKTtcblx0XHRcdFx0XHRjdHgubGluZVRvKHRoaXMueCArIHRoaXMuY2FyZXRIZWlnaHQsIHRoaXMueSArIGNhcmV0UGFkZGluZyArIHRoaXMuY2FyZXRIZWlnaHQpO1xuXHRcdFx0XHRcdGN0eC5saW5lVG8odGhpcy54IC0gdGhpcy5jYXJldEhlaWdodCwgdGhpcy55ICsgY2FyZXRQYWRkaW5nICsgdGhpcy5jYXJldEhlaWdodCk7XG5cdFx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdFx0XHRcdGN0eC5maWxsKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzd2l0Y2godGhpcy54QWxpZ24pXG5cdFx0XHRcdHtcblx0XHRcdFx0Y2FzZSBcImxlZnRcIjpcblx0XHRcdFx0XHR0b29sdGlwWCA9IHRoaXMueCAtIHRvb2x0aXBXaWR0aCArICh0aGlzLmNvcm5lclJhZGl1cyArIHRoaXMuY2FyZXRIZWlnaHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwicmlnaHRcIjpcblx0XHRcdFx0XHR0b29sdGlwWCA9IHRoaXMueCAtICh0aGlzLmNvcm5lclJhZGl1cyArIHRoaXMuY2FyZXRIZWlnaHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZHJhd1JvdW5kZWRSZWN0YW5nbGUoY3R4LHRvb2x0aXBYLHRvb2x0aXBZLHRvb2x0aXBXaWR0aCx0b29sdGlwUmVjdEhlaWdodCx0aGlzLmNvcm5lclJhZGl1cyk7XG5cblx0XHRcdFx0Y3R4LmZpbGwoKTtcblxuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy50ZXh0Q29sb3I7XG5cdFx0XHRcdGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuXHRcdFx0XHRjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcblx0XHRcdFx0Y3R4LmZpbGxUZXh0KHRoaXMudGV4dCwgdG9vbHRpcFggKyB0b29sdGlwV2lkdGgvMiwgdG9vbHRpcFkgKyB0b29sdGlwUmVjdEhlaWdodC8yKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdENoYXJ0Lk11bHRpVG9vbHRpcCA9IENoYXJ0LkVsZW1lbnQuZXh0ZW5kKHtcblx0XHRpbml0aWFsaXplIDogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuZm9udCA9IGZvbnRTdHJpbmcodGhpcy5mb250U2l6ZSx0aGlzLmZvbnRTdHlsZSx0aGlzLmZvbnRGYW1pbHkpO1xuXG5cdFx0XHR0aGlzLnRpdGxlRm9udCA9IGZvbnRTdHJpbmcodGhpcy50aXRsZUZvbnRTaXplLHRoaXMudGl0bGVGb250U3R5bGUsdGhpcy50aXRsZUZvbnRGYW1pbHkpO1xuXG5cdFx0XHR0aGlzLmhlaWdodCA9ICh0aGlzLmxhYmVscy5sZW5ndGggKiB0aGlzLmZvbnRTaXplKSArICgodGhpcy5sYWJlbHMubGVuZ3RoLTEpICogKHRoaXMuZm9udFNpemUvMikpICsgKHRoaXMueVBhZGRpbmcqMikgKyB0aGlzLnRpdGxlRm9udFNpemUgKjEuNTtcblxuXHRcdFx0dGhpcy5jdHguZm9udCA9IHRoaXMudGl0bGVGb250O1xuXG5cdFx0XHR2YXIgdGl0bGVXaWR0aCA9IHRoaXMuY3R4Lm1lYXN1cmVUZXh0KHRoaXMudGl0bGUpLndpZHRoLFxuXHRcdFx0XHQvL0xhYmVsIGhhcyBhIGxlZ2VuZCBzcXVhcmUgYXMgd2VsbCBzbyBhY2NvdW50IGZvciB0aGlzLlxuXHRcdFx0XHRsYWJlbFdpZHRoID0gbG9uZ2VzdFRleHQodGhpcy5jdHgsdGhpcy5mb250LHRoaXMubGFiZWxzKSArIHRoaXMuZm9udFNpemUgKyAzLFxuXHRcdFx0XHRsb25nZXN0VGV4dFdpZHRoID0gbWF4KFtsYWJlbFdpZHRoLHRpdGxlV2lkdGhdKTtcblxuXHRcdFx0dGhpcy53aWR0aCA9IGxvbmdlc3RUZXh0V2lkdGggKyAodGhpcy54UGFkZGluZyoyKTtcblxuXG5cdFx0XHR2YXIgaGFsZkhlaWdodCA9IHRoaXMuaGVpZ2h0LzI7XG5cblx0XHRcdC8vQ2hlY2sgdG8gZW5zdXJlIHRoZSBoZWlnaHQgd2lsbCBmaXQgb24gdGhlIGNhbnZhc1xuXHRcdFx0aWYgKHRoaXMueSAtIGhhbGZIZWlnaHQgPCAwICl7XG5cdFx0XHRcdHRoaXMueSA9IGhhbGZIZWlnaHQ7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMueSArIGhhbGZIZWlnaHQgPiB0aGlzLmNoYXJ0LmhlaWdodCl7XG5cdFx0XHRcdHRoaXMueSA9IHRoaXMuY2hhcnQuaGVpZ2h0IC0gaGFsZkhlaWdodDtcblx0XHRcdH1cblxuXHRcdFx0Ly9EZWNpZGUgd2hldGhlciB0byBhbGlnbiBsZWZ0IG9yIHJpZ2h0IGJhc2VkIG9uIHBvc2l0aW9uIG9uIGNhbnZhc1xuXHRcdFx0aWYgKHRoaXMueCA+IHRoaXMuY2hhcnQud2lkdGgvMil7XG5cdFx0XHRcdHRoaXMueCAtPSB0aGlzLnhPZmZzZXQgKyB0aGlzLndpZHRoO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy54ICs9IHRoaXMueE9mZnNldDtcblx0XHRcdH1cblxuXG5cdFx0fSxcblx0XHRnZXRMaW5lSGVpZ2h0IDogZnVuY3Rpb24oaW5kZXgpe1xuXHRcdFx0dmFyIGJhc2VMaW5lSGVpZ2h0ID0gdGhpcy55IC0gKHRoaXMuaGVpZ2h0LzIpICsgdGhpcy55UGFkZGluZyxcblx0XHRcdFx0YWZ0ZXJUaXRsZUluZGV4ID0gaW5kZXgtMTtcblxuXHRcdFx0Ly9JZiB0aGUgaW5kZXggaXMgemVybywgd2UncmUgZ2V0dGluZyB0aGUgdGl0bGVcblx0XHRcdGlmIChpbmRleCA9PT0gMCl7XG5cdFx0XHRcdHJldHVybiBiYXNlTGluZUhlaWdodCArIHRoaXMudGl0bGVGb250U2l6ZS8yO1xuXHRcdFx0fSBlbHNle1xuXHRcdFx0XHRyZXR1cm4gYmFzZUxpbmVIZWlnaHQgKyAoKHRoaXMuZm9udFNpemUqMS41KmFmdGVyVGl0bGVJbmRleCkgKyB0aGlzLmZvbnRTaXplLzIpICsgdGhpcy50aXRsZUZvbnRTaXplICogMS41O1xuXHRcdFx0fVxuXG5cdFx0fSxcblx0XHRkcmF3IDogZnVuY3Rpb24oKXtcblx0XHRcdC8vIEN1c3RvbSBUb29sdGlwc1xuXHRcdFx0aWYodGhpcy5jdXN0b20pe1xuXHRcdFx0XHR0aGlzLmN1c3RvbSh0aGlzKTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdGRyYXdSb3VuZGVkUmVjdGFuZ2xlKHRoaXMuY3R4LHRoaXMueCx0aGlzLnkgLSB0aGlzLmhlaWdodC8yLHRoaXMud2lkdGgsdGhpcy5oZWlnaHQsdGhpcy5jb3JuZXJSYWRpdXMpO1xuXHRcdFx0XHR2YXIgY3R4ID0gdGhpcy5jdHg7XG5cdFx0XHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLmZpbGxDb2xvcjtcblx0XHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXG5cdFx0XHRcdGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIjtcblx0XHRcdFx0Y3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XG5cdFx0XHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLnRpdGxlVGV4dENvbG9yO1xuXHRcdFx0XHRjdHguZm9udCA9IHRoaXMudGl0bGVGb250O1xuXG5cdFx0XHRcdGN0eC5maWxsVGV4dCh0aGlzLnRpdGxlLHRoaXMueCArIHRoaXMueFBhZGRpbmcsIHRoaXMuZ2V0TGluZUhlaWdodCgwKSk7XG5cblx0XHRcdFx0Y3R4LmZvbnQgPSB0aGlzLmZvbnQ7XG5cdFx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmxhYmVscyxmdW5jdGlvbihsYWJlbCxpbmRleCl7XG5cdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMudGV4dENvbG9yO1xuXHRcdFx0XHRcdGN0eC5maWxsVGV4dChsYWJlbCx0aGlzLnggKyB0aGlzLnhQYWRkaW5nICsgdGhpcy5mb250U2l6ZSArIDMsIHRoaXMuZ2V0TGluZUhlaWdodChpbmRleCArIDEpKTtcblxuXHRcdFx0XHRcdC8vQSBiaXQgZ25hcmx5LCBidXQgY2xlYXJpbmcgdGhpcyByZWN0YW5nbGUgYnJlYWtzIHdoZW4gdXNpbmcgZXhwbG9yZXJjYW52YXMgKGNsZWFycyB3aG9sZSBjYW52YXMpXG5cdFx0XHRcdFx0Ly9jdHguY2xlYXJSZWN0KHRoaXMueCArIHRoaXMueFBhZGRpbmcsIHRoaXMuZ2V0TGluZUhlaWdodChpbmRleCArIDEpIC0gdGhpcy5mb250U2l6ZS8yLCB0aGlzLmZvbnRTaXplLCB0aGlzLmZvbnRTaXplKTtcblx0XHRcdFx0XHQvL0luc3RlYWQgd2UnbGwgbWFrZSBhIHdoaXRlIGZpbGxlZCBibG9jayB0byBwdXQgdGhlIGxlZ2VuZENvbG91ciBwYWxldHRlIG92ZXIuXG5cblx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy5sZWdlbmRDb2xvckJhY2tncm91bmQ7XG5cdFx0XHRcdFx0Y3R4LmZpbGxSZWN0KHRoaXMueCArIHRoaXMueFBhZGRpbmcsIHRoaXMuZ2V0TGluZUhlaWdodChpbmRleCArIDEpIC0gdGhpcy5mb250U2l6ZS8yLCB0aGlzLmZvbnRTaXplLCB0aGlzLmZvbnRTaXplKTtcblxuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLmxlZ2VuZENvbG9yc1tpbmRleF0uZmlsbDtcblx0XHRcdFx0XHRjdHguZmlsbFJlY3QodGhpcy54ICsgdGhpcy54UGFkZGluZywgdGhpcy5nZXRMaW5lSGVpZ2h0KGluZGV4ICsgMSkgLSB0aGlzLmZvbnRTaXplLzIsIHRoaXMuZm9udFNpemUsIHRoaXMuZm9udFNpemUpO1xuXG5cblx0XHRcdFx0fSx0aGlzKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdENoYXJ0LlNjYWxlID0gQ2hhcnQuRWxlbWVudC5leHRlbmQoe1xuXHRcdGluaXRpYWxpemUgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5maXQoKTtcblx0XHR9LFxuXHRcdGJ1aWxkWUxhYmVscyA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLnlMYWJlbHMgPSBbXTtcblxuXHRcdFx0dmFyIHN0ZXBEZWNpbWFsUGxhY2VzID0gZ2V0RGVjaW1hbFBsYWNlcyh0aGlzLnN0ZXBWYWx1ZSk7XG5cblx0XHRcdGZvciAodmFyIGk9MDsgaTw9dGhpcy5zdGVwczsgaSsrKXtcblx0XHRcdFx0dGhpcy55TGFiZWxzLnB1c2godGVtcGxhdGUodGhpcy50ZW1wbGF0ZVN0cmluZyx7dmFsdWU6KHRoaXMubWluICsgKGkgKiB0aGlzLnN0ZXBWYWx1ZSkpLnRvRml4ZWQoc3RlcERlY2ltYWxQbGFjZXMpfSkpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy55TGFiZWxXaWR0aCA9ICh0aGlzLmRpc3BsYXkgJiYgdGhpcy5zaG93TGFiZWxzKSA/IGxvbmdlc3RUZXh0KHRoaXMuY3R4LHRoaXMuZm9udCx0aGlzLnlMYWJlbHMpIDogMDtcblx0XHR9LFxuXHRcdGFkZFhMYWJlbCA6IGZ1bmN0aW9uKGxhYmVsKXtcblx0XHRcdHRoaXMueExhYmVscy5wdXNoKGxhYmVsKTtcblx0XHRcdHRoaXMudmFsdWVzQ291bnQrKztcblx0XHRcdHRoaXMuZml0KCk7XG5cdFx0fSxcblx0XHRyZW1vdmVYTGFiZWwgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy54TGFiZWxzLnNoaWZ0KCk7XG5cdFx0XHR0aGlzLnZhbHVlc0NvdW50LS07XG5cdFx0XHR0aGlzLmZpdCgpO1xuXHRcdH0sXG5cdFx0Ly8gRml0dGluZyBsb29wIHRvIHJvdGF0ZSB4IExhYmVscyBhbmQgZmlndXJlIG91dCB3aGF0IGZpdHMgdGhlcmUsIGFuZCBhbHNvIGNhbGN1bGF0ZSBob3cgbWFueSBZIHN0ZXBzIHRvIHVzZVxuXHRcdGZpdDogZnVuY3Rpb24oKXtcblx0XHRcdC8vIEZpcnN0IHdlIG5lZWQgdGhlIHdpZHRoIG9mIHRoZSB5TGFiZWxzLCBhc3N1bWluZyB0aGUgeExhYmVscyBhcmVuJ3Qgcm90YXRlZFxuXG5cdFx0XHQvLyBUbyBkbyB0aGF0IHdlIG5lZWQgdGhlIGJhc2UgbGluZSBhdCB0aGUgdG9wIGFuZCBiYXNlIG9mIHRoZSBjaGFydCwgYXNzdW1pbmcgdGhlcmUgaXMgbm8geCBsYWJlbCByb3RhdGlvblxuXHRcdFx0dGhpcy5zdGFydFBvaW50ID0gKHRoaXMuZGlzcGxheSkgPyB0aGlzLmZvbnRTaXplIDogMDtcblx0XHRcdHRoaXMuZW5kUG9pbnQgPSAodGhpcy5kaXNwbGF5KSA/IHRoaXMuaGVpZ2h0IC0gKHRoaXMuZm9udFNpemUgKiAxLjUpIC0gNSA6IHRoaXMuaGVpZ2h0OyAvLyAtNSB0byBwYWQgbGFiZWxzXG5cblx0XHRcdC8vIEFwcGx5IHBhZGRpbmcgc2V0dGluZ3MgdG8gdGhlIHN0YXJ0IGFuZCBlbmQgcG9pbnQuXG5cdFx0XHR0aGlzLnN0YXJ0UG9pbnQgKz0gdGhpcy5wYWRkaW5nO1xuXHRcdFx0dGhpcy5lbmRQb2ludCAtPSB0aGlzLnBhZGRpbmc7XG5cblx0XHRcdC8vIENhY2hlIHRoZSBzdGFydGluZyBoZWlnaHQsIHNvIGNhbiBkZXRlcm1pbmUgaWYgd2UgbmVlZCB0byByZWNhbGN1bGF0ZSB0aGUgc2NhbGUgeUF4aXNcblx0XHRcdHZhciBjYWNoZWRIZWlnaHQgPSB0aGlzLmVuZFBvaW50IC0gdGhpcy5zdGFydFBvaW50LFxuXHRcdFx0XHRjYWNoZWRZTGFiZWxXaWR0aDtcblxuXHRcdFx0Ly8gQnVpbGQgdGhlIGN1cnJlbnQgeUxhYmVscyBzbyB3ZSBoYXZlIGFuIGlkZWEgb2Ygd2hhdCBzaXplIHRoZXknbGwgYmUgdG8gc3RhcnRcblx0XHRcdC8qXG5cdFx0XHQgKlx0VGhpcyBzZXRzIHdoYXQgaXMgcmV0dXJuZWQgZnJvbSBjYWxjdWxhdGVTY2FsZVJhbmdlIGFzIHN0YXRpYyBwcm9wZXJ0aWVzIG9mIHRoaXMgY2xhc3M6XG5cdFx0XHQgKlxuXHRcdFx0XHR0aGlzLnN0ZXBzO1xuXHRcdFx0XHR0aGlzLnN0ZXBWYWx1ZTtcblx0XHRcdFx0dGhpcy5taW47XG5cdFx0XHRcdHRoaXMubWF4O1xuXHRcdFx0ICpcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy5jYWxjdWxhdGVZUmFuZ2UoY2FjaGVkSGVpZ2h0KTtcblxuXHRcdFx0Ly8gV2l0aCB0aGVzZSBwcm9wZXJ0aWVzIHNldCB3ZSBjYW4gbm93IGJ1aWxkIHRoZSBhcnJheSBvZiB5TGFiZWxzXG5cdFx0XHQvLyBhbmQgYWxzbyB0aGUgd2lkdGggb2YgdGhlIGxhcmdlc3QgeUxhYmVsXG5cdFx0XHR0aGlzLmJ1aWxkWUxhYmVscygpO1xuXG5cdFx0XHR0aGlzLmNhbGN1bGF0ZVhMYWJlbFJvdGF0aW9uKCk7XG5cblx0XHRcdHdoaWxlKChjYWNoZWRIZWlnaHQgPiB0aGlzLmVuZFBvaW50IC0gdGhpcy5zdGFydFBvaW50KSl7XG5cdFx0XHRcdGNhY2hlZEhlaWdodCA9IHRoaXMuZW5kUG9pbnQgLSB0aGlzLnN0YXJ0UG9pbnQ7XG5cdFx0XHRcdGNhY2hlZFlMYWJlbFdpZHRoID0gdGhpcy55TGFiZWxXaWR0aDtcblxuXHRcdFx0XHR0aGlzLmNhbGN1bGF0ZVlSYW5nZShjYWNoZWRIZWlnaHQpO1xuXHRcdFx0XHR0aGlzLmJ1aWxkWUxhYmVscygpO1xuXG5cdFx0XHRcdC8vIE9ubHkgZ28gdGhyb3VnaCB0aGUgeExhYmVsIGxvb3AgYWdhaW4gaWYgdGhlIHlMYWJlbCB3aWR0aCBoYXMgY2hhbmdlZFxuXHRcdFx0XHRpZiAoY2FjaGVkWUxhYmVsV2lkdGggPCB0aGlzLnlMYWJlbFdpZHRoKXtcblx0XHRcdFx0XHR0aGlzLmNhbGN1bGF0ZVhMYWJlbFJvdGF0aW9uKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH0sXG5cdFx0Y2FsY3VsYXRlWExhYmVsUm90YXRpb24gOiBmdW5jdGlvbigpe1xuXHRcdFx0Ly9HZXQgdGhlIHdpZHRoIG9mIGVhY2ggZ3JpZCBieSBjYWxjdWxhdGluZyB0aGUgZGlmZmVyZW5jZVxuXHRcdFx0Ly9iZXR3ZWVuIHggb2Zmc2V0cyBiZXR3ZWVuIDAgYW5kIDEuXG5cblx0XHRcdHRoaXMuY3R4LmZvbnQgPSB0aGlzLmZvbnQ7XG5cblx0XHRcdHZhciBmaXJzdFdpZHRoID0gdGhpcy5jdHgubWVhc3VyZVRleHQodGhpcy54TGFiZWxzWzBdKS53aWR0aCxcblx0XHRcdFx0bGFzdFdpZHRoID0gdGhpcy5jdHgubWVhc3VyZVRleHQodGhpcy54TGFiZWxzW3RoaXMueExhYmVscy5sZW5ndGggLSAxXSkud2lkdGgsXG5cdFx0XHRcdGZpcnN0Um90YXRlZCxcblx0XHRcdFx0bGFzdFJvdGF0ZWQ7XG5cblxuXHRcdFx0dGhpcy54U2NhbGVQYWRkaW5nUmlnaHQgPSBsYXN0V2lkdGgvMiArIDM7XG5cdFx0XHR0aGlzLnhTY2FsZVBhZGRpbmdMZWZ0ID0gKGZpcnN0V2lkdGgvMiA+IHRoaXMueUxhYmVsV2lkdGggKyAxMCkgPyBmaXJzdFdpZHRoLzIgOiB0aGlzLnlMYWJlbFdpZHRoICsgMTA7XG5cblx0XHRcdHRoaXMueExhYmVsUm90YXRpb24gPSAwO1xuXHRcdFx0aWYgKHRoaXMuZGlzcGxheSl7XG5cdFx0XHRcdHZhciBvcmlnaW5hbExhYmVsV2lkdGggPSBsb25nZXN0VGV4dCh0aGlzLmN0eCx0aGlzLmZvbnQsdGhpcy54TGFiZWxzKSxcblx0XHRcdFx0XHRjb3NSb3RhdGlvbixcblx0XHRcdFx0XHRmaXJzdFJvdGF0ZWRXaWR0aDtcblx0XHRcdFx0dGhpcy54TGFiZWxXaWR0aCA9IG9yaWdpbmFsTGFiZWxXaWR0aDtcblx0XHRcdFx0Ly9BbGxvdyAzIHBpeGVscyB4MiBwYWRkaW5nIGVpdGhlciBzaWRlIGZvciBsYWJlbCByZWFkYWJpbGl0eVxuXHRcdFx0XHR2YXIgeEdyaWRXaWR0aCA9IE1hdGguZmxvb3IodGhpcy5jYWxjdWxhdGVYKDEpIC0gdGhpcy5jYWxjdWxhdGVYKDApKSAtIDY7XG5cblx0XHRcdFx0Ly9NYXggbGFiZWwgcm90YXRlIHNob3VsZCBiZSA5MCAtIGFsc28gYWN0IGFzIGEgbG9vcCBjb3VudGVyXG5cdFx0XHRcdHdoaWxlICgodGhpcy54TGFiZWxXaWR0aCA+IHhHcmlkV2lkdGggJiYgdGhpcy54TGFiZWxSb3RhdGlvbiA9PT0gMCkgfHwgKHRoaXMueExhYmVsV2lkdGggPiB4R3JpZFdpZHRoICYmIHRoaXMueExhYmVsUm90YXRpb24gPD0gOTAgJiYgdGhpcy54TGFiZWxSb3RhdGlvbiA+IDApKXtcblx0XHRcdFx0XHRjb3NSb3RhdGlvbiA9IE1hdGguY29zKHRvUmFkaWFucyh0aGlzLnhMYWJlbFJvdGF0aW9uKSk7XG5cblx0XHRcdFx0XHRmaXJzdFJvdGF0ZWQgPSBjb3NSb3RhdGlvbiAqIGZpcnN0V2lkdGg7XG5cdFx0XHRcdFx0bGFzdFJvdGF0ZWQgPSBjb3NSb3RhdGlvbiAqIGxhc3RXaWR0aDtcblxuXHRcdFx0XHRcdC8vIFdlJ3JlIHJpZ2h0IGFsaWduaW5nIHRoZSB0ZXh0IG5vdy5cblx0XHRcdFx0XHRpZiAoZmlyc3RSb3RhdGVkICsgdGhpcy5mb250U2l6ZSAvIDIgPiB0aGlzLnlMYWJlbFdpZHRoICsgOCl7XG5cdFx0XHRcdFx0XHR0aGlzLnhTY2FsZVBhZGRpbmdMZWZ0ID0gZmlyc3RSb3RhdGVkICsgdGhpcy5mb250U2l6ZSAvIDI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMueFNjYWxlUGFkZGluZ1JpZ2h0ID0gdGhpcy5mb250U2l6ZS8yO1xuXG5cblx0XHRcdFx0XHR0aGlzLnhMYWJlbFJvdGF0aW9uKys7XG5cdFx0XHRcdFx0dGhpcy54TGFiZWxXaWR0aCA9IGNvc1JvdGF0aW9uICogb3JpZ2luYWxMYWJlbFdpZHRoO1xuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRoaXMueExhYmVsUm90YXRpb24gPiAwKXtcblx0XHRcdFx0XHR0aGlzLmVuZFBvaW50IC09IE1hdGguc2luKHRvUmFkaWFucyh0aGlzLnhMYWJlbFJvdGF0aW9uKSkqb3JpZ2luYWxMYWJlbFdpZHRoICsgMztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0dGhpcy54TGFiZWxXaWR0aCA9IDA7XG5cdFx0XHRcdHRoaXMueFNjYWxlUGFkZGluZ1JpZ2h0ID0gdGhpcy5wYWRkaW5nO1xuXHRcdFx0XHR0aGlzLnhTY2FsZVBhZGRpbmdMZWZ0ID0gdGhpcy5wYWRkaW5nO1xuXHRcdFx0fVxuXG5cdFx0fSxcblx0XHQvLyBOZWVkcyB0byBiZSBvdmVyaWRkZW4gaW4gZWFjaCBDaGFydCB0eXBlXG5cdFx0Ly8gT3RoZXJ3aXNlIHdlIG5lZWQgdG8gcGFzcyBhbGwgdGhlIGRhdGEgaW50byB0aGUgc2NhbGUgY2xhc3Ncblx0XHRjYWxjdWxhdGVZUmFuZ2U6IG5vb3AsXG5cdFx0ZHJhd2luZ0FyZWE6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGhpcy5zdGFydFBvaW50IC0gdGhpcy5lbmRQb2ludDtcblx0XHR9LFxuXHRcdGNhbGN1bGF0ZVkgOiBmdW5jdGlvbih2YWx1ZSl7XG5cdFx0XHR2YXIgc2NhbGluZ0ZhY3RvciA9IHRoaXMuZHJhd2luZ0FyZWEoKSAvICh0aGlzLm1pbiAtIHRoaXMubWF4KTtcblx0XHRcdHJldHVybiB0aGlzLmVuZFBvaW50IC0gKHNjYWxpbmdGYWN0b3IgKiAodmFsdWUgLSB0aGlzLm1pbikpO1xuXHRcdH0sXG5cdFx0Y2FsY3VsYXRlWCA6IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRcdHZhciBpc1JvdGF0ZWQgPSAodGhpcy54TGFiZWxSb3RhdGlvbiA+IDApLFxuXHRcdFx0XHQvLyBpbm5lcldpZHRoID0gKHRoaXMub2Zmc2V0R3JpZExpbmVzKSA/IHRoaXMud2lkdGggLSBvZmZzZXRMZWZ0IC0gdGhpcy5wYWRkaW5nIDogdGhpcy53aWR0aCAtIChvZmZzZXRMZWZ0ICsgaGFsZkxhYmVsV2lkdGggKiAyKSAtIHRoaXMucGFkZGluZyxcblx0XHRcdFx0aW5uZXJXaWR0aCA9IHRoaXMud2lkdGggLSAodGhpcy54U2NhbGVQYWRkaW5nTGVmdCArIHRoaXMueFNjYWxlUGFkZGluZ1JpZ2h0KSxcblx0XHRcdFx0dmFsdWVXaWR0aCA9IGlubmVyV2lkdGgvTWF0aC5tYXgoKHRoaXMudmFsdWVzQ291bnQgLSAoKHRoaXMub2Zmc2V0R3JpZExpbmVzKSA/IDAgOiAxKSksIDEpLFxuXHRcdFx0XHR2YWx1ZU9mZnNldCA9ICh2YWx1ZVdpZHRoICogaW5kZXgpICsgdGhpcy54U2NhbGVQYWRkaW5nTGVmdDtcblxuXHRcdFx0aWYgKHRoaXMub2Zmc2V0R3JpZExpbmVzKXtcblx0XHRcdFx0dmFsdWVPZmZzZXQgKz0gKHZhbHVlV2lkdGgvMik7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBNYXRoLnJvdW5kKHZhbHVlT2Zmc2V0KTtcblx0XHR9LFxuXHRcdHVwZGF0ZSA6IGZ1bmN0aW9uKG5ld1Byb3BzKXtcblx0XHRcdGhlbHBlcnMuZXh0ZW5kKHRoaXMsIG5ld1Byb3BzKTtcblx0XHRcdHRoaXMuZml0KCk7XG5cdFx0fSxcblx0XHRkcmF3IDogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBjdHggPSB0aGlzLmN0eCxcblx0XHRcdFx0eUxhYmVsR2FwID0gKHRoaXMuZW5kUG9pbnQgLSB0aGlzLnN0YXJ0UG9pbnQpIC8gdGhpcy5zdGVwcyxcblx0XHRcdFx0eFN0YXJ0ID0gTWF0aC5yb3VuZCh0aGlzLnhTY2FsZVBhZGRpbmdMZWZ0KTtcblx0XHRcdGlmICh0aGlzLmRpc3BsYXkpe1xuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy50ZXh0Q29sb3I7XG5cdFx0XHRcdGN0eC5mb250ID0gdGhpcy5mb250O1xuXHRcdFx0XHRlYWNoKHRoaXMueUxhYmVscyxmdW5jdGlvbihsYWJlbFN0cmluZyxpbmRleCl7XG5cdFx0XHRcdFx0dmFyIHlMYWJlbENlbnRlciA9IHRoaXMuZW5kUG9pbnQgLSAoeUxhYmVsR2FwICogaW5kZXgpLFxuXHRcdFx0XHRcdFx0bGluZVBvc2l0aW9uWSA9IE1hdGgucm91bmQoeUxhYmVsQ2VudGVyKSxcblx0XHRcdFx0XHRcdGRyYXdIb3Jpem9udGFsTGluZSA9IHRoaXMuc2hvd0hvcml6b250YWxMaW5lcztcblxuXHRcdFx0XHRcdGN0eC50ZXh0QWxpZ24gPSBcInJpZ2h0XCI7XG5cdFx0XHRcdFx0Y3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0aWYgKHRoaXMuc2hvd0xhYmVscyl7XG5cdFx0XHRcdFx0XHRjdHguZmlsbFRleHQobGFiZWxTdHJpbmcseFN0YXJ0IC0gMTAseUxhYmVsQ2VudGVyKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBUaGlzIGlzIFggYXhpcywgc28gZHJhdyBpdFxuXHRcdFx0XHRcdGlmIChpbmRleCA9PT0gMCAmJiAhZHJhd0hvcml6b250YWxMaW5lKXtcblx0XHRcdFx0XHRcdGRyYXdIb3Jpem9udGFsTGluZSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGRyYXdIb3Jpem9udGFsTGluZSl7XG5cdFx0XHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGluZGV4ID4gMCl7XG5cdFx0XHRcdFx0XHQvLyBUaGlzIGlzIGEgZ3JpZCBsaW5lIGluIHRoZSBjZW50cmUsIHNvIGRyb3AgdGhhdFxuXHRcdFx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IHRoaXMuZ3JpZExpbmVXaWR0aDtcblx0XHRcdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ3JpZExpbmVDb2xvcjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gVGhpcyBpcyB0aGUgZmlyc3QgbGluZSBvbiB0aGUgc2NhbGVcblx0XHRcdFx0XHRcdGN0eC5saW5lV2lkdGggPSB0aGlzLmxpbmVXaWR0aDtcblx0XHRcdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9IHRoaXMubGluZUNvbG9yO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGxpbmVQb3NpdGlvblkgKz0gaGVscGVycy5hbGlhc1BpeGVsKGN0eC5saW5lV2lkdGgpO1xuXG5cdFx0XHRcdFx0aWYoZHJhd0hvcml6b250YWxMaW5lKXtcblx0XHRcdFx0XHRcdGN0eC5tb3ZlVG8oeFN0YXJ0LCBsaW5lUG9zaXRpb25ZKTtcblx0XHRcdFx0XHRcdGN0eC5saW5lVG8odGhpcy53aWR0aCwgbGluZVBvc2l0aW9uWSk7XG5cdFx0XHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IHRoaXMubGluZVdpZHRoO1xuXHRcdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9IHRoaXMubGluZUNvbG9yO1xuXHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHRjdHgubW92ZVRvKHhTdGFydCAtIDUsIGxpbmVQb3NpdGlvblkpO1xuXHRcdFx0XHRcdGN0eC5saW5lVG8oeFN0YXJ0LCBsaW5lUG9zaXRpb25ZKTtcblx0XHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXG5cdFx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdFx0ZWFjaCh0aGlzLnhMYWJlbHMsZnVuY3Rpb24obGFiZWwsaW5kZXgpe1xuXHRcdFx0XHRcdHZhciB4UG9zID0gdGhpcy5jYWxjdWxhdGVYKGluZGV4KSArIGFsaWFzUGl4ZWwodGhpcy5saW5lV2lkdGgpLFxuXHRcdFx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIGxpbmUvYmFyIGhlcmUgYW5kIGRlY2lkZSB3aGVyZSB0byBwbGFjZSB0aGUgbGluZVxuXHRcdFx0XHRcdFx0bGluZVBvcyA9IHRoaXMuY2FsY3VsYXRlWChpbmRleCAtICh0aGlzLm9mZnNldEdyaWRMaW5lcyA/IDAuNSA6IDApKSArIGFsaWFzUGl4ZWwodGhpcy5saW5lV2lkdGgpLFxuXHRcdFx0XHRcdFx0aXNSb3RhdGVkID0gKHRoaXMueExhYmVsUm90YXRpb24gPiAwKSxcblx0XHRcdFx0XHRcdGRyYXdWZXJ0aWNhbExpbmUgPSB0aGlzLnNob3dWZXJ0aWNhbExpbmVzO1xuXG5cdFx0XHRcdFx0Ly8gVGhpcyBpcyBZIGF4aXMsIHNvIGRyYXcgaXRcblx0XHRcdFx0XHRpZiAoaW5kZXggPT09IDAgJiYgIWRyYXdWZXJ0aWNhbExpbmUpe1xuXHRcdFx0XHRcdFx0ZHJhd1ZlcnRpY2FsTGluZSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGRyYXdWZXJ0aWNhbExpbmUpe1xuXHRcdFx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChpbmRleCA+IDApe1xuXHRcdFx0XHRcdFx0Ly8gVGhpcyBpcyBhIGdyaWQgbGluZSBpbiB0aGUgY2VudHJlLCBzbyBkcm9wIHRoYXRcblx0XHRcdFx0XHRcdGN0eC5saW5lV2lkdGggPSB0aGlzLmdyaWRMaW5lV2lkdGg7XG5cdFx0XHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdyaWRMaW5lQ29sb3I7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIFRoaXMgaXMgdGhlIGZpcnN0IGxpbmUgb24gdGhlIHNjYWxlXG5cdFx0XHRcdFx0XHRjdHgubGluZVdpZHRoID0gdGhpcy5saW5lV2lkdGg7XG5cdFx0XHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmxpbmVDb2xvcjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoZHJhd1ZlcnRpY2FsTGluZSl7XG5cdFx0XHRcdFx0XHRjdHgubW92ZVRvKGxpbmVQb3MsdGhpcy5lbmRQb2ludCk7XG5cdFx0XHRcdFx0XHRjdHgubGluZVRvKGxpbmVQb3MsdGhpcy5zdGFydFBvaW50IC0gMyk7XG5cdFx0XHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdFx0fVxuXG5cblx0XHRcdFx0XHRjdHgubGluZVdpZHRoID0gdGhpcy5saW5lV2lkdGg7XG5cdFx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gdGhpcy5saW5lQ29sb3I7XG5cblxuXHRcdFx0XHRcdC8vIFNtYWxsIGxpbmVzIGF0IHRoZSBib3R0b20gb2YgdGhlIGJhc2UgZ3JpZCBsaW5lXG5cdFx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRcdGN0eC5tb3ZlVG8obGluZVBvcyx0aGlzLmVuZFBvaW50KTtcblx0XHRcdFx0XHRjdHgubGluZVRvKGxpbmVQb3MsdGhpcy5lbmRQb2ludCArIDUpO1xuXHRcdFx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cblx0XHRcdFx0XHRjdHguc2F2ZSgpO1xuXHRcdFx0XHRcdGN0eC50cmFuc2xhdGUoeFBvcywoaXNSb3RhdGVkKSA/IHRoaXMuZW5kUG9pbnQgKyAxMiA6IHRoaXMuZW5kUG9pbnQgKyA4KTtcblx0XHRcdFx0XHRjdHgucm90YXRlKHRvUmFkaWFucyh0aGlzLnhMYWJlbFJvdGF0aW9uKSotMSk7XG5cdFx0XHRcdFx0Y3R4LmZvbnQgPSB0aGlzLmZvbnQ7XG5cdFx0XHRcdFx0Y3R4LnRleHRBbGlnbiA9IChpc1JvdGF0ZWQpID8gXCJyaWdodFwiIDogXCJjZW50ZXJcIjtcblx0XHRcdFx0XHRjdHgudGV4dEJhc2VsaW5lID0gKGlzUm90YXRlZCkgPyBcIm1pZGRsZVwiIDogXCJ0b3BcIjtcblx0XHRcdFx0XHRjdHguZmlsbFRleHQobGFiZWwsIDAsIDApO1xuXHRcdFx0XHRcdGN0eC5yZXN0b3JlKCk7XG5cdFx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdH1cblx0XHR9XG5cblx0fSk7XG5cblx0Q2hhcnQuUmFkaWFsU2NhbGUgPSBDaGFydC5FbGVtZW50LmV4dGVuZCh7XG5cdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuc2l6ZSA9IG1pbihbdGhpcy5oZWlnaHQsIHRoaXMud2lkdGhdKTtcblx0XHRcdHRoaXMuZHJhd2luZ0FyZWEgPSAodGhpcy5kaXNwbGF5KSA/ICh0aGlzLnNpemUvMikgLSAodGhpcy5mb250U2l6ZS8yICsgdGhpcy5iYWNrZHJvcFBhZGRpbmdZKSA6ICh0aGlzLnNpemUvMik7XG5cdFx0fSxcblx0XHRjYWxjdWxhdGVDZW50ZXJPZmZzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcblx0XHRcdC8vIFRha2UgaW50byBhY2NvdW50IGhhbGYgZm9udCBzaXplICsgdGhlIHlQYWRkaW5nIG9mIHRoZSB0b3AgdmFsdWVcblx0XHRcdHZhciBzY2FsaW5nRmFjdG9yID0gdGhpcy5kcmF3aW5nQXJlYSAvICh0aGlzLm1heCAtIHRoaXMubWluKTtcblxuXHRcdFx0cmV0dXJuICh2YWx1ZSAtIHRoaXMubWluKSAqIHNjYWxpbmdGYWN0b3I7XG5cdFx0fSxcblx0XHR1cGRhdGUgOiBmdW5jdGlvbigpe1xuXHRcdFx0aWYgKCF0aGlzLmxpbmVBcmMpe1xuXHRcdFx0XHR0aGlzLnNldFNjYWxlU2l6ZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5kcmF3aW5nQXJlYSA9ICh0aGlzLmRpc3BsYXkpID8gKHRoaXMuc2l6ZS8yKSAtICh0aGlzLmZvbnRTaXplLzIgKyB0aGlzLmJhY2tkcm9wUGFkZGluZ1kpIDogKHRoaXMuc2l6ZS8yKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuYnVpbGRZTGFiZWxzKCk7XG5cdFx0fSxcblx0XHRidWlsZFlMYWJlbHM6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLnlMYWJlbHMgPSBbXTtcblxuXHRcdFx0dmFyIHN0ZXBEZWNpbWFsUGxhY2VzID0gZ2V0RGVjaW1hbFBsYWNlcyh0aGlzLnN0ZXBWYWx1ZSk7XG5cblx0XHRcdGZvciAodmFyIGk9MDsgaTw9dGhpcy5zdGVwczsgaSsrKXtcblx0XHRcdFx0dGhpcy55TGFiZWxzLnB1c2godGVtcGxhdGUodGhpcy50ZW1wbGF0ZVN0cmluZyx7dmFsdWU6KHRoaXMubWluICsgKGkgKiB0aGlzLnN0ZXBWYWx1ZSkpLnRvRml4ZWQoc3RlcERlY2ltYWxQbGFjZXMpfSkpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Z2V0Q2lyY3VtZmVyZW5jZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gKChNYXRoLlBJKjIpIC8gdGhpcy52YWx1ZXNDb3VudCk7XG5cdFx0fSxcblx0XHRzZXRTY2FsZVNpemU6IGZ1bmN0aW9uKCl7XG5cdFx0XHQvKlxuXHRcdFx0ICogUmlnaHQsIHRoaXMgaXMgcmVhbGx5IGNvbmZ1c2luZyBhbmQgdGhlcmUgaXMgYSBsb3Qgb2YgbWF0aHMgZ29pbmcgb24gaGVyZVxuXHRcdFx0ICogVGhlIGdpc3Qgb2YgdGhlIHByb2JsZW0gaXMgaGVyZTogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vbm5uaWNrLzY5NmNjOWM1NWY0YjBiZWI4ZmU5XG5cdFx0XHQgKlxuXHRcdFx0ICogUmVhY3Rpb246IGh0dHBzOi8vZGwuZHJvcGJveHVzZXJjb250ZW50LmNvbS91LzM0NjAxMzYzL3Rvb211Y2hzY2llbmNlLmdpZlxuXHRcdFx0ICpcblx0XHRcdCAqIFNvbHV0aW9uOlxuXHRcdFx0ICpcblx0XHRcdCAqIFdlIGFzc3VtZSB0aGUgcmFkaXVzIG9mIHRoZSBwb2x5Z29uIGlzIGhhbGYgdGhlIHNpemUgb2YgdGhlIGNhbnZhcyBhdCBmaXJzdFxuXHRcdFx0ICogYXQgZWFjaCBpbmRleCB3ZSBjaGVjayBpZiB0aGUgdGV4dCBvdmVybGFwcy5cblx0XHRcdCAqXG5cdFx0XHQgKiBXaGVyZSBpdCBkb2VzLCB3ZSBzdG9yZSB0aGF0IGFuZ2xlIGFuZCB0aGF0IGluZGV4LlxuXHRcdFx0ICpcblx0XHRcdCAqIEFmdGVyIGZpbmRpbmcgdGhlIGxhcmdlc3QgaW5kZXggYW5kIGFuZ2xlIHdlIGNhbGN1bGF0ZSBob3cgbXVjaCB3ZSBuZWVkIHRvIHJlbW92ZVxuXHRcdFx0ICogZnJvbSB0aGUgc2hhcGUgcmFkaXVzIHRvIG1vdmUgdGhlIHBvaW50IGlud2FyZHMgYnkgdGhhdCB4LlxuXHRcdFx0ICpcblx0XHRcdCAqIFdlIGF2ZXJhZ2UgdGhlIGxlZnQgYW5kIHJpZ2h0IGRpc3RhbmNlcyB0byBnZXQgdGhlIG1heGltdW0gc2hhcGUgcmFkaXVzIHRoYXQgY2FuIGZpdCBpbiB0aGUgYm94XG5cdFx0XHQgKiBhbG9uZyB3aXRoIGxhYmVscy5cblx0XHRcdCAqXG5cdFx0XHQgKiBPbmNlIHdlIGhhdmUgdGhhdCwgd2UgY2FuIGZpbmQgdGhlIGNlbnRyZSBwb2ludCBmb3IgdGhlIGNoYXJ0LCBieSB0YWtpbmcgdGhlIHggdGV4dCBwcm90cnVzaW9uXG5cdFx0XHQgKiBvbiBlYWNoIHNpZGUsIHJlbW92aW5nIHRoYXQgZnJvbSB0aGUgc2l6ZSwgaGFsdmluZyBpdCBhbmQgYWRkaW5nIHRoZSBsZWZ0IHggcHJvdHJ1c2lvbiB3aWR0aC5cblx0XHRcdCAqXG5cdFx0XHQgKiBUaGlzIHdpbGwgbWVhbiB3ZSBoYXZlIGEgc2hhcGUgZml0dGVkIHRvIHRoZSBjYW52YXMsIGFzIGxhcmdlIGFzIGl0IGNhbiBiZSB3aXRoIHRoZSBsYWJlbHNcblx0XHRcdCAqIGFuZCBwb3NpdGlvbiBpdCBpbiB0aGUgbW9zdCBzcGFjZSBlZmZpY2llbnQgbWFubmVyXG5cdFx0XHQgKlxuXHRcdFx0ICogaHR0cHM6Ly9kbC5kcm9wYm94dXNlcmNvbnRlbnQuY29tL3UvMzQ2MDEzNjMveWVhaHNjaWVuY2UuZ2lmXG5cdFx0XHQgKi9cblxuXG5cdFx0XHQvLyBHZXQgbWF4aW11bSByYWRpdXMgb2YgdGhlIHBvbHlnb24uIEVpdGhlciBoYWxmIHRoZSBoZWlnaHQgKG1pbnVzIHRoZSB0ZXh0IHdpZHRoKSBvciBoYWxmIHRoZSB3aWR0aC5cblx0XHRcdC8vIFVzZSB0aGlzIHRvIGNhbGN1bGF0ZSB0aGUgb2Zmc2V0ICsgY2hhbmdlLiAtIE1ha2Ugc3VyZSBML1IgcHJvdHJ1c2lvbiBpcyBhdCBsZWFzdCAwIHRvIHN0b3AgaXNzdWVzIHdpdGggY2VudHJlIHBvaW50c1xuXHRcdFx0dmFyIGxhcmdlc3RQb3NzaWJsZVJhZGl1cyA9IG1pbihbKHRoaXMuaGVpZ2h0LzIgLSB0aGlzLnBvaW50TGFiZWxGb250U2l6ZSAtIDUpLCB0aGlzLndpZHRoLzJdKSxcblx0XHRcdFx0cG9pbnRQb3NpdGlvbixcblx0XHRcdFx0aSxcblx0XHRcdFx0dGV4dFdpZHRoLFxuXHRcdFx0XHRoYWxmVGV4dFdpZHRoLFxuXHRcdFx0XHRmdXJ0aGVzdFJpZ2h0ID0gdGhpcy53aWR0aCxcblx0XHRcdFx0ZnVydGhlc3RSaWdodEluZGV4LFxuXHRcdFx0XHRmdXJ0aGVzdFJpZ2h0QW5nbGUsXG5cdFx0XHRcdGZ1cnRoZXN0TGVmdCA9IDAsXG5cdFx0XHRcdGZ1cnRoZXN0TGVmdEluZGV4LFxuXHRcdFx0XHRmdXJ0aGVzdExlZnRBbmdsZSxcblx0XHRcdFx0eFByb3RydXNpb25MZWZ0LFxuXHRcdFx0XHR4UHJvdHJ1c2lvblJpZ2h0LFxuXHRcdFx0XHRyYWRpdXNSZWR1Y3Rpb25SaWdodCxcblx0XHRcdFx0cmFkaXVzUmVkdWN0aW9uTGVmdCxcblx0XHRcdFx0bWF4V2lkdGhSYWRpdXM7XG5cdFx0XHR0aGlzLmN0eC5mb250ID0gZm9udFN0cmluZyh0aGlzLnBvaW50TGFiZWxGb250U2l6ZSx0aGlzLnBvaW50TGFiZWxGb250U3R5bGUsdGhpcy5wb2ludExhYmVsRm9udEZhbWlseSk7XG5cdFx0XHRmb3IgKGk9MDtpPHRoaXMudmFsdWVzQ291bnQ7aSsrKXtcblx0XHRcdFx0Ly8gNXB4IHRvIHNwYWNlIHRoZSB0ZXh0IHNsaWdodGx5IG91dCAtIHNpbWlsYXIgdG8gd2hhdCB3ZSBkbyBpbiB0aGUgZHJhdyBmdW5jdGlvbi5cblx0XHRcdFx0cG9pbnRQb3NpdGlvbiA9IHRoaXMuZ2V0UG9pbnRQb3NpdGlvbihpLCBsYXJnZXN0UG9zc2libGVSYWRpdXMpO1xuXHRcdFx0XHR0ZXh0V2lkdGggPSB0aGlzLmN0eC5tZWFzdXJlVGV4dCh0ZW1wbGF0ZSh0aGlzLnRlbXBsYXRlU3RyaW5nLCB7IHZhbHVlOiB0aGlzLmxhYmVsc1tpXSB9KSkud2lkdGggKyA1O1xuXHRcdFx0XHRpZiAoaSA9PT0gMCB8fCBpID09PSB0aGlzLnZhbHVlc0NvdW50LzIpe1xuXHRcdFx0XHRcdC8vIElmIHdlJ3JlIGF0IGluZGV4IHplcm8sIG9yIGV4YWN0bHkgdGhlIG1pZGRsZSwgd2UncmUgYXQgZXhhY3RseSB0aGUgdG9wL2JvdHRvbVxuXHRcdFx0XHRcdC8vIG9mIHRoZSByYWRhciBjaGFydCwgc28gdGV4dCB3aWxsIGJlIGFsaWduZWQgY2VudHJhbGx5LCBzbyB3ZSdsbCBoYWxmIGl0IGFuZCBjb21wYXJlXG5cdFx0XHRcdFx0Ly8gdy9sZWZ0IGFuZCByaWdodCB0ZXh0IHNpemVzXG5cdFx0XHRcdFx0aGFsZlRleHRXaWR0aCA9IHRleHRXaWR0aC8yO1xuXHRcdFx0XHRcdGlmIChwb2ludFBvc2l0aW9uLnggKyBoYWxmVGV4dFdpZHRoID4gZnVydGhlc3RSaWdodCkge1xuXHRcdFx0XHRcdFx0ZnVydGhlc3RSaWdodCA9IHBvaW50UG9zaXRpb24ueCArIGhhbGZUZXh0V2lkdGg7XG5cdFx0XHRcdFx0XHRmdXJ0aGVzdFJpZ2h0SW5kZXggPSBpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocG9pbnRQb3NpdGlvbi54IC0gaGFsZlRleHRXaWR0aCA8IGZ1cnRoZXN0TGVmdCkge1xuXHRcdFx0XHRcdFx0ZnVydGhlc3RMZWZ0ID0gcG9pbnRQb3NpdGlvbi54IC0gaGFsZlRleHRXaWR0aDtcblx0XHRcdFx0XHRcdGZ1cnRoZXN0TGVmdEluZGV4ID0gaTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoaSA8IHRoaXMudmFsdWVzQ291bnQvMikge1xuXHRcdFx0XHRcdC8vIExlc3MgdGhhbiBoYWxmIHRoZSB2YWx1ZXMgbWVhbnMgd2UnbGwgbGVmdCBhbGlnbiB0aGUgdGV4dFxuXHRcdFx0XHRcdGlmIChwb2ludFBvc2l0aW9uLnggKyB0ZXh0V2lkdGggPiBmdXJ0aGVzdFJpZ2h0KSB7XG5cdFx0XHRcdFx0XHRmdXJ0aGVzdFJpZ2h0ID0gcG9pbnRQb3NpdGlvbi54ICsgdGV4dFdpZHRoO1xuXHRcdFx0XHRcdFx0ZnVydGhlc3RSaWdodEluZGV4ID0gaTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoaSA+IHRoaXMudmFsdWVzQ291bnQvMil7XG5cdFx0XHRcdFx0Ly8gTW9yZSB0aGFuIGhhbGYgdGhlIHZhbHVlcyBtZWFucyB3ZSdsbCByaWdodCBhbGlnbiB0aGUgdGV4dFxuXHRcdFx0XHRcdGlmIChwb2ludFBvc2l0aW9uLnggLSB0ZXh0V2lkdGggPCBmdXJ0aGVzdExlZnQpIHtcblx0XHRcdFx0XHRcdGZ1cnRoZXN0TGVmdCA9IHBvaW50UG9zaXRpb24ueCAtIHRleHRXaWR0aDtcblx0XHRcdFx0XHRcdGZ1cnRoZXN0TGVmdEluZGV4ID0gaTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0eFByb3RydXNpb25MZWZ0ID0gZnVydGhlc3RMZWZ0O1xuXG5cdFx0XHR4UHJvdHJ1c2lvblJpZ2h0ID0gTWF0aC5jZWlsKGZ1cnRoZXN0UmlnaHQgLSB0aGlzLndpZHRoKTtcblxuXHRcdFx0ZnVydGhlc3RSaWdodEFuZ2xlID0gdGhpcy5nZXRJbmRleEFuZ2xlKGZ1cnRoZXN0UmlnaHRJbmRleCk7XG5cblx0XHRcdGZ1cnRoZXN0TGVmdEFuZ2xlID0gdGhpcy5nZXRJbmRleEFuZ2xlKGZ1cnRoZXN0TGVmdEluZGV4KTtcblxuXHRcdFx0cmFkaXVzUmVkdWN0aW9uUmlnaHQgPSB4UHJvdHJ1c2lvblJpZ2h0IC8gTWF0aC5zaW4oZnVydGhlc3RSaWdodEFuZ2xlICsgTWF0aC5QSS8yKTtcblxuXHRcdFx0cmFkaXVzUmVkdWN0aW9uTGVmdCA9IHhQcm90cnVzaW9uTGVmdCAvIE1hdGguc2luKGZ1cnRoZXN0TGVmdEFuZ2xlICsgTWF0aC5QSS8yKTtcblxuXHRcdFx0Ly8gRW5zdXJlIHdlIGFjdHVhbGx5IG5lZWQgdG8gcmVkdWNlIHRoZSBzaXplIG9mIHRoZSBjaGFydFxuXHRcdFx0cmFkaXVzUmVkdWN0aW9uUmlnaHQgPSAoaXNOdW1iZXIocmFkaXVzUmVkdWN0aW9uUmlnaHQpKSA/IHJhZGl1c1JlZHVjdGlvblJpZ2h0IDogMDtcblx0XHRcdHJhZGl1c1JlZHVjdGlvbkxlZnQgPSAoaXNOdW1iZXIocmFkaXVzUmVkdWN0aW9uTGVmdCkpID8gcmFkaXVzUmVkdWN0aW9uTGVmdCA6IDA7XG5cblx0XHRcdHRoaXMuZHJhd2luZ0FyZWEgPSBsYXJnZXN0UG9zc2libGVSYWRpdXMgLSAocmFkaXVzUmVkdWN0aW9uTGVmdCArIHJhZGl1c1JlZHVjdGlvblJpZ2h0KS8yO1xuXG5cdFx0XHQvL3RoaXMuZHJhd2luZ0FyZWEgPSBtaW4oW21heFdpZHRoUmFkaXVzLCAodGhpcy5oZWlnaHQgLSAoMiAqICh0aGlzLnBvaW50TGFiZWxGb250U2l6ZSArIDUpKSkvMl0pXG5cdFx0XHR0aGlzLnNldENlbnRlclBvaW50KHJhZGl1c1JlZHVjdGlvbkxlZnQsIHJhZGl1c1JlZHVjdGlvblJpZ2h0KTtcblxuXHRcdH0sXG5cdFx0c2V0Q2VudGVyUG9pbnQ6IGZ1bmN0aW9uKGxlZnRNb3ZlbWVudCwgcmlnaHRNb3ZlbWVudCl7XG5cblx0XHRcdHZhciBtYXhSaWdodCA9IHRoaXMud2lkdGggLSByaWdodE1vdmVtZW50IC0gdGhpcy5kcmF3aW5nQXJlYSxcblx0XHRcdFx0bWF4TGVmdCA9IGxlZnRNb3ZlbWVudCArIHRoaXMuZHJhd2luZ0FyZWE7XG5cblx0XHRcdHRoaXMueENlbnRlciA9IChtYXhMZWZ0ICsgbWF4UmlnaHQpLzI7XG5cdFx0XHQvLyBBbHdheXMgdmVydGljYWxseSBpbiB0aGUgY2VudHJlIGFzIHRoZSB0ZXh0IGhlaWdodCBkb2Vzbid0IGNoYW5nZVxuXHRcdFx0dGhpcy55Q2VudGVyID0gKHRoaXMuaGVpZ2h0LzIpO1xuXHRcdH0sXG5cblx0XHRnZXRJbmRleEFuZ2xlIDogZnVuY3Rpb24oaW5kZXgpe1xuXHRcdFx0dmFyIGFuZ2xlTXVsdGlwbGllciA9IChNYXRoLlBJICogMikgLyB0aGlzLnZhbHVlc0NvdW50O1xuXHRcdFx0Ly8gU3RhcnQgZnJvbSB0aGUgdG9wIGluc3RlYWQgb2YgcmlnaHQsIHNvIHJlbW92ZSBhIHF1YXJ0ZXIgb2YgdGhlIGNpcmNsZVxuXG5cdFx0XHRyZXR1cm4gaW5kZXggKiBhbmdsZU11bHRpcGxpZXIgLSAoTWF0aC5QSS8yKTtcblx0XHR9LFxuXHRcdGdldFBvaW50UG9zaXRpb24gOiBmdW5jdGlvbihpbmRleCwgZGlzdGFuY2VGcm9tQ2VudGVyKXtcblx0XHRcdHZhciB0aGlzQW5nbGUgPSB0aGlzLmdldEluZGV4QW5nbGUoaW5kZXgpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0eCA6IChNYXRoLmNvcyh0aGlzQW5nbGUpICogZGlzdGFuY2VGcm9tQ2VudGVyKSArIHRoaXMueENlbnRlcixcblx0XHRcdFx0eSA6IChNYXRoLnNpbih0aGlzQW5nbGUpICogZGlzdGFuY2VGcm9tQ2VudGVyKSArIHRoaXMueUNlbnRlclxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGRyYXc6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAodGhpcy5kaXNwbGF5KXtcblx0XHRcdFx0dmFyIGN0eCA9IHRoaXMuY3R4O1xuXHRcdFx0XHRlYWNoKHRoaXMueUxhYmVscywgZnVuY3Rpb24obGFiZWwsIGluZGV4KXtcblx0XHRcdFx0XHQvLyBEb24ndCBkcmF3IGEgY2VudHJlIHZhbHVlXG5cdFx0XHRcdFx0aWYgKGluZGV4ID4gMCl7XG5cdFx0XHRcdFx0XHR2YXIgeUNlbnRlck9mZnNldCA9IGluZGV4ICogKHRoaXMuZHJhd2luZ0FyZWEvdGhpcy5zdGVwcyksXG5cdFx0XHRcdFx0XHRcdHlIZWlnaHQgPSB0aGlzLnlDZW50ZXIgLSB5Q2VudGVyT2Zmc2V0LFxuXHRcdFx0XHRcdFx0XHRwb2ludFBvc2l0aW9uO1xuXG5cdFx0XHRcdFx0XHQvLyBEcmF3IGNpcmN1bGFyIGxpbmVzIGFyb3VuZCB0aGUgc2NhbGVcblx0XHRcdFx0XHRcdGlmICh0aGlzLmxpbmVXaWR0aCA+IDApe1xuXHRcdFx0XHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmxpbmVDb2xvcjtcblx0XHRcdFx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IHRoaXMubGluZVdpZHRoO1xuXG5cdFx0XHRcdFx0XHRcdGlmKHRoaXMubGluZUFyYyl7XG5cdFx0XHRcdFx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRcdFx0XHRcdGN0eC5hcmModGhpcy54Q2VudGVyLCB0aGlzLnlDZW50ZXIsIHlDZW50ZXJPZmZzZXQsIDAsIE1hdGguUEkqMik7XG5cdFx0XHRcdFx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdFx0XHRcdFx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNle1xuXHRcdFx0XHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLnZhbHVlc0NvdW50O2krKylcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRwb2ludFBvc2l0aW9uID0gdGhpcy5nZXRQb2ludFBvc2l0aW9uKGksIHRoaXMuY2FsY3VsYXRlQ2VudGVyT2Zmc2V0KHRoaXMubWluICsgKGluZGV4ICogdGhpcy5zdGVwVmFsdWUpKSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoaSA9PT0gMCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGN0eC5tb3ZlVG8ocG9pbnRQb3NpdGlvbi54LCBwb2ludFBvc2l0aW9uLnkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y3R4LmxpbmVUbyhwb2ludFBvc2l0aW9uLngsIHBvaW50UG9zaXRpb24ueSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0XHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKHRoaXMuc2hvd0xhYmVscyl7XG5cdFx0XHRcdFx0XHRcdGN0eC5mb250ID0gZm9udFN0cmluZyh0aGlzLmZvbnRTaXplLHRoaXMuZm9udFN0eWxlLHRoaXMuZm9udEZhbWlseSk7XG5cdFx0XHRcdFx0XHRcdGlmICh0aGlzLnNob3dMYWJlbEJhY2tkcm9wKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbGFiZWxXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dChsYWJlbCkud2lkdGg7XG5cdFx0XHRcdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMuYmFja2Ryb3BDb2xvcjtcblx0XHRcdFx0XHRcdFx0XHRjdHguZmlsbFJlY3QoXG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnhDZW50ZXIgLSBsYWJlbFdpZHRoLzIgLSB0aGlzLmJhY2tkcm9wUGFkZGluZ1gsXG5cdFx0XHRcdFx0XHRcdFx0XHR5SGVpZ2h0IC0gdGhpcy5mb250U2l6ZS8yIC0gdGhpcy5iYWNrZHJvcFBhZGRpbmdZLFxuXHRcdFx0XHRcdFx0XHRcdFx0bGFiZWxXaWR0aCArIHRoaXMuYmFja2Ryb3BQYWRkaW5nWCoyLFxuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5mb250U2l6ZSArIHRoaXMuYmFja2Ryb3BQYWRkaW5nWSoyXG5cdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG5cdFx0XHRcdFx0XHRcdGN0eC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy5mb250Q29sb3I7XG5cdFx0XHRcdFx0XHRcdGN0eC5maWxsVGV4dChsYWJlbCwgdGhpcy54Q2VudGVyLCB5SGVpZ2h0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIHRoaXMpO1xuXG5cdFx0XHRcdGlmICghdGhpcy5saW5lQXJjKXtcblx0XHRcdFx0XHRjdHgubGluZVdpZHRoID0gdGhpcy5hbmdsZUxpbmVXaWR0aDtcblx0XHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmFuZ2xlTGluZUNvbG9yO1xuXHRcdFx0XHRcdGZvciAodmFyIGkgPSB0aGlzLnZhbHVlc0NvdW50IC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0XHRcdGlmICh0aGlzLmFuZ2xlTGluZVdpZHRoID4gMCl7XG5cdFx0XHRcdFx0XHRcdHZhciBvdXRlclBvc2l0aW9uID0gdGhpcy5nZXRQb2ludFBvc2l0aW9uKGksIHRoaXMuY2FsY3VsYXRlQ2VudGVyT2Zmc2V0KHRoaXMubWF4KSk7XG5cdFx0XHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHRcdFx0Y3R4Lm1vdmVUbyh0aGlzLnhDZW50ZXIsIHRoaXMueUNlbnRlcik7XG5cdFx0XHRcdFx0XHRcdGN0eC5saW5lVG8ob3V0ZXJQb3NpdGlvbi54LCBvdXRlclBvc2l0aW9uLnkpO1xuXHRcdFx0XHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHRcdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8vIEV4dHJhIDNweCBvdXQgZm9yIHNvbWUgbGFiZWwgc3BhY2luZ1xuXHRcdFx0XHRcdFx0dmFyIHBvaW50TGFiZWxQb3NpdGlvbiA9IHRoaXMuZ2V0UG9pbnRQb3NpdGlvbihpLCB0aGlzLmNhbGN1bGF0ZUNlbnRlck9mZnNldCh0aGlzLm1heCkgKyA1KTtcblx0XHRcdFx0XHRcdGN0eC5mb250ID0gZm9udFN0cmluZyh0aGlzLnBvaW50TGFiZWxGb250U2l6ZSx0aGlzLnBvaW50TGFiZWxGb250U3R5bGUsdGhpcy5wb2ludExhYmVsRm9udEZhbWlseSk7XG5cdFx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy5wb2ludExhYmVsRm9udENvbG9yO1xuXG5cdFx0XHRcdFx0XHR2YXIgbGFiZWxzQ291bnQgPSB0aGlzLmxhYmVscy5sZW5ndGgsXG5cdFx0XHRcdFx0XHRcdGhhbGZMYWJlbHNDb3VudCA9IHRoaXMubGFiZWxzLmxlbmd0aC8yLFxuXHRcdFx0XHRcdFx0XHRxdWFydGVyTGFiZWxzQ291bnQgPSBoYWxmTGFiZWxzQ291bnQvMixcblx0XHRcdFx0XHRcdFx0dXBwZXJIYWxmID0gKGkgPCBxdWFydGVyTGFiZWxzQ291bnQgfHwgaSA+IGxhYmVsc0NvdW50IC0gcXVhcnRlckxhYmVsc0NvdW50KSxcblx0XHRcdFx0XHRcdFx0ZXhhY3RRdWFydGVyID0gKGkgPT09IHF1YXJ0ZXJMYWJlbHNDb3VudCB8fCBpID09PSBsYWJlbHNDb3VudCAtIHF1YXJ0ZXJMYWJlbHNDb3VudCk7XG5cdFx0XHRcdFx0XHRpZiAoaSA9PT0gMCl7XG5cdFx0XHRcdFx0XHRcdGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcblx0XHRcdFx0XHRcdH0gZWxzZSBpZihpID09PSBoYWxmTGFiZWxzQ291bnQpe1xuXHRcdFx0XHRcdFx0XHRjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGkgPCBoYWxmTGFiZWxzQ291bnQpe1xuXHRcdFx0XHRcdFx0XHRjdHgudGV4dEFsaWduID0gJ2xlZnQnO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Y3R4LnRleHRBbGlnbiA9ICdyaWdodCc7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIFNldCB0aGUgY29ycmVjdCB0ZXh0IGJhc2VsaW5lIGJhc2VkIG9uIG91dGVyIHBvc2l0aW9uaW5nXG5cdFx0XHRcdFx0XHRpZiAoZXhhY3RRdWFydGVyKXtcblx0XHRcdFx0XHRcdFx0Y3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh1cHBlckhhbGYpe1xuXHRcdFx0XHRcdFx0XHRjdHgudGV4dEJhc2VsaW5lID0gJ2JvdHRvbSc7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRjdHgudGV4dEJhc2VsaW5lID0gJ3RvcCc7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGN0eC5maWxsVGV4dCh0aGlzLmxhYmVsc1tpXSwgcG9pbnRMYWJlbFBvc2l0aW9uLngsIHBvaW50TGFiZWxQb3NpdGlvbi55KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdC8vIEF0dGFjaCBnbG9iYWwgZXZlbnQgdG8gcmVzaXplIGVhY2ggY2hhcnQgaW5zdGFuY2Ugd2hlbiB0aGUgYnJvd3NlciByZXNpemVzXG5cdGhlbHBlcnMuYWRkRXZlbnQod2luZG93LCBcInJlc2l6ZVwiLCAoZnVuY3Rpb24oKXtcblx0XHQvLyBCYXNpYyBkZWJvdW5jZSBvZiByZXNpemUgZnVuY3Rpb24gc28gaXQgZG9lc24ndCBodXJ0IHBlcmZvcm1hbmNlIHdoZW4gcmVzaXppbmcgYnJvd3Nlci5cblx0XHR2YXIgdGltZW91dDtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKXtcblx0XHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblx0XHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGVhY2goQ2hhcnQuaW5zdGFuY2VzLGZ1bmN0aW9uKGluc3RhbmNlKXtcblx0XHRcdFx0XHQvLyBJZiB0aGUgcmVzcG9uc2l2ZSBmbGFnIGlzIHNldCBpbiB0aGUgY2hhcnQgaW5zdGFuY2UgY29uZmlnXG5cdFx0XHRcdFx0Ly8gQ2FzY2FkZSB0aGUgcmVzaXplIGV2ZW50IGRvd24gdG8gdGhlIGNoYXJ0LlxuXHRcdFx0XHRcdGlmIChpbnN0YW5jZS5vcHRpb25zLnJlc3BvbnNpdmUpe1xuXHRcdFx0XHRcdFx0aW5zdGFuY2UucmVzaXplKGluc3RhbmNlLnJlbmRlciwgdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0sIDUwKTtcblx0XHR9O1xuXHR9KSgpKTtcblxuXG5cdGlmIChhbWQpIHtcblx0XHRkZWZpbmUoZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBDaGFydDtcblx0XHR9KTtcblx0fSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gQ2hhcnQ7XG5cdH1cblxuXHRyb290LkNoYXJ0ID0gQ2hhcnQ7XG5cblx0Q2hhcnQubm9Db25mbGljdCA9IGZ1bmN0aW9uKCl7XG5cdFx0cm9vdC5DaGFydCA9IHByZXZpb3VzO1xuXHRcdHJldHVybiBDaGFydDtcblx0fTtcblxufSkuY2FsbCh0aGlzKTtcblxuKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciByb290ID0gdGhpcyxcblx0XHRDaGFydCA9IHJvb3QuQ2hhcnQsXG5cdFx0aGVscGVycyA9IENoYXJ0LmhlbHBlcnM7XG5cblxuXHR2YXIgZGVmYXVsdENvbmZpZyA9IHtcblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRoZSBzY2FsZSBzaG91bGQgc3RhcnQgYXQgemVybywgb3IgYW4gb3JkZXIgb2YgbWFnbml0dWRlIGRvd24gZnJvbSB0aGUgbG93ZXN0IHZhbHVlXG5cdFx0c2NhbGVCZWdpbkF0WmVybyA6IHRydWUsXG5cblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIGdyaWQgbGluZXMgYXJlIHNob3duIGFjcm9zcyB0aGUgY2hhcnRcblx0XHRzY2FsZVNob3dHcmlkTGluZXMgOiB0cnVlLFxuXG5cdFx0Ly9TdHJpbmcgLSBDb2xvdXIgb2YgdGhlIGdyaWQgbGluZXNcblx0XHRzY2FsZUdyaWRMaW5lQ29sb3IgOiBcInJnYmEoMCwwLDAsLjA1KVwiLFxuXG5cdFx0Ly9OdW1iZXIgLSBXaWR0aCBvZiB0aGUgZ3JpZCBsaW5lc1xuXHRcdHNjYWxlR3JpZExpbmVXaWR0aCA6IDEsXG5cblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIHNob3cgaG9yaXpvbnRhbCBsaW5lcyAoZXhjZXB0IFggYXhpcylcblx0XHRzY2FsZVNob3dIb3Jpem9udGFsTGluZXM6IHRydWUsXG5cblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIHNob3cgdmVydGljYWwgbGluZXMgKGV4Y2VwdCBZIGF4aXMpXG5cdFx0c2NhbGVTaG93VmVydGljYWxMaW5lczogdHJ1ZSxcblxuXHRcdC8vQm9vbGVhbiAtIElmIHRoZXJlIGlzIGEgc3Ryb2tlIG9uIGVhY2ggYmFyXG5cdFx0YmFyU2hvd1N0cm9rZSA6IHRydWUsXG5cblx0XHQvL051bWJlciAtIFBpeGVsIHdpZHRoIG9mIHRoZSBiYXIgc3Ryb2tlXG5cdFx0YmFyU3Ryb2tlV2lkdGggOiAyLFxuXG5cdFx0Ly9OdW1iZXIgLSBTcGFjaW5nIGJldHdlZW4gZWFjaCBvZiB0aGUgWCB2YWx1ZSBzZXRzXG5cdFx0YmFyVmFsdWVTcGFjaW5nIDogNSxcblxuXHRcdC8vTnVtYmVyIC0gU3BhY2luZyBiZXR3ZWVuIGRhdGEgc2V0cyB3aXRoaW4gWCB2YWx1ZXNcblx0XHRiYXJEYXRhc2V0U3BhY2luZyA6IDEsXG5cblx0XHQvL1N0cmluZyAtIEEgbGVnZW5kIHRlbXBsYXRlXG5cdFx0bGVnZW5kVGVtcGxhdGUgOiBcIjx1bCBjbGFzcz1cXFwiPCU9bmFtZS50b0xvd2VyQ2FzZSgpJT4tbGVnZW5kXFxcIj48JSBmb3IgKHZhciBpPTA7IGk8ZGF0YXNldHMubGVuZ3RoOyBpKyspeyU+PGxpPjxzcGFuIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWNvbG9yOjwlPWRhdGFzZXRzW2ldLmZpbGxDb2xvciU+XFxcIj48L3NwYW4+PCVpZihkYXRhc2V0c1tpXS5sYWJlbCl7JT48JT1kYXRhc2V0c1tpXS5sYWJlbCU+PCV9JT48L2xpPjwlfSU+PC91bD5cIlxuXG5cdH07XG5cblxuXHRDaGFydC5UeXBlLmV4dGVuZCh7XG5cdFx0bmFtZTogXCJCYXJcIixcblx0XHRkZWZhdWx0cyA6IGRlZmF1bHRDb25maWcsXG5cdFx0aW5pdGlhbGl6ZTogIGZ1bmN0aW9uKGRhdGEpe1xuXG5cdFx0XHQvL0V4cG9zZSBvcHRpb25zIGFzIGEgc2NvcGUgdmFyaWFibGUgaGVyZSBzbyB3ZSBjYW4gYWNjZXNzIGl0IGluIHRoZSBTY2FsZUNsYXNzXG5cdFx0XHR2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuXHRcdFx0dGhpcy5TY2FsZUNsYXNzID0gQ2hhcnQuU2NhbGUuZXh0ZW5kKHtcblx0XHRcdFx0b2Zmc2V0R3JpZExpbmVzIDogdHJ1ZSxcblx0XHRcdFx0Y2FsY3VsYXRlQmFyWCA6IGZ1bmN0aW9uKGRhdGFzZXRDb3VudCwgZGF0YXNldEluZGV4LCBiYXJJbmRleCl7XG5cdFx0XHRcdFx0Ly9SZXVzYWJsZSBtZXRob2QgZm9yIGNhbGN1bGF0aW5nIHRoZSB4UG9zaXRpb24gb2YgYSBnaXZlbiBiYXIgYmFzZWQgb24gZGF0YXNldEluZGV4ICYgd2lkdGggb2YgdGhlIGJhclxuXHRcdFx0XHRcdHZhciB4V2lkdGggPSB0aGlzLmNhbGN1bGF0ZUJhc2VXaWR0aCgpLFxuXHRcdFx0XHRcdFx0eEFic29sdXRlID0gdGhpcy5jYWxjdWxhdGVYKGJhckluZGV4KSAtICh4V2lkdGgvMiksXG5cdFx0XHRcdFx0XHRiYXJXaWR0aCA9IHRoaXMuY2FsY3VsYXRlQmFyV2lkdGgoZGF0YXNldENvdW50KTtcblxuXHRcdFx0XHRcdHJldHVybiB4QWJzb2x1dGUgKyAoYmFyV2lkdGggKiBkYXRhc2V0SW5kZXgpICsgKGRhdGFzZXRJbmRleCAqIG9wdGlvbnMuYmFyRGF0YXNldFNwYWNpbmcpICsgYmFyV2lkdGgvMjtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y2FsY3VsYXRlQmFzZVdpZHRoIDogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRyZXR1cm4gKHRoaXMuY2FsY3VsYXRlWCgxKSAtIHRoaXMuY2FsY3VsYXRlWCgwKSkgLSAoMipvcHRpb25zLmJhclZhbHVlU3BhY2luZyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNhbGN1bGF0ZUJhcldpZHRoIDogZnVuY3Rpb24oZGF0YXNldENvdW50KXtcblx0XHRcdFx0XHQvL1RoZSBwYWRkaW5nIGJldHdlZW4gZGF0YXNldHMgaXMgdG8gdGhlIHJpZ2h0IG9mIGVhY2ggYmFyLCBwcm92aWRpbmcgdGhhdCB0aGVyZSBhcmUgbW9yZSB0aGFuIDEgZGF0YXNldFxuXHRcdFx0XHRcdHZhciBiYXNlV2lkdGggPSB0aGlzLmNhbGN1bGF0ZUJhc2VXaWR0aCgpIC0gKChkYXRhc2V0Q291bnQgLSAxKSAqIG9wdGlvbnMuYmFyRGF0YXNldFNwYWNpbmcpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIChiYXNlV2lkdGggLyBkYXRhc2V0Q291bnQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5kYXRhc2V0cyA9IFtdO1xuXG5cdFx0XHQvL1NldCB1cCB0b29sdGlwIGV2ZW50cyBvbiB0aGUgY2hhcnRcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuc2hvd1Rvb2x0aXBzKXtcblx0XHRcdFx0aGVscGVycy5iaW5kRXZlbnRzKHRoaXMsIHRoaXMub3B0aW9ucy50b29sdGlwRXZlbnRzLCBmdW5jdGlvbihldnQpe1xuXHRcdFx0XHRcdHZhciBhY3RpdmVCYXJzID0gKGV2dC50eXBlICE9PSAnbW91c2VvdXQnKSA/IHRoaXMuZ2V0QmFyc0F0RXZlbnQoZXZ0KSA6IFtdO1xuXG5cdFx0XHRcdFx0dGhpcy5lYWNoQmFycyhmdW5jdGlvbihiYXIpe1xuXHRcdFx0XHRcdFx0YmFyLnJlc3RvcmUoWydmaWxsQ29sb3InLCAnc3Ryb2tlQ29sb3InXSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0aGVscGVycy5lYWNoKGFjdGl2ZUJhcnMsIGZ1bmN0aW9uKGFjdGl2ZUJhcil7XG5cdFx0XHRcdFx0XHRhY3RpdmVCYXIuZmlsbENvbG9yID0gYWN0aXZlQmFyLmhpZ2hsaWdodEZpbGw7XG5cdFx0XHRcdFx0XHRhY3RpdmVCYXIuc3Ryb2tlQ29sb3IgPSBhY3RpdmVCYXIuaGlnaGxpZ2h0U3Ryb2tlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHRoaXMuc2hvd1Rvb2x0aXAoYWN0aXZlQmFycyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHQvL0RlY2xhcmUgdGhlIGV4dGVuc2lvbiBvZiB0aGUgZGVmYXVsdCBwb2ludCwgdG8gY2F0ZXIgZm9yIHRoZSBvcHRpb25zIHBhc3NlZCBpbiB0byB0aGUgY29uc3RydWN0b3Jcblx0XHRcdHRoaXMuQmFyQ2xhc3MgPSBDaGFydC5SZWN0YW5nbGUuZXh0ZW5kKHtcblx0XHRcdFx0c3Ryb2tlV2lkdGggOiB0aGlzLm9wdGlvbnMuYmFyU3Ryb2tlV2lkdGgsXG5cdFx0XHRcdHNob3dTdHJva2UgOiB0aGlzLm9wdGlvbnMuYmFyU2hvd1N0cm9rZSxcblx0XHRcdFx0Y3R4IDogdGhpcy5jaGFydC5jdHhcblx0XHRcdH0pO1xuXG5cdFx0XHQvL0l0ZXJhdGUgdGhyb3VnaCBlYWNoIG9mIHRoZSBkYXRhc2V0cywgYW5kIGJ1aWxkIHRoaXMgaW50byBhIHByb3BlcnR5IG9mIHRoZSBjaGFydFxuXHRcdFx0aGVscGVycy5lYWNoKGRhdGEuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCxkYXRhc2V0SW5kZXgpe1xuXG5cdFx0XHRcdHZhciBkYXRhc2V0T2JqZWN0ID0ge1xuXHRcdFx0XHRcdGxhYmVsIDogZGF0YXNldC5sYWJlbCB8fCBudWxsLFxuXHRcdFx0XHRcdGZpbGxDb2xvciA6IGRhdGFzZXQuZmlsbENvbG9yLFxuXHRcdFx0XHRcdHN0cm9rZUNvbG9yIDogZGF0YXNldC5zdHJva2VDb2xvcixcblx0XHRcdFx0XHRiYXJzIDogW11cblx0XHRcdFx0fTtcblxuXHRcdFx0XHR0aGlzLmRhdGFzZXRzLnB1c2goZGF0YXNldE9iamVjdCk7XG5cblx0XHRcdFx0aGVscGVycy5lYWNoKGRhdGFzZXQuZGF0YSxmdW5jdGlvbihkYXRhUG9pbnQsaW5kZXgpe1xuXHRcdFx0XHRcdC8vQWRkIGEgbmV3IHBvaW50IGZvciBlYWNoIHBpZWNlIG9mIGRhdGEsIHBhc3NpbmcgYW55IHJlcXVpcmVkIGRhdGEgdG8gZHJhdy5cblx0XHRcdFx0XHRkYXRhc2V0T2JqZWN0LmJhcnMucHVzaChuZXcgdGhpcy5CYXJDbGFzcyh7XG5cdFx0XHRcdFx0XHR2YWx1ZSA6IGRhdGFQb2ludCxcblx0XHRcdFx0XHRcdGxhYmVsIDogZGF0YS5sYWJlbHNbaW5kZXhdLFxuXHRcdFx0XHRcdFx0ZGF0YXNldExhYmVsOiBkYXRhc2V0LmxhYmVsLFxuXHRcdFx0XHRcdFx0c3Ryb2tlQ29sb3IgOiBkYXRhc2V0LnN0cm9rZUNvbG9yLFxuXHRcdFx0XHRcdFx0ZmlsbENvbG9yIDogZGF0YXNldC5maWxsQ29sb3IsXG5cdFx0XHRcdFx0XHRoaWdobGlnaHRGaWxsIDogZGF0YXNldC5oaWdobGlnaHRGaWxsIHx8IGRhdGFzZXQuZmlsbENvbG9yLFxuXHRcdFx0XHRcdFx0aGlnaGxpZ2h0U3Ryb2tlIDogZGF0YXNldC5oaWdobGlnaHRTdHJva2UgfHwgZGF0YXNldC5zdHJva2VDb2xvclxuXHRcdFx0XHRcdH0pKTtcblx0XHRcdFx0fSx0aGlzKTtcblxuXHRcdFx0fSx0aGlzKTtcblxuXHRcdFx0dGhpcy5idWlsZFNjYWxlKGRhdGEubGFiZWxzKTtcblxuXHRcdFx0dGhpcy5CYXJDbGFzcy5wcm90b3R5cGUuYmFzZSA9IHRoaXMuc2NhbGUuZW5kUG9pbnQ7XG5cblx0XHRcdHRoaXMuZWFjaEJhcnMoZnVuY3Rpb24oYmFyLCBpbmRleCwgZGF0YXNldEluZGV4KXtcblx0XHRcdFx0aGVscGVycy5leHRlbmQoYmFyLCB7XG5cdFx0XHRcdFx0d2lkdGggOiB0aGlzLnNjYWxlLmNhbGN1bGF0ZUJhcldpZHRoKHRoaXMuZGF0YXNldHMubGVuZ3RoKSxcblx0XHRcdFx0XHR4OiB0aGlzLnNjYWxlLmNhbGN1bGF0ZUJhclgodGhpcy5kYXRhc2V0cy5sZW5ndGgsIGRhdGFzZXRJbmRleCwgaW5kZXgpLFxuXHRcdFx0XHRcdHk6IHRoaXMuc2NhbGUuZW5kUG9pbnRcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGJhci5zYXZlKCk7XG5cdFx0XHR9LCB0aGlzKTtcblxuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9LFxuXHRcdHVwZGF0ZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLnNjYWxlLnVwZGF0ZSgpO1xuXHRcdFx0Ly8gUmVzZXQgYW55IGhpZ2hsaWdodCBjb2xvdXJzIGJlZm9yZSB1cGRhdGluZy5cblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmFjdGl2ZUVsZW1lbnRzLCBmdW5jdGlvbihhY3RpdmVFbGVtZW50KXtcblx0XHRcdFx0YWN0aXZlRWxlbWVudC5yZXN0b3JlKFsnZmlsbENvbG9yJywgJ3N0cm9rZUNvbG9yJ10pO1xuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuZWFjaEJhcnMoZnVuY3Rpb24oYmFyKXtcblx0XHRcdFx0YmFyLnNhdmUoKTtcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9LFxuXHRcdGVhY2hCYXJzIDogZnVuY3Rpb24oY2FsbGJhY2spe1xuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCwgZGF0YXNldEluZGV4KXtcblx0XHRcdFx0aGVscGVycy5lYWNoKGRhdGFzZXQuYmFycywgY2FsbGJhY2ssIHRoaXMsIGRhdGFzZXRJbmRleCk7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdH0sXG5cdFx0Z2V0QmFyc0F0RXZlbnQgOiBmdW5jdGlvbihlKXtcblx0XHRcdHZhciBiYXJzQXJyYXkgPSBbXSxcblx0XHRcdFx0ZXZlbnRQb3NpdGlvbiA9IGhlbHBlcnMuZ2V0UmVsYXRpdmVQb3NpdGlvbihlKSxcblx0XHRcdFx0ZGF0YXNldEl0ZXJhdG9yID0gZnVuY3Rpb24oZGF0YXNldCl7XG5cdFx0XHRcdFx0YmFyc0FycmF5LnB1c2goZGF0YXNldC5iYXJzW2JhckluZGV4XSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJhckluZGV4O1xuXG5cdFx0XHRmb3IgKHZhciBkYXRhc2V0SW5kZXggPSAwOyBkYXRhc2V0SW5kZXggPCB0aGlzLmRhdGFzZXRzLmxlbmd0aDsgZGF0YXNldEluZGV4KyspIHtcblx0XHRcdFx0Zm9yIChiYXJJbmRleCA9IDA7IGJhckluZGV4IDwgdGhpcy5kYXRhc2V0c1tkYXRhc2V0SW5kZXhdLmJhcnMubGVuZ3RoOyBiYXJJbmRleCsrKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuZGF0YXNldHNbZGF0YXNldEluZGV4XS5iYXJzW2JhckluZGV4XS5pblJhbmdlKGV2ZW50UG9zaXRpb24ueCxldmVudFBvc2l0aW9uLnkpKXtcblx0XHRcdFx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmRhdGFzZXRzLCBkYXRhc2V0SXRlcmF0b3IpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGJhcnNBcnJheTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGJhcnNBcnJheTtcblx0XHR9LFxuXHRcdGJ1aWxkU2NhbGUgOiBmdW5jdGlvbihsYWJlbHMpe1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0XHR2YXIgZGF0YVRvdGFsID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIHZhbHVlcyA9IFtdO1xuXHRcdFx0XHRzZWxmLmVhY2hCYXJzKGZ1bmN0aW9uKGJhcil7XG5cdFx0XHRcdFx0dmFsdWVzLnB1c2goYmFyLnZhbHVlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiB2YWx1ZXM7XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgc2NhbGVPcHRpb25zID0ge1xuXHRcdFx0XHR0ZW1wbGF0ZVN0cmluZyA6IHRoaXMub3B0aW9ucy5zY2FsZUxhYmVsLFxuXHRcdFx0XHRoZWlnaHQgOiB0aGlzLmNoYXJ0LmhlaWdodCxcblx0XHRcdFx0d2lkdGggOiB0aGlzLmNoYXJ0LndpZHRoLFxuXHRcdFx0XHRjdHggOiB0aGlzLmNoYXJ0LmN0eCxcblx0XHRcdFx0dGV4dENvbG9yIDogdGhpcy5vcHRpb25zLnNjYWxlRm9udENvbG9yLFxuXHRcdFx0XHRmb250U2l6ZSA6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTaXplLFxuXHRcdFx0XHRmb250U3R5bGUgOiB0aGlzLm9wdGlvbnMuc2NhbGVGb250U3R5bGUsXG5cdFx0XHRcdGZvbnRGYW1pbHkgOiB0aGlzLm9wdGlvbnMuc2NhbGVGb250RmFtaWx5LFxuXHRcdFx0XHR2YWx1ZXNDb3VudCA6IGxhYmVscy5sZW5ndGgsXG5cdFx0XHRcdGJlZ2luQXRaZXJvIDogdGhpcy5vcHRpb25zLnNjYWxlQmVnaW5BdFplcm8sXG5cdFx0XHRcdGludGVnZXJzT25seSA6IHRoaXMub3B0aW9ucy5zY2FsZUludGVnZXJzT25seSxcblx0XHRcdFx0Y2FsY3VsYXRlWVJhbmdlOiBmdW5jdGlvbihjdXJyZW50SGVpZ2h0KXtcblx0XHRcdFx0XHR2YXIgdXBkYXRlZFJhbmdlcyA9IGhlbHBlcnMuY2FsY3VsYXRlU2NhbGVSYW5nZShcblx0XHRcdFx0XHRcdGRhdGFUb3RhbCgpLFxuXHRcdFx0XHRcdFx0Y3VycmVudEhlaWdodCxcblx0XHRcdFx0XHRcdHRoaXMuZm9udFNpemUsXG5cdFx0XHRcdFx0XHR0aGlzLmJlZ2luQXRaZXJvLFxuXHRcdFx0XHRcdFx0dGhpcy5pbnRlZ2Vyc09ubHlcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGhlbHBlcnMuZXh0ZW5kKHRoaXMsIHVwZGF0ZWRSYW5nZXMpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR4TGFiZWxzIDogbGFiZWxzLFxuXHRcdFx0XHRmb250IDogaGVscGVycy5mb250U3RyaW5nKHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTaXplLCB0aGlzLm9wdGlvbnMuc2NhbGVGb250U3R5bGUsIHRoaXMub3B0aW9ucy5zY2FsZUZvbnRGYW1pbHkpLFxuXHRcdFx0XHRsaW5lV2lkdGggOiB0aGlzLm9wdGlvbnMuc2NhbGVMaW5lV2lkdGgsXG5cdFx0XHRcdGxpbmVDb2xvciA6IHRoaXMub3B0aW9ucy5zY2FsZUxpbmVDb2xvcixcblx0XHRcdFx0c2hvd0hvcml6b250YWxMaW5lcyA6IHRoaXMub3B0aW9ucy5zY2FsZVNob3dIb3Jpem9udGFsTGluZXMsXG5cdFx0XHRcdHNob3dWZXJ0aWNhbExpbmVzIDogdGhpcy5vcHRpb25zLnNjYWxlU2hvd1ZlcnRpY2FsTGluZXMsXG5cdFx0XHRcdGdyaWRMaW5lV2lkdGggOiAodGhpcy5vcHRpb25zLnNjYWxlU2hvd0dyaWRMaW5lcykgPyB0aGlzLm9wdGlvbnMuc2NhbGVHcmlkTGluZVdpZHRoIDogMCxcblx0XHRcdFx0Z3JpZExpbmVDb2xvciA6ICh0aGlzLm9wdGlvbnMuc2NhbGVTaG93R3JpZExpbmVzKSA/IHRoaXMub3B0aW9ucy5zY2FsZUdyaWRMaW5lQ29sb3IgOiBcInJnYmEoMCwwLDAsMClcIixcblx0XHRcdFx0cGFkZGluZyA6ICh0aGlzLm9wdGlvbnMuc2hvd1NjYWxlKSA/IDAgOiAodGhpcy5vcHRpb25zLmJhclNob3dTdHJva2UpID8gdGhpcy5vcHRpb25zLmJhclN0cm9rZVdpZHRoIDogMCxcblx0XHRcdFx0c2hvd0xhYmVscyA6IHRoaXMub3B0aW9ucy5zY2FsZVNob3dMYWJlbHMsXG5cdFx0XHRcdGRpc3BsYXkgOiB0aGlzLm9wdGlvbnMuc2hvd1NjYWxlXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLnNjYWxlT3ZlcnJpZGUpe1xuXHRcdFx0XHRoZWxwZXJzLmV4dGVuZChzY2FsZU9wdGlvbnMsIHtcblx0XHRcdFx0XHRjYWxjdWxhdGVZUmFuZ2U6IGhlbHBlcnMubm9vcCxcblx0XHRcdFx0XHRzdGVwczogdGhpcy5vcHRpb25zLnNjYWxlU3RlcHMsXG5cdFx0XHRcdFx0c3RlcFZhbHVlOiB0aGlzLm9wdGlvbnMuc2NhbGVTdGVwV2lkdGgsXG5cdFx0XHRcdFx0bWluOiB0aGlzLm9wdGlvbnMuc2NhbGVTdGFydFZhbHVlLFxuXHRcdFx0XHRcdG1heDogdGhpcy5vcHRpb25zLnNjYWxlU3RhcnRWYWx1ZSArICh0aGlzLm9wdGlvbnMuc2NhbGVTdGVwcyAqIHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBXaWR0aClcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuc2NhbGUgPSBuZXcgdGhpcy5TY2FsZUNsYXNzKHNjYWxlT3B0aW9ucyk7XG5cdFx0fSxcblx0XHRhZGREYXRhIDogZnVuY3Rpb24odmFsdWVzQXJyYXksbGFiZWwpe1xuXHRcdFx0Ly9NYXAgdGhlIHZhbHVlcyBhcnJheSBmb3IgZWFjaCBvZiB0aGUgZGF0YXNldHNcblx0XHRcdGhlbHBlcnMuZWFjaCh2YWx1ZXNBcnJheSxmdW5jdGlvbih2YWx1ZSxkYXRhc2V0SW5kZXgpe1xuXHRcdFx0XHQvL0FkZCBhIG5ldyBwb2ludCBmb3IgZWFjaCBwaWVjZSBvZiBkYXRhLCBwYXNzaW5nIGFueSByZXF1aXJlZCBkYXRhIHRvIGRyYXcuXG5cdFx0XHRcdHRoaXMuZGF0YXNldHNbZGF0YXNldEluZGV4XS5iYXJzLnB1c2gobmV3IHRoaXMuQmFyQ2xhc3Moe1xuXHRcdFx0XHRcdHZhbHVlIDogdmFsdWUsXG5cdFx0XHRcdFx0bGFiZWwgOiBsYWJlbCxcblx0XHRcdFx0XHR4OiB0aGlzLnNjYWxlLmNhbGN1bGF0ZUJhclgodGhpcy5kYXRhc2V0cy5sZW5ndGgsIGRhdGFzZXRJbmRleCwgdGhpcy5zY2FsZS52YWx1ZXNDb3VudCsxKSxcblx0XHRcdFx0XHR5OiB0aGlzLnNjYWxlLmVuZFBvaW50LFxuXHRcdFx0XHRcdHdpZHRoIDogdGhpcy5zY2FsZS5jYWxjdWxhdGVCYXJXaWR0aCh0aGlzLmRhdGFzZXRzLmxlbmd0aCksXG5cdFx0XHRcdFx0YmFzZSA6IHRoaXMuc2NhbGUuZW5kUG9pbnQsXG5cdFx0XHRcdFx0c3Ryb2tlQ29sb3IgOiB0aGlzLmRhdGFzZXRzW2RhdGFzZXRJbmRleF0uc3Ryb2tlQ29sb3IsXG5cdFx0XHRcdFx0ZmlsbENvbG9yIDogdGhpcy5kYXRhc2V0c1tkYXRhc2V0SW5kZXhdLmZpbGxDb2xvclxuXHRcdFx0XHR9KSk7XG5cdFx0XHR9LHRoaXMpO1xuXG5cdFx0XHR0aGlzLnNjYWxlLmFkZFhMYWJlbChsYWJlbCk7XG5cdFx0XHQvL1RoZW4gcmUtcmVuZGVyIHRoZSBjaGFydC5cblx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0fSxcblx0XHRyZW1vdmVEYXRhIDogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuc2NhbGUucmVtb3ZlWExhYmVsKCk7XG5cdFx0XHQvL1RoZW4gcmUtcmVuZGVyIHRoZSBjaGFydC5cblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmRhdGFzZXRzLGZ1bmN0aW9uKGRhdGFzZXQpe1xuXHRcdFx0XHRkYXRhc2V0LmJhcnMuc2hpZnQoKTtcblx0XHRcdH0sdGhpcyk7XG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdH0sXG5cdFx0cmVmbG93IDogZnVuY3Rpb24oKXtcblx0XHRcdGhlbHBlcnMuZXh0ZW5kKHRoaXMuQmFyQ2xhc3MucHJvdG90eXBlLHtcblx0XHRcdFx0eTogdGhpcy5zY2FsZS5lbmRQb2ludCxcblx0XHRcdFx0YmFzZSA6IHRoaXMuc2NhbGUuZW5kUG9pbnRcblx0XHRcdH0pO1xuXHRcdFx0dmFyIG5ld1NjYWxlUHJvcHMgPSBoZWxwZXJzLmV4dGVuZCh7XG5cdFx0XHRcdGhlaWdodCA6IHRoaXMuY2hhcnQuaGVpZ2h0LFxuXHRcdFx0XHR3aWR0aCA6IHRoaXMuY2hhcnQud2lkdGhcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5zY2FsZS51cGRhdGUobmV3U2NhbGVQcm9wcyk7XG5cdFx0fSxcblx0XHRkcmF3IDogZnVuY3Rpb24oZWFzZSl7XG5cdFx0XHR2YXIgZWFzaW5nRGVjaW1hbCA9IGVhc2UgfHwgMTtcblx0XHRcdHRoaXMuY2xlYXIoKTtcblxuXHRcdFx0dmFyIGN0eCA9IHRoaXMuY2hhcnQuY3R4O1xuXG5cdFx0XHR0aGlzLnNjYWxlLmRyYXcoZWFzaW5nRGVjaW1hbCk7XG5cblx0XHRcdC8vRHJhdyBhbGwgdGhlIGJhcnMgZm9yIGVhY2ggZGF0YXNldFxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCxkYXRhc2V0SW5kZXgpe1xuXHRcdFx0XHRoZWxwZXJzLmVhY2goZGF0YXNldC5iYXJzLGZ1bmN0aW9uKGJhcixpbmRleCl7XG5cdFx0XHRcdFx0aWYgKGJhci5oYXNWYWx1ZSgpKXtcblx0XHRcdFx0XHRcdGJhci5iYXNlID0gdGhpcy5zY2FsZS5lbmRQb2ludDtcblx0XHRcdFx0XHRcdC8vVHJhbnNpdGlvbiB0aGVuIGRyYXdcblx0XHRcdFx0XHRcdGJhci50cmFuc2l0aW9uKHtcblx0XHRcdFx0XHRcdFx0eCA6IHRoaXMuc2NhbGUuY2FsY3VsYXRlQmFyWCh0aGlzLmRhdGFzZXRzLmxlbmd0aCwgZGF0YXNldEluZGV4LCBpbmRleCksXG5cdFx0XHRcdFx0XHRcdHkgOiB0aGlzLnNjYWxlLmNhbGN1bGF0ZVkoYmFyLnZhbHVlKSxcblx0XHRcdFx0XHRcdFx0d2lkdGggOiB0aGlzLnNjYWxlLmNhbGN1bGF0ZUJhcldpZHRoKHRoaXMuZGF0YXNldHMubGVuZ3RoKVxuXHRcdFx0XHRcdFx0fSwgZWFzaW5nRGVjaW1hbCkuZHJhdygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSx0aGlzKTtcblxuXHRcdFx0fSx0aGlzKTtcblx0XHR9XG5cdH0pO1xuXG5cbn0pLmNhbGwodGhpcyk7XG5cbihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgcm9vdCA9IHRoaXMsXG5cdFx0Q2hhcnQgPSByb290LkNoYXJ0LFxuXHRcdC8vQ2FjaGUgYSBsb2NhbCByZWZlcmVuY2UgdG8gQ2hhcnQuaGVscGVyc1xuXHRcdGhlbHBlcnMgPSBDaGFydC5oZWxwZXJzO1xuXG5cdHZhciBkZWZhdWx0Q29uZmlnID0ge1xuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgd2Ugc2hvdWxkIHNob3cgYSBzdHJva2Ugb24gZWFjaCBzZWdtZW50XG5cdFx0c2VnbWVudFNob3dTdHJva2UgOiB0cnVlLFxuXG5cdFx0Ly9TdHJpbmcgLSBUaGUgY29sb3VyIG9mIGVhY2ggc2VnbWVudCBzdHJva2Vcblx0XHRzZWdtZW50U3Ryb2tlQ29sb3IgOiBcIiNmZmZcIixcblxuXHRcdC8vTnVtYmVyIC0gVGhlIHdpZHRoIG9mIGVhY2ggc2VnbWVudCBzdHJva2Vcblx0XHRzZWdtZW50U3Ryb2tlV2lkdGggOiAyLFxuXG5cdFx0Ly9UaGUgcGVyY2VudGFnZSBvZiB0aGUgY2hhcnQgdGhhdCB3ZSBjdXQgb3V0IG9mIHRoZSBtaWRkbGUuXG5cdFx0cGVyY2VudGFnZUlubmVyQ3V0b3V0IDogNTAsXG5cblx0XHQvL051bWJlciAtIEFtb3VudCBvZiBhbmltYXRpb24gc3RlcHNcblx0XHRhbmltYXRpb25TdGVwcyA6IDEwMCxcblxuXHRcdC8vU3RyaW5nIC0gQW5pbWF0aW9uIGVhc2luZyBlZmZlY3Rcblx0XHRhbmltYXRpb25FYXNpbmcgOiBcImVhc2VPdXRCb3VuY2VcIixcblxuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgd2UgYW5pbWF0ZSB0aGUgcm90YXRpb24gb2YgdGhlIERvdWdobnV0XG5cdFx0YW5pbWF0ZVJvdGF0ZSA6IHRydWUsXG5cblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHdlIGFuaW1hdGUgc2NhbGluZyB0aGUgRG91Z2hudXQgZnJvbSB0aGUgY2VudHJlXG5cdFx0YW5pbWF0ZVNjYWxlIDogZmFsc2UsXG5cblx0XHQvL1N0cmluZyAtIEEgbGVnZW5kIHRlbXBsYXRlXG5cdFx0bGVnZW5kVGVtcGxhdGUgOiBcIjx1bCBjbGFzcz1cXFwiPCU9bmFtZS50b0xvd2VyQ2FzZSgpJT4tbGVnZW5kXFxcIj48JSBmb3IgKHZhciBpPTA7IGk8c2VnbWVudHMubGVuZ3RoOyBpKyspeyU+PGxpPjxzcGFuIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWNvbG9yOjwlPXNlZ21lbnRzW2ldLmZpbGxDb2xvciU+XFxcIj48L3NwYW4+PCVpZihzZWdtZW50c1tpXS5sYWJlbCl7JT48JT1zZWdtZW50c1tpXS5sYWJlbCU+PCV9JT48L2xpPjwlfSU+PC91bD5cIlxuXG5cdH07XG5cblxuXHRDaGFydC5UeXBlLmV4dGVuZCh7XG5cdFx0Ly9QYXNzaW5nIGluIGEgbmFtZSByZWdpc3RlcnMgdGhpcyBjaGFydCBpbiB0aGUgQ2hhcnQgbmFtZXNwYWNlXG5cdFx0bmFtZTogXCJEb3VnaG51dFwiLFxuXHRcdC8vUHJvdmlkaW5nIGEgZGVmYXVsdHMgd2lsbCBhbHNvIHJlZ2lzdGVyIHRoZSBkZWFmdWx0cyBpbiB0aGUgY2hhcnQgbmFtZXNwYWNlXG5cdFx0ZGVmYXVsdHMgOiBkZWZhdWx0Q29uZmlnLFxuXHRcdC8vSW5pdGlhbGl6ZSBpcyBmaXJlZCB3aGVuIHRoZSBjaGFydCBpcyBpbml0aWFsaXplZCAtIERhdGEgaXMgcGFzc2VkIGluIGFzIGEgcGFyYW1ldGVyXG5cdFx0Ly9Db25maWcgaXMgYXV0b21hdGljYWxseSBtZXJnZWQgYnkgdGhlIGNvcmUgb2YgQ2hhcnQuanMsIGFuZCBpcyBhdmFpbGFibGUgYXQgdGhpcy5vcHRpb25zXG5cdFx0aW5pdGlhbGl6ZTogIGZ1bmN0aW9uKGRhdGEpe1xuXG5cdFx0XHQvL0RlY2xhcmUgc2VnbWVudHMgYXMgYSBzdGF0aWMgcHJvcGVydHkgdG8gcHJldmVudCBpbmhlcml0aW5nIGFjcm9zcyB0aGUgQ2hhcnQgdHlwZSBwcm90b3R5cGVcblx0XHRcdHRoaXMuc2VnbWVudHMgPSBbXTtcblx0XHRcdHRoaXMub3V0ZXJSYWRpdXMgPSAoaGVscGVycy5taW4oW3RoaXMuY2hhcnQud2lkdGgsdGhpcy5jaGFydC5oZWlnaHRdKSAtXHR0aGlzLm9wdGlvbnMuc2VnbWVudFN0cm9rZVdpZHRoLzIpLzI7XG5cblx0XHRcdHRoaXMuU2VnbWVudEFyYyA9IENoYXJ0LkFyYy5leHRlbmQoe1xuXHRcdFx0XHRjdHggOiB0aGlzLmNoYXJ0LmN0eCxcblx0XHRcdFx0eCA6IHRoaXMuY2hhcnQud2lkdGgvMixcblx0XHRcdFx0eSA6IHRoaXMuY2hhcnQuaGVpZ2h0LzJcblx0XHRcdH0pO1xuXG5cdFx0XHQvL1NldCB1cCB0b29sdGlwIGV2ZW50cyBvbiB0aGUgY2hhcnRcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuc2hvd1Rvb2x0aXBzKXtcblx0XHRcdFx0aGVscGVycy5iaW5kRXZlbnRzKHRoaXMsIHRoaXMub3B0aW9ucy50b29sdGlwRXZlbnRzLCBmdW5jdGlvbihldnQpe1xuXHRcdFx0XHRcdHZhciBhY3RpdmVTZWdtZW50cyA9IChldnQudHlwZSAhPT0gJ21vdXNlb3V0JykgPyB0aGlzLmdldFNlZ21lbnRzQXRFdmVudChldnQpIDogW107XG5cblx0XHRcdFx0XHRoZWxwZXJzLmVhY2godGhpcy5zZWdtZW50cyxmdW5jdGlvbihzZWdtZW50KXtcblx0XHRcdFx0XHRcdHNlZ21lbnQucmVzdG9yZShbXCJmaWxsQ29sb3JcIl0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGhlbHBlcnMuZWFjaChhY3RpdmVTZWdtZW50cyxmdW5jdGlvbihhY3RpdmVTZWdtZW50KXtcblx0XHRcdFx0XHRcdGFjdGl2ZVNlZ21lbnQuZmlsbENvbG9yID0gYWN0aXZlU2VnbWVudC5oaWdobGlnaHRDb2xvcjtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR0aGlzLnNob3dUb29sdGlwKGFjdGl2ZVNlZ21lbnRzKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmNhbGN1bGF0ZVRvdGFsKGRhdGEpO1xuXG5cdFx0XHRoZWxwZXJzLmVhY2goZGF0YSxmdW5jdGlvbihkYXRhcG9pbnQsIGluZGV4KXtcblx0XHRcdFx0dGhpcy5hZGREYXRhKGRhdGFwb2ludCwgaW5kZXgsIHRydWUpO1xuXHRcdFx0fSx0aGlzKTtcblxuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9LFxuXHRcdGdldFNlZ21lbnRzQXRFdmVudCA6IGZ1bmN0aW9uKGUpe1xuXHRcdFx0dmFyIHNlZ21lbnRzQXJyYXkgPSBbXTtcblxuXHRcdFx0dmFyIGxvY2F0aW9uID0gaGVscGVycy5nZXRSZWxhdGl2ZVBvc2l0aW9uKGUpO1xuXG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5zZWdtZW50cyxmdW5jdGlvbihzZWdtZW50KXtcblx0XHRcdFx0aWYgKHNlZ21lbnQuaW5SYW5nZShsb2NhdGlvbi54LGxvY2F0aW9uLnkpKSBzZWdtZW50c0FycmF5LnB1c2goc2VnbWVudCk7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdFx0cmV0dXJuIHNlZ21lbnRzQXJyYXk7XG5cdFx0fSxcblx0XHRhZGREYXRhIDogZnVuY3Rpb24oc2VnbWVudCwgYXRJbmRleCwgc2lsZW50KXtcblx0XHRcdHZhciBpbmRleCA9IGF0SW5kZXggfHwgdGhpcy5zZWdtZW50cy5sZW5ndGg7XG5cdFx0XHR0aGlzLnNlZ21lbnRzLnNwbGljZShpbmRleCwgMCwgbmV3IHRoaXMuU2VnbWVudEFyYyh7XG5cdFx0XHRcdHZhbHVlIDogc2VnbWVudC52YWx1ZSxcblx0XHRcdFx0b3V0ZXJSYWRpdXMgOiAodGhpcy5vcHRpb25zLmFuaW1hdGVTY2FsZSkgPyAwIDogdGhpcy5vdXRlclJhZGl1cyxcblx0XHRcdFx0aW5uZXJSYWRpdXMgOiAodGhpcy5vcHRpb25zLmFuaW1hdGVTY2FsZSkgPyAwIDogKHRoaXMub3V0ZXJSYWRpdXMvMTAwKSAqIHRoaXMub3B0aW9ucy5wZXJjZW50YWdlSW5uZXJDdXRvdXQsXG5cdFx0XHRcdGZpbGxDb2xvciA6IHNlZ21lbnQuY29sb3IsXG5cdFx0XHRcdGhpZ2hsaWdodENvbG9yIDogc2VnbWVudC5oaWdobGlnaHQgfHwgc2VnbWVudC5jb2xvcixcblx0XHRcdFx0c2hvd1N0cm9rZSA6IHRoaXMub3B0aW9ucy5zZWdtZW50U2hvd1N0cm9rZSxcblx0XHRcdFx0c3Ryb2tlV2lkdGggOiB0aGlzLm9wdGlvbnMuc2VnbWVudFN0cm9rZVdpZHRoLFxuXHRcdFx0XHRzdHJva2VDb2xvciA6IHRoaXMub3B0aW9ucy5zZWdtZW50U3Ryb2tlQ29sb3IsXG5cdFx0XHRcdHN0YXJ0QW5nbGUgOiBNYXRoLlBJICogMS41LFxuXHRcdFx0XHRjaXJjdW1mZXJlbmNlIDogKHRoaXMub3B0aW9ucy5hbmltYXRlUm90YXRlKSA/IDAgOiB0aGlzLmNhbGN1bGF0ZUNpcmN1bWZlcmVuY2Uoc2VnbWVudC52YWx1ZSksXG5cdFx0XHRcdGxhYmVsIDogc2VnbWVudC5sYWJlbFxuXHRcdFx0fSkpO1xuXHRcdFx0aWYgKCFzaWxlbnQpe1xuXHRcdFx0XHR0aGlzLnJlZmxvdygpO1xuXHRcdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Y2FsY3VsYXRlQ2lyY3VtZmVyZW5jZSA6IGZ1bmN0aW9uKHZhbHVlKXtcblx0XHRcdHJldHVybiAoTWF0aC5QSSoyKSooTWF0aC5hYnModmFsdWUpIC8gdGhpcy50b3RhbCk7XG5cdFx0fSxcblx0XHRjYWxjdWxhdGVUb3RhbCA6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0dGhpcy50b3RhbCA9IDA7XG5cdFx0XHRoZWxwZXJzLmVhY2goZGF0YSxmdW5jdGlvbihzZWdtZW50KXtcblx0XHRcdFx0dGhpcy50b3RhbCArPSBNYXRoLmFicyhzZWdtZW50LnZhbHVlKTtcblx0XHRcdH0sdGhpcyk7XG5cdFx0fSxcblx0XHR1cGRhdGUgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5jYWxjdWxhdGVUb3RhbCh0aGlzLnNlZ21lbnRzKTtcblxuXHRcdFx0Ly8gUmVzZXQgYW55IGhpZ2hsaWdodCBjb2xvdXJzIGJlZm9yZSB1cGRhdGluZy5cblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmFjdGl2ZUVsZW1lbnRzLCBmdW5jdGlvbihhY3RpdmVFbGVtZW50KXtcblx0XHRcdFx0YWN0aXZlRWxlbWVudC5yZXN0b3JlKFsnZmlsbENvbG9yJ10pO1xuXHRcdFx0fSk7XG5cblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLnNlZ21lbnRzLGZ1bmN0aW9uKHNlZ21lbnQpe1xuXHRcdFx0XHRzZWdtZW50LnNhdmUoKTtcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9LFxuXG5cdFx0cmVtb3ZlRGF0YTogZnVuY3Rpb24oYXRJbmRleCl7XG5cdFx0XHR2YXIgaW5kZXhUb0RlbGV0ZSA9IChoZWxwZXJzLmlzTnVtYmVyKGF0SW5kZXgpKSA/IGF0SW5kZXggOiB0aGlzLnNlZ21lbnRzLmxlbmd0aC0xO1xuXHRcdFx0dGhpcy5zZWdtZW50cy5zcGxpY2UoaW5kZXhUb0RlbGV0ZSwgMSk7XG5cdFx0XHR0aGlzLnJlZmxvdygpO1xuXHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHR9LFxuXG5cdFx0cmVmbG93IDogZnVuY3Rpb24oKXtcblx0XHRcdGhlbHBlcnMuZXh0ZW5kKHRoaXMuU2VnbWVudEFyYy5wcm90b3R5cGUse1xuXHRcdFx0XHR4IDogdGhpcy5jaGFydC53aWR0aC8yLFxuXHRcdFx0XHR5IDogdGhpcy5jaGFydC5oZWlnaHQvMlxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLm91dGVyUmFkaXVzID0gKGhlbHBlcnMubWluKFt0aGlzLmNoYXJ0LndpZHRoLHRoaXMuY2hhcnQuaGVpZ2h0XSkgLVx0dGhpcy5vcHRpb25zLnNlZ21lbnRTdHJva2VXaWR0aC8yKS8yO1xuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuc2VnbWVudHMsIGZ1bmN0aW9uKHNlZ21lbnQpe1xuXHRcdFx0XHRzZWdtZW50LnVwZGF0ZSh7XG5cdFx0XHRcdFx0b3V0ZXJSYWRpdXMgOiB0aGlzLm91dGVyUmFkaXVzLFxuXHRcdFx0XHRcdGlubmVyUmFkaXVzIDogKHRoaXMub3V0ZXJSYWRpdXMvMTAwKSAqIHRoaXMub3B0aW9ucy5wZXJjZW50YWdlSW5uZXJDdXRvdXRcblx0XHRcdFx0fSk7XG5cdFx0XHR9LCB0aGlzKTtcblx0XHR9LFxuXHRcdGRyYXcgOiBmdW5jdGlvbihlYXNlRGVjaW1hbCl7XG5cdFx0XHR2YXIgYW5pbURlY2ltYWwgPSAoZWFzZURlY2ltYWwpID8gZWFzZURlY2ltYWwgOiAxO1xuXHRcdFx0dGhpcy5jbGVhcigpO1xuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuc2VnbWVudHMsZnVuY3Rpb24oc2VnbWVudCxpbmRleCl7XG5cdFx0XHRcdHNlZ21lbnQudHJhbnNpdGlvbih7XG5cdFx0XHRcdFx0Y2lyY3VtZmVyZW5jZSA6IHRoaXMuY2FsY3VsYXRlQ2lyY3VtZmVyZW5jZShzZWdtZW50LnZhbHVlKSxcblx0XHRcdFx0XHRvdXRlclJhZGl1cyA6IHRoaXMub3V0ZXJSYWRpdXMsXG5cdFx0XHRcdFx0aW5uZXJSYWRpdXMgOiAodGhpcy5vdXRlclJhZGl1cy8xMDApICogdGhpcy5vcHRpb25zLnBlcmNlbnRhZ2VJbm5lckN1dG91dFxuXHRcdFx0XHR9LGFuaW1EZWNpbWFsKTtcblxuXHRcdFx0XHRzZWdtZW50LmVuZEFuZ2xlID0gc2VnbWVudC5zdGFydEFuZ2xlICsgc2VnbWVudC5jaXJjdW1mZXJlbmNlO1xuXG5cdFx0XHRcdHNlZ21lbnQuZHJhdygpO1xuXHRcdFx0XHRpZiAoaW5kZXggPT09IDApe1xuXHRcdFx0XHRcdHNlZ21lbnQuc3RhcnRBbmdsZSA9IE1hdGguUEkgKiAxLjU7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9DaGVjayB0byBzZWUgaWYgaXQncyB0aGUgbGFzdCBzZWdtZW50LCBpZiBub3QgZ2V0IHRoZSBuZXh0IGFuZCB1cGRhdGUgdGhlIHN0YXJ0IGFuZ2xlXG5cdFx0XHRcdGlmIChpbmRleCA8IHRoaXMuc2VnbWVudHMubGVuZ3RoLTEpe1xuXHRcdFx0XHRcdHRoaXMuc2VnbWVudHNbaW5kZXgrMV0uc3RhcnRBbmdsZSA9IHNlZ21lbnQuZW5kQW5nbGU7XG5cdFx0XHRcdH1cblx0XHRcdH0sdGhpcyk7XG5cblx0XHR9XG5cdH0pO1xuXG5cdENoYXJ0LnR5cGVzLkRvdWdobnV0LmV4dGVuZCh7XG5cdFx0bmFtZSA6IFwiUGllXCIsXG5cdFx0ZGVmYXVsdHMgOiBoZWxwZXJzLm1lcmdlKGRlZmF1bHRDb25maWcse3BlcmNlbnRhZ2VJbm5lckN1dG91dCA6IDB9KVxuXHR9KTtcblxufSkuY2FsbCh0aGlzKTtcbihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgcm9vdCA9IHRoaXMsXG5cdFx0Q2hhcnQgPSByb290LkNoYXJ0LFxuXHRcdGhlbHBlcnMgPSBDaGFydC5oZWxwZXJzO1xuXG5cdHZhciBkZWZhdWx0Q29uZmlnID0ge1xuXG5cdFx0Ly8vQm9vbGVhbiAtIFdoZXRoZXIgZ3JpZCBsaW5lcyBhcmUgc2hvd24gYWNyb3NzIHRoZSBjaGFydFxuXHRcdHNjYWxlU2hvd0dyaWRMaW5lcyA6IHRydWUsXG5cblx0XHQvL1N0cmluZyAtIENvbG91ciBvZiB0aGUgZ3JpZCBsaW5lc1xuXHRcdHNjYWxlR3JpZExpbmVDb2xvciA6IFwicmdiYSgwLDAsMCwuMDUpXCIsXG5cblx0XHQvL051bWJlciAtIFdpZHRoIG9mIHRoZSBncmlkIGxpbmVzXG5cdFx0c2NhbGVHcmlkTGluZVdpZHRoIDogMSxcblxuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdG8gc2hvdyBob3Jpem9udGFsIGxpbmVzIChleGNlcHQgWCBheGlzKVxuXHRcdHNjYWxlU2hvd0hvcml6b250YWxMaW5lczogdHJ1ZSxcblxuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdG8gc2hvdyB2ZXJ0aWNhbCBsaW5lcyAoZXhjZXB0IFkgYXhpcylcblx0XHRzY2FsZVNob3dWZXJ0aWNhbExpbmVzOiB0cnVlLFxuXG5cdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB0aGUgbGluZSBpcyBjdXJ2ZWQgYmV0d2VlbiBwb2ludHNcblx0XHRiZXppZXJDdXJ2ZSA6IHRydWUsXG5cblx0XHQvL051bWJlciAtIFRlbnNpb24gb2YgdGhlIGJlemllciBjdXJ2ZSBiZXR3ZWVuIHBvaW50c1xuXHRcdGJlemllckN1cnZlVGVuc2lvbiA6IDAuNCxcblxuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdG8gc2hvdyBhIGRvdCBmb3IgZWFjaCBwb2ludFxuXHRcdHBvaW50RG90IDogdHJ1ZSxcblxuXHRcdC8vTnVtYmVyIC0gUmFkaXVzIG9mIGVhY2ggcG9pbnQgZG90IGluIHBpeGVsc1xuXHRcdHBvaW50RG90UmFkaXVzIDogNCxcblxuXHRcdC8vTnVtYmVyIC0gUGl4ZWwgd2lkdGggb2YgcG9pbnQgZG90IHN0cm9rZVxuXHRcdHBvaW50RG90U3Ryb2tlV2lkdGggOiAxLFxuXG5cdFx0Ly9OdW1iZXIgLSBhbW91bnQgZXh0cmEgdG8gYWRkIHRvIHRoZSByYWRpdXMgdG8gY2F0ZXIgZm9yIGhpdCBkZXRlY3Rpb24gb3V0c2lkZSB0aGUgZHJhd24gcG9pbnRcblx0XHRwb2ludEhpdERldGVjdGlvblJhZGl1cyA6IDIwLFxuXG5cdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB0byBzaG93IGEgc3Ryb2tlIGZvciBkYXRhc2V0c1xuXHRcdGRhdGFzZXRTdHJva2UgOiB0cnVlLFxuXG5cdFx0Ly9OdW1iZXIgLSBQaXhlbCB3aWR0aCBvZiBkYXRhc2V0IHN0cm9rZVxuXHRcdGRhdGFzZXRTdHJva2VXaWR0aCA6IDIsXG5cblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIGZpbGwgdGhlIGRhdGFzZXQgd2l0aCBhIGNvbG91clxuXHRcdGRhdGFzZXRGaWxsIDogdHJ1ZSxcblxuXHRcdC8vU3RyaW5nIC0gQSBsZWdlbmQgdGVtcGxhdGVcblx0XHRsZWdlbmRUZW1wbGF0ZSA6IFwiPHVsIGNsYXNzPVxcXCI8JT1uYW1lLnRvTG93ZXJDYXNlKCklPi1sZWdlbmRcXFwiPjwlIGZvciAodmFyIGk9MDsgaTxkYXRhc2V0cy5sZW5ndGg7IGkrKyl7JT48bGk+PHNwYW4gc3R5bGU9XFxcImJhY2tncm91bmQtY29sb3I6PCU9ZGF0YXNldHNbaV0uc3Ryb2tlQ29sb3IlPlxcXCI+PC9zcGFuPjwlaWYoZGF0YXNldHNbaV0ubGFiZWwpeyU+PCU9ZGF0YXNldHNbaV0ubGFiZWwlPjwlfSU+PC9saT48JX0lPjwvdWw+XCJcblxuXHR9O1xuXG5cblx0Q2hhcnQuVHlwZS5leHRlbmQoe1xuXHRcdG5hbWU6IFwiTGluZVwiLFxuXHRcdGRlZmF1bHRzIDogZGVmYXVsdENvbmZpZyxcblx0XHRpbml0aWFsaXplOiAgZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHQvL0RlY2xhcmUgdGhlIGV4dGVuc2lvbiBvZiB0aGUgZGVmYXVsdCBwb2ludCwgdG8gY2F0ZXIgZm9yIHRoZSBvcHRpb25zIHBhc3NlZCBpbiB0byB0aGUgY29uc3RydWN0b3Jcblx0XHRcdHRoaXMuUG9pbnRDbGFzcyA9IENoYXJ0LlBvaW50LmV4dGVuZCh7XG5cdFx0XHRcdHN0cm9rZVdpZHRoIDogdGhpcy5vcHRpb25zLnBvaW50RG90U3Ryb2tlV2lkdGgsXG5cdFx0XHRcdHJhZGl1cyA6IHRoaXMub3B0aW9ucy5wb2ludERvdFJhZGl1cyxcblx0XHRcdFx0ZGlzcGxheTogdGhpcy5vcHRpb25zLnBvaW50RG90LFxuXHRcdFx0XHRoaXREZXRlY3Rpb25SYWRpdXMgOiB0aGlzLm9wdGlvbnMucG9pbnRIaXREZXRlY3Rpb25SYWRpdXMsXG5cdFx0XHRcdGN0eCA6IHRoaXMuY2hhcnQuY3R4LFxuXHRcdFx0XHRpblJhbmdlIDogZnVuY3Rpb24obW91c2VYKXtcblx0XHRcdFx0XHRyZXR1cm4gKE1hdGgucG93KG1vdXNlWC10aGlzLngsIDIpIDwgTWF0aC5wb3codGhpcy5yYWRpdXMgKyB0aGlzLmhpdERldGVjdGlvblJhZGl1cywyKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLmRhdGFzZXRzID0gW107XG5cblx0XHRcdC8vU2V0IHVwIHRvb2x0aXAgZXZlbnRzIG9uIHRoZSBjaGFydFxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5zaG93VG9vbHRpcHMpe1xuXHRcdFx0XHRoZWxwZXJzLmJpbmRFdmVudHModGhpcywgdGhpcy5vcHRpb25zLnRvb2x0aXBFdmVudHMsIGZ1bmN0aW9uKGV2dCl7XG5cdFx0XHRcdFx0dmFyIGFjdGl2ZVBvaW50cyA9IChldnQudHlwZSAhPT0gJ21vdXNlb3V0JykgPyB0aGlzLmdldFBvaW50c0F0RXZlbnQoZXZ0KSA6IFtdO1xuXHRcdFx0XHRcdHRoaXMuZWFjaFBvaW50cyhmdW5jdGlvbihwb2ludCl7XG5cdFx0XHRcdFx0XHRwb2ludC5yZXN0b3JlKFsnZmlsbENvbG9yJywgJ3N0cm9rZUNvbG9yJ10pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGhlbHBlcnMuZWFjaChhY3RpdmVQb2ludHMsIGZ1bmN0aW9uKGFjdGl2ZVBvaW50KXtcblx0XHRcdFx0XHRcdGFjdGl2ZVBvaW50LmZpbGxDb2xvciA9IGFjdGl2ZVBvaW50LmhpZ2hsaWdodEZpbGw7XG5cdFx0XHRcdFx0XHRhY3RpdmVQb2ludC5zdHJva2VDb2xvciA9IGFjdGl2ZVBvaW50LmhpZ2hsaWdodFN0cm9rZTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR0aGlzLnNob3dUb29sdGlwKGFjdGl2ZVBvaW50cyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHQvL0l0ZXJhdGUgdGhyb3VnaCBlYWNoIG9mIHRoZSBkYXRhc2V0cywgYW5kIGJ1aWxkIHRoaXMgaW50byBhIHByb3BlcnR5IG9mIHRoZSBjaGFydFxuXHRcdFx0aGVscGVycy5lYWNoKGRhdGEuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCl7XG5cblx0XHRcdFx0dmFyIGRhdGFzZXRPYmplY3QgPSB7XG5cdFx0XHRcdFx0bGFiZWwgOiBkYXRhc2V0LmxhYmVsIHx8IG51bGwsXG5cdFx0XHRcdFx0ZmlsbENvbG9yIDogZGF0YXNldC5maWxsQ29sb3IsXG5cdFx0XHRcdFx0c3Ryb2tlQ29sb3IgOiBkYXRhc2V0LnN0cm9rZUNvbG9yLFxuXHRcdFx0XHRcdHBvaW50Q29sb3IgOiBkYXRhc2V0LnBvaW50Q29sb3IsXG5cdFx0XHRcdFx0cG9pbnRTdHJva2VDb2xvciA6IGRhdGFzZXQucG9pbnRTdHJva2VDb2xvcixcblx0XHRcdFx0XHRwb2ludHMgOiBbXVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHRoaXMuZGF0YXNldHMucHVzaChkYXRhc2V0T2JqZWN0KTtcblxuXG5cdFx0XHRcdGhlbHBlcnMuZWFjaChkYXRhc2V0LmRhdGEsZnVuY3Rpb24oZGF0YVBvaW50LGluZGV4KXtcblx0XHRcdFx0XHQvL0FkZCBhIG5ldyBwb2ludCBmb3IgZWFjaCBwaWVjZSBvZiBkYXRhLCBwYXNzaW5nIGFueSByZXF1aXJlZCBkYXRhIHRvIGRyYXcuXG5cdFx0XHRcdFx0ZGF0YXNldE9iamVjdC5wb2ludHMucHVzaChuZXcgdGhpcy5Qb2ludENsYXNzKHtcblx0XHRcdFx0XHRcdHZhbHVlIDogZGF0YVBvaW50LFxuXHRcdFx0XHRcdFx0bGFiZWwgOiBkYXRhLmxhYmVsc1tpbmRleF0sXG5cdFx0XHRcdFx0XHRkYXRhc2V0TGFiZWw6IGRhdGFzZXQubGFiZWwsXG5cdFx0XHRcdFx0XHRzdHJva2VDb2xvciA6IGRhdGFzZXQucG9pbnRTdHJva2VDb2xvcixcblx0XHRcdFx0XHRcdGZpbGxDb2xvciA6IGRhdGFzZXQucG9pbnRDb2xvcixcblx0XHRcdFx0XHRcdGhpZ2hsaWdodEZpbGwgOiBkYXRhc2V0LnBvaW50SGlnaGxpZ2h0RmlsbCB8fCBkYXRhc2V0LnBvaW50Q29sb3IsXG5cdFx0XHRcdFx0XHRoaWdobGlnaHRTdHJva2UgOiBkYXRhc2V0LnBvaW50SGlnaGxpZ2h0U3Ryb2tlIHx8IGRhdGFzZXQucG9pbnRTdHJva2VDb2xvclxuXHRcdFx0XHRcdH0pKTtcblx0XHRcdFx0fSx0aGlzKTtcblxuXHRcdFx0XHR0aGlzLmJ1aWxkU2NhbGUoZGF0YS5sYWJlbHMpO1xuXG5cblx0XHRcdFx0dGhpcy5lYWNoUG9pbnRzKGZ1bmN0aW9uKHBvaW50LCBpbmRleCl7XG5cdFx0XHRcdFx0aGVscGVycy5leHRlbmQocG9pbnQsIHtcblx0XHRcdFx0XHRcdHg6IHRoaXMuc2NhbGUuY2FsY3VsYXRlWChpbmRleCksXG5cdFx0XHRcdFx0XHR5OiB0aGlzLnNjYWxlLmVuZFBvaW50XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cG9pbnQuc2F2ZSgpO1xuXHRcdFx0XHR9LCB0aGlzKTtcblxuXHRcdFx0fSx0aGlzKTtcblxuXG5cdFx0XHR0aGlzLnJlbmRlcigpO1xuXHRcdH0sXG5cdFx0dXBkYXRlIDogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuc2NhbGUudXBkYXRlKCk7XG5cdFx0XHQvLyBSZXNldCBhbnkgaGlnaGxpZ2h0IGNvbG91cnMgYmVmb3JlIHVwZGF0aW5nLlxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuYWN0aXZlRWxlbWVudHMsIGZ1bmN0aW9uKGFjdGl2ZUVsZW1lbnQpe1xuXHRcdFx0XHRhY3RpdmVFbGVtZW50LnJlc3RvcmUoWydmaWxsQ29sb3InLCAnc3Ryb2tlQ29sb3InXSk7XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuZWFjaFBvaW50cyhmdW5jdGlvbihwb2ludCl7XG5cdFx0XHRcdHBvaW50LnNhdmUoKTtcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9LFxuXHRcdGVhY2hQb2ludHMgOiBmdW5jdGlvbihjYWxsYmFjayl7XG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5kYXRhc2V0cyxmdW5jdGlvbihkYXRhc2V0KXtcblx0XHRcdFx0aGVscGVycy5lYWNoKGRhdGFzZXQucG9pbnRzLGNhbGxiYWNrLHRoaXMpO1xuXHRcdFx0fSx0aGlzKTtcblx0XHR9LFxuXHRcdGdldFBvaW50c0F0RXZlbnQgOiBmdW5jdGlvbihlKXtcblx0XHRcdHZhciBwb2ludHNBcnJheSA9IFtdLFxuXHRcdFx0XHRldmVudFBvc2l0aW9uID0gaGVscGVycy5nZXRSZWxhdGl2ZVBvc2l0aW9uKGUpO1xuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCl7XG5cdFx0XHRcdGhlbHBlcnMuZWFjaChkYXRhc2V0LnBvaW50cyxmdW5jdGlvbihwb2ludCl7XG5cdFx0XHRcdFx0aWYgKHBvaW50LmluUmFuZ2UoZXZlbnRQb3NpdGlvbi54LGV2ZW50UG9zaXRpb24ueSkpIHBvaW50c0FycmF5LnB1c2gocG9pbnQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sdGhpcyk7XG5cdFx0XHRyZXR1cm4gcG9pbnRzQXJyYXk7XG5cdFx0fSxcblx0XHRidWlsZFNjYWxlIDogZnVuY3Rpb24obGFiZWxzKXtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdFx0dmFyIGRhdGFUb3RhbCA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciB2YWx1ZXMgPSBbXTtcblx0XHRcdFx0c2VsZi5lYWNoUG9pbnRzKGZ1bmN0aW9uKHBvaW50KXtcblx0XHRcdFx0XHR2YWx1ZXMucHVzaChwb2ludC52YWx1ZSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHJldHVybiB2YWx1ZXM7XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgc2NhbGVPcHRpb25zID0ge1xuXHRcdFx0XHR0ZW1wbGF0ZVN0cmluZyA6IHRoaXMub3B0aW9ucy5zY2FsZUxhYmVsLFxuXHRcdFx0XHRoZWlnaHQgOiB0aGlzLmNoYXJ0LmhlaWdodCxcblx0XHRcdFx0d2lkdGggOiB0aGlzLmNoYXJ0LndpZHRoLFxuXHRcdFx0XHRjdHggOiB0aGlzLmNoYXJ0LmN0eCxcblx0XHRcdFx0dGV4dENvbG9yIDogdGhpcy5vcHRpb25zLnNjYWxlRm9udENvbG9yLFxuXHRcdFx0XHRmb250U2l6ZSA6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTaXplLFxuXHRcdFx0XHRmb250U3R5bGUgOiB0aGlzLm9wdGlvbnMuc2NhbGVGb250U3R5bGUsXG5cdFx0XHRcdGZvbnRGYW1pbHkgOiB0aGlzLm9wdGlvbnMuc2NhbGVGb250RmFtaWx5LFxuXHRcdFx0XHR2YWx1ZXNDb3VudCA6IGxhYmVscy5sZW5ndGgsXG5cdFx0XHRcdGJlZ2luQXRaZXJvIDogdGhpcy5vcHRpb25zLnNjYWxlQmVnaW5BdFplcm8sXG5cdFx0XHRcdGludGVnZXJzT25seSA6IHRoaXMub3B0aW9ucy5zY2FsZUludGVnZXJzT25seSxcblx0XHRcdFx0Y2FsY3VsYXRlWVJhbmdlIDogZnVuY3Rpb24oY3VycmVudEhlaWdodCl7XG5cdFx0XHRcdFx0dmFyIHVwZGF0ZWRSYW5nZXMgPSBoZWxwZXJzLmNhbGN1bGF0ZVNjYWxlUmFuZ2UoXG5cdFx0XHRcdFx0XHRkYXRhVG90YWwoKSxcblx0XHRcdFx0XHRcdGN1cnJlbnRIZWlnaHQsXG5cdFx0XHRcdFx0XHR0aGlzLmZvbnRTaXplLFxuXHRcdFx0XHRcdFx0dGhpcy5iZWdpbkF0WmVybyxcblx0XHRcdFx0XHRcdHRoaXMuaW50ZWdlcnNPbmx5XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRoZWxwZXJzLmV4dGVuZCh0aGlzLCB1cGRhdGVkUmFuZ2VzKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0eExhYmVscyA6IGxhYmVscyxcblx0XHRcdFx0Zm9udCA6IGhlbHBlcnMuZm9udFN0cmluZyh0aGlzLm9wdGlvbnMuc2NhbGVGb250U2l6ZSwgdGhpcy5vcHRpb25zLnNjYWxlRm9udFN0eWxlLCB0aGlzLm9wdGlvbnMuc2NhbGVGb250RmFtaWx5KSxcblx0XHRcdFx0bGluZVdpZHRoIDogdGhpcy5vcHRpb25zLnNjYWxlTGluZVdpZHRoLFxuXHRcdFx0XHRsaW5lQ29sb3IgOiB0aGlzLm9wdGlvbnMuc2NhbGVMaW5lQ29sb3IsXG5cdFx0XHRcdHNob3dIb3Jpem9udGFsTGluZXMgOiB0aGlzLm9wdGlvbnMuc2NhbGVTaG93SG9yaXpvbnRhbExpbmVzLFxuXHRcdFx0XHRzaG93VmVydGljYWxMaW5lcyA6IHRoaXMub3B0aW9ucy5zY2FsZVNob3dWZXJ0aWNhbExpbmVzLFxuXHRcdFx0XHRncmlkTGluZVdpZHRoIDogKHRoaXMub3B0aW9ucy5zY2FsZVNob3dHcmlkTGluZXMpID8gdGhpcy5vcHRpb25zLnNjYWxlR3JpZExpbmVXaWR0aCA6IDAsXG5cdFx0XHRcdGdyaWRMaW5lQ29sb3IgOiAodGhpcy5vcHRpb25zLnNjYWxlU2hvd0dyaWRMaW5lcykgPyB0aGlzLm9wdGlvbnMuc2NhbGVHcmlkTGluZUNvbG9yIDogXCJyZ2JhKDAsMCwwLDApXCIsXG5cdFx0XHRcdHBhZGRpbmc6ICh0aGlzLm9wdGlvbnMuc2hvd1NjYWxlKSA/IDAgOiB0aGlzLm9wdGlvbnMucG9pbnREb3RSYWRpdXMgKyB0aGlzLm9wdGlvbnMucG9pbnREb3RTdHJva2VXaWR0aCxcblx0XHRcdFx0c2hvd0xhYmVscyA6IHRoaXMub3B0aW9ucy5zY2FsZVNob3dMYWJlbHMsXG5cdFx0XHRcdGRpc3BsYXkgOiB0aGlzLm9wdGlvbnMuc2hvd1NjYWxlXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLnNjYWxlT3ZlcnJpZGUpe1xuXHRcdFx0XHRoZWxwZXJzLmV4dGVuZChzY2FsZU9wdGlvbnMsIHtcblx0XHRcdFx0XHRjYWxjdWxhdGVZUmFuZ2U6IGhlbHBlcnMubm9vcCxcblx0XHRcdFx0XHRzdGVwczogdGhpcy5vcHRpb25zLnNjYWxlU3RlcHMsXG5cdFx0XHRcdFx0c3RlcFZhbHVlOiB0aGlzLm9wdGlvbnMuc2NhbGVTdGVwV2lkdGgsXG5cdFx0XHRcdFx0bWluOiB0aGlzLm9wdGlvbnMuc2NhbGVTdGFydFZhbHVlLFxuXHRcdFx0XHRcdG1heDogdGhpcy5vcHRpb25zLnNjYWxlU3RhcnRWYWx1ZSArICh0aGlzLm9wdGlvbnMuc2NhbGVTdGVwcyAqIHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBXaWR0aClcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblxuXHRcdFx0dGhpcy5zY2FsZSA9IG5ldyBDaGFydC5TY2FsZShzY2FsZU9wdGlvbnMpO1xuXHRcdH0sXG5cdFx0YWRkRGF0YSA6IGZ1bmN0aW9uKHZhbHVlc0FycmF5LGxhYmVsKXtcblx0XHRcdC8vTWFwIHRoZSB2YWx1ZXMgYXJyYXkgZm9yIGVhY2ggb2YgdGhlIGRhdGFzZXRzXG5cblx0XHRcdGhlbHBlcnMuZWFjaCh2YWx1ZXNBcnJheSxmdW5jdGlvbih2YWx1ZSxkYXRhc2V0SW5kZXgpe1xuXHRcdFx0XHQvL0FkZCBhIG5ldyBwb2ludCBmb3IgZWFjaCBwaWVjZSBvZiBkYXRhLCBwYXNzaW5nIGFueSByZXF1aXJlZCBkYXRhIHRvIGRyYXcuXG5cdFx0XHRcdHRoaXMuZGF0YXNldHNbZGF0YXNldEluZGV4XS5wb2ludHMucHVzaChuZXcgdGhpcy5Qb2ludENsYXNzKHtcblx0XHRcdFx0XHR2YWx1ZSA6IHZhbHVlLFxuXHRcdFx0XHRcdGxhYmVsIDogbGFiZWwsXG5cdFx0XHRcdFx0eDogdGhpcy5zY2FsZS5jYWxjdWxhdGVYKHRoaXMuc2NhbGUudmFsdWVzQ291bnQrMSksXG5cdFx0XHRcdFx0eTogdGhpcy5zY2FsZS5lbmRQb2ludCxcblx0XHRcdFx0XHRzdHJva2VDb2xvciA6IHRoaXMuZGF0YXNldHNbZGF0YXNldEluZGV4XS5wb2ludFN0cm9rZUNvbG9yLFxuXHRcdFx0XHRcdGZpbGxDb2xvciA6IHRoaXMuZGF0YXNldHNbZGF0YXNldEluZGV4XS5wb2ludENvbG9yXG5cdFx0XHRcdH0pKTtcblx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdHRoaXMuc2NhbGUuYWRkWExhYmVsKGxhYmVsKTtcblx0XHRcdC8vVGhlbiByZS1yZW5kZXIgdGhlIGNoYXJ0LlxuXHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHR9LFxuXHRcdHJlbW92ZURhdGEgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5zY2FsZS5yZW1vdmVYTGFiZWwoKTtcblx0XHRcdC8vVGhlbiByZS1yZW5kZXIgdGhlIGNoYXJ0LlxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCl7XG5cdFx0XHRcdGRhdGFzZXQucG9pbnRzLnNoaWZ0KCk7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHR9LFxuXHRcdHJlZmxvdyA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgbmV3U2NhbGVQcm9wcyA9IGhlbHBlcnMuZXh0ZW5kKHtcblx0XHRcdFx0aGVpZ2h0IDogdGhpcy5jaGFydC5oZWlnaHQsXG5cdFx0XHRcdHdpZHRoIDogdGhpcy5jaGFydC53aWR0aFxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnNjYWxlLnVwZGF0ZShuZXdTY2FsZVByb3BzKTtcblx0XHR9LFxuXHRcdGRyYXcgOiBmdW5jdGlvbihlYXNlKXtcblx0XHRcdHZhciBlYXNpbmdEZWNpbWFsID0gZWFzZSB8fCAxO1xuXHRcdFx0dGhpcy5jbGVhcigpO1xuXG5cdFx0XHR2YXIgY3R4ID0gdGhpcy5jaGFydC5jdHg7XG5cblx0XHRcdC8vIFNvbWUgaGVscGVyIG1ldGhvZHMgZm9yIGdldHRpbmcgdGhlIG5leHQvcHJldiBwb2ludHNcblx0XHRcdHZhciBoYXNWYWx1ZSA9IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHRyZXR1cm4gaXRlbS52YWx1ZSAhPT0gbnVsbDtcblx0XHRcdH0sXG5cdFx0XHRuZXh0UG9pbnQgPSBmdW5jdGlvbihwb2ludCwgY29sbGVjdGlvbiwgaW5kZXgpe1xuXHRcdFx0XHRyZXR1cm4gaGVscGVycy5maW5kTmV4dFdoZXJlKGNvbGxlY3Rpb24sIGhhc1ZhbHVlLCBpbmRleCkgfHwgcG9pbnQ7XG5cdFx0XHR9LFxuXHRcdFx0cHJldmlvdXNQb2ludCA9IGZ1bmN0aW9uKHBvaW50LCBjb2xsZWN0aW9uLCBpbmRleCl7XG5cdFx0XHRcdHJldHVybiBoZWxwZXJzLmZpbmRQcmV2aW91c1doZXJlKGNvbGxlY3Rpb24sIGhhc1ZhbHVlLCBpbmRleCkgfHwgcG9pbnQ7XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLnNjYWxlLmRyYXcoZWFzaW5nRGVjaW1hbCk7XG5cblxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCl7XG5cdFx0XHRcdHZhciBwb2ludHNXaXRoVmFsdWVzID0gaGVscGVycy53aGVyZShkYXRhc2V0LnBvaW50cywgaGFzVmFsdWUpO1xuXG5cdFx0XHRcdC8vVHJhbnNpdGlvbiBlYWNoIHBvaW50IGZpcnN0IHNvIHRoYXQgdGhlIGxpbmUgYW5kIHBvaW50IGRyYXdpbmcgaXNuJ3Qgb3V0IG9mIHN5bmNcblx0XHRcdFx0Ly9XZSBjYW4gdXNlIHRoaXMgZXh0cmEgbG9vcCB0byBjYWxjdWxhdGUgdGhlIGNvbnRyb2wgcG9pbnRzIG9mIHRoaXMgZGF0YXNldCBhbHNvIGluIHRoaXMgbG9vcFxuXG5cdFx0XHRcdGhlbHBlcnMuZWFjaChkYXRhc2V0LnBvaW50cywgZnVuY3Rpb24ocG9pbnQsIGluZGV4KXtcblx0XHRcdFx0XHRpZiAocG9pbnQuaGFzVmFsdWUoKSl7XG5cdFx0XHRcdFx0XHRwb2ludC50cmFuc2l0aW9uKHtcblx0XHRcdFx0XHRcdFx0eSA6IHRoaXMuc2NhbGUuY2FsY3VsYXRlWShwb2ludC52YWx1ZSksXG5cdFx0XHRcdFx0XHRcdHggOiB0aGlzLnNjYWxlLmNhbGN1bGF0ZVgoaW5kZXgpXG5cdFx0XHRcdFx0XHR9LCBlYXNpbmdEZWNpbWFsKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sdGhpcyk7XG5cblxuXHRcdFx0XHQvLyBDb250cm9sIHBvaW50cyBuZWVkIHRvIGJlIGNhbGN1bGF0ZWQgaW4gYSBzZXBlcmF0ZSBsb29wLCBiZWNhdXNlIHdlIG5lZWQgdG8ga25vdyB0aGUgY3VycmVudCB4L3kgb2YgdGhlIHBvaW50XG5cdFx0XHRcdC8vIFRoaXMgd291bGQgY2F1c2UgaXNzdWVzIHdoZW4gdGhlcmUgaXMgbm8gYW5pbWF0aW9uLCBiZWNhdXNlIHRoZSB5IG9mIHRoZSBuZXh0IHBvaW50IHdvdWxkIGJlIDAsIHNvIGJlemllcnMgd291bGQgYmUgc2tld2VkXG5cdFx0XHRcdGlmICh0aGlzLm9wdGlvbnMuYmV6aWVyQ3VydmUpe1xuXHRcdFx0XHRcdGhlbHBlcnMuZWFjaChwb2ludHNXaXRoVmFsdWVzLCBmdW5jdGlvbihwb2ludCwgaW5kZXgpe1xuXHRcdFx0XHRcdFx0dmFyIHRlbnNpb24gPSAoaW5kZXggPiAwICYmIGluZGV4IDwgcG9pbnRzV2l0aFZhbHVlcy5sZW5ndGggLSAxKSA/IHRoaXMub3B0aW9ucy5iZXppZXJDdXJ2ZVRlbnNpb24gOiAwO1xuXHRcdFx0XHRcdFx0cG9pbnQuY29udHJvbFBvaW50cyA9IGhlbHBlcnMuc3BsaW5lQ3VydmUoXG5cdFx0XHRcdFx0XHRcdHByZXZpb3VzUG9pbnQocG9pbnQsIHBvaW50c1dpdGhWYWx1ZXMsIGluZGV4KSxcblx0XHRcdFx0XHRcdFx0cG9pbnQsXG5cdFx0XHRcdFx0XHRcdG5leHRQb2ludChwb2ludCwgcG9pbnRzV2l0aFZhbHVlcywgaW5kZXgpLFxuXHRcdFx0XHRcdFx0XHR0ZW5zaW9uXG5cdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0XHQvLyBQcmV2ZW50IHRoZSBiZXppZXIgZ29pbmcgb3V0c2lkZSBvZiB0aGUgYm91bmRzIG9mIHRoZSBncmFwaFxuXG5cdFx0XHRcdFx0XHQvLyBDYXAgcHV0ZXIgYmV6aWVyIGhhbmRsZXMgdG8gdGhlIHVwcGVyL2xvd2VyIHNjYWxlIGJvdW5kc1xuXHRcdFx0XHRcdFx0aWYgKHBvaW50LmNvbnRyb2xQb2ludHMub3V0ZXIueSA+IHRoaXMuc2NhbGUuZW5kUG9pbnQpe1xuXHRcdFx0XHRcdFx0XHRwb2ludC5jb250cm9sUG9pbnRzLm91dGVyLnkgPSB0aGlzLnNjYWxlLmVuZFBvaW50O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAocG9pbnQuY29udHJvbFBvaW50cy5vdXRlci55IDwgdGhpcy5zY2FsZS5zdGFydFBvaW50KXtcblx0XHRcdFx0XHRcdFx0cG9pbnQuY29udHJvbFBvaW50cy5vdXRlci55ID0gdGhpcy5zY2FsZS5zdGFydFBvaW50O1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBDYXAgaW5uZXIgYmV6aWVyIGhhbmRsZXMgdG8gdGhlIHVwcGVyL2xvd2VyIHNjYWxlIGJvdW5kc1xuXHRcdFx0XHRcdFx0aWYgKHBvaW50LmNvbnRyb2xQb2ludHMuaW5uZXIueSA+IHRoaXMuc2NhbGUuZW5kUG9pbnQpe1xuXHRcdFx0XHRcdFx0XHRwb2ludC5jb250cm9sUG9pbnRzLmlubmVyLnkgPSB0aGlzLnNjYWxlLmVuZFBvaW50O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAocG9pbnQuY29udHJvbFBvaW50cy5pbm5lci55IDwgdGhpcy5zY2FsZS5zdGFydFBvaW50KXtcblx0XHRcdFx0XHRcdFx0cG9pbnQuY29udHJvbFBvaW50cy5pbm5lci55ID0gdGhpcy5zY2FsZS5zdGFydFBvaW50O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sdGhpcyk7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdC8vRHJhdyB0aGUgbGluZSBiZXR3ZWVuIGFsbCB0aGUgcG9pbnRzXG5cdFx0XHRcdGN0eC5saW5lV2lkdGggPSB0aGlzLm9wdGlvbnMuZGF0YXNldFN0cm9rZVdpZHRoO1xuXHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSBkYXRhc2V0LnN0cm9rZUNvbG9yO1xuXHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cblx0XHRcdFx0aGVscGVycy5lYWNoKHBvaW50c1dpdGhWYWx1ZXMsIGZ1bmN0aW9uKHBvaW50LCBpbmRleCl7XG5cdFx0XHRcdFx0aWYgKGluZGV4ID09PSAwKXtcblx0XHRcdFx0XHRcdGN0eC5tb3ZlVG8ocG9pbnQueCwgcG9pbnQueSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRpZih0aGlzLm9wdGlvbnMuYmV6aWVyQ3VydmUpe1xuXHRcdFx0XHRcdFx0XHR2YXIgcHJldmlvdXMgPSBwcmV2aW91c1BvaW50KHBvaW50LCBwb2ludHNXaXRoVmFsdWVzLCBpbmRleCk7XG5cblx0XHRcdFx0XHRcdFx0Y3R4LmJlemllckN1cnZlVG8oXG5cdFx0XHRcdFx0XHRcdFx0cHJldmlvdXMuY29udHJvbFBvaW50cy5vdXRlci54LFxuXHRcdFx0XHRcdFx0XHRcdHByZXZpb3VzLmNvbnRyb2xQb2ludHMub3V0ZXIueSxcblx0XHRcdFx0XHRcdFx0XHRwb2ludC5jb250cm9sUG9pbnRzLmlubmVyLngsXG5cdFx0XHRcdFx0XHRcdFx0cG9pbnQuY29udHJvbFBvaW50cy5pbm5lci55LFxuXHRcdFx0XHRcdFx0XHRcdHBvaW50LngsXG5cdFx0XHRcdFx0XHRcdFx0cG9pbnQueVxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0Y3R4LmxpbmVUbyhwb2ludC54LHBvaW50LnkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgdGhpcyk7XG5cblx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXG5cdFx0XHRcdGlmICh0aGlzLm9wdGlvbnMuZGF0YXNldEZpbGwgJiYgcG9pbnRzV2l0aFZhbHVlcy5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHQvL1JvdW5kIG9mZiB0aGUgbGluZSBieSBnb2luZyB0byB0aGUgYmFzZSBvZiB0aGUgY2hhcnQsIGJhY2sgdG8gdGhlIHN0YXJ0LCB0aGVuIGZpbGwuXG5cdFx0XHRcdFx0Y3R4LmxpbmVUbyhwb2ludHNXaXRoVmFsdWVzW3BvaW50c1dpdGhWYWx1ZXMubGVuZ3RoIC0gMV0ueCwgdGhpcy5zY2FsZS5lbmRQb2ludCk7XG5cdFx0XHRcdFx0Y3R4LmxpbmVUbyhwb2ludHNXaXRoVmFsdWVzWzBdLngsIHRoaXMuc2NhbGUuZW5kUG9pbnQpO1xuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSBkYXRhc2V0LmZpbGxDb2xvcjtcblx0XHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vTm93IGRyYXcgdGhlIHBvaW50cyBvdmVyIHRoZSBsaW5lXG5cdFx0XHRcdC8vQSBsaXR0bGUgaW5lZmZpY2llbnQgZG91YmxlIGxvb3BpbmcsIGJ1dCBiZXR0ZXIgdGhhbiB0aGUgbGluZVxuXHRcdFx0XHQvL2xhZ2dpbmcgYmVoaW5kIHRoZSBwb2ludCBwb3NpdGlvbnNcblx0XHRcdFx0aGVscGVycy5lYWNoKHBvaW50c1dpdGhWYWx1ZXMsZnVuY3Rpb24ocG9pbnQpe1xuXHRcdFx0XHRcdHBvaW50LmRyYXcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdH1cblx0fSk7XG5cblxufSkuY2FsbCh0aGlzKTtcblxuKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciByb290ID0gdGhpcyxcblx0XHRDaGFydCA9IHJvb3QuQ2hhcnQsXG5cdFx0Ly9DYWNoZSBhIGxvY2FsIHJlZmVyZW5jZSB0byBDaGFydC5oZWxwZXJzXG5cdFx0aGVscGVycyA9IENoYXJ0LmhlbHBlcnM7XG5cblx0dmFyIGRlZmF1bHRDb25maWcgPSB7XG5cdFx0Ly9Cb29sZWFuIC0gU2hvdyBhIGJhY2tkcm9wIHRvIHRoZSBzY2FsZSBsYWJlbFxuXHRcdHNjYWxlU2hvd0xhYmVsQmFja2Ryb3AgOiB0cnVlLFxuXG5cdFx0Ly9TdHJpbmcgLSBUaGUgY29sb3VyIG9mIHRoZSBsYWJlbCBiYWNrZHJvcFxuXHRcdHNjYWxlQmFja2Ryb3BDb2xvciA6IFwicmdiYSgyNTUsMjU1LDI1NSwwLjc1KVwiLFxuXG5cdFx0Ly8gQm9vbGVhbiAtIFdoZXRoZXIgdGhlIHNjYWxlIHNob3VsZCBiZWdpbiBhdCB6ZXJvXG5cdFx0c2NhbGVCZWdpbkF0WmVybyA6IHRydWUsXG5cblx0XHQvL051bWJlciAtIFRoZSBiYWNrZHJvcCBwYWRkaW5nIGFib3ZlICYgYmVsb3cgdGhlIGxhYmVsIGluIHBpeGVsc1xuXHRcdHNjYWxlQmFja2Ryb3BQYWRkaW5nWSA6IDIsXG5cblx0XHQvL051bWJlciAtIFRoZSBiYWNrZHJvcCBwYWRkaW5nIHRvIHRoZSBzaWRlIG9mIHRoZSBsYWJlbCBpbiBwaXhlbHNcblx0XHRzY2FsZUJhY2tkcm9wUGFkZGluZ1ggOiAyLFxuXG5cdFx0Ly9Cb29sZWFuIC0gU2hvdyBsaW5lIGZvciBlYWNoIHZhbHVlIGluIHRoZSBzY2FsZVxuXHRcdHNjYWxlU2hvd0xpbmUgOiB0cnVlLFxuXG5cdFx0Ly9Cb29sZWFuIC0gU3Ryb2tlIGEgbGluZSBhcm91bmQgZWFjaCBzZWdtZW50IGluIHRoZSBjaGFydFxuXHRcdHNlZ21lbnRTaG93U3Ryb2tlIDogdHJ1ZSxcblxuXHRcdC8vU3RyaW5nIC0gVGhlIGNvbG91ciBvZiB0aGUgc3Ryb2tlIG9uIGVhY2ggc2VnZW1lbnQuXG5cdFx0c2VnbWVudFN0cm9rZUNvbG9yIDogXCIjZmZmXCIsXG5cblx0XHQvL051bWJlciAtIFRoZSB3aWR0aCBvZiB0aGUgc3Ryb2tlIHZhbHVlIGluIHBpeGVsc1xuXHRcdHNlZ21lbnRTdHJva2VXaWR0aCA6IDIsXG5cblx0XHQvL051bWJlciAtIEFtb3VudCBvZiBhbmltYXRpb24gc3RlcHNcblx0XHRhbmltYXRpb25TdGVwcyA6IDEwMCxcblxuXHRcdC8vU3RyaW5nIC0gQW5pbWF0aW9uIGVhc2luZyBlZmZlY3QuXG5cdFx0YW5pbWF0aW9uRWFzaW5nIDogXCJlYXNlT3V0Qm91bmNlXCIsXG5cblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIGFuaW1hdGUgdGhlIHJvdGF0aW9uIG9mIHRoZSBjaGFydFxuXHRcdGFuaW1hdGVSb3RhdGUgOiB0cnVlLFxuXG5cdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB0byBhbmltYXRlIHNjYWxpbmcgdGhlIGNoYXJ0IGZyb20gdGhlIGNlbnRyZVxuXHRcdGFuaW1hdGVTY2FsZSA6IGZhbHNlLFxuXG5cdFx0Ly9TdHJpbmcgLSBBIGxlZ2VuZCB0ZW1wbGF0ZVxuXHRcdGxlZ2VuZFRlbXBsYXRlIDogXCI8dWwgY2xhc3M9XFxcIjwlPW5hbWUudG9Mb3dlckNhc2UoKSU+LWxlZ2VuZFxcXCI+PCUgZm9yICh2YXIgaT0wOyBpPHNlZ21lbnRzLmxlbmd0aDsgaSsrKXslPjxsaT48c3BhbiBzdHlsZT1cXFwiYmFja2dyb3VuZC1jb2xvcjo8JT1zZWdtZW50c1tpXS5maWxsQ29sb3IlPlxcXCI+PC9zcGFuPjwlaWYoc2VnbWVudHNbaV0ubGFiZWwpeyU+PCU9c2VnbWVudHNbaV0ubGFiZWwlPjwlfSU+PC9saT48JX0lPjwvdWw+XCJcblx0fTtcblxuXG5cdENoYXJ0LlR5cGUuZXh0ZW5kKHtcblx0XHQvL1Bhc3NpbmcgaW4gYSBuYW1lIHJlZ2lzdGVycyB0aGlzIGNoYXJ0IGluIHRoZSBDaGFydCBuYW1lc3BhY2Vcblx0XHRuYW1lOiBcIlBvbGFyQXJlYVwiLFxuXHRcdC8vUHJvdmlkaW5nIGEgZGVmYXVsdHMgd2lsbCBhbHNvIHJlZ2lzdGVyIHRoZSBkZWFmdWx0cyBpbiB0aGUgY2hhcnQgbmFtZXNwYWNlXG5cdFx0ZGVmYXVsdHMgOiBkZWZhdWx0Q29uZmlnLFxuXHRcdC8vSW5pdGlhbGl6ZSBpcyBmaXJlZCB3aGVuIHRoZSBjaGFydCBpcyBpbml0aWFsaXplZCAtIERhdGEgaXMgcGFzc2VkIGluIGFzIGEgcGFyYW1ldGVyXG5cdFx0Ly9Db25maWcgaXMgYXV0b21hdGljYWxseSBtZXJnZWQgYnkgdGhlIGNvcmUgb2YgQ2hhcnQuanMsIGFuZCBpcyBhdmFpbGFibGUgYXQgdGhpcy5vcHRpb25zXG5cdFx0aW5pdGlhbGl6ZTogIGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0dGhpcy5zZWdtZW50cyA9IFtdO1xuXHRcdFx0Ly9EZWNsYXJlIHNlZ21lbnQgY2xhc3MgYXMgYSBjaGFydCBpbnN0YW5jZSBzcGVjaWZpYyBjbGFzcywgc28gaXQgY2FuIHNoYXJlIHByb3BzIGZvciB0aGlzIGluc3RhbmNlXG5cdFx0XHR0aGlzLlNlZ21lbnRBcmMgPSBDaGFydC5BcmMuZXh0ZW5kKHtcblx0XHRcdFx0c2hvd1N0cm9rZSA6IHRoaXMub3B0aW9ucy5zZWdtZW50U2hvd1N0cm9rZSxcblx0XHRcdFx0c3Ryb2tlV2lkdGggOiB0aGlzLm9wdGlvbnMuc2VnbWVudFN0cm9rZVdpZHRoLFxuXHRcdFx0XHRzdHJva2VDb2xvciA6IHRoaXMub3B0aW9ucy5zZWdtZW50U3Ryb2tlQ29sb3IsXG5cdFx0XHRcdGN0eCA6IHRoaXMuY2hhcnQuY3R4LFxuXHRcdFx0XHRpbm5lclJhZGl1cyA6IDAsXG5cdFx0XHRcdHggOiB0aGlzLmNoYXJ0LndpZHRoLzIsXG5cdFx0XHRcdHkgOiB0aGlzLmNoYXJ0LmhlaWdodC8yXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuc2NhbGUgPSBuZXcgQ2hhcnQuUmFkaWFsU2NhbGUoe1xuXHRcdFx0XHRkaXNwbGF5OiB0aGlzLm9wdGlvbnMuc2hvd1NjYWxlLFxuXHRcdFx0XHRmb250U3R5bGU6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTdHlsZSxcblx0XHRcdFx0Zm9udFNpemU6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTaXplLFxuXHRcdFx0XHRmb250RmFtaWx5OiB0aGlzLm9wdGlvbnMuc2NhbGVGb250RmFtaWx5LFxuXHRcdFx0XHRmb250Q29sb3I6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRDb2xvcixcblx0XHRcdFx0c2hvd0xhYmVsczogdGhpcy5vcHRpb25zLnNjYWxlU2hvd0xhYmVscyxcblx0XHRcdFx0c2hvd0xhYmVsQmFja2Ryb3A6IHRoaXMub3B0aW9ucy5zY2FsZVNob3dMYWJlbEJhY2tkcm9wLFxuXHRcdFx0XHRiYWNrZHJvcENvbG9yOiB0aGlzLm9wdGlvbnMuc2NhbGVCYWNrZHJvcENvbG9yLFxuXHRcdFx0XHRiYWNrZHJvcFBhZGRpbmdZIDogdGhpcy5vcHRpb25zLnNjYWxlQmFja2Ryb3BQYWRkaW5nWSxcblx0XHRcdFx0YmFja2Ryb3BQYWRkaW5nWDogdGhpcy5vcHRpb25zLnNjYWxlQmFja2Ryb3BQYWRkaW5nWCxcblx0XHRcdFx0bGluZVdpZHRoOiAodGhpcy5vcHRpb25zLnNjYWxlU2hvd0xpbmUpID8gdGhpcy5vcHRpb25zLnNjYWxlTGluZVdpZHRoIDogMCxcblx0XHRcdFx0bGluZUNvbG9yOiB0aGlzLm9wdGlvbnMuc2NhbGVMaW5lQ29sb3IsXG5cdFx0XHRcdGxpbmVBcmM6IHRydWUsXG5cdFx0XHRcdHdpZHRoOiB0aGlzLmNoYXJ0LndpZHRoLFxuXHRcdFx0XHRoZWlnaHQ6IHRoaXMuY2hhcnQuaGVpZ2h0LFxuXHRcdFx0XHR4Q2VudGVyOiB0aGlzLmNoYXJ0LndpZHRoLzIsXG5cdFx0XHRcdHlDZW50ZXI6IHRoaXMuY2hhcnQuaGVpZ2h0LzIsXG5cdFx0XHRcdGN0eCA6IHRoaXMuY2hhcnQuY3R4LFxuXHRcdFx0XHR0ZW1wbGF0ZVN0cmluZzogdGhpcy5vcHRpb25zLnNjYWxlTGFiZWwsXG5cdFx0XHRcdHZhbHVlc0NvdW50OiBkYXRhLmxlbmd0aFxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMudXBkYXRlU2NhbGVSYW5nZShkYXRhKTtcblxuXHRcdFx0dGhpcy5zY2FsZS51cGRhdGUoKTtcblxuXHRcdFx0aGVscGVycy5lYWNoKGRhdGEsZnVuY3Rpb24oc2VnbWVudCxpbmRleCl7XG5cdFx0XHRcdHRoaXMuYWRkRGF0YShzZWdtZW50LGluZGV4LHRydWUpO1xuXHRcdFx0fSx0aGlzKTtcblxuXHRcdFx0Ly9TZXQgdXAgdG9vbHRpcCBldmVudHMgb24gdGhlIGNoYXJ0XG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLnNob3dUb29sdGlwcyl7XG5cdFx0XHRcdGhlbHBlcnMuYmluZEV2ZW50cyh0aGlzLCB0aGlzLm9wdGlvbnMudG9vbHRpcEV2ZW50cywgZnVuY3Rpb24oZXZ0KXtcblx0XHRcdFx0XHR2YXIgYWN0aXZlU2VnbWVudHMgPSAoZXZ0LnR5cGUgIT09ICdtb3VzZW91dCcpID8gdGhpcy5nZXRTZWdtZW50c0F0RXZlbnQoZXZ0KSA6IFtdO1xuXHRcdFx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLnNlZ21lbnRzLGZ1bmN0aW9uKHNlZ21lbnQpe1xuXHRcdFx0XHRcdFx0c2VnbWVudC5yZXN0b3JlKFtcImZpbGxDb2xvclwiXSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0aGVscGVycy5lYWNoKGFjdGl2ZVNlZ21lbnRzLGZ1bmN0aW9uKGFjdGl2ZVNlZ21lbnQpe1xuXHRcdFx0XHRcdFx0YWN0aXZlU2VnbWVudC5maWxsQ29sb3IgPSBhY3RpdmVTZWdtZW50LmhpZ2hsaWdodENvbG9yO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHRoaXMuc2hvd1Rvb2x0aXAoYWN0aXZlU2VnbWVudHMpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9LFxuXHRcdGdldFNlZ21lbnRzQXRFdmVudCA6IGZ1bmN0aW9uKGUpe1xuXHRcdFx0dmFyIHNlZ21lbnRzQXJyYXkgPSBbXTtcblxuXHRcdFx0dmFyIGxvY2F0aW9uID0gaGVscGVycy5nZXRSZWxhdGl2ZVBvc2l0aW9uKGUpO1xuXG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5zZWdtZW50cyxmdW5jdGlvbihzZWdtZW50KXtcblx0XHRcdFx0aWYgKHNlZ21lbnQuaW5SYW5nZShsb2NhdGlvbi54LGxvY2F0aW9uLnkpKSBzZWdtZW50c0FycmF5LnB1c2goc2VnbWVudCk7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdFx0cmV0dXJuIHNlZ21lbnRzQXJyYXk7XG5cdFx0fSxcblx0XHRhZGREYXRhIDogZnVuY3Rpb24oc2VnbWVudCwgYXRJbmRleCwgc2lsZW50KXtcblx0XHRcdHZhciBpbmRleCA9IGF0SW5kZXggfHwgdGhpcy5zZWdtZW50cy5sZW5ndGg7XG5cblx0XHRcdHRoaXMuc2VnbWVudHMuc3BsaWNlKGluZGV4LCAwLCBuZXcgdGhpcy5TZWdtZW50QXJjKHtcblx0XHRcdFx0ZmlsbENvbG9yOiBzZWdtZW50LmNvbG9yLFxuXHRcdFx0XHRoaWdobGlnaHRDb2xvcjogc2VnbWVudC5oaWdobGlnaHQgfHwgc2VnbWVudC5jb2xvcixcblx0XHRcdFx0bGFiZWw6IHNlZ21lbnQubGFiZWwsXG5cdFx0XHRcdHZhbHVlOiBzZWdtZW50LnZhbHVlLFxuXHRcdFx0XHRvdXRlclJhZGl1czogKHRoaXMub3B0aW9ucy5hbmltYXRlU2NhbGUpID8gMCA6IHRoaXMuc2NhbGUuY2FsY3VsYXRlQ2VudGVyT2Zmc2V0KHNlZ21lbnQudmFsdWUpLFxuXHRcdFx0XHRjaXJjdW1mZXJlbmNlOiAodGhpcy5vcHRpb25zLmFuaW1hdGVSb3RhdGUpID8gMCA6IHRoaXMuc2NhbGUuZ2V0Q2lyY3VtZmVyZW5jZSgpLFxuXHRcdFx0XHRzdGFydEFuZ2xlOiBNYXRoLlBJICogMS41XG5cdFx0XHR9KSk7XG5cdFx0XHRpZiAoIXNpbGVudCl7XG5cdFx0XHRcdHRoaXMucmVmbG93KCk7XG5cdFx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZW1vdmVEYXRhOiBmdW5jdGlvbihhdEluZGV4KXtcblx0XHRcdHZhciBpbmRleFRvRGVsZXRlID0gKGhlbHBlcnMuaXNOdW1iZXIoYXRJbmRleCkpID8gYXRJbmRleCA6IHRoaXMuc2VnbWVudHMubGVuZ3RoLTE7XG5cdFx0XHR0aGlzLnNlZ21lbnRzLnNwbGljZShpbmRleFRvRGVsZXRlLCAxKTtcblx0XHRcdHRoaXMucmVmbG93KCk7XG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdH0sXG5cdFx0Y2FsY3VsYXRlVG90YWw6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0dGhpcy50b3RhbCA9IDA7XG5cdFx0XHRoZWxwZXJzLmVhY2goZGF0YSxmdW5jdGlvbihzZWdtZW50KXtcblx0XHRcdFx0dGhpcy50b3RhbCArPSBzZWdtZW50LnZhbHVlO1xuXHRcdFx0fSx0aGlzKTtcblx0XHRcdHRoaXMuc2NhbGUudmFsdWVzQ291bnQgPSB0aGlzLnNlZ21lbnRzLmxlbmd0aDtcblx0XHR9LFxuXHRcdHVwZGF0ZVNjYWxlUmFuZ2U6IGZ1bmN0aW9uKGRhdGFwb2ludHMpe1xuXHRcdFx0dmFyIHZhbHVlc0FycmF5ID0gW107XG5cdFx0XHRoZWxwZXJzLmVhY2goZGF0YXBvaW50cyxmdW5jdGlvbihzZWdtZW50KXtcblx0XHRcdFx0dmFsdWVzQXJyYXkucHVzaChzZWdtZW50LnZhbHVlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHR2YXIgc2NhbGVTaXplcyA9ICh0aGlzLm9wdGlvbnMuc2NhbGVPdmVycmlkZSkgP1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3RlcHM6IHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBzLFxuXHRcdFx0XHRcdHN0ZXBWYWx1ZTogdGhpcy5vcHRpb25zLnNjYWxlU3RlcFdpZHRoLFxuXHRcdFx0XHRcdG1pbjogdGhpcy5vcHRpb25zLnNjYWxlU3RhcnRWYWx1ZSxcblx0XHRcdFx0XHRtYXg6IHRoaXMub3B0aW9ucy5zY2FsZVN0YXJ0VmFsdWUgKyAodGhpcy5vcHRpb25zLnNjYWxlU3RlcHMgKiB0aGlzLm9wdGlvbnMuc2NhbGVTdGVwV2lkdGgpXG5cdFx0XHRcdH0gOlxuXHRcdFx0XHRoZWxwZXJzLmNhbGN1bGF0ZVNjYWxlUmFuZ2UoXG5cdFx0XHRcdFx0dmFsdWVzQXJyYXksXG5cdFx0XHRcdFx0aGVscGVycy5taW4oW3RoaXMuY2hhcnQud2lkdGgsIHRoaXMuY2hhcnQuaGVpZ2h0XSkvMixcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMuc2NhbGVGb250U2l6ZSxcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMuc2NhbGVCZWdpbkF0WmVybyxcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMuc2NhbGVJbnRlZ2Vyc09ubHlcblx0XHRcdFx0KTtcblxuXHRcdFx0aGVscGVycy5leHRlbmQoXG5cdFx0XHRcdHRoaXMuc2NhbGUsXG5cdFx0XHRcdHNjYWxlU2l6ZXMsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzaXplOiBoZWxwZXJzLm1pbihbdGhpcy5jaGFydC53aWR0aCwgdGhpcy5jaGFydC5oZWlnaHRdKSxcblx0XHRcdFx0XHR4Q2VudGVyOiB0aGlzLmNoYXJ0LndpZHRoLzIsXG5cdFx0XHRcdFx0eUNlbnRlcjogdGhpcy5jaGFydC5oZWlnaHQvMlxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0fSxcblx0XHR1cGRhdGUgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5jYWxjdWxhdGVUb3RhbCh0aGlzLnNlZ21lbnRzKTtcblxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuc2VnbWVudHMsZnVuY3Rpb24oc2VnbWVudCl7XG5cdFx0XHRcdHNlZ21lbnQuc2F2ZSgpO1xuXHRcdFx0fSk7XG5cdFx0XHRcblx0XHRcdHRoaXMucmVmbG93KCk7XG5cdFx0XHR0aGlzLnJlbmRlcigpO1xuXHRcdH0sXG5cdFx0cmVmbG93IDogZnVuY3Rpb24oKXtcblx0XHRcdGhlbHBlcnMuZXh0ZW5kKHRoaXMuU2VnbWVudEFyYy5wcm90b3R5cGUse1xuXHRcdFx0XHR4IDogdGhpcy5jaGFydC53aWR0aC8yLFxuXHRcdFx0XHR5IDogdGhpcy5jaGFydC5oZWlnaHQvMlxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnVwZGF0ZVNjYWxlUmFuZ2UodGhpcy5zZWdtZW50cyk7XG5cdFx0XHR0aGlzLnNjYWxlLnVwZGF0ZSgpO1xuXG5cdFx0XHRoZWxwZXJzLmV4dGVuZCh0aGlzLnNjYWxlLHtcblx0XHRcdFx0eENlbnRlcjogdGhpcy5jaGFydC53aWR0aC8yLFxuXHRcdFx0XHR5Q2VudGVyOiB0aGlzLmNoYXJ0LmhlaWdodC8yXG5cdFx0XHR9KTtcblxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuc2VnbWVudHMsIGZ1bmN0aW9uKHNlZ21lbnQpe1xuXHRcdFx0XHRzZWdtZW50LnVwZGF0ZSh7XG5cdFx0XHRcdFx0b3V0ZXJSYWRpdXMgOiB0aGlzLnNjYWxlLmNhbGN1bGF0ZUNlbnRlck9mZnNldChzZWdtZW50LnZhbHVlKVxuXHRcdFx0XHR9KTtcblx0XHRcdH0sIHRoaXMpO1xuXG5cdFx0fSxcblx0XHRkcmF3IDogZnVuY3Rpb24oZWFzZSl7XG5cdFx0XHR2YXIgZWFzaW5nRGVjaW1hbCA9IGVhc2UgfHwgMTtcblx0XHRcdC8vQ2xlYXIgJiBkcmF3IHRoZSBjYW52YXNcblx0XHRcdHRoaXMuY2xlYXIoKTtcblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLnNlZ21lbnRzLGZ1bmN0aW9uKHNlZ21lbnQsIGluZGV4KXtcblx0XHRcdFx0c2VnbWVudC50cmFuc2l0aW9uKHtcblx0XHRcdFx0XHRjaXJjdW1mZXJlbmNlIDogdGhpcy5zY2FsZS5nZXRDaXJjdW1mZXJlbmNlKCksXG5cdFx0XHRcdFx0b3V0ZXJSYWRpdXMgOiB0aGlzLnNjYWxlLmNhbGN1bGF0ZUNlbnRlck9mZnNldChzZWdtZW50LnZhbHVlKVxuXHRcdFx0XHR9LGVhc2luZ0RlY2ltYWwpO1xuXG5cdFx0XHRcdHNlZ21lbnQuZW5kQW5nbGUgPSBzZWdtZW50LnN0YXJ0QW5nbGUgKyBzZWdtZW50LmNpcmN1bWZlcmVuY2U7XG5cblx0XHRcdFx0Ly8gSWYgd2UndmUgcmVtb3ZlZCB0aGUgZmlyc3Qgc2VnbWVudCB3ZSBuZWVkIHRvIHNldCB0aGUgZmlyc3Qgb25lIHRvXG5cdFx0XHRcdC8vIHN0YXJ0IGF0IHRoZSB0b3AuXG5cdFx0XHRcdGlmIChpbmRleCA9PT0gMCl7XG5cdFx0XHRcdFx0c2VnbWVudC5zdGFydEFuZ2xlID0gTWF0aC5QSSAqIDEuNTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vQ2hlY2sgdG8gc2VlIGlmIGl0J3MgdGhlIGxhc3Qgc2VnbWVudCwgaWYgbm90IGdldCB0aGUgbmV4dCBhbmQgdXBkYXRlIHRoZSBzdGFydCBhbmdsZVxuXHRcdFx0XHRpZiAoaW5kZXggPCB0aGlzLnNlZ21lbnRzLmxlbmd0aCAtIDEpe1xuXHRcdFx0XHRcdHRoaXMuc2VnbWVudHNbaW5kZXgrMV0uc3RhcnRBbmdsZSA9IHNlZ21lbnQuZW5kQW5nbGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0c2VnbWVudC5kcmF3KCk7XG5cdFx0XHR9LCB0aGlzKTtcblx0XHRcdHRoaXMuc2NhbGUuZHJhdygpO1xuXHRcdH1cblx0fSk7XG5cbn0pLmNhbGwodGhpcyk7XG4oZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIHJvb3QgPSB0aGlzLFxuXHRcdENoYXJ0ID0gcm9vdC5DaGFydCxcblx0XHRoZWxwZXJzID0gQ2hhcnQuaGVscGVycztcblxuXG5cblx0Q2hhcnQuVHlwZS5leHRlbmQoe1xuXHRcdG5hbWU6IFwiUmFkYXJcIixcblx0XHRkZWZhdWx0czp7XG5cdFx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIHNob3cgbGluZXMgZm9yIGVhY2ggc2NhbGUgcG9pbnRcblx0XHRcdHNjYWxlU2hvd0xpbmUgOiB0cnVlLFxuXG5cdFx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHdlIHNob3cgdGhlIGFuZ2xlIGxpbmVzIG91dCBvZiB0aGUgcmFkYXJcblx0XHRcdGFuZ2xlU2hvd0xpbmVPdXQgOiB0cnVlLFxuXG5cdFx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIHNob3cgbGFiZWxzIG9uIHRoZSBzY2FsZVxuXHRcdFx0c2NhbGVTaG93TGFiZWxzIDogZmFsc2UsXG5cblx0XHRcdC8vIEJvb2xlYW4gLSBXaGV0aGVyIHRoZSBzY2FsZSBzaG91bGQgYmVnaW4gYXQgemVyb1xuXHRcdFx0c2NhbGVCZWdpbkF0WmVybyA6IHRydWUsXG5cblx0XHRcdC8vU3RyaW5nIC0gQ29sb3VyIG9mIHRoZSBhbmdsZSBsaW5lXG5cdFx0XHRhbmdsZUxpbmVDb2xvciA6IFwicmdiYSgwLDAsMCwuMSlcIixcblxuXHRcdFx0Ly9OdW1iZXIgLSBQaXhlbCB3aWR0aCBvZiB0aGUgYW5nbGUgbGluZVxuXHRcdFx0YW5nbGVMaW5lV2lkdGggOiAxLFxuXG5cdFx0XHQvL1N0cmluZyAtIFBvaW50IGxhYmVsIGZvbnQgZGVjbGFyYXRpb25cblx0XHRcdHBvaW50TGFiZWxGb250RmFtaWx5IDogXCInQXJpYWwnXCIsXG5cblx0XHRcdC8vU3RyaW5nIC0gUG9pbnQgbGFiZWwgZm9udCB3ZWlnaHRcblx0XHRcdHBvaW50TGFiZWxGb250U3R5bGUgOiBcIm5vcm1hbFwiLFxuXG5cdFx0XHQvL051bWJlciAtIFBvaW50IGxhYmVsIGZvbnQgc2l6ZSBpbiBwaXhlbHNcblx0XHRcdHBvaW50TGFiZWxGb250U2l6ZSA6IDEwLFxuXG5cdFx0XHQvL1N0cmluZyAtIFBvaW50IGxhYmVsIGZvbnQgY29sb3VyXG5cdFx0XHRwb2ludExhYmVsRm9udENvbG9yIDogXCIjNjY2XCIsXG5cblx0XHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdG8gc2hvdyBhIGRvdCBmb3IgZWFjaCBwb2ludFxuXHRcdFx0cG9pbnREb3QgOiB0cnVlLFxuXG5cdFx0XHQvL051bWJlciAtIFJhZGl1cyBvZiBlYWNoIHBvaW50IGRvdCBpbiBwaXhlbHNcblx0XHRcdHBvaW50RG90UmFkaXVzIDogMyxcblxuXHRcdFx0Ly9OdW1iZXIgLSBQaXhlbCB3aWR0aCBvZiBwb2ludCBkb3Qgc3Ryb2tlXG5cdFx0XHRwb2ludERvdFN0cm9rZVdpZHRoIDogMSxcblxuXHRcdFx0Ly9OdW1iZXIgLSBhbW91bnQgZXh0cmEgdG8gYWRkIHRvIHRoZSByYWRpdXMgdG8gY2F0ZXIgZm9yIGhpdCBkZXRlY3Rpb24gb3V0c2lkZSB0aGUgZHJhd24gcG9pbnRcblx0XHRcdHBvaW50SGl0RGV0ZWN0aW9uUmFkaXVzIDogMjAsXG5cblx0XHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdG8gc2hvdyBhIHN0cm9rZSBmb3IgZGF0YXNldHNcblx0XHRcdGRhdGFzZXRTdHJva2UgOiB0cnVlLFxuXG5cdFx0XHQvL051bWJlciAtIFBpeGVsIHdpZHRoIG9mIGRhdGFzZXQgc3Ryb2tlXG5cdFx0XHRkYXRhc2V0U3Ryb2tlV2lkdGggOiAyLFxuXG5cdFx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIGZpbGwgdGhlIGRhdGFzZXQgd2l0aCBhIGNvbG91clxuXHRcdFx0ZGF0YXNldEZpbGwgOiB0cnVlLFxuXG5cdFx0XHQvL1N0cmluZyAtIEEgbGVnZW5kIHRlbXBsYXRlXG5cdFx0XHRsZWdlbmRUZW1wbGF0ZSA6IFwiPHVsIGNsYXNzPVxcXCI8JT1uYW1lLnRvTG93ZXJDYXNlKCklPi1sZWdlbmRcXFwiPjwlIGZvciAodmFyIGk9MDsgaTxkYXRhc2V0cy5sZW5ndGg7IGkrKyl7JT48bGk+PHNwYW4gc3R5bGU9XFxcImJhY2tncm91bmQtY29sb3I6PCU9ZGF0YXNldHNbaV0uc3Ryb2tlQ29sb3IlPlxcXCI+PC9zcGFuPjwlaWYoZGF0YXNldHNbaV0ubGFiZWwpeyU+PCU9ZGF0YXNldHNbaV0ubGFiZWwlPjwlfSU+PC9saT48JX0lPjwvdWw+XCJcblxuXHRcdH0sXG5cblx0XHRpbml0aWFsaXplOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdHRoaXMuUG9pbnRDbGFzcyA9IENoYXJ0LlBvaW50LmV4dGVuZCh7XG5cdFx0XHRcdHN0cm9rZVdpZHRoIDogdGhpcy5vcHRpb25zLnBvaW50RG90U3Ryb2tlV2lkdGgsXG5cdFx0XHRcdHJhZGl1cyA6IHRoaXMub3B0aW9ucy5wb2ludERvdFJhZGl1cyxcblx0XHRcdFx0ZGlzcGxheTogdGhpcy5vcHRpb25zLnBvaW50RG90LFxuXHRcdFx0XHRoaXREZXRlY3Rpb25SYWRpdXMgOiB0aGlzLm9wdGlvbnMucG9pbnRIaXREZXRlY3Rpb25SYWRpdXMsXG5cdFx0XHRcdGN0eCA6IHRoaXMuY2hhcnQuY3R4XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5kYXRhc2V0cyA9IFtdO1xuXG5cdFx0XHR0aGlzLmJ1aWxkU2NhbGUoZGF0YSk7XG5cblx0XHRcdC8vU2V0IHVwIHRvb2x0aXAgZXZlbnRzIG9uIHRoZSBjaGFydFxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5zaG93VG9vbHRpcHMpe1xuXHRcdFx0XHRoZWxwZXJzLmJpbmRFdmVudHModGhpcywgdGhpcy5vcHRpb25zLnRvb2x0aXBFdmVudHMsIGZ1bmN0aW9uKGV2dCl7XG5cdFx0XHRcdFx0dmFyIGFjdGl2ZVBvaW50c0NvbGxlY3Rpb24gPSAoZXZ0LnR5cGUgIT09ICdtb3VzZW91dCcpID8gdGhpcy5nZXRQb2ludHNBdEV2ZW50KGV2dCkgOiBbXTtcblxuXHRcdFx0XHRcdHRoaXMuZWFjaFBvaW50cyhmdW5jdGlvbihwb2ludCl7XG5cdFx0XHRcdFx0XHRwb2ludC5yZXN0b3JlKFsnZmlsbENvbG9yJywgJ3N0cm9rZUNvbG9yJ10pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGhlbHBlcnMuZWFjaChhY3RpdmVQb2ludHNDb2xsZWN0aW9uLCBmdW5jdGlvbihhY3RpdmVQb2ludCl7XG5cdFx0XHRcdFx0XHRhY3RpdmVQb2ludC5maWxsQ29sb3IgPSBhY3RpdmVQb2ludC5oaWdobGlnaHRGaWxsO1xuXHRcdFx0XHRcdFx0YWN0aXZlUG9pbnQuc3Ryb2tlQ29sb3IgPSBhY3RpdmVQb2ludC5oaWdobGlnaHRTdHJva2U7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR0aGlzLnNob3dUb29sdGlwKGFjdGl2ZVBvaW50c0NvbGxlY3Rpb24pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0Ly9JdGVyYXRlIHRocm91Z2ggZWFjaCBvZiB0aGUgZGF0YXNldHMsIGFuZCBidWlsZCB0aGlzIGludG8gYSBwcm9wZXJ0eSBvZiB0aGUgY2hhcnRcblx0XHRcdGhlbHBlcnMuZWFjaChkYXRhLmRhdGFzZXRzLGZ1bmN0aW9uKGRhdGFzZXQpe1xuXG5cdFx0XHRcdHZhciBkYXRhc2V0T2JqZWN0ID0ge1xuXHRcdFx0XHRcdGxhYmVsOiBkYXRhc2V0LmxhYmVsIHx8IG51bGwsXG5cdFx0XHRcdFx0ZmlsbENvbG9yIDogZGF0YXNldC5maWxsQ29sb3IsXG5cdFx0XHRcdFx0c3Ryb2tlQ29sb3IgOiBkYXRhc2V0LnN0cm9rZUNvbG9yLFxuXHRcdFx0XHRcdHBvaW50Q29sb3IgOiBkYXRhc2V0LnBvaW50Q29sb3IsXG5cdFx0XHRcdFx0cG9pbnRTdHJva2VDb2xvciA6IGRhdGFzZXQucG9pbnRTdHJva2VDb2xvcixcblx0XHRcdFx0XHRwb2ludHMgOiBbXVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHRoaXMuZGF0YXNldHMucHVzaChkYXRhc2V0T2JqZWN0KTtcblxuXHRcdFx0XHRoZWxwZXJzLmVhY2goZGF0YXNldC5kYXRhLGZ1bmN0aW9uKGRhdGFQb2ludCxpbmRleCl7XG5cdFx0XHRcdFx0Ly9BZGQgYSBuZXcgcG9pbnQgZm9yIGVhY2ggcGllY2Ugb2YgZGF0YSwgcGFzc2luZyBhbnkgcmVxdWlyZWQgZGF0YSB0byBkcmF3LlxuXHRcdFx0XHRcdHZhciBwb2ludFBvc2l0aW9uO1xuXHRcdFx0XHRcdGlmICghdGhpcy5zY2FsZS5hbmltYXRpb24pe1xuXHRcdFx0XHRcdFx0cG9pbnRQb3NpdGlvbiA9IHRoaXMuc2NhbGUuZ2V0UG9pbnRQb3NpdGlvbihpbmRleCwgdGhpcy5zY2FsZS5jYWxjdWxhdGVDZW50ZXJPZmZzZXQoZGF0YVBvaW50KSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRhdGFzZXRPYmplY3QucG9pbnRzLnB1c2gobmV3IHRoaXMuUG9pbnRDbGFzcyh7XG5cdFx0XHRcdFx0XHR2YWx1ZSA6IGRhdGFQb2ludCxcblx0XHRcdFx0XHRcdGxhYmVsIDogZGF0YS5sYWJlbHNbaW5kZXhdLFxuXHRcdFx0XHRcdFx0ZGF0YXNldExhYmVsOiBkYXRhc2V0LmxhYmVsLFxuXHRcdFx0XHRcdFx0eDogKHRoaXMub3B0aW9ucy5hbmltYXRpb24pID8gdGhpcy5zY2FsZS54Q2VudGVyIDogcG9pbnRQb3NpdGlvbi54LFxuXHRcdFx0XHRcdFx0eTogKHRoaXMub3B0aW9ucy5hbmltYXRpb24pID8gdGhpcy5zY2FsZS55Q2VudGVyIDogcG9pbnRQb3NpdGlvbi55LFxuXHRcdFx0XHRcdFx0c3Ryb2tlQ29sb3IgOiBkYXRhc2V0LnBvaW50U3Ryb2tlQ29sb3IsXG5cdFx0XHRcdFx0XHRmaWxsQ29sb3IgOiBkYXRhc2V0LnBvaW50Q29sb3IsXG5cdFx0XHRcdFx0XHRoaWdobGlnaHRGaWxsIDogZGF0YXNldC5wb2ludEhpZ2hsaWdodEZpbGwgfHwgZGF0YXNldC5wb2ludENvbG9yLFxuXHRcdFx0XHRcdFx0aGlnaGxpZ2h0U3Ryb2tlIDogZGF0YXNldC5wb2ludEhpZ2hsaWdodFN0cm9rZSB8fCBkYXRhc2V0LnBvaW50U3Ryb2tlQ29sb3Jcblx0XHRcdFx0XHR9KSk7XG5cdFx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdHRoaXMucmVuZGVyKCk7XG5cdFx0fSxcblx0XHRlYWNoUG9pbnRzIDogZnVuY3Rpb24oY2FsbGJhY2spe1xuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCl7XG5cdFx0XHRcdGhlbHBlcnMuZWFjaChkYXRhc2V0LnBvaW50cyxjYWxsYmFjayx0aGlzKTtcblx0XHRcdH0sdGhpcyk7XG5cdFx0fSxcblxuXHRcdGdldFBvaW50c0F0RXZlbnQgOiBmdW5jdGlvbihldnQpe1xuXHRcdFx0dmFyIG1vdXNlUG9zaXRpb24gPSBoZWxwZXJzLmdldFJlbGF0aXZlUG9zaXRpb24oZXZ0KSxcblx0XHRcdFx0ZnJvbUNlbnRlciA9IGhlbHBlcnMuZ2V0QW5nbGVGcm9tUG9pbnQoe1xuXHRcdFx0XHRcdHg6IHRoaXMuc2NhbGUueENlbnRlcixcblx0XHRcdFx0XHR5OiB0aGlzLnNjYWxlLnlDZW50ZXJcblx0XHRcdFx0fSwgbW91c2VQb3NpdGlvbik7XG5cblx0XHRcdHZhciBhbmdsZVBlckluZGV4ID0gKE1hdGguUEkgKiAyKSAvdGhpcy5zY2FsZS52YWx1ZXNDb3VudCxcblx0XHRcdFx0cG9pbnRJbmRleCA9IE1hdGgucm91bmQoKGZyb21DZW50ZXIuYW5nbGUgLSBNYXRoLlBJICogMS41KSAvIGFuZ2xlUGVySW5kZXgpLFxuXHRcdFx0XHRhY3RpdmVQb2ludHNDb2xsZWN0aW9uID0gW107XG5cblx0XHRcdC8vIElmIHdlJ3JlIGF0IHRoZSB0b3AsIG1ha2UgdGhlIHBvaW50SW5kZXggMCB0byBnZXQgdGhlIGZpcnN0IG9mIHRoZSBhcnJheS5cblx0XHRcdGlmIChwb2ludEluZGV4ID49IHRoaXMuc2NhbGUudmFsdWVzQ291bnQgfHwgcG9pbnRJbmRleCA8IDApe1xuXHRcdFx0XHRwb2ludEluZGV4ID0gMDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGZyb21DZW50ZXIuZGlzdGFuY2UgPD0gdGhpcy5zY2FsZS5kcmF3aW5nQXJlYSl7XG5cdFx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmRhdGFzZXRzLCBmdW5jdGlvbihkYXRhc2V0KXtcblx0XHRcdFx0XHRhY3RpdmVQb2ludHNDb2xsZWN0aW9uLnB1c2goZGF0YXNldC5wb2ludHNbcG9pbnRJbmRleF0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGFjdGl2ZVBvaW50c0NvbGxlY3Rpb247XG5cdFx0fSxcblxuXHRcdGJ1aWxkU2NhbGUgOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdHRoaXMuc2NhbGUgPSBuZXcgQ2hhcnQuUmFkaWFsU2NhbGUoe1xuXHRcdFx0XHRkaXNwbGF5OiB0aGlzLm9wdGlvbnMuc2hvd1NjYWxlLFxuXHRcdFx0XHRmb250U3R5bGU6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTdHlsZSxcblx0XHRcdFx0Zm9udFNpemU6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTaXplLFxuXHRcdFx0XHRmb250RmFtaWx5OiB0aGlzLm9wdGlvbnMuc2NhbGVGb250RmFtaWx5LFxuXHRcdFx0XHRmb250Q29sb3I6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRDb2xvcixcblx0XHRcdFx0c2hvd0xhYmVsczogdGhpcy5vcHRpb25zLnNjYWxlU2hvd0xhYmVscyxcblx0XHRcdFx0c2hvd0xhYmVsQmFja2Ryb3A6IHRoaXMub3B0aW9ucy5zY2FsZVNob3dMYWJlbEJhY2tkcm9wLFxuXHRcdFx0XHRiYWNrZHJvcENvbG9yOiB0aGlzLm9wdGlvbnMuc2NhbGVCYWNrZHJvcENvbG9yLFxuXHRcdFx0XHRiYWNrZHJvcFBhZGRpbmdZIDogdGhpcy5vcHRpb25zLnNjYWxlQmFja2Ryb3BQYWRkaW5nWSxcblx0XHRcdFx0YmFja2Ryb3BQYWRkaW5nWDogdGhpcy5vcHRpb25zLnNjYWxlQmFja2Ryb3BQYWRkaW5nWCxcblx0XHRcdFx0bGluZVdpZHRoOiAodGhpcy5vcHRpb25zLnNjYWxlU2hvd0xpbmUpID8gdGhpcy5vcHRpb25zLnNjYWxlTGluZVdpZHRoIDogMCxcblx0XHRcdFx0bGluZUNvbG9yOiB0aGlzLm9wdGlvbnMuc2NhbGVMaW5lQ29sb3IsXG5cdFx0XHRcdGFuZ2xlTGluZUNvbG9yIDogdGhpcy5vcHRpb25zLmFuZ2xlTGluZUNvbG9yLFxuXHRcdFx0XHRhbmdsZUxpbmVXaWR0aCA6ICh0aGlzLm9wdGlvbnMuYW5nbGVTaG93TGluZU91dCkgPyB0aGlzLm9wdGlvbnMuYW5nbGVMaW5lV2lkdGggOiAwLFxuXHRcdFx0XHQvLyBQb2ludCBsYWJlbHMgYXQgdGhlIGVkZ2Ugb2YgZWFjaCBsaW5lXG5cdFx0XHRcdHBvaW50TGFiZWxGb250Q29sb3IgOiB0aGlzLm9wdGlvbnMucG9pbnRMYWJlbEZvbnRDb2xvcixcblx0XHRcdFx0cG9pbnRMYWJlbEZvbnRTaXplIDogdGhpcy5vcHRpb25zLnBvaW50TGFiZWxGb250U2l6ZSxcblx0XHRcdFx0cG9pbnRMYWJlbEZvbnRGYW1pbHkgOiB0aGlzLm9wdGlvbnMucG9pbnRMYWJlbEZvbnRGYW1pbHksXG5cdFx0XHRcdHBvaW50TGFiZWxGb250U3R5bGUgOiB0aGlzLm9wdGlvbnMucG9pbnRMYWJlbEZvbnRTdHlsZSxcblx0XHRcdFx0aGVpZ2h0IDogdGhpcy5jaGFydC5oZWlnaHQsXG5cdFx0XHRcdHdpZHRoOiB0aGlzLmNoYXJ0LndpZHRoLFxuXHRcdFx0XHR4Q2VudGVyOiB0aGlzLmNoYXJ0LndpZHRoLzIsXG5cdFx0XHRcdHlDZW50ZXI6IHRoaXMuY2hhcnQuaGVpZ2h0LzIsXG5cdFx0XHRcdGN0eCA6IHRoaXMuY2hhcnQuY3R4LFxuXHRcdFx0XHR0ZW1wbGF0ZVN0cmluZzogdGhpcy5vcHRpb25zLnNjYWxlTGFiZWwsXG5cdFx0XHRcdGxhYmVsczogZGF0YS5sYWJlbHMsXG5cdFx0XHRcdHZhbHVlc0NvdW50OiBkYXRhLmRhdGFzZXRzWzBdLmRhdGEubGVuZ3RoXG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5zY2FsZS5zZXRTY2FsZVNpemUoKTtcblx0XHRcdHRoaXMudXBkYXRlU2NhbGVSYW5nZShkYXRhLmRhdGFzZXRzKTtcblx0XHRcdHRoaXMuc2NhbGUuYnVpbGRZTGFiZWxzKCk7XG5cdFx0fSxcblx0XHR1cGRhdGVTY2FsZVJhbmdlOiBmdW5jdGlvbihkYXRhc2V0cyl7XG5cdFx0XHR2YXIgdmFsdWVzQXJyYXkgPSAoZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIHRvdGFsRGF0YUFycmF5ID0gW107XG5cdFx0XHRcdGhlbHBlcnMuZWFjaChkYXRhc2V0cyxmdW5jdGlvbihkYXRhc2V0KXtcblx0XHRcdFx0XHRpZiAoZGF0YXNldC5kYXRhKXtcblx0XHRcdFx0XHRcdHRvdGFsRGF0YUFycmF5ID0gdG90YWxEYXRhQXJyYXkuY29uY2F0KGRhdGFzZXQuZGF0YSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0aGVscGVycy5lYWNoKGRhdGFzZXQucG9pbnRzLCBmdW5jdGlvbihwb2ludCl7XG5cdFx0XHRcdFx0XHRcdHRvdGFsRGF0YUFycmF5LnB1c2gocG9pbnQudmFsdWUpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIHRvdGFsRGF0YUFycmF5O1xuXHRcdFx0fSkoKTtcblxuXG5cdFx0XHR2YXIgc2NhbGVTaXplcyA9ICh0aGlzLm9wdGlvbnMuc2NhbGVPdmVycmlkZSkgP1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3RlcHM6IHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBzLFxuXHRcdFx0XHRcdHN0ZXBWYWx1ZTogdGhpcy5vcHRpb25zLnNjYWxlU3RlcFdpZHRoLFxuXHRcdFx0XHRcdG1pbjogdGhpcy5vcHRpb25zLnNjYWxlU3RhcnRWYWx1ZSxcblx0XHRcdFx0XHRtYXg6IHRoaXMub3B0aW9ucy5zY2FsZVN0YXJ0VmFsdWUgKyAodGhpcy5vcHRpb25zLnNjYWxlU3RlcHMgKiB0aGlzLm9wdGlvbnMuc2NhbGVTdGVwV2lkdGgpXG5cdFx0XHRcdH0gOlxuXHRcdFx0XHRoZWxwZXJzLmNhbGN1bGF0ZVNjYWxlUmFuZ2UoXG5cdFx0XHRcdFx0dmFsdWVzQXJyYXksXG5cdFx0XHRcdFx0aGVscGVycy5taW4oW3RoaXMuY2hhcnQud2lkdGgsIHRoaXMuY2hhcnQuaGVpZ2h0XSkvMixcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMuc2NhbGVGb250U2l6ZSxcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMuc2NhbGVCZWdpbkF0WmVybyxcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMuc2NhbGVJbnRlZ2Vyc09ubHlcblx0XHRcdFx0KTtcblxuXHRcdFx0aGVscGVycy5leHRlbmQoXG5cdFx0XHRcdHRoaXMuc2NhbGUsXG5cdFx0XHRcdHNjYWxlU2l6ZXNcblx0XHRcdCk7XG5cblx0XHR9LFxuXHRcdGFkZERhdGEgOiBmdW5jdGlvbih2YWx1ZXNBcnJheSxsYWJlbCl7XG5cdFx0XHQvL01hcCB0aGUgdmFsdWVzIGFycmF5IGZvciBlYWNoIG9mIHRoZSBkYXRhc2V0c1xuXHRcdFx0dGhpcy5zY2FsZS52YWx1ZXNDb3VudCsrO1xuXHRcdFx0aGVscGVycy5lYWNoKHZhbHVlc0FycmF5LGZ1bmN0aW9uKHZhbHVlLGRhdGFzZXRJbmRleCl7XG5cdFx0XHRcdHZhciBwb2ludFBvc2l0aW9uID0gdGhpcy5zY2FsZS5nZXRQb2ludFBvc2l0aW9uKHRoaXMuc2NhbGUudmFsdWVzQ291bnQsIHRoaXMuc2NhbGUuY2FsY3VsYXRlQ2VudGVyT2Zmc2V0KHZhbHVlKSk7XG5cdFx0XHRcdHRoaXMuZGF0YXNldHNbZGF0YXNldEluZGV4XS5wb2ludHMucHVzaChuZXcgdGhpcy5Qb2ludENsYXNzKHtcblx0XHRcdFx0XHR2YWx1ZSA6IHZhbHVlLFxuXHRcdFx0XHRcdGxhYmVsIDogbGFiZWwsXG5cdFx0XHRcdFx0eDogcG9pbnRQb3NpdGlvbi54LFxuXHRcdFx0XHRcdHk6IHBvaW50UG9zaXRpb24ueSxcblx0XHRcdFx0XHRzdHJva2VDb2xvciA6IHRoaXMuZGF0YXNldHNbZGF0YXNldEluZGV4XS5wb2ludFN0cm9rZUNvbG9yLFxuXHRcdFx0XHRcdGZpbGxDb2xvciA6IHRoaXMuZGF0YXNldHNbZGF0YXNldEluZGV4XS5wb2ludENvbG9yXG5cdFx0XHRcdH0pKTtcblx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdHRoaXMuc2NhbGUubGFiZWxzLnB1c2gobGFiZWwpO1xuXG5cdFx0XHR0aGlzLnJlZmxvdygpO1xuXG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdH0sXG5cdFx0cmVtb3ZlRGF0YSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLnNjYWxlLnZhbHVlc0NvdW50LS07XG5cdFx0XHR0aGlzLnNjYWxlLmxhYmVscy5zaGlmdCgpO1xuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCl7XG5cdFx0XHRcdGRhdGFzZXQucG9pbnRzLnNoaWZ0KCk7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdFx0dGhpcy5yZWZsb3coKTtcblx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0fSxcblx0XHR1cGRhdGUgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5lYWNoUG9pbnRzKGZ1bmN0aW9uKHBvaW50KXtcblx0XHRcdFx0cG9pbnQuc2F2ZSgpO1xuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnJlZmxvdygpO1xuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9LFxuXHRcdHJlZmxvdzogZnVuY3Rpb24oKXtcblx0XHRcdGhlbHBlcnMuZXh0ZW5kKHRoaXMuc2NhbGUsIHtcblx0XHRcdFx0d2lkdGggOiB0aGlzLmNoYXJ0LndpZHRoLFxuXHRcdFx0XHRoZWlnaHQ6IHRoaXMuY2hhcnQuaGVpZ2h0LFxuXHRcdFx0XHRzaXplIDogaGVscGVycy5taW4oW3RoaXMuY2hhcnQud2lkdGgsIHRoaXMuY2hhcnQuaGVpZ2h0XSksXG5cdFx0XHRcdHhDZW50ZXI6IHRoaXMuY2hhcnQud2lkdGgvMixcblx0XHRcdFx0eUNlbnRlcjogdGhpcy5jaGFydC5oZWlnaHQvMlxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnVwZGF0ZVNjYWxlUmFuZ2UodGhpcy5kYXRhc2V0cyk7XG5cdFx0XHR0aGlzLnNjYWxlLnNldFNjYWxlU2l6ZSgpO1xuXHRcdFx0dGhpcy5zY2FsZS5idWlsZFlMYWJlbHMoKTtcblx0XHR9LFxuXHRcdGRyYXcgOiBmdW5jdGlvbihlYXNlKXtcblx0XHRcdHZhciBlYXNlRGVjaW1hbCA9IGVhc2UgfHwgMSxcblx0XHRcdFx0Y3R4ID0gdGhpcy5jaGFydC5jdHg7XG5cdFx0XHR0aGlzLmNsZWFyKCk7XG5cdFx0XHR0aGlzLnNjYWxlLmRyYXcoKTtcblxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCl7XG5cblx0XHRcdFx0Ly9UcmFuc2l0aW9uIGVhY2ggcG9pbnQgZmlyc3Qgc28gdGhhdCB0aGUgbGluZSBhbmQgcG9pbnQgZHJhd2luZyBpc24ndCBvdXQgb2Ygc3luY1xuXHRcdFx0XHRoZWxwZXJzLmVhY2goZGF0YXNldC5wb2ludHMsZnVuY3Rpb24ocG9pbnQsaW5kZXgpe1xuXHRcdFx0XHRcdGlmIChwb2ludC5oYXNWYWx1ZSgpKXtcblx0XHRcdFx0XHRcdHBvaW50LnRyYW5zaXRpb24odGhpcy5zY2FsZS5nZXRQb2ludFBvc2l0aW9uKGluZGV4LCB0aGlzLnNjYWxlLmNhbGN1bGF0ZUNlbnRlck9mZnNldChwb2ludC52YWx1ZSkpLCBlYXNlRGVjaW1hbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LHRoaXMpO1xuXG5cblxuXHRcdFx0XHQvL0RyYXcgdGhlIGxpbmUgYmV0d2VlbiBhbGwgdGhlIHBvaW50c1xuXHRcdFx0XHRjdHgubGluZVdpZHRoID0gdGhpcy5vcHRpb25zLmRhdGFzZXRTdHJva2VXaWR0aDtcblx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gZGF0YXNldC5zdHJva2VDb2xvcjtcblx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRoZWxwZXJzLmVhY2goZGF0YXNldC5wb2ludHMsZnVuY3Rpb24ocG9pbnQsaW5kZXgpe1xuXHRcdFx0XHRcdGlmIChpbmRleCA9PT0gMCl7XG5cdFx0XHRcdFx0XHRjdHgubW92ZVRvKHBvaW50LngscG9pbnQueSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRjdHgubGluZVRvKHBvaW50LngscG9pbnQueSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LHRoaXMpO1xuXHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdGN0eC5zdHJva2UoKTtcblxuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gZGF0YXNldC5maWxsQ29sb3I7XG5cdFx0XHRcdGN0eC5maWxsKCk7XG5cblx0XHRcdFx0Ly9Ob3cgZHJhdyB0aGUgcG9pbnRzIG92ZXIgdGhlIGxpbmVcblx0XHRcdFx0Ly9BIGxpdHRsZSBpbmVmZmljaWVudCBkb3VibGUgbG9vcGluZywgYnV0IGJldHRlciB0aGFuIHRoZSBsaW5lXG5cdFx0XHRcdC8vbGFnZ2luZyBiZWhpbmQgdGhlIHBvaW50IHBvc2l0aW9uc1xuXHRcdFx0XHRoZWxwZXJzLmVhY2goZGF0YXNldC5wb2ludHMsZnVuY3Rpb24ocG9pbnQpe1xuXHRcdFx0XHRcdGlmIChwb2ludC5oYXNWYWx1ZSgpKXtcblx0XHRcdFx0XHRcdHBvaW50LmRyYXcoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHR9LHRoaXMpO1xuXG5cdFx0fVxuXG5cdH0pO1xuXG5cblxuXG5cbn0pLmNhbGwodGhpcyk7IiwiLy8hIG1vbWVudC5qc1xuLy8hIHZlcnNpb24gOiAyLjEwLjJcbi8vISBhdXRob3JzIDogVGltIFdvb2QsIElza3JlbiBDaGVybmV2LCBNb21lbnQuanMgY29udHJpYnV0b3JzXG4vLyEgbGljZW5zZSA6IE1JVFxuLy8hIG1vbWVudGpzLmNvbVxuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAgIGdsb2JhbC5tb21lbnQgPSBmYWN0b3J5KClcbn0odGhpcywgZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgaG9va0NhbGxiYWNrO1xuXG4gICAgZnVuY3Rpb24gdXRpbHNfaG9va3NfX2hvb2tzICgpIHtcbiAgICAgICAgcmV0dXJuIGhvb2tDYWxsYmFjay5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIC8vIFRoaXMgaXMgZG9uZSB0byByZWdpc3RlciB0aGUgbWV0aG9kIGNhbGxlZCB3aXRoIG1vbWVudCgpXG4gICAgLy8gd2l0aG91dCBjcmVhdGluZyBjaXJjdWxhciBkZXBlbmRlbmNpZXMuXG4gICAgZnVuY3Rpb24gc2V0SG9va0NhbGxiYWNrIChjYWxsYmFjaykge1xuICAgICAgICBob29rQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZhdWx0UGFyc2luZ0ZsYWdzKCkge1xuICAgICAgICAvLyBXZSBuZWVkIHRvIGRlZXAgY2xvbmUgdGhpcyBvYmplY3QuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbXB0eSAgICAgICAgICAgOiBmYWxzZSxcbiAgICAgICAgICAgIHVudXNlZFRva2VucyAgICA6IFtdLFxuICAgICAgICAgICAgdW51c2VkSW5wdXQgICAgIDogW10sXG4gICAgICAgICAgICBvdmVyZmxvdyAgICAgICAgOiAtMixcbiAgICAgICAgICAgIGNoYXJzTGVmdE92ZXIgICA6IDAsXG4gICAgICAgICAgICBudWxsSW5wdXQgICAgICAgOiBmYWxzZSxcbiAgICAgICAgICAgIGludmFsaWRNb250aCAgICA6IG51bGwsXG4gICAgICAgICAgICBpbnZhbGlkRm9ybWF0ICAgOiBmYWxzZSxcbiAgICAgICAgICAgIHVzZXJJbnZhbGlkYXRlZCA6IGZhbHNlLFxuICAgICAgICAgICAgaXNvICAgICAgICAgICAgIDogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0FycmF5KGlucHV0KSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF0ZShpbnB1dCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgRGF0ZV0nIHx8IGlucHV0IGluc3RhbmNlb2YgRGF0ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXAoYXJyLCBmbikge1xuICAgICAgICB2YXIgcmVzID0gW10sIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKGZuKGFycltpXSwgaSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFzT3duUHJvcChhLCBiKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYSwgYik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXh0ZW5kKGEsIGIpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBiKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChiLCBpKSkge1xuICAgICAgICAgICAgICAgIGFbaV0gPSBiW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3RvU3RyaW5nJykpIHtcbiAgICAgICAgICAgIGEudG9TdHJpbmcgPSBiLnRvU3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3ZhbHVlT2YnKSkge1xuICAgICAgICAgICAgYS52YWx1ZU9mID0gYi52YWx1ZU9mO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlX3V0Y19fY3JlYXRlVVRDIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlTG9jYWxPclVUQyhpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCwgdHJ1ZSkudXRjKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRfX2lzVmFsaWQobSkge1xuICAgICAgICBpZiAobS5faXNWYWxpZCA9PSBudWxsKSB7XG4gICAgICAgICAgICBtLl9pc1ZhbGlkID0gIWlzTmFOKG0uX2QuZ2V0VGltZSgpKSAmJlxuICAgICAgICAgICAgICAgIG0uX3BmLm92ZXJmbG93IDwgMCAmJlxuICAgICAgICAgICAgICAgICFtLl9wZi5lbXB0eSAmJlxuICAgICAgICAgICAgICAgICFtLl9wZi5pbnZhbGlkTW9udGggJiZcbiAgICAgICAgICAgICAgICAhbS5fcGYubnVsbElucHV0ICYmXG4gICAgICAgICAgICAgICAgIW0uX3BmLmludmFsaWRGb3JtYXQgJiZcbiAgICAgICAgICAgICAgICAhbS5fcGYudXNlckludmFsaWRhdGVkO1xuXG4gICAgICAgICAgICBpZiAobS5fc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgbS5faXNWYWxpZCA9IG0uX2lzVmFsaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgbS5fcGYuY2hhcnNMZWZ0T3ZlciA9PT0gMCAmJlxuICAgICAgICAgICAgICAgICAgICBtLl9wZi51bnVzZWRUb2tlbnMubGVuZ3RoID09PSAwICYmXG4gICAgICAgICAgICAgICAgICAgIG0uX3BmLmJpZ0hvdXIgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbS5faXNWYWxpZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZF9fY3JlYXRlSW52YWxpZCAoZmxhZ3MpIHtcbiAgICAgICAgdmFyIG0gPSBjcmVhdGVfdXRjX19jcmVhdGVVVEMoTmFOKTtcbiAgICAgICAgaWYgKGZsYWdzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGV4dGVuZChtLl9wZiwgZmxhZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbS5fcGYudXNlckludmFsaWRhdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH1cblxuICAgIHZhciBtb21lbnRQcm9wZXJ0aWVzID0gdXRpbHNfaG9va3NfX2hvb2tzLm1vbWVudFByb3BlcnRpZXMgPSBbXTtcblxuICAgIGZ1bmN0aW9uIGNvcHlDb25maWcodG8sIGZyb20pIHtcbiAgICAgICAgdmFyIGksIHByb3AsIHZhbDtcblxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2lzQU1vbWVudE9iamVjdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9pc0FNb21lbnRPYmplY3QgPSBmcm9tLl9pc0FNb21lbnRPYmplY3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9pICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2kgPSBmcm9tLl9pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9mID0gZnJvbS5fZjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2wgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fbCA9IGZyb20uX2w7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9zdHJpY3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fc3RyaWN0ID0gZnJvbS5fc3RyaWN0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fdHptICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX3R6bSA9IGZyb20uX3R6bTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2lzVVRDICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2lzVVRDID0gZnJvbS5faXNVVEM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9vZmZzZXQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fb2Zmc2V0ID0gZnJvbS5fb2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fcGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fcGYgPSBmcm9tLl9wZjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2xvY2FsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9sb2NhbGUgPSBmcm9tLl9sb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9tZW50UHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGkgaW4gbW9tZW50UHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgIHByb3AgPSBtb21lbnRQcm9wZXJ0aWVzW2ldO1xuICAgICAgICAgICAgICAgIHZhbCA9IGZyb21bcHJvcF07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvW3Byb3BdID0gdmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0bztcbiAgICB9XG5cbiAgICB2YXIgdXBkYXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuXG4gICAgLy8gTW9tZW50IHByb3RvdHlwZSBvYmplY3RcbiAgICBmdW5jdGlvbiBNb21lbnQoY29uZmlnKSB7XG4gICAgICAgIGNvcHlDb25maWcodGhpcywgY29uZmlnKTtcbiAgICAgICAgdGhpcy5fZCA9IG5ldyBEYXRlKCtjb25maWcuX2QpO1xuICAgICAgICAvLyBQcmV2ZW50IGluZmluaXRlIGxvb3AgaW4gY2FzZSB1cGRhdGVPZmZzZXQgY3JlYXRlcyBuZXcgbW9tZW50XG4gICAgICAgIC8vIG9iamVjdHMuXG4gICAgICAgIGlmICh1cGRhdGVJblByb2dyZXNzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdXBkYXRlSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KHRoaXMpO1xuICAgICAgICAgICAgdXBkYXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNNb21lbnQgKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgTW9tZW50IHx8IChvYmogIT0gbnVsbCAmJiBoYXNPd25Qcm9wKG9iaiwgJ19pc0FNb21lbnRPYmplY3QnKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9JbnQoYXJndW1lbnRGb3JDb2VyY2lvbikge1xuICAgICAgICB2YXIgY29lcmNlZE51bWJlciA9ICthcmd1bWVudEZvckNvZXJjaW9uLFxuICAgICAgICAgICAgdmFsdWUgPSAwO1xuXG4gICAgICAgIGlmIChjb2VyY2VkTnVtYmVyICE9PSAwICYmIGlzRmluaXRlKGNvZXJjZWROdW1iZXIpKSB7XG4gICAgICAgICAgICBpZiAoY29lcmNlZE51bWJlciA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBNYXRoLmZsb29yKGNvZXJjZWROdW1iZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IE1hdGguY2VpbChjb2VyY2VkTnVtYmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wYXJlQXJyYXlzKGFycmF5MSwgYXJyYXkyLCBkb250Q29udmVydCkge1xuICAgICAgICB2YXIgbGVuID0gTWF0aC5taW4oYXJyYXkxLmxlbmd0aCwgYXJyYXkyLmxlbmd0aCksXG4gICAgICAgICAgICBsZW5ndGhEaWZmID0gTWF0aC5hYnMoYXJyYXkxLmxlbmd0aCAtIGFycmF5Mi5sZW5ndGgpLFxuICAgICAgICAgICAgZGlmZnMgPSAwLFxuICAgICAgICAgICAgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoKGRvbnRDb252ZXJ0ICYmIGFycmF5MVtpXSAhPT0gYXJyYXkyW2ldKSB8fFxuICAgICAgICAgICAgICAgICghZG9udENvbnZlcnQgJiYgdG9JbnQoYXJyYXkxW2ldKSAhPT0gdG9JbnQoYXJyYXkyW2ldKSkpIHtcbiAgICAgICAgICAgICAgICBkaWZmcysrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaWZmcyArIGxlbmd0aERpZmY7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gTG9jYWxlKCkge1xuICAgIH1cblxuICAgIHZhciBsb2NhbGVzID0ge307XG4gICAgdmFyIGdsb2JhbExvY2FsZTtcblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZUxvY2FsZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleSA/IGtleS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJ18nLCAnLScpIDoga2V5O1xuICAgIH1cblxuICAgIC8vIHBpY2sgdGhlIGxvY2FsZSBmcm9tIHRoZSBhcnJheVxuICAgIC8vIHRyeSBbJ2VuLWF1JywgJ2VuLWdiJ10gYXMgJ2VuLWF1JywgJ2VuLWdiJywgJ2VuJywgYXMgaW4gbW92ZSB0aHJvdWdoIHRoZSBsaXN0IHRyeWluZyBlYWNoXG4gICAgLy8gc3Vic3RyaW5nIGZyb20gbW9zdCBzcGVjaWZpYyB0byBsZWFzdCwgYnV0IG1vdmUgdG8gdGhlIG5leHQgYXJyYXkgaXRlbSBpZiBpdCdzIGEgbW9yZSBzcGVjaWZpYyB2YXJpYW50IHRoYW4gdGhlIGN1cnJlbnQgcm9vdFxuICAgIGZ1bmN0aW9uIGNob29zZUxvY2FsZShuYW1lcykge1xuICAgICAgICB2YXIgaSA9IDAsIGosIG5leHQsIGxvY2FsZSwgc3BsaXQ7XG5cbiAgICAgICAgd2hpbGUgKGkgPCBuYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHNwbGl0ID0gbm9ybWFsaXplTG9jYWxlKG5hbWVzW2ldKS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgaiA9IHNwbGl0Lmxlbmd0aDtcbiAgICAgICAgICAgIG5leHQgPSBub3JtYWxpemVMb2NhbGUobmFtZXNbaSArIDFdKTtcbiAgICAgICAgICAgIG5leHQgPSBuZXh0ID8gbmV4dC5zcGxpdCgnLScpIDogbnVsbDtcbiAgICAgICAgICAgIHdoaWxlIChqID4gMCkge1xuICAgICAgICAgICAgICAgIGxvY2FsZSA9IGxvYWRMb2NhbGUoc3BsaXQuc2xpY2UoMCwgaikuam9pbignLScpKTtcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChuZXh0ICYmIG5leHQubGVuZ3RoID49IGogJiYgY29tcGFyZUFycmF5cyhzcGxpdCwgbmV4dCwgdHJ1ZSkgPj0gaiAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy90aGUgbmV4dCBhcnJheSBpdGVtIGlzIGJldHRlciB0aGFuIGEgc2hhbGxvd2VyIHN1YnN0cmluZyBvZiB0aGlzIG9uZVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgai0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRMb2NhbGUobmFtZSkge1xuICAgICAgICB2YXIgb2xkTG9jYWxlID0gbnVsbDtcbiAgICAgICAgLy8gVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVnaXN0ZXIgYW5kIGxvYWQgYWxsIHRoZSBsb2NhbGVzIGluIE5vZGVcbiAgICAgICAgaWYgKCFsb2NhbGVzW25hbWVdICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgbW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG9sZExvY2FsZSA9IGdsb2JhbExvY2FsZS5fYWJicjtcbiAgICAgICAgICAgICAgICByZXF1aXJlKCcuL2xvY2FsZS8nICsgbmFtZSk7XG4gICAgICAgICAgICAgICAgLy8gYmVjYXVzZSBkZWZpbmVMb2NhbGUgY3VycmVudGx5IGFsc28gc2V0cyB0aGUgZ2xvYmFsIGxvY2FsZSwgd2VcbiAgICAgICAgICAgICAgICAvLyB3YW50IHRvIHVuZG8gdGhhdCBmb3IgbGF6eSBsb2FkZWQgbG9jYWxlc1xuICAgICAgICAgICAgICAgIGxvY2FsZV9sb2NhbGVzX19nZXRTZXRHbG9iYWxMb2NhbGUob2xkTG9jYWxlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2NhbGVzW25hbWVdO1xuICAgIH1cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCBsb2FkIGxvY2FsZSBhbmQgdGhlbiBzZXQgdGhlIGdsb2JhbCBsb2NhbGUuICBJZlxuICAgIC8vIG5vIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGluLCBpdCB3aWxsIHNpbXBseSByZXR1cm4gdGhlIGN1cnJlbnQgZ2xvYmFsXG4gICAgLy8gbG9jYWxlIGtleS5cbiAgICBmdW5jdGlvbiBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlIChrZXksIHZhbHVlcykge1xuICAgICAgICB2YXIgZGF0YTtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZXMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUoa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkZWZpbmVMb2NhbGUoa2V5LCB2YWx1ZXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vIG1vbWVudC5kdXJhdGlvbi5fbG9jYWxlID0gbW9tZW50Ll9sb2NhbGUgPSBkYXRhO1xuICAgICAgICAgICAgICAgIGdsb2JhbExvY2FsZSA9IGRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ2xvYmFsTG9jYWxlLl9hYmJyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmluZUxvY2FsZSAobmFtZSwgdmFsdWVzKSB7XG4gICAgICAgIGlmICh2YWx1ZXMgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhbHVlcy5hYmJyID0gbmFtZTtcbiAgICAgICAgICAgIGlmICghbG9jYWxlc1tuYW1lXSkge1xuICAgICAgICAgICAgICAgIGxvY2FsZXNbbmFtZV0gPSBuZXcgTG9jYWxlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2NhbGVzW25hbWVdLnNldCh2YWx1ZXMpO1xuXG4gICAgICAgICAgICAvLyBiYWNrd2FyZHMgY29tcGF0IGZvciBub3c6IGFsc28gc2V0IHRoZSBsb2NhbGVcbiAgICAgICAgICAgIGxvY2FsZV9sb2NhbGVzX19nZXRTZXRHbG9iYWxMb2NhbGUobmFtZSk7XG5cbiAgICAgICAgICAgIHJldHVybiBsb2NhbGVzW25hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdXNlZnVsIGZvciB0ZXN0aW5nXG4gICAgICAgICAgICBkZWxldGUgbG9jYWxlc1tuYW1lXTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmV0dXJucyBsb2NhbGUgZGF0YVxuICAgIGZ1bmN0aW9uIGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUgKGtleSkge1xuICAgICAgICB2YXIgbG9jYWxlO1xuXG4gICAgICAgIGlmIChrZXkgJiYga2V5Ll9sb2NhbGUgJiYga2V5Ll9sb2NhbGUuX2FiYnIpIHtcbiAgICAgICAgICAgIGtleSA9IGtleS5fbG9jYWxlLl9hYmJyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxMb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgICAgLy9zaG9ydC1jaXJjdWl0IGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgICAgICAgbG9jYWxlID0gbG9hZExvY2FsZShrZXkpO1xuICAgICAgICAgICAgaWYgKGxvY2FsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrZXkgPSBba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjaG9vc2VMb2NhbGUoa2V5KTtcbiAgICB9XG5cbiAgICB2YXIgYWxpYXNlcyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gYWRkVW5pdEFsaWFzICh1bml0LCBzaG9ydGhhbmQpIHtcbiAgICAgICAgdmFyIGxvd2VyQ2FzZSA9IHVuaXQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgYWxpYXNlc1tsb3dlckNhc2VdID0gYWxpYXNlc1tsb3dlckNhc2UgKyAncyddID0gYWxpYXNlc1tzaG9ydGhhbmRdID0gdW5pdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVVbml0cyh1bml0cykge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHVuaXRzID09PSAnc3RyaW5nJyA/IGFsaWFzZXNbdW5pdHNdIHx8IGFsaWFzZXNbdW5pdHMudG9Mb3dlckNhc2UoKV0gOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplT2JqZWN0VW5pdHMoaW5wdXRPYmplY3QpIHtcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWRJbnB1dCA9IHt9LFxuICAgICAgICAgICAgbm9ybWFsaXplZFByb3AsXG4gICAgICAgICAgICBwcm9wO1xuXG4gICAgICAgIGZvciAocHJvcCBpbiBpbnB1dE9iamVjdCkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3AoaW5wdXRPYmplY3QsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZFByb3AgPSBub3JtYWxpemVVbml0cyhwcm9wKTtcbiAgICAgICAgICAgICAgICBpZiAobm9ybWFsaXplZFByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZElucHV0W25vcm1hbGl6ZWRQcm9wXSA9IGlucHV0T2JqZWN0W3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub3JtYWxpemVkSW5wdXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUdldFNldCAodW5pdCwga2VlcFRpbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBnZXRfc2V0X19zZXQodGhpcywgdW5pdCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy51cGRhdGVPZmZzZXQodGhpcywga2VlcFRpbWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0X3NldF9fZ2V0KHRoaXMsIHVuaXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldF9zZXRfX2dldCAobW9tLCB1bml0KSB7XG4gICAgICAgIHJldHVybiBtb20uX2RbJ2dldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgdW5pdF0oKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRfc2V0X19zZXQgKG1vbSwgdW5pdCwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG1vbS5fZFsnc2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0ICh1bml0cywgdmFsdWUpIHtcbiAgICAgICAgdmFyIHVuaXQ7XG4gICAgICAgIGlmICh0eXBlb2YgdW5pdHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBmb3IgKHVuaXQgaW4gdW5pdHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldCh1bml0LCB1bml0c1t1bml0XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpc1t1bml0c10gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1t1bml0c10odmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHplcm9GaWxsKG51bWJlciwgdGFyZ2V0TGVuZ3RoLCBmb3JjZVNpZ24pIHtcbiAgICAgICAgdmFyIG91dHB1dCA9ICcnICsgTWF0aC5hYnMobnVtYmVyKSxcbiAgICAgICAgICAgIHNpZ24gPSBudW1iZXIgPj0gMDtcblxuICAgICAgICB3aGlsZSAob3V0cHV0Lmxlbmd0aCA8IHRhcmdldExlbmd0aCkge1xuICAgICAgICAgICAgb3V0cHV0ID0gJzAnICsgb3V0cHV0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoc2lnbiA/IChmb3JjZVNpZ24gPyAnKycgOiAnJykgOiAnLScpICsgb3V0cHV0O1xuICAgIH1cblxuICAgIHZhciBmb3JtYXR0aW5nVG9rZW5zID0gLyhcXFtbXlxcW10qXFxdKXwoXFxcXCk/KE1vfE1NP00/TT98RG98REREb3xERD9EP0Q/fGRkZD9kP3xkbz98d1tvfHddP3xXW298V10/fFF8WVlZWVlZfFlZWVlZfFlZWVl8WVl8Z2coZ2dnPyk/fEdHKEdHRz8pP3xlfEV8YXxBfGhoP3xISD98bW0/fHNzP3xTezEsNH18eHxYfHp6P3xaWj98LikvZztcblxuICAgIHZhciBsb2NhbEZvcm1hdHRpbmdUb2tlbnMgPSAvKFxcW1teXFxbXSpcXF0pfChcXFxcKT8oTFRTfExUfExMP0w/TD98bHsxLDR9KS9nO1xuXG4gICAgdmFyIGZvcm1hdEZ1bmN0aW9ucyA9IHt9O1xuXG4gICAgdmFyIGZvcm1hdFRva2VuRnVuY3Rpb25zID0ge307XG5cbiAgICAvLyB0b2tlbjogICAgJ00nXG4gICAgLy8gcGFkZGVkOiAgIFsnTU0nLCAyXVxuICAgIC8vIG9yZGluYWw6ICAnTW8nXG4gICAgLy8gY2FsbGJhY2s6IGZ1bmN0aW9uICgpIHsgdGhpcy5tb250aCgpICsgMSB9XG4gICAgZnVuY3Rpb24gYWRkRm9ybWF0VG9rZW4gKHRva2VuLCBwYWRkZWQsIG9yZGluYWwsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBmdW5jID0gY2FsbGJhY2s7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBmdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW2NhbGxiYWNrXSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW3Rva2VuXSA9IGZ1bmM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhZGRlZCkge1xuICAgICAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbcGFkZGVkWzBdXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gemVyb0ZpbGwoZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCBwYWRkZWRbMV0sIHBhZGRlZFsyXSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcmRpbmFsKSB7XG4gICAgICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1tvcmRpbmFsXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkub3JkaW5hbChmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHRva2VuKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVGb3JtYXR0aW5nVG9rZW5zKGlucHV0KSB7XG4gICAgICAgIGlmIChpbnB1dC5tYXRjaCgvXFxbW1xcc1xcU10vKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL15cXFt8XFxdJC9nLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL1xcXFwvZywgJycpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpIHtcbiAgICAgICAgdmFyIGFycmF5ID0gZm9ybWF0Lm1hdGNoKGZvcm1hdHRpbmdUb2tlbnMpLCBpLCBsZW5ndGg7XG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXRUb2tlbkZ1bmN0aW9uc1thcnJheVtpXV0pIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IGZvcm1hdFRva2VuRnVuY3Rpb25zW2FycmF5W2ldXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSByZW1vdmVGb3JtYXR0aW5nVG9rZW5zKGFycmF5W2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobW9tKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gJyc7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gYXJyYXlbaV0gaW5zdGFuY2VvZiBGdW5jdGlvbiA/IGFycmF5W2ldLmNhbGwobW9tLCBmb3JtYXQpIDogYXJyYXlbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIGZvcm1hdCBkYXRlIHVzaW5nIG5hdGl2ZSBkYXRlIG9iamVjdFxuICAgIGZ1bmN0aW9uIGZvcm1hdE1vbWVudChtLCBmb3JtYXQpIHtcbiAgICAgICAgaWYgKCFtLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIG0ubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtYXQgPSBleHBhbmRGb3JtYXQoZm9ybWF0LCBtLmxvY2FsZURhdGEoKSk7XG5cbiAgICAgICAgaWYgKCFmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSkge1xuICAgICAgICAgICAgZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0gPSBtYWtlRm9ybWF0RnVuY3Rpb24oZm9ybWF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XShtKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHBhbmRGb3JtYXQoZm9ybWF0LCBsb2NhbGUpIHtcbiAgICAgICAgdmFyIGkgPSA1O1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlcGxhY2VMb25nRGF0ZUZvcm1hdFRva2VucyhpbnB1dCkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZS5sb25nRGF0ZUZvcm1hdChpbnB1dCkgfHwgaW5wdXQ7XG4gICAgICAgIH1cblxuICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPj0gMCAmJiBsb2NhbEZvcm1hdHRpbmdUb2tlbnMudGVzdChmb3JtYXQpKSB7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZShsb2NhbEZvcm1hdHRpbmdUb2tlbnMsIHJlcGxhY2VMb25nRGF0ZUZvcm1hdFRva2Vucyk7XG4gICAgICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgIGkgLT0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb3JtYXQ7XG4gICAgfVxuXG4gICAgdmFyIG1hdGNoMSAgICAgICAgID0gL1xcZC87ICAgICAgICAgICAgLy8gICAgICAgMCAtIDlcbiAgICB2YXIgbWF0Y2gyICAgICAgICAgPSAvXFxkXFxkLzsgICAgICAgICAgLy8gICAgICAwMCAtIDk5XG4gICAgdmFyIG1hdGNoMyAgICAgICAgID0gL1xcZHszfS87ICAgICAgICAgLy8gICAgIDAwMCAtIDk5OVxuICAgIHZhciBtYXRjaDQgICAgICAgICA9IC9cXGR7NH0vOyAgICAgICAgIC8vICAgIDAwMDAgLSA5OTk5XG4gICAgdmFyIG1hdGNoNiAgICAgICAgID0gL1srLV0/XFxkezZ9LzsgICAgLy8gLTk5OTk5OSAtIDk5OTk5OVxuICAgIHZhciBtYXRjaDF0bzIgICAgICA9IC9cXGRcXGQ/LzsgICAgICAgICAvLyAgICAgICAwIC0gOTlcbiAgICB2YXIgbWF0Y2gxdG8zICAgICAgPSAvXFxkezEsM30vOyAgICAgICAvLyAgICAgICAwIC0gOTk5XG4gICAgdmFyIG1hdGNoMXRvNCAgICAgID0gL1xcZHsxLDR9LzsgICAgICAgLy8gICAgICAgMCAtIDk5OTlcbiAgICB2YXIgbWF0Y2gxdG82ICAgICAgPSAvWystXT9cXGR7MSw2fS87ICAvLyAtOTk5OTk5IC0gOTk5OTk5XG5cbiAgICB2YXIgbWF0Y2hVbnNpZ25lZCAgPSAvXFxkKy87ICAgICAgICAgICAvLyAgICAgICAwIC0gaW5mXG4gICAgdmFyIG1hdGNoU2lnbmVkICAgID0gL1srLV0/XFxkKy87ICAgICAgLy8gICAgLWluZiAtIGluZlxuXG4gICAgdmFyIG1hdGNoT2Zmc2V0ICAgID0gL1p8WystXVxcZFxcZDo/XFxkXFxkL2dpOyAvLyArMDA6MDAgLTAwOjAwICswMDAwIC0wMDAwIG9yIFpcblxuICAgIHZhciBtYXRjaFRpbWVzdGFtcCA9IC9bKy1dP1xcZCsoXFwuXFxkezEsM30pPy87IC8vIDEyMzQ1Njc4OSAxMjM0NTY3ODkuMTIzXG5cbiAgICAvLyBhbnkgd29yZCAob3IgdHdvKSBjaGFyYWN0ZXJzIG9yIG51bWJlcnMgaW5jbHVkaW5nIHR3by90aHJlZSB3b3JkIG1vbnRoIGluIGFyYWJpYy5cbiAgICB2YXIgbWF0Y2hXb3JkID0gL1swLTldKlsnYS16XFx1MDBBMC1cXHUwNUZGXFx1MDcwMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSt8W1xcdTA2MDAtXFx1MDZGRlxcL10rKFxccyo/W1xcdTA2MDAtXFx1MDZGRl0rKXsxLDJ9L2k7XG5cbiAgICB2YXIgcmVnZXhlcyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gYWRkUmVnZXhUb2tlbiAodG9rZW4sIHJlZ2V4LCBzdHJpY3RSZWdleCkge1xuICAgICAgICByZWdleGVzW3Rva2VuXSA9IHR5cGVvZiByZWdleCA9PT0gJ2Z1bmN0aW9uJyA/IHJlZ2V4IDogZnVuY3Rpb24gKGlzU3RyaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gKGlzU3RyaWN0ICYmIHN0cmljdFJlZ2V4KSA/IHN0cmljdFJlZ2V4IDogcmVnZXg7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UGFyc2VSZWdleEZvclRva2VuICh0b2tlbiwgY29uZmlnKSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcChyZWdleGVzLCB0b2tlbikpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKHVuZXNjYXBlRm9ybWF0KHRva2VuKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVnZXhlc1t0b2tlbl0oY29uZmlnLl9zdHJpY3QsIGNvbmZpZy5fbG9jYWxlKTtcbiAgICB9XG5cbiAgICAvLyBDb2RlIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNTYxNDkzL2lzLXRoZXJlLWEtcmVnZXhwLWVzY2FwZS1mdW5jdGlvbi1pbi1qYXZhc2NyaXB0XG4gICAgZnVuY3Rpb24gdW5lc2NhcGVGb3JtYXQocykge1xuICAgICAgICByZXR1cm4gcy5yZXBsYWNlKCdcXFxcJywgJycpLnJlcGxhY2UoL1xcXFwoXFxbKXxcXFxcKFxcXSl8XFxbKFteXFxdXFxbXSopXFxdfFxcXFwoLikvZywgZnVuY3Rpb24gKG1hdGNoZWQsIHAxLCBwMiwgcDMsIHA0KSB7XG4gICAgICAgICAgICByZXR1cm4gcDEgfHwgcDIgfHwgcDMgfHwgcDQ7XG4gICAgICAgIH0pLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xuICAgIH1cblxuICAgIHZhciB0b2tlbnMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGFkZFBhcnNlVG9rZW4gKHRva2VuLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgaSwgZnVuYyA9IGNhbGxiYWNrO1xuICAgICAgICBpZiAodHlwZW9mIHRva2VuID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdG9rZW4gPSBbdG9rZW5dO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBmdW5jID0gZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICAgICAgICAgIGFycmF5W2NhbGxiYWNrXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRva2VuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0b2tlbnNbdG9rZW5baV1dID0gZnVuYztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFdlZWtQYXJzZVRva2VuICh0b2tlbiwgY2FsbGJhY2spIHtcbiAgICAgICAgYWRkUGFyc2VUb2tlbih0b2tlbiwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnLCB0b2tlbikge1xuICAgICAgICAgICAgY29uZmlnLl93ID0gY29uZmlnLl93IHx8IHt9O1xuICAgICAgICAgICAgY2FsbGJhY2soaW5wdXQsIGNvbmZpZy5fdywgY29uZmlnLCB0b2tlbik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBpbnB1dCwgY29uZmlnKSB7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsICYmIGhhc093blByb3AodG9rZW5zLCB0b2tlbikpIHtcbiAgICAgICAgICAgIHRva2Vuc1t0b2tlbl0oaW5wdXQsIGNvbmZpZy5fYSwgY29uZmlnLCB0b2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgWUVBUiA9IDA7XG4gICAgdmFyIE1PTlRIID0gMTtcbiAgICB2YXIgREFURSA9IDI7XG4gICAgdmFyIEhPVVIgPSAzO1xuICAgIHZhciBNSU5VVEUgPSA0O1xuICAgIHZhciBTRUNPTkQgPSA1O1xuICAgIHZhciBNSUxMSVNFQ09ORCA9IDY7XG5cbiAgICBmdW5jdGlvbiBkYXlzSW5Nb250aCh5ZWFyLCBtb250aCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoeWVhciwgbW9udGggKyAxLCAwKSkuZ2V0VVRDRGF0ZSgpO1xuICAgIH1cblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCdNJywgWydNTScsIDJdLCAnTW8nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vbnRoKCkgKyAxO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ01NTScsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1vbnRoc1Nob3J0KHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignTU1NTScsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1vbnRocyh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtb250aCcsICdNJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdNJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdNTScsICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ01NTScsICBtYXRjaFdvcmQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ01NTU0nLCBtYXRjaFdvcmQpO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ00nLCAnTU0nXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtNT05USF0gPSB0b0ludChpbnB1dCkgLSAxO1xuICAgIH0pO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ01NTScsICdNTU1NJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgdmFyIG1vbnRoID0gY29uZmlnLl9sb2NhbGUubW9udGhzUGFyc2UoaW5wdXQsIHRva2VuLCBjb25maWcuX3N0cmljdCk7XG4gICAgICAgIC8vIGlmIHdlIGRpZG4ndCBmaW5kIGEgbW9udGggbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkLlxuICAgICAgICBpZiAobW9udGggIT0gbnVsbCkge1xuICAgICAgICAgICAgYXJyYXlbTU9OVEhdID0gbW9udGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWcuX3BmLmludmFsaWRNb250aCA9IGlucHV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZU1vbnRocyA9ICdKYW51YXJ5X0ZlYnJ1YXJ5X01hcmNoX0FwcmlsX01heV9KdW5lX0p1bHlfQXVndXN0X1NlcHRlbWJlcl9PY3RvYmVyX05vdmVtYmVyX0RlY2VtYmVyJy5zcGxpdCgnXycpO1xuICAgIGZ1bmN0aW9uIGxvY2FsZU1vbnRocyAobSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzW20ubW9udGgoKV07XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVNb250aHNTaG9ydCA9ICdKYW5fRmViX01hcl9BcHJfTWF5X0p1bl9KdWxfQXVnX1NlcF9PY3RfTm92X0RlYycuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVNb250aHNTaG9ydCAobSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU2hvcnRbbS5tb250aCgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVNb250aHNQYXJzZSAobW9udGhOYW1lLCBmb3JtYXQsIHN0cmljdCkge1xuICAgICAgICB2YXIgaSwgbW9tLCByZWdleDtcblxuICAgICAgICBpZiAoIXRoaXMuX21vbnRoc1BhcnNlKSB7XG4gICAgICAgICAgICB0aGlzLl9tb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgICAgICBtb20gPSBjcmVhdGVfdXRjX19jcmVhdGVVVEMoWzIwMDAsIGldKTtcbiAgICAgICAgICAgIGlmIChzdHJpY3QgJiYgIXRoaXMuX2xvbmdNb250aHNQYXJzZVtpXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy5tb250aHMobW9tLCAnJykucmVwbGFjZSgnLicsICcnKSArICckJywgJ2knKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnJykgKyAnJCcsICdpJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXN0cmljdCAmJiAhdGhpcy5fbW9udGhzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICByZWdleCA9ICdeJyArIHRoaXMubW9udGhzKG1vbSwgJycpICsgJ3xeJyArIHRoaXMubW9udGhzU2hvcnQobW9tLCAnJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKHJlZ2V4LnJlcGxhY2UoJy4nLCAnJyksICdpJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiBmb3JtYXQgPT09ICdNTU1NJyAmJiB0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0udGVzdChtb250aE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0cmljdCAmJiBmb3JtYXQgPT09ICdNTU0nICYmIHRoaXMuX3Nob3J0TW9udGhzUGFyc2VbaV0udGVzdChtb250aE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzdHJpY3QgJiYgdGhpcy5fbW9udGhzUGFyc2VbaV0udGVzdChtb250aE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBzZXRNb250aCAobW9tLCB2YWx1ZSkge1xuICAgICAgICB2YXIgZGF5T2ZNb250aDtcblxuICAgICAgICAvLyBUT0RPOiBNb3ZlIHRoaXMgb3V0IG9mIGhlcmUhXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG1vbS5sb2NhbGVEYXRhKCkubW9udGhzUGFyc2UodmFsdWUpO1xuICAgICAgICAgICAgLy8gVE9ETzogQW5vdGhlciBzaWxlbnQgZmFpbHVyZT9cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGRheU9mTW9udGggPSBNYXRoLm1pbihtb20uZGF0ZSgpLCBkYXlzSW5Nb250aChtb20ueWVhcigpLCB2YWx1ZSkpO1xuICAgICAgICBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgJ01vbnRoJ10odmFsdWUsIGRheU9mTW9udGgpO1xuICAgICAgICByZXR1cm4gbW9tO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldE1vbnRoICh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgc2V0TW9udGgodGhpcywgdmFsdWUpO1xuICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldCh0aGlzLCB0cnVlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGdldF9zZXRfX2dldCh0aGlzLCAnTW9udGgnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERheXNJbk1vbnRoICgpIHtcbiAgICAgICAgcmV0dXJuIGRheXNJbk1vbnRoKHRoaXMueWVhcigpLCB0aGlzLm1vbnRoKCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrT3ZlcmZsb3cgKG0pIHtcbiAgICAgICAgdmFyIG92ZXJmbG93O1xuICAgICAgICB2YXIgYSA9IG0uX2E7XG5cbiAgICAgICAgaWYgKGEgJiYgbS5fcGYub3ZlcmZsb3cgPT09IC0yKSB7XG4gICAgICAgICAgICBvdmVyZmxvdyA9XG4gICAgICAgICAgICAgICAgYVtNT05USF0gICAgICAgPCAwIHx8IGFbTU9OVEhdICAgICAgID4gMTEgID8gTU9OVEggOlxuICAgICAgICAgICAgICAgIGFbREFURV0gICAgICAgIDwgMSB8fCBhW0RBVEVdICAgICAgICA+IGRheXNJbk1vbnRoKGFbWUVBUl0sIGFbTU9OVEhdKSA/IERBVEUgOlxuICAgICAgICAgICAgICAgIGFbSE9VUl0gICAgICAgIDwgMCB8fCBhW0hPVVJdICAgICAgICA+IDI0IHx8IChhW0hPVVJdID09PSAyNCAmJiAoYVtNSU5VVEVdICE9PSAwIHx8IGFbU0VDT05EXSAhPT0gMCB8fCBhW01JTExJU0VDT05EXSAhPT0gMCkpID8gSE9VUiA6XG4gICAgICAgICAgICAgICAgYVtNSU5VVEVdICAgICAgPCAwIHx8IGFbTUlOVVRFXSAgICAgID4gNTkgID8gTUlOVVRFIDpcbiAgICAgICAgICAgICAgICBhW1NFQ09ORF0gICAgICA8IDAgfHwgYVtTRUNPTkRdICAgICAgPiA1OSAgPyBTRUNPTkQgOlxuICAgICAgICAgICAgICAgIGFbTUlMTElTRUNPTkRdIDwgMCB8fCBhW01JTExJU0VDT05EXSA+IDk5OSA/IE1JTExJU0VDT05EIDpcbiAgICAgICAgICAgICAgICAtMTtcblxuICAgICAgICAgICAgaWYgKG0uX3BmLl9vdmVyZmxvd0RheU9mWWVhciAmJiAob3ZlcmZsb3cgPCBZRUFSIHx8IG92ZXJmbG93ID4gREFURSkpIHtcbiAgICAgICAgICAgICAgICBvdmVyZmxvdyA9IERBVEU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG0uX3BmLm92ZXJmbG93ID0gb3ZlcmZsb3c7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3YXJuKG1zZykge1xuICAgICAgICBpZiAodXRpbHNfaG9va3NfX2hvb2tzLnN1cHByZXNzRGVwcmVjYXRpb25XYXJuaW5ncyA9PT0gZmFsc2UgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdEZXByZWNhdGlvbiB3YXJuaW5nOiAnICsgbXNnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlcHJlY2F0ZShtc2csIGZuKSB7XG4gICAgICAgIHZhciBmaXJzdFRpbWUgPSB0cnVlO1xuICAgICAgICByZXR1cm4gZXh0ZW5kKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgICAgICAgICB3YXJuKG1zZyk7XG4gICAgICAgICAgICAgICAgZmlyc3RUaW1lID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSwgZm4pO1xuICAgIH1cblxuICAgIHZhciBkZXByZWNhdGlvbnMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGRlcHJlY2F0ZVNpbXBsZShuYW1lLCBtc2cpIHtcbiAgICAgICAgaWYgKCFkZXByZWNhdGlvbnNbbmFtZV0pIHtcbiAgICAgICAgICAgIHdhcm4obXNnKTtcbiAgICAgICAgICAgIGRlcHJlY2F0aW9uc1tuYW1lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1dGlsc19ob29rc19faG9va3Muc3VwcHJlc3NEZXByZWNhdGlvbldhcm5pbmdzID0gZmFsc2U7XG5cbiAgICB2YXIgZnJvbV9zdHJpbmdfX2lzb1JlZ2V4ID0gL15cXHMqKD86WystXVxcZHs2fXxcXGR7NH0pLSg/OihcXGRcXGQtXFxkXFxkKXwoV1xcZFxcZCQpfChXXFxkXFxkLVxcZCl8KFxcZFxcZFxcZCkpKChUfCApKFxcZFxcZCg6XFxkXFxkKDpcXGRcXGQoXFwuXFxkKyk/KT8pPyk/KFtcXCtcXC1dXFxkXFxkKD86Oj9cXGRcXGQpP3xcXHMqWik/KT8kLztcblxuICAgIHZhciBpc29EYXRlcyA9IFtcbiAgICAgICAgWydZWVlZWVktTU0tREQnLCAvWystXVxcZHs2fS1cXGR7Mn0tXFxkezJ9L10sXG4gICAgICAgIFsnWVlZWS1NTS1ERCcsIC9cXGR7NH0tXFxkezJ9LVxcZHsyfS9dLFxuICAgICAgICBbJ0dHR0ctW1ddV1ctRScsIC9cXGR7NH0tV1xcZHsyfS1cXGQvXSxcbiAgICAgICAgWydHR0dHLVtXXVdXJywgL1xcZHs0fS1XXFxkezJ9L10sXG4gICAgICAgIFsnWVlZWS1EREQnLCAvXFxkezR9LVxcZHszfS9dXG4gICAgXTtcblxuICAgIC8vIGlzbyB0aW1lIGZvcm1hdHMgYW5kIHJlZ2V4ZXNcbiAgICB2YXIgaXNvVGltZXMgPSBbXG4gICAgICAgIFsnSEg6bW06c3MuU1NTUycsIC8oVHwgKVxcZFxcZDpcXGRcXGQ6XFxkXFxkXFwuXFxkKy9dLFxuICAgICAgICBbJ0hIOm1tOnNzJywgLyhUfCApXFxkXFxkOlxcZFxcZDpcXGRcXGQvXSxcbiAgICAgICAgWydISDptbScsIC8oVHwgKVxcZFxcZDpcXGRcXGQvXSxcbiAgICAgICAgWydISCcsIC8oVHwgKVxcZFxcZC9dXG4gICAgXTtcblxuICAgIHZhciBhc3BOZXRKc29uUmVnZXggPSAvXlxcLz9EYXRlXFwoKFxcLT9cXGQrKS9pO1xuXG4gICAgLy8gZGF0ZSBmcm9tIGlzbyBmb3JtYXRcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tSVNPKGNvbmZpZykge1xuICAgICAgICB2YXIgaSwgbCxcbiAgICAgICAgICAgIHN0cmluZyA9IGNvbmZpZy5faSxcbiAgICAgICAgICAgIG1hdGNoID0gZnJvbV9zdHJpbmdfX2lzb1JlZ2V4LmV4ZWMoc3RyaW5nKTtcblxuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fcGYuaXNvID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSBpc29EYXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNvRGF0ZXNbaV1bMV0uZXhlYyhzdHJpbmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoWzVdIHNob3VsZCBiZSAnVCcgb3IgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5fZiA9IGlzb0RhdGVzW2ldWzBdICsgKG1hdGNoWzZdIHx8ICcgJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSBpc29UaW1lcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNvVGltZXNbaV1bMV0uZXhlYyhzdHJpbmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5fZiArPSBpc29UaW1lc1tpXVswXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0cmluZy5tYXRjaChtYXRjaE9mZnNldCkpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX2YgKz0gJ1onO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkYXRlIGZyb20gaXNvIGZvcm1hdCBvciBmYWxsYmFja1xuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21TdHJpbmcoY29uZmlnKSB7XG4gICAgICAgIHZhciBtYXRjaGVkID0gYXNwTmV0SnNvblJlZ2V4LmV4ZWMoY29uZmlnLl9pKTtcblxuICAgICAgICBpZiAobWF0Y2hlZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoK21hdGNoZWRbMV0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnRnJvbUlTTyhjb25maWcpO1xuICAgICAgICBpZiAoY29uZmlnLl9pc1ZhbGlkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgZGVsZXRlIGNvbmZpZy5faXNWYWxpZDtcbiAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayhjb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50IGNvbnN0cnVjdGlvbiBmYWxscyBiYWNrIHRvIGpzIERhdGUuIFRoaXMgaXMgJyArXG4gICAgICAgICdkaXNjb3VyYWdlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHVwY29taW5nIG1ham9yICcgK1xuICAgICAgICAncmVsZWFzZS4gUGxlYXNlIHJlZmVyIHRvICcgK1xuICAgICAgICAnaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE0MDcgZm9yIG1vcmUgaW5mby4nLFxuICAgICAgICBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShjb25maWcuX2kgKyAoY29uZmlnLl91c2VVVEMgPyAnIFVUQycgOiAnJykpO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZURhdGUgKHksIG0sIGQsIGgsIE0sIHMsIG1zKSB7XG4gICAgICAgIC8vY2FuJ3QganVzdCBhcHBseSgpIHRvIGNyZWF0ZSBhIGRhdGU6XG4gICAgICAgIC8vaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xODEzNDgvaW5zdGFudGlhdGluZy1hLWphdmFzY3JpcHQtb2JqZWN0LWJ5LWNhbGxpbmctcHJvdG90eXBlLWNvbnN0cnVjdG9yLWFwcGx5XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoeSwgbSwgZCwgaCwgTSwgcywgbXMpO1xuXG4gICAgICAgIC8vdGhlIGRhdGUgY29uc3RydWN0b3IgZG9lc24ndCBhY2NlcHQgeWVhcnMgPCAxOTcwXG4gICAgICAgIGlmICh5IDwgMTk3MCkge1xuICAgICAgICAgICAgZGF0ZS5zZXRGdWxsWWVhcih5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVVVENEYXRlICh5KSB7XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMuYXBwbHkobnVsbCwgYXJndW1lbnRzKSk7XG4gICAgICAgIGlmICh5IDwgMTk3MCkge1xuICAgICAgICAgICAgZGF0ZS5zZXRVVENGdWxsWWVhcih5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueWVhcigpICUgMTAwO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydZWVlZJywgICA0XSwgICAgICAgMCwgJ3llYXInKTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZWVlZJywgIDVdLCAgICAgICAwLCAneWVhcicpO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVlZWVlZJywgNiwgdHJ1ZV0sIDAsICd5ZWFyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3llYXInLCAneScpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignWScsICAgICAgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZJywgICAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdZWVlZJywgICBtYXRjaDF0bzQsIG1hdGNoNCk7XG4gICAgYWRkUmVnZXhUb2tlbignWVlZWVknLCAgbWF0Y2gxdG82LCBtYXRjaDYpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZWVlZWScsIG1hdGNoMXRvNiwgbWF0Y2g2KTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydZWVlZJywgJ1lZWVlZJywgJ1lZWVlZWSddLCBZRUFSKTtcbiAgICBhZGRQYXJzZVRva2VuKCdZWScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbWUVBUl0gPSB1dGlsc19ob29rc19faG9va3MucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgZnVuY3Rpb24gZGF5c0luWWVhcih5ZWFyKSB7XG4gICAgICAgIHJldHVybiBpc0xlYXBZZWFyKHllYXIpID8gMzY2IDogMzY1O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTGVhcFllYXIoeWVhcikge1xuICAgICAgICByZXR1cm4gKHllYXIgJSA0ID09PSAwICYmIHllYXIgJSAxMDAgIT09IDApIHx8IHllYXIgJSA0MDAgPT09IDA7XG4gICAgfVxuXG4gICAgLy8gSE9PS1NcblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5wYXJzZVR3b0RpZ2l0WWVhciA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICByZXR1cm4gdG9JbnQoaW5wdXQpICsgKHRvSW50KGlucHV0KSA+IDY4ID8gMTkwMCA6IDIwMDApO1xuICAgIH07XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0WWVhciA9IG1ha2VHZXRTZXQoJ0Z1bGxZZWFyJywgZmFsc2UpO1xuXG4gICAgZnVuY3Rpb24gZ2V0SXNMZWFwWWVhciAoKSB7XG4gICAgICAgIHJldHVybiBpc0xlYXBZZWFyKHRoaXMueWVhcigpKTtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbigndycsIFsnd3cnLCAyXSwgJ3dvJywgJ3dlZWsnKTtcbiAgICBhZGRGb3JtYXRUb2tlbignVycsIFsnV1cnLCAyXSwgJ1dvJywgJ2lzb1dlZWsnKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnd2VlaycsICd3Jyk7XG4gICAgYWRkVW5pdEFsaWFzKCdpc29XZWVrJywgJ1cnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ3cnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCd3dycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdXJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignV1cnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ3cnLCAnd3cnLCAnVycsICdXVyddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgd2Vla1t0b2tlbi5zdWJzdHIoMCwgMSldID0gdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgLy8gZmlyc3REYXlPZldlZWsgICAgICAgMCA9IHN1biwgNiA9IHNhdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIHRoZSBkYXkgb2YgdGhlIHdlZWsgdGhhdCBzdGFydHMgdGhlIHdlZWtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAodXN1YWxseSBzdW5kYXkgb3IgbW9uZGF5KVxuICAgIC8vIGZpcnN0RGF5T2ZXZWVrT2ZZZWFyIDAgPSBzdW4sIDYgPSBzYXRcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICB0aGUgZmlyc3Qgd2VlayBpcyB0aGUgd2VlayB0aGF0IGNvbnRhaW5zIHRoZSBmaXJzdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIG9mIHRoaXMgZGF5IG9mIHRoZSB3ZWVrXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgKGVnLiBJU08gd2Vla3MgdXNlIHRodXJzZGF5ICg0KSlcbiAgICBmdW5jdGlvbiB3ZWVrT2ZZZWFyKG1vbSwgZmlyc3REYXlPZldlZWssIGZpcnN0RGF5T2ZXZWVrT2ZZZWFyKSB7XG4gICAgICAgIHZhciBlbmQgPSBmaXJzdERheU9mV2Vla09mWWVhciAtIGZpcnN0RGF5T2ZXZWVrLFxuICAgICAgICAgICAgZGF5c1RvRGF5T2ZXZWVrID0gZmlyc3REYXlPZldlZWtPZlllYXIgLSBtb20uZGF5KCksXG4gICAgICAgICAgICBhZGp1c3RlZE1vbWVudDtcblxuXG4gICAgICAgIGlmIChkYXlzVG9EYXlPZldlZWsgPiBlbmQpIHtcbiAgICAgICAgICAgIGRheXNUb0RheU9mV2VlayAtPSA3O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRheXNUb0RheU9mV2VlayA8IGVuZCAtIDcpIHtcbiAgICAgICAgICAgIGRheXNUb0RheU9mV2VlayArPSA3O1xuICAgICAgICB9XG5cbiAgICAgICAgYWRqdXN0ZWRNb21lbnQgPSBsb2NhbF9fY3JlYXRlTG9jYWwobW9tKS5hZGQoZGF5c1RvRGF5T2ZXZWVrLCAnZCcpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2VlazogTWF0aC5jZWlsKGFkanVzdGVkTW9tZW50LmRheU9mWWVhcigpIC8gNyksXG4gICAgICAgICAgICB5ZWFyOiBhZGp1c3RlZE1vbWVudC55ZWFyKClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrIChtb20pIHtcbiAgICAgICAgcmV0dXJuIHdlZWtPZlllYXIobW9tLCB0aGlzLl93ZWVrLmRvdywgdGhpcy5fd2Vlay5kb3kpLndlZWs7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrID0ge1xuICAgICAgICBkb3cgOiAwLCAvLyBTdW5kYXkgaXMgdGhlIGZpcnN0IGRheSBvZiB0aGUgd2Vlay5cbiAgICAgICAgZG95IDogNiAgLy8gVGhlIHdlZWsgdGhhdCBjb250YWlucyBKYW4gMXN0IGlzIHRoZSBmaXJzdCB3ZWVrIG9mIHRoZSB5ZWFyLlxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVGaXJzdERheU9mV2VlayAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWVrLmRvdztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVGaXJzdERheU9mWWVhciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWVrLmRveTtcbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXRXZWVrIChpbnB1dCkge1xuICAgICAgICB2YXIgd2VlayA9IHRoaXMubG9jYWxlRGF0YSgpLndlZWsodGhpcyk7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2VlayA6IHRoaXMuYWRkKChpbnB1dCAtIHdlZWspICogNywgJ2QnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRJU09XZWVrIChpbnB1dCkge1xuICAgICAgICB2YXIgd2VlayA9IHdlZWtPZlllYXIodGhpcywgMSwgNCkud2VlaztcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrIDogdGhpcy5hZGQoKGlucHV0IC0gd2VlaykgKiA3LCAnZCcpO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKCdEREQnLCBbJ0REREQnLCAzXSwgJ0RERG8nLCAnZGF5T2ZZZWFyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2RheU9mWWVhcicsICdEREQnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ0RERCcsICBtYXRjaDF0bzMpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0REREQnLCBtYXRjaDMpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydEREQnLCAnRERERCddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPSB0b0ludChpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICAvL2h0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSVNPX3dlZWtfZGF0ZSNDYWxjdWxhdGluZ19hX2RhdGVfZ2l2ZW5fdGhlX3llYXIuMkNfd2Vla19udW1iZXJfYW5kX3dlZWtkYXlcbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla3MoeWVhciwgd2Vlaywgd2Vla2RheSwgZmlyc3REYXlPZldlZWtPZlllYXIsIGZpcnN0RGF5T2ZXZWVrKSB7XG4gICAgICAgIHZhciBkID0gY3JlYXRlVVRDRGF0ZSh5ZWFyLCAwLCAxKS5nZXRVVENEYXkoKTtcbiAgICAgICAgdmFyIGRheXNUb0FkZDtcbiAgICAgICAgdmFyIGRheU9mWWVhcjtcblxuICAgICAgICBkID0gZCA9PT0gMCA/IDcgOiBkO1xuICAgICAgICB3ZWVrZGF5ID0gd2Vla2RheSAhPSBudWxsID8gd2Vla2RheSA6IGZpcnN0RGF5T2ZXZWVrO1xuICAgICAgICBkYXlzVG9BZGQgPSBmaXJzdERheU9mV2VlayAtIGQgKyAoZCA+IGZpcnN0RGF5T2ZXZWVrT2ZZZWFyID8gNyA6IDApIC0gKGQgPCBmaXJzdERheU9mV2VlayA/IDcgOiAwKTtcbiAgICAgICAgZGF5T2ZZZWFyID0gNyAqICh3ZWVrIC0gMSkgKyAod2Vla2RheSAtIGZpcnN0RGF5T2ZXZWVrKSArIGRheXNUb0FkZCArIDE7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHllYXIgICAgICA6IGRheU9mWWVhciA+IDAgPyB5ZWFyICAgICAgOiB5ZWFyIC0gMSxcbiAgICAgICAgICAgIGRheU9mWWVhciA6IGRheU9mWWVhciA+IDAgPyBkYXlPZlllYXIgOiBkYXlzSW5ZZWFyKHllYXIgLSAxKSArIGRheU9mWWVhclxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldERheU9mWWVhciAoaW5wdXQpIHtcbiAgICAgICAgdmFyIGRheU9mWWVhciA9IE1hdGgucm91bmQoKHRoaXMuY2xvbmUoKS5zdGFydE9mKCdkYXknKSAtIHRoaXMuY2xvbmUoKS5zdGFydE9mKCd5ZWFyJykpIC8gODY0ZTUpICsgMTtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyBkYXlPZlllYXIgOiB0aGlzLmFkZCgoaW5wdXQgLSBkYXlPZlllYXIpLCAnZCcpO1xuICAgIH1cblxuICAgIC8vIFBpY2sgdGhlIGZpcnN0IGRlZmluZWQgb2YgdHdvIG9yIHRocmVlIGFyZ3VtZW50cy5cbiAgICBmdW5jdGlvbiBkZWZhdWx0cyhhLCBiLCBjKSB7XG4gICAgICAgIGlmIChhICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGN1cnJlbnREYXRlQXJyYXkoY29uZmlnKSB7XG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBpZiAoY29uZmlnLl91c2VVVEMpIHtcbiAgICAgICAgICAgIHJldHVybiBbbm93LmdldFVUQ0Z1bGxZZWFyKCksIG5vdy5nZXRVVENNb250aCgpLCBub3cuZ2V0VVRDRGF0ZSgpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW25vdy5nZXRGdWxsWWVhcigpLCBub3cuZ2V0TW9udGgoKSwgbm93LmdldERhdGUoKV07XG4gICAgfVxuXG4gICAgLy8gY29udmVydCBhbiBhcnJheSB0byBhIGRhdGUuXG4gICAgLy8gdGhlIGFycmF5IHNob3VsZCBtaXJyb3IgdGhlIHBhcmFtZXRlcnMgYmVsb3dcbiAgICAvLyBub3RlOiBhbGwgdmFsdWVzIHBhc3QgdGhlIHllYXIgYXJlIG9wdGlvbmFsIGFuZCB3aWxsIGRlZmF1bHQgdG8gdGhlIGxvd2VzdCBwb3NzaWJsZSB2YWx1ZS5cbiAgICAvLyBbeWVhciwgbW9udGgsIGRheSAsIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCBtaWxsaXNlY29uZF1cbiAgICBmdW5jdGlvbiBjb25maWdGcm9tQXJyYXkgKGNvbmZpZykge1xuICAgICAgICB2YXIgaSwgZGF0ZSwgaW5wdXQgPSBbXSwgY3VycmVudERhdGUsIHllYXJUb1VzZTtcblxuICAgICAgICBpZiAoY29uZmlnLl9kKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50RGF0ZSA9IGN1cnJlbnREYXRlQXJyYXkoY29uZmlnKTtcblxuICAgICAgICAvL2NvbXB1dGUgZGF5IG9mIHRoZSB5ZWFyIGZyb20gd2Vla3MgYW5kIHdlZWtkYXlzXG4gICAgICAgIGlmIChjb25maWcuX3cgJiYgY29uZmlnLl9hW0RBVEVdID09IG51bGwgJiYgY29uZmlnLl9hW01PTlRIXSA9PSBudWxsKSB7XG4gICAgICAgICAgICBkYXlPZlllYXJGcm9tV2Vla0luZm8oY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vaWYgdGhlIGRheSBvZiB0aGUgeWVhciBpcyBzZXQsIGZpZ3VyZSBvdXQgd2hhdCBpdCBpc1xuICAgICAgICBpZiAoY29uZmlnLl9kYXlPZlllYXIpIHtcbiAgICAgICAgICAgIHllYXJUb1VzZSA9IGRlZmF1bHRzKGNvbmZpZy5fYVtZRUFSXSwgY3VycmVudERhdGVbWUVBUl0pO1xuXG4gICAgICAgICAgICBpZiAoY29uZmlnLl9kYXlPZlllYXIgPiBkYXlzSW5ZZWFyKHllYXJUb1VzZSkpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX3BmLl9vdmVyZmxvd0RheU9mWWVhciA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGUgPSBjcmVhdGVVVENEYXRlKHllYXJUb1VzZSwgMCwgY29uZmlnLl9kYXlPZlllYXIpO1xuICAgICAgICAgICAgY29uZmlnLl9hW01PTlRIXSA9IGRhdGUuZ2V0VVRDTW9udGgoKTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtEQVRFXSA9IGRhdGUuZ2V0VVRDRGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGVmYXVsdCB0byBjdXJyZW50IGRhdGUuXG4gICAgICAgIC8vICogaWYgbm8geWVhciwgbW9udGgsIGRheSBvZiBtb250aCBhcmUgZ2l2ZW4sIGRlZmF1bHQgdG8gdG9kYXlcbiAgICAgICAgLy8gKiBpZiBkYXkgb2YgbW9udGggaXMgZ2l2ZW4sIGRlZmF1bHQgbW9udGggYW5kIHllYXJcbiAgICAgICAgLy8gKiBpZiBtb250aCBpcyBnaXZlbiwgZGVmYXVsdCBvbmx5IHllYXJcbiAgICAgICAgLy8gKiBpZiB5ZWFyIGlzIGdpdmVuLCBkb24ndCBkZWZhdWx0IGFueXRoaW5nXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAzICYmIGNvbmZpZy5fYVtpXSA9PSBudWxsOyArK2kpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtpXSA9IGlucHV0W2ldID0gY3VycmVudERhdGVbaV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBaZXJvIG91dCB3aGF0ZXZlciB3YXMgbm90IGRlZmF1bHRlZCwgaW5jbHVkaW5nIHRpbWVcbiAgICAgICAgZm9yICg7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtpXSA9IGlucHV0W2ldID0gKGNvbmZpZy5fYVtpXSA9PSBudWxsKSA/IChpID09PSAyID8gMSA6IDApIDogY29uZmlnLl9hW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgZm9yIDI0OjAwOjAwLjAwMFxuICAgICAgICBpZiAoY29uZmlnLl9hW0hPVVJdID09PSAyNCAmJlxuICAgICAgICAgICAgICAgIGNvbmZpZy5fYVtNSU5VVEVdID09PSAwICYmXG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW1NFQ09ORF0gPT09IDAgJiZcbiAgICAgICAgICAgICAgICBjb25maWcuX2FbTUlMTElTRUNPTkRdID09PSAwKSB7XG4gICAgICAgICAgICBjb25maWcuX25leHREYXkgPSB0cnVlO1xuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZy5fZCA9IChjb25maWcuX3VzZVVUQyA/IGNyZWF0ZVVUQ0RhdGUgOiBjcmVhdGVEYXRlKS5hcHBseShudWxsLCBpbnB1dCk7XG4gICAgICAgIC8vIEFwcGx5IHRpbWV6b25lIG9mZnNldCBmcm9tIGlucHV0LiBUaGUgYWN0dWFsIHV0Y09mZnNldCBjYW4gYmUgY2hhbmdlZFxuICAgICAgICAvLyB3aXRoIHBhcnNlWm9uZS5cbiAgICAgICAgaWYgKGNvbmZpZy5fdHptICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZC5zZXRVVENNaW51dGVzKGNvbmZpZy5fZC5nZXRVVENNaW51dGVzKCkgLSBjb25maWcuX3R6bSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnLl9uZXh0RGF5KSB7XG4gICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gPSAyNDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheU9mWWVhckZyb21XZWVrSW5mbyhjb25maWcpIHtcbiAgICAgICAgdmFyIHcsIHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSwgdGVtcDtcblxuICAgICAgICB3ID0gY29uZmlnLl93O1xuICAgICAgICBpZiAody5HRyAhPSBudWxsIHx8IHcuVyAhPSBudWxsIHx8IHcuRSAhPSBudWxsKSB7XG4gICAgICAgICAgICBkb3cgPSAxO1xuICAgICAgICAgICAgZG95ID0gNDtcblxuICAgICAgICAgICAgLy8gVE9ETzogV2UgbmVlZCB0byB0YWtlIHRoZSBjdXJyZW50IGlzb1dlZWtZZWFyLCBidXQgdGhhdCBkZXBlbmRzIG9uXG4gICAgICAgICAgICAvLyBob3cgd2UgaW50ZXJwcmV0IG5vdyAobG9jYWwsIHV0YywgZml4ZWQgb2Zmc2V0KS4gU28gY3JlYXRlXG4gICAgICAgICAgICAvLyBhIG5vdyB2ZXJzaW9uIG9mIGN1cnJlbnQgY29uZmlnICh0YWtlIGxvY2FsL3V0Yy9vZmZzZXQgZmxhZ3MsIGFuZFxuICAgICAgICAgICAgLy8gY3JlYXRlIG5vdykuXG4gICAgICAgICAgICB3ZWVrWWVhciA9IGRlZmF1bHRzKHcuR0csIGNvbmZpZy5fYVtZRUFSXSwgd2Vla09mWWVhcihsb2NhbF9fY3JlYXRlTG9jYWwoKSwgMSwgNCkueWVhcik7XG4gICAgICAgICAgICB3ZWVrID0gZGVmYXVsdHMody5XLCAxKTtcbiAgICAgICAgICAgIHdlZWtkYXkgPSBkZWZhdWx0cyh3LkUsIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG93ID0gY29uZmlnLl9sb2NhbGUuX3dlZWsuZG93O1xuICAgICAgICAgICAgZG95ID0gY29uZmlnLl9sb2NhbGUuX3dlZWsuZG95O1xuXG4gICAgICAgICAgICB3ZWVrWWVhciA9IGRlZmF1bHRzKHcuZ2csIGNvbmZpZy5fYVtZRUFSXSwgd2Vla09mWWVhcihsb2NhbF9fY3JlYXRlTG9jYWwoKSwgZG93LCBkb3kpLnllYXIpO1xuICAgICAgICAgICAgd2VlayA9IGRlZmF1bHRzKHcudywgMSk7XG5cbiAgICAgICAgICAgIGlmICh3LmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIHdlZWtkYXkgLS0gbG93IGRheSBudW1iZXJzIGFyZSBjb25zaWRlcmVkIG5leHQgd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSB3LmQ7XG4gICAgICAgICAgICAgICAgaWYgKHdlZWtkYXkgPCBkb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgKyt3ZWVrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAody5lICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBsb2NhbCB3ZWVrZGF5IC0tIGNvdW50aW5nIHN0YXJ0cyBmcm9tIGJlZ2luaW5nIG9mIHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gdy5lICsgZG93O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBkZWZhdWx0IHRvIGJlZ2luaW5nIG9mIHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gZG93O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXAgPSBkYXlPZlllYXJGcm9tV2Vla3Mod2Vla1llYXIsIHdlZWssIHdlZWtkYXksIGRveSwgZG93KTtcblxuICAgICAgICBjb25maWcuX2FbWUVBUl0gPSB0ZW1wLnllYXI7XG4gICAgICAgIGNvbmZpZy5fZGF5T2ZZZWFyID0gdGVtcC5kYXlPZlllYXI7XG4gICAgfVxuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLklTT184NjAxID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAvLyBkYXRlIGZyb20gc3RyaW5nIGFuZCBmb3JtYXQgc3RyaW5nXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpIHtcbiAgICAgICAgLy8gVE9ETzogTW92ZSB0aGlzIHRvIGFub3RoZXIgcGFydCBvZiB0aGUgY3JlYXRpb24gZmxvdyB0byBwcmV2ZW50IGNpcmN1bGFyIGRlcHNcbiAgICAgICAgaWYgKGNvbmZpZy5fZiA9PT0gdXRpbHNfaG9va3NfX2hvb2tzLklTT184NjAxKSB7XG4gICAgICAgICAgICBjb25maWdGcm9tSVNPKGNvbmZpZyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWcuX2EgPSBbXTtcbiAgICAgICAgY29uZmlnLl9wZi5lbXB0eSA9IHRydWU7XG5cbiAgICAgICAgLy8gVGhpcyBhcnJheSBpcyB1c2VkIHRvIG1ha2UgYSBEYXRlLCBlaXRoZXIgd2l0aCBgbmV3IERhdGVgIG9yIGBEYXRlLlVUQ2BcbiAgICAgICAgdmFyIHN0cmluZyA9ICcnICsgY29uZmlnLl9pLFxuICAgICAgICAgICAgaSwgcGFyc2VkSW5wdXQsIHRva2VucywgdG9rZW4sIHNraXBwZWQsXG4gICAgICAgICAgICBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoLFxuICAgICAgICAgICAgdG90YWxQYXJzZWRJbnB1dExlbmd0aCA9IDA7XG5cbiAgICAgICAgdG9rZW5zID0gZXhwYW5kRm9ybWF0KGNvbmZpZy5fZiwgY29uZmlnLl9sb2NhbGUpLm1hdGNoKGZvcm1hdHRpbmdUb2tlbnMpIHx8IFtdO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgcGFyc2VkSW5wdXQgPSAoc3RyaW5nLm1hdGNoKGdldFBhcnNlUmVnZXhGb3JUb2tlbih0b2tlbiwgY29uZmlnKSkgfHwgW10pWzBdO1xuICAgICAgICAgICAgaWYgKHBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgc2tpcHBlZCA9IHN0cmluZy5zdWJzdHIoMCwgc3RyaW5nLmluZGV4T2YocGFyc2VkSW5wdXQpKTtcbiAgICAgICAgICAgICAgICBpZiAoc2tpcHBlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5fcGYudW51c2VkSW5wdXQucHVzaChza2lwcGVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RyaW5nID0gc3RyaW5nLnNsaWNlKHN0cmluZy5pbmRleE9mKHBhcnNlZElucHV0KSArIHBhcnNlZElucHV0Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdG90YWxQYXJzZWRJbnB1dExlbmd0aCArPSBwYXJzZWRJbnB1dC5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBkb24ndCBwYXJzZSBpZiBpdCdzIG5vdCBhIGtub3duIHRva2VuXG4gICAgICAgICAgICBpZiAoZm9ybWF0VG9rZW5GdW5jdGlvbnNbdG9rZW5dKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5fcGYuZW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5fcGYudW51c2VkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhZGRUaW1lVG9BcnJheUZyb21Ub2tlbih0b2tlbiwgcGFyc2VkSW5wdXQsIGNvbmZpZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjb25maWcuX3N0cmljdCAmJiAhcGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX3BmLnVudXNlZFRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFkZCByZW1haW5pbmcgdW5wYXJzZWQgaW5wdXQgbGVuZ3RoIHRvIHRoZSBzdHJpbmdcbiAgICAgICAgY29uZmlnLl9wZi5jaGFyc0xlZnRPdmVyID0gc3RyaW5nTGVuZ3RoIC0gdG90YWxQYXJzZWRJbnB1dExlbmd0aDtcbiAgICAgICAgaWYgKHN0cmluZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25maWcuX3BmLnVudXNlZElucHV0LnB1c2goc3RyaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNsZWFyIF8xMmggZmxhZyBpZiBob3VyIGlzIDw9IDEyXG4gICAgICAgIGlmIChjb25maWcuX3BmLmJpZ0hvdXIgPT09IHRydWUgJiYgY29uZmlnLl9hW0hPVVJdIDw9IDEyKSB7XG4gICAgICAgICAgICBjb25maWcuX3BmLmJpZ0hvdXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaGFuZGxlIG1lcmlkaWVtXG4gICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IG1lcmlkaWVtRml4V3JhcChjb25maWcuX2xvY2FsZSwgY29uZmlnLl9hW0hPVVJdLCBjb25maWcuX21lcmlkaWVtKTtcblxuICAgICAgICBjb25maWdGcm9tQXJyYXkoY29uZmlnKTtcbiAgICAgICAgY2hlY2tPdmVyZmxvdyhjb25maWcpO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gbWVyaWRpZW1GaXhXcmFwIChsb2NhbGUsIGhvdXIsIG1lcmlkaWVtKSB7XG4gICAgICAgIHZhciBpc1BtO1xuXG4gICAgICAgIGlmIChtZXJpZGllbSA9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBub3RoaW5nIHRvIGRvXG4gICAgICAgICAgICByZXR1cm4gaG91cjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9jYWxlLm1lcmlkaWVtSG91ciAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxlLm1lcmlkaWVtSG91cihob3VyLCBtZXJpZGllbSk7XG4gICAgICAgIH0gZWxzZSBpZiAobG9jYWxlLmlzUE0gIT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gRmFsbGJhY2tcbiAgICAgICAgICAgIGlzUG0gPSBsb2NhbGUuaXNQTShtZXJpZGllbSk7XG4gICAgICAgICAgICBpZiAoaXNQbSAmJiBob3VyIDwgMTIpIHtcbiAgICAgICAgICAgICAgICBob3VyICs9IDEyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc1BtICYmIGhvdXIgPT09IDEyKSB7XG4gICAgICAgICAgICAgICAgaG91ciA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaG91cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgbm90IHN1cHBvc2VkIHRvIGhhcHBlblxuICAgICAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb25maWdGcm9tU3RyaW5nQW5kQXJyYXkoY29uZmlnKSB7XG4gICAgICAgIHZhciB0ZW1wQ29uZmlnLFxuICAgICAgICAgICAgYmVzdE1vbWVudCxcblxuICAgICAgICAgICAgc2NvcmVUb0JlYXQsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgY3VycmVudFNjb3JlO1xuXG4gICAgICAgIGlmIChjb25maWcuX2YubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBjb25maWcuX3BmLmludmFsaWRGb3JtYXQgPSB0cnVlO1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoTmFOKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb25maWcuX2YubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSA9IDA7XG4gICAgICAgICAgICB0ZW1wQ29uZmlnID0gY29weUNvbmZpZyh7fSwgY29uZmlnKTtcbiAgICAgICAgICAgIGlmIChjb25maWcuX3VzZVVUQyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGVtcENvbmZpZy5fdXNlVVRDID0gY29uZmlnLl91c2VVVEM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZW1wQ29uZmlnLl9wZiA9IGRlZmF1bHRQYXJzaW5nRmxhZ3MoKTtcbiAgICAgICAgICAgIHRlbXBDb25maWcuX2YgPSBjb25maWcuX2ZbaV07XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KHRlbXBDb25maWcpO1xuXG4gICAgICAgICAgICBpZiAoIXZhbGlkX19pc1ZhbGlkKHRlbXBDb25maWcpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGFueSBpbnB1dCB0aGF0IHdhcyBub3QgcGFyc2VkIGFkZCBhIHBlbmFsdHkgZm9yIHRoYXQgZm9ybWF0XG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgKz0gdGVtcENvbmZpZy5fcGYuY2hhcnNMZWZ0T3ZlcjtcblxuICAgICAgICAgICAgLy9vciB0b2tlbnNcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSArPSB0ZW1wQ29uZmlnLl9wZi51bnVzZWRUb2tlbnMubGVuZ3RoICogMTA7XG5cbiAgICAgICAgICAgIHRlbXBDb25maWcuX3BmLnNjb3JlID0gY3VycmVudFNjb3JlO1xuXG4gICAgICAgICAgICBpZiAoc2NvcmVUb0JlYXQgPT0gbnVsbCB8fCBjdXJyZW50U2NvcmUgPCBzY29yZVRvQmVhdCkge1xuICAgICAgICAgICAgICAgIHNjb3JlVG9CZWF0ID0gY3VycmVudFNjb3JlO1xuICAgICAgICAgICAgICAgIGJlc3RNb21lbnQgPSB0ZW1wQ29uZmlnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXh0ZW5kKGNvbmZpZywgYmVzdE1vbWVudCB8fCB0ZW1wQ29uZmlnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb25maWdGcm9tT2JqZWN0KGNvbmZpZykge1xuICAgICAgICBpZiAoY29uZmlnLl9kKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaSA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKGNvbmZpZy5faSk7XG4gICAgICAgIGNvbmZpZy5fYSA9IFtpLnllYXIsIGkubW9udGgsIGkuZGF5IHx8IGkuZGF0ZSwgaS5ob3VyLCBpLm1pbnV0ZSwgaS5zZWNvbmQsIGkubWlsbGlzZWNvbmRdO1xuXG4gICAgICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUZyb21Db25maWcgKGNvbmZpZykge1xuICAgICAgICB2YXIgaW5wdXQgPSBjb25maWcuX2ksXG4gICAgICAgICAgICBmb3JtYXQgPSBjb25maWcuX2YsXG4gICAgICAgICAgICByZXM7XG5cbiAgICAgICAgY29uZmlnLl9sb2NhbGUgPSBjb25maWcuX2xvY2FsZSB8fCBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKGNvbmZpZy5fbCk7XG5cbiAgICAgICAgaWYgKGlucHV0ID09PSBudWxsIHx8IChmb3JtYXQgPT09IHVuZGVmaW5lZCAmJiBpbnB1dCA9PT0gJycpKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsaWRfX2NyZWF0ZUludmFsaWQoe251bGxJbnB1dDogdHJ1ZX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbmZpZy5faSA9IGlucHV0ID0gY29uZmlnLl9sb2NhbGUucHJlcGFyc2UoaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTW9tZW50KGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNb21lbnQoY2hlY2tPdmVyZmxvdyhpbnB1dCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoZm9ybWF0KSkge1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0KSB7XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWdGcm9tSW5wdXQoY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcyA9IG5ldyBNb21lbnQoY2hlY2tPdmVyZmxvdyhjb25maWcpKTtcbiAgICAgICAgaWYgKHJlcy5fbmV4dERheSkge1xuICAgICAgICAgICAgLy8gQWRkaW5nIGlzIHNtYXJ0IGVub3VnaCBhcm91bmQgRFNUXG4gICAgICAgICAgICByZXMuYWRkKDEsICdkJyk7XG4gICAgICAgICAgICByZXMuX25leHREYXkgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21JbnB1dChjb25maWcpIHtcbiAgICAgICAgdmFyIGlucHV0ID0gY29uZmlnLl9pO1xuICAgICAgICBpZiAoaW5wdXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0RhdGUoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSgraW5wdXQpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmcoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9hID0gbWFwKGlucHV0LnNsaWNlKDApLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KG9iaiwgMTApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25maWdGcm9tQXJyYXkoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YoaW5wdXQpID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgY29uZmlnRnJvbU9iamVjdChjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZihpbnB1dCkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAvLyBmcm9tIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoaW5wdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrKGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVMb2NhbE9yVVRDIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCwgaXNVVEMpIHtcbiAgICAgICAgdmFyIGMgPSB7fTtcblxuICAgICAgICBpZiAodHlwZW9mKGxvY2FsZSkgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgc3RyaWN0ID0gbG9jYWxlO1xuICAgICAgICAgICAgbG9jYWxlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9iamVjdCBjb25zdHJ1Y3Rpb24gbXVzdCBiZSBkb25lIHRoaXMgd2F5LlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTQyM1xuICAgICAgICBjLl9pc0FNb21lbnRPYmplY3QgPSB0cnVlO1xuICAgICAgICBjLl91c2VVVEMgPSBjLl9pc1VUQyA9IGlzVVRDO1xuICAgICAgICBjLl9sID0gbG9jYWxlO1xuICAgICAgICBjLl9pID0gaW5wdXQ7XG4gICAgICAgIGMuX2YgPSBmb3JtYXQ7XG4gICAgICAgIGMuX3N0cmljdCA9IHN0cmljdDtcbiAgICAgICAgYy5fcGYgPSBkZWZhdWx0UGFyc2luZ0ZsYWdzKCk7XG5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZUZyb21Db25maWcoYyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxfX2NyZWF0ZUxvY2FsIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlTG9jYWxPclVUQyhpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCwgZmFsc2UpO1xuICAgIH1cblxuICAgIHZhciBwcm90b3R5cGVNaW4gPSBkZXByZWNhdGUoXG4gICAgICAgICAnbW9tZW50KCkubWluIGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQubWluIGluc3RlYWQuIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNTQ4JyxcbiAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICB2YXIgb3RoZXIgPSBsb2NhbF9fY3JlYXRlTG9jYWwuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICByZXR1cm4gb3RoZXIgPCB0aGlzID8gdGhpcyA6IG90aGVyO1xuICAgICAgICAgfVxuICAgICApO1xuXG4gICAgdmFyIHByb3RvdHlwZU1heCA9IGRlcHJlY2F0ZShcbiAgICAgICAgJ21vbWVudCgpLm1heCBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50Lm1heCBpbnN0ZWFkLiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTU0OCcsXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBvdGhlciA9IGxvY2FsX19jcmVhdGVMb2NhbC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgcmV0dXJuIG90aGVyID4gdGhpcyA/IHRoaXMgOiBvdGhlcjtcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICAvLyBQaWNrIGEgbW9tZW50IG0gZnJvbSBtb21lbnRzIHNvIHRoYXQgbVtmbl0ob3RoZXIpIGlzIHRydWUgZm9yIGFsbFxuICAgIC8vIG90aGVyLiBUaGlzIHJlbGllcyBvbiB0aGUgZnVuY3Rpb24gZm4gdG8gYmUgdHJhbnNpdGl2ZS5cbiAgICAvL1xuICAgIC8vIG1vbWVudHMgc2hvdWxkIGVpdGhlciBiZSBhbiBhcnJheSBvZiBtb21lbnQgb2JqZWN0cyBvciBhbiBhcnJheSwgd2hvc2VcbiAgICAvLyBmaXJzdCBlbGVtZW50IGlzIGFuIGFycmF5IG9mIG1vbWVudCBvYmplY3RzLlxuICAgIGZ1bmN0aW9uIHBpY2tCeShmbiwgbW9tZW50cykge1xuICAgICAgICB2YXIgcmVzLCBpO1xuICAgICAgICBpZiAobW9tZW50cy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShtb21lbnRzWzBdKSkge1xuICAgICAgICAgICAgbW9tZW50cyA9IG1vbWVudHNbMF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtb21lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsX19jcmVhdGVMb2NhbCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlcyA9IG1vbWVudHNbMF07XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBtb21lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAobW9tZW50c1tpXVtmbl0ocmVzKSkge1xuICAgICAgICAgICAgICAgIHJlcyA9IG1vbWVudHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBVc2UgW10uc29ydCBpbnN0ZWFkP1xuICAgIGZ1bmN0aW9uIG1pbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgIHJldHVybiBwaWNrQnkoJ2lzQmVmb3JlJywgYXJncyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWF4ICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgcmV0dXJuIHBpY2tCeSgnaXNBZnRlcicsIGFyZ3MpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIER1cmF0aW9uIChkdXJhdGlvbikge1xuICAgICAgICB2YXIgbm9ybWFsaXplZElucHV0ID0gbm9ybWFsaXplT2JqZWN0VW5pdHMoZHVyYXRpb24pLFxuICAgICAgICAgICAgeWVhcnMgPSBub3JtYWxpemVkSW5wdXQueWVhciB8fCAwLFxuICAgICAgICAgICAgcXVhcnRlcnMgPSBub3JtYWxpemVkSW5wdXQucXVhcnRlciB8fCAwLFxuICAgICAgICAgICAgbW9udGhzID0gbm9ybWFsaXplZElucHV0Lm1vbnRoIHx8IDAsXG4gICAgICAgICAgICB3ZWVrcyA9IG5vcm1hbGl6ZWRJbnB1dC53ZWVrIHx8IDAsXG4gICAgICAgICAgICBkYXlzID0gbm9ybWFsaXplZElucHV0LmRheSB8fCAwLFxuICAgICAgICAgICAgaG91cnMgPSBub3JtYWxpemVkSW5wdXQuaG91ciB8fCAwLFxuICAgICAgICAgICAgbWludXRlcyA9IG5vcm1hbGl6ZWRJbnB1dC5taW51dGUgfHwgMCxcbiAgICAgICAgICAgIHNlY29uZHMgPSBub3JtYWxpemVkSW5wdXQuc2Vjb25kIHx8IDAsXG4gICAgICAgICAgICBtaWxsaXNlY29uZHMgPSBub3JtYWxpemVkSW5wdXQubWlsbGlzZWNvbmQgfHwgMDtcblxuICAgICAgICAvLyByZXByZXNlbnRhdGlvbiBmb3IgZGF0ZUFkZFJlbW92ZVxuICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgPSArbWlsbGlzZWNvbmRzICtcbiAgICAgICAgICAgIHNlY29uZHMgKiAxZTMgKyAvLyAxMDAwXG4gICAgICAgICAgICBtaW51dGVzICogNmU0ICsgLy8gMTAwMCAqIDYwXG4gICAgICAgICAgICBob3VycyAqIDM2ZTU7IC8vIDEwMDAgKiA2MCAqIDYwXG4gICAgICAgIC8vIEJlY2F1c2Ugb2YgZGF0ZUFkZFJlbW92ZSB0cmVhdHMgMjQgaG91cnMgYXMgZGlmZmVyZW50IGZyb20gYVxuICAgICAgICAvLyBkYXkgd2hlbiB3b3JraW5nIGFyb3VuZCBEU1QsIHdlIG5lZWQgdG8gc3RvcmUgdGhlbSBzZXBhcmF0ZWx5XG4gICAgICAgIHRoaXMuX2RheXMgPSArZGF5cyArXG4gICAgICAgICAgICB3ZWVrcyAqIDc7XG4gICAgICAgIC8vIEl0IGlzIGltcG9zc2libGUgdHJhbnNsYXRlIG1vbnRocyBpbnRvIGRheXMgd2l0aG91dCBrbm93aW5nXG4gICAgICAgIC8vIHdoaWNoIG1vbnRocyB5b3UgYXJlIGFyZSB0YWxraW5nIGFib3V0LCBzbyB3ZSBoYXZlIHRvIHN0b3JlXG4gICAgICAgIC8vIGl0IHNlcGFyYXRlbHkuXG4gICAgICAgIHRoaXMuX21vbnRocyA9ICttb250aHMgK1xuICAgICAgICAgICAgcXVhcnRlcnMgKiAzICtcbiAgICAgICAgICAgIHllYXJzICogMTI7XG5cbiAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuXG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUoKTtcblxuICAgICAgICB0aGlzLl9idWJibGUoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0R1cmF0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIER1cmF0aW9uO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9mZnNldCAodG9rZW4sIHNlcGFyYXRvcikge1xuICAgICAgICBhZGRGb3JtYXRUb2tlbih0b2tlbiwgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMudXRjT2Zmc2V0KCk7XG4gICAgICAgICAgICB2YXIgc2lnbiA9ICcrJztcbiAgICAgICAgICAgIGlmIChvZmZzZXQgPCAwKSB7XG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gLW9mZnNldDtcbiAgICAgICAgICAgICAgICBzaWduID0gJy0nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNpZ24gKyB6ZXJvRmlsbCh+fihvZmZzZXQgLyA2MCksIDIpICsgc2VwYXJhdG9yICsgemVyb0ZpbGwofn4ob2Zmc2V0KSAlIDYwLCAyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb2Zmc2V0KCdaJywgJzonKTtcbiAgICBvZmZzZXQoJ1paJywgJycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignWicsICBtYXRjaE9mZnNldCk7XG4gICAgYWRkUmVnZXhUb2tlbignWlonLCBtYXRjaE9mZnNldCk7XG4gICAgYWRkUGFyc2VUb2tlbihbJ1onLCAnWlonXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fdXNlVVRDID0gdHJ1ZTtcbiAgICAgICAgY29uZmlnLl90em0gPSBvZmZzZXRGcm9tU3RyaW5nKGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIC8vIHRpbWV6b25lIGNodW5rZXJcbiAgICAvLyAnKzEwOjAwJyA+IFsnMTAnLCAgJzAwJ11cbiAgICAvLyAnLTE1MzAnICA+IFsnLTE1JywgJzMwJ11cbiAgICB2YXIgY2h1bmtPZmZzZXQgPSAvKFtcXCtcXC1dfFxcZFxcZCkvZ2k7XG5cbiAgICBmdW5jdGlvbiBvZmZzZXRGcm9tU3RyaW5nKHN0cmluZykge1xuICAgICAgICB2YXIgbWF0Y2hlcyA9ICgoc3RyaW5nIHx8ICcnKS5tYXRjaChtYXRjaE9mZnNldCkgfHwgW10pO1xuICAgICAgICB2YXIgY2h1bmsgICA9IG1hdGNoZXNbbWF0Y2hlcy5sZW5ndGggLSAxXSB8fCBbXTtcbiAgICAgICAgdmFyIHBhcnRzICAgPSAoY2h1bmsgKyAnJykubWF0Y2goY2h1bmtPZmZzZXQpIHx8IFsnLScsIDAsIDBdO1xuICAgICAgICB2YXIgbWludXRlcyA9ICsocGFydHNbMV0gKiA2MCkgKyB0b0ludChwYXJ0c1syXSk7XG5cbiAgICAgICAgcmV0dXJuIHBhcnRzWzBdID09PSAnKycgPyBtaW51dGVzIDogLW1pbnV0ZXM7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGEgbW9tZW50IGZyb20gaW5wdXQsIHRoYXQgaXMgbG9jYWwvdXRjL3pvbmUgZXF1aXZhbGVudCB0byBtb2RlbC5cbiAgICBmdW5jdGlvbiBjbG9uZVdpdGhPZmZzZXQoaW5wdXQsIG1vZGVsKSB7XG4gICAgICAgIHZhciByZXMsIGRpZmY7XG4gICAgICAgIGlmIChtb2RlbC5faXNVVEMpIHtcbiAgICAgICAgICAgIHJlcyA9IG1vZGVsLmNsb25lKCk7XG4gICAgICAgICAgICBkaWZmID0gKGlzTW9tZW50KGlucHV0KSB8fCBpc0RhdGUoaW5wdXQpID8gK2lucHV0IDogK2xvY2FsX19jcmVhdGVMb2NhbChpbnB1dCkpIC0gKCtyZXMpO1xuICAgICAgICAgICAgLy8gVXNlIGxvdy1sZXZlbCBhcGksIGJlY2F1c2UgdGhpcyBmbiBpcyBsb3ctbGV2ZWwgYXBpLlxuICAgICAgICAgICAgcmVzLl9kLnNldFRpbWUoK3Jlcy5fZCArIGRpZmYpO1xuICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldChyZXMsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KS5sb2NhbCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtb2RlbC5faXNVVEMgPyBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpLnpvbmUobW9kZWwuX29mZnNldCB8fCAwKSA6IGxvY2FsX19jcmVhdGVMb2NhbChpbnB1dCkubG9jYWwoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREYXRlT2Zmc2V0IChtKSB7XG4gICAgICAgIC8vIE9uIEZpcmVmb3guMjQgRGF0ZSNnZXRUaW1lem9uZU9mZnNldCByZXR1cm5zIGEgZmxvYXRpbmcgcG9pbnQuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L3B1bGwvMTg3MVxuICAgICAgICByZXR1cm4gLU1hdGgucm91bmQobS5fZC5nZXRUaW1lem9uZU9mZnNldCgpIC8gMTUpICogMTU7XG4gICAgfVxuXG4gICAgLy8gSE9PS1NcblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbmV2ZXIgYSBtb21lbnQgaXMgbXV0YXRlZC5cbiAgICAvLyBJdCBpcyBpbnRlbmRlZCB0byBrZWVwIHRoZSBvZmZzZXQgaW4gc3luYyB3aXRoIHRoZSB0aW1lem9uZS5cbiAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0ID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICAvLyBrZWVwTG9jYWxUaW1lID0gdHJ1ZSBtZWFucyBvbmx5IGNoYW5nZSB0aGUgdGltZXpvbmUsIHdpdGhvdXRcbiAgICAvLyBhZmZlY3RpbmcgdGhlIGxvY2FsIGhvdXIuIFNvIDU6MzE6MjYgKzAzMDAgLS1bdXRjT2Zmc2V0KDIsIHRydWUpXS0tPlxuICAgIC8vIDU6MzE6MjYgKzAyMDAgSXQgaXMgcG9zc2libGUgdGhhdCA1OjMxOjI2IGRvZXNuJ3QgZXhpc3Qgd2l0aCBvZmZzZXRcbiAgICAvLyArMDIwMCwgc28gd2UgYWRqdXN0IHRoZSB0aW1lIGFzIG5lZWRlZCwgdG8gYmUgdmFsaWQuXG4gICAgLy9cbiAgICAvLyBLZWVwaW5nIHRoZSB0aW1lIGFjdHVhbGx5IGFkZHMvc3VidHJhY3RzIChvbmUgaG91cilcbiAgICAvLyBmcm9tIHRoZSBhY3R1YWwgcmVwcmVzZW50ZWQgdGltZS4gVGhhdCBpcyB3aHkgd2UgY2FsbCB1cGRhdGVPZmZzZXRcbiAgICAvLyBhIHNlY29uZCB0aW1lLiBJbiBjYXNlIGl0IHdhbnRzIHVzIHRvIGNoYW5nZSB0aGUgb2Zmc2V0IGFnYWluXG4gICAgLy8gX2NoYW5nZUluUHJvZ3Jlc3MgPT0gdHJ1ZSBjYXNlLCB0aGVuIHdlIGhhdmUgdG8gYWRqdXN0LCBiZWNhdXNlXG4gICAgLy8gdGhlcmUgaXMgbm8gc3VjaCB0aW1lIGluIHRoZSBnaXZlbiB0aW1lem9uZS5cbiAgICBmdW5jdGlvbiBnZXRTZXRPZmZzZXQgKGlucHV0LCBrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLl9vZmZzZXQgfHwgMCxcbiAgICAgICAgICAgIGxvY2FsQWRqdXN0O1xuICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IG9mZnNldEZyb21TdHJpbmcoaW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGlucHV0KSA8IDE2KSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dCAqIDYwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLl9pc1VUQyAmJiBrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxBZGp1c3QgPSBnZXREYXRlT2Zmc2V0KHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fb2Zmc2V0ID0gaW5wdXQ7XG4gICAgICAgICAgICB0aGlzLl9pc1VUQyA9IHRydWU7XG4gICAgICAgICAgICBpZiAobG9jYWxBZGp1c3QgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkKGxvY2FsQWRqdXN0LCAnbScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9mZnNldCAhPT0gaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWtlZXBMb2NhbFRpbWUgfHwgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICBhZGRfc3VidHJhY3RfX2FkZFN1YnRyYWN0KHRoaXMsIGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24oaW5wdXQgLSBvZmZzZXQsICdtJyksIDEsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9jaGFuZ2VJblByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VJblByb2dyZXNzID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/IG9mZnNldCA6IGdldERhdGVPZmZzZXQodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRab25lIChpbnB1dCwga2VlcExvY2FsVGltZSkge1xuICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IC1pbnB1dDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoaW5wdXQsIGtlZXBMb2NhbFRpbWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAtdGhpcy51dGNPZmZzZXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldE9mZnNldFRvVVRDIChrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnV0Y09mZnNldCgwLCBrZWVwTG9jYWxUaW1lKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRPZmZzZXRUb0xvY2FsIChrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9pc1VUQykge1xuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoMCwga2VlcExvY2FsVGltZSk7XG4gICAgICAgICAgICB0aGlzLl9pc1VUQyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAoa2VlcExvY2FsVGltZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3VidHJhY3QoZ2V0RGF0ZU9mZnNldCh0aGlzKSwgJ20nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRPZmZzZXRUb1BhcnNlZE9mZnNldCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl90em0pIHtcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KHRoaXMuX3R6bSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuX2kgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldChvZmZzZXRGcm9tU3RyaW5nKHRoaXMuX2kpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYXNBbGlnbmVkSG91ck9mZnNldCAoaW5wdXQpIHtcbiAgICAgICAgaWYgKCFpbnB1dCkge1xuICAgICAgICAgICAgaW5wdXQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaW5wdXQgPSBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpLnV0Y09mZnNldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICh0aGlzLnV0Y09mZnNldCgpIC0gaW5wdXQpICUgNjAgPT09IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEYXlsaWdodFNhdmluZ1RpbWUgKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoKSA+IHRoaXMuY2xvbmUoKS5tb250aCgwKS51dGNPZmZzZXQoKSB8fFxuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoKSA+IHRoaXMuY2xvbmUoKS5tb250aCg1KS51dGNPZmZzZXQoKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF5bGlnaHRTYXZpbmdUaW1lU2hpZnRlZCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9hKSB7XG4gICAgICAgICAgICB2YXIgb3RoZXIgPSB0aGlzLl9pc1VUQyA/IGNyZWF0ZV91dGNfX2NyZWF0ZVVUQyh0aGlzLl9hKSA6IGxvY2FsX19jcmVhdGVMb2NhbCh0aGlzLl9hKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSAmJiBjb21wYXJlQXJyYXlzKHRoaXMuX2EsIG90aGVyLnRvQXJyYXkoKSkgPiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTG9jYWwgKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuX2lzVVRDO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVXRjT2Zmc2V0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVXRjICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDICYmIHRoaXMuX29mZnNldCA9PT0gMDtcbiAgICB9XG5cbiAgICB2YXIgYXNwTmV0UmVnZXggPSAvKFxcLSk/KD86KFxcZCopXFwuKT8oXFxkKylcXDooXFxkKykoPzpcXDooXFxkKylcXC4/KFxcZHszfSk/KT8vO1xuXG4gICAgLy8gZnJvbSBodHRwOi8vZG9jcy5jbG9zdXJlLWxpYnJhcnkuZ29vZ2xlY29kZS5jb20vZ2l0L2Nsb3N1cmVfZ29vZ19kYXRlX2RhdGUuanMuc291cmNlLmh0bWxcbiAgICAvLyBzb21ld2hhdCBtb3JlIGluIGxpbmUgd2l0aCA0LjQuMy4yIDIwMDQgc3BlYywgYnV0IGFsbG93cyBkZWNpbWFsIGFueXdoZXJlXG4gICAgdmFyIGNyZWF0ZV9faXNvUmVnZXggPSAvXigtKT9QKD86KD86KFswLTksLl0qKVkpPyg/OihbMC05LC5dKilNKT8oPzooWzAtOSwuXSopRCk/KD86VCg/OihbMC05LC5dKilIKT8oPzooWzAtOSwuXSopTSk/KD86KFswLTksLl0qKVMpPyk/fChbMC05LC5dKilXKSQvO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlX19jcmVhdGVEdXJhdGlvbiAoaW5wdXQsIGtleSkge1xuICAgICAgICB2YXIgZHVyYXRpb24gPSBpbnB1dCxcbiAgICAgICAgICAgIC8vIG1hdGNoaW5nIGFnYWluc3QgcmVnZXhwIGlzIGV4cGVuc2l2ZSwgZG8gaXQgb24gZGVtYW5kXG4gICAgICAgICAgICBtYXRjaCA9IG51bGwsXG4gICAgICAgICAgICBzaWduLFxuICAgICAgICAgICAgcmV0LFxuICAgICAgICAgICAgZGlmZlJlcztcblxuICAgICAgICBpZiAoaXNEdXJhdGlvbihpbnB1dCkpIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIG1zIDogaW5wdXQuX21pbGxpc2Vjb25kcyxcbiAgICAgICAgICAgICAgICBkICA6IGlucHV0Ll9kYXlzLFxuICAgICAgICAgICAgICAgIE0gIDogaW5wdXQuX21vbnRoc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaW5wdXQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uW2tleV0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb24ubWlsbGlzZWNvbmRzID0gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoISEobWF0Y2ggPSBhc3BOZXRSZWdleC5leGVjKGlucHV0KSkpIHtcbiAgICAgICAgICAgIHNpZ24gPSAobWF0Y2hbMV0gPT09ICctJykgPyAtMSA6IDE7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB5ICA6IDAsXG4gICAgICAgICAgICAgICAgZCAgOiB0b0ludChtYXRjaFtEQVRFXSkgICAgICAgICogc2lnbixcbiAgICAgICAgICAgICAgICBoICA6IHRvSW50KG1hdGNoW0hPVVJdKSAgICAgICAgKiBzaWduLFxuICAgICAgICAgICAgICAgIG0gIDogdG9JbnQobWF0Y2hbTUlOVVRFXSkgICAgICAqIHNpZ24sXG4gICAgICAgICAgICAgICAgcyAgOiB0b0ludChtYXRjaFtTRUNPTkRdKSAgICAgICogc2lnbixcbiAgICAgICAgICAgICAgICBtcyA6IHRvSW50KG1hdGNoW01JTExJU0VDT05EXSkgKiBzaWduXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKCEhKG1hdGNoID0gY3JlYXRlX19pc29SZWdleC5leGVjKGlucHV0KSkpIHtcbiAgICAgICAgICAgIHNpZ24gPSAobWF0Y2hbMV0gPT09ICctJykgPyAtMSA6IDE7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB5IDogcGFyc2VJc28obWF0Y2hbMl0sIHNpZ24pLFxuICAgICAgICAgICAgICAgIE0gOiBwYXJzZUlzbyhtYXRjaFszXSwgc2lnbiksXG4gICAgICAgICAgICAgICAgZCA6IHBhcnNlSXNvKG1hdGNoWzRdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBoIDogcGFyc2VJc28obWF0Y2hbNV0sIHNpZ24pLFxuICAgICAgICAgICAgICAgIG0gOiBwYXJzZUlzbyhtYXRjaFs2XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgcyA6IHBhcnNlSXNvKG1hdGNoWzddLCBzaWduKSxcbiAgICAgICAgICAgICAgICB3IDogcGFyc2VJc28obWF0Y2hbOF0sIHNpZ24pXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKGR1cmF0aW9uID09IG51bGwpIHsvLyBjaGVja3MgZm9yIG51bGwgb3IgdW5kZWZpbmVkXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkdXJhdGlvbiA9PT0gJ29iamVjdCcgJiYgKCdmcm9tJyBpbiBkdXJhdGlvbiB8fCAndG8nIGluIGR1cmF0aW9uKSkge1xuICAgICAgICAgICAgZGlmZlJlcyA9IG1vbWVudHNEaWZmZXJlbmNlKGxvY2FsX19jcmVhdGVMb2NhbChkdXJhdGlvbi5mcm9tKSwgbG9jYWxfX2NyZWF0ZUxvY2FsKGR1cmF0aW9uLnRvKSk7XG5cbiAgICAgICAgICAgIGR1cmF0aW9uID0ge307XG4gICAgICAgICAgICBkdXJhdGlvbi5tcyA9IGRpZmZSZXMubWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgZHVyYXRpb24uTSA9IGRpZmZSZXMubW9udGhzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0ID0gbmV3IER1cmF0aW9uKGR1cmF0aW9uKTtcblxuICAgICAgICBpZiAoaXNEdXJhdGlvbihpbnB1dCkgJiYgaGFzT3duUHJvcChpbnB1dCwgJ19sb2NhbGUnKSkge1xuICAgICAgICAgICAgcmV0Ll9sb2NhbGUgPSBpbnB1dC5fbG9jYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uLmZuID0gRHVyYXRpb24ucHJvdG90eXBlO1xuXG4gICAgZnVuY3Rpb24gcGFyc2VJc28gKGlucCwgc2lnbikge1xuICAgICAgICAvLyBXZSdkIG5vcm1hbGx5IHVzZSB+fmlucCBmb3IgdGhpcywgYnV0IHVuZm9ydHVuYXRlbHkgaXQgYWxzb1xuICAgICAgICAvLyBjb252ZXJ0cyBmbG9hdHMgdG8gaW50cy5cbiAgICAgICAgLy8gaW5wIG1heSBiZSB1bmRlZmluZWQsIHNvIGNhcmVmdWwgY2FsbGluZyByZXBsYWNlIG9uIGl0LlxuICAgICAgICB2YXIgcmVzID0gaW5wICYmIHBhcnNlRmxvYXQoaW5wLnJlcGxhY2UoJywnLCAnLicpKTtcbiAgICAgICAgLy8gYXBwbHkgc2lnbiB3aGlsZSB3ZSdyZSBhdCBpdFxuICAgICAgICByZXR1cm4gKGlzTmFOKHJlcykgPyAwIDogcmVzKSAqIHNpZ247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShiYXNlLCBvdGhlcikge1xuICAgICAgICB2YXIgcmVzID0ge21pbGxpc2Vjb25kczogMCwgbW9udGhzOiAwfTtcblxuICAgICAgICByZXMubW9udGhzID0gb3RoZXIubW9udGgoKSAtIGJhc2UubW9udGgoKSArXG4gICAgICAgICAgICAob3RoZXIueWVhcigpIC0gYmFzZS55ZWFyKCkpICogMTI7XG4gICAgICAgIGlmIChiYXNlLmNsb25lKCkuYWRkKHJlcy5tb250aHMsICdNJykuaXNBZnRlcihvdGhlcikpIHtcbiAgICAgICAgICAgIC0tcmVzLm1vbnRocztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcy5taWxsaXNlY29uZHMgPSArb3RoZXIgLSArKGJhc2UuY2xvbmUoKS5hZGQocmVzLm1vbnRocywgJ00nKSk7XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb21lbnRzRGlmZmVyZW5jZShiYXNlLCBvdGhlcikge1xuICAgICAgICB2YXIgcmVzO1xuICAgICAgICBvdGhlciA9IGNsb25lV2l0aE9mZnNldChvdGhlciwgYmFzZSk7XG4gICAgICAgIGlmIChiYXNlLmlzQmVmb3JlKG90aGVyKSkge1xuICAgICAgICAgICAgcmVzID0gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShiYXNlLCBvdGhlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXMgPSBwb3NpdGl2ZU1vbWVudHNEaWZmZXJlbmNlKG90aGVyLCBiYXNlKTtcbiAgICAgICAgICAgIHJlcy5taWxsaXNlY29uZHMgPSAtcmVzLm1pbGxpc2Vjb25kcztcbiAgICAgICAgICAgIHJlcy5tb250aHMgPSAtcmVzLm1vbnRocztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlQWRkZXIoZGlyZWN0aW9uLCBuYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodmFsLCBwZXJpb2QpIHtcbiAgICAgICAgICAgIHZhciBkdXIsIHRtcDtcbiAgICAgICAgICAgIC8vaW52ZXJ0IHRoZSBhcmd1bWVudHMsIGJ1dCBjb21wbGFpbiBhYm91dCBpdFxuICAgICAgICAgICAgaWYgKHBlcmlvZCAhPT0gbnVsbCAmJiAhaXNOYU4oK3BlcmlvZCkpIHtcbiAgICAgICAgICAgICAgICBkZXByZWNhdGVTaW1wbGUobmFtZSwgJ21vbWVudCgpLicgKyBuYW1lICArICcocGVyaW9kLCBudW1iZXIpIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgbW9tZW50KCkuJyArIG5hbWUgKyAnKG51bWJlciwgcGVyaW9kKS4nKTtcbiAgICAgICAgICAgICAgICB0bXAgPSB2YWw7IHZhbCA9IHBlcmlvZDsgcGVyaW9kID0gdG1wO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YWwgPSB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyA/ICt2YWwgOiB2YWw7XG4gICAgICAgICAgICBkdXIgPSBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uKHZhbCwgcGVyaW9kKTtcbiAgICAgICAgICAgIGFkZF9zdWJ0cmFjdF9fYWRkU3VidHJhY3QodGhpcywgZHVyLCBkaXJlY3Rpb24pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkX3N1YnRyYWN0X19hZGRTdWJ0cmFjdCAobW9tLCBkdXJhdGlvbiwgaXNBZGRpbmcsIHVwZGF0ZU9mZnNldCkge1xuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gZHVyYXRpb24uX21pbGxpc2Vjb25kcyxcbiAgICAgICAgICAgIGRheXMgPSBkdXJhdGlvbi5fZGF5cyxcbiAgICAgICAgICAgIG1vbnRocyA9IGR1cmF0aW9uLl9tb250aHM7XG4gICAgICAgIHVwZGF0ZU9mZnNldCA9IHVwZGF0ZU9mZnNldCA9PSBudWxsID8gdHJ1ZSA6IHVwZGF0ZU9mZnNldDtcblxuICAgICAgICBpZiAobWlsbGlzZWNvbmRzKSB7XG4gICAgICAgICAgICBtb20uX2Quc2V0VGltZSgrbW9tLl9kICsgbWlsbGlzZWNvbmRzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXlzKSB7XG4gICAgICAgICAgICBnZXRfc2V0X19zZXQobW9tLCAnRGF0ZScsIGdldF9zZXRfX2dldChtb20sICdEYXRlJykgKyBkYXlzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtb250aHMpIHtcbiAgICAgICAgICAgIHNldE1vbnRoKG1vbSwgZ2V0X3NldF9fZ2V0KG1vbSwgJ01vbnRoJykgKyBtb250aHMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwZGF0ZU9mZnNldCkge1xuICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldChtb20sIGRheXMgfHwgbW9udGhzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBhZGRfc3VidHJhY3RfX2FkZCAgICAgID0gY3JlYXRlQWRkZXIoMSwgJ2FkZCcpO1xuICAgIHZhciBhZGRfc3VidHJhY3RfX3N1YnRyYWN0ID0gY3JlYXRlQWRkZXIoLTEsICdzdWJ0cmFjdCcpO1xuXG4gICAgZnVuY3Rpb24gbW9tZW50X2NhbGVuZGFyX19jYWxlbmRhciAodGltZSkge1xuICAgICAgICAvLyBXZSB3YW50IHRvIGNvbXBhcmUgdGhlIHN0YXJ0IG9mIHRvZGF5LCB2cyB0aGlzLlxuICAgICAgICAvLyBHZXR0aW5nIHN0YXJ0LW9mLXRvZGF5IGRlcGVuZHMgb24gd2hldGhlciB3ZSdyZSBsb2NhbC91dGMvb2Zmc2V0IG9yIG5vdC5cbiAgICAgICAgdmFyIG5vdyA9IHRpbWUgfHwgbG9jYWxfX2NyZWF0ZUxvY2FsKCksXG4gICAgICAgICAgICBzb2QgPSBjbG9uZVdpdGhPZmZzZXQobm93LCB0aGlzKS5zdGFydE9mKCdkYXknKSxcbiAgICAgICAgICAgIGRpZmYgPSB0aGlzLmRpZmYoc29kLCAnZGF5cycsIHRydWUpLFxuICAgICAgICAgICAgZm9ybWF0ID0gZGlmZiA8IC02ID8gJ3NhbWVFbHNlJyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IC0xID8gJ2xhc3RXZWVrJyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IDAgPyAnbGFzdERheScgOlxuICAgICAgICAgICAgICAgIGRpZmYgPCAxID8gJ3NhbWVEYXknIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgMiA/ICduZXh0RGF5JyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IDcgPyAnbmV4dFdlZWsnIDogJ3NhbWVFbHNlJztcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0KHRoaXMubG9jYWxlRGF0YSgpLmNhbGVuZGFyKGZvcm1hdCwgdGhpcywgbG9jYWxfX2NyZWF0ZUxvY2FsKG5vdykpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9uZSAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgTW9tZW50KHRoaXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQWZ0ZXIgKGlucHV0LCB1bml0cykge1xuICAgICAgICB2YXIgaW5wdXRNcztcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh0eXBlb2YgdW5pdHMgIT09ICd1bmRlZmluZWQnID8gdW5pdHMgOiAnbWlsbGlzZWNvbmQnKTtcbiAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICBpbnB1dCA9IGlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiArdGhpcyA+ICtpbnB1dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0TXMgPSBpc01vbWVudChpbnB1dCkgPyAraW5wdXQgOiArbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dE1zIDwgK3RoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQmVmb3JlIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgdmFyIGlucHV0TXM7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModHlwZW9mIHVuaXRzICE9PSAndW5kZWZpbmVkJyA/IHVuaXRzIDogJ21pbGxpc2Vjb25kJyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgaW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGxvY2FsX19jcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gK3RoaXMgPCAraW5wdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnB1dE1zID0gaXNNb21lbnQoaW5wdXQpID8gK2lucHV0IDogK2xvY2FsX19jcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gK3RoaXMuY2xvbmUoKS5lbmRPZih1bml0cykgPCBpbnB1dE1zO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNCZXR3ZWVuIChmcm9tLCB0bywgdW5pdHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNBZnRlcihmcm9tLCB1bml0cykgJiYgdGhpcy5pc0JlZm9yZSh0bywgdW5pdHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzU2FtZSAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgIHZhciBpbnB1dE1zO1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzIHx8ICdtaWxsaXNlY29uZCcpO1xuICAgICAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgIGlucHV0ID0gaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzID09PSAraW5wdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnB1dE1zID0gK2xvY2FsX19jcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gKyh0aGlzLmNsb25lKCkuc3RhcnRPZih1bml0cykpIDw9IGlucHV0TXMgJiYgaW5wdXRNcyA8PSArKHRoaXMuY2xvbmUoKS5lbmRPZih1bml0cykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWJzRmxvb3IgKG51bWJlcikge1xuICAgICAgICBpZiAobnVtYmVyIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbChudW1iZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IobnVtYmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRpZmYgKGlucHV0LCB1bml0cywgYXNGbG9hdCkge1xuICAgICAgICB2YXIgdGhhdCA9IGNsb25lV2l0aE9mZnNldChpbnB1dCwgdGhpcyksXG4gICAgICAgICAgICB6b25lRGVsdGEgPSAodGhhdC51dGNPZmZzZXQoKSAtIHRoaXMudXRjT2Zmc2V0KCkpICogNmU0LFxuICAgICAgICAgICAgZGVsdGEsIG91dHB1dDtcblxuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcblxuICAgICAgICBpZiAodW5pdHMgPT09ICd5ZWFyJyB8fCB1bml0cyA9PT0gJ21vbnRoJyB8fCB1bml0cyA9PT0gJ3F1YXJ0ZXInKSB7XG4gICAgICAgICAgICBvdXRwdXQgPSBtb250aERpZmYodGhpcywgdGhhdCk7XG4gICAgICAgICAgICBpZiAodW5pdHMgPT09ICdxdWFydGVyJykge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dCAvIDM7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHVuaXRzID09PSAneWVhcicpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgLyAxMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbHRhID0gdGhpcyAtIHRoYXQ7XG4gICAgICAgICAgICBvdXRwdXQgPSB1bml0cyA9PT0gJ3NlY29uZCcgPyBkZWx0YSAvIDFlMyA6IC8vIDEwMDBcbiAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ21pbnV0ZScgPyBkZWx0YSAvIDZlNCA6IC8vIDEwMDAgKiA2MFxuICAgICAgICAgICAgICAgIHVuaXRzID09PSAnaG91cicgPyBkZWx0YSAvIDM2ZTUgOiAvLyAxMDAwICogNjAgKiA2MFxuICAgICAgICAgICAgICAgIHVuaXRzID09PSAnZGF5JyA/IChkZWx0YSAtIHpvbmVEZWx0YSkgLyA4NjRlNSA6IC8vIDEwMDAgKiA2MCAqIDYwICogMjQsIG5lZ2F0ZSBkc3RcbiAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ3dlZWsnID8gKGRlbHRhIC0gem9uZURlbHRhKSAvIDYwNDhlNSA6IC8vIDEwMDAgKiA2MCAqIDYwICogMjQgKiA3LCBuZWdhdGUgZHN0XG4gICAgICAgICAgICAgICAgZGVsdGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFzRmxvYXQgPyBvdXRwdXQgOiBhYnNGbG9vcihvdXRwdXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbnRoRGlmZiAoYSwgYikge1xuICAgICAgICAvLyBkaWZmZXJlbmNlIGluIG1vbnRoc1xuICAgICAgICB2YXIgd2hvbGVNb250aERpZmYgPSAoKGIueWVhcigpIC0gYS55ZWFyKCkpICogMTIpICsgKGIubW9udGgoKSAtIGEubW9udGgoKSksXG4gICAgICAgICAgICAvLyBiIGlzIGluIChhbmNob3IgLSAxIG1vbnRoLCBhbmNob3IgKyAxIG1vbnRoKVxuICAgICAgICAgICAgYW5jaG9yID0gYS5jbG9uZSgpLmFkZCh3aG9sZU1vbnRoRGlmZiwgJ21vbnRocycpLFxuICAgICAgICAgICAgYW5jaG9yMiwgYWRqdXN0O1xuXG4gICAgICAgIGlmIChiIC0gYW5jaG9yIDwgMCkge1xuICAgICAgICAgICAgYW5jaG9yMiA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYgLSAxLCAnbW9udGhzJyk7XG4gICAgICAgICAgICAvLyBsaW5lYXIgYWNyb3NzIHRoZSBtb250aFxuICAgICAgICAgICAgYWRqdXN0ID0gKGIgLSBhbmNob3IpIC8gKGFuY2hvciAtIGFuY2hvcjIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYW5jaG9yMiA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYgKyAxLCAnbW9udGhzJyk7XG4gICAgICAgICAgICAvLyBsaW5lYXIgYWNyb3NzIHRoZSBtb250aFxuICAgICAgICAgICAgYWRqdXN0ID0gKGIgLSBhbmNob3IpIC8gKGFuY2hvcjIgLSBhbmNob3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIC0od2hvbGVNb250aERpZmYgKyBhZGp1c3QpO1xuICAgIH1cblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5kZWZhdWx0Rm9ybWF0ID0gJ1lZWVktTU0tRERUSEg6bW06c3NaJztcblxuICAgIGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sb2NhbGUoJ2VuJykuZm9ybWF0KCdkZGQgTU1NIEREIFlZWVkgSEg6bW06c3MgW0dNVF1aWicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbWVudF9mb3JtYXRfX3RvSVNPU3RyaW5nICgpIHtcbiAgICAgICAgdmFyIG0gPSB0aGlzLmNsb25lKCkudXRjKCk7XG4gICAgICAgIGlmICgwIDwgbS55ZWFyKCkgJiYgbS55ZWFyKCkgPD0gOTk5OSkge1xuICAgICAgICAgICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZykge1xuICAgICAgICAgICAgICAgIC8vIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbiBpcyB+NTB4IGZhc3RlciwgdXNlIGl0IHdoZW4gd2UgY2FuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9EYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdE1vbWVudChtLCAnWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1taXScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdE1vbWVudChtLCAnWVlZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXQgKGlucHV0U3RyaW5nKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBmb3JtYXRNb21lbnQodGhpcywgaW5wdXRTdHJpbmcgfHwgdXRpbHNfaG9va3NfX2hvb2tzLmRlZmF1bHRGb3JtYXQpO1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkucG9zdGZvcm1hdChvdXRwdXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZyb20gKHRpbWUsIHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24oe3RvOiB0aGlzLCBmcm9tOiB0aW1lfSkubG9jYWxlKHRoaXMubG9jYWxlKCkpLmh1bWFuaXplKCF3aXRob3V0U3VmZml4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmcm9tTm93ICh3aXRob3V0U3VmZml4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZyb20obG9jYWxfX2NyZWF0ZUxvY2FsKCksIHdpdGhvdXRTdWZmaXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZSAoa2V5KSB7XG4gICAgICAgIHZhciBuZXdMb2NhbGVEYXRhO1xuXG4gICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsZS5fYWJicjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0xvY2FsZURhdGEgPSBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKGtleSk7XG4gICAgICAgICAgICBpZiAobmV3TG9jYWxlRGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9jYWxlID0gbmV3TG9jYWxlRGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxhbmcgPSBkZXByZWNhdGUoXG4gICAgICAgICdtb21lbnQoKS5sYW5nKCkgaXMgZGVwcmVjYXRlZC4gSW5zdGVhZCwgdXNlIG1vbWVudCgpLmxvY2FsZURhdGEoKSB0byBnZXQgdGhlIGxhbmd1YWdlIGNvbmZpZ3VyYXRpb24uIFVzZSBtb21lbnQoKS5sb2NhbGUoKSB0byBjaGFuZ2UgbGFuZ3VhZ2VzLicsXG4gICAgICAgIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlRGF0YSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RhcnRPZiAodW5pdHMpIHtcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgIC8vIHRoZSBmb2xsb3dpbmcgc3dpdGNoIGludGVudGlvbmFsbHkgb21pdHMgYnJlYWsga2V5d29yZHNcbiAgICAgICAgLy8gdG8gdXRpbGl6ZSBmYWxsaW5nIHRocm91Z2ggdGhlIGNhc2VzLlxuICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgIGNhc2UgJ3llYXInOlxuICAgICAgICAgICAgdGhpcy5tb250aCgwKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAncXVhcnRlcic6XG4gICAgICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgICAgICAgIHRoaXMuZGF0ZSgxKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnd2Vlayc6XG4gICAgICAgIGNhc2UgJ2lzb1dlZWsnOlxuICAgICAgICBjYXNlICdkYXknOlxuICAgICAgICAgICAgdGhpcy5ob3VycygwKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnaG91cic6XG4gICAgICAgICAgICB0aGlzLm1pbnV0ZXMoMCk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ21pbnV0ZSc6XG4gICAgICAgICAgICB0aGlzLnNlY29uZHMoMCk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgICAgICAgICB0aGlzLm1pbGxpc2Vjb25kcygwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdlZWtzIGFyZSBhIHNwZWNpYWwgY2FzZVxuICAgICAgICBpZiAodW5pdHMgPT09ICd3ZWVrJykge1xuICAgICAgICAgICAgdGhpcy53ZWVrZGF5KDApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1bml0cyA9PT0gJ2lzb1dlZWsnKSB7XG4gICAgICAgICAgICB0aGlzLmlzb1dlZWtkYXkoMSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBxdWFydGVycyBhcmUgYWxzbyBzcGVjaWFsXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ3F1YXJ0ZXInKSB7XG4gICAgICAgICAgICB0aGlzLm1vbnRoKE1hdGguZmxvb3IodGhpcy5tb250aCgpIC8gMykgKiAzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVuZE9mICh1bml0cykge1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgaWYgKHVuaXRzID09PSB1bmRlZmluZWQgfHwgdW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXJ0T2YodW5pdHMpLmFkZCgxLCAodW5pdHMgPT09ICdpc29XZWVrJyA/ICd3ZWVrJyA6IHVuaXRzKSkuc3VidHJhY3QoMSwgJ21zJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9fdHlwZV9fdmFsdWVPZiAoKSB7XG4gICAgICAgIHJldHVybiArdGhpcy5fZCAtICgodGhpcy5fb2Zmc2V0IHx8IDApICogNjAwMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVuaXggKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigrdGhpcyAvIDEwMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvRGF0ZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXQgPyBuZXcgRGF0ZSgrdGhpcykgOiB0aGlzLl9kO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvQXJyYXkgKCkge1xuICAgICAgICB2YXIgbSA9IHRoaXM7XG4gICAgICAgIHJldHVybiBbbS55ZWFyKCksIG0ubW9udGgoKSwgbS5kYXRlKCksIG0uaG91cigpLCBtLm1pbnV0ZSgpLCBtLnNlY29uZCgpLCBtLm1pbGxpc2Vjb25kKCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbWVudF92YWxpZF9faXNWYWxpZCAoKSB7XG4gICAgICAgIHJldHVybiB2YWxpZF9faXNWYWxpZCh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzaW5nRmxhZ3MgKCkge1xuICAgICAgICByZXR1cm4gZXh0ZW5kKHt9LCB0aGlzLl9wZik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW52YWxpZEF0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BmLm92ZXJmbG93O1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnZ2cnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy53ZWVrWWVhcigpICUgMTAwO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydHRycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzb1dlZWtZZWFyKCkgJSAxMDA7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBhZGRXZWVrWWVhckZvcm1hdFRva2VuICh0b2tlbiwgZ2V0dGVyKSB7XG4gICAgICAgIGFkZEZvcm1hdFRva2VuKDAsIFt0b2tlbiwgdG9rZW4ubGVuZ3RoXSwgMCwgZ2V0dGVyKTtcbiAgICB9XG5cbiAgICBhZGRXZWVrWWVhckZvcm1hdFRva2VuKCdnZ2dnJywgICAgICd3ZWVrWWVhcicpO1xuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ2dnZ2dnJywgICAgJ3dlZWtZZWFyJyk7XG4gICAgYWRkV2Vla1llYXJGb3JtYXRUb2tlbignR0dHRycsICAnaXNvV2Vla1llYXInKTtcbiAgICBhZGRXZWVrWWVhckZvcm1hdFRva2VuKCdHR0dHRycsICdpc29XZWVrWWVhcicpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCd3ZWVrWWVhcicsICdnZycpO1xuICAgIGFkZFVuaXRBbGlhcygnaXNvV2Vla1llYXInLCAnR0cnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ0cnLCAgICAgIG1hdGNoU2lnbmVkKTtcbiAgICBhZGRSZWdleFRva2VuKCdnJywgICAgICBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignR0cnLCAgICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2dnJywgICAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdHR0dHJywgICBtYXRjaDF0bzQsIG1hdGNoNCk7XG4gICAgYWRkUmVnZXhUb2tlbignZ2dnZycsICAgbWF0Y2gxdG80LCBtYXRjaDQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0dHR0dHJywgIG1hdGNoMXRvNiwgbWF0Y2g2KTtcbiAgICBhZGRSZWdleFRva2VuKCdnZ2dnZycsICBtYXRjaDF0bzYsIG1hdGNoNik7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ2dnZ2cnLCAnZ2dnZ2cnLCAnR0dHRycsICdHR0dHRyddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgd2Vla1t0b2tlbi5zdWJzdHIoMCwgMildID0gdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWydnZycsICdHRyddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgd2Vla1t0b2tlbl0gPSB1dGlsc19ob29rc19faG9va3MucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgZnVuY3Rpb24gd2Vla3NJblllYXIoeWVhciwgZG93LCBkb3kpIHtcbiAgICAgICAgcmV0dXJuIHdlZWtPZlllYXIobG9jYWxfX2NyZWF0ZUxvY2FsKFt5ZWFyLCAxMSwgMzEgKyBkb3cgLSBkb3ldKSwgZG93LCBkb3kpLndlZWs7XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0V2Vla1llYXIgKGlucHV0KSB7XG4gICAgICAgIHZhciB5ZWFyID0gd2Vla09mWWVhcih0aGlzLCB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3csIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRveSkueWVhcjtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB5ZWFyIDogdGhpcy5hZGQoKGlucHV0IC0geWVhciksICd5Jyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0SVNPV2Vla1llYXIgKGlucHV0KSB7XG4gICAgICAgIHZhciB5ZWFyID0gd2Vla09mWWVhcih0aGlzLCAxLCA0KS55ZWFyO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHllYXIgOiB0aGlzLmFkZCgoaW5wdXQgLSB5ZWFyKSwgJ3knKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRJU09XZWVrc0luWWVhciAoKSB7XG4gICAgICAgIHJldHVybiB3ZWVrc0luWWVhcih0aGlzLnllYXIoKSwgMSwgNCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0V2Vla3NJblllYXIgKCkge1xuICAgICAgICB2YXIgd2Vla0luZm8gPSB0aGlzLmxvY2FsZURhdGEoKS5fd2VlaztcbiAgICAgICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMueWVhcigpLCB3ZWVrSW5mby5kb3csIHdlZWtJbmZvLmRveSk7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1EnLCAwLCAwLCAncXVhcnRlcicpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdxdWFydGVyJywgJ1EnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ1EnLCBtYXRjaDEpO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1EnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W01PTlRIXSA9ICh0b0ludChpbnB1dCkgLSAxKSAqIDM7XG4gICAgfSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXRRdWFydGVyIChpbnB1dCkge1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IE1hdGguY2VpbCgodGhpcy5tb250aCgpICsgMSkgLyAzKSA6IHRoaXMubW9udGgoKGlucHV0IC0gMSkgKiAzICsgdGhpcy5tb250aCgpICUgMyk7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0QnLCBbJ0REJywgMl0sICdEbycsICdkYXRlJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2RhdGUnLCAnRCcpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignRCcsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0REJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0RvJywgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGlzU3RyaWN0ID8gbG9jYWxlLl9vcmRpbmFsUGFyc2UgOiBsb2NhbGUuX29yZGluYWxQYXJzZUxlbmllbnQ7XG4gICAgfSk7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnRCcsICdERCddLCBEQVRFKTtcbiAgICBhZGRQYXJzZVRva2VuKCdEbycsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbREFURV0gPSB0b0ludChpbnB1dC5tYXRjaChtYXRjaDF0bzIpWzBdLCAxMCk7XG4gICAgfSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0RGF5T2ZNb250aCA9IG1ha2VHZXRTZXQoJ0RhdGUnLCB0cnVlKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdkJywgMCwgJ2RvJywgJ2RheScpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2RkJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXNNaW4odGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdkZGQnLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5c1Nob3J0KHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZGRkZCcsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzKHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZScsIDAsIDAsICd3ZWVrZGF5Jyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ0UnLCAwLCAwLCAnaXNvV2Vla2RheScpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdkYXknLCAnZCcpO1xuICAgIGFkZFVuaXRBbGlhcygnd2Vla2RheScsICdlJyk7XG4gICAgYWRkVW5pdEFsaWFzKCdpc29XZWVrZGF5JywgJ0UnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ2QnLCAgICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2UnLCAgICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0UnLCAgICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2RkJywgICBtYXRjaFdvcmQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2RkZCcsICBtYXRjaFdvcmQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2RkZGQnLCBtYXRjaFdvcmQpO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWydkZCcsICdkZGQnLCAnZGRkZCddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZykge1xuICAgICAgICB2YXIgd2Vla2RheSA9IGNvbmZpZy5fbG9jYWxlLndlZWtkYXlzUGFyc2UoaW5wdXQpO1xuICAgICAgICAvLyBpZiB3ZSBkaWRuJ3QgZ2V0IGEgd2Vla2RheSBuYW1lLCBtYXJrIHRoZSBkYXRlIGFzIGludmFsaWRcbiAgICAgICAgaWYgKHdlZWtkYXkgIT0gbnVsbCkge1xuICAgICAgICAgICAgd2Vlay5kID0gd2Vla2RheTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZy5fcGYuaW52YWxpZFdlZWtkYXkgPSBpbnB1dDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWydkJywgJ2UnLCAnRSddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgd2Vla1t0b2tlbl0gPSB0b0ludChpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICBmdW5jdGlvbiBwYXJzZVdlZWtkYXkoaW5wdXQsIGxvY2FsZSkge1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWYgKCFpc05hTihpbnB1dCkpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IHBhcnNlSW50KGlucHV0LCAxMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IGxvY2FsZS53ZWVrZGF5c1BhcnNlKGlucHV0KTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH1cblxuICAgIC8vIExPQ0FMRVNcblxuICAgIHZhciBkZWZhdWx0TG9jYWxlV2Vla2RheXMgPSAnU3VuZGF5X01vbmRheV9UdWVzZGF5X1dlZG5lc2RheV9UaHVyc2RheV9GcmlkYXlfU2F0dXJkYXknLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlV2Vla2RheXMgKG0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzW20uZGF5KCldO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlV2Vla2RheXNTaG9ydCA9ICdTdW5fTW9uX1R1ZV9XZWRfVGh1X0ZyaV9TYXQnLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlV2Vla2RheXNTaG9ydCAobSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNTaG9ydFttLmRheSgpXTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWtkYXlzTWluID0gJ1N1X01vX1R1X1dlX1RoX0ZyX1NhJy5zcGxpdCgnXycpO1xuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzTWluIChtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c01pblttLmRheSgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5c1BhcnNlICh3ZWVrZGF5TmFtZSkge1xuICAgICAgICB2YXIgaSwgbW9tLCByZWdleDtcblxuICAgICAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuICAgICAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgbW9tID0gbG9jYWxfX2NyZWF0ZUxvY2FsKFsyMDAwLCAxXSkuZGF5KGkpO1xuICAgICAgICAgICAgICAgIHJlZ2V4ID0gJ14nICsgdGhpcy53ZWVrZGF5cyhtb20sICcnKSArICd8XicgKyB0aGlzLndlZWtkYXlzU2hvcnQobW9tLCAnJykgKyAnfF4nICsgdGhpcy53ZWVrZGF5c01pbihtb20sICcnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlW2ldID0gbmV3IFJlZ0V4cChyZWdleC5yZXBsYWNlKCcuJywgJycpLCAnaScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGVzdCB0aGUgcmVnZXhcbiAgICAgICAgICAgIGlmICh0aGlzLl93ZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXREYXlPZldlZWsgKGlucHV0KSB7XG4gICAgICAgIHZhciBkYXkgPSB0aGlzLl9pc1VUQyA/IHRoaXMuX2QuZ2V0VVRDRGF5KCkgOiB0aGlzLl9kLmdldERheSgpO1xuICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaW5wdXQgPSBwYXJzZVdlZWtkYXkoaW5wdXQsIHRoaXMubG9jYWxlRGF0YSgpKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFkZChpbnB1dCAtIGRheSwgJ2QnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkYXk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRMb2NhbGVEYXlPZldlZWsgKGlucHV0KSB7XG4gICAgICAgIHZhciB3ZWVrZGF5ID0gKHRoaXMuZGF5KCkgKyA3IC0gdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG93KSAlIDc7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2Vla2RheSA6IHRoaXMuYWRkKGlucHV0IC0gd2Vla2RheSwgJ2QnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRJU09EYXlPZldlZWsgKGlucHV0KSB7XG4gICAgICAgIC8vIGJlaGF2ZXMgdGhlIHNhbWUgYXMgbW9tZW50I2RheSBleGNlcHRcbiAgICAgICAgLy8gYXMgYSBnZXR0ZXIsIHJldHVybnMgNyBpbnN0ZWFkIG9mIDAgKDEtNyByYW5nZSBpbnN0ZWFkIG9mIDAtNilcbiAgICAgICAgLy8gYXMgYSBzZXR0ZXIsIHN1bmRheSBzaG91bGQgYmVsb25nIHRvIHRoZSBwcmV2aW91cyB3ZWVrLlxuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHRoaXMuZGF5KCkgfHwgNyA6IHRoaXMuZGF5KHRoaXMuZGF5KCkgJSA3ID8gaW5wdXQgOiBpbnB1dCAtIDcpO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKCdIJywgWydISCcsIDJdLCAwLCAnaG91cicpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdoJywgWydoaCcsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhvdXJzKCkgJSAxMiB8fCAxMjtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIG1lcmlkaWVtICh0b2tlbiwgbG93ZXJjYXNlKSB7XG4gICAgICAgIGFkZEZvcm1hdFRva2VuKHRva2VuLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubWVyaWRpZW0odGhpcy5ob3VycygpLCB0aGlzLm1pbnV0ZXMoKSwgbG93ZXJjYXNlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbWVyaWRpZW0oJ2EnLCB0cnVlKTtcbiAgICBtZXJpZGllbSgnQScsIGZhbHNlKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnaG91cicsICdoJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBmdW5jdGlvbiBtYXRjaE1lcmlkaWVtIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUuX21lcmlkaWVtUGFyc2U7XG4gICAgfVxuXG4gICAgYWRkUmVnZXhUb2tlbignYScsICBtYXRjaE1lcmlkaWVtKTtcbiAgICBhZGRSZWdleFRva2VuKCdBJywgIG1hdGNoTWVyaWRpZW0pO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0gnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdoJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignSEgnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignaGgnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnSCcsICdISCddLCBIT1VSKTtcbiAgICBhZGRQYXJzZVRva2VuKFsnYScsICdBJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2lzUG0gPSBjb25maWcuX2xvY2FsZS5pc1BNKGlucHV0KTtcbiAgICAgICAgY29uZmlnLl9tZXJpZGllbSA9IGlucHV0O1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oWydoJywgJ2hoJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgY29uZmlnLl9wZi5iaWdIb3VyID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIC8vIExPQ0FMRVNcblxuICAgIGZ1bmN0aW9uIGxvY2FsZUlzUE0gKGlucHV0KSB7XG4gICAgICAgIC8vIElFOCBRdWlya3MgTW9kZSAmIElFNyBTdGFuZGFyZHMgTW9kZSBkbyBub3QgYWxsb3cgYWNjZXNzaW5nIHN0cmluZ3MgbGlrZSBhcnJheXNcbiAgICAgICAgLy8gVXNpbmcgY2hhckF0IHNob3VsZCBiZSBtb3JlIGNvbXBhdGlibGUuXG4gICAgICAgIHJldHVybiAoKGlucHV0ICsgJycpLnRvTG93ZXJDYXNlKCkuY2hhckF0KDApID09PSAncCcpO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlTWVyaWRpZW1QYXJzZSA9IC9bYXBdXFwuP20/XFwuPy9pO1xuICAgIGZ1bmN0aW9uIGxvY2FsZU1lcmlkaWVtIChob3VycywgbWludXRlcywgaXNMb3dlcikge1xuICAgICAgICBpZiAoaG91cnMgPiAxMSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzTG93ZXIgPyAncG0nIDogJ1BNJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpc0xvd2VyID8gJ2FtJyA6ICdBTSc7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIC8vIFNldHRpbmcgdGhlIGhvdXIgc2hvdWxkIGtlZXAgdGhlIHRpbWUsIGJlY2F1c2UgdGhlIHVzZXIgZXhwbGljaXRseVxuICAgIC8vIHNwZWNpZmllZCB3aGljaCBob3VyIGhlIHdhbnRzLiBTbyB0cnlpbmcgdG8gbWFpbnRhaW4gdGhlIHNhbWUgaG91ciAoaW5cbiAgICAvLyBhIG5ldyB0aW1lem9uZSkgbWFrZXMgc2Vuc2UuIEFkZGluZy9zdWJ0cmFjdGluZyBob3VycyBkb2VzIG5vdCBmb2xsb3dcbiAgICAvLyB0aGlzIHJ1bGUuXG4gICAgdmFyIGdldFNldEhvdXIgPSBtYWtlR2V0U2V0KCdIb3VycycsIHRydWUpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ20nLCBbJ21tJywgMl0sIDAsICdtaW51dGUnKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnbWludXRlJywgJ20nKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ20nLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdtbScsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRQYXJzZVRva2VuKFsnbScsICdtbSddLCBNSU5VVEUpO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldE1pbnV0ZSA9IG1ha2VHZXRTZXQoJ01pbnV0ZXMnLCBmYWxzZSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigncycsIFsnc3MnLCAyXSwgMCwgJ3NlY29uZCcpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdzZWNvbmQnLCAncycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbigncycsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ3NzJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydzJywgJ3NzJ10sIFNFQ09ORCk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0U2Vjb25kID0gbWFrZUdldFNldCgnU2Vjb25kcycsIGZhbHNlKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdTJywgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gfn4odGhpcy5taWxsaXNlY29uZCgpIC8gMTAwKTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1MnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gfn4odGhpcy5taWxsaXNlY29uZCgpIC8gMTApO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gbWlsbGlzZWNvbmRfX21pbGxpc2Vjb25kcyAodG9rZW4pIHtcbiAgICAgICAgYWRkRm9ybWF0VG9rZW4oMCwgW3Rva2VuLCAzXSwgMCwgJ21pbGxpc2Vjb25kJyk7XG4gICAgfVxuXG4gICAgbWlsbGlzZWNvbmRfX21pbGxpc2Vjb25kcygnU1NTJyk7XG4gICAgbWlsbGlzZWNvbmRfX21pbGxpc2Vjb25kcygnU1NTUycpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtaWxsaXNlY29uZCcsICdtcycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignUycsICAgIG1hdGNoMXRvMywgbWF0Y2gxKTtcbiAgICBhZGRSZWdleFRva2VuKCdTUycsICAgbWF0Y2gxdG8zLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1NTUycsICBtYXRjaDF0bzMsIG1hdGNoMyk7XG4gICAgYWRkUmVnZXhUb2tlbignU1NTUycsIG1hdGNoVW5zaWduZWQpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydTJywgJ1NTJywgJ1NTUycsICdTU1NTJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbTUlMTElTRUNPTkRdID0gdG9JbnQoKCcwLicgKyBpbnB1dCkgKiAxMDAwKTtcbiAgICB9KTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRNaWxsaXNlY29uZCA9IG1ha2VHZXRTZXQoJ01pbGxpc2Vjb25kcycsIGZhbHNlKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCd6JywgIDAsIDAsICd6b25lQWJicicpO1xuICAgIGFkZEZvcm1hdFRva2VuKCd6eicsIDAsIDAsICd6b25lTmFtZScpO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0Wm9uZUFiYnIgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyAnVVRDJyA6ICcnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFpvbmVOYW1lICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gJ0Nvb3JkaW5hdGVkIFVuaXZlcnNhbCBUaW1lJyA6ICcnO1xuICAgIH1cblxuICAgIHZhciBtb21lbnRQcm90b3R5cGVfX3Byb3RvID0gTW9tZW50LnByb3RvdHlwZTtcblxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uYWRkICAgICAgICAgID0gYWRkX3N1YnRyYWN0X19hZGQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5jYWxlbmRhciAgICAgPSBtb21lbnRfY2FsZW5kYXJfX2NhbGVuZGFyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uY2xvbmUgICAgICAgID0gY2xvbmU7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kaWZmICAgICAgICAgPSBkaWZmO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZW5kT2YgICAgICAgID0gZW5kT2Y7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5mb3JtYXQgICAgICAgPSBmb3JtYXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5mcm9tICAgICAgICAgPSBmcm9tO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZnJvbU5vdyAgICAgID0gZnJvbU5vdztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmdldCAgICAgICAgICA9IGdldFNldDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmludmFsaWRBdCAgICA9IGludmFsaWRBdDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzQWZ0ZXIgICAgICA9IGlzQWZ0ZXI7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0JlZm9yZSAgICAgPSBpc0JlZm9yZTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzQmV0d2VlbiAgICA9IGlzQmV0d2VlbjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzU2FtZSAgICAgICA9IGlzU2FtZTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzVmFsaWQgICAgICA9IG1vbWVudF92YWxpZF9faXNWYWxpZDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmxhbmcgICAgICAgICA9IGxhbmc7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5sb2NhbGUgICAgICAgPSBsb2NhbGU7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5sb2NhbGVEYXRhICAgPSBsb2NhbGVEYXRhO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubWF4ICAgICAgICAgID0gcHJvdG90eXBlTWF4O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubWluICAgICAgICAgID0gcHJvdG90eXBlTWluO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ucGFyc2luZ0ZsYWdzID0gcGFyc2luZ0ZsYWdzO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uc2V0ICAgICAgICAgID0gZ2V0U2V0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uc3RhcnRPZiAgICAgID0gc3RhcnRPZjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnN1YnRyYWN0ICAgICA9IGFkZF9zdWJ0cmFjdF9fc3VidHJhY3Q7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by50b0FycmF5ICAgICAgPSB0b0FycmF5O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9EYXRlICAgICAgID0gdG9EYXRlO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9JU09TdHJpbmcgID0gbW9tZW50X2Zvcm1hdF9fdG9JU09TdHJpbmc7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by50b0pTT04gICAgICAgPSBtb21lbnRfZm9ybWF0X190b0lTT1N0cmluZztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvU3RyaW5nICAgICA9IHRvU3RyaW5nO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udW5peCAgICAgICAgID0gdW5peDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnZhbHVlT2YgICAgICA9IHRvX3R5cGVfX3ZhbHVlT2Y7XG5cbiAgICAvLyBZZWFyXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by55ZWFyICAgICAgID0gZ2V0U2V0WWVhcjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzTGVhcFllYXIgPSBnZXRJc0xlYXBZZWFyO1xuXG4gICAgLy8gV2VlayBZZWFyXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrWWVhciAgICA9IGdldFNldFdlZWtZZWFyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNvV2Vla1llYXIgPSBnZXRTZXRJU09XZWVrWWVhcjtcblxuICAgIC8vIFF1YXJ0ZXJcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnF1YXJ0ZXIgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnF1YXJ0ZXJzID0gZ2V0U2V0UXVhcnRlcjtcblxuICAgIC8vIE1vbnRoXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5tb250aCAgICAgICA9IGdldFNldE1vbnRoO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGF5c0luTW9udGggPSBnZXREYXlzSW5Nb250aDtcblxuICAgIC8vIFdlZWtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLndlZWsgICAgICAgICAgID0gbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrcyAgICAgICAgPSBnZXRTZXRXZWVrO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNvV2VlayAgICAgICAgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzb1dlZWtzICAgICA9IGdldFNldElTT1dlZWs7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrc0luWWVhciAgICA9IGdldFdlZWtzSW5ZZWFyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNvV2Vla3NJblllYXIgPSBnZXRJU09XZWVrc0luWWVhcjtcblxuICAgIC8vIERheVxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGF0ZSAgICAgICA9IGdldFNldERheU9mTW9udGg7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kYXkgICAgICAgID0gbW9tZW50UHJvdG90eXBlX19wcm90by5kYXlzICAgICAgICAgICAgID0gZ2V0U2V0RGF5T2ZXZWVrO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ud2Vla2RheSAgICA9IGdldFNldExvY2FsZURheU9mV2VlaztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzb1dlZWtkYXkgPSBnZXRTZXRJU09EYXlPZldlZWs7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kYXlPZlllYXIgID0gZ2V0U2V0RGF5T2ZZZWFyO1xuXG4gICAgLy8gSG91clxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaG91ciA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaG91cnMgPSBnZXRTZXRIb3VyO1xuXG4gICAgLy8gTWludXRlXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5taW51dGUgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1pbnV0ZXMgPSBnZXRTZXRNaW51dGU7XG5cbiAgICAvLyBTZWNvbmRcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnNlY29uZCA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8uc2Vjb25kcyA9IGdldFNldFNlY29uZDtcblxuICAgIC8vIE1pbGxpc2Vjb25kXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5taWxsaXNlY29uZCA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubWlsbGlzZWNvbmRzID0gZ2V0U2V0TWlsbGlzZWNvbmQ7XG5cbiAgICAvLyBPZmZzZXRcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnV0Y09mZnNldCAgICAgICAgICAgID0gZ2V0U2V0T2Zmc2V0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udXRjICAgICAgICAgICAgICAgICAgPSBzZXRPZmZzZXRUb1VUQztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmxvY2FsICAgICAgICAgICAgICAgID0gc2V0T2Zmc2V0VG9Mb2NhbDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnBhcnNlWm9uZSAgICAgICAgICAgID0gc2V0T2Zmc2V0VG9QYXJzZWRPZmZzZXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5oYXNBbGlnbmVkSG91ck9mZnNldCA9IGhhc0FsaWduZWRIb3VyT2Zmc2V0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNEU1QgICAgICAgICAgICAgICAgPSBpc0RheWxpZ2h0U2F2aW5nVGltZTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzRFNUU2hpZnRlZCAgICAgICAgID0gaXNEYXlsaWdodFNhdmluZ1RpbWVTaGlmdGVkO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNMb2NhbCAgICAgICAgICAgICAgPSBpc0xvY2FsO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNVdGNPZmZzZXQgICAgICAgICAgPSBpc1V0Y09mZnNldDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzVXRjICAgICAgICAgICAgICAgID0gaXNVdGM7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc1VUQyAgICAgICAgICAgICAgICA9IGlzVXRjO1xuXG4gICAgLy8gVGltZXpvbmVcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnpvbmVBYmJyID0gZ2V0Wm9uZUFiYnI7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by56b25lTmFtZSA9IGdldFpvbmVOYW1lO1xuXG4gICAgLy8gRGVwcmVjYXRpb25zXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kYXRlcyAgPSBkZXByZWNhdGUoJ2RhdGVzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSBkYXRlIGluc3RlYWQuJywgZ2V0U2V0RGF5T2ZNb250aCk7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5tb250aHMgPSBkZXByZWNhdGUoJ21vbnRocyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgbW9udGggaW5zdGVhZCcsIGdldFNldE1vbnRoKTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnllYXJzICA9IGRlcHJlY2F0ZSgneWVhcnMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIHllYXIgaW5zdGVhZCcsIGdldFNldFllYXIpO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uem9uZSAgID0gZGVwcmVjYXRlKCdtb21lbnQoKS56b25lIGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQoKS51dGNPZmZzZXQgaW5zdGVhZC4gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE3NzknLCBnZXRTZXRab25lKTtcblxuICAgIHZhciBtb21lbnRQcm90b3R5cGUgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvO1xuXG4gICAgZnVuY3Rpb24gbW9tZW50X19jcmVhdGVVbml4IChpbnB1dCkge1xuICAgICAgICByZXR1cm4gbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0ICogMTAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50X19jcmVhdGVJblpvbmUgKCkge1xuICAgICAgICByZXR1cm4gbG9jYWxfX2NyZWF0ZUxvY2FsLmFwcGx5KG51bGwsIGFyZ3VtZW50cykucGFyc2Vab25lKCk7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRDYWxlbmRhciA9IHtcbiAgICAgICAgc2FtZURheSA6ICdbVG9kYXkgYXRdIExUJyxcbiAgICAgICAgbmV4dERheSA6ICdbVG9tb3Jyb3cgYXRdIExUJyxcbiAgICAgICAgbmV4dFdlZWsgOiAnZGRkZCBbYXRdIExUJyxcbiAgICAgICAgbGFzdERheSA6ICdbWWVzdGVyZGF5IGF0XSBMVCcsXG4gICAgICAgIGxhc3RXZWVrIDogJ1tMYXN0XSBkZGRkIFthdF0gTFQnLFxuICAgICAgICBzYW1lRWxzZSA6ICdMJ1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVfY2FsZW5kYXJfX2NhbGVuZGFyIChrZXksIG1vbSwgbm93KSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9jYWxlbmRhcltrZXldO1xuICAgICAgICByZXR1cm4gdHlwZW9mIG91dHB1dCA9PT0gJ2Z1bmN0aW9uJyA/IG91dHB1dC5jYWxsKG1vbSwgbm93KSA6IG91dHB1dDtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvbmdEYXRlRm9ybWF0ID0ge1xuICAgICAgICBMVFMgIDogJ2g6bW06c3MgQScsXG4gICAgICAgIExUICAgOiAnaDptbSBBJyxcbiAgICAgICAgTCAgICA6ICdNTS9ERC9ZWVlZJyxcbiAgICAgICAgTEwgICA6ICdNTU1NIEQsIFlZWVknLFxuICAgICAgICBMTEwgIDogJ01NTU0gRCwgWVlZWSBMVCcsXG4gICAgICAgIExMTEwgOiAnZGRkZCwgTU1NTSBELCBZWVlZIExUJ1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsb25nRGF0ZUZvcm1hdCAoa2V5KSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXldO1xuICAgICAgICBpZiAoIW91dHB1dCAmJiB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXkudG9VcHBlckNhc2UoKV0pIHtcbiAgICAgICAgICAgIG91dHB1dCA9IHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleS50b1VwcGVyQ2FzZSgpXS5yZXBsYWNlKC9NTU1NfE1NfEREfGRkZGQvZywgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWwuc2xpY2UoMSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV0gPSBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdEludmFsaWREYXRlID0gJ0ludmFsaWQgZGF0ZSc7XG5cbiAgICBmdW5jdGlvbiBpbnZhbGlkRGF0ZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZhbGlkRGF0ZTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdE9yZGluYWwgPSAnJWQnO1xuICAgIHZhciBkZWZhdWx0T3JkaW5hbFBhcnNlID0gL1xcZHsxLDJ9LztcblxuICAgIGZ1bmN0aW9uIG9yZGluYWwgKG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3JkaW5hbC5yZXBsYWNlKCclZCcsIG51bWJlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJlUGFyc2VQb3N0Rm9ybWF0IChzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdFJlbGF0aXZlVGltZSA9IHtcbiAgICAgICAgZnV0dXJlIDogJ2luICVzJyxcbiAgICAgICAgcGFzdCAgIDogJyVzIGFnbycsXG4gICAgICAgIHMgIDogJ2EgZmV3IHNlY29uZHMnLFxuICAgICAgICBtICA6ICdhIG1pbnV0ZScsXG4gICAgICAgIG1tIDogJyVkIG1pbnV0ZXMnLFxuICAgICAgICBoICA6ICdhbiBob3VyJyxcbiAgICAgICAgaGggOiAnJWQgaG91cnMnLFxuICAgICAgICBkICA6ICdhIGRheScsXG4gICAgICAgIGRkIDogJyVkIGRheXMnLFxuICAgICAgICBNICA6ICdhIG1vbnRoJyxcbiAgICAgICAgTU0gOiAnJWQgbW9udGhzJyxcbiAgICAgICAgeSAgOiAnYSB5ZWFyJyxcbiAgICAgICAgeXkgOiAnJWQgeWVhcnMnXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHJlbGF0aXZlX19yZWxhdGl2ZVRpbWUgKG51bWJlciwgd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5fcmVsYXRpdmVUaW1lW3N0cmluZ107XG4gICAgICAgIHJldHVybiAodHlwZW9mIG91dHB1dCA9PT0gJ2Z1bmN0aW9uJykgP1xuICAgICAgICAgICAgb3V0cHV0KG51bWJlciwgd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSkgOlxuICAgICAgICAgICAgb3V0cHV0LnJlcGxhY2UoLyVkL2ksIG51bWJlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFzdEZ1dHVyZSAoZGlmZiwgb3V0cHV0KSB7XG4gICAgICAgIHZhciBmb3JtYXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbZGlmZiA+IDAgPyAnZnV0dXJlJyA6ICdwYXN0J107XG4gICAgICAgIHJldHVybiB0eXBlb2YgZm9ybWF0ID09PSAnZnVuY3Rpb24nID8gZm9ybWF0KG91dHB1dCkgOiBmb3JtYXQucmVwbGFjZSgvJXMvaSwgb3V0cHV0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVfc2V0X19zZXQgKGNvbmZpZykge1xuICAgICAgICB2YXIgcHJvcCwgaTtcbiAgICAgICAgZm9yIChpIGluIGNvbmZpZykge1xuICAgICAgICAgICAgcHJvcCA9IGNvbmZpZ1tpXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRoaXNbaV0gPSBwcm9wO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzWydfJyArIGldID0gcHJvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBMZW5pZW50IG9yZGluYWwgcGFyc2luZyBhY2NlcHRzIGp1c3QgYSBudW1iZXIgaW4gYWRkaXRpb24gdG9cbiAgICAgICAgLy8gbnVtYmVyICsgKHBvc3NpYmx5KSBzdHVmZiBjb21pbmcgZnJvbSBfb3JkaW5hbFBhcnNlTGVuaWVudC5cbiAgICAgICAgdGhpcy5fb3JkaW5hbFBhcnNlTGVuaWVudCA9IG5ldyBSZWdFeHAodGhpcy5fb3JkaW5hbFBhcnNlLnNvdXJjZSArICd8JyArIC9cXGR7MSwyfS8uc291cmNlKTtcbiAgICB9XG5cbiAgICB2YXIgcHJvdG90eXBlX19wcm90byA9IExvY2FsZS5wcm90b3R5cGU7XG5cbiAgICBwcm90b3R5cGVfX3Byb3RvLl9jYWxlbmRhciAgICAgICA9IGRlZmF1bHRDYWxlbmRhcjtcbiAgICBwcm90b3R5cGVfX3Byb3RvLmNhbGVuZGFyICAgICAgICA9IGxvY2FsZV9jYWxlbmRhcl9fY2FsZW5kYXI7XG4gICAgcHJvdG90eXBlX19wcm90by5fbG9uZ0RhdGVGb3JtYXQgPSBkZWZhdWx0TG9uZ0RhdGVGb3JtYXQ7XG4gICAgcHJvdG90eXBlX19wcm90by5sb25nRGF0ZUZvcm1hdCAgPSBsb25nRGF0ZUZvcm1hdDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9pbnZhbGlkRGF0ZSAgICA9IGRlZmF1bHRJbnZhbGlkRGF0ZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLmludmFsaWREYXRlICAgICA9IGludmFsaWREYXRlO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX29yZGluYWwgICAgICAgID0gZGVmYXVsdE9yZGluYWw7XG4gICAgcHJvdG90eXBlX19wcm90by5vcmRpbmFsICAgICAgICAgPSBvcmRpbmFsO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX29yZGluYWxQYXJzZSAgID0gZGVmYXVsdE9yZGluYWxQYXJzZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLnByZXBhcnNlICAgICAgICA9IHByZVBhcnNlUG9zdEZvcm1hdDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLnBvc3Rmb3JtYXQgICAgICA9IHByZVBhcnNlUG9zdEZvcm1hdDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9yZWxhdGl2ZVRpbWUgICA9IGRlZmF1bHRSZWxhdGl2ZVRpbWU7XG4gICAgcHJvdG90eXBlX19wcm90by5yZWxhdGl2ZVRpbWUgICAgPSByZWxhdGl2ZV9fcmVsYXRpdmVUaW1lO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ucGFzdEZ1dHVyZSAgICAgID0gcGFzdEZ1dHVyZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLnNldCAgICAgICAgICAgICA9IGxvY2FsZV9zZXRfX3NldDtcblxuICAgIC8vIE1vbnRoXG4gICAgcHJvdG90eXBlX19wcm90by5tb250aHMgICAgICAgPSAgICAgICAgbG9jYWxlTW9udGhzO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX21vbnRocyAgICAgID0gZGVmYXVsdExvY2FsZU1vbnRocztcbiAgICBwcm90b3R5cGVfX3Byb3RvLm1vbnRoc1Nob3J0ICA9ICAgICAgICBsb2NhbGVNb250aHNTaG9ydDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9tb250aHNTaG9ydCA9IGRlZmF1bHRMb2NhbGVNb250aHNTaG9ydDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLm1vbnRoc1BhcnNlICA9ICAgICAgICBsb2NhbGVNb250aHNQYXJzZTtcblxuICAgIC8vIFdlZWtcbiAgICBwcm90b3R5cGVfX3Byb3RvLndlZWsgPSBsb2NhbGVXZWVrO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX3dlZWsgPSBkZWZhdWx0TG9jYWxlV2VlaztcbiAgICBwcm90b3R5cGVfX3Byb3RvLmZpcnN0RGF5T2ZZZWFyID0gbG9jYWxlRmlyc3REYXlPZlllYXI7XG4gICAgcHJvdG90eXBlX19wcm90by5maXJzdERheU9mV2VlayA9IGxvY2FsZUZpcnN0RGF5T2ZXZWVrO1xuXG4gICAgLy8gRGF5IG9mIFdlZWtcbiAgICBwcm90b3R5cGVfX3Byb3RvLndlZWtkYXlzICAgICAgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX3dlZWtkYXlzICAgICAgPSBkZWZhdWx0TG9jYWxlV2Vla2RheXM7XG4gICAgcHJvdG90eXBlX19wcm90by53ZWVrZGF5c01pbiAgICA9ICAgICAgICBsb2NhbGVXZWVrZGF5c01pbjtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl93ZWVrZGF5c01pbiAgID0gZGVmYXVsdExvY2FsZVdlZWtkYXlzTWluO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ud2Vla2RheXNTaG9ydCAgPSAgICAgICAgbG9jYWxlV2Vla2RheXNTaG9ydDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl93ZWVrZGF5c1Nob3J0ID0gZGVmYXVsdExvY2FsZVdlZWtkYXlzU2hvcnQ7XG4gICAgcHJvdG90eXBlX19wcm90by53ZWVrZGF5c1BhcnNlICA9ICAgICAgICBsb2NhbGVXZWVrZGF5c1BhcnNlO1xuXG4gICAgLy8gSG91cnNcbiAgICBwcm90b3R5cGVfX3Byb3RvLmlzUE0gPSBsb2NhbGVJc1BNO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX21lcmlkaWVtUGFyc2UgPSBkZWZhdWx0TG9jYWxlTWVyaWRpZW1QYXJzZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLm1lcmlkaWVtID0gbG9jYWxlTWVyaWRpZW07XG5cbiAgICBmdW5jdGlvbiBsaXN0c19fZ2V0IChmb3JtYXQsIGluZGV4LCBmaWVsZCwgc2V0dGVyKSB7XG4gICAgICAgIHZhciBsb2NhbGUgPSBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKCk7XG4gICAgICAgIHZhciB1dGMgPSBjcmVhdGVfdXRjX19jcmVhdGVVVEMoKS5zZXQoc2V0dGVyLCBpbmRleCk7XG4gICAgICAgIHJldHVybiBsb2NhbGVbZmllbGRdKHV0YywgZm9ybWF0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0IChmb3JtYXQsIGluZGV4LCBmaWVsZCwgY291bnQsIHNldHRlcikge1xuICAgICAgICBpZiAodHlwZW9mIGZvcm1hdCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGluZGV4ID0gZm9ybWF0O1xuICAgICAgICAgICAgZm9ybWF0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8ICcnO1xuXG4gICAgICAgIGlmIChpbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbGlzdHNfX2dldChmb3JtYXQsIGluZGV4LCBmaWVsZCwgc2V0dGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgb3V0ID0gW107XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBvdXRbaV0gPSBsaXN0c19fZ2V0KGZvcm1hdCwgaSwgZmllbGQsIHNldHRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0c19fbGlzdE1vbnRocyAoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdChmb3JtYXQsIGluZGV4LCAnbW9udGhzJywgMTIsICdtb250aCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RzX19saXN0TW9udGhzU2hvcnQgKGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3QoZm9ybWF0LCBpbmRleCwgJ21vbnRoc1Nob3J0JywgMTIsICdtb250aCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RzX19saXN0V2Vla2RheXMgKGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3QoZm9ybWF0LCBpbmRleCwgJ3dlZWtkYXlzJywgNywgJ2RheScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RzX19saXN0V2Vla2RheXNTaG9ydCAoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdChmb3JtYXQsIGluZGV4LCAnd2Vla2RheXNTaG9ydCcsIDcsICdkYXknKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0c19fbGlzdFdlZWtkYXlzTWluIChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0KGZvcm1hdCwgaW5kZXgsICd3ZWVrZGF5c01pbicsIDcsICdkYXknKTtcbiAgICB9XG5cbiAgICBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlKCdlbicsIHtcbiAgICAgICAgb3JkaW5hbFBhcnNlOiAvXFxkezEsMn0odGh8c3R8bmR8cmQpLyxcbiAgICAgICAgb3JkaW5hbCA6IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgICAgIHZhciBiID0gbnVtYmVyICUgMTAsXG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gKHRvSW50KG51bWJlciAlIDEwMCAvIDEwKSA9PT0gMSkgPyAndGgnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMSkgPyAnc3QnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMikgPyAnbmQnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMykgPyAncmQnIDogJ3RoJztcbiAgICAgICAgICAgIHJldHVybiBudW1iZXIgKyBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFNpZGUgZWZmZWN0IGltcG9ydHNcbiAgICB1dGlsc19ob29rc19faG9va3MubGFuZyA9IGRlcHJlY2F0ZSgnbW9tZW50LmxhbmcgaXMgZGVwcmVjYXRlZC4gVXNlIG1vbWVudC5sb2NhbGUgaW5zdGVhZC4nLCBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlKTtcbiAgICB1dGlsc19ob29rc19faG9va3MubGFuZ0RhdGEgPSBkZXByZWNhdGUoJ21vbWVudC5sYW5nRGF0YSBpcyBkZXByZWNhdGVkLiBVc2UgbW9tZW50LmxvY2FsZURhdGEgaW5zdGVhZC4nLCBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKTtcblxuICAgIHZhciBtYXRoQWJzID0gTWF0aC5hYnM7XG5cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9hYnNfX2FicyAoKSB7XG4gICAgICAgIHZhciBkYXRhICAgICAgICAgICA9IHRoaXMuX2RhdGE7XG5cbiAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzID0gbWF0aEFicyh0aGlzLl9taWxsaXNlY29uZHMpO1xuICAgICAgICB0aGlzLl9kYXlzICAgICAgICAgPSBtYXRoQWJzKHRoaXMuX2RheXMpO1xuICAgICAgICB0aGlzLl9tb250aHMgICAgICAgPSBtYXRoQWJzKHRoaXMuX21vbnRocyk7XG5cbiAgICAgICAgZGF0YS5taWxsaXNlY29uZHMgID0gbWF0aEFicyhkYXRhLm1pbGxpc2Vjb25kcyk7XG4gICAgICAgIGRhdGEuc2Vjb25kcyAgICAgICA9IG1hdGhBYnMoZGF0YS5zZWNvbmRzKTtcbiAgICAgICAgZGF0YS5taW51dGVzICAgICAgID0gbWF0aEFicyhkYXRhLm1pbnV0ZXMpO1xuICAgICAgICBkYXRhLmhvdXJzICAgICAgICAgPSBtYXRoQWJzKGRhdGEuaG91cnMpO1xuICAgICAgICBkYXRhLm1vbnRocyAgICAgICAgPSBtYXRoQWJzKGRhdGEubW9udGhzKTtcbiAgICAgICAgZGF0YS55ZWFycyAgICAgICAgID0gbWF0aEFicyhkYXRhLnllYXJzKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9hZGRfc3VidHJhY3RfX2FkZFN1YnRyYWN0IChkdXJhdGlvbiwgaW5wdXQsIHZhbHVlLCBkaXJlY3Rpb24pIHtcbiAgICAgICAgdmFyIG90aGVyID0gY3JlYXRlX19jcmVhdGVEdXJhdGlvbihpbnB1dCwgdmFsdWUpO1xuXG4gICAgICAgIGR1cmF0aW9uLl9taWxsaXNlY29uZHMgKz0gZGlyZWN0aW9uICogb3RoZXIuX21pbGxpc2Vjb25kcztcbiAgICAgICAgZHVyYXRpb24uX2RheXMgICAgICAgICArPSBkaXJlY3Rpb24gKiBvdGhlci5fZGF5cztcbiAgICAgICAgZHVyYXRpb24uX21vbnRocyAgICAgICArPSBkaXJlY3Rpb24gKiBvdGhlci5fbW9udGhzO1xuXG4gICAgICAgIHJldHVybiBkdXJhdGlvbi5fYnViYmxlKCk7XG4gICAgfVxuXG4gICAgLy8gc3VwcG9ydHMgb25seSAyLjAtc3R5bGUgYWRkKDEsICdzJykgb3IgYWRkKGR1cmF0aW9uKVxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fYWRkIChpbnB1dCwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fYWRkU3VidHJhY3QodGhpcywgaW5wdXQsIHZhbHVlLCAxKTtcbiAgICB9XG5cbiAgICAvLyBzdXBwb3J0cyBvbmx5IDIuMC1zdHlsZSBzdWJ0cmFjdCgxLCAncycpIG9yIHN1YnRyYWN0KGR1cmF0aW9uKVxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fc3VidHJhY3QgKGlucHV0LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19hZGRTdWJ0cmFjdCh0aGlzLCBpbnB1dCwgdmFsdWUsIC0xKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBidWJibGUgKCkge1xuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5fbWlsbGlzZWNvbmRzO1xuICAgICAgICB2YXIgZGF5cyAgICAgICAgID0gdGhpcy5fZGF5cztcbiAgICAgICAgdmFyIG1vbnRocyAgICAgICA9IHRoaXMuX21vbnRocztcbiAgICAgICAgdmFyIGRhdGEgICAgICAgICA9IHRoaXMuX2RhdGE7XG4gICAgICAgIHZhciBzZWNvbmRzLCBtaW51dGVzLCBob3VycywgeWVhcnMgPSAwO1xuXG4gICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgY29kZSBidWJibGVzIHVwIHZhbHVlcywgc2VlIHRoZSB0ZXN0cyBmb3JcbiAgICAgICAgLy8gZXhhbXBsZXMgb2Ygd2hhdCB0aGF0IG1lYW5zLlxuICAgICAgICBkYXRhLm1pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kcyAlIDEwMDA7XG5cbiAgICAgICAgc2Vjb25kcyAgICAgICAgICAgPSBhYnNGbG9vcihtaWxsaXNlY29uZHMgLyAxMDAwKTtcbiAgICAgICAgZGF0YS5zZWNvbmRzICAgICAgPSBzZWNvbmRzICUgNjA7XG5cbiAgICAgICAgbWludXRlcyAgICAgICAgICAgPSBhYnNGbG9vcihzZWNvbmRzIC8gNjApO1xuICAgICAgICBkYXRhLm1pbnV0ZXMgICAgICA9IG1pbnV0ZXMgJSA2MDtcblxuICAgICAgICBob3VycyAgICAgICAgICAgICA9IGFic0Zsb29yKG1pbnV0ZXMgLyA2MCk7XG4gICAgICAgIGRhdGEuaG91cnMgICAgICAgID0gaG91cnMgJSAyNDtcblxuICAgICAgICBkYXlzICs9IGFic0Zsb29yKGhvdXJzIC8gMjQpO1xuXG4gICAgICAgIC8vIEFjY3VyYXRlbHkgY29udmVydCBkYXlzIHRvIHllYXJzLCBhc3N1bWUgc3RhcnQgZnJvbSB5ZWFyIDAuXG4gICAgICAgIHllYXJzID0gYWJzRmxvb3IoZGF5c1RvWWVhcnMoZGF5cykpO1xuICAgICAgICBkYXlzIC09IGFic0Zsb29yKHllYXJzVG9EYXlzKHllYXJzKSk7XG5cbiAgICAgICAgLy8gMzAgZGF5cyB0byBhIG1vbnRoXG4gICAgICAgIC8vIFRPRE8gKGlza3Jlbik6IFVzZSBhbmNob3IgZGF0ZSAobGlrZSAxc3QgSmFuKSB0byBjb21wdXRlIHRoaXMuXG4gICAgICAgIG1vbnRocyArPSBhYnNGbG9vcihkYXlzIC8gMzApO1xuICAgICAgICBkYXlzICAgJT0gMzA7XG5cbiAgICAgICAgLy8gMTIgbW9udGhzIC0+IDEgeWVhclxuICAgICAgICB5ZWFycyAgKz0gYWJzRmxvb3IobW9udGhzIC8gMTIpO1xuICAgICAgICBtb250aHMgJT0gMTI7XG5cbiAgICAgICAgZGF0YS5kYXlzICAgPSBkYXlzO1xuICAgICAgICBkYXRhLm1vbnRocyA9IG1vbnRocztcbiAgICAgICAgZGF0YS55ZWFycyAgPSB5ZWFycztcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlzVG9ZZWFycyAoZGF5cykge1xuICAgICAgICAvLyA0MDAgeWVhcnMgaGF2ZSAxNDYwOTcgZGF5cyAodGFraW5nIGludG8gYWNjb3VudCBsZWFwIHllYXIgcnVsZXMpXG4gICAgICAgIHJldHVybiBkYXlzICogNDAwIC8gMTQ2MDk3O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHllYXJzVG9EYXlzICh5ZWFycykge1xuICAgICAgICAvLyB5ZWFycyAqIDM2NSArIGFic0Zsb29yKHllYXJzIC8gNCkgLVxuICAgICAgICAvLyAgICAgYWJzRmxvb3IoeWVhcnMgLyAxMDApICsgYWJzRmxvb3IoeWVhcnMgLyA0MDApO1xuICAgICAgICByZXR1cm4geWVhcnMgKiAxNDYwOTcgLyA0MDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXMgKHVuaXRzKSB7XG4gICAgICAgIHZhciBkYXlzO1xuICAgICAgICB2YXIgbW9udGhzO1xuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5fbWlsbGlzZWNvbmRzO1xuXG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21vbnRoJyB8fCB1bml0cyA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgICBkYXlzICAgPSB0aGlzLl9kYXlzICAgKyBtaWxsaXNlY29uZHMgLyA4NjRlNTtcbiAgICAgICAgICAgIG1vbnRocyA9IHRoaXMuX21vbnRocyArIGRheXNUb1llYXJzKGRheXMpICogMTI7XG4gICAgICAgICAgICByZXR1cm4gdW5pdHMgPT09ICdtb250aCcgPyBtb250aHMgOiBtb250aHMgLyAxMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGhhbmRsZSBtaWxsaXNlY29uZHMgc2VwYXJhdGVseSBiZWNhdXNlIG9mIGZsb2F0aW5nIHBvaW50IG1hdGggZXJyb3JzIChpc3N1ZSAjMTg2NylcbiAgICAgICAgICAgIGRheXMgPSB0aGlzLl9kYXlzICsgTWF0aC5yb3VuZCh5ZWFyc1RvRGF5cyh0aGlzLl9tb250aHMgLyAxMikpO1xuICAgICAgICAgICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3dlZWsnICAgOiByZXR1cm4gZGF5cyAvIDcgICAgICAgICAgICArIG1pbGxpc2Vjb25kcyAvIDYwNDhlNTtcbiAgICAgICAgICAgICAgICBjYXNlICdkYXknICAgIDogcmV0dXJuIGRheXMgICAgICAgICAgICAgICAgKyBtaWxsaXNlY29uZHMgLyA4NjRlNTtcbiAgICAgICAgICAgICAgICBjYXNlICdob3VyJyAgIDogcmV0dXJuIGRheXMgKiAyNCAgICAgICAgICAgKyBtaWxsaXNlY29uZHMgLyAzNmU1O1xuICAgICAgICAgICAgICAgIGNhc2UgJ21pbnV0ZScgOiByZXR1cm4gZGF5cyAqIDI0ICogNjAgICAgICArIG1pbGxpc2Vjb25kcyAvIDZlNDtcbiAgICAgICAgICAgICAgICBjYXNlICdzZWNvbmQnIDogcmV0dXJuIGRheXMgKiAyNCAqIDYwICogNjAgKyBtaWxsaXNlY29uZHMgLyAxMDAwO1xuICAgICAgICAgICAgICAgIC8vIE1hdGguZmxvb3IgcHJldmVudHMgZmxvYXRpbmcgcG9pbnQgbWF0aCBlcnJvcnMgaGVyZVxuICAgICAgICAgICAgICAgIGNhc2UgJ21pbGxpc2Vjb25kJzogcmV0dXJuIE1hdGguZmxvb3IoZGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApICsgbWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcignVW5rbm93biB1bml0ICcgKyB1bml0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUT0RPOiBVc2UgdGhpcy5hcygnbXMnKT9cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9hc19fdmFsdWVPZiAoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgK1xuICAgICAgICAgICAgdGhpcy5fZGF5cyAqIDg2NGU1ICtcbiAgICAgICAgICAgICh0aGlzLl9tb250aHMgJSAxMikgKiAyNTkyZTYgK1xuICAgICAgICAgICAgdG9JbnQodGhpcy5fbW9udGhzIC8gMTIpICogMzE1MzZlNlxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VBcyAoYWxpYXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFzKGFsaWFzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgYXNNaWxsaXNlY29uZHMgPSBtYWtlQXMoJ21zJyk7XG4gICAgdmFyIGFzU2Vjb25kcyAgICAgID0gbWFrZUFzKCdzJyk7XG4gICAgdmFyIGFzTWludXRlcyAgICAgID0gbWFrZUFzKCdtJyk7XG4gICAgdmFyIGFzSG91cnMgICAgICAgID0gbWFrZUFzKCdoJyk7XG4gICAgdmFyIGFzRGF5cyAgICAgICAgID0gbWFrZUFzKCdkJyk7XG4gICAgdmFyIGFzV2Vla3MgICAgICAgID0gbWFrZUFzKCd3Jyk7XG4gICAgdmFyIGFzTW9udGhzICAgICAgID0gbWFrZUFzKCdNJyk7XG4gICAgdmFyIGFzWWVhcnMgICAgICAgID0gbWFrZUFzKCd5Jyk7XG5cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9nZXRfX2dldCAodW5pdHMpIHtcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgIHJldHVybiB0aGlzW3VuaXRzICsgJ3MnXSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VHZXR0ZXIobmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFbbmFtZV07XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGR1cmF0aW9uX2dldF9fbWlsbGlzZWNvbmRzID0gbWFrZUdldHRlcignbWlsbGlzZWNvbmRzJyk7XG4gICAgdmFyIHNlY29uZHMgICAgICA9IG1ha2VHZXR0ZXIoJ3NlY29uZHMnKTtcbiAgICB2YXIgbWludXRlcyAgICAgID0gbWFrZUdldHRlcignbWludXRlcycpO1xuICAgIHZhciBob3VycyAgICAgICAgPSBtYWtlR2V0dGVyKCdob3VycycpO1xuICAgIHZhciBkYXlzICAgICAgICAgPSBtYWtlR2V0dGVyKCdkYXlzJyk7XG4gICAgdmFyIG1vbnRocyAgICAgICA9IG1ha2VHZXR0ZXIoJ21vbnRocycpO1xuICAgIHZhciB5ZWFycyAgICAgICAgPSBtYWtlR2V0dGVyKCd5ZWFycycpO1xuXG4gICAgZnVuY3Rpb24gd2Vla3MgKCkge1xuICAgICAgICByZXR1cm4gYWJzRmxvb3IodGhpcy5kYXlzKCkgLyA3KTtcbiAgICB9XG5cbiAgICB2YXIgcm91bmQgPSBNYXRoLnJvdW5kO1xuICAgIHZhciB0aHJlc2hvbGRzID0ge1xuICAgICAgICBzOiA0NSwgIC8vIHNlY29uZHMgdG8gbWludXRlXG4gICAgICAgIG06IDQ1LCAgLy8gbWludXRlcyB0byBob3VyXG4gICAgICAgIGg6IDIyLCAgLy8gaG91cnMgdG8gZGF5XG4gICAgICAgIGQ6IDI2LCAgLy8gZGF5cyB0byBtb250aFxuICAgICAgICBNOiAxMSAgIC8vIG1vbnRocyB0byB5ZWFyXG4gICAgfTtcblxuICAgIC8vIGhlbHBlciBmdW5jdGlvbiBmb3IgbW9tZW50LmZuLmZyb20sIG1vbWVudC5mbi5mcm9tTm93LCBhbmQgbW9tZW50LmR1cmF0aW9uLmZuLmh1bWFuaXplXG4gICAgZnVuY3Rpb24gc3Vic3RpdHV0ZVRpbWVBZ28oc3RyaW5nLCBudW1iZXIsIHdpdGhvdXRTdWZmaXgsIGlzRnV0dXJlLCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS5yZWxhdGl2ZVRpbWUobnVtYmVyIHx8IDEsICEhd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZHVyYXRpb25faHVtYW5pemVfX3JlbGF0aXZlVGltZSAocG9zTmVnRHVyYXRpb24sIHdpdGhvdXRTdWZmaXgsIGxvY2FsZSkge1xuICAgICAgICB2YXIgZHVyYXRpb24gPSBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uKHBvc05lZ0R1cmF0aW9uKS5hYnMoKTtcbiAgICAgICAgdmFyIHNlY29uZHMgID0gcm91bmQoZHVyYXRpb24uYXMoJ3MnKSk7XG4gICAgICAgIHZhciBtaW51dGVzICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdtJykpO1xuICAgICAgICB2YXIgaG91cnMgICAgPSByb3VuZChkdXJhdGlvbi5hcygnaCcpKTtcbiAgICAgICAgdmFyIGRheXMgICAgID0gcm91bmQoZHVyYXRpb24uYXMoJ2QnKSk7XG4gICAgICAgIHZhciBtb250aHMgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdNJykpO1xuICAgICAgICB2YXIgeWVhcnMgICAgPSByb3VuZChkdXJhdGlvbi5hcygneScpKTtcblxuICAgICAgICB2YXIgYSA9IHNlY29uZHMgPCB0aHJlc2hvbGRzLnMgJiYgWydzJywgc2Vjb25kc10gIHx8XG4gICAgICAgICAgICAgICAgbWludXRlcyA9PT0gMSAgICAgICAgICAmJiBbJ20nXSAgICAgICAgICAgfHxcbiAgICAgICAgICAgICAgICBtaW51dGVzIDwgdGhyZXNob2xkcy5tICYmIFsnbW0nLCBtaW51dGVzXSB8fFxuICAgICAgICAgICAgICAgIGhvdXJzICAgPT09IDEgICAgICAgICAgJiYgWydoJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICAgICAgaG91cnMgICA8IHRocmVzaG9sZHMuaCAmJiBbJ2hoJywgaG91cnNdICAgfHxcbiAgICAgICAgICAgICAgICBkYXlzICAgID09PSAxICAgICAgICAgICYmIFsnZCddICAgICAgICAgICB8fFxuICAgICAgICAgICAgICAgIGRheXMgICAgPCB0aHJlc2hvbGRzLmQgJiYgWydkZCcsIGRheXNdICAgIHx8XG4gICAgICAgICAgICAgICAgbW9udGhzICA9PT0gMSAgICAgICAgICAmJiBbJ00nXSAgICAgICAgICAgfHxcbiAgICAgICAgICAgICAgICBtb250aHMgIDwgdGhyZXNob2xkcy5NICYmIFsnTU0nLCBtb250aHNdICB8fFxuICAgICAgICAgICAgICAgIHllYXJzICAgPT09IDEgICAgICAgICAgJiYgWyd5J10gICAgICAgICAgIHx8IFsneXknLCB5ZWFyc107XG5cbiAgICAgICAgYVsyXSA9IHdpdGhvdXRTdWZmaXg7XG4gICAgICAgIGFbM10gPSArcG9zTmVnRHVyYXRpb24gPiAwO1xuICAgICAgICBhWzRdID0gbG9jYWxlO1xuICAgICAgICByZXR1cm4gc3Vic3RpdHV0ZVRpbWVBZ28uYXBwbHkobnVsbCwgYSk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgeW91IHRvIHNldCBhIHRocmVzaG9sZCBmb3IgcmVsYXRpdmUgdGltZSBzdHJpbmdzXG4gICAgZnVuY3Rpb24gZHVyYXRpb25faHVtYW5pemVfX2dldFNldFJlbGF0aXZlVGltZVRocmVzaG9sZCAodGhyZXNob2xkLCBsaW1pdCkge1xuICAgICAgICBpZiAodGhyZXNob2xkc1t0aHJlc2hvbGRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGltaXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRocmVzaG9sZHNbdGhyZXNob2xkXTtcbiAgICAgICAgfVxuICAgICAgICB0aHJlc2hvbGRzW3RocmVzaG9sZF0gPSBsaW1pdDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaHVtYW5pemUgKHdpdGhTdWZmaXgpIHtcbiAgICAgICAgdmFyIGxvY2FsZSA9IHRoaXMubG9jYWxlRGF0YSgpO1xuICAgICAgICB2YXIgb3V0cHV0ID0gZHVyYXRpb25faHVtYW5pemVfX3JlbGF0aXZlVGltZSh0aGlzLCAhd2l0aFN1ZmZpeCwgbG9jYWxlKTtcblxuICAgICAgICBpZiAod2l0aFN1ZmZpeCkge1xuICAgICAgICAgICAgb3V0cHV0ID0gbG9jYWxlLnBhc3RGdXR1cmUoK3RoaXMsIG91dHB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbG9jYWxlLnBvc3Rmb3JtYXQob3V0cHV0KTtcbiAgICB9XG5cbiAgICB2YXIgaXNvX3N0cmluZ19fYWJzID0gTWF0aC5hYnM7XG5cbiAgICBmdW5jdGlvbiBpc29fc3RyaW5nX190b0lTT1N0cmluZygpIHtcbiAgICAgICAgLy8gaW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2RvcmRpbGxlL21vbWVudC1pc29kdXJhdGlvbi9ibG9iL21hc3Rlci9tb21lbnQuaXNvZHVyYXRpb24uanNcbiAgICAgICAgdmFyIFkgPSBpc29fc3RyaW5nX19hYnModGhpcy55ZWFycygpKTtcbiAgICAgICAgdmFyIE0gPSBpc29fc3RyaW5nX19hYnModGhpcy5tb250aHMoKSk7XG4gICAgICAgIHZhciBEID0gaXNvX3N0cmluZ19fYWJzKHRoaXMuZGF5cygpKTtcbiAgICAgICAgdmFyIGggPSBpc29fc3RyaW5nX19hYnModGhpcy5ob3VycygpKTtcbiAgICAgICAgdmFyIG0gPSBpc29fc3RyaW5nX19hYnModGhpcy5taW51dGVzKCkpO1xuICAgICAgICB2YXIgcyA9IGlzb19zdHJpbmdfX2Ficyh0aGlzLnNlY29uZHMoKSArIHRoaXMubWlsbGlzZWNvbmRzKCkgLyAxMDAwKTtcbiAgICAgICAgdmFyIHRvdGFsID0gdGhpcy5hc1NlY29uZHMoKTtcblxuICAgICAgICBpZiAoIXRvdGFsKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzIHRoZSBzYW1lIGFzIEMjJ3MgKE5vZGEpIGFuZCBweXRob24gKGlzb2RhdGUpLi4uXG4gICAgICAgICAgICAvLyBidXQgbm90IG90aGVyIEpTIChnb29nLmRhdGUpXG4gICAgICAgICAgICByZXR1cm4gJ1AwRCc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKHRvdGFsIDwgMCA/ICctJyA6ICcnKSArXG4gICAgICAgICAgICAnUCcgK1xuICAgICAgICAgICAgKFkgPyBZICsgJ1knIDogJycpICtcbiAgICAgICAgICAgIChNID8gTSArICdNJyA6ICcnKSArXG4gICAgICAgICAgICAoRCA/IEQgKyAnRCcgOiAnJykgK1xuICAgICAgICAgICAgKChoIHx8IG0gfHwgcykgPyAnVCcgOiAnJykgK1xuICAgICAgICAgICAgKGggPyBoICsgJ0gnIDogJycpICtcbiAgICAgICAgICAgIChtID8gbSArICdNJyA6ICcnKSArXG4gICAgICAgICAgICAocyA/IHMgKyAnUycgOiAnJyk7XG4gICAgfVxuXG4gICAgdmFyIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8gPSBEdXJhdGlvbi5wcm90b3R5cGU7XG5cbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFicyAgICAgICAgICAgID0gZHVyYXRpb25fYWJzX19hYnM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hZGQgICAgICAgICAgICA9IGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fYWRkO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uc3VidHJhY3QgICAgICAgPSBkdXJhdGlvbl9hZGRfc3VidHJhY3RfX3N1YnRyYWN0O1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXMgICAgICAgICAgICAgPSBhcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzTWlsbGlzZWNvbmRzID0gYXNNaWxsaXNlY29uZHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc1NlY29uZHMgICAgICA9IGFzU2Vjb25kcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzTWludXRlcyAgICAgID0gYXNNaW51dGVzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNIb3VycyAgICAgICAgPSBhc0hvdXJzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNEYXlzICAgICAgICAgPSBhc0RheXM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc1dlZWtzICAgICAgICA9IGFzV2Vla3M7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc01vbnRocyAgICAgICA9IGFzTW9udGhzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNZZWFycyAgICAgICAgPSBhc1llYXJzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8udmFsdWVPZiAgICAgICAgPSBkdXJhdGlvbl9hc19fdmFsdWVPZjtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLl9idWJibGUgICAgICAgID0gYnViYmxlO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uZ2V0ICAgICAgICAgICAgPSBkdXJhdGlvbl9nZXRfX2dldDtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLm1pbGxpc2Vjb25kcyAgID0gZHVyYXRpb25fZ2V0X19taWxsaXNlY29uZHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5zZWNvbmRzICAgICAgICA9IHNlY29uZHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5taW51dGVzICAgICAgICA9IG1pbnV0ZXM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5ob3VycyAgICAgICAgICA9IGhvdXJzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uZGF5cyAgICAgICAgICAgPSBkYXlzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ud2Vla3MgICAgICAgICAgPSB3ZWVrcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLm1vbnRocyAgICAgICAgID0gbW9udGhzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ueWVhcnMgICAgICAgICAgPSB5ZWFycztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmh1bWFuaXplICAgICAgID0gaHVtYW5pemU7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by50b0lTT1N0cmluZyAgICA9IGlzb19zdHJpbmdfX3RvSVNPU3RyaW5nO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8udG9TdHJpbmcgICAgICAgPSBpc29fc3RyaW5nX190b0lTT1N0cmluZztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnRvSlNPTiAgICAgICAgID0gaXNvX3N0cmluZ19fdG9JU09TdHJpbmc7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5sb2NhbGUgICAgICAgICA9IGxvY2FsZTtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmxvY2FsZURhdGEgICAgID0gbG9jYWxlRGF0YTtcblxuICAgIC8vIERlcHJlY2F0aW9uc1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8udG9Jc29TdHJpbmcgPSBkZXByZWNhdGUoJ3RvSXNvU3RyaW5nKCkgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSB0b0lTT1N0cmluZygpIGluc3RlYWQgKG5vdGljZSB0aGUgY2FwaXRhbHMpJywgaXNvX3N0cmluZ19fdG9JU09TdHJpbmcpO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ubGFuZyA9IGxhbmc7XG5cbiAgICAvLyBTaWRlIGVmZmVjdCBpbXBvcnRzXG5cbiAgICBhZGRGb3JtYXRUb2tlbignWCcsIDAsIDAsICd1bml4Jyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ3gnLCAwLCAwLCAndmFsdWVPZicpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbigneCcsIG1hdGNoU2lnbmVkKTtcbiAgICBhZGRSZWdleFRva2VuKCdYJywgbWF0Y2hUaW1lc3RhbXApO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1gnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUocGFyc2VGbG9hdChpbnB1dCwgMTApICogMTAwMCk7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbigneCcsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSh0b0ludChpbnB1dCkpO1xuICAgIH0pO1xuXG4gICAgLy8gU2lkZSBlZmZlY3QgaW1wb3J0c1xuXG5cbiAgICB1dGlsc19ob29rc19faG9va3MudmVyc2lvbiA9ICcyLjEwLjInO1xuXG4gICAgc2V0SG9va0NhbGxiYWNrKGxvY2FsX19jcmVhdGVMb2NhbCk7XG5cbiAgICB1dGlsc19ob29rc19faG9va3MuZm4gICAgICAgICAgICAgICAgICAgID0gbW9tZW50UHJvdG90eXBlO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5taW4gICAgICAgICAgICAgICAgICAgPSBtaW47XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLm1heCAgICAgICAgICAgICAgICAgICA9IG1heDtcbiAgICB1dGlsc19ob29rc19faG9va3MudXRjICAgICAgICAgICAgICAgICAgID0gY3JlYXRlX3V0Y19fY3JlYXRlVVRDO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy51bml4ICAgICAgICAgICAgICAgICAgPSBtb21lbnRfX2NyZWF0ZVVuaXg7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLm1vbnRocyAgICAgICAgICAgICAgICA9IGxpc3RzX19saXN0TW9udGhzO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5pc0RhdGUgICAgICAgICAgICAgICAgPSBpc0RhdGU7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmxvY2FsZSAgICAgICAgICAgICAgICA9IGxvY2FsZV9sb2NhbGVzX19nZXRTZXRHbG9iYWxMb2NhbGU7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmludmFsaWQgICAgICAgICAgICAgICA9IHZhbGlkX19jcmVhdGVJbnZhbGlkO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5kdXJhdGlvbiAgICAgICAgICAgICAgPSBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5pc01vbWVudCAgICAgICAgICAgICAgPSBpc01vbWVudDtcbiAgICB1dGlsc19ob29rc19faG9va3Mud2Vla2RheXMgICAgICAgICAgICAgID0gbGlzdHNfX2xpc3RXZWVrZGF5cztcbiAgICB1dGlsc19ob29rc19faG9va3MucGFyc2Vab25lICAgICAgICAgICAgID0gbW9tZW50X19jcmVhdGVJblpvbmU7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmxvY2FsZURhdGEgICAgICAgICAgICA9IGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGU7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmlzRHVyYXRpb24gICAgICAgICAgICA9IGlzRHVyYXRpb247XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLm1vbnRoc1Nob3J0ICAgICAgICAgICA9IGxpc3RzX19saXN0TW9udGhzU2hvcnQ7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLndlZWtkYXlzTWluICAgICAgICAgICA9IGxpc3RzX19saXN0V2Vla2RheXNNaW47XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmRlZmluZUxvY2FsZSAgICAgICAgICA9IGRlZmluZUxvY2FsZTtcbiAgICB1dGlsc19ob29rc19faG9va3Mud2Vla2RheXNTaG9ydCAgICAgICAgID0gbGlzdHNfX2xpc3RXZWVrZGF5c1Nob3J0O1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5ub3JtYWxpemVVbml0cyAgICAgICAgPSBub3JtYWxpemVVbml0cztcbiAgICB1dGlsc19ob29rc19faG9va3MucmVsYXRpdmVUaW1lVGhyZXNob2xkID0gZHVyYXRpb25faHVtYW5pemVfX2dldFNldFJlbGF0aXZlVGltZVRocmVzaG9sZDtcblxuICAgIHZhciBfbW9tZW50ID0gdXRpbHNfaG9va3NfX2hvb2tzO1xuXG4gICAgcmV0dXJuIF9tb21lbnQ7XG5cbn0pKTsiLCIgIC8qIGdsb2JhbHMgcmVxdWlyZSwgbW9kdWxlICovXG5cbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICAgKi9cblxuICB2YXIgcGF0aHRvUmVnZXhwID0gcmVxdWlyZSgncGF0aC10by1yZWdleHAnKTtcblxuICAvKipcbiAgICogTW9kdWxlIGV4cG9ydHMuXG4gICAqL1xuXG4gIG1vZHVsZS5leHBvcnRzID0gcGFnZTtcblxuICAvKipcbiAgICogRGV0ZWN0IGNsaWNrIGV2ZW50XG4gICAqL1xuICB2YXIgY2xpY2tFdmVudCA9IGRvY3VtZW50Lm9udG91Y2hzdGFydCA/ICd0b3VjaHN0YXJ0JyA6ICdjbGljayc7XG5cbiAgLyoqXG4gICAqIFRvIHdvcmsgcHJvcGVybHkgd2l0aCB0aGUgVVJMXG4gICAqIGhpc3RvcnkubG9jYXRpb24gZ2VuZXJhdGVkIHBvbHlmaWxsIGluIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXZvdGUvSFRNTDUtSGlzdG9yeS1BUElcbiAgICovXG5cbiAgdmFyIGxvY2F0aW9uID0gKCd1bmRlZmluZWQnICE9PSB0eXBlb2Ygd2luZG93KSAmJiAod2luZG93Lmhpc3RvcnkubG9jYXRpb24gfHwgd2luZG93LmxvY2F0aW9uKTtcblxuICAvKipcbiAgICogUGVyZm9ybSBpbml0aWFsIGRpc3BhdGNoLlxuICAgKi9cblxuICB2YXIgZGlzcGF0Y2ggPSB0cnVlO1xuXG5cbiAgLyoqXG4gICAqIERlY29kZSBVUkwgY29tcG9uZW50cyAocXVlcnkgc3RyaW5nLCBwYXRobmFtZSwgaGFzaCkuXG4gICAqIEFjY29tbW9kYXRlcyBib3RoIHJlZ3VsYXIgcGVyY2VudCBlbmNvZGluZyBhbmQgeC13d3ctZm9ybS11cmxlbmNvZGVkIGZvcm1hdC5cbiAgICovXG4gIHZhciBkZWNvZGVVUkxDb21wb25lbnRzID0gdHJ1ZTtcblxuICAvKipcbiAgICogQmFzZSBwYXRoLlxuICAgKi9cblxuICB2YXIgYmFzZSA9ICcnO1xuXG4gIC8qKlxuICAgKiBSdW5uaW5nIGZsYWcuXG4gICAqL1xuXG4gIHZhciBydW5uaW5nO1xuXG4gIC8qKlxuICAgKiBIYXNoQmFuZyBvcHRpb25cbiAgICovXG5cbiAgdmFyIGhhc2hiYW5nID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFByZXZpb3VzIGNvbnRleHQsIGZvciBjYXB0dXJpbmdcbiAgICogcGFnZSBleGl0IGV2ZW50cy5cbiAgICovXG5cbiAgdmFyIHByZXZDb250ZXh0O1xuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBgcGF0aGAgd2l0aCBjYWxsYmFjayBgZm4oKWAsXG4gICAqIG9yIHJvdXRlIGBwYXRoYCwgb3IgcmVkaXJlY3Rpb24sXG4gICAqIG9yIGBwYWdlLnN0YXJ0KClgLlxuICAgKlxuICAgKiAgIHBhZ2UoZm4pO1xuICAgKiAgIHBhZ2UoJyonLCBmbik7XG4gICAqICAgcGFnZSgnL3VzZXIvOmlkJywgbG9hZCwgdXNlcik7XG4gICAqICAgcGFnZSgnL3VzZXIvJyArIHVzZXIuaWQsIHsgc29tZTogJ3RoaW5nJyB9KTtcbiAgICogICBwYWdlKCcvdXNlci8nICsgdXNlci5pZCk7XG4gICAqICAgcGFnZSgnL2Zyb20nLCAnL3RvJylcbiAgICogICBwYWdlKCk7XG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfEZ1bmN0aW9ufSBwYXRoXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuLi4uXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHBhZ2UocGF0aCwgZm4pIHtcbiAgICAvLyA8Y2FsbGJhY2s+XG4gICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBwYXRoKSB7XG4gICAgICByZXR1cm4gcGFnZSgnKicsIHBhdGgpO1xuICAgIH1cblxuICAgIC8vIHJvdXRlIDxwYXRoPiB0byA8Y2FsbGJhY2sgLi4uPlxuICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZm4pIHtcbiAgICAgIHZhciByb3V0ZSA9IG5ldyBSb3V0ZShwYXRoKTtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHBhZ2UuY2FsbGJhY2tzLnB1c2gocm91dGUubWlkZGxld2FyZShhcmd1bWVudHNbaV0pKTtcbiAgICAgIH1cbiAgICAgIC8vIHNob3cgPHBhdGg+IHdpdGggW3N0YXRlXVxuICAgIH0gZWxzZSBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBwYXRoKSB7XG4gICAgICBwYWdlWydzdHJpbmcnID09PSB0eXBlb2YgZm4gPyAncmVkaXJlY3QnIDogJ3Nob3cnXShwYXRoLCBmbik7XG4gICAgICAvLyBzdGFydCBbb3B0aW9uc11cbiAgICB9IGVsc2Uge1xuICAgICAgcGFnZS5zdGFydChwYXRoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZnVuY3Rpb25zLlxuICAgKi9cblxuICBwYWdlLmNhbGxiYWNrcyA9IFtdO1xuICBwYWdlLmV4aXRzID0gW107XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgcGF0aCBiZWluZyBwcm9jZXNzZWRcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIHBhZ2UuY3VycmVudCA9ICcnO1xuXG4gIC8qKlxuICAgKiBOdW1iZXIgb2YgcGFnZXMgbmF2aWdhdGVkIHRvLlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKlxuICAgKiAgICAgcGFnZS5sZW4gPT0gMDtcbiAgICogICAgIHBhZ2UoJy9sb2dpbicpO1xuICAgKiAgICAgcGFnZS5sZW4gPT0gMTtcbiAgICovXG5cbiAgcGFnZS5sZW4gPSAwO1xuXG4gIC8qKlxuICAgKiBHZXQgb3Igc2V0IGJhc2VwYXRoIHRvIGBwYXRoYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5iYXNlID0gZnVuY3Rpb24ocGF0aCkge1xuICAgIGlmICgwID09PSBhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gYmFzZTtcbiAgICBiYXNlID0gcGF0aDtcbiAgfTtcblxuICAvKipcbiAgICogQmluZCB3aXRoIHRoZSBnaXZlbiBgb3B0aW9uc2AuXG4gICAqXG4gICAqIE9wdGlvbnM6XG4gICAqXG4gICAqICAgIC0gYGNsaWNrYCBiaW5kIHRvIGNsaWNrIGV2ZW50cyBbdHJ1ZV1cbiAgICogICAgLSBgcG9wc3RhdGVgIGJpbmQgdG8gcG9wc3RhdGUgW3RydWVdXG4gICAqICAgIC0gYGRpc3BhdGNoYCBwZXJmb3JtIGluaXRpYWwgZGlzcGF0Y2ggW3RydWVdXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2Uuc3RhcnQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKHJ1bm5pbmcpIHJldHVybjtcbiAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICBpZiAoZmFsc2UgPT09IG9wdGlvbnMuZGlzcGF0Y2gpIGRpc3BhdGNoID0gZmFsc2U7XG4gICAgaWYgKGZhbHNlID09PSBvcHRpb25zLmRlY29kZVVSTENvbXBvbmVudHMpIGRlY29kZVVSTENvbXBvbmVudHMgPSBmYWxzZTtcbiAgICBpZiAoZmFsc2UgIT09IG9wdGlvbnMucG9wc3RhdGUpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIG9ucG9wc3RhdGUsIGZhbHNlKTtcbiAgICBpZiAoZmFsc2UgIT09IG9wdGlvbnMuY2xpY2spIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGNsaWNrRXZlbnQsIG9uY2xpY2ssIGZhbHNlKTtcbiAgICB9XG4gICAgaWYgKHRydWUgPT09IG9wdGlvbnMuaGFzaGJhbmcpIGhhc2hiYW5nID0gdHJ1ZTtcbiAgICBpZiAoIWRpc3BhdGNoKSByZXR1cm47XG4gICAgdmFyIHVybCA9IChoYXNoYmFuZyAmJiB+bG9jYXRpb24uaGFzaC5pbmRleE9mKCcjIScpKSA/IGxvY2F0aW9uLmhhc2guc3Vic3RyKDIpICsgbG9jYXRpb24uc2VhcmNoIDogbG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2ggKyBsb2NhdGlvbi5oYXNoO1xuICAgIHBhZ2UucmVwbGFjZSh1cmwsIG51bGwsIHRydWUsIGRpc3BhdGNoKTtcbiAgfTtcblxuICAvKipcbiAgICogVW5iaW5kIGNsaWNrIGFuZCBwb3BzdGF0ZSBldmVudCBoYW5kbGVycy5cbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFydW5uaW5nKSByZXR1cm47XG4gICAgcGFnZS5jdXJyZW50ID0gJyc7XG4gICAgcGFnZS5sZW4gPSAwO1xuICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihjbGlja0V2ZW50LCBvbmNsaWNrLCBmYWxzZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgb25wb3BzdGF0ZSwgZmFsc2UpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTaG93IGBwYXRoYCB3aXRoIG9wdGlvbmFsIGBzdGF0ZWAgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAgICogQHBhcmFtIHtCb29sZWFufSBkaXNwYXRjaFxuICAgKiBAcmV0dXJuIHtDb250ZXh0fVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLnNob3cgPSBmdW5jdGlvbihwYXRoLCBzdGF0ZSwgZGlzcGF0Y2gsIHB1c2gpIHtcbiAgICB2YXIgY3R4ID0gbmV3IENvbnRleHQocGF0aCwgc3RhdGUpO1xuICAgIHBhZ2UuY3VycmVudCA9IGN0eC5wYXRoO1xuICAgIGlmIChmYWxzZSAhPT0gZGlzcGF0Y2gpIHBhZ2UuZGlzcGF0Y2goY3R4KTtcbiAgICBpZiAoZmFsc2UgIT09IGN0eC5oYW5kbGVkICYmIGZhbHNlICE9PSBwdXNoKSBjdHgucHVzaFN0YXRlKCk7XG4gICAgcmV0dXJuIGN0eDtcbiAgfTtcblxuICAvKipcbiAgICogR29lcyBiYWNrIGluIHRoZSBoaXN0b3J5XG4gICAqIEJhY2sgc2hvdWxkIGFsd2F5cyBsZXQgdGhlIGN1cnJlbnQgcm91dGUgcHVzaCBzdGF0ZSBhbmQgdGhlbiBnbyBiYWNrLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCAtIGZhbGxiYWNrIHBhdGggdG8gZ28gYmFjayBpZiBubyBtb3JlIGhpc3RvcnkgZXhpc3RzLCBpZiB1bmRlZmluZWQgZGVmYXVsdHMgdG8gcGFnZS5iYXNlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhdGVdXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2UuYmFjayA9IGZ1bmN0aW9uKHBhdGgsIHN0YXRlKSB7XG4gICAgaWYgKHBhZ2UubGVuID4gMCkge1xuICAgICAgLy8gdGhpcyBtYXkgbmVlZCBtb3JlIHRlc3RpbmcgdG8gc2VlIGlmIGFsbCBicm93c2Vyc1xuICAgICAgLy8gd2FpdCBmb3IgdGhlIG5leHQgdGljayB0byBnbyBiYWNrIGluIGhpc3RvcnlcbiAgICAgIGhpc3RvcnkuYmFjaygpO1xuICAgICAgcGFnZS5sZW4tLTtcbiAgICB9IGVsc2UgaWYgKHBhdGgpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHBhZ2Uuc2hvdyhwYXRoLCBzdGF0ZSk7XG4gICAgICB9KTtcbiAgICB9ZWxzZXtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHBhZ2Uuc2hvdyhiYXNlLCBzdGF0ZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgICogUmVnaXN0ZXIgcm91dGUgdG8gcmVkaXJlY3QgZnJvbSBvbmUgcGF0aCB0byBvdGhlclxuICAgKiBvciBqdXN0IHJlZGlyZWN0IHRvIGFub3RoZXIgcm91dGVcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGZyb20gLSBpZiBwYXJhbSAndG8nIGlzIHVuZGVmaW5lZCByZWRpcmVjdHMgdG8gJ2Zyb20nXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdG9dXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuICBwYWdlLnJlZGlyZWN0ID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgICAvLyBEZWZpbmUgcm91dGUgZnJvbSBhIHBhdGggdG8gYW5vdGhlclxuICAgIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIGZyb20gJiYgJ3N0cmluZycgPT09IHR5cGVvZiB0bykge1xuICAgICAgcGFnZShmcm9tLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcGFnZS5yZXBsYWNlKHRvKTtcbiAgICAgICAgfSwgMCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBXYWl0IGZvciB0aGUgcHVzaCBzdGF0ZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFub3RoZXJcbiAgICBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBmcm9tICYmICd1bmRlZmluZWQnID09PSB0eXBlb2YgdG8pIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHBhZ2UucmVwbGFjZShmcm9tKTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmVwbGFjZSBgcGF0aGAgd2l0aCBvcHRpb25hbCBgc3RhdGVgIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gICAqIEByZXR1cm4ge0NvbnRleHR9XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG5cbiAgcGFnZS5yZXBsYWNlID0gZnVuY3Rpb24ocGF0aCwgc3RhdGUsIGluaXQsIGRpc3BhdGNoKSB7XG4gICAgdmFyIGN0eCA9IG5ldyBDb250ZXh0KHBhdGgsIHN0YXRlKTtcbiAgICBwYWdlLmN1cnJlbnQgPSBjdHgucGF0aDtcbiAgICBjdHguaW5pdCA9IGluaXQ7XG4gICAgY3R4LnNhdmUoKTsgLy8gc2F2ZSBiZWZvcmUgZGlzcGF0Y2hpbmcsIHdoaWNoIG1heSByZWRpcmVjdFxuICAgIGlmIChmYWxzZSAhPT0gZGlzcGF0Y2gpIHBhZ2UuZGlzcGF0Y2goY3R4KTtcbiAgICByZXR1cm4gY3R4O1xuICB9O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCB0aGUgZ2l2ZW4gYGN0eGAuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjdHhcbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIHBhZ2UuZGlzcGF0Y2ggPSBmdW5jdGlvbihjdHgpIHtcbiAgICB2YXIgcHJldiA9IHByZXZDb250ZXh0LFxuICAgICAgaSA9IDAsXG4gICAgICBqID0gMDtcblxuICAgIHByZXZDb250ZXh0ID0gY3R4O1xuXG4gICAgZnVuY3Rpb24gbmV4dEV4aXQoKSB7XG4gICAgICB2YXIgZm4gPSBwYWdlLmV4aXRzW2orK107XG4gICAgICBpZiAoIWZuKSByZXR1cm4gbmV4dEVudGVyKCk7XG4gICAgICBmbihwcmV2LCBuZXh0RXhpdCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbmV4dEVudGVyKCkge1xuICAgICAgdmFyIGZuID0gcGFnZS5jYWxsYmFja3NbaSsrXTtcblxuICAgICAgaWYgKGN0eC5wYXRoICE9PSBwYWdlLmN1cnJlbnQpIHtcbiAgICAgICAgY3R4LmhhbmRsZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCFmbikgcmV0dXJuIHVuaGFuZGxlZChjdHgpO1xuICAgICAgZm4oY3R4LCBuZXh0RW50ZXIpO1xuICAgIH1cblxuICAgIGlmIChwcmV2KSB7XG4gICAgICBuZXh0RXhpdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0RW50ZXIoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFVuaGFuZGxlZCBgY3R4YC4gV2hlbiBpdCdzIG5vdCB0aGUgaW5pdGlhbFxuICAgKiBwb3BzdGF0ZSB0aGVuIHJlZGlyZWN0LiBJZiB5b3Ugd2lzaCB0byBoYW5kbGVcbiAgICogNDA0cyBvbiB5b3VyIG93biB1c2UgYHBhZ2UoJyonLCBjYWxsYmFjaylgLlxuICAgKlxuICAgKiBAcGFyYW0ge0NvbnRleHR9IGN0eFxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZnVuY3Rpb24gdW5oYW5kbGVkKGN0eCkge1xuICAgIGlmIChjdHguaGFuZGxlZCkgcmV0dXJuO1xuICAgIHZhciBjdXJyZW50O1xuXG4gICAgaWYgKGhhc2hiYW5nKSB7XG4gICAgICBjdXJyZW50ID0gYmFzZSArIGxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIyEnLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnQgPSBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaDtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudCA9PT0gY3R4LmNhbm9uaWNhbFBhdGgpIHJldHVybjtcbiAgICBwYWdlLnN0b3AoKTtcbiAgICBjdHguaGFuZGxlZCA9IGZhbHNlO1xuICAgIGxvY2F0aW9uLmhyZWYgPSBjdHguY2Fub25pY2FsUGF0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbiBleGl0IHJvdXRlIG9uIGBwYXRoYCB3aXRoXG4gICAqIGNhbGxiYWNrIGBmbigpYCwgd2hpY2ggd2lsbCBiZSBjYWxsZWRcbiAgICogb24gdGhlIHByZXZpb3VzIGNvbnRleHQgd2hlbiBhIG5ld1xuICAgKiBwYWdlIGlzIHZpc2l0ZWQuXG4gICAqL1xuICBwYWdlLmV4aXQgPSBmdW5jdGlvbihwYXRoLCBmbikge1xuICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHBhZ2UuZXhpdCgnKicsIHBhdGgpO1xuICAgIH1cblxuICAgIHZhciByb3V0ZSA9IG5ldyBSb3V0ZShwYXRoKTtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgcGFnZS5leGl0cy5wdXNoKHJvdXRlLm1pZGRsZXdhcmUoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgVVJMIGVuY29kaW5nIGZyb20gdGhlIGdpdmVuIGBzdHJgLlxuICAgKiBBY2NvbW1vZGF0ZXMgd2hpdGVzcGFjZSBpbiBib3RoIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICAgKiBhbmQgcmVndWxhciBwZXJjZW50LWVuY29kZWQgZm9ybS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJ9IFVSTCBjb21wb25lbnQgdG8gZGVjb2RlXG4gICAqL1xuICBmdW5jdGlvbiBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KHZhbCkge1xuICAgIGlmICh0eXBlb2YgdmFsICE9PSAnc3RyaW5nJykgeyByZXR1cm4gdmFsOyB9XG4gICAgcmV0dXJuIGRlY29kZVVSTENvbXBvbmVudHMgPyBkZWNvZGVVUklDb21wb25lbnQodmFsLnJlcGxhY2UoL1xcKy9nLCAnICcpKSA6IHZhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGEgbmV3IFwicmVxdWVzdFwiIGBDb250ZXh0YFxuICAgKiB3aXRoIHRoZSBnaXZlbiBgcGF0aGAgYW5kIG9wdGlvbmFsIGluaXRpYWwgYHN0YXRlYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIGZ1bmN0aW9uIENvbnRleHQocGF0aCwgc3RhdGUpIHtcbiAgICBpZiAoJy8nID09PSBwYXRoWzBdICYmIDAgIT09IHBhdGguaW5kZXhPZihiYXNlKSkgcGF0aCA9IGJhc2UgKyAoaGFzaGJhbmcgPyAnIyEnIDogJycpICsgcGF0aDtcbiAgICB2YXIgaSA9IHBhdGguaW5kZXhPZignPycpO1xuXG4gICAgdGhpcy5jYW5vbmljYWxQYXRoID0gcGF0aDtcbiAgICB0aGlzLnBhdGggPSBwYXRoLnJlcGxhY2UoYmFzZSwgJycpIHx8ICcvJztcbiAgICBpZiAoaGFzaGJhbmcpIHRoaXMucGF0aCA9IHRoaXMucGF0aC5yZXBsYWNlKCcjIScsICcnKSB8fCAnLyc7XG5cbiAgICB0aGlzLnRpdGxlID0gZG9jdW1lbnQudGl0bGU7XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlIHx8IHt9O1xuICAgIHRoaXMuc3RhdGUucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5xdWVyeXN0cmluZyA9IH5pID8gZGVjb2RlVVJMRW5jb2RlZFVSSUNvbXBvbmVudChwYXRoLnNsaWNlKGkgKyAxKSkgOiAnJztcbiAgICB0aGlzLnBhdGhuYW1lID0gZGVjb2RlVVJMRW5jb2RlZFVSSUNvbXBvbmVudCh+aSA/IHBhdGguc2xpY2UoMCwgaSkgOiBwYXRoKTtcbiAgICB0aGlzLnBhcmFtcyA9IHt9O1xuXG4gICAgLy8gZnJhZ21lbnRcbiAgICB0aGlzLmhhc2ggPSAnJztcbiAgICBpZiAoIWhhc2hiYW5nKSB7XG4gICAgICBpZiAoIX50aGlzLnBhdGguaW5kZXhPZignIycpKSByZXR1cm47XG4gICAgICB2YXIgcGFydHMgPSB0aGlzLnBhdGguc3BsaXQoJyMnKTtcbiAgICAgIHRoaXMucGF0aCA9IHBhcnRzWzBdO1xuICAgICAgdGhpcy5oYXNoID0gZGVjb2RlVVJMRW5jb2RlZFVSSUNvbXBvbmVudChwYXJ0c1sxXSkgfHwgJyc7XG4gICAgICB0aGlzLnF1ZXJ5c3RyaW5nID0gdGhpcy5xdWVyeXN0cmluZy5zcGxpdCgnIycpWzBdO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvc2UgYENvbnRleHRgLlxuICAgKi9cblxuICBwYWdlLkNvbnRleHQgPSBDb250ZXh0O1xuXG4gIC8qKlxuICAgKiBQdXNoIHN0YXRlLlxuICAgKlxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgQ29udGV4dC5wcm90b3R5cGUucHVzaFN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgcGFnZS5sZW4rKztcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSh0aGlzLnN0YXRlLCB0aGlzLnRpdGxlLCBoYXNoYmFuZyAmJiB0aGlzLnBhdGggIT09ICcvJyA/ICcjIScgKyB0aGlzLnBhdGggOiB0aGlzLmNhbm9uaWNhbFBhdGgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTYXZlIHRoZSBjb250ZXh0IHN0YXRlLlxuICAgKlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBDb250ZXh0LnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUodGhpcy5zdGF0ZSwgdGhpcy50aXRsZSwgaGFzaGJhbmcgJiYgdGhpcy5wYXRoICE9PSAnLycgPyAnIyEnICsgdGhpcy5wYXRoIDogdGhpcy5jYW5vbmljYWxQYXRoKTtcbiAgfTtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBgUm91dGVgIHdpdGggdGhlIGdpdmVuIEhUVFAgYHBhdGhgLFxuICAgKiBhbmQgYW4gYXJyYXkgb2YgYGNhbGxiYWNrc2AgYW5kIGBvcHRpb25zYC5cbiAgICpcbiAgICogT3B0aW9uczpcbiAgICpcbiAgICogICAtIGBzZW5zaXRpdmVgICAgIGVuYWJsZSBjYXNlLXNlbnNpdGl2ZSByb3V0ZXNcbiAgICogICAtIGBzdHJpY3RgICAgICAgIGVuYWJsZSBzdHJpY3QgbWF0Y2hpbmcgZm9yIHRyYWlsaW5nIHNsYXNoZXNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMuXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBmdW5jdGlvbiBSb3V0ZShwYXRoLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5wYXRoID0gKHBhdGggPT09ICcqJykgPyAnKC4qKScgOiBwYXRoO1xuICAgIHRoaXMubWV0aG9kID0gJ0dFVCc7XG4gICAgdGhpcy5yZWdleHAgPSBwYXRodG9SZWdleHAodGhpcy5wYXRoLFxuICAgICAgdGhpcy5rZXlzID0gW10sXG4gICAgICBvcHRpb25zLnNlbnNpdGl2ZSxcbiAgICAgIG9wdGlvbnMuc3RyaWN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvc2UgYFJvdXRlYC5cbiAgICovXG5cbiAgcGFnZS5Sb3V0ZSA9IFJvdXRlO1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gcm91dGUgbWlkZGxld2FyZSB3aXRoXG4gICAqIHRoZSBnaXZlbiBjYWxsYmFjayBgZm4oKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUubWlkZGxld2FyZSA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBmdW5jdGlvbihjdHgsIG5leHQpIHtcbiAgICAgIGlmIChzZWxmLm1hdGNoKGN0eC5wYXRoLCBjdHgucGFyYW1zKSkgcmV0dXJuIGZuKGN0eCwgbmV4dCk7XG4gICAgICBuZXh0KCk7XG4gICAgfTtcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhpcyByb3V0ZSBtYXRjaGVzIGBwYXRoYCwgaWYgc29cbiAgICogcG9wdWxhdGUgYHBhcmFtc2AuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uKHBhdGgsIHBhcmFtcykge1xuICAgIHZhciBrZXlzID0gdGhpcy5rZXlzLFxuICAgICAgcXNJbmRleCA9IHBhdGguaW5kZXhPZignPycpLFxuICAgICAgcGF0aG5hbWUgPSB+cXNJbmRleCA/IHBhdGguc2xpY2UoMCwgcXNJbmRleCkgOiBwYXRoLFxuICAgICAgbSA9IHRoaXMucmVnZXhwLmV4ZWMoZGVjb2RlVVJJQ29tcG9uZW50KHBhdGhuYW1lKSk7XG5cbiAgICBpZiAoIW0pIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAodmFyIGkgPSAxLCBsZW4gPSBtLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpIC0gMV07XG4gICAgICB2YXIgdmFsID0gZGVjb2RlVVJMRW5jb2RlZFVSSUNvbXBvbmVudChtW2ldKTtcbiAgICAgIGlmICh2YWwgIT09IHVuZGVmaW5lZCB8fCAhKGhhc093blByb3BlcnR5LmNhbGwocGFyYW1zLCBrZXkubmFtZSkpKSB7XG4gICAgICAgIHBhcmFtc1trZXkubmFtZV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvKipcbiAgICogSGFuZGxlIFwicG9wdWxhdGVcIiBldmVudHMuXG4gICAqL1xuXG4gIHZhciBvbnBvcHN0YXRlID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvLyB0aGlzIGhhY2sgcmVzb2x2ZXMgaHR0cHM6Ly9naXRodWIuY29tL3Zpc2lvbm1lZGlhL3BhZ2UuanMvaXNzdWVzLzIxM1xuICAgIHZhciBsb2FkZWQgPSBmYWxzZTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgbG9hZGVkID0gdHJ1ZTtcbiAgICAgIH0sIDApO1xuICAgIH0pO1xuICAgIHJldHVybiBmdW5jdGlvbiBvbnBvcHN0YXRlKGUpIHtcbiAgICAgIGlmICghbG9hZGVkKSByZXR1cm47XG4gICAgICBpZiAoZS5zdGF0ZSkge1xuICAgICAgICB2YXIgcGF0aCA9IGUuc3RhdGUucGF0aDtcbiAgICAgICAgcGFnZS5yZXBsYWNlKHBhdGgsIGUuc3RhdGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFnZS5zaG93KGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uaGFzaCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KSgpO1xuICAvKipcbiAgICogSGFuZGxlIFwiY2xpY2tcIiBldmVudHMuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uY2xpY2soZSkge1xuXG4gICAgaWYgKDEgIT09IHdoaWNoKGUpKSByZXR1cm47XG5cbiAgICBpZiAoZS5tZXRhS2V5IHx8IGUuY3RybEtleSB8fCBlLnNoaWZ0S2V5KSByZXR1cm47XG4gICAgaWYgKGUuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xuXG5cblxuICAgIC8vIGVuc3VyZSBsaW5rXG4gICAgdmFyIGVsID0gZS50YXJnZXQ7XG4gICAgd2hpbGUgKGVsICYmICdBJyAhPT0gZWwubm9kZU5hbWUpIGVsID0gZWwucGFyZW50Tm9kZTtcbiAgICBpZiAoIWVsIHx8ICdBJyAhPT0gZWwubm9kZU5hbWUpIHJldHVybjtcblxuXG5cbiAgICAvLyBJZ25vcmUgaWYgdGFnIGhhc1xuICAgIC8vIDEuIFwiZG93bmxvYWRcIiBhdHRyaWJ1dGVcbiAgICAvLyAyLiByZWw9XCJleHRlcm5hbFwiIGF0dHJpYnV0ZVxuICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ2Rvd25sb2FkJykgfHwgZWwuZ2V0QXR0cmlidXRlKCdyZWwnKSA9PT0gJ2V4dGVybmFsJykgcmV0dXJuO1xuXG4gICAgLy8gZW5zdXJlIG5vbi1oYXNoIGZvciB0aGUgc2FtZSBwYXRoXG4gICAgdmFyIGxpbmsgPSBlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgICBpZiAoIWhhc2hiYW5nICYmIGVsLnBhdGhuYW1lID09PSBsb2NhdGlvbi5wYXRobmFtZSAmJiAoZWwuaGFzaCB8fCAnIycgPT09IGxpbmspKSByZXR1cm47XG5cblxuXG4gICAgLy8gQ2hlY2sgZm9yIG1haWx0bzogaW4gdGhlIGhyZWZcbiAgICBpZiAobGluayAmJiBsaW5rLmluZGV4T2YoJ21haWx0bzonKSA+IC0xKSByZXR1cm47XG5cbiAgICAvLyBjaGVjayB0YXJnZXRcbiAgICBpZiAoZWwudGFyZ2V0KSByZXR1cm47XG5cbiAgICAvLyB4LW9yaWdpblxuICAgIGlmICghc2FtZU9yaWdpbihlbC5ocmVmKSkgcmV0dXJuO1xuXG5cblxuICAgIC8vIHJlYnVpbGQgcGF0aFxuICAgIHZhciBwYXRoID0gZWwucGF0aG5hbWUgKyBlbC5zZWFyY2ggKyAoZWwuaGFzaCB8fCAnJyk7XG5cbiAgICAvLyBzdHJpcCBsZWFkaW5nIFwiL1tkcml2ZSBsZXR0ZXJdOlwiIG9uIE5XLmpzIG9uIFdpbmRvd3NcbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHBhdGgubWF0Y2goL15cXC9bYS16QS1aXTpcXC8vKSkge1xuICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXlxcL1thLXpBLVpdOlxcLy8sICcvJyk7XG4gICAgfVxuXG4gICAgLy8gc2FtZSBwYWdlXG4gICAgdmFyIG9yaWcgPSBwYXRoO1xuXG4gICAgaWYgKHBhdGguaW5kZXhPZihiYXNlKSA9PT0gMCkge1xuICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKGJhc2UubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBpZiAoaGFzaGJhbmcpIHBhdGggPSBwYXRoLnJlcGxhY2UoJyMhJywgJycpO1xuXG4gICAgaWYgKGJhc2UgJiYgb3JpZyA9PT0gcGF0aCkgcmV0dXJuO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHBhZ2Uuc2hvdyhvcmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCBidXR0b24uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHdoaWNoKGUpIHtcbiAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgcmV0dXJuIG51bGwgPT09IGUud2hpY2ggPyBlLmJ1dHRvbiA6IGUud2hpY2g7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYGhyZWZgIGlzIHRoZSBzYW1lIG9yaWdpbi5cbiAgICovXG5cbiAgZnVuY3Rpb24gc2FtZU9yaWdpbihocmVmKSB7XG4gICAgdmFyIG9yaWdpbiA9IGxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIGxvY2F0aW9uLmhvc3RuYW1lO1xuICAgIGlmIChsb2NhdGlvbi5wb3J0KSBvcmlnaW4gKz0gJzonICsgbG9jYXRpb24ucG9ydDtcbiAgICByZXR1cm4gKGhyZWYgJiYgKDAgPT09IGhyZWYuaW5kZXhPZihvcmlnaW4pKSk7XG4gIH1cblxuICBwYWdlLnNhbWVPcmlnaW4gPSBzYW1lT3JpZ2luO1xuIiwidmFyIGlzQXJyYXkgPSByZXF1aXJlKCdpc2FycmF5Jyk7XG5cbi8qKlxuICogRXhwb3NlIGBwYXRoVG9SZWdleHBgLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHBhdGhUb1JlZ2V4cDtcblxuLyoqXG4gKiBUaGUgbWFpbiBwYXRoIG1hdGNoaW5nIHJlZ2V4cCB1dGlsaXR5LlxuICpcbiAqIEB0eXBlIHtSZWdFeHB9XG4gKi9cbnZhciBQQVRIX1JFR0VYUCA9IG5ldyBSZWdFeHAoW1xuICAvLyBNYXRjaCBlc2NhcGVkIGNoYXJhY3RlcnMgdGhhdCB3b3VsZCBvdGhlcndpc2UgYXBwZWFyIGluIGZ1dHVyZSBtYXRjaGVzLlxuICAvLyBUaGlzIGFsbG93cyB0aGUgdXNlciB0byBlc2NhcGUgc3BlY2lhbCBjaGFyYWN0ZXJzIHRoYXQgd29uJ3QgdHJhbnNmb3JtLlxuICAnKFxcXFxcXFxcLiknLFxuICAvLyBNYXRjaCBFeHByZXNzLXN0eWxlIHBhcmFtZXRlcnMgYW5kIHVuLW5hbWVkIHBhcmFtZXRlcnMgd2l0aCBhIHByZWZpeFxuICAvLyBhbmQgb3B0aW9uYWwgc3VmZml4ZXMuIE1hdGNoZXMgYXBwZWFyIGFzOlxuICAvL1xuICAvLyBcIi86dGVzdChcXFxcZCspP1wiID0+IFtcIi9cIiwgXCJ0ZXN0XCIsIFwiXFxkK1wiLCB1bmRlZmluZWQsIFwiP1wiXVxuICAvLyBcIi9yb3V0ZShcXFxcZCspXCIgPT4gW3VuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFwiXFxkK1wiLCB1bmRlZmluZWRdXG4gICcoW1xcXFwvLl0pPyg/OlxcXFw6KFxcXFx3KykoPzpcXFxcKCgoPzpcXFxcXFxcXC58W14pXSkqKVxcXFwpKT98XFxcXCgoKD86XFxcXFxcXFwufFteKV0pKilcXFxcKSkoWysqP10pPycsXG4gIC8vIE1hdGNoIHJlZ2V4cCBzcGVjaWFsIGNoYXJhY3RlcnMgdGhhdCBhcmUgYWx3YXlzIGVzY2FwZWQuXG4gICcoWy4rKj89XiE6JHt9KClbXFxcXF18XFxcXC9dKSdcbl0uam9pbignfCcpLCAnZycpO1xuXG4vKipcbiAqIEVzY2FwZSB0aGUgY2FwdHVyaW5nIGdyb3VwIGJ5IGVzY2FwaW5nIHNwZWNpYWwgY2hhcmFjdGVycyBhbmQgbWVhbmluZy5cbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGdyb3VwXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGVzY2FwZUdyb3VwIChncm91cCkge1xuICByZXR1cm4gZ3JvdXAucmVwbGFjZSgvKFs9ITokXFwvKCldKS9nLCAnXFxcXCQxJyk7XG59XG5cbi8qKlxuICogQXR0YWNoIHRoZSBrZXlzIGFzIGEgcHJvcGVydHkgb2YgdGhlIHJlZ2V4cC5cbiAqXG4gKiBAcGFyYW0gIHtSZWdFeHB9IHJlXG4gKiBAcGFyYW0gIHtBcnJheX0gIGtleXNcbiAqIEByZXR1cm4ge1JlZ0V4cH1cbiAqL1xuZnVuY3Rpb24gYXR0YWNoS2V5cyAocmUsIGtleXMpIHtcbiAgcmUua2V5cyA9IGtleXM7XG4gIHJldHVybiByZTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIGZsYWdzIGZvciBhIHJlZ2V4cCBmcm9tIHRoZSBvcHRpb25zLlxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBmbGFncyAob3B0aW9ucykge1xuICByZXR1cm4gb3B0aW9ucy5zZW5zaXRpdmUgPyAnJyA6ICdpJztcbn1cblxuLyoqXG4gKiBQdWxsIG91dCBrZXlzIGZyb20gYSByZWdleHAuXG4gKlxuICogQHBhcmFtICB7UmVnRXhwfSBwYXRoXG4gKiBAcGFyYW0gIHtBcnJheX0gIGtleXNcbiAqIEByZXR1cm4ge1JlZ0V4cH1cbiAqL1xuZnVuY3Rpb24gcmVnZXhwVG9SZWdleHAgKHBhdGgsIGtleXMpIHtcbiAgLy8gVXNlIGEgbmVnYXRpdmUgbG9va2FoZWFkIHRvIG1hdGNoIG9ubHkgY2FwdHVyaW5nIGdyb3Vwcy5cbiAgdmFyIGdyb3VwcyA9IHBhdGguc291cmNlLm1hdGNoKC9cXCgoPyFcXD8pL2cpO1xuXG4gIGlmIChncm91cHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdyb3Vwcy5sZW5ndGg7IGkrKykge1xuICAgICAga2V5cy5wdXNoKHtcbiAgICAgICAgbmFtZTogICAgICBpLFxuICAgICAgICBkZWxpbWl0ZXI6IG51bGwsXG4gICAgICAgIG9wdGlvbmFsOiAgZmFsc2UsXG4gICAgICAgIHJlcGVhdDogICAgZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhdHRhY2hLZXlzKHBhdGgsIGtleXMpO1xufVxuXG4vKipcbiAqIFRyYW5zZm9ybSBhbiBhcnJheSBpbnRvIGEgcmVnZXhwLlxuICpcbiAqIEBwYXJhbSAge0FycmF5fSAgcGF0aFxuICogQHBhcmFtICB7QXJyYXl9ICBrZXlzXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge1JlZ0V4cH1cbiAqL1xuZnVuY3Rpb24gYXJyYXlUb1JlZ2V4cCAocGF0aCwga2V5cywgb3B0aW9ucykge1xuICB2YXIgcGFydHMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICBwYXJ0cy5wdXNoKHBhdGhUb1JlZ2V4cChwYXRoW2ldLCBrZXlzLCBvcHRpb25zKS5zb3VyY2UpO1xuICB9XG5cbiAgdmFyIHJlZ2V4cCA9IG5ldyBSZWdFeHAoJyg/OicgKyBwYXJ0cy5qb2luKCd8JykgKyAnKScsIGZsYWdzKG9wdGlvbnMpKTtcbiAgcmV0dXJuIGF0dGFjaEtleXMocmVnZXhwLCBrZXlzKTtcbn1cblxuLyoqXG4gKiBSZXBsYWNlIHRoZSBzcGVjaWZpYyB0YWdzIHdpdGggcmVnZXhwIHN0cmluZ3MuXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0gIHtBcnJheX0gIGtleXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gcmVwbGFjZVBhdGggKHBhdGgsIGtleXMpIHtcbiAgdmFyIGluZGV4ID0gMDtcblxuICBmdW5jdGlvbiByZXBsYWNlIChfLCBlc2NhcGVkLCBwcmVmaXgsIGtleSwgY2FwdHVyZSwgZ3JvdXAsIHN1ZmZpeCwgZXNjYXBlKSB7XG4gICAgaWYgKGVzY2FwZWQpIHtcbiAgICAgIHJldHVybiBlc2NhcGVkO1xuICAgIH1cblxuICAgIGlmIChlc2NhcGUpIHtcbiAgICAgIHJldHVybiAnXFxcXCcgKyBlc2NhcGU7XG4gICAgfVxuXG4gICAgdmFyIHJlcGVhdCAgID0gc3VmZml4ID09PSAnKycgfHwgc3VmZml4ID09PSAnKic7XG4gICAgdmFyIG9wdGlvbmFsID0gc3VmZml4ID09PSAnPycgfHwgc3VmZml4ID09PSAnKic7XG5cbiAgICBrZXlzLnB1c2goe1xuICAgICAgbmFtZTogICAgICBrZXkgfHwgaW5kZXgrKyxcbiAgICAgIGRlbGltaXRlcjogcHJlZml4IHx8ICcvJyxcbiAgICAgIG9wdGlvbmFsOiAgb3B0aW9uYWwsXG4gICAgICByZXBlYXQ6ICAgIHJlcGVhdFxuICAgIH0pO1xuXG4gICAgcHJlZml4ID0gcHJlZml4ID8gKCdcXFxcJyArIHByZWZpeCkgOiAnJztcbiAgICBjYXB0dXJlID0gZXNjYXBlR3JvdXAoY2FwdHVyZSB8fCBncm91cCB8fCAnW14nICsgKHByZWZpeCB8fCAnXFxcXC8nKSArICddKz8nKTtcblxuICAgIGlmIChyZXBlYXQpIHtcbiAgICAgIGNhcHR1cmUgPSBjYXB0dXJlICsgJyg/OicgKyBwcmVmaXggKyBjYXB0dXJlICsgJykqJztcbiAgICB9XG5cbiAgICBpZiAob3B0aW9uYWwpIHtcbiAgICAgIHJldHVybiAnKD86JyArIHByZWZpeCArICcoJyArIGNhcHR1cmUgKyAnKSk/JztcbiAgICB9XG5cbiAgICAvLyBCYXNpYyBwYXJhbWV0ZXIgc3VwcG9ydC5cbiAgICByZXR1cm4gcHJlZml4ICsgJygnICsgY2FwdHVyZSArICcpJztcbiAgfVxuXG4gIHJldHVybiBwYXRoLnJlcGxhY2UoUEFUSF9SRUdFWFAsIHJlcGxhY2UpO1xufVxuXG4vKipcbiAqIE5vcm1hbGl6ZSB0aGUgZ2l2ZW4gcGF0aCBzdHJpbmcsIHJldHVybmluZyBhIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAqXG4gKiBBbiBlbXB0eSBhcnJheSBjYW4gYmUgcGFzc2VkIGluIGZvciB0aGUga2V5cywgd2hpY2ggd2lsbCBob2xkIHRoZVxuICogcGxhY2Vob2xkZXIga2V5IGRlc2NyaXB0aW9ucy4gRm9yIGV4YW1wbGUsIHVzaW5nIGAvdXNlci86aWRgLCBga2V5c2Agd2lsbFxuICogY29udGFpbiBgW3sgbmFtZTogJ2lkJywgZGVsaW1pdGVyOiAnLycsIG9wdGlvbmFsOiBmYWxzZSwgcmVwZWF0OiBmYWxzZSB9XWAuXG4gKlxuICogQHBhcmFtICB7KFN0cmluZ3xSZWdFeHB8QXJyYXkpfSBwYXRoXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgICAgICAgICAgIFtrZXlzXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICAgICAgICBbb3B0aW9uc11cbiAqIEByZXR1cm4ge1JlZ0V4cH1cbiAqL1xuZnVuY3Rpb24gcGF0aFRvUmVnZXhwIChwYXRoLCBrZXlzLCBvcHRpb25zKSB7XG4gIGtleXMgPSBrZXlzIHx8IFtdO1xuXG4gIGlmICghaXNBcnJheShrZXlzKSkge1xuICAgIG9wdGlvbnMgPSBrZXlzO1xuICAgIGtleXMgPSBbXTtcbiAgfSBlbHNlIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGlmIChwYXRoIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgcmV0dXJuIHJlZ2V4cFRvUmVnZXhwKHBhdGgsIGtleXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkocGF0aCkpIHtcbiAgICByZXR1cm4gYXJyYXlUb1JlZ2V4cChwYXRoLCBrZXlzLCBvcHRpb25zKTtcbiAgfVxuXG4gIHZhciBzdHJpY3QgPSBvcHRpb25zLnN0cmljdDtcbiAgdmFyIGVuZCA9IG9wdGlvbnMuZW5kICE9PSBmYWxzZTtcbiAgdmFyIHJvdXRlID0gcmVwbGFjZVBhdGgocGF0aCwga2V5cyk7XG4gIHZhciBlbmRzV2l0aFNsYXNoID0gcGF0aC5jaGFyQXQocGF0aC5sZW5ndGggLSAxKSA9PT0gJy8nO1xuXG4gIC8vIEluIG5vbi1zdHJpY3QgbW9kZSB3ZSBhbGxvdyBhIHNsYXNoIGF0IHRoZSBlbmQgb2YgbWF0Y2guIElmIHRoZSBwYXRoIHRvXG4gIC8vIG1hdGNoIGFscmVhZHkgZW5kcyB3aXRoIGEgc2xhc2gsIHdlIHJlbW92ZSBpdCBmb3IgY29uc2lzdGVuY3kuIFRoZSBzbGFzaFxuICAvLyBpcyB2YWxpZCBhdCB0aGUgZW5kIG9mIGEgcGF0aCBtYXRjaCwgbm90IGluIHRoZSBtaWRkbGUuIFRoaXMgaXMgaW1wb3J0YW50XG4gIC8vIGluIG5vbi1lbmRpbmcgbW9kZSwgd2hlcmUgXCIvdGVzdC9cIiBzaG91bGRuJ3QgbWF0Y2ggXCIvdGVzdC8vcm91dGVcIi5cbiAgaWYgKCFzdHJpY3QpIHtcbiAgICByb3V0ZSA9IChlbmRzV2l0aFNsYXNoID8gcm91dGUuc2xpY2UoMCwgLTIpIDogcm91dGUpICsgJyg/OlxcXFwvKD89JCkpPyc7XG4gIH1cblxuICBpZiAoZW5kKSB7XG4gICAgcm91dGUgKz0gJyQnO1xuICB9IGVsc2Uge1xuICAgIC8vIEluIG5vbi1lbmRpbmcgbW9kZSwgd2UgbmVlZCB0aGUgY2FwdHVyaW5nIGdyb3VwcyB0byBtYXRjaCBhcyBtdWNoIGFzXG4gICAgLy8gcG9zc2libGUgYnkgdXNpbmcgYSBwb3NpdGl2ZSBsb29rYWhlYWQgdG8gdGhlIGVuZCBvciBuZXh0IHBhdGggc2VnbWVudC5cbiAgICByb3V0ZSArPSBzdHJpY3QgJiYgZW5kc1dpdGhTbGFzaCA/ICcnIDogJyg/PVxcXFwvfCQpJztcbiAgfVxuXG4gIHJldHVybiBhdHRhY2hLZXlzKG5ldyBSZWdFeHAoJ14nICsgcm91dGUsIGZsYWdzKG9wdGlvbnMpKSwga2V5cyk7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKGFycikge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgPT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCJpbXBvcnQgcGFnZSBmcm9tICdwYWdlJztcbmltcG9ydCB7RmlsZU5vdEZvdW5kUGFnZX0gZnJvbSBcInBhZ2VzL0ZpbGVOb3RGb3VuZFBhZ2UuanN4XCI7XG5cbi8qXG4gKiBIYW5kbGVzIHJvdXRpbmcgcGFnZXMgd2l0aGluIHRoZSBhcHBsaWNhdGlvbiB1c2luZyBwYWdlLmpzLlxuICovXG5leHBvcnQgY2xhc3MgUm91dGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihtb3VudFBvaW50SWQpIHtcbiAgICAgICAgLyogTW91bnQgdGhlIGFwcGxpY2F0aW9uIHRvIHRoZSBlbGVtZW50IHNwZWNpZmllZCBieSB0aGUgZ2l2ZW4gSUQuICovXG4gICAgICAgIHRoaXMucm91dGVzID0ge307XG5cbiAgICAgICAgd2luZG93LmFwcC5tb3VudFBvaW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobW91bnRQb2ludElkKTtcbiAgICAgICAgdGhpcy5tb3VudFBvaW50ID0gd2luZG93LmFwcC5tb3VudFBvaW50O1xuICAgIH1cblxuICAgIC8qXG4gICAgICogQWRkIGEgbWFwcGluZyBmcm9tIHJvdXRlIFVSTCB0byBKYXZhc2NyaXB0IGNvbnRyb2xsZXIuXG4gICAgICovXG4gICAgYWRkUm91dGUocm91dGUsIGNvbnRyb2xsZXIpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXNbcm91dGVdID0gY29udHJvbGxlcjtcbiAgICB9XG5cbiAgICBzdGFydCgpIHtcblxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAvKiBSZWdpc3RlciBlYWNoIG9mIHRoZSByb3V0ZXMgd2l0aCBwYWdlLmpzLiAqL1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMucm91dGVzKSB7XG4gICAgICAgICAgICBwYWdlKGksIHRoaXMucm91dGVzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIElmIGEgcGFnZSBpcyBub3QgbWF0Y2hlZCBieSB0aGUgZXhpc3Rpbmcgcm91dGVzLCBmYWxsIHRocm91Z2hcbiAgICAgICAgICogdG8gdGhlIDQwNCBub3QgZm91bmQgcGFnZS5cbiAgICAgICAgICovXG4gICAgICAgIHBhZ2UoXCIqXCIsIGZ1bmN0aW9uKGN0eCwgbmV4dCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIjQwNFwiLCBjdHgsIG5leHQpO1xuICAgICAgICAgICAgUmVhY3QucmVuZGVyKDxGaWxlTm90Rm91bmRQYWdlIC8+LCB3aW5kb3cuYXBwLm1vdW50UG9pbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKiBTdGFydCB0aGUgcm91dGVyLiAqL1xuICAgICAgICBwYWdlKCk7XG4gICAgfVxufVxuIiwiLypcbiAqIEEgbW9kYWwgb2JqZWN0IHdoaWNoIGlzIHJlc3BvbnNpYmxlIGZvciB2aWV3aW5nIGFuZCB1cGF0ZWluZyB0aGUgc2V0dGluZ3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBBcHBTZXR0aW5nc01vZGFsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyLmNvbnN0cnVjdG9yKHByb3BzKTtcblxuICAgICAgICAvKiBTZXQgdGhlIGRlZmF1bHQgc3RhdGUuICovXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBzYXZlU2V0dGluZ3NJblByb2dyZXNzOiBmYWxzZSxcbiAgICAgICAgICAgIHdlaWdodDogMCxcbiAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgIGdlbmRlcjogXCJvdGhlclwiLFxuICAgICAgICAgICAgYWdlOiAwXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIC8qIEJpbmQgdGhlIHNob3duIGZ1bmN0aW9uIHRvIHRoZSBtb2RhbCBzaG93biBldmVudC4gKi9cbiAgICAgICAgJChSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSkub24oXCJzaG93bi5icy5tb2RhbFwiLCB0aGlzLnNob3duLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogV2hlbiB0aGUgbW9kYWwgaXMgc2hvd24sIHJldHJpZXZlIHRoZSBjdXJyZW50IHNldHRpbmdzIGZyb20gdGhlIHNlcnZlclxuICAgICAqIGFuZCBwb3B1bGF0ZSB0aGUgZm9ybSBhcHByb3ByaWF0ZWx5LlxuICAgICAqL1xuICAgIHNob3duKGUpIHtcbiAgICAgICAgJC5nZXQoXCIvYXBpL3NldHRpbmdzXCIsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzICE9IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICBnZW5kZXI6IHJlc3VsdC5nZW5kZXIsXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodDogcmVzdWx0LndlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiByZXN1bHQuaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBhZ2U6IHJlc3VsdC5hZ2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEhhbmRsZXMgdGhlIHNhdmluZyBvZiB0aGUgZm9ybSB2YWx1ZXMgdG8gdGhlIHNlcnZlci5cbiAgICAgKi9cbiAgICBiZWdpblNhdmVTZXR0aW5ncygpIHtcblxuICAgICAgICAvKiBJbmRpY2F0ZSB0aGF0IHRoZSBzYXZlIGhhcyBiZWd1biwgdG8gaGlkZSB0aGUgc2F2ZSBidXR0b24uICovXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3NhdmVTZXR0aW5nc0luUHJvZ3Jlc3M6IHRydWV9KTtcblxuICAgICAgICAvKiBDb25zdHJ1Y3QgdGhlIHJlcXVlc3QgZnJvbSB0aGUgZm9ybSB2YWx1ZXMuICovXG4gICAgICAgIHZhciBwYXJhbXMgPSB7XG4gICAgICAgICAgICB3ZWlnaHQ6IHRoaXMuc3RhdGUud2VpZ2h0LFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLmhlaWdodCxcbiAgICAgICAgICAgIGFnZTogdGhpcy5zdGF0ZS5hZ2UsXG4gICAgICAgICAgICBnZW5kZXI6IHRoaXMuc3RhdGUuZ2VuZGVyXG4gICAgICAgIH07XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUG9zdCB0aGUgdmFsdWVzIHRvIHRoZSBzZXJ2ZXIgdG8gdXBkYXRlIHRoZSBzZXR0aW5ncywgYW5kIGhpZGVcbiAgICAgICAgICogdGhlIG1vZGFsLlxuICAgICAgICAgKi9cbiAgICAgICAgJC5wb3N0KFwiL2FwaS91cGRhdGVfc2V0dGluZ3NcIiwgcGFyYW1zLCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3NhdmVTZXR0aW5nc0luUHJvZ3Jlc3M6IGZhbHNlfSk7XG5cbiAgICAgICAgICAgICQoUmVhY3QuZmluZERPTU5vZGUodGhpcykpLm1vZGFsKFwiaGlkZVwiKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFVwZGF0ZSB0aGUgc3RvcmVkIHdlaWdodCBpbiByZXNwb25zZSB0byB0aGUgZmllbGQgdWRwYXRpbmcuXG4gICAgICogV2VpZ2h0IGlzIHN0b3JlZCBpbiBraW9ncmFtcy5cbiAgICAgKi9cbiAgICB3ZWlnaHRDaGFuZ2VkKGUpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7d2VpZ2h0OiBwYXJzZUludChlLnRhcmdldC52YWx1ZSl9KTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFVwZGF0ZSB0aGUgc3RvcmVkIGhlaWdodCBpbiByZXNwb25zZSB0byB0aGUgZmllbGQgdWRwYXRpbmcuXG4gICAgICogSGVpZ2h0IGlzIHN0b3JlZCBpbiBjZW50aW1ldGVycy5cbiAgICAgKi9cbiAgICBoZWlnaHRDaGFuZ2VkKGUpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aGVpZ2h0OiBwYXJzZUludChlLnRhcmdldC52YWx1ZSl9KTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFVwZGF0ZSB0aGUgc3RvcmVkIGdlbmRlciBpbiByZXNwb25zZSB0byB0aGUgZmllbGQgdWRwYXRpbmcuXG4gICAgICogR2VuZGVyIGlzIHN0b3JlZCBhcyBhIHN0cmluZzogJ21hbGUnLCAnZmVtYWxlJyBvciAnb3RoZXInLi5cbiAgICAgKi9cbiAgICBnZW5kZXJDaGFuZ2VkKGUpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7Z2VuZGVyOiBlLnRhcmdldC52YWx1ZX0pO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogVXBkYXRlIHRoZSBzdG9yZWQgYWdlIGluIHJlc3BvbnNlIHRvIHRoZSBmaWVsZCB1ZHBhdGluZy5cbiAgICAgKiBIZWlnaHQgaXMgc3RvcmVkIGluIHllYXJzLlxuICAgICAqL1xuICAgIGFnZUNoYW5nZWQoZSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHthZ2U6IHBhcnNlSW50KGUudGFyZ2V0LnZhbHVlKX0pO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogQ29uc3RydWN0IHRoZSBmb3JtIHRvIGJlIGRpc3BsYXllZCBpbiB0aGUgbW9kYWwsIGdpdmVuIHRoZSBwYXJhbWV0ZXJzLlxuICAgICAqL1xuICAgIGdldEZvcm0oKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cblxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3JOYW1lPVwid2VpZ2h0XCI+V2VpZ2h0IChrZyk8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwid2VpZ2h0XCIgdmFsdWU9e3RoaXMuc3RhdGUud2VpZ2h0fSB0eXBlPVwibnVtYmVyXCIgb25DaGFuZ2U9e3RoaXMud2VpZ2h0Q2hhbmdlZC5iaW5kKHRoaXMpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIj48L2lucHV0PlxuXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvck5hbWU9XCJoZWlnaHRcIj5IZWlnaHQgKGNtKTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJoZWlnaHRcIiB2YWx1ZT17dGhpcy5zdGF0ZS5oZWlnaHR9IHR5cGU9XCJudW1iZXJcIiBvbkNoYW5nZT17dGhpcy5oZWlnaHRDaGFuZ2VkLmJpbmQodGhpcyl9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiPjwvaW5wdXQ+XG5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yTmFtZT1cImFnZVwiPkFnZSAoeWVhcnMpPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImFnZVwiIHZhbHVlPXt0aGlzLnN0YXRlLmFnZX0gdHlwZT1cIm51bWJlclwiIG9uQ2hhbmdlPXt0aGlzLmFnZUNoYW5nZWQuYmluZCh0aGlzKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCI+PC9pbnB1dD5cblxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3JOYW1lPVwiZ2VuZGVyXCI+R2VuZGVyPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIHZhbHVlPXt0aGlzLnN0YXRlLmdlbmRlcn0gb25DaGFuZ2U9e3RoaXMuZ2VuZGVyQ2hhbmdlZC5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIm1hbGVcIj5NYWxlPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJmZW1hbGVcIj5GZW1hbGU8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIm90aGVyXCI+T3RoZXI8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcblxuICAgICAgICAvKiBDb25zdHJ1Y3QgdGhlIGNvbnRlbnQgb2YgdGhlIG1vZGFsLiAqL1xuICAgICAgICB2YXIgYmVmb3JlSW1wb3J0Qm9keSA9IFtcbiAgICAgICAgICAgIDxwPlBsZWFzZSBjb25maWd1cmUgdGhlIGFwcGxpY2F0aW9uIHNldHRpbmdzLCB0aGlzIGluZm9ybWF0aW9uIGlzIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSBraWxvam91bGVzIHlvdSBidXJuIG9uIGVhY2ggcnVuLjwvcD4sXG4gICAgICAgICAgICB0aGlzLmdldEZvcm0oKVxuICAgICAgICBdO1xuXG4gICAgICAgIHZhciBib2R5ID0gYmVmb3JlSW1wb3J0Qm9keTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbCBmYWRlXCIgaWQ9XCJzZXR0aW5nc19tb2RhbFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZGlhbG9nXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwibW9kYWwtdGl0bGVcIj48aSBjbGFzc05hbWU9XCJpb24gaW9uLWdlYXItYVwiPjwvaT4gQXBwbGljYXRpb24gU2V0dGluZ3M8L2g0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Ym9keX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPkNsb3NlPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgb25DbGljaz17dGhpcy5iZWdpblNhdmVTZXR0aW5ncy5iaW5kKHRoaXMpfSBkaXNhYmxlZD17dGhpcy5zdGF0ZS5zYXZlU2V0dGluZ3NJblByb2dyZXNzfT5TYXZlPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJ2YXIgQ2hhcnRKcyA9IHJlcXVpcmUoXCJjaGFydC5qc1wiKTtcblxuZXhwb3J0IGNsYXNzIEJhckNoYXJ0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIGNyZWF0ZUNoYXJ0KCkge1xuICAgICAgICB2YXIgY29udGV4dCA9ICQoUmVhY3QuZmluZERPTU5vZGUodGhpcykpLmZpbmQoXCIuY2hhcnRcIilbMF0uZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICB0aGlzLmNoYXJ0ID0gbmV3IENoYXJ0SnMoY29udGV4dCkuQmFyKHRoaXMucHJvcHMuZGF0YSwgdGhpcy5wcm9wcy5vcHRzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVDaGFydCgpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVcGRhdGUoKSB7XG4gICAgICAgIHRoaXMuY2hhcnQuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLmNyZWF0ZUNoYXJ0KCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8Y2FudmFzIGNsYXNzTmFtZT1cImNoYXJ0XCIgd2lkdGg9XCI0MDBcIiBoZWlnaHQ9XCIyMDBcIj48L2NhbnZhcz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBCb2R5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgSGVsbG8gdGhlcmUhXG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIi9kYXNoYm9hcmRcIj5EYXNoYm9hcmQ8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgSW1wb3J0RGF0YU1vZGFsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyLmNvbnN0cnVjdG9yKHByb3BzKTtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgaW1wb3J0RmFpbGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGltcG9ydEluUHJvZ3Jlc3M6IGZhbHNlLFxuICAgICAgICAgICAgYXR0ZW1wdGVkSW1wb3J0OiBmYWxzZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHBhc3N3b3JkQ2hhbmdlKGUpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBwYXNzd29yZDogZS50YXJnZXQudmFsdWVcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYmVnaW5EYXRhSW1wb3J0KCkge1xuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2ltcG9ydEluUHJvZ3Jlc3M6IHRydWUsIGF0dGVtcHRlZEltcG9ydDogdHJ1ZX0pO1xuXG4gICAgICAgICQucG9zdChcIi9hcGkvaW1wb3J0X2RhdGFcIiwge3Bhc3N3b3JkOiB0aGlzLnN0YXRlLnBhc3N3b3JkfSwgZnVuY3Rpb24ocmVzdWx0KSB7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtpbXBvcnRGYWlsZWQ6IGZhbHNlfSk7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGltcG9ydEZhaWxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiByZXN1bHQuZXJyb3JcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aW1wb3J0SW5Qcm9ncmVzczogZmFsc2V9KTtcblxuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcblxuICAgICAgICB2YXIgYmVmb3JlSW1wb3J0Qm9keSA9IFtcbiAgICAgICAgICAgIDxwPkVudGVyIHlvdXIgcGFzc3dvcmQgdG8gaW1wb3J0IHlvdXIgcnVuIGRhdGE8L3A+LFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvck5hbWU9XCJwYXNzd29yZFwiPlBhc3N3b3JkPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cInBhc3N3b3JkXCIgdmFsdWU9e3RoaXMuc3RhdGUucGFzc3dvcmR9IG9uQ2hhbmdlPXt0aGlzLnBhc3N3b3JkQ2hhbmdlLmJpbmQodGhpcyl9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJwYXNzd29yZFwiPjwvaW5wdXQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgXTtcblxuICAgICAgICB2YXIgZmFpbGVkSW1wb3J0Qm9keSA9IFtcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWxlcnQgYWxlcnQtZGFuZ2VyXCIgcm9sZT1cImFsZXJ0XCI+PHN0cm9uZz5JbXBvcnQgZmFpbGVkPC9zdHJvbmc+OiB7dGhpcy5zdGF0ZS5lcnJvck1lc3NhZ2V9PC9kaXY+LFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvck5hbWU9XCJwYXNzd29yZFwiPlBhc3N3b3JkPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cInBhc3N3b3JkXCIgdmFsdWU9e3RoaXMuc3RhdGUucGFzc3dvcmR9IG9uQ2hhbmdlPXt0aGlzLnBhc3N3b3JkQ2hhbmdlLmJpbmQodGhpcyl9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJwYXNzd29yZFwiPjwvaW5wdXQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgXTtcblxuICAgICAgICB2YXIgaW1wb3J0SW5Qcm9ncmVzcyA9IFtcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWxlcnQgYWxlcnQtaW5mb1wiIHJvbGU9XCJhbGVydFwiPkltcG9ydCBwcm9jZXNzaW5nLi4uPC9kaXY+XG4gICAgICAgIF07XG5cbiAgICAgICAgdmFyIHN1Y2Nlc3NJbXBvcnRCb2R5ID0gW1xuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhbGVydCBhbGVydC1zdWNjZXNzXCIgcm9sZT1cImFsZXJ0XCI+SW1wb3J0IHN1Y2NlZWRlZCE8L2Rpdj5cbiAgICAgICAgXTtcblxuICAgICAgICB2YXIgYm9keTtcblxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5pbXBvcnRJblByb2dyZXNzKSB7XG4gICAgICAgICAgICBib2R5ID0gaW1wb3J0SW5Qcm9ncmVzcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmF0dGVtcHRlZEltcG9ydCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmltcG9ydEZhaWxlZCkge1xuICAgICAgICAgICAgICAgICAgICBib2R5ID0gZmFpbGVkSW1wb3J0Qm9keTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBib2R5ID0gc3VjY2Vzc0ltcG9ydEJvZHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBib2R5ID0gYmVmb3JlSW1wb3J0Qm9keTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsIGZhZGVcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWRpYWxvZ1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cIm1vZGFsLXRpdGxlXCI+PGkgY2xhc3NOYW1lPVwiaW9uLXVwbG9hZFwiIC8+IEltcG9ydCB5b3VyIFJ1bnM8L2g0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Ym9keX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPkNsb3NlPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgb25DbGljaz17dGhpcy5iZWdpbkRhdGFJbXBvcnQuYmluZCh0aGlzKX0gZGlzYWJsZWQ9e3RoaXMuc3RhdGUuaW1wb3J0SW5Qcm9ncmVzc30+QmVnaW4gSW1wb3J0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJ2YXIgQ2hhcnRKcyA9IHJlcXVpcmUoXCJjaGFydC5qc1wiKTtcblxuZXhwb3J0IGNsYXNzIExpbmVDaGFydCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY2hhcnQgPSBudWxsO1xuICAgIH1cblxuICAgIGNyZWF0ZUNoYXJ0KCkge1xuICAgICAgICB2YXIgY29udGV4dCA9ICQoUmVhY3QuZmluZERPTU5vZGUodGhpcykpLmZpbmQoXCIuY2hhcnRcIilbMF0uZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICB0aGlzLmNoYXJ0ID0gbmV3IENoYXJ0SnMoY29udGV4dCkuTGluZSh0aGlzLnByb3BzLmRhdGEsIHRoaXMucHJvcHMub3B0cyk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlQ2hhcnQoKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVXBkYXRlKCkge1xuICAgICAgICB0aGlzLmNoYXJ0LmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5jcmVhdGVDaGFydCgpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGNhbnZhcyBjbGFzc05hbWU9XCJjaGFydCBjZW50ZXItY2hhcnRcIiB3aWR0aD17dGhpcy5wcm9wcy53aWR0aH0gaGVpZ2h0PXt0aGlzLnByb3BzLmhlaWdodH0+PC9jYW52YXM+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbkxpbmVDaGFydC5kZWZhdWx0UHJvcHMgPSB7XG4gICAgd2lkdGg6IDM2MCxcbiAgICBoZWlnaHQ6IDE4MFxufVxuIiwiaW1wb3J0IHtOYXZiYXJ9IGZyb20gXCJjb21wb25lbnRzL05hdmJhci5qc3hcIjtcbmltcG9ydCB7TW9kYWxUcmlnZ2VyfSBmcm9tIFwiY29tcG9uZW50cy9Nb2RhbFRyaWdnZXIuanN4XCI7XG5pbXBvcnQge1VwbG9hZERhdGFCdXR0b259IGZyb20gXCJjb21wb25lbnRzL1VwbG9hZERhdGFCdXR0b24uanN4XCI7XG5pbXBvcnQge0ltcG9ydERhdGFNb2RhbH0gZnJvbSBcImNvbXBvbmVudHMvSW1wb3J0RGF0YU1vZGFsLmpzeFwiO1xuXG5leHBvcnQgY2xhc3MgTWFpbk5hdmJhciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBpbXBvcnREYXRhKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcblxuXG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuXG4gICAgICAgIHZhciBsaW5rcyA9IFtcbiAgICAgICAgICAgIHtuYW1lOiBcIkRhc2hib2FyZFwiLCBpY29uOiBcImlvbi1pb3MtaG9tZVwiLCB1cmw6IFwiL2Rhc2hib2FyZFwiLCBjbGljazogZnVuY3Rpb24oKSB7fSwgY29udGV4dDogdGhpcywgYnV0dG9uOiBmYWxzZX0sXG4gICAgICAgICAgICB7bmFtZTogXCJSdW4gSGlzdG9yeVwiLCBpY29uOiBcImlvbi1zdGF0cy1iYXJzXCIsIHVybDogXCIvaGlzdG9yeVwiLCBjbGljazogZnVuY3Rpb24oKSB7fSwgY29udGV4dDogdGhpcywgYnV0dG9uOiBmYWxzZX1cbiAgICAgICAgXTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPE5hdmJhciBsaW5rcz17bGlua3N9IC8+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIE1hcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5kZWZhdWx0T3B0c1N0cmluZyA9IFwic2l6ZT0xMTY4eDQ4MCZtYXB0eXBlPXJvYWRtYXBcIjtcbiAgICB9XG5cbiAgICBnZXRTdGF0aWNVcmwoKSB7XG4gICAgICAgIHZhciBzdGF0aWNNYXBVcmwgPSBcImh0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9zdGF0aWNtYXA/XCIgKyB0aGlzLmRlZmF1bHRPcHRzU3RyaW5nICsgXCImXCIgKyB0aGlzLmNlbnRlclN0cmluZyArIFwiJlwiICsgdGhpcy56b29tU3RyaW5nICsgXCImXCIgKyB0aGlzLnJ1blBhdGhTdHJpbmcgKyBcIiZcIiArIHRoaXMubWFya2VyU3RyaW5nO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKHN0YXRpY01hcFVybCk7XG4gICAgICAgIHJldHVybiBzdGF0aWNNYXBVcmw7XG4gICAgfVxuXG4gICAgY29tcHV0ZVJ1blBhdGgod2F5cG9pbnRzLCBib3VuZHMpIHtcbiAgICAgICAgdmFyIHJ1blBhdGggPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdheXBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBvaW50ID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyh3YXlwb2ludHNbaV0ubGF0LCB3YXlwb2ludHNbaV0ubG9uKTtcbiAgICAgICAgICAgIHJ1blBhdGgucHVzaCggcG9pbnQgKTtcbiAgICAgICAgICAgIGJvdW5kcy5leHRlbmQoIHBvaW50ICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcnVuUGF0aDtcbiAgICB9XG5cbiAgICB1cGRhdGVSdW5QYXRoU3RyaW5nKHJ1blBhdGgpIHtcbiAgICAgICAgdGhpcy5ydW5QYXRoU3RyaW5nID0gXCJwYXRoPWNvbG9yOjB4MDAwMGZmfHdlaWdodDo1fFwiO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnVuUGF0aC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5ydW5QYXRoU3RyaW5nICs9IHJ1blBhdGhbaV0uQSArIFwiLFwiICsgcnVuUGF0aFtpXS5GO1xuXG4gICAgICAgICAgICBpZiAoaSA8IHJ1blBhdGgubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICB0aGlzLnJ1blBhdGhTdHJpbmcgKz0gXCJ8XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVNYXJrZXJTdHJpbmcoc3RhcnQsIGVuZCkge1xuICAgICAgICB0aGlzLm1hcmtlclN0cmluZyA9IFwibWFya2Vycz1jb2xvcjpibHVlfFwiICsgc3RhcnQuQSArIFwiLFwiICsgc3RhcnQuRiArIFwifFwiICsgZW5kLkEgKyBcIixcIiArIGVuZC5GO1xuICAgIH1cblxuICAgIG1hcFpvb21IYW5kbGVyKG1hcCwgZSkge1xuICAgICAgICB0aGlzLnpvb21TdHJpbmcgPSBcInpvb209XCIgKyBtYXAuem9vbTtcbiAgICB9XG5cbiAgICBtYXBDZW50ZXJIYW5kbGVyKG1hcCwgZSkge1xuICAgICAgICB0aGlzLmNlbnRlclN0cmluZyA9IFwiY2VudGVyPVwiICsgbWFwLmNlbnRlci5BICsgXCIsXCIgKyBtYXAuY2VudGVyLkY7XG4gICAgfVxuXG4gICAgaW5pdFN0YXRpY01hcFN0cmluZ3MoKSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdE9wdHNTdHJpbmcgPSBcInNpemU9NjAweDMwMCZtYXB0eXBlPXJvYWRtYXBcIjtcbiAgICB9XG5cbiAgICBjcmVhdGVSdW5QYXRoUG9seWxpbmUobWFwLCB3YXlwb2ludHMsIHJ1blBhdGgpIHtcbiAgICAgICAgdmFyIHJ1blBhdGhQb2x5TGluZTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdheXBvaW50cy5sZW5ndGggLSAxOyBpKyspIHtcblxuICAgICAgICAgICAgdmFyIGR4ID0gcGFyc2VGbG9hdCh3YXlwb2ludHNbaV0ubGF0KSAtIHBhcnNlRmxvYXQod2F5cG9pbnRzW2kgKyAxXS5sYXQpO1xuICAgICAgICAgICAgdmFyIGR5ID0gcGFyc2VGbG9hdCh3YXlwb2ludHNbaV0ubG9uKSAtIHBhcnNlRmxvYXQod2F5cG9pbnRzW2kgKyAxXS5sb24pO1xuICAgICAgICAgICAgdmFyIGRpc3QgPSBNYXRoLnNxcnQoZHggKiBkeCAgKyBkeSAqIGR5KSAqIDEwMDA7XG4gICAgICAgICAgICBkaXN0ICo9IDYwMDtcbiAgICAgICAgICAgIGlmICggZGlzdCA+IDIzMCApIHtcbiAgICAgICAgICAgICAgICBkaXN0ID0gMjMwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCBkaXN0IDwgMjAgKSB7XG4gICAgICAgICAgICAgICAgZGlzdCA9IDIwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coIGRpc3QgKTtcbiAgICAgICAgICAgIHZhciByLCBnLCBiO1xuICAgICAgICAgICAgciA9IHBhcnNlSW50KCgyNTUgLSBkaXN0KSk7XG4gICAgICAgICAgICBnID0gcGFyc2VJbnQoKGRpc3QpKTtcbiAgICAgICAgICAgIGIgPSAyMDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCByLCBnLCBiICk7XG5cbiAgICAgICAgICAgIHJ1blBhdGhQb2x5TGluZSA9IG5ldyBnb29nbGUubWFwcy5Qb2x5bGluZSh7XG4gICAgICAgICAgICAgICAgcGF0aDogW3J1blBhdGhbaV0sIHJ1blBhdGhbaSArIDFdXSxcbiAgICAgICAgICAgICAgICBnZW9kZXNpYzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzdHJva2VDb2xvcjogJ3JnYmEoJyArIHIgKyAnLCAnICsgZyArICcsICcgKyBiICsgJywgMSknLFxuICAgICAgICAgICAgICAgIHN0cm9rZU9wYWNpdHk6IDEuMCxcbiAgICAgICAgICAgICAgICBzdHJva2VXZWlnaHQ6IDNcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBydW5QYXRoUG9seUxpbmUuc2V0TWFwKG1hcCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwbGFjZU1hcmtlcnMobWFwLCB3YXlwb2ludHMsIHJ1blBhdGgpIHtcbiAgICAgICAgdmFyIHN0YXJ0SW1hZ2UgPSAnL2ltZy9zdGFydC5wbmcnO1xuICAgICAgICB2YXIgZW5kSW1hZ2UgPSAnL2ltZy9lbmQucG5nJztcbiAgICAgICAgdmFyIG5vZGVJbWFnZSA9ICcvaW1nL2JsYW5rLnBuZyc7XG4gICAgICAgIHZhciBpY29uO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnVuUGF0aC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgPT0gMCkge1xuICAgICAgICAgICAgICAgIGljb24gPSBzdGFydEltYWdlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpID09IHJ1blBhdGgubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIGljb24gPSBlbmRJbWFnZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWNvbiA9IG5vZGVJbWFnZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHdwID0gdGhpcy5wcm9wcy53YXlwb2ludHNbaV07XG5cbiAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogcnVuUGF0aFtpXSxcbiAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlIFRlc3QnLFxuICAgICAgICAgICAgICAgIGljb246IGljb25cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAoZnVuY3Rpb24gKG1hcmtlcikge1xuICAgICAgICAgICAgICAgIHZhciBpbmZvd2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIlwiICsgd2luZG93LmFwcC5tb21lbnQod3AudGltZSAqIDEwMDApLmZvcm1hdCh3aW5kb3cuYXBwLnRpbWVGb3JtYXQpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnbW91c2VvdmVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZm93aW5kb3cub3BlbihtYXAsIG1hcmtlcik7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdtb3VzZW91dCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpbmZvd2luZG93LmNsb3NlKG1hcCwgbWFya2VyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdmFyIGJvdW5kcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcbiAgICAgICAgdmFyIHJ1blBhdGggPSB0aGlzLmNvbXB1dGVSdW5QYXRoKHRoaXMucHJvcHMud2F5cG9pbnRzLCBib3VuZHMpO1xuXG4gICAgICAgIHZhciBtYXBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuVEVSUkFJTlxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKCQoUmVhY3QuZmluZERPTU5vZGUodGhpcykpLmZpbmQoXCIubWFwLWNhbnZhc1wiKVswXSwgbWFwT3B0aW9ucyk7XG4gICAgICAgIHRoaXMubWFwID0gbWFwO1xuICAgICAgICBtYXAuZml0Qm91bmRzKGJvdW5kcyk7XG5cbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXJPbmNlKG1hcCwgXCJ6b29tX2NoYW5nZWRcIiwgdGhpcy5tYXBab29tSGFuZGxlci5iaW5kKHRoaXMsIG1hcCkpO1xuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lck9uY2UobWFwLCBcImNlbnRlcl9jaGFuZ2VkXCIsIHRoaXMubWFwQ2VudGVySGFuZGxlci5iaW5kKHRoaXMsIG1hcCkpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlTWFya2VyU3RyaW5nKHJ1blBhdGhbMF0sIHJ1blBhdGhbcnVuUGF0aC5sZW5ndGggLSAxXSk7XG4gICAgICAgIHRoaXMudXBkYXRlUnVuUGF0aFN0cmluZyhydW5QYXRoKTtcblxuICAgICAgICB0aGlzLmNyZWF0ZVJ1blBhdGhQb2x5bGluZShtYXAsIHRoaXMucHJvcHMud2F5cG9pbnRzLCBydW5QYXRoKTtcbiAgICAgICAgdGhpcy5wbGFjZU1hcmtlcnMobWFwLCB0aGlzLnByb3BzLndheXBvaW50cywgcnVuUGF0aCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hcC1jYW52YXNcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBNb2RhbFRyaWdnZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHRyaWdnZXJNb2RhbChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBSZWFjdC5yZW5kZXIodGhpcy5wcm9wcy5tb2RhbCwgJCgnI21vZGFsX21vdW50JylbMF0pO1xuICAgICAgICAkKCcjbW9kYWxfbW91bnQnKS5maW5kKFwiLm1vZGFsXCIpLm1vZGFsKFwic2hvd1wiKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG5cbiAgICAgICAgdmFyIGlubmVyO1xuXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmJ1dHRvbikge1xuICAgICAgICAgICAgaW5uZXIgPSA8YnV0dG9uIGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc05hbWV9IG9uQ2xpY2s9e3RoaXMudHJpZ2dlck1vZGFsLmJpbmQodGhpcyl9Pnt0aGlzLnByb3BzLmJ1dHRvblRleHR9PC9idXR0b24+XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbm5lciA9IDxhIGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc05hbWV9IGhyZWY9XCIjXCIgb25DbGljaz17dGhpcy50cmlnZ2VyTW9kYWwuYmluZCh0aGlzKX0+e3RoaXMucHJvcHMuYnV0dG9uVGV4dH08L2E+XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4oXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlubGluZS1ibG9ja1wiPlxuICAgICAgICAgICAgICAgIHtpbm5lcn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7TW9kYWxUcmlnZ2VyfSBmcm9tIFwiLi9Nb2RhbFRyaWdnZXIuanN4XCJcbmltcG9ydCB7QXBwU2V0dGluZ3NNb2RhbH0gZnJvbSBcIi4vQXBwU2V0dGluZ3NNb2RhbC5qc3hcIlxuaW1wb3J0IHtJbXBvcnREYXRhTW9kYWx9IGZyb20gXCJjb21wb25lbnRzL0ltcG9ydERhdGFNb2RhbC5qc3hcIlxuaW1wb3J0IHtVcGxvYWREYXRhQnV0dG9ufSBmcm9tIFwiY29tcG9uZW50cy9VcGxvYWREYXRhQnV0dG9uLmpzeFwiXG5cbmV4cG9ydCBjbGFzcyBOYXZiYXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxuYXYgY2xhc3NOYW1lPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXItZmx1aWRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlIGNvbGxhcHNlZFwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIiNicy1leGFtcGxlLW5hdmJhci1jb2xsYXBzZS0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3Itb25seVwiPlRvZ2dsZSBuYXZpZ2F0aW9uPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24tYmFyXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24tYmFyXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24tYmFyXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIiBocmVmPVwiL1wiPkxpdmluZyBEZWFkIEZpdG5lc3MgVHJhY2tlcjwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2VcIiBpZD1cImJzLWV4YW1wbGUtbmF2YmFyLWNvbGxhcHNlLTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXYgbmF2YmFyLW5hdlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5saW5rcy5tYXAoIGZ1bmN0aW9uKGVudHJ5KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZW50cnkuY29tcG9uZW50ICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDxsaT57ZW50cnkuY29tcG9uZW50fTwvbGk+KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVudHJ5LmJ1dHRvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDxsaT48YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBuYXZiYXItYnRuXCIgb25DbGljaz17ZW50cnkuY2xpY2suYmluZChlbnRyeS5jb250ZXh0KX0+e2VudHJ5Lm5hbWV9PC9idXR0b24+PC9saT4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoPGxpPjxhIGhyZWY9e2VudHJ5LnVybH0gb25DbGljaz17ZW50cnkuY2xpY2suYmluZChlbnRyeS5jb250ZXh0KX0+PGkgY2xhc3NOYW1lPXtlbnRyeS5pY29ufSAvPiB7ZW50cnkubmFtZX08L2E+PC9saT4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXYgbmF2YmFyLW5hdiBuYXZiYXItcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNb2RhbFRyaWdnZXIgbW9kYWw9ezxJbXBvcnREYXRhTW9kYWwgLz59IGJ1dHRvbj17dHJ1ZX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IG5hdmJhci1idG4gbWFyZ2luLXJpZ2h0XCIgYnV0dG9uVGV4dD17PFVwbG9hZERhdGFCdXR0b24gLz59IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNb2RhbFRyaWdnZXIgbW9kYWw9ezxBcHBTZXR0aW5nc01vZGFsIC8+fSBidXR0b249e3RydWV9IGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBuYXZiYXItYnRuXCIgYnV0dG9uVGV4dD17PGkgY2xhc3NOYW1lPVwiaW9uIGlvbi1nZWFyLWFcIj48L2k+fSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvbmF2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsInZhciBDaGFydEpzID0gcmVxdWlyZShcImNoYXJ0LmpzXCIpO1xuXG5leHBvcnQgY2xhc3MgUGllQ2hhcnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgY3JlYXRlQ2hhcnQoKSB7XG4gICAgICAgIHZhciBjb250ZXh0ID0gJChSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSkuZmluZChcIi5jaGFydFwiKVswXS5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIHRoaXMuY2hhcnQgPSBuZXcgQ2hhcnRKcyhjb250ZXh0KS5QaWUodGhpcy5wcm9wcy5kYXRhLCB0aGlzLnByb3BzLm9wdHMpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0aGlzLmNyZWF0ZUNoYXJ0KCk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVwZGF0ZSgpIHtcbiAgICAgICAgdGhpcy5jaGFydC5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuY3JlYXRlQ2hhcnQoKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxjYW52YXMgY2xhc3NOYW1lPVwiY2hhcnRcIiB3aWR0aD1cIjQwMFwiIGhlaWdodD1cIjIwMFwiPjwvY2FudmFzPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwidmFyIENoYXJ0SnMgPSByZXF1aXJlKFwiY2hhcnQuanNcIik7XG5cbmV4cG9ydCBjbGFzcyBSYWRhckNoYXJ0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIGNyZWF0ZUNoYXJ0KCkge1xuICAgICAgICB2YXIgY29udGV4dCA9ICQoUmVhY3QuZmluZERPTU5vZGUodGhpcykpLmZpbmQoXCIuY2hhcnRcIilbMF0uZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICB0aGlzLmNoYXJ0ID0gbmV3IENoYXJ0SnMoY29udGV4dCkuUmFkYXIodGhpcy5wcm9wcy5kYXRhLCB0aGlzLnByb3BzLm9wdHMpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0aGlzLmNyZWF0ZUNoYXJ0KCk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVwZGF0ZSgpIHtcbiAgICAgICAgdGhpcy5jaGFydC5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuY3JlYXRlQ2hhcnQoKTtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8Y2FudmFzIGNsYXNzTmFtZT1cImNoYXJ0XCIgd2lkdGg9XCI0MDBcIiBoZWlnaHQ9XCIyMDBcIj48L2NhbnZhcz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7RmFjZWJvb2tTaGFyZUJ1dHRvbiwgVHdpdHRlclNoYXJlQnV0dG9ufSBmcm9tIFwiY29tcG9uZW50cy9Tb2NpYWxTaGFyaW5nLmpzeFwiO1xuXG5leHBvcnQgY2xhc3MgU2hhcmVSdW5Nb2RhbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBiZWdpbkRhdGFJbXBvcnQoKSB7XG5cbiAgICAgICAgJC5wb3N0KFwiL2FwaS9pbXBvcnRfZGF0YVwiLCB7fSwgZnVuY3Rpb24ocmVzdWx0KSB7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG5cbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcblxuICAgICAgICAkKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpKS5tb2RhbChcInNob3dcIik7XG5cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsIGZhZGVcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWRpYWxvZ1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cIm1vZGFsLXRpdGxlXCI+U2hhcmUgWW91ciBSdW48L2g0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17dGhpcy5wcm9wcy5pbWFnZVVybH0gd2lkdGg9XCIxMDAlXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxGYWNlYm9va1NoYXJlQnV0dG9uIHVybD17dGhpcy5wcm9wcy5pbWFnZVVybH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VHdpdHRlclNoYXJlQnV0dG9uIHVybD17dGhpcy5wcm9wcy5pbWFnZVVybH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsIlxuLypcbiAqIEV4YW1wbGVcbiAqIDxGYWNlYm9va1NoYXJlQnV0dG9uIHVybD1cImh0dHA6Ly9pLmltZ3VyLmNvbS8zc2t2QS5qcGdcIiAvPlxuICovXG5leHBvcnQgY2xhc3MgRmFjZWJvb2tTaGFyZUJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoIHByb3BzICkge1xuICAgICAgICBzdXBlciggcHJvcHMgKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgKGZ1bmN0aW9uKGQsIHMsIGlkKSB7XG4gICAgICAgICAgICB2YXIganMsIGZqcyA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF07XG4gICAgICAgICAgICBpZiAoZC5nZXRFbGVtZW50QnlJZChpZCkpIHJldHVybjtcbiAgICAgICAgICAgIGpzID0gZC5jcmVhdGVFbGVtZW50KHMpOyBqcy5pZCA9IGlkO1xuICAgICAgICAgICAganMuc3JjID0gXCJodHRwczovL2Nvbm5lY3QuZmFjZWJvb2submV0L2VuX1VTL3Nkay5qcyN4ZmJtbD0xJnZlcnNpb249djIuMyZhcHBJZD02Mzk1NDIxODYxNDY3ODVcIjtcbiAgICAgICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcbiAgICAgICAgfVxuICAgICAgICAoZG9jdW1lbnQsICdzY3JpcHQnLCAnZmFjZWJvb2stanNzZGsnKSk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZiLXNoYXJlLWJ1dHRvbidcbiAgICAgICAgICAgICAgICBkYXRhLWhyZWY9e3RoaXMucHJvcHMudXJsfVxuICAgICAgICAgICAgICAgIGRhdGEtbGF5b3V0PSdidXR0b24nPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICB9XG59XG5cbi8qXG4gKiBFeGFtcGxlXG4gKiA8VHdpdHRlclNoYXJlQnV0dG9uIHVybD1cImh0dHA6Ly9pLmltZ3VyLmNvbS8zc2t2QS5qcGdcIiBtZXNzYWdlPVwiU2FtcGxlIGJvZHlcIiAvPlxuICovXG5leHBvcnQgY2xhc3MgVHdpdHRlclNoYXJlQnV0dG9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XG4gICAgICAgIHN1cGVyKCBwcm9wcyApO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAhZnVuY3Rpb24oZCxzLGlkKXtcbiAgICAgICAgICAgIHZhciBqcyxmanM9ZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxwPS9eaHR0cDovLnRlc3QoZC5sb2NhdGlvbik/J2h0dHAnOidodHRwcyc7XG4gICAgICAgICAgICBpZighZC5nZXRFbGVtZW50QnlJZChpZCkpe1xuICAgICAgICAgICAgICAgIGpzPWQuY3JlYXRlRWxlbWVudChzKTtcbiAgICAgICAgICAgICAgICBqcy5pZD1pZDtqcy5zcmM9cCsnOi8vcGxhdGZvcm0udHdpdHRlci5jb20vd2lkZ2V0cy5qcyc7XG4gICAgICAgICAgICAgICAgZmpzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGpzLGZqcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgKGRvY3VtZW50LCAnc2NyaXB0JywgJ3R3aXR0ZXItd2pzJyk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGEgaHJlZj0naHR0cHM6Ly90d2l0dGVyLmNvbS9zaGFyZSdcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9J3R3aXR0ZXItc2hhcmUtYnV0dG9uJ1xuICAgICAgICAgICAgICAgIGRhdGEtdXJsPXt0aGlzLnByb3BzLnVybH1cbiAgICAgICAgICAgICAgICBkYXRhLXRleHQ9e3RoaXMucHJvcHMubWVzc2FnZX1cbiAgICAgICAgICAgICAgICBkYXRhLWNvdW50PSdub25lJz5Ud2VldDwvYT5cbiAgICAgICAgKVxuICAgIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBVcGxvYWREYXRhQnV0dG9uIHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiA8c3Bhbj48aSBjbGFzc05hbWU9XCJpb24gaW9uLXVwbG9hZFwiPjwvaT4gSW1wb3J0IERhdGE8L3NwYW4+O1xuICAgIH1cbn1cbiIsImltcG9ydCB7Qm9keX0gZnJvbSBcImNvbXBvbmVudHMvQm9keS5qc3hcIjtcbmltcG9ydCB7TGluZUNoYXJ0fSBmcm9tIFwiY29tcG9uZW50cy9MaW5lQ2hhcnQuanN4XCI7XG5pbXBvcnQge0JhckNoYXJ0fSBmcm9tIFwiY29tcG9uZW50cy9CYXJDaGFydC5qc3hcIjtcbmltcG9ydCB7UmFkYXJDaGFydH0gZnJvbSBcImNvbXBvbmVudHMvUmFkYXJDaGFydC5qc3hcIjtcbmltcG9ydCB7UGllQ2hhcnR9IGZyb20gXCJjb21wb25lbnRzL1BpZUNoYXJ0LmpzeFwiO1xuaW1wb3J0IHtNYWluTmF2YmFyfSBmcm9tIFwiY29tcG9uZW50cy9NYWluTmF2YmFyLmpzeFwiO1xuaW1wb3J0IHtNb2RhbFRyaWdnZXJ9IGZyb20gXCJjb21wb25lbnRzL01vZGFsVHJpZ2dlci5qc3hcIjtcbmltcG9ydCB7SW1wb3J0RGF0YU1vZGFsfSBmcm9tIFwiY29tcG9uZW50cy9JbXBvcnREYXRhTW9kYWwuanN4XCI7XG5pbXBvcnQge0ZhY2Vib29rU2hhcmVCdXR0b24sIFR3aXR0ZXJTaGFyZUJ1dHRvbn0gZnJvbSBcImNvbXBvbmVudHMvU29jaWFsU2hhcmluZy5qc3hcIjtcbmltcG9ydCB7VXBsb2FkRGF0YUJ1dHRvbn0gZnJvbSBcImNvbXBvbmVudHMvVXBsb2FkRGF0YUJ1dHRvbi5qc3hcIjtcblxuZXhwb3J0IGNsYXNzIERhc2hib2FyZFBhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgcnVuczogbnVsbCxcbiAgICAgICAgICAgIHNwZWVkR3JhcGg6IHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsczogW10sXG4gICAgICAgICAgICAgICAgICAgIGRhdGFzZXRzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiTXkgU2Vjb25kIGRhdGFzZXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IFwicmdiYSgxNTEsMTg3LDIwNSwwLjIpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IFwicmdiYSgxNTEsMTg3LDIwNSwxKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50Q29sb3I6IFwicmdiYSgxNTEsMTg3LDIwNSwxKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50U3Ryb2tlQ29sb3I6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50SGlnaGxpZ2h0RmlsbDogXCIjZmZmXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRIaWdobGlnaHRTdHJva2U6IFwicmdiYSgxNTEsMTg3LDIwNSwxKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IFtdXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9wdHM6IHtcbiAgICAgICAgICAgICAgICAgICAgc2NhbGVMYWJlbDogZnVuY3Rpb24oIHZhbCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWwudmFsdWUgKyBcIiBrbS9oXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaXN0YW5jZUdyYXBoOiB7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhc2V0czogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIk15IFNlY29uZCBkYXRhc2V0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiBcInJnYmEoMTUxLDE4NywyMDUsMC4yKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZUNvbG9yOiBcInJnYmEoMTUxLDE4NywyMDUsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludENvbG9yOiBcInJnYmEoMTUxLDE4NywyMDUsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludFN0cm9rZUNvbG9yOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludEhpZ2hsaWdodEZpbGw6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50SGlnaGxpZ2h0U3Ryb2tlOiBcInJnYmEoMTUxLDE4NywyMDUsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvcHRzOiB7XG4gICAgICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IGZ1bmN0aW9uKCB2YWwgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsLnZhbHVlICsgXCIgbVwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdmFyIGRhdGUgPSAobmV3IERhdGUoKSk7XG4gICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIDcpO1xuICAgICAgICBkYXRlID0gZGF0ZS50b0lTT1N0cmluZygpLnN1YnN0cmluZygwLCAxMCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGUpO1xuXG4gICAgICAgICQuZ2V0KFwiL2FwaS9ydW5zX3NpbmNlX2RhdGUvXCIgKyBkYXRlLCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyAhPSBmYWxzZSkge1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB2YXIgc3BlZWRHcmFwaCA9IHRoaXMuc3RhdGUuc3BlZWRHcmFwaDtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdGFuY2VHcmFwaCA9IHRoaXMuc3RhdGUuZGlzdGFuY2VHcmFwaDtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICBydW5zOiByZXN1bHQucnVuc1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc3BlZWRHcmFwaC5kYXRhLmxhYmVscyA9IFtdO1xuICAgICAgICAgICAgICAgIHNwZWVkR3JhcGguZGF0YS5kYXRhc2V0c1swXS5kYXRhID0gW107XG4gICAgICAgICAgICAgICAgZGlzdGFuY2VHcmFwaC5kYXRhLmxhYmVscyA9IFtdO1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlR3JhcGguZGF0YS5kYXRhc2V0c1swXS5kYXRhID0gW107XG5cbiAgICAgICAgICAgICAgICBsZXQgY291bnRzID0gWzAsMCwwLDAsMCwwLDBdO1xuICAgICAgICAgICAgICAgIGxldCBzcGVlZHMgPSBbMCwwLDAsMCwwLDAsMF07XG4gICAgICAgICAgICAgICAgbGV0IGRpc3RhbmNlcyA9IFswLDAsMCwwLDAsMCwwXTtcblxuICAgICAgICAgICAgICAgIGxldCB3ZWVrZGF5cyA9IFtcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCJdO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQucnVucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcnVuID0gcmVzdWx0LnJ1bnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGxldCBtb21lbnQgPSB3aW5kb3cuYXBwLm1vbWVudCggcnVuLnN0YXJ0X3RpbWUgKiAxMDAwICk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXkgPSBtb21lbnQud2Vla2RheSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvdW50c1tkYXldKys7XG4gICAgICAgICAgICAgICAgICAgIHNwZWVkc1tkYXldICs9IHJ1bi5hdmVyYWdlX3NwZWVkO1xuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZXNbZGF5XSArPSBydW4uZGlzdGFuY2U7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDc7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBydW4gPSByZXN1bHQucnVuc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgc3BlZWRHcmFwaC5kYXRhLmxhYmVscy5wdXNoKHdlZWtkYXlzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNwZWVkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBjb3VudHNbaV0gPiAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3BlZWQgPSAoc3BlZWRzW2ldIC8gY291bnRzW2ldKSAqIDYwICogNjAgLyAxMDAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNwZWVkID0gc3BlZWQudG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAgICAgc3BlZWRHcmFwaC5kYXRhLmRhdGFzZXRzWzBdLmRhdGEucHVzaChzcGVlZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2VHcmFwaC5kYXRhLmxhYmVscy5wdXNoKHdlZWtkYXlzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRpc3RhbmNlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBjb3VudHNbaV0gPiAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBkaXN0YW5jZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBkaXN0YW5jZS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZUdyYXBoLmRhdGEuZGF0YXNldHNbMF0uZGF0YS5wdXNoKGRpc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgc3BlZWRHcmFwaDogc3BlZWRHcmFwaCxcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2VHcmFwaDogZGlzdGFuY2VHcmFwaCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG5cbiAgICAgICAgdmFyIHBpZUNoYXJ0RGF0YSA9ICBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IDMwMCxcbiAgICAgICAgICAgICAgICBjb2xvcjpcIiNGNzQ2NEFcIixcbiAgICAgICAgICAgICAgICBoaWdobGlnaHQ6IFwiI0ZGNUE1RVwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIlJlZFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhbHVlOiA1MCxcbiAgICAgICAgICAgICAgICBjb2xvcjogXCIjNDZCRkJEXCIsXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0OiBcIiM1QUQzRDFcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJHcmVlblwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhbHVlOiAxMDAsXG4gICAgICAgICAgICAgICAgY29sb3I6IFwiI0ZEQjQ1Q1wiLFxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodDogXCIjRkZDODcwXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiWWVsbG93XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICB2YXIgYmFyQ2hhcnRkYXRhID0ge1xuICAgICAgICAgICAgbGFiZWxzOiBbXCJKYW51YXJ5XCIsIFwiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCIsIFwiTWF5XCIsIFwiSnVuZVwiLCBcIkp1bHlcIl0sXG4gICAgICAgICAgICBkYXRhc2V0czogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiTXkgRmlyc3QgZGF0YXNldFwiLFxuICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IFwicmdiYSgyMjAsMjIwLDIyMCwwLjUpXCIsXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUNvbG9yOiBcInJnYmEoMjIwLDIyMCwyMjAsMC44KVwiLFxuICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRGaWxsOiBcInJnYmEoMjIwLDIyMCwyMjAsMC43NSlcIixcbiAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0U3Ryb2tlOiBcInJnYmEoMjIwLDIyMCwyMjAsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogWzY1LCA1OSwgODAsIDgxLCA1NiwgNTUsIDQwXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJNeSBTZWNvbmQgZGF0YXNldFwiLFxuICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IFwicmdiYSgxNTEsMTg3LDIwNSwwLjUpXCIsXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUNvbG9yOiBcInJnYmEoMTUxLDE4NywyMDUsMC44KVwiLFxuICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRGaWxsOiBcInJnYmEoMTUxLDE4NywyMDUsMC43NSlcIixcbiAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0U3Ryb2tlOiBcInJnYmEoMTUxLDE4NywyMDUsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogWzI4LCA0OCwgNDAsIDE5LCA4NiwgMjcsIDkwXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgcmFkYXJDaGFydERhdGEgPSB7XG4gICAgICAgICAgICBsYWJlbHM6IFtcIkVhdGluZ1wiLCBcIkRyaW5raW5nXCIsIFwiU2xlZXBpbmdcIiwgXCJEZXNpZ25pbmdcIiwgXCJDb2RpbmdcIiwgXCJDeWNsaW5nXCIsIFwiUnVubmluZ1wiXSxcbiAgICAgICAgICAgIGRhdGFzZXRzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJNeSBGaXJzdCBkYXRhc2V0XCIsXG4gICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogXCJyZ2JhKDIyMCwyMjAsMjIwLDAuMilcIixcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IFwicmdiYSgyMjAsMjIwLDIyMCwxKVwiLFxuICAgICAgICAgICAgICAgICAgICBwb2ludENvbG9yOiBcInJnYmEoMjIwLDIyMCwyMjAsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRTdHJva2VDb2xvcjogXCIjZmZmXCIsXG4gICAgICAgICAgICAgICAgICAgIHBvaW50SGlnaGxpZ2h0RmlsbDogXCIjZmZmXCIsXG4gICAgICAgICAgICAgICAgICAgIHBvaW50SGlnaGxpZ2h0U3Ryb2tlOiBcInJnYmEoMjIwLDIyMCwyMjAsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogWzY1LCA1OSwgOTAsIDgxLCA1NiwgNTUsIDQwXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJNeSBTZWNvbmQgZGF0YXNldFwiLFxuICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IFwicmdiYSgxNTEsMTg3LDIwNSwwLjIpXCIsXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUNvbG9yOiBcInJnYmEoMTUxLDE4NywyMDUsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRDb2xvcjogXCJyZ2JhKDE1MSwxODcsMjA1LDEpXCIsXG4gICAgICAgICAgICAgICAgICAgIHBvaW50U3Ryb2tlQ29sb3I6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgICAgICAgICBwb2ludEhpZ2hsaWdodEZpbGw6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgICAgICAgICBwb2ludEhpZ2hsaWdodFN0cm9rZTogXCJyZ2JhKDE1MSwxODcsMjA1LDEpXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IFsyOCwgNDgsIDQwLCAxOSwgOTYsIDI3LCAxMDBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBjb250ZW50ID0gbnVsbDtcblxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUucnVucyB8fCB0aGlzLnN0YXRlLnJ1bnMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgYWxlcnQgYWxlcnQtd2FybmluZ1wiIHJvbGU9XCJhbGVydFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiY2VudGVyLXRleHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBZb3UgaGF2ZW4ndCBhZGRlZCBhbnkgcnVuIGRhdGEgdGhpcyB3ZWVrLCB3aGVuIHlvdSBpbXBvcnQgYSBuZXcgcnVuIHlvdSdsbCBiZSBhYmxlIHRvIHNlZSBpbmZvcm1hdGlvbiBhYm91dCB5b3VyIGZpdG5lc3MgaGVyZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2VudGVyLXRleHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TW9kYWxUcmlnZ2VyIG1vZGFsPXs8SW1wb3J0RGF0YU1vZGFsIC8+fSBidXR0b249e3RydWV9IGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBuYXZiYXItYnRuIG1hcmdpbi1sZWZ0IG1hcmdpbi1yaWdodFwiIGJ1dHRvblRleHQ9ezxVcGxvYWREYXRhQnV0dG9uIC8+fSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxNYWluTmF2YmFyIC8+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAge2NvbnRlbnR9XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMj5SZWNlbnQgUnVuczwvaDI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+U3RhcnQgVGltZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkR1cmF0aW9uPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+RGlzdGFuY2UgQ292ZXJlZDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkFjdGlvbjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJ1bnMgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJ1bnMubWFwKCBmdW5jdGlvbihydW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3dpbmRvdy5hcHAubW9tZW50KHJ1bi5zdGFydF90aW1lICogMTAwMCkuZm9ybWF0KHdpbmRvdy5hcHAudGltZUZvcm1hdCl9IHt3aW5kb3cuYXBwLm1vbWVudChydW4uc3RhcnRfdGltZSAqIDEwMDApLmZvcm1hdCh3aW5kb3cuYXBwLmRheUZvcm1hdCl9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnsgcGFyc2VJbnQocnVuLmR1cmF0aW9uIC8gNjApIH0gbWlucyB7cnVuLmR1cmF0aW9uICUgNjB9IHNlY29uZHM8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e01hdGgucm91bmQocnVuLmRpc3RhbmNlKX0gbTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48YSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBocmVmPXtcIi9ydW4vXCIgKyBydW4uX2lkfT48aSBjbGFzc05hbWU9XCJpb24gaW9uLWV5ZVwiIC8+PC9hPjwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pIDogXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyPkF2ZXJhZ2UgU3BlZWQgT3ZlciBUaGUgUGFzdCBXZWVrPC9oMj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluZUNoYXJ0IGRhdGE9e3RoaXMuc3RhdGUuc3BlZWRHcmFwaC5kYXRhfSBvcHRzPXt0aGlzLnN0YXRlLnNwZWVkR3JhcGgub3B0c30gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMj5EaXN0YW5jZSBDb3ZlcmVkIE92ZXIgVGhlIFBhc3QgV2VlazwvaDI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPExpbmVDaGFydCBkYXRhPXt0aGlzLnN0YXRlLmRpc3RhbmNlR3JhcGguZGF0YX0gb3B0cz17dGhpcy5zdGF0ZS5kaXN0YW5jZUdyYXBoLm9wdHN9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQge01haW5OYXZiYXJ9IGZyb20gXCJjb21wb25lbnRzL01haW5OYXZiYXIuanN4XCI7XG5cbi8qXG4gKiBTaW1wbGUgcGFnZSBzZXJ2ZWQgd2hlbiBhIHJvdXRlIGNhbm5vdCBiZSBmb3VuZC5cbiAqL1xuZXhwb3J0IGNsYXNzIEZpbGVOb3RGb3VuZFBhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPE1haW5OYXZiYXIgLz5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8aDE+NDA0PC9oMT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7Qm9keX0gZnJvbSBcImNvbXBvbmVudHMvQm9keS5qc3hcIjtcbmltcG9ydCB7TW9kYWxUcmlnZ2VyfSBmcm9tIFwiY29tcG9uZW50cy9Nb2RhbFRyaWdnZXIuanN4XCI7XG5pbXBvcnQge1NoYXJlUnVuTW9kYWx9IGZyb20gXCJjb21wb25lbnRzL1NoYXJlUnVuTW9kYWwuanN4XCI7XG5pbXBvcnQge01haW5OYXZiYXJ9IGZyb20gXCJjb21wb25lbnRzL01haW5OYXZiYXIuanN4XCI7XG5pbXBvcnQge01hcH0gZnJvbSBcImNvbXBvbmVudHMvTWFwLmpzeFwiO1xuaW1wb3J0IHtMaW5lQ2hhcnR9IGZyb20gXCJjb21wb25lbnRzL0xpbmVDaGFydC5qc3hcIjtcblxuZXhwb3J0IGNsYXNzIFJ1bkRhdGFQYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIHJ1bjogZmFsc2UsXG4gICAgICAgICAgICBjaGFydERhdGE6IHtcbiAgICAgICAgICAgICAgICBsYWJlbHM6IFtcIkphbnVhcnlcIiwgXCJGZWJydWFyeVwiLCBcIk1hcmNoXCIsIFwiQXByaWxcIiwgXCJNYXlcIiwgXCJKdW5lXCIsIFwiSnVseVwiXSxcbiAgICAgICAgICAgICAgICBkYXRhc2V0czogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJNeSBGaXJzdCBkYXRhc2V0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IFwicmdiYSgxNTEsMTg3LDIwNSwwLjIpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VDb2xvcjogXCJyZ2JhKDE1MSwxODcsMjA1LDEpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludENvbG9yOiBcInJnYmEoMTUxLDE4NywyMDUsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50U3Ryb2tlQ29sb3I6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRIaWdobGlnaHRGaWxsOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50SGlnaGxpZ2h0U3Ryb2tlOiBcInJnYmEoMTUxLDE4NywyMDUsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IFs2NSwgNTksIDgwLCA4MSwgNTYsIDU1LCA0MF1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGFydE9wdHM6IHtcbiAgICAgICAgICAgICAgICBzY2FsZVNob3dHcmlkTGluZXMgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkYXRhc2V0RmlsbCA6IHRydWUsXG4gICAgICAgICAgICAgICAgc2NhbGVTaG93SG9yaXpvbnRhbExpbmVzOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNjYWxlU2hvd1ZlcnRpY2FsTGluZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgc2hvd1Rvb2x0aXBzOiB0cnVlLFxuICAgICAgICAgICAgICAgIHBvaW50SGl0RGV0ZWN0aW9uUmFkaXVzIDogMSxcbiAgICAgICAgICAgICAgICBzY2FsZUxhYmVsOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUudmFsdWUgKyBcIiBrbS9oclwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0b29sdGlwVGVtcGxhdGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoICh2YWx1ZS52YWx1ZSkudG9GaXhlZCggMSApICsgXCIga20vaHJcIiApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAkLmdldChcIi9hcGkvcnVuL1wiICsgdGhpcy5wcm9wcy5ydW5JZCwgZnVuY3Rpb24ocmVzdWx0KSB7XG5cbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyAhPSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICBydW46IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5zdGF0ZS5jaGFydERhdGE7XG4gICAgICAgICAgICAgICAgdmFyIGxhYmVscyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzcGVlZHMgPSBbXTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHByZXR0eV9wcmludF90aW1lKCBzZWNvbmRzICkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IoIHNlY29uZHMgLyA2MCApICUgNjA7XG4gICAgICAgICAgICAgICAgICAgIGxldCBob3VycyA9IE1hdGguZmxvb3IoIHNlY29uZHMgLyAzNjAwICkgJSAyNDtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgc3RyID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBob3VycyA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gaG91cnMgKyBcImggXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3RyICs9IG1pbnV0ZXMgKyBcIm1cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgaW50ZXJ2YWwgPSBwYXJzZUludCggcmVzdWx0LnNwZWVkX2dyYXBoLngubGVuZ3RoIC8gMTAgKTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0LnNwZWVkX2dyYXBoLngubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxhYmVsID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBpICUgaW50ZXJ2YWwgPT0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsID0gcHJldHR5X3ByaW50X3RpbWUoIHBhcnNlSW50KCByZXN1bHQuc3BlZWRfZ3JhcGgueFtpXSApICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggbGFiZWwgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsYWJlbHMucHVzaChsYWJlbCk7XG4gICAgICAgICAgICAgICAgICAgIHNwZWVkcy5wdXNoKHJlc3VsdC5zcGVlZF9ncmFwaC55W2ldICogNjAgKiA2MCAvIDEwMDApOyAvLyB0byBrbXBoXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZGF0YS5sYWJlbHMgPSBsYWJlbHM7XG4gICAgICAgICAgICAgICAgZGF0YS5kYXRhc2V0c1swXS5kYXRhID0gc3BlZWRzO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7Y2hhcnREYXRhOiBkYXRhfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBzaGFyZVJ1bihlKSB7XG4gICAgICAgIHZhciBtYXBVcmwgPSB0aGlzLnJlZnMubWFwLmdldFN0YXRpY1VybCgpO1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSB0aGlzLmltZ3VyVXBsb2FkLmJpbmQodGhpcyk7XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgICAgICAgdXJsOiBcImh0dHBzOi8vYXBpLmltZ3VyLmNvbS8zL2ltYWdlXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQ2xpZW50LUlEIGQ4ZjU5MDM5YmRiOWZhZCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgaW1hZ2U6IG1hcFVybFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGNhbGxiYWNrXG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW1ndXJVcGxvYWQoZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bWFwVXJsOiBkYXRhW1wiZGF0YVwiXVtcImxpbmtcIl0sIHNoYXJpbmdSdW46IHRydWV9KTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG5cbiAgICAgICAgdmFyIGJvZHkgPSAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgIDxwPlRoaXMgcnVuIGRvZXMgbm90IGV4aXN0LjwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuXG4gICAgICAgIHZhciBtb2RhbCA9IDxTaGFyZVJ1bk1vZGFsIHJlZj1cIm1vZGFsXCIgaW1hZ2VVcmw9e3RoaXMuc3RhdGUubWFwVXJsfSAvPjtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNoYXJpbmdSdW4pIHtcbiAgICAgICAgICAgIG1vZGFsID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLnJ1bikge1xuICAgICAgICAgICAgYm9keSA9IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImZ1bGwtd2lkdGhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBZb3VyIFJ1biA8c21hbGw+e3dpbmRvdy5hcHAubW9tZW50KHRoaXMuc3RhdGUucnVuLnN0YXJ0X3RpbWUgKiAxMDAwKS5mb3JtYXQod2luZG93LmFwcC5kYXlGb3JtYXQpfTwvc21hbGw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgZmxvYXQtcmlnaHRcIiBvbkNsaWNrPXt0aGlzLnNoYXJlUnVuLmJpbmQodGhpcyl9PlNoYXJlIFJ1bjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9oMT5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IG1hcmdpbi10b3BcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTMgY2VudGVyLXRleHRcIj48aDM+VG90YWwgRGlzdGFuY2U8L2gzPiB7TWF0aC5yb3VuZCh0aGlzLnN0YXRlLnJ1bi5kaXN0YW5jZSl9IG08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTMgY2VudGVyLXRleHRcIj48aDM+QXZlcmFnZSBTcGVlZDwvaDM+IHsodGhpcy5zdGF0ZS5ydW4uYXZlcmFnZV9zcGVlZCAqIDYwICogNjAgLyAxMDAwKS50b0ZpeGVkKDIpfSBrbS9oPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC0zIGNlbnRlci10ZXh0XCI+PGgzPkR1cmF0aW9uPC9oMz4geyBwYXJzZUludCh0aGlzLnN0YXRlLnJ1bi5kdXJhdGlvbiAvIDYwKSB9IG1pbnMge3RoaXMuc3RhdGUucnVuLmR1cmF0aW9uICUgNjB9IHNlY29uZHM8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTMgY2VudGVyLXRleHRcIj48aDM+S2lsb2pvdWxlcyBCdXJuZWQ8L2gzPntNYXRoLnJvdW5kKHRoaXMuc3RhdGUucnVuLmtpbG9qb3VsZXMpfSBrajwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGhyIC8+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8TWFwIHJlZj1cIm1hcFwiIHdheXBvaW50cz17dGhpcy5zdGF0ZS5ydW4ud2F5cG9pbnRzfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAge21vZGFsfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8aHIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNlbnRlci10ZXh0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgzPllvdXIgU3BlZWQgQnJlYWtkb3duPC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluZUNoYXJ0IGRhdGE9e3RoaXMuc3RhdGUuY2hhcnREYXRhfSBvcHRzPXt0aGlzLnN0YXRlLmNoYXJ0T3B0c30gd2lkdGg9ezExNDB9IGhlaWdodD17MjQwfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxNYWluTmF2YmFyIC8+XG4gICAgICAgICAgICAgICAge2JvZHl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQge0JvZHl9IGZyb20gXCJjb21wb25lbnRzL0JvZHkuanN4XCI7XG5pbXBvcnQge0xpbmVDaGFydH0gZnJvbSBcImNvbXBvbmVudHMvTGluZUNoYXJ0LmpzeFwiO1xuaW1wb3J0IHtCYXJDaGFydH0gZnJvbSBcImNvbXBvbmVudHMvQmFyQ2hhcnQuanN4XCI7XG5pbXBvcnQge1JhZGFyQ2hhcnR9IGZyb20gXCJjb21wb25lbnRzL1JhZGFyQ2hhcnQuanN4XCI7XG5pbXBvcnQge1BpZUNoYXJ0fSBmcm9tIFwiY29tcG9uZW50cy9QaWVDaGFydC5qc3hcIjtcbmltcG9ydCB7TWFpbk5hdmJhcn0gZnJvbSBcImNvbXBvbmVudHMvTWFpbk5hdmJhci5qc3hcIjtcbmltcG9ydCB7TW9kYWxUcmlnZ2VyfSBmcm9tIFwiY29tcG9uZW50cy9Nb2RhbFRyaWdnZXIuanN4XCI7XG5pbXBvcnQge0ltcG9ydERhdGFNb2RhbH0gZnJvbSBcImNvbXBvbmVudHMvSW1wb3J0RGF0YU1vZGFsLmpzeFwiO1xuXG5leHBvcnQgY2xhc3MgUnVuSGlzdG9yeVBhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgcnVuczogbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlUnVucygpO1xuICAgIH1cblxuICAgIHVwZGF0ZVJ1bnMoKSB7XG4gICAgICAgICQuZ2V0KFwiL2FwaS9hbGxfcnVuc1wiLCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyAhPSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICBydW5zOiByZXN1bHRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBkZWxldGVSdW4ocnVuLCBlKSB7XG4gICAgICAgIC8vIHRoaXMgaXMgYm91bmQgdG8gdGhlIHJ1biBpbnN0YW5jZVxuXG4gICAgICAgIGlmIChjb25maXJtKFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIHJ1bj9cIikpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJ1bik7XG5cbiAgICAgICAgICAgICQuZ2V0KFwiL2FwaS9kZWxldGVfcnVuL1wiICsgcnVuLl9pZFtcIiRvaWRcIl0sIGZ1bmN0aW9uKHJlc3VsdCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzICE9IGZhbHNlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVSdW5zKCk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ291bGQgbm90IGRlbGV0ZSBydW4uXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8TWFpbk5hdmJhciAvPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMj5SdW4gSGlzdG9yeTwvaDI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+U3RhcnQgVGltZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkVuZCBUaW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+QWN0aW9uPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucnVucyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucnVucy5tYXAoIGZ1bmN0aW9uKHJ1bikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57d2luZG93LmFwcC5tb21lbnQocnVuLnN0YXJ0X3RpbWUgKiAxMDAwKS5mb3JtYXQod2luZG93LmFwcC50aW1lRm9ybWF0KX0ge3dpbmRvdy5hcHAubW9tZW50KHJ1bi5zdGFydF90aW1lICogMTAwMCkuZm9ybWF0KHdpbmRvdy5hcHAuZGF5Rm9ybWF0KX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3dpbmRvdy5hcHAubW9tZW50KHJ1bi5lbmRfdGltZSAqIDEwMDApLmZvcm1hdCh3aW5kb3cuYXBwLnRpbWVGb3JtYXQpfSB7d2luZG93LmFwcC5tb21lbnQocnVuLmVuZF90aW1lICogMTAwMCkuZm9ybWF0KHdpbmRvdy5hcHAuZGF5Rm9ybWF0KX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBocmVmPXtcIi9ydW4vXCIgKyBydW4uX2lkW1wiJG9pZFwiXX0+PGkgY2xhc3NOYW1lPVwiaW9uIGlvbi1leWVcIiAvPjwvYT4gPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBvbkNsaWNrPXt0aGlzLmRlbGV0ZVJ1bi5iaW5kKHRoaXMsIHJ1bil9PjxpIGNsYXNzTmFtZT1cImlvbiBpb24tdHJhc2gtYlwiIC8+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSkgOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7RGFzaGJvYXJkUGFnZX0gZnJvbSBcInBhZ2VzL0Rhc2hib2FyZFBhZ2UuanN4XCI7XG5pbXBvcnQge3RyYW5zaXRpb259IGZyb20gXCJwYWdlcy9jb250cm9sbGVycy9QYWdlVHJhbnNpdGlvbi5qc3hcIjtcblxuLypcbiAqIEhhbmRsZXMgdHJhbnNpdGlvbiB0byB0aGUgZGFzaGJvYXJkIHBhZ2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBEYXNoYm9hcmRDb250cm9sbGVyKGN0eCwgbmV4dCkge1xuICAgIHRyYW5zaXRpb24oY3R4LCBuZXh0LCA8RGFzaGJvYXJkUGFnZSAvPik7XG59XG4iLCJpbXBvcnQge0ZpbGVOb3RGb3VuZFBhZ2V9IGZyb20gXCJwYWdlcy9GaWxlTm90Rm91bmRQYWdlLmpzeFwiO1xuaW1wb3J0IHt0cmFuc2l0aW9ufSBmcm9tIFwicGFnZXMvY29udHJvbGxlcnMvUGFnZVRyYW5zaXRpb24uanN4XCI7XG5cbi8qXG4gKiBIYW5kbGVzIHRyYW5zaXRpb24gdG8gdGhlIDQwNCBwYWdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gRmlsZU5vdEZvdW5kQ29udHJvbGxlcihjdHgsIG5leHQpIHtcbiAgICB0cmFuc2l0aW9uKGN0eCwgbmV4dCwgPEZpbGVOb3RGb3VuZFBhZ2UgLz4pO1xufVxuIiwiLypcbiAqIEhhbmRsZXMgdGhlIHRyYW5zaXRpb24gZnJvbSBvbmUgcGFnZSB0byB0aGUgbmV4dC5cbiAqIE1vdW50cyB0aGUgbmV3IGNvbXBvbmVudCwgYW5kIHJlbW92ZXMgdGhlIHByZXZpb3VzIG9uY2VcbiAqIHRoZSBwYWdlIGhhcyBiZWVuIGFuaW1hdGVkIGluLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNpdGlvbihjdHgsIG5leHQsIGNvbXBvbmVudCkge1xuICAgIGlmICghY3R4LmluaXQpIHtcbiAgICAgICAgd2luZG93LmFwcC5tb3VudFBvaW50LmNsYXNzTGlzdC5hZGQoJ3RyYW5zaXRpb24nKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgd2luZG93LmFwcC5tb3VudFBvaW50LmNsYXNzTGlzdC5yZW1vdmUoJ3RyYW5zaXRpb24nKTtcbiAgICAgICAgfSwgMzUwKTtcbiAgICB9XG5cbiAgICBSZWFjdC5yZW5kZXIoY29tcG9uZW50LCB3aW5kb3cuYXBwLm1vdW50UG9pbnQpO1xufVxuIiwiaW1wb3J0IHtSdW5EYXRhUGFnZX0gZnJvbSBcInBhZ2VzL1J1bkRhdGFQYWdlLmpzeFwiO1xuaW1wb3J0IHt0cmFuc2l0aW9ufSBmcm9tIFwicGFnZXMvY29udHJvbGxlcnMvUGFnZVRyYW5zaXRpb24uanN4XCI7XG5cbi8qXG4gKiBIYW5kbGVzIHRyYW5zaXRpb24gdG8gdGhlIHJ1biBkYXRhIHBhZ2UuIEFjY2VwdHMgYSBydW4gSUQgYXNcbiAqIGEgcGFyYW1ldGVyLCB3aGljaCBpcyBwYXNzZWQgdG8gdGhlIHBhZ2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBSdW5EYXRhQ29udHJvbGxlcihjdHgsIG5leHQpIHtcbiAgICB0cmFuc2l0aW9uKGN0eCwgbmV4dCwgPFJ1bkRhdGFQYWdlIHJ1bklkPXtjdHgucGFyYW1zLnJ1bn0vPik7XG59XG4iLCJpbXBvcnQge1J1bkhpc3RvcnlQYWdlfSBmcm9tIFwicGFnZXMvUnVuSGlzdG9yeVBhZ2UuanN4XCI7XG5pbXBvcnQge3RyYW5zaXRpb259IGZyb20gXCJwYWdlcy9jb250cm9sbGVycy9QYWdlVHJhbnNpdGlvbi5qc3hcIjtcblxuLypcbiAqIEhhbmRsZXMgdHJhbnNpdGlvbiB0byB0aGUgcnVuIGhpc3RvcnkgcGFnZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFJ1bkhpc3RvcnlDb250cm9sbGVyKGN0eCwgbmV4dCkge1xuICAgIHRyYW5zaXRpb24oY3R4LCBuZXh0LCA8UnVuSGlzdG9yeVBhZ2UgLz4pO1xufVxuIl19
