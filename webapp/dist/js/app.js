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

},{"./pages/controllers/DashboardController.jsx":26,"./pages/controllers/FileNotFoundController.jsx":27,"./pages/controllers/RunDataController.jsx":29,"./pages/controllers/RunHistoryController.jsx":30,"Router.jsx":8,"moment":4}],2:[function(require,module,exports){
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

},{"page":5,"pages/FileNotFoundPage.jsx":23}],9:[function(require,module,exports){
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

/**
 * A generic bar chart component using Chartjs
 *
 * Data and options are passed as properties.
 */

var BarChart = exports.BarChart = (function (_React$Component) {
    function BarChart() {
        _classCallCheck(this, BarChart);
    }

    _inherits(BarChart, _React$Component);

    _createClass(BarChart, {
        createChart: {

            /**
             * Initialise the chart in the DOM.
             */

            value: function createChart() {
                var context = $(React.findDOMNode(this)).find(".chart")[0].getContext("2d");

                this.chart = new ChartJs(context).Bar(this.props.data, this.props.opts);
            }
        },
        componentDidMount: {
            value: function componentDidMount() {
                // Create the chart on mount
                this.createChart();
            }
        },
        componentWillUpdate: {
            value: function componentWillUpdate() {
                // If the data updates, refresh the chart by recreating it
                this.chart.destroy();
                this.createChart();
            }
        },
        render: {
            value: function render() {

                // Just a simple div with a canvas to render the chart into
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

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * The import data modal is used to allow the user to upload new data from the
 * device. The device password can be entered and progress can be observed
 * through various prompts.
 */

var ImportDataModal = exports.ImportDataModal = (function (_React$Component) {
    function ImportDataModal(props) {
        _classCallCheck(this, ImportDataModal);

        _get(Object.getPrototypeOf(ImportDataModal.prototype), "constructor", this).call(this, props);

        // intialise the state
        this.state = {
            importFailed: false,
            importInProgress: false,
            attemptedImport: false
        };
    }

    _inherits(ImportDataModal, _React$Component);

    _createClass(ImportDataModal, {
        passwordChange: {

            /**
             * Called when the password field updates
             * @param  Event e
             */

            value: function passwordChange(e) {
                // Store the password in the state for use later
                this.setState({
                    password: e.target.value
                });
            }
        },
        beginDataImport: {

            /**
             * Called when an import is triggered, POSTs a request to the server
             * and returns either success or failure depending on the device
             * status.
             */

            value: function beginDataImport() {

                // Update the state for display
                this.setState({ importInProgress: true, attemptedImport: true });

                // Request w/ password
                $.post("/api/import_data", { password: this.state.password }, (function (result) {

                    if (result.success) {
                        // Update the state for display
                        this.setState({ importFailed: false });

                        // Wait a second, then refresh the page
                        setTimeout(function () {
                            window.location.reload();
                        }, 500);
                    } else {

                        // Display the error message to the user
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

                // Before an import is started, this is the modal content
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

                // If an import fails
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

                // While an import is in progress
                var importInProgress = [React.createElement(
                    "div",
                    { className: "alert alert-info", role: "alert" },
                    "Import processing..."
                )];

                // If an import succeeds
                var successImportBody = [React.createElement(
                    "div",
                    { className: "alert alert-success", role: "alert" },
                    "Import succeeded!"
                )];

                var body;

                // State machine for determining which view to use
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

},{}],12:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});
var ChartJs = require("chart.js");

/**
 * A generic line chart component using Chartjs
 *
 * Data and options are passed as properties.
 */

var LineChart = exports.LineChart = (function (_React$Component) {
    function LineChart() {
        _classCallCheck(this, LineChart);

        this.chart = null;
    }

    _inherits(LineChart, _React$Component);

    _createClass(LineChart, {
        createChart: {

            /**
             * Initialise the chart in the DOM.
             */

            value: function createChart() {
                var context = $(React.findDOMNode(this)).find(".chart")[0].getContext("2d");
                this.chart = new ChartJs(context).Line(this.props.data, this.props.opts);
            }
        },
        componentDidMount: {
            value: function componentDidMount() {
                // Create the chart on mount
                this.createChart();
            }
        },
        componentWillUpdate: {
            value: function componentWillUpdate() {
                // If the data updates, refresh the chart by recreating it
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

},{"chart.js":3}],13:[function(require,module,exports){
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

/**
 * The main navigation bar displayed at the top of every page within the
 * application.
 */

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

                // Pass the navigation array into the generic navbar
                var links = [{
                    name: "Dashboard",
                    icon: "ion-ios-home",
                    url: "/dashboard",
                    click: function click() {},
                    context: this,
                    button: false
                }, {
                    name: "Run History",
                    icon: "ion-stats-bars",
                    url: "/history",
                    click: function click() {},
                    context: this,
                    button: false
                }];

                return React.createElement(Navbar, { links: links });
            }
        }
    });

    return MainNavbar;
})(React.Component);

},{"components/ImportDataModal.jsx":11,"components/ModalTrigger.jsx":15,"components/Navbar.jsx":16,"components/UploadDataButton.jsx":21}],14:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 * The map component is used on the run display page, it is responsible
 * for displaying the path a user took during their journey with
 * appropriate speed colour coding.
 *
 * The component can also generate a static image URL for sharing purposes.
 */

var Map = exports.Map = (function (_React$Component) {
    function Map() {
        _classCallCheck(this, Map);

        // Used in static url generation
        this.initStaticMapStrings();
    }

    _inherits(Map, _React$Component);

    _createClass(Map, {
        getStaticUrl: {

            /**
             * Generate the maps static URL for the currently displayed map
             * @return string Map URL
             */

            value: function getStaticUrl() {
                var staticMapUrl = "https://maps.googleapis.com/maps/api/staticmap?" + this.defaultOptsString + "&" + this.centerString + "&" + this.zoomString + "&" + this.runPathString + "&" + this.markerString;

                return staticMapUrl;
            }
        },
        computeRunPath: {

            /**
             * Translate our internal waypoint format into the Google maps
             * concept of latlon pairs.
             * @param  Array waypoints List of coordinate pairs describing the run
             * @param  Bounds bounds    The map bounds
             * @return Array A list of Google formatted run points
             */

            value: function computeRunPath(waypoints, bounds) {
                var runPath = [];

                for (var i = 0; i < waypoints.length; i++) {
                    var point = new google.maps.LatLng(waypoints[i].lat, waypoints[i].lon);

                    runPath.push(point);
                    // Used to compute the viewing window for the map
                    // Need to include all points in the run
                    bounds.extend(point);
                }

                return runPath;
            }
        },
        updateRunPathString: {

            /**
             * Generate the sting representation of a run for use in the static
             * Google Maps image.
             * @param  Array runPath A list of Google Maps compatible points
             */

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

            /**
             * Generate the string describing the markers to be placed on a
             * static Google Maps image.
             * @param  Coordinate start
             * @param  Coordinate end
             */

            value: function updateMarkerString(start, end) {
                this.markerString = "markers=color:blue|" + start.A + "," + start.F + "|" + end.A + "," + end.F;
            }
        },
        mapZoomHandler: {

            /**
             * Generate the string describing the zoom level for the static Google
             * Maps image.
             * @param  Map map Current map instance
             */

            value: function mapZoomHandler(map, e) {
                this.zoomString = "zoom=" + map.zoom;
            }
        },
        mapCenterHandler: {

            /**
             * Generate the string describing the centre of the map for the static
             * Google Maps image.
             * @param  Map map Current image instance
             */

            value: function mapCenterHandler(map, e) {
                this.centerString = "center=" + map.center.A + "," + map.center.F;
            }
        },
        initStaticMapStrings: {

            /**
             * Generate the base for the static map string, when generating a new
             * image.
             */

            value: function initStaticMapStrings() {
                this.defaultOptsString = "size=1168x480&maptype=roadmap";
            }
        },
        createRunPathPolyline: {

            /**
             * Create a polyline annotation on a given Map instance given a runPath
             * and a list of waypoints.
             * @param  Map map
             * @param  Array waypoints
             * @param  Array runPath
             */

            value: function createRunPathPolyline(map, waypoints, runPath) {
                var runPathPolyLine;

                for (var i = 0; i < waypoints.length - 1; i++) {

                    // Move along the path and compute the distance between each point
                    var dx = parseFloat(waypoints[i].lat) - parseFloat(waypoints[i + 1].lat);

                    var dy = parseFloat(waypoints[i].lon) - parseFloat(waypoints[i + 1].lon);

                    var dist = Math.sqrt(dx * dx + dy * dy) * 1000;

                    // Since datapoints are evenly spaced, we can use distance to
                    // imply the speed between each point pair

                    // Multiply the distance to give a constant we can use in colour
                    // generation
                    dist *= 600;

                    if (dist > 230) {
                        dist = 230;
                    }
                    if (dist < 20) {
                        dist = 20;
                    }

                    // Generate the colour for this line segment
                    var r, g, b;
                    r = parseInt(255 - dist);
                    g = parseInt(dist);
                    b = 20;

                    // Create a new line segment between the given points,
                    // with our computed colour
                    runPathPolyLine = new google.maps.Polyline({
                        path: [runPath[i], runPath[i + 1]],
                        geodesic: true,
                        strokeColor: "rgba(" + r + ", " + g + ", " + b + ", 1)",
                        strokeOpacity: 1,
                        strokeWeight: 3
                    });

                    // Apply to map
                    runPathPolyLine.setMap(map);
                }
            }
        },
        placeMarkers: {

            /**
             * Place the start and end flags on a given Map instance.
             * @param  Map map
             * @param  Array waypoints
             * @param  Array runPath
             */

            value: function placeMarkers(map, waypoints, runPath) {
                var _this = this;

                // Image paths for use later
                var startImage = "/img/start.png";
                var endImage = "/img/end.png";
                var nodeImage = "/img/blank.png";
                var icon;

                for (var i = 0; i < runPath.length; i++) {
                    var marker;

                    (function () {

                        // Only use images at the start and end of the run
                        if (i == 0) {
                            icon = startImage;
                        } else if (i == runPath.length - 1) {
                            icon = endImage;
                        } else {
                            // Node images are blank
                            icon = nodeImage;
                        }

                        // Store the waypoint instance for use in a callback
                        var wp = _this.props.waypoints[i];

                        // Create our base marker before wiring up events
                        marker = new google.maps.Marker({
                            position: runPath[i],
                            map: map,
                            title: "Title Test",
                            icon: icon
                        });

                        // Scope the callbacks correctly
                        (function (marker) {
                            // Display the time of a datapoint on hover
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
                // Initial bounds
                var bounds = new google.maps.LatLngBounds();
                // Process run
                var runPath = this.computeRunPath(this.props.waypoints, bounds);

                // Map display options
                var mapOptions = {
                    mapTypeId: google.maps.MapTypeId.TERRAIN
                };

                // Render the map
                var map = new google.maps.Map($(React.findDOMNode(this)).find(".map-canvas")[0], mapOptions);

                // Store map reference
                this.map = map;
                map.fitBounds(bounds);

                // Add listeners for zoom and center
                google.maps.event.addListenerOnce(map, "zoom_changed", this.mapZoomHandler.bind(this, map));
                google.maps.event.addListenerOnce(map, "center_changed", this.mapCenterHandler.bind(this, map));

                // Set markers to start and end points
                this.updateMarkerString(runPath[0], runPath[runPath.length - 1]);
                this.updateRunPathString(runPath);

                // Render polyline and markers on map
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

},{}],15:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Modal triggers can be used to open a Bootstrap modal on click of either
 * a link or button.
 */

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

            /**
             * Trigger the embedded modal within the component.
             *
             * This is called by a click usually.
             */

            value: function triggerModal(e) {
                e.preventDefault();

                React.render(this.props.modal, $("#modal_mount")[0]);
                $("#modal_mount").find(".modal").modal("show");
            }
        },
        render: {
            value: function render() {

                var inner;

                // Render either a button or a link depending on the prop value
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

},{}],16:[function(require,module,exports){
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

/**
 * A generic navbar class based on the bootstrap navbar structure.
 *
 * Links can be proved as an array of various option objects.
 */

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

/* Mobile menu */ /* Link list */ /* Other options, such as settings and import */

},{"./AppSettingsModal.jsx":9,"./ModalTrigger.jsx":15,"components/ImportDataModal.jsx":11,"components/UploadDataButton.jsx":21}],17:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});
var ChartJs = require("chart.js");

/**
 * A generic pie chart component using Chartjs
 *
 * Data and options are passed as properties.
 */

var PieChart = exports.PieChart = (function (_React$Component) {
    function PieChart() {
        _classCallCheck(this, PieChart);
    }

    _inherits(PieChart, _React$Component);

    _createClass(PieChart, {
        createChart: {

            /**
             * Initialise the chart in the DOM.
             */

            value: function createChart() {
                var context = $(React.findDOMNode(this)).find(".chart")[0].getContext("2d");
                this.chart = new ChartJs(context).Pie(this.props.data, this.props.opts);
            }
        },
        componentDidMount: {
            value: function componentDidMount() {
                // Create the chart on mount
                this.createChart();
            }
        },
        componentWillUpdate: {
            value: function componentWillUpdate() {
                // If the data updates, refresh the chart by recreating it
                this.chart.destroy();
                this.createChart();
            }
        },
        render: {
            value: function render() {

                // Just a simple div with a canvas to render the chart into
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

},{"chart.js":3}],18:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});
var ChartJs = require("chart.js");

/**
 * A generic radar chart component using Chartjs
 *
 * Data and options are passed as properties.
 */

var RadarChart = exports.RadarChart = (function (_React$Component) {
    function RadarChart() {
        _classCallCheck(this, RadarChart);
    }

    _inherits(RadarChart, _React$Component);

    _createClass(RadarChart, {
        createChart: {

            /**
             * Initialise the chart in the DOM.
             */

            value: function createChart() {
                var context = $(React.findDOMNode(this)).find(".chart")[0].getContext("2d");
                this.chart = new ChartJs(context).Radar(this.props.data, this.props.opts);
            }
        },
        componentDidMount: {
            value: function componentDidMount() {
                // Create the chart on mount
                this.createChart();
            }
        },
        componentWillUpdate: {
            value: function componentWillUpdate() {
                // If the data updates, refresh the chart by recreating it
                this.chart.destroy();
                this.createChart();
            }
        },
        render: {
            value: function render() {

                // Just a simple div with a canvas to render the chart into
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

},{"chart.js":3}],19:[function(require,module,exports){
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

/**
 * A modal displayed when a user opts to share their run to either Facebook
 * or Twitter.
 */

var ShareRunModal = exports.ShareRunModal = (function (_React$Component) {
    function ShareRunModal() {
        _classCallCheck(this, ShareRunModal);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(ShareRunModal, _React$Component);

    _createClass(ShareRunModal, {
        componentDidMount: {
            value: function componentDidMount() {

                // Show the modal when the component is created
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

/* Display image and sharing controls */

},{"components/SocialSharing.jsx":20}],20:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Social sharing buttons that automatically trigger API requests
 * using the provided URL and message.
 */

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
                // Create and mount the button as per API instructions
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
                // HTML as given in API
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

                // Create and mount the button as per API instructions
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
                // HTML as given in API
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

},{}],21:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Opens the Import Data Modal when clicked
 */

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

},{}],22:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

/*
 * Renders the main dashboard for the application.
 */

var DashboardPage = exports.DashboardPage = (function (_React$Component) {
    function DashboardPage() {
        _classCallCheck(this, DashboardPage);

        /* Initialise the state of the page. */
        this.state = {
            runs: null,
            /* Graph to show the average speed each day of the last week. */
            speedGraph: {
                data: {
                    labels: [],
                    datasets: [{
                        label: "Speed",
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: []
                    }]
                },
                /* Show the units of km/h for data points. */
                opts: {
                    scaleLabel: function scaleLabel(val) {
                        return val.value + " km/h";
                    }
                }
            },
            /* Graph to show the total distance run each day of the last week. */
            distanceGraph: {
                data: {
                    labels: [],
                    datasets: [{
                        label: "Distance",
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: []
                    }]
                },
                /* Show the units of m for data points. */
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
                /* Request all runs in the last week from the server. */
                var date = new Date();
                date.setDate(date.getDate() - 7);
                date = date.toISOString().substring(0, 10);

                $.get("/api/runs_since_date/" + date, (function (result) {
                    if (result.success != false) {
                        /*
                         * Take a local copy of the speed and distance graphs to
                         * modify and return to the props.
                         */
                        var speedGraph = this.state.speedGraph;
                        var distanceGraph = this.state.distanceGraph;

                        /* Update the number of runs stored. */
                        this.setState({
                            runs: result.runs
                        });

                        /* Reset the data stored in both graphs. */
                        speedGraph.data.labels = [];
                        speedGraph.data.datasets[0].data = [];
                        distanceGraph.data.labels = [];
                        distanceGraph.data.datasets[0].data = [];

                        /* Reset the data to display on both graphs. */
                        var counts = [0, 0, 0, 0, 0, 0, 0];
                        var speeds = [0, 0, 0, 0, 0, 0, 0];
                        var distances = [0, 0, 0, 0, 0, 0, 0];

                        /* Helper array used to generate axis labels. */
                        var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

                        /*
                         * Iterate through the runs returned, adding the data to the
                         * speeds and distances arrays for the correct day of the week.
                         * Also increments the count, to be used for averages.
                         */
                        for (var i = 0; i < result.runs.length; i++) {
                            var run = result.runs[i];
                            var moment = window.app.moment(run.start_time * 1000);
                            var day = moment.weekday();

                            counts[day]++;
                            speeds[day] += run.average_speed;
                            distances[day] += run.distance;
                        }

                        /* Record the current day of the week, from 0 to 6. */
                        var currentDay = window.app.moment().weekday();

                        /* For each day, add a data point to the graph. */
                        for (var i = 0; i < 7; i++) {
                            /*
                             * Add in the current offset to display the current day as
                             * the rightmost data point.
                             */
                            var day = (currentDay + i + 1) % 7;

                            /* Add the label to the speed graph. */
                            speedGraph.data.labels.push(weekdays[day]);
                            /* Determine the average speed for that day. */
                            var speed = 0;
                            if (counts[day] > 0) {
                                speed = speeds[day] / counts[day] * 60 * 60 / 1000;
                            }
                            /* Round to two decimal places. */
                            speed = speed.toFixed(2);
                            /* Push the average speed to the speed graph dataset. */
                            speedGraph.data.datasets[0].data.push(speed);

                            /* Add the label to the distance graph. */
                            distanceGraph.data.labels.push(weekdays[day]);
                            /* Determine the total distance for that day. */
                            var distance = 0;
                            if (counts[day] > 0) {
                                distance = distances[day];
                            }
                            /* Round to two decimal places. */
                            distance = distance.toFixed(2);
                            /* Push the total distance to the distance graph dataset. */
                            distanceGraph.data.datasets[0].data.push(distance);
                        }

                        /* Update the state with the generated graphs. */
                        this.setState({
                            speedGraph: speedGraph,
                            distanceGraph: distanceGraph });
                    }
                }).bind(this));
            }
        },
        render: {
            value: function render() {

                var content = null;

                /*
                 * Show a special alert prompting the user to import a run if there
                 * are no runs stored in the database.
                 */

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

                /*
                 * Render the main content of the dashboard page.
                 */
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

/* Display each run in the last week as a row of the table. */

},{"components/BarChart.jsx":10,"components/ImportDataModal.jsx":11,"components/LineChart.jsx":12,"components/MainNavbar.jsx":13,"components/ModalTrigger.jsx":15,"components/PieChart.jsx":17,"components/RadarChart.jsx":18,"components/SocialSharing.jsx":20,"components/UploadDataButton.jsx":21}],23:[function(require,module,exports){
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

},{"components/MainNavbar.jsx":13}],24:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var ModalTrigger = require("components/ModalTrigger.jsx").ModalTrigger;

var ShareRunModal = require("components/ShareRunModal.jsx").ShareRunModal;

var MainNavbar = require("components/MainNavbar.jsx").MainNavbar;

var Map = require("components/Map.jsx").Map;

var LineChart = require("components/LineChart.jsx").LineChart;

/*
 * Renders the page to display the summary of a run.
 */

var RunDataPage = exports.RunDataPage = (function (_React$Component) {
    function RunDataPage() {
        _classCallCheck(this, RunDataPage);

        /* Initialise the default state of the page. */
        this.state = {
            run: false,
            /* Initialise the run speed graph. */
            chartData: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "Speed",
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
                /* Display labels in km/h. */
                scaleLabel: function scaleLabel(value) {
                    return value.value + " km/h";
                },
                /* Show the tooltip in km/h to 1 decimal place. */
                tooltipTemplate: function tooltipTemplate(value) {
                    return value.value.toFixed(1) + " km/h";
                }
            }
        };
    }

    _inherits(RunDataPage, _React$Component);

    _createClass(RunDataPage, {
        componentDidMount: {
            value: function componentDidMount() {
                /* Fetch the data for the run when the component is mounted. */
                $.get("/api/run/" + this.props.runId, (function (result) {

                    if (result.success != false) {
                        var pretty_print_time =

                        /*
                         * Helper function to print a time in the form #h #m.
                         */
                        function (seconds) {
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

                        /* Reset the chart data. */
                        var data = this.state.chartData;
                        var labels = [];
                        var speeds = [];

                        /*
                         * Set the sample interval to display 10 labels on the x
                         * axis.
                         */
                        var interval = parseInt(result.speed_graph.x.length / 10);

                        /* Iterate through the data points. */
                        for (var i = 0; i < result.speed_graph.x.length; i++) {
                            /* Default to no label. */
                            var label = "";
                            /*
                             * If this item is one of the 10 specified for a label,
                             * set it to the pretty time of the current point.
                             */
                            if (i % interval == 0) {
                                var time_sec = parseInt(result.speed_graph.x[i]);
                                label = pretty_print_time(time_sec);
                            }
                            labels.push(label);
                            /* Add the speed in km/h to the data set. */
                            speeds.push(result.speed_graph.y[i] * 60 * 60 / 1000); // to km/h
                        }

                        /* Update the chart. */
                        data.labels = labels;
                        data.datasets[0].data = speeds;
                        this.setState({ chartData: data });
                    }
                }).bind(this));
            }
        },
        shareRun: {

            /*
             * Handle a run share event by posting an image of the current run to
             * imgur.
             */

            value: function shareRun(e) {
                /* Get a URL for the current map. */
                var mapUrl = this.refs.map.getStaticUrl();
                var callback = this.imgurUpload.bind(this);

                /* Upload the image to imgur. */
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

            /*
             * Callback for when the upload is complete.
             */

            value: function imgurUpload(data) {
                this.setState({ mapUrl: data.data.link, sharingRun: true });
            }
        },
        render: {
            value: function render() {

                /* Set the default body to indicate that the run does not exist. */
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

                /* Show the sharing modal if an image upload was successful. */
                var modal = React.createElement(ShareRunModal, { ref: "modal", imageUrl: this.state.mapUrl });
                if (!this.state.sharingRun) {
                    modal = null;
                }

                /* Override the body if a run was found. */
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

                /* Return the content of the page. */
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

},{"components/LineChart.jsx":12,"components/MainNavbar.jsx":13,"components/Map.jsx":14,"components/ModalTrigger.jsx":15,"components/ShareRunModal.jsx":19}],25:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

        /* Reset the run state. */
        this.state = {
            runs: null
        };
    }

    _inherits(RunHistoryPage, _React$Component);

    _createClass(RunHistoryPage, {
        componentDidMount: {
            value: function componentDidMount() {
                /* Fetch the run data from the server on mount. */
                this.updateRuns();
            }
        },
        updateRuns: {

            /*
             * Get all existing runs from the server, and add them to the state.
             */

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

            /*
             * Callback to delete a specified run from the server.
             * Accepts a run object.
             */

            value: function deleteRun(run, e) {
                /*
                 * Ask the user for confirmation to delete the run.
                 */
                if (confirm("Are you sure you want to delete this run?")) {
                    /* If the user confirms, send the request to the server. */
                    $.get("/api/delete_run/" + run._id.$oid, (function (result) {
                        if (result.success != false) {
                            /* If successful, update the runs listing. */
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
                /* Render the existing runs in a body table. */
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

/* Pass if the user declines. */

/* Display each of the runs in a row of the table. */

},{"components/BarChart.jsx":10,"components/ImportDataModal.jsx":11,"components/LineChart.jsx":12,"components/MainNavbar.jsx":13,"components/ModalTrigger.jsx":15,"components/PieChart.jsx":17,"components/RadarChart.jsx":18}],26:[function(require,module,exports){


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

},{"pages/DashboardPage.jsx":22,"pages/controllers/PageTransition.jsx":28}],27:[function(require,module,exports){


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

},{"pages/FileNotFoundPage.jsx":23,"pages/controllers/PageTransition.jsx":28}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){


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

},{"pages/RunDataPage.jsx":24,"pages/controllers/PageTransition.jsx":28}],30:[function(require,module,exports){


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

},{"pages/RunHistoryPage.jsx":25,"pages/controllers/PageTransition.jsx":28}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbWtvb3BtYW4vRHJvcGJveC9VUSBDb3Vyc2UgRmlsZXMvMjAxNS9TZW1lc3RlciAxL0NTU0UzMDAyL3NvdXJjZV9yZXBvc2l0b3J5L3dlYmFwcC9zcmMvanN4L2FwcC5qc3giLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2NoYXJ0LmpzL0NoYXJ0LmpzIiwibm9kZV9tb2R1bGVzL21vbWVudC9tb21lbnQuanMiLCJub2RlX21vZHVsZXMvcGFnZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wYWdlL25vZGVfbW9kdWxlcy9wYXRoLXRvLXJlZ2V4cC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wYWdlL25vZGVfbW9kdWxlcy9wYXRoLXRvLXJlZ2V4cC9ub2RlX21vZHVsZXMvaXNhcnJheS9pbmRleC5qcyIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvUm91dGVyLmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9BcHBTZXR0aW5nc01vZGFsLmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9CYXJDaGFydC5qc3giLCIvVXNlcnMvbWtvb3BtYW4vRHJvcGJveC9VUSBDb3Vyc2UgRmlsZXMvMjAxNS9TZW1lc3RlciAxL0NTU0UzMDAyL3NvdXJjZV9yZXBvc2l0b3J5L3dlYmFwcC9zcmMvanN4L2NvbXBvbmVudHMvSW1wb3J0RGF0YU1vZGFsLmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9MaW5lQ2hhcnQuanN4IiwiL1VzZXJzL21rb29wbWFuL0Ryb3Bib3gvVVEgQ291cnNlIEZpbGVzLzIwMTUvU2VtZXN0ZXIgMS9DU1NFMzAwMi9zb3VyY2VfcmVwb3NpdG9yeS93ZWJhcHAvc3JjL2pzeC9jb21wb25lbnRzL01haW5OYXZiYXIuanN4IiwiL1VzZXJzL21rb29wbWFuL0Ryb3Bib3gvVVEgQ291cnNlIEZpbGVzLzIwMTUvU2VtZXN0ZXIgMS9DU1NFMzAwMi9zb3VyY2VfcmVwb3NpdG9yeS93ZWJhcHAvc3JjL2pzeC9jb21wb25lbnRzL01hcC5qc3giLCIvVXNlcnMvbWtvb3BtYW4vRHJvcGJveC9VUSBDb3Vyc2UgRmlsZXMvMjAxNS9TZW1lc3RlciAxL0NTU0UzMDAyL3NvdXJjZV9yZXBvc2l0b3J5L3dlYmFwcC9zcmMvanN4L2NvbXBvbmVudHMvTW9kYWxUcmlnZ2VyLmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9OYXZiYXIuanN4IiwiL1VzZXJzL21rb29wbWFuL0Ryb3Bib3gvVVEgQ291cnNlIEZpbGVzLzIwMTUvU2VtZXN0ZXIgMS9DU1NFMzAwMi9zb3VyY2VfcmVwb3NpdG9yeS93ZWJhcHAvc3JjL2pzeC9jb21wb25lbnRzL1BpZUNoYXJ0LmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9SYWRhckNoYXJ0LmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9TaGFyZVJ1bk1vZGFsLmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9Tb2NpYWxTaGFyaW5nLmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9VcGxvYWREYXRhQnV0dG9uLmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvcGFnZXMvRGFzaGJvYXJkUGFnZS5qc3giLCIvVXNlcnMvbWtvb3BtYW4vRHJvcGJveC9VUSBDb3Vyc2UgRmlsZXMvMjAxNS9TZW1lc3RlciAxL0NTU0UzMDAyL3NvdXJjZV9yZXBvc2l0b3J5L3dlYmFwcC9zcmMvanN4L3BhZ2VzL0ZpbGVOb3RGb3VuZFBhZ2UuanN4IiwiL1VzZXJzL21rb29wbWFuL0Ryb3Bib3gvVVEgQ291cnNlIEZpbGVzLzIwMTUvU2VtZXN0ZXIgMS9DU1NFMzAwMi9zb3VyY2VfcmVwb3NpdG9yeS93ZWJhcHAvc3JjL2pzeC9wYWdlcy9SdW5EYXRhUGFnZS5qc3giLCIvVXNlcnMvbWtvb3BtYW4vRHJvcGJveC9VUSBDb3Vyc2UgRmlsZXMvMjAxNS9TZW1lc3RlciAxL0NTU0UzMDAyL3NvdXJjZV9yZXBvc2l0b3J5L3dlYmFwcC9zcmMvanN4L3BhZ2VzL1J1bkhpc3RvcnlQYWdlLmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvcGFnZXMvY29udHJvbGxlcnMvRGFzaGJvYXJkQ29udHJvbGxlci5qc3giLCIvVXNlcnMvbWtvb3BtYW4vRHJvcGJveC9VUSBDb3Vyc2UgRmlsZXMvMjAxNS9TZW1lc3RlciAxL0NTU0UzMDAyL3NvdXJjZV9yZXBvc2l0b3J5L3dlYmFwcC9zcmMvanN4L3BhZ2VzL2NvbnRyb2xsZXJzL0ZpbGVOb3RGb3VuZENvbnRyb2xsZXIuanN4IiwiL1VzZXJzL21rb29wbWFuL0Ryb3Bib3gvVVEgQ291cnNlIEZpbGVzLzIwMTUvU2VtZXN0ZXIgMS9DU1NFMzAwMi9zb3VyY2VfcmVwb3NpdG9yeS93ZWJhcHAvc3JjL2pzeC9wYWdlcy9jb250cm9sbGVycy9QYWdlVHJhbnNpdGlvbi5qc3giLCIvVXNlcnMvbWtvb3BtYW4vRHJvcGJveC9VUSBDb3Vyc2UgRmlsZXMvMjAxNS9TZW1lc3RlciAxL0NTU0UzMDAyL3NvdXJjZV9yZXBvc2l0b3J5L3dlYmFwcC9zcmMvanN4L3BhZ2VzL2NvbnRyb2xsZXJzL1J1bkRhdGFDb250cm9sbGVyLmpzeCIsIi9Vc2Vycy9ta29vcG1hbi9Ecm9wYm94L1VRIENvdXJzZSBGaWxlcy8yMDE1L1NlbWVzdGVyIDEvQ1NTRTMwMDIvc291cmNlX3JlcG9zaXRvcnkvd2ViYXBwL3NyYy9qc3gvcGFnZXMvY29udHJvbGxlcnMvUnVuSGlzdG9yeUNvbnRyb2xsZXIuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7SUNBUSxNQUFNLFdBQU8sWUFBWSxFQUF6QixNQUFNOztJQUNOLG1CQUFtQixXQUFPLDZDQUE2QyxFQUF2RSxtQkFBbUI7O0lBQ25CLG9CQUFvQixXQUFPLDhDQUE4QyxFQUF6RSxvQkFBb0I7O0lBQ3BCLHNCQUFzQixXQUFPLGdEQUFnRCxFQUE3RSxzQkFBc0I7O0lBQ3RCLGlCQUFpQixXQUFPLDJDQUEyQyxFQUFuRSxpQkFBaUI7O0FBR3pCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFL0IsQ0FBQyxZQUFXOztBQUVSLFVBQU0sQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDOzs7QUFHaEIsVUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUUzQixVQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQztBQUMzQyxVQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7OztBQUdwQyxVQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4QyxRQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQzs7QUFFL0IsVUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztBQUNoRCxVQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBQ25ELFVBQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDbEQsVUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUNoRCxVQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDOztBQUUxQyxVQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Q0FDbEIsQ0FBQSxFQUFHLENBQUM7OztBQzlCTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcDVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RpR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JtQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUUsSUFBSSxFQUFFO0FBQzVDLFlBQVUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLG9CQUFDLGNBQWMsT0FBRyxDQUFDLENBQUM7Q0FDN0MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJ1JvdXRlci5qc3gnO1xuaW1wb3J0IHtEYXNoYm9hcmRDb250cm9sbGVyfSBmcm9tICcuL3BhZ2VzL2NvbnRyb2xsZXJzL0Rhc2hib2FyZENvbnRyb2xsZXIuanN4JztcbmltcG9ydCB7UnVuSGlzdG9yeUNvbnRyb2xsZXJ9IGZyb20gJy4vcGFnZXMvY29udHJvbGxlcnMvUnVuSGlzdG9yeUNvbnRyb2xsZXIuanN4JztcbmltcG9ydCB7RmlsZU5vdEZvdW5kQ29udHJvbGxlcn0gZnJvbSAnLi9wYWdlcy9jb250cm9sbGVycy9GaWxlTm90Rm91bmRDb250cm9sbGVyLmpzeCc7XG5pbXBvcnQge1J1bkRhdGFDb250cm9sbGVyfSBmcm9tICcuL3BhZ2VzL2NvbnRyb2xsZXJzL1J1bkRhdGFDb250cm9sbGVyLmpzeCc7XG5cblxudmFyIG1vbWVudCA9IHJlcXVpcmUoXCJtb21lbnRcIik7XG5cbihmdW5jdGlvbigpIHtcbiAgICAvKiBBIGdsb2JhbCBvYmplY3QgdG8gaG9sZCB1dGlsaXRpZXMuICovXG4gICAgd2luZG93LmFwcCA9IHt9O1xuXG4gICAgLyogRXhwb3NlIHRoZSBtb21lbnQgbW9kdWxlLiAqL1xuICAgIHdpbmRvdy5hcHAubW9tZW50ID0gbW9tZW50O1xuICAgIC8qIFNwZWNpZnkgdGhlIGdsb2JhbCBmb3JtYXRzIGZvciB0aW1lIGFuZCBkYXRlLiAqL1xuICAgIHdpbmRvdy5hcHAuZGF5Rm9ybWF0ID0gXCJkZGRkLCBNTU0gRG8gWVlZWVwiO1xuICAgIHdpbmRvdy5hcHAudGltZUZvcm1hdCA9IFwiaDptbTpzcyBhXCI7XG5cbiAgICAvKiBTcGVjaWZ5IHRoZSByb3V0ZXMgZm9yIGVhY2ggc2NyZWVuLiAqL1xuICAgIHdpbmRvdy5hcHAucm91dGVyID0gbmV3IFJvdXRlcignbW91bnQnKTtcbiAgICB2YXIgcm91dGVyID0gd2luZG93LmFwcC5yb3V0ZXI7XG5cbiAgICByb3V0ZXIuYWRkUm91dGUoJy80MDQnLCBGaWxlTm90Rm91bmRDb250cm9sbGVyKTtcbiAgICByb3V0ZXIuYWRkUm91dGUoJy9kYXNoYm9hcmQnLCBEYXNoYm9hcmRDb250cm9sbGVyKTtcbiAgICByb3V0ZXIuYWRkUm91dGUoJy9oaXN0b3J5JywgUnVuSGlzdG9yeUNvbnRyb2xsZXIpO1xuICAgIHJvdXRlci5hZGRSb3V0ZSgnL3J1bi86cnVuJywgUnVuRGF0YUNvbnRyb2xsZXIpO1xuICAgIHJvdXRlci5hZGRSb3V0ZSgnLycsIERhc2hib2FyZENvbnRyb2xsZXIpO1xuXG4gICAgcm91dGVyLnN0YXJ0KCk7XG59KSgpO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuICAgIHZhciBjdXJyZW50UXVldWU7XG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtpXSgpO1xuICAgICAgICB9XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbn1cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgcXVldWUucHVzaChmdW4pO1xuICAgIGlmICghZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8qIVxuICogQ2hhcnQuanNcbiAqIGh0dHA6Ly9jaGFydGpzLm9yZy9cbiAqIFZlcnNpb246IDEuMC4yXG4gKlxuICogQ29weXJpZ2h0IDIwMTUgTmljayBEb3duaWVcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cHM6Ly9naXRodWIuY29tL25ubmljay9DaGFydC5qcy9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4gKi9cblxuXG4oZnVuY3Rpb24oKXtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHQvL0RlY2xhcmUgcm9vdCB2YXJpYWJsZSAtIHdpbmRvdyBpbiB0aGUgYnJvd3NlciwgZ2xvYmFsIG9uIHRoZSBzZXJ2ZXJcblx0dmFyIHJvb3QgPSB0aGlzLFxuXHRcdHByZXZpb3VzID0gcm9vdC5DaGFydDtcblxuXHQvL09jY3VweSB0aGUgZ2xvYmFsIHZhcmlhYmxlIG9mIENoYXJ0LCBhbmQgY3JlYXRlIGEgc2ltcGxlIGJhc2UgY2xhc3Ncblx0dmFyIENoYXJ0ID0gZnVuY3Rpb24oY29udGV4dCl7XG5cdFx0dmFyIGNoYXJ0ID0gdGhpcztcblx0XHR0aGlzLmNhbnZhcyA9IGNvbnRleHQuY2FudmFzO1xuXG5cdFx0dGhpcy5jdHggPSBjb250ZXh0O1xuXG5cdFx0Ly9WYXJpYWJsZXMgZ2xvYmFsIHRvIHRoZSBjaGFydFxuXHRcdHZhciBjb21wdXRlRGltZW5zaW9uID0gZnVuY3Rpb24oZWxlbWVudCxkaW1lbnNpb24pXG5cdFx0e1xuXHRcdFx0aWYgKGVsZW1lbnRbJ29mZnNldCcrZGltZW5zaW9uXSlcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnRbJ29mZnNldCcrZGltZW5zaW9uXTtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIGRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZShkaW1lbnNpb24pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciB3aWR0aCA9IHRoaXMud2lkdGggPSBjb21wdXRlRGltZW5zaW9uKGNvbnRleHQuY2FudmFzLCdXaWR0aCcpO1xuXHRcdHZhciBoZWlnaHQgPSB0aGlzLmhlaWdodCA9IGNvbXB1dGVEaW1lbnNpb24oY29udGV4dC5jYW52YXMsJ0hlaWdodCcpO1xuXG5cdFx0Ly8gRmlyZWZveCByZXF1aXJlcyB0aGlzIHRvIHdvcmsgY29ycmVjdGx5XG5cdFx0Y29udGV4dC5jYW52YXMud2lkdGggID0gd2lkdGg7XG5cdFx0Y29udGV4dC5jYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXG5cdFx0dmFyIHdpZHRoID0gdGhpcy53aWR0aCA9IGNvbnRleHQuY2FudmFzLndpZHRoO1xuXHRcdHZhciBoZWlnaHQgPSB0aGlzLmhlaWdodCA9IGNvbnRleHQuY2FudmFzLmhlaWdodDtcblx0XHR0aGlzLmFzcGVjdFJhdGlvID0gdGhpcy53aWR0aCAvIHRoaXMuaGVpZ2h0O1xuXHRcdC8vSGlnaCBwaXhlbCBkZW5zaXR5IGRpc3BsYXlzIC0gbXVsdGlwbHkgdGhlIHNpemUgb2YgdGhlIGNhbnZhcyBoZWlnaHQvd2lkdGggYnkgdGhlIGRldmljZSBwaXhlbCByYXRpbywgdGhlbiBzY2FsZS5cblx0XHRoZWxwZXJzLnJldGluYVNjYWxlKHRoaXMpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cdC8vR2xvYmFsbHkgZXhwb3NlIHRoZSBkZWZhdWx0cyB0byBhbGxvdyBmb3IgdXNlciB1cGRhdGluZy9jaGFuZ2luZ1xuXHRDaGFydC5kZWZhdWx0cyA9IHtcblx0XHRnbG9iYWw6IHtcblx0XHRcdC8vIEJvb2xlYW4gLSBXaGV0aGVyIHRvIGFuaW1hdGUgdGhlIGNoYXJ0XG5cdFx0XHRhbmltYXRpb246IHRydWUsXG5cblx0XHRcdC8vIE51bWJlciAtIE51bWJlciBvZiBhbmltYXRpb24gc3RlcHNcblx0XHRcdGFuaW1hdGlvblN0ZXBzOiA2MCxcblxuXHRcdFx0Ly8gU3RyaW5nIC0gQW5pbWF0aW9uIGVhc2luZyBlZmZlY3Rcblx0XHRcdGFuaW1hdGlvbkVhc2luZzogXCJlYXNlT3V0UXVhcnRcIixcblxuXHRcdFx0Ly8gQm9vbGVhbiAtIElmIHdlIHNob3VsZCBzaG93IHRoZSBzY2FsZSBhdCBhbGxcblx0XHRcdHNob3dTY2FsZTogdHJ1ZSxcblxuXHRcdFx0Ly8gQm9vbGVhbiAtIElmIHdlIHdhbnQgdG8gb3ZlcnJpZGUgd2l0aCBhIGhhcmQgY29kZWQgc2NhbGVcblx0XHRcdHNjYWxlT3ZlcnJpZGU6IGZhbHNlLFxuXG5cdFx0XHQvLyAqKiBSZXF1aXJlZCBpZiBzY2FsZU92ZXJyaWRlIGlzIHRydWUgKipcblx0XHRcdC8vIE51bWJlciAtIFRoZSBudW1iZXIgb2Ygc3RlcHMgaW4gYSBoYXJkIGNvZGVkIHNjYWxlXG5cdFx0XHRzY2FsZVN0ZXBzOiBudWxsLFxuXHRcdFx0Ly8gTnVtYmVyIC0gVGhlIHZhbHVlIGp1bXAgaW4gdGhlIGhhcmQgY29kZWQgc2NhbGVcblx0XHRcdHNjYWxlU3RlcFdpZHRoOiBudWxsLFxuXHRcdFx0Ly8gTnVtYmVyIC0gVGhlIHNjYWxlIHN0YXJ0aW5nIHZhbHVlXG5cdFx0XHRzY2FsZVN0YXJ0VmFsdWU6IG51bGwsXG5cblx0XHRcdC8vIFN0cmluZyAtIENvbG91ciBvZiB0aGUgc2NhbGUgbGluZVxuXHRcdFx0c2NhbGVMaW5lQ29sb3I6IFwicmdiYSgwLDAsMCwuMSlcIixcblxuXHRcdFx0Ly8gTnVtYmVyIC0gUGl4ZWwgd2lkdGggb2YgdGhlIHNjYWxlIGxpbmVcblx0XHRcdHNjYWxlTGluZVdpZHRoOiAxLFxuXG5cdFx0XHQvLyBCb29sZWFuIC0gV2hldGhlciB0byBzaG93IGxhYmVscyBvbiB0aGUgc2NhbGVcblx0XHRcdHNjYWxlU2hvd0xhYmVsczogdHJ1ZSxcblxuXHRcdFx0Ly8gSW50ZXJwb2xhdGVkIEpTIHN0cmluZyAtIGNhbiBhY2Nlc3MgdmFsdWVcblx0XHRcdHNjYWxlTGFiZWw6IFwiPCU9dmFsdWUlPlwiLFxuXG5cdFx0XHQvLyBCb29sZWFuIC0gV2hldGhlciB0aGUgc2NhbGUgc2hvdWxkIHN0aWNrIHRvIGludGVnZXJzLCBhbmQgbm90IHNob3cgYW55IGZsb2F0cyBldmVuIGlmIGRyYXdpbmcgc3BhY2UgaXMgdGhlcmVcblx0XHRcdHNjYWxlSW50ZWdlcnNPbmx5OiB0cnVlLFxuXG5cdFx0XHQvLyBCb29sZWFuIC0gV2hldGhlciB0aGUgc2NhbGUgc2hvdWxkIHN0YXJ0IGF0IHplcm8sIG9yIGFuIG9yZGVyIG9mIG1hZ25pdHVkZSBkb3duIGZyb20gdGhlIGxvd2VzdCB2YWx1ZVxuXHRcdFx0c2NhbGVCZWdpbkF0WmVybzogZmFsc2UsXG5cblx0XHRcdC8vIFN0cmluZyAtIFNjYWxlIGxhYmVsIGZvbnQgZGVjbGFyYXRpb24gZm9yIHRoZSBzY2FsZSBsYWJlbFxuXHRcdFx0c2NhbGVGb250RmFtaWx5OiBcIidIZWx2ZXRpY2EgTmV1ZScsICdIZWx2ZXRpY2EnLCAnQXJpYWwnLCBzYW5zLXNlcmlmXCIsXG5cblx0XHRcdC8vIE51bWJlciAtIFNjYWxlIGxhYmVsIGZvbnQgc2l6ZSBpbiBwaXhlbHNcblx0XHRcdHNjYWxlRm9udFNpemU6IDEyLFxuXG5cdFx0XHQvLyBTdHJpbmcgLSBTY2FsZSBsYWJlbCBmb250IHdlaWdodCBzdHlsZVxuXHRcdFx0c2NhbGVGb250U3R5bGU6IFwibm9ybWFsXCIsXG5cblx0XHRcdC8vIFN0cmluZyAtIFNjYWxlIGxhYmVsIGZvbnQgY29sb3VyXG5cdFx0XHRzY2FsZUZvbnRDb2xvcjogXCIjNjY2XCIsXG5cblx0XHRcdC8vIEJvb2xlYW4gLSB3aGV0aGVyIG9yIG5vdCB0aGUgY2hhcnQgc2hvdWxkIGJlIHJlc3BvbnNpdmUgYW5kIHJlc2l6ZSB3aGVuIHRoZSBicm93c2VyIGRvZXMuXG5cdFx0XHRyZXNwb25zaXZlOiBmYWxzZSxcblxuXHRcdFx0Ly8gQm9vbGVhbiAtIHdoZXRoZXIgdG8gbWFpbnRhaW4gdGhlIHN0YXJ0aW5nIGFzcGVjdCByYXRpbyBvciBub3Qgd2hlbiByZXNwb25zaXZlLCBpZiBzZXQgdG8gZmFsc2UsIHdpbGwgdGFrZSB1cCBlbnRpcmUgY29udGFpbmVyXG5cdFx0XHRtYWludGFpbkFzcGVjdFJhdGlvOiB0cnVlLFxuXG5cdFx0XHQvLyBCb29sZWFuIC0gRGV0ZXJtaW5lcyB3aGV0aGVyIHRvIGRyYXcgdG9vbHRpcHMgb24gdGhlIGNhbnZhcyBvciBub3QgLSBhdHRhY2hlcyBldmVudHMgdG8gdG91Y2htb3ZlICYgbW91c2Vtb3ZlXG5cdFx0XHRzaG93VG9vbHRpcHM6IHRydWUsXG5cblx0XHRcdC8vIEJvb2xlYW4gLSBEZXRlcm1pbmVzIHdoZXRoZXIgdG8gZHJhdyBidWlsdC1pbiB0b29sdGlwIG9yIGNhbGwgY3VzdG9tIHRvb2x0aXAgZnVuY3Rpb25cblx0XHRcdGN1c3RvbVRvb2x0aXBzOiBmYWxzZSxcblxuXHRcdFx0Ly8gQXJyYXkgLSBBcnJheSBvZiBzdHJpbmcgbmFtZXMgdG8gYXR0YWNoIHRvb2x0aXAgZXZlbnRzXG5cdFx0XHR0b29sdGlwRXZlbnRzOiBbXCJtb3VzZW1vdmVcIiwgXCJ0b3VjaHN0YXJ0XCIsIFwidG91Y2htb3ZlXCIsIFwibW91c2VvdXRcIl0sXG5cblx0XHRcdC8vIFN0cmluZyAtIFRvb2x0aXAgYmFja2dyb3VuZCBjb2xvdXJcblx0XHRcdHRvb2x0aXBGaWxsQ29sb3I6IFwicmdiYSgwLDAsMCwwLjgpXCIsXG5cblx0XHRcdC8vIFN0cmluZyAtIFRvb2x0aXAgbGFiZWwgZm9udCBkZWNsYXJhdGlvbiBmb3IgdGhlIHNjYWxlIGxhYmVsXG5cdFx0XHR0b29sdGlwRm9udEZhbWlseTogXCInSGVsdmV0aWNhIE5ldWUnLCAnSGVsdmV0aWNhJywgJ0FyaWFsJywgc2Fucy1zZXJpZlwiLFxuXG5cdFx0XHQvLyBOdW1iZXIgLSBUb29sdGlwIGxhYmVsIGZvbnQgc2l6ZSBpbiBwaXhlbHNcblx0XHRcdHRvb2x0aXBGb250U2l6ZTogMTQsXG5cblx0XHRcdC8vIFN0cmluZyAtIFRvb2x0aXAgZm9udCB3ZWlnaHQgc3R5bGVcblx0XHRcdHRvb2x0aXBGb250U3R5bGU6IFwibm9ybWFsXCIsXG5cblx0XHRcdC8vIFN0cmluZyAtIFRvb2x0aXAgbGFiZWwgZm9udCBjb2xvdXJcblx0XHRcdHRvb2x0aXBGb250Q29sb3I6IFwiI2ZmZlwiLFxuXG5cdFx0XHQvLyBTdHJpbmcgLSBUb29sdGlwIHRpdGxlIGZvbnQgZGVjbGFyYXRpb24gZm9yIHRoZSBzY2FsZSBsYWJlbFxuXHRcdFx0dG9vbHRpcFRpdGxlRm9udEZhbWlseTogXCInSGVsdmV0aWNhIE5ldWUnLCAnSGVsdmV0aWNhJywgJ0FyaWFsJywgc2Fucy1zZXJpZlwiLFxuXG5cdFx0XHQvLyBOdW1iZXIgLSBUb29sdGlwIHRpdGxlIGZvbnQgc2l6ZSBpbiBwaXhlbHNcblx0XHRcdHRvb2x0aXBUaXRsZUZvbnRTaXplOiAxNCxcblxuXHRcdFx0Ly8gU3RyaW5nIC0gVG9vbHRpcCB0aXRsZSBmb250IHdlaWdodCBzdHlsZVxuXHRcdFx0dG9vbHRpcFRpdGxlRm9udFN0eWxlOiBcImJvbGRcIixcblxuXHRcdFx0Ly8gU3RyaW5nIC0gVG9vbHRpcCB0aXRsZSBmb250IGNvbG91clxuXHRcdFx0dG9vbHRpcFRpdGxlRm9udENvbG9yOiBcIiNmZmZcIixcblxuXHRcdFx0Ly8gTnVtYmVyIC0gcGl4ZWwgd2lkdGggb2YgcGFkZGluZyBhcm91bmQgdG9vbHRpcCB0ZXh0XG5cdFx0XHR0b29sdGlwWVBhZGRpbmc6IDYsXG5cblx0XHRcdC8vIE51bWJlciAtIHBpeGVsIHdpZHRoIG9mIHBhZGRpbmcgYXJvdW5kIHRvb2x0aXAgdGV4dFxuXHRcdFx0dG9vbHRpcFhQYWRkaW5nOiA2LFxuXG5cdFx0XHQvLyBOdW1iZXIgLSBTaXplIG9mIHRoZSBjYXJldCBvbiB0aGUgdG9vbHRpcFxuXHRcdFx0dG9vbHRpcENhcmV0U2l6ZTogOCxcblxuXHRcdFx0Ly8gTnVtYmVyIC0gUGl4ZWwgcmFkaXVzIG9mIHRoZSB0b29sdGlwIGJvcmRlclxuXHRcdFx0dG9vbHRpcENvcm5lclJhZGl1czogNixcblxuXHRcdFx0Ly8gTnVtYmVyIC0gUGl4ZWwgb2Zmc2V0IGZyb20gcG9pbnQgeCB0byB0b29sdGlwIGVkZ2Vcblx0XHRcdHRvb2x0aXBYT2Zmc2V0OiAxMCxcblxuXHRcdFx0Ly8gU3RyaW5nIC0gVGVtcGxhdGUgc3RyaW5nIGZvciBzaW5nbGUgdG9vbHRpcHNcblx0XHRcdHRvb2x0aXBUZW1wbGF0ZTogXCI8JWlmIChsYWJlbCl7JT48JT1sYWJlbCU+OiA8JX0lPjwlPSB2YWx1ZSAlPlwiLFxuXG5cdFx0XHQvLyBTdHJpbmcgLSBUZW1wbGF0ZSBzdHJpbmcgZm9yIHNpbmdsZSB0b29sdGlwc1xuXHRcdFx0bXVsdGlUb29sdGlwVGVtcGxhdGU6IFwiPCU9IHZhbHVlICU+XCIsXG5cblx0XHRcdC8vIFN0cmluZyAtIENvbG91ciBiZWhpbmQgdGhlIGxlZ2VuZCBjb2xvdXIgYmxvY2tcblx0XHRcdG11bHRpVG9vbHRpcEtleUJhY2tncm91bmQ6ICcjZmZmJyxcblxuXHRcdFx0Ly8gRnVuY3Rpb24gLSBXaWxsIGZpcmUgb24gYW5pbWF0aW9uIHByb2dyZXNzaW9uLlxuXHRcdFx0b25BbmltYXRpb25Qcm9ncmVzczogZnVuY3Rpb24oKXt9LFxuXG5cdFx0XHQvLyBGdW5jdGlvbiAtIFdpbGwgZmlyZSBvbiBhbmltYXRpb24gY29tcGxldGlvbi5cblx0XHRcdG9uQW5pbWF0aW9uQ29tcGxldGU6IGZ1bmN0aW9uKCl7fVxuXG5cdFx0fVxuXHR9O1xuXG5cdC8vQ3JlYXRlIGEgZGljdGlvbmFyeSBvZiBjaGFydCB0eXBlcywgdG8gYWxsb3cgZm9yIGV4dGVuc2lvbiBvZiBleGlzdGluZyB0eXBlc1xuXHRDaGFydC50eXBlcyA9IHt9O1xuXG5cdC8vR2xvYmFsIENoYXJ0IGhlbHBlcnMgb2JqZWN0IGZvciB1dGlsaXR5IG1ldGhvZHMgYW5kIGNsYXNzZXNcblx0dmFyIGhlbHBlcnMgPSBDaGFydC5oZWxwZXJzID0ge307XG5cblx0XHQvLy0tIEJhc2ljIGpzIHV0aWxpdHkgbWV0aG9kc1xuXHR2YXIgZWFjaCA9IGhlbHBlcnMuZWFjaCA9IGZ1bmN0aW9uKGxvb3BhYmxlLGNhbGxiYWNrLHNlbGYpe1xuXHRcdFx0dmFyIGFkZGl0aW9uYWxBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKTtcblx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiBudWxsIG9yIHVuZGVmaW5lZCBmaXJzdGx5LlxuXHRcdFx0aWYgKGxvb3BhYmxlKXtcblx0XHRcdFx0aWYgKGxvb3BhYmxlLmxlbmd0aCA9PT0gK2xvb3BhYmxlLmxlbmd0aCl7XG5cdFx0XHRcdFx0dmFyIGk7XG5cdFx0XHRcdFx0Zm9yIChpPTA7IGk8bG9vcGFibGUubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2suYXBwbHkoc2VsZixbbG9vcGFibGVbaV0sIGldLmNvbmNhdChhZGRpdGlvbmFsQXJncykpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdGZvciAodmFyIGl0ZW0gaW4gbG9vcGFibGUpe1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2suYXBwbHkoc2VsZixbbG9vcGFibGVbaXRlbV0saXRlbV0uY29uY2F0KGFkZGl0aW9uYWxBcmdzKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRjbG9uZSA9IGhlbHBlcnMuY2xvbmUgPSBmdW5jdGlvbihvYmope1xuXHRcdFx0dmFyIG9iakNsb25lID0ge307XG5cdFx0XHRlYWNoKG9iaixmdW5jdGlvbih2YWx1ZSxrZXkpe1xuXHRcdFx0XHRpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIG9iakNsb25lW2tleV0gPSB2YWx1ZTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG9iakNsb25lO1xuXHRcdH0sXG5cdFx0ZXh0ZW5kID0gaGVscGVycy5leHRlbmQgPSBmdW5jdGlvbihiYXNlKXtcblx0XHRcdGVhY2goQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpLCBmdW5jdGlvbihleHRlbnNpb25PYmplY3QpIHtcblx0XHRcdFx0ZWFjaChleHRlbnNpb25PYmplY3QsZnVuY3Rpb24odmFsdWUsa2V5KXtcblx0XHRcdFx0XHRpZiAoZXh0ZW5zaW9uT2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIGJhc2Vba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGJhc2U7XG5cdFx0fSxcblx0XHRtZXJnZSA9IGhlbHBlcnMubWVyZ2UgPSBmdW5jdGlvbihiYXNlLG1hc3Rlcil7XG5cdFx0XHQvL01lcmdlIHByb3BlcnRpZXMgaW4gbGVmdCBvYmplY3Qgb3ZlciB0byBhIHNoYWxsb3cgY2xvbmUgb2Ygb2JqZWN0IHJpZ2h0LlxuXHRcdFx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMCk7XG5cdFx0XHRhcmdzLnVuc2hpZnQoe30pO1xuXHRcdFx0cmV0dXJuIGV4dGVuZC5hcHBseShudWxsLCBhcmdzKTtcblx0XHR9LFxuXHRcdGluZGV4T2YgPSBoZWxwZXJzLmluZGV4T2YgPSBmdW5jdGlvbihhcnJheVRvU2VhcmNoLCBpdGVtKXtcblx0XHRcdGlmIChBcnJheS5wcm90b3R5cGUuaW5kZXhPZikge1xuXHRcdFx0XHRyZXR1cm4gYXJyYXlUb1NlYXJjaC5pbmRleE9mKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheVRvU2VhcmNoLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKGFycmF5VG9TZWFyY2hbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHdoZXJlID0gaGVscGVycy53aGVyZSA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGZpbHRlckNhbGxiYWNrKXtcblx0XHRcdHZhciBmaWx0ZXJlZCA9IFtdO1xuXG5cdFx0XHRoZWxwZXJzLmVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHRcdGlmIChmaWx0ZXJDYWxsYmFjayhpdGVtKSl7XG5cdFx0XHRcdFx0ZmlsdGVyZWQucHVzaChpdGVtKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBmaWx0ZXJlZDtcblx0XHR9LFxuXHRcdGZpbmROZXh0V2hlcmUgPSBoZWxwZXJzLmZpbmROZXh0V2hlcmUgPSBmdW5jdGlvbihhcnJheVRvU2VhcmNoLCBmaWx0ZXJDYWxsYmFjaywgc3RhcnRJbmRleCl7XG5cdFx0XHQvLyBEZWZhdWx0IHRvIHN0YXJ0IG9mIHRoZSBhcnJheVxuXHRcdFx0aWYgKCFzdGFydEluZGV4KXtcblx0XHRcdFx0c3RhcnRJbmRleCA9IC0xO1xuXHRcdFx0fVxuXHRcdFx0Zm9yICh2YXIgaSA9IHN0YXJ0SW5kZXggKyAxOyBpIDwgYXJyYXlUb1NlYXJjaC5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgY3VycmVudEl0ZW0gPSBhcnJheVRvU2VhcmNoW2ldO1xuXHRcdFx0XHRpZiAoZmlsdGVyQ2FsbGJhY2soY3VycmVudEl0ZW0pKXtcblx0XHRcdFx0XHRyZXR1cm4gY3VycmVudEl0ZW07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdGZpbmRQcmV2aW91c1doZXJlID0gaGVscGVycy5maW5kUHJldmlvdXNXaGVyZSA9IGZ1bmN0aW9uKGFycmF5VG9TZWFyY2gsIGZpbHRlckNhbGxiYWNrLCBzdGFydEluZGV4KXtcblx0XHRcdC8vIERlZmF1bHQgdG8gZW5kIG9mIHRoZSBhcnJheVxuXHRcdFx0aWYgKCFzdGFydEluZGV4KXtcblx0XHRcdFx0c3RhcnRJbmRleCA9IGFycmF5VG9TZWFyY2gubGVuZ3RoO1xuXHRcdFx0fVxuXHRcdFx0Zm9yICh2YXIgaSA9IHN0YXJ0SW5kZXggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHR2YXIgY3VycmVudEl0ZW0gPSBhcnJheVRvU2VhcmNoW2ldO1xuXHRcdFx0XHRpZiAoZmlsdGVyQ2FsbGJhY2soY3VycmVudEl0ZW0pKXtcblx0XHRcdFx0XHRyZXR1cm4gY3VycmVudEl0ZW07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdGluaGVyaXRzID0gaGVscGVycy5pbmhlcml0cyA9IGZ1bmN0aW9uKGV4dGVuc2lvbnMpe1xuXHRcdFx0Ly9CYXNpYyBqYXZhc2NyaXB0IGluaGVyaXRhbmNlIGJhc2VkIG9uIHRoZSBtb2RlbCBjcmVhdGVkIGluIEJhY2tib25lLmpzXG5cdFx0XHR2YXIgcGFyZW50ID0gdGhpcztcblx0XHRcdHZhciBDaGFydEVsZW1lbnQgPSAoZXh0ZW5zaW9ucyAmJiBleHRlbnNpb25zLmhhc093blByb3BlcnR5KFwiY29uc3RydWN0b3JcIikpID8gZXh0ZW5zaW9ucy5jb25zdHJ1Y3RvciA6IGZ1bmN0aW9uKCl7IHJldHVybiBwYXJlbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcblxuXHRcdFx0dmFyIFN1cnJvZ2F0ZSA9IGZ1bmN0aW9uKCl7IHRoaXMuY29uc3RydWN0b3IgPSBDaGFydEVsZW1lbnQ7fTtcblx0XHRcdFN1cnJvZ2F0ZS5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xuXHRcdFx0Q2hhcnRFbGVtZW50LnByb3RvdHlwZSA9IG5ldyBTdXJyb2dhdGUoKTtcblxuXHRcdFx0Q2hhcnRFbGVtZW50LmV4dGVuZCA9IGluaGVyaXRzO1xuXG5cdFx0XHRpZiAoZXh0ZW5zaW9ucykgZXh0ZW5kKENoYXJ0RWxlbWVudC5wcm90b3R5cGUsIGV4dGVuc2lvbnMpO1xuXG5cdFx0XHRDaGFydEVsZW1lbnQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTtcblxuXHRcdFx0cmV0dXJuIENoYXJ0RWxlbWVudDtcblx0XHR9LFxuXHRcdG5vb3AgPSBoZWxwZXJzLm5vb3AgPSBmdW5jdGlvbigpe30sXG5cdFx0dWlkID0gaGVscGVycy51aWQgPSAoZnVuY3Rpb24oKXtcblx0XHRcdHZhciBpZD0wO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHJldHVybiBcImNoYXJ0LVwiICsgaWQrKztcblx0XHRcdH07XG5cdFx0fSkoKSxcblx0XHR3YXJuID0gaGVscGVycy53YXJuID0gZnVuY3Rpb24oc3RyKXtcblx0XHRcdC8vTWV0aG9kIGZvciB3YXJuaW5nIG9mIGVycm9yc1xuXHRcdFx0aWYgKHdpbmRvdy5jb25zb2xlICYmIHR5cGVvZiB3aW5kb3cuY29uc29sZS53YXJuID09IFwiZnVuY3Rpb25cIikgY29uc29sZS53YXJuKHN0cik7XG5cdFx0fSxcblx0XHRhbWQgPSBoZWxwZXJzLmFtZCA9ICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCksXG5cdFx0Ly8tLSBNYXRoIG1ldGhvZHNcblx0XHRpc051bWJlciA9IGhlbHBlcnMuaXNOdW1iZXIgPSBmdW5jdGlvbihuKXtcblx0XHRcdHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XG5cdFx0fSxcblx0XHRtYXggPSBoZWxwZXJzLm1heCA9IGZ1bmN0aW9uKGFycmF5KXtcblx0XHRcdHJldHVybiBNYXRoLm1heC5hcHBseSggTWF0aCwgYXJyYXkgKTtcblx0XHR9LFxuXHRcdG1pbiA9IGhlbHBlcnMubWluID0gZnVuY3Rpb24oYXJyYXkpe1xuXHRcdFx0cmV0dXJuIE1hdGgubWluLmFwcGx5KCBNYXRoLCBhcnJheSApO1xuXHRcdH0sXG5cdFx0Y2FwID0gaGVscGVycy5jYXAgPSBmdW5jdGlvbih2YWx1ZVRvQ2FwLG1heFZhbHVlLG1pblZhbHVlKXtcblx0XHRcdGlmKGlzTnVtYmVyKG1heFZhbHVlKSkge1xuXHRcdFx0XHRpZiggdmFsdWVUb0NhcCA+IG1heFZhbHVlICkge1xuXHRcdFx0XHRcdHJldHVybiBtYXhWYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZihpc051bWJlcihtaW5WYWx1ZSkpe1xuXHRcdFx0XHRpZiAoIHZhbHVlVG9DYXAgPCBtaW5WYWx1ZSApe1xuXHRcdFx0XHRcdHJldHVybiBtaW5WYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHZhbHVlVG9DYXA7XG5cdFx0fSxcblx0XHRnZXREZWNpbWFsUGxhY2VzID0gaGVscGVycy5nZXREZWNpbWFsUGxhY2VzID0gZnVuY3Rpb24obnVtKXtcblx0XHRcdGlmIChudW0lMSE9PTAgJiYgaXNOdW1iZXIobnVtKSl7XG5cdFx0XHRcdHJldHVybiBudW0udG9TdHJpbmcoKS5zcGxpdChcIi5cIilbMV0ubGVuZ3RoO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0dG9SYWRpYW5zID0gaGVscGVycy5yYWRpYW5zID0gZnVuY3Rpb24oZGVncmVlcyl7XG5cdFx0XHRyZXR1cm4gZGVncmVlcyAqIChNYXRoLlBJLzE4MCk7XG5cdFx0fSxcblx0XHQvLyBHZXRzIHRoZSBhbmdsZSBmcm9tIHZlcnRpY2FsIHVwcmlnaHQgdG8gdGhlIHBvaW50IGFib3V0IGEgY2VudHJlLlxuXHRcdGdldEFuZ2xlRnJvbVBvaW50ID0gaGVscGVycy5nZXRBbmdsZUZyb21Qb2ludCA9IGZ1bmN0aW9uKGNlbnRyZVBvaW50LCBhbmdsZVBvaW50KXtcblx0XHRcdHZhciBkaXN0YW5jZUZyb21YQ2VudGVyID0gYW5nbGVQb2ludC54IC0gY2VudHJlUG9pbnQueCxcblx0XHRcdFx0ZGlzdGFuY2VGcm9tWUNlbnRlciA9IGFuZ2xlUG9pbnQueSAtIGNlbnRyZVBvaW50LnksXG5cdFx0XHRcdHJhZGlhbERpc3RhbmNlRnJvbUNlbnRlciA9IE1hdGguc3FydCggZGlzdGFuY2VGcm9tWENlbnRlciAqIGRpc3RhbmNlRnJvbVhDZW50ZXIgKyBkaXN0YW5jZUZyb21ZQ2VudGVyICogZGlzdGFuY2VGcm9tWUNlbnRlcik7XG5cblxuXHRcdFx0dmFyIGFuZ2xlID0gTWF0aC5QSSAqIDIgKyBNYXRoLmF0YW4yKGRpc3RhbmNlRnJvbVlDZW50ZXIsIGRpc3RhbmNlRnJvbVhDZW50ZXIpO1xuXG5cdFx0XHQvL0lmIHRoZSBzZWdtZW50IGlzIGluIHRoZSB0b3AgbGVmdCBxdWFkcmFudCwgd2UgbmVlZCB0byBhZGQgYW5vdGhlciByb3RhdGlvbiB0byB0aGUgYW5nbGVcblx0XHRcdGlmIChkaXN0YW5jZUZyb21YQ2VudGVyIDwgMCAmJiBkaXN0YW5jZUZyb21ZQ2VudGVyIDwgMCl7XG5cdFx0XHRcdGFuZ2xlICs9IE1hdGguUEkqMjtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0YW5nbGU6IGFuZ2xlLFxuXHRcdFx0XHRkaXN0YW5jZTogcmFkaWFsRGlzdGFuY2VGcm9tQ2VudGVyXG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0YWxpYXNQaXhlbCA9IGhlbHBlcnMuYWxpYXNQaXhlbCA9IGZ1bmN0aW9uKHBpeGVsV2lkdGgpe1xuXHRcdFx0cmV0dXJuIChwaXhlbFdpZHRoICUgMiA9PT0gMCkgPyAwIDogMC41O1xuXHRcdH0sXG5cdFx0c3BsaW5lQ3VydmUgPSBoZWxwZXJzLnNwbGluZUN1cnZlID0gZnVuY3Rpb24oRmlyc3RQb2ludCxNaWRkbGVQb2ludCxBZnRlclBvaW50LHQpe1xuXHRcdFx0Ly9Qcm9wcyB0byBSb2IgU3BlbmNlciBhdCBzY2FsZWQgaW5ub3ZhdGlvbiBmb3IgaGlzIHBvc3Qgb24gc3BsaW5pbmcgYmV0d2VlbiBwb2ludHNcblx0XHRcdC8vaHR0cDovL3NjYWxlZGlubm92YXRpb24uY29tL2FuYWx5dGljcy9zcGxpbmVzL2Fib3V0U3BsaW5lcy5odG1sXG5cdFx0XHR2YXIgZDAxPU1hdGguc3FydChNYXRoLnBvdyhNaWRkbGVQb2ludC54LUZpcnN0UG9pbnQueCwyKStNYXRoLnBvdyhNaWRkbGVQb2ludC55LUZpcnN0UG9pbnQueSwyKSksXG5cdFx0XHRcdGQxMj1NYXRoLnNxcnQoTWF0aC5wb3coQWZ0ZXJQb2ludC54LU1pZGRsZVBvaW50LngsMikrTWF0aC5wb3coQWZ0ZXJQb2ludC55LU1pZGRsZVBvaW50LnksMikpLFxuXHRcdFx0XHRmYT10KmQwMS8oZDAxK2QxMiksLy8gc2NhbGluZyBmYWN0b3IgZm9yIHRyaWFuZ2xlIFRhXG5cdFx0XHRcdGZiPXQqZDEyLyhkMDErZDEyKTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGlubmVyIDoge1xuXHRcdFx0XHRcdHggOiBNaWRkbGVQb2ludC54LWZhKihBZnRlclBvaW50LngtRmlyc3RQb2ludC54KSxcblx0XHRcdFx0XHR5IDogTWlkZGxlUG9pbnQueS1mYSooQWZ0ZXJQb2ludC55LUZpcnN0UG9pbnQueSlcblx0XHRcdFx0fSxcblx0XHRcdFx0b3V0ZXIgOiB7XG5cdFx0XHRcdFx0eDogTWlkZGxlUG9pbnQueCtmYiooQWZ0ZXJQb2ludC54LUZpcnN0UG9pbnQueCksXG5cdFx0XHRcdFx0eSA6IE1pZGRsZVBvaW50LnkrZmIqKEFmdGVyUG9pbnQueS1GaXJzdFBvaW50LnkpXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fSxcblx0XHRjYWxjdWxhdGVPcmRlck9mTWFnbml0dWRlID0gaGVscGVycy5jYWxjdWxhdGVPcmRlck9mTWFnbml0dWRlID0gZnVuY3Rpb24odmFsKXtcblx0XHRcdHJldHVybiBNYXRoLmZsb29yKE1hdGgubG9nKHZhbCkgLyBNYXRoLkxOMTApO1xuXHRcdH0sXG5cdFx0Y2FsY3VsYXRlU2NhbGVSYW5nZSA9IGhlbHBlcnMuY2FsY3VsYXRlU2NhbGVSYW5nZSA9IGZ1bmN0aW9uKHZhbHVlc0FycmF5LCBkcmF3aW5nU2l6ZSwgdGV4dFNpemUsIHN0YXJ0RnJvbVplcm8sIGludGVnZXJzT25seSl7XG5cblx0XHRcdC8vU2V0IGEgbWluaW11bSBzdGVwIG9mIHR3byAtIGEgcG9pbnQgYXQgdGhlIHRvcCBvZiB0aGUgZ3JhcGgsIGFuZCBhIHBvaW50IGF0IHRoZSBiYXNlXG5cdFx0XHR2YXIgbWluU3RlcHMgPSAyLFxuXHRcdFx0XHRtYXhTdGVwcyA9IE1hdGguZmxvb3IoZHJhd2luZ1NpemUvKHRleHRTaXplICogMS41KSksXG5cdFx0XHRcdHNraXBGaXR0aW5nID0gKG1pblN0ZXBzID49IG1heFN0ZXBzKTtcblxuXHRcdFx0dmFyIG1heFZhbHVlID0gbWF4KHZhbHVlc0FycmF5KSxcblx0XHRcdFx0bWluVmFsdWUgPSBtaW4odmFsdWVzQXJyYXkpO1xuXG5cdFx0XHQvLyBXZSBuZWVkIHNvbWUgZGVncmVlIG9mIHNlcGVyYXRpb24gaGVyZSB0byBjYWxjdWxhdGUgdGhlIHNjYWxlcyBpZiBhbGwgdGhlIHZhbHVlcyBhcmUgdGhlIHNhbWVcblx0XHRcdC8vIEFkZGluZy9taW51c2luZyAwLjUgd2lsbCBnaXZlIHVzIGEgcmFuZ2Ugb2YgMS5cblx0XHRcdGlmIChtYXhWYWx1ZSA9PT0gbWluVmFsdWUpe1xuXHRcdFx0XHRtYXhWYWx1ZSArPSAwLjU7XG5cdFx0XHRcdC8vIFNvIHdlIGRvbid0IGVuZCB1cCB3aXRoIGEgZ3JhcGggd2l0aCBhIG5lZ2F0aXZlIHN0YXJ0IHZhbHVlIGlmIHdlJ3ZlIHNhaWQgYWx3YXlzIHN0YXJ0IGZyb20gemVyb1xuXHRcdFx0XHRpZiAobWluVmFsdWUgPj0gMC41ICYmICFzdGFydEZyb21aZXJvKXtcblx0XHRcdFx0XHRtaW5WYWx1ZSAtPSAwLjU7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHQvLyBNYWtlIHVwIGEgd2hvbGUgbnVtYmVyIGFib3ZlIHRoZSB2YWx1ZXNcblx0XHRcdFx0XHRtYXhWYWx1ZSArPSAwLjU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dmFyXHR2YWx1ZVJhbmdlID0gTWF0aC5hYnMobWF4VmFsdWUgLSBtaW5WYWx1ZSksXG5cdFx0XHRcdHJhbmdlT3JkZXJPZk1hZ25pdHVkZSA9IGNhbGN1bGF0ZU9yZGVyT2ZNYWduaXR1ZGUodmFsdWVSYW5nZSksXG5cdFx0XHRcdGdyYXBoTWF4ID0gTWF0aC5jZWlsKG1heFZhbHVlIC8gKDEgKiBNYXRoLnBvdygxMCwgcmFuZ2VPcmRlck9mTWFnbml0dWRlKSkpICogTWF0aC5wb3coMTAsIHJhbmdlT3JkZXJPZk1hZ25pdHVkZSksXG5cdFx0XHRcdGdyYXBoTWluID0gKHN0YXJ0RnJvbVplcm8pID8gMCA6IE1hdGguZmxvb3IobWluVmFsdWUgLyAoMSAqIE1hdGgucG93KDEwLCByYW5nZU9yZGVyT2ZNYWduaXR1ZGUpKSkgKiBNYXRoLnBvdygxMCwgcmFuZ2VPcmRlck9mTWFnbml0dWRlKSxcblx0XHRcdFx0Z3JhcGhSYW5nZSA9IGdyYXBoTWF4IC0gZ3JhcGhNaW4sXG5cdFx0XHRcdHN0ZXBWYWx1ZSA9IE1hdGgucG93KDEwLCByYW5nZU9yZGVyT2ZNYWduaXR1ZGUpLFxuXHRcdFx0XHRudW1iZXJPZlN0ZXBzID0gTWF0aC5yb3VuZChncmFwaFJhbmdlIC8gc3RlcFZhbHVlKTtcblxuXHRcdFx0Ly9JZiB3ZSBoYXZlIG1vcmUgc3BhY2Ugb24gdGhlIGdyYXBoIHdlJ2xsIHVzZSBpdCB0byBnaXZlIG1vcmUgZGVmaW5pdGlvbiB0byB0aGUgZGF0YVxuXHRcdFx0d2hpbGUoKG51bWJlck9mU3RlcHMgPiBtYXhTdGVwcyB8fCAobnVtYmVyT2ZTdGVwcyAqIDIpIDwgbWF4U3RlcHMpICYmICFza2lwRml0dGluZykge1xuXHRcdFx0XHRpZihudW1iZXJPZlN0ZXBzID4gbWF4U3RlcHMpe1xuXHRcdFx0XHRcdHN0ZXBWYWx1ZSAqPTI7XG5cdFx0XHRcdFx0bnVtYmVyT2ZTdGVwcyA9IE1hdGgucm91bmQoZ3JhcGhSYW5nZS9zdGVwVmFsdWUpO1xuXHRcdFx0XHRcdC8vIERvbid0IGV2ZXIgZGVhbCB3aXRoIGEgZGVjaW1hbCBudW1iZXIgb2Ygc3RlcHMgLSBjYW5jZWwgZml0dGluZyBhbmQganVzdCB1c2UgdGhlIG1pbmltdW0gbnVtYmVyIG9mIHN0ZXBzLlxuXHRcdFx0XHRcdGlmIChudW1iZXJPZlN0ZXBzICUgMSAhPT0gMCl7XG5cdFx0XHRcdFx0XHRza2lwRml0dGluZyA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vV2UgY2FuIGZpdCBpbiBkb3VibGUgdGhlIGFtb3VudCBvZiBzY2FsZSBwb2ludHMgb24gdGhlIHNjYWxlXG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0Ly9JZiB1c2VyIGhhcyBkZWNsYXJlZCBpbnRzIG9ubHksIGFuZCB0aGUgc3RlcCB2YWx1ZSBpc24ndCBhIGRlY2ltYWxcblx0XHRcdFx0XHRpZiAoaW50ZWdlcnNPbmx5ICYmIHJhbmdlT3JkZXJPZk1hZ25pdHVkZSA+PSAwKXtcblx0XHRcdFx0XHRcdC8vSWYgdGhlIHVzZXIgaGFzIHNhaWQgaW50ZWdlcnMgb25seSwgd2UgbmVlZCB0byBjaGVjayB0aGF0IG1ha2luZyB0aGUgc2NhbGUgbW9yZSBncmFudWxhciB3b3VsZG4ndCBtYWtlIGl0IGEgZmxvYXRcblx0XHRcdFx0XHRcdGlmKHN0ZXBWYWx1ZS8yICUgMSA9PT0gMCl7XG5cdFx0XHRcdFx0XHRcdHN0ZXBWYWx1ZSAvPTI7XG5cdFx0XHRcdFx0XHRcdG51bWJlck9mU3RlcHMgPSBNYXRoLnJvdW5kKGdyYXBoUmFuZ2Uvc3RlcFZhbHVlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8vSWYgaXQgd291bGQgbWFrZSBpdCBhIGZsb2F0IGJyZWFrIG91dCBvZiB0aGUgbG9vcFxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vSWYgdGhlIHNjYWxlIGRvZXNuJ3QgaGF2ZSB0byBiZSBhbiBpbnQsIG1ha2UgdGhlIHNjYWxlIG1vcmUgZ3JhbnVsYXIgYW55d2F5LlxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRzdGVwVmFsdWUgLz0yO1xuXHRcdFx0XHRcdFx0bnVtYmVyT2ZTdGVwcyA9IE1hdGgucm91bmQoZ3JhcGhSYW5nZS9zdGVwVmFsdWUpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChza2lwRml0dGluZyl7XG5cdFx0XHRcdG51bWJlck9mU3RlcHMgPSBtaW5TdGVwcztcblx0XHRcdFx0c3RlcFZhbHVlID0gZ3JhcGhSYW5nZSAvIG51bWJlck9mU3RlcHM7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHN0ZXBzIDogbnVtYmVyT2ZTdGVwcyxcblx0XHRcdFx0c3RlcFZhbHVlIDogc3RlcFZhbHVlLFxuXHRcdFx0XHRtaW4gOiBncmFwaE1pbixcblx0XHRcdFx0bWF4XHQ6IGdyYXBoTWluICsgKG51bWJlck9mU3RlcHMgKiBzdGVwVmFsdWUpXG5cdFx0XHR9O1xuXG5cdFx0fSxcblx0XHQvKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG5cdFx0Ly8gQmxvd3MgdXAganNoaW50IGVycm9ycyBiYXNlZCBvbiB0aGUgbmV3IEZ1bmN0aW9uIGNvbnN0cnVjdG9yXG5cdFx0Ly9UZW1wbGF0aW5nIG1ldGhvZHNcblx0XHQvL0phdmFzY3JpcHQgbWljcm8gdGVtcGxhdGluZyBieSBKb2huIFJlc2lnIC0gc291cmNlIGF0IGh0dHA6Ly9lam9obi5vcmcvYmxvZy9qYXZhc2NyaXB0LW1pY3JvLXRlbXBsYXRpbmcvXG5cdFx0dGVtcGxhdGUgPSBoZWxwZXJzLnRlbXBsYXRlID0gZnVuY3Rpb24odGVtcGxhdGVTdHJpbmcsIHZhbHVlc09iamVjdCl7XG5cblx0XHRcdC8vIElmIHRlbXBsYXRlU3RyaW5nIGlzIGZ1bmN0aW9uIHJhdGhlciB0aGFuIHN0cmluZy10ZW1wbGF0ZSAtIGNhbGwgdGhlIGZ1bmN0aW9uIGZvciB2YWx1ZXNPYmplY3RcblxuXHRcdFx0aWYodGVtcGxhdGVTdHJpbmcgaW5zdGFuY2VvZiBGdW5jdGlvbil7XG5cdFx0XHQgXHRyZXR1cm4gdGVtcGxhdGVTdHJpbmcodmFsdWVzT2JqZWN0KTtcblx0XHQgXHR9XG5cblx0XHRcdHZhciBjYWNoZSA9IHt9O1xuXHRcdFx0ZnVuY3Rpb24gdG1wbChzdHIsIGRhdGEpe1xuXHRcdFx0XHQvLyBGaWd1cmUgb3V0IGlmIHdlJ3JlIGdldHRpbmcgYSB0ZW1wbGF0ZSwgb3IgaWYgd2UgbmVlZCB0b1xuXHRcdFx0XHQvLyBsb2FkIHRoZSB0ZW1wbGF0ZSAtIGFuZCBiZSBzdXJlIHRvIGNhY2hlIHRoZSByZXN1bHQuXG5cdFx0XHRcdHZhciBmbiA9ICEvXFxXLy50ZXN0KHN0cikgP1xuXHRcdFx0XHRjYWNoZVtzdHJdID0gY2FjaGVbc3RyXSA6XG5cblx0XHRcdFx0Ly8gR2VuZXJhdGUgYSByZXVzYWJsZSBmdW5jdGlvbiB0aGF0IHdpbGwgc2VydmUgYXMgYSB0ZW1wbGF0ZVxuXHRcdFx0XHQvLyBnZW5lcmF0b3IgKGFuZCB3aGljaCB3aWxsIGJlIGNhY2hlZCkuXG5cdFx0XHRcdG5ldyBGdW5jdGlvbihcIm9ialwiLFxuXHRcdFx0XHRcdFwidmFyIHA9W10scHJpbnQ9ZnVuY3Rpb24oKXtwLnB1c2guYXBwbHkocCxhcmd1bWVudHMpO307XCIgK1xuXG5cdFx0XHRcdFx0Ly8gSW50cm9kdWNlIHRoZSBkYXRhIGFzIGxvY2FsIHZhcmlhYmxlcyB1c2luZyB3aXRoKCl7fVxuXHRcdFx0XHRcdFwid2l0aChvYmope3AucHVzaCgnXCIgK1xuXG5cdFx0XHRcdFx0Ly8gQ29udmVydCB0aGUgdGVtcGxhdGUgaW50byBwdXJlIEphdmFTY3JpcHRcblx0XHRcdFx0XHRzdHJcblx0XHRcdFx0XHRcdC5yZXBsYWNlKC9bXFxyXFx0XFxuXS9nLCBcIiBcIilcblx0XHRcdFx0XHRcdC5zcGxpdChcIjwlXCIpLmpvaW4oXCJcXHRcIilcblx0XHRcdFx0XHRcdC5yZXBsYWNlKC8oKF58JT4pW15cXHRdKiknL2csIFwiJDFcXHJcIilcblx0XHRcdFx0XHRcdC5yZXBsYWNlKC9cXHQ9KC4qPyklPi9nLCBcIicsJDEsJ1wiKVxuXHRcdFx0XHRcdFx0LnNwbGl0KFwiXFx0XCIpLmpvaW4oXCInKTtcIilcblx0XHRcdFx0XHRcdC5zcGxpdChcIiU+XCIpLmpvaW4oXCJwLnB1c2goJ1wiKVxuXHRcdFx0XHRcdFx0LnNwbGl0KFwiXFxyXCIpLmpvaW4oXCJcXFxcJ1wiKSArXG5cdFx0XHRcdFx0XCInKTt9cmV0dXJuIHAuam9pbignJyk7XCJcblx0XHRcdFx0KTtcblxuXHRcdFx0XHQvLyBQcm92aWRlIHNvbWUgYmFzaWMgY3VycnlpbmcgdG8gdGhlIHVzZXJcblx0XHRcdFx0cmV0dXJuIGRhdGEgPyBmbiggZGF0YSApIDogZm47XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdG1wbCh0ZW1wbGF0ZVN0cmluZyx2YWx1ZXNPYmplY3QpO1xuXHRcdH0sXG5cdFx0LyoganNoaW50IGlnbm9yZTplbmQgKi9cblx0XHRnZW5lcmF0ZUxhYmVscyA9IGhlbHBlcnMuZ2VuZXJhdGVMYWJlbHMgPSBmdW5jdGlvbih0ZW1wbGF0ZVN0cmluZyxudW1iZXJPZlN0ZXBzLGdyYXBoTWluLHN0ZXBWYWx1ZSl7XG5cdFx0XHR2YXIgbGFiZWxzQXJyYXkgPSBuZXcgQXJyYXkobnVtYmVyT2ZTdGVwcyk7XG5cdFx0XHRpZiAobGFiZWxUZW1wbGF0ZVN0cmluZyl7XG5cdFx0XHRcdGVhY2gobGFiZWxzQXJyYXksZnVuY3Rpb24odmFsLGluZGV4KXtcblx0XHRcdFx0XHRsYWJlbHNBcnJheVtpbmRleF0gPSB0ZW1wbGF0ZSh0ZW1wbGF0ZVN0cmluZyx7dmFsdWU6IChncmFwaE1pbiArIChzdGVwVmFsdWUqKGluZGV4KzEpKSl9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbGFiZWxzQXJyYXk7XG5cdFx0fSxcblx0XHQvLy0tQW5pbWF0aW9uIG1ldGhvZHNcblx0XHQvL0Vhc2luZyBmdW5jdGlvbnMgYWRhcHRlZCBmcm9tIFJvYmVydCBQZW5uZXIncyBlYXNpbmcgZXF1YXRpb25zXG5cdFx0Ly9odHRwOi8vd3d3LnJvYmVydHBlbm5lci5jb20vZWFzaW5nL1xuXHRcdGVhc2luZ0VmZmVjdHMgPSBoZWxwZXJzLmVhc2luZ0VmZmVjdHMgPSB7XG5cdFx0XHRsaW5lYXI6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiB0O1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJblF1YWQ6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiB0ICogdDtcblx0XHRcdH0sXG5cdFx0XHRlYXNlT3V0UXVhZDogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuIC0xICogdCAqICh0IC0gMik7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluT3V0UXVhZDogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0aWYgKCh0IC89IDEgLyAyKSA8IDEpIHJldHVybiAxIC8gMiAqIHQgKiB0O1xuXHRcdFx0XHRyZXR1cm4gLTEgLyAyICogKCgtLXQpICogKHQgLSAyKSAtIDEpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJbkN1YmljOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gdCAqIHQgKiB0O1xuXHRcdFx0fSxcblx0XHRcdGVhc2VPdXRDdWJpYzogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuIDEgKiAoKHQgPSB0IC8gMSAtIDEpICogdCAqIHQgKyAxKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5PdXRDdWJpYzogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0aWYgKCh0IC89IDEgLyAyKSA8IDEpIHJldHVybiAxIC8gMiAqIHQgKiB0ICogdDtcblx0XHRcdFx0cmV0dXJuIDEgLyAyICogKCh0IC09IDIpICogdCAqIHQgKyAyKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5RdWFydDogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuIHQgKiB0ICogdCAqIHQ7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZU91dFF1YXJ0OiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gLTEgKiAoKHQgPSB0IC8gMSAtIDEpICogdCAqIHQgKiB0IC0gMSk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluT3V0UXVhcnQ6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdGlmICgodCAvPSAxIC8gMikgPCAxKSByZXR1cm4gMSAvIDIgKiB0ICogdCAqIHQgKiB0O1xuXHRcdFx0XHRyZXR1cm4gLTEgLyAyICogKCh0IC09IDIpICogdCAqIHQgKiB0IC0gMik7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluUXVpbnQ6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiAxICogKHQgLz0gMSkgKiB0ICogdCAqIHQgKiB0O1xuXHRcdFx0fSxcblx0XHRcdGVhc2VPdXRRdWludDogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuIDEgKiAoKHQgPSB0IC8gMSAtIDEpICogdCAqIHQgKiB0ICogdCArIDEpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJbk91dFF1aW50OiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRpZiAoKHQgLz0gMSAvIDIpIDwgMSkgcmV0dXJuIDEgLyAyICogdCAqIHQgKiB0ICogdCAqIHQ7XG5cdFx0XHRcdHJldHVybiAxIC8gMiAqICgodCAtPSAyKSAqIHQgKiB0ICogdCAqIHQgKyAyKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5TaW5lOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gLTEgKiBNYXRoLmNvcyh0IC8gMSAqIChNYXRoLlBJIC8gMikpICsgMTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlT3V0U2luZTogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuIDEgKiBNYXRoLnNpbih0IC8gMSAqIChNYXRoLlBJIC8gMikpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJbk91dFNpbmU6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiAtMSAvIDIgKiAoTWF0aC5jb3MoTWF0aC5QSSAqIHQgLyAxKSAtIDEpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJbkV4cG86IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiAodCA9PT0gMCkgPyAxIDogMSAqIE1hdGgucG93KDIsIDEwICogKHQgLyAxIC0gMSkpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VPdXRFeHBvOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gKHQgPT09IDEpID8gMSA6IDEgKiAoLU1hdGgucG93KDIsIC0xMCAqIHQgLyAxKSArIDEpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJbk91dEV4cG86IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdGlmICh0ID09PSAwKSByZXR1cm4gMDtcblx0XHRcdFx0aWYgKHQgPT09IDEpIHJldHVybiAxO1xuXHRcdFx0XHRpZiAoKHQgLz0gMSAvIDIpIDwgMSkgcmV0dXJuIDEgLyAyICogTWF0aC5wb3coMiwgMTAgKiAodCAtIDEpKTtcblx0XHRcdFx0cmV0dXJuIDEgLyAyICogKC1NYXRoLnBvdygyLCAtMTAgKiAtLXQpICsgMik7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluQ2lyYzogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0aWYgKHQgPj0gMSkgcmV0dXJuIHQ7XG5cdFx0XHRcdHJldHVybiAtMSAqIChNYXRoLnNxcnQoMSAtICh0IC89IDEpICogdCkgLSAxKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlT3V0Q2lyYzogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuIDEgKiBNYXRoLnNxcnQoMSAtICh0ID0gdCAvIDEgLSAxKSAqIHQpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJbk91dENpcmM6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdGlmICgodCAvPSAxIC8gMikgPCAxKSByZXR1cm4gLTEgLyAyICogKE1hdGguc3FydCgxIC0gdCAqIHQpIC0gMSk7XG5cdFx0XHRcdHJldHVybiAxIC8gMiAqIChNYXRoLnNxcnQoMSAtICh0IC09IDIpICogdCkgKyAxKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5FbGFzdGljOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHR2YXIgcyA9IDEuNzAxNTg7XG5cdFx0XHRcdHZhciBwID0gMDtcblx0XHRcdFx0dmFyIGEgPSAxO1xuXHRcdFx0XHRpZiAodCA9PT0gMCkgcmV0dXJuIDA7XG5cdFx0XHRcdGlmICgodCAvPSAxKSA9PSAxKSByZXR1cm4gMTtcblx0XHRcdFx0aWYgKCFwKSBwID0gMSAqIDAuMztcblx0XHRcdFx0aWYgKGEgPCBNYXRoLmFicygxKSkge1xuXHRcdFx0XHRcdGEgPSAxO1xuXHRcdFx0XHRcdHMgPSBwIC8gNDtcblx0XHRcdFx0fSBlbHNlIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbigxIC8gYSk7XG5cdFx0XHRcdHJldHVybiAtKGEgKiBNYXRoLnBvdygyLCAxMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0ICogMSAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlT3V0RWxhc3RpYzogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0dmFyIHMgPSAxLjcwMTU4O1xuXHRcdFx0XHR2YXIgcCA9IDA7XG5cdFx0XHRcdHZhciBhID0gMTtcblx0XHRcdFx0aWYgKHQgPT09IDApIHJldHVybiAwO1xuXHRcdFx0XHRpZiAoKHQgLz0gMSkgPT0gMSkgcmV0dXJuIDE7XG5cdFx0XHRcdGlmICghcCkgcCA9IDEgKiAwLjM7XG5cdFx0XHRcdGlmIChhIDwgTWF0aC5hYnMoMSkpIHtcblx0XHRcdFx0XHRhID0gMTtcblx0XHRcdFx0XHRzID0gcCAvIDQ7XG5cdFx0XHRcdH0gZWxzZSBzID0gcCAvICgyICogTWF0aC5QSSkgKiBNYXRoLmFzaW4oMSAvIGEpO1xuXHRcdFx0XHRyZXR1cm4gYSAqIE1hdGgucG93KDIsIC0xMCAqIHQpICogTWF0aC5zaW4oKHQgKiAxIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkgKyAxO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJbk91dEVsYXN0aWM6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHZhciBzID0gMS43MDE1ODtcblx0XHRcdFx0dmFyIHAgPSAwO1xuXHRcdFx0XHR2YXIgYSA9IDE7XG5cdFx0XHRcdGlmICh0ID09PSAwKSByZXR1cm4gMDtcblx0XHRcdFx0aWYgKCh0IC89IDEgLyAyKSA9PSAyKSByZXR1cm4gMTtcblx0XHRcdFx0aWYgKCFwKSBwID0gMSAqICgwLjMgKiAxLjUpO1xuXHRcdFx0XHRpZiAoYSA8IE1hdGguYWJzKDEpKSB7XG5cdFx0XHRcdFx0YSA9IDE7XG5cdFx0XHRcdFx0cyA9IHAgLyA0O1xuXHRcdFx0XHR9IGVsc2UgcyA9IHAgLyAoMiAqIE1hdGguUEkpICogTWF0aC5hc2luKDEgLyBhKTtcblx0XHRcdFx0aWYgKHQgPCAxKSByZXR1cm4gLTAuNSAqIChhICogTWF0aC5wb3coMiwgMTAgKiAodCAtPSAxKSkgKiBNYXRoLnNpbigodCAqIDEgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSk7XG5cdFx0XHRcdHJldHVybiBhICogTWF0aC5wb3coMiwgLTEwICogKHQgLT0gMSkpICogTWF0aC5zaW4oKHQgKiAxIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkgKiAwLjUgKyAxO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJbkJhY2s6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHZhciBzID0gMS43MDE1ODtcblx0XHRcdFx0cmV0dXJuIDEgKiAodCAvPSAxKSAqIHQgKiAoKHMgKyAxKSAqIHQgLSBzKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlT3V0QmFjazogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0dmFyIHMgPSAxLjcwMTU4O1xuXHRcdFx0XHRyZXR1cm4gMSAqICgodCA9IHQgLyAxIC0gMSkgKiB0ICogKChzICsgMSkgKiB0ICsgcykgKyAxKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5PdXRCYWNrOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHR2YXIgcyA9IDEuNzAxNTg7XG5cdFx0XHRcdGlmICgodCAvPSAxIC8gMikgPCAxKSByZXR1cm4gMSAvIDIgKiAodCAqIHQgKiAoKChzICo9ICgxLjUyNSkpICsgMSkgKiB0IC0gcykpO1xuXHRcdFx0XHRyZXR1cm4gMSAvIDIgKiAoKHQgLT0gMikgKiB0ICogKCgocyAqPSAoMS41MjUpKSArIDEpICogdCArIHMpICsgMik7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluQm91bmNlOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gMSAtIGVhc2luZ0VmZmVjdHMuZWFzZU91dEJvdW5jZSgxIC0gdCk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZU91dEJvdW5jZTogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0aWYgKCh0IC89IDEpIDwgKDEgLyAyLjc1KSkge1xuXHRcdFx0XHRcdHJldHVybiAxICogKDcuNTYyNSAqIHQgKiB0KTtcblx0XHRcdFx0fSBlbHNlIGlmICh0IDwgKDIgLyAyLjc1KSkge1xuXHRcdFx0XHRcdHJldHVybiAxICogKDcuNTYyNSAqICh0IC09ICgxLjUgLyAyLjc1KSkgKiB0ICsgMC43NSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAodCA8ICgyLjUgLyAyLjc1KSkge1xuXHRcdFx0XHRcdHJldHVybiAxICogKDcuNTYyNSAqICh0IC09ICgyLjI1IC8gMi43NSkpICogdCArIDAuOTM3NSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIDEgKiAoNy41NjI1ICogKHQgLT0gKDIuNjI1IC8gMi43NSkpICogdCArIDAuOTg0Mzc1KTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGVhc2VJbk91dEJvdW5jZTogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0aWYgKHQgPCAxIC8gMikgcmV0dXJuIGVhc2luZ0VmZmVjdHMuZWFzZUluQm91bmNlKHQgKiAyKSAqIDAuNTtcblx0XHRcdFx0cmV0dXJuIGVhc2luZ0VmZmVjdHMuZWFzZU91dEJvdW5jZSh0ICogMiAtIDEpICogMC41ICsgMSAqIDAuNTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vUmVxdWVzdCBhbmltYXRpb24gcG9seWZpbGwgLSBodHRwOi8vd3d3LnBhdWxpcmlzaC5jb20vMjAxMS9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWFuaW1hdGluZy9cblx0XHRyZXF1ZXN0QW5pbUZyYW1lID0gaGVscGVycy5yZXF1ZXN0QW5pbUZyYW1lID0gKGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuXHRcdFx0XHR3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG5cdFx0XHRcdHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcblx0XHRcdFx0d2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcblx0XHRcdFx0d2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG5cdFx0XHRcdGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xuXHRcdFx0XHR9O1xuXHRcdH0pKCksXG5cdFx0Y2FuY2VsQW5pbUZyYW1lID0gaGVscGVycy5jYW5jZWxBbmltRnJhbWUgPSAoZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcblx0XHRcdFx0d2luZG93LndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG5cdFx0XHRcdHdpbmRvdy5tb3pDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuXHRcdFx0XHR3aW5kb3cub0NhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG5cdFx0XHRcdHdpbmRvdy5tc0NhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG5cdFx0XHRcdGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHdpbmRvdy5jbGVhclRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XG5cdFx0XHRcdH07XG5cdFx0fSkoKSxcblx0XHRhbmltYXRpb25Mb29wID0gaGVscGVycy5hbmltYXRpb25Mb29wID0gZnVuY3Rpb24oY2FsbGJhY2ssdG90YWxTdGVwcyxlYXNpbmdTdHJpbmcsb25Qcm9ncmVzcyxvbkNvbXBsZXRlLGNoYXJ0SW5zdGFuY2Upe1xuXG5cdFx0XHR2YXIgY3VycmVudFN0ZXAgPSAwLFxuXHRcdFx0XHRlYXNpbmdGdW5jdGlvbiA9IGVhc2luZ0VmZmVjdHNbZWFzaW5nU3RyaW5nXSB8fCBlYXNpbmdFZmZlY3RzLmxpbmVhcjtcblxuXHRcdFx0dmFyIGFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0Y3VycmVudFN0ZXArKztcblx0XHRcdFx0dmFyIHN0ZXBEZWNpbWFsID0gY3VycmVudFN0ZXAvdG90YWxTdGVwcztcblx0XHRcdFx0dmFyIGVhc2VEZWNpbWFsID0gZWFzaW5nRnVuY3Rpb24oc3RlcERlY2ltYWwpO1xuXG5cdFx0XHRcdGNhbGxiYWNrLmNhbGwoY2hhcnRJbnN0YW5jZSxlYXNlRGVjaW1hbCxzdGVwRGVjaW1hbCwgY3VycmVudFN0ZXApO1xuXHRcdFx0XHRvblByb2dyZXNzLmNhbGwoY2hhcnRJbnN0YW5jZSxlYXNlRGVjaW1hbCxzdGVwRGVjaW1hbCk7XG5cdFx0XHRcdGlmIChjdXJyZW50U3RlcCA8IHRvdGFsU3RlcHMpe1xuXHRcdFx0XHRcdGNoYXJ0SW5zdGFuY2UuYW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbUZyYW1lKGFuaW1hdGlvbkZyYW1lKTtcblx0XHRcdFx0fSBlbHNle1xuXHRcdFx0XHRcdG9uQ29tcGxldGUuYXBwbHkoY2hhcnRJbnN0YW5jZSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRyZXF1ZXN0QW5pbUZyYW1lKGFuaW1hdGlvbkZyYW1lKTtcblx0XHR9LFxuXHRcdC8vLS0gRE9NIG1ldGhvZHNcblx0XHRnZXRSZWxhdGl2ZVBvc2l0aW9uID0gaGVscGVycy5nZXRSZWxhdGl2ZVBvc2l0aW9uID0gZnVuY3Rpb24oZXZ0KXtcblx0XHRcdHZhciBtb3VzZVgsIG1vdXNlWTtcblx0XHRcdHZhciBlID0gZXZ0Lm9yaWdpbmFsRXZlbnQgfHwgZXZ0LFxuXHRcdFx0XHRjYW52YXMgPSBldnQuY3VycmVudFRhcmdldCB8fCBldnQuc3JjRWxlbWVudCxcblx0XHRcdFx0Ym91bmRpbmdSZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG5cdFx0XHRpZiAoZS50b3VjaGVzKXtcblx0XHRcdFx0bW91c2VYID0gZS50b3VjaGVzWzBdLmNsaWVudFggLSBib3VuZGluZ1JlY3QubGVmdDtcblx0XHRcdFx0bW91c2VZID0gZS50b3VjaGVzWzBdLmNsaWVudFkgLSBib3VuZGluZ1JlY3QudG9wO1xuXG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRtb3VzZVggPSBlLmNsaWVudFggLSBib3VuZGluZ1JlY3QubGVmdDtcblx0XHRcdFx0bW91c2VZID0gZS5jbGllbnRZIC0gYm91bmRpbmdSZWN0LnRvcDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0eCA6IG1vdXNlWCxcblx0XHRcdFx0eSA6IG1vdXNlWVxuXHRcdFx0fTtcblxuXHRcdH0sXG5cdFx0YWRkRXZlbnQgPSBoZWxwZXJzLmFkZEV2ZW50ID0gZnVuY3Rpb24obm9kZSxldmVudFR5cGUsbWV0aG9kKXtcblx0XHRcdGlmIChub2RlLmFkZEV2ZW50TGlzdGVuZXIpe1xuXHRcdFx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLG1ldGhvZCk7XG5cdFx0XHR9IGVsc2UgaWYgKG5vZGUuYXR0YWNoRXZlbnQpe1xuXHRcdFx0XHRub2RlLmF0dGFjaEV2ZW50KFwib25cIitldmVudFR5cGUsIG1ldGhvZCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRub2RlW1wib25cIitldmVudFR5cGVdID0gbWV0aG9kO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cmVtb3ZlRXZlbnQgPSBoZWxwZXJzLnJlbW92ZUV2ZW50ID0gZnVuY3Rpb24obm9kZSwgZXZlbnRUeXBlLCBoYW5kbGVyKXtcblx0XHRcdGlmIChub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIpe1xuXHRcdFx0XHRub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBoYW5kbGVyLCBmYWxzZSk7XG5cdFx0XHR9IGVsc2UgaWYgKG5vZGUuZGV0YWNoRXZlbnQpe1xuXHRcdFx0XHRub2RlLmRldGFjaEV2ZW50KFwib25cIitldmVudFR5cGUsaGFuZGxlcik7XG5cdFx0XHR9IGVsc2V7XG5cdFx0XHRcdG5vZGVbXCJvblwiICsgZXZlbnRUeXBlXSA9IG5vb3A7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRiaW5kRXZlbnRzID0gaGVscGVycy5iaW5kRXZlbnRzID0gZnVuY3Rpb24oY2hhcnRJbnN0YW5jZSwgYXJyYXlPZkV2ZW50cywgaGFuZGxlcil7XG5cdFx0XHQvLyBDcmVhdGUgdGhlIGV2ZW50cyBvYmplY3QgaWYgaXQncyBub3QgYWxyZWFkeSBwcmVzZW50XG5cdFx0XHRpZiAoIWNoYXJ0SW5zdGFuY2UuZXZlbnRzKSBjaGFydEluc3RhbmNlLmV2ZW50cyA9IHt9O1xuXG5cdFx0XHRlYWNoKGFycmF5T2ZFdmVudHMsZnVuY3Rpb24oZXZlbnROYW1lKXtcblx0XHRcdFx0Y2hhcnRJbnN0YW5jZS5ldmVudHNbZXZlbnROYW1lXSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0aGFuZGxlci5hcHBseShjaGFydEluc3RhbmNlLCBhcmd1bWVudHMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRhZGRFdmVudChjaGFydEluc3RhbmNlLmNoYXJ0LmNhbnZhcyxldmVudE5hbWUsY2hhcnRJbnN0YW5jZS5ldmVudHNbZXZlbnROYW1lXSk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdHVuYmluZEV2ZW50cyA9IGhlbHBlcnMudW5iaW5kRXZlbnRzID0gZnVuY3Rpb24gKGNoYXJ0SW5zdGFuY2UsIGFycmF5T2ZFdmVudHMpIHtcblx0XHRcdGVhY2goYXJyYXlPZkV2ZW50cywgZnVuY3Rpb24oaGFuZGxlcixldmVudE5hbWUpe1xuXHRcdFx0XHRyZW1vdmVFdmVudChjaGFydEluc3RhbmNlLmNoYXJ0LmNhbnZhcywgZXZlbnROYW1lLCBoYW5kbGVyKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0Z2V0TWF4aW11bVdpZHRoID0gaGVscGVycy5nZXRNYXhpbXVtV2lkdGggPSBmdW5jdGlvbihkb21Ob2RlKXtcblx0XHRcdHZhciBjb250YWluZXIgPSBkb21Ob2RlLnBhcmVudE5vZGU7XG5cdFx0XHQvLyBUT0RPID0gY2hlY2sgY3Jvc3MgYnJvd3NlciBzdHVmZiB3aXRoIHRoaXMuXG5cdFx0XHRyZXR1cm4gY29udGFpbmVyLmNsaWVudFdpZHRoO1xuXHRcdH0sXG5cdFx0Z2V0TWF4aW11bUhlaWdodCA9IGhlbHBlcnMuZ2V0TWF4aW11bUhlaWdodCA9IGZ1bmN0aW9uKGRvbU5vZGUpe1xuXHRcdFx0dmFyIGNvbnRhaW5lciA9IGRvbU5vZGUucGFyZW50Tm9kZTtcblx0XHRcdC8vIFRPRE8gPSBjaGVjayBjcm9zcyBicm93c2VyIHN0dWZmIHdpdGggdGhpcy5cblx0XHRcdHJldHVybiBjb250YWluZXIuY2xpZW50SGVpZ2h0O1xuXHRcdH0sXG5cdFx0Z2V0TWF4aW11bVNpemUgPSBoZWxwZXJzLmdldE1heGltdW1TaXplID0gaGVscGVycy5nZXRNYXhpbXVtV2lkdGgsIC8vIGxlZ2FjeSBzdXBwb3J0XG5cdFx0cmV0aW5hU2NhbGUgPSBoZWxwZXJzLnJldGluYVNjYWxlID0gZnVuY3Rpb24oY2hhcnQpe1xuXHRcdFx0dmFyIGN0eCA9IGNoYXJ0LmN0eCxcblx0XHRcdFx0d2lkdGggPSBjaGFydC5jYW52YXMud2lkdGgsXG5cdFx0XHRcdGhlaWdodCA9IGNoYXJ0LmNhbnZhcy5oZWlnaHQ7XG5cblx0XHRcdGlmICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbykge1xuXHRcdFx0XHRjdHguY2FudmFzLnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XG5cdFx0XHRcdGN0eC5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgXCJweFwiO1xuXHRcdFx0XHRjdHguY2FudmFzLmhlaWdodCA9IGhlaWdodCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuXHRcdFx0XHRjdHguY2FudmFzLndpZHRoID0gd2lkdGggKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcblx0XHRcdFx0Y3R4LnNjYWxlKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvLCB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvLy0tIENhbnZhcyBtZXRob2RzXG5cdFx0Y2xlYXIgPSBoZWxwZXJzLmNsZWFyID0gZnVuY3Rpb24oY2hhcnQpe1xuXHRcdFx0Y2hhcnQuY3R4LmNsZWFyUmVjdCgwLDAsY2hhcnQud2lkdGgsY2hhcnQuaGVpZ2h0KTtcblx0XHR9LFxuXHRcdGZvbnRTdHJpbmcgPSBoZWxwZXJzLmZvbnRTdHJpbmcgPSBmdW5jdGlvbihwaXhlbFNpemUsZm9udFN0eWxlLGZvbnRGYW1pbHkpe1xuXHRcdFx0cmV0dXJuIGZvbnRTdHlsZSArIFwiIFwiICsgcGl4ZWxTaXplK1wicHggXCIgKyBmb250RmFtaWx5O1xuXHRcdH0sXG5cdFx0bG9uZ2VzdFRleHQgPSBoZWxwZXJzLmxvbmdlc3RUZXh0ID0gZnVuY3Rpb24oY3R4LGZvbnQsYXJyYXlPZlN0cmluZ3Mpe1xuXHRcdFx0Y3R4LmZvbnQgPSBmb250O1xuXHRcdFx0dmFyIGxvbmdlc3QgPSAwO1xuXHRcdFx0ZWFjaChhcnJheU9mU3RyaW5ncyxmdW5jdGlvbihzdHJpbmcpe1xuXHRcdFx0XHR2YXIgdGV4dFdpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KHN0cmluZykud2lkdGg7XG5cdFx0XHRcdGxvbmdlc3QgPSAodGV4dFdpZHRoID4gbG9uZ2VzdCkgPyB0ZXh0V2lkdGggOiBsb25nZXN0O1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbG9uZ2VzdDtcblx0XHR9LFxuXHRcdGRyYXdSb3VuZGVkUmVjdGFuZ2xlID0gaGVscGVycy5kcmF3Um91bmRlZFJlY3RhbmdsZSA9IGZ1bmN0aW9uKGN0eCx4LHksd2lkdGgsaGVpZ2h0LHJhZGl1cyl7XG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRjdHgubW92ZVRvKHggKyByYWRpdXMsIHkpO1xuXHRcdFx0Y3R4LmxpbmVUbyh4ICsgd2lkdGggLSByYWRpdXMsIHkpO1xuXHRcdFx0Y3R4LnF1YWRyYXRpY0N1cnZlVG8oeCArIHdpZHRoLCB5LCB4ICsgd2lkdGgsIHkgKyByYWRpdXMpO1xuXHRcdFx0Y3R4LmxpbmVUbyh4ICsgd2lkdGgsIHkgKyBoZWlnaHQgLSByYWRpdXMpO1xuXHRcdFx0Y3R4LnF1YWRyYXRpY0N1cnZlVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0LCB4ICsgd2lkdGggLSByYWRpdXMsIHkgKyBoZWlnaHQpO1xuXHRcdFx0Y3R4LmxpbmVUbyh4ICsgcmFkaXVzLCB5ICsgaGVpZ2h0KTtcblx0XHRcdGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHkgKyBoZWlnaHQsIHgsIHkgKyBoZWlnaHQgLSByYWRpdXMpO1xuXHRcdFx0Y3R4LmxpbmVUbyh4LCB5ICsgcmFkaXVzKTtcblx0XHRcdGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHksIHggKyByYWRpdXMsIHkpO1xuXHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdH07XG5cblxuXHQvL1N0b3JlIGEgcmVmZXJlbmNlIHRvIGVhY2ggaW5zdGFuY2UgLSBhbGxvd2luZyB1cyB0byBnbG9iYWxseSByZXNpemUgY2hhcnQgaW5zdGFuY2VzIG9uIHdpbmRvdyByZXNpemUuXG5cdC8vRGVzdHJveSBtZXRob2Qgb24gdGhlIGNoYXJ0IHdpbGwgcmVtb3ZlIHRoZSBpbnN0YW5jZSBvZiB0aGUgY2hhcnQgZnJvbSB0aGlzIHJlZmVyZW5jZS5cblx0Q2hhcnQuaW5zdGFuY2VzID0ge307XG5cblx0Q2hhcnQuVHlwZSA9IGZ1bmN0aW9uKGRhdGEsb3B0aW9ucyxjaGFydCl7XG5cdFx0dGhpcy5vcHRpb25zID0gb3B0aW9ucztcblx0XHR0aGlzLmNoYXJ0ID0gY2hhcnQ7XG5cdFx0dGhpcy5pZCA9IHVpZCgpO1xuXHRcdC8vQWRkIHRoZSBjaGFydCBpbnN0YW5jZSB0byB0aGUgZ2xvYmFsIG5hbWVzcGFjZVxuXHRcdENoYXJ0Lmluc3RhbmNlc1t0aGlzLmlkXSA9IHRoaXM7XG5cblx0XHQvLyBJbml0aWFsaXplIGlzIGFsd2F5cyBjYWxsZWQgd2hlbiBhIGNoYXJ0IHR5cGUgaXMgY3JlYXRlZFxuXHRcdC8vIEJ5IGRlZmF1bHQgaXQgaXMgYSBubyBvcCwgYnV0IGl0IHNob3VsZCBiZSBleHRlbmRlZFxuXHRcdGlmIChvcHRpb25zLnJlc3BvbnNpdmUpe1xuXHRcdFx0dGhpcy5yZXNpemUoKTtcblx0XHR9XG5cdFx0dGhpcy5pbml0aWFsaXplLmNhbGwodGhpcyxkYXRhKTtcblx0fTtcblxuXHQvL0NvcmUgbWV0aG9kcyB0aGF0J2xsIGJlIGEgcGFydCBvZiBldmVyeSBjaGFydCB0eXBlXG5cdGV4dGVuZChDaGFydC5UeXBlLnByb3RvdHlwZSx7XG5cdFx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXM7fSxcblx0XHRjbGVhciA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRjbGVhcih0aGlzLmNoYXJ0KTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cdFx0c3RvcCA6IGZ1bmN0aW9uKCl7XG5cdFx0XHQvLyBTdG9wcyBhbnkgY3VycmVudCBhbmltYXRpb24gbG9vcCBvY2N1cmluZ1xuXHRcdFx0Y2FuY2VsQW5pbUZyYW1lKHRoaXMuYW5pbWF0aW9uRnJhbWUpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHRyZXNpemUgOiBmdW5jdGlvbihjYWxsYmFjayl7XG5cdFx0XHR0aGlzLnN0b3AoKTtcblx0XHRcdHZhciBjYW52YXMgPSB0aGlzLmNoYXJ0LmNhbnZhcyxcblx0XHRcdFx0bmV3V2lkdGggPSBnZXRNYXhpbXVtV2lkdGgodGhpcy5jaGFydC5jYW52YXMpLFxuXHRcdFx0XHRuZXdIZWlnaHQgPSB0aGlzLm9wdGlvbnMubWFpbnRhaW5Bc3BlY3RSYXRpbyA/IG5ld1dpZHRoIC8gdGhpcy5jaGFydC5hc3BlY3RSYXRpbyA6IGdldE1heGltdW1IZWlnaHQodGhpcy5jaGFydC5jYW52YXMpO1xuXG5cdFx0XHRjYW52YXMud2lkdGggPSB0aGlzLmNoYXJ0LndpZHRoID0gbmV3V2lkdGg7XG5cdFx0XHRjYW52YXMuaGVpZ2h0ID0gdGhpcy5jaGFydC5oZWlnaHQgPSBuZXdIZWlnaHQ7XG5cblx0XHRcdHJldGluYVNjYWxlKHRoaXMuY2hhcnQpO1xuXG5cdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpe1xuXHRcdFx0XHRjYWxsYmFjay5hcHBseSh0aGlzLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cdFx0cmVmbG93IDogbm9vcCxcblx0XHRyZW5kZXIgOiBmdW5jdGlvbihyZWZsb3cpe1xuXHRcdFx0aWYgKHJlZmxvdyl7XG5cdFx0XHRcdHRoaXMucmVmbG93KCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbiAmJiAhcmVmbG93KXtcblx0XHRcdFx0aGVscGVycy5hbmltYXRpb25Mb29wKFxuXHRcdFx0XHRcdHRoaXMuZHJhdyxcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMuYW5pbWF0aW9uU3RlcHMsXG5cdFx0XHRcdFx0dGhpcy5vcHRpb25zLmFuaW1hdGlvbkVhc2luZyxcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMub25BbmltYXRpb25Qcm9ncmVzcyxcblx0XHRcdFx0XHR0aGlzLm9wdGlvbnMub25BbmltYXRpb25Db21wbGV0ZSxcblx0XHRcdFx0XHR0aGlzXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHR0aGlzLmRyYXcoKTtcblx0XHRcdFx0dGhpcy5vcHRpb25zLm9uQW5pbWF0aW9uQ29tcGxldGUuY2FsbCh0aGlzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cdFx0Z2VuZXJhdGVMZWdlbmQgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHRlbXBsYXRlKHRoaXMub3B0aW9ucy5sZWdlbmRUZW1wbGF0ZSx0aGlzKTtcblx0XHR9LFxuXHRcdGRlc3Ryb3kgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5jbGVhcigpO1xuXHRcdFx0dW5iaW5kRXZlbnRzKHRoaXMsIHRoaXMuZXZlbnRzKTtcblx0XHRcdHZhciBjYW52YXMgPSB0aGlzLmNoYXJ0LmNhbnZhcztcblxuXHRcdFx0Ly8gUmVzZXQgY2FudmFzIGhlaWdodC93aWR0aCBhdHRyaWJ1dGVzIHN0YXJ0cyBhIGZyZXNoIHdpdGggdGhlIGNhbnZhcyBjb250ZXh0XG5cdFx0XHRjYW52YXMud2lkdGggPSB0aGlzLmNoYXJ0LndpZHRoO1xuXHRcdFx0Y2FudmFzLmhlaWdodCA9IHRoaXMuY2hhcnQuaGVpZ2h0O1xuXG5cdFx0XHQvLyA8IElFOSBkb2Vzbid0IHN1cHBvcnQgcmVtb3ZlUHJvcGVydHlcblx0XHRcdGlmIChjYW52YXMuc3R5bGUucmVtb3ZlUHJvcGVydHkpIHtcblx0XHRcdFx0Y2FudmFzLnN0eWxlLnJlbW92ZVByb3BlcnR5KCd3aWR0aCcpO1xuXHRcdFx0XHRjYW52YXMuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ2hlaWdodCcpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2FudmFzLnN0eWxlLnJlbW92ZUF0dHJpYnV0ZSgnd2lkdGgnKTtcblx0XHRcdFx0Y2FudmFzLnN0eWxlLnJlbW92ZUF0dHJpYnV0ZSgnaGVpZ2h0Jyk7XG5cdFx0XHR9XG5cblx0XHRcdGRlbGV0ZSBDaGFydC5pbnN0YW5jZXNbdGhpcy5pZF07XG5cdFx0fSxcblx0XHRzaG93VG9vbHRpcCA6IGZ1bmN0aW9uKENoYXJ0RWxlbWVudHMsIGZvcmNlUmVkcmF3KXtcblx0XHRcdC8vIE9ubHkgcmVkcmF3IHRoZSBjaGFydCBpZiB3ZSd2ZSBhY3R1YWxseSBjaGFuZ2VkIHdoYXQgd2UncmUgaG92ZXJpbmcgb24uXG5cdFx0XHRpZiAodHlwZW9mIHRoaXMuYWN0aXZlRWxlbWVudHMgPT09ICd1bmRlZmluZWQnKSB0aGlzLmFjdGl2ZUVsZW1lbnRzID0gW107XG5cblx0XHRcdHZhciBpc0NoYW5nZWQgPSAoZnVuY3Rpb24oRWxlbWVudHMpe1xuXHRcdFx0XHR2YXIgY2hhbmdlZCA9IGZhbHNlO1xuXG5cdFx0XHRcdGlmIChFbGVtZW50cy5sZW5ndGggIT09IHRoaXMuYWN0aXZlRWxlbWVudHMubGVuZ3RoKXtcblx0XHRcdFx0XHRjaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRyZXR1cm4gY2hhbmdlZDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVhY2goRWxlbWVudHMsIGZ1bmN0aW9uKGVsZW1lbnQsIGluZGV4KXtcblx0XHRcdFx0XHRpZiAoZWxlbWVudCAhPT0gdGhpcy5hY3RpdmVFbGVtZW50c1tpbmRleF0pe1xuXHRcdFx0XHRcdFx0Y2hhbmdlZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCB0aGlzKTtcblx0XHRcdFx0cmV0dXJuIGNoYW5nZWQ7XG5cdFx0XHR9KS5jYWxsKHRoaXMsIENoYXJ0RWxlbWVudHMpO1xuXG5cdFx0XHRpZiAoIWlzQ2hhbmdlZCAmJiAhZm9yY2VSZWRyYXcpe1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHR0aGlzLmFjdGl2ZUVsZW1lbnRzID0gQ2hhcnRFbGVtZW50cztcblx0XHRcdH1cblx0XHRcdHRoaXMuZHJhdygpO1xuXHRcdFx0aWYodGhpcy5vcHRpb25zLmN1c3RvbVRvb2x0aXBzKXtcblx0XHRcdFx0dGhpcy5vcHRpb25zLmN1c3RvbVRvb2x0aXBzKGZhbHNlKTtcblx0XHRcdH1cblx0XHRcdGlmIChDaGFydEVsZW1lbnRzLmxlbmd0aCA+IDApe1xuXHRcdFx0XHQvLyBJZiB3ZSBoYXZlIG11bHRpcGxlIGRhdGFzZXRzLCBzaG93IGEgTXVsdGlUb29sdGlwIGZvciBhbGwgb2YgdGhlIGRhdGEgcG9pbnRzIGF0IHRoYXQgaW5kZXhcblx0XHRcdFx0aWYgKHRoaXMuZGF0YXNldHMgJiYgdGhpcy5kYXRhc2V0cy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0dmFyIGRhdGFBcnJheSxcblx0XHRcdFx0XHRcdGRhdGFJbmRleDtcblxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSB0aGlzLmRhdGFzZXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdFx0XHRkYXRhQXJyYXkgPSB0aGlzLmRhdGFzZXRzW2ldLnBvaW50cyB8fCB0aGlzLmRhdGFzZXRzW2ldLmJhcnMgfHwgdGhpcy5kYXRhc2V0c1tpXS5zZWdtZW50cztcblx0XHRcdFx0XHRcdGRhdGFJbmRleCA9IGluZGV4T2YoZGF0YUFycmF5LCBDaGFydEVsZW1lbnRzWzBdKTtcblx0XHRcdFx0XHRcdGlmIChkYXRhSW5kZXggIT09IC0xKXtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZhciB0b29sdGlwTGFiZWxzID0gW10sXG5cdFx0XHRcdFx0XHR0b29sdGlwQ29sb3JzID0gW10sXG5cdFx0XHRcdFx0XHRtZWRpYW5Qb3NpdGlvbiA9IChmdW5jdGlvbihpbmRleCkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIEdldCBhbGwgdGhlIHBvaW50cyBhdCB0aGF0IHBhcnRpY3VsYXIgaW5kZXhcblx0XHRcdFx0XHRcdFx0dmFyIEVsZW1lbnRzID0gW10sXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUNvbGxlY3Rpb24sXG5cdFx0XHRcdFx0XHRcdFx0eFBvc2l0aW9ucyA9IFtdLFxuXHRcdFx0XHRcdFx0XHRcdHlQb3NpdGlvbnMgPSBbXSxcblx0XHRcdFx0XHRcdFx0XHR4TWF4LFxuXHRcdFx0XHRcdFx0XHRcdHlNYXgsXG5cdFx0XHRcdFx0XHRcdFx0eE1pbixcblx0XHRcdFx0XHRcdFx0XHR5TWluO1xuXHRcdFx0XHRcdFx0XHRoZWxwZXJzLmVhY2godGhpcy5kYXRhc2V0cywgZnVuY3Rpb24oZGF0YXNldCl7XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUNvbGxlY3Rpb24gPSBkYXRhc2V0LnBvaW50cyB8fCBkYXRhc2V0LmJhcnMgfHwgZGF0YXNldC5zZWdtZW50cztcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGF0YUNvbGxlY3Rpb25bZGF0YUluZGV4XSAmJiBkYXRhQ29sbGVjdGlvbltkYXRhSW5kZXhdLmhhc1ZhbHVlKCkpe1xuXHRcdFx0XHRcdFx0XHRcdFx0RWxlbWVudHMucHVzaChkYXRhQ29sbGVjdGlvbltkYXRhSW5kZXhdKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdGhlbHBlcnMuZWFjaChFbGVtZW50cywgZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdFx0XHRcdFx0XHRcdHhQb3NpdGlvbnMucHVzaChlbGVtZW50LngpO1xuXHRcdFx0XHRcdFx0XHRcdHlQb3NpdGlvbnMucHVzaChlbGVtZW50LnkpO1xuXG5cblx0XHRcdFx0XHRcdFx0XHQvL0luY2x1ZGUgYW55IGNvbG91ciBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZWxlbWVudFxuXHRcdFx0XHRcdFx0XHRcdHRvb2x0aXBMYWJlbHMucHVzaChoZWxwZXJzLnRlbXBsYXRlKHRoaXMub3B0aW9ucy5tdWx0aVRvb2x0aXBUZW1wbGF0ZSwgZWxlbWVudCkpO1xuXHRcdFx0XHRcdFx0XHRcdHRvb2x0aXBDb2xvcnMucHVzaCh7XG5cdFx0XHRcdFx0XHRcdFx0XHRmaWxsOiBlbGVtZW50Ll9zYXZlZC5maWxsQ29sb3IgfHwgZWxlbWVudC5maWxsQ29sb3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRzdHJva2U6IGVsZW1lbnQuX3NhdmVkLnN0cm9rZUNvbG9yIHx8IGVsZW1lbnQuc3Ryb2tlQ29sb3Jcblx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHR9LCB0aGlzKTtcblxuXHRcdFx0XHRcdFx0XHR5TWluID0gbWluKHlQb3NpdGlvbnMpO1xuXHRcdFx0XHRcdFx0XHR5TWF4ID0gbWF4KHlQb3NpdGlvbnMpO1xuXG5cdFx0XHRcdFx0XHRcdHhNaW4gPSBtaW4oeFBvc2l0aW9ucyk7XG5cdFx0XHRcdFx0XHRcdHhNYXggPSBtYXgoeFBvc2l0aW9ucyk7XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHR4OiAoeE1pbiA+IHRoaXMuY2hhcnQud2lkdGgvMikgPyB4TWluIDogeE1heCxcblx0XHRcdFx0XHRcdFx0XHR5OiAoeU1pbiArIHlNYXgpLzJcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH0pLmNhbGwodGhpcywgZGF0YUluZGV4KTtcblxuXHRcdFx0XHRcdG5ldyBDaGFydC5NdWx0aVRvb2x0aXAoe1xuXHRcdFx0XHRcdFx0eDogbWVkaWFuUG9zaXRpb24ueCxcblx0XHRcdFx0XHRcdHk6IG1lZGlhblBvc2l0aW9uLnksXG5cdFx0XHRcdFx0XHR4UGFkZGluZzogdGhpcy5vcHRpb25zLnRvb2x0aXBYUGFkZGluZyxcblx0XHRcdFx0XHRcdHlQYWRkaW5nOiB0aGlzLm9wdGlvbnMudG9vbHRpcFlQYWRkaW5nLFxuXHRcdFx0XHRcdFx0eE9mZnNldDogdGhpcy5vcHRpb25zLnRvb2x0aXBYT2Zmc2V0LFxuXHRcdFx0XHRcdFx0ZmlsbENvbG9yOiB0aGlzLm9wdGlvbnMudG9vbHRpcEZpbGxDb2xvcixcblx0XHRcdFx0XHRcdHRleHRDb2xvcjogdGhpcy5vcHRpb25zLnRvb2x0aXBGb250Q29sb3IsXG5cdFx0XHRcdFx0XHRmb250RmFtaWx5OiB0aGlzLm9wdGlvbnMudG9vbHRpcEZvbnRGYW1pbHksXG5cdFx0XHRcdFx0XHRmb250U3R5bGU6IHRoaXMub3B0aW9ucy50b29sdGlwRm9udFN0eWxlLFxuXHRcdFx0XHRcdFx0Zm9udFNpemU6IHRoaXMub3B0aW9ucy50b29sdGlwRm9udFNpemUsXG5cdFx0XHRcdFx0XHR0aXRsZVRleHRDb2xvcjogdGhpcy5vcHRpb25zLnRvb2x0aXBUaXRsZUZvbnRDb2xvcixcblx0XHRcdFx0XHRcdHRpdGxlRm9udEZhbWlseTogdGhpcy5vcHRpb25zLnRvb2x0aXBUaXRsZUZvbnRGYW1pbHksXG5cdFx0XHRcdFx0XHR0aXRsZUZvbnRTdHlsZTogdGhpcy5vcHRpb25zLnRvb2x0aXBUaXRsZUZvbnRTdHlsZSxcblx0XHRcdFx0XHRcdHRpdGxlRm9udFNpemU6IHRoaXMub3B0aW9ucy50b29sdGlwVGl0bGVGb250U2l6ZSxcblx0XHRcdFx0XHRcdGNvcm5lclJhZGl1czogdGhpcy5vcHRpb25zLnRvb2x0aXBDb3JuZXJSYWRpdXMsXG5cdFx0XHRcdFx0XHRsYWJlbHM6IHRvb2x0aXBMYWJlbHMsXG5cdFx0XHRcdFx0XHRsZWdlbmRDb2xvcnM6IHRvb2x0aXBDb2xvcnMsXG5cdFx0XHRcdFx0XHRsZWdlbmRDb2xvckJhY2tncm91bmQgOiB0aGlzLm9wdGlvbnMubXVsdGlUb29sdGlwS2V5QmFja2dyb3VuZCxcblx0XHRcdFx0XHRcdHRpdGxlOiBDaGFydEVsZW1lbnRzWzBdLmxhYmVsLFxuXHRcdFx0XHRcdFx0Y2hhcnQ6IHRoaXMuY2hhcnQsXG5cdFx0XHRcdFx0XHRjdHg6IHRoaXMuY2hhcnQuY3R4LFxuXHRcdFx0XHRcdFx0Y3VzdG9tOiB0aGlzLm9wdGlvbnMuY3VzdG9tVG9vbHRpcHNcblx0XHRcdFx0XHR9KS5kcmF3KCk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRlYWNoKENoYXJ0RWxlbWVudHMsIGZ1bmN0aW9uKEVsZW1lbnQpIHtcblx0XHRcdFx0XHRcdHZhciB0b29sdGlwUG9zaXRpb24gPSBFbGVtZW50LnRvb2x0aXBQb3NpdGlvbigpO1xuXHRcdFx0XHRcdFx0bmV3IENoYXJ0LlRvb2x0aXAoe1xuXHRcdFx0XHRcdFx0XHR4OiBNYXRoLnJvdW5kKHRvb2x0aXBQb3NpdGlvbi54KSxcblx0XHRcdFx0XHRcdFx0eTogTWF0aC5yb3VuZCh0b29sdGlwUG9zaXRpb24ueSksXG5cdFx0XHRcdFx0XHRcdHhQYWRkaW5nOiB0aGlzLm9wdGlvbnMudG9vbHRpcFhQYWRkaW5nLFxuXHRcdFx0XHRcdFx0XHR5UGFkZGluZzogdGhpcy5vcHRpb25zLnRvb2x0aXBZUGFkZGluZyxcblx0XHRcdFx0XHRcdFx0ZmlsbENvbG9yOiB0aGlzLm9wdGlvbnMudG9vbHRpcEZpbGxDb2xvcixcblx0XHRcdFx0XHRcdFx0dGV4dENvbG9yOiB0aGlzLm9wdGlvbnMudG9vbHRpcEZvbnRDb2xvcixcblx0XHRcdFx0XHRcdFx0Zm9udEZhbWlseTogdGhpcy5vcHRpb25zLnRvb2x0aXBGb250RmFtaWx5LFxuXHRcdFx0XHRcdFx0XHRmb250U3R5bGU6IHRoaXMub3B0aW9ucy50b29sdGlwRm9udFN0eWxlLFxuXHRcdFx0XHRcdFx0XHRmb250U2l6ZTogdGhpcy5vcHRpb25zLnRvb2x0aXBGb250U2l6ZSxcblx0XHRcdFx0XHRcdFx0Y2FyZXRIZWlnaHQ6IHRoaXMub3B0aW9ucy50b29sdGlwQ2FyZXRTaXplLFxuXHRcdFx0XHRcdFx0XHRjb3JuZXJSYWRpdXM6IHRoaXMub3B0aW9ucy50b29sdGlwQ29ybmVyUmFkaXVzLFxuXHRcdFx0XHRcdFx0XHR0ZXh0OiB0ZW1wbGF0ZSh0aGlzLm9wdGlvbnMudG9vbHRpcFRlbXBsYXRlLCBFbGVtZW50KSxcblx0XHRcdFx0XHRcdFx0Y2hhcnQ6IHRoaXMuY2hhcnQsXG5cdFx0XHRcdFx0XHRcdGN1c3RvbTogdGhpcy5vcHRpb25zLmN1c3RvbVRvb2x0aXBzXG5cdFx0XHRcdFx0XHR9KS5kcmF3KCk7XG5cdFx0XHRcdFx0fSwgdGhpcyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cdFx0dG9CYXNlNjRJbWFnZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGhpcy5jaGFydC5jYW52YXMudG9EYXRhVVJMLmFwcGx5KHRoaXMuY2hhcnQuY2FudmFzLCBhcmd1bWVudHMpO1xuXHRcdH1cblx0fSk7XG5cblx0Q2hhcnQuVHlwZS5leHRlbmQgPSBmdW5jdGlvbihleHRlbnNpb25zKXtcblxuXHRcdHZhciBwYXJlbnQgPSB0aGlzO1xuXG5cdFx0dmFyIENoYXJ0VHlwZSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gcGFyZW50LmFwcGx5KHRoaXMsYXJndW1lbnRzKTtcblx0XHR9O1xuXG5cdFx0Ly9Db3B5IHRoZSBwcm90b3R5cGUgb2JqZWN0IG9mIHRoZSB0aGlzIGNsYXNzXG5cdFx0Q2hhcnRUeXBlLnByb3RvdHlwZSA9IGNsb25lKHBhcmVudC5wcm90b3R5cGUpO1xuXHRcdC8vTm93IG92ZXJ3cml0ZSBzb21lIG9mIHRoZSBwcm9wZXJ0aWVzIGluIHRoZSBiYXNlIGNsYXNzIHdpdGggdGhlIG5ldyBleHRlbnNpb25zXG5cdFx0ZXh0ZW5kKENoYXJ0VHlwZS5wcm90b3R5cGUsIGV4dGVuc2lvbnMpO1xuXG5cdFx0Q2hhcnRUeXBlLmV4dGVuZCA9IENoYXJ0LlR5cGUuZXh0ZW5kO1xuXG5cdFx0aWYgKGV4dGVuc2lvbnMubmFtZSB8fCBwYXJlbnQucHJvdG90eXBlLm5hbWUpe1xuXG5cdFx0XHR2YXIgY2hhcnROYW1lID0gZXh0ZW5zaW9ucy5uYW1lIHx8IHBhcmVudC5wcm90b3R5cGUubmFtZTtcblx0XHRcdC8vQXNzaWduIGFueSBwb3RlbnRpYWwgZGVmYXVsdCB2YWx1ZXMgb2YgdGhlIG5ldyBjaGFydCB0eXBlXG5cblx0XHRcdC8vSWYgbm9uZSBhcmUgZGVmaW5lZCwgd2UnbGwgdXNlIGEgY2xvbmUgb2YgdGhlIGNoYXJ0IHR5cGUgdGhpcyBpcyBiZWluZyBleHRlbmRlZCBmcm9tLlxuXHRcdFx0Ly9JLmUuIGlmIHdlIGV4dGVuZCBhIGxpbmUgY2hhcnQsIHdlJ2xsIHVzZSB0aGUgZGVmYXVsdHMgZnJvbSB0aGUgbGluZSBjaGFydCBpZiBvdXIgbmV3IGNoYXJ0XG5cdFx0XHQvL2RvZXNuJ3QgZGVmaW5lIHNvbWUgZGVmYXVsdHMgb2YgdGhlaXIgb3duLlxuXG5cdFx0XHR2YXIgYmFzZURlZmF1bHRzID0gKENoYXJ0LmRlZmF1bHRzW3BhcmVudC5wcm90b3R5cGUubmFtZV0pID8gY2xvbmUoQ2hhcnQuZGVmYXVsdHNbcGFyZW50LnByb3RvdHlwZS5uYW1lXSkgOiB7fTtcblxuXHRcdFx0Q2hhcnQuZGVmYXVsdHNbY2hhcnROYW1lXSA9IGV4dGVuZChiYXNlRGVmYXVsdHMsZXh0ZW5zaW9ucy5kZWZhdWx0cyk7XG5cblx0XHRcdENoYXJ0LnR5cGVzW2NoYXJ0TmFtZV0gPSBDaGFydFR5cGU7XG5cblx0XHRcdC8vUmVnaXN0ZXIgdGhpcyBuZXcgY2hhcnQgdHlwZSBpbiB0aGUgQ2hhcnQgcHJvdG90eXBlXG5cdFx0XHRDaGFydC5wcm90b3R5cGVbY2hhcnROYW1lXSA9IGZ1bmN0aW9uKGRhdGEsb3B0aW9ucyl7XG5cdFx0XHRcdHZhciBjb25maWcgPSBtZXJnZShDaGFydC5kZWZhdWx0cy5nbG9iYWwsIENoYXJ0LmRlZmF1bHRzW2NoYXJ0TmFtZV0sIG9wdGlvbnMgfHwge30pO1xuXHRcdFx0XHRyZXR1cm4gbmV3IENoYXJ0VHlwZShkYXRhLGNvbmZpZyx0aGlzKTtcblx0XHRcdH07XG5cdFx0fSBlbHNle1xuXHRcdFx0d2FybihcIk5hbWUgbm90IHByb3ZpZGVkIGZvciB0aGlzIGNoYXJ0LCBzbyBpdCBoYXNuJ3QgYmVlbiByZWdpc3RlcmVkXCIpO1xuXHRcdH1cblx0XHRyZXR1cm4gcGFyZW50O1xuXHR9O1xuXG5cdENoYXJ0LkVsZW1lbnQgPSBmdW5jdGlvbihjb25maWd1cmF0aW9uKXtcblx0XHRleHRlbmQodGhpcyxjb25maWd1cmF0aW9uKTtcblx0XHR0aGlzLmluaXRpYWxpemUuYXBwbHkodGhpcyxhcmd1bWVudHMpO1xuXHRcdHRoaXMuc2F2ZSgpO1xuXHR9O1xuXHRleHRlbmQoQ2hhcnQuRWxlbWVudC5wcm90b3R5cGUse1xuXHRcdGluaXRpYWxpemUgOiBmdW5jdGlvbigpe30sXG5cdFx0cmVzdG9yZSA6IGZ1bmN0aW9uKHByb3BzKXtcblx0XHRcdGlmICghcHJvcHMpe1xuXHRcdFx0XHRleHRlbmQodGhpcyx0aGlzLl9zYXZlZCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlYWNoKHByb3BzLGZ1bmN0aW9uKGtleSl7XG5cdFx0XHRcdFx0dGhpc1trZXldID0gdGhpcy5fc2F2ZWRba2V5XTtcblx0XHRcdFx0fSx0aGlzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cdFx0c2F2ZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLl9zYXZlZCA9IGNsb25lKHRoaXMpO1xuXHRcdFx0ZGVsZXRlIHRoaXMuX3NhdmVkLl9zYXZlZDtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cdFx0dXBkYXRlIDogZnVuY3Rpb24obmV3UHJvcHMpe1xuXHRcdFx0ZWFjaChuZXdQcm9wcyxmdW5jdGlvbih2YWx1ZSxrZXkpe1xuXHRcdFx0XHR0aGlzLl9zYXZlZFtrZXldID0gdGhpc1trZXldO1xuXHRcdFx0XHR0aGlzW2tleV0gPSB2YWx1ZTtcblx0XHRcdH0sdGhpcyk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXHRcdHRyYW5zaXRpb24gOiBmdW5jdGlvbihwcm9wcyxlYXNlKXtcblx0XHRcdGVhY2gocHJvcHMsZnVuY3Rpb24odmFsdWUsa2V5KXtcblx0XHRcdFx0dGhpc1trZXldID0gKCh2YWx1ZSAtIHRoaXMuX3NhdmVkW2tleV0pICogZWFzZSkgKyB0aGlzLl9zYXZlZFtrZXldO1xuXHRcdFx0fSx0aGlzKTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cdFx0dG9vbHRpcFBvc2l0aW9uIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHggOiB0aGlzLngsXG5cdFx0XHRcdHkgOiB0aGlzLnlcblx0XHRcdH07XG5cdFx0fSxcblx0XHRoYXNWYWx1ZTogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBpc051bWJlcih0aGlzLnZhbHVlKTtcblx0XHR9XG5cdH0pO1xuXG5cdENoYXJ0LkVsZW1lbnQuZXh0ZW5kID0gaW5oZXJpdHM7XG5cblxuXHRDaGFydC5Qb2ludCA9IENoYXJ0LkVsZW1lbnQuZXh0ZW5kKHtcblx0XHRkaXNwbGF5OiB0cnVlLFxuXHRcdGluUmFuZ2U6IGZ1bmN0aW9uKGNoYXJ0WCxjaGFydFkpe1xuXHRcdFx0dmFyIGhpdERldGVjdGlvblJhbmdlID0gdGhpcy5oaXREZXRlY3Rpb25SYWRpdXMgKyB0aGlzLnJhZGl1cztcblx0XHRcdHJldHVybiAoKE1hdGgucG93KGNoYXJ0WC10aGlzLngsIDIpK01hdGgucG93KGNoYXJ0WS10aGlzLnksIDIpKSA8IE1hdGgucG93KGhpdERldGVjdGlvblJhbmdlLDIpKTtcblx0XHR9LFxuXHRcdGRyYXcgOiBmdW5jdGlvbigpe1xuXHRcdFx0aWYgKHRoaXMuZGlzcGxheSl7XG5cdFx0XHRcdHZhciBjdHggPSB0aGlzLmN0eDtcblx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXG5cdFx0XHRcdGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCBNYXRoLlBJKjIpO1xuXHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cblx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gdGhpcy5zdHJva2VDb2xvcjtcblx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IHRoaXMuc3Ryb2tlV2lkdGg7XG5cblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlsbENvbG9yO1xuXG5cdFx0XHRcdGN0eC5maWxsKCk7XG5cdFx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHRcdH1cblxuXG5cdFx0XHQvL1F1aWNrIGRlYnVnIGZvciBiZXppZXIgY3VydmUgc3BsaW5pbmdcblx0XHRcdC8vSGlnaGxpZ2h0cyBjb250cm9sIHBvaW50cyBhbmQgdGhlIGxpbmUgYmV0d2VlbiB0aGVtLlxuXHRcdFx0Ly9IYW5keSBmb3IgZGV2IC0gc3RyaXBwZWQgaW4gdGhlIG1pbiB2ZXJzaW9uLlxuXG5cdFx0XHQvLyBjdHguc2F2ZSgpO1xuXHRcdFx0Ly8gY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcblx0XHRcdC8vIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIlxuXHRcdFx0Ly8gY3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0Ly8gY3R4LmFyYyh0aGlzLmNvbnRyb2xQb2ludHMuaW5uZXIueCx0aGlzLmNvbnRyb2xQb2ludHMuaW5uZXIueSwgMiwgMCwgTWF0aC5QSSoyKTtcblx0XHRcdC8vIGN0eC5maWxsKCk7XG5cblx0XHRcdC8vIGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdC8vIGN0eC5hcmModGhpcy5jb250cm9sUG9pbnRzLm91dGVyLngsdGhpcy5jb250cm9sUG9pbnRzLm91dGVyLnksIDIsIDAsIE1hdGguUEkqMik7XG5cdFx0XHQvLyBjdHguZmlsbCgpO1xuXG5cdFx0XHQvLyBjdHgubW92ZVRvKHRoaXMuY29udHJvbFBvaW50cy5pbm5lci54LHRoaXMuY29udHJvbFBvaW50cy5pbm5lci55KTtcblx0XHRcdC8vIGN0eC5saW5lVG8odGhpcy54LCB0aGlzLnkpO1xuXHRcdFx0Ly8gY3R4LmxpbmVUbyh0aGlzLmNvbnRyb2xQb2ludHMub3V0ZXIueCx0aGlzLmNvbnRyb2xQb2ludHMub3V0ZXIueSk7XG5cdFx0XHQvLyBjdHguc3Ryb2tlKCk7XG5cblx0XHRcdC8vIGN0eC5yZXN0b3JlKCk7XG5cblxuXG5cdFx0fVxuXHR9KTtcblxuXHRDaGFydC5BcmMgPSBDaGFydC5FbGVtZW50LmV4dGVuZCh7XG5cdFx0aW5SYW5nZSA6IGZ1bmN0aW9uKGNoYXJ0WCxjaGFydFkpe1xuXG5cdFx0XHR2YXIgcG9pbnRSZWxhdGl2ZVBvc2l0aW9uID0gaGVscGVycy5nZXRBbmdsZUZyb21Qb2ludCh0aGlzLCB7XG5cdFx0XHRcdHg6IGNoYXJ0WCxcblx0XHRcdFx0eTogY2hhcnRZXG5cdFx0XHR9KTtcblxuXHRcdFx0Ly9DaGVjayBpZiB3aXRoaW4gdGhlIHJhbmdlIG9mIHRoZSBvcGVuL2Nsb3NlIGFuZ2xlXG5cdFx0XHR2YXIgYmV0d2VlbkFuZ2xlcyA9IChwb2ludFJlbGF0aXZlUG9zaXRpb24uYW5nbGUgPj0gdGhpcy5zdGFydEFuZ2xlICYmIHBvaW50UmVsYXRpdmVQb3NpdGlvbi5hbmdsZSA8PSB0aGlzLmVuZEFuZ2xlKSxcblx0XHRcdFx0d2l0aGluUmFkaXVzID0gKHBvaW50UmVsYXRpdmVQb3NpdGlvbi5kaXN0YW5jZSA+PSB0aGlzLmlubmVyUmFkaXVzICYmIHBvaW50UmVsYXRpdmVQb3NpdGlvbi5kaXN0YW5jZSA8PSB0aGlzLm91dGVyUmFkaXVzKTtcblxuXHRcdFx0cmV0dXJuIChiZXR3ZWVuQW5nbGVzICYmIHdpdGhpblJhZGl1cyk7XG5cdFx0XHQvL0Vuc3VyZSB3aXRoaW4gdGhlIG91dHNpZGUgb2YgdGhlIGFyYyBjZW50cmUsIGJ1dCBpbnNpZGUgYXJjIG91dGVyXG5cdFx0fSxcblx0XHR0b29sdGlwUG9zaXRpb24gOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIGNlbnRyZUFuZ2xlID0gdGhpcy5zdGFydEFuZ2xlICsgKCh0aGlzLmVuZEFuZ2xlIC0gdGhpcy5zdGFydEFuZ2xlKSAvIDIpLFxuXHRcdFx0XHRyYW5nZUZyb21DZW50cmUgPSAodGhpcy5vdXRlclJhZGl1cyAtIHRoaXMuaW5uZXJSYWRpdXMpIC8gMiArIHRoaXMuaW5uZXJSYWRpdXM7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR4IDogdGhpcy54ICsgKE1hdGguY29zKGNlbnRyZUFuZ2xlKSAqIHJhbmdlRnJvbUNlbnRyZSksXG5cdFx0XHRcdHkgOiB0aGlzLnkgKyAoTWF0aC5zaW4oY2VudHJlQW5nbGUpICogcmFuZ2VGcm9tQ2VudHJlKVxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGRyYXcgOiBmdW5jdGlvbihhbmltYXRpb25QZXJjZW50KXtcblxuXHRcdFx0dmFyIGVhc2luZ0RlY2ltYWwgPSBhbmltYXRpb25QZXJjZW50IHx8IDE7XG5cblx0XHRcdHZhciBjdHggPSB0aGlzLmN0eDtcblxuXHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXG5cdFx0XHRjdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLm91dGVyUmFkaXVzLCB0aGlzLnN0YXJ0QW5nbGUsIHRoaXMuZW5kQW5nbGUpO1xuXG5cdFx0XHRjdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLmlubmVyUmFkaXVzLCB0aGlzLmVuZEFuZ2xlLCB0aGlzLnN0YXJ0QW5nbGUsIHRydWUpO1xuXG5cdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnN0cm9rZUNvbG9yO1xuXHRcdFx0Y3R4LmxpbmVXaWR0aCA9IHRoaXMuc3Ryb2tlV2lkdGg7XG5cblx0XHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLmZpbGxDb2xvcjtcblxuXHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdGN0eC5saW5lSm9pbiA9ICdiZXZlbCc7XG5cblx0XHRcdGlmICh0aGlzLnNob3dTdHJva2Upe1xuXHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRDaGFydC5SZWN0YW5nbGUgPSBDaGFydC5FbGVtZW50LmV4dGVuZCh7XG5cdFx0ZHJhdyA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgY3R4ID0gdGhpcy5jdHgsXG5cdFx0XHRcdGhhbGZXaWR0aCA9IHRoaXMud2lkdGgvMixcblx0XHRcdFx0bGVmdFggPSB0aGlzLnggLSBoYWxmV2lkdGgsXG5cdFx0XHRcdHJpZ2h0WCA9IHRoaXMueCArIGhhbGZXaWR0aCxcblx0XHRcdFx0dG9wID0gdGhpcy5iYXNlIC0gKHRoaXMuYmFzZSAtIHRoaXMueSksXG5cdFx0XHRcdGhhbGZTdHJva2UgPSB0aGlzLnN0cm9rZVdpZHRoIC8gMjtcblxuXHRcdFx0Ly8gQ2FudmFzIGRvZXNuJ3QgYWxsb3cgdXMgdG8gc3Ryb2tlIGluc2lkZSB0aGUgd2lkdGggc28gd2UgY2FuXG5cdFx0XHQvLyBhZGp1c3QgdGhlIHNpemVzIHRvIGZpdCBpZiB3ZSdyZSBzZXR0aW5nIGEgc3Ryb2tlIG9uIHRoZSBsaW5lXG5cdFx0XHRpZiAodGhpcy5zaG93U3Ryb2tlKXtcblx0XHRcdFx0bGVmdFggKz0gaGFsZlN0cm9rZTtcblx0XHRcdFx0cmlnaHRYIC09IGhhbGZTdHJva2U7XG5cdFx0XHRcdHRvcCArPSBoYWxmU3Ryb2tlO1xuXHRcdFx0fVxuXG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cblx0XHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLmZpbGxDb2xvcjtcblx0XHRcdGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuc3Ryb2tlQ29sb3I7XG5cdFx0XHRjdHgubGluZVdpZHRoID0gdGhpcy5zdHJva2VXaWR0aDtcblxuXHRcdFx0Ly8gSXQnZCBiZSBuaWNlIHRvIGtlZXAgdGhpcyBjbGFzcyB0b3RhbGx5IGdlbmVyaWMgdG8gYW55IHJlY3RhbmdsZVxuXHRcdFx0Ly8gYW5kIHNpbXBseSBzcGVjaWZ5IHdoaWNoIGJvcmRlciB0byBtaXNzIG91dC5cblx0XHRcdGN0eC5tb3ZlVG8obGVmdFgsIHRoaXMuYmFzZSk7XG5cdFx0XHRjdHgubGluZVRvKGxlZnRYLCB0b3ApO1xuXHRcdFx0Y3R4LmxpbmVUbyhyaWdodFgsIHRvcCk7XG5cdFx0XHRjdHgubGluZVRvKHJpZ2h0WCwgdGhpcy5iYXNlKTtcblx0XHRcdGN0eC5maWxsKCk7XG5cdFx0XHRpZiAodGhpcy5zaG93U3Ryb2tlKXtcblx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aGVpZ2h0IDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB0aGlzLmJhc2UgLSB0aGlzLnk7XG5cdFx0fSxcblx0XHRpblJhbmdlIDogZnVuY3Rpb24oY2hhcnRYLGNoYXJ0WSl7XG5cdFx0XHRyZXR1cm4gKGNoYXJ0WCA+PSB0aGlzLnggLSB0aGlzLndpZHRoLzIgJiYgY2hhcnRYIDw9IHRoaXMueCArIHRoaXMud2lkdGgvMikgJiYgKGNoYXJ0WSA+PSB0aGlzLnkgJiYgY2hhcnRZIDw9IHRoaXMuYmFzZSk7XG5cdFx0fVxuXHR9KTtcblxuXHRDaGFydC5Ub29sdGlwID0gQ2hhcnQuRWxlbWVudC5leHRlbmQoe1xuXHRcdGRyYXcgOiBmdW5jdGlvbigpe1xuXG5cdFx0XHR2YXIgY3R4ID0gdGhpcy5jaGFydC5jdHg7XG5cblx0XHRcdGN0eC5mb250ID0gZm9udFN0cmluZyh0aGlzLmZvbnRTaXplLHRoaXMuZm9udFN0eWxlLHRoaXMuZm9udEZhbWlseSk7XG5cblx0XHRcdHRoaXMueEFsaWduID0gXCJjZW50ZXJcIjtcblx0XHRcdHRoaXMueUFsaWduID0gXCJhYm92ZVwiO1xuXG5cdFx0XHQvL0Rpc3RhbmNlIGJldHdlZW4gdGhlIGFjdHVhbCBlbGVtZW50LnkgcG9zaXRpb24gYW5kIHRoZSBzdGFydCBvZiB0aGUgdG9vbHRpcCBjYXJldFxuXHRcdFx0dmFyIGNhcmV0UGFkZGluZyA9IHRoaXMuY2FyZXRQYWRkaW5nID0gMjtcblxuXHRcdFx0dmFyIHRvb2x0aXBXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dCh0aGlzLnRleHQpLndpZHRoICsgMip0aGlzLnhQYWRkaW5nLFxuXHRcdFx0XHR0b29sdGlwUmVjdEhlaWdodCA9IHRoaXMuZm9udFNpemUgKyAyKnRoaXMueVBhZGRpbmcsXG5cdFx0XHRcdHRvb2x0aXBIZWlnaHQgPSB0b29sdGlwUmVjdEhlaWdodCArIHRoaXMuY2FyZXRIZWlnaHQgKyBjYXJldFBhZGRpbmc7XG5cblx0XHRcdGlmICh0aGlzLnggKyB0b29sdGlwV2lkdGgvMiA+dGhpcy5jaGFydC53aWR0aCl7XG5cdFx0XHRcdHRoaXMueEFsaWduID0gXCJsZWZ0XCI7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMueCAtIHRvb2x0aXBXaWR0aC8yIDwgMCl7XG5cdFx0XHRcdHRoaXMueEFsaWduID0gXCJyaWdodFwiO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy55IC0gdG9vbHRpcEhlaWdodCA8IDApe1xuXHRcdFx0XHR0aGlzLnlBbGlnbiA9IFwiYmVsb3dcIjtcblx0XHRcdH1cblxuXG5cdFx0XHR2YXIgdG9vbHRpcFggPSB0aGlzLnggLSB0b29sdGlwV2lkdGgvMixcblx0XHRcdFx0dG9vbHRpcFkgPSB0aGlzLnkgLSB0b29sdGlwSGVpZ2h0O1xuXG5cdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy5maWxsQ29sb3I7XG5cblx0XHRcdC8vIEN1c3RvbSBUb29sdGlwc1xuXHRcdFx0aWYodGhpcy5jdXN0b20pe1xuXHRcdFx0XHR0aGlzLmN1c3RvbSh0aGlzKTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHN3aXRjaCh0aGlzLnlBbGlnbilcblx0XHRcdFx0e1xuXHRcdFx0XHRjYXNlIFwiYWJvdmVcIjpcblx0XHRcdFx0XHQvL0RyYXcgYSBjYXJldCBhYm92ZSB0aGUgeC95XG5cdFx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRcdGN0eC5tb3ZlVG8odGhpcy54LHRoaXMueSAtIGNhcmV0UGFkZGluZyk7XG5cdFx0XHRcdFx0Y3R4LmxpbmVUbyh0aGlzLnggKyB0aGlzLmNhcmV0SGVpZ2h0LCB0aGlzLnkgLSAoY2FyZXRQYWRkaW5nICsgdGhpcy5jYXJldEhlaWdodCkpO1xuXHRcdFx0XHRcdGN0eC5saW5lVG8odGhpcy54IC0gdGhpcy5jYXJldEhlaWdodCwgdGhpcy55IC0gKGNhcmV0UGFkZGluZyArIHRoaXMuY2FyZXRIZWlnaHQpKTtcblx0XHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImJlbG93XCI6XG5cdFx0XHRcdFx0dG9vbHRpcFkgPSB0aGlzLnkgKyBjYXJldFBhZGRpbmcgKyB0aGlzLmNhcmV0SGVpZ2h0O1xuXHRcdFx0XHRcdC8vRHJhdyBhIGNhcmV0IGJlbG93IHRoZSB4L3lcblx0XHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdFx0Y3R4Lm1vdmVUbyh0aGlzLngsIHRoaXMueSArIGNhcmV0UGFkZGluZyk7XG5cdFx0XHRcdFx0Y3R4LmxpbmVUbyh0aGlzLnggKyB0aGlzLmNhcmV0SGVpZ2h0LCB0aGlzLnkgKyBjYXJldFBhZGRpbmcgKyB0aGlzLmNhcmV0SGVpZ2h0KTtcblx0XHRcdFx0XHRjdHgubGluZVRvKHRoaXMueCAtIHRoaXMuY2FyZXRIZWlnaHQsIHRoaXMueSArIGNhcmV0UGFkZGluZyArIHRoaXMuY2FyZXRIZWlnaHQpO1xuXHRcdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0XHRjdHguZmlsbCgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c3dpdGNoKHRoaXMueEFsaWduKVxuXHRcdFx0XHR7XG5cdFx0XHRcdGNhc2UgXCJsZWZ0XCI6XG5cdFx0XHRcdFx0dG9vbHRpcFggPSB0aGlzLnggLSB0b29sdGlwV2lkdGggKyAodGhpcy5jb3JuZXJSYWRpdXMgKyB0aGlzLmNhcmV0SGVpZ2h0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcInJpZ2h0XCI6XG5cdFx0XHRcdFx0dG9vbHRpcFggPSB0aGlzLnggLSAodGhpcy5jb3JuZXJSYWRpdXMgKyB0aGlzLmNhcmV0SGVpZ2h0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGRyYXdSb3VuZGVkUmVjdGFuZ2xlKGN0eCx0b29sdGlwWCx0b29sdGlwWSx0b29sdGlwV2lkdGgsdG9vbHRpcFJlY3RIZWlnaHQsdGhpcy5jb3JuZXJSYWRpdXMpO1xuXG5cdFx0XHRcdGN0eC5maWxsKCk7XG5cblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMudGV4dENvbG9yO1xuXHRcdFx0XHRjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcblx0XHRcdFx0Y3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XG5cdFx0XHRcdGN0eC5maWxsVGV4dCh0aGlzLnRleHQsIHRvb2x0aXBYICsgdG9vbHRpcFdpZHRoLzIsIHRvb2x0aXBZICsgdG9vbHRpcFJlY3RIZWlnaHQvMik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRDaGFydC5NdWx0aVRvb2x0aXAgPSBDaGFydC5FbGVtZW50LmV4dGVuZCh7XG5cdFx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLmZvbnQgPSBmb250U3RyaW5nKHRoaXMuZm9udFNpemUsdGhpcy5mb250U3R5bGUsdGhpcy5mb250RmFtaWx5KTtcblxuXHRcdFx0dGhpcy50aXRsZUZvbnQgPSBmb250U3RyaW5nKHRoaXMudGl0bGVGb250U2l6ZSx0aGlzLnRpdGxlRm9udFN0eWxlLHRoaXMudGl0bGVGb250RmFtaWx5KTtcblxuXHRcdFx0dGhpcy5oZWlnaHQgPSAodGhpcy5sYWJlbHMubGVuZ3RoICogdGhpcy5mb250U2l6ZSkgKyAoKHRoaXMubGFiZWxzLmxlbmd0aC0xKSAqICh0aGlzLmZvbnRTaXplLzIpKSArICh0aGlzLnlQYWRkaW5nKjIpICsgdGhpcy50aXRsZUZvbnRTaXplICoxLjU7XG5cblx0XHRcdHRoaXMuY3R4LmZvbnQgPSB0aGlzLnRpdGxlRm9udDtcblxuXHRcdFx0dmFyIHRpdGxlV2lkdGggPSB0aGlzLmN0eC5tZWFzdXJlVGV4dCh0aGlzLnRpdGxlKS53aWR0aCxcblx0XHRcdFx0Ly9MYWJlbCBoYXMgYSBsZWdlbmQgc3F1YXJlIGFzIHdlbGwgc28gYWNjb3VudCBmb3IgdGhpcy5cblx0XHRcdFx0bGFiZWxXaWR0aCA9IGxvbmdlc3RUZXh0KHRoaXMuY3R4LHRoaXMuZm9udCx0aGlzLmxhYmVscykgKyB0aGlzLmZvbnRTaXplICsgMyxcblx0XHRcdFx0bG9uZ2VzdFRleHRXaWR0aCA9IG1heChbbGFiZWxXaWR0aCx0aXRsZVdpZHRoXSk7XG5cblx0XHRcdHRoaXMud2lkdGggPSBsb25nZXN0VGV4dFdpZHRoICsgKHRoaXMueFBhZGRpbmcqMik7XG5cblxuXHRcdFx0dmFyIGhhbGZIZWlnaHQgPSB0aGlzLmhlaWdodC8yO1xuXG5cdFx0XHQvL0NoZWNrIHRvIGVuc3VyZSB0aGUgaGVpZ2h0IHdpbGwgZml0IG9uIHRoZSBjYW52YXNcblx0XHRcdGlmICh0aGlzLnkgLSBoYWxmSGVpZ2h0IDwgMCApe1xuXHRcdFx0XHR0aGlzLnkgPSBoYWxmSGVpZ2h0O1xuXHRcdFx0fSBlbHNlIGlmICh0aGlzLnkgKyBoYWxmSGVpZ2h0ID4gdGhpcy5jaGFydC5oZWlnaHQpe1xuXHRcdFx0XHR0aGlzLnkgPSB0aGlzLmNoYXJ0LmhlaWdodCAtIGhhbGZIZWlnaHQ7XG5cdFx0XHR9XG5cblx0XHRcdC8vRGVjaWRlIHdoZXRoZXIgdG8gYWxpZ24gbGVmdCBvciByaWdodCBiYXNlZCBvbiBwb3NpdGlvbiBvbiBjYW52YXNcblx0XHRcdGlmICh0aGlzLnggPiB0aGlzLmNoYXJ0LndpZHRoLzIpe1xuXHRcdFx0XHR0aGlzLnggLT0gdGhpcy54T2Zmc2V0ICsgdGhpcy53aWR0aDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMueCArPSB0aGlzLnhPZmZzZXQ7XG5cdFx0XHR9XG5cblxuXHRcdH0sXG5cdFx0Z2V0TGluZUhlaWdodCA6IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRcdHZhciBiYXNlTGluZUhlaWdodCA9IHRoaXMueSAtICh0aGlzLmhlaWdodC8yKSArIHRoaXMueVBhZGRpbmcsXG5cdFx0XHRcdGFmdGVyVGl0bGVJbmRleCA9IGluZGV4LTE7XG5cblx0XHRcdC8vSWYgdGhlIGluZGV4IGlzIHplcm8sIHdlJ3JlIGdldHRpbmcgdGhlIHRpdGxlXG5cdFx0XHRpZiAoaW5kZXggPT09IDApe1xuXHRcdFx0XHRyZXR1cm4gYmFzZUxpbmVIZWlnaHQgKyB0aGlzLnRpdGxlRm9udFNpemUvMjtcblx0XHRcdH0gZWxzZXtcblx0XHRcdFx0cmV0dXJuIGJhc2VMaW5lSGVpZ2h0ICsgKCh0aGlzLmZvbnRTaXplKjEuNSphZnRlclRpdGxlSW5kZXgpICsgdGhpcy5mb250U2l6ZS8yKSArIHRoaXMudGl0bGVGb250U2l6ZSAqIDEuNTtcblx0XHRcdH1cblxuXHRcdH0sXG5cdFx0ZHJhdyA6IGZ1bmN0aW9uKCl7XG5cdFx0XHQvLyBDdXN0b20gVG9vbHRpcHNcblx0XHRcdGlmKHRoaXMuY3VzdG9tKXtcblx0XHRcdFx0dGhpcy5jdXN0b20odGhpcyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRkcmF3Um91bmRlZFJlY3RhbmdsZSh0aGlzLmN0eCx0aGlzLngsdGhpcy55IC0gdGhpcy5oZWlnaHQvMix0aGlzLndpZHRoLHRoaXMuaGVpZ2h0LHRoaXMuY29ybmVyUmFkaXVzKTtcblx0XHRcdFx0dmFyIGN0eCA9IHRoaXMuY3R4O1xuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy5maWxsQ29sb3I7XG5cdFx0XHRcdGN0eC5maWxsKCk7XG5cdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblxuXHRcdFx0XHRjdHgudGV4dEFsaWduID0gXCJsZWZ0XCI7XG5cdFx0XHRcdGN0eC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy50aXRsZVRleHRDb2xvcjtcblx0XHRcdFx0Y3R4LmZvbnQgPSB0aGlzLnRpdGxlRm9udDtcblxuXHRcdFx0XHRjdHguZmlsbFRleHQodGhpcy50aXRsZSx0aGlzLnggKyB0aGlzLnhQYWRkaW5nLCB0aGlzLmdldExpbmVIZWlnaHQoMCkpO1xuXG5cdFx0XHRcdGN0eC5mb250ID0gdGhpcy5mb250O1xuXHRcdFx0XHRoZWxwZXJzLmVhY2godGhpcy5sYWJlbHMsZnVuY3Rpb24obGFiZWwsaW5kZXgpe1xuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLnRleHRDb2xvcjtcblx0XHRcdFx0XHRjdHguZmlsbFRleHQobGFiZWwsdGhpcy54ICsgdGhpcy54UGFkZGluZyArIHRoaXMuZm9udFNpemUgKyAzLCB0aGlzLmdldExpbmVIZWlnaHQoaW5kZXggKyAxKSk7XG5cblx0XHRcdFx0XHQvL0EgYml0IGduYXJseSwgYnV0IGNsZWFyaW5nIHRoaXMgcmVjdGFuZ2xlIGJyZWFrcyB3aGVuIHVzaW5nIGV4cGxvcmVyY2FudmFzIChjbGVhcnMgd2hvbGUgY2FudmFzKVxuXHRcdFx0XHRcdC8vY3R4LmNsZWFyUmVjdCh0aGlzLnggKyB0aGlzLnhQYWRkaW5nLCB0aGlzLmdldExpbmVIZWlnaHQoaW5kZXggKyAxKSAtIHRoaXMuZm9udFNpemUvMiwgdGhpcy5mb250U2l6ZSwgdGhpcy5mb250U2l6ZSk7XG5cdFx0XHRcdFx0Ly9JbnN0ZWFkIHdlJ2xsIG1ha2UgYSB3aGl0ZSBmaWxsZWQgYmxvY2sgdG8gcHV0IHRoZSBsZWdlbmRDb2xvdXIgcGFsZXR0ZSBvdmVyLlxuXG5cdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMubGVnZW5kQ29sb3JCYWNrZ3JvdW5kO1xuXHRcdFx0XHRcdGN0eC5maWxsUmVjdCh0aGlzLnggKyB0aGlzLnhQYWRkaW5nLCB0aGlzLmdldExpbmVIZWlnaHQoaW5kZXggKyAxKSAtIHRoaXMuZm9udFNpemUvMiwgdGhpcy5mb250U2l6ZSwgdGhpcy5mb250U2l6ZSk7XG5cblx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy5sZWdlbmRDb2xvcnNbaW5kZXhdLmZpbGw7XG5cdFx0XHRcdFx0Y3R4LmZpbGxSZWN0KHRoaXMueCArIHRoaXMueFBhZGRpbmcsIHRoaXMuZ2V0TGluZUhlaWdodChpbmRleCArIDEpIC0gdGhpcy5mb250U2l6ZS8yLCB0aGlzLmZvbnRTaXplLCB0aGlzLmZvbnRTaXplKTtcblxuXG5cdFx0XHRcdH0sdGhpcyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRDaGFydC5TY2FsZSA9IENoYXJ0LkVsZW1lbnQuZXh0ZW5kKHtcblx0XHRpbml0aWFsaXplIDogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuZml0KCk7XG5cdFx0fSxcblx0XHRidWlsZFlMYWJlbHMgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy55TGFiZWxzID0gW107XG5cblx0XHRcdHZhciBzdGVwRGVjaW1hbFBsYWNlcyA9IGdldERlY2ltYWxQbGFjZXModGhpcy5zdGVwVmFsdWUpO1xuXG5cdFx0XHRmb3IgKHZhciBpPTA7IGk8PXRoaXMuc3RlcHM7IGkrKyl7XG5cdFx0XHRcdHRoaXMueUxhYmVscy5wdXNoKHRlbXBsYXRlKHRoaXMudGVtcGxhdGVTdHJpbmcse3ZhbHVlOih0aGlzLm1pbiArIChpICogdGhpcy5zdGVwVmFsdWUpKS50b0ZpeGVkKHN0ZXBEZWNpbWFsUGxhY2VzKX0pKTtcblx0XHRcdH1cblx0XHRcdHRoaXMueUxhYmVsV2lkdGggPSAodGhpcy5kaXNwbGF5ICYmIHRoaXMuc2hvd0xhYmVscykgPyBsb25nZXN0VGV4dCh0aGlzLmN0eCx0aGlzLmZvbnQsdGhpcy55TGFiZWxzKSA6IDA7XG5cdFx0fSxcblx0XHRhZGRYTGFiZWwgOiBmdW5jdGlvbihsYWJlbCl7XG5cdFx0XHR0aGlzLnhMYWJlbHMucHVzaChsYWJlbCk7XG5cdFx0XHR0aGlzLnZhbHVlc0NvdW50Kys7XG5cdFx0XHR0aGlzLmZpdCgpO1xuXHRcdH0sXG5cdFx0cmVtb3ZlWExhYmVsIDogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMueExhYmVscy5zaGlmdCgpO1xuXHRcdFx0dGhpcy52YWx1ZXNDb3VudC0tO1xuXHRcdFx0dGhpcy5maXQoKTtcblx0XHR9LFxuXHRcdC8vIEZpdHRpbmcgbG9vcCB0byByb3RhdGUgeCBMYWJlbHMgYW5kIGZpZ3VyZSBvdXQgd2hhdCBmaXRzIHRoZXJlLCBhbmQgYWxzbyBjYWxjdWxhdGUgaG93IG1hbnkgWSBzdGVwcyB0byB1c2Vcblx0XHRmaXQ6IGZ1bmN0aW9uKCl7XG5cdFx0XHQvLyBGaXJzdCB3ZSBuZWVkIHRoZSB3aWR0aCBvZiB0aGUgeUxhYmVscywgYXNzdW1pbmcgdGhlIHhMYWJlbHMgYXJlbid0IHJvdGF0ZWRcblxuXHRcdFx0Ly8gVG8gZG8gdGhhdCB3ZSBuZWVkIHRoZSBiYXNlIGxpbmUgYXQgdGhlIHRvcCBhbmQgYmFzZSBvZiB0aGUgY2hhcnQsIGFzc3VtaW5nIHRoZXJlIGlzIG5vIHggbGFiZWwgcm90YXRpb25cblx0XHRcdHRoaXMuc3RhcnRQb2ludCA9ICh0aGlzLmRpc3BsYXkpID8gdGhpcy5mb250U2l6ZSA6IDA7XG5cdFx0XHR0aGlzLmVuZFBvaW50ID0gKHRoaXMuZGlzcGxheSkgPyB0aGlzLmhlaWdodCAtICh0aGlzLmZvbnRTaXplICogMS41KSAtIDUgOiB0aGlzLmhlaWdodDsgLy8gLTUgdG8gcGFkIGxhYmVsc1xuXG5cdFx0XHQvLyBBcHBseSBwYWRkaW5nIHNldHRpbmdzIHRvIHRoZSBzdGFydCBhbmQgZW5kIHBvaW50LlxuXHRcdFx0dGhpcy5zdGFydFBvaW50ICs9IHRoaXMucGFkZGluZztcblx0XHRcdHRoaXMuZW5kUG9pbnQgLT0gdGhpcy5wYWRkaW5nO1xuXG5cdFx0XHQvLyBDYWNoZSB0aGUgc3RhcnRpbmcgaGVpZ2h0LCBzbyBjYW4gZGV0ZXJtaW5lIGlmIHdlIG5lZWQgdG8gcmVjYWxjdWxhdGUgdGhlIHNjYWxlIHlBeGlzXG5cdFx0XHR2YXIgY2FjaGVkSGVpZ2h0ID0gdGhpcy5lbmRQb2ludCAtIHRoaXMuc3RhcnRQb2ludCxcblx0XHRcdFx0Y2FjaGVkWUxhYmVsV2lkdGg7XG5cblx0XHRcdC8vIEJ1aWxkIHRoZSBjdXJyZW50IHlMYWJlbHMgc28gd2UgaGF2ZSBhbiBpZGVhIG9mIHdoYXQgc2l6ZSB0aGV5J2xsIGJlIHRvIHN0YXJ0XG5cdFx0XHQvKlxuXHRcdFx0ICpcdFRoaXMgc2V0cyB3aGF0IGlzIHJldHVybmVkIGZyb20gY2FsY3VsYXRlU2NhbGVSYW5nZSBhcyBzdGF0aWMgcHJvcGVydGllcyBvZiB0aGlzIGNsYXNzOlxuXHRcdFx0ICpcblx0XHRcdFx0dGhpcy5zdGVwcztcblx0XHRcdFx0dGhpcy5zdGVwVmFsdWU7XG5cdFx0XHRcdHRoaXMubWluO1xuXHRcdFx0XHR0aGlzLm1heDtcblx0XHRcdCAqXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMuY2FsY3VsYXRlWVJhbmdlKGNhY2hlZEhlaWdodCk7XG5cblx0XHRcdC8vIFdpdGggdGhlc2UgcHJvcGVydGllcyBzZXQgd2UgY2FuIG5vdyBidWlsZCB0aGUgYXJyYXkgb2YgeUxhYmVsc1xuXHRcdFx0Ly8gYW5kIGFsc28gdGhlIHdpZHRoIG9mIHRoZSBsYXJnZXN0IHlMYWJlbFxuXHRcdFx0dGhpcy5idWlsZFlMYWJlbHMoKTtcblxuXHRcdFx0dGhpcy5jYWxjdWxhdGVYTGFiZWxSb3RhdGlvbigpO1xuXG5cdFx0XHR3aGlsZSgoY2FjaGVkSGVpZ2h0ID4gdGhpcy5lbmRQb2ludCAtIHRoaXMuc3RhcnRQb2ludCkpe1xuXHRcdFx0XHRjYWNoZWRIZWlnaHQgPSB0aGlzLmVuZFBvaW50IC0gdGhpcy5zdGFydFBvaW50O1xuXHRcdFx0XHRjYWNoZWRZTGFiZWxXaWR0aCA9IHRoaXMueUxhYmVsV2lkdGg7XG5cblx0XHRcdFx0dGhpcy5jYWxjdWxhdGVZUmFuZ2UoY2FjaGVkSGVpZ2h0KTtcblx0XHRcdFx0dGhpcy5idWlsZFlMYWJlbHMoKTtcblxuXHRcdFx0XHQvLyBPbmx5IGdvIHRocm91Z2ggdGhlIHhMYWJlbCBsb29wIGFnYWluIGlmIHRoZSB5TGFiZWwgd2lkdGggaGFzIGNoYW5nZWRcblx0XHRcdFx0aWYgKGNhY2hlZFlMYWJlbFdpZHRoIDwgdGhpcy55TGFiZWxXaWR0aCl7XG5cdFx0XHRcdFx0dGhpcy5jYWxjdWxhdGVYTGFiZWxSb3RhdGlvbigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9LFxuXHRcdGNhbGN1bGF0ZVhMYWJlbFJvdGF0aW9uIDogZnVuY3Rpb24oKXtcblx0XHRcdC8vR2V0IHRoZSB3aWR0aCBvZiBlYWNoIGdyaWQgYnkgY2FsY3VsYXRpbmcgdGhlIGRpZmZlcmVuY2Vcblx0XHRcdC8vYmV0d2VlbiB4IG9mZnNldHMgYmV0d2VlbiAwIGFuZCAxLlxuXG5cdFx0XHR0aGlzLmN0eC5mb250ID0gdGhpcy5mb250O1xuXG5cdFx0XHR2YXIgZmlyc3RXaWR0aCA9IHRoaXMuY3R4Lm1lYXN1cmVUZXh0KHRoaXMueExhYmVsc1swXSkud2lkdGgsXG5cdFx0XHRcdGxhc3RXaWR0aCA9IHRoaXMuY3R4Lm1lYXN1cmVUZXh0KHRoaXMueExhYmVsc1t0aGlzLnhMYWJlbHMubGVuZ3RoIC0gMV0pLndpZHRoLFxuXHRcdFx0XHRmaXJzdFJvdGF0ZWQsXG5cdFx0XHRcdGxhc3RSb3RhdGVkO1xuXG5cblx0XHRcdHRoaXMueFNjYWxlUGFkZGluZ1JpZ2h0ID0gbGFzdFdpZHRoLzIgKyAzO1xuXHRcdFx0dGhpcy54U2NhbGVQYWRkaW5nTGVmdCA9IChmaXJzdFdpZHRoLzIgPiB0aGlzLnlMYWJlbFdpZHRoICsgMTApID8gZmlyc3RXaWR0aC8yIDogdGhpcy55TGFiZWxXaWR0aCArIDEwO1xuXG5cdFx0XHR0aGlzLnhMYWJlbFJvdGF0aW9uID0gMDtcblx0XHRcdGlmICh0aGlzLmRpc3BsYXkpe1xuXHRcdFx0XHR2YXIgb3JpZ2luYWxMYWJlbFdpZHRoID0gbG9uZ2VzdFRleHQodGhpcy5jdHgsdGhpcy5mb250LHRoaXMueExhYmVscyksXG5cdFx0XHRcdFx0Y29zUm90YXRpb24sXG5cdFx0XHRcdFx0Zmlyc3RSb3RhdGVkV2lkdGg7XG5cdFx0XHRcdHRoaXMueExhYmVsV2lkdGggPSBvcmlnaW5hbExhYmVsV2lkdGg7XG5cdFx0XHRcdC8vQWxsb3cgMyBwaXhlbHMgeDIgcGFkZGluZyBlaXRoZXIgc2lkZSBmb3IgbGFiZWwgcmVhZGFiaWxpdHlcblx0XHRcdFx0dmFyIHhHcmlkV2lkdGggPSBNYXRoLmZsb29yKHRoaXMuY2FsY3VsYXRlWCgxKSAtIHRoaXMuY2FsY3VsYXRlWCgwKSkgLSA2O1xuXG5cdFx0XHRcdC8vTWF4IGxhYmVsIHJvdGF0ZSBzaG91bGQgYmUgOTAgLSBhbHNvIGFjdCBhcyBhIGxvb3AgY291bnRlclxuXHRcdFx0XHR3aGlsZSAoKHRoaXMueExhYmVsV2lkdGggPiB4R3JpZFdpZHRoICYmIHRoaXMueExhYmVsUm90YXRpb24gPT09IDApIHx8ICh0aGlzLnhMYWJlbFdpZHRoID4geEdyaWRXaWR0aCAmJiB0aGlzLnhMYWJlbFJvdGF0aW9uIDw9IDkwICYmIHRoaXMueExhYmVsUm90YXRpb24gPiAwKSl7XG5cdFx0XHRcdFx0Y29zUm90YXRpb24gPSBNYXRoLmNvcyh0b1JhZGlhbnModGhpcy54TGFiZWxSb3RhdGlvbikpO1xuXG5cdFx0XHRcdFx0Zmlyc3RSb3RhdGVkID0gY29zUm90YXRpb24gKiBmaXJzdFdpZHRoO1xuXHRcdFx0XHRcdGxhc3RSb3RhdGVkID0gY29zUm90YXRpb24gKiBsYXN0V2lkdGg7XG5cblx0XHRcdFx0XHQvLyBXZSdyZSByaWdodCBhbGlnbmluZyB0aGUgdGV4dCBub3cuXG5cdFx0XHRcdFx0aWYgKGZpcnN0Um90YXRlZCArIHRoaXMuZm9udFNpemUgLyAyID4gdGhpcy55TGFiZWxXaWR0aCArIDgpe1xuXHRcdFx0XHRcdFx0dGhpcy54U2NhbGVQYWRkaW5nTGVmdCA9IGZpcnN0Um90YXRlZCArIHRoaXMuZm9udFNpemUgLyAyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLnhTY2FsZVBhZGRpbmdSaWdodCA9IHRoaXMuZm9udFNpemUvMjtcblxuXG5cdFx0XHRcdFx0dGhpcy54TGFiZWxSb3RhdGlvbisrO1xuXHRcdFx0XHRcdHRoaXMueExhYmVsV2lkdGggPSBjb3NSb3RhdGlvbiAqIG9yaWdpbmFsTGFiZWxXaWR0aDtcblxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLnhMYWJlbFJvdGF0aW9uID4gMCl7XG5cdFx0XHRcdFx0dGhpcy5lbmRQb2ludCAtPSBNYXRoLnNpbih0b1JhZGlhbnModGhpcy54TGFiZWxSb3RhdGlvbikpKm9yaWdpbmFsTGFiZWxXaWR0aCArIDM7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHRoaXMueExhYmVsV2lkdGggPSAwO1xuXHRcdFx0XHR0aGlzLnhTY2FsZVBhZGRpbmdSaWdodCA9IHRoaXMucGFkZGluZztcblx0XHRcdFx0dGhpcy54U2NhbGVQYWRkaW5nTGVmdCA9IHRoaXMucGFkZGluZztcblx0XHRcdH1cblxuXHRcdH0sXG5cdFx0Ly8gTmVlZHMgdG8gYmUgb3ZlcmlkZGVuIGluIGVhY2ggQ2hhcnQgdHlwZVxuXHRcdC8vIE90aGVyd2lzZSB3ZSBuZWVkIHRvIHBhc3MgYWxsIHRoZSBkYXRhIGludG8gdGhlIHNjYWxlIGNsYXNzXG5cdFx0Y2FsY3VsYXRlWVJhbmdlOiBub29wLFxuXHRcdGRyYXdpbmdBcmVhOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHRoaXMuc3RhcnRQb2ludCAtIHRoaXMuZW5kUG9pbnQ7XG5cdFx0fSxcblx0XHRjYWxjdWxhdGVZIDogZnVuY3Rpb24odmFsdWUpe1xuXHRcdFx0dmFyIHNjYWxpbmdGYWN0b3IgPSB0aGlzLmRyYXdpbmdBcmVhKCkgLyAodGhpcy5taW4gLSB0aGlzLm1heCk7XG5cdFx0XHRyZXR1cm4gdGhpcy5lbmRQb2ludCAtIChzY2FsaW5nRmFjdG9yICogKHZhbHVlIC0gdGhpcy5taW4pKTtcblx0XHR9LFxuXHRcdGNhbGN1bGF0ZVggOiBmdW5jdGlvbihpbmRleCl7XG5cdFx0XHR2YXIgaXNSb3RhdGVkID0gKHRoaXMueExhYmVsUm90YXRpb24gPiAwKSxcblx0XHRcdFx0Ly8gaW5uZXJXaWR0aCA9ICh0aGlzLm9mZnNldEdyaWRMaW5lcykgPyB0aGlzLndpZHRoIC0gb2Zmc2V0TGVmdCAtIHRoaXMucGFkZGluZyA6IHRoaXMud2lkdGggLSAob2Zmc2V0TGVmdCArIGhhbGZMYWJlbFdpZHRoICogMikgLSB0aGlzLnBhZGRpbmcsXG5cdFx0XHRcdGlubmVyV2lkdGggPSB0aGlzLndpZHRoIC0gKHRoaXMueFNjYWxlUGFkZGluZ0xlZnQgKyB0aGlzLnhTY2FsZVBhZGRpbmdSaWdodCksXG5cdFx0XHRcdHZhbHVlV2lkdGggPSBpbm5lcldpZHRoL01hdGgubWF4KCh0aGlzLnZhbHVlc0NvdW50IC0gKCh0aGlzLm9mZnNldEdyaWRMaW5lcykgPyAwIDogMSkpLCAxKSxcblx0XHRcdFx0dmFsdWVPZmZzZXQgPSAodmFsdWVXaWR0aCAqIGluZGV4KSArIHRoaXMueFNjYWxlUGFkZGluZ0xlZnQ7XG5cblx0XHRcdGlmICh0aGlzLm9mZnNldEdyaWRMaW5lcyl7XG5cdFx0XHRcdHZhbHVlT2Zmc2V0ICs9ICh2YWx1ZVdpZHRoLzIpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gTWF0aC5yb3VuZCh2YWx1ZU9mZnNldCk7XG5cdFx0fSxcblx0XHR1cGRhdGUgOiBmdW5jdGlvbihuZXdQcm9wcyl7XG5cdFx0XHRoZWxwZXJzLmV4dGVuZCh0aGlzLCBuZXdQcm9wcyk7XG5cdFx0XHR0aGlzLmZpdCgpO1xuXHRcdH0sXG5cdFx0ZHJhdyA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgY3R4ID0gdGhpcy5jdHgsXG5cdFx0XHRcdHlMYWJlbEdhcCA9ICh0aGlzLmVuZFBvaW50IC0gdGhpcy5zdGFydFBvaW50KSAvIHRoaXMuc3RlcHMsXG5cdFx0XHRcdHhTdGFydCA9IE1hdGgucm91bmQodGhpcy54U2NhbGVQYWRkaW5nTGVmdCk7XG5cdFx0XHRpZiAodGhpcy5kaXNwbGF5KXtcblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMudGV4dENvbG9yO1xuXHRcdFx0XHRjdHguZm9udCA9IHRoaXMuZm9udDtcblx0XHRcdFx0ZWFjaCh0aGlzLnlMYWJlbHMsZnVuY3Rpb24obGFiZWxTdHJpbmcsaW5kZXgpe1xuXHRcdFx0XHRcdHZhciB5TGFiZWxDZW50ZXIgPSB0aGlzLmVuZFBvaW50IC0gKHlMYWJlbEdhcCAqIGluZGV4KSxcblx0XHRcdFx0XHRcdGxpbmVQb3NpdGlvblkgPSBNYXRoLnJvdW5kKHlMYWJlbENlbnRlciksXG5cdFx0XHRcdFx0XHRkcmF3SG9yaXpvbnRhbExpbmUgPSB0aGlzLnNob3dIb3Jpem9udGFsTGluZXM7XG5cblx0XHRcdFx0XHRjdHgudGV4dEFsaWduID0gXCJyaWdodFwiO1xuXHRcdFx0XHRcdGN0eC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xuXHRcdFx0XHRcdGlmICh0aGlzLnNob3dMYWJlbHMpe1xuXHRcdFx0XHRcdFx0Y3R4LmZpbGxUZXh0KGxhYmVsU3RyaW5nLHhTdGFydCAtIDEwLHlMYWJlbENlbnRlcik7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVGhpcyBpcyBYIGF4aXMsIHNvIGRyYXcgaXRcblx0XHRcdFx0XHRpZiAoaW5kZXggPT09IDAgJiYgIWRyYXdIb3Jpem9udGFsTGluZSl7XG5cdFx0XHRcdFx0XHRkcmF3SG9yaXpvbnRhbExpbmUgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChkcmF3SG9yaXpvbnRhbExpbmUpe1xuXHRcdFx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChpbmRleCA+IDApe1xuXHRcdFx0XHRcdFx0Ly8gVGhpcyBpcyBhIGdyaWQgbGluZSBpbiB0aGUgY2VudHJlLCBzbyBkcm9wIHRoYXRcblx0XHRcdFx0XHRcdGN0eC5saW5lV2lkdGggPSB0aGlzLmdyaWRMaW5lV2lkdGg7XG5cdFx0XHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdyaWRMaW5lQ29sb3I7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIFRoaXMgaXMgdGhlIGZpcnN0IGxpbmUgb24gdGhlIHNjYWxlXG5cdFx0XHRcdFx0XHRjdHgubGluZVdpZHRoID0gdGhpcy5saW5lV2lkdGg7XG5cdFx0XHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmxpbmVDb2xvcjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRsaW5lUG9zaXRpb25ZICs9IGhlbHBlcnMuYWxpYXNQaXhlbChjdHgubGluZVdpZHRoKTtcblxuXHRcdFx0XHRcdGlmKGRyYXdIb3Jpem9udGFsTGluZSl7XG5cdFx0XHRcdFx0XHRjdHgubW92ZVRvKHhTdGFydCwgbGluZVBvc2l0aW9uWSk7XG5cdFx0XHRcdFx0XHRjdHgubGluZVRvKHRoaXMud2lkdGgsIGxpbmVQb3NpdGlvblkpO1xuXHRcdFx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdFx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGN0eC5saW5lV2lkdGggPSB0aGlzLmxpbmVXaWR0aDtcblx0XHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmxpbmVDb2xvcjtcblx0XHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdFx0Y3R4Lm1vdmVUbyh4U3RhcnQgLSA1LCBsaW5lUG9zaXRpb25ZKTtcblx0XHRcdFx0XHRjdHgubGluZVRvKHhTdGFydCwgbGluZVBvc2l0aW9uWSk7XG5cdFx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblxuXHRcdFx0XHR9LHRoaXMpO1xuXG5cdFx0XHRcdGVhY2godGhpcy54TGFiZWxzLGZ1bmN0aW9uKGxhYmVsLGluZGV4KXtcblx0XHRcdFx0XHR2YXIgeFBvcyA9IHRoaXMuY2FsY3VsYXRlWChpbmRleCkgKyBhbGlhc1BpeGVsKHRoaXMubGluZVdpZHRoKSxcblx0XHRcdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiBsaW5lL2JhciBoZXJlIGFuZCBkZWNpZGUgd2hlcmUgdG8gcGxhY2UgdGhlIGxpbmVcblx0XHRcdFx0XHRcdGxpbmVQb3MgPSB0aGlzLmNhbGN1bGF0ZVgoaW5kZXggLSAodGhpcy5vZmZzZXRHcmlkTGluZXMgPyAwLjUgOiAwKSkgKyBhbGlhc1BpeGVsKHRoaXMubGluZVdpZHRoKSxcblx0XHRcdFx0XHRcdGlzUm90YXRlZCA9ICh0aGlzLnhMYWJlbFJvdGF0aW9uID4gMCksXG5cdFx0XHRcdFx0XHRkcmF3VmVydGljYWxMaW5lID0gdGhpcy5zaG93VmVydGljYWxMaW5lcztcblxuXHRcdFx0XHRcdC8vIFRoaXMgaXMgWSBheGlzLCBzbyBkcmF3IGl0XG5cdFx0XHRcdFx0aWYgKGluZGV4ID09PSAwICYmICFkcmF3VmVydGljYWxMaW5lKXtcblx0XHRcdFx0XHRcdGRyYXdWZXJ0aWNhbExpbmUgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChkcmF3VmVydGljYWxMaW5lKXtcblx0XHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoaW5kZXggPiAwKXtcblx0XHRcdFx0XHRcdC8vIFRoaXMgaXMgYSBncmlkIGxpbmUgaW4gdGhlIGNlbnRyZSwgc28gZHJvcCB0aGF0XG5cdFx0XHRcdFx0XHRjdHgubGluZVdpZHRoID0gdGhpcy5ncmlkTGluZVdpZHRoO1xuXHRcdFx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gdGhpcy5ncmlkTGluZUNvbG9yO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBUaGlzIGlzIHRoZSBmaXJzdCBsaW5lIG9uIHRoZSBzY2FsZVxuXHRcdFx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IHRoaXMubGluZVdpZHRoO1xuXHRcdFx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gdGhpcy5saW5lQ29sb3I7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGRyYXdWZXJ0aWNhbExpbmUpe1xuXHRcdFx0XHRcdFx0Y3R4Lm1vdmVUbyhsaW5lUG9zLHRoaXMuZW5kUG9pbnQpO1xuXHRcdFx0XHRcdFx0Y3R4LmxpbmVUbyhsaW5lUG9zLHRoaXMuc3RhcnRQb2ludCAtIDMpO1xuXHRcdFx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdFx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdFx0XHRcdH1cblxuXG5cdFx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IHRoaXMubGluZVdpZHRoO1xuXHRcdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9IHRoaXMubGluZUNvbG9yO1xuXG5cblx0XHRcdFx0XHQvLyBTbWFsbCBsaW5lcyBhdCB0aGUgYm90dG9tIG9mIHRoZSBiYXNlIGdyaWQgbGluZVxuXHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHRjdHgubW92ZVRvKGxpbmVQb3MsdGhpcy5lbmRQb2ludCk7XG5cdFx0XHRcdFx0Y3R4LmxpbmVUbyhsaW5lUG9zLHRoaXMuZW5kUG9pbnQgKyA1KTtcblx0XHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXG5cdFx0XHRcdFx0Y3R4LnNhdmUoKTtcblx0XHRcdFx0XHRjdHgudHJhbnNsYXRlKHhQb3MsKGlzUm90YXRlZCkgPyB0aGlzLmVuZFBvaW50ICsgMTIgOiB0aGlzLmVuZFBvaW50ICsgOCk7XG5cdFx0XHRcdFx0Y3R4LnJvdGF0ZSh0b1JhZGlhbnModGhpcy54TGFiZWxSb3RhdGlvbikqLTEpO1xuXHRcdFx0XHRcdGN0eC5mb250ID0gdGhpcy5mb250O1xuXHRcdFx0XHRcdGN0eC50ZXh0QWxpZ24gPSAoaXNSb3RhdGVkKSA/IFwicmlnaHRcIiA6IFwiY2VudGVyXCI7XG5cdFx0XHRcdFx0Y3R4LnRleHRCYXNlbGluZSA9IChpc1JvdGF0ZWQpID8gXCJtaWRkbGVcIiA6IFwidG9wXCI7XG5cdFx0XHRcdFx0Y3R4LmZpbGxUZXh0KGxhYmVsLCAwLCAwKTtcblx0XHRcdFx0XHRjdHgucmVzdG9yZSgpO1xuXHRcdFx0XHR9LHRoaXMpO1xuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdH0pO1xuXG5cdENoYXJ0LlJhZGlhbFNjYWxlID0gQ2hhcnQuRWxlbWVudC5leHRlbmQoe1xuXHRcdGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLnNpemUgPSBtaW4oW3RoaXMuaGVpZ2h0LCB0aGlzLndpZHRoXSk7XG5cdFx0XHR0aGlzLmRyYXdpbmdBcmVhID0gKHRoaXMuZGlzcGxheSkgPyAodGhpcy5zaXplLzIpIC0gKHRoaXMuZm9udFNpemUvMiArIHRoaXMuYmFja2Ryb3BQYWRkaW5nWSkgOiAodGhpcy5zaXplLzIpO1xuXHRcdH0sXG5cdFx0Y2FsY3VsYXRlQ2VudGVyT2Zmc2V0OiBmdW5jdGlvbih2YWx1ZSl7XG5cdFx0XHQvLyBUYWtlIGludG8gYWNjb3VudCBoYWxmIGZvbnQgc2l6ZSArIHRoZSB5UGFkZGluZyBvZiB0aGUgdG9wIHZhbHVlXG5cdFx0XHR2YXIgc2NhbGluZ0ZhY3RvciA9IHRoaXMuZHJhd2luZ0FyZWEgLyAodGhpcy5tYXggLSB0aGlzLm1pbik7XG5cblx0XHRcdHJldHVybiAodmFsdWUgLSB0aGlzLm1pbikgKiBzY2FsaW5nRmFjdG9yO1xuXHRcdH0sXG5cdFx0dXBkYXRlIDogZnVuY3Rpb24oKXtcblx0XHRcdGlmICghdGhpcy5saW5lQXJjKXtcblx0XHRcdFx0dGhpcy5zZXRTY2FsZVNpemUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuZHJhd2luZ0FyZWEgPSAodGhpcy5kaXNwbGF5KSA/ICh0aGlzLnNpemUvMikgLSAodGhpcy5mb250U2l6ZS8yICsgdGhpcy5iYWNrZHJvcFBhZGRpbmdZKSA6ICh0aGlzLnNpemUvMik7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmJ1aWxkWUxhYmVscygpO1xuXHRcdH0sXG5cdFx0YnVpbGRZTGFiZWxzOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy55TGFiZWxzID0gW107XG5cblx0XHRcdHZhciBzdGVwRGVjaW1hbFBsYWNlcyA9IGdldERlY2ltYWxQbGFjZXModGhpcy5zdGVwVmFsdWUpO1xuXG5cdFx0XHRmb3IgKHZhciBpPTA7IGk8PXRoaXMuc3RlcHM7IGkrKyl7XG5cdFx0XHRcdHRoaXMueUxhYmVscy5wdXNoKHRlbXBsYXRlKHRoaXMudGVtcGxhdGVTdHJpbmcse3ZhbHVlOih0aGlzLm1pbiArIChpICogdGhpcy5zdGVwVmFsdWUpKS50b0ZpeGVkKHN0ZXBEZWNpbWFsUGxhY2VzKX0pKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGdldENpcmN1bWZlcmVuY2UgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuICgoTWF0aC5QSSoyKSAvIHRoaXMudmFsdWVzQ291bnQpO1xuXHRcdH0sXG5cdFx0c2V0U2NhbGVTaXplOiBmdW5jdGlvbigpe1xuXHRcdFx0Lypcblx0XHRcdCAqIFJpZ2h0LCB0aGlzIGlzIHJlYWxseSBjb25mdXNpbmcgYW5kIHRoZXJlIGlzIGEgbG90IG9mIG1hdGhzIGdvaW5nIG9uIGhlcmVcblx0XHRcdCAqIFRoZSBnaXN0IG9mIHRoZSBwcm9ibGVtIGlzIGhlcmU6IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL25ubmljay82OTZjYzljNTVmNGIwYmViOGZlOVxuXHRcdFx0ICpcblx0XHRcdCAqIFJlYWN0aW9uOiBodHRwczovL2RsLmRyb3Bib3h1c2VyY29udGVudC5jb20vdS8zNDYwMTM2My90b29tdWNoc2NpZW5jZS5naWZcblx0XHRcdCAqXG5cdFx0XHQgKiBTb2x1dGlvbjpcblx0XHRcdCAqXG5cdFx0XHQgKiBXZSBhc3N1bWUgdGhlIHJhZGl1cyBvZiB0aGUgcG9seWdvbiBpcyBoYWxmIHRoZSBzaXplIG9mIHRoZSBjYW52YXMgYXQgZmlyc3Rcblx0XHRcdCAqIGF0IGVhY2ggaW5kZXggd2UgY2hlY2sgaWYgdGhlIHRleHQgb3ZlcmxhcHMuXG5cdFx0XHQgKlxuXHRcdFx0ICogV2hlcmUgaXQgZG9lcywgd2Ugc3RvcmUgdGhhdCBhbmdsZSBhbmQgdGhhdCBpbmRleC5cblx0XHRcdCAqXG5cdFx0XHQgKiBBZnRlciBmaW5kaW5nIHRoZSBsYXJnZXN0IGluZGV4IGFuZCBhbmdsZSB3ZSBjYWxjdWxhdGUgaG93IG11Y2ggd2UgbmVlZCB0byByZW1vdmVcblx0XHRcdCAqIGZyb20gdGhlIHNoYXBlIHJhZGl1cyB0byBtb3ZlIHRoZSBwb2ludCBpbndhcmRzIGJ5IHRoYXQgeC5cblx0XHRcdCAqXG5cdFx0XHQgKiBXZSBhdmVyYWdlIHRoZSBsZWZ0IGFuZCByaWdodCBkaXN0YW5jZXMgdG8gZ2V0IHRoZSBtYXhpbXVtIHNoYXBlIHJhZGl1cyB0aGF0IGNhbiBmaXQgaW4gdGhlIGJveFxuXHRcdFx0ICogYWxvbmcgd2l0aCBsYWJlbHMuXG5cdFx0XHQgKlxuXHRcdFx0ICogT25jZSB3ZSBoYXZlIHRoYXQsIHdlIGNhbiBmaW5kIHRoZSBjZW50cmUgcG9pbnQgZm9yIHRoZSBjaGFydCwgYnkgdGFraW5nIHRoZSB4IHRleHQgcHJvdHJ1c2lvblxuXHRcdFx0ICogb24gZWFjaCBzaWRlLCByZW1vdmluZyB0aGF0IGZyb20gdGhlIHNpemUsIGhhbHZpbmcgaXQgYW5kIGFkZGluZyB0aGUgbGVmdCB4IHByb3RydXNpb24gd2lkdGguXG5cdFx0XHQgKlxuXHRcdFx0ICogVGhpcyB3aWxsIG1lYW4gd2UgaGF2ZSBhIHNoYXBlIGZpdHRlZCB0byB0aGUgY2FudmFzLCBhcyBsYXJnZSBhcyBpdCBjYW4gYmUgd2l0aCB0aGUgbGFiZWxzXG5cdFx0XHQgKiBhbmQgcG9zaXRpb24gaXQgaW4gdGhlIG1vc3Qgc3BhY2UgZWZmaWNpZW50IG1hbm5lclxuXHRcdFx0ICpcblx0XHRcdCAqIGh0dHBzOi8vZGwuZHJvcGJveHVzZXJjb250ZW50LmNvbS91LzM0NjAxMzYzL3llYWhzY2llbmNlLmdpZlxuXHRcdFx0ICovXG5cblxuXHRcdFx0Ly8gR2V0IG1heGltdW0gcmFkaXVzIG9mIHRoZSBwb2x5Z29uLiBFaXRoZXIgaGFsZiB0aGUgaGVpZ2h0IChtaW51cyB0aGUgdGV4dCB3aWR0aCkgb3IgaGFsZiB0aGUgd2lkdGguXG5cdFx0XHQvLyBVc2UgdGhpcyB0byBjYWxjdWxhdGUgdGhlIG9mZnNldCArIGNoYW5nZS4gLSBNYWtlIHN1cmUgTC9SIHByb3RydXNpb24gaXMgYXQgbGVhc3QgMCB0byBzdG9wIGlzc3VlcyB3aXRoIGNlbnRyZSBwb2ludHNcblx0XHRcdHZhciBsYXJnZXN0UG9zc2libGVSYWRpdXMgPSBtaW4oWyh0aGlzLmhlaWdodC8yIC0gdGhpcy5wb2ludExhYmVsRm9udFNpemUgLSA1KSwgdGhpcy53aWR0aC8yXSksXG5cdFx0XHRcdHBvaW50UG9zaXRpb24sXG5cdFx0XHRcdGksXG5cdFx0XHRcdHRleHRXaWR0aCxcblx0XHRcdFx0aGFsZlRleHRXaWR0aCxcblx0XHRcdFx0ZnVydGhlc3RSaWdodCA9IHRoaXMud2lkdGgsXG5cdFx0XHRcdGZ1cnRoZXN0UmlnaHRJbmRleCxcblx0XHRcdFx0ZnVydGhlc3RSaWdodEFuZ2xlLFxuXHRcdFx0XHRmdXJ0aGVzdExlZnQgPSAwLFxuXHRcdFx0XHRmdXJ0aGVzdExlZnRJbmRleCxcblx0XHRcdFx0ZnVydGhlc3RMZWZ0QW5nbGUsXG5cdFx0XHRcdHhQcm90cnVzaW9uTGVmdCxcblx0XHRcdFx0eFByb3RydXNpb25SaWdodCxcblx0XHRcdFx0cmFkaXVzUmVkdWN0aW9uUmlnaHQsXG5cdFx0XHRcdHJhZGl1c1JlZHVjdGlvbkxlZnQsXG5cdFx0XHRcdG1heFdpZHRoUmFkaXVzO1xuXHRcdFx0dGhpcy5jdHguZm9udCA9IGZvbnRTdHJpbmcodGhpcy5wb2ludExhYmVsRm9udFNpemUsdGhpcy5wb2ludExhYmVsRm9udFN0eWxlLHRoaXMucG9pbnRMYWJlbEZvbnRGYW1pbHkpO1xuXHRcdFx0Zm9yIChpPTA7aTx0aGlzLnZhbHVlc0NvdW50O2krKyl7XG5cdFx0XHRcdC8vIDVweCB0byBzcGFjZSB0aGUgdGV4dCBzbGlnaHRseSBvdXQgLSBzaW1pbGFyIHRvIHdoYXQgd2UgZG8gaW4gdGhlIGRyYXcgZnVuY3Rpb24uXG5cdFx0XHRcdHBvaW50UG9zaXRpb24gPSB0aGlzLmdldFBvaW50UG9zaXRpb24oaSwgbGFyZ2VzdFBvc3NpYmxlUmFkaXVzKTtcblx0XHRcdFx0dGV4dFdpZHRoID0gdGhpcy5jdHgubWVhc3VyZVRleHQodGVtcGxhdGUodGhpcy50ZW1wbGF0ZVN0cmluZywgeyB2YWx1ZTogdGhpcy5sYWJlbHNbaV0gfSkpLndpZHRoICsgNTtcblx0XHRcdFx0aWYgKGkgPT09IDAgfHwgaSA9PT0gdGhpcy52YWx1ZXNDb3VudC8yKXtcblx0XHRcdFx0XHQvLyBJZiB3ZSdyZSBhdCBpbmRleCB6ZXJvLCBvciBleGFjdGx5IHRoZSBtaWRkbGUsIHdlJ3JlIGF0IGV4YWN0bHkgdGhlIHRvcC9ib3R0b21cblx0XHRcdFx0XHQvLyBvZiB0aGUgcmFkYXIgY2hhcnQsIHNvIHRleHQgd2lsbCBiZSBhbGlnbmVkIGNlbnRyYWxseSwgc28gd2UnbGwgaGFsZiBpdCBhbmQgY29tcGFyZVxuXHRcdFx0XHRcdC8vIHcvbGVmdCBhbmQgcmlnaHQgdGV4dCBzaXplc1xuXHRcdFx0XHRcdGhhbGZUZXh0V2lkdGggPSB0ZXh0V2lkdGgvMjtcblx0XHRcdFx0XHRpZiAocG9pbnRQb3NpdGlvbi54ICsgaGFsZlRleHRXaWR0aCA+IGZ1cnRoZXN0UmlnaHQpIHtcblx0XHRcdFx0XHRcdGZ1cnRoZXN0UmlnaHQgPSBwb2ludFBvc2l0aW9uLnggKyBoYWxmVGV4dFdpZHRoO1xuXHRcdFx0XHRcdFx0ZnVydGhlc3RSaWdodEluZGV4ID0gaTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHBvaW50UG9zaXRpb24ueCAtIGhhbGZUZXh0V2lkdGggPCBmdXJ0aGVzdExlZnQpIHtcblx0XHRcdFx0XHRcdGZ1cnRoZXN0TGVmdCA9IHBvaW50UG9zaXRpb24ueCAtIGhhbGZUZXh0V2lkdGg7XG5cdFx0XHRcdFx0XHRmdXJ0aGVzdExlZnRJbmRleCA9IGk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKGkgPCB0aGlzLnZhbHVlc0NvdW50LzIpIHtcblx0XHRcdFx0XHQvLyBMZXNzIHRoYW4gaGFsZiB0aGUgdmFsdWVzIG1lYW5zIHdlJ2xsIGxlZnQgYWxpZ24gdGhlIHRleHRcblx0XHRcdFx0XHRpZiAocG9pbnRQb3NpdGlvbi54ICsgdGV4dFdpZHRoID4gZnVydGhlc3RSaWdodCkge1xuXHRcdFx0XHRcdFx0ZnVydGhlc3RSaWdodCA9IHBvaW50UG9zaXRpb24ueCArIHRleHRXaWR0aDtcblx0XHRcdFx0XHRcdGZ1cnRoZXN0UmlnaHRJbmRleCA9IGk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKGkgPiB0aGlzLnZhbHVlc0NvdW50LzIpe1xuXHRcdFx0XHRcdC8vIE1vcmUgdGhhbiBoYWxmIHRoZSB2YWx1ZXMgbWVhbnMgd2UnbGwgcmlnaHQgYWxpZ24gdGhlIHRleHRcblx0XHRcdFx0XHRpZiAocG9pbnRQb3NpdGlvbi54IC0gdGV4dFdpZHRoIDwgZnVydGhlc3RMZWZ0KSB7XG5cdFx0XHRcdFx0XHRmdXJ0aGVzdExlZnQgPSBwb2ludFBvc2l0aW9uLnggLSB0ZXh0V2lkdGg7XG5cdFx0XHRcdFx0XHRmdXJ0aGVzdExlZnRJbmRleCA9IGk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHhQcm90cnVzaW9uTGVmdCA9IGZ1cnRoZXN0TGVmdDtcblxuXHRcdFx0eFByb3RydXNpb25SaWdodCA9IE1hdGguY2VpbChmdXJ0aGVzdFJpZ2h0IC0gdGhpcy53aWR0aCk7XG5cblx0XHRcdGZ1cnRoZXN0UmlnaHRBbmdsZSA9IHRoaXMuZ2V0SW5kZXhBbmdsZShmdXJ0aGVzdFJpZ2h0SW5kZXgpO1xuXG5cdFx0XHRmdXJ0aGVzdExlZnRBbmdsZSA9IHRoaXMuZ2V0SW5kZXhBbmdsZShmdXJ0aGVzdExlZnRJbmRleCk7XG5cblx0XHRcdHJhZGl1c1JlZHVjdGlvblJpZ2h0ID0geFByb3RydXNpb25SaWdodCAvIE1hdGguc2luKGZ1cnRoZXN0UmlnaHRBbmdsZSArIE1hdGguUEkvMik7XG5cblx0XHRcdHJhZGl1c1JlZHVjdGlvbkxlZnQgPSB4UHJvdHJ1c2lvbkxlZnQgLyBNYXRoLnNpbihmdXJ0aGVzdExlZnRBbmdsZSArIE1hdGguUEkvMik7XG5cblx0XHRcdC8vIEVuc3VyZSB3ZSBhY3R1YWxseSBuZWVkIHRvIHJlZHVjZSB0aGUgc2l6ZSBvZiB0aGUgY2hhcnRcblx0XHRcdHJhZGl1c1JlZHVjdGlvblJpZ2h0ID0gKGlzTnVtYmVyKHJhZGl1c1JlZHVjdGlvblJpZ2h0KSkgPyByYWRpdXNSZWR1Y3Rpb25SaWdodCA6IDA7XG5cdFx0XHRyYWRpdXNSZWR1Y3Rpb25MZWZ0ID0gKGlzTnVtYmVyKHJhZGl1c1JlZHVjdGlvbkxlZnQpKSA/IHJhZGl1c1JlZHVjdGlvbkxlZnQgOiAwO1xuXG5cdFx0XHR0aGlzLmRyYXdpbmdBcmVhID0gbGFyZ2VzdFBvc3NpYmxlUmFkaXVzIC0gKHJhZGl1c1JlZHVjdGlvbkxlZnQgKyByYWRpdXNSZWR1Y3Rpb25SaWdodCkvMjtcblxuXHRcdFx0Ly90aGlzLmRyYXdpbmdBcmVhID0gbWluKFttYXhXaWR0aFJhZGl1cywgKHRoaXMuaGVpZ2h0IC0gKDIgKiAodGhpcy5wb2ludExhYmVsRm9udFNpemUgKyA1KSkpLzJdKVxuXHRcdFx0dGhpcy5zZXRDZW50ZXJQb2ludChyYWRpdXNSZWR1Y3Rpb25MZWZ0LCByYWRpdXNSZWR1Y3Rpb25SaWdodCk7XG5cblx0XHR9LFxuXHRcdHNldENlbnRlclBvaW50OiBmdW5jdGlvbihsZWZ0TW92ZW1lbnQsIHJpZ2h0TW92ZW1lbnQpe1xuXG5cdFx0XHR2YXIgbWF4UmlnaHQgPSB0aGlzLndpZHRoIC0gcmlnaHRNb3ZlbWVudCAtIHRoaXMuZHJhd2luZ0FyZWEsXG5cdFx0XHRcdG1heExlZnQgPSBsZWZ0TW92ZW1lbnQgKyB0aGlzLmRyYXdpbmdBcmVhO1xuXG5cdFx0XHR0aGlzLnhDZW50ZXIgPSAobWF4TGVmdCArIG1heFJpZ2h0KS8yO1xuXHRcdFx0Ly8gQWx3YXlzIHZlcnRpY2FsbHkgaW4gdGhlIGNlbnRyZSBhcyB0aGUgdGV4dCBoZWlnaHQgZG9lc24ndCBjaGFuZ2Vcblx0XHRcdHRoaXMueUNlbnRlciA9ICh0aGlzLmhlaWdodC8yKTtcblx0XHR9LFxuXG5cdFx0Z2V0SW5kZXhBbmdsZSA6IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRcdHZhciBhbmdsZU11bHRpcGxpZXIgPSAoTWF0aC5QSSAqIDIpIC8gdGhpcy52YWx1ZXNDb3VudDtcblx0XHRcdC8vIFN0YXJ0IGZyb20gdGhlIHRvcCBpbnN0ZWFkIG9mIHJpZ2h0LCBzbyByZW1vdmUgYSBxdWFydGVyIG9mIHRoZSBjaXJjbGVcblxuXHRcdFx0cmV0dXJuIGluZGV4ICogYW5nbGVNdWx0aXBsaWVyIC0gKE1hdGguUEkvMik7XG5cdFx0fSxcblx0XHRnZXRQb2ludFBvc2l0aW9uIDogZnVuY3Rpb24oaW5kZXgsIGRpc3RhbmNlRnJvbUNlbnRlcil7XG5cdFx0XHR2YXIgdGhpc0FuZ2xlID0gdGhpcy5nZXRJbmRleEFuZ2xlKGluZGV4KTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHggOiAoTWF0aC5jb3ModGhpc0FuZ2xlKSAqIGRpc3RhbmNlRnJvbUNlbnRlcikgKyB0aGlzLnhDZW50ZXIsXG5cdFx0XHRcdHkgOiAoTWF0aC5zaW4odGhpc0FuZ2xlKSAqIGRpc3RhbmNlRnJvbUNlbnRlcikgKyB0aGlzLnlDZW50ZXJcblx0XHRcdH07XG5cdFx0fSxcblx0XHRkcmF3OiBmdW5jdGlvbigpe1xuXHRcdFx0aWYgKHRoaXMuZGlzcGxheSl7XG5cdFx0XHRcdHZhciBjdHggPSB0aGlzLmN0eDtcblx0XHRcdFx0ZWFjaCh0aGlzLnlMYWJlbHMsIGZ1bmN0aW9uKGxhYmVsLCBpbmRleCl7XG5cdFx0XHRcdFx0Ly8gRG9uJ3QgZHJhdyBhIGNlbnRyZSB2YWx1ZVxuXHRcdFx0XHRcdGlmIChpbmRleCA+IDApe1xuXHRcdFx0XHRcdFx0dmFyIHlDZW50ZXJPZmZzZXQgPSBpbmRleCAqICh0aGlzLmRyYXdpbmdBcmVhL3RoaXMuc3RlcHMpLFxuXHRcdFx0XHRcdFx0XHR5SGVpZ2h0ID0gdGhpcy55Q2VudGVyIC0geUNlbnRlck9mZnNldCxcblx0XHRcdFx0XHRcdFx0cG9pbnRQb3NpdGlvbjtcblxuXHRcdFx0XHRcdFx0Ly8gRHJhdyBjaXJjdWxhciBsaW5lcyBhcm91bmQgdGhlIHNjYWxlXG5cdFx0XHRcdFx0XHRpZiAodGhpcy5saW5lV2lkdGggPiAwKXtcblx0XHRcdFx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gdGhpcy5saW5lQ29sb3I7XG5cdFx0XHRcdFx0XHRcdGN0eC5saW5lV2lkdGggPSB0aGlzLmxpbmVXaWR0aDtcblxuXHRcdFx0XHRcdFx0XHRpZih0aGlzLmxpbmVBcmMpe1xuXHRcdFx0XHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHRcdFx0XHRjdHguYXJjKHRoaXMueENlbnRlciwgdGhpcy55Q2VudGVyLCB5Q2VudGVyT2Zmc2V0LCAwLCBNYXRoLlBJKjIpO1xuXHRcdFx0XHRcdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0XHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaT0wO2k8dGhpcy52YWx1ZXNDb3VudDtpKyspXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0cG9pbnRQb3NpdGlvbiA9IHRoaXMuZ2V0UG9pbnRQb3NpdGlvbihpLCB0aGlzLmNhbGN1bGF0ZUNlbnRlck9mZnNldCh0aGlzLm1pbiArIChpbmRleCAqIHRoaXMuc3RlcFZhbHVlKSkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGkgPT09IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjdHgubW92ZVRvKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55KTtcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGN0eC5saW5lVG8ocG9pbnRQb3NpdGlvbi54LCBwb2ludFBvc2l0aW9uLnkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdFx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZih0aGlzLnNob3dMYWJlbHMpe1xuXHRcdFx0XHRcdFx0XHRjdHguZm9udCA9IGZvbnRTdHJpbmcodGhpcy5mb250U2l6ZSx0aGlzLmZvbnRTdHlsZSx0aGlzLmZvbnRGYW1pbHkpO1xuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5zaG93TGFiZWxCYWNrZHJvcCl7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGxhYmVsV2lkdGggPSBjdHgubWVhc3VyZVRleHQobGFiZWwpLndpZHRoO1xuXHRcdFx0XHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLmJhY2tkcm9wQ29sb3I7XG5cdFx0XHRcdFx0XHRcdFx0Y3R4LmZpbGxSZWN0KFxuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy54Q2VudGVyIC0gbGFiZWxXaWR0aC8yIC0gdGhpcy5iYWNrZHJvcFBhZGRpbmdYLFxuXHRcdFx0XHRcdFx0XHRcdFx0eUhlaWdodCAtIHRoaXMuZm9udFNpemUvMiAtIHRoaXMuYmFja2Ryb3BQYWRkaW5nWSxcblx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsV2lkdGggKyB0aGlzLmJhY2tkcm9wUGFkZGluZ1gqMixcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuZm9udFNpemUgKyB0aGlzLmJhY2tkcm9wUGFkZGluZ1kqMlxuXHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Y3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuXHRcdFx0XHRcdFx0XHRjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMuZm9udENvbG9yO1xuXHRcdFx0XHRcdFx0XHRjdHguZmlsbFRleHQobGFiZWwsIHRoaXMueENlbnRlciwgeUhlaWdodCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCB0aGlzKTtcblxuXHRcdFx0XHRpZiAoIXRoaXMubGluZUFyYyl7XG5cdFx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IHRoaXMuYW5nbGVMaW5lV2lkdGg7XG5cdFx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gdGhpcy5hbmdsZUxpbmVDb2xvcjtcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gdGhpcy52YWx1ZXNDb3VudCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5hbmdsZUxpbmVXaWR0aCA+IDApe1xuXHRcdFx0XHRcdFx0XHR2YXIgb3V0ZXJQb3NpdGlvbiA9IHRoaXMuZ2V0UG9pbnRQb3NpdGlvbihpLCB0aGlzLmNhbGN1bGF0ZUNlbnRlck9mZnNldCh0aGlzLm1heCkpO1xuXHRcdFx0XHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdFx0XHRcdGN0eC5tb3ZlVG8odGhpcy54Q2VudGVyLCB0aGlzLnlDZW50ZXIpO1xuXHRcdFx0XHRcdFx0XHRjdHgubGluZVRvKG91dGVyUG9zaXRpb24ueCwgb3V0ZXJQb3NpdGlvbi55KTtcblx0XHRcdFx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdFx0XHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQvLyBFeHRyYSAzcHggb3V0IGZvciBzb21lIGxhYmVsIHNwYWNpbmdcblx0XHRcdFx0XHRcdHZhciBwb2ludExhYmVsUG9zaXRpb24gPSB0aGlzLmdldFBvaW50UG9zaXRpb24oaSwgdGhpcy5jYWxjdWxhdGVDZW50ZXJPZmZzZXQodGhpcy5tYXgpICsgNSk7XG5cdFx0XHRcdFx0XHRjdHguZm9udCA9IGZvbnRTdHJpbmcodGhpcy5wb2ludExhYmVsRm9udFNpemUsdGhpcy5wb2ludExhYmVsRm9udFN0eWxlLHRoaXMucG9pbnRMYWJlbEZvbnRGYW1pbHkpO1xuXHRcdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMucG9pbnRMYWJlbEZvbnRDb2xvcjtcblxuXHRcdFx0XHRcdFx0dmFyIGxhYmVsc0NvdW50ID0gdGhpcy5sYWJlbHMubGVuZ3RoLFxuXHRcdFx0XHRcdFx0XHRoYWxmTGFiZWxzQ291bnQgPSB0aGlzLmxhYmVscy5sZW5ndGgvMixcblx0XHRcdFx0XHRcdFx0cXVhcnRlckxhYmVsc0NvdW50ID0gaGFsZkxhYmVsc0NvdW50LzIsXG5cdFx0XHRcdFx0XHRcdHVwcGVySGFsZiA9IChpIDwgcXVhcnRlckxhYmVsc0NvdW50IHx8IGkgPiBsYWJlbHNDb3VudCAtIHF1YXJ0ZXJMYWJlbHNDb3VudCksXG5cdFx0XHRcdFx0XHRcdGV4YWN0UXVhcnRlciA9IChpID09PSBxdWFydGVyTGFiZWxzQ291bnQgfHwgaSA9PT0gbGFiZWxzQ291bnQgLSBxdWFydGVyTGFiZWxzQ291bnQpO1xuXHRcdFx0XHRcdFx0aWYgKGkgPT09IDApe1xuXHRcdFx0XHRcdFx0XHRjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYoaSA9PT0gaGFsZkxhYmVsc0NvdW50KXtcblx0XHRcdFx0XHRcdFx0Y3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChpIDwgaGFsZkxhYmVsc0NvdW50KXtcblx0XHRcdFx0XHRcdFx0Y3R4LnRleHRBbGlnbiA9ICdsZWZ0Jztcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGN0eC50ZXh0QWxpZ24gPSAncmlnaHQnO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBTZXQgdGhlIGNvcnJlY3QgdGV4dCBiYXNlbGluZSBiYXNlZCBvbiBvdXRlciBwb3NpdGlvbmluZ1xuXHRcdFx0XHRcdFx0aWYgKGV4YWN0UXVhcnRlcil7XG5cdFx0XHRcdFx0XHRcdGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodXBwZXJIYWxmKXtcblx0XHRcdFx0XHRcdFx0Y3R4LnRleHRCYXNlbGluZSA9ICdib3R0b20nO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Y3R4LnRleHRCYXNlbGluZSA9ICd0b3AnO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjdHguZmlsbFRleHQodGhpcy5sYWJlbHNbaV0sIHBvaW50TGFiZWxQb3NpdGlvbi54LCBwb2ludExhYmVsUG9zaXRpb24ueSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBBdHRhY2ggZ2xvYmFsIGV2ZW50IHRvIHJlc2l6ZSBlYWNoIGNoYXJ0IGluc3RhbmNlIHdoZW4gdGhlIGJyb3dzZXIgcmVzaXplc1xuXHRoZWxwZXJzLmFkZEV2ZW50KHdpbmRvdywgXCJyZXNpemVcIiwgKGZ1bmN0aW9uKCl7XG5cdFx0Ly8gQmFzaWMgZGVib3VuY2Ugb2YgcmVzaXplIGZ1bmN0aW9uIHNvIGl0IGRvZXNuJ3QgaHVydCBwZXJmb3JtYW5jZSB3aGVuIHJlc2l6aW5nIGJyb3dzZXIuXG5cdFx0dmFyIHRpbWVvdXQ7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCl7XG5cdFx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRlYWNoKENoYXJ0Lmluc3RhbmNlcyxmdW5jdGlvbihpbnN0YW5jZSl7XG5cdFx0XHRcdFx0Ly8gSWYgdGhlIHJlc3BvbnNpdmUgZmxhZyBpcyBzZXQgaW4gdGhlIGNoYXJ0IGluc3RhbmNlIGNvbmZpZ1xuXHRcdFx0XHRcdC8vIENhc2NhZGUgdGhlIHJlc2l6ZSBldmVudCBkb3duIHRvIHRoZSBjaGFydC5cblx0XHRcdFx0XHRpZiAoaW5zdGFuY2Uub3B0aW9ucy5yZXNwb25zaXZlKXtcblx0XHRcdFx0XHRcdGluc3RhbmNlLnJlc2l6ZShpbnN0YW5jZS5yZW5kZXIsIHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9LCA1MCk7XG5cdFx0fTtcblx0fSkoKSk7XG5cblxuXHRpZiAoYW1kKSB7XG5cdFx0ZGVmaW5lKGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gQ2hhcnQ7XG5cdFx0fSk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IENoYXJ0O1xuXHR9XG5cblx0cm9vdC5DaGFydCA9IENoYXJ0O1xuXG5cdENoYXJ0Lm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpe1xuXHRcdHJvb3QuQ2hhcnQgPSBwcmV2aW91cztcblx0XHRyZXR1cm4gQ2hhcnQ7XG5cdH07XG5cbn0pLmNhbGwodGhpcyk7XG5cbihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgcm9vdCA9IHRoaXMsXG5cdFx0Q2hhcnQgPSByb290LkNoYXJ0LFxuXHRcdGhlbHBlcnMgPSBDaGFydC5oZWxwZXJzO1xuXG5cblx0dmFyIGRlZmF1bHRDb25maWcgPSB7XG5cdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB0aGUgc2NhbGUgc2hvdWxkIHN0YXJ0IGF0IHplcm8sIG9yIGFuIG9yZGVyIG9mIG1hZ25pdHVkZSBkb3duIGZyb20gdGhlIGxvd2VzdCB2YWx1ZVxuXHRcdHNjYWxlQmVnaW5BdFplcm8gOiB0cnVlLFxuXG5cdFx0Ly9Cb29sZWFuIC0gV2hldGhlciBncmlkIGxpbmVzIGFyZSBzaG93biBhY3Jvc3MgdGhlIGNoYXJ0XG5cdFx0c2NhbGVTaG93R3JpZExpbmVzIDogdHJ1ZSxcblxuXHRcdC8vU3RyaW5nIC0gQ29sb3VyIG9mIHRoZSBncmlkIGxpbmVzXG5cdFx0c2NhbGVHcmlkTGluZUNvbG9yIDogXCJyZ2JhKDAsMCwwLC4wNSlcIixcblxuXHRcdC8vTnVtYmVyIC0gV2lkdGggb2YgdGhlIGdyaWQgbGluZXNcblx0XHRzY2FsZUdyaWRMaW5lV2lkdGggOiAxLFxuXG5cdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB0byBzaG93IGhvcml6b250YWwgbGluZXMgKGV4Y2VwdCBYIGF4aXMpXG5cdFx0c2NhbGVTaG93SG9yaXpvbnRhbExpbmVzOiB0cnVlLFxuXG5cdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB0byBzaG93IHZlcnRpY2FsIGxpbmVzIChleGNlcHQgWSBheGlzKVxuXHRcdHNjYWxlU2hvd1ZlcnRpY2FsTGluZXM6IHRydWUsXG5cblx0XHQvL0Jvb2xlYW4gLSBJZiB0aGVyZSBpcyBhIHN0cm9rZSBvbiBlYWNoIGJhclxuXHRcdGJhclNob3dTdHJva2UgOiB0cnVlLFxuXG5cdFx0Ly9OdW1iZXIgLSBQaXhlbCB3aWR0aCBvZiB0aGUgYmFyIHN0cm9rZVxuXHRcdGJhclN0cm9rZVdpZHRoIDogMixcblxuXHRcdC8vTnVtYmVyIC0gU3BhY2luZyBiZXR3ZWVuIGVhY2ggb2YgdGhlIFggdmFsdWUgc2V0c1xuXHRcdGJhclZhbHVlU3BhY2luZyA6IDUsXG5cblx0XHQvL051bWJlciAtIFNwYWNpbmcgYmV0d2VlbiBkYXRhIHNldHMgd2l0aGluIFggdmFsdWVzXG5cdFx0YmFyRGF0YXNldFNwYWNpbmcgOiAxLFxuXG5cdFx0Ly9TdHJpbmcgLSBBIGxlZ2VuZCB0ZW1wbGF0ZVxuXHRcdGxlZ2VuZFRlbXBsYXRlIDogXCI8dWwgY2xhc3M9XFxcIjwlPW5hbWUudG9Mb3dlckNhc2UoKSU+LWxlZ2VuZFxcXCI+PCUgZm9yICh2YXIgaT0wOyBpPGRhdGFzZXRzLmxlbmd0aDsgaSsrKXslPjxsaT48c3BhbiBzdHlsZT1cXFwiYmFja2dyb3VuZC1jb2xvcjo8JT1kYXRhc2V0c1tpXS5maWxsQ29sb3IlPlxcXCI+PC9zcGFuPjwlaWYoZGF0YXNldHNbaV0ubGFiZWwpeyU+PCU9ZGF0YXNldHNbaV0ubGFiZWwlPjwlfSU+PC9saT48JX0lPjwvdWw+XCJcblxuXHR9O1xuXG5cblx0Q2hhcnQuVHlwZS5leHRlbmQoe1xuXHRcdG5hbWU6IFwiQmFyXCIsXG5cdFx0ZGVmYXVsdHMgOiBkZWZhdWx0Q29uZmlnLFxuXHRcdGluaXRpYWxpemU6ICBmdW5jdGlvbihkYXRhKXtcblxuXHRcdFx0Ly9FeHBvc2Ugb3B0aW9ucyBhcyBhIHNjb3BlIHZhcmlhYmxlIGhlcmUgc28gd2UgY2FuIGFjY2VzcyBpdCBpbiB0aGUgU2NhbGVDbGFzc1xuXHRcdFx0dmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cblx0XHRcdHRoaXMuU2NhbGVDbGFzcyA9IENoYXJ0LlNjYWxlLmV4dGVuZCh7XG5cdFx0XHRcdG9mZnNldEdyaWRMaW5lcyA6IHRydWUsXG5cdFx0XHRcdGNhbGN1bGF0ZUJhclggOiBmdW5jdGlvbihkYXRhc2V0Q291bnQsIGRhdGFzZXRJbmRleCwgYmFySW5kZXgpe1xuXHRcdFx0XHRcdC8vUmV1c2FibGUgbWV0aG9kIGZvciBjYWxjdWxhdGluZyB0aGUgeFBvc2l0aW9uIG9mIGEgZ2l2ZW4gYmFyIGJhc2VkIG9uIGRhdGFzZXRJbmRleCAmIHdpZHRoIG9mIHRoZSBiYXJcblx0XHRcdFx0XHR2YXIgeFdpZHRoID0gdGhpcy5jYWxjdWxhdGVCYXNlV2lkdGgoKSxcblx0XHRcdFx0XHRcdHhBYnNvbHV0ZSA9IHRoaXMuY2FsY3VsYXRlWChiYXJJbmRleCkgLSAoeFdpZHRoLzIpLFxuXHRcdFx0XHRcdFx0YmFyV2lkdGggPSB0aGlzLmNhbGN1bGF0ZUJhcldpZHRoKGRhdGFzZXRDb3VudCk7XG5cblx0XHRcdFx0XHRyZXR1cm4geEFic29sdXRlICsgKGJhcldpZHRoICogZGF0YXNldEluZGV4KSArIChkYXRhc2V0SW5kZXggKiBvcHRpb25zLmJhckRhdGFzZXRTcGFjaW5nKSArIGJhcldpZHRoLzI7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNhbGN1bGF0ZUJhc2VXaWR0aCA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0cmV0dXJuICh0aGlzLmNhbGN1bGF0ZVgoMSkgLSB0aGlzLmNhbGN1bGF0ZVgoMCkpIC0gKDIqb3B0aW9ucy5iYXJWYWx1ZVNwYWNpbmcpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRjYWxjdWxhdGVCYXJXaWR0aCA6IGZ1bmN0aW9uKGRhdGFzZXRDb3VudCl7XG5cdFx0XHRcdFx0Ly9UaGUgcGFkZGluZyBiZXR3ZWVuIGRhdGFzZXRzIGlzIHRvIHRoZSByaWdodCBvZiBlYWNoIGJhciwgcHJvdmlkaW5nIHRoYXQgdGhlcmUgYXJlIG1vcmUgdGhhbiAxIGRhdGFzZXRcblx0XHRcdFx0XHR2YXIgYmFzZVdpZHRoID0gdGhpcy5jYWxjdWxhdGVCYXNlV2lkdGgoKSAtICgoZGF0YXNldENvdW50IC0gMSkgKiBvcHRpb25zLmJhckRhdGFzZXRTcGFjaW5nKTtcblxuXHRcdFx0XHRcdHJldHVybiAoYmFzZVdpZHRoIC8gZGF0YXNldENvdW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuZGF0YXNldHMgPSBbXTtcblxuXHRcdFx0Ly9TZXQgdXAgdG9vbHRpcCBldmVudHMgb24gdGhlIGNoYXJ0XG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLnNob3dUb29sdGlwcyl7XG5cdFx0XHRcdGhlbHBlcnMuYmluZEV2ZW50cyh0aGlzLCB0aGlzLm9wdGlvbnMudG9vbHRpcEV2ZW50cywgZnVuY3Rpb24oZXZ0KXtcblx0XHRcdFx0XHR2YXIgYWN0aXZlQmFycyA9IChldnQudHlwZSAhPT0gJ21vdXNlb3V0JykgPyB0aGlzLmdldEJhcnNBdEV2ZW50KGV2dCkgOiBbXTtcblxuXHRcdFx0XHRcdHRoaXMuZWFjaEJhcnMoZnVuY3Rpb24oYmFyKXtcblx0XHRcdFx0XHRcdGJhci5yZXN0b3JlKFsnZmlsbENvbG9yJywgJ3N0cm9rZUNvbG9yJ10pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGhlbHBlcnMuZWFjaChhY3RpdmVCYXJzLCBmdW5jdGlvbihhY3RpdmVCYXIpe1xuXHRcdFx0XHRcdFx0YWN0aXZlQmFyLmZpbGxDb2xvciA9IGFjdGl2ZUJhci5oaWdobGlnaHRGaWxsO1xuXHRcdFx0XHRcdFx0YWN0aXZlQmFyLnN0cm9rZUNvbG9yID0gYWN0aXZlQmFyLmhpZ2hsaWdodFN0cm9rZTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR0aGlzLnNob3dUb29sdGlwKGFjdGl2ZUJhcnMpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0Ly9EZWNsYXJlIHRoZSBleHRlbnNpb24gb2YgdGhlIGRlZmF1bHQgcG9pbnQsIHRvIGNhdGVyIGZvciB0aGUgb3B0aW9ucyBwYXNzZWQgaW4gdG8gdGhlIGNvbnN0cnVjdG9yXG5cdFx0XHR0aGlzLkJhckNsYXNzID0gQ2hhcnQuUmVjdGFuZ2xlLmV4dGVuZCh7XG5cdFx0XHRcdHN0cm9rZVdpZHRoIDogdGhpcy5vcHRpb25zLmJhclN0cm9rZVdpZHRoLFxuXHRcdFx0XHRzaG93U3Ryb2tlIDogdGhpcy5vcHRpb25zLmJhclNob3dTdHJva2UsXG5cdFx0XHRcdGN0eCA6IHRoaXMuY2hhcnQuY3R4XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly9JdGVyYXRlIHRocm91Z2ggZWFjaCBvZiB0aGUgZGF0YXNldHMsIGFuZCBidWlsZCB0aGlzIGludG8gYSBwcm9wZXJ0eSBvZiB0aGUgY2hhcnRcblx0XHRcdGhlbHBlcnMuZWFjaChkYXRhLmRhdGFzZXRzLGZ1bmN0aW9uKGRhdGFzZXQsZGF0YXNldEluZGV4KXtcblxuXHRcdFx0XHR2YXIgZGF0YXNldE9iamVjdCA9IHtcblx0XHRcdFx0XHRsYWJlbCA6IGRhdGFzZXQubGFiZWwgfHwgbnVsbCxcblx0XHRcdFx0XHRmaWxsQ29sb3IgOiBkYXRhc2V0LmZpbGxDb2xvcixcblx0XHRcdFx0XHRzdHJva2VDb2xvciA6IGRhdGFzZXQuc3Ryb2tlQ29sb3IsXG5cdFx0XHRcdFx0YmFycyA6IFtdXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dGhpcy5kYXRhc2V0cy5wdXNoKGRhdGFzZXRPYmplY3QpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZWFjaChkYXRhc2V0LmRhdGEsZnVuY3Rpb24oZGF0YVBvaW50LGluZGV4KXtcblx0XHRcdFx0XHQvL0FkZCBhIG5ldyBwb2ludCBmb3IgZWFjaCBwaWVjZSBvZiBkYXRhLCBwYXNzaW5nIGFueSByZXF1aXJlZCBkYXRhIHRvIGRyYXcuXG5cdFx0XHRcdFx0ZGF0YXNldE9iamVjdC5iYXJzLnB1c2gobmV3IHRoaXMuQmFyQ2xhc3Moe1xuXHRcdFx0XHRcdFx0dmFsdWUgOiBkYXRhUG9pbnQsXG5cdFx0XHRcdFx0XHRsYWJlbCA6IGRhdGEubGFiZWxzW2luZGV4XSxcblx0XHRcdFx0XHRcdGRhdGFzZXRMYWJlbDogZGF0YXNldC5sYWJlbCxcblx0XHRcdFx0XHRcdHN0cm9rZUNvbG9yIDogZGF0YXNldC5zdHJva2VDb2xvcixcblx0XHRcdFx0XHRcdGZpbGxDb2xvciA6IGRhdGFzZXQuZmlsbENvbG9yLFxuXHRcdFx0XHRcdFx0aGlnaGxpZ2h0RmlsbCA6IGRhdGFzZXQuaGlnaGxpZ2h0RmlsbCB8fCBkYXRhc2V0LmZpbGxDb2xvcixcblx0XHRcdFx0XHRcdGhpZ2hsaWdodFN0cm9rZSA6IGRhdGFzZXQuaGlnaGxpZ2h0U3Ryb2tlIHx8IGRhdGFzZXQuc3Ryb2tlQ29sb3Jcblx0XHRcdFx0XHR9KSk7XG5cdFx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdHRoaXMuYnVpbGRTY2FsZShkYXRhLmxhYmVscyk7XG5cblx0XHRcdHRoaXMuQmFyQ2xhc3MucHJvdG90eXBlLmJhc2UgPSB0aGlzLnNjYWxlLmVuZFBvaW50O1xuXG5cdFx0XHR0aGlzLmVhY2hCYXJzKGZ1bmN0aW9uKGJhciwgaW5kZXgsIGRhdGFzZXRJbmRleCl7XG5cdFx0XHRcdGhlbHBlcnMuZXh0ZW5kKGJhciwge1xuXHRcdFx0XHRcdHdpZHRoIDogdGhpcy5zY2FsZS5jYWxjdWxhdGVCYXJXaWR0aCh0aGlzLmRhdGFzZXRzLmxlbmd0aCksXG5cdFx0XHRcdFx0eDogdGhpcy5zY2FsZS5jYWxjdWxhdGVCYXJYKHRoaXMuZGF0YXNldHMubGVuZ3RoLCBkYXRhc2V0SW5kZXgsIGluZGV4KSxcblx0XHRcdFx0XHR5OiB0aGlzLnNjYWxlLmVuZFBvaW50XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRiYXIuc2F2ZSgpO1xuXHRcdFx0fSwgdGhpcyk7XG5cblx0XHRcdHRoaXMucmVuZGVyKCk7XG5cdFx0fSxcblx0XHR1cGRhdGUgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5zY2FsZS51cGRhdGUoKTtcblx0XHRcdC8vIFJlc2V0IGFueSBoaWdobGlnaHQgY29sb3VycyBiZWZvcmUgdXBkYXRpbmcuXG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5hY3RpdmVFbGVtZW50cywgZnVuY3Rpb24oYWN0aXZlRWxlbWVudCl7XG5cdFx0XHRcdGFjdGl2ZUVsZW1lbnQucmVzdG9yZShbJ2ZpbGxDb2xvcicsICdzdHJva2VDb2xvciddKTtcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLmVhY2hCYXJzKGZ1bmN0aW9uKGJhcil7XG5cdFx0XHRcdGJhci5zYXZlKCk7XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMucmVuZGVyKCk7XG5cdFx0fSxcblx0XHRlYWNoQmFycyA6IGZ1bmN0aW9uKGNhbGxiYWNrKXtcblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmRhdGFzZXRzLGZ1bmN0aW9uKGRhdGFzZXQsIGRhdGFzZXRJbmRleCl7XG5cdFx0XHRcdGhlbHBlcnMuZWFjaChkYXRhc2V0LmJhcnMsIGNhbGxiYWNrLCB0aGlzLCBkYXRhc2V0SW5kZXgpO1xuXHRcdFx0fSx0aGlzKTtcblx0XHR9LFxuXHRcdGdldEJhcnNBdEV2ZW50IDogZnVuY3Rpb24oZSl7XG5cdFx0XHR2YXIgYmFyc0FycmF5ID0gW10sXG5cdFx0XHRcdGV2ZW50UG9zaXRpb24gPSBoZWxwZXJzLmdldFJlbGF0aXZlUG9zaXRpb24oZSksXG5cdFx0XHRcdGRhdGFzZXRJdGVyYXRvciA9IGZ1bmN0aW9uKGRhdGFzZXQpe1xuXHRcdFx0XHRcdGJhcnNBcnJheS5wdXNoKGRhdGFzZXQuYmFyc1tiYXJJbmRleF0pO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRiYXJJbmRleDtcblxuXHRcdFx0Zm9yICh2YXIgZGF0YXNldEluZGV4ID0gMDsgZGF0YXNldEluZGV4IDwgdGhpcy5kYXRhc2V0cy5sZW5ndGg7IGRhdGFzZXRJbmRleCsrKSB7XG5cdFx0XHRcdGZvciAoYmFySW5kZXggPSAwOyBiYXJJbmRleCA8IHRoaXMuZGF0YXNldHNbZGF0YXNldEluZGV4XS5iYXJzLmxlbmd0aDsgYmFySW5kZXgrKykge1xuXHRcdFx0XHRcdGlmICh0aGlzLmRhdGFzZXRzW2RhdGFzZXRJbmRleF0uYmFyc1tiYXJJbmRleF0uaW5SYW5nZShldmVudFBvc2l0aW9uLngsZXZlbnRQb3NpdGlvbi55KSl7XG5cdFx0XHRcdFx0XHRoZWxwZXJzLmVhY2godGhpcy5kYXRhc2V0cywgZGF0YXNldEl0ZXJhdG9yKTtcblx0XHRcdFx0XHRcdHJldHVybiBiYXJzQXJyYXk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBiYXJzQXJyYXk7XG5cdFx0fSxcblx0XHRidWlsZFNjYWxlIDogZnVuY3Rpb24obGFiZWxzKXtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdFx0dmFyIGRhdGFUb3RhbCA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciB2YWx1ZXMgPSBbXTtcblx0XHRcdFx0c2VsZi5lYWNoQmFycyhmdW5jdGlvbihiYXIpe1xuXHRcdFx0XHRcdHZhbHVlcy5wdXNoKGJhci52YWx1ZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gdmFsdWVzO1xuXHRcdFx0fTtcblxuXHRcdFx0dmFyIHNjYWxlT3B0aW9ucyA9IHtcblx0XHRcdFx0dGVtcGxhdGVTdHJpbmcgOiB0aGlzLm9wdGlvbnMuc2NhbGVMYWJlbCxcblx0XHRcdFx0aGVpZ2h0IDogdGhpcy5jaGFydC5oZWlnaHQsXG5cdFx0XHRcdHdpZHRoIDogdGhpcy5jaGFydC53aWR0aCxcblx0XHRcdFx0Y3R4IDogdGhpcy5jaGFydC5jdHgsXG5cdFx0XHRcdHRleHRDb2xvciA6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRDb2xvcixcblx0XHRcdFx0Zm9udFNpemUgOiB0aGlzLm9wdGlvbnMuc2NhbGVGb250U2l6ZSxcblx0XHRcdFx0Zm9udFN0eWxlIDogdGhpcy5vcHRpb25zLnNjYWxlRm9udFN0eWxlLFxuXHRcdFx0XHRmb250RmFtaWx5IDogdGhpcy5vcHRpb25zLnNjYWxlRm9udEZhbWlseSxcblx0XHRcdFx0dmFsdWVzQ291bnQgOiBsYWJlbHMubGVuZ3RoLFxuXHRcdFx0XHRiZWdpbkF0WmVybyA6IHRoaXMub3B0aW9ucy5zY2FsZUJlZ2luQXRaZXJvLFxuXHRcdFx0XHRpbnRlZ2Vyc09ubHkgOiB0aGlzLm9wdGlvbnMuc2NhbGVJbnRlZ2Vyc09ubHksXG5cdFx0XHRcdGNhbGN1bGF0ZVlSYW5nZTogZnVuY3Rpb24oY3VycmVudEhlaWdodCl7XG5cdFx0XHRcdFx0dmFyIHVwZGF0ZWRSYW5nZXMgPSBoZWxwZXJzLmNhbGN1bGF0ZVNjYWxlUmFuZ2UoXG5cdFx0XHRcdFx0XHRkYXRhVG90YWwoKSxcblx0XHRcdFx0XHRcdGN1cnJlbnRIZWlnaHQsXG5cdFx0XHRcdFx0XHR0aGlzLmZvbnRTaXplLFxuXHRcdFx0XHRcdFx0dGhpcy5iZWdpbkF0WmVybyxcblx0XHRcdFx0XHRcdHRoaXMuaW50ZWdlcnNPbmx5XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRoZWxwZXJzLmV4dGVuZCh0aGlzLCB1cGRhdGVkUmFuZ2VzKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0eExhYmVscyA6IGxhYmVscyxcblx0XHRcdFx0Zm9udCA6IGhlbHBlcnMuZm9udFN0cmluZyh0aGlzLm9wdGlvbnMuc2NhbGVGb250U2l6ZSwgdGhpcy5vcHRpb25zLnNjYWxlRm9udFN0eWxlLCB0aGlzLm9wdGlvbnMuc2NhbGVGb250RmFtaWx5KSxcblx0XHRcdFx0bGluZVdpZHRoIDogdGhpcy5vcHRpb25zLnNjYWxlTGluZVdpZHRoLFxuXHRcdFx0XHRsaW5lQ29sb3IgOiB0aGlzLm9wdGlvbnMuc2NhbGVMaW5lQ29sb3IsXG5cdFx0XHRcdHNob3dIb3Jpem9udGFsTGluZXMgOiB0aGlzLm9wdGlvbnMuc2NhbGVTaG93SG9yaXpvbnRhbExpbmVzLFxuXHRcdFx0XHRzaG93VmVydGljYWxMaW5lcyA6IHRoaXMub3B0aW9ucy5zY2FsZVNob3dWZXJ0aWNhbExpbmVzLFxuXHRcdFx0XHRncmlkTGluZVdpZHRoIDogKHRoaXMub3B0aW9ucy5zY2FsZVNob3dHcmlkTGluZXMpID8gdGhpcy5vcHRpb25zLnNjYWxlR3JpZExpbmVXaWR0aCA6IDAsXG5cdFx0XHRcdGdyaWRMaW5lQ29sb3IgOiAodGhpcy5vcHRpb25zLnNjYWxlU2hvd0dyaWRMaW5lcykgPyB0aGlzLm9wdGlvbnMuc2NhbGVHcmlkTGluZUNvbG9yIDogXCJyZ2JhKDAsMCwwLDApXCIsXG5cdFx0XHRcdHBhZGRpbmcgOiAodGhpcy5vcHRpb25zLnNob3dTY2FsZSkgPyAwIDogKHRoaXMub3B0aW9ucy5iYXJTaG93U3Ryb2tlKSA/IHRoaXMub3B0aW9ucy5iYXJTdHJva2VXaWR0aCA6IDAsXG5cdFx0XHRcdHNob3dMYWJlbHMgOiB0aGlzLm9wdGlvbnMuc2NhbGVTaG93TGFiZWxzLFxuXHRcdFx0XHRkaXNwbGF5IDogdGhpcy5vcHRpb25zLnNob3dTY2FsZVxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5zY2FsZU92ZXJyaWRlKXtcblx0XHRcdFx0aGVscGVycy5leHRlbmQoc2NhbGVPcHRpb25zLCB7XG5cdFx0XHRcdFx0Y2FsY3VsYXRlWVJhbmdlOiBoZWxwZXJzLm5vb3AsXG5cdFx0XHRcdFx0c3RlcHM6IHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBzLFxuXHRcdFx0XHRcdHN0ZXBWYWx1ZTogdGhpcy5vcHRpb25zLnNjYWxlU3RlcFdpZHRoLFxuXHRcdFx0XHRcdG1pbjogdGhpcy5vcHRpb25zLnNjYWxlU3RhcnRWYWx1ZSxcblx0XHRcdFx0XHRtYXg6IHRoaXMub3B0aW9ucy5zY2FsZVN0YXJ0VmFsdWUgKyAodGhpcy5vcHRpb25zLnNjYWxlU3RlcHMgKiB0aGlzLm9wdGlvbnMuc2NhbGVTdGVwV2lkdGgpXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnNjYWxlID0gbmV3IHRoaXMuU2NhbGVDbGFzcyhzY2FsZU9wdGlvbnMpO1xuXHRcdH0sXG5cdFx0YWRkRGF0YSA6IGZ1bmN0aW9uKHZhbHVlc0FycmF5LGxhYmVsKXtcblx0XHRcdC8vTWFwIHRoZSB2YWx1ZXMgYXJyYXkgZm9yIGVhY2ggb2YgdGhlIGRhdGFzZXRzXG5cdFx0XHRoZWxwZXJzLmVhY2godmFsdWVzQXJyYXksZnVuY3Rpb24odmFsdWUsZGF0YXNldEluZGV4KXtcblx0XHRcdFx0Ly9BZGQgYSBuZXcgcG9pbnQgZm9yIGVhY2ggcGllY2Ugb2YgZGF0YSwgcGFzc2luZyBhbnkgcmVxdWlyZWQgZGF0YSB0byBkcmF3LlxuXHRcdFx0XHR0aGlzLmRhdGFzZXRzW2RhdGFzZXRJbmRleF0uYmFycy5wdXNoKG5ldyB0aGlzLkJhckNsYXNzKHtcblx0XHRcdFx0XHR2YWx1ZSA6IHZhbHVlLFxuXHRcdFx0XHRcdGxhYmVsIDogbGFiZWwsXG5cdFx0XHRcdFx0eDogdGhpcy5zY2FsZS5jYWxjdWxhdGVCYXJYKHRoaXMuZGF0YXNldHMubGVuZ3RoLCBkYXRhc2V0SW5kZXgsIHRoaXMuc2NhbGUudmFsdWVzQ291bnQrMSksXG5cdFx0XHRcdFx0eTogdGhpcy5zY2FsZS5lbmRQb2ludCxcblx0XHRcdFx0XHR3aWR0aCA6IHRoaXMuc2NhbGUuY2FsY3VsYXRlQmFyV2lkdGgodGhpcy5kYXRhc2V0cy5sZW5ndGgpLFxuXHRcdFx0XHRcdGJhc2UgOiB0aGlzLnNjYWxlLmVuZFBvaW50LFxuXHRcdFx0XHRcdHN0cm9rZUNvbG9yIDogdGhpcy5kYXRhc2V0c1tkYXRhc2V0SW5kZXhdLnN0cm9rZUNvbG9yLFxuXHRcdFx0XHRcdGZpbGxDb2xvciA6IHRoaXMuZGF0YXNldHNbZGF0YXNldEluZGV4XS5maWxsQ29sb3Jcblx0XHRcdFx0fSkpO1xuXHRcdFx0fSx0aGlzKTtcblxuXHRcdFx0dGhpcy5zY2FsZS5hZGRYTGFiZWwobGFiZWwpO1xuXHRcdFx0Ly9UaGVuIHJlLXJlbmRlciB0aGUgY2hhcnQuXG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdH0sXG5cdFx0cmVtb3ZlRGF0YSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLnNjYWxlLnJlbW92ZVhMYWJlbCgpO1xuXHRcdFx0Ly9UaGVuIHJlLXJlbmRlciB0aGUgY2hhcnQuXG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5kYXRhc2V0cyxmdW5jdGlvbihkYXRhc2V0KXtcblx0XHRcdFx0ZGF0YXNldC5iYXJzLnNoaWZ0KCk7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHR9LFxuXHRcdHJlZmxvdyA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRoZWxwZXJzLmV4dGVuZCh0aGlzLkJhckNsYXNzLnByb3RvdHlwZSx7XG5cdFx0XHRcdHk6IHRoaXMuc2NhbGUuZW5kUG9pbnQsXG5cdFx0XHRcdGJhc2UgOiB0aGlzLnNjYWxlLmVuZFBvaW50XG5cdFx0XHR9KTtcblx0XHRcdHZhciBuZXdTY2FsZVByb3BzID0gaGVscGVycy5leHRlbmQoe1xuXHRcdFx0XHRoZWlnaHQgOiB0aGlzLmNoYXJ0LmhlaWdodCxcblx0XHRcdFx0d2lkdGggOiB0aGlzLmNoYXJ0LndpZHRoXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuc2NhbGUudXBkYXRlKG5ld1NjYWxlUHJvcHMpO1xuXHRcdH0sXG5cdFx0ZHJhdyA6IGZ1bmN0aW9uKGVhc2Upe1xuXHRcdFx0dmFyIGVhc2luZ0RlY2ltYWwgPSBlYXNlIHx8IDE7XG5cdFx0XHR0aGlzLmNsZWFyKCk7XG5cblx0XHRcdHZhciBjdHggPSB0aGlzLmNoYXJ0LmN0eDtcblxuXHRcdFx0dGhpcy5zY2FsZS5kcmF3KGVhc2luZ0RlY2ltYWwpO1xuXG5cdFx0XHQvL0RyYXcgYWxsIHRoZSBiYXJzIGZvciBlYWNoIGRhdGFzZXRcblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmRhdGFzZXRzLGZ1bmN0aW9uKGRhdGFzZXQsZGF0YXNldEluZGV4KXtcblx0XHRcdFx0aGVscGVycy5lYWNoKGRhdGFzZXQuYmFycyxmdW5jdGlvbihiYXIsaW5kZXgpe1xuXHRcdFx0XHRcdGlmIChiYXIuaGFzVmFsdWUoKSl7XG5cdFx0XHRcdFx0XHRiYXIuYmFzZSA9IHRoaXMuc2NhbGUuZW5kUG9pbnQ7XG5cdFx0XHRcdFx0XHQvL1RyYW5zaXRpb24gdGhlbiBkcmF3XG5cdFx0XHRcdFx0XHRiYXIudHJhbnNpdGlvbih7XG5cdFx0XHRcdFx0XHRcdHggOiB0aGlzLnNjYWxlLmNhbGN1bGF0ZUJhclgodGhpcy5kYXRhc2V0cy5sZW5ndGgsIGRhdGFzZXRJbmRleCwgaW5kZXgpLFxuXHRcdFx0XHRcdFx0XHR5IDogdGhpcy5zY2FsZS5jYWxjdWxhdGVZKGJhci52YWx1ZSksXG5cdFx0XHRcdFx0XHRcdHdpZHRoIDogdGhpcy5zY2FsZS5jYWxjdWxhdGVCYXJXaWR0aCh0aGlzLmRhdGFzZXRzLmxlbmd0aClcblx0XHRcdFx0XHRcdH0sIGVhc2luZ0RlY2ltYWwpLmRyYXcoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdH0sdGhpcyk7XG5cdFx0fVxuXHR9KTtcblxuXG59KS5jYWxsKHRoaXMpO1xuXG4oZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIHJvb3QgPSB0aGlzLFxuXHRcdENoYXJ0ID0gcm9vdC5DaGFydCxcblx0XHQvL0NhY2hlIGEgbG9jYWwgcmVmZXJlbmNlIHRvIENoYXJ0LmhlbHBlcnNcblx0XHRoZWxwZXJzID0gQ2hhcnQuaGVscGVycztcblxuXHR2YXIgZGVmYXVsdENvbmZpZyA9IHtcblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHdlIHNob3VsZCBzaG93IGEgc3Ryb2tlIG9uIGVhY2ggc2VnbWVudFxuXHRcdHNlZ21lbnRTaG93U3Ryb2tlIDogdHJ1ZSxcblxuXHRcdC8vU3RyaW5nIC0gVGhlIGNvbG91ciBvZiBlYWNoIHNlZ21lbnQgc3Ryb2tlXG5cdFx0c2VnbWVudFN0cm9rZUNvbG9yIDogXCIjZmZmXCIsXG5cblx0XHQvL051bWJlciAtIFRoZSB3aWR0aCBvZiBlYWNoIHNlZ21lbnQgc3Ryb2tlXG5cdFx0c2VnbWVudFN0cm9rZVdpZHRoIDogMixcblxuXHRcdC8vVGhlIHBlcmNlbnRhZ2Ugb2YgdGhlIGNoYXJ0IHRoYXQgd2UgY3V0IG91dCBvZiB0aGUgbWlkZGxlLlxuXHRcdHBlcmNlbnRhZ2VJbm5lckN1dG91dCA6IDUwLFxuXG5cdFx0Ly9OdW1iZXIgLSBBbW91bnQgb2YgYW5pbWF0aW9uIHN0ZXBzXG5cdFx0YW5pbWF0aW9uU3RlcHMgOiAxMDAsXG5cblx0XHQvL1N0cmluZyAtIEFuaW1hdGlvbiBlYXNpbmcgZWZmZWN0XG5cdFx0YW5pbWF0aW9uRWFzaW5nIDogXCJlYXNlT3V0Qm91bmNlXCIsXG5cblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHdlIGFuaW1hdGUgdGhlIHJvdGF0aW9uIG9mIHRoZSBEb3VnaG51dFxuXHRcdGFuaW1hdGVSb3RhdGUgOiB0cnVlLFxuXG5cdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB3ZSBhbmltYXRlIHNjYWxpbmcgdGhlIERvdWdobnV0IGZyb20gdGhlIGNlbnRyZVxuXHRcdGFuaW1hdGVTY2FsZSA6IGZhbHNlLFxuXG5cdFx0Ly9TdHJpbmcgLSBBIGxlZ2VuZCB0ZW1wbGF0ZVxuXHRcdGxlZ2VuZFRlbXBsYXRlIDogXCI8dWwgY2xhc3M9XFxcIjwlPW5hbWUudG9Mb3dlckNhc2UoKSU+LWxlZ2VuZFxcXCI+PCUgZm9yICh2YXIgaT0wOyBpPHNlZ21lbnRzLmxlbmd0aDsgaSsrKXslPjxsaT48c3BhbiBzdHlsZT1cXFwiYmFja2dyb3VuZC1jb2xvcjo8JT1zZWdtZW50c1tpXS5maWxsQ29sb3IlPlxcXCI+PC9zcGFuPjwlaWYoc2VnbWVudHNbaV0ubGFiZWwpeyU+PCU9c2VnbWVudHNbaV0ubGFiZWwlPjwlfSU+PC9saT48JX0lPjwvdWw+XCJcblxuXHR9O1xuXG5cblx0Q2hhcnQuVHlwZS5leHRlbmQoe1xuXHRcdC8vUGFzc2luZyBpbiBhIG5hbWUgcmVnaXN0ZXJzIHRoaXMgY2hhcnQgaW4gdGhlIENoYXJ0IG5hbWVzcGFjZVxuXHRcdG5hbWU6IFwiRG91Z2hudXRcIixcblx0XHQvL1Byb3ZpZGluZyBhIGRlZmF1bHRzIHdpbGwgYWxzbyByZWdpc3RlciB0aGUgZGVhZnVsdHMgaW4gdGhlIGNoYXJ0IG5hbWVzcGFjZVxuXHRcdGRlZmF1bHRzIDogZGVmYXVsdENvbmZpZyxcblx0XHQvL0luaXRpYWxpemUgaXMgZmlyZWQgd2hlbiB0aGUgY2hhcnQgaXMgaW5pdGlhbGl6ZWQgLSBEYXRhIGlzIHBhc3NlZCBpbiBhcyBhIHBhcmFtZXRlclxuXHRcdC8vQ29uZmlnIGlzIGF1dG9tYXRpY2FsbHkgbWVyZ2VkIGJ5IHRoZSBjb3JlIG9mIENoYXJ0LmpzLCBhbmQgaXMgYXZhaWxhYmxlIGF0IHRoaXMub3B0aW9uc1xuXHRcdGluaXRpYWxpemU6ICBmdW5jdGlvbihkYXRhKXtcblxuXHRcdFx0Ly9EZWNsYXJlIHNlZ21lbnRzIGFzIGEgc3RhdGljIHByb3BlcnR5IHRvIHByZXZlbnQgaW5oZXJpdGluZyBhY3Jvc3MgdGhlIENoYXJ0IHR5cGUgcHJvdG90eXBlXG5cdFx0XHR0aGlzLnNlZ21lbnRzID0gW107XG5cdFx0XHR0aGlzLm91dGVyUmFkaXVzID0gKGhlbHBlcnMubWluKFt0aGlzLmNoYXJ0LndpZHRoLHRoaXMuY2hhcnQuaGVpZ2h0XSkgLVx0dGhpcy5vcHRpb25zLnNlZ21lbnRTdHJva2VXaWR0aC8yKS8yO1xuXG5cdFx0XHR0aGlzLlNlZ21lbnRBcmMgPSBDaGFydC5BcmMuZXh0ZW5kKHtcblx0XHRcdFx0Y3R4IDogdGhpcy5jaGFydC5jdHgsXG5cdFx0XHRcdHggOiB0aGlzLmNoYXJ0LndpZHRoLzIsXG5cdFx0XHRcdHkgOiB0aGlzLmNoYXJ0LmhlaWdodC8yXG5cdFx0XHR9KTtcblxuXHRcdFx0Ly9TZXQgdXAgdG9vbHRpcCBldmVudHMgb24gdGhlIGNoYXJ0XG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLnNob3dUb29sdGlwcyl7XG5cdFx0XHRcdGhlbHBlcnMuYmluZEV2ZW50cyh0aGlzLCB0aGlzLm9wdGlvbnMudG9vbHRpcEV2ZW50cywgZnVuY3Rpb24oZXZ0KXtcblx0XHRcdFx0XHR2YXIgYWN0aXZlU2VnbWVudHMgPSAoZXZ0LnR5cGUgIT09ICdtb3VzZW91dCcpID8gdGhpcy5nZXRTZWdtZW50c0F0RXZlbnQoZXZ0KSA6IFtdO1xuXG5cdFx0XHRcdFx0aGVscGVycy5lYWNoKHRoaXMuc2VnbWVudHMsZnVuY3Rpb24oc2VnbWVudCl7XG5cdFx0XHRcdFx0XHRzZWdtZW50LnJlc3RvcmUoW1wiZmlsbENvbG9yXCJdKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRoZWxwZXJzLmVhY2goYWN0aXZlU2VnbWVudHMsZnVuY3Rpb24oYWN0aXZlU2VnbWVudCl7XG5cdFx0XHRcdFx0XHRhY3RpdmVTZWdtZW50LmZpbGxDb2xvciA9IGFjdGl2ZVNlZ21lbnQuaGlnaGxpZ2h0Q29sb3I7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dGhpcy5zaG93VG9vbHRpcChhY3RpdmVTZWdtZW50cyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5jYWxjdWxhdGVUb3RhbChkYXRhKTtcblxuXHRcdFx0aGVscGVycy5lYWNoKGRhdGEsZnVuY3Rpb24oZGF0YXBvaW50LCBpbmRleCl7XG5cdFx0XHRcdHRoaXMuYWRkRGF0YShkYXRhcG9pbnQsIGluZGV4LCB0cnVlKTtcblx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdHRoaXMucmVuZGVyKCk7XG5cdFx0fSxcblx0XHRnZXRTZWdtZW50c0F0RXZlbnQgOiBmdW5jdGlvbihlKXtcblx0XHRcdHZhciBzZWdtZW50c0FycmF5ID0gW107XG5cblx0XHRcdHZhciBsb2NhdGlvbiA9IGhlbHBlcnMuZ2V0UmVsYXRpdmVQb3NpdGlvbihlKTtcblxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuc2VnbWVudHMsZnVuY3Rpb24oc2VnbWVudCl7XG5cdFx0XHRcdGlmIChzZWdtZW50LmluUmFuZ2UobG9jYXRpb24ueCxsb2NhdGlvbi55KSkgc2VnbWVudHNBcnJheS5wdXNoKHNlZ21lbnQpO1xuXHRcdFx0fSx0aGlzKTtcblx0XHRcdHJldHVybiBzZWdtZW50c0FycmF5O1xuXHRcdH0sXG5cdFx0YWRkRGF0YSA6IGZ1bmN0aW9uKHNlZ21lbnQsIGF0SW5kZXgsIHNpbGVudCl7XG5cdFx0XHR2YXIgaW5kZXggPSBhdEluZGV4IHx8IHRoaXMuc2VnbWVudHMubGVuZ3RoO1xuXHRcdFx0dGhpcy5zZWdtZW50cy5zcGxpY2UoaW5kZXgsIDAsIG5ldyB0aGlzLlNlZ21lbnRBcmMoe1xuXHRcdFx0XHR2YWx1ZSA6IHNlZ21lbnQudmFsdWUsXG5cdFx0XHRcdG91dGVyUmFkaXVzIDogKHRoaXMub3B0aW9ucy5hbmltYXRlU2NhbGUpID8gMCA6IHRoaXMub3V0ZXJSYWRpdXMsXG5cdFx0XHRcdGlubmVyUmFkaXVzIDogKHRoaXMub3B0aW9ucy5hbmltYXRlU2NhbGUpID8gMCA6ICh0aGlzLm91dGVyUmFkaXVzLzEwMCkgKiB0aGlzLm9wdGlvbnMucGVyY2VudGFnZUlubmVyQ3V0b3V0LFxuXHRcdFx0XHRmaWxsQ29sb3IgOiBzZWdtZW50LmNvbG9yLFxuXHRcdFx0XHRoaWdobGlnaHRDb2xvciA6IHNlZ21lbnQuaGlnaGxpZ2h0IHx8IHNlZ21lbnQuY29sb3IsXG5cdFx0XHRcdHNob3dTdHJva2UgOiB0aGlzLm9wdGlvbnMuc2VnbWVudFNob3dTdHJva2UsXG5cdFx0XHRcdHN0cm9rZVdpZHRoIDogdGhpcy5vcHRpb25zLnNlZ21lbnRTdHJva2VXaWR0aCxcblx0XHRcdFx0c3Ryb2tlQ29sb3IgOiB0aGlzLm9wdGlvbnMuc2VnbWVudFN0cm9rZUNvbG9yLFxuXHRcdFx0XHRzdGFydEFuZ2xlIDogTWF0aC5QSSAqIDEuNSxcblx0XHRcdFx0Y2lyY3VtZmVyZW5jZSA6ICh0aGlzLm9wdGlvbnMuYW5pbWF0ZVJvdGF0ZSkgPyAwIDogdGhpcy5jYWxjdWxhdGVDaXJjdW1mZXJlbmNlKHNlZ21lbnQudmFsdWUpLFxuXHRcdFx0XHRsYWJlbCA6IHNlZ21lbnQubGFiZWxcblx0XHRcdH0pKTtcblx0XHRcdGlmICghc2lsZW50KXtcblx0XHRcdFx0dGhpcy5yZWZsb3coKTtcblx0XHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGNhbGN1bGF0ZUNpcmN1bWZlcmVuY2UgOiBmdW5jdGlvbih2YWx1ZSl7XG5cdFx0XHRyZXR1cm4gKE1hdGguUEkqMikqKE1hdGguYWJzKHZhbHVlKSAvIHRoaXMudG90YWwpO1xuXHRcdH0sXG5cdFx0Y2FsY3VsYXRlVG90YWwgOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdHRoaXMudG90YWwgPSAwO1xuXHRcdFx0aGVscGVycy5lYWNoKGRhdGEsZnVuY3Rpb24oc2VnbWVudCl7XG5cdFx0XHRcdHRoaXMudG90YWwgKz0gTWF0aC5hYnMoc2VnbWVudC52YWx1ZSk7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdH0sXG5cdFx0dXBkYXRlIDogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuY2FsY3VsYXRlVG90YWwodGhpcy5zZWdtZW50cyk7XG5cblx0XHRcdC8vIFJlc2V0IGFueSBoaWdobGlnaHQgY29sb3VycyBiZWZvcmUgdXBkYXRpbmcuXG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5hY3RpdmVFbGVtZW50cywgZnVuY3Rpb24oYWN0aXZlRWxlbWVudCl7XG5cdFx0XHRcdGFjdGl2ZUVsZW1lbnQucmVzdG9yZShbJ2ZpbGxDb2xvciddKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5zZWdtZW50cyxmdW5jdGlvbihzZWdtZW50KXtcblx0XHRcdFx0c2VnbWVudC5zYXZlKCk7XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMucmVuZGVyKCk7XG5cdFx0fSxcblxuXHRcdHJlbW92ZURhdGE6IGZ1bmN0aW9uKGF0SW5kZXgpe1xuXHRcdFx0dmFyIGluZGV4VG9EZWxldGUgPSAoaGVscGVycy5pc051bWJlcihhdEluZGV4KSkgPyBhdEluZGV4IDogdGhpcy5zZWdtZW50cy5sZW5ndGgtMTtcblx0XHRcdHRoaXMuc2VnbWVudHMuc3BsaWNlKGluZGV4VG9EZWxldGUsIDEpO1xuXHRcdFx0dGhpcy5yZWZsb3coKTtcblx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0fSxcblxuXHRcdHJlZmxvdyA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRoZWxwZXJzLmV4dGVuZCh0aGlzLlNlZ21lbnRBcmMucHJvdG90eXBlLHtcblx0XHRcdFx0eCA6IHRoaXMuY2hhcnQud2lkdGgvMixcblx0XHRcdFx0eSA6IHRoaXMuY2hhcnQuaGVpZ2h0LzJcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5vdXRlclJhZGl1cyA9IChoZWxwZXJzLm1pbihbdGhpcy5jaGFydC53aWR0aCx0aGlzLmNoYXJ0LmhlaWdodF0pIC1cdHRoaXMub3B0aW9ucy5zZWdtZW50U3Ryb2tlV2lkdGgvMikvMjtcblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLnNlZ21lbnRzLCBmdW5jdGlvbihzZWdtZW50KXtcblx0XHRcdFx0c2VnbWVudC51cGRhdGUoe1xuXHRcdFx0XHRcdG91dGVyUmFkaXVzIDogdGhpcy5vdXRlclJhZGl1cyxcblx0XHRcdFx0XHRpbm5lclJhZGl1cyA6ICh0aGlzLm91dGVyUmFkaXVzLzEwMCkgKiB0aGlzLm9wdGlvbnMucGVyY2VudGFnZUlubmVyQ3V0b3V0XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSwgdGhpcyk7XG5cdFx0fSxcblx0XHRkcmF3IDogZnVuY3Rpb24oZWFzZURlY2ltYWwpe1xuXHRcdFx0dmFyIGFuaW1EZWNpbWFsID0gKGVhc2VEZWNpbWFsKSA/IGVhc2VEZWNpbWFsIDogMTtcblx0XHRcdHRoaXMuY2xlYXIoKTtcblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLnNlZ21lbnRzLGZ1bmN0aW9uKHNlZ21lbnQsaW5kZXgpe1xuXHRcdFx0XHRzZWdtZW50LnRyYW5zaXRpb24oe1xuXHRcdFx0XHRcdGNpcmN1bWZlcmVuY2UgOiB0aGlzLmNhbGN1bGF0ZUNpcmN1bWZlcmVuY2Uoc2VnbWVudC52YWx1ZSksXG5cdFx0XHRcdFx0b3V0ZXJSYWRpdXMgOiB0aGlzLm91dGVyUmFkaXVzLFxuXHRcdFx0XHRcdGlubmVyUmFkaXVzIDogKHRoaXMub3V0ZXJSYWRpdXMvMTAwKSAqIHRoaXMub3B0aW9ucy5wZXJjZW50YWdlSW5uZXJDdXRvdXRcblx0XHRcdFx0fSxhbmltRGVjaW1hbCk7XG5cblx0XHRcdFx0c2VnbWVudC5lbmRBbmdsZSA9IHNlZ21lbnQuc3RhcnRBbmdsZSArIHNlZ21lbnQuY2lyY3VtZmVyZW5jZTtcblxuXHRcdFx0XHRzZWdtZW50LmRyYXcoKTtcblx0XHRcdFx0aWYgKGluZGV4ID09PSAwKXtcblx0XHRcdFx0XHRzZWdtZW50LnN0YXJ0QW5nbGUgPSBNYXRoLlBJICogMS41O1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vQ2hlY2sgdG8gc2VlIGlmIGl0J3MgdGhlIGxhc3Qgc2VnbWVudCwgaWYgbm90IGdldCB0aGUgbmV4dCBhbmQgdXBkYXRlIHRoZSBzdGFydCBhbmdsZVxuXHRcdFx0XHRpZiAoaW5kZXggPCB0aGlzLnNlZ21lbnRzLmxlbmd0aC0xKXtcblx0XHRcdFx0XHR0aGlzLnNlZ21lbnRzW2luZGV4KzFdLnN0YXJ0QW5nbGUgPSBzZWdtZW50LmVuZEFuZ2xlO1xuXHRcdFx0XHR9XG5cdFx0XHR9LHRoaXMpO1xuXG5cdFx0fVxuXHR9KTtcblxuXHRDaGFydC50eXBlcy5Eb3VnaG51dC5leHRlbmQoe1xuXHRcdG5hbWUgOiBcIlBpZVwiLFxuXHRcdGRlZmF1bHRzIDogaGVscGVycy5tZXJnZShkZWZhdWx0Q29uZmlnLHtwZXJjZW50YWdlSW5uZXJDdXRvdXQgOiAwfSlcblx0fSk7XG5cbn0pLmNhbGwodGhpcyk7XG4oZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIHJvb3QgPSB0aGlzLFxuXHRcdENoYXJ0ID0gcm9vdC5DaGFydCxcblx0XHRoZWxwZXJzID0gQ2hhcnQuaGVscGVycztcblxuXHR2YXIgZGVmYXVsdENvbmZpZyA9IHtcblxuXHRcdC8vL0Jvb2xlYW4gLSBXaGV0aGVyIGdyaWQgbGluZXMgYXJlIHNob3duIGFjcm9zcyB0aGUgY2hhcnRcblx0XHRzY2FsZVNob3dHcmlkTGluZXMgOiB0cnVlLFxuXG5cdFx0Ly9TdHJpbmcgLSBDb2xvdXIgb2YgdGhlIGdyaWQgbGluZXNcblx0XHRzY2FsZUdyaWRMaW5lQ29sb3IgOiBcInJnYmEoMCwwLDAsLjA1KVwiLFxuXG5cdFx0Ly9OdW1iZXIgLSBXaWR0aCBvZiB0aGUgZ3JpZCBsaW5lc1xuXHRcdHNjYWxlR3JpZExpbmVXaWR0aCA6IDEsXG5cblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIHNob3cgaG9yaXpvbnRhbCBsaW5lcyAoZXhjZXB0IFggYXhpcylcblx0XHRzY2FsZVNob3dIb3Jpem9udGFsTGluZXM6IHRydWUsXG5cblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIHNob3cgdmVydGljYWwgbGluZXMgKGV4Y2VwdCBZIGF4aXMpXG5cdFx0c2NhbGVTaG93VmVydGljYWxMaW5lczogdHJ1ZSxcblxuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdGhlIGxpbmUgaXMgY3VydmVkIGJldHdlZW4gcG9pbnRzXG5cdFx0YmV6aWVyQ3VydmUgOiB0cnVlLFxuXG5cdFx0Ly9OdW1iZXIgLSBUZW5zaW9uIG9mIHRoZSBiZXppZXIgY3VydmUgYmV0d2VlbiBwb2ludHNcblx0XHRiZXppZXJDdXJ2ZVRlbnNpb24gOiAwLjQsXG5cblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIHNob3cgYSBkb3QgZm9yIGVhY2ggcG9pbnRcblx0XHRwb2ludERvdCA6IHRydWUsXG5cblx0XHQvL051bWJlciAtIFJhZGl1cyBvZiBlYWNoIHBvaW50IGRvdCBpbiBwaXhlbHNcblx0XHRwb2ludERvdFJhZGl1cyA6IDQsXG5cblx0XHQvL051bWJlciAtIFBpeGVsIHdpZHRoIG9mIHBvaW50IGRvdCBzdHJva2Vcblx0XHRwb2ludERvdFN0cm9rZVdpZHRoIDogMSxcblxuXHRcdC8vTnVtYmVyIC0gYW1vdW50IGV4dHJhIHRvIGFkZCB0byB0aGUgcmFkaXVzIHRvIGNhdGVyIGZvciBoaXQgZGV0ZWN0aW9uIG91dHNpZGUgdGhlIGRyYXduIHBvaW50XG5cdFx0cG9pbnRIaXREZXRlY3Rpb25SYWRpdXMgOiAyMCxcblxuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdG8gc2hvdyBhIHN0cm9rZSBmb3IgZGF0YXNldHNcblx0XHRkYXRhc2V0U3Ryb2tlIDogdHJ1ZSxcblxuXHRcdC8vTnVtYmVyIC0gUGl4ZWwgd2lkdGggb2YgZGF0YXNldCBzdHJva2Vcblx0XHRkYXRhc2V0U3Ryb2tlV2lkdGggOiAyLFxuXG5cdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB0byBmaWxsIHRoZSBkYXRhc2V0IHdpdGggYSBjb2xvdXJcblx0XHRkYXRhc2V0RmlsbCA6IHRydWUsXG5cblx0XHQvL1N0cmluZyAtIEEgbGVnZW5kIHRlbXBsYXRlXG5cdFx0bGVnZW5kVGVtcGxhdGUgOiBcIjx1bCBjbGFzcz1cXFwiPCU9bmFtZS50b0xvd2VyQ2FzZSgpJT4tbGVnZW5kXFxcIj48JSBmb3IgKHZhciBpPTA7IGk8ZGF0YXNldHMubGVuZ3RoOyBpKyspeyU+PGxpPjxzcGFuIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWNvbG9yOjwlPWRhdGFzZXRzW2ldLnN0cm9rZUNvbG9yJT5cXFwiPjwvc3Bhbj48JWlmKGRhdGFzZXRzW2ldLmxhYmVsKXslPjwlPWRhdGFzZXRzW2ldLmxhYmVsJT48JX0lPjwvbGk+PCV9JT48L3VsPlwiXG5cblx0fTtcblxuXG5cdENoYXJ0LlR5cGUuZXh0ZW5kKHtcblx0XHRuYW1lOiBcIkxpbmVcIixcblx0XHRkZWZhdWx0cyA6IGRlZmF1bHRDb25maWcsXG5cdFx0aW5pdGlhbGl6ZTogIGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0Ly9EZWNsYXJlIHRoZSBleHRlbnNpb24gb2YgdGhlIGRlZmF1bHQgcG9pbnQsIHRvIGNhdGVyIGZvciB0aGUgb3B0aW9ucyBwYXNzZWQgaW4gdG8gdGhlIGNvbnN0cnVjdG9yXG5cdFx0XHR0aGlzLlBvaW50Q2xhc3MgPSBDaGFydC5Qb2ludC5leHRlbmQoe1xuXHRcdFx0XHRzdHJva2VXaWR0aCA6IHRoaXMub3B0aW9ucy5wb2ludERvdFN0cm9rZVdpZHRoLFxuXHRcdFx0XHRyYWRpdXMgOiB0aGlzLm9wdGlvbnMucG9pbnREb3RSYWRpdXMsXG5cdFx0XHRcdGRpc3BsYXk6IHRoaXMub3B0aW9ucy5wb2ludERvdCxcblx0XHRcdFx0aGl0RGV0ZWN0aW9uUmFkaXVzIDogdGhpcy5vcHRpb25zLnBvaW50SGl0RGV0ZWN0aW9uUmFkaXVzLFxuXHRcdFx0XHRjdHggOiB0aGlzLmNoYXJ0LmN0eCxcblx0XHRcdFx0aW5SYW5nZSA6IGZ1bmN0aW9uKG1vdXNlWCl7XG5cdFx0XHRcdFx0cmV0dXJuIChNYXRoLnBvdyhtb3VzZVgtdGhpcy54LCAyKSA8IE1hdGgucG93KHRoaXMucmFkaXVzICsgdGhpcy5oaXREZXRlY3Rpb25SYWRpdXMsMikpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5kYXRhc2V0cyA9IFtdO1xuXG5cdFx0XHQvL1NldCB1cCB0b29sdGlwIGV2ZW50cyBvbiB0aGUgY2hhcnRcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuc2hvd1Rvb2x0aXBzKXtcblx0XHRcdFx0aGVscGVycy5iaW5kRXZlbnRzKHRoaXMsIHRoaXMub3B0aW9ucy50b29sdGlwRXZlbnRzLCBmdW5jdGlvbihldnQpe1xuXHRcdFx0XHRcdHZhciBhY3RpdmVQb2ludHMgPSAoZXZ0LnR5cGUgIT09ICdtb3VzZW91dCcpID8gdGhpcy5nZXRQb2ludHNBdEV2ZW50KGV2dCkgOiBbXTtcblx0XHRcdFx0XHR0aGlzLmVhY2hQb2ludHMoZnVuY3Rpb24ocG9pbnQpe1xuXHRcdFx0XHRcdFx0cG9pbnQucmVzdG9yZShbJ2ZpbGxDb2xvcicsICdzdHJva2VDb2xvciddKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRoZWxwZXJzLmVhY2goYWN0aXZlUG9pbnRzLCBmdW5jdGlvbihhY3RpdmVQb2ludCl7XG5cdFx0XHRcdFx0XHRhY3RpdmVQb2ludC5maWxsQ29sb3IgPSBhY3RpdmVQb2ludC5oaWdobGlnaHRGaWxsO1xuXHRcdFx0XHRcdFx0YWN0aXZlUG9pbnQuc3Ryb2tlQ29sb3IgPSBhY3RpdmVQb2ludC5oaWdobGlnaHRTdHJva2U7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dGhpcy5zaG93VG9vbHRpcChhY3RpdmVQb2ludHMpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0Ly9JdGVyYXRlIHRocm91Z2ggZWFjaCBvZiB0aGUgZGF0YXNldHMsIGFuZCBidWlsZCB0aGlzIGludG8gYSBwcm9wZXJ0eSBvZiB0aGUgY2hhcnRcblx0XHRcdGhlbHBlcnMuZWFjaChkYXRhLmRhdGFzZXRzLGZ1bmN0aW9uKGRhdGFzZXQpe1xuXG5cdFx0XHRcdHZhciBkYXRhc2V0T2JqZWN0ID0ge1xuXHRcdFx0XHRcdGxhYmVsIDogZGF0YXNldC5sYWJlbCB8fCBudWxsLFxuXHRcdFx0XHRcdGZpbGxDb2xvciA6IGRhdGFzZXQuZmlsbENvbG9yLFxuXHRcdFx0XHRcdHN0cm9rZUNvbG9yIDogZGF0YXNldC5zdHJva2VDb2xvcixcblx0XHRcdFx0XHRwb2ludENvbG9yIDogZGF0YXNldC5wb2ludENvbG9yLFxuXHRcdFx0XHRcdHBvaW50U3Ryb2tlQ29sb3IgOiBkYXRhc2V0LnBvaW50U3Ryb2tlQ29sb3IsXG5cdFx0XHRcdFx0cG9pbnRzIDogW11cblx0XHRcdFx0fTtcblxuXHRcdFx0XHR0aGlzLmRhdGFzZXRzLnB1c2goZGF0YXNldE9iamVjdCk7XG5cblxuXHRcdFx0XHRoZWxwZXJzLmVhY2goZGF0YXNldC5kYXRhLGZ1bmN0aW9uKGRhdGFQb2ludCxpbmRleCl7XG5cdFx0XHRcdFx0Ly9BZGQgYSBuZXcgcG9pbnQgZm9yIGVhY2ggcGllY2Ugb2YgZGF0YSwgcGFzc2luZyBhbnkgcmVxdWlyZWQgZGF0YSB0byBkcmF3LlxuXHRcdFx0XHRcdGRhdGFzZXRPYmplY3QucG9pbnRzLnB1c2gobmV3IHRoaXMuUG9pbnRDbGFzcyh7XG5cdFx0XHRcdFx0XHR2YWx1ZSA6IGRhdGFQb2ludCxcblx0XHRcdFx0XHRcdGxhYmVsIDogZGF0YS5sYWJlbHNbaW5kZXhdLFxuXHRcdFx0XHRcdFx0ZGF0YXNldExhYmVsOiBkYXRhc2V0LmxhYmVsLFxuXHRcdFx0XHRcdFx0c3Ryb2tlQ29sb3IgOiBkYXRhc2V0LnBvaW50U3Ryb2tlQ29sb3IsXG5cdFx0XHRcdFx0XHRmaWxsQ29sb3IgOiBkYXRhc2V0LnBvaW50Q29sb3IsXG5cdFx0XHRcdFx0XHRoaWdobGlnaHRGaWxsIDogZGF0YXNldC5wb2ludEhpZ2hsaWdodEZpbGwgfHwgZGF0YXNldC5wb2ludENvbG9yLFxuXHRcdFx0XHRcdFx0aGlnaGxpZ2h0U3Ryb2tlIDogZGF0YXNldC5wb2ludEhpZ2hsaWdodFN0cm9rZSB8fCBkYXRhc2V0LnBvaW50U3Ryb2tlQ29sb3Jcblx0XHRcdFx0XHR9KSk7XG5cdFx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdFx0dGhpcy5idWlsZFNjYWxlKGRhdGEubGFiZWxzKTtcblxuXG5cdFx0XHRcdHRoaXMuZWFjaFBvaW50cyhmdW5jdGlvbihwb2ludCwgaW5kZXgpe1xuXHRcdFx0XHRcdGhlbHBlcnMuZXh0ZW5kKHBvaW50LCB7XG5cdFx0XHRcdFx0XHR4OiB0aGlzLnNjYWxlLmNhbGN1bGF0ZVgoaW5kZXgpLFxuXHRcdFx0XHRcdFx0eTogdGhpcy5zY2FsZS5lbmRQb2ludFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHBvaW50LnNhdmUoKTtcblx0XHRcdFx0fSwgdGhpcyk7XG5cblx0XHRcdH0sdGhpcyk7XG5cblxuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9LFxuXHRcdHVwZGF0ZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLnNjYWxlLnVwZGF0ZSgpO1xuXHRcdFx0Ly8gUmVzZXQgYW55IGhpZ2hsaWdodCBjb2xvdXJzIGJlZm9yZSB1cGRhdGluZy5cblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmFjdGl2ZUVsZW1lbnRzLCBmdW5jdGlvbihhY3RpdmVFbGVtZW50KXtcblx0XHRcdFx0YWN0aXZlRWxlbWVudC5yZXN0b3JlKFsnZmlsbENvbG9yJywgJ3N0cm9rZUNvbG9yJ10pO1xuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLmVhY2hQb2ludHMoZnVuY3Rpb24ocG9pbnQpe1xuXHRcdFx0XHRwb2ludC5zYXZlKCk7XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMucmVuZGVyKCk7XG5cdFx0fSxcblx0XHRlYWNoUG9pbnRzIDogZnVuY3Rpb24oY2FsbGJhY2spe1xuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCl7XG5cdFx0XHRcdGhlbHBlcnMuZWFjaChkYXRhc2V0LnBvaW50cyxjYWxsYmFjayx0aGlzKTtcblx0XHRcdH0sdGhpcyk7XG5cdFx0fSxcblx0XHRnZXRQb2ludHNBdEV2ZW50IDogZnVuY3Rpb24oZSl7XG5cdFx0XHR2YXIgcG9pbnRzQXJyYXkgPSBbXSxcblx0XHRcdFx0ZXZlbnRQb3NpdGlvbiA9IGhlbHBlcnMuZ2V0UmVsYXRpdmVQb3NpdGlvbihlKTtcblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmRhdGFzZXRzLGZ1bmN0aW9uKGRhdGFzZXQpe1xuXHRcdFx0XHRoZWxwZXJzLmVhY2goZGF0YXNldC5wb2ludHMsZnVuY3Rpb24ocG9pbnQpe1xuXHRcdFx0XHRcdGlmIChwb2ludC5pblJhbmdlKGV2ZW50UG9zaXRpb24ueCxldmVudFBvc2l0aW9uLnkpKSBwb2ludHNBcnJheS5wdXNoKHBvaW50KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdFx0cmV0dXJuIHBvaW50c0FycmF5O1xuXHRcdH0sXG5cdFx0YnVpbGRTY2FsZSA6IGZ1bmN0aW9uKGxhYmVscyl7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRcdHZhciBkYXRhVG90YWwgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgdmFsdWVzID0gW107XG5cdFx0XHRcdHNlbGYuZWFjaFBvaW50cyhmdW5jdGlvbihwb2ludCl7XG5cdFx0XHRcdFx0dmFsdWVzLnB1c2gocG9pbnQudmFsdWUpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRyZXR1cm4gdmFsdWVzO1xuXHRcdFx0fTtcblxuXHRcdFx0dmFyIHNjYWxlT3B0aW9ucyA9IHtcblx0XHRcdFx0dGVtcGxhdGVTdHJpbmcgOiB0aGlzLm9wdGlvbnMuc2NhbGVMYWJlbCxcblx0XHRcdFx0aGVpZ2h0IDogdGhpcy5jaGFydC5oZWlnaHQsXG5cdFx0XHRcdHdpZHRoIDogdGhpcy5jaGFydC53aWR0aCxcblx0XHRcdFx0Y3R4IDogdGhpcy5jaGFydC5jdHgsXG5cdFx0XHRcdHRleHRDb2xvciA6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRDb2xvcixcblx0XHRcdFx0Zm9udFNpemUgOiB0aGlzLm9wdGlvbnMuc2NhbGVGb250U2l6ZSxcblx0XHRcdFx0Zm9udFN0eWxlIDogdGhpcy5vcHRpb25zLnNjYWxlRm9udFN0eWxlLFxuXHRcdFx0XHRmb250RmFtaWx5IDogdGhpcy5vcHRpb25zLnNjYWxlRm9udEZhbWlseSxcblx0XHRcdFx0dmFsdWVzQ291bnQgOiBsYWJlbHMubGVuZ3RoLFxuXHRcdFx0XHRiZWdpbkF0WmVybyA6IHRoaXMub3B0aW9ucy5zY2FsZUJlZ2luQXRaZXJvLFxuXHRcdFx0XHRpbnRlZ2Vyc09ubHkgOiB0aGlzLm9wdGlvbnMuc2NhbGVJbnRlZ2Vyc09ubHksXG5cdFx0XHRcdGNhbGN1bGF0ZVlSYW5nZSA6IGZ1bmN0aW9uKGN1cnJlbnRIZWlnaHQpe1xuXHRcdFx0XHRcdHZhciB1cGRhdGVkUmFuZ2VzID0gaGVscGVycy5jYWxjdWxhdGVTY2FsZVJhbmdlKFxuXHRcdFx0XHRcdFx0ZGF0YVRvdGFsKCksXG5cdFx0XHRcdFx0XHRjdXJyZW50SGVpZ2h0LFxuXHRcdFx0XHRcdFx0dGhpcy5mb250U2l6ZSxcblx0XHRcdFx0XHRcdHRoaXMuYmVnaW5BdFplcm8sXG5cdFx0XHRcdFx0XHR0aGlzLmludGVnZXJzT25seVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0aGVscGVycy5leHRlbmQodGhpcywgdXBkYXRlZFJhbmdlcyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHhMYWJlbHMgOiBsYWJlbHMsXG5cdFx0XHRcdGZvbnQgOiBoZWxwZXJzLmZvbnRTdHJpbmcodGhpcy5vcHRpb25zLnNjYWxlRm9udFNpemUsIHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTdHlsZSwgdGhpcy5vcHRpb25zLnNjYWxlRm9udEZhbWlseSksXG5cdFx0XHRcdGxpbmVXaWR0aCA6IHRoaXMub3B0aW9ucy5zY2FsZUxpbmVXaWR0aCxcblx0XHRcdFx0bGluZUNvbG9yIDogdGhpcy5vcHRpb25zLnNjYWxlTGluZUNvbG9yLFxuXHRcdFx0XHRzaG93SG9yaXpvbnRhbExpbmVzIDogdGhpcy5vcHRpb25zLnNjYWxlU2hvd0hvcml6b250YWxMaW5lcyxcblx0XHRcdFx0c2hvd1ZlcnRpY2FsTGluZXMgOiB0aGlzLm9wdGlvbnMuc2NhbGVTaG93VmVydGljYWxMaW5lcyxcblx0XHRcdFx0Z3JpZExpbmVXaWR0aCA6ICh0aGlzLm9wdGlvbnMuc2NhbGVTaG93R3JpZExpbmVzKSA/IHRoaXMub3B0aW9ucy5zY2FsZUdyaWRMaW5lV2lkdGggOiAwLFxuXHRcdFx0XHRncmlkTGluZUNvbG9yIDogKHRoaXMub3B0aW9ucy5zY2FsZVNob3dHcmlkTGluZXMpID8gdGhpcy5vcHRpb25zLnNjYWxlR3JpZExpbmVDb2xvciA6IFwicmdiYSgwLDAsMCwwKVwiLFxuXHRcdFx0XHRwYWRkaW5nOiAodGhpcy5vcHRpb25zLnNob3dTY2FsZSkgPyAwIDogdGhpcy5vcHRpb25zLnBvaW50RG90UmFkaXVzICsgdGhpcy5vcHRpb25zLnBvaW50RG90U3Ryb2tlV2lkdGgsXG5cdFx0XHRcdHNob3dMYWJlbHMgOiB0aGlzLm9wdGlvbnMuc2NhbGVTaG93TGFiZWxzLFxuXHRcdFx0XHRkaXNwbGF5IDogdGhpcy5vcHRpb25zLnNob3dTY2FsZVxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5zY2FsZU92ZXJyaWRlKXtcblx0XHRcdFx0aGVscGVycy5leHRlbmQoc2NhbGVPcHRpb25zLCB7XG5cdFx0XHRcdFx0Y2FsY3VsYXRlWVJhbmdlOiBoZWxwZXJzLm5vb3AsXG5cdFx0XHRcdFx0c3RlcHM6IHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBzLFxuXHRcdFx0XHRcdHN0ZXBWYWx1ZTogdGhpcy5vcHRpb25zLnNjYWxlU3RlcFdpZHRoLFxuXHRcdFx0XHRcdG1pbjogdGhpcy5vcHRpb25zLnNjYWxlU3RhcnRWYWx1ZSxcblx0XHRcdFx0XHRtYXg6IHRoaXMub3B0aW9ucy5zY2FsZVN0YXJ0VmFsdWUgKyAodGhpcy5vcHRpb25zLnNjYWxlU3RlcHMgKiB0aGlzLm9wdGlvbnMuc2NhbGVTdGVwV2lkdGgpXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cblx0XHRcdHRoaXMuc2NhbGUgPSBuZXcgQ2hhcnQuU2NhbGUoc2NhbGVPcHRpb25zKTtcblx0XHR9LFxuXHRcdGFkZERhdGEgOiBmdW5jdGlvbih2YWx1ZXNBcnJheSxsYWJlbCl7XG5cdFx0XHQvL01hcCB0aGUgdmFsdWVzIGFycmF5IGZvciBlYWNoIG9mIHRoZSBkYXRhc2V0c1xuXG5cdFx0XHRoZWxwZXJzLmVhY2godmFsdWVzQXJyYXksZnVuY3Rpb24odmFsdWUsZGF0YXNldEluZGV4KXtcblx0XHRcdFx0Ly9BZGQgYSBuZXcgcG9pbnQgZm9yIGVhY2ggcGllY2Ugb2YgZGF0YSwgcGFzc2luZyBhbnkgcmVxdWlyZWQgZGF0YSB0byBkcmF3LlxuXHRcdFx0XHR0aGlzLmRhdGFzZXRzW2RhdGFzZXRJbmRleF0ucG9pbnRzLnB1c2gobmV3IHRoaXMuUG9pbnRDbGFzcyh7XG5cdFx0XHRcdFx0dmFsdWUgOiB2YWx1ZSxcblx0XHRcdFx0XHRsYWJlbCA6IGxhYmVsLFxuXHRcdFx0XHRcdHg6IHRoaXMuc2NhbGUuY2FsY3VsYXRlWCh0aGlzLnNjYWxlLnZhbHVlc0NvdW50KzEpLFxuXHRcdFx0XHRcdHk6IHRoaXMuc2NhbGUuZW5kUG9pbnQsXG5cdFx0XHRcdFx0c3Ryb2tlQ29sb3IgOiB0aGlzLmRhdGFzZXRzW2RhdGFzZXRJbmRleF0ucG9pbnRTdHJva2VDb2xvcixcblx0XHRcdFx0XHRmaWxsQ29sb3IgOiB0aGlzLmRhdGFzZXRzW2RhdGFzZXRJbmRleF0ucG9pbnRDb2xvclxuXHRcdFx0XHR9KSk7XG5cdFx0XHR9LHRoaXMpO1xuXG5cdFx0XHR0aGlzLnNjYWxlLmFkZFhMYWJlbChsYWJlbCk7XG5cdFx0XHQvL1RoZW4gcmUtcmVuZGVyIHRoZSBjaGFydC5cblx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0fSxcblx0XHRyZW1vdmVEYXRhIDogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuc2NhbGUucmVtb3ZlWExhYmVsKCk7XG5cdFx0XHQvL1RoZW4gcmUtcmVuZGVyIHRoZSBjaGFydC5cblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmRhdGFzZXRzLGZ1bmN0aW9uKGRhdGFzZXQpe1xuXHRcdFx0XHRkYXRhc2V0LnBvaW50cy5zaGlmdCgpO1xuXHRcdFx0fSx0aGlzKTtcblx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0fSxcblx0XHRyZWZsb3cgOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIG5ld1NjYWxlUHJvcHMgPSBoZWxwZXJzLmV4dGVuZCh7XG5cdFx0XHRcdGhlaWdodCA6IHRoaXMuY2hhcnQuaGVpZ2h0LFxuXHRcdFx0XHR3aWR0aCA6IHRoaXMuY2hhcnQud2lkdGhcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5zY2FsZS51cGRhdGUobmV3U2NhbGVQcm9wcyk7XG5cdFx0fSxcblx0XHRkcmF3IDogZnVuY3Rpb24oZWFzZSl7XG5cdFx0XHR2YXIgZWFzaW5nRGVjaW1hbCA9IGVhc2UgfHwgMTtcblx0XHRcdHRoaXMuY2xlYXIoKTtcblxuXHRcdFx0dmFyIGN0eCA9IHRoaXMuY2hhcnQuY3R4O1xuXG5cdFx0XHQvLyBTb21lIGhlbHBlciBtZXRob2RzIGZvciBnZXR0aW5nIHRoZSBuZXh0L3ByZXYgcG9pbnRzXG5cdFx0XHR2YXIgaGFzVmFsdWUgPSBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0cmV0dXJuIGl0ZW0udmFsdWUgIT09IG51bGw7XG5cdFx0XHR9LFxuXHRcdFx0bmV4dFBvaW50ID0gZnVuY3Rpb24ocG9pbnQsIGNvbGxlY3Rpb24sIGluZGV4KXtcblx0XHRcdFx0cmV0dXJuIGhlbHBlcnMuZmluZE5leHRXaGVyZShjb2xsZWN0aW9uLCBoYXNWYWx1ZSwgaW5kZXgpIHx8IHBvaW50O1xuXHRcdFx0fSxcblx0XHRcdHByZXZpb3VzUG9pbnQgPSBmdW5jdGlvbihwb2ludCwgY29sbGVjdGlvbiwgaW5kZXgpe1xuXHRcdFx0XHRyZXR1cm4gaGVscGVycy5maW5kUHJldmlvdXNXaGVyZShjb2xsZWN0aW9uLCBoYXNWYWx1ZSwgaW5kZXgpIHx8IHBvaW50O1xuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5zY2FsZS5kcmF3KGVhc2luZ0RlY2ltYWwpO1xuXG5cblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmRhdGFzZXRzLGZ1bmN0aW9uKGRhdGFzZXQpe1xuXHRcdFx0XHR2YXIgcG9pbnRzV2l0aFZhbHVlcyA9IGhlbHBlcnMud2hlcmUoZGF0YXNldC5wb2ludHMsIGhhc1ZhbHVlKTtcblxuXHRcdFx0XHQvL1RyYW5zaXRpb24gZWFjaCBwb2ludCBmaXJzdCBzbyB0aGF0IHRoZSBsaW5lIGFuZCBwb2ludCBkcmF3aW5nIGlzbid0IG91dCBvZiBzeW5jXG5cdFx0XHRcdC8vV2UgY2FuIHVzZSB0aGlzIGV4dHJhIGxvb3AgdG8gY2FsY3VsYXRlIHRoZSBjb250cm9sIHBvaW50cyBvZiB0aGlzIGRhdGFzZXQgYWxzbyBpbiB0aGlzIGxvb3BcblxuXHRcdFx0XHRoZWxwZXJzLmVhY2goZGF0YXNldC5wb2ludHMsIGZ1bmN0aW9uKHBvaW50LCBpbmRleCl7XG5cdFx0XHRcdFx0aWYgKHBvaW50Lmhhc1ZhbHVlKCkpe1xuXHRcdFx0XHRcdFx0cG9pbnQudHJhbnNpdGlvbih7XG5cdFx0XHRcdFx0XHRcdHkgOiB0aGlzLnNjYWxlLmNhbGN1bGF0ZVkocG9pbnQudmFsdWUpLFxuXHRcdFx0XHRcdFx0XHR4IDogdGhpcy5zY2FsZS5jYWxjdWxhdGVYKGluZGV4KVxuXHRcdFx0XHRcdFx0fSwgZWFzaW5nRGVjaW1hbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LHRoaXMpO1xuXG5cblx0XHRcdFx0Ly8gQ29udHJvbCBwb2ludHMgbmVlZCB0byBiZSBjYWxjdWxhdGVkIGluIGEgc2VwZXJhdGUgbG9vcCwgYmVjYXVzZSB3ZSBuZWVkIHRvIGtub3cgdGhlIGN1cnJlbnQgeC95IG9mIHRoZSBwb2ludFxuXHRcdFx0XHQvLyBUaGlzIHdvdWxkIGNhdXNlIGlzc3VlcyB3aGVuIHRoZXJlIGlzIG5vIGFuaW1hdGlvbiwgYmVjYXVzZSB0aGUgeSBvZiB0aGUgbmV4dCBwb2ludCB3b3VsZCBiZSAwLCBzbyBiZXppZXJzIHdvdWxkIGJlIHNrZXdlZFxuXHRcdFx0XHRpZiAodGhpcy5vcHRpb25zLmJlemllckN1cnZlKXtcblx0XHRcdFx0XHRoZWxwZXJzLmVhY2gocG9pbnRzV2l0aFZhbHVlcywgZnVuY3Rpb24ocG9pbnQsIGluZGV4KXtcblx0XHRcdFx0XHRcdHZhciB0ZW5zaW9uID0gKGluZGV4ID4gMCAmJiBpbmRleCA8IHBvaW50c1dpdGhWYWx1ZXMubGVuZ3RoIC0gMSkgPyB0aGlzLm9wdGlvbnMuYmV6aWVyQ3VydmVUZW5zaW9uIDogMDtcblx0XHRcdFx0XHRcdHBvaW50LmNvbnRyb2xQb2ludHMgPSBoZWxwZXJzLnNwbGluZUN1cnZlKFxuXHRcdFx0XHRcdFx0XHRwcmV2aW91c1BvaW50KHBvaW50LCBwb2ludHNXaXRoVmFsdWVzLCBpbmRleCksXG5cdFx0XHRcdFx0XHRcdHBvaW50LFxuXHRcdFx0XHRcdFx0XHRuZXh0UG9pbnQocG9pbnQsIHBvaW50c1dpdGhWYWx1ZXMsIGluZGV4KSxcblx0XHRcdFx0XHRcdFx0dGVuc2lvblxuXHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdFx0Ly8gUHJldmVudCB0aGUgYmV6aWVyIGdvaW5nIG91dHNpZGUgb2YgdGhlIGJvdW5kcyBvZiB0aGUgZ3JhcGhcblxuXHRcdFx0XHRcdFx0Ly8gQ2FwIHB1dGVyIGJlemllciBoYW5kbGVzIHRvIHRoZSB1cHBlci9sb3dlciBzY2FsZSBib3VuZHNcblx0XHRcdFx0XHRcdGlmIChwb2ludC5jb250cm9sUG9pbnRzLm91dGVyLnkgPiB0aGlzLnNjYWxlLmVuZFBvaW50KXtcblx0XHRcdFx0XHRcdFx0cG9pbnQuY29udHJvbFBvaW50cy5vdXRlci55ID0gdGhpcy5zY2FsZS5lbmRQb2ludDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKHBvaW50LmNvbnRyb2xQb2ludHMub3V0ZXIueSA8IHRoaXMuc2NhbGUuc3RhcnRQb2ludCl7XG5cdFx0XHRcdFx0XHRcdHBvaW50LmNvbnRyb2xQb2ludHMub3V0ZXIueSA9IHRoaXMuc2NhbGUuc3RhcnRQb2ludDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gQ2FwIGlubmVyIGJlemllciBoYW5kbGVzIHRvIHRoZSB1cHBlci9sb3dlciBzY2FsZSBib3VuZHNcblx0XHRcdFx0XHRcdGlmIChwb2ludC5jb250cm9sUG9pbnRzLmlubmVyLnkgPiB0aGlzLnNjYWxlLmVuZFBvaW50KXtcblx0XHRcdFx0XHRcdFx0cG9pbnQuY29udHJvbFBvaW50cy5pbm5lci55ID0gdGhpcy5zY2FsZS5lbmRQb2ludDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKHBvaW50LmNvbnRyb2xQb2ludHMuaW5uZXIueSA8IHRoaXMuc2NhbGUuc3RhcnRQb2ludCl7XG5cdFx0XHRcdFx0XHRcdHBvaW50LmNvbnRyb2xQb2ludHMuaW5uZXIueSA9IHRoaXMuc2NhbGUuc3RhcnRQb2ludDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LHRoaXMpO1xuXHRcdFx0XHR9XG5cblxuXHRcdFx0XHQvL0RyYXcgdGhlIGxpbmUgYmV0d2VlbiBhbGwgdGhlIHBvaW50c1xuXHRcdFx0XHRjdHgubGluZVdpZHRoID0gdGhpcy5vcHRpb25zLmRhdGFzZXRTdHJva2VXaWR0aDtcblx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gZGF0YXNldC5zdHJva2VDb2xvcjtcblx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZWFjaChwb2ludHNXaXRoVmFsdWVzLCBmdW5jdGlvbihwb2ludCwgaW5kZXgpe1xuXHRcdFx0XHRcdGlmIChpbmRleCA9PT0gMCl7XG5cdFx0XHRcdFx0XHRjdHgubW92ZVRvKHBvaW50LngsIHBvaW50LnkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0aWYodGhpcy5vcHRpb25zLmJlemllckN1cnZlKXtcblx0XHRcdFx0XHRcdFx0dmFyIHByZXZpb3VzID0gcHJldmlvdXNQb2ludChwb2ludCwgcG9pbnRzV2l0aFZhbHVlcywgaW5kZXgpO1xuXG5cdFx0XHRcdFx0XHRcdGN0eC5iZXppZXJDdXJ2ZVRvKFxuXHRcdFx0XHRcdFx0XHRcdHByZXZpb3VzLmNvbnRyb2xQb2ludHMub3V0ZXIueCxcblx0XHRcdFx0XHRcdFx0XHRwcmV2aW91cy5jb250cm9sUG9pbnRzLm91dGVyLnksXG5cdFx0XHRcdFx0XHRcdFx0cG9pbnQuY29udHJvbFBvaW50cy5pbm5lci54LFxuXHRcdFx0XHRcdFx0XHRcdHBvaW50LmNvbnRyb2xQb2ludHMuaW5uZXIueSxcblx0XHRcdFx0XHRcdFx0XHRwb2ludC54LFxuXHRcdFx0XHRcdFx0XHRcdHBvaW50Lnlcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdGN0eC5saW5lVG8ocG9pbnQueCxwb2ludC55KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIHRoaXMpO1xuXG5cdFx0XHRcdGN0eC5zdHJva2UoKTtcblxuXHRcdFx0XHRpZiAodGhpcy5vcHRpb25zLmRhdGFzZXRGaWxsICYmIHBvaW50c1dpdGhWYWx1ZXMubGVuZ3RoID4gMCl7XG5cdFx0XHRcdFx0Ly9Sb3VuZCBvZmYgdGhlIGxpbmUgYnkgZ29pbmcgdG8gdGhlIGJhc2Ugb2YgdGhlIGNoYXJ0LCBiYWNrIHRvIHRoZSBzdGFydCwgdGhlbiBmaWxsLlxuXHRcdFx0XHRcdGN0eC5saW5lVG8ocG9pbnRzV2l0aFZhbHVlc1twb2ludHNXaXRoVmFsdWVzLmxlbmd0aCAtIDFdLngsIHRoaXMuc2NhbGUuZW5kUG9pbnQpO1xuXHRcdFx0XHRcdGN0eC5saW5lVG8ocG9pbnRzV2l0aFZhbHVlc1swXS54LCB0aGlzLnNjYWxlLmVuZFBvaW50KTtcblx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gZGF0YXNldC5maWxsQ29sb3I7XG5cdFx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdFx0XHRcdGN0eC5maWxsKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL05vdyBkcmF3IHRoZSBwb2ludHMgb3ZlciB0aGUgbGluZVxuXHRcdFx0XHQvL0EgbGl0dGxlIGluZWZmaWNpZW50IGRvdWJsZSBsb29waW5nLCBidXQgYmV0dGVyIHRoYW4gdGhlIGxpbmVcblx0XHRcdFx0Ly9sYWdnaW5nIGJlaGluZCB0aGUgcG9pbnQgcG9zaXRpb25zXG5cdFx0XHRcdGhlbHBlcnMuZWFjaChwb2ludHNXaXRoVmFsdWVzLGZ1bmN0aW9uKHBvaW50KXtcblx0XHRcdFx0XHRwb2ludC5kcmF3KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSx0aGlzKTtcblx0XHR9XG5cdH0pO1xuXG5cbn0pLmNhbGwodGhpcyk7XG5cbihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgcm9vdCA9IHRoaXMsXG5cdFx0Q2hhcnQgPSByb290LkNoYXJ0LFxuXHRcdC8vQ2FjaGUgYSBsb2NhbCByZWZlcmVuY2UgdG8gQ2hhcnQuaGVscGVyc1xuXHRcdGhlbHBlcnMgPSBDaGFydC5oZWxwZXJzO1xuXG5cdHZhciBkZWZhdWx0Q29uZmlnID0ge1xuXHRcdC8vQm9vbGVhbiAtIFNob3cgYSBiYWNrZHJvcCB0byB0aGUgc2NhbGUgbGFiZWxcblx0XHRzY2FsZVNob3dMYWJlbEJhY2tkcm9wIDogdHJ1ZSxcblxuXHRcdC8vU3RyaW5nIC0gVGhlIGNvbG91ciBvZiB0aGUgbGFiZWwgYmFja2Ryb3Bcblx0XHRzY2FsZUJhY2tkcm9wQ29sb3IgOiBcInJnYmEoMjU1LDI1NSwyNTUsMC43NSlcIixcblxuXHRcdC8vIEJvb2xlYW4gLSBXaGV0aGVyIHRoZSBzY2FsZSBzaG91bGQgYmVnaW4gYXQgemVyb1xuXHRcdHNjYWxlQmVnaW5BdFplcm8gOiB0cnVlLFxuXG5cdFx0Ly9OdW1iZXIgLSBUaGUgYmFja2Ryb3AgcGFkZGluZyBhYm92ZSAmIGJlbG93IHRoZSBsYWJlbCBpbiBwaXhlbHNcblx0XHRzY2FsZUJhY2tkcm9wUGFkZGluZ1kgOiAyLFxuXG5cdFx0Ly9OdW1iZXIgLSBUaGUgYmFja2Ryb3AgcGFkZGluZyB0byB0aGUgc2lkZSBvZiB0aGUgbGFiZWwgaW4gcGl4ZWxzXG5cdFx0c2NhbGVCYWNrZHJvcFBhZGRpbmdYIDogMixcblxuXHRcdC8vQm9vbGVhbiAtIFNob3cgbGluZSBmb3IgZWFjaCB2YWx1ZSBpbiB0aGUgc2NhbGVcblx0XHRzY2FsZVNob3dMaW5lIDogdHJ1ZSxcblxuXHRcdC8vQm9vbGVhbiAtIFN0cm9rZSBhIGxpbmUgYXJvdW5kIGVhY2ggc2VnbWVudCBpbiB0aGUgY2hhcnRcblx0XHRzZWdtZW50U2hvd1N0cm9rZSA6IHRydWUsXG5cblx0XHQvL1N0cmluZyAtIFRoZSBjb2xvdXIgb2YgdGhlIHN0cm9rZSBvbiBlYWNoIHNlZ2VtZW50LlxuXHRcdHNlZ21lbnRTdHJva2VDb2xvciA6IFwiI2ZmZlwiLFxuXG5cdFx0Ly9OdW1iZXIgLSBUaGUgd2lkdGggb2YgdGhlIHN0cm9rZSB2YWx1ZSBpbiBwaXhlbHNcblx0XHRzZWdtZW50U3Ryb2tlV2lkdGggOiAyLFxuXG5cdFx0Ly9OdW1iZXIgLSBBbW91bnQgb2YgYW5pbWF0aW9uIHN0ZXBzXG5cdFx0YW5pbWF0aW9uU3RlcHMgOiAxMDAsXG5cblx0XHQvL1N0cmluZyAtIEFuaW1hdGlvbiBlYXNpbmcgZWZmZWN0LlxuXHRcdGFuaW1hdGlvbkVhc2luZyA6IFwiZWFzZU91dEJvdW5jZVwiLFxuXG5cdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB0byBhbmltYXRlIHRoZSByb3RhdGlvbiBvZiB0aGUgY2hhcnRcblx0XHRhbmltYXRlUm90YXRlIDogdHJ1ZSxcblxuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdG8gYW5pbWF0ZSBzY2FsaW5nIHRoZSBjaGFydCBmcm9tIHRoZSBjZW50cmVcblx0XHRhbmltYXRlU2NhbGUgOiBmYWxzZSxcblxuXHRcdC8vU3RyaW5nIC0gQSBsZWdlbmQgdGVtcGxhdGVcblx0XHRsZWdlbmRUZW1wbGF0ZSA6IFwiPHVsIGNsYXNzPVxcXCI8JT1uYW1lLnRvTG93ZXJDYXNlKCklPi1sZWdlbmRcXFwiPjwlIGZvciAodmFyIGk9MDsgaTxzZWdtZW50cy5sZW5ndGg7IGkrKyl7JT48bGk+PHNwYW4gc3R5bGU9XFxcImJhY2tncm91bmQtY29sb3I6PCU9c2VnbWVudHNbaV0uZmlsbENvbG9yJT5cXFwiPjwvc3Bhbj48JWlmKHNlZ21lbnRzW2ldLmxhYmVsKXslPjwlPXNlZ21lbnRzW2ldLmxhYmVsJT48JX0lPjwvbGk+PCV9JT48L3VsPlwiXG5cdH07XG5cblxuXHRDaGFydC5UeXBlLmV4dGVuZCh7XG5cdFx0Ly9QYXNzaW5nIGluIGEgbmFtZSByZWdpc3RlcnMgdGhpcyBjaGFydCBpbiB0aGUgQ2hhcnQgbmFtZXNwYWNlXG5cdFx0bmFtZTogXCJQb2xhckFyZWFcIixcblx0XHQvL1Byb3ZpZGluZyBhIGRlZmF1bHRzIHdpbGwgYWxzbyByZWdpc3RlciB0aGUgZGVhZnVsdHMgaW4gdGhlIGNoYXJ0IG5hbWVzcGFjZVxuXHRcdGRlZmF1bHRzIDogZGVmYXVsdENvbmZpZyxcblx0XHQvL0luaXRpYWxpemUgaXMgZmlyZWQgd2hlbiB0aGUgY2hhcnQgaXMgaW5pdGlhbGl6ZWQgLSBEYXRhIGlzIHBhc3NlZCBpbiBhcyBhIHBhcmFtZXRlclxuXHRcdC8vQ29uZmlnIGlzIGF1dG9tYXRpY2FsbHkgbWVyZ2VkIGJ5IHRoZSBjb3JlIG9mIENoYXJ0LmpzLCBhbmQgaXMgYXZhaWxhYmxlIGF0IHRoaXMub3B0aW9uc1xuXHRcdGluaXRpYWxpemU6ICBmdW5jdGlvbihkYXRhKXtcblx0XHRcdHRoaXMuc2VnbWVudHMgPSBbXTtcblx0XHRcdC8vRGVjbGFyZSBzZWdtZW50IGNsYXNzIGFzIGEgY2hhcnQgaW5zdGFuY2Ugc3BlY2lmaWMgY2xhc3MsIHNvIGl0IGNhbiBzaGFyZSBwcm9wcyBmb3IgdGhpcyBpbnN0YW5jZVxuXHRcdFx0dGhpcy5TZWdtZW50QXJjID0gQ2hhcnQuQXJjLmV4dGVuZCh7XG5cdFx0XHRcdHNob3dTdHJva2UgOiB0aGlzLm9wdGlvbnMuc2VnbWVudFNob3dTdHJva2UsXG5cdFx0XHRcdHN0cm9rZVdpZHRoIDogdGhpcy5vcHRpb25zLnNlZ21lbnRTdHJva2VXaWR0aCxcblx0XHRcdFx0c3Ryb2tlQ29sb3IgOiB0aGlzLm9wdGlvbnMuc2VnbWVudFN0cm9rZUNvbG9yLFxuXHRcdFx0XHRjdHggOiB0aGlzLmNoYXJ0LmN0eCxcblx0XHRcdFx0aW5uZXJSYWRpdXMgOiAwLFxuXHRcdFx0XHR4IDogdGhpcy5jaGFydC53aWR0aC8yLFxuXHRcdFx0XHR5IDogdGhpcy5jaGFydC5oZWlnaHQvMlxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnNjYWxlID0gbmV3IENoYXJ0LlJhZGlhbFNjYWxlKHtcblx0XHRcdFx0ZGlzcGxheTogdGhpcy5vcHRpb25zLnNob3dTY2FsZSxcblx0XHRcdFx0Zm9udFN0eWxlOiB0aGlzLm9wdGlvbnMuc2NhbGVGb250U3R5bGUsXG5cdFx0XHRcdGZvbnRTaXplOiB0aGlzLm9wdGlvbnMuc2NhbGVGb250U2l6ZSxcblx0XHRcdFx0Zm9udEZhbWlseTogdGhpcy5vcHRpb25zLnNjYWxlRm9udEZhbWlseSxcblx0XHRcdFx0Zm9udENvbG9yOiB0aGlzLm9wdGlvbnMuc2NhbGVGb250Q29sb3IsXG5cdFx0XHRcdHNob3dMYWJlbHM6IHRoaXMub3B0aW9ucy5zY2FsZVNob3dMYWJlbHMsXG5cdFx0XHRcdHNob3dMYWJlbEJhY2tkcm9wOiB0aGlzLm9wdGlvbnMuc2NhbGVTaG93TGFiZWxCYWNrZHJvcCxcblx0XHRcdFx0YmFja2Ryb3BDb2xvcjogdGhpcy5vcHRpb25zLnNjYWxlQmFja2Ryb3BDb2xvcixcblx0XHRcdFx0YmFja2Ryb3BQYWRkaW5nWSA6IHRoaXMub3B0aW9ucy5zY2FsZUJhY2tkcm9wUGFkZGluZ1ksXG5cdFx0XHRcdGJhY2tkcm9wUGFkZGluZ1g6IHRoaXMub3B0aW9ucy5zY2FsZUJhY2tkcm9wUGFkZGluZ1gsXG5cdFx0XHRcdGxpbmVXaWR0aDogKHRoaXMub3B0aW9ucy5zY2FsZVNob3dMaW5lKSA/IHRoaXMub3B0aW9ucy5zY2FsZUxpbmVXaWR0aCA6IDAsXG5cdFx0XHRcdGxpbmVDb2xvcjogdGhpcy5vcHRpb25zLnNjYWxlTGluZUNvbG9yLFxuXHRcdFx0XHRsaW5lQXJjOiB0cnVlLFxuXHRcdFx0XHR3aWR0aDogdGhpcy5jaGFydC53aWR0aCxcblx0XHRcdFx0aGVpZ2h0OiB0aGlzLmNoYXJ0LmhlaWdodCxcblx0XHRcdFx0eENlbnRlcjogdGhpcy5jaGFydC53aWR0aC8yLFxuXHRcdFx0XHR5Q2VudGVyOiB0aGlzLmNoYXJ0LmhlaWdodC8yLFxuXHRcdFx0XHRjdHggOiB0aGlzLmNoYXJ0LmN0eCxcblx0XHRcdFx0dGVtcGxhdGVTdHJpbmc6IHRoaXMub3B0aW9ucy5zY2FsZUxhYmVsLFxuXHRcdFx0XHR2YWx1ZXNDb3VudDogZGF0YS5sZW5ndGhcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLnVwZGF0ZVNjYWxlUmFuZ2UoZGF0YSk7XG5cblx0XHRcdHRoaXMuc2NhbGUudXBkYXRlKCk7XG5cblx0XHRcdGhlbHBlcnMuZWFjaChkYXRhLGZ1bmN0aW9uKHNlZ21lbnQsaW5kZXgpe1xuXHRcdFx0XHR0aGlzLmFkZERhdGEoc2VnbWVudCxpbmRleCx0cnVlKTtcblx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdC8vU2V0IHVwIHRvb2x0aXAgZXZlbnRzIG9uIHRoZSBjaGFydFxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5zaG93VG9vbHRpcHMpe1xuXHRcdFx0XHRoZWxwZXJzLmJpbmRFdmVudHModGhpcywgdGhpcy5vcHRpb25zLnRvb2x0aXBFdmVudHMsIGZ1bmN0aW9uKGV2dCl7XG5cdFx0XHRcdFx0dmFyIGFjdGl2ZVNlZ21lbnRzID0gKGV2dC50eXBlICE9PSAnbW91c2VvdXQnKSA/IHRoaXMuZ2V0U2VnbWVudHNBdEV2ZW50KGV2dCkgOiBbXTtcblx0XHRcdFx0XHRoZWxwZXJzLmVhY2godGhpcy5zZWdtZW50cyxmdW5jdGlvbihzZWdtZW50KXtcblx0XHRcdFx0XHRcdHNlZ21lbnQucmVzdG9yZShbXCJmaWxsQ29sb3JcIl0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGhlbHBlcnMuZWFjaChhY3RpdmVTZWdtZW50cyxmdW5jdGlvbihhY3RpdmVTZWdtZW50KXtcblx0XHRcdFx0XHRcdGFjdGl2ZVNlZ21lbnQuZmlsbENvbG9yID0gYWN0aXZlU2VnbWVudC5oaWdobGlnaHRDb2xvcjtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR0aGlzLnNob3dUb29sdGlwKGFjdGl2ZVNlZ21lbnRzKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMucmVuZGVyKCk7XG5cdFx0fSxcblx0XHRnZXRTZWdtZW50c0F0RXZlbnQgOiBmdW5jdGlvbihlKXtcblx0XHRcdHZhciBzZWdtZW50c0FycmF5ID0gW107XG5cblx0XHRcdHZhciBsb2NhdGlvbiA9IGhlbHBlcnMuZ2V0UmVsYXRpdmVQb3NpdGlvbihlKTtcblxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuc2VnbWVudHMsZnVuY3Rpb24oc2VnbWVudCl7XG5cdFx0XHRcdGlmIChzZWdtZW50LmluUmFuZ2UobG9jYXRpb24ueCxsb2NhdGlvbi55KSkgc2VnbWVudHNBcnJheS5wdXNoKHNlZ21lbnQpO1xuXHRcdFx0fSx0aGlzKTtcblx0XHRcdHJldHVybiBzZWdtZW50c0FycmF5O1xuXHRcdH0sXG5cdFx0YWRkRGF0YSA6IGZ1bmN0aW9uKHNlZ21lbnQsIGF0SW5kZXgsIHNpbGVudCl7XG5cdFx0XHR2YXIgaW5kZXggPSBhdEluZGV4IHx8IHRoaXMuc2VnbWVudHMubGVuZ3RoO1xuXG5cdFx0XHR0aGlzLnNlZ21lbnRzLnNwbGljZShpbmRleCwgMCwgbmV3IHRoaXMuU2VnbWVudEFyYyh7XG5cdFx0XHRcdGZpbGxDb2xvcjogc2VnbWVudC5jb2xvcixcblx0XHRcdFx0aGlnaGxpZ2h0Q29sb3I6IHNlZ21lbnQuaGlnaGxpZ2h0IHx8IHNlZ21lbnQuY29sb3IsXG5cdFx0XHRcdGxhYmVsOiBzZWdtZW50LmxhYmVsLFxuXHRcdFx0XHR2YWx1ZTogc2VnbWVudC52YWx1ZSxcblx0XHRcdFx0b3V0ZXJSYWRpdXM6ICh0aGlzLm9wdGlvbnMuYW5pbWF0ZVNjYWxlKSA/IDAgOiB0aGlzLnNjYWxlLmNhbGN1bGF0ZUNlbnRlck9mZnNldChzZWdtZW50LnZhbHVlKSxcblx0XHRcdFx0Y2lyY3VtZmVyZW5jZTogKHRoaXMub3B0aW9ucy5hbmltYXRlUm90YXRlKSA/IDAgOiB0aGlzLnNjYWxlLmdldENpcmN1bWZlcmVuY2UoKSxcblx0XHRcdFx0c3RhcnRBbmdsZTogTWF0aC5QSSAqIDEuNVxuXHRcdFx0fSkpO1xuXHRcdFx0aWYgKCFzaWxlbnQpe1xuXHRcdFx0XHR0aGlzLnJlZmxvdygpO1xuXHRcdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cmVtb3ZlRGF0YTogZnVuY3Rpb24oYXRJbmRleCl7XG5cdFx0XHR2YXIgaW5kZXhUb0RlbGV0ZSA9IChoZWxwZXJzLmlzTnVtYmVyKGF0SW5kZXgpKSA/IGF0SW5kZXggOiB0aGlzLnNlZ21lbnRzLmxlbmd0aC0xO1xuXHRcdFx0dGhpcy5zZWdtZW50cy5zcGxpY2UoaW5kZXhUb0RlbGV0ZSwgMSk7XG5cdFx0XHR0aGlzLnJlZmxvdygpO1xuXHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHR9LFxuXHRcdGNhbGN1bGF0ZVRvdGFsOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdHRoaXMudG90YWwgPSAwO1xuXHRcdFx0aGVscGVycy5lYWNoKGRhdGEsZnVuY3Rpb24oc2VnbWVudCl7XG5cdFx0XHRcdHRoaXMudG90YWwgKz0gc2VnbWVudC52YWx1ZTtcblx0XHRcdH0sdGhpcyk7XG5cdFx0XHR0aGlzLnNjYWxlLnZhbHVlc0NvdW50ID0gdGhpcy5zZWdtZW50cy5sZW5ndGg7XG5cdFx0fSxcblx0XHR1cGRhdGVTY2FsZVJhbmdlOiBmdW5jdGlvbihkYXRhcG9pbnRzKXtcblx0XHRcdHZhciB2YWx1ZXNBcnJheSA9IFtdO1xuXHRcdFx0aGVscGVycy5lYWNoKGRhdGFwb2ludHMsZnVuY3Rpb24oc2VnbWVudCl7XG5cdFx0XHRcdHZhbHVlc0FycmF5LnB1c2goc2VnbWVudC52YWx1ZSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0dmFyIHNjYWxlU2l6ZXMgPSAodGhpcy5vcHRpb25zLnNjYWxlT3ZlcnJpZGUpID9cblx0XHRcdFx0e1xuXHRcdFx0XHRcdHN0ZXBzOiB0aGlzLm9wdGlvbnMuc2NhbGVTdGVwcyxcblx0XHRcdFx0XHRzdGVwVmFsdWU6IHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBXaWR0aCxcblx0XHRcdFx0XHRtaW46IHRoaXMub3B0aW9ucy5zY2FsZVN0YXJ0VmFsdWUsXG5cdFx0XHRcdFx0bWF4OiB0aGlzLm9wdGlvbnMuc2NhbGVTdGFydFZhbHVlICsgKHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBzICogdGhpcy5vcHRpb25zLnNjYWxlU3RlcFdpZHRoKVxuXHRcdFx0XHR9IDpcblx0XHRcdFx0aGVscGVycy5jYWxjdWxhdGVTY2FsZVJhbmdlKFxuXHRcdFx0XHRcdHZhbHVlc0FycmF5LFxuXHRcdFx0XHRcdGhlbHBlcnMubWluKFt0aGlzLmNoYXJ0LndpZHRoLCB0aGlzLmNoYXJ0LmhlaWdodF0pLzIsXG5cdFx0XHRcdFx0dGhpcy5vcHRpb25zLnNjYWxlRm9udFNpemUsXG5cdFx0XHRcdFx0dGhpcy5vcHRpb25zLnNjYWxlQmVnaW5BdFplcm8sXG5cdFx0XHRcdFx0dGhpcy5vcHRpb25zLnNjYWxlSW50ZWdlcnNPbmx5XG5cdFx0XHRcdCk7XG5cblx0XHRcdGhlbHBlcnMuZXh0ZW5kKFxuXHRcdFx0XHR0aGlzLnNjYWxlLFxuXHRcdFx0XHRzY2FsZVNpemVzLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c2l6ZTogaGVscGVycy5taW4oW3RoaXMuY2hhcnQud2lkdGgsIHRoaXMuY2hhcnQuaGVpZ2h0XSksXG5cdFx0XHRcdFx0eENlbnRlcjogdGhpcy5jaGFydC53aWR0aC8yLFxuXHRcdFx0XHRcdHlDZW50ZXI6IHRoaXMuY2hhcnQuaGVpZ2h0LzJcblx0XHRcdFx0fVxuXHRcdFx0KTtcblxuXHRcdH0sXG5cdFx0dXBkYXRlIDogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuY2FsY3VsYXRlVG90YWwodGhpcy5zZWdtZW50cyk7XG5cblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLnNlZ21lbnRzLGZ1bmN0aW9uKHNlZ21lbnQpe1xuXHRcdFx0XHRzZWdtZW50LnNhdmUoKTtcblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHR0aGlzLnJlZmxvdygpO1xuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9LFxuXHRcdHJlZmxvdyA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRoZWxwZXJzLmV4dGVuZCh0aGlzLlNlZ21lbnRBcmMucHJvdG90eXBlLHtcblx0XHRcdFx0eCA6IHRoaXMuY2hhcnQud2lkdGgvMixcblx0XHRcdFx0eSA6IHRoaXMuY2hhcnQuaGVpZ2h0LzJcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy51cGRhdGVTY2FsZVJhbmdlKHRoaXMuc2VnbWVudHMpO1xuXHRcdFx0dGhpcy5zY2FsZS51cGRhdGUoKTtcblxuXHRcdFx0aGVscGVycy5leHRlbmQodGhpcy5zY2FsZSx7XG5cdFx0XHRcdHhDZW50ZXI6IHRoaXMuY2hhcnQud2lkdGgvMixcblx0XHRcdFx0eUNlbnRlcjogdGhpcy5jaGFydC5oZWlnaHQvMlxuXHRcdFx0fSk7XG5cblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLnNlZ21lbnRzLCBmdW5jdGlvbihzZWdtZW50KXtcblx0XHRcdFx0c2VnbWVudC51cGRhdGUoe1xuXHRcdFx0XHRcdG91dGVyUmFkaXVzIDogdGhpcy5zY2FsZS5jYWxjdWxhdGVDZW50ZXJPZmZzZXQoc2VnbWVudC52YWx1ZSlcblx0XHRcdFx0fSk7XG5cdFx0XHR9LCB0aGlzKTtcblxuXHRcdH0sXG5cdFx0ZHJhdyA6IGZ1bmN0aW9uKGVhc2Upe1xuXHRcdFx0dmFyIGVhc2luZ0RlY2ltYWwgPSBlYXNlIHx8IDE7XG5cdFx0XHQvL0NsZWFyICYgZHJhdyB0aGUgY2FudmFzXG5cdFx0XHR0aGlzLmNsZWFyKCk7XG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5zZWdtZW50cyxmdW5jdGlvbihzZWdtZW50LCBpbmRleCl7XG5cdFx0XHRcdHNlZ21lbnQudHJhbnNpdGlvbih7XG5cdFx0XHRcdFx0Y2lyY3VtZmVyZW5jZSA6IHRoaXMuc2NhbGUuZ2V0Q2lyY3VtZmVyZW5jZSgpLFxuXHRcdFx0XHRcdG91dGVyUmFkaXVzIDogdGhpcy5zY2FsZS5jYWxjdWxhdGVDZW50ZXJPZmZzZXQoc2VnbWVudC52YWx1ZSlcblx0XHRcdFx0fSxlYXNpbmdEZWNpbWFsKTtcblxuXHRcdFx0XHRzZWdtZW50LmVuZEFuZ2xlID0gc2VnbWVudC5zdGFydEFuZ2xlICsgc2VnbWVudC5jaXJjdW1mZXJlbmNlO1xuXG5cdFx0XHRcdC8vIElmIHdlJ3ZlIHJlbW92ZWQgdGhlIGZpcnN0IHNlZ21lbnQgd2UgbmVlZCB0byBzZXQgdGhlIGZpcnN0IG9uZSB0b1xuXHRcdFx0XHQvLyBzdGFydCBhdCB0aGUgdG9wLlxuXHRcdFx0XHRpZiAoaW5kZXggPT09IDApe1xuXHRcdFx0XHRcdHNlZ21lbnQuc3RhcnRBbmdsZSA9IE1hdGguUEkgKiAxLjU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL0NoZWNrIHRvIHNlZSBpZiBpdCdzIHRoZSBsYXN0IHNlZ21lbnQsIGlmIG5vdCBnZXQgdGhlIG5leHQgYW5kIHVwZGF0ZSB0aGUgc3RhcnQgYW5nbGVcblx0XHRcdFx0aWYgKGluZGV4IDwgdGhpcy5zZWdtZW50cy5sZW5ndGggLSAxKXtcblx0XHRcdFx0XHR0aGlzLnNlZ21lbnRzW2luZGV4KzFdLnN0YXJ0QW5nbGUgPSBzZWdtZW50LmVuZEFuZ2xlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNlZ21lbnQuZHJhdygpO1xuXHRcdFx0fSwgdGhpcyk7XG5cdFx0XHR0aGlzLnNjYWxlLmRyYXcoKTtcblx0XHR9XG5cdH0pO1xuXG59KS5jYWxsKHRoaXMpO1xuKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciByb290ID0gdGhpcyxcblx0XHRDaGFydCA9IHJvb3QuQ2hhcnQsXG5cdFx0aGVscGVycyA9IENoYXJ0LmhlbHBlcnM7XG5cblxuXG5cdENoYXJ0LlR5cGUuZXh0ZW5kKHtcblx0XHRuYW1lOiBcIlJhZGFyXCIsXG5cdFx0ZGVmYXVsdHM6e1xuXHRcdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB0byBzaG93IGxpbmVzIGZvciBlYWNoIHNjYWxlIHBvaW50XG5cdFx0XHRzY2FsZVNob3dMaW5lIDogdHJ1ZSxcblxuXHRcdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB3ZSBzaG93IHRoZSBhbmdsZSBsaW5lcyBvdXQgb2YgdGhlIHJhZGFyXG5cdFx0XHRhbmdsZVNob3dMaW5lT3V0IDogdHJ1ZSxcblxuXHRcdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB0byBzaG93IGxhYmVscyBvbiB0aGUgc2NhbGVcblx0XHRcdHNjYWxlU2hvd0xhYmVscyA6IGZhbHNlLFxuXG5cdFx0XHQvLyBCb29sZWFuIC0gV2hldGhlciB0aGUgc2NhbGUgc2hvdWxkIGJlZ2luIGF0IHplcm9cblx0XHRcdHNjYWxlQmVnaW5BdFplcm8gOiB0cnVlLFxuXG5cdFx0XHQvL1N0cmluZyAtIENvbG91ciBvZiB0aGUgYW5nbGUgbGluZVxuXHRcdFx0YW5nbGVMaW5lQ29sb3IgOiBcInJnYmEoMCwwLDAsLjEpXCIsXG5cblx0XHRcdC8vTnVtYmVyIC0gUGl4ZWwgd2lkdGggb2YgdGhlIGFuZ2xlIGxpbmVcblx0XHRcdGFuZ2xlTGluZVdpZHRoIDogMSxcblxuXHRcdFx0Ly9TdHJpbmcgLSBQb2ludCBsYWJlbCBmb250IGRlY2xhcmF0aW9uXG5cdFx0XHRwb2ludExhYmVsRm9udEZhbWlseSA6IFwiJ0FyaWFsJ1wiLFxuXG5cdFx0XHQvL1N0cmluZyAtIFBvaW50IGxhYmVsIGZvbnQgd2VpZ2h0XG5cdFx0XHRwb2ludExhYmVsRm9udFN0eWxlIDogXCJub3JtYWxcIixcblxuXHRcdFx0Ly9OdW1iZXIgLSBQb2ludCBsYWJlbCBmb250IHNpemUgaW4gcGl4ZWxzXG5cdFx0XHRwb2ludExhYmVsRm9udFNpemUgOiAxMCxcblxuXHRcdFx0Ly9TdHJpbmcgLSBQb2ludCBsYWJlbCBmb250IGNvbG91clxuXHRcdFx0cG9pbnRMYWJlbEZvbnRDb2xvciA6IFwiIzY2NlwiLFxuXG5cdFx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIHNob3cgYSBkb3QgZm9yIGVhY2ggcG9pbnRcblx0XHRcdHBvaW50RG90IDogdHJ1ZSxcblxuXHRcdFx0Ly9OdW1iZXIgLSBSYWRpdXMgb2YgZWFjaCBwb2ludCBkb3QgaW4gcGl4ZWxzXG5cdFx0XHRwb2ludERvdFJhZGl1cyA6IDMsXG5cblx0XHRcdC8vTnVtYmVyIC0gUGl4ZWwgd2lkdGggb2YgcG9pbnQgZG90IHN0cm9rZVxuXHRcdFx0cG9pbnREb3RTdHJva2VXaWR0aCA6IDEsXG5cblx0XHRcdC8vTnVtYmVyIC0gYW1vdW50IGV4dHJhIHRvIGFkZCB0byB0aGUgcmFkaXVzIHRvIGNhdGVyIGZvciBoaXQgZGV0ZWN0aW9uIG91dHNpZGUgdGhlIGRyYXduIHBvaW50XG5cdFx0XHRwb2ludEhpdERldGVjdGlvblJhZGl1cyA6IDIwLFxuXG5cdFx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIHNob3cgYSBzdHJva2UgZm9yIGRhdGFzZXRzXG5cdFx0XHRkYXRhc2V0U3Ryb2tlIDogdHJ1ZSxcblxuXHRcdFx0Ly9OdW1iZXIgLSBQaXhlbCB3aWR0aCBvZiBkYXRhc2V0IHN0cm9rZVxuXHRcdFx0ZGF0YXNldFN0cm9rZVdpZHRoIDogMixcblxuXHRcdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB0byBmaWxsIHRoZSBkYXRhc2V0IHdpdGggYSBjb2xvdXJcblx0XHRcdGRhdGFzZXRGaWxsIDogdHJ1ZSxcblxuXHRcdFx0Ly9TdHJpbmcgLSBBIGxlZ2VuZCB0ZW1wbGF0ZVxuXHRcdFx0bGVnZW5kVGVtcGxhdGUgOiBcIjx1bCBjbGFzcz1cXFwiPCU9bmFtZS50b0xvd2VyQ2FzZSgpJT4tbGVnZW5kXFxcIj48JSBmb3IgKHZhciBpPTA7IGk8ZGF0YXNldHMubGVuZ3RoOyBpKyspeyU+PGxpPjxzcGFuIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWNvbG9yOjwlPWRhdGFzZXRzW2ldLnN0cm9rZUNvbG9yJT5cXFwiPjwvc3Bhbj48JWlmKGRhdGFzZXRzW2ldLmxhYmVsKXslPjwlPWRhdGFzZXRzW2ldLmxhYmVsJT48JX0lPjwvbGk+PCV9JT48L3VsPlwiXG5cblx0XHR9LFxuXG5cdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHR0aGlzLlBvaW50Q2xhc3MgPSBDaGFydC5Qb2ludC5leHRlbmQoe1xuXHRcdFx0XHRzdHJva2VXaWR0aCA6IHRoaXMub3B0aW9ucy5wb2ludERvdFN0cm9rZVdpZHRoLFxuXHRcdFx0XHRyYWRpdXMgOiB0aGlzLm9wdGlvbnMucG9pbnREb3RSYWRpdXMsXG5cdFx0XHRcdGRpc3BsYXk6IHRoaXMub3B0aW9ucy5wb2ludERvdCxcblx0XHRcdFx0aGl0RGV0ZWN0aW9uUmFkaXVzIDogdGhpcy5vcHRpb25zLnBvaW50SGl0RGV0ZWN0aW9uUmFkaXVzLFxuXHRcdFx0XHRjdHggOiB0aGlzLmNoYXJ0LmN0eFxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuZGF0YXNldHMgPSBbXTtcblxuXHRcdFx0dGhpcy5idWlsZFNjYWxlKGRhdGEpO1xuXG5cdFx0XHQvL1NldCB1cCB0b29sdGlwIGV2ZW50cyBvbiB0aGUgY2hhcnRcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuc2hvd1Rvb2x0aXBzKXtcblx0XHRcdFx0aGVscGVycy5iaW5kRXZlbnRzKHRoaXMsIHRoaXMub3B0aW9ucy50b29sdGlwRXZlbnRzLCBmdW5jdGlvbihldnQpe1xuXHRcdFx0XHRcdHZhciBhY3RpdmVQb2ludHNDb2xsZWN0aW9uID0gKGV2dC50eXBlICE9PSAnbW91c2VvdXQnKSA/IHRoaXMuZ2V0UG9pbnRzQXRFdmVudChldnQpIDogW107XG5cblx0XHRcdFx0XHR0aGlzLmVhY2hQb2ludHMoZnVuY3Rpb24ocG9pbnQpe1xuXHRcdFx0XHRcdFx0cG9pbnQucmVzdG9yZShbJ2ZpbGxDb2xvcicsICdzdHJva2VDb2xvciddKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRoZWxwZXJzLmVhY2goYWN0aXZlUG9pbnRzQ29sbGVjdGlvbiwgZnVuY3Rpb24oYWN0aXZlUG9pbnQpe1xuXHRcdFx0XHRcdFx0YWN0aXZlUG9pbnQuZmlsbENvbG9yID0gYWN0aXZlUG9pbnQuaGlnaGxpZ2h0RmlsbDtcblx0XHRcdFx0XHRcdGFjdGl2ZVBvaW50LnN0cm9rZUNvbG9yID0gYWN0aXZlUG9pbnQuaGlnaGxpZ2h0U3Ryb2tlO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0dGhpcy5zaG93VG9vbHRpcChhY3RpdmVQb2ludHNDb2xsZWN0aW9uKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vSXRlcmF0ZSB0aHJvdWdoIGVhY2ggb2YgdGhlIGRhdGFzZXRzLCBhbmQgYnVpbGQgdGhpcyBpbnRvIGEgcHJvcGVydHkgb2YgdGhlIGNoYXJ0XG5cdFx0XHRoZWxwZXJzLmVhY2goZGF0YS5kYXRhc2V0cyxmdW5jdGlvbihkYXRhc2V0KXtcblxuXHRcdFx0XHR2YXIgZGF0YXNldE9iamVjdCA9IHtcblx0XHRcdFx0XHRsYWJlbDogZGF0YXNldC5sYWJlbCB8fCBudWxsLFxuXHRcdFx0XHRcdGZpbGxDb2xvciA6IGRhdGFzZXQuZmlsbENvbG9yLFxuXHRcdFx0XHRcdHN0cm9rZUNvbG9yIDogZGF0YXNldC5zdHJva2VDb2xvcixcblx0XHRcdFx0XHRwb2ludENvbG9yIDogZGF0YXNldC5wb2ludENvbG9yLFxuXHRcdFx0XHRcdHBvaW50U3Ryb2tlQ29sb3IgOiBkYXRhc2V0LnBvaW50U3Ryb2tlQ29sb3IsXG5cdFx0XHRcdFx0cG9pbnRzIDogW11cblx0XHRcdFx0fTtcblxuXHRcdFx0XHR0aGlzLmRhdGFzZXRzLnB1c2goZGF0YXNldE9iamVjdCk7XG5cblx0XHRcdFx0aGVscGVycy5lYWNoKGRhdGFzZXQuZGF0YSxmdW5jdGlvbihkYXRhUG9pbnQsaW5kZXgpe1xuXHRcdFx0XHRcdC8vQWRkIGEgbmV3IHBvaW50IGZvciBlYWNoIHBpZWNlIG9mIGRhdGEsIHBhc3NpbmcgYW55IHJlcXVpcmVkIGRhdGEgdG8gZHJhdy5cblx0XHRcdFx0XHR2YXIgcG9pbnRQb3NpdGlvbjtcblx0XHRcdFx0XHRpZiAoIXRoaXMuc2NhbGUuYW5pbWF0aW9uKXtcblx0XHRcdFx0XHRcdHBvaW50UG9zaXRpb24gPSB0aGlzLnNjYWxlLmdldFBvaW50UG9zaXRpb24oaW5kZXgsIHRoaXMuc2NhbGUuY2FsY3VsYXRlQ2VudGVyT2Zmc2V0KGRhdGFQb2ludCkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRkYXRhc2V0T2JqZWN0LnBvaW50cy5wdXNoKG5ldyB0aGlzLlBvaW50Q2xhc3Moe1xuXHRcdFx0XHRcdFx0dmFsdWUgOiBkYXRhUG9pbnQsXG5cdFx0XHRcdFx0XHRsYWJlbCA6IGRhdGEubGFiZWxzW2luZGV4XSxcblx0XHRcdFx0XHRcdGRhdGFzZXRMYWJlbDogZGF0YXNldC5sYWJlbCxcblx0XHRcdFx0XHRcdHg6ICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uKSA/IHRoaXMuc2NhbGUueENlbnRlciA6IHBvaW50UG9zaXRpb24ueCxcblx0XHRcdFx0XHRcdHk6ICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uKSA/IHRoaXMuc2NhbGUueUNlbnRlciA6IHBvaW50UG9zaXRpb24ueSxcblx0XHRcdFx0XHRcdHN0cm9rZUNvbG9yIDogZGF0YXNldC5wb2ludFN0cm9rZUNvbG9yLFxuXHRcdFx0XHRcdFx0ZmlsbENvbG9yIDogZGF0YXNldC5wb2ludENvbG9yLFxuXHRcdFx0XHRcdFx0aGlnaGxpZ2h0RmlsbCA6IGRhdGFzZXQucG9pbnRIaWdobGlnaHRGaWxsIHx8IGRhdGFzZXQucG9pbnRDb2xvcixcblx0XHRcdFx0XHRcdGhpZ2hsaWdodFN0cm9rZSA6IGRhdGFzZXQucG9pbnRIaWdobGlnaHRTdHJva2UgfHwgZGF0YXNldC5wb2ludFN0cm9rZUNvbG9yXG5cdFx0XHRcdFx0fSkpO1xuXHRcdFx0XHR9LHRoaXMpO1xuXG5cdFx0XHR9LHRoaXMpO1xuXG5cdFx0XHR0aGlzLnJlbmRlcigpO1xuXHRcdH0sXG5cdFx0ZWFjaFBvaW50cyA6IGZ1bmN0aW9uKGNhbGxiYWNrKXtcblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmRhdGFzZXRzLGZ1bmN0aW9uKGRhdGFzZXQpe1xuXHRcdFx0XHRoZWxwZXJzLmVhY2goZGF0YXNldC5wb2ludHMsY2FsbGJhY2ssdGhpcyk7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdH0sXG5cblx0XHRnZXRQb2ludHNBdEV2ZW50IDogZnVuY3Rpb24oZXZ0KXtcblx0XHRcdHZhciBtb3VzZVBvc2l0aW9uID0gaGVscGVycy5nZXRSZWxhdGl2ZVBvc2l0aW9uKGV2dCksXG5cdFx0XHRcdGZyb21DZW50ZXIgPSBoZWxwZXJzLmdldEFuZ2xlRnJvbVBvaW50KHtcblx0XHRcdFx0XHR4OiB0aGlzLnNjYWxlLnhDZW50ZXIsXG5cdFx0XHRcdFx0eTogdGhpcy5zY2FsZS55Q2VudGVyXG5cdFx0XHRcdH0sIG1vdXNlUG9zaXRpb24pO1xuXG5cdFx0XHR2YXIgYW5nbGVQZXJJbmRleCA9IChNYXRoLlBJICogMikgL3RoaXMuc2NhbGUudmFsdWVzQ291bnQsXG5cdFx0XHRcdHBvaW50SW5kZXggPSBNYXRoLnJvdW5kKChmcm9tQ2VudGVyLmFuZ2xlIC0gTWF0aC5QSSAqIDEuNSkgLyBhbmdsZVBlckluZGV4KSxcblx0XHRcdFx0YWN0aXZlUG9pbnRzQ29sbGVjdGlvbiA9IFtdO1xuXG5cdFx0XHQvLyBJZiB3ZSdyZSBhdCB0aGUgdG9wLCBtYWtlIHRoZSBwb2ludEluZGV4IDAgdG8gZ2V0IHRoZSBmaXJzdCBvZiB0aGUgYXJyYXkuXG5cdFx0XHRpZiAocG9pbnRJbmRleCA+PSB0aGlzLnNjYWxlLnZhbHVlc0NvdW50IHx8IHBvaW50SW5kZXggPCAwKXtcblx0XHRcdFx0cG9pbnRJbmRleCA9IDA7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChmcm9tQ2VudGVyLmRpc3RhbmNlIDw9IHRoaXMuc2NhbGUuZHJhd2luZ0FyZWEpe1xuXHRcdFx0XHRoZWxwZXJzLmVhY2godGhpcy5kYXRhc2V0cywgZnVuY3Rpb24oZGF0YXNldCl7XG5cdFx0XHRcdFx0YWN0aXZlUG9pbnRzQ29sbGVjdGlvbi5wdXNoKGRhdGFzZXQucG9pbnRzW3BvaW50SW5kZXhdKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBhY3RpdmVQb2ludHNDb2xsZWN0aW9uO1xuXHRcdH0sXG5cblx0XHRidWlsZFNjYWxlIDogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHR0aGlzLnNjYWxlID0gbmV3IENoYXJ0LlJhZGlhbFNjYWxlKHtcblx0XHRcdFx0ZGlzcGxheTogdGhpcy5vcHRpb25zLnNob3dTY2FsZSxcblx0XHRcdFx0Zm9udFN0eWxlOiB0aGlzLm9wdGlvbnMuc2NhbGVGb250U3R5bGUsXG5cdFx0XHRcdGZvbnRTaXplOiB0aGlzLm9wdGlvbnMuc2NhbGVGb250U2l6ZSxcblx0XHRcdFx0Zm9udEZhbWlseTogdGhpcy5vcHRpb25zLnNjYWxlRm9udEZhbWlseSxcblx0XHRcdFx0Zm9udENvbG9yOiB0aGlzLm9wdGlvbnMuc2NhbGVGb250Q29sb3IsXG5cdFx0XHRcdHNob3dMYWJlbHM6IHRoaXMub3B0aW9ucy5zY2FsZVNob3dMYWJlbHMsXG5cdFx0XHRcdHNob3dMYWJlbEJhY2tkcm9wOiB0aGlzLm9wdGlvbnMuc2NhbGVTaG93TGFiZWxCYWNrZHJvcCxcblx0XHRcdFx0YmFja2Ryb3BDb2xvcjogdGhpcy5vcHRpb25zLnNjYWxlQmFja2Ryb3BDb2xvcixcblx0XHRcdFx0YmFja2Ryb3BQYWRkaW5nWSA6IHRoaXMub3B0aW9ucy5zY2FsZUJhY2tkcm9wUGFkZGluZ1ksXG5cdFx0XHRcdGJhY2tkcm9wUGFkZGluZ1g6IHRoaXMub3B0aW9ucy5zY2FsZUJhY2tkcm9wUGFkZGluZ1gsXG5cdFx0XHRcdGxpbmVXaWR0aDogKHRoaXMub3B0aW9ucy5zY2FsZVNob3dMaW5lKSA/IHRoaXMub3B0aW9ucy5zY2FsZUxpbmVXaWR0aCA6IDAsXG5cdFx0XHRcdGxpbmVDb2xvcjogdGhpcy5vcHRpb25zLnNjYWxlTGluZUNvbG9yLFxuXHRcdFx0XHRhbmdsZUxpbmVDb2xvciA6IHRoaXMub3B0aW9ucy5hbmdsZUxpbmVDb2xvcixcblx0XHRcdFx0YW5nbGVMaW5lV2lkdGggOiAodGhpcy5vcHRpb25zLmFuZ2xlU2hvd0xpbmVPdXQpID8gdGhpcy5vcHRpb25zLmFuZ2xlTGluZVdpZHRoIDogMCxcblx0XHRcdFx0Ly8gUG9pbnQgbGFiZWxzIGF0IHRoZSBlZGdlIG9mIGVhY2ggbGluZVxuXHRcdFx0XHRwb2ludExhYmVsRm9udENvbG9yIDogdGhpcy5vcHRpb25zLnBvaW50TGFiZWxGb250Q29sb3IsXG5cdFx0XHRcdHBvaW50TGFiZWxGb250U2l6ZSA6IHRoaXMub3B0aW9ucy5wb2ludExhYmVsRm9udFNpemUsXG5cdFx0XHRcdHBvaW50TGFiZWxGb250RmFtaWx5IDogdGhpcy5vcHRpb25zLnBvaW50TGFiZWxGb250RmFtaWx5LFxuXHRcdFx0XHRwb2ludExhYmVsRm9udFN0eWxlIDogdGhpcy5vcHRpb25zLnBvaW50TGFiZWxGb250U3R5bGUsXG5cdFx0XHRcdGhlaWdodCA6IHRoaXMuY2hhcnQuaGVpZ2h0LFxuXHRcdFx0XHR3aWR0aDogdGhpcy5jaGFydC53aWR0aCxcblx0XHRcdFx0eENlbnRlcjogdGhpcy5jaGFydC53aWR0aC8yLFxuXHRcdFx0XHR5Q2VudGVyOiB0aGlzLmNoYXJ0LmhlaWdodC8yLFxuXHRcdFx0XHRjdHggOiB0aGlzLmNoYXJ0LmN0eCxcblx0XHRcdFx0dGVtcGxhdGVTdHJpbmc6IHRoaXMub3B0aW9ucy5zY2FsZUxhYmVsLFxuXHRcdFx0XHRsYWJlbHM6IGRhdGEubGFiZWxzLFxuXHRcdFx0XHR2YWx1ZXNDb3VudDogZGF0YS5kYXRhc2V0c1swXS5kYXRhLmxlbmd0aFxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuc2NhbGUuc2V0U2NhbGVTaXplKCk7XG5cdFx0XHR0aGlzLnVwZGF0ZVNjYWxlUmFuZ2UoZGF0YS5kYXRhc2V0cyk7XG5cdFx0XHR0aGlzLnNjYWxlLmJ1aWxkWUxhYmVscygpO1xuXHRcdH0sXG5cdFx0dXBkYXRlU2NhbGVSYW5nZTogZnVuY3Rpb24oZGF0YXNldHMpe1xuXHRcdFx0dmFyIHZhbHVlc0FycmF5ID0gKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciB0b3RhbERhdGFBcnJheSA9IFtdO1xuXHRcdFx0XHRoZWxwZXJzLmVhY2goZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCl7XG5cdFx0XHRcdFx0aWYgKGRhdGFzZXQuZGF0YSl7XG5cdFx0XHRcdFx0XHR0b3RhbERhdGFBcnJheSA9IHRvdGFsRGF0YUFycmF5LmNvbmNhdChkYXRhc2V0LmRhdGEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGhlbHBlcnMuZWFjaChkYXRhc2V0LnBvaW50cywgZnVuY3Rpb24ocG9pbnQpe1xuXHRcdFx0XHRcdFx0XHR0b3RhbERhdGFBcnJheS5wdXNoKHBvaW50LnZhbHVlKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiB0b3RhbERhdGFBcnJheTtcblx0XHRcdH0pKCk7XG5cblxuXHRcdFx0dmFyIHNjYWxlU2l6ZXMgPSAodGhpcy5vcHRpb25zLnNjYWxlT3ZlcnJpZGUpID9cblx0XHRcdFx0e1xuXHRcdFx0XHRcdHN0ZXBzOiB0aGlzLm9wdGlvbnMuc2NhbGVTdGVwcyxcblx0XHRcdFx0XHRzdGVwVmFsdWU6IHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBXaWR0aCxcblx0XHRcdFx0XHRtaW46IHRoaXMub3B0aW9ucy5zY2FsZVN0YXJ0VmFsdWUsXG5cdFx0XHRcdFx0bWF4OiB0aGlzLm9wdGlvbnMuc2NhbGVTdGFydFZhbHVlICsgKHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBzICogdGhpcy5vcHRpb25zLnNjYWxlU3RlcFdpZHRoKVxuXHRcdFx0XHR9IDpcblx0XHRcdFx0aGVscGVycy5jYWxjdWxhdGVTY2FsZVJhbmdlKFxuXHRcdFx0XHRcdHZhbHVlc0FycmF5LFxuXHRcdFx0XHRcdGhlbHBlcnMubWluKFt0aGlzLmNoYXJ0LndpZHRoLCB0aGlzLmNoYXJ0LmhlaWdodF0pLzIsXG5cdFx0XHRcdFx0dGhpcy5vcHRpb25zLnNjYWxlRm9udFNpemUsXG5cdFx0XHRcdFx0dGhpcy5vcHRpb25zLnNjYWxlQmVnaW5BdFplcm8sXG5cdFx0XHRcdFx0dGhpcy5vcHRpb25zLnNjYWxlSW50ZWdlcnNPbmx5XG5cdFx0XHRcdCk7XG5cblx0XHRcdGhlbHBlcnMuZXh0ZW5kKFxuXHRcdFx0XHR0aGlzLnNjYWxlLFxuXHRcdFx0XHRzY2FsZVNpemVzXG5cdFx0XHQpO1xuXG5cdFx0fSxcblx0XHRhZGREYXRhIDogZnVuY3Rpb24odmFsdWVzQXJyYXksbGFiZWwpe1xuXHRcdFx0Ly9NYXAgdGhlIHZhbHVlcyBhcnJheSBmb3IgZWFjaCBvZiB0aGUgZGF0YXNldHNcblx0XHRcdHRoaXMuc2NhbGUudmFsdWVzQ291bnQrKztcblx0XHRcdGhlbHBlcnMuZWFjaCh2YWx1ZXNBcnJheSxmdW5jdGlvbih2YWx1ZSxkYXRhc2V0SW5kZXgpe1xuXHRcdFx0XHR2YXIgcG9pbnRQb3NpdGlvbiA9IHRoaXMuc2NhbGUuZ2V0UG9pbnRQb3NpdGlvbih0aGlzLnNjYWxlLnZhbHVlc0NvdW50LCB0aGlzLnNjYWxlLmNhbGN1bGF0ZUNlbnRlck9mZnNldCh2YWx1ZSkpO1xuXHRcdFx0XHR0aGlzLmRhdGFzZXRzW2RhdGFzZXRJbmRleF0ucG9pbnRzLnB1c2gobmV3IHRoaXMuUG9pbnRDbGFzcyh7XG5cdFx0XHRcdFx0dmFsdWUgOiB2YWx1ZSxcblx0XHRcdFx0XHRsYWJlbCA6IGxhYmVsLFxuXHRcdFx0XHRcdHg6IHBvaW50UG9zaXRpb24ueCxcblx0XHRcdFx0XHR5OiBwb2ludFBvc2l0aW9uLnksXG5cdFx0XHRcdFx0c3Ryb2tlQ29sb3IgOiB0aGlzLmRhdGFzZXRzW2RhdGFzZXRJbmRleF0ucG9pbnRTdHJva2VDb2xvcixcblx0XHRcdFx0XHRmaWxsQ29sb3IgOiB0aGlzLmRhdGFzZXRzW2RhdGFzZXRJbmRleF0ucG9pbnRDb2xvclxuXHRcdFx0XHR9KSk7XG5cdFx0XHR9LHRoaXMpO1xuXG5cdFx0XHR0aGlzLnNjYWxlLmxhYmVscy5wdXNoKGxhYmVsKTtcblxuXHRcdFx0dGhpcy5yZWZsb3coKTtcblxuXHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHR9LFxuXHRcdHJlbW92ZURhdGEgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5zY2FsZS52YWx1ZXNDb3VudC0tO1xuXHRcdFx0dGhpcy5zY2FsZS5sYWJlbHMuc2hpZnQoKTtcblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmRhdGFzZXRzLGZ1bmN0aW9uKGRhdGFzZXQpe1xuXHRcdFx0XHRkYXRhc2V0LnBvaW50cy5zaGlmdCgpO1xuXHRcdFx0fSx0aGlzKTtcblx0XHRcdHRoaXMucmVmbG93KCk7XG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdH0sXG5cdFx0dXBkYXRlIDogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuZWFjaFBvaW50cyhmdW5jdGlvbihwb2ludCl7XG5cdFx0XHRcdHBvaW50LnNhdmUoKTtcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5yZWZsb3coKTtcblx0XHRcdHRoaXMucmVuZGVyKCk7XG5cdFx0fSxcblx0XHRyZWZsb3c6IGZ1bmN0aW9uKCl7XG5cdFx0XHRoZWxwZXJzLmV4dGVuZCh0aGlzLnNjYWxlLCB7XG5cdFx0XHRcdHdpZHRoIDogdGhpcy5jaGFydC53aWR0aCxcblx0XHRcdFx0aGVpZ2h0OiB0aGlzLmNoYXJ0LmhlaWdodCxcblx0XHRcdFx0c2l6ZSA6IGhlbHBlcnMubWluKFt0aGlzLmNoYXJ0LndpZHRoLCB0aGlzLmNoYXJ0LmhlaWdodF0pLFxuXHRcdFx0XHR4Q2VudGVyOiB0aGlzLmNoYXJ0LndpZHRoLzIsXG5cdFx0XHRcdHlDZW50ZXI6IHRoaXMuY2hhcnQuaGVpZ2h0LzJcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy51cGRhdGVTY2FsZVJhbmdlKHRoaXMuZGF0YXNldHMpO1xuXHRcdFx0dGhpcy5zY2FsZS5zZXRTY2FsZVNpemUoKTtcblx0XHRcdHRoaXMuc2NhbGUuYnVpbGRZTGFiZWxzKCk7XG5cdFx0fSxcblx0XHRkcmF3IDogZnVuY3Rpb24oZWFzZSl7XG5cdFx0XHR2YXIgZWFzZURlY2ltYWwgPSBlYXNlIHx8IDEsXG5cdFx0XHRcdGN0eCA9IHRoaXMuY2hhcnQuY3R4O1xuXHRcdFx0dGhpcy5jbGVhcigpO1xuXHRcdFx0dGhpcy5zY2FsZS5kcmF3KCk7XG5cblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmRhdGFzZXRzLGZ1bmN0aW9uKGRhdGFzZXQpe1xuXG5cdFx0XHRcdC8vVHJhbnNpdGlvbiBlYWNoIHBvaW50IGZpcnN0IHNvIHRoYXQgdGhlIGxpbmUgYW5kIHBvaW50IGRyYXdpbmcgaXNuJ3Qgb3V0IG9mIHN5bmNcblx0XHRcdFx0aGVscGVycy5lYWNoKGRhdGFzZXQucG9pbnRzLGZ1bmN0aW9uKHBvaW50LGluZGV4KXtcblx0XHRcdFx0XHRpZiAocG9pbnQuaGFzVmFsdWUoKSl7XG5cdFx0XHRcdFx0XHRwb2ludC50cmFuc2l0aW9uKHRoaXMuc2NhbGUuZ2V0UG9pbnRQb3NpdGlvbihpbmRleCwgdGhpcy5zY2FsZS5jYWxjdWxhdGVDZW50ZXJPZmZzZXQocG9pbnQudmFsdWUpKSwgZWFzZURlY2ltYWwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSx0aGlzKTtcblxuXG5cblx0XHRcdFx0Ly9EcmF3IHRoZSBsaW5lIGJldHdlZW4gYWxsIHRoZSBwb2ludHNcblx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IHRoaXMub3B0aW9ucy5kYXRhc2V0U3Ryb2tlV2lkdGg7XG5cdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9IGRhdGFzZXQuc3Ryb2tlQ29sb3I7XG5cdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0aGVscGVycy5lYWNoKGRhdGFzZXQucG9pbnRzLGZ1bmN0aW9uKHBvaW50LGluZGV4KXtcblx0XHRcdFx0XHRpZiAoaW5kZXggPT09IDApe1xuXHRcdFx0XHRcdFx0Y3R4Lm1vdmVUbyhwb2ludC54LHBvaW50LnkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0Y3R4LmxpbmVUbyhwb2ludC54LHBvaW50LnkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSx0aGlzKTtcblx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IGRhdGFzZXQuZmlsbENvbG9yO1xuXHRcdFx0XHRjdHguZmlsbCgpO1xuXG5cdFx0XHRcdC8vTm93IGRyYXcgdGhlIHBvaW50cyBvdmVyIHRoZSBsaW5lXG5cdFx0XHRcdC8vQSBsaXR0bGUgaW5lZmZpY2llbnQgZG91YmxlIGxvb3BpbmcsIGJ1dCBiZXR0ZXIgdGhhbiB0aGUgbGluZVxuXHRcdFx0XHQvL2xhZ2dpbmcgYmVoaW5kIHRoZSBwb2ludCBwb3NpdGlvbnNcblx0XHRcdFx0aGVscGVycy5lYWNoKGRhdGFzZXQucG9pbnRzLGZ1bmN0aW9uKHBvaW50KXtcblx0XHRcdFx0XHRpZiAocG9pbnQuaGFzVmFsdWUoKSl7XG5cdFx0XHRcdFx0XHRwb2ludC5kcmF3KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0fSx0aGlzKTtcblxuXHRcdH1cblxuXHR9KTtcblxuXG5cblxuXG59KS5jYWxsKHRoaXMpOyIsIi8vISBtb21lbnQuanNcbi8vISB2ZXJzaW9uIDogMi4xMC4zXG4vLyEgYXV0aG9ycyA6IFRpbSBXb29kLCBJc2tyZW4gQ2hlcm5ldiwgTW9tZW50LmpzIGNvbnRyaWJ1dG9yc1xuLy8hIGxpY2Vuc2UgOiBNSVRcbi8vISBtb21lbnRqcy5jb21cblxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgICBnbG9iYWwubW9tZW50ID0gZmFjdG9yeSgpXG59KHRoaXMsIGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGhvb2tDYWxsYmFjaztcblxuICAgIGZ1bmN0aW9uIHV0aWxzX2hvb2tzX19ob29rcyAoKSB7XG4gICAgICAgIHJldHVybiBob29rQ2FsbGJhY2suYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGlzIGRvbmUgdG8gcmVnaXN0ZXIgdGhlIG1ldGhvZCBjYWxsZWQgd2l0aCBtb21lbnQoKVxuICAgIC8vIHdpdGhvdXQgY3JlYXRpbmcgY2lyY3VsYXIgZGVwZW5kZW5jaWVzLlxuICAgIGZ1bmN0aW9uIHNldEhvb2tDYWxsYmFjayAoY2FsbGJhY2spIHtcbiAgICAgICAgaG9va0NhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNBcnJheShpbnB1dCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RhdGUoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0IGluc3RhbmNlb2YgRGF0ZSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBEYXRlXSc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFwKGFyciwgZm4pIHtcbiAgICAgICAgdmFyIHJlcyA9IFtdLCBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICByZXMucHVzaChmbihhcnJbaV0sIGkpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhc093blByb3AoYSwgYikge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGEsIGIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4dGVuZChhLCBiKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gYikge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3AoYiwgaSkpIHtcbiAgICAgICAgICAgICAgICBhW2ldID0gYltpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNPd25Qcm9wKGIsICd0b1N0cmluZycpKSB7XG4gICAgICAgICAgICBhLnRvU3RyaW5nID0gYi50b1N0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNPd25Qcm9wKGIsICd2YWx1ZU9mJykpIHtcbiAgICAgICAgICAgIGEudmFsdWVPZiA9IGIudmFsdWVPZjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZV91dGNfX2NyZWF0ZVVUQyAoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsT3JVVEMoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QsIHRydWUpLnV0YygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmF1bHRQYXJzaW5nRmxhZ3MoKSB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gZGVlcCBjbG9uZSB0aGlzIG9iamVjdC5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVtcHR5ICAgICAgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgdW51c2VkVG9rZW5zICAgIDogW10sXG4gICAgICAgICAgICB1bnVzZWRJbnB1dCAgICAgOiBbXSxcbiAgICAgICAgICAgIG92ZXJmbG93ICAgICAgICA6IC0yLFxuICAgICAgICAgICAgY2hhcnNMZWZ0T3ZlciAgIDogMCxcbiAgICAgICAgICAgIG51bGxJbnB1dCAgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgaW52YWxpZE1vbnRoICAgIDogbnVsbCxcbiAgICAgICAgICAgIGludmFsaWRGb3JtYXQgICA6IGZhbHNlLFxuICAgICAgICAgICAgdXNlckludmFsaWRhdGVkIDogZmFsc2UsXG4gICAgICAgICAgICBpc28gICAgICAgICAgICAgOiBmYWxzZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFBhcnNpbmdGbGFncyhtKSB7XG4gICAgICAgIGlmIChtLl9wZiA9PSBudWxsKSB7XG4gICAgICAgICAgICBtLl9wZiA9IGRlZmF1bHRQYXJzaW5nRmxhZ3MoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbS5fcGY7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRfX2lzVmFsaWQobSkge1xuICAgICAgICBpZiAobS5faXNWYWxpZCA9PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgZmxhZ3MgPSBnZXRQYXJzaW5nRmxhZ3MobSk7XG4gICAgICAgICAgICBtLl9pc1ZhbGlkID0gIWlzTmFOKG0uX2QuZ2V0VGltZSgpKSAmJlxuICAgICAgICAgICAgICAgIGZsYWdzLm92ZXJmbG93IDwgMCAmJlxuICAgICAgICAgICAgICAgICFmbGFncy5lbXB0eSAmJlxuICAgICAgICAgICAgICAgICFmbGFncy5pbnZhbGlkTW9udGggJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3MubnVsbElucHV0ICYmXG4gICAgICAgICAgICAgICAgIWZsYWdzLmludmFsaWRGb3JtYXQgJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3MudXNlckludmFsaWRhdGVkO1xuXG4gICAgICAgICAgICBpZiAobS5fc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgbS5faXNWYWxpZCA9IG0uX2lzVmFsaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3MuY2hhcnNMZWZ0T3ZlciA9PT0gMCAmJlxuICAgICAgICAgICAgICAgICAgICBmbGFncy51bnVzZWRUb2tlbnMubGVuZ3RoID09PSAwICYmXG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLmJpZ0hvdXIgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbS5faXNWYWxpZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZF9fY3JlYXRlSW52YWxpZCAoZmxhZ3MpIHtcbiAgICAgICAgdmFyIG0gPSBjcmVhdGVfdXRjX19jcmVhdGVVVEMoTmFOKTtcbiAgICAgICAgaWYgKGZsYWdzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGV4dGVuZChnZXRQYXJzaW5nRmxhZ3MobSksIGZsYWdzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhtKS51c2VySW52YWxpZGF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfVxuXG4gICAgdmFyIG1vbWVudFByb3BlcnRpZXMgPSB1dGlsc19ob29rc19faG9va3MubW9tZW50UHJvcGVydGllcyA9IFtdO1xuXG4gICAgZnVuY3Rpb24gY29weUNvbmZpZyh0bywgZnJvbSkge1xuICAgICAgICB2YXIgaSwgcHJvcCwgdmFsO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5faXNBTW9tZW50T2JqZWN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2lzQU1vbWVudE9iamVjdCA9IGZyb20uX2lzQU1vbWVudE9iamVjdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2kgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5faSA9IGZyb20uX2k7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9mICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2YgPSBmcm9tLl9mO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9sID0gZnJvbS5fbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX3N0cmljdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9zdHJpY3QgPSBmcm9tLl9zdHJpY3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl90em0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fdHptID0gZnJvbS5fdHptO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5faXNVVEMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5faXNVVEMgPSBmcm9tLl9pc1VUQztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX29mZnNldCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9vZmZzZXQgPSBmcm9tLl9vZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9wZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9wZiA9IGdldFBhcnNpbmdGbGFncyhmcm9tKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2xvY2FsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9sb2NhbGUgPSBmcm9tLl9sb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9tZW50UHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGkgaW4gbW9tZW50UHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgIHByb3AgPSBtb21lbnRQcm9wZXJ0aWVzW2ldO1xuICAgICAgICAgICAgICAgIHZhbCA9IGZyb21bcHJvcF07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvW3Byb3BdID0gdmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0bztcbiAgICB9XG5cbiAgICB2YXIgdXBkYXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuXG4gICAgLy8gTW9tZW50IHByb3RvdHlwZSBvYmplY3RcbiAgICBmdW5jdGlvbiBNb21lbnQoY29uZmlnKSB7XG4gICAgICAgIGNvcHlDb25maWcodGhpcywgY29uZmlnKTtcbiAgICAgICAgdGhpcy5fZCA9IG5ldyBEYXRlKCtjb25maWcuX2QpO1xuICAgICAgICAvLyBQcmV2ZW50IGluZmluaXRlIGxvb3AgaW4gY2FzZSB1cGRhdGVPZmZzZXQgY3JlYXRlcyBuZXcgbW9tZW50XG4gICAgICAgIC8vIG9iamVjdHMuXG4gICAgICAgIGlmICh1cGRhdGVJblByb2dyZXNzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdXBkYXRlSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KHRoaXMpO1xuICAgICAgICAgICAgdXBkYXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNNb21lbnQgKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgTW9tZW50IHx8IChvYmogIT0gbnVsbCAmJiBvYmouX2lzQU1vbWVudE9iamVjdCAhPSBudWxsKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0ludChhcmd1bWVudEZvckNvZXJjaW9uKSB7XG4gICAgICAgIHZhciBjb2VyY2VkTnVtYmVyID0gK2FyZ3VtZW50Rm9yQ29lcmNpb24sXG4gICAgICAgICAgICB2YWx1ZSA9IDA7XG5cbiAgICAgICAgaWYgKGNvZXJjZWROdW1iZXIgIT09IDAgJiYgaXNGaW5pdGUoY29lcmNlZE51bWJlcikpIHtcbiAgICAgICAgICAgIGlmIChjb2VyY2VkTnVtYmVyID49IDApIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IE1hdGguZmxvb3IoY29lcmNlZE51bWJlcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gTWF0aC5jZWlsKGNvZXJjZWROdW1iZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXBhcmVBcnJheXMoYXJyYXkxLCBhcnJheTIsIGRvbnRDb252ZXJ0KSB7XG4gICAgICAgIHZhciBsZW4gPSBNYXRoLm1pbihhcnJheTEubGVuZ3RoLCBhcnJheTIubGVuZ3RoKSxcbiAgICAgICAgICAgIGxlbmd0aERpZmYgPSBNYXRoLmFicyhhcnJheTEubGVuZ3RoIC0gYXJyYXkyLmxlbmd0aCksXG4gICAgICAgICAgICBkaWZmcyA9IDAsXG4gICAgICAgICAgICBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgoZG9udENvbnZlcnQgJiYgYXJyYXkxW2ldICE9PSBhcnJheTJbaV0pIHx8XG4gICAgICAgICAgICAgICAgKCFkb250Q29udmVydCAmJiB0b0ludChhcnJheTFbaV0pICE9PSB0b0ludChhcnJheTJbaV0pKSkge1xuICAgICAgICAgICAgICAgIGRpZmZzKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpZmZzICsgbGVuZ3RoRGlmZjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBMb2NhbGUoKSB7XG4gICAgfVxuXG4gICAgdmFyIGxvY2FsZXMgPSB7fTtcbiAgICB2YXIgZ2xvYmFsTG9jYWxlO1xuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplTG9jYWxlKGtleSkge1xuICAgICAgICByZXR1cm4ga2V5ID8ga2V5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnXycsICctJykgOiBrZXk7XG4gICAgfVxuXG4gICAgLy8gcGljayB0aGUgbG9jYWxlIGZyb20gdGhlIGFycmF5XG4gICAgLy8gdHJ5IFsnZW4tYXUnLCAnZW4tZ2InXSBhcyAnZW4tYXUnLCAnZW4tZ2InLCAnZW4nLCBhcyBpbiBtb3ZlIHRocm91Z2ggdGhlIGxpc3QgdHJ5aW5nIGVhY2hcbiAgICAvLyBzdWJzdHJpbmcgZnJvbSBtb3N0IHNwZWNpZmljIHRvIGxlYXN0LCBidXQgbW92ZSB0byB0aGUgbmV4dCBhcnJheSBpdGVtIGlmIGl0J3MgYSBtb3JlIHNwZWNpZmljIHZhcmlhbnQgdGhhbiB0aGUgY3VycmVudCByb290XG4gICAgZnVuY3Rpb24gY2hvb3NlTG9jYWxlKG5hbWVzKSB7XG4gICAgICAgIHZhciBpID0gMCwgaiwgbmV4dCwgbG9jYWxlLCBzcGxpdDtcblxuICAgICAgICB3aGlsZSAoaSA8IG5hbWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgc3BsaXQgPSBub3JtYWxpemVMb2NhbGUobmFtZXNbaV0pLnNwbGl0KCctJyk7XG4gICAgICAgICAgICBqID0gc3BsaXQubGVuZ3RoO1xuICAgICAgICAgICAgbmV4dCA9IG5vcm1hbGl6ZUxvY2FsZShuYW1lc1tpICsgMV0pO1xuICAgICAgICAgICAgbmV4dCA9IG5leHQgPyBuZXh0LnNwbGl0KCctJykgOiBudWxsO1xuICAgICAgICAgICAgd2hpbGUgKGogPiAwKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxlID0gbG9hZExvY2FsZShzcGxpdC5zbGljZSgwLCBqKS5qb2luKCctJykpO1xuICAgICAgICAgICAgICAgIGlmIChsb2NhbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5leHQgJiYgbmV4dC5sZW5ndGggPj0gaiAmJiBjb21wYXJlQXJyYXlzKHNwbGl0LCBuZXh0LCB0cnVlKSA+PSBqIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvL3RoZSBuZXh0IGFycmF5IGl0ZW0gaXMgYmV0dGVyIHRoYW4gYSBzaGFsbG93ZXIgc3Vic3RyaW5nIG9mIHRoaXMgb25lXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBqLS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZExvY2FsZShuYW1lKSB7XG4gICAgICAgIHZhciBvbGRMb2NhbGUgPSBudWxsO1xuICAgICAgICAvLyBUT0RPOiBGaW5kIGEgYmV0dGVyIHdheSB0byByZWdpc3RlciBhbmQgbG9hZCBhbGwgdGhlIGxvY2FsZXMgaW4gTm9kZVxuICAgICAgICBpZiAoIWxvY2FsZXNbbmFtZV0gJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICBtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgb2xkTG9jYWxlID0gZ2xvYmFsTG9jYWxlLl9hYmJyO1xuICAgICAgICAgICAgICAgIHJlcXVpcmUoJy4vbG9jYWxlLycgKyBuYW1lKTtcbiAgICAgICAgICAgICAgICAvLyBiZWNhdXNlIGRlZmluZUxvY2FsZSBjdXJyZW50bHkgYWxzbyBzZXRzIHRoZSBnbG9iYWwgbG9jYWxlLCB3ZVxuICAgICAgICAgICAgICAgIC8vIHdhbnQgdG8gdW5kbyB0aGF0IGZvciBsYXp5IGxvYWRlZCBsb2NhbGVzXG4gICAgICAgICAgICAgICAgbG9jYWxlX2xvY2FsZXNfX2dldFNldEdsb2JhbExvY2FsZShvbGRMb2NhbGUpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkgeyB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG4gICAgfVxuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGxvYWQgbG9jYWxlIGFuZCB0aGVuIHNldCB0aGUgZ2xvYmFsIGxvY2FsZS4gIElmXG4gICAgLy8gbm8gYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4sIGl0IHdpbGwgc2ltcGx5IHJldHVybiB0aGUgY3VycmVudCBnbG9iYWxcbiAgICAvLyBsb2NhbGUga2V5LlxuICAgIGZ1bmN0aW9uIGxvY2FsZV9sb2NhbGVzX19nZXRTZXRHbG9iYWxMb2NhbGUgKGtleSwgdmFsdWVzKSB7XG4gICAgICAgIHZhciBkYXRhO1xuICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZShrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRlZmluZUxvY2FsZShrZXksIHZhbHVlcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gbW9tZW50LmR1cmF0aW9uLl9sb2NhbGUgPSBtb21lbnQuX2xvY2FsZSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgZ2xvYmFsTG9jYWxlID0gZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBnbG9iYWxMb2NhbGUuX2FiYnI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmaW5lTG9jYWxlIChuYW1lLCB2YWx1ZXMpIHtcbiAgICAgICAgaWYgKHZhbHVlcyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFsdWVzLmFiYnIgPSBuYW1lO1xuICAgICAgICAgICAgaWYgKCFsb2NhbGVzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxlc1tuYW1lXSA9IG5ldyBMb2NhbGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvY2FsZXNbbmFtZV0uc2V0KHZhbHVlcyk7XG5cbiAgICAgICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXQgZm9yIG5vdzogYWxzbyBzZXQgdGhlIGxvY2FsZVxuICAgICAgICAgICAgbG9jYWxlX2xvY2FsZXNfX2dldFNldEdsb2JhbExvY2FsZShuYW1lKTtcblxuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB1c2VmdWwgZm9yIHRlc3RpbmdcbiAgICAgICAgICAgIGRlbGV0ZSBsb2NhbGVzW25hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZXR1cm5zIGxvY2FsZSBkYXRhXG4gICAgZnVuY3Rpb24gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZSAoa2V5KSB7XG4gICAgICAgIHZhciBsb2NhbGU7XG5cbiAgICAgICAgaWYgKGtleSAmJiBrZXkuX2xvY2FsZSAmJiBrZXkuX2xvY2FsZS5fYWJicikge1xuICAgICAgICAgICAga2V5ID0ga2V5Ll9sb2NhbGUuX2FiYnI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbExvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAgICAvL3Nob3J0LWNpcmN1aXQgZXZlcnl0aGluZyBlbHNlXG4gICAgICAgICAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKGtleSk7XG4gICAgICAgICAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleSA9IFtrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNob29zZUxvY2FsZShrZXkpO1xuICAgIH1cblxuICAgIHZhciBhbGlhc2VzID0ge307XG5cbiAgICBmdW5jdGlvbiBhZGRVbml0QWxpYXMgKHVuaXQsIHNob3J0aGFuZCkge1xuICAgICAgICB2YXIgbG93ZXJDYXNlID0gdW5pdC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBhbGlhc2VzW2xvd2VyQ2FzZV0gPSBhbGlhc2VzW2xvd2VyQ2FzZSArICdzJ10gPSBhbGlhc2VzW3Nob3J0aGFuZF0gPSB1bml0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZVVuaXRzKHVuaXRzKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdW5pdHMgPT09ICdzdHJpbmcnID8gYWxpYXNlc1t1bml0c10gfHwgYWxpYXNlc1t1bml0cy50b0xvd2VyQ2FzZSgpXSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVPYmplY3RVbml0cyhpbnB1dE9iamVjdCkge1xuICAgICAgICB2YXIgbm9ybWFsaXplZElucHV0ID0ge30sXG4gICAgICAgICAgICBub3JtYWxpemVkUHJvcCxcbiAgICAgICAgICAgIHByb3A7XG5cbiAgICAgICAgZm9yIChwcm9wIGluIGlucHV0T2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChpbnB1dE9iamVjdCwgcHJvcCkpIHtcbiAgICAgICAgICAgICAgICBub3JtYWxpemVkUHJvcCA9IG5vcm1hbGl6ZVVuaXRzKHByb3ApO1xuICAgICAgICAgICAgICAgIGlmIChub3JtYWxpemVkUHJvcCkge1xuICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkSW5wdXRbbm9ybWFsaXplZFByb3BdID0gaW5wdXRPYmplY3RbcHJvcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWRJbnB1dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlR2V0U2V0ICh1bml0LCBrZWVwVGltZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGdldF9zZXRfX3NldCh0aGlzLCB1bml0LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldCh0aGlzLCBrZWVwVGltZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRfc2V0X19nZXQodGhpcywgdW5pdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0X3NldF9fZ2V0IChtb20sIHVuaXQpIHtcbiAgICAgICAgcmV0dXJuIG1vbS5fZFsnZ2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldF9zZXRfX3NldCAobW9tLCB1bml0LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gbW9tLl9kWydzZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArIHVuaXRdKHZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXQgKHVuaXRzLCB2YWx1ZSkge1xuICAgICAgICB2YXIgdW5pdDtcbiAgICAgICAgaWYgKHR5cGVvZiB1bml0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGZvciAodW5pdCBpbiB1bml0cykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0KHVuaXQsIHVuaXRzW3VuaXRdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzW3VuaXRzXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW3VuaXRzXSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gemVyb0ZpbGwobnVtYmVyLCB0YXJnZXRMZW5ndGgsIGZvcmNlU2lnbikge1xuICAgICAgICB2YXIgb3V0cHV0ID0gJycgKyBNYXRoLmFicyhudW1iZXIpLFxuICAgICAgICAgICAgc2lnbiA9IG51bWJlciA+PSAwO1xuXG4gICAgICAgIHdoaWxlIChvdXRwdXQubGVuZ3RoIDwgdGFyZ2V0TGVuZ3RoKSB7XG4gICAgICAgICAgICBvdXRwdXQgPSAnMCcgKyBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChzaWduID8gKGZvcmNlU2lnbiA/ICcrJyA6ICcnKSA6ICctJykgKyBvdXRwdXQ7XG4gICAgfVxuXG4gICAgdmFyIGZvcm1hdHRpbmdUb2tlbnMgPSAvKFxcW1teXFxbXSpcXF0pfChcXFxcKT8oTW98TU0/TT9NP3xEb3xERERvfEREP0Q/RD98ZGRkP2Q/fGRvP3x3W298d10/fFdbb3xXXT98UXxZWVlZWVl8WVlZWVl8WVlZWXxZWXxnZyhnZ2c/KT98R0coR0dHPyk/fGV8RXxhfEF8aGg/fEhIP3xtbT98c3M/fFN7MSw0fXx4fFh8eno/fFpaP3wuKS9nO1xuXG4gICAgdmFyIGxvY2FsRm9ybWF0dGluZ1Rva2VucyA9IC8oXFxbW15cXFtdKlxcXSl8KFxcXFwpPyhMVFN8TFR8TEw/TD9MP3xsezEsNH0pL2c7XG5cbiAgICB2YXIgZm9ybWF0RnVuY3Rpb25zID0ge307XG5cbiAgICB2YXIgZm9ybWF0VG9rZW5GdW5jdGlvbnMgPSB7fTtcblxuICAgIC8vIHRva2VuOiAgICAnTSdcbiAgICAvLyBwYWRkZWQ6ICAgWydNTScsIDJdXG4gICAgLy8gb3JkaW5hbDogICdNbydcbiAgICAvLyBjYWxsYmFjazogZnVuY3Rpb24gKCkgeyB0aGlzLm1vbnRoKCkgKyAxIH1cbiAgICBmdW5jdGlvbiBhZGRGb3JtYXRUb2tlbiAodG9rZW4sIHBhZGRlZCwgb3JkaW5hbCwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGZ1bmMgPSBjYWxsYmFjaztcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGZ1bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNbY2FsbGJhY2tdKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbdG9rZW5dID0gZnVuYztcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFkZGVkKSB7XG4gICAgICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1twYWRkZWRbMF1dID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB6ZXJvRmlsbChmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHBhZGRlZFsxXSwgcGFkZGVkWzJdKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9yZGluYWwpIHtcbiAgICAgICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW29yZGluYWxdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5vcmRpbmFsKGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgdG9rZW4pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUZvcm1hdHRpbmdUb2tlbnMoaW5wdXQpIHtcbiAgICAgICAgaWYgKGlucHV0Lm1hdGNoKC9cXFtbXFxzXFxTXS8pKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvXlxcW3xcXF0kL2csICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvXFxcXC9nLCAnJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUZvcm1hdEZ1bmN0aW9uKGZvcm1hdCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBmb3JtYXQubWF0Y2goZm9ybWF0dGluZ1Rva2VucyksIGksIGxlbmd0aDtcblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZvcm1hdFRva2VuRnVuY3Rpb25zW2FycmF5W2ldXSkge1xuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gZm9ybWF0VG9rZW5GdW5jdGlvbnNbYXJyYXlbaV1dO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IHJlbW92ZUZvcm1hdHRpbmdUb2tlbnMoYXJyYXlbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChtb20pIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSAnJztcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSBhcnJheVtpXSBpbnN0YW5jZW9mIEZ1bmN0aW9uID8gYXJyYXlbaV0uY2FsbChtb20sIGZvcm1hdCkgOiBhcnJheVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gZm9ybWF0IGRhdGUgdXNpbmcgbmF0aXZlIGRhdGUgb2JqZWN0XG4gICAgZnVuY3Rpb24gZm9ybWF0TW9tZW50KG0sIGZvcm1hdCkge1xuICAgICAgICBpZiAoIW0uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbS5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1hdCA9IGV4cGFuZEZvcm1hdChmb3JtYXQsIG0ubG9jYWxlRGF0YSgpKTtcblxuICAgICAgICBpZiAoIWZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdKSB7XG4gICAgICAgICAgICBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSA9IG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdKG0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4cGFuZEZvcm1hdChmb3JtYXQsIGxvY2FsZSkge1xuICAgICAgICB2YXIgaSA9IDU7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVwbGFjZUxvbmdEYXRlRm9ybWF0VG9rZW5zKGlucHV0KSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxlLmxvbmdEYXRlRm9ybWF0KGlucHV0KSB8fCBpbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvY2FsRm9ybWF0dGluZ1Rva2Vucy5sYXN0SW5kZXggPSAwO1xuICAgICAgICB3aGlsZSAoaSA+PSAwICYmIGxvY2FsRm9ybWF0dGluZ1Rva2Vucy50ZXN0KGZvcm1hdCkpIHtcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKGxvY2FsRm9ybWF0dGluZ1Rva2VucywgcmVwbGFjZUxvbmdEYXRlRm9ybWF0VG9rZW5zKTtcbiAgICAgICAgICAgIGxvY2FsRm9ybWF0dGluZ1Rva2Vucy5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgaSAtPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvcm1hdDtcbiAgICB9XG5cbiAgICB2YXIgbWF0Y2gxICAgICAgICAgPSAvXFxkLzsgICAgICAgICAgICAvLyAgICAgICAwIC0gOVxuICAgIHZhciBtYXRjaDIgICAgICAgICA9IC9cXGRcXGQvOyAgICAgICAgICAvLyAgICAgIDAwIC0gOTlcbiAgICB2YXIgbWF0Y2gzICAgICAgICAgPSAvXFxkezN9LzsgICAgICAgICAvLyAgICAgMDAwIC0gOTk5XG4gICAgdmFyIG1hdGNoNCAgICAgICAgID0gL1xcZHs0fS87ICAgICAgICAgLy8gICAgMDAwMCAtIDk5OTlcbiAgICB2YXIgbWF0Y2g2ICAgICAgICAgPSAvWystXT9cXGR7Nn0vOyAgICAvLyAtOTk5OTk5IC0gOTk5OTk5XG4gICAgdmFyIG1hdGNoMXRvMiAgICAgID0gL1xcZFxcZD8vOyAgICAgICAgIC8vICAgICAgIDAgLSA5OVxuICAgIHZhciBtYXRjaDF0bzMgICAgICA9IC9cXGR7MSwzfS87ICAgICAgIC8vICAgICAgIDAgLSA5OTlcbiAgICB2YXIgbWF0Y2gxdG80ICAgICAgPSAvXFxkezEsNH0vOyAgICAgICAvLyAgICAgICAwIC0gOTk5OVxuICAgIHZhciBtYXRjaDF0bzYgICAgICA9IC9bKy1dP1xcZHsxLDZ9LzsgIC8vIC05OTk5OTkgLSA5OTk5OTlcblxuICAgIHZhciBtYXRjaFVuc2lnbmVkICA9IC9cXGQrLzsgICAgICAgICAgIC8vICAgICAgIDAgLSBpbmZcbiAgICB2YXIgbWF0Y2hTaWduZWQgICAgPSAvWystXT9cXGQrLzsgICAgICAvLyAgICAtaW5mIC0gaW5mXG5cbiAgICB2YXIgbWF0Y2hPZmZzZXQgICAgPSAvWnxbKy1dXFxkXFxkOj9cXGRcXGQvZ2k7IC8vICswMDowMCAtMDA6MDAgKzAwMDAgLTAwMDAgb3IgWlxuXG4gICAgdmFyIG1hdGNoVGltZXN0YW1wID0gL1srLV0/XFxkKyhcXC5cXGR7MSwzfSk/LzsgLy8gMTIzNDU2Nzg5IDEyMzQ1Njc4OS4xMjNcblxuICAgIC8vIGFueSB3b3JkIChvciB0d28pIGNoYXJhY3RlcnMgb3IgbnVtYmVycyBpbmNsdWRpbmcgdHdvL3RocmVlIHdvcmQgbW9udGggaW4gYXJhYmljLlxuICAgIHZhciBtYXRjaFdvcmQgPSAvWzAtOV0qWydhLXpcXHUwMEEwLVxcdTA1RkZcXHUwNzAwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdK3xbXFx1MDYwMC1cXHUwNkZGXFwvXSsoXFxzKj9bXFx1MDYwMC1cXHUwNkZGXSspezEsMn0vaTtcblxuICAgIHZhciByZWdleGVzID0ge307XG5cbiAgICBmdW5jdGlvbiBhZGRSZWdleFRva2VuICh0b2tlbiwgcmVnZXgsIHN0cmljdFJlZ2V4KSB7XG4gICAgICAgIHJlZ2V4ZXNbdG9rZW5dID0gdHlwZW9mIHJlZ2V4ID09PSAnZnVuY3Rpb24nID8gcmVnZXggOiBmdW5jdGlvbiAoaXNTdHJpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiAoaXNTdHJpY3QgJiYgc3RyaWN0UmVnZXgpID8gc3RyaWN0UmVnZXggOiByZWdleDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4gKHRva2VuLCBjb25maWcpIHtcbiAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHJlZ2V4ZXMsIHRva2VuKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAodW5lc2NhcGVGb3JtYXQodG9rZW4pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZWdleGVzW3Rva2VuXShjb25maWcuX3N0cmljdCwgY29uZmlnLl9sb2NhbGUpO1xuICAgIH1cblxuICAgIC8vIENvZGUgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM1NjE0OTMvaXMtdGhlcmUtYS1yZWdleHAtZXNjYXBlLWZ1bmN0aW9uLWluLWphdmFzY3JpcHRcbiAgICBmdW5jdGlvbiB1bmVzY2FwZUZvcm1hdChzKSB7XG4gICAgICAgIHJldHVybiBzLnJlcGxhY2UoJ1xcXFwnLCAnJykucmVwbGFjZSgvXFxcXChcXFspfFxcXFwoXFxdKXxcXFsoW15cXF1cXFtdKilcXF18XFxcXCguKS9nLCBmdW5jdGlvbiAobWF0Y2hlZCwgcDEsIHAyLCBwMywgcDQpIHtcbiAgICAgICAgICAgIHJldHVybiBwMSB8fCBwMiB8fCBwMyB8fCBwNDtcbiAgICAgICAgfSkucmVwbGFjZSgvWy1cXC9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCAnXFxcXCQmJyk7XG4gICAgfVxuXG4gICAgdmFyIHRva2VucyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gYWRkUGFyc2VUb2tlbiAodG9rZW4sIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBpLCBmdW5jID0gY2FsbGJhY2s7XG4gICAgICAgIGlmICh0eXBlb2YgdG9rZW4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0b2tlbiA9IFt0b2tlbl07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGZ1bmMgPSBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbY2FsbGJhY2tdID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdG9rZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRva2Vuc1t0b2tlbltpXV0gPSBmdW5jO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkV2Vla1BhcnNlVG9rZW4gKHRva2VuLCBjYWxsYmFjaykge1xuICAgICAgICBhZGRQYXJzZVRva2VuKHRva2VuLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgICAgICBjb25maWcuX3cgPSBjb25maWcuX3cgfHwge307XG4gICAgICAgICAgICBjYWxsYmFjayhpbnB1dCwgY29uZmlnLl93LCBjb25maWcsIHRva2VuKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkVGltZVRvQXJyYXlGcm9tVG9rZW4odG9rZW4sIGlucHV0LCBjb25maWcpIHtcbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwgJiYgaGFzT3duUHJvcCh0b2tlbnMsIHRva2VuKSkge1xuICAgICAgICAgICAgdG9rZW5zW3Rva2VuXShpbnB1dCwgY29uZmlnLl9hLCBjb25maWcsIHRva2VuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBZRUFSID0gMDtcbiAgICB2YXIgTU9OVEggPSAxO1xuICAgIHZhciBEQVRFID0gMjtcbiAgICB2YXIgSE9VUiA9IDM7XG4gICAgdmFyIE1JTlVURSA9IDQ7XG4gICAgdmFyIFNFQ09ORCA9IDU7XG4gICAgdmFyIE1JTExJU0VDT05EID0gNjtcblxuICAgIGZ1bmN0aW9uIGRheXNJbk1vbnRoKHllYXIsIG1vbnRoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQyh5ZWFyLCBtb250aCArIDEsIDApKS5nZXRVVENEYXRlKCk7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ00nLCBbJ01NJywgMl0sICdNbycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9udGgoKSArIDE7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignTU1NJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubW9udGhzU2hvcnQodGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdNTU1NJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubW9udGhzKHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ21vbnRoJywgJ00nKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ00nLCAgICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ01NJywgICBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignTU1NJywgIG1hdGNoV29yZCk7XG4gICAgYWRkUmVnZXhUb2tlbignTU1NTScsIG1hdGNoV29yZCk7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnTScsICdNTSddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W01PTlRIXSA9IHRvSW50KGlucHV0KSAtIDE7XG4gICAgfSk7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnTU1NJywgJ01NTU0nXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB2YXIgbW9udGggPSBjb25maWcuX2xvY2FsZS5tb250aHNQYXJzZShpbnB1dCwgdG9rZW4sIGNvbmZpZy5fc3RyaWN0KTtcbiAgICAgICAgLy8gaWYgd2UgZGlkbid0IGZpbmQgYSBtb250aCBuYW1lLCBtYXJrIHRoZSBkYXRlIGFzIGludmFsaWQuXG4gICAgICAgIGlmIChtb250aCAhPSBudWxsKSB7XG4gICAgICAgICAgICBhcnJheVtNT05USF0gPSBtb250aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmludmFsaWRNb250aCA9IGlucHV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZU1vbnRocyA9ICdKYW51YXJ5X0ZlYnJ1YXJ5X01hcmNoX0FwcmlsX01heV9KdW5lX0p1bHlfQXVndXN0X1NlcHRlbWJlcl9PY3RvYmVyX05vdmVtYmVyX0RlY2VtYmVyJy5zcGxpdCgnXycpO1xuICAgIGZ1bmN0aW9uIGxvY2FsZU1vbnRocyAobSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzW20ubW9udGgoKV07XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVNb250aHNTaG9ydCA9ICdKYW5fRmViX01hcl9BcHJfTWF5X0p1bl9KdWxfQXVnX1NlcF9PY3RfTm92X0RlYycuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVNb250aHNTaG9ydCAobSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU2hvcnRbbS5tb250aCgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVNb250aHNQYXJzZSAobW9udGhOYW1lLCBmb3JtYXQsIHN0cmljdCkge1xuICAgICAgICB2YXIgaSwgbW9tLCByZWdleDtcblxuICAgICAgICBpZiAoIXRoaXMuX21vbnRoc1BhcnNlKSB7XG4gICAgICAgICAgICB0aGlzLl9tb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgICAgICBtb20gPSBjcmVhdGVfdXRjX19jcmVhdGVVVEMoWzIwMDAsIGldKTtcbiAgICAgICAgICAgIGlmIChzdHJpY3QgJiYgIXRoaXMuX2xvbmdNb250aHNQYXJzZVtpXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy5tb250aHMobW9tLCAnJykucmVwbGFjZSgnLicsICcnKSArICckJywgJ2knKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnJykgKyAnJCcsICdpJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXN0cmljdCAmJiAhdGhpcy5fbW9udGhzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICByZWdleCA9ICdeJyArIHRoaXMubW9udGhzKG1vbSwgJycpICsgJ3xeJyArIHRoaXMubW9udGhzU2hvcnQobW9tLCAnJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKHJlZ2V4LnJlcGxhY2UoJy4nLCAnJyksICdpJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiBmb3JtYXQgPT09ICdNTU1NJyAmJiB0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0udGVzdChtb250aE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0cmljdCAmJiBmb3JtYXQgPT09ICdNTU0nICYmIHRoaXMuX3Nob3J0TW9udGhzUGFyc2VbaV0udGVzdChtb250aE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzdHJpY3QgJiYgdGhpcy5fbW9udGhzUGFyc2VbaV0udGVzdChtb250aE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBzZXRNb250aCAobW9tLCB2YWx1ZSkge1xuICAgICAgICB2YXIgZGF5T2ZNb250aDtcblxuICAgICAgICAvLyBUT0RPOiBNb3ZlIHRoaXMgb3V0IG9mIGhlcmUhXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG1vbS5sb2NhbGVEYXRhKCkubW9udGhzUGFyc2UodmFsdWUpO1xuICAgICAgICAgICAgLy8gVE9ETzogQW5vdGhlciBzaWxlbnQgZmFpbHVyZT9cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGRheU9mTW9udGggPSBNYXRoLm1pbihtb20uZGF0ZSgpLCBkYXlzSW5Nb250aChtb20ueWVhcigpLCB2YWx1ZSkpO1xuICAgICAgICBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgJ01vbnRoJ10odmFsdWUsIGRheU9mTW9udGgpO1xuICAgICAgICByZXR1cm4gbW9tO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldE1vbnRoICh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgc2V0TW9udGgodGhpcywgdmFsdWUpO1xuICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldCh0aGlzLCB0cnVlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGdldF9zZXRfX2dldCh0aGlzLCAnTW9udGgnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERheXNJbk1vbnRoICgpIHtcbiAgICAgICAgcmV0dXJuIGRheXNJbk1vbnRoKHRoaXMueWVhcigpLCB0aGlzLm1vbnRoKCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrT3ZlcmZsb3cgKG0pIHtcbiAgICAgICAgdmFyIG92ZXJmbG93O1xuICAgICAgICB2YXIgYSA9IG0uX2E7XG5cbiAgICAgICAgaWYgKGEgJiYgZ2V0UGFyc2luZ0ZsYWdzKG0pLm92ZXJmbG93ID09PSAtMikge1xuICAgICAgICAgICAgb3ZlcmZsb3cgPVxuICAgICAgICAgICAgICAgIGFbTU9OVEhdICAgICAgIDwgMCB8fCBhW01PTlRIXSAgICAgICA+IDExICA/IE1PTlRIIDpcbiAgICAgICAgICAgICAgICBhW0RBVEVdICAgICAgICA8IDEgfHwgYVtEQVRFXSAgICAgICAgPiBkYXlzSW5Nb250aChhW1lFQVJdLCBhW01PTlRIXSkgPyBEQVRFIDpcbiAgICAgICAgICAgICAgICBhW0hPVVJdICAgICAgICA8IDAgfHwgYVtIT1VSXSAgICAgICAgPiAyNCB8fCAoYVtIT1VSXSA9PT0gMjQgJiYgKGFbTUlOVVRFXSAhPT0gMCB8fCBhW1NFQ09ORF0gIT09IDAgfHwgYVtNSUxMSVNFQ09ORF0gIT09IDApKSA/IEhPVVIgOlxuICAgICAgICAgICAgICAgIGFbTUlOVVRFXSAgICAgIDwgMCB8fCBhW01JTlVURV0gICAgICA+IDU5ICA/IE1JTlVURSA6XG4gICAgICAgICAgICAgICAgYVtTRUNPTkRdICAgICAgPCAwIHx8IGFbU0VDT05EXSAgICAgID4gNTkgID8gU0VDT05EIDpcbiAgICAgICAgICAgICAgICBhW01JTExJU0VDT05EXSA8IDAgfHwgYVtNSUxMSVNFQ09ORF0gPiA5OTkgPyBNSUxMSVNFQ09ORCA6XG4gICAgICAgICAgICAgICAgLTE7XG5cbiAgICAgICAgICAgIGlmIChnZXRQYXJzaW5nRmxhZ3MobSkuX292ZXJmbG93RGF5T2ZZZWFyICYmIChvdmVyZmxvdyA8IFlFQVIgfHwgb3ZlcmZsb3cgPiBEQVRFKSkge1xuICAgICAgICAgICAgICAgIG92ZXJmbG93ID0gREFURTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKG0pLm92ZXJmbG93ID0gb3ZlcmZsb3c7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3YXJuKG1zZykge1xuICAgICAgICBpZiAodXRpbHNfaG9va3NfX2hvb2tzLnN1cHByZXNzRGVwcmVjYXRpb25XYXJuaW5ncyA9PT0gZmFsc2UgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdEZXByZWNhdGlvbiB3YXJuaW5nOiAnICsgbXNnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlcHJlY2F0ZShtc2csIGZuKSB7XG4gICAgICAgIHZhciBmaXJzdFRpbWUgPSB0cnVlLFxuICAgICAgICAgICAgbXNnV2l0aFN0YWNrID0gbXNnICsgJ1xcbicgKyAobmV3IEVycm9yKCkpLnN0YWNrO1xuXG4gICAgICAgIHJldHVybiBleHRlbmQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGZpcnN0VGltZSkge1xuICAgICAgICAgICAgICAgIHdhcm4obXNnV2l0aFN0YWNrKTtcbiAgICAgICAgICAgICAgICBmaXJzdFRpbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LCBmbik7XG4gICAgfVxuXG4gICAgdmFyIGRlcHJlY2F0aW9ucyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gZGVwcmVjYXRlU2ltcGxlKG5hbWUsIG1zZykge1xuICAgICAgICBpZiAoIWRlcHJlY2F0aW9uc1tuYW1lXSkge1xuICAgICAgICAgICAgd2Fybihtc2cpO1xuICAgICAgICAgICAgZGVwcmVjYXRpb25zW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5zdXBwcmVzc0RlcHJlY2F0aW9uV2FybmluZ3MgPSBmYWxzZTtcblxuICAgIHZhciBmcm9tX3N0cmluZ19faXNvUmVnZXggPSAvXlxccyooPzpbKy1dXFxkezZ9fFxcZHs0fSktKD86KFxcZFxcZC1cXGRcXGQpfChXXFxkXFxkJCl8KFdcXGRcXGQtXFxkKXwoXFxkXFxkXFxkKSkoKFR8ICkoXFxkXFxkKDpcXGRcXGQoOlxcZFxcZChcXC5cXGQrKT8pPyk/KT8oW1xcK1xcLV1cXGRcXGQoPzo6P1xcZFxcZCk/fFxccypaKT8pPyQvO1xuXG4gICAgdmFyIGlzb0RhdGVzID0gW1xuICAgICAgICBbJ1lZWVlZWS1NTS1ERCcsIC9bKy1dXFxkezZ9LVxcZHsyfS1cXGR7Mn0vXSxcbiAgICAgICAgWydZWVlZLU1NLUREJywgL1xcZHs0fS1cXGR7Mn0tXFxkezJ9L10sXG4gICAgICAgIFsnR0dHRy1bV11XVy1FJywgL1xcZHs0fS1XXFxkezJ9LVxcZC9dLFxuICAgICAgICBbJ0dHR0ctW1ddV1cnLCAvXFxkezR9LVdcXGR7Mn0vXSxcbiAgICAgICAgWydZWVlZLURERCcsIC9cXGR7NH0tXFxkezN9L11cbiAgICBdO1xuXG4gICAgLy8gaXNvIHRpbWUgZm9ybWF0cyBhbmQgcmVnZXhlc1xuICAgIHZhciBpc29UaW1lcyA9IFtcbiAgICAgICAgWydISDptbTpzcy5TU1NTJywgLyhUfCApXFxkXFxkOlxcZFxcZDpcXGRcXGRcXC5cXGQrL10sXG4gICAgICAgIFsnSEg6bW06c3MnLCAvKFR8IClcXGRcXGQ6XFxkXFxkOlxcZFxcZC9dLFxuICAgICAgICBbJ0hIOm1tJywgLyhUfCApXFxkXFxkOlxcZFxcZC9dLFxuICAgICAgICBbJ0hIJywgLyhUfCApXFxkXFxkL11cbiAgICBdO1xuXG4gICAgdmFyIGFzcE5ldEpzb25SZWdleCA9IC9eXFwvP0RhdGVcXCgoXFwtP1xcZCspL2k7XG5cbiAgICAvLyBkYXRlIGZyb20gaXNvIGZvcm1hdFxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21JU08oY29uZmlnKSB7XG4gICAgICAgIHZhciBpLCBsLFxuICAgICAgICAgICAgc3RyaW5nID0gY29uZmlnLl9pLFxuICAgICAgICAgICAgbWF0Y2ggPSBmcm9tX3N0cmluZ19faXNvUmVnZXguZXhlYyhzdHJpbmcpO1xuXG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaXNvID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSBpc29EYXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNvRGF0ZXNbaV1bMV0uZXhlYyhzdHJpbmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoWzVdIHNob3VsZCBiZSAnVCcgb3IgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5fZiA9IGlzb0RhdGVzW2ldWzBdICsgKG1hdGNoWzZdIHx8ICcgJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSBpc29UaW1lcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNvVGltZXNbaV1bMV0uZXhlYyhzdHJpbmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5fZiArPSBpc29UaW1lc1tpXVswXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0cmluZy5tYXRjaChtYXRjaE9mZnNldCkpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX2YgKz0gJ1onO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkYXRlIGZyb20gaXNvIGZvcm1hdCBvciBmYWxsYmFja1xuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21TdHJpbmcoY29uZmlnKSB7XG4gICAgICAgIHZhciBtYXRjaGVkID0gYXNwTmV0SnNvblJlZ2V4LmV4ZWMoY29uZmlnLl9pKTtcblxuICAgICAgICBpZiAobWF0Y2hlZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoK21hdGNoZWRbMV0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnRnJvbUlTTyhjb25maWcpO1xuICAgICAgICBpZiAoY29uZmlnLl9pc1ZhbGlkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgZGVsZXRlIGNvbmZpZy5faXNWYWxpZDtcbiAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayhjb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50IGNvbnN0cnVjdGlvbiBmYWxscyBiYWNrIHRvIGpzIERhdGUuIFRoaXMgaXMgJyArXG4gICAgICAgICdkaXNjb3VyYWdlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHVwY29taW5nIG1ham9yICcgK1xuICAgICAgICAncmVsZWFzZS4gUGxlYXNlIHJlZmVyIHRvICcgK1xuICAgICAgICAnaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE0MDcgZm9yIG1vcmUgaW5mby4nLFxuICAgICAgICBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShjb25maWcuX2kgKyAoY29uZmlnLl91c2VVVEMgPyAnIFVUQycgOiAnJykpO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZURhdGUgKHksIG0sIGQsIGgsIE0sIHMsIG1zKSB7XG4gICAgICAgIC8vY2FuJ3QganVzdCBhcHBseSgpIHRvIGNyZWF0ZSBhIGRhdGU6XG4gICAgICAgIC8vaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xODEzNDgvaW5zdGFudGlhdGluZy1hLWphdmFzY3JpcHQtb2JqZWN0LWJ5LWNhbGxpbmctcHJvdG90eXBlLWNvbnN0cnVjdG9yLWFwcGx5XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoeSwgbSwgZCwgaCwgTSwgcywgbXMpO1xuXG4gICAgICAgIC8vdGhlIGRhdGUgY29uc3RydWN0b3IgZG9lc24ndCBhY2NlcHQgeWVhcnMgPCAxOTcwXG4gICAgICAgIGlmICh5IDwgMTk3MCkge1xuICAgICAgICAgICAgZGF0ZS5zZXRGdWxsWWVhcih5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVVVENEYXRlICh5KSB7XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMuYXBwbHkobnVsbCwgYXJndW1lbnRzKSk7XG4gICAgICAgIGlmICh5IDwgMTk3MCkge1xuICAgICAgICAgICAgZGF0ZS5zZXRVVENGdWxsWWVhcih5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueWVhcigpICUgMTAwO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydZWVlZJywgICA0XSwgICAgICAgMCwgJ3llYXInKTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZWVlZJywgIDVdLCAgICAgICAwLCAneWVhcicpO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVlZWVlZJywgNiwgdHJ1ZV0sIDAsICd5ZWFyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3llYXInLCAneScpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignWScsICAgICAgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZJywgICAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdZWVlZJywgICBtYXRjaDF0bzQsIG1hdGNoNCk7XG4gICAgYWRkUmVnZXhUb2tlbignWVlZWVknLCAgbWF0Y2gxdG82LCBtYXRjaDYpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZWVlZWScsIG1hdGNoMXRvNiwgbWF0Y2g2KTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydZWVlZJywgJ1lZWVlZJywgJ1lZWVlZWSddLCBZRUFSKTtcbiAgICBhZGRQYXJzZVRva2VuKCdZWScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbWUVBUl0gPSB1dGlsc19ob29rc19faG9va3MucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgZnVuY3Rpb24gZGF5c0luWWVhcih5ZWFyKSB7XG4gICAgICAgIHJldHVybiBpc0xlYXBZZWFyKHllYXIpID8gMzY2IDogMzY1O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTGVhcFllYXIoeWVhcikge1xuICAgICAgICByZXR1cm4gKHllYXIgJSA0ID09PSAwICYmIHllYXIgJSAxMDAgIT09IDApIHx8IHllYXIgJSA0MDAgPT09IDA7XG4gICAgfVxuXG4gICAgLy8gSE9PS1NcblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5wYXJzZVR3b0RpZ2l0WWVhciA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICByZXR1cm4gdG9JbnQoaW5wdXQpICsgKHRvSW50KGlucHV0KSA+IDY4ID8gMTkwMCA6IDIwMDApO1xuICAgIH07XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0WWVhciA9IG1ha2VHZXRTZXQoJ0Z1bGxZZWFyJywgZmFsc2UpO1xuXG4gICAgZnVuY3Rpb24gZ2V0SXNMZWFwWWVhciAoKSB7XG4gICAgICAgIHJldHVybiBpc0xlYXBZZWFyKHRoaXMueWVhcigpKTtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbigndycsIFsnd3cnLCAyXSwgJ3dvJywgJ3dlZWsnKTtcbiAgICBhZGRGb3JtYXRUb2tlbignVycsIFsnV1cnLCAyXSwgJ1dvJywgJ2lzb1dlZWsnKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnd2VlaycsICd3Jyk7XG4gICAgYWRkVW5pdEFsaWFzKCdpc29XZWVrJywgJ1cnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ3cnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCd3dycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdXJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignV1cnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ3cnLCAnd3cnLCAnVycsICdXVyddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgd2Vla1t0b2tlbi5zdWJzdHIoMCwgMSldID0gdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgLy8gZmlyc3REYXlPZldlZWsgICAgICAgMCA9IHN1biwgNiA9IHNhdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIHRoZSBkYXkgb2YgdGhlIHdlZWsgdGhhdCBzdGFydHMgdGhlIHdlZWtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAodXN1YWxseSBzdW5kYXkgb3IgbW9uZGF5KVxuICAgIC8vIGZpcnN0RGF5T2ZXZWVrT2ZZZWFyIDAgPSBzdW4sIDYgPSBzYXRcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICB0aGUgZmlyc3Qgd2VlayBpcyB0aGUgd2VlayB0aGF0IGNvbnRhaW5zIHRoZSBmaXJzdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIG9mIHRoaXMgZGF5IG9mIHRoZSB3ZWVrXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgKGVnLiBJU08gd2Vla3MgdXNlIHRodXJzZGF5ICg0KSlcbiAgICBmdW5jdGlvbiB3ZWVrT2ZZZWFyKG1vbSwgZmlyc3REYXlPZldlZWssIGZpcnN0RGF5T2ZXZWVrT2ZZZWFyKSB7XG4gICAgICAgIHZhciBlbmQgPSBmaXJzdERheU9mV2Vla09mWWVhciAtIGZpcnN0RGF5T2ZXZWVrLFxuICAgICAgICAgICAgZGF5c1RvRGF5T2ZXZWVrID0gZmlyc3REYXlPZldlZWtPZlllYXIgLSBtb20uZGF5KCksXG4gICAgICAgICAgICBhZGp1c3RlZE1vbWVudDtcblxuXG4gICAgICAgIGlmIChkYXlzVG9EYXlPZldlZWsgPiBlbmQpIHtcbiAgICAgICAgICAgIGRheXNUb0RheU9mV2VlayAtPSA3O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRheXNUb0RheU9mV2VlayA8IGVuZCAtIDcpIHtcbiAgICAgICAgICAgIGRheXNUb0RheU9mV2VlayArPSA3O1xuICAgICAgICB9XG5cbiAgICAgICAgYWRqdXN0ZWRNb21lbnQgPSBsb2NhbF9fY3JlYXRlTG9jYWwobW9tKS5hZGQoZGF5c1RvRGF5T2ZXZWVrLCAnZCcpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2VlazogTWF0aC5jZWlsKGFkanVzdGVkTW9tZW50LmRheU9mWWVhcigpIC8gNyksXG4gICAgICAgICAgICB5ZWFyOiBhZGp1c3RlZE1vbWVudC55ZWFyKClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrIChtb20pIHtcbiAgICAgICAgcmV0dXJuIHdlZWtPZlllYXIobW9tLCB0aGlzLl93ZWVrLmRvdywgdGhpcy5fd2Vlay5kb3kpLndlZWs7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrID0ge1xuICAgICAgICBkb3cgOiAwLCAvLyBTdW5kYXkgaXMgdGhlIGZpcnN0IGRheSBvZiB0aGUgd2Vlay5cbiAgICAgICAgZG95IDogNiAgLy8gVGhlIHdlZWsgdGhhdCBjb250YWlucyBKYW4gMXN0IGlzIHRoZSBmaXJzdCB3ZWVrIG9mIHRoZSB5ZWFyLlxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVGaXJzdERheU9mV2VlayAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWVrLmRvdztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVGaXJzdERheU9mWWVhciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWVrLmRveTtcbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXRXZWVrIChpbnB1dCkge1xuICAgICAgICB2YXIgd2VlayA9IHRoaXMubG9jYWxlRGF0YSgpLndlZWsodGhpcyk7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2VlayA6IHRoaXMuYWRkKChpbnB1dCAtIHdlZWspICogNywgJ2QnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRJU09XZWVrIChpbnB1dCkge1xuICAgICAgICB2YXIgd2VlayA9IHdlZWtPZlllYXIodGhpcywgMSwgNCkud2VlaztcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrIDogdGhpcy5hZGQoKGlucHV0IC0gd2VlaykgKiA3LCAnZCcpO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKCdEREQnLCBbJ0REREQnLCAzXSwgJ0RERG8nLCAnZGF5T2ZZZWFyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2RheU9mWWVhcicsICdEREQnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ0RERCcsICBtYXRjaDF0bzMpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0REREQnLCBtYXRjaDMpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydEREQnLCAnRERERCddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPSB0b0ludChpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICAvL2h0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSVNPX3dlZWtfZGF0ZSNDYWxjdWxhdGluZ19hX2RhdGVfZ2l2ZW5fdGhlX3llYXIuMkNfd2Vla19udW1iZXJfYW5kX3dlZWtkYXlcbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla3MoeWVhciwgd2Vlaywgd2Vla2RheSwgZmlyc3REYXlPZldlZWtPZlllYXIsIGZpcnN0RGF5T2ZXZWVrKSB7XG4gICAgICAgIHZhciBkID0gY3JlYXRlVVRDRGF0ZSh5ZWFyLCAwLCAxKS5nZXRVVENEYXkoKTtcbiAgICAgICAgdmFyIGRheXNUb0FkZDtcbiAgICAgICAgdmFyIGRheU9mWWVhcjtcblxuICAgICAgICBkID0gZCA9PT0gMCA/IDcgOiBkO1xuICAgICAgICB3ZWVrZGF5ID0gd2Vla2RheSAhPSBudWxsID8gd2Vla2RheSA6IGZpcnN0RGF5T2ZXZWVrO1xuICAgICAgICBkYXlzVG9BZGQgPSBmaXJzdERheU9mV2VlayAtIGQgKyAoZCA+IGZpcnN0RGF5T2ZXZWVrT2ZZZWFyID8gNyA6IDApIC0gKGQgPCBmaXJzdERheU9mV2VlayA/IDcgOiAwKTtcbiAgICAgICAgZGF5T2ZZZWFyID0gNyAqICh3ZWVrIC0gMSkgKyAod2Vla2RheSAtIGZpcnN0RGF5T2ZXZWVrKSArIGRheXNUb0FkZCArIDE7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHllYXIgICAgICA6IGRheU9mWWVhciA+IDAgPyB5ZWFyICAgICAgOiB5ZWFyIC0gMSxcbiAgICAgICAgICAgIGRheU9mWWVhciA6IGRheU9mWWVhciA+IDAgPyBkYXlPZlllYXIgOiBkYXlzSW5ZZWFyKHllYXIgLSAxKSArIGRheU9mWWVhclxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldERheU9mWWVhciAoaW5wdXQpIHtcbiAgICAgICAgdmFyIGRheU9mWWVhciA9IE1hdGgucm91bmQoKHRoaXMuY2xvbmUoKS5zdGFydE9mKCdkYXknKSAtIHRoaXMuY2xvbmUoKS5zdGFydE9mKCd5ZWFyJykpIC8gODY0ZTUpICsgMTtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyBkYXlPZlllYXIgOiB0aGlzLmFkZCgoaW5wdXQgLSBkYXlPZlllYXIpLCAnZCcpO1xuICAgIH1cblxuICAgIC8vIFBpY2sgdGhlIGZpcnN0IGRlZmluZWQgb2YgdHdvIG9yIHRocmVlIGFyZ3VtZW50cy5cbiAgICBmdW5jdGlvbiBkZWZhdWx0cyhhLCBiLCBjKSB7XG4gICAgICAgIGlmIChhICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGN1cnJlbnREYXRlQXJyYXkoY29uZmlnKSB7XG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBpZiAoY29uZmlnLl91c2VVVEMpIHtcbiAgICAgICAgICAgIHJldHVybiBbbm93LmdldFVUQ0Z1bGxZZWFyKCksIG5vdy5nZXRVVENNb250aCgpLCBub3cuZ2V0VVRDRGF0ZSgpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW25vdy5nZXRGdWxsWWVhcigpLCBub3cuZ2V0TW9udGgoKSwgbm93LmdldERhdGUoKV07XG4gICAgfVxuXG4gICAgLy8gY29udmVydCBhbiBhcnJheSB0byBhIGRhdGUuXG4gICAgLy8gdGhlIGFycmF5IHNob3VsZCBtaXJyb3IgdGhlIHBhcmFtZXRlcnMgYmVsb3dcbiAgICAvLyBub3RlOiBhbGwgdmFsdWVzIHBhc3QgdGhlIHllYXIgYXJlIG9wdGlvbmFsIGFuZCB3aWxsIGRlZmF1bHQgdG8gdGhlIGxvd2VzdCBwb3NzaWJsZSB2YWx1ZS5cbiAgICAvLyBbeWVhciwgbW9udGgsIGRheSAsIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCBtaWxsaXNlY29uZF1cbiAgICBmdW5jdGlvbiBjb25maWdGcm9tQXJyYXkgKGNvbmZpZykge1xuICAgICAgICB2YXIgaSwgZGF0ZSwgaW5wdXQgPSBbXSwgY3VycmVudERhdGUsIHllYXJUb1VzZTtcblxuICAgICAgICBpZiAoY29uZmlnLl9kKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50RGF0ZSA9IGN1cnJlbnREYXRlQXJyYXkoY29uZmlnKTtcblxuICAgICAgICAvL2NvbXB1dGUgZGF5IG9mIHRoZSB5ZWFyIGZyb20gd2Vla3MgYW5kIHdlZWtkYXlzXG4gICAgICAgIGlmIChjb25maWcuX3cgJiYgY29uZmlnLl9hW0RBVEVdID09IG51bGwgJiYgY29uZmlnLl9hW01PTlRIXSA9PSBudWxsKSB7XG4gICAgICAgICAgICBkYXlPZlllYXJGcm9tV2Vla0luZm8oY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vaWYgdGhlIGRheSBvZiB0aGUgeWVhciBpcyBzZXQsIGZpZ3VyZSBvdXQgd2hhdCBpdCBpc1xuICAgICAgICBpZiAoY29uZmlnLl9kYXlPZlllYXIpIHtcbiAgICAgICAgICAgIHllYXJUb1VzZSA9IGRlZmF1bHRzKGNvbmZpZy5fYVtZRUFSXSwgY3VycmVudERhdGVbWUVBUl0pO1xuXG4gICAgICAgICAgICBpZiAoY29uZmlnLl9kYXlPZlllYXIgPiBkYXlzSW5ZZWFyKHllYXJUb1VzZSkpIHtcbiAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5fb3ZlcmZsb3dEYXlPZlllYXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRlID0gY3JlYXRlVVRDRGF0ZSh5ZWFyVG9Vc2UsIDAsIGNvbmZpZy5fZGF5T2ZZZWFyKTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtNT05USF0gPSBkYXRlLmdldFVUQ01vbnRoKCk7XG4gICAgICAgICAgICBjb25maWcuX2FbREFURV0gPSBkYXRlLmdldFVUQ0RhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERlZmF1bHQgdG8gY3VycmVudCBkYXRlLlxuICAgICAgICAvLyAqIGlmIG5vIHllYXIsIG1vbnRoLCBkYXkgb2YgbW9udGggYXJlIGdpdmVuLCBkZWZhdWx0IHRvIHRvZGF5XG4gICAgICAgIC8vICogaWYgZGF5IG9mIG1vbnRoIGlzIGdpdmVuLCBkZWZhdWx0IG1vbnRoIGFuZCB5ZWFyXG4gICAgICAgIC8vICogaWYgbW9udGggaXMgZ2l2ZW4sIGRlZmF1bHQgb25seSB5ZWFyXG4gICAgICAgIC8vICogaWYgeWVhciBpcyBnaXZlbiwgZG9uJ3QgZGVmYXVsdCBhbnl0aGluZ1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMyAmJiBjb25maWcuX2FbaV0gPT0gbnVsbDsgKytpKSB7XG4gICAgICAgICAgICBjb25maWcuX2FbaV0gPSBpbnB1dFtpXSA9IGN1cnJlbnREYXRlW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gWmVybyBvdXQgd2hhdGV2ZXIgd2FzIG5vdCBkZWZhdWx0ZWQsIGluY2x1ZGluZyB0aW1lXG4gICAgICAgIGZvciAoOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICBjb25maWcuX2FbaV0gPSBpbnB1dFtpXSA9IChjb25maWcuX2FbaV0gPT0gbnVsbCkgPyAoaSA9PT0gMiA/IDEgOiAwKSA6IGNvbmZpZy5fYVtpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGZvciAyNDowMDowMC4wMDBcbiAgICAgICAgaWYgKGNvbmZpZy5fYVtIT1VSXSA9PT0gMjQgJiZcbiAgICAgICAgICAgICAgICBjb25maWcuX2FbTUlOVVRFXSA9PT0gMCAmJlxuICAgICAgICAgICAgICAgIGNvbmZpZy5fYVtTRUNPTkRdID09PSAwICYmXG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW01JTExJU0VDT05EXSA9PT0gMCkge1xuICAgICAgICAgICAgY29uZmlnLl9uZXh0RGF5ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWcuX2QgPSAoY29uZmlnLl91c2VVVEMgPyBjcmVhdGVVVENEYXRlIDogY3JlYXRlRGF0ZSkuYXBwbHkobnVsbCwgaW5wdXQpO1xuICAgICAgICAvLyBBcHBseSB0aW1lem9uZSBvZmZzZXQgZnJvbSBpbnB1dC4gVGhlIGFjdHVhbCB1dGNPZmZzZXQgY2FuIGJlIGNoYW5nZWRcbiAgICAgICAgLy8gd2l0aCBwYXJzZVpvbmUuXG4gICAgICAgIGlmIChjb25maWcuX3R6bSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb25maWcuX2Quc2V0VVRDTWludXRlcyhjb25maWcuX2QuZ2V0VVRDTWludXRlcygpIC0gY29uZmlnLl90em0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fbmV4dERheSkge1xuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gMjQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla0luZm8oY29uZmlnKSB7XG4gICAgICAgIHZhciB3LCB3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3ksIHRlbXA7XG5cbiAgICAgICAgdyA9IGNvbmZpZy5fdztcbiAgICAgICAgaWYgKHcuR0cgIT0gbnVsbCB8fCB3LlcgIT0gbnVsbCB8fCB3LkUgIT0gbnVsbCkge1xuICAgICAgICAgICAgZG93ID0gMTtcbiAgICAgICAgICAgIGRveSA9IDQ7XG5cbiAgICAgICAgICAgIC8vIFRPRE86IFdlIG5lZWQgdG8gdGFrZSB0aGUgY3VycmVudCBpc29XZWVrWWVhciwgYnV0IHRoYXQgZGVwZW5kcyBvblxuICAgICAgICAgICAgLy8gaG93IHdlIGludGVycHJldCBub3cgKGxvY2FsLCB1dGMsIGZpeGVkIG9mZnNldCkuIFNvIGNyZWF0ZVxuICAgICAgICAgICAgLy8gYSBub3cgdmVyc2lvbiBvZiBjdXJyZW50IGNvbmZpZyAodGFrZSBsb2NhbC91dGMvb2Zmc2V0IGZsYWdzLCBhbmRcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBub3cpLlxuICAgICAgICAgICAgd2Vla1llYXIgPSBkZWZhdWx0cyh3LkdHLCBjb25maWcuX2FbWUVBUl0sIHdlZWtPZlllYXIobG9jYWxfX2NyZWF0ZUxvY2FsKCksIDEsIDQpLnllYXIpO1xuICAgICAgICAgICAgd2VlayA9IGRlZmF1bHRzKHcuVywgMSk7XG4gICAgICAgICAgICB3ZWVrZGF5ID0gZGVmYXVsdHMody5FLCAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvdyA9IGNvbmZpZy5fbG9jYWxlLl93ZWVrLmRvdztcbiAgICAgICAgICAgIGRveSA9IGNvbmZpZy5fbG9jYWxlLl93ZWVrLmRveTtcblxuICAgICAgICAgICAgd2Vla1llYXIgPSBkZWZhdWx0cyh3LmdnLCBjb25maWcuX2FbWUVBUl0sIHdlZWtPZlllYXIobG9jYWxfX2NyZWF0ZUxvY2FsKCksIGRvdywgZG95KS55ZWFyKTtcbiAgICAgICAgICAgIHdlZWsgPSBkZWZhdWx0cyh3LncsIDEpO1xuXG4gICAgICAgICAgICBpZiAody5kICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyB3ZWVrZGF5IC0tIGxvdyBkYXkgbnVtYmVycyBhcmUgY29uc2lkZXJlZCBuZXh0IHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gdy5kO1xuICAgICAgICAgICAgICAgIGlmICh3ZWVrZGF5IDwgZG93KSB7XG4gICAgICAgICAgICAgICAgICAgICsrd2VlaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHcuZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gbG9jYWwgd2Vla2RheSAtLSBjb3VudGluZyBzdGFydHMgZnJvbSBiZWdpbmluZyBvZiB3ZWVrXG4gICAgICAgICAgICAgICAgd2Vla2RheSA9IHcuZSArIGRvdztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZGVmYXVsdCB0byBiZWdpbmluZyBvZiB3ZWVrXG4gICAgICAgICAgICAgICAgd2Vla2RheSA9IGRvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZW1wID0gZGF5T2ZZZWFyRnJvbVdlZWtzKHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3ksIGRvdyk7XG5cbiAgICAgICAgY29uZmlnLl9hW1lFQVJdID0gdGVtcC55ZWFyO1xuICAgICAgICBjb25maWcuX2RheU9mWWVhciA9IHRlbXAuZGF5T2ZZZWFyO1xuICAgIH1cblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5JU09fODYwMSA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgLy8gZGF0ZSBmcm9tIHN0cmluZyBhbmQgZm9ybWF0IHN0cmluZ1xuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKSB7XG4gICAgICAgIC8vIFRPRE86IE1vdmUgdGhpcyB0byBhbm90aGVyIHBhcnQgb2YgdGhlIGNyZWF0aW9uIGZsb3cgdG8gcHJldmVudCBjaXJjdWxhciBkZXBzXG4gICAgICAgIGlmIChjb25maWcuX2YgPT09IHV0aWxzX2hvb2tzX19ob29rcy5JU09fODYwMSkge1xuICAgICAgICAgICAgY29uZmlnRnJvbUlTTyhjb25maWcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnLl9hID0gW107XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmVtcHR5ID0gdHJ1ZTtcblxuICAgICAgICAvLyBUaGlzIGFycmF5IGlzIHVzZWQgdG8gbWFrZSBhIERhdGUsIGVpdGhlciB3aXRoIGBuZXcgRGF0ZWAgb3IgYERhdGUuVVRDYFxuICAgICAgICB2YXIgc3RyaW5nID0gJycgKyBjb25maWcuX2ksXG4gICAgICAgICAgICBpLCBwYXJzZWRJbnB1dCwgdG9rZW5zLCB0b2tlbiwgc2tpcHBlZCxcbiAgICAgICAgICAgIHN0cmluZ0xlbmd0aCA9IHN0cmluZy5sZW5ndGgsXG4gICAgICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoID0gMDtcblxuICAgICAgICB0b2tlbnMgPSBleHBhbmRGb3JtYXQoY29uZmlnLl9mLCBjb25maWcuX2xvY2FsZSkubWF0Y2goZm9ybWF0dGluZ1Rva2VucykgfHwgW107XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgICAgICBwYXJzZWRJbnB1dCA9IChzdHJpbmcubWF0Y2goZ2V0UGFyc2VSZWdleEZvclRva2VuKHRva2VuLCBjb25maWcpKSB8fCBbXSlbMF07XG4gICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBza2lwcGVkID0gc3RyaW5nLnN1YnN0cigwLCBzdHJpbmcuaW5kZXhPZihwYXJzZWRJbnB1dCkpO1xuICAgICAgICAgICAgICAgIGlmIChza2lwcGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkSW5wdXQucHVzaChza2lwcGVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RyaW5nID0gc3RyaW5nLnNsaWNlKHN0cmluZy5pbmRleE9mKHBhcnNlZElucHV0KSArIHBhcnNlZElucHV0Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdG90YWxQYXJzZWRJbnB1dExlbmd0aCArPSBwYXJzZWRJbnB1dC5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBkb24ndCBwYXJzZSBpZiBpdCdzIG5vdCBhIGtub3duIHRva2VuXG4gICAgICAgICAgICBpZiAoZm9ybWF0VG9rZW5GdW5jdGlvbnNbdG9rZW5dKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBwYXJzZWRJbnB1dCwgY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbmZpZy5fc3RyaWN0ICYmICFwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZFRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFkZCByZW1haW5pbmcgdW5wYXJzZWQgaW5wdXQgbGVuZ3RoIHRvIHRoZSBzdHJpbmdcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuY2hhcnNMZWZ0T3ZlciA9IHN0cmluZ0xlbmd0aCAtIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGg7XG4gICAgICAgIGlmIChzdHJpbmcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkSW5wdXQucHVzaChzdHJpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2xlYXIgXzEyaCBmbGFnIGlmIGhvdXIgaXMgPD0gMTJcbiAgICAgICAgaWYgKGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPT09IHRydWUgJiZcbiAgICAgICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gPD0gMTIgJiZcbiAgICAgICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gPiAwKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIGhhbmRsZSBtZXJpZGllbVxuICAgICAgICBjb25maWcuX2FbSE9VUl0gPSBtZXJpZGllbUZpeFdyYXAoY29uZmlnLl9sb2NhbGUsIGNvbmZpZy5fYVtIT1VSXSwgY29uZmlnLl9tZXJpZGllbSk7XG5cbiAgICAgICAgY29uZmlnRnJvbUFycmF5KGNvbmZpZyk7XG4gICAgICAgIGNoZWNrT3ZlcmZsb3coY29uZmlnKTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIG1lcmlkaWVtRml4V3JhcCAobG9jYWxlLCBob3VyLCBtZXJpZGllbSkge1xuICAgICAgICB2YXIgaXNQbTtcblxuICAgICAgICBpZiAobWVyaWRpZW0gPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gbm90aGluZyB0byBkb1xuICAgICAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvY2FsZS5tZXJpZGllbUhvdXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZS5tZXJpZGllbUhvdXIoaG91ciwgbWVyaWRpZW0pO1xuICAgICAgICB9IGVsc2UgaWYgKGxvY2FsZS5pc1BNICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIEZhbGxiYWNrXG4gICAgICAgICAgICBpc1BtID0gbG9jYWxlLmlzUE0obWVyaWRpZW0pO1xuICAgICAgICAgICAgaWYgKGlzUG0gJiYgaG91ciA8IDEyKSB7XG4gICAgICAgICAgICAgICAgaG91ciArPSAxMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNQbSAmJiBob3VyID09PSAxMikge1xuICAgICAgICAgICAgICAgIGhvdXIgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzIG5vdCBzdXBwb3NlZCB0byBoYXBwZW5cbiAgICAgICAgICAgIHJldHVybiBob3VyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZykge1xuICAgICAgICB2YXIgdGVtcENvbmZpZyxcbiAgICAgICAgICAgIGJlc3RNb21lbnQsXG5cbiAgICAgICAgICAgIHNjb3JlVG9CZWF0LFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZTtcblxuICAgICAgICBpZiAoY29uZmlnLl9mLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaW52YWxpZEZvcm1hdCA9IHRydWU7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShOYU4pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvbmZpZy5fZi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY3VycmVudFNjb3JlID0gMDtcbiAgICAgICAgICAgIHRlbXBDb25maWcgPSBjb3B5Q29uZmlnKHt9LCBjb25maWcpO1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5fdXNlVVRDICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0ZW1wQ29uZmlnLl91c2VVVEMgPSBjb25maWcuX3VzZVVUQztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbXBDb25maWcuX2YgPSBjb25maWcuX2ZbaV07XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KHRlbXBDb25maWcpO1xuXG4gICAgICAgICAgICBpZiAoIXZhbGlkX19pc1ZhbGlkKHRlbXBDb25maWcpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGFueSBpbnB1dCB0aGF0IHdhcyBub3QgcGFyc2VkIGFkZCBhIHBlbmFsdHkgZm9yIHRoYXQgZm9ybWF0XG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgKz0gZ2V0UGFyc2luZ0ZsYWdzKHRlbXBDb25maWcpLmNoYXJzTGVmdE92ZXI7XG5cbiAgICAgICAgICAgIC8vb3IgdG9rZW5zXG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgKz0gZ2V0UGFyc2luZ0ZsYWdzKHRlbXBDb25maWcpLnVudXNlZFRva2Vucy5sZW5ndGggKiAxMDtcblxuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKHRlbXBDb25maWcpLnNjb3JlID0gY3VycmVudFNjb3JlO1xuXG4gICAgICAgICAgICBpZiAoc2NvcmVUb0JlYXQgPT0gbnVsbCB8fCBjdXJyZW50U2NvcmUgPCBzY29yZVRvQmVhdCkge1xuICAgICAgICAgICAgICAgIHNjb3JlVG9CZWF0ID0gY3VycmVudFNjb3JlO1xuICAgICAgICAgICAgICAgIGJlc3RNb21lbnQgPSB0ZW1wQ29uZmlnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXh0ZW5kKGNvbmZpZywgYmVzdE1vbWVudCB8fCB0ZW1wQ29uZmlnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb25maWdGcm9tT2JqZWN0KGNvbmZpZykge1xuICAgICAgICBpZiAoY29uZmlnLl9kKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaSA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKGNvbmZpZy5faSk7XG4gICAgICAgIGNvbmZpZy5fYSA9IFtpLnllYXIsIGkubW9udGgsIGkuZGF5IHx8IGkuZGF0ZSwgaS5ob3VyLCBpLm1pbnV0ZSwgaS5zZWNvbmQsIGkubWlsbGlzZWNvbmRdO1xuXG4gICAgICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUZyb21Db25maWcgKGNvbmZpZykge1xuICAgICAgICB2YXIgaW5wdXQgPSBjb25maWcuX2ksXG4gICAgICAgICAgICBmb3JtYXQgPSBjb25maWcuX2YsXG4gICAgICAgICAgICByZXM7XG5cbiAgICAgICAgY29uZmlnLl9sb2NhbGUgPSBjb25maWcuX2xvY2FsZSB8fCBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKGNvbmZpZy5fbCk7XG5cbiAgICAgICAgaWYgKGlucHV0ID09PSBudWxsIHx8IChmb3JtYXQgPT09IHVuZGVmaW5lZCAmJiBpbnB1dCA9PT0gJycpKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsaWRfX2NyZWF0ZUludmFsaWQoe251bGxJbnB1dDogdHJ1ZX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbmZpZy5faSA9IGlucHV0ID0gY29uZmlnLl9sb2NhbGUucHJlcGFyc2UoaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTW9tZW50KGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNb21lbnQoY2hlY2tPdmVyZmxvdyhpbnB1dCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoZm9ybWF0KSkge1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0KSB7XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNEYXRlKGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gaW5wdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWdGcm9tSW5wdXQoY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcyA9IG5ldyBNb21lbnQoY2hlY2tPdmVyZmxvdyhjb25maWcpKTtcbiAgICAgICAgaWYgKHJlcy5fbmV4dERheSkge1xuICAgICAgICAgICAgLy8gQWRkaW5nIGlzIHNtYXJ0IGVub3VnaCBhcm91bmQgRFNUXG4gICAgICAgICAgICByZXMuYWRkKDEsICdkJyk7XG4gICAgICAgICAgICByZXMuX25leHREYXkgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21JbnB1dChjb25maWcpIHtcbiAgICAgICAgdmFyIGlucHV0ID0gY29uZmlnLl9pO1xuICAgICAgICBpZiAoaW5wdXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0RhdGUoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSgraW5wdXQpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmcoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9hID0gbWFwKGlucHV0LnNsaWNlKDApLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KG9iaiwgMTApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25maWdGcm9tQXJyYXkoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YoaW5wdXQpID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgY29uZmlnRnJvbU9iamVjdChjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZihpbnB1dCkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAvLyBmcm9tIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoaW5wdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrKGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVMb2NhbE9yVVRDIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCwgaXNVVEMpIHtcbiAgICAgICAgdmFyIGMgPSB7fTtcblxuICAgICAgICBpZiAodHlwZW9mKGxvY2FsZSkgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgc3RyaWN0ID0gbG9jYWxlO1xuICAgICAgICAgICAgbG9jYWxlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9iamVjdCBjb25zdHJ1Y3Rpb24gbXVzdCBiZSBkb25lIHRoaXMgd2F5LlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTQyM1xuICAgICAgICBjLl9pc0FNb21lbnRPYmplY3QgPSB0cnVlO1xuICAgICAgICBjLl91c2VVVEMgPSBjLl9pc1VUQyA9IGlzVVRDO1xuICAgICAgICBjLl9sID0gbG9jYWxlO1xuICAgICAgICBjLl9pID0gaW5wdXQ7XG4gICAgICAgIGMuX2YgPSBmb3JtYXQ7XG4gICAgICAgIGMuX3N0cmljdCA9IHN0cmljdDtcblxuICAgICAgICByZXR1cm4gY3JlYXRlRnJvbUNvbmZpZyhjKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbF9fY3JlYXRlTG9jYWwgKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0KSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVMb2NhbE9yVVRDKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCBmYWxzZSk7XG4gICAgfVxuXG4gICAgdmFyIHByb3RvdHlwZU1pbiA9IGRlcHJlY2F0ZShcbiAgICAgICAgICdtb21lbnQoKS5taW4gaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudC5taW4gaW5zdGVhZC4gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE1NDgnLFxuICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgIHZhciBvdGhlciA9IGxvY2FsX19jcmVhdGVMb2NhbC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgIHJldHVybiBvdGhlciA8IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgICAgICB9XG4gICAgICk7XG5cbiAgICB2YXIgcHJvdG90eXBlTWF4ID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50KCkubWF4IGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQubWF4IGluc3RlYWQuIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNTQ4JyxcbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG90aGVyID0gbG9jYWxfX2NyZWF0ZUxvY2FsLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICByZXR1cm4gb3RoZXIgPiB0aGlzID8gdGhpcyA6IG90aGVyO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIC8vIFBpY2sgYSBtb21lbnQgbSBmcm9tIG1vbWVudHMgc28gdGhhdCBtW2ZuXShvdGhlcikgaXMgdHJ1ZSBmb3IgYWxsXG4gICAgLy8gb3RoZXIuIFRoaXMgcmVsaWVzIG9uIHRoZSBmdW5jdGlvbiBmbiB0byBiZSB0cmFuc2l0aXZlLlxuICAgIC8vXG4gICAgLy8gbW9tZW50cyBzaG91bGQgZWl0aGVyIGJlIGFuIGFycmF5IG9mIG1vbWVudCBvYmplY3RzIG9yIGFuIGFycmF5LCB3aG9zZVxuICAgIC8vIGZpcnN0IGVsZW1lbnQgaXMgYW4gYXJyYXkgb2YgbW9tZW50IG9iamVjdHMuXG4gICAgZnVuY3Rpb24gcGlja0J5KGZuLCBtb21lbnRzKSB7XG4gICAgICAgIHZhciByZXMsIGk7XG4gICAgICAgIGlmIChtb21lbnRzLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KG1vbWVudHNbMF0pKSB7XG4gICAgICAgICAgICBtb21lbnRzID0gbW9tZW50c1swXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1vbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxfX2NyZWF0ZUxvY2FsKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzID0gbW9tZW50c1swXTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IG1vbWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChtb21lbnRzW2ldW2ZuXShyZXMpKSB7XG4gICAgICAgICAgICAgICAgcmVzID0gbW9tZW50c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8vIFRPRE86IFVzZSBbXS5zb3J0IGluc3RlYWQ/XG4gICAgZnVuY3Rpb24gbWluICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgcmV0dXJuIHBpY2tCeSgnaXNCZWZvcmUnLCBhcmdzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXggKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0FmdGVyJywgYXJncyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gRHVyYXRpb24gKGR1cmF0aW9uKSB7XG4gICAgICAgIHZhciBub3JtYWxpemVkSW5wdXQgPSBub3JtYWxpemVPYmplY3RVbml0cyhkdXJhdGlvbiksXG4gICAgICAgICAgICB5ZWFycyA9IG5vcm1hbGl6ZWRJbnB1dC55ZWFyIHx8IDAsXG4gICAgICAgICAgICBxdWFydGVycyA9IG5vcm1hbGl6ZWRJbnB1dC5xdWFydGVyIHx8IDAsXG4gICAgICAgICAgICBtb250aHMgPSBub3JtYWxpemVkSW5wdXQubW9udGggfHwgMCxcbiAgICAgICAgICAgIHdlZWtzID0gbm9ybWFsaXplZElucHV0LndlZWsgfHwgMCxcbiAgICAgICAgICAgIGRheXMgPSBub3JtYWxpemVkSW5wdXQuZGF5IHx8IDAsXG4gICAgICAgICAgICBob3VycyA9IG5vcm1hbGl6ZWRJbnB1dC5ob3VyIHx8IDAsXG4gICAgICAgICAgICBtaW51dGVzID0gbm9ybWFsaXplZElucHV0Lm1pbnV0ZSB8fCAwLFxuICAgICAgICAgICAgc2Vjb25kcyA9IG5vcm1hbGl6ZWRJbnB1dC5zZWNvbmQgfHwgMCxcbiAgICAgICAgICAgIG1pbGxpc2Vjb25kcyA9IG5vcm1hbGl6ZWRJbnB1dC5taWxsaXNlY29uZCB8fCAwO1xuXG4gICAgICAgIC8vIHJlcHJlc2VudGF0aW9uIGZvciBkYXRlQWRkUmVtb3ZlXG4gICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyA9ICttaWxsaXNlY29uZHMgK1xuICAgICAgICAgICAgc2Vjb25kcyAqIDFlMyArIC8vIDEwMDBcbiAgICAgICAgICAgIG1pbnV0ZXMgKiA2ZTQgKyAvLyAxMDAwICogNjBcbiAgICAgICAgICAgIGhvdXJzICogMzZlNTsgLy8gMTAwMCAqIDYwICogNjBcbiAgICAgICAgLy8gQmVjYXVzZSBvZiBkYXRlQWRkUmVtb3ZlIHRyZWF0cyAyNCBob3VycyBhcyBkaWZmZXJlbnQgZnJvbSBhXG4gICAgICAgIC8vIGRheSB3aGVuIHdvcmtpbmcgYXJvdW5kIERTVCwgd2UgbmVlZCB0byBzdG9yZSB0aGVtIHNlcGFyYXRlbHlcbiAgICAgICAgdGhpcy5fZGF5cyA9ICtkYXlzICtcbiAgICAgICAgICAgIHdlZWtzICogNztcbiAgICAgICAgLy8gSXQgaXMgaW1wb3NzaWJsZSB0cmFuc2xhdGUgbW9udGhzIGludG8gZGF5cyB3aXRob3V0IGtub3dpbmdcbiAgICAgICAgLy8gd2hpY2ggbW9udGhzIHlvdSBhcmUgYXJlIHRhbGtpbmcgYWJvdXQsIHNvIHdlIGhhdmUgdG8gc3RvcmVcbiAgICAgICAgLy8gaXQgc2VwYXJhdGVseS5cbiAgICAgICAgdGhpcy5fbW9udGhzID0gK21vbnRocyArXG4gICAgICAgICAgICBxdWFydGVycyAqIDMgK1xuICAgICAgICAgICAgeWVhcnMgKiAxMjtcblxuICAgICAgICB0aGlzLl9kYXRhID0ge307XG5cbiAgICAgICAgdGhpcy5fbG9jYWxlID0gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZSgpO1xuXG4gICAgICAgIHRoaXMuX2J1YmJsZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRHVyYXRpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRHVyYXRpb247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb2Zmc2V0ICh0b2tlbiwgc2VwYXJhdG9yKSB7XG4gICAgICAgIGFkZEZvcm1hdFRva2VuKHRva2VuLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy51dGNPZmZzZXQoKTtcbiAgICAgICAgICAgIHZhciBzaWduID0gJysnO1xuICAgICAgICAgICAgaWYgKG9mZnNldCA8IDApIHtcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSAtb2Zmc2V0O1xuICAgICAgICAgICAgICAgIHNpZ24gPSAnLSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2lnbiArIHplcm9GaWxsKH5+KG9mZnNldCAvIDYwKSwgMikgKyBzZXBhcmF0b3IgKyB6ZXJvRmlsbCh+fihvZmZzZXQpICUgNjAsIDIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvZmZzZXQoJ1onLCAnOicpO1xuICAgIG9mZnNldCgnWlonLCAnJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdaJywgIG1hdGNoT2Zmc2V0KTtcbiAgICBhZGRSZWdleFRva2VuKCdaWicsIG1hdGNoT2Zmc2V0KTtcbiAgICBhZGRQYXJzZVRva2VuKFsnWicsICdaWiddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl91c2VVVEMgPSB0cnVlO1xuICAgICAgICBjb25maWcuX3R6bSA9IG9mZnNldEZyb21TdHJpbmcoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgLy8gdGltZXpvbmUgY2h1bmtlclxuICAgIC8vICcrMTA6MDAnID4gWycxMCcsICAnMDAnXVxuICAgIC8vICctMTUzMCcgID4gWyctMTUnLCAnMzAnXVxuICAgIHZhciBjaHVua09mZnNldCA9IC8oW1xcK1xcLV18XFxkXFxkKS9naTtcblxuICAgIGZ1bmN0aW9uIG9mZnNldEZyb21TdHJpbmcoc3RyaW5nKSB7XG4gICAgICAgIHZhciBtYXRjaGVzID0gKChzdHJpbmcgfHwgJycpLm1hdGNoKG1hdGNoT2Zmc2V0KSB8fCBbXSk7XG4gICAgICAgIHZhciBjaHVuayAgID0gbWF0Y2hlc1ttYXRjaGVzLmxlbmd0aCAtIDFdIHx8IFtdO1xuICAgICAgICB2YXIgcGFydHMgICA9IChjaHVuayArICcnKS5tYXRjaChjaHVua09mZnNldCkgfHwgWyctJywgMCwgMF07XG4gICAgICAgIHZhciBtaW51dGVzID0gKyhwYXJ0c1sxXSAqIDYwKSArIHRvSW50KHBhcnRzWzJdKTtcblxuICAgICAgICByZXR1cm4gcGFydHNbMF0gPT09ICcrJyA/IG1pbnV0ZXMgOiAtbWludXRlcztcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBtb21lbnQgZnJvbSBpbnB1dCwgdGhhdCBpcyBsb2NhbC91dGMvem9uZSBlcXVpdmFsZW50IHRvIG1vZGVsLlxuICAgIGZ1bmN0aW9uIGNsb25lV2l0aE9mZnNldChpbnB1dCwgbW9kZWwpIHtcbiAgICAgICAgdmFyIHJlcywgZGlmZjtcbiAgICAgICAgaWYgKG1vZGVsLl9pc1VUQykge1xuICAgICAgICAgICAgcmVzID0gbW9kZWwuY2xvbmUoKTtcbiAgICAgICAgICAgIGRpZmYgPSAoaXNNb21lbnQoaW5wdXQpIHx8IGlzRGF0ZShpbnB1dCkgPyAraW5wdXQgOiArbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KSkgLSAoK3Jlcyk7XG4gICAgICAgICAgICAvLyBVc2UgbG93LWxldmVsIGFwaSwgYmVjYXVzZSB0aGlzIGZuIGlzIGxvdy1sZXZlbCBhcGkuXG4gICAgICAgICAgICByZXMuX2Quc2V0VGltZSgrcmVzLl9kICsgZGlmZik7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KHJlcywgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpLmxvY2FsKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1vZGVsLl9pc1VUQyA/IGxvY2FsX19jcmVhdGVMb2NhbChpbnB1dCkuem9uZShtb2RlbC5fb2Zmc2V0IHx8IDApIDogbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KS5sb2NhbCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERhdGVPZmZzZXQgKG0pIHtcbiAgICAgICAgLy8gT24gRmlyZWZveC4yNCBEYXRlI2dldFRpbWV6b25lT2Zmc2V0IHJldHVybnMgYSBmbG9hdGluZyBwb2ludC5cbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvcHVsbC8xODcxXG4gICAgICAgIHJldHVybiAtTWF0aC5yb3VuZChtLl9kLmdldFRpbWV6b25lT2Zmc2V0KCkgLyAxNSkgKiAxNTtcbiAgICB9XG5cbiAgICAvLyBIT09LU1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuZXZlciBhIG1vbWVudCBpcyBtdXRhdGVkLlxuICAgIC8vIEl0IGlzIGludGVuZGVkIHRvIGtlZXAgdGhlIG9mZnNldCBpbiBzeW5jIHdpdGggdGhlIHRpbWV6b25lLlxuICAgIHV0aWxzX2hvb2tzX19ob29rcy51cGRhdGVPZmZzZXQgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIC8vIGtlZXBMb2NhbFRpbWUgPSB0cnVlIG1lYW5zIG9ubHkgY2hhbmdlIHRoZSB0aW1lem9uZSwgd2l0aG91dFxuICAgIC8vIGFmZmVjdGluZyB0aGUgbG9jYWwgaG91ci4gU28gNTozMToyNiArMDMwMCAtLVt1dGNPZmZzZXQoMiwgdHJ1ZSldLS0+XG4gICAgLy8gNTozMToyNiArMDIwMCBJdCBpcyBwb3NzaWJsZSB0aGF0IDU6MzE6MjYgZG9lc24ndCBleGlzdCB3aXRoIG9mZnNldFxuICAgIC8vICswMjAwLCBzbyB3ZSBhZGp1c3QgdGhlIHRpbWUgYXMgbmVlZGVkLCB0byBiZSB2YWxpZC5cbiAgICAvL1xuICAgIC8vIEtlZXBpbmcgdGhlIHRpbWUgYWN0dWFsbHkgYWRkcy9zdWJ0cmFjdHMgKG9uZSBob3VyKVxuICAgIC8vIGZyb20gdGhlIGFjdHVhbCByZXByZXNlbnRlZCB0aW1lLiBUaGF0IGlzIHdoeSB3ZSBjYWxsIHVwZGF0ZU9mZnNldFxuICAgIC8vIGEgc2Vjb25kIHRpbWUuIEluIGNhc2UgaXQgd2FudHMgdXMgdG8gY2hhbmdlIHRoZSBvZmZzZXQgYWdhaW5cbiAgICAvLyBfY2hhbmdlSW5Qcm9ncmVzcyA9PSB0cnVlIGNhc2UsIHRoZW4gd2UgaGF2ZSB0byBhZGp1c3QsIGJlY2F1c2VcbiAgICAvLyB0aGVyZSBpcyBubyBzdWNoIHRpbWUgaW4gdGhlIGdpdmVuIHRpbWV6b25lLlxuICAgIGZ1bmN0aW9uIGdldFNldE9mZnNldCAoaW5wdXQsIGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuX29mZnNldCB8fCAwLFxuICAgICAgICAgICAgbG9jYWxBZGp1c3Q7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gb2Zmc2V0RnJvbVN0cmluZyhpbnB1dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoaW5wdXQpIDwgMTYpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0ICogNjA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2lzVVRDICYmIGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgICAgICAgICBsb2NhbEFkanVzdCA9IGdldERhdGVPZmZzZXQodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9vZmZzZXQgPSBpbnB1dDtcbiAgICAgICAgICAgIHRoaXMuX2lzVVRDID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChsb2NhbEFkanVzdCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGQobG9jYWxBZGp1c3QsICdtJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob2Zmc2V0ICE9PSBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGlmICgha2VlcExvY2FsVGltZSB8fCB0aGlzLl9jaGFuZ2VJblByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZF9zdWJ0cmFjdF9fYWRkU3VidHJhY3QodGhpcywgY3JlYXRlX19jcmVhdGVEdXJhdGlvbihpbnB1dCAtIG9mZnNldCwgJ20nKSwgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy51cGRhdGVPZmZzZXQodGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gb2Zmc2V0IDogZ2V0RGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldFpvbmUgKGlucHV0LCBrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gLWlucHV0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldChpbnB1dCwga2VlcExvY2FsVGltZSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIC10aGlzLnV0Y09mZnNldCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2Zmc2V0VG9VVEMgKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXRjT2Zmc2V0KDAsIGtlZXBMb2NhbFRpbWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldE9mZnNldFRvTG9jYWwgKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzVVRDKSB7XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldCgwLCBrZWVwTG9jYWxUaW1lKTtcbiAgICAgICAgICAgIHRoaXMuX2lzVVRDID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmIChrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJ0cmFjdChnZXREYXRlT2Zmc2V0KHRoaXMpLCAnbScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldE9mZnNldFRvUGFyc2VkT2Zmc2V0ICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3R6bSkge1xuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQodGhpcy5fdHptKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5faSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KG9mZnNldEZyb21TdHJpbmcodGhpcy5faSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhc0FsaWduZWRIb3VyT2Zmc2V0IChpbnB1dCkge1xuICAgICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgICAgICBpbnB1dCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpbnB1dCA9IGxvY2FsX19jcmVhdGVMb2NhbChpbnB1dCkudXRjT2Zmc2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKHRoaXMudXRjT2Zmc2V0KCkgLSBpbnB1dCkgJSA2MCA9PT0gMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RheWxpZ2h0U2F2aW5nVGltZSAoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldCgpID4gdGhpcy5jbG9uZSgpLm1vbnRoKDApLnV0Y09mZnNldCgpIHx8XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldCgpID4gdGhpcy5jbG9uZSgpLm1vbnRoKDUpLnV0Y09mZnNldCgpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEYXlsaWdodFNhdmluZ1RpbWVTaGlmdGVkICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2EpIHtcbiAgICAgICAgICAgIHZhciBvdGhlciA9IHRoaXMuX2lzVVRDID8gY3JlYXRlX3V0Y19fY3JlYXRlVVRDKHRoaXMuX2EpIDogbG9jYWxfX2NyZWF0ZUxvY2FsKHRoaXMuX2EpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpICYmIGNvbXBhcmVBcnJheXModGhpcy5fYSwgb3RoZXIudG9BcnJheSgpKSA+IDA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNMb2NhbCAoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5faXNVVEM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNVdGNPZmZzZXQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNVVEM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNVdGMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgJiYgdGhpcy5fb2Zmc2V0ID09PSAwO1xuICAgIH1cblxuICAgIHZhciBhc3BOZXRSZWdleCA9IC8oXFwtKT8oPzooXFxkKilcXC4pPyhcXGQrKVxcOihcXGQrKSg/OlxcOihcXGQrKVxcLj8oXFxkezN9KT8pPy87XG5cbiAgICAvLyBmcm9tIGh0dHA6Ly9kb2NzLmNsb3N1cmUtbGlicmFyeS5nb29nbGVjb2RlLmNvbS9naXQvY2xvc3VyZV9nb29nX2RhdGVfZGF0ZS5qcy5zb3VyY2UuaHRtbFxuICAgIC8vIHNvbWV3aGF0IG1vcmUgaW4gbGluZSB3aXRoIDQuNC4zLjIgMjAwNCBzcGVjLCBidXQgYWxsb3dzIGRlY2ltYWwgYW55d2hlcmVcbiAgICB2YXIgY3JlYXRlX19pc29SZWdleCA9IC9eKC0pP1AoPzooPzooWzAtOSwuXSopWSk/KD86KFswLTksLl0qKU0pPyg/OihbMC05LC5dKilEKT8oPzpUKD86KFswLTksLl0qKUgpPyg/OihbMC05LC5dKilNKT8oPzooWzAtOSwuXSopUyk/KT98KFswLTksLl0qKVcpJC87XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uIChpbnB1dCwga2V5KSB7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGlucHV0LFxuICAgICAgICAgICAgLy8gbWF0Y2hpbmcgYWdhaW5zdCByZWdleHAgaXMgZXhwZW5zaXZlLCBkbyBpdCBvbiBkZW1hbmRcbiAgICAgICAgICAgIG1hdGNoID0gbnVsbCxcbiAgICAgICAgICAgIHNpZ24sXG4gICAgICAgICAgICByZXQsXG4gICAgICAgICAgICBkaWZmUmVzO1xuXG4gICAgICAgIGlmIChpc0R1cmF0aW9uKGlucHV0KSkge1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgbXMgOiBpbnB1dC5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgICAgIGQgIDogaW5wdXQuX2RheXMsXG4gICAgICAgICAgICAgICAgTSAgOiBpbnB1dC5fbW9udGhzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge307XG4gICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb25ba2V5XSA9IGlucHV0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbi5taWxsaXNlY29uZHMgPSBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghIShtYXRjaCA9IGFzcE5ldFJlZ2V4LmV4ZWMoaW5wdXQpKSkge1xuICAgICAgICAgICAgc2lnbiA9IChtYXRjaFsxXSA9PT0gJy0nKSA/IC0xIDogMTtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIHkgIDogMCxcbiAgICAgICAgICAgICAgICBkICA6IHRvSW50KG1hdGNoW0RBVEVdKSAgICAgICAgKiBzaWduLFxuICAgICAgICAgICAgICAgIGggIDogdG9JbnQobWF0Y2hbSE9VUl0pICAgICAgICAqIHNpZ24sXG4gICAgICAgICAgICAgICAgbSAgOiB0b0ludChtYXRjaFtNSU5VVEVdKSAgICAgICogc2lnbixcbiAgICAgICAgICAgICAgICBzICA6IHRvSW50KG1hdGNoW1NFQ09ORF0pICAgICAgKiBzaWduLFxuICAgICAgICAgICAgICAgIG1zIDogdG9JbnQobWF0Y2hbTUlMTElTRUNPTkRdKSAqIHNpZ25cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoISEobWF0Y2ggPSBjcmVhdGVfX2lzb1JlZ2V4LmV4ZWMoaW5wdXQpKSkge1xuICAgICAgICAgICAgc2lnbiA9IChtYXRjaFsxXSA9PT0gJy0nKSA/IC0xIDogMTtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIHkgOiBwYXJzZUlzbyhtYXRjaFsyXSwgc2lnbiksXG4gICAgICAgICAgICAgICAgTSA6IHBhcnNlSXNvKG1hdGNoWzNdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBkIDogcGFyc2VJc28obWF0Y2hbNF0sIHNpZ24pLFxuICAgICAgICAgICAgICAgIGggOiBwYXJzZUlzbyhtYXRjaFs1XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgbSA6IHBhcnNlSXNvKG1hdGNoWzZdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBzIDogcGFyc2VJc28obWF0Y2hbN10sIHNpZ24pLFxuICAgICAgICAgICAgICAgIHcgOiBwYXJzZUlzbyhtYXRjaFs4XSwgc2lnbilcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoZHVyYXRpb24gPT0gbnVsbCkgey8vIGNoZWNrcyBmb3IgbnVsbCBvciB1bmRlZmluZWRcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge307XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGR1cmF0aW9uID09PSAnb2JqZWN0JyAmJiAoJ2Zyb20nIGluIGR1cmF0aW9uIHx8ICd0bycgaW4gZHVyYXRpb24pKSB7XG4gICAgICAgICAgICBkaWZmUmVzID0gbW9tZW50c0RpZmZlcmVuY2UobG9jYWxfX2NyZWF0ZUxvY2FsKGR1cmF0aW9uLmZyb20pLCBsb2NhbF9fY3JlYXRlTG9jYWwoZHVyYXRpb24udG8pKTtcblxuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgICAgIGR1cmF0aW9uLm1zID0gZGlmZlJlcy5taWxsaXNlY29uZHM7XG4gICAgICAgICAgICBkdXJhdGlvbi5NID0gZGlmZlJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXQgPSBuZXcgRHVyYXRpb24oZHVyYXRpb24pO1xuXG4gICAgICAgIGlmIChpc0R1cmF0aW9uKGlucHV0KSAmJiBoYXNPd25Qcm9wKGlucHV0LCAnX2xvY2FsZScpKSB7XG4gICAgICAgICAgICByZXQuX2xvY2FsZSA9IGlucHV0Ll9sb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24uZm4gPSBEdXJhdGlvbi5wcm90b3R5cGU7XG5cbiAgICBmdW5jdGlvbiBwYXJzZUlzbyAoaW5wLCBzaWduKSB7XG4gICAgICAgIC8vIFdlJ2Qgbm9ybWFsbHkgdXNlIH5+aW5wIGZvciB0aGlzLCBidXQgdW5mb3J0dW5hdGVseSBpdCBhbHNvXG4gICAgICAgIC8vIGNvbnZlcnRzIGZsb2F0cyB0byBpbnRzLlxuICAgICAgICAvLyBpbnAgbWF5IGJlIHVuZGVmaW5lZCwgc28gY2FyZWZ1bCBjYWxsaW5nIHJlcGxhY2Ugb24gaXQuXG4gICAgICAgIHZhciByZXMgPSBpbnAgJiYgcGFyc2VGbG9hdChpbnAucmVwbGFjZSgnLCcsICcuJykpO1xuICAgICAgICAvLyBhcHBseSBzaWduIHdoaWxlIHdlJ3JlIGF0IGl0XG4gICAgICAgIHJldHVybiAoaXNOYU4ocmVzKSA/IDAgOiByZXMpICogc2lnbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb3NpdGl2ZU1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKSB7XG4gICAgICAgIHZhciByZXMgPSB7bWlsbGlzZWNvbmRzOiAwLCBtb250aHM6IDB9O1xuXG4gICAgICAgIHJlcy5tb250aHMgPSBvdGhlci5tb250aCgpIC0gYmFzZS5tb250aCgpICtcbiAgICAgICAgICAgIChvdGhlci55ZWFyKCkgLSBiYXNlLnllYXIoKSkgKiAxMjtcbiAgICAgICAgaWYgKGJhc2UuY2xvbmUoKS5hZGQocmVzLm1vbnRocywgJ00nKS5pc0FmdGVyKG90aGVyKSkge1xuICAgICAgICAgICAgLS1yZXMubW9udGhzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzLm1pbGxpc2Vjb25kcyA9ICtvdGhlciAtICsoYmFzZS5jbG9uZSgpLmFkZChyZXMubW9udGhzLCAnTScpKTtcblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKSB7XG4gICAgICAgIHZhciByZXM7XG4gICAgICAgIG90aGVyID0gY2xvbmVXaXRoT2Zmc2V0KG90aGVyLCBiYXNlKTtcbiAgICAgICAgaWYgKGJhc2UuaXNCZWZvcmUob3RoZXIpKSB7XG4gICAgICAgICAgICByZXMgPSBwb3NpdGl2ZU1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcyA9IHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2Uob3RoZXIsIGJhc2UpO1xuICAgICAgICAgICAgcmVzLm1pbGxpc2Vjb25kcyA9IC1yZXMubWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgcmVzLm1vbnRocyA9IC1yZXMubW9udGhzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVBZGRlcihkaXJlY3Rpb24sIG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWwsIHBlcmlvZCkge1xuICAgICAgICAgICAgdmFyIGR1ciwgdG1wO1xuICAgICAgICAgICAgLy9pbnZlcnQgdGhlIGFyZ3VtZW50cywgYnV0IGNvbXBsYWluIGFib3V0IGl0XG4gICAgICAgICAgICBpZiAocGVyaW9kICE9PSBudWxsICYmICFpc05hTigrcGVyaW9kKSkge1xuICAgICAgICAgICAgICAgIGRlcHJlY2F0ZVNpbXBsZShuYW1lLCAnbW9tZW50KCkuJyArIG5hbWUgICsgJyhwZXJpb2QsIG51bWJlcikgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBtb21lbnQoKS4nICsgbmFtZSArICcobnVtYmVyLCBwZXJpb2QpLicpO1xuICAgICAgICAgICAgICAgIHRtcCA9IHZhbDsgdmFsID0gcGVyaW9kOyBwZXJpb2QgPSB0bXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbCA9IHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnID8gK3ZhbCA6IHZhbDtcbiAgICAgICAgICAgIGR1ciA9IGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24odmFsLCBwZXJpb2QpO1xuICAgICAgICAgICAgYWRkX3N1YnRyYWN0X19hZGRTdWJ0cmFjdCh0aGlzLCBkdXIsIGRpcmVjdGlvbik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRfc3VidHJhY3RfX2FkZFN1YnRyYWN0IChtb20sIGR1cmF0aW9uLCBpc0FkZGluZywgdXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSBkdXJhdGlvbi5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgZGF5cyA9IGR1cmF0aW9uLl9kYXlzLFxuICAgICAgICAgICAgbW9udGhzID0gZHVyYXRpb24uX21vbnRocztcbiAgICAgICAgdXBkYXRlT2Zmc2V0ID0gdXBkYXRlT2Zmc2V0ID09IG51bGwgPyB0cnVlIDogdXBkYXRlT2Zmc2V0O1xuXG4gICAgICAgIGlmIChtaWxsaXNlY29uZHMpIHtcbiAgICAgICAgICAgIG1vbS5fZC5zZXRUaW1lKCttb20uX2QgKyBtaWxsaXNlY29uZHMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRheXMpIHtcbiAgICAgICAgICAgIGdldF9zZXRfX3NldChtb20sICdEYXRlJywgZ2V0X3NldF9fZ2V0KG1vbSwgJ0RhdGUnKSArIGRheXMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vbnRocykge1xuICAgICAgICAgICAgc2V0TW9udGgobW9tLCBnZXRfc2V0X19nZXQobW9tLCAnTW9udGgnKSArIG1vbnRocyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KG1vbSwgZGF5cyB8fCBtb250aHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGFkZF9zdWJ0cmFjdF9fYWRkICAgICAgPSBjcmVhdGVBZGRlcigxLCAnYWRkJyk7XG4gICAgdmFyIGFkZF9zdWJ0cmFjdF9fc3VidHJhY3QgPSBjcmVhdGVBZGRlcigtMSwgJ3N1YnRyYWN0Jyk7XG5cbiAgICBmdW5jdGlvbiBtb21lbnRfY2FsZW5kYXJfX2NhbGVuZGFyICh0aW1lKSB7XG4gICAgICAgIC8vIFdlIHdhbnQgdG8gY29tcGFyZSB0aGUgc3RhcnQgb2YgdG9kYXksIHZzIHRoaXMuXG4gICAgICAgIC8vIEdldHRpbmcgc3RhcnQtb2YtdG9kYXkgZGVwZW5kcyBvbiB3aGV0aGVyIHdlJ3JlIGxvY2FsL3V0Yy9vZmZzZXQgb3Igbm90LlxuICAgICAgICB2YXIgbm93ID0gdGltZSB8fCBsb2NhbF9fY3JlYXRlTG9jYWwoKSxcbiAgICAgICAgICAgIHNvZCA9IGNsb25lV2l0aE9mZnNldChub3csIHRoaXMpLnN0YXJ0T2YoJ2RheScpLFxuICAgICAgICAgICAgZGlmZiA9IHRoaXMuZGlmZihzb2QsICdkYXlzJywgdHJ1ZSksXG4gICAgICAgICAgICBmb3JtYXQgPSBkaWZmIDwgLTYgPyAnc2FtZUVsc2UnIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgLTEgPyAnbGFzdFdlZWsnIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgMCA/ICdsYXN0RGF5JyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IDEgPyAnc2FtZURheScgOlxuICAgICAgICAgICAgICAgIGRpZmYgPCAyID8gJ25leHREYXknIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgNyA/ICduZXh0V2VlaycgOiAnc2FtZUVsc2UnO1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXQodGhpcy5sb2NhbGVEYXRhKCkuY2FsZW5kYXIoZm9ybWF0LCB0aGlzLCBsb2NhbF9fY3JlYXRlTG9jYWwobm93KSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb25lICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNb21lbnQodGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNBZnRlciAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgIHZhciBpbnB1dE1zO1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHR5cGVvZiB1bml0cyAhPT0gJ3VuZGVmaW5lZCcgPyB1bml0cyA6ICdtaWxsaXNlY29uZCcpO1xuICAgICAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgIGlucHV0ID0gaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzID4gK2lucHV0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5wdXRNcyA9IGlzTW9tZW50KGlucHV0KSA/ICtpbnB1dCA6ICtsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0TXMgPCArdGhpcy5jbG9uZSgpLnN0YXJ0T2YodW5pdHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNCZWZvcmUgKGlucHV0LCB1bml0cykge1xuICAgICAgICB2YXIgaW5wdXRNcztcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh0eXBlb2YgdW5pdHMgIT09ICd1bmRlZmluZWQnID8gdW5pdHMgOiAnbWlsbGlzZWNvbmQnKTtcbiAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICBpbnB1dCA9IGlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiArdGhpcyA8ICtpbnB1dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0TXMgPSBpc01vbWVudChpbnB1dCkgPyAraW5wdXQgOiArbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiArdGhpcy5jbG9uZSgpLmVuZE9mKHVuaXRzKSA8IGlucHV0TXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0JldHdlZW4gKGZyb20sIHRvLCB1bml0cykge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0FmdGVyKGZyb20sIHVuaXRzKSAmJiB0aGlzLmlzQmVmb3JlKHRvLCB1bml0cyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNTYW1lIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgdmFyIGlucHV0TXM7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMgfHwgJ21pbGxpc2Vjb25kJyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgaW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGxvY2FsX19jcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gK3RoaXMgPT09ICtpbnB1dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0TXMgPSArbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiArKHRoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKSkgPD0gaW5wdXRNcyAmJiBpbnB1dE1zIDw9ICsodGhpcy5jbG9uZSgpLmVuZE9mKHVuaXRzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhYnNGbG9vciAobnVtYmVyKSB7XG4gICAgICAgIGlmIChudW1iZXIgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKG51bWJlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihudW1iZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlmZiAoaW5wdXQsIHVuaXRzLCBhc0Zsb2F0KSB7XG4gICAgICAgIHZhciB0aGF0ID0gY2xvbmVXaXRoT2Zmc2V0KGlucHV0LCB0aGlzKSxcbiAgICAgICAgICAgIHpvbmVEZWx0YSA9ICh0aGF0LnV0Y09mZnNldCgpIC0gdGhpcy51dGNPZmZzZXQoKSkgKiA2ZTQsXG4gICAgICAgICAgICBkZWx0YSwgb3V0cHV0O1xuXG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ3llYXInIHx8IHVuaXRzID09PSAnbW9udGgnIHx8IHVuaXRzID09PSAncXVhcnRlcicpIHtcbiAgICAgICAgICAgIG91dHB1dCA9IG1vbnRoRGlmZih0aGlzLCB0aGF0KTtcbiAgICAgICAgICAgIGlmICh1bml0cyA9PT0gJ3F1YXJ0ZXInKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0IC8gMztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodW5pdHMgPT09ICd5ZWFyJykge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dCAvIDEyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsdGEgPSB0aGlzIC0gdGhhdDtcbiAgICAgICAgICAgIG91dHB1dCA9IHVuaXRzID09PSAnc2Vjb25kJyA/IGRlbHRhIC8gMWUzIDogLy8gMTAwMFxuICAgICAgICAgICAgICAgIHVuaXRzID09PSAnbWludXRlJyA/IGRlbHRhIC8gNmU0IDogLy8gMTAwMCAqIDYwXG4gICAgICAgICAgICAgICAgdW5pdHMgPT09ICdob3VyJyA/IGRlbHRhIC8gMzZlNSA6IC8vIDEwMDAgKiA2MCAqIDYwXG4gICAgICAgICAgICAgICAgdW5pdHMgPT09ICdkYXknID8gKGRlbHRhIC0gem9uZURlbHRhKSAvIDg2NGU1IDogLy8gMTAwMCAqIDYwICogNjAgKiAyNCwgbmVnYXRlIGRzdFxuICAgICAgICAgICAgICAgIHVuaXRzID09PSAnd2VlaycgPyAoZGVsdGEgLSB6b25lRGVsdGEpIC8gNjA0OGU1IDogLy8gMTAwMCAqIDYwICogNjAgKiAyNCAqIDcsIG5lZ2F0ZSBkc3RcbiAgICAgICAgICAgICAgICBkZWx0YTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXNGbG9hdCA/IG91dHB1dCA6IGFic0Zsb29yKG91dHB1dCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9udGhEaWZmIChhLCBiKSB7XG4gICAgICAgIC8vIGRpZmZlcmVuY2UgaW4gbW9udGhzXG4gICAgICAgIHZhciB3aG9sZU1vbnRoRGlmZiA9ICgoYi55ZWFyKCkgLSBhLnllYXIoKSkgKiAxMikgKyAoYi5tb250aCgpIC0gYS5tb250aCgpKSxcbiAgICAgICAgICAgIC8vIGIgaXMgaW4gKGFuY2hvciAtIDEgbW9udGgsIGFuY2hvciArIDEgbW9udGgpXG4gICAgICAgICAgICBhbmNob3IgPSBhLmNsb25lKCkuYWRkKHdob2xlTW9udGhEaWZmLCAnbW9udGhzJyksXG4gICAgICAgICAgICBhbmNob3IyLCBhZGp1c3Q7XG5cbiAgICAgICAgaWYgKGIgLSBhbmNob3IgPCAwKSB7XG4gICAgICAgICAgICBhbmNob3IyID0gYS5jbG9uZSgpLmFkZCh3aG9sZU1vbnRoRGlmZiAtIDEsICdtb250aHMnKTtcbiAgICAgICAgICAgIC8vIGxpbmVhciBhY3Jvc3MgdGhlIG1vbnRoXG4gICAgICAgICAgICBhZGp1c3QgPSAoYiAtIGFuY2hvcikgLyAoYW5jaG9yIC0gYW5jaG9yMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbmNob3IyID0gYS5jbG9uZSgpLmFkZCh3aG9sZU1vbnRoRGlmZiArIDEsICdtb250aHMnKTtcbiAgICAgICAgICAgIC8vIGxpbmVhciBhY3Jvc3MgdGhlIG1vbnRoXG4gICAgICAgICAgICBhZGp1c3QgPSAoYiAtIGFuY2hvcikgLyAoYW5jaG9yMiAtIGFuY2hvcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gLSh3aG9sZU1vbnRoRGlmZiArIGFkanVzdCk7XG4gICAgfVxuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmRlZmF1bHRGb3JtYXQgPSAnWVlZWS1NTS1ERFRISDptbTpzc1onO1xuXG4gICAgZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxvY2FsZSgnZW4nKS5mb3JtYXQoJ2RkZCBNTU0gREQgWVlZWSBISDptbTpzcyBbR01UXVpaJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50X2Zvcm1hdF9fdG9JU09TdHJpbmcgKCkge1xuICAgICAgICB2YXIgbSA9IHRoaXMuY2xvbmUoKS51dGMoKTtcbiAgICAgICAgaWYgKDAgPCBtLnllYXIoKSAmJiBtLnllYXIoKSA8PSA5OTk5KSB7XG4gICAgICAgICAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIERhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgLy8gbmF0aXZlIGltcGxlbWVudGF0aW9uIGlzIH41MHggZmFzdGVyLCB1c2UgaXQgd2hlbiB3ZSBjYW5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b0RhdGUoKS50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0TW9tZW50KG0sICdZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0TW9tZW50KG0sICdZWVlZWVktTU0tRERbVF1ISDptbTpzcy5TU1NbWl0nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdCAoaW5wdXRTdHJpbmcpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IGZvcm1hdE1vbWVudCh0aGlzLCBpbnB1dFN0cmluZyB8fCB1dGlsc19ob29rc19faG9va3MuZGVmYXVsdEZvcm1hdCk7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5wb3N0Zm9ybWF0KG91dHB1dCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZnJvbSAodGltZSwgd2l0aG91dFN1ZmZpeCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3JlYXRlX19jcmVhdGVEdXJhdGlvbih7dG86IHRoaXMsIGZyb206IHRpbWV9KS5sb2NhbGUodGhpcy5sb2NhbGUoKSkuaHVtYW5pemUoIXdpdGhvdXRTdWZmaXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZyb21Ob3cgKHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJvbShsb2NhbF9fY3JlYXRlTG9jYWwoKSwgd2l0aG91dFN1ZmZpeCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG8gKHRpbWUsIHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24oe2Zyb206IHRoaXMsIHRvOiB0aW1lfSkubG9jYWxlKHRoaXMubG9jYWxlKCkpLmh1bWFuaXplKCF3aXRob3V0U3VmZml4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b05vdyAod2l0aG91dFN1ZmZpeCkge1xuICAgICAgICByZXR1cm4gdGhpcy50byhsb2NhbF9fY3JlYXRlTG9jYWwoKSwgd2l0aG91dFN1ZmZpeCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlIChrZXkpIHtcbiAgICAgICAgdmFyIG5ld0xvY2FsZURhdGE7XG5cbiAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlLl9hYmJyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3TG9jYWxlRGF0YSA9IGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUoa2V5KTtcbiAgICAgICAgICAgIGlmIChuZXdMb2NhbGVEYXRhICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2NhbGUgPSBuZXdMb2NhbGVEYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGFuZyA9IGRlcHJlY2F0ZShcbiAgICAgICAgJ21vbWVudCgpLmxhbmcoKSBpcyBkZXByZWNhdGVkLiBJbnN0ZWFkLCB1c2UgbW9tZW50KCkubG9jYWxlRGF0YSgpIHRvIGdldCB0aGUgbGFuZ3VhZ2UgY29uZmlndXJhdGlvbi4gVXNlIG1vbWVudCgpLmxvY2FsZSgpIHRvIGNoYW5nZSBsYW5ndWFnZXMuJyxcbiAgICAgICAgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGUoa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICk7XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVEYXRhICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGFydE9mICh1bml0cykge1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgLy8gdGhlIGZvbGxvd2luZyBzd2l0Y2ggaW50ZW50aW9uYWxseSBvbWl0cyBicmVhayBrZXl3b3Jkc1xuICAgICAgICAvLyB0byB1dGlsaXplIGZhbGxpbmcgdGhyb3VnaCB0aGUgY2FzZXMuXG4gICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgY2FzZSAneWVhcic6XG4gICAgICAgICAgICB0aGlzLm1vbnRoKDApO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdxdWFydGVyJzpcbiAgICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICAgICAgdGhpcy5kYXRlKDEpO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICd3ZWVrJzpcbiAgICAgICAgY2FzZSAnaXNvV2Vlayc6XG4gICAgICAgIGNhc2UgJ2RheSc6XG4gICAgICAgICAgICB0aGlzLmhvdXJzKDApO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdob3VyJzpcbiAgICAgICAgICAgIHRoaXMubWludXRlcygwKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnbWludXRlJzpcbiAgICAgICAgICAgIHRoaXMuc2Vjb25kcygwKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnc2Vjb25kJzpcbiAgICAgICAgICAgIHRoaXMubWlsbGlzZWNvbmRzKDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2Vla3MgYXJlIGEgc3BlY2lhbCBjYXNlXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ3dlZWsnKSB7XG4gICAgICAgICAgICB0aGlzLndlZWtkYXkoMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVuaXRzID09PSAnaXNvV2VlaycpIHtcbiAgICAgICAgICAgIHRoaXMuaXNvV2Vla2RheSgxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHF1YXJ0ZXJzIGFyZSBhbHNvIHNwZWNpYWxcbiAgICAgICAgaWYgKHVuaXRzID09PSAncXVhcnRlcicpIHtcbiAgICAgICAgICAgIHRoaXMubW9udGgoTWF0aC5mbG9vcih0aGlzLm1vbnRoKCkgLyAzKSAqIDMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5kT2YgKHVuaXRzKSB7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICBpZiAodW5pdHMgPT09IHVuZGVmaW5lZCB8fCB1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnRPZih1bml0cykuYWRkKDEsICh1bml0cyA9PT0gJ2lzb1dlZWsnID8gJ3dlZWsnIDogdW5pdHMpKS5zdWJ0cmFjdCgxLCAnbXMnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b190eXBlX192YWx1ZU9mICgpIHtcbiAgICAgICAgcmV0dXJuICt0aGlzLl9kIC0gKCh0aGlzLl9vZmZzZXQgfHwgMCkgKiA2MDAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5peCAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKCt0aGlzIC8gMTAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9EYXRlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29mZnNldCA/IG5ldyBEYXRlKCt0aGlzKSA6IHRoaXMuX2Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9BcnJheSAoKSB7XG4gICAgICAgIHZhciBtID0gdGhpcztcbiAgICAgICAgcmV0dXJuIFttLnllYXIoKSwgbS5tb250aCgpLCBtLmRhdGUoKSwgbS5ob3VyKCksIG0ubWludXRlKCksIG0uc2Vjb25kKCksIG0ubWlsbGlzZWNvbmQoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50X3ZhbGlkX19pc1ZhbGlkICgpIHtcbiAgICAgICAgcmV0dXJuIHZhbGlkX19pc1ZhbGlkKHRoaXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNpbmdGbGFncyAoKSB7XG4gICAgICAgIHJldHVybiBleHRlbmQoe30sIGdldFBhcnNpbmdGbGFncyh0aGlzKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW52YWxpZEF0ICgpIHtcbiAgICAgICAgcmV0dXJuIGdldFBhcnNpbmdGbGFncyh0aGlzKS5vdmVyZmxvdztcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ2dnJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2Vla1llYXIoKSAlIDEwMDtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnR0cnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc29XZWVrWWVhcigpICUgMTAwO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gYWRkV2Vla1llYXJGb3JtYXRUb2tlbiAodG9rZW4sIGdldHRlcikge1xuICAgICAgICBhZGRGb3JtYXRUb2tlbigwLCBbdG9rZW4sIHRva2VuLmxlbmd0aF0sIDAsIGdldHRlcik7XG4gICAgfVxuXG4gICAgYWRkV2Vla1llYXJGb3JtYXRUb2tlbignZ2dnZycsICAgICAnd2Vla1llYXInKTtcbiAgICBhZGRXZWVrWWVhckZvcm1hdFRva2VuKCdnZ2dnZycsICAgICd3ZWVrWWVhcicpO1xuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ0dHR0cnLCAgJ2lzb1dlZWtZZWFyJyk7XG4gICAgYWRkV2Vla1llYXJGb3JtYXRUb2tlbignR0dHR0cnLCAnaXNvV2Vla1llYXInKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnd2Vla1llYXInLCAnZ2cnKTtcbiAgICBhZGRVbml0QWxpYXMoJ2lzb1dlZWtZZWFyJywgJ0dHJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdHJywgICAgICBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignZycsICAgICAgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0dHJywgICAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdnZycsICAgICBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignR0dHRycsICAgbWF0Y2gxdG80LCBtYXRjaDQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2dnZ2cnLCAgIG1hdGNoMXRvNCwgbWF0Y2g0KTtcbiAgICBhZGRSZWdleFRva2VuKCdHR0dHRycsICBtYXRjaDF0bzYsIG1hdGNoNik7XG4gICAgYWRkUmVnZXhUb2tlbignZ2dnZ2cnLCAgbWF0Y2gxdG82LCBtYXRjaDYpO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWydnZ2dnJywgJ2dnZ2dnJywgJ0dHR0cnLCAnR0dHR0cnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHdlZWtbdG9rZW4uc3Vic3RyKDAsIDIpXSA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZ2cnLCAnR0cnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHdlZWtbdG9rZW5dID0gdXRpbHNfaG9va3NfX2hvb2tzLnBhcnNlVHdvRGlnaXRZZWFyKGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIGZ1bmN0aW9uIHdlZWtzSW5ZZWFyKHllYXIsIGRvdywgZG95KSB7XG4gICAgICAgIHJldHVybiB3ZWVrT2ZZZWFyKGxvY2FsX19jcmVhdGVMb2NhbChbeWVhciwgMTEsIDMxICsgZG93IC0gZG95XSksIGRvdywgZG95KS53ZWVrO1xuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldFdlZWtZZWFyIChpbnB1dCkge1xuICAgICAgICB2YXIgeWVhciA9IHdlZWtPZlllYXIodGhpcywgdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG93LCB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3kpLnllYXI7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8geWVhciA6IHRoaXMuYWRkKChpbnB1dCAtIHllYXIpLCAneScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldElTT1dlZWtZZWFyIChpbnB1dCkge1xuICAgICAgICB2YXIgeWVhciA9IHdlZWtPZlllYXIodGhpcywgMSwgNCkueWVhcjtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB5ZWFyIDogdGhpcy5hZGQoKGlucHV0IC0geWVhciksICd5Jyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0SVNPV2Vla3NJblllYXIgKCkge1xuICAgICAgICByZXR1cm4gd2Vla3NJblllYXIodGhpcy55ZWFyKCksIDEsIDQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFdlZWtzSW5ZZWFyICgpIHtcbiAgICAgICAgdmFyIHdlZWtJbmZvID0gdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWs7XG4gICAgICAgIHJldHVybiB3ZWVrc0luWWVhcih0aGlzLnllYXIoKSwgd2Vla0luZm8uZG93LCB3ZWVrSW5mby5kb3kpO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKCdRJywgMCwgMCwgJ3F1YXJ0ZXInKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygncXVhcnRlcicsICdRJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdRJywgbWF0Y2gxKTtcbiAgICBhZGRQYXJzZVRva2VuKCdRJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtNT05USF0gPSAodG9JbnQoaW5wdXQpIC0gMSkgKiAzO1xuICAgIH0pO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0UXVhcnRlciAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyBNYXRoLmNlaWwoKHRoaXMubW9udGgoKSArIDEpIC8gMykgOiB0aGlzLm1vbnRoKChpbnB1dCAtIDEpICogMyArIHRoaXMubW9udGgoKSAlIDMpO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKCdEJywgWydERCcsIDJdLCAnRG8nLCAnZGF0ZScpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdkYXRlJywgJ0QnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ0QnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdERCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdEbycsIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBpc1N0cmljdCA/IGxvY2FsZS5fb3JkaW5hbFBhcnNlIDogbG9jYWxlLl9vcmRpbmFsUGFyc2VMZW5pZW50O1xuICAgIH0pO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ0QnLCAnREQnXSwgREFURSk7XG4gICAgYWRkUGFyc2VUb2tlbignRG8nLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W0RBVEVdID0gdG9JbnQoaW5wdXQubWF0Y2gobWF0Y2gxdG8yKVswXSwgMTApO1xuICAgIH0pO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldERheU9mTW9udGggPSBtYWtlR2V0U2V0KCdEYXRlJywgdHJ1ZSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZCcsIDAsICdkbycsICdkYXknKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdkZCcsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzTWluKHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZGRkJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXNTaG9ydCh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2RkZGQnLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5cyh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2UnLCAwLCAwLCAnd2Vla2RheScpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdFJywgMCwgMCwgJ2lzb1dlZWtkYXknKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnZGF5JywgJ2QnKTtcbiAgICBhZGRVbml0QWxpYXMoJ3dlZWtkYXknLCAnZScpO1xuICAgIGFkZFVuaXRBbGlhcygnaXNvV2Vla2RheScsICdFJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdkJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdlJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdFJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdkZCcsICAgbWF0Y2hXb3JkKTtcbiAgICBhZGRSZWdleFRva2VuKCdkZGQnLCAgbWF0Y2hXb3JkKTtcbiAgICBhZGRSZWdleFRva2VuKCdkZGRkJywgbWF0Y2hXb3JkKTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZGQnLCAnZGRkJywgJ2RkZGQnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcpIHtcbiAgICAgICAgdmFyIHdlZWtkYXkgPSBjb25maWcuX2xvY2FsZS53ZWVrZGF5c1BhcnNlKGlucHV0KTtcbiAgICAgICAgLy8gaWYgd2UgZGlkbid0IGdldCBhIHdlZWtkYXkgbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkXG4gICAgICAgIGlmICh3ZWVrZGF5ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHdlZWsuZCA9IHdlZWtkYXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkV2Vla2RheSA9IGlucHV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ2QnLCAnZScsICdFJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuXSA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIGZ1bmN0aW9uIHBhcnNlV2Vla2RheShpbnB1dCwgbG9jYWxlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAoIWlzTmFOKGlucHV0KSkge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gcGFyc2VJbnQoaW5wdXQsIDEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gbG9jYWxlLndlZWtkYXlzUGFyc2UoaW5wdXQpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgfVxuXG4gICAgLy8gTE9DQUxFU1xuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5cyA9ICdTdW5kYXlfTW9uZGF5X1R1ZXNkYXlfV2VkbmVzZGF5X1RodXJzZGF5X0ZyaWRheV9TYXR1cmRheScuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5cyAobSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNbbS5kYXkoKV07XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5c1Nob3J0ID0gJ1N1bl9Nb25fVHVlX1dlZF9UaHVfRnJpX1NhdCcuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5c1Nob3J0IChtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1Nob3J0W20uZGF5KCldO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlV2Vla2RheXNNaW4gPSAnU3VfTW9fVHVfV2VfVGhfRnJfU2EnLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlV2Vla2RheXNNaW4gKG0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzTWluW20uZGF5KCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzUGFyc2UgKHdlZWtkYXlOYW1lKSB7XG4gICAgICAgIHZhciBpLCBtb20sIHJlZ2V4O1xuXG4gICAgICAgIGlmICghdGhpcy5fd2Vla2RheXNQYXJzZSkge1xuICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICBtb20gPSBsb2NhbF9fY3JlYXRlTG9jYWwoWzIwMDAsIDFdKS5kYXkoaSk7XG4gICAgICAgICAgICAgICAgcmVnZXggPSAnXicgKyB0aGlzLndlZWtkYXlzKG1vbSwgJycpICsgJ3xeJyArIHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKSArICd8XicgKyB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKHJlZ2V4LnJlcGxhY2UoJy4nLCAnJyksICdpJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICAgICAgaWYgKHRoaXMuX3dlZWtkYXlzUGFyc2VbaV0udGVzdCh3ZWVrZGF5TmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldERheU9mV2VlayAoaW5wdXQpIHtcbiAgICAgICAgdmFyIGRheSA9IHRoaXMuX2lzVVRDID8gdGhpcy5fZC5nZXRVVENEYXkoKSA6IHRoaXMuX2QuZ2V0RGF5KCk7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpbnB1dCA9IHBhcnNlV2Vla2RheShpbnB1dCwgdGhpcy5sb2NhbGVEYXRhKCkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkKGlucHV0IC0gZGF5LCAnZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRheTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldExvY2FsZURheU9mV2VlayAoaW5wdXQpIHtcbiAgICAgICAgdmFyIHdlZWtkYXkgPSAodGhpcy5kYXkoKSArIDcgLSB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3cpICUgNztcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrZGF5IDogdGhpcy5hZGQoaW5wdXQgLSB3ZWVrZGF5LCAnZCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldElTT0RheU9mV2VlayAoaW5wdXQpIHtcbiAgICAgICAgLy8gYmVoYXZlcyB0aGUgc2FtZSBhcyBtb21lbnQjZGF5IGV4Y2VwdFxuICAgICAgICAvLyBhcyBhIGdldHRlciwgcmV0dXJucyA3IGluc3RlYWQgb2YgMCAoMS03IHJhbmdlIGluc3RlYWQgb2YgMC02KVxuICAgICAgICAvLyBhcyBhIHNldHRlciwgc3VuZGF5IHNob3VsZCBiZWxvbmcgdG8gdGhlIHByZXZpb3VzIHdlZWsuXG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gdGhpcy5kYXkoKSB8fCA3IDogdGhpcy5kYXkodGhpcy5kYXkoKSAlIDcgPyBpbnB1dCA6IGlucHV0IC0gNyk7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0gnLCBbJ0hIJywgMl0sIDAsICdob3VyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ2gnLCBbJ2hoJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaG91cnMoKSAlIDEyIHx8IDEyO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gbWVyaWRpZW0gKHRva2VuLCBsb3dlcmNhc2UpIHtcbiAgICAgICAgYWRkRm9ybWF0VG9rZW4odG9rZW4sIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tZXJpZGllbSh0aGlzLmhvdXJzKCksIHRoaXMubWludXRlcygpLCBsb3dlcmNhc2UpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBtZXJpZGllbSgnYScsIHRydWUpO1xuICAgIG1lcmlkaWVtKCdBJywgZmFsc2UpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdob3VyJywgJ2gnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGZ1bmN0aW9uIG1hdGNoTWVyaWRpZW0gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS5fbWVyaWRpZW1QYXJzZTtcbiAgICB9XG5cbiAgICBhZGRSZWdleFRva2VuKCdhJywgIG1hdGNoTWVyaWRpZW0pO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0EnLCAgbWF0Y2hNZXJpZGllbSk7XG4gICAgYWRkUmVnZXhUb2tlbignSCcsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2gnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdISCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdoaCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydIJywgJ0hIJ10sIEhPVVIpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydhJywgJ0EnXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5faXNQbSA9IGNvbmZpZy5fbG9jYWxlLmlzUE0oaW5wdXQpO1xuICAgICAgICBjb25maWcuX21lcmlkaWVtID0gaW5wdXQ7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbihbJ2gnLCAnaGgnXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGFycmF5W0hPVVJdID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIC8vIExPQ0FMRVNcblxuICAgIGZ1bmN0aW9uIGxvY2FsZUlzUE0gKGlucHV0KSB7XG4gICAgICAgIC8vIElFOCBRdWlya3MgTW9kZSAmIElFNyBTdGFuZGFyZHMgTW9kZSBkbyBub3QgYWxsb3cgYWNjZXNzaW5nIHN0cmluZ3MgbGlrZSBhcnJheXNcbiAgICAgICAgLy8gVXNpbmcgY2hhckF0IHNob3VsZCBiZSBtb3JlIGNvbXBhdGlibGUuXG4gICAgICAgIHJldHVybiAoKGlucHV0ICsgJycpLnRvTG93ZXJDYXNlKCkuY2hhckF0KDApID09PSAncCcpO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlTWVyaWRpZW1QYXJzZSA9IC9bYXBdXFwuP20/XFwuPy9pO1xuICAgIGZ1bmN0aW9uIGxvY2FsZU1lcmlkaWVtIChob3VycywgbWludXRlcywgaXNMb3dlcikge1xuICAgICAgICBpZiAoaG91cnMgPiAxMSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzTG93ZXIgPyAncG0nIDogJ1BNJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpc0xvd2VyID8gJ2FtJyA6ICdBTSc7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIC8vIFNldHRpbmcgdGhlIGhvdXIgc2hvdWxkIGtlZXAgdGhlIHRpbWUsIGJlY2F1c2UgdGhlIHVzZXIgZXhwbGljaXRseVxuICAgIC8vIHNwZWNpZmllZCB3aGljaCBob3VyIGhlIHdhbnRzLiBTbyB0cnlpbmcgdG8gbWFpbnRhaW4gdGhlIHNhbWUgaG91ciAoaW5cbiAgICAvLyBhIG5ldyB0aW1lem9uZSkgbWFrZXMgc2Vuc2UuIEFkZGluZy9zdWJ0cmFjdGluZyBob3VycyBkb2VzIG5vdCBmb2xsb3dcbiAgICAvLyB0aGlzIHJ1bGUuXG4gICAgdmFyIGdldFNldEhvdXIgPSBtYWtlR2V0U2V0KCdIb3VycycsIHRydWUpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ20nLCBbJ21tJywgMl0sIDAsICdtaW51dGUnKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnbWludXRlJywgJ20nKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ20nLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdtbScsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRQYXJzZVRva2VuKFsnbScsICdtbSddLCBNSU5VVEUpO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldE1pbnV0ZSA9IG1ha2VHZXRTZXQoJ01pbnV0ZXMnLCBmYWxzZSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigncycsIFsnc3MnLCAyXSwgMCwgJ3NlY29uZCcpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdzZWNvbmQnLCAncycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbigncycsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ3NzJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydzJywgJ3NzJ10sIFNFQ09ORCk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0U2Vjb25kID0gbWFrZUdldFNldCgnU2Vjb25kcycsIGZhbHNlKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdTJywgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gfn4odGhpcy5taWxsaXNlY29uZCgpIC8gMTAwKTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1MnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gfn4odGhpcy5taWxsaXNlY29uZCgpIC8gMTApO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gbWlsbGlzZWNvbmRfX21pbGxpc2Vjb25kcyAodG9rZW4pIHtcbiAgICAgICAgYWRkRm9ybWF0VG9rZW4oMCwgW3Rva2VuLCAzXSwgMCwgJ21pbGxpc2Vjb25kJyk7XG4gICAgfVxuXG4gICAgbWlsbGlzZWNvbmRfX21pbGxpc2Vjb25kcygnU1NTJyk7XG4gICAgbWlsbGlzZWNvbmRfX21pbGxpc2Vjb25kcygnU1NTUycpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtaWxsaXNlY29uZCcsICdtcycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignUycsICAgIG1hdGNoMXRvMywgbWF0Y2gxKTtcbiAgICBhZGRSZWdleFRva2VuKCdTUycsICAgbWF0Y2gxdG8zLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1NTUycsICBtYXRjaDF0bzMsIG1hdGNoMyk7XG4gICAgYWRkUmVnZXhUb2tlbignU1NTUycsIG1hdGNoVW5zaWduZWQpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydTJywgJ1NTJywgJ1NTUycsICdTU1NTJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbTUlMTElTRUNPTkRdID0gdG9JbnQoKCcwLicgKyBpbnB1dCkgKiAxMDAwKTtcbiAgICB9KTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRNaWxsaXNlY29uZCA9IG1ha2VHZXRTZXQoJ01pbGxpc2Vjb25kcycsIGZhbHNlKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCd6JywgIDAsIDAsICd6b25lQWJicicpO1xuICAgIGFkZEZvcm1hdFRva2VuKCd6eicsIDAsIDAsICd6b25lTmFtZScpO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0Wm9uZUFiYnIgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyAnVVRDJyA6ICcnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFpvbmVOYW1lICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gJ0Nvb3JkaW5hdGVkIFVuaXZlcnNhbCBUaW1lJyA6ICcnO1xuICAgIH1cblxuICAgIHZhciBtb21lbnRQcm90b3R5cGVfX3Byb3RvID0gTW9tZW50LnByb3RvdHlwZTtcblxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uYWRkICAgICAgICAgID0gYWRkX3N1YnRyYWN0X19hZGQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5jYWxlbmRhciAgICAgPSBtb21lbnRfY2FsZW5kYXJfX2NhbGVuZGFyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uY2xvbmUgICAgICAgID0gY2xvbmU7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kaWZmICAgICAgICAgPSBkaWZmO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZW5kT2YgICAgICAgID0gZW5kT2Y7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5mb3JtYXQgICAgICAgPSBmb3JtYXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5mcm9tICAgICAgICAgPSBmcm9tO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZnJvbU5vdyAgICAgID0gZnJvbU5vdztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvICAgICAgICAgICA9IHRvO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9Ob3cgICAgICAgID0gdG9Ob3c7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5nZXQgICAgICAgICAgPSBnZXRTZXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pbnZhbGlkQXQgICAgPSBpbnZhbGlkQXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0FmdGVyICAgICAgPSBpc0FmdGVyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNCZWZvcmUgICAgID0gaXNCZWZvcmU7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0JldHdlZW4gICAgPSBpc0JldHdlZW47XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc1NhbWUgICAgICAgPSBpc1NhbWU7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc1ZhbGlkICAgICAgPSBtb21lbnRfdmFsaWRfX2lzVmFsaWQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5sYW5nICAgICAgICAgPSBsYW5nO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubG9jYWxlICAgICAgID0gbG9jYWxlO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubG9jYWxlRGF0YSAgID0gbG9jYWxlRGF0YTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1heCAgICAgICAgICA9IHByb3RvdHlwZU1heDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1pbiAgICAgICAgICA9IHByb3RvdHlwZU1pbjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnBhcnNpbmdGbGFncyA9IHBhcnNpbmdGbGFncztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnNldCAgICAgICAgICA9IGdldFNldDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnN0YXJ0T2YgICAgICA9IHN0YXJ0T2Y7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5zdWJ0cmFjdCAgICAgPSBhZGRfc3VidHJhY3RfX3N1YnRyYWN0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9BcnJheSAgICAgID0gdG9BcnJheTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvRGF0ZSAgICAgICA9IHRvRGF0ZTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvSVNPU3RyaW5nICA9IG1vbWVudF9mb3JtYXRfX3RvSVNPU3RyaW5nO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9KU09OICAgICAgID0gbW9tZW50X2Zvcm1hdF9fdG9JU09TdHJpbmc7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by50b1N0cmluZyAgICAgPSB0b1N0cmluZztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnVuaXggICAgICAgICA9IHVuaXg7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by52YWx1ZU9mICAgICAgPSB0b190eXBlX192YWx1ZU9mO1xuXG4gICAgLy8gWWVhclxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ueWVhciAgICAgICA9IGdldFNldFllYXI7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0xlYXBZZWFyID0gZ2V0SXNMZWFwWWVhcjtcblxuICAgIC8vIFdlZWsgWWVhclxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ud2Vla1llYXIgICAgPSBnZXRTZXRXZWVrWWVhcjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzb1dlZWtZZWFyID0gZ2V0U2V0SVNPV2Vla1llYXI7XG5cbiAgICAvLyBRdWFydGVyXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5xdWFydGVyID0gbW9tZW50UHJvdG90eXBlX19wcm90by5xdWFydGVycyA9IGdldFNldFF1YXJ0ZXI7XG5cbiAgICAvLyBNb250aFxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubW9udGggICAgICAgPSBnZXRTZXRNb250aDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmRheXNJbk1vbnRoID0gZ2V0RGF5c0luTW9udGg7XG5cbiAgICAvLyBXZWVrXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrICAgICAgICAgICA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8ud2Vla3MgICAgICAgID0gZ2V0U2V0V2VlaztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzb1dlZWsgICAgICAgID0gbW9tZW50UHJvdG90eXBlX19wcm90by5pc29XZWVrcyAgICAgPSBnZXRTZXRJU09XZWVrO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ud2Vla3NJblllYXIgICAgPSBnZXRXZWVrc0luWWVhcjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzb1dlZWtzSW5ZZWFyID0gZ2V0SVNPV2Vla3NJblllYXI7XG5cbiAgICAvLyBEYXlcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmRhdGUgICAgICAgPSBnZXRTZXREYXlPZk1vbnRoO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGF5ICAgICAgICA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGF5cyAgICAgICAgICAgICA9IGdldFNldERheU9mV2VlaztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLndlZWtkYXkgICAgPSBnZXRTZXRMb2NhbGVEYXlPZldlZWs7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc29XZWVrZGF5ID0gZ2V0U2V0SVNPRGF5T2ZXZWVrO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGF5T2ZZZWFyICA9IGdldFNldERheU9mWWVhcjtcblxuICAgIC8vIEhvdXJcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmhvdXIgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmhvdXJzID0gZ2V0U2V0SG91cjtcblxuICAgIC8vIE1pbnV0ZVxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubWludXRlID0gbW9tZW50UHJvdG90eXBlX19wcm90by5taW51dGVzID0gZ2V0U2V0TWludXRlO1xuXG4gICAgLy8gU2Vjb25kXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5zZWNvbmQgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnNlY29uZHMgPSBnZXRTZXRTZWNvbmQ7XG5cbiAgICAvLyBNaWxsaXNlY29uZFxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubWlsbGlzZWNvbmQgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1pbGxpc2Vjb25kcyA9IGdldFNldE1pbGxpc2Vjb25kO1xuXG4gICAgLy8gT2Zmc2V0XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by51dGNPZmZzZXQgICAgICAgICAgICA9IGdldFNldE9mZnNldDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnV0YyAgICAgICAgICAgICAgICAgID0gc2V0T2Zmc2V0VG9VVEM7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5sb2NhbCAgICAgICAgICAgICAgICA9IHNldE9mZnNldFRvTG9jYWw7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5wYXJzZVpvbmUgICAgICAgICAgICA9IHNldE9mZnNldFRvUGFyc2VkT2Zmc2V0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaGFzQWxpZ25lZEhvdXJPZmZzZXQgPSBoYXNBbGlnbmVkSG91ck9mZnNldDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzRFNUICAgICAgICAgICAgICAgID0gaXNEYXlsaWdodFNhdmluZ1RpbWU7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0RTVFNoaWZ0ZWQgICAgICAgICA9IGlzRGF5bGlnaHRTYXZpbmdUaW1lU2hpZnRlZDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzTG9jYWwgICAgICAgICAgICAgID0gaXNMb2NhbDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzVXRjT2Zmc2V0ICAgICAgICAgID0gaXNVdGNPZmZzZXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc1V0YyAgICAgICAgICAgICAgICA9IGlzVXRjO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNVVEMgICAgICAgICAgICAgICAgPSBpc1V0YztcblxuICAgIC8vIFRpbWV6b25lXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by56b25lQWJiciA9IGdldFpvbmVBYmJyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uem9uZU5hbWUgPSBnZXRab25lTmFtZTtcblxuICAgIC8vIERlcHJlY2F0aW9uc1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGF0ZXMgID0gZGVwcmVjYXRlKCdkYXRlcyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgZGF0ZSBpbnN0ZWFkLicsIGdldFNldERheU9mTW9udGgpO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubW9udGhzID0gZGVwcmVjYXRlKCdtb250aHMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIG1vbnRoIGluc3RlYWQnLCBnZXRTZXRNb250aCk7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by55ZWFycyAgPSBkZXByZWNhdGUoJ3llYXJzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSB5ZWFyIGluc3RlYWQnLCBnZXRTZXRZZWFyKTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnpvbmUgICA9IGRlcHJlY2F0ZSgnbW9tZW50KCkuem9uZSBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50KCkudXRjT2Zmc2V0IGluc3RlYWQuIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNzc5JywgZ2V0U2V0Wm9uZSk7XG5cbiAgICB2YXIgbW9tZW50UHJvdG90eXBlID0gbW9tZW50UHJvdG90eXBlX19wcm90bztcblxuICAgIGZ1bmN0aW9uIG1vbWVudF9fY3JlYXRlVW5peCAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsX19jcmVhdGVMb2NhbChpbnB1dCAqIDEwMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbWVudF9fY3JlYXRlSW5ab25lICgpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsX19jcmVhdGVMb2NhbC5hcHBseShudWxsLCBhcmd1bWVudHMpLnBhcnNlWm9uZSgpO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0Q2FsZW5kYXIgPSB7XG4gICAgICAgIHNhbWVEYXkgOiAnW1RvZGF5IGF0XSBMVCcsXG4gICAgICAgIG5leHREYXkgOiAnW1RvbW9ycm93IGF0XSBMVCcsXG4gICAgICAgIG5leHRXZWVrIDogJ2RkZGQgW2F0XSBMVCcsXG4gICAgICAgIGxhc3REYXkgOiAnW1llc3RlcmRheSBhdF0gTFQnLFxuICAgICAgICBsYXN0V2VlayA6ICdbTGFzdF0gZGRkZCBbYXRdIExUJyxcbiAgICAgICAgc2FtZUVsc2UgOiAnTCdcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlX2NhbGVuZGFyX19jYWxlbmRhciAoa2V5LCBtb20sIG5vdykge1xuICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5fY2FsZW5kYXJba2V5XTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvdXRwdXQgPT09ICdmdW5jdGlvbicgPyBvdXRwdXQuY2FsbChtb20sIG5vdykgOiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb25nRGF0ZUZvcm1hdCA9IHtcbiAgICAgICAgTFRTICA6ICdoOm1tOnNzIEEnLFxuICAgICAgICBMVCAgIDogJ2g6bW0gQScsXG4gICAgICAgIEwgICAgOiAnTU0vREQvWVlZWScsXG4gICAgICAgIExMICAgOiAnTU1NTSBELCBZWVlZJyxcbiAgICAgICAgTExMICA6ICdNTU1NIEQsIFlZWVkgTFQnLFxuICAgICAgICBMTExMIDogJ2RkZGQsIE1NTU0gRCwgWVlZWSBMVCdcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbG9uZ0RhdGVGb3JtYXQgKGtleSkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XTtcbiAgICAgICAgaWYgKCFvdXRwdXQgJiYgdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5LnRvVXBwZXJDYXNlKCldKSB7XG4gICAgICAgICAgICBvdXRwdXQgPSB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXkudG9VcHBlckNhc2UoKV0ucmVwbGFjZSgvTU1NTXxNTXxERHxkZGRkL2csIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsLnNsaWNlKDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXldID0gb3V0cHV0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRJbnZhbGlkRGF0ZSA9ICdJbnZhbGlkIGRhdGUnO1xuXG4gICAgZnVuY3Rpb24gaW52YWxpZERhdGUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52YWxpZERhdGU7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRPcmRpbmFsID0gJyVkJztcbiAgICB2YXIgZGVmYXVsdE9yZGluYWxQYXJzZSA9IC9cXGR7MSwyfS87XG5cbiAgICBmdW5jdGlvbiBvcmRpbmFsIChudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29yZGluYWwucmVwbGFjZSgnJWQnLCBudW1iZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZVBhcnNlUG9zdEZvcm1hdCAoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRSZWxhdGl2ZVRpbWUgPSB7XG4gICAgICAgIGZ1dHVyZSA6ICdpbiAlcycsXG4gICAgICAgIHBhc3QgICA6ICclcyBhZ28nLFxuICAgICAgICBzICA6ICdhIGZldyBzZWNvbmRzJyxcbiAgICAgICAgbSAgOiAnYSBtaW51dGUnLFxuICAgICAgICBtbSA6ICclZCBtaW51dGVzJyxcbiAgICAgICAgaCAgOiAnYW4gaG91cicsXG4gICAgICAgIGhoIDogJyVkIGhvdXJzJyxcbiAgICAgICAgZCAgOiAnYSBkYXknLFxuICAgICAgICBkZCA6ICclZCBkYXlzJyxcbiAgICAgICAgTSAgOiAnYSBtb250aCcsXG4gICAgICAgIE1NIDogJyVkIG1vbnRocycsXG4gICAgICAgIHkgIDogJ2EgeWVhcicsXG4gICAgICAgIHl5IDogJyVkIHllYXJzJ1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiByZWxhdGl2ZV9fcmVsYXRpdmVUaW1lIChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuX3JlbGF0aXZlVGltZVtzdHJpbmddO1xuICAgICAgICByZXR1cm4gKHR5cGVvZiBvdXRwdXQgPT09ICdmdW5jdGlvbicpID9cbiAgICAgICAgICAgIG91dHB1dChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIDpcbiAgICAgICAgICAgIG91dHB1dC5yZXBsYWNlKC8lZC9pLCBudW1iZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhc3RGdXR1cmUgKGRpZmYsIG91dHB1dCkge1xuICAgICAgICB2YXIgZm9ybWF0ID0gdGhpcy5fcmVsYXRpdmVUaW1lW2RpZmYgPiAwID8gJ2Z1dHVyZScgOiAncGFzdCddO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGZvcm1hdCA9PT0gJ2Z1bmN0aW9uJyA/IGZvcm1hdChvdXRwdXQpIDogZm9ybWF0LnJlcGxhY2UoLyVzL2ksIG91dHB1dCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlX3NldF9fc2V0IChjb25maWcpIHtcbiAgICAgICAgdmFyIHByb3AsIGk7XG4gICAgICAgIGZvciAoaSBpbiBjb25maWcpIHtcbiAgICAgICAgICAgIHByb3AgPSBjb25maWdbaV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIHByb3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzW2ldID0gcHJvcDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpc1snXycgKyBpXSA9IHByb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gTGVuaWVudCBvcmRpbmFsIHBhcnNpbmcgYWNjZXB0cyBqdXN0IGEgbnVtYmVyIGluIGFkZGl0aW9uIHRvXG4gICAgICAgIC8vIG51bWJlciArIChwb3NzaWJseSkgc3R1ZmYgY29taW5nIGZyb20gX29yZGluYWxQYXJzZUxlbmllbnQuXG4gICAgICAgIHRoaXMuX29yZGluYWxQYXJzZUxlbmllbnQgPSBuZXcgUmVnRXhwKHRoaXMuX29yZGluYWxQYXJzZS5zb3VyY2UgKyAnfCcgKyAoL1xcZHsxLDJ9Lykuc291cmNlKTtcbiAgICB9XG5cbiAgICB2YXIgcHJvdG90eXBlX19wcm90byA9IExvY2FsZS5wcm90b3R5cGU7XG5cbiAgICBwcm90b3R5cGVfX3Byb3RvLl9jYWxlbmRhciAgICAgICA9IGRlZmF1bHRDYWxlbmRhcjtcbiAgICBwcm90b3R5cGVfX3Byb3RvLmNhbGVuZGFyICAgICAgICA9IGxvY2FsZV9jYWxlbmRhcl9fY2FsZW5kYXI7XG4gICAgcHJvdG90eXBlX19wcm90by5fbG9uZ0RhdGVGb3JtYXQgPSBkZWZhdWx0TG9uZ0RhdGVGb3JtYXQ7XG4gICAgcHJvdG90eXBlX19wcm90by5sb25nRGF0ZUZvcm1hdCAgPSBsb25nRGF0ZUZvcm1hdDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9pbnZhbGlkRGF0ZSAgICA9IGRlZmF1bHRJbnZhbGlkRGF0ZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLmludmFsaWREYXRlICAgICA9IGludmFsaWREYXRlO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX29yZGluYWwgICAgICAgID0gZGVmYXVsdE9yZGluYWw7XG4gICAgcHJvdG90eXBlX19wcm90by5vcmRpbmFsICAgICAgICAgPSBvcmRpbmFsO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX29yZGluYWxQYXJzZSAgID0gZGVmYXVsdE9yZGluYWxQYXJzZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLnByZXBhcnNlICAgICAgICA9IHByZVBhcnNlUG9zdEZvcm1hdDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLnBvc3Rmb3JtYXQgICAgICA9IHByZVBhcnNlUG9zdEZvcm1hdDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9yZWxhdGl2ZVRpbWUgICA9IGRlZmF1bHRSZWxhdGl2ZVRpbWU7XG4gICAgcHJvdG90eXBlX19wcm90by5yZWxhdGl2ZVRpbWUgICAgPSByZWxhdGl2ZV9fcmVsYXRpdmVUaW1lO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ucGFzdEZ1dHVyZSAgICAgID0gcGFzdEZ1dHVyZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLnNldCAgICAgICAgICAgICA9IGxvY2FsZV9zZXRfX3NldDtcblxuICAgIC8vIE1vbnRoXG4gICAgcHJvdG90eXBlX19wcm90by5tb250aHMgICAgICAgPSAgICAgICAgbG9jYWxlTW9udGhzO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX21vbnRocyAgICAgID0gZGVmYXVsdExvY2FsZU1vbnRocztcbiAgICBwcm90b3R5cGVfX3Byb3RvLm1vbnRoc1Nob3J0ICA9ICAgICAgICBsb2NhbGVNb250aHNTaG9ydDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9tb250aHNTaG9ydCA9IGRlZmF1bHRMb2NhbGVNb250aHNTaG9ydDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLm1vbnRoc1BhcnNlICA9ICAgICAgICBsb2NhbGVNb250aHNQYXJzZTtcblxuICAgIC8vIFdlZWtcbiAgICBwcm90b3R5cGVfX3Byb3RvLndlZWsgPSBsb2NhbGVXZWVrO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX3dlZWsgPSBkZWZhdWx0TG9jYWxlV2VlaztcbiAgICBwcm90b3R5cGVfX3Byb3RvLmZpcnN0RGF5T2ZZZWFyID0gbG9jYWxlRmlyc3REYXlPZlllYXI7XG4gICAgcHJvdG90eXBlX19wcm90by5maXJzdERheU9mV2VlayA9IGxvY2FsZUZpcnN0RGF5T2ZXZWVrO1xuXG4gICAgLy8gRGF5IG9mIFdlZWtcbiAgICBwcm90b3R5cGVfX3Byb3RvLndlZWtkYXlzICAgICAgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX3dlZWtkYXlzICAgICAgPSBkZWZhdWx0TG9jYWxlV2Vla2RheXM7XG4gICAgcHJvdG90eXBlX19wcm90by53ZWVrZGF5c01pbiAgICA9ICAgICAgICBsb2NhbGVXZWVrZGF5c01pbjtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl93ZWVrZGF5c01pbiAgID0gZGVmYXVsdExvY2FsZVdlZWtkYXlzTWluO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ud2Vla2RheXNTaG9ydCAgPSAgICAgICAgbG9jYWxlV2Vla2RheXNTaG9ydDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl93ZWVrZGF5c1Nob3J0ID0gZGVmYXVsdExvY2FsZVdlZWtkYXlzU2hvcnQ7XG4gICAgcHJvdG90eXBlX19wcm90by53ZWVrZGF5c1BhcnNlICA9ICAgICAgICBsb2NhbGVXZWVrZGF5c1BhcnNlO1xuXG4gICAgLy8gSG91cnNcbiAgICBwcm90b3R5cGVfX3Byb3RvLmlzUE0gPSBsb2NhbGVJc1BNO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX21lcmlkaWVtUGFyc2UgPSBkZWZhdWx0TG9jYWxlTWVyaWRpZW1QYXJzZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLm1lcmlkaWVtID0gbG9jYWxlTWVyaWRpZW07XG5cbiAgICBmdW5jdGlvbiBsaXN0c19fZ2V0IChmb3JtYXQsIGluZGV4LCBmaWVsZCwgc2V0dGVyKSB7XG4gICAgICAgIHZhciBsb2NhbGUgPSBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKCk7XG4gICAgICAgIHZhciB1dGMgPSBjcmVhdGVfdXRjX19jcmVhdGVVVEMoKS5zZXQoc2V0dGVyLCBpbmRleCk7XG4gICAgICAgIHJldHVybiBsb2NhbGVbZmllbGRdKHV0YywgZm9ybWF0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0IChmb3JtYXQsIGluZGV4LCBmaWVsZCwgY291bnQsIHNldHRlcikge1xuICAgICAgICBpZiAodHlwZW9mIGZvcm1hdCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGluZGV4ID0gZm9ybWF0O1xuICAgICAgICAgICAgZm9ybWF0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8ICcnO1xuXG4gICAgICAgIGlmIChpbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbGlzdHNfX2dldChmb3JtYXQsIGluZGV4LCBmaWVsZCwgc2V0dGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgb3V0ID0gW107XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBvdXRbaV0gPSBsaXN0c19fZ2V0KGZvcm1hdCwgaSwgZmllbGQsIHNldHRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0c19fbGlzdE1vbnRocyAoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdChmb3JtYXQsIGluZGV4LCAnbW9udGhzJywgMTIsICdtb250aCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RzX19saXN0TW9udGhzU2hvcnQgKGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3QoZm9ybWF0LCBpbmRleCwgJ21vbnRoc1Nob3J0JywgMTIsICdtb250aCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RzX19saXN0V2Vla2RheXMgKGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3QoZm9ybWF0LCBpbmRleCwgJ3dlZWtkYXlzJywgNywgJ2RheScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RzX19saXN0V2Vla2RheXNTaG9ydCAoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdChmb3JtYXQsIGluZGV4LCAnd2Vla2RheXNTaG9ydCcsIDcsICdkYXknKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0c19fbGlzdFdlZWtkYXlzTWluIChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0KGZvcm1hdCwgaW5kZXgsICd3ZWVrZGF5c01pbicsIDcsICdkYXknKTtcbiAgICB9XG5cbiAgICBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlKCdlbicsIHtcbiAgICAgICAgb3JkaW5hbFBhcnNlOiAvXFxkezEsMn0odGh8c3R8bmR8cmQpLyxcbiAgICAgICAgb3JkaW5hbCA6IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgICAgIHZhciBiID0gbnVtYmVyICUgMTAsXG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gKHRvSW50KG51bWJlciAlIDEwMCAvIDEwKSA9PT0gMSkgPyAndGgnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMSkgPyAnc3QnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMikgPyAnbmQnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMykgPyAncmQnIDogJ3RoJztcbiAgICAgICAgICAgIHJldHVybiBudW1iZXIgKyBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFNpZGUgZWZmZWN0IGltcG9ydHNcbiAgICB1dGlsc19ob29rc19faG9va3MubGFuZyA9IGRlcHJlY2F0ZSgnbW9tZW50LmxhbmcgaXMgZGVwcmVjYXRlZC4gVXNlIG1vbWVudC5sb2NhbGUgaW5zdGVhZC4nLCBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlKTtcbiAgICB1dGlsc19ob29rc19faG9va3MubGFuZ0RhdGEgPSBkZXByZWNhdGUoJ21vbWVudC5sYW5nRGF0YSBpcyBkZXByZWNhdGVkLiBVc2UgbW9tZW50LmxvY2FsZURhdGEgaW5zdGVhZC4nLCBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKTtcblxuICAgIHZhciBtYXRoQWJzID0gTWF0aC5hYnM7XG5cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9hYnNfX2FicyAoKSB7XG4gICAgICAgIHZhciBkYXRhICAgICAgICAgICA9IHRoaXMuX2RhdGE7XG5cbiAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzID0gbWF0aEFicyh0aGlzLl9taWxsaXNlY29uZHMpO1xuICAgICAgICB0aGlzLl9kYXlzICAgICAgICAgPSBtYXRoQWJzKHRoaXMuX2RheXMpO1xuICAgICAgICB0aGlzLl9tb250aHMgICAgICAgPSBtYXRoQWJzKHRoaXMuX21vbnRocyk7XG5cbiAgICAgICAgZGF0YS5taWxsaXNlY29uZHMgID0gbWF0aEFicyhkYXRhLm1pbGxpc2Vjb25kcyk7XG4gICAgICAgIGRhdGEuc2Vjb25kcyAgICAgICA9IG1hdGhBYnMoZGF0YS5zZWNvbmRzKTtcbiAgICAgICAgZGF0YS5taW51dGVzICAgICAgID0gbWF0aEFicyhkYXRhLm1pbnV0ZXMpO1xuICAgICAgICBkYXRhLmhvdXJzICAgICAgICAgPSBtYXRoQWJzKGRhdGEuaG91cnMpO1xuICAgICAgICBkYXRhLm1vbnRocyAgICAgICAgPSBtYXRoQWJzKGRhdGEubW9udGhzKTtcbiAgICAgICAgZGF0YS55ZWFycyAgICAgICAgID0gbWF0aEFicyhkYXRhLnllYXJzKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9hZGRfc3VidHJhY3RfX2FkZFN1YnRyYWN0IChkdXJhdGlvbiwgaW5wdXQsIHZhbHVlLCBkaXJlY3Rpb24pIHtcbiAgICAgICAgdmFyIG90aGVyID0gY3JlYXRlX19jcmVhdGVEdXJhdGlvbihpbnB1dCwgdmFsdWUpO1xuXG4gICAgICAgIGR1cmF0aW9uLl9taWxsaXNlY29uZHMgKz0gZGlyZWN0aW9uICogb3RoZXIuX21pbGxpc2Vjb25kcztcbiAgICAgICAgZHVyYXRpb24uX2RheXMgICAgICAgICArPSBkaXJlY3Rpb24gKiBvdGhlci5fZGF5cztcbiAgICAgICAgZHVyYXRpb24uX21vbnRocyAgICAgICArPSBkaXJlY3Rpb24gKiBvdGhlci5fbW9udGhzO1xuXG4gICAgICAgIHJldHVybiBkdXJhdGlvbi5fYnViYmxlKCk7XG4gICAgfVxuXG4gICAgLy8gc3VwcG9ydHMgb25seSAyLjAtc3R5bGUgYWRkKDEsICdzJykgb3IgYWRkKGR1cmF0aW9uKVxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fYWRkIChpbnB1dCwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fYWRkU3VidHJhY3QodGhpcywgaW5wdXQsIHZhbHVlLCAxKTtcbiAgICB9XG5cbiAgICAvLyBzdXBwb3J0cyBvbmx5IDIuMC1zdHlsZSBzdWJ0cmFjdCgxLCAncycpIG9yIHN1YnRyYWN0KGR1cmF0aW9uKVxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fc3VidHJhY3QgKGlucHV0LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19hZGRTdWJ0cmFjdCh0aGlzLCBpbnB1dCwgdmFsdWUsIC0xKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBidWJibGUgKCkge1xuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5fbWlsbGlzZWNvbmRzO1xuICAgICAgICB2YXIgZGF5cyAgICAgICAgID0gdGhpcy5fZGF5cztcbiAgICAgICAgdmFyIG1vbnRocyAgICAgICA9IHRoaXMuX21vbnRocztcbiAgICAgICAgdmFyIGRhdGEgICAgICAgICA9IHRoaXMuX2RhdGE7XG4gICAgICAgIHZhciBzZWNvbmRzLCBtaW51dGVzLCBob3VycywgeWVhcnMgPSAwO1xuXG4gICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgY29kZSBidWJibGVzIHVwIHZhbHVlcywgc2VlIHRoZSB0ZXN0cyBmb3JcbiAgICAgICAgLy8gZXhhbXBsZXMgb2Ygd2hhdCB0aGF0IG1lYW5zLlxuICAgICAgICBkYXRhLm1pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kcyAlIDEwMDA7XG5cbiAgICAgICAgc2Vjb25kcyAgICAgICAgICAgPSBhYnNGbG9vcihtaWxsaXNlY29uZHMgLyAxMDAwKTtcbiAgICAgICAgZGF0YS5zZWNvbmRzICAgICAgPSBzZWNvbmRzICUgNjA7XG5cbiAgICAgICAgbWludXRlcyAgICAgICAgICAgPSBhYnNGbG9vcihzZWNvbmRzIC8gNjApO1xuICAgICAgICBkYXRhLm1pbnV0ZXMgICAgICA9IG1pbnV0ZXMgJSA2MDtcblxuICAgICAgICBob3VycyAgICAgICAgICAgICA9IGFic0Zsb29yKG1pbnV0ZXMgLyA2MCk7XG4gICAgICAgIGRhdGEuaG91cnMgICAgICAgID0gaG91cnMgJSAyNDtcblxuICAgICAgICBkYXlzICs9IGFic0Zsb29yKGhvdXJzIC8gMjQpO1xuXG4gICAgICAgIC8vIEFjY3VyYXRlbHkgY29udmVydCBkYXlzIHRvIHllYXJzLCBhc3N1bWUgc3RhcnQgZnJvbSB5ZWFyIDAuXG4gICAgICAgIHllYXJzID0gYWJzRmxvb3IoZGF5c1RvWWVhcnMoZGF5cykpO1xuICAgICAgICBkYXlzIC09IGFic0Zsb29yKHllYXJzVG9EYXlzKHllYXJzKSk7XG5cbiAgICAgICAgLy8gMzAgZGF5cyB0byBhIG1vbnRoXG4gICAgICAgIC8vIFRPRE8gKGlza3Jlbik6IFVzZSBhbmNob3IgZGF0ZSAobGlrZSAxc3QgSmFuKSB0byBjb21wdXRlIHRoaXMuXG4gICAgICAgIG1vbnRocyArPSBhYnNGbG9vcihkYXlzIC8gMzApO1xuICAgICAgICBkYXlzICAgJT0gMzA7XG5cbiAgICAgICAgLy8gMTIgbW9udGhzIC0+IDEgeWVhclxuICAgICAgICB5ZWFycyAgKz0gYWJzRmxvb3IobW9udGhzIC8gMTIpO1xuICAgICAgICBtb250aHMgJT0gMTI7XG5cbiAgICAgICAgZGF0YS5kYXlzICAgPSBkYXlzO1xuICAgICAgICBkYXRhLm1vbnRocyA9IG1vbnRocztcbiAgICAgICAgZGF0YS55ZWFycyAgPSB5ZWFycztcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlzVG9ZZWFycyAoZGF5cykge1xuICAgICAgICAvLyA0MDAgeWVhcnMgaGF2ZSAxNDYwOTcgZGF5cyAodGFraW5nIGludG8gYWNjb3VudCBsZWFwIHllYXIgcnVsZXMpXG4gICAgICAgIHJldHVybiBkYXlzICogNDAwIC8gMTQ2MDk3O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHllYXJzVG9EYXlzICh5ZWFycykge1xuICAgICAgICAvLyB5ZWFycyAqIDM2NSArIGFic0Zsb29yKHllYXJzIC8gNCkgLVxuICAgICAgICAvLyAgICAgYWJzRmxvb3IoeWVhcnMgLyAxMDApICsgYWJzRmxvb3IoeWVhcnMgLyA0MDApO1xuICAgICAgICByZXR1cm4geWVhcnMgKiAxNDYwOTcgLyA0MDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXMgKHVuaXRzKSB7XG4gICAgICAgIHZhciBkYXlzO1xuICAgICAgICB2YXIgbW9udGhzO1xuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5fbWlsbGlzZWNvbmRzO1xuXG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21vbnRoJyB8fCB1bml0cyA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgICBkYXlzICAgPSB0aGlzLl9kYXlzICAgKyBtaWxsaXNlY29uZHMgLyA4NjRlNTtcbiAgICAgICAgICAgIG1vbnRocyA9IHRoaXMuX21vbnRocyArIGRheXNUb1llYXJzKGRheXMpICogMTI7XG4gICAgICAgICAgICByZXR1cm4gdW5pdHMgPT09ICdtb250aCcgPyBtb250aHMgOiBtb250aHMgLyAxMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGhhbmRsZSBtaWxsaXNlY29uZHMgc2VwYXJhdGVseSBiZWNhdXNlIG9mIGZsb2F0aW5nIHBvaW50IG1hdGggZXJyb3JzIChpc3N1ZSAjMTg2NylcbiAgICAgICAgICAgIGRheXMgPSB0aGlzLl9kYXlzICsgTWF0aC5yb3VuZCh5ZWFyc1RvRGF5cyh0aGlzLl9tb250aHMgLyAxMikpO1xuICAgICAgICAgICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3dlZWsnICAgOiByZXR1cm4gZGF5cyAvIDcgICAgICsgbWlsbGlzZWNvbmRzIC8gNjA0OGU1O1xuICAgICAgICAgICAgICAgIGNhc2UgJ2RheScgICAgOiByZXR1cm4gZGF5cyAgICAgICAgICsgbWlsbGlzZWNvbmRzIC8gODY0ZTU7XG4gICAgICAgICAgICAgICAgY2FzZSAnaG91cicgICA6IHJldHVybiBkYXlzICogMjQgICAgKyBtaWxsaXNlY29uZHMgLyAzNmU1O1xuICAgICAgICAgICAgICAgIGNhc2UgJ21pbnV0ZScgOiByZXR1cm4gZGF5cyAqIDE0NDAgICsgbWlsbGlzZWNvbmRzIC8gNmU0O1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NlY29uZCcgOiByZXR1cm4gZGF5cyAqIDg2NDAwICsgbWlsbGlzZWNvbmRzIC8gMTAwMDtcbiAgICAgICAgICAgICAgICAvLyBNYXRoLmZsb29yIHByZXZlbnRzIGZsb2F0aW5nIHBvaW50IG1hdGggZXJyb3JzIGhlcmVcbiAgICAgICAgICAgICAgICBjYXNlICdtaWxsaXNlY29uZCc6IHJldHVybiBNYXRoLmZsb29yKGRheXMgKiA4NjRlNSkgKyBtaWxsaXNlY29uZHM7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHVuaXQgJyArIHVuaXRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRPRE86IFVzZSB0aGlzLmFzKCdtcycpP1xuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2FzX192YWx1ZU9mICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyArXG4gICAgICAgICAgICB0aGlzLl9kYXlzICogODY0ZTUgK1xuICAgICAgICAgICAgKHRoaXMuX21vbnRocyAlIDEyKSAqIDI1OTJlNiArXG4gICAgICAgICAgICB0b0ludCh0aGlzLl9tb250aHMgLyAxMikgKiAzMTUzNmU2XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUFzIChhbGlhcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXMoYWxpYXMpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBhc01pbGxpc2Vjb25kcyA9IG1ha2VBcygnbXMnKTtcbiAgICB2YXIgYXNTZWNvbmRzICAgICAgPSBtYWtlQXMoJ3MnKTtcbiAgICB2YXIgYXNNaW51dGVzICAgICAgPSBtYWtlQXMoJ20nKTtcbiAgICB2YXIgYXNIb3VycyAgICAgICAgPSBtYWtlQXMoJ2gnKTtcbiAgICB2YXIgYXNEYXlzICAgICAgICAgPSBtYWtlQXMoJ2QnKTtcbiAgICB2YXIgYXNXZWVrcyAgICAgICAgPSBtYWtlQXMoJ3cnKTtcbiAgICB2YXIgYXNNb250aHMgICAgICAgPSBtYWtlQXMoJ00nKTtcbiAgICB2YXIgYXNZZWFycyAgICAgICAgPSBtYWtlQXMoJ3knKTtcblxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2dldF9fZ2V0ICh1bml0cykge1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXNbdW5pdHMgKyAncyddKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUdldHRlcihuYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtuYW1lXTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgZHVyYXRpb25fZ2V0X19taWxsaXNlY29uZHMgPSBtYWtlR2V0dGVyKCdtaWxsaXNlY29uZHMnKTtcbiAgICB2YXIgc2Vjb25kcyAgICAgID0gbWFrZUdldHRlcignc2Vjb25kcycpO1xuICAgIHZhciBtaW51dGVzICAgICAgPSBtYWtlR2V0dGVyKCdtaW51dGVzJyk7XG4gICAgdmFyIGhvdXJzICAgICAgICA9IG1ha2VHZXR0ZXIoJ2hvdXJzJyk7XG4gICAgdmFyIGRheXMgICAgICAgICA9IG1ha2VHZXR0ZXIoJ2RheXMnKTtcbiAgICB2YXIgbW9udGhzICAgICAgID0gbWFrZUdldHRlcignbW9udGhzJyk7XG4gICAgdmFyIHllYXJzICAgICAgICA9IG1ha2VHZXR0ZXIoJ3llYXJzJyk7XG5cbiAgICBmdW5jdGlvbiB3ZWVrcyAoKSB7XG4gICAgICAgIHJldHVybiBhYnNGbG9vcih0aGlzLmRheXMoKSAvIDcpO1xuICAgIH1cblxuICAgIHZhciByb3VuZCA9IE1hdGgucm91bmQ7XG4gICAgdmFyIHRocmVzaG9sZHMgPSB7XG4gICAgICAgIHM6IDQ1LCAgLy8gc2Vjb25kcyB0byBtaW51dGVcbiAgICAgICAgbTogNDUsICAvLyBtaW51dGVzIHRvIGhvdXJcbiAgICAgICAgaDogMjIsICAvLyBob3VycyB0byBkYXlcbiAgICAgICAgZDogMjYsICAvLyBkYXlzIHRvIG1vbnRoXG4gICAgICAgIE06IDExICAgLy8gbW9udGhzIHRvIHllYXJcbiAgICB9O1xuXG4gICAgLy8gaGVscGVyIGZ1bmN0aW9uIGZvciBtb21lbnQuZm4uZnJvbSwgbW9tZW50LmZuLmZyb21Ob3csIGFuZCBtb21lbnQuZHVyYXRpb24uZm4uaHVtYW5pemVcbiAgICBmdW5jdGlvbiBzdWJzdGl0dXRlVGltZUFnbyhzdHJpbmcsIG51bWJlciwgd2l0aG91dFN1ZmZpeCwgaXNGdXR1cmUsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLnJlbGF0aXZlVGltZShudW1iZXIgfHwgMSwgISF3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9odW1hbml6ZV9fcmVsYXRpdmVUaW1lIChwb3NOZWdEdXJhdGlvbiwgd2l0aG91dFN1ZmZpeCwgbG9jYWxlKSB7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24ocG9zTmVnRHVyYXRpb24pLmFicygpO1xuICAgICAgICB2YXIgc2Vjb25kcyAgPSByb3VuZChkdXJhdGlvbi5hcygncycpKTtcbiAgICAgICAgdmFyIG1pbnV0ZXMgID0gcm91bmQoZHVyYXRpb24uYXMoJ20nKSk7XG4gICAgICAgIHZhciBob3VycyAgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdoJykpO1xuICAgICAgICB2YXIgZGF5cyAgICAgPSByb3VuZChkdXJhdGlvbi5hcygnZCcpKTtcbiAgICAgICAgdmFyIG1vbnRocyAgID0gcm91bmQoZHVyYXRpb24uYXMoJ00nKSk7XG4gICAgICAgIHZhciB5ZWFycyAgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCd5JykpO1xuXG4gICAgICAgIHZhciBhID0gc2Vjb25kcyA8IHRocmVzaG9sZHMucyAmJiBbJ3MnLCBzZWNvbmRzXSAgfHxcbiAgICAgICAgICAgICAgICBtaW51dGVzID09PSAxICAgICAgICAgICYmIFsnbSddICAgICAgICAgICB8fFxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPCB0aHJlc2hvbGRzLm0gJiYgWydtbScsIG1pbnV0ZXNdIHx8XG4gICAgICAgICAgICAgICAgaG91cnMgICA9PT0gMSAgICAgICAgICAmJiBbJ2gnXSAgICAgICAgICAgfHxcbiAgICAgICAgICAgICAgICBob3VycyAgIDwgdGhyZXNob2xkcy5oICYmIFsnaGgnLCBob3Vyc10gICB8fFxuICAgICAgICAgICAgICAgIGRheXMgICAgPT09IDEgICAgICAgICAgJiYgWydkJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICAgICAgZGF5cyAgICA8IHRocmVzaG9sZHMuZCAmJiBbJ2RkJywgZGF5c10gICAgfHxcbiAgICAgICAgICAgICAgICBtb250aHMgID09PSAxICAgICAgICAgICYmIFsnTSddICAgICAgICAgICB8fFxuICAgICAgICAgICAgICAgIG1vbnRocyAgPCB0aHJlc2hvbGRzLk0gJiYgWydNTScsIG1vbnRoc10gIHx8XG4gICAgICAgICAgICAgICAgeWVhcnMgICA9PT0gMSAgICAgICAgICAmJiBbJ3knXSAgICAgICAgICAgfHwgWyd5eScsIHllYXJzXTtcblxuICAgICAgICBhWzJdID0gd2l0aG91dFN1ZmZpeDtcbiAgICAgICAgYVszXSA9ICtwb3NOZWdEdXJhdGlvbiA+IDA7XG4gICAgICAgIGFbNF0gPSBsb2NhbGU7XG4gICAgICAgIHJldHVybiBzdWJzdGl0dXRlVGltZUFnby5hcHBseShudWxsLCBhKTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGFsbG93cyB5b3UgdG8gc2V0IGEgdGhyZXNob2xkIGZvciByZWxhdGl2ZSB0aW1lIHN0cmluZ3NcbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9odW1hbml6ZV9fZ2V0U2V0UmVsYXRpdmVUaW1lVGhyZXNob2xkICh0aHJlc2hvbGQsIGxpbWl0KSB7XG4gICAgICAgIGlmICh0aHJlc2hvbGRzW3RocmVzaG9sZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaW1pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhyZXNob2xkc1t0aHJlc2hvbGRdO1xuICAgICAgICB9XG4gICAgICAgIHRocmVzaG9sZHNbdGhyZXNob2xkXSA9IGxpbWl0O1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBodW1hbml6ZSAod2l0aFN1ZmZpeCkge1xuICAgICAgICB2YXIgbG9jYWxlID0gdGhpcy5sb2NhbGVEYXRhKCk7XG4gICAgICAgIHZhciBvdXRwdXQgPSBkdXJhdGlvbl9odW1hbml6ZV9fcmVsYXRpdmVUaW1lKHRoaXMsICF3aXRoU3VmZml4LCBsb2NhbGUpO1xuXG4gICAgICAgIGlmICh3aXRoU3VmZml4KSB7XG4gICAgICAgICAgICBvdXRwdXQgPSBsb2NhbGUucGFzdEZ1dHVyZSgrdGhpcywgb3V0cHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsb2NhbGUucG9zdGZvcm1hdChvdXRwdXQpO1xuICAgIH1cblxuICAgIHZhciBpc29fc3RyaW5nX19hYnMgPSBNYXRoLmFicztcblxuICAgIGZ1bmN0aW9uIGlzb19zdHJpbmdfX3RvSVNPU3RyaW5nKCkge1xuICAgICAgICAvLyBpbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vZG9yZGlsbGUvbW9tZW50LWlzb2R1cmF0aW9uL2Jsb2IvbWFzdGVyL21vbWVudC5pc29kdXJhdGlvbi5qc1xuICAgICAgICB2YXIgWSA9IGlzb19zdHJpbmdfX2Ficyh0aGlzLnllYXJzKCkpO1xuICAgICAgICB2YXIgTSA9IGlzb19zdHJpbmdfX2Ficyh0aGlzLm1vbnRocygpKTtcbiAgICAgICAgdmFyIEQgPSBpc29fc3RyaW5nX19hYnModGhpcy5kYXlzKCkpO1xuICAgICAgICB2YXIgaCA9IGlzb19zdHJpbmdfX2Ficyh0aGlzLmhvdXJzKCkpO1xuICAgICAgICB2YXIgbSA9IGlzb19zdHJpbmdfX2Ficyh0aGlzLm1pbnV0ZXMoKSk7XG4gICAgICAgIHZhciBzID0gaXNvX3N0cmluZ19fYWJzKHRoaXMuc2Vjb25kcygpICsgdGhpcy5taWxsaXNlY29uZHMoKSAvIDEwMDApO1xuICAgICAgICB2YXIgdG90YWwgPSB0aGlzLmFzU2Vjb25kcygpO1xuXG4gICAgICAgIGlmICghdG90YWwpIHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIHNhbWUgYXMgQyMncyAoTm9kYSkgYW5kIHB5dGhvbiAoaXNvZGF0ZSkuLi5cbiAgICAgICAgICAgIC8vIGJ1dCBub3Qgb3RoZXIgSlMgKGdvb2cuZGF0ZSlcbiAgICAgICAgICAgIHJldHVybiAnUDBEJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAodG90YWwgPCAwID8gJy0nIDogJycpICtcbiAgICAgICAgICAgICdQJyArXG4gICAgICAgICAgICAoWSA/IFkgKyAnWScgOiAnJykgK1xuICAgICAgICAgICAgKE0gPyBNICsgJ00nIDogJycpICtcbiAgICAgICAgICAgIChEID8gRCArICdEJyA6ICcnKSArXG4gICAgICAgICAgICAoKGggfHwgbSB8fCBzKSA/ICdUJyA6ICcnKSArXG4gICAgICAgICAgICAoaCA/IGggKyAnSCcgOiAnJykgK1xuICAgICAgICAgICAgKG0gPyBtICsgJ00nIDogJycpICtcbiAgICAgICAgICAgIChzID8gcyArICdTJyA6ICcnKTtcbiAgICB9XG5cbiAgICB2YXIgZHVyYXRpb25fcHJvdG90eXBlX19wcm90byA9IER1cmF0aW9uLnByb3RvdHlwZTtcblxuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYWJzICAgICAgICAgICAgPSBkdXJhdGlvbl9hYnNfX2FicztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFkZCAgICAgICAgICAgID0gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19hZGQ7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5zdWJ0cmFjdCAgICAgICA9IGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fc3VidHJhY3Q7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hcyAgICAgICAgICAgICA9IGFzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNNaWxsaXNlY29uZHMgPSBhc01pbGxpc2Vjb25kcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzU2Vjb25kcyAgICAgID0gYXNTZWNvbmRzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNNaW51dGVzICAgICAgPSBhc01pbnV0ZXM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc0hvdXJzICAgICAgICA9IGFzSG91cnM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc0RheXMgICAgICAgICA9IGFzRGF5cztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzV2Vla3MgICAgICAgID0gYXNXZWVrcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzTW9udGhzICAgICAgID0gYXNNb250aHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc1llYXJzICAgICAgICA9IGFzWWVhcnM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by52YWx1ZU9mICAgICAgICA9IGR1cmF0aW9uX2FzX192YWx1ZU9mO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uX2J1YmJsZSAgICAgICAgPSBidWJibGU7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5nZXQgICAgICAgICAgICA9IGR1cmF0aW9uX2dldF9fZ2V0O1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ubWlsbGlzZWNvbmRzICAgPSBkdXJhdGlvbl9nZXRfX21pbGxpc2Vjb25kcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnNlY29uZHMgICAgICAgID0gc2Vjb25kcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLm1pbnV0ZXMgICAgICAgID0gbWludXRlcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmhvdXJzICAgICAgICAgID0gaG91cnM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5kYXlzICAgICAgICAgICA9IGRheXM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by53ZWVrcyAgICAgICAgICA9IHdlZWtzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ubW9udGhzICAgICAgICAgPSBtb250aHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by55ZWFycyAgICAgICAgICA9IHllYXJzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uaHVtYW5pemUgICAgICAgPSBodW1hbml6ZTtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnRvSVNPU3RyaW5nICAgID0gaXNvX3N0cmluZ19fdG9JU09TdHJpbmc7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by50b1N0cmluZyAgICAgICA9IGlzb19zdHJpbmdfX3RvSVNPU3RyaW5nO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8udG9KU09OICAgICAgICAgPSBpc29fc3RyaW5nX190b0lTT1N0cmluZztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmxvY2FsZSAgICAgICAgID0gbG9jYWxlO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ubG9jYWxlRGF0YSAgICAgPSBsb2NhbGVEYXRhO1xuXG4gICAgLy8gRGVwcmVjYXRpb25zXG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by50b0lzb1N0cmluZyA9IGRlcHJlY2F0ZSgndG9Jc29TdHJpbmcoKSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIHRvSVNPU3RyaW5nKCkgaW5zdGVhZCAobm90aWNlIHRoZSBjYXBpdGFscyknLCBpc29fc3RyaW5nX190b0lTT1N0cmluZyk7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5sYW5nID0gbGFuZztcblxuICAgIC8vIFNpZGUgZWZmZWN0IGltcG9ydHNcblxuICAgIGFkZEZvcm1hdFRva2VuKCdYJywgMCwgMCwgJ3VuaXgnKTtcbiAgICBhZGRGb3JtYXRUb2tlbigneCcsIDAsIDAsICd2YWx1ZU9mJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCd4JywgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1gnLCBtYXRjaFRpbWVzdGFtcCk7XG4gICAgYWRkUGFyc2VUb2tlbignWCcsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShwYXJzZUZsb2F0KGlucHV0LCAxMCkgKiAxMDAwKTtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKCd4JywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKHRvSW50KGlucHV0KSk7XG4gICAgfSk7XG5cbiAgICAvLyBTaWRlIGVmZmVjdCBpbXBvcnRzXG5cblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy52ZXJzaW9uID0gJzIuMTAuMyc7XG5cbiAgICBzZXRIb29rQ2FsbGJhY2sobG9jYWxfX2NyZWF0ZUxvY2FsKTtcblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5mbiAgICAgICAgICAgICAgICAgICAgPSBtb21lbnRQcm90b3R5cGU7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLm1pbiAgICAgICAgICAgICAgICAgICA9IG1pbjtcbiAgICB1dGlsc19ob29rc19faG9va3MubWF4ICAgICAgICAgICAgICAgICAgID0gbWF4O1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy51dGMgICAgICAgICAgICAgICAgICAgPSBjcmVhdGVfdXRjX19jcmVhdGVVVEM7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnVuaXggICAgICAgICAgICAgICAgICA9IG1vbWVudF9fY3JlYXRlVW5peDtcbiAgICB1dGlsc19ob29rc19faG9va3MubW9udGhzICAgICAgICAgICAgICAgID0gbGlzdHNfX2xpc3RNb250aHM7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmlzRGF0ZSAgICAgICAgICAgICAgICA9IGlzRGF0ZTtcbiAgICB1dGlsc19ob29rc19faG9va3MubG9jYWxlICAgICAgICAgICAgICAgID0gbG9jYWxlX2xvY2FsZXNfX2dldFNldEdsb2JhbExvY2FsZTtcbiAgICB1dGlsc19ob29rc19faG9va3MuaW52YWxpZCAgICAgICAgICAgICAgID0gdmFsaWRfX2NyZWF0ZUludmFsaWQ7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmR1cmF0aW9uICAgICAgICAgICAgICA9IGNyZWF0ZV9fY3JlYXRlRHVyYXRpb247XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmlzTW9tZW50ICAgICAgICAgICAgICA9IGlzTW9tZW50O1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy53ZWVrZGF5cyAgICAgICAgICAgICAgPSBsaXN0c19fbGlzdFdlZWtkYXlzO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5wYXJzZVpvbmUgICAgICAgICAgICAgPSBtb21lbnRfX2NyZWF0ZUluWm9uZTtcbiAgICB1dGlsc19ob29rc19faG9va3MubG9jYWxlRGF0YSAgICAgICAgICAgID0gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZTtcbiAgICB1dGlsc19ob29rc19faG9va3MuaXNEdXJhdGlvbiAgICAgICAgICAgID0gaXNEdXJhdGlvbjtcbiAgICB1dGlsc19ob29rc19faG9va3MubW9udGhzU2hvcnQgICAgICAgICAgID0gbGlzdHNfX2xpc3RNb250aHNTaG9ydDtcbiAgICB1dGlsc19ob29rc19faG9va3Mud2Vla2RheXNNaW4gICAgICAgICAgID0gbGlzdHNfX2xpc3RXZWVrZGF5c01pbjtcbiAgICB1dGlsc19ob29rc19faG9va3MuZGVmaW5lTG9jYWxlICAgICAgICAgID0gZGVmaW5lTG9jYWxlO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy53ZWVrZGF5c1Nob3J0ICAgICAgICAgPSBsaXN0c19fbGlzdFdlZWtkYXlzU2hvcnQ7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLm5vcm1hbGl6ZVVuaXRzICAgICAgICA9IG5vcm1hbGl6ZVVuaXRzO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5yZWxhdGl2ZVRpbWVUaHJlc2hvbGQgPSBkdXJhdGlvbl9odW1hbml6ZV9fZ2V0U2V0UmVsYXRpdmVUaW1lVGhyZXNob2xkO1xuXG4gICAgdmFyIF9tb21lbnQgPSB1dGlsc19ob29rc19faG9va3M7XG5cbiAgICByZXR1cm4gX21vbWVudDtcblxufSkpOyIsIiAgLyogZ2xvYmFscyByZXF1aXJlLCBtb2R1bGUgKi9cblxuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gICAqL1xuXG4gIHZhciBwYXRodG9SZWdleHAgPSByZXF1aXJlKCdwYXRoLXRvLXJlZ2V4cCcpO1xuXG4gIC8qKlxuICAgKiBNb2R1bGUgZXhwb3J0cy5cbiAgICovXG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuXG4gIC8qKlxuICAgKiBEZXRlY3QgY2xpY2sgZXZlbnRcbiAgICovXG4gIHZhciBjbGlja0V2ZW50ID0gZG9jdW1lbnQub250b3VjaHN0YXJ0ID8gJ3RvdWNoc3RhcnQnIDogJ2NsaWNrJztcblxuICAvKipcbiAgICogVG8gd29yayBwcm9wZXJseSB3aXRoIHRoZSBVUkxcbiAgICogaGlzdG9yeS5sb2NhdGlvbiBnZW5lcmF0ZWQgcG9seWZpbGwgaW4gaHR0cHM6Ly9naXRodWIuY29tL2Rldm90ZS9IVE1MNS1IaXN0b3J5LUFQSVxuICAgKi9cblxuICB2YXIgbG9jYXRpb24gPSAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiB3aW5kb3cpICYmICh3aW5kb3cuaGlzdG9yeS5sb2NhdGlvbiB8fCB3aW5kb3cubG9jYXRpb24pO1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtIGluaXRpYWwgZGlzcGF0Y2guXG4gICAqL1xuXG4gIHZhciBkaXNwYXRjaCA9IHRydWU7XG5cblxuICAvKipcbiAgICogRGVjb2RlIFVSTCBjb21wb25lbnRzIChxdWVyeSBzdHJpbmcsIHBhdGhuYW1lLCBoYXNoKS5cbiAgICogQWNjb21tb2RhdGVzIGJvdGggcmVndWxhciBwZXJjZW50IGVuY29kaW5nIGFuZCB4LXd3dy1mb3JtLXVybGVuY29kZWQgZm9ybWF0LlxuICAgKi9cbiAgdmFyIGRlY29kZVVSTENvbXBvbmVudHMgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBCYXNlIHBhdGguXG4gICAqL1xuXG4gIHZhciBiYXNlID0gJyc7XG5cbiAgLyoqXG4gICAqIFJ1bm5pbmcgZmxhZy5cbiAgICovXG5cbiAgdmFyIHJ1bm5pbmc7XG5cbiAgLyoqXG4gICAqIEhhc2hCYW5nIG9wdGlvblxuICAgKi9cblxuICB2YXIgaGFzaGJhbmcgPSBmYWxzZTtcblxuICAvKipcbiAgICogUHJldmlvdXMgY29udGV4dCwgZm9yIGNhcHR1cmluZ1xuICAgKiBwYWdlIGV4aXQgZXZlbnRzLlxuICAgKi9cblxuICB2YXIgcHJldkNvbnRleHQ7XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGBwYXRoYCB3aXRoIGNhbGxiYWNrIGBmbigpYCxcbiAgICogb3Igcm91dGUgYHBhdGhgLCBvciByZWRpcmVjdGlvbixcbiAgICogb3IgYHBhZ2Uuc3RhcnQoKWAuXG4gICAqXG4gICAqICAgcGFnZShmbik7XG4gICAqICAgcGFnZSgnKicsIGZuKTtcbiAgICogICBwYWdlKCcvdXNlci86aWQnLCBsb2FkLCB1c2VyKTtcbiAgICogICBwYWdlKCcvdXNlci8nICsgdXNlci5pZCwgeyBzb21lOiAndGhpbmcnIH0pO1xuICAgKiAgIHBhZ2UoJy91c2VyLycgKyB1c2VyLmlkKTtcbiAgICogICBwYWdlKCcvZnJvbScsICcvdG8nKVxuICAgKiAgIHBhZ2UoKTtcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IHBhdGhcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4uLi5cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgZnVuY3Rpb24gcGFnZShwYXRoLCBmbikge1xuICAgIC8vIDxjYWxsYmFjaz5cbiAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIHBhdGgpIHtcbiAgICAgIHJldHVybiBwYWdlKCcqJywgcGF0aCk7XG4gICAgfVxuXG4gICAgLy8gcm91dGUgPHBhdGg+IHRvIDxjYWxsYmFjayAuLi4+XG4gICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBmbikge1xuICAgICAgdmFyIHJvdXRlID0gbmV3IFJvdXRlKHBhdGgpO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgcGFnZS5jYWxsYmFja3MucHVzaChyb3V0ZS5taWRkbGV3YXJlKGFyZ3VtZW50c1tpXSkpO1xuICAgICAgfVxuICAgICAgLy8gc2hvdyA8cGF0aD4gd2l0aCBbc3RhdGVdXG4gICAgfSBlbHNlIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIHBhdGgpIHtcbiAgICAgIHBhZ2VbJ3N0cmluZycgPT09IHR5cGVvZiBmbiA/ICdyZWRpcmVjdCcgOiAnc2hvdyddKHBhdGgsIGZuKTtcbiAgICAgIC8vIHN0YXJ0IFtvcHRpb25zXVxuICAgIH0gZWxzZSB7XG4gICAgICBwYWdlLnN0YXJ0KHBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmdW5jdGlvbnMuXG4gICAqL1xuXG4gIHBhZ2UuY2FsbGJhY2tzID0gW107XG4gIHBhZ2UuZXhpdHMgPSBbXTtcblxuICAvKipcbiAgICogQ3VycmVudCBwYXRoIGJlaW5nIHByb2Nlc3NlZFxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgcGFnZS5jdXJyZW50ID0gJyc7XG5cbiAgLyoqXG4gICAqIE51bWJlciBvZiBwYWdlcyBuYXZpZ2F0ZWQgdG8uXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqXG4gICAqICAgICBwYWdlLmxlbiA9PSAwO1xuICAgKiAgICAgcGFnZSgnL2xvZ2luJyk7XG4gICAqICAgICBwYWdlLmxlbiA9PSAxO1xuICAgKi9cblxuICBwYWdlLmxlbiA9IDA7XG5cbiAgLyoqXG4gICAqIEdldCBvciBzZXQgYmFzZXBhdGggdG8gYHBhdGhgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLmJhc2UgPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgaWYgKDAgPT09IGFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBiYXNlO1xuICAgIGJhc2UgPSBwYXRoO1xuICB9O1xuXG4gIC8qKlxuICAgKiBCaW5kIHdpdGggdGhlIGdpdmVuIGBvcHRpb25zYC5cbiAgICpcbiAgICogT3B0aW9uczpcbiAgICpcbiAgICogICAgLSBgY2xpY2tgIGJpbmQgdG8gY2xpY2sgZXZlbnRzIFt0cnVlXVxuICAgKiAgICAtIGBwb3BzdGF0ZWAgYmluZCB0byBwb3BzdGF0ZSBbdHJ1ZV1cbiAgICogICAgLSBgZGlzcGF0Y2hgIHBlcmZvcm0gaW5pdGlhbCBkaXNwYXRjaCBbdHJ1ZV1cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5zdGFydCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAocnVubmluZykgcmV0dXJuO1xuICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgIGlmIChmYWxzZSA9PT0gb3B0aW9ucy5kaXNwYXRjaCkgZGlzcGF0Y2ggPSBmYWxzZTtcbiAgICBpZiAoZmFsc2UgPT09IG9wdGlvbnMuZGVjb2RlVVJMQ29tcG9uZW50cykgZGVjb2RlVVJMQ29tcG9uZW50cyA9IGZhbHNlO1xuICAgIGlmIChmYWxzZSAhPT0gb3B0aW9ucy5wb3BzdGF0ZSkgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgb25wb3BzdGF0ZSwgZmFsc2UpO1xuICAgIGlmIChmYWxzZSAhPT0gb3B0aW9ucy5jbGljaykge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoY2xpY2tFdmVudCwgb25jbGljaywgZmFsc2UpO1xuICAgIH1cbiAgICBpZiAodHJ1ZSA9PT0gb3B0aW9ucy5oYXNoYmFuZykgaGFzaGJhbmcgPSB0cnVlO1xuICAgIGlmICghZGlzcGF0Y2gpIHJldHVybjtcbiAgICB2YXIgdXJsID0gKGhhc2hiYW5nICYmIH5sb2NhdGlvbi5oYXNoLmluZGV4T2YoJyMhJykpID8gbG9jYXRpb24uaGFzaC5zdWJzdHIoMikgKyBsb2NhdGlvbi5zZWFyY2ggOiBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCArIGxvY2F0aW9uLmhhc2g7XG4gICAgcGFnZS5yZXBsYWNlKHVybCwgbnVsbCwgdHJ1ZSwgZGlzcGF0Y2gpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBVbmJpbmQgY2xpY2sgYW5kIHBvcHN0YXRlIGV2ZW50IGhhbmRsZXJzLlxuICAgKlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLnN0b3AgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXJ1bm5pbmcpIHJldHVybjtcbiAgICBwYWdlLmN1cnJlbnQgPSAnJztcbiAgICBwYWdlLmxlbiA9IDA7XG4gICAgcnVubmluZyA9IGZhbHNlO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGNsaWNrRXZlbnQsIG9uY2xpY2ssIGZhbHNlKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvbnBvcHN0YXRlLCBmYWxzZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNob3cgYHBhdGhgIHdpdGggb3B0aW9uYWwgYHN0YXRlYCBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGRpc3BhdGNoXG4gICAqIEByZXR1cm4ge0NvbnRleHR9XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2Uuc2hvdyA9IGZ1bmN0aW9uKHBhdGgsIHN0YXRlLCBkaXNwYXRjaCwgcHVzaCkge1xuICAgIHZhciBjdHggPSBuZXcgQ29udGV4dChwYXRoLCBzdGF0ZSk7XG4gICAgcGFnZS5jdXJyZW50ID0gY3R4LnBhdGg7XG4gICAgaWYgKGZhbHNlICE9PSBkaXNwYXRjaCkgcGFnZS5kaXNwYXRjaChjdHgpO1xuICAgIGlmIChmYWxzZSAhPT0gY3R4LmhhbmRsZWQgJiYgZmFsc2UgIT09IHB1c2gpIGN0eC5wdXNoU3RhdGUoKTtcbiAgICByZXR1cm4gY3R4O1xuICB9O1xuXG4gIC8qKlxuICAgKiBHb2VzIGJhY2sgaW4gdGhlIGhpc3RvcnlcbiAgICogQmFjayBzaG91bGQgYWx3YXlzIGxldCB0aGUgY3VycmVudCByb3V0ZSBwdXNoIHN0YXRlIGFuZCB0aGVuIGdvIGJhY2suXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIC0gZmFsbGJhY2sgcGF0aCB0byBnbyBiYWNrIGlmIG5vIG1vcmUgaGlzdG9yeSBleGlzdHMsIGlmIHVuZGVmaW5lZCBkZWZhdWx0cyB0byBwYWdlLmJhc2VcbiAgICogQHBhcmFtIHtPYmplY3R9IFtzdGF0ZV1cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5iYWNrID0gZnVuY3Rpb24ocGF0aCwgc3RhdGUpIHtcbiAgICBpZiAocGFnZS5sZW4gPiAwKSB7XG4gICAgICAvLyB0aGlzIG1heSBuZWVkIG1vcmUgdGVzdGluZyB0byBzZWUgaWYgYWxsIGJyb3dzZXJzXG4gICAgICAvLyB3YWl0IGZvciB0aGUgbmV4dCB0aWNrIHRvIGdvIGJhY2sgaW4gaGlzdG9yeVxuICAgICAgaGlzdG9yeS5iYWNrKCk7XG4gICAgICBwYWdlLmxlbi0tO1xuICAgIH0gZWxzZSBpZiAocGF0aCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcGFnZS5zaG93KHBhdGgsIHN0YXRlKTtcbiAgICAgIH0pO1xuICAgIH1lbHNle1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcGFnZS5zaG93KGJhc2UsIHN0YXRlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciByb3V0ZSB0byByZWRpcmVjdCBmcm9tIG9uZSBwYXRoIHRvIG90aGVyXG4gICAqIG9yIGp1c3QgcmVkaXJlY3QgdG8gYW5vdGhlciByb3V0ZVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZnJvbSAtIGlmIHBhcmFtICd0bycgaXMgdW5kZWZpbmVkIHJlZGlyZWN0cyB0byAnZnJvbSdcbiAgICogQHBhcmFtIHtTdHJpbmd9IFt0b11cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG4gIHBhZ2UucmVkaXJlY3QgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICAgIC8vIERlZmluZSByb3V0ZSBmcm9tIGEgcGF0aCB0byBhbm90aGVyXG4gICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgZnJvbSAmJiAnc3RyaW5nJyA9PT0gdHlwZW9mIHRvKSB7XG4gICAgICBwYWdlKGZyb20sIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBwYWdlLnJlcGxhY2UodG8pO1xuICAgICAgICB9LCAwKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFdhaXQgZm9yIHRoZSBwdXNoIHN0YXRlIGFuZCByZXBsYWNlIGl0IHdpdGggYW5vdGhlclxuICAgIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIGZyb20gJiYgJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiB0bykge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcGFnZS5yZXBsYWNlKGZyb20pO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGBwYXRoYCB3aXRoIG9wdGlvbmFsIGBzdGF0ZWAgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAgICogQHJldHVybiB7Q29udGV4dH1cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cblxuICBwYWdlLnJlcGxhY2UgPSBmdW5jdGlvbihwYXRoLCBzdGF0ZSwgaW5pdCwgZGlzcGF0Y2gpIHtcbiAgICB2YXIgY3R4ID0gbmV3IENvbnRleHQocGF0aCwgc3RhdGUpO1xuICAgIHBhZ2UuY3VycmVudCA9IGN0eC5wYXRoO1xuICAgIGN0eC5pbml0ID0gaW5pdDtcbiAgICBjdHguc2F2ZSgpOyAvLyBzYXZlIGJlZm9yZSBkaXNwYXRjaGluZywgd2hpY2ggbWF5IHJlZGlyZWN0XG4gICAgaWYgKGZhbHNlICE9PSBkaXNwYXRjaCkgcGFnZS5kaXNwYXRjaChjdHgpO1xuICAgIHJldHVybiBjdHg7XG4gIH07XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIHRoZSBnaXZlbiBgY3R4YC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGN0eFxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgcGFnZS5kaXNwYXRjaCA9IGZ1bmN0aW9uKGN0eCkge1xuICAgIHZhciBwcmV2ID0gcHJldkNvbnRleHQsXG4gICAgICBpID0gMCxcbiAgICAgIGogPSAwO1xuXG4gICAgcHJldkNvbnRleHQgPSBjdHg7XG5cbiAgICBmdW5jdGlvbiBuZXh0RXhpdCgpIHtcbiAgICAgIHZhciBmbiA9IHBhZ2UuZXhpdHNbaisrXTtcbiAgICAgIGlmICghZm4pIHJldHVybiBuZXh0RW50ZXIoKTtcbiAgICAgIGZuKHByZXYsIG5leHRFeGl0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBuZXh0RW50ZXIoKSB7XG4gICAgICB2YXIgZm4gPSBwYWdlLmNhbGxiYWNrc1tpKytdO1xuXG4gICAgICBpZiAoY3R4LnBhdGggIT09IHBhZ2UuY3VycmVudCkge1xuICAgICAgICBjdHguaGFuZGxlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWZuKSByZXR1cm4gdW5oYW5kbGVkKGN0eCk7XG4gICAgICBmbihjdHgsIG5leHRFbnRlcik7XG4gICAgfVxuXG4gICAgaWYgKHByZXYpIHtcbiAgICAgIG5leHRFeGl0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHRFbnRlcigpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogVW5oYW5kbGVkIGBjdHhgLiBXaGVuIGl0J3Mgbm90IHRoZSBpbml0aWFsXG4gICAqIHBvcHN0YXRlIHRoZW4gcmVkaXJlY3QuIElmIHlvdSB3aXNoIHRvIGhhbmRsZVxuICAgKiA0MDRzIG9uIHlvdXIgb3duIHVzZSBgcGFnZSgnKicsIGNhbGxiYWNrKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7Q29udGV4dH0gY3R4XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBmdW5jdGlvbiB1bmhhbmRsZWQoY3R4KSB7XG4gICAgaWYgKGN0eC5oYW5kbGVkKSByZXR1cm47XG4gICAgdmFyIGN1cnJlbnQ7XG5cbiAgICBpZiAoaGFzaGJhbmcpIHtcbiAgICAgIGN1cnJlbnQgPSBiYXNlICsgbG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjIScsICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudCA9IGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoO1xuICAgIH1cblxuICAgIGlmIChjdXJyZW50ID09PSBjdHguY2Fub25pY2FsUGF0aCkgcmV0dXJuO1xuICAgIHBhZ2Uuc3RvcCgpO1xuICAgIGN0eC5oYW5kbGVkID0gZmFsc2U7XG4gICAgbG9jYXRpb24uaHJlZiA9IGN0eC5jYW5vbmljYWxQYXRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGFuIGV4aXQgcm91dGUgb24gYHBhdGhgIHdpdGhcbiAgICogY2FsbGJhY2sgYGZuKClgLCB3aGljaCB3aWxsIGJlIGNhbGxlZFxuICAgKiBvbiB0aGUgcHJldmlvdXMgY29udGV4dCB3aGVuIGEgbmV3XG4gICAqIHBhZ2UgaXMgdmlzaXRlZC5cbiAgICovXG4gIHBhZ2UuZXhpdCA9IGZ1bmN0aW9uKHBhdGgsIGZuKSB7XG4gICAgaWYgKHR5cGVvZiBwYXRoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gcGFnZS5leGl0KCcqJywgcGF0aCk7XG4gICAgfVxuXG4gICAgdmFyIHJvdXRlID0gbmV3IFJvdXRlKHBhdGgpO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICBwYWdlLmV4aXRzLnB1c2gocm91dGUubWlkZGxld2FyZShhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBVUkwgZW5jb2RpbmcgZnJvbSB0aGUgZ2l2ZW4gYHN0cmAuXG4gICAqIEFjY29tbW9kYXRlcyB3aGl0ZXNwYWNlIGluIGJvdGggeC13d3ctZm9ybS11cmxlbmNvZGVkXG4gICAqIGFuZCByZWd1bGFyIHBlcmNlbnQtZW5jb2RlZCBmb3JtLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cn0gVVJMIGNvbXBvbmVudCB0byBkZWNvZGVcbiAgICovXG4gIGZ1bmN0aW9uIGRlY29kZVVSTEVuY29kZWRVUklDb21wb25lbnQodmFsKSB7XG4gICAgaWYgKHR5cGVvZiB2YWwgIT09ICdzdHJpbmcnKSB7IHJldHVybiB2YWw7IH1cbiAgICByZXR1cm4gZGVjb2RlVVJMQ29tcG9uZW50cyA/IGRlY29kZVVSSUNvbXBvbmVudCh2YWwucmVwbGFjZSgvXFwrL2csICcgJykpIDogdmFsO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgYSBuZXcgXCJyZXF1ZXN0XCIgYENvbnRleHRgXG4gICAqIHdpdGggdGhlIGdpdmVuIGBwYXRoYCBhbmQgb3B0aW9uYWwgaW5pdGlhbCBgc3RhdGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgZnVuY3Rpb24gQ29udGV4dChwYXRoLCBzdGF0ZSkge1xuICAgIGlmICgnLycgPT09IHBhdGhbMF0gJiYgMCAhPT0gcGF0aC5pbmRleE9mKGJhc2UpKSBwYXRoID0gYmFzZSArIChoYXNoYmFuZyA/ICcjIScgOiAnJykgKyBwYXRoO1xuICAgIHZhciBpID0gcGF0aC5pbmRleE9mKCc/Jyk7XG5cbiAgICB0aGlzLmNhbm9uaWNhbFBhdGggPSBwYXRoO1xuICAgIHRoaXMucGF0aCA9IHBhdGgucmVwbGFjZShiYXNlLCAnJykgfHwgJy8nO1xuICAgIGlmIChoYXNoYmFuZykgdGhpcy5wYXRoID0gdGhpcy5wYXRoLnJlcGxhY2UoJyMhJywgJycpIHx8ICcvJztcblxuICAgIHRoaXMudGl0bGUgPSBkb2N1bWVudC50aXRsZTtcbiAgICB0aGlzLnN0YXRlID0gc3RhdGUgfHwge307XG4gICAgdGhpcy5zdGF0ZS5wYXRoID0gcGF0aDtcbiAgICB0aGlzLnF1ZXJ5c3RyaW5nID0gfmkgPyBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KHBhdGguc2xpY2UoaSArIDEpKSA6ICcnO1xuICAgIHRoaXMucGF0aG5hbWUgPSBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KH5pID8gcGF0aC5zbGljZSgwLCBpKSA6IHBhdGgpO1xuICAgIHRoaXMucGFyYW1zID0ge307XG5cbiAgICAvLyBmcmFnbWVudFxuICAgIHRoaXMuaGFzaCA9ICcnO1xuICAgIGlmICghaGFzaGJhbmcpIHtcbiAgICAgIGlmICghfnRoaXMucGF0aC5pbmRleE9mKCcjJykpIHJldHVybjtcbiAgICAgIHZhciBwYXJ0cyA9IHRoaXMucGF0aC5zcGxpdCgnIycpO1xuICAgICAgdGhpcy5wYXRoID0gcGFydHNbMF07XG4gICAgICB0aGlzLmhhc2ggPSBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KHBhcnRzWzFdKSB8fCAnJztcbiAgICAgIHRoaXMucXVlcnlzdHJpbmcgPSB0aGlzLnF1ZXJ5c3RyaW5nLnNwbGl0KCcjJylbMF07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBgQ29udGV4dGAuXG4gICAqL1xuXG4gIHBhZ2UuQ29udGV4dCA9IENvbnRleHQ7XG5cbiAgLyoqXG4gICAqIFB1c2ggc3RhdGUuXG4gICAqXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBDb250ZXh0LnByb3RvdHlwZS5wdXNoU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBwYWdlLmxlbisrO1xuICAgIGhpc3RvcnkucHVzaFN0YXRlKHRoaXMuc3RhdGUsIHRoaXMudGl0bGUsIGhhc2hiYW5nICYmIHRoaXMucGF0aCAhPT0gJy8nID8gJyMhJyArIHRoaXMucGF0aCA6IHRoaXMuY2Fub25pY2FsUGF0aCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNhdmUgdGhlIGNvbnRleHQgc3RhdGUuXG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIENvbnRleHQucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSh0aGlzLnN0YXRlLCB0aGlzLnRpdGxlLCBoYXNoYmFuZyAmJiB0aGlzLnBhdGggIT09ICcvJyA/ICcjIScgKyB0aGlzLnBhdGggOiB0aGlzLmNhbm9uaWNhbFBhdGgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGBSb3V0ZWAgd2l0aCB0aGUgZ2l2ZW4gSFRUUCBgcGF0aGAsXG4gICAqIGFuZCBhbiBhcnJheSBvZiBgY2FsbGJhY2tzYCBhbmQgYG9wdGlvbnNgLlxuICAgKlxuICAgKiBPcHRpb25zOlxuICAgKlxuICAgKiAgIC0gYHNlbnNpdGl2ZWAgICAgZW5hYmxlIGNhc2Utc2Vuc2l0aXZlIHJvdXRlc1xuICAgKiAgIC0gYHN0cmljdGAgICAgICAgZW5hYmxlIHN0cmljdCBtYXRjaGluZyBmb3IgdHJhaWxpbmcgc2xhc2hlc1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5cbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIFJvdXRlKHBhdGgsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnBhdGggPSAocGF0aCA9PT0gJyonKSA/ICcoLiopJyA6IHBhdGg7XG4gICAgdGhpcy5tZXRob2QgPSAnR0VUJztcbiAgICB0aGlzLnJlZ2V4cCA9IHBhdGh0b1JlZ2V4cCh0aGlzLnBhdGgsXG4gICAgICB0aGlzLmtleXMgPSBbXSxcbiAgICAgIG9wdGlvbnMuc2Vuc2l0aXZlLFxuICAgICAgb3B0aW9ucy5zdHJpY3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBgUm91dGVgLlxuICAgKi9cblxuICBwYWdlLlJvdXRlID0gUm91dGU7XG5cbiAgLyoqXG4gICAqIFJldHVybiByb3V0ZSBtaWRkbGV3YXJlIHdpdGhcbiAgICogdGhlIGdpdmVuIGNhbGxiYWNrIGBmbigpYC5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5taWRkbGV3YXJlID0gZnVuY3Rpb24oZm4pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGN0eCwgbmV4dCkge1xuICAgICAgaWYgKHNlbGYubWF0Y2goY3R4LnBhdGgsIGN0eC5wYXJhbXMpKSByZXR1cm4gZm4oY3R4LCBuZXh0KTtcbiAgICAgIG5leHQoKTtcbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGlzIHJvdXRlIG1hdGNoZXMgYHBhdGhgLCBpZiBzb1xuICAgKiBwb3B1bGF0ZSBgcGFyYW1zYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24ocGF0aCwgcGFyYW1zKSB7XG4gICAgdmFyIGtleXMgPSB0aGlzLmtleXMsXG4gICAgICBxc0luZGV4ID0gcGF0aC5pbmRleE9mKCc/JyksXG4gICAgICBwYXRobmFtZSA9IH5xc0luZGV4ID8gcGF0aC5zbGljZSgwLCBxc0luZGV4KSA6IHBhdGgsXG4gICAgICBtID0gdGhpcy5yZWdleHAuZXhlYyhkZWNvZGVVUklDb21wb25lbnQocGF0aG5hbWUpKTtcblxuICAgIGlmICghbSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yICh2YXIgaSA9IDEsIGxlbiA9IG0ubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2kgLSAxXTtcbiAgICAgIHZhciB2YWwgPSBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KG1baV0pO1xuICAgICAgaWYgKHZhbCAhPT0gdW5kZWZpbmVkIHx8ICEoaGFzT3duUHJvcGVydHkuY2FsbChwYXJhbXMsIGtleS5uYW1lKSkpIHtcbiAgICAgICAgcGFyYW1zW2tleS5uYW1lXSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBIYW5kbGUgXCJwb3B1bGF0ZVwiIGV2ZW50cy5cbiAgICovXG5cbiAgdmFyIG9ucG9wc3RhdGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8vIHRoaXMgaGFjayByZXNvbHZlcyBodHRwczovL2dpdGh1Yi5jb20vdmlzaW9ubWVkaWEvcGFnZS5qcy9pc3N1ZXMvMjEzXG4gICAgdmFyIGxvYWRlZCA9IGZhbHNlO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBsb2FkZWQgPSB0cnVlO1xuICAgICAgfSwgMCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIG9ucG9wc3RhdGUoZSkge1xuICAgICAgaWYgKCFsb2FkZWQpIHJldHVybjtcbiAgICAgIGlmIChlLnN0YXRlKSB7XG4gICAgICAgIHZhciBwYXRoID0gZS5zdGF0ZS5wYXRoO1xuICAgICAgICBwYWdlLnJlcGxhY2UocGF0aCwgZS5zdGF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYWdlLnNob3cobG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5oYXNoLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZmFsc2UpO1xuICAgICAgfVxuICAgIH07XG4gIH0pKCk7XG4gIC8qKlxuICAgKiBIYW5kbGUgXCJjbGlja1wiIGV2ZW50cy5cbiAgICovXG5cbiAgZnVuY3Rpb24gb25jbGljayhlKSB7XG5cbiAgICBpZiAoMSAhPT0gd2hpY2goZSkpIHJldHVybjtcblxuICAgIGlmIChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5IHx8IGUuc2hpZnRLZXkpIHJldHVybjtcbiAgICBpZiAoZS5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XG5cblxuXG4gICAgLy8gZW5zdXJlIGxpbmtcbiAgICB2YXIgZWwgPSBlLnRhcmdldDtcbiAgICB3aGlsZSAoZWwgJiYgJ0EnICE9PSBlbC5ub2RlTmFtZSkgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgIGlmICghZWwgfHwgJ0EnICE9PSBlbC5ub2RlTmFtZSkgcmV0dXJuO1xuXG5cblxuICAgIC8vIElnbm9yZSBpZiB0YWcgaGFzXG4gICAgLy8gMS4gXCJkb3dubG9hZFwiIGF0dHJpYnV0ZVxuICAgIC8vIDIuIHJlbD1cImV4dGVybmFsXCIgYXR0cmlidXRlXG4gICAgaWYgKGVsLmhhc0F0dHJpYnV0ZSgnZG93bmxvYWQnKSB8fCBlbC5nZXRBdHRyaWJ1dGUoJ3JlbCcpID09PSAnZXh0ZXJuYWwnKSByZXR1cm47XG5cbiAgICAvLyBlbnN1cmUgbm9uLWhhc2ggZm9yIHRoZSBzYW1lIHBhdGhcbiAgICB2YXIgbGluayA9IGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuICAgIGlmICghaGFzaGJhbmcgJiYgZWwucGF0aG5hbWUgPT09IGxvY2F0aW9uLnBhdGhuYW1lICYmIChlbC5oYXNoIHx8ICcjJyA9PT0gbGluaykpIHJldHVybjtcblxuXG5cbiAgICAvLyBDaGVjayBmb3IgbWFpbHRvOiBpbiB0aGUgaHJlZlxuICAgIGlmIChsaW5rICYmIGxpbmsuaW5kZXhPZignbWFpbHRvOicpID4gLTEpIHJldHVybjtcblxuICAgIC8vIGNoZWNrIHRhcmdldFxuICAgIGlmIChlbC50YXJnZXQpIHJldHVybjtcblxuICAgIC8vIHgtb3JpZ2luXG4gICAgaWYgKCFzYW1lT3JpZ2luKGVsLmhyZWYpKSByZXR1cm47XG5cblxuXG4gICAgLy8gcmVidWlsZCBwYXRoXG4gICAgdmFyIHBhdGggPSBlbC5wYXRobmFtZSArIGVsLnNlYXJjaCArIChlbC5oYXNoIHx8ICcnKTtcblxuICAgIC8vIHN0cmlwIGxlYWRpbmcgXCIvW2RyaXZlIGxldHRlcl06XCIgb24gTlcuanMgb24gV2luZG93c1xuICAgIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcGF0aC5tYXRjaCgvXlxcL1thLXpBLVpdOlxcLy8pKSB7XG4gICAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9eXFwvW2EtekEtWl06XFwvLywgJy8nKTtcbiAgICB9XG5cbiAgICAvLyBzYW1lIHBhZ2VcbiAgICB2YXIgb3JpZyA9IHBhdGg7XG5cbiAgICBpZiAocGF0aC5pbmRleE9mKGJhc2UpID09PSAwKSB7XG4gICAgICBwYXRoID0gcGF0aC5zdWJzdHIoYmFzZS5sZW5ndGgpO1xuICAgIH1cblxuICAgIGlmIChoYXNoYmFuZykgcGF0aCA9IHBhdGgucmVwbGFjZSgnIyEnLCAnJyk7XG5cbiAgICBpZiAoYmFzZSAmJiBvcmlnID09PSBwYXRoKSByZXR1cm47XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgcGFnZS5zaG93KG9yaWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV2ZW50IGJ1dHRvbi5cbiAgICovXG5cbiAgZnVuY3Rpb24gd2hpY2goZSkge1xuICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgICByZXR1cm4gbnVsbCA9PT0gZS53aGljaCA/IGUuYnV0dG9uIDogZS53aGljaDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBgaHJlZmAgaXMgdGhlIHNhbWUgb3JpZ2luLlxuICAgKi9cblxuICBmdW5jdGlvbiBzYW1lT3JpZ2luKGhyZWYpIHtcbiAgICB2YXIgb3JpZ2luID0gbG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgbG9jYXRpb24uaG9zdG5hbWU7XG4gICAgaWYgKGxvY2F0aW9uLnBvcnQpIG9yaWdpbiArPSAnOicgKyBsb2NhdGlvbi5wb3J0O1xuICAgIHJldHVybiAoaHJlZiAmJiAoMCA9PT0gaHJlZi5pbmRleE9mKG9yaWdpbikpKTtcbiAgfVxuXG4gIHBhZ2Uuc2FtZU9yaWdpbiA9IHNhbWVPcmlnaW47XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKTtcblxuLyoqXG4gKiBFeHBvc2UgYHBhdGhUb1JlZ2V4cGAuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gcGF0aFRvUmVnZXhwO1xuXG4vKipcbiAqIFRoZSBtYWluIHBhdGggbWF0Y2hpbmcgcmVnZXhwIHV0aWxpdHkuXG4gKlxuICogQHR5cGUge1JlZ0V4cH1cbiAqL1xudmFyIFBBVEhfUkVHRVhQID0gbmV3IFJlZ0V4cChbXG4gIC8vIE1hdGNoIGVzY2FwZWQgY2hhcmFjdGVycyB0aGF0IHdvdWxkIG90aGVyd2lzZSBhcHBlYXIgaW4gZnV0dXJlIG1hdGNoZXMuXG4gIC8vIFRoaXMgYWxsb3dzIHRoZSB1c2VyIHRvIGVzY2FwZSBzcGVjaWFsIGNoYXJhY3RlcnMgdGhhdCB3b24ndCB0cmFuc2Zvcm0uXG4gICcoXFxcXFxcXFwuKScsXG4gIC8vIE1hdGNoIEV4cHJlc3Mtc3R5bGUgcGFyYW1ldGVycyBhbmQgdW4tbmFtZWQgcGFyYW1ldGVycyB3aXRoIGEgcHJlZml4XG4gIC8vIGFuZCBvcHRpb25hbCBzdWZmaXhlcy4gTWF0Y2hlcyBhcHBlYXIgYXM6XG4gIC8vXG4gIC8vIFwiLzp0ZXN0KFxcXFxkKyk/XCIgPT4gW1wiL1wiLCBcInRlc3RcIiwgXCJcXGQrXCIsIHVuZGVmaW5lZCwgXCI/XCJdXG4gIC8vIFwiL3JvdXRlKFxcXFxkKylcIiA9PiBbdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgXCJcXGQrXCIsIHVuZGVmaW5lZF1cbiAgJyhbXFxcXC8uXSk/KD86XFxcXDooXFxcXHcrKSg/OlxcXFwoKCg/OlxcXFxcXFxcLnxbXildKSopXFxcXCkpP3xcXFxcKCgoPzpcXFxcXFxcXC58W14pXSkqKVxcXFwpKShbKyo/XSk/JyxcbiAgLy8gTWF0Y2ggcmVnZXhwIHNwZWNpYWwgY2hhcmFjdGVycyB0aGF0IGFyZSBhbHdheXMgZXNjYXBlZC5cbiAgJyhbLisqPz1eIToke30oKVtcXFxcXXxcXFxcL10pJ1xuXS5qb2luKCd8JyksICdnJyk7XG5cbi8qKlxuICogRXNjYXBlIHRoZSBjYXB0dXJpbmcgZ3JvdXAgYnkgZXNjYXBpbmcgc3BlY2lhbCBjaGFyYWN0ZXJzIGFuZCBtZWFuaW5nLlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gZ3JvdXBcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZXNjYXBlR3JvdXAgKGdyb3VwKSB7XG4gIHJldHVybiBncm91cC5yZXBsYWNlKC8oWz0hOiRcXC8oKV0pL2csICdcXFxcJDEnKTtcbn1cblxuLyoqXG4gKiBBdHRhY2ggdGhlIGtleXMgYXMgYSBwcm9wZXJ0eSBvZiB0aGUgcmVnZXhwLlxuICpcbiAqIEBwYXJhbSAge1JlZ0V4cH0gcmVcbiAqIEBwYXJhbSAge0FycmF5fSAga2V5c1xuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5mdW5jdGlvbiBhdHRhY2hLZXlzIChyZSwga2V5cykge1xuICByZS5rZXlzID0ga2V5cztcbiAgcmV0dXJuIHJlO1xufVxuXG4vKipcbiAqIEdldCB0aGUgZmxhZ3MgZm9yIGEgcmVnZXhwIGZyb20gdGhlIG9wdGlvbnMuXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGZsYWdzIChvcHRpb25zKSB7XG4gIHJldHVybiBvcHRpb25zLnNlbnNpdGl2ZSA/ICcnIDogJ2knO1xufVxuXG4vKipcbiAqIFB1bGwgb3V0IGtleXMgZnJvbSBhIHJlZ2V4cC5cbiAqXG4gKiBAcGFyYW0gIHtSZWdFeHB9IHBhdGhcbiAqIEBwYXJhbSAge0FycmF5fSAga2V5c1xuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5mdW5jdGlvbiByZWdleHBUb1JlZ2V4cCAocGF0aCwga2V5cykge1xuICAvLyBVc2UgYSBuZWdhdGl2ZSBsb29rYWhlYWQgdG8gbWF0Y2ggb25seSBjYXB0dXJpbmcgZ3JvdXBzLlxuICB2YXIgZ3JvdXBzID0gcGF0aC5zb3VyY2UubWF0Y2goL1xcKCg/IVxcPykvZyk7XG5cbiAgaWYgKGdyb3Vwcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXlzLnB1c2goe1xuICAgICAgICBuYW1lOiAgICAgIGksXG4gICAgICAgIGRlbGltaXRlcjogbnVsbCxcbiAgICAgICAgb3B0aW9uYWw6ICBmYWxzZSxcbiAgICAgICAgcmVwZWF0OiAgICBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGF0dGFjaEtleXMocGF0aCwga2V5cyk7XG59XG5cbi8qKlxuICogVHJhbnNmb3JtIGFuIGFycmF5IGludG8gYSByZWdleHAuXG4gKlxuICogQHBhcmFtICB7QXJyYXl9ICBwYXRoXG4gKiBAcGFyYW0gIHtBcnJheX0gIGtleXNcbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5mdW5jdGlvbiBhcnJheVRvUmVnZXhwIChwYXRoLCBrZXlzLCBvcHRpb25zKSB7XG4gIHZhciBwYXJ0cyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aC5sZW5ndGg7IGkrKykge1xuICAgIHBhcnRzLnB1c2gocGF0aFRvUmVnZXhwKHBhdGhbaV0sIGtleXMsIG9wdGlvbnMpLnNvdXJjZSk7XG4gIH1cblxuICB2YXIgcmVnZXhwID0gbmV3IFJlZ0V4cCgnKD86JyArIHBhcnRzLmpvaW4oJ3wnKSArICcpJywgZmxhZ3Mob3B0aW9ucykpO1xuICByZXR1cm4gYXR0YWNoS2V5cyhyZWdleHAsIGtleXMpO1xufVxuXG4vKipcbiAqIFJlcGxhY2UgdGhlIHNwZWNpZmljIHRhZ3Mgd2l0aCByZWdleHAgc3RyaW5ncy5cbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSAge0FycmF5fSAga2V5c1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiByZXBsYWNlUGF0aCAocGF0aCwga2V5cykge1xuICB2YXIgaW5kZXggPSAwO1xuXG4gIGZ1bmN0aW9uIHJlcGxhY2UgKF8sIGVzY2FwZWQsIHByZWZpeCwga2V5LCBjYXB0dXJlLCBncm91cCwgc3VmZml4LCBlc2NhcGUpIHtcbiAgICBpZiAoZXNjYXBlZCkge1xuICAgICAgcmV0dXJuIGVzY2FwZWQ7XG4gICAgfVxuXG4gICAgaWYgKGVzY2FwZSkge1xuICAgICAgcmV0dXJuICdcXFxcJyArIGVzY2FwZTtcbiAgICB9XG5cbiAgICB2YXIgcmVwZWF0ICAgPSBzdWZmaXggPT09ICcrJyB8fCBzdWZmaXggPT09ICcqJztcbiAgICB2YXIgb3B0aW9uYWwgPSBzdWZmaXggPT09ICc/JyB8fCBzdWZmaXggPT09ICcqJztcblxuICAgIGtleXMucHVzaCh7XG4gICAgICBuYW1lOiAgICAgIGtleSB8fCBpbmRleCsrLFxuICAgICAgZGVsaW1pdGVyOiBwcmVmaXggfHwgJy8nLFxuICAgICAgb3B0aW9uYWw6ICBvcHRpb25hbCxcbiAgICAgIHJlcGVhdDogICAgcmVwZWF0XG4gICAgfSk7XG5cbiAgICBwcmVmaXggPSBwcmVmaXggPyAoJ1xcXFwnICsgcHJlZml4KSA6ICcnO1xuICAgIGNhcHR1cmUgPSBlc2NhcGVHcm91cChjYXB0dXJlIHx8IGdyb3VwIHx8ICdbXicgKyAocHJlZml4IHx8ICdcXFxcLycpICsgJ10rPycpO1xuXG4gICAgaWYgKHJlcGVhdCkge1xuICAgICAgY2FwdHVyZSA9IGNhcHR1cmUgKyAnKD86JyArIHByZWZpeCArIGNhcHR1cmUgKyAnKSonO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25hbCkge1xuICAgICAgcmV0dXJuICcoPzonICsgcHJlZml4ICsgJygnICsgY2FwdHVyZSArICcpKT8nO1xuICAgIH1cblxuICAgIC8vIEJhc2ljIHBhcmFtZXRlciBzdXBwb3J0LlxuICAgIHJldHVybiBwcmVmaXggKyAnKCcgKyBjYXB0dXJlICsgJyknO1xuICB9XG5cbiAgcmV0dXJuIHBhdGgucmVwbGFjZShQQVRIX1JFR0VYUCwgcmVwbGFjZSk7XG59XG5cbi8qKlxuICogTm9ybWFsaXplIHRoZSBnaXZlbiBwYXRoIHN0cmluZywgcmV0dXJuaW5nIGEgcmVndWxhciBleHByZXNzaW9uLlxuICpcbiAqIEFuIGVtcHR5IGFycmF5IGNhbiBiZSBwYXNzZWQgaW4gZm9yIHRoZSBrZXlzLCB3aGljaCB3aWxsIGhvbGQgdGhlXG4gKiBwbGFjZWhvbGRlciBrZXkgZGVzY3JpcHRpb25zLiBGb3IgZXhhbXBsZSwgdXNpbmcgYC91c2VyLzppZGAsIGBrZXlzYCB3aWxsXG4gKiBjb250YWluIGBbeyBuYW1lOiAnaWQnLCBkZWxpbWl0ZXI6ICcvJywgb3B0aW9uYWw6IGZhbHNlLCByZXBlYXQ6IGZhbHNlIH1dYC5cbiAqXG4gKiBAcGFyYW0gIHsoU3RyaW5nfFJlZ0V4cHxBcnJheSl9IHBhdGhcbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICAgICAgICAgICAgW2tleXNdXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgICAgICAgIFtvcHRpb25zXVxuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5mdW5jdGlvbiBwYXRoVG9SZWdleHAgKHBhdGgsIGtleXMsIG9wdGlvbnMpIHtcbiAga2V5cyA9IGtleXMgfHwgW107XG5cbiAgaWYgKCFpc0FycmF5KGtleXMpKSB7XG4gICAgb3B0aW9ucyA9IGtleXM7XG4gICAga2V5cyA9IFtdO1xuICB9IGVsc2UgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgaWYgKHBhdGggaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICByZXR1cm4gcmVnZXhwVG9SZWdleHAocGF0aCwga2V5cywgb3B0aW9ucyk7XG4gIH1cblxuICBpZiAoaXNBcnJheShwYXRoKSkge1xuICAgIHJldHVybiBhcnJheVRvUmVnZXhwKHBhdGgsIGtleXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgdmFyIHN0cmljdCA9IG9wdGlvbnMuc3RyaWN0O1xuICB2YXIgZW5kID0gb3B0aW9ucy5lbmQgIT09IGZhbHNlO1xuICB2YXIgcm91dGUgPSByZXBsYWNlUGF0aChwYXRoLCBrZXlzKTtcbiAgdmFyIGVuZHNXaXRoU2xhc2ggPSBwYXRoLmNoYXJBdChwYXRoLmxlbmd0aCAtIDEpID09PSAnLyc7XG5cbiAgLy8gSW4gbm9uLXN0cmljdCBtb2RlIHdlIGFsbG93IGEgc2xhc2ggYXQgdGhlIGVuZCBvZiBtYXRjaC4gSWYgdGhlIHBhdGggdG9cbiAgLy8gbWF0Y2ggYWxyZWFkeSBlbmRzIHdpdGggYSBzbGFzaCwgd2UgcmVtb3ZlIGl0IGZvciBjb25zaXN0ZW5jeS4gVGhlIHNsYXNoXG4gIC8vIGlzIHZhbGlkIGF0IHRoZSBlbmQgb2YgYSBwYXRoIG1hdGNoLCBub3QgaW4gdGhlIG1pZGRsZS4gVGhpcyBpcyBpbXBvcnRhbnRcbiAgLy8gaW4gbm9uLWVuZGluZyBtb2RlLCB3aGVyZSBcIi90ZXN0L1wiIHNob3VsZG4ndCBtYXRjaCBcIi90ZXN0Ly9yb3V0ZVwiLlxuICBpZiAoIXN0cmljdCkge1xuICAgIHJvdXRlID0gKGVuZHNXaXRoU2xhc2ggPyByb3V0ZS5zbGljZSgwLCAtMikgOiByb3V0ZSkgKyAnKD86XFxcXC8oPz0kKSk/JztcbiAgfVxuXG4gIGlmIChlbmQpIHtcbiAgICByb3V0ZSArPSAnJCc7XG4gIH0gZWxzZSB7XG4gICAgLy8gSW4gbm9uLWVuZGluZyBtb2RlLCB3ZSBuZWVkIHRoZSBjYXB0dXJpbmcgZ3JvdXBzIHRvIG1hdGNoIGFzIG11Y2ggYXNcbiAgICAvLyBwb3NzaWJsZSBieSB1c2luZyBhIHBvc2l0aXZlIGxvb2thaGVhZCB0byB0aGUgZW5kIG9yIG5leHQgcGF0aCBzZWdtZW50LlxuICAgIHJvdXRlICs9IHN0cmljdCAmJiBlbmRzV2l0aFNsYXNoID8gJycgOiAnKD89XFxcXC98JCknO1xuICB9XG5cbiAgcmV0dXJuIGF0dGFjaEtleXMobmV3IFJlZ0V4cCgnXicgKyByb3V0ZSwgZmxhZ3Mob3B0aW9ucykpLCBrZXlzKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoYXJyKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsImltcG9ydCBwYWdlIGZyb20gJ3BhZ2UnO1xuaW1wb3J0IHtGaWxlTm90Rm91bmRQYWdlfSBmcm9tIFwicGFnZXMvRmlsZU5vdEZvdW5kUGFnZS5qc3hcIjtcblxuLypcbiAqIEhhbmRsZXMgcm91dGluZyBwYWdlcyB3aXRoaW4gdGhlIGFwcGxpY2F0aW9uIHVzaW5nIHBhZ2UuanMuXG4gKi9cbmV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuICAgIGNvbnN0cnVjdG9yKG1vdW50UG9pbnRJZCkge1xuICAgICAgICAvKiBNb3VudCB0aGUgYXBwbGljYXRpb24gdG8gdGhlIGVsZW1lbnQgc3BlY2lmaWVkIGJ5IHRoZSBnaXZlbiBJRC4gKi9cbiAgICAgICAgdGhpcy5yb3V0ZXMgPSB7fTtcblxuICAgICAgICB3aW5kb3cuYXBwLm1vdW50UG9pbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChtb3VudFBvaW50SWQpO1xuICAgICAgICB0aGlzLm1vdW50UG9pbnQgPSB3aW5kb3cuYXBwLm1vdW50UG9pbnQ7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBBZGQgYSBtYXBwaW5nIGZyb20gcm91dGUgVVJMIHRvIEphdmFzY3JpcHQgY29udHJvbGxlci5cbiAgICAgKi9cbiAgICBhZGRSb3V0ZShyb3V0ZSwgY29udHJvbGxlcikge1xuICAgICAgICB0aGlzLnJvdXRlc1tyb3V0ZV0gPSBjb250cm9sbGVyO1xuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIC8qIFJlZ2lzdGVyIGVhY2ggb2YgdGhlIHJvdXRlcyB3aXRoIHBhZ2UuanMuICovXG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5yb3V0ZXMpIHtcbiAgICAgICAgICAgIHBhZ2UoaSwgdGhpcy5yb3V0ZXNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogSWYgYSBwYWdlIGlzIG5vdCBtYXRjaGVkIGJ5IHRoZSBleGlzdGluZyByb3V0ZXMsIGZhbGwgdGhyb3VnaFxuICAgICAgICAgKiB0byB0aGUgNDA0IG5vdCBmb3VuZCBwYWdlLlxuICAgICAgICAgKi9cbiAgICAgICAgcGFnZShcIipcIiwgZnVuY3Rpb24oY3R4LCBuZXh0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiNDA0XCIsIGN0eCwgbmV4dCk7XG4gICAgICAgICAgICBSZWFjdC5yZW5kZXIoPEZpbGVOb3RGb3VuZFBhZ2UgLz4sIHdpbmRvdy5hcHAubW91bnRQb2ludCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qIFN0YXJ0IHRoZSByb3V0ZXIuICovXG4gICAgICAgIHBhZ2UoKTtcbiAgICB9XG59XG4iLCIvKlxuICogQSBtb2RhbCBvYmplY3Qgd2hpY2ggaXMgcmVzcG9uc2libGUgZm9yIHZpZXdpbmcgYW5kIHVwYXRlaW5nIHRoZSBzZXR0aW5ncy5cbiAqL1xuZXhwb3J0IGNsYXNzIEFwcFNldHRpbmdzTW9kYWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIuY29uc3RydWN0b3IocHJvcHMpO1xuXG4gICAgICAgIC8qIFNldCB0aGUgZGVmYXVsdCBzdGF0ZS4gKi9cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIHNhdmVTZXR0aW5nc0luUHJvZ3Jlc3M6IGZhbHNlLFxuICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgZ2VuZGVyOiBcIm90aGVyXCIsXG4gICAgICAgICAgICBhZ2U6IDBcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgLyogQmluZCB0aGUgc2hvd24gZnVuY3Rpb24gdG8gdGhlIG1vZGFsIHNob3duIGV2ZW50LiAqL1xuICAgICAgICAkKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpKS5vbihcInNob3duLmJzLm1vZGFsXCIsIHRoaXMuc2hvd24uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBXaGVuIHRoZSBtb2RhbCBpcyBzaG93biwgcmV0cmlldmUgdGhlIGN1cnJlbnQgc2V0dGluZ3MgZnJvbSB0aGUgc2VydmVyXG4gICAgICogYW5kIHBvcHVsYXRlIHRoZSBmb3JtIGFwcHJvcHJpYXRlbHkuXG4gICAgICovXG4gICAgc2hvd24oZSkge1xuICAgICAgICAkLmdldChcIi9hcGkvc2V0dGluZ3NcIiwgZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgIT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGdlbmRlcjogcmVzdWx0LmdlbmRlcixcbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiByZXN1bHQud2VpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHJlc3VsdC5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIGFnZTogcmVzdWx0LmFnZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogSGFuZGxlcyB0aGUgc2F2aW5nIG9mIHRoZSBmb3JtIHZhbHVlcyB0byB0aGUgc2VydmVyLlxuICAgICAqL1xuICAgIGJlZ2luU2F2ZVNldHRpbmdzKCkge1xuXG4gICAgICAgIC8qIEluZGljYXRlIHRoYXQgdGhlIHNhdmUgaGFzIGJlZ3VuLCB0byBoaWRlIHRoZSBzYXZlIGJ1dHRvbi4gKi9cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c2F2ZVNldHRpbmdzSW5Qcm9ncmVzczogdHJ1ZX0pO1xuXG4gICAgICAgIC8qIENvbnN0cnVjdCB0aGUgcmVxdWVzdCBmcm9tIHRoZSBmb3JtIHZhbHVlcy4gKi9cbiAgICAgICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgICAgICAgIHdlaWdodDogdGhpcy5zdGF0ZS53ZWlnaHQsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUuaGVpZ2h0LFxuICAgICAgICAgICAgYWdlOiB0aGlzLnN0YXRlLmFnZSxcbiAgICAgICAgICAgIGdlbmRlcjogdGhpcy5zdGF0ZS5nZW5kZXJcbiAgICAgICAgfTtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBQb3N0IHRoZSB2YWx1ZXMgdG8gdGhlIHNlcnZlciB0byB1cGRhdGUgdGhlIHNldHRpbmdzLCBhbmQgaGlkZVxuICAgICAgICAgKiB0aGUgbW9kYWwuXG4gICAgICAgICAqL1xuICAgICAgICAkLnBvc3QoXCIvYXBpL3VwZGF0ZV9zZXR0aW5nc1wiLCBwYXJhbXMsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c2F2ZVNldHRpbmdzSW5Qcm9ncmVzczogZmFsc2V9KTtcblxuICAgICAgICAgICAgJChSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSkubW9kYWwoXCJoaWRlXCIpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogVXBkYXRlIHRoZSBzdG9yZWQgd2VpZ2h0IGluIHJlc3BvbnNlIHRvIHRoZSBmaWVsZCB1ZHBhdGluZy5cbiAgICAgKiBXZWlnaHQgaXMgc3RvcmVkIGluIGtpb2dyYW1zLlxuICAgICAqL1xuICAgIHdlaWdodENoYW5nZWQoZSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHt3ZWlnaHQ6IHBhcnNlSW50KGUudGFyZ2V0LnZhbHVlKX0pO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogVXBkYXRlIHRoZSBzdG9yZWQgaGVpZ2h0IGluIHJlc3BvbnNlIHRvIHRoZSBmaWVsZCB1ZHBhdGluZy5cbiAgICAgKiBIZWlnaHQgaXMgc3RvcmVkIGluIGNlbnRpbWV0ZXJzLlxuICAgICAqL1xuICAgIGhlaWdodENoYW5nZWQoZSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtoZWlnaHQ6IHBhcnNlSW50KGUudGFyZ2V0LnZhbHVlKX0pO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogVXBkYXRlIHRoZSBzdG9yZWQgZ2VuZGVyIGluIHJlc3BvbnNlIHRvIHRoZSBmaWVsZCB1ZHBhdGluZy5cbiAgICAgKiBHZW5kZXIgaXMgc3RvcmVkIGFzIGEgc3RyaW5nOiAnbWFsZScsICdmZW1hbGUnIG9yICdvdGhlcicuLlxuICAgICAqL1xuICAgIGdlbmRlckNoYW5nZWQoZSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtnZW5kZXI6IGUudGFyZ2V0LnZhbHVlfSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBVcGRhdGUgdGhlIHN0b3JlZCBhZ2UgaW4gcmVzcG9uc2UgdG8gdGhlIGZpZWxkIHVkcGF0aW5nLlxuICAgICAqIEhlaWdodCBpcyBzdG9yZWQgaW4geWVhcnMuXG4gICAgICovXG4gICAgYWdlQ2hhbmdlZChlKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2FnZTogcGFyc2VJbnQoZS50YXJnZXQudmFsdWUpfSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBDb25zdHJ1Y3QgdGhlIGZvcm0gdG8gYmUgZGlzcGxheWVkIGluIHRoZSBtb2RhbCwgZ2l2ZW4gdGhlIHBhcmFtZXRlcnMuXG4gICAgICovXG4gICAgZ2V0Rm9ybSgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvck5hbWU9XCJ3ZWlnaHRcIj5XZWlnaHQgKGtnKTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJ3ZWlnaHRcIiB2YWx1ZT17dGhpcy5zdGF0ZS53ZWlnaHR9IHR5cGU9XCJudW1iZXJcIiBvbkNoYW5nZT17dGhpcy53ZWlnaHRDaGFuZ2VkLmJpbmQodGhpcyl9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiPjwvaW5wdXQ+XG5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yTmFtZT1cImhlaWdodFwiPkhlaWdodCAoY20pPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImhlaWdodFwiIHZhbHVlPXt0aGlzLnN0YXRlLmhlaWdodH0gdHlwZT1cIm51bWJlclwiIG9uQ2hhbmdlPXt0aGlzLmhlaWdodENoYW5nZWQuYmluZCh0aGlzKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCI+PC9pbnB1dD5cblxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3JOYW1lPVwiYWdlXCI+QWdlICh5ZWFycyk8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwiYWdlXCIgdmFsdWU9e3RoaXMuc3RhdGUuYWdlfSB0eXBlPVwibnVtYmVyXCIgb25DaGFuZ2U9e3RoaXMuYWdlQ2hhbmdlZC5iaW5kKHRoaXMpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIj48L2lucHV0PlxuXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvck5hbWU9XCJnZW5kZXJcIj5HZW5kZXI8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdmFsdWU9e3RoaXMuc3RhdGUuZ2VuZGVyfSBvbkNoYW5nZT17dGhpcy5nZW5kZXJDaGFuZ2VkLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwibWFsZVwiPk1hbGU8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImZlbWFsZVwiPkZlbWFsZTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwib3RoZXJcIj5PdGhlcjwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuXG4gICAgICAgIC8qIENvbnN0cnVjdCB0aGUgY29udGVudCBvZiB0aGUgbW9kYWwuICovXG4gICAgICAgIHZhciBiZWZvcmVJbXBvcnRCb2R5ID0gW1xuICAgICAgICAgICAgPHA+UGxlYXNlIGNvbmZpZ3VyZSB0aGUgYXBwbGljYXRpb24gc2V0dGluZ3MsIHRoaXMgaW5mb3JtYXRpb24gaXMgdXNlZCB0byBjYWxjdWxhdGUgdGhlIGtpbG9qb3VsZXMgeW91IGJ1cm4gb24gZWFjaCBydW4uPC9wPixcbiAgICAgICAgICAgIHRoaXMuZ2V0Rm9ybSgpXG4gICAgICAgIF07XG5cbiAgICAgICAgdmFyIGJvZHkgPSBiZWZvcmVJbXBvcnRCb2R5O1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsIGZhZGVcIiBpZD1cInNldHRpbmdzX21vZGFsXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1kaWFsb2dcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJtb2RhbC10aXRsZVwiPjxpIGNsYXNzTmFtZT1cImlvbiBpb24tZ2Vhci1hXCI+PC9pPiBBcHBsaWNhdGlvbiBTZXR0aW5nczwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtYm9keVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtib2R5fVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBvbkNsaWNrPXt0aGlzLmJlZ2luU2F2ZVNldHRpbmdzLmJpbmQodGhpcyl9IGRpc2FibGVkPXt0aGlzLnN0YXRlLnNhdmVTZXR0aW5nc0luUHJvZ3Jlc3N9PlNhdmU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsInZhciBDaGFydEpzID0gcmVxdWlyZShcImNoYXJ0LmpzXCIpO1xuXG4vKipcbiAqIEEgZ2VuZXJpYyBiYXIgY2hhcnQgY29tcG9uZW50IHVzaW5nIENoYXJ0anNcbiAqXG4gKiBEYXRhIGFuZCBvcHRpb25zIGFyZSBwYXNzZWQgYXMgcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEJhckNoYXJ0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpc2UgdGhlIGNoYXJ0IGluIHRoZSBET00uXG4gICAgICovXG4gICAgY3JlYXRlQ2hhcnQoKSB7XG4gICAgICAgIHZhciBjb250ZXh0ID0gJChSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSlcbiAgICAgICAgICAgIC5maW5kKFwiLmNoYXJ0XCIpWzBdXG4gICAgICAgICAgICAuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gICAgICAgIHRoaXMuY2hhcnQgPSBuZXcgQ2hhcnRKcyhjb250ZXh0KVxuICAgICAgICAgICAgLkJhcih0aGlzLnByb3BzLmRhdGEsIHRoaXMucHJvcHMub3B0cyk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgY2hhcnQgb24gbW91bnRcbiAgICAgICAgdGhpcy5jcmVhdGVDaGFydCgpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVcGRhdGUoKSB7XG4gICAgICAgIC8vIElmIHRoZSBkYXRhIHVwZGF0ZXMsIHJlZnJlc2ggdGhlIGNoYXJ0IGJ5IHJlY3JlYXRpbmcgaXRcbiAgICAgICAgdGhpcy5jaGFydC5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuY3JlYXRlQ2hhcnQoKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG5cbiAgICAgICAgLy8gSnVzdCBhIHNpbXBsZSBkaXYgd2l0aCBhIGNhbnZhcyB0byByZW5kZXIgdGhlIGNoYXJ0IGludG9cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGNhbnZhcyBjbGFzc05hbWU9XCJjaGFydFwiIHdpZHRoPVwiNDAwXCIgaGVpZ2h0PVwiMjAwXCI+PC9jYW52YXM+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCIvKipcbiAqIFRoZSBpbXBvcnQgZGF0YSBtb2RhbCBpcyB1c2VkIHRvIGFsbG93IHRoZSB1c2VyIHRvIHVwbG9hZCBuZXcgZGF0YSBmcm9tIHRoZVxuICogZGV2aWNlLiBUaGUgZGV2aWNlIHBhc3N3b3JkIGNhbiBiZSBlbnRlcmVkIGFuZCBwcm9ncmVzcyBjYW4gYmUgb2JzZXJ2ZWRcbiAqIHRocm91Z2ggdmFyaW91cyBwcm9tcHRzLlxuICovXG5leHBvcnQgY2xhc3MgSW1wb3J0RGF0YU1vZGFsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyLmNvbnN0cnVjdG9yKHByb3BzKTtcblxuICAgICAgICAvLyBpbnRpYWxpc2UgdGhlIHN0YXRlXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBpbXBvcnRGYWlsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgaW1wb3J0SW5Qcm9ncmVzczogZmFsc2UsXG4gICAgICAgICAgICBhdHRlbXB0ZWRJbXBvcnQ6IGZhbHNlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gdGhlIHBhc3N3b3JkIGZpZWxkIHVwZGF0ZXNcbiAgICAgKiBAcGFyYW0gIEV2ZW50IGVcbiAgICAgKi9cbiAgICBwYXNzd29yZENoYW5nZShlKSB7XG4gICAgICAgIC8vIFN0b3JlIHRoZSBwYXNzd29yZCBpbiB0aGUgc3RhdGUgZm9yIHVzZSBsYXRlclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHBhc3N3b3JkOiBlLnRhcmdldC52YWx1ZVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhbiBpbXBvcnQgaXMgdHJpZ2dlcmVkLCBQT1NUcyBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgICAqIGFuZCByZXR1cm5zIGVpdGhlciBzdWNjZXNzIG9yIGZhaWx1cmUgZGVwZW5kaW5nIG9uIHRoZSBkZXZpY2VcbiAgICAgKiBzdGF0dXMuXG4gICAgICovXG4gICAgYmVnaW5EYXRhSW1wb3J0KCkge1xuXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgc3RhdGUgZm9yIGRpc3BsYXlcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aW1wb3J0SW5Qcm9ncmVzczogdHJ1ZSwgYXR0ZW1wdGVkSW1wb3J0OiB0cnVlfSk7XG5cbiAgICAgICAgLy8gUmVxdWVzdCB3LyBwYXNzd29yZFxuICAgICAgICAkLnBvc3QoXCIvYXBpL2ltcG9ydF9kYXRhXCIsIHtwYXNzd29yZDogdGhpcy5zdGF0ZS5wYXNzd29yZH0sXG5cbiAgICAgICAgICAgIGZ1bmN0aW9uKHJlc3VsdCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgc3RhdGUgZm9yIGRpc3BsYXlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aW1wb3J0RmFpbGVkOiBmYWxzZX0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFdhaXQgYSBzZWNvbmQsIHRoZW4gcmVmcmVzaCB0aGUgcGFnZVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRGlzcGxheSB0aGUgZXJyb3IgbWVzc2FnZSB0byB0aGUgdXNlclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydEZhaWxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogcmVzdWx0LmVycm9yXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2ltcG9ydEluUHJvZ3Jlc3M6IGZhbHNlfSk7XG5cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcblxuICAgICAgICAvLyBCZWZvcmUgYW4gaW1wb3J0IGlzIHN0YXJ0ZWQsIHRoaXMgaXMgdGhlIG1vZGFsIGNvbnRlbnRcbiAgICAgICAgdmFyIGJlZm9yZUltcG9ydEJvZHkgPSBbXG4gICAgICAgICAgICA8cD5FbnRlciB5b3VyIHBhc3N3b3JkIHRvIGltcG9ydCB5b3VyIHJ1biBkYXRhPC9wPixcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3JOYW1lPVwicGFzc3dvcmRcIj5QYXNzd29yZDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJwYXNzd29yZFwiIHZhbHVlPXt0aGlzLnN0YXRlLnBhc3N3b3JkfSBvbkNoYW5nZT17dGhpcy5wYXNzd29yZENoYW5nZS5iaW5kKHRoaXMpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwicGFzc3dvcmRcIj48L2lucHV0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIF07XG5cbiAgICAgICAgLy8gSWYgYW4gaW1wb3J0IGZhaWxzXG4gICAgICAgIHZhciBmYWlsZWRJbXBvcnRCb2R5ID0gW1xuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhbGVydCBhbGVydC1kYW5nZXJcIiByb2xlPVwiYWxlcnRcIj48c3Ryb25nPkltcG9ydCBmYWlsZWQ8L3N0cm9uZz46IHt0aGlzLnN0YXRlLmVycm9yTWVzc2FnZX08L2Rpdj4sXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yTmFtZT1cInBhc3N3b3JkXCI+UGFzc3dvcmQ8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwicGFzc3dvcmRcIiB2YWx1ZT17dGhpcy5zdGF0ZS5wYXNzd29yZH0gb25DaGFuZ2U9e3RoaXMucGFzc3dvcmRDaGFuZ2UuYmluZCh0aGlzKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInBhc3N3b3JkXCI+PC9pbnB1dD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBdO1xuXG4gICAgICAgIC8vIFdoaWxlIGFuIGltcG9ydCBpcyBpbiBwcm9ncmVzc1xuICAgICAgICB2YXIgaW1wb3J0SW5Qcm9ncmVzcyA9IFtcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWxlcnQgYWxlcnQtaW5mb1wiIHJvbGU9XCJhbGVydFwiPkltcG9ydCBwcm9jZXNzaW5nLi4uPC9kaXY+XG4gICAgICAgIF07XG5cbiAgICAgICAgLy8gSWYgYW4gaW1wb3J0IHN1Y2NlZWRzXG4gICAgICAgIHZhciBzdWNjZXNzSW1wb3J0Qm9keSA9IFtcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWxlcnQgYWxlcnQtc3VjY2Vzc1wiIHJvbGU9XCJhbGVydFwiPkltcG9ydCBzdWNjZWVkZWQhPC9kaXY+XG4gICAgICAgIF07XG5cbiAgICAgICAgdmFyIGJvZHk7XG5cbiAgICAgICAgLy8gU3RhdGUgbWFjaGluZSBmb3IgZGV0ZXJtaW5pbmcgd2hpY2ggdmlldyB0byB1c2VcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaW1wb3J0SW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgYm9keSA9IGltcG9ydEluUHJvZ3Jlc3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5hdHRlbXB0ZWRJbXBvcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5pbXBvcnRGYWlsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgYm9keSA9IGZhaWxlZEltcG9ydEJvZHk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYm9keSA9IHN1Y2Nlc3NJbXBvcnRCb2R5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYm9keSA9IGJlZm9yZUltcG9ydEJvZHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbCBmYWRlXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1kaWFsb2dcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJtb2RhbC10aXRsZVwiPjxpIGNsYXNzTmFtZT1cImlvbi11cGxvYWRcIiAvPiBJbXBvcnQgeW91ciBSdW5zPC9oND5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2JvZHl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIG9uQ2xpY2s9e3RoaXMuYmVnaW5EYXRhSW1wb3J0LmJpbmQodGhpcyl9IGRpc2FibGVkPXt0aGlzLnN0YXRlLmltcG9ydEluUHJvZ3Jlc3N9PkJlZ2luIEltcG9ydDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwidmFyIENoYXJ0SnMgPSByZXF1aXJlKFwiY2hhcnQuanNcIik7XG5cbi8qKlxuICogQSBnZW5lcmljIGxpbmUgY2hhcnQgY29tcG9uZW50IHVzaW5nIENoYXJ0anNcbiAqXG4gKiBEYXRhIGFuZCBvcHRpb25zIGFyZSBwYXNzZWQgYXMgcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0IGNsYXNzIExpbmVDaGFydCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY2hhcnQgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpc2UgdGhlIGNoYXJ0IGluIHRoZSBET00uXG4gICAgICovXG4gICAgY3JlYXRlQ2hhcnQoKSB7XG4gICAgICAgIHZhciBjb250ZXh0ID0gJChSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSkuZmluZChcIi5jaGFydFwiKVswXS5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIHRoaXMuY2hhcnQgPSBuZXcgQ2hhcnRKcyhjb250ZXh0KS5MaW5lKHRoaXMucHJvcHMuZGF0YSwgdGhpcy5wcm9wcy5vcHRzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBjaGFydCBvbiBtb3VudFxuICAgICAgICB0aGlzLmNyZWF0ZUNoYXJ0KCk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVwZGF0ZSgpIHtcbiAgICAgICAgLy8gSWYgdGhlIGRhdGEgdXBkYXRlcywgcmVmcmVzaCB0aGUgY2hhcnQgYnkgcmVjcmVhdGluZyBpdFxuICAgICAgICB0aGlzLmNoYXJ0LmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5jcmVhdGVDaGFydCgpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGNhbnZhcyBjbGFzc05hbWU9XCJjaGFydCBjZW50ZXItY2hhcnRcIiB3aWR0aD17dGhpcy5wcm9wcy53aWR0aH0gaGVpZ2h0PXt0aGlzLnByb3BzLmhlaWdodH0+PC9jYW52YXM+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbkxpbmVDaGFydC5kZWZhdWx0UHJvcHMgPSB7XG4gICAgd2lkdGg6IDM2MCxcbiAgICBoZWlnaHQ6IDE4MFxufVxuIiwiaW1wb3J0IHtOYXZiYXJ9IGZyb20gXCJjb21wb25lbnRzL05hdmJhci5qc3hcIjtcbmltcG9ydCB7TW9kYWxUcmlnZ2VyfSBmcm9tIFwiY29tcG9uZW50cy9Nb2RhbFRyaWdnZXIuanN4XCI7XG5pbXBvcnQge1VwbG9hZERhdGFCdXR0b259IGZyb20gXCJjb21wb25lbnRzL1VwbG9hZERhdGFCdXR0b24uanN4XCI7XG5pbXBvcnQge0ltcG9ydERhdGFNb2RhbH0gZnJvbSBcImNvbXBvbmVudHMvSW1wb3J0RGF0YU1vZGFsLmpzeFwiO1xuXG4vKipcbiAqIFRoZSBtYWluIG5hdmlnYXRpb24gYmFyIGRpc3BsYXllZCBhdCB0aGUgdG9wIG9mIGV2ZXJ5IHBhZ2Ugd2l0aGluIHRoZVxuICogYXBwbGljYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBNYWluTmF2YmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGltcG9ydERhdGEoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuXG5cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG5cbiAgICAgICAgLy8gUGFzcyB0aGUgbmF2aWdhdGlvbiBhcnJheSBpbnRvIHRoZSBnZW5lcmljIG5hdmJhclxuICAgICAgICB2YXIgbGlua3MgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJEYXNoYm9hcmRcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcImlvbi1pb3MtaG9tZVwiLFxuICAgICAgICAgICAgICAgIHVybDogXCIvZGFzaGJvYXJkXCIsXG4gICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uKCkge30sXG4gICAgICAgICAgICAgICAgY29udGV4dDogdGhpcyxcbiAgICAgICAgICAgICAgICBidXR0b246IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwiUnVuIEhpc3RvcnlcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcImlvbi1zdGF0cy1iYXJzXCIsXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9oaXN0b3J5XCIsXG4gICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uKCkge30sXG4gICAgICAgICAgICAgICAgY29udGV4dDogdGhpcyxcbiAgICAgICAgICAgICAgICBidXR0b246IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxOYXZiYXIgbGlua3M9e2xpbmtzfSAvPlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsIlxuLyoqXG4gKiBUaGUgbWFwIGNvbXBvbmVudCBpcyB1c2VkIG9uIHRoZSBydW4gZGlzcGxheSBwYWdlLCBpdCBpcyByZXNwb25zaWJsZVxuICogZm9yIGRpc3BsYXlpbmcgdGhlIHBhdGggYSB1c2VyIHRvb2sgZHVyaW5nIHRoZWlyIGpvdXJuZXkgd2l0aFxuICogYXBwcm9wcmlhdGUgc3BlZWQgY29sb3VyIGNvZGluZy5cbiAqXG4gKiBUaGUgY29tcG9uZW50IGNhbiBhbHNvIGdlbmVyYXRlIGEgc3RhdGljIGltYWdlIFVSTCBmb3Igc2hhcmluZyBwdXJwb3Nlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgLy8gVXNlZCBpbiBzdGF0aWMgdXJsIGdlbmVyYXRpb25cbiAgICAgICAgdGhpcy5pbml0U3RhdGljTWFwU3RyaW5ncygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlIHRoZSBtYXBzIHN0YXRpYyBVUkwgZm9yIHRoZSBjdXJyZW50bHkgZGlzcGxheWVkIG1hcFxuICAgICAqIEByZXR1cm4gc3RyaW5nIE1hcCBVUkxcbiAgICAgKi9cbiAgICBnZXRTdGF0aWNVcmwoKSB7XG4gICAgICAgIHZhciBzdGF0aWNNYXBVcmwgPSBcImh0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9zdGF0aWNtYXA/XCIgK1xuICAgICAgICAgICAgdGhpcy5kZWZhdWx0T3B0c1N0cmluZyArIFwiJlwiICtcbiAgICAgICAgICAgIHRoaXMuY2VudGVyU3RyaW5nICsgXCImXCIgK1xuICAgICAgICAgICAgdGhpcy56b29tU3RyaW5nICsgXCImXCIgK1xuICAgICAgICAgICAgdGhpcy5ydW5QYXRoU3RyaW5nICsgXCImXCIgK1xuICAgICAgICAgICAgdGhpcy5tYXJrZXJTdHJpbmc7XG5cbiAgICAgICAgcmV0dXJuIHN0YXRpY01hcFVybDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmFuc2xhdGUgb3VyIGludGVybmFsIHdheXBvaW50IGZvcm1hdCBpbnRvIHRoZSBHb29nbGUgbWFwc1xuICAgICAqIGNvbmNlcHQgb2YgbGF0bG9uIHBhaXJzLlxuICAgICAqIEBwYXJhbSAgQXJyYXkgd2F5cG9pbnRzIExpc3Qgb2YgY29vcmRpbmF0ZSBwYWlycyBkZXNjcmliaW5nIHRoZSBydW5cbiAgICAgKiBAcGFyYW0gIEJvdW5kcyBib3VuZHMgICAgVGhlIG1hcCBib3VuZHNcbiAgICAgKiBAcmV0dXJuIEFycmF5IEEgbGlzdCBvZiBHb29nbGUgZm9ybWF0dGVkIHJ1biBwb2ludHNcbiAgICAgKi9cbiAgICBjb21wdXRlUnVuUGF0aCh3YXlwb2ludHMsIGJvdW5kcykge1xuICAgICAgICB2YXIgcnVuUGF0aCA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd2F5cG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnQgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKFxuICAgICAgICAgICAgICAgIHdheXBvaW50c1tpXS5sYXQsXG4gICAgICAgICAgICAgICAgd2F5cG9pbnRzW2ldLmxvblxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcnVuUGF0aC5wdXNoKCBwb2ludCApO1xuICAgICAgICAgICAgLy8gVXNlZCB0byBjb21wdXRlIHRoZSB2aWV3aW5nIHdpbmRvdyBmb3IgdGhlIG1hcFxuICAgICAgICAgICAgLy8gTmVlZCB0byBpbmNsdWRlIGFsbCBwb2ludHMgaW4gdGhlIHJ1blxuICAgICAgICAgICAgYm91bmRzLmV4dGVuZCggcG9pbnQgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBydW5QYXRoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlIHRoZSBzdGluZyByZXByZXNlbnRhdGlvbiBvZiBhIHJ1biBmb3IgdXNlIGluIHRoZSBzdGF0aWNcbiAgICAgKiBHb29nbGUgTWFwcyBpbWFnZS5cbiAgICAgKiBAcGFyYW0gIEFycmF5IHJ1blBhdGggQSBsaXN0IG9mIEdvb2dsZSBNYXBzIGNvbXBhdGlibGUgcG9pbnRzXG4gICAgICovXG4gICAgdXBkYXRlUnVuUGF0aFN0cmluZyhydW5QYXRoKSB7XG4gICAgICAgIHRoaXMucnVuUGF0aFN0cmluZyA9IFwicGF0aD1jb2xvcjoweDAwMDBmZnx3ZWlnaHQ6NXxcIjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1blBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucnVuUGF0aFN0cmluZyArPSBydW5QYXRoW2ldLkEgKyBcIixcIiArIHJ1blBhdGhbaV0uRjtcblxuICAgICAgICAgICAgaWYgKGkgPCBydW5QYXRoLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgdGhpcy5ydW5QYXRoU3RyaW5nICs9IFwifFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGUgdGhlIHN0cmluZyBkZXNjcmliaW5nIHRoZSBtYXJrZXJzIHRvIGJlIHBsYWNlZCBvbiBhXG4gICAgICogc3RhdGljIEdvb2dsZSBNYXBzIGltYWdlLlxuICAgICAqIEBwYXJhbSAgQ29vcmRpbmF0ZSBzdGFydFxuICAgICAqIEBwYXJhbSAgQ29vcmRpbmF0ZSBlbmRcbiAgICAgKi9cbiAgICB1cGRhdGVNYXJrZXJTdHJpbmcoc3RhcnQsIGVuZCkge1xuICAgICAgICB0aGlzLm1hcmtlclN0cmluZyA9IFwibWFya2Vycz1jb2xvcjpibHVlfFwiICsgc3RhcnQuQSArIFwiLFwiICtcbiAgICAgICAgICAgIHN0YXJ0LkYgKyBcInxcIiArIGVuZC5BICsgXCIsXCIgKyBlbmQuRjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSB0aGUgc3RyaW5nIGRlc2NyaWJpbmcgdGhlIHpvb20gbGV2ZWwgZm9yIHRoZSBzdGF0aWMgR29vZ2xlXG4gICAgICogTWFwcyBpbWFnZS5cbiAgICAgKiBAcGFyYW0gIE1hcCBtYXAgQ3VycmVudCBtYXAgaW5zdGFuY2VcbiAgICAgKi9cbiAgICBtYXBab29tSGFuZGxlcihtYXAsIGUpIHtcbiAgICAgICAgdGhpcy56b29tU3RyaW5nID0gXCJ6b29tPVwiICsgbWFwLnpvb207XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGUgdGhlIHN0cmluZyBkZXNjcmliaW5nIHRoZSBjZW50cmUgb2YgdGhlIG1hcCBmb3IgdGhlIHN0YXRpY1xuICAgICAqIEdvb2dsZSBNYXBzIGltYWdlLlxuICAgICAqIEBwYXJhbSAgTWFwIG1hcCBDdXJyZW50IGltYWdlIGluc3RhbmNlXG4gICAgICovXG4gICAgbWFwQ2VudGVySGFuZGxlcihtYXAsIGUpIHtcbiAgICAgICAgdGhpcy5jZW50ZXJTdHJpbmcgPSBcImNlbnRlcj1cIiArIG1hcC5jZW50ZXIuQSArIFwiLFwiICsgbWFwLmNlbnRlci5GO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlIHRoZSBiYXNlIGZvciB0aGUgc3RhdGljIG1hcCBzdHJpbmcsIHdoZW4gZ2VuZXJhdGluZyBhIG5ld1xuICAgICAqIGltYWdlLlxuICAgICAqL1xuICAgIGluaXRTdGF0aWNNYXBTdHJpbmdzKCkge1xuICAgICAgICB0aGlzLmRlZmF1bHRPcHRzU3RyaW5nID0gXCJzaXplPTExNjh4NDgwJm1hcHR5cGU9cm9hZG1hcFwiO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIHBvbHlsaW5lIGFubm90YXRpb24gb24gYSBnaXZlbiBNYXAgaW5zdGFuY2UgZ2l2ZW4gYSBydW5QYXRoXG4gICAgICogYW5kIGEgbGlzdCBvZiB3YXlwb2ludHMuXG4gICAgICogQHBhcmFtICBNYXAgbWFwXG4gICAgICogQHBhcmFtICBBcnJheSB3YXlwb2ludHNcbiAgICAgKiBAcGFyYW0gIEFycmF5IHJ1blBhdGhcbiAgICAgKi9cbiAgICBjcmVhdGVSdW5QYXRoUG9seWxpbmUobWFwLCB3YXlwb2ludHMsIHJ1blBhdGgpIHtcbiAgICAgICAgdmFyIHJ1blBhdGhQb2x5TGluZTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdheXBvaW50cy5sZW5ndGggLSAxOyBpKyspIHtcblxuICAgICAgICAgICAgLy8gTW92ZSBhbG9uZyB0aGUgcGF0aCBhbmQgY29tcHV0ZSB0aGUgZGlzdGFuY2UgYmV0d2VlbiBlYWNoIHBvaW50XG4gICAgICAgICAgICB2YXIgZHggPSBwYXJzZUZsb2F0KHdheXBvaW50c1tpXS5sYXQpIC1cbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KHdheXBvaW50c1tpICsgMV0ubGF0KTtcblxuICAgICAgICAgICAgdmFyIGR5ID0gcGFyc2VGbG9hdCh3YXlwb2ludHNbaV0ubG9uKSAtXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCh3YXlwb2ludHNbaSArIDFdLmxvbik7XG5cbiAgICAgICAgICAgIHZhciBkaXN0ID0gTWF0aC5zcXJ0KGR4ICogZHggICsgZHkgKiBkeSkgKiAxMDAwO1xuXG4gICAgICAgICAgICAvLyBTaW5jZSBkYXRhcG9pbnRzIGFyZSBldmVubHkgc3BhY2VkLCB3ZSBjYW4gdXNlIGRpc3RhbmNlIHRvXG4gICAgICAgICAgICAvLyBpbXBseSB0aGUgc3BlZWQgYmV0d2VlbiBlYWNoIHBvaW50IHBhaXJcblxuICAgICAgICAgICAgLy8gTXVsdGlwbHkgdGhlIGRpc3RhbmNlIHRvIGdpdmUgYSBjb25zdGFudCB3ZSBjYW4gdXNlIGluIGNvbG91clxuICAgICAgICAgICAgLy8gZ2VuZXJhdGlvblxuICAgICAgICAgICAgZGlzdCAqPSA2MDA7XG5cbiAgICAgICAgICAgIGlmICggZGlzdCA+IDIzMCApIHtcbiAgICAgICAgICAgICAgICBkaXN0ID0gMjMwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCBkaXN0IDwgMjAgKSB7XG4gICAgICAgICAgICAgICAgZGlzdCA9IDIwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBHZW5lcmF0ZSB0aGUgY29sb3VyIGZvciB0aGlzIGxpbmUgc2VnbWVudFxuICAgICAgICAgICAgdmFyIHIsIGcsIGI7XG4gICAgICAgICAgICByID0gcGFyc2VJbnQoKDI1NSAtIGRpc3QpKTtcbiAgICAgICAgICAgIGcgPSBwYXJzZUludCgoZGlzdCkpO1xuICAgICAgICAgICAgYiA9IDIwO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgbGluZSBzZWdtZW50IGJldHdlZW4gdGhlIGdpdmVuIHBvaW50cyxcbiAgICAgICAgICAgIC8vIHdpdGggb3VyIGNvbXB1dGVkIGNvbG91clxuICAgICAgICAgICAgcnVuUGF0aFBvbHlMaW5lID0gbmV3IGdvb2dsZS5tYXBzLlBvbHlsaW5lKHtcbiAgICAgICAgICAgICAgICBwYXRoOiBbcnVuUGF0aFtpXSwgcnVuUGF0aFtpICsgMV1dLFxuICAgICAgICAgICAgICAgIGdlb2Rlc2ljOiB0cnVlLFxuICAgICAgICAgICAgICAgIHN0cm9rZUNvbG9yOiAncmdiYSgnICsgciArICcsICcgKyBnICsgJywgJyArIGIgKyAnLCAxKScsXG4gICAgICAgICAgICAgICAgc3Ryb2tlT3BhY2l0eTogMS4wLFxuICAgICAgICAgICAgICAgIHN0cm9rZVdlaWdodDogM1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEFwcGx5IHRvIG1hcFxuICAgICAgICAgICAgcnVuUGF0aFBvbHlMaW5lLnNldE1hcChtYXApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGxhY2UgdGhlIHN0YXJ0IGFuZCBlbmQgZmxhZ3Mgb24gYSBnaXZlbiBNYXAgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtICBNYXAgbWFwXG4gICAgICogQHBhcmFtICBBcnJheSB3YXlwb2ludHNcbiAgICAgKiBAcGFyYW0gIEFycmF5IHJ1blBhdGhcbiAgICAgKi9cbiAgICBwbGFjZU1hcmtlcnMobWFwLCB3YXlwb2ludHMsIHJ1blBhdGgpIHtcblxuICAgICAgICAvLyBJbWFnZSBwYXRocyBmb3IgdXNlIGxhdGVyXG4gICAgICAgIHZhciBzdGFydEltYWdlID0gJy9pbWcvc3RhcnQucG5nJztcbiAgICAgICAgdmFyIGVuZEltYWdlID0gJy9pbWcvZW5kLnBuZyc7XG4gICAgICAgIHZhciBub2RlSW1hZ2UgPSAnL2ltZy9ibGFuay5wbmcnO1xuICAgICAgICB2YXIgaWNvbjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1blBhdGgubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgLy8gT25seSB1c2UgaW1hZ2VzIGF0IHRoZSBzdGFydCBhbmQgZW5kIG9mIHRoZSBydW5cbiAgICAgICAgICAgIGlmIChpID09IDApIHtcbiAgICAgICAgICAgICAgICBpY29uID0gc3RhcnRJbWFnZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PSBydW5QYXRoLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBpY29uID0gZW5kSW1hZ2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE5vZGUgaW1hZ2VzIGFyZSBibGFua1xuICAgICAgICAgICAgICAgIGljb24gPSBub2RlSW1hZ2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFN0b3JlIHRoZSB3YXlwb2ludCBpbnN0YW5jZSBmb3IgdXNlIGluIGEgY2FsbGJhY2tcbiAgICAgICAgICAgIGxldCB3cCA9IHRoaXMucHJvcHMud2F5cG9pbnRzW2ldO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgb3VyIGJhc2UgbWFya2VyIGJlZm9yZSB3aXJpbmcgdXAgZXZlbnRzXG4gICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHJ1blBhdGhbaV0sXG4gICAgICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSBUZXN0JyxcbiAgICAgICAgICAgICAgICBpY29uOiBpY29uXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gU2NvcGUgdGhlIGNhbGxiYWNrcyBjb3JyZWN0bHlcbiAgICAgICAgICAgIChmdW5jdGlvbiAobWFya2VyKSB7XG4gICAgICAgICAgICAgICAgLy8gRGlzcGxheSB0aGUgdGltZSBvZiBhIGRhdGFwb2ludCBvbiBob3ZlclxuICAgICAgICAgICAgICAgIHZhciBpbmZvd2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIlwiICsgd2luZG93LmFwcC5tb21lbnQod3AudGltZSAqIDEwMDApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZm9ybWF0KHdpbmRvdy5hcHAudGltZUZvcm1hdClcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ21vdXNlb3ZlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpbmZvd2luZG93Lm9wZW4obWFwLCBtYXJrZXIpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnbW91c2VvdXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5mb3dpbmRvdy5jbG9zZShtYXAsIG1hcmtlcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KShtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIC8vIEluaXRpYWwgYm91bmRzXG4gICAgICAgIHZhciBib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XG4gICAgICAgIC8vIFByb2Nlc3MgcnVuXG4gICAgICAgIHZhciBydW5QYXRoID0gdGhpcy5jb21wdXRlUnVuUGF0aCh0aGlzLnByb3BzLndheXBvaW50cywgYm91bmRzKTtcblxuICAgICAgICAvLyBNYXAgZGlzcGxheSBvcHRpb25zXG4gICAgICAgIHZhciBtYXBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuVEVSUkFJTlxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJlbmRlciB0aGUgbWFwXG4gICAgICAgIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKCQoUmVhY3QuZmluZERPTU5vZGUodGhpcykpXG4gICAgICAgICAgICAgICAgLmZpbmQoXCIubWFwLWNhbnZhc1wiKVswXSwgbWFwT3B0aW9ucyk7XG5cbiAgICAgICAgLy8gU3RvcmUgbWFwIHJlZmVyZW5jZVxuICAgICAgICB0aGlzLm1hcCA9IG1hcDtcbiAgICAgICAgbWFwLmZpdEJvdW5kcyhib3VuZHMpO1xuXG4gICAgICAgIC8vIEFkZCBsaXN0ZW5lcnMgZm9yIHpvb20gYW5kIGNlbnRlclxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lck9uY2UobWFwLCBcInpvb21fY2hhbmdlZFwiLFxuICAgICAgICAgICAgdGhpcy5tYXBab29tSGFuZGxlci5iaW5kKHRoaXMsIG1hcCkpO1xuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lck9uY2UobWFwLCBcImNlbnRlcl9jaGFuZ2VkXCIsXG4gICAgICAgICAgICB0aGlzLm1hcENlbnRlckhhbmRsZXIuYmluZCh0aGlzLCBtYXApKTtcblxuICAgICAgICAvLyBTZXQgbWFya2VycyB0byBzdGFydCBhbmQgZW5kIHBvaW50c1xuICAgICAgICB0aGlzLnVwZGF0ZU1hcmtlclN0cmluZyhydW5QYXRoWzBdLCBydW5QYXRoW3J1blBhdGgubGVuZ3RoIC0gMV0pO1xuICAgICAgICB0aGlzLnVwZGF0ZVJ1blBhdGhTdHJpbmcocnVuUGF0aCk7XG5cbiAgICAgICAgLy8gUmVuZGVyIHBvbHlsaW5lIGFuZCBtYXJrZXJzIG9uIG1hcFxuICAgICAgICB0aGlzLmNyZWF0ZVJ1blBhdGhQb2x5bGluZShtYXAsIHRoaXMucHJvcHMud2F5cG9pbnRzLCBydW5QYXRoKTtcbiAgICAgICAgdGhpcy5wbGFjZU1hcmtlcnMobWFwLCB0aGlzLnByb3BzLndheXBvaW50cywgcnVuUGF0aCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hcC1jYW52YXNcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsIi8qKlxuICogTW9kYWwgdHJpZ2dlcnMgY2FuIGJlIHVzZWQgdG8gb3BlbiBhIEJvb3RzdHJhcCBtb2RhbCBvbiBjbGljayBvZiBlaXRoZXJcbiAqIGEgbGluayBvciBidXR0b24uXG4gKi9cbmV4cG9ydCBjbGFzcyBNb2RhbFRyaWdnZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgLyoqXG4gICAgICogVHJpZ2dlciB0aGUgZW1iZWRkZWQgbW9kYWwgd2l0aGluIHRoZSBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIGNhbGxlZCBieSBhIGNsaWNrIHVzdWFsbHkuXG4gICAgICovXG4gICAgdHJpZ2dlck1vZGFsKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIFJlYWN0LnJlbmRlcih0aGlzLnByb3BzLm1vZGFsLCAkKCcjbW9kYWxfbW91bnQnKVswXSk7XG4gICAgICAgICQoJyNtb2RhbF9tb3VudCcpLmZpbmQoXCIubW9kYWxcIikubW9kYWwoXCJzaG93XCIpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcblxuICAgICAgICB2YXIgaW5uZXI7XG5cbiAgICAgICAgLy8gUmVuZGVyIGVpdGhlciBhIGJ1dHRvbiBvciBhIGxpbmsgZGVwZW5kaW5nIG9uIHRoZSBwcm9wIHZhbHVlXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmJ1dHRvbikge1xuICAgICAgICAgICAgaW5uZXIgPSA8YnV0dG9uIGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc05hbWV9IG9uQ2xpY2s9e3RoaXMudHJpZ2dlck1vZGFsLmJpbmQodGhpcyl9Pnt0aGlzLnByb3BzLmJ1dHRvblRleHR9PC9idXR0b24+XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbm5lciA9IDxhIGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc05hbWV9IGhyZWY9XCIjXCIgb25DbGljaz17dGhpcy50cmlnZ2VyTW9kYWwuYmluZCh0aGlzKX0+e3RoaXMucHJvcHMuYnV0dG9uVGV4dH08L2E+XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4oXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlubGluZS1ibG9ja1wiPlxuICAgICAgICAgICAgICAgIHtpbm5lcn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7TW9kYWxUcmlnZ2VyfSBmcm9tIFwiLi9Nb2RhbFRyaWdnZXIuanN4XCJcbmltcG9ydCB7QXBwU2V0dGluZ3NNb2RhbH0gZnJvbSBcIi4vQXBwU2V0dGluZ3NNb2RhbC5qc3hcIlxuaW1wb3J0IHtJbXBvcnREYXRhTW9kYWx9IGZyb20gXCJjb21wb25lbnRzL0ltcG9ydERhdGFNb2RhbC5qc3hcIlxuaW1wb3J0IHtVcGxvYWREYXRhQnV0dG9ufSBmcm9tIFwiY29tcG9uZW50cy9VcGxvYWREYXRhQnV0dG9uLmpzeFwiXG5cbi8qKlxuICogQSBnZW5lcmljIG5hdmJhciBjbGFzcyBiYXNlZCBvbiB0aGUgYm9vdHN0cmFwIG5hdmJhciBzdHJ1Y3R1cmUuXG4gKlxuICogTGlua3MgY2FuIGJlIHByb3ZlZCBhcyBhbiBhcnJheSBvZiB2YXJpb3VzIG9wdGlvbiBvYmplY3RzLlxuICovXG5leHBvcnQgY2xhc3MgTmF2YmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8bmF2IGNsYXNzTmFtZT1cIm5hdmJhciBuYXZiYXItZGVmYXVsdFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyLWZsdWlkXCI+XG4gICAgICAgICAgICAgICAgICAgIHsvKiBNb2JpbGUgbWVudSAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlIGNvbGxhcHNlZFwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIiNicy1leGFtcGxlLW5hdmJhci1jb2xsYXBzZS0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3Itb25seVwiPlRvZ2dsZSBuYXZpZ2F0aW9uPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24tYmFyXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24tYmFyXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24tYmFyXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIiBocmVmPVwiL1wiPkxpdmluZyBEZWFkIEZpdG5lc3MgVHJhY2tlcjwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgey8qIExpbmsgbGlzdCAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2VcIiBpZD1cImJzLWV4YW1wbGUtbmF2YmFyLWNvbGxhcHNlLTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXYgbmF2YmFyLW5hdlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5saW5rcy5tYXAoIGZ1bmN0aW9uKGVudHJ5KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZW50cnkuY29tcG9uZW50ICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDxsaT57ZW50cnkuY29tcG9uZW50fTwvbGk+KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVudHJ5LmJ1dHRvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDxsaT48YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBuYXZiYXItYnRuXCIgb25DbGljaz17ZW50cnkuY2xpY2suYmluZChlbnRyeS5jb250ZXh0KX0+e2VudHJ5Lm5hbWV9PC9idXR0b24+PC9saT4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoPGxpPjxhIGhyZWY9e2VudHJ5LnVybH0gb25DbGljaz17ZW50cnkuY2xpY2suYmluZChlbnRyeS5jb250ZXh0KX0+PGkgY2xhc3NOYW1lPXtlbnRyeS5pY29ufSAvPiB7ZW50cnkubmFtZX08L2E+PC9saT4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBPdGhlciBvcHRpb25zLCBzdWNoIGFzIHNldHRpbmdzIGFuZCBpbXBvcnQgKi99XG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2IG5hdmJhci1uYXYgbmF2YmFyLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TW9kYWxUcmlnZ2VyIG1vZGFsPXs8SW1wb3J0RGF0YU1vZGFsIC8+fSBidXR0b249e3RydWV9IGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBuYXZiYXItYnRuIG1hcmdpbi1yaWdodFwiIGJ1dHRvblRleHQ9ezxVcGxvYWREYXRhQnV0dG9uIC8+fSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TW9kYWxUcmlnZ2VyIG1vZGFsPXs8QXBwU2V0dGluZ3NNb2RhbCAvPn0gYnV0dG9uPXt0cnVlfSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgbmF2YmFyLWJ0blwiIGJ1dHRvblRleHQ9ezxpIGNsYXNzTmFtZT1cImlvbiBpb24tZ2Vhci1hXCI+PC9pPn0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L25hdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJ2YXIgQ2hhcnRKcyA9IHJlcXVpcmUoXCJjaGFydC5qc1wiKTtcblxuLyoqXG4gKiBBIGdlbmVyaWMgcGllIGNoYXJ0IGNvbXBvbmVudCB1c2luZyBDaGFydGpzXG4gKlxuICogRGF0YSBhbmQgb3B0aW9ucyBhcmUgcGFzc2VkIGFzIHByb3BlcnRpZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBQaWVDaGFydCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXNlIHRoZSBjaGFydCBpbiB0aGUgRE9NLlxuICAgICAqL1xuICAgIGNyZWF0ZUNoYXJ0KCkge1xuICAgICAgICB2YXIgY29udGV4dCA9ICQoUmVhY3QuZmluZERPTU5vZGUodGhpcykpLmZpbmQoXCIuY2hhcnRcIilbMF0uZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICB0aGlzLmNoYXJ0ID0gbmV3IENoYXJ0SnMoY29udGV4dCkuUGllKHRoaXMucHJvcHMuZGF0YSwgdGhpcy5wcm9wcy5vcHRzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBjaGFydCBvbiBtb3VudFxuICAgICAgICB0aGlzLmNyZWF0ZUNoYXJ0KCk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVwZGF0ZSgpIHtcbiAgICAgICAgLy8gSWYgdGhlIGRhdGEgdXBkYXRlcywgcmVmcmVzaCB0aGUgY2hhcnQgYnkgcmVjcmVhdGluZyBpdFxuICAgICAgICB0aGlzLmNoYXJ0LmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5jcmVhdGVDaGFydCgpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcblxuICAgICAgICAvLyBKdXN0IGEgc2ltcGxlIGRpdiB3aXRoIGEgY2FudmFzIHRvIHJlbmRlciB0aGUgY2hhcnQgaW50b1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8Y2FudmFzIGNsYXNzTmFtZT1cImNoYXJ0XCIgd2lkdGg9XCI0MDBcIiBoZWlnaHQ9XCIyMDBcIj48L2NhbnZhcz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsInZhciBDaGFydEpzID0gcmVxdWlyZShcImNoYXJ0LmpzXCIpO1xuXG4vKipcbiAqIEEgZ2VuZXJpYyByYWRhciBjaGFydCBjb21wb25lbnQgdXNpbmcgQ2hhcnRqc1xuICpcbiAqIERhdGEgYW5kIG9wdGlvbnMgYXJlIHBhc3NlZCBhcyBwcm9wZXJ0aWVzLlxuICovXG5leHBvcnQgY2xhc3MgUmFkYXJDaGFydCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXNlIHRoZSBjaGFydCBpbiB0aGUgRE9NLlxuICAgICAqL1xuICAgIGNyZWF0ZUNoYXJ0KCkge1xuICAgICAgICB2YXIgY29udGV4dCA9ICQoUmVhY3QuZmluZERPTU5vZGUodGhpcykpLmZpbmQoXCIuY2hhcnRcIilbMF0uZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICB0aGlzLmNoYXJ0ID0gbmV3IENoYXJ0SnMoY29udGV4dCkuUmFkYXIodGhpcy5wcm9wcy5kYXRhLCB0aGlzLnByb3BzLm9wdHMpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAvLyBDcmVhdGUgdGhlIGNoYXJ0IG9uIG1vdW50XG4gICAgICAgIHRoaXMuY3JlYXRlQ2hhcnQoKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVXBkYXRlKCkge1xuICAgICAgICAvLyBJZiB0aGUgZGF0YSB1cGRhdGVzLCByZWZyZXNoIHRoZSBjaGFydCBieSByZWNyZWF0aW5nIGl0XG4gICAgICAgIHRoaXMuY2hhcnQuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLmNyZWF0ZUNoYXJ0KCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuXG4gICAgICAgIC8vIEp1c3QgYSBzaW1wbGUgZGl2IHdpdGggYSBjYW52YXMgdG8gcmVuZGVyIHRoZSBjaGFydCBpbnRvXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxjYW52YXMgY2xhc3NOYW1lPVwiY2hhcnRcIiB3aWR0aD1cIjQwMFwiIGhlaWdodD1cIjIwMFwiPjwvY2FudmFzPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtGYWNlYm9va1NoYXJlQnV0dG9uLCBUd2l0dGVyU2hhcmVCdXR0b259IGZyb20gXCJjb21wb25lbnRzL1NvY2lhbFNoYXJpbmcuanN4XCI7XG5cbi8qKlxuICogQSBtb2RhbCBkaXNwbGF5ZWQgd2hlbiBhIHVzZXIgb3B0cyB0byBzaGFyZSB0aGVpciBydW4gdG8gZWl0aGVyIEZhY2Vib29rXG4gKiBvciBUd2l0dGVyLlxuICovXG5leHBvcnQgY2xhc3MgU2hhcmVSdW5Nb2RhbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuXG4gICAgICAgIC8vIFNob3cgdGhlIG1vZGFsIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBjcmVhdGVkXG4gICAgICAgICQoUmVhY3QuZmluZERPTU5vZGUodGhpcykpLm1vZGFsKFwic2hvd1wiKTtcblxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwgZmFkZVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZGlhbG9nXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwibW9kYWwtdGl0bGVcIj5TaGFyZSBZb3VyIFJ1bjwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtYm9keVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBEaXNwbGF5IGltYWdlIGFuZCBzaGFyaW5nIGNvbnRyb2xzICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXt0aGlzLnByb3BzLmltYWdlVXJsfSB3aWR0aD1cIjEwMCVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEZhY2Vib29rU2hhcmVCdXR0b24gdXJsPXt0aGlzLnByb3BzLmltYWdlVXJsfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUd2l0dGVyU2hhcmVCdXR0b24gdXJsPXt0aGlzLnByb3BzLmltYWdlVXJsfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBTb2NpYWwgc2hhcmluZyBidXR0b25zIHRoYXQgYXV0b21hdGljYWxseSB0cmlnZ2VyIEFQSSByZXF1ZXN0c1xuICogdXNpbmcgdGhlIHByb3ZpZGVkIFVSTCBhbmQgbWVzc2FnZS5cbiAqL1xuXG5cbi8qXG4gKiBFeGFtcGxlXG4gKiA8RmFjZWJvb2tTaGFyZUJ1dHRvbiB1cmw9XCJodHRwOi8vaS5pbWd1ci5jb20vM3NrdkEuanBnXCIgLz5cbiAqL1xuZXhwb3J0IGNsYXNzIEZhY2Vib29rU2hhcmVCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIC8vIENyZWF0ZSBhbmQgbW91bnQgdGhlIGJ1dHRvbiBhcyBwZXIgQVBJIGluc3RydWN0aW9uc1xuICAgICAgICAoZnVuY3Rpb24oZCwgcywgaWQpIHtcbiAgICAgICAgICAgIHZhciBqcywgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXTtcbiAgICAgICAgICAgIGlmIChkLmdldEVsZW1lbnRCeUlkKGlkKSkgcmV0dXJuO1xuICAgICAgICAgICAganMgPSBkLmNyZWF0ZUVsZW1lbnQocyk7IGpzLmlkID0gaWQ7XG4gICAgICAgICAgICBqcy5zcmMgPSBcImh0dHBzOi8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fVVMvc2RrLmpzI3hmYm1sPTEmdmVyc2lvbj12Mi4zJmFwcElkPTYzOTU0MjE4NjE0Njc4NVwiO1xuICAgICAgICAgICAgZmpzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGpzLCBmanMpO1xuICAgICAgICB9XG4gICAgICAgIChkb2N1bWVudCwgJ3NjcmlwdCcsICdmYWNlYm9vay1qc3NkaycpKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIC8vIEhUTUwgYXMgZ2l2ZW4gaW4gQVBJXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZmItc2hhcmUtYnV0dG9uJ1xuICAgICAgICAgICAgICAgIGRhdGEtaHJlZj17dGhpcy5wcm9wcy51cmx9XG4gICAgICAgICAgICAgICAgZGF0YS1sYXlvdXQ9J2J1dHRvbic+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuLypcbiAqIEV4YW1wbGVcbiAqIDxUd2l0dGVyU2hhcmVCdXR0b24gdXJsPVwiaHR0cDovL2kuaW1ndXIuY29tLzNza3ZBLmpwZ1wiIG1lc3NhZ2U9XCJTYW1wbGUgYm9keVwiIC8+XG4gKi9cbmV4cG9ydCBjbGFzcyBUd2l0dGVyU2hhcmVCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGFuZCBtb3VudCB0aGUgYnV0dG9uIGFzIHBlciBBUEkgaW5zdHJ1Y3Rpb25zXG4gICAgICAgICFmdW5jdGlvbihkLHMsaWQpe1xuICAgICAgICAgICAgdmFyIGpzLGZqcz1kLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLHA9L15odHRwOi8udGVzdChkLmxvY2F0aW9uKT8naHR0cCc6J2h0dHBzJztcbiAgICAgICAgICAgIGlmKCFkLmdldEVsZW1lbnRCeUlkKGlkKSl7XG4gICAgICAgICAgICAgICAganM9ZC5jcmVhdGVFbGVtZW50KHMpO1xuICAgICAgICAgICAgICAgIGpzLmlkPWlkO2pzLnNyYz1wKyc6Ly9wbGF0Zm9ybS50d2l0dGVyLmNvbS93aWRnZXRzLmpzJztcbiAgICAgICAgICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsZmpzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAoZG9jdW1lbnQsICdzY3JpcHQnLCAndHdpdHRlci13anMnKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIC8vIEhUTUwgYXMgZ2l2ZW4gaW4gQVBJXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8YSBocmVmPSdodHRwczovL3R3aXR0ZXIuY29tL3NoYXJlJ1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0ndHdpdHRlci1zaGFyZS1idXR0b24nXG4gICAgICAgICAgICAgICAgZGF0YS11cmw9e3RoaXMucHJvcHMudXJsfVxuICAgICAgICAgICAgICAgIGRhdGEtdGV4dD17dGhpcy5wcm9wcy5tZXNzYWdlfVxuICAgICAgICAgICAgICAgIGRhdGEtY291bnQ9J25vbmUnPlR3ZWV0PC9hPlxuICAgICAgICApXG4gICAgfVxufVxuIiwiLyoqXG4gKiBPcGVucyB0aGUgSW1wb3J0IERhdGEgTW9kYWwgd2hlbiBjbGlja2VkXG4gKi9cbmV4cG9ydCBjbGFzcyBVcGxvYWREYXRhQnV0dG9uIHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiA8c3Bhbj48aSBjbGFzc05hbWU9XCJpb24gaW9uLXVwbG9hZFwiPjwvaT4gSW1wb3J0IERhdGE8L3NwYW4+O1xuICAgIH1cbn1cbiIsImltcG9ydCB7TGluZUNoYXJ0fSBmcm9tIFwiY29tcG9uZW50cy9MaW5lQ2hhcnQuanN4XCI7XG5pbXBvcnQge0JhckNoYXJ0fSBmcm9tIFwiY29tcG9uZW50cy9CYXJDaGFydC5qc3hcIjtcbmltcG9ydCB7UmFkYXJDaGFydH0gZnJvbSBcImNvbXBvbmVudHMvUmFkYXJDaGFydC5qc3hcIjtcbmltcG9ydCB7UGllQ2hhcnR9IGZyb20gXCJjb21wb25lbnRzL1BpZUNoYXJ0LmpzeFwiO1xuaW1wb3J0IHtNYWluTmF2YmFyfSBmcm9tIFwiY29tcG9uZW50cy9NYWluTmF2YmFyLmpzeFwiO1xuaW1wb3J0IHtNb2RhbFRyaWdnZXJ9IGZyb20gXCJjb21wb25lbnRzL01vZGFsVHJpZ2dlci5qc3hcIjtcbmltcG9ydCB7SW1wb3J0RGF0YU1vZGFsfSBmcm9tIFwiY29tcG9uZW50cy9JbXBvcnREYXRhTW9kYWwuanN4XCI7XG5pbXBvcnQge0ZhY2Vib29rU2hhcmVCdXR0b24sIFR3aXR0ZXJTaGFyZUJ1dHRvbn0gZnJvbVxuICAgICAgICBcImNvbXBvbmVudHMvU29jaWFsU2hhcmluZy5qc3hcIjtcbmltcG9ydCB7VXBsb2FkRGF0YUJ1dHRvbn0gZnJvbSBcImNvbXBvbmVudHMvVXBsb2FkRGF0YUJ1dHRvbi5qc3hcIjtcblxuLypcbiAqIFJlbmRlcnMgdGhlIG1haW4gZGFzaGJvYXJkIGZvciB0aGUgYXBwbGljYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBEYXNoYm9hcmRQYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLyogSW5pdGlhbGlzZSB0aGUgc3RhdGUgb2YgdGhlIHBhZ2UuICovXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBydW5zOiBudWxsLFxuICAgICAgICAgICAgLyogR3JhcGggdG8gc2hvdyB0aGUgYXZlcmFnZSBzcGVlZCBlYWNoIGRheSBvZiB0aGUgbGFzdCB3ZWVrLiAqL1xuICAgICAgICAgICAgc3BlZWRHcmFwaDoge1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YXNldHM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJTcGVlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogXCJyZ2JhKDE1MSwxODcsMjA1LDAuMilcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VDb2xvcjogXCJyZ2JhKDE1MSwxODcsMjA1LDEpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRDb2xvcjogXCJyZ2JhKDE1MSwxODcsMjA1LDEpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRTdHJva2VDb2xvcjogXCIjZmZmXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRIaWdobGlnaHRGaWxsOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludEhpZ2hsaWdodFN0cm9rZTogXCJyZ2JhKDE1MSwxODcsMjA1LDEpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogW11cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyogU2hvdyB0aGUgdW5pdHMgb2Yga20vaCBmb3IgZGF0YSBwb2ludHMuICovXG4gICAgICAgICAgICAgICAgb3B0czoge1xuICAgICAgICAgICAgICAgICAgICBzY2FsZUxhYmVsOiBmdW5jdGlvbiggdmFsICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbC52YWx1ZSArIFwiIGttL2hcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qIEdyYXBoIHRvIHNob3cgdGhlIHRvdGFsIGRpc3RhbmNlIHJ1biBlYWNoIGRheSBvZiB0aGUgbGFzdCB3ZWVrLiAqL1xuICAgICAgICAgICAgZGlzdGFuY2VHcmFwaDoge1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YXNldHM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEaXN0YW5jZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogXCJyZ2JhKDE1MSwxODcsMjA1LDAuMilcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VDb2xvcjogXCJyZ2JhKDE1MSwxODcsMjA1LDEpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRDb2xvcjogXCJyZ2JhKDE1MSwxODcsMjA1LDEpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRTdHJva2VDb2xvcjogXCIjZmZmXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRIaWdobGlnaHRGaWxsOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludEhpZ2hsaWdodFN0cm9rZTogXCJyZ2JhKDE1MSwxODcsMjA1LDEpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogW11cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyogU2hvdyB0aGUgdW5pdHMgb2YgbSBmb3IgZGF0YSBwb2ludHMuICovXG4gICAgICAgICAgICAgICAgb3B0czoge1xuICAgICAgICAgICAgICAgICAgICBzY2FsZUxhYmVsOiBmdW5jdGlvbiggdmFsICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbC52YWx1ZSArIFwiIG1cIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIC8qIFJlcXVlc3QgYWxsIHJ1bnMgaW4gdGhlIGxhc3Qgd2VlayBmcm9tIHRoZSBzZXJ2ZXIuICovXG4gICAgICAgIHZhciBkYXRlID0gKG5ldyBEYXRlKCkpO1xuICAgICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSA3KTtcbiAgICAgICAgZGF0ZSA9IGRhdGUudG9JU09TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMTApO1xuXG4gICAgICAgICQuZ2V0KFwiL2FwaS9ydW5zX3NpbmNlX2RhdGUvXCIgKyBkYXRlLCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyAhPSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogVGFrZSBhIGxvY2FsIGNvcHkgb2YgdGhlIHNwZWVkIGFuZCBkaXN0YW5jZSBncmFwaHMgdG9cbiAgICAgICAgICAgICAgICAgKiBtb2RpZnkgYW5kIHJldHVybiB0byB0aGUgcHJvcHMuXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdmFyIHNwZWVkR3JhcGggPSB0aGlzLnN0YXRlLnNwZWVkR3JhcGg7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlR3JhcGggPSB0aGlzLnN0YXRlLmRpc3RhbmNlR3JhcGg7XG5cbiAgICAgICAgICAgICAgICAvKiBVcGRhdGUgdGhlIG51bWJlciBvZiBydW5zIHN0b3JlZC4gKi9cbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgcnVuczogcmVzdWx0LnJ1bnNcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8qIFJlc2V0IHRoZSBkYXRhIHN0b3JlZCBpbiBib3RoIGdyYXBocy4gKi9cbiAgICAgICAgICAgICAgICBzcGVlZEdyYXBoLmRhdGEubGFiZWxzID0gW107XG4gICAgICAgICAgICAgICAgc3BlZWRHcmFwaC5kYXRhLmRhdGFzZXRzWzBdLmRhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZUdyYXBoLmRhdGEubGFiZWxzID0gW107XG4gICAgICAgICAgICAgICAgZGlzdGFuY2VHcmFwaC5kYXRhLmRhdGFzZXRzWzBdLmRhdGEgPSBbXTtcblxuICAgICAgICAgICAgICAgIC8qIFJlc2V0IHRoZSBkYXRhIHRvIGRpc3BsYXkgb24gYm90aCBncmFwaHMuICovXG4gICAgICAgICAgICAgICAgbGV0IGNvdW50cyA9IFswLDAsMCwwLDAsMCwwXTtcbiAgICAgICAgICAgICAgICBsZXQgc3BlZWRzID0gWzAsMCwwLDAsMCwwLDBdO1xuICAgICAgICAgICAgICAgIGxldCBkaXN0YW5jZXMgPSBbMCwwLDAsMCwwLDAsMF07XG5cbiAgICAgICAgICAgICAgICAvKiBIZWxwZXIgYXJyYXkgdXNlZCB0byBnZW5lcmF0ZSBheGlzIGxhYmVscy4gKi9cbiAgICAgICAgICAgICAgICBsZXQgd2Vla2RheXMgPSBbXCJTdW5kYXlcIiwgXCJNb25kYXlcIiwgXCJUdWVzZGF5XCIsIFwiV2VkbmVzZGF5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlRodXJzZGF5XCIsIFwiRnJpZGF5XCIsIFwiU2F0dXJkYXlcIl07XG5cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIEl0ZXJhdGUgdGhyb3VnaCB0aGUgcnVucyByZXR1cm5lZCwgYWRkaW5nIHRoZSBkYXRhIHRvIHRoZVxuICAgICAgICAgICAgICAgICAqIHNwZWVkcyBhbmQgZGlzdGFuY2VzIGFycmF5cyBmb3IgdGhlIGNvcnJlY3QgZGF5IG9mIHRoZSB3ZWVrLlxuICAgICAgICAgICAgICAgICAqIEFsc28gaW5jcmVtZW50cyB0aGUgY291bnQsIHRvIGJlIHVzZWQgZm9yIGF2ZXJhZ2VzLlxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0LnJ1bnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJ1biA9IHJlc3VsdC5ydW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbW9tZW50ID0gd2luZG93LmFwcC5tb21lbnQoIHJ1bi5zdGFydF90aW1lICogMTAwMCApO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGF5ID0gbW9tZW50LndlZWtkYXkoKTtcblxuICAgICAgICAgICAgICAgICAgICBjb3VudHNbZGF5XSsrO1xuICAgICAgICAgICAgICAgICAgICBzcGVlZHNbZGF5XSArPSBydW4uYXZlcmFnZV9zcGVlZDtcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2VzW2RheV0gKz0gcnVuLmRpc3RhbmNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qIFJlY29yZCB0aGUgY3VycmVudCBkYXkgb2YgdGhlIHdlZWssIGZyb20gMCB0byA2LiAqL1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50RGF5ID0gd2luZG93LmFwcC5tb21lbnQoKS53ZWVrZGF5KCk7XG5cbiAgICAgICAgICAgICAgICAvKiBGb3IgZWFjaCBkYXksIGFkZCBhIGRhdGEgcG9pbnQgdG8gdGhlIGdyYXBoLiAqL1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgICAqIEFkZCBpbiB0aGUgY3VycmVudCBvZmZzZXQgdG8gZGlzcGxheSB0aGUgY3VycmVudCBkYXkgYXNcbiAgICAgICAgICAgICAgICAgICAgICogdGhlIHJpZ2h0bW9zdCBkYXRhIHBvaW50LlxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgbGV0IGRheSA9IChjdXJyZW50RGF5ICsgaSArIDEpICUgNztcblxuICAgICAgICAgICAgICAgICAgICAvKiBBZGQgdGhlIGxhYmVsIHRvIHRoZSBzcGVlZCBncmFwaC4gKi9cbiAgICAgICAgICAgICAgICAgICAgc3BlZWRHcmFwaC5kYXRhLmxhYmVscy5wdXNoKHdlZWtkYXlzW2RheV0pO1xuICAgICAgICAgICAgICAgICAgICAvKiBEZXRlcm1pbmUgdGhlIGF2ZXJhZ2Ugc3BlZWQgZm9yIHRoYXQgZGF5LiAqL1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3BlZWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGNvdW50c1tkYXldID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwZWVkID0gKHNwZWVkc1tkYXldIC8gY291bnRzW2RheV0pICogNjAgKiA2MCAvIDEwMDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLyogUm91bmQgdG8gdHdvIGRlY2ltYWwgcGxhY2VzLiAqL1xuICAgICAgICAgICAgICAgICAgICBzcGVlZCA9IHNwZWVkLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgIC8qIFB1c2ggdGhlIGF2ZXJhZ2Ugc3BlZWQgdG8gdGhlIHNwZWVkIGdyYXBoIGRhdGFzZXQuICovXG4gICAgICAgICAgICAgICAgICAgIHNwZWVkR3JhcGguZGF0YS5kYXRhc2V0c1swXS5kYXRhLnB1c2goc3BlZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIEFkZCB0aGUgbGFiZWwgdG8gdGhlIGRpc3RhbmNlIGdyYXBoLiAqL1xuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZUdyYXBoLmRhdGEubGFiZWxzLnB1c2god2Vla2RheXNbZGF5XSk7XG4gICAgICAgICAgICAgICAgICAgIC8qIERldGVybWluZSB0aGUgdG90YWwgZGlzdGFuY2UgZm9yIHRoYXQgZGF5LiAqL1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGlzdGFuY2UgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGNvdW50c1tkYXldID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gZGlzdGFuY2VzW2RheV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLyogUm91bmQgdG8gdHdvIGRlY2ltYWwgcGxhY2VzLiAqL1xuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IGRpc3RhbmNlLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgIC8qIFB1c2ggdGhlIHRvdGFsIGRpc3RhbmNlIHRvIHRoZSBkaXN0YW5jZSBncmFwaCBkYXRhc2V0LiAqL1xuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZUdyYXBoLmRhdGEuZGF0YXNldHNbMF0uZGF0YS5wdXNoKGRpc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBVcGRhdGUgdGhlIHN0YXRlIHdpdGggdGhlIGdlbmVyYXRlZCBncmFwaHMuICovXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNwZWVkR3JhcGg6IHNwZWVkR3JhcGgsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlR3JhcGg6IGRpc3RhbmNlR3JhcGgsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuXG4gICAgICAgIHZhciBjb250ZW50ID0gbnVsbDtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBTaG93IGEgc3BlY2lhbCBhbGVydCBwcm9tcHRpbmcgdGhlIHVzZXIgdG8gaW1wb3J0IGEgcnVuIGlmIHRoZXJlXG4gICAgICAgICAqIGFyZSBubyBydW5zIHN0b3JlZCBpbiB0aGUgZGF0YWJhc2UuXG4gICAgICAgICAqL1xuXG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5ydW5zIHx8IHRoaXMuc3RhdGUucnVucy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgY29udGVudCA9IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBhbGVydCBhbGVydC13YXJuaW5nXCIgcm9sZT1cImFsZXJ0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJjZW50ZXItdGV4dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFlvdSBoYXZlbid0IGFkZGVkIGFueSBydW4gZGF0YSB0aGlzIHdlZWssIHdoZW4geW91IGltcG9ydCBhIG5ldyBydW4geW91J2xsIGJlIGFibGUgdG8gc2VlIGluZm9ybWF0aW9uIGFib3V0IHlvdXIgZml0bmVzcyBoZXJlLlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjZW50ZXItdGV4dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNb2RhbFRyaWdnZXIgbW9kYWw9ezxJbXBvcnREYXRhTW9kYWwgLz59IGJ1dHRvbj17dHJ1ZX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IG5hdmJhci1idG4gbWFyZ2luLWxlZnQgbWFyZ2luLXJpZ2h0XCIgYnV0dG9uVGV4dD17PFVwbG9hZERhdGFCdXR0b24gLz59IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmVuZGVyIHRoZSBtYWluIGNvbnRlbnQgb2YgdGhlIGRhc2hib2FyZCBwYWdlLlxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPE1haW5OYXZiYXIgLz5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICB7Y29udGVudH1cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyPlJlY2VudCBSdW5zPC9oMj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TdGFydCBUaW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+RHVyYXRpb248L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5EaXN0YW5jZSBDb3ZlcmVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+QWN0aW9uPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIERpc3BsYXkgZWFjaCBydW4gaW4gdGhlIGxhc3Qgd2VlayBhcyBhIHJvdyBvZiB0aGUgdGFibGUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5ydW5zID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5ydW5zLm1hcCggZnVuY3Rpb24ocnVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt3aW5kb3cuYXBwLm1vbWVudChydW4uc3RhcnRfdGltZSAqIDEwMDApLmZvcm1hdCh3aW5kb3cuYXBwLnRpbWVGb3JtYXQpfSB7d2luZG93LmFwcC5tb21lbnQocnVuLnN0YXJ0X3RpbWUgKiAxMDAwKS5mb3JtYXQod2luZG93LmFwcC5kYXlGb3JtYXQpfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57IHBhcnNlSW50KHJ1bi5kdXJhdGlvbiAvIDYwKSB9IG1pbnMge3J1bi5kdXJhdGlvbiAlIDYwfSBzZWNvbmRzPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntNYXRoLnJvdW5kKHJ1bi5kaXN0YW5jZSl9IG08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgaHJlZj17XCIvcnVuL1wiICsgcnVuLl9pZH0+PGkgY2xhc3NOYW1lPVwiaW9uIGlvbi1leWVcIiAvPjwvYT48L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSA6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMj5BdmVyYWdlIFNwZWVkIE92ZXIgVGhlIFBhc3QgV2VlazwvaDI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPExpbmVDaGFydCBkYXRhPXt0aGlzLnN0YXRlLnNwZWVkR3JhcGguZGF0YX0gb3B0cz17dGhpcy5zdGF0ZS5zcGVlZEdyYXBoLm9wdHN9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDI+RGlzdGFuY2UgQ292ZXJlZCBPdmVyIFRoZSBQYXN0IFdlZWs8L2gyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5lQ2hhcnQgZGF0YT17dGhpcy5zdGF0ZS5kaXN0YW5jZUdyYXBoLmRhdGF9IG9wdHM9e3RoaXMuc3RhdGUuZGlzdGFuY2VHcmFwaC5vcHRzfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtNYWluTmF2YmFyfSBmcm9tIFwiY29tcG9uZW50cy9NYWluTmF2YmFyLmpzeFwiO1xuXG4vKlxuICogU2ltcGxlIHBhZ2Ugc2VydmVkIHdoZW4gYSByb3V0ZSBjYW5ub3QgYmUgZm91bmQuXG4gKi9cbmV4cG9ydCBjbGFzcyBGaWxlTm90Rm91bmRQYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxNYWluTmF2YmFyIC8+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGgxPjQwNDwvaDE+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQge01vZGFsVHJpZ2dlcn0gZnJvbSBcImNvbXBvbmVudHMvTW9kYWxUcmlnZ2VyLmpzeFwiO1xuaW1wb3J0IHtTaGFyZVJ1bk1vZGFsfSBmcm9tIFwiY29tcG9uZW50cy9TaGFyZVJ1bk1vZGFsLmpzeFwiO1xuaW1wb3J0IHtNYWluTmF2YmFyfSBmcm9tIFwiY29tcG9uZW50cy9NYWluTmF2YmFyLmpzeFwiO1xuaW1wb3J0IHtNYXB9IGZyb20gXCJjb21wb25lbnRzL01hcC5qc3hcIjtcbmltcG9ydCB7TGluZUNoYXJ0fSBmcm9tIFwiY29tcG9uZW50cy9MaW5lQ2hhcnQuanN4XCI7XG5cbi8qXG4gKiBSZW5kZXJzIHRoZSBwYWdlIHRvIGRpc3BsYXkgdGhlIHN1bW1hcnkgb2YgYSBydW4uXG4gKi9cbmV4cG9ydCBjbGFzcyBSdW5EYXRhUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8qIEluaXRpYWxpc2UgdGhlIGRlZmF1bHQgc3RhdGUgb2YgdGhlIHBhZ2UuICovXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBydW46IGZhbHNlLFxuICAgICAgICAgICAgLyogSW5pdGlhbGlzZSB0aGUgcnVuIHNwZWVkIGdyYXBoLiAqL1xuICAgICAgICAgICAgY2hhcnREYXRhOiB7XG4gICAgICAgICAgICAgICAgbGFiZWxzOiBbXCJKYW51YXJ5XCIsIFwiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCIsIFwiTWF5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkp1bmVcIiwgXCJKdWx5XCJdLFxuICAgICAgICAgICAgICAgIGRhdGFzZXRzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlNwZWVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IFwicmdiYSgxNTEsMTg3LDIwNSwwLjIpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VDb2xvcjogXCJyZ2JhKDE1MSwxODcsMjA1LDEpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludENvbG9yOiBcInJnYmEoMTUxLDE4NywyMDUsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50U3Ryb2tlQ29sb3I6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRIaWdobGlnaHRGaWxsOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50SGlnaGxpZ2h0U3Ryb2tlOiBcInJnYmEoMTUxLDE4NywyMDUsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IFs2NSwgNTksIDgwLCA4MSwgNTYsIDU1LCA0MF1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGFydE9wdHM6IHtcbiAgICAgICAgICAgICAgICBzY2FsZVNob3dHcmlkTGluZXMgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkYXRhc2V0RmlsbCA6IHRydWUsXG4gICAgICAgICAgICAgICAgc2NhbGVTaG93SG9yaXpvbnRhbExpbmVzOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNjYWxlU2hvd1ZlcnRpY2FsTGluZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgc2hvd1Rvb2x0aXBzOiB0cnVlLFxuICAgICAgICAgICAgICAgIHBvaW50SGl0RGV0ZWN0aW9uUmFkaXVzIDogMSxcbiAgICAgICAgICAgICAgICAvKiBEaXNwbGF5IGxhYmVscyBpbiBrbS9oLiAqL1xuICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS52YWx1ZSArIFwiIGttL2hcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyogU2hvdyB0aGUgdG9vbHRpcCBpbiBrbS9oIHRvIDEgZGVjaW1hbCBwbGFjZS4gKi9cbiAgICAgICAgICAgICAgICB0b29sdGlwVGVtcGxhdGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoICh2YWx1ZS52YWx1ZSkudG9GaXhlZCggMSApICsgXCIga20vaFwiIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIC8qIEZldGNoIHRoZSBkYXRhIGZvciB0aGUgcnVuIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBtb3VudGVkLiAqL1xuICAgICAgICAkLmdldChcIi9hcGkvcnVuL1wiICsgdGhpcy5wcm9wcy5ydW5JZCwgZnVuY3Rpb24ocmVzdWx0KSB7XG5cbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyAhPSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICBydW46IHJlc3VsdCxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8qIFJlc2V0IHRoZSBjaGFydCBkYXRhLiAqL1xuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5zdGF0ZS5jaGFydERhdGE7XG4gICAgICAgICAgICAgICAgdmFyIGxhYmVscyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzcGVlZHMgPSBbXTtcblxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIHByaW50IGEgdGltZSBpbiB0aGUgZm9ybSAjaCAjbS5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBwcmV0dHlfcHJpbnRfdGltZSggc2Vjb25kcyApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKCBzZWNvbmRzIC8gNjAgKSAlIDYwO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaG91cnMgPSBNYXRoLmZsb29yKCBzZWNvbmRzIC8gMzYwMCApICUgMjQ7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0ciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGlmICggaG91cnMgPiAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IGhvdXJzICsgXCJoIFwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN0ciArPSBtaW51dGVzICsgXCJtXCI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgKiBTZXQgdGhlIHNhbXBsZSBpbnRlcnZhbCB0byBkaXNwbGF5IDEwIGxhYmVscyBvbiB0aGUgeFxuICAgICAgICAgICAgICAgICAqIGF4aXMuXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgbGV0IGludGVydmFsID0gcGFyc2VJbnQoIHJlc3VsdC5zcGVlZF9ncmFwaC54Lmxlbmd0aCAvIDEwICk7XG5cbiAgICAgICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggdGhlIGRhdGEgcG9pbnRzLiAqL1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0LnNwZWVkX2dyYXBoLngubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgLyogRGVmYXVsdCB0byBubyBsYWJlbC4gKi9cbiAgICAgICAgICAgICAgICAgICAgbGV0IGxhYmVsID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgICAgICogSWYgdGhpcyBpdGVtIGlzIG9uZSBvZiB0aGUgMTAgc3BlY2lmaWVkIGZvciBhIGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgKiBzZXQgaXQgdG8gdGhlIHByZXR0eSB0aW1lIG9mIHRoZSBjdXJyZW50IHBvaW50LlxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKCBpICUgaW50ZXJ2YWwgPT0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aW1lX3NlYyA9IHBhcnNlSW50KHJlc3VsdC5zcGVlZF9ncmFwaC54W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsID0gcHJldHR5X3ByaW50X3RpbWUodGltZV9zZWMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxhYmVscy5wdXNoKGxhYmVsKTtcbiAgICAgICAgICAgICAgICAgICAgLyogQWRkIHRoZSBzcGVlZCBpbiBrbS9oIHRvIHRoZSBkYXRhIHNldC4gKi9cbiAgICAgICAgICAgICAgICAgICAgc3BlZWRzLnB1c2gocmVzdWx0LnNwZWVkX2dyYXBoLnlbaV0gKiA2MCAqIDYwIC8gMTAwMCk7IC8vIHRvIGttL2hcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBVcGRhdGUgdGhlIGNoYXJ0LiAqL1xuICAgICAgICAgICAgICAgIGRhdGEubGFiZWxzID0gbGFiZWxzO1xuICAgICAgICAgICAgICAgIGRhdGEuZGF0YXNldHNbMF0uZGF0YSA9IHNwZWVkcztcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtjaGFydERhdGE6IGRhdGF9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogSGFuZGxlIGEgcnVuIHNoYXJlIGV2ZW50IGJ5IHBvc3RpbmcgYW4gaW1hZ2Ugb2YgdGhlIGN1cnJlbnQgcnVuIHRvXG4gICAgICogaW1ndXIuXG4gICAgICovXG4gICAgc2hhcmVSdW4oZSkge1xuICAgICAgICAvKiBHZXQgYSBVUkwgZm9yIHRoZSBjdXJyZW50IG1hcC4gKi9cbiAgICAgICAgdmFyIG1hcFVybCA9IHRoaXMucmVmcy5tYXAuZ2V0U3RhdGljVXJsKCk7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRoaXMuaW1ndXJVcGxvYWQuYmluZCh0aGlzKTtcblxuICAgICAgICAvKiBVcGxvYWQgdGhlIGltYWdlIHRvIGltZ3VyLiAqL1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICAgICAgICB1cmw6IFwiaHR0cHM6Ly9hcGkuaW1ndXIuY29tLzMvaW1hZ2VcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdDbGllbnQtSUQgZDhmNTkwMzliZGI5ZmFkJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBpbWFnZTogbWFwVXJsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogY2FsbGJhY2tcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBDYWxsYmFjayBmb3Igd2hlbiB0aGUgdXBsb2FkIGlzIGNvbXBsZXRlLlxuICAgICAqL1xuICAgIGltZ3VyVXBsb2FkKGRhdGEpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bWFwVXJsOiBkYXRhW1wiZGF0YVwiXVtcImxpbmtcIl0sIHNoYXJpbmdSdW46IHRydWV9KTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG5cbiAgICAgICAgLyogU2V0IHRoZSBkZWZhdWx0IGJvZHkgdG8gaW5kaWNhdGUgdGhhdCB0aGUgcnVuIGRvZXMgbm90IGV4aXN0LiAqL1xuICAgICAgICB2YXIgYm9keSA9IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgPHA+VGhpcyBydW4gZG9lcyBub3QgZXhpc3QuPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG5cbiAgICAgICAgLyogU2hvdyB0aGUgc2hhcmluZyBtb2RhbCBpZiBhbiBpbWFnZSB1cGxvYWQgd2FzIHN1Y2Nlc3NmdWwuICovXG4gICAgICAgIHZhciBtb2RhbCA9IDxTaGFyZVJ1bk1vZGFsIHJlZj1cIm1vZGFsXCIgaW1hZ2VVcmw9e3RoaXMuc3RhdGUubWFwVXJsfSAvPjtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNoYXJpbmdSdW4pIHtcbiAgICAgICAgICAgIG1vZGFsID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIE92ZXJyaWRlIHRoZSBib2R5IGlmIGEgcnVuIHdhcyBmb3VuZC4gKi9cbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucnVuKSB7XG4gICAgICAgICAgICBib2R5ID0gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwiZnVsbC13aWR0aFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFlvdXIgUnVuIDxzbWFsbD57d2luZG93LmFwcC5tb21lbnQodGhpcy5zdGF0ZS5ydW4uc3RhcnRfdGltZSAqIDEwMDApLmZvcm1hdCh3aW5kb3cuYXBwLmRheUZvcm1hdCl9PC9zbWFsbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBmbG9hdC1yaWdodFwiIG9uQ2xpY2s9e3RoaXMuc2hhcmVSdW4uYmluZCh0aGlzKX0+U2hhcmUgUnVuPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2gxPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgbWFyZ2luLXRvcFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtMyBjZW50ZXItdGV4dFwiPjxoMz5Ub3RhbCBEaXN0YW5jZTwvaDM+IHtNYXRoLnJvdW5kKHRoaXMuc3RhdGUucnVuLmRpc3RhbmNlKX0gbTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtMyBjZW50ZXItdGV4dFwiPjxoMz5BdmVyYWdlIFNwZWVkPC9oMz4geyh0aGlzLnN0YXRlLnJ1bi5hdmVyYWdlX3NwZWVkICogNjAgKiA2MCAvIDEwMDApLnRvRml4ZWQoMil9IGttL2g8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTMgY2VudGVyLXRleHRcIj48aDM+RHVyYXRpb248L2gzPiB7IHBhcnNlSW50KHRoaXMuc3RhdGUucnVuLmR1cmF0aW9uIC8gNjApIH0gbWlucyB7dGhpcy5zdGF0ZS5ydW4uZHVyYXRpb24gJSA2MH0gc2Vjb25kczwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtMyBjZW50ZXItdGV4dFwiPjxoMz5LaWxvam91bGVzIEJ1cm5lZDwvaDM+e01hdGgucm91bmQodGhpcy5zdGF0ZS5ydW4ua2lsb2pvdWxlcyl9IGtqPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aHIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxNYXAgcmVmPVwibWFwXCIgd2F5cG9pbnRzPXt0aGlzLnN0YXRlLnJ1bi53YXlwb2ludHN9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICB7bW9kYWx9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxociAvPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY2VudGVyLXRleHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDM+WW91ciBTcGVlZCBCcmVha2Rvd248L2gzPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5lQ2hhcnQgZGF0YT17dGhpcy5zdGF0ZS5jaGFydERhdGF9IG9wdHM9e3RoaXMuc3RhdGUuY2hhcnRPcHRzfSB3aWR0aD17MTE0MH0gaGVpZ2h0PXsyNDB9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogUmV0dXJuIHRoZSBjb250ZW50IG9mIHRoZSBwYWdlLiAqL1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8TWFpbk5hdmJhciAvPlxuICAgICAgICAgICAgICAgIHtib2R5fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtMaW5lQ2hhcnR9IGZyb20gXCJjb21wb25lbnRzL0xpbmVDaGFydC5qc3hcIjtcbmltcG9ydCB7QmFyQ2hhcnR9IGZyb20gXCJjb21wb25lbnRzL0JhckNoYXJ0LmpzeFwiO1xuaW1wb3J0IHtSYWRhckNoYXJ0fSBmcm9tIFwiY29tcG9uZW50cy9SYWRhckNoYXJ0LmpzeFwiO1xuaW1wb3J0IHtQaWVDaGFydH0gZnJvbSBcImNvbXBvbmVudHMvUGllQ2hhcnQuanN4XCI7XG5pbXBvcnQge01haW5OYXZiYXJ9IGZyb20gXCJjb21wb25lbnRzL01haW5OYXZiYXIuanN4XCI7XG5pbXBvcnQge01vZGFsVHJpZ2dlcn0gZnJvbSBcImNvbXBvbmVudHMvTW9kYWxUcmlnZ2VyLmpzeFwiO1xuaW1wb3J0IHtJbXBvcnREYXRhTW9kYWx9IGZyb20gXCJjb21wb25lbnRzL0ltcG9ydERhdGFNb2RhbC5qc3hcIjtcblxuZXhwb3J0IGNsYXNzIFJ1bkhpc3RvcnlQYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLyogUmVzZXQgdGhlIHJ1biBzdGF0ZS4gKi9cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIHJ1bnM6IG51bGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAvKiBGZXRjaCB0aGUgcnVuIGRhdGEgZnJvbSB0aGUgc2VydmVyIG9uIG1vdW50LiAqL1xuICAgICAgICB0aGlzLnVwZGF0ZVJ1bnMoKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEdldCBhbGwgZXhpc3RpbmcgcnVucyBmcm9tIHRoZSBzZXJ2ZXIsIGFuZCBhZGQgdGhlbSB0byB0aGUgc3RhdGUuXG4gICAgICovXG4gICAgdXBkYXRlUnVucygpIHtcbiAgICAgICAgJC5nZXQoXCIvYXBpL2FsbF9ydW5zXCIsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzICE9IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHJ1bnM6IHJlc3VsdFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogQ2FsbGJhY2sgdG8gZGVsZXRlIGEgc3BlY2lmaWVkIHJ1biBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICogQWNjZXB0cyBhIHJ1biBvYmplY3QuXG4gICAgICovXG4gICAgZGVsZXRlUnVuKHJ1biwgZSkge1xuICAgICAgICAvKlxuICAgICAgICAgKiBBc2sgdGhlIHVzZXIgZm9yIGNvbmZpcm1hdGlvbiB0byBkZWxldGUgdGhlIHJ1bi5cbiAgICAgICAgICovXG4gICAgICAgIGlmIChjb25maXJtKFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIHJ1bj9cIikpIHtcbiAgICAgICAgICAgIC8qIElmIHRoZSB1c2VyIGNvbmZpcm1zLCBzZW5kIHRoZSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIuICovXG4gICAgICAgICAgICAkLmdldChcIi9hcGkvZGVsZXRlX3J1bi9cIiArIHJ1bi5faWRbXCIkb2lkXCJdLCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgIT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogSWYgc3VjY2Vzc2Z1bCwgdXBkYXRlIHRoZSBydW5zIGxpc3RpbmcuICovXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUnVucygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb3VsZCBub3QgZGVsZXRlIHJ1bi5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8qIFBhc3MgaWYgdGhlIHVzZXIgZGVjbGluZXMuICovXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIC8qIFJlbmRlciB0aGUgZXhpc3RpbmcgcnVucyBpbiBhIGJvZHkgdGFibGUuICovXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxNYWluTmF2YmFyIC8+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyPlJ1biBIaXN0b3J5PC9oMj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TdGFydCBUaW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+RW5kIFRpbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5BY3Rpb248L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRGlzcGxheSBlYWNoIG9mIHRoZSBydW5zIGluIGEgcm93IG9mIHRoZSB0YWJsZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJ1bnMgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJ1bnMubWFwKCBmdW5jdGlvbihydW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3dpbmRvdy5hcHAubW9tZW50KHJ1bi5zdGFydF90aW1lICogMTAwMCkuZm9ybWF0KHdpbmRvdy5hcHAudGltZUZvcm1hdCl9IHt3aW5kb3cuYXBwLm1vbWVudChydW4uc3RhcnRfdGltZSAqIDEwMDApLmZvcm1hdCh3aW5kb3cuYXBwLmRheUZvcm1hdCl9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt3aW5kb3cuYXBwLm1vbWVudChydW4uZW5kX3RpbWUgKiAxMDAwKS5mb3JtYXQod2luZG93LmFwcC50aW1lRm9ybWF0KX0ge3dpbmRvdy5hcHAubW9tZW50KHJ1bi5lbmRfdGltZSAqIDEwMDApLmZvcm1hdCh3aW5kb3cuYXBwLmRheUZvcm1hdCl9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgaHJlZj17XCIvcnVuL1wiICsgcnVuLl9pZFtcIiRvaWRcIl19PjxpIGNsYXNzTmFtZT1cImlvbiBpb24tZXllXCIgLz48L2E+IDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgb25DbGljaz17dGhpcy5kZWxldGVSdW4uYmluZCh0aGlzLCBydW4pfT48aSBjbGFzc05hbWU9XCJpb24gaW9uLXRyYXNoLWJcIiAvPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpIDogXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQge0Rhc2hib2FyZFBhZ2V9IGZyb20gXCJwYWdlcy9EYXNoYm9hcmRQYWdlLmpzeFwiO1xuaW1wb3J0IHt0cmFuc2l0aW9ufSBmcm9tIFwicGFnZXMvY29udHJvbGxlcnMvUGFnZVRyYW5zaXRpb24uanN4XCI7XG5cbi8qXG4gKiBIYW5kbGVzIHRyYW5zaXRpb24gdG8gdGhlIGRhc2hib2FyZCBwYWdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gRGFzaGJvYXJkQ29udHJvbGxlcihjdHgsIG5leHQpIHtcbiAgICB0cmFuc2l0aW9uKGN0eCwgbmV4dCwgPERhc2hib2FyZFBhZ2UgLz4pO1xufVxuIiwiaW1wb3J0IHtGaWxlTm90Rm91bmRQYWdlfSBmcm9tIFwicGFnZXMvRmlsZU5vdEZvdW5kUGFnZS5qc3hcIjtcbmltcG9ydCB7dHJhbnNpdGlvbn0gZnJvbSBcInBhZ2VzL2NvbnRyb2xsZXJzL1BhZ2VUcmFuc2l0aW9uLmpzeFwiO1xuXG4vKlxuICogSGFuZGxlcyB0cmFuc2l0aW9uIHRvIHRoZSA0MDQgcGFnZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEZpbGVOb3RGb3VuZENvbnRyb2xsZXIoY3R4LCBuZXh0KSB7XG4gICAgdHJhbnNpdGlvbihjdHgsIG5leHQsIDxGaWxlTm90Rm91bmRQYWdlIC8+KTtcbn1cbiIsIi8qXG4gKiBIYW5kbGVzIHRoZSB0cmFuc2l0aW9uIGZyb20gb25lIHBhZ2UgdG8gdGhlIG5leHQuXG4gKiBNb3VudHMgdGhlIG5ldyBjb21wb25lbnQsIGFuZCByZW1vdmVzIHRoZSBwcmV2aW91cyBvbmNlXG4gKiB0aGUgcGFnZSBoYXMgYmVlbiBhbmltYXRlZCBpbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zaXRpb24oY3R4LCBuZXh0LCBjb21wb25lbnQpIHtcbiAgICBpZiAoIWN0eC5pbml0KSB7XG4gICAgICAgIHdpbmRvdy5hcHAubW91bnRQb2ludC5jbGFzc0xpc3QuYWRkKCd0cmFuc2l0aW9uJyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHdpbmRvdy5hcHAubW91bnRQb2ludC5jbGFzc0xpc3QucmVtb3ZlKCd0cmFuc2l0aW9uJyk7XG4gICAgICAgIH0sIDM1MCk7XG4gICAgfVxuXG4gICAgUmVhY3QucmVuZGVyKGNvbXBvbmVudCwgd2luZG93LmFwcC5tb3VudFBvaW50KTtcbn1cbiIsImltcG9ydCB7UnVuRGF0YVBhZ2V9IGZyb20gXCJwYWdlcy9SdW5EYXRhUGFnZS5qc3hcIjtcbmltcG9ydCB7dHJhbnNpdGlvbn0gZnJvbSBcInBhZ2VzL2NvbnRyb2xsZXJzL1BhZ2VUcmFuc2l0aW9uLmpzeFwiO1xuXG4vKlxuICogSGFuZGxlcyB0cmFuc2l0aW9uIHRvIHRoZSBydW4gZGF0YSBwYWdlLiBBY2NlcHRzIGEgcnVuIElEIGFzXG4gKiBhIHBhcmFtZXRlciwgd2hpY2ggaXMgcGFzc2VkIHRvIHRoZSBwYWdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gUnVuRGF0YUNvbnRyb2xsZXIoY3R4LCBuZXh0KSB7XG4gICAgdHJhbnNpdGlvbihjdHgsIG5leHQsIDxSdW5EYXRhUGFnZSBydW5JZD17Y3R4LnBhcmFtcy5ydW59Lz4pO1xufVxuIiwiaW1wb3J0IHtSdW5IaXN0b3J5UGFnZX0gZnJvbSBcInBhZ2VzL1J1bkhpc3RvcnlQYWdlLmpzeFwiO1xuaW1wb3J0IHt0cmFuc2l0aW9ufSBmcm9tIFwicGFnZXMvY29udHJvbGxlcnMvUGFnZVRyYW5zaXRpb24uanN4XCI7XG5cbi8qXG4gKiBIYW5kbGVzIHRyYW5zaXRpb24gdG8gdGhlIHJ1biBoaXN0b3J5IHBhZ2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBSdW5IaXN0b3J5Q29udHJvbGxlcihjdHgsIG5leHQpIHtcbiAgICB0cmFuc2l0aW9uKGN0eCwgbmV4dCwgPFJ1bkhpc3RvcnlQYWdlIC8+KTtcbn1cbiJdfQ==
