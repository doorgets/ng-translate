import { DoorgetsParser } from './ng-translate.parser';

describe('DoorgetsParser', () => {
  let parser: DoorgetsParser;

  beforeEach(() => {
    parser = new DoorgetsParser();
  });

  it('is defined', () => {
    expect(DoorgetsParser).toBeDefined();
    expect(parser instanceof DoorgetsParser).toBeTruthy();
  });

  it('should interpolate', () => {
      expect(parser.interpolate("Hello")).toEqual("Hello");
      expect(parser.interpolate("Hello $0", ['Moon'])).toEqual("Hello Moon");
      expect(parser.interpolate("Hello $0 my name is $1", ['Moon', 'Air'])).toEqual("Hello Moon my name is Air");
  });

  it('should get value from key', () => {
     expect(parser.getValue({key1: {key2: "value2"}}, 'key1.key2')).toEqual("value2");
  });
});
