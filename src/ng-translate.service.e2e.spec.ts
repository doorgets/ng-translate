import {Injector} from "@angular/core";
import {getTestBed, TestBed} from "@angular/core/testing";
import {ResponseOptions, Response, XHRBackend, HttpModule} from "@angular/http";
import {MockBackend, MockConnection} from "@angular/http/testing";

import {
  DoorgetsTranslateService,
  DoorgetsTranslateModule,
  NgTranslate,
  HandlerAbstract,
  HandlerInterface
} from '../index';

import {Observable} from 'rxjs/Observable';

const mockBackendResponse = (connection: MockConnection, response: string) => {
  connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

describe('DoorgetsTranslateService', () => {
  let injector: Injector;
  let backend: MockBackend;
  let translate: DoorgetsTranslateService;
  let connection: MockConnection; // this will be set when a new connection is emitted from the backend.

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, DoorgetsTranslateModule.forRoot()],
      providers: [
        {provide: XHRBackend, useClass: MockBackend}
      ]
    });
    injector = getTestBed();
    backend = injector.get(XHRBackend);
    translate = injector.get(DoorgetsTranslateService);
    // sets the connection when someone tries to access the backend with an xhr request
    backend.connections.subscribe((c: MockConnection) => connection = c);
  });

  afterEach(() => {
    injector = undefined;
    backend = undefined;
    translate = undefined;
    connection = undefined;
  });

  it('is defined', () => {
    expect(DoorgetsTranslateService).toBeDefined();
    expect(translate).toBeDefined();
    expect(translate instanceof DoorgetsTranslateService).toBeTruthy();
  });

  it('is configuration ok', () => {

    let config = {
      languages: ['en','fr'],
      current: 'fr',
      default: 'en'
    };

    translate.init(config);

    expect(translate.getConfig().languages).toEqual(['en','fr']);
    expect(translate.getConfig().current).toEqual('fr');
    expect(translate.getConfig().default).toEqual('en');
  });

  it('should add language', () => {

    let config = {
      languages: ['en','fr'],
      current: 'fr',
      default: 'en'
    };

    translate.init(config);

    translate.add(['es']);

    expect(translate.getConfig().languages).toEqual(['en','fr','es']);
    expect(translate.getConfig().current).toEqual('fr');
    expect(translate.getConfig().default).toEqual('en');
  });

  it('should set default', () => {

    let config = {
      languages: ['en','fr'],
      current: 'fr',
      default: 'en'
    };

    translate.init(config);

    expect(translate.getConfig().default).toEqual('en');

    translate.setDefault('fr');

    expect(translate.getConfig().default).toEqual('fr');
  });

  it('should return key when value is empty', () => {
      translate.setCurrent('en');
      mockBackendResponse(connection, '{"empty": ""}');

      translate.get('empty').subscribe((res: string) => {
          expect(res).toEqual('empty');
      });
  });

  it('should be able to change current language', () => {
    translate.setCurrent('en');

    expect(translate.getConfig().current).toEqual('en');

    mockBackendResponse(connection, '{"Are you ready?": "Êtes-vous prêt ?", "No": "Non", "Yes": "Oui"}');

    translate.setCurrent('fr');
    expect(translate.getConfig().current).toEqual('fr');

    mockBackendResponse(connection, '{"Are you ready?": "Êtes-vous prêt ?", "No": "Non", "Yes": "Oui"}');

    translate.setCurrent('fr');
    expect(translate.getConfig().current).toEqual('fr');

  });

  it('should be able to get translations by sentence', () => {
    translate.setCurrent('fr');

    translate.get('Are you ready?').subscribe((res: string) => {
      expect(res).toEqual('Êtes-vous prêt ?');
    });

    mockBackendResponse(connection, '{"Are you ready?": "Êtes-vous prêt ?", "No": "Non", "Yes": "Oui"}');

    translate.get('No').subscribe((res: string) => {
      expect(res).toEqual('Non');
    });

    translate.get('Yes').subscribe((res: string) => {
      expect(res).toEqual('Oui');
    });
  });

  it('should be return searchKey if searchKey not found', () => {
    translate.setCurrent('fr');

    translate.get('NOTFOUND').subscribe((res: string) => {
      expect(res).toEqual('NOTFOUND');
    });

    mockBackendResponse(connection, '{}');
  });

  it("should return the searchKey when you haven't defined any translation", () => {
      translate.get('NOTFOUND').subscribe((res: string) => {
          expect(res).toEqual('NOTFOUND');
      });
  });

  it('should throw if you forget the searchKey', () => {
    translate.setCurrent('en');

    expect(() => translate.get(undefined)).toThrowError('Parameter "searchKey" required');
    expect(() => translate.get('')).toThrowError('Parameter "searchKey" required');
    expect(() => translate.get(null)).toThrowError('Parameter "searchKey" required');
    expect(() => translate.instant(undefined)).toThrowError('Parameter "searchKey" required');
  });

  it('should be able to reload a lang', () => {
      translate.setCurrent('fr');

      // this will request the translation from the backend because we use a static files loader for TranslateService
      translate.get('TEST').subscribe((res: string) => {
          expect(res).toEqual('This is a test');

          // reset the lang as if it was never initiated
          translate.reload('fr').subscribe((res2: string) => {
              expect(translate.instant('TEST')).toEqual('This is a test 2');
          });

          mockBackendResponse(connection, '{"TEST": "This is a test 2"}');
      });

      // mock response after the xhr request, otherwise it will be undefined
      mockBackendResponse(connection, '{"TEST": "This is a test"}');
  });

  it('should be able to get translations with params', () => {
    translate.setCurrent('fr');

    translate.get('Hello $0', ['Moon']).subscribe((res: string) => {
      expect(res).toEqual('Salut Moon');
    });

    mockBackendResponse(connection, '{"Hello $0": "Salut $0", "My name is $0 I like coding with $1": "Je m\'appelle $0 j\'aime coder avec $1"}');

    translate.get('My name is $0 I like coding with $1', ['Moon', 'AngularJS']).subscribe((res: string) => {
      expect(res).toEqual('Je m\'appelle Moon j\'aime coder avec AngularJS');
    });
  });

  it('should be able to get translations with plural params', () => {
    translate.setCurrent('fr');

    mockBackendResponse(connection, '{"I have [($0|$0 apple|$0 apples)] in 2 [($1|$1 bag|$1 bags)]": "J\'ai [($0|$0 pomme|$0 pommes)] dans [($1|$1 sac|$1 sacs)]"}');

    translate.get('I have [($0|$0 apple|$0 apples)] in 2 [($1|$1 bag|$1 bags)]', [1, 1]).subscribe((res: string) => {
      expect(res).toEqual('J\'ai 1 pomme dans 1 sac');
    });

    translate.get('I have [($0|$0 apple|$0 apples)] in 2 [($1|$1 bag|$1 bags)]', [1, 2]).subscribe((res: string) => {
      expect(res).toEqual('J\'ai 1 pomme dans 2 sacs');
    });

    translate.get('I have [($0|$0 apple|$0 apples)] in 2 [($1|$1 bag|$1 bags)]', [2, 2]).subscribe((res: string) => {
      expect(res).toEqual('J\'ai 2 pommes dans 2 sacs');
    });

    translate.get('I have [($0|$0 apple|$0 apples)] in 2 [($1|$1 bag|$1 bags)]', [2, 1]).subscribe((res: string) => {
      expect(res).toEqual('J\'ai 2 pommes dans 1 sac');
    });
  });

  it('should be able to get translations with plural params from short searchKey', () => {
    translate.setCurrent('fr');

    mockBackendResponse(connection, '{"k1": "J\'ai [($0|$0 pomme|$0 pommes)] dans [($1|$1 sac|$1 sacs)]"}');

    translate.get('k1', [1, 1]).subscribe((res: string) => {
      expect(res).toEqual('J\'ai 1 pomme dans 1 sac');
    });

    translate.get('k1', [1, 2]).subscribe((res: string) => {
      expect(res).toEqual('J\'ai 1 pomme dans 2 sacs');
    });

    translate.get('k1', [2, 2]).subscribe((res: string) => {
      expect(res).toEqual('J\'ai 2 pommes dans 2 sacs');
    });

    translate.get('k1', [2, 1]).subscribe((res: string) => {
      expect(res).toEqual('J\'ai 2 pommes dans 1 sac');
    });
  });

  it('should be able to get translations in instant', () => {
    translate.setCurrent('fr');

    let res = translate.instant('Are you ready?');
    expect(res).toEqual('Are you ready?');

    mockBackendResponse(connection, '{"Are you ready?": "Êtes-vous prêt ?", "No": "Non", "Yes": "Oui"}');

    res = translate.instant('No');
    expect(res).toEqual('Non');

    res = translate.instant('Yes');
    expect(res).toEqual('Oui');

    res = translate.instant('Yes');
    expect(res).toEqual('Oui');
  });

  it('should be able to get translations in instant', () => {
    translate.setCurrent('fr');
    mockBackendResponse(connection, '{"Are you ready?": "Êtes-vous prêt ?", "No": "Non", "Yes": "Oui"}');

    expect(translate.instant('notfound')).toEqual('notfound');
  });

  it('should be output translated sentence', () => {
    translate.setCurrent('fr');

    let translations = {"Are you ready?": "Êtes-vous prêt ?", "No": "Non", "Yes": "Oui"};
    let searchKey = 'Are you ready?';
    let res = translate.output(searchKey, translations);
    expect(res).toEqual('Êtes-vous prêt ?');
  });
});

describe('MissingTranslationHandler', () => {
    let injector: Injector;
    let backend: MockBackend;
    let translate: DoorgetsTranslateService;
    let connection: MockConnection; // this will be set when a new connection is emitted from the backend.
    let missingTranslationHandler: HandlerAbstract;

    class Missing implements HandlerAbstract {
        handle(params: HandlerInterface) {
            return "handled";
        }
    }

    class MissingObs implements HandlerAbstract {
        handle(params: HandlerInterface): Observable<any> {
            return Observable.of(`handled: ${params.searchKey}`);
        }
    }

    let prepare = ((handlerClass: Function) => {
        TestBed.configureTestingModule({
            imports: [HttpModule, DoorgetsTranslateModule.forRoot()],
            providers: [
                { provide: HandlerAbstract, useClass: handlerClass },
                { provide: XHRBackend, useClass: MockBackend }
            ]
        });
        injector = getTestBed();
        backend = injector.get(XHRBackend);
        translate = injector.get(DoorgetsTranslateService);
        missingTranslationHandler = injector.get(HandlerAbstract);
        // sets the connection when someone tries to access the backend with an xhr request
        backend.connections.subscribe((c: MockConnection) => connection = c);
    });

    afterEach(() => {
        injector = undefined;
        backend = undefined;
        translate = undefined;
        connection = undefined;
        missingTranslationHandler = undefined;
    });

    it('should use the MissingTranslationHandler when the key does not exist', () => {
        prepare(Missing);
        translate.setCurrent('en');
        spyOn(missingTranslationHandler, 'handle').and.callThrough();

        translate.get('nonExistingKey').subscribe((res: string) => {
            expect(missingTranslationHandler.handle).toHaveBeenCalledWith(jasmine.objectContaining({ searchKey: 'nonExistingKey' }));
            //test that the instance of the last called argument is string
            expect(res).toEqual('handled');
        });

        // mock response after the xhr request, otherwise it will be undefined
        mockBackendResponse(connection, '{"TEST": "This is a test"}');
    });

    it('should propagate interpolation params when the key does not exist', () => {
        prepare(Missing);
        translate.setCurrent('en');
        spyOn(missingTranslationHandler, 'handle').and.callThrough();
        let params = ['Moon'];

        translate.get('nonExistingKey', params).subscribe((res: string) => {
            expect(res).toEqual('handled');
        });

        // mock response after the xhr request, otherwise it will be undefined
        mockBackendResponse(connection, '{"TEST": "This is a test"}');
    });

    it('should propagate TranslationService params when the key does not exist', () => {
        prepare(Missing);
        translate.setCurrent('en');
        spyOn(missingTranslationHandler, 'handle').and.callThrough();

        translate.get('nonExistingKey').subscribe((res: string) => {
            expect(missingTranslationHandler.handle).toHaveBeenCalledWith(jasmine.objectContaining({ translateService: translate }));
            //test that the instance of the last called argument is string
            expect(res).toEqual('handled');
        });

        // mock response after the xhr request, otherwise it will be undefined
        mockBackendResponse(connection, '{"TEST": "This is a test"}');
    });

    it('should return the key when using MissingTranslationHandler & the handler returns nothing', () => {
        class MissingUndef implements HandlerAbstract {
            handle(params: HandlerInterface) {
            }
        }

        prepare(MissingUndef);
        translate.setCurrent('en');
        spyOn(missingTranslationHandler, 'handle').and.callThrough();

        translate.get('nonExistingKey').subscribe((res: string) => {
            expect(missingTranslationHandler.handle).toHaveBeenCalledWith(jasmine.objectContaining({ searchKey: 'nonExistingKey' }));
            expect(res).toEqual('nonExistingKey');
        });

        // mock response after the xhr request, otherwise it will be undefined
        mockBackendResponse(connection, '{"TEST": "This is a test"}');
    });

});

describe('TranslateLoader', () => {
    let injector: Injector;
    let backend: MockBackend;
    let translate: DoorgetsTranslateService;
    let connection: MockConnection; // this will be set when a new connection is emitted from the backend.

    var prepare = (_injector: Injector) => {
        backend = _injector.get(XHRBackend);
        translate = _injector.get(DoorgetsTranslateService);
        // sets the connection when someone tries to access the backend with an xhr request
        backend.connections.subscribe((c: MockConnection) => connection = c);
    };

    it('should be able to provide TranslateStaticLoader', () => {
        TestBed.configureTestingModule({
            imports: [HttpModule, DoorgetsTranslateModule.forRoot()],
            providers: [
                {provide: XHRBackend, useClass: MockBackend}
            ]
        });
        injector = getTestBed();
        prepare(injector);

        expect(translate).toBeDefined();
        expect(translate.ngTranslate).toBeDefined();
        expect(translate.ngTranslate instanceof NgTranslate).toBeTruthy();

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.setCurrent('en');

        // this will request the translation from the backend because we use a static files loader for TranslateService
        translate.get('TEST').subscribe((res: string) => {
            expect(res).toEqual('This is a test');
        });

        // mock response after the xhr request, otherwise it will be undefined
        mockBackendResponse(connection, '{"TEST": "This is a test"}');
    });
});
