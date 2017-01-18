import {DoorgetsFunction} from "./../index";
import {Component} from "@angular/core";
import {Http} from "@angular/http";


@Component({
    selector: 'hmx-app'
})
class App {
}

describe('DoorgetsFunction', () => {
    let http: Http;

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('should be defined ngTranslateFactory' , () => {
      expect(DoorgetsFunction.ngTranslateFactory(http)).toBeDefined();
    });

    it('should be equals' , () => {
      expect(DoorgetsFunction.equals(null, null)).toBeTruthy();
      expect(DoorgetsFunction.equals({}, {})).toBeTruthy();
      expect(DoorgetsFunction.equals('hello', 'hello')).toBeTruthy();
      expect(DoorgetsFunction.equals({h: 'hello'}, {h: 'hello'})).toBeTruthy();
    });

    it('should be isDefined null' , () => {
      expect(DoorgetsFunction.isDefined(null)).toBeFalsy();
    });


    it('should be isDefined with undefined' , () => {
      expect(DoorgetsFunction.isDefined(undefined)).toBeFalsy();
    });

    it('should be isDefined with string' , () => {
      expect(DoorgetsFunction.isDefined('string')).toBeTruthy();
    });

    it('should be isDefined with empty string' , () => {
      expect(DoorgetsFunction.isDefined('')).toBeFalsy();
    });

    it('should be isUndefined' , () => {
      expect(DoorgetsFunction.isUndefined(undefined)).toBeTruthy();
    });

    it('should be isNumber' , () => {
      expect(DoorgetsFunction.isNumber(0)).toBeTruthy();
    });

    it('should be isString' , () => {
      expect(DoorgetsFunction.isString('undefined')).toBeTruthy();
    });

    it('should be isObject' , () => {
      expect(DoorgetsFunction.isObject({})).toBeTruthy();
    });

    it('should be isFunction' , () => {
      expect(DoorgetsFunction.isFunction(() => {})).toBeTruthy();
    });

    it('should be isArray' , () => {
      expect(DoorgetsFunction.isArray(['translate'])).toBeTruthy();
      expect(DoorgetsFunction.isArray(null)).toBeFalsy();
      expect(DoorgetsFunction.isArray({})).toBeFalsy();
      expect(DoorgetsFunction.isArray('')).toBeFalsy();
      expect(DoorgetsFunction.isArray(123)).toBeFalsy();
    });

    it('should be inArray' , () => {
      expect(DoorgetsFunction.inArray(['translate'], 'translate')).toBeTruthy();
      expect(DoorgetsFunction.inArray(['translate', 'abc'], 'notfound')).toBeFalsy();
    });

    it('should be array to object' , () => {
      expect(DoorgetsFunction.toObject([])).toEqual({});
      expect(DoorgetsFunction.toObject(['hello'])).toEqual({hello: 'hello'});
    });

    it('should be merge object' , () => {
      expect(DoorgetsFunction.merge({k:'k'}, {v: 'v'})).toEqual({k: 'k', v: 'v'});
      expect(DoorgetsFunction.merge({}, {v: 'v'})).toEqual({v: 'v'});
      expect(DoorgetsFunction.merge('', {v: 'v'})).toEqual({v: 'v'});
    });
});



