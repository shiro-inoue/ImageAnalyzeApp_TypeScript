"use strict";
var IMAGE_WIDHT = 320;
var IMAGE_HEIGHT = 240;
var COLOR_RANGE = 256;
var PIXEL_TOTAL = IMAGE_WIDHT * IMAGE_HEIGHT;
var HISTGRAM_COLOR = [
    "rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)",
    "rgb(0, 255, 255)", "rgb(255, 0, 255)", "rgb(128, 128, 128)",
    "rgb(128, 128, 128)", "rgb(0, 0, 255)", "rgb(255, 0, 0)"
]; //YUV
var SELECT_RANGE_STATE = { NONE: 0, SELECTING: 1, SELECTED: 2 };
var selectRangeState = SELECT_RANGE_STATE.NONE;
var firstPosX = 0;
var firstPosY = 0;
var secondPosX = IMAGE_WIDHT - 1;
var secondPosY = IMAGE_HEIGHT - 1;
var COLOR = { R: 0, G: 1, B: 2 };
var toneArrR = new Array(COLOR_RANGE);
var toneArrG = new Array(COLOR_RANGE);
var toneArrB = new Array(COLOR_RANGE);
var compArr = new Array(toneArrR, toneArrG, toneArrB);
var imageData;
