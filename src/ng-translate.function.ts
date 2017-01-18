import { Http } from '@angular/http';

import { NgTranslate } from './ng-translate';

export class DoorgetsFunction {

  public static ngTranslateFactory(http: Http) {
      return new NgTranslate(http);
  }

  /* tslint:disable */
  public static equals(o1: any, o2: any): boolean {
    if (o1 === o2) return true;
    if (o1 === null || o2 === null) return false;
    if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
    let t1 = typeof o1, t2 = typeof o2, length: number, key: any, keySet: any;
    if (t1 == t2 && t1 == 'object') {
      if (Array.isArray(o1)) {
        if (!Array.isArray(o2)) return false;
        if ((length = o1.length) == o2.length) {
          for(key = 0; key < length; key++) {
            if (!this.equals(o1[key], o2[key])) return false;
          }
          return true;
        }
      } else {
        if (Array.isArray(o2)) {
            return false;
        }
        keySet = Object.create(null);
        for(key in o1) {
          if (!this.equals(o1[key], o2[key])) {
            return false;
          }
          keySet[key] = true;
        }
        for(key in o2) {
          if (!(key in keySet) && typeof o2[key] !== 'undefined') {
              return false;
          }
        }
        return true;
      }
    }
    return false;
  }
  /* tslint:enable */

  public static isDefined(variable: any): boolean {
    return typeof variable !== 'undefined' && variable !== null && variable !== '';
  }

  public static isUndefined(variable: any): boolean {
    return typeof variable === 'undefined';
  }

  public static isString(variable: any): boolean {
    return typeof variable === 'string';
  }

  public static isNumber(variable: any): boolean {
    return typeof variable === 'number';
  }

  public static isObject(variable: any): boolean {
    return typeof variable === 'object';
  }

  public static isFunction(variable: any): boolean {
    return typeof variable === 'function';
  }

  public static isArray(variable: any): boolean {
    return variable instanceof Array;
  }

  public static inArray(array: any[], variable: any): boolean {
    return array.indexOf(variable) !== -1;
  }

  public static toObject(keys: any[]): Object {
    let object: any = {};
    if (!this.isArray(keys)) {
      return object;
    }

    let arrayLength = keys.length;
    for(let i= 0; i < arrayLength; i++) {
      object[keys[i]] = keys[i];
    }

    return object;
  }

  public static merge(obj1: any, obj2: any): any {
    var obj3: any = {};
    for (var attrname in obj1) {
      if (obj1.hasOwnProperty(attrname)) {
        obj3[attrname] = obj1[attrname];
      }
    }
    for (var attrname2 in obj2) {
      if (obj2.hasOwnProperty(attrname2)) {
        obj3[attrname2] = obj2[attrname2];
      }
    }
    return obj3;
  }
}
