function analysisImg() {
    const fileSelect: HTMLInputElement = <HTMLInputElement>document.getElementById("fileSelect");
    if (fileSelect.files!.length == 0) {
        return;
    }
    let colorFormat: HTMLSelectElement = <HTMLSelectElement>document.getElementById('colorFormat');

    switch (colorFormat.value) {
        case "RGB":
            analysisRGB();
            break;
        case "HSV":
            analysisHSV();
            break;
        case "YUV":
            analysisYUV();
            break;
        default:
    }
    drawHistgram();
}

function analysisRGB() {
    const rCvs: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("colorComponent1Img");
    const gCvs: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("colorComponent2Img");
    const bCvs: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("colorComponent3Img");
    let binNumberId: HTMLSelectElement = <HTMLSelectElement>document.getElementById('binNumberId');
    let rCtx: CanvasRenderingContext2D = rCvs.getContext("2d")!;
    let gCtx: CanvasRenderingContext2D = gCvs.getContext("2d")!;
    let bCtx: CanvasRenderingContext2D = bCvs.getContext("2d")!;
    let rDst: ImageData = rCtx.createImageData(IMAGE_WIDHT, IMAGE_HEIGHT);
    let gDst: ImageData = gCtx.createImageData(IMAGE_WIDHT, IMAGE_HEIGHT);
    let bDst: ImageData = bCtx.createImageData(IMAGE_WIDHT, IMAGE_HEIGHT);

    for (let i = 0; i < toneArrR.length; ++i) {
        compArr[COLOR.R][i] = 0;
        compArr[COLOR.G][i] = 0;
        compArr[COLOR.B][i] = 0;
    }

    for (let i = 0; i < imageData.data.length; i = i + 4) {
        let rgbArr = new Array();

        calcTone(rgbArr, imageData.data[i], imageData.data[i + 1], imageData.data[i + 2], binNumberId.value, false);

        // R成分
        rDst.data[i] = rgbArr[COLOR.R];
        rDst.data[i + 1] = rDst.data[i + 2] = 0
        rDst.data[i + 3] = imageData.data[i + 3]

        // G成分
        gDst.data[i + 1] = rgbArr[COLOR.G];
        gDst.data[i] = gDst.data[i + 2] = 0
        gDst.data[i + 3] = imageData.data[i + 3]

        // B成分
        bDst.data[i + 2] = rgbArr[COLOR.B];
        bDst.data[i] = bDst.data[i + 1] = 0
        bDst.data[i + 3] = imageData.data[i + 3]

        calcHistogram(i);
    }

    rCtx.putImageData(rDst, 0, 0)
    gCtx.putImageData(gDst, 0, 0)
    bCtx.putImageData(bDst, 0, 0)

}

function analysisHSV() {
    let binNumberId: HTMLSelectElement = <HTMLSelectElement>document.getElementById('binNumberId');
    const rCvs: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("colorComponent1Img");
    const gCvs: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("colorComponent2Img");
    const bCvs: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("colorComponent3Img");
    let rCtx: CanvasRenderingContext2D = rCvs.getContext("2d")!;
    let gCtx: CanvasRenderingContext2D = gCvs.getContext("2d")!;
    let bCtx: CanvasRenderingContext2D = bCvs.getContext("2d")!;
    let rDst: ImageData = rCtx.createImageData(IMAGE_WIDHT, IMAGE_HEIGHT);
    let gDst: ImageData = gCtx.createImageData(IMAGE_WIDHT, IMAGE_HEIGHT);
    let bDst: ImageData = bCtx.createImageData(IMAGE_WIDHT, IMAGE_HEIGHT);

    for (let i = 0; i < toneArrR.length; ++i) {
        compArr[COLOR.R][i] = 0;
        compArr[COLOR.G][i] = 0;
        compArr[COLOR.B][i] = 0;
    }

    let H: number = 0;
    let S: number = 0;
    let V: number = 0;
    let workH: number = 0;
    let workS: number = 0;
    let workV: number = 0;
    let R: number = 0;
    let G: number = 0;
    let B: number = 0;

    for (let i = 0; i < imageData.data.length; i = i + 4) {
        let formatedData = [0, 0, 0];

        R = imageData.data[i];
        G = imageData.data[i + 1];
        B = imageData.data[i + 2];

        RGB2HSV(formatedData, R, G, B);
        H = formatedData[0];
        S = formatedData[1];
        V = formatedData[2];

        let hsvArr: number[] = new Array(3);
        calcTone(hsvArr, H, S, V, binNumberId.value, true);

        H = hsvArr[0];
        S = hsvArr[1];
        V = hsvArr[2];

        workH = H;
        workS = 255;
        workV = 255;

        let rgbArr: number[] = new Array(3);
        HSV2RGB(rgbArr, workH, workS, workV);
        rDst.data[i] = rgbArr[0];
        rDst.data[i + 1] = rgbArr[1];
        rDst.data[i + 2] = rgbArr[2];
        rDst.data[i + 3] = imageData.data[i + 3];

        workH = 0;
        workS = S;
        workV = 255;

        HSV2RGB(rgbArr, workH, workS, workV);
        gDst.data[i] = rgbArr[0];
        gDst.data[i + 1] = rgbArr[1];
        gDst.data[i + 2] = rgbArr[2];
        gDst.data[i + 3] = imageData.data[i + 3];

        rgbArr[0] = V;
        rgbArr[1] = V;
        rgbArr[2] = V;

        bDst.data[i] = rgbArr[0];
        bDst.data[i + 1] = rgbArr[1];
        bDst.data[i + 2] = rgbArr[2];
        bDst.data[i + 3] = imageData.data[i + 3];

        calcHistogram(i);

    }
    rCtx.putImageData(rDst, 0, 0);
    gCtx.putImageData(gDst, 0, 0);
    bCtx.putImageData(bDst, 0, 0);
}

function analysisYUV() {
    let binNumberId: HTMLSelectElement = <HTMLSelectElement>document.getElementById('binNumberId');
    const rCvs: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("colorComponent1Img");
    const gCvs: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("colorComponent2Img");
    const bCvs: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("colorComponent3Img");
    let rCtx: CanvasRenderingContext2D = <CanvasRenderingContext2D>rCvs.getContext("2d");
    let gCtx: CanvasRenderingContext2D = <CanvasRenderingContext2D>gCvs.getContext("2d");
    let bCtx: CanvasRenderingContext2D = <CanvasRenderingContext2D>bCvs.getContext("2d");
    let rDst: ImageData = rCtx.createImageData(IMAGE_WIDHT, IMAGE_HEIGHT);
    let gDst: ImageData = gCtx.createImageData(IMAGE_WIDHT, IMAGE_HEIGHT);
    let bDst: ImageData = bCtx.createImageData(IMAGE_WIDHT, IMAGE_HEIGHT);

    for (let i = 0; i < toneArrR.length; ++i) {
        compArr[COLOR.R][i] = 0;
        compArr[COLOR.G][i] = 0;
        compArr[COLOR.B][i] = 0;
    }

    let Y: number = 0;
    let U: number = 0;
    let V: number = 0;
    let R: number = 0;
    let G: number = 0;
    let B: number = 0;

    for (let i = 0; i < imageData.data.length; i = i + 4) {
        let formatedData = [0, 0, 0];
        let rValue: number = imageData.data[i];
        let gValue: number = imageData.data[i + 1];
        let bValue: number = imageData.data[i + 2];

        R = rValue;
        G = gValue;
        B = bValue;

        RGB2YUV(formatedData, R, G, B);
        Y = formatedData[0];
        U = formatedData[1];
        V = formatedData[2];

        let yuvArr: number[] = new Array(3);
        calcTone(yuvArr, Y, U, V, binNumberId.value, false);

        Y = yuvArr[0];
        U = yuvArr[1];
        V = yuvArr[2];

        rDst.data[i] = rDst.data[i + 1] = rDst.data[i + 2] = Y;
        rDst.data[i + 3] = imageData.data[i + 3];

        let workY = 192;
        let workU = U;
        let workV = 0;

        let rgbArr: number[] = new Array(3);
        YUV2RGB(rgbArr, workY, workU, workV);
        gDst.data[i] = rgbArr[0];
        gDst.data[i + 1] = rgbArr[1];
        gDst.data[i + 2] = rgbArr[2];
        gDst.data[i + 3] = imageData.data[i + 3];

        workY = 192;
        workU = 0;
        workV = V;

        YUV2RGB(rgbArr, workY, workU, workV);
        bDst.data[i] = rgbArr[0];
        bDst.data[i + 1] = rgbArr[1];
        bDst.data[i + 2] = rgbArr[2];
        bDst.data[i + 3] = imageData.data[i + 3];

        calcHistogram(i);
    }
    rCtx.putImageData(rDst, 0, 0);
    gCtx.putImageData(gDst, 0, 0);
    bCtx.putImageData(bDst, 0, 0);
}

function calcHistogram(count: number) {
    let cmpValueX = count / 4 % IMAGE_WIDHT;
    let cmpValueY = Math.floor(count / 4 / IMAGE_WIDHT);

    if (((firstPosX <= cmpValueX && cmpValueX <= secondPosX) || (secondPosX <= cmpValueX && cmpValueX <= firstPosX)) &&
        ((firstPosY <= cmpValueY && cmpValueY <= secondPosY) || (secondPosY <= cmpValueY && cmpValueY <= firstPosY))) {
        compArr[COLOR.R][imageData.data[count]] += 1;
        compArr[COLOR.G][imageData.data[count + 1]] += 1;
        compArr[COLOR.B][imageData.data[count + 2]] += 1;
    }
}

function calcTone(compArr: number[], comp1: number, comp2: number, comp3: number, binNumberId: string, isHSV: boolean) {
    let toneDivision: number = COLOR_RANGE / parseInt(binNumberId);
    let toneDivisionH: number = 360 / parseInt(binNumberId);

    for (let i = 0; i < 3; i++) {
        compArr[i] = 0;
    }

    if (parseInt(binNumberId) != COLOR_RANGE) {
        if (isHSV) {
            compArr[0] = toneDivisionH / 2 + Math.floor(comp1 / toneDivisionH) * toneDivisionH;
        }
        else {
            compArr[0] = (comp1 == 0) ? 0 : toneDivision / 2 + Math.floor(comp1 / toneDivision) * toneDivision;
        }
        compArr[1] = (comp2 == 0) ? 0 : toneDivision / 2 + Math.floor(comp2 / toneDivision) * toneDivision;
        compArr[2] = (comp3 == 0) ? 0 : toneDivision / 2 + Math.floor(comp3 / toneDivision) * toneDivision;
    }
    else {
        compArr[0] = comp1;
        compArr[1] = comp2;
        compArr[2] = comp3;
    }
}

function HSV2RGB(rgbArr: number[], H: number, S: number, V: number) {
    let R: number = 0;
    let G: number = 0;
    let B: number = 0;

    for (let i = 0; i < 3; i++) {
        rgbArr[i] = 0;
    }

    let Max: number = V;
    let Min: number = Max - ((S / 255) * Max);
    let Diff: number = Max - Min;

    if (H >= 0 && H < 60) {
        R = Max;
        G = (H / 60) * Diff + Min;
        B = Min;
    }
    else if (H >= 60 && H < 120) {
        R = ((120 - H) / 60) * Diff + Min;
        G = Max;
        B = Min;
    }
    else if (H >= 120 && H < 180) {
        R = Min;
        G = Max;
        B = ((H - 120) / 60) * Diff + Min;
    }
    else if (H >= 180 && H < 240) {
        R = Min;
        G = ((240 - H) / 60) * Diff + Min;
        B = Max;
    }
    else if (H >= 240 && H < 300) {
        R = ((H - 240) / 60) * Diff + Min;
        G = Min;
        B = Max;
    }
    else {
        R = Max;
        G = Min;
        B = ((360 - H) / 60) * Diff + Min;
    }

    rgbArr[0] = Math.floor(R);
    rgbArr[1] = Math.floor(G);
    rgbArr[2] = Math.floor(B);
}

function YUV2RGB(rgbArr: number[], Y: number, U: number, V: number) {
    rgbArr[0] = 1.000 * Y + 1.402 * V;
    rgbArr[1] = 1.000 * Y - 0.344 * U - 0.714 * V;
    rgbArr[2] = 1.000 * Y + 1.772 * U;

    rgbArr[0] = Math.floor(rgbArr[0]);
    rgbArr[1] = Math.floor(rgbArr[1]);
    rgbArr[2] = Math.floor(rgbArr[2]);
}

function RGB2HSV(hsvArr: number[], R: number, G: number, B: number) {
    let H: number = 0;
    let S: number = 0;
    let V: number = 0;
    let Max: number = 0;
    let Min: number = 0;
    let Diff: number = 0;

    Max = Math.max(R, G, B);
    Min = Math.min(R, G, B);
    Diff = Max - Min;

    if (Max == Min) {
        H = 0;
    }
    else {
        if (R == Max) {
            H = 60 * ((G - B) / Diff);
        }
        else if (G == Max) {
            H = 60 * ((B - R) / Diff) + 120;
        }
        else {
            H = 60 * ((R - G) / Diff) + 240;
        }
    }

    if (H < 0) {
        H += 360;
    }

    S = (Max == 0) ? 0 : Diff * 255 / Max;
    V = Max;

    hsvArr[0] = Math.floor(H);
    hsvArr[1] = Math.floor(S);
    hsvArr[2] = Math.floor(V);
}

function RGB2YUV(yuvArr: number[], R: number, G: number, B: number) {
    let Y: number = 0;
    let U: number = 0;
    let V: number = 0;

    Y = 0.299 * R + 0.587 * G + 0.114 * B;
    U = -0.169 * R - 0.331 * G + 0.500 * B;
    V = 0.500 * R - 0.419 * G - 0.081 * B;

    yuvArr[0] = Math.floor(Y);
    yuvArr[1] = Math.floor(U);
    yuvArr[2] = Math.floor(V);
}

function makeBinCount(binArr: number[], histgramIndex: number, binNumber: string) {
    let binRange = COLOR_RANGE / parseInt(binNumber);

    for (let i = 0; i < parseInt(binNumber); i++) {
        binArr[i] = 0;
    }

    for (let i = 0; i < COLOR_RANGE; i++) {
        binArr[Math.floor(i / binRange)] += compArr[histgramIndex][i];
    }
}

function isOperationTypeColorPix() {
    let value: string = (<HTMLFormElement>document.getElementById("operationTypeId")).operationType.value;
    if (value == "colorPix") {
    	return true;
    }
    else {
    	return false;
    }
}
