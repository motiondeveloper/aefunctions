# aefunctions

**aeFunctions** is a library of useful functions use in for Adobe After Effects expressions, in the form of an importable JSON file. This saves copy-pasting large amounts of code, allowing each function to be used multiple times in a project while only having the one source.

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

## Function List

You can read a brief description of each function below, as well its input parameters. The full code for each function can be found in the `aefunctions.jsx` file.

### attachKeys

   ```javascript
   attachKeys(inKeys, outKeys);
   ```

   Attaches a specified number of keyframes to the in and out point of a layer, so you can trim the layer and your keyframed animation will follow. Takes the number of in and out keyframes to attach as input.

### hideLayerWhenBelow

   ```javascript
   hideLayerWhenBelow(layerIndex);
   ```

   Returns an opacity of 0 if the specified layer has started, otherwise returns 100. Useful for quickly working with lots of stacked layers in After Effects. Takes the layer index (integer) or layer name (string) as input.

### layerBoundsPath

   ```javascript
   layerBoundsPath(buffer, sourceLayer, extend, sampleTime);
   ```

   Returns a path that is a rectangle the size of the specified layer, plus a given buffer. Takes the buffer amount, source layer, whether to include extents, and a sample time as optional inputs. If no inputs a given, it defaults to `0`, `thisLayer`, `false` and `time`.

### layerSize

   ```javascript
   layerSize(layerIndex, sampleTime);
   ```

   Returns the width and height of a layer as an array. Takes the layer (index or name) and sample time as input. If no sampleTime parameter is given, a default of the current time is used.

### effectSearch

   ```javascript
   effectSearch(effectName);
   ```

   Returns the number of effects with a certain name, or the total number of effects if no name is given. Takes the effect name to search for as input.

### textCount

   ```javascript
   textCount(sourceText, type);
   ```

   Returns the number of words, lines or characters in a string. Takes a string and the type of count, either `"word"`, `"line"` or `"char"`. If no count type is specified, a default of `"word"` is used.

### isometricPosition

   ```javascript
   isometricPosition(pointControl, offset);
   ```

   Takes a set of 2D coordinates from a point control effect and returns isometric positions. Takes the name of the point control and an offset array as input.

### bounceKeys

   ```javascript
   bounceKeys(amp, freq, decay, keyMin, keyMax);
   ```

   Adds a bounce effect to the keyframes within a specified range. Somewhat untested.
   Adapted from [Danny Jenkins' bounce script](http://dannyjenkins.com.au/After-Effects-Expressions).

### padNumber

   ```javascript
   padNumber(num, length);
   ```

   Adds leading zeros to a number, up to a specified total length.

### commaNum

   ```javascript
   commaNum(num);
   ```

   Rounds and adds commas to a number (e.g. "100,000,000). Original function courtesy of Dan Ebberts.

### repeatString

   ```javascript
   repeatString(string, numTimes);
   ```

   Similar to the `.repeat()` method found added to the ECMAScript 2015 Javascript specification. Returns a given string repeated a given number of times.

### cleanString

   ```javascript
   cleanString(string);
   ```

   Removes leading and trailing whitespace from each line of a given string.

### keyframesToArray

   ```javascript
   keyframesToArray();
   ```

   Returns an array of keyframes, where each element is an object with `.time` and `.value` properties. Takes no inputs.

### circularMotion

   ```javascript
   circularMotion(radius, revolutionTime, startAngle);
   ```

   Returns an animated, 2 dimensional value that moves in a circle according to a given `radius`, `revolutionTime` (time to complete one revolution), and `startAngle`.

### circularPosition

   ```javascript
   circularPosition(radius, angle);
   ```

   Returns a position along a circle according to a given `radius` and `angle`.

## License

This project is licensed under the terms of the MIT license.

## Contact

If you have any questions, feedback or anything else feel free to contact me at:

`tim@haywood.org`
