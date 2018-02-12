'use strict';

import expect from 'must';
import getType from '../src/lib/getType';

describe('getType(arg)', () => {
    describe('should return', () => {
        it("typeof arg, if typeof arg !== 'object'", () => {
            [1, 'string', true, () => {}, void 0].forEach(element => {
                expect(getType(element)).to.be.eql(typeof element);
            });
        });

        it("'array' for array", () => {
            expect(getType([])).to.be.eql('array');
        });

        it("'object' for object", () => {
            expect(getType({})).to.be.eql('object');
        });

        it("'null' for null", () => {
            expect(getType(null)).to.be.eql('null');
        });

        it("'undefined' for undefined", () => {
            expect(getType(undefined)).to.be.eql('undefined');
        });

        it("'regexp' for regexp", () => {
            expect(getType(/a/)).to.be.eql('regexp');
        });

        it("'date' for date", () => {
            expect(getType(new Date())).to.be.eql('date');
        });

        it("'function' for function", () => {
            expect(getType(() => {})).to.be.eql('function');
        });
    });
});
