{

    "attachKeys": function(inKeys, outKeys) {

        if (inKeys >= 1 && outKeys >= 1) { // There is in and out animation
    
            var outStart = thisLayer.outPoint - (key(numKeys).time - key(numKeys - outKeys).time);
            var inFinish = thisLayer.inPoint + (key(inKeys).time - key(1).time);
            var t = 0;
    
            if (time < inPoint) {
                return valueAtTime(key(1).time);
            } else if (time < inFinish) {
                return valueAtTime(key(1).time + (time - inPoint));
            } else if (time < outStart) {
                return valueAtTime(key(inKeys).time);
            } else {
                t = time - outStart;
                return valueAtTime(key(numKeys - outKeys).time + t);
            }
        } else if (inKeys == 0 && outKeys >= 2) { // Animation out only
    
            outStart = thisLayer.outPoint - (key(outKeys).time - key(1).time);
    
            if (time < outStart) {
                return valueAtTime(key(1).time);
            } else {
                t = time - outStart;
                return valueAtTime(key(1).time + t);
            }
        } else if (inKeys >= 2 && outKeys == 0) { // Animation in only
    
            inFinish = thisLayer.inPoint + (key(inKeys).time - key(1).time);
    
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

    "bounceKeys": function(amp, freq, decay, keyMin, keyMax) {

        // Function input defaults
        amp = (typeof amp !== 'undefined') ? amp : .12;
        freq = (typeof feq !== 'undefined') ? freq : 2.5;
        decay = (typeof decay !== 'undefined') ? decay : 8;
        keyMin = (typeof keyMin !== 'undefined') ? keyMin : 1;
        keyMax = (typeof keyMax !== 'undefined') ? keyMax : numKeys;

        var curKey = 0;
        var t = 0;
        
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
            v = velocityAtTime(key(curKey).time - thisComp.frameDuration/10);
            return value + v*amp*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t);
        } else {
            return value;
        }
    },
	    
    "pointsToPath": function(points, closed) {
	      
	    closed = (typeof closed !== 'undefined') ? closed : true;

	    var pathPoints = [];

	    for(i=0; i<points.length; i++) {

		    pathPoints[i] = fromCompToSurface(points[i]);
	    }

	    return createPath(pathPoints, [], [], closed);
    },
	    
    "gridPoints": function(rows, columns, rowNum, columnNum) {
    
	    var columnWidth = thisComp.width / columns;
	    var rowHeight = thisComp.height / rows;

	    var topLeft = [columnWidth * (columnNum - 1), rowHeight * (rowNum -1)];
	    var topRight = topLeft + [columnWidth, 0];

	    var bottomLeft = topLeft + [0, rowHeight];
	    var bottomRight = topRight + [0, rowHeight];

	    return [topLeft, topRight, bottomRight, bottomLeft];
    },

    "hideLayerWhenBelow": function(layerIndex) {

        // Function input defaults
        layerIndex = (typeof layerIndex !== 'undefined') ? layerIndex : index-1;

        var aboveLayer;
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
	
        var xGrid = effect(pointControl)("Point")[0];
        var yGrid = effect(pointControl)("Point")[1];
    
        var x = (xGrid*1.75 - yGrid) ;
        var y = (xGrid + yGrid/1.75)
    
        return offset + [x,y]
    },

    "layerBoundsPath": function(buffer, sourceLayer, extend, sampleTime) {

        // Function input defaults
        buffer = (typeof buffer !== 'undefined') ? buffer : 0;
        sourceLayer = (typeof sourceLayer !== 'undefined') ?  sourceLayer : thisLayer;
        extend = (typeof extend !== 'undefined') ?  extend : false;
        sampleTime = (typeof sampleTime !== 'undefined') ?  sampleTime : time-inPoint;
    
        var layerWidth = sourceLayer.sourceRectAtTime(sampleTime, extend).width;
        var layerHeight = sourceLayer.sourceRectAtTime(sampleTime, extend).height;
        var layerTop = sourceLayer.sourceRectAtTime(sampleTime, extend).top;
        var layerLeft = sourceLayer.sourceRectAtTime(sampleTime, extend).left;
    
        var maskPoints = [
            [layerLeft - buffer, layerTop - buffer],
            [layerLeft + layerWidth + buffer, layerTop - buffer],
            [layerLeft + layerWidth + buffer, layerTop + layerHeight + buffer],
            [layerLeft - buffer, layerTop + layerHeight + buffer]
        ];
    
        return createPath(points = maskPoints, inTangents = [], outTangents = [], is_closed = true);
    },

    "layerSize": function(layerIndex, sampleTime) {
        
        // Function input defaults
        sampleTime = (typeof sampleTime !== 'undefined') ?  sampleTime : time;
        var layerSize = [
            thisComp.layer(layerIndex).sourceRectAtTime(time, true).width,
            thisComp.layer(layerIndex).sourceRectAtTime(time, true).height
            
        ];
        return(layerSize);
    },

    "effectsSearch": function(effectName) {

        totalEffects = thisLayer("Effects").numProperties;
        selectEffects = 0;
    
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

    "textCount": function(sourceText, type) {

        // Function input defaults
        type = (typeof type !== 'undefined') ?  type : "word";

        var count;
    
        switch (type) {
    
            case "word":
                count = sourceText.split(" ").length;
                break;
            case "line":
                count  = sourceText.split(/[^\r\n]+/g).length;
                break;
            case "char":
                count = sourceText.length;
                break;
            default:
                count = null;
                break;
        }
    
        return count;
    },

    "padNumber": function(num, length) {

        // Convert num to string
        var numString = num + "";

        // Pad with zeros
        while(numString.length < length) {
            numString = "0" + numString;
        }

        return numString
    },

    "commaNum": function(number) {
        
        // Expression courtesy of Dab Ebberts
        number = '' + Math.round(number);
        
        if (number.length > 3) {

            var mod = number.length % 3;
            var output = (mod > 0 ? (number.substring(0, mod)) : '');
        
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
    
    "repeatString": function(string, times) {
    
        var repeatedString = "";
    
        while (times > 0) {
            repeatedString += string;
            times --;
        }
    
        return repeatedString;
    },
    
    "cleanLines": function(string, maxLines, maxCharacters) {
        var lines = string.split("\r");
        var numLines = Math.min(lines.length, maxLines);
        var limitedLines = [];
        for (var i = 0; i < numLines; i++) {
            limitedLines.push(lines[i].replace(/^\s+|\s+$/g, '').substring(0,maxCharacters));
        }
    
        return limitedLines.join("\r");
    },
    
    "keyframesToArray": function() {
    
        var keys = [];
    
        for (var i=1; i <= numKeys; i++) {
            
            var thisKey = {
                time: key(i).time,
                value: key(i).value
            };
            
            keys.push(thisKey);
        }
    
        return keys;
    }

    "circularMotion": function(radius, revolutionTime, startAngle) {

        // Algorithm courtesy of Xinlai Ni
        var startAngle = (typeof startAngle !== 'undefined') ?  startAngle : -90;
        startAngle = degreesToRadians(startAngle);
        
        var angularSpeed = 2 * Math.PI / revolutionTime;
        var xt = radius * Math.cos(angularSpeed * time + startAngle);
        var yt = radius * Math.sin(angularSpeed * time + startAngle);
        
        return [xt, yt]
    },

    "circularPosition": function(radius, angle) {

        // Algorithm courtesy of Xinlai Ni
        startAngle = degreesToRadians(angle - 90);
        
        var xt = radius * Math.cos(startAngle);
        var yt = radius * Math.sin(startAngle);
        
        return [xt, yt, 0]
    },

    "countdown": function(length, speed) {

        speed = (typeof speed !== 'undefined') ? speed : 1;

        var clockTime = Math.max(length - speed*(time - inPoint),0);
      
        var clock = Math.floor(clockTime);
        var min = Math.floor((clock%3600)/60);
        var sec = Math.floor(clock%60);
        return min + ":" + padNumber(sec)

        function padNumber(number, length) {
        
            var s = "000000000" + number;
            return s.substr(s.length-length);
        }
    }

    "heightIsZero": function(layer) {
        return layer.sourceRectAtTime(time, false) > 0;
    }
    
    "textLayerIsEmpty": function(layer) {
        return layer.text.sourceText.value.length === 0;
    }

    "layerIsHidden": function(layer) {
        return layer.transform.opacity === 0;
    }

    "layerTopLeft": function(layer) {
        var layerRect = layer.sourceRectAtTime(time, false);
        var layerTopCorner = [layerRect.left, layerRect.top];
        return layer.toComp(layerTopCorner);
    }

    "layerNamesToLayers": function(layerNames) {
        layers = [];
        for (var index = 0; index < layerNames.length; index++) {
            layers.push(thisComp.layer(layerNames[index]));
        }

        return layers;
    }

    "layersToLayerNames": function(layers) {
        layerNames = [];
        for (let index = 0; index < layers.length; index++) {
            layerNames.push(layers[index].name);
        }

        return layerNames;
    }

    "getLastNonEmptyTextLayer": function(layers) {
        for (var index = layers.length - 1; index >= 0; index--) {
            if (!textLayerEmpty(layers[index])) {
            return layers[index];
            }
        }

        return layers[0];

        function textLayerEmpty(layer) {
            return layer.text.sourceText.value.length === 0;
        }
    }

    "getFirstNonEmptyTextLayer": function(layers) {
        for (var index = 0; index < layers.length; index--) {
            if (!textLayerEmpty(layers[index])) {
            return layers[index];
            }
        }

        return layers[0];

        function textLayerEmpty(layer) {
            return layer.text.sourceText.value.length === 0;
        }
    }

    "textLayersAreAllEmpty": function(layers) {
        for (var index = 0; index < layers.length; index++) {
            if (!textLayerEmpty(layers[index])) {
            return false;
            }
        }

        return true;

        function textLayerEmpty(layer) {
            return layer.text.sourceText.value.length === 0;
        }
    }

}