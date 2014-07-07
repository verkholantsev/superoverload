'use strict';

module.exports = getType;

/**
 * Возвращает нормализованный тип объекта
 *
 * @param {*} arg
 * @return {string}
 */
function getType(arg) {
    return ({}).toString.call(arg).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}
