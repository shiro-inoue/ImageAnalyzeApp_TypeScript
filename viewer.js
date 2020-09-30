"use strict";
function clearSelectRect() {
    var cvs = document.getElementById('baseImgOverlayer');
    var ctx = cvs.getContext('2d');
    ctx.clearRect(0, 0, cvs.clientWidth, cvs.clientHeight);
}
function clearPixelColor() {
    document.getElementById("imageLocation").innerHTML = "";
    document.getElementById("pixelColor").innerHTML = "";
}
function clearSelectRange() {
    selectRangeState = SELECT_RANGE_STATE.NONE;
    clearSelectRect();
}
function readImg() {
    var reader = new FileReader();
    var fileSelect = document.getElementById("fileSelect");
    var cvs = document.getElementById("baseImg");
    var ctx = cvs.getContext("2d");
    var img = new Image();
    if (fileSelect.files.length == 0) {
        return;
    }
    reader.onloadend = function () {
        img.onload = function () {
            ctx.drawImage(img, 0, 0, cvs.clientWidth, cvs.clientHeight);
            imageData = ctx.getImageData(0, 0, IMAGE_WIDHT, IMAGE_HEIGHT);
        };
        img.src = reader.result;
    };
    reader.readAsDataURL(fileSelect.files[0]);
    document.getElementById("colorFormat").disabled = false;
    document.getElementById("binNumberId").disabled = false;
    document.getElementById("colorPix").disabled = false;
    document.getElementById("analysisImg").disabled = false;
    document.getElementById("selectRect").disabled = false;
}
function clickBaseImg(event) {
    if (isOperationTypeColorPix()) {
        var cvs = document.getElementById("baseImg");
        var ctx = cvs.getContext("2d");
        var pixelData = ctx.getImageData(event.offsetX, event.offsetY, 1, 1);
        var colorFormat = document.getElementById("colorFormat").value;
        var colorFormat1 = colorFormat.substr(0, 1);
        var colorFormat2 = colorFormat.substr(1, 1);
        var colorFormat3 = colorFormat.substr(2, 1);
        var formatedData = [0, 0, 0];
        switch (colorFormat) {
            case "RGB":
                // formatedData = pixelData.data;
                formatedData[0] = pixelData.data[0];
                formatedData[1] = pixelData.data[1];
                formatedData[2] = pixelData.data[2];
                break;
            case "HSV":
                RGB2HSV(formatedData, pixelData.data[0], pixelData.data[1], pixelData.data[2]);
                break;
            case "YUV":
                RGB2YUV(formatedData, pixelData.data[0], pixelData.data[1], pixelData.data[2]);
                break;
            default:
        }
        document.getElementById("imageLocation").innerHTML = "X:" + event.offsetX + ","
            + "Y:" + event.offsetY;
        document.getElementById("pixelColor").innerHTML = colorFormat1 + ":" + formatedData[0] + ", "
            + colorFormat2 + ":" + formatedData[1] + ", "
            + colorFormat3 + ":" + formatedData[2];
    }
    else {
        if (selectRangeState == SELECT_RANGE_STATE.SELECTING) {
            selectRangeState = SELECT_RANGE_STATE.SELECTED;
        }
        else {
            firstPosX = event.offsetX;
            firstPosY = event.offsetY;
            selectRangeState = SELECT_RANGE_STATE.SELECTING;
        }
    }
}
function drawRectOnBaseImg(event) {
    if (selectRangeState == SELECT_RANGE_STATE.SELECTING) {
        var cvs = document.getElementById('baseImgOverlayer');
        var ctx = cvs.getContext('2d');
        ctx.clearRect(0, 0, cvs.clientWidth, cvs.clientHeight);
        secondPosX = event.offsetX;
        secondPosY = event.offsetY;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(0, 0, 255)";
        ctx.strokeRect(Math.min(firstPosX, secondPosX), Math.min(firstPosY, secondPosY), Math.abs(secondPosX - firstPosX), Math.abs(secondPosY - firstPosY));
    }
}
function drawHistgram() {
    var cvs = document.getElementById("histgramImgId");
    var binNumber = document.getElementById("binNumberId").value;
    var colorFormatSelectedIdx = document.getElementById("colorFormat").selectedIndex;
    for (var histgramIndex = 0; histgramIndex < cvs.children.length; histgramIndex++) {
        var ctx = cvs.children[histgramIndex].getContext('2d');
        ctx.clearRect(0, 0, cvs.children[histgramIndex].clientWidth, cvs.children[histgramIndex].clientHeight);
        if (document.getElementById("binNumberId").value == COLOR_RANGE.toString()) {
            clearSelectRange();
            continue;
        }
        ctx.fillStyle = HISTGRAM_COLOR[colorFormatSelectedIdx * 3 + histgramIndex];
        var binArr = new Array(3);
        makeBinCount(binArr, histgramIndex, binNumber);
        drawCompHistgram(ctx, binArr, parseInt(binNumber));
    }
}
function drawCompHistgram(ctx, binArr, binNumber) {
    var binHeight;
    var binWidth = IMAGE_WIDHT / binNumber;
    var pixelTotalRect;
    var operationType = document.getElementById("operationTypeId").operationType.value;
    if (operationType == "selectRect") {
        if (selectRangeState == SELECT_RANGE_STATE.SELECTED) {
            pixelTotalRect = Math.abs(secondPosX - firstPosX) * Math.abs(secondPosY - firstPosY);
        }
        else {
            pixelTotalRect = PIXEL_TOTAL;
            clearSelectRange();
        }
    }
    else {
        pixelTotalRect = PIXEL_TOTAL;
    }
    for (var i = 0; i <= binNumber; i++) {
        binHeight = Math.floor((binArr[i] / pixelTotalRect) * IMAGE_HEIGHT);
        ctx.fillRect(i * binWidth, (IMAGE_HEIGHT - binHeight), binWidth, binHeight);
    }
}
