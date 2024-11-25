# AsyncLoader
AsyncLoader is a simple and lightweight javascript library of one file that loads CSS and JS asynchronously.

## Documentation


### AsyncLoader.loadScriptOnce(src: String | String[], callback: Function);
`Loads all resources that were not load yet and then calls the callback function.`
The resources are loaded only once even if multiple calls were made.
If the url ends with '.css' the resource is a stylesheet otherwise it is treated as Javascript.


`@param src {Array{String}|String}` One url or an array of resource urls.

`@param callback {Function}` Function to be called after the scripts load.

## Usage
You can view a [working demo here](https://jsfiddle.net/uqgr89bd/1/).

### Load one resource:
```js
AsyncLoader.loadScriptOnce('https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js', function(){alert('loaded');});
```

### Load multiple resources:
```js
var resources = [
 'https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js',
 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js',
 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css'
];
AsyncLoader.loadScriptOnce(resources, function() {alert('Multiple files')});
```
