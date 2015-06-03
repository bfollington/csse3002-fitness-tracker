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

                $.get("/api/runs_since_date/" + date, (function (result) {
                    if (result.success != false) {
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

                        var currentDay = window.app.moment().weekday();

                        for (var i = 0; i < 7; i++) {
                            var day = (currentDay + i + 1) % 7;
                            var run = result.runs[day];
                            speedGraph.data.labels.push(weekdays[day]);
                            var speed = 0;
                            if (counts[day] > 0) {
                                speed = speeds[day] / counts[day] * 60 * 60 / 1000;
                            }
                            speed = speed.toFixed(2);
                            speedGraph.data.datasets[0].data.push(speed);

                            distanceGraph.data.labels.push(weekdays[day]);
                            var distance = 0;
                            if (counts[day] > 0) {
                                distance = distances[day];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvQmVuL1Byb2plY3RzL1B5dGhvbi9jc3NlMzAwMi93ZWJhcHAvc3JjL2pzeC9hcHAuanN4Iiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9jaGFydC5qcy9DaGFydC5qcyIsIm5vZGVfbW9kdWxlcy9tb21lbnQvbW9tZW50LmpzIiwibm9kZV9tb2R1bGVzL3BhZ2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcGFnZS9ub2RlX21vZHVsZXMvcGF0aC10by1yZWdleHAvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcGFnZS9ub2RlX21vZHVsZXMvcGF0aC10by1yZWdleHAvbm9kZV9tb2R1bGVzL2lzYXJyYXkvaW5kZXguanMiLCIvVXNlcnMvQmVuL1Byb2plY3RzL1B5dGhvbi9jc3NlMzAwMi93ZWJhcHAvc3JjL2pzeC9Sb3V0ZXIuanN4IiwiL1VzZXJzL0Jlbi9Qcm9qZWN0cy9QeXRob24vY3NzZTMwMDIvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9BcHBTZXR0aW5nc01vZGFsLmpzeCIsIi9Vc2Vycy9CZW4vUHJvamVjdHMvUHl0aG9uL2Nzc2UzMDAyL3dlYmFwcC9zcmMvanN4L2NvbXBvbmVudHMvQmFyQ2hhcnQuanN4IiwiL1VzZXJzL0Jlbi9Qcm9qZWN0cy9QeXRob24vY3NzZTMwMDIvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9JbXBvcnREYXRhTW9kYWwuanN4IiwiL1VzZXJzL0Jlbi9Qcm9qZWN0cy9QeXRob24vY3NzZTMwMDIvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9MaW5lQ2hhcnQuanN4IiwiL1VzZXJzL0Jlbi9Qcm9qZWN0cy9QeXRob24vY3NzZTMwMDIvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9NYWluTmF2YmFyLmpzeCIsIi9Vc2Vycy9CZW4vUHJvamVjdHMvUHl0aG9uL2Nzc2UzMDAyL3dlYmFwcC9zcmMvanN4L2NvbXBvbmVudHMvTWFwLmpzeCIsIi9Vc2Vycy9CZW4vUHJvamVjdHMvUHl0aG9uL2Nzc2UzMDAyL3dlYmFwcC9zcmMvanN4L2NvbXBvbmVudHMvTW9kYWxUcmlnZ2VyLmpzeCIsIi9Vc2Vycy9CZW4vUHJvamVjdHMvUHl0aG9uL2Nzc2UzMDAyL3dlYmFwcC9zcmMvanN4L2NvbXBvbmVudHMvTmF2YmFyLmpzeCIsIi9Vc2Vycy9CZW4vUHJvamVjdHMvUHl0aG9uL2Nzc2UzMDAyL3dlYmFwcC9zcmMvanN4L2NvbXBvbmVudHMvUGllQ2hhcnQuanN4IiwiL1VzZXJzL0Jlbi9Qcm9qZWN0cy9QeXRob24vY3NzZTMwMDIvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9SYWRhckNoYXJ0LmpzeCIsIi9Vc2Vycy9CZW4vUHJvamVjdHMvUHl0aG9uL2Nzc2UzMDAyL3dlYmFwcC9zcmMvanN4L2NvbXBvbmVudHMvU2hhcmVSdW5Nb2RhbC5qc3giLCIvVXNlcnMvQmVuL1Byb2plY3RzL1B5dGhvbi9jc3NlMzAwMi93ZWJhcHAvc3JjL2pzeC9jb21wb25lbnRzL1NvY2lhbFNoYXJpbmcuanN4IiwiL1VzZXJzL0Jlbi9Qcm9qZWN0cy9QeXRob24vY3NzZTMwMDIvd2ViYXBwL3NyYy9qc3gvY29tcG9uZW50cy9VcGxvYWREYXRhQnV0dG9uLmpzeCIsIi9Vc2Vycy9CZW4vUHJvamVjdHMvUHl0aG9uL2Nzc2UzMDAyL3dlYmFwcC9zcmMvanN4L3BhZ2VzL0Rhc2hib2FyZFBhZ2UuanN4IiwiL1VzZXJzL0Jlbi9Qcm9qZWN0cy9QeXRob24vY3NzZTMwMDIvd2ViYXBwL3NyYy9qc3gvcGFnZXMvRmlsZU5vdEZvdW5kUGFnZS5qc3giLCIvVXNlcnMvQmVuL1Byb2plY3RzL1B5dGhvbi9jc3NlMzAwMi93ZWJhcHAvc3JjL2pzeC9wYWdlcy9SdW5EYXRhUGFnZS5qc3giLCIvVXNlcnMvQmVuL1Byb2plY3RzL1B5dGhvbi9jc3NlMzAwMi93ZWJhcHAvc3JjL2pzeC9wYWdlcy9SdW5IaXN0b3J5UGFnZS5qc3giLCIvVXNlcnMvQmVuL1Byb2plY3RzL1B5dGhvbi9jc3NlMzAwMi93ZWJhcHAvc3JjL2pzeC9wYWdlcy9jb250cm9sbGVycy9EYXNoYm9hcmRDb250cm9sbGVyLmpzeCIsIi9Vc2Vycy9CZW4vUHJvamVjdHMvUHl0aG9uL2Nzc2UzMDAyL3dlYmFwcC9zcmMvanN4L3BhZ2VzL2NvbnRyb2xsZXJzL0ZpbGVOb3RGb3VuZENvbnRyb2xsZXIuanN4IiwiL1VzZXJzL0Jlbi9Qcm9qZWN0cy9QeXRob24vY3NzZTMwMDIvd2ViYXBwL3NyYy9qc3gvcGFnZXMvY29udHJvbGxlcnMvUGFnZVRyYW5zaXRpb24uanN4IiwiL1VzZXJzL0Jlbi9Qcm9qZWN0cy9QeXRob24vY3NzZTMwMDIvd2ViYXBwL3NyYy9qc3gvcGFnZXMvY29udHJvbGxlcnMvUnVuRGF0YUNvbnRyb2xsZXIuanN4IiwiL1VzZXJzL0Jlbi9Qcm9qZWN0cy9QeXRob24vY3NzZTMwMDIvd2ViYXBwL3NyYy9qc3gvcGFnZXMvY29udHJvbGxlcnMvUnVuSGlzdG9yeUNvbnRyb2xsZXIuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7SUNBUSxNQUFNLFdBQU8sWUFBWSxFQUF6QixNQUFNOztJQUNOLG1CQUFtQixXQUFPLDZDQUE2QyxFQUF2RSxtQkFBbUI7O0lBQ25CLG9CQUFvQixXQUFPLDhDQUE4QyxFQUF6RSxvQkFBb0I7O0lBQ3BCLHNCQUFzQixXQUFPLGdEQUFnRCxFQUE3RSxzQkFBc0I7O0lBQ3RCLGlCQUFpQixXQUFPLDJDQUEyQyxFQUFuRSxpQkFBaUI7O0FBR3pCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFL0IsQ0FBQyxZQUFXOztBQUVSLFVBQU0sQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDOzs7QUFHaEIsVUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUUzQixVQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQztBQUMzQyxVQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7OztBQUdwQyxVQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4QyxRQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQzs7QUFFL0IsVUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztBQUNoRCxVQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBQ25ELFVBQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDbEQsVUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUNoRCxVQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDOztBQUUxQyxVQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Q0FDbEIsQ0FBQSxFQUFHLENBQUM7OztBQzlCTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcDVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMxZ0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNybUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU1BO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztJQ0hPLElBQUksMkJBQU0sTUFBTTs7SUFDZixnQkFBZ0IsV0FBTyw0QkFBNEIsRUFBbkQs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LGlCQUFpQixHQUFqQixpQkFBaUI7Ozs7O0lBUHpCLFdBQVcsV0FBTyx1QkFBdUIsRUFBekMsV0FBVzs7SUFDWCxVQUFVLFdBQU8sc0NBQXNDLEVBQXZELFVBQVU7O0FBTVgsU0FBUyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQ3pDLFlBQVUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLG9CQUFDLFdBQVcsSUFBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEFBQUMsR0FBRSxDQUFDLENBQUM7Q0FDaEU7Ozs7Ozs7Ozs7UUNIZSxvQkFBb0IsR0FBcEIsb0JBQW9COzs7OztJQU41QixjQUFjLFdBQU8sMEJBQTBCLEVBQS9DLGNBQWM7O0lBQ2QsVUFBVSxXQUFPLHNDQUFzQyxFQUF2RCxVQUFVOztBQUtYLFNBQVMsb0JBQW9CLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRTtBQUM1QyxZQUFVLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxvQkFBQyxjQUFjLE9BQUcsQ0FBQyxDQUFDO0NBQzdDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7Um91dGVyfSBmcm9tICdSb3V0ZXIuanN4JztcbmltcG9ydCB7RGFzaGJvYXJkQ29udHJvbGxlcn0gZnJvbSAnLi9wYWdlcy9jb250cm9sbGVycy9EYXNoYm9hcmRDb250cm9sbGVyLmpzeCc7XG5pbXBvcnQge1J1bkhpc3RvcnlDb250cm9sbGVyfSBmcm9tICcuL3BhZ2VzL2NvbnRyb2xsZXJzL1J1bkhpc3RvcnlDb250cm9sbGVyLmpzeCc7XG5pbXBvcnQge0ZpbGVOb3RGb3VuZENvbnRyb2xsZXJ9IGZyb20gJy4vcGFnZXMvY29udHJvbGxlcnMvRmlsZU5vdEZvdW5kQ29udHJvbGxlci5qc3gnO1xuaW1wb3J0IHtSdW5EYXRhQ29udHJvbGxlcn0gZnJvbSAnLi9wYWdlcy9jb250cm9sbGVycy9SdW5EYXRhQ29udHJvbGxlci5qc3gnO1xuXG5cbnZhciBtb21lbnQgPSByZXF1aXJlKFwibW9tZW50XCIpO1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgLyogQSBnbG9iYWwgb2JqZWN0IHRvIGhvbGQgdXRpbGl0aWVzLiAqL1xuICAgIHdpbmRvdy5hcHAgPSB7fTtcblxuICAgIC8qIEV4cG9zZSB0aGUgbW9tZW50IG1vZHVsZS4gKi9cbiAgICB3aW5kb3cuYXBwLm1vbWVudCA9IG1vbWVudDtcbiAgICAvKiBTcGVjaWZ5IHRoZSBnbG9iYWwgZm9ybWF0cyBmb3IgdGltZSBhbmQgZGF0ZS4gKi9cbiAgICB3aW5kb3cuYXBwLmRheUZvcm1hdCA9IFwiZGRkZCwgTU1NIERvIFlZWVlcIjtcbiAgICB3aW5kb3cuYXBwLnRpbWVGb3JtYXQgPSBcImg6bW06c3MgYVwiO1xuXG4gICAgLyogU3BlY2lmeSB0aGUgcm91dGVzIGZvciBlYWNoIHNjcmVlbi4gKi9cbiAgICB3aW5kb3cuYXBwLnJvdXRlciA9IG5ldyBSb3V0ZXIoJ21vdW50Jyk7XG4gICAgdmFyIHJvdXRlciA9IHdpbmRvdy5hcHAucm91dGVyO1xuXG4gICAgcm91dGVyLmFkZFJvdXRlKCcvNDA0JywgRmlsZU5vdEZvdW5kQ29udHJvbGxlcik7XG4gICAgcm91dGVyLmFkZFJvdXRlKCcvZGFzaGJvYXJkJywgRGFzaGJvYXJkQ29udHJvbGxlcik7XG4gICAgcm91dGVyLmFkZFJvdXRlKCcvaGlzdG9yeScsIFJ1bkhpc3RvcnlDb250cm9sbGVyKTtcbiAgICByb3V0ZXIuYWRkUm91dGUoJy9ydW4vOnJ1bicsIFJ1bkRhdGFDb250cm9sbGVyKTtcbiAgICByb3V0ZXIuYWRkUm91dGUoJy8nLCBEYXNoYm9hcmRDb250cm9sbGVyKTtcblxuICAgIHJvdXRlci5zdGFydCgpO1xufSkoKTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gdHJ1ZTtcbiAgICB2YXIgY3VycmVudFF1ZXVlO1xuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICAgICAgICBjdXJyZW50UXVldWVbaV0oKTtcbiAgICAgICAgfVxuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG59XG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHF1ZXVlLnB1c2goZnVuKTtcbiAgICBpZiAoIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKiFcbiAqIENoYXJ0LmpzXG4gKiBodHRwOi8vY2hhcnRqcy5vcmcvXG4gKiBWZXJzaW9uOiAxLjAuMlxuICpcbiAqIENvcHlyaWdodCAyMDE1IE5pY2sgRG93bmllXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9ubm5pY2svQ2hhcnQuanMvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZFxuICovXG5cblxuKGZ1bmN0aW9uKCl7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0Ly9EZWNsYXJlIHJvb3QgdmFyaWFibGUgLSB3aW5kb3cgaW4gdGhlIGJyb3dzZXIsIGdsb2JhbCBvbiB0aGUgc2VydmVyXG5cdHZhciByb290ID0gdGhpcyxcblx0XHRwcmV2aW91cyA9IHJvb3QuQ2hhcnQ7XG5cblx0Ly9PY2N1cHkgdGhlIGdsb2JhbCB2YXJpYWJsZSBvZiBDaGFydCwgYW5kIGNyZWF0ZSBhIHNpbXBsZSBiYXNlIGNsYXNzXG5cdHZhciBDaGFydCA9IGZ1bmN0aW9uKGNvbnRleHQpe1xuXHRcdHZhciBjaGFydCA9IHRoaXM7XG5cdFx0dGhpcy5jYW52YXMgPSBjb250ZXh0LmNhbnZhcztcblxuXHRcdHRoaXMuY3R4ID0gY29udGV4dDtcblxuXHRcdC8vVmFyaWFibGVzIGdsb2JhbCB0byB0aGUgY2hhcnRcblx0XHR2YXIgY29tcHV0ZURpbWVuc2lvbiA9IGZ1bmN0aW9uKGVsZW1lbnQsZGltZW5zaW9uKVxuXHRcdHtcblx0XHRcdGlmIChlbGVtZW50WydvZmZzZXQnK2RpbWVuc2lvbl0pXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiBlbGVtZW50WydvZmZzZXQnK2RpbWVuc2lvbl07XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoZGltZW5zaW9uKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgd2lkdGggPSB0aGlzLndpZHRoID0gY29tcHV0ZURpbWVuc2lvbihjb250ZXh0LmNhbnZhcywnV2lkdGgnKTtcblx0XHR2YXIgaGVpZ2h0ID0gdGhpcy5oZWlnaHQgPSBjb21wdXRlRGltZW5zaW9uKGNvbnRleHQuY2FudmFzLCdIZWlnaHQnKTtcblxuXHRcdC8vIEZpcmVmb3ggcmVxdWlyZXMgdGhpcyB0byB3b3JrIGNvcnJlY3RseVxuXHRcdGNvbnRleHQuY2FudmFzLndpZHRoICA9IHdpZHRoO1xuXHRcdGNvbnRleHQuY2FudmFzLmhlaWdodCA9IGhlaWdodDtcblxuXHRcdHZhciB3aWR0aCA9IHRoaXMud2lkdGggPSBjb250ZXh0LmNhbnZhcy53aWR0aDtcblx0XHR2YXIgaGVpZ2h0ID0gdGhpcy5oZWlnaHQgPSBjb250ZXh0LmNhbnZhcy5oZWlnaHQ7XG5cdFx0dGhpcy5hc3BlY3RSYXRpbyA9IHRoaXMud2lkdGggLyB0aGlzLmhlaWdodDtcblx0XHQvL0hpZ2ggcGl4ZWwgZGVuc2l0eSBkaXNwbGF5cyAtIG11bHRpcGx5IHRoZSBzaXplIG9mIHRoZSBjYW52YXMgaGVpZ2h0L3dpZHRoIGJ5IHRoZSBkZXZpY2UgcGl4ZWwgcmF0aW8sIHRoZW4gc2NhbGUuXG5cdFx0aGVscGVycy5yZXRpbmFTY2FsZSh0aGlzKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXHQvL0dsb2JhbGx5IGV4cG9zZSB0aGUgZGVmYXVsdHMgdG8gYWxsb3cgZm9yIHVzZXIgdXBkYXRpbmcvY2hhbmdpbmdcblx0Q2hhcnQuZGVmYXVsdHMgPSB7XG5cdFx0Z2xvYmFsOiB7XG5cdFx0XHQvLyBCb29sZWFuIC0gV2hldGhlciB0byBhbmltYXRlIHRoZSBjaGFydFxuXHRcdFx0YW5pbWF0aW9uOiB0cnVlLFxuXG5cdFx0XHQvLyBOdW1iZXIgLSBOdW1iZXIgb2YgYW5pbWF0aW9uIHN0ZXBzXG5cdFx0XHRhbmltYXRpb25TdGVwczogNjAsXG5cblx0XHRcdC8vIFN0cmluZyAtIEFuaW1hdGlvbiBlYXNpbmcgZWZmZWN0XG5cdFx0XHRhbmltYXRpb25FYXNpbmc6IFwiZWFzZU91dFF1YXJ0XCIsXG5cblx0XHRcdC8vIEJvb2xlYW4gLSBJZiB3ZSBzaG91bGQgc2hvdyB0aGUgc2NhbGUgYXQgYWxsXG5cdFx0XHRzaG93U2NhbGU6IHRydWUsXG5cblx0XHRcdC8vIEJvb2xlYW4gLSBJZiB3ZSB3YW50IHRvIG92ZXJyaWRlIHdpdGggYSBoYXJkIGNvZGVkIHNjYWxlXG5cdFx0XHRzY2FsZU92ZXJyaWRlOiBmYWxzZSxcblxuXHRcdFx0Ly8gKiogUmVxdWlyZWQgaWYgc2NhbGVPdmVycmlkZSBpcyB0cnVlICoqXG5cdFx0XHQvLyBOdW1iZXIgLSBUaGUgbnVtYmVyIG9mIHN0ZXBzIGluIGEgaGFyZCBjb2RlZCBzY2FsZVxuXHRcdFx0c2NhbGVTdGVwczogbnVsbCxcblx0XHRcdC8vIE51bWJlciAtIFRoZSB2YWx1ZSBqdW1wIGluIHRoZSBoYXJkIGNvZGVkIHNjYWxlXG5cdFx0XHRzY2FsZVN0ZXBXaWR0aDogbnVsbCxcblx0XHRcdC8vIE51bWJlciAtIFRoZSBzY2FsZSBzdGFydGluZyB2YWx1ZVxuXHRcdFx0c2NhbGVTdGFydFZhbHVlOiBudWxsLFxuXG5cdFx0XHQvLyBTdHJpbmcgLSBDb2xvdXIgb2YgdGhlIHNjYWxlIGxpbmVcblx0XHRcdHNjYWxlTGluZUNvbG9yOiBcInJnYmEoMCwwLDAsLjEpXCIsXG5cblx0XHRcdC8vIE51bWJlciAtIFBpeGVsIHdpZHRoIG9mIHRoZSBzY2FsZSBsaW5lXG5cdFx0XHRzY2FsZUxpbmVXaWR0aDogMSxcblxuXHRcdFx0Ly8gQm9vbGVhbiAtIFdoZXRoZXIgdG8gc2hvdyBsYWJlbHMgb24gdGhlIHNjYWxlXG5cdFx0XHRzY2FsZVNob3dMYWJlbHM6IHRydWUsXG5cblx0XHRcdC8vIEludGVycG9sYXRlZCBKUyBzdHJpbmcgLSBjYW4gYWNjZXNzIHZhbHVlXG5cdFx0XHRzY2FsZUxhYmVsOiBcIjwlPXZhbHVlJT5cIixcblxuXHRcdFx0Ly8gQm9vbGVhbiAtIFdoZXRoZXIgdGhlIHNjYWxlIHNob3VsZCBzdGljayB0byBpbnRlZ2VycywgYW5kIG5vdCBzaG93IGFueSBmbG9hdHMgZXZlbiBpZiBkcmF3aW5nIHNwYWNlIGlzIHRoZXJlXG5cdFx0XHRzY2FsZUludGVnZXJzT25seTogdHJ1ZSxcblxuXHRcdFx0Ly8gQm9vbGVhbiAtIFdoZXRoZXIgdGhlIHNjYWxlIHNob3VsZCBzdGFydCBhdCB6ZXJvLCBvciBhbiBvcmRlciBvZiBtYWduaXR1ZGUgZG93biBmcm9tIHRoZSBsb3dlc3QgdmFsdWVcblx0XHRcdHNjYWxlQmVnaW5BdFplcm86IGZhbHNlLFxuXG5cdFx0XHQvLyBTdHJpbmcgLSBTY2FsZSBsYWJlbCBmb250IGRlY2xhcmF0aW9uIGZvciB0aGUgc2NhbGUgbGFiZWxcblx0XHRcdHNjYWxlRm9udEZhbWlseTogXCInSGVsdmV0aWNhIE5ldWUnLCAnSGVsdmV0aWNhJywgJ0FyaWFsJywgc2Fucy1zZXJpZlwiLFxuXG5cdFx0XHQvLyBOdW1iZXIgLSBTY2FsZSBsYWJlbCBmb250IHNpemUgaW4gcGl4ZWxzXG5cdFx0XHRzY2FsZUZvbnRTaXplOiAxMixcblxuXHRcdFx0Ly8gU3RyaW5nIC0gU2NhbGUgbGFiZWwgZm9udCB3ZWlnaHQgc3R5bGVcblx0XHRcdHNjYWxlRm9udFN0eWxlOiBcIm5vcm1hbFwiLFxuXG5cdFx0XHQvLyBTdHJpbmcgLSBTY2FsZSBsYWJlbCBmb250IGNvbG91clxuXHRcdFx0c2NhbGVGb250Q29sb3I6IFwiIzY2NlwiLFxuXG5cdFx0XHQvLyBCb29sZWFuIC0gd2hldGhlciBvciBub3QgdGhlIGNoYXJ0IHNob3VsZCBiZSByZXNwb25zaXZlIGFuZCByZXNpemUgd2hlbiB0aGUgYnJvd3NlciBkb2VzLlxuXHRcdFx0cmVzcG9uc2l2ZTogZmFsc2UsXG5cblx0XHRcdC8vIEJvb2xlYW4gLSB3aGV0aGVyIHRvIG1haW50YWluIHRoZSBzdGFydGluZyBhc3BlY3QgcmF0aW8gb3Igbm90IHdoZW4gcmVzcG9uc2l2ZSwgaWYgc2V0IHRvIGZhbHNlLCB3aWxsIHRha2UgdXAgZW50aXJlIGNvbnRhaW5lclxuXHRcdFx0bWFpbnRhaW5Bc3BlY3RSYXRpbzogdHJ1ZSxcblxuXHRcdFx0Ly8gQm9vbGVhbiAtIERldGVybWluZXMgd2hldGhlciB0byBkcmF3IHRvb2x0aXBzIG9uIHRoZSBjYW52YXMgb3Igbm90IC0gYXR0YWNoZXMgZXZlbnRzIHRvIHRvdWNobW92ZSAmIG1vdXNlbW92ZVxuXHRcdFx0c2hvd1Rvb2x0aXBzOiB0cnVlLFxuXG5cdFx0XHQvLyBCb29sZWFuIC0gRGV0ZXJtaW5lcyB3aGV0aGVyIHRvIGRyYXcgYnVpbHQtaW4gdG9vbHRpcCBvciBjYWxsIGN1c3RvbSB0b29sdGlwIGZ1bmN0aW9uXG5cdFx0XHRjdXN0b21Ub29sdGlwczogZmFsc2UsXG5cblx0XHRcdC8vIEFycmF5IC0gQXJyYXkgb2Ygc3RyaW5nIG5hbWVzIHRvIGF0dGFjaCB0b29sdGlwIGV2ZW50c1xuXHRcdFx0dG9vbHRpcEV2ZW50czogW1wibW91c2Vtb3ZlXCIsIFwidG91Y2hzdGFydFwiLCBcInRvdWNobW92ZVwiLCBcIm1vdXNlb3V0XCJdLFxuXG5cdFx0XHQvLyBTdHJpbmcgLSBUb29sdGlwIGJhY2tncm91bmQgY29sb3VyXG5cdFx0XHR0b29sdGlwRmlsbENvbG9yOiBcInJnYmEoMCwwLDAsMC44KVwiLFxuXG5cdFx0XHQvLyBTdHJpbmcgLSBUb29sdGlwIGxhYmVsIGZvbnQgZGVjbGFyYXRpb24gZm9yIHRoZSBzY2FsZSBsYWJlbFxuXHRcdFx0dG9vbHRpcEZvbnRGYW1pbHk6IFwiJ0hlbHZldGljYSBOZXVlJywgJ0hlbHZldGljYScsICdBcmlhbCcsIHNhbnMtc2VyaWZcIixcblxuXHRcdFx0Ly8gTnVtYmVyIC0gVG9vbHRpcCBsYWJlbCBmb250IHNpemUgaW4gcGl4ZWxzXG5cdFx0XHR0b29sdGlwRm9udFNpemU6IDE0LFxuXG5cdFx0XHQvLyBTdHJpbmcgLSBUb29sdGlwIGZvbnQgd2VpZ2h0IHN0eWxlXG5cdFx0XHR0b29sdGlwRm9udFN0eWxlOiBcIm5vcm1hbFwiLFxuXG5cdFx0XHQvLyBTdHJpbmcgLSBUb29sdGlwIGxhYmVsIGZvbnQgY29sb3VyXG5cdFx0XHR0b29sdGlwRm9udENvbG9yOiBcIiNmZmZcIixcblxuXHRcdFx0Ly8gU3RyaW5nIC0gVG9vbHRpcCB0aXRsZSBmb250IGRlY2xhcmF0aW9uIGZvciB0aGUgc2NhbGUgbGFiZWxcblx0XHRcdHRvb2x0aXBUaXRsZUZvbnRGYW1pbHk6IFwiJ0hlbHZldGljYSBOZXVlJywgJ0hlbHZldGljYScsICdBcmlhbCcsIHNhbnMtc2VyaWZcIixcblxuXHRcdFx0Ly8gTnVtYmVyIC0gVG9vbHRpcCB0aXRsZSBmb250IHNpemUgaW4gcGl4ZWxzXG5cdFx0XHR0b29sdGlwVGl0bGVGb250U2l6ZTogMTQsXG5cblx0XHRcdC8vIFN0cmluZyAtIFRvb2x0aXAgdGl0bGUgZm9udCB3ZWlnaHQgc3R5bGVcblx0XHRcdHRvb2x0aXBUaXRsZUZvbnRTdHlsZTogXCJib2xkXCIsXG5cblx0XHRcdC8vIFN0cmluZyAtIFRvb2x0aXAgdGl0bGUgZm9udCBjb2xvdXJcblx0XHRcdHRvb2x0aXBUaXRsZUZvbnRDb2xvcjogXCIjZmZmXCIsXG5cblx0XHRcdC8vIE51bWJlciAtIHBpeGVsIHdpZHRoIG9mIHBhZGRpbmcgYXJvdW5kIHRvb2x0aXAgdGV4dFxuXHRcdFx0dG9vbHRpcFlQYWRkaW5nOiA2LFxuXG5cdFx0XHQvLyBOdW1iZXIgLSBwaXhlbCB3aWR0aCBvZiBwYWRkaW5nIGFyb3VuZCB0b29sdGlwIHRleHRcblx0XHRcdHRvb2x0aXBYUGFkZGluZzogNixcblxuXHRcdFx0Ly8gTnVtYmVyIC0gU2l6ZSBvZiB0aGUgY2FyZXQgb24gdGhlIHRvb2x0aXBcblx0XHRcdHRvb2x0aXBDYXJldFNpemU6IDgsXG5cblx0XHRcdC8vIE51bWJlciAtIFBpeGVsIHJhZGl1cyBvZiB0aGUgdG9vbHRpcCBib3JkZXJcblx0XHRcdHRvb2x0aXBDb3JuZXJSYWRpdXM6IDYsXG5cblx0XHRcdC8vIE51bWJlciAtIFBpeGVsIG9mZnNldCBmcm9tIHBvaW50IHggdG8gdG9vbHRpcCBlZGdlXG5cdFx0XHR0b29sdGlwWE9mZnNldDogMTAsXG5cblx0XHRcdC8vIFN0cmluZyAtIFRlbXBsYXRlIHN0cmluZyBmb3Igc2luZ2xlIHRvb2x0aXBzXG5cdFx0XHR0b29sdGlwVGVtcGxhdGU6IFwiPCVpZiAobGFiZWwpeyU+PCU9bGFiZWwlPjogPCV9JT48JT0gdmFsdWUgJT5cIixcblxuXHRcdFx0Ly8gU3RyaW5nIC0gVGVtcGxhdGUgc3RyaW5nIGZvciBzaW5nbGUgdG9vbHRpcHNcblx0XHRcdG11bHRpVG9vbHRpcFRlbXBsYXRlOiBcIjwlPSB2YWx1ZSAlPlwiLFxuXG5cdFx0XHQvLyBTdHJpbmcgLSBDb2xvdXIgYmVoaW5kIHRoZSBsZWdlbmQgY29sb3VyIGJsb2NrXG5cdFx0XHRtdWx0aVRvb2x0aXBLZXlCYWNrZ3JvdW5kOiAnI2ZmZicsXG5cblx0XHRcdC8vIEZ1bmN0aW9uIC0gV2lsbCBmaXJlIG9uIGFuaW1hdGlvbiBwcm9ncmVzc2lvbi5cblx0XHRcdG9uQW5pbWF0aW9uUHJvZ3Jlc3M6IGZ1bmN0aW9uKCl7fSxcblxuXHRcdFx0Ly8gRnVuY3Rpb24gLSBXaWxsIGZpcmUgb24gYW5pbWF0aW9uIGNvbXBsZXRpb24uXG5cdFx0XHRvbkFuaW1hdGlvbkNvbXBsZXRlOiBmdW5jdGlvbigpe31cblxuXHRcdH1cblx0fTtcblxuXHQvL0NyZWF0ZSBhIGRpY3Rpb25hcnkgb2YgY2hhcnQgdHlwZXMsIHRvIGFsbG93IGZvciBleHRlbnNpb24gb2YgZXhpc3RpbmcgdHlwZXNcblx0Q2hhcnQudHlwZXMgPSB7fTtcblxuXHQvL0dsb2JhbCBDaGFydCBoZWxwZXJzIG9iamVjdCBmb3IgdXRpbGl0eSBtZXRob2RzIGFuZCBjbGFzc2VzXG5cdHZhciBoZWxwZXJzID0gQ2hhcnQuaGVscGVycyA9IHt9O1xuXG5cdFx0Ly8tLSBCYXNpYyBqcyB1dGlsaXR5IG1ldGhvZHNcblx0dmFyIGVhY2ggPSBoZWxwZXJzLmVhY2ggPSBmdW5jdGlvbihsb29wYWJsZSxjYWxsYmFjayxzZWxmKXtcblx0XHRcdHZhciBhZGRpdGlvbmFsQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMyk7XG5cdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgbnVsbCBvciB1bmRlZmluZWQgZmlyc3RseS5cblx0XHRcdGlmIChsb29wYWJsZSl7XG5cdFx0XHRcdGlmIChsb29wYWJsZS5sZW5ndGggPT09ICtsb29wYWJsZS5sZW5ndGgpe1xuXHRcdFx0XHRcdHZhciBpO1xuXHRcdFx0XHRcdGZvciAoaT0wOyBpPGxvb3BhYmxlLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHRcdGNhbGxiYWNrLmFwcGx5KHNlbGYsW2xvb3BhYmxlW2ldLCBpXS5jb25jYXQoYWRkaXRpb25hbEFyZ3MpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRmb3IgKHZhciBpdGVtIGluIGxvb3BhYmxlKXtcblx0XHRcdFx0XHRcdGNhbGxiYWNrLmFwcGx5KHNlbGYsW2xvb3BhYmxlW2l0ZW1dLGl0ZW1dLmNvbmNhdChhZGRpdGlvbmFsQXJncykpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Y2xvbmUgPSBoZWxwZXJzLmNsb25lID0gZnVuY3Rpb24ob2JqKXtcblx0XHRcdHZhciBvYmpDbG9uZSA9IHt9O1xuXHRcdFx0ZWFjaChvYmosZnVuY3Rpb24odmFsdWUsa2V5KXtcblx0XHRcdFx0aWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSBvYmpDbG9uZVtrZXldID0gdmFsdWU7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBvYmpDbG9uZTtcblx0XHR9LFxuXHRcdGV4dGVuZCA9IGhlbHBlcnMuZXh0ZW5kID0gZnVuY3Rpb24oYmFzZSl7XG5cdFx0XHRlYWNoKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKSwgZnVuY3Rpb24oZXh0ZW5zaW9uT2JqZWN0KSB7XG5cdFx0XHRcdGVhY2goZXh0ZW5zaW9uT2JqZWN0LGZ1bmN0aW9uKHZhbHVlLGtleSl7XG5cdFx0XHRcdFx0aWYgKGV4dGVuc2lvbk9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSBiYXNlW2tleV0gPSB2YWx1ZTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBiYXNlO1xuXHRcdH0sXG5cdFx0bWVyZ2UgPSBoZWxwZXJzLm1lcmdlID0gZnVuY3Rpb24oYmFzZSxtYXN0ZXIpe1xuXHRcdFx0Ly9NZXJnZSBwcm9wZXJ0aWVzIGluIGxlZnQgb2JqZWN0IG92ZXIgdG8gYSBzaGFsbG93IGNsb25lIG9mIG9iamVjdCByaWdodC5cblx0XHRcdHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDApO1xuXHRcdFx0YXJncy51bnNoaWZ0KHt9KTtcblx0XHRcdHJldHVybiBleHRlbmQuYXBwbHkobnVsbCwgYXJncyk7XG5cdFx0fSxcblx0XHRpbmRleE9mID0gaGVscGVycy5pbmRleE9mID0gZnVuY3Rpb24oYXJyYXlUb1NlYXJjaCwgaXRlbSl7XG5cdFx0XHRpZiAoQXJyYXkucHJvdG90eXBlLmluZGV4T2YpIHtcblx0XHRcdFx0cmV0dXJuIGFycmF5VG9TZWFyY2guaW5kZXhPZihpdGVtKTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlUb1NlYXJjaC5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGlmIChhcnJheVRvU2VhcmNoW2ldID09PSBpdGVtKSByZXR1cm4gaTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR3aGVyZSA9IGhlbHBlcnMud2hlcmUgPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBmaWx0ZXJDYWxsYmFjayl7XG5cdFx0XHR2YXIgZmlsdGVyZWQgPSBbXTtcblxuXHRcdFx0aGVscGVycy5lYWNoKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHRpZiAoZmlsdGVyQ2FsbGJhY2soaXRlbSkpe1xuXHRcdFx0XHRcdGZpbHRlcmVkLnB1c2goaXRlbSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gZmlsdGVyZWQ7XG5cdFx0fSxcblx0XHRmaW5kTmV4dFdoZXJlID0gaGVscGVycy5maW5kTmV4dFdoZXJlID0gZnVuY3Rpb24oYXJyYXlUb1NlYXJjaCwgZmlsdGVyQ2FsbGJhY2ssIHN0YXJ0SW5kZXgpe1xuXHRcdFx0Ly8gRGVmYXVsdCB0byBzdGFydCBvZiB0aGUgYXJyYXlcblx0XHRcdGlmICghc3RhcnRJbmRleCl7XG5cdFx0XHRcdHN0YXJ0SW5kZXggPSAtMTtcblx0XHRcdH1cblx0XHRcdGZvciAodmFyIGkgPSBzdGFydEluZGV4ICsgMTsgaSA8IGFycmF5VG9TZWFyY2gubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFyIGN1cnJlbnRJdGVtID0gYXJyYXlUb1NlYXJjaFtpXTtcblx0XHRcdFx0aWYgKGZpbHRlckNhbGxiYWNrKGN1cnJlbnRJdGVtKSl7XG5cdFx0XHRcdFx0cmV0dXJuIGN1cnJlbnRJdGVtO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRmaW5kUHJldmlvdXNXaGVyZSA9IGhlbHBlcnMuZmluZFByZXZpb3VzV2hlcmUgPSBmdW5jdGlvbihhcnJheVRvU2VhcmNoLCBmaWx0ZXJDYWxsYmFjaywgc3RhcnRJbmRleCl7XG5cdFx0XHQvLyBEZWZhdWx0IHRvIGVuZCBvZiB0aGUgYXJyYXlcblx0XHRcdGlmICghc3RhcnRJbmRleCl7XG5cdFx0XHRcdHN0YXJ0SW5kZXggPSBhcnJheVRvU2VhcmNoLmxlbmd0aDtcblx0XHRcdH1cblx0XHRcdGZvciAodmFyIGkgPSBzdGFydEluZGV4IC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0dmFyIGN1cnJlbnRJdGVtID0gYXJyYXlUb1NlYXJjaFtpXTtcblx0XHRcdFx0aWYgKGZpbHRlckNhbGxiYWNrKGN1cnJlbnRJdGVtKSl7XG5cdFx0XHRcdFx0cmV0dXJuIGN1cnJlbnRJdGVtO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRpbmhlcml0cyA9IGhlbHBlcnMuaW5oZXJpdHMgPSBmdW5jdGlvbihleHRlbnNpb25zKXtcblx0XHRcdC8vQmFzaWMgamF2YXNjcmlwdCBpbmhlcml0YW5jZSBiYXNlZCBvbiB0aGUgbW9kZWwgY3JlYXRlZCBpbiBCYWNrYm9uZS5qc1xuXHRcdFx0dmFyIHBhcmVudCA9IHRoaXM7XG5cdFx0XHR2YXIgQ2hhcnRFbGVtZW50ID0gKGV4dGVuc2lvbnMgJiYgZXh0ZW5zaW9ucy5oYXNPd25Qcm9wZXJ0eShcImNvbnN0cnVjdG9yXCIpKSA/IGV4dGVuc2lvbnMuY29uc3RydWN0b3IgOiBmdW5jdGlvbigpeyByZXR1cm4gcGFyZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG5cblx0XHRcdHZhciBTdXJyb2dhdGUgPSBmdW5jdGlvbigpeyB0aGlzLmNvbnN0cnVjdG9yID0gQ2hhcnRFbGVtZW50O307XG5cdFx0XHRTdXJyb2dhdGUucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcblx0XHRcdENoYXJ0RWxlbWVudC5wcm90b3R5cGUgPSBuZXcgU3Vycm9nYXRlKCk7XG5cblx0XHRcdENoYXJ0RWxlbWVudC5leHRlbmQgPSBpbmhlcml0cztcblxuXHRcdFx0aWYgKGV4dGVuc2lvbnMpIGV4dGVuZChDaGFydEVsZW1lbnQucHJvdG90eXBlLCBleHRlbnNpb25zKTtcblxuXHRcdFx0Q2hhcnRFbGVtZW50Ll9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7XG5cblx0XHRcdHJldHVybiBDaGFydEVsZW1lbnQ7XG5cdFx0fSxcblx0XHRub29wID0gaGVscGVycy5ub29wID0gZnVuY3Rpb24oKXt9LFxuXHRcdHVpZCA9IGhlbHBlcnMudWlkID0gKGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgaWQ9MDtcblx0XHRcdHJldHVybiBmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4gXCJjaGFydC1cIiArIGlkKys7XG5cdFx0XHR9O1xuXHRcdH0pKCksXG5cdFx0d2FybiA9IGhlbHBlcnMud2FybiA9IGZ1bmN0aW9uKHN0cil7XG5cdFx0XHQvL01ldGhvZCBmb3Igd2FybmluZyBvZiBlcnJvcnNcblx0XHRcdGlmICh3aW5kb3cuY29uc29sZSAmJiB0eXBlb2Ygd2luZG93LmNvbnNvbGUud2FybiA9PSBcImZ1bmN0aW9uXCIpIGNvbnNvbGUud2FybihzdHIpO1xuXHRcdH0sXG5cdFx0YW1kID0gaGVscGVycy5hbWQgPSAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpLFxuXHRcdC8vLS0gTWF0aCBtZXRob2RzXG5cdFx0aXNOdW1iZXIgPSBoZWxwZXJzLmlzTnVtYmVyID0gZnVuY3Rpb24obil7XG5cdFx0XHRyZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xuXHRcdH0sXG5cdFx0bWF4ID0gaGVscGVycy5tYXggPSBmdW5jdGlvbihhcnJheSl7XG5cdFx0XHRyZXR1cm4gTWF0aC5tYXguYXBwbHkoIE1hdGgsIGFycmF5ICk7XG5cdFx0fSxcblx0XHRtaW4gPSBoZWxwZXJzLm1pbiA9IGZ1bmN0aW9uKGFycmF5KXtcblx0XHRcdHJldHVybiBNYXRoLm1pbi5hcHBseSggTWF0aCwgYXJyYXkgKTtcblx0XHR9LFxuXHRcdGNhcCA9IGhlbHBlcnMuY2FwID0gZnVuY3Rpb24odmFsdWVUb0NhcCxtYXhWYWx1ZSxtaW5WYWx1ZSl7XG5cdFx0XHRpZihpc051bWJlcihtYXhWYWx1ZSkpIHtcblx0XHRcdFx0aWYoIHZhbHVlVG9DYXAgPiBtYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRyZXR1cm4gbWF4VmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYoaXNOdW1iZXIobWluVmFsdWUpKXtcblx0XHRcdFx0aWYgKCB2YWx1ZVRvQ2FwIDwgbWluVmFsdWUgKXtcblx0XHRcdFx0XHRyZXR1cm4gbWluVmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB2YWx1ZVRvQ2FwO1xuXHRcdH0sXG5cdFx0Z2V0RGVjaW1hbFBsYWNlcyA9IGhlbHBlcnMuZ2V0RGVjaW1hbFBsYWNlcyA9IGZ1bmN0aW9uKG51bSl7XG5cdFx0XHRpZiAobnVtJTEhPT0wICYmIGlzTnVtYmVyKG51bSkpe1xuXHRcdFx0XHRyZXR1cm4gbnVtLnRvU3RyaW5nKCkuc3BsaXQoXCIuXCIpWzFdLmxlbmd0aDtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHRvUmFkaWFucyA9IGhlbHBlcnMucmFkaWFucyA9IGZ1bmN0aW9uKGRlZ3JlZXMpe1xuXHRcdFx0cmV0dXJuIGRlZ3JlZXMgKiAoTWF0aC5QSS8xODApO1xuXHRcdH0sXG5cdFx0Ly8gR2V0cyB0aGUgYW5nbGUgZnJvbSB2ZXJ0aWNhbCB1cHJpZ2h0IHRvIHRoZSBwb2ludCBhYm91dCBhIGNlbnRyZS5cblx0XHRnZXRBbmdsZUZyb21Qb2ludCA9IGhlbHBlcnMuZ2V0QW5nbGVGcm9tUG9pbnQgPSBmdW5jdGlvbihjZW50cmVQb2ludCwgYW5nbGVQb2ludCl7XG5cdFx0XHR2YXIgZGlzdGFuY2VGcm9tWENlbnRlciA9IGFuZ2xlUG9pbnQueCAtIGNlbnRyZVBvaW50LngsXG5cdFx0XHRcdGRpc3RhbmNlRnJvbVlDZW50ZXIgPSBhbmdsZVBvaW50LnkgLSBjZW50cmVQb2ludC55LFxuXHRcdFx0XHRyYWRpYWxEaXN0YW5jZUZyb21DZW50ZXIgPSBNYXRoLnNxcnQoIGRpc3RhbmNlRnJvbVhDZW50ZXIgKiBkaXN0YW5jZUZyb21YQ2VudGVyICsgZGlzdGFuY2VGcm9tWUNlbnRlciAqIGRpc3RhbmNlRnJvbVlDZW50ZXIpO1xuXG5cblx0XHRcdHZhciBhbmdsZSA9IE1hdGguUEkgKiAyICsgTWF0aC5hdGFuMihkaXN0YW5jZUZyb21ZQ2VudGVyLCBkaXN0YW5jZUZyb21YQ2VudGVyKTtcblxuXHRcdFx0Ly9JZiB0aGUgc2VnbWVudCBpcyBpbiB0aGUgdG9wIGxlZnQgcXVhZHJhbnQsIHdlIG5lZWQgdG8gYWRkIGFub3RoZXIgcm90YXRpb24gdG8gdGhlIGFuZ2xlXG5cdFx0XHRpZiAoZGlzdGFuY2VGcm9tWENlbnRlciA8IDAgJiYgZGlzdGFuY2VGcm9tWUNlbnRlciA8IDApe1xuXHRcdFx0XHRhbmdsZSArPSBNYXRoLlBJKjI7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGFuZ2xlOiBhbmdsZSxcblx0XHRcdFx0ZGlzdGFuY2U6IHJhZGlhbERpc3RhbmNlRnJvbUNlbnRlclxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGFsaWFzUGl4ZWwgPSBoZWxwZXJzLmFsaWFzUGl4ZWwgPSBmdW5jdGlvbihwaXhlbFdpZHRoKXtcblx0XHRcdHJldHVybiAocGl4ZWxXaWR0aCAlIDIgPT09IDApID8gMCA6IDAuNTtcblx0XHR9LFxuXHRcdHNwbGluZUN1cnZlID0gaGVscGVycy5zcGxpbmVDdXJ2ZSA9IGZ1bmN0aW9uKEZpcnN0UG9pbnQsTWlkZGxlUG9pbnQsQWZ0ZXJQb2ludCx0KXtcblx0XHRcdC8vUHJvcHMgdG8gUm9iIFNwZW5jZXIgYXQgc2NhbGVkIGlubm92YXRpb24gZm9yIGhpcyBwb3N0IG9uIHNwbGluaW5nIGJldHdlZW4gcG9pbnRzXG5cdFx0XHQvL2h0dHA6Ly9zY2FsZWRpbm5vdmF0aW9uLmNvbS9hbmFseXRpY3Mvc3BsaW5lcy9hYm91dFNwbGluZXMuaHRtbFxuXHRcdFx0dmFyIGQwMT1NYXRoLnNxcnQoTWF0aC5wb3coTWlkZGxlUG9pbnQueC1GaXJzdFBvaW50LngsMikrTWF0aC5wb3coTWlkZGxlUG9pbnQueS1GaXJzdFBvaW50LnksMikpLFxuXHRcdFx0XHRkMTI9TWF0aC5zcXJ0KE1hdGgucG93KEFmdGVyUG9pbnQueC1NaWRkbGVQb2ludC54LDIpK01hdGgucG93KEFmdGVyUG9pbnQueS1NaWRkbGVQb2ludC55LDIpKSxcblx0XHRcdFx0ZmE9dCpkMDEvKGQwMStkMTIpLC8vIHNjYWxpbmcgZmFjdG9yIGZvciB0cmlhbmdsZSBUYVxuXHRcdFx0XHRmYj10KmQxMi8oZDAxK2QxMik7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRpbm5lciA6IHtcblx0XHRcdFx0XHR4IDogTWlkZGxlUG9pbnQueC1mYSooQWZ0ZXJQb2ludC54LUZpcnN0UG9pbnQueCksXG5cdFx0XHRcdFx0eSA6IE1pZGRsZVBvaW50LnktZmEqKEFmdGVyUG9pbnQueS1GaXJzdFBvaW50LnkpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG91dGVyIDoge1xuXHRcdFx0XHRcdHg6IE1pZGRsZVBvaW50LngrZmIqKEFmdGVyUG9pbnQueC1GaXJzdFBvaW50LngpLFxuXHRcdFx0XHRcdHkgOiBNaWRkbGVQb2ludC55K2ZiKihBZnRlclBvaW50LnktRmlyc3RQb2ludC55KVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0Y2FsY3VsYXRlT3JkZXJPZk1hZ25pdHVkZSA9IGhlbHBlcnMuY2FsY3VsYXRlT3JkZXJPZk1hZ25pdHVkZSA9IGZ1bmN0aW9uKHZhbCl7XG5cdFx0XHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWwpIC8gTWF0aC5MTjEwKTtcblx0XHR9LFxuXHRcdGNhbGN1bGF0ZVNjYWxlUmFuZ2UgPSBoZWxwZXJzLmNhbGN1bGF0ZVNjYWxlUmFuZ2UgPSBmdW5jdGlvbih2YWx1ZXNBcnJheSwgZHJhd2luZ1NpemUsIHRleHRTaXplLCBzdGFydEZyb21aZXJvLCBpbnRlZ2Vyc09ubHkpe1xuXG5cdFx0XHQvL1NldCBhIG1pbmltdW0gc3RlcCBvZiB0d28gLSBhIHBvaW50IGF0IHRoZSB0b3Agb2YgdGhlIGdyYXBoLCBhbmQgYSBwb2ludCBhdCB0aGUgYmFzZVxuXHRcdFx0dmFyIG1pblN0ZXBzID0gMixcblx0XHRcdFx0bWF4U3RlcHMgPSBNYXRoLmZsb29yKGRyYXdpbmdTaXplLyh0ZXh0U2l6ZSAqIDEuNSkpLFxuXHRcdFx0XHRza2lwRml0dGluZyA9IChtaW5TdGVwcyA+PSBtYXhTdGVwcyk7XG5cblx0XHRcdHZhciBtYXhWYWx1ZSA9IG1heCh2YWx1ZXNBcnJheSksXG5cdFx0XHRcdG1pblZhbHVlID0gbWluKHZhbHVlc0FycmF5KTtcblxuXHRcdFx0Ly8gV2UgbmVlZCBzb21lIGRlZ3JlZSBvZiBzZXBlcmF0aW9uIGhlcmUgdG8gY2FsY3VsYXRlIHRoZSBzY2FsZXMgaWYgYWxsIHRoZSB2YWx1ZXMgYXJlIHRoZSBzYW1lXG5cdFx0XHQvLyBBZGRpbmcvbWludXNpbmcgMC41IHdpbGwgZ2l2ZSB1cyBhIHJhbmdlIG9mIDEuXG5cdFx0XHRpZiAobWF4VmFsdWUgPT09IG1pblZhbHVlKXtcblx0XHRcdFx0bWF4VmFsdWUgKz0gMC41O1xuXHRcdFx0XHQvLyBTbyB3ZSBkb24ndCBlbmQgdXAgd2l0aCBhIGdyYXBoIHdpdGggYSBuZWdhdGl2ZSBzdGFydCB2YWx1ZSBpZiB3ZSd2ZSBzYWlkIGFsd2F5cyBzdGFydCBmcm9tIHplcm9cblx0XHRcdFx0aWYgKG1pblZhbHVlID49IDAuNSAmJiAhc3RhcnRGcm9tWmVybyl7XG5cdFx0XHRcdFx0bWluVmFsdWUgLT0gMC41O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0Ly8gTWFrZSB1cCBhIHdob2xlIG51bWJlciBhYm92ZSB0aGUgdmFsdWVzXG5cdFx0XHRcdFx0bWF4VmFsdWUgKz0gMC41O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHZhclx0dmFsdWVSYW5nZSA9IE1hdGguYWJzKG1heFZhbHVlIC0gbWluVmFsdWUpLFxuXHRcdFx0XHRyYW5nZU9yZGVyT2ZNYWduaXR1ZGUgPSBjYWxjdWxhdGVPcmRlck9mTWFnbml0dWRlKHZhbHVlUmFuZ2UpLFxuXHRcdFx0XHRncmFwaE1heCA9IE1hdGguY2VpbChtYXhWYWx1ZSAvICgxICogTWF0aC5wb3coMTAsIHJhbmdlT3JkZXJPZk1hZ25pdHVkZSkpKSAqIE1hdGgucG93KDEwLCByYW5nZU9yZGVyT2ZNYWduaXR1ZGUpLFxuXHRcdFx0XHRncmFwaE1pbiA9IChzdGFydEZyb21aZXJvKSA/IDAgOiBNYXRoLmZsb29yKG1pblZhbHVlIC8gKDEgKiBNYXRoLnBvdygxMCwgcmFuZ2VPcmRlck9mTWFnbml0dWRlKSkpICogTWF0aC5wb3coMTAsIHJhbmdlT3JkZXJPZk1hZ25pdHVkZSksXG5cdFx0XHRcdGdyYXBoUmFuZ2UgPSBncmFwaE1heCAtIGdyYXBoTWluLFxuXHRcdFx0XHRzdGVwVmFsdWUgPSBNYXRoLnBvdygxMCwgcmFuZ2VPcmRlck9mTWFnbml0dWRlKSxcblx0XHRcdFx0bnVtYmVyT2ZTdGVwcyA9IE1hdGgucm91bmQoZ3JhcGhSYW5nZSAvIHN0ZXBWYWx1ZSk7XG5cblx0XHRcdC8vSWYgd2UgaGF2ZSBtb3JlIHNwYWNlIG9uIHRoZSBncmFwaCB3ZSdsbCB1c2UgaXQgdG8gZ2l2ZSBtb3JlIGRlZmluaXRpb24gdG8gdGhlIGRhdGFcblx0XHRcdHdoaWxlKChudW1iZXJPZlN0ZXBzID4gbWF4U3RlcHMgfHwgKG51bWJlck9mU3RlcHMgKiAyKSA8IG1heFN0ZXBzKSAmJiAhc2tpcEZpdHRpbmcpIHtcblx0XHRcdFx0aWYobnVtYmVyT2ZTdGVwcyA+IG1heFN0ZXBzKXtcblx0XHRcdFx0XHRzdGVwVmFsdWUgKj0yO1xuXHRcdFx0XHRcdG51bWJlck9mU3RlcHMgPSBNYXRoLnJvdW5kKGdyYXBoUmFuZ2Uvc3RlcFZhbHVlKTtcblx0XHRcdFx0XHQvLyBEb24ndCBldmVyIGRlYWwgd2l0aCBhIGRlY2ltYWwgbnVtYmVyIG9mIHN0ZXBzIC0gY2FuY2VsIGZpdHRpbmcgYW5kIGp1c3QgdXNlIHRoZSBtaW5pbXVtIG51bWJlciBvZiBzdGVwcy5cblx0XHRcdFx0XHRpZiAobnVtYmVyT2ZTdGVwcyAlIDEgIT09IDApe1xuXHRcdFx0XHRcdFx0c2tpcEZpdHRpbmcgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvL1dlIGNhbiBmaXQgaW4gZG91YmxlIHRoZSBhbW91bnQgb2Ygc2NhbGUgcG9pbnRzIG9uIHRoZSBzY2FsZVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdC8vSWYgdXNlciBoYXMgZGVjbGFyZWQgaW50cyBvbmx5LCBhbmQgdGhlIHN0ZXAgdmFsdWUgaXNuJ3QgYSBkZWNpbWFsXG5cdFx0XHRcdFx0aWYgKGludGVnZXJzT25seSAmJiByYW5nZU9yZGVyT2ZNYWduaXR1ZGUgPj0gMCl7XG5cdFx0XHRcdFx0XHQvL0lmIHRoZSB1c2VyIGhhcyBzYWlkIGludGVnZXJzIG9ubHksIHdlIG5lZWQgdG8gY2hlY2sgdGhhdCBtYWtpbmcgdGhlIHNjYWxlIG1vcmUgZ3JhbnVsYXIgd291bGRuJ3QgbWFrZSBpdCBhIGZsb2F0XG5cdFx0XHRcdFx0XHRpZihzdGVwVmFsdWUvMiAlIDEgPT09IDApe1xuXHRcdFx0XHRcdFx0XHRzdGVwVmFsdWUgLz0yO1xuXHRcdFx0XHRcdFx0XHRudW1iZXJPZlN0ZXBzID0gTWF0aC5yb3VuZChncmFwaFJhbmdlL3N0ZXBWYWx1ZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQvL0lmIGl0IHdvdWxkIG1ha2UgaXQgYSBmbG9hdCBicmVhayBvdXQgb2YgdGhlIGxvb3Bcblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvL0lmIHRoZSBzY2FsZSBkb2Vzbid0IGhhdmUgdG8gYmUgYW4gaW50LCBtYWtlIHRoZSBzY2FsZSBtb3JlIGdyYW51bGFyIGFueXdheS5cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0c3RlcFZhbHVlIC89Mjtcblx0XHRcdFx0XHRcdG51bWJlck9mU3RlcHMgPSBNYXRoLnJvdW5kKGdyYXBoUmFuZ2Uvc3RlcFZhbHVlKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoc2tpcEZpdHRpbmcpe1xuXHRcdFx0XHRudW1iZXJPZlN0ZXBzID0gbWluU3RlcHM7XG5cdFx0XHRcdHN0ZXBWYWx1ZSA9IGdyYXBoUmFuZ2UgLyBudW1iZXJPZlN0ZXBzO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdGVwcyA6IG51bWJlck9mU3RlcHMsXG5cdFx0XHRcdHN0ZXBWYWx1ZSA6IHN0ZXBWYWx1ZSxcblx0XHRcdFx0bWluIDogZ3JhcGhNaW4sXG5cdFx0XHRcdG1heFx0OiBncmFwaE1pbiArIChudW1iZXJPZlN0ZXBzICogc3RlcFZhbHVlKVxuXHRcdFx0fTtcblxuXHRcdH0sXG5cdFx0LyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuXHRcdC8vIEJsb3dzIHVwIGpzaGludCBlcnJvcnMgYmFzZWQgb24gdGhlIG5ldyBGdW5jdGlvbiBjb25zdHJ1Y3RvclxuXHRcdC8vVGVtcGxhdGluZyBtZXRob2RzXG5cdFx0Ly9KYXZhc2NyaXB0IG1pY3JvIHRlbXBsYXRpbmcgYnkgSm9obiBSZXNpZyAtIHNvdXJjZSBhdCBodHRwOi8vZWpvaG4ub3JnL2Jsb2cvamF2YXNjcmlwdC1taWNyby10ZW1wbGF0aW5nL1xuXHRcdHRlbXBsYXRlID0gaGVscGVycy50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHRlbXBsYXRlU3RyaW5nLCB2YWx1ZXNPYmplY3Qpe1xuXG5cdFx0XHQvLyBJZiB0ZW1wbGF0ZVN0cmluZyBpcyBmdW5jdGlvbiByYXRoZXIgdGhhbiBzdHJpbmctdGVtcGxhdGUgLSBjYWxsIHRoZSBmdW5jdGlvbiBmb3IgdmFsdWVzT2JqZWN0XG5cblx0XHRcdGlmKHRlbXBsYXRlU3RyaW5nIGluc3RhbmNlb2YgRnVuY3Rpb24pe1xuXHRcdFx0IFx0cmV0dXJuIHRlbXBsYXRlU3RyaW5nKHZhbHVlc09iamVjdCk7XG5cdFx0IFx0fVxuXG5cdFx0XHR2YXIgY2FjaGUgPSB7fTtcblx0XHRcdGZ1bmN0aW9uIHRtcGwoc3RyLCBkYXRhKXtcblx0XHRcdFx0Ly8gRmlndXJlIG91dCBpZiB3ZSdyZSBnZXR0aW5nIGEgdGVtcGxhdGUsIG9yIGlmIHdlIG5lZWQgdG9cblx0XHRcdFx0Ly8gbG9hZCB0aGUgdGVtcGxhdGUgLSBhbmQgYmUgc3VyZSB0byBjYWNoZSB0aGUgcmVzdWx0LlxuXHRcdFx0XHR2YXIgZm4gPSAhL1xcVy8udGVzdChzdHIpID9cblx0XHRcdFx0Y2FjaGVbc3RyXSA9IGNhY2hlW3N0cl0gOlxuXG5cdFx0XHRcdC8vIEdlbmVyYXRlIGEgcmV1c2FibGUgZnVuY3Rpb24gdGhhdCB3aWxsIHNlcnZlIGFzIGEgdGVtcGxhdGVcblx0XHRcdFx0Ly8gZ2VuZXJhdG9yIChhbmQgd2hpY2ggd2lsbCBiZSBjYWNoZWQpLlxuXHRcdFx0XHRuZXcgRnVuY3Rpb24oXCJvYmpcIixcblx0XHRcdFx0XHRcInZhciBwPVtdLHByaW50PWZ1bmN0aW9uKCl7cC5wdXNoLmFwcGx5KHAsYXJndW1lbnRzKTt9O1wiICtcblxuXHRcdFx0XHRcdC8vIEludHJvZHVjZSB0aGUgZGF0YSBhcyBsb2NhbCB2YXJpYWJsZXMgdXNpbmcgd2l0aCgpe31cblx0XHRcdFx0XHRcIndpdGgob2JqKXtwLnB1c2goJ1wiICtcblxuXHRcdFx0XHRcdC8vIENvbnZlcnQgdGhlIHRlbXBsYXRlIGludG8gcHVyZSBKYXZhU2NyaXB0XG5cdFx0XHRcdFx0c3RyXG5cdFx0XHRcdFx0XHQucmVwbGFjZSgvW1xcclxcdFxcbl0vZywgXCIgXCIpXG5cdFx0XHRcdFx0XHQuc3BsaXQoXCI8JVwiKS5qb2luKFwiXFx0XCIpXG5cdFx0XHRcdFx0XHQucmVwbGFjZSgvKChefCU+KVteXFx0XSopJy9nLCBcIiQxXFxyXCIpXG5cdFx0XHRcdFx0XHQucmVwbGFjZSgvXFx0PSguKj8pJT4vZywgXCInLCQxLCdcIilcblx0XHRcdFx0XHRcdC5zcGxpdChcIlxcdFwiKS5qb2luKFwiJyk7XCIpXG5cdFx0XHRcdFx0XHQuc3BsaXQoXCIlPlwiKS5qb2luKFwicC5wdXNoKCdcIilcblx0XHRcdFx0XHRcdC5zcGxpdChcIlxcclwiKS5qb2luKFwiXFxcXCdcIikgK1xuXHRcdFx0XHRcdFwiJyk7fXJldHVybiBwLmpvaW4oJycpO1wiXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0Ly8gUHJvdmlkZSBzb21lIGJhc2ljIGN1cnJ5aW5nIHRvIHRoZSB1c2VyXG5cdFx0XHRcdHJldHVybiBkYXRhID8gZm4oIGRhdGEgKSA6IGZuO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRtcGwodGVtcGxhdGVTdHJpbmcsdmFsdWVzT2JqZWN0KTtcblx0XHR9LFxuXHRcdC8qIGpzaGludCBpZ25vcmU6ZW5kICovXG5cdFx0Z2VuZXJhdGVMYWJlbHMgPSBoZWxwZXJzLmdlbmVyYXRlTGFiZWxzID0gZnVuY3Rpb24odGVtcGxhdGVTdHJpbmcsbnVtYmVyT2ZTdGVwcyxncmFwaE1pbixzdGVwVmFsdWUpe1xuXHRcdFx0dmFyIGxhYmVsc0FycmF5ID0gbmV3IEFycmF5KG51bWJlck9mU3RlcHMpO1xuXHRcdFx0aWYgKGxhYmVsVGVtcGxhdGVTdHJpbmcpe1xuXHRcdFx0XHRlYWNoKGxhYmVsc0FycmF5LGZ1bmN0aW9uKHZhbCxpbmRleCl7XG5cdFx0XHRcdFx0bGFiZWxzQXJyYXlbaW5kZXhdID0gdGVtcGxhdGUodGVtcGxhdGVTdHJpbmcse3ZhbHVlOiAoZ3JhcGhNaW4gKyAoc3RlcFZhbHVlKihpbmRleCsxKSkpfSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGxhYmVsc0FycmF5O1xuXHRcdH0sXG5cdFx0Ly8tLUFuaW1hdGlvbiBtZXRob2RzXG5cdFx0Ly9FYXNpbmcgZnVuY3Rpb25zIGFkYXB0ZWQgZnJvbSBSb2JlcnQgUGVubmVyJ3MgZWFzaW5nIGVxdWF0aW9uc1xuXHRcdC8vaHR0cDovL3d3dy5yb2JlcnRwZW5uZXIuY29tL2Vhc2luZy9cblx0XHRlYXNpbmdFZmZlY3RzID0gaGVscGVycy5lYXNpbmdFZmZlY3RzID0ge1xuXHRcdFx0bGluZWFyOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gdDtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5RdWFkOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gdCAqIHQ7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZU91dFF1YWQ6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiAtMSAqIHQgKiAodCAtIDIpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJbk91dFF1YWQ6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdGlmICgodCAvPSAxIC8gMikgPCAxKSByZXR1cm4gMSAvIDIgKiB0ICogdDtcblx0XHRcdFx0cmV0dXJuIC0xIC8gMiAqICgoLS10KSAqICh0IC0gMikgLSAxKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5DdWJpYzogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuIHQgKiB0ICogdDtcblx0XHRcdH0sXG5cdFx0XHRlYXNlT3V0Q3ViaWM6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiAxICogKCh0ID0gdCAvIDEgLSAxKSAqIHQgKiB0ICsgMSk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluT3V0Q3ViaWM6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdGlmICgodCAvPSAxIC8gMikgPCAxKSByZXR1cm4gMSAvIDIgKiB0ICogdCAqIHQ7XG5cdFx0XHRcdHJldHVybiAxIC8gMiAqICgodCAtPSAyKSAqIHQgKiB0ICsgMik7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluUXVhcnQ6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiB0ICogdCAqIHQgKiB0O1xuXHRcdFx0fSxcblx0XHRcdGVhc2VPdXRRdWFydDogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuIC0xICogKCh0ID0gdCAvIDEgLSAxKSAqIHQgKiB0ICogdCAtIDEpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJbk91dFF1YXJ0OiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRpZiAoKHQgLz0gMSAvIDIpIDwgMSkgcmV0dXJuIDEgLyAyICogdCAqIHQgKiB0ICogdDtcblx0XHRcdFx0cmV0dXJuIC0xIC8gMiAqICgodCAtPSAyKSAqIHQgKiB0ICogdCAtIDIpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJblF1aW50OiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gMSAqICh0IC89IDEpICogdCAqIHQgKiB0ICogdDtcblx0XHRcdH0sXG5cdFx0XHRlYXNlT3V0UXVpbnQ6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiAxICogKCh0ID0gdCAvIDEgLSAxKSAqIHQgKiB0ICogdCAqIHQgKyAxKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5PdXRRdWludDogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0aWYgKCh0IC89IDEgLyAyKSA8IDEpIHJldHVybiAxIC8gMiAqIHQgKiB0ICogdCAqIHQgKiB0O1xuXHRcdFx0XHRyZXR1cm4gMSAvIDIgKiAoKHQgLT0gMikgKiB0ICogdCAqIHQgKiB0ICsgMik7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluU2luZTogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuIC0xICogTWF0aC5jb3ModCAvIDEgKiAoTWF0aC5QSSAvIDIpKSArIDE7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZU91dFNpbmU6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiAxICogTWF0aC5zaW4odCAvIDEgKiAoTWF0aC5QSSAvIDIpKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5PdXRTaW5lOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gLTEgLyAyICogKE1hdGguY29zKE1hdGguUEkgKiB0IC8gMSkgLSAxKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5FeHBvOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRyZXR1cm4gKHQgPT09IDApID8gMSA6IDEgKiBNYXRoLnBvdygyLCAxMCAqICh0IC8gMSAtIDEpKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlT3V0RXhwbzogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuICh0ID09PSAxKSA/IDEgOiAxICogKC1NYXRoLnBvdygyLCAtMTAgKiB0IC8gMSkgKyAxKTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5PdXRFeHBvOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRpZiAodCA9PT0gMCkgcmV0dXJuIDA7XG5cdFx0XHRcdGlmICh0ID09PSAxKSByZXR1cm4gMTtcblx0XHRcdFx0aWYgKCh0IC89IDEgLyAyKSA8IDEpIHJldHVybiAxIC8gMiAqIE1hdGgucG93KDIsIDEwICogKHQgLSAxKSk7XG5cdFx0XHRcdHJldHVybiAxIC8gMiAqICgtTWF0aC5wb3coMiwgLTEwICogLS10KSArIDIpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJbkNpcmM6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdGlmICh0ID49IDEpIHJldHVybiB0O1xuXHRcdFx0XHRyZXR1cm4gLTEgKiAoTWF0aC5zcXJ0KDEgLSAodCAvPSAxKSAqIHQpIC0gMSk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZU91dENpcmM6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHJldHVybiAxICogTWF0aC5zcXJ0KDEgLSAodCA9IHQgLyAxIC0gMSkgKiB0KTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5PdXRDaXJjOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRpZiAoKHQgLz0gMSAvIDIpIDwgMSkgcmV0dXJuIC0xIC8gMiAqIChNYXRoLnNxcnQoMSAtIHQgKiB0KSAtIDEpO1xuXHRcdFx0XHRyZXR1cm4gMSAvIDIgKiAoTWF0aC5zcXJ0KDEgLSAodCAtPSAyKSAqIHQpICsgMSk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluRWxhc3RpYzogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0dmFyIHMgPSAxLjcwMTU4O1xuXHRcdFx0XHR2YXIgcCA9IDA7XG5cdFx0XHRcdHZhciBhID0gMTtcblx0XHRcdFx0aWYgKHQgPT09IDApIHJldHVybiAwO1xuXHRcdFx0XHRpZiAoKHQgLz0gMSkgPT0gMSkgcmV0dXJuIDE7XG5cdFx0XHRcdGlmICghcCkgcCA9IDEgKiAwLjM7XG5cdFx0XHRcdGlmIChhIDwgTWF0aC5hYnMoMSkpIHtcblx0XHRcdFx0XHRhID0gMTtcblx0XHRcdFx0XHRzID0gcCAvIDQ7XG5cdFx0XHRcdH0gZWxzZSBzID0gcCAvICgyICogTWF0aC5QSSkgKiBNYXRoLmFzaW4oMSAvIGEpO1xuXHRcdFx0XHRyZXR1cm4gLShhICogTWF0aC5wb3coMiwgMTAgKiAodCAtPSAxKSkgKiBNYXRoLnNpbigodCAqIDEgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZU91dEVsYXN0aWM6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHZhciBzID0gMS43MDE1ODtcblx0XHRcdFx0dmFyIHAgPSAwO1xuXHRcdFx0XHR2YXIgYSA9IDE7XG5cdFx0XHRcdGlmICh0ID09PSAwKSByZXR1cm4gMDtcblx0XHRcdFx0aWYgKCh0IC89IDEpID09IDEpIHJldHVybiAxO1xuXHRcdFx0XHRpZiAoIXApIHAgPSAxICogMC4zO1xuXHRcdFx0XHRpZiAoYSA8IE1hdGguYWJzKDEpKSB7XG5cdFx0XHRcdFx0YSA9IDE7XG5cdFx0XHRcdFx0cyA9IHAgLyA0O1xuXHRcdFx0XHR9IGVsc2UgcyA9IHAgLyAoMiAqIE1hdGguUEkpICogTWF0aC5hc2luKDEgLyBhKTtcblx0XHRcdFx0cmV0dXJuIGEgKiBNYXRoLnBvdygyLCAtMTAgKiB0KSAqIE1hdGguc2luKCh0ICogMSAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApICsgMTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5PdXRFbGFzdGljOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHR2YXIgcyA9IDEuNzAxNTg7XG5cdFx0XHRcdHZhciBwID0gMDtcblx0XHRcdFx0dmFyIGEgPSAxO1xuXHRcdFx0XHRpZiAodCA9PT0gMCkgcmV0dXJuIDA7XG5cdFx0XHRcdGlmICgodCAvPSAxIC8gMikgPT0gMikgcmV0dXJuIDE7XG5cdFx0XHRcdGlmICghcCkgcCA9IDEgKiAoMC4zICogMS41KTtcblx0XHRcdFx0aWYgKGEgPCBNYXRoLmFicygxKSkge1xuXHRcdFx0XHRcdGEgPSAxO1xuXHRcdFx0XHRcdHMgPSBwIC8gNDtcblx0XHRcdFx0fSBlbHNlIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbigxIC8gYSk7XG5cdFx0XHRcdGlmICh0IDwgMSkgcmV0dXJuIC0wLjUgKiAoYSAqIE1hdGgucG93KDIsIDEwICogKHQgLT0gMSkpICogTWF0aC5zaW4oKHQgKiAxIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkpO1xuXHRcdFx0XHRyZXR1cm4gYSAqIE1hdGgucG93KDIsIC0xMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0ICogMSAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApICogMC41ICsgMTtcblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5CYWNrOiBmdW5jdGlvbiAodCkge1xuXHRcdFx0XHR2YXIgcyA9IDEuNzAxNTg7XG5cdFx0XHRcdHJldHVybiAxICogKHQgLz0gMSkgKiB0ICogKChzICsgMSkgKiB0IC0gcyk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZU91dEJhY2s6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdHZhciBzID0gMS43MDE1ODtcblx0XHRcdFx0cmV0dXJuIDEgKiAoKHQgPSB0IC8gMSAtIDEpICogdCAqICgocyArIDEpICogdCArIHMpICsgMSk7XG5cdFx0XHR9LFxuXHRcdFx0ZWFzZUluT3V0QmFjazogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0dmFyIHMgPSAxLjcwMTU4O1xuXHRcdFx0XHRpZiAoKHQgLz0gMSAvIDIpIDwgMSkgcmV0dXJuIDEgLyAyICogKHQgKiB0ICogKCgocyAqPSAoMS41MjUpKSArIDEpICogdCAtIHMpKTtcblx0XHRcdFx0cmV0dXJuIDEgLyAyICogKCh0IC09IDIpICogdCAqICgoKHMgKj0gKDEuNTI1KSkgKyAxKSAqIHQgKyBzKSArIDIpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VJbkJvdW5jZTogZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0cmV0dXJuIDEgLSBlYXNpbmdFZmZlY3RzLmVhc2VPdXRCb3VuY2UoMSAtIHQpO1xuXHRcdFx0fSxcblx0XHRcdGVhc2VPdXRCb3VuY2U6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdGlmICgodCAvPSAxKSA8ICgxIC8gMi43NSkpIHtcblx0XHRcdFx0XHRyZXR1cm4gMSAqICg3LjU2MjUgKiB0ICogdCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAodCA8ICgyIC8gMi43NSkpIHtcblx0XHRcdFx0XHRyZXR1cm4gMSAqICg3LjU2MjUgKiAodCAtPSAoMS41IC8gMi43NSkpICogdCArIDAuNzUpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHQgPCAoMi41IC8gMi43NSkpIHtcblx0XHRcdFx0XHRyZXR1cm4gMSAqICg3LjU2MjUgKiAodCAtPSAoMi4yNSAvIDIuNzUpKSAqIHQgKyAwLjkzNzUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiAxICogKDcuNTYyNSAqICh0IC09ICgyLjYyNSAvIDIuNzUpKSAqIHQgKyAwLjk4NDM3NSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRlYXNlSW5PdXRCb3VuY2U6IGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdGlmICh0IDwgMSAvIDIpIHJldHVybiBlYXNpbmdFZmZlY3RzLmVhc2VJbkJvdW5jZSh0ICogMikgKiAwLjU7XG5cdFx0XHRcdHJldHVybiBlYXNpbmdFZmZlY3RzLmVhc2VPdXRCb3VuY2UodCAqIDIgLSAxKSAqIDAuNSArIDEgKiAwLjU7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvL1JlcXVlc3QgYW5pbWF0aW9uIHBvbHlmaWxsIC0gaHR0cDovL3d3dy5wYXVsaXJpc2guY29tLzIwMTEvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1hbmltYXRpbmcvXG5cdFx0cmVxdWVzdEFuaW1GcmFtZSA9IGhlbHBlcnMucmVxdWVzdEFuaW1GcmFtZSA9IChmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcblx0XHRcdFx0d2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuXHRcdFx0XHR3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG5cdFx0XHRcdHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG5cdFx0XHRcdHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuXHRcdFx0XHRmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdFx0XHRcdHJldHVybiB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcblx0XHRcdFx0fTtcblx0XHR9KSgpLFxuXHRcdGNhbmNlbEFuaW1GcmFtZSA9IGhlbHBlcnMuY2FuY2VsQW5pbUZyYW1lID0gKGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG5cdFx0XHRcdHdpbmRvdy53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuXHRcdFx0XHR3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcblx0XHRcdFx0d2luZG93Lm9DYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuXHRcdFx0XHR3aW5kb3cubXNDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuXHRcdFx0XHRmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdFx0XHRcdHJldHVybiB3aW5kb3cuY2xlYXJUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xuXHRcdFx0XHR9O1xuXHRcdH0pKCksXG5cdFx0YW5pbWF0aW9uTG9vcCA9IGhlbHBlcnMuYW5pbWF0aW9uTG9vcCA9IGZ1bmN0aW9uKGNhbGxiYWNrLHRvdGFsU3RlcHMsZWFzaW5nU3RyaW5nLG9uUHJvZ3Jlc3Msb25Db21wbGV0ZSxjaGFydEluc3RhbmNlKXtcblxuXHRcdFx0dmFyIGN1cnJlbnRTdGVwID0gMCxcblx0XHRcdFx0ZWFzaW5nRnVuY3Rpb24gPSBlYXNpbmdFZmZlY3RzW2Vhc2luZ1N0cmluZ10gfHwgZWFzaW5nRWZmZWN0cy5saW5lYXI7XG5cblx0XHRcdHZhciBhbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGN1cnJlbnRTdGVwKys7XG5cdFx0XHRcdHZhciBzdGVwRGVjaW1hbCA9IGN1cnJlbnRTdGVwL3RvdGFsU3RlcHM7XG5cdFx0XHRcdHZhciBlYXNlRGVjaW1hbCA9IGVhc2luZ0Z1bmN0aW9uKHN0ZXBEZWNpbWFsKTtcblxuXHRcdFx0XHRjYWxsYmFjay5jYWxsKGNoYXJ0SW5zdGFuY2UsZWFzZURlY2ltYWwsc3RlcERlY2ltYWwsIGN1cnJlbnRTdGVwKTtcblx0XHRcdFx0b25Qcm9ncmVzcy5jYWxsKGNoYXJ0SW5zdGFuY2UsZWFzZURlY2ltYWwsc3RlcERlY2ltYWwpO1xuXHRcdFx0XHRpZiAoY3VycmVudFN0ZXAgPCB0b3RhbFN0ZXBzKXtcblx0XHRcdFx0XHRjaGFydEluc3RhbmNlLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1GcmFtZShhbmltYXRpb25GcmFtZSk7XG5cdFx0XHRcdH0gZWxzZXtcblx0XHRcdFx0XHRvbkNvbXBsZXRlLmFwcGx5KGNoYXJ0SW5zdGFuY2UpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0cmVxdWVzdEFuaW1GcmFtZShhbmltYXRpb25GcmFtZSk7XG5cdFx0fSxcblx0XHQvLy0tIERPTSBtZXRob2RzXG5cdFx0Z2V0UmVsYXRpdmVQb3NpdGlvbiA9IGhlbHBlcnMuZ2V0UmVsYXRpdmVQb3NpdGlvbiA9IGZ1bmN0aW9uKGV2dCl7XG5cdFx0XHR2YXIgbW91c2VYLCBtb3VzZVk7XG5cdFx0XHR2YXIgZSA9IGV2dC5vcmlnaW5hbEV2ZW50IHx8IGV2dCxcblx0XHRcdFx0Y2FudmFzID0gZXZ0LmN1cnJlbnRUYXJnZXQgfHwgZXZ0LnNyY0VsZW1lbnQsXG5cdFx0XHRcdGJvdW5kaW5nUmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuXHRcdFx0aWYgKGUudG91Y2hlcyl7XG5cdFx0XHRcdG1vdXNlWCA9IGUudG91Y2hlc1swXS5jbGllbnRYIC0gYm91bmRpbmdSZWN0LmxlZnQ7XG5cdFx0XHRcdG1vdXNlWSA9IGUudG91Y2hlc1swXS5jbGllbnRZIC0gYm91bmRpbmdSZWN0LnRvcDtcblxuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0bW91c2VYID0gZS5jbGllbnRYIC0gYm91bmRpbmdSZWN0LmxlZnQ7XG5cdFx0XHRcdG1vdXNlWSA9IGUuY2xpZW50WSAtIGJvdW5kaW5nUmVjdC50b3A7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHggOiBtb3VzZVgsXG5cdFx0XHRcdHkgOiBtb3VzZVlcblx0XHRcdH07XG5cblx0XHR9LFxuXHRcdGFkZEV2ZW50ID0gaGVscGVycy5hZGRFdmVudCA9IGZ1bmN0aW9uKG5vZGUsZXZlbnRUeXBlLG1ldGhvZCl7XG5cdFx0XHRpZiAobm9kZS5hZGRFdmVudExpc3RlbmVyKXtcblx0XHRcdFx0bm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSxtZXRob2QpO1xuXHRcdFx0fSBlbHNlIGlmIChub2RlLmF0dGFjaEV2ZW50KXtcblx0XHRcdFx0bm9kZS5hdHRhY2hFdmVudChcIm9uXCIrZXZlbnRUeXBlLCBtZXRob2QpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bm9kZVtcIm9uXCIrZXZlbnRUeXBlXSA9IG1ldGhvZDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHJlbW92ZUV2ZW50ID0gaGVscGVycy5yZW1vdmVFdmVudCA9IGZ1bmN0aW9uKG5vZGUsIGV2ZW50VHlwZSwgaGFuZGxlcil7XG5cdFx0XHRpZiAobm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKXtcblx0XHRcdFx0bm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgaGFuZGxlciwgZmFsc2UpO1xuXHRcdFx0fSBlbHNlIGlmIChub2RlLmRldGFjaEV2ZW50KXtcblx0XHRcdFx0bm9kZS5kZXRhY2hFdmVudChcIm9uXCIrZXZlbnRUeXBlLGhhbmRsZXIpO1xuXHRcdFx0fSBlbHNle1xuXHRcdFx0XHRub2RlW1wib25cIiArIGV2ZW50VHlwZV0gPSBub29wO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0YmluZEV2ZW50cyA9IGhlbHBlcnMuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKGNoYXJ0SW5zdGFuY2UsIGFycmF5T2ZFdmVudHMsIGhhbmRsZXIpe1xuXHRcdFx0Ly8gQ3JlYXRlIHRoZSBldmVudHMgb2JqZWN0IGlmIGl0J3Mgbm90IGFscmVhZHkgcHJlc2VudFxuXHRcdFx0aWYgKCFjaGFydEluc3RhbmNlLmV2ZW50cykgY2hhcnRJbnN0YW5jZS5ldmVudHMgPSB7fTtcblxuXHRcdFx0ZWFjaChhcnJheU9mRXZlbnRzLGZ1bmN0aW9uKGV2ZW50TmFtZSl7XG5cdFx0XHRcdGNoYXJ0SW5zdGFuY2UuZXZlbnRzW2V2ZW50TmFtZV0gPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGhhbmRsZXIuYXBwbHkoY2hhcnRJbnN0YW5jZSwgYXJndW1lbnRzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0YWRkRXZlbnQoY2hhcnRJbnN0YW5jZS5jaGFydC5jYW52YXMsZXZlbnROYW1lLGNoYXJ0SW5zdGFuY2UuZXZlbnRzW2V2ZW50TmFtZV0pO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHR1bmJpbmRFdmVudHMgPSBoZWxwZXJzLnVuYmluZEV2ZW50cyA9IGZ1bmN0aW9uIChjaGFydEluc3RhbmNlLCBhcnJheU9mRXZlbnRzKSB7XG5cdFx0XHRlYWNoKGFycmF5T2ZFdmVudHMsIGZ1bmN0aW9uKGhhbmRsZXIsZXZlbnROYW1lKXtcblx0XHRcdFx0cmVtb3ZlRXZlbnQoY2hhcnRJbnN0YW5jZS5jaGFydC5jYW52YXMsIGV2ZW50TmFtZSwgaGFuZGxlcik7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdGdldE1heGltdW1XaWR0aCA9IGhlbHBlcnMuZ2V0TWF4aW11bVdpZHRoID0gZnVuY3Rpb24oZG9tTm9kZSl7XG5cdFx0XHR2YXIgY29udGFpbmVyID0gZG9tTm9kZS5wYXJlbnROb2RlO1xuXHRcdFx0Ly8gVE9ETyA9IGNoZWNrIGNyb3NzIGJyb3dzZXIgc3R1ZmYgd2l0aCB0aGlzLlxuXHRcdFx0cmV0dXJuIGNvbnRhaW5lci5jbGllbnRXaWR0aDtcblx0XHR9LFxuXHRcdGdldE1heGltdW1IZWlnaHQgPSBoZWxwZXJzLmdldE1heGltdW1IZWlnaHQgPSBmdW5jdGlvbihkb21Ob2RlKXtcblx0XHRcdHZhciBjb250YWluZXIgPSBkb21Ob2RlLnBhcmVudE5vZGU7XG5cdFx0XHQvLyBUT0RPID0gY2hlY2sgY3Jvc3MgYnJvd3NlciBzdHVmZiB3aXRoIHRoaXMuXG5cdFx0XHRyZXR1cm4gY29udGFpbmVyLmNsaWVudEhlaWdodDtcblx0XHR9LFxuXHRcdGdldE1heGltdW1TaXplID0gaGVscGVycy5nZXRNYXhpbXVtU2l6ZSA9IGhlbHBlcnMuZ2V0TWF4aW11bVdpZHRoLCAvLyBsZWdhY3kgc3VwcG9ydFxuXHRcdHJldGluYVNjYWxlID0gaGVscGVycy5yZXRpbmFTY2FsZSA9IGZ1bmN0aW9uKGNoYXJ0KXtcblx0XHRcdHZhciBjdHggPSBjaGFydC5jdHgsXG5cdFx0XHRcdHdpZHRoID0gY2hhcnQuY2FudmFzLndpZHRoLFxuXHRcdFx0XHRoZWlnaHQgPSBjaGFydC5jYW52YXMuaGVpZ2h0O1xuXG5cdFx0XHRpZiAod2luZG93LmRldmljZVBpeGVsUmF0aW8pIHtcblx0XHRcdFx0Y3R4LmNhbnZhcy5zdHlsZS53aWR0aCA9IHdpZHRoICsgXCJweFwiO1xuXHRcdFx0XHRjdHguY2FudmFzLnN0eWxlLmhlaWdodCA9IGhlaWdodCArIFwicHhcIjtcblx0XHRcdFx0Y3R4LmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcblx0XHRcdFx0Y3R4LmNhbnZhcy53aWR0aCA9IHdpZHRoICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XG5cdFx0XHRcdGN0eC5zY2FsZSh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbywgd2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8tLSBDYW52YXMgbWV0aG9kc1xuXHRcdGNsZWFyID0gaGVscGVycy5jbGVhciA9IGZ1bmN0aW9uKGNoYXJ0KXtcblx0XHRcdGNoYXJ0LmN0eC5jbGVhclJlY3QoMCwwLGNoYXJ0LndpZHRoLGNoYXJ0LmhlaWdodCk7XG5cdFx0fSxcblx0XHRmb250U3RyaW5nID0gaGVscGVycy5mb250U3RyaW5nID0gZnVuY3Rpb24ocGl4ZWxTaXplLGZvbnRTdHlsZSxmb250RmFtaWx5KXtcblx0XHRcdHJldHVybiBmb250U3R5bGUgKyBcIiBcIiArIHBpeGVsU2l6ZStcInB4IFwiICsgZm9udEZhbWlseTtcblx0XHR9LFxuXHRcdGxvbmdlc3RUZXh0ID0gaGVscGVycy5sb25nZXN0VGV4dCA9IGZ1bmN0aW9uKGN0eCxmb250LGFycmF5T2ZTdHJpbmdzKXtcblx0XHRcdGN0eC5mb250ID0gZm9udDtcblx0XHRcdHZhciBsb25nZXN0ID0gMDtcblx0XHRcdGVhY2goYXJyYXlPZlN0cmluZ3MsZnVuY3Rpb24oc3RyaW5nKXtcblx0XHRcdFx0dmFyIHRleHRXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dChzdHJpbmcpLndpZHRoO1xuXHRcdFx0XHRsb25nZXN0ID0gKHRleHRXaWR0aCA+IGxvbmdlc3QpID8gdGV4dFdpZHRoIDogbG9uZ2VzdDtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGxvbmdlc3Q7XG5cdFx0fSxcblx0XHRkcmF3Um91bmRlZFJlY3RhbmdsZSA9IGhlbHBlcnMuZHJhd1JvdW5kZWRSZWN0YW5nbGUgPSBmdW5jdGlvbihjdHgseCx5LHdpZHRoLGhlaWdodCxyYWRpdXMpe1xuXHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0Y3R4Lm1vdmVUbyh4ICsgcmFkaXVzLCB5KTtcblx0XHRcdGN0eC5saW5lVG8oeCArIHdpZHRoIC0gcmFkaXVzLCB5KTtcblx0XHRcdGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHggKyB3aWR0aCwgeSwgeCArIHdpZHRoLCB5ICsgcmFkaXVzKTtcblx0XHRcdGN0eC5saW5lVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcblx0XHRcdGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCwgeCArIHdpZHRoIC0gcmFkaXVzLCB5ICsgaGVpZ2h0KTtcblx0XHRcdGN0eC5saW5lVG8oeCArIHJhZGl1cywgeSArIGhlaWdodCk7XG5cdFx0XHRjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5ICsgaGVpZ2h0LCB4LCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcblx0XHRcdGN0eC5saW5lVG8oeCwgeSArIHJhZGl1cyk7XG5cdFx0XHRjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5LCB4ICsgcmFkaXVzLCB5KTtcblx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHR9O1xuXG5cblx0Ly9TdG9yZSBhIHJlZmVyZW5jZSB0byBlYWNoIGluc3RhbmNlIC0gYWxsb3dpbmcgdXMgdG8gZ2xvYmFsbHkgcmVzaXplIGNoYXJ0IGluc3RhbmNlcyBvbiB3aW5kb3cgcmVzaXplLlxuXHQvL0Rlc3Ryb3kgbWV0aG9kIG9uIHRoZSBjaGFydCB3aWxsIHJlbW92ZSB0aGUgaW5zdGFuY2Ugb2YgdGhlIGNoYXJ0IGZyb20gdGhpcyByZWZlcmVuY2UuXG5cdENoYXJ0Lmluc3RhbmNlcyA9IHt9O1xuXG5cdENoYXJ0LlR5cGUgPSBmdW5jdGlvbihkYXRhLG9wdGlvbnMsY2hhcnQpe1xuXHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0dGhpcy5jaGFydCA9IGNoYXJ0O1xuXHRcdHRoaXMuaWQgPSB1aWQoKTtcblx0XHQvL0FkZCB0aGUgY2hhcnQgaW5zdGFuY2UgdG8gdGhlIGdsb2JhbCBuYW1lc3BhY2Vcblx0XHRDaGFydC5pbnN0YW5jZXNbdGhpcy5pZF0gPSB0aGlzO1xuXG5cdFx0Ly8gSW5pdGlhbGl6ZSBpcyBhbHdheXMgY2FsbGVkIHdoZW4gYSBjaGFydCB0eXBlIGlzIGNyZWF0ZWRcblx0XHQvLyBCeSBkZWZhdWx0IGl0IGlzIGEgbm8gb3AsIGJ1dCBpdCBzaG91bGQgYmUgZXh0ZW5kZWRcblx0XHRpZiAob3B0aW9ucy5yZXNwb25zaXZlKXtcblx0XHRcdHRoaXMucmVzaXplKCk7XG5cdFx0fVxuXHRcdHRoaXMuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsZGF0YSk7XG5cdH07XG5cblx0Ly9Db3JlIG1ldGhvZHMgdGhhdCdsbCBiZSBhIHBhcnQgb2YgZXZlcnkgY2hhcnQgdHlwZVxuXHRleHRlbmQoQ2hhcnQuVHlwZS5wcm90b3R5cGUse1xuXHRcdGluaXRpYWxpemUgOiBmdW5jdGlvbigpe3JldHVybiB0aGlzO30sXG5cdFx0Y2xlYXIgOiBmdW5jdGlvbigpe1xuXHRcdFx0Y2xlYXIodGhpcy5jaGFydCk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXHRcdHN0b3AgOiBmdW5jdGlvbigpe1xuXHRcdFx0Ly8gU3RvcHMgYW55IGN1cnJlbnQgYW5pbWF0aW9uIGxvb3Agb2NjdXJpbmdcblx0XHRcdGNhbmNlbEFuaW1GcmFtZSh0aGlzLmFuaW1hdGlvbkZyYW1lKTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cdFx0cmVzaXplIDogZnVuY3Rpb24oY2FsbGJhY2spe1xuXHRcdFx0dGhpcy5zdG9wKCk7XG5cdFx0XHR2YXIgY2FudmFzID0gdGhpcy5jaGFydC5jYW52YXMsXG5cdFx0XHRcdG5ld1dpZHRoID0gZ2V0TWF4aW11bVdpZHRoKHRoaXMuY2hhcnQuY2FudmFzKSxcblx0XHRcdFx0bmV3SGVpZ2h0ID0gdGhpcy5vcHRpb25zLm1haW50YWluQXNwZWN0UmF0aW8gPyBuZXdXaWR0aCAvIHRoaXMuY2hhcnQuYXNwZWN0UmF0aW8gOiBnZXRNYXhpbXVtSGVpZ2h0KHRoaXMuY2hhcnQuY2FudmFzKTtcblxuXHRcdFx0Y2FudmFzLndpZHRoID0gdGhpcy5jaGFydC53aWR0aCA9IG5ld1dpZHRoO1xuXHRcdFx0Y2FudmFzLmhlaWdodCA9IHRoaXMuY2hhcnQuaGVpZ2h0ID0gbmV3SGVpZ2h0O1xuXG5cdFx0XHRyZXRpbmFTY2FsZSh0aGlzLmNoYXJ0KTtcblxuXHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKXtcblx0XHRcdFx0Y2FsbGJhY2suYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXHRcdHJlZmxvdyA6IG5vb3AsXG5cdFx0cmVuZGVyIDogZnVuY3Rpb24ocmVmbG93KXtcblx0XHRcdGlmIChyZWZsb3cpe1xuXHRcdFx0XHR0aGlzLnJlZmxvdygpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5hbmltYXRpb24gJiYgIXJlZmxvdyl7XG5cdFx0XHRcdGhlbHBlcnMuYW5pbWF0aW9uTG9vcChcblx0XHRcdFx0XHR0aGlzLmRyYXcsXG5cdFx0XHRcdFx0dGhpcy5vcHRpb25zLmFuaW1hdGlvblN0ZXBzLFxuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5hbmltYXRpb25FYXNpbmcsXG5cdFx0XHRcdFx0dGhpcy5vcHRpb25zLm9uQW5pbWF0aW9uUHJvZ3Jlc3MsXG5cdFx0XHRcdFx0dGhpcy5vcHRpb25zLm9uQW5pbWF0aW9uQ29tcGxldGUsXG5cdFx0XHRcdFx0dGhpc1xuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0dGhpcy5kcmF3KCk7XG5cdFx0XHRcdHRoaXMub3B0aW9ucy5vbkFuaW1hdGlvbkNvbXBsZXRlLmNhbGwodGhpcyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXHRcdGdlbmVyYXRlTGVnZW5kIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB0ZW1wbGF0ZSh0aGlzLm9wdGlvbnMubGVnZW5kVGVtcGxhdGUsdGhpcyk7XG5cdFx0fSxcblx0XHRkZXN0cm95IDogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuY2xlYXIoKTtcblx0XHRcdHVuYmluZEV2ZW50cyh0aGlzLCB0aGlzLmV2ZW50cyk7XG5cdFx0XHR2YXIgY2FudmFzID0gdGhpcy5jaGFydC5jYW52YXM7XG5cblx0XHRcdC8vIFJlc2V0IGNhbnZhcyBoZWlnaHQvd2lkdGggYXR0cmlidXRlcyBzdGFydHMgYSBmcmVzaCB3aXRoIHRoZSBjYW52YXMgY29udGV4dFxuXHRcdFx0Y2FudmFzLndpZHRoID0gdGhpcy5jaGFydC53aWR0aDtcblx0XHRcdGNhbnZhcy5oZWlnaHQgPSB0aGlzLmNoYXJ0LmhlaWdodDtcblxuXHRcdFx0Ly8gPCBJRTkgZG9lc24ndCBzdXBwb3J0IHJlbW92ZVByb3BlcnR5XG5cdFx0XHRpZiAoY2FudmFzLnN0eWxlLnJlbW92ZVByb3BlcnR5KSB7XG5cdFx0XHRcdGNhbnZhcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnd2lkdGgnKTtcblx0XHRcdFx0Y2FudmFzLnN0eWxlLnJlbW92ZVByb3BlcnR5KCdoZWlnaHQnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNhbnZhcy5zdHlsZS5yZW1vdmVBdHRyaWJ1dGUoJ3dpZHRoJyk7XG5cdFx0XHRcdGNhbnZhcy5zdHlsZS5yZW1vdmVBdHRyaWJ1dGUoJ2hlaWdodCcpO1xuXHRcdFx0fVxuXG5cdFx0XHRkZWxldGUgQ2hhcnQuaW5zdGFuY2VzW3RoaXMuaWRdO1xuXHRcdH0sXG5cdFx0c2hvd1Rvb2x0aXAgOiBmdW5jdGlvbihDaGFydEVsZW1lbnRzLCBmb3JjZVJlZHJhdyl7XG5cdFx0XHQvLyBPbmx5IHJlZHJhdyB0aGUgY2hhcnQgaWYgd2UndmUgYWN0dWFsbHkgY2hhbmdlZCB3aGF0IHdlJ3JlIGhvdmVyaW5nIG9uLlxuXHRcdFx0aWYgKHR5cGVvZiB0aGlzLmFjdGl2ZUVsZW1lbnRzID09PSAndW5kZWZpbmVkJykgdGhpcy5hY3RpdmVFbGVtZW50cyA9IFtdO1xuXG5cdFx0XHR2YXIgaXNDaGFuZ2VkID0gKGZ1bmN0aW9uKEVsZW1lbnRzKXtcblx0XHRcdFx0dmFyIGNoYW5nZWQgPSBmYWxzZTtcblxuXHRcdFx0XHRpZiAoRWxlbWVudHMubGVuZ3RoICE9PSB0aGlzLmFjdGl2ZUVsZW1lbnRzLmxlbmd0aCl7XG5cdFx0XHRcdFx0Y2hhbmdlZCA9IHRydWU7XG5cdFx0XHRcdFx0cmV0dXJuIGNoYW5nZWQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRlYWNoKEVsZW1lbnRzLCBmdW5jdGlvbihlbGVtZW50LCBpbmRleCl7XG5cdFx0XHRcdFx0aWYgKGVsZW1lbnQgIT09IHRoaXMuYWN0aXZlRWxlbWVudHNbaW5kZXhdKXtcblx0XHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgdGhpcyk7XG5cdFx0XHRcdHJldHVybiBjaGFuZ2VkO1xuXHRcdFx0fSkuY2FsbCh0aGlzLCBDaGFydEVsZW1lbnRzKTtcblxuXHRcdFx0aWYgKCFpc0NoYW5nZWQgJiYgIWZvcmNlUmVkcmF3KXtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0dGhpcy5hY3RpdmVFbGVtZW50cyA9IENoYXJ0RWxlbWVudHM7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmRyYXcoKTtcblx0XHRcdGlmKHRoaXMub3B0aW9ucy5jdXN0b21Ub29sdGlwcyl7XG5cdFx0XHRcdHRoaXMub3B0aW9ucy5jdXN0b21Ub29sdGlwcyhmYWxzZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoQ2hhcnRFbGVtZW50cy5sZW5ndGggPiAwKXtcblx0XHRcdFx0Ly8gSWYgd2UgaGF2ZSBtdWx0aXBsZSBkYXRhc2V0cywgc2hvdyBhIE11bHRpVG9vbHRpcCBmb3IgYWxsIG9mIHRoZSBkYXRhIHBvaW50cyBhdCB0aGF0IGluZGV4XG5cdFx0XHRcdGlmICh0aGlzLmRhdGFzZXRzICYmIHRoaXMuZGF0YXNldHMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdHZhciBkYXRhQXJyYXksXG5cdFx0XHRcdFx0XHRkYXRhSW5kZXg7XG5cblx0XHRcdFx0XHRmb3IgKHZhciBpID0gdGhpcy5kYXRhc2V0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHRcdFx0ZGF0YUFycmF5ID0gdGhpcy5kYXRhc2V0c1tpXS5wb2ludHMgfHwgdGhpcy5kYXRhc2V0c1tpXS5iYXJzIHx8IHRoaXMuZGF0YXNldHNbaV0uc2VnbWVudHM7XG5cdFx0XHRcdFx0XHRkYXRhSW5kZXggPSBpbmRleE9mKGRhdGFBcnJheSwgQ2hhcnRFbGVtZW50c1swXSk7XG5cdFx0XHRcdFx0XHRpZiAoZGF0YUluZGV4ICE9PSAtMSl7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgdG9vbHRpcExhYmVscyA9IFtdLFxuXHRcdFx0XHRcdFx0dG9vbHRpcENvbG9ycyA9IFtdLFxuXHRcdFx0XHRcdFx0bWVkaWFuUG9zaXRpb24gPSAoZnVuY3Rpb24oaW5kZXgpIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBHZXQgYWxsIHRoZSBwb2ludHMgYXQgdGhhdCBwYXJ0aWN1bGFyIGluZGV4XG5cdFx0XHRcdFx0XHRcdHZhciBFbGVtZW50cyA9IFtdLFxuXHRcdFx0XHRcdFx0XHRcdGRhdGFDb2xsZWN0aW9uLFxuXHRcdFx0XHRcdFx0XHRcdHhQb3NpdGlvbnMgPSBbXSxcblx0XHRcdFx0XHRcdFx0XHR5UG9zaXRpb25zID0gW10sXG5cdFx0XHRcdFx0XHRcdFx0eE1heCxcblx0XHRcdFx0XHRcdFx0XHR5TWF4LFxuXHRcdFx0XHRcdFx0XHRcdHhNaW4sXG5cdFx0XHRcdFx0XHRcdFx0eU1pbjtcblx0XHRcdFx0XHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsIGZ1bmN0aW9uKGRhdGFzZXQpe1xuXHRcdFx0XHRcdFx0XHRcdGRhdGFDb2xsZWN0aW9uID0gZGF0YXNldC5wb2ludHMgfHwgZGF0YXNldC5iYXJzIHx8IGRhdGFzZXQuc2VnbWVudHM7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRhdGFDb2xsZWN0aW9uW2RhdGFJbmRleF0gJiYgZGF0YUNvbGxlY3Rpb25bZGF0YUluZGV4XS5oYXNWYWx1ZSgpKXtcblx0XHRcdFx0XHRcdFx0XHRcdEVsZW1lbnRzLnB1c2goZGF0YUNvbGxlY3Rpb25bZGF0YUluZGV4XSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRoZWxwZXJzLmVhY2goRWxlbWVudHMsIGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRcdFx0XHRcdFx0XHR4UG9zaXRpb25zLnB1c2goZWxlbWVudC54KTtcblx0XHRcdFx0XHRcdFx0XHR5UG9zaXRpb25zLnB1c2goZWxlbWVudC55KTtcblxuXG5cdFx0XHRcdFx0XHRcdFx0Ly9JbmNsdWRlIGFueSBjb2xvdXIgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVsZW1lbnRcblx0XHRcdFx0XHRcdFx0XHR0b29sdGlwTGFiZWxzLnB1c2goaGVscGVycy50ZW1wbGF0ZSh0aGlzLm9wdGlvbnMubXVsdGlUb29sdGlwVGVtcGxhdGUsIGVsZW1lbnQpKTtcblx0XHRcdFx0XHRcdFx0XHR0b29sdGlwQ29sb3JzLnB1c2goe1xuXHRcdFx0XHRcdFx0XHRcdFx0ZmlsbDogZWxlbWVudC5fc2F2ZWQuZmlsbENvbG9yIHx8IGVsZW1lbnQuZmlsbENvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0c3Ryb2tlOiBlbGVtZW50Ll9zYXZlZC5zdHJva2VDb2xvciB8fCBlbGVtZW50LnN0cm9rZUNvbG9yXG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0fSwgdGhpcyk7XG5cblx0XHRcdFx0XHRcdFx0eU1pbiA9IG1pbih5UG9zaXRpb25zKTtcblx0XHRcdFx0XHRcdFx0eU1heCA9IG1heCh5UG9zaXRpb25zKTtcblxuXHRcdFx0XHRcdFx0XHR4TWluID0gbWluKHhQb3NpdGlvbnMpO1xuXHRcdFx0XHRcdFx0XHR4TWF4ID0gbWF4KHhQb3NpdGlvbnMpO1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0eDogKHhNaW4gPiB0aGlzLmNoYXJ0LndpZHRoLzIpID8geE1pbiA6IHhNYXgsXG5cdFx0XHRcdFx0XHRcdFx0eTogKHlNaW4gKyB5TWF4KS8yXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9KS5jYWxsKHRoaXMsIGRhdGFJbmRleCk7XG5cblx0XHRcdFx0XHRuZXcgQ2hhcnQuTXVsdGlUb29sdGlwKHtcblx0XHRcdFx0XHRcdHg6IG1lZGlhblBvc2l0aW9uLngsXG5cdFx0XHRcdFx0XHR5OiBtZWRpYW5Qb3NpdGlvbi55LFxuXHRcdFx0XHRcdFx0eFBhZGRpbmc6IHRoaXMub3B0aW9ucy50b29sdGlwWFBhZGRpbmcsXG5cdFx0XHRcdFx0XHR5UGFkZGluZzogdGhpcy5vcHRpb25zLnRvb2x0aXBZUGFkZGluZyxcblx0XHRcdFx0XHRcdHhPZmZzZXQ6IHRoaXMub3B0aW9ucy50b29sdGlwWE9mZnNldCxcblx0XHRcdFx0XHRcdGZpbGxDb2xvcjogdGhpcy5vcHRpb25zLnRvb2x0aXBGaWxsQ29sb3IsXG5cdFx0XHRcdFx0XHR0ZXh0Q29sb3I6IHRoaXMub3B0aW9ucy50b29sdGlwRm9udENvbG9yLFxuXHRcdFx0XHRcdFx0Zm9udEZhbWlseTogdGhpcy5vcHRpb25zLnRvb2x0aXBGb250RmFtaWx5LFxuXHRcdFx0XHRcdFx0Zm9udFN0eWxlOiB0aGlzLm9wdGlvbnMudG9vbHRpcEZvbnRTdHlsZSxcblx0XHRcdFx0XHRcdGZvbnRTaXplOiB0aGlzLm9wdGlvbnMudG9vbHRpcEZvbnRTaXplLFxuXHRcdFx0XHRcdFx0dGl0bGVUZXh0Q29sb3I6IHRoaXMub3B0aW9ucy50b29sdGlwVGl0bGVGb250Q29sb3IsXG5cdFx0XHRcdFx0XHR0aXRsZUZvbnRGYW1pbHk6IHRoaXMub3B0aW9ucy50b29sdGlwVGl0bGVGb250RmFtaWx5LFxuXHRcdFx0XHRcdFx0dGl0bGVGb250U3R5bGU6IHRoaXMub3B0aW9ucy50b29sdGlwVGl0bGVGb250U3R5bGUsXG5cdFx0XHRcdFx0XHR0aXRsZUZvbnRTaXplOiB0aGlzLm9wdGlvbnMudG9vbHRpcFRpdGxlRm9udFNpemUsXG5cdFx0XHRcdFx0XHRjb3JuZXJSYWRpdXM6IHRoaXMub3B0aW9ucy50b29sdGlwQ29ybmVyUmFkaXVzLFxuXHRcdFx0XHRcdFx0bGFiZWxzOiB0b29sdGlwTGFiZWxzLFxuXHRcdFx0XHRcdFx0bGVnZW5kQ29sb3JzOiB0b29sdGlwQ29sb3JzLFxuXHRcdFx0XHRcdFx0bGVnZW5kQ29sb3JCYWNrZ3JvdW5kIDogdGhpcy5vcHRpb25zLm11bHRpVG9vbHRpcEtleUJhY2tncm91bmQsXG5cdFx0XHRcdFx0XHR0aXRsZTogQ2hhcnRFbGVtZW50c1swXS5sYWJlbCxcblx0XHRcdFx0XHRcdGNoYXJ0OiB0aGlzLmNoYXJ0LFxuXHRcdFx0XHRcdFx0Y3R4OiB0aGlzLmNoYXJ0LmN0eCxcblx0XHRcdFx0XHRcdGN1c3RvbTogdGhpcy5vcHRpb25zLmN1c3RvbVRvb2x0aXBzXG5cdFx0XHRcdFx0fSkuZHJhdygpO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZWFjaChDaGFydEVsZW1lbnRzLCBmdW5jdGlvbihFbGVtZW50KSB7XG5cdFx0XHRcdFx0XHR2YXIgdG9vbHRpcFBvc2l0aW9uID0gRWxlbWVudC50b29sdGlwUG9zaXRpb24oKTtcblx0XHRcdFx0XHRcdG5ldyBDaGFydC5Ub29sdGlwKHtcblx0XHRcdFx0XHRcdFx0eDogTWF0aC5yb3VuZCh0b29sdGlwUG9zaXRpb24ueCksXG5cdFx0XHRcdFx0XHRcdHk6IE1hdGgucm91bmQodG9vbHRpcFBvc2l0aW9uLnkpLFxuXHRcdFx0XHRcdFx0XHR4UGFkZGluZzogdGhpcy5vcHRpb25zLnRvb2x0aXBYUGFkZGluZyxcblx0XHRcdFx0XHRcdFx0eVBhZGRpbmc6IHRoaXMub3B0aW9ucy50b29sdGlwWVBhZGRpbmcsXG5cdFx0XHRcdFx0XHRcdGZpbGxDb2xvcjogdGhpcy5vcHRpb25zLnRvb2x0aXBGaWxsQ29sb3IsXG5cdFx0XHRcdFx0XHRcdHRleHRDb2xvcjogdGhpcy5vcHRpb25zLnRvb2x0aXBGb250Q29sb3IsXG5cdFx0XHRcdFx0XHRcdGZvbnRGYW1pbHk6IHRoaXMub3B0aW9ucy50b29sdGlwRm9udEZhbWlseSxcblx0XHRcdFx0XHRcdFx0Zm9udFN0eWxlOiB0aGlzLm9wdGlvbnMudG9vbHRpcEZvbnRTdHlsZSxcblx0XHRcdFx0XHRcdFx0Zm9udFNpemU6IHRoaXMub3B0aW9ucy50b29sdGlwRm9udFNpemUsXG5cdFx0XHRcdFx0XHRcdGNhcmV0SGVpZ2h0OiB0aGlzLm9wdGlvbnMudG9vbHRpcENhcmV0U2l6ZSxcblx0XHRcdFx0XHRcdFx0Y29ybmVyUmFkaXVzOiB0aGlzLm9wdGlvbnMudG9vbHRpcENvcm5lclJhZGl1cyxcblx0XHRcdFx0XHRcdFx0dGV4dDogdGVtcGxhdGUodGhpcy5vcHRpb25zLnRvb2x0aXBUZW1wbGF0ZSwgRWxlbWVudCksXG5cdFx0XHRcdFx0XHRcdGNoYXJ0OiB0aGlzLmNoYXJ0LFxuXHRcdFx0XHRcdFx0XHRjdXN0b206IHRoaXMub3B0aW9ucy5jdXN0b21Ub29sdGlwc1xuXHRcdFx0XHRcdFx0fSkuZHJhdygpO1xuXHRcdFx0XHRcdH0sIHRoaXMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXHRcdHRvQmFzZTY0SW1hZ2UgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHRoaXMuY2hhcnQuY2FudmFzLnRvRGF0YVVSTC5hcHBseSh0aGlzLmNoYXJ0LmNhbnZhcywgYXJndW1lbnRzKTtcblx0XHR9XG5cdH0pO1xuXG5cdENoYXJ0LlR5cGUuZXh0ZW5kID0gZnVuY3Rpb24oZXh0ZW5zaW9ucyl7XG5cblx0XHR2YXIgcGFyZW50ID0gdGhpcztcblxuXHRcdHZhciBDaGFydFR5cGUgPSBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHBhcmVudC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XG5cdFx0fTtcblxuXHRcdC8vQ29weSB0aGUgcHJvdG90eXBlIG9iamVjdCBvZiB0aGUgdGhpcyBjbGFzc1xuXHRcdENoYXJ0VHlwZS5wcm90b3R5cGUgPSBjbG9uZShwYXJlbnQucHJvdG90eXBlKTtcblx0XHQvL05vdyBvdmVyd3JpdGUgc29tZSBvZiB0aGUgcHJvcGVydGllcyBpbiB0aGUgYmFzZSBjbGFzcyB3aXRoIHRoZSBuZXcgZXh0ZW5zaW9uc1xuXHRcdGV4dGVuZChDaGFydFR5cGUucHJvdG90eXBlLCBleHRlbnNpb25zKTtcblxuXHRcdENoYXJ0VHlwZS5leHRlbmQgPSBDaGFydC5UeXBlLmV4dGVuZDtcblxuXHRcdGlmIChleHRlbnNpb25zLm5hbWUgfHwgcGFyZW50LnByb3RvdHlwZS5uYW1lKXtcblxuXHRcdFx0dmFyIGNoYXJ0TmFtZSA9IGV4dGVuc2lvbnMubmFtZSB8fCBwYXJlbnQucHJvdG90eXBlLm5hbWU7XG5cdFx0XHQvL0Fzc2lnbiBhbnkgcG90ZW50aWFsIGRlZmF1bHQgdmFsdWVzIG9mIHRoZSBuZXcgY2hhcnQgdHlwZVxuXG5cdFx0XHQvL0lmIG5vbmUgYXJlIGRlZmluZWQsIHdlJ2xsIHVzZSBhIGNsb25lIG9mIHRoZSBjaGFydCB0eXBlIHRoaXMgaXMgYmVpbmcgZXh0ZW5kZWQgZnJvbS5cblx0XHRcdC8vSS5lLiBpZiB3ZSBleHRlbmQgYSBsaW5lIGNoYXJ0LCB3ZSdsbCB1c2UgdGhlIGRlZmF1bHRzIGZyb20gdGhlIGxpbmUgY2hhcnQgaWYgb3VyIG5ldyBjaGFydFxuXHRcdFx0Ly9kb2Vzbid0IGRlZmluZSBzb21lIGRlZmF1bHRzIG9mIHRoZWlyIG93bi5cblxuXHRcdFx0dmFyIGJhc2VEZWZhdWx0cyA9IChDaGFydC5kZWZhdWx0c1twYXJlbnQucHJvdG90eXBlLm5hbWVdKSA/IGNsb25lKENoYXJ0LmRlZmF1bHRzW3BhcmVudC5wcm90b3R5cGUubmFtZV0pIDoge307XG5cblx0XHRcdENoYXJ0LmRlZmF1bHRzW2NoYXJ0TmFtZV0gPSBleHRlbmQoYmFzZURlZmF1bHRzLGV4dGVuc2lvbnMuZGVmYXVsdHMpO1xuXG5cdFx0XHRDaGFydC50eXBlc1tjaGFydE5hbWVdID0gQ2hhcnRUeXBlO1xuXG5cdFx0XHQvL1JlZ2lzdGVyIHRoaXMgbmV3IGNoYXJ0IHR5cGUgaW4gdGhlIENoYXJ0IHByb3RvdHlwZVxuXHRcdFx0Q2hhcnQucHJvdG90eXBlW2NoYXJ0TmFtZV0gPSBmdW5jdGlvbihkYXRhLG9wdGlvbnMpe1xuXHRcdFx0XHR2YXIgY29uZmlnID0gbWVyZ2UoQ2hhcnQuZGVmYXVsdHMuZ2xvYmFsLCBDaGFydC5kZWZhdWx0c1tjaGFydE5hbWVdLCBvcHRpb25zIHx8IHt9KTtcblx0XHRcdFx0cmV0dXJuIG5ldyBDaGFydFR5cGUoZGF0YSxjb25maWcsdGhpcyk7XG5cdFx0XHR9O1xuXHRcdH0gZWxzZXtcblx0XHRcdHdhcm4oXCJOYW1lIG5vdCBwcm92aWRlZCBmb3IgdGhpcyBjaGFydCwgc28gaXQgaGFzbid0IGJlZW4gcmVnaXN0ZXJlZFwiKTtcblx0XHR9XG5cdFx0cmV0dXJuIHBhcmVudDtcblx0fTtcblxuXHRDaGFydC5FbGVtZW50ID0gZnVuY3Rpb24oY29uZmlndXJhdGlvbil7XG5cdFx0ZXh0ZW5kKHRoaXMsY29uZmlndXJhdGlvbik7XG5cdFx0dGhpcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsYXJndW1lbnRzKTtcblx0XHR0aGlzLnNhdmUoKTtcblx0fTtcblx0ZXh0ZW5kKENoYXJ0LkVsZW1lbnQucHJvdG90eXBlLHtcblx0XHRpbml0aWFsaXplIDogZnVuY3Rpb24oKXt9LFxuXHRcdHJlc3RvcmUgOiBmdW5jdGlvbihwcm9wcyl7XG5cdFx0XHRpZiAoIXByb3BzKXtcblx0XHRcdFx0ZXh0ZW5kKHRoaXMsdGhpcy5fc2F2ZWQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWFjaChwcm9wcyxmdW5jdGlvbihrZXkpe1xuXHRcdFx0XHRcdHRoaXNba2V5XSA9IHRoaXMuX3NhdmVkW2tleV07XG5cdFx0XHRcdH0sdGhpcyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXHRcdHNhdmUgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5fc2F2ZWQgPSBjbG9uZSh0aGlzKTtcblx0XHRcdGRlbGV0ZSB0aGlzLl9zYXZlZC5fc2F2ZWQ7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXHRcdHVwZGF0ZSA6IGZ1bmN0aW9uKG5ld1Byb3BzKXtcblx0XHRcdGVhY2gobmV3UHJvcHMsZnVuY3Rpb24odmFsdWUsa2V5KXtcblx0XHRcdFx0dGhpcy5fc2F2ZWRba2V5XSA9IHRoaXNba2V5XTtcblx0XHRcdFx0dGhpc1trZXldID0gdmFsdWU7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHR0cmFuc2l0aW9uIDogZnVuY3Rpb24ocHJvcHMsZWFzZSl7XG5cdFx0XHRlYWNoKHByb3BzLGZ1bmN0aW9uKHZhbHVlLGtleSl7XG5cdFx0XHRcdHRoaXNba2V5XSA9ICgodmFsdWUgLSB0aGlzLl9zYXZlZFtrZXldKSAqIGVhc2UpICsgdGhpcy5fc2F2ZWRba2V5XTtcblx0XHRcdH0sdGhpcyk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXHRcdHRvb2x0aXBQb3NpdGlvbiA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR4IDogdGhpcy54LFxuXHRcdFx0XHR5IDogdGhpcy55XG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0aGFzVmFsdWU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gaXNOdW1iZXIodGhpcy52YWx1ZSk7XG5cdFx0fVxuXHR9KTtcblxuXHRDaGFydC5FbGVtZW50LmV4dGVuZCA9IGluaGVyaXRzO1xuXG5cblx0Q2hhcnQuUG9pbnQgPSBDaGFydC5FbGVtZW50LmV4dGVuZCh7XG5cdFx0ZGlzcGxheTogdHJ1ZSxcblx0XHRpblJhbmdlOiBmdW5jdGlvbihjaGFydFgsY2hhcnRZKXtcblx0XHRcdHZhciBoaXREZXRlY3Rpb25SYW5nZSA9IHRoaXMuaGl0RGV0ZWN0aW9uUmFkaXVzICsgdGhpcy5yYWRpdXM7XG5cdFx0XHRyZXR1cm4gKChNYXRoLnBvdyhjaGFydFgtdGhpcy54LCAyKStNYXRoLnBvdyhjaGFydFktdGhpcy55LCAyKSkgPCBNYXRoLnBvdyhoaXREZXRlY3Rpb25SYW5nZSwyKSk7XG5cdFx0fSxcblx0XHRkcmF3IDogZnVuY3Rpb24oKXtcblx0XHRcdGlmICh0aGlzLmRpc3BsYXkpe1xuXHRcdFx0XHR2YXIgY3R4ID0gdGhpcy5jdHg7XG5cdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblxuXHRcdFx0XHRjdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cywgMCwgTWF0aC5QSSoyKTtcblx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXG5cdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuc3Ryb2tlQ29sb3I7XG5cdFx0XHRcdGN0eC5saW5lV2lkdGggPSB0aGlzLnN0cm9rZVdpZHRoO1xuXG5cdFx0XHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLmZpbGxDb2xvcjtcblxuXHRcdFx0XHRjdHguZmlsbCgpO1xuXHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHR9XG5cblxuXHRcdFx0Ly9RdWljayBkZWJ1ZyBmb3IgYmV6aWVyIGN1cnZlIHNwbGluaW5nXG5cdFx0XHQvL0hpZ2hsaWdodHMgY29udHJvbCBwb2ludHMgYW5kIHRoZSBsaW5lIGJldHdlZW4gdGhlbS5cblx0XHRcdC8vSGFuZHkgZm9yIGRldiAtIHN0cmlwcGVkIGluIHRoZSBtaW4gdmVyc2lvbi5cblxuXHRcdFx0Ly8gY3R4LnNhdmUoKTtcblx0XHRcdC8vIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XG5cdFx0XHQvLyBjdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCJcblx0XHRcdC8vIGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdC8vIGN0eC5hcmModGhpcy5jb250cm9sUG9pbnRzLmlubmVyLngsdGhpcy5jb250cm9sUG9pbnRzLmlubmVyLnksIDIsIDAsIE1hdGguUEkqMik7XG5cdFx0XHQvLyBjdHguZmlsbCgpO1xuXG5cdFx0XHQvLyBjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHQvLyBjdHguYXJjKHRoaXMuY29udHJvbFBvaW50cy5vdXRlci54LHRoaXMuY29udHJvbFBvaW50cy5vdXRlci55LCAyLCAwLCBNYXRoLlBJKjIpO1xuXHRcdFx0Ly8gY3R4LmZpbGwoKTtcblxuXHRcdFx0Ly8gY3R4Lm1vdmVUbyh0aGlzLmNvbnRyb2xQb2ludHMuaW5uZXIueCx0aGlzLmNvbnRyb2xQb2ludHMuaW5uZXIueSk7XG5cdFx0XHQvLyBjdHgubGluZVRvKHRoaXMueCwgdGhpcy55KTtcblx0XHRcdC8vIGN0eC5saW5lVG8odGhpcy5jb250cm9sUG9pbnRzLm91dGVyLngsdGhpcy5jb250cm9sUG9pbnRzLm91dGVyLnkpO1xuXHRcdFx0Ly8gY3R4LnN0cm9rZSgpO1xuXG5cdFx0XHQvLyBjdHgucmVzdG9yZSgpO1xuXG5cblxuXHRcdH1cblx0fSk7XG5cblx0Q2hhcnQuQXJjID0gQ2hhcnQuRWxlbWVudC5leHRlbmQoe1xuXHRcdGluUmFuZ2UgOiBmdW5jdGlvbihjaGFydFgsY2hhcnRZKXtcblxuXHRcdFx0dmFyIHBvaW50UmVsYXRpdmVQb3NpdGlvbiA9IGhlbHBlcnMuZ2V0QW5nbGVGcm9tUG9pbnQodGhpcywge1xuXHRcdFx0XHR4OiBjaGFydFgsXG5cdFx0XHRcdHk6IGNoYXJ0WVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vQ2hlY2sgaWYgd2l0aGluIHRoZSByYW5nZSBvZiB0aGUgb3Blbi9jbG9zZSBhbmdsZVxuXHRcdFx0dmFyIGJldHdlZW5BbmdsZXMgPSAocG9pbnRSZWxhdGl2ZVBvc2l0aW9uLmFuZ2xlID49IHRoaXMuc3RhcnRBbmdsZSAmJiBwb2ludFJlbGF0aXZlUG9zaXRpb24uYW5nbGUgPD0gdGhpcy5lbmRBbmdsZSksXG5cdFx0XHRcdHdpdGhpblJhZGl1cyA9IChwb2ludFJlbGF0aXZlUG9zaXRpb24uZGlzdGFuY2UgPj0gdGhpcy5pbm5lclJhZGl1cyAmJiBwb2ludFJlbGF0aXZlUG9zaXRpb24uZGlzdGFuY2UgPD0gdGhpcy5vdXRlclJhZGl1cyk7XG5cblx0XHRcdHJldHVybiAoYmV0d2VlbkFuZ2xlcyAmJiB3aXRoaW5SYWRpdXMpO1xuXHRcdFx0Ly9FbnN1cmUgd2l0aGluIHRoZSBvdXRzaWRlIG9mIHRoZSBhcmMgY2VudHJlLCBidXQgaW5zaWRlIGFyYyBvdXRlclxuXHRcdH0sXG5cdFx0dG9vbHRpcFBvc2l0aW9uIDogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBjZW50cmVBbmdsZSA9IHRoaXMuc3RhcnRBbmdsZSArICgodGhpcy5lbmRBbmdsZSAtIHRoaXMuc3RhcnRBbmdsZSkgLyAyKSxcblx0XHRcdFx0cmFuZ2VGcm9tQ2VudHJlID0gKHRoaXMub3V0ZXJSYWRpdXMgLSB0aGlzLmlubmVyUmFkaXVzKSAvIDIgKyB0aGlzLmlubmVyUmFkaXVzO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0eCA6IHRoaXMueCArIChNYXRoLmNvcyhjZW50cmVBbmdsZSkgKiByYW5nZUZyb21DZW50cmUpLFxuXHRcdFx0XHR5IDogdGhpcy55ICsgKE1hdGguc2luKGNlbnRyZUFuZ2xlKSAqIHJhbmdlRnJvbUNlbnRyZSlcblx0XHRcdH07XG5cdFx0fSxcblx0XHRkcmF3IDogZnVuY3Rpb24oYW5pbWF0aW9uUGVyY2VudCl7XG5cblx0XHRcdHZhciBlYXNpbmdEZWNpbWFsID0gYW5pbWF0aW9uUGVyY2VudCB8fCAxO1xuXG5cdFx0XHR2YXIgY3R4ID0gdGhpcy5jdHg7XG5cblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblxuXHRcdFx0Y3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5vdXRlclJhZGl1cywgdGhpcy5zdGFydEFuZ2xlLCB0aGlzLmVuZEFuZ2xlKTtcblxuXHRcdFx0Y3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5pbm5lclJhZGl1cywgdGhpcy5lbmRBbmdsZSwgdGhpcy5zdGFydEFuZ2xlLCB0cnVlKTtcblxuXHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gdGhpcy5zdHJva2VDb2xvcjtcblx0XHRcdGN0eC5saW5lV2lkdGggPSB0aGlzLnN0cm9rZVdpZHRoO1xuXG5cdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy5maWxsQ29sb3I7XG5cblx0XHRcdGN0eC5maWxsKCk7XG5cdFx0XHRjdHgubGluZUpvaW4gPSAnYmV2ZWwnO1xuXG5cdFx0XHRpZiAodGhpcy5zaG93U3Ryb2tlKXtcblx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0Q2hhcnQuUmVjdGFuZ2xlID0gQ2hhcnQuRWxlbWVudC5leHRlbmQoe1xuXHRcdGRyYXcgOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIGN0eCA9IHRoaXMuY3R4LFxuXHRcdFx0XHRoYWxmV2lkdGggPSB0aGlzLndpZHRoLzIsXG5cdFx0XHRcdGxlZnRYID0gdGhpcy54IC0gaGFsZldpZHRoLFxuXHRcdFx0XHRyaWdodFggPSB0aGlzLnggKyBoYWxmV2lkdGgsXG5cdFx0XHRcdHRvcCA9IHRoaXMuYmFzZSAtICh0aGlzLmJhc2UgLSB0aGlzLnkpLFxuXHRcdFx0XHRoYWxmU3Ryb2tlID0gdGhpcy5zdHJva2VXaWR0aCAvIDI7XG5cblx0XHRcdC8vIENhbnZhcyBkb2Vzbid0IGFsbG93IHVzIHRvIHN0cm9rZSBpbnNpZGUgdGhlIHdpZHRoIHNvIHdlIGNhblxuXHRcdFx0Ly8gYWRqdXN0IHRoZSBzaXplcyB0byBmaXQgaWYgd2UncmUgc2V0dGluZyBhIHN0cm9rZSBvbiB0aGUgbGluZVxuXHRcdFx0aWYgKHRoaXMuc2hvd1N0cm9rZSl7XG5cdFx0XHRcdGxlZnRYICs9IGhhbGZTdHJva2U7XG5cdFx0XHRcdHJpZ2h0WCAtPSBoYWxmU3Ryb2tlO1xuXHRcdFx0XHR0b3AgKz0gaGFsZlN0cm9rZTtcblx0XHRcdH1cblxuXHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXG5cdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy5maWxsQ29sb3I7XG5cdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnN0cm9rZUNvbG9yO1xuXHRcdFx0Y3R4LmxpbmVXaWR0aCA9IHRoaXMuc3Ryb2tlV2lkdGg7XG5cblx0XHRcdC8vIEl0J2QgYmUgbmljZSB0byBrZWVwIHRoaXMgY2xhc3MgdG90YWxseSBnZW5lcmljIHRvIGFueSByZWN0YW5nbGVcblx0XHRcdC8vIGFuZCBzaW1wbHkgc3BlY2lmeSB3aGljaCBib3JkZXIgdG8gbWlzcyBvdXQuXG5cdFx0XHRjdHgubW92ZVRvKGxlZnRYLCB0aGlzLmJhc2UpO1xuXHRcdFx0Y3R4LmxpbmVUbyhsZWZ0WCwgdG9wKTtcblx0XHRcdGN0eC5saW5lVG8ocmlnaHRYLCB0b3ApO1xuXHRcdFx0Y3R4LmxpbmVUbyhyaWdodFgsIHRoaXMuYmFzZSk7XG5cdFx0XHRjdHguZmlsbCgpO1xuXHRcdFx0aWYgKHRoaXMuc2hvd1N0cm9rZSl7XG5cdFx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGhlaWdodCA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGhpcy5iYXNlIC0gdGhpcy55O1xuXHRcdH0sXG5cdFx0aW5SYW5nZSA6IGZ1bmN0aW9uKGNoYXJ0WCxjaGFydFkpe1xuXHRcdFx0cmV0dXJuIChjaGFydFggPj0gdGhpcy54IC0gdGhpcy53aWR0aC8yICYmIGNoYXJ0WCA8PSB0aGlzLnggKyB0aGlzLndpZHRoLzIpICYmIChjaGFydFkgPj0gdGhpcy55ICYmIGNoYXJ0WSA8PSB0aGlzLmJhc2UpO1xuXHRcdH1cblx0fSk7XG5cblx0Q2hhcnQuVG9vbHRpcCA9IENoYXJ0LkVsZW1lbnQuZXh0ZW5kKHtcblx0XHRkcmF3IDogZnVuY3Rpb24oKXtcblxuXHRcdFx0dmFyIGN0eCA9IHRoaXMuY2hhcnQuY3R4O1xuXG5cdFx0XHRjdHguZm9udCA9IGZvbnRTdHJpbmcodGhpcy5mb250U2l6ZSx0aGlzLmZvbnRTdHlsZSx0aGlzLmZvbnRGYW1pbHkpO1xuXG5cdFx0XHR0aGlzLnhBbGlnbiA9IFwiY2VudGVyXCI7XG5cdFx0XHR0aGlzLnlBbGlnbiA9IFwiYWJvdmVcIjtcblxuXHRcdFx0Ly9EaXN0YW5jZSBiZXR3ZWVuIHRoZSBhY3R1YWwgZWxlbWVudC55IHBvc2l0aW9uIGFuZCB0aGUgc3RhcnQgb2YgdGhlIHRvb2x0aXAgY2FyZXRcblx0XHRcdHZhciBjYXJldFBhZGRpbmcgPSB0aGlzLmNhcmV0UGFkZGluZyA9IDI7XG5cblx0XHRcdHZhciB0b29sdGlwV2lkdGggPSBjdHgubWVhc3VyZVRleHQodGhpcy50ZXh0KS53aWR0aCArIDIqdGhpcy54UGFkZGluZyxcblx0XHRcdFx0dG9vbHRpcFJlY3RIZWlnaHQgPSB0aGlzLmZvbnRTaXplICsgMip0aGlzLnlQYWRkaW5nLFxuXHRcdFx0XHR0b29sdGlwSGVpZ2h0ID0gdG9vbHRpcFJlY3RIZWlnaHQgKyB0aGlzLmNhcmV0SGVpZ2h0ICsgY2FyZXRQYWRkaW5nO1xuXG5cdFx0XHRpZiAodGhpcy54ICsgdG9vbHRpcFdpZHRoLzIgPnRoaXMuY2hhcnQud2lkdGgpe1xuXHRcdFx0XHR0aGlzLnhBbGlnbiA9IFwibGVmdFwiO1xuXHRcdFx0fSBlbHNlIGlmICh0aGlzLnggLSB0b29sdGlwV2lkdGgvMiA8IDApe1xuXHRcdFx0XHR0aGlzLnhBbGlnbiA9IFwicmlnaHRcIjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMueSAtIHRvb2x0aXBIZWlnaHQgPCAwKXtcblx0XHRcdFx0dGhpcy55QWxpZ24gPSBcImJlbG93XCI7XG5cdFx0XHR9XG5cblxuXHRcdFx0dmFyIHRvb2x0aXBYID0gdGhpcy54IC0gdG9vbHRpcFdpZHRoLzIsXG5cdFx0XHRcdHRvb2x0aXBZID0gdGhpcy55IC0gdG9vbHRpcEhlaWdodDtcblxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlsbENvbG9yO1xuXG5cdFx0XHQvLyBDdXN0b20gVG9vbHRpcHNcblx0XHRcdGlmKHRoaXMuY3VzdG9tKXtcblx0XHRcdFx0dGhpcy5jdXN0b20odGhpcyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRzd2l0Y2godGhpcy55QWxpZ24pXG5cdFx0XHRcdHtcblx0XHRcdFx0Y2FzZSBcImFib3ZlXCI6XG5cdFx0XHRcdFx0Ly9EcmF3IGEgY2FyZXQgYWJvdmUgdGhlIHgveVxuXHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHRjdHgubW92ZVRvKHRoaXMueCx0aGlzLnkgLSBjYXJldFBhZGRpbmcpO1xuXHRcdFx0XHRcdGN0eC5saW5lVG8odGhpcy54ICsgdGhpcy5jYXJldEhlaWdodCwgdGhpcy55IC0gKGNhcmV0UGFkZGluZyArIHRoaXMuY2FyZXRIZWlnaHQpKTtcblx0XHRcdFx0XHRjdHgubGluZVRvKHRoaXMueCAtIHRoaXMuY2FyZXRIZWlnaHQsIHRoaXMueSAtIChjYXJldFBhZGRpbmcgKyB0aGlzLmNhcmV0SGVpZ2h0KSk7XG5cdFx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdFx0XHRcdGN0eC5maWxsKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJiZWxvd1wiOlxuXHRcdFx0XHRcdHRvb2x0aXBZID0gdGhpcy55ICsgY2FyZXRQYWRkaW5nICsgdGhpcy5jYXJldEhlaWdodDtcblx0XHRcdFx0XHQvL0RyYXcgYSBjYXJldCBiZWxvdyB0aGUgeC95XG5cdFx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRcdGN0eC5tb3ZlVG8odGhpcy54LCB0aGlzLnkgKyBjYXJldFBhZGRpbmcpO1xuXHRcdFx0XHRcdGN0eC5saW5lVG8odGhpcy54ICsgdGhpcy5jYXJldEhlaWdodCwgdGhpcy55ICsgY2FyZXRQYWRkaW5nICsgdGhpcy5jYXJldEhlaWdodCk7XG5cdFx0XHRcdFx0Y3R4LmxpbmVUbyh0aGlzLnggLSB0aGlzLmNhcmV0SGVpZ2h0LCB0aGlzLnkgKyBjYXJldFBhZGRpbmcgKyB0aGlzLmNhcmV0SGVpZ2h0KTtcblx0XHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHN3aXRjaCh0aGlzLnhBbGlnbilcblx0XHRcdFx0e1xuXHRcdFx0XHRjYXNlIFwibGVmdFwiOlxuXHRcdFx0XHRcdHRvb2x0aXBYID0gdGhpcy54IC0gdG9vbHRpcFdpZHRoICsgKHRoaXMuY29ybmVyUmFkaXVzICsgdGhpcy5jYXJldEhlaWdodCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJyaWdodFwiOlxuXHRcdFx0XHRcdHRvb2x0aXBYID0gdGhpcy54IC0gKHRoaXMuY29ybmVyUmFkaXVzICsgdGhpcy5jYXJldEhlaWdodCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkcmF3Um91bmRlZFJlY3RhbmdsZShjdHgsdG9vbHRpcFgsdG9vbHRpcFksdG9vbHRpcFdpZHRoLHRvb2x0aXBSZWN0SGVpZ2h0LHRoaXMuY29ybmVyUmFkaXVzKTtcblxuXHRcdFx0XHRjdHguZmlsbCgpO1xuXG5cdFx0XHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLnRleHRDb2xvcjtcblx0XHRcdFx0Y3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG5cdFx0XHRcdGN0eC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xuXHRcdFx0XHRjdHguZmlsbFRleHQodGhpcy50ZXh0LCB0b29sdGlwWCArIHRvb2x0aXBXaWR0aC8yLCB0b29sdGlwWSArIHRvb2x0aXBSZWN0SGVpZ2h0LzIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0Q2hhcnQuTXVsdGlUb29sdGlwID0gQ2hhcnQuRWxlbWVudC5leHRlbmQoe1xuXHRcdGluaXRpYWxpemUgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5mb250ID0gZm9udFN0cmluZyh0aGlzLmZvbnRTaXplLHRoaXMuZm9udFN0eWxlLHRoaXMuZm9udEZhbWlseSk7XG5cblx0XHRcdHRoaXMudGl0bGVGb250ID0gZm9udFN0cmluZyh0aGlzLnRpdGxlRm9udFNpemUsdGhpcy50aXRsZUZvbnRTdHlsZSx0aGlzLnRpdGxlRm9udEZhbWlseSk7XG5cblx0XHRcdHRoaXMuaGVpZ2h0ID0gKHRoaXMubGFiZWxzLmxlbmd0aCAqIHRoaXMuZm9udFNpemUpICsgKCh0aGlzLmxhYmVscy5sZW5ndGgtMSkgKiAodGhpcy5mb250U2l6ZS8yKSkgKyAodGhpcy55UGFkZGluZyoyKSArIHRoaXMudGl0bGVGb250U2l6ZSAqMS41O1xuXG5cdFx0XHR0aGlzLmN0eC5mb250ID0gdGhpcy50aXRsZUZvbnQ7XG5cblx0XHRcdHZhciB0aXRsZVdpZHRoID0gdGhpcy5jdHgubWVhc3VyZVRleHQodGhpcy50aXRsZSkud2lkdGgsXG5cdFx0XHRcdC8vTGFiZWwgaGFzIGEgbGVnZW5kIHNxdWFyZSBhcyB3ZWxsIHNvIGFjY291bnQgZm9yIHRoaXMuXG5cdFx0XHRcdGxhYmVsV2lkdGggPSBsb25nZXN0VGV4dCh0aGlzLmN0eCx0aGlzLmZvbnQsdGhpcy5sYWJlbHMpICsgdGhpcy5mb250U2l6ZSArIDMsXG5cdFx0XHRcdGxvbmdlc3RUZXh0V2lkdGggPSBtYXgoW2xhYmVsV2lkdGgsdGl0bGVXaWR0aF0pO1xuXG5cdFx0XHR0aGlzLndpZHRoID0gbG9uZ2VzdFRleHRXaWR0aCArICh0aGlzLnhQYWRkaW5nKjIpO1xuXG5cblx0XHRcdHZhciBoYWxmSGVpZ2h0ID0gdGhpcy5oZWlnaHQvMjtcblxuXHRcdFx0Ly9DaGVjayB0byBlbnN1cmUgdGhlIGhlaWdodCB3aWxsIGZpdCBvbiB0aGUgY2FudmFzXG5cdFx0XHRpZiAodGhpcy55IC0gaGFsZkhlaWdodCA8IDAgKXtcblx0XHRcdFx0dGhpcy55ID0gaGFsZkhlaWdodDtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy55ICsgaGFsZkhlaWdodCA+IHRoaXMuY2hhcnQuaGVpZ2h0KXtcblx0XHRcdFx0dGhpcy55ID0gdGhpcy5jaGFydC5oZWlnaHQgLSBoYWxmSGVpZ2h0O1xuXHRcdFx0fVxuXG5cdFx0XHQvL0RlY2lkZSB3aGV0aGVyIHRvIGFsaWduIGxlZnQgb3IgcmlnaHQgYmFzZWQgb24gcG9zaXRpb24gb24gY2FudmFzXG5cdFx0XHRpZiAodGhpcy54ID4gdGhpcy5jaGFydC53aWR0aC8yKXtcblx0XHRcdFx0dGhpcy54IC09IHRoaXMueE9mZnNldCArIHRoaXMud2lkdGg7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnggKz0gdGhpcy54T2Zmc2V0O1xuXHRcdFx0fVxuXG5cblx0XHR9LFxuXHRcdGdldExpbmVIZWlnaHQgOiBmdW5jdGlvbihpbmRleCl7XG5cdFx0XHR2YXIgYmFzZUxpbmVIZWlnaHQgPSB0aGlzLnkgLSAodGhpcy5oZWlnaHQvMikgKyB0aGlzLnlQYWRkaW5nLFxuXHRcdFx0XHRhZnRlclRpdGxlSW5kZXggPSBpbmRleC0xO1xuXG5cdFx0XHQvL0lmIHRoZSBpbmRleCBpcyB6ZXJvLCB3ZSdyZSBnZXR0aW5nIHRoZSB0aXRsZVxuXHRcdFx0aWYgKGluZGV4ID09PSAwKXtcblx0XHRcdFx0cmV0dXJuIGJhc2VMaW5lSGVpZ2h0ICsgdGhpcy50aXRsZUZvbnRTaXplLzI7XG5cdFx0XHR9IGVsc2V7XG5cdFx0XHRcdHJldHVybiBiYXNlTGluZUhlaWdodCArICgodGhpcy5mb250U2l6ZSoxLjUqYWZ0ZXJUaXRsZUluZGV4KSArIHRoaXMuZm9udFNpemUvMikgKyB0aGlzLnRpdGxlRm9udFNpemUgKiAxLjU7XG5cdFx0XHR9XG5cblx0XHR9LFxuXHRcdGRyYXcgOiBmdW5jdGlvbigpe1xuXHRcdFx0Ly8gQ3VzdG9tIFRvb2x0aXBzXG5cdFx0XHRpZih0aGlzLmN1c3RvbSl7XG5cdFx0XHRcdHRoaXMuY3VzdG9tKHRoaXMpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0ZHJhd1JvdW5kZWRSZWN0YW5nbGUodGhpcy5jdHgsdGhpcy54LHRoaXMueSAtIHRoaXMuaGVpZ2h0LzIsdGhpcy53aWR0aCx0aGlzLmhlaWdodCx0aGlzLmNvcm5lclJhZGl1cyk7XG5cdFx0XHRcdHZhciBjdHggPSB0aGlzLmN0eDtcblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlsbENvbG9yO1xuXHRcdFx0XHRjdHguZmlsbCgpO1xuXHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cblx0XHRcdFx0Y3R4LnRleHRBbGlnbiA9IFwibGVmdFwiO1xuXHRcdFx0XHRjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMudGl0bGVUZXh0Q29sb3I7XG5cdFx0XHRcdGN0eC5mb250ID0gdGhpcy50aXRsZUZvbnQ7XG5cblx0XHRcdFx0Y3R4LmZpbGxUZXh0KHRoaXMudGl0bGUsdGhpcy54ICsgdGhpcy54UGFkZGluZywgdGhpcy5nZXRMaW5lSGVpZ2h0KDApKTtcblxuXHRcdFx0XHRjdHguZm9udCA9IHRoaXMuZm9udDtcblx0XHRcdFx0aGVscGVycy5lYWNoKHRoaXMubGFiZWxzLGZ1bmN0aW9uKGxhYmVsLGluZGV4KXtcblx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy50ZXh0Q29sb3I7XG5cdFx0XHRcdFx0Y3R4LmZpbGxUZXh0KGxhYmVsLHRoaXMueCArIHRoaXMueFBhZGRpbmcgKyB0aGlzLmZvbnRTaXplICsgMywgdGhpcy5nZXRMaW5lSGVpZ2h0KGluZGV4ICsgMSkpO1xuXG5cdFx0XHRcdFx0Ly9BIGJpdCBnbmFybHksIGJ1dCBjbGVhcmluZyB0aGlzIHJlY3RhbmdsZSBicmVha3Mgd2hlbiB1c2luZyBleHBsb3JlcmNhbnZhcyAoY2xlYXJzIHdob2xlIGNhbnZhcylcblx0XHRcdFx0XHQvL2N0eC5jbGVhclJlY3QodGhpcy54ICsgdGhpcy54UGFkZGluZywgdGhpcy5nZXRMaW5lSGVpZ2h0KGluZGV4ICsgMSkgLSB0aGlzLmZvbnRTaXplLzIsIHRoaXMuZm9udFNpemUsIHRoaXMuZm9udFNpemUpO1xuXHRcdFx0XHRcdC8vSW5zdGVhZCB3ZSdsbCBtYWtlIGEgd2hpdGUgZmlsbGVkIGJsb2NrIHRvIHB1dCB0aGUgbGVnZW5kQ29sb3VyIHBhbGV0dGUgb3Zlci5cblxuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLmxlZ2VuZENvbG9yQmFja2dyb3VuZDtcblx0XHRcdFx0XHRjdHguZmlsbFJlY3QodGhpcy54ICsgdGhpcy54UGFkZGluZywgdGhpcy5nZXRMaW5lSGVpZ2h0KGluZGV4ICsgMSkgLSB0aGlzLmZvbnRTaXplLzIsIHRoaXMuZm9udFNpemUsIHRoaXMuZm9udFNpemUpO1xuXG5cdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMubGVnZW5kQ29sb3JzW2luZGV4XS5maWxsO1xuXHRcdFx0XHRcdGN0eC5maWxsUmVjdCh0aGlzLnggKyB0aGlzLnhQYWRkaW5nLCB0aGlzLmdldExpbmVIZWlnaHQoaW5kZXggKyAxKSAtIHRoaXMuZm9udFNpemUvMiwgdGhpcy5mb250U2l6ZSwgdGhpcy5mb250U2l6ZSk7XG5cblxuXHRcdFx0XHR9LHRoaXMpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0Q2hhcnQuU2NhbGUgPSBDaGFydC5FbGVtZW50LmV4dGVuZCh7XG5cdFx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLmZpdCgpO1xuXHRcdH0sXG5cdFx0YnVpbGRZTGFiZWxzIDogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMueUxhYmVscyA9IFtdO1xuXG5cdFx0XHR2YXIgc3RlcERlY2ltYWxQbGFjZXMgPSBnZXREZWNpbWFsUGxhY2VzKHRoaXMuc3RlcFZhbHVlKTtcblxuXHRcdFx0Zm9yICh2YXIgaT0wOyBpPD10aGlzLnN0ZXBzOyBpKyspe1xuXHRcdFx0XHR0aGlzLnlMYWJlbHMucHVzaCh0ZW1wbGF0ZSh0aGlzLnRlbXBsYXRlU3RyaW5nLHt2YWx1ZToodGhpcy5taW4gKyAoaSAqIHRoaXMuc3RlcFZhbHVlKSkudG9GaXhlZChzdGVwRGVjaW1hbFBsYWNlcyl9KSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnlMYWJlbFdpZHRoID0gKHRoaXMuZGlzcGxheSAmJiB0aGlzLnNob3dMYWJlbHMpID8gbG9uZ2VzdFRleHQodGhpcy5jdHgsdGhpcy5mb250LHRoaXMueUxhYmVscykgOiAwO1xuXHRcdH0sXG5cdFx0YWRkWExhYmVsIDogZnVuY3Rpb24obGFiZWwpe1xuXHRcdFx0dGhpcy54TGFiZWxzLnB1c2gobGFiZWwpO1xuXHRcdFx0dGhpcy52YWx1ZXNDb3VudCsrO1xuXHRcdFx0dGhpcy5maXQoKTtcblx0XHR9LFxuXHRcdHJlbW92ZVhMYWJlbCA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLnhMYWJlbHMuc2hpZnQoKTtcblx0XHRcdHRoaXMudmFsdWVzQ291bnQtLTtcblx0XHRcdHRoaXMuZml0KCk7XG5cdFx0fSxcblx0XHQvLyBGaXR0aW5nIGxvb3AgdG8gcm90YXRlIHggTGFiZWxzIGFuZCBmaWd1cmUgb3V0IHdoYXQgZml0cyB0aGVyZSwgYW5kIGFsc28gY2FsY3VsYXRlIGhvdyBtYW55IFkgc3RlcHMgdG8gdXNlXG5cdFx0Zml0OiBmdW5jdGlvbigpe1xuXHRcdFx0Ly8gRmlyc3Qgd2UgbmVlZCB0aGUgd2lkdGggb2YgdGhlIHlMYWJlbHMsIGFzc3VtaW5nIHRoZSB4TGFiZWxzIGFyZW4ndCByb3RhdGVkXG5cblx0XHRcdC8vIFRvIGRvIHRoYXQgd2UgbmVlZCB0aGUgYmFzZSBsaW5lIGF0IHRoZSB0b3AgYW5kIGJhc2Ugb2YgdGhlIGNoYXJ0LCBhc3N1bWluZyB0aGVyZSBpcyBubyB4IGxhYmVsIHJvdGF0aW9uXG5cdFx0XHR0aGlzLnN0YXJ0UG9pbnQgPSAodGhpcy5kaXNwbGF5KSA/IHRoaXMuZm9udFNpemUgOiAwO1xuXHRcdFx0dGhpcy5lbmRQb2ludCA9ICh0aGlzLmRpc3BsYXkpID8gdGhpcy5oZWlnaHQgLSAodGhpcy5mb250U2l6ZSAqIDEuNSkgLSA1IDogdGhpcy5oZWlnaHQ7IC8vIC01IHRvIHBhZCBsYWJlbHNcblxuXHRcdFx0Ly8gQXBwbHkgcGFkZGluZyBzZXR0aW5ncyB0byB0aGUgc3RhcnQgYW5kIGVuZCBwb2ludC5cblx0XHRcdHRoaXMuc3RhcnRQb2ludCArPSB0aGlzLnBhZGRpbmc7XG5cdFx0XHR0aGlzLmVuZFBvaW50IC09IHRoaXMucGFkZGluZztcblxuXHRcdFx0Ly8gQ2FjaGUgdGhlIHN0YXJ0aW5nIGhlaWdodCwgc28gY2FuIGRldGVybWluZSBpZiB3ZSBuZWVkIHRvIHJlY2FsY3VsYXRlIHRoZSBzY2FsZSB5QXhpc1xuXHRcdFx0dmFyIGNhY2hlZEhlaWdodCA9IHRoaXMuZW5kUG9pbnQgLSB0aGlzLnN0YXJ0UG9pbnQsXG5cdFx0XHRcdGNhY2hlZFlMYWJlbFdpZHRoO1xuXG5cdFx0XHQvLyBCdWlsZCB0aGUgY3VycmVudCB5TGFiZWxzIHNvIHdlIGhhdmUgYW4gaWRlYSBvZiB3aGF0IHNpemUgdGhleSdsbCBiZSB0byBzdGFydFxuXHRcdFx0Lypcblx0XHRcdCAqXHRUaGlzIHNldHMgd2hhdCBpcyByZXR1cm5lZCBmcm9tIGNhbGN1bGF0ZVNjYWxlUmFuZ2UgYXMgc3RhdGljIHByb3BlcnRpZXMgb2YgdGhpcyBjbGFzczpcblx0XHRcdCAqXG5cdFx0XHRcdHRoaXMuc3RlcHM7XG5cdFx0XHRcdHRoaXMuc3RlcFZhbHVlO1xuXHRcdFx0XHR0aGlzLm1pbjtcblx0XHRcdFx0dGhpcy5tYXg7XG5cdFx0XHQgKlxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLmNhbGN1bGF0ZVlSYW5nZShjYWNoZWRIZWlnaHQpO1xuXG5cdFx0XHQvLyBXaXRoIHRoZXNlIHByb3BlcnRpZXMgc2V0IHdlIGNhbiBub3cgYnVpbGQgdGhlIGFycmF5IG9mIHlMYWJlbHNcblx0XHRcdC8vIGFuZCBhbHNvIHRoZSB3aWR0aCBvZiB0aGUgbGFyZ2VzdCB5TGFiZWxcblx0XHRcdHRoaXMuYnVpbGRZTGFiZWxzKCk7XG5cblx0XHRcdHRoaXMuY2FsY3VsYXRlWExhYmVsUm90YXRpb24oKTtcblxuXHRcdFx0d2hpbGUoKGNhY2hlZEhlaWdodCA+IHRoaXMuZW5kUG9pbnQgLSB0aGlzLnN0YXJ0UG9pbnQpKXtcblx0XHRcdFx0Y2FjaGVkSGVpZ2h0ID0gdGhpcy5lbmRQb2ludCAtIHRoaXMuc3RhcnRQb2ludDtcblx0XHRcdFx0Y2FjaGVkWUxhYmVsV2lkdGggPSB0aGlzLnlMYWJlbFdpZHRoO1xuXG5cdFx0XHRcdHRoaXMuY2FsY3VsYXRlWVJhbmdlKGNhY2hlZEhlaWdodCk7XG5cdFx0XHRcdHRoaXMuYnVpbGRZTGFiZWxzKCk7XG5cblx0XHRcdFx0Ly8gT25seSBnbyB0aHJvdWdoIHRoZSB4TGFiZWwgbG9vcCBhZ2FpbiBpZiB0aGUgeUxhYmVsIHdpZHRoIGhhcyBjaGFuZ2VkXG5cdFx0XHRcdGlmIChjYWNoZWRZTGFiZWxXaWR0aCA8IHRoaXMueUxhYmVsV2lkdGgpe1xuXHRcdFx0XHRcdHRoaXMuY2FsY3VsYXRlWExhYmVsUm90YXRpb24oKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0fSxcblx0XHRjYWxjdWxhdGVYTGFiZWxSb3RhdGlvbiA6IGZ1bmN0aW9uKCl7XG5cdFx0XHQvL0dldCB0aGUgd2lkdGggb2YgZWFjaCBncmlkIGJ5IGNhbGN1bGF0aW5nIHRoZSBkaWZmZXJlbmNlXG5cdFx0XHQvL2JldHdlZW4geCBvZmZzZXRzIGJldHdlZW4gMCBhbmQgMS5cblxuXHRcdFx0dGhpcy5jdHguZm9udCA9IHRoaXMuZm9udDtcblxuXHRcdFx0dmFyIGZpcnN0V2lkdGggPSB0aGlzLmN0eC5tZWFzdXJlVGV4dCh0aGlzLnhMYWJlbHNbMF0pLndpZHRoLFxuXHRcdFx0XHRsYXN0V2lkdGggPSB0aGlzLmN0eC5tZWFzdXJlVGV4dCh0aGlzLnhMYWJlbHNbdGhpcy54TGFiZWxzLmxlbmd0aCAtIDFdKS53aWR0aCxcblx0XHRcdFx0Zmlyc3RSb3RhdGVkLFxuXHRcdFx0XHRsYXN0Um90YXRlZDtcblxuXG5cdFx0XHR0aGlzLnhTY2FsZVBhZGRpbmdSaWdodCA9IGxhc3RXaWR0aC8yICsgMztcblx0XHRcdHRoaXMueFNjYWxlUGFkZGluZ0xlZnQgPSAoZmlyc3RXaWR0aC8yID4gdGhpcy55TGFiZWxXaWR0aCArIDEwKSA/IGZpcnN0V2lkdGgvMiA6IHRoaXMueUxhYmVsV2lkdGggKyAxMDtcblxuXHRcdFx0dGhpcy54TGFiZWxSb3RhdGlvbiA9IDA7XG5cdFx0XHRpZiAodGhpcy5kaXNwbGF5KXtcblx0XHRcdFx0dmFyIG9yaWdpbmFsTGFiZWxXaWR0aCA9IGxvbmdlc3RUZXh0KHRoaXMuY3R4LHRoaXMuZm9udCx0aGlzLnhMYWJlbHMpLFxuXHRcdFx0XHRcdGNvc1JvdGF0aW9uLFxuXHRcdFx0XHRcdGZpcnN0Um90YXRlZFdpZHRoO1xuXHRcdFx0XHR0aGlzLnhMYWJlbFdpZHRoID0gb3JpZ2luYWxMYWJlbFdpZHRoO1xuXHRcdFx0XHQvL0FsbG93IDMgcGl4ZWxzIHgyIHBhZGRpbmcgZWl0aGVyIHNpZGUgZm9yIGxhYmVsIHJlYWRhYmlsaXR5XG5cdFx0XHRcdHZhciB4R3JpZFdpZHRoID0gTWF0aC5mbG9vcih0aGlzLmNhbGN1bGF0ZVgoMSkgLSB0aGlzLmNhbGN1bGF0ZVgoMCkpIC0gNjtcblxuXHRcdFx0XHQvL01heCBsYWJlbCByb3RhdGUgc2hvdWxkIGJlIDkwIC0gYWxzbyBhY3QgYXMgYSBsb29wIGNvdW50ZXJcblx0XHRcdFx0d2hpbGUgKCh0aGlzLnhMYWJlbFdpZHRoID4geEdyaWRXaWR0aCAmJiB0aGlzLnhMYWJlbFJvdGF0aW9uID09PSAwKSB8fCAodGhpcy54TGFiZWxXaWR0aCA+IHhHcmlkV2lkdGggJiYgdGhpcy54TGFiZWxSb3RhdGlvbiA8PSA5MCAmJiB0aGlzLnhMYWJlbFJvdGF0aW9uID4gMCkpe1xuXHRcdFx0XHRcdGNvc1JvdGF0aW9uID0gTWF0aC5jb3ModG9SYWRpYW5zKHRoaXMueExhYmVsUm90YXRpb24pKTtcblxuXHRcdFx0XHRcdGZpcnN0Um90YXRlZCA9IGNvc1JvdGF0aW9uICogZmlyc3RXaWR0aDtcblx0XHRcdFx0XHRsYXN0Um90YXRlZCA9IGNvc1JvdGF0aW9uICogbGFzdFdpZHRoO1xuXG5cdFx0XHRcdFx0Ly8gV2UncmUgcmlnaHQgYWxpZ25pbmcgdGhlIHRleHQgbm93LlxuXHRcdFx0XHRcdGlmIChmaXJzdFJvdGF0ZWQgKyB0aGlzLmZvbnRTaXplIC8gMiA+IHRoaXMueUxhYmVsV2lkdGggKyA4KXtcblx0XHRcdFx0XHRcdHRoaXMueFNjYWxlUGFkZGluZ0xlZnQgPSBmaXJzdFJvdGF0ZWQgKyB0aGlzLmZvbnRTaXplIC8gMjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy54U2NhbGVQYWRkaW5nUmlnaHQgPSB0aGlzLmZvbnRTaXplLzI7XG5cblxuXHRcdFx0XHRcdHRoaXMueExhYmVsUm90YXRpb24rKztcblx0XHRcdFx0XHR0aGlzLnhMYWJlbFdpZHRoID0gY29zUm90YXRpb24gKiBvcmlnaW5hbExhYmVsV2lkdGg7XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodGhpcy54TGFiZWxSb3RhdGlvbiA+IDApe1xuXHRcdFx0XHRcdHRoaXMuZW5kUG9pbnQgLT0gTWF0aC5zaW4odG9SYWRpYW5zKHRoaXMueExhYmVsUm90YXRpb24pKSpvcmlnaW5hbExhYmVsV2lkdGggKyAzO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHR0aGlzLnhMYWJlbFdpZHRoID0gMDtcblx0XHRcdFx0dGhpcy54U2NhbGVQYWRkaW5nUmlnaHQgPSB0aGlzLnBhZGRpbmc7XG5cdFx0XHRcdHRoaXMueFNjYWxlUGFkZGluZ0xlZnQgPSB0aGlzLnBhZGRpbmc7XG5cdFx0XHR9XG5cblx0XHR9LFxuXHRcdC8vIE5lZWRzIHRvIGJlIG92ZXJpZGRlbiBpbiBlYWNoIENoYXJ0IHR5cGVcblx0XHQvLyBPdGhlcndpc2Ugd2UgbmVlZCB0byBwYXNzIGFsbCB0aGUgZGF0YSBpbnRvIHRoZSBzY2FsZSBjbGFzc1xuXHRcdGNhbGN1bGF0ZVlSYW5nZTogbm9vcCxcblx0XHRkcmF3aW5nQXJlYTogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB0aGlzLnN0YXJ0UG9pbnQgLSB0aGlzLmVuZFBvaW50O1xuXHRcdH0sXG5cdFx0Y2FsY3VsYXRlWSA6IGZ1bmN0aW9uKHZhbHVlKXtcblx0XHRcdHZhciBzY2FsaW5nRmFjdG9yID0gdGhpcy5kcmF3aW5nQXJlYSgpIC8gKHRoaXMubWluIC0gdGhpcy5tYXgpO1xuXHRcdFx0cmV0dXJuIHRoaXMuZW5kUG9pbnQgLSAoc2NhbGluZ0ZhY3RvciAqICh2YWx1ZSAtIHRoaXMubWluKSk7XG5cdFx0fSxcblx0XHRjYWxjdWxhdGVYIDogZnVuY3Rpb24oaW5kZXgpe1xuXHRcdFx0dmFyIGlzUm90YXRlZCA9ICh0aGlzLnhMYWJlbFJvdGF0aW9uID4gMCksXG5cdFx0XHRcdC8vIGlubmVyV2lkdGggPSAodGhpcy5vZmZzZXRHcmlkTGluZXMpID8gdGhpcy53aWR0aCAtIG9mZnNldExlZnQgLSB0aGlzLnBhZGRpbmcgOiB0aGlzLndpZHRoIC0gKG9mZnNldExlZnQgKyBoYWxmTGFiZWxXaWR0aCAqIDIpIC0gdGhpcy5wYWRkaW5nLFxuXHRcdFx0XHRpbm5lcldpZHRoID0gdGhpcy53aWR0aCAtICh0aGlzLnhTY2FsZVBhZGRpbmdMZWZ0ICsgdGhpcy54U2NhbGVQYWRkaW5nUmlnaHQpLFxuXHRcdFx0XHR2YWx1ZVdpZHRoID0gaW5uZXJXaWR0aC9NYXRoLm1heCgodGhpcy52YWx1ZXNDb3VudCAtICgodGhpcy5vZmZzZXRHcmlkTGluZXMpID8gMCA6IDEpKSwgMSksXG5cdFx0XHRcdHZhbHVlT2Zmc2V0ID0gKHZhbHVlV2lkdGggKiBpbmRleCkgKyB0aGlzLnhTY2FsZVBhZGRpbmdMZWZ0O1xuXG5cdFx0XHRpZiAodGhpcy5vZmZzZXRHcmlkTGluZXMpe1xuXHRcdFx0XHR2YWx1ZU9mZnNldCArPSAodmFsdWVXaWR0aC8yKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIE1hdGgucm91bmQodmFsdWVPZmZzZXQpO1xuXHRcdH0sXG5cdFx0dXBkYXRlIDogZnVuY3Rpb24obmV3UHJvcHMpe1xuXHRcdFx0aGVscGVycy5leHRlbmQodGhpcywgbmV3UHJvcHMpO1xuXHRcdFx0dGhpcy5maXQoKTtcblx0XHR9LFxuXHRcdGRyYXcgOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIGN0eCA9IHRoaXMuY3R4LFxuXHRcdFx0XHR5TGFiZWxHYXAgPSAodGhpcy5lbmRQb2ludCAtIHRoaXMuc3RhcnRQb2ludCkgLyB0aGlzLnN0ZXBzLFxuXHRcdFx0XHR4U3RhcnQgPSBNYXRoLnJvdW5kKHRoaXMueFNjYWxlUGFkZGluZ0xlZnQpO1xuXHRcdFx0aWYgKHRoaXMuZGlzcGxheSl7XG5cdFx0XHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLnRleHRDb2xvcjtcblx0XHRcdFx0Y3R4LmZvbnQgPSB0aGlzLmZvbnQ7XG5cdFx0XHRcdGVhY2godGhpcy55TGFiZWxzLGZ1bmN0aW9uKGxhYmVsU3RyaW5nLGluZGV4KXtcblx0XHRcdFx0XHR2YXIgeUxhYmVsQ2VudGVyID0gdGhpcy5lbmRQb2ludCAtICh5TGFiZWxHYXAgKiBpbmRleCksXG5cdFx0XHRcdFx0XHRsaW5lUG9zaXRpb25ZID0gTWF0aC5yb3VuZCh5TGFiZWxDZW50ZXIpLFxuXHRcdFx0XHRcdFx0ZHJhd0hvcml6b250YWxMaW5lID0gdGhpcy5zaG93SG9yaXpvbnRhbExpbmVzO1xuXG5cdFx0XHRcdFx0Y3R4LnRleHRBbGlnbiA9IFwicmlnaHRcIjtcblx0XHRcdFx0XHRjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcblx0XHRcdFx0XHRpZiAodGhpcy5zaG93TGFiZWxzKXtcblx0XHRcdFx0XHRcdGN0eC5maWxsVGV4dChsYWJlbFN0cmluZyx4U3RhcnQgLSAxMCx5TGFiZWxDZW50ZXIpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFRoaXMgaXMgWCBheGlzLCBzbyBkcmF3IGl0XG5cdFx0XHRcdFx0aWYgKGluZGV4ID09PSAwICYmICFkcmF3SG9yaXpvbnRhbExpbmUpe1xuXHRcdFx0XHRcdFx0ZHJhd0hvcml6b250YWxMaW5lID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoZHJhd0hvcml6b250YWxMaW5lKXtcblx0XHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoaW5kZXggPiAwKXtcblx0XHRcdFx0XHRcdC8vIFRoaXMgaXMgYSBncmlkIGxpbmUgaW4gdGhlIGNlbnRyZSwgc28gZHJvcCB0aGF0XG5cdFx0XHRcdFx0XHRjdHgubGluZVdpZHRoID0gdGhpcy5ncmlkTGluZVdpZHRoO1xuXHRcdFx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gdGhpcy5ncmlkTGluZUNvbG9yO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBUaGlzIGlzIHRoZSBmaXJzdCBsaW5lIG9uIHRoZSBzY2FsZVxuXHRcdFx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IHRoaXMubGluZVdpZHRoO1xuXHRcdFx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gdGhpcy5saW5lQ29sb3I7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bGluZVBvc2l0aW9uWSArPSBoZWxwZXJzLmFsaWFzUGl4ZWwoY3R4LmxpbmVXaWR0aCk7XG5cblx0XHRcdFx0XHRpZihkcmF3SG9yaXpvbnRhbExpbmUpe1xuXHRcdFx0XHRcdFx0Y3R4Lm1vdmVUbyh4U3RhcnQsIGxpbmVQb3NpdGlvblkpO1xuXHRcdFx0XHRcdFx0Y3R4LmxpbmVUbyh0aGlzLndpZHRoLCBsaW5lUG9zaXRpb25ZKTtcblx0XHRcdFx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHRcdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjdHgubGluZVdpZHRoID0gdGhpcy5saW5lV2lkdGg7XG5cdFx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gdGhpcy5saW5lQ29sb3I7XG5cdFx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRcdGN0eC5tb3ZlVG8oeFN0YXJ0IC0gNSwgbGluZVBvc2l0aW9uWSk7XG5cdFx0XHRcdFx0Y3R4LmxpbmVUbyh4U3RhcnQsIGxpbmVQb3NpdGlvblkpO1xuXHRcdFx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cblx0XHRcdFx0fSx0aGlzKTtcblxuXHRcdFx0XHRlYWNoKHRoaXMueExhYmVscyxmdW5jdGlvbihsYWJlbCxpbmRleCl7XG5cdFx0XHRcdFx0dmFyIHhQb3MgPSB0aGlzLmNhbGN1bGF0ZVgoaW5kZXgpICsgYWxpYXNQaXhlbCh0aGlzLmxpbmVXaWR0aCksXG5cdFx0XHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgbGluZS9iYXIgaGVyZSBhbmQgZGVjaWRlIHdoZXJlIHRvIHBsYWNlIHRoZSBsaW5lXG5cdFx0XHRcdFx0XHRsaW5lUG9zID0gdGhpcy5jYWxjdWxhdGVYKGluZGV4IC0gKHRoaXMub2Zmc2V0R3JpZExpbmVzID8gMC41IDogMCkpICsgYWxpYXNQaXhlbCh0aGlzLmxpbmVXaWR0aCksXG5cdFx0XHRcdFx0XHRpc1JvdGF0ZWQgPSAodGhpcy54TGFiZWxSb3RhdGlvbiA+IDApLFxuXHRcdFx0XHRcdFx0ZHJhd1ZlcnRpY2FsTGluZSA9IHRoaXMuc2hvd1ZlcnRpY2FsTGluZXM7XG5cblx0XHRcdFx0XHQvLyBUaGlzIGlzIFkgYXhpcywgc28gZHJhdyBpdFxuXHRcdFx0XHRcdGlmIChpbmRleCA9PT0gMCAmJiAhZHJhd1ZlcnRpY2FsTGluZSl7XG5cdFx0XHRcdFx0XHRkcmF3VmVydGljYWxMaW5lID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoZHJhd1ZlcnRpY2FsTGluZSl7XG5cdFx0XHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGluZGV4ID4gMCl7XG5cdFx0XHRcdFx0XHQvLyBUaGlzIGlzIGEgZ3JpZCBsaW5lIGluIHRoZSBjZW50cmUsIHNvIGRyb3AgdGhhdFxuXHRcdFx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IHRoaXMuZ3JpZExpbmVXaWR0aDtcblx0XHRcdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ3JpZExpbmVDb2xvcjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gVGhpcyBpcyB0aGUgZmlyc3QgbGluZSBvbiB0aGUgc2NhbGVcblx0XHRcdFx0XHRcdGN0eC5saW5lV2lkdGggPSB0aGlzLmxpbmVXaWR0aDtcblx0XHRcdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9IHRoaXMubGluZUNvbG9yO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChkcmF3VmVydGljYWxMaW5lKXtcblx0XHRcdFx0XHRcdGN0eC5tb3ZlVG8obGluZVBvcyx0aGlzLmVuZFBvaW50KTtcblx0XHRcdFx0XHRcdGN0eC5saW5lVG8obGluZVBvcyx0aGlzLnN0YXJ0UG9pbnQgLSAzKTtcblx0XHRcdFx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHRcdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0XHR9XG5cblxuXHRcdFx0XHRcdGN0eC5saW5lV2lkdGggPSB0aGlzLmxpbmVXaWR0aDtcblx0XHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmxpbmVDb2xvcjtcblxuXG5cdFx0XHRcdFx0Ly8gU21hbGwgbGluZXMgYXQgdGhlIGJvdHRvbSBvZiB0aGUgYmFzZSBncmlkIGxpbmVcblx0XHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdFx0Y3R4Lm1vdmVUbyhsaW5lUG9zLHRoaXMuZW5kUG9pbnQpO1xuXHRcdFx0XHRcdGN0eC5saW5lVG8obGluZVBvcyx0aGlzLmVuZFBvaW50ICsgNSk7XG5cdFx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblxuXHRcdFx0XHRcdGN0eC5zYXZlKCk7XG5cdFx0XHRcdFx0Y3R4LnRyYW5zbGF0ZSh4UG9zLChpc1JvdGF0ZWQpID8gdGhpcy5lbmRQb2ludCArIDEyIDogdGhpcy5lbmRQb2ludCArIDgpO1xuXHRcdFx0XHRcdGN0eC5yb3RhdGUodG9SYWRpYW5zKHRoaXMueExhYmVsUm90YXRpb24pKi0xKTtcblx0XHRcdFx0XHRjdHguZm9udCA9IHRoaXMuZm9udDtcblx0XHRcdFx0XHRjdHgudGV4dEFsaWduID0gKGlzUm90YXRlZCkgPyBcInJpZ2h0XCIgOiBcImNlbnRlclwiO1xuXHRcdFx0XHRcdGN0eC50ZXh0QmFzZWxpbmUgPSAoaXNSb3RhdGVkKSA/IFwibWlkZGxlXCIgOiBcInRvcFwiO1xuXHRcdFx0XHRcdGN0eC5maWxsVGV4dChsYWJlbCwgMCwgMCk7XG5cdFx0XHRcdFx0Y3R4LnJlc3RvcmUoKTtcblx0XHRcdFx0fSx0aGlzKTtcblxuXHRcdFx0fVxuXHRcdH1cblxuXHR9KTtcblxuXHRDaGFydC5SYWRpYWxTY2FsZSA9IENoYXJ0LkVsZW1lbnQuZXh0ZW5kKHtcblx0XHRpbml0aWFsaXplOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5zaXplID0gbWluKFt0aGlzLmhlaWdodCwgdGhpcy53aWR0aF0pO1xuXHRcdFx0dGhpcy5kcmF3aW5nQXJlYSA9ICh0aGlzLmRpc3BsYXkpID8gKHRoaXMuc2l6ZS8yKSAtICh0aGlzLmZvbnRTaXplLzIgKyB0aGlzLmJhY2tkcm9wUGFkZGluZ1kpIDogKHRoaXMuc2l6ZS8yKTtcblx0XHR9LFxuXHRcdGNhbGN1bGF0ZUNlbnRlck9mZnNldDogZnVuY3Rpb24odmFsdWUpe1xuXHRcdFx0Ly8gVGFrZSBpbnRvIGFjY291bnQgaGFsZiBmb250IHNpemUgKyB0aGUgeVBhZGRpbmcgb2YgdGhlIHRvcCB2YWx1ZVxuXHRcdFx0dmFyIHNjYWxpbmdGYWN0b3IgPSB0aGlzLmRyYXdpbmdBcmVhIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuXG5cdFx0XHRyZXR1cm4gKHZhbHVlIC0gdGhpcy5taW4pICogc2NhbGluZ0ZhY3Rvcjtcblx0XHR9LFxuXHRcdHVwZGF0ZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAoIXRoaXMubGluZUFyYyl7XG5cdFx0XHRcdHRoaXMuc2V0U2NhbGVTaXplKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmRyYXdpbmdBcmVhID0gKHRoaXMuZGlzcGxheSkgPyAodGhpcy5zaXplLzIpIC0gKHRoaXMuZm9udFNpemUvMiArIHRoaXMuYmFja2Ryb3BQYWRkaW5nWSkgOiAodGhpcy5zaXplLzIpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5idWlsZFlMYWJlbHMoKTtcblx0XHR9LFxuXHRcdGJ1aWxkWUxhYmVsczogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMueUxhYmVscyA9IFtdO1xuXG5cdFx0XHR2YXIgc3RlcERlY2ltYWxQbGFjZXMgPSBnZXREZWNpbWFsUGxhY2VzKHRoaXMuc3RlcFZhbHVlKTtcblxuXHRcdFx0Zm9yICh2YXIgaT0wOyBpPD10aGlzLnN0ZXBzOyBpKyspe1xuXHRcdFx0XHR0aGlzLnlMYWJlbHMucHVzaCh0ZW1wbGF0ZSh0aGlzLnRlbXBsYXRlU3RyaW5nLHt2YWx1ZToodGhpcy5taW4gKyAoaSAqIHRoaXMuc3RlcFZhbHVlKSkudG9GaXhlZChzdGVwRGVjaW1hbFBsYWNlcyl9KSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRnZXRDaXJjdW1mZXJlbmNlIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiAoKE1hdGguUEkqMikgLyB0aGlzLnZhbHVlc0NvdW50KTtcblx0XHR9LFxuXHRcdHNldFNjYWxlU2l6ZTogZnVuY3Rpb24oKXtcblx0XHRcdC8qXG5cdFx0XHQgKiBSaWdodCwgdGhpcyBpcyByZWFsbHkgY29uZnVzaW5nIGFuZCB0aGVyZSBpcyBhIGxvdCBvZiBtYXRocyBnb2luZyBvbiBoZXJlXG5cdFx0XHQgKiBUaGUgZ2lzdCBvZiB0aGUgcHJvYmxlbSBpcyBoZXJlOiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9ubm5pY2svNjk2Y2M5YzU1ZjRiMGJlYjhmZTlcblx0XHRcdCAqXG5cdFx0XHQgKiBSZWFjdGlvbjogaHR0cHM6Ly9kbC5kcm9wYm94dXNlcmNvbnRlbnQuY29tL3UvMzQ2MDEzNjMvdG9vbXVjaHNjaWVuY2UuZ2lmXG5cdFx0XHQgKlxuXHRcdFx0ICogU29sdXRpb246XG5cdFx0XHQgKlxuXHRcdFx0ICogV2UgYXNzdW1lIHRoZSByYWRpdXMgb2YgdGhlIHBvbHlnb24gaXMgaGFsZiB0aGUgc2l6ZSBvZiB0aGUgY2FudmFzIGF0IGZpcnN0XG5cdFx0XHQgKiBhdCBlYWNoIGluZGV4IHdlIGNoZWNrIGlmIHRoZSB0ZXh0IG92ZXJsYXBzLlxuXHRcdFx0ICpcblx0XHRcdCAqIFdoZXJlIGl0IGRvZXMsIHdlIHN0b3JlIHRoYXQgYW5nbGUgYW5kIHRoYXQgaW5kZXguXG5cdFx0XHQgKlxuXHRcdFx0ICogQWZ0ZXIgZmluZGluZyB0aGUgbGFyZ2VzdCBpbmRleCBhbmQgYW5nbGUgd2UgY2FsY3VsYXRlIGhvdyBtdWNoIHdlIG5lZWQgdG8gcmVtb3ZlXG5cdFx0XHQgKiBmcm9tIHRoZSBzaGFwZSByYWRpdXMgdG8gbW92ZSB0aGUgcG9pbnQgaW53YXJkcyBieSB0aGF0IHguXG5cdFx0XHQgKlxuXHRcdFx0ICogV2UgYXZlcmFnZSB0aGUgbGVmdCBhbmQgcmlnaHQgZGlzdGFuY2VzIHRvIGdldCB0aGUgbWF4aW11bSBzaGFwZSByYWRpdXMgdGhhdCBjYW4gZml0IGluIHRoZSBib3hcblx0XHRcdCAqIGFsb25nIHdpdGggbGFiZWxzLlxuXHRcdFx0ICpcblx0XHRcdCAqIE9uY2Ugd2UgaGF2ZSB0aGF0LCB3ZSBjYW4gZmluZCB0aGUgY2VudHJlIHBvaW50IGZvciB0aGUgY2hhcnQsIGJ5IHRha2luZyB0aGUgeCB0ZXh0IHByb3RydXNpb25cblx0XHRcdCAqIG9uIGVhY2ggc2lkZSwgcmVtb3ZpbmcgdGhhdCBmcm9tIHRoZSBzaXplLCBoYWx2aW5nIGl0IGFuZCBhZGRpbmcgdGhlIGxlZnQgeCBwcm90cnVzaW9uIHdpZHRoLlxuXHRcdFx0ICpcblx0XHRcdCAqIFRoaXMgd2lsbCBtZWFuIHdlIGhhdmUgYSBzaGFwZSBmaXR0ZWQgdG8gdGhlIGNhbnZhcywgYXMgbGFyZ2UgYXMgaXQgY2FuIGJlIHdpdGggdGhlIGxhYmVsc1xuXHRcdFx0ICogYW5kIHBvc2l0aW9uIGl0IGluIHRoZSBtb3N0IHNwYWNlIGVmZmljaWVudCBtYW5uZXJcblx0XHRcdCAqXG5cdFx0XHQgKiBodHRwczovL2RsLmRyb3Bib3h1c2VyY29udGVudC5jb20vdS8zNDYwMTM2My95ZWFoc2NpZW5jZS5naWZcblx0XHRcdCAqL1xuXG5cblx0XHRcdC8vIEdldCBtYXhpbXVtIHJhZGl1cyBvZiB0aGUgcG9seWdvbi4gRWl0aGVyIGhhbGYgdGhlIGhlaWdodCAobWludXMgdGhlIHRleHQgd2lkdGgpIG9yIGhhbGYgdGhlIHdpZHRoLlxuXHRcdFx0Ly8gVXNlIHRoaXMgdG8gY2FsY3VsYXRlIHRoZSBvZmZzZXQgKyBjaGFuZ2UuIC0gTWFrZSBzdXJlIEwvUiBwcm90cnVzaW9uIGlzIGF0IGxlYXN0IDAgdG8gc3RvcCBpc3N1ZXMgd2l0aCBjZW50cmUgcG9pbnRzXG5cdFx0XHR2YXIgbGFyZ2VzdFBvc3NpYmxlUmFkaXVzID0gbWluKFsodGhpcy5oZWlnaHQvMiAtIHRoaXMucG9pbnRMYWJlbEZvbnRTaXplIC0gNSksIHRoaXMud2lkdGgvMl0pLFxuXHRcdFx0XHRwb2ludFBvc2l0aW9uLFxuXHRcdFx0XHRpLFxuXHRcdFx0XHR0ZXh0V2lkdGgsXG5cdFx0XHRcdGhhbGZUZXh0V2lkdGgsXG5cdFx0XHRcdGZ1cnRoZXN0UmlnaHQgPSB0aGlzLndpZHRoLFxuXHRcdFx0XHRmdXJ0aGVzdFJpZ2h0SW5kZXgsXG5cdFx0XHRcdGZ1cnRoZXN0UmlnaHRBbmdsZSxcblx0XHRcdFx0ZnVydGhlc3RMZWZ0ID0gMCxcblx0XHRcdFx0ZnVydGhlc3RMZWZ0SW5kZXgsXG5cdFx0XHRcdGZ1cnRoZXN0TGVmdEFuZ2xlLFxuXHRcdFx0XHR4UHJvdHJ1c2lvbkxlZnQsXG5cdFx0XHRcdHhQcm90cnVzaW9uUmlnaHQsXG5cdFx0XHRcdHJhZGl1c1JlZHVjdGlvblJpZ2h0LFxuXHRcdFx0XHRyYWRpdXNSZWR1Y3Rpb25MZWZ0LFxuXHRcdFx0XHRtYXhXaWR0aFJhZGl1cztcblx0XHRcdHRoaXMuY3R4LmZvbnQgPSBmb250U3RyaW5nKHRoaXMucG9pbnRMYWJlbEZvbnRTaXplLHRoaXMucG9pbnRMYWJlbEZvbnRTdHlsZSx0aGlzLnBvaW50TGFiZWxGb250RmFtaWx5KTtcblx0XHRcdGZvciAoaT0wO2k8dGhpcy52YWx1ZXNDb3VudDtpKyspe1xuXHRcdFx0XHQvLyA1cHggdG8gc3BhY2UgdGhlIHRleHQgc2xpZ2h0bHkgb3V0IC0gc2ltaWxhciB0byB3aGF0IHdlIGRvIGluIHRoZSBkcmF3IGZ1bmN0aW9uLlxuXHRcdFx0XHRwb2ludFBvc2l0aW9uID0gdGhpcy5nZXRQb2ludFBvc2l0aW9uKGksIGxhcmdlc3RQb3NzaWJsZVJhZGl1cyk7XG5cdFx0XHRcdHRleHRXaWR0aCA9IHRoaXMuY3R4Lm1lYXN1cmVUZXh0KHRlbXBsYXRlKHRoaXMudGVtcGxhdGVTdHJpbmcsIHsgdmFsdWU6IHRoaXMubGFiZWxzW2ldIH0pKS53aWR0aCArIDU7XG5cdFx0XHRcdGlmIChpID09PSAwIHx8IGkgPT09IHRoaXMudmFsdWVzQ291bnQvMil7XG5cdFx0XHRcdFx0Ly8gSWYgd2UncmUgYXQgaW5kZXggemVybywgb3IgZXhhY3RseSB0aGUgbWlkZGxlLCB3ZSdyZSBhdCBleGFjdGx5IHRoZSB0b3AvYm90dG9tXG5cdFx0XHRcdFx0Ly8gb2YgdGhlIHJhZGFyIGNoYXJ0LCBzbyB0ZXh0IHdpbGwgYmUgYWxpZ25lZCBjZW50cmFsbHksIHNvIHdlJ2xsIGhhbGYgaXQgYW5kIGNvbXBhcmVcblx0XHRcdFx0XHQvLyB3L2xlZnQgYW5kIHJpZ2h0IHRleHQgc2l6ZXNcblx0XHRcdFx0XHRoYWxmVGV4dFdpZHRoID0gdGV4dFdpZHRoLzI7XG5cdFx0XHRcdFx0aWYgKHBvaW50UG9zaXRpb24ueCArIGhhbGZUZXh0V2lkdGggPiBmdXJ0aGVzdFJpZ2h0KSB7XG5cdFx0XHRcdFx0XHRmdXJ0aGVzdFJpZ2h0ID0gcG9pbnRQb3NpdGlvbi54ICsgaGFsZlRleHRXaWR0aDtcblx0XHRcdFx0XHRcdGZ1cnRoZXN0UmlnaHRJbmRleCA9IGk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChwb2ludFBvc2l0aW9uLnggLSBoYWxmVGV4dFdpZHRoIDwgZnVydGhlc3RMZWZ0KSB7XG5cdFx0XHRcdFx0XHRmdXJ0aGVzdExlZnQgPSBwb2ludFBvc2l0aW9uLnggLSBoYWxmVGV4dFdpZHRoO1xuXHRcdFx0XHRcdFx0ZnVydGhlc3RMZWZ0SW5kZXggPSBpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChpIDwgdGhpcy52YWx1ZXNDb3VudC8yKSB7XG5cdFx0XHRcdFx0Ly8gTGVzcyB0aGFuIGhhbGYgdGhlIHZhbHVlcyBtZWFucyB3ZSdsbCBsZWZ0IGFsaWduIHRoZSB0ZXh0XG5cdFx0XHRcdFx0aWYgKHBvaW50UG9zaXRpb24ueCArIHRleHRXaWR0aCA+IGZ1cnRoZXN0UmlnaHQpIHtcblx0XHRcdFx0XHRcdGZ1cnRoZXN0UmlnaHQgPSBwb2ludFBvc2l0aW9uLnggKyB0ZXh0V2lkdGg7XG5cdFx0XHRcdFx0XHRmdXJ0aGVzdFJpZ2h0SW5kZXggPSBpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChpID4gdGhpcy52YWx1ZXNDb3VudC8yKXtcblx0XHRcdFx0XHQvLyBNb3JlIHRoYW4gaGFsZiB0aGUgdmFsdWVzIG1lYW5zIHdlJ2xsIHJpZ2h0IGFsaWduIHRoZSB0ZXh0XG5cdFx0XHRcdFx0aWYgKHBvaW50UG9zaXRpb24ueCAtIHRleHRXaWR0aCA8IGZ1cnRoZXN0TGVmdCkge1xuXHRcdFx0XHRcdFx0ZnVydGhlc3RMZWZ0ID0gcG9pbnRQb3NpdGlvbi54IC0gdGV4dFdpZHRoO1xuXHRcdFx0XHRcdFx0ZnVydGhlc3RMZWZ0SW5kZXggPSBpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR4UHJvdHJ1c2lvbkxlZnQgPSBmdXJ0aGVzdExlZnQ7XG5cblx0XHRcdHhQcm90cnVzaW9uUmlnaHQgPSBNYXRoLmNlaWwoZnVydGhlc3RSaWdodCAtIHRoaXMud2lkdGgpO1xuXG5cdFx0XHRmdXJ0aGVzdFJpZ2h0QW5nbGUgPSB0aGlzLmdldEluZGV4QW5nbGUoZnVydGhlc3RSaWdodEluZGV4KTtcblxuXHRcdFx0ZnVydGhlc3RMZWZ0QW5nbGUgPSB0aGlzLmdldEluZGV4QW5nbGUoZnVydGhlc3RMZWZ0SW5kZXgpO1xuXG5cdFx0XHRyYWRpdXNSZWR1Y3Rpb25SaWdodCA9IHhQcm90cnVzaW9uUmlnaHQgLyBNYXRoLnNpbihmdXJ0aGVzdFJpZ2h0QW5nbGUgKyBNYXRoLlBJLzIpO1xuXG5cdFx0XHRyYWRpdXNSZWR1Y3Rpb25MZWZ0ID0geFByb3RydXNpb25MZWZ0IC8gTWF0aC5zaW4oZnVydGhlc3RMZWZ0QW5nbGUgKyBNYXRoLlBJLzIpO1xuXG5cdFx0XHQvLyBFbnN1cmUgd2UgYWN0dWFsbHkgbmVlZCB0byByZWR1Y2UgdGhlIHNpemUgb2YgdGhlIGNoYXJ0XG5cdFx0XHRyYWRpdXNSZWR1Y3Rpb25SaWdodCA9IChpc051bWJlcihyYWRpdXNSZWR1Y3Rpb25SaWdodCkpID8gcmFkaXVzUmVkdWN0aW9uUmlnaHQgOiAwO1xuXHRcdFx0cmFkaXVzUmVkdWN0aW9uTGVmdCA9IChpc051bWJlcihyYWRpdXNSZWR1Y3Rpb25MZWZ0KSkgPyByYWRpdXNSZWR1Y3Rpb25MZWZ0IDogMDtcblxuXHRcdFx0dGhpcy5kcmF3aW5nQXJlYSA9IGxhcmdlc3RQb3NzaWJsZVJhZGl1cyAtIChyYWRpdXNSZWR1Y3Rpb25MZWZ0ICsgcmFkaXVzUmVkdWN0aW9uUmlnaHQpLzI7XG5cblx0XHRcdC8vdGhpcy5kcmF3aW5nQXJlYSA9IG1pbihbbWF4V2lkdGhSYWRpdXMsICh0aGlzLmhlaWdodCAtICgyICogKHRoaXMucG9pbnRMYWJlbEZvbnRTaXplICsgNSkpKS8yXSlcblx0XHRcdHRoaXMuc2V0Q2VudGVyUG9pbnQocmFkaXVzUmVkdWN0aW9uTGVmdCwgcmFkaXVzUmVkdWN0aW9uUmlnaHQpO1xuXG5cdFx0fSxcblx0XHRzZXRDZW50ZXJQb2ludDogZnVuY3Rpb24obGVmdE1vdmVtZW50LCByaWdodE1vdmVtZW50KXtcblxuXHRcdFx0dmFyIG1heFJpZ2h0ID0gdGhpcy53aWR0aCAtIHJpZ2h0TW92ZW1lbnQgLSB0aGlzLmRyYXdpbmdBcmVhLFxuXHRcdFx0XHRtYXhMZWZ0ID0gbGVmdE1vdmVtZW50ICsgdGhpcy5kcmF3aW5nQXJlYTtcblxuXHRcdFx0dGhpcy54Q2VudGVyID0gKG1heExlZnQgKyBtYXhSaWdodCkvMjtcblx0XHRcdC8vIEFsd2F5cyB2ZXJ0aWNhbGx5IGluIHRoZSBjZW50cmUgYXMgdGhlIHRleHQgaGVpZ2h0IGRvZXNuJ3QgY2hhbmdlXG5cdFx0XHR0aGlzLnlDZW50ZXIgPSAodGhpcy5oZWlnaHQvMik7XG5cdFx0fSxcblxuXHRcdGdldEluZGV4QW5nbGUgOiBmdW5jdGlvbihpbmRleCl7XG5cdFx0XHR2YXIgYW5nbGVNdWx0aXBsaWVyID0gKE1hdGguUEkgKiAyKSAvIHRoaXMudmFsdWVzQ291bnQ7XG5cdFx0XHQvLyBTdGFydCBmcm9tIHRoZSB0b3AgaW5zdGVhZCBvZiByaWdodCwgc28gcmVtb3ZlIGEgcXVhcnRlciBvZiB0aGUgY2lyY2xlXG5cblx0XHRcdHJldHVybiBpbmRleCAqIGFuZ2xlTXVsdGlwbGllciAtIChNYXRoLlBJLzIpO1xuXHRcdH0sXG5cdFx0Z2V0UG9pbnRQb3NpdGlvbiA6IGZ1bmN0aW9uKGluZGV4LCBkaXN0YW5jZUZyb21DZW50ZXIpe1xuXHRcdFx0dmFyIHRoaXNBbmdsZSA9IHRoaXMuZ2V0SW5kZXhBbmdsZShpbmRleCk7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR4IDogKE1hdGguY29zKHRoaXNBbmdsZSkgKiBkaXN0YW5jZUZyb21DZW50ZXIpICsgdGhpcy54Q2VudGVyLFxuXHRcdFx0XHR5IDogKE1hdGguc2luKHRoaXNBbmdsZSkgKiBkaXN0YW5jZUZyb21DZW50ZXIpICsgdGhpcy55Q2VudGVyXG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0ZHJhdzogZnVuY3Rpb24oKXtcblx0XHRcdGlmICh0aGlzLmRpc3BsYXkpe1xuXHRcdFx0XHR2YXIgY3R4ID0gdGhpcy5jdHg7XG5cdFx0XHRcdGVhY2godGhpcy55TGFiZWxzLCBmdW5jdGlvbihsYWJlbCwgaW5kZXgpe1xuXHRcdFx0XHRcdC8vIERvbid0IGRyYXcgYSBjZW50cmUgdmFsdWVcblx0XHRcdFx0XHRpZiAoaW5kZXggPiAwKXtcblx0XHRcdFx0XHRcdHZhciB5Q2VudGVyT2Zmc2V0ID0gaW5kZXggKiAodGhpcy5kcmF3aW5nQXJlYS90aGlzLnN0ZXBzKSxcblx0XHRcdFx0XHRcdFx0eUhlaWdodCA9IHRoaXMueUNlbnRlciAtIHlDZW50ZXJPZmZzZXQsXG5cdFx0XHRcdFx0XHRcdHBvaW50UG9zaXRpb247XG5cblx0XHRcdFx0XHRcdC8vIERyYXcgY2lyY3VsYXIgbGluZXMgYXJvdW5kIHRoZSBzY2FsZVxuXHRcdFx0XHRcdFx0aWYgKHRoaXMubGluZVdpZHRoID4gMCl7XG5cdFx0XHRcdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9IHRoaXMubGluZUNvbG9yO1xuXHRcdFx0XHRcdFx0XHRjdHgubGluZVdpZHRoID0gdGhpcy5saW5lV2lkdGg7XG5cblx0XHRcdFx0XHRcdFx0aWYodGhpcy5saW5lQXJjKXtcblx0XHRcdFx0XHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdFx0XHRcdFx0Y3R4LmFyYyh0aGlzLnhDZW50ZXIsIHRoaXMueUNlbnRlciwgeUNlbnRlck9mZnNldCwgMCwgTWF0aC5QSSoyKTtcblx0XHRcdFx0XHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdFx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGk9MDtpPHRoaXMudmFsdWVzQ291bnQ7aSsrKVxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdHBvaW50UG9zaXRpb24gPSB0aGlzLmdldFBvaW50UG9zaXRpb24oaSwgdGhpcy5jYWxjdWxhdGVDZW50ZXJPZmZzZXQodGhpcy5taW4gKyAoaW5kZXggKiB0aGlzLnN0ZXBWYWx1ZSkpKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChpID09PSAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y3R4Lm1vdmVUbyhwb2ludFBvc2l0aW9uLngsIHBvaW50UG9zaXRpb24ueSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjdHgubGluZVRvKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55KTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdFx0XHRcdFx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYodGhpcy5zaG93TGFiZWxzKXtcblx0XHRcdFx0XHRcdFx0Y3R4LmZvbnQgPSBmb250U3RyaW5nKHRoaXMuZm9udFNpemUsdGhpcy5mb250U3R5bGUsdGhpcy5mb250RmFtaWx5KTtcblx0XHRcdFx0XHRcdFx0aWYgKHRoaXMuc2hvd0xhYmVsQmFja2Ryb3Ape1xuXHRcdFx0XHRcdFx0XHRcdHZhciBsYWJlbFdpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KGxhYmVsKS53aWR0aDtcblx0XHRcdFx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy5iYWNrZHJvcENvbG9yO1xuXHRcdFx0XHRcdFx0XHRcdGN0eC5maWxsUmVjdChcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMueENlbnRlciAtIGxhYmVsV2lkdGgvMiAtIHRoaXMuYmFja2Ryb3BQYWRkaW5nWCxcblx0XHRcdFx0XHRcdFx0XHRcdHlIZWlnaHQgLSB0aGlzLmZvbnRTaXplLzIgLSB0aGlzLmJhY2tkcm9wUGFkZGluZ1ksXG5cdFx0XHRcdFx0XHRcdFx0XHRsYWJlbFdpZHRoICsgdGhpcy5iYWNrZHJvcFBhZGRpbmdYKjIsXG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLmZvbnRTaXplICsgdGhpcy5iYWNrZHJvcFBhZGRpbmdZKjJcblx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcblx0XHRcdFx0XHRcdFx0Y3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XG5cdFx0XHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLmZvbnRDb2xvcjtcblx0XHRcdFx0XHRcdFx0Y3R4LmZpbGxUZXh0KGxhYmVsLCB0aGlzLnhDZW50ZXIsIHlIZWlnaHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgdGhpcyk7XG5cblx0XHRcdFx0aWYgKCF0aGlzLmxpbmVBcmMpe1xuXHRcdFx0XHRcdGN0eC5saW5lV2lkdGggPSB0aGlzLmFuZ2xlTGluZVdpZHRoO1xuXHRcdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuYW5nbGVMaW5lQ29sb3I7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IHRoaXMudmFsdWVzQ291bnQgLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuYW5nbGVMaW5lV2lkdGggPiAwKXtcblx0XHRcdFx0XHRcdFx0dmFyIG91dGVyUG9zaXRpb24gPSB0aGlzLmdldFBvaW50UG9zaXRpb24oaSwgdGhpcy5jYWxjdWxhdGVDZW50ZXJPZmZzZXQodGhpcy5tYXgpKTtcblx0XHRcdFx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRcdFx0XHRjdHgubW92ZVRvKHRoaXMueENlbnRlciwgdGhpcy55Q2VudGVyKTtcblx0XHRcdFx0XHRcdFx0Y3R4LmxpbmVUbyhvdXRlclBvc2l0aW9uLngsIG91dGVyUG9zaXRpb24ueSk7XG5cdFx0XHRcdFx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHRcdFx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Ly8gRXh0cmEgM3B4IG91dCBmb3Igc29tZSBsYWJlbCBzcGFjaW5nXG5cdFx0XHRcdFx0XHR2YXIgcG9pbnRMYWJlbFBvc2l0aW9uID0gdGhpcy5nZXRQb2ludFBvc2l0aW9uKGksIHRoaXMuY2FsY3VsYXRlQ2VudGVyT2Zmc2V0KHRoaXMubWF4KSArIDUpO1xuXHRcdFx0XHRcdFx0Y3R4LmZvbnQgPSBmb250U3RyaW5nKHRoaXMucG9pbnRMYWJlbEZvbnRTaXplLHRoaXMucG9pbnRMYWJlbEZvbnRTdHlsZSx0aGlzLnBvaW50TGFiZWxGb250RmFtaWx5KTtcblx0XHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLnBvaW50TGFiZWxGb250Q29sb3I7XG5cblx0XHRcdFx0XHRcdHZhciBsYWJlbHNDb3VudCA9IHRoaXMubGFiZWxzLmxlbmd0aCxcblx0XHRcdFx0XHRcdFx0aGFsZkxhYmVsc0NvdW50ID0gdGhpcy5sYWJlbHMubGVuZ3RoLzIsXG5cdFx0XHRcdFx0XHRcdHF1YXJ0ZXJMYWJlbHNDb3VudCA9IGhhbGZMYWJlbHNDb3VudC8yLFxuXHRcdFx0XHRcdFx0XHR1cHBlckhhbGYgPSAoaSA8IHF1YXJ0ZXJMYWJlbHNDb3VudCB8fCBpID4gbGFiZWxzQ291bnQgLSBxdWFydGVyTGFiZWxzQ291bnQpLFxuXHRcdFx0XHRcdFx0XHRleGFjdFF1YXJ0ZXIgPSAoaSA9PT0gcXVhcnRlckxhYmVsc0NvdW50IHx8IGkgPT09IGxhYmVsc0NvdW50IC0gcXVhcnRlckxhYmVsc0NvdW50KTtcblx0XHRcdFx0XHRcdGlmIChpID09PSAwKXtcblx0XHRcdFx0XHRcdFx0Y3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmKGkgPT09IGhhbGZMYWJlbHNDb3VudCl7XG5cdFx0XHRcdFx0XHRcdGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoaSA8IGhhbGZMYWJlbHNDb3VudCl7XG5cdFx0XHRcdFx0XHRcdGN0eC50ZXh0QWxpZ24gPSAnbGVmdCc7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRjdHgudGV4dEFsaWduID0gJ3JpZ2h0Jztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gU2V0IHRoZSBjb3JyZWN0IHRleHQgYmFzZWxpbmUgYmFzZWQgb24gb3V0ZXIgcG9zaXRpb25pbmdcblx0XHRcdFx0XHRcdGlmIChleGFjdFF1YXJ0ZXIpe1xuXHRcdFx0XHRcdFx0XHRjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHVwcGVySGFsZil7XG5cdFx0XHRcdFx0XHRcdGN0eC50ZXh0QmFzZWxpbmUgPSAnYm90dG9tJztcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGN0eC50ZXh0QmFzZWxpbmUgPSAndG9wJztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y3R4LmZpbGxUZXh0KHRoaXMubGFiZWxzW2ldLCBwb2ludExhYmVsUG9zaXRpb24ueCwgcG9pbnRMYWJlbFBvc2l0aW9uLnkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0Ly8gQXR0YWNoIGdsb2JhbCBldmVudCB0byByZXNpemUgZWFjaCBjaGFydCBpbnN0YW5jZSB3aGVuIHRoZSBicm93c2VyIHJlc2l6ZXNcblx0aGVscGVycy5hZGRFdmVudCh3aW5kb3csIFwicmVzaXplXCIsIChmdW5jdGlvbigpe1xuXHRcdC8vIEJhc2ljIGRlYm91bmNlIG9mIHJlc2l6ZSBmdW5jdGlvbiBzbyBpdCBkb2Vzbid0IGh1cnQgcGVyZm9ybWFuY2Ugd2hlbiByZXNpemluZyBicm93c2VyLlxuXHRcdHZhciB0aW1lb3V0O1xuXHRcdHJldHVybiBmdW5jdGlvbigpe1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHRcdFx0dGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0ZWFjaChDaGFydC5pbnN0YW5jZXMsZnVuY3Rpb24oaW5zdGFuY2Upe1xuXHRcdFx0XHRcdC8vIElmIHRoZSByZXNwb25zaXZlIGZsYWcgaXMgc2V0IGluIHRoZSBjaGFydCBpbnN0YW5jZSBjb25maWdcblx0XHRcdFx0XHQvLyBDYXNjYWRlIHRoZSByZXNpemUgZXZlbnQgZG93biB0byB0aGUgY2hhcnQuXG5cdFx0XHRcdFx0aWYgKGluc3RhbmNlLm9wdGlvbnMucmVzcG9uc2l2ZSl7XG5cdFx0XHRcdFx0XHRpbnN0YW5jZS5yZXNpemUoaW5zdGFuY2UucmVuZGVyLCB0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSwgNTApO1xuXHRcdH07XG5cdH0pKCkpO1xuXG5cblx0aWYgKGFtZCkge1xuXHRcdGRlZmluZShmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIENoYXJ0O1xuXHRcdH0pO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBDaGFydDtcblx0fVxuXG5cdHJvb3QuQ2hhcnQgPSBDaGFydDtcblxuXHRDaGFydC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKXtcblx0XHRyb290LkNoYXJ0ID0gcHJldmlvdXM7XG5cdFx0cmV0dXJuIENoYXJ0O1xuXHR9O1xuXG59KS5jYWxsKHRoaXMpO1xuXG4oZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIHJvb3QgPSB0aGlzLFxuXHRcdENoYXJ0ID0gcm9vdC5DaGFydCxcblx0XHRoZWxwZXJzID0gQ2hhcnQuaGVscGVycztcblxuXG5cdHZhciBkZWZhdWx0Q29uZmlnID0ge1xuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdGhlIHNjYWxlIHNob3VsZCBzdGFydCBhdCB6ZXJvLCBvciBhbiBvcmRlciBvZiBtYWduaXR1ZGUgZG93biBmcm9tIHRoZSBsb3dlc3QgdmFsdWVcblx0XHRzY2FsZUJlZ2luQXRaZXJvIDogdHJ1ZSxcblxuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgZ3JpZCBsaW5lcyBhcmUgc2hvd24gYWNyb3NzIHRoZSBjaGFydFxuXHRcdHNjYWxlU2hvd0dyaWRMaW5lcyA6IHRydWUsXG5cblx0XHQvL1N0cmluZyAtIENvbG91ciBvZiB0aGUgZ3JpZCBsaW5lc1xuXHRcdHNjYWxlR3JpZExpbmVDb2xvciA6IFwicmdiYSgwLDAsMCwuMDUpXCIsXG5cblx0XHQvL051bWJlciAtIFdpZHRoIG9mIHRoZSBncmlkIGxpbmVzXG5cdFx0c2NhbGVHcmlkTGluZVdpZHRoIDogMSxcblxuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdG8gc2hvdyBob3Jpem9udGFsIGxpbmVzIChleGNlcHQgWCBheGlzKVxuXHRcdHNjYWxlU2hvd0hvcml6b250YWxMaW5lczogdHJ1ZSxcblxuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdG8gc2hvdyB2ZXJ0aWNhbCBsaW5lcyAoZXhjZXB0IFkgYXhpcylcblx0XHRzY2FsZVNob3dWZXJ0aWNhbExpbmVzOiB0cnVlLFxuXG5cdFx0Ly9Cb29sZWFuIC0gSWYgdGhlcmUgaXMgYSBzdHJva2Ugb24gZWFjaCBiYXJcblx0XHRiYXJTaG93U3Ryb2tlIDogdHJ1ZSxcblxuXHRcdC8vTnVtYmVyIC0gUGl4ZWwgd2lkdGggb2YgdGhlIGJhciBzdHJva2Vcblx0XHRiYXJTdHJva2VXaWR0aCA6IDIsXG5cblx0XHQvL051bWJlciAtIFNwYWNpbmcgYmV0d2VlbiBlYWNoIG9mIHRoZSBYIHZhbHVlIHNldHNcblx0XHRiYXJWYWx1ZVNwYWNpbmcgOiA1LFxuXG5cdFx0Ly9OdW1iZXIgLSBTcGFjaW5nIGJldHdlZW4gZGF0YSBzZXRzIHdpdGhpbiBYIHZhbHVlc1xuXHRcdGJhckRhdGFzZXRTcGFjaW5nIDogMSxcblxuXHRcdC8vU3RyaW5nIC0gQSBsZWdlbmQgdGVtcGxhdGVcblx0XHRsZWdlbmRUZW1wbGF0ZSA6IFwiPHVsIGNsYXNzPVxcXCI8JT1uYW1lLnRvTG93ZXJDYXNlKCklPi1sZWdlbmRcXFwiPjwlIGZvciAodmFyIGk9MDsgaTxkYXRhc2V0cy5sZW5ndGg7IGkrKyl7JT48bGk+PHNwYW4gc3R5bGU9XFxcImJhY2tncm91bmQtY29sb3I6PCU9ZGF0YXNldHNbaV0uZmlsbENvbG9yJT5cXFwiPjwvc3Bhbj48JWlmKGRhdGFzZXRzW2ldLmxhYmVsKXslPjwlPWRhdGFzZXRzW2ldLmxhYmVsJT48JX0lPjwvbGk+PCV9JT48L3VsPlwiXG5cblx0fTtcblxuXG5cdENoYXJ0LlR5cGUuZXh0ZW5kKHtcblx0XHRuYW1lOiBcIkJhclwiLFxuXHRcdGRlZmF1bHRzIDogZGVmYXVsdENvbmZpZyxcblx0XHRpbml0aWFsaXplOiAgZnVuY3Rpb24oZGF0YSl7XG5cblx0XHRcdC8vRXhwb3NlIG9wdGlvbnMgYXMgYSBzY29wZSB2YXJpYWJsZSBoZXJlIHNvIHdlIGNhbiBhY2Nlc3MgaXQgaW4gdGhlIFNjYWxlQ2xhc3Ncblx0XHRcdHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG5cdFx0XHR0aGlzLlNjYWxlQ2xhc3MgPSBDaGFydC5TY2FsZS5leHRlbmQoe1xuXHRcdFx0XHRvZmZzZXRHcmlkTGluZXMgOiB0cnVlLFxuXHRcdFx0XHRjYWxjdWxhdGVCYXJYIDogZnVuY3Rpb24oZGF0YXNldENvdW50LCBkYXRhc2V0SW5kZXgsIGJhckluZGV4KXtcblx0XHRcdFx0XHQvL1JldXNhYmxlIG1ldGhvZCBmb3IgY2FsY3VsYXRpbmcgdGhlIHhQb3NpdGlvbiBvZiBhIGdpdmVuIGJhciBiYXNlZCBvbiBkYXRhc2V0SW5kZXggJiB3aWR0aCBvZiB0aGUgYmFyXG5cdFx0XHRcdFx0dmFyIHhXaWR0aCA9IHRoaXMuY2FsY3VsYXRlQmFzZVdpZHRoKCksXG5cdFx0XHRcdFx0XHR4QWJzb2x1dGUgPSB0aGlzLmNhbGN1bGF0ZVgoYmFySW5kZXgpIC0gKHhXaWR0aC8yKSxcblx0XHRcdFx0XHRcdGJhcldpZHRoID0gdGhpcy5jYWxjdWxhdGVCYXJXaWR0aChkYXRhc2V0Q291bnQpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHhBYnNvbHV0ZSArIChiYXJXaWR0aCAqIGRhdGFzZXRJbmRleCkgKyAoZGF0YXNldEluZGV4ICogb3B0aW9ucy5iYXJEYXRhc2V0U3BhY2luZykgKyBiYXJXaWR0aC8yO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRjYWxjdWxhdGVCYXNlV2lkdGggOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHJldHVybiAodGhpcy5jYWxjdWxhdGVYKDEpIC0gdGhpcy5jYWxjdWxhdGVYKDApKSAtICgyKm9wdGlvbnMuYmFyVmFsdWVTcGFjaW5nKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y2FsY3VsYXRlQmFyV2lkdGggOiBmdW5jdGlvbihkYXRhc2V0Q291bnQpe1xuXHRcdFx0XHRcdC8vVGhlIHBhZGRpbmcgYmV0d2VlbiBkYXRhc2V0cyBpcyB0byB0aGUgcmlnaHQgb2YgZWFjaCBiYXIsIHByb3ZpZGluZyB0aGF0IHRoZXJlIGFyZSBtb3JlIHRoYW4gMSBkYXRhc2V0XG5cdFx0XHRcdFx0dmFyIGJhc2VXaWR0aCA9IHRoaXMuY2FsY3VsYXRlQmFzZVdpZHRoKCkgLSAoKGRhdGFzZXRDb3VudCAtIDEpICogb3B0aW9ucy5iYXJEYXRhc2V0U3BhY2luZyk7XG5cblx0XHRcdFx0XHRyZXR1cm4gKGJhc2VXaWR0aCAvIGRhdGFzZXRDb3VudCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLmRhdGFzZXRzID0gW107XG5cblx0XHRcdC8vU2V0IHVwIHRvb2x0aXAgZXZlbnRzIG9uIHRoZSBjaGFydFxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5zaG93VG9vbHRpcHMpe1xuXHRcdFx0XHRoZWxwZXJzLmJpbmRFdmVudHModGhpcywgdGhpcy5vcHRpb25zLnRvb2x0aXBFdmVudHMsIGZ1bmN0aW9uKGV2dCl7XG5cdFx0XHRcdFx0dmFyIGFjdGl2ZUJhcnMgPSAoZXZ0LnR5cGUgIT09ICdtb3VzZW91dCcpID8gdGhpcy5nZXRCYXJzQXRFdmVudChldnQpIDogW107XG5cblx0XHRcdFx0XHR0aGlzLmVhY2hCYXJzKGZ1bmN0aW9uKGJhcil7XG5cdFx0XHRcdFx0XHRiYXIucmVzdG9yZShbJ2ZpbGxDb2xvcicsICdzdHJva2VDb2xvciddKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRoZWxwZXJzLmVhY2goYWN0aXZlQmFycywgZnVuY3Rpb24oYWN0aXZlQmFyKXtcblx0XHRcdFx0XHRcdGFjdGl2ZUJhci5maWxsQ29sb3IgPSBhY3RpdmVCYXIuaGlnaGxpZ2h0RmlsbDtcblx0XHRcdFx0XHRcdGFjdGl2ZUJhci5zdHJva2VDb2xvciA9IGFjdGl2ZUJhci5oaWdobGlnaHRTdHJva2U7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dGhpcy5zaG93VG9vbHRpcChhY3RpdmVCYXJzKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vRGVjbGFyZSB0aGUgZXh0ZW5zaW9uIG9mIHRoZSBkZWZhdWx0IHBvaW50LCB0byBjYXRlciBmb3IgdGhlIG9wdGlvbnMgcGFzc2VkIGluIHRvIHRoZSBjb25zdHJ1Y3RvclxuXHRcdFx0dGhpcy5CYXJDbGFzcyA9IENoYXJ0LlJlY3RhbmdsZS5leHRlbmQoe1xuXHRcdFx0XHRzdHJva2VXaWR0aCA6IHRoaXMub3B0aW9ucy5iYXJTdHJva2VXaWR0aCxcblx0XHRcdFx0c2hvd1N0cm9rZSA6IHRoaXMub3B0aW9ucy5iYXJTaG93U3Ryb2tlLFxuXHRcdFx0XHRjdHggOiB0aGlzLmNoYXJ0LmN0eFxuXHRcdFx0fSk7XG5cblx0XHRcdC8vSXRlcmF0ZSB0aHJvdWdoIGVhY2ggb2YgdGhlIGRhdGFzZXRzLCBhbmQgYnVpbGQgdGhpcyBpbnRvIGEgcHJvcGVydHkgb2YgdGhlIGNoYXJ0XG5cdFx0XHRoZWxwZXJzLmVhY2goZGF0YS5kYXRhc2V0cyxmdW5jdGlvbihkYXRhc2V0LGRhdGFzZXRJbmRleCl7XG5cblx0XHRcdFx0dmFyIGRhdGFzZXRPYmplY3QgPSB7XG5cdFx0XHRcdFx0bGFiZWwgOiBkYXRhc2V0LmxhYmVsIHx8IG51bGwsXG5cdFx0XHRcdFx0ZmlsbENvbG9yIDogZGF0YXNldC5maWxsQ29sb3IsXG5cdFx0XHRcdFx0c3Ryb2tlQ29sb3IgOiBkYXRhc2V0LnN0cm9rZUNvbG9yLFxuXHRcdFx0XHRcdGJhcnMgOiBbXVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHRoaXMuZGF0YXNldHMucHVzaChkYXRhc2V0T2JqZWN0KTtcblxuXHRcdFx0XHRoZWxwZXJzLmVhY2goZGF0YXNldC5kYXRhLGZ1bmN0aW9uKGRhdGFQb2ludCxpbmRleCl7XG5cdFx0XHRcdFx0Ly9BZGQgYSBuZXcgcG9pbnQgZm9yIGVhY2ggcGllY2Ugb2YgZGF0YSwgcGFzc2luZyBhbnkgcmVxdWlyZWQgZGF0YSB0byBkcmF3LlxuXHRcdFx0XHRcdGRhdGFzZXRPYmplY3QuYmFycy5wdXNoKG5ldyB0aGlzLkJhckNsYXNzKHtcblx0XHRcdFx0XHRcdHZhbHVlIDogZGF0YVBvaW50LFxuXHRcdFx0XHRcdFx0bGFiZWwgOiBkYXRhLmxhYmVsc1tpbmRleF0sXG5cdFx0XHRcdFx0XHRkYXRhc2V0TGFiZWw6IGRhdGFzZXQubGFiZWwsXG5cdFx0XHRcdFx0XHRzdHJva2VDb2xvciA6IGRhdGFzZXQuc3Ryb2tlQ29sb3IsXG5cdFx0XHRcdFx0XHRmaWxsQ29sb3IgOiBkYXRhc2V0LmZpbGxDb2xvcixcblx0XHRcdFx0XHRcdGhpZ2hsaWdodEZpbGwgOiBkYXRhc2V0LmhpZ2hsaWdodEZpbGwgfHwgZGF0YXNldC5maWxsQ29sb3IsXG5cdFx0XHRcdFx0XHRoaWdobGlnaHRTdHJva2UgOiBkYXRhc2V0LmhpZ2hsaWdodFN0cm9rZSB8fCBkYXRhc2V0LnN0cm9rZUNvbG9yXG5cdFx0XHRcdFx0fSkpO1xuXHRcdFx0XHR9LHRoaXMpO1xuXG5cdFx0XHR9LHRoaXMpO1xuXG5cdFx0XHR0aGlzLmJ1aWxkU2NhbGUoZGF0YS5sYWJlbHMpO1xuXG5cdFx0XHR0aGlzLkJhckNsYXNzLnByb3RvdHlwZS5iYXNlID0gdGhpcy5zY2FsZS5lbmRQb2ludDtcblxuXHRcdFx0dGhpcy5lYWNoQmFycyhmdW5jdGlvbihiYXIsIGluZGV4LCBkYXRhc2V0SW5kZXgpe1xuXHRcdFx0XHRoZWxwZXJzLmV4dGVuZChiYXIsIHtcblx0XHRcdFx0XHR3aWR0aCA6IHRoaXMuc2NhbGUuY2FsY3VsYXRlQmFyV2lkdGgodGhpcy5kYXRhc2V0cy5sZW5ndGgpLFxuXHRcdFx0XHRcdHg6IHRoaXMuc2NhbGUuY2FsY3VsYXRlQmFyWCh0aGlzLmRhdGFzZXRzLmxlbmd0aCwgZGF0YXNldEluZGV4LCBpbmRleCksXG5cdFx0XHRcdFx0eTogdGhpcy5zY2FsZS5lbmRQb2ludFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0YmFyLnNhdmUoKTtcblx0XHRcdH0sIHRoaXMpO1xuXG5cdFx0XHR0aGlzLnJlbmRlcigpO1xuXHRcdH0sXG5cdFx0dXBkYXRlIDogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuc2NhbGUudXBkYXRlKCk7XG5cdFx0XHQvLyBSZXNldCBhbnkgaGlnaGxpZ2h0IGNvbG91cnMgYmVmb3JlIHVwZGF0aW5nLlxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuYWN0aXZlRWxlbWVudHMsIGZ1bmN0aW9uKGFjdGl2ZUVsZW1lbnQpe1xuXHRcdFx0XHRhY3RpdmVFbGVtZW50LnJlc3RvcmUoWydmaWxsQ29sb3InLCAnc3Ryb2tlQ29sb3InXSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5lYWNoQmFycyhmdW5jdGlvbihiYXIpe1xuXHRcdFx0XHRiYXIuc2F2ZSgpO1xuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnJlbmRlcigpO1xuXHRcdH0sXG5cdFx0ZWFjaEJhcnMgOiBmdW5jdGlvbihjYWxsYmFjayl7XG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5kYXRhc2V0cyxmdW5jdGlvbihkYXRhc2V0LCBkYXRhc2V0SW5kZXgpe1xuXHRcdFx0XHRoZWxwZXJzLmVhY2goZGF0YXNldC5iYXJzLCBjYWxsYmFjaywgdGhpcywgZGF0YXNldEluZGV4KTtcblx0XHRcdH0sdGhpcyk7XG5cdFx0fSxcblx0XHRnZXRCYXJzQXRFdmVudCA6IGZ1bmN0aW9uKGUpe1xuXHRcdFx0dmFyIGJhcnNBcnJheSA9IFtdLFxuXHRcdFx0XHRldmVudFBvc2l0aW9uID0gaGVscGVycy5nZXRSZWxhdGl2ZVBvc2l0aW9uKGUpLFxuXHRcdFx0XHRkYXRhc2V0SXRlcmF0b3IgPSBmdW5jdGlvbihkYXRhc2V0KXtcblx0XHRcdFx0XHRiYXJzQXJyYXkucHVzaChkYXRhc2V0LmJhcnNbYmFySW5kZXhdKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0YmFySW5kZXg7XG5cblx0XHRcdGZvciAodmFyIGRhdGFzZXRJbmRleCA9IDA7IGRhdGFzZXRJbmRleCA8IHRoaXMuZGF0YXNldHMubGVuZ3RoOyBkYXRhc2V0SW5kZXgrKykge1xuXHRcdFx0XHRmb3IgKGJhckluZGV4ID0gMDsgYmFySW5kZXggPCB0aGlzLmRhdGFzZXRzW2RhdGFzZXRJbmRleF0uYmFycy5sZW5ndGg7IGJhckluZGV4KyspIHtcblx0XHRcdFx0XHRpZiAodGhpcy5kYXRhc2V0c1tkYXRhc2V0SW5kZXhdLmJhcnNbYmFySW5kZXhdLmluUmFuZ2UoZXZlbnRQb3NpdGlvbi54LGV2ZW50UG9zaXRpb24ueSkpe1xuXHRcdFx0XHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsIGRhdGFzZXRJdGVyYXRvcik7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYmFyc0FycmF5O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gYmFyc0FycmF5O1xuXHRcdH0sXG5cdFx0YnVpbGRTY2FsZSA6IGZ1bmN0aW9uKGxhYmVscyl7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRcdHZhciBkYXRhVG90YWwgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgdmFsdWVzID0gW107XG5cdFx0XHRcdHNlbGYuZWFjaEJhcnMoZnVuY3Rpb24oYmFyKXtcblx0XHRcdFx0XHR2YWx1ZXMucHVzaChiYXIudmFsdWUpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIHZhbHVlcztcblx0XHRcdH07XG5cblx0XHRcdHZhciBzY2FsZU9wdGlvbnMgPSB7XG5cdFx0XHRcdHRlbXBsYXRlU3RyaW5nIDogdGhpcy5vcHRpb25zLnNjYWxlTGFiZWwsXG5cdFx0XHRcdGhlaWdodCA6IHRoaXMuY2hhcnQuaGVpZ2h0LFxuXHRcdFx0XHR3aWR0aCA6IHRoaXMuY2hhcnQud2lkdGgsXG5cdFx0XHRcdGN0eCA6IHRoaXMuY2hhcnQuY3R4LFxuXHRcdFx0XHR0ZXh0Q29sb3IgOiB0aGlzLm9wdGlvbnMuc2NhbGVGb250Q29sb3IsXG5cdFx0XHRcdGZvbnRTaXplIDogdGhpcy5vcHRpb25zLnNjYWxlRm9udFNpemUsXG5cdFx0XHRcdGZvbnRTdHlsZSA6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTdHlsZSxcblx0XHRcdFx0Zm9udEZhbWlseSA6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRGYW1pbHksXG5cdFx0XHRcdHZhbHVlc0NvdW50IDogbGFiZWxzLmxlbmd0aCxcblx0XHRcdFx0YmVnaW5BdFplcm8gOiB0aGlzLm9wdGlvbnMuc2NhbGVCZWdpbkF0WmVybyxcblx0XHRcdFx0aW50ZWdlcnNPbmx5IDogdGhpcy5vcHRpb25zLnNjYWxlSW50ZWdlcnNPbmx5LFxuXHRcdFx0XHRjYWxjdWxhdGVZUmFuZ2U6IGZ1bmN0aW9uKGN1cnJlbnRIZWlnaHQpe1xuXHRcdFx0XHRcdHZhciB1cGRhdGVkUmFuZ2VzID0gaGVscGVycy5jYWxjdWxhdGVTY2FsZVJhbmdlKFxuXHRcdFx0XHRcdFx0ZGF0YVRvdGFsKCksXG5cdFx0XHRcdFx0XHRjdXJyZW50SGVpZ2h0LFxuXHRcdFx0XHRcdFx0dGhpcy5mb250U2l6ZSxcblx0XHRcdFx0XHRcdHRoaXMuYmVnaW5BdFplcm8sXG5cdFx0XHRcdFx0XHR0aGlzLmludGVnZXJzT25seVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0aGVscGVycy5leHRlbmQodGhpcywgdXBkYXRlZFJhbmdlcyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHhMYWJlbHMgOiBsYWJlbHMsXG5cdFx0XHRcdGZvbnQgOiBoZWxwZXJzLmZvbnRTdHJpbmcodGhpcy5vcHRpb25zLnNjYWxlRm9udFNpemUsIHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTdHlsZSwgdGhpcy5vcHRpb25zLnNjYWxlRm9udEZhbWlseSksXG5cdFx0XHRcdGxpbmVXaWR0aCA6IHRoaXMub3B0aW9ucy5zY2FsZUxpbmVXaWR0aCxcblx0XHRcdFx0bGluZUNvbG9yIDogdGhpcy5vcHRpb25zLnNjYWxlTGluZUNvbG9yLFxuXHRcdFx0XHRzaG93SG9yaXpvbnRhbExpbmVzIDogdGhpcy5vcHRpb25zLnNjYWxlU2hvd0hvcml6b250YWxMaW5lcyxcblx0XHRcdFx0c2hvd1ZlcnRpY2FsTGluZXMgOiB0aGlzLm9wdGlvbnMuc2NhbGVTaG93VmVydGljYWxMaW5lcyxcblx0XHRcdFx0Z3JpZExpbmVXaWR0aCA6ICh0aGlzLm9wdGlvbnMuc2NhbGVTaG93R3JpZExpbmVzKSA/IHRoaXMub3B0aW9ucy5zY2FsZUdyaWRMaW5lV2lkdGggOiAwLFxuXHRcdFx0XHRncmlkTGluZUNvbG9yIDogKHRoaXMub3B0aW9ucy5zY2FsZVNob3dHcmlkTGluZXMpID8gdGhpcy5vcHRpb25zLnNjYWxlR3JpZExpbmVDb2xvciA6IFwicmdiYSgwLDAsMCwwKVwiLFxuXHRcdFx0XHRwYWRkaW5nIDogKHRoaXMub3B0aW9ucy5zaG93U2NhbGUpID8gMCA6ICh0aGlzLm9wdGlvbnMuYmFyU2hvd1N0cm9rZSkgPyB0aGlzLm9wdGlvbnMuYmFyU3Ryb2tlV2lkdGggOiAwLFxuXHRcdFx0XHRzaG93TGFiZWxzIDogdGhpcy5vcHRpb25zLnNjYWxlU2hvd0xhYmVscyxcblx0XHRcdFx0ZGlzcGxheSA6IHRoaXMub3B0aW9ucy5zaG93U2NhbGVcblx0XHRcdH07XG5cblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuc2NhbGVPdmVycmlkZSl7XG5cdFx0XHRcdGhlbHBlcnMuZXh0ZW5kKHNjYWxlT3B0aW9ucywge1xuXHRcdFx0XHRcdGNhbGN1bGF0ZVlSYW5nZTogaGVscGVycy5ub29wLFxuXHRcdFx0XHRcdHN0ZXBzOiB0aGlzLm9wdGlvbnMuc2NhbGVTdGVwcyxcblx0XHRcdFx0XHRzdGVwVmFsdWU6IHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBXaWR0aCxcblx0XHRcdFx0XHRtaW46IHRoaXMub3B0aW9ucy5zY2FsZVN0YXJ0VmFsdWUsXG5cdFx0XHRcdFx0bWF4OiB0aGlzLm9wdGlvbnMuc2NhbGVTdGFydFZhbHVlICsgKHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBzICogdGhpcy5vcHRpb25zLnNjYWxlU3RlcFdpZHRoKVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5zY2FsZSA9IG5ldyB0aGlzLlNjYWxlQ2xhc3Moc2NhbGVPcHRpb25zKTtcblx0XHR9LFxuXHRcdGFkZERhdGEgOiBmdW5jdGlvbih2YWx1ZXNBcnJheSxsYWJlbCl7XG5cdFx0XHQvL01hcCB0aGUgdmFsdWVzIGFycmF5IGZvciBlYWNoIG9mIHRoZSBkYXRhc2V0c1xuXHRcdFx0aGVscGVycy5lYWNoKHZhbHVlc0FycmF5LGZ1bmN0aW9uKHZhbHVlLGRhdGFzZXRJbmRleCl7XG5cdFx0XHRcdC8vQWRkIGEgbmV3IHBvaW50IGZvciBlYWNoIHBpZWNlIG9mIGRhdGEsIHBhc3NpbmcgYW55IHJlcXVpcmVkIGRhdGEgdG8gZHJhdy5cblx0XHRcdFx0dGhpcy5kYXRhc2V0c1tkYXRhc2V0SW5kZXhdLmJhcnMucHVzaChuZXcgdGhpcy5CYXJDbGFzcyh7XG5cdFx0XHRcdFx0dmFsdWUgOiB2YWx1ZSxcblx0XHRcdFx0XHRsYWJlbCA6IGxhYmVsLFxuXHRcdFx0XHRcdHg6IHRoaXMuc2NhbGUuY2FsY3VsYXRlQmFyWCh0aGlzLmRhdGFzZXRzLmxlbmd0aCwgZGF0YXNldEluZGV4LCB0aGlzLnNjYWxlLnZhbHVlc0NvdW50KzEpLFxuXHRcdFx0XHRcdHk6IHRoaXMuc2NhbGUuZW5kUG9pbnQsXG5cdFx0XHRcdFx0d2lkdGggOiB0aGlzLnNjYWxlLmNhbGN1bGF0ZUJhcldpZHRoKHRoaXMuZGF0YXNldHMubGVuZ3RoKSxcblx0XHRcdFx0XHRiYXNlIDogdGhpcy5zY2FsZS5lbmRQb2ludCxcblx0XHRcdFx0XHRzdHJva2VDb2xvciA6IHRoaXMuZGF0YXNldHNbZGF0YXNldEluZGV4XS5zdHJva2VDb2xvcixcblx0XHRcdFx0XHRmaWxsQ29sb3IgOiB0aGlzLmRhdGFzZXRzW2RhdGFzZXRJbmRleF0uZmlsbENvbG9yXG5cdFx0XHRcdH0pKTtcblx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdHRoaXMuc2NhbGUuYWRkWExhYmVsKGxhYmVsKTtcblx0XHRcdC8vVGhlbiByZS1yZW5kZXIgdGhlIGNoYXJ0LlxuXHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHR9LFxuXHRcdHJlbW92ZURhdGEgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5zY2FsZS5yZW1vdmVYTGFiZWwoKTtcblx0XHRcdC8vVGhlbiByZS1yZW5kZXIgdGhlIGNoYXJ0LlxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCl7XG5cdFx0XHRcdGRhdGFzZXQuYmFycy5zaGlmdCgpO1xuXHRcdFx0fSx0aGlzKTtcblx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0fSxcblx0XHRyZWZsb3cgOiBmdW5jdGlvbigpe1xuXHRcdFx0aGVscGVycy5leHRlbmQodGhpcy5CYXJDbGFzcy5wcm90b3R5cGUse1xuXHRcdFx0XHR5OiB0aGlzLnNjYWxlLmVuZFBvaW50LFxuXHRcdFx0XHRiYXNlIDogdGhpcy5zY2FsZS5lbmRQb2ludFxuXHRcdFx0fSk7XG5cdFx0XHR2YXIgbmV3U2NhbGVQcm9wcyA9IGhlbHBlcnMuZXh0ZW5kKHtcblx0XHRcdFx0aGVpZ2h0IDogdGhpcy5jaGFydC5oZWlnaHQsXG5cdFx0XHRcdHdpZHRoIDogdGhpcy5jaGFydC53aWR0aFxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnNjYWxlLnVwZGF0ZShuZXdTY2FsZVByb3BzKTtcblx0XHR9LFxuXHRcdGRyYXcgOiBmdW5jdGlvbihlYXNlKXtcblx0XHRcdHZhciBlYXNpbmdEZWNpbWFsID0gZWFzZSB8fCAxO1xuXHRcdFx0dGhpcy5jbGVhcigpO1xuXG5cdFx0XHR2YXIgY3R4ID0gdGhpcy5jaGFydC5jdHg7XG5cblx0XHRcdHRoaXMuc2NhbGUuZHJhdyhlYXNpbmdEZWNpbWFsKTtcblxuXHRcdFx0Ly9EcmF3IGFsbCB0aGUgYmFycyBmb3IgZWFjaCBkYXRhc2V0XG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5kYXRhc2V0cyxmdW5jdGlvbihkYXRhc2V0LGRhdGFzZXRJbmRleCl7XG5cdFx0XHRcdGhlbHBlcnMuZWFjaChkYXRhc2V0LmJhcnMsZnVuY3Rpb24oYmFyLGluZGV4KXtcblx0XHRcdFx0XHRpZiAoYmFyLmhhc1ZhbHVlKCkpe1xuXHRcdFx0XHRcdFx0YmFyLmJhc2UgPSB0aGlzLnNjYWxlLmVuZFBvaW50O1xuXHRcdFx0XHRcdFx0Ly9UcmFuc2l0aW9uIHRoZW4gZHJhd1xuXHRcdFx0XHRcdFx0YmFyLnRyYW5zaXRpb24oe1xuXHRcdFx0XHRcdFx0XHR4IDogdGhpcy5zY2FsZS5jYWxjdWxhdGVCYXJYKHRoaXMuZGF0YXNldHMubGVuZ3RoLCBkYXRhc2V0SW5kZXgsIGluZGV4KSxcblx0XHRcdFx0XHRcdFx0eSA6IHRoaXMuc2NhbGUuY2FsY3VsYXRlWShiYXIudmFsdWUpLFxuXHRcdFx0XHRcdFx0XHR3aWR0aCA6IHRoaXMuc2NhbGUuY2FsY3VsYXRlQmFyV2lkdGgodGhpcy5kYXRhc2V0cy5sZW5ndGgpXG5cdFx0XHRcdFx0XHR9LCBlYXNpbmdEZWNpbWFsKS5kcmF3KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LHRoaXMpO1xuXG5cdFx0XHR9LHRoaXMpO1xuXHRcdH1cblx0fSk7XG5cblxufSkuY2FsbCh0aGlzKTtcblxuKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciByb290ID0gdGhpcyxcblx0XHRDaGFydCA9IHJvb3QuQ2hhcnQsXG5cdFx0Ly9DYWNoZSBhIGxvY2FsIHJlZmVyZW5jZSB0byBDaGFydC5oZWxwZXJzXG5cdFx0aGVscGVycyA9IENoYXJ0LmhlbHBlcnM7XG5cblx0dmFyIGRlZmF1bHRDb25maWcgPSB7XG5cdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB3ZSBzaG91bGQgc2hvdyBhIHN0cm9rZSBvbiBlYWNoIHNlZ21lbnRcblx0XHRzZWdtZW50U2hvd1N0cm9rZSA6IHRydWUsXG5cblx0XHQvL1N0cmluZyAtIFRoZSBjb2xvdXIgb2YgZWFjaCBzZWdtZW50IHN0cm9rZVxuXHRcdHNlZ21lbnRTdHJva2VDb2xvciA6IFwiI2ZmZlwiLFxuXG5cdFx0Ly9OdW1iZXIgLSBUaGUgd2lkdGggb2YgZWFjaCBzZWdtZW50IHN0cm9rZVxuXHRcdHNlZ21lbnRTdHJva2VXaWR0aCA6IDIsXG5cblx0XHQvL1RoZSBwZXJjZW50YWdlIG9mIHRoZSBjaGFydCB0aGF0IHdlIGN1dCBvdXQgb2YgdGhlIG1pZGRsZS5cblx0XHRwZXJjZW50YWdlSW5uZXJDdXRvdXQgOiA1MCxcblxuXHRcdC8vTnVtYmVyIC0gQW1vdW50IG9mIGFuaW1hdGlvbiBzdGVwc1xuXHRcdGFuaW1hdGlvblN0ZXBzIDogMTAwLFxuXG5cdFx0Ly9TdHJpbmcgLSBBbmltYXRpb24gZWFzaW5nIGVmZmVjdFxuXHRcdGFuaW1hdGlvbkVhc2luZyA6IFwiZWFzZU91dEJvdW5jZVwiLFxuXG5cdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB3ZSBhbmltYXRlIHRoZSByb3RhdGlvbiBvZiB0aGUgRG91Z2hudXRcblx0XHRhbmltYXRlUm90YXRlIDogdHJ1ZSxcblxuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgd2UgYW5pbWF0ZSBzY2FsaW5nIHRoZSBEb3VnaG51dCBmcm9tIHRoZSBjZW50cmVcblx0XHRhbmltYXRlU2NhbGUgOiBmYWxzZSxcblxuXHRcdC8vU3RyaW5nIC0gQSBsZWdlbmQgdGVtcGxhdGVcblx0XHRsZWdlbmRUZW1wbGF0ZSA6IFwiPHVsIGNsYXNzPVxcXCI8JT1uYW1lLnRvTG93ZXJDYXNlKCklPi1sZWdlbmRcXFwiPjwlIGZvciAodmFyIGk9MDsgaTxzZWdtZW50cy5sZW5ndGg7IGkrKyl7JT48bGk+PHNwYW4gc3R5bGU9XFxcImJhY2tncm91bmQtY29sb3I6PCU9c2VnbWVudHNbaV0uZmlsbENvbG9yJT5cXFwiPjwvc3Bhbj48JWlmKHNlZ21lbnRzW2ldLmxhYmVsKXslPjwlPXNlZ21lbnRzW2ldLmxhYmVsJT48JX0lPjwvbGk+PCV9JT48L3VsPlwiXG5cblx0fTtcblxuXG5cdENoYXJ0LlR5cGUuZXh0ZW5kKHtcblx0XHQvL1Bhc3NpbmcgaW4gYSBuYW1lIHJlZ2lzdGVycyB0aGlzIGNoYXJ0IGluIHRoZSBDaGFydCBuYW1lc3BhY2Vcblx0XHRuYW1lOiBcIkRvdWdobnV0XCIsXG5cdFx0Ly9Qcm92aWRpbmcgYSBkZWZhdWx0cyB3aWxsIGFsc28gcmVnaXN0ZXIgdGhlIGRlYWZ1bHRzIGluIHRoZSBjaGFydCBuYW1lc3BhY2Vcblx0XHRkZWZhdWx0cyA6IGRlZmF1bHRDb25maWcsXG5cdFx0Ly9Jbml0aWFsaXplIGlzIGZpcmVkIHdoZW4gdGhlIGNoYXJ0IGlzIGluaXRpYWxpemVkIC0gRGF0YSBpcyBwYXNzZWQgaW4gYXMgYSBwYXJhbWV0ZXJcblx0XHQvL0NvbmZpZyBpcyBhdXRvbWF0aWNhbGx5IG1lcmdlZCBieSB0aGUgY29yZSBvZiBDaGFydC5qcywgYW5kIGlzIGF2YWlsYWJsZSBhdCB0aGlzLm9wdGlvbnNcblx0XHRpbml0aWFsaXplOiAgZnVuY3Rpb24oZGF0YSl7XG5cblx0XHRcdC8vRGVjbGFyZSBzZWdtZW50cyBhcyBhIHN0YXRpYyBwcm9wZXJ0eSB0byBwcmV2ZW50IGluaGVyaXRpbmcgYWNyb3NzIHRoZSBDaGFydCB0eXBlIHByb3RvdHlwZVxuXHRcdFx0dGhpcy5zZWdtZW50cyA9IFtdO1xuXHRcdFx0dGhpcy5vdXRlclJhZGl1cyA9IChoZWxwZXJzLm1pbihbdGhpcy5jaGFydC53aWR0aCx0aGlzLmNoYXJ0LmhlaWdodF0pIC1cdHRoaXMub3B0aW9ucy5zZWdtZW50U3Ryb2tlV2lkdGgvMikvMjtcblxuXHRcdFx0dGhpcy5TZWdtZW50QXJjID0gQ2hhcnQuQXJjLmV4dGVuZCh7XG5cdFx0XHRcdGN0eCA6IHRoaXMuY2hhcnQuY3R4LFxuXHRcdFx0XHR4IDogdGhpcy5jaGFydC53aWR0aC8yLFxuXHRcdFx0XHR5IDogdGhpcy5jaGFydC5oZWlnaHQvMlxuXHRcdFx0fSk7XG5cblx0XHRcdC8vU2V0IHVwIHRvb2x0aXAgZXZlbnRzIG9uIHRoZSBjaGFydFxuXHRcdFx0aWYgKHRoaXMub3B0aW9ucy5zaG93VG9vbHRpcHMpe1xuXHRcdFx0XHRoZWxwZXJzLmJpbmRFdmVudHModGhpcywgdGhpcy5vcHRpb25zLnRvb2x0aXBFdmVudHMsIGZ1bmN0aW9uKGV2dCl7XG5cdFx0XHRcdFx0dmFyIGFjdGl2ZVNlZ21lbnRzID0gKGV2dC50eXBlICE9PSAnbW91c2VvdXQnKSA/IHRoaXMuZ2V0U2VnbWVudHNBdEV2ZW50KGV2dCkgOiBbXTtcblxuXHRcdFx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLnNlZ21lbnRzLGZ1bmN0aW9uKHNlZ21lbnQpe1xuXHRcdFx0XHRcdFx0c2VnbWVudC5yZXN0b3JlKFtcImZpbGxDb2xvclwiXSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0aGVscGVycy5lYWNoKGFjdGl2ZVNlZ21lbnRzLGZ1bmN0aW9uKGFjdGl2ZVNlZ21lbnQpe1xuXHRcdFx0XHRcdFx0YWN0aXZlU2VnbWVudC5maWxsQ29sb3IgPSBhY3RpdmVTZWdtZW50LmhpZ2hsaWdodENvbG9yO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHRoaXMuc2hvd1Rvb2x0aXAoYWN0aXZlU2VnbWVudHMpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHRoaXMuY2FsY3VsYXRlVG90YWwoZGF0YSk7XG5cblx0XHRcdGhlbHBlcnMuZWFjaChkYXRhLGZ1bmN0aW9uKGRhdGFwb2ludCwgaW5kZXgpe1xuXHRcdFx0XHR0aGlzLmFkZERhdGEoZGF0YXBvaW50LCBpbmRleCwgdHJ1ZSk7XG5cdFx0XHR9LHRoaXMpO1xuXG5cdFx0XHR0aGlzLnJlbmRlcigpO1xuXHRcdH0sXG5cdFx0Z2V0U2VnbWVudHNBdEV2ZW50IDogZnVuY3Rpb24oZSl7XG5cdFx0XHR2YXIgc2VnbWVudHNBcnJheSA9IFtdO1xuXG5cdFx0XHR2YXIgbG9jYXRpb24gPSBoZWxwZXJzLmdldFJlbGF0aXZlUG9zaXRpb24oZSk7XG5cblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLnNlZ21lbnRzLGZ1bmN0aW9uKHNlZ21lbnQpe1xuXHRcdFx0XHRpZiAoc2VnbWVudC5pblJhbmdlKGxvY2F0aW9uLngsbG9jYXRpb24ueSkpIHNlZ21lbnRzQXJyYXkucHVzaChzZWdtZW50KTtcblx0XHRcdH0sdGhpcyk7XG5cdFx0XHRyZXR1cm4gc2VnbWVudHNBcnJheTtcblx0XHR9LFxuXHRcdGFkZERhdGEgOiBmdW5jdGlvbihzZWdtZW50LCBhdEluZGV4LCBzaWxlbnQpe1xuXHRcdFx0dmFyIGluZGV4ID0gYXRJbmRleCB8fCB0aGlzLnNlZ21lbnRzLmxlbmd0aDtcblx0XHRcdHRoaXMuc2VnbWVudHMuc3BsaWNlKGluZGV4LCAwLCBuZXcgdGhpcy5TZWdtZW50QXJjKHtcblx0XHRcdFx0dmFsdWUgOiBzZWdtZW50LnZhbHVlLFxuXHRcdFx0XHRvdXRlclJhZGl1cyA6ICh0aGlzLm9wdGlvbnMuYW5pbWF0ZVNjYWxlKSA/IDAgOiB0aGlzLm91dGVyUmFkaXVzLFxuXHRcdFx0XHRpbm5lclJhZGl1cyA6ICh0aGlzLm9wdGlvbnMuYW5pbWF0ZVNjYWxlKSA/IDAgOiAodGhpcy5vdXRlclJhZGl1cy8xMDApICogdGhpcy5vcHRpb25zLnBlcmNlbnRhZ2VJbm5lckN1dG91dCxcblx0XHRcdFx0ZmlsbENvbG9yIDogc2VnbWVudC5jb2xvcixcblx0XHRcdFx0aGlnaGxpZ2h0Q29sb3IgOiBzZWdtZW50LmhpZ2hsaWdodCB8fCBzZWdtZW50LmNvbG9yLFxuXHRcdFx0XHRzaG93U3Ryb2tlIDogdGhpcy5vcHRpb25zLnNlZ21lbnRTaG93U3Ryb2tlLFxuXHRcdFx0XHRzdHJva2VXaWR0aCA6IHRoaXMub3B0aW9ucy5zZWdtZW50U3Ryb2tlV2lkdGgsXG5cdFx0XHRcdHN0cm9rZUNvbG9yIDogdGhpcy5vcHRpb25zLnNlZ21lbnRTdHJva2VDb2xvcixcblx0XHRcdFx0c3RhcnRBbmdsZSA6IE1hdGguUEkgKiAxLjUsXG5cdFx0XHRcdGNpcmN1bWZlcmVuY2UgOiAodGhpcy5vcHRpb25zLmFuaW1hdGVSb3RhdGUpID8gMCA6IHRoaXMuY2FsY3VsYXRlQ2lyY3VtZmVyZW5jZShzZWdtZW50LnZhbHVlKSxcblx0XHRcdFx0bGFiZWwgOiBzZWdtZW50LmxhYmVsXG5cdFx0XHR9KSk7XG5cdFx0XHRpZiAoIXNpbGVudCl7XG5cdFx0XHRcdHRoaXMucmVmbG93KCk7XG5cdFx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRjYWxjdWxhdGVDaXJjdW1mZXJlbmNlIDogZnVuY3Rpb24odmFsdWUpe1xuXHRcdFx0cmV0dXJuIChNYXRoLlBJKjIpKihNYXRoLmFicyh2YWx1ZSkgLyB0aGlzLnRvdGFsKTtcblx0XHR9LFxuXHRcdGNhbGN1bGF0ZVRvdGFsIDogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHR0aGlzLnRvdGFsID0gMDtcblx0XHRcdGhlbHBlcnMuZWFjaChkYXRhLGZ1bmN0aW9uKHNlZ21lbnQpe1xuXHRcdFx0XHR0aGlzLnRvdGFsICs9IE1hdGguYWJzKHNlZ21lbnQudmFsdWUpO1xuXHRcdFx0fSx0aGlzKTtcblx0XHR9LFxuXHRcdHVwZGF0ZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLmNhbGN1bGF0ZVRvdGFsKHRoaXMuc2VnbWVudHMpO1xuXG5cdFx0XHQvLyBSZXNldCBhbnkgaGlnaGxpZ2h0IGNvbG91cnMgYmVmb3JlIHVwZGF0aW5nLlxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuYWN0aXZlRWxlbWVudHMsIGZ1bmN0aW9uKGFjdGl2ZUVsZW1lbnQpe1xuXHRcdFx0XHRhY3RpdmVFbGVtZW50LnJlc3RvcmUoWydmaWxsQ29sb3InXSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuc2VnbWVudHMsZnVuY3Rpb24oc2VnbWVudCl7XG5cdFx0XHRcdHNlZ21lbnQuc2F2ZSgpO1xuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnJlbmRlcigpO1xuXHRcdH0sXG5cblx0XHRyZW1vdmVEYXRhOiBmdW5jdGlvbihhdEluZGV4KXtcblx0XHRcdHZhciBpbmRleFRvRGVsZXRlID0gKGhlbHBlcnMuaXNOdW1iZXIoYXRJbmRleCkpID8gYXRJbmRleCA6IHRoaXMuc2VnbWVudHMubGVuZ3RoLTE7XG5cdFx0XHR0aGlzLnNlZ21lbnRzLnNwbGljZShpbmRleFRvRGVsZXRlLCAxKTtcblx0XHRcdHRoaXMucmVmbG93KCk7XG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdH0sXG5cblx0XHRyZWZsb3cgOiBmdW5jdGlvbigpe1xuXHRcdFx0aGVscGVycy5leHRlbmQodGhpcy5TZWdtZW50QXJjLnByb3RvdHlwZSx7XG5cdFx0XHRcdHggOiB0aGlzLmNoYXJ0LndpZHRoLzIsXG5cdFx0XHRcdHkgOiB0aGlzLmNoYXJ0LmhlaWdodC8yXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMub3V0ZXJSYWRpdXMgPSAoaGVscGVycy5taW4oW3RoaXMuY2hhcnQud2lkdGgsdGhpcy5jaGFydC5oZWlnaHRdKSAtXHR0aGlzLm9wdGlvbnMuc2VnbWVudFN0cm9rZVdpZHRoLzIpLzI7XG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5zZWdtZW50cywgZnVuY3Rpb24oc2VnbWVudCl7XG5cdFx0XHRcdHNlZ21lbnQudXBkYXRlKHtcblx0XHRcdFx0XHRvdXRlclJhZGl1cyA6IHRoaXMub3V0ZXJSYWRpdXMsXG5cdFx0XHRcdFx0aW5uZXJSYWRpdXMgOiAodGhpcy5vdXRlclJhZGl1cy8xMDApICogdGhpcy5vcHRpb25zLnBlcmNlbnRhZ2VJbm5lckN1dG91dFxuXHRcdFx0XHR9KTtcblx0XHRcdH0sIHRoaXMpO1xuXHRcdH0sXG5cdFx0ZHJhdyA6IGZ1bmN0aW9uKGVhc2VEZWNpbWFsKXtcblx0XHRcdHZhciBhbmltRGVjaW1hbCA9IChlYXNlRGVjaW1hbCkgPyBlYXNlRGVjaW1hbCA6IDE7XG5cdFx0XHR0aGlzLmNsZWFyKCk7XG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5zZWdtZW50cyxmdW5jdGlvbihzZWdtZW50LGluZGV4KXtcblx0XHRcdFx0c2VnbWVudC50cmFuc2l0aW9uKHtcblx0XHRcdFx0XHRjaXJjdW1mZXJlbmNlIDogdGhpcy5jYWxjdWxhdGVDaXJjdW1mZXJlbmNlKHNlZ21lbnQudmFsdWUpLFxuXHRcdFx0XHRcdG91dGVyUmFkaXVzIDogdGhpcy5vdXRlclJhZGl1cyxcblx0XHRcdFx0XHRpbm5lclJhZGl1cyA6ICh0aGlzLm91dGVyUmFkaXVzLzEwMCkgKiB0aGlzLm9wdGlvbnMucGVyY2VudGFnZUlubmVyQ3V0b3V0XG5cdFx0XHRcdH0sYW5pbURlY2ltYWwpO1xuXG5cdFx0XHRcdHNlZ21lbnQuZW5kQW5nbGUgPSBzZWdtZW50LnN0YXJ0QW5nbGUgKyBzZWdtZW50LmNpcmN1bWZlcmVuY2U7XG5cblx0XHRcdFx0c2VnbWVudC5kcmF3KCk7XG5cdFx0XHRcdGlmIChpbmRleCA9PT0gMCl7XG5cdFx0XHRcdFx0c2VnbWVudC5zdGFydEFuZ2xlID0gTWF0aC5QSSAqIDEuNTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvL0NoZWNrIHRvIHNlZSBpZiBpdCdzIHRoZSBsYXN0IHNlZ21lbnQsIGlmIG5vdCBnZXQgdGhlIG5leHQgYW5kIHVwZGF0ZSB0aGUgc3RhcnQgYW5nbGVcblx0XHRcdFx0aWYgKGluZGV4IDwgdGhpcy5zZWdtZW50cy5sZW5ndGgtMSl7XG5cdFx0XHRcdFx0dGhpcy5zZWdtZW50c1tpbmRleCsxXS5zdGFydEFuZ2xlID0gc2VnbWVudC5lbmRBbmdsZTtcblx0XHRcdFx0fVxuXHRcdFx0fSx0aGlzKTtcblxuXHRcdH1cblx0fSk7XG5cblx0Q2hhcnQudHlwZXMuRG91Z2hudXQuZXh0ZW5kKHtcblx0XHRuYW1lIDogXCJQaWVcIixcblx0XHRkZWZhdWx0cyA6IGhlbHBlcnMubWVyZ2UoZGVmYXVsdENvbmZpZyx7cGVyY2VudGFnZUlubmVyQ3V0b3V0IDogMH0pXG5cdH0pO1xuXG59KS5jYWxsKHRoaXMpO1xuKGZ1bmN0aW9uKCl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciByb290ID0gdGhpcyxcblx0XHRDaGFydCA9IHJvb3QuQ2hhcnQsXG5cdFx0aGVscGVycyA9IENoYXJ0LmhlbHBlcnM7XG5cblx0dmFyIGRlZmF1bHRDb25maWcgPSB7XG5cblx0XHQvLy9Cb29sZWFuIC0gV2hldGhlciBncmlkIGxpbmVzIGFyZSBzaG93biBhY3Jvc3MgdGhlIGNoYXJ0XG5cdFx0c2NhbGVTaG93R3JpZExpbmVzIDogdHJ1ZSxcblxuXHRcdC8vU3RyaW5nIC0gQ29sb3VyIG9mIHRoZSBncmlkIGxpbmVzXG5cdFx0c2NhbGVHcmlkTGluZUNvbG9yIDogXCJyZ2JhKDAsMCwwLC4wNSlcIixcblxuXHRcdC8vTnVtYmVyIC0gV2lkdGggb2YgdGhlIGdyaWQgbGluZXNcblx0XHRzY2FsZUdyaWRMaW5lV2lkdGggOiAxLFxuXG5cdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB0byBzaG93IGhvcml6b250YWwgbGluZXMgKGV4Y2VwdCBYIGF4aXMpXG5cdFx0c2NhbGVTaG93SG9yaXpvbnRhbExpbmVzOiB0cnVlLFxuXG5cdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB0byBzaG93IHZlcnRpY2FsIGxpbmVzIChleGNlcHQgWSBheGlzKVxuXHRcdHNjYWxlU2hvd1ZlcnRpY2FsTGluZXM6IHRydWUsXG5cblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRoZSBsaW5lIGlzIGN1cnZlZCBiZXR3ZWVuIHBvaW50c1xuXHRcdGJlemllckN1cnZlIDogdHJ1ZSxcblxuXHRcdC8vTnVtYmVyIC0gVGVuc2lvbiBvZiB0aGUgYmV6aWVyIGN1cnZlIGJldHdlZW4gcG9pbnRzXG5cdFx0YmV6aWVyQ3VydmVUZW5zaW9uIDogMC40LFxuXG5cdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB0byBzaG93IGEgZG90IGZvciBlYWNoIHBvaW50XG5cdFx0cG9pbnREb3QgOiB0cnVlLFxuXG5cdFx0Ly9OdW1iZXIgLSBSYWRpdXMgb2YgZWFjaCBwb2ludCBkb3QgaW4gcGl4ZWxzXG5cdFx0cG9pbnREb3RSYWRpdXMgOiA0LFxuXG5cdFx0Ly9OdW1iZXIgLSBQaXhlbCB3aWR0aCBvZiBwb2ludCBkb3Qgc3Ryb2tlXG5cdFx0cG9pbnREb3RTdHJva2VXaWR0aCA6IDEsXG5cblx0XHQvL051bWJlciAtIGFtb3VudCBleHRyYSB0byBhZGQgdG8gdGhlIHJhZGl1cyB0byBjYXRlciBmb3IgaGl0IGRldGVjdGlvbiBvdXRzaWRlIHRoZSBkcmF3biBwb2ludFxuXHRcdHBvaW50SGl0RGV0ZWN0aW9uUmFkaXVzIDogMjAsXG5cblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIHNob3cgYSBzdHJva2UgZm9yIGRhdGFzZXRzXG5cdFx0ZGF0YXNldFN0cm9rZSA6IHRydWUsXG5cblx0XHQvL051bWJlciAtIFBpeGVsIHdpZHRoIG9mIGRhdGFzZXQgc3Ryb2tlXG5cdFx0ZGF0YXNldFN0cm9rZVdpZHRoIDogMixcblxuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdG8gZmlsbCB0aGUgZGF0YXNldCB3aXRoIGEgY29sb3VyXG5cdFx0ZGF0YXNldEZpbGwgOiB0cnVlLFxuXG5cdFx0Ly9TdHJpbmcgLSBBIGxlZ2VuZCB0ZW1wbGF0ZVxuXHRcdGxlZ2VuZFRlbXBsYXRlIDogXCI8dWwgY2xhc3M9XFxcIjwlPW5hbWUudG9Mb3dlckNhc2UoKSU+LWxlZ2VuZFxcXCI+PCUgZm9yICh2YXIgaT0wOyBpPGRhdGFzZXRzLmxlbmd0aDsgaSsrKXslPjxsaT48c3BhbiBzdHlsZT1cXFwiYmFja2dyb3VuZC1jb2xvcjo8JT1kYXRhc2V0c1tpXS5zdHJva2VDb2xvciU+XFxcIj48L3NwYW4+PCVpZihkYXRhc2V0c1tpXS5sYWJlbCl7JT48JT1kYXRhc2V0c1tpXS5sYWJlbCU+PCV9JT48L2xpPjwlfSU+PC91bD5cIlxuXG5cdH07XG5cblxuXHRDaGFydC5UeXBlLmV4dGVuZCh7XG5cdFx0bmFtZTogXCJMaW5lXCIsXG5cdFx0ZGVmYXVsdHMgOiBkZWZhdWx0Q29uZmlnLFxuXHRcdGluaXRpYWxpemU6ICBmdW5jdGlvbihkYXRhKXtcblx0XHRcdC8vRGVjbGFyZSB0aGUgZXh0ZW5zaW9uIG9mIHRoZSBkZWZhdWx0IHBvaW50LCB0byBjYXRlciBmb3IgdGhlIG9wdGlvbnMgcGFzc2VkIGluIHRvIHRoZSBjb25zdHJ1Y3RvclxuXHRcdFx0dGhpcy5Qb2ludENsYXNzID0gQ2hhcnQuUG9pbnQuZXh0ZW5kKHtcblx0XHRcdFx0c3Ryb2tlV2lkdGggOiB0aGlzLm9wdGlvbnMucG9pbnREb3RTdHJva2VXaWR0aCxcblx0XHRcdFx0cmFkaXVzIDogdGhpcy5vcHRpb25zLnBvaW50RG90UmFkaXVzLFxuXHRcdFx0XHRkaXNwbGF5OiB0aGlzLm9wdGlvbnMucG9pbnREb3QsXG5cdFx0XHRcdGhpdERldGVjdGlvblJhZGl1cyA6IHRoaXMub3B0aW9ucy5wb2ludEhpdERldGVjdGlvblJhZGl1cyxcblx0XHRcdFx0Y3R4IDogdGhpcy5jaGFydC5jdHgsXG5cdFx0XHRcdGluUmFuZ2UgOiBmdW5jdGlvbihtb3VzZVgpe1xuXHRcdFx0XHRcdHJldHVybiAoTWF0aC5wb3cobW91c2VYLXRoaXMueCwgMikgPCBNYXRoLnBvdyh0aGlzLnJhZGl1cyArIHRoaXMuaGl0RGV0ZWN0aW9uUmFkaXVzLDIpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuZGF0YXNldHMgPSBbXTtcblxuXHRcdFx0Ly9TZXQgdXAgdG9vbHRpcCBldmVudHMgb24gdGhlIGNoYXJ0XG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLnNob3dUb29sdGlwcyl7XG5cdFx0XHRcdGhlbHBlcnMuYmluZEV2ZW50cyh0aGlzLCB0aGlzLm9wdGlvbnMudG9vbHRpcEV2ZW50cywgZnVuY3Rpb24oZXZ0KXtcblx0XHRcdFx0XHR2YXIgYWN0aXZlUG9pbnRzID0gKGV2dC50eXBlICE9PSAnbW91c2VvdXQnKSA/IHRoaXMuZ2V0UG9pbnRzQXRFdmVudChldnQpIDogW107XG5cdFx0XHRcdFx0dGhpcy5lYWNoUG9pbnRzKGZ1bmN0aW9uKHBvaW50KXtcblx0XHRcdFx0XHRcdHBvaW50LnJlc3RvcmUoWydmaWxsQ29sb3InLCAnc3Ryb2tlQ29sb3InXSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0aGVscGVycy5lYWNoKGFjdGl2ZVBvaW50cywgZnVuY3Rpb24oYWN0aXZlUG9pbnQpe1xuXHRcdFx0XHRcdFx0YWN0aXZlUG9pbnQuZmlsbENvbG9yID0gYWN0aXZlUG9pbnQuaGlnaGxpZ2h0RmlsbDtcblx0XHRcdFx0XHRcdGFjdGl2ZVBvaW50LnN0cm9rZUNvbG9yID0gYWN0aXZlUG9pbnQuaGlnaGxpZ2h0U3Ryb2tlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHRoaXMuc2hvd1Rvb2x0aXAoYWN0aXZlUG9pbnRzKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vSXRlcmF0ZSB0aHJvdWdoIGVhY2ggb2YgdGhlIGRhdGFzZXRzLCBhbmQgYnVpbGQgdGhpcyBpbnRvIGEgcHJvcGVydHkgb2YgdGhlIGNoYXJ0XG5cdFx0XHRoZWxwZXJzLmVhY2goZGF0YS5kYXRhc2V0cyxmdW5jdGlvbihkYXRhc2V0KXtcblxuXHRcdFx0XHR2YXIgZGF0YXNldE9iamVjdCA9IHtcblx0XHRcdFx0XHRsYWJlbCA6IGRhdGFzZXQubGFiZWwgfHwgbnVsbCxcblx0XHRcdFx0XHRmaWxsQ29sb3IgOiBkYXRhc2V0LmZpbGxDb2xvcixcblx0XHRcdFx0XHRzdHJva2VDb2xvciA6IGRhdGFzZXQuc3Ryb2tlQ29sb3IsXG5cdFx0XHRcdFx0cG9pbnRDb2xvciA6IGRhdGFzZXQucG9pbnRDb2xvcixcblx0XHRcdFx0XHRwb2ludFN0cm9rZUNvbG9yIDogZGF0YXNldC5wb2ludFN0cm9rZUNvbG9yLFxuXHRcdFx0XHRcdHBvaW50cyA6IFtdXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dGhpcy5kYXRhc2V0cy5wdXNoKGRhdGFzZXRPYmplY3QpO1xuXG5cblx0XHRcdFx0aGVscGVycy5lYWNoKGRhdGFzZXQuZGF0YSxmdW5jdGlvbihkYXRhUG9pbnQsaW5kZXgpe1xuXHRcdFx0XHRcdC8vQWRkIGEgbmV3IHBvaW50IGZvciBlYWNoIHBpZWNlIG9mIGRhdGEsIHBhc3NpbmcgYW55IHJlcXVpcmVkIGRhdGEgdG8gZHJhdy5cblx0XHRcdFx0XHRkYXRhc2V0T2JqZWN0LnBvaW50cy5wdXNoKG5ldyB0aGlzLlBvaW50Q2xhc3Moe1xuXHRcdFx0XHRcdFx0dmFsdWUgOiBkYXRhUG9pbnQsXG5cdFx0XHRcdFx0XHRsYWJlbCA6IGRhdGEubGFiZWxzW2luZGV4XSxcblx0XHRcdFx0XHRcdGRhdGFzZXRMYWJlbDogZGF0YXNldC5sYWJlbCxcblx0XHRcdFx0XHRcdHN0cm9rZUNvbG9yIDogZGF0YXNldC5wb2ludFN0cm9rZUNvbG9yLFxuXHRcdFx0XHRcdFx0ZmlsbENvbG9yIDogZGF0YXNldC5wb2ludENvbG9yLFxuXHRcdFx0XHRcdFx0aGlnaGxpZ2h0RmlsbCA6IGRhdGFzZXQucG9pbnRIaWdobGlnaHRGaWxsIHx8IGRhdGFzZXQucG9pbnRDb2xvcixcblx0XHRcdFx0XHRcdGhpZ2hsaWdodFN0cm9rZSA6IGRhdGFzZXQucG9pbnRIaWdobGlnaHRTdHJva2UgfHwgZGF0YXNldC5wb2ludFN0cm9rZUNvbG9yXG5cdFx0XHRcdFx0fSkpO1xuXHRcdFx0XHR9LHRoaXMpO1xuXG5cdFx0XHRcdHRoaXMuYnVpbGRTY2FsZShkYXRhLmxhYmVscyk7XG5cblxuXHRcdFx0XHR0aGlzLmVhY2hQb2ludHMoZnVuY3Rpb24ocG9pbnQsIGluZGV4KXtcblx0XHRcdFx0XHRoZWxwZXJzLmV4dGVuZChwb2ludCwge1xuXHRcdFx0XHRcdFx0eDogdGhpcy5zY2FsZS5jYWxjdWxhdGVYKGluZGV4KSxcblx0XHRcdFx0XHRcdHk6IHRoaXMuc2NhbGUuZW5kUG9pbnRcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRwb2ludC5zYXZlKCk7XG5cdFx0XHRcdH0sIHRoaXMpO1xuXG5cdFx0XHR9LHRoaXMpO1xuXG5cblx0XHRcdHRoaXMucmVuZGVyKCk7XG5cdFx0fSxcblx0XHR1cGRhdGUgOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5zY2FsZS51cGRhdGUoKTtcblx0XHRcdC8vIFJlc2V0IGFueSBoaWdobGlnaHQgY29sb3VycyBiZWZvcmUgdXBkYXRpbmcuXG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5hY3RpdmVFbGVtZW50cywgZnVuY3Rpb24oYWN0aXZlRWxlbWVudCl7XG5cdFx0XHRcdGFjdGl2ZUVsZW1lbnQucmVzdG9yZShbJ2ZpbGxDb2xvcicsICdzdHJva2VDb2xvciddKTtcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5lYWNoUG9pbnRzKGZ1bmN0aW9uKHBvaW50KXtcblx0XHRcdFx0cG9pbnQuc2F2ZSgpO1xuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnJlbmRlcigpO1xuXHRcdH0sXG5cdFx0ZWFjaFBvaW50cyA6IGZ1bmN0aW9uKGNhbGxiYWNrKXtcblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLmRhdGFzZXRzLGZ1bmN0aW9uKGRhdGFzZXQpe1xuXHRcdFx0XHRoZWxwZXJzLmVhY2goZGF0YXNldC5wb2ludHMsY2FsbGJhY2ssdGhpcyk7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdH0sXG5cdFx0Z2V0UG9pbnRzQXRFdmVudCA6IGZ1bmN0aW9uKGUpe1xuXHRcdFx0dmFyIHBvaW50c0FycmF5ID0gW10sXG5cdFx0XHRcdGV2ZW50UG9zaXRpb24gPSBoZWxwZXJzLmdldFJlbGF0aXZlUG9zaXRpb24oZSk7XG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5kYXRhc2V0cyxmdW5jdGlvbihkYXRhc2V0KXtcblx0XHRcdFx0aGVscGVycy5lYWNoKGRhdGFzZXQucG9pbnRzLGZ1bmN0aW9uKHBvaW50KXtcblx0XHRcdFx0XHRpZiAocG9pbnQuaW5SYW5nZShldmVudFBvc2l0aW9uLngsZXZlbnRQb3NpdGlvbi55KSkgcG9pbnRzQXJyYXkucHVzaChwb2ludCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSx0aGlzKTtcblx0XHRcdHJldHVybiBwb2ludHNBcnJheTtcblx0XHR9LFxuXHRcdGJ1aWxkU2NhbGUgOiBmdW5jdGlvbihsYWJlbHMpe1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0XHR2YXIgZGF0YVRvdGFsID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIHZhbHVlcyA9IFtdO1xuXHRcdFx0XHRzZWxmLmVhY2hQb2ludHMoZnVuY3Rpb24ocG9pbnQpe1xuXHRcdFx0XHRcdHZhbHVlcy5wdXNoKHBvaW50LnZhbHVlKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIHZhbHVlcztcblx0XHRcdH07XG5cblx0XHRcdHZhciBzY2FsZU9wdGlvbnMgPSB7XG5cdFx0XHRcdHRlbXBsYXRlU3RyaW5nIDogdGhpcy5vcHRpb25zLnNjYWxlTGFiZWwsXG5cdFx0XHRcdGhlaWdodCA6IHRoaXMuY2hhcnQuaGVpZ2h0LFxuXHRcdFx0XHR3aWR0aCA6IHRoaXMuY2hhcnQud2lkdGgsXG5cdFx0XHRcdGN0eCA6IHRoaXMuY2hhcnQuY3R4LFxuXHRcdFx0XHR0ZXh0Q29sb3IgOiB0aGlzLm9wdGlvbnMuc2NhbGVGb250Q29sb3IsXG5cdFx0XHRcdGZvbnRTaXplIDogdGhpcy5vcHRpb25zLnNjYWxlRm9udFNpemUsXG5cdFx0XHRcdGZvbnRTdHlsZSA6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTdHlsZSxcblx0XHRcdFx0Zm9udEZhbWlseSA6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRGYW1pbHksXG5cdFx0XHRcdHZhbHVlc0NvdW50IDogbGFiZWxzLmxlbmd0aCxcblx0XHRcdFx0YmVnaW5BdFplcm8gOiB0aGlzLm9wdGlvbnMuc2NhbGVCZWdpbkF0WmVybyxcblx0XHRcdFx0aW50ZWdlcnNPbmx5IDogdGhpcy5vcHRpb25zLnNjYWxlSW50ZWdlcnNPbmx5LFxuXHRcdFx0XHRjYWxjdWxhdGVZUmFuZ2UgOiBmdW5jdGlvbihjdXJyZW50SGVpZ2h0KXtcblx0XHRcdFx0XHR2YXIgdXBkYXRlZFJhbmdlcyA9IGhlbHBlcnMuY2FsY3VsYXRlU2NhbGVSYW5nZShcblx0XHRcdFx0XHRcdGRhdGFUb3RhbCgpLFxuXHRcdFx0XHRcdFx0Y3VycmVudEhlaWdodCxcblx0XHRcdFx0XHRcdHRoaXMuZm9udFNpemUsXG5cdFx0XHRcdFx0XHR0aGlzLmJlZ2luQXRaZXJvLFxuXHRcdFx0XHRcdFx0dGhpcy5pbnRlZ2Vyc09ubHlcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGhlbHBlcnMuZXh0ZW5kKHRoaXMsIHVwZGF0ZWRSYW5nZXMpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR4TGFiZWxzIDogbGFiZWxzLFxuXHRcdFx0XHRmb250IDogaGVscGVycy5mb250U3RyaW5nKHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTaXplLCB0aGlzLm9wdGlvbnMuc2NhbGVGb250U3R5bGUsIHRoaXMub3B0aW9ucy5zY2FsZUZvbnRGYW1pbHkpLFxuXHRcdFx0XHRsaW5lV2lkdGggOiB0aGlzLm9wdGlvbnMuc2NhbGVMaW5lV2lkdGgsXG5cdFx0XHRcdGxpbmVDb2xvciA6IHRoaXMub3B0aW9ucy5zY2FsZUxpbmVDb2xvcixcblx0XHRcdFx0c2hvd0hvcml6b250YWxMaW5lcyA6IHRoaXMub3B0aW9ucy5zY2FsZVNob3dIb3Jpem9udGFsTGluZXMsXG5cdFx0XHRcdHNob3dWZXJ0aWNhbExpbmVzIDogdGhpcy5vcHRpb25zLnNjYWxlU2hvd1ZlcnRpY2FsTGluZXMsXG5cdFx0XHRcdGdyaWRMaW5lV2lkdGggOiAodGhpcy5vcHRpb25zLnNjYWxlU2hvd0dyaWRMaW5lcykgPyB0aGlzLm9wdGlvbnMuc2NhbGVHcmlkTGluZVdpZHRoIDogMCxcblx0XHRcdFx0Z3JpZExpbmVDb2xvciA6ICh0aGlzLm9wdGlvbnMuc2NhbGVTaG93R3JpZExpbmVzKSA/IHRoaXMub3B0aW9ucy5zY2FsZUdyaWRMaW5lQ29sb3IgOiBcInJnYmEoMCwwLDAsMClcIixcblx0XHRcdFx0cGFkZGluZzogKHRoaXMub3B0aW9ucy5zaG93U2NhbGUpID8gMCA6IHRoaXMub3B0aW9ucy5wb2ludERvdFJhZGl1cyArIHRoaXMub3B0aW9ucy5wb2ludERvdFN0cm9rZVdpZHRoLFxuXHRcdFx0XHRzaG93TGFiZWxzIDogdGhpcy5vcHRpb25zLnNjYWxlU2hvd0xhYmVscyxcblx0XHRcdFx0ZGlzcGxheSA6IHRoaXMub3B0aW9ucy5zaG93U2NhbGVcblx0XHRcdH07XG5cblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuc2NhbGVPdmVycmlkZSl7XG5cdFx0XHRcdGhlbHBlcnMuZXh0ZW5kKHNjYWxlT3B0aW9ucywge1xuXHRcdFx0XHRcdGNhbGN1bGF0ZVlSYW5nZTogaGVscGVycy5ub29wLFxuXHRcdFx0XHRcdHN0ZXBzOiB0aGlzLm9wdGlvbnMuc2NhbGVTdGVwcyxcblx0XHRcdFx0XHRzdGVwVmFsdWU6IHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBXaWR0aCxcblx0XHRcdFx0XHRtaW46IHRoaXMub3B0aW9ucy5zY2FsZVN0YXJ0VmFsdWUsXG5cdFx0XHRcdFx0bWF4OiB0aGlzLm9wdGlvbnMuc2NhbGVTdGFydFZhbHVlICsgKHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBzICogdGhpcy5vcHRpb25zLnNjYWxlU3RlcFdpZHRoKVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXG5cdFx0XHR0aGlzLnNjYWxlID0gbmV3IENoYXJ0LlNjYWxlKHNjYWxlT3B0aW9ucyk7XG5cdFx0fSxcblx0XHRhZGREYXRhIDogZnVuY3Rpb24odmFsdWVzQXJyYXksbGFiZWwpe1xuXHRcdFx0Ly9NYXAgdGhlIHZhbHVlcyBhcnJheSBmb3IgZWFjaCBvZiB0aGUgZGF0YXNldHNcblxuXHRcdFx0aGVscGVycy5lYWNoKHZhbHVlc0FycmF5LGZ1bmN0aW9uKHZhbHVlLGRhdGFzZXRJbmRleCl7XG5cdFx0XHRcdC8vQWRkIGEgbmV3IHBvaW50IGZvciBlYWNoIHBpZWNlIG9mIGRhdGEsIHBhc3NpbmcgYW55IHJlcXVpcmVkIGRhdGEgdG8gZHJhdy5cblx0XHRcdFx0dGhpcy5kYXRhc2V0c1tkYXRhc2V0SW5kZXhdLnBvaW50cy5wdXNoKG5ldyB0aGlzLlBvaW50Q2xhc3Moe1xuXHRcdFx0XHRcdHZhbHVlIDogdmFsdWUsXG5cdFx0XHRcdFx0bGFiZWwgOiBsYWJlbCxcblx0XHRcdFx0XHR4OiB0aGlzLnNjYWxlLmNhbGN1bGF0ZVgodGhpcy5zY2FsZS52YWx1ZXNDb3VudCsxKSxcblx0XHRcdFx0XHR5OiB0aGlzLnNjYWxlLmVuZFBvaW50LFxuXHRcdFx0XHRcdHN0cm9rZUNvbG9yIDogdGhpcy5kYXRhc2V0c1tkYXRhc2V0SW5kZXhdLnBvaW50U3Ryb2tlQ29sb3IsXG5cdFx0XHRcdFx0ZmlsbENvbG9yIDogdGhpcy5kYXRhc2V0c1tkYXRhc2V0SW5kZXhdLnBvaW50Q29sb3Jcblx0XHRcdFx0fSkpO1xuXHRcdFx0fSx0aGlzKTtcblxuXHRcdFx0dGhpcy5zY2FsZS5hZGRYTGFiZWwobGFiZWwpO1xuXHRcdFx0Ly9UaGVuIHJlLXJlbmRlciB0aGUgY2hhcnQuXG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdH0sXG5cdFx0cmVtb3ZlRGF0YSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLnNjYWxlLnJlbW92ZVhMYWJlbCgpO1xuXHRcdFx0Ly9UaGVuIHJlLXJlbmRlciB0aGUgY2hhcnQuXG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5kYXRhc2V0cyxmdW5jdGlvbihkYXRhc2V0KXtcblx0XHRcdFx0ZGF0YXNldC5wb2ludHMuc2hpZnQoKTtcblx0XHRcdH0sdGhpcyk7XG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdH0sXG5cdFx0cmVmbG93IDogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBuZXdTY2FsZVByb3BzID0gaGVscGVycy5leHRlbmQoe1xuXHRcdFx0XHRoZWlnaHQgOiB0aGlzLmNoYXJ0LmhlaWdodCxcblx0XHRcdFx0d2lkdGggOiB0aGlzLmNoYXJ0LndpZHRoXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuc2NhbGUudXBkYXRlKG5ld1NjYWxlUHJvcHMpO1xuXHRcdH0sXG5cdFx0ZHJhdyA6IGZ1bmN0aW9uKGVhc2Upe1xuXHRcdFx0dmFyIGVhc2luZ0RlY2ltYWwgPSBlYXNlIHx8IDE7XG5cdFx0XHR0aGlzLmNsZWFyKCk7XG5cblx0XHRcdHZhciBjdHggPSB0aGlzLmNoYXJ0LmN0eDtcblxuXHRcdFx0Ly8gU29tZSBoZWxwZXIgbWV0aG9kcyBmb3IgZ2V0dGluZyB0aGUgbmV4dC9wcmV2IHBvaW50c1xuXHRcdFx0dmFyIGhhc1ZhbHVlID0gZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHRcdHJldHVybiBpdGVtLnZhbHVlICE9PSBudWxsO1xuXHRcdFx0fSxcblx0XHRcdG5leHRQb2ludCA9IGZ1bmN0aW9uKHBvaW50LCBjb2xsZWN0aW9uLCBpbmRleCl7XG5cdFx0XHRcdHJldHVybiBoZWxwZXJzLmZpbmROZXh0V2hlcmUoY29sbGVjdGlvbiwgaGFzVmFsdWUsIGluZGV4KSB8fCBwb2ludDtcblx0XHRcdH0sXG5cdFx0XHRwcmV2aW91c1BvaW50ID0gZnVuY3Rpb24ocG9pbnQsIGNvbGxlY3Rpb24sIGluZGV4KXtcblx0XHRcdFx0cmV0dXJuIGhlbHBlcnMuZmluZFByZXZpb3VzV2hlcmUoY29sbGVjdGlvbiwgaGFzVmFsdWUsIGluZGV4KSB8fCBwb2ludDtcblx0XHRcdH07XG5cblx0XHRcdHRoaXMuc2NhbGUuZHJhdyhlYXNpbmdEZWNpbWFsKTtcblxuXG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5kYXRhc2V0cyxmdW5jdGlvbihkYXRhc2V0KXtcblx0XHRcdFx0dmFyIHBvaW50c1dpdGhWYWx1ZXMgPSBoZWxwZXJzLndoZXJlKGRhdGFzZXQucG9pbnRzLCBoYXNWYWx1ZSk7XG5cblx0XHRcdFx0Ly9UcmFuc2l0aW9uIGVhY2ggcG9pbnQgZmlyc3Qgc28gdGhhdCB0aGUgbGluZSBhbmQgcG9pbnQgZHJhd2luZyBpc24ndCBvdXQgb2Ygc3luY1xuXHRcdFx0XHQvL1dlIGNhbiB1c2UgdGhpcyBleHRyYSBsb29wIHRvIGNhbGN1bGF0ZSB0aGUgY29udHJvbCBwb2ludHMgb2YgdGhpcyBkYXRhc2V0IGFsc28gaW4gdGhpcyBsb29wXG5cblx0XHRcdFx0aGVscGVycy5lYWNoKGRhdGFzZXQucG9pbnRzLCBmdW5jdGlvbihwb2ludCwgaW5kZXgpe1xuXHRcdFx0XHRcdGlmIChwb2ludC5oYXNWYWx1ZSgpKXtcblx0XHRcdFx0XHRcdHBvaW50LnRyYW5zaXRpb24oe1xuXHRcdFx0XHRcdFx0XHR5IDogdGhpcy5zY2FsZS5jYWxjdWxhdGVZKHBvaW50LnZhbHVlKSxcblx0XHRcdFx0XHRcdFx0eCA6IHRoaXMuc2NhbGUuY2FsY3VsYXRlWChpbmRleClcblx0XHRcdFx0XHRcdH0sIGVhc2luZ0RlY2ltYWwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSx0aGlzKTtcblxuXG5cdFx0XHRcdC8vIENvbnRyb2wgcG9pbnRzIG5lZWQgdG8gYmUgY2FsY3VsYXRlZCBpbiBhIHNlcGVyYXRlIGxvb3AsIGJlY2F1c2Ugd2UgbmVlZCB0byBrbm93IHRoZSBjdXJyZW50IHgveSBvZiB0aGUgcG9pbnRcblx0XHRcdFx0Ly8gVGhpcyB3b3VsZCBjYXVzZSBpc3N1ZXMgd2hlbiB0aGVyZSBpcyBubyBhbmltYXRpb24sIGJlY2F1c2UgdGhlIHkgb2YgdGhlIG5leHQgcG9pbnQgd291bGQgYmUgMCwgc28gYmV6aWVycyB3b3VsZCBiZSBza2V3ZWRcblx0XHRcdFx0aWYgKHRoaXMub3B0aW9ucy5iZXppZXJDdXJ2ZSl7XG5cdFx0XHRcdFx0aGVscGVycy5lYWNoKHBvaW50c1dpdGhWYWx1ZXMsIGZ1bmN0aW9uKHBvaW50LCBpbmRleCl7XG5cdFx0XHRcdFx0XHR2YXIgdGVuc2lvbiA9IChpbmRleCA+IDAgJiYgaW5kZXggPCBwb2ludHNXaXRoVmFsdWVzLmxlbmd0aCAtIDEpID8gdGhpcy5vcHRpb25zLmJlemllckN1cnZlVGVuc2lvbiA6IDA7XG5cdFx0XHRcdFx0XHRwb2ludC5jb250cm9sUG9pbnRzID0gaGVscGVycy5zcGxpbmVDdXJ2ZShcblx0XHRcdFx0XHRcdFx0cHJldmlvdXNQb2ludChwb2ludCwgcG9pbnRzV2l0aFZhbHVlcywgaW5kZXgpLFxuXHRcdFx0XHRcdFx0XHRwb2ludCxcblx0XHRcdFx0XHRcdFx0bmV4dFBvaW50KHBvaW50LCBwb2ludHNXaXRoVmFsdWVzLCBpbmRleCksXG5cdFx0XHRcdFx0XHRcdHRlbnNpb25cblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdC8vIFByZXZlbnQgdGhlIGJlemllciBnb2luZyBvdXRzaWRlIG9mIHRoZSBib3VuZHMgb2YgdGhlIGdyYXBoXG5cblx0XHRcdFx0XHRcdC8vIENhcCBwdXRlciBiZXppZXIgaGFuZGxlcyB0byB0aGUgdXBwZXIvbG93ZXIgc2NhbGUgYm91bmRzXG5cdFx0XHRcdFx0XHRpZiAocG9pbnQuY29udHJvbFBvaW50cy5vdXRlci55ID4gdGhpcy5zY2FsZS5lbmRQb2ludCl7XG5cdFx0XHRcdFx0XHRcdHBvaW50LmNvbnRyb2xQb2ludHMub3V0ZXIueSA9IHRoaXMuc2NhbGUuZW5kUG9pbnQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChwb2ludC5jb250cm9sUG9pbnRzLm91dGVyLnkgPCB0aGlzLnNjYWxlLnN0YXJ0UG9pbnQpe1xuXHRcdFx0XHRcdFx0XHRwb2ludC5jb250cm9sUG9pbnRzLm91dGVyLnkgPSB0aGlzLnNjYWxlLnN0YXJ0UG9pbnQ7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIENhcCBpbm5lciBiZXppZXIgaGFuZGxlcyB0byB0aGUgdXBwZXIvbG93ZXIgc2NhbGUgYm91bmRzXG5cdFx0XHRcdFx0XHRpZiAocG9pbnQuY29udHJvbFBvaW50cy5pbm5lci55ID4gdGhpcy5zY2FsZS5lbmRQb2ludCl7XG5cdFx0XHRcdFx0XHRcdHBvaW50LmNvbnRyb2xQb2ludHMuaW5uZXIueSA9IHRoaXMuc2NhbGUuZW5kUG9pbnQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChwb2ludC5jb250cm9sUG9pbnRzLmlubmVyLnkgPCB0aGlzLnNjYWxlLnN0YXJ0UG9pbnQpe1xuXHRcdFx0XHRcdFx0XHRwb2ludC5jb250cm9sUG9pbnRzLmlubmVyLnkgPSB0aGlzLnNjYWxlLnN0YXJ0UG9pbnQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSx0aGlzKTtcblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0Ly9EcmF3IHRoZSBsaW5lIGJldHdlZW4gYWxsIHRoZSBwb2ludHNcblx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IHRoaXMub3B0aW9ucy5kYXRhc2V0U3Ryb2tlV2lkdGg7XG5cdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9IGRhdGFzZXQuc3Ryb2tlQ29sb3I7XG5cdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblxuXHRcdFx0XHRoZWxwZXJzLmVhY2gocG9pbnRzV2l0aFZhbHVlcywgZnVuY3Rpb24ocG9pbnQsIGluZGV4KXtcblx0XHRcdFx0XHRpZiAoaW5kZXggPT09IDApe1xuXHRcdFx0XHRcdFx0Y3R4Lm1vdmVUbyhwb2ludC54LCBwb2ludC55KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdGlmKHRoaXMub3B0aW9ucy5iZXppZXJDdXJ2ZSl7XG5cdFx0XHRcdFx0XHRcdHZhciBwcmV2aW91cyA9IHByZXZpb3VzUG9pbnQocG9pbnQsIHBvaW50c1dpdGhWYWx1ZXMsIGluZGV4KTtcblxuXHRcdFx0XHRcdFx0XHRjdHguYmV6aWVyQ3VydmVUbyhcblx0XHRcdFx0XHRcdFx0XHRwcmV2aW91cy5jb250cm9sUG9pbnRzLm91dGVyLngsXG5cdFx0XHRcdFx0XHRcdFx0cHJldmlvdXMuY29udHJvbFBvaW50cy5vdXRlci55LFxuXHRcdFx0XHRcdFx0XHRcdHBvaW50LmNvbnRyb2xQb2ludHMuaW5uZXIueCxcblx0XHRcdFx0XHRcdFx0XHRwb2ludC5jb250cm9sUG9pbnRzLmlubmVyLnksXG5cdFx0XHRcdFx0XHRcdFx0cG9pbnQueCxcblx0XHRcdFx0XHRcdFx0XHRwb2ludC55XG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRjdHgubGluZVRvKHBvaW50LngscG9pbnQueSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCB0aGlzKTtcblxuXHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cblx0XHRcdFx0aWYgKHRoaXMub3B0aW9ucy5kYXRhc2V0RmlsbCAmJiBwb2ludHNXaXRoVmFsdWVzLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdC8vUm91bmQgb2ZmIHRoZSBsaW5lIGJ5IGdvaW5nIHRvIHRoZSBiYXNlIG9mIHRoZSBjaGFydCwgYmFjayB0byB0aGUgc3RhcnQsIHRoZW4gZmlsbC5cblx0XHRcdFx0XHRjdHgubGluZVRvKHBvaW50c1dpdGhWYWx1ZXNbcG9pbnRzV2l0aFZhbHVlcy5sZW5ndGggLSAxXS54LCB0aGlzLnNjYWxlLmVuZFBvaW50KTtcblx0XHRcdFx0XHRjdHgubGluZVRvKHBvaW50c1dpdGhWYWx1ZXNbMF0ueCwgdGhpcy5zY2FsZS5lbmRQb2ludCk7XG5cdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IGRhdGFzZXQuZmlsbENvbG9yO1xuXHRcdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0XHRjdHguZmlsbCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9Ob3cgZHJhdyB0aGUgcG9pbnRzIG92ZXIgdGhlIGxpbmVcblx0XHRcdFx0Ly9BIGxpdHRsZSBpbmVmZmljaWVudCBkb3VibGUgbG9vcGluZywgYnV0IGJldHRlciB0aGFuIHRoZSBsaW5lXG5cdFx0XHRcdC8vbGFnZ2luZyBiZWhpbmQgdGhlIHBvaW50IHBvc2l0aW9uc1xuXHRcdFx0XHRoZWxwZXJzLmVhY2gocG9pbnRzV2l0aFZhbHVlcyxmdW5jdGlvbihwb2ludCl7XG5cdFx0XHRcdFx0cG9pbnQuZHJhdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sdGhpcyk7XG5cdFx0fVxuXHR9KTtcblxuXG59KS5jYWxsKHRoaXMpO1xuXG4oZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIHJvb3QgPSB0aGlzLFxuXHRcdENoYXJ0ID0gcm9vdC5DaGFydCxcblx0XHQvL0NhY2hlIGEgbG9jYWwgcmVmZXJlbmNlIHRvIENoYXJ0LmhlbHBlcnNcblx0XHRoZWxwZXJzID0gQ2hhcnQuaGVscGVycztcblxuXHR2YXIgZGVmYXVsdENvbmZpZyA9IHtcblx0XHQvL0Jvb2xlYW4gLSBTaG93IGEgYmFja2Ryb3AgdG8gdGhlIHNjYWxlIGxhYmVsXG5cdFx0c2NhbGVTaG93TGFiZWxCYWNrZHJvcCA6IHRydWUsXG5cblx0XHQvL1N0cmluZyAtIFRoZSBjb2xvdXIgb2YgdGhlIGxhYmVsIGJhY2tkcm9wXG5cdFx0c2NhbGVCYWNrZHJvcENvbG9yIDogXCJyZ2JhKDI1NSwyNTUsMjU1LDAuNzUpXCIsXG5cblx0XHQvLyBCb29sZWFuIC0gV2hldGhlciB0aGUgc2NhbGUgc2hvdWxkIGJlZ2luIGF0IHplcm9cblx0XHRzY2FsZUJlZ2luQXRaZXJvIDogdHJ1ZSxcblxuXHRcdC8vTnVtYmVyIC0gVGhlIGJhY2tkcm9wIHBhZGRpbmcgYWJvdmUgJiBiZWxvdyB0aGUgbGFiZWwgaW4gcGl4ZWxzXG5cdFx0c2NhbGVCYWNrZHJvcFBhZGRpbmdZIDogMixcblxuXHRcdC8vTnVtYmVyIC0gVGhlIGJhY2tkcm9wIHBhZGRpbmcgdG8gdGhlIHNpZGUgb2YgdGhlIGxhYmVsIGluIHBpeGVsc1xuXHRcdHNjYWxlQmFja2Ryb3BQYWRkaW5nWCA6IDIsXG5cblx0XHQvL0Jvb2xlYW4gLSBTaG93IGxpbmUgZm9yIGVhY2ggdmFsdWUgaW4gdGhlIHNjYWxlXG5cdFx0c2NhbGVTaG93TGluZSA6IHRydWUsXG5cblx0XHQvL0Jvb2xlYW4gLSBTdHJva2UgYSBsaW5lIGFyb3VuZCBlYWNoIHNlZ21lbnQgaW4gdGhlIGNoYXJ0XG5cdFx0c2VnbWVudFNob3dTdHJva2UgOiB0cnVlLFxuXG5cdFx0Ly9TdHJpbmcgLSBUaGUgY29sb3VyIG9mIHRoZSBzdHJva2Ugb24gZWFjaCBzZWdlbWVudC5cblx0XHRzZWdtZW50U3Ryb2tlQ29sb3IgOiBcIiNmZmZcIixcblxuXHRcdC8vTnVtYmVyIC0gVGhlIHdpZHRoIG9mIHRoZSBzdHJva2UgdmFsdWUgaW4gcGl4ZWxzXG5cdFx0c2VnbWVudFN0cm9rZVdpZHRoIDogMixcblxuXHRcdC8vTnVtYmVyIC0gQW1vdW50IG9mIGFuaW1hdGlvbiBzdGVwc1xuXHRcdGFuaW1hdGlvblN0ZXBzIDogMTAwLFxuXG5cdFx0Ly9TdHJpbmcgLSBBbmltYXRpb24gZWFzaW5nIGVmZmVjdC5cblx0XHRhbmltYXRpb25FYXNpbmcgOiBcImVhc2VPdXRCb3VuY2VcIixcblxuXHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdG8gYW5pbWF0ZSB0aGUgcm90YXRpb24gb2YgdGhlIGNoYXJ0XG5cdFx0YW5pbWF0ZVJvdGF0ZSA6IHRydWUsXG5cblx0XHQvL0Jvb2xlYW4gLSBXaGV0aGVyIHRvIGFuaW1hdGUgc2NhbGluZyB0aGUgY2hhcnQgZnJvbSB0aGUgY2VudHJlXG5cdFx0YW5pbWF0ZVNjYWxlIDogZmFsc2UsXG5cblx0XHQvL1N0cmluZyAtIEEgbGVnZW5kIHRlbXBsYXRlXG5cdFx0bGVnZW5kVGVtcGxhdGUgOiBcIjx1bCBjbGFzcz1cXFwiPCU9bmFtZS50b0xvd2VyQ2FzZSgpJT4tbGVnZW5kXFxcIj48JSBmb3IgKHZhciBpPTA7IGk8c2VnbWVudHMubGVuZ3RoOyBpKyspeyU+PGxpPjxzcGFuIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWNvbG9yOjwlPXNlZ21lbnRzW2ldLmZpbGxDb2xvciU+XFxcIj48L3NwYW4+PCVpZihzZWdtZW50c1tpXS5sYWJlbCl7JT48JT1zZWdtZW50c1tpXS5sYWJlbCU+PCV9JT48L2xpPjwlfSU+PC91bD5cIlxuXHR9O1xuXG5cblx0Q2hhcnQuVHlwZS5leHRlbmQoe1xuXHRcdC8vUGFzc2luZyBpbiBhIG5hbWUgcmVnaXN0ZXJzIHRoaXMgY2hhcnQgaW4gdGhlIENoYXJ0IG5hbWVzcGFjZVxuXHRcdG5hbWU6IFwiUG9sYXJBcmVhXCIsXG5cdFx0Ly9Qcm92aWRpbmcgYSBkZWZhdWx0cyB3aWxsIGFsc28gcmVnaXN0ZXIgdGhlIGRlYWZ1bHRzIGluIHRoZSBjaGFydCBuYW1lc3BhY2Vcblx0XHRkZWZhdWx0cyA6IGRlZmF1bHRDb25maWcsXG5cdFx0Ly9Jbml0aWFsaXplIGlzIGZpcmVkIHdoZW4gdGhlIGNoYXJ0IGlzIGluaXRpYWxpemVkIC0gRGF0YSBpcyBwYXNzZWQgaW4gYXMgYSBwYXJhbWV0ZXJcblx0XHQvL0NvbmZpZyBpcyBhdXRvbWF0aWNhbGx5IG1lcmdlZCBieSB0aGUgY29yZSBvZiBDaGFydC5qcywgYW5kIGlzIGF2YWlsYWJsZSBhdCB0aGlzLm9wdGlvbnNcblx0XHRpbml0aWFsaXplOiAgZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHR0aGlzLnNlZ21lbnRzID0gW107XG5cdFx0XHQvL0RlY2xhcmUgc2VnbWVudCBjbGFzcyBhcyBhIGNoYXJ0IGluc3RhbmNlIHNwZWNpZmljIGNsYXNzLCBzbyBpdCBjYW4gc2hhcmUgcHJvcHMgZm9yIHRoaXMgaW5zdGFuY2Vcblx0XHRcdHRoaXMuU2VnbWVudEFyYyA9IENoYXJ0LkFyYy5leHRlbmQoe1xuXHRcdFx0XHRzaG93U3Ryb2tlIDogdGhpcy5vcHRpb25zLnNlZ21lbnRTaG93U3Ryb2tlLFxuXHRcdFx0XHRzdHJva2VXaWR0aCA6IHRoaXMub3B0aW9ucy5zZWdtZW50U3Ryb2tlV2lkdGgsXG5cdFx0XHRcdHN0cm9rZUNvbG9yIDogdGhpcy5vcHRpb25zLnNlZ21lbnRTdHJva2VDb2xvcixcblx0XHRcdFx0Y3R4IDogdGhpcy5jaGFydC5jdHgsXG5cdFx0XHRcdGlubmVyUmFkaXVzIDogMCxcblx0XHRcdFx0eCA6IHRoaXMuY2hhcnQud2lkdGgvMixcblx0XHRcdFx0eSA6IHRoaXMuY2hhcnQuaGVpZ2h0LzJcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5zY2FsZSA9IG5ldyBDaGFydC5SYWRpYWxTY2FsZSh7XG5cdFx0XHRcdGRpc3BsYXk6IHRoaXMub3B0aW9ucy5zaG93U2NhbGUsXG5cdFx0XHRcdGZvbnRTdHlsZTogdGhpcy5vcHRpb25zLnNjYWxlRm9udFN0eWxlLFxuXHRcdFx0XHRmb250U2l6ZTogdGhpcy5vcHRpb25zLnNjYWxlRm9udFNpemUsXG5cdFx0XHRcdGZvbnRGYW1pbHk6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRGYW1pbHksXG5cdFx0XHRcdGZvbnRDb2xvcjogdGhpcy5vcHRpb25zLnNjYWxlRm9udENvbG9yLFxuXHRcdFx0XHRzaG93TGFiZWxzOiB0aGlzLm9wdGlvbnMuc2NhbGVTaG93TGFiZWxzLFxuXHRcdFx0XHRzaG93TGFiZWxCYWNrZHJvcDogdGhpcy5vcHRpb25zLnNjYWxlU2hvd0xhYmVsQmFja2Ryb3AsXG5cdFx0XHRcdGJhY2tkcm9wQ29sb3I6IHRoaXMub3B0aW9ucy5zY2FsZUJhY2tkcm9wQ29sb3IsXG5cdFx0XHRcdGJhY2tkcm9wUGFkZGluZ1kgOiB0aGlzLm9wdGlvbnMuc2NhbGVCYWNrZHJvcFBhZGRpbmdZLFxuXHRcdFx0XHRiYWNrZHJvcFBhZGRpbmdYOiB0aGlzLm9wdGlvbnMuc2NhbGVCYWNrZHJvcFBhZGRpbmdYLFxuXHRcdFx0XHRsaW5lV2lkdGg6ICh0aGlzLm9wdGlvbnMuc2NhbGVTaG93TGluZSkgPyB0aGlzLm9wdGlvbnMuc2NhbGVMaW5lV2lkdGggOiAwLFxuXHRcdFx0XHRsaW5lQ29sb3I6IHRoaXMub3B0aW9ucy5zY2FsZUxpbmVDb2xvcixcblx0XHRcdFx0bGluZUFyYzogdHJ1ZSxcblx0XHRcdFx0d2lkdGg6IHRoaXMuY2hhcnQud2lkdGgsXG5cdFx0XHRcdGhlaWdodDogdGhpcy5jaGFydC5oZWlnaHQsXG5cdFx0XHRcdHhDZW50ZXI6IHRoaXMuY2hhcnQud2lkdGgvMixcblx0XHRcdFx0eUNlbnRlcjogdGhpcy5jaGFydC5oZWlnaHQvMixcblx0XHRcdFx0Y3R4IDogdGhpcy5jaGFydC5jdHgsXG5cdFx0XHRcdHRlbXBsYXRlU3RyaW5nOiB0aGlzLm9wdGlvbnMuc2NhbGVMYWJlbCxcblx0XHRcdFx0dmFsdWVzQ291bnQ6IGRhdGEubGVuZ3RoXG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy51cGRhdGVTY2FsZVJhbmdlKGRhdGEpO1xuXG5cdFx0XHR0aGlzLnNjYWxlLnVwZGF0ZSgpO1xuXG5cdFx0XHRoZWxwZXJzLmVhY2goZGF0YSxmdW5jdGlvbihzZWdtZW50LGluZGV4KXtcblx0XHRcdFx0dGhpcy5hZGREYXRhKHNlZ21lbnQsaW5kZXgsdHJ1ZSk7XG5cdFx0XHR9LHRoaXMpO1xuXG5cdFx0XHQvL1NldCB1cCB0b29sdGlwIGV2ZW50cyBvbiB0aGUgY2hhcnRcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuc2hvd1Rvb2x0aXBzKXtcblx0XHRcdFx0aGVscGVycy5iaW5kRXZlbnRzKHRoaXMsIHRoaXMub3B0aW9ucy50b29sdGlwRXZlbnRzLCBmdW5jdGlvbihldnQpe1xuXHRcdFx0XHRcdHZhciBhY3RpdmVTZWdtZW50cyA9IChldnQudHlwZSAhPT0gJ21vdXNlb3V0JykgPyB0aGlzLmdldFNlZ21lbnRzQXRFdmVudChldnQpIDogW107XG5cdFx0XHRcdFx0aGVscGVycy5lYWNoKHRoaXMuc2VnbWVudHMsZnVuY3Rpb24oc2VnbWVudCl7XG5cdFx0XHRcdFx0XHRzZWdtZW50LnJlc3RvcmUoW1wiZmlsbENvbG9yXCJdKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRoZWxwZXJzLmVhY2goYWN0aXZlU2VnbWVudHMsZnVuY3Rpb24oYWN0aXZlU2VnbWVudCl7XG5cdFx0XHRcdFx0XHRhY3RpdmVTZWdtZW50LmZpbGxDb2xvciA9IGFjdGl2ZVNlZ21lbnQuaGlnaGxpZ2h0Q29sb3I7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dGhpcy5zaG93VG9vbHRpcChhY3RpdmVTZWdtZW50cyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnJlbmRlcigpO1xuXHRcdH0sXG5cdFx0Z2V0U2VnbWVudHNBdEV2ZW50IDogZnVuY3Rpb24oZSl7XG5cdFx0XHR2YXIgc2VnbWVudHNBcnJheSA9IFtdO1xuXG5cdFx0XHR2YXIgbG9jYXRpb24gPSBoZWxwZXJzLmdldFJlbGF0aXZlUG9zaXRpb24oZSk7XG5cblx0XHRcdGhlbHBlcnMuZWFjaCh0aGlzLnNlZ21lbnRzLGZ1bmN0aW9uKHNlZ21lbnQpe1xuXHRcdFx0XHRpZiAoc2VnbWVudC5pblJhbmdlKGxvY2F0aW9uLngsbG9jYXRpb24ueSkpIHNlZ21lbnRzQXJyYXkucHVzaChzZWdtZW50KTtcblx0XHRcdH0sdGhpcyk7XG5cdFx0XHRyZXR1cm4gc2VnbWVudHNBcnJheTtcblx0XHR9LFxuXHRcdGFkZERhdGEgOiBmdW5jdGlvbihzZWdtZW50LCBhdEluZGV4LCBzaWxlbnQpe1xuXHRcdFx0dmFyIGluZGV4ID0gYXRJbmRleCB8fCB0aGlzLnNlZ21lbnRzLmxlbmd0aDtcblxuXHRcdFx0dGhpcy5zZWdtZW50cy5zcGxpY2UoaW5kZXgsIDAsIG5ldyB0aGlzLlNlZ21lbnRBcmMoe1xuXHRcdFx0XHRmaWxsQ29sb3I6IHNlZ21lbnQuY29sb3IsXG5cdFx0XHRcdGhpZ2hsaWdodENvbG9yOiBzZWdtZW50LmhpZ2hsaWdodCB8fCBzZWdtZW50LmNvbG9yLFxuXHRcdFx0XHRsYWJlbDogc2VnbWVudC5sYWJlbCxcblx0XHRcdFx0dmFsdWU6IHNlZ21lbnQudmFsdWUsXG5cdFx0XHRcdG91dGVyUmFkaXVzOiAodGhpcy5vcHRpb25zLmFuaW1hdGVTY2FsZSkgPyAwIDogdGhpcy5zY2FsZS5jYWxjdWxhdGVDZW50ZXJPZmZzZXQoc2VnbWVudC52YWx1ZSksXG5cdFx0XHRcdGNpcmN1bWZlcmVuY2U6ICh0aGlzLm9wdGlvbnMuYW5pbWF0ZVJvdGF0ZSkgPyAwIDogdGhpcy5zY2FsZS5nZXRDaXJjdW1mZXJlbmNlKCksXG5cdFx0XHRcdHN0YXJ0QW5nbGU6IE1hdGguUEkgKiAxLjVcblx0XHRcdH0pKTtcblx0XHRcdGlmICghc2lsZW50KXtcblx0XHRcdFx0dGhpcy5yZWZsb3coKTtcblx0XHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHJlbW92ZURhdGE6IGZ1bmN0aW9uKGF0SW5kZXgpe1xuXHRcdFx0dmFyIGluZGV4VG9EZWxldGUgPSAoaGVscGVycy5pc051bWJlcihhdEluZGV4KSkgPyBhdEluZGV4IDogdGhpcy5zZWdtZW50cy5sZW5ndGgtMTtcblx0XHRcdHRoaXMuc2VnbWVudHMuc3BsaWNlKGluZGV4VG9EZWxldGUsIDEpO1xuXHRcdFx0dGhpcy5yZWZsb3coKTtcblx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0fSxcblx0XHRjYWxjdWxhdGVUb3RhbDogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHR0aGlzLnRvdGFsID0gMDtcblx0XHRcdGhlbHBlcnMuZWFjaChkYXRhLGZ1bmN0aW9uKHNlZ21lbnQpe1xuXHRcdFx0XHR0aGlzLnRvdGFsICs9IHNlZ21lbnQudmFsdWU7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdFx0dGhpcy5zY2FsZS52YWx1ZXNDb3VudCA9IHRoaXMuc2VnbWVudHMubGVuZ3RoO1xuXHRcdH0sXG5cdFx0dXBkYXRlU2NhbGVSYW5nZTogZnVuY3Rpb24oZGF0YXBvaW50cyl7XG5cdFx0XHR2YXIgdmFsdWVzQXJyYXkgPSBbXTtcblx0XHRcdGhlbHBlcnMuZWFjaChkYXRhcG9pbnRzLGZ1bmN0aW9uKHNlZ21lbnQpe1xuXHRcdFx0XHR2YWx1ZXNBcnJheS5wdXNoKHNlZ21lbnQudmFsdWUpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHZhciBzY2FsZVNpemVzID0gKHRoaXMub3B0aW9ucy5zY2FsZU92ZXJyaWRlKSA/XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzdGVwczogdGhpcy5vcHRpb25zLnNjYWxlU3RlcHMsXG5cdFx0XHRcdFx0c3RlcFZhbHVlOiB0aGlzLm9wdGlvbnMuc2NhbGVTdGVwV2lkdGgsXG5cdFx0XHRcdFx0bWluOiB0aGlzLm9wdGlvbnMuc2NhbGVTdGFydFZhbHVlLFxuXHRcdFx0XHRcdG1heDogdGhpcy5vcHRpb25zLnNjYWxlU3RhcnRWYWx1ZSArICh0aGlzLm9wdGlvbnMuc2NhbGVTdGVwcyAqIHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBXaWR0aClcblx0XHRcdFx0fSA6XG5cdFx0XHRcdGhlbHBlcnMuY2FsY3VsYXRlU2NhbGVSYW5nZShcblx0XHRcdFx0XHR2YWx1ZXNBcnJheSxcblx0XHRcdFx0XHRoZWxwZXJzLm1pbihbdGhpcy5jaGFydC53aWR0aCwgdGhpcy5jaGFydC5oZWlnaHRdKS8yLFxuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTaXplLFxuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5zY2FsZUJlZ2luQXRaZXJvLFxuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5zY2FsZUludGVnZXJzT25seVxuXHRcdFx0XHQpO1xuXG5cdFx0XHRoZWxwZXJzLmV4dGVuZChcblx0XHRcdFx0dGhpcy5zY2FsZSxcblx0XHRcdFx0c2NhbGVTaXplcyxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHNpemU6IGhlbHBlcnMubWluKFt0aGlzLmNoYXJ0LndpZHRoLCB0aGlzLmNoYXJ0LmhlaWdodF0pLFxuXHRcdFx0XHRcdHhDZW50ZXI6IHRoaXMuY2hhcnQud2lkdGgvMixcblx0XHRcdFx0XHR5Q2VudGVyOiB0aGlzLmNoYXJ0LmhlaWdodC8yXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHR9LFxuXHRcdHVwZGF0ZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLmNhbGN1bGF0ZVRvdGFsKHRoaXMuc2VnbWVudHMpO1xuXG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5zZWdtZW50cyxmdW5jdGlvbihzZWdtZW50KXtcblx0XHRcdFx0c2VnbWVudC5zYXZlKCk7XG5cdFx0XHR9KTtcblx0XHRcdFxuXHRcdFx0dGhpcy5yZWZsb3coKTtcblx0XHRcdHRoaXMucmVuZGVyKCk7XG5cdFx0fSxcblx0XHRyZWZsb3cgOiBmdW5jdGlvbigpe1xuXHRcdFx0aGVscGVycy5leHRlbmQodGhpcy5TZWdtZW50QXJjLnByb3RvdHlwZSx7XG5cdFx0XHRcdHggOiB0aGlzLmNoYXJ0LndpZHRoLzIsXG5cdFx0XHRcdHkgOiB0aGlzLmNoYXJ0LmhlaWdodC8yXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMudXBkYXRlU2NhbGVSYW5nZSh0aGlzLnNlZ21lbnRzKTtcblx0XHRcdHRoaXMuc2NhbGUudXBkYXRlKCk7XG5cblx0XHRcdGhlbHBlcnMuZXh0ZW5kKHRoaXMuc2NhbGUse1xuXHRcdFx0XHR4Q2VudGVyOiB0aGlzLmNoYXJ0LndpZHRoLzIsXG5cdFx0XHRcdHlDZW50ZXI6IHRoaXMuY2hhcnQuaGVpZ2h0LzJcblx0XHRcdH0pO1xuXG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5zZWdtZW50cywgZnVuY3Rpb24oc2VnbWVudCl7XG5cdFx0XHRcdHNlZ21lbnQudXBkYXRlKHtcblx0XHRcdFx0XHRvdXRlclJhZGl1cyA6IHRoaXMuc2NhbGUuY2FsY3VsYXRlQ2VudGVyT2Zmc2V0KHNlZ21lbnQudmFsdWUpXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSwgdGhpcyk7XG5cblx0XHR9LFxuXHRcdGRyYXcgOiBmdW5jdGlvbihlYXNlKXtcblx0XHRcdHZhciBlYXNpbmdEZWNpbWFsID0gZWFzZSB8fCAxO1xuXHRcdFx0Ly9DbGVhciAmIGRyYXcgdGhlIGNhbnZhc1xuXHRcdFx0dGhpcy5jbGVhcigpO1xuXHRcdFx0aGVscGVycy5lYWNoKHRoaXMuc2VnbWVudHMsZnVuY3Rpb24oc2VnbWVudCwgaW5kZXgpe1xuXHRcdFx0XHRzZWdtZW50LnRyYW5zaXRpb24oe1xuXHRcdFx0XHRcdGNpcmN1bWZlcmVuY2UgOiB0aGlzLnNjYWxlLmdldENpcmN1bWZlcmVuY2UoKSxcblx0XHRcdFx0XHRvdXRlclJhZGl1cyA6IHRoaXMuc2NhbGUuY2FsY3VsYXRlQ2VudGVyT2Zmc2V0KHNlZ21lbnQudmFsdWUpXG5cdFx0XHRcdH0sZWFzaW5nRGVjaW1hbCk7XG5cblx0XHRcdFx0c2VnbWVudC5lbmRBbmdsZSA9IHNlZ21lbnQuc3RhcnRBbmdsZSArIHNlZ21lbnQuY2lyY3VtZmVyZW5jZTtcblxuXHRcdFx0XHQvLyBJZiB3ZSd2ZSByZW1vdmVkIHRoZSBmaXJzdCBzZWdtZW50IHdlIG5lZWQgdG8gc2V0IHRoZSBmaXJzdCBvbmUgdG9cblx0XHRcdFx0Ly8gc3RhcnQgYXQgdGhlIHRvcC5cblx0XHRcdFx0aWYgKGluZGV4ID09PSAwKXtcblx0XHRcdFx0XHRzZWdtZW50LnN0YXJ0QW5nbGUgPSBNYXRoLlBJICogMS41O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9DaGVjayB0byBzZWUgaWYgaXQncyB0aGUgbGFzdCBzZWdtZW50LCBpZiBub3QgZ2V0IHRoZSBuZXh0IGFuZCB1cGRhdGUgdGhlIHN0YXJ0IGFuZ2xlXG5cdFx0XHRcdGlmIChpbmRleCA8IHRoaXMuc2VnbWVudHMubGVuZ3RoIC0gMSl7XG5cdFx0XHRcdFx0dGhpcy5zZWdtZW50c1tpbmRleCsxXS5zdGFydEFuZ2xlID0gc2VnbWVudC5lbmRBbmdsZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzZWdtZW50LmRyYXcoKTtcblx0XHRcdH0sIHRoaXMpO1xuXHRcdFx0dGhpcy5zY2FsZS5kcmF3KCk7XG5cdFx0fVxuXHR9KTtcblxufSkuY2FsbCh0aGlzKTtcbihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgcm9vdCA9IHRoaXMsXG5cdFx0Q2hhcnQgPSByb290LkNoYXJ0LFxuXHRcdGhlbHBlcnMgPSBDaGFydC5oZWxwZXJzO1xuXG5cblxuXHRDaGFydC5UeXBlLmV4dGVuZCh7XG5cdFx0bmFtZTogXCJSYWRhclwiLFxuXHRcdGRlZmF1bHRzOntcblx0XHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdG8gc2hvdyBsaW5lcyBmb3IgZWFjaCBzY2FsZSBwb2ludFxuXHRcdFx0c2NhbGVTaG93TGluZSA6IHRydWUsXG5cblx0XHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgd2Ugc2hvdyB0aGUgYW5nbGUgbGluZXMgb3V0IG9mIHRoZSByYWRhclxuXHRcdFx0YW5nbGVTaG93TGluZU91dCA6IHRydWUsXG5cblx0XHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdG8gc2hvdyBsYWJlbHMgb24gdGhlIHNjYWxlXG5cdFx0XHRzY2FsZVNob3dMYWJlbHMgOiBmYWxzZSxcblxuXHRcdFx0Ly8gQm9vbGVhbiAtIFdoZXRoZXIgdGhlIHNjYWxlIHNob3VsZCBiZWdpbiBhdCB6ZXJvXG5cdFx0XHRzY2FsZUJlZ2luQXRaZXJvIDogdHJ1ZSxcblxuXHRcdFx0Ly9TdHJpbmcgLSBDb2xvdXIgb2YgdGhlIGFuZ2xlIGxpbmVcblx0XHRcdGFuZ2xlTGluZUNvbG9yIDogXCJyZ2JhKDAsMCwwLC4xKVwiLFxuXG5cdFx0XHQvL051bWJlciAtIFBpeGVsIHdpZHRoIG9mIHRoZSBhbmdsZSBsaW5lXG5cdFx0XHRhbmdsZUxpbmVXaWR0aCA6IDEsXG5cblx0XHRcdC8vU3RyaW5nIC0gUG9pbnQgbGFiZWwgZm9udCBkZWNsYXJhdGlvblxuXHRcdFx0cG9pbnRMYWJlbEZvbnRGYW1pbHkgOiBcIidBcmlhbCdcIixcblxuXHRcdFx0Ly9TdHJpbmcgLSBQb2ludCBsYWJlbCBmb250IHdlaWdodFxuXHRcdFx0cG9pbnRMYWJlbEZvbnRTdHlsZSA6IFwibm9ybWFsXCIsXG5cblx0XHRcdC8vTnVtYmVyIC0gUG9pbnQgbGFiZWwgZm9udCBzaXplIGluIHBpeGVsc1xuXHRcdFx0cG9pbnRMYWJlbEZvbnRTaXplIDogMTAsXG5cblx0XHRcdC8vU3RyaW5nIC0gUG9pbnQgbGFiZWwgZm9udCBjb2xvdXJcblx0XHRcdHBvaW50TGFiZWxGb250Q29sb3IgOiBcIiM2NjZcIixcblxuXHRcdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB0byBzaG93IGEgZG90IGZvciBlYWNoIHBvaW50XG5cdFx0XHRwb2ludERvdCA6IHRydWUsXG5cblx0XHRcdC8vTnVtYmVyIC0gUmFkaXVzIG9mIGVhY2ggcG9pbnQgZG90IGluIHBpeGVsc1xuXHRcdFx0cG9pbnREb3RSYWRpdXMgOiAzLFxuXG5cdFx0XHQvL051bWJlciAtIFBpeGVsIHdpZHRoIG9mIHBvaW50IGRvdCBzdHJva2Vcblx0XHRcdHBvaW50RG90U3Ryb2tlV2lkdGggOiAxLFxuXG5cdFx0XHQvL051bWJlciAtIGFtb3VudCBleHRyYSB0byBhZGQgdG8gdGhlIHJhZGl1cyB0byBjYXRlciBmb3IgaGl0IGRldGVjdGlvbiBvdXRzaWRlIHRoZSBkcmF3biBwb2ludFxuXHRcdFx0cG9pbnRIaXREZXRlY3Rpb25SYWRpdXMgOiAyMCxcblxuXHRcdFx0Ly9Cb29sZWFuIC0gV2hldGhlciB0byBzaG93IGEgc3Ryb2tlIGZvciBkYXRhc2V0c1xuXHRcdFx0ZGF0YXNldFN0cm9rZSA6IHRydWUsXG5cblx0XHRcdC8vTnVtYmVyIC0gUGl4ZWwgd2lkdGggb2YgZGF0YXNldCBzdHJva2Vcblx0XHRcdGRhdGFzZXRTdHJva2VXaWR0aCA6IDIsXG5cblx0XHRcdC8vQm9vbGVhbiAtIFdoZXRoZXIgdG8gZmlsbCB0aGUgZGF0YXNldCB3aXRoIGEgY29sb3VyXG5cdFx0XHRkYXRhc2V0RmlsbCA6IHRydWUsXG5cblx0XHRcdC8vU3RyaW5nIC0gQSBsZWdlbmQgdGVtcGxhdGVcblx0XHRcdGxlZ2VuZFRlbXBsYXRlIDogXCI8dWwgY2xhc3M9XFxcIjwlPW5hbWUudG9Mb3dlckNhc2UoKSU+LWxlZ2VuZFxcXCI+PCUgZm9yICh2YXIgaT0wOyBpPGRhdGFzZXRzLmxlbmd0aDsgaSsrKXslPjxsaT48c3BhbiBzdHlsZT1cXFwiYmFja2dyb3VuZC1jb2xvcjo8JT1kYXRhc2V0c1tpXS5zdHJva2VDb2xvciU+XFxcIj48L3NwYW4+PCVpZihkYXRhc2V0c1tpXS5sYWJlbCl7JT48JT1kYXRhc2V0c1tpXS5sYWJlbCU+PCV9JT48L2xpPjwlfSU+PC91bD5cIlxuXG5cdFx0fSxcblxuXHRcdGluaXRpYWxpemU6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0dGhpcy5Qb2ludENsYXNzID0gQ2hhcnQuUG9pbnQuZXh0ZW5kKHtcblx0XHRcdFx0c3Ryb2tlV2lkdGggOiB0aGlzLm9wdGlvbnMucG9pbnREb3RTdHJva2VXaWR0aCxcblx0XHRcdFx0cmFkaXVzIDogdGhpcy5vcHRpb25zLnBvaW50RG90UmFkaXVzLFxuXHRcdFx0XHRkaXNwbGF5OiB0aGlzLm9wdGlvbnMucG9pbnREb3QsXG5cdFx0XHRcdGhpdERldGVjdGlvblJhZGl1cyA6IHRoaXMub3B0aW9ucy5wb2ludEhpdERldGVjdGlvblJhZGl1cyxcblx0XHRcdFx0Y3R4IDogdGhpcy5jaGFydC5jdHhcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLmRhdGFzZXRzID0gW107XG5cblx0XHRcdHRoaXMuYnVpbGRTY2FsZShkYXRhKTtcblxuXHRcdFx0Ly9TZXQgdXAgdG9vbHRpcCBldmVudHMgb24gdGhlIGNoYXJ0XG5cdFx0XHRpZiAodGhpcy5vcHRpb25zLnNob3dUb29sdGlwcyl7XG5cdFx0XHRcdGhlbHBlcnMuYmluZEV2ZW50cyh0aGlzLCB0aGlzLm9wdGlvbnMudG9vbHRpcEV2ZW50cywgZnVuY3Rpb24oZXZ0KXtcblx0XHRcdFx0XHR2YXIgYWN0aXZlUG9pbnRzQ29sbGVjdGlvbiA9IChldnQudHlwZSAhPT0gJ21vdXNlb3V0JykgPyB0aGlzLmdldFBvaW50c0F0RXZlbnQoZXZ0KSA6IFtdO1xuXG5cdFx0XHRcdFx0dGhpcy5lYWNoUG9pbnRzKGZ1bmN0aW9uKHBvaW50KXtcblx0XHRcdFx0XHRcdHBvaW50LnJlc3RvcmUoWydmaWxsQ29sb3InLCAnc3Ryb2tlQ29sb3InXSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0aGVscGVycy5lYWNoKGFjdGl2ZVBvaW50c0NvbGxlY3Rpb24sIGZ1bmN0aW9uKGFjdGl2ZVBvaW50KXtcblx0XHRcdFx0XHRcdGFjdGl2ZVBvaW50LmZpbGxDb2xvciA9IGFjdGl2ZVBvaW50LmhpZ2hsaWdodEZpbGw7XG5cdFx0XHRcdFx0XHRhY3RpdmVQb2ludC5zdHJva2VDb2xvciA9IGFjdGl2ZVBvaW50LmhpZ2hsaWdodFN0cm9rZTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHRoaXMuc2hvd1Rvb2x0aXAoYWN0aXZlUG9pbnRzQ29sbGVjdGlvbik7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHQvL0l0ZXJhdGUgdGhyb3VnaCBlYWNoIG9mIHRoZSBkYXRhc2V0cywgYW5kIGJ1aWxkIHRoaXMgaW50byBhIHByb3BlcnR5IG9mIHRoZSBjaGFydFxuXHRcdFx0aGVscGVycy5lYWNoKGRhdGEuZGF0YXNldHMsZnVuY3Rpb24oZGF0YXNldCl7XG5cblx0XHRcdFx0dmFyIGRhdGFzZXRPYmplY3QgPSB7XG5cdFx0XHRcdFx0bGFiZWw6IGRhdGFzZXQubGFiZWwgfHwgbnVsbCxcblx0XHRcdFx0XHRmaWxsQ29sb3IgOiBkYXRhc2V0LmZpbGxDb2xvcixcblx0XHRcdFx0XHRzdHJva2VDb2xvciA6IGRhdGFzZXQuc3Ryb2tlQ29sb3IsXG5cdFx0XHRcdFx0cG9pbnRDb2xvciA6IGRhdGFzZXQucG9pbnRDb2xvcixcblx0XHRcdFx0XHRwb2ludFN0cm9rZUNvbG9yIDogZGF0YXNldC5wb2ludFN0cm9rZUNvbG9yLFxuXHRcdFx0XHRcdHBvaW50cyA6IFtdXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dGhpcy5kYXRhc2V0cy5wdXNoKGRhdGFzZXRPYmplY3QpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZWFjaChkYXRhc2V0LmRhdGEsZnVuY3Rpb24oZGF0YVBvaW50LGluZGV4KXtcblx0XHRcdFx0XHQvL0FkZCBhIG5ldyBwb2ludCBmb3IgZWFjaCBwaWVjZSBvZiBkYXRhLCBwYXNzaW5nIGFueSByZXF1aXJlZCBkYXRhIHRvIGRyYXcuXG5cdFx0XHRcdFx0dmFyIHBvaW50UG9zaXRpb247XG5cdFx0XHRcdFx0aWYgKCF0aGlzLnNjYWxlLmFuaW1hdGlvbil7XG5cdFx0XHRcdFx0XHRwb2ludFBvc2l0aW9uID0gdGhpcy5zY2FsZS5nZXRQb2ludFBvc2l0aW9uKGluZGV4LCB0aGlzLnNjYWxlLmNhbGN1bGF0ZUNlbnRlck9mZnNldChkYXRhUG9pbnQpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZGF0YXNldE9iamVjdC5wb2ludHMucHVzaChuZXcgdGhpcy5Qb2ludENsYXNzKHtcblx0XHRcdFx0XHRcdHZhbHVlIDogZGF0YVBvaW50LFxuXHRcdFx0XHRcdFx0bGFiZWwgOiBkYXRhLmxhYmVsc1tpbmRleF0sXG5cdFx0XHRcdFx0XHRkYXRhc2V0TGFiZWw6IGRhdGFzZXQubGFiZWwsXG5cdFx0XHRcdFx0XHR4OiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbikgPyB0aGlzLnNjYWxlLnhDZW50ZXIgOiBwb2ludFBvc2l0aW9uLngsXG5cdFx0XHRcdFx0XHR5OiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbikgPyB0aGlzLnNjYWxlLnlDZW50ZXIgOiBwb2ludFBvc2l0aW9uLnksXG5cdFx0XHRcdFx0XHRzdHJva2VDb2xvciA6IGRhdGFzZXQucG9pbnRTdHJva2VDb2xvcixcblx0XHRcdFx0XHRcdGZpbGxDb2xvciA6IGRhdGFzZXQucG9pbnRDb2xvcixcblx0XHRcdFx0XHRcdGhpZ2hsaWdodEZpbGwgOiBkYXRhc2V0LnBvaW50SGlnaGxpZ2h0RmlsbCB8fCBkYXRhc2V0LnBvaW50Q29sb3IsXG5cdFx0XHRcdFx0XHRoaWdobGlnaHRTdHJva2UgOiBkYXRhc2V0LnBvaW50SGlnaGxpZ2h0U3Ryb2tlIHx8IGRhdGFzZXQucG9pbnRTdHJva2VDb2xvclxuXHRcdFx0XHRcdH0pKTtcblx0XHRcdFx0fSx0aGlzKTtcblxuXHRcdFx0fSx0aGlzKTtcblxuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9LFxuXHRcdGVhY2hQb2ludHMgOiBmdW5jdGlvbihjYWxsYmFjayl7XG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5kYXRhc2V0cyxmdW5jdGlvbihkYXRhc2V0KXtcblx0XHRcdFx0aGVscGVycy5lYWNoKGRhdGFzZXQucG9pbnRzLGNhbGxiYWNrLHRoaXMpO1xuXHRcdFx0fSx0aGlzKTtcblx0XHR9LFxuXG5cdFx0Z2V0UG9pbnRzQXRFdmVudCA6IGZ1bmN0aW9uKGV2dCl7XG5cdFx0XHR2YXIgbW91c2VQb3NpdGlvbiA9IGhlbHBlcnMuZ2V0UmVsYXRpdmVQb3NpdGlvbihldnQpLFxuXHRcdFx0XHRmcm9tQ2VudGVyID0gaGVscGVycy5nZXRBbmdsZUZyb21Qb2ludCh7XG5cdFx0XHRcdFx0eDogdGhpcy5zY2FsZS54Q2VudGVyLFxuXHRcdFx0XHRcdHk6IHRoaXMuc2NhbGUueUNlbnRlclxuXHRcdFx0XHR9LCBtb3VzZVBvc2l0aW9uKTtcblxuXHRcdFx0dmFyIGFuZ2xlUGVySW5kZXggPSAoTWF0aC5QSSAqIDIpIC90aGlzLnNjYWxlLnZhbHVlc0NvdW50LFxuXHRcdFx0XHRwb2ludEluZGV4ID0gTWF0aC5yb3VuZCgoZnJvbUNlbnRlci5hbmdsZSAtIE1hdGguUEkgKiAxLjUpIC8gYW5nbGVQZXJJbmRleCksXG5cdFx0XHRcdGFjdGl2ZVBvaW50c0NvbGxlY3Rpb24gPSBbXTtcblxuXHRcdFx0Ly8gSWYgd2UncmUgYXQgdGhlIHRvcCwgbWFrZSB0aGUgcG9pbnRJbmRleCAwIHRvIGdldCB0aGUgZmlyc3Qgb2YgdGhlIGFycmF5LlxuXHRcdFx0aWYgKHBvaW50SW5kZXggPj0gdGhpcy5zY2FsZS52YWx1ZXNDb3VudCB8fCBwb2ludEluZGV4IDwgMCl7XG5cdFx0XHRcdHBvaW50SW5kZXggPSAwO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZnJvbUNlbnRlci5kaXN0YW5jZSA8PSB0aGlzLnNjYWxlLmRyYXdpbmdBcmVhKXtcblx0XHRcdFx0aGVscGVycy5lYWNoKHRoaXMuZGF0YXNldHMsIGZ1bmN0aW9uKGRhdGFzZXQpe1xuXHRcdFx0XHRcdGFjdGl2ZVBvaW50c0NvbGxlY3Rpb24ucHVzaChkYXRhc2V0LnBvaW50c1twb2ludEluZGV4XSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gYWN0aXZlUG9pbnRzQ29sbGVjdGlvbjtcblx0XHR9LFxuXG5cdFx0YnVpbGRTY2FsZSA6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0dGhpcy5zY2FsZSA9IG5ldyBDaGFydC5SYWRpYWxTY2FsZSh7XG5cdFx0XHRcdGRpc3BsYXk6IHRoaXMub3B0aW9ucy5zaG93U2NhbGUsXG5cdFx0XHRcdGZvbnRTdHlsZTogdGhpcy5vcHRpb25zLnNjYWxlRm9udFN0eWxlLFxuXHRcdFx0XHRmb250U2l6ZTogdGhpcy5vcHRpb25zLnNjYWxlRm9udFNpemUsXG5cdFx0XHRcdGZvbnRGYW1pbHk6IHRoaXMub3B0aW9ucy5zY2FsZUZvbnRGYW1pbHksXG5cdFx0XHRcdGZvbnRDb2xvcjogdGhpcy5vcHRpb25zLnNjYWxlRm9udENvbG9yLFxuXHRcdFx0XHRzaG93TGFiZWxzOiB0aGlzLm9wdGlvbnMuc2NhbGVTaG93TGFiZWxzLFxuXHRcdFx0XHRzaG93TGFiZWxCYWNrZHJvcDogdGhpcy5vcHRpb25zLnNjYWxlU2hvd0xhYmVsQmFja2Ryb3AsXG5cdFx0XHRcdGJhY2tkcm9wQ29sb3I6IHRoaXMub3B0aW9ucy5zY2FsZUJhY2tkcm9wQ29sb3IsXG5cdFx0XHRcdGJhY2tkcm9wUGFkZGluZ1kgOiB0aGlzLm9wdGlvbnMuc2NhbGVCYWNrZHJvcFBhZGRpbmdZLFxuXHRcdFx0XHRiYWNrZHJvcFBhZGRpbmdYOiB0aGlzLm9wdGlvbnMuc2NhbGVCYWNrZHJvcFBhZGRpbmdYLFxuXHRcdFx0XHRsaW5lV2lkdGg6ICh0aGlzLm9wdGlvbnMuc2NhbGVTaG93TGluZSkgPyB0aGlzLm9wdGlvbnMuc2NhbGVMaW5lV2lkdGggOiAwLFxuXHRcdFx0XHRsaW5lQ29sb3I6IHRoaXMub3B0aW9ucy5zY2FsZUxpbmVDb2xvcixcblx0XHRcdFx0YW5nbGVMaW5lQ29sb3IgOiB0aGlzLm9wdGlvbnMuYW5nbGVMaW5lQ29sb3IsXG5cdFx0XHRcdGFuZ2xlTGluZVdpZHRoIDogKHRoaXMub3B0aW9ucy5hbmdsZVNob3dMaW5lT3V0KSA/IHRoaXMub3B0aW9ucy5hbmdsZUxpbmVXaWR0aCA6IDAsXG5cdFx0XHRcdC8vIFBvaW50IGxhYmVscyBhdCB0aGUgZWRnZSBvZiBlYWNoIGxpbmVcblx0XHRcdFx0cG9pbnRMYWJlbEZvbnRDb2xvciA6IHRoaXMub3B0aW9ucy5wb2ludExhYmVsRm9udENvbG9yLFxuXHRcdFx0XHRwb2ludExhYmVsRm9udFNpemUgOiB0aGlzLm9wdGlvbnMucG9pbnRMYWJlbEZvbnRTaXplLFxuXHRcdFx0XHRwb2ludExhYmVsRm9udEZhbWlseSA6IHRoaXMub3B0aW9ucy5wb2ludExhYmVsRm9udEZhbWlseSxcblx0XHRcdFx0cG9pbnRMYWJlbEZvbnRTdHlsZSA6IHRoaXMub3B0aW9ucy5wb2ludExhYmVsRm9udFN0eWxlLFxuXHRcdFx0XHRoZWlnaHQgOiB0aGlzLmNoYXJ0LmhlaWdodCxcblx0XHRcdFx0d2lkdGg6IHRoaXMuY2hhcnQud2lkdGgsXG5cdFx0XHRcdHhDZW50ZXI6IHRoaXMuY2hhcnQud2lkdGgvMixcblx0XHRcdFx0eUNlbnRlcjogdGhpcy5jaGFydC5oZWlnaHQvMixcblx0XHRcdFx0Y3R4IDogdGhpcy5jaGFydC5jdHgsXG5cdFx0XHRcdHRlbXBsYXRlU3RyaW5nOiB0aGlzLm9wdGlvbnMuc2NhbGVMYWJlbCxcblx0XHRcdFx0bGFiZWxzOiBkYXRhLmxhYmVscyxcblx0XHRcdFx0dmFsdWVzQ291bnQ6IGRhdGEuZGF0YXNldHNbMF0uZGF0YS5sZW5ndGhcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLnNjYWxlLnNldFNjYWxlU2l6ZSgpO1xuXHRcdFx0dGhpcy51cGRhdGVTY2FsZVJhbmdlKGRhdGEuZGF0YXNldHMpO1xuXHRcdFx0dGhpcy5zY2FsZS5idWlsZFlMYWJlbHMoKTtcblx0XHR9LFxuXHRcdHVwZGF0ZVNjYWxlUmFuZ2U6IGZ1bmN0aW9uKGRhdGFzZXRzKXtcblx0XHRcdHZhciB2YWx1ZXNBcnJheSA9IChmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgdG90YWxEYXRhQXJyYXkgPSBbXTtcblx0XHRcdFx0aGVscGVycy5lYWNoKGRhdGFzZXRzLGZ1bmN0aW9uKGRhdGFzZXQpe1xuXHRcdFx0XHRcdGlmIChkYXRhc2V0LmRhdGEpe1xuXHRcdFx0XHRcdFx0dG90YWxEYXRhQXJyYXkgPSB0b3RhbERhdGFBcnJheS5jb25jYXQoZGF0YXNldC5kYXRhKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRoZWxwZXJzLmVhY2goZGF0YXNldC5wb2ludHMsIGZ1bmN0aW9uKHBvaW50KXtcblx0XHRcdFx0XHRcdFx0dG90YWxEYXRhQXJyYXkucHVzaChwb2ludC52YWx1ZSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gdG90YWxEYXRhQXJyYXk7XG5cdFx0XHR9KSgpO1xuXG5cblx0XHRcdHZhciBzY2FsZVNpemVzID0gKHRoaXMub3B0aW9ucy5zY2FsZU92ZXJyaWRlKSA/XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzdGVwczogdGhpcy5vcHRpb25zLnNjYWxlU3RlcHMsXG5cdFx0XHRcdFx0c3RlcFZhbHVlOiB0aGlzLm9wdGlvbnMuc2NhbGVTdGVwV2lkdGgsXG5cdFx0XHRcdFx0bWluOiB0aGlzLm9wdGlvbnMuc2NhbGVTdGFydFZhbHVlLFxuXHRcdFx0XHRcdG1heDogdGhpcy5vcHRpb25zLnNjYWxlU3RhcnRWYWx1ZSArICh0aGlzLm9wdGlvbnMuc2NhbGVTdGVwcyAqIHRoaXMub3B0aW9ucy5zY2FsZVN0ZXBXaWR0aClcblx0XHRcdFx0fSA6XG5cdFx0XHRcdGhlbHBlcnMuY2FsY3VsYXRlU2NhbGVSYW5nZShcblx0XHRcdFx0XHR2YWx1ZXNBcnJheSxcblx0XHRcdFx0XHRoZWxwZXJzLm1pbihbdGhpcy5jaGFydC53aWR0aCwgdGhpcy5jaGFydC5oZWlnaHRdKS8yLFxuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5zY2FsZUZvbnRTaXplLFxuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5zY2FsZUJlZ2luQXRaZXJvLFxuXHRcdFx0XHRcdHRoaXMub3B0aW9ucy5zY2FsZUludGVnZXJzT25seVxuXHRcdFx0XHQpO1xuXG5cdFx0XHRoZWxwZXJzLmV4dGVuZChcblx0XHRcdFx0dGhpcy5zY2FsZSxcblx0XHRcdFx0c2NhbGVTaXplc1xuXHRcdFx0KTtcblxuXHRcdH0sXG5cdFx0YWRkRGF0YSA6IGZ1bmN0aW9uKHZhbHVlc0FycmF5LGxhYmVsKXtcblx0XHRcdC8vTWFwIHRoZSB2YWx1ZXMgYXJyYXkgZm9yIGVhY2ggb2YgdGhlIGRhdGFzZXRzXG5cdFx0XHR0aGlzLnNjYWxlLnZhbHVlc0NvdW50Kys7XG5cdFx0XHRoZWxwZXJzLmVhY2godmFsdWVzQXJyYXksZnVuY3Rpb24odmFsdWUsZGF0YXNldEluZGV4KXtcblx0XHRcdFx0dmFyIHBvaW50UG9zaXRpb24gPSB0aGlzLnNjYWxlLmdldFBvaW50UG9zaXRpb24odGhpcy5zY2FsZS52YWx1ZXNDb3VudCwgdGhpcy5zY2FsZS5jYWxjdWxhdGVDZW50ZXJPZmZzZXQodmFsdWUpKTtcblx0XHRcdFx0dGhpcy5kYXRhc2V0c1tkYXRhc2V0SW5kZXhdLnBvaW50cy5wdXNoKG5ldyB0aGlzLlBvaW50Q2xhc3Moe1xuXHRcdFx0XHRcdHZhbHVlIDogdmFsdWUsXG5cdFx0XHRcdFx0bGFiZWwgOiBsYWJlbCxcblx0XHRcdFx0XHR4OiBwb2ludFBvc2l0aW9uLngsXG5cdFx0XHRcdFx0eTogcG9pbnRQb3NpdGlvbi55LFxuXHRcdFx0XHRcdHN0cm9rZUNvbG9yIDogdGhpcy5kYXRhc2V0c1tkYXRhc2V0SW5kZXhdLnBvaW50U3Ryb2tlQ29sb3IsXG5cdFx0XHRcdFx0ZmlsbENvbG9yIDogdGhpcy5kYXRhc2V0c1tkYXRhc2V0SW5kZXhdLnBvaW50Q29sb3Jcblx0XHRcdFx0fSkpO1xuXHRcdFx0fSx0aGlzKTtcblxuXHRcdFx0dGhpcy5zY2FsZS5sYWJlbHMucHVzaChsYWJlbCk7XG5cblx0XHRcdHRoaXMucmVmbG93KCk7XG5cblx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0fSxcblx0XHRyZW1vdmVEYXRhIDogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuc2NhbGUudmFsdWVzQ291bnQtLTtcblx0XHRcdHRoaXMuc2NhbGUubGFiZWxzLnNoaWZ0KCk7XG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5kYXRhc2V0cyxmdW5jdGlvbihkYXRhc2V0KXtcblx0XHRcdFx0ZGF0YXNldC5wb2ludHMuc2hpZnQoKTtcblx0XHRcdH0sdGhpcyk7XG5cdFx0XHR0aGlzLnJlZmxvdygpO1xuXHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHR9LFxuXHRcdHVwZGF0ZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLmVhY2hQb2ludHMoZnVuY3Rpb24ocG9pbnQpe1xuXHRcdFx0XHRwb2ludC5zYXZlKCk7XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMucmVmbG93KCk7XG5cdFx0XHR0aGlzLnJlbmRlcigpO1xuXHRcdH0sXG5cdFx0cmVmbG93OiBmdW5jdGlvbigpe1xuXHRcdFx0aGVscGVycy5leHRlbmQodGhpcy5zY2FsZSwge1xuXHRcdFx0XHR3aWR0aCA6IHRoaXMuY2hhcnQud2lkdGgsXG5cdFx0XHRcdGhlaWdodDogdGhpcy5jaGFydC5oZWlnaHQsXG5cdFx0XHRcdHNpemUgOiBoZWxwZXJzLm1pbihbdGhpcy5jaGFydC53aWR0aCwgdGhpcy5jaGFydC5oZWlnaHRdKSxcblx0XHRcdFx0eENlbnRlcjogdGhpcy5jaGFydC53aWR0aC8yLFxuXHRcdFx0XHR5Q2VudGVyOiB0aGlzLmNoYXJ0LmhlaWdodC8yXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMudXBkYXRlU2NhbGVSYW5nZSh0aGlzLmRhdGFzZXRzKTtcblx0XHRcdHRoaXMuc2NhbGUuc2V0U2NhbGVTaXplKCk7XG5cdFx0XHR0aGlzLnNjYWxlLmJ1aWxkWUxhYmVscygpO1xuXHRcdH0sXG5cdFx0ZHJhdyA6IGZ1bmN0aW9uKGVhc2Upe1xuXHRcdFx0dmFyIGVhc2VEZWNpbWFsID0gZWFzZSB8fCAxLFxuXHRcdFx0XHRjdHggPSB0aGlzLmNoYXJ0LmN0eDtcblx0XHRcdHRoaXMuY2xlYXIoKTtcblx0XHRcdHRoaXMuc2NhbGUuZHJhdygpO1xuXG5cdFx0XHRoZWxwZXJzLmVhY2godGhpcy5kYXRhc2V0cyxmdW5jdGlvbihkYXRhc2V0KXtcblxuXHRcdFx0XHQvL1RyYW5zaXRpb24gZWFjaCBwb2ludCBmaXJzdCBzbyB0aGF0IHRoZSBsaW5lIGFuZCBwb2ludCBkcmF3aW5nIGlzbid0IG91dCBvZiBzeW5jXG5cdFx0XHRcdGhlbHBlcnMuZWFjaChkYXRhc2V0LnBvaW50cyxmdW5jdGlvbihwb2ludCxpbmRleCl7XG5cdFx0XHRcdFx0aWYgKHBvaW50Lmhhc1ZhbHVlKCkpe1xuXHRcdFx0XHRcdFx0cG9pbnQudHJhbnNpdGlvbih0aGlzLnNjYWxlLmdldFBvaW50UG9zaXRpb24oaW5kZXgsIHRoaXMuc2NhbGUuY2FsY3VsYXRlQ2VudGVyT2Zmc2V0KHBvaW50LnZhbHVlKSksIGVhc2VEZWNpbWFsKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sdGhpcyk7XG5cblxuXG5cdFx0XHRcdC8vRHJhdyB0aGUgbGluZSBiZXR3ZWVuIGFsbCB0aGUgcG9pbnRzXG5cdFx0XHRcdGN0eC5saW5lV2lkdGggPSB0aGlzLm9wdGlvbnMuZGF0YXNldFN0cm9rZVdpZHRoO1xuXHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSBkYXRhc2V0LnN0cm9rZUNvbG9yO1xuXHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdGhlbHBlcnMuZWFjaChkYXRhc2V0LnBvaW50cyxmdW5jdGlvbihwb2ludCxpbmRleCl7XG5cdFx0XHRcdFx0aWYgKGluZGV4ID09PSAwKXtcblx0XHRcdFx0XHRcdGN0eC5tb3ZlVG8ocG9pbnQueCxwb2ludC55KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdGN0eC5saW5lVG8ocG9pbnQueCxwb2ludC55KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sdGhpcyk7XG5cdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXG5cdFx0XHRcdGN0eC5maWxsU3R5bGUgPSBkYXRhc2V0LmZpbGxDb2xvcjtcblx0XHRcdFx0Y3R4LmZpbGwoKTtcblxuXHRcdFx0XHQvL05vdyBkcmF3IHRoZSBwb2ludHMgb3ZlciB0aGUgbGluZVxuXHRcdFx0XHQvL0EgbGl0dGxlIGluZWZmaWNpZW50IGRvdWJsZSBsb29waW5nLCBidXQgYmV0dGVyIHRoYW4gdGhlIGxpbmVcblx0XHRcdFx0Ly9sYWdnaW5nIGJlaGluZCB0aGUgcG9pbnQgcG9zaXRpb25zXG5cdFx0XHRcdGhlbHBlcnMuZWFjaChkYXRhc2V0LnBvaW50cyxmdW5jdGlvbihwb2ludCl7XG5cdFx0XHRcdFx0aWYgKHBvaW50Lmhhc1ZhbHVlKCkpe1xuXHRcdFx0XHRcdFx0cG9pbnQuZHJhdygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdH0sdGhpcyk7XG5cblx0XHR9XG5cblx0fSk7XG5cblxuXG5cblxufSkuY2FsbCh0aGlzKTsiLCIvLyEgbW9tZW50LmpzXG4vLyEgdmVyc2lvbiA6IDIuMTAuMlxuLy8hIGF1dGhvcnMgOiBUaW0gV29vZCwgSXNrcmVuIENoZXJuZXYsIE1vbWVudC5qcyBjb250cmlidXRvcnNcbi8vISBsaWNlbnNlIDogTUlUXG4vLyEgbW9tZW50anMuY29tXG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gICAgZ2xvYmFsLm1vbWVudCA9IGZhY3RvcnkoKVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBob29rQ2FsbGJhY2s7XG5cbiAgICBmdW5jdGlvbiB1dGlsc19ob29rc19faG9va3MgKCkge1xuICAgICAgICByZXR1cm4gaG9va0NhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBpcyBkb25lIHRvIHJlZ2lzdGVyIHRoZSBtZXRob2QgY2FsbGVkIHdpdGggbW9tZW50KClcbiAgICAvLyB3aXRob3V0IGNyZWF0aW5nIGNpcmN1bGFyIGRlcGVuZGVuY2llcy5cbiAgICBmdW5jdGlvbiBzZXRIb29rQ2FsbGJhY2sgKGNhbGxiYWNrKSB7XG4gICAgICAgIGhvb2tDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmF1bHRQYXJzaW5nRmxhZ3MoKSB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gZGVlcCBjbG9uZSB0aGlzIG9iamVjdC5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVtcHR5ICAgICAgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgdW51c2VkVG9rZW5zICAgIDogW10sXG4gICAgICAgICAgICB1bnVzZWRJbnB1dCAgICAgOiBbXSxcbiAgICAgICAgICAgIG92ZXJmbG93ICAgICAgICA6IC0yLFxuICAgICAgICAgICAgY2hhcnNMZWZ0T3ZlciAgIDogMCxcbiAgICAgICAgICAgIG51bGxJbnB1dCAgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgaW52YWxpZE1vbnRoICAgIDogbnVsbCxcbiAgICAgICAgICAgIGludmFsaWRGb3JtYXQgICA6IGZhbHNlLFxuICAgICAgICAgICAgdXNlckludmFsaWRhdGVkIDogZmFsc2UsXG4gICAgICAgICAgICBpc28gICAgICAgICAgICAgOiBmYWxzZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQXJyYXkoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEYXRlKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBEYXRlXScgfHwgaW5wdXQgaW5zdGFuY2VvZiBEYXRlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1hcChhcnIsIGZuKSB7XG4gICAgICAgIHZhciByZXMgPSBbXSwgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGFyci5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgcmVzLnB1c2goZm4oYXJyW2ldLCBpKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYXNPd25Qcm9wKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhLCBiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHRlbmQoYSwgYikge1xuICAgICAgICBmb3IgKHZhciBpIGluIGIpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wKGIsIGkpKSB7XG4gICAgICAgICAgICAgICAgYVtpXSA9IGJbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFzT3duUHJvcChiLCAndG9TdHJpbmcnKSkge1xuICAgICAgICAgICAgYS50b1N0cmluZyA9IGIudG9TdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFzT3duUHJvcChiLCAndmFsdWVPZicpKSB7XG4gICAgICAgICAgICBhLnZhbHVlT2YgPSBiLnZhbHVlT2Y7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVfdXRjX19jcmVhdGVVVEMgKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0KSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVMb2NhbE9yVVRDKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCB0cnVlKS51dGMoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZF9faXNWYWxpZChtKSB7XG4gICAgICAgIGlmIChtLl9pc1ZhbGlkID09IG51bGwpIHtcbiAgICAgICAgICAgIG0uX2lzVmFsaWQgPSAhaXNOYU4obS5fZC5nZXRUaW1lKCkpICYmXG4gICAgICAgICAgICAgICAgbS5fcGYub3ZlcmZsb3cgPCAwICYmXG4gICAgICAgICAgICAgICAgIW0uX3BmLmVtcHR5ICYmXG4gICAgICAgICAgICAgICAgIW0uX3BmLmludmFsaWRNb250aCAmJlxuICAgICAgICAgICAgICAgICFtLl9wZi5udWxsSW5wdXQgJiZcbiAgICAgICAgICAgICAgICAhbS5fcGYuaW52YWxpZEZvcm1hdCAmJlxuICAgICAgICAgICAgICAgICFtLl9wZi51c2VySW52YWxpZGF0ZWQ7XG5cbiAgICAgICAgICAgIGlmIChtLl9zdHJpY3QpIHtcbiAgICAgICAgICAgICAgICBtLl9pc1ZhbGlkID0gbS5faXNWYWxpZCAmJlxuICAgICAgICAgICAgICAgICAgICBtLl9wZi5jaGFyc0xlZnRPdmVyID09PSAwICYmXG4gICAgICAgICAgICAgICAgICAgIG0uX3BmLnVudXNlZFRva2Vucy5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgbS5fcGYuYmlnSG91ciA9PT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtLl9pc1ZhbGlkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkX19jcmVhdGVJbnZhbGlkIChmbGFncykge1xuICAgICAgICB2YXIgbSA9IGNyZWF0ZV91dGNfX2NyZWF0ZVVUQyhOYU4pO1xuICAgICAgICBpZiAoZmxhZ3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgZXh0ZW5kKG0uX3BmLCBmbGFncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtLl9wZi51c2VySW52YWxpZGF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfVxuXG4gICAgdmFyIG1vbWVudFByb3BlcnRpZXMgPSB1dGlsc19ob29rc19faG9va3MubW9tZW50UHJvcGVydGllcyA9IFtdO1xuXG4gICAgZnVuY3Rpb24gY29weUNvbmZpZyh0bywgZnJvbSkge1xuICAgICAgICB2YXIgaSwgcHJvcCwgdmFsO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5faXNBTW9tZW50T2JqZWN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2lzQU1vbWVudE9iamVjdCA9IGZyb20uX2lzQU1vbWVudE9iamVjdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2kgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5faSA9IGZyb20uX2k7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9mICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2YgPSBmcm9tLl9mO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9sID0gZnJvbS5fbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX3N0cmljdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9zdHJpY3QgPSBmcm9tLl9zdHJpY3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl90em0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fdHptID0gZnJvbS5fdHptO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5faXNVVEMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5faXNVVEMgPSBmcm9tLl9pc1VUQztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX29mZnNldCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9vZmZzZXQgPSBmcm9tLl9vZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9wZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9wZiA9IGZyb20uX3BmO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fbG9jYWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2xvY2FsZSA9IGZyb20uX2xvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb21lbnRQcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAoaSBpbiBtb21lbnRQcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgcHJvcCA9IG1vbWVudFByb3BlcnRpZXNbaV07XG4gICAgICAgICAgICAgICAgdmFsID0gZnJvbVtwcm9wXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9bcHJvcF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvO1xuICAgIH1cblxuICAgIHZhciB1cGRhdGVJblByb2dyZXNzID0gZmFsc2U7XG5cbiAgICAvLyBNb21lbnQgcHJvdG90eXBlIG9iamVjdFxuICAgIGZ1bmN0aW9uIE1vbWVudChjb25maWcpIHtcbiAgICAgICAgY29weUNvbmZpZyh0aGlzLCBjb25maWcpO1xuICAgICAgICB0aGlzLl9kID0gbmV3IERhdGUoK2NvbmZpZy5fZCk7XG4gICAgICAgIC8vIFByZXZlbnQgaW5maW5pdGUgbG9vcCBpbiBjYXNlIHVwZGF0ZU9mZnNldCBjcmVhdGVzIG5ldyBtb21lbnRcbiAgICAgICAgLy8gb2JqZWN0cy5cbiAgICAgICAgaWYgKHVwZGF0ZUluUHJvZ3Jlc3MgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB1cGRhdGVJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy51cGRhdGVPZmZzZXQodGhpcyk7XG4gICAgICAgICAgICB1cGRhdGVJblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc01vbWVudCAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBNb21lbnQgfHwgKG9iaiAhPSBudWxsICYmIGhhc093blByb3Aob2JqLCAnX2lzQU1vbWVudE9iamVjdCcpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0ludChhcmd1bWVudEZvckNvZXJjaW9uKSB7XG4gICAgICAgIHZhciBjb2VyY2VkTnVtYmVyID0gK2FyZ3VtZW50Rm9yQ29lcmNpb24sXG4gICAgICAgICAgICB2YWx1ZSA9IDA7XG5cbiAgICAgICAgaWYgKGNvZXJjZWROdW1iZXIgIT09IDAgJiYgaXNGaW5pdGUoY29lcmNlZE51bWJlcikpIHtcbiAgICAgICAgICAgIGlmIChjb2VyY2VkTnVtYmVyID49IDApIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IE1hdGguZmxvb3IoY29lcmNlZE51bWJlcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gTWF0aC5jZWlsKGNvZXJjZWROdW1iZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXBhcmVBcnJheXMoYXJyYXkxLCBhcnJheTIsIGRvbnRDb252ZXJ0KSB7XG4gICAgICAgIHZhciBsZW4gPSBNYXRoLm1pbihhcnJheTEubGVuZ3RoLCBhcnJheTIubGVuZ3RoKSxcbiAgICAgICAgICAgIGxlbmd0aERpZmYgPSBNYXRoLmFicyhhcnJheTEubGVuZ3RoIC0gYXJyYXkyLmxlbmd0aCksXG4gICAgICAgICAgICBkaWZmcyA9IDAsXG4gICAgICAgICAgICBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgoZG9udENvbnZlcnQgJiYgYXJyYXkxW2ldICE9PSBhcnJheTJbaV0pIHx8XG4gICAgICAgICAgICAgICAgKCFkb250Q29udmVydCAmJiB0b0ludChhcnJheTFbaV0pICE9PSB0b0ludChhcnJheTJbaV0pKSkge1xuICAgICAgICAgICAgICAgIGRpZmZzKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpZmZzICsgbGVuZ3RoRGlmZjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBMb2NhbGUoKSB7XG4gICAgfVxuXG4gICAgdmFyIGxvY2FsZXMgPSB7fTtcbiAgICB2YXIgZ2xvYmFsTG9jYWxlO1xuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplTG9jYWxlKGtleSkge1xuICAgICAgICByZXR1cm4ga2V5ID8ga2V5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnXycsICctJykgOiBrZXk7XG4gICAgfVxuXG4gICAgLy8gcGljayB0aGUgbG9jYWxlIGZyb20gdGhlIGFycmF5XG4gICAgLy8gdHJ5IFsnZW4tYXUnLCAnZW4tZ2InXSBhcyAnZW4tYXUnLCAnZW4tZ2InLCAnZW4nLCBhcyBpbiBtb3ZlIHRocm91Z2ggdGhlIGxpc3QgdHJ5aW5nIGVhY2hcbiAgICAvLyBzdWJzdHJpbmcgZnJvbSBtb3N0IHNwZWNpZmljIHRvIGxlYXN0LCBidXQgbW92ZSB0byB0aGUgbmV4dCBhcnJheSBpdGVtIGlmIGl0J3MgYSBtb3JlIHNwZWNpZmljIHZhcmlhbnQgdGhhbiB0aGUgY3VycmVudCByb290XG4gICAgZnVuY3Rpb24gY2hvb3NlTG9jYWxlKG5hbWVzKSB7XG4gICAgICAgIHZhciBpID0gMCwgaiwgbmV4dCwgbG9jYWxlLCBzcGxpdDtcblxuICAgICAgICB3aGlsZSAoaSA8IG5hbWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgc3BsaXQgPSBub3JtYWxpemVMb2NhbGUobmFtZXNbaV0pLnNwbGl0KCctJyk7XG4gICAgICAgICAgICBqID0gc3BsaXQubGVuZ3RoO1xuICAgICAgICAgICAgbmV4dCA9IG5vcm1hbGl6ZUxvY2FsZShuYW1lc1tpICsgMV0pO1xuICAgICAgICAgICAgbmV4dCA9IG5leHQgPyBuZXh0LnNwbGl0KCctJykgOiBudWxsO1xuICAgICAgICAgICAgd2hpbGUgKGogPiAwKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxlID0gbG9hZExvY2FsZShzcGxpdC5zbGljZSgwLCBqKS5qb2luKCctJykpO1xuICAgICAgICAgICAgICAgIGlmIChsb2NhbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5leHQgJiYgbmV4dC5sZW5ndGggPj0gaiAmJiBjb21wYXJlQXJyYXlzKHNwbGl0LCBuZXh0LCB0cnVlKSA+PSBqIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvL3RoZSBuZXh0IGFycmF5IGl0ZW0gaXMgYmV0dGVyIHRoYW4gYSBzaGFsbG93ZXIgc3Vic3RyaW5nIG9mIHRoaXMgb25lXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBqLS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZExvY2FsZShuYW1lKSB7XG4gICAgICAgIHZhciBvbGRMb2NhbGUgPSBudWxsO1xuICAgICAgICAvLyBUT0RPOiBGaW5kIGEgYmV0dGVyIHdheSB0byByZWdpc3RlciBhbmQgbG9hZCBhbGwgdGhlIGxvY2FsZXMgaW4gTm9kZVxuICAgICAgICBpZiAoIWxvY2FsZXNbbmFtZV0gJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICBtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgb2xkTG9jYWxlID0gZ2xvYmFsTG9jYWxlLl9hYmJyO1xuICAgICAgICAgICAgICAgIHJlcXVpcmUoJy4vbG9jYWxlLycgKyBuYW1lKTtcbiAgICAgICAgICAgICAgICAvLyBiZWNhdXNlIGRlZmluZUxvY2FsZSBjdXJyZW50bHkgYWxzbyBzZXRzIHRoZSBnbG9iYWwgbG9jYWxlLCB3ZVxuICAgICAgICAgICAgICAgIC8vIHdhbnQgdG8gdW5kbyB0aGF0IGZvciBsYXp5IGxvYWRlZCBsb2NhbGVzXG4gICAgICAgICAgICAgICAgbG9jYWxlX2xvY2FsZXNfX2dldFNldEdsb2JhbExvY2FsZShvbGRMb2NhbGUpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkgeyB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG4gICAgfVxuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGxvYWQgbG9jYWxlIGFuZCB0aGVuIHNldCB0aGUgZ2xvYmFsIGxvY2FsZS4gIElmXG4gICAgLy8gbm8gYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4sIGl0IHdpbGwgc2ltcGx5IHJldHVybiB0aGUgY3VycmVudCBnbG9iYWxcbiAgICAvLyBsb2NhbGUga2V5LlxuICAgIGZ1bmN0aW9uIGxvY2FsZV9sb2NhbGVzX19nZXRTZXRHbG9iYWxMb2NhbGUgKGtleSwgdmFsdWVzKSB7XG4gICAgICAgIHZhciBkYXRhO1xuICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZShrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRlZmluZUxvY2FsZShrZXksIHZhbHVlcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gbW9tZW50LmR1cmF0aW9uLl9sb2NhbGUgPSBtb21lbnQuX2xvY2FsZSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgZ2xvYmFsTG9jYWxlID0gZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBnbG9iYWxMb2NhbGUuX2FiYnI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmaW5lTG9jYWxlIChuYW1lLCB2YWx1ZXMpIHtcbiAgICAgICAgaWYgKHZhbHVlcyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFsdWVzLmFiYnIgPSBuYW1lO1xuICAgICAgICAgICAgaWYgKCFsb2NhbGVzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxlc1tuYW1lXSA9IG5ldyBMb2NhbGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvY2FsZXNbbmFtZV0uc2V0KHZhbHVlcyk7XG5cbiAgICAgICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXQgZm9yIG5vdzogYWxzbyBzZXQgdGhlIGxvY2FsZVxuICAgICAgICAgICAgbG9jYWxlX2xvY2FsZXNfX2dldFNldEdsb2JhbExvY2FsZShuYW1lKTtcblxuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB1c2VmdWwgZm9yIHRlc3RpbmdcbiAgICAgICAgICAgIGRlbGV0ZSBsb2NhbGVzW25hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZXR1cm5zIGxvY2FsZSBkYXRhXG4gICAgZnVuY3Rpb24gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZSAoa2V5KSB7XG4gICAgICAgIHZhciBsb2NhbGU7XG5cbiAgICAgICAgaWYgKGtleSAmJiBrZXkuX2xvY2FsZSAmJiBrZXkuX2xvY2FsZS5fYWJicikge1xuICAgICAgICAgICAga2V5ID0ga2V5Ll9sb2NhbGUuX2FiYnI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbExvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAgICAvL3Nob3J0LWNpcmN1aXQgZXZlcnl0aGluZyBlbHNlXG4gICAgICAgICAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKGtleSk7XG4gICAgICAgICAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleSA9IFtrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNob29zZUxvY2FsZShrZXkpO1xuICAgIH1cblxuICAgIHZhciBhbGlhc2VzID0ge307XG5cbiAgICBmdW5jdGlvbiBhZGRVbml0QWxpYXMgKHVuaXQsIHNob3J0aGFuZCkge1xuICAgICAgICB2YXIgbG93ZXJDYXNlID0gdW5pdC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBhbGlhc2VzW2xvd2VyQ2FzZV0gPSBhbGlhc2VzW2xvd2VyQ2FzZSArICdzJ10gPSBhbGlhc2VzW3Nob3J0aGFuZF0gPSB1bml0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZVVuaXRzKHVuaXRzKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdW5pdHMgPT09ICdzdHJpbmcnID8gYWxpYXNlc1t1bml0c10gfHwgYWxpYXNlc1t1bml0cy50b0xvd2VyQ2FzZSgpXSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVPYmplY3RVbml0cyhpbnB1dE9iamVjdCkge1xuICAgICAgICB2YXIgbm9ybWFsaXplZElucHV0ID0ge30sXG4gICAgICAgICAgICBub3JtYWxpemVkUHJvcCxcbiAgICAgICAgICAgIHByb3A7XG5cbiAgICAgICAgZm9yIChwcm9wIGluIGlucHV0T2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChpbnB1dE9iamVjdCwgcHJvcCkpIHtcbiAgICAgICAgICAgICAgICBub3JtYWxpemVkUHJvcCA9IG5vcm1hbGl6ZVVuaXRzKHByb3ApO1xuICAgICAgICAgICAgICAgIGlmIChub3JtYWxpemVkUHJvcCkge1xuICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkSW5wdXRbbm9ybWFsaXplZFByb3BdID0gaW5wdXRPYmplY3RbcHJvcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWRJbnB1dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlR2V0U2V0ICh1bml0LCBrZWVwVGltZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGdldF9zZXRfX3NldCh0aGlzLCB1bml0LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldCh0aGlzLCBrZWVwVGltZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRfc2V0X19nZXQodGhpcywgdW5pdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0X3NldF9fZ2V0IChtb20sIHVuaXQpIHtcbiAgICAgICAgcmV0dXJuIG1vbS5fZFsnZ2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldF9zZXRfX3NldCAobW9tLCB1bml0LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gbW9tLl9kWydzZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArIHVuaXRdKHZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXQgKHVuaXRzLCB2YWx1ZSkge1xuICAgICAgICB2YXIgdW5pdDtcbiAgICAgICAgaWYgKHR5cGVvZiB1bml0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGZvciAodW5pdCBpbiB1bml0cykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0KHVuaXQsIHVuaXRzW3VuaXRdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzW3VuaXRzXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW3VuaXRzXSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gemVyb0ZpbGwobnVtYmVyLCB0YXJnZXRMZW5ndGgsIGZvcmNlU2lnbikge1xuICAgICAgICB2YXIgb3V0cHV0ID0gJycgKyBNYXRoLmFicyhudW1iZXIpLFxuICAgICAgICAgICAgc2lnbiA9IG51bWJlciA+PSAwO1xuXG4gICAgICAgIHdoaWxlIChvdXRwdXQubGVuZ3RoIDwgdGFyZ2V0TGVuZ3RoKSB7XG4gICAgICAgICAgICBvdXRwdXQgPSAnMCcgKyBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChzaWduID8gKGZvcmNlU2lnbiA/ICcrJyA6ICcnKSA6ICctJykgKyBvdXRwdXQ7XG4gICAgfVxuXG4gICAgdmFyIGZvcm1hdHRpbmdUb2tlbnMgPSAvKFxcW1teXFxbXSpcXF0pfChcXFxcKT8oTW98TU0/TT9NP3xEb3xERERvfEREP0Q/RD98ZGRkP2Q/fGRvP3x3W298d10/fFdbb3xXXT98UXxZWVlZWVl8WVlZWVl8WVlZWXxZWXxnZyhnZ2c/KT98R0coR0dHPyk/fGV8RXxhfEF8aGg/fEhIP3xtbT98c3M/fFN7MSw0fXx4fFh8eno/fFpaP3wuKS9nO1xuXG4gICAgdmFyIGxvY2FsRm9ybWF0dGluZ1Rva2VucyA9IC8oXFxbW15cXFtdKlxcXSl8KFxcXFwpPyhMVFN8TFR8TEw/TD9MP3xsezEsNH0pL2c7XG5cbiAgICB2YXIgZm9ybWF0RnVuY3Rpb25zID0ge307XG5cbiAgICB2YXIgZm9ybWF0VG9rZW5GdW5jdGlvbnMgPSB7fTtcblxuICAgIC8vIHRva2VuOiAgICAnTSdcbiAgICAvLyBwYWRkZWQ6ICAgWydNTScsIDJdXG4gICAgLy8gb3JkaW5hbDogICdNbydcbiAgICAvLyBjYWxsYmFjazogZnVuY3Rpb24gKCkgeyB0aGlzLm1vbnRoKCkgKyAxIH1cbiAgICBmdW5jdGlvbiBhZGRGb3JtYXRUb2tlbiAodG9rZW4sIHBhZGRlZCwgb3JkaW5hbCwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGZ1bmMgPSBjYWxsYmFjaztcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGZ1bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNbY2FsbGJhY2tdKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbdG9rZW5dID0gZnVuYztcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFkZGVkKSB7XG4gICAgICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1twYWRkZWRbMF1dID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB6ZXJvRmlsbChmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHBhZGRlZFsxXSwgcGFkZGVkWzJdKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9yZGluYWwpIHtcbiAgICAgICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW29yZGluYWxdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5vcmRpbmFsKGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgdG9rZW4pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUZvcm1hdHRpbmdUb2tlbnMoaW5wdXQpIHtcbiAgICAgICAgaWYgKGlucHV0Lm1hdGNoKC9cXFtbXFxzXFxTXS8pKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvXlxcW3xcXF0kL2csICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvXFxcXC9nLCAnJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUZvcm1hdEZ1bmN0aW9uKGZvcm1hdCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBmb3JtYXQubWF0Y2goZm9ybWF0dGluZ1Rva2VucyksIGksIGxlbmd0aDtcblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZvcm1hdFRva2VuRnVuY3Rpb25zW2FycmF5W2ldXSkge1xuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gZm9ybWF0VG9rZW5GdW5jdGlvbnNbYXJyYXlbaV1dO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IHJlbW92ZUZvcm1hdHRpbmdUb2tlbnMoYXJyYXlbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChtb20pIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSAnJztcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSBhcnJheVtpXSBpbnN0YW5jZW9mIEZ1bmN0aW9uID8gYXJyYXlbaV0uY2FsbChtb20sIGZvcm1hdCkgOiBhcnJheVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gZm9ybWF0IGRhdGUgdXNpbmcgbmF0aXZlIGRhdGUgb2JqZWN0XG4gICAgZnVuY3Rpb24gZm9ybWF0TW9tZW50KG0sIGZvcm1hdCkge1xuICAgICAgICBpZiAoIW0uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbS5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1hdCA9IGV4cGFuZEZvcm1hdChmb3JtYXQsIG0ubG9jYWxlRGF0YSgpKTtcblxuICAgICAgICBpZiAoIWZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdKSB7XG4gICAgICAgICAgICBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSA9IG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdKG0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4cGFuZEZvcm1hdChmb3JtYXQsIGxvY2FsZSkge1xuICAgICAgICB2YXIgaSA9IDU7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVwbGFjZUxvbmdEYXRlRm9ybWF0VG9rZW5zKGlucHV0KSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxlLmxvbmdEYXRlRm9ybWF0KGlucHV0KSB8fCBpbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvY2FsRm9ybWF0dGluZ1Rva2Vucy5sYXN0SW5kZXggPSAwO1xuICAgICAgICB3aGlsZSAoaSA+PSAwICYmIGxvY2FsRm9ybWF0dGluZ1Rva2Vucy50ZXN0KGZvcm1hdCkpIHtcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKGxvY2FsRm9ybWF0dGluZ1Rva2VucywgcmVwbGFjZUxvbmdEYXRlRm9ybWF0VG9rZW5zKTtcbiAgICAgICAgICAgIGxvY2FsRm9ybWF0dGluZ1Rva2Vucy5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgaSAtPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvcm1hdDtcbiAgICB9XG5cbiAgICB2YXIgbWF0Y2gxICAgICAgICAgPSAvXFxkLzsgICAgICAgICAgICAvLyAgICAgICAwIC0gOVxuICAgIHZhciBtYXRjaDIgICAgICAgICA9IC9cXGRcXGQvOyAgICAgICAgICAvLyAgICAgIDAwIC0gOTlcbiAgICB2YXIgbWF0Y2gzICAgICAgICAgPSAvXFxkezN9LzsgICAgICAgICAvLyAgICAgMDAwIC0gOTk5XG4gICAgdmFyIG1hdGNoNCAgICAgICAgID0gL1xcZHs0fS87ICAgICAgICAgLy8gICAgMDAwMCAtIDk5OTlcbiAgICB2YXIgbWF0Y2g2ICAgICAgICAgPSAvWystXT9cXGR7Nn0vOyAgICAvLyAtOTk5OTk5IC0gOTk5OTk5XG4gICAgdmFyIG1hdGNoMXRvMiAgICAgID0gL1xcZFxcZD8vOyAgICAgICAgIC8vICAgICAgIDAgLSA5OVxuICAgIHZhciBtYXRjaDF0bzMgICAgICA9IC9cXGR7MSwzfS87ICAgICAgIC8vICAgICAgIDAgLSA5OTlcbiAgICB2YXIgbWF0Y2gxdG80ICAgICAgPSAvXFxkezEsNH0vOyAgICAgICAvLyAgICAgICAwIC0gOTk5OVxuICAgIHZhciBtYXRjaDF0bzYgICAgICA9IC9bKy1dP1xcZHsxLDZ9LzsgIC8vIC05OTk5OTkgLSA5OTk5OTlcblxuICAgIHZhciBtYXRjaFVuc2lnbmVkICA9IC9cXGQrLzsgICAgICAgICAgIC8vICAgICAgIDAgLSBpbmZcbiAgICB2YXIgbWF0Y2hTaWduZWQgICAgPSAvWystXT9cXGQrLzsgICAgICAvLyAgICAtaW5mIC0gaW5mXG5cbiAgICB2YXIgbWF0Y2hPZmZzZXQgICAgPSAvWnxbKy1dXFxkXFxkOj9cXGRcXGQvZ2k7IC8vICswMDowMCAtMDA6MDAgKzAwMDAgLTAwMDAgb3IgWlxuXG4gICAgdmFyIG1hdGNoVGltZXN0YW1wID0gL1srLV0/XFxkKyhcXC5cXGR7MSwzfSk/LzsgLy8gMTIzNDU2Nzg5IDEyMzQ1Njc4OS4xMjNcblxuICAgIC8vIGFueSB3b3JkIChvciB0d28pIGNoYXJhY3RlcnMgb3IgbnVtYmVycyBpbmNsdWRpbmcgdHdvL3RocmVlIHdvcmQgbW9udGggaW4gYXJhYmljLlxuICAgIHZhciBtYXRjaFdvcmQgPSAvWzAtOV0qWydhLXpcXHUwMEEwLVxcdTA1RkZcXHUwNzAwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdK3xbXFx1MDYwMC1cXHUwNkZGXFwvXSsoXFxzKj9bXFx1MDYwMC1cXHUwNkZGXSspezEsMn0vaTtcblxuICAgIHZhciByZWdleGVzID0ge307XG5cbiAgICBmdW5jdGlvbiBhZGRSZWdleFRva2VuICh0b2tlbiwgcmVnZXgsIHN0cmljdFJlZ2V4KSB7XG4gICAgICAgIHJlZ2V4ZXNbdG9rZW5dID0gdHlwZW9mIHJlZ2V4ID09PSAnZnVuY3Rpb24nID8gcmVnZXggOiBmdW5jdGlvbiAoaXNTdHJpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiAoaXNTdHJpY3QgJiYgc3RyaWN0UmVnZXgpID8gc3RyaWN0UmVnZXggOiByZWdleDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4gKHRva2VuLCBjb25maWcpIHtcbiAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHJlZ2V4ZXMsIHRva2VuKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAodW5lc2NhcGVGb3JtYXQodG9rZW4pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZWdleGVzW3Rva2VuXShjb25maWcuX3N0cmljdCwgY29uZmlnLl9sb2NhbGUpO1xuICAgIH1cblxuICAgIC8vIENvZGUgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM1NjE0OTMvaXMtdGhlcmUtYS1yZWdleHAtZXNjYXBlLWZ1bmN0aW9uLWluLWphdmFzY3JpcHRcbiAgICBmdW5jdGlvbiB1bmVzY2FwZUZvcm1hdChzKSB7XG4gICAgICAgIHJldHVybiBzLnJlcGxhY2UoJ1xcXFwnLCAnJykucmVwbGFjZSgvXFxcXChcXFspfFxcXFwoXFxdKXxcXFsoW15cXF1cXFtdKilcXF18XFxcXCguKS9nLCBmdW5jdGlvbiAobWF0Y2hlZCwgcDEsIHAyLCBwMywgcDQpIHtcbiAgICAgICAgICAgIHJldHVybiBwMSB8fCBwMiB8fCBwMyB8fCBwNDtcbiAgICAgICAgfSkucmVwbGFjZSgvWy1cXC9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCAnXFxcXCQmJyk7XG4gICAgfVxuXG4gICAgdmFyIHRva2VucyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gYWRkUGFyc2VUb2tlbiAodG9rZW4sIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBpLCBmdW5jID0gY2FsbGJhY2s7XG4gICAgICAgIGlmICh0eXBlb2YgdG9rZW4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0b2tlbiA9IFt0b2tlbl07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGZ1bmMgPSBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbY2FsbGJhY2tdID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdG9rZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRva2Vuc1t0b2tlbltpXV0gPSBmdW5jO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkV2Vla1BhcnNlVG9rZW4gKHRva2VuLCBjYWxsYmFjaykge1xuICAgICAgICBhZGRQYXJzZVRva2VuKHRva2VuLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgICAgICBjb25maWcuX3cgPSBjb25maWcuX3cgfHwge307XG4gICAgICAgICAgICBjYWxsYmFjayhpbnB1dCwgY29uZmlnLl93LCBjb25maWcsIHRva2VuKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkVGltZVRvQXJyYXlGcm9tVG9rZW4odG9rZW4sIGlucHV0LCBjb25maWcpIHtcbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwgJiYgaGFzT3duUHJvcCh0b2tlbnMsIHRva2VuKSkge1xuICAgICAgICAgICAgdG9rZW5zW3Rva2VuXShpbnB1dCwgY29uZmlnLl9hLCBjb25maWcsIHRva2VuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBZRUFSID0gMDtcbiAgICB2YXIgTU9OVEggPSAxO1xuICAgIHZhciBEQVRFID0gMjtcbiAgICB2YXIgSE9VUiA9IDM7XG4gICAgdmFyIE1JTlVURSA9IDQ7XG4gICAgdmFyIFNFQ09ORCA9IDU7XG4gICAgdmFyIE1JTExJU0VDT05EID0gNjtcblxuICAgIGZ1bmN0aW9uIGRheXNJbk1vbnRoKHllYXIsIG1vbnRoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQyh5ZWFyLCBtb250aCArIDEsIDApKS5nZXRVVENEYXRlKCk7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ00nLCBbJ01NJywgMl0sICdNbycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9udGgoKSArIDE7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignTU1NJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubW9udGhzU2hvcnQodGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdNTU1NJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubW9udGhzKHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ21vbnRoJywgJ00nKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ00nLCAgICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ01NJywgICBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignTU1NJywgIG1hdGNoV29yZCk7XG4gICAgYWRkUmVnZXhUb2tlbignTU1NTScsIG1hdGNoV29yZCk7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnTScsICdNTSddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W01PTlRIXSA9IHRvSW50KGlucHV0KSAtIDE7XG4gICAgfSk7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnTU1NJywgJ01NTU0nXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB2YXIgbW9udGggPSBjb25maWcuX2xvY2FsZS5tb250aHNQYXJzZShpbnB1dCwgdG9rZW4sIGNvbmZpZy5fc3RyaWN0KTtcbiAgICAgICAgLy8gaWYgd2UgZGlkbid0IGZpbmQgYSBtb250aCBuYW1lLCBtYXJrIHRoZSBkYXRlIGFzIGludmFsaWQuXG4gICAgICAgIGlmIChtb250aCAhPSBudWxsKSB7XG4gICAgICAgICAgICBhcnJheVtNT05USF0gPSBtb250aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZy5fcGYuaW52YWxpZE1vbnRoID0gaW5wdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIExPQ0FMRVNcblxuICAgIHZhciBkZWZhdWx0TG9jYWxlTW9udGhzID0gJ0phbnVhcnlfRmVicnVhcnlfTWFyY2hfQXByaWxfTWF5X0p1bmVfSnVseV9BdWd1c3RfU2VwdGVtYmVyX09jdG9iZXJfTm92ZW1iZXJfRGVjZW1iZXInLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlTW9udGhzIChtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb250aHNbbS5tb250aCgpXTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZU1vbnRoc1Nob3J0ID0gJ0phbl9GZWJfTWFyX0Fwcl9NYXlfSnVuX0p1bF9BdWdfU2VwX09jdF9Ob3ZfRGVjJy5zcGxpdCgnXycpO1xuICAgIGZ1bmN0aW9uIGxvY2FsZU1vbnRoc1Nob3J0IChtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTaG9ydFttLm1vbnRoKCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZU1vbnRoc1BhcnNlIChtb250aE5hbWUsIGZvcm1hdCwgc3RyaWN0KSB7XG4gICAgICAgIHZhciBpLCBtb20sIHJlZ2V4O1xuXG4gICAgICAgIGlmICghdGhpcy5fbW9udGhzUGFyc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9sb25nTW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3J0TW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgICAgIG1vbSA9IGNyZWF0ZV91dGNfX2NyZWF0ZVVUQyhbMjAwMCwgaV0pO1xuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiAhdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLm1vbnRocyhtb20sICcnKS5yZXBsYWNlKCcuJywgJycpICsgJyQnLCAnaScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nob3J0TW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKCdeJyArIHRoaXMubW9udGhzU2hvcnQobW9tLCAnJykucmVwbGFjZSgnLicsICcnKSArICckJywgJ2knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghc3RyaWN0ICYmICF0aGlzLl9tb250aHNQYXJzZVtpXSkge1xuICAgICAgICAgICAgICAgIHJlZ2V4ID0gJ14nICsgdGhpcy5tb250aHMobW9tLCAnJykgKyAnfF4nICsgdGhpcy5tb250aHNTaG9ydChtb20sICcnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNQYXJzZVtpXSA9IG5ldyBSZWdFeHAocmVnZXgucmVwbGFjZSgnLicsICcnKSwgJ2knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRlc3QgdGhlIHJlZ2V4XG4gICAgICAgICAgICBpZiAoc3RyaWN0ICYmIGZvcm1hdCA9PT0gJ01NTU0nICYmIHRoaXMuX2xvbmdNb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RyaWN0ICYmIGZvcm1hdCA9PT0gJ01NTScgJiYgdGhpcy5fc2hvcnRNb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCAmJiB0aGlzLl9tb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIHNldE1vbnRoIChtb20sIHZhbHVlKSB7XG4gICAgICAgIHZhciBkYXlPZk1vbnRoO1xuXG4gICAgICAgIC8vIFRPRE86IE1vdmUgdGhpcyBvdXQgb2YgaGVyZSFcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhbHVlID0gbW9tLmxvY2FsZURhdGEoKS5tb250aHNQYXJzZSh2YWx1ZSk7XG4gICAgICAgICAgICAvLyBUT0RPOiBBbm90aGVyIHNpbGVudCBmYWlsdXJlP1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZGF5T2ZNb250aCA9IE1hdGgubWluKG1vbS5kYXRlKCksIGRheXNJbk1vbnRoKG1vbS55ZWFyKCksIHZhbHVlKSk7XG4gICAgICAgIG1vbS5fZFsnc2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyAnTW9udGgnXSh2YWx1ZSwgZGF5T2ZNb250aCk7XG4gICAgICAgIHJldHVybiBtb207XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0TW9udGggKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBzZXRNb250aCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0X3NldF9fZ2V0KHRoaXMsICdNb250aCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RGF5c0luTW9udGggKCkge1xuICAgICAgICByZXR1cm4gZGF5c0luTW9udGgodGhpcy55ZWFyKCksIHRoaXMubW9udGgoKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tPdmVyZmxvdyAobSkge1xuICAgICAgICB2YXIgb3ZlcmZsb3c7XG4gICAgICAgIHZhciBhID0gbS5fYTtcblxuICAgICAgICBpZiAoYSAmJiBtLl9wZi5vdmVyZmxvdyA9PT0gLTIpIHtcbiAgICAgICAgICAgIG92ZXJmbG93ID1cbiAgICAgICAgICAgICAgICBhW01PTlRIXSAgICAgICA8IDAgfHwgYVtNT05USF0gICAgICAgPiAxMSAgPyBNT05USCA6XG4gICAgICAgICAgICAgICAgYVtEQVRFXSAgICAgICAgPCAxIHx8IGFbREFURV0gICAgICAgID4gZGF5c0luTW9udGgoYVtZRUFSXSwgYVtNT05USF0pID8gREFURSA6XG4gICAgICAgICAgICAgICAgYVtIT1VSXSAgICAgICAgPCAwIHx8IGFbSE9VUl0gICAgICAgID4gMjQgfHwgKGFbSE9VUl0gPT09IDI0ICYmIChhW01JTlVURV0gIT09IDAgfHwgYVtTRUNPTkRdICE9PSAwIHx8IGFbTUlMTElTRUNPTkRdICE9PSAwKSkgPyBIT1VSIDpcbiAgICAgICAgICAgICAgICBhW01JTlVURV0gICAgICA8IDAgfHwgYVtNSU5VVEVdICAgICAgPiA1OSAgPyBNSU5VVEUgOlxuICAgICAgICAgICAgICAgIGFbU0VDT05EXSAgICAgIDwgMCB8fCBhW1NFQ09ORF0gICAgICA+IDU5ICA/IFNFQ09ORCA6XG4gICAgICAgICAgICAgICAgYVtNSUxMSVNFQ09ORF0gPCAwIHx8IGFbTUlMTElTRUNPTkRdID4gOTk5ID8gTUlMTElTRUNPTkQgOlxuICAgICAgICAgICAgICAgIC0xO1xuXG4gICAgICAgICAgICBpZiAobS5fcGYuX292ZXJmbG93RGF5T2ZZZWFyICYmIChvdmVyZmxvdyA8IFlFQVIgfHwgb3ZlcmZsb3cgPiBEQVRFKSkge1xuICAgICAgICAgICAgICAgIG92ZXJmbG93ID0gREFURTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbS5fcGYub3ZlcmZsb3cgPSBvdmVyZmxvdztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdhcm4obXNnKSB7XG4gICAgICAgIGlmICh1dGlsc19ob29rc19faG9va3Muc3VwcHJlc3NEZXByZWNhdGlvbldhcm5pbmdzID09PSBmYWxzZSAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0RlcHJlY2F0aW9uIHdhcm5pbmc6ICcgKyBtc2cpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVwcmVjYXRlKG1zZywgZm4pIHtcbiAgICAgICAgdmFyIGZpcnN0VGltZSA9IHRydWU7XG4gICAgICAgIHJldHVybiBleHRlbmQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGZpcnN0VGltZSkge1xuICAgICAgICAgICAgICAgIHdhcm4obXNnKTtcbiAgICAgICAgICAgICAgICBmaXJzdFRpbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LCBmbik7XG4gICAgfVxuXG4gICAgdmFyIGRlcHJlY2F0aW9ucyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gZGVwcmVjYXRlU2ltcGxlKG5hbWUsIG1zZykge1xuICAgICAgICBpZiAoIWRlcHJlY2F0aW9uc1tuYW1lXSkge1xuICAgICAgICAgICAgd2Fybihtc2cpO1xuICAgICAgICAgICAgZGVwcmVjYXRpb25zW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5zdXBwcmVzc0RlcHJlY2F0aW9uV2FybmluZ3MgPSBmYWxzZTtcblxuICAgIHZhciBmcm9tX3N0cmluZ19faXNvUmVnZXggPSAvXlxccyooPzpbKy1dXFxkezZ9fFxcZHs0fSktKD86KFxcZFxcZC1cXGRcXGQpfChXXFxkXFxkJCl8KFdcXGRcXGQtXFxkKXwoXFxkXFxkXFxkKSkoKFR8ICkoXFxkXFxkKDpcXGRcXGQoOlxcZFxcZChcXC5cXGQrKT8pPyk/KT8oW1xcK1xcLV1cXGRcXGQoPzo6P1xcZFxcZCk/fFxccypaKT8pPyQvO1xuXG4gICAgdmFyIGlzb0RhdGVzID0gW1xuICAgICAgICBbJ1lZWVlZWS1NTS1ERCcsIC9bKy1dXFxkezZ9LVxcZHsyfS1cXGR7Mn0vXSxcbiAgICAgICAgWydZWVlZLU1NLUREJywgL1xcZHs0fS1cXGR7Mn0tXFxkezJ9L10sXG4gICAgICAgIFsnR0dHRy1bV11XVy1FJywgL1xcZHs0fS1XXFxkezJ9LVxcZC9dLFxuICAgICAgICBbJ0dHR0ctW1ddV1cnLCAvXFxkezR9LVdcXGR7Mn0vXSxcbiAgICAgICAgWydZWVlZLURERCcsIC9cXGR7NH0tXFxkezN9L11cbiAgICBdO1xuXG4gICAgLy8gaXNvIHRpbWUgZm9ybWF0cyBhbmQgcmVnZXhlc1xuICAgIHZhciBpc29UaW1lcyA9IFtcbiAgICAgICAgWydISDptbTpzcy5TU1NTJywgLyhUfCApXFxkXFxkOlxcZFxcZDpcXGRcXGRcXC5cXGQrL10sXG4gICAgICAgIFsnSEg6bW06c3MnLCAvKFR8IClcXGRcXGQ6XFxkXFxkOlxcZFxcZC9dLFxuICAgICAgICBbJ0hIOm1tJywgLyhUfCApXFxkXFxkOlxcZFxcZC9dLFxuICAgICAgICBbJ0hIJywgLyhUfCApXFxkXFxkL11cbiAgICBdO1xuXG4gICAgdmFyIGFzcE5ldEpzb25SZWdleCA9IC9eXFwvP0RhdGVcXCgoXFwtP1xcZCspL2k7XG5cbiAgICAvLyBkYXRlIGZyb20gaXNvIGZvcm1hdFxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21JU08oY29uZmlnKSB7XG4gICAgICAgIHZhciBpLCBsLFxuICAgICAgICAgICAgc3RyaW5nID0gY29uZmlnLl9pLFxuICAgICAgICAgICAgbWF0Y2ggPSBmcm9tX3N0cmluZ19faXNvUmVnZXguZXhlYyhzdHJpbmcpO1xuXG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgY29uZmlnLl9wZi5pc28gPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IGlzb0RhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpc29EYXRlc1tpXVsxXS5leGVjKHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWF0Y2hbNV0gc2hvdWxkIGJlICdUJyBvciB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9mID0gaXNvRGF0ZXNbaV1bMF0gKyAobWF0Y2hbNl0gfHwgJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IGlzb1RpbWVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpc29UaW1lc1tpXVsxXS5leGVjKHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9mICs9IGlzb1RpbWVzW2ldWzBdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3RyaW5nLm1hdGNoKG1hdGNoT2Zmc2V0KSkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fZiArPSAnWic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSBpc28gZm9ybWF0IG9yIGZhbGxiYWNrXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbVN0cmluZyhjb25maWcpIHtcbiAgICAgICAgdmFyIG1hdGNoZWQgPSBhc3BOZXRKc29uUmVnZXguZXhlYyhjb25maWcuX2kpO1xuXG4gICAgICAgIGlmIChtYXRjaGVkICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSgrbWF0Y2hlZFsxXSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWdGcm9tSVNPKGNvbmZpZyk7XG4gICAgICAgIGlmIChjb25maWcuX2lzVmFsaWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBkZWxldGUgY29uZmlnLl9pc1ZhbGlkO1xuICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrKGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1dGlsc19ob29rc19faG9va3MuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2sgPSBkZXByZWNhdGUoXG4gICAgICAgICdtb21lbnQgY29uc3RydWN0aW9uIGZhbGxzIGJhY2sgdG8ganMgRGF0ZS4gVGhpcyBpcyAnICtcbiAgICAgICAgJ2Rpc2NvdXJhZ2VkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdXBjb21pbmcgbWFqb3IgJyArXG4gICAgICAgICdyZWxlYXNlLiBQbGVhc2UgcmVmZXIgdG8gJyArXG4gICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTQwNyBmb3IgbW9yZSBpbmZvLicsXG4gICAgICAgIGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGNvbmZpZy5faSArIChjb25maWcuX3VzZVVUQyA/ICcgVVRDJyA6ICcnKSk7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlRGF0ZSAoeSwgbSwgZCwgaCwgTSwgcywgbXMpIHtcbiAgICAgICAgLy9jYW4ndCBqdXN0IGFwcGx5KCkgdG8gY3JlYXRlIGEgZGF0ZTpcbiAgICAgICAgLy9odHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE4MTM0OC9pbnN0YW50aWF0aW5nLWEtamF2YXNjcmlwdC1vYmplY3QtYnktY2FsbGluZy1wcm90b3R5cGUtY29uc3RydWN0b3ItYXBwbHlcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh5LCBtLCBkLCBoLCBNLCBzLCBtcyk7XG5cbiAgICAgICAgLy90aGUgZGF0ZSBjb25zdHJ1Y3RvciBkb2Vzbid0IGFjY2VwdCB5ZWFycyA8IDE5NzBcbiAgICAgICAgaWYgKHkgPCAxOTcwKSB7XG4gICAgICAgICAgICBkYXRlLnNldEZ1bGxZZWFyKHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVVUQ0RhdGUgKHkpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQy5hcHBseShudWxsLCBhcmd1bWVudHMpKTtcbiAgICAgICAgaWYgKHkgPCAxOTcwKSB7XG4gICAgICAgICAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVknLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy55ZWFyKCkgJSAxMDA7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZWVknLCAgIDRdLCAgICAgICAwLCAneWVhcicpO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVlZWVknLCAgNV0sICAgICAgIDAsICd5ZWFyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydZWVlZWVknLCA2LCB0cnVlXSwgMCwgJ3llYXInKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygneWVhcicsICd5Jyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdZJywgICAgICBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignWVknLCAgICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZWVknLCAgIG1hdGNoMXRvNCwgbWF0Y2g0KTtcbiAgICBhZGRSZWdleFRva2VuKCdZWVlZWScsICBtYXRjaDF0bzYsIG1hdGNoNik7XG4gICAgYWRkUmVnZXhUb2tlbignWVlZWVlZJywgbWF0Y2gxdG82LCBtYXRjaDYpO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ1lZWVknLCAnWVlZWVknLCAnWVlZWVlZJ10sIFlFQVIpO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1lZJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtZRUFSXSA9IHV0aWxzX2hvb2tzX19ob29rcy5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICBmdW5jdGlvbiBkYXlzSW5ZZWFyKHllYXIpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVhcFllYXIoeWVhcikgPyAzNjYgOiAzNjU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNMZWFwWWVhcih5ZWFyKSB7XG4gICAgICAgIHJldHVybiAoeWVhciAlIDQgPT09IDAgJiYgeWVhciAlIDEwMCAhPT0gMCkgfHwgeWVhciAlIDQwMCA9PT0gMDtcbiAgICB9XG5cbiAgICAvLyBIT09LU1xuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnBhcnNlVHdvRGlnaXRZZWFyID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0b0ludChpbnB1dCkgKyAodG9JbnQoaW5wdXQpID4gNjggPyAxOTAwIDogMjAwMCk7XG4gICAgfTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRZZWFyID0gbWFrZUdldFNldCgnRnVsbFllYXInLCBmYWxzZSk7XG5cbiAgICBmdW5jdGlvbiBnZXRJc0xlYXBZZWFyICgpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVhcFllYXIodGhpcy55ZWFyKCkpO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKCd3JywgWyd3dycsIDJdLCAnd28nLCAnd2VlaycpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdXJywgWydXVycsIDJdLCAnV28nLCAnaXNvV2VlaycpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCd3ZWVrJywgJ3cnKTtcbiAgICBhZGRVbml0QWxpYXMoJ2lzb1dlZWsnLCAnVycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbigndycsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ3d3JywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1cnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdXVycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsndycsICd3dycsICdXJywgJ1dXJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuLnN1YnN0cigwLCAxKV0gPSB0b0ludChpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICAvLyBmaXJzdERheU9mV2VlayAgICAgICAwID0gc3VuLCA2ID0gc2F0XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgdGhlIGRheSBvZiB0aGUgd2VlayB0aGF0IHN0YXJ0cyB0aGUgd2Vla1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICh1c3VhbGx5IHN1bmRheSBvciBtb25kYXkpXG4gICAgLy8gZmlyc3REYXlPZldlZWtPZlllYXIgMCA9IHN1biwgNiA9IHNhdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIHRoZSBmaXJzdCB3ZWVrIGlzIHRoZSB3ZWVrIHRoYXQgY29udGFpbnMgdGhlIGZpcnN0XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgb2YgdGhpcyBkYXkgb2YgdGhlIHdlZWtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAoZWcuIElTTyB3ZWVrcyB1c2UgdGh1cnNkYXkgKDQpKVxuICAgIGZ1bmN0aW9uIHdlZWtPZlllYXIobW9tLCBmaXJzdERheU9mV2VlaywgZmlyc3REYXlPZldlZWtPZlllYXIpIHtcbiAgICAgICAgdmFyIGVuZCA9IGZpcnN0RGF5T2ZXZWVrT2ZZZWFyIC0gZmlyc3REYXlPZldlZWssXG4gICAgICAgICAgICBkYXlzVG9EYXlPZldlZWsgPSBmaXJzdERheU9mV2Vla09mWWVhciAtIG1vbS5kYXkoKSxcbiAgICAgICAgICAgIGFkanVzdGVkTW9tZW50O1xuXG5cbiAgICAgICAgaWYgKGRheXNUb0RheU9mV2VlayA+IGVuZCkge1xuICAgICAgICAgICAgZGF5c1RvRGF5T2ZXZWVrIC09IDc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF5c1RvRGF5T2ZXZWVrIDwgZW5kIC0gNykge1xuICAgICAgICAgICAgZGF5c1RvRGF5T2ZXZWVrICs9IDc7XG4gICAgICAgIH1cblxuICAgICAgICBhZGp1c3RlZE1vbWVudCA9IGxvY2FsX19jcmVhdGVMb2NhbChtb20pLmFkZChkYXlzVG9EYXlPZldlZWssICdkJyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3ZWVrOiBNYXRoLmNlaWwoYWRqdXN0ZWRNb21lbnQuZGF5T2ZZZWFyKCkgLyA3KSxcbiAgICAgICAgICAgIHllYXI6IGFkanVzdGVkTW9tZW50LnllYXIoKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIExPQ0FMRVNcblxuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWsgKG1vbSkge1xuICAgICAgICByZXR1cm4gd2Vla09mWWVhcihtb20sIHRoaXMuX3dlZWsuZG93LCB0aGlzLl93ZWVrLmRveSkud2VlaztcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWsgPSB7XG4gICAgICAgIGRvdyA6IDAsIC8vIFN1bmRheSBpcyB0aGUgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrLlxuICAgICAgICBkb3kgOiA2ICAvLyBUaGUgd2VlayB0aGF0IGNvbnRhaW5zIEphbiAxc3QgaXMgdGhlIGZpcnN0IHdlZWsgb2YgdGhlIHllYXIuXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxvY2FsZUZpcnN0RGF5T2ZXZWVrICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWsuZG93O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZUZpcnN0RGF5T2ZZZWFyICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWsuZG95O1xuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldFdlZWsgKGlucHV0KSB7XG4gICAgICAgIHZhciB3ZWVrID0gdGhpcy5sb2NhbGVEYXRhKCkud2Vlayh0aGlzKTtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrIDogdGhpcy5hZGQoKGlucHV0IC0gd2VlaykgKiA3LCAnZCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldElTT1dlZWsgKGlucHV0KSB7XG4gICAgICAgIHZhciB3ZWVrID0gd2Vla09mWWVhcih0aGlzLCAxLCA0KS53ZWVrO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWsgOiB0aGlzLmFkZCgoaW5wdXQgLSB3ZWVrKSAqIDcsICdkJyk7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0RERCcsIFsnRERERCcsIDNdLCAnREREbycsICdkYXlPZlllYXInKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnZGF5T2ZZZWFyJywgJ0RERCcpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignREREJywgIG1hdGNoMXRvMyk7XG4gICAgYWRkUmVnZXhUb2tlbignRERERCcsIG1hdGNoMyk7XG4gICAgYWRkUGFyc2VUb2tlbihbJ0RERCcsICdEREREJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2RheU9mWWVhciA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIC8vaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JU09fd2Vla19kYXRlI0NhbGN1bGF0aW5nX2FfZGF0ZV9naXZlbl90aGVfeWVhci4yQ193ZWVrX251bWJlcl9hbmRfd2Vla2RheVxuICAgIGZ1bmN0aW9uIGRheU9mWWVhckZyb21XZWVrcyh5ZWFyLCB3ZWVrLCB3ZWVrZGF5LCBmaXJzdERheU9mV2Vla09mWWVhciwgZmlyc3REYXlPZldlZWspIHtcbiAgICAgICAgdmFyIGQgPSBjcmVhdGVVVENEYXRlKHllYXIsIDAsIDEpLmdldFVUQ0RheSgpO1xuICAgICAgICB2YXIgZGF5c1RvQWRkO1xuICAgICAgICB2YXIgZGF5T2ZZZWFyO1xuXG4gICAgICAgIGQgPSBkID09PSAwID8gNyA6IGQ7XG4gICAgICAgIHdlZWtkYXkgPSB3ZWVrZGF5ICE9IG51bGwgPyB3ZWVrZGF5IDogZmlyc3REYXlPZldlZWs7XG4gICAgICAgIGRheXNUb0FkZCA9IGZpcnN0RGF5T2ZXZWVrIC0gZCArIChkID4gZmlyc3REYXlPZldlZWtPZlllYXIgPyA3IDogMCkgLSAoZCA8IGZpcnN0RGF5T2ZXZWVrID8gNyA6IDApO1xuICAgICAgICBkYXlPZlllYXIgPSA3ICogKHdlZWsgLSAxKSArICh3ZWVrZGF5IC0gZmlyc3REYXlPZldlZWspICsgZGF5c1RvQWRkICsgMTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeWVhciAgICAgIDogZGF5T2ZZZWFyID4gMCA/IHllYXIgICAgICA6IHllYXIgLSAxLFxuICAgICAgICAgICAgZGF5T2ZZZWFyIDogZGF5T2ZZZWFyID4gMCA/IGRheU9mWWVhciA6IGRheXNJblllYXIoeWVhciAtIDEpICsgZGF5T2ZZZWFyXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0RGF5T2ZZZWFyIChpbnB1dCkge1xuICAgICAgICB2YXIgZGF5T2ZZZWFyID0gTWF0aC5yb3VuZCgodGhpcy5jbG9uZSgpLnN0YXJ0T2YoJ2RheScpIC0gdGhpcy5jbG9uZSgpLnN0YXJ0T2YoJ3llYXInKSkgLyA4NjRlNSkgKyAxO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IGRheU9mWWVhciA6IHRoaXMuYWRkKChpbnB1dCAtIGRheU9mWWVhciksICdkJyk7XG4gICAgfVxuXG4gICAgLy8gUGljayB0aGUgZmlyc3QgZGVmaW5lZCBvZiB0d28gb3IgdGhyZWUgYXJndW1lbnRzLlxuICAgIGZ1bmN0aW9uIGRlZmF1bHRzKGEsIGIsIGMpIHtcbiAgICAgICAgaWYgKGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGIgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3VycmVudERhdGVBcnJheShjb25maWcpIHtcbiAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGlmIChjb25maWcuX3VzZVVUQykge1xuICAgICAgICAgICAgcmV0dXJuIFtub3cuZ2V0VVRDRnVsbFllYXIoKSwgbm93LmdldFVUQ01vbnRoKCksIG5vdy5nZXRVVENEYXRlKCldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbbm93LmdldEZ1bGxZZWFyKCksIG5vdy5nZXRNb250aCgpLCBub3cuZ2V0RGF0ZSgpXTtcbiAgICB9XG5cbiAgICAvLyBjb252ZXJ0IGFuIGFycmF5IHRvIGEgZGF0ZS5cbiAgICAvLyB0aGUgYXJyYXkgc2hvdWxkIG1pcnJvciB0aGUgcGFyYW1ldGVycyBiZWxvd1xuICAgIC8vIG5vdGU6IGFsbCB2YWx1ZXMgcGFzdCB0aGUgeWVhciBhcmUgb3B0aW9uYWwgYW5kIHdpbGwgZGVmYXVsdCB0byB0aGUgbG93ZXN0IHBvc3NpYmxlIHZhbHVlLlxuICAgIC8vIFt5ZWFyLCBtb250aCwgZGF5ICwgaG91ciwgbWludXRlLCBzZWNvbmQsIG1pbGxpc2Vjb25kXVxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21BcnJheSAoY29uZmlnKSB7XG4gICAgICAgIHZhciBpLCBkYXRlLCBpbnB1dCA9IFtdLCBjdXJyZW50RGF0ZSwgeWVhclRvVXNlO1xuXG4gICAgICAgIGlmIChjb25maWcuX2QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnREYXRlID0gY3VycmVudERhdGVBcnJheShjb25maWcpO1xuXG4gICAgICAgIC8vY29tcHV0ZSBkYXkgb2YgdGhlIHllYXIgZnJvbSB3ZWVrcyBhbmQgd2Vla2RheXNcbiAgICAgICAgaWYgKGNvbmZpZy5fdyAmJiBjb25maWcuX2FbREFURV0gPT0gbnVsbCAmJiBjb25maWcuX2FbTU9OVEhdID09IG51bGwpIHtcbiAgICAgICAgICAgIGRheU9mWWVhckZyb21XZWVrSW5mbyhjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9pZiB0aGUgZGF5IG9mIHRoZSB5ZWFyIGlzIHNldCwgZmlndXJlIG91dCB3aGF0IGl0IGlzXG4gICAgICAgIGlmIChjb25maWcuX2RheU9mWWVhcikge1xuICAgICAgICAgICAgeWVhclRvVXNlID0gZGVmYXVsdHMoY29uZmlnLl9hW1lFQVJdLCBjdXJyZW50RGF0ZVtZRUFSXSk7XG5cbiAgICAgICAgICAgIGlmIChjb25maWcuX2RheU9mWWVhciA+IGRheXNJblllYXIoeWVhclRvVXNlKSkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fcGYuX292ZXJmbG93RGF5T2ZZZWFyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGF0ZSA9IGNyZWF0ZVVUQ0RhdGUoeWVhclRvVXNlLCAwLCBjb25maWcuX2RheU9mWWVhcik7XG4gICAgICAgICAgICBjb25maWcuX2FbTU9OVEhdID0gZGF0ZS5nZXRVVENNb250aCgpO1xuICAgICAgICAgICAgY29uZmlnLl9hW0RBVEVdID0gZGF0ZS5nZXRVVENEYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZWZhdWx0IHRvIGN1cnJlbnQgZGF0ZS5cbiAgICAgICAgLy8gKiBpZiBubyB5ZWFyLCBtb250aCwgZGF5IG9mIG1vbnRoIGFyZSBnaXZlbiwgZGVmYXVsdCB0byB0b2RheVxuICAgICAgICAvLyAqIGlmIGRheSBvZiBtb250aCBpcyBnaXZlbiwgZGVmYXVsdCBtb250aCBhbmQgeWVhclxuICAgICAgICAvLyAqIGlmIG1vbnRoIGlzIGdpdmVuLCBkZWZhdWx0IG9ubHkgeWVhclxuICAgICAgICAvLyAqIGlmIHllYXIgaXMgZ2l2ZW4sIGRvbid0IGRlZmF1bHQgYW55dGhpbmdcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDMgJiYgY29uZmlnLl9hW2ldID09IG51bGw7ICsraSkge1xuICAgICAgICAgICAgY29uZmlnLl9hW2ldID0gaW5wdXRbaV0gPSBjdXJyZW50RGF0ZVtpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFplcm8gb3V0IHdoYXRldmVyIHdhcyBub3QgZGVmYXVsdGVkLCBpbmNsdWRpbmcgdGltZVxuICAgICAgICBmb3IgKDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgY29uZmlnLl9hW2ldID0gaW5wdXRbaV0gPSAoY29uZmlnLl9hW2ldID09IG51bGwpID8gKGkgPT09IDIgPyAxIDogMCkgOiBjb25maWcuX2FbaV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBmb3IgMjQ6MDA6MDAuMDAwXG4gICAgICAgIGlmIChjb25maWcuX2FbSE9VUl0gPT09IDI0ICYmXG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW01JTlVURV0gPT09IDAgJiZcbiAgICAgICAgICAgICAgICBjb25maWcuX2FbU0VDT05EXSA9PT0gMCAmJlxuICAgICAgICAgICAgICAgIGNvbmZpZy5fYVtNSUxMSVNFQ09ORF0gPT09IDApIHtcbiAgICAgICAgICAgIGNvbmZpZy5fbmV4dERheSA9IHRydWU7XG4gICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnLl9kID0gKGNvbmZpZy5fdXNlVVRDID8gY3JlYXRlVVRDRGF0ZSA6IGNyZWF0ZURhdGUpLmFwcGx5KG51bGwsIGlucHV0KTtcbiAgICAgICAgLy8gQXBwbHkgdGltZXpvbmUgb2Zmc2V0IGZyb20gaW5wdXQuIFRoZSBhY3R1YWwgdXRjT2Zmc2V0IGNhbiBiZSBjaGFuZ2VkXG4gICAgICAgIC8vIHdpdGggcGFyc2Vab25lLlxuICAgICAgICBpZiAoY29uZmlnLl90em0gIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uZmlnLl9kLnNldFVUQ01pbnV0ZXMoY29uZmlnLl9kLmdldFVUQ01pbnV0ZXMoKSAtIGNvbmZpZy5fdHptKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWcuX25leHREYXkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IDI0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGF5T2ZZZWFyRnJvbVdlZWtJbmZvKGNvbmZpZykge1xuICAgICAgICB2YXIgdywgd2Vla1llYXIsIHdlZWssIHdlZWtkYXksIGRvdywgZG95LCB0ZW1wO1xuXG4gICAgICAgIHcgPSBjb25maWcuX3c7XG4gICAgICAgIGlmICh3LkdHICE9IG51bGwgfHwgdy5XICE9IG51bGwgfHwgdy5FICE9IG51bGwpIHtcbiAgICAgICAgICAgIGRvdyA9IDE7XG4gICAgICAgICAgICBkb3kgPSA0O1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBXZSBuZWVkIHRvIHRha2UgdGhlIGN1cnJlbnQgaXNvV2Vla1llYXIsIGJ1dCB0aGF0IGRlcGVuZHMgb25cbiAgICAgICAgICAgIC8vIGhvdyB3ZSBpbnRlcnByZXQgbm93IChsb2NhbCwgdXRjLCBmaXhlZCBvZmZzZXQpLiBTbyBjcmVhdGVcbiAgICAgICAgICAgIC8vIGEgbm93IHZlcnNpb24gb2YgY3VycmVudCBjb25maWcgKHRha2UgbG9jYWwvdXRjL29mZnNldCBmbGFncywgYW5kXG4gICAgICAgICAgICAvLyBjcmVhdGUgbm93KS5cbiAgICAgICAgICAgIHdlZWtZZWFyID0gZGVmYXVsdHMody5HRywgY29uZmlnLl9hW1lFQVJdLCB3ZWVrT2ZZZWFyKGxvY2FsX19jcmVhdGVMb2NhbCgpLCAxLCA0KS55ZWFyKTtcbiAgICAgICAgICAgIHdlZWsgPSBkZWZhdWx0cyh3LlcsIDEpO1xuICAgICAgICAgICAgd2Vla2RheSA9IGRlZmF1bHRzKHcuRSwgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb3cgPSBjb25maWcuX2xvY2FsZS5fd2Vlay5kb3c7XG4gICAgICAgICAgICBkb3kgPSBjb25maWcuX2xvY2FsZS5fd2Vlay5kb3k7XG5cbiAgICAgICAgICAgIHdlZWtZZWFyID0gZGVmYXVsdHMody5nZywgY29uZmlnLl9hW1lFQVJdLCB3ZWVrT2ZZZWFyKGxvY2FsX19jcmVhdGVMb2NhbCgpLCBkb3csIGRveSkueWVhcik7XG4gICAgICAgICAgICB3ZWVrID0gZGVmYXVsdHMody53LCAxKTtcblxuICAgICAgICAgICAgaWYgKHcuZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gd2Vla2RheSAtLSBsb3cgZGF5IG51bWJlcnMgYXJlIGNvbnNpZGVyZWQgbmV4dCB3ZWVrXG4gICAgICAgICAgICAgICAgd2Vla2RheSA9IHcuZDtcbiAgICAgICAgICAgICAgICBpZiAod2Vla2RheSA8IGRvdykge1xuICAgICAgICAgICAgICAgICAgICArK3dlZWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh3LmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIGxvY2FsIHdlZWtkYXkgLS0gY291bnRpbmcgc3RhcnRzIGZyb20gYmVnaW5pbmcgb2Ygd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSB3LmUgKyBkb3c7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgdG8gYmVnaW5pbmcgb2Ygd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSBkb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGVtcCA9IGRheU9mWWVhckZyb21XZWVrcyh3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG95LCBkb3cpO1xuXG4gICAgICAgIGNvbmZpZy5fYVtZRUFSXSA9IHRlbXAueWVhcjtcbiAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPSB0ZW1wLmRheU9mWWVhcjtcbiAgICB9XG5cbiAgICB1dGlsc19ob29rc19faG9va3MuSVNPXzg2MDEgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIC8vIGRhdGUgZnJvbSBzdHJpbmcgYW5kIGZvcm1hdCBzdHJpbmdcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZykge1xuICAgICAgICAvLyBUT0RPOiBNb3ZlIHRoaXMgdG8gYW5vdGhlciBwYXJ0IG9mIHRoZSBjcmVhdGlvbiBmbG93IHRvIHByZXZlbnQgY2lyY3VsYXIgZGVwc1xuICAgICAgICBpZiAoY29uZmlnLl9mID09PSB1dGlsc19ob29rc19faG9va3MuSVNPXzg2MDEpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21JU08oY29uZmlnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZy5fYSA9IFtdO1xuICAgICAgICBjb25maWcuX3BmLmVtcHR5ID0gdHJ1ZTtcblxuICAgICAgICAvLyBUaGlzIGFycmF5IGlzIHVzZWQgdG8gbWFrZSBhIERhdGUsIGVpdGhlciB3aXRoIGBuZXcgRGF0ZWAgb3IgYERhdGUuVVRDYFxuICAgICAgICB2YXIgc3RyaW5nID0gJycgKyBjb25maWcuX2ksXG4gICAgICAgICAgICBpLCBwYXJzZWRJbnB1dCwgdG9rZW5zLCB0b2tlbiwgc2tpcHBlZCxcbiAgICAgICAgICAgIHN0cmluZ0xlbmd0aCA9IHN0cmluZy5sZW5ndGgsXG4gICAgICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoID0gMDtcblxuICAgICAgICB0b2tlbnMgPSBleHBhbmRGb3JtYXQoY29uZmlnLl9mLCBjb25maWcuX2xvY2FsZSkubWF0Y2goZm9ybWF0dGluZ1Rva2VucykgfHwgW107XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgICAgICBwYXJzZWRJbnB1dCA9IChzdHJpbmcubWF0Y2goZ2V0UGFyc2VSZWdleEZvclRva2VuKHRva2VuLCBjb25maWcpKSB8fCBbXSlbMF07XG4gICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBza2lwcGVkID0gc3RyaW5nLnN1YnN0cigwLCBzdHJpbmcuaW5kZXhPZihwYXJzZWRJbnB1dCkpO1xuICAgICAgICAgICAgICAgIGlmIChza2lwcGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9wZi51bnVzZWRJbnB1dC5wdXNoKHNraXBwZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc2xpY2Uoc3RyaW5nLmluZGV4T2YocGFyc2VkSW5wdXQpICsgcGFyc2VkSW5wdXQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoICs9IHBhcnNlZElucHV0Lmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGRvbid0IHBhcnNlIGlmIGl0J3Mgbm90IGEga25vd24gdG9rZW5cbiAgICAgICAgICAgIGlmIChmb3JtYXRUb2tlbkZ1bmN0aW9uc1t0b2tlbl0pIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9wZi5lbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9wZi51bnVzZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBwYXJzZWRJbnB1dCwgY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbmZpZy5fc3RyaWN0ICYmICFwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fcGYudW51c2VkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIHJlbWFpbmluZyB1bnBhcnNlZCBpbnB1dCBsZW5ndGggdG8gdGhlIHN0cmluZ1xuICAgICAgICBjb25maWcuX3BmLmNoYXJzTGVmdE92ZXIgPSBzdHJpbmdMZW5ndGggLSB0b3RhbFBhcnNlZElucHV0TGVuZ3RoO1xuICAgICAgICBpZiAoc3RyaW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbmZpZy5fcGYudW51c2VkSW5wdXQucHVzaChzdHJpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2xlYXIgXzEyaCBmbGFnIGlmIGhvdXIgaXMgPD0gMTJcbiAgICAgICAgaWYgKGNvbmZpZy5fcGYuYmlnSG91ciA9PT0gdHJ1ZSAmJiBjb25maWcuX2FbSE9VUl0gPD0gMTIpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fcGYuYmlnSG91ciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICAvLyBoYW5kbGUgbWVyaWRpZW1cbiAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gbWVyaWRpZW1GaXhXcmFwKGNvbmZpZy5fbG9jYWxlLCBjb25maWcuX2FbSE9VUl0sIGNvbmZpZy5fbWVyaWRpZW0pO1xuXG4gICAgICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgICAgICBjaGVja092ZXJmbG93KGNvbmZpZyk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBtZXJpZGllbUZpeFdyYXAgKGxvY2FsZSwgaG91ciwgbWVyaWRpZW0pIHtcbiAgICAgICAgdmFyIGlzUG07XG5cbiAgICAgICAgaWYgKG1lcmlkaWVtID09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIG5vdGhpbmcgdG8gZG9cbiAgICAgICAgICAgIHJldHVybiBob3VyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2NhbGUubWVyaWRpZW1Ib3VyICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGUubWVyaWRpZW1Ib3VyKGhvdXIsIG1lcmlkaWVtKTtcbiAgICAgICAgfSBlbHNlIGlmIChsb2NhbGUuaXNQTSAhPSBudWxsKSB7XG4gICAgICAgICAgICAvLyBGYWxsYmFja1xuICAgICAgICAgICAgaXNQbSA9IGxvY2FsZS5pc1BNKG1lcmlkaWVtKTtcbiAgICAgICAgICAgIGlmIChpc1BtICYmIGhvdXIgPCAxMikge1xuICAgICAgICAgICAgICAgIGhvdXIgKz0gMTI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzUG0gJiYgaG91ciA9PT0gMTIpIHtcbiAgICAgICAgICAgICAgICBob3VyID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBob3VyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGhpcyBpcyBub3Qgc3VwcG9zZWQgdG8gaGFwcGVuXG4gICAgICAgICAgICByZXR1cm4gaG91cjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21TdHJpbmdBbmRBcnJheShjb25maWcpIHtcbiAgICAgICAgdmFyIHRlbXBDb25maWcsXG4gICAgICAgICAgICBiZXN0TW9tZW50LFxuXG4gICAgICAgICAgICBzY29yZVRvQmVhdCxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBjdXJyZW50U2NvcmU7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fZi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbmZpZy5fcGYuaW52YWxpZEZvcm1hdCA9IHRydWU7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShOYU4pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvbmZpZy5fZi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY3VycmVudFNjb3JlID0gMDtcbiAgICAgICAgICAgIHRlbXBDb25maWcgPSBjb3B5Q29uZmlnKHt9LCBjb25maWcpO1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5fdXNlVVRDICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0ZW1wQ29uZmlnLl91c2VVVEMgPSBjb25maWcuX3VzZVVUQztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbXBDb25maWcuX3BmID0gZGVmYXVsdFBhcnNpbmdGbGFncygpO1xuICAgICAgICAgICAgdGVtcENvbmZpZy5fZiA9IGNvbmZpZy5fZltpXTtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQodGVtcENvbmZpZyk7XG5cbiAgICAgICAgICAgIGlmICghdmFsaWRfX2lzVmFsaWQodGVtcENvbmZpZykpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYW55IGlucHV0IHRoYXQgd2FzIG5vdCBwYXJzZWQgYWRkIGEgcGVuYWx0eSBmb3IgdGhhdCBmb3JtYXRcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSArPSB0ZW1wQ29uZmlnLl9wZi5jaGFyc0xlZnRPdmVyO1xuXG4gICAgICAgICAgICAvL29yIHRva2Vuc1xuICAgICAgICAgICAgY3VycmVudFNjb3JlICs9IHRlbXBDb25maWcuX3BmLnVudXNlZFRva2Vucy5sZW5ndGggKiAxMDtcblxuICAgICAgICAgICAgdGVtcENvbmZpZy5fcGYuc2NvcmUgPSBjdXJyZW50U2NvcmU7XG5cbiAgICAgICAgICAgIGlmIChzY29yZVRvQmVhdCA9PSBudWxsIHx8IGN1cnJlbnRTY29yZSA8IHNjb3JlVG9CZWF0KSB7XG4gICAgICAgICAgICAgICAgc2NvcmVUb0JlYXQgPSBjdXJyZW50U2NvcmU7XG4gICAgICAgICAgICAgICAgYmVzdE1vbWVudCA9IHRlbXBDb25maWc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHRlbmQoY29uZmlnLCBiZXN0TW9tZW50IHx8IHRlbXBDb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21PYmplY3QoY29uZmlnKSB7XG4gICAgICAgIGlmIChjb25maWcuX2QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpID0gbm9ybWFsaXplT2JqZWN0VW5pdHMoY29uZmlnLl9pKTtcbiAgICAgICAgY29uZmlnLl9hID0gW2kueWVhciwgaS5tb250aCwgaS5kYXkgfHwgaS5kYXRlLCBpLmhvdXIsIGkubWludXRlLCBpLnNlY29uZCwgaS5taWxsaXNlY29uZF07XG5cbiAgICAgICAgY29uZmlnRnJvbUFycmF5KGNvbmZpZyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlRnJvbUNvbmZpZyAoY29uZmlnKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IGNvbmZpZy5faSxcbiAgICAgICAgICAgIGZvcm1hdCA9IGNvbmZpZy5fZixcbiAgICAgICAgICAgIHJlcztcblxuICAgICAgICBjb25maWcuX2xvY2FsZSA9IGNvbmZpZy5fbG9jYWxlIHx8IGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUoY29uZmlnLl9sKTtcblxuICAgICAgICBpZiAoaW5wdXQgPT09IG51bGwgfHwgKGZvcm1hdCA9PT0gdW5kZWZpbmVkICYmIGlucHV0ID09PSAnJykpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWxpZF9fY3JlYXRlSW52YWxpZCh7bnVsbElucHV0OiB0cnVlfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uZmlnLl9pID0gaW5wdXQgPSBjb25maWcuX2xvY2FsZS5wcmVwYXJzZShpbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNNb21lbnQoaW5wdXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1vbWVudChjaGVja092ZXJmbG93KGlucHV0KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShmb3JtYXQpKSB7XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kQXJyYXkoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21JbnB1dChjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzID0gbmV3IE1vbWVudChjaGVja092ZXJmbG93KGNvbmZpZykpO1xuICAgICAgICBpZiAocmVzLl9uZXh0RGF5KSB7XG4gICAgICAgICAgICAvLyBBZGRpbmcgaXMgc21hcnQgZW5vdWdoIGFyb3VuZCBEU1RcbiAgICAgICAgICAgIHJlcy5hZGQoMSwgJ2QnKTtcbiAgICAgICAgICAgIHJlcy5fbmV4dERheSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbUlucHV0KGNvbmZpZykge1xuICAgICAgICB2YXIgaW5wdXQgPSBjb25maWcuX2k7XG4gICAgICAgIGlmIChpbnB1dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzRGF0ZShpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCtpbnB1dCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZyhjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2EgPSBtYXAoaW5wdXQuc2xpY2UoMCksIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQob2JqLCAxMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZihpbnB1dCkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjb25maWdGcm9tT2JqZWN0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mKGlucHV0KSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIC8vIGZyb20gbWlsbGlzZWNvbmRzXG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShpbnB1dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2soY29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUxvY2FsT3JVVEMgKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCBpc1VUQykge1xuICAgICAgICB2YXIgYyA9IHt9O1xuXG4gICAgICAgIGlmICh0eXBlb2YobG9jYWxlKSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBzdHJpY3QgPSBsb2NhbGU7XG4gICAgICAgICAgICBsb2NhbGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gb2JqZWN0IGNvbnN0cnVjdGlvbiBtdXN0IGJlIGRvbmUgdGhpcyB3YXkuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNDIzXG4gICAgICAgIGMuX2lzQU1vbWVudE9iamVjdCA9IHRydWU7XG4gICAgICAgIGMuX3VzZVVUQyA9IGMuX2lzVVRDID0gaXNVVEM7XG4gICAgICAgIGMuX2wgPSBsb2NhbGU7XG4gICAgICAgIGMuX2kgPSBpbnB1dDtcbiAgICAgICAgYy5fZiA9IGZvcm1hdDtcbiAgICAgICAgYy5fc3RyaWN0ID0gc3RyaWN0O1xuICAgICAgICBjLl9wZiA9IGRlZmF1bHRQYXJzaW5nRmxhZ3MoKTtcblxuICAgICAgICByZXR1cm4gY3JlYXRlRnJvbUNvbmZpZyhjKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbF9fY3JlYXRlTG9jYWwgKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0KSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVMb2NhbE9yVVRDKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCBmYWxzZSk7XG4gICAgfVxuXG4gICAgdmFyIHByb3RvdHlwZU1pbiA9IGRlcHJlY2F0ZShcbiAgICAgICAgICdtb21lbnQoKS5taW4gaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudC5taW4gaW5zdGVhZC4gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE1NDgnLFxuICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgIHZhciBvdGhlciA9IGxvY2FsX19jcmVhdGVMb2NhbC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgIHJldHVybiBvdGhlciA8IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgICAgICB9XG4gICAgICk7XG5cbiAgICB2YXIgcHJvdG90eXBlTWF4ID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50KCkubWF4IGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQubWF4IGluc3RlYWQuIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNTQ4JyxcbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG90aGVyID0gbG9jYWxfX2NyZWF0ZUxvY2FsLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICByZXR1cm4gb3RoZXIgPiB0aGlzID8gdGhpcyA6IG90aGVyO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIC8vIFBpY2sgYSBtb21lbnQgbSBmcm9tIG1vbWVudHMgc28gdGhhdCBtW2ZuXShvdGhlcikgaXMgdHJ1ZSBmb3IgYWxsXG4gICAgLy8gb3RoZXIuIFRoaXMgcmVsaWVzIG9uIHRoZSBmdW5jdGlvbiBmbiB0byBiZSB0cmFuc2l0aXZlLlxuICAgIC8vXG4gICAgLy8gbW9tZW50cyBzaG91bGQgZWl0aGVyIGJlIGFuIGFycmF5IG9mIG1vbWVudCBvYmplY3RzIG9yIGFuIGFycmF5LCB3aG9zZVxuICAgIC8vIGZpcnN0IGVsZW1lbnQgaXMgYW4gYXJyYXkgb2YgbW9tZW50IG9iamVjdHMuXG4gICAgZnVuY3Rpb24gcGlja0J5KGZuLCBtb21lbnRzKSB7XG4gICAgICAgIHZhciByZXMsIGk7XG4gICAgICAgIGlmIChtb21lbnRzLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KG1vbWVudHNbMF0pKSB7XG4gICAgICAgICAgICBtb21lbnRzID0gbW9tZW50c1swXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1vbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxfX2NyZWF0ZUxvY2FsKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzID0gbW9tZW50c1swXTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IG1vbWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChtb21lbnRzW2ldW2ZuXShyZXMpKSB7XG4gICAgICAgICAgICAgICAgcmVzID0gbW9tZW50c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8vIFRPRE86IFVzZSBbXS5zb3J0IGluc3RlYWQ/XG4gICAgZnVuY3Rpb24gbWluICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgcmV0dXJuIHBpY2tCeSgnaXNCZWZvcmUnLCBhcmdzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXggKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0FmdGVyJywgYXJncyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gRHVyYXRpb24gKGR1cmF0aW9uKSB7XG4gICAgICAgIHZhciBub3JtYWxpemVkSW5wdXQgPSBub3JtYWxpemVPYmplY3RVbml0cyhkdXJhdGlvbiksXG4gICAgICAgICAgICB5ZWFycyA9IG5vcm1hbGl6ZWRJbnB1dC55ZWFyIHx8IDAsXG4gICAgICAgICAgICBxdWFydGVycyA9IG5vcm1hbGl6ZWRJbnB1dC5xdWFydGVyIHx8IDAsXG4gICAgICAgICAgICBtb250aHMgPSBub3JtYWxpemVkSW5wdXQubW9udGggfHwgMCxcbiAgICAgICAgICAgIHdlZWtzID0gbm9ybWFsaXplZElucHV0LndlZWsgfHwgMCxcbiAgICAgICAgICAgIGRheXMgPSBub3JtYWxpemVkSW5wdXQuZGF5IHx8IDAsXG4gICAgICAgICAgICBob3VycyA9IG5vcm1hbGl6ZWRJbnB1dC5ob3VyIHx8IDAsXG4gICAgICAgICAgICBtaW51dGVzID0gbm9ybWFsaXplZElucHV0Lm1pbnV0ZSB8fCAwLFxuICAgICAgICAgICAgc2Vjb25kcyA9IG5vcm1hbGl6ZWRJbnB1dC5zZWNvbmQgfHwgMCxcbiAgICAgICAgICAgIG1pbGxpc2Vjb25kcyA9IG5vcm1hbGl6ZWRJbnB1dC5taWxsaXNlY29uZCB8fCAwO1xuXG4gICAgICAgIC8vIHJlcHJlc2VudGF0aW9uIGZvciBkYXRlQWRkUmVtb3ZlXG4gICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyA9ICttaWxsaXNlY29uZHMgK1xuICAgICAgICAgICAgc2Vjb25kcyAqIDFlMyArIC8vIDEwMDBcbiAgICAgICAgICAgIG1pbnV0ZXMgKiA2ZTQgKyAvLyAxMDAwICogNjBcbiAgICAgICAgICAgIGhvdXJzICogMzZlNTsgLy8gMTAwMCAqIDYwICogNjBcbiAgICAgICAgLy8gQmVjYXVzZSBvZiBkYXRlQWRkUmVtb3ZlIHRyZWF0cyAyNCBob3VycyBhcyBkaWZmZXJlbnQgZnJvbSBhXG4gICAgICAgIC8vIGRheSB3aGVuIHdvcmtpbmcgYXJvdW5kIERTVCwgd2UgbmVlZCB0byBzdG9yZSB0aGVtIHNlcGFyYXRlbHlcbiAgICAgICAgdGhpcy5fZGF5cyA9ICtkYXlzICtcbiAgICAgICAgICAgIHdlZWtzICogNztcbiAgICAgICAgLy8gSXQgaXMgaW1wb3NzaWJsZSB0cmFuc2xhdGUgbW9udGhzIGludG8gZGF5cyB3aXRob3V0IGtub3dpbmdcbiAgICAgICAgLy8gd2hpY2ggbW9udGhzIHlvdSBhcmUgYXJlIHRhbGtpbmcgYWJvdXQsIHNvIHdlIGhhdmUgdG8gc3RvcmVcbiAgICAgICAgLy8gaXQgc2VwYXJhdGVseS5cbiAgICAgICAgdGhpcy5fbW9udGhzID0gK21vbnRocyArXG4gICAgICAgICAgICBxdWFydGVycyAqIDMgK1xuICAgICAgICAgICAgeWVhcnMgKiAxMjtcblxuICAgICAgICB0aGlzLl9kYXRhID0ge307XG5cbiAgICAgICAgdGhpcy5fbG9jYWxlID0gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZSgpO1xuXG4gICAgICAgIHRoaXMuX2J1YmJsZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRHVyYXRpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRHVyYXRpb247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb2Zmc2V0ICh0b2tlbiwgc2VwYXJhdG9yKSB7XG4gICAgICAgIGFkZEZvcm1hdFRva2VuKHRva2VuLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy51dGNPZmZzZXQoKTtcbiAgICAgICAgICAgIHZhciBzaWduID0gJysnO1xuICAgICAgICAgICAgaWYgKG9mZnNldCA8IDApIHtcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSAtb2Zmc2V0O1xuICAgICAgICAgICAgICAgIHNpZ24gPSAnLSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2lnbiArIHplcm9GaWxsKH5+KG9mZnNldCAvIDYwKSwgMikgKyBzZXBhcmF0b3IgKyB6ZXJvRmlsbCh+fihvZmZzZXQpICUgNjAsIDIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvZmZzZXQoJ1onLCAnOicpO1xuICAgIG9mZnNldCgnWlonLCAnJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdaJywgIG1hdGNoT2Zmc2V0KTtcbiAgICBhZGRSZWdleFRva2VuKCdaWicsIG1hdGNoT2Zmc2V0KTtcbiAgICBhZGRQYXJzZVRva2VuKFsnWicsICdaWiddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl91c2VVVEMgPSB0cnVlO1xuICAgICAgICBjb25maWcuX3R6bSA9IG9mZnNldEZyb21TdHJpbmcoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgLy8gdGltZXpvbmUgY2h1bmtlclxuICAgIC8vICcrMTA6MDAnID4gWycxMCcsICAnMDAnXVxuICAgIC8vICctMTUzMCcgID4gWyctMTUnLCAnMzAnXVxuICAgIHZhciBjaHVua09mZnNldCA9IC8oW1xcK1xcLV18XFxkXFxkKS9naTtcblxuICAgIGZ1bmN0aW9uIG9mZnNldEZyb21TdHJpbmcoc3RyaW5nKSB7XG4gICAgICAgIHZhciBtYXRjaGVzID0gKChzdHJpbmcgfHwgJycpLm1hdGNoKG1hdGNoT2Zmc2V0KSB8fCBbXSk7XG4gICAgICAgIHZhciBjaHVuayAgID0gbWF0Y2hlc1ttYXRjaGVzLmxlbmd0aCAtIDFdIHx8IFtdO1xuICAgICAgICB2YXIgcGFydHMgICA9IChjaHVuayArICcnKS5tYXRjaChjaHVua09mZnNldCkgfHwgWyctJywgMCwgMF07XG4gICAgICAgIHZhciBtaW51dGVzID0gKyhwYXJ0c1sxXSAqIDYwKSArIHRvSW50KHBhcnRzWzJdKTtcblxuICAgICAgICByZXR1cm4gcGFydHNbMF0gPT09ICcrJyA/IG1pbnV0ZXMgOiAtbWludXRlcztcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBtb21lbnQgZnJvbSBpbnB1dCwgdGhhdCBpcyBsb2NhbC91dGMvem9uZSBlcXVpdmFsZW50IHRvIG1vZGVsLlxuICAgIGZ1bmN0aW9uIGNsb25lV2l0aE9mZnNldChpbnB1dCwgbW9kZWwpIHtcbiAgICAgICAgdmFyIHJlcywgZGlmZjtcbiAgICAgICAgaWYgKG1vZGVsLl9pc1VUQykge1xuICAgICAgICAgICAgcmVzID0gbW9kZWwuY2xvbmUoKTtcbiAgICAgICAgICAgIGRpZmYgPSAoaXNNb21lbnQoaW5wdXQpIHx8IGlzRGF0ZShpbnB1dCkgPyAraW5wdXQgOiArbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KSkgLSAoK3Jlcyk7XG4gICAgICAgICAgICAvLyBVc2UgbG93LWxldmVsIGFwaSwgYmVjYXVzZSB0aGlzIGZuIGlzIGxvdy1sZXZlbCBhcGkuXG4gICAgICAgICAgICByZXMuX2Quc2V0VGltZSgrcmVzLl9kICsgZGlmZik7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KHJlcywgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpLmxvY2FsKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1vZGVsLl9pc1VUQyA/IGxvY2FsX19jcmVhdGVMb2NhbChpbnB1dCkuem9uZShtb2RlbC5fb2Zmc2V0IHx8IDApIDogbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KS5sb2NhbCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERhdGVPZmZzZXQgKG0pIHtcbiAgICAgICAgLy8gT24gRmlyZWZveC4yNCBEYXRlI2dldFRpbWV6b25lT2Zmc2V0IHJldHVybnMgYSBmbG9hdGluZyBwb2ludC5cbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvcHVsbC8xODcxXG4gICAgICAgIHJldHVybiAtTWF0aC5yb3VuZChtLl9kLmdldFRpbWV6b25lT2Zmc2V0KCkgLyAxNSkgKiAxNTtcbiAgICB9XG5cbiAgICAvLyBIT09LU1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuZXZlciBhIG1vbWVudCBpcyBtdXRhdGVkLlxuICAgIC8vIEl0IGlzIGludGVuZGVkIHRvIGtlZXAgdGhlIG9mZnNldCBpbiBzeW5jIHdpdGggdGhlIHRpbWV6b25lLlxuICAgIHV0aWxzX2hvb2tzX19ob29rcy51cGRhdGVPZmZzZXQgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIC8vIGtlZXBMb2NhbFRpbWUgPSB0cnVlIG1lYW5zIG9ubHkgY2hhbmdlIHRoZSB0aW1lem9uZSwgd2l0aG91dFxuICAgIC8vIGFmZmVjdGluZyB0aGUgbG9jYWwgaG91ci4gU28gNTozMToyNiArMDMwMCAtLVt1dGNPZmZzZXQoMiwgdHJ1ZSldLS0+XG4gICAgLy8gNTozMToyNiArMDIwMCBJdCBpcyBwb3NzaWJsZSB0aGF0IDU6MzE6MjYgZG9lc24ndCBleGlzdCB3aXRoIG9mZnNldFxuICAgIC8vICswMjAwLCBzbyB3ZSBhZGp1c3QgdGhlIHRpbWUgYXMgbmVlZGVkLCB0byBiZSB2YWxpZC5cbiAgICAvL1xuICAgIC8vIEtlZXBpbmcgdGhlIHRpbWUgYWN0dWFsbHkgYWRkcy9zdWJ0cmFjdHMgKG9uZSBob3VyKVxuICAgIC8vIGZyb20gdGhlIGFjdHVhbCByZXByZXNlbnRlZCB0aW1lLiBUaGF0IGlzIHdoeSB3ZSBjYWxsIHVwZGF0ZU9mZnNldFxuICAgIC8vIGEgc2Vjb25kIHRpbWUuIEluIGNhc2UgaXQgd2FudHMgdXMgdG8gY2hhbmdlIHRoZSBvZmZzZXQgYWdhaW5cbiAgICAvLyBfY2hhbmdlSW5Qcm9ncmVzcyA9PSB0cnVlIGNhc2UsIHRoZW4gd2UgaGF2ZSB0byBhZGp1c3QsIGJlY2F1c2VcbiAgICAvLyB0aGVyZSBpcyBubyBzdWNoIHRpbWUgaW4gdGhlIGdpdmVuIHRpbWV6b25lLlxuICAgIGZ1bmN0aW9uIGdldFNldE9mZnNldCAoaW5wdXQsIGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuX29mZnNldCB8fCAwLFxuICAgICAgICAgICAgbG9jYWxBZGp1c3Q7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gb2Zmc2V0RnJvbVN0cmluZyhpbnB1dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoaW5wdXQpIDwgMTYpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0ICogNjA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2lzVVRDICYmIGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgICAgICAgICBsb2NhbEFkanVzdCA9IGdldERhdGVPZmZzZXQodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9vZmZzZXQgPSBpbnB1dDtcbiAgICAgICAgICAgIHRoaXMuX2lzVVRDID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChsb2NhbEFkanVzdCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGQobG9jYWxBZGp1c3QsICdtJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob2Zmc2V0ICE9PSBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGlmICgha2VlcExvY2FsVGltZSB8fCB0aGlzLl9jaGFuZ2VJblByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZF9zdWJ0cmFjdF9fYWRkU3VidHJhY3QodGhpcywgY3JlYXRlX19jcmVhdGVEdXJhdGlvbihpbnB1dCAtIG9mZnNldCwgJ20nKSwgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy51cGRhdGVPZmZzZXQodGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gb2Zmc2V0IDogZ2V0RGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldFpvbmUgKGlucHV0LCBrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gLWlucHV0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldChpbnB1dCwga2VlcExvY2FsVGltZSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIC10aGlzLnV0Y09mZnNldCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2Zmc2V0VG9VVEMgKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXRjT2Zmc2V0KDAsIGtlZXBMb2NhbFRpbWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldE9mZnNldFRvTG9jYWwgKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzVVRDKSB7XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldCgwLCBrZWVwTG9jYWxUaW1lKTtcbiAgICAgICAgICAgIHRoaXMuX2lzVVRDID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmIChrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJ0cmFjdChnZXREYXRlT2Zmc2V0KHRoaXMpLCAnbScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldE9mZnNldFRvUGFyc2VkT2Zmc2V0ICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3R6bSkge1xuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQodGhpcy5fdHptKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5faSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KG9mZnNldEZyb21TdHJpbmcodGhpcy5faSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhc0FsaWduZWRIb3VyT2Zmc2V0IChpbnB1dCkge1xuICAgICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgICAgICBpbnB1dCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpbnB1dCA9IGxvY2FsX19jcmVhdGVMb2NhbChpbnB1dCkudXRjT2Zmc2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKHRoaXMudXRjT2Zmc2V0KCkgLSBpbnB1dCkgJSA2MCA9PT0gMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RheWxpZ2h0U2F2aW5nVGltZSAoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldCgpID4gdGhpcy5jbG9uZSgpLm1vbnRoKDApLnV0Y09mZnNldCgpIHx8XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldCgpID4gdGhpcy5jbG9uZSgpLm1vbnRoKDUpLnV0Y09mZnNldCgpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEYXlsaWdodFNhdmluZ1RpbWVTaGlmdGVkICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2EpIHtcbiAgICAgICAgICAgIHZhciBvdGhlciA9IHRoaXMuX2lzVVRDID8gY3JlYXRlX3V0Y19fY3JlYXRlVVRDKHRoaXMuX2EpIDogbG9jYWxfX2NyZWF0ZUxvY2FsKHRoaXMuX2EpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpICYmIGNvbXBhcmVBcnJheXModGhpcy5fYSwgb3RoZXIudG9BcnJheSgpKSA+IDA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNMb2NhbCAoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5faXNVVEM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNVdGNPZmZzZXQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNVVEM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNVdGMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgJiYgdGhpcy5fb2Zmc2V0ID09PSAwO1xuICAgIH1cblxuICAgIHZhciBhc3BOZXRSZWdleCA9IC8oXFwtKT8oPzooXFxkKilcXC4pPyhcXGQrKVxcOihcXGQrKSg/OlxcOihcXGQrKVxcLj8oXFxkezN9KT8pPy87XG5cbiAgICAvLyBmcm9tIGh0dHA6Ly9kb2NzLmNsb3N1cmUtbGlicmFyeS5nb29nbGVjb2RlLmNvbS9naXQvY2xvc3VyZV9nb29nX2RhdGVfZGF0ZS5qcy5zb3VyY2UuaHRtbFxuICAgIC8vIHNvbWV3aGF0IG1vcmUgaW4gbGluZSB3aXRoIDQuNC4zLjIgMjAwNCBzcGVjLCBidXQgYWxsb3dzIGRlY2ltYWwgYW55d2hlcmVcbiAgICB2YXIgY3JlYXRlX19pc29SZWdleCA9IC9eKC0pP1AoPzooPzooWzAtOSwuXSopWSk/KD86KFswLTksLl0qKU0pPyg/OihbMC05LC5dKilEKT8oPzpUKD86KFswLTksLl0qKUgpPyg/OihbMC05LC5dKilNKT8oPzooWzAtOSwuXSopUyk/KT98KFswLTksLl0qKVcpJC87XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uIChpbnB1dCwga2V5KSB7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGlucHV0LFxuICAgICAgICAgICAgLy8gbWF0Y2hpbmcgYWdhaW5zdCByZWdleHAgaXMgZXhwZW5zaXZlLCBkbyBpdCBvbiBkZW1hbmRcbiAgICAgICAgICAgIG1hdGNoID0gbnVsbCxcbiAgICAgICAgICAgIHNpZ24sXG4gICAgICAgICAgICByZXQsXG4gICAgICAgICAgICBkaWZmUmVzO1xuXG4gICAgICAgIGlmIChpc0R1cmF0aW9uKGlucHV0KSkge1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgbXMgOiBpbnB1dC5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgICAgIGQgIDogaW5wdXQuX2RheXMsXG4gICAgICAgICAgICAgICAgTSAgOiBpbnB1dC5fbW9udGhzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge307XG4gICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb25ba2V5XSA9IGlucHV0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbi5taWxsaXNlY29uZHMgPSBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghIShtYXRjaCA9IGFzcE5ldFJlZ2V4LmV4ZWMoaW5wdXQpKSkge1xuICAgICAgICAgICAgc2lnbiA9IChtYXRjaFsxXSA9PT0gJy0nKSA/IC0xIDogMTtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIHkgIDogMCxcbiAgICAgICAgICAgICAgICBkICA6IHRvSW50KG1hdGNoW0RBVEVdKSAgICAgICAgKiBzaWduLFxuICAgICAgICAgICAgICAgIGggIDogdG9JbnQobWF0Y2hbSE9VUl0pICAgICAgICAqIHNpZ24sXG4gICAgICAgICAgICAgICAgbSAgOiB0b0ludChtYXRjaFtNSU5VVEVdKSAgICAgICogc2lnbixcbiAgICAgICAgICAgICAgICBzICA6IHRvSW50KG1hdGNoW1NFQ09ORF0pICAgICAgKiBzaWduLFxuICAgICAgICAgICAgICAgIG1zIDogdG9JbnQobWF0Y2hbTUlMTElTRUNPTkRdKSAqIHNpZ25cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoISEobWF0Y2ggPSBjcmVhdGVfX2lzb1JlZ2V4LmV4ZWMoaW5wdXQpKSkge1xuICAgICAgICAgICAgc2lnbiA9IChtYXRjaFsxXSA9PT0gJy0nKSA/IC0xIDogMTtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIHkgOiBwYXJzZUlzbyhtYXRjaFsyXSwgc2lnbiksXG4gICAgICAgICAgICAgICAgTSA6IHBhcnNlSXNvKG1hdGNoWzNdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBkIDogcGFyc2VJc28obWF0Y2hbNF0sIHNpZ24pLFxuICAgICAgICAgICAgICAgIGggOiBwYXJzZUlzbyhtYXRjaFs1XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgbSA6IHBhcnNlSXNvKG1hdGNoWzZdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBzIDogcGFyc2VJc28obWF0Y2hbN10sIHNpZ24pLFxuICAgICAgICAgICAgICAgIHcgOiBwYXJzZUlzbyhtYXRjaFs4XSwgc2lnbilcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoZHVyYXRpb24gPT0gbnVsbCkgey8vIGNoZWNrcyBmb3IgbnVsbCBvciB1bmRlZmluZWRcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge307XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGR1cmF0aW9uID09PSAnb2JqZWN0JyAmJiAoJ2Zyb20nIGluIGR1cmF0aW9uIHx8ICd0bycgaW4gZHVyYXRpb24pKSB7XG4gICAgICAgICAgICBkaWZmUmVzID0gbW9tZW50c0RpZmZlcmVuY2UobG9jYWxfX2NyZWF0ZUxvY2FsKGR1cmF0aW9uLmZyb20pLCBsb2NhbF9fY3JlYXRlTG9jYWwoZHVyYXRpb24udG8pKTtcblxuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgICAgIGR1cmF0aW9uLm1zID0gZGlmZlJlcy5taWxsaXNlY29uZHM7XG4gICAgICAgICAgICBkdXJhdGlvbi5NID0gZGlmZlJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXQgPSBuZXcgRHVyYXRpb24oZHVyYXRpb24pO1xuXG4gICAgICAgIGlmIChpc0R1cmF0aW9uKGlucHV0KSAmJiBoYXNPd25Qcm9wKGlucHV0LCAnX2xvY2FsZScpKSB7XG4gICAgICAgICAgICByZXQuX2xvY2FsZSA9IGlucHV0Ll9sb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24uZm4gPSBEdXJhdGlvbi5wcm90b3R5cGU7XG5cbiAgICBmdW5jdGlvbiBwYXJzZUlzbyAoaW5wLCBzaWduKSB7XG4gICAgICAgIC8vIFdlJ2Qgbm9ybWFsbHkgdXNlIH5+aW5wIGZvciB0aGlzLCBidXQgdW5mb3J0dW5hdGVseSBpdCBhbHNvXG4gICAgICAgIC8vIGNvbnZlcnRzIGZsb2F0cyB0byBpbnRzLlxuICAgICAgICAvLyBpbnAgbWF5IGJlIHVuZGVmaW5lZCwgc28gY2FyZWZ1bCBjYWxsaW5nIHJlcGxhY2Ugb24gaXQuXG4gICAgICAgIHZhciByZXMgPSBpbnAgJiYgcGFyc2VGbG9hdChpbnAucmVwbGFjZSgnLCcsICcuJykpO1xuICAgICAgICAvLyBhcHBseSBzaWduIHdoaWxlIHdlJ3JlIGF0IGl0XG4gICAgICAgIHJldHVybiAoaXNOYU4ocmVzKSA/IDAgOiByZXMpICogc2lnbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb3NpdGl2ZU1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKSB7XG4gICAgICAgIHZhciByZXMgPSB7bWlsbGlzZWNvbmRzOiAwLCBtb250aHM6IDB9O1xuXG4gICAgICAgIHJlcy5tb250aHMgPSBvdGhlci5tb250aCgpIC0gYmFzZS5tb250aCgpICtcbiAgICAgICAgICAgIChvdGhlci55ZWFyKCkgLSBiYXNlLnllYXIoKSkgKiAxMjtcbiAgICAgICAgaWYgKGJhc2UuY2xvbmUoKS5hZGQocmVzLm1vbnRocywgJ00nKS5pc0FmdGVyKG90aGVyKSkge1xuICAgICAgICAgICAgLS1yZXMubW9udGhzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzLm1pbGxpc2Vjb25kcyA9ICtvdGhlciAtICsoYmFzZS5jbG9uZSgpLmFkZChyZXMubW9udGhzLCAnTScpKTtcblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKSB7XG4gICAgICAgIHZhciByZXM7XG4gICAgICAgIG90aGVyID0gY2xvbmVXaXRoT2Zmc2V0KG90aGVyLCBiYXNlKTtcbiAgICAgICAgaWYgKGJhc2UuaXNCZWZvcmUob3RoZXIpKSB7XG4gICAgICAgICAgICByZXMgPSBwb3NpdGl2ZU1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcyA9IHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2Uob3RoZXIsIGJhc2UpO1xuICAgICAgICAgICAgcmVzLm1pbGxpc2Vjb25kcyA9IC1yZXMubWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgcmVzLm1vbnRocyA9IC1yZXMubW9udGhzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVBZGRlcihkaXJlY3Rpb24sIG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWwsIHBlcmlvZCkge1xuICAgICAgICAgICAgdmFyIGR1ciwgdG1wO1xuICAgICAgICAgICAgLy9pbnZlcnQgdGhlIGFyZ3VtZW50cywgYnV0IGNvbXBsYWluIGFib3V0IGl0XG4gICAgICAgICAgICBpZiAocGVyaW9kICE9PSBudWxsICYmICFpc05hTigrcGVyaW9kKSkge1xuICAgICAgICAgICAgICAgIGRlcHJlY2F0ZVNpbXBsZShuYW1lLCAnbW9tZW50KCkuJyArIG5hbWUgICsgJyhwZXJpb2QsIG51bWJlcikgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBtb21lbnQoKS4nICsgbmFtZSArICcobnVtYmVyLCBwZXJpb2QpLicpO1xuICAgICAgICAgICAgICAgIHRtcCA9IHZhbDsgdmFsID0gcGVyaW9kOyBwZXJpb2QgPSB0bXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbCA9IHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnID8gK3ZhbCA6IHZhbDtcbiAgICAgICAgICAgIGR1ciA9IGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24odmFsLCBwZXJpb2QpO1xuICAgICAgICAgICAgYWRkX3N1YnRyYWN0X19hZGRTdWJ0cmFjdCh0aGlzLCBkdXIsIGRpcmVjdGlvbik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRfc3VidHJhY3RfX2FkZFN1YnRyYWN0IChtb20sIGR1cmF0aW9uLCBpc0FkZGluZywgdXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSBkdXJhdGlvbi5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgZGF5cyA9IGR1cmF0aW9uLl9kYXlzLFxuICAgICAgICAgICAgbW9udGhzID0gZHVyYXRpb24uX21vbnRocztcbiAgICAgICAgdXBkYXRlT2Zmc2V0ID0gdXBkYXRlT2Zmc2V0ID09IG51bGwgPyB0cnVlIDogdXBkYXRlT2Zmc2V0O1xuXG4gICAgICAgIGlmIChtaWxsaXNlY29uZHMpIHtcbiAgICAgICAgICAgIG1vbS5fZC5zZXRUaW1lKCttb20uX2QgKyBtaWxsaXNlY29uZHMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRheXMpIHtcbiAgICAgICAgICAgIGdldF9zZXRfX3NldChtb20sICdEYXRlJywgZ2V0X3NldF9fZ2V0KG1vbSwgJ0RhdGUnKSArIGRheXMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vbnRocykge1xuICAgICAgICAgICAgc2V0TW9udGgobW9tLCBnZXRfc2V0X19nZXQobW9tLCAnTW9udGgnKSArIG1vbnRocyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KG1vbSwgZGF5cyB8fCBtb250aHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGFkZF9zdWJ0cmFjdF9fYWRkICAgICAgPSBjcmVhdGVBZGRlcigxLCAnYWRkJyk7XG4gICAgdmFyIGFkZF9zdWJ0cmFjdF9fc3VidHJhY3QgPSBjcmVhdGVBZGRlcigtMSwgJ3N1YnRyYWN0Jyk7XG5cbiAgICBmdW5jdGlvbiBtb21lbnRfY2FsZW5kYXJfX2NhbGVuZGFyICh0aW1lKSB7XG4gICAgICAgIC8vIFdlIHdhbnQgdG8gY29tcGFyZSB0aGUgc3RhcnQgb2YgdG9kYXksIHZzIHRoaXMuXG4gICAgICAgIC8vIEdldHRpbmcgc3RhcnQtb2YtdG9kYXkgZGVwZW5kcyBvbiB3aGV0aGVyIHdlJ3JlIGxvY2FsL3V0Yy9vZmZzZXQgb3Igbm90LlxuICAgICAgICB2YXIgbm93ID0gdGltZSB8fCBsb2NhbF9fY3JlYXRlTG9jYWwoKSxcbiAgICAgICAgICAgIHNvZCA9IGNsb25lV2l0aE9mZnNldChub3csIHRoaXMpLnN0YXJ0T2YoJ2RheScpLFxuICAgICAgICAgICAgZGlmZiA9IHRoaXMuZGlmZihzb2QsICdkYXlzJywgdHJ1ZSksXG4gICAgICAgICAgICBmb3JtYXQgPSBkaWZmIDwgLTYgPyAnc2FtZUVsc2UnIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgLTEgPyAnbGFzdFdlZWsnIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgMCA/ICdsYXN0RGF5JyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IDEgPyAnc2FtZURheScgOlxuICAgICAgICAgICAgICAgIGRpZmYgPCAyID8gJ25leHREYXknIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgNyA/ICduZXh0V2VlaycgOiAnc2FtZUVsc2UnO1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXQodGhpcy5sb2NhbGVEYXRhKCkuY2FsZW5kYXIoZm9ybWF0LCB0aGlzLCBsb2NhbF9fY3JlYXRlTG9jYWwobm93KSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb25lICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNb21lbnQodGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNBZnRlciAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgIHZhciBpbnB1dE1zO1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHR5cGVvZiB1bml0cyAhPT0gJ3VuZGVmaW5lZCcgPyB1bml0cyA6ICdtaWxsaXNlY29uZCcpO1xuICAgICAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgIGlucHV0ID0gaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzID4gK2lucHV0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5wdXRNcyA9IGlzTW9tZW50KGlucHV0KSA/ICtpbnB1dCA6ICtsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0TXMgPCArdGhpcy5jbG9uZSgpLnN0YXJ0T2YodW5pdHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNCZWZvcmUgKGlucHV0LCB1bml0cykge1xuICAgICAgICB2YXIgaW5wdXRNcztcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh0eXBlb2YgdW5pdHMgIT09ICd1bmRlZmluZWQnID8gdW5pdHMgOiAnbWlsbGlzZWNvbmQnKTtcbiAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICBpbnB1dCA9IGlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiArdGhpcyA8ICtpbnB1dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0TXMgPSBpc01vbWVudChpbnB1dCkgPyAraW5wdXQgOiArbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiArdGhpcy5jbG9uZSgpLmVuZE9mKHVuaXRzKSA8IGlucHV0TXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0JldHdlZW4gKGZyb20sIHRvLCB1bml0cykge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0FmdGVyKGZyb20sIHVuaXRzKSAmJiB0aGlzLmlzQmVmb3JlKHRvLCB1bml0cyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNTYW1lIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgdmFyIGlucHV0TXM7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMgfHwgJ21pbGxpc2Vjb25kJyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgaW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGxvY2FsX19jcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gK3RoaXMgPT09ICtpbnB1dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0TXMgPSArbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiArKHRoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKSkgPD0gaW5wdXRNcyAmJiBpbnB1dE1zIDw9ICsodGhpcy5jbG9uZSgpLmVuZE9mKHVuaXRzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhYnNGbG9vciAobnVtYmVyKSB7XG4gICAgICAgIGlmIChudW1iZXIgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKG51bWJlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihudW1iZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlmZiAoaW5wdXQsIHVuaXRzLCBhc0Zsb2F0KSB7XG4gICAgICAgIHZhciB0aGF0ID0gY2xvbmVXaXRoT2Zmc2V0KGlucHV0LCB0aGlzKSxcbiAgICAgICAgICAgIHpvbmVEZWx0YSA9ICh0aGF0LnV0Y09mZnNldCgpIC0gdGhpcy51dGNPZmZzZXQoKSkgKiA2ZTQsXG4gICAgICAgICAgICBkZWx0YSwgb3V0cHV0O1xuXG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ3llYXInIHx8IHVuaXRzID09PSAnbW9udGgnIHx8IHVuaXRzID09PSAncXVhcnRlcicpIHtcbiAgICAgICAgICAgIG91dHB1dCA9IG1vbnRoRGlmZih0aGlzLCB0aGF0KTtcbiAgICAgICAgICAgIGlmICh1bml0cyA9PT0gJ3F1YXJ0ZXInKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0IC8gMztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodW5pdHMgPT09ICd5ZWFyJykge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dCAvIDEyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsdGEgPSB0aGlzIC0gdGhhdDtcbiAgICAgICAgICAgIG91dHB1dCA9IHVuaXRzID09PSAnc2Vjb25kJyA/IGRlbHRhIC8gMWUzIDogLy8gMTAwMFxuICAgICAgICAgICAgICAgIHVuaXRzID09PSAnbWludXRlJyA/IGRlbHRhIC8gNmU0IDogLy8gMTAwMCAqIDYwXG4gICAgICAgICAgICAgICAgdW5pdHMgPT09ICdob3VyJyA/IGRlbHRhIC8gMzZlNSA6IC8vIDEwMDAgKiA2MCAqIDYwXG4gICAgICAgICAgICAgICAgdW5pdHMgPT09ICdkYXknID8gKGRlbHRhIC0gem9uZURlbHRhKSAvIDg2NGU1IDogLy8gMTAwMCAqIDYwICogNjAgKiAyNCwgbmVnYXRlIGRzdFxuICAgICAgICAgICAgICAgIHVuaXRzID09PSAnd2VlaycgPyAoZGVsdGEgLSB6b25lRGVsdGEpIC8gNjA0OGU1IDogLy8gMTAwMCAqIDYwICogNjAgKiAyNCAqIDcsIG5lZ2F0ZSBkc3RcbiAgICAgICAgICAgICAgICBkZWx0YTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXNGbG9hdCA/IG91dHB1dCA6IGFic0Zsb29yKG91dHB1dCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9udGhEaWZmIChhLCBiKSB7XG4gICAgICAgIC8vIGRpZmZlcmVuY2UgaW4gbW9udGhzXG4gICAgICAgIHZhciB3aG9sZU1vbnRoRGlmZiA9ICgoYi55ZWFyKCkgLSBhLnllYXIoKSkgKiAxMikgKyAoYi5tb250aCgpIC0gYS5tb250aCgpKSxcbiAgICAgICAgICAgIC8vIGIgaXMgaW4gKGFuY2hvciAtIDEgbW9udGgsIGFuY2hvciArIDEgbW9udGgpXG4gICAgICAgICAgICBhbmNob3IgPSBhLmNsb25lKCkuYWRkKHdob2xlTW9udGhEaWZmLCAnbW9udGhzJyksXG4gICAgICAgICAgICBhbmNob3IyLCBhZGp1c3Q7XG5cbiAgICAgICAgaWYgKGIgLSBhbmNob3IgPCAwKSB7XG4gICAgICAgICAgICBhbmNob3IyID0gYS5jbG9uZSgpLmFkZCh3aG9sZU1vbnRoRGlmZiAtIDEsICdtb250aHMnKTtcbiAgICAgICAgICAgIC8vIGxpbmVhciBhY3Jvc3MgdGhlIG1vbnRoXG4gICAgICAgICAgICBhZGp1c3QgPSAoYiAtIGFuY2hvcikgLyAoYW5jaG9yIC0gYW5jaG9yMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbmNob3IyID0gYS5jbG9uZSgpLmFkZCh3aG9sZU1vbnRoRGlmZiArIDEsICdtb250aHMnKTtcbiAgICAgICAgICAgIC8vIGxpbmVhciBhY3Jvc3MgdGhlIG1vbnRoXG4gICAgICAgICAgICBhZGp1c3QgPSAoYiAtIGFuY2hvcikgLyAoYW5jaG9yMiAtIGFuY2hvcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gLSh3aG9sZU1vbnRoRGlmZiArIGFkanVzdCk7XG4gICAgfVxuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmRlZmF1bHRGb3JtYXQgPSAnWVlZWS1NTS1ERFRISDptbTpzc1onO1xuXG4gICAgZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxvY2FsZSgnZW4nKS5mb3JtYXQoJ2RkZCBNTU0gREQgWVlZWSBISDptbTpzcyBbR01UXVpaJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50X2Zvcm1hdF9fdG9JU09TdHJpbmcgKCkge1xuICAgICAgICB2YXIgbSA9IHRoaXMuY2xvbmUoKS51dGMoKTtcbiAgICAgICAgaWYgKDAgPCBtLnllYXIoKSAmJiBtLnllYXIoKSA8PSA5OTk5KSB7XG4gICAgICAgICAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIERhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgLy8gbmF0aXZlIGltcGxlbWVudGF0aW9uIGlzIH41MHggZmFzdGVyLCB1c2UgaXQgd2hlbiB3ZSBjYW5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b0RhdGUoKS50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0TW9tZW50KG0sICdZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0TW9tZW50KG0sICdZWVlZWVktTU0tRERbVF1ISDptbTpzcy5TU1NbWl0nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdCAoaW5wdXRTdHJpbmcpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IGZvcm1hdE1vbWVudCh0aGlzLCBpbnB1dFN0cmluZyB8fCB1dGlsc19ob29rc19faG9va3MuZGVmYXVsdEZvcm1hdCk7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5wb3N0Zm9ybWF0KG91dHB1dCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZnJvbSAodGltZSwgd2l0aG91dFN1ZmZpeCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlX19jcmVhdGVEdXJhdGlvbih7dG86IHRoaXMsIGZyb206IHRpbWV9KS5sb2NhbGUodGhpcy5sb2NhbGUoKSkuaHVtYW5pemUoIXdpdGhvdXRTdWZmaXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZyb21Ob3cgKHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJvbShsb2NhbF9fY3JlYXRlTG9jYWwoKSwgd2l0aG91dFN1ZmZpeCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlIChrZXkpIHtcbiAgICAgICAgdmFyIG5ld0xvY2FsZURhdGE7XG5cbiAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlLl9hYmJyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3TG9jYWxlRGF0YSA9IGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUoa2V5KTtcbiAgICAgICAgICAgIGlmIChuZXdMb2NhbGVEYXRhICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2NhbGUgPSBuZXdMb2NhbGVEYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGFuZyA9IGRlcHJlY2F0ZShcbiAgICAgICAgJ21vbWVudCgpLmxhbmcoKSBpcyBkZXByZWNhdGVkLiBJbnN0ZWFkLCB1c2UgbW9tZW50KCkubG9jYWxlRGF0YSgpIHRvIGdldCB0aGUgbGFuZ3VhZ2UgY29uZmlndXJhdGlvbi4gVXNlIG1vbWVudCgpLmxvY2FsZSgpIHRvIGNoYW5nZSBsYW5ndWFnZXMuJyxcbiAgICAgICAgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGUoa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICk7XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVEYXRhICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGFydE9mICh1bml0cykge1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgLy8gdGhlIGZvbGxvd2luZyBzd2l0Y2ggaW50ZW50aW9uYWxseSBvbWl0cyBicmVhayBrZXl3b3Jkc1xuICAgICAgICAvLyB0byB1dGlsaXplIGZhbGxpbmcgdGhyb3VnaCB0aGUgY2FzZXMuXG4gICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgY2FzZSAneWVhcic6XG4gICAgICAgICAgICB0aGlzLm1vbnRoKDApO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdxdWFydGVyJzpcbiAgICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICAgICAgdGhpcy5kYXRlKDEpO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICd3ZWVrJzpcbiAgICAgICAgY2FzZSAnaXNvV2Vlayc6XG4gICAgICAgIGNhc2UgJ2RheSc6XG4gICAgICAgICAgICB0aGlzLmhvdXJzKDApO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdob3VyJzpcbiAgICAgICAgICAgIHRoaXMubWludXRlcygwKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnbWludXRlJzpcbiAgICAgICAgICAgIHRoaXMuc2Vjb25kcygwKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnc2Vjb25kJzpcbiAgICAgICAgICAgIHRoaXMubWlsbGlzZWNvbmRzKDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2Vla3MgYXJlIGEgc3BlY2lhbCBjYXNlXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ3dlZWsnKSB7XG4gICAgICAgICAgICB0aGlzLndlZWtkYXkoMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVuaXRzID09PSAnaXNvV2VlaycpIHtcbiAgICAgICAgICAgIHRoaXMuaXNvV2Vla2RheSgxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHF1YXJ0ZXJzIGFyZSBhbHNvIHNwZWNpYWxcbiAgICAgICAgaWYgKHVuaXRzID09PSAncXVhcnRlcicpIHtcbiAgICAgICAgICAgIHRoaXMubW9udGgoTWF0aC5mbG9vcih0aGlzLm1vbnRoKCkgLyAzKSAqIDMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5kT2YgKHVuaXRzKSB7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICBpZiAodW5pdHMgPT09IHVuZGVmaW5lZCB8fCB1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnRPZih1bml0cykuYWRkKDEsICh1bml0cyA9PT0gJ2lzb1dlZWsnID8gJ3dlZWsnIDogdW5pdHMpKS5zdWJ0cmFjdCgxLCAnbXMnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b190eXBlX192YWx1ZU9mICgpIHtcbiAgICAgICAgcmV0dXJuICt0aGlzLl9kIC0gKCh0aGlzLl9vZmZzZXQgfHwgMCkgKiA2MDAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5peCAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKCt0aGlzIC8gMTAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9EYXRlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29mZnNldCA/IG5ldyBEYXRlKCt0aGlzKSA6IHRoaXMuX2Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9BcnJheSAoKSB7XG4gICAgICAgIHZhciBtID0gdGhpcztcbiAgICAgICAgcmV0dXJuIFttLnllYXIoKSwgbS5tb250aCgpLCBtLmRhdGUoKSwgbS5ob3VyKCksIG0ubWludXRlKCksIG0uc2Vjb25kKCksIG0ubWlsbGlzZWNvbmQoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50X3ZhbGlkX19pc1ZhbGlkICgpIHtcbiAgICAgICAgcmV0dXJuIHZhbGlkX19pc1ZhbGlkKHRoaXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNpbmdGbGFncyAoKSB7XG4gICAgICAgIHJldHVybiBleHRlbmQoe30sIHRoaXMuX3BmKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnZhbGlkQXQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGYub3ZlcmZsb3c7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydnZycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndlZWtZZWFyKCkgJSAxMDA7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ0dHJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNvV2Vla1llYXIoKSAlIDEwMDtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4gKHRva2VuLCBnZXR0ZXIpIHtcbiAgICAgICAgYWRkRm9ybWF0VG9rZW4oMCwgW3Rva2VuLCB0b2tlbi5sZW5ndGhdLCAwLCBnZXR0ZXIpO1xuICAgIH1cblxuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ2dnZ2cnLCAgICAgJ3dlZWtZZWFyJyk7XG4gICAgYWRkV2Vla1llYXJGb3JtYXRUb2tlbignZ2dnZ2cnLCAgICAnd2Vla1llYXInKTtcbiAgICBhZGRXZWVrWWVhckZvcm1hdFRva2VuKCdHR0dHJywgICdpc29XZWVrWWVhcicpO1xuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ0dHR0dHJywgJ2lzb1dlZWtZZWFyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3dlZWtZZWFyJywgJ2dnJyk7XG4gICAgYWRkVW5pdEFsaWFzKCdpc29XZWVrWWVhcicsICdHRycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignRycsICAgICAgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2cnLCAgICAgIG1hdGNoU2lnbmVkKTtcbiAgICBhZGRSZWdleFRva2VuKCdHRycsICAgICBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignZ2cnLCAgICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0dHR0cnLCAgIG1hdGNoMXRvNCwgbWF0Y2g0KTtcbiAgICBhZGRSZWdleFRva2VuKCdnZ2dnJywgICBtYXRjaDF0bzQsIG1hdGNoNCk7XG4gICAgYWRkUmVnZXhUb2tlbignR0dHR0cnLCAgbWF0Y2gxdG82LCBtYXRjaDYpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2dnZ2dnJywgIG1hdGNoMXRvNiwgbWF0Y2g2KTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZ2dnZycsICdnZ2dnZycsICdHR0dHJywgJ0dHR0dHJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuLnN1YnN0cigwLCAyKV0gPSB0b0ludChpbnB1dCk7XG4gICAgfSk7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ2dnJywgJ0dHJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuXSA9IHV0aWxzX2hvb2tzX19ob29rcy5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICBmdW5jdGlvbiB3ZWVrc0luWWVhcih5ZWFyLCBkb3csIGRveSkge1xuICAgICAgICByZXR1cm4gd2Vla09mWWVhcihsb2NhbF9fY3JlYXRlTG9jYWwoW3llYXIsIDExLCAzMSArIGRvdyAtIGRveV0pLCBkb3csIGRveSkud2VlaztcbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXRXZWVrWWVhciAoaW5wdXQpIHtcbiAgICAgICAgdmFyIHllYXIgPSB3ZWVrT2ZZZWFyKHRoaXMsIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRvdywgdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG95KS55ZWFyO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHllYXIgOiB0aGlzLmFkZCgoaW5wdXQgLSB5ZWFyKSwgJ3knKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRJU09XZWVrWWVhciAoaW5wdXQpIHtcbiAgICAgICAgdmFyIHllYXIgPSB3ZWVrT2ZZZWFyKHRoaXMsIDEsIDQpLnllYXI7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8geWVhciA6IHRoaXMuYWRkKChpbnB1dCAtIHllYXIpLCAneScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldElTT1dlZWtzSW5ZZWFyICgpIHtcbiAgICAgICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMueWVhcigpLCAxLCA0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRXZWVrc0luWWVhciAoKSB7XG4gICAgICAgIHZhciB3ZWVrSW5mbyA9IHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrO1xuICAgICAgICByZXR1cm4gd2Vla3NJblllYXIodGhpcy55ZWFyKCksIHdlZWtJbmZvLmRvdywgd2Vla0luZm8uZG95KTtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbignUScsIDAsIDAsICdxdWFydGVyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3F1YXJ0ZXInLCAnUScpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignUScsIG1hdGNoMSk7XG4gICAgYWRkUGFyc2VUb2tlbignUScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbTU9OVEhdID0gKHRvSW50KGlucHV0KSAtIDEpICogMztcbiAgICB9KTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldFF1YXJ0ZXIgKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gTWF0aC5jZWlsKCh0aGlzLm1vbnRoKCkgKyAxKSAvIDMpIDogdGhpcy5tb250aCgoaW5wdXQgLSAxKSAqIDMgKyB0aGlzLm1vbnRoKCkgJSAzKTtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbignRCcsIFsnREQnLCAyXSwgJ0RvJywgJ2RhdGUnKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnZGF0ZScsICdEJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdEJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignREQnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignRG8nLCBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gaXNTdHJpY3QgPyBsb2NhbGUuX29yZGluYWxQYXJzZSA6IGxvY2FsZS5fb3JkaW5hbFBhcnNlTGVuaWVudDtcbiAgICB9KTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydEJywgJ0REJ10sIERBVEUpO1xuICAgIGFkZFBhcnNlVG9rZW4oJ0RvJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtEQVRFXSA9IHRvSW50KGlucHV0Lm1hdGNoKG1hdGNoMXRvMilbMF0sIDEwKTtcbiAgICB9KTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXREYXlPZk1vbnRoID0gbWFrZUdldFNldCgnRGF0ZScsIHRydWUpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2QnLCAwLCAnZG8nLCAnZGF5Jyk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZGQnLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5c01pbih0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2RkZCcsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzU2hvcnQodGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdkZGRkJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXModGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdlJywgMCwgMCwgJ3dlZWtkYXknKTtcbiAgICBhZGRGb3JtYXRUb2tlbignRScsIDAsIDAsICdpc29XZWVrZGF5Jyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2RheScsICdkJyk7XG4gICAgYWRkVW5pdEFsaWFzKCd3ZWVrZGF5JywgJ2UnKTtcbiAgICBhZGRVbml0QWxpYXMoJ2lzb1dlZWtkYXknLCAnRScpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignZCcsICAgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignZScsICAgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignRScsICAgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignZGQnLCAgIG1hdGNoV29yZCk7XG4gICAgYWRkUmVnZXhUb2tlbignZGRkJywgIG1hdGNoV29yZCk7XG4gICAgYWRkUmVnZXhUb2tlbignZGRkZCcsIG1hdGNoV29yZCk7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ2RkJywgJ2RkZCcsICdkZGRkJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnKSB7XG4gICAgICAgIHZhciB3ZWVrZGF5ID0gY29uZmlnLl9sb2NhbGUud2Vla2RheXNQYXJzZShpbnB1dCk7XG4gICAgICAgIC8vIGlmIHdlIGRpZG4ndCBnZXQgYSB3ZWVrZGF5IG5hbWUsIG1hcmsgdGhlIGRhdGUgYXMgaW52YWxpZFxuICAgICAgICBpZiAod2Vla2RheSAhPSBudWxsKSB7XG4gICAgICAgICAgICB3ZWVrLmQgPSB3ZWVrZGF5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uZmlnLl9wZi5pbnZhbGlkV2Vla2RheSA9IGlucHV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ2QnLCAnZScsICdFJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuXSA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIGZ1bmN0aW9uIHBhcnNlV2Vla2RheShpbnB1dCwgbG9jYWxlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAoIWlzTmFOKGlucHV0KSkge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gcGFyc2VJbnQoaW5wdXQsIDEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gbG9jYWxlLndlZWtkYXlzUGFyc2UoaW5wdXQpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgfVxuXG4gICAgLy8gTE9DQUxFU1xuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5cyA9ICdTdW5kYXlfTW9uZGF5X1R1ZXNkYXlfV2VkbmVzZGF5X1RodXJzZGF5X0ZyaWRheV9TYXR1cmRheScuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5cyAobSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNbbS5kYXkoKV07XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5c1Nob3J0ID0gJ1N1bl9Nb25fVHVlX1dlZF9UaHVfRnJpX1NhdCcuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5c1Nob3J0IChtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1Nob3J0W20uZGF5KCldO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlV2Vla2RheXNNaW4gPSAnU3VfTW9fVHVfV2VfVGhfRnJfU2EnLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlV2Vla2RheXNNaW4gKG0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzTWluW20uZGF5KCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzUGFyc2UgKHdlZWtkYXlOYW1lKSB7XG4gICAgICAgIHZhciBpLCBtb20sIHJlZ2V4O1xuXG4gICAgICAgIGlmICghdGhpcy5fd2Vla2RheXNQYXJzZSkge1xuICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICBtb20gPSBsb2NhbF9fY3JlYXRlTG9jYWwoWzIwMDAsIDFdKS5kYXkoaSk7XG4gICAgICAgICAgICAgICAgcmVnZXggPSAnXicgKyB0aGlzLndlZWtkYXlzKG1vbSwgJycpICsgJ3xeJyArIHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKSArICd8XicgKyB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKHJlZ2V4LnJlcGxhY2UoJy4nLCAnJyksICdpJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICAgICAgaWYgKHRoaXMuX3dlZWtkYXlzUGFyc2VbaV0udGVzdCh3ZWVrZGF5TmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldERheU9mV2VlayAoaW5wdXQpIHtcbiAgICAgICAgdmFyIGRheSA9IHRoaXMuX2lzVVRDID8gdGhpcy5fZC5nZXRVVENEYXkoKSA6IHRoaXMuX2QuZ2V0RGF5KCk7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpbnB1dCA9IHBhcnNlV2Vla2RheShpbnB1dCwgdGhpcy5sb2NhbGVEYXRhKCkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkKGlucHV0IC0gZGF5LCAnZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRheTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldExvY2FsZURheU9mV2VlayAoaW5wdXQpIHtcbiAgICAgICAgdmFyIHdlZWtkYXkgPSAodGhpcy5kYXkoKSArIDcgLSB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3cpICUgNztcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrZGF5IDogdGhpcy5hZGQoaW5wdXQgLSB3ZWVrZGF5LCAnZCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldElTT0RheU9mV2VlayAoaW5wdXQpIHtcbiAgICAgICAgLy8gYmVoYXZlcyB0aGUgc2FtZSBhcyBtb21lbnQjZGF5IGV4Y2VwdFxuICAgICAgICAvLyBhcyBhIGdldHRlciwgcmV0dXJucyA3IGluc3RlYWQgb2YgMCAoMS03IHJhbmdlIGluc3RlYWQgb2YgMC02KVxuICAgICAgICAvLyBhcyBhIHNldHRlciwgc3VuZGF5IHNob3VsZCBiZWxvbmcgdG8gdGhlIHByZXZpb3VzIHdlZWsuXG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gdGhpcy5kYXkoKSB8fCA3IDogdGhpcy5kYXkodGhpcy5kYXkoKSAlIDcgPyBpbnB1dCA6IGlucHV0IC0gNyk7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0gnLCBbJ0hIJywgMl0sIDAsICdob3VyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ2gnLCBbJ2hoJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaG91cnMoKSAlIDEyIHx8IDEyO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gbWVyaWRpZW0gKHRva2VuLCBsb3dlcmNhc2UpIHtcbiAgICAgICAgYWRkRm9ybWF0VG9rZW4odG9rZW4sIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tZXJpZGllbSh0aGlzLmhvdXJzKCksIHRoaXMubWludXRlcygpLCBsb3dlcmNhc2UpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBtZXJpZGllbSgnYScsIHRydWUpO1xuICAgIG1lcmlkaWVtKCdBJywgZmFsc2UpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdob3VyJywgJ2gnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGZ1bmN0aW9uIG1hdGNoTWVyaWRpZW0gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS5fbWVyaWRpZW1QYXJzZTtcbiAgICB9XG5cbiAgICBhZGRSZWdleFRva2VuKCdhJywgIG1hdGNoTWVyaWRpZW0pO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0EnLCAgbWF0Y2hNZXJpZGllbSk7XG4gICAgYWRkUmVnZXhUb2tlbignSCcsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2gnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdISCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdoaCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydIJywgJ0hIJ10sIEhPVVIpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydhJywgJ0EnXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5faXNQbSA9IGNvbmZpZy5fbG9jYWxlLmlzUE0oaW5wdXQpO1xuICAgICAgICBjb25maWcuX21lcmlkaWVtID0gaW5wdXQ7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbihbJ2gnLCAnaGgnXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGFycmF5W0hPVVJdID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICBjb25maWcuX3BmLmJpZ0hvdXIgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgLy8gTE9DQUxFU1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlSXNQTSAoaW5wdXQpIHtcbiAgICAgICAgLy8gSUU4IFF1aXJrcyBNb2RlICYgSUU3IFN0YW5kYXJkcyBNb2RlIGRvIG5vdCBhbGxvdyBhY2Nlc3Npbmcgc3RyaW5ncyBsaWtlIGFycmF5c1xuICAgICAgICAvLyBVc2luZyBjaGFyQXQgc2hvdWxkIGJlIG1vcmUgY29tcGF0aWJsZS5cbiAgICAgICAgcmV0dXJuICgoaW5wdXQgKyAnJykudG9Mb3dlckNhc2UoKS5jaGFyQXQoMCkgPT09ICdwJyk7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVNZXJpZGllbVBhcnNlID0gL1thcF1cXC4/bT9cXC4/L2k7XG4gICAgZnVuY3Rpb24gbG9jYWxlTWVyaWRpZW0gKGhvdXJzLCBtaW51dGVzLCBpc0xvd2VyKSB7XG4gICAgICAgIGlmIChob3VycyA+IDExKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNMb3dlciA/ICdwbScgOiAnUE0nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGlzTG93ZXIgPyAnYW0nIDogJ0FNJztcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgLy8gU2V0dGluZyB0aGUgaG91ciBzaG91bGQga2VlcCB0aGUgdGltZSwgYmVjYXVzZSB0aGUgdXNlciBleHBsaWNpdGx5XG4gICAgLy8gc3BlY2lmaWVkIHdoaWNoIGhvdXIgaGUgd2FudHMuIFNvIHRyeWluZyB0byBtYWludGFpbiB0aGUgc2FtZSBob3VyIChpblxuICAgIC8vIGEgbmV3IHRpbWV6b25lKSBtYWtlcyBzZW5zZS4gQWRkaW5nL3N1YnRyYWN0aW5nIGhvdXJzIGRvZXMgbm90IGZvbGxvd1xuICAgIC8vIHRoaXMgcnVsZS5cbiAgICB2YXIgZ2V0U2V0SG91ciA9IG1ha2VHZXRTZXQoJ0hvdXJzJywgdHJ1ZSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignbScsIFsnbW0nLCAyXSwgMCwgJ21pbnV0ZScpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtaW51dGUnLCAnbScpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignbScsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ21tJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydtJywgJ21tJ10sIE1JTlVURSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0TWludXRlID0gbWFrZUdldFNldCgnTWludXRlcycsIGZhbHNlKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdzJywgWydzcycsIDJdLCAwLCAnc2Vjb25kJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3NlY29uZCcsICdzJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdzJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignc3MnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUGFyc2VUb2tlbihbJ3MnLCAnc3MnXSwgU0VDT05EKTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRTZWNvbmQgPSBtYWtlR2V0U2V0KCdTZWNvbmRzJywgZmFsc2UpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1MnLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB+fih0aGlzLm1pbGxpc2Vjb25kKCkgLyAxMDApO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTUycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB+fih0aGlzLm1pbGxpc2Vjb25kKCkgLyAxMCk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBtaWxsaXNlY29uZF9fbWlsbGlzZWNvbmRzICh0b2tlbikge1xuICAgICAgICBhZGRGb3JtYXRUb2tlbigwLCBbdG9rZW4sIDNdLCAwLCAnbWlsbGlzZWNvbmQnKTtcbiAgICB9XG5cbiAgICBtaWxsaXNlY29uZF9fbWlsbGlzZWNvbmRzKCdTU1MnKTtcbiAgICBtaWxsaXNlY29uZF9fbWlsbGlzZWNvbmRzKCdTU1NTJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ21pbGxpc2Vjb25kJywgJ21zJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdTJywgICAgbWF0Y2gxdG8zLCBtYXRjaDEpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1NTJywgICBtYXRjaDF0bzMsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignU1NTJywgIG1hdGNoMXRvMywgbWF0Y2gzKTtcbiAgICBhZGRSZWdleFRva2VuKCdTU1NTJywgbWF0Y2hVbnNpZ25lZCk7XG4gICAgYWRkUGFyc2VUb2tlbihbJ1MnLCAnU1MnLCAnU1NTJywgJ1NTU1MnXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtNSUxMSVNFQ09ORF0gPSB0b0ludCgoJzAuJyArIGlucHV0KSAqIDEwMDApO1xuICAgIH0pO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldE1pbGxpc2Vjb25kID0gbWFrZUdldFNldCgnTWlsbGlzZWNvbmRzJywgZmFsc2UpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ3onLCAgMCwgMCwgJ3pvbmVBYmJyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ3p6JywgMCwgMCwgJ3pvbmVOYW1lJyk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRab25lQWJiciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/ICdVVEMnIDogJyc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Wm9uZU5hbWUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyAnQ29vcmRpbmF0ZWQgVW5pdmVyc2FsIFRpbWUnIDogJyc7XG4gICAgfVxuXG4gICAgdmFyIG1vbWVudFByb3RvdHlwZV9fcHJvdG8gPSBNb21lbnQucHJvdG90eXBlO1xuXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5hZGQgICAgICAgICAgPSBhZGRfc3VidHJhY3RfX2FkZDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmNhbGVuZGFyICAgICA9IG1vbWVudF9jYWxlbmRhcl9fY2FsZW5kYXI7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5jbG9uZSAgICAgICAgPSBjbG9uZTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmRpZmYgICAgICAgICA9IGRpZmY7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5lbmRPZiAgICAgICAgPSBlbmRPZjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmZvcm1hdCAgICAgICA9IGZvcm1hdDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmZyb20gICAgICAgICA9IGZyb207XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5mcm9tTm93ICAgICAgPSBmcm9tTm93O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZ2V0ICAgICAgICAgID0gZ2V0U2V0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaW52YWxpZEF0ICAgID0gaW52YWxpZEF0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNBZnRlciAgICAgID0gaXNBZnRlcjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzQmVmb3JlICAgICA9IGlzQmVmb3JlO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNCZXR3ZWVuICAgID0gaXNCZXR3ZWVuO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNTYW1lICAgICAgID0gaXNTYW1lO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNWYWxpZCAgICAgID0gbW9tZW50X3ZhbGlkX19pc1ZhbGlkO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubGFuZyAgICAgICAgID0gbGFuZztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmxvY2FsZSAgICAgICA9IGxvY2FsZTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmxvY2FsZURhdGEgICA9IGxvY2FsZURhdGE7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5tYXggICAgICAgICAgPSBwcm90b3R5cGVNYXg7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5taW4gICAgICAgICAgPSBwcm90b3R5cGVNaW47XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5wYXJzaW5nRmxhZ3MgPSBwYXJzaW5nRmxhZ3M7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5zZXQgICAgICAgICAgPSBnZXRTZXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5zdGFydE9mICAgICAgPSBzdGFydE9mO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uc3VidHJhY3QgICAgID0gYWRkX3N1YnRyYWN0X19zdWJ0cmFjdDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvQXJyYXkgICAgICA9IHRvQXJyYXk7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by50b0RhdGUgICAgICAgPSB0b0RhdGU7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by50b0lTT1N0cmluZyAgPSBtb21lbnRfZm9ybWF0X190b0lTT1N0cmluZztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvSlNPTiAgICAgICA9IG1vbWVudF9mb3JtYXRfX3RvSVNPU3RyaW5nO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9TdHJpbmcgICAgID0gdG9TdHJpbmc7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by51bml4ICAgICAgICAgPSB1bml4O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udmFsdWVPZiAgICAgID0gdG9fdHlwZV9fdmFsdWVPZjtcblxuICAgIC8vIFllYXJcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnllYXIgICAgICAgPSBnZXRTZXRZZWFyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNMZWFwWWVhciA9IGdldElzTGVhcFllYXI7XG5cbiAgICAvLyBXZWVrIFllYXJcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLndlZWtZZWFyICAgID0gZ2V0U2V0V2Vla1llYXI7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc29XZWVrWWVhciA9IGdldFNldElTT1dlZWtZZWFyO1xuXG4gICAgLy8gUXVhcnRlclxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ucXVhcnRlciA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8ucXVhcnRlcnMgPSBnZXRTZXRRdWFydGVyO1xuXG4gICAgLy8gTW9udGhcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1vbnRoICAgICAgID0gZ2V0U2V0TW9udGg7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kYXlzSW5Nb250aCA9IGdldERheXNJbk1vbnRoO1xuXG4gICAgLy8gV2Vla1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ud2VlayAgICAgICAgICAgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLndlZWtzICAgICAgICA9IGdldFNldFdlZWs7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc29XZWVrICAgICAgICA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNvV2Vla3MgICAgID0gZ2V0U2V0SVNPV2VlaztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLndlZWtzSW5ZZWFyICAgID0gZ2V0V2Vla3NJblllYXI7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc29XZWVrc0luWWVhciA9IGdldElTT1dlZWtzSW5ZZWFyO1xuXG4gICAgLy8gRGF5XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kYXRlICAgICAgID0gZ2V0U2V0RGF5T2ZNb250aDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmRheSAgICAgICAgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmRheXMgICAgICAgICAgICAgPSBnZXRTZXREYXlPZldlZWs7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrZGF5ICAgID0gZ2V0U2V0TG9jYWxlRGF5T2ZXZWVrO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNvV2Vla2RheSA9IGdldFNldElTT0RheU9mV2VlaztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmRheU9mWWVhciAgPSBnZXRTZXREYXlPZlllYXI7XG5cbiAgICAvLyBIb3VyXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5ob3VyID0gbW9tZW50UHJvdG90eXBlX19wcm90by5ob3VycyA9IGdldFNldEhvdXI7XG5cbiAgICAvLyBNaW51dGVcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1pbnV0ZSA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubWludXRlcyA9IGdldFNldE1pbnV0ZTtcblxuICAgIC8vIFNlY29uZFxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uc2Vjb25kID0gbW9tZW50UHJvdG90eXBlX19wcm90by5zZWNvbmRzID0gZ2V0U2V0U2Vjb25kO1xuXG4gICAgLy8gTWlsbGlzZWNvbmRcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1pbGxpc2Vjb25kID0gbW9tZW50UHJvdG90eXBlX19wcm90by5taWxsaXNlY29uZHMgPSBnZXRTZXRNaWxsaXNlY29uZDtcblxuICAgIC8vIE9mZnNldFxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udXRjT2Zmc2V0ICAgICAgICAgICAgPSBnZXRTZXRPZmZzZXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by51dGMgICAgICAgICAgICAgICAgICA9IHNldE9mZnNldFRvVVRDO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubG9jYWwgICAgICAgICAgICAgICAgPSBzZXRPZmZzZXRUb0xvY2FsO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ucGFyc2Vab25lICAgICAgICAgICAgPSBzZXRPZmZzZXRUb1BhcnNlZE9mZnNldDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmhhc0FsaWduZWRIb3VyT2Zmc2V0ID0gaGFzQWxpZ25lZEhvdXJPZmZzZXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0RTVCAgICAgICAgICAgICAgICA9IGlzRGF5bGlnaHRTYXZpbmdUaW1lO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNEU1RTaGlmdGVkICAgICAgICAgPSBpc0RheWxpZ2h0U2F2aW5nVGltZVNoaWZ0ZWQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0xvY2FsICAgICAgICAgICAgICA9IGlzTG9jYWw7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc1V0Y09mZnNldCAgICAgICAgICA9IGlzVXRjT2Zmc2V0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNVdGMgICAgICAgICAgICAgICAgPSBpc1V0YztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzVVRDICAgICAgICAgICAgICAgID0gaXNVdGM7XG5cbiAgICAvLyBUaW1lem9uZVxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uem9uZUFiYnIgPSBnZXRab25lQWJicjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnpvbmVOYW1lID0gZ2V0Wm9uZU5hbWU7XG5cbiAgICAvLyBEZXByZWNhdGlvbnNcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmRhdGVzICA9IGRlcHJlY2F0ZSgnZGF0ZXMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIGRhdGUgaW5zdGVhZC4nLCBnZXRTZXREYXlPZk1vbnRoKTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1vbnRocyA9IGRlcHJlY2F0ZSgnbW9udGhzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb250aCBpbnN0ZWFkJywgZ2V0U2V0TW9udGgpO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ueWVhcnMgID0gZGVwcmVjYXRlKCd5ZWFycyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgeWVhciBpbnN0ZWFkJywgZ2V0U2V0WWVhcik7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by56b25lICAgPSBkZXByZWNhdGUoJ21vbWVudCgpLnpvbmUgaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudCgpLnV0Y09mZnNldCBpbnN0ZWFkLiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTc3OScsIGdldFNldFpvbmUpO1xuXG4gICAgdmFyIG1vbWVudFByb3RvdHlwZSA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG87XG5cbiAgICBmdW5jdGlvbiBtb21lbnRfX2NyZWF0ZVVuaXggKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQgKiAxMDAwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb21lbnRfX2NyZWF0ZUluWm9uZSAoKSB7XG4gICAgICAgIHJldHVybiBsb2NhbF9fY3JlYXRlTG9jYWwuYXBwbHkobnVsbCwgYXJndW1lbnRzKS5wYXJzZVpvbmUoKTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdENhbGVuZGFyID0ge1xuICAgICAgICBzYW1lRGF5IDogJ1tUb2RheSBhdF0gTFQnLFxuICAgICAgICBuZXh0RGF5IDogJ1tUb21vcnJvdyBhdF0gTFQnLFxuICAgICAgICBuZXh0V2VlayA6ICdkZGRkIFthdF0gTFQnLFxuICAgICAgICBsYXN0RGF5IDogJ1tZZXN0ZXJkYXkgYXRdIExUJyxcbiAgICAgICAgbGFzdFdlZWsgOiAnW0xhc3RdIGRkZGQgW2F0XSBMVCcsXG4gICAgICAgIHNhbWVFbHNlIDogJ0wnXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxvY2FsZV9jYWxlbmRhcl9fY2FsZW5kYXIgKGtleSwgbW9tLCBub3cpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuX2NhbGVuZGFyW2tleV07XG4gICAgICAgIHJldHVybiB0eXBlb2Ygb3V0cHV0ID09PSAnZnVuY3Rpb24nID8gb3V0cHV0LmNhbGwobW9tLCBub3cpIDogb3V0cHV0O1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9uZ0RhdGVGb3JtYXQgPSB7XG4gICAgICAgIExUUyAgOiAnaDptbTpzcyBBJyxcbiAgICAgICAgTFQgICA6ICdoOm1tIEEnLFxuICAgICAgICBMICAgIDogJ01NL0REL1lZWVknLFxuICAgICAgICBMTCAgIDogJ01NTU0gRCwgWVlZWScsXG4gICAgICAgIExMTCAgOiAnTU1NTSBELCBZWVlZIExUJyxcbiAgICAgICAgTExMTCA6ICdkZGRkLCBNTU1NIEQsIFlZWVkgTFQnXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxvbmdEYXRlRm9ybWF0IChrZXkpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV07XG4gICAgICAgIGlmICghb3V0cHV0ICYmIHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleS50b1VwcGVyQ2FzZSgpXSkge1xuICAgICAgICAgICAgb3V0cHV0ID0gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5LnRvVXBwZXJDYXNlKCldLnJlcGxhY2UoL01NTU18TU18RER8ZGRkZC9nLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbC5zbGljZSgxKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XSA9IG91dHB1dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0SW52YWxpZERhdGUgPSAnSW52YWxpZCBkYXRlJztcblxuICAgIGZ1bmN0aW9uIGludmFsaWREYXRlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludmFsaWREYXRlO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0T3JkaW5hbCA9ICclZCc7XG4gICAgdmFyIGRlZmF1bHRPcmRpbmFsUGFyc2UgPSAvXFxkezEsMn0vO1xuXG4gICAgZnVuY3Rpb24gb3JkaW5hbCAobnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vcmRpbmFsLnJlcGxhY2UoJyVkJywgbnVtYmVyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmVQYXJzZVBvc3RGb3JtYXQgKHN0cmluZykge1xuICAgICAgICByZXR1cm4gc3RyaW5nO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0UmVsYXRpdmVUaW1lID0ge1xuICAgICAgICBmdXR1cmUgOiAnaW4gJXMnLFxuICAgICAgICBwYXN0ICAgOiAnJXMgYWdvJyxcbiAgICAgICAgcyAgOiAnYSBmZXcgc2Vjb25kcycsXG4gICAgICAgIG0gIDogJ2EgbWludXRlJyxcbiAgICAgICAgbW0gOiAnJWQgbWludXRlcycsXG4gICAgICAgIGggIDogJ2FuIGhvdXInLFxuICAgICAgICBoaCA6ICclZCBob3VycycsXG4gICAgICAgIGQgIDogJ2EgZGF5JyxcbiAgICAgICAgZGQgOiAnJWQgZGF5cycsXG4gICAgICAgIE0gIDogJ2EgbW9udGgnLFxuICAgICAgICBNTSA6ICclZCBtb250aHMnLFxuICAgICAgICB5ICA6ICdhIHllYXInLFxuICAgICAgICB5eSA6ICclZCB5ZWFycydcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gcmVsYXRpdmVfX3JlbGF0aXZlVGltZSAobnVtYmVyLCB3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbc3RyaW5nXTtcbiAgICAgICAgcmV0dXJuICh0eXBlb2Ygb3V0cHV0ID09PSAnZnVuY3Rpb24nKSA/XG4gICAgICAgICAgICBvdXRwdXQobnVtYmVyLCB3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKSA6XG4gICAgICAgICAgICBvdXRwdXQucmVwbGFjZSgvJWQvaSwgbnVtYmVyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXN0RnV0dXJlIChkaWZmLCBvdXRwdXQpIHtcbiAgICAgICAgdmFyIGZvcm1hdCA9IHRoaXMuX3JlbGF0aXZlVGltZVtkaWZmID4gMCA/ICdmdXR1cmUnIDogJ3Bhc3QnXTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBmb3JtYXQgPT09ICdmdW5jdGlvbicgPyBmb3JtYXQob3V0cHV0KSA6IGZvcm1hdC5yZXBsYWNlKC8lcy9pLCBvdXRwdXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZV9zZXRfX3NldCAoY29uZmlnKSB7XG4gICAgICAgIHZhciBwcm9wLCBpO1xuICAgICAgICBmb3IgKGkgaW4gY29uZmlnKSB7XG4gICAgICAgICAgICBwcm9wID0gY29uZmlnW2ldO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhpc1tpXSA9IHByb3A7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXNbJ18nICsgaV0gPSBwcm9wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIExlbmllbnQgb3JkaW5hbCBwYXJzaW5nIGFjY2VwdHMganVzdCBhIG51bWJlciBpbiBhZGRpdGlvbiB0b1xuICAgICAgICAvLyBudW1iZXIgKyAocG9zc2libHkpIHN0dWZmIGNvbWluZyBmcm9tIF9vcmRpbmFsUGFyc2VMZW5pZW50LlxuICAgICAgICB0aGlzLl9vcmRpbmFsUGFyc2VMZW5pZW50ID0gbmV3IFJlZ0V4cCh0aGlzLl9vcmRpbmFsUGFyc2Uuc291cmNlICsgJ3wnICsgL1xcZHsxLDJ9Ly5zb3VyY2UpO1xuICAgIH1cblxuICAgIHZhciBwcm90b3R5cGVfX3Byb3RvID0gTG9jYWxlLnByb3RvdHlwZTtcblxuICAgIHByb3RvdHlwZV9fcHJvdG8uX2NhbGVuZGFyICAgICAgID0gZGVmYXVsdENhbGVuZGFyO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uY2FsZW5kYXIgICAgICAgID0gbG9jYWxlX2NhbGVuZGFyX19jYWxlbmRhcjtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9sb25nRGF0ZUZvcm1hdCA9IGRlZmF1bHRMb25nRGF0ZUZvcm1hdDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLmxvbmdEYXRlRm9ybWF0ICA9IGxvbmdEYXRlRm9ybWF0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX2ludmFsaWREYXRlICAgID0gZGVmYXVsdEludmFsaWREYXRlO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uaW52YWxpZERhdGUgICAgID0gaW52YWxpZERhdGU7XG4gICAgcHJvdG90eXBlX19wcm90by5fb3JkaW5hbCAgICAgICAgPSBkZWZhdWx0T3JkaW5hbDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLm9yZGluYWwgICAgICAgICA9IG9yZGluYWw7XG4gICAgcHJvdG90eXBlX19wcm90by5fb3JkaW5hbFBhcnNlICAgPSBkZWZhdWx0T3JkaW5hbFBhcnNlO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ucHJlcGFyc2UgICAgICAgID0gcHJlUGFyc2VQb3N0Rm9ybWF0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8ucG9zdGZvcm1hdCAgICAgID0gcHJlUGFyc2VQb3N0Rm9ybWF0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX3JlbGF0aXZlVGltZSAgID0gZGVmYXVsdFJlbGF0aXZlVGltZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLnJlbGF0aXZlVGltZSAgICA9IHJlbGF0aXZlX19yZWxhdGl2ZVRpbWU7XG4gICAgcHJvdG90eXBlX19wcm90by5wYXN0RnV0dXJlICAgICAgPSBwYXN0RnV0dXJlO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uc2V0ICAgICAgICAgICAgID0gbG9jYWxlX3NldF9fc2V0O1xuXG4gICAgLy8gTW9udGhcbiAgICBwcm90b3R5cGVfX3Byb3RvLm1vbnRocyAgICAgICA9ICAgICAgICBsb2NhbGVNb250aHM7XG4gICAgcHJvdG90eXBlX19wcm90by5fbW9udGhzICAgICAgPSBkZWZhdWx0TG9jYWxlTW9udGhzO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ubW9udGhzU2hvcnQgID0gICAgICAgIGxvY2FsZU1vbnRoc1Nob3J0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX21vbnRoc1Nob3J0ID0gZGVmYXVsdExvY2FsZU1vbnRoc1Nob3J0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8ubW9udGhzUGFyc2UgID0gICAgICAgIGxvY2FsZU1vbnRoc1BhcnNlO1xuXG4gICAgLy8gV2Vla1xuICAgIHByb3RvdHlwZV9fcHJvdG8ud2VlayA9IGxvY2FsZVdlZWs7XG4gICAgcHJvdG90eXBlX19wcm90by5fd2VlayA9IGRlZmF1bHRMb2NhbGVXZWVrO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uZmlyc3REYXlPZlllYXIgPSBsb2NhbGVGaXJzdERheU9mWWVhcjtcbiAgICBwcm90b3R5cGVfX3Byb3RvLmZpcnN0RGF5T2ZXZWVrID0gbG9jYWxlRmlyc3REYXlPZldlZWs7XG5cbiAgICAvLyBEYXkgb2YgV2Vla1xuICAgIHByb3RvdHlwZV9fcHJvdG8ud2Vla2RheXMgICAgICAgPSAgICAgICAgbG9jYWxlV2Vla2RheXM7XG4gICAgcHJvdG90eXBlX19wcm90by5fd2Vla2RheXMgICAgICA9IGRlZmF1bHRMb2NhbGVXZWVrZGF5cztcbiAgICBwcm90b3R5cGVfX3Byb3RvLndlZWtkYXlzTWluICAgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzTWluO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX3dlZWtkYXlzTWluICAgPSBkZWZhdWx0TG9jYWxlV2Vla2RheXNNaW47XG4gICAgcHJvdG90eXBlX19wcm90by53ZWVrZGF5c1Nob3J0ICA9ICAgICAgICBsb2NhbGVXZWVrZGF5c1Nob3J0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX3dlZWtkYXlzU2hvcnQgPSBkZWZhdWx0TG9jYWxlV2Vla2RheXNTaG9ydDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLndlZWtkYXlzUGFyc2UgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzUGFyc2U7XG5cbiAgICAvLyBIb3Vyc1xuICAgIHByb3RvdHlwZV9fcHJvdG8uaXNQTSA9IGxvY2FsZUlzUE07XG4gICAgcHJvdG90eXBlX19wcm90by5fbWVyaWRpZW1QYXJzZSA9IGRlZmF1bHRMb2NhbGVNZXJpZGllbVBhcnNlO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ubWVyaWRpZW0gPSBsb2NhbGVNZXJpZGllbTtcblxuICAgIGZ1bmN0aW9uIGxpc3RzX19nZXQgKGZvcm1hdCwgaW5kZXgsIGZpZWxkLCBzZXR0ZXIpIHtcbiAgICAgICAgdmFyIGxvY2FsZSA9IGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUoKTtcbiAgICAgICAgdmFyIHV0YyA9IGNyZWF0ZV91dGNfX2NyZWF0ZVVUQygpLnNldChzZXR0ZXIsIGluZGV4KTtcbiAgICAgICAgcmV0dXJuIGxvY2FsZVtmaWVsZF0odXRjLCBmb3JtYXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3QgKGZvcm1hdCwgaW5kZXgsIGZpZWxkLCBjb3VudCwgc2V0dGVyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZm9ybWF0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaW5kZXggPSBmb3JtYXQ7XG4gICAgICAgICAgICBmb3JtYXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgJyc7XG5cbiAgICAgICAgaWYgKGluZGV4ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBsaXN0c19fZ2V0KGZvcm1hdCwgaW5kZXgsIGZpZWxkLCBzZXR0ZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBvdXQgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIG91dFtpXSA9IGxpc3RzX19nZXQoZm9ybWF0LCBpLCBmaWVsZCwgc2V0dGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RzX19saXN0TW9udGhzIChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0KGZvcm1hdCwgaW5kZXgsICdtb250aHMnLCAxMiwgJ21vbnRoJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdHNfX2xpc3RNb250aHNTaG9ydCAoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdChmb3JtYXQsIGluZGV4LCAnbW9udGhzU2hvcnQnLCAxMiwgJ21vbnRoJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdHNfX2xpc3RXZWVrZGF5cyAoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdChmb3JtYXQsIGluZGV4LCAnd2Vla2RheXMnLCA3LCAnZGF5Jyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdHNfX2xpc3RXZWVrZGF5c1Nob3J0IChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0KGZvcm1hdCwgaW5kZXgsICd3ZWVrZGF5c1Nob3J0JywgNywgJ2RheScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RzX19saXN0V2Vla2RheXNNaW4gKGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3QoZm9ybWF0LCBpbmRleCwgJ3dlZWtkYXlzTWluJywgNywgJ2RheScpO1xuICAgIH1cblxuICAgIGxvY2FsZV9sb2NhbGVzX19nZXRTZXRHbG9iYWxMb2NhbGUoJ2VuJywge1xuICAgICAgICBvcmRpbmFsUGFyc2U6IC9cXGR7MSwyfSh0aHxzdHxuZHxyZCkvLFxuICAgICAgICBvcmRpbmFsIDogZnVuY3Rpb24gKG51bWJlcikge1xuICAgICAgICAgICAgdmFyIGIgPSBudW1iZXIgJSAxMCxcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSAodG9JbnQobnVtYmVyICUgMTAwIC8gMTApID09PSAxKSA/ICd0aCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAxKSA/ICdzdCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAyKSA/ICduZCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAzKSA/ICdyZCcgOiAndGgnO1xuICAgICAgICAgICAgcmV0dXJuIG51bWJlciArIG91dHB1dDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU2lkZSBlZmZlY3QgaW1wb3J0c1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5sYW5nID0gZGVwcmVjYXRlKCdtb21lbnQubGFuZyBpcyBkZXByZWNhdGVkLiBVc2UgbW9tZW50LmxvY2FsZSBpbnN0ZWFkLicsIGxvY2FsZV9sb2NhbGVzX19nZXRTZXRHbG9iYWxMb2NhbGUpO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5sYW5nRGF0YSA9IGRlcHJlY2F0ZSgnbW9tZW50LmxhbmdEYXRhIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb21lbnQubG9jYWxlRGF0YSBpbnN0ZWFkLicsIGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUpO1xuXG4gICAgdmFyIG1hdGhBYnMgPSBNYXRoLmFicztcblxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2Fic19fYWJzICgpIHtcbiAgICAgICAgdmFyIGRhdGEgICAgICAgICAgID0gdGhpcy5fZGF0YTtcblxuICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgPSBtYXRoQWJzKHRoaXMuX21pbGxpc2Vjb25kcyk7XG4gICAgICAgIHRoaXMuX2RheXMgICAgICAgICA9IG1hdGhBYnModGhpcy5fZGF5cyk7XG4gICAgICAgIHRoaXMuX21vbnRocyAgICAgICA9IG1hdGhBYnModGhpcy5fbW9udGhzKTtcblxuICAgICAgICBkYXRhLm1pbGxpc2Vjb25kcyAgPSBtYXRoQWJzKGRhdGEubWlsbGlzZWNvbmRzKTtcbiAgICAgICAgZGF0YS5zZWNvbmRzICAgICAgID0gbWF0aEFicyhkYXRhLnNlY29uZHMpO1xuICAgICAgICBkYXRhLm1pbnV0ZXMgICAgICAgPSBtYXRoQWJzKGRhdGEubWludXRlcyk7XG4gICAgICAgIGRhdGEuaG91cnMgICAgICAgICA9IG1hdGhBYnMoZGF0YS5ob3Vycyk7XG4gICAgICAgIGRhdGEubW9udGhzICAgICAgICA9IG1hdGhBYnMoZGF0YS5tb250aHMpO1xuICAgICAgICBkYXRhLnllYXJzICAgICAgICAgPSBtYXRoQWJzKGRhdGEueWVhcnMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fYWRkU3VidHJhY3QgKGR1cmF0aW9uLCBpbnB1dCwgdmFsdWUsIGRpcmVjdGlvbikge1xuICAgICAgICB2YXIgb3RoZXIgPSBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uKGlucHV0LCB2YWx1ZSk7XG5cbiAgICAgICAgZHVyYXRpb24uX21pbGxpc2Vjb25kcyArPSBkaXJlY3Rpb24gKiBvdGhlci5fbWlsbGlzZWNvbmRzO1xuICAgICAgICBkdXJhdGlvbi5fZGF5cyAgICAgICAgICs9IGRpcmVjdGlvbiAqIG90aGVyLl9kYXlzO1xuICAgICAgICBkdXJhdGlvbi5fbW9udGhzICAgICAgICs9IGRpcmVjdGlvbiAqIG90aGVyLl9tb250aHM7XG5cbiAgICAgICAgcmV0dXJuIGR1cmF0aW9uLl9idWJibGUoKTtcbiAgICB9XG5cbiAgICAvLyBzdXBwb3J0cyBvbmx5IDIuMC1zdHlsZSBhZGQoMSwgJ3MnKSBvciBhZGQoZHVyYXRpb24pXG4gICAgZnVuY3Rpb24gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19hZGQgKGlucHV0LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19hZGRTdWJ0cmFjdCh0aGlzLCBpbnB1dCwgdmFsdWUsIDEpO1xuICAgIH1cblxuICAgIC8vIHN1cHBvcnRzIG9ubHkgMi4wLXN0eWxlIHN1YnRyYWN0KDEsICdzJykgb3Igc3VidHJhY3QoZHVyYXRpb24pXG4gICAgZnVuY3Rpb24gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19zdWJ0cmFjdCAoaW5wdXQsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBkdXJhdGlvbl9hZGRfc3VidHJhY3RfX2FkZFN1YnRyYWN0KHRoaXMsIGlucHV0LCB2YWx1ZSwgLTEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJ1YmJsZSAoKSB7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSB0aGlzLl9taWxsaXNlY29uZHM7XG4gICAgICAgIHZhciBkYXlzICAgICAgICAgPSB0aGlzLl9kYXlzO1xuICAgICAgICB2YXIgbW9udGhzICAgICAgID0gdGhpcy5fbW9udGhzO1xuICAgICAgICB2YXIgZGF0YSAgICAgICAgID0gdGhpcy5fZGF0YTtcbiAgICAgICAgdmFyIHNlY29uZHMsIG1pbnV0ZXMsIGhvdXJzLCB5ZWFycyA9IDA7XG5cbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBjb2RlIGJ1YmJsZXMgdXAgdmFsdWVzLCBzZWUgdGhlIHRlc3RzIGZvclxuICAgICAgICAvLyBleGFtcGxlcyBvZiB3aGF0IHRoYXQgbWVhbnMuXG4gICAgICAgIGRhdGEubWlsbGlzZWNvbmRzID0gbWlsbGlzZWNvbmRzICUgMTAwMDtcblxuICAgICAgICBzZWNvbmRzICAgICAgICAgICA9IGFic0Zsb29yKG1pbGxpc2Vjb25kcyAvIDEwMDApO1xuICAgICAgICBkYXRhLnNlY29uZHMgICAgICA9IHNlY29uZHMgJSA2MDtcblxuICAgICAgICBtaW51dGVzICAgICAgICAgICA9IGFic0Zsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgICAgIGRhdGEubWludXRlcyAgICAgID0gbWludXRlcyAlIDYwO1xuXG4gICAgICAgIGhvdXJzICAgICAgICAgICAgID0gYWJzRmxvb3IobWludXRlcyAvIDYwKTtcbiAgICAgICAgZGF0YS5ob3VycyAgICAgICAgPSBob3VycyAlIDI0O1xuXG4gICAgICAgIGRheXMgKz0gYWJzRmxvb3IoaG91cnMgLyAyNCk7XG5cbiAgICAgICAgLy8gQWNjdXJhdGVseSBjb252ZXJ0IGRheXMgdG8geWVhcnMsIGFzc3VtZSBzdGFydCBmcm9tIHllYXIgMC5cbiAgICAgICAgeWVhcnMgPSBhYnNGbG9vcihkYXlzVG9ZZWFycyhkYXlzKSk7XG4gICAgICAgIGRheXMgLT0gYWJzRmxvb3IoeWVhcnNUb0RheXMoeWVhcnMpKTtcblxuICAgICAgICAvLyAzMCBkYXlzIHRvIGEgbW9udGhcbiAgICAgICAgLy8gVE9ETyAoaXNrcmVuKTogVXNlIGFuY2hvciBkYXRlIChsaWtlIDFzdCBKYW4pIHRvIGNvbXB1dGUgdGhpcy5cbiAgICAgICAgbW9udGhzICs9IGFic0Zsb29yKGRheXMgLyAzMCk7XG4gICAgICAgIGRheXMgICAlPSAzMDtcblxuICAgICAgICAvLyAxMiBtb250aHMgLT4gMSB5ZWFyXG4gICAgICAgIHllYXJzICArPSBhYnNGbG9vcihtb250aHMgLyAxMik7XG4gICAgICAgIG1vbnRocyAlPSAxMjtcblxuICAgICAgICBkYXRhLmRheXMgICA9IGRheXM7XG4gICAgICAgIGRhdGEubW9udGhzID0gbW9udGhzO1xuICAgICAgICBkYXRhLnllYXJzICA9IHllYXJzO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheXNUb1llYXJzIChkYXlzKSB7XG4gICAgICAgIC8vIDQwMCB5ZWFycyBoYXZlIDE0NjA5NyBkYXlzICh0YWtpbmcgaW50byBhY2NvdW50IGxlYXAgeWVhciBydWxlcylcbiAgICAgICAgcmV0dXJuIGRheXMgKiA0MDAgLyAxNDYwOTc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24geWVhcnNUb0RheXMgKHllYXJzKSB7XG4gICAgICAgIC8vIHllYXJzICogMzY1ICsgYWJzRmxvb3IoeWVhcnMgLyA0KSAtXG4gICAgICAgIC8vICAgICBhYnNGbG9vcih5ZWFycyAvIDEwMCkgKyBhYnNGbG9vcih5ZWFycyAvIDQwMCk7XG4gICAgICAgIHJldHVybiB5ZWFycyAqIDE0NjA5NyAvIDQwMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcyAodW5pdHMpIHtcbiAgICAgICAgdmFyIGRheXM7XG4gICAgICAgIHZhciBtb250aHM7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSB0aGlzLl9taWxsaXNlY29uZHM7XG5cbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG5cbiAgICAgICAgaWYgKHVuaXRzID09PSAnbW9udGgnIHx8IHVuaXRzID09PSAneWVhcicpIHtcbiAgICAgICAgICAgIGRheXMgICA9IHRoaXMuX2RheXMgICArIG1pbGxpc2Vjb25kcyAvIDg2NGU1O1xuICAgICAgICAgICAgbW9udGhzID0gdGhpcy5fbW9udGhzICsgZGF5c1RvWWVhcnMoZGF5cykgKiAxMjtcbiAgICAgICAgICAgIHJldHVybiB1bml0cyA9PT0gJ21vbnRoJyA/IG1vbnRocyA6IG1vbnRocyAvIDEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaGFuZGxlIG1pbGxpc2Vjb25kcyBzZXBhcmF0ZWx5IGJlY2F1c2Ugb2YgZmxvYXRpbmcgcG9pbnQgbWF0aCBlcnJvcnMgKGlzc3VlICMxODY3KVxuICAgICAgICAgICAgZGF5cyA9IHRoaXMuX2RheXMgKyBNYXRoLnJvdW5kKHllYXJzVG9EYXlzKHRoaXMuX21vbnRocyAvIDEyKSk7XG4gICAgICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnd2VlaycgICA6IHJldHVybiBkYXlzIC8gNyAgICAgICAgICAgICsgbWlsbGlzZWNvbmRzIC8gNjA0OGU1O1xuICAgICAgICAgICAgICAgIGNhc2UgJ2RheScgICAgOiByZXR1cm4gZGF5cyAgICAgICAgICAgICAgICArIG1pbGxpc2Vjb25kcyAvIDg2NGU1O1xuICAgICAgICAgICAgICAgIGNhc2UgJ2hvdXInICAgOiByZXR1cm4gZGF5cyAqIDI0ICAgICAgICAgICArIG1pbGxpc2Vjb25kcyAvIDM2ZTU7XG4gICAgICAgICAgICAgICAgY2FzZSAnbWludXRlJyA6IHJldHVybiBkYXlzICogMjQgKiA2MCAgICAgICsgbWlsbGlzZWNvbmRzIC8gNmU0O1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NlY29uZCcgOiByZXR1cm4gZGF5cyAqIDI0ICogNjAgKiA2MCArIG1pbGxpc2Vjb25kcyAvIDEwMDA7XG4gICAgICAgICAgICAgICAgLy8gTWF0aC5mbG9vciBwcmV2ZW50cyBmbG9hdGluZyBwb2ludCBtYXRoIGVycm9ycyBoZXJlXG4gICAgICAgICAgICAgICAgY2FzZSAnbWlsbGlzZWNvbmQnOiByZXR1cm4gTWF0aC5mbG9vcihkYXlzICogMjQgKiA2MCAqIDYwICogMTAwMCkgKyBtaWxsaXNlY29uZHM7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHVuaXQgJyArIHVuaXRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRPRE86IFVzZSB0aGlzLmFzKCdtcycpP1xuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2FzX192YWx1ZU9mICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyArXG4gICAgICAgICAgICB0aGlzLl9kYXlzICogODY0ZTUgK1xuICAgICAgICAgICAgKHRoaXMuX21vbnRocyAlIDEyKSAqIDI1OTJlNiArXG4gICAgICAgICAgICB0b0ludCh0aGlzLl9tb250aHMgLyAxMikgKiAzMTUzNmU2XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUFzIChhbGlhcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXMoYWxpYXMpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBhc01pbGxpc2Vjb25kcyA9IG1ha2VBcygnbXMnKTtcbiAgICB2YXIgYXNTZWNvbmRzICAgICAgPSBtYWtlQXMoJ3MnKTtcbiAgICB2YXIgYXNNaW51dGVzICAgICAgPSBtYWtlQXMoJ20nKTtcbiAgICB2YXIgYXNIb3VycyAgICAgICAgPSBtYWtlQXMoJ2gnKTtcbiAgICB2YXIgYXNEYXlzICAgICAgICAgPSBtYWtlQXMoJ2QnKTtcbiAgICB2YXIgYXNXZWVrcyAgICAgICAgPSBtYWtlQXMoJ3cnKTtcbiAgICB2YXIgYXNNb250aHMgICAgICAgPSBtYWtlQXMoJ00nKTtcbiAgICB2YXIgYXNZZWFycyAgICAgICAgPSBtYWtlQXMoJ3knKTtcblxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2dldF9fZ2V0ICh1bml0cykge1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXNbdW5pdHMgKyAncyddKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUdldHRlcihuYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtuYW1lXTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgZHVyYXRpb25fZ2V0X19taWxsaXNlY29uZHMgPSBtYWtlR2V0dGVyKCdtaWxsaXNlY29uZHMnKTtcbiAgICB2YXIgc2Vjb25kcyAgICAgID0gbWFrZUdldHRlcignc2Vjb25kcycpO1xuICAgIHZhciBtaW51dGVzICAgICAgPSBtYWtlR2V0dGVyKCdtaW51dGVzJyk7XG4gICAgdmFyIGhvdXJzICAgICAgICA9IG1ha2VHZXR0ZXIoJ2hvdXJzJyk7XG4gICAgdmFyIGRheXMgICAgICAgICA9IG1ha2VHZXR0ZXIoJ2RheXMnKTtcbiAgICB2YXIgbW9udGhzICAgICAgID0gbWFrZUdldHRlcignbW9udGhzJyk7XG4gICAgdmFyIHllYXJzICAgICAgICA9IG1ha2VHZXR0ZXIoJ3llYXJzJyk7XG5cbiAgICBmdW5jdGlvbiB3ZWVrcyAoKSB7XG4gICAgICAgIHJldHVybiBhYnNGbG9vcih0aGlzLmRheXMoKSAvIDcpO1xuICAgIH1cblxuICAgIHZhciByb3VuZCA9IE1hdGgucm91bmQ7XG4gICAgdmFyIHRocmVzaG9sZHMgPSB7XG4gICAgICAgIHM6IDQ1LCAgLy8gc2Vjb25kcyB0byBtaW51dGVcbiAgICAgICAgbTogNDUsICAvLyBtaW51dGVzIHRvIGhvdXJcbiAgICAgICAgaDogMjIsICAvLyBob3VycyB0byBkYXlcbiAgICAgICAgZDogMjYsICAvLyBkYXlzIHRvIG1vbnRoXG4gICAgICAgIE06IDExICAgLy8gbW9udGhzIHRvIHllYXJcbiAgICB9O1xuXG4gICAgLy8gaGVscGVyIGZ1bmN0aW9uIGZvciBtb21lbnQuZm4uZnJvbSwgbW9tZW50LmZuLmZyb21Ob3csIGFuZCBtb21lbnQuZHVyYXRpb24uZm4uaHVtYW5pemVcbiAgICBmdW5jdGlvbiBzdWJzdGl0dXRlVGltZUFnbyhzdHJpbmcsIG51bWJlciwgd2l0aG91dFN1ZmZpeCwgaXNGdXR1cmUsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLnJlbGF0aXZlVGltZShudW1iZXIgfHwgMSwgISF3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9odW1hbml6ZV9fcmVsYXRpdmVUaW1lIChwb3NOZWdEdXJhdGlvbiwgd2l0aG91dFN1ZmZpeCwgbG9jYWxlKSB7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24ocG9zTmVnRHVyYXRpb24pLmFicygpO1xuICAgICAgICB2YXIgc2Vjb25kcyAgPSByb3VuZChkdXJhdGlvbi5hcygncycpKTtcbiAgICAgICAgdmFyIG1pbnV0ZXMgID0gcm91bmQoZHVyYXRpb24uYXMoJ20nKSk7XG4gICAgICAgIHZhciBob3VycyAgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdoJykpO1xuICAgICAgICB2YXIgZGF5cyAgICAgPSByb3VuZChkdXJhdGlvbi5hcygnZCcpKTtcbiAgICAgICAgdmFyIG1vbnRocyAgID0gcm91bmQoZHVyYXRpb24uYXMoJ00nKSk7XG4gICAgICAgIHZhciB5ZWFycyAgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCd5JykpO1xuXG4gICAgICAgIHZhciBhID0gc2Vjb25kcyA8IHRocmVzaG9sZHMucyAmJiBbJ3MnLCBzZWNvbmRzXSAgfHxcbiAgICAgICAgICAgICAgICBtaW51dGVzID09PSAxICAgICAgICAgICYmIFsnbSddICAgICAgICAgICB8fFxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPCB0aHJlc2hvbGRzLm0gJiYgWydtbScsIG1pbnV0ZXNdIHx8XG4gICAgICAgICAgICAgICAgaG91cnMgICA9PT0gMSAgICAgICAgICAmJiBbJ2gnXSAgICAgICAgICAgfHxcbiAgICAgICAgICAgICAgICBob3VycyAgIDwgdGhyZXNob2xkcy5oICYmIFsnaGgnLCBob3Vyc10gICB8fFxuICAgICAgICAgICAgICAgIGRheXMgICAgPT09IDEgICAgICAgICAgJiYgWydkJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICAgICAgZGF5cyAgICA8IHRocmVzaG9sZHMuZCAmJiBbJ2RkJywgZGF5c10gICAgfHxcbiAgICAgICAgICAgICAgICBtb250aHMgID09PSAxICAgICAgICAgICYmIFsnTSddICAgICAgICAgICB8fFxuICAgICAgICAgICAgICAgIG1vbnRocyAgPCB0aHJlc2hvbGRzLk0gJiYgWydNTScsIG1vbnRoc10gIHx8XG4gICAgICAgICAgICAgICAgeWVhcnMgICA9PT0gMSAgICAgICAgICAmJiBbJ3knXSAgICAgICAgICAgfHwgWyd5eScsIHllYXJzXTtcblxuICAgICAgICBhWzJdID0gd2l0aG91dFN1ZmZpeDtcbiAgICAgICAgYVszXSA9ICtwb3NOZWdEdXJhdGlvbiA+IDA7XG4gICAgICAgIGFbNF0gPSBsb2NhbGU7XG4gICAgICAgIHJldHVybiBzdWJzdGl0dXRlVGltZUFnby5hcHBseShudWxsLCBhKTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGFsbG93cyB5b3UgdG8gc2V0IGEgdGhyZXNob2xkIGZvciByZWxhdGl2ZSB0aW1lIHN0cmluZ3NcbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9odW1hbml6ZV9fZ2V0U2V0UmVsYXRpdmVUaW1lVGhyZXNob2xkICh0aHJlc2hvbGQsIGxpbWl0KSB7XG4gICAgICAgIGlmICh0aHJlc2hvbGRzW3RocmVzaG9sZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaW1pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhyZXNob2xkc1t0aHJlc2hvbGRdO1xuICAgICAgICB9XG4gICAgICAgIHRocmVzaG9sZHNbdGhyZXNob2xkXSA9IGxpbWl0O1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBodW1hbml6ZSAod2l0aFN1ZmZpeCkge1xuICAgICAgICB2YXIgbG9jYWxlID0gdGhpcy5sb2NhbGVEYXRhKCk7XG4gICAgICAgIHZhciBvdXRwdXQgPSBkdXJhdGlvbl9odW1hbml6ZV9fcmVsYXRpdmVUaW1lKHRoaXMsICF3aXRoU3VmZml4LCBsb2NhbGUpO1xuXG4gICAgICAgIGlmICh3aXRoU3VmZml4KSB7XG4gICAgICAgICAgICBvdXRwdXQgPSBsb2NhbGUucGFzdEZ1dHVyZSgrdGhpcywgb3V0cHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsb2NhbGUucG9zdGZvcm1hdChvdXRwdXQpO1xuICAgIH1cblxuICAgIHZhciBpc29fc3RyaW5nX19hYnMgPSBNYXRoLmFicztcblxuICAgIGZ1bmN0aW9uIGlzb19zdHJpbmdfX3RvSVNPU3RyaW5nKCkge1xuICAgICAgICAvLyBpbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vZG9yZGlsbGUvbW9tZW50LWlzb2R1cmF0aW9uL2Jsb2IvbWFzdGVyL21vbWVudC5pc29kdXJhdGlvbi5qc1xuICAgICAgICB2YXIgWSA9IGlzb19zdHJpbmdfX2Ficyh0aGlzLnllYXJzKCkpO1xuICAgICAgICB2YXIgTSA9IGlzb19zdHJpbmdfX2Ficyh0aGlzLm1vbnRocygpKTtcbiAgICAgICAgdmFyIEQgPSBpc29fc3RyaW5nX19hYnModGhpcy5kYXlzKCkpO1xuICAgICAgICB2YXIgaCA9IGlzb19zdHJpbmdfX2Ficyh0aGlzLmhvdXJzKCkpO1xuICAgICAgICB2YXIgbSA9IGlzb19zdHJpbmdfX2Ficyh0aGlzLm1pbnV0ZXMoKSk7XG4gICAgICAgIHZhciBzID0gaXNvX3N0cmluZ19fYWJzKHRoaXMuc2Vjb25kcygpICsgdGhpcy5taWxsaXNlY29uZHMoKSAvIDEwMDApO1xuICAgICAgICB2YXIgdG90YWwgPSB0aGlzLmFzU2Vjb25kcygpO1xuXG4gICAgICAgIGlmICghdG90YWwpIHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIHNhbWUgYXMgQyMncyAoTm9kYSkgYW5kIHB5dGhvbiAoaXNvZGF0ZSkuLi5cbiAgICAgICAgICAgIC8vIGJ1dCBub3Qgb3RoZXIgSlMgKGdvb2cuZGF0ZSlcbiAgICAgICAgICAgIHJldHVybiAnUDBEJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAodG90YWwgPCAwID8gJy0nIDogJycpICtcbiAgICAgICAgICAgICdQJyArXG4gICAgICAgICAgICAoWSA/IFkgKyAnWScgOiAnJykgK1xuICAgICAgICAgICAgKE0gPyBNICsgJ00nIDogJycpICtcbiAgICAgICAgICAgIChEID8gRCArICdEJyA6ICcnKSArXG4gICAgICAgICAgICAoKGggfHwgbSB8fCBzKSA/ICdUJyA6ICcnKSArXG4gICAgICAgICAgICAoaCA/IGggKyAnSCcgOiAnJykgK1xuICAgICAgICAgICAgKG0gPyBtICsgJ00nIDogJycpICtcbiAgICAgICAgICAgIChzID8gcyArICdTJyA6ICcnKTtcbiAgICB9XG5cbiAgICB2YXIgZHVyYXRpb25fcHJvdG90eXBlX19wcm90byA9IER1cmF0aW9uLnByb3RvdHlwZTtcblxuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYWJzICAgICAgICAgICAgPSBkdXJhdGlvbl9hYnNfX2FicztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFkZCAgICAgICAgICAgID0gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19hZGQ7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5zdWJ0cmFjdCAgICAgICA9IGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fc3VidHJhY3Q7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hcyAgICAgICAgICAgICA9IGFzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNNaWxsaXNlY29uZHMgPSBhc01pbGxpc2Vjb25kcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzU2Vjb25kcyAgICAgID0gYXNTZWNvbmRzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNNaW51dGVzICAgICAgPSBhc01pbnV0ZXM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc0hvdXJzICAgICAgICA9IGFzSG91cnM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc0RheXMgICAgICAgICA9IGFzRGF5cztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzV2Vla3MgICAgICAgID0gYXNXZWVrcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzTW9udGhzICAgICAgID0gYXNNb250aHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc1llYXJzICAgICAgICA9IGFzWWVhcnM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by52YWx1ZU9mICAgICAgICA9IGR1cmF0aW9uX2FzX192YWx1ZU9mO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uX2J1YmJsZSAgICAgICAgPSBidWJibGU7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5nZXQgICAgICAgICAgICA9IGR1cmF0aW9uX2dldF9fZ2V0O1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ubWlsbGlzZWNvbmRzICAgPSBkdXJhdGlvbl9nZXRfX21pbGxpc2Vjb25kcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnNlY29uZHMgICAgICAgID0gc2Vjb25kcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLm1pbnV0ZXMgICAgICAgID0gbWludXRlcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmhvdXJzICAgICAgICAgID0gaG91cnM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5kYXlzICAgICAgICAgICA9IGRheXM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by53ZWVrcyAgICAgICAgICA9IHdlZWtzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ubW9udGhzICAgICAgICAgPSBtb250aHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by55ZWFycyAgICAgICAgICA9IHllYXJzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uaHVtYW5pemUgICAgICAgPSBodW1hbml6ZTtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnRvSVNPU3RyaW5nICAgID0gaXNvX3N0cmluZ19fdG9JU09TdHJpbmc7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by50b1N0cmluZyAgICAgICA9IGlzb19zdHJpbmdfX3RvSVNPU3RyaW5nO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8udG9KU09OICAgICAgICAgPSBpc29fc3RyaW5nX190b0lTT1N0cmluZztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmxvY2FsZSAgICAgICAgID0gbG9jYWxlO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ubG9jYWxlRGF0YSAgICAgPSBsb2NhbGVEYXRhO1xuXG4gICAgLy8gRGVwcmVjYXRpb25zXG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by50b0lzb1N0cmluZyA9IGRlcHJlY2F0ZSgndG9Jc29TdHJpbmcoKSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIHRvSVNPU3RyaW5nKCkgaW5zdGVhZCAobm90aWNlIHRoZSBjYXBpdGFscyknLCBpc29fc3RyaW5nX190b0lTT1N0cmluZyk7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5sYW5nID0gbGFuZztcblxuICAgIC8vIFNpZGUgZWZmZWN0IGltcG9ydHNcblxuICAgIGFkZEZvcm1hdFRva2VuKCdYJywgMCwgMCwgJ3VuaXgnKTtcbiAgICBhZGRGb3JtYXRUb2tlbigneCcsIDAsIDAsICd2YWx1ZU9mJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCd4JywgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1gnLCBtYXRjaFRpbWVzdGFtcCk7XG4gICAgYWRkUGFyc2VUb2tlbignWCcsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShwYXJzZUZsb2F0KGlucHV0LCAxMCkgKiAxMDAwKTtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKCd4JywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKHRvSW50KGlucHV0KSk7XG4gICAgfSk7XG5cbiAgICAvLyBTaWRlIGVmZmVjdCBpbXBvcnRzXG5cblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy52ZXJzaW9uID0gJzIuMTAuMic7XG5cbiAgICBzZXRIb29rQ2FsbGJhY2sobG9jYWxfX2NyZWF0ZUxvY2FsKTtcblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5mbiAgICAgICAgICAgICAgICAgICAgPSBtb21lbnRQcm90b3R5cGU7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLm1pbiAgICAgICAgICAgICAgICAgICA9IG1pbjtcbiAgICB1dGlsc19ob29rc19faG9va3MubWF4ICAgICAgICAgICAgICAgICAgID0gbWF4O1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy51dGMgICAgICAgICAgICAgICAgICAgPSBjcmVhdGVfdXRjX19jcmVhdGVVVEM7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnVuaXggICAgICAgICAgICAgICAgICA9IG1vbWVudF9fY3JlYXRlVW5peDtcbiAgICB1dGlsc19ob29rc19faG9va3MubW9udGhzICAgICAgICAgICAgICAgID0gbGlzdHNfX2xpc3RNb250aHM7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmlzRGF0ZSAgICAgICAgICAgICAgICA9IGlzRGF0ZTtcbiAgICB1dGlsc19ob29rc19faG9va3MubG9jYWxlICAgICAgICAgICAgICAgID0gbG9jYWxlX2xvY2FsZXNfX2dldFNldEdsb2JhbExvY2FsZTtcbiAgICB1dGlsc19ob29rc19faG9va3MuaW52YWxpZCAgICAgICAgICAgICAgID0gdmFsaWRfX2NyZWF0ZUludmFsaWQ7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmR1cmF0aW9uICAgICAgICAgICAgICA9IGNyZWF0ZV9fY3JlYXRlRHVyYXRpb247XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmlzTW9tZW50ICAgICAgICAgICAgICA9IGlzTW9tZW50O1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy53ZWVrZGF5cyAgICAgICAgICAgICAgPSBsaXN0c19fbGlzdFdlZWtkYXlzO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5wYXJzZVpvbmUgICAgICAgICAgICAgPSBtb21lbnRfX2NyZWF0ZUluWm9uZTtcbiAgICB1dGlsc19ob29rc19faG9va3MubG9jYWxlRGF0YSAgICAgICAgICAgID0gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZTtcbiAgICB1dGlsc19ob29rc19faG9va3MuaXNEdXJhdGlvbiAgICAgICAgICAgID0gaXNEdXJhdGlvbjtcbiAgICB1dGlsc19ob29rc19faG9va3MubW9udGhzU2hvcnQgICAgICAgICAgID0gbGlzdHNfX2xpc3RNb250aHNTaG9ydDtcbiAgICB1dGlsc19ob29rc19faG9va3Mud2Vla2RheXNNaW4gICAgICAgICAgID0gbGlzdHNfX2xpc3RXZWVrZGF5c01pbjtcbiAgICB1dGlsc19ob29rc19faG9va3MuZGVmaW5lTG9jYWxlICAgICAgICAgID0gZGVmaW5lTG9jYWxlO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy53ZWVrZGF5c1Nob3J0ICAgICAgICAgPSBsaXN0c19fbGlzdFdlZWtkYXlzU2hvcnQ7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLm5vcm1hbGl6ZVVuaXRzICAgICAgICA9IG5vcm1hbGl6ZVVuaXRzO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5yZWxhdGl2ZVRpbWVUaHJlc2hvbGQgPSBkdXJhdGlvbl9odW1hbml6ZV9fZ2V0U2V0UmVsYXRpdmVUaW1lVGhyZXNob2xkO1xuXG4gICAgdmFyIF9tb21lbnQgPSB1dGlsc19ob29rc19faG9va3M7XG5cbiAgICByZXR1cm4gX21vbWVudDtcblxufSkpOyIsIiAgLyogZ2xvYmFscyByZXF1aXJlLCBtb2R1bGUgKi9cblxuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gICAqL1xuXG4gIHZhciBwYXRodG9SZWdleHAgPSByZXF1aXJlKCdwYXRoLXRvLXJlZ2V4cCcpO1xuXG4gIC8qKlxuICAgKiBNb2R1bGUgZXhwb3J0cy5cbiAgICovXG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuXG4gIC8qKlxuICAgKiBEZXRlY3QgY2xpY2sgZXZlbnRcbiAgICovXG4gIHZhciBjbGlja0V2ZW50ID0gZG9jdW1lbnQub250b3VjaHN0YXJ0ID8gJ3RvdWNoc3RhcnQnIDogJ2NsaWNrJztcblxuICAvKipcbiAgICogVG8gd29yayBwcm9wZXJseSB3aXRoIHRoZSBVUkxcbiAgICogaGlzdG9yeS5sb2NhdGlvbiBnZW5lcmF0ZWQgcG9seWZpbGwgaW4gaHR0cHM6Ly9naXRodWIuY29tL2Rldm90ZS9IVE1MNS1IaXN0b3J5LUFQSVxuICAgKi9cblxuICB2YXIgbG9jYXRpb24gPSAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiB3aW5kb3cpICYmICh3aW5kb3cuaGlzdG9yeS5sb2NhdGlvbiB8fCB3aW5kb3cubG9jYXRpb24pO1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtIGluaXRpYWwgZGlzcGF0Y2guXG4gICAqL1xuXG4gIHZhciBkaXNwYXRjaCA9IHRydWU7XG5cblxuICAvKipcbiAgICogRGVjb2RlIFVSTCBjb21wb25lbnRzIChxdWVyeSBzdHJpbmcsIHBhdGhuYW1lLCBoYXNoKS5cbiAgICogQWNjb21tb2RhdGVzIGJvdGggcmVndWxhciBwZXJjZW50IGVuY29kaW5nIGFuZCB4LXd3dy1mb3JtLXVybGVuY29kZWQgZm9ybWF0LlxuICAgKi9cbiAgdmFyIGRlY29kZVVSTENvbXBvbmVudHMgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBCYXNlIHBhdGguXG4gICAqL1xuXG4gIHZhciBiYXNlID0gJyc7XG5cbiAgLyoqXG4gICAqIFJ1bm5pbmcgZmxhZy5cbiAgICovXG5cbiAgdmFyIHJ1bm5pbmc7XG5cbiAgLyoqXG4gICAqIEhhc2hCYW5nIG9wdGlvblxuICAgKi9cblxuICB2YXIgaGFzaGJhbmcgPSBmYWxzZTtcblxuICAvKipcbiAgICogUHJldmlvdXMgY29udGV4dCwgZm9yIGNhcHR1cmluZ1xuICAgKiBwYWdlIGV4aXQgZXZlbnRzLlxuICAgKi9cblxuICB2YXIgcHJldkNvbnRleHQ7XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGBwYXRoYCB3aXRoIGNhbGxiYWNrIGBmbigpYCxcbiAgICogb3Igcm91dGUgYHBhdGhgLCBvciByZWRpcmVjdGlvbixcbiAgICogb3IgYHBhZ2Uuc3RhcnQoKWAuXG4gICAqXG4gICAqICAgcGFnZShmbik7XG4gICAqICAgcGFnZSgnKicsIGZuKTtcbiAgICogICBwYWdlKCcvdXNlci86aWQnLCBsb2FkLCB1c2VyKTtcbiAgICogICBwYWdlKCcvdXNlci8nICsgdXNlci5pZCwgeyBzb21lOiAndGhpbmcnIH0pO1xuICAgKiAgIHBhZ2UoJy91c2VyLycgKyB1c2VyLmlkKTtcbiAgICogICBwYWdlKCcvZnJvbScsICcvdG8nKVxuICAgKiAgIHBhZ2UoKTtcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IHBhdGhcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4uLi5cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgZnVuY3Rpb24gcGFnZShwYXRoLCBmbikge1xuICAgIC8vIDxjYWxsYmFjaz5cbiAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIHBhdGgpIHtcbiAgICAgIHJldHVybiBwYWdlKCcqJywgcGF0aCk7XG4gICAgfVxuXG4gICAgLy8gcm91dGUgPHBhdGg+IHRvIDxjYWxsYmFjayAuLi4+XG4gICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBmbikge1xuICAgICAgdmFyIHJvdXRlID0gbmV3IFJvdXRlKHBhdGgpO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgcGFnZS5jYWxsYmFja3MucHVzaChyb3V0ZS5taWRkbGV3YXJlKGFyZ3VtZW50c1tpXSkpO1xuICAgICAgfVxuICAgICAgLy8gc2hvdyA8cGF0aD4gd2l0aCBbc3RhdGVdXG4gICAgfSBlbHNlIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIHBhdGgpIHtcbiAgICAgIHBhZ2VbJ3N0cmluZycgPT09IHR5cGVvZiBmbiA/ICdyZWRpcmVjdCcgOiAnc2hvdyddKHBhdGgsIGZuKTtcbiAgICAgIC8vIHN0YXJ0IFtvcHRpb25zXVxuICAgIH0gZWxzZSB7XG4gICAgICBwYWdlLnN0YXJ0KHBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmdW5jdGlvbnMuXG4gICAqL1xuXG4gIHBhZ2UuY2FsbGJhY2tzID0gW107XG4gIHBhZ2UuZXhpdHMgPSBbXTtcblxuICAvKipcbiAgICogQ3VycmVudCBwYXRoIGJlaW5nIHByb2Nlc3NlZFxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgcGFnZS5jdXJyZW50ID0gJyc7XG5cbiAgLyoqXG4gICAqIE51bWJlciBvZiBwYWdlcyBuYXZpZ2F0ZWQgdG8uXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqXG4gICAqICAgICBwYWdlLmxlbiA9PSAwO1xuICAgKiAgICAgcGFnZSgnL2xvZ2luJyk7XG4gICAqICAgICBwYWdlLmxlbiA9PSAxO1xuICAgKi9cblxuICBwYWdlLmxlbiA9IDA7XG5cbiAgLyoqXG4gICAqIEdldCBvciBzZXQgYmFzZXBhdGggdG8gYHBhdGhgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLmJhc2UgPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgaWYgKDAgPT09IGFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBiYXNlO1xuICAgIGJhc2UgPSBwYXRoO1xuICB9O1xuXG4gIC8qKlxuICAgKiBCaW5kIHdpdGggdGhlIGdpdmVuIGBvcHRpb25zYC5cbiAgICpcbiAgICogT3B0aW9uczpcbiAgICpcbiAgICogICAgLSBgY2xpY2tgIGJpbmQgdG8gY2xpY2sgZXZlbnRzIFt0cnVlXVxuICAgKiAgICAtIGBwb3BzdGF0ZWAgYmluZCB0byBwb3BzdGF0ZSBbdHJ1ZV1cbiAgICogICAgLSBgZGlzcGF0Y2hgIHBlcmZvcm0gaW5pdGlhbCBkaXNwYXRjaCBbdHJ1ZV1cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5zdGFydCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAocnVubmluZykgcmV0dXJuO1xuICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgIGlmIChmYWxzZSA9PT0gb3B0aW9ucy5kaXNwYXRjaCkgZGlzcGF0Y2ggPSBmYWxzZTtcbiAgICBpZiAoZmFsc2UgPT09IG9wdGlvbnMuZGVjb2RlVVJMQ29tcG9uZW50cykgZGVjb2RlVVJMQ29tcG9uZW50cyA9IGZhbHNlO1xuICAgIGlmIChmYWxzZSAhPT0gb3B0aW9ucy5wb3BzdGF0ZSkgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgb25wb3BzdGF0ZSwgZmFsc2UpO1xuICAgIGlmIChmYWxzZSAhPT0gb3B0aW9ucy5jbGljaykge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoY2xpY2tFdmVudCwgb25jbGljaywgZmFsc2UpO1xuICAgIH1cbiAgICBpZiAodHJ1ZSA9PT0gb3B0aW9ucy5oYXNoYmFuZykgaGFzaGJhbmcgPSB0cnVlO1xuICAgIGlmICghZGlzcGF0Y2gpIHJldHVybjtcbiAgICB2YXIgdXJsID0gKGhhc2hiYW5nICYmIH5sb2NhdGlvbi5oYXNoLmluZGV4T2YoJyMhJykpID8gbG9jYXRpb24uaGFzaC5zdWJzdHIoMikgKyBsb2NhdGlvbi5zZWFyY2ggOiBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCArIGxvY2F0aW9uLmhhc2g7XG4gICAgcGFnZS5yZXBsYWNlKHVybCwgbnVsbCwgdHJ1ZSwgZGlzcGF0Y2gpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBVbmJpbmQgY2xpY2sgYW5kIHBvcHN0YXRlIGV2ZW50IGhhbmRsZXJzLlxuICAgKlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLnN0b3AgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXJ1bm5pbmcpIHJldHVybjtcbiAgICBwYWdlLmN1cnJlbnQgPSAnJztcbiAgICBwYWdlLmxlbiA9IDA7XG4gICAgcnVubmluZyA9IGZhbHNlO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGNsaWNrRXZlbnQsIG9uY2xpY2ssIGZhbHNlKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvbnBvcHN0YXRlLCBmYWxzZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNob3cgYHBhdGhgIHdpdGggb3B0aW9uYWwgYHN0YXRlYCBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGRpc3BhdGNoXG4gICAqIEByZXR1cm4ge0NvbnRleHR9XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2Uuc2hvdyA9IGZ1bmN0aW9uKHBhdGgsIHN0YXRlLCBkaXNwYXRjaCwgcHVzaCkge1xuICAgIHZhciBjdHggPSBuZXcgQ29udGV4dChwYXRoLCBzdGF0ZSk7XG4gICAgcGFnZS5jdXJyZW50ID0gY3R4LnBhdGg7XG4gICAgaWYgKGZhbHNlICE9PSBkaXNwYXRjaCkgcGFnZS5kaXNwYXRjaChjdHgpO1xuICAgIGlmIChmYWxzZSAhPT0gY3R4LmhhbmRsZWQgJiYgZmFsc2UgIT09IHB1c2gpIGN0eC5wdXNoU3RhdGUoKTtcbiAgICByZXR1cm4gY3R4O1xuICB9O1xuXG4gIC8qKlxuICAgKiBHb2VzIGJhY2sgaW4gdGhlIGhpc3RvcnlcbiAgICogQmFjayBzaG91bGQgYWx3YXlzIGxldCB0aGUgY3VycmVudCByb3V0ZSBwdXNoIHN0YXRlIGFuZCB0aGVuIGdvIGJhY2suXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIC0gZmFsbGJhY2sgcGF0aCB0byBnbyBiYWNrIGlmIG5vIG1vcmUgaGlzdG9yeSBleGlzdHMsIGlmIHVuZGVmaW5lZCBkZWZhdWx0cyB0byBwYWdlLmJhc2VcbiAgICogQHBhcmFtIHtPYmplY3R9IFtzdGF0ZV1cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5iYWNrID0gZnVuY3Rpb24ocGF0aCwgc3RhdGUpIHtcbiAgICBpZiAocGFnZS5sZW4gPiAwKSB7XG4gICAgICAvLyB0aGlzIG1heSBuZWVkIG1vcmUgdGVzdGluZyB0byBzZWUgaWYgYWxsIGJyb3dzZXJzXG4gICAgICAvLyB3YWl0IGZvciB0aGUgbmV4dCB0aWNrIHRvIGdvIGJhY2sgaW4gaGlzdG9yeVxuICAgICAgaGlzdG9yeS5iYWNrKCk7XG4gICAgICBwYWdlLmxlbi0tO1xuICAgIH0gZWxzZSBpZiAocGF0aCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcGFnZS5zaG93KHBhdGgsIHN0YXRlKTtcbiAgICAgIH0pO1xuICAgIH1lbHNle1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcGFnZS5zaG93KGJhc2UsIHN0YXRlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciByb3V0ZSB0byByZWRpcmVjdCBmcm9tIG9uZSBwYXRoIHRvIG90aGVyXG4gICAqIG9yIGp1c3QgcmVkaXJlY3QgdG8gYW5vdGhlciByb3V0ZVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZnJvbSAtIGlmIHBhcmFtICd0bycgaXMgdW5kZWZpbmVkIHJlZGlyZWN0cyB0byAnZnJvbSdcbiAgICogQHBhcmFtIHtTdHJpbmd9IFt0b11cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG4gIHBhZ2UucmVkaXJlY3QgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICAgIC8vIERlZmluZSByb3V0ZSBmcm9tIGEgcGF0aCB0byBhbm90aGVyXG4gICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgZnJvbSAmJiAnc3RyaW5nJyA9PT0gdHlwZW9mIHRvKSB7XG4gICAgICBwYWdlKGZyb20sIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBwYWdlLnJlcGxhY2UodG8pO1xuICAgICAgICB9LCAwKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFdhaXQgZm9yIHRoZSBwdXNoIHN0YXRlIGFuZCByZXBsYWNlIGl0IHdpdGggYW5vdGhlclxuICAgIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIGZyb20gJiYgJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiB0bykge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcGFnZS5yZXBsYWNlKGZyb20pO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGBwYXRoYCB3aXRoIG9wdGlvbmFsIGBzdGF0ZWAgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAgICogQHJldHVybiB7Q29udGV4dH1cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cblxuICBwYWdlLnJlcGxhY2UgPSBmdW5jdGlvbihwYXRoLCBzdGF0ZSwgaW5pdCwgZGlzcGF0Y2gpIHtcbiAgICB2YXIgY3R4ID0gbmV3IENvbnRleHQocGF0aCwgc3RhdGUpO1xuICAgIHBhZ2UuY3VycmVudCA9IGN0eC5wYXRoO1xuICAgIGN0eC5pbml0ID0gaW5pdDtcbiAgICBjdHguc2F2ZSgpOyAvLyBzYXZlIGJlZm9yZSBkaXNwYXRjaGluZywgd2hpY2ggbWF5IHJlZGlyZWN0XG4gICAgaWYgKGZhbHNlICE9PSBkaXNwYXRjaCkgcGFnZS5kaXNwYXRjaChjdHgpO1xuICAgIHJldHVybiBjdHg7XG4gIH07XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIHRoZSBnaXZlbiBgY3R4YC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGN0eFxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgcGFnZS5kaXNwYXRjaCA9IGZ1bmN0aW9uKGN0eCkge1xuICAgIHZhciBwcmV2ID0gcHJldkNvbnRleHQsXG4gICAgICBpID0gMCxcbiAgICAgIGogPSAwO1xuXG4gICAgcHJldkNvbnRleHQgPSBjdHg7XG5cbiAgICBmdW5jdGlvbiBuZXh0RXhpdCgpIHtcbiAgICAgIHZhciBmbiA9IHBhZ2UuZXhpdHNbaisrXTtcbiAgICAgIGlmICghZm4pIHJldHVybiBuZXh0RW50ZXIoKTtcbiAgICAgIGZuKHByZXYsIG5leHRFeGl0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBuZXh0RW50ZXIoKSB7XG4gICAgICB2YXIgZm4gPSBwYWdlLmNhbGxiYWNrc1tpKytdO1xuXG4gICAgICBpZiAoY3R4LnBhdGggIT09IHBhZ2UuY3VycmVudCkge1xuICAgICAgICBjdHguaGFuZGxlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWZuKSByZXR1cm4gdW5oYW5kbGVkKGN0eCk7XG4gICAgICBmbihjdHgsIG5leHRFbnRlcik7XG4gICAgfVxuXG4gICAgaWYgKHByZXYpIHtcbiAgICAgIG5leHRFeGl0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHRFbnRlcigpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogVW5oYW5kbGVkIGBjdHhgLiBXaGVuIGl0J3Mgbm90IHRoZSBpbml0aWFsXG4gICAqIHBvcHN0YXRlIHRoZW4gcmVkaXJlY3QuIElmIHlvdSB3aXNoIHRvIGhhbmRsZVxuICAgKiA0MDRzIG9uIHlvdXIgb3duIHVzZSBgcGFnZSgnKicsIGNhbGxiYWNrKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7Q29udGV4dH0gY3R4XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBmdW5jdGlvbiB1bmhhbmRsZWQoY3R4KSB7XG4gICAgaWYgKGN0eC5oYW5kbGVkKSByZXR1cm47XG4gICAgdmFyIGN1cnJlbnQ7XG5cbiAgICBpZiAoaGFzaGJhbmcpIHtcbiAgICAgIGN1cnJlbnQgPSBiYXNlICsgbG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjIScsICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudCA9IGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoO1xuICAgIH1cblxuICAgIGlmIChjdXJyZW50ID09PSBjdHguY2Fub25pY2FsUGF0aCkgcmV0dXJuO1xuICAgIHBhZ2Uuc3RvcCgpO1xuICAgIGN0eC5oYW5kbGVkID0gZmFsc2U7XG4gICAgbG9jYXRpb24uaHJlZiA9IGN0eC5jYW5vbmljYWxQYXRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGFuIGV4aXQgcm91dGUgb24gYHBhdGhgIHdpdGhcbiAgICogY2FsbGJhY2sgYGZuKClgLCB3aGljaCB3aWxsIGJlIGNhbGxlZFxuICAgKiBvbiB0aGUgcHJldmlvdXMgY29udGV4dCB3aGVuIGEgbmV3XG4gICAqIHBhZ2UgaXMgdmlzaXRlZC5cbiAgICovXG4gIHBhZ2UuZXhpdCA9IGZ1bmN0aW9uKHBhdGgsIGZuKSB7XG4gICAgaWYgKHR5cGVvZiBwYXRoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gcGFnZS5leGl0KCcqJywgcGF0aCk7XG4gICAgfVxuXG4gICAgdmFyIHJvdXRlID0gbmV3IFJvdXRlKHBhdGgpO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICBwYWdlLmV4aXRzLnB1c2gocm91dGUubWlkZGxld2FyZShhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBVUkwgZW5jb2RpbmcgZnJvbSB0aGUgZ2l2ZW4gYHN0cmAuXG4gICAqIEFjY29tbW9kYXRlcyB3aGl0ZXNwYWNlIGluIGJvdGggeC13d3ctZm9ybS11cmxlbmNvZGVkXG4gICAqIGFuZCByZWd1bGFyIHBlcmNlbnQtZW5jb2RlZCBmb3JtLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cn0gVVJMIGNvbXBvbmVudCB0byBkZWNvZGVcbiAgICovXG4gIGZ1bmN0aW9uIGRlY29kZVVSTEVuY29kZWRVUklDb21wb25lbnQodmFsKSB7XG4gICAgaWYgKHR5cGVvZiB2YWwgIT09ICdzdHJpbmcnKSB7IHJldHVybiB2YWw7IH1cbiAgICByZXR1cm4gZGVjb2RlVVJMQ29tcG9uZW50cyA/IGRlY29kZVVSSUNvbXBvbmVudCh2YWwucmVwbGFjZSgvXFwrL2csICcgJykpIDogdmFsO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgYSBuZXcgXCJyZXF1ZXN0XCIgYENvbnRleHRgXG4gICAqIHdpdGggdGhlIGdpdmVuIGBwYXRoYCBhbmQgb3B0aW9uYWwgaW5pdGlhbCBgc3RhdGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgZnVuY3Rpb24gQ29udGV4dChwYXRoLCBzdGF0ZSkge1xuICAgIGlmICgnLycgPT09IHBhdGhbMF0gJiYgMCAhPT0gcGF0aC5pbmRleE9mKGJhc2UpKSBwYXRoID0gYmFzZSArIChoYXNoYmFuZyA/ICcjIScgOiAnJykgKyBwYXRoO1xuICAgIHZhciBpID0gcGF0aC5pbmRleE9mKCc/Jyk7XG5cbiAgICB0aGlzLmNhbm9uaWNhbFBhdGggPSBwYXRoO1xuICAgIHRoaXMucGF0aCA9IHBhdGgucmVwbGFjZShiYXNlLCAnJykgfHwgJy8nO1xuICAgIGlmIChoYXNoYmFuZykgdGhpcy5wYXRoID0gdGhpcy5wYXRoLnJlcGxhY2UoJyMhJywgJycpIHx8ICcvJztcblxuICAgIHRoaXMudGl0bGUgPSBkb2N1bWVudC50aXRsZTtcbiAgICB0aGlzLnN0YXRlID0gc3RhdGUgfHwge307XG4gICAgdGhpcy5zdGF0ZS5wYXRoID0gcGF0aDtcbiAgICB0aGlzLnF1ZXJ5c3RyaW5nID0gfmkgPyBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KHBhdGguc2xpY2UoaSArIDEpKSA6ICcnO1xuICAgIHRoaXMucGF0aG5hbWUgPSBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KH5pID8gcGF0aC5zbGljZSgwLCBpKSA6IHBhdGgpO1xuICAgIHRoaXMucGFyYW1zID0ge307XG5cbiAgICAvLyBmcmFnbWVudFxuICAgIHRoaXMuaGFzaCA9ICcnO1xuICAgIGlmICghaGFzaGJhbmcpIHtcbiAgICAgIGlmICghfnRoaXMucGF0aC5pbmRleE9mKCcjJykpIHJldHVybjtcbiAgICAgIHZhciBwYXJ0cyA9IHRoaXMucGF0aC5zcGxpdCgnIycpO1xuICAgICAgdGhpcy5wYXRoID0gcGFydHNbMF07XG4gICAgICB0aGlzLmhhc2ggPSBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KHBhcnRzWzFdKSB8fCAnJztcbiAgICAgIHRoaXMucXVlcnlzdHJpbmcgPSB0aGlzLnF1ZXJ5c3RyaW5nLnNwbGl0KCcjJylbMF07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBgQ29udGV4dGAuXG4gICAqL1xuXG4gIHBhZ2UuQ29udGV4dCA9IENvbnRleHQ7XG5cbiAgLyoqXG4gICAqIFB1c2ggc3RhdGUuXG4gICAqXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBDb250ZXh0LnByb3RvdHlwZS5wdXNoU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBwYWdlLmxlbisrO1xuICAgIGhpc3RvcnkucHVzaFN0YXRlKHRoaXMuc3RhdGUsIHRoaXMudGl0bGUsIGhhc2hiYW5nICYmIHRoaXMucGF0aCAhPT0gJy8nID8gJyMhJyArIHRoaXMucGF0aCA6IHRoaXMuY2Fub25pY2FsUGF0aCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNhdmUgdGhlIGNvbnRleHQgc3RhdGUuXG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIENvbnRleHQucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSh0aGlzLnN0YXRlLCB0aGlzLnRpdGxlLCBoYXNoYmFuZyAmJiB0aGlzLnBhdGggIT09ICcvJyA/ICcjIScgKyB0aGlzLnBhdGggOiB0aGlzLmNhbm9uaWNhbFBhdGgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGBSb3V0ZWAgd2l0aCB0aGUgZ2l2ZW4gSFRUUCBgcGF0aGAsXG4gICAqIGFuZCBhbiBhcnJheSBvZiBgY2FsbGJhY2tzYCBhbmQgYG9wdGlvbnNgLlxuICAgKlxuICAgKiBPcHRpb25zOlxuICAgKlxuICAgKiAgIC0gYHNlbnNpdGl2ZWAgICAgZW5hYmxlIGNhc2Utc2Vuc2l0aXZlIHJvdXRlc1xuICAgKiAgIC0gYHN0cmljdGAgICAgICAgZW5hYmxlIHN0cmljdCBtYXRjaGluZyBmb3IgdHJhaWxpbmcgc2xhc2hlc1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5cbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIFJvdXRlKHBhdGgsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnBhdGggPSAocGF0aCA9PT0gJyonKSA/ICcoLiopJyA6IHBhdGg7XG4gICAgdGhpcy5tZXRob2QgPSAnR0VUJztcbiAgICB0aGlzLnJlZ2V4cCA9IHBhdGh0b1JlZ2V4cCh0aGlzLnBhdGgsXG4gICAgICB0aGlzLmtleXMgPSBbXSxcbiAgICAgIG9wdGlvbnMuc2Vuc2l0aXZlLFxuICAgICAgb3B0aW9ucy5zdHJpY3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBgUm91dGVgLlxuICAgKi9cblxuICBwYWdlLlJvdXRlID0gUm91dGU7XG5cbiAgLyoqXG4gICAqIFJldHVybiByb3V0ZSBtaWRkbGV3YXJlIHdpdGhcbiAgICogdGhlIGdpdmVuIGNhbGxiYWNrIGBmbigpYC5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5taWRkbGV3YXJlID0gZnVuY3Rpb24oZm4pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGN0eCwgbmV4dCkge1xuICAgICAgaWYgKHNlbGYubWF0Y2goY3R4LnBhdGgsIGN0eC5wYXJhbXMpKSByZXR1cm4gZm4oY3R4LCBuZXh0KTtcbiAgICAgIG5leHQoKTtcbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGlzIHJvdXRlIG1hdGNoZXMgYHBhdGhgLCBpZiBzb1xuICAgKiBwb3B1bGF0ZSBgcGFyYW1zYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24ocGF0aCwgcGFyYW1zKSB7XG4gICAgdmFyIGtleXMgPSB0aGlzLmtleXMsXG4gICAgICBxc0luZGV4ID0gcGF0aC5pbmRleE9mKCc/JyksXG4gICAgICBwYXRobmFtZSA9IH5xc0luZGV4ID8gcGF0aC5zbGljZSgwLCBxc0luZGV4KSA6IHBhdGgsXG4gICAgICBtID0gdGhpcy5yZWdleHAuZXhlYyhkZWNvZGVVUklDb21wb25lbnQocGF0aG5hbWUpKTtcblxuICAgIGlmICghbSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yICh2YXIgaSA9IDEsIGxlbiA9IG0ubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2kgLSAxXTtcbiAgICAgIHZhciB2YWwgPSBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KG1baV0pO1xuICAgICAgaWYgKHZhbCAhPT0gdW5kZWZpbmVkIHx8ICEoaGFzT3duUHJvcGVydHkuY2FsbChwYXJhbXMsIGtleS5uYW1lKSkpIHtcbiAgICAgICAgcGFyYW1zW2tleS5uYW1lXSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBIYW5kbGUgXCJwb3B1bGF0ZVwiIGV2ZW50cy5cbiAgICovXG5cbiAgdmFyIG9ucG9wc3RhdGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8vIHRoaXMgaGFjayByZXNvbHZlcyBodHRwczovL2dpdGh1Yi5jb20vdmlzaW9ubWVkaWEvcGFnZS5qcy9pc3N1ZXMvMjEzXG4gICAgdmFyIGxvYWRlZCA9IGZhbHNlO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBsb2FkZWQgPSB0cnVlO1xuICAgICAgfSwgMCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIG9ucG9wc3RhdGUoZSkge1xuICAgICAgaWYgKCFsb2FkZWQpIHJldHVybjtcbiAgICAgIGlmIChlLnN0YXRlKSB7XG4gICAgICAgIHZhciBwYXRoID0gZS5zdGF0ZS5wYXRoO1xuICAgICAgICBwYWdlLnJlcGxhY2UocGF0aCwgZS5zdGF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYWdlLnNob3cobG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5oYXNoLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZmFsc2UpO1xuICAgICAgfVxuICAgIH07XG4gIH0pKCk7XG4gIC8qKlxuICAgKiBIYW5kbGUgXCJjbGlja1wiIGV2ZW50cy5cbiAgICovXG5cbiAgZnVuY3Rpb24gb25jbGljayhlKSB7XG5cbiAgICBpZiAoMSAhPT0gd2hpY2goZSkpIHJldHVybjtcblxuICAgIGlmIChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5IHx8IGUuc2hpZnRLZXkpIHJldHVybjtcbiAgICBpZiAoZS5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XG5cblxuXG4gICAgLy8gZW5zdXJlIGxpbmtcbiAgICB2YXIgZWwgPSBlLnRhcmdldDtcbiAgICB3aGlsZSAoZWwgJiYgJ0EnICE9PSBlbC5ub2RlTmFtZSkgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgIGlmICghZWwgfHwgJ0EnICE9PSBlbC5ub2RlTmFtZSkgcmV0dXJuO1xuXG5cblxuICAgIC8vIElnbm9yZSBpZiB0YWcgaGFzXG4gICAgLy8gMS4gXCJkb3dubG9hZFwiIGF0dHJpYnV0ZVxuICAgIC8vIDIuIHJlbD1cImV4dGVybmFsXCIgYXR0cmlidXRlXG4gICAgaWYgKGVsLmhhc0F0dHJpYnV0ZSgnZG93bmxvYWQnKSB8fCBlbC5nZXRBdHRyaWJ1dGUoJ3JlbCcpID09PSAnZXh0ZXJuYWwnKSByZXR1cm47XG5cbiAgICAvLyBlbnN1cmUgbm9uLWhhc2ggZm9yIHRoZSBzYW1lIHBhdGhcbiAgICB2YXIgbGluayA9IGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuICAgIGlmICghaGFzaGJhbmcgJiYgZWwucGF0aG5hbWUgPT09IGxvY2F0aW9uLnBhdGhuYW1lICYmIChlbC5oYXNoIHx8ICcjJyA9PT0gbGluaykpIHJldHVybjtcblxuXG5cbiAgICAvLyBDaGVjayBmb3IgbWFpbHRvOiBpbiB0aGUgaHJlZlxuICAgIGlmIChsaW5rICYmIGxpbmsuaW5kZXhPZignbWFpbHRvOicpID4gLTEpIHJldHVybjtcblxuICAgIC8vIGNoZWNrIHRhcmdldFxuICAgIGlmIChlbC50YXJnZXQpIHJldHVybjtcblxuICAgIC8vIHgtb3JpZ2luXG4gICAgaWYgKCFzYW1lT3JpZ2luKGVsLmhyZWYpKSByZXR1cm47XG5cblxuXG4gICAgLy8gcmVidWlsZCBwYXRoXG4gICAgdmFyIHBhdGggPSBlbC5wYXRobmFtZSArIGVsLnNlYXJjaCArIChlbC5oYXNoIHx8ICcnKTtcblxuICAgIC8vIHN0cmlwIGxlYWRpbmcgXCIvW2RyaXZlIGxldHRlcl06XCIgb24gTlcuanMgb24gV2luZG93c1xuICAgIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcGF0aC5tYXRjaCgvXlxcL1thLXpBLVpdOlxcLy8pKSB7XG4gICAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9eXFwvW2EtekEtWl06XFwvLywgJy8nKTtcbiAgICB9XG5cbiAgICAvLyBzYW1lIHBhZ2VcbiAgICB2YXIgb3JpZyA9IHBhdGg7XG5cbiAgICBpZiAocGF0aC5pbmRleE9mKGJhc2UpID09PSAwKSB7XG4gICAgICBwYXRoID0gcGF0aC5zdWJzdHIoYmFzZS5sZW5ndGgpO1xuICAgIH1cblxuICAgIGlmIChoYXNoYmFuZykgcGF0aCA9IHBhdGgucmVwbGFjZSgnIyEnLCAnJyk7XG5cbiAgICBpZiAoYmFzZSAmJiBvcmlnID09PSBwYXRoKSByZXR1cm47XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgcGFnZS5zaG93KG9yaWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV2ZW50IGJ1dHRvbi5cbiAgICovXG5cbiAgZnVuY3Rpb24gd2hpY2goZSkge1xuICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgICByZXR1cm4gbnVsbCA9PT0gZS53aGljaCA/IGUuYnV0dG9uIDogZS53aGljaDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBgaHJlZmAgaXMgdGhlIHNhbWUgb3JpZ2luLlxuICAgKi9cblxuICBmdW5jdGlvbiBzYW1lT3JpZ2luKGhyZWYpIHtcbiAgICB2YXIgb3JpZ2luID0gbG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgbG9jYXRpb24uaG9zdG5hbWU7XG4gICAgaWYgKGxvY2F0aW9uLnBvcnQpIG9yaWdpbiArPSAnOicgKyBsb2NhdGlvbi5wb3J0O1xuICAgIHJldHVybiAoaHJlZiAmJiAoMCA9PT0gaHJlZi5pbmRleE9mKG9yaWdpbikpKTtcbiAgfVxuXG4gIHBhZ2Uuc2FtZU9yaWdpbiA9IHNhbWVPcmlnaW47XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKTtcblxuLyoqXG4gKiBFeHBvc2UgYHBhdGhUb1JlZ2V4cGAuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gcGF0aFRvUmVnZXhwO1xuXG4vKipcbiAqIFRoZSBtYWluIHBhdGggbWF0Y2hpbmcgcmVnZXhwIHV0aWxpdHkuXG4gKlxuICogQHR5cGUge1JlZ0V4cH1cbiAqL1xudmFyIFBBVEhfUkVHRVhQID0gbmV3IFJlZ0V4cChbXG4gIC8vIE1hdGNoIGVzY2FwZWQgY2hhcmFjdGVycyB0aGF0IHdvdWxkIG90aGVyd2lzZSBhcHBlYXIgaW4gZnV0dXJlIG1hdGNoZXMuXG4gIC8vIFRoaXMgYWxsb3dzIHRoZSB1c2VyIHRvIGVzY2FwZSBzcGVjaWFsIGNoYXJhY3RlcnMgdGhhdCB3b24ndCB0cmFuc2Zvcm0uXG4gICcoXFxcXFxcXFwuKScsXG4gIC8vIE1hdGNoIEV4cHJlc3Mtc3R5bGUgcGFyYW1ldGVycyBhbmQgdW4tbmFtZWQgcGFyYW1ldGVycyB3aXRoIGEgcHJlZml4XG4gIC8vIGFuZCBvcHRpb25hbCBzdWZmaXhlcy4gTWF0Y2hlcyBhcHBlYXIgYXM6XG4gIC8vXG4gIC8vIFwiLzp0ZXN0KFxcXFxkKyk/XCIgPT4gW1wiL1wiLCBcInRlc3RcIiwgXCJcXGQrXCIsIHVuZGVmaW5lZCwgXCI/XCJdXG4gIC8vIFwiL3JvdXRlKFxcXFxkKylcIiA9PiBbdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgXCJcXGQrXCIsIHVuZGVmaW5lZF1cbiAgJyhbXFxcXC8uXSk/KD86XFxcXDooXFxcXHcrKSg/OlxcXFwoKCg/OlxcXFxcXFxcLnxbXildKSopXFxcXCkpP3xcXFxcKCgoPzpcXFxcXFxcXC58W14pXSkqKVxcXFwpKShbKyo/XSk/JyxcbiAgLy8gTWF0Y2ggcmVnZXhwIHNwZWNpYWwgY2hhcmFjdGVycyB0aGF0IGFyZSBhbHdheXMgZXNjYXBlZC5cbiAgJyhbLisqPz1eIToke30oKVtcXFxcXXxcXFxcL10pJ1xuXS5qb2luKCd8JyksICdnJyk7XG5cbi8qKlxuICogRXNjYXBlIHRoZSBjYXB0dXJpbmcgZ3JvdXAgYnkgZXNjYXBpbmcgc3BlY2lhbCBjaGFyYWN0ZXJzIGFuZCBtZWFuaW5nLlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gZ3JvdXBcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZXNjYXBlR3JvdXAgKGdyb3VwKSB7XG4gIHJldHVybiBncm91cC5yZXBsYWNlKC8oWz0hOiRcXC8oKV0pL2csICdcXFxcJDEnKTtcbn1cblxuLyoqXG4gKiBBdHRhY2ggdGhlIGtleXMgYXMgYSBwcm9wZXJ0eSBvZiB0aGUgcmVnZXhwLlxuICpcbiAqIEBwYXJhbSAge1JlZ0V4cH0gcmVcbiAqIEBwYXJhbSAge0FycmF5fSAga2V5c1xuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5mdW5jdGlvbiBhdHRhY2hLZXlzIChyZSwga2V5cykge1xuICByZS5rZXlzID0ga2V5cztcbiAgcmV0dXJuIHJlO1xufVxuXG4vKipcbiAqIEdldCB0aGUgZmxhZ3MgZm9yIGEgcmVnZXhwIGZyb20gdGhlIG9wdGlvbnMuXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGZsYWdzIChvcHRpb25zKSB7XG4gIHJldHVybiBvcHRpb25zLnNlbnNpdGl2ZSA/ICcnIDogJ2knO1xufVxuXG4vKipcbiAqIFB1bGwgb3V0IGtleXMgZnJvbSBhIHJlZ2V4cC5cbiAqXG4gKiBAcGFyYW0gIHtSZWdFeHB9IHBhdGhcbiAqIEBwYXJhbSAge0FycmF5fSAga2V5c1xuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5mdW5jdGlvbiByZWdleHBUb1JlZ2V4cCAocGF0aCwga2V5cykge1xuICAvLyBVc2UgYSBuZWdhdGl2ZSBsb29rYWhlYWQgdG8gbWF0Y2ggb25seSBjYXB0dXJpbmcgZ3JvdXBzLlxuICB2YXIgZ3JvdXBzID0gcGF0aC5zb3VyY2UubWF0Y2goL1xcKCg/IVxcPykvZyk7XG5cbiAgaWYgKGdyb3Vwcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXlzLnB1c2goe1xuICAgICAgICBuYW1lOiAgICAgIGksXG4gICAgICAgIGRlbGltaXRlcjogbnVsbCxcbiAgICAgICAgb3B0aW9uYWw6ICBmYWxzZSxcbiAgICAgICAgcmVwZWF0OiAgICBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGF0dGFjaEtleXMocGF0aCwga2V5cyk7XG59XG5cbi8qKlxuICogVHJhbnNmb3JtIGFuIGFycmF5IGludG8gYSByZWdleHAuXG4gKlxuICogQHBhcmFtICB7QXJyYXl9ICBwYXRoXG4gKiBAcGFyYW0gIHtBcnJheX0gIGtleXNcbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5mdW5jdGlvbiBhcnJheVRvUmVnZXhwIChwYXRoLCBrZXlzLCBvcHRpb25zKSB7XG4gIHZhciBwYXJ0cyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aC5sZW5ndGg7IGkrKykge1xuICAgIHBhcnRzLnB1c2gocGF0aFRvUmVnZXhwKHBhdGhbaV0sIGtleXMsIG9wdGlvbnMpLnNvdXJjZSk7XG4gIH1cblxuICB2YXIgcmVnZXhwID0gbmV3IFJlZ0V4cCgnKD86JyArIHBhcnRzLmpvaW4oJ3wnKSArICcpJywgZmxhZ3Mob3B0aW9ucykpO1xuICByZXR1cm4gYXR0YWNoS2V5cyhyZWdleHAsIGtleXMpO1xufVxuXG4vKipcbiAqIFJlcGxhY2UgdGhlIHNwZWNpZmljIHRhZ3Mgd2l0aCByZWdleHAgc3RyaW5ncy5cbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSAge0FycmF5fSAga2V5c1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiByZXBsYWNlUGF0aCAocGF0aCwga2V5cykge1xuICB2YXIgaW5kZXggPSAwO1xuXG4gIGZ1bmN0aW9uIHJlcGxhY2UgKF8sIGVzY2FwZWQsIHByZWZpeCwga2V5LCBjYXB0dXJlLCBncm91cCwgc3VmZml4LCBlc2NhcGUpIHtcbiAgICBpZiAoZXNjYXBlZCkge1xuICAgICAgcmV0dXJuIGVzY2FwZWQ7XG4gICAgfVxuXG4gICAgaWYgKGVzY2FwZSkge1xuICAgICAgcmV0dXJuICdcXFxcJyArIGVzY2FwZTtcbiAgICB9XG5cbiAgICB2YXIgcmVwZWF0ICAgPSBzdWZmaXggPT09ICcrJyB8fCBzdWZmaXggPT09ICcqJztcbiAgICB2YXIgb3B0aW9uYWwgPSBzdWZmaXggPT09ICc/JyB8fCBzdWZmaXggPT09ICcqJztcblxuICAgIGtleXMucHVzaCh7XG4gICAgICBuYW1lOiAgICAgIGtleSB8fCBpbmRleCsrLFxuICAgICAgZGVsaW1pdGVyOiBwcmVmaXggfHwgJy8nLFxuICAgICAgb3B0aW9uYWw6ICBvcHRpb25hbCxcbiAgICAgIHJlcGVhdDogICAgcmVwZWF0XG4gICAgfSk7XG5cbiAgICBwcmVmaXggPSBwcmVmaXggPyAoJ1xcXFwnICsgcHJlZml4KSA6ICcnO1xuICAgIGNhcHR1cmUgPSBlc2NhcGVHcm91cChjYXB0dXJlIHx8IGdyb3VwIHx8ICdbXicgKyAocHJlZml4IHx8ICdcXFxcLycpICsgJ10rPycpO1xuXG4gICAgaWYgKHJlcGVhdCkge1xuICAgICAgY2FwdHVyZSA9IGNhcHR1cmUgKyAnKD86JyArIHByZWZpeCArIGNhcHR1cmUgKyAnKSonO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25hbCkge1xuICAgICAgcmV0dXJuICcoPzonICsgcHJlZml4ICsgJygnICsgY2FwdHVyZSArICcpKT8nO1xuICAgIH1cblxuICAgIC8vIEJhc2ljIHBhcmFtZXRlciBzdXBwb3J0LlxuICAgIHJldHVybiBwcmVmaXggKyAnKCcgKyBjYXB0dXJlICsgJyknO1xuICB9XG5cbiAgcmV0dXJuIHBhdGgucmVwbGFjZShQQVRIX1JFR0VYUCwgcmVwbGFjZSk7XG59XG5cbi8qKlxuICogTm9ybWFsaXplIHRoZSBnaXZlbiBwYXRoIHN0cmluZywgcmV0dXJuaW5nIGEgcmVndWxhciBleHByZXNzaW9uLlxuICpcbiAqIEFuIGVtcHR5IGFycmF5IGNhbiBiZSBwYXNzZWQgaW4gZm9yIHRoZSBrZXlzLCB3aGljaCB3aWxsIGhvbGQgdGhlXG4gKiBwbGFjZWhvbGRlciBrZXkgZGVzY3JpcHRpb25zLiBGb3IgZXhhbXBsZSwgdXNpbmcgYC91c2VyLzppZGAsIGBrZXlzYCB3aWxsXG4gKiBjb250YWluIGBbeyBuYW1lOiAnaWQnLCBkZWxpbWl0ZXI6ICcvJywgb3B0aW9uYWw6IGZhbHNlLCByZXBlYXQ6IGZhbHNlIH1dYC5cbiAqXG4gKiBAcGFyYW0gIHsoU3RyaW5nfFJlZ0V4cHxBcnJheSl9IHBhdGhcbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICAgICAgICAgICAgW2tleXNdXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgICAgICAgIFtvcHRpb25zXVxuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5mdW5jdGlvbiBwYXRoVG9SZWdleHAgKHBhdGgsIGtleXMsIG9wdGlvbnMpIHtcbiAga2V5cyA9IGtleXMgfHwgW107XG5cbiAgaWYgKCFpc0FycmF5KGtleXMpKSB7XG4gICAgb3B0aW9ucyA9IGtleXM7XG4gICAga2V5cyA9IFtdO1xuICB9IGVsc2UgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgaWYgKHBhdGggaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICByZXR1cm4gcmVnZXhwVG9SZWdleHAocGF0aCwga2V5cywgb3B0aW9ucyk7XG4gIH1cblxuICBpZiAoaXNBcnJheShwYXRoKSkge1xuICAgIHJldHVybiBhcnJheVRvUmVnZXhwKHBhdGgsIGtleXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgdmFyIHN0cmljdCA9IG9wdGlvbnMuc3RyaWN0O1xuICB2YXIgZW5kID0gb3B0aW9ucy5lbmQgIT09IGZhbHNlO1xuICB2YXIgcm91dGUgPSByZXBsYWNlUGF0aChwYXRoLCBrZXlzKTtcbiAgdmFyIGVuZHNXaXRoU2xhc2ggPSBwYXRoLmNoYXJBdChwYXRoLmxlbmd0aCAtIDEpID09PSAnLyc7XG5cbiAgLy8gSW4gbm9uLXN0cmljdCBtb2RlIHdlIGFsbG93IGEgc2xhc2ggYXQgdGhlIGVuZCBvZiBtYXRjaC4gSWYgdGhlIHBhdGggdG9cbiAgLy8gbWF0Y2ggYWxyZWFkeSBlbmRzIHdpdGggYSBzbGFzaCwgd2UgcmVtb3ZlIGl0IGZvciBjb25zaXN0ZW5jeS4gVGhlIHNsYXNoXG4gIC8vIGlzIHZhbGlkIGF0IHRoZSBlbmQgb2YgYSBwYXRoIG1hdGNoLCBub3QgaW4gdGhlIG1pZGRsZS4gVGhpcyBpcyBpbXBvcnRhbnRcbiAgLy8gaW4gbm9uLWVuZGluZyBtb2RlLCB3aGVyZSBcIi90ZXN0L1wiIHNob3VsZG4ndCBtYXRjaCBcIi90ZXN0Ly9yb3V0ZVwiLlxuICBpZiAoIXN0cmljdCkge1xuICAgIHJvdXRlID0gKGVuZHNXaXRoU2xhc2ggPyByb3V0ZS5zbGljZSgwLCAtMikgOiByb3V0ZSkgKyAnKD86XFxcXC8oPz0kKSk/JztcbiAgfVxuXG4gIGlmIChlbmQpIHtcbiAgICByb3V0ZSArPSAnJCc7XG4gIH0gZWxzZSB7XG4gICAgLy8gSW4gbm9uLWVuZGluZyBtb2RlLCB3ZSBuZWVkIHRoZSBjYXB0dXJpbmcgZ3JvdXBzIHRvIG1hdGNoIGFzIG11Y2ggYXNcbiAgICAvLyBwb3NzaWJsZSBieSB1c2luZyBhIHBvc2l0aXZlIGxvb2thaGVhZCB0byB0aGUgZW5kIG9yIG5leHQgcGF0aCBzZWdtZW50LlxuICAgIHJvdXRlICs9IHN0cmljdCAmJiBlbmRzV2l0aFNsYXNoID8gJycgOiAnKD89XFxcXC98JCknO1xuICB9XG5cbiAgcmV0dXJuIGF0dGFjaEtleXMobmV3IFJlZ0V4cCgnXicgKyByb3V0ZSwgZmxhZ3Mob3B0aW9ucykpLCBrZXlzKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoYXJyKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsImltcG9ydCBwYWdlIGZyb20gJ3BhZ2UnO1xuaW1wb3J0IHtGaWxlTm90Rm91bmRQYWdlfSBmcm9tIFwicGFnZXMvRmlsZU5vdEZvdW5kUGFnZS5qc3hcIjtcblxuLypcbiAqIEhhbmRsZXMgcm91dGluZyBwYWdlcyB3aXRoaW4gdGhlIGFwcGxpY2F0aW9uIHVzaW5nIHBhZ2UuanMuXG4gKi9cbmV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuICAgIGNvbnN0cnVjdG9yKG1vdW50UG9pbnRJZCkge1xuICAgICAgICAvKiBNb3VudCB0aGUgYXBwbGljYXRpb24gdG8gdGhlIGVsZW1lbnQgc3BlY2lmaWVkIGJ5IHRoZSBnaXZlbiBJRC4gKi9cbiAgICAgICAgdGhpcy5yb3V0ZXMgPSB7fTtcblxuICAgICAgICB3aW5kb3cuYXBwLm1vdW50UG9pbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChtb3VudFBvaW50SWQpO1xuICAgICAgICB0aGlzLm1vdW50UG9pbnQgPSB3aW5kb3cuYXBwLm1vdW50UG9pbnQ7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBBZGQgYSBtYXBwaW5nIGZyb20gcm91dGUgVVJMIHRvIEphdmFzY3JpcHQgY29udHJvbGxlci5cbiAgICAgKi9cbiAgICBhZGRSb3V0ZShyb3V0ZSwgY29udHJvbGxlcikge1xuICAgICAgICB0aGlzLnJvdXRlc1tyb3V0ZV0gPSBjb250cm9sbGVyO1xuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIC8qIFJlZ2lzdGVyIGVhY2ggb2YgdGhlIHJvdXRlcyB3aXRoIHBhZ2UuanMuICovXG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5yb3V0ZXMpIHtcbiAgICAgICAgICAgIHBhZ2UoaSwgdGhpcy5yb3V0ZXNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogSWYgYSBwYWdlIGlzIG5vdCBtYXRjaGVkIGJ5IHRoZSBleGlzdGluZyByb3V0ZXMsIGZhbGwgdGhyb3VnaFxuICAgICAgICAgKiB0byB0aGUgNDA0IG5vdCBmb3VuZCBwYWdlLlxuICAgICAgICAgKi9cbiAgICAgICAgcGFnZShcIipcIiwgZnVuY3Rpb24oY3R4LCBuZXh0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiNDA0XCIsIGN0eCwgbmV4dCk7XG4gICAgICAgICAgICBSZWFjdC5yZW5kZXIoPEZpbGVOb3RGb3VuZFBhZ2UgLz4sIHdpbmRvdy5hcHAubW91bnRQb2ludCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qIFN0YXJ0IHRoZSByb3V0ZXIuICovXG4gICAgICAgIHBhZ2UoKTtcbiAgICB9XG59XG4iLCIvKlxuICogQSBtb2RhbCBvYmplY3Qgd2hpY2ggaXMgcmVzcG9uc2libGUgZm9yIHZpZXdpbmcgYW5kIHVwYXRlaW5nIHRoZSBzZXR0aW5ncy5cbiAqL1xuZXhwb3J0IGNsYXNzIEFwcFNldHRpbmdzTW9kYWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIuY29uc3RydWN0b3IocHJvcHMpO1xuXG4gICAgICAgIC8qIFNldCB0aGUgZGVmYXVsdCBzdGF0ZS4gKi9cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIHNhdmVTZXR0aW5nc0luUHJvZ3Jlc3M6IGZhbHNlLFxuICAgICAgICAgICAgd2VpZ2h0OiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgZ2VuZGVyOiBcIm90aGVyXCIsXG4gICAgICAgICAgICBhZ2U6IDBcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgLyogQmluZCB0aGUgc2hvd24gZnVuY3Rpb24gdG8gdGhlIG1vZGFsIHNob3duIGV2ZW50LiAqL1xuICAgICAgICAkKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpKS5vbihcInNob3duLmJzLm1vZGFsXCIsIHRoaXMuc2hvd24uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBXaGVuIHRoZSBtb2RhbCBpcyBzaG93biwgcmV0cmlldmUgdGhlIGN1cnJlbnQgc2V0dGluZ3MgZnJvbSB0aGUgc2VydmVyXG4gICAgICogYW5kIHBvcHVsYXRlIHRoZSBmb3JtIGFwcHJvcHJpYXRlbHkuXG4gICAgICovXG4gICAgc2hvd24oZSkge1xuICAgICAgICAkLmdldChcIi9hcGkvc2V0dGluZ3NcIiwgZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgIT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGdlbmRlcjogcmVzdWx0LmdlbmRlcixcbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiByZXN1bHQud2VpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHJlc3VsdC5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIGFnZTogcmVzdWx0LmFnZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogSGFuZGxlcyB0aGUgc2F2aW5nIG9mIHRoZSBmb3JtIHZhbHVlcyB0byB0aGUgc2VydmVyLlxuICAgICAqL1xuICAgIGJlZ2luU2F2ZVNldHRpbmdzKCkge1xuXG4gICAgICAgIC8qIEluZGljYXRlIHRoYXQgdGhlIHNhdmUgaGFzIGJlZ3VuLCB0byBoaWRlIHRoZSBzYXZlIGJ1dHRvbi4gKi9cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c2F2ZVNldHRpbmdzSW5Qcm9ncmVzczogdHJ1ZX0pO1xuXG4gICAgICAgIC8qIENvbnN0cnVjdCB0aGUgcmVxdWVzdCBmcm9tIHRoZSBmb3JtIHZhbHVlcy4gKi9cbiAgICAgICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgICAgICAgIHdlaWdodDogdGhpcy5zdGF0ZS53ZWlnaHQsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUuaGVpZ2h0LFxuICAgICAgICAgICAgYWdlOiB0aGlzLnN0YXRlLmFnZSxcbiAgICAgICAgICAgIGdlbmRlcjogdGhpcy5zdGF0ZS5nZW5kZXJcbiAgICAgICAgfTtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBQb3N0IHRoZSB2YWx1ZXMgdG8gdGhlIHNlcnZlciB0byB1cGRhdGUgdGhlIHNldHRpbmdzLCBhbmQgaGlkZVxuICAgICAgICAgKiB0aGUgbW9kYWwuXG4gICAgICAgICAqL1xuICAgICAgICAkLnBvc3QoXCIvYXBpL3VwZGF0ZV9zZXR0aW5nc1wiLCBwYXJhbXMsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c2F2ZVNldHRpbmdzSW5Qcm9ncmVzczogZmFsc2V9KTtcblxuICAgICAgICAgICAgJChSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSkubW9kYWwoXCJoaWRlXCIpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogVXBkYXRlIHRoZSBzdG9yZWQgd2VpZ2h0IGluIHJlc3BvbnNlIHRvIHRoZSBmaWVsZCB1ZHBhdGluZy5cbiAgICAgKiBXZWlnaHQgaXMgc3RvcmVkIGluIGtpb2dyYW1zLlxuICAgICAqL1xuICAgIHdlaWdodENoYW5nZWQoZSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHt3ZWlnaHQ6IHBhcnNlSW50KGUudGFyZ2V0LnZhbHVlKX0pO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogVXBkYXRlIHRoZSBzdG9yZWQgaGVpZ2h0IGluIHJlc3BvbnNlIHRvIHRoZSBmaWVsZCB1ZHBhdGluZy5cbiAgICAgKiBIZWlnaHQgaXMgc3RvcmVkIGluIGNlbnRpbWV0ZXJzLlxuICAgICAqL1xuICAgIGhlaWdodENoYW5nZWQoZSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtoZWlnaHQ6IHBhcnNlSW50KGUudGFyZ2V0LnZhbHVlKX0pO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogVXBkYXRlIHRoZSBzdG9yZWQgZ2VuZGVyIGluIHJlc3BvbnNlIHRvIHRoZSBmaWVsZCB1ZHBhdGluZy5cbiAgICAgKiBHZW5kZXIgaXMgc3RvcmVkIGFzIGEgc3RyaW5nOiAnbWFsZScsICdmZW1hbGUnIG9yICdvdGhlcicuLlxuICAgICAqL1xuICAgIGdlbmRlckNoYW5nZWQoZSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtnZW5kZXI6IGUudGFyZ2V0LnZhbHVlfSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBVcGRhdGUgdGhlIHN0b3JlZCBhZ2UgaW4gcmVzcG9uc2UgdG8gdGhlIGZpZWxkIHVkcGF0aW5nLlxuICAgICAqIEhlaWdodCBpcyBzdG9yZWQgaW4geWVhcnMuXG4gICAgICovXG4gICAgYWdlQ2hhbmdlZChlKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2FnZTogcGFyc2VJbnQoZS50YXJnZXQudmFsdWUpfSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBDb25zdHJ1Y3QgdGhlIGZvcm0gdG8gYmUgZGlzcGxheWVkIGluIHRoZSBtb2RhbCwgZ2l2ZW4gdGhlIHBhcmFtZXRlcnMuXG4gICAgICovXG4gICAgZ2V0Rm9ybSgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvck5hbWU9XCJ3ZWlnaHRcIj5XZWlnaHQgKGtnKTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJ3ZWlnaHRcIiB2YWx1ZT17dGhpcy5zdGF0ZS53ZWlnaHR9IHR5cGU9XCJudW1iZXJcIiBvbkNoYW5nZT17dGhpcy53ZWlnaHRDaGFuZ2VkLmJpbmQodGhpcyl9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiPjwvaW5wdXQ+XG5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yTmFtZT1cImhlaWdodFwiPkhlaWdodCAoY20pPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImhlaWdodFwiIHZhbHVlPXt0aGlzLnN0YXRlLmhlaWdodH0gdHlwZT1cIm51bWJlclwiIG9uQ2hhbmdlPXt0aGlzLmhlaWdodENoYW5nZWQuYmluZCh0aGlzKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCI+PC9pbnB1dD5cblxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3JOYW1lPVwiYWdlXCI+QWdlICh5ZWFycyk8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwiYWdlXCIgdmFsdWU9e3RoaXMuc3RhdGUuYWdlfSB0eXBlPVwibnVtYmVyXCIgb25DaGFuZ2U9e3RoaXMuYWdlQ2hhbmdlZC5iaW5kKHRoaXMpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIj48L2lucHV0PlxuXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvck5hbWU9XCJnZW5kZXJcIj5HZW5kZXI8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdmFsdWU9e3RoaXMuc3RhdGUuZ2VuZGVyfSBvbkNoYW5nZT17dGhpcy5nZW5kZXJDaGFuZ2VkLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwibWFsZVwiPk1hbGU8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImZlbWFsZVwiPkZlbWFsZTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwib3RoZXJcIj5PdGhlcjwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuXG4gICAgICAgIC8qIENvbnN0cnVjdCB0aGUgY29udGVudCBvZiB0aGUgbW9kYWwuICovXG4gICAgICAgIHZhciBiZWZvcmVJbXBvcnRCb2R5ID0gW1xuICAgICAgICAgICAgPHA+UGxlYXNlIGNvbmZpZ3VyZSB0aGUgYXBwbGljYXRpb24gc2V0dGluZ3MsIHRoaXMgaW5mb3JtYXRpb24gaXMgdXNlZCB0byBjYWxjdWxhdGUgdGhlIGtpbG9qb3VsZXMgeW91IGJ1cm4gb24gZWFjaCBydW4uPC9wPixcbiAgICAgICAgICAgIHRoaXMuZ2V0Rm9ybSgpXG4gICAgICAgIF07XG5cbiAgICAgICAgdmFyIGJvZHkgPSBiZWZvcmVJbXBvcnRCb2R5O1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsIGZhZGVcIiBpZD1cInNldHRpbmdzX21vZGFsXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1kaWFsb2dcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJtb2RhbC10aXRsZVwiPjxpIGNsYXNzTmFtZT1cImlvbiBpb24tZ2Vhci1hXCI+PC9pPiBBcHBsaWNhdGlvbiBTZXR0aW5nczwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtYm9keVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtib2R5fVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBvbkNsaWNrPXt0aGlzLmJlZ2luU2F2ZVNldHRpbmdzLmJpbmQodGhpcyl9IGRpc2FibGVkPXt0aGlzLnN0YXRlLnNhdmVTZXR0aW5nc0luUHJvZ3Jlc3N9PlNhdmU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsInZhciBDaGFydEpzID0gcmVxdWlyZShcImNoYXJ0LmpzXCIpO1xuXG4vKipcbiAqIEEgZ2VuZXJpYyBiYXIgY2hhcnQgY29tcG9uZW50IHVzaW5nIENoYXJ0anNcbiAqXG4gKiBEYXRhIGFuZCBvcHRpb25zIGFyZSBwYXNzZWQgYXMgcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEJhckNoYXJ0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpc2UgdGhlIGNoYXJ0IGluIHRoZSBET00uXG4gICAgICovXG4gICAgY3JlYXRlQ2hhcnQoKSB7XG4gICAgICAgIHZhciBjb250ZXh0ID0gJChSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSlcbiAgICAgICAgICAgIC5maW5kKFwiLmNoYXJ0XCIpWzBdXG4gICAgICAgICAgICAuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gICAgICAgIHRoaXMuY2hhcnQgPSBuZXcgQ2hhcnRKcyhjb250ZXh0KVxuICAgICAgICAgICAgLkJhcih0aGlzLnByb3BzLmRhdGEsIHRoaXMucHJvcHMub3B0cyk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgY2hhcnQgb24gbW91bnRcbiAgICAgICAgdGhpcy5jcmVhdGVDaGFydCgpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVcGRhdGUoKSB7XG4gICAgICAgIC8vIElmIHRoZSBkYXRhIHVwZGF0ZXMsIHJlZnJlc2ggdGhlIGNoYXJ0IGJ5IHJlY3JlYXRpbmcgaXRcbiAgICAgICAgdGhpcy5jaGFydC5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuY3JlYXRlQ2hhcnQoKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG5cbiAgICAgICAgLy8gSnVzdCBhIHNpbXBsZSBkaXYgd2l0aCBhIGNhbnZhcyB0byByZW5kZXIgdGhlIGNoYXJ0IGludG9cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGNhbnZhcyBjbGFzc05hbWU9XCJjaGFydFwiIHdpZHRoPVwiNDAwXCIgaGVpZ2h0PVwiMjAwXCI+PC9jYW52YXM+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCIvKipcbiAqIFRoZSBpbXBvcnQgZGF0YSBtb2RhbCBpcyB1c2VkIHRvIGFsbG93IHRoZSB1c2VyIHRvIHVwbG9hZCBuZXcgZGF0YSBmcm9tIHRoZVxuICogZGV2aWNlLiBUaGUgZGV2aWNlIHBhc3N3b3JkIGNhbiBiZSBlbnRlcmVkIGFuZCBwcm9ncmVzcyBjYW4gYmUgb2JzZXJ2ZWRcbiAqIHRocm91Z2ggdmFyaW91cyBwcm9tcHRzLlxuICovXG5leHBvcnQgY2xhc3MgSW1wb3J0RGF0YU1vZGFsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyLmNvbnN0cnVjdG9yKHByb3BzKTtcblxuICAgICAgICAvLyBpbnRpYWxpc2UgdGhlIHN0YXRlXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBpbXBvcnRGYWlsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgaW1wb3J0SW5Qcm9ncmVzczogZmFsc2UsXG4gICAgICAgICAgICBhdHRlbXB0ZWRJbXBvcnQ6IGZhbHNlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gdGhlIHBhc3N3b3JkIGZpZWxkIHVwZGF0ZXNcbiAgICAgKiBAcGFyYW0gIEV2ZW50IGVcbiAgICAgKi9cbiAgICBwYXNzd29yZENoYW5nZShlKSB7XG4gICAgICAgIC8vIFN0b3JlIHRoZSBwYXNzd29yZCBpbiB0aGUgc3RhdGUgZm9yIHVzZSBsYXRlclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHBhc3N3b3JkOiBlLnRhcmdldC52YWx1ZVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhbiBpbXBvcnQgaXMgdHJpZ2dlcmVkLCBQT1NUcyBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgICAqIGFuZCByZXR1cm5zIGVpdGhlciBzdWNjZXNzIG9yIGZhaWx1cmUgZGVwZW5kaW5nIG9uIHRoZSBkZXZpY2VcbiAgICAgKiBzdGF0dXMuXG4gICAgICovXG4gICAgYmVnaW5EYXRhSW1wb3J0KCkge1xuXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgc3RhdGUgZm9yIGRpc3BsYXlcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aW1wb3J0SW5Qcm9ncmVzczogdHJ1ZSwgYXR0ZW1wdGVkSW1wb3J0OiB0cnVlfSk7XG5cbiAgICAgICAgLy8gUmVxdWVzdCB3LyBwYXNzd29yZFxuICAgICAgICAkLnBvc3QoXCIvYXBpL2ltcG9ydF9kYXRhXCIsIHtwYXNzd29yZDogdGhpcy5zdGF0ZS5wYXNzd29yZH0sXG5cbiAgICAgICAgICAgIGZ1bmN0aW9uKHJlc3VsdCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgc3RhdGUgZm9yIGRpc3BsYXlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aW1wb3J0RmFpbGVkOiBmYWxzZX0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFdhaXQgYSBzZWNvbmQsIHRoZW4gcmVmcmVzaCB0aGUgcGFnZVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRGlzcGxheSB0aGUgZXJyb3IgbWVzc2FnZSB0byB0aGUgdXNlclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydEZhaWxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogcmVzdWx0LmVycm9yXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2ltcG9ydEluUHJvZ3Jlc3M6IGZhbHNlfSk7XG5cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcblxuICAgICAgICAvLyBCZWZvcmUgYW4gaW1wb3J0IGlzIHN0YXJ0ZWQsIHRoaXMgaXMgdGhlIG1vZGFsIGNvbnRlbnRcbiAgICAgICAgdmFyIGJlZm9yZUltcG9ydEJvZHkgPSBbXG4gICAgICAgICAgICA8cD5FbnRlciB5b3VyIHBhc3N3b3JkIHRvIGltcG9ydCB5b3VyIHJ1biBkYXRhPC9wPixcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3JOYW1lPVwicGFzc3dvcmRcIj5QYXNzd29yZDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJwYXNzd29yZFwiIHZhbHVlPXt0aGlzLnN0YXRlLnBhc3N3b3JkfSBvbkNoYW5nZT17dGhpcy5wYXNzd29yZENoYW5nZS5iaW5kKHRoaXMpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwicGFzc3dvcmRcIj48L2lucHV0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIF07XG5cbiAgICAgICAgLy8gSWYgYW4gaW1wb3J0IGZhaWxzXG4gICAgICAgIHZhciBmYWlsZWRJbXBvcnRCb2R5ID0gW1xuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhbGVydCBhbGVydC1kYW5nZXJcIiByb2xlPVwiYWxlcnRcIj48c3Ryb25nPkltcG9ydCBmYWlsZWQ8L3N0cm9uZz46IHt0aGlzLnN0YXRlLmVycm9yTWVzc2FnZX08L2Rpdj4sXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yTmFtZT1cInBhc3N3b3JkXCI+UGFzc3dvcmQ8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwicGFzc3dvcmRcIiB2YWx1ZT17dGhpcy5zdGF0ZS5wYXNzd29yZH0gb25DaGFuZ2U9e3RoaXMucGFzc3dvcmRDaGFuZ2UuYmluZCh0aGlzKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInBhc3N3b3JkXCI+PC9pbnB1dD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBdO1xuXG4gICAgICAgIC8vIFdoaWxlIGFuIGltcG9ydCBpcyBpbiBwcm9ncmVzc1xuICAgICAgICB2YXIgaW1wb3J0SW5Qcm9ncmVzcyA9IFtcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWxlcnQgYWxlcnQtaW5mb1wiIHJvbGU9XCJhbGVydFwiPkltcG9ydCBwcm9jZXNzaW5nLi4uPC9kaXY+XG4gICAgICAgIF07XG5cbiAgICAgICAgLy8gSWYgYW4gaW1wb3J0IHN1Y2NlZWRzXG4gICAgICAgIHZhciBzdWNjZXNzSW1wb3J0Qm9keSA9IFtcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWxlcnQgYWxlcnQtc3VjY2Vzc1wiIHJvbGU9XCJhbGVydFwiPkltcG9ydCBzdWNjZWVkZWQhPC9kaXY+XG4gICAgICAgIF07XG5cbiAgICAgICAgdmFyIGJvZHk7XG5cbiAgICAgICAgLy8gU3RhdGUgbWFjaGluZSBmb3IgZGV0ZXJtaW5pbmcgd2hpY2ggdmlldyB0byB1c2VcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaW1wb3J0SW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgYm9keSA9IGltcG9ydEluUHJvZ3Jlc3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5hdHRlbXB0ZWRJbXBvcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5pbXBvcnRGYWlsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgYm9keSA9IGZhaWxlZEltcG9ydEJvZHk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYm9keSA9IHN1Y2Nlc3NJbXBvcnRCb2R5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYm9keSA9IGJlZm9yZUltcG9ydEJvZHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbCBmYWRlXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1kaWFsb2dcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJtb2RhbC10aXRsZVwiPjxpIGNsYXNzTmFtZT1cImlvbi11cGxvYWRcIiAvPiBJbXBvcnQgeW91ciBSdW5zPC9oND5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2JvZHl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIG9uQ2xpY2s9e3RoaXMuYmVnaW5EYXRhSW1wb3J0LmJpbmQodGhpcyl9IGRpc2FibGVkPXt0aGlzLnN0YXRlLmltcG9ydEluUHJvZ3Jlc3N9PkJlZ2luIEltcG9ydDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwidmFyIENoYXJ0SnMgPSByZXF1aXJlKFwiY2hhcnQuanNcIik7XG5cbi8qKlxuICogQSBnZW5lcmljIGxpbmUgY2hhcnQgY29tcG9uZW50IHVzaW5nIENoYXJ0anNcbiAqXG4gKiBEYXRhIGFuZCBvcHRpb25zIGFyZSBwYXNzZWQgYXMgcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0IGNsYXNzIExpbmVDaGFydCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY2hhcnQgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpc2UgdGhlIGNoYXJ0IGluIHRoZSBET00uXG4gICAgICovXG4gICAgY3JlYXRlQ2hhcnQoKSB7XG4gICAgICAgIHZhciBjb250ZXh0ID0gJChSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSkuZmluZChcIi5jaGFydFwiKVswXS5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIHRoaXMuY2hhcnQgPSBuZXcgQ2hhcnRKcyhjb250ZXh0KS5MaW5lKHRoaXMucHJvcHMuZGF0YSwgdGhpcy5wcm9wcy5vcHRzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBjaGFydCBvbiBtb3VudFxuICAgICAgICB0aGlzLmNyZWF0ZUNoYXJ0KCk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVwZGF0ZSgpIHtcbiAgICAgICAgLy8gSWYgdGhlIGRhdGEgdXBkYXRlcywgcmVmcmVzaCB0aGUgY2hhcnQgYnkgcmVjcmVhdGluZyBpdFxuICAgICAgICB0aGlzLmNoYXJ0LmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5jcmVhdGVDaGFydCgpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGNhbnZhcyBjbGFzc05hbWU9XCJjaGFydCBjZW50ZXItY2hhcnRcIiB3aWR0aD17dGhpcy5wcm9wcy53aWR0aH0gaGVpZ2h0PXt0aGlzLnByb3BzLmhlaWdodH0+PC9jYW52YXM+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbkxpbmVDaGFydC5kZWZhdWx0UHJvcHMgPSB7XG4gICAgd2lkdGg6IDM2MCxcbiAgICBoZWlnaHQ6IDE4MFxufVxuIiwiaW1wb3J0IHtOYXZiYXJ9IGZyb20gXCJjb21wb25lbnRzL05hdmJhci5qc3hcIjtcbmltcG9ydCB7TW9kYWxUcmlnZ2VyfSBmcm9tIFwiY29tcG9uZW50cy9Nb2RhbFRyaWdnZXIuanN4XCI7XG5pbXBvcnQge1VwbG9hZERhdGFCdXR0b259IGZyb20gXCJjb21wb25lbnRzL1VwbG9hZERhdGFCdXR0b24uanN4XCI7XG5pbXBvcnQge0ltcG9ydERhdGFNb2RhbH0gZnJvbSBcImNvbXBvbmVudHMvSW1wb3J0RGF0YU1vZGFsLmpzeFwiO1xuXG4vKipcbiAqIFRoZSBtYWluIG5hdmlnYXRpb24gYmFyIGRpc3BsYXllZCBhdCB0aGUgdG9wIG9mIGV2ZXJ5IHBhZ2Ugd2l0aGluIHRoZVxuICogYXBwbGljYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBNYWluTmF2YmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGltcG9ydERhdGEoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuXG5cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG5cbiAgICAgICAgLy8gUGFzcyB0aGUgbmF2aWdhdGlvbiBhcnJheSBpbnRvIHRoZSBnZW5lcmljIG5hdmJhclxuICAgICAgICB2YXIgbGlua3MgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJEYXNoYm9hcmRcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcImlvbi1pb3MtaG9tZVwiLFxuICAgICAgICAgICAgICAgIHVybDogXCIvZGFzaGJvYXJkXCIsXG4gICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uKCkge30sXG4gICAgICAgICAgICAgICAgY29udGV4dDogdGhpcyxcbiAgICAgICAgICAgICAgICBidXR0b246IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwiUnVuIEhpc3RvcnlcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcImlvbi1zdGF0cy1iYXJzXCIsXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9oaXN0b3J5XCIsXG4gICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uKCkge30sXG4gICAgICAgICAgICAgICAgY29udGV4dDogdGhpcyxcbiAgICAgICAgICAgICAgICBidXR0b246IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxOYXZiYXIgbGlua3M9e2xpbmtzfSAvPlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsIlxuLyoqXG4gKiBUaGUgbWFwIGNvbXBvbmVudCBpcyB1c2VkIG9uIHRoZSBydW4gZGlzcGxheSBwYWdlLCBpdCBpcyByZXNwb25zaWJsZVxuICogZm9yIGRpc3BsYXlpbmcgdGhlIHBhdGggYSB1c2VyIHRvb2sgZHVyaW5nIHRoZWlyIGpvdXJuZXkgd2l0aFxuICogYXBwcm9wcmlhdGUgc3BlZWQgY29sb3VyIGNvZGluZy5cbiAqXG4gKiBUaGUgY29tcG9uZW50IGNhbiBhbHNvIGdlbmVyYXRlIGEgc3RhdGljIGltYWdlIFVSTCBmb3Igc2hhcmluZyBwdXJwb3Nlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgLy8gVXNlZCBpbiBzdGF0aWMgdXJsIGdlbmVyYXRpb25cbiAgICAgICAgdGhpcy5pbml0U3RhdGljTWFwU3RyaW5ncygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlIHRoZSBtYXBzIHN0YXRpYyBVUkwgZm9yIHRoZSBjdXJyZW50bHkgZGlzcGxheWVkIG1hcFxuICAgICAqIEByZXR1cm4gc3RyaW5nIE1hcCBVUkxcbiAgICAgKi9cbiAgICBnZXRTdGF0aWNVcmwoKSB7XG4gICAgICAgIHZhciBzdGF0aWNNYXBVcmwgPSBcImh0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9zdGF0aWNtYXA/XCIgK1xuICAgICAgICAgICAgdGhpcy5kZWZhdWx0T3B0c1N0cmluZyArIFwiJlwiICtcbiAgICAgICAgICAgIHRoaXMuY2VudGVyU3RyaW5nICsgXCImXCIgK1xuICAgICAgICAgICAgdGhpcy56b29tU3RyaW5nICsgXCImXCIgK1xuICAgICAgICAgICAgdGhpcy5ydW5QYXRoU3RyaW5nICsgXCImXCIgK1xuICAgICAgICAgICAgdGhpcy5tYXJrZXJTdHJpbmc7XG5cbiAgICAgICAgcmV0dXJuIHN0YXRpY01hcFVybDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmFuc2xhdGUgb3VyIGludGVybmFsIHdheXBvaW50IGZvcm1hdCBpbnRvIHRoZSBHb29nbGUgbWFwc1xuICAgICAqIGNvbmNlcHQgb2YgbGF0bG9uIHBhaXJzLlxuICAgICAqIEBwYXJhbSAgQXJyYXkgd2F5cG9pbnRzIExpc3Qgb2YgY29vcmRpbmF0ZSBwYWlycyBkZXNjcmliaW5nIHRoZSBydW5cbiAgICAgKiBAcGFyYW0gIEJvdW5kcyBib3VuZHMgICAgVGhlIG1hcCBib3VuZHNcbiAgICAgKiBAcmV0dXJuIEFycmF5IEEgbGlzdCBvZiBHb29nbGUgZm9ybWF0dGVkIHJ1biBwb2ludHNcbiAgICAgKi9cbiAgICBjb21wdXRlUnVuUGF0aCh3YXlwb2ludHMsIGJvdW5kcykge1xuICAgICAgICB2YXIgcnVuUGF0aCA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd2F5cG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnQgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKFxuICAgICAgICAgICAgICAgIHdheXBvaW50c1tpXS5sYXQsXG4gICAgICAgICAgICAgICAgd2F5cG9pbnRzW2ldLmxvblxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcnVuUGF0aC5wdXNoKCBwb2ludCApO1xuICAgICAgICAgICAgLy8gVXNlZCB0byBjb21wdXRlIHRoZSB2aWV3aW5nIHdpbmRvdyBmb3IgdGhlIG1hcFxuICAgICAgICAgICAgLy8gTmVlZCB0byBpbmNsdWRlIGFsbCBwb2ludHMgaW4gdGhlIHJ1blxuICAgICAgICAgICAgYm91bmRzLmV4dGVuZCggcG9pbnQgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBydW5QYXRoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlIHRoZSBzdGluZyByZXByZXNlbnRhdGlvbiBvZiBhIHJ1biBmb3IgdXNlIGluIHRoZSBzdGF0aWNcbiAgICAgKiBHb29nbGUgTWFwcyBpbWFnZS5cbiAgICAgKiBAcGFyYW0gIEFycmF5IHJ1blBhdGggQSBsaXN0IG9mIEdvb2dsZSBNYXBzIGNvbXBhdGlibGUgcG9pbnRzXG4gICAgICovXG4gICAgdXBkYXRlUnVuUGF0aFN0cmluZyhydW5QYXRoKSB7XG4gICAgICAgIHRoaXMucnVuUGF0aFN0cmluZyA9IFwicGF0aD1jb2xvcjoweDAwMDBmZnx3ZWlnaHQ6NXxcIjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1blBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucnVuUGF0aFN0cmluZyArPSBydW5QYXRoW2ldLkEgKyBcIixcIiArIHJ1blBhdGhbaV0uRjtcblxuICAgICAgICAgICAgaWYgKGkgPCBydW5QYXRoLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgdGhpcy5ydW5QYXRoU3RyaW5nICs9IFwifFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGUgdGhlIHN0cmluZyBkZXNjcmliaW5nIHRoZSBtYXJrZXJzIHRvIGJlIHBsYWNlZCBvbiBhXG4gICAgICogc3RhdGljIEdvb2dsZSBNYXBzIGltYWdlLlxuICAgICAqIEBwYXJhbSAgQ29vcmRpbmF0ZSBzdGFydFxuICAgICAqIEBwYXJhbSAgQ29vcmRpbmF0ZSBlbmRcbiAgICAgKi9cbiAgICB1cGRhdGVNYXJrZXJTdHJpbmcoc3RhcnQsIGVuZCkge1xuICAgICAgICB0aGlzLm1hcmtlclN0cmluZyA9IFwibWFya2Vycz1jb2xvcjpibHVlfFwiICsgc3RhcnQuQSArIFwiLFwiICtcbiAgICAgICAgICAgIHN0YXJ0LkYgKyBcInxcIiArIGVuZC5BICsgXCIsXCIgKyBlbmQuRjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSB0aGUgc3RyaW5nIGRlc2NyaWJpbmcgdGhlIHpvb20gbGV2ZWwgZm9yIHRoZSBzdGF0aWMgR29vZ2xlXG4gICAgICogTWFwcyBpbWFnZS5cbiAgICAgKiBAcGFyYW0gIE1hcCBtYXAgQ3VycmVudCBtYXAgaW5zdGFuY2VcbiAgICAgKi9cbiAgICBtYXBab29tSGFuZGxlcihtYXAsIGUpIHtcbiAgICAgICAgdGhpcy56b29tU3RyaW5nID0gXCJ6b29tPVwiICsgbWFwLnpvb207XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGUgdGhlIHN0cmluZyBkZXNjcmliaW5nIHRoZSBjZW50cmUgb2YgdGhlIG1hcCBmb3IgdGhlIHN0YXRpY1xuICAgICAqIEdvb2dsZSBNYXBzIGltYWdlLlxuICAgICAqIEBwYXJhbSAgTWFwIG1hcCBDdXJyZW50IGltYWdlIGluc3RhbmNlXG4gICAgICovXG4gICAgbWFwQ2VudGVySGFuZGxlcihtYXAsIGUpIHtcbiAgICAgICAgdGhpcy5jZW50ZXJTdHJpbmcgPSBcImNlbnRlcj1cIiArIG1hcC5jZW50ZXIuQSArIFwiLFwiICsgbWFwLmNlbnRlci5GO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlIHRoZSBiYXNlIGZvciB0aGUgc3RhdGljIG1hcCBzdHJpbmcsIHdoZW4gZ2VuZXJhdGluZyBhIG5ld1xuICAgICAqIGltYWdlLlxuICAgICAqL1xuICAgIGluaXRTdGF0aWNNYXBTdHJpbmdzKCkge1xuICAgICAgICB0aGlzLmRlZmF1bHRPcHRzU3RyaW5nID0gXCJzaXplPTExNjh4NDgwJm1hcHR5cGU9cm9hZG1hcFwiO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIHBvbHlsaW5lIGFubm90YXRpb24gb24gYSBnaXZlbiBNYXAgaW5zdGFuY2UgZ2l2ZW4gYSBydW5QYXRoXG4gICAgICogYW5kIGEgbGlzdCBvZiB3YXlwb2ludHMuXG4gICAgICogQHBhcmFtICBNYXAgbWFwXG4gICAgICogQHBhcmFtICBBcnJheSB3YXlwb2ludHNcbiAgICAgKiBAcGFyYW0gIEFycmF5IHJ1blBhdGhcbiAgICAgKi9cbiAgICBjcmVhdGVSdW5QYXRoUG9seWxpbmUobWFwLCB3YXlwb2ludHMsIHJ1blBhdGgpIHtcbiAgICAgICAgdmFyIHJ1blBhdGhQb2x5TGluZTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdheXBvaW50cy5sZW5ndGggLSAxOyBpKyspIHtcblxuICAgICAgICAgICAgLy8gTW92ZSBhbG9uZyB0aGUgcGF0aCBhbmQgY29tcHV0ZSB0aGUgZGlzdGFuY2UgYmV0d2VlbiBlYWNoIHBvaW50XG4gICAgICAgICAgICB2YXIgZHggPSBwYXJzZUZsb2F0KHdheXBvaW50c1tpXS5sYXQpIC1cbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KHdheXBvaW50c1tpICsgMV0ubGF0KTtcblxuICAgICAgICAgICAgdmFyIGR5ID0gcGFyc2VGbG9hdCh3YXlwb2ludHNbaV0ubG9uKSAtXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCh3YXlwb2ludHNbaSArIDFdLmxvbik7XG5cbiAgICAgICAgICAgIHZhciBkaXN0ID0gTWF0aC5zcXJ0KGR4ICogZHggICsgZHkgKiBkeSkgKiAxMDAwO1xuXG4gICAgICAgICAgICAvLyBTaW5jZSBkYXRhcG9pbnRzIGFyZSBldmVubHkgc3BhY2VkLCB3ZSBjYW4gdXNlIGRpc3RhbmNlIHRvXG4gICAgICAgICAgICAvLyBpbXBseSB0aGUgc3BlZWQgYmV0d2VlbiBlYWNoIHBvaW50IHBhaXJcblxuICAgICAgICAgICAgLy8gTXVsdGlwbHkgdGhlIGRpc3RhbmNlIHRvIGdpdmUgYSBjb25zdGFudCB3ZSBjYW4gdXNlIGluIGNvbG91clxuICAgICAgICAgICAgLy8gZ2VuZXJhdGlvblxuICAgICAgICAgICAgZGlzdCAqPSA2MDA7XG5cbiAgICAgICAgICAgIGlmICggZGlzdCA+IDIzMCApIHtcbiAgICAgICAgICAgICAgICBkaXN0ID0gMjMwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCBkaXN0IDwgMjAgKSB7XG4gICAgICAgICAgICAgICAgZGlzdCA9IDIwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBHZW5lcmF0ZSB0aGUgY29sb3VyIGZvciB0aGlzIGxpbmUgc2VnbWVudFxuICAgICAgICAgICAgdmFyIHIsIGcsIGI7XG4gICAgICAgICAgICByID0gcGFyc2VJbnQoKDI1NSAtIGRpc3QpKTtcbiAgICAgICAgICAgIGcgPSBwYXJzZUludCgoZGlzdCkpO1xuICAgICAgICAgICAgYiA9IDIwO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgbGluZSBzZWdtZW50IGJldHdlZW4gdGhlIGdpdmVuIHBvaW50cyxcbiAgICAgICAgICAgIC8vIHdpdGggb3VyIGNvbXB1dGVkIGNvbG91clxuICAgICAgICAgICAgcnVuUGF0aFBvbHlMaW5lID0gbmV3IGdvb2dsZS5tYXBzLlBvbHlsaW5lKHtcbiAgICAgICAgICAgICAgICBwYXRoOiBbcnVuUGF0aFtpXSwgcnVuUGF0aFtpICsgMV1dLFxuICAgICAgICAgICAgICAgIGdlb2Rlc2ljOiB0cnVlLFxuICAgICAgICAgICAgICAgIHN0cm9rZUNvbG9yOiAncmdiYSgnICsgciArICcsICcgKyBnICsgJywgJyArIGIgKyAnLCAxKScsXG4gICAgICAgICAgICAgICAgc3Ryb2tlT3BhY2l0eTogMS4wLFxuICAgICAgICAgICAgICAgIHN0cm9rZVdlaWdodDogM1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEFwcGx5IHRvIG1hcFxuICAgICAgICAgICAgcnVuUGF0aFBvbHlMaW5lLnNldE1hcChtYXApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGxhY2UgdGhlIHN0YXJ0IGFuZCBlbmQgZmxhZ3Mgb24gYSBnaXZlbiBNYXAgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtICBNYXAgbWFwXG4gICAgICogQHBhcmFtICBBcnJheSB3YXlwb2ludHNcbiAgICAgKiBAcGFyYW0gIEFycmF5IHJ1blBhdGhcbiAgICAgKi9cbiAgICBwbGFjZU1hcmtlcnMobWFwLCB3YXlwb2ludHMsIHJ1blBhdGgpIHtcblxuICAgICAgICAvLyBJbWFnZSBwYXRocyBmb3IgdXNlIGxhdGVyXG4gICAgICAgIHZhciBzdGFydEltYWdlID0gJy9pbWcvc3RhcnQucG5nJztcbiAgICAgICAgdmFyIGVuZEltYWdlID0gJy9pbWcvZW5kLnBuZyc7XG4gICAgICAgIHZhciBub2RlSW1hZ2UgPSAnL2ltZy9ibGFuay5wbmcnO1xuICAgICAgICB2YXIgaWNvbjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1blBhdGgubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgLy8gT25seSB1c2UgaW1hZ2VzIGF0IHRoZSBzdGFydCBhbmQgZW5kIG9mIHRoZSBydW5cbiAgICAgICAgICAgIGlmIChpID09IDApIHtcbiAgICAgICAgICAgICAgICBpY29uID0gc3RhcnRJbWFnZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PSBydW5QYXRoLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBpY29uID0gZW5kSW1hZ2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE5vZGUgaW1hZ2VzIGFyZSBibGFua1xuICAgICAgICAgICAgICAgIGljb24gPSBub2RlSW1hZ2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFN0b3JlIHRoZSB3YXlwb2ludCBpbnN0YW5jZSBmb3IgdXNlIGluIGEgY2FsbGJhY2tcbiAgICAgICAgICAgIGxldCB3cCA9IHRoaXMucHJvcHMud2F5cG9pbnRzW2ldO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgb3VyIGJhc2UgbWFya2VyIGJlZm9yZSB3aXJpbmcgdXAgZXZlbnRzXG4gICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHJ1blBhdGhbaV0sXG4gICAgICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSBUZXN0JyxcbiAgICAgICAgICAgICAgICBpY29uOiBpY29uXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gU2NvcGUgdGhlIGNhbGxiYWNrcyBjb3JyZWN0bHlcbiAgICAgICAgICAgIChmdW5jdGlvbiAobWFya2VyKSB7XG4gICAgICAgICAgICAgICAgLy8gRGlzcGxheSB0aGUgdGltZSBvZiBhIGRhdGFwb2ludCBvbiBob3ZlclxuICAgICAgICAgICAgICAgIHZhciBpbmZvd2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIlwiICsgd2luZG93LmFwcC5tb21lbnQod3AudGltZSAqIDEwMDApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZm9ybWF0KHdpbmRvdy5hcHAudGltZUZvcm1hdClcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ21vdXNlb3ZlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpbmZvd2luZG93Lm9wZW4obWFwLCBtYXJrZXIpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnbW91c2VvdXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5mb3dpbmRvdy5jbG9zZShtYXAsIG1hcmtlcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KShtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIC8vIEluaXRpYWwgYm91bmRzXG4gICAgICAgIHZhciBib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XG4gICAgICAgIC8vIFByb2Nlc3MgcnVuXG4gICAgICAgIHZhciBydW5QYXRoID0gdGhpcy5jb21wdXRlUnVuUGF0aCh0aGlzLnByb3BzLndheXBvaW50cywgYm91bmRzKTtcblxuICAgICAgICAvLyBNYXAgZGlzcGxheSBvcHRpb25zXG4gICAgICAgIHZhciBtYXBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuVEVSUkFJTlxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJlbmRlciB0aGUgbWFwXG4gICAgICAgIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKCQoUmVhY3QuZmluZERPTU5vZGUodGhpcykpXG4gICAgICAgICAgICAgICAgLmZpbmQoXCIubWFwLWNhbnZhc1wiKVswXSwgbWFwT3B0aW9ucyk7XG5cbiAgICAgICAgLy8gU3RvcmUgbWFwIHJlZmVyZW5jZVxuICAgICAgICB0aGlzLm1hcCA9IG1hcDtcbiAgICAgICAgbWFwLmZpdEJvdW5kcyhib3VuZHMpO1xuXG4gICAgICAgIC8vIEFkZCBsaXN0ZW5lcnMgZm9yIHpvb20gYW5kIGNlbnRlclxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lck9uY2UobWFwLCBcInpvb21fY2hhbmdlZFwiLFxuICAgICAgICAgICAgdGhpcy5tYXBab29tSGFuZGxlci5iaW5kKHRoaXMsIG1hcCkpO1xuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lck9uY2UobWFwLCBcImNlbnRlcl9jaGFuZ2VkXCIsXG4gICAgICAgICAgICB0aGlzLm1hcENlbnRlckhhbmRsZXIuYmluZCh0aGlzLCBtYXApKTtcblxuICAgICAgICAvLyBTZXQgbWFya2VycyB0byBzdGFydCBhbmQgZW5kIHBvaW50c1xuICAgICAgICB0aGlzLnVwZGF0ZU1hcmtlclN0cmluZyhydW5QYXRoWzBdLCBydW5QYXRoW3J1blBhdGgubGVuZ3RoIC0gMV0pO1xuICAgICAgICB0aGlzLnVwZGF0ZVJ1blBhdGhTdHJpbmcocnVuUGF0aCk7XG5cbiAgICAgICAgLy8gUmVuZGVyIHBvbHlsaW5lIGFuZCBtYXJrZXJzIG9uIG1hcFxuICAgICAgICB0aGlzLmNyZWF0ZVJ1blBhdGhQb2x5bGluZShtYXAsIHRoaXMucHJvcHMud2F5cG9pbnRzLCBydW5QYXRoKTtcbiAgICAgICAgdGhpcy5wbGFjZU1hcmtlcnMobWFwLCB0aGlzLnByb3BzLndheXBvaW50cywgcnVuUGF0aCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hcC1jYW52YXNcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsIi8qKlxuICogTW9kYWwgdHJpZ2dlcnMgY2FuIGJlIHVzZWQgdG8gb3BlbiBhIEJvb3RzdHJhcCBtb2RhbCBvbiBjbGljayBvZiBlaXRoZXJcbiAqIGEgbGluayBvciBidXR0b24uXG4gKi9cbmV4cG9ydCBjbGFzcyBNb2RhbFRyaWdnZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgLyoqXG4gICAgICogVHJpZ2dlciB0aGUgZW1iZWRkZWQgbW9kYWwgd2l0aGluIHRoZSBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIGNhbGxlZCBieSBhIGNsaWNrIHVzdWFsbHkuXG4gICAgICovXG4gICAgdHJpZ2dlck1vZGFsKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIFJlYWN0LnJlbmRlcih0aGlzLnByb3BzLm1vZGFsLCAkKCcjbW9kYWxfbW91bnQnKVswXSk7XG4gICAgICAgICQoJyNtb2RhbF9tb3VudCcpLmZpbmQoXCIubW9kYWxcIikubW9kYWwoXCJzaG93XCIpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcblxuICAgICAgICB2YXIgaW5uZXI7XG5cbiAgICAgICAgLy8gUmVuZGVyIGVpdGhlciBhIGJ1dHRvbiBvciBhIGxpbmsgZGVwZW5kaW5nIG9uIHRoZSBwcm9wIHZhbHVlXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmJ1dHRvbikge1xuICAgICAgICAgICAgaW5uZXIgPSA8YnV0dG9uIGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc05hbWV9IG9uQ2xpY2s9e3RoaXMudHJpZ2dlck1vZGFsLmJpbmQodGhpcyl9Pnt0aGlzLnByb3BzLmJ1dHRvblRleHR9PC9idXR0b24+XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbm5lciA9IDxhIGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc05hbWV9IGhyZWY9XCIjXCIgb25DbGljaz17dGhpcy50cmlnZ2VyTW9kYWwuYmluZCh0aGlzKX0+e3RoaXMucHJvcHMuYnV0dG9uVGV4dH08L2E+XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4oXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlubGluZS1ibG9ja1wiPlxuICAgICAgICAgICAgICAgIHtpbm5lcn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7TW9kYWxUcmlnZ2VyfSBmcm9tIFwiLi9Nb2RhbFRyaWdnZXIuanN4XCJcbmltcG9ydCB7QXBwU2V0dGluZ3NNb2RhbH0gZnJvbSBcIi4vQXBwU2V0dGluZ3NNb2RhbC5qc3hcIlxuaW1wb3J0IHtJbXBvcnREYXRhTW9kYWx9IGZyb20gXCJjb21wb25lbnRzL0ltcG9ydERhdGFNb2RhbC5qc3hcIlxuaW1wb3J0IHtVcGxvYWREYXRhQnV0dG9ufSBmcm9tIFwiY29tcG9uZW50cy9VcGxvYWREYXRhQnV0dG9uLmpzeFwiXG5cbi8qKlxuICogQSBnZW5lcmljIG5hdmJhciBjbGFzcyBiYXNlZCBvbiB0aGUgYm9vdHN0cmFwIG5hdmJhciBzdHJ1Y3R1cmUuXG4gKlxuICogTGlua3MgY2FuIGJlIHByb3ZlZCBhcyBhbiBhcnJheSBvZiB2YXJpb3VzIG9wdGlvbiBvYmplY3RzLlxuICovXG5leHBvcnQgY2xhc3MgTmF2YmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8bmF2IGNsYXNzTmFtZT1cIm5hdmJhciBuYXZiYXItZGVmYXVsdFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyLWZsdWlkXCI+XG4gICAgICAgICAgICAgICAgICAgIHsvKiBNb2JpbGUgbWVudSAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlIGNvbGxhcHNlZFwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIiNicy1leGFtcGxlLW5hdmJhci1jb2xsYXBzZS0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3Itb25seVwiPlRvZ2dsZSBuYXZpZ2F0aW9uPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24tYmFyXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24tYmFyXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24tYmFyXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIiBocmVmPVwiL1wiPkxpdmluZyBEZWFkIEZpdG5lc3MgVHJhY2tlcjwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgey8qIExpbmsgbGlzdCAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2VcIiBpZD1cImJzLWV4YW1wbGUtbmF2YmFyLWNvbGxhcHNlLTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXYgbmF2YmFyLW5hdlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5saW5rcy5tYXAoIGZ1bmN0aW9uKGVudHJ5KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZW50cnkuY29tcG9uZW50ICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDxsaT57ZW50cnkuY29tcG9uZW50fTwvbGk+KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVudHJ5LmJ1dHRvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDxsaT48YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBuYXZiYXItYnRuXCIgb25DbGljaz17ZW50cnkuY2xpY2suYmluZChlbnRyeS5jb250ZXh0KX0+e2VudHJ5Lm5hbWV9PC9idXR0b24+PC9saT4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoPGxpPjxhIGhyZWY9e2VudHJ5LnVybH0gb25DbGljaz17ZW50cnkuY2xpY2suYmluZChlbnRyeS5jb250ZXh0KX0+PGkgY2xhc3NOYW1lPXtlbnRyeS5pY29ufSAvPiB7ZW50cnkubmFtZX08L2E+PC9saT4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBPdGhlciBvcHRpb25zLCBzdWNoIGFzIHNldHRpbmdzIGFuZCBpbXBvcnQgKi99XG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2IG5hdmJhci1uYXYgbmF2YmFyLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TW9kYWxUcmlnZ2VyIG1vZGFsPXs8SW1wb3J0RGF0YU1vZGFsIC8+fSBidXR0b249e3RydWV9IGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBuYXZiYXItYnRuIG1hcmdpbi1yaWdodFwiIGJ1dHRvblRleHQ9ezxVcGxvYWREYXRhQnV0dG9uIC8+fSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TW9kYWxUcmlnZ2VyIG1vZGFsPXs8QXBwU2V0dGluZ3NNb2RhbCAvPn0gYnV0dG9uPXt0cnVlfSBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgbmF2YmFyLWJ0blwiIGJ1dHRvblRleHQ9ezxpIGNsYXNzTmFtZT1cImlvbiBpb24tZ2Vhci1hXCI+PC9pPn0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L25hdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJ2YXIgQ2hhcnRKcyA9IHJlcXVpcmUoXCJjaGFydC5qc1wiKTtcblxuLyoqXG4gKiBBIGdlbmVyaWMgcGllIGNoYXJ0IGNvbXBvbmVudCB1c2luZyBDaGFydGpzXG4gKlxuICogRGF0YSBhbmQgb3B0aW9ucyBhcmUgcGFzc2VkIGFzIHByb3BlcnRpZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBQaWVDaGFydCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXNlIHRoZSBjaGFydCBpbiB0aGUgRE9NLlxuICAgICAqL1xuICAgIGNyZWF0ZUNoYXJ0KCkge1xuICAgICAgICB2YXIgY29udGV4dCA9ICQoUmVhY3QuZmluZERPTU5vZGUodGhpcykpLmZpbmQoXCIuY2hhcnRcIilbMF0uZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICB0aGlzLmNoYXJ0ID0gbmV3IENoYXJ0SnMoY29udGV4dCkuUGllKHRoaXMucHJvcHMuZGF0YSwgdGhpcy5wcm9wcy5vcHRzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBjaGFydCBvbiBtb3VudFxuICAgICAgICB0aGlzLmNyZWF0ZUNoYXJ0KCk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVwZGF0ZSgpIHtcbiAgICAgICAgLy8gSWYgdGhlIGRhdGEgdXBkYXRlcywgcmVmcmVzaCB0aGUgY2hhcnQgYnkgcmVjcmVhdGluZyBpdFxuICAgICAgICB0aGlzLmNoYXJ0LmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5jcmVhdGVDaGFydCgpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcblxuICAgICAgICAvLyBKdXN0IGEgc2ltcGxlIGRpdiB3aXRoIGEgY2FudmFzIHRvIHJlbmRlciB0aGUgY2hhcnQgaW50b1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8Y2FudmFzIGNsYXNzTmFtZT1cImNoYXJ0XCIgd2lkdGg9XCI0MDBcIiBoZWlnaHQ9XCIyMDBcIj48L2NhbnZhcz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsInZhciBDaGFydEpzID0gcmVxdWlyZShcImNoYXJ0LmpzXCIpO1xuXG4vKipcbiAqIEEgZ2VuZXJpYyByYWRhciBjaGFydCBjb21wb25lbnQgdXNpbmcgQ2hhcnRqc1xuICpcbiAqIERhdGEgYW5kIG9wdGlvbnMgYXJlIHBhc3NlZCBhcyBwcm9wZXJ0aWVzLlxuICovXG5leHBvcnQgY2xhc3MgUmFkYXJDaGFydCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXNlIHRoZSBjaGFydCBpbiB0aGUgRE9NLlxuICAgICAqL1xuICAgIGNyZWF0ZUNoYXJ0KCkge1xuICAgICAgICB2YXIgY29udGV4dCA9ICQoUmVhY3QuZmluZERPTU5vZGUodGhpcykpLmZpbmQoXCIuY2hhcnRcIilbMF0uZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICB0aGlzLmNoYXJ0ID0gbmV3IENoYXJ0SnMoY29udGV4dCkuUmFkYXIodGhpcy5wcm9wcy5kYXRhLCB0aGlzLnByb3BzLm9wdHMpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAvLyBDcmVhdGUgdGhlIGNoYXJ0IG9uIG1vdW50XG4gICAgICAgIHRoaXMuY3JlYXRlQ2hhcnQoKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVXBkYXRlKCkge1xuICAgICAgICAvLyBJZiB0aGUgZGF0YSB1cGRhdGVzLCByZWZyZXNoIHRoZSBjaGFydCBieSByZWNyZWF0aW5nIGl0XG4gICAgICAgIHRoaXMuY2hhcnQuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLmNyZWF0ZUNoYXJ0KCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuXG4gICAgICAgIC8vIEp1c3QgYSBzaW1wbGUgZGl2IHdpdGggYSBjYW52YXMgdG8gcmVuZGVyIHRoZSBjaGFydCBpbnRvXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxjYW52YXMgY2xhc3NOYW1lPVwiY2hhcnRcIiB3aWR0aD1cIjQwMFwiIGhlaWdodD1cIjIwMFwiPjwvY2FudmFzPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtGYWNlYm9va1NoYXJlQnV0dG9uLCBUd2l0dGVyU2hhcmVCdXR0b259IGZyb20gXCJjb21wb25lbnRzL1NvY2lhbFNoYXJpbmcuanN4XCI7XG5cbi8qKlxuICogQSBtb2RhbCBkaXNwbGF5ZWQgd2hlbiBhIHVzZXIgb3B0cyB0byBzaGFyZSB0aGVpciBydW4gdG8gZWl0aGVyIEZhY2Vib29rXG4gKiBvciBUd2l0dGVyLlxuICovXG5leHBvcnQgY2xhc3MgU2hhcmVSdW5Nb2RhbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuXG4gICAgICAgIC8vIFNob3cgdGhlIG1vZGFsIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBjcmVhdGVkXG4gICAgICAgICQoUmVhY3QuZmluZERPTU5vZGUodGhpcykpLm1vZGFsKFwic2hvd1wiKTtcblxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwgZmFkZVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZGlhbG9nXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwibW9kYWwtdGl0bGVcIj5TaGFyZSBZb3VyIFJ1bjwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtYm9keVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBEaXNwbGF5IGltYWdlIGFuZCBzaGFyaW5nIGNvbnRyb2xzICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXt0aGlzLnByb3BzLmltYWdlVXJsfSB3aWR0aD1cIjEwMCVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEZhY2Vib29rU2hhcmVCdXR0b24gdXJsPXt0aGlzLnByb3BzLmltYWdlVXJsfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUd2l0dGVyU2hhcmVCdXR0b24gdXJsPXt0aGlzLnByb3BzLmltYWdlVXJsfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBTb2NpYWwgc2hhcmluZyBidXR0b25zIHRoYXQgYXV0b21hdGljYWxseSB0cmlnZ2VyIEFQSSByZXF1ZXN0c1xuICogdXNpbmcgdGhlIHByb3ZpZGVkIFVSTCBhbmQgbWVzc2FnZS5cbiAqL1xuXG5cbi8qXG4gKiBFeGFtcGxlXG4gKiA8RmFjZWJvb2tTaGFyZUJ1dHRvbiB1cmw9XCJodHRwOi8vaS5pbWd1ci5jb20vM3NrdkEuanBnXCIgLz5cbiAqL1xuZXhwb3J0IGNsYXNzIEZhY2Vib29rU2hhcmVCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIC8vIENyZWF0ZSBhbmQgbW91bnQgdGhlIGJ1dHRvbiBhcyBwZXIgQVBJIGluc3RydWN0aW9uc1xuICAgICAgICAoZnVuY3Rpb24oZCwgcywgaWQpIHtcbiAgICAgICAgICAgIHZhciBqcywgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXTtcbiAgICAgICAgICAgIGlmIChkLmdldEVsZW1lbnRCeUlkKGlkKSkgcmV0dXJuO1xuICAgICAgICAgICAganMgPSBkLmNyZWF0ZUVsZW1lbnQocyk7IGpzLmlkID0gaWQ7XG4gICAgICAgICAgICBqcy5zcmMgPSBcImh0dHBzOi8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fVVMvc2RrLmpzI3hmYm1sPTEmdmVyc2lvbj12Mi4zJmFwcElkPTYzOTU0MjE4NjE0Njc4NVwiO1xuICAgICAgICAgICAgZmpzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGpzLCBmanMpO1xuICAgICAgICB9XG4gICAgICAgIChkb2N1bWVudCwgJ3NjcmlwdCcsICdmYWNlYm9vay1qc3NkaycpKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIC8vIEhUTUwgYXMgZ2l2ZW4gaW4gQVBJXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZmItc2hhcmUtYnV0dG9uJ1xuICAgICAgICAgICAgICAgIGRhdGEtaHJlZj17dGhpcy5wcm9wcy51cmx9XG4gICAgICAgICAgICAgICAgZGF0YS1sYXlvdXQ9J2J1dHRvbic+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuLypcbiAqIEV4YW1wbGVcbiAqIDxUd2l0dGVyU2hhcmVCdXR0b24gdXJsPVwiaHR0cDovL2kuaW1ndXIuY29tLzNza3ZBLmpwZ1wiIG1lc3NhZ2U9XCJTYW1wbGUgYm9keVwiIC8+XG4gKi9cbmV4cG9ydCBjbGFzcyBUd2l0dGVyU2hhcmVCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcbiAgICAgICAgc3VwZXIoIHByb3BzICk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGFuZCBtb3VudCB0aGUgYnV0dG9uIGFzIHBlciBBUEkgaW5zdHJ1Y3Rpb25zXG4gICAgICAgICFmdW5jdGlvbihkLHMsaWQpe1xuICAgICAgICAgICAgdmFyIGpzLGZqcz1kLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLHA9L15odHRwOi8udGVzdChkLmxvY2F0aW9uKT8naHR0cCc6J2h0dHBzJztcbiAgICAgICAgICAgIGlmKCFkLmdldEVsZW1lbnRCeUlkKGlkKSl7XG4gICAgICAgICAgICAgICAganM9ZC5jcmVhdGVFbGVtZW50KHMpO1xuICAgICAgICAgICAgICAgIGpzLmlkPWlkO2pzLnNyYz1wKyc6Ly9wbGF0Zm9ybS50d2l0dGVyLmNvbS93aWRnZXRzLmpzJztcbiAgICAgICAgICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsZmpzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAoZG9jdW1lbnQsICdzY3JpcHQnLCAndHdpdHRlci13anMnKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIC8vIEhUTUwgYXMgZ2l2ZW4gaW4gQVBJXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8YSBocmVmPSdodHRwczovL3R3aXR0ZXIuY29tL3NoYXJlJ1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0ndHdpdHRlci1zaGFyZS1idXR0b24nXG4gICAgICAgICAgICAgICAgZGF0YS11cmw9e3RoaXMucHJvcHMudXJsfVxuICAgICAgICAgICAgICAgIGRhdGEtdGV4dD17dGhpcy5wcm9wcy5tZXNzYWdlfVxuICAgICAgICAgICAgICAgIGRhdGEtY291bnQ9J25vbmUnPlR3ZWV0PC9hPlxuICAgICAgICApXG4gICAgfVxufVxuIiwiLyoqXG4gKiBPcGVucyB0aGUgSW1wb3J0IERhdGEgTW9kYWwgd2hlbiBjbGlja2VkXG4gKi9cbmV4cG9ydCBjbGFzcyBVcGxvYWREYXRhQnV0dG9uIHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiA8c3Bhbj48aSBjbGFzc05hbWU9XCJpb24gaW9uLXVwbG9hZFwiPjwvaT4gSW1wb3J0IERhdGE8L3NwYW4+O1xuICAgIH1cbn1cbiIsImltcG9ydCB7TGluZUNoYXJ0fSBmcm9tIFwiY29tcG9uZW50cy9MaW5lQ2hhcnQuanN4XCI7XG5pbXBvcnQge0JhckNoYXJ0fSBmcm9tIFwiY29tcG9uZW50cy9CYXJDaGFydC5qc3hcIjtcbmltcG9ydCB7UmFkYXJDaGFydH0gZnJvbSBcImNvbXBvbmVudHMvUmFkYXJDaGFydC5qc3hcIjtcbmltcG9ydCB7UGllQ2hhcnR9IGZyb20gXCJjb21wb25lbnRzL1BpZUNoYXJ0LmpzeFwiO1xuaW1wb3J0IHtNYWluTmF2YmFyfSBmcm9tIFwiY29tcG9uZW50cy9NYWluTmF2YmFyLmpzeFwiO1xuaW1wb3J0IHtNb2RhbFRyaWdnZXJ9IGZyb20gXCJjb21wb25lbnRzL01vZGFsVHJpZ2dlci5qc3hcIjtcbmltcG9ydCB7SW1wb3J0RGF0YU1vZGFsfSBmcm9tIFwiY29tcG9uZW50cy9JbXBvcnREYXRhTW9kYWwuanN4XCI7XG5pbXBvcnQge0ZhY2Vib29rU2hhcmVCdXR0b24sIFR3aXR0ZXJTaGFyZUJ1dHRvbn0gZnJvbSBcImNvbXBvbmVudHMvU29jaWFsU2hhcmluZy5qc3hcIjtcbmltcG9ydCB7VXBsb2FkRGF0YUJ1dHRvbn0gZnJvbSBcImNvbXBvbmVudHMvVXBsb2FkRGF0YUJ1dHRvbi5qc3hcIjtcblxuZXhwb3J0IGNsYXNzIERhc2hib2FyZFBhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgcnVuczogbnVsbCxcbiAgICAgICAgICAgIHNwZWVkR3JhcGg6IHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsczogW10sXG4gICAgICAgICAgICAgICAgICAgIGRhdGFzZXRzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiTXkgU2Vjb25kIGRhdGFzZXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IFwicmdiYSgxNTEsMTg3LDIwNSwwLjIpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IFwicmdiYSgxNTEsMTg3LDIwNSwxKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50Q29sb3I6IFwicmdiYSgxNTEsMTg3LDIwNSwxKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50U3Ryb2tlQ29sb3I6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50SGlnaGxpZ2h0RmlsbDogXCIjZmZmXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRIaWdobGlnaHRTdHJva2U6IFwicmdiYSgxNTEsMTg3LDIwNSwxKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IFtdXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9wdHM6IHtcbiAgICAgICAgICAgICAgICAgICAgc2NhbGVMYWJlbDogZnVuY3Rpb24oIHZhbCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWwudmFsdWUgKyBcIiBrbS9oXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaXN0YW5jZUdyYXBoOiB7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhc2V0czogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIk15IFNlY29uZCBkYXRhc2V0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiBcInJnYmEoMTUxLDE4NywyMDUsMC4yKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZUNvbG9yOiBcInJnYmEoMTUxLDE4NywyMDUsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludENvbG9yOiBcInJnYmEoMTUxLDE4NywyMDUsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludFN0cm9rZUNvbG9yOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludEhpZ2hsaWdodEZpbGw6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50SGlnaGxpZ2h0U3Ryb2tlOiBcInJnYmEoMTUxLDE4NywyMDUsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvcHRzOiB7XG4gICAgICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IGZ1bmN0aW9uKCB2YWwgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsLnZhbHVlICsgXCIgbVwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdmFyIGRhdGUgPSAobmV3IERhdGUoKSk7XG4gICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIDcpO1xuICAgICAgICBkYXRlID0gZGF0ZS50b0lTT1N0cmluZygpLnN1YnN0cmluZygwLCAxMCk7XG5cbiAgICAgICAgJC5nZXQoXCIvYXBpL3J1bnNfc2luY2VfZGF0ZS9cIiArIGRhdGUsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzICE9IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNwZWVkR3JhcGggPSB0aGlzLnN0YXRlLnNwZWVkR3JhcGg7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlR3JhcGggPSB0aGlzLnN0YXRlLmRpc3RhbmNlR3JhcGg7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgcnVuczogcmVzdWx0LnJ1bnNcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHNwZWVkR3JhcGguZGF0YS5sYWJlbHMgPSBbXTtcbiAgICAgICAgICAgICAgICBzcGVlZEdyYXBoLmRhdGEuZGF0YXNldHNbMF0uZGF0YSA9IFtdO1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlR3JhcGguZGF0YS5sYWJlbHMgPSBbXTtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZUdyYXBoLmRhdGEuZGF0YXNldHNbMF0uZGF0YSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgbGV0IGNvdW50cyA9IFswLDAsMCwwLDAsMCwwXTtcbiAgICAgICAgICAgICAgICBsZXQgc3BlZWRzID0gWzAsMCwwLDAsMCwwLDBdO1xuICAgICAgICAgICAgICAgIGxldCBkaXN0YW5jZXMgPSBbMCwwLDAsMCwwLDAsMF07XG5cbiAgICAgICAgICAgICAgICBsZXQgd2Vla2RheXMgPSBbXCJTdW5kYXlcIiwgXCJNb25kYXlcIiwgXCJUdWVzZGF5XCIsIFwiV2VkbmVzZGF5XCIsIFwiVGh1cnNkYXlcIiwgXCJGcmlkYXlcIiwgXCJTYXR1cmRheVwiXTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0LnJ1bnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJ1biA9IHJlc3VsdC5ydW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbW9tZW50ID0gd2luZG93LmFwcC5tb21lbnQoIHJ1bi5zdGFydF90aW1lICogMTAwMCApO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGF5ID0gbW9tZW50LndlZWtkYXkoKTtcblxuICAgICAgICAgICAgICAgICAgICBjb3VudHNbZGF5XSsrO1xuICAgICAgICAgICAgICAgICAgICBzcGVlZHNbZGF5XSArPSBydW4uYXZlcmFnZV9zcGVlZDtcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2VzW2RheV0gKz0gcnVuLmRpc3RhbmNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50RGF5ID0gd2luZG93LmFwcC5tb21lbnQoKS53ZWVrZGF5KCk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGF5ID0gKGN1cnJlbnREYXkgKyBpICsgMSkgJSA3O1xuICAgICAgICAgICAgICAgICAgICBsZXQgcnVuID0gcmVzdWx0LnJ1bnNbZGF5XTtcbiAgICAgICAgICAgICAgICAgICAgc3BlZWRHcmFwaC5kYXRhLmxhYmVscy5wdXNoKHdlZWtkYXlzW2RheV0pO1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3BlZWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGNvdW50c1tkYXldID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwZWVkID0gKHNwZWVkc1tkYXldIC8gY291bnRzW2RheV0pICogNjAgKiA2MCAvIDEwMDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3BlZWQgPSBzcGVlZC50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICBzcGVlZEdyYXBoLmRhdGEuZGF0YXNldHNbMF0uZGF0YS5wdXNoKHNwZWVkKTtcblxuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZUdyYXBoLmRhdGEubGFiZWxzLnB1c2god2Vla2RheXNbZGF5XSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkaXN0YW5jZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmICggY291bnRzW2RheV0gPiAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBkaXN0YW5jZXNbZGF5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IGRpc3RhbmNlLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlR3JhcGguZGF0YS5kYXRhc2V0c1swXS5kYXRhLnB1c2goZGlzdGFuY2UpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICBzcGVlZEdyYXBoOiBzcGVlZEdyYXBoLFxuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZUdyYXBoOiBkaXN0YW5jZUdyYXBoLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcblxuICAgICAgICB2YXIgcGllQ2hhcnREYXRhID0gIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogMzAwLFxuICAgICAgICAgICAgICAgIGNvbG9yOlwiI0Y3NDY0QVwiLFxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodDogXCIjRkY1QTVFXCIsXG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiUmVkXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IDUwLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM0NkJGQkRcIixcbiAgICAgICAgICAgICAgICBoaWdobGlnaHQ6IFwiIzVBRDNEMVwiLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIkdyZWVuXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IDEwMCxcbiAgICAgICAgICAgICAgICBjb2xvcjogXCIjRkRCNDVDXCIsXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0OiBcIiNGRkM4NzBcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJZZWxsb3dcIlxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuXG4gICAgICAgIHZhciBiYXJDaGFydGRhdGEgPSB7XG4gICAgICAgICAgICBsYWJlbHM6IFtcIkphbnVhcnlcIiwgXCJGZWJydWFyeVwiLCBcIk1hcmNoXCIsIFwiQXByaWxcIiwgXCJNYXlcIiwgXCJKdW5lXCIsIFwiSnVseVwiXSxcbiAgICAgICAgICAgIGRhdGFzZXRzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJNeSBGaXJzdCBkYXRhc2V0XCIsXG4gICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogXCJyZ2JhKDIyMCwyMjAsMjIwLDAuNSlcIixcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IFwicmdiYSgyMjAsMjIwLDIyMCwwLjgpXCIsXG4gICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodEZpbGw6IFwicmdiYSgyMjAsMjIwLDIyMCwwLjc1KVwiLFxuICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRTdHJva2U6IFwicmdiYSgyMjAsMjIwLDIyMCwxKVwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBbNjUsIDU5LCA4MCwgODEsIDU2LCA1NSwgNDBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIk15IFNlY29uZCBkYXRhc2V0XCIsXG4gICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogXCJyZ2JhKDE1MSwxODcsMjA1LDAuNSlcIixcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IFwicmdiYSgxNTEsMTg3LDIwNSwwLjgpXCIsXG4gICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodEZpbGw6IFwicmdiYSgxNTEsMTg3LDIwNSwwLjc1KVwiLFxuICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRTdHJva2U6IFwicmdiYSgxNTEsMTg3LDIwNSwxKVwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBbMjgsIDQ4LCA0MCwgMTksIDg2LCAyNywgOTBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciByYWRhckNoYXJ0RGF0YSA9IHtcbiAgICAgICAgICAgIGxhYmVsczogW1wiRWF0aW5nXCIsIFwiRHJpbmtpbmdcIiwgXCJTbGVlcGluZ1wiLCBcIkRlc2lnbmluZ1wiLCBcIkNvZGluZ1wiLCBcIkN5Y2xpbmdcIiwgXCJSdW5uaW5nXCJdLFxuICAgICAgICAgICAgZGF0YXNldHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIk15IEZpcnN0IGRhdGFzZXRcIixcbiAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiBcInJnYmEoMjIwLDIyMCwyMjAsMC4yKVwiLFxuICAgICAgICAgICAgICAgICAgICBzdHJva2VDb2xvcjogXCJyZ2JhKDIyMCwyMjAsMjIwLDEpXCIsXG4gICAgICAgICAgICAgICAgICAgIHBvaW50Q29sb3I6IFwicmdiYSgyMjAsMjIwLDIyMCwxKVwiLFxuICAgICAgICAgICAgICAgICAgICBwb2ludFN0cm9rZUNvbG9yOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRIaWdobGlnaHRGaWxsOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRIaWdobGlnaHRTdHJva2U6IFwicmdiYSgyMjAsMjIwLDIyMCwxKVwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBbNjUsIDU5LCA5MCwgODEsIDU2LCA1NSwgNDBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIk15IFNlY29uZCBkYXRhc2V0XCIsXG4gICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogXCJyZ2JhKDE1MSwxODcsMjA1LDAuMilcIixcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IFwicmdiYSgxNTEsMTg3LDIwNSwxKVwiLFxuICAgICAgICAgICAgICAgICAgICBwb2ludENvbG9yOiBcInJnYmEoMTUxLDE4NywyMDUsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRTdHJva2VDb2xvcjogXCIjZmZmXCIsXG4gICAgICAgICAgICAgICAgICAgIHBvaW50SGlnaGxpZ2h0RmlsbDogXCIjZmZmXCIsXG4gICAgICAgICAgICAgICAgICAgIHBvaW50SGlnaGxpZ2h0U3Ryb2tlOiBcInJnYmEoMTUxLDE4NywyMDUsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogWzI4LCA0OCwgNDAsIDE5LCA5NiwgMjcsIDEwMF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGNvbnRlbnQgPSBudWxsO1xuXG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5ydW5zIHx8IHRoaXMuc3RhdGUucnVucy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgY29udGVudCA9IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBhbGVydCBhbGVydC13YXJuaW5nXCIgcm9sZT1cImFsZXJ0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJjZW50ZXItdGV4dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFlvdSBoYXZlbid0IGFkZGVkIGFueSBydW4gZGF0YSB0aGlzIHdlZWssIHdoZW4geW91IGltcG9ydCBhIG5ldyBydW4geW91J2xsIGJlIGFibGUgdG8gc2VlIGluZm9ybWF0aW9uIGFib3V0IHlvdXIgZml0bmVzcyBoZXJlLlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjZW50ZXItdGV4dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNb2RhbFRyaWdnZXIgbW9kYWw9ezxJbXBvcnREYXRhTW9kYWwgLz59IGJ1dHRvbj17dHJ1ZX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IG5hdmJhci1idG4gbWFyZ2luLWxlZnQgbWFyZ2luLXJpZ2h0XCIgYnV0dG9uVGV4dD17PFVwbG9hZERhdGFCdXR0b24gLz59IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPE1haW5OYXZiYXIgLz5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICB7Y29udGVudH1cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyPlJlY2VudCBSdW5zPC9oMj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TdGFydCBUaW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+RHVyYXRpb248L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5EaXN0YW5jZSBDb3ZlcmVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+QWN0aW9uPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucnVucyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucnVucy5tYXAoIGZ1bmN0aW9uKHJ1bikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57d2luZG93LmFwcC5tb21lbnQocnVuLnN0YXJ0X3RpbWUgKiAxMDAwKS5mb3JtYXQod2luZG93LmFwcC50aW1lRm9ybWF0KX0ge3dpbmRvdy5hcHAubW9tZW50KHJ1bi5zdGFydF90aW1lICogMTAwMCkuZm9ybWF0KHdpbmRvdy5hcHAuZGF5Rm9ybWF0KX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+eyBwYXJzZUludChydW4uZHVyYXRpb24gLyA2MCkgfSBtaW5zIHtydW4uZHVyYXRpb24gJSA2MH0gc2Vjb25kczwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57TWF0aC5yb3VuZChydW4uZGlzdGFuY2UpfSBtPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjxhIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGhyZWY9e1wiL3J1bi9cIiArIHJ1bi5faWR9PjxpIGNsYXNzTmFtZT1cImlvbiBpb24tZXllXCIgLz48L2E+PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkgOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTZcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDI+QXZlcmFnZSBTcGVlZCBPdmVyIFRoZSBQYXN0IFdlZWs8L2gyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5lQ2hhcnQgZGF0YT17dGhpcy5zdGF0ZS5zcGVlZEdyYXBoLmRhdGF9IG9wdHM9e3RoaXMuc3RhdGUuc3BlZWRHcmFwaC5vcHRzfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy02XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyPkRpc3RhbmNlIENvdmVyZWQgT3ZlciBUaGUgUGFzdCBXZWVrPC9oMj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluZUNoYXJ0IGRhdGE9e3RoaXMuc3RhdGUuZGlzdGFuY2VHcmFwaC5kYXRhfSBvcHRzPXt0aGlzLnN0YXRlLmRpc3RhbmNlR3JhcGgub3B0c30gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7TWFpbk5hdmJhcn0gZnJvbSBcImNvbXBvbmVudHMvTWFpbk5hdmJhci5qc3hcIjtcblxuLypcbiAqIFNpbXBsZSBwYWdlIHNlcnZlZCB3aGVuIGEgcm91dGUgY2Fubm90IGJlIGZvdW5kLlxuICovXG5leHBvcnQgY2xhc3MgRmlsZU5vdEZvdW5kUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8TWFpbk5hdmJhciAvPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoMT40MDQ8L2gxPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtNb2RhbFRyaWdnZXJ9IGZyb20gXCJjb21wb25lbnRzL01vZGFsVHJpZ2dlci5qc3hcIjtcbmltcG9ydCB7U2hhcmVSdW5Nb2RhbH0gZnJvbSBcImNvbXBvbmVudHMvU2hhcmVSdW5Nb2RhbC5qc3hcIjtcbmltcG9ydCB7TWFpbk5hdmJhcn0gZnJvbSBcImNvbXBvbmVudHMvTWFpbk5hdmJhci5qc3hcIjtcbmltcG9ydCB7TWFwfSBmcm9tIFwiY29tcG9uZW50cy9NYXAuanN4XCI7XG5pbXBvcnQge0xpbmVDaGFydH0gZnJvbSBcImNvbXBvbmVudHMvTGluZUNoYXJ0LmpzeFwiO1xuXG5leHBvcnQgY2xhc3MgUnVuRGF0YVBhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgcnVuOiBmYWxzZSxcbiAgICAgICAgICAgIGNoYXJ0RGF0YToge1xuICAgICAgICAgICAgICAgIGxhYmVsczogW1wiSmFudWFyeVwiLCBcIkZlYnJ1YXJ5XCIsIFwiTWFyY2hcIiwgXCJBcHJpbFwiLCBcIk1heVwiLCBcIkp1bmVcIiwgXCJKdWx5XCJdLFxuICAgICAgICAgICAgICAgIGRhdGFzZXRzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIk15IEZpcnN0IGRhdGFzZXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogXCJyZ2JhKDE1MSwxODcsMjA1LDAuMilcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZUNvbG9yOiBcInJnYmEoMTUxLDE4NywyMDUsMSlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50Q29sb3I6IFwicmdiYSgxNTEsMTg3LDIwNSwxKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRTdHJva2VDb2xvcjogXCIjZmZmXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludEhpZ2hsaWdodEZpbGw6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRIaWdobGlnaHRTdHJva2U6IFwicmdiYSgxNTEsMTg3LDIwNSwxKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogWzY1LCA1OSwgODAsIDgxLCA1NiwgNTUsIDQwXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoYXJ0T3B0czoge1xuICAgICAgICAgICAgICAgIHNjYWxlU2hvd0dyaWRMaW5lcyA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRhdGFzZXRGaWxsIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY2FsZVNob3dIb3Jpem9udGFsTGluZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgc2NhbGVTaG93VmVydGljYWxMaW5lczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzaG93VG9vbHRpcHM6IHRydWUsXG4gICAgICAgICAgICAgICAgcG9pbnRIaXREZXRlY3Rpb25SYWRpdXMgOiAxLFxuICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS52YWx1ZSArIFwiIGttL2hyXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRvb2x0aXBUZW1wbGF0ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICggKHZhbHVlLnZhbHVlKS50b0ZpeGVkKCAxICkgKyBcIiBrbS9oclwiIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgICQuZ2V0KFwiL2FwaS9ydW4vXCIgKyB0aGlzLnByb3BzLnJ1bklkLCBmdW5jdGlvbihyZXN1bHQpIHtcblxuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzICE9IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHJ1bjogcmVzdWx0LFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLnN0YXRlLmNoYXJ0RGF0YTtcbiAgICAgICAgICAgICAgICB2YXIgbGFiZWxzID0gW107XG4gICAgICAgICAgICAgICAgdmFyIHNwZWVkcyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gcHJldHR5X3ByaW50X3RpbWUoIHNlY29uZHMgKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtaW51dGVzID0gTWF0aC5mbG9vciggc2Vjb25kcyAvIDYwICkgJSA2MDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhvdXJzID0gTWF0aC5mbG9vciggc2Vjb25kcyAvIDM2MDAgKSAlIDI0O1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdHIgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGhvdXJzID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBob3VycyArIFwiaCBcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdHIgKz0gbWludXRlcyArIFwibVwiO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBpbnRlcnZhbCA9IHBhcnNlSW50KCByZXN1bHQuc3BlZWRfZ3JhcGgueC5sZW5ndGggLyAxMCApO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQuc3BlZWRfZ3JhcGgueC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbGFiZWwgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGkgJSBpbnRlcnZhbCA9PSAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWwgPSBwcmV0dHlfcHJpbnRfdGltZSggcGFyc2VJbnQoIHJlc3VsdC5zcGVlZF9ncmFwaC54W2ldICkgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBsYWJlbCApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxhYmVscy5wdXNoKGxhYmVsKTtcbiAgICAgICAgICAgICAgICAgICAgc3BlZWRzLnB1c2gocmVzdWx0LnNwZWVkX2dyYXBoLnlbaV0gKiA2MCAqIDYwIC8gMTAwMCk7IC8vIHRvIGttcGhcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkYXRhLmxhYmVscyA9IGxhYmVscztcbiAgICAgICAgICAgICAgICBkYXRhLmRhdGFzZXRzWzBdLmRhdGEgPSBzcGVlZHM7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtjaGFydERhdGE6IGRhdGF9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHNoYXJlUnVuKGUpIHtcbiAgICAgICAgdmFyIG1hcFVybCA9IHRoaXMucmVmcy5tYXAuZ2V0U3RhdGljVXJsKCk7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRoaXMuaW1ndXJVcGxvYWQuYmluZCh0aGlzKTtcblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICAgICAgICB1cmw6IFwiaHR0cHM6Ly9hcGkuaW1ndXIuY29tLzMvaW1hZ2VcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdDbGllbnQtSUQgZDhmNTkwMzliZGI5ZmFkJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBpbWFnZTogbWFwVXJsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogY2FsbGJhY2tcblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbWd1clVwbG9hZChkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHttYXBVcmw6IGRhdGFbXCJkYXRhXCJdW1wibGlua1wiXSwgc2hhcmluZ1J1bjogdHJ1ZX0pO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcblxuICAgICAgICB2YXIgYm9keSA9IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgPHA+VGhpcyBydW4gZG9lcyBub3QgZXhpc3QuPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG5cbiAgICAgICAgdmFyIG1vZGFsID0gPFNoYXJlUnVuTW9kYWwgcmVmPVwibW9kYWxcIiBpbWFnZVVybD17dGhpcy5zdGF0ZS5tYXBVcmx9IC8+O1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuc2hhcmluZ1J1bikge1xuICAgICAgICAgICAgbW9kYWwgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucnVuKSB7XG4gICAgICAgICAgICBib2R5ID0gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwiZnVsbC13aWR0aFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFlvdXIgUnVuIDxzbWFsbD57d2luZG93LmFwcC5tb21lbnQodGhpcy5zdGF0ZS5ydW4uc3RhcnRfdGltZSAqIDEwMDApLmZvcm1hdCh3aW5kb3cuYXBwLmRheUZvcm1hdCl9PC9zbWFsbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBmbG9hdC1yaWdodFwiIG9uQ2xpY2s9e3RoaXMuc2hhcmVSdW4uYmluZCh0aGlzKX0+U2hhcmUgUnVuPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2gxPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgbWFyZ2luLXRvcFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtMyBjZW50ZXItdGV4dFwiPjxoMz5Ub3RhbCBEaXN0YW5jZTwvaDM+IHtNYXRoLnJvdW5kKHRoaXMuc3RhdGUucnVuLmRpc3RhbmNlKX0gbTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtMyBjZW50ZXItdGV4dFwiPjxoMz5BdmVyYWdlIFNwZWVkPC9oMz4geyh0aGlzLnN0YXRlLnJ1bi5hdmVyYWdlX3NwZWVkICogNjAgKiA2MCAvIDEwMDApLnRvRml4ZWQoMil9IGttL2g8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTMgY2VudGVyLXRleHRcIj48aDM+RHVyYXRpb248L2gzPiB7IHBhcnNlSW50KHRoaXMuc3RhdGUucnVuLmR1cmF0aW9uIC8gNjApIH0gbWlucyB7dGhpcy5zdGF0ZS5ydW4uZHVyYXRpb24gJSA2MH0gc2Vjb25kczwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtMyBjZW50ZXItdGV4dFwiPjxoMz5LaWxvam91bGVzIEJ1cm5lZDwvaDM+e01hdGgucm91bmQodGhpcy5zdGF0ZS5ydW4ua2lsb2pvdWxlcyl9IGtqPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aHIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxNYXAgcmVmPVwibWFwXCIgd2F5cG9pbnRzPXt0aGlzLnN0YXRlLnJ1bi53YXlwb2ludHN9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICB7bW9kYWx9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxociAvPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY2VudGVyLXRleHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDM+WW91ciBTcGVlZCBCcmVha2Rvd248L2gzPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5lQ2hhcnQgZGF0YT17dGhpcy5zdGF0ZS5jaGFydERhdGF9IG9wdHM9e3RoaXMuc3RhdGUuY2hhcnRPcHRzfSB3aWR0aD17MTE0MH0gaGVpZ2h0PXsyNDB9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPE1haW5OYXZiYXIgLz5cbiAgICAgICAgICAgICAgICB7Ym9keX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7TGluZUNoYXJ0fSBmcm9tIFwiY29tcG9uZW50cy9MaW5lQ2hhcnQuanN4XCI7XG5pbXBvcnQge0JhckNoYXJ0fSBmcm9tIFwiY29tcG9uZW50cy9CYXJDaGFydC5qc3hcIjtcbmltcG9ydCB7UmFkYXJDaGFydH0gZnJvbSBcImNvbXBvbmVudHMvUmFkYXJDaGFydC5qc3hcIjtcbmltcG9ydCB7UGllQ2hhcnR9IGZyb20gXCJjb21wb25lbnRzL1BpZUNoYXJ0LmpzeFwiO1xuaW1wb3J0IHtNYWluTmF2YmFyfSBmcm9tIFwiY29tcG9uZW50cy9NYWluTmF2YmFyLmpzeFwiO1xuaW1wb3J0IHtNb2RhbFRyaWdnZXJ9IGZyb20gXCJjb21wb25lbnRzL01vZGFsVHJpZ2dlci5qc3hcIjtcbmltcG9ydCB7SW1wb3J0RGF0YU1vZGFsfSBmcm9tIFwiY29tcG9uZW50cy9JbXBvcnREYXRhTW9kYWwuanN4XCI7XG5cbmV4cG9ydCBjbGFzcyBSdW5IaXN0b3J5UGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBydW5zOiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVSdW5zKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlUnVucygpIHtcbiAgICAgICAgJC5nZXQoXCIvYXBpL2FsbF9ydW5zXCIsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzICE9IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHJ1bnM6IHJlc3VsdFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGRlbGV0ZVJ1bihydW4sIGUpIHtcbiAgICAgICAgLy8gdGhpcyBpcyBib3VuZCB0byB0aGUgcnVuIGluc3RhbmNlXG5cbiAgICAgICAgaWYgKGNvbmZpcm0oXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgcnVuP1wiKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocnVuKTtcblxuICAgICAgICAgICAgJC5nZXQoXCIvYXBpL2RlbGV0ZV9ydW4vXCIgKyBydW4uX2lkW1wiJG9pZFwiXSwgZnVuY3Rpb24ocmVzdWx0KSB7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgIT0gZmFsc2UpIHtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVJ1bnMoKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb3VsZCBub3QgZGVsZXRlIHJ1bi5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxNYWluTmF2YmFyIC8+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyPlJ1biBIaXN0b3J5PC9oMj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TdGFydCBUaW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+RW5kIFRpbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5BY3Rpb248L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5ydW5zID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5ydW5zLm1hcCggZnVuY3Rpb24ocnVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt3aW5kb3cuYXBwLm1vbWVudChydW4uc3RhcnRfdGltZSAqIDEwMDApLmZvcm1hdCh3aW5kb3cuYXBwLnRpbWVGb3JtYXQpfSB7d2luZG93LmFwcC5tb21lbnQocnVuLnN0YXJ0X3RpbWUgKiAxMDAwKS5mb3JtYXQod2luZG93LmFwcC5kYXlGb3JtYXQpfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57d2luZG93LmFwcC5tb21lbnQocnVuLmVuZF90aW1lICogMTAwMCkuZm9ybWF0KHdpbmRvdy5hcHAudGltZUZvcm1hdCl9IHt3aW5kb3cuYXBwLm1vbWVudChydW4uZW5kX3RpbWUgKiAxMDAwKS5mb3JtYXQod2luZG93LmFwcC5kYXlGb3JtYXQpfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGhyZWY9e1wiL3J1bi9cIiArIHJ1bi5faWRbXCIkb2lkXCJdfT48aSBjbGFzc05hbWU9XCJpb24gaW9uLWV5ZVwiIC8+PC9hPiA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIG9uQ2xpY2s9e3RoaXMuZGVsZXRlUnVuLmJpbmQodGhpcywgcnVuKX0+PGkgY2xhc3NOYW1lPVwiaW9uIGlvbi10cmFzaC1iXCIgLz48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKSA6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtEYXNoYm9hcmRQYWdlfSBmcm9tIFwicGFnZXMvRGFzaGJvYXJkUGFnZS5qc3hcIjtcbmltcG9ydCB7dHJhbnNpdGlvbn0gZnJvbSBcInBhZ2VzL2NvbnRyb2xsZXJzL1BhZ2VUcmFuc2l0aW9uLmpzeFwiO1xuXG4vKlxuICogSGFuZGxlcyB0cmFuc2l0aW9uIHRvIHRoZSBkYXNoYm9hcmQgcGFnZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIERhc2hib2FyZENvbnRyb2xsZXIoY3R4LCBuZXh0KSB7XG4gICAgdHJhbnNpdGlvbihjdHgsIG5leHQsIDxEYXNoYm9hcmRQYWdlIC8+KTtcbn1cbiIsImltcG9ydCB7RmlsZU5vdEZvdW5kUGFnZX0gZnJvbSBcInBhZ2VzL0ZpbGVOb3RGb3VuZFBhZ2UuanN4XCI7XG5pbXBvcnQge3RyYW5zaXRpb259IGZyb20gXCJwYWdlcy9jb250cm9sbGVycy9QYWdlVHJhbnNpdGlvbi5qc3hcIjtcblxuLypcbiAqIEhhbmRsZXMgdHJhbnNpdGlvbiB0byB0aGUgNDA0IHBhZ2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBGaWxlTm90Rm91bmRDb250cm9sbGVyKGN0eCwgbmV4dCkge1xuICAgIHRyYW5zaXRpb24oY3R4LCBuZXh0LCA8RmlsZU5vdEZvdW5kUGFnZSAvPik7XG59XG4iLCIvKlxuICogSGFuZGxlcyB0aGUgdHJhbnNpdGlvbiBmcm9tIG9uZSBwYWdlIHRvIHRoZSBuZXh0LlxuICogTW91bnRzIHRoZSBuZXcgY29tcG9uZW50LCBhbmQgcmVtb3ZlcyB0aGUgcHJldmlvdXMgb25jZVxuICogdGhlIHBhZ2UgaGFzIGJlZW4gYW5pbWF0ZWQgaW4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2l0aW9uKGN0eCwgbmV4dCwgY29tcG9uZW50KSB7XG4gICAgaWYgKCFjdHguaW5pdCkge1xuICAgICAgICB3aW5kb3cuYXBwLm1vdW50UG9pbnQuY2xhc3NMaXN0LmFkZCgndHJhbnNpdGlvbicpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB3aW5kb3cuYXBwLm1vdW50UG9pbnQuY2xhc3NMaXN0LnJlbW92ZSgndHJhbnNpdGlvbicpO1xuICAgICAgICB9LCAzNTApO1xuICAgIH1cblxuICAgIFJlYWN0LnJlbmRlcihjb21wb25lbnQsIHdpbmRvdy5hcHAubW91bnRQb2ludCk7XG59XG4iLCJpbXBvcnQge1J1bkRhdGFQYWdlfSBmcm9tIFwicGFnZXMvUnVuRGF0YVBhZ2UuanN4XCI7XG5pbXBvcnQge3RyYW5zaXRpb259IGZyb20gXCJwYWdlcy9jb250cm9sbGVycy9QYWdlVHJhbnNpdGlvbi5qc3hcIjtcblxuLypcbiAqIEhhbmRsZXMgdHJhbnNpdGlvbiB0byB0aGUgcnVuIGRhdGEgcGFnZS4gQWNjZXB0cyBhIHJ1biBJRCBhc1xuICogYSBwYXJhbWV0ZXIsIHdoaWNoIGlzIHBhc3NlZCB0byB0aGUgcGFnZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFJ1bkRhdGFDb250cm9sbGVyKGN0eCwgbmV4dCkge1xuICAgIHRyYW5zaXRpb24oY3R4LCBuZXh0LCA8UnVuRGF0YVBhZ2UgcnVuSWQ9e2N0eC5wYXJhbXMucnVufS8+KTtcbn1cbiIsImltcG9ydCB7UnVuSGlzdG9yeVBhZ2V9IGZyb20gXCJwYWdlcy9SdW5IaXN0b3J5UGFnZS5qc3hcIjtcbmltcG9ydCB7dHJhbnNpdGlvbn0gZnJvbSBcInBhZ2VzL2NvbnRyb2xsZXJzL1BhZ2VUcmFuc2l0aW9uLmpzeFwiO1xuXG4vKlxuICogSGFuZGxlcyB0cmFuc2l0aW9uIHRvIHRoZSBydW4gaGlzdG9yeSBwYWdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gUnVuSGlzdG9yeUNvbnRyb2xsZXIoY3R4LCBuZXh0KSB7XG4gICAgdHJhbnNpdGlvbihjdHgsIG5leHQsIDxSdW5IaXN0b3J5UGFnZSAvPik7XG59XG4iXX0=
