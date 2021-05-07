{
    getFunctions(time = thisLayer.time) {
        function funcError(funcName, ...errors) {
            return new Error(`in function ${funcName}.\n\n${errors.join('\n')}`);
        }
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
                        time -
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
                    return thisProperty.valueAtTime(thisProperty.key(1).time + time - outStart);
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
                if (thisProperty.key(curKey).time > time) {
                    curKey--;
                }
            }
            // Set t to the time to curKey
            if (curKey !== 0) {
                t = time - thisProperty.key(curKey).time;
            }
            if (curKey > 0 && curKey >= keyMin && curKey <= keyMax && t < 3) {
                let velocity = thisProperty.velocityAtTime(thisProperty.key(curKey).time - thisComp.frameDuration / 10);
                return thisLayer.add(thisProperty.value, thisLayer.mul(velocity, (amp * Math.sin(freq * t * 2 * Math.PI)) / Math.exp(decay * t)));
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
            const topRight = thisLayer.add(topLeft, [columnWidth, 0]);
            const bottomLeft = thisLayer.add(topLeft, [0, rowHeight]);
            const bottomRight = thisLayer.add(topRight, [0, rowHeight]);
            return [topLeft, topRight, bottomRight, bottomLeft];
        }
        function hideLayerWhenBelow(layerIndex = thisLayer.index - 1) {
            try {
                const aboveLayer = thisComp.layer(layerIndex);
                return time < aboveLayer.inPoint ? 100 : 0;
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
            return thisLayer.add(offset, [x, y]);
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
        function layerRect({ layer = thisLayer, sampleTime = time, anchor = 'center', xHeight = true, }) {
            const sourceRect = layer.sourceRectAtTime(sampleTime, false);
            let { width, height, top, left } = sourceRect;
            let topLeft = [left, top];
            if (layer.text && xHeight) {
                const { fontSize, leading, autoLeading } = layer.text.sourceText.style;
                const lineGap = autoLeading ? fontSize * 1.2 : leading;
                const textSize = fontSize / 2;
                const numLines = textCount(layer.text.sourceText.value, 'line');
                height = lineGap * (numLines - 1) + textSize;
                topLeft = [left, -textSize];
            }
            const positions = {
                topLeft: topLeft,
                topRight: thisLayer.add(topLeft, [width, 0]),
                topCenter: thisLayer.add(topLeft, [width / 2, 0]),
                bottomCenter: thisLayer.add(topLeft, [width / 2, height]),
                bottomLeft: thisLayer.add(topLeft, [0, height]),
                bottomRight: thisLayer.add(topLeft, [width, height]),
                center: thisLayer.add(topLeft, [width / 2, height / 2]),
                leftCenter: thisLayer.add(topLeft, [0, height / 2]),
                rightCenter: thisLayer.add(topLeft, [width, height / 2]),
            };
            const position = positions[anchor];
            const onOwnLayer = layer === thisLayer;
            return {
                size: [width, height],
                position: onOwnLayer ? position : layer.toComp(position),
                sourceRect: sourceRect,
            };
        }
        function textCount(sourceText, type = 'word') {
            if (typeof sourceText !== 'string') {
                const valueHint = typeof sourceText === 'function' &&
                    `\n\nDid you mean sourceText.value?`;
                throw funcError(`textCount`, `Invalid value for sourceText.`, `Value must be a string, received ${typeof sourceText}.${valueHint ||
                    ''}`);
            }
            const counts = {
                word: text => text.split(' ').length,
                line: text => Math.max(text.split(/[^\r\n\3]*/gm).length - 1, 0),
                char: text => text.length,
            };
            if (!counts[type]) {
                throw funcError(`textCount`, `Invalid type: ${type}.\nValid types are: word, line, char`);
            }
            return counts[type](sourceText);
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
            return time < hideTime ? descenderFreeLines : string;
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
            const xt = radius * Math.cos(angularSpeed * time + startRadians);
            const yt = radius * Math.sin(angularSpeed * time + startRadians);
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
        function maintainScale(parentLayer = thisLayer.parent) {
            if (typeof thisLayer.transform === 'undefined') {
                throw funcError('maintainScale', `Current layer (${thisLayer.name}) doesn't have transform values`);
            }
            if (typeof parentLayer.transform === 'undefined') {
                throw funcError('maintainScale', `Parent layer (${thisLayer.name}) doesn't have transform values`);
            }
            return thisLayer.transform.scale.value.map((scale, index) => 
            // we need to check if scale is undefined, since typescript
            // doesn't know if this array element exists?
            scale
                ? (scale * 100) / (parentLayer.transform.scale.value[index] || 0)
                : 0);
        }
        function offsetFromAnchor(position, [offsetX, offsetY], anchor) {
            switch (anchor) {
                case 'topLeft':
                    return thisLayer.add(position, [-offsetX, -offsetY]);
                case 'topRight':
                    return thisLayer.add(position, [offsetX, -offsetY]);
                case 'bottomRight':
                    return thisLayer.add(position, [offsetX, offsetY]);
                case 'bottomLeft':
                    return thisLayer.add(position, [-offsetX, offsetY]);
                default:
                    throw Error('Invalid anchor: ' + anchor);
            }
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
            maintainScale,
            offsetFromAnchor,
        };
    },
    version: '2.0.1',
}