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
                //i is always valid index in the arguments object
        args[i] = arguments[i];
    }
    if (args.length % 2 > 0) {
        var defaultFn = args.shift();
    }
    var pairs = pair(args),
        fns = new Array(pairs.length);

    var sample = 'if (hashKey === "%sig%") { return fns[%i%].call(this, %args%) }',
        maxArgs = [];

    var code = [
            'var hashKey = "";',
            'for (var i = 0, len = arguments.length; i < len; i++) {hashKey += getType(arguments[i]);if (i !== len - 1) {hashKey += \', \';}}'
        ]
        .concat(pairs.map(function(pair, index) {
            var signature = pair[0];
            var fn = pair[1];
            var hashKey = signature.join(', ');

            fns[index] = fn;
            if (signature.length > maxArgs.length) {
                maxArgs = signature;
            }

            return sample
                .replace('%sig%', hashKey)
                .replace('%i%', index)
                .replace('%args%', signature.map(function(sig, sigIndex) {return '_' + sigIndex}).join(','));
        }).join(' else '));

    var argsForCall = maxArgs.map(function(arg, argIndex) { return '_' + argIndex}).join(',');

    code = code.concat([
            pairs.length ? ' else { ' : '',
            'if (!defaultFn) {throw new Error(\'No matching function for call with signature "\' + hashKey + \'"\');}',
            pairs.length ? '}' : '',
            ' return defaultFn.call(this, ' + (argsForCall || 'null') + ');'
        ]);

    var superCode = [
            'return function(' + argsForCall + ') {'
        ]
        .concat(code)
        .concat([
            '}'
        ])
        .join('');

    var superFunc = new Function('getType,fns,defaultFn', superCode);

    return superFunc(getType,fns,defaultFn);
}
