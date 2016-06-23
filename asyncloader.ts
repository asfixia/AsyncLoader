/**
 * Created by: DaniloMalzao.
 * License: MIT.
 * Date: 23/06/2016.
 * Avaiable at: <https://github.com/danilomalzao/AsyncLoader/>
 * Load asynchronously resources 'javascript' and 'css' and execute a callback function.
 */
module AsyncLoader {

    /**
     * Object containing the mapping of 'resources url' and 'current loading state'.
     *
     * @type {{}} A object that is used as a map to: [Url, LoadState];
     */
    let _loadscript = {};

    /**
     * Object that contains each resource combination that still loading.
     * @type {Array} Contains the association of the loading libraries and the respective callback functions.
     *   Example: [ [ ['url1','url2',...],[callback1,callback2,...],... ], ... ]
     */
    let _relatedscripts:Array<Array<any>> = [];

    /**
     * Current state of the loading of the resource.
     */
    const enum LoadState {
        LOADING,
        COMPLETED
    }

    /**
     * Load all srcs resources, and call the callback function.
     *
     * Resource are:
     * A javascript url file : '.js';
     * A Css url file : '.css';
     * By default the url is interpreted as a javascript file.
     *
     * @param src String or the Array<String> that contains multiples resources.
     * @param callback Function to be called after the scripts load.
     */
    export function loadScriptOnce(src:string | Array<string>, callback) {
        let srcArr:Array<string> = isArray(src) ? <Array<string>>src : Array(<string>src);
        loadScriptsOnce(srcArr, callback);
    }

    /**
     * Verify if arg is a array.
     * @param arg Object to be checked if is a array.
     * @returns {boolean} Returns True if 'arg' a array, otherwise returns False.
     */
    function isArray(arg:any) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    }

    /**
     * Gets the extension from a path without the dot separator.
     *
     * @param path Path or url to a file.
     * @returns {string} Returns the substring after the last '.' until the end.
     */
    function getExtension(path:string) {
        path = path || "";
        return path.substr(path.lastIndexOf('.') + 1);
    }

    /**
     * Loads a script and calls the callback function.
     *
     * Script based on <http://stackoverflow.com/questions/7718935/load-scripts-asynchronously>
     *
     * @param src Url to the resource to be loaded.
     * @param callback Function to be called, after the src load.
     */
    function loadScript(src:string, callback:Function) {
        var s,
            r,
            t;
        r = false;
        switch (getExtension(src).toLowerCase()) {
            case "css":
                s = document.createElement('LINK');
                s.type = 'text/css';
                s.href = src;
                s.rel = "stylesheet";
                break;
            case "js":
            default:
                s = document.createElement('script');
                s.type = 'text/javascript';
                break;
        }
        s.src = src;
        s.async = 'true';
        s.onload = s.onreadystatechange = function () {
            //uncomment this line to see which ready states are called.
            if (!r && (!this.readyState || this.readyState == 'complete' || this.readyState == 'loaded')) {
                r = true;
                callback();
            }
        }
        t = document.getElementsByTagName('script')[0];
        t.parentNode.insertBefore(s, t);
    }

    /**
     * Loads all scripts and then runs the callback function.
     *
     * @param srcArr Array<String> Array of resources url, to be loaded.
     * @param callback Function to be called, after complete the loading.
     */
    function loadScriptsOnce(srcArr:Array<string>, callback) {
        srcArr = srcArr.sort();
        filterLoaded(srcArr);
        if (srcArr.length) {
            addLoadCallback(srcArr, callback);
            for (var i = 0; i < srcArr.length; i++) {
                var curSrc = srcArr[i];
                if (_loadscript[curSrc] === undefined) {
                    _loadscript[curSrc] = LoadState.LOADING;
                    loadScript(curSrc, onScriptLoad(curSrc));
                }
            }
        } else
            callback();
    }

    /**
     * Function that bind the current src value to the wasLoaded function.
     * @param src Url of the resource that was lodaded.
     * @returns {function(): void} A function to update the state of the current loaded src.
     */
    function onScriptLoad(src:string) {
        return function () {
            wasLoaded(src);
        };
    }

    /**
     * Update the state of the loaded src, and call all the callback functions that must be called.
     * @param src Source of the resource that was lodaded.
     */
    function wasLoaded(src:string) {
        _loadscript[src] = LoadState.COMPLETED;
        for (var i = _relatedscripts.length - 1; i >= 0; i--) {
            var foundInd = _relatedscripts[i][0].indexOf(src);
            if (foundInd !== -1) {
                _relatedscripts[i][0].splice(foundInd, 1);
                if (_relatedscripts[i][0].length === 0) {
                    var entry = _relatedscripts.splice(i, 1);
                    var callbacks = entry[0][1];
                    while (callbacks.length) {
                        callbacks.pop()();
                    }
                }
            }
        }
    }

    /**
     * Filter all resources that were already loaded.
     * The srcArr itself is modified.
     * @param srcArr Array of the sources that will be filtered.
     */
    function filterLoaded(srcArr:Array<string>) {
        for (var i = srcArr.length - 1; i >= 0; i--)
            if (_loadscript[srcArr[i]] && _loadscript[srcArr[i]] === LoadState.COMPLETED)
                srcArr.splice(i, 1);
    }

    /**
     * Verify if two arrays are equals.
     * @param arr1 Array one.
     * @param arr2 Array two.
     * @returns {boolean} True if both were equals, False otherwise.
     */
    function areArrayEquals(arr1:Array<string>, arr2:Array<string>) {
        var equivalent = arr1.length == arr2.length;
        for (var i = 0; equivalent && i < arr1.length; i++)
            equivalent = equivalent && arr1[i] === arr2[i];
        return equivalent;
    }

    /**
     * Add a callback function to be executed when the sources were loaded.
     * @param loadingSrcs Sources that must be loaded.
     * @param callback The callback function to be executed.
     */
    function addLoadCallback(loadingSrcs:Array<string>, callback:Function) {
        var wasFound = false;
        for (var i = 0, size = _relatedscripts.length; !wasFound && i < size; i++) {
            if (areArrayEquals(_relatedscripts[i][0], loadingSrcs)) {
                _relatedscripts[i][1].push(callback);
                wasFound = true;
            }
        }
        if (!wasFound)
            _relatedscripts.push([loadingSrcs, [callback]]);
    }
}