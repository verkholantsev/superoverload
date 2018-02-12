[![NPM version](https://img.shields.io/github/package-json/v/verkholantsev/superoverload.svg)](https://www.npmjs.com/package/superoverload)
[![Build Status](https://img.shields.io/travis/verkholantsev/superoverload.svg)](https://travis-ci.org/verkholantsev/superoverload)

# Superoverload

_Superoverload_ is a function overload for JavaScript.

## Usage

Superoverload expects functions and their signatures as arguments. Like this:

```javascript
const overload = require('superoverload');

const fn = overload(
    ['number'],
    a => 'It is a number',

    ['string'],
    a => 'It is a string'
);

fn(1); // => 'It is a number'
fn(''); // => 'It is a string'
```

You can pass odd number of arguments, then the fisrt will be interpreted as _default_ function. Default means, that it will be called if all over functions do not have corresponding signature.

```javascript
const overload = require('superoverload');

const fn = overload(
    a => 'It is something else',

    ['number'],
    a => 'It is a number'
);

fn(1); // => 'It is a number'
fn(''); // => 'It is something else'
```

## Optional parameters

Superoverload can be used to declare optional parameters.

```javascript
function getFullUrl(protocol, host, port, path) {
    return protocol + '://' + host + (port ? ':' + port : '') + path;
}

const getUrl = overload(
    ['string'],
    path => getFullUrl('http', 'example.com', '', path),

    ['string', 'string'],
    (host, path) => getFullUrl('http', host, '', path),

    ['string', 'number', 'string']
    (host, port, path) => getFullUrl('http', host, String(port), path)
);

getUrl('/some/path'); // => 'http://example.com/path'
getUrl('my.example.com', 8080, '/some/path'); // => 'http://my.example.com:8080/somepath'
```
