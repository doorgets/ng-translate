import {DoorgetsTranslatePipe} from './ng-translate.pipe';
import {DoorgetsTranslateService, DoorgetsTranslateModule} from "./../index";
import {ResponseOptions, Response, XHRBackend, HttpModule} from "@angular/http";
import {
    Component, Injector, ChangeDetectorRef, ChangeDetectionStrategy, Injectable,
    ViewContainerRef
} from "@angular/core";
// import {any, any} from "./ng-translate.service";
import {getTestBed, TestBed} from "@angular/core/testing";
import {MockConnection, MockBackend} from "@angular/http/testing";

class FakeChangeDetectorRef extends ChangeDetectorRef {
    markForCheck(): void {}

    detach(): void {}

    detectChanges(): void {}

    checkNoChanges(): void {}

    reattach(): void {}
}

@Injectable()
@Component({
    selector: 'hmx-app',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `{{'Are you ready?' | dgTranslate}}`
})
class App {
    viewContainerRef: ViewContainerRef;

    constructor(viewContainerRef: ViewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
}

const mockBackendResponse = (connection: MockConnection, response: string) => {
    connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

describe('DoorgetsTranslatePipe', () => {
    let injector: Injector;
    let backend: MockBackend;
    let translate: DoorgetsTranslateService;
    let connection: MockConnection;
    let translatePipe: DoorgetsTranslatePipe;
    let ref: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, DoorgetsTranslateModule.forRoot()],
            declarations: [App],
            providers: [
                {provide: XHRBackend, useClass: MockBackend}
            ]
        });
        injector = getTestBed();
        backend = injector.get(XHRBackend);
        translate = injector.get(DoorgetsTranslateService);

        backend.connections.subscribe((c: MockConnection) => {
          connection = c;
        });

        ref = new FakeChangeDetectorRef();
        translatePipe = new DoorgetsTranslatePipe(translate, ref);
    });

    afterEach(() => {
        injector = undefined;
        backend = undefined;
        translate = undefined;
        connection = undefined;
        translatePipe = undefined;
        ref = undefined;
    });

    it('is defined', () => {
        expect(DoorgetsTranslatePipe).toBeDefined();
        expect(translatePipe).toBeDefined();
        expect(translatePipe instanceof DoorgetsTranslatePipe).toBeTruthy();
    });

    it('should translate a string', () => {
        translate.setCurrent('fr');

        mockBackendResponse(connection, '{"Are you ready?": "Êtes-vous prêt ?", "No": "Non", "Yes": "Oui"}');

        expect(translatePipe.transform('Are you ready?')).toEqual("Êtes-vous prêt ?");
        expect(translatePipe.transform('No')).toEqual("Non");
        expect(translatePipe.transform('Yes')).toEqual("Oui");
    });

    it('should update the value when the parameters change', () => {
        translate.setCurrent('fr');

        mockBackendResponse(connection, '{"Hello $0": "Salut $0", "My name is $0 I like coding with $1": "Je m\'appelle $0 j\'aime coder avec $1"}');

        spyOn(translatePipe, 'doTranslate').and.callThrough();
        spyOn(translatePipe, 'doUpdate').and.callThrough();
        spyOn(translatePipe, 'watchEvent').and.callThrough();
        spyOn(translatePipe, 'doUpdateEvent').and.callThrough();

        spyOn(ref, 'markForCheck').and.callThrough();

        expect(translatePipe.transform('Hello $0', ['Moon'])).toEqual("Salut Moon");
        // same value, shouldn't call 'doTranslate' again
        expect(translatePipe.transform('Hello $0', ['Moon'])).toEqual("Salut Moon");
        expect(translatePipe.transform('Hello $0', ['Moon'])).toEqual("Salut Moon");
        expect(translatePipe.transform('Hello $0', ['Moon'])).toEqual("Salut Moon");
        // different param, should call 'doTranslate'
        expect(translatePipe.transform('Hello $0', ['Moon Air'])).toEqual("Salut Moon Air");

        expect(translatePipe.doTranslate).toHaveBeenCalledTimes(2);
        expect(translatePipe.doUpdate).toHaveBeenCalledTimes(2);
        expect(translatePipe.watchEvent).toHaveBeenCalledTimes(2);
        expect(translatePipe.doUpdateEvent).toHaveBeenCalledTimes(0);

        expect(ref.markForCheck).toHaveBeenCalledTimes(2);
    });

    it('should be able to get translations with params', () => {
        translate.setCurrent('fr');

        mockBackendResponse(connection, '{"Hello $0": "Salut $0", "My name is $0 I like coding with $1": "Je m\'appelle $0 j\'aime coder avec $1"}');

        expect(translatePipe.transform('Hello $0', 'Moon')).toEqual("Salut Moon");
        expect(translatePipe.transform('My name is $0 I like coding with $1', 'Moon', 'Angular 2')).toEqual("Je m\'appelle Moon j\'aime coder avec Angular 2");
    });

    it('should be able to get translations with plural one block', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0)]": "[($0)]"}');

      expect(translatePipe.transform('[($0)]', 1)).not.toEqual('[($0)]');
      expect(translatePipe.transform('[($0)]', 1)).toEqual('1');
    });

    it('should be able to get translations with plural two block', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0|$0 items)]": "[($0|$0 items)]"}');

      expect(translatePipe.transform('[($0|$0 items)]', 1)).not.toEqual('[($0|$0 items)]');
      expect(translatePipe.transform('[($0|$0 items)]', 1)).toEqual('1 items');
    });

    it('should be able to get translations with plural three block', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0|$0 item|$0 items)]": "[($0|$0 item|$0 items)]"}');

      expect(translatePipe.transform('[($0|$0 item|$0 items)]', 1)).not.toEqual('[($0|$0 item|$0 items)]');
      expect(translatePipe.transform('[($0|$0 item|$0 items)]', 1)).toEqual('1 item');
    });

    it('should be able to get translations with plural four block', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0|$0 item|$0 items|Not yet items)]": "[($0|$0 item|$0 items|Not yet items)]"}');

      expect(translatePipe.transform('[($0|$0 item|$0 items|Not yet items)]', 1)).not.toEqual('[($0|$0 item|$0 items|Not yet items)]');
      expect(translatePipe.transform('[($0|$0 item|$0 items|Not yet items)]', 1)).toEqual('1 item');
    });

    it('should be able to get translations with plural one block for 0', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0)]": "[($0)]"}');

      expect(translatePipe.transform('[($0)]', 0)).not.toEqual('[($0)]');
      expect(translatePipe.transform('[($0)]', 0)).toEqual('0');

    });

    it('should be able to get translations with plural two block for 0', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0|$0 items)]": "[($0|$0 items)]"}');

      expect(translatePipe.transform('[($0|$0 items)]', 0)).not.toEqual('[($0|$0 items)]');
      expect(translatePipe.transform('[($0|$0 items)]', 0)).toEqual('0 items');
    });

    it('should be able to get translations with plural three block for 0', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0|$0 item|$0 items)]": "[($0|$0 item|$0 items)]"}');

      expect(translatePipe.transform('[($0|$0 item|$0 items)]', 0)).not.toEqual('[($0|$0 item|$0 items)]');
      expect(translatePipe.transform('[($0|$0 item|$0 items)]', 0)).toEqual('0 item');
    });

    it('should be able to get translations with plural four block for 0', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0|$0 item|$0 items|Not yet items)]": "[($0|$0 item|$0 items|Not yet items)]"}');

      expect(translatePipe.transform('[($0|$0 item|$0 items|Not yet items)]', 0)).not.toEqual('[($0|$0 item|$0 items|Not yet items)]');
      expect(translatePipe.transform('[($0|$0 item|$0 items|Not yet items)]', 0)).toEqual('Not yet items');
    });

    it('should be able to get translations with plural two block for string', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0|$0 items)]": "[($0|$0 items)]"}');

      expect(translatePipe.transform('[($0|$0 items)]', ' ')).not.toEqual('[($0|$0 items)]');
      expect(translatePipe.transform('[($0|$0 items)]', ' ')).toEqual('  items');
    });

    it('should be able to get translations with plural three block for string', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0|$0 item|$0 items)]": "[($0|$0 item|$0 items)]"}');

      expect(translatePipe.transform('[($0|$0 item|$0 items)]', ' ')).not.toEqual('[($0|$0 item|$0 items)]');
      expect(translatePipe.transform('[($0|$0 item|$0 items)]', ' ')).toEqual('0 item');
    });

    it('should be able to get translations with plural four block for string', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0|$0 item|$0 items|Not yet items)]": "[($0|$0 item|$0 items|Not yet items)]"}');

      expect(translatePipe.transform('[($0|$0 item|$0 items|Not yet items)]', ' ')).not.toEqual('[($0|$0 item|$0 items|Not yet items)]');
      expect(translatePipe.transform('[($0|$0 item|$0 items|Not yet items)]', ' ')).toEqual('Not yet items');
    });

    it('should call markForCheck when it translates a string', () => {
      translate.setCurrent('fr');
      mockBackendResponse(connection, '{"Hello": "Salut"}');
      spyOn(ref, 'markForCheck').and.callThrough();

      translatePipe.transform('Hello');
      expect(ref.markForCheck).toHaveBeenCalled();
    });

    it('should detect changes with OnPush', () => {
        let fixture = (<any>TestBed).createComponent(App);
        fixture.detectChanges();
        expect(fixture.debugElement.nativeElement.innerHTML).toEqual("Are you ready?");
        translate.setCurrent('fr');
        mockBackendResponse(connection, '{"Are you ready?": "Êtes-vous prêt ?"}');
        fixture.detectChanges();
        expect(fixture.debugElement.nativeElement.innerHTML).toEqual("Êtes-vous prêt ?");
    });
});
