"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_version = '0.0.1';
pathPrefix = pathPrefix;

// continue button
var imgContinue = new Image(205, 61);
imgContinue.src = pathPrefix + "/fractals/imgs/Continue_button.png";
var global_frac_config = [[[[1, 15, 0.7], [3, 20, 0.5]], [[0, 35, 0.3], [3, 0, 0.5]], [[2, 25, 0.4], [1, 15, 0.7]], [[2, 0, 0.4], [3, 0, 0.5]], [[1, 15, 0.7], [4, 0, 0.5]], [[2, 0, 0.4], [0, 0, 0.3]], [[3, 20, 0.5], [4, 25, 0.5]], [[2, 0, 0.4], [4, 0, 0.5]], [[1, 0, 0.7], [0, 0, 0.3]], [[4, 0, 0.5], [0, 0, 0.3]]], [[[4, 25, 0.5], [3, 20, 0.5]], [[1, 15, 0.7], [0, 0, 0.3]], [[0, 35, 0.3], [3, 20, 0.5]], [[4, 0, 0.5], [0, 0, 0.3]], [[2, 0, 0.4], [3, 20, 0.5]], [[1, 0, 0.7], [2, 25, 0.4]], [[1, 15, 0.7], [3, 0, 0.5]], [[2, 25, 0.4], [4, 25, 0.5]], [[4, 0, 0.5], [1, 15, 0.7]], [[0, 0, 0.3], [2, 0, 0.4]]], [[[4, 25, 0.5], [3, 0, 0.5]], [[3, 20, 0.5], [2, 0, 0.4]], [[4, 25, 0.5], [1, 15, 0.7]], [[0, 0, 0.3], [4, 25, 0.5]], [[2, 25, 0.4], [1, 0, 0.7]], [[2, 0, 0.4], [4, 0, 0.5]], [[1, 15, 0.7], [0, 35, 0.3]], [[2, 0, 0.4], [0, 0, 0.3]], [[3, 0, 0.5], [1, 0, 0.7]], [[3, 20, 0.5], [0, 0, 0.3]]], [[[2, 25, 0.4], [3, 0, 0.5]], [[1, 0, 0.7], [0, 0, 0.3]], [[1, 15, 0.7], [3, 20, 0.5]], [[1, 15, 0.7], [2, 25, 0.4]], [[0, 0, 0.3], [3, 0, 0.5]], [[3, 0, 0.5], [4, 0, 0.5]], [[4, 25, 0.5], [2, 0, 0.4]], [[2, 25, 0.4], [0, 0, 0.3]], [[0, 35, 0.3], [4, 0, 0.5]], [[1, 15, 0.7], [4, 25, 0.5]]], [[[1, 15, 0.7], [3, 20, 0.5]], [[3, 0, 0.5], [4, 0, 0.5]], [[3, 20, 0.5], [2, 0, 0.4]], [[0, 0, 0.3], [2, 25, 0.4]], [[4, 25, 0.5], [2, 0, 0.4]], [[4, 25, 0.5], [0, 35, 0.3]], [[1, 15, 0.7], [4, 0, 0.5]], [[3, 0, 0.5], [0, 35, 0.3]], [[2, 0, 0.4], [1, 0, 0.7]], [[0, 0, 0.3], [1, 15, 0.7]]], [[[2, 0, 0.4], [4, 0, 0.5]], [[3, 0, 0.5], [1, 15, 0.7]], [[2, 25, 0.4], [0, 0, 0.3]], [[3, 20, 0.5], [2, 0, 0.4]], [[1, 15, 0.7], [0, 0, 0.3]], [[3, 0, 0.5], [0, 0, 0.3]], [[1, 15, 0.7], [4, 25, 0.5]], [[1, 15, 0.7], [2, 0, 0.4]], [[0, 35, 0.3], [4, 25, 0.5]], [[3, 0, 0.5], [4, 0, 0.5]]], [[[1, 0, 0.7], [0, 35, 0.3]], [[3, 20, 0.5], [4, 25, 0.5]], [[1, 15, 0.7], [4, 25, 0.5]], [[4, 0, 0.5], [0, 0, 0.3]], [[2, 25, 0.4], [4, 0, 0.5]], [[3, 0, 0.5], [0, 0, 0.3]], [[0, 0, 0.3], [2, 0, 0.4]], [[1, 15, 0.7], [3, 0, 0.5]], [[2, 0, 0.4], [3, 0, 0.5]], [[1, 15, 0.7], [2, 25, 0.4]]], [[[3, 0, 0.5], [1, 0, 0.7]], [[2, 25, 0.4], [3, 20, 0.5]], [[1, 15, 0.7], [4, 0, 0.5]], [[3, 0, 0.5], [0, 0, 0.3]], [[1, 0, 0.7], [2, 0, 0.4]], [[3, 20, 0.5], [4, 25, 0.5]], [[0, 0, 0.3], [4, 25, 0.5]], [[2, 25, 0.4], [4, 0, 0.5]], [[0, 35, 0.3], [2, 25, 0.4]], [[0, 35, 0.3], [1, 15, 0.7]]], [[[1, 0, 0.7], [4, 0, 0.5]], [[2, 0, 0.4], [0, 35, 0.3]], [[4, 0, 0.5], [3, 0, 0.5]], [[1, 15, 0.7], [3, 20, 0.5]], [[3, 20, 0.5], [0, 0, 0.3]], [[2, 0, 0.4], [4, 25, 0.5]], [[3, 20, 0.5], [2, 0, 0.4]], [[0, 0, 0.3], [4, 0, 0.5]], [[1, 0, 0.7], [2, 25, 0.4]], [[1, 0, 0.7], [0, 0, 0.3]]], [[[4, 0, 0.5], [3, 20, 0.5]], [[0, 0, 0.3], [3, 20, 0.5]], [[3, 20, 0.5], [1, 15, 0.7]], [[3, 0, 0.5], [2, 0, 0.4]], [[0, 35, 0.3], [4, 25, 0.5]], [[2, 0, 0.4], [1, 15, 0.7]], [[1, 15, 0.7], [0, 0, 0.3]], [[4, 25, 0.5], [1, 15, 0.7]], [[0, 0, 0.3], [2, 25, 0.4]], [[2, 0, 0.4], [4, 25, 0.5]]], [[[0, 0, 0.3], [4, 25, 0.5]], [[2, 25, 0.4], [3, 0, 0.5]], [[1, 15, 0.7], [3, 0, 0.5]], [[3, 20, 0.5], [4, 0, 0.5]], [[4, 25, 0.5], [2, 25, 0.4]], [[0, 0, 0.3], [3, 20, 0.5]], [[1, 15, 0.7], [4, 25, 0.5]], [[2, 0, 0.4], [0, 0, 0.3]], [[1, 15, 0.7], [2, 0, 0.4]], [[1, 15, 0.7], [0, 35, 0.3]]], [[[4, 0, 0.5], [2, 0, 0.4]], [[4, 0, 0.5], [0, 0, 0.3]], [[1, 15, 0.7], [3, 20, 0.5]], [[2, 25, 0.4], [0, 0, 0.3]], [[4, 0, 0.5], [1, 15, 0.7]], [[3, 0, 0.5], [2, 0, 0.4]], [[1, 0, 0.7], [2, 25, 0.4]], [[3, 0, 0.5], [0, 35, 0.3]], [[1, 15, 0.7], [0, 0, 0.3]], [[4, 25, 0.5], [3, 0, 0.5]]], [[[3, 20, 0.5], [2, 0, 0.4]], [[1, 0, 0.7], [4, 0, 0.5]], [[4, 25, 0.5], [3, 0, 0.5]], [[4, 25, 0.5], [2, 0, 0.4]], [[2, 0, 0.4], [1, 15, 0.7]], [[0, 35, 0.3], [2, 25, 0.4]], [[3, 0, 0.5], [0, 0, 0.3]], [[1, 15, 0.7], [3, 20, 0.5]], [[1, 0, 0.7], [0, 0, 0.3]], [[0, 0, 0.3], [4, 0, 0.5]]], [[[3, 0, 0.5], [1, 15, 0.7]], [[4, 0, 0.5], [0, 0, 0.3]], [[3, 20, 0.5], [2, 0, 0.4]], [[4, 25, 0.5], [3, 0, 0.5]], [[0, 0, 0.3], [1, 15, 0.7]], [[2, 0, 0.4], [0, 0, 0.3]], [[2, 25, 0.4], [1, 15, 0.7]], [[1, 0, 0.7], [4, 0, 0.5]], [[0, 35, 0.3], [3, 20, 0.5]], [[2, 0, 0.4], [4, 0, 0.5]]], [[[3, 0, 0.5], [4, 25, 0.5]], [[4, 25, 0.5], [1, 0, 0.7]], [[1, 15, 0.7], [0, 35, 0.3]], [[3, 20, 0.5], [1, 15, 0.7]], [[3, 20, 0.5], [0, 35, 0.3]], [[2, 0, 0.4], [3, 20, 0.5]], [[4, 25, 0.5], [2, 25, 0.4]], [[4, 0, 0.5], [0, 0, 0.3]], [[2, 0, 0.4], [0, 0, 0.3]], [[1, 0, 0.7], [2, 25, 0.4]]], [[[0, 35, 0.3], [1, 15, 0.7]], [[1, 15, 0.7], [2, 0, 0.4]], [[1, 15, 0.7], [4, 25, 0.5]], [[3, 20, 0.5], [0, 0, 0.3]], [[4, 25, 0.5], [0, 0, 0.3]], [[2, 0, 0.4], [0, 0, 0.3]], [[3, 0, 0.5], [4, 25, 0.5]], [[2, 25, 0.4], [4, 0, 0.5]], [[1, 0, 0.7], [3, 0, 0.5]], [[2, 25, 0.4], [3, 0, 0.5]]], [[[0, 0, 0.3], [1, 15, 0.7]], [[0, 35, 0.3], [4, 25, 0.5]], [[2, 0, 0.4], [1, 0, 0.7]], [[2, 25, 0.4], [3, 20, 0.5]], [[2, 25, 0.4], [0, 0, 0.3]], [[3, 20, 0.5], [1, 0, 0.7]], [[1, 15, 0.7], [4, 25, 0.5]], [[0, 0, 0.3], [3, 0, 0.5]], [[4, 0, 0.5], [2, 0, 0.4]], [[3, 20, 0.5], [4, 0, 0.5]]], [[[0, 0, 0.3], [2, 0, 0.4]], [[4, 25, 0.5], [3, 0, 0.5]], [[0, 0, 0.3], [4, 25, 0.5]], [[0, 0, 0.3], [1, 15, 0.7]], [[4, 0, 0.5], [1, 15, 0.7]], [[2, 25, 0.4], [3, 20, 0.5]], [[2, 0, 0.4], [1, 0, 0.7]], [[3, 20, 0.5], [1, 15, 0.7]], [[0, 35, 0.3], [3, 20, 0.5]], [[2, 0, 0.4], [4, 0, 0.5]]], [[[4, 0, 0.5], [2, 25, 0.4]], [[0, 0, 0.3], [1, 15, 0.7]], [[2, 0, 0.4], [1, 15, 0.7]], [[2, 0, 0.4], [0, 35, 0.3]], [[4, 0, 0.5], [0, 0, 0.3]], [[2, 0, 0.4], [3, 20, 0.5]], [[1, 15, 0.7], [4, 25, 0.5]], [[1, 15, 0.7], [3, 0, 0.5]], [[3, 0, 0.5], [0, 0, 0.3]], [[3, 20, 0.5], [4, 0, 0.5]]], [[[2, 0, 0.4], [0, 0, 0.3]], [[2, 25, 0.4], [3, 0, 0.5]], [[2, 25, 0.4], [4, 0, 0.5]], [[0, 0, 0.3], [1, 0, 0.7]], [[4, 25, 0.5], [1, 0, 0.7]], [[4, 0, 0.5], [0, 35, 0.3]], [[1, 15, 0.7], [3, 0, 0.5]], [[1, 15, 0.7], [2, 0, 0.4]], [[3, 0, 0.5], [0, 35, 0.3]], [[3, 20, 0.5], [4, 25, 0.5]]], [[[3, 20, 0.5], [4, 25, 0.5]], [[3, 20, 0.5], [2, 0, 0.4]], [[3, 0, 0.5], [1, 15, 0.7]], [[0, 0, 0.3], [2, 0, 0.4]], [[1, 15, 0.7], [0, 0, 0.3]], [[3, 20, 0.5], [0, 0, 0.3]], [[1, 15, 0.7], [2, 0, 0.4]], [[4, 0, 0.5], [1, 15, 0.7]], [[4, 0, 0.5], [2, 25, 0.4]], [[4, 25, 0.5], [0, 35, 0.3]]], [[[0, 0, 0.3], [2, 25, 0.4]], [[0, 0, 0.3], [4, 25, 0.5]], [[4, 0, 0.5], [3, 0, 0.5]], [[4, 0, 0.5], [1, 15, 0.7]], [[3, 0, 0.5], [0, 35, 0.3]], [[1, 0, 0.7], [0, 0, 0.3]], [[2, 0, 0.4], [4, 25, 0.5]], [[2, 25, 0.4], [1, 0, 0.7]], [[2, 0, 0.4], [3, 0, 0.5]], [[1, 15, 0.7], [3, 20, 0.5]]], [[[1, 15, 0.7], [3, 20, 0.5]], [[2, 25, 0.4], [3, 0, 0.5]], [[3, 0, 0.5], [0, 0, 0.3]], [[1, 15, 0.7], [0, 35, 0.3]], [[4, 0, 0.5], [3, 20, 0.5]], [[1, 15, 0.7], [2, 25, 0.4]], [[4, 0, 0.5], [1, 0, 0.7]], [[4, 0, 0.5], [0, 0, 0.3]], [[0, 0, 0.3], [2, 25, 0.4]], [[2, 0, 0.4], [4, 25, 0.5]]], [[[4, 25, 0.5], [1, 15, 0.7]], [[2, 0, 0.4], [0, 0, 0.3]], [[3, 20, 0.5], [0, 0, 0.3]], [[1, 15, 0.7], [2, 0, 0.4]], [[4, 25, 0.5], [3, 20, 0.5]], [[4, 0, 0.5], [0, 35, 0.3]], [[1, 0, 0.7], [0, 0, 0.3]], [[2, 25, 0.4], [3, 0, 0.5]], [[1, 0, 0.7], [3, 0, 0.5]], [[2, 0, 0.4], [4, 25, 0.5]]], [[[4, 0, 0.5], [2, 0, 0.4]], [[1, 0, 0.7], [4, 25, 0.5]], [[1, 15, 0.7], [0, 0, 0.3]], [[3, 0, 0.5], [4, 0, 0.5]], [[1, 15, 0.7], [2, 0, 0.4]], [[3, 0, 0.5], [0, 0, 0.3]], [[1, 15, 0.7], [3, 20, 0.5]], [[3, 20, 0.5], [2, 25, 0.4]], [[0, 35, 0.3], [4, 25, 0.5]], [[2, 0, 0.4], [0, 35, 0.3]]], [[[0, 35, 0.3], [2, 0, 0.4]], [[0, 0, 0.3], [3, 0, 0.5]], [[0, 0, 0.3], [1, 15, 0.7]], [[1, 15, 0.7], [3, 20, 0.5]], [[1, 15, 0.7], [4, 0, 0.5]], [[1, 15, 0.7], [2, 25, 0.4]], [[3, 0, 0.5], [4, 0, 0.5]], [[2, 0, 0.4], [3, 0, 0.5]], [[0, 0, 0.3], [4, 25, 0.5]], [[2, 0, 0.4], [4, 0, 0.5]]], [[[0, 0, 0.3], [4, 0, 0.5]], [[4, 25, 0.5], [3, 0, 0.5]], [[3, 0, 0.5], [1, 15, 0.7]], [[4, 0, 0.5], [2, 25, 0.4]], [[2, 25, 0.4], [1, 15, 0.7]], [[4, 0, 0.5], [1, 15, 0.7]], [[3, 0, 0.5], [2, 0, 0.4]], [[0, 35, 0.3], [2, 25, 0.4]], [[0, 0, 0.3], [3, 20, 0.5]], [[1, 15, 0.7], [0, 0, 0.3]]], [[[4, 0, 0.5], [2, 0, 0.4]], [[1, 0, 0.7], [2, 25, 0.4]], [[4, 25, 0.5], [0, 0, 0.3]], [[1, 15, 0.7], [4, 25, 0.5]], [[3, 0, 0.5], [0, 35, 0.3]], [[2, 0, 0.4], [3, 20, 0.5]], [[3, 0, 0.5], [4, 25, 0.5]], [[0, 0, 0.3], [1, 0, 0.7]], [[0, 0, 0.3], [2, 0, 0.4]], [[3, 0, 0.5], [1, 15, 0.7]]], [[[0, 0, 0.3], [2, 0, 0.4]], [[1, 15, 0.7], [2, 0, 0.4]], [[3, 20, 0.5], [2, 25, 0.4]], [[4, 25, 0.5], [1, 0, 0.7]], [[3, 0, 0.5], [1, 15, 0.7]], [[0, 0, 0.3], [3, 20, 0.5]], [[0, 35, 0.3], [4, 25, 0.5]], [[4, 0, 0.5], [2, 25, 0.4]], [[4, 25, 0.5], [3, 20, 0.5]], [[0, 35, 0.3], [1, 15, 0.7]]], [[[2, 25, 0.4], [3, 20, 0.5]], [[2, 0, 0.4], [0, 0, 0.3]], [[0, 0, 0.3], [4, 0, 0.5]], [[4, 25, 0.5], [2, 0, 0.4]], [[0, 35, 0.3], [3, 20, 0.5]], [[4, 0, 0.5], [3, 20, 0.5]], [[2, 0, 0.4], [1, 15, 0.7]], [[1, 0, 0.7], [4, 25, 0.5]], [[0, 0, 0.3], [1, 0, 0.7]], [[3, 20, 0.5], [1, 0, 0.7]]], [[[2, 0, 0.4], [4, 0, 0.5]], [[0, 0, 0.3], [2, 0, 0.4]], [[4, 25, 0.5], [0, 0, 0.3]], [[3, 20, 0.5], [2, 0, 0.4]], [[3, 20, 0.5], [1, 15, 0.7]], [[1, 15, 0.7], [0, 0, 0.3]], [[3, 0, 0.5], [0, 35, 0.3]], [[3, 0, 0.5], [4, 25, 0.5]], [[1, 15, 0.7], [4, 0, 0.5]], [[2, 25, 0.4], [1, 15, 0.7]]], [[[0, 35, 0.3], [2, 0, 0.4]], [[1, 15, 0.7], [2, 0, 0.4]], [[3, 20, 0.5], [0, 35, 0.3]], [[1, 15, 0.7], [0, 0, 0.3]], [[4, 0, 0.5], [1, 15, 0.7]], [[0, 0, 0.3], [4, 25, 0.5]], [[3, 0, 0.5], [4, 25, 0.5]], [[2, 25, 0.4], [3, 0, 0.5]], [[4, 25, 0.5], [2, 0, 0.4]], [[1, 0, 0.7], [3, 0, 0.5]]], [[[1, 15, 0.7], [3, 20, 0.5]], [[4, 25, 0.5], [0, 0, 0.3]], [[3, 0, 0.5], [0, 0, 0.3]], [[0, 35, 0.3], [2, 0, 0.4]], [[2, 25, 0.4], [1, 15, 0.7]], [[4, 0, 0.5], [1, 15, 0.7]], [[4, 0, 0.5], [2, 25, 0.4]], [[3, 0, 0.5], [2, 0, 0.4]], [[1, 15, 0.7], [0, 0, 0.3]], [[4, 0, 0.5], [3, 20, 0.5]]], [[[1, 15, 0.7], [4, 25, 0.5]], [[3, 20, 0.5], [2, 0, 0.4]], [[1, 0, 0.7], [3, 20, 0.5]], [[0, 0, 0.3], [3, 0, 0.5]], [[1, 15, 0.7], [2, 25, 0.4]], [[0, 0, 0.3], [1, 0, 0.7]], [[4, 0, 0.5], [0, 0, 0.3]], [[2, 25, 0.4], [4, 0, 0.5]], [[3, 0, 0.5], [4, 0, 0.5]], [[0, 35, 0.3], [2, 25, 0.4]]], [[[0, 35, 0.3], [1, 0, 0.7]], [[4, 25, 0.5], [2, 0, 0.4]], [[4, 25, 0.5], [3, 0, 0.5]], [[1, 15, 0.7], [4, 25, 0.5]], [[3, 20, 0.5], [1, 0, 0.7]], [[3, 20, 0.5], [2, 0, 0.4]], [[2, 0, 0.4], [0, 0, 0.3]], [[3, 20, 0.5], [0, 0, 0.3]], [[1, 0, 0.7], [2, 25, 0.4]], [[0, 0, 0.3], [4, 0, 0.5]]], [[[2, 25, 0.4], [3, 0, 0.5]], [[4, 25, 0.5], [3, 0, 0.5]], [[4, 0, 0.5], [1, 0, 0.7]], [[2, 25, 0.4], [0, 0, 0.3]], [[0, 0, 0.3], [3, 0, 0.5]], [[4, 0, 0.5], [0, 35, 0.3]], [[1, 15, 0.7], [0, 0, 0.3]], [[3, 20, 0.5], [1, 15, 0.7]], [[2, 0, 0.4], [1, 15, 0.7]], [[2, 0, 0.4], [4, 0, 0.5]]], [[[4, 25, 0.5], [1, 15, 0.7]], [[2, 25, 0.4], [0, 0, 0.3]], [[0, 0, 0.3], [1, 0, 0.7]], [[4, 25, 0.5], [0, 35, 0.3]], [[2, 0, 0.4], [3, 20, 0.5]], [[4, 0, 0.5], [2, 0, 0.4]], [[3, 20, 0.5], [1, 15, 0.7]], [[3, 0, 0.5], [4, 25, 0.5]], [[1, 0, 0.7], [2, 25, 0.4]], [[3, 20, 0.5], [0, 0, 0.3]]], [[[1, 15, 0.7], [3, 20, 0.5]], [[3, 20, 0.5], [2, 0, 0.4]], [[2, 0, 0.4], [0, 0, 0.3]], [[1, 15, 0.7], [2, 25, 0.4]], [[4, 25, 0.5], [2, 0, 0.4]], [[3, 20, 0.5], [4, 0, 0.5]], [[0, 35, 0.3], [3, 20, 0.5]], [[4, 25, 0.5], [0, 0, 0.3]], [[1, 15, 0.7], [0, 0, 0.3]], [[4, 0, 0.5], [1, 0, 0.7]]], [[[4, 0, 0.5], [2, 0, 0.4]], [[0, 0, 0.3], [1, 0, 0.7]], [[3, 0, 0.5], [0, 0, 0.3]], [[2, 0, 0.4], [0, 35, 0.3]], [[3, 0, 0.5], [4, 0, 0.5]], [[3, 20, 0.5], [1, 15, 0.7]], [[2, 0, 0.4], [3, 0, 0.5]], [[2, 25, 0.4], [1, 15, 0.7]], [[4, 25, 0.5], [0, 0, 0.3]], [[1, 15, 0.7], [4, 25, 0.5]]], [[[4, 0, 0.5], [3, 0, 0.5]], [[0, 35, 0.3], [3, 0, 0.5]], [[1, 15, 0.7], [0, 35, 0.3]], [[1, 15, 0.7], [3, 20, 0.5]], [[2, 0, 0.4], [4, 25, 0.5]], [[2, 25, 0.4], [0, 0, 0.3]], [[4, 25, 0.5], [0, 0, 0.3]], [[2, 25, 0.4], [1, 0, 0.7]], [[2, 0, 0.4], [3, 0, 0.5]], [[1, 15, 0.7], [4, 0, 0.5]]], [[[1, 15, 0.7], [0, 0, 0.3]], [[2, 0, 0.4], [3, 0, 0.5]], [[0, 0, 0.3], [3, 0, 0.5]], [[0, 0, 0.3], [4, 25, 0.5]], [[2, 0, 0.4], [4, 0, 0.5]], [[1, 15, 0.7], [2, 25, 0.4]], [[3, 20, 0.5], [1, 15, 0.7]], [[3, 0, 0.5], [4, 25, 0.5]], [[0, 35, 0.3], [2, 0, 0.4]], [[1, 15, 0.7], [4, 0, 0.5]]], [[[0, 35, 0.3], [1, 15, 0.7]], [[4, 25, 0.5], [0, 0, 0.3]], [[3, 20, 0.5], [1, 15, 0.7]], [[2, 25, 0.4], [1, 15, 0.7]], [[4, 0, 0.5], [3, 0, 0.5]], [[3, 20, 0.5], [0, 0, 0.3]], [[4, 25, 0.5], [2, 0, 0.4]], [[3, 20, 0.5], [2, 0, 0.4]], [[0, 35, 0.3], [2, 25, 0.4]], [[1, 0, 0.7], [4, 25, 0.5]]], [[[4, 0, 0.5], [2, 25, 0.4]], [[2, 0, 0.4], [3, 0, 0.5]], [[0, 35, 0.3], [2, 0, 0.4]], [[1, 15, 0.7], [0, 0, 0.3]], [[4, 0, 0.5], [1, 0, 0.7]], [[1, 15, 0.7], [2, 25, 0.4]], [[4, 25, 0.5], [0, 0, 0.3]], [[3, 20, 0.5], [1, 15, 0.7]], [[3, 0, 0.5], [0, 0, 0.3]], [[4, 0, 0.5], [3, 0, 0.5]]], [[[3, 0, 0.5], [4, 25, 0.5]], [[0, 0, 0.3], [3, 20, 0.5]], [[2, 0, 0.4], [1, 15, 0.7]], [[2, 25, 0.4], [0, 35, 0.3]], [[3, 0, 0.5], [1, 15, 0.7]], [[1, 0, 0.7], [4, 25, 0.5]], [[1, 0, 0.7], [0, 0, 0.3]], [[2, 0, 0.4], [4, 0, 0.5]], [[4, 25, 0.5], [0, 0, 0.3]], [[3, 0, 0.5], [2, 0, 0.4]]], [[[1, 0, 0.7], [0, 0, 0.3]], [[1, 15, 0.7], [3, 20, 0.5]], [[2, 25, 0.4], [0, 0, 0.3]], [[4, 25, 0.5], [1, 0, 0.7]], [[3, 20, 0.5], [2, 0, 0.4]], [[4, 0, 0.5], [0, 35, 0.3]], [[2, 0, 0.4], [1, 15, 0.7]], [[3, 20, 0.5], [4, 0, 0.5]], [[3, 20, 0.5], [0, 0, 0.3]], [[2, 25, 0.4], [4, 0, 0.5]]], [[[4, 25, 0.5], [0, 0, 0.3]], [[4, 0, 0.5], [2, 0, 0.4]], [[1, 15, 0.7], [2, 25, 0.4]], [[3, 20, 0.5], [0, 35, 0.3]], [[1, 15, 0.7], [4, 25, 0.5]], [[3, 20, 0.5], [1, 15, 0.7]], [[1, 0, 0.7], [0, 0, 0.3]], [[3, 0, 0.5], [2, 0, 0.4]], [[4, 0, 0.5], [3, 20, 0.5]], [[2, 0, 0.4], [0, 0, 0.3]]], [[[1, 15, 0.7], [0, 0, 0.3]], [[0, 35, 0.3], [2, 25, 0.4]], [[3, 0, 0.5], [0, 0, 0.3]], [[4, 0, 0.5], [2, 0, 0.4]], [[2, 0, 0.4], [1, 15, 0.7]], [[4, 25, 0.5], [0, 0, 0.3]], [[3, 0, 0.5], [2, 25, 0.4]], [[3, 0, 0.5], [4, 25, 0.5]], [[4, 25, 0.5], [1, 0, 0.7]], [[1, 15, 0.7], [3, 20, 0.5]]], [[[0, 0, 0.3], [2, 0, 0.4]], [[1, 15, 0.7], [3, 20, 0.5]], [[2, 25, 0.4], [1, 15, 0.7]], [[1, 15, 0.7], [0, 35, 0.3]], [[4, 0, 0.5], [3, 20, 0.5]], [[3, 20, 0.5], [0, 0, 0.3]], [[0, 35, 0.3], [4, 25, 0.5]], [[4, 25, 0.5], [1, 15, 0.7]], [[2, 0, 0.4], [3, 0, 0.5]], [[2, 25, 0.4], [4, 0, 0.5]]], [[[1, 15, 0.7], [3, 0, 0.5]], [[4, 25, 0.5], [1, 0, 0.7]], [[2, 0, 0.4], [1, 15, 0.7]], [[2, 0, 0.4], [3, 0, 0.5]], [[4, 25, 0.5], [0, 0, 0.3]], [[0, 0, 0.3], [2, 25, 0.4]], [[0, 0, 0.3], [3, 20, 0.5]], [[3, 0, 0.5], [4, 0, 0.5]], [[2, 0, 0.4], [4, 0, 0.5]], [[1, 0, 0.7], [0, 35, 0.3]]], [[[1, 15, 0.7], [4, 0, 0.5]], [[1, 0, 0.7], [3, 0, 0.5]], [[4, 0, 0.5], [0, 35, 0.3]], [[4, 25, 0.5], [2, 25, 0.4]], [[0, 0, 0.3], [2, 25, 0.4]], [[2, 0, 0.4], [1, 15, 0.7]], [[3, 0, 0.5], [0, 0, 0.3]], [[1, 0, 0.7], [0, 0, 0.3]], [[3, 20, 0.5], [2, 0, 0.4]], [[4, 0, 0.5], [3, 20, 0.5]]]];

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

var FractalGame = function () {

    /*
    * Initialize the class object
    *
    * @param {fracConfig} -
    * @param {day} -
    */
    function FractalGame(userConfig, fracConfig, day) {
        var _this = this;

        _classCallCheck(this, FractalGame);

        this.canvas = document.getElementById("thirdpartyCanvas");
        this.canvas.setAttribute('style', "background: black");

        // Design for 1024 * 768

        this.canvas.width = 1024 - 7;
        this.canvas.height = window.innerHeight > 768 ? 768 - 7 : window.innerHeight - 7;

        this.ctx = this.canvas.getContext("2d");
        this.offset = $('#thirdpartyCanvas').offset();

        this.clickDist = null; // distance to the center of the clicked fractal
        this.currentActiveIdx = -1;
        this.phase = 'welcome'; // 'welcome', 'probability', 'magnitude', 'oneOfTwo', 'oneOfFive'
        this.currentWinnings = 0;
        this.taskStep = 0;
        this.allResponses = [];
        this.timer = new Timer();
        this.timerStep = new Timer();
        this.ratingTimer = new Timer(); 
        this.resourcesToLoad = 1;
        // Produce a list of phaseToComplete
        var rewardBefore = Math.random() > 0.5 ? ["rateFeeling1", "probability", "magnitude"] : ["rateFeeling1", "magnitude", "probability"];
        var rewardAfter = Math.random() > 0.5 ? ["probability", "magnitude", "rateFeeling"] : ["magnitude", "probability", "rateFeeling"];
        this.phaseToComplete = rewardBefore.concat(["oneOfTwo", "oneOfFive"], rewardAfter); // Used in random order - probability or magnitude

        this.sound = new Audio(pathPrefix + "/fractals/sounds/keyclick.mp3");

        this.canClick = true; // For click/touch event, whether to process the

        // Rate feeling
        this.feelingXaxis = 512;
        this.doRating = false;
        this.feelingString = '+0';

        // Init and load images
        this.fractals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (fractal) {
            var img = new Image();
            img.src = pathPrefix + "/fractals/imgs/fractal" + fractal + ".png";

            return {
                image: img, // image object
                imgIdx: fractal, // image index
                magnitude: 0, // magnitude
                probability: 0, // probability
                magnitudeConfig: 0, // magnitude from config
                probabilityConfig: 0, // probability from config
                isActive: false,
                isVisible: true,
                width: 105, // display width
                height: 105, // display height
                x: null, // location x
                y: null // location y
            };
        });

        // Get the selected fractals from the given fracConfig
        this.todayConfig = fracConfig[day];
        // Get the selectedFrac from the frac_config
        this.selectedFrac = [];
        userConfig.forEach(function (config) {
            var fractal = _this.fractals[config[0]];
            fractal.magnitudeConfig = config[1];
            fractal.probabilityConfig = config[2];
            _this.selectedFrac.push(fractal);
        });
        // the continue button object
        this.continueBtn = {
            image: imgContinue,
            x: 409.5, // initial location x
            y: 500, // initial location y
            width: 205,
            height: 61
        };
    }

    /*
    * Create an array randomize function (using Fisher-Yates algorithm)
    *
    * @param {array} - an array to be shuffled
    * @return {array} - shuffled array
    */


    FractalGame.prototype.randomize = function randomize(array) {
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
    };

    /*
    * Check whether a click is inside 'rect'
    *
    * @param {pos} -
    * @param {rect} -
    * @return true/false
    */


    FractalGame.prototype.clickInRect = function clickInRect(pos, rect) {
        return pos.x > rect.x && rect.x + rect.width > pos.x && pos.y > rect.y && rect.y + rect.height > pos.y;
    };

    FractalGame.prototype.clearActive = function clearActive() {
        for (var _iterator = this.fractals, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var fractal = _ref;
            fractal.isActive = false;
        }
    };

    FractalGame.prototype.clickHander = function clickHander(pos) {
        var _this2 = this;

        this.sound.play();

        // Clear any active status
        this.clearActive();

        // Next button
        if (this.clickInRect(pos, this.continueBtn)) {
            // Event when user click
            if (this.phase === 'welcome') {
                this.phase = this.phaseToComplete[0];
                this.phaseToComplete.splice(0, 1);
                this.ratingTimer.start()
            
            } else if (this.phase === 'rateFeeling1') {

                // Add rating response
                this.allResponses.push({ feelingRate1: this.feelingString, day: thisConfig.day, time: this.ratingTimer.elapsed() });
                
                //Reset X axis 
                this.feelingXaxis = 512;
                this.feelingString = '+0'; 

                // go to next phase
                this.phase = this.phaseToComplete[0];
                this.phaseToComplete.splice(0, 1);
            
            } else if (this.phase === 'probability') {
                // Validation
                if (this.selectedFrac.some(function (f) {
                    return f.probability === 0;
                })) {
                    alert("Please guess a value for each fractal!");
                    return;
                }


                // Add response
                // console.log(this.selectedFrac)

                var chosen = [];
                for (var _iterator2 = this.selectedFrac, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
                    var _ref2;

                    if (_isArray2) {
                        if (_i2 >= _iterator2.length) break;
                        _ref2 = _iterator2[_i2++];
                    } else {
                        _i2 = _iterator2.next();
                        if (_i2.done) break;
                        _ref2 = _i2.value;
                    }

                    var f = _ref2;
                    console.log(f)
                    chosen.push({ Index: f.imgIdx, probability: f.probabilityConfig, magnitude: f.magnitudeConfig, guess: f.probability });
                }
                // Add response
                this.allResponses.push({ elapsed: this.timer.elapsed(), rtime: 0, taskName: "FRAC", code: "guess - probability", chosen: chosen });

                this.randomize(this.selectedFrac); // shuffle the selected fractals
                this.resetPos(); // reset selected fractals position

                // go to next phase
                this.phase = this.phaseToComplete[0];
                this.phaseToComplete.splice(0, 1);
            } else if (this.phase === 'magnitude') {
                // Validation
                if (this.selectedFrac.some(function (f) {
                    return f.magnitude == 0;
                })) {
                    alert("Please guess a value for each fractal!");
                    return;
                }

                // Add response
                // console.log(this,selectedFrac)
                var _chosen = [];
                for (var _iterator3 = this.selectedFrac, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
                    var _ref3;

                    if (_isArray3) {
                        if (_i3 >= _iterator3.length) break;
                        _ref3 = _iterator3[_i3++];
                    } else {
                        _i3 = _iterator3.next();
                        if (_i3.done) break;
                        _ref3 = _i3.value;
                    }

                    var _f = _ref3;
                    console.log(_f)

                    _chosen.push({ Index: _f.imgIdx, probability: _f.probabilityConfig, magnitude: _f.magnitudeConfig, guess: _f.magnitude });
                }
                // Add response
                this.allResponses.push({ elapsed: this.timer.elapsed(), rtime: 0, taskName: "FRAC", code: "guess - magnitude", chosen: _chosen });

                this.randomize(this.selectedFrac); // shuffle the selected fractals
                this.resetPos(); // reset selected fractals position

                // go to next phase
                this.phase = this.phaseToComplete[0];
                this.phaseToComplete.splice(0, 1);
                this.ratingTimer.start()
            } else if (this.phase === 'rateFeeling') {

                // Add rating response
                this.allResponses.push({ feelingRate: this.feelingString, time: this.ratingTimer.elapsed() });
                // Add Total response
                this.allResponses.push({ totalWinnings: this.currentWinnings });
                this.phase = "done";
            }
        }

        // Click fractal
        this.selectedFrac.forEach(function (fractal, idx) {
            if (_this2.clickInRect(pos, fractal)) {
                fractal.isActive = true;
                _this2.currentActiveIdx = idx;
                // click distance
                _this2.clickDist = pos.x - fractal.x;
            } else {
                fractal.isActive = false;
            }
        });

        // Display UI for different phases
        switch (this.phase) {
            case 'probability':
            case 'magnitude':
                this.reward(this.phase);break;
            case 'oneOfTwo':
                this.oneOfTwo(pos);break;
            case 'oneOfFive':
                this.oneOfFive();break;
            case 'rateFeeling':
                var arrow = { x: this.feelingXaxis - 15, y: 300, width: 30, height: 40 };
                this.doRating = this.clickInRect(pos, arrow) ? true : false;
                this.rateFeeling();break;
            case 'rateFeeling1':
                var arrow = { x: this.feelingXaxis - 15, y: 300, width: 30, height: 40 };
                this.doRating = this.clickInRect(pos, arrow) ? true : false;
                this.rateFeeling();break;
            case 'done':
                this.end();break;
        }
    };

    FractalGame.prototype.start = function start() {
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

        // The Instructions text
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = "24px Georgia";
        this.ctx.textAlign = "left";
        this.ctx.fillText('Fractals', 60, 110);
        this.ctx.fillText('Each of the fractals you will encounter is worth a given number of points, but ', 60, 180);
        this.ctx.fillText('also has a certain likelihood of paying out. The fractals and their associated ', 60, 215);
        this.ctx.fillText('points/likelihood are the same every day.', 60, 250);
        this.ctx.fillText('Tap on a fractal to select it. ', 60, 330);
        // Draw continue button on the first page
        this.ctx.drawImage(this.continueBtn.image, this.continueBtn.x, this.continueBtn.y);

        this.timer.start();

        // event for mouse
        var self = this;
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

    FractalGame.prototype.resetPos = function resetPos() {
        for (var i = 0; i < 5; i++) {
            var fractal = this.selectedFrac[i];
            fractal.x = 10;
            fractal.y = i * 120 + 10;
            this.selectedFrac[i].magnitude = 0;
            this.selectedFrac[i].probability = 0;

        }
    };

    /*
    * Used for participant to guess the probability or magnitude
    *
    * @param {mode} - either 'probability' or 'magnitude'
    */


    FractalGame.prototype.reward = function reward(mode) {
        // Step 1: clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Step 2: Draw slider for reward magnitude
        // The yellow slider bar
        this.ctx.fillStyle = "#FFFF00";
        // Fractal width is 67.5
        this.ctx.fillRect(67.5, 600, this.canvas.width - 135, 10);
        // Text
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = "20px Georgia";
        this.ctx.textBaseline = "bottom";
        // Display '0' or '0%'
        var textLeft = mode === 'magnitude' ? '0' : '0%';
        this.ctx.fillText(textLeft, 60, 635);
        // Display '50' or '100%'
        var textRight = mode === 'magnitude' ? '50' : '100%';
        this.ctx.textAlign = "right";
        this.ctx.fillText(textRight, this.canvas.width - 60, 635);
        // Display 'Reward magnitude'
        this.ctx.textAlign = "center";
        this.ctx.fillText("Reward " + mode, this.canvas.width / 2, 635);

        // Step 3: Continue button
        this.continueBtn.x = this.canvas.width - 67.5 - this.continueBtn.width;
        this.continueBtn.y = 545;
        this.ctx.drawImage(this.continueBtn.image, this.continueBtn.x, this.continueBtn.y);

        /*
        * Draw the selected 5 fractals
        */

        for (var i = 0; i < 5; i++) {
            var fractal = this.selectedFrac[i];
            fractal.width = 105;fractal.height = 105;
            if (!fractal.x) {
                fractal.x = 10;
            }
            fractal.y = i * 110 + 8;

            // Now we draw the image
            this.ctx.drawImage(fractal.image, fractal.x, fractal.y, fractal.width, fractal.height);
            // Highlight this fractal when it has been selected by mousedown or touchdown
            if (fractal.isActive) {
                var reward = fractal[this.phase];
                    // console.log(reward)
                    // console.log(this.phase)
                    // console.log(fractal)

                if (this.phase === 'probability') {
                    reward = Math.floor(reward * 100) + '%';
                } 
                // Draw a red outline
                this.ctx.strokeStyle = "rgb(255, 0, 0)";
                this.ctx.lineWidth = 8;
                this.ctx.strokeRect(fractal.x, fractal.y, fractal.width, fractal.height);
                // Display current reward
                this.ctx.fillStyle = "#000000";
                this.ctx.fillRect(fractal.x + fractal.width / 4, fractal.y + fractal.height / 3, 57.53, 38);

                this.ctx.fillStyle = "#FFFFFF";
                this.ctx.font = "26px Georgia";
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = "middle";
                this.ctx.fillText(reward, fractal.x + fractal.width / 2, fractal.y + fractal.height / 2);
                // Draw an arrow
                this.ctx.strokeStyle = "#FFFF00";
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(fractal.x + fractal.width / 2, 620);
                this.ctx.lineTo(fractal.x + fractal.width / 2 - 5, 640);
                this.ctx.lineTo(fractal.x + fractal.width / 2 + 5, 640);
                this.ctx.lineTo(fractal.x + fractal.width / 2, 620);
                this.ctx.stroke();

                this.ctx.fillStyle = "#FFFFFF";
                this.ctx.font = "22px Georgia";
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = "middle";
                this.ctx.fillText(reward, fractal.x + fractal.width / 2, 653);
            }
        }
    };

    FractalGame.prototype.oneOfTwo = function oneOfTwo(pos) {
        var _this3 = this;

        if (!this.canClick) {
            return;
        }

        // Change to next phase if step has got 10
        if (this.taskStep >= 10) {
            this.phase = 'oneOfFive';
            return;
        }

        // Clear everything
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Get the current question from today config
        var q = this.todayConfig[this.taskStep];

        // Left fractal
        var left = this.selectedFrac[q[0][0]];
        left.magnitude = q[0][1];
        left.probability = q[0][2];
        left.x = 250;left.y = 250;
        left.height = 170;left.width = 170;
        this.ctx.drawImage(left.image, left.x, left.y, left.width, left.height);

        // Right fractal
        var right = this.selectedFrac[q[1][0]];
        right.magnitude = q[1][1];
        right.probability = q[1][2];
        right.x = 600;right.y = 250;
        right.height = 170;right.width = 170;
        this.ctx.drawImage(right.image, right.x, right.y, right.width, right.height);
        // Setup timmer for step
        if (this.timerStep.currentStep !== this.taskStep) {
            this.timerStep.start();
            this.timerStep.currentStep = this.taskStep;
        }

        if (pos !== undefined) {
            [left, right].forEach(function (fractal, idx) {
                if (_this3.clickInRect(pos, fractal)) {
                    fractal.isActive = true;
                    _this3.currentActiveIdx = idx;
                    // click distance
                    _this3.clickDist = pos.x - fractal.x;
                } else {
                    fractal.isActive = false;
                }
            });
        }

        var selected = [left, right].some(function (fractal) {
            return fractal.isActive;
        });

        if (selected) {
            [left, right].forEach(function (fractal) {
                if (fractal.isActive) {
                    // Draw a red outline
                    _this3.ctx.strokeStyle = "rgb(255, 0, 0)";
                    _this3.ctx.lineWidth = 10;
                    _this3.ctx.strokeRect(fractal.x, fractal.y, fractal.width, fractal.height);
                    // Adding up the magnitude
                    _this3.currentWinnings += fractal.magnitude;
                }
                // Black background
                _this3.ctx.fillStyle = "#000000";
                _this3.ctx.fillRect(fractal.x + fractal.width / 3, fractal.y + fractal.height / 3, 57, 57);
                // Display magnitude
                _this3.ctx.fillStyle = "#FFFFFF";
                _this3.ctx.font = "26px Georgia";
                _this3.ctx.textAlign = 'center';
                _this3.ctx.textBaseline = "middle";
                _this3.ctx.fillText("+" + fractal.magnitude, fractal.x + fractal.width / 2, fractal.y + fractal.height / 2);
            });
            // Add response
            this.allResponses.push({
                taskName: 'FRAC',
                elapsed: this.timer.elapsed(),
                rtime: this.timerStep.elapsed(),
                chosen: left.isActive ? 'L' : 'R',
                L: { Index: left.imgIdx, Reward: left.magnitude, Prob: left.probability },
                R: { Index: right.imgIdx, Reward: right.magnitude, Prob: right.probability }
            });

            // Increase the step
            this.taskStep++;
            this.canClick = false; // Prevent user click
            // Keep a copy of this scope and run
            var self = this;
            if (this.taskStep < 10) {
                setTimeout(function () {
                    self.canClick = true;self.clearActive();self.oneOfTwo();
                }, 3000);
            } else {
                // After 10 rounds, go to oneOfFive
                setTimeout(function () {
                    self.phase = 'oneOfFive';self.phaseToComplete.splice(0, 1);self.taskStep = 0;self.canClick = true;self.oneOfFive();
                }, 3000);
            }
        }

        // display current winning
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = "40px Georgia";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("Current Winnings: " + this.currentWinnings, this.canvas.width / 2, 80);
        this.ctx.font = "80px Georgia";
        this.ctx.fillText("?", this.canvas.width / 2, 320);
    };

    FractalGame.prototype.oneOfFive = function oneOfFive() {

        if (!this.canClick) {
            return;
        }

        // clear everything
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (var i = 0; i < 5; i++) {
            var fractal = this.selectedFrac[i];
            fractal.width = 170;fractal.height = 170;
            switch (i) {
                case 0:
                    fractal.x = 300;fractal.y = 90;
                    break;
                case 1:
                    fractal.x = 544;fractal.y = 90;
                    break;
                case 2:
                    fractal.x = 200;fractal.y = 290;
                    break;
                case 3:
                    fractal.x = 645;fractal.y = 290;
                    break;
                case 4:
                    fractal.x = 427;fractal.y = 490;
                    break;
            }
            // Use magnitude and probability from config instead
            fractal.magnitude = fractal.magnitudeConfig;
            fractal.probability = fractal.probabilityConfig;

            this.ctx.drawImage(fractal.image, fractal.x, fractal.y, fractal.width, fractal.height);
            // Setup timmer for current step
            if (this.timerStep.currentStep !== this.taskStep) {
                this.timerStep.start();
                this.timerStep.currentStep = this.taskStep;
            }

            if (fractal.isActive) {
                // Draw a red outline
                this.ctx.strokeStyle = "rgb(255, 0, 0)";
                this.ctx.lineWidth = 10;
                this.ctx.strokeRect(fractal.x, fractal.y, fractal.width, fractal.height);
                // Black background
                this.ctx.fillStyle = "#000000";
                this.ctx.fillRect(fractal.x + fractal.width / 3, fractal.y + fractal.height / 3, 57, 57);
                // Display magnitude
                this.ctx.fillStyle = "#FFFFFF";
                this.ctx.font = "26px Georgia";
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = "middle";
                this.ctx.fillText("+" + fractal.magnitude, fractal.x + fractal.width / 2, fractal.y + fractal.height / 2);
                // Adding up the magnitude
                this.currentWinnings += fractal.magnitude;
                // Add response
                this.allResponses.push({
                    taskName: 'FRAC',
                    elapsed: this.timer.elapsed(),
                    rtime: this.timerStep.elapsed(),
                    chosen: {
                        Index: fractal.imgIdx,
                        Magnitude: fractal.magnitude,
                        Probability: fractal.probability
                    }
                });

                // Increase the step
                this.taskStep++;
                this.canClick = false; // Prevent user click
                // Keep a copy of this scope and run
                var self = this;
                if (this.taskStep < 5) {
                    setTimeout(function () {
                        self.canClick = true;self.randomize(self.selectedFrac);self.clearActive();self.oneOfFive();
                    }, 3000);
                } else {
                    // After 10 rounds, go to oneOfFive
                    setTimeout(function () {
                        self.phase = self.phaseToComplete[0];
                        self.taskStep = 0;self.canClick = true;
                        self.resetPos();
                        self.reward(self.phaseToComplete[0]);
                        self.phaseToComplete.splice(0, 1);
                    }, 3000);
                }
            }
        }

        // display current winning
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = "40px Georgia";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("Current Winnings: " + this.currentWinnings, this.canvas.width / 2, 45);
        this.ctx.font = "80px Georgia";
        this.ctx.fillText("?", this.canvas.width / 2, 400);
    };

    FractalGame.prototype.rateFeeling = function rateFeeling() {
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

    FractalGame.prototype.mouseDown = function mouseDown(ev) {
        var pos = { x: ev.pageX - this.offset.left, y: ev.pageY - this.offset.top };
        this.clickHander(pos);
    };

    FractalGame.prototype.touchStart = function touchStart() {
        var pos = { x: event.targetTouches[0].pageX - this.offset.left, y: event.targetTouches[0].pageY - this.offset.top };
        this.clickHander(pos);
    };

    FractalGame.prototype.mouseUp = function mouseUp(ev) {
        for (var _iterator4 = this.selectedFrac, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
            var _ref4;

            if (_isArray4) {
                if (_i4 >= _iterator4.length) break;
                _ref4 = _iterator4[_i4++];
            } else {
                _i4 = _iterator4.next();
                if (_i4.done) break;
                _ref4 = _i4.value;
            }

            var fractal = _ref4;
            fractal.isActive = false;
        }
        this.currentActiveIdx = -1;
        this.clickDist = null;
        this.doRating = false;
    };

    FractalGame.prototype.touchEnd = function touchEnd() {
        for (var _iterator5 = this.selectedFrac, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
            var _ref5;

            if (_isArray5) {
                if (_i5 >= _iterator5.length) break;
                _ref5 = _iterator5[_i5++];
            } else {
                _i5 = _iterator5.next();
                if (_i5.done) break;
                _ref5 = _i5.value;
            }

            var fractal = _ref5;
            fractal.isActive = false;
        }
        this.currentActiveIdx = -1;
        this.clickDist = null;
        this.doRating = false;
    };

    FractalGame.prototype.moveHandler = function moveHandler(pos) {
        // Move the active fractal
        if (this.currentActiveIdx !== -1) {

            var newPos = pos.x - this.clickDist;
            if (newPos < 10) {
                newPos = 10;
            }
            if (newPos >= this.canvas.width - 125) {
                newPos = this.canvas.width - 125;
            }
            // Move position
            this.selectedFrac[this.currentActiveIdx].x = newPos;
            // Update Reward
            var score = this.phase === 'probability' ? 100 : 50;
            var value = Math.floor(score * (this.selectedFrac[this.currentActiveIdx].x - 10) / (this.canvas.width - 135));
            this.selectedFrac[this.currentActiveIdx][this.phase] = this.phase === 'probability' ? value / 100 : value;
        }

        if (this.phase === 'rateFeeling' && this.doRating || this.phase === 'rateFeeling1' && this.doRating) {
            if (pos.x > 290 && pos.x < 734) {
                this.feelingXaxis = pos.x;
                this.rateFeeling();
            }
        }

        if (this.phase === 'probability' || this.phase === 'magnitude') {
            this.reward(this.phase);
        }
    };

    FractalGame.prototype.mouseMove = function mouseMove(ev) {
        var pos = { x: ev.pageX - this.offset.left, y: ev.pageY - this.offset.top };
        this.moveHandler(pos);
    };

    FractalGame.prototype.touchMove = function touchMove() {
        var pos = { x: event.targetTouches[0].pageX - this.offset.left, y: event.targetTouches[0].pageY - this.offset.top };
        this.moveHandler(pos);
    };

    FractalGame.prototype.end = function end() {
        // increase day
        thisConfig.day++;
        // then only update day
        finishScript(this.allResponses, {
            day: thisConfig.day,
            user_frac_config: thisConfig.user_frac_config,
            updateOnly: true // only update the specific variables
        });
    };

    return FractalGame;
}();

function runScript() {

    if (typeof thisConfig === 'undefined' || typeof thisConfig.day === 'undefined') {
        thisConfig = { day: 0 };
    }

    // Create a user_frac_config at the first time or when it is not available
    if (typeof thisConfig === 'undefined' || typeof thisConfig.user_frac_config === 'undefined') {
        thisConfig.user_frac_config = create_user_frac_config();
    }


    var game = new FractalGame(thisConfig.user_frac_config, global_frac_config, thisConfig.day);

    imgContinue.onload = function () {
        game.start();
    };
}

// At the first time, produce user_frac_config
function create_user_frac_config() {

    var rewards = [35, 15, 25, 20, 25];
    var probs = [0.3, 0.7, 0.4, 0.5, 0.5];

    var fractals = 5;

    var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffle(arr);

    arr = arr.slice(0, 5);

    var user_frac_config = [];

    for (var i = 0; i < fractals; i++) {
        user_frac_config.push([arr[i], rewards[i], probs[i]]);
    }

    return user_frac_config;
}

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