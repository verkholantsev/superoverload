#Superoverload

_Superoverload_ is a function overload for JavaScript.

##Usage

Superoverload expects functions and their signatures as arguments. Like this:

```javascript
var overload = require('superoverload');

var fn = overload(
    ['number'],
    function (a) { return 'It is a number'; },

    ['string'],
    function (a) { return 'It is a string'; }
);

fn(1); // => 'It is a number'
fn(''); // => 'It is a string'
```

You can pass odd number of arguments, then the fisrt will be interpreted as _default_ function. Default means, that it will be called if all over functions do not have corresponding signature.

```javascript
var overload = require('superoverload');

var fn = overload(
    function (a) { return 'It is something else'; },

    ['number'],
    function (a) { return 'It is a number'; }
);

fn(1); // => 'It is a number'
fn(''); // => 'It is something else'
```

##Optional arguments

Superoverload can be used to declare optional arguments.

```javascript
function getFullUrl(protocol, host, port, path) {
    return protocol + '://' + host + (port ? ':' + port : '') + path;
}

var getUrl = overload(
    ['string'],
    function (path) {
        return getFullUrl('http', 'example.com', '', path);
    },

    ['string', 'string'],
    function (host, path) {
        return getFullUrl('http', host, '', path);
    },

    ['string', 'number', 'string']
    function (host, port, path) {
        return getFullUrl('http', host, String(port), path);
    }
);

getUrl('/some/path'); // => 'http://example.com/path'
getUrl('my.example.com', 8080, '/some/path'); // => 'http://my.example.com:8080/somepath'

```
