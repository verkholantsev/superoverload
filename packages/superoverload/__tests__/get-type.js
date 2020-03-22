'use strict';

import getType from '../src/get-type';

describe('getType(arg)', () => {
  describe('should return', () => {
    it("typeof arg, if typeof arg !== 'object'", () => {
      [1, 'string', true, () => {}, void 0].forEach(element => {
        expect(getType(element)).toEqual(typeof element);
      });
    });

    it("'array' for array", () => {
      expect(getType([])).toEqual('array');
    });

    it("'object' for object", () => {
      expect(getType({})).toEqual('object');
    });

    it("'null' for null", () => {
      expect(getType(null)).toEqual('null');
    });

    it("'undefined' for undefined", () => {
      expect(getType(undefined)).toEqual('undefined');
    });

    it("'regexp' for regexp", () => {
      expect(getType(/a/)).toEqual('regexp');
    });

    it("'date' for date", () => {
      expect(getType(new Date())).toEqual('date');
    });

    it("'function' for function", () => {
      expect(getType(() => {})).toEqual('function');
    });
  });
});
