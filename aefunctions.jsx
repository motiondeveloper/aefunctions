{ "getFunctions": function() {

    function attachKeys(inKeys = 2, outKeys = 2, time = thisLayer.time) }
        if (inKeys >= 1 && outKeys >= 1) { // There is in and out animation
            
            const outStart = thisLayer.outPoint - (key(numKeys).time - key(numKeys - outKeys).time);
            const inFinish = thisLayer.inPoint + (key(inKeys).time - key(1).time);
    
            if (time < inPoint) {
                return valueAtTime(key(1).time);
            } else if (time < inFinish) {
                return valueAtTime(key(1).time + (time - inPoint));
            } else if (time < outStart) {
                return valueAtTime(key(inKeys).time);
            } else {
                return valueAtTime(key(numKeys - outKeys).time + time - outStart);
            }
        } else if (inKeys == 0 && outKeys >= 2) { // Animation out only
    
            const outStart = thisLayer.outPoint - (key(outKeys).time - key(1).time);
    
            if (time < outStart) {
                return valueAtTime(key(1).time);
            } else {
                return valueAtTime(key(1).time + time - outStart);
            }
    
        } else if (inKeys >= 2 && outKeys == 0) { // Animation in only
    
            const inFinish = thisLayer.inPoint + (key(inKeys).time - key(1).time);
    
            if (time < thisLayer.inPoint) {
                return valueAtTime(key(1).time);
            } else if (time < inFinish) {
                return valueAtTime(key(1).time + (time - inPoint));
            } else {
                return valueAtTime(key(inKeys).time);
            }
        } else { // Default option if no range specified
            return value;
        }
    }
    
    function bounceKeys(amp = .12, freq = 2.5, decay = 8, keyMin = 1, keyMax = thisProperty.numKeys, time = thisLayer.time) {
        let curKey = 0;
        let t = 0;
        
        // Set curKey to the previous keyframe
        if (numKeys > 0){
            curKey = nearestKey(time).index;
            if (key(curKey).time > time){
                curKey--;
            }
        }
    
        // Set t to the time to curKey
        if (curKey !== 0) {
            t = time - key(curKey).time;
        }
    
        if (curKey > 0 && curKey >= keyMin && curKey <= keyMax && t < 3){
            let v = velocityAtTime(key(curKey).time - thisComp.frameDuration/10);
            return value + v*amp*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t);
        } else {
            return value;
        }
    }
    
    function getPathFromPoints(points, closed = true) {
        const pathPoints = points.map(item => fromCompToSurface(item));
        return createPath(pathPoints, [], [], closed);
    }
    
    function gridPoints(rows, columns, rowNum, columnNum, gridSize = [thisComp.width, thisComp.height]) {
    
        const columnWidth = gridSize[0] / columns;
        const rowHeight = gridSize[1] / rows;
    
        const topLeft = [columnWidth * (columnNum - 1), rowHeight * (rowNum -1)];
        const topRight = topLeft + [columnWidth, 0];
    
        const bottomLeft = topLeft + [0, rowHeight];
        const bottomRight = topRight + [0, rowHeight];
    
        return [topLeft, topRight, bottomRight, bottomLeft];
    }
    
    function hideLayerWhenBelow(layerIndex = index - 1) {
        let aboveLayer;
        try {
            aboveLayer = thisComp.layer(layerIndex);
            if(time < aboveLayer.inPoint) {
                // Before above layer starts
                return 100;
            } else {
                // After above layer starts
                return 0;
            }
        } catch(err) {
            // Layer is first layer
            return 100;
        }
    }
    
    function getIsometricPosition(pointControl, offset) {
        const xGrid = effect(pointControl)("Point")[0];
        const yGrid = effect(pointControl)("Point")[1];
    
        const x = (xGrid*1.75 - yGrid) ;
        const y = (xGrid + yGrid/1.75)
    
       return offset + [x,y]
    }
    
    function getLayerBoundsPath(buffer = 0, sourceLayer = thisLayer, extend = false, sampleTime = time) {
        const layerWidth = sourceLayer.sourceRectAtTime(sampleTime, extend).width;
        const layerHeight = sourceLayer.sourceRectAtTime(sampleTime, extend).height;
        const layerTop = sourceLayer.sourceRectAtTime(sampleTime, extend).top;
        const layerLeft = sourceLayer.sourceRectAtTime(sampleTime, extend).left;
    
        const maskPoints = [
            [layerLeft - buffer, layerTop - buffer],
            [layerLeft + layerWidth + buffer, layerTop - buffer],
            [layerLeft + layerWidth + buffer, layerTop + layerHeight + buffer],
            [layerLeft - buffer, layerTop + layerHeight + buffer]
        ];
    
        return createPath(points = maskPoints, inTangents = [], outTangents = [], is_closed = true);
    }
    
    function layerSize(layerIndex, sampleTime = time) { 
        const layerSize = [
            thisComp.layer(layerIndex).sourceRectAtTime(sampleTime, false).width,
            thisComp.layer(layerIndex).sourceRectAtTime(sampleTime, false).height
            
        ];
        return(layerSize);
    }
    
    function effectSearch(effectName) {
        const totalEffects = thisLayer("Effects").numProperties;
        let selectEffects = 0;
        if (effectName != null) {
    
            for (i = 1; i <= totalEffects; i++) {
              if (thisLayer("Effects")(i).name.toLowerCase().indexOf(effectName) > -1){
                selectEffects++;
              }
            }
            return selectEffects;
            
        } else {
            return totalEffects;
        }
    }
    
    function textCount(sourceText, type = "word") {
        switch (type) {
            case "word":
                return sourceText.split(" ").length;
            case "line":
                return sourceText.split(/[^\r\n\3]+/g).length;
            case "char":
                return sourceText.length;
            default:
                return null;
        }
    }
    
    function padNumber(number, length) {
        return `${number}`.padStart(length, '0');
    }
    
    function commaNum(number) {
        // Expression courtesy of Dab Ebberts
        let number = '' + Math.round(number);    
        if (number.length > 3) {
            const mod = number.length % 3;
            let output = (mod > 0 ? (number.substring(0, mod)) : '');
            for (i = 0; i < Math.floor(number.length / 3); i++) {
                if ((mod == 0) && (i == 0)) {
                    output += number.substring(mod + 3 * i, mod + 3 * i + 3);
                } else {
                    output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
                }
            }
            return output;
        } else {
            return number;
        }
    }
    
    function cleanLines(string, maxLines, maxCharacters) {
        const lines = string.match(/[\r\n\3]+/g);
        const limitedLines = lines.map((item) => {
            return item.replace(/^\s+|\s+$/g, '').substring(0, maxCharacters);
        });
    
        return limitedLines.slice(0, maxLines + 1).join("\r");
    }
    
    function hideDescenders(string, hideTime = -500, property = thisProperty) {
        const numLines = textCount(string, 'line');
        const descenderFreeLines = 'X\r'.repeat(numLines - 1) + 'X'
        return (property.time < hideTime) ? descenderFreeLines : string;
    }
    
    function keyframesToArray(property = thisProperty) {
        let keys = [];
        for (let i=1; i <= property.numKeys; i++) {
            const thisKey = {
                time: property.key(i).time,
                value: property.key(i).value
            };
            keys.push(thisKey);
        }
        return keys;
    }
    
    function circularMotion(radius, revolutionTime, startAngle = -90) {
        const startRadians = degreesToRadians(startAngle);
        const angularSpeed = 2 * Math.PI / revolutionTime;
        const xt = radius * Math.cos(angularSpeed * time + startRadians);
        const yt = radius * Math.sin(angularSpeed * time + startRadians);
        return [xt, yt]
    }
    
    function countdown(length, speed = 1, time = time) {
        const clockTime = Math.max(length - speed*(time - inPoint),0);
        const clock = Math.floor(clockTime);
        const min = Math.floor((clock%3600)/60);
        const sec = Math.floor(clock%60);
        return `${min}:${sec.padStart(2, '0')}`
    }
    
    function scaleToFit(
        inputSize, maxSize, toggles = {
            onlyScaleDown: false, onlyScaleUp: false,
        }
    ) {
        // Get scale needed to fit box
        const scaleFactorWidth = maxSize[0] / inputSize[0];
        const scaleFactorHeight = maxSize[1] / inputSize[1];
    
        // Ensure uniform scaling
        let scaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight);
    
        if (toggles.onlyScaleDown) { scaleFactor = Math.min(scaleFactor, 1); }
        if (toggles.onlyScaleUp) { scaleFactor = Math.max(scaleFactor, 1); }
    
        return [100 * scaleFactor, 100 * scaleFactor];
    }
    
    function getStringWithLineBreaks(string, maxCharacters) {
        const splitRegex = new RegExp('(.{' + maxCharacters + '}[^ ]* )', 'g');
        return string.replace(splitRegex, '$1\n');
    }
    
    function hasAShortLine(string, minWords) {
        const lines = string.split('\n');
        if (lines.length == 1) { return false }
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            const words = line.split(' ');
            if (words.length <= minWords) {
                return true;
            }        
        }
        return false;
    }
    
    function insertLineBreaks(string, maxCharacters, minWords, options = {
        minCharacters = 12,
        characterStep = 4,
    }) {
        function smartBreak(string, maxCharacters, minWords) {
            const brokenString = getStringWithLineBreaks(string, maxCharacters);
            if (!hasAShortLine(brokenString, minWords) || maxCharacters < options.minCharacters) { return brokenString }
            return smartBreak(string, maxCharacters - options.characterStep, minWords);
        }
        return smartBreak(string, maxCharacters, minWords, options);
    }
    
    return {
        attachKeys,
        bounceKeys,
        getPathFromPoints,
        gridPoints,
        hideLayerWhenBelow,
        getIsometricPosition,
        getLayerBoundsPath,
        layerSize,
        effectSearch,
        effectSearch,
        textCount,
        padNum,
        commaNum,
        cleanLines,
        hideDescenders,
        keyframesToArray,
        circularMotion,
        countdown,
        scaleToFit,
        insertLineBreaks,
    }
    
    }
    }