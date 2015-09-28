'use strict';

var jsonpack = require('jsonpack');
var _ = require('lodash');

(function () {
    var Smaki = (function () {
        var Smaki = function Smaki(json, options) {
            options = options || {};

            // Setup defaults
            this._delim = options.delim || ':';
            this._data = json || {};
        };

        // Get data
        Smaki.prototype.get = function get(key) {
            var paths = key;

            if (typeof key === 'string') {
                paths = key.split(this._delim);
            }

            var current = this._data;

            for (var i = 0; i < paths.length; ++i) {
                if (current[paths[i]] == undefined) {
                    return undefined;
                } else {
                    current = current[paths[i]];
                }
            }
            return current;
        };


        // Return an array of objects according to key, value, or key and value matching
        Smaki.prototype.getObjects = function getObjects(key, val, obj) {
            obj = obj || this._data;
            var objects = [];

            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;

                // If key matches and value matches or if key matches and value is not
                // passed (eliminating the case where key matches but passed value does not)
                if (_.isEqual(i, key) && _.isEqual(obj[i], val) || _.isEqual(i, key) && !val) { //
                    objects.push(obj);
                } else if (_.isEqual(obj[i], val) && !key) {
                    // Only add if the object is not already in the array
                    if (objects.lastIndexOf(obj) == -1) {
                        objects.push(obj);
                    }
                } else if (typeof obj[i] == 'object') {
                    objects = objects.concat(this.getObjects(key, val, obj[i]));
                }

            }

            return objects;
        };

        // Return an array of paths according to key, value, or key and value matching
        Smaki.prototype.getPaths = function getPaths(key, val, obj, stringify, path) {
            obj = obj || this._data;
            var paths = [];

            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                var pathAux = _.clone(path || []);

                // If key matches and value matches or if key matches and value is not
                // passed (eliminating the case where key matches but passed value does not)
                if (_.isEqual(i, key) && _.isEqual(obj[i], val) || _.isEqual(i, key) && !val) { //
                    paths.push(pathAux);
                } else if (_.isEqual(obj[i], val) && !key) {
                    // Only add if the object is not already in the array
                    if (paths.lastIndexOf(obj) == -1) {
                        paths.push(pathAux);
                    }
                } else if (typeof obj[i] == 'object') {
                    pathAux.push(i);
                    paths = paths.concat(this.getPaths(key, val, obj[i], false, pathAux));
                }

            }

            if (stringify) {
                for (var j in paths) {
                    paths[j] = paths[j].join(this._delim);
                }
            }

            return paths;
        };

        // Return an array of values that match on a certain key
        Smaki.prototype.getValues = function getValues(key, obj) {
            obj = obj || this._data;
            var objects = [];

            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (_.isEqual(String(i), String(key))) {
                    objects.push(obj[i]);
                } else if (typeof obj[i] == 'object') {
                    objects = objects.concat(this.getValues(key, obj[i]));
                }
            }

            return objects;
        };

        // Return an array of keys that match on a certain value
        Smaki.prototype.getKeys = function getKeys(val, obj) {
            obj = obj || this._data;
            var objects = [];

            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (_.isEqual(String(obj[i]), String(val))) {
                    objects.push(i);
                } else if (typeof obj[i] == 'object') {
                    objects = objects.concat(this.getKeys(val, obj[i]));
                }
            }

            return objects;
        };

        // Compress data
        Smaki.prototype.compress = function serialize(json) {
            return this._serialized = jsonpack.pack(json || this._data);
        };

        // Uncompress data
        Smaki.prototype.uncompress = function deserialize(json) {
            return this._data = jsonpack.unpack(json || this._serialized || this._data);
        };


        // Return an array of objects according to key, value, or key and value matching
        Smaki.prototype.deleteObject = function deleteObject(key, val, obj) {
            obj = obj || this._data;

            if (!key) {
                return false;
            }

            var paths = this.getPaths(key, val, _.cloneDeep(obj));

            for (var i in paths) {
                var path = paths[i];

                if (typeof paths[i] === 'string') {
                    path = paths[i].split(this._delim);
                }

                var current = obj;

                for (var i = 0; i < path.length; ++i) {
                    if (current[path[i]] == undefined) {
                        return undefined;
                    } else {
                        current = current[path[i]];

                        if ((i === path.length - 1) && current[key]) {

                            delete current[key];
                        }
                    }
                }
            }

            return obj;
        };

        // Return an array of objects according to key, value, or key and value matching
        Smaki.prototype.updateObject = function deleteObject(key, val, oldVal, obj) {
            obj = obj || this._data;

            if (!key) {
                return false;
            }

            var paths = this.getPaths(key, oldVal, _.cloneDeep(obj));

            for (var i in paths) {
                var path = paths[i];

                if (typeof paths[i] === 'string') {
                    path = paths[i].split(this._delim);
                }

                var current = obj;

                for (var i = 0; i < path.length; ++i) {
                    if (current[path[i]] == undefined) {
                        return undefined;
                    } else {
                        current = current[path[i]];

                        if ((i === path.length - 1) && current[key]) {

                            current[key] = val;
                        }
                    }
                }
            }

            return obj;
        };

        return Smaki;
    })();

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = Smaki;
    }
    else {
        if (typeof define === 'function' && define.amd) {
            define([], function () {
                return Smaki;
            });
        }
        else {
            window.Smaki = Smaki;
        }
    }
})();
