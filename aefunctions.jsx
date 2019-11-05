{ 
'getFunctions': function(property = thisProperty, layer = thisLayer, layerIs3D = false) {

// Prefixing Native Methods and Attributes
const time = layer.time;
const thisProject = layer.thisProject;
const colorDepth = layer.colorDepth;
const transform = layer.transform;
const anchorPoint = layer.anchorPoint;
const position = layer.position;
const scale = layer.scale;
const rotation = layer.rotation;
const opacity = layer.opacity;
const rotationX = layer.rotationX;
const rotationY = layer.rotationY;
const rotationZ = layer.rotationZ;
const audioLevels = layer.audioLevels;
const marker = layer.marker;
const name = layer.name;
const width = layer.width;
const height = layer.height;
const index = layer.index;
const hasParent = layer.hasParent;
const inPoint = layer.inPoint;
const outPoint = layer.outPoint;
const startTime = layer.startTime;
const hasVideo = layer.hasVideo;
const hasAudio = layer.hasAudio;
const active = layer.active;
const enabled = layer.enabled;
const audioActive = layer.audioActive;
const cameraOption = layer.cameraOption;
const pointOfInterest = layer.pointOfInterest;
const zoom = layer.zoom;
const depthOfField = layer.depthOfField;
const focusDistance = layer.focusDistance;
const aperature = layer.aperature;
const blurLevel = layer.blurLevel;
const irisShape = layer.irisShape;
const irisRotation = layer.irisRotation;
const irisRoundness = layer.irisRoundness;
const irisAspectRatio = layer.irisAspectRatio;
const irisDiffractionFringe = layer.irisDiffractionFringe;
const highlightGain = layer.highlightGain;
const highlightThreshold = layer.highlightThreshold;
const highlightSaturation = layer.highlightSaturation;
const lightOption = layer.lightOption;
const intensity = layer.intensity;
const color = layer.color;
const coneAngle = layer.coneAngle;
const coneFeather = layer.coneFeather;
const shadowDarkness = layer.shadowDarkness;
const shadowDiffusion = layer.shadowDiffusion;

if (hasParent) {
  const parent = layer.parent;
}

// Optional attributes
try {
  const source = layer.source;
} catch (e) { }

try {
  const timeRemap = layer.timeRemap;
} catch (e) { }

try {
  const speed = property.speed;
} catch (e) { }

// 3D layer attributes
if (layerIs3D) {
  const orientation = layer.orientation;
  const lightTransmission = layer.lightTransmission;
  const castsShadows = layer.castsShadows;
  const acceptsShadows = layer.acceptsShadows;
  const acceptsLights = layer.acceptsLights;
  const ambient = layer.ambient;
  const diffuse = layer.diffuse;
  const specular = layer.specular;
  const specularIntensity = layer.specularIntensity;
  const shininess = layer.shininess;
  const specularShininess = layer.specularShininess;
  const metal = layer.metal;
}

// Methods Requiring thisLayer
const comp = layer.comp;
const footage = layer.footage;
const posterizeTime = layer.posterizeTime;
const add = layer.add;
const sub = layer.sub;
const mul = layer.mul;
const div = layer.div;
const clamp = layer.clamp;
const length = layer.length;
const dot = layer.dot;
const normalize = layer.normalize;
const cross = layer.cross;
const lookAt = layer.lookAt;
const timeToFrames = layer.timeToFrames;
const framesToTime = layer.framesToTime;
const timeToTimecode = layer.timeToTimecode;
const timeToFeetAndFrames = layer.timeToFeetAndFrames;
const timeToNTSCTimecode = layer.timeToNTSCTimecode;
const timeToCurrentFormat = layer.timeToCurrentFormat;
const seedRandom = layer.seedRandom;
const random = layer.random;
const gaussRandom = layer.gaussRandom;
const noise = layer.noise;
const degreesToRadians = layer.degreesToRadians;
const radiansToDegrees = layer.radiansToDegrees;
const linear = layer.linear;
const ease = layer.ease;
const easeIn = layer.easeIn;
const easeOut = layer.easeOut;
const rgbToHsl = layer.rgbToHsl;
const hslToRgb = layer.hslToRgb;
const hexToRgb = layer.hexToRgb;
const mask = layer.mask;
const sourceRectAtTime = layer.sourceRectAtTime;
const sourceTime = layer.sourceTime;
const sampleImage = layer.sampleImage;
const toComp = layer.toComp;
const fromComp = layer.fromComp;
const toWorld = layer.toWorld;
const fromWorld = layer.fromWorld;
const toCompVec = layer.toCompVec;
const fromCompVec = layer.fromCompVec;
const toWorldVec = layer.toWorldVec;
const fromWorldVec = layer.fromWorldVec;
const fromCompToSurface = layer.fromCompToSurface;

// Atributes Requiring thisProperty
const velocity = property.velocity;
const numKeys = property.numKeys;
const propertyIndex = property.propertyIndex;

// Methods Requiring thisProperty
const valueAtTime = property.valueAtTime;
const velocityAtTime = property.velocityAtTime;
const speedAtTime = property.speedAtTime;
const wiggle = property.wiggle;
const temporalWiggle = property.temporalWiggle;
const smooth = property.smooth;
const loopIn = property.loopIn;
const loopOut = property.loopOut;
const loopInDuration = property.loopInDuration;
const loopOutDuration = property.loopOutDuration;
const key = property.key;
const nearestKey = property.nearestKey;
const propertyGroup = property.propertyGroup;
const points = property.points;
const inTangents = property.inTangents;
const outTangents = property.outTangents;
const isClosed = property.isClosed;
const pointsOnPath = property.pointsOnPath;
const tangentOnPath = property.tangentOnPath;
const normalOnPath = property.normalOnPath;
const createPath = property.createPath;

function attachKeys(inKeys = 2, outKeys = 2) {
  if (inKeys >= 1 && outKeys >= 1) { // There is in and out animation

    const outStart = outPoint - (key(numKeys).time - key(numKeys - outKeys).time);
    const inFinish = inPoint + (key(inKeys).time - key(1).time);

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

    const outStart = outPoint - (key(outKeys).time - key(1).time);

    if (time < outStart) {
      return valueAtTime(key(1).time);
    } else {
      return valueAtTime(key(1).time + time - outStart);
    }

  } else if (inKeys >= 2 && outKeys == 0) { // Animation in only

    const inFinish = inPoint + (key(inKeys).time - key(1).time);

    if (time < inPoint) {
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

function bounceKeys(amp = .12, freq = 2.5, decay = 8, keyMin = 1, keyMax = numKeys) {
  let curKey = 0;
  let t = 0;

  // Set curKey to the previous keyframe
  if (numKeys > 0) {
    curKey = nearestKey(time).index;
    if (key(curKey).time > time) {
      curKey--;
    }
  }

  // Set t to the time to curKey
  if (curKey !== 0) {
    t = time - key(curKey).time;
  }

  if (curKey > 0 && curKey >= keyMin && curKey <= keyMax && t < 3) {
    let v = velocityAtTime(key(curKey).time - thisComp.frameDuration / 10);
    return add(value, mul(v, amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t)));
  } else {
    return value;
  }
}

function getPathFromPoints(points, closed = true) {
  const pathPoints = points.map(item => fromCompToSurface(item));
  return createPath(pathPoints, [], [], closed);
}

function gridPoints(options = {}) {

  const {
    rows = 3,
    columns = 3,
    rowNum = 1,
    columnNum = 1,
    gridSize = [thisComp.width, thisComp.height],
  } = options;

  const columnWidth = gridSize[0] / columns;
  const rowHeight = gridSize[1] / rows;

  const topLeft = [columnWidth * (columnNum - 1), rowHeight * (rowNum - 1)];
  const topRight = add(topLeft, [columnWidth, 0]);

  const bottomLeft = add(topLeft, [0, rowHeight]);
  const bottomRight = add(topRight, [0, rowHeight]);

  return [topLeft, topRight, bottomRight, bottomLeft];
}

function hideLayerWhenBelow(layerIndex = index - 1) {
  let aboveLayer;
  try {
    aboveLayer = thisComp.layer(layerIndex);
    if (time < aboveLayer.inPoint) {
      // Before above layer starts
      return 100;
    } else {
      // After above layer starts
      return 0;
    }
  } catch (err) {
    // Layer is first layer
    return 100;
  }
}

function getIsometricPosition(position, offset = [0, 0]) {
  const xGrid = position[0];
  const yGrid = position[1];

  const x = (xGrid * 1.75 - yGrid);
  const y = (xGrid + yGrid / 1.75)

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
    [layerLeft - buffer, layerTop + layerHeight + buffer]
  ];

  return createPath(maskPoints, [], [], true);
}

function layerSize(layerIndex = thisLayer.index, sampleTime = time) {
  const layerSize = [
    thisComp.layer(layerIndex).sourceRectAtTime(sampleTime, false).width,
    thisComp.layer(layerIndex).sourceRectAtTime(sampleTime, false).height

  ];
  return (layerSize);
}

function effectSearch(effectName) {
  const totalEffects = thisLayer("Effects").numProperties;
  let selectEffects = 0;
  if (effectName != null) {

    for (i = 1; i <= totalEffects; i++) {
      if (thisLayer("Effects")(i).name.toLowerCase().indexOf(effectName) > -1) {
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
      return Math.max(sourceText.split(/[^\r\n\3]*/gm).length - 1, 0);
    case "char":
      return sourceText.length;
    default:
      return null;
  }
}

function padNumber(number, length) {
  return `${number}`.padStart(length, '0');
}

function commaNum(inputNum) {
  // Expression courtesy of Dab Ebberts
  let number = '' + Math.round(inputNum);
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
  const lines = string.split(/[\r\n\3]+/g);
  const limitedLines = lines.map((item) => {
    return item.replace(/^\s+|\s+$/g, '').substring(0, maxCharacters);
  });

  return limitedLines.slice(0, maxLines + 1).join("\n");
}

function hideDescenders(string, hideTime = -500) {
  const numLines = textCount(string, 'line');
  const descenderFreeLines = 'X\r'.repeat(numLines - 1) + 'X'
  return (time < hideTime) ? descenderFreeLines : string;
}

function getKeyframesAsArray() {
  let keys = [];
  for (let i = 1; i <= numKeys; i++) {
    const thisKey = {
      time: key(i).time,
      value: key(i).value
    };
    keys.push(thisKey);
  }
  return keys;
}

function circularMotion(radius = 200, revolutionTime = 1, startAngle = -90) {
  const startRadians = degreesToRadians(startAngle);
  const angularSpeed = 2 * Math.PI / revolutionTime;
  const xt = radius * Math.cos(angularSpeed * time + startRadians);
  const yt = radius * Math.sin(angularSpeed * time + startRadians);
  return [xt, yt]
}

function countdown(length = outPoint - inPoint, speed = 1) {
  const clockTime = Math.max(length - speed * (time - inPoint), 0);
  const clock = Math.floor(clockTime);
  const min = Math.floor((clock % 3600) / 60);
  const sec = Math.floor(clock % 60);
  return `${min}:${padNumber(sec, 2)}`
}

function scaleToFit(
  inputSize, maxSize, toggles = {
    onlyScaleDown: false, onlyScaleUp: false, uniform: true,
  }
) {
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

  return toggles.uniform ?
    [100 * scaleFactor, 100 * scaleFactor] :
    [100 * scaleFactorWidth, 100 * scaleFactorHeight];
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

function breakWithoutOrphans(string, maxCharacters, minWords, options = {
  minCharacters: 12,
  characterStep: 4,
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
  textCount,
  padNumber,
  commaNum,
  cleanLines,
  hideDescenders,
  getKeyframesAsArray,
  circularMotion,
  countdown,
  scaleToFit,
  breakWithoutOrphans,
}
    
}
}