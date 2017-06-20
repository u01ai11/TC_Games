"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_version = '0.0.1';

// continue button
var imgContinue = new Image(205, 61);
imgContinue.src = pathPrefix + "/targ/imgs/Continue_button.png";

var Timer = function () {
    function Timer() {
        _classCallCheck(this, Timer);

        this.started = false;
        this.paused = false;
        this.startTime = 0;
        this.stopTime = 0;
        this.currentStep = -1;
    }

    Timer.prototype.start = function start() {
        var now = new Date();
        this.startTime = now.getTime();
        this.started = true;
        this.stopTime = 0;
    };

    Timer.prototype.elapsed = function elapsed() {
        if (!this.started) {
            return 0;
        }
        var now = new Date();
        return now.getTime() - this.startTime;
    };

    Timer.prototype.stop = function stop() {
        this.stopTime = this.elapsed();
        this.started = false;
    };

    Timer.prototype.pause = function pause() {
        if (this.paused) return;
        var now = new Date();
        this.pauseTime = now.getTime();
        this.paused = true;
    };

    Timer.prototype.resume = function resume() {
        if (!this.paused) return;
        var now = new Date();
        this.startTime += now.getTime() - this.pauseTime;
        this.paused = false;
        this.pauseTime = 0;
    };

    return Timer;
}();

var TARG = function () {
    function TARG(targConfig, day) {
        _classCallCheck(this, TARG);

        this.canvas = document.getElementById("thirdpartyCanvas");
        this.canvas.setAttribute('style', "background: black");

        // Design for 1024 * 768

        this.canvas.width = 1024 - 7;
        this.canvas.height = window.innerHeight > 768 ? 768 - 7 : window.innerHeight - 7;

        this.ctx = this.canvas.getContext("2d");
        this.offset = $('#thirdpartyCanvas').offset();

        this.dimX = 8;
        this.dimY = 6;
        this.feather = 10; // default: 10 pixels
        this.fontSize = 24;
        this.gridCellSize = 65;
        this.targetGridMinX = 250;
        this.targetGridMinY = 180;
        this.allResponses = [];

        // init timer
        this.timer = new Timer();
        this.timerTrial = new Timer();

        this.sound = new Audio(pathPrefix + "/targ/sounds/keyclick.mp3");

        this.todayConfig = targConfig[day];

        // variable for each trial
        this.phase = 'welcome';
        this.numOfTrials = 60; // total number of trials
        this.numOfSuccess = 0; // total number of success
        this.trialIndex = 0; // current trial index
        this.trialType = null; // the trial type 'A', 'B1', 'C', 'D', 'E'
        this.gridArray = []; // an array to keep current L or T location

        // variables for rating
        this.feelingXaxis = 512;
        this.doRating = false;
        this.feelingString = '+0';

        // the continue button
        this.continueBtn = {
            image: imgContinue,
            x: 409.5,
            y: 500,
            width: 205,
            height: 61
        };
    }

    TARG.prototype.start = function start() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw a rect background with round corner
        this.ctx.beginPath();
        this.ctx.moveTo(60, 40);
        this.ctx.lineTo(964, 40);
        this.ctx.quadraticCurveTo(984, 40, 984, 60);
        this.ctx.lineTo(984, 600);
        this.ctx.quadraticCurveTo(984, 620, 964, 620);
        this.ctx.lineTo(60, 620);
        this.ctx.quadraticCurveTo(40, 620, 40, 600);
        this.ctx.lineTo(40, 60);
        this.ctx.quadraticCurveTo(40, 40, 60, 40);
        this.ctx.fillStyle = "#064d00";
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.stroke();

        // The instruction text
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = "24px Georgia";
        this.ctx.textAlign = "left";
        this.ctx.fillText('Whack-A-T', 60, 110);
        this.ctx.font = "22px Georgia";
        this.ctx.fillText('Target Task', 60, 180);
        this.ctx.fillText('Tap on the T shape among the L shapes. ', 60, 215);
        this.ctx.fillText('Be as quick as possible without making mistake...', 60, 250);

        // Draw continue button on the first page
        this.ctx.drawImage(this.continueBtn.image, this.continueBtn.x, this.continueBtn.y);

        this.currentWinningScore = 0;
        this.phase = 'welcome'; // welcome phase for start()

        // Start the global timer
        this.timer.start();

        // event for mouse
        var self = this; // Keep a reference to the current this scope
        this.canvas.onmousedown = function (ev) {
            self.mouseDown(ev);
        };
        this.canvas.onmousemove = function (ev) {
            self.mouseMove(ev);
        };
        this.canvas.onmouseup = function (ev) {
            self.mouseUp(ev);
        };
        // event for touch screen
        this.canvas.ontouchstart = function () {
            self.touchStart();
        };
        this.canvas.ontouchmove = function () {
            self.touchMove();
        };
        this.canvas.ontouchend = function () {
            self.touchEnd();
        };
    };

    TARG.prototype.stimuliFromConfiguration = function stimuliFromConfiguration(configArray) {

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.gridArray = []; // clear grid array

        this.trialType = configArray.type;

        var stimuli = configArray.stimuli; //[gridCell, jitter, angle]

        for (var i = 0; i < stimuli.length; i++) {
            var text = i == 0 ? 'T' : 'L';
            var triad = stimuli[i];

            var idx = triad[0];
            var col = idx % this.dimX;
            var row = Math.floor(idx / this.dimX);

            var x = triad[1] + this.targetGridMinX + col * this.gridCellSize + Math.floor(this.gridCellSize / 2);
            var y = triad[1] + this.targetGridMinY + row * this.gridCellSize + Math.floor(this.gridCellSize / 2);

            var angle = triad[2];

            this.gridArray.push({
                x: x,
                y: y,
                angle: angle,
                text: text
            });
            this.printTLText(x, y, angle, text);
        }

        this.timerTrial.start();
    };

    TARG.prototype.printTLText = function printTLText(x, y, angle, text) {
        var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '#FFFFFF';
        var fontSize = arguments[5];

        this.ctx.save();
        if (fontSize) {
            this.ctx.font = fontSize + "px Arial";
        } else {
            this.ctx.font = this.fontSize + "px Arial";
        }
        this.ctx.fillStyle = color;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        // this.ctx.globalAlpha = this.opacity/100;
        this.ctx.translate(x, y);
        this.ctx.rotate(angle / 180 * Math.PI);
        this.ctx.fillText(text, 0, 0);
        this.ctx.restore();
    };

    TARG.prototype.animatingSelectedText = function animatingSelectedText(selectedIndex) {

        // Clear canvas
        this.animatingFontSize += 5;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i = 0; i < this.gridArray.length; i++) {
            var item = this.gridArray[i];
            if (i === selectedIndex) {
                var color = item.text === 'T' ? '#ffff00' : '#ff0000';
                this.printTLText(item.x, item.y, item.angle, item.text, color, this.animatingFontSize);
            } else {
                this.printTLText(item.x, item.y, item.angle, item.text);
            }
        }

        var self = this;
        setTimeout(function () {
            if (self.animatingFontSize <= 80) {
                self.animatingSelectedText(self.curSelectedIndex);
            } else {
                self.curSelectedIndex = -1;
                self.curSelectedData = null;
                self.gridArray = [];
                // then increase the trial index
                self.trialIndex++;
                if (self.trialIndex >= self.numOfTrials) {
                    self.phase = 'rateFeeling';
                    self.rateFeeling();
                } else {
                    self.phase = 'whack a t';
                    self.stimuliFromConfiguration(self.todayConfig[self.trialIndex]);
                }
            }
        }, 30);
    };

    TARG.prototype.clickHander = function clickHander(pos) {

        this.sound.play();

        if (this.phase === 'welcome') {
            if (this.clickInRect(pos, this.continueBtn)) {
                this.phase = 'rateFeeling';

            }
        } else if (this.phase === 'rateFeeling' && this.trialIndex == 0) {
            if (this.clickInRect(pos, this.continueBtn)) {
                this.phase = 'whack a t'
                this.allResponses.push({ feelingRate: this.feelingString });
                this.feelingXaxis = this.canvas.width *0.5
            }

        } else if (this.phase === 'whack a t') {
            // Get the clocked font index
            for (var i = 0; i < this.gridArray.length; i++) {
                var rect = {
                    x: this.gridArray[i].x - Math.floor(this.gridCellSize / 3),
                    y: this.gridArray[i].y - Math.floor(this.gridCellSize / 3),
                    width: this.gridCellSize/2,
                    height: this.gridCellSize/2
                };

                console.log(rect, pos)

                if (this.clickInRect(pos, rect)) {
                    this.curSelectedIndex = i;
                    this.curSelectedData = this.gridArray[i].text;
                    if (this.curSelectedData === 'T') {
                        this.numOfSuccess += 1;
                    }
                    this.phase = 'animating';
                    this.allResponses.push({
                        day: thisConfig.day,
                        index: this.trialIndex,
                        configArray: this.todayConfig[this.trialIndex],
                        selectedData: {
                            index: i,
                            rt: this.timerTrial.elapsed(),
                            data: this.curSelectedData
                        }
                    });
                    break;
                }
            }

            // do animation
            if (this.curSelectedIndex >= 0) {
                var self = this;
                this.animatingFontSize = 40;
                self.animatingSelectedText(this.curSelectedIndex);
            }
        } else if (this.phase === 'rateFeeling' && this.trialIndex !== 0) {
            if (this.clickInRect(pos, this.continueBtn)) {
                this.phase = 'end';
                // Add rating response
                this.allResponses.push({ feelingRate: this.feelingString });
                // Workout success %
                this.allResponses.push({
                    successPercent: this.numOfSuccess / this.numOfTrials * 100 + '%',
                    totalRT: this.timer.elapsed()
                });
            }
        }

        switch (this.phase) {
            case 'whack a t':
                this.stimuliFromConfiguration(this.todayConfig[this.trialIndex]);
                break;
            case 'rateFeeling':
                // handle the rate feeling
                var arrow = { x: this.feelingXaxis - 15, y: 300, width: 30, height: 40 };
                this.doRating = this.clickInRect(pos, arrow) ? true : false;
                this.rateFeeling();
                break;
            case 'end':
                this.end();
                break;
        }
    };

    TARG.prototype.clickInRect = function clickInRect(pos, rect) {
        return pos.x > rect.x && rect.x + rect.width > pos.x && pos.y > rect.y && rect.y + rect.height > pos.y;
    };

    TARG.prototype.rateFeeling = function rateFeeling() {
        // Step 1: clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // A grey background
        this.ctx.fillStyle = "#404040";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = "#000000";
        this.ctx.lineWidth = 2;
        // Anger
        this.ctx.beginPath();
        this.ctx.arc(250, 350, 30, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#ff0000";
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(240, 343, 4, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#000000";
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(260, 343, 4, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#000000";
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.stroke();

        // anger face
        this.ctx.strokeStyle = "#000000";
        this.ctx.beginPath();
        this.ctx.moveTo(235, 365);
        this.ctx.quadraticCurveTo(250, 350, 265, 365);
        this.ctx.stroke();

        // Smile
        this.ctx.beginPath();
        this.ctx.arc(774, 350, 30, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#00b300";
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(764, 343, 4, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#000000";
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(784, 343, 4, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#000000";
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.stroke();
        // smile face
        this.ctx.strokeStyle = "#000000";
        this.ctx.beginPath();
        this.ctx.moveTo(759, 355);
        this.ctx.quadraticCurveTo(774, 375, 789, 355);
        this.ctx.stroke();

        // Slider
        this.ctx.fillStyle = "#00b8e6";
        // Fractal width is 67.5
        this.ctx.fillRect(290, 345, this.canvas.width - 575, 15);
        // Arrow
        var x = this.feelingXaxis;
        this.ctx.beginPath();
        this.ctx.moveTo(x, 340);
        this.ctx.lineTo(x + 15, 330);
        this.ctx.lineTo(x + 7, 330);
        this.ctx.lineTo(x + 7, 300);
        this.ctx.lineTo(x - 7, 300);
        this.ctx.lineTo(x - 7, 330);
        this.ctx.lineTo(x - 15, 330);
        this.ctx.lineTo(x, 340);
        this.ctx.fillStyle = "#00b8e6";
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = "18px Georgia";
        this.ctx.textAlign = 'center';
        this.ctx.fillText('very unhappy', 250, 405);
        this.ctx.fillText('neutral', 512, 405);
        this.ctx.fillText('very happy', 774, 405);
        this.ctx.font = "36px Georgia";
        this.ctx.fillText("How are you feeling?", this.canvas.width / 2, 120);

        this.ctx.font = "26px Georgia";
        var currValue = Math.floor(21 * (x - 265) / 449) - 11;
        this.feelingString = currValue >= 0 ? '+' + currValue.toString() : currValue.toString();
        this.ctx.fillText(this.feelingString, x, 285);

        // Draw continue button on the first page
        this.continueBtn.x = 409.5; // initial location x
        this.continueBtn.y = 500; // initial location y
        this.ctx.drawImage(this.continueBtn.image, this.continueBtn.x, this.continueBtn.y);
    };

    // Events handler


    TARG.prototype.mouseDown = function mouseDown(ev) {
        var pos = { x: ev.pageX - this.offset.left, y: ev.pageY - this.offset.top };
        // Don't handle click when it is animating
        if (this.phase !== 'animating') {
            this.clickHander(pos);
        }
    };

    TARG.prototype.touchStart = function touchStart() {
        var pos = { x: event.targetTouches[0].pageX - this.offset.left, y: event.targetTouches[0].pageY - this.offset.top };
        // Don't handle click when it is animating
        if (this.phase !== 'animating') {
            this.clickHander(pos);
        }
    };

    TARG.prototype.moveHandler = function moveHandler(pos) {
        if (this.phase === 'rateFeeling' && this.doRating) {
            if (pos.x > 290 && pos.x < 734) {
                this.feelingXaxis = pos.x;
                this.rateFeeling();
            }
        }
    };

    TARG.prototype.mouseMove = function mouseMove(ev) {
        var pos = { x: ev.pageX - this.offset.left, y: ev.pageY - this.offset.top };
        this.moveHandler(pos);
    };

    TARG.prototype.touchMove = function touchMove() {
        var pos = { x: event.targetTouches[0].pageX - this.offset.left, y: event.targetTouches[0].pageY - this.offset.top };
        this.moveHandler(pos);
    };

    TARG.prototype.mouseUp = function mouseUp(ev) {
        this.doRating = false;
    };

    TARG.prototype.touchEnd = function touchEnd() {
        this.doRating = false;
    };

    TARG.prototype.end = function end() {
        // increase day
        thisConfig.day++;
        if (thisConfig.day === 1) {
            // save the whole config
            finishScript(this.allResponses, {
                targ_config: thisConfig.targ_config,
                day: thisConfig.day
            });
        } else {
            // then only update day
            finishScript(this.allResponses, {
                day: thisConfig.day,
                updateOnly: true // only update the specific variables and keep the others
            });
        }
    };

    return TARG;
}();

function runScript() {

    if (typeof thisConfig === 'undefined') {
        thisConfig = { day: 0 };
    } else if (typeof thisConfig.targ_config === 'undefined') {
        // Alert error
        alert('targ_config is missing, please contact administrator');
        // Stop app
        return;
    }

    if (thisConfig.day === 0) {
        // async method to make sure config has been produced proeprly
        imgContinue.onload = function () {
            createTargConfig(function (err, config) {
                // Important!!: pass config to thisConfig
                thisConfig.targ_config = config;
                var game = new TARG(thisConfig.targ_config, thisConfig.day);
                console.log(thisConfig)
                game.start();
            });
        };
    } else {
        var game = new TARG(thisConfig.targ_config, thisConfig.day);
        imgContinue.onload = function () {
            game.start();
        };
    }
}

/**
 * Methods to create targ config
 */

function shuffle(array) {
    var l = array.length;
    if (l <= 1) {
        return array;
    }

    while (--l) {
        var j = Math.floor(Math.random() * (l + 1));
        var thisItem = array[l];
        array[l] = array[j];
        array[j] = thisItem;
    }
    return array;
}

function randomMember(array) {
    var index = Math.floor(Math.random() * array.length);

    return array[index];
}

function fillArray(start, incr, total, excluded) {
    var array = [];
    for (var i = 0; i < total; i += incr) {
        if (start + i !== excluded) {
            array.push(start + i);
        }
    }
    return array;
}

function fillArraySame(val, total) {
    var array = [];
    for (var i = 0; i < total; i++) {
        array.push(val);
    }
    return array;
}

function indicesOfElement(array, value) {
    var arrayNew = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i] === value) {
            arrayNew.push(i);
        }
    }
    return arrayNew;
}

function attemptToFixEs(sequence, index) {
    var newPos = index - 1;
    if (index == 0) {
        newPos = sequence.length - 1;
    }

    var tmp = sequence[newPos];
    sequence[newPos] = sequence[index];
    sequence[index] = tmp;

    return sequence;
}

function createTargConfig(done) {

    var canvas = document.getElementById("thirdpartyCanvas");
    canvas.setAttribute('style', "background: black");

    // Design for 1024 * 768
    canvas.width = 1024 - 7;
    canvas.height = window.innerHeight > 768 ? 768 - 7 : window.innerHeight - 7;
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "22px Georgia";
    ctx.fillText('Initializing config data at the first time...', canvas.width / 2, canvas.height / 2);

    // need 60 trials per day x 28 days
    // 5 different configurations (10-20 per day of each):
    // A: novel (never repeats) x 10 per day = 280 total
    // B: twice per day, every day x 10 difft configurations total
    // C: once per day, every day x 10 difft configurations total
    // D: every other day, 10 configs for odd, 10 configs for even = 20 total
    // E: 10 repeats within a day, but never again x 28 total
    // Hence: 280 + 10 + 10 + 20 + 28 = 348 configurations


    //EDIT
    // Now need 30 trials per day
    // 3 different configurations
   
    // A: novel (never repeats) x 10 per day = 280 total
    // C: once per day, every day x 10 difft configurations total
    // E: 10 repeats within a day, but never again x 28 total
    // Hence: 280 + 10 +  28 = 318 configurations
   
   

    // 4.18884231428571 is the max jitter in px (0.6 degrees in mm, 132 px/in)

    var jitter = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    var orientations = [0, 90, 180, 270];

    var dimX = 8;
    var dimY = 6;
    var days = 21;
    var trials = 60;
    // var configs = (10*days)+10+10+20+days;
    var configs = (20*days)+20+days;
    var batches = configs / 10;
    var locations_test = [];
    var configurations = [];
    // 10 predetermined fairly balanced
    var targets = [9, 12, 17, 18, 21, 30, 33, 34, 36, 38];
    // random order
    shuffle(targets);

    var stop = false;
    while (!stop) {
        for (var ii = 0; ii < batches; ii++) {
            for (var i = 0; i < targets.length; i++) {
                // Create configurations triads
                var config = [];

                config.push([targets[i], randomMember(jitter), randomMember(orientations)]);

                // get 11 other random locations
                var possibles = fillArray(0, 1, 48, targets[i]);

                shuffle(possibles);

                // Get 10 possibles
                possibles = possibles.slice(0, 11);
                // Sort ASC
                possibles.sort(function (x, y) {
                    if (x - y > 0) {
                        return 1;
                    } else return -1;
                });
                locations_test.push(possibles);

                for (var a = 0; a < possibles.length; a++) {
                    config.push([possibles[a], randomMember(jitter), randomMember(orientations)]);
                }

                configurations.push(config);
            }
        }

        var nonuniques = 0;
        for (var i = 0; i < locations_test.length && nonuniques == 0; i++) {

            for (var j = 0; j < locations_test.length && nonuniques == 0; j++) {

                if (i > j) {

                    var sum = 0;
                    var loc1 = locations_test[i];
                    var loc2 = locations_test[j];

                    for (var k = 0; k < loc1.length; k++) {
                        sum += loc1[k] == loc2[k] ? 1 : 0;
                    }

                    if (sum > 9) {
                        nonuniques++;
                    }
                }
            }
        }

        if (nonuniques == 0) {
            locations_test = [];
            stop = true;
        }
    }

    // Split configurations into types keeping blocks of 10

    var configs_A = configurations.slice(0, (20*days));
    var configs_C = configurations.slice(220, 240);
    var configs_E = configurations.slice((20*days)+20, (20*days)+20+days);

    // create files for each day (random order)
    var all_days_trails = []; // 21 days worth

    for (var day = 0; day < days; day++) {
        var day_trials = [];
        // dont allow two Es to appear consecutively
        // dont allow same Bs to appear consecutively
        //a1 = A 

        var a = fillArraySame(1, 20);
        var c = fillArraySame(3, 20);
        var e = fillArraySame(5, 20);

        var trial_sequence = [];
        trial_sequence = trial_sequence.concat(a, c, e);

        shuffle(trial_sequence);

        stop = false;
        while (!stop) {
            // check Es are not consecutive
            stop = true;
            var indices = indicesOfElement(trial_sequence, 5);
            for (var i = 0; i < indices.length - 1; i++) {
                if (indices[i + 1] == indices[i] + 1) {
                    trial_sequence = attemptToFixEs(trial_sequence, indices[i]);
                    stop = false;
                }
            }
        }

        // trial_sequence has no consecutive E trials
        // randomize order within A, B, etc
        var A_sequence = fillArray(0, 1, 10, 1000);
        shuffle(A_sequence);

        var B1_sequence = fillArray(0, 1, 10, 1000);
        var B2_sequence = fillArray(0, 1, 10, 1000);
        stop = false;

        while (!stop) {
            // avoid two same B configs consecutively
            shuffle(B1_sequence);
            shuffle(B2_sequence);

            var zeros = fillArraySame(0, trials);



            stop = true;
            for (var i = 0; i < trials - 1; i++) {
                if (zeros[i] != 0 && zeros[i] == zeros[i + 1]) {
                    stop = false;
                }
            }
        }

        var C_sequence = fillArray(0, 1, 10, 1000);
        shuffle(C_sequence);



        var countA = 0;;
        var countC = 0;
        var countE = 0;

        for (var trial = 0; trial < trials; trial++) {
            // A-E trial types
            if (trial_sequence[trial] == 1) {
                // A
                day_trials.push({ type: 'A', index: countA, stimuli: configs_A[A_sequence[countA] + day * A_sequence.length] });
                countA++;

            } else if (trial_sequence[trial] == 3) {
                // C
                day_trials.push({ type: 'C', index: countC, stimuli: configs_C[C_sequence[countC]] });
                countC++;
            } else if (trial_sequence[trial] == 5) {
                // E
                day_trials.push({ type: 'E', index: day, stimuli: configs_E[day] });
                countE++;
            }
        }
        all_days_trails.push(day_trials);
    }

    // Async to produce data and call the callback
    setTimeout(function () {
        done(null, all_days_trails);
    }, 1000);
}


    
