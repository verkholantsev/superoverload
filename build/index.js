(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory())
        : typeof define === 'function' && define.amd ? define(factory) : (global.superoverload = factory());
})(this, function() {
    'use strict';

    var TYPE_REGEX = /\s([a-zA-Z]+)/;

    /**
     * Returns type of `arg`
     *
     * @param {*} arg
     * @return {string}
     */
    function getType(arg) {
        if (arg === null) {
            return 'null';
        } else if (arg === void 0) {
            return 'undefined';
        }
        return Object.prototype.toString
            .call(arg)
            .match(TYPE_REGEX)[1]
            .toLowerCase();
    }

    /**
     * Transforms array into array of pairs [0, 1, 2, 3] => [[0, 1], [2, 3]]
     *
     * @param {array} array
     * @return {array}
     */
    function pair(array) {
        return array.reduce(function(result, element, i) {
            i = parseInt(i / 2, 10);
            result[i] = result[i] || [];
            result[i].push(element);
            return result;
        }, []);
    }

    /**
     *
     * @param {array} array
     * @return {string}
     */
    function serializeSignature(array) {
        return array
            .map(function(arg, index) {
                return '_' + index;
            })
            .join(',');
    }

    /**
     * Function overload implementation
     *
     * Takes signatures and functions as arguments, like this:
     *
     * const fn = overload(
     *     ['number'],
     *     a =>'It is a number',
     *
     *     ['string'],
     *     a => 'It is a string'
     * )
     *
     * fn(1); // => 'It is a number'
     * fn(''); // => 'It is a string'
     *
     * Returns an overloaded function, that will call the function with corresponding signature
     *
     * Fallback function can be passed as a first argument, like this:
     *
     * const fn = overload(
     *     a => 'It is something else',
     *
     *     ['number'],
     *     a => 'It is a number'
     * )
     *
     * fn(1); // => 'It is a number'
     * fn(''); // => 'It is something else'
     *
     * @return {function}
     */
    function overload() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var defaultFn = args.length % 2 > 0 ? args.shift() : null;
        var pairs = pair(args);
        var fns = new Array(pairs.length);
        var longestSignature = [];

        var ifs = pairs
            .map(function(pair$$1, index) {
                var sample = 'if (hashKey === "%signature%") { return fns[%index%].call(this, %args%); }';
                var signature = pair$$1[0];
                var fn = pair$$1[1];
                var hashKey = signature.join(', ');

                fns[index] = fn;
                if (signature.length > longestSignature.length) {
                    longestSignature = signature;
                }

                return sample
                    .replace('%signature%', hashKey)
                    .replace('%index%', index)
                    .replace('%args%', serializeSignature(signature));
            })
            .join(' else ');

        var serializedSignature = serializeSignature(longestSignature);
        var code =
            'return function(' +
            serializedSignature +
            ') {\n    var hashKey = \'\';\n    for (var i = 0, len = arguments.length; i < len; i++) {\n        hashKey += getType(arguments[i]);\n        if (i !== len - 1) {\n            hashKey += ", ";\n        }\n    }\n    ' +
            ifs +
            '\n    ' +
            (pairs.length > 0 ? 'else {' : '') +
            "\n    if (!defaultFn) {\n        throw new Error('No matching function for call with signature \"' + hashKey + '\"');\n    }\n    " +
            (pairs.length > 0 ? '}' : '') +
            '\n    return defaultFn.apply(this, arguments);\n}';

        var superFunc = new Function('getType, fns, defaultFn', code);

        return superFunc(getType, fns, defaultFn);
    }

    return overload;
});
