# AsyncLoader
AsyncLoader is a simple and lightweight library of one file that loads CSS and JS asynchronously.

## Documentation


### AsyncLoader.loadScriptOnce(src: String | String[], callback);
`Loads all resources that were not load yet and then calls the callback function.`
The resources are loaded only once even if multiple calls were made.
If the url ends with '.css' the resource is a stylesheet otherwise it is treated as Javascript.


`@param src` One url or multiple resource urls.

`@param callback` Function to be called after the scripts load.

## Usage
You can view a [working demo here](https://jsfiddle.net/danilomalzao/kztzv9Lc/).

It can load 'Javascript' and 'CSS' resources for example:

### One resource:
```js
AsyncLoader.loadScriptOnce('https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js', function(){alert('loaded');});
```

### Multiple resources:
```js
var resources = [
 'https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js',
 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js',
 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css'
];
AsyncLoader.loadScriptOnce(resources, function() {alert('Multiple files')});
```
