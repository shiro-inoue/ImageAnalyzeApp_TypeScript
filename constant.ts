const IMAGE_WIDHT: number = 320;
const IMAGE_HEIGHT: number = 240;
const COLOR_RANGE: number = 256;
const PIXEL_TOTAL: number = IMAGE_WIDHT * IMAGE_HEIGHT;
const HISTGRAM_COLOR: string[] = [
    "rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)", //RGB
    "rgb(0, 255, 255)", "rgb(255, 0, 255)", "rgb(128, 128, 128)",  //HSV
    "rgb(128, 128, 128)", "rgb(0, 0, 255)", "rgb(255, 0, 0)"];  //YUV
const SELECT_RANGE_STATE = { NONE: 0, SELECTING: 1, SELECTED: 2 };

let selectRangeState: number = SELECT_RANGE_STATE.NONE;
let firstPosX: number = 0;
let firstPosY: number = 0;
let secondPosX: number = IMAGE_WIDHT - 1;
let secondPosY: number = IMAGE_HEIGHT - 1;

let COLOR = { R: 0, G: 1, B: 2 };

let toneArrR: number[] = new Array(COLOR_RANGE);
let toneArrG: number[] = new Array(COLOR_RANGE);
let toneArrB: number[] = new Array(COLOR_RANGE);

let compArr = new Array(toneArrR, toneArrG, toneArrB);
let imageData: ImageData;
