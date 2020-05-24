(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : ((global = global || self), (global.superoverload = factory()));
})(this, function() {
  'use strict';

  var TYPE_REGEX = /\s([a-zA-Z]+)/;
  /**
   * Returns type of `arg`
   */

  function getType(arg) {
    if (arg === null) {
      return 'null';
    } else if (arg === void 0) {
      return 'undefined';
    }

    var groups = Object.prototype.toString.call(arg).match(TYPE_REGEX);

    if (!Array.isArray(groups)) {
      throw new Error('Unexpected type of arg '.concat(String(arg)));
    }

    return groups[1].toLowerCase();
  }

  /**
   * Transforms array into array of pairs [0, 1, 2, 3] => [[0, 1], [2, 3]]
   */
  function pair(array) {
    var result = [];

    for (var i = 0, len = array.length; i < len; i++) {
      var element = array[i];
      var index = Math.floor(i / 2);
      result[index] = result[index] || [];
      result[index].push(element);
    }

    return result;
  }

  /**
   * Returns serialized signature as a string
   */
  function serializeSignature(array) {
    return array
      .map(function(_, index) {
        return '_'.concat(index);
      })
      .join(',');
  }

  var SUPPORTED_TYPES = toObject([
    'number',
    'string',
    'array',
    'object',
    'function',
    'regexp',
    'date',
  ]);
  /**
   * Creates object from array
   *
   * @private
   */

  function toObject(elements) {
    return elements.reduce(function(acc, element) {
      acc[element] = true;
      return acc;
    }, {});
  }
  /**
   * Returns unsupported types from function's signature
   */

  function getUnsupportedTypes(signature) {
    return signature.filter(function(type) {
      return !SUPPORTED_TYPES[type];
    });
  }

  /**
   * This function is used to identify strings for compression, see `src/babel-plugin-compress-template-literals`
   */

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
   */
  function overload() {
    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    var defaultFn = args.length % 2 > 0 ? args.shift() : null;
    var pairs = pair(args);
    var ifsArray = new Array(pairs.length);
    var fns = new Array(pairs.length);
    var longestSignature = [];

    for (var i = 0; i < pairs.length; i++) {
      var _pair = pairs[i];
      var signature = _pair[0];
      var fn = _pair[1];
      var unsupportedTypes = getUnsupportedTypes(signature);

      if (unsupportedTypes.length > 0) {
        throw new Error(
          'Signature "'
            .concat(signature.join(', '), '" contains unsupported types: "')
            .concat(unsupportedTypes.join(', '), '"'),
        );
      }

      var hashKey = signature.join(', ');
      fns[i] = fn;

      if (signature.length > longestSignature.length) {
        longestSignature = signature;
      }

      ifsArray[i] = "if(hashKey==='"
        .concat(hashKey, "'){return fns[")
        .concat(String(i), '].call(this,')
        .concat(serializeSignature(signature), ');}');
    }

    var ifs = ifsArray.join(' else ');
    var serializedSignature = serializeSignature(longestSignature);
    var code = 'return function overloadedFn('
      .concat(
        serializedSignature,
        "){var hashKey='';var len=arguments.length;var args=new Array(len);for(var i=0;i<len;i++){args[i]=arguments[i];}for(var i=0;i<len;i++){hashKey+=getType(args[i]);if(i!==len-1){hashKey+=', ';}}",
      )
      .concat(ifs)
      .concat(
        pairs.length > 0 ? 'else {' : '',
        "if(!defaultFn){throw new Error('No matching function for call with signature \"'+hashKey+'\"');}",
      )
      .concat(
        pairs.length > 0 ? '}' : '',
        'return defaultFn.apply(this,args);}',
      );
    var superFunc = new Function('getType, fns, defaultFn', code); // $FlowFixMe errors with `new Function(...)`

    return superFunc(getType, fns, defaultFn);
  }

  return overload;
});
