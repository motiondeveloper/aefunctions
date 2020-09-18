{
	"getFunctions": function(_time = time) {
	    function attachKeys(inKeys = 2, outKeys = 2) {
	        if (inKeys >= 1 && outKeys >= 1) {
	            // There is in and out animation
	            const outStart = thisLayer.outPoint -
	                (thisProperty.key(thisProperty.numKeys).time -
	                    thisProperty.key(thisProperty.numKeys - outKeys).time);
	            const inFinish = thisLayer.inPoint +
	                (thisProperty.key(inKeys).time - thisProperty.key(1).time);
	            if (time < thisLayer.inPoint) {
	                return thisProperty.key(1).value;
	            }
	            else if (time < inFinish) {
	                return thisProperty.valueAtTime(thisProperty.key(1).time + (time - thisLayer.inPoint));
	            }
	            else if (time < outStart) {
	                return thisProperty.key(inKeys).value;
	            }
	            else {
	                return thisProperty.valueAtTime(thisProperty.key(thisProperty.numKeys - outKeys).time +
	                    _time -
	                    outStart);
	            }
	        }
	        else if (inKeys == 0 && outKeys >= 2) {
	            // Animation out only
	            const outStart = thisLayer.outPoint -
	                (thisProperty.key(outKeys).time - thisProperty.key(1).time);
	            if (time < outStart) {
	                return thisProperty.key(1).value;
	            }
	            else {
	                return thisProperty.valueAtTime(thisProperty.key(1).time + _time - outStart);
	            }
	        }
	        else if (inKeys >= 2 && outKeys == 0) {
	            // Animation in only
	            const inFinish = thisLayer.inPoint +
	                (thisProperty.key(inKeys).time - thisProperty.key(1).time);
	            if (time < thisLayer.inPoint) {
	                return thisProperty.key(1).value;
	            }
	            else if (time < inFinish) {
	                return thisProperty.valueAtTime(thisProperty.key(1).time + (time - thisLayer.inPoint));
	            }
	            else {
	                return thisProperty.key(inKeys).value;
	            }
	        }
	        else {
	            // Default option if no range specified
	            return thisProperty.value;
	        }
	    }
	    function bounceKeys(amp = 0.12, freq = 2.5, decay = 8, keyMin = 1, keyMax = thisProperty.numKeys) {
	        let curKey = 0;
	        let t = 0;
	        // Set curKey to the previous keyframe
	        if (thisProperty.numKeys > 0) {
	            curKey = thisProperty.nearestKey(time).index;
	            if (thisProperty.key(curKey).time > _time) {
	                curKey--;
	            }
	        }
	        // Set t to the time to curKey
	        if (curKey !== 0) {
	            t = _time - thisProperty.key(curKey).time;
	        }
	        if (curKey > 0 && curKey >= keyMin && curKey <= keyMax && t < 3) {
	            let velocity = thisProperty.velocityAtTime(thisProperty.key(curKey).time - thisComp.frameDuration / 10);
	            return add(thisProperty.value, mul(velocity, (amp * Math.sin(freq * t * 2 * Math.PI)) / Math.exp(decay * t)));
	        }
	        else {
	            return thisProperty.value;
	        }
	    }
	    function getPathFromPoints(points, closed = true) {
	        const pathPoints = points.map(item => thisLayer.fromCompToSurface(item));
	        return thisProperty.createPath(pathPoints, [], [], closed);
	    }
	    function gridPoints({ rows = 3, columns = 3, rowNum = 1, columnNum = 1, gridSize = [thisComp.width, thisComp.height], }) {
	        const columnWidth = gridSize[0] / columns;
	        const rowHeight = gridSize[1] / rows;
	        const topLeft = [
	            columnWidth * (columnNum - 1),
	            rowHeight * (rowNum - 1),
	        ];
	        const topRight = add(topLeft, [columnWidth, 0]);
	        const bottomLeft = add(topLeft, [0, rowHeight]);
	        const bottomRight = add(topRight, [0, rowHeight]);
	        return [topLeft, topRight, bottomRight, bottomLeft];
	    }
	    function hideLayerWhenBelow(layerIndex = thisLayer.index - 1) {
	        try {
	            const aboveLayer = thisComp.layer(layerIndex);
	            return _time < aboveLayer.inPoint ? 100 : 0;
	        }
	        catch (err) {
	            // Layer is first layer
	            return 100;
	        }
	    }
	    function getIsometricPosition(position, offset = [0, 0]) {
	        const xGrid = position[0];
	        const yGrid = position[1];
	        const x = xGrid * 1.75 - yGrid;
	        const y = xGrid + yGrid / 1.75;
	        return add(offset, [x, y]);
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
	            [layerLeft - buffer, layerTop + layerHeight + buffer],
	        ];
	        return thisProperty.createPath(maskPoints, [], [], true);
	    }
	    function layerSize(layerIndex = thisLayer.index, sampleTime = time) {
	        const layerSize = [
	            thisComp.layer(layerIndex).sourceRectAtTime(sampleTime, false).width,
	            thisComp.layer(layerIndex).sourceRectAtTime(sampleTime, false).height,
	        ];
	        return layerSize;
	    }
	    function layerRect({ layer = thisLayer, sampleTime = time, anchor = 'center', capHeight = false, capHeightTime = -550, } = {}) {
	        const sourceRect = layer.sourceRectAtTime(sampleTime, false);
	        let layerSize, layerPosition;
	        if (capHeight) {
	            const capSourceRect = layer.sourceRectAtTime(capHeightTime, false);
	            layerSize = [sourceRect.width, capSourceRect.height];
	            layerPosition = [sourceRect.left, capSourceRect.top];
	        }
	        else {
	            layerSize = [sourceRect.width, sourceRect.height];
	            layerPosition = [sourceRect.left, sourceRect.top];
	        }
	        let anchorPosition;
	        switch (anchor) {
	            case 'center':
	                anchorPosition = [
	                    layerPosition[0] + layerSize[0] / 2,
	                    layerPosition[1] + layerSize[1] / 2,
	                ];
	                break;
	            case 'topLeft':
	                anchorPosition = [layerPosition[0], layerPosition[1]];
	                break;
	            case 'topRight':
	                anchorPosition = [layerPosition[0] + layerSize[0], layerPosition[1]];
	                break;
	            case 'bottomLeft':
	                anchorPosition = [layerPosition[0], layerPosition[1] + layerSize[1]];
	                break;
	            case 'bottomRight':
	                anchorPosition = [
	                    layerPosition[0] + layerSize[0],
	                    layerPosition[1] + layerSize[1],
	                ];
	                break;
	            default:
	                throw 'layerRect Error: Invalid Anchor Point';
	        }
	        return {
	            size: layerSize,
	            position: layer.toComp(anchorPosition),
	            sourceRect: sourceRect,
	        };
	    }
	    function textCount(sourceText, type = 'word') {
	        switch (type) {
	            case 'word':
	                return sourceText.split(' ').length;
	            case 'line':
	                return Math.max(sourceText.split(/[^\r\n\3]*/gm).length - 1, 0);
	            case 'char':
	                return sourceText.length;
	            default:
	                return 1;
	        }
	    }
	    function padNumber(number, length) {
	        return `${'0'.repeat(length)}${number}`;
	    }
	    function commaNum(inputNum) {
	        // Expression courtesy of Dab Ebberts
	        let number = '' + Math.round(inputNum);
	        if (number.length > 3) {
	            const mod = number.length % 3;
	            let output = mod > 0 ? number.substring(0, mod) : '';
	            for (let i = 0; i < Math.floor(number.length / 3); i++) {
	                if (mod == 0 && i == 0) {
	                    output += number.substring(mod + 3 * i, mod + 3 * i + 3);
	                }
	                else {
	                    output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
	                }
	            }
	            return output;
	        }
	        else {
	            return number;
	        }
	    }
	    function cleanLines(string, maxLines, maxCharacters) {
	        const lines = string.split(/[\r\n\3]+/g);
	        const limitedLines = lines.map(item => {
	            return item.replace(/^\s+|\s+$/g, '').substring(0, maxCharacters);
	        });
	        return limitedLines.slice(0, maxLines + 1).join('\n');
	    }
	    function hideDescenders(string = thisProperty.value, hideTime = -500) {
	        const numLines = textCount(string, 'line');
	        const descenderFreeLines = 'X\r'.repeat(numLines - 1) + 'X';
	        return _time < hideTime ? descenderFreeLines : string;
	    }
	    function getKeyframesAsArray() {
	        let keys = [];
	        for (let i = 1; i <= thisProperty.numKeys; i++) {
	            const thisKey = {
	                time: thisProperty.key(i).time,
	                value: thisProperty.key(i).value,
	            };
	            keys.push(thisKey);
	        }
	        return keys;
	    }
	    function circularMotion(radius = 200, revolutionTime = 1, startAngle = -90) {
	        const startRadians = thisLayer.degreesToRadians(startAngle);
	        const angularSpeed = (2 * Math.PI) / revolutionTime;
	        const xt = radius * Math.cos(angularSpeed * _time + startRadians);
	        const yt = radius * Math.sin(angularSpeed * _time + startRadians);
	        return [xt, yt];
	    }
	    function circularPosition(radius, angle) {
	        // Algorithm courtesy of Xinlai Ni
	        const startAngle = thisLayer.degreesToRadians(angle - 90);
	        const xt = radius * Math.cos(startAngle);
	        const yt = radius * Math.sin(startAngle);
	        return [xt, yt];
	    }
	    function countdown(length = thisLayer.outPoint - thisLayer.inPoint, speed = 1) {
	        const clockTime = Math.max(length - speed * (time - thisLayer.inPoint), 0);
	        const clock = Math.floor(clockTime);
	        const min = Math.floor((clock % 3600) / 60);
	        const sec = Math.floor(clock % 60);
	        return `${min}:${padNumber(sec, 2)}`;
	    }
	    function scaleToFit(inputSize, maxSize, toggles = {
	        onlyScaleDown: false,
	        onlyScaleUp: false,
	        uniform: true,
	    }) {
	        // Get scale needed to fit box
	        let scaleFactorWidth = maxSize[0] / inputSize[0];
	        let scaleFactorHeight = maxSize[1] / inputSize[1];
	        // Uniform scaling
	        let scaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight);
	        if (toggles.onlyScaleDown) {
	            scaleFactor = Math.min(scaleFactor, 1);
	            scaleFactorWidth = Math.min(scaleFactorWidth, 1);
	            scaleFactorHeight = Math.min(scaleFactorHeight, 1);
	        }
	        if (toggles.onlyScaleUp) {
	            scaleFactor = Math.max(scaleFactor, 1);
	            scaleFactorWidth = Math.max(scaleFactorWidth, 1);
	            scaleFactorHeight = Math.max(scaleFactorHeight, 1);
	        }
	        return toggles.uniform
	            ? [100 * scaleFactor, 100 * scaleFactor]
	            : [100 * scaleFactorWidth, 100 * scaleFactorHeight];
	    }
	    function getStringWithLineBreaks(string, maxCharacters) {
	        const splitRegex = new RegExp('(.{' + maxCharacters + '}[^ ]* )', 'g');
	        return string.replace(splitRegex, '$1\n');
	    }
	    function hasAShortLine(string, minWords) {
	        const lines = string.split('\n');
	        if (lines.length == 1) {
	            return false;
	        }
	        for (let index = 0; index < lines.length; index++) {
	            const line = lines[index];
	            const words = line.split(' ');
	            if (words.length <= minWords) {
	                return true;
	            }
	        }
	        return false;
	    }
	    function breakWithoutOrphans(string, maxCharacters, minWords, options = {
	        minCharacters: 12,
	        characterStep: 4,
	    }) {
	        function smartBreak(string, maxCharacters, minWords, options) {
	            const brokenString = getStringWithLineBreaks(string, maxCharacters);
	            if (!hasAShortLine(brokenString, minWords) ||
	                maxCharacters < options.minCharacters) {
	                return brokenString;
	            }
	            return smartBreak(string, maxCharacters - options.characterStep, minWords, options);
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
	        layerRect,
	        textCount,
	        padNumber,
	        commaNum,
	        cleanLines,
	        hideDescenders,
	        getKeyframesAsArray,
	        circularMotion,
	        circularPosition,
	        countdown,
	        scaleToFit,
	        breakWithoutOrphans,
	    };
	},
}