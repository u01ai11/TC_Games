"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Response: <response><task>GGAP</task><elap>475281</elap><code>fpos</code><rtme>202622</rtme><key>75</key><extras>Delay1 1444, Delay2 3720, RT 206342, Diff 202622, Score 0, Total score 21.76140350877193, preGuess 0, postGuess 0, preGuessRT 9689, postGuessRT 0, bonusPre 0, bonusPost 0</extras></response>

_version = '0.0.1';

// continue button
var imgContinue = new Image(205, 61);
imgContinue.src = pathPrefix + "/ggap/imgs/Continue_button.png";

var Timer = function () {
    function Timer() {
        _classCallCheck(this, Timer);

        this.started = false;
        this.paused = false;
        this.startTime = 0;
        this.stopTime = 0;
        this.currentTrail = -1;
    }

    Timer.prototype.start = function start() {
        var now = new Date();
        this.startTime = now.getTime();
        this.started = true;this.stopTime = 0;
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

var GGAP = function () {
    function GGAP(ggapConfig, day) {
        _classCallCheck(this, GGAP);

        this.canvas = document.getElementById("thirdpartyCanvas");
        this.canvas.setAttribute('style', "background: black");

        // Design for 1024 * 768
        this.canvas.width = 1024 - 7;
        this.canvas.height = window.innerHeight > 768 ? 768 - 7 : window.innerHeight - 7;

        this.ctx = this.canvas.getContext("2d");
        this.offset = $('#thirdpartyCanvas').offset();

        this.daysYValues = ggapConfig[day];
        this.totalScore = 0;
        this.allResponses = [];
        this.numOfZero = 0;

        // set phase to welcome
        this.phase = 'welcome';

        this.currentWinnings = 0;

        // init timer
        this.timer = new Timer();
        this.timerTrial = new Timer();

        this.sound = new Audio(pathPrefix + "/ggap/sounds/keyclick.mp3");

        // Rate performance
        this.ratePerformanceXaxis = 340;
        this.curRateValue = 0;
        this.doRating = false;
        // Rate feeling
        this.feelingXaxis = 512;
        this.feelingString = '+0';

        // variables for each trail
        this.numOfTrials = 15; // The max number of trails
        this.trailIndex = 0; // 15 trails in total
        this.guessGapStage = 'welcome';
        this.doTrial = false;
        this.radius = 100;
        this.delay1 = 0;
        this.delay2 = 0;

        // Init the continue button
        this.continueBtn = {
            image: imgContinue,
            x: 409.5, // inital location x
            y: 520, // inital location y
            width: 205,
            height: 61
        };
    }

    GGAP.prototype.start = function start() {
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
        this.ctx.fillText('Guess The Gap', 60, 110);
        this.ctx.font = "22px Georgia";
        this.ctx.fillText('In this game, you have to estimate how good you are at the Guess the Gap mini-game.  ', 60, 180);
        this.ctx.fillText('Remember, you only get points for estimating your score correctly, not for being good at ', 60, 215);
        this.ctx.fillText('the mini-game itself! ', 60, 250);
        this.ctx.fillText("First, you'll be asked to rate how well you think you'll do today", 60, 315);
        this.ctx.fillText('Next, you play the mini-game (guessing the time interval between the 2 flashing circles) ', 60, 370);
        this.ctx.fillText('a few times, receiving a feedback score reflecting your performance. ', 60, 405);
        this.ctx.fillText("Try to use this feedback to (if necessary) adjust your estimate of today's performance", 60, 470);
        this.ctx.fillText("in the final rating.", 60, 505);
        // Draw continue button on the first page
        this.ctx.drawImage(this.continueBtn.image, this.continueBtn.x, this.continueBtn.y);

        // Start the global timmer
        this.timer.start();

        // event for mouse
        var self = this; // Keep a reference to the current this scope
        document.getElementById('thirdpartyCanvas').onmousedown = function (ev) {
            self.mouseDown(ev);
        };
        document.getElementById('thirdpartyCanvas').onmousemove = function (ev) {
            self.mouseMove(ev);
        };
        document.getElementById('thirdpartyCanvas').onmouseup = function (ev) {
            self.mouseUp(ev);
        };
        // event for touch screen
        document.getElementById('thirdpartyCanvas').ontouchstart = function () {
            self.touchStart();
        };
        document.getElementById('thirdpartyCanvas').ontouchmove = function () {
            self.touchMove();
        };
        document.getElementById('thirdpartyCanvas').ontouchend = function () {
            self.touchEnd();
        };
    };

    /**
     * Method to rate performance
     */


    GGAP.prototype.ratePerformance = function ratePerformance(text, color) {
        // Step 1: clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // A black background
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = "#000000";
        this.ctx.lineWidth = 2;

        // Slider
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(340, 345, 340, 10);
        // Arrow
        var x = this.ratePerformanceXaxis;
        this.ctx.beginPath();
        this.ctx.moveTo(x, 340);
        this.ctx.lineTo(x + 15, 330);
        this.ctx.lineTo(x + 7, 330);
        this.ctx.lineTo(x + 7, 300);
        this.ctx.lineTo(x - 7, 300);
        this.ctx.lineTo(x - 7, 330);
        this.ctx.lineTo(x - 15, 330);
        this.ctx.lineTo(x, 340);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.stroke();

        // Title text
        this.ctx.textAlign = 'center';
        this.ctx.font = "36px Georgia";
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, this.canvas.width / 2, 120);
        // Display 0 and 30 at the bottom of the sidebar
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = "30px Georgia";
        this.ctx.textAlign = 'center';
        this.ctx.fillText('0', 340, 380);
        this.ctx.fillText('30', 680, 380);

        this.ctx.font = "26px Georgia";
        this.curRateValue = Math.floor(31 * (x - 340) / 340);
        this.ctx.fillText(this.curRateValue, x, 285);

        // Draw continue button on the first page
        this.continueBtn.x = 409.5; // initial location x
        this.continueBtn.y = 400; // initial location y
        this.ctx.drawImage(this.continueBtn.image, this.continueBtn.x, this.continueBtn.y);
    };

    /**
     * rate feedback
     */


    GGAP.prototype.rateFeedback = function rateFeedback() {

        // Step 1: clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // A black background
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Slider
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(340, 345, 340, 5);
        // Display 0 and 30 at the bottom of the sidebar
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = "30px Georgia";
        this.ctx.textAlign = 'center';
        this.ctx.fillText('0', 340, 380);
        this.ctx.fillText('30', 680, 380);

        function drawArrow(ctx, x, color, text) {
            var orientation = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'down';

            ctx.beginPath();
            if (orientation === 'down') {
                ctx.moveTo(x, 340);
                ctx.lineTo(x + 15, 330);
                ctx.lineTo(x + 7, 330);
                ctx.lineTo(x + 7, 300);
                ctx.lineTo(x - 7, 300);
                ctx.lineTo(x - 7, 330);
                ctx.lineTo(x - 15, 330);
                ctx.lineTo(x, 340);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.closePath();
                ctx.stroke();
                // Score text
                ctx.font = "25px Georgia";
                ctx.fillText(text, x, 285);
            } else {

                ctx.moveTo(x, 355);
                ctx.lineTo(x + 15, 365);
                ctx.lineTo(x + 7, 365);
                ctx.lineTo(x + 7, 385);
                ctx.lineTo(x - 7, 385);
                ctx.lineTo(x - 7, 365);
                ctx.lineTo(x - 15, 365);
                ctx.lineTo(x, 355);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.closePath();
                ctx.stroke();
                // Score text
                ctx.font = "25px Georgia";
                ctx.fillText(text, x, 410);
            }
        }

        // 1st guess arrow
        var guess1 = this.allResponses[0];
        drawArrow(this.ctx, guess1.xAxis, '#00b8e6', guess1.rating, 'down');
        // 2nd guess arrow
        var guess2 = this.allResponses[this.allResponses.length - 1];
        drawArrow(this.ctx, guess2.xAxis, '#ffff00', guess2.rating, 'down');
        // 3rd average score arrow
        var avgScore = 0;
        for (var i = 1; i < this.allResponses.length - 1; i++) {
            avgScore += this.allResponses[i].score;
        }
        avgScore = Math.round(avgScore / (this.allResponses.length - 1 - this.numOfZero));
        var xAxis = 340 / 30 * avgScore + 340;
        drawArrow(this.ctx, xAxis, '#00ff00', avgScore, 'up');

        // display oversummary
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillText("Real score: " + avgScore, 340, 80);
        this.ctx.fillStyle = '#00b8e6';
        this.ctx.fillText("1st guess: " + guess1.rating, 340, 120);
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillText("2nd guess: " + guess2.rating, 340, 160);
        // display Points
        this.ctx.fillStyle = '#ff0000';
        var score1 = 3 * this.getBonusScore(guess1.rating, avgScore);
        var score2 = this.getBonusScore(guess2.rating, avgScore);
        this.ctx.fillText('Points: ', 600, 40);
        this.ctx.fillText('+' + score1, 600, 120);
        this.ctx.fillText('+' + score2, 600, 160);

        // Draw continue button on the first page
        this.continueBtn.x = 409.5; // initial location x
        this.continueBtn.y = 450; // initial location y
        this.ctx.drawImage(this.continueBtn.image, this.continueBtn.x, this.continueBtn.y);

        this.allResponses.push({
            task: 'feedback',
            avgScore: avgScore,
            guess1Score: score1,
            guess2Score: score2
        });
    };

    GGAP.prototype.getBonusScore = function getBonusScore(guess, actual) {
        var diff = Math.abs(Math.round(guess - actual));
        var score = 0;

        switch (diff) {
            case 0:
                score = 5;break;
            case 1:
                score = 4;break;
            case 2:
                score = 3;break;
            case 3:
                score = 2;break;
            case 4:
                score = 1;break;
        }

        return score;
    };

    GGAP.prototype.guessGap = function guessGap() {
        var _this = this;

        if (this.guessGapStage === 'welcome') {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
            this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.radius, 0, 2 * Math.PI);
            this.ctx.lineWidth = 5;
            this.ctx.strokeStyle = '#666666';
            this.ctx.stroke();
            this.ctx.font = "20px Georgia";
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('Tap in circle to start', this.canvas.width / 2, this.canvas.height / 2);

            // Update guessGapStage to play
            this.guessGapStage = 'play';
        } else if (this.guessGapStage === 'play') {
            (function () {

                // Workout delay
                //      delay1 is a random between 1000 - 2000 ms
                _this.delay1 = Math.round(Math.random() * (2000 - 1000) + 1000);
                // constraint 2*delay2 + delay 1 < 10000 ms
                //      and delay2 is a random between 2500 - 4500 ms
                //      so delay2 is  2500 < delay2 < (10000 - delay1)/2
                _this.delay2 = Math.round(Math.random() * ((10000 - _this.delay1) / 2 - 2500) + 2500);

                var self = _this;
                _this.phase = 'frozen'; // a flag to not handle user click
                // Step 1: draw a grey circle with delay1
                self.greyCircle(self.delay1, function () {
                    // Step 2: display white circle for 200 ms
                    self.whiteCircle(200, function () {
                        // Step 3: display grey circle with plus
                        self.greyCirclePlus(self.delay2, function () {
                            // Step 4: display white circle
                            self.whiteCircle(200, function () {
                                // Draw a gray circle without delay
                                self.greyCircle(); // without delay
                                // Start trial timer
                                self.timerTrial.start();
                                // Update guessGapStage
                                self.guessGapStage = 'reaction';
                                self.phase = 'guess gap';
                                // wait for user to tap in circle
                            });
                        });
                    });
                });
            })();
        } else if (this.guessGapStage === 'reaction') {
            (function () {

                // Draw the green circle
                _this.greenCircle();
                // reaction time
                var rt = _this.timerTrial.elapsed();
                var diff = Math.round(rt - _this.delay2);

                var absDiff = Math.abs(diff);

                var score = _this.calcScore(absDiff);
                _this.totalScore += score;

                // Response: <response><task>GGAP</task><elap>475281</elap><code>fpos</code><rtme>202622</rtme><key>75</key><extras>Delay1 1444, Delay2 3720, RT 206342, Diff 202622, Score 0, Total score 21.76140350877193, preGuess 0, postGuess 0, preGuessRT 9689, postGuessRT 0, bonusPre 0, bonusPost 0</extras></response>

                // Record response
                _this.allResponses.push({
                    task: 'GGAP - ' + (_this.trailIndex + 1),
                    Delay1: _this.delay1,
                    Delay2: _this.delay2,
                    RT: rt,
                    Diff: diff,
                    score: score,
                    totalScore: _this.totalScore
                    // preGuess 0, postGuess 0, preGuessRT 9689, postGuessRT 0, bonusPre 0, bonusPost 0
                });

                // feedback by alert if this.score == 0 (ie > this.zeroTime)
                if (score == 0) {
                    _this.numOfZero++; // This is not calculated in totalScore
                    if (diff < 0) {
                        alert('You were too fast, please try to be slower next time');
                    } else {
                        alert('You were too slow, please try to be faster next time');
                    }
                } else {
                    // Display score
                    var textDiff = Math.round(score);
                    // Display score below circle
                    _this.ctx.fillText(textDiff, _this.canvas.width / 2, _this.canvas.height / 2 + _this.radius + 20);
                }

                // Change to 'welcome'
                //    freeze this app, do NOT handle user's click
                _this.phase = 'frozen';
                var self = _this;
                // 2 seconds delay for showing score
                setTimeout(function () {

                    self.guessGapStage = 'welcome';
                    self.phase = 'guess gap';
                    self.trailIndex++;
                    if (self.trailIndex < self.numOfTrials) {
                        // Run next guess
                        self.guessGap();
                    } else {
                        // End of the guess
                        self.phase = 'rate today';
                        self.ratePerformanceXaxis = 340; // Set arrow to the beginning
                        self.ratePerformance("Rate today's performance", '#ffff00');
                    }
                }, 2000);
            })();
        }
    };

    GGAP.prototype.greyCircle = function greyCircle(delay, done) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.radius, 0, 2 * Math.PI);
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = '#cccccc';
        this.ctx.stroke();

        if (delay) {
            setTimeout(function () {
                done();
            }, delay);
        }
    };

    GGAP.prototype.whiteCircle = function whiteCircle(delay, done) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.radius, 0, 2 * Math.PI);
        this.ctx.fill();

        if (delay) {
            setTimeout(function () {
                done();
            }, delay);
        }
    };

    GGAP.prototype.greyCirclePlus = function greyCirclePlus(delay, done) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.radius, 0, 2 * Math.PI);
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = '#cccccc';
        this.ctx.stroke();
        this.ctx.font = "26px Georgia";
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('+', this.canvas.width / 2, this.canvas.height / 2);

        if (delay) {
            setTimeout(function () {
                done();
            }, delay);
        }
    };

    GGAP.prototype.greenCircle = function greenCircle(delay, done) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.radius, 0, 2 * Math.PI);
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = "#009933";
        this.ctx.stroke();

        if (delay) {
            setTimeout(function () {
                done();
            }, delay);
        }
    };

    GGAP.prototype.rateFeeling = function rateFeeling() {
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

    GGAP.prototype.clickInRect = function clickInRect(pos, rect) {
        return pos.x > rect.x && rect.x + rect.width > pos.x && pos.y > rect.y && rect.y + rect.height > pos.y;
    };

    GGAP.prototype.clickInCircle = function clickInCircle(pos, circle) {
        var distance = Math.pow(pos.x - circle.x, 2) + Math.pow(pos.y - circle.y, 2);
        return distance <= Math.pow(circle.radius, 2);
    };

    GGAP.prototype.clickHander = function clickHander(pos) {

        this.sound.play();

        if (this.phase === 'welcome') {

            if (this.clickInRect(pos, this.continueBtn)) {
                this.phase = 'rate performance';
            }
        } else if (this.phase === 'rate performance') {

            if (this.clickInRect(pos, this.continueBtn)) {
                // push rate performance data
                this.allResponses.push({
                    task: "How good do you think you will be?",
                    rating: this.curRateValue,
                    xAxis: this.ratePerformanceXaxis
                });

                this.phase = 'guess gap';
            }
        } else if (this.phase === 'guess gap') {
            var circle = { x: this.canvas.width / 2, y: this.canvas.height / 2, radius: this.radius };
            if (this.clickInCircle(pos, circle)) {
                this.doTrial = true; // update the flag to indicate the 'start' of trial
            }
        } else if (this.phase === 'rate today') {
            if (this.clickInRect(pos, this.continueBtn)) {
                // push rate today data
                this.allResponses.push({
                    task: "Rate today's performance",
                    rating: this.curRateValue,
                    xAxis: this.ratePerformanceXaxis
                });

                this.phase = 'feedback';
                this.rateFeedback();
            }
        } else if (this.phase === 'feedback') {
            if (this.clickInRect(pos, this.continueBtn)) {
                // Move into rate feeling
                this.phase = 'rateFeeling';
            }
        } else if (this.phase === 'rateFeeling') {
            if (this.clickInRect(pos, this.continueBtn)) {
                // push rate feeling data
                this.allResponses.push({ feelingRate: this.feelingString });
                this.end();
            }
        }

        switch (this.phase) {
            case 'rate performance':
                var arrow = { x: this.ratePerformanceXaxis - 15, y: 300, width: 30, height: 40 };
                this.doRating = this.clickInRect(pos, arrow) ? true : false;
                this.ratePerformance('How good do you think you will be?', '#00b8e6');
                break;
            case 'guess gap':
                this.guessGap();break;
            case 'frozen':
                // Do nothing, just not handle user click
                break;
            case 'rate today':
                var arrow = { x: this.ratePerformanceXaxis - 15, y: 300, width: 30, height: 40 };
                this.doRating = this.clickInRect(pos, arrow) ? true : false;
                this.ratePerformance("Rate today's performance", '#ffff00');
                break;
            case 'rateFeeling':
                var arrow = { x: this.feelingXaxis - 15, y: 300, width: 30, height: 40 };
                this.doRating = this.clickInRect(pos, arrow) ? true : false;
                this.rateFeeling();break;
        }
    };

    GGAP.prototype.mouseDown = function mouseDown(ev) {
        var pos = { x: ev.pageX - this.offset.left, y: ev.pageY - this.offset.top };
        // Don't handle click when it is spinning
        if (this.phase !== 'playing') {
            this.clickHander(pos);
        }
    };

    GGAP.prototype.touchStart = function touchStart() {
        var pos = { x: event.targetTouches[0].pageX - this.offset.left, y: event.targetTouches[0].pageY - this.offset.top };
        // Don't handle click when it is spinning
        if (this.phase !== 'playing') {
            this.clickHander(pos);
        }
    };

    GGAP.prototype.mouseUp = function mouseUp(ev) {
        this.doRating = false;
    };

    GGAP.prototype.touchEnd = function touchEnd() {
        this.doRating = false;
    };

    GGAP.prototype.moveHandler = function moveHandler(pos) {
        if (this.phase === 'rate performance' && this.doRating) {
            if (pos.x >= 340 && pos.x <= 680) {
                this.ratePerformanceXaxis = pos.x;
                this.ratePerformance('How good do you think you will be?', '#00b8e6');
            }
        } else if (this.phase === 'rate today' && this.doRating) {
            if (pos.x >= 340 && pos.x <= 680) {
                this.ratePerformanceXaxis = pos.x;
                this.ratePerformance("Rate today's performance", '#ffff00');
            }
        } else if (this.phase === 'rateFeeling' && this.doRating) {
            if (pos.x > 290 && pos.x < 734) {
                this.feelingXaxis = pos.x;
                this.rateFeeling();
            }
        }
    };

    GGAP.prototype.mouseMove = function mouseMove(ev) {
        var pos = { x: ev.pageX - this.offset.left, y: ev.pageY - this.offset.top };
        this.moveHandler(pos);
    };

    GGAP.prototype.touchMove = function touchMove() {
        var pos = { x: event.targetTouches[0].pageX - this.offset.left, y: event.targetTouches[0].pageY - this.offset.top };
        this.moveHandler(pos);
    };

    GGAP.prototype.calcScore = function calcScore(diff) {
        // Important: the following code are copied from existing comet project

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

        if (diff < this.daysYValues[3]) {
            // first x value inflection
            // nice job!
            x1 = 0;
            x2 = this.daysYValues[3];
            y1 = this.daysYValues[2];
            y2 = y1st;
        } else if (diff < this.daysYValues[4]) {
            // second x value inflection
            // not too shabby!
            x1 = this.daysYValues[3];
            x2 = this.daysYValues[4];
            y1 = y1st;
            y2 = y2nd;
        } else {
            // borderline guess!
            x1 = this.daysYValues[4];
            x2 = this.daysYValues[5];
            y1 = y2nd;
            y2 = 0;
        }
        // for y = mx + c: m = (y-c)/x; c = y - mx;
        // for 2 points: c = (x1y2 - x2y1)/(x1-x2)
        var c, m;
        c = (x1 * y2 - x2 * y1) / (x1 - x2);
        if (x1 == 0) {
            m = (y2 - c) / x2;
        } else {
            m = (y1 - c) / x1;
        }

        // work out their score using this equation:
        return m * diff + c; // max score is maxScore
    };

    GGAP.prototype.end = function end() {
        // increase day
        thisConfig.day++;
        // then only update day
        finishScript(this.allResponses, {
            day: thisConfig.day,
            updateOnly: true // only update the specific variables
        });
    };

    return GGAP;
}();

function runScript() {

    if (typeof thisConfig === 'undefined' || typeof thisConfig.ggap_config === 'undefined') {
        alert("ggap_config is missing, please contact administrator");
    } else if (typeof thisConfig.day === 'undefined') {
        thisConfig.day = 0;
    }

    var game = new GGAP(thisConfig.ggap_config, thisConfig.day);
    imgContinue.onload = function () {
        game.start();
    };
}