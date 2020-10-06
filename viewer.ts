function clearSelectRect() {
    let cvs: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('baseImgOverlayer');
    let ctx: CanvasRenderingContext2D = cvs.getContext('2d')!;
    ctx.clearRect(0, 0, cvs.clientWidth, cvs.clientHeight);
}

function clickSelectRange() {
    clearPixelColor();
    adjustmentGradationCombobox();
}

function clearPixelColor() {
    document.getElementById("imageLocation")!.innerHTML = "";
    document.getElementById("pixelColor")!.innerHTML = "";
}

function clearSelectRange() {
    selectRangeState = SELECT_RANGE_STATE.NONE;
    clearSelectRect();
}

function readImg() {

    const reader: FileReader = new FileReader();
    const fileSelect: HTMLInputElement = <HTMLInputElement>document.getElementById("fileSelect");
    const cvs: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("baseImg");
    let ctx: CanvasRenderingContext2D = cvs.getContext("2d")!;
    let img: HTMLImageElement = new Image();

    if (fileSelect.files!.length == 0) {
        return;
    }
    reader.onloadend = () => {
        img.onload = () => {
            ctx.drawImage(img, 0, 0, cvs.clientWidth, cvs.clientHeight);
            imageData = ctx.getImageData(0, 0, IMAGE_WIDHT, IMAGE_HEIGHT);

        }
        img.src = <string>reader.result;
    }
    reader.readAsDataURL(fileSelect.files![0]);

    (<HTMLSelectElement>document.getElementById("colorFormat")).disabled = false;
    (<HTMLSelectElement>document.getElementById("binNumberId")).disabled = false;
    (<HTMLInputElement>document.getElementById("colorPix")).disabled = false;
    (<HTMLInputElement>document.getElementById("analysisImg")).disabled = false;
    (<HTMLInputElement>document.getElementById("selectRect")).disabled = false;
}

function clickBaseImg(event: { offsetX: number; offsetY: number; }) {
    if (isOperationTypeColorPix()) {
        const cvs: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("baseImg");
        let ctx: CanvasRenderingContext2D = cvs.getContext("2d")!;
        let pixelData: ImageData = ctx.getImageData(event.offsetX, event.offsetY, 1, 1);
        let colorFormat: string = (<HTMLSelectElement>document.getElementById("colorFormat")).value;
        let colorFormat1: string = colorFormat.substr(0, 1);
        let colorFormat2: string = colorFormat.substr(1, 1);
        let colorFormat3: string = colorFormat.substr(2, 1);
        let formatedData: number[] = [0, 0, 0];

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
        document.getElementById("imageLocation")!.innerHTML = "X:" + event.offsetX + ","
            + "Y:" + event.offsetY;
        document.getElementById("pixelColor")!.innerHTML = colorFormat1 + ":" + formatedData[0] + ", "
            + colorFormat2 + ":" + formatedData[1] + ", "
            + colorFormat3 + ":" + formatedData[2];
    } else {
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

function drawRectOnBaseImg(event: { offsetX: number; offsetY: number; }) {
    if (selectRangeState == SELECT_RANGE_STATE.SELECTING) {
        let cvs: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('baseImgOverlayer');
        let ctx: CanvasRenderingContext2D = cvs.getContext('2d')!;

        ctx.clearRect(0, 0, cvs.clientWidth, cvs.clientHeight);
        secondPosX = event.offsetX;
        secondPosY = event.offsetY;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(0, 0, 255)";
        ctx.strokeRect(
            Math.min(firstPosX, secondPosX),
            Math.min(firstPosY, secondPosY),
            Math.abs(secondPosX - firstPosX),
            Math.abs(secondPosY - firstPosY));
    }
}

function drawHistgram() {
    let cvs = document.getElementById("histgramImgId")!;
    let binNumber: string = (<HTMLSelectElement>document.getElementById("binNumberId")).value;
    let colorFormatSelectedIdx: number = (<HTMLSelectElement>document.getElementById("colorFormat")).selectedIndex;

    for (let histgramIndex = 0; histgramIndex < cvs.children.length; histgramIndex++) {
        let ctx: CanvasRenderingContext2D = (<HTMLCanvasElement>cvs.children[histgramIndex]).getContext('2d')!;

        ctx.clearRect(0, 0, cvs.children[histgramIndex].clientWidth,
            cvs.children[histgramIndex].clientHeight);

        if ((<HTMLSelectElement>document.getElementById("binNumberId")).value == COLOR_RANGE.toString()) {
            clearSelectRange();
            continue;
        }

        ctx.fillStyle = HISTGRAM_COLOR[colorFormatSelectedIdx * 3 + histgramIndex];

        let binArr: number[] = new Array(3);
        makeBinCount(binArr, histgramIndex, binNumber);

        drawCompHistgram(ctx, binArr, parseInt(binNumber));

    }
}

function drawCompHistgram(ctx: CanvasRenderingContext2D, binArr: number[], binNumber: number) {
    let binHeight: number;
    let binWidth: number = IMAGE_WIDHT / binNumber;
    let pixelTotalRect: number;
    let operationType = (<HTMLFormElement>document.getElementById("operationTypeId")).operationType.value;

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

    for (let i = 0; i <= binNumber; i++) {
        binHeight = Math.floor((binArr[i] / pixelTotalRect) * IMAGE_HEIGHT);
        ctx.fillRect(
            i * binWidth,
            (IMAGE_HEIGHT - binHeight),
            binWidth,
            binHeight);
    }
}

function selectBinNumber() {
    adjustmentGradationCombobox();
}

function adjustmentGradationCombobox() {
    var element = <HTMLFormElement>document.getElementById("operationTypeId");
    var radioNodeList = element.operationType;
    var value = radioNodeList.value;

    if (value === "colorPix") {
        return;
    }

    if ((<HTMLFormElement>document.getElementById("formComboboxes")).binNumberId.selectedIndex === 0) {
        (<HTMLFormElement>document.getElementById("formComboboxes")).binNumberId.selectedIndex = 1;
    }
}
