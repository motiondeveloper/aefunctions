<!-- Links -->

[back to top ↑]: #aefunctions

<div align="center">

# aefunctions

Speed up your After Effects expression writing with a library of useful functions.

**[Usage](#usage) | [Example](#example) | [Contact](#contact) | [Function List](#function-list)**

---

### [✨ Download aeFunctions ✨](https://github.com/motiondeveloper/aefunctions/releases)<!-- omit in toc -->

---

</div>

## Overview

**aeFunctions** is a library of useful functions use in for Adobe After Effects expressions, in the form of an importable JSON file. This saves copy-pasting large amounts of code, allowing each function to be used multiple times in a project while only having the one source.

> **eKeys is written in TypeScript using our [Expression Library Template](https://github.com/motiondeveloper/expressions-library-template)**

## Compatibility

This version of `aefunctions` is compatible with After Effects versions >= 16.0.1 (CC2019) which uses the new [Javascript engine](https://helpx.adobe.com/after-effects/using/expression-language-reference.html).

For a legacy version that works in the ExtendScript engine, view the [Extendscript Branch](https://github.com/motiondeveloper/aefunctions/tree/extendscript). Please note, this version of `aefunctions` is not actively maintained.

[Back To Top ↑]

## Usage

1. **Download the latest [aefunctions.jsx](https://github.com/motiondeveloper/aefunctions/releases) from the releases page file and import it into your After Effects project.**

2. **Create a reference to the library in an expression:**

   ```javascript
   const funcLib = footage('aefunctions.jsx').sourceData.getFunctions();
   ```

   (You can name the library variable whatever you'd like).

3. **Access the functions in your expression:**

   ```javascript
   funcLib.functionName(inputParameters);
   ```

   `functionName` and `inputParameters` must be replaced with the correct name and arguments of the function you wish to use, as listed below.

[Back To Top ↑]

## Example

An example expression that uses the library is:

```javascript
const ae = footage('aefunctions.jsx').sourceData.getFunctions();
ae.attachKeys(2, 2);
```

You can also [destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) any required functions:

```javascript
const { attachKeys, countLines } = footage(
  'aefunctions.jsx'
).sourceData.getFunctions();
```

[Back To Top ↑]

## License

This project is licensed under the terms of the MIT license.

[Back To Top ↑]

## Contact

Bugs, issues and feature requests can be submitted by filing an [issue](https://github.com/motiondeveloper/ekeys/issues) on Github. For everything else, feel free to reach out to [@modeveloper](https://twitter.com/modeveloper) on twitter.

[Back To Top ↑]

---

## Function List

You can read a brief description of each function below, as well its input parameters. The full code for each function can be found in the `aefunctions.jsx` file.

**<details><summary>✍️ Strings</summary>**

- **breakWithoutOrphans**

  ```javascript
  breakWithoutOrphans(string, maxCharacters, minWords);
  ```

  Inserts line breaks in a given `string` as per the `maxCharacters` per line, while avoiding the last line having less than the `minWords`.

- **textCount**

  ```javascript
  textCount(sourceText, type);
  ```

  Returns the number of words, lines or characters in a string. Takes a string and the type of count, either `"word"`,`"line"` or `"char"`. If no count type is specified, a default of `"word"` is used.

- **cleanLines**

  ```javascript
  cleanLines(string, maxLines, maxCharacters);
  ```

  Limits the maximum number of lines, as well as performing the following actions on each line:

  - Limiting the number of characters
  - Removing leading and trailing whitespace

- **hideDescenders**

  ```javascript
  hideDescenders(string, hideTime);
  ```

  Hides a modified version of the source string in negative time (defaulting to `-500`) where each line is replaced with an `'X'`. Useful for maintaining positions or anchor points regardless of whether a layer has any descenders (when used with `sourceRectAtTime(hideTime)`).

</details>

**<details><summary>📊 Numbers</summary>**

- **padNumber**

  ```javascript
  padNumber(number, length);
  ```

  Adds leading zeros to a number, up to a specified total length.

- **commaNum**

  ```javascript
  commaNum(number);
  ```

  Rounds and adds commas to a number (e.g. "100,000,000). Original function courtesy of Dan Ebberts.

- **countdown**

  ```javascript
  countdown(length, speed);
  ```

  Returns an string in the format `minutes:seconds`, counting down to zero from a specified number of seconds. An optional `speed` value can be given to mofify the countdown rate (defaults to `1`).

</details>

**<details><summary>🔹 Keyframes</summary>**

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
  getKeyframesAsArray();
  ```

  Returns an array of keyframes, where each element is an object with `.time` and `.value` properties. Takes no inputs.

</details>

**<details><summary>📌 Transform</summary>**

- **isometricPosition**

  ```javascript
  getIsometricPosition(pointControl, offset);
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

- **scaleToFit**

  ```javascript
  scaleToFit(inputSize, maxSize, toggles);
  ```

  Returns a scale (`[###, ###]`) that will fit a given size. `inputSize` and `maxSize` are 2D arrays, and `toggles` is an optional object with the properties `{onlyScaleUp: bool, onlyScaleDown: bool, uniform: true}`.

</details>

**<details><summary>🥞 Layer</summary>**

- **layerBoundsPath**

  ```javascript
  getLayerBoundsPath(buffer, sourceLayer, extend, sampleTime);
  ```

  Returns a path that is a rectangle the size of the specified layer, plus a given buffer. Takes the buffer amount, source layer, whether to include extents, and a sample time as optional inputs. If no inputs a given, it defaults to `0`, `thisLayer`, `false` and `time`.

- **layerSize**

  ```javascript
  layerSize(layerIndex, sampleTime);
  ```

  Returns the width and height of a layer as an array. Takes the layer (index or name) and sample time as input. If no sampleTime parameter is given, a default of the current time is used.

- **layerRect**

  ```javascript
  layerRect(
    ({
      layer = thisLayer,
      sampleTime = time,
      anchor = 'center',
      capHeight = false,
      capHeightTime = -550,
    } = {})
  );
  ```

  An abstraction over the `sourceRectAtTime` method that takes an object based input. If `capHeight` is true, the height of the layer will be measured at the `capHeightTime`, useful when used in with the `hideDescenders()` function. The anchor can be either `center`, `topLeft`, `topRight`, `bottomLeft`, or `bottomRight` (defaulting to `center`).

  Returns an object of the format:

  ```js
  {
    size: [],
    position: [],
    sourceRect,
  }
  ```

  Where `size` is the layer width and height as an array, and `position` is the position of the given `anchor` in composition space. `sourceRect` is the full `sourceRectAtTime()` object.

</details>

**<details><summary>📐 Points</summary>**

- **pointsToPath**

  ```javascript
  getPathFromPoints(points, closed);
  ```

  Returns a path containing the given array of points. `closed` defaults to true. Points are assumed to be in composition space.

- **gridPoints**

  ```javascript
  gridPoints({ rows, columns, rowNum, columnNum, gridSize });
  ```

  Returns a rectangular path that is a cell of a grid.

  - `rows`: The number of rows in the grid
  - `columns`: The number of columns in the grid
  - `rowNum`: The row number of the cell
  - `columnNum`: The column number of the cell
  - `gridSize`: The total size of the grid as a 2D array. Defaults to the composition size.

</details>

**<details><summary>✨ Other</summary>**

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

</details>

<br>

[Back To Top ↑]
