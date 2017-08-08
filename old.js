$(document).ready(function() {

	$.holdReady(true);

	var scripts = ["js/plugins.js",
					"js/summary.js",
					"js/translations.js",
					"js/sounds.js",
					"js/array_methods.js",
					"js/image_methods.js",
					"js/task_config.js"];
	Modernizr.load([
	{
		load: scripts,
		complete: function() {
			doTesting();
		}
	}
	]);

	$.holdReady(false);

});

function doTesting() {

	var debugging = true;
//	var debugging = false;
//	var output_translations = true;
	var output_translations = false;

	var loadedImagesCount = 0;
	var totalImagesToLoad = 0;
	var translations = [];

	// versions
	var version = 1.0; // 1.0 Aug 2014

	// codes
	var codes = {
			version: "vers",
			browser: "brow",
			browserVersion: "brvs",
			test: "TEST",
			date: "date",
			start: "strt",
			tp: "tpos",
			tn: "tneg",
			fp: "fpos",
			fn: "fneg",
			maxout: "maxo",
			anti: "anti",
			post: "post",
			pant: "pant",
			press: "press",
			end: "endt",
			timeout: "tout",
			tooManyErrors: "errs",
			guess: "guess",
			final: "final",
			results: "rslt",
			maxouts2: "maxed2"
		};
	var blackColor = "#000000";
	var greenColor = "#005200";
	var tableColor = blackColor;
	var targetBackgroundColor = blackColor;
	var gamblingBackgroundColor = tableColor;
	var fractalBackgroundColor = tableColor;
	var gapBackgroundColor = targetBackgroundColor;
	var moodBackgroundColor = targetBackgroundColor;
	var moodBackgroundColor = "#444444";
	var alertTextColor = "#FFFFFF";
	var slops = 60;

	var adjustedCanvasYet = false;

	// cursor position stuff
	var canvasMousePosition = {x: 0, y: 0}; // local canvas coordinates
	var documentMousePosition = {x: 0, y: 0}; // global document coordinates

	// canvas stuff
	var canvas = $('#drawcanvas')[0];
	var ctx = canvas.getContext('2d');

	// map touch events (using Modernizr)
	var useTouchEvents = Modernizr.touch;
	var eventName = useTouchEvents ? 'touchstart' : 'mousedown';
	document.addEventListener(eventName, handleMouseDown, false);

//	$(document).on(eventName, handleMouseDown); // only works on touch devices if you look at e.originalEvent.touches, not e.touches and seems less responsive.

	// are we on iPhone/iPod?
	var iPhone = (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i));

	// are we on an iPad?
	var iPad = navigator.userAgent.match(/iPad/i);

	// are we on IE?
	var ieVersion = checkIEVersion();
	printToConsole("IE Version: " + ieVersion);

	// prevent drag start and select start in our canvas
	// do nothing in the event handler except canceling the event
	$('#drawcanvas').ondragstart = function(e) {
		if (e && e.preventDefault) { e.preventDefault(); }
		if (e && e.stopPropagation) { e.stopPropagation(); }
		return false;
	}
	// do nothing in the event handler except canceling the event
	$('#drawcanvas').onselectstart = function(e) {
		if (e && e.preventDefault) { e.preventDefault(); }
		if (e && e.stopPropagation) { e.stopPropagation(); }
		return false;
	}

	// similarly for the surrounding document
	$(document.body).ontouchstart = function(e) {
		if (e && e.preventDefault) { e.preventDefault(); }
		if (e && e.stopPropagation) { e.stopPropagation(); }
		return false;
	}
	$(document.body).ontouchmove = function(e) {
		if (e && e.preventDefault) { e.preventDefault(); }
		if (e && e.stopPropagation) { e.stopPropagation(); }
		return false;
	}

	if (iPhone) {
		alert(translate("When using this small screen (not ideal!), try rotating it to see which orientation suits you better (and allows you to see the blue continue button which you need to move to the next task."));
	}

	var canvasPosition = {	// canvas left, top to x, y
		x: $('#drawcanvas').offset().left,
		y: $('#drawcanvas').offset().top
	};

	var parentRect = new Rect(canvasPosition.x, canvasPosition.y, canvas.parentNode.clientWidth, canvas.parentNode.clientHeight);

	printToConsole("parent rect: " + parentRect.string());

//	printToConsole("parent w: " + canvas.parentNode.clientWidth + ", h " + canvas.parentNode.clientHeight + ", top: " + canvasPosition.y);

	var testType = $("#testtype").html(); // "Test", not supporting "Practice"
	var dayNum = $("#day").html(); // "Test", not supporting "Practice"

	// key codes
	var yesKey = '75';
	var noKey = '68';
	var returnKey = '13';

	var yesKeys = [73, 74, 75, 76, 77, 79, 85, 188];
	var noKeys = [67, 68, 69, 70, 82, 83, 87, 88];

	var keyWidth = 510.0/2.0;
	var keyHeight = 400.0/2.0;
	var keyTop = canvas.height/2.0 - keyHeight/2.0;
	var dKeyLeft = 0.25 * canvas.width - keyWidth/2.0;
	var kKeyLeft = 0.75 * canvas.width - keyWidth/2.0;

	var trainingTextFontSize = 24;
	var taskTextFontSize = 16;
	var alertTextFontSize = 24;
	var trainingTextFont = "px Helvetica";
	var wordMemoryTextFont = "px Georgia,Palatino,serif,sans-serif";

	// sounds
	var errorSound = 0; // "sounds/incorrect.mp3/.wav"
	var antiSound = 1; // "sounds/incorrectanti.mp3/.wav"
	var clickSound = 2; // "sounds/keyclick.mp3/.wav"
	var applauseSound = 3; // "sounds/applause1.mp3/.wav"
	var clapsSound = 4; // "sounds/claps1.mp3/.wav"
	var ohSound = 5; // "sounds/oh.mp3/.wav"
	var gahSound = 6; // "sounds/gah.mp3/.wav"
	var totalSounds = gahSound + 1;

    // game variables
	var Stages = new Enum(['Setup', 'ShowingAlert', 'PreStart', 'Shuffling', 'StartTrial', 'PreStimulus', 'Stimulus', 'PreMinRT', 'ExpectResponse', 'Response', 'Feedback', 'EndFeedback', 'RandomISI', 'EndTask']);
	var initialDelay = 0;

	var States = new Enum(['Waiting', 'WhiteCircles', 'Response', 'Feedback']);
	var FracPhases = new Enum(['Slider1', 'Slider2', 'Trials1', 'Trials2', 'Slider3', 'Slider4']);

	var commonInstruction = "";
	var maxOutAlertShown = false; // used to ensure they don't do 2 maxouts

	// audio context sound
	var audioContext = "";
	var bufferLoader = null;

	// enums
	var YesNo = new Enum(['No', 'Yes']);
	var Colors;

	// task variables
	var target, targetLoader;

	var leftWheel, rightWheel, wheelLoader;
	var fractalLoader;
	var gapLoader;
	var moodLoader, moodIndex;
	var resultsArray;

	var taskOrder, currentTask, stage, anticipationInTrial;
	var currentTrial, frame, lastKey, lastReactionTime, lastEvent, experimentFinished = false;
	var trainingText, dKeyButton, kKeyButton, continueButton, keyDownInterval;
	var alertButton;
	var experimentTimer, stageFirer, reactionTimer, maxoutFirer, taskOutFirer;
	var responses, uploadedTaskData = false;
	var consecutiveErrors;

	var d_key, d_key_hilited, k_key, k_key_hilited, continue_button, continue_button_hilited, alert_bg, alert_bg_hilited = 0;

	init();
	outputTranslations();

	// browser handling for smooth animation
	var FRAMES_PER_SECOND = 60;
	var ONE_FRAME_TIME = 1000.0/FRAMES_PER_SECOND;

    window.requestAnimFrame = (function() {
    		return (window.requestAnimationFrame ||
           		window.webkitRequestAnimationFrame ||
            	window.mozRequestAnimationFrame    ||
            	window.oRequestAnimationFrame      ||
            	window.msRequestAnimationFrame     ||
            	// not supported as in IE 9, fall back to setInterval
            	function(callback) {
            		window.setTimeout(callback, ONE_FRAME_TIME);
            	}
            );
    })();

    // call the animation loop self-invoking function...
    (function animloop() {
		requestAnimFrame(animloop, canvas); // first to execute before frame is displayed
		updateGame();
    	drawGame();
    })();

    // updateGame controls the game logic for each "frame"
    function updateGame() {
    	frame++;
    	if (frame >= FRAMES_PER_SECOND) {
    		frame = 0;
    	}

    	if (!experimentFinished) {
			// get logic from current task logic function
			taskOrder[currentTask].logic();
		}
    }

    // draw game draws the current frame
    function drawGame() {
    	if (experimentFinished) return;

    	// handled by task logic & stage

    	// what stage are we in?
    	printToConsole("Stage: " + stage);

    	if (!orientationIsLandscape()) {
    		alert("Please turn back to landscape mode to continue!");
    	}

    	// for debugging
    	paintInfoText();
    }

    function adjustCanvasHeightToScreen(fudge) {
    	var iPad = navigator.userAgent.match(/iPad/i);
		if (iPad) {
			if (!adjustedCanvasYet) {
				// set canvas bottom to match bottom of screen
				// use existing parent rect (should not change orientation mid-test!)
				canvas.width = canvas.parentNode.clientWidth;
				canvas.height = canvas.parentNode.clientHeight - canvasPosition.y - fudge;
				adjustedCanvasYet = true;
				printToConsole("Adjusted canvas size");
			}

			printToConsole("canvas w: " + canvas.width + ", h: " + canvas.height);
		}
    }

    function useAppleFullScreen() {
//    	var iPad = navigator.userAgent.match(/iPad/i);
		if (document.fullscreenEnabled) {
            var canvasDiv = document.getElementById('canvas_div');
            canvasDiv.webkitRequestFullscreen();

			printToConsole("webkit request full screen called.");

			// set canvas to match whole of available space
//			canvas.width = canvas.parentNode.clientWidth;
//			canvas.height = canvas.parentNode.clientHeight + slops + 10;
		}
    }

    function exitAppleFullScreen() {
//    	var iPad = navigator.userAgent.match(/iPad/i);
		if (document.fullscreenEnabled && document.webkitFullscreenElement != 'undefined') {
            var canvasDiv = document.getElementById('canvas_div');
            canvasDiv.webkitExitFullscreen();

			printToConsole("webkit exit full screen called.");
    	}
    }

    function alertRect() {
		var alertWidth = 15.0 * canvas.width/16.0;
		var alertHeight = 15.0 * canvas.height/16.0;
		var alertLeft = canvas.width/32.0;
		var alertTop = 10 + canvas.height/32.0;

    	var ar = new Rect(alertLeft, alertTop, alertWidth, alertHeight);
		printToConsole("alert rect: " + ar.string());
    	return ar;
    }

    function continueButtonRect() {
    	var ar = alertRect();

		var continueWidth = 188;
		var continueHeight = 44;
		var continueLeft = ar.l + ar.w/2.0 - continueWidth/2.0;
		var continueTop = ar.b() - 2 * continueHeight;

		var cr = new Rect(continueLeft, continueTop, continueWidth, continueHeight);
		printToConsole("continue rect: " + cr.string());
    	return cr;
    }

	function init() {

		translations = init_translations();

		commonInstruction = translate('When you are ready to begin, click (or tap) the continue button or press the return key.');

		paintBackground(tableColor);

		var ar = alertRect();
		paintWrapText(translate("Loading..."), ar.l + slops, ar.t + slops, ar.w - 2*slops, ar.h - 2*slops, taskTextFontSize + 2*taskTextFontSize/3.0, alertTextFontSize, alertTextColor, true);

		loadAllImages(); // add all images required here

		initVariables();
	}

	function initVariables() {
		currentTask = 0;
		currentTrial = 0;
		stage = Stages.Setup;
		frame = -1;
		lastKey = 0;
		lastReactionTime = 0;

		// load tasks using initial (non-random), random, and final task functions with parameters (using external config file containing the constant or likely editable fields and translations)
		taskOrder = loadTasks(testType);
		// now add internally used functions to these so have their logic
		addTaskFunctions();

		// set up the timers
		experimentTimer = new Timer();
		experimentTimer.start();

		experimentFinished = false;

		keyDownInterval = 200;

		reactionTimer = new Timer();
		stageFirer = new Firer();
		maxoutFirer = new Firer();
		taskOutFirer = new Firer();

		responses = []; // start off empty
		resultsArray = []; // for final display of their results

		consecutiveErrors = 0;

		moodIndex = 0; // used to track these between tasks

		// audio context
		// check browser can upload results before start game
		if (!testAjaxRequestObject()) {
			experimentFinished = true;
		}

		audioContext = getAudioContext(); // works
		bufferLoader = new BufferLoader(audioContext, soundURLList(), finishedLoadingSounds);
		bufferLoader.load();

		// record the version
		recordResponse(codes.test, 0, codes.version, 0, 0, version);

		// record browser information
		var browser = navigator.userAgent; // find the browser information
		recordResponse(codes.test, 0, codes.browser, 0, 0, browser);

		var browserVersion = parseInt(navigator.appVersion); // integer version
		recordResponse(codes.test, 0, codes.browserVersion, 0, 0, browserVersion);

		// record test date stamp
		recordResponse(codes.test, 0, codes.date, 0, 0, dateStamp());
	}

	// TASK LOGIC FUNCTIONS
	function soundTestLogic() {
		switch(stage) {
			case Stages.Setup:
				if (loadedImagesCount < totalImagesToLoad) return;

				adjustCanvasHeightToScreen(70);

				stage = Stages.ShowingAlert;

				// waiting to start
				if (taskInstruction() != "") {
					// show instructions confirm box
					var txt = taskInstruction() + "\n\n" + commonInstruction;
					showAlertPanel(txt, true);

					stage = Stages.ShowingAlert;
				}
				else {
					stage = Stages.PreStart;
				}
				// begin the task
				recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.start, 0, 0, dateStamp());
				taskOutFirer.start(function() {taskTimeout()}, taskOrder[currentTask].timeout);
			break;

			case Stages.ShowingAlert:
			break;

			case Stages.PreStart:
				stage = Stages.EndTask;
			break;

			case Stages.StartTrial:
			break;

			case Stages.PreStimulus:
			break;

			case Stages.Stimulus:
			break;

			case Stages.PreMinRT:
			break;

			case Stages.ExpectResponse:
			break;

			case Stages.Response:
			break;

			case Stages.Feedback:
			break;

			case Stages.EndFeedback:
			break;

			case Stages.RandomISI:
			break;

			case Stages.EndTask:
				hideSoundButtons();
				taskOutFirer.stop();
				paintBackground(tableColor);
				recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.end, 0, 0, dateStamp());
				currentTask++;
				if (currentTask >= taskOrder.length) {
					finishTest();
					}
				stage = Stages.Setup;
			break;
		}
	}

	function trnLogic() {
		switch(stage) {
			case Stages.Setup:
				// waiting to start
				if (loadedImagesCount < totalImagesToLoad) return;

				adjustCanvasHeightToScreen(30);

				hideSoundButtons();
				useAppleFullScreen();

				trainingText = new TextObject(translate("Practice pressing the NO and YES keyboard keys"), canvas.width/2.0, keyTop - trainingTextFontSize * 2.0, trainingTextFontSize);
				dKeyButton = new KeyButton(d_key, dKeyLeft, keyTop, keyWidth, keyHeight, translate("NO"), trainingTextFontSize, true);
				kKeyButton = new KeyButton(k_key, kKeyLeft, keyTop, keyWidth, keyHeight, translate("YES"), trainingTextFontSize, true);

				trainingText.needsDisplay = true;
				trainingText.display();
				dKeyButton.display();
				kKeyButton.display();

				if (taskInstruction() != "") {
					// show instructions confirm box (can do better!)
					var txt = taskInstruction() + "\n\n" + commonInstruction;
					showAlertPanel(txt, true);

					stage = Stages.ShowingAlert;
				}
				else {
					stage = Stages.ExpectResponse;
				}
				// begin the task
				recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.start, 0, 0, dateStamp());
				taskOutFirer.start(function() {taskTimeout()}, taskOrder[currentTask].timeout);
			break;

			case Stages.ShowingAlert:
			break;

			case Stages.PreStart:
				paintBackground(tableColor);
				trainingText.display();
				dKeyButton.display();
				kKeyButton.display();
				continueButton.display();

				stage = Stages.ExpectResponse;
			break;

			case Stages.StartTrial:
			break;

			case Stages.PreStimulus:
			break;

			case Stages.Stimulus:
			break;

			case Stages.PreMinRT:
			break;

			case Stages.ExpectResponse:
				if (trainingText.needsDisplay) {
					trainingText.display();
				}
				if (dKeyButton.needsDisplay) {
					dKeyButton.display();
				}
				if (kKeyButton.needsDisplay) {
					kKeyButton.display();
				}
				if (continueButton.needsDisplay) {
					continueButton.display();
				}
			break;

			case Stages.Response:
				if (lastKey == yesKey || lastKey == noKey) {
					recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.press, 0, lastKey, taskOrder[currentTask].stimulusText);
					bufferLoader.play(clickSound, 0);
					if (lastKey == yesKey) {
						kKeyButton.pressed = true;
						kKeyButton.needsDisplay = true;
					}
					else if (lastKey == noKey) {
						dKeyButton.pressed = true;
						dKeyButton.needsDisplay = true;
					}
					bufferLoader.play(clickSound, 0);
					stageFirer.start(function() {revertKeyButton()}, keyDownInterval);
				}
				else if (lastKey == returnKey) {
					activateContinueButton();
				}
				stage = Stages.ExpectResponse;
			break;

			case Stages.Feedback:
			break;

			case Stages.EndFeedback:
			break;

			case Stages.RandomISI:
			break;

			case Stages.EndTask:
				taskOutFirer.stop();
				exitAppleFullScreen();
				paintBackground(tableColor);
				recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.end, 0, 0, dateStamp());
				currentTask++;
				if (currentTask >= taskOrder.length) {
					finishTest();
					}
				stage = Stages.Setup;
			break;
		}
	}

	function targetLogic() {
		switch(stage) {
			case Stages.Setup:
				if (loadedImagesCount < totalImagesToLoad) return;

				adjustCanvasHeightToScreen(30);

				hideSoundButtons();
				useAppleFullScreen();

				// waiting to start
				paintBackground(targetBackgroundColor);
				$(document.body).css("background", targetBackgroundColor);

				targetLoader = new TargetLoader(taskOrder[currentTask]);
				targetLoader.load();
				taskOrder[currentTask].analysis = targetLoader.analysis; // set this function for maxOuts

				currentTrial = 0;
				lastKey = 0;
				consecutiveErrors = 0;

				if (taskInstruction() != "") {
					// show instructions confirm box (can do better!)
//					var txt = taskInstruction() + "\n\n" + commonInstruction;
					var txt = taskInstruction();
					showAlertPanel(txt, true);

					stage = Stages.ShowingAlert;
				}
				else {
					stage = Stages.PreStart;
				}
				// begin the task
				recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.start, 0, 0, dateStamp());

			break;

			case Stages.ShowingAlert:
			break;

			case Stages.PreStart:
				stage = Stages.Shuffling;
			break;

			case Stages.Shuffling:
				// begin the trial (no shuffling here)
				taskOutFirer.start(function() {taskTimeout()}, taskOrder[currentTask].timeout);
				initialDelay = taskOrder[currentTask].initialDelay;

				stage = Stages.StartTrial;
			break;

			case Stages.StartTrial:
				anticipationInTrial = false;
				lastReactionTime = 0;
				stage = Stages.PreStimulus;

				stageFirer.start(function() {startStimulus()}, taskOrder[currentTask].prestimulus + initialDelay);
				initialDelay = 0; // first time only
			break;

			case Stages.PreStimulus:
			break;

			case Stages.Stimulus:
				paintBackground(targetBackgroundColor);
				target = new Target(taskOrder[currentTask], targetLoader.gridCellSize, targetLoader.fontSize); // create new target object each trial
				target.fontSize = targetLoader.fontSize;
				target.stimuliFromConfiguration(targetLoader.configuration(currentTrial));
				target.showScene();
				stage = Stages.PreMinRT;

				// start all three timers
				reactionTimer.start();
				stageFirer.start(function() {endPreMinRT()}, taskOrder[currentTask].anti);
				maxoutFirer.start(function() {taskOrder[currentTask].maxoutDetected()}, taskOrder[currentTask].maxout);
			break;

			case Stages.PreMinRT:
			break;

			case Stages.ExpectResponse:
			break;

			case Stages.Response:
				var elap = reactionTimer.elapsed();

				// need to click on a target letter
				// do hit test here
				var letter = target.hitOnTarget(canvasMousePosition);
				if (letter != false) {
					var correct = (letter.text == "T");
					var code = correct ? codes.tp : codes.fp;
					if (correct && anticipationInTrial) {
						// do we care?
						code = codes.pant;
						anticipationInTrial = false;
					}
					recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), code, elap, lastKey, target.responseText(letter));
					if (correct) {
						maxoutFirer.stop();
						lastReactionTime = elap;
						consecutiveErrors = 0;
					}
					else {
						bufferLoader.play(errorSound, 0);
						consecutiveErrors++;
						if (consecutiveErrors > taskOrder[currentTask].errors) {
							recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.tooManyErrors, "0", "0", dateStamp());
							stage = Stages.EndTask;
						}
					}
					target.startFeedback();
					bufferLoader.play(clickSound, 0);
				}
				else {
					// ignore this as probably just mis-tapped
					stage = Stages.ExpectResponse;
				}

			break;

			case Stages.Feedback:
				target.feedback();
			break;

			case Stages.EndFeedback:
				paintBackground(targetBackgroundColor);
				stage = Stages.RandomISI;
				var randTime = Math.round(Math.random() * taskOrder[currentTask].postISI);
				stageFirer.start(function() {endTrial()}, randTime);
			break;

			case Stages.RandomISI:
			break;

			case Stages.EndTask:
				stageFirer.stop();
				maxoutFirer.stop();
				taskOutFirer.stop();
				recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.end, 0, 0, dateStamp());
				analyseTask();
				exitAppleFullScreen();
				target.endTask();
				targetLoader.endTask();
				lastReactionTime = 0;
				currentTask++;
				if (currentTask >= taskOrder.length) {
					finishTest();
				}
				else {
					uploadTaskData();
				}
				stage = Stages.Setup;
			break;
		}
	}

	function gamblingLogic() {
		switch(stage) {
			case Stages.Setup:
				if (loadedImagesCount < totalImagesToLoad) return;

				adjustCanvasHeightToScreen(30);

				hideSoundButtons();
				useAppleFullScreen();

				// waiting to start
				paintBackground(gamblingBackgroundColor);
				$(document.body).css("background", gamblingBackgroundColor);

				// set up the configuration loader
				wheelLoader = new WheelLoader(taskOrder[currentTask]);
				wheelLoader.load();
				taskOrder[currentTask].analysis = wheelLoader.analysis; // set this function for maxOuts

				// set up left and right wheels
				var diam = Math.floor((canvas.width - (4 * slops))/2);
				leftWheel = new Wheel(slops, 2 * slops, Math.floor(diam/2)); // left top radius
				leftWheel.needsDisplay = false;

				rightWheel = new Wheel(canvas.width - slops - diam, 2 * slops, Math.floor(diam/2)); // left top radius
				rightWheel.needsDisplay = false;

				currentTrial = 0;
				lastKey = 0;
				consecutiveErrors = 0;

				if (taskInstruction() != "") {
					// show instructions confirm box (can do better!)
//					var txt = taskInstruction() + "\n\n" + commonInstruction;
					var txt = taskInstruction();
					showAlertPanel(txt, true);

					stage = Stages.ShowingAlert;
				}
				else {
					stage = Stages.PreStart;
				}
				// begin the task
				recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.start, 0, 0, dateStamp());

			break;

			case Stages.ShowingAlert:
			break;

			case Stages.PreStart:
				stage = Stages.Shuffling;
			break;

			case Stages.Shuffling:
				// begin the trial (no shuffling here)
				taskOutFirer.start(function() {taskTimeout()}, taskOrder[currentTask].timeout);
				initialDelay = taskOrder[currentTask].initialDelay;

				paintBackground(gamblingBackgroundColor);

				stage = Stages.StartTrial;
			break;

			case Stages.StartTrial:
				anticipationInTrial = false;
				lastReactionTime = 0;
				stage = Stages.PreStimulus;

				wheelLoader.display();

				stageFirer.start(function() {startStimulus()}, taskOrder[currentTask].prestimulus + initialDelay);
				initialDelay = 0; // first time only
			break;

			case Stages.PreStimulus:
			break;

			case Stages.Stimulus:
				paintBackground(gamblingBackgroundColor);
				wheelLoader.display();

				var cfg = wheelLoader.configuration(currentTrial, true);
				leftWheel.setGains(cfg.prob, cfg.gain, cfg.loss);
				cfg = wheelLoader.configuration(currentTrial, false);
				rightWheel.setGains(cfg.prob, cfg.gain, cfg.loss);

				leftWheel.uncover();
				rightWheel.uncover();

				stage = Stages.PreMinRT;

				// start all three timers
				reactionTimer.start();
				stageFirer.start(function() {endPreMinRT()}, taskOrder[currentTask].anti);
				maxoutFirer.start(function() {taskOrder[currentTask].maxoutDetected()}, taskOrder[currentTask].maxout);
			break;

			case Stages.PreMinRT:
			break;

			case Stages.ExpectResponse:
			break;

			case Stages.Response:
				var elap = reactionTimer.elapsed();

				// need to click left or right wheel to select
				// do hit test here
				var leftHit = leftWheel.hitOnWheel(canvasMousePosition);
				var rightHit = rightWheel.hitOnWheel(canvasMousePosition);

				var wasHit = leftHit || rightHit;
				if (wasHit) {
					if (leftHit) wheelLoader.currentWheel = leftWheel;
					else wheelLoader.currentWheel = rightWheel;

					var correct = (leftHit && leftWheel.willGain) || (rightHit && rightWheel.willGain);
					var code = correct ? codes.tp : codes.tn;
					if (wasHit && anticipationInTrial) {
						// do we care?
						code = codes.pant;
						anticipationInTrial = false;
					}
					var wheel = leftHit ? leftWheel : rightWheel;
					var other = leftHit ? rightWheel : leftWheel;

					recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), code, elap, lastKey, wheel.stimulusText());

					maxoutFirer.stop();
					lastReactionTime = elap;
					consecutiveErrors = 0;

					stage = Stages.Feedback;
					bufferLoader.play(clickSound, 0);
					other.cover();
					wheel.startSpin();
				}
				else {
					// ignore this as probably just mis-tapped
					stage = Stages.ExpectResponse;
				}

			break;

			case Stages.Feedback:
				leftWheel.spin();
				rightWheel.spin();
			break;

			case Stages.EndFeedback:
				paintBackground(gamblingBackgroundColor);

				wheelLoader.tally();
				wheelLoader.display();

 				leftWheel.display();
 				rightWheel.display();

				stage = Stages.RandomISI;
				var randTime = Math.round(Math.random() * taskOrder[currentTask].postISI);
				stageFirer.start(function() {endTrial()}, randTime);
			break;

			case Stages.RandomISI:
			break;

			case Stages.EndTask:
				stageFirer.stop();
				maxoutFirer.stop();
				taskOutFirer.stop();
				recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.end, 0, 0, dateStamp());
				wheelLoader.endTask();
				analyseTask();
				exitAppleFullScreen();
				lastReactionTime = 0;
				currentTask++;
				if (currentTask >= taskOrder.length) {
					finishTest();
				}
				else {
					uploadTaskData();
				}
				stage = Stages.Setup;
			break;
		}
	}

	function fractalLogic() {
		switch(stage) {
			case Stages.Setup:
				if (loadedImagesCount < totalImagesToLoad) return;

				adjustCanvasHeightToScreen(30);

				hideSoundButtons();
				useAppleFullScreen();

				// waiting to start
				paintBackground(fractalBackgroundColor);
				$(document.body).css("background", fractalBackgroundColor);

				// set up the configuration loader
				fractalLoader = new FractalLoader(taskOrder[currentTask]);
				fractalLoader.load();
				taskOrder[currentTask].analysis = fractalLoader.analysis; // set this function for maxOuts

				currentTrial = 0;
				lastKey = 0;
				consecutiveErrors = 0;

				fractalLoader.setUpInitialImages();

				if (taskInstruction() != "") {
					// show instructions confirm box (can do better!)
//					var txt = taskInstruction() + "\n\n" + commonInstruction;
					var txt = taskInstruction();
					showAlertPanel(txt, true);

					stage = Stages.ShowingAlert;
				}
				else {
					stage = Stages.PreStart;
				}
				// begin the task
				recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.start, 0, 0, dateStamp());

			break;

			case Stages.ShowingAlert:
			break;

			case Stages.PreStart:
				// set up the first elements
				paintBackground(fractalBackgroundColor);
				fractalLoader.setElementPositions();
				stage = Stages.Shuffling;
				if (fractalLoader.phase == FracPhases.Slider1) {
					stage = Stages.ExpectResponse; // so we can track their drags on the fractals
				}
			break;

			case Stages.Shuffling:
				// begin the trial (no shuffling here)
				taskOutFirer.start(function() {taskTimeout()}, taskOrder[currentTask].timeout);
				initialDelay = taskOrder[currentTask].initialDelay;

				stage = Stages.StartTrial;
			break;

			case Stages.StartTrial:
				anticipationInTrial = false;
				lastReactionTime = 0;
				stage = Stages.PreStimulus;

				fractalLoader.displayText();

				stageFirer.start(function() {startStimulus()}, taskOrder[currentTask].prestimulus + initialDelay);
				initialDelay = 0; // first time only
			break;

			case Stages.PreStimulus:
			break;

			case Stages.Stimulus:
				paintBackground(fractalBackgroundColor);

				// set the fractal images and rewards
				fractalLoader.configuration(currentTrial);
				fractalLoader.display();

				stage = Stages.PreMinRT;

				// start all three timers
				reactionTimer.start();
				stageFirer.start(function() {endPreMinRT()}, taskOrder[currentTask].anti);
				maxoutFirer.start(function() {taskOrder[currentTask].maxoutDetected()}, taskOrder[currentTask].maxout);
			break;

			case Stages.PreMinRT:
			break;

			case Stages.ExpectResponse:
			break;

			case Stages.Response:
				var elap = reactionTimer.elapsed();

				if (fractalLoader.phase == FracPhases.Trials1 || fractalLoader.phase == FracPhases.Trials2) {
					// need to click left or right fractal to select
					// do hit test here
					var wasHit = false;
					var hitIndex = -1;
					for (var i = 0; i < fractalLoader.totalFractals; i++) {
						var frac = fractalLoader.fractals[i];
						wasHit = frac.visible && frac.hitOnSelf(canvasMousePosition);
						if (wasHit) {
							hitIndex = i;
							break;
						}
					}
					if (wasHit) {
						fractalLoader.setChosen(hitIndex);

						var correct = (fractalLoader.chosenFractal.reward > 0);
						var code = correct ? codes.tp : codes.tn;
						if (wasHit && anticipationInTrial) {
							// do we care?
							code = codes.pant;
							anticipationInTrial = false;
						}

						recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), code, elap, lastKey, fractalLoader.stimulusText());

						maxoutFirer.stop();
						lastReactionTime = elap;
						consecutiveErrors = 0;

						bufferLoader.play(clickSound, 0);

						fractalLoader.tally();
						paintBackground(fractalBackgroundColor);

						fractalLoader.startFeedback();
						stage = Stages.Feedback;
					}
					else {
						// ignore this as probably just mis-tapped
						stage = Stages.ExpectResponse;
					}
				}
				else {
					// can hit returnKey
					if (lastKey == returnKey) {
						fractalLoader.continueButtonHit();
					}
				}

			break;

			case Stages.Feedback:
			break;

			case Stages.EndFeedback:
				fractalLoader.displayText();

				stage = Stages.RandomISI;
				var randTime = Math.round(Math.random() * taskOrder[currentTask].postISI);
				stageFirer.start(function() {endTrial()}, randTime);
			break;

			case Stages.RandomISI:
			break;

			case Stages.EndTask:
				stageFirer.stop();
				maxoutFirer.stop();
				taskOutFirer.stop();
				recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.end, 0, 0, dateStamp());
				analyseTask();
				exitAppleFullScreen();
				fractalLoader.endTask();
				lastReactionTime = 0;
				currentTask++;
				if (currentTask >= taskOrder.length) {
					finishTest();
				}
				else {
					uploadTaskData();
				}
				stage = Stages.Setup;
			break;
		}
	}

	function gapLogic() {
		switch(stage) {
			case Stages.Setup:
				if (loadedImagesCount < totalImagesToLoad) return;

				adjustCanvasHeightToScreen(30);

				hideSoundButtons();
				useAppleFullScreen();

				// waiting to start
				paintBackground(gapBackgroundColor);
				$(document.body).css("background", gapBackgroundColor);

				// set up the configuration loader
				gapLoader = new GapLoader(taskOrder[currentTask]);
				gapLoader.load();
				taskOrder[currentTask].analysis = gapLoader.analysis; // set this function for maxOuts

				currentTrial = 0;
				lastKey = 0;
				consecutiveErrors = 0;

				if (taskInstruction() != "") {
					// show instructions confirm box (can do better!)
//					var txt = taskInstruction() + "\n\n" + commonInstruction;
					var txt = taskInstruction();
					showAlertPanel(txt, true);

					stage = Stages.ShowingAlert;
				}
				else {
					stage = Stages.PreStart;
				}
				// begin the task
				recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.start, 0, 0, dateStamp());

			break;

			case Stages.ShowingAlert:
			break;

			case Stages.PreStart:
				stage = Stages.Shuffling;
			break;

			case Stages.Shuffling:
				// begin the trial (move along, no shuffling to be seen here!)
				taskOutFirer.start(function() {taskTimeout()}, taskOrder[currentTask].timeout);
				initialDelay = taskOrder[currentTask].initialDelay;

				paintBackground(gapBackgroundColor);

				stage = Stages.StartTrial;
			break;

			case Stages.StartTrial:
				if (gapLoader.phase == 0) {
					gapLoader.preTrialsGuess();
					stage = Stages.ExpectResponse;
				}
				else if (gapLoader.phase == 1) {
					anticipationInTrial = false;
					lastReactionTime = 0;

					gapLoader.startWaiting();
					stage = Stages.ExpectResponse;
				}
				else if (gapLoader.phase == 2) {
					gapLoader.postTrialsGuess();
					stage = Stages.ExpectResponse;
				}

			break;

			case Stages.PreStimulus:
			break;

			case Stages.Stimulus:
				stage = Stages.ExpectResponse;

				// start all three timers
				reactionTimer.start();
				maxoutFirer.start(function() {taskOrder[currentTask].maxoutDetected()}, taskOrder[currentTask].maxout);
			break;

			case Stages.PreMinRT:
				// skipping this one
			break;

			case Stages.ExpectResponse:
			break;

			case Stages.Response:
				var rt = reactionTimer.elapsed();
				if (gapLoader.phase == 0) {
					// can detect returnKey
					if (lastKey == returnKey) {
						gapLoader.continueButtonHit();
					}
				}
				else if (gapLoader.phase == 1) {
					if (gapLoader.state == States.Waiting) {
						stage = Stages.ExpectResponse; // so we can ignore it!
						if (gapLoader.hitIsInCircle(canvasMousePosition)) {
							gapLoader.startDelay1();
						}
					}
					else if (gapLoader.state == States.WhiteCircles) {
						// ignore any responses
						stage = Stages.ExpectResponse;
					}
					else if (gapLoader.state == States.Response) {
						if (gapLoader.hitIsInCircle(canvasMousePosition)) {
							gapLoader.guessedGap(rt);
						}
					}
				}
				else if (gapLoader.phase == 2) {
					// can detect returnKey
					if (lastKey == returnKey) {
						gapLoader.continueButtonHit();
					}
				}

			break;

			case Stages.Feedback:
			break;

			case Stages.EndFeedback:
				stageFirer.start(function() {endTrial()}, randTime);
			break;

			case Stages.RandomISI:
			break;

			case Stages.EndTask:
				stageFirer.stop();
				maxoutFirer.stop();
				taskOutFirer.stop();
				recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.end, 0, 0, dateStamp());
				analyseTask();
				exitAppleFullScreen();
				lastReactionTime = 0;
				currentTask++;
				if (currentTask >= taskOrder.length) {
					finishTest();
				}
				else {
					uploadTaskData();
				}
				stage = Stages.Setup;
			break;
		}
	}

	function moodLogic() { // mood scale
		switch(stage) {
			case Stages.Setup:
				if (loadedImagesCount < totalImagesToLoad) return;

				adjustCanvasHeightToScreen(30);

				hideSoundButtons();
				useAppleFullScreen();

				// waiting to start
				paintBackground(moodBackgroundColor);
				$(document.body).css("background", moodBackgroundColor);

				// set up the configuration loader
				moodLoader = new MoodLoader(taskOrder[currentTask], moodIndex);
				moodLoader.load();
				moodIndex++;
				taskOrder[currentTask].analysis = moodLoader.analysis; // set this function for maxOuts

				currentTrial = 0;
				lastKey = 0;
				consecutiveErrors = 0;

				if (taskInstruction() != "") {
					// show instructions confirm box (can do better!)
//					var txt = taskInstruction() + "\n\n" + commonInstruction;
					var txt = taskInstruction();
					showAlertPanel(txt, true);

					stage = Stages.ShowingAlert;
				}
				else {
					stage = Stages.PreStart;
				}
				// begin the task
				recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.start, 0, 0, dateStamp());

			break;

			case Stages.ShowingAlert:
			break;

			case Stages.PreStart:
				stage = Stages.Shuffling;
			break;

			case Stages.Shuffling:
				// begin the trial (move along, no shuffling to be seen here!)
				taskOutFirer.start(function() {taskTimeout()}, taskOrder[currentTask].timeout);
				initialDelay = taskOrder[currentTask].initialDelay;

				paintBackground(moodBackgroundColor);

				stage = Stages.StartTrial;
			break;

			case Stages.StartTrial:
				moodLoader.moodEstimate();
				stage = Stages.ExpectResponse;

				// start all three timers
				reactionTimer.start();
				maxoutFirer.start(function() {taskOrder[currentTask].maxoutDetected()}, taskOrder[currentTask].maxout);
			break;

			case Stages.PreStimulus:
			break;

			case Stages.Stimulus:
				stage = Stages.ExpectResponse;

			break;

			case Stages.PreMinRT:
			break;

			case Stages.ExpectResponse:
			break;

			case Stages.Response:
				// can detect returnKey
				if (lastKey == returnKey) {
					moodLoader.continueButtonHit();
				}

			break;

			case Stages.Feedback:
			break;

			case Stages.EndFeedback:
				stageFirer.start(function() {endTrial()}, randTime);
			break;

			case Stages.RandomISI:
			break;

			case Stages.EndTask:
				stageFirer.stop();
				maxoutFirer.stop();
				taskOutFirer.stop();
				recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.end, 0, 0, dateStamp());
				analyseTask();
				exitAppleFullScreen();
				lastReactionTime = 0;
				currentTask++;
				if (currentTask >= taskOrder.length) {
					finishTest();
				}
				else {
					uploadTaskData();
				}
				stage = Stages.Setup;
			break;
		}
	}

	// TESTING FUNCTIONS
	function addTaskFunctions() {
		// loads task function fields (don't differ if test or practice)
		for (var i=0; i< taskOrder.length; i++) {
			// add fields to each task
			if (taskOrder[i].code == 'SND') {
				taskOrder[i].logic = soundTestLogic;
				taskOrder[i].mouseDownAction = handleSoundMouseDown;
				taskOrder[i].maxoutDetected = "";
				taskOrder[i].poststimulusDetected = "";
				taskOrder[i].anticipationDetected = "";
				taskOrder[i].animateFeedbackStart = "";
				taskOrder[i].analysis = "";
			}
			else if (taskOrder[i].code == 'TRN') {
				taskOrder[i].logic = trnLogic;
				taskOrder[i].mouseDownAction = handleTrainingMouseDown;
				taskOrder[i].maxoutDetected = "";
				taskOrder[i].poststimulusDetected = "";
				taskOrder[i].anticipationDetected = "";
				taskOrder[i].animateFeedbackStart = "";
				taskOrder[i].analysis = "";
			}
			else if (taskOrder[i].code == 'TARG') {
				taskOrder[i].logic = targetLogic;
				taskOrder[i].mouseDownAction = handleTaskMouseDown;
				taskOrder[i].maxoutDetected = maxoutDetected;
				taskOrder[i].poststimulusDetected = poststimulusCardDetected;
				taskOrder[i].anticipationDetected = anticipationCardDetected;
				taskOrder[i].animateFeedbackStart = "";
				taskOrder[i].analysis = "";	// set when created
			}
			else if (taskOrder[i].code == 'GAMB') {
				taskOrder[i].logic = gamblingLogic;
				taskOrder[i].mouseDownAction = handleTaskMouseDown;
				taskOrder[i].maxoutDetected = maxoutDetected;
				taskOrder[i].poststimulusDetected = poststimulusCardDetected;
				taskOrder[i].anticipationDetected = anticipationCardDetected;
				taskOrder[i].animateFeedbackStart = "";
				taskOrder[i].analysis = "";	// set when created
			}
			else if (taskOrder[i].code == 'FRAC') {
				taskOrder[i].logic = fractalLogic;
				taskOrder[i].mouseDownAction = handleTaskMouseDown;
				taskOrder[i].maxoutDetected = maxoutDetected;
				taskOrder[i].poststimulusDetected = poststimulusCardDetected;
				taskOrder[i].anticipationDetected = anticipationCardDetected;
				taskOrder[i].animateFeedbackStart = "";
				taskOrder[i].analysis = "";	// set when created
			}
			else if (taskOrder[i].code == 'GGAP') {
				taskOrder[i].logic = gapLogic;
				taskOrder[i].mouseDownAction = handleTaskMouseDown;
				taskOrder[i].maxoutDetected = maxoutDetected;
				taskOrder[i].poststimulusDetected = poststimulusCardDetected;
				taskOrder[i].anticipationDetected = anticipationCardDetected;
				taskOrder[i].animateFeedbackStart = "";
				taskOrder[i].analysis = "";	// set when created
			}
			else if (taskOrder[i].code == 'MOOD') {
				taskOrder[i].logic = moodLogic;
				taskOrder[i].mouseDownAction = handleTaskMouseDown;
				taskOrder[i].maxoutDetected = maxoutDetected;
				taskOrder[i].poststimulusDetected = poststimulusCardDetected;
				taskOrder[i].anticipationDetected = anticipationCardDetected;
				taskOrder[i].animateFeedbackStart = "";
				taskOrder[i].analysis = "";	// set when created
			}
			if (!taskOrder[i].analyse) {
				taskOrder[i].analysis = "";
			}
		}
	}

	function printToConsole(text) {
		if (debugging) {
			// use this so can switch all off when finish debugging
			if (console && console.log) {
				console.log(text);
			}
		}
	}

	// LOAD IMAGES FUNCTIONS
	function imageLoadedCallBack(src, img) {
		ctx.drawImage(img, i, canvas.height-1, 1, 1);
		loadedImagesCount++;
//		printConsoleText("loaded " + src);
		if (loadedImagesCount >= totalImagesToLoad) {
			printConsoleText("Loaded all images asynchronously (" + loadedImagesCount + ")");
		}
	}

	function loadAllImages() {
		loadedImagesCount = 0;

		Colors = new Enum(['Black', 'Red', 'Green', 'Blue']);

		d_key = 0;
		d_key_hilited = d_key + 1;
		k_key = d_key_hilited + 1;
		k_key_hilited = k_key + 1;
		continue_button = k_key_hilited + 1;
		continue_button_hilited = continue_button + 1;
		alert_bg = continue_button_hilited + 1;
		alert_bg_hilited = alert_bg + 1;
		fractalBase = alert_bg_hilited + 1;

		var imagesButtons = 'images/D_key.png, images/Hilited_D_key.png, images/K_key.png, images/Hilited_K_key.png, images/Continue_button.png, images/Hilited_Continue_button.png, images/alert_bg.png, images/alert_bg_hilited.png';

		var imagesFractals = 'images/fractals/fractal0.png, images/fractals/fractal1.png, images/fractals/fractal2.png, images/fractals/fractal3.png, images/fractals/fractal4.png, images/fractals/fractal5.png, images/fractals/fractal6.png, images/fractals/fractal7.png, images/fractals/fractal8.png, images/fractals/fractal9.png';

		var usePng = true; // convert to true when all browsers display these correctly!
		if (usePng) {
			// preload card images (svg - issues with many browsers)
			// change extensions
//			imagesJokers = imagesJokers.replace(/svg/g, "png");
		}
		totalImagesToLoad += preload(imagesButtons, ctx, imageLoadedCallBack);
		totalImagesToLoad += preload(imagesFractals, ctx, imageLoadedCallBack);

		printToConsole("Loading: " + totalImagesToLoad + " images");
	}

	// TRANSLATION FUNCTIONS
	function taskInstruction() {
		if (taskOrder[currentTask].translation != "") {
			return taskOrder[currentTask].translation;
		}
		return taskOrder[currentTask].instruction;
	}

	function translate(text) {
		// should use global language code (eg format "en_US")
		if ((typeof translations === 'undefined') || translations == '' || translations.length == 0) {
			return text;
		}

		// there is a translations array, so see if text is in the key field?
		for (var i=0; i<translations.length; i++) {
			if (translations[i].key == text) {
				if (translations[i].string.length > 0) {
					return translations[i].string;
				}
				return text;
			}
		}
		return text;
	}

	function outputTranslations() {
		if (!output_translations) return;

		var output = "";
		var endLine = "\r";

		// print all the translations to console
		// allows creation of xml file for translators
		for (var i=0; i < taskOrder.length; i++) {
			var key = taskOrder[i].instruction;
			var str = taskOrder[i].translation;
			output += "<translate>" + key + "</translate>" + endLine;
			output += "<string>" + str + "</string>" + endLine;
		}
		for (var i=0; i < translations.length; i++) {
			var key = translations[i].key;
			var str = translations[i].string;
			output += "<translate>" + key + "</translate>" + endLine;
			output += "<string>" + str + "</string>" + endLine;
		}
		console.log(output);
	}

	// TESTING FUNCTIONS
	function showAlertPanel(message, showContinueButton) {
		var ar = alertRect();
		alertButton = new KeyButton(alert_bg_hilited, ar.l, ar.t, ar.w, ar.h, "", 0, false);
		alertButton.display();

		paintWrapText(message, ar.l + slops/2.0, ar.t + slops, ar.w - slops, ar.h - 2*slops, taskTextFontSize + 2*taskTextFontSize/3.0, alertTextFontSize, alertTextColor, true);

		if (showContinueButton) {
			var cr = continueButtonRect();
			continueButton = new KeyButton(continue_button, cr.l, cr.t, cr.w, cr.h, "", 0, false);
			continueButton.display();
		}
	}

	// Task functions
	function taskTimeout() {
		recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.timeout, "0", "0", dateStamp());
		stage = Stages.EndTask;
	}

	function returnToHomePage() {
		window.location = "../";
	}

	function revertKeyButton() {
		trainingText.needsDisplay = true;
		dKeyButton.pressed = false;
		kKeyButton.pressed = false;
		dKeyButton.needsDisplay = true;
		kKeyButton.needsDisplay = true;
	}

	function continueButtonPressed() {
		continueButton.pressed = false;
		continueButton.needsDisplay = true;
		continueButton.display();
		if (experimentFinished) {
			returnToHomePage(); // may not get to here
			return;
		}
		if (stage == Stages.ShowingAlert) {
			stage = Stages.PreStart;
		}
		else {
			stage = Stages.EndTask;
		}
//		printToConsole("continue button pressed");
	}

	function activateContinueButton() {
		continueButton.pressed = true;
		continueButton.needsDisplay = true;
		bufferLoader.play(clickSound, 0);
		stageFirer.start(function() {continueButtonPressed()}, keyDownInterval);
//		printToConsole("activate continue button");
	}

	function startStimulus() {
		stage = Stages.Stimulus;
	}

	function endPreMinRT() {
		stage = Stages.ExpectResponse;
	}

	function maxoutDetected() {
		// record max out and start card turnover
		recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.maxout, reactionTimer.elapsed(), "0", taskOrder[currentTask].stimulusText);

		stage = Stages.Feedback;
		maxoutFirer.stop(); // do I need this?

		if (maxOutAlertShown) {
			// they were warned, so terminate the test today
			recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.maxouts2, reactionTimer.elapsed(), "0", taskOrder[currentTask].stimulusText);

			currentTask = taskOrder.length;
			finishTest();
			return;
		}
		var txt = "No activity detected. If this happens again, today's test will be terminated, and you will not score any points.";
		alert(txt);
		maxOutAlertShown = true;

		taskOrder[currentTask].animateFeedbackStart();
		bufferLoader.play(errorSound, 0);
	}

	function anticipationCardDetected(key) {
		if (key == yesKey || key == noKey) {
			bufferLoader.play(antiSound, 0);
		}
		recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.anti, reactionTimer.elapsed(), key, taskOrder[currentTask].stimulusText);
		anticipationInTrial = true;
	}

	function poststimulusCardDetected(key) {
		bufferLoader.play(errorSound, 0);
		recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.post, reactionTimer.elapsed(), key, taskOrder[currentTask].stimulusText);
	}

	function formatDate(date) {
		// NB we are only interested in local time (not GMT etc!)
		// Format: 2013-08-01T13:06:46.GMT+1100
		var year = date.getFullYear(),
			month = date.getMonth() + 1,
			day = date.getDate(),
			hour = date.getHours(),
			minute = date.getMinutes(),
			second = date.getSeconds();

		if (month.toString().length == 1) {
			month = '0' + month;
		}
		if (day.toString().length == 1) {
			day = '0' + day;
		}
		if (hour.toString().length == 1) {
			hour = '0' + hour;
		}
		if (minute.toString().length == 1) {
			minute = '0' + minute;
		}
		if (second.toString().length == 1) {
			second = '0' + second;
		}
		// we need the GMT offset - which I can only get using toString()
		// format of toString(): Tue Jan 08 2013 13:06:46 GMT+1100 (EST)
		// Format: Tue Jan 08 2013 13:06:46 GMT+1100 (EST);2013-08-01T13:06:46 (we need toString() format for our duration computation, and ISO type for uploading into mySQL
		var formatted = date.toString() + ";" + year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second;
		return formatted;
	}

	function dateStamp() {
		// return the UTC time
		var now = new Date();
		return formatDate(now); // takes daylight saving into account
	}

	function simulateClickOnContinueButton() {
		if (continueButton !== undefined && continueButton.containsPoint(canvasMousePosition)) {
			lastKey = returnKey;
			responseDetected();
			return true;
		}
		return false;
	}

	function handleTaskMouseDown() {
		if (stage == Stages.ShowingAlert) {
			// check if clicking continueButton
			simulateClickOnContinueButton();
			return;
		}
		// map mousedowns to yes or no keys so can use on iPad
		if (canvasMousePosition.x > canvas.width/2.0) {
			lastKey = yesKey;
		}
		else {
			lastKey = noKey;
		}
		responseDetected();
	}

	function handleTrainingMouseDown() {
		if (simulateClickOnContinueButton()) {
			return;
		}
		handleTaskMouseDown();
	}

	function handleSoundMouseDown() {
		// use document coordinates for sound buttons
		var used = false;
		for (var i = 0; i < totalSounds; i++) {
			var name = "#button" + i;
			if (hitTest(documentMousePosition, $(name).offset().left, $(name).offset().top, $(name).width(), $(name).height())) {
				bufferLoader.play(i, 0);
				used = true;
				break;
			}
		}
		if (!used && simulateClickOnContinueButton()) {
			return;
		}
	}

	function hitTest(local, x, y, width, height) {
		// local is object local coordinates
		if (local.x >= x && local.x <= x + width &&
			local.y >= y && local.y <= y + height) {
			return true;
		}
		return false;
	}

	function getMousePositions(e) {
		// update canvasPosition (in case has moved)
		canvasPosition = {	// canvas left, top to x, y
		x: $('#drawcanvas').offset().left,
		y: $('#drawcanvas').offset().top
		};

		var position = {x: 0, y: 0};

		if (Modernizr.touch) { // global variable detecting touch support
			// NB. if use JQuery touchstart, need to use e.originalEvent.touches in all these calls, but I found it a bit less responsive than native javascript
			if (e.touches && e.touches.length > 0) {
				position.x = e.touches[0].pageX;
				position.y = e.touches[0].pageY;
			}
		}
		else {
			position.x = e.pageX;
			position.y = e.pageY;
		}
		documentMousePosition = position;
		canvasMousePosition.x = position.x - canvasPosition.x;
		canvasMousePosition.y = position.y - canvasPosition.y;

		var txt = "getMousePositions called: " + canvasMousePosition.x + ", " + canvasMousePosition.y + "; " + documentMousePosition.x + ", " + documentMousePosition.y;

//		printToConsole("canvasMousePosition: " + canvasMousePosition.x + ", " + canvasMousePosition.y);

	}

	function isAlternateKey(keyArray, key) {
		printToConsole("key is: " + key);
		if (keyArray.indexOf(key) >= 0) {
			return true;
		}
		return false;
	}

	function mouseDownDetected() {
		if (experimentFinished) {
			returnToHomePage();
			return false;
		}

		// lastEvent is already set
		taskOrder[currentTask].mouseDownAction();

		return true;
	}

	function handleMouseDown(e) {

		e.preventDefault();

		if (lastEvent == "undefined") {
			lastEvent = jQuery.Event(eventName);
		}
		lastEvent = e;

//		printToConsole("mouse down event detected");

		// set canvasMousePosition and documentMousePosition
		getMousePositions(e);

		mouseDownDetected();
	}

	function responseDetected() {
    	if (experimentFinished) {
    		if (lastKey == returnKey) {
				returnToHomePage();
    		}
    		return false;
    	}

    	lastReactionTime = 0;

    	if (lastKey == returnKey) {
    		if (stage == Stages.ShowingAlert) {
    			// need to give continue button feedback if present
    			activateContinueButton();
    			return true;
    		}
    		if (taskOrder[currentTask].returnTerminates) {
				// return key means skip task
				stage = Stages.EndTask;
				return true;
			}
    	}

		if (stage <= Stages.PreMinRT) {
			taskOrder[currentTask].anticipationDetected(lastKey);
		}
		else if (stage == Stages.ExpectResponse) {
			stage = Stages.Response;
		}
		else if (stage >= Stages.Response) {
			taskOrder[currentTask].poststimulusDetected(lastKey);
		}
		return true;
	}

	function endTrial() {
		currentTrial++;

//		printToConsole("Next trial index = " + currentTrial);

		stageFirer.stop();
		maxoutFirer.stop();

		// is this correct? What if add more trials?
		if (currentTrial >= taskOrder[currentTask].trials) {
			stage = Stages.EndTask;
			return;
		}

		// begin the trial
		stage = Stages.StartTrial;
	}

	function recordResponse(task, elapsed, code, rt, key, extras) {
		var response = new Response(task, elapsed, code, rt, key, extras);
		responses.push(response);

		// print the response for verification
		printToConsole("Response: " + response.toXmlFormat());
	}

	function testAjaxRequestObject() {
		var xmlhttp = "";
		try {
			// Opera 8.0+, Firefox, Safari
			xmlhttp = new XMLHttpRequest();
		}
		catch (e) {
			// Internet Explorer Browsers
			try {
				xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (e) {
				try {
					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (e) {
					// Something went wrong
					alert(translate("We're sorry but your browser is too old to support transmitting data. Please upgrade to the latest Internet Explorer version and try again."));
					return false;
				}
			}
		}
		return true;
	}

	function uploadDone(data, textStatus, jqXHR) {
		// inspect the response
		var responseText = data;
		uploadedTaskData = true;
		if (data.indexOf("unsuccessful") >= 0) {
			uploadedTaskData = false;
		}
		printToConsole("Upload: " + data);
		if (currentTask >= taskOrder.length) {
			endTest(responseText.trim());
		}
	}

	function uploadTaskData() {
		uploadedTaskData = false;

		var data = '<?xml version="1.0"?>';
		data += '<testdata>';
		for (var i = 0; i < responses.length; i++) {
			data += responses[i].toXmlFormat();
		}
		data += "</testdata>";

		var pageToSendTo = "uploaddata.php";
		var testTypePlaceholder = "action=";
		var dayPlaceholder = "day=";
		var variablePlaceholder = "testdata=";
		var sendStuff = testTypePlaceholder + testType + "&" + dayPlaceholder + dayNum + "&" + variablePlaceholder + data;

		var jqxhr = $.post(pageToSendTo, sendStuff, uploadDone, "text");
	}

	function finishTest() {
		// try to upload the test data
		experimentTimer.stop();
		experimentFinished = true;

		uploadTaskData();
	}

	function endTest(responseText) {
		paintBackground(tableColor);
		if (uploadedTaskData) {
			if (testType == "Practice") {
				showAlertPanel(translate("Well done!\n\nThis practice test is finished.") + "\n\n" + responseText, true);
			}
			else {
				var resStr = resultsArray.join("\n");
				resStr += "\n\nPlease press the continue button to exit today's testing session."

				var msg = translate("Well done!\n\nToday's test is finished, thanks for playing!") + "\n\n" + responseText + "\n\n" + resStr;
				showAlertPanel(msg, true);
			}
		}
		else {
			var answer = confirm(translate("Thank you for completing this test.") + "\n\n" + responseText);
			if (answer) {
				// try again
				uploadTaskData();
			}
			else {
				showAlertPanel(translate("Please accept our apologies for losing your (and our) data. This is very frustrating. Please consider trying again later today."), true);
			}
		}
	}

	function taskAnalysis(taskCode) {
		// create an array of current responses
		var array = responses.extractArray("task", taskCode);
		var summary = array.resultsSummary(codes);

		// record this in responses
		recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.results, 0, 0, summary);
	}

	function analyseTask() {
		// use generic analysis
		if (taskOrder[currentTask].analysis != "") {
			taskOrder[currentTask].analysis(taskOrder[currentTask].code);
		}
	}

	function paintPartialBackground(left, top, width, height, color) {
		ctx.fillStyle = color; // background
		ctx.fillRect(left, top, width, height);
	}

	function paintBackground(color) {
		paintPartialBackground(0, 0, canvas.width, canvas.height, color);
	}

	function drawTextWithShadow(text, color, x, y, shadow) {
		if (shadow) {
			var offset = 1;
			ctx.fillStyle = "#000000";
			ctx.fillText(text, x+offset, y+offset);
		}
		ctx.fillStyle = color;
		ctx.fillText(text, x, y);
	}

	function paintWrapText(text, x, y, maxWidth, maxHeight, lineHeight, fontsize, color, shadow) {
//		Note: we don't paint the bg color since this is not updating frequently

//		ctx.font = fontsize + "px Helvetica";
		ctx.font = fontsize + "px Calabri";

		var lines = text.split('\n');
		for (var m = 0; m < lines.length; m++) {
			var testLine = lines[m];
			var metrics = ctx.measureText(testLine);
			var testWidth = metrics.width;
			if (testWidth > maxWidth) {
				var words = testLine.split(' ');
				var line = '';
				for (var n = 0; n < words.length; n++) {
					var testLine2 = line + words[n] + ' ';
					metrics = ctx.measureText(testLine2);
					testWidth = metrics.width;
					if (testWidth > maxWidth) {
						drawTextWithShadow(line, color, x, y, shadow);
						line = words[n] + ' ';
						y += lineHeight;
					}
					else {
						line = testLine2;
					}
				}
				drawTextWithShadow(line, color, x, y, shadow);
				y += lineHeight;
			}
			else {
				drawTextWithShadow(testLine, color, x, y, shadow);
				y += lineHeight;
			}
		}
	}

	function paintText(text, x, y, fontSize, color) {
		// note that y is the bottom of the text! Not top left!
		// refresh the frame rect before draw the text
		ctx.font = fontSize + "px Helvetica";
		paintPartialBackground(x-5, y-fontSize*1.5, ctx.measureText(text).width + 10, fontSize*2.0, tableColor);

		ctx.fillStyle = color;
		ctx.fillText(text, x, y);
	}

	function paintInfoText() {
		// debugging only
		var correctedFrame = frame + 1;
		var frame_text = "Test: " + testType + ", Task: " + taskOrder[currentTask].code + ", Elapsed: " + Math.round(experimentTimer.elapsed()/1000.0) + ", Key: " + lastKey + ", Frame: " + correctedFrame + " / " + FRAMES_PER_SECOND;
	}

	// sound ended callback
	function playSoundTest(soundfileIndex) {
		bufferLoader.play(soundfileIndex, 0);
		stage = Stages.ExpectResponse;
	}

	function hideSoundButtons() {
		$(".sound_buttons_div").hide();
// 		$("#soundstitle").hide();
// 		for (var i = 0; i < totalSounds; i++ ) {
// 			$("#button" + i).hide();
// 		}
	}

	function orientationIsLandscape() {
		var iPadUse = navigator.userAgent.match(/iPad/i);
		if (!iPadUse) return true;

		// useful for iPad to ensure is in landscape
		var clientX = document.documentElement.clientWidth;
		var clientY = document.documentElement.clientHeight;

//		printToConsole("iPad: clientX " + clientX + ", clientY " + clientY);
		return (clientX > clientY);
	}

	// add the keyboard controls
 	$(document).keydown(function(e) {

 		lastEvent = e;

 		// 37 left, 38 up, 39 right, 40 down
		lastKey = e.which;
 		if (responseDetected()) {
 			printToConsole("key detected " + lastKey);
		}
 	});

	function isSafari5() {
		return !!navigator.userAgent.match(' Safari/') && !navigator.userAgent.match(' Chrom') && !!navigator.userAgent.match(' Version/5.');
	};

	function isFileAPIEnabled () {
		return !!window.FileReader;
	};

	function isFileDragAndDropSupported() {
		var isiOS = !!navigator.userAgent.match('iPhone OS') || !!navigator.userAgent.match('iPad');
		return (Modernizr.draganddrop && !isiOS && (isFileAPIEnabled() || isSafari5()));
	};

	function mouseDownListener() {
		// canvasMousePosition and documentMousePosition already set

		// check if we've hit a fractal
		var wasHit = fractalLoader.dragStart(canvasMousePosition);
		if (wasHit) {
			// set up mousemove/touchmove listener
			var evt = useTouchEvents ? "touchmove" : "mousemove";
			canvas.addEventListener(evt, mouseMoveListener, false);

			// watch for mouseup events
			evt = useTouchEvents ? "touchend" : "mouseup";
			canvas.addEventListener(evt, mouseUpListener, false);
		}
		else {
			// was continueButton hit?
			if (fractalLoader.hitOnContinue(canvasMousePosition)) {
				// terminate this phase
				fractalLoader.continueButtonHit();
			}
		}
	}

	function mouseMoveListener(e) {
		// set canvasMousePosition and documentMousePosition
		getMousePositions(e);

		fractalLoader.dragMove(canvasMousePosition);
	}

	function mouseUpListener(e) {
		// set canvasMousePosition and documentMousePosition
		getMousePositions(e);

		// remove other listeners
		evt = useTouchEvents ? "touchmove" : "mousemove";
		canvas.removeEventListener(evt, mouseMoveListener, false);

		// remove other listeners
		evt = useTouchEvents ? "touchend" : "mouseup";
		canvas.removeEventListener(evt, mouseUpListener, false);

		fractalLoader.dragEnd(canvasMousePosition);
	}

	function startFractalMouseListening() {
		// switch document mousedown handler to ours
		taskOrder[currentTask].mouseDownAction = mouseDownListener;
	}

	function endFractalMouseListening() {
		taskOrder[currentTask].mouseDownAction = handleTaskMouseDown;
	}

	// gap task listeners
	function mouseDownGapListener() {
		// canvasMousePosition and documentMousePosition already set

		// check if we've hit a fractal
		var wasHit = gapLoader.dragStart(canvasMousePosition);
		if (wasHit) {
			// set up mousemove/touchmove listener
			var evt = useTouchEvents ? "touchmove" : "mousemove";
			canvas.addEventListener(evt, mouseMoveGapListener, false);

			// watch for mouseup events
			evt = useTouchEvents ? "touchend" : "mouseup";
			canvas.addEventListener(evt, mouseUpGapListener, false);
		}
		else {
			// was continueButton hit?
			if (gapLoader.hitOnContinue(canvasMousePosition)) {
				// terminate this phase
				gapLoader.continueButtonHit();
			}
		}
	}

	function mouseMoveGapListener(e) {
		// set canvasMousePosition and documentMousePosition
		getMousePositions(e);

		gapLoader.dragMove(canvasMousePosition);
	}

	function mouseUpGapListener(e) {
		// set canvasMousePosition and documentMousePosition
		getMousePositions(e);

		// remove other listeners
		evt = useTouchEvents ? "touchmove" : "mousemove";
		canvas.removeEventListener(evt, mouseMoveGapListener, false);

		// remove other listeners
		evt = useTouchEvents ? "touchend" : "mouseup";
		canvas.removeEventListener(evt, mouseUpGapListener, false);

		gapLoader.dragEnd(canvasMousePosition);
	}

	function startGapMouseListening() {
		// switch document mousedown handler to ours
		taskOrder[currentTask].mouseDownAction = mouseDownGapListener;
	}

	function endGapMouseListening() {
		taskOrder[currentTask].mouseDownAction = handleTaskMouseDown;
	}

	function mouseDownMoodListener() {
		// canvasMousePosition and documentMousePosition already set

		// check if we've hit a fractal
		var wasHit = moodLoader.dragStart(canvasMousePosition);
		if (wasHit) {
			// set up mousemove/touchmove listener
			var evt = useTouchEvents ? "touchmove" : "mousemove";
			canvas.addEventListener(evt, mouseMoveMoodListener, false);

			// watch for mouseup events
			evt = useTouchEvents ? "touchend" : "mouseup";
			canvas.addEventListener(evt, mouseUpMoodListener, false);
		}
		else {
			// was continueButton hit?
			if (moodLoader.hitOnContinue(canvasMousePosition)) {
				// terminate this phase
				moodLoader.continueButtonHit();
			}
		}
	}

	function mouseMoveMoodListener(e) {
		// set canvasMousePosition and documentMousePosition
		getMousePositions(e);

		moodLoader.dragMove(canvasMousePosition);
	}

	function mouseUpMoodListener(e) {
		// set canvasMousePosition and documentMousePosition
		getMousePositions(e);

		// remove other listeners
		evt = useTouchEvents ? "touchmove" : "mousemove";
		canvas.removeEventListener(evt, mouseMoveMoodListener, false);

		// remove other listeners
		evt = useTouchEvents ? "touchend" : "mouseup";
		canvas.removeEventListener(evt, mouseUpMoodListener, false);

		moodLoader.dragEnd(canvasMousePosition);
	}

	function startMoodMouseListening() {
		// switch document mousedown handler to ours
		taskOrder[currentTask].mouseDownAction = mouseDownMoodListener;
	}

	function endMoodMouseListening() {
		taskOrder[currentTask].mouseDownAction = handleTaskMouseDown;
	}

//	#(document).mousedown(function(e) {
// 		e.preventDefault();
//
// 		lastEvent = e;
// 		mouseDownDetected();
// 	});

 	function deg2Rad(degrees) {
 		return degrees * Math.PI/180;
 	}

	// OBJECT IMPLEMENTATIONS
	function Point(x, y) {
		this.x = x;
		this.y = y;

		Point.prototype.string = function() {
			return "x:" + this.x + " y:" + this.y;
		}
	}

	function Rect(left, top, width, height) {
		this.l = left;
		this.t = top;
		this.w = width;
		this.h = height;

		Rect.prototype.r = function() {
			return this.l + this.w;
		}

		Rect.prototype.b = function() {
			return this.t + this.h;
		}

		Rect.prototype.center = function() {
			return new Point(this.l + this.w/2, this.t + this.h/2);
		}

		Rect.prototype.offset = function(dx, dy) {
			this.l += dx;
			this.t += dy;
		}

		Rect.prototype.string = function() {
			return "l:" + this.l + " t:" + this.t + " w:" + this.w + " h:" + this.h;
		}

		Rect.prototype.pointInRect = function(x, y) {
			return (x >= this.l && x <= this.r() && y >= this.t && y <= this.b());
		}
	}

	function Circle(x, y, radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;

		Circle.prototype.pointInCircle = function(x, y) {
			var dist = Math.sqrt( Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2) );
			return dist <= radius;
		}
	}

	function Fractal(index, reward, realReward, prob, dimension) {
		this.index = index;
		this.reward = reward;
		this.realReward = realReward;
		this.prob = prob;
		this.base = fractalBase;

		this.x = 0;
		this.y = 0;
		this.dim = dimension;
		this.opacity = 1.0;
		this.highlighted = false;
		this.visible = true;

		this.textObject = new TextObject("+" + this.reward, this.dim/2.0, this.dim/2.0, 40);

		this.drawReward = false;

		this.dragging = false; // true if currently being dragged
		this.dragHold = 0; // point in object at which touched/clicked
		this.dragReward = "";
		this.dragText = new TextObject(" ", this.dim/2.0, this.dim/2.0, 20);

		Fractal.prototype.position = function(x, y) {
			this.x = x;
			this.y = y;
		}

		Fractal.prototype.pointInRect = function(x, y, feather) {
			var r = new Rect(this.x - feather, this.y - feather, this.dim + 2 * feather, this.dim + 2 * feather);
			return r.pointInRect(x, y);
		}

		Fractal.prototype.hitOnSelf = function(local) {
			// return true if local is in this fractal
			var correct = this.pointInRect(local.x, local.y, 0);
			return correct;
		}

		Fractal.prototype.dragStart = function(local) {
			this.dragging = true;
			this.dragHold = new Point(local.x - this.x, local.y - this.y);
		}

		Fractal.prototype.dragMove = function(mousePos, boundsRect, bgColor) {
			if (this.dragging) {

				// clamp to within boundsRect
				var min = boundsRect.l;
				var max = boundsRect.l + boundsRect.w - this.dim;
				var posX = mousePos.x - this.dragHold.x;
				posX = (posX < min) ? min : ((posX > max) ? max : posX);

				if (posX != this.x) {
					// hide first then redraw
					this.hide(bgColor);

					this.x = posX;
					this.display();
				}

				// don't change y
//				var min = boundsRect.t;
//				var max = boundsRect.b - this.dim;
//				this.y = mousePos.y - this.dragHold.y;
//				this.y = (this.y < min) ? min : ((this.y > max) ? max : this.y);
			}
		}

		Fractal.prototype.dragEnd = function(mousePos, boundsRect) {
			if (this.dragging) {

				// set final position
				this.dragging = false;
				this.display();
			}
		}

		Fractal.prototype.recordDragReward = function(scaleName) {
			var extras = "Index " + this.index + ", Reward " + this.realReward + ", Prob " + this.prob + ", Scale " + scaleName + ", Guess " + this.dragReward;

			recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.guess, 0, 0, extras);
		}

		Fractal.prototype.stimulusText = function() {
 			return "Index " + this.index + ", Reward " + this.reward + ", Prob " + this.prob;
		}

		Fractal.prototype.display = function() {
			if (document.images) {
				ctx.drawImage(document.images[this.index + this.base], this.x, this.y, this.dim, this.dim);

				// draw the text reward within the image
				if (this.drawReward) {
					// reset text reward and position
					this.textObject.text = this.reward > 0 ? "+" + this.reward : "+0";
					this.textObject.midx = this.x + this.dim/2.0;
					this.textObject.midy = this.y + this.dim/2.0;
					this.textObject.clear("black");
					this.textObject.display();
				}
				if (this.dragging) {
					// draw current scale reward
					this.dragText.text = this.dragReward;
					this.dragText.midx = this.x + this.dim/2.0;
					this.dragText.midy = this.y + this.dim/2.0;
					this.dragText.clear("black");
					this.dragText.display();
				}
				if (this.highlighted) {
					// draw red border
					ctx.save();
					ctx.strokeStyle = "red";
					ctx.lineWidth = 10;
					ctx.strokeRect(this.x - 1, this.y - 1, this.dim - 2, this.dim - 2);
					ctx.restore();
				}
			}
		}

		Fractal.prototype.hide = function(color) {
			this.highlighted = false;
			var border = 7;
			paintPartialBackground(this.x - border, this.y - border, this.dim + 2 * border, this.dim + 2 * border, color);
		}
	}

	function Scale(index, x, y, length) {
		this.index = index;
		this.x = x;
		this.y = y;
		this.length = length;

		this.name = (index == 0) ? "magnitude" : "probability";
		this.text = "Reward " + this.name;
		this.min = (index == 0) ? 0 : 0;
		this.max = (index == 0) ? 50 : 100;
		this.appendText = (index == 0) ? "" : "%";
		this.height = 10;
		this.color = "yellow";
		this.fontSize = 26;
		this.context = ctx;

		// TextObjects
		this.minima = "";
		this.title = "";
		this.maxima = "";
		this.valueText = "";

		Scale.prototype.create = function() {
			var vert = this.y + this.height + 2 + this.fontSize/2.0;
			this.minima = new TextObject(this.min + this.appendText, this.x, vert, this.fontSize);

			this.title = new TextObject(this.text, this.x + this.length/2.0, vert, this.fontSize);

			this.maxima = new TextObject(this.max + this.appendText, this.x + this.length, vert, this.fontSize);

			this.valueText = new TextObject("none", this.x + this.length/2.0, this.y + this.height/2.0, this.fontSize);
		}

		Scale.prototype.bounds = function() {
			// return the bounding rect of the scale
			var border = 2;
			return new Rect(this.x - border, this.y - border, this.length + 2 * border, this.height + 2 * border);
		}

		Scale.prototype.point = function(value) {
			// return the point on the top of the scale equivalent to a given value (pegged to the range of this scale)
			var pt = new Point(this.x + this.length * (value - this.min)/(this.max - this.min), this.y);
			if (pt.x < this.x) pt.x = this.x;
			if (pt.x > this.x + this.length) pt.x = this.x + this.length;
			return pt;
		}

		Scale.prototype.valueFromPoint = function(local, dim) {
			// return the value equivalent to this point on the scale
			var val = this.min + (this.max - this.min) * (local.x - this.x)/(this.length - dim);
			if (val < this.min) val = this.min;
			if (val > this.max) val = this.max;
			return Math.round(val);
		}

		Scale.prototype.valueTextFromPoint = function(local, dim) {
			// return the value as text equivalent to this point on the scale
			var val = this.valueFromPoint(local, dim);
			return val + this.appendText;
		}

		Scale.prototype.valueTextFromValue = function(value) {
			// return the value as text equivalent to this point on the scale
			return value + this.appendText;
		}

		Scale.prototype.hide = function(bgColor) {
			paintPartialBackground(0, this.y, canvas.width, canvas.height - this.y, bgColor);
		}

		Scale.prototype.displayValue = function(value) {
			// draw the scale first
			this.clear();
			this.display();

			// what is the equivalent local point on the top of the scale?
			var down = 20;
			var pt = this.point(value);
			pt.y += this.height;
			var bds = this.valueText.bounds();

			// draw arrow below the line
			this.context.save();
			this.context.beginPath();
			this.context.moveTo(pt.x, pt.y);
			this.context.lineTo(pt.x - down/4, pt.y + down);
			this.context.lineTo(pt.x + down/4, pt.y + down);
			this.context.lineTo(pt.x, pt.y);
			this.context.fillStyle = this.color;
			this.context.fill();
			this.context.restore();

			this.valueText.text = value + this.appendText;
			this.valueText.midx = pt.x;
			this.valueText.midy = pt.y + down + bds.h/2.0;
			this.valueText.display();
		}

		Scale.prototype.clear = function(color) {
			var bds = this.valueText.bounds();
			paintPartialBackground(this.x - 1, this.y - 1, this.length + 2, bds.b() - (this.y - 1), color);

			this.minima.clear(color);
			this.title.clear(color);
			this.maxima.clear(color);
			this.valueText.clear(color);
		}

		Scale.prototype.display = function() {

			// draw rect
			this.context.save();
			this.context.fillStyle = this.color;
			this.context.fillRect(this.x, this.y, this.length, this.height);
			this.context.restore();

			// draw text objects
			this.minima.display();
			this.title.display();
			this.maxima.display();
		}
	}

	function FractalLoader(task) { // fractal exploration configuration
		this.name = task.brief;
		this.trials = task.trials;
		this.feedbackDuration = task.feedbackDuration;
		this.dimensions = task.dimensions;
		this.phase1Trials = task.phase1Trials;
		this.phase2Trials = task.phase2Trials;

		this.totalFractals = task.totalFractals;
		this.radius = task.radius;

		this.phase = FracPhases.Slider1; // 0 = show scale, 1 = show other scale, 2 = do testing side by side, 3 = do testing in circle, 4 = show scale, 5 = show other scale
		this.scaleIndex = 0;
		this.scale = "";

		this.scalePxFromBottom = 100;

		this.totalPoints = 0; // total amount of points
		this.showWinnings = true;
		this.showQuestion = true;

		this.fracImages = []; // array of elements with [index, reward, prob]

		// trial's fractals
		this.fractals = []; // array of fractals for each trial
		for (var i = 0; i < this.totalFractals; i++) {
			this.fractals[i] = new Fractal(0, 0, 0, 0, this.dimensions);
		}
		this.chosenFractal = "";
		this.otherFractal = "";
		this.dragIndex = -1;
		this.continueButton = "";

		this.dayTrials = ""; // this is where they will go
		this.loaded = false;
		this.firer = new Firer();
		this.rtTimer = new Timer(); // from time scale shows to continue btn hit

		// text stuff
		this.textObject = new TextObject("Current Winnings: 0", canvas.width/2.0, slops/3, 40);
		this.question = new TextObject("?", canvas.width/2.0, 2 * slops, 60);

		FractalLoader.prototype.load = function() {
			// load today's trials into this object for trial use
			// these are stored in $(#stimuli).html as a json array string
			this.dayTrials = JSON.parse($("#fracs").html());
//			this.dayTrials.printToConsole();

			this.fracImages = JSON.parse($("#fracImages").html());

			this.loaded = true;
		}

		FractalLoader.prototype.otherIndex = function() {
			// return an index that is not the same as the chosenFractal one
			var arr = [];
			for (var i = 0; i < this.totalFractals; i++) {
				if (this.fractals[i].index != this.chosenFractal.index) {
					arr[arr.length] = i;
				}
			}
			arr.randomize();

			return arr[0];
		}

		FractalLoader.prototype.circlePosition = function(num, dim) {
			// return a point with the top, left of this radial position
			var degrees = 18 + num * 360/this.totalFractals;
			var rads = deg2Rad(degrees);
			var ctr = new Point(canvas.width/2.0, slops/3.0 + canvas.height/2.0);
			var x = ctr.x + Math.cos(rads) * this.radius - dim/2.0;
			var y = ctr.y + Math.sin(rads) * this.radius - dim/2.0;
			return new Point(x, y);
		}

		FractalLoader.prototype.sliderPosition = function(num, dim) {
			// return a point with the top, left of this position
			return new Point(slops, slops/2.0 + num * dim);
		}

		FractalLoader.prototype.createScale = function(index) {
			// draw a scale at bottom of screen
			if (this.scale != "") {
				this.scale.hide(fractalBackgroundColor);
				this.scale = "";
			}
			this.scaleIndex = index;
			var x = slops;
			var y = canvas.height - this.scalePxFromBottom;
			var len = canvas.width - 2 * slops;
			this.scale = new Scale(index, x, y, len);
			this.scale.create();
		}

		FractalLoader.prototype.setUpInitialImages = function() {
			// initially fill the fractals
			var arr = this.fracImages.slice(0); // new copy
			arr.randomize(); // random order

			for (var i = 0; i < this.totalFractals; i++) {
				this.fractals[i].index = arr[i][0];
				this.fractals[i].reward = arr[i][1];
				this.fractals[i].realReward = arr[i][1];
				this.fractals[i].prob = arr[i][2];
			}
		}

		FractalLoader.prototype.setElementPositions = function() {
			if (this.phase == FracPhases.Slider1) {
				// set up fractals, first slider, done button
				this.createScale(Math.round(Math.random()));
				this.setupScale();
				this.drawContinueButton(true);
				this.rtTimer.start();
			}
			else if (this.phase == FracPhases.Slider2) {
				// clear the screen
				paintPartialBackground(0, 0, canvas.width, canvas.height, fractalBackgroundColor);

				// set up fractals, second slider, done button
				var newIndex = (this.scale.index == 0) ? 1 : 0;
				this.createScale(newIndex);
				this.setupScale();
				this.drawContinueButton(true);
				this.rtTimer.start();
			}
			else if (this.phase == FracPhases.Trials1) {
				// reset all fractals to default dimensions & not visible
				var frac;
				for (var i = 0; i < this.totalFractals; i++) {
					frac = this.fractals[i];
					frac.dim = this.dimensions;
					frac.visible = false;
				}
				this.showWinnings = true;
				this.showQuestion = true;

				// set up left and right fractal positions
				frac = this.fractals[0];
				frac.visible = true;
				frac.position(canvas.width/2.0 - frac.dim - slops, canvas.height/2.0 - frac.dim/2.0);

				frac = this.fractals[1];
				frac.visible = true;
				frac.position(canvas.width/2.0 + slops, canvas.height/2.0 - frac.dim/2.0);

				this.question.midy = this.fractals[0].y + this.fractals[0].dim/2.0;
			}
			else if (this.phase == FracPhases.Trials2) {
				// set up all fractal positions
				for (var i = 0; i < this.totalFractals; i++) {
					var frac = this.fractals[i];
					var pt = this.circlePosition(i, this.fractals[i].dim);
					frac.position(pt.x, pt.y);
					frac.visible = true;
				}
				// move question to the center of canvas
				this.question.midx = canvas.width/2.0;
				this.question.midy = slops/2.0 + canvas.height/2.0;
			}
			else if (this.phase == FracPhases.Slider3) {
				// set up fractals, first slider, done button
				this.createScale(Math.round(Math.random()));
				this.setupScale();
				this.drawContinueButton(true);
				this.rtTimer.start();
			}
			else if (this.phase == FracPhases.Slider4) {
				// clear the screen
				paintPartialBackground(0, 0, canvas.width, canvas.height, fractalBackgroundColor);

				// set up fractals, second slider, done button
				var newIndex = (this.scale.index == 0) ? 1 : 0;
				this.createScale(newIndex);
				this.setupScale();
				this.drawContinueButton(true);
				this.rtTimer.start();
			}
		}

		FractalLoader.prototype.setupScale = function() {
			var availableHeight = canvas.height - 3 * slops;
			var newDim = availableHeight/this.totalFractals;
			var border = 2; // border of 2 pixels
			var arr = [];
			arr.integerFill(this.totalFractals);
			arr.randomize();
			for (var i = 0; i < this.totalFractals; i++) {
				var j = arr[i];
				this.fractals[j].dim = newDim - 2*border;
				var pt = this.sliderPosition(i, newDim);
				this.fractals[j].position(pt.x, pt.y);
				this.fractals[j].drawReward = false; // JIC
				this.fractals[j].dragReward = 0; // init to 0 so no carry-over
				this.fractals[j].highlighted = false; // JIC
				this.fractals[j].display();
			}
			this.scale.display();

			this.showWinnings = false;
			this.showQuestion = false;

			// turn off default document mousedown handler
			startFractalMouseListening();
		}

		FractalLoader.prototype.drawContinueButton = function(show) {
			if (show) {
				var r = this.scale.bounds();
				var ctr = r.center();
				var cr = continueButtonRect();
				this.continueButton = new KeyButton(continue_button, r.l + r.w - cr.w, r.t - cr.h - 2, cr.w, cr.h, "", 0, false);
				this.continueButton.display();
			}
			else {
				this.continueButton.hide();
				this.continueButton = "";
			}
		}

		FractalLoader.prototype.hitOnContinue = function(local) {
			if (this.continue != "" && this.continueButton.containsPoint(local)) {
				return true;
			}
			return false;
		}

		FractalLoader.prototype.recordSliderRT = function(rt) {
			var extras = "Phase " + this.phase + ", Slider " + this.scaleIndex + ", RT " + rt;

			recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.press, 0, 0, extras);
		}

		FractalLoader.prototype.fractalsAllMoved = function() {
			for (var i = 0; i < this.totalFractals; i++) {
				if (this.fractals[i].dragReward == 0) {
					return false;
					break;
				}
			}
			return true;
		}

		FractalLoader.prototype.continueButtonHit = function() {
			var rt = this.rtTimer.elapsed();
			var notMovedText = "Please guess a value for each fractal!";
			// change phase
			if (this.phase == FracPhases.Slider1) {
				if (!this.fractalsAllMoved()) {
					alert(notMovedText);
					return;
				}
				// record their responses for each fractal
				for (var i = 0; i < this.totalFractals; i++) {
					this.fractals[i].recordDragReward(this.scale.name);
				}
				this.recordSliderRT(rt);

				// enter next or final phase
				this.phase = FracPhases.Slider2;
				stage = Stages.ExpectResponse; // so we can track their drags on the fractals
				this.setElementPositions();
			}
			else if (this.phase == FracPhases.Slider2) {
				if (!this.fractalsAllMoved()) {
					alert(notMovedText);
					return;
				}
				// record their responses for each fractal
				for (var i = 0; i < this.totalFractals; i++) {
					this.fractals[i].recordDragReward(this.scale.name);
				}
				this.recordSliderRT(rt);
				this.phase = FracPhases.Trials1;
				stage = Stages.PreStart;
				endFractalMouseListening();
			}
			else if (this.phase == FracPhases.Slider3) {
				if (!this.fractalsAllMoved()) {
					alert(notMovedText);
					return;
				}
				// record their responses for each fractal
				for (var i = 0; i < this.totalFractals; i++) {
					this.fractals[i].recordDragReward(this.scale.name);
				}
				this.recordSliderRT(rt);

				// enter next or final phase
				this.phase = FracPhases.Slider4;
				stage = Stages.ExpectResponse; // so we can track their drags on the fractals
				this.setElementPositions();
			}
			else { // FracPhases.Slider4 only
				if (!this.fractalsAllMoved()) {
					alert(notMovedText);
					return;
				}
				// record their responses for each fractal
				for (var i = 0; i < this.totalFractals; i++) {
					this.fractals[i].recordDragReward(this.scale.name);
				}
				this.recordSliderRT(rt);

				// finish task
				stage = Stages.EndTask;
			}
		}

		FractalLoader.prototype.dragStart = function(local) {
			var wasHit = false;
			for (var i = 0; i < this.totalFractals; i++) {
				wasHit = this.fractals[i].hitOnSelf(local);
				if (wasHit) {
					this.fractals[i].dragStart(local);
					this.dragIndex = i;
					break;
				}
			}
			return wasHit;
		}

		FractalLoader.prototype.dragMove = function(local) {
			if (this.dragIndex >= 0) {
				var fractal = this.fractals[this.dragIndex];
				var boundsRect = this.scale.bounds();

				// adjust local to be fractal.x (using .dragHold)
				var pt = new Point(local.x - fractal.dragHold.x, local.y - fractal.dragHold.y);
				var res = this.scale.valueFromPoint(pt, fractal.dim);
				fractal.dragReward = this.scale.valueTextFromValue(res);
				fractal.dragMove(local, boundsRect, fractalBackgroundColor);
				this.scale.displayValue(res);
			}
		}

		FractalLoader.prototype.dragEnd = function(local) {
			if (this.dragIndex >= 0) {
				var fractal = this.fractals[this.dragIndex];
				var boundsRect = this.scale.bounds();
				fractal.dragEnd(local, boundsRect);
				this.dragIndex = -1;
				this.scale.clear(fractalBackgroundColor);
				this.scale.display();
			}
		}

		FractalLoader.prototype.configuration = function(trial) {
			if (!this.loaded) return;

			this.chosenFractal = "";
			this.otherFractal = "";
			if (this.phase == FracPhases.Trials1 && trial >= this.phase1Trials) {
				this.phase = FracPhases.Trials2;
				this.setElementPositions();
			}
			else if (this.phase == FracPhases.Trials2 && trial >= this.phase1Trials + this.phase2Trials) {
				// enter final phases (free to drag items on scales)
				this.phase = FracPhases.Slider3;
				stage = Stages.ExpectResponse; // so we can track their drags on the fractals
				this.setElementPositions();
			}

			if (this.phase == FracPhases.Trials1) {

				// fill left and right fractals, zero chosenFractal
				var arr = this.dayTrials[trial];

				for (var i = 0; i < 2; i++) {
					// only use the first two
					this.fractals[i].index = this.fracImages[arr[i][0]][0];
					this.fractals[i].reward = arr[i][1];

					// set the probability too
					this.fractals[arr[i][0]].prob = arr[i][2];
				}
			}
			else if (this.phase == FracPhases.Trials2) {
				// we need to show all fractals at once in random order
				var arr = this.fracImages.slice(0); // new copy
				arr.randomize(); // random order

//				arr.printToConsole("arr");
//				this.fracImages.printToConsole("fracImages");

				for (var i = 0; i < this.totalFractals; i++) {
					this.fractals[i].index = arr[i][0];
					var reward = (Math.floor(Math.random() * 2) == 0) ? 0 : arr[i][1];
					this.fractals[i].reward = reward;
					this.fractals[i].realReward = arr[i][1];
				}
			}
		}

		FractalLoader.prototype.setChosen = function(hitIndex) {
			this.chosenFractal = this.fractals[hitIndex];
			this.chosenFractal.highlighted = true;
			var otherIndex = -1;
			if (this.phase == FracPhases.Trials1) {
				otherIndex = (hitIndex == 0) ? 1 : 0;
			}
			else if (this.phase == FracPhases.Trials2) {
				// randomly choose a different one
				otherIndex = this.otherIndex();
			}
			this.otherFractal = this.fractals[otherIndex];
		}

		FractalLoader.prototype.tally = function() {
			this.totalPoints += this.chosenFractal.reward;
		}

		FractalLoader.prototype.analysis = function(taskCode) {
			// create an array of current responses
			var array = responses.extractArray("task", taskCode);
			var summaryXML = array.resultsSummary(codes);

			// record this in responses
			recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.results, 0, 0, summaryXML);
		}

		FractalLoader.prototype.stimulusText = function() {
			if (this.phase == FracPhases.Trials1) {
				var txt1 = this.fractals[0].stimulusText();
				var txt2 = this.fractals[1].stimulusText();
				var indx = this.chosenFractal == this.fractals[0] ? "L" : "R";

				return "Chosen " + indx + ", L " + txt1 + ", R " + txt2;
			}
			else if (this.phase == FracPhases.Trials2) {
				var txt1 = this.chosenFractal.stimulusText();
				var txt2 = this.otherFractal.stimulusText();
				var indx = this.chosenFractal.index;

				return "Chosen " + indx + ", " + txt1 + ", other " + txt2;
			}
		}

		FractalLoader.prototype.displayText = function() {
			if (this.showWinnings) {
				var txt = "Current Winnings: " + this.totalPoints;
				this.textObject.text = txt;
				this.textObject.display();
			}
		}

		FractalLoader.prototype.displayQuestion = function() {
			if (this.showQuestion) {
				this.question.display();
			}
		}

		FractalLoader.prototype.display = function() {
			var total = this.totalFractals;
			if (this.phase == FracPhases.Trials1) {
				total = 2;
			}

			for (var i = 0; i < total; i++) {
				this.fractals[i].display();
			}
			this.displayQuestion();
			this.displayText();
		}

		FractalLoader.prototype.startFeedback = function() {
			this.question.clear(fractalBackgroundColor);

			if (this.phase == FracPhases.Trials1) {
				for (var i = 0; i < 2; i++) {
					this.fractals[i].drawReward = true;
					this.fractals[i].display();
				}
			}
			else if (this.phase == FracPhases.Trials2) {
				for (var i = 0; i < this.totalFractals; i++) {
					this.fractals[i].display();
				}
				this.chosenFractal.drawReward = true;
				this.chosenFractal.display();
//				this.otherFractal.drawReward = true;
				this.otherFractal.drawReward = false;
				this.otherFractal.display();
			}
			this.displayText();

			// start timing
			this.firer.start(function() {fractalLoader.endFeedback();}, this.feedbackDuration);
		}

		FractalLoader.prototype.endFeedback = function() {
			// hide fractals
			for (var i = 0; i < this.totalFractals; i++) {
				this.fractals[i].hide(fractalBackgroundColor);
				this.fractals[i].drawReward = false;
			}
			this.displayText();

			stage = Stages.EndFeedback;
		}

		FractalLoader.prototype.endTask = function() {
			endFractalMouseListening();

			resultsArray.push(this.name + ": " + this.totalPoints);

			// clear up some memory
			for (var i = 0; i < this.totalFractals; i++) {
				this.fractals[i] = "";
			}
		}
	}

	function GapScale(text, color, max, x, y, width) {
		this.min = 0;
		this.max = max; // 0 - max
		this.x = x;
		this.y = y;
		this.width = width;
		this.lineWidth = 5;
		this.color = "white";
		this.context = ctx;

		this.fontSize = 26;

		this.value = 0;

		// scale things
		this.arrowHeight = 48;
		this.arrowWidth = 10;
		this.textSlops = 2;

		this.debugging = false;

		var lineHeight = this.fontSize + this.textSlops;

		this.scaleRect = new Rect(this.x, this.y + 8 * lineHeight, this.width, this.lineWidth);

		this.text = new TextObject(text, this.scaleRect.center().x, this.y, this.fontSize);
		this.text.color = color;

		this.minima = new TextObject(this.min + "", this.x, this.scaleRect.b() + this.textSlops + this.fontSize/2.0, this.fontSize);

		this.maxima = new TextObject(this.max, this.scaleRect.r(), this.scaleRect.b() + this.textSlops + this.fontSize/2.0, this.fontSize);

		this.arrowText = new TextObject("0", this.x, this.scaleRect.t - this.arrowHeight - this.textSlops - this.fontSize/2.0, this.fontSize);

		this.dragging = false; // true if currently being dragged

		GapScale.prototype.bounds = function() {
			// return the bounding rect of the scale
			var border = this.arrowWidth/2.0;
			var left = this.minima.bounds().l;
			var right = this.maxima.bounds().r();
			var mr = this.minima.bounds();
			var height = mr.b() - this.y;

			return new Rect(left - border, this.y, (right - left) + 2 * border, height);
		}

		GapScale.prototype.pointInRect = function(x, y) {
			return this.bounds().pointInRect(x, y);
		}

		GapScale.prototype.hitOnSelf = function(local) {
			// return true if local is in this GapScale
			var correct = this.pointInRect(local.x, local.y, 0);
			return correct;
		}

		GapScale.prototype.dragStart = function(local) {
			this.dragging = true;
		}

		GapScale.prototype.dragMove = function(mousePos) {
			if (this.dragging) {

				// clamp to within own bounds
				var bounds = this.scaleRect;
				var min = bounds.l;
				var max = bounds.r();
				var posX = mousePos.x;
				posX = (posX < min) ? min : ((posX > max) ? max : posX);

				if (posX != this.x) {
					this.value = this.valueFromX(posX);
					this.display();
				}
			}
		}

		GapScale.prototype.dragEnd = function(mousePos) {
			this.dragging = false;
		}

		GapScale.prototype.valueFromX = function(localX) {
			// return the value equivalent to this point on the scale
			var val = this.min + (this.max - this.min) * (localX - this.x)/this.width;
			return Math.round(val);
		}

		GapScale.prototype.xFromValue = function(value) {
			// return the x point give a scale value
			if (value < this.min) value = this.min; // pegged
			else if (value > this.max) value = this.max;
			var newX = this.x + (value - this.min) * this.width/(this.max - this.min);
			return Math.round(newX);
		}

		GapScale.prototype.drawScale = function() {
			if (this.debugging) {
				// debugging - draw whole bounds in yellow
				this.context.save();
				var r = this.bounds();
				this.context.strokeStyle = "yellow";
				this.context.lineWidth = 1;
				this.context.strokeRect(r.l, r.t, r.w, r.h);
				this.context.restore();

				// debugging - draw scaleRect bounds in red
				this.context.save();
				var r = this.scaleRect;
				this.context.strokeStyle = "red";
				this.context.lineWidth = 1;
				this.context.strokeRect(r.l, r.t, r.w, r.h);
				this.context.restore();
			}

			// draw rect
			this.context.save();
			this.context.fillStyle = this.color;
			this.context.fillRect(this.scaleRect.l, this.scaleRect.t, this.scaleRect.w, this.scaleRect.h);
			this.context.restore();

			// draw text objects min & max
			this.minima.display();
			this.maxima.display();
		}

		GapScale.prototype.drawLeftHalfArrow = function(value, color) {
			this.context.save();

			this.context.lineWidth = 1;
			this.context.strokeStyle = color;
			this.context.fillStyle = color;
			var startX = this.xFromValue(value);
			var startY = this.scaleRect.t;

			this.context.beginPath();
			this.context.moveTo(startX, startY);
			this.context.lineTo(startX - this.arrowWidth, startY - this.arrowHeight/4.0);
			this.context.lineTo(startX - this.arrowWidth/2.0, startY - this.arrowHeight/4.0);
			this.context.lineTo(startX - this.arrowWidth/2.0, startY - this.arrowHeight);
			this.context.lineTo(startX, startY - this.arrowHeight);
			this.context.closePath();
			this.context.fill();

			this.context.restore();

			this.arrowText.midx = startX;
			this.arrowText.text = value + "";
			this.arrowText.display();
		}

		GapScale.prototype.drawRightHalfArrow = function(value, color) {
			this.context.save();

			this.context.lineWidth = 1;
			this.context.strokeStyle = color;
			this.context.fillStyle = color;
			var startX = this.xFromValue(value);
			var startY = this.scaleRect.t;

			this.context.beginPath();
			this.context.moveTo(startX, startY);
			this.context.lineTo(startX, startY - this.arrowHeight);
			this.context.lineTo(startX + this.arrowWidth/2.0, startY - this.arrowHeight);
			this.context.lineTo(startX + this.arrowWidth/2.0, startY - this.arrowHeight/4.0);
			this.context.lineTo(startX + this.arrowWidth, startY - this.arrowHeight/4.0);
			this.context.closePath();
			this.context.fill();

			this.context.restore();

			this.arrowText.midx = startX;
			this.arrowText.text = value + "";
			this.arrowText.display();
		}

		GapScale.prototype.drawArrow = function(value, color) {
			this.context.save();

			this.context.lineWidth = 1;
			this.context.strokeStyle = color;
			this.context.fillStyle = color;
			var startX = this.xFromValue(value);
			var startY = this.scaleRect.t;

			this.context.beginPath();
			this.context.moveTo(startX, startY);
			this.context.lineTo(startX - this.arrowWidth, startY - this.arrowHeight/4.0);
			this.context.lineTo(startX - this.arrowWidth/2.0, startY - this.arrowHeight/4.0);
			this.context.lineTo(startX - this.arrowWidth/2.0, startY - this.arrowHeight);
			this.context.lineTo(startX + this.arrowWidth/2.0, startY - this.arrowHeight);
			this.context.lineTo(startX + this.arrowWidth/2.0, startY - this.arrowHeight/4.0);
			this.context.lineTo(startX + this.arrowWidth, startY - this.arrowHeight/4.0);
			this.context.closePath();
			this.context.fill();

			this.context.restore();

			this.arrowText.midx = startX;
			this.arrowText.text = value + "";
			this.arrowText.display();
		}

		GapScale.prototype.drawBottomArrow = function(value, color) {
			this.context.save();

			this.context.lineWidth = 1;
			this.context.strokeStyle = color;
			this.context.fillStyle = color;
			var startX = this.xFromValue(value);
			var startY = this.scaleRect.b();

			this.context.beginPath();
			this.context.moveTo(startX, startY);
			this.context.lineTo(startX - this.arrowWidth, startY + this.arrowHeight/4.0);
			this.context.lineTo(startX - this.arrowWidth/2.0, startY + this.arrowHeight/4.0);
			this.context.lineTo(startX - this.arrowWidth/2.0, startY + this.arrowHeight/2.0);
			this.context.lineTo(startX + this.arrowWidth/2.0, startY + this.arrowHeight/2.0);
			this.context.lineTo(startX + this.arrowWidth/2.0, startY + this.arrowHeight/4.0);
			this.context.lineTo(startX + this.arrowWidth, startY + this.arrowHeight/4.0);
			this.context.closePath();
			this.context.fill();

			this.context.restore();
		}

		GapScale.prototype.display = function() {
			var r = this.bounds();
			paintPartialBackground(r.l, r.t, r.w, r.h, gapBackgroundColor);
			if (this.text.text != "") {
				this.text.display();
			}
			this.drawScale();
			this.drawArrow(this.value, this.text.color);
		}
	}

	function GapScaleDisplay(pointsText, realScoreText, firstGuessText, secondGuessText, realValue, preValue, postValue, bonusPre, bonusPost, bonusColor, realColor, preColor, postColor, max, x, y, width) {

		// their estimate values and colors
		this.preValue = preValue;	// first guess (
		this.preColor = preColor;

		this.postValue = postValue;	// second guess
		this.postColor = postColor;

		this.realValue = realValue;	// real score
		this.realColor = realColor;

		this.bonusPre = bonusPre;	// first bonus
		this.bonusPost = bonusPost;	// second bonus
		this.bonusColor = bonusColor;

		// we use a gapScale to draw the components we need
		this.gapScale = new GapScale("", "white", max, x, y, width);

		var lineHeight = this.gapScale.fontSize + this.gapScale.textSlops;

		// points, real score, first guess, second guess text
		var w1 = this.gapScale.context.measureText(realScoreText).width;
		var col1 = x + w1/2;
		var col2 = x + w1 + 20;
		var col3 = col2 + 20 + w1/2;
		var bonusPreText = (this.bonusPre > 0 ? "+" : "") + this.bonusPre;
		var bonusPostText = (this.bonusPost > 0 ? "+" : "") + this.bonusPost;

		this.pointsTextObject = new TextObject(pointsText, col3, y, this.gapScale.fontSize);
		this.pointsTextObject.color = this.bonusColor;

		this.realScoreTextObject = new TextObject(realScoreText, col1, y + lineHeight, this.gapScale.fontSize);
		this.realScoreTextObject.color = this.realColor;

		this.realObject = new TextObject(this.realValue, col2, y + lineHeight, this.gapScale.fontSize);
		this.realObject.color = this.realColor;

		var w = this.gapScale.context.measureText(firstGuessText).width;
		this.firstGuessTextObject = new TextObject(firstGuessText, x + w/2, y + 2 * lineHeight, this.gapScale.fontSize);
		this.firstGuessTextObject.color = this.preColor;

		this.preObject = new TextObject(this.preValue, col2, y + 2 * lineHeight, this.gapScale.fontSize);
		this.preObject.color = this.preColor;

		this.bonusPreObject = new TextObject(bonusPreText, col3, y + 2 * lineHeight, this.gapScale.fontSize);
		this.bonusPreObject.color = this.bonusColor;

		w = this.gapScale.context.measureText(secondGuessText).width;
		this.secondGuessTextObject = new TextObject(secondGuessText, x + w/2, y + 3 * lineHeight, this.gapScale.fontSize);
		this.secondGuessTextObject.color = this.postColor;

		this.postObject = new TextObject(this.postValue, col2, y + 3 * lineHeight, this.gapScale.fontSize);
		this.postObject.color = this.postColor;

		this.bonusPostObject = new TextObject(bonusPostText, col3, y + 3 * lineHeight, this.gapScale.fontSize);
		this.bonusPostObject.color = this.bonusColor;

		GapScaleDisplay.prototype.bounds = function() {
			// return the bounding rect of the scale
			return this.gapScale.bounds();
		}

		GapScaleDisplay.prototype.display = function() {
			var r = this.bounds();
			paintPartialBackground(r.l, r.t, r.w, r.h, gapBackgroundColor);

			// show the texts
			this.pointsTextObject.display();
			this.realScoreTextObject.display();
			this.realObject.display();
			this.firstGuessTextObject.display();
			this.preObject.display();
			this.bonusPreObject.display();
			this.secondGuessTextObject.display();
			this.postObject.display();
			this.bonusPostObject.display();

			// show the scale
			this.gapScale.drawScale();

			// show the arrows
			if (Math.abs(this.preValue - this.postValue) > 1) {
				this.gapScale.drawArrow(this.preValue, this.preColor);
				this.gapScale.drawArrow(this.postValue, this.postColor);
			}
			else {
				if (this.preValue < this.postValue) {
					this.gapScale.drawLeftHalfArrow(this.preValue, this.preColor);
					this.gapScale.drawRightHalfArrow(this.postValue, this.postColor);
				}
				else {
					this.gapScale.drawLeftHalfArrow(this.postValue, this.postColor);
					this.gapScale.drawRightHalfArrow(this.preValue, this.preColor);
				}
			}
			this.gapScale.drawBottomArrow(this.realValue, this.realColor);
		}
	}

	function GapLoader(task) { // guess gap loader
		this.name = task.brief;
		this.trials = task.trials;
		this.d1 = new Point(task.d1min, task.d1max); // eg 1000, 2000
		this.d2 = new Point(task.d2min, task.d2max); // eg 2500, 4500
		this.dur = new Point(task.d1dur, task.d2dur); // eg 200, 200
		this.dCeiling = task.dceil; // (eg 10,000ms)
		this.maxScore = task.maxscore; // eg 30 (could be 0-100)
		this.zeroTime = task.zerotime; // ms (typically 1000)
		this.pilotX = new Point(task.x1, task.x2); // eg 100, 900
		this.lineWidth = task.linewidth;
		this.fixationLength = task.fixationlength; // length of arms
		this.fixLineWidth = task.fixlinewidth;
		this.fontSize = task.fontsize;
		this.feedbackDur = task.feedback; // duration of feedback
		this.finalFeedback = task.finalfeedback; // duration to show their results
		this.tooSlowText = task.tooslowtext;
		this.tooFastText = task.toofasttext;
		this.predictionText = task.predictiontext; // How good do you think you will be?
		this.selfRatingText = task.selfratingtext; // Rate today's performance
		this.bonusPointsText = task.bonuspointstext; // Points:
		this.yourRealScoreText = task.yourrealscoretext; // Real score:
		this.firstguesstext = task.firstguesstext; // 1st guess:
		this.secondguesstext = task.secondguesstext; // 2nd guess:

		this.phase = 0; // 3 phases: predict, do, postmortem

		this.delay1 = 0; // first random delay
		this.delay2 = 0; // the computed random delay2
		this.rt = 0;	// reaction time
		this.diff = 0; // their response difference (- if early or + if late)
		this.totalScore = 0; // total score that needs to be divided by the number of trials before being reported finally. This is because the equaations to determine the scores returns 0-30, which are then shown to the subject, and then this is added to the total score each time.
		this.score = 0;
		this.zeroTrials = 0;

		// phase 1 members
		this.state = States.Waiting; // 0
		this.center = new Point(canvas.width/2.0, canvas.height/2.0);
		this.radius = 100;
		this.continueButton = "";

		this.textObject = new TextObject(task.initialtext, this.center.x, this.center.y, this.fontSize);
		this.textObject.color = "lime";

		this.textDiff = new TextObject("0", this.center.x, this.center.y + this.radius + this.fontSize + 4, this.fontSize);
		this.textDiff.color = "lime";

		this.scaleWidth = 200;
		this.scaleHeight = 200;
		this.gapScale = "";
		this.gapScaleDisplay = "";
		this.preValue = 0;
		this.postValue = 0;
		this.preValueRT = 0;
		this.postValueRT = 0;
		this.preColor = "#7fffff";
		this.postColor = "yellow";
		this.realColor = "lime";
		this.bonusPre = 0;
		this.bonusPost = 0;
		this.bonusColor = "FF6347"; // "tomato"

		this.daysYValues = [];

		GapLoader.prototype.load = function() {
			// load today's trials into this object for trial use
			// these are stored in $(#stimuli).html as a json array string
			this.daysYValues = JSON.parse($("#gaps").html());
			this.daysYValues.printToConsole();

			this.loaded = true;
		}

		GapLoader.prototype.preTrialsGuess = function() {
			this.gapScale = new GapScale(this.predictionText, "#7fffff", this.maxScore, canvas.width/2.0 - this.scaleWidth/2.0, canvas.height/3.0 - this.scaleHeight/2, this.scaleWidth);
			this.createContinueButton();
			this.gapScale.display();
			this.drawContinueButton(true);
			startGapMouseListening();
		}

		GapLoader.prototype.postTrialsGuess = function() {
			this.gapScale = new GapScale(this.selfRatingText, "yellow", this.maxScore, canvas.width/2.0 - this.scaleWidth/2.0, canvas.height/2.0 - this.scaleHeight/2, this.scaleWidth);
			this.createContinueButton();
			this.gapScale.display();
			this.drawContinueButton(true);
			startGapMouseListening();
		}

		GapLoader.prototype.postTrialsDisplay = function() {
			var correctedScore = this.correctedTotalScore();

			this.gapScaleDisplay = new GapScaleDisplay(this.bonusPointsText, this.yourRealScoreText, this.firstguesstext, this.secondguesstext, correctedScore, this.preValue, this.postValue, this.bonusPre, this.bonusPost, this.bonusColor, this.realColor, this.preColor, this.postColor, this.maxScore, canvas.width/2.0 - this.scaleWidth/2.0, canvas.height/3.0 - this.scaleHeight/2, this.scaleWidth);

			this.createContinueButton();
			this.gapScaleDisplay.display();
			this.drawContinueButton(true);
			startGapMouseListening();
		}

		GapLoader.prototype.dragStart = function(local) {
			var wasHit = this.gapScale.hitOnSelf(local);
			if (wasHit) {
				this.gapScale.dragStart(local);
			}
			return wasHit;
		}

		GapLoader.prototype.dragMove = function(local) {
			// pass it to the gapScale
			this.gapScale.dragMove(local);
			this.continueButton.display();
		}

		GapLoader.prototype.dragEnd = function(local) {
			this.gapScale.dragEnd(local);
			if (this.phase == 0) {
				this.preValue = this.gapScale.value;
			}
			else if (this.phase == 2) {
				this.postValue = this.gapScale.value;
			}
			this.continueButton.display();
		}

		GapLoader.prototype.hitIsInCircle = function(local) {
			var circle = new Circle(this.center.x, this.center.y, this.radius );
			return circle.pointInCircle(local.x, local.y);
		}

		GapLoader.prototype.startWaiting = function() {
			paintPartialBackground(0, 0, canvas.width, canvas.height, gapBackgroundColor);

			// show grey circle centrally
			this.displayCircle(ctx, "grey", false);

			// draw text overlaid
			this.textObject.display();

			this.state = States.Waiting;
		}

		GapLoader.prototype.workoutDelays = function() {
			this.delay2 = Math.round(this.d2.x + Math.random() * (this.d2.y - this.d2.x));

			this.delay1 = Math.round(this.d1.x + Math.random() * (this.d1.y - this.d1.x));
		}

		GapLoader.prototype.startDelay1 = function() {
			// waiting for them to click to start this trial
			// any click starts

			// clear the screen
			paintPartialBackground(0, 0, canvas.width, canvas.height, gapBackgroundColor);

			// show grey circle only
			this.displayCircle(ctx, "grey", false);

			this.workoutDelays();
			while(this.delay1 + this.delay2 > this.dCeiling) {
				this.workoutDelays();
			}

			// start delay 1
			stageFirer.start(function() {gapLoader.showCircle1()}, this.delay1);

			this.state = States.WhiteCircles;
			stage = Stages.ExpectResponse; // so we can ignore it!
		}

		GapLoader.prototype.showCircle1 = function() {
			// show white filled circle (don't need to clear screen)
			this.displayCircle(ctx, "white", true);

			// start circle delay
			stageFirer.start(function() {gapLoader.startDelay2()}, this.dur.x);
		}

		GapLoader.prototype.startDelay2 = function() {
			// clear the screen
			paintPartialBackground(0, 0, canvas.width, canvas.height, gapBackgroundColor);

			// show grey circle with central fixation
			this.displayCircle(ctx, "grey", false);
			this.drawFixation(ctx, "grey");

			// start delay 2
			stageFirer.start(function() {gapLoader.showCircle2()}, this.delay2);
		}

		GapLoader.prototype.showCircle2 = function() {
			// show white filled circle (don't need to clear screen)
			this.displayCircle(ctx, "white", true);

			// start circle delay
			stageFirer.start(function() {gapLoader.startGap()}, this.dur.y);
		}

		GapLoader.prototype.startGap = function() {
			// clear the screen
			paintPartialBackground(0, 0, canvas.width, canvas.height, gapBackgroundColor);

			// show grey circle
			this.displayCircle(ctx, "grey", false);

			// start reaction time tracking
			this.state = States.Response;
			stage = Stages.Stimulus;
		}

		GapLoader.prototype.guessedGap = function(rt) {
			// clear the screen
			paintPartialBackground(0, 0, canvas.width, canvas.height, gapBackgroundColor);

			// show open green circle
			this.displayCircle(ctx, "green", false);

			// show text feedback (ms difference this.delay2 & rt)
			this.rt = Math.round(rt);
			this.diff = Math.round(rt - this.delay2); // -ve if early
			var absDiff = Math.abs(this.diff);

			// calc & add score
			this.score = this.calcScore(absDiff);
			this.totalScore += this.score; // even if 0

			this.textDiff.text = Math.round(this.score);
			this.textDiff.display();

//			printToConsole("guessedGap: rt " + rt + ", delay " + this.delay2 + ", diff " + this.diff + ", abs " + absDiff);

			// record this response
			var code = (this.score == 0) ? codes.fp : codes.tp;
			recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), code, absDiff, lastKey, gapLoader.stimulusText());

			maxoutFirer.stop();
			lastReactionTime = rt;
			consecutiveErrors = 0;

			bufferLoader.play(clickSound, 0);

			// feedback by alert if this.score == 0 (ie > this.zeroTime)
			if (this.score == 0) {
				// these are not calculated in the total score
				this.zeroTrials++;
				if (this.diff < 0) {
					alert(this.tooFastText);
				}
				else {
					alert(this.tooSlowText);
				}
			}
			this.state = States.Feedback;
			stage = Stages.Feedback;
			stageFirer.start(function() {gapLoader.endTrialFeedback()}, this.feedbackDur);
		}

		GapLoader.prototype.endTrialFeedback = function() {
			paintPartialBackground(0, 0, canvas.width, canvas.height, gapBackgroundColor);

			currentTrial++;

			stageFirer.stop();

			if (currentTrial >= taskOrder[currentTask].trials) {
				this.phase = 2;
			}

			// begin the trial
			stage = Stages.StartTrial;
		}

		GapLoader.prototype.stimulusText = function() {
			// create the extras text here
			// the delay1, delay2, rt, diff, score, totalScore
			return "Delay1 " + this.delay1 + ", Delay2 " + this.delay2 + ", RT " + this.rt + ", Diff " + this.diff + ", Score " + Math.round(this.score) + ", Total score " + this.totalScore + ", preGuess " + this.preValue + ", postGuess " + this.postValue + ", preGuessRT " + this.preValueRT + ", postGuessRT " + this.postValueRT + ", bonusPre " + this.bonusPre + ", bonusPost " + this.bonusPost;
		}

		GapLoader.prototype.calcScore = function(diff) {
			// given diff work out their score
			// if more than zeroTime, get 0
			var calc = 0;
			//if (diff > this.zeroTime) {
            if (diff > this.daysYValues[5]) {
				return calc;
			}
			var y1st = this.daysYValues[0];
			var y2nd = this.daysYValues[1];
			var x1, x2, y1, y2;

			//if (diff < this.pilotX.x) { // first x value inflection
			//	// nice job!
			//	x1 = 0;
			//	x2 = this.pilotX.x;
			//	y1 = this.maxScore;
			//	y2 = y1st;
			//}
			//else if (diff < this.pilotX.y) { // second x value inflection
			//	// not too shabby!
			//	x1 = this.pilotX.x;
			//	x2 = this.pilotX.y;
			//	y1 = y1st;
			//	y2 = y2nd;
	        //}
			//else {
			//	// borderline guess!
			//	x1 = this.pilotX.y;
			//	x2 = this.zeroTime;
			//	y1 = y2nd;
			//	y2 = 0;
			//}

            if (diff < this.daysYValues[3]) { // first x value inflection
				// nice job!
				x1 = 0;
				x2 = this.daysYValues[3];
				y1 = this.daysYValues[2];
				y2 = y1st;
			}
			else if (diff < this.daysYValues[4]) { // second x value inflection
				// not too shabby!
				x1 = this.daysYValues[3];
				x2 = this.daysYValues[4];
				y1 = y1st;
				y2 = y2nd;
			}
			else {
				// borderline guess!
				x1 = this.daysYValues[4];
				x2 = this.daysYValues[5];
				y1 = y2nd;
				y2 = 0;
			}
			// for y = mx + c: m = (y-c)/x; c = y - mx;
			// for 2 points: c = (x1y2 - x2y1)/(x1-x2)
			var c, m;
			c = (x1 * y2 - x2 * y1)/(x1 - x2);
			if (x1 == 0) {
				m = (y2 - c)/x2;
			}
			else {
				m = (y1 - c)/x1;
			}

			// work out their score using this equation:
			return (m * diff + c); // max score is maxScore
		}

		GapLoader.prototype.correctedTotalScore = function() {
			// takes number of trials into account
			return Math.round(this.totalScore/(this.trials - this.zeroTrials));
		}

		GapLoader.prototype.displayCircle = function(context, color, filled) {
			var startRads = deg2Rad(0);
			var endRads = deg2Rad(360);

			context.save();

			context.beginPath();
			context.arc(this.center.x, this.center.y, this.radius, startRads, endRads);
			if (filled) {
				context.fillStyle = color;
				context.fill();
			}
			context.lineWidth = this.lineWidth;
			context.strokeStyle = color;
			context.stroke();

			context.restore();
		}

		GapLoader.prototype.drawFixation = function(context, color) {

			context.save();

			context.lineWidth = this.fixLineWidth;
			context.strokeStyle = color;

			context.beginPath();
			context.moveTo(this.center.x, this.center.y - this.fixationLength/2.0);
			context.lineTo(this.center.x, this.center.y + this.fixationLength/2.0);
			context.stroke();

			context.beginPath();
			context.moveTo(this.center.x - this.fixationLength/2.0, this.center.y);
			context.lineTo(this.center.x + this.fixationLength/2.0, this.center.y);
			context.stroke();

			context.restore();
		}

        GapLoader.prototype.bonusScore = function(guess, actual) {
			var diff = Math.abs(Math.round(guess - actual));
			var score = 0;
			if (diff == 0) score = 5;
			else if (diff == 1) score = 4;
			else if (diff == 2) score = 3;
			else if (diff == 3) score = 2;
            else if (diff == 4) score = 1;

			return score;
		}

		GapLoader.prototype.createContinueButton = function() {
			var r = this.gapScale.bounds();

			var ctr = r.center();
			var cr = continueButtonRect();
			this.continueButton = new KeyButton(continue_button, ctr.x - cr.w/2.0, r.b() + 2, cr.w, cr.h, "", 0, false);
			this.continueButton.bgColor = gapBackgroundColor;
		}

		GapLoader.prototype.drawContinueButton = function(show) {
			if (show) {
				this.continueButton.display();
			}
			else {
				this.continueButton.hide();
				this.continueButton = "";
			}
		}

		GapLoader.prototype.hitOnContinue = function(local) {
			if (this.continueButton != "" && this.continueButton.containsPoint(local)) {
				return true;
			}
			return false;
		}

		GapLoader.prototype.continueButtonHit = function() {

			// change phase
			if (this.phase == 0) {
				// record their responses into this.preValue
				var rt = reactionTimer.elapsed();
				this.preValueRT = rt;
				this.preValue = this.gapScale.value;
				endGapMouseListening();
				this.drawContinueButton(false);

				// record reaction time for this
				recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.guess, rt, lastKey, gapLoader.stimulusText());

				this.phase = 1;
				stage = Stages.StartTrial; // so we can track their drags on the arrow
			}
			else if (this.phase == 2) {
				this.postValueRT = reactionTimer.elapsed();
				this.postValue = this.gapScale.value;
				endGapMouseListening();
				this.drawContinueButton(false);

				paintPartialBackground(0, 0, canvas.width, canvas.height, gapBackgroundColor);

				var correctedScore = this.correctedTotalScore();
				this.bonusPre = 3*this.bonusScore(this.preValue, correctedScore);
				this.bonusPost = this.bonusScore(this.postValue, correctedScore);

				var finalScore = this.bonusPre + this.bonusPost;

				resultsArray.push(this.name + ": " + finalScore);

				// record this response
				recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.final, 0, lastKey, gapLoader.stimulusText());

				// just show this now but in future they want some animations
				gapLoader.postTrialsDisplay();

				stage = Stages.PreStimulus; // last phase - no dragging

				stageFirer.start(function() {gapLoader.endTask()}, this.finalFeedback);

				this.phase = 3;
			}
			else if (this.phase == 3) {
				// end the task
				stage = Stages.EndTask;
				stageFirer.stop();
			}
		}

		GapLoader.prototype.endTask = function() {
			stage = Stages.EndTask;
		}

		GapLoader.prototype.analysis = function(taskCode) {

			// create an array of current responses
			var array = responses.extractArray("task", taskCode);
			var summaryXML = array.resultsSummary(codes);

			// record this in responses
			recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.results, 0, 0, summaryXML);
		}


	}

	function MoodScale(mintext, midtext, maxtext, fontsize, linewidth, linecolor, max, x, y, width) {
		this.max = max; // eg 10
		this.min = 0 - max; // eg -10
		this.x = x; // left
		this.y = y; // top
		this.width = width;
		this.lineWidth = linewidth;
		this.color = linecolor;
		this.context = ctx;

		this.textColor = "white";
		this.fontSize = fontsize; // eg 26

		this.value = 0;

		// scale things
		this.arrowHeight = 48;
		this.arrowWidth = 10;
		this.shadowOffset = 1;
		this.iconSlops = this.arrowWidth;

		this.iconDim = 60;
		this.textSlops = this.iconDim/2.0;

		this.debugging = false;

		this.scaleRect = new Rect(this.x, this.y, this.width, this.lineWidth);

		// set up text objects
		var textY = this.scaleRect.b() + this.textSlops + Math.round(this.fontSize/2.0);

		this.minText = new TextObject(mintext, this.x - this.iconSlops - this.iconDim/2.0, textY, this.fontSize);
		this.minText.color = this.textColor;

		this.midText = new TextObject(midtext, this.scaleRect.center().x, textY, this.fontSize);
		this.midText.color = this.textColor;

		this.maxText = new TextObject(maxtext, this.scaleRect.r() + this.iconSlops + this.iconDim/2.0, textY, this.fontSize);
		this.maxText.color = this.textColor;

		this.arrowText = new TextObject("0", this.scaleRect.center().x, this.y - this.arrowHeight - this.textSlops - this.fontSize/2.0, this.fontSize);
		this.arrowText.color = this.textColor;

		this.dragging = false; // true if currently being dragged

		MoodScale.prototype.bounds = function() {
			// return the bounding rect of the whole scale
			var border = 1; // for crisp clearing
			var left = this.minText.bounds().l;
			var right = this.maxText.bounds().r();
			var top = this.arrowText.bounds().t;
			var bottom = this.midText.bounds().b();

			return new Rect(left - border, top - border, (right - left) + 2 * border, (bottom - top) + 2 * border);
		}

		MoodScale.prototype.pointInRect = function(x, y) {
			return this.bounds().pointInRect(x, y);
		}

		MoodScale.prototype.hitOnSelf = function(local) {
			// return true if local is in this MoodScale
			var correct = this.pointInRect(local.x, local.y, 0);
			return correct;
		}

		MoodScale.prototype.dragStart = function(local) {
			this.dragging = true;
		}

		MoodScale.prototype.dragMove = function(mousePos) {
			if (this.dragging) {

				// clamp to within own bounds
				var bounds = this.scaleRect;
				var min = bounds.l;
				var max = bounds.r();
				var posX = mousePos.x;
				posX = (posX < min) ? min : ((posX > max) ? max : posX);

				if (posX != this.x) {
					this.value = this.valueFromX(posX);
					this.display();
				}
			}
		}

		MoodScale.prototype.dragEnd = function(mousePos) {
			this.dragging = false;
		}

		MoodScale.prototype.valueFromX = function(localX) {
			// return the value equivalent to this point on the scale
			var val = this.min + (this.max - this.min) * (localX - this.x)/this.width;
			return Math.round(val);
		}

		MoodScale.prototype.xFromValue = function(value) {
			// return the x point give a scale value
			if (value < this.min) value = this.min; // pegged
			else if (value > this.max) value = this.max;
			var newX = this.x + (value - this.min) * this.width/(this.max - this.min);
			return Math.round(newX);
		}

		MoodScale.prototype.drawScale = function() {
			if (this.debugging) {
				// debugging - draw whole bounds in yellow
				this.context.save();
				var r = this.bounds();
				this.context.strokeStyle = "yellow";
				this.context.lineWidth = 1;
				this.context.strokeRect(r.l, r.t, r.w, r.h);
				this.context.restore();

				// debugging - draw scaleRect bounds in red
				this.context.save();
				var r = this.scaleRect;
				this.context.strokeStyle = "red";
				this.context.lineWidth = 1;
				this.context.strokeRect(r.l, r.t, r.w, r.h);
				this.context.restore();
			}

			// draw shadow
			this.context.save();
			this.context.fillStyle = "black";
			this.context.fillRect(this.scaleRect.l + this.shadowOffset, this.scaleRect.t + this.shadowOffset, this.scaleRect.w, this.scaleRect.h);
			this.context.restore();

			// draw rect
			this.context.save();
			this.context.fillStyle = this.color;
			this.context.fillRect(this.scaleRect.l, this.scaleRect.t, this.scaleRect.w, this.scaleRect.h);
			this.context.restore();

			// draw text objects
			this.minText.display();
			this.midText.display();
			this.maxText.display();

			// draw the icons (left & right)
			this.drawEmoticon("red", this.scaleRect.l - this.iconSlops - this.iconDim/2.0, this.scaleRect.center().y, false);
			this.drawEmoticon("lime", this.scaleRect.r() + this.iconSlops + this.iconDim/2.0, this.scaleRect.center().y, true);
		}

		MoodScale.prototype.drawEmoticon = function(color, midx, midy, happy) {

			this.context.save();

			// circle
			this.context.beginPath();
			this.context.arc(midx, midy, this.iconDim/2.0, 0, 2 * Math.PI);
			this.context.fillStyle = color;
			this.context.fill();
			this.context.strokeStyle = "black";
			this.context.lineWidth = 1; // thin
			this.context.stroke();

			// left eye
			var eye = new Point(midx - 0.17 * this.iconDim, midy - 0.175 * this.iconDim);
			this.context.beginPath();
			this.context.arc(eye.x, eye.y, this.iconDim/12.0, 0, 2 * Math.PI);
			this.context.fillStyle = "black";
			this.context.fill();

			// right eye
			eye = new Point(midx + 0.17 * this.iconDim, midy - 0.175 * this.iconDim);
			this.context.beginPath();
			this.context.arc(eye.x, eye.y, this.iconDim/12.0, 0, 2 * Math.PI);
			this.context.fillStyle = "black";
			this.context.fill();

			// mouth (as quadratic)
			this.context.beginPath();
			var radius = 5 * this.iconDim/15.0;
			if (happy) {
				// draw happy smile
				this.context.arc(midx, midy - radius/8, radius, 0.1 * Math.PI, 0.9 * Math.PI);
			}
			else {
				// draw sad face
				this.context.arc(midx, midy + this.iconDim/2.5, radius, 1.1 * Math.PI, 1.9 * Math.PI);
			}
			this.context.lineWidth = 7 * this.iconDim/150.0;
			this.context.strokeStyle = "black";
			this.context.stroke();

			this.context.restore();
		}

		MoodScale.prototype.drawAnArrow = function(startX, startY, color) {
			// allows drawing a shadow to the arrow
			this.context.save();

			this.context.lineWidth = 1;
			this.context.strokeStyle = color;
			this.context.fillStyle = color;

			this.context.beginPath();
			this.context.moveTo(startX, startY);
			this.context.lineTo(startX - this.arrowWidth, startY - this.arrowHeight/4.0);
			this.context.lineTo(startX - this.arrowWidth/2.0, startY - this.arrowHeight/4.0);
			this.context.lineTo(startX - this.arrowWidth/2.0, startY - this.arrowHeight);
			this.context.lineTo(startX + this.arrowWidth/2.0, startY - this.arrowHeight);
			this.context.lineTo(startX + this.arrowWidth/2.0, startY - this.arrowHeight/4.0);
			this.context.lineTo(startX + this.arrowWidth, startY - this.arrowHeight/4.0);
			this.context.closePath();
			this.context.fill();
			this.context.restore();
		}

		MoodScale.prototype.drawArrow = function(value, color) {
			var startX = this.xFromValue(value);
			var startY = this.scaleRect.t;

			// draw shadow of arrow
			this.drawAnArrow(startX + this.shadowOffset, startY + this.shadowOffset, "black");
			this.drawAnArrow(startX, startY, color);

			this.arrowText.midx = startX;
			this.arrowText.text = (value > 0 ? "+" : "") + value + "";
			this.arrowText.display();
		}

		MoodScale.prototype.display = function() {
			var r = this.bounds();
			paintPartialBackground(r.l, r.t, r.w, r.h, moodBackgroundColor);
			this.drawScale();
			this.drawArrow(this.value, this.color);
		}
	}

	function MoodLoader(task, index) { // Mood loader
		this.trials = task.trials;
		this.lineWidth = task.linewidth;
		this.fontSize = task.fontsize;
		this.titleFontSize = task.titlefontsize;
		this.index = index;

		this.continueButton = "";
		this.center = new Point(canvas.width/2.0, canvas.height/2.0);
		this.titleHeight = 200; // distance from center for title

		this.textObject = new TextObject(task.initialtext, this.center.x, this.center.y - this.titleHeight - this.fontSize/2.0, this.titleFontSize);

		this.scaleWidth = 400;
		this.moodScale = "";
		this.value = 0;

		MoodLoader.prototype.load = function() {
			// show the mood scale
			this.moodScale = new MoodScale("very unhappy", "neutral", "very happy", this.fontSize, this.lineWidth, "deepskyblue", 10, this.center.x - this.scaleWidth/2.0, this.center.y, this.scaleWidth);

			this.loaded = true;
		}

		MoodLoader.prototype.moodEstimate = function() {
			this.textObject.display();
			this.createContinueButton();
			this.moodScale.display();
			this.drawContinueButton(true);
			startMoodMouseListening();
		}

		MoodLoader.prototype.dragStart = function(local) {
			var wasHit = this.moodScale.hitOnSelf(local);
			if (wasHit) {
				this.moodScale.dragStart(local);
			}
			return wasHit;
		}

		MoodLoader.prototype.dragMove = function(local) {
			// pass it to the moodScale
			this.moodScale.dragMove(local);
			this.continueButton.display();
		}

		MoodLoader.prototype.dragEnd = function(local) {
			this.moodScale.dragEnd(local);
			this.value = this.moodScale.value;
			this.continueButton.display();
		}

		MoodLoader.prototype.stimulusText = function() {
			// create the extras text here
			return "Index " + this.index + ", Value " + this.value;
		}

		MoodLoader.prototype.createContinueButton = function() {
			var r = this.moodScale.bounds();

			var ctr = r.center();
			var cr = continueButtonRect();
			this.continueButton = new KeyButton(continue_button, ctr.x - cr.w/2.0, r.b() + this.moodScale.textSlops, cr.w, cr.h, "", 0, false);
			this.continueButton.bgColor = moodBackgroundColor;
		}

		MoodLoader.prototype.drawContinueButton = function(show) {
			if (show) {
				this.continueButton.display();
			}
			else {
				this.continueButton.hide();
				this.continueButton = "";
			}
		}

		MoodLoader.prototype.hitOnContinue = function(local) {
			if (this.continue != "" && this.continueButton.containsPoint(local)) {
				return true;
			}
			return false;
		}

		MoodLoader.prototype.continueButtonHit = function() {

			// record their responses into this.value
			this.value = this.moodScale.value;
			endMoodMouseListening();
			this.drawContinueButton(false);

			paintPartialBackground(0, 0, canvas.width, canvas.height, moodBackgroundColor);

			// record this response with the index as the rt (so is "analysed")
			recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.tp, this.index, lastKey, moodLoader.stimulusText());

			stage = Stages.EndTask;
		}

		MoodLoader.prototype.analysis = function(taskCode) {
			// create an array of current responses
			var array = responses.extractArray("task", taskCode);
			var summaryXML = array.resultsSummary(codes);

			// record this in responses
			recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.results, 0, 0, summaryXML);
		}


	}

	function Wheel(left, top, radius) {	// gambling wheel sprite
		this.x = left;
		this.y = top;
		this.radius = radius;
		this.rect = new Rect(0, 0, radius * 2, radius * 2); // width and height should be equal

		this.textObject = new TextObject("non", 0, 0, 26);

		this.gainProbability = 0;
		this.gain = 0;
		this.loss = 0;

		this.startAngle = 0; // in degrees
		this.endAngle = 0;

		this.covered = true;
		this.needsDisplay = true;
		this.drawTarget = false;		// for DEBUGGING

		this.spinning = false;
		this.rotation = 0; // in degrees (0-360)
		this.increment = 30;
		this.percent = 0;
		this.willGain = false;
		this.boundaryProbability = 0.3; // close to boundary 30% of time
		this.distanceToBoundary = 0; // worked out randomly
		this.closeAngleMax = 3;
		this.degreesOfSeparation = 20;
		this.minRotations = 3;
		this.maxRotations = 10; // determines how long it will take maximally
		this.targetAngle = 0;	// degrees
		this.degreesToSpin = 0;
		this.degreesSpun = 0;

		this.off_canvas = document.createElement('canvas');
		this.off_canvas.width = 100;
		this.off_canvas.height = 100;
		this.off_ctx = this.off_canvas.getContext('2d');

		Wheel.prototype.calculations = function() {
			// choose equivalent arc randomly located
			var diffAngle = Math.floor(360 * this.gainProbability);
			this.startAngle = Math.floor(Math.random() * 360);
			this.endAngle = this.startAngle + diffAngle;

			// work out total degrees to spin to reach our target angle
			// is it to be close to boundary or not (> 20 degrees away)?
			this.targetAngle = 0;
			if (Math.random() < this.boundaryProbability) {
				// should be close
				var atStart = (Math.random() < 0.5) ? true : false;
				var isLess = (Math.random() < 0.5) ? -1 : 1;
				this.distanceToBoundary = 1 + Math.floor(Math.random() * this.closeAngleMax);
				this.targetAngle = this.distanceToBoundary * isLess + (atStart ? this.startAngle : this.endAngle);

				this.willGain = (atStart && isLess > 0) || (!atStart && isLess < 0);
			}
			else {
				// must be > degreesOfSeparation from any boundary
				// we must work on the smaller probability (or could cross into the same loss or gain area (ie if > 182 degrees).
				this.willGain = (Math.floor(Math.random() * 2) == 0) ? true : false;
				var additive = 0;
				var startThreshold = this.startAngle + this.degreesOfSeparation;
				var endThreshold = this.endAngle - this.degreesOfSeparation;
				if (this.gainProbability <= 0.5) {
					// use the gain sector
					additive = (this.willGain ? 0 : 180);
				}
				else {
					// use the loss sector
					var startThreshold = this.endAngle + this.degreesOfSeparation;
					var endThreshold = startThreshold + (360 - 2 * this.degreesOfSeparation - (this.endAngle - this.startAngle));
					additive = (this.willGain ? 180 : 0);
				}
				if (endThreshold - startThreshold < 0) {
					printToConsole("Negative threshold condition detected.");
					// we need to pick halfway between these
					this.targetAngle = Math.floor((startThreshold + endThreshold)/2);
				}
				else {
					this.targetAngle = startThreshold + (Math.floor(Math.random() * Math.abs(endThreshold - startThreshold)));
				}
				// can be within or without loss area
				this.targetAngle += additive;

				this.distanceToBoundary = Math.min(Math.abs(this.targetAngle - startThreshold), Math.abs(this.targetAngle - endThreshold));

//				printToConsole("NOT CLOSE ONE follows");
			}
			this.targetAngle %= 360;

//			printToConsole("wheel calcs: " + this.startAngle + " " + this.endAngle + ", " + this.targetAngle + ", " + this.gainProbability + ", willGain " + this.willGain + ", " + this.gain + " " + this.loss + ", dbd " + this.distanceToBoundary);
		}

		Wheel.prototype.setGains = function(probability, gain, loss) {
			this.gainProbability = probability;
			this.gain = gain;
			this.loss = loss;
			this.rotation = 0;

			this.calculations();
		}

		Wheel.setRadius = function(length) {
			this.radius = length;
			this.rect.width = length * 2;
			this.rect.height = length * 2;
		}

		Wheel.prototype.pointInRect = function(x, y, feather) {
			var r = new Rect(this.rect.l + this.x, this.rect.t + this.y, this.rect.w, this.rect.h);
			return (x >= r.l-feather && x <= r.r()+feather && y >= r.t-feather && y <= r.b()+feather);
		}

		Wheel.prototype.hitOnWheel = function(local) {
			// return true if local is in this wheel
			var correct = this.pointInRect(local.x, local.y, 0);
//			var r = new Rect(this.rect.l + this.x, this.rect.t + this.y, this.rect.w, this.rect.h);
//			printToConsole("Hit: " + (correct ? "yes" : "no") + " with x " + local.x + ", y " + local.y + ", rect " + r.string());

//			if (correct) {
//				printToConsole("Hit: " + this.startAngle + " " + this.endAngle + ", " + this.targetAngle + ", willGain " + this.willGain + ", " + this.gain + " " + this.loss);
//			}

			return correct;
		}

		Wheel.prototype.drawDollars = function(context, txt, color, startAngle, endAngle, outside) {
			var angle = (startAngle + endAngle)/2;
			if (outside) angle = (angle + 180) % 360;
			var rads = deg2Rad(angle);
			var ctr = this.rect.center();
			var x = ctr.x + Math.cos(rads) * this.radius/2.0; // center of text x
			var y = ctr.y + Math.sin(rads) * this.radius/2.0; // center of text y

			if (!this.rotateText) {
				angle = 0; // comment out to rotate along radius
			}
			this.textObject.midx = x;
			this.textObject.midy = y;
			this.textObject.text = txt;
			this.textObject.context = context;
			this.textObject.angle = angle;
			this.textObject.display();
		}

		Wheel.prototype.drawCircleArc = function(context, rect, fillColor, lineWidth, lineColor, startAngle, endAngle) {
			var startRads = deg2Rad(startAngle);
			var endRads = deg2Rad(endAngle);

			context.save();

			context.beginPath();
			context.arc(rect.center().x, rect.center().y, rect.w/2, startRads, endRads);
			context.fillStyle = fillColor;
			context.fill();
			context.lineWidth = lineWidth;
			context.strokeStyle = lineColor;
			context.stroke();

			context.restore();
		}

		Wheel.prototype.drawArcPath = function(context, rect, fillColor, lineWidth, lineColor, startAngle, endAngle, opacity) {
			var startRads = deg2Rad(startAngle);
			var endRads = deg2Rad(endAngle);

			var ctr = new Point(rect.center().x, rect.center().y);
			var rad = rect.w/2;

			context.save();

			context.globlalAlpha = opacity;
			context.beginPath();
			context.moveTo(ctr.x, ctr.y); // centre
			context.arc(ctr.x, ctr.y, rad, startRads, endRads);
			context.lineTo(ctr.x, ctr.y); // line to centre
			context.fillStyle = fillColor;
			context.fill();

			context.lineWidth = lineWidth;
			context.strokeStyle = lineColor;
			context.stroke();

			context.restore();
		}

		Wheel.prototype.drawPointer = function(context) {
			var down = 20;
			var pt = new Point(this.x + this.rect.center().x,
								this.y + down);
			context.save();
			context.beginPath();
			context.moveTo(pt.x, pt.y);
			context.lineTo(pt.x - down/4, pt.y - down);
			context.lineTo(pt.x + down/4, pt.y - down);
			context.lineTo(pt.x, pt.y);
			context.fillStyle = "black";
			context.fill();
			context.restore();
		}

		Wheel.prototype.drawTargetAngle = function(context) {
			// for debugging only (shows the answer!)
			var st = this.targetAngle - 1;
			var en = this.targetAngle + 1;
			this.drawArcPath(context, this.rect, "blue", 1, '#003300', st, en, 0.1);
		}

		Wheel.prototype.render = function() {
			if (!this.spinning) {

				// set canvas size
				this.off_canvas.width = this.rect.w;
				this.off_canvas.height = this.rect.h;

				// clear prior drawing
				this.off_ctx.fillStyle = gamblingBackgroundColor;
				this.off_ctx.fillRect(this.rect.l, this.rect.t, this.rect.w, this.rect.h);

				if (this.covered) {
					var steps = 360/this.degreesOfSeparation;
					for (var i = 0; i < steps; i++) {
						var st = i * this.degreesOfSeparation;
						var en = (i+1) * this.degreesOfSeparation;
						var col = i % 2 == 0 ? "yellow" : "blue";
						this.drawArcPath(this.off_ctx, this.rect, col, 1, '#003300', st, en, 1.0);
					}
				}
				else {
					// draw wheel
					this.drawCircleArc(this.off_ctx, this.rect, "red", 2, '#003300', 0, 360);

					// draw filled arc
					this.drawArcPath(this.off_ctx, this.rect, "lime", 1, '#003300', this.startAngle, this.endAngle, 1.0);

					// draw potential gain and losses
					this.drawDollars(this.off_ctx, " " + this.gain, "white", this.startAngle, this.endAngle, false);
					this.drawDollars(this.off_ctx, "- " + this.loss, "white", this.startAngle, this.endAngle, true);

					if (this.drawTarget) {
						// draw where the targetAngle is for debugging
						this.drawTargetAngle(this.off_ctx);
					}
				}
				// draw central circle
				var d = 10;
				var r  = new Rect(this.rect.center().x - d/2, this.rect.center().y - d/2, d, d);
				this.drawCircleArc(this.off_ctx, r, "brown", 1, '#003300', 0, 360);
			}
		}

		Wheel.prototype.display = function() {
			this.render();

			ctx.save();
			var ctr = this.rect.center();
			ctx.translate(this.x + ctr.x, this.y + ctr.y);
			ctx.rotate(deg2Rad(this.rotation));

			ctx.drawImage(this.off_canvas, 0, 0, this.rect.w, this.rect.h, -this.rect.w/2, -this.rect.h/2, this.rect.w, this.rect.h);

			ctx.restore();

			if (!this.covered) {
				this.drawPointer(ctx);
			}

			this.needsDisplay = false;
		}

		Wheel.prototype.endSpin = function() {
			this.spinning = false;
			this.endSpinSound();
			stage = Stages.EndFeedback;
		}

 		Wheel.prototype.spin = function() {
			if (!this.spinning) return;

			var increment = this.increment;
			this.percent = 100.0 * this.degreesSpun/this.degreesToSpin;

			if (this.percent < 5) { // accelerates
				// speeding up to fastest speed
				increment *= 0.1 + Math.sin((Math.PI * 0.5) * this.percent/5.0);
			}
			else if (this.percent <= 80) {
				// fastest speed is this.increment
			}
			else if (this.percent <= 100) {
				// slowing down
				var per = (100 - this.percent)/20.0;
				increment *= Math.sin((Math.PI * 0.5) * per);
			}
			if (this.percent > 80 && increment < 0.001) {
				this.endSpin();
				return;
			}

			this.degreesSpun += increment;
			this.rotation = (this.rotation + increment) % 360;
			this.display();
 		}

 		Wheel.prototype.startSpin = function() {
//			bufferLoader.play(xxxSound, 0); // change to spinning sound!

			var rotations = this.minRotations + Math.floor(Math.random() *  (this.maxRotations - this.minRotations + 1));
			this.degreesToSpin = rotations * 360 + (270 - this.targetAngle); // to align with top
			this.degreesSpun = 0;

			this.rotation = 0;
			this.percent = 0;
			this.spinning = true;
 		}

 		Wheel.prototype.cover = function() {
 			// could make this animated
 			this.covered = true;
 			this.needsDisplay = true;
 			this.display();
 		}

		Wheel.prototype.uncover = function() {
			this.covered = false;
 			this.needsDisplay = true;
			this.display();
		}

		Wheel.prototype.endSpinSound = function() {
			// choose random variant
			var snds = [];
			if (this.willGain) {
				if (this.distanceToBoundary < this.degreesOfSeparation) {
					snds = [applauseSound];
				}
				else {
					snds = [clapsSound];
				}
			}
			else {
				if (this.distanceToBoundary < this.degreesOfSeparation) {
					snds = [gahSound];
				}
				else {
					snds = [ohSound];
				}
			}
			var index = snds[Math.floor(Math.random() * snds.length)];

//			printToConsole("Selected sound: " + index + ", snds " + snds.toString());
			bufferLoader.play(index, 0);
		}

 		Wheel.prototype.stimulusText = function() {
 			return "Start " + this.startAngle + ", End " + this.endAngle + ", degreesToBorder " + this.distanceToBoundary + ", targetAngle " + this.targetAngle + ", prob " + this.gainProbability + ", gain " + this.gain + ", loss " + this.loss + ", score " + (this.willGain ? this.gain : -this.loss);
 		}
	}

	function WheelConfig(prob, gain, loss) {
		this.prob = prob; // probability of a loss
		this.gain = gain;
		this.loss = loss;

		WheelConfig.prototype.entry = function() {
			var arr = [];
			arr.push(this.prob);
			arr.push(this.gain);
			arr.push(this.loss);
			return arr;
		}
	}

	function WheelLoader(task) { // gambling wheel configuration
		this.name = task.brief;
		this.trials = task.trials;
		this.minProbability = task.minProbability;
		this.maxProbability = task.maxProbability;
		this.minReward = task.minReward;
		this.maxReward = task.maxReward;
		this.rewardUnit = 5;

		this.totalPoints = 0; // total amount of points

		this.currentWheel = 0;

		this.textObject = new TextObject("non", canvas.width/2.0, slops, 26);

		this.leftConfigs = [];
		this.rightConfigs = [];

		WheelLoader.prototype.createConfigs = function() {
			// randomly choose probability, gain and loss randomly
			for (var i = 0; i < this.trials; i++) {
				// left wheel values
				var prob = this.minProbability + (Math.random() * (this.maxProbability - this.minProbability));
				var gain = this.minReward + this.rewardUnit * Math.ceil(Math.random() * (this.maxReward - this.minReward)/this.rewardUnit);
				var loss = this.minReward + this.rewardUnit * Math.ceil(Math.random() * (this.maxReward - this.minReward)/this.rewardUnit);
				var cfg = new WheelConfig(prob, gain, loss);
				this.leftConfigs.push(cfg);

				// right wheel values
				prob = this.minProbability + (Math.random() * (this.maxProbability - this.minProbability));
				gain = this.minReward + this.rewardUnit * Math.ceil(Math.random() * (this.maxReward - this.minReward)/this.rewardUnit);
				loss = this.minReward + this.rewardUnit * Math.ceil(Math.random() * (this.maxReward - this.minReward)/this.rewardUnit);
				cfg = new WheelConfig(prob, gain, loss);
				this.rightConfigs.push(cfg);
			}
		}

		WheelLoader.prototype.load = function() {
			// old way at random
//			this.createConfigs();

			// read in today's configurations (left & right wheels)
			// these are stored in $(#stimuli).html as a json array string
			var configs = JSON.parse($("#gambs").html());

			// load these into left and right configs arrays
			for (var i = 0; i < this.trials; i++) {
				var cfg = configs[i][0]; // [<prob>, <gain>, <loss>]
				var c = new WheelConfig(cfg[0], cfg[1], cfg[2]);
				this.leftConfigs.push(c);

				cfg = configs[i][1]; // [<prob>, <gain>, <loss>]
				c = new WheelConfig(cfg[0], cfg[1], cfg[2]);
				this.rightConfigs.push(c);
			}

			this.loaded = true;
		}

		WheelLoader.prototype.configuration = function(trial, left) {
			if (!this.loaded) return false;

			// return this trial's array from this.stimuli array
			if (left) {
				return this.leftConfigs[trial];
			}
			return this.rightConfigs[trial];
		}

		WheelLoader.prototype.tally = function() {
			var profit = 0;
			if (this.currentWheel.willGain) {
				profit = this.currentWheel.gain;
			}
			else {
				profit = -1 * this.currentWheel.loss;
			}
			this.totalPoints += profit;
//			printToConsole("Total points: " + this.totalPoints + ", profit: " + profit);
		}

		WheelLoader.prototype.analysis = function(taskCode) {
			// create an array of current responses
			var array = responses.extractArray("task", taskCode);
			var summaryXML = array.resultsSummary(codes);

			// record this in responses
			recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.results, 0, 0, summaryXML);
		}

		WheelLoader.prototype.display = function() {
			var txt = "Current Winnings: " + this.totalPoints;
			this.textObject.text = txt;
			this.textObject.display();
		}

 		WheelLoader.prototype.stimulusText = function() {
 			return "Trials " + this.trials + ", minProb " + this.minProbability + ", maxProb " + this.maxProbability + ", minReward " + this.minReward + ", maxReward " + this.maxReward + ", total " + this.totalPoints;
 		}

		WheelLoader.prototype.endTask = function() {
			resultsArray.push(this.name + ": " + this.totalPoints);

			recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.final, 0, 0, this.stimulusText);

			// clear up some memory
			this.leftConfigs = [];
			this.rightConfigs = [];
		}
	}

	function TargetLoader(task) { // target loading function
		this.name = task.brief;
		this.dayTrials = ""; // this is where they will go
		this.loaded = false;
		this.fontSize = taskTextFontSize;
		this.gridCellSize = this.fontSize * 2.5/0.7; // by Chun is 2.5 degrees and fontSize is worked out at 0.7 degrees

		TargetLoader.prototype.load = function() {
			this.calculateFontSize();

			// load today's trials into this object for trial use
			// these are stored in $(#stimuli).html as a json array string
			this.dayTrials = JSON.parse($("#targets").html());
			printToConsole("Trials loaded: " + this.dayTrials.length);

			this.loaded = true;
		}

		TargetLoader.prototype.configuration = function(trial) {
			if (!this.loaded) return false;

			// return this trial's array from this.stimuli array
			return this.dayTrials[trial];
		}

		TargetLoader.prototype.calculateFontSize = function() {

			// needs to calculate ideal font size based on size of canvas and viewing angle (0.7 degrees)
			var dpi = screen_dpi(); // attempts to work it out!
			if (dpi == 0) dpi = 132; // use the iPad2 default

			var pixelsPerMM = dpi/25.0; // iPad2 pixels per mm (132 pixels/inch specs)
			var stimVisAngleDegrees = 0.7; // 0.7 degrees (original Chun size)
			var stimVisAngleRadians = deg2Rad(stimVisAngleDegrees);

			// if we assume distance is 40cm (comfortable viewing distance)
			var viewingDistanceMM = 400.0;
			var stimSizeMM = 2 * viewingDistanceMM * Math.sin(stimVisAngleRadians/2.0);

			// values: Stim size: 4.886982692687727 mm, 25.8032686173912 px = 13.85 pts (say 14)
			// note: 2.4434913463438637 mm = 6.926432163 points
			var stimSizePx = stimSizeMM * pixelsPerMM;
			var stimSizePts = stimSizeMM * 6.926432163/2.4434913463438637;

			this.fontSize = Math.ceil(stimSizePts);
			this.gridCellSize = stimSizePx * 2.5/0.7; // Chun's original

			// and by testing we know to scale the font up (14 pt for a T and L should be 5mm).
			this.fontSize = this.fontSize * 5.0/3.0; // don't change gridCellSize

			printToConsole("DPI: " + dpi);
			printToConsole("Screen: " + screen.width + "x" + screen.height);
			printToConsole("stimSizeMM: " + stimSizeMM);
			printToConsole("Font size: " + this.fontSize);
			printToConsole("Grid size: " + this.gridCellSize);
		}

		TargetLoader.prototype.analysis = function(taskCode) {
			// create an array of current responses
			var array = responses.extractArray("task", taskCode);
			var summaryXML = array.resultsTargetSummary(codes);

			var parser = new DOMParser();
  			var xmlDoc = parser.parseFromString(summaryXML,"text/xml");
			var hitrate = xmlDoc.getElementsByTagName("hitrate")[0].childNodes[0].nodeValue;
			resultsArray.push(this.name + ": " + (100*hitrate) + "%");

			// record this in responses
			recordResponse(taskOrder[currentTask].code, experimentTimer.elapsed(), codes.results, 0, 0, summaryXML);
		}

		TargetLoader.prototype.endTask = function() {
			// clear up some memory
			this.dayTrials = [];
		}
	}

	function Target(task, gridCellSize, fontSize) { // task is compatible with target object
		this.probes = task.probes; // default: 1
		this.foils = task.foils; // default: 11
		this.probe = task.probe; // default: T
		this.foil = task.foil; // default: L
		this.dimX = task.dimX; // default: 8
		this.dimY = task.dimY; // default: 6
		this.feather = task.feather; // default: 10 pixels
		this.fontSize = fontSize; // calculated from TargetLoader
		this.gridCellSize = gridCellSize; // calculated from TargetLoader

		// centre the grid by adjusting the target grid min x and y
		this.targetGridMinX = canvas.width/2 - this.gridCellSize * this.dimX/2;
		this.targetGridMinY = canvas.height/2 - this.gridCellSize * this.dimY/2;

//		printToConsole("Target: gridCellSize " + gridCellSize + ", fontSize " + fontSize);

		this.trialType = "0"; // A, B1, B2, C, D, E
		this.trialIndex = 0; // 0-max configurations for this type

		this.gridArray = [];
//		this.gridPositions = [];
//		this.gridPositions.integerFill(this.dimX * this.dimY);

		// set this function for maxOuts
		task.animateFeedbackStart = this.startFeedback;
		task.stimulusText = this.responseText;

		Target.prototype.stimuliFromConfiguration = function(configArray) {

			printToConsole("configArray: " + JSON.stringify(configArray));

			// use the configuration to create the stimuli
			this.trialType = configArray["type"];
			this.trialIndex = configArray["index"];
			var stimuli = configArray["stimuli"]; // {<gridCell>,<jitter>,<angle>}

			for (var i = 0; i < stimuli.length; i++) {
				var ltr = (i == 0 ? this.probe : this.foil);
				var triad = stimuli[i];

				var idx = triad[0]; // see above
				var col = idx % this.dimX; // 0-based grid column
				var row = Math.floor(idx/this.dimX); // 0-based grid row

				var x = triad[1] + this.targetGridMinX + (col * this.gridCellSize) + Math.floor(this.gridCellSize/2);
				var y = triad[1] + this.targetGridMinY + (row * this.gridCellSize) + Math.floor(this.gridCellSize/2);
				var txt = new StimulusTextObject(ltr, x, y, this.fontSize);
				txt.angle = triad[2];
				this.gridArray.push(txt);
			}

			// how to create random ones on the fly
			// randomize grid positions, and use first as target
// 			this.gridPositions.randomize();
// 			for (var i = 0; i <= this.probes + this.foils; i++) {
// 				var ltr = (i == 0 ? this.probe : this.foil);
// 				var idx = this.gridPositions[i];
// 				var col = idx % this.dimX; // 0-based grid column
// 				var row = Math.floor(idx/this.dimX); // 0-based grid row
// 				var dim = (canvas.width - 2 * this.targetGridMinX)/this.dimX;
// 				var sign = (Math.floor(Math.random() * 2)) ? -1 : 1;
// 				var jit = Math.floor(Math.random() * (this.jitter + 1));
// 				var x = sign * jit + this.targetGridMinX + (col * dim) + Math.floor(dim/2);
// 				var y = sign * jit + this.targetGridMinY + (row * dim) + Math.floor(dim/2);
// 				var txt = new StimulusTextObject(ltr, x, y, this.fontSize);
// 				txt.angle = Math.floor(Math.random() * 5) * 90;
// 				this.gridArray.push(txt);
// 			}
		}

		Target.prototype.showScene = function() {
			for (var i = 0; i < this.gridArray.length; i++) {
				var txt = this.gridArray[i];
				txt.display();
			}
		}

		Target.prototype.hitOnTarget = function(local) {
			// return the target letter that was hit or false if missed letters
			for (var i = 0; i < this.gridArray.length; i++) {
				var txt = this.gridArray[i];
				if (txt.pointInRect(local.x, local.y, this.feather)) {
					txt.pressed = true;
					return txt;
				}
			}
			return false;
		}

		Target.prototype.responseText = function() {
			// we just need the type and index (code tells us if correct and hence is probe or foil letter)
			return this.trialType + "_" + this.trialIndex;
		}

		Target.prototype.startFeedback = function() {
			// change target color (yellow correct, red error)
			for (var i = 0; i < this.gridArray.length; i++) {
				var txt = this.gridArray[i];
				if (txt.pressed) {
					txt.color = (txt.text == this.probe) ? "Yellow" : "Red";
					txt.fontSize = 3 * txt.fontSize;
					txt.display();
					stage = Stages.Feedback;
					return txt;
				}
			}
		}

		Target.prototype.feedback = function() {
			// fade targets
			var lastOpacity = 100;
			paintBackground(targetBackgroundColor);
			for (var i = 0; i < this.gridArray.length; i++) {
				var txt = this.gridArray[i];
				txt.opacityChange(txt.decrement);
				lastOpacity = txt.opacity;
			}
			if (lastOpacity <= 0) {
				stage = Stages.EndFeedback;
			}
		}

		Target.prototype.endTask = function() {
			// clear up some memory
			this.gridArray = [];
		}
	}

	function StimulusTextObject(text, midx, midy, fontSize) { // centred
		this.text = text;
		this.midx = midx;
		this.midy = midy;
		this.fontSize = fontSize;
		this.color = "White"; // default is white text
		this.pressed = false;
		this.angle = 0;
		this.opacity = 100; // 0-100
		this.decrement = -10;
		this.bounds = {l: 0, r: 0, t:0, b:0, w:0, h:0};

		StimulusTextObject.prototype.display = function() {
			// draw the text
			if (this.text != "" && this.opacity > 0) {
				ctx.font = this.fontSize + trainingTextFont;
				var textWidth = ctx.measureText(this.text).width;
				var r = this.rect();

				ctx.save();
				ctx.fillStyle = this.color;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.globalAlpha = this.opacity/100;
				ctx.translate(this.midx, this.midy);
				ctx.rotate(deg2Rad(this.angle));
				ctx.fillText(this.text, 0, 0);
//				ctx.fillStyle = "Red";
//				ctx.fillRect(-r.w/2, -r.h/2, r.w, r.h);
				ctx.restore();
			}
			this.needsDisplay = false;
		}

		StimulusTextObject.prototype.rect = function() {
			var textWidth = ctx.measureText(this.text).width;
			var left = this.midx - textWidth/2;
			var top = this.midy - this.fontSize/2;
			var width = textWidth;
			var height = this.fontSize;

			return new Rect(left, top, width, height);
		}

		StimulusTextObject.prototype.pointInRect = function(x, y, feather) {
			var r = this.rect();
			return (x >= r.l-feather && x <= r.r()+feather && y >= r.t-feather && y <= r.b()+feather);
		}

		StimulusTextObject.prototype.opacityChange = function(value) {
			this.opacity += value;
			this.display();
		}
	}

	// TEXT OBJECTS
	function TextObject(text, midx, midy, fontSize) { // centred
		this.text = text;
		this.midx = midx;
		this.midy = midy;
		this.color = "white";
		this.fontSize = fontSize;
		this.font = "px bold Helvetica";
		this.withShadow = true;
		this.shadowOffset = 1;
		this.shadowOpacity = 0.5;
		this.angle = 0;
		this.context = ctx; // can be changed
		this.debugging = false;
		this.needsDisplay = false;

		TextObject.prototype.bounds = function() {
			var textWidth = this.context.measureText(this.text).width;
			return new Rect(this.midx - textWidth/2.0, this.midy - this.fontSize/2.0, textWidth, this.fontSize);
		}

		TextObject.prototype.drawText = function(context, text, x, y, color, angle, opacity, fontSize, font) {
			context.save();

			context.font = fontSize + font;
			context.textAlign = "center";
			context.textBaseline = "middle";
			context.fillStyle = color;
			context.globalAlpha = opacity;
			context.translate(x, y);
			context.rotate(deg2Rad(angle));
			context.fillText(text, 0, 0);

			context.restore();
		}

		TextObject.prototype.clear = function(color) {
			if (this.text != "") {
				// clear text area
				var textWidth = 2 * this.context.measureText(this.text).width;
				var textHeight = this.fontSize;

				this.context.save();
				this.context.fillStyle = color;
				this.context.fillRect(this.midx - textWidth/2.0, this.midy - textHeight/2.0, textWidth, textHeight);
				this.context.restore();
			}
		}

		TextObject.prototype.display = function() {
			if (this.debugging) {
				// debugging - draw bounds in yellow
				this.context.save();
				var r = this.bounds();
				this.context.strokeStyle = "yellow";
				this.context.lineWidth = 1;
				this.context.strokeRect(r.l, r.t, r.w, r.h);
				this.context.restore();
			}

			// draw the text
			if (this.text != "") {
				if (this.withShadow) {
					this.drawText(this.context, this.text, this.midx + this.shadowOffset, this.midy + this.shadowOffset, "black", this.angle, this.shadowOpacity, this.fontSize, this.font);
				}

				// draw text
				this.drawText(this.context, this.text, this.midx, this.midy, this.color, this.angle, 1.0, this.fontSize, this.font);
			}
			this.needsDisplay = false;
		}
	}

	// KEYBOARD OBJECT
	function KeyButton(serial, x, y, width, height, text, fontSize, useBgColor) {
		this.serial = serial;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.text = text;
		this.fontSize = fontSize; // for text
		this.bgColor = tableColor;
		this.useBgColor = useBgColor;
		this.pressed = false;
		this.needsDisplay = false;

		// prototype methods
		KeyButton.prototype.display = function() { // use 0 for width & height for default size
			var i = this.serial;
			if (this.pressed) i += 1;
			if (document.images) {
				if (this.width > 0 && this.height > 0) {
					if (this.useBgColor) {
						paintPartialBackground(this.x, this.y, this.width, this.height, this.bgColor);
					}
					ctx.drawImage(document.images[i], this.x, this.y, this.width, this.height);
				}
				else {
					ctx.drawImage(document.images[i], this.x, this.y);
				}
				// draw the text below the button
				if (this.text != "") {
					ctx.font = fontSize + trainingTextFont;
					var textWidth = ctx.measureText(this.text).width;
					var color = this.pressed ? "Red" : "White";

					paintText(this.text, this.x + this.width/2.0 - textWidth/2.0 - 20, this.y + this.height + fontSize, this.fontSize, color);
				}
			}
			this.needsDisplay = false;
		}

		KeyButton.prototype.bounds = function() {
			return new Rect(this.x, this.y, this.width, this.height);
		}

		// x and y are in local canvas coordinates
		KeyButton.prototype.containsPoint = function(canvaslocal) {
			if (canvaslocal === undefined) return false;
			return hitTest(canvaslocal, this.x, this.y, this.width, this.height);
		}

		KeyButton.prototype.hide = function() {
			paintPartialBackground(this.x, this.y, this.width, this.height, tableColor);
		}
	}

	// RESPONSE OBJECT
	function Response(taskCode, elapsed, code, rt, key, extras) {
		this.task = taskCode;
		this.elap = elapsed;
		this.code = code;
		this.rtme = rt;
		this.key = key;
		this.extras = extras; // can be an object

		Response.prototype.toString = function() {
			return "task " + this.task + ", elap " + this.elap + ", code " + this.code + ", rtme " + this.rtme + ", key " + this.key + ", extras " + extras;
		}

		Response.prototype.toXmlFormat = function() {
			var str = "<response>";
			for (var name in this) {
				if ($.isFunction(this[name])) {
					// ignore
				}
				else if (name == 'extras' && $.isPlainObject(this[name])) {
					// summary field
					str += this[name].toXmlFormat();
				}
				else {
					str += "<" + name.toLowerCase() + ">" + this[name] + "</" + name.toLowerCase() + ">";
				}
			}
			str += "</response>"
			return str;
		}
	}

	// ENUM OBJECT
	// enums can be stored in an Enum object
	// declare them as var YesNo = new Enum(['No', 'Yes']);
	// call as YesNo.Yes, or YesNo.No (for values of 1 & 0 resply)

	function Enum(constantsList) {
		this.allValues = constantsList;
		for (var i in constantsList) {
			this[constantsList[i]] = i; // create a map
		}

		Enum.prototype.length = function() {
			return this.allValues.length;
		}

		Enum.prototype.validIndex = function(index) {
			if (index >= 0 && index < this.length()) {
				return true;
			}
			return false;
		}

		Enum.prototype.text = function(index) {
			if (this.validIndex(index)) {
				return this.allValues[index];
			}
			return '?';
		}
	}

	// TIMER OBJECT
	// Starts, stops, pauses, resumes, elapsed time (millisecs)
	function Timer() {
		this.started = false;
		this.paused = false;
		this.startTime = 0;
		this.stopTime = 0;

		Timer.prototype.start = function() {
			var now = new Date();
			this.startTime = now.getTime();
			this.started = true;
			this.stopTime = 0;
		}

		Timer.prototype.elapsed = function() {
			if (!this.started) {
				return 0;
			}
			var now = new Date();
			return now.getTime() - this.startTime;
		}

		Timer.prototype.stop = function() {
			this.stopTime = this.elapsed();
			this.started = false;
		}

		Timer.prototype.pause = function() {
			if (this.paused) return;

			var now = new Date();
			this.pauseTime = now.getTime();
			this.paused = true;
		}

		Timer.prototype.resume = function() {
			if (!this.paused) return;

			var now = new Date();
			this.startTime += now.getTime() - this.pauseTime;
			this.paused = false;
			this.pauseTime = 0;
		}
	}

	// FIRER OBJECT
	// calls a function when countDownMS milliseconds expires
	function Firer() {
		this.timerIsOn = false;
		this.result = 0;

		Firer.prototype.start = function(callback, ms) {
			this.stop();
			this.result = setTimeout(callback, ms);
			this.timerIsOn = true;
		}

		Firer.prototype.stop = function() {
			if (this.timerIsOn) {
				clearTimeout(this.result);
				this.timerIsOn = false;
			}
		}
	}

}


