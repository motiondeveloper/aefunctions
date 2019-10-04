{
    "attachKeys": function(time, inKeys = 2, outKeys = 2) {

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
    },

    "bounceKeys": function(time, amp = .12, freq = 2.5, decay = 8, keyMin = 1, keyMax = numKeys) {

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
    },
	    
    "pointsToPath": function(points, closed = true) {

        const pathPoints = points.map(item => fromCompToSurface(item));
	    return createPath(pathPoints, [], [], closed);
    },
	    
    "gridPoints": function(rows, columns, rowNum, columnNum, gridSize = [thisComp.width, thisComp.height]) {
    
	    const columnWidth = gridSize[0] / columns;
	    const rowHeight = gridSize[1] / rows;

	    const topLeft = [columnWidth * (columnNum - 1), rowHeight * (rowNum -1)];
	    const topRight = topLeft + [columnWidth, 0];

	    const bottomLeft = topLeft + [0, rowHeight];
	    const bottomRight = topRight + [0, rowHeight];

	    return [topLeft, topRight, bottomRight, bottomLeft];
    },

    "hideLayerWhenBelow": function(layerIndex = index - 1) {

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
    },

    "isometricPosition": function(pointControl, offset) {
	
         const xGrid = effect(pointControl)("Point")[0];
         const yGrid = effect(pointControl)("Point")[1];
    
         const x = (xGrid*1.75 - yGrid) ;
         const y = (xGrid + yGrid/1.75)
    
        return offset + [x,y]
    },

    "layerBoundsPath": function(buffer = 0, sourceLayer = thisLayer, extend = false, sampleTime = time) {

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
    },

    "layerSize": function(layerIndex, sampleTime = time) {
        
        var layerSize = [
            thisComp.layer(layerIndex).sourceRectAtTime(sampleTime, false).width,
            thisComp.layer(layerIndex).sourceRectAtTime(sampleTime, false).height
            
        ];
        return(layerSize);
    },

    "effectSearch": function(effectName) {

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
    },

    "textCount": function(sourceText, type = word) {
    
        switch (type) {
    
            case "word":
                return sourceText.split(" ").length;
            case "line":
                return sourceText.split(/[^\r\n]+/g).length;
            case "char":
                return sourceText.length;
            default:
                return null;
        }
    },

    "padNumber": function(num, length) {

        return `${num}`.padStart(length, '0');
    },

    "commaNum": function(number) {
        
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
    },
    
    "cleanLines": function(string, maxLines, maxCharacters) {
        const lines = string.match(/[^\r\n]+/g);
        const limitedLines = lines.map((item) => {
            return item.replace(/^\s+|\s+$/g, '').substring(0, maxCharacters);
        });
    
        return limitedLines.slice(0, maxLines + 1).join("\r");
    },

    "hideDescenders": function(string, hideTime = -500, property = thisProperty) {
        const numLines = string.split(/[^\r\n]+/g).length;
        const descenderFreeLines = 'X\r'.repeat(numLines - 2) + 'X'
        return (property.time < hideTime) ? descenderFreeLines : string;
    },
    
    "keyframesToArray": function() {
    
        let keys = [];
    
        for (let i=1; i <= numKeys; i++) {
            
            const thisKey = {
                time: key(i).time,
                value: key(i).value
            };
            
            keys.push(thisKey);
        }
    
        return keys;
    },

    "circularMotion": function(radius, revolutionTime, startAngle = -90) {

        const startRadians = degreesToRadians(startAngle);
        const angularSpeed = 2 * Math.PI / revolutionTime;
        const xt = radius * Math.cos(angularSpeed * time + startRadians);
        const yt = radius * Math.sin(angularSpeed * time + startRadians);
        
        return [xt, yt]
    },

    "circularPosition": function(radius, angle) {

        // Algorithm courtesy of Xinlai Ni
        const startAngle = degreesToRadians(angle - 90);
        const xt = radius * Math.cos(startAngle);
        const yt = radius * Math.sin(startAngle);
        
        return [xt, yt, 0]
    },

    "countdown": function(time, length, speed = 1) {

        const clockTime = Math.max(length - speed*(time - inPoint),0);
        const clock = Math.floor(clockTime);
        const min = Math.floor((clock%3600)/60);
        const sec = Math.floor(clock%60);
        return `${min}:${sec.padStart(2, '0')}`
    },

    "heightIsZero": function(time, layer) {
        return layer.sourceRectAtTime(time, false) > 0;
    },
    
    "textLayerIsEmpty": function(layer) {
        return layer.text.sourceText.value.length === 0;
    },

    "layerIsHidden": function(layer) {
        return layer.transform.opacity === 0;
    },

    "layerTopLeft": function(layer, sourceTime = time) {
        const layerRect = layer.sourceRectAtTime(sourceTime, false);
        const layerTopCorner = [layerRect.left, layerRect.top];
        return layer.toComp(layerTopCorner);
    },

    "layerNamesToLayers": function(layerNames) {
        
        return layerNames.map((layerName) => {
            return thisComp.layer(layerName);
        });
    },

    "layersToLayerNames": function(layers) {
        
        return layers.map((layer) => {
            return layer.name;
        });
    },

    "getNonEmptyTextLayers": function(layers) {
        function textLayerEmpty(layer) {
            return layer.text.sourceText.value.length === 0;
        }

        return nonEmptyLayers = layers.filter(layer => !textLayerEmpty(layer));
    },

    "textLayersAreAllEmpty": function(layers) {
        function textLayerEmpty(layer) {
            return layer.text.sourceText.value.length === 0;
        }

        return layers.filter(layer => textLayerEmpty(layer)).length === 0;
    }
}
