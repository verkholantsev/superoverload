// @flow

const SUPPORTED_TYPES = toObject(['number', 'string', 'array', 'object', 'function', 'regexp', 'date']);

/**
 * Creates object from array
 *
 * @private
 */
function toObject(elements: Array<string>) {
    return elements.reduce((acc, element) => {
        acc[element] = true;
        return acc;
    }, {});
}

/**
 * Returns unsupported types from function's signature
 */
export default function getUnsupportedTypes(signature: Array<string>) {
    return signature.filter(type => !SUPPORTED_TYPES[type]);
}
