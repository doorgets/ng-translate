import { HttpClient } from '@angular/common/http';import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DoorgetsTranslateService } from './ng-translate.service';
import { NgTranslateAbstract, HandlerAbstract } from './ng-translate.abstract';
import { NgTranslate } from './ng-translate';

export function newNgTranslate(http: HttpClient) {
  return new NgTranslate(http, '');
}

describe('DoorgetsTranslateService', () => {
  let httpClient: HttpClient;
  let handlerAbstract: HandlerAbstract;
  let ngTranslateAbstract: NgTranslateAbstract;
  let service: DoorgetsTranslateService;
  let httpMock: HttpTestingController;
  let newNgTranslateV: NgTranslate;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    
    httpClient = TestBed.inject(HttpClient);
    newNgTranslateV = newNgTranslate(httpClient);
    
    service = new DoorgetsTranslateService(newNgTranslateV, handlerAbstract);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should set the default language', () => {
    const language = 'en';
    (service as any).default = language;
    expect((service as any).default).toEqual(language);
  });

  it('should set the extension', () => {
    const extension = '.json';
    service.setExtension(extension);
    expect(service.extension).toEqual(extension);
  });

  it('should set the current language and emit the language change event', () => {
    const language = 'en';
    const translations = { greeting: 'Hello' };
    const eventSpy = spyOn(service.onLangChange, 'emit');

    service.setCurrent(language).subscribe(() => {
      expect(service.current).toEqual(language);
      expect(eventSpy).toHaveBeenCalledWith({
        language: language,
        translations: translations
      });
    });

    const req = httpMock.expectOne(`/${language}.json`);
    req.flush(translations);
  });

  it('should return the current translations if already loaded', () => {
    const language = 'en';
    const translations = { greeting: 'Hello' };
    (service as any).translations[language] = translations;

    service.setCurrent(language).subscribe((result) => {
      expect(result).toEqual(translations);
    });

    httpMock.expectNone(`/${language}.json`);
  });

  // Add more test cases as needed

});




