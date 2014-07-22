'use strict';


var getType = require('./getType');
var pair = require('./pair');
module.exports = overload;

/**
 * Function overload implementation
 *
 * Takes signatures and functions as arguments, like this:
 *
 * var fn = overload(
 *     ['number'],
 *     function (a) { return 'It is a number'; },
 *
 *     ['string'],
 *     function (a) { return 'It is a string'; }
 * )
 *
 * fn(1); // => 'It is a number'
 * fn(''); // => 'It is a string'
 *
 * Returns an overloaded function, that will call the function with corresponding signature
 *
 * Fallback function can be passed as a first argument, like this:
 *
 * var fn = overload(
 *     function (a) { return 'It is something else'; },
 *
 *     ['number'],
 *     function (a) { return 'It is a number'; }
 * )
 *
 * fn(1); // => 'It is a number'
 * fn(''); // => 'It is something else'
 *
 * @return {function}
 */
function overload() {
    var args = new Array(arguments.length);
    for(var i = 0; i < args.length; ++i) {
        args[i] = arguments[i];
    }
    if (args.length % 2 > 0) {
        var defaultFn = args.shift();
    }
    var pairs = pair(args);
    return function () {
        var args = new Array(arguments.length);
        for(var i = 0; i < args.length; ++i) {
            args[i] = arguments[i];
        }
        var pair = pairs.filter(function (pair) {
            var signature = pair[0];
            return args.length === signature.length && args.every(function (arg, index) {
                return getType(arg) === signature[index];
            });
        })[0];
        if (!pair) {
            if (!defaultFn) {
                var description = args.map(getType).join(', ');
                throw new Error('No matching function for call with signature "' + description + '"');
            }

            return defaultFn.apply(this, arguments);
        }
        var fn = pair[1];
        return fn.apply(this, arguments);
    };
}
