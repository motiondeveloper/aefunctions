# aefunctions

**aeFunctions** is a library of useful functions use in for Adobe After Effects expressions, in the form of an importable JSON file. This saves copy-pasting large amounts of code, allowing each function to be used multiple times in a project while only having the one source.

## Table of Contents

- [Compatibility](#compatibility)
- [Usage](#usage)
- [Example](#example)
- [License](#license)
- [Function List](#function-list)
  - [Strings](#strings)
  - [Numbers](#numbers)
  - [Keyframes](#keyframes)
  - [Position](#position)
  - [Layer](#layer)
  - [Other](#other)

## Compatibility

This version of `aefunctions` is compatible with After Effects versions >= 16.0.1 (CC2019) which uses the new [Javascript engine](https://helpx.adobe.com/after-effects/using/expression-language-reference.html).

For a legacy version that works in the ExtendScript engine, view the [Extendscript Branch](https://github.com/motiondeveloper/ekeys/extendscript). Please note, this version of `aefunctions` is not actively maintained.

## Usage

1. **Download the [aefunctions.jsx](https://raw.githubusercontent.com/timhaywood/aeFunctions/master/aefunctions.jsx) file and import it into your After Effects project.**

   (Right click, save link as).

2. **Create a reference to the library in an expression:**

   ```javascript
   var funcLib = footage("aefunctions.jsx").sourceData;
   ```

   (You can name the library whatever you'd like).

3. **Access the functions in your expression:**

    ```javascript
    funcLib.functionName(inputParameters);
    ```

    `functionName` and `inputParameters` must be replaced with the correct name and inputs of the function you wish to use, as listed below.

## Example

   An example expression that uses the library is:

   ```javascript
   var funcLib = footage("aefunctions.jsx").sourceData;
   funcLib.attachKeys(2, 2);
   ```

## License

This project is licensed under the terms of the MIT license.

----------

## Function List

You can read a brief description of each function below, as well its input parameters. The full code for each function can be found in the `aefunctions.jsx` file.

### Strings

- **textCount**

  ```javascript
  textCount(sourceText, type);
  ```

  Returns the number of words, lines or characters in a string. Takes a string and the type of count, either `"word"`,`"line"` or `"char"`. If no count type is specified, a default of `"word"` is used.

- **cleanString**

  ```javascript
  cleanString(string, maxLines, maxCharacters);
  ```

  Limits the maximum number of lines, as well as performing the following actions on each line:

  - Limiting the number of characters
  - Removing leading and trailing whitespace

- **repeatString**

  ```javascript
  repeatString(string, numTimes);
  ```

  Similar to the `.repeat()` method found added to the ECMAScript 2015 Javascript specification. Returns a given string repeated a given number of times.

- **textLayerIsEmpty**

  ```javascript
  textLayerIsEmpty(layer);
  ```

  Returns true is the `sourceText` property of a layer is empty, or false otherwise.

- **textLayersAreAllEmpty**

  ```javascript
  textLayersAreAllEmpty(layers);
  ```

  Returns true if all the text layers in an array have an empty `sourceText` property.

- **getLastNonEmptyTextLayer**

  ```javascript
  getLastNonEmptyTextLayer(layers);
  ```

  Returns the last layer in an array that doesn't have an empty `sourceText` property. Useful aligning content with the top or bottom of a text stack.

- **getFirstNonEmptyTextLayer**

  ```javascript
  getFirstNonEmptyTextLayer(layers);
  ```

  Returns the first layer in an array that doesn't have an empty `sourceText` property. Useful aligning content with the top or bottom of a text stack.

### Numbers

- **padNumber**

  ```javascript
  padNumber(num, length);
  ```

  Adds leading zeros to a number, up to a specified total length.

- **commaNum**

  ```javascript
  commaNum(num);
  ```

  Rounds and adds commas to a number (e.g. "100,000,000). Original function courtesy of Dan Ebberts.

- **countdown**

  ```javascript
  countdown(length, speed);
  ```

  Returns an string in the format `minutes:seconds`, counting down to zero from a specified number of seconds. An optional `speed` value can be given to mofify the countdown rate (defaults to `1`).

### Keyframes

- **attachKeys**

  ```javascript
  attachKeys(inKeys, outKeys);
  ```

  Attaches a specified number of keyframes to the in and out point of a layer, so you can trim the layer and your keyframed animation will follow. Takes the number of in and out keyframes to attach as input.

- **bounceKeys**

  ```javascript
  bounceKeys(amp, freq, decay, keyMin, keyMax);
  ```

  Adds a bounce effect to the keyframes within a specified range. Somewhat untested.
  Adapted from [Danny Jenkins' bounce script](http://dannyjenkins.com.au/After-Effects-Expressions).

- **keyframesToArray**

  ```javascript
  keyframesToArray();
  ```

  Returns an array of keyframes, where each element is an object with `.time` and `.value` properties. Takes no inputs.

### Position

- **isometricPosition**

  ```javascript
  isometricPosition(pointControl, offset);
  ```

  Takes a set of 2D coordinates from a point control effect and returns isometric positions. Takes the name of the point control and an offset array as input.

- **circularMotion**

  ```javascript
  circularMotion(radius, revolutionTime, startAngle);
  ```

  Returns an animated, 2 dimensional value that moves in a circle according to a given `radius`, `revolutionTime` (time to complete one revolution), and `startAngle`.

- **circularPosition**

  ```javascript
  circularPosition(radius, angle);
  ```

  Returns a position along a circle according to a given `radius` and `angle`.

### Layer

- **layersToLayerNames**

  ```javascript
  layersToLayerNames(layers);
  ```

  Returns an array of the names of all the layers in a given array.

- **layerNamesToLayers**

  ```javascript
  layerNamesToLayers(layersNames);
  ```

  Given an array of layer names, it returns an array of their perspective layers.

- **layerBoundsPath**

  ```javascript
  layerBoundsPath(buffer, sourceLayer, extend, sampleTime);
  ```

  Returns a path that is a rectangle the size of the specified layer, plus a given buffer. Takes the buffer amount, source layer, whether to include extents, and a sample time as optional inputs. If no inputs a given, it defaults to `0`, `thisLayer`, `false` and `time`.

- **layerTopLeft**

  ```javascript
  layerTopLeft(layer);
  ```

  Returns the top-left point of a given layer, in composition space.

- **heightIsZero**

  ```javascript
  heightIsZero(layer);
  ```

  Returns true if a layers height is 0, otherwise returns false.

- **layerIsHidden**

  ```javascript
  layerIsHidden(layer);
  ```

  Returns true if the opacity value of a layer is 0, otherwise returns false.

- **layerSize**

  ```javascript
  layerSize(layerIndex, sampleTime);
  ```

  Returns the width and height of a layer as an array. Takes the layer (index or name) and sample time as input. If no sampleTime parameter is given, a default of the current time is used.

### Other

- **effectSearch**

  ```javascript
  effectSearch(effectName);
  ```

  Returns the number of effects with a certain name, or the total number of effects if no name is given. Takes the effect name to search for as input.

- **hideLayerWhenBelow**

  ```javascript
  hideLayerWhenBelow(layerIndex);
  ```

  Returns an opacity of 0 if the specified layer has started, otherwise returns 100. Useful for quickly working with lots of stacked layers in After Effects. Takes the layer index (integer) or layer name (string) as input.